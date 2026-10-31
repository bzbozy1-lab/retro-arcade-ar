const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const source=fs.readFileSync('assets/mobile-nav.js','utf8');
function setup(page='home'){
 const events={},windowEvents={},classes=new Set(),attrs={};let focused=false;
 const header={id:'',inert:false,classList:{toggle:(k,v)=>v?classes.add(k):classes.delete(k)},setAttribute:(k,v)=>attrs[k]=v,removeAttribute:k=>delete attrs[k],contains:x=>x===header};
 const span={},trigger={setAttribute:(k,v)=>attrs['button-'+k]=v,querySelector:()=>span,addEventListener:(k,v)=>events['button-'+k]=v,contains:x=>x===trigger,focus:()=>{focused=true;}};
 const media={matches:true,addEventListener:(k,v)=>events.resize=v};
 const document={readyState:'complete',body:{dataset:{page},insertBefore(){},classList:{add(){}}},querySelector:s=>s==='header.nav'?header:null,createElement:()=>trigger,addEventListener:(k,v)=>events[k]=v};
 const window={scrollY:0,matchMedia:()=>media,addEventListener:(k,v)=>windowEvents[k]=v};vm.runInNewContext(source,{document,window});return{events,windowEvents,window,header,trigger,media,attrs,get focused(){return focused;}};
}
test('mobile disclosure hides inaccessible navigation, opens, closes with Escape and restores focus',()=>{const s=setup();assert.equal(s.header.inert,true);s.events['button-click']();assert.equal(s.header.inert,false);assert.equal(s.attrs['button-aria-expanded'],'true');s.events.keydown({key:'Escape',preventDefault(){}});assert.equal(s.header.inert,true);assert.equal(s.focused,true);});
test('page scroll closes menu, desktop resize restores accessible navigation',()=>{const s=setup();s.events['button-click']();s.window.scrollY=40;s.windowEvents.scroll();assert.equal(s.header.inert,true);s.media.matches=false;s.events.resize();assert.equal(s.header.inert,false);assert.equal(s.trigger.hidden,true);assert.equal(s.attrs['aria-hidden'],undefined);});
test('magazine and reader pages are excluded',()=>{for(const page of ['magazines','reader'])assert.equal(Object.keys(setup(page).events).length,0);});
