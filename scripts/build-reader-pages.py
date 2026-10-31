"""Build complete page-image derivatives; original PDF chunks are verified and retained."""
from pathlib import Path
import concurrent.futures,hashlib,json,urllib.request,time,io
import fitz
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]
BASE='https://bzbozy1-lab.github.io/retro-arcade-ar/'
CATALOG=ROOT/'assets/magazines/catalog.json'

def fetch_piece(piece):
 p=ROOT/piece['file'];p.parent.mkdir(parents=True,exist_ok=True)
 if p.exists() and p.stat().st_size==piece['bytes'] and hashlib.sha256(p.read_bytes()).hexdigest()==piece['sha256']:return p.read_bytes()
 for attempt in range(3):
  try:
   with urllib.request.urlopen(BASE+piece['file'],timeout=60) as response:data=response.read()
   assert len(data)==piece['bytes'] and hashlib.sha256(data).hexdigest()==piece['sha256'],piece['file']
   p.write_bytes(data);return data
  except Exception:
   if attempt==2:raise
   time.sleep(1)

def build(issue):
 data=b''.join(fetch_piece(x) for x in issue['chunks'])
 assert hashlib.sha256(data).hexdigest()==issue['sha256']
 doc=fitz.open(stream=data,filetype='pdf');assert len(doc)==issue['pages']
 dest=ROOT/'assets/magazines/pages/v2'/issue['id'];dest.mkdir(parents=True,exist_ok=True)
 pages=[];packs=[];buffer=bytearray();part=0
 def flush():
  nonlocal buffer,part
  if not buffer:return
  filename='cover.webp' if part==0 else f'pages-{part:03d}.bin'
  p=dest/filename;p.write_bytes(buffer)
  packs.append({'file':str(p.relative_to(ROOT)),'bytes':len(buffer),'sha256':hashlib.sha256(buffer).hexdigest()})
  buffer=bytearray();part+=1
 for n,page in enumerate(doc):
  scale=1280/page.rect.width
  pix=page.get_pixmap(matrix=fitz.Matrix(scale,scale),colorspace=fitz.csRGB,alpha=False)
  image=Image.frombytes('RGB',(pix.width,pix.height),pix.samples)
  output=io.BytesIO();image.save(output,format='WEBP',quality=82,method=4);blob=output.getvalue()
  if n==1 or (buffer and len(buffer)+len(blob)>1_000_000):flush()
  pages.append({'pack':part,'offset':len(buffer),'bytes':len(blob),'width':pix.width,'height':pix.height})
  buffer.extend(blob)
 flush();doc.close()
 manifest={'version':1,'id':issue['id'],'sourceSHA256':issue['sha256'],'pages':pages,'packs':packs}
 (dest/'pages.json').write_text(json.dumps(manifest,separators=(',',':')))
 # Original covers are needed by existing integrity tests, not replaced by these derivatives.
 cover=ROOT/issue['cover'];cover.parent.mkdir(parents=True,exist_ok=True)
 if not cover.exists():
  with urllib.request.urlopen(BASE+issue['cover'],timeout=30) as r:cover.write_bytes(r.read())
 return {'id':issue['id'],'pages':len(pages),'packs':len(packs),'bytes':sum(x['bytes'] for x in packs),'manifest':str((dest/'pages.json').relative_to(ROOT))}

if __name__=='__main__':
 catalog=json.loads(CATALOG.read_text());results=[]
 with concurrent.futures.ProcessPoolExecutor(max_workers=4) as pool:
  futures={pool.submit(build,x):x['id'] for x in catalog['items']}
  for f in concurrent.futures.as_completed(futures):
   item=f.result();results.append(item);print(json.dumps(item),flush=True)
 mapping={x['id']:x['manifest'] for x in results}
 for item in catalog['items']:item['pageImages']=mapping[item['id']]
 CATALOG.write_text(json.dumps(catalog,ensure_ascii=False,indent=2)+'\n')
 summary={'issues':len(results),'pages':sum(x['pages'] for x in results),'bytes':sum(x['bytes'] for x in results),'packs':sum(x['packs'] for x in results),'items':results}
 (ROOT/'reader-pages-build-v2.json').write_text(json.dumps(summary,indent=2));print(json.dumps({k:v for k,v in summary.items() if k!='items'}),flush=True)
