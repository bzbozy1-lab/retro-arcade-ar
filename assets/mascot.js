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
 let timer;
 function mood(pose,duration=1600){
  clearTimeout(timer);
  const actors=document.querySelectorAll('.hero-mascot,.carto-mascot-live,.arcade-guide-robot,.page-companion');
  actors.forEach(el=>{el.dataset.cartoPose=poses.includes(pose)?pose:'happy';el.classList.remove('carto-react');void el.offsetWidth;el.classList.add('carto-react')});
  if(duration>0)timer=setTimeout(()=>actors.forEach(el=>{el.dataset.cartoPose='happy';el.classList.remove('carto-react')}),duration);
 }
 window.CartoMascot={markup,replace,mood,poses};
})();
