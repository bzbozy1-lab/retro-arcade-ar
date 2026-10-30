"""Package large reading PDFs into exact byte ranges for static hosting.
PDF.js reads ranges without joining the entire file; explicit downloads rejoin it.
"""
from pathlib import Path
import json,hashlib,shutil
root=Path(__file__).resolve().parents[1];p=root/'assets/magazines/catalog.json';data=json.loads(p.read_text());backup=root/'.build/magazines';backup.mkdir(parents=True,exist_ok=True)
for item in data['items']:
 if not item.get('file'):continue
 source=root/item['file']
 item.pop('dimensions',None)
 chunk_size=10_000_000 if source.stat().st_size<=10_000_000 else 8_000_000
 directory=root/'assets/magazines/pdf'/item['id'];directory.mkdir(exist_ok=True);parts=[];offset=0
 with source.open('rb')as stream:
  while block:=stream.read(chunk_size):
   target=directory/f'chunk-{len(parts)+1:03}.bin';target.write_bytes(block);parts.append({'file':str(target.relative_to(root)),'offset':offset,'bytes':len(block),'sha256':hashlib.sha256(block).hexdigest()});offset+=len(block)
 item['chunks']=parts;item['file']=None;shutil.move(source,backup/source.name)
p.write_text(json.dumps(data,ensure_ascii=False,indent=2));print(json.dumps({'issues':len(data['items']),'bytes':sum(x['bytes']for x in data['items']),'pages':sum(x['pages']for x in data['items']),'chunks':sum(len(x.get('chunks',[]))for x in data['items'])}))
