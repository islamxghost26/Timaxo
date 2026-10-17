import sys,glob
from PIL import Image,ImageDraw
n=sys.argv[1];ids=sys.argv[2].split(',');out=sys.argv[3];cols=int(sys.argv[4]);CW=int(sys.argv[5]);CH=int(sys.argv[6])
base=glob.glob(f'out/imgs/{n}*__original.jpg')[0].split('__')[0]
rows=(len(ids)+cols-1)//cols;sh=Image.new('RGB',(cols*(CW+4),rows*(CH+4)),'#444')
for k,i in enumerate(ids):
    im=Image.open(f'{base}__{i}.jpg').convert('RGB');im.thumbnail((CW,CH));d=ImageDraw.Draw(im);d.rectangle([0,0,60,13],fill='black');d.text((2,1),i,fill='yellow')
    sh.paste(im,((k%cols)*(CW+4),(k//cols)*(CH+4)))
sh.save(out,quality=88);print(sh.size)
