/* CARTO Arcade Experience — nonintrusive progressive enhancement */
(function(){
"use strict";
const doc=document,root=doc.documentElement;
let audioContext=null;
let soundEnabled=false;
try{soundEnabled=localStorage.getItem("carto-sound")==="on"}catch(e){}
const reduced=matchMedia("(prefers-reduced-motion: reduce)");
function beep(type){
 if(!soundEnabled)return;
 const AC=window.AudioContext||window.webkitAudioContext;
 if(!AC)return;
 try{
  audioContext=audioContext||new AC();
  if(audioContext.state==="suspended")audioContext.resume().catch(()=>{});
  const o=audioContext.createOscillator(),gain=audioContext.createGain(),t=audioContext.currentTime;
  o.type="square";
  const tones={tap:[380,550,.07],open:[420,680,.115],save:[530,880,.17]};
  const v=tones[type]||tones.tap;
  o.frequency.setValueAtTime(v[0],t);
  o.frequency.exponentialRampToValueAtTime(v[1],t+v[2]);
  gain.gain.setValueAtTime(.0001,t);
  gain.gain.exponentialRampToValueAtTime(.035,t+.01);
  gain.gain.exponentialRampToValueAtTime(.0001,t+v[2]);
  o.connect(gain);gain.connect(audioContext.destination);
  o.start(t);o.stop(t+v[2]+.01);
 }catch(e){}
}
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
  const btn=doc.createElement("button");btn.className="arcade-sound";btn.type="button";btn.setAttribute("aria-label","تفعيل أو تعطيل مؤثرات الموقع الصوتية");
  function paint(){btn.setAttribute("aria-pressed",String(soundEnabled));btn.textContent=soundEnabled?"🔊 الصوت: يعمل":"🔇 الصوت: مغلق"}
  paint();
  btn.addEventListener("click",()=>{soundEnabled=!soundEnabled;try{localStorage.setItem("carto-sound",soundEnabled?"on":"off")}catch(e){}paint();if(soundEnabled)beep("save");toast(soundEnabled?"تم تفعيل مؤثرات CARTO":"تم إيقاف المؤثرات الصوتية")});
  controls.append(btn);
  const theme=navin.querySelector(".appearance-toggle");
  if(theme)controls.append(theme);
  navin.append(controls);
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
 doc.addEventListener("click",e=>{
  if(e.target.closest(".arcade-sound"))return;
  if(e.target.closest("[data-details],[data-source],.wishlist-heart,[data-wish-name]")){beep("open");return}
  if(e.target.closest(".btn,.navlinks a,.platform,.local-btn,.appearance-toggle"))beep("tap");
 },{passive:true});
 doc.addEventListener("carto:wishlist-change",event=>{if(event.detail?.action==="save"){beep("save");toast("✓ تم تحديث قائمتك الشخصية")}else toast("تمت إزالة اللعبة من قائمتك")});
 const year=doc.getElementById("yearNow");if(year)year.textContent=new Date().getFullYear();
 if(!reduced.matches){
  const mascot=doc.querySelector(".brandmascot");
  mascot?.addEventListener("pointerenter",()=>{mascot.style.transform="rotate(-10deg) scale(1.08)"});
  mascot?.addEventListener("pointerleave",()=>{mascot.style.transform=""});
 }
}
if(doc.readyState==="loading")doc.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();

