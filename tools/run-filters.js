// يشغّل الفلاتر على صور T-tast جوه Chromium (نفس كود التطبيق): كشف الحواف ← warp ← makeBase ← الفلاتر
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const APP=path.resolve(__dirname,'../app'),IMG=path.resolve(__dirname,'../tast/T-tast'),OUT=path.resolve(__dirname,'../out');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.json':'application/json','.woff':'font/woff','.webmanifest':'application/json'};
const srv=http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);if(p==='/')p='/index.html';const f=path.join(APP,p);fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);r.end();}else{r.writeHead(200,{'Content-Type':mime[path.extname(f)]||'application/octet-stream'});r.end(d);}});});
(async()=>{
  await new Promise(r=>srv.listen(0,r));const port=srv.address().port;
  const b=await chromium.launch();const pg=await b.newPage({viewport:{width:420,height:800}});
  pg.on('pageerror',e=>console.log('PAGEERR',e.message));
  await pg.goto(`http://localhost:${port}/index.html`);await pg.waitForFunction(()=>window.__edges&&window.__edges.makeBase,null,{timeout:20000});
  await pg.addScriptTag({url:`http://localhost:${port}/filters.js`});
  const only=process.argv[2];
  const files=fs.readdirSync(IMG).filter(f=>/\.jpg$/i.test(f)&&(!only||f.includes(only))).sort();
  const res=[];
  for(const f of files){
    const buf=fs.readFileSync(path.join(IMG,f)).toString('base64');
    const r=await pg.evaluate(async({b64,name})=>{
      const E=window.__edges;const blob=await (await fetch('data:image/jpeg;base64,'+b64)).blob();
      const bmp=await createImageBitmap(blob,{imageOrientation:'from-image'});
      const k=Math.min(1,1600/Math.max(bmp.width,bmp.height)),c=document.createElement('canvas');c.width=Math.round(bmp.width*k);c.height=Math.round(bmp.height*k);c.getContext('2d').drawImage(bmp,0,0,c.width,c.height);
      let cr=null;try{cr=await E.detectAsync(c);}catch(e){}
      cr=cr||[{x:0,y:0},{x:1,y:0},{x:1,y:1},{x:0,y:1}];
      const wc=E.warp(c,cr,1200),base=E.makeBase(wc);
      const out={name,w:base.w,h:base.h,times:{},imgs:{}};
      const ids=(window.__ids||['original','auto','magic','gray','bw','deshadow','flat','ink','print','card','hand']);
      for(const id of ids){
        const t0=performance.now();let cv;
        cv=E.toneCanvas(base,id,0,0,0); // المسار الحقيقي للتطبيق
        out.times[id]=Math.round(performance.now()-t0);
        const s=document.createElement('canvas');const q=Math.min(1,520/Math.max(base.w,base.h));s.width=Math.round(base.w*q);s.height=Math.round(base.h*q);s.getContext('2d').drawImage(cv,0,0,s.width,s.height);
        out.imgs[id]=s.toDataURL('image/jpeg',.85);
      }
      if(window.TXF&&TXF.analyze){const t1=performance.now();out.feat=TXF.analyze(base);out.featMs=Math.round(performance.now()-t1);}
      if(window.TXF&&TXF.pick){const t0=performance.now();const p=TXF.pick(base);out.pick=p;out.pickMs=Math.round(performance.now()-t0);}
      return out;
    },{b64:buf,name:f});
    res.push(r);
    const sm=Object.entries(r.times).map(([k,v])=>k+':'+v).join(' ');
    console.log(f.padEnd(32),`${r.w}x${r.h}`,sm,r.pick?`| pick=${r.pick.f} (${r.pick.whyAr}) ${r.pickMs}ms`:'');
  }
  fs.writeFileSync(path.join(OUT,'results.json'),JSON.stringify(res.map(r=>({...r,imgs:undefined}))));
  fs.mkdirSync(path.join(OUT,'imgs'),{recursive:true});
  for(const r of res)for(const[k,v] of Object.entries(r.imgs))fs.writeFileSync(path.join(OUT,'imgs',r.name.replace('.jpg','')+'__'+k+'.jpg'),Buffer.from(v.split(',')[1],'base64'));
  await b.close();srv.close();
})();
