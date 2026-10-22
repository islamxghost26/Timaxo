/* ===== Timaxo v160: table-engine.js ===== 
   محرك بنية الجداول (أوفلاين، بدون مكتبات). بيقرا خطوط الجدول من البكسلات مباشرة:
   1) كشف خطوط بالتباين المحلي (بيلقط الخط الرمادي الفاتح والخط الأسود على خلفية ملوّنة)
   2) تجميع الخطوط المتصلة في جداول منفصلة (جدولين في صورة واحدة = جدولين)
   3) شبكة كاملة ثم دمج الخلايا اللي مفيش خط بينها (rowspan/colspan) + خلايا فاضية خارج الشكل (void)
   الاستخدام: TXTable.detect({data,width,height}) → {tables:[{box,xs,ys,nR,nC,cells,voids,stats}]}
   TXTable.fill(tb,words,rtl,textFn) → يوزّع كلمات الـOCR على الخلايا. TXTable.grid(tb,rtl) → {rows,spans}. */
(function(root){
'use strict';
const UF=n=>{const p=Array.from({length:n},(_,i)=>i);const f=x=>{while(p[x]!==x){p[x]=p[p[x]];x=p[x];}return x;};return{f,u:(a,b)=>{a=f(a);b=f(b);if(a!==b)p[b]=a;}};};

/* خريطتين: H (بكسل جزء من خط أفقي) و V (خط رأسي). البكسل لازم يكون أغمق من اللي فوقه وتحته (أو يمينه ويساره) بفرق D */
function masks(g,w,h){
 const t=Math.max(1,Math.round(w/700)),ks=[t+1,2*t+2],k2=ks[1],D=28,H=new Uint8Array(w*h),V=new Uint8Array(w*h);
 for(let y=k2;y<h-k2;y++){const o=y*w;
  for(let x=k2;x<w-k2;x++){const v=g[o+x];if(v>205)continue;
   for(let i=0;i<2;i++){const k=ks[i];if(g[o-k*w+x]-v>=D&&g[o+k*w+x]-v>=D){H[o+x]=1;break;}}
   for(let i=0;i<2;i++){const k=ks[i];if(g[o+x-k]-v>=D&&g[o+x+k]-v>=D){V[o+x]=1;break;}}}}
 return{H,V};}

/* أقسام الخطوط: لكل صف (أو عمود) نطلع المقاطع الطويلة، وبعدين ندمج الصفوف المتجاورة في خط واحد */
function segs(M,w,h,vert,minLen,gap){
 const N=vert?w:h,L=vert?h:w,out=[];let open=[];
 for(let p=0;p<N;p++){
  const found=[];let a=-1,last=-1;
  for(let q=0;q<L;q++){
   if(vert?M[q*w+p]:M[p*w+q]){if(a<0)a=q;else if(q-last-1>gap){if(last-a+1>=minLen)found.push([a,last]);a=q;}last=q;}}
  if(a>=0&&last-a+1>=minLen)found.push([a,last]);
  const used=new Set();
  for(const [a0,b0] of found){let hit=null;
   for(const o of open){if(o.pl<p-1||used.has(o))continue;const ov=Math.min(b0,o.b)-Math.max(a0,o.a)+1;if(ov>=.5*Math.min(b0-a0+1,o.b-o.a+1)){hit=o;break;}}
   if(hit){hit.a=Math.min(hit.a,a0);hit.b=Math.max(hit.b,b0);hit.ps+=p;hit.n++;hit.pl=p;used.add(hit);}
   else{const o={a:a0,b:b0,ps:p,n:1,pl:p};open.push(o);used.add(o);}}
  const keep=[];for(const o of open){if(o.pl<p-1)out.push({p:o.ps/o.n,a:o.a,b:o.b,th:o.n});else keep.push(o);}open=keep;}
 for(const o of open)out.push({p:o.ps/o.n,a:o.a,b:o.b,th:o.n});
 return out;}

/* خط قصير لازم يكون «مثبّت»: طرفيه بيلمسوا خطوط من الاتجاه التاني (بيشيل حروف زي «ا» والخطوط التحتية داخل النص) */
function anchored(S,O,T,short){return S.filter(s=>{if(s.b-s.a+1>=short)return true;
 const hit=e=>O.some(o=>Math.abs(o.p-e)<=T&&s.p>=o.a-T&&s.p<=o.b+T);return hit(s.a)&&hit(s.b);});}

function clus(vals,tol){ /* vals:[{p,len}] → مواضع مدموجة */
 const s=vals.slice().sort((a,b)=>a.p-b.p),out=[];let cur=null;
 for(const v of s){if(cur&&v.p-cur.last<=tol){cur.sp+=v.p*v.len;cur.sl+=v.len;cur.last=v.p;}else{cur={sp:v.p*v.len,sl:v.len,last:v.p};out.push(cur);}}
 return out.map(c=>c.sp/c.sl);}

/* هل فيه خط على الحافة؟ بنعدّ نسبة البكسلات اللي عليها خط (بحيز ±tb) */
function edgeH(M,w,y,xa,xb,tb){let n=0,t=0;for(let x=Math.round(xa)+2;x<Math.round(xb)-1;x++){t++;let ok=0;for(let yy=Math.round(y)-tb;yy<=Math.round(y)+tb&&!ok;yy++)if(M[yy*w+x])ok=1;n+=ok;}return t<=0?0:n/t;}
function edgeV(M,w,x,ya,yb,tb){let n=0,t=0;for(let y=Math.round(ya)+2;y<Math.round(yb)-1;y++){t++;let ok=0;for(let xx=Math.round(x)-tb;xx<=Math.round(x)+tb&&!ok;xx++)if(M[y*w+xx])ok=1;n+=ok;}return t<=0?0:n/t;}

function build(comp,Hm,Vm,w,h,tol){
 const xs=clus(comp.V.map(s=>({p:s.p,len:s.b-s.a+1})),tol),ys=clus(comp.H.map(s=>({p:s.p,len:s.b-s.a+1})),tol);
 const nR=ys.length-1,nC=xs.length-1;if(nR<1||nC<1)return null;
 const tb=Math.max(2,Math.round(tol/2)),TH=.55;
 const hE=Array.from({length:nR+1},(_,i)=>Array.from({length:nC},(_,j)=>edgeH(Hm,w,ys[i],xs[j],xs[j+1],tb)>=TH));
 const vE=Array.from({length:nR},(_,i)=>Array.from({length:nC+1},(_,j)=>edgeV(Vm,w,xs[j],ys[i],ys[i+1],tb)>=TH));
 /* خلايا void: خلية على حافة الشكل ومفيش خط ناحية الخارج (زي الركن الفاضي في جدول الوجبات) */
 let vd=Array.from({length:nR},()=>Array(nC).fill(false));
 for(let it=0;it<3;it++)for(let i=0;i<nR;i++)for(let j=0;j<nC;j++){if(vd[i][j])continue;
  const out=(ni,nj)=>ni<0||nj<0||ni>=nR||nj>=nC||vd[ni][nj];
  if((out(i-1,j)&&!hE[i][j])||(out(i+1,j)&&!hE[i+1][j])||(out(i,j-1)&&!vE[i][j])||(out(i,j+1)&&!vE[i][j+1]))vd[i][j]=true;}
 let nv=0;vd.forEach(r=>r.forEach(x=>{if(x)nv++;}));if(nv>nR*nC*.35){vd=vd.map(r=>r.map(()=>false));nv=0;}
 /* دمج الخلايا اللي مفيش خط بينها */
 const id=(i,j)=>i*nC+j,uf=UF(nR*nC);
 for(let i=0;i<nR;i++)for(let j=0;j<nC;j++){if(vd[i][j])continue;
  if(i>0&&!vd[i-1][j]&&!hE[i][j])uf.u(id(i-1,j),id(i,j));
  if(j>0&&!vd[i][j-1]&&!vE[i][j])uf.u(id(i,j-1),id(i,j));}
 const G=new Map();for(let i=0;i<nR;i++)for(let j=0;j<nC;j++){if(vd[i][j])continue;const k=uf.f(id(i,j));let o=G.get(k);if(!o)G.set(k,o={r0:i,c0:j,r1:i,c1:j,n:0});o.r0=Math.min(o.r0,i);o.c0=Math.min(o.c0,j);o.r1=Math.max(o.r1,i);o.c1=Math.max(o.c1,j);o.n++;}
 const cells=[];let merged=0;
 for(const o of G.values()){const rs=o.r1-o.r0+1,cs=o.c1-o.c0+1;
  if(rs*cs===o.n){cells.push({r:o.r0,c:o.c0,rs,cs});if(o.n>1)merged++;}
  else{for(let i=o.r0;i<=o.r1;i++)for(let j=o.c0;j<=o.c1;j++)if(!vd[i][j]&&G.get(uf.f(id(i,j)))===o)cells.push({r:i,c:j,rs:1,cs:1});}}
 cells.sort((a,b)=>a.r-b.r||a.c-b.c);
 for(const c of cells){c.x0=xs[c.c];c.x1=xs[c.c+c.cs];c.y0=ys[c.r];c.y1=ys[c.r+c.rs];}
 const voids=[];for(let i=0;i<nR;i++)for(let j=0;j<nC;j++)if(vd[i][j])voids.push([i,j]);
 return{box:{x0:xs[0],y0:ys[0],x1:xs[nC],y1:ys[nR]},xs,ys,nR,nC,cells,voids,stats:{merged,voids:nv,cells:cells.length}};}

function detect(img,opt){opt=opt||{};
 const w=img.width,h=img.height,d=img.data,N=w*h,g=new Uint8Array(N);
 for(let i=0,j=0;i<N;i++,j+=4)g[i]=(d[j]*77+d[j+1]*151+d[j+2]*28)>>8;
 const{H,V}=masks(g,w,h),T=Math.max(5,Math.round(w*.007)),minH=Math.max(18,Math.round(w*.02)),minV=Math.max(16,Math.round(h*.012));
 const rawH=segs(H,w,h,false,minH,2),rawV=segs(V,w,h,true,minV,2);
 const Hs=anchored(rawH,rawV,T,Math.round(w*.06)),Vs=anchored(rawV,rawH,T,Math.round(h*.05));
 /* ربط الخطوط المتقاطعة في مكوّنات = جداول */
 const all=[...Hs.map(s=>({k:'H',s})),...Vs.map(s=>({k:'V',s}))],uf=UF(all.length),nH=Hs.length;
 for(let i=0;i<nH;i++){const a=Hs[i];for(let j=0;j<Vs.length;j++){const b=Vs[j];
  if(b.p>=a.a-T&&b.p<=a.b+T&&a.p>=b.a-T&&a.p<=b.b+T)uf.u(i,nH+j);}}
 const comps=new Map();all.forEach((o,i)=>{const r=uf.f(i);let c=comps.get(r);if(!c)comps.set(r,c={H:[],V:[]});(o.k==='H'?c.H:c.V).push(o.s);});
 const tables=[];
 for(const c of comps.values()){if(c.H.length<2||c.V.length<2)continue;
  const t=build(c,H,V,w,h,T);if(!t||t.nR<1||t.nC<1||t.nR*t.nC<2)continue;
  if(t.box.x1-t.box.x0<60||t.box.y1-t.box.y0<30)continue;tables.push(t);}
 tables.sort((a,b)=>a.box.y0-b.box.y0||a.box.x0-b.box.x0);
 return{tables,width:w,height:h};}

/* يوزّع كلمات الـOCR على الخلايا (بمركز الكلمة). textFn(words,rtl) بيرجّع النص بالترتيب الصح. وبيحسب محاذاة النص (c/l/r) من مكانه جوه الخلية */
function fill(tb,words,rtl,textFn){
 const tf=textFn||((ws)=>ws.map(w=>w.t).join(' '));
 for(const c of tb.cells)c.w=[];
 for(const w of words){const cx=(w.x0+w.x1)/2,cy=(w.y0+w.y1)/2;
  for(const c of tb.cells){if(cx>=c.x0-2&&cx<c.x1+2&&cy>=c.y0-2&&cy<c.y1+2){c.w.push(w);break;}}}
 for(const c of tb.cells){c.t=c.w.length?tf(c.w,rtl):'';c.al=null;
  if(c.w.length){const x0=Math.min(...c.w.map(w=>w.x0)),x1=Math.max(...c.w.map(w=>w.x1)),L=x0-c.x0,R=c.x1-x1,cw=c.x1-c.x0;c.al=Math.abs(L-R)<=cw*.16?'c':(L<R?'l':'r');}}
 return tb;}

/* رؤوس الأعمدة المكتوبة فوق الجدول (زي «فطور/غداء» فوق جدول الوجبات) لو الصف الأول فاضي: بتتنقل لخلايا الصف الأول حسب العمود. بيرجّع الكلمات اللي اتستعملت */
function attachHeader(tb,words,rtl,textFn){
 const tf=textFn||((ws)=>ws.map(w=>w.t).join(' ')),row0=tb.cells.filter(c=>c.r===0&&c.rs===1);
 if(row0.length<2||row0.some(c=>c.t))return[];
 const rh=tb.ys[1]-tb.ys[0],lim=Math.max(70,rh*.9),cand=words.filter(w=>{const cy=(w.y0+w.y1)/2;return cy<=tb.box.y0+2&&cy>=tb.box.y0-lim;});
 const by=new Map();for(const w of cand){const cx=(w.x0+w.x1)/2,c=row0.find(k=>cx>=k.x0&&cx<k.x1);if(c){if(!by.has(c))by.set(c,[]);by.get(c).push(w);}}
 if(by.size<2)return[];const used=[];
 for(const [c,ws] of by){c.t=tf(ws,rtl);c.w=ws;c.al='c';used.push(...ws);}
 return used;}
/* ألوان الخلية من الصورة الملوّنة: الخلفية = اللون الأكتر شيوعًا، ولون الخط = متوسط أغمق البكسلات (لو مش أسود) */
const hx=(r,g,b)=>[r,g,b].map(v=>Math.round(v).toString(16).padStart(2,'0')).join('').toUpperCase();
function styles(tb,img){const w=img.width,H=img.height,d=img.data;
 for(const c of tb.cells){c.bg=c.fg=null;
  const ix0=Math.max(0,Math.round(c.x0)+4),ix1=Math.min(w-1,Math.round(c.x1)-4),iy0=Math.max(0,Math.round(c.y0)+4),iy1=Math.min(H-1,Math.round(c.y1)-4);
  if(ix1-ix0<4||iy1-iy0<4)continue;
  const st=Math.max(1,Math.floor(Math.sqrt((ix1-ix0)*(iy1-iy0)/3500))),bins=new Map(),px=[];
  for(let y=iy0;y<=iy1;y+=st)for(let x=ix0;x<=ix1;x+=st){const i=(y*w+x)*4,r=d[i],g=d[i+1],b=d[i+2],k=((r>>4)<<8)|((g>>4)<<4)|(b>>4);let o=bins.get(k);if(!o)bins.set(k,o={n:0,r:0,g:0,b:0});o.n++;o.r+=r;o.g+=g;o.b+=b;px.push(r,g,b);}
  let best=null;for(const o of bins.values())if(!best||o.n>best.n)best=o;if(!best)continue;
  const br=best.r/best.n,bg=best.g/best.n,bb=best.b/best.n;
  if(!(br>=244&&bg>=244&&bb>=244))c.bg=hx(br,bg,bb);
  const bl=.3*br+.59*bg+.11*bb,dk=[];for(let i=0;i<px.length;i+=3){const l=.3*px[i]+.59*px[i+1]+.11*px[i+2];if(l<bl-90)dk.push([l,i]);}
  if(dk.length>=6){dk.sort((a,b)=>a[0]-b[0]);const n=Math.max(3,dk.length*.25|0);let r=0,g=0,b=0;for(let i=0;i<n;i++){const j=dk[i][1];r+=px[j];g+=px[j+1];b+=px[j+2];}r/=n;g/=n;b/=n;if(!(r<75&&g<75&&b<75))c.fg=hx(r,g,b);}}
 return tb;}

/* مصفوفة منطقية: rows[r][c] (العمود 0 = أقصى اليمين لو عربي) + spans + void + st (أنماط) + colW/rowH (نِسَب من الصورة) */
function grid(tb,rtl){
 const nR=tb.nR,nC=tb.nC,rows=Array.from({length:nR},()=>Array(nC).fill('')),st=Array.from({length:nR},()=>Array(nC).fill(null)),spans=[],boxes=Array.from({length:nR},()=>Array(nC).fill(null));
 const lc=(c,cs)=>rtl?nC-c-cs:c;
 for(const c of tb.cells){const l=lc(c.c,c.cs),sty={bg:c.bg||null,fg:c.fg||null,al:c.al||null,b:false,sz:0};rows[c.r][l]=c.t||'';
  boxes[c.r][l]={x0:c.x0,y0:c.y0,x1:c.x1,y1:c.y1};
  if(c.rs>1||c.cs>1)spans.push({r:c.r,c:l,rs:c.rs,cs:c.cs});
  for(let i=c.r;i<c.r+c.rs;i++)for(let j=l;j<l+c.cs;j++)st[i][j]=sty;}
 const voids=tb.voids.map(([i,j])=>[i,rtl?nC-1-j:j]);
 const gw=[];for(let j=0;j<nC;j++)gw.push(tb.xs[j+1]-tb.xs[j]);
 const colW=Array.from({length:nC},(_,l)=>rtl?gw[nC-1-l]:gw[l]),rowH=[];for(let i=0;i<nR;i++)rowH.push(tb.ys[i+1]-tb.ys[i]);
 return{rows,spans,boxes,voids,st,colW,rowH,rtl:!!rtl,nR,nC};}

root.TXTable={detect,fill,styles,attachHeader,grid,_masks:masks};
if(typeof module!=='undefined')module.exports=root.TXTable;
})(typeof window!=='undefined'?window:globalThis);
