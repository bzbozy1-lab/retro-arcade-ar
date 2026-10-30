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
