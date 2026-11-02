"""Deterministic shared bundles; original sources stay editable and their order is retained."""
from pathlib import Path
import re,json,hashlib
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'assets/dist';OUT.mkdir(parents=True,exist_ok=True)
common=['assets/mascot.js','assets/audio.js','assets/dialog.js','assets/theme.js','assets/arcade-experience.js','assets/arcade-phase2.js','assets/phase3.js','assets/motion.js','assets/mobile-nav.js','assets/performance.js']
styles=['assets/style.css','assets/arcade-experience.css','assets/arcade-phase2.css','assets/audit-fixes.css','assets/phase3.css','assets/phase4.css']
manifest={}
def bundle(label,files,ext):
 content=('\n;\n' if ext=='js' else '\n').join((ROOT/f).read_text() for f in files)
 if ext=='css':
  # CSS sources are in assets/, while generated bundles are in assets/dist/.
  content=re.sub(r'url\(([^)]+)\)',lambda m: m[0] if re.match(r'[\s\x22\x27]*(data:|https?:|/|#)',m[1]) else 'url('+m[1].replace('\x22','').replace("'",'').replace('./','',1).join(['../',''])+')',content)
 digest=hashlib.sha256(content.encode()).hexdigest()[:12];path=f'assets/dist/{label}-{digest}.{ext}';(ROOT/path).write_text(content);manifest[path]=files
 return path
js=bundle('shared',common,'js');css=bundle('shared',styles,'css')
for page in ROOT.glob('*.html'):
 text=page.read_text()
 # Restore source entries first so repeated builds remain deterministic.
 text=re.sub(r'<script defer src="assets/dist/[^\"]+" data-sources="([^\"]+)"></script>',lambda m:''.join(f'<script defer src="{x}"></script>' for x in m[1].split()),text)
 text=re.sub(r'<link rel="stylesheet" href="assets/dist/[^\"]+" data-sources="([^\"]+)">',lambda m:''.join(f'<link rel="stylesheet" href="{x}">' for x in m[1].split()),text)
 # Core keeps the same DOMContentLoaded registration order on every page.
 for f in common:text=re.sub(r'<script\b[^>]*src="'+re.escape(f)+r'(?:\?[^\"]*)?"[^>]*></script>','',text)
 script=f'<script defer src="{js}" data-sources="'+ ' '.join(common)+'"></script>'
 # Place after app/catalog but before page modules, matching the previous dependency ordering.
 dependent=re.search(r'<script\b[^>]*src="assets/(?:catalog|app|wishlist|magazine-entry-audio)\.js',text)
 module=text.find('<script type="module"')
 position=dependent.start() if dependent else (module if module>=0 else text.rfind('</body>'))
 text=text[:position]+script+text[position:]
 for f in styles:text=re.sub(r'<link\b[^>]*href="'+re.escape(f)+r'(?:\?[^\"]*)?"[^>]*>','',text)
 text=text.replace('</title>','</title>'+f'<link rel="stylesheet" href="{css}" data-sources="'+ ' '.join(styles)+'">',1)
 # Cairo is fully overridden by Tajawal; keep only the three fonts actually used.
 text=re.sub(r'<link[^>]*href="https://fonts.googleapis.com/css2\?family=Cairo[^\"]*"[^>]*>','',text)
 if 'https://fonts.gstatic.com' not in text:text=text.replace('</title>','</title><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',1)
 if page.stem in ['archive','sources','localization','identity','sakhr']:
  text=re.sub(r'<script\b[^>]*src="assets/(app|wishlist)\.js[^\"]*"[^>]*></script>','',text)
 text=text.replace('reader.mjs?v=reader-fast-2','reader.mjs?v=opt-1').replace('magazines.mjs?v=magazines-2','magazines.mjs?v=opt-1')
 text=text.replace('assets/wishlist.js?v=opt-1','assets/wishlist.js?v=collection-2')
 # Version edited standalone scripts as well, without broad cache invalidation.
 text=re.sub(r'(assets/(?:app|wishlist|catalog)\.js)(?:\?[^\"]*)?',lambda m:m[1]+('?v=gba-2' if 'catalog.js' in m[1] else '?v=gba-1'),text)
 text=text.replace('assets/app.js?v=opt-1','assets/app.js?v=opt-3').replace('assets/app.js?v=opt-2','assets/app.js?v=opt-3')
 if page.stem=='reader':text=text.replace('</head>','<link rel="modulepreload" href="assets/reader-images.mjs?v=opt-1"><link rel="modulepreload" href="assets/reader-cache.mjs?v=opt-1"></head>') if 'modulepreload' not in text else text
 if page.stem=='reader':
  catalog=json.loads((ROOT/'assets/magazines/catalog.json').read_text())['items']
  fields=['id','title','category','cover','pages','bytes','sha256','pageImages']
  boot=json.dumps([{key:issue[key] for key in fields} for issue in catalog],ensure_ascii=False,separators=(',',':')).replace('<','\\u003c')
  text=re.sub(r'<script type="application/json" id="readerIssueIndex">.*?</script>','',text,flags=re.S)
  text=text.replace('</head>','<script type="application/json" id="readerIssueIndex">'+boot+'</script></head>')
 page.write_text(text)
(OUT/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
print(json.dumps({'sharedJS':js,'sharedCSS':css,'files':len(manifest)}))
