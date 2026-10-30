/* CARTO sticker motion: bounded, event-driven, no frame loop or per-card listeners. */
(function(){
 'use strict';
 const query=window.matchMedia('(prefers-reduced-motion: reduce)');
 let visible=new WeakSet();const timers=new WeakMap();let observer;
 const cards='.platform,.gamecard,.archivecard,.gaming-source-card,.local-card,.term,.wishlist-group,.character-poses figure,.identity-card,.arcade-achievement';
 function pulse(el,name='carto-pressed',duration=620){
  if(!el||query.matches)return;
  el.classList.remove(name);void el.offsetWidth;el.classList.add(name);
  let active=timers.get(el);if(!active){active=new Map();timers.set(el,active)}
  clearTimeout(active.get(name));active.set(name,setTimeout(()=>{el.classList.remove(name);active.delete(name)},duration));
 }
 function enroll(){
  if(query.matches||!('IntersectionObserver'in window))return;
  if(!observer)observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
   if(!entry.isIntersecting)return;
   observer.unobserve(entry.target);pulse(entry.target,'sticker-arrive',720);
  }),{threshold:.12});
  document.querySelectorAll(cards).forEach((el,i)=>{if(visible.has(el))return;visible.add(el);el.style.setProperty('--sticker-order',Math.min(i%4,3));observer.observe(el)});
 }
 function init(){
  enroll();
  document.addEventListener('carto:catalog-render',enroll);
  document.addEventListener('carto:wishlist-change',()=>{enroll();pulse(document.querySelector('.wishlist-group:has(.wishlist-heart:focus)'), 'sticker-arrive',720)});
  document.addEventListener('carto:theme-change',()=>pulse(document.documentElement,'carto-theme-shift',850));
  document.addEventListener('carto:dialog-open',event=>pulse(event.detail?.dialog?.querySelector('.wishlist-modalbox,.modalbox'),'sticker-open',500));
  document.addEventListener('click',event=>{
   const button=event.target.closest('button,.btn,.local-btn,.platform,.navlinks a,.footerlinks a');
   if(button&&!button.disabled)pulse(button);
   const sound=event.target.closest('.arcade-sound');if(sound)document.querySelectorAll('.arcade-sound').forEach(el=>pulse(el,'control-performance',850));
  },true);
  const roots=document.querySelectorAll('#gameGrid,#gemGrid');
  roots.forEach(el=>new MutationObserver(enroll).observe(el,{childList:true}));
  query.addEventListener('change',()=>{if(query.matches){observer?.disconnect();document.querySelectorAll('.sticker-arrive,.carto-pressed,.sticker-open,.control-performance').forEach(el=>el.classList.remove('sticker-arrive','carto-pressed','sticker-open','control-performance'))}else{visible=new WeakSet();enroll()}});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
