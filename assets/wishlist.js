(function(){
"use strict";
var KEY="carto-personal-wishlist";
var CATEGORIES=[
{id:"avoid",label:"لا أرغب في لعبها",emoji:"🙅"},
{id:"later",label:"أكملها لاحقًا",emoji:"⏳"},
{id:"playing",label:"ألعبها حاليًا",emoji:"🎮"},
{id:"someday",label:"أرغب في لعبها في وقت ما",emoji:"💭"},
{id:"completed",label:"تم تختيم اللعبة",emoji:"🏆"}
];
var esc=function(s){return String(s||"").replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})};
function read(){try{var v=JSON.parse(localStorage.getItem(KEY)||"[]");return Array.isArray(v)?v:[]}catch(e){return []}}
function write(v){try{localStorage.setItem(KEY,JSON.stringify(v))}catch(e){alert("تعذر حفظ القائمة في هذا المتصفح. تحقق من إعدادات التخزين.");}}
function category(id){return CATEGORIES.find(function(c){return c.id===id})||CATEGORIES[3]}
function find(name){return read().find(function(g){return g.name===name})}
function ensureModal(){
 if(document.getElementById("wishlistModal"))return;
 var m=document.createElement("div");m.id="wishlistModal";m.className="wishlist-modal";m.setAttribute("role","dialog");m.setAttribute("aria-modal","true");m.setAttribute("aria-labelledby","wishlistModalTitle");
 m.innerHTML='<div class="wishlist-modalbox"><div class="wishlist-modalhead"><div><span class="wishlist-kicker">CARTO · YOUR LIST</span><h2 id="wishlistModalTitle">أضف إلى الجوهر المفقود</h2><p id="wishlistGameName"></p></div><button type="button" class="wishlist-close" aria-label="إغلاق">✕</button></div><p class="wishlist-help">اختر التصنيف المناسب لهذه اللعبة في قائمتك الشخصية.</p><div class="wishlist-options" id="wishlistOptions"></div><button type="button" class="wishlist-remove" id="wishlistRemove" hidden>إزالة اللعبة من قائمتي</button></div>';
 document.body.appendChild(m);
 m.addEventListener("click",function(e){if(e.target===m||e.target.closest(".wishlist-close"))closeModal()});
 m.querySelector("#wishlistRemove").addEventListener("click",function(){var name=m.dataset.name;write(read().filter(function(g){return g.name!==name}));closeModal();refresh()});
 m.querySelector("#wishlistOptions").addEventListener("click",function(e){var b=e.target.closest("[data-category]");if(!b)return;var name=m.dataset.name,device=m.dataset.device;var list=read(),existing=list.find(function(g){return g.name===name});if(existing){existing.category=b.dataset.category;existing.device=device||existing.device}else list.push({name:name,device:device||"unknown",category:b.dataset.category,addedAt:Date.now()});write(list);closeModal();refresh()});
 document.addEventListener("keydown",function(e){if(e.key==="Escape")closeModal()});
}
function closeModal(){var m=document.getElementById("wishlistModal");if(m)m.classList.remove("open")}
function openModal(name,device){
 ensureModal();var m=document.getElementById("wishlistModal"),saved=find(name);
 m.dataset.name=name;m.dataset.device=device||"unknown";
 m.querySelector("#wishlistGameName").textContent=name;
 m.querySelector("#wishlistModalTitle").textContent=saved?"غيّر تصنيف اللعبة":"أضف إلى الجوهر المفقود";
 m.querySelector("#wishlistRemove").hidden=!saved;
 m.querySelector("#wishlistOptions").innerHTML=CATEGORIES.map(function(c){return '<button type="button" class="wishlist-option '+(saved&&saved.category===c.id?"selected":"")+'" data-category="'+c.id+'"><span class="wishlist-optionemoji">'+c.emoji+'</span><span>'+esc(c.label)+'</span><span class="wishlist-check">'+(saved&&saved.category===c.id?"✓":"＋")+'</span></button>'}).join("");
 m.classList.add("open");
}
function heart(name,device){var saved=find(name);return '<button type="button" class="wishlist-heart '+(saved?"is-saved":"")+'" data-wish-name="'+esc(name)+'" data-wish-device="'+esc(device||"unknown")+'" aria-label="'+(saved?"تعديل تصنيف "+esc(name):"أضف "+esc(name)+" إلى الجوهر المفقود")+'" aria-pressed="'+(saved?"true":"false")+'" title="'+(saved?"موجودة في الجوهر المفقود":"أضف إلى الجوهر المفقود")+'">'+(saved?"♥":"♡")+'</button>'}
function decorateCards(){
 if(document.body.dataset.page==="reference")return;
 document.querySelectorAll("#gameGrid .gamecard").forEach(function(card){
  var details=card.querySelector("[data-details]");var title=details?details.dataset.details:card.querySelector("h3")?.textContent?.trim();if(!title)return;
  var device=details?details.dataset.device:(card.querySelector(".meta span")?.textContent||"unknown");
  var bottom=card.querySelector(".cardbottom")||card.querySelector(".gameinfo");if(!bottom)return;
  var old=bottom.querySelector(".wishlist-heart");if(old){var s=find(title);old.classList.toggle("is-saved",!!s);old.textContent=s?"♥":"♡";old.setAttribute("aria-pressed",s?"true":"false");return}
  bottom.insertAdjacentHTML("beforeend",heart(title,device));
 });
}
function renderList(){
 if(document.body.dataset.page!=="reference")return;
 var grid=document.getElementById("gameGrid");if(!grid)return;
 var filters=document.querySelector("body[data-page='reference'] .filters");if(filters)filters.hidden=true;
 var count=document.getElementById("gameCount");if(count)count.hidden=true;
 var notice=document.querySelector("body[data-page='reference'] .notice");if(notice)notice.hidden=true;
 var hero=document.querySelector("body[data-page='reference'] .platformhero");if(hero){hero.querySelector("h2").textContent="قائمتك الشخصية للألعاب";hero.querySelector("p").textContent="اجمع الألعاب من صفحات الموسوعة والأجهزة، ثم صنّفها حسب خطتك. قائمتك محفوظة على هذا الجهاز دون تسجيل دخول."}
 var list=read();
 if(!list.length){grid.innerHTML='<section class="wishlist-empty"><div class="wishlist-emptyicon">♡</div><span class="wishlist-kicker">YOUR PERSONAL GAME LIST</span><h2>رحلتك تبدأ من هنا</h2><p>لم تضف أي لعبة بعد. تصفّح الموسوعة أو صفحة أي جهاز، واضغط قلب اللعبة لتضيفها إلى قائمتك وتختار تصنيفها.</p><a class="btn" href="games.html">تصفّح الألعاب ←</a></section>';return}
 grid.className="wishlist-groups";
 grid.innerHTML=CATEGORIES.map(function(c){
  var games=list.filter(function(g){return g.category===c.id});
  return '<section class="wishlist-group"><header class="wishlist-grouphead"><h2>'+c.emoji+' '+esc(c.label)+'</h2><span>'+games.length+' لعبة</span></header>'+(games.length?'<div class="wishlist-list">'+games.map(function(g){var d=typeof window.CARTO_DEVICE_NAMES!=="undefined"?(window.CARTO_DEVICE_NAMES[g.device]||g.device):g.device;return '<article class="wishlist-game"><div class="wishlist-gameicon">🎮</div><div class="wishlist-gametext"><h3 lang="en" dir="ltr">'+esc(g.name)+'</h3><p>'+esc(d)+'</p></div><div class="wishlist-gameactions">'+heart(g.name,g.device)+'<button type="button" class="wishlist-edit" data-wish-name="'+esc(g.name)+'" data-wish-device="'+esc(g.device)+'">تعديل</button></div></article>'}).join("")+'</div>':'<p class="wishlist-groupempty">لا توجد ألعاب في هذا التصنيف حتى الآن.</p>')+'</section>';
 }).join("");
}
function refresh(){if(document.body.dataset.page==="reference")renderList();else decorateCards()}
document.addEventListener("click",function(e){var b=e.target.closest("[data-wish-name]");if(b){e.preventDefault();openModal(b.dataset.wishName,b.dataset.wishDevice);return}});
window.addEventListener("storage",refresh);
function init(){ensureModal();refresh();var grid=document.getElementById("gameGrid");if(grid&&document.body.dataset.page!=="reference"){new MutationObserver(decorateCards).observe(grid,{childList:true,subtree:true})}}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();