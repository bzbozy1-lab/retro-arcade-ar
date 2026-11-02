/* Owner-supplied magazine entry experiment; no video, loops or preference writes. */
(function(){
 'use strict';
 let clip=null,played=false,pending=false,attempt=0;
 const enabled=()=>window.CartoAudio?.enabled===true;
 const isToggle=event=>event.target.closest?.('.arcade-sound')||event.composedPath?.().some(node=>node.matches?.('.arcade-sound'));
 function stop(){attempt++;pending=false;if(clip){clip.pause();clip.currentTime=0;}}
 async function play(){
  if(played||pending||!enabled()||document.hidden)return;
  if(!clip){clip=new Audio('assets/sounds/magazine-entry.m4a');clip.preload='none';clip.volume=.65;clip.loop=false;clip.id='magazineEntryAudio';clip.hidden=true;document.body.appendChild(clip);}
  const ticket=++attempt;pending=true;
  try{await clip.play();if(ticket!==attempt)return;if(!enabled()||document.hidden){clip.pause();return;}played=true;}
  catch(error){/* Autoplay can be denied: retry only on an explicit interaction. */}
  finally{if(ticket===attempt)pending=false;}
 }
 function gesture(event){if(event.ctrlKey||event.metaKey||event.altKey||isToggle(event))return;play();}
 document.addEventListener('pointerdown',gesture,{capture:true,passive:true});
 document.addEventListener('keydown',gesture,{capture:true});
 document.addEventListener('click',event=>{if(isToggle(event)){if(enabled())play();else stop();}});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
 window.addEventListener('pagehide',stop);
 // The shared audio controller loads before this deferred, page-scoped script.
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',play,{once:true});else play();
})();
