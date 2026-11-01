(function(){
"use strict";
var KEY="carto-personal-wishlist";
var DEVICE_NAMES={xbox360:"Xbox 360",wii:"Nintendo Wii","3ds":"Nintendo 3DS",vita:"PS Vita",ps3:"PlayStation 3",ps2:"PlayStation 2",ds:"Nintendo DS",gba:"Game Boy Advance",gems:"الألعاب المكنوزة",unknown:"جهاز غير محدد"};
var CATEGORIES=[
{id:"avoid",label:"لا أرغب في لعبها",emoji:"🙅"},
{id:"later",label:"أكملها لاحقًا",emoji:"⏳"},
{id:"playing",label:"ألعبها حاليًا",emoji:"🎮"},
{id:"someday",label:"أرغب في لعبها في وقت ما",emoji:"💭"},
{id:"completed",label:"تم تختيم اللعبة",emoji:"🏆"}
];
var esc=function(s){return String(s||"").replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})};
function read(){try{var v=JSON.parse(localStorage.getItem(KEY)||"[]");return Array.isArray(v)?v:[]}catch(e){return []}}
function write(v){try{localStorage.setItem(KEY,JSON.stringify(v));return true}catch(e){alert("تعذر حفظ القائمة في هذا المتصفح. تحقق من إعدادات التخزين.");return false}}
function category(id){return CATEGORIES.find(function(c){return c.id===id})||CATEGORIES[3]}
function find(name){return read().find(function(g){return g.name===name})}
function ensureModal(){
 if(document.getElementById("wishlistModal"))return;
 var m=document.createElement("div");m.id="wishlistModal";m.hidden=true;m.className="wishlist-modal";m.setAttribute("role","dialog");m.setAttribute("aria-modal","true");m.setAttribute("aria-labelledby","wishlistModalTitle");
 m.innerHTML='<div class="wishlist-modalbox"><div class="wishlist-modalhead"><div><span class="wishlist-kicker">CARTO · YOUR LIST</span><h2 id="wishlistModalTitle">أضف إلى قائمة تحفك الفنية</h2><p id="wishlistGameName"></p></div><button type="button" class="wishlist-close" aria-label="إغلاق">✕</button></div><p class="wishlist-help">اختر التصنيف المناسب لهذه اللعبة في قائمتك الشخصية.</p><div class="wishlist-options" id="wishlistOptions"></div><button type="button" class="wishlist-remove" id="wishlistRemove" hidden>إزالة اللعبة من قائمتي</button></div>';
 document.body.appendChild(m);
 m.addEventListener("click",function(e){if(e.target===m||e.target.closest(".wishlist-close"))closeModal()});
 m.querySelector("#wishlistRemove").addEventListener("click",function(){var name=m.dataset.name;if(write(read().filter(function(g){return g.name!==name}))){closeModal();refresh();focusSavedGame(name);document.dispatchEvent(new CustomEvent("carto:wishlist-change",{detail:{action:"remove"}}))}});
 m.querySelector("#wishlistOptions").addEventListener("click",function(e){var b=e.target.closest("[data-category]");if(!b)return;var name=m.dataset.name,device=m.dataset.device;var list=read(),existing=list.find(function(g){return g.name===name});if(existing){existing.category=b.dataset.category;existing.device=device||existing.device}else list.push({name:name,device:device||"unknown",category:b.dataset.category,addedAt:Date.now()});if(write(list)){closeModal();refresh();focusSavedGame(name);document.dispatchEvent(new CustomEvent("carto:wishlist-change",{detail:{action:"save",category:b.dataset.category}}))}});
 document.addEventListener("keydown",function(e){if(e.key==="Escape")closeModal()});
}
function closeModal(){window.CartoDialog.close(document.getElementById("wishlistModal"))}
function openModal(name,device,removalOnly=false){
 ensureModal();var m=document.getElementById("wishlistModal"),saved=find(name);
 m.dataset.name=name;m.dataset.device=device||"unknown";
 m.querySelector("#wishlistGameName").textContent=name;
 m.querySelector("#wishlistModalTitle").textContent=removalOnly?"إزالة اللعبة من قائمتك؟":saved?"غيّر تصنيف اللعبة":"أضف إلى قائمة تحفك الفنية";m.querySelector("#wishlistOptions").hidden=removalOnly;m.querySelector(".wishlist-help").hidden=removalOnly;
 m.querySelector("#wishlistRemove").hidden=!saved;
 m.querySelector("#wishlistOptions").innerHTML=CATEGORIES.map(function(c){return '<button type="button" class="wishlist-option '+(saved&&saved.category===c.id?"selected":"")+'" data-category="'+c.id+'"><span class="wishlist-optionemoji">'+window.CartoIcons.markup(c.id)+'</span><span>'+esc(c.label)+'</span><span class="wishlist-check">'+(saved&&saved.category===c.id?"✓":"＋")+'</span></button>'}).join("");
 window.CartoDialog.open(m);
}
function heart(name,device,saved=find(name)){return '<button type="button" class="wishlist-heart '+(saved?"is-saved":"")+'" data-wish-name="'+esc(name)+'" data-wish-device="'+esc(device||"unknown")+'" aria-label="'+(saved?"تعديل تصنيف "+esc(name):"أضف "+esc(name)+" إلى قائمة تحفك الفنية")+'" aria-pressed="'+(saved?"true":"false")+'" title="'+(saved?"موجودة في قائمة تحفك الفنية":"أضف إلى قائمة تحفك الفنية")+'">'+(saved?"♥":"♡")+'</button>'}
function decorateCards(){
 if(document.body.dataset.page==="reference")return;
 const savedGames=new Map(read().map(game=>[game.name,game]));
 document.querySelectorAll("#gameGrid .gamecard, #gemGrid .gamecard").forEach(function(card){
  var details=card.querySelector("[data-details]");var title=details?details.dataset.details:card.querySelector("h3")?.textContent?.trim();if(!title)return;
  var device=details?details.dataset.device:(card.closest("#gemGrid")?"gems":"unknown");
  var bottom=card.querySelector(".cardbottom")||card.querySelector(".gameinfo");if(!bottom)return;
  var old=bottom.querySelector(".wishlist-heart");if(old){var s=savedGames.get(title),heartText=s?"♥":"♡",pressed=s?"true":"false";if(old.classList.contains("is-saved")!==!!s)old.classList.toggle("is-saved",!!s);if(old.textContent!==heartText)old.textContent=heartText;if(old.getAttribute("aria-pressed")!==pressed)old.setAttribute("aria-pressed",pressed);var label=s?"تعديل تصنيف "+title:"أضف "+title+" إلى قائمة تحفك الفنية";if(old.getAttribute("aria-label")!==label)old.setAttribute("aria-label",label);var hint=s?"موجودة في قائمة تحفك الفنية":"أضف إلى قائمة تحفك الفنية";if(old.title!==hint)old.title=hint;return}
  bottom.insertAdjacentHTML("beforeend",heart(title,device,savedGames.get(title)||null));
 });
}
var collectionState={query:'',status:'all',device:'',sort:'plan'},collectionReady=false;
function announceCollection(text){var status=document.getElementById('collectionStatus');if(status)status.textContent=text;}
function focusSavedGame(name){if(document.body.dataset.page!=='reference')return;var target=[...document.querySelectorAll('[data-collection-category]')].find(el=>el.dataset.gameName===name)||document.querySelector('[data-collection-status][aria-pressed="true"]');target?.focus({preventScroll:true});}
function initCollection(){
 if(collectionReady)return;collectionReady=true;
 var tabs=document.getElementById('collectionTabs');
 var labels={all:'الكل',playing:'ألعبها حاليًا',later:'أكملها لاحقًا',someday:'أرغب بلعبها',completed:'مختومة',avoid:'لا أرغب'};
 tabs.innerHTML=['all','playing','later','someday','completed','avoid'].map(id=>'<button type="button" data-collection-status="'+id+'" aria-pressed="'+(id==='all')+'" aria-label="'+esc(id==='all'?'كل الألعاب':category(id).label)+'"><span>'+labels[id]+'</span><b data-collection-count="'+id+'">0</b></button>').join('');
 document.getElementById('collectionSearch').addEventListener('input',event=>{collectionState.query=event.target.value;renderList()});
 document.getElementById('collectionDevice').addEventListener('change',event=>{collectionState.device=event.target.value;renderList()});
 document.getElementById('collectionSort').addEventListener('change',event=>{collectionState.sort=event.target.value;renderList()});
 tabs.addEventListener('click',event=>{var button=event.target.closest('[data-collection-status]');if(button){collectionState.status=button.dataset.collectionStatus;renderList()}});
 document.getElementById('collectionReset').addEventListener('click',resetCollection);
 document.addEventListener('change',event=>{var select=event.target.closest('[data-collection-category]');if(!select||!CATEGORIES.some(c=>c.id===select.value))return;var list=read(),game=list.find(g=>g?.name===select.dataset.gameName);if(!game)return;var previous=game.category,nextCategory=select.value,changed=window.CartoCollection.updateCategory(list,game.name,nextCategory);if(changed&&write(changed)){refresh();document.dispatchEvent(new CustomEvent('carto:wishlist-change',{detail:{action:'save',category:nextCategory}}));focusSavedGame(game.name);announceCollection('نُقلت '+(window.CARTO_CATALOG?.[game.name]?.displayName||game.name)+' إلى «'+category(nextCategory).label+'».');}else select.value=previous;});
 document.addEventListener('error',event=>{var image=event.target;if(image?.matches?.('[data-collection-cover]')){image.remove();} },true);
}
function resetCollection(){collectionState={query:'',status:'all',device:'',sort:'plan'};document.getElementById('collectionSearch').value='';document.getElementById('collectionDevice').value='';document.getElementById('collectionSort').value='plan';renderList();document.getElementById('collectionSearch').focus();}
function collectionCard(game){
 var record=window.CARTO_CATALOG?.[game.name]||{},title=record.displayName||game.name,device=DEVICE_NAMES[game.device]||'جهاز غير محدد';
 var cover='<span class="collection-cover-fallback" aria-hidden="true">'+window.CartoIcons.markup(game.device)+'<small>الغلاف غير متاح</small></span>';
 if(record.image&&/^https:\/\//.test(record.image))cover+='<img data-collection-cover src="'+esc(record.image)+'" alt="'+esc((record.imageKind||'غلاف')+' — '+title)+'" width="84" height="112" loading="lazy" decoding="async">';
 var options=CATEGORIES.map(c=>'<option value="'+c.id+'"'+(game.category===c.id?' selected':'')+'>'+esc(c.label)+'</option>').join('');if(!CATEGORIES.some(c=>c.id===game.category))options='<option value="" selected disabled>اختر التصنيف</option>'+options;
 return '<article class="collection-card" data-collection-name="'+esc(game.name)+'" data-status="'+esc(game.category)+'"><div class="collection-cover">'+cover+'</div><div class="collection-card-info"><h3 dir="ltr" lang="en">'+esc(title)+'</h3><p class="collection-platform">'+window.CartoIcons.markup(game.device)+'<span>'+esc(device)+'</span></p>'+(record.genre?'<p class="collection-genre" dir="auto">'+esc(record.genre)+'</p>':'')+'</div><div class="collection-card-actions"><label><span class="collection-visually-hidden">تصنيف '+esc(title)+'</span><select data-collection-category data-game-name="'+esc(game.name)+'">'+options+'</select></label><button type="button" class="textbtn" data-details="'+esc(game.name)+'" data-device="'+esc(game.device||'unknown')+'" aria-label="تفاصيل '+esc(title)+'">تفاصيل ←</button><button type="button" class="collection-remove" data-collection-remove="'+esc(game.name)+'" data-device="'+esc(game.device||'unknown')+'" aria-label="إزالة '+esc(title)+' من القائمة">إزالة</button></div></article>';
}
function renderList(){
 if(document.body.dataset.page!=='reference')return;
 var grid=document.getElementById('gameGrid');if(!grid)return;
 initCollection();var model=window.CartoCollection,list=model.records(read()),counts=model.counts(list),catalog=window.CARTO_CATALOG||{};
 document.getElementById('collectionTools').hidden=!list.length;
 document.getElementById('collectionTotal').textContent='عدد الألعاب: '+list.length;
 document.querySelectorAll('[data-collection-status]').forEach(button=>{var id=button.dataset.collectionStatus;button.setAttribute('aria-pressed',String(id===collectionState.status));button.setAttribute('aria-label',(id==='all'?'كل الألعاب':category(id).label)+'، عدد الألعاب: '+counts[id]);});
 document.querySelectorAll('[data-collection-count]').forEach(counter=>counter.textContent=counts[counter.dataset.collectionCount]);
 var device=document.getElementById('collectionDevice'),devices=[...new Set(list.map(g=>g.device||'unknown'))];device.innerHTML='<option value="">كل الأجهزة</option>'+devices.map(id=>'<option value="'+esc(id)+'">'+esc(DEVICE_NAMES[id]||'جهاز غير محدد')+'</option>').join('');device.value=devices.includes(collectionState.device)?collectionState.device:'';collectionState.device=device.value;
 var result=model.select(list,collectionState,catalog,DEVICE_NAMES);
 document.getElementById('collectionResult').textContent='عرض '+result.length+' من '+list.length;document.getElementById('collectionReset').hidden=!(collectionState.query||collectionState.status!=='all'||collectionState.device);
 grid.className='collection-grid';
 if(!list.length){grid.innerHTML='<section class="wishlist-empty">'+window.CartoMascot.markup('rest','wishlist-empty-mascot','كارتو ينتظر أول لعبة في قائمتك')+'<h2>أول لعبة تبدأ الحكاية</h2><p>اضغط قلب أي لعبة في الموسوعة، واختر تصنيفها لتظهر هنا.</p><a class="btn" href="games.html">تصفّح الألعاب ←</a></section>';return;}
 grid.innerHTML=result.length?result.map(collectionCard).join(''):'<section class="collection-no-results"><h2>لا توجد ألعاب بهذه التصفية</h2><p>ألعابك المحفوظة باقية. جرّب جهازًا أو تصنيفًا آخر.</p><button type="button" class="btn" id="collectionEmptyReset">عرض قائمتي كاملة</button></section>';
 document.getElementById('collectionEmptyReset')?.addEventListener('click',resetCollection);
}
function refresh(){if(document.body.dataset.page==="reference")renderList();else decorateCards()}
document.addEventListener("click",function(e){var remove=e.target.closest("[data-collection-remove]");if(remove){openModal(remove.dataset.collectionRemove,remove.dataset.device,true);return}var b=e.target.closest("[data-wish-name]");if(b){e.preventDefault();openModal(b.dataset.wishName,b.dataset.wishDevice);return}});
window.addEventListener("storage",refresh);
function init(){ensureModal();refresh();document.addEventListener("carto:catalog-render",decorateCards)}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();
