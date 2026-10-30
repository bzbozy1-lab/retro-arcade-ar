"""Create web-reading derivatives from local scans; source PDFs are never modified.
Usage: python scripts/build_magazines.py /absolute/path/to/upload
Requires PyMuPDF and Pillow. Manifest IDs must remain stable for saved progress.
"""
from pathlib import Path
import sys,json,hashlib,concurrent.futures
import fitz
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]
ITEMS=[
('sakhr-ax170','Sakhr AX-170 User Manual.pdf','صخر AX-170 — دليل المستخدم','manuals',0),
('sakhr-windows','دليل استخدام صخر على  الويندوز.pdf','صخر على الويندوز — دليل الاستخدام','manuals',0),
('resident-evil-3','مجلة خاصة - ريزدنت ايفل 3.pdf','ريزدنت إيفل 3 — عدد خاص','specials',0),
('dino-crisis-1','مجلة داينو كاريسيس الاولى.pdf','داينو كرايسيس — الحل الكامل','specials',0),
('dino-crisis-2','مجلة داينو كرايسيس الثانية.pdf','داينو كرايسيس 2 — الحل الكامل','specials',0),
('resident-evil-2','مجلة ريزدنت ايفل 2 حلول.pdf','ريزدنت إيفل 2 — حلول','specials',0),
('resident-evil-4-ps2','مجلة ريزدنت ايفل 4 نسخة بلايستيشن 2.pdf','ريزدنت إيفل 4 — PlayStation 2','specials',0),
('silent-hill-3','مجلة سايلنت هيل 3.pdf','سايلنت هيل 3','specials',0),
('silent-hill-1','مجلة سايلنت هيل.pdf','سايلنت هيل','specials',0),
('final-fantasy-7-part2','مجلة فاينل فانتسي 7 الجزء الثاني.pdf','فاينل فانتسي 7 — الجزء الثاني','specials',90),
('final-fantasy-8','مجلة فاينل فانتسي 8.pdf','فاينل فانتسي 8','specials',0),
('final-fantasy-9','مجلة فاينل فانتسي 9.pdf','فاينل فانتسي 9','specials',0),
('mortal-kombat-film','مجلة فيلم مورتال كومبات.pdf','مورتال كومبات — عدد الفيلم','specials',0),
('tekken-final-fantasy-7','مجلة لعبة تيكن و فاينل فانتسي 7.pdf','تيكن وفاينل فانتسي 7','specials',90),
('san-andreas','مجلة لعبة سان اندرياس.pdf','سان أندرياس — الحل الكامل','specials',0),
('collection-3','مجلة منوعة العدد الثالث.pdf','المجلة المنوعة — العدد الثالث','general',0),
('collection-5','مجلة منوعة العدد الخامس.pdf','المجلة المنوعة — العدد الخامس','general',0),
('yakuza','مجلة ياكوزا.pdf','ياكوزا — الحل الكامل','specials',0),
('resident-evil-issue5','مجلة ريزدنت ايفل العدد الخامس.pdf','ريزدنت إيفل — العدد الخامس','specials',0),
]
def build(item):
 id,filename,title,category,rotation=item;src=Path(sys.argv[1])/filename
 target=ROOT/'assets/magazines/pdf'/f'{id}.pdf';cover=ROOT/'assets/magazines/covers'/f'{id}.webp'
 original=fitz.open(src);out=fitz.open();dimensions=[]
 for i,page in enumerate(original):
  if rotation and page.rect.width>page.rect.height:page.set_rotation((page.rotation+rotation)%360)
  rect=page.rect;scale=min(1600/rect.width,2400/rect.height)
  pix=page.get_pixmap(matrix=fitz.Matrix(scale,scale),colorspace=fitz.csRGB,alpha=False)
  encoded=pix.tobytes('jpeg',jpg_quality=68)
  dest=out.new_page(width=rect.width,height=rect.height);dest.insert_image(dest.rect,stream=encoded)
  dimensions.append([round(rect.width,2),round(rect.height,2)])
  if i==0:
   im=Image.frombytes('RGB',(pix.width,pix.height),pix.samples);im.thumbnail((500,740));im.save(cover,'WEBP',quality=85,method=6)
 out.set_metadata({'title':title,'subject':'نسخة قراءة محسنة للويب من ملف ممسوح ضوئيًا','creator':'CARTO reading library','producer':'PyMuPDF'})
 out.save(target,garbage=4,deflate=True);out.close()
 record={'id':id,'title':title,'category':category,'pages':len(original),'file':str(target.relative_to(ROOT)),'cover':str(cover.relative_to(ROOT)),'bytes':target.stat().st_size,'originalBytes':src.stat().st_size,'sourceFilename':filename,'rotationNormalized':bool(rotation),'dimensions':dimensions,'sha256':hashlib.sha256(target.read_bytes()).hexdigest()}
 original.close();print(f'{id}: {record["pages"]} pages, {record["bytes"]/1e6:.2f} MB',flush=True);return record
if __name__=='__main__':
 selected=set(sys.argv[2:]);previous={}
 if selected and (ROOT/'assets/magazines/catalog.json').exists():previous={x['id']:x for x in json.loads((ROOT/'assets/magazines/catalog.json').read_text())['items']}
 with concurrent.futures.ProcessPoolExecutor(max_workers=3)as pool:generated=list(pool.map(build,[x for x in ITEMS if not selected or x[0]in selected]))
 previous.update({x['id']:x for x in generated});records=[previous[x[0]]for x in ITEMS if x[0]in previous]
 (ROOT/'assets/magazines/catalog.json').write_text(json.dumps({'version':1,'items':records},ensure_ascii=False,indent=2))
 print('TOTAL',sum(r['bytes']for r in records),'bytes',sum(r['pages']for r in records),'pages',flush=True)
