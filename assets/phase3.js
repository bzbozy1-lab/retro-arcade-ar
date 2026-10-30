(function(){
 'use strict';
 function animate(button){
  button.classList.remove('is-switching');void button.offsetWidth;button.classList.add('is-switching');
  clearTimeout(button.cartoAnimation);button.cartoAnimation=setTimeout(()=>button.classList.remove('is-switching'),650);
 }
 function syncThemePreview(){
  const main=document.querySelector('.nav .appearance-toggle');
  if(!main)return;
  document.querySelectorAll('[data-theme-preview]').forEach(button=>{
   button.innerHTML=main.innerHTML;
   ['aria-label','aria-pressed','data-state'].forEach(attr=>button.setAttribute(attr,main.getAttribute(attr)));
  });
 }
 function init(){
  syncThemePreview();window.CartoAudio.refresh();
  document.addEventListener('carto:theme-change',()=>{syncThemePreview();document.querySelectorAll('.appearance-toggle').forEach(animate)});
  document.addEventListener('click',event=>{
   const sample=event.target.closest('[data-theme-preview]');
   if(sample)document.querySelector('.nav .appearance-toggle')?.click();
   const sound=event.target.closest('.arcade-sound');if(sound)animate(sound);
  });
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
