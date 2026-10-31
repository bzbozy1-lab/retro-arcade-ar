/* Local search only: no program downloads, embedded players or preference writes. */
(function(){
 'use strict';
 function normalize(value){return String(value||'').toLowerCase().normalize('NFKC').replace(/[\u064B-\u065F\u0670\u0640]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/\s+/g,' ').trim();}
 function matches(item,query,publisher){return (!publisher||item.publisher===publisher)&&normalize(item.search).includes(normalize(query));}
 window.CartoSakhr={normalize,matches};
 function init(){
  const input=document.getElementById('sakhrSearch'),publisher=document.getElementById('sakhrPublisher');if(!input||!publisher)return;
  const cards=[...document.querySelectorAll('.sakhr-program')],count=document.getElementById('sakhrResultCount'),empty=document.getElementById('sakhrEmpty');
  function update(){let shown=0;for(const card of cards){card.hidden=!matches(card.dataset,input.value,publisher.value);if(!card.hidden)shown++;}count.textContent=shown===0?'لا توجد نتائج':shown===1?'مادة واحدة':shown===2?'مادتان':shown+' مواد';empty.hidden=shown!==0;}
  input.addEventListener('input',update);publisher.addEventListener('change',update);
  document.getElementById('sakhrReset').addEventListener('click',()=>{input.value='';publisher.value='';update();input.focus();});
  document.querySelector('[data-sakhr-tools]').hidden=false;update();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
