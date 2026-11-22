const games=[
 {title:'Silent Hill 2',device:'ps2',type:'psych',note:'ضباب وعزلة ورعب نفسي',summary:'مدينة يكسوها الضباب تعيد جيمس إلى ماضٍ يحاول فهمه. التوتر ينبع من العزلة وما تخفيه المدينة.',img:'https://upload.wikimedia.org/wikipedia/en/9/95/Silent_Hill_2.jpg',url:'https://www.konami.com/games/silenthill/'},
 {title:'Resident Evil 4',device:'gamecube',type:'survival',note:'موارد محدودة ومواجهة مباشرة',summary:'يصل ليون إلى قرية نائية في مهمة إنقاذ. إدارة الذخيرة واختيار وقت المواجهة جزء من التوتر.',img:'https://upload.wikimedia.org/wikipedia/en/d/d9/Resi4-gc-cover.jpg',url:'https://store.steampowered.com/app/254700/Resident_Evil_4_2005/'},
 {title:'Dead Space',device:'ps3',type:'survival',note:'عزلة على متن سفينة فضائية',summary:'يستكشف آيزك كلارك سفينة شبه مهجورة، حيث تجعل الممرات الضيقة والأصوات البعيدة كل خطوة محسوبة.',img:'https://upload.wikimedia.org/wikipedia/en/5/57/Dead_Space_Box_Art.jpg',url:'https://store.steampowered.com/app/17470/Dead_Space_2008/'},
 {title:'At Dead of Night',type:'chase',note:'اختباء ومطاردة داخل فندق',summary:'تتنقل مايا بين غرف فندق في محاولة لفهم ما حدث والاختباء من مطاردها.',img:'assets/covers/gems/at-dead-of-night.webp',url:'https://store.steampowered.com/app/1450830/At_Dead_Of_Night/'},
 {"title":"Silent Hill 3","type":"psych","note":"توتر نفسي وغموض","summary":"تجد هيذر نفسها محاصرة بين واقع مألوف وعالم مشوّه يخفي صلتها بماضي البلدة.","device":"ps2","img":"https://thumb.wikimedia.org/wikipedia/en/thumb/c/ca/Sh3_boxart.jpg/250px-Sh3_boxart.jpg","url":"https://en.wikipedia.org/wiki/Silent_Hill_3"},
 {"title":"Resident Evil 2 (Biohazard 2)","type":"survival","note":"استكشاف ونجاة","summary":"يحاول ليون وكلير النجاة من تفشّي الوباء في راكون سيتي.","device":"ps1","img":"https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation/master/Named_Boxarts/Resident%20Evil%202%20%28USA%29.png","url":"https://psxdatacenter.com/games/U/R/SLUS-00421.html"},
 {"title":"Resident Evil 3: Nemesis (Biohazard 3 – Last Escape)","type":"chase","note":"اختباء ومطاردة","summary":"تحاول جيل الهرب من راكون سيتي فيما يلاحقها نيميسيس.","device":"ps1","img":"https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation/master/Named_Boxarts/Resident%20Evil%203%20-%20Nemesis%20%28USA%29.png","url":"https://psxdatacenter.com/games/U/R/SLUS-00923.html"},
 {"title":"Until Dawn","type":"psych","note":"توتر نفسي وغموض","summary":"تتحكم في مصير مجموعة أصدقاء تقطعت بهم السبل في جبل معزول.","url":"https://www.mobygames.com/game/74492/until-dawn/","img":"https://images.launchbox-app.com/0a3b2610-3709-4f39-bfc8-e2815e6d41d9.jpg"},
 {"title":"P.T.","type":"psych","note":"توتر نفسي وغموض","summary":"إعلان تفاعلي يدور في ممر منزلي تتغيّر تفاصيله كلما أعدت المرور فيه.","img":"https://uc.udn.com.tw/photo/2023/08/12/0/24008002.jpeg","url":"https://www.gematsu.com/2014/08/p-t-announced-ps4-demo-released"},
 {"title":"Resident Evil 7: Biohazard","type":"survival","note":"استكشاف ونجاة","summary":"يبحث إيثان عن زوجته في منزل آل بيكر، حيث تصبح كل مواجهة مخاطرة.","img":"https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/418370/header.jpg","url":"https://store.steampowered.com/app/418370/"},
 {"title":"Little Nightmares","type":"chase","note":"اختباء ومطاردة","summary":"تبحث سيكس عن مخرج من مكان غامض يتربص بها سكانه.","img":"https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/424840/header.jpg","url":"https://store.steampowered.com/app/424840/"},
 {"title":"Five Nights at Freddy’s","type":"survival","note":"استكشاف ونجاة","summary":"راقب الكاميرات ووفّر طاقة الأبواب لتنجو من مناوبة الليل.","img":"https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/319510/header.jpg","url":"https://store.steampowered.com/app/319510/"},
 {"title":"The Evil Within 2","type":"survival","note":"استكشاف ونجاة","summary":"يدخل سيباستيان عالمًا يتداعى بحثًا عن ابنته.","img":"https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/601430/header.jpg","url":"https://store.steampowered.com/app/601430/"},
 {"title":"The Quarry","type":"psych","note":"توتر نفسي وغموض","summary":"تتبدّل مصائر مرشدي المخيم وفق قراراتك خلال ليلة واحدة.","img":"https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1577120/header.jpg","url":"https://store.steampowered.com/app/1577120/"},
 {"title":"Bendy and the Ink Machine","type":"chase","note":"اختباء ومطاردة","summary":"تعيدك دعوة غامضة إلى استوديو رسوم متحركة تملؤه آثار الحبر.","img":"https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/622650/header.jpg","url":"https://store.steampowered.com/app/622650/"},
 {"title":"Amanda the Adventurer","type":"psych","note":"توتر نفسي وغموض","summary":"تكشف أشرطة برنامج أطفال قديم تفاصيل مقلقة كلما تفاعلت معها.","img":"https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2166060/header.jpg","url":"https://store.steampowered.com/app/2166060/"},
 {"title":"Fears to Fathom","type":"psych","note":"توتر نفسي وغموض","summary":"سلسلة حلقات تحوّل مواقف يومية إلى قصص يرويها الناجون.","img":"https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1671340/header.jpg","url":"https://store.steampowered.com/app/1671340/"},
 {"title":"Poppy Playtime","type":"chase","note":"اختباء ومطاردة","summary":"تحلّ ألغاز مصنع ألعاب مهجور بينما تحاول الإفلات من سكانه.","img":"https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1721470/header.jpg","url":"https://store.steampowered.com/app/1721470/"},
 {"title":"Outlast","type":"chase","note":"اختباء ومطاردة","summary":"يوثّق صحفي ما يجري داخل مصحّة معزولة ويحاول الخروج منها.","img":"https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/238320/header.jpg","url":"https://store.steampowered.com/app/238320/"},
 {"title":"Choo-Choo Charles","type":"chase","note":"اختباء ومطاردة","summary":"تنقّل بالقطار وطوّره بينما يطاردك قطار وحشي في الجزيرة.","img":"https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1766740/header.jpg","url":"https://store.steampowered.com/app/1766740/"},
 {"title":"Backrooms: Escape Together","type":"chase","note":"اختباء ومطاردة","summary":"تعاون مع رفاقك للبحث عن مخرج من غرف وممرات لا تبدو لها نهاية.","img":"https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2141730/header.jpg","url":"https://store.steampowered.com/app/2141730/"},
 {"title":"Alien: Isolation","type":"survival","note":"استكشاف ونجاة","summary":"تحاول أماندا ريبلي النجاة من مخلوق يطاردها داخل محطة فضائية.","img":"https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/214490/header.jpg","url":"https://store.steampowered.com/app/214490/"},
 {"title":"Alone in the Dark: The New Nightmare","type":"survival","note":"استكشاف ونجاة","summary":"تحقيق في جزيرة معزولة تقوده الألغاز ومواجهة مخلوقات تختبئ في الظلام.","device":"ps1","img":"https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation/master/Named_Boxarts/Alone%20in%20the%20Dark%20-%20The%20New%20Nightmare%20%28USA%29.png","url":"https://psxdatacenter.com/games/U/A/SLUS-01201.html"}
];
const labels={psych:'رعب نفسي',survival:'رعب البقاء',chase:'مطاردة'};
const cards=document.querySelector('#gameGrid'), dialog=document.querySelector('#gameDialog');
for(const game of games){
 const card=document.createElement('article');
 card.className='horror-card gamecard';card.dataset.type=game.type;
 card.innerHTML='<div class="horror-art"><img alt="" loading="lazy" decoding="async"></div><div class="horror-card-body"><span class="horror-kind"></span><h3 lang="en" dir="ltr"></h3><p></p><div class="horror-card-actions cardbottom"><button class="horror-more" type="button" data-details>تفاصيل اللعبة</button></div></div>';
 const image=card.querySelector('img');if(game.img){
  image.addEventListener('error',()=>image.remove(),{once:true});
  image.src=game.img;
 }else image.remove();
 card.querySelector('.horror-kind').textContent=labels[game.type];card.querySelector('h3').textContent=game.title;card.querySelector('p').textContent=game.note;
 const button=card.querySelector('button');button.dataset.details=game.title;
 button.dataset.device=game.device||'unknown';
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
