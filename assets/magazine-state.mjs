/* Magazine-only state. Existing game, achievement, sound and theme keys are untouched. */
export const KEY='carto-magazine-library-v1';
export const categories={general:'مجلات منوعة',specials:'حلول وأعداد خاصة',manuals:'أدلة الأجهزة'};
export const escapeHTML=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const formatSize=bytes=>(bytes/1e6).toFixed(1)+' م.ب';
export function readState(storage){try{storage=storage||globalThis.localStorage;const value=JSON.parse(storage.getItem(KEY)||'{}');return {saved:Array.isArray(value.saved)?value.saved.filter(x=>typeof x==='string'):[],progress:value.progress&&typeof value.progress==='object'?value.progress:{},bookmarks:value.bookmarks&&typeof value.bookmarks==='object'?value.bookmarks:{}}}catch{return{saved:[],progress:{},bookmarks:{}}}}
export function updateState(change,storage){try{storage=storage||globalThis.localStorage;const value=readState(storage);change(value);storage.setItem(KEY,JSON.stringify(value));return true}catch{return false}}
export function validPage(value,total){return Math.max(1,Math.min(total,Number.isInteger(Number(value))?Number(value):1))}
export function issueURL(id,page=1){const p=new URLSearchParams({id,page:String(page)});return 'reader.html?'+p}
export async function loadCatalog(url='assets/magazines/catalog.json'){const response=await fetch(url);if(!response.ok)throw Error('catalog');const data=await response.json();return data.items.filter(x=>/^[a-z0-9-]+$/.test(x.id)&&(x.file===`assets/magazines/pdf/${x.id}.pdf`||(!x.file&&Array.isArray(x.chunks)&&x.chunks.length>0&&x.chunks.every((c,i)=>c.file===`assets/magazines/pdf/${x.id}/chunk-${String(i+1).padStart(3,'0')}.bin`)))&&x.cover===`assets/magazines/covers/${x.id}.webp`&&x.pages>0)}
export function normalize(value){return String(value).toLowerCase().replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/[\u064B-\u065F]/g,'').replace(/[-–—]/g,' ').replace(/\s+/g,' ').trim()}

