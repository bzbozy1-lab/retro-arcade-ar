/* One lightweight six-pose atlas. No canvas, animation loop, or storage writes. */
(function(){
 'use strict';
 const poses=['happy','curious','sad','surprised','celebrate','rest'];
 const escape=value=>String(value||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function markup(pose='happy',classes='',label='',style=''){
  const p=poses.includes(pose)?pose:'happy';
  return '<span class="carto-sprite '+escape(classes)+'" data-carto-pose="'+p+'" '+(label?'role="img" aria-label="'+escape(label)+'"':'aria-hidden="true"')+(style?' style="'+escape(style)+'"':'')+'></span>';
 }
 function replace(image,pose='happy',label){
  const holder=document.createElement('span');
  holder.innerHTML=markup(pose,image.className,label??image.alt,image.getAttribute('style')||'');
  const actor=holder.firstElementChild;image.replaceWith(actor);return actor;
 }
 let timer;
 function mood(pose,duration=1600){
  clearTimeout(timer);
  const actors=document.querySelectorAll('.hero-mascot,.carto-mascot-live,.arcade-guide-robot,.page-companion');
  actors.forEach(el=>{el.dataset.cartoPose=poses.includes(pose)?pose:'happy';el.classList.remove('carto-react');void el.offsetWidth;el.classList.add('carto-react')});
  if(duration>0)timer=setTimeout(()=>actors.forEach(el=>{el.dataset.cartoPose='happy';el.classList.remove('carto-react')}),duration);
 }
 window.CartoMascot={markup,replace,mood,poses};
})();

;
/* CARTO Phase III: original, bounded Web Audio scores; silent by default. */
(function(){
 'use strict';
 const scores={
  back:{label:'العودة',notes:[[76,0,.045,.42,'square'],[71,.055,.055,.5,'triangle'],[67,.11,.065,.48,'triangle'],[62,.17,.065,.34,'triangle']]},
  treasure:{label:'اكتشاف كنز',notes:[[74,0,.045,.5,'square'],[81,.035,.045,.4,'triangle'],[77,.07,.05,.5,'square'],[86,.115,.055,.4,'triangle'],[89,.16,.075,.55,'triangle']]},
  open:{label:'فتح بطاقة',notes:[[60,0,.045,.5,'square'],[67,.035,.05,.4,'triangle'],[72,.075,.055,.45,'triangle']]},
  save:{label:'حفظ لعبة',notes:[[67,0,.05,.45,'square'],[74,.055,.07,.5,'triangle'],[79,.12,.09,.48,'square'],[86,.21,.12,.42,'triangle']]},
  achievement:{label:'إنجاز جديد',notes:[[72,0,.09,.5,'triangle'],[79,.075,.09,.45,'square'],[84,.16,.12,.5,'triangle'],[88,.245,.16,.4,'triangle'],[91,.36,.18,.5,'triangle']]},
  transform:{label:'تحول المظهر',notes:[[57,0,.08,.35,'triangle'],[69,.055,.07,.45,'square'],[76,.115,.09,.4,'triangle']]},
  enable:{label:'تشغيل الصوت',notes:[[60,0,.055,.5,'square'],[72,.065,.055,.45,'square'],[79,.13,.09,.5,'triangle'],[84,.24,.13,.45,'triangle']]},
  disable:{label:'إيقاف الصوت',notes:[[79,0,.055,.45,'square'],[72,.08,.09,.45,'triangle'],[60,.2,.13,.4,'triangle']]},
  heart:{label:'فتح قائمة القلب',notes:[[67,0,.065,.5,'triangle'],[79,.085,.065,.52,'square'],[83,.17,.12,.45,'triangle']]},
  save_avoid:{label:'لا أرغب في لعبها',notes:[[72,0,.08,.4,'triangle'],[68,.09,.08,.4,'triangle'],[65,.2,.12,.42,'triangle']]},
  save_later:{label:'أكملها لاحقًا',notes:[[76,0,.05,.5,'square'],[76,.1,.05,.4,'square'],[79,.23,.12,.48,'triangle']]},
  save_playing:{label:'ألعبها حاليًا',notes:[[60,0,.055,.5,'square'],[67,.06,.055,.5,'square'],[72,.12,.08,.45,'triangle'],[79,.23,.15,.5,'triangle']]},
  save_someday:{label:'أرغب في لعبها في وقت ما',notes:[[79,0,.08,.45,'triangle'],[86,.1,.08,.45,'triangle'],[83,.21,.08,.4,'square'],[91,.32,.13,.4,'triangle']]},
  save_completed:{label:'تم تختيم اللعبة',notes:[[72,0,.07,.5,'square'],[76,.08,.07,.45,'triangle'],[79,.16,.08,.45,'square'],[84,.27,.18,.5,'triangle']]},
  navigate:{label:'تنقل',notes:[[76,0,.045,.3,'triangle']]}
 };
 let enabled=false,context=null,master=null,voices=[],sequence=0,interacted=false,celebrationUntil=0;
 try{enabled=localStorage.getItem('carto-sound')==='on'}catch(e){}
 const endOf=name=>Math.max(...scores[name].notes.map(n=>n[1]+n[2]))+.025;
 function stop(){sequence++;voices.forEach(v=>{try{v.stop();v.disconnect()}catch(e){}});voices=[]}
 async function schedule(name,allowOff=false){
  if(!scores[name]||(!enabled&&!allowOff)||!interacted||document.hidden)return false;
  if(!allowOff&&name!=='achievement'&&Date.now()<celebrationUntil)return false;
  if(name==='achievement')celebrationUntil=Date.now()+600;
  stop();const request=sequence;
  try{
   const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return false;
   if(!context){context=new AC();master=context.createGain();master.gain.value=.12;master.connect(context.destination)}
   if(context.state==='suspended')await context.resume();
   if(request!==sequence||(!enabled&&!allowOff)||context.state!=='running')return false;
   const start=context.currentTime+.008;
   scores[name].notes.forEach(([midi,delay,length,volume,type])=>{
    const voice=context.createOscillator(),gain=context.createGain(),time=start+delay;
    voice.type=type;voice.frequency.setValueAtTime(440*Math.pow(2,(midi-69)/12),time);
    gain.gain.setValueAtTime(0,time);gain.gain.linearRampToValueAtTime(volume,time+.006);
    gain.gain.setValueAtTime(volume,time+length*.48);
    gain.gain.exponentialRampToValueAtTime(.0001,time+length);
    voice.connect(gain);gain.connect(master);voices.push(voice);
    voice.onended=()=>{voice.disconnect();gain.disconnect();voices=voices.filter(v=>v!==voice)};
    voice.start(time);voice.stop(time+length+.008);
   });return true;
  }catch(e){return false}
 }
 const speaker='<span class="control-icon audio-scene" aria-hidden="true"><svg viewBox="0 0 32 32"><path d="M5 12h6l7-6v20l-7-6H5z" fill="currentColor"/><g class="audio-bars" fill="currentColor"><rect x="21" y="12" width="2" height="8"/><rect x="25" y="8" width="2" height="16"/><rect x="29" y="4" width="2" height="24"/></g><path class="audio-cross" d="m22 12 7 8m0-8-7 8" fill="none" stroke="currentColor" stroke-width="2.5"/></svg></span>';
 function paint(){
  document.querySelectorAll('.arcade-sound').forEach(button=>{
   button.setAttribute('aria-pressed',String(enabled));button.setAttribute('data-state',enabled?'on':'off');
   button.setAttribute('aria-label',enabled?'إيقاف المؤثرات الصوتية':'تشغيل المؤثرات الصوتية');
   button.innerHTML=speaker+'<span class="control-copy"><span>صوت الموقع</span><strong>'+(enabled?'يعمل':'مغلق')+'</strong></span>';
  });
  document.querySelectorAll('[data-sound-preview]').forEach(button=>{button.disabled=!enabled});
  const note=document.getElementById('soundPreviewStatus');
  if(note)note.textContent=enabled?'الصوت يعمل. اختر تفاعلًا لتجربة نغمته.':'الصوت مغلق. فعّله من الزر أعلاه لتجربة النغمات.';
 }
 async function setEnabled(value){
  interacted=true;enabled=!!value;stop();
  try{localStorage.setItem('carto-sound',enabled?'on':'off')}catch(e){}
  paint();await schedule(enabled?'enable':'disable',true);
  window.CartoToast?.(enabled?'تم تشغيل مؤثرات CARTO':'تم إيقاف المؤثرات الصوتية');
 }
 function createToggle(){const button=document.createElement('button');button.type='button';button.className='arcade-sound control-switch';return button}
 function classifyLink(link){
  const path=new URL(link.href,location.href).pathname;
  if(path.endsWith('/gems.html'))return 'treasure';
  if(/العودة|رجوع|كل الأجهزة|الرئيسية/.test(link.textContent)||link.classList.contains('backtop'))return 'back';
  return 'navigate';
 }
 document.addEventListener('pointerdown',()=>{interacted=true},{capture:true,passive:true});
 document.addEventListener('keydown',()=>{interacted=true},{capture:true});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});
 document.addEventListener('click',async event=>{
  if(event.target.closest('.arcade-sound')){setEnabled(!enabled);return}
  const preview=event.target.closest('[data-sound-preview]');
  if(preview){
   if(!enabled)return;
   const name=preview.dataset.soundPreview;const ok=await schedule(name);
   const status=document.getElementById('soundPreviewStatus');
   if(status)status.textContent=ok?'تشغيل نغمة: '+scores[name].label:'تعذر تشغيل الصوت في هذا المتصفح. جرّب زر الصوت مرة أخرى.';
   return;
  }
  const link=event.target.closest('a[href]');
  if(!link&&event.target.closest('[data-letter]')){schedule('navigate');return}
  if(!link||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||link.target||link.hasAttribute('download'))return;
  const url=new URL(link.href,location.href);if(url.origin!==location.origin||url.hash)return;
  if(!enabled)return;
  const cue=classifyLink(link);
  // Let opt-in navigation cues finish, bounded to 260ms. Other navigation is immediate.
  event.preventDefault();schedule(cue);setTimeout(()=>location.assign(url.href),Math.min(endOf(cue)*1000,260));
 });
 document.addEventListener('carto:dialog-open',event=>schedule(event.detail?.dialog?.id==='wishlistModal'?'heart':'open'));
 document.addEventListener('carto:dialog-close',()=>schedule('back'));
 document.addEventListener('change',event=>{if(event.target.matches('#deviceFilter'))schedule('navigate')});
 document.addEventListener('carto:theme-change',()=>schedule('transform'));
 document.addEventListener('carto:wishlist-change',event=>{const cue='save_'+event.detail?.category;schedule(event.detail?.action==='save'?(scores[cue]?cue:'save'):'back')});
 document.addEventListener('carto:achievement',()=>schedule('achievement'));
 function init(){paint()}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
 window.CartoAudio={play:name=>schedule(name),setEnabled,createToggle,refresh:paint,get enabled(){return enabled},scores,endOf};
})();

