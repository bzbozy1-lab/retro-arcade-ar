/* CARTO tube-glass experience: static CSS optics; isolated, versioned preferences. */
(function(){
 'use strict';
 const key='carto-crt-v1',levels={light:'خفيف',medium:'متوسط',strong:'قوي'};
 const root=document.documentElement;
 const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
 let state=read(),panel,settingsButton,pulse,pulseTimer,opened=false;
 function normalize(value){return {enabled:value?.enabled===true,level:Object.hasOwn(levels,value?.level)?value.level:'light'}}
 function read(){try{return normalize(JSON.parse(localStorage.getItem(key)||'null'))}catch{return normalize(null)}}
 function protectedReader(){return document.body?.dataset.page==='reader'}
 function effective(){return state.enabled&&!protectedReader()}
 function cancelPulse(){clearTimeout(pulseTimer);pulse?.removeAttribute('data-running');document.querySelectorAll('.crt-toggle').forEach(b=>b.classList.remove('crt-switching'))}
 function transition(){
  cancelPulse();
  if(motion.matches||protectedReader()||root.dataset.crtEconomy==='true'||!pulse)return;
  pulse.dataset.running=state.enabled?'on':'off';
  document.querySelectorAll('.crt-toggle').forEach(b=>b.classList.add('crt-switching'));
  pulseTimer=setTimeout(cancelPulse,420);
 }
 function render(){
  root.dataset.crt=state.enabled?'on':'off';root.dataset.crtLevel=state.level;
  root.dataset.crtProtected=String(protectedReader());
  document.querySelectorAll('[data-crt-toggle]').forEach(button=>{
   button.setAttribute('aria-pressed',String(state.enabled));
   button.setAttribute('aria-label',state.enabled?'إيقاف وضع CRT':'تشغيل وضع CRT');
   button.dataset.state=state.enabled?'on':'off';
   const label=button.querySelector('[data-crt-state]');
   if(label)label.textContent=state.enabled?(protectedReader()?'محفوظ':levels[state.level]):'مغلق';
  });
  document.querySelectorAll('[name="carto-crt-level"]').forEach(input=>input.checked=input.value===state.level);
  document.querySelectorAll('[data-crt-level-select]').forEach(select=>select.value=state.level);
  document.querySelectorAll('[data-crt-demo]').forEach(demo=>{demo.dataset.level=state.level;demo.dataset.enabled=String(state.enabled)});
  const note=document.querySelector('#crtSettingsNote');
  if(note)note.textContent=protectedReader()?'القراءة محمية: يُحفظ اختيارك للأقسام الأخرى، ويُوقف التأثير في قارئ المجلات.':state.enabled?'التأثير مفعّل بدرجة '+levels[state.level]+'.':'CRT مغلق. ستُستخدم هذه الدرجة عند تشغيله.';
 }
 function set(patch){
  const next=normalize({...state,...patch}),changed=next.enabled!==state.enabled;
  state=next;let saved=true;
  try{localStorage.setItem(key,JSON.stringify(state))}catch{saved=false}
  render();if(changed)transition();
  const status=document.querySelector('#crtStatus');
  if(status)status.textContent=(state.enabled?'CRT '+levels[state.level]:'تم إيقاف CRT')+(protectedReader()?'؛ قارئ المجلات محمي.':'.')+(!saved?' تعذر حفظ التفضيل؛ يعمل لهذه الصفحة فقط.':'');
 }
 // A 40-unit pixel television: stepped cabinet, aerial, glass and two physical controls.
 const icon='<span class="control-icon crt-icon" aria-hidden="true"><svg viewBox="0 0 40 40" shape-rendering="crispEdges"><path d="M12 2h3v3h3v3h-4V6h-2zm14 0h3v4h-2v2h-4V5h3z" fill="currentColor"/><path d="M5 9h30v3h3v21h-3v3H5v-3H2V12h3z" fill="var(--crt-cabinet)" stroke="currentColor" stroke-width="2"/><path d="M7 14h20v15H7z" class="crt-icon-glass"/><g class="crt-icon-signal"><path d="M10 17h14v2H10zm0 5h14v2H10z" fill="var(--crt-signal)"/><path d="M10 26h9v1h-9z" fill="currentColor"/></g><path d="M31 15h3v3h-3zm0 7h3v3h-3zM8 36h5v3H8zm19 0h5v3h-5z" fill="currentColor"/><path d="M31 29h3v3h-3z" class="crt-icon-power"/></svg></span>';
 function closeSettings(restore=false){
  if(!panel||!opened)return;
  if(typeof panel.hidePopover==='function'&&panel.matches(':popover-open'))panel.hidePopover();
  panel.hidden=true;opened=false;settingsButton.setAttribute('aria-expanded','false');
  if(restore)settingsButton.focus();
 }
 function openSettings(){
  if(opened){closeSettings();return;}
  panel.hidden=false;
  if(typeof panel.showPopover==='function')panel.showPopover();
  opened=true;settingsButton.setAttribute('aria-expanded','true');
  const rect=settingsButton.getBoundingClientRect(),bounds=panel.getBoundingClientRect();
  panel.style.top=Math.max(12,Math.min(rect.bottom+10,window.innerHeight-bounds.height-12))+'px';
  panel.style.right=Math.max(12,Math.min(window.innerWidth-rect.right,window.innerWidth-bounds.width-12))+'px';
  panel.querySelector('input:checked')?.focus({preventScroll:true});
 }
 function init(){
  const controls=document.querySelector('.arcade-controls');
  if(controls&&!document.querySelector('.crt-control')){
   const group=document.createElement('div');group.className='crt-control';group.setAttribute('role','group');group.setAttribute('aria-label','شاشة CRT');
   group.innerHTML='<button type="button" class="control-switch crt-toggle" data-crt-toggle>'+icon+'<span class="control-copy"><span>شاشة <bdi lang="en">CRT</bdi></span><strong data-crt-state>مغلق</strong></span></button><button type="button" class="crt-settings-button" aria-label="إعدادات شدة CRT" aria-expanded="false" aria-controls="crtSettings"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 17h16M8 4v6m8 4v6" fill="none" stroke="currentColor" stroke-width="2"/></svg></button><div class="crt-settings" id="crtSettings" popover="auto" hidden><div class="crt-settings-heading"><strong>إعدادات الشاشة</strong><button type="button" data-crt-close aria-label="إغلاق إعدادات CRT">إغلاق</button></div><fieldset><legend>شدة CRT</legend><div class="crt-levels">'+Object.entries(levels).map(([value,label])=>'<label><input type="radio" name="carto-crt-level" value="'+value+'"><span>'+label+'</span></label>').join('')+'</div></fieldset><p id="crtSettingsNote"></p><a href="identity.html#cartoCRT">تعرّف إلى التجربة ←</a></div>';
   controls.append(group);panel=group.querySelector('#crtSettings');settingsButton=group.querySelector('.crt-settings-button');
   settingsButton.addEventListener('click',openSettings);
   panel.querySelector('[data-crt-close]').addEventListener('click',()=>closeSettings(true));
   panel.addEventListener('toggle',event=>{if(event.newState==='closed'){opened=false;panel.hidden=true;settingsButton.setAttribute('aria-expanded','false')}});
  }
  if(!protectedReader()){
   const lens=document.createElement('div');lens.id='cartoCrtLens';lens.setAttribute('aria-hidden','true');document.body.append(lens);
   pulse=document.createElement('div');pulse.id='cartoCrtTransition';pulse.setAttribute('aria-hidden','true');document.body.append(pulse);
  }
  const status=document.createElement('span');status.id='crtStatus';status.className='crt-visually-hidden';status.setAttribute('role','status');document.body.append(status);
  document.addEventListener('click',event=>{
   if(event.target.closest('[data-crt-toggle]'))set({enabled:!state.enabled});
   if(opened&&!panel.contains(event.target)&&!settingsButton.contains(event.target))closeSettings();
  });
  document.addEventListener('change',event=>{
   if(event.target.matches('[name="carto-crt-level"],[data-crt-level-select]'))set({level:event.target.value});
  });
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&opened){closeSettings(true);event.preventDefault()}});
  window.addEventListener('resize',()=>closeSettings());
  // Scroll that closes the mobile header also dismisses its settings surface.
  window.addEventListener('scroll',()=>closeSettings(),{passive:true});
  window.addEventListener('storage',event=>{if(event.key===key||event.key===null){cancelPulse();state=read();render()}});
  window.addEventListener('pageshow',event=>{if(event.persisted){cancelPulse();state=read();render()}});
  motion.addEventListener('change',cancelPulse);
  render();
 }
 root.dataset.crtEconomy=String(window.navigator?.connection?.saveData===true);
 root.dataset.crt=state.enabled?'on':'off';root.dataset.crtLevel=state.level;
 // Exposed for deterministic tests; all runtime changes still pass through the UI/storage owner.
 window.CartoCRT={get state(){return {...state}},get active(){return effective()},set};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
