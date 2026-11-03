"""Original CARTO pixel cursors. Deterministic SVG + transparent PNG, stdlib only."""
from pathlib import Path
import json,struct,zlib,hashlib
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'assets/cursors';OUT.mkdir(exist_ok=True)
INK='#101216';PAPER='#FFFBF2'
PALETTES={'lime':['#F2FFAB','#C8F31D','#87B915'],'blue':['#A8BEFF','#2F5BFF','#1535B8'],'orange':['#FFC18A','#FF5B2E','#C73517'],'cream':['#FFFFFF','#FFF4DA','#DCC99F']}
ARROW=[(4,4),(6,4),(6,6),(8,6),(8,8),(10,8),(10,10),(12,10),(12,12),(14,12),(14,14),(16,14),(16,16),(18,16),(18,18),(13,18),(13,21),(15,21),(15,25),(12,25),(12,23),(10,23),(10,20),(8,20),(8,18),(6,18),(6,21),(4,21)]
HAND=[(12,4),(15,4),(15,13),(17,13),(17,11),(20,11),(20,13),(23,13),(23,15),(26,15),(26,23),(24,23),(24,26),(12,26),(12,24),(9,24),(9,21),(6,21),(6,17),(8,17),(8,18),(12,20)]
def inside(x,y,points):
 yes=False
 for (x1,y1),(x2,y2) in zip(points,points[1:]+points[:1]):
  if (y1>y)!=(y2>y) and x<(x2-x1)*(y-y1)/(y2-y1)+x1:yes=not yes
 return yes
def mask(points):return {(x,y) for y in range(32) for x in range(32) if inside(x+.5,y+.5,points)}
def rect(x,y,w,h):return {(a,b) for a in range(x,x+w) for b in range(y,y+h)}
def dilate(points,r):return {(x+dx,y+dy) for x,y in points for dx in range(-r,r+1) for dy in range(-r,r+1) if 0<=x+dx<32 and 0<=y+dy<32}
def rgb(color):return tuple(int(color[i:i+2],16) for i in (1,3,5))
def color_at(color,x,y):
 if color not in PALETTES:return rgb(color)
 stops=[rgb(c) for c in PALETTES[color]];t=(x+y+1)/64;idx=0 if t<=.5 else 1;f=t*2-idx
 return tuple(round(stops[idx][n]*(1-f)+stops[idx+1][n]*f) for n in range(3))
def path(points):
 commands=[]
 for y in range(32):
  xs=sorted(x for x,b in points if b==y);i=0
  while i<len(xs):
   start=xs[i];end=start+1;i+=1
   while i<len(xs) and xs[i]==end:end+=1;i+=1
   commands.append(f'M{start} {y}h{end-start}v1H{start}z')
 return ''.join(commands)
def png(pixels):
 def chunk(kind,data):return struct.pack('>I',len(data))+kind+data+struct.pack('>I',zlib.crc32(kind+data)&0xffffffff)
 rows=b''.join(b'\0'+bytes(v for x in range(32) for v in pixels.get((x,y),(0,0,0,0))) for y in range(32))
 return b'\x89PNG\r\n\x1a\n'+chunk(b'IHDR',struct.pack('>IIBBBBB',32,32,8,6,0,0,0))+chunk(b'IDAT',zlib.compress(rows,9))+chunk(b'IEND',b'')
manifest={'version':1,'size':[32,32],'families':{}}
for family in ['arrow','glove','pak']:
 info={'hotspot':[12,3] if family=='glove' else [3,3],'states':{}}
 for state in ['normal','pressed']:
  layers=[]
  def paint(points,color):layers.append((points,color))
  def sticker(points,color):paint(dilate(points,2),PAPER);paint(dilate(points,1),INK);paint(points,color)
  if family=='glove':
   sticker(mask(HAND),'cream');paint(rect(12,25,12,4),'blue' if state=='pressed' else 'orange');paint(rect(11,25,1,5)|rect(24,25,1,5)|rect(12,29,12,1),INK);paint(rect(17,15,1,5)|rect(21,16,1,4),INK);paint(rect(13,26,8,1),PAPER)
   if state=='pressed':paint(rect(16,21,6,1),'#2F5BFF')
  else:
   sticker(mask(ARROW),'blue' if state=='pressed' and family=='arrow' else 'lime');paint(rect(5,7,1,8),PAPER);paint(rect(11,21,2,3),'#2F5BFF')
   if family=='pak':
    sticker(rect(20,18,9,10),'orange' if state=='pressed' else 'blue');paint(rect(22,20,5,4),INK);paint(rect(23,21,3,1),PAPER)
    for x in [21,23,25,27]:paint(rect(x,27,1,2),'#FFCC45')
  pixels={};svg=[]
  for points,color in layers:
   svg.append('<path fill="'+('url(#'+color+')' if color in PALETTES else color)+'" d="'+path(points)+'"/>')
   for x,y in points:pixels[(x,y)]=(*color_at(color,x,y),255)
  defs=''.join('<linearGradient id="'+name+'" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="32" y2="32">'+''.join(f'<stop offset="{offset}" stop-color="{c}"/>' for offset,c in zip(['0','.5','1'],colors))+'</linearGradient>' for name,colors in PALETTES.items())
  name=family+('-pressed' if state=='pressed' else '');source='<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" shape-rendering="crispEdges"><title>CARTO '+family+' '+state+'</title><defs>'+defs+'</defs>'+''.join(svg)+'</svg>\n'
  (OUT/(name+'.svg')).write_text(source);(OUT/(name+'.png')).write_bytes(png(pixels))
  info['states'][state]={ext:{'file':f'assets/cursors/{name}.{ext}','bytes':(OUT/(name+'.'+ext)).stat().st_size,'sha256':hashlib.sha256((OUT/(name+'.'+ext)).read_bytes()).hexdigest()} for ext in ['svg','png']}
 manifest['families'][family]=info
(OUT/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
print('Six original cursor states, SVG and PNG:',sum(p.stat().st_size for p in OUT.glob('*') if p.suffix in ['.svg','.png']),'bytes')