;
/* Shared keyboard and focus lifecycle for CARTO dialogs. */
(function () {
  'use strict';
  let current = null;
  let opener = null;
  let openerName = null;
  let background = [];
  let overflow = '';
  function focusable(dialog) {
    return [...dialog.querySelectorAll('button, a[href], input, select, textarea, [tabindex]')]
      .filter(el => !el.disabled && el.tabIndex >= 0 && !el.closest('[hidden]') && el.getClientRects().length);
  }
  function close(dialog = current) {
    if (!dialog || dialog !== current) return;
    dialog.classList.remove('open');
    dialog.hidden = true;
    background.forEach(({el, inert}) => { el.inert = inert; });
    background = [];
    document.body.style.overflow = overflow;
    const previous = opener;
    const name = openerName;
    current = opener = openerName = null;
    queueMicrotask(() => {
      let target = previous?.isConnected ? previous : null;
      if (!target && name) target = [...document.querySelectorAll('[data-wish-name]')].find(el => el.dataset.wishName === name);
      if (!target) target = document.querySelector('main h1, main');
      if (target) { if (!target.matches('button,a,input,select,textarea')) target.tabIndex = -1; target.focus({preventScroll: true}); }
    });
    document.dispatchEvent(new CustomEvent('carto:dialog-close', {detail: {dialog}}));
  }
  function open(dialog) {
    if (!dialog) return;
    if (current === dialog) return;
    if (current) close(current);
    opener = document.activeElement;
    openerName = opener?.dataset.wishName || null;
    overflow = document.body.style.overflow;
    current = dialog;
    dialog.hidden = false;
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.classList.add('open');
    background = [...document.body.children].filter(el => el !== dialog && !el.matches('script,style,link'))
      .map(el => ({el, inert: el.inert}));
    background.forEach(({el}) => { el.inert = true; });
    document.body.style.overflow = 'hidden';
    const first = dialog.querySelector('[aria-label="إغلاق"]') || focusable(dialog)[0];
    if (first) first.focus({preventScroll: true});
    else { dialog.tabIndex = -1; dialog.focus(); }
    document.dispatchEvent(new CustomEvent('carto:dialog-open', {detail: {dialog}}));
  }
  document.addEventListener('keydown', event => {
    if (!current) return;
    if (event.key === 'Escape') { event.preventDefault(); event.stopImmediatePropagation(); close(); return; }
    if (event.key !== 'Tab') return;
    const items = focusable(current);
    if (!items.length) { event.preventDefault(); current.focus(); return; }
    const first = items[0], last = items[items.length - 1];
    if (event.shiftKey && (document.activeElement === first || !current.contains(document.activeElement))) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && (document.activeElement === last || !current.contains(document.activeElement))) {
      event.preventDefault(); first.focus();
    }
  }, true);
  document.addEventListener('click', event => {
    if (current && (event.target === current || event.target.closest('[data-dialog-close], #modalClose, .wishlist-close'))) close();
  });
  window.CartoDialog = {open, close};
})();

