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
