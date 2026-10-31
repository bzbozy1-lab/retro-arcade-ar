/* A progressive navigation disclosure; storage and existing controls stay untouched. */
(function(){
 'use strict';
 function init(){
  if(['magazines','reader'].includes(document.body.dataset.page))return;
  const header=document.querySelector('header.nav');
  if(!header||document.querySelector('.mobile-nav-trigger'))return;
  const media=window.matchMedia('(max-width:700px)');
  const trigger=document.createElement('button');
  trigger.type='button';trigger.className='mobile-nav-trigger';
  trigger.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg><span>القائمة</span>';
  header.id=header.id||'carto-mobile-navigation';
  trigger.setAttribute('aria-controls',header.id);
  document.body.insertBefore(trigger,header);
  document.body.classList.add('mobile-nav-ready');
  let open=false,lastY=window.scrollY;
  function setOpen(value,restoreFocus){
   open=media.matches&&value;
   header.classList.toggle('mobile-nav-open',open);
   header.inert=media.matches&&!open;
   if(media.matches)header.setAttribute('aria-hidden',String(!open));else header.removeAttribute('aria-hidden');
   trigger.hidden=!media.matches;
   trigger.setAttribute('aria-expanded',String(open));
   trigger.setAttribute('aria-label',open?'إغلاق القائمة':'إظهار قائمة التنقل');
   trigger.querySelector('span').textContent=open?'إغلاق':'القائمة';
   if(restoreFocus)trigger.focus();
  }
  trigger.addEventListener('click',()=>setOpen(!open,false));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&open){setOpen(false,true);e.preventDefault();}});
  document.addEventListener('click',e=>{if(open&&!trigger.contains(e.target)&&(!header.contains(e.target)||e.target.closest('a')))setOpen(false,false);});
  document.addEventListener('focusin',e=>{if(open&&!header.contains(e.target)&&!trigger.contains(e.target))setOpen(false,false);});
  window.addEventListener('scroll',()=>{const y=window.scrollY;if(open&&Math.abs(y-lastY)>8)setOpen(false,header.contains(document.activeElement));lastY=y;},{passive:true});
  media.addEventListener('change',()=>setOpen(false,false));
  setOpen(false,false);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
