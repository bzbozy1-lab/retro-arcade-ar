/* Native CARTO cursors. No follower, animation, pointer tracking or layout changes. */
(function(){
 'use strict';
 const key='carto-cursor-v1',root=document.documentElement;
 const mouse=window.matchMedia('(any-hover: hover) and (any-pointer: fine)');
 const contrast=window.matchMedia('(forced-colors: active)');
 let enabled=read();const warmed=[];
 function read(){try{return JSON.parse(localStorage.getItem(key)||'null')?.enabled!==false}catch{return true}}
 function render(){
  root.dataset.cartoCursor=enabled&&mouse.matches&&!contrast.matches?'on':'off';
  if(root.dataset.cartoCursor==='on'&&!warmed.length){for(const name of ['arrow','glove','pak'])for(const state of ['','-pressed']){const image=new Image();image.src='assets/cursors/'+name+state+'.svg';warmed.push(image)}}
  document.querySelectorAll('[data-cursor-toggle]').forEach(button=>{
   button.setAttribute('aria-pressed',String(enabled));
   button.textContent=enabled?'مؤشرات كارتو · مفعّلة للفأرة':'مؤشر النظام · مفعّل';
   button.setAttribute('aria-label',enabled?'استخدام مؤشر النظام بدل مؤشرات كارتو':'تشغيل مؤشرات كارتو');
  });
 }
 function set(value){enabled=value===true;let saved=true;try{localStorage.setItem(key,JSON.stringify({enabled}))}catch{saved=false}render();const status=document.querySelector('#cursorDemoStatus');if(status)status.textContent=(enabled?'تم تفعيل مؤشرات كارتو للفأرة الدقيقة.':'تمت العودة إلى مؤشر النظام.')+(!saved?' تعذر حفظ التفضيل؛ يعمل لهذه الصفحة فقط.':'');}
 render();
 function init(){
  render();
  document.addEventListener('click',event=>{
   if(event.target.closest('[data-cursor-toggle]'))set(!enabled);
   const demo=event.target.closest('[data-cursor-demo]');
   if(demo){const status=document.querySelector('#cursorDemoStatus');if(status)status.textContent=demo.dataset.cursorDemo==='pak'?'تجربة سهم الشريط: رأس السهم هو موضع النقر.':'تجربة القفاز: رأس الإصبع هو موضع النقر.';}
  });
  mouse.addEventListener('change',render);contrast.addEventListener('change',render);
  window.addEventListener('storage',event=>{if(event.key===key||event.key===null){enabled=read();render()}});
  window.addEventListener('pageshow',event=>{if(event.persisted){enabled=read();render()}});
 }
 window.CartoCursor={set,get enabled(){return enabled},get active(){return root.dataset.cartoCursor==='on'}};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
