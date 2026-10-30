/* CARTO Arcade Experience / Phase II — additive features; does not modify saved game data */
(function(){
"use strict";
const d=document,root=d.documentElement;
const PREFIX="carto-arcade-achievements-v1";
const robot="assets/carto-robot.svg";
const poses={happy:robot,curious:"assets/carto-curious.svg",sad:"assets/carto-sad.svg",surprised:"assets/carto-surprised.svg",celebrate:"assets/carto-celebrate.svg"};
let mascotTimer=0;let blinkTimer=0;
const reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
function getAchievements(){try{const value=JSON.parse(localStorage.getItem(PREFIX)||"{}");return value&&typeof value==="object"?value:{}}catch(e){return {}}}
function saveAchievements(value){try{localStorage.setItem(PREFIX,JSON.stringify(value))}catch(e){}}
function currentWishlist(){try{const a=JSON.parse(localStorage.getItem("carto-personal-wishlist")||"[]");return Array.isArray(a)?a:[]}catch(e){return []}}
const achievements=[
{id:"discover",icon:"✦",title:"أول اكتشاف",en:"FIRST DISCOVERY",hint:"فتح أول بطاقة تفاصيل لعبة"},
{id:"collector",icon:"◆",title:"جامع الألعاب",en:"THE COLLECTOR",hint:"إضافة 10 ألعاب إلى قائمتك الشخصية"},
{id:"master",icon:"★",title:"خبير التختيم",en:"GAME MASTER",hint:"تصنيف 5 ألعاب على أنها مختومة"},
{id:"arabic",icon:"ع",title:"جسر اللغة",en:"ARABIC SUPPORT",hint:"استكشاف قسم الألعاب المعربة"}
];
function mood(pose,ms=1700){
 const candidates=d.querySelectorAll(".hero-mascot,.carto-mascot-live,.arcade-guide-robot");
 if(!candidates.length)return;
 clearTimeout(mascotTimer);
 candidates.forEach(el=>{el.src=poses[pose]||robot;el.dataset.mood=pose});
 mascotTimer=setTimeout(()=>candidates.forEach(el=>{el.src=robot;delete el.dataset.mood}),ms);
}
function toast(message){
 const node=d.getElementById("arcadeToast");
 if(!node)return;
 node.textContent=message;node.hidden=false;
 clearTimeout(window.cartoPhase2Toast);window.cartoPhase2Toast=setTimeout(()=>node.hidden=true,3500);
}
function unlock(id){
 const achieved=getAchievements();if(achieved[id])return;
 achieved[id]=Date.now();saveAchievements(achieved);
 const item=achievements.find(x=>x.id===id);
 if(item){mood("celebrate",2200);toast("🏆 إنجاز جديد: "+item.title);refreshAchievements()}
}
function checkList(){
 const list=currentWishlist();
 if(list.length>=10)unlock("collector");
 if(list.filter(g=>g.category==="completed").length>=5)unlock("master");
 refreshAchievements();
}
function renderAchievementMarkup(){
 return achievements.map(a=>'<div class="arcade-achievement '+(getAchievements()[a.id]?"unlocked":"")+'" title="'+a.hint+'"><span aria-hidden="true">'+a.icon+'</span><strong>'+a.title+'</strong><small>'+a.en+'</small><p>'+a.hint+'</p></div>').join("");
}
function refreshAchievements(){
 d.querySelectorAll(".arcade-achievement-grid").forEach(el=>el.innerHTML=renderAchievementMarkup());
 const count=d.querySelector("#cartoAchievementCount");if(count)count.textContent=Object.keys(getAchievements()).filter(k=>achievements.some(a=>a.id===k)).length+" / "+achievements.length;
}
function addHomePanel(){
 if(d.body.dataset.page!=="home")return;
 const main=d.querySelector("main");if(!main)return;
 const panel=d.createElement("section");panel.className="section arcade-discovery";panel.setAttribute("aria-labelledby","arcadeExploreTitle");
 panel.innerHTML='<div class="wrap"><div class="arcade-discovery-board"><div class="arcade-guide"><img class="arcade-guide-robot" src="'+robot+'" alt="كارتو، المرشد البكسلي"><div><span class="arcade-8bit">PLAYER ONE · ACHIEVEMENTS</span><h2 id="arcadeExploreTitle">رحلتك في عالم كارتو</h2><p>اكتشف الألعاب، واجمع ذكرياتك، وتعرّف إلى جهود التعريب العربي. إنجازاتك تُحفظ في هذا المتصفح دون حساب.</p></div></div><div class="arcade-achievements-title"><strong>لوحة الإنجازات</strong><span id="cartoAchievementCount">0 / 4</span></div><div class="arcade-achievement-grid"></div></div></div>';
 const footer=main.lastElementChild;
 if(footer)footer.insertAdjacentElement("afterend",panel);else main.append(panel);
 refreshAchievements();
}
function addIdentityShowcase(){
 if(d.body.dataset.page!=="identity")return;
 const main=d.querySelector("main .wrap");if(!main)return;
 const section=d.createElement("section");section.className="arcade-identity-showcase";section.setAttribute("aria-labelledby","cartoPhase2IdentityTitle");
 section.innerHTML='<div class="arcade-showcase-banner"><span class="arcade-8bit">PHASE 02 · DESIGN SYSTEM</span><h2 id="cartoPhase2IdentityTitle">كارتو الجديد — روبوت الخرطوشة الودود</h2><p>صُمّم بروح الجيل البكسلي: عينان معبّرتان، خدّان مرجانيان، سماعتان ملونتان، ويدان وقدمان صغيرتان. يظل شكل الخرطوشة أصل الشخصية، فيما تتغيّر تعابير الوجه باختلاف التفاعل.</p></div><div class="arcade-moods"><figure><img src="assets/carto-robot.svg" alt="كارتو مبتهج"><figcaption>سعيد · HAPPY</figcaption></figure><figure><img src="assets/carto-curious.svg" alt="كارتو فضولي"><figcaption>فضولي · CURIOUS</figcaption></figure><figure><img src="assets/carto-sad.svg" alt="كارتو حزين"><figcaption>لا نتائج · SAD</figcaption></figure><figure><img src="assets/carto-surprised.svg" alt="كارتو متفاجئ"><figcaption>مندهش · WOW</figcaption></figure><figure><img src="assets/carto-celebrate.svg" alt="كارتو يحتفل"><figcaption>إنجاز · WIN</figcaption></figure></div><div class="arcade-identity-rules"><h3>قواعد هوية CARTO التفاعلية</h3><p><strong>الحركة:</strong> انتقالات ناعمة وقصيرة للبطاقات والصفحات، وتعابير مرتبطة بالحدث، مع احترام تفضيل تقليل الحركة.</p><p><strong>الصوت:</strong> أصوات إلكترونية قصيرة اختيارية فقط، مغلقة افتراضيًا وقابلة للتعطيل.</p><p><strong>الإنجازات:</strong> لوحة من أربع شارات تعتمد على الاستخدام المحلي دون حساب أو مشاركة بيانات خارجية.</p><p><strong>المظهر:</strong> ريترو ملصقات وبكسل، حواف سميكة، ألوان CARTO الخمسة، مع وضوح النصوص واستجابة كاملة للجوال.</p><p><strong>النوافذ:</strong> تفاعل بصري واضح مع زر إغلاق، دون مؤثرات تعيق الاستخدام.</p><div class="arcade-achievements-title"><strong>معاينة شارات الإنجازات</strong><span>LIVE BADGES</span></div><div class="arcade-achievement-grid"></div></div>';
 const last=main.querySelector('a.btn.alt[href="index.html"]');
 if(last)last.before(section);else main.append(section);
 refreshAchievements();
}
function setupScrollReveal(){
 if(reduce||!("IntersectionObserver"in window))return;
 const elements=d.querySelectorAll(".gamecard,.archivecard,.platform,.gaming-source-card,.local-card,.term");
 const ob=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("arcade-visible");ob.unobserve(entry.target)}})},{threshold:.08});
 elements.forEach((el,i)=>{el.classList.add("arcade-reveal");el.style.setProperty("--arcade-reveal-delay",Math.min(i%8*35,175)+"ms");ob.observe(el)});
}
function attachMascotSearch(){
 const search=d.querySelector("#gameSearch,#termSearch");
 if(!search)return;
 let timer;
 search.addEventListener("input",()=>{
  clearTimeout(timer);timer=setTimeout(()=>{
    const empty=d.querySelector("#gameGrid .empty,#termGrid .empty");
    if(empty)mood("sad",1600);else if(search.value.trim())mood("curious",900);
  },260);
 });
}
function init(){
 addHomePanel();addIdentityShowcase();setupScrollReveal();attachMascotSearch();
 d.addEventListener("click",e=>{
  const target=e.target;
  if(target.closest("[data-details]")){unlock("discover");mood("surprised",1250)}
  else if(target.closest("[data-source]"))mood("curious",1250);
  if(target.closest(".wishlist-option,[data-category]")){
    setTimeout(()=>{checkList();mood("celebrate",1400)},0);
  }
  if(target.closest(".wishlist-remove"))setTimeout(checkList,0);
 },true);
 if(d.body.dataset.page==="localization")unlock("arabic");
 checkList();
 window.addEventListener("storage",()=>{refreshAchievements();checkList()});
}
if(d.readyState==="loading")d.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();