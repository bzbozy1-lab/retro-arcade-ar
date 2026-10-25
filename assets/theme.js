(function(){
  "use strict";
  var root=document.documentElement;
  function readTheme(){try{return localStorage.getItem("carto-appearance")==="dark"?"dark":"light"}catch(e){return root.getAttribute("data-theme")==="dark"?"dark":"light"}}
  function applyTheme(theme){
    root.setAttribute("data-theme",theme);
    var meta=document.querySelector('meta[name="theme-color"]');
    if(meta)meta.setAttribute("content",theme==="dark"?"#15131A":"#F3EBDD");
    var button=document.querySelector(".appearance-toggle");
    if(button){button.textContent=theme==="dark"?"☀️ المظهر الفاتح":"🌙 المظهر الداكن";button.setAttribute("aria-pressed",theme==="dark"?"true":"false");button.setAttribute("aria-label",theme==="dark"?"التبديل إلى المظهر الفاتح":"التبديل إلى المظهر الداكن");}
  }
  function init(){
    applyTheme(readTheme());
    var nav=document.querySelector(".navin");
    if(!nav)return;
    var button=document.querySelector(".appearance-toggle");
    if(!button){
      button=document.createElement("button");
      button.type="button";button.className="appearance-toggle";
      button.addEventListener("click",function(){
        var next=root.getAttribute("data-theme")==="dark"?"light":"dark";
        try{localStorage.setItem("carto-appearance",next)}catch(e){}
        applyTheme(next);
      });
      nav.appendChild(button);
    }
    applyTheme(readTheme());
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();