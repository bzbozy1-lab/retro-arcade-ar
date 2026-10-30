(function(){
  "use strict";
  var root=document.documentElement;
  function readTheme(){try{return localStorage.getItem("carto-appearance")==="dark"?"dark":"light"}catch(e){return root.getAttribute("data-theme")==="dark"?"dark":"light"}}
  var scene='<span class="control-icon mode-scene" aria-hidden="true"><svg viewBox="0 0 32 32"><g class="mode-sun" fill="currentColor"><path d="M12 10h8v12h-8zM10 12h12v8H10zM15 3h2v4h-2zm0 22h2v4h-2zM3 15h4v2H3zm22 0h4v2h-4zM6 6h3v3H6zm17 17h3v3h-3zM23 6h3v3h-3zM6 23h3v3H6z"/></g><path class="mode-moon" d="M22 5h-8v3h-4v4H7v10h4v4h12v-3h4v-5h-8v-4h-4V7h7z" fill="currentColor"/></svg></span>';
  function applyTheme(theme){
    root.setAttribute("data-theme",theme);
    var meta=document.querySelector('meta[name="theme-color"]');
    if(meta)meta.setAttribute("content",theme==="dark"?"#15131A":"#F3EBDD");
    var button=document.querySelector(".nav .appearance-toggle");
    if(button){
      button.classList?.add('control-switch');
      button.innerHTML=scene+'<span class="control-copy"><span>مظهر الموقع</span><strong>'+(theme==='dark'?'داكن':'فاتح')+'</strong></span>';
      button.setAttribute('data-state',theme);
      button.setAttribute('aria-pressed',String(theme==='dark'));
      button.setAttribute('aria-label',theme==='dark'?'التبديل إلى المظهر الفاتح':'التبديل إلى المظهر الداكن');
    }
  }
  function init(){
    applyTheme(readTheme());
    var nav=document.querySelector(".navin");
    if(!nav)return;
    var button=document.querySelector(".nav .appearance-toggle");
    if(!button){
      button=document.createElement("button");
      button.type="button";button.className="appearance-toggle";
      button.addEventListener("click",function(){
        var next=root.getAttribute("data-theme")==="dark"?"light":"dark";
        try{localStorage.setItem("carto-appearance",next)}catch(e){}
        applyTheme(next);
        document.dispatchEvent?.(new CustomEvent("carto:theme-change",{detail:{theme:next}}));
      });
      nav.appendChild(button);
    }
    applyTheme(readTheme());
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();
