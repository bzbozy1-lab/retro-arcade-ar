/* CARTO Arcade Experience — nonintrusive progressive enhancement */
(function(){
"use strict";
const doc=document,root=doc.documentElement;
function toast(message,duration=2600){
 const box=doc.getElementById("arcadeToast");if(!box)return;
 box.textContent=message;box.hidden=false;
 clearTimeout(toast.timer);toast.timer=setTimeout(()=>{box.hidden=true},duration);
}
window.CartoToast=toast;
function init(){
 const main=doc.querySelector("main");
 if(main){main.id=main.id||"main-content";const skip=doc.createElement("a");skip.className="skip-content";skip.href="#main-content";skip.textContent="تجاوز إلى المحتوى";doc.body.prepend(skip);}
 const nav=doc.querySelector(".nav");
 const navin=doc.querySelector(".navin");
 if(nav&&navin){
  const controls=doc.createElement("div");controls.className="arcade-controls";
  const btn=window.CartoAudio.createToggle();
  controls.append(btn);
  const theme=navin.querySelector(".appearance-toggle");
  if(theme)controls.append(theme);
  navin.append(controls);
  window.CartoAudio.refresh();
  const strip=doc.createElement("div");strip.className="arcade-ticker";strip.innerHTML='<b>PLAYER 01</b> ذاكرة الألعاب بلغتنا · اكتشف، اقرأ، وأضف ألعابك إلى قائمتك <b>● CARTO</b>';
  nav.insertAdjacentElement("afterend",strip);
 }
 const footer=doc.querySelector(".footer");
 if(footer){
  footer.classList.add("arcade-footer");
  const inner=footer.querySelector(".footerin");
  if(inner){
   const brand=inner.querySelector(".brand");
   if(brand){const p=doc.createElement("p");p.className="arcade-footer-info";p.textContent="أرشيف عربي لعوالم الألعاب الكلاسيكية، يصنعه الشغف والاكتشاف.";brand.append(p);
   const stamp=doc.createElement("span");stamp.className="arcade-footer-stamp";stamp.textContent="INSERT COIN · CARTO";brand.append(stamp)}
   const links=inner.querySelector(".footerlinks");
   if(links&&!links.querySelector('a[href="localization.html"]')){const a=doc.createElement("a");a.href="localization.html";a.textContent="الألعاب المعربة";links.append(a)}
   const bottom=doc.createElement("div");bottom.className="arcade-footer-bottom";bottom.innerHTML='<span>صُمم بروح ملصقات الألعاب القديمة والبكسل.</span><a href="identity.html">تعرّف إلى الهوية البصرية ↗</a>';
   inner.append(bottom);
  }
 }
 const toastEl=doc.createElement("div");toastEl.id="arcadeToast";toastEl.className="arcade-toast";toastEl.setAttribute("role","status");toastEl.setAttribute("aria-live","polite");toastEl.hidden=true;doc.body.append(toastEl);
 doc.addEventListener("carto:wishlist-change",event=>{if(event.detail?.action==="save")toast("✓ تم تحديث قائمتك الشخصية");else toast("تمت إزالة اللعبة من قائمتك")});
 const year=doc.getElementById("yearNow");if(year)year.textContent=new Date().getFullYear();

}
if(doc.readyState==="loading")doc.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();

