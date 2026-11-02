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
 const reactions=new WeakMap();
 function mood(pose,duration=1600,actor){
  if(!actor||!actor.matches('[data-carto-feedback]'))return;
  const previous=reactions.get(actor);
  if(previous)clearTimeout(previous.timer);
  const baseline=previous?.baseline||actor.dataset.cartoPose||'happy';
  actor.dataset.cartoPose=poses.includes(pose)?pose:baseline;
  actor.classList.remove('carto-react');
  if(!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches){void actor.offsetWidth;actor.classList.add('carto-react')}
  const timer=duration>0?setTimeout(()=>{actor.dataset.cartoPose=baseline;actor.classList.remove('carto-react');reactions.delete(actor)},duration):null;
  reactions.set(actor,{baseline,timer});
 }
 window.CartoMascot={markup,replace,mood,poses};
})();
