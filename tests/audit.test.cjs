const {test} = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const source = name => fs.readFileSync(path.join(__dirname, '..', name), 'utf8');

test('catalog covers every library and independent gem, without ambiguous runtime searches', () => {
  const document = {body:{dataset:{page:'audit'}}, querySelector:()=>null, querySelectorAll:()=>[], addEventListener:()=>{}, dispatchEvent:()=>{}};
  const context = {document, URLSearchParams, location:{search:''}};
  context.window = context;
  vm.createContext(context);
  vm.runInContext(source('assets/catalog.js'), context);
  vm.runInContext(source('assets/app.js'), context);
  const result = vm.runInContext('({library:getGames(),gems:GEM_GAMES})', context);
  assert.equal(result.library.length,104);
  assert.equal(result.gems.length,57);
  for (const name of [...result.library.map(x=>x.name), ...result.gems]) {
    const r = context.CARTO_CATALOG[name];
    assert.ok(r?.image, name);
    assert.match(r.source,/^https:\/\/en\.wikipedia\.org\/wiki\//);
    assert.match(r.image,/^https:\/\/(thumb|upload)\.wikimedia\.org\//);
    assert.ok(r.release && r.developer, name);
  }
  for (const name of ['Black','Deadpool','X-Men Origins: Wolverine','Kingdom Hearts','Tearaway','Sleeping Dogs']) {
    assert.match(decodeURIComponent(context.CARTO_CATALOG[name].source), /video_game/);
  }
  assert.equal(context.CARTO_CATALOG['LittleBigPlanet'].sourceTitle,'LittleBigPlanet PS Vita');
  assert.ok(!source('assets/app.js').includes('fetchThumb'));
});

test('all pages use consistent navigation, safe internal paths and a single appearance owner', () => {
  const root=path.join(__dirname,'..');
  const navs=[];
  for(const file of fs.readdirSync(root).filter(f=>f.endsWith('.html'))){
    const html=source(file);
    const nav=html.match(/<nav class="navlinks"[^>]*>(.*?)<\/nav>/s)[1];
    navs.push(nav.replace(/class="active" aria-current="page" /g,'').replace(/<a href="sakhr\.html">بوابة صخر<\/a>/g,''));
    if(!['magazines.html','reader.html'].includes(file)) assert(nav.includes('href="sakhr.html"'),file+': Sakhr navigation');
    const markup=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,'');
    for(const match of markup.matchAll(/(?:src|href)="([^"#]+)"/g)){
      const url=match[1]; if(/^(https?:|data:)/.test(url))continue;
      assert.ok(fs.existsSync(path.join(root,url.split(/[?#]/)[0])),file+': '+url);
    }
    assert.equal((html.match(/assets\/theme\.js/g)||[]).length,1,file);
    assert.ok(!html.includes('CARTO appearance preference'),file);
    assert.match(html,/assets\/audit-fixes\.css/);
  }
  assert.equal(new Set(navs).size,1);
  assert.ok(!source('reference.html').includes('id="gameSearch"'));
  assert.ok(!source('index.html').includes('الذوق المعهود'));
  assert.ok(!source('assets/app.js').includes('RETRO ARCADE'));
});

test('theme updates its next action, pressed state and storage on every toggle', () => {
  let button;
  const values=new Map([['carto-appearance','dark']]);
  const attrs={};
  const root={getAttribute:k=>attrs[k],setAttribute:(k,v)=>attrs[k]=v};
  const nav={appendChild:el=>{button=el}};
  const document={readyState:'complete',documentElement:root,
    querySelector:sel=>sel==='.navin'?nav:sel==='.nav .appearance-toggle'?button:sel==='.appearance-toggle'?{preview:true}:null,
    createElement:()=>({attrs:{},setAttribute(k,v){this.attrs[k]=v},addEventListener(k,fn){this[k]=fn}})};
  const context={document,localStorage:{getItem:k=>values.get(k),setItem:(k,v)=>values.set(k,v)}};
  vm.runInNewContext(source('assets/theme.js'),context);
  assert.equal(button.attrs['aria-label'],'التبديل إلى المظهر الفاتح');
  for(const theme of ['light','dark','light']){
    button.click();
    assert.equal(attrs['data-theme'],theme);
    assert.equal(values.get('carto-appearance'),theme);
    assert.equal(button.attrs['aria-pressed'],String(theme==='dark'));
    assert.equal(button.attrs['aria-label'],theme==='dark'?'التبديل إلى المظهر الفاتح':'التبديل إلى المظهر الداكن');
  }
});

test('dialog traps forward/backward Tab, restores focus and preserves existing inert state', async () => {
  const handlers={};
  let document;
  const element=(button=false)=>({inert:false,hidden:false,isConnected:true,dataset:{},tabIndex:button?0:-1,
    classList:{add(){},remove(){}},setAttribute(){},matches(){return button},getClientRects:()=>[{}],
    closest:()=>null,focus(){document.activeElement=this}});
  const opener=element(true),main=element(),alreadyInert=element(),dialog=element();
  alreadyInert.inert=true;
  const first=element(true),last=element(true);
  dialog.querySelector=()=>first;
  dialog.querySelectorAll=()=>[first,last];
  dialog.contains=el=>el===first||el===last||el===dialog;
  document={activeElement:opener,body:{children:[main,alreadyInert,dialog],style:{overflow:'auto'}},
    querySelector:()=>main,querySelectorAll:()=>[],dispatchEvent(){},
    addEventListener:(name,fn)=>{handlers[name]=fn}};
  const context={document,window:{},queueMicrotask,CustomEvent:class{}};
  vm.runInNewContext(source('assets/dialog.js'),context);
  context.window.CartoDialog.open(dialog);
  assert.equal(document.activeElement,first);
  assert.equal(main.inert,true);
  assert.equal(document.body.style.overflow,'hidden');
  let prevented=false;
  last.focus();handlers.keydown({key:'Tab',preventDefault(){prevented=true}});
  assert.equal(prevented,true);assert.equal(document.activeElement,first);
  handlers.keydown({key:'Tab',shiftKey:true,preventDefault(){}});
  assert.equal(document.activeElement,last);
  handlers.keydown({key:'Escape',preventDefault(){},stopImmediatePropagation(){}});
  await new Promise(resolve=>queueMicrotask(resolve));
  assert.equal(dialog.hidden,true);assert.equal(main.inert,false);assert.equal(alreadyInert.inert,true);
  assert.equal(document.activeElement,opener);assert.equal(document.body.style.overflow,'auto');
});

