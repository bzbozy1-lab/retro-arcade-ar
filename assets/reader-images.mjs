/* Native page images: reading never waits for PDF parsing or its worker. */
import{readRange}from './magazine-range.mjs?v=reader-fast-1';
export async function fetchBytes(url,options={},fetcher=fetch,timeout=20000){
 const controller=new AbortController(),abort=()=>controller.abort();if(options.signal?.aborted)abort();options.signal?.addEventListener('abort',abort,{once:true});const timer=setTimeout(abort,timeout);
 try{const response=await fetcher(url,{...options,signal:controller.signal});if(!response.ok)throw Error('Page download failed');const data=await response.arrayBuffer();return{ok:true,status:response.status,arrayBuffer:async()=>data};}finally{clearTimeout(timer);options.signal?.removeEventListener('abort',abort);}
}
export function validatePageImages(issue,data){
 const prefix=`assets/magazines/pages/v2/${issue.id}/`;
 if(data.version!==1||data.id!==issue.id||data.sourceSHA256!==issue.sha256||!Array.isArray(data.pages)||data.pages.length!==issue.pages||!Array.isArray(data.packs)||!data.packs.length)throw Error('Invalid page manifest');
 for(const pack of data.packs){if(!pack.file.startsWith(prefix)||!/^((cover\.webp)|(pages-\d+\.bin))$/.test(pack.file.slice(prefix.length))||!Number.isInteger(pack.bytes)||pack.bytes<1||pack.bytes>3e6)throw Error('Invalid page pack');}
 for(const page of data.pages){const pack=data.packs[page.pack];if(!pack||!Number.isInteger(page.offset)||!Number.isInteger(page.bytes)||page.offset<0||page.bytes<12||page.offset+page.bytes>pack.bytes||!Number.isInteger(page.width)||!Number.isInteger(page.height)||page.width<1||page.height<1||page.width*page.height>12e6)throw Error('Invalid page bounds');}
 return true;
}
export class ImagePagesDocument{
 constructor(issue,data,{fetcher=fetch,decode=blob=>createImageBitmap(blob)}={}){
  validatePageImages(issue,data);this.numPages=data.pages.length;this.data=data;this.fetcher=fetcher;this.decode=decode;this.controller=new AbortController();this.cache=new Map();this.inflight=new Map();this.bytes=new Map();this.pending=new Map();this.closed=false;
 }
 async pageBytes(number){
  if(this.closed)throw Error('Reader closed');if(this.bytes.has(number)){const value=this.bytes.get(number);this.bytes.delete(number);this.bytes.set(number,value);return value;}if(this.pending.has(number))return this.pending.get(number);
  const task=(async()=>{const page=this.data.pages[number-1],pack=this.data.packs[page.pack];const options={signal:this.controller.signal,fetcher:(url,opts)=>fetchBytes(url,opts,this.fetcher),cache:this.cache,inflight:this.inflight};const data=await readRange([{...pack,offset:0}],page.offset,page.offset+page.bytes,options);if(String.fromCharCode(...data.subarray(0,4))!=='RIFF'||String.fromCharCode(...data.subarray(8,12))!=='WEBP')throw Error('Invalid page image');this.bytes.set(number,data);while(this.bytes.size>6)this.bytes.delete(this.bytes.keys().next().value);return data;})();this.pending.set(number,task);try{return await task;}finally{this.pending.delete(number);}
 }
 async getPage(number){
  if(!Number.isInteger(number)||number<1||number>this.numPages)throw Error('Invalid page number');const meta=this.data.pages[number-1],doc=this;
  return{rotate:0,getViewport({scale=1,rotation=0}){const sideways=rotation%180!==0;return{width:(sideways?meta.height:meta.width)*scale,height:(sideways?meta.width:meta.height)*scale,scale,rotation};},render({canvasContext:context,viewport,transform}){let cancelled=false;const promise=(async()=>{const bytes=await doc.pageBytes(number);const bitmap=await doc.decode(new Blob([bytes],{type:'image/webp'}));try{if(cancelled||doc.closed){const error=Error('Cancelled');error.name='RenderingCancelledException';throw error;}context.save();context.fillStyle='#fff';context.fillRect(0,0,context.canvas.width,context.canvas.height);context.translate(context.canvas.width/2,context.canvas.height/2);context.rotate(viewport.rotation*Math.PI/180);const scale=viewport.scale*(transform?.[0]||1);context.scale(scale,scale);context.drawImage(bitmap,-meta.width/2,-meta.height/2,meta.width,meta.height);context.restore();}finally{bitmap.close?.();}})();return{promise,cancel(){cancelled=true;}};}};
 }
 async destroy(){this.closed=true;this.controller.abort();this.cache.clear();this.inflight.clear();this.bytes.clear();this.pending.clear();}
}
export async function openImageDocument(issue,options={}){
 const expected=`assets/magazines/pages/v2/${issue.id}/pages.json`;if(issue.pageImages!==expected)throw Error('Missing page images');const response=await fetchBytes(expected,{},options.fetcher||fetch);const data=JSON.parse(new TextDecoder().decode(await response.arrayBuffer()));return new ImagePagesDocument(issue,data,options);
}
