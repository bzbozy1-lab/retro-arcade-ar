/* Fit a complete page, reuse rendered neighbours, and keep a bounded bitmap cache. */
export function pageLayout(natural,{width,height,zoom=1,ratio=1}){
 const scale=Math.min(Math.max(80,width)/natural.width,Math.max(80,height)/natural.height)*zoom;
 const w=natural.width*scale,h=natural.height*scale;
 const density=Math.min(Math.max(1,ratio),zoom>1?2:1.6,Math.sqrt(6e6/(w*h)));
 return {scale,width:w,height:h,ratio:density,pixelWidth:Math.max(1,Math.floor(w*density)),pixelHeight:Math.max(1,Math.floor(h*density))};
}
export function swipeStep(dx,dy,zoom=1){return zoom>1||Math.abs(dx)<55||Math.abs(dx)<Math.abs(dy)*1.4?0:dx>0?1:-1;}
export class PageCache{
 constructor(pdf,{canvas=()=>document.createElement('canvas'),limit=3,pixels=8e6}={}){this.pdf=pdf;this.canvas=canvas;this.limit=limit;this.pixels=pixels;this.cache=new Map();this.pending=new Map();this.tasks=new Set();this.closed=false;}
 async get(number,options){
  if(this.closed)throw Error('Reader closed');const key=[number,Math.round(options.width),Math.round(options.height),options.zoom,options.rotation,options.ratio].join(':');
  if(this.cache.has(key)){const value=this.cache.get(key);this.cache.delete(key);this.cache.set(key,value);return value;}
  if(this.pending.has(key))return this.pending.get(key);
  const promise=(async()=>{const page=await this.pdf.getPage(number);if(this.closed)throw Error('Reader closed');const rotation=(page.rotate+(options.rotation||0))%360,natural=page.getViewport({scale:1,rotation}),layout=pageLayout(natural,options),view=page.getViewport({scale:layout.scale,rotation}),canvas=this.canvas();canvas.width=layout.pixelWidth;canvas.height=layout.pixelHeight;canvas.style.width=Math.floor(view.width)+'px';canvas.style.height=Math.floor(view.height)+'px';const task=page.render({canvasContext:canvas.getContext('2d',{alpha:false}),viewport:view,transform:layout.ratio!==1?[layout.ratio,0,0,layout.ratio,0,0]:null,background:'rgb(255,255,255)'});this.tasks.add(task);try{await task.promise;}finally{this.tasks.delete(task);}if(this.closed)throw Error('Reader closed');const value={canvas,width:Math.floor(view.width),height:Math.floor(view.height),number};this.cache.set(key,value);let pixels=[...this.cache.values()].reduce((n,x)=>n+x.canvas.width*x.canvas.height,0);while(this.cache.size>1&&(this.cache.size>this.limit||pixels>this.pixels)){const first=this.cache.keys().next().value,old=this.cache.get(first);pixels-=old.canvas.width*old.canvas.height;this.cache.delete(first);}return value;})();
  this.pending.set(key,promise);try{return await promise;}finally{this.pending.delete(key);}
 }
 dispose(){this.closed=true;for(const task of this.tasks)task.cancel();this.cache.clear();this.pending.clear();}
}
