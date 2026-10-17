const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const APP=path.resolve(__dirname,'../app');
const srv=http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);if(p==='/')p='/index.html';fs.readFile(path.join(APP,p),(e,d)=>{if(e){r.writeHead(404);r.end();}else{r.writeHead(200,{'Content-Type':p.endsWith('.js')?'text/javascript':p.endsWith('.html')?'text/html':'application/octet-stream'});r.end(d);}});});
(async()=>{await new Promise(r=>srv.listen(0,r));const b=await chromium.launch(),pg=await b.newPage({viewport:{width:400,height:800}});
const errs=[];pg.on('pageerror',e=>errs.push(e.message));pg.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await pg.goto(`http://localhost:${srv.address().port}/index.html`);await pg.waitForFunction(()=>window.__edges&&window.__edges.makeBase,null,{timeout:20000});
const r=await pg.evaluate(()=>{const E=window.__edges,c=document.createElement('canvas');c.width=300;c.height=400;const x=c.getContext('2d');x.fillStyle='#eee';x.fillRect(0,0,300,400);x.fillStyle='#223';x.fillRect(40,60,200,6);
const b=E.makeBase(c),o={};for(const f of TXF.IDS){const t=E.toneCanvas(b,f,20,10,15);o[f]=[t.width,t.height];}
return{flt:[...document.querySelectorAll('.flt')].length,o};});
console.log(JSON.stringify(r),'errors:',errs.slice(0,3));await b.close();srv.close();})();
