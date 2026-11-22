const games=[
 {title:'Silent Hill 2',type:'psych',note:'ضباب وعزلة ورعب نفسي',summary:'مدينة يكسوها الضباب تعيد جيمس إلى ماضٍ يحاول فهمه. التوتر ينبع من العزلة وما تخفيه المدينة.',img:'https://upload.wikimedia.org/wikipedia/en/9/95/Silent_Hill_2.jpg',url:'https://www.konami.com/games/silenthill/'},
 {title:'Resident Evil 4',type:'survival',note:'موارد محدودة ومواجهة مباشرة',summary:'يصل ليون إلى قرية نائية في مهمة إنقاذ. إدارة الذخيرة واختيار وقت المواجهة جزء من التوتر.',img:'https://upload.wikimedia.org/wikipedia/en/d/d9/Resi4-gc-cover.jpg',url:'https://store.steampowered.com/app/254700/Resident_Evil_4_2005/'},
 {title:'Dead Space',type:'survival',note:'عزلة على متن سفينة فضائية',summary:'يستكشف آيزك كلارك سفينة شبه مهجورة، حيث تجعل الممرات الضيقة والأصوات البعيدة كل خطوة محسوبة.',img:'https://upload.wikimedia.org/wikipedia/en/5/57/Dead_Space_Box_Art.jpg',url:'https://store.steampowered.com/app/17470/Dead_Space_2008/'},
 {title:'At Dead of Night',type:'chase',note:'اختباء ومطاردة داخل فندق',summary:'تتنقل مايا بين غرف فندق في محاولة لفهم ما حدث والاختباء من مطاردها.',img:'assets/covers/gems/at-dead-of-night.webp',url:'https://store.steampowered.com/app/1450830/At_Dead_Of_Night/'}
];
const labels={psych:'رعب نفسي',survival:'رعب البقاء',chase:'مطاردة'};
const cards=document.querySelector('#gameGrid'), dialog=document.querySelector('#gameDialog');
for(const game of games){
 const card=document.createElement('article');
 card.className='horror-card gamecard';card.dataset.type=game.type;
 card.innerHTML='<div class="horror-art"><img alt="" loading="lazy" decoding="async"></div><div class="horror-card-body"><span class="horror-kind"></span><h3 lang="en" dir="ltr"></h3><p></p><div class="horror-card-actions cardbottom"><button class="horror-more" type="button" data-details>تفاصيل اللعبة</button></div></div>';
 const image=card.querySelector('img');image.src=game.img;image.addEventListener('error',()=>image.remove(),{once:true});
 card.querySelector('.horror-kind').textContent=labels[game.type];card.querySelector('h3').textContent=game.title;card.querySelector('p').textContent=game.note;
 const button=card.querySelector('button');button.dataset.details=game.title;
 button.dataset.device=['ps2','gamecube','ps3','unknown'][games.indexOf(game)];
 button.setAttribute('aria-label','تفاصيل '+game.title);
 button.addEventListener('click',()=>{document.querySelector('#gameTitle').textContent=game.title;document.querySelector('#gameSummary').textContent=game.summary;document.querySelector('#gameSource').href=game.url;dialog.showModal()});
 cards.append(card);
}
const filters=[...document.querySelectorAll('[data-filter]')];
const search=document.querySelector('#horrorSearch'), empty=document.querySelector('#horrorEmpty');
let selected='all';
function applyFilters(){
 const query=search.value.trim().toLowerCase();
 let shown=0;
 for(const [index,card] of [...cards.children].entries()){
  const game=games[index];
  card.hidden=(selected!=='all'&&game.type!==selected)||
    !(`${game.title} ${game.note}`.toLowerCase().includes(query));
  if(!card.hidden)shown++;
 }
 empty.hidden=shown!==0;
}
for(const button of filters)button.addEventListener('click',()=>{
 selected=button.dataset.filter;
 for(const other of filters)other.setAttribute('aria-pressed',String(other===button));
 applyFilters();
});
search.addEventListener('input',applyFilters);
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
