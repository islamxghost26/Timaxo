const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const APP=path.resolve(__dirname,'../app'),IMG=path.resolve(__dirname,'../tast/T-tast/20260812_125053.jpg');
const srv=http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);if(p==='/')p='/index.html';fs.readFile(path.join(APP,p),(e,d)=>{if(e){r.writeHead(404);r.end();}else{r.writeHead(200,{'Content-Type':p.endsWith('.js')?'text/javascript':p.endsWith('.html')?'text/html':'application/octet-stream'});r.end(d);}});});
(async()=>{await new Promise(r=>srv.listen(0,r));const b=await chromium.launch(),pg=await b.newPage({viewport:{width:400,height:800}});
const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.goto(`http://localhost:${srv.address().port}/index.html`);await pg.waitForFunction(()=>window.__edges&&window.__edges.makeBase,null,{timeout:20000});
const b64=fs.readFileSync(IMG).toString('base64');
const prep=await pg.evaluate(async b64=>{const E=window.__edges,bl=await (await fetch('data:image/jpeg;base64,'+b64)).blob(),bmp=await createImageBitmap(bl,{imageOrientation:'from-image'});
const k=1600/Math.max(bmp.width,bmp.height),c=document.createElement('canvas');c.width=Math.round(bmp.width*k);c.height=Math.round(bmp.height*k);c.getContext('2d').drawImage(bmp,0,0,c.width,c.height);
const cr=await E.detectAsync(c),w=E.warp(c,cr,1200);window.__small=w;window.__big=E.makeBase(w);
const pk=640/Math.max(w.width,w.height),pc=document.createElement('canvas');pc.width=Math.round(w.width*pk);pc.height=Math.round(w.height*pk);pc.getContext('2d').drawImage(w,0,0,pc.width,pc.height);window.__pb=E.makeBase(pc);return[w.width,w.height,pc.width,pc.height];},b64);
console.log('full',prep.slice(0,2).join('x'),'preview',prep.slice(2).join('x'));
const cdp=await pg.context().newCDPSession(pg);await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
const res=await pg.evaluate(()=>{const E=window.__edges,out={},ids=['original','auto','magic','gray','bw','deshadow','flat','ink','print','hand','card'];
const med=a=>a.sort((x,y)=>x-y)[a.length>>1];
for(const id of ids){const r={};for(const[n,B]of[['full',__big],['prev',__pb]]){const t=[];for(let i=0;i<5;i++){const s=performance.now();E.toneCanvas(B,id,0,0,0);t.push(performance.now()-s);}r[n]=Math.round(med(t.slice(1)));}out[id]=r;}
const s=performance.now();TXF.pick(__big);out.pick=Math.round(performance.now()-s);return out;});
console.log('ms @4x CPU throttle (median, warm):');for(const[k,v]of Object.entries(res))console.log(k.padEnd(9),typeof v==='number'?v:`full ${v.full}  preview ${v.prev}`);
console.log('errors',errs);await b.close();srv.close();})();
