import sys,glob,os
from PIL import Image,ImageDraw
ids=sys.argv[2].split(',');names=sys.argv[1].split(',');out=sys.argv[3];H=int(sys.argv[4]) if len(sys.argv)>4 else 380
rows=[]
for n in names:
    fs=[f for f in glob.glob(f'out/imgs/{n}*__original.jpg')]
    base=fs[0].split('__')[0]
    ims=[]
    for i in ids:
        im=Image.open(f'{base}__{i}.jpg').convert('RGB');k=H/im.height;im=im.resize((int(im.width*k),H));
        d=ImageDraw.Draw(im);d.rectangle([0,0,70,14],fill='black');d.text((2,1),i,fill='yellow');ims.append(im)
    rows.append(ims)
W=max(sum(i.width+4 for i in r) for r in rows);sheet=Image.new('RGB',(W,len(rows)*(H+4)),'white')
for y,r in enumerate(rows):
    x=0
    for im in r:sheet.paste(im,(x,y*(H+4)));x+=im.width+4
sheet.save(out,quality=85);print(sheet.size)
