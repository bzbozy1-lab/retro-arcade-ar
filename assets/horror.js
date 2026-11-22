const games=[
 {title:'Silent Hill 2',type:'psych',note:'ضباب وعزلة ورعب نفسي',summary:'مدينة يكسوها الضباب تعيد جيمس إلى ماضٍ يحاول فهمه. التوتر ينبع من العزلة وما تخفيه المدينة.',img:'https://upload.wikimedia.org/wikipedia/en/9/95/Silent_Hill_2.jpg',url:'https://www.konami.com/games/silenthill/'},
 {title:'Resident Evil 4',type:'survival',note:'موارد محدودة ومواجهة مباشرة',summary:'يصل ليون إلى قرية نائية في مهمة إنقاذ. إدارة الذخيرة واختيار وقت المواجهة جزء من التوتر.',img:'https://upload.wikimedia.org/wikipedia/en/d/d9/Resi4-gc-cover.jpg',url:'https://store.steampowered.com/app/254700/Resident_Evil_4_2005/'},
 {title:'Dead Space',type:'survival',note:'عزلة على متن سفينة فضائية',summary:'يستكشف آيزك كلارك سفينة شبه مهجورة، حيث تجعل الممرات الضيقة والأصوات البعيدة كل خطوة محسوبة.',img:'https://upload.wikimedia.org/wikipedia/en/5/57/Dead_Space_Box_Art.jpg',url:'https://store.steampowered.com/app/17470/Dead_Space_2008/'},
 {title:'At Dead of Night',type:'chase',note:'اختباء ومطاردة داخل فندق',summary:'تتنقل مايا بين غرف فندق في محاولة لفهم ما حدث والاختباء من مطاردها.',img:'assets/covers/gems/at-dead-of-night.webp',url:'https://store.steampowered.com/app/1450830/At_Dead_Of_Night/'}
];
const labels={psych:'رعب نفسي',survival:'رعب البقاء',chase:'مطاردة'};
const cards=document.querySelector('#cards'), dialog=document.querySelector('#gameDialog');
for(const game of games){
 const card=document.createElement('article');
 card.className='horror-card';card.dataset.type=game.type;
 card.innerHTML='<div class="horror-art"><img alt="" loading="lazy" decoding="async"></div><div class="horror-card-body"><span class="horror-kind"></span><h3 lang="en" dir="ltr"></h3><p></p><button class="horror-more" type="button">تفاصيل اللعبة</button></div>';
 const image=card.querySelector('img');image.src=game.img;image.addEventListener('error',()=>image.remove(),{once:true});
 card.querySelector('.horror-kind').textContent=labels[game.type];card.querySelector('h3').textContent=game.title;card.querySelector('p').textContent=game.note;
 const button=card.querySelector('button');button.setAttribute('aria-label','تفاصيل '+game.title);
 button.addEventListener('click',()=>{document.querySelector('#gameTitle').textContent=game.title;document.querySelector('#gameSummary').textContent=game.summary;document.querySelector('#gameSource').href=game.url;dialog.showModal()});
 cards.append(card);
}
const filters=[...document.querySelectorAll('[data-filter]')];
for(const button of filters)button.addEventListener('click',()=>{for(const other of filters)other.setAttribute('aria-pressed',String(other===button));for(const card of cards.children)card.hidden=button.dataset.filter!=='all'&&card.dataset.type!==button.dataset.filter});
const entrance=document.querySelector('.horror-entrance'), replay=document.querySelector('#replay'), reduced=matchMedia('(prefers-reduced-motion: reduce)');
let timer;
function finish(){clearTimeout(timer);entrance.hidden=true}
function play(){finish();if(reduced.matches)return;entrance.hidden=false;timer=setTimeout(finish,1900)}
entrance.addEventListener('animationend',event=>{if(event.target===entrance && event.animationName==='signal-end')finish()});replay.addEventListener('click',play);
reduced.addEventListener('change',()=>{replay.hidden=reduced.matches;if(reduced.matches)finish()});
window.addEventListener('keydown',event=>{if(event.key==='Escape')finish()});
window.addEventListener('pagehide',finish);
replay.hidden=reduced.matches;
if(!location.hash&&performance.getEntriesByType('navigation')[0]?.type==='navigate')play();
