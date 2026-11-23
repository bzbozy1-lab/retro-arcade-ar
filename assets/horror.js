const games=[
 {title:'Silent Hill 2',device:'ps2',type:'psych',note:'ضباب وعزلة ورعب نفسي',summary:"يتلقّى جيمس رسالة من زوجته الراحلة تطلب منه لقاءها في سايلنت هيل. يقوده البحث عنها عبر شوارع يبتلعها الضباب، فيما تزداد أسئلته كلما اقترب من المكان الذي وعدته بالانتظار فيه.",img:'https://upload.wikimedia.org/wikipedia/en/9/95/Silent_Hill_2.jpg',url:'https://www.konami.com/games/silenthill/'},
 {title:'Resident Evil 4',device:'gamecube',type:'survival',note:'موارد محدودة ومواجهة مباشرة',summary:"يصل ليون إلى قرية نائية بحثًا عن ابنة الرئيس الأمريكي. أهل القرية في استقباله، لكنهم يطاردونه بالأدوات التي كانوا يعملون بها. وفّر ذخيرتك واختر أين تقف قبل أن تحاصرك المجموعة.",img:'https://upload.wikimedia.org/wikipedia/en/d/d9/Resi4-gc-cover.jpg',url:'https://store.steampowered.com/app/254700/Resident_Evil_4_2005/'},
 {title:'Dead Space',device:'ps3',type:'survival',note:'عزلة على متن سفينة فضائية',summary:"يصعد المهندس آيزك كلارك إلى سفينة التعدين إيشيمورا بعد انقطاع الاتصال بها. سرعان ما يجد نفسه يواجه مخلوقات لا تسقط بسهولة. التصويب على أطرافها أهم من سرعة إطلاق النار.",img:'https://upload.wikimedia.org/wikipedia/en/5/57/Dead_Space_Box_Art.jpg',url:'https://store.steampowered.com/app/17470/Dead_Space_2008/'},
 {title:'At Dead of Night',type:'chase',note:'اختباء ومطاردة داخل فندق',summary:"تحتجز مايا في فندق يطاردها فيه صاحبه جيمي. تنتقل بين الغرف، وتستخدم جهازًا للتواصل مع الأرواح حتى تعرف ما جرى للنزلاء، فيما تصغي لخطوات جيمي في الممر.",img:'assets/covers/gems/at-dead-of-night.webp',url:'https://store.steampowered.com/app/1450830/At_Dead_Of_Night/'},
 {"title":"Silent Hill 3","type":"psych","note":"توتر نفسي وغموض","summary":"تبدأ حكاية هيذر في مركز تسوّق مألوف، ثم تتبدل قاعاته إلى مكان يصعب التعرّف عليه. وكلما حاولت الخروج، ظهرت دلائل تربط ما تراه بماضيها وببلدة سايلنت هيل.","device":"ps2","img":"https://thumb.wikimedia.org/wikipedia/en/thumb/c/ca/Sh3_boxart.jpg/250px-Sh3_boxart.jpg","url":"https://en.wikipedia.org/wiki/Silent_Hill_3"},
 {"title":"Resident Evil 2 (Biohazard 2)","type":"survival","note":"استكشاف ونجاة","summary":"يصل الشرطي ليون في يومه الأول إلى راكون سيتي، بينما تدخلها كلير بحثًا عن أخيها. ينتهي بهما المطاف في مركز الشرطة، حيث تساعدك معرفة طرق العودة بقدر ما تساعدك الذخيرة.","device":"ps1","img":"https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation/master/Named_Boxarts/Resident%20Evil%202%20%28USA%29.png","url":"https://psxdatacenter.com/games/U/R/SLUS-00421.html"},
 {"title":"Resident Evil 3: Nemesis (Biohazard 3 – Last Escape)","type":"chase","note":"اختباء ومطاردة","summary":"تحاول جيل فالنتاين الخروج من راكون سيتي قبل أن يطبق عليها الوباء. يلاحقها نيميسيس من شارع إلى آخر، وعليك أن تقرر بسرعة إن كانت مواجهته تستحق ما تبقّى من ذخيرة.","device":"ps1","img":"https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation/master/Named_Boxarts/Resident%20Evil%203%20-%20Nemesis%20%28USA%29.png","url":"https://psxdatacenter.com/games/U/R/SLUS-00923.html"},
 {"title":"Until Dawn","type":"psych","note":"توتر نفسي وغموض","summary":"يعود ثمانية أصدقاء إلى نُزل جبلي بعد عام من اختفاء فتاتين من المجموعة. تتنقّل بينهم طوال الليل، وقد يتوقف وصول أحدهم إلى الفجر على قرار بدا بسيطًا حين اتخذته.","url":"https://www.mobygames.com/game/74492/until-dawn/","img":"assets/covers/horror/until-dawn.jpg"},
 {"title":"P.T.","type":"psych","note":"توتر نفسي وغموض","summary":"تفتح بابًا في نهاية ممر منزلي فتجد نفسك عند بدايته. مع كل دورة يتغيّر تفصيل صغير، من صوت المذياع إلى ما تلمحه قرب الباب. كانت هذه التجربة القصيرة الإعلان التفاعلي عن مشروع Silent Hills.","img":"assets/covers/horror/pt.jpg","url":"https://www.gematsu.com/2014/08/p-t-announced-ps4-demo-released"},
 {"title":"Resident Evil 7: Biohazard","type":"survival","note":"استكشاف ونجاة","summary":"تصل إلى إيثان رسالة تقوده إلى منزل آل بيكر في لويزيانا بحثًا عن زوجته المفقودة. ومن منظور الشخص الأول، يصبح الاختباء خلف باب مغلق أو العودة إلى ممر سبق أن مررت به قرارًا تحسب له حسابه.","img":"https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/418370/header.jpg","url":"https://store.steampowered.com/app/418370/"},
 {"title":"Little Nightmares","type":"chase","note":"اختباء ومطاردة","summary":"تحاول طفلة تُدعى سيكس الهرب من سفينة ضخمة يسكنها أشخاص يفوقونها حجمًا. تتسلّق الأثاث وتزحف تحت الطاولات، وتنتظر اللحظة المناسبة للعبور قبل أن يلمحها أحد.","img":"https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/424840/header.jpg","url":"https://store.steampowered.com/app/424840/"},
 {"title":"Five Nights at Freddy’s","type":"survival","note":"استكشاف ونجاة","summary":"تتولّى الحراسة الليلية في مطعم عائلي تتحرك فيه الدمى الآلية بعد الإغلاق. تراقبها بالكاميرات وتغلق الأبواب عند اقترابها. وكل مرة تستخدم فيها هذه الأجهزة تقلّ الطاقة المتبقية حتى الصباح.","img":"https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/319510/header.jpg","url":"https://store.steampowered.com/app/319510/"},
 {"title":"The Evil Within 2","type":"survival","note":"استكشاف ونجاة","summary":"يدخل المحقّق سيباستيان عالمًا مصطنعًا بحثًا عن ابنته. في شوارع بلدة يونيون يمكنك الالتفاف حول الخطر أو تفتيش البيوت بحثًا عن مؤن، فيما تتداعى البلدة من حولك.","img":"https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/601430/header.jpg","url":"https://store.steampowered.com/app/601430/"},
 {"title":"The Quarry","type":"psych","note":"توتر نفسي وغموض","summary":"يقضي مرشدو مخيم هاكيتس كواري ليلة إضافية بعد مغادرة الأطفال. تبدأ الليلة بتجمّع حول النار، ثم تتنقّل بين شخصيات تتوقف سلامتها على ما تختاره لها، وعلى توقيت رد فعلك.","img":"https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1577120/header.jpg","url":"https://store.steampowered.com/app/1577120/"},
 {"title":"Bendy and the Ink Machine","type":"chase","note":"اختباء ومطاردة","summary":"يعود رسّام التحريك هنري إلى الاستوديو الذي عمل فيه قديمًا بعد دعوة من زميله السابق. رسوم الجدران مألوفة، لكن الحبر المتسرّب من الآلة الكبيرة أخذ يمنح بعضها حياةً خاصة.","img":"https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/622650/header.jpg","url":"https://store.steampowered.com/app/622650/"},
 {"title":"Amanda the Adventurer","type":"psych","note":"توتر نفسي وغموض","summary":"تعثر على أشرطة برنامج أطفال وتكتشف أن أماندا تنتظر منك كتابة الإجابات بنفسك. وما تكتبه على الشاشة قد يغيّر ما يحدث في البرنامج، أو يكشف شيئًا جديدًا في الغرفة التي تشاهده منها.","img":"https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2166060/header.jpg","url":"https://store.steampowered.com/app/2166060/"},
 {"title":"Fears to Fathom","type":"psych","note":"توتر نفسي وغموض","summary":"تقدّم السلسلة حكايات قصيرة يرويها أشخاص نجوا منها. تبدأ إحداها بمساء عادي في منزل خالٍ، ويتولد القلق من أشياء يسهل تجاهلها، مثل رسالة على الهاتف أو صوت يأتي من الطابق السفلي.","img":"https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1671340/header.jpg","url":"https://store.steampowered.com/app/1671340/"},
 {"title":"Poppy Playtime","type":"chase","note":"اختباء ومطاردة","summary":"تعود إلى مصنع الألعاب الذي كنت تعمل فيه بعد سنوات من اختفاء زملائك. تساعدك اليدان القابلتان للتمدد على تشغيل الآلات وفتح الأبواب، وقد تحتاجهما وأنت تحاول الإفلات مما يتحرك داخل المصنع.","img":"https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1721470/header.jpg","url":"https://store.steampowered.com/app/1721470/"},
 {"title":"Outlast","type":"chase","note":"اختباء ومطاردة","summary":"يدخل الصحفي مايلز أبشور مصحّة ماونت ماسيف ليتقصّى بلاغًا مجهولًا. كاميرته تتيح له الرؤية في العتمة، وبطارياتها محدودة. وحين يقترب أحد، أقرب خزانة قد تكون أفضل مكان تنتظر فيه.","img":"https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/238320/header.jpg","url":"https://store.steampowered.com/app/238320/"},
 {"title":"Choo-Choo Charles","type":"chase","note":"اختباء ومطاردة","summary":"تعبر جزيرة على متن قطار صغير، تجمع له قطع الغيار وتطوّر سلاحه. يمكنك النزول لاستطلاع المكان، لكن تشارلز، القطار الذي يمشي على أرجل طويلة، قد يقطع عليك طريق العودة.","img":"https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1766740/header.jpg","url":"https://store.steampowered.com/app/1766740/"},
 {"title":"Backrooms: Escape Together","type":"chase","note":"اختباء ومطاردة","summary":"تبحث مع رفاقك عن مخرج من غرف متشابهة وممرات يسهل أن تضلّوا فيها. يتبدل ترتيب الأماكن بين المحاولات، لذا يفيد أن تتبادلوا ما رأيتموه بدل أن ينطلق كل واحد في اتجاه.","img":"https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2141730/header.jpg","url":"https://store.steampowered.com/app/2141730/"},
 {"title":"Alien: Isolation","type":"survival","note":"استكشاف ونجاة","summary":"تصل أماندا ريبلي إلى محطة سيفاستوبول بحثًا عن تسجيل قد يفسّر اختفاء أمها. وحين يلتقط كاشف الحركة إشارة، عليك أن تقرر إن كان الوقت يكفي للعبور أم أن الأفضل أن تبقى في مخبئك.","img":"https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/214490/header.jpg","url":"https://store.steampowered.com/app/214490/"},
 {"title":"Alone in the Dark: The New Nightmare","type":"survival","note":"استكشاف ونجاة","summary":"يصل إدوارد كارنبي وألين سيدراك إلى جزيرة شادو في ظروف غامضة، ويمكنك متابعة التحقيق من منظور أيٍّ منهما. يفتح المصباح طريقك عبر العتمة، ويكشف تفاصيل قد تفوتك وأنت تبحث عن مفاتيح وأدلة.","device":"ps1","img":"https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation/master/Named_Boxarts/Alone%20in%20the%20Dark%20-%20The%20New%20Nightmare%20%28USA%29.png","url":"https://psxdatacenter.com/games/U/A/SLUS-01201.html"}
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
 button.addEventListener('click',()=>{
  dialog.querySelector('#gameTitle').textContent=game.title;
  dialog.querySelector('#gameSummary').textContent=game.summary;
  dialog.querySelector('#gameSource').href=game.url;
  const query=game.title.split(' (')[0];
  dialog.querySelector('#gameMagazines').href='magazines.html?'+new URLSearchParams({q:query});
  dialog.showModal();
 });
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
const entrance=document.querySelector('.horror-entrance'), reduced=matchMedia('(prefers-reduced-motion: reduce)');
let timer;
function finish(){clearTimeout(timer);entrance.hidden=true}
function play(){finish();if(reduced.matches)return;entrance.hidden=false;timer=setTimeout(finish,1900)}
entrance.addEventListener('animationend',event=>{if(event.target===entrance && event.animationName==='signal-end')finish()});
reduced.addEventListener('change',()=>{if(reduced.matches)finish()});
window.addEventListener('keydown',event=>{if(event.key==='Escape')finish()});
window.addEventListener('pagehide',finish);
if(!location.hash&&performance.getEntriesByType('navigation')[0]?.type==='navigate')play();