;
(function(){
  "use strict";
  var root=document.documentElement;
  function readTheme(){try{return localStorage.getItem("carto-appearance")==="dark"?"dark":"light"}catch(e){return root.getAttribute("data-theme")==="dark"?"dark":"light"}}
  var scene='<span class="control-icon mode-scene" aria-hidden="true"><svg viewBox="0 0 32 32"><g class="mode-sun" fill="currentColor"><path d="M12 10h8v12h-8zM10 12h12v8H10zM15 3h2v4h-2zm0 22h2v4h-2zM3 15h4v2H3zm22 0h4v2h-4zM6 6h3v3H6zm17 17h3v3h-3zM23 6h3v3h-3zM6 23h3v3H6z"/></g><path class="mode-moon" d="M22 5h-8v3h-4v4H7v10h4v4h12v-3h4v-5h-8v-4h-4V7h7z" fill="currentColor"/></svg></span>';
  function applyTheme(theme){
    root.setAttribute("data-theme",theme);
    var meta=document.querySelector('meta[name="theme-color"]');
    if(meta)meta.setAttribute("content",theme==="dark"?"#15131A":"#F3EBDD");
    var button=document.querySelector(".nav .appearance-toggle");
    if(button){
      button.classList?.add('control-switch');
      button.innerHTML=scene+'<span class="control-copy"><span>مظهر الموقع</span><strong>'+(theme==='dark'?'داكن':'فاتح')+'</strong></span>';
      button.setAttribute('data-state',theme);
      button.setAttribute('aria-pressed',String(theme==='dark'));
      button.setAttribute('aria-label',theme==='dark'?'التبديل إلى المظهر الفاتح':'التبديل إلى المظهر الداكن');
    }
  }
  function init(){
    applyTheme(readTheme());
    var nav=document.querySelector(".navin");
    if(!nav)return;
    var button=document.querySelector(".nav .appearance-toggle");
    if(!button){
      button=document.createElement("button");
      button.type="button";button.className="appearance-toggle";
      button.addEventListener("click",function(){
        var next=root.getAttribute("data-theme")==="dark"?"light":"dark";
        try{localStorage.setItem("carto-appearance",next)}catch(e){}
        applyTheme(next);
        document.dispatchEvent?.(new CustomEvent("carto:theme-change",{detail:{theme:next}}));
      });
      nav.appendChild(button);
    }
    applyTheme(readTheme());
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();

;
/* CARTO Arcade Experience — nonintrusive progressive enhancement */
(function(){
"use strict";
const doc=document,root=doc.documentElement;
function toast(message,duration=2600){
 const box=doc.getElementById("arcadeToast");if(!box)return;
 box.textContent=message;box.hidden=false;
 clearTimeout(toast.timer);toast.timer=setTimeout(()=>{box.hidden=true},duration);
}
window.CartoToast=toast;
function init(){
 const main=doc.querySelector("main");
 if(main){main.id=main.id||"main-content";const skip=doc.createElement("a");skip.className="skip-content";skip.href="#main-content";skip.textContent="تجاوز إلى المحتوى";doc.body.prepend(skip);}
 const nav=doc.querySelector(".nav");
 const navin=doc.querySelector(".navin");
 if(nav&&navin){
  const controls=doc.createElement("div");controls.className="arcade-controls";
  const btn=window.CartoAudio.createToggle();
  controls.append(btn);
  const theme=navin.querySelector(".appearance-toggle");
  if(theme)controls.append(theme);
  navin.append(controls);
  window.CartoAudio.refresh();
  const strip=doc.createElement("div");strip.className="arcade-ticker";strip.innerHTML='<b>PLAYER 01</b> ذاكرة الألعاب بلغتنا · اكتشف، اقرأ، وأضف ألعابك إلى قائمتك <b>● CARTO</b>';
  nav.insertAdjacentElement("afterend",strip);
 }
 const footer=doc.querySelector(".footer");
 if(footer){
  footer.classList.add("arcade-footer");
  const inner=footer.querySelector(".footerin");
  if(inner){
   const brand=inner.querySelector(".brand");
   if(brand){const p=doc.createElement("p");p.className="arcade-footer-info";p.textContent="أرشيف عربي لعوالم الألعاب الكلاسيكية، يصنعه الشغف والاكتشاف.";brand.append(p);
   const stamp=doc.createElement("span");stamp.className="arcade-footer-stamp";stamp.textContent="INSERT COIN · CARTO";brand.append(stamp)}
   const links=inner.querySelector(".footerlinks");
   if(links&&!links.querySelector('a[href="localization.html"]')){const a=doc.createElement("a");a.href="localization.html";a.textContent="الألعاب المعربة";links.append(a)}
   const bottom=doc.createElement("div");bottom.className="arcade-footer-bottom";bottom.innerHTML='<span>صُمم بروح ملصقات الألعاب القديمة والبكسل.</span><a href="identity.html">تعرّف إلى الهوية البصرية ↗</a>';
   inner.append(bottom);
  }
 }
 const toastEl=doc.createElement("div");toastEl.id="arcadeToast";toastEl.className="arcade-toast";toastEl.setAttribute("role","status");toastEl.setAttribute("aria-live","polite");toastEl.hidden=true;doc.body.append(toastEl);
 doc.addEventListener("carto:wishlist-change",event=>{if(event.detail?.action==="save")toast("✓ تم تحديث قائمتك الشخصية");else toast("تمت إزالة اللعبة من قائمتك")});
 const year=doc.getElementById("yearNow");if(year)year.textContent=new Date().getFullYear();

}
if(doc.readyState==="loading")doc.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();


;
/* CARTO Phase III: event-based mascot; existing achievement storage is preserved. */
(function(){
"use strict";
const d=document,root=d.documentElement;
const PREFIX="carto-arcade-achievements-v1";
const mood=(pose,ms)=>window.CartoMascot.mood(pose,ms);
const reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
function getAchievements(){try{const value=JSON.parse(localStorage.getItem(PREFIX)||"{}");return value&&typeof value==="object"?value:{}}catch(e){return {}}}
function saveAchievements(value){try{localStorage.setItem(PREFIX,JSON.stringify(value));return true}catch(e){return false}}
function currentWishlist(){try{const a=JSON.parse(localStorage.getItem("carto-personal-wishlist")||"[]");return Array.isArray(a)?a:[]}catch(e){return []}}
const achievements=[
{id:"discover",icon:"✦",title:"أول اكتشاف",en:"FIRST DISCOVERY",hint:"فتح أول بطاقة تفاصيل لعبة"},
{id:"collector",icon:"◆",title:"جامع الألعاب",en:"THE COLLECTOR",hint:"إضافة 10 ألعاب إلى قائمتك الشخصية"},
{id:"master",icon:"★",title:"خبير التختيم",en:"GAME MASTER",hint:"تصنيف 5 ألعاب على أنها مختومة"},
{id:"arabic",icon:"ع",title:"جسر اللغة",en:"ARABIC SUPPORT",hint:"استكشاف قسم الألعاب المعربة"}
];
function toast(message){window.CartoToast?.(message,3500)}
function unlock(id){
 const achieved=getAchievements();if(achieved[id])return;
 achieved[id]=Date.now();if(!saveAchievements(achieved))return;
 const item=achievements.find(x=>x.id===id);
 if(item){d.dispatchEvent(new CustomEvent("carto:achievement",{detail:{id}}));mood("celebrate",2200);toast("🏆 إنجاز جديد: "+item.title);refreshAchievements()}
}
function checkList(){
 const list=currentWishlist();
 if(list.length>=10)unlock("collector");
 if(list.filter(g=>g.category==="completed").length>=5)unlock("master");
 refreshAchievements();
}
function renderAchievementMarkup(){
 return achievements.map(a=>'<div class="arcade-achievement '+(getAchievements()[a.id]?"unlocked":"")+'" title="'+a.hint+'"><span aria-hidden="true">'+window.CartoIcons.markup(({discover:'gems',collector:'reference',master:'completed',arabic:'localization'})[a.id])+'</span><strong>'+a.title+'</strong><small>'+a.en+'</small><p>'+a.hint+'</p></div>').join("");
}
function refreshAchievements(){
 d.querySelectorAll(".arcade-achievement-grid").forEach(el=>el.innerHTML=renderAchievementMarkup());
 const count=d.querySelector("#cartoAchievementCount");if(count)count.textContent=Object.keys(getAchievements()).filter(k=>achievements.some(a=>a.id===k)).length+" / "+achievements.length;
}
function addHomePanel(){
 if(d.body.dataset.page!=="home")return;
 const main=d.querySelector("main");if(!main)return;
 const panel=d.createElement("section");panel.className="section arcade-discovery";panel.setAttribute("aria-labelledby","arcadeExploreTitle");
 panel.innerHTML='<div class="wrap"><div class="arcade-discovery-board"><div class="arcade-guide">'+window.CartoMascot.markup('happy','arcade-guide-robot','كارتو، مرشد الاكتشاف')+'<div><span class="arcade-8bit">PLAYER ONE · ACHIEVEMENTS</span><h2 id="arcadeExploreTitle">رحلتك في عالم كارتو</h2><p>اكتشف الألعاب، واجمع ذكرياتك، وتعرّف إلى جهود التعريب العربي. إنجازاتك تُحفظ في هذا المتصفح دون حساب.</p></div></div><div class="arcade-achievements-title"><strong>لوحة الإنجازات</strong><span id="cartoAchievementCount">0 / 4</span></div><div class="arcade-achievement-grid"></div></div></div>';
 const footer=main.lastElementChild;
 if(footer)footer.insertAdjacentElement("afterend",panel);else main.append(panel);
 refreshAchievements();
}
let revealObserver;
function setupScrollReveal(){
 if(reduce||!("IntersectionObserver"in window))return;
 if(!revealObserver)revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting){entry.target.classList.add("arcade-visible");revealObserver.unobserve(entry.target)}
 }),{threshold:.08});
 d.querySelectorAll(".gamecard,.archivecard,.platform,.gaming-source-card,.local-card,.term").forEach((el,i)=>{
  if(el.dataset.revealReady)return;
  el.dataset.revealReady="true";
  el.classList.add("arcade-reveal");el.style.setProperty("--arcade-reveal-delay",Math.min(i%8*35,175)+"ms");
  revealObserver.observe(el);
 });
}
function attachMascotSearch(){
 const search=d.querySelector("#gameSearch,#termSearch");
 if(!search||d.body.dataset.page==="reference"||search.closest("[hidden]"))return;
 const filters=search.closest(".filters")||search.parentElement;
 if(filters && !d.querySelector(".arcade-search-companion")){
  const helper=d.createElement("div");helper.className="arcade-search-companion";
  helper.innerHTML=window.CartoMascot.markup('curious','carto-mascot-live','كارتو يتفاعل مع نتائج البحث')+'<span>كارتو يساعدك في البحث!</span>';
  filters.insertAdjacentElement("afterend",helper);
 }
 let timer;
 search.addEventListener("input",()=>{
  clearTimeout(timer);timer=setTimeout(()=>{
    const empty=d.querySelector("#gameGrid .empty,#termGrid .empty");
    if(empty)mood("sad",0);else if(search.value.trim())mood("curious",900);else mood("happy",0);
  },260);
 });
}
function init(){
 addHomePanel();setupScrollReveal();attachMascotSearch();
 const manifesto=d.querySelector('.gems-manifesto');
 if(manifesto)manifesto.insertAdjacentHTML('beforeend',window.CartoMascot.markup('celebrate','page-companion gems-companion',''));
 const archive=d.querySelector('body[data-page="archive"] .sectionhead');
 if(archive)archive.insertAdjacentHTML('beforeend',window.CartoMascot.markup('curious','page-companion archive-companion',''));
 d.addEventListener("click",e=>{
  const target=e.target;
  if(target.closest("[data-details]")){mood("surprised",1250);unlock("discover")}
  else if(target.closest("[data-source]"))mood("curious",1250);

 },true);
 d.addEventListener("carto:wishlist-change",event=>{if(event.detail?.action==="save")mood("celebrate",1400);checkList()});
 d.addEventListener("carto:catalog-render",setupScrollReveal);
 if(d.body.dataset.page==="localization")unlock("arabic");
 checkList();
 window.addEventListener("storage",()=>{refreshAchievements();checkList()});
}
if(d.readyState==="loading")d.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();

;
(function(){
 'use strict';
 function animate(button){
  button.classList.remove('is-switching');void button.offsetWidth;button.classList.add('is-switching');
  clearTimeout(button.cartoAnimation);button.cartoAnimation=setTimeout(()=>button.classList.remove('is-switching'),650);
 }
 function syncThemePreview(){
  const main=document.querySelector('.nav .appearance-toggle');
  if(!main)return;
  document.querySelectorAll('[data-theme-preview]').forEach(button=>{
   button.innerHTML=main.innerHTML;
   ['aria-label','aria-pressed','data-state'].forEach(attr=>button.setAttribute(attr,main.getAttribute(attr)));
  });
 }
 function init(){
  syncThemePreview();window.CartoAudio.refresh();
  document.addEventListener('carto:theme-change',()=>{syncThemePreview();document.querySelectorAll('.appearance-toggle').forEach(animate)});
  document.addEventListener('click',event=>{
   const sample=event.target.closest('[data-theme-preview]');
   if(sample)document.querySelector('.nav .appearance-toggle')?.click();
   const sound=event.target.closest('.arcade-sound');if(sound)animate(sound);
  },true);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

;
/* CARTO sticker motion: bounded, event-driven, no frame loop or per-card listeners. */
(function(){
 'use strict';
 const query=window.matchMedia('(prefers-reduced-motion: reduce)');
 let visible=new WeakSet();const timers=new WeakMap();let observer;
 const cards='.platform,.gamecard,.archivecard,.gaming-source-card,.local-card,.term,.wishlist-group,.character-poses figure,.identity-card,.arcade-achievement';
 function pulse(el,name='carto-pressed',duration=620){
  if(!el||query.matches)return;
  el.classList.remove(name);void el.offsetWidth;el.classList.add(name);
  let active=timers.get(el);if(!active){active=new Map();timers.set(el,active)}
  clearTimeout(active.get(name));active.set(name,setTimeout(()=>{el.classList.remove(name);active.delete(name)},duration));
 }
 function enroll(){
  if(query.matches||!('IntersectionObserver'in window))return;
  if(!observer)observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
   if(!entry.isIntersecting)return;
   observer.unobserve(entry.target);entry.target.classList.add('sticker-arrive');
  }),{threshold:.12});
  document.querySelectorAll(cards).forEach((el,i)=>{if(visible.has(el))return;visible.add(el);el.style.setProperty('--sticker-order',Math.min(i%4,3));observer.observe(el)});
 }
 function init(){
  enroll();
  document.addEventListener('carto:catalog-render',enroll);
  document.addEventListener('carto:wishlist-change',()=>{enroll();pulse(document.querySelector('.wishlist-group:has(.wishlist-heart:focus)'), 'sticker-arrive',720)});
  document.addEventListener('carto:theme-change',()=>pulse(document.documentElement,'carto-theme-shift',850));
  document.addEventListener('carto:dialog-open',event=>pulse(event.detail?.dialog?.querySelector('.wishlist-modalbox,.modalbox'),'sticker-open',500));
  document.addEventListener('click',event=>{
   const button=event.target.closest('button,.btn,.local-btn,.platform,.navlinks a,.footerlinks a');
   if(button&&!button.disabled)pulse(button);
   const sound=event.target.closest('.arcade-sound');if(sound)document.querySelectorAll('.arcade-sound').forEach(el=>pulse(el,'control-performance',850));
  },true);
  query.addEventListener('change',()=>{if(query.matches){observer?.disconnect();document.querySelectorAll('.sticker-arrive,.carto-pressed,.sticker-open,.control-performance').forEach(el=>el.classList.remove('sticker-arrive','carto-pressed','sticker-open','control-performance'))}else{visible=new WeakSet();enroll()}});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

;
/* A progressive navigation disclosure; storage and existing controls stay untouched. */
(function(){
 'use strict';
 function init(){
  if(document.body.dataset.page==='reader')return;
  const header=document.querySelector('header.nav');
  if(!header||document.querySelector('.mobile-nav-trigger'))return;
  const media=window.matchMedia(document.body.dataset.page==='magazines'?'(max-width:700px), (max-width:1100px) and (max-height:600px)':'(max-width:700px)');
  const trigger=document.createElement('button');
  trigger.type='button';trigger.className='mobile-nav-trigger';
  trigger.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg><span>القائمة</span>';
  header.id=header.id||'carto-mobile-navigation';
  trigger.setAttribute('aria-controls',header.id);
  document.body.insertBefore(trigger,header);
  document.body.classList.add('mobile-nav-ready');
  let open=false,lastY=window.scrollY;
  function setOpen(value,restoreFocus){
   open=media.matches&&value;
   header.classList.toggle('mobile-nav-open',open);
   header.inert=media.matches&&!open;
   if(media.matches)header.setAttribute('aria-hidden',String(!open));else header.removeAttribute('aria-hidden');
   trigger.hidden=!media.matches;
   trigger.setAttribute('aria-expanded',String(open));
   trigger.setAttribute('aria-label',open?'إغلاق القائمة':'إظهار قائمة التنقل');
   trigger.querySelector('span').textContent=open?'إغلاق':'القائمة';
   if(restoreFocus)trigger.focus();
  }
  trigger.addEventListener('click',()=>setOpen(!open,false));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&open){setOpen(false,true);e.preventDefault();}});
  document.addEventListener('click',e=>{if(open&&!trigger.contains(e.target)&&(!header.contains(e.target)||e.target.closest('a')))setOpen(false,false);},true);
  document.addEventListener('focusin',e=>{if(open&&!header.contains(e.target)&&!trigger.contains(e.target))setOpen(false,false);});
  window.addEventListener('scroll',()=>{const y=window.scrollY;if(open&&Math.abs(y-lastY)>8)setOpen(false,header.contains(document.activeElement));lastY=y;},{passive:true});
  media.addEventListener('change',()=>setOpen(false,false));
  setOpen(false,false);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();

;
/* Warm only deliberate internal navigation; never crawl or fetch PDFs/emulators. */
(function(){'use strict';const seen=new Set();function warm(event){const link=event.target.closest('.navlinks a,.footerlinks a,.platform,.archivecard a,.heroactions a');if(!link||document.hidden||navigator.connection?.saveData||/2g/.test(navigator.connection?.effectiveType||'')||seen.size>=2)return;const url=new URL(link.href,location.href);if(url.origin!==location.origin||!url.pathname.endsWith('.html')||url.pathname.endsWith('/reader.html')||url.href===location.href||seen.has(url.href))return;seen.add(url.href);const hint=document.createElement('link');hint.rel='prefetch';hint.href=url.href;hint.as='document';hint.fetchPriority='low';document.head.append(hint);}document.addEventListener('pointerover',warm,{passive:true});document.addEventListener('focusin',warm);})();
