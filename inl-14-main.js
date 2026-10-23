
(()=>{
'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let uid=0; const newId=()=>Date.now().toString(36)+(uid++).toString(36);
const mk=(w,h)=>{const c=document.createElement('canvas');c.width=Math.max(1,w|0);c.height=Math.max(1,h|0);return c;};
const toBlob=(c,type,q)=>new Promise(r=>c.toBlob(r,type,q));
const ls={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};

/* ---------- i18n ---------- */
const arPlural=n=>n===1?'صفحة واحدة':n===2?'صفحتان':n<=10?n+' صفحات':n+' صفحة';
const STR={
en:{docName:'Document name',newDoc:'New',newDoc2:'Tap to clear all',gallery:'Gallery',scan:'Scan',save:'Save',
 emptyT:'Scan your first page',emptyP:'Open the camera and shoot a document. Timaxo straightens it, cleans the colors and keeps the text exactly as written.',
 sample:'Try a sample page',pages:n=>n===1?'1 page':n+' pages',cropTitle:'Adjust edges',auto:'Auto',full:'Full',cont:'Continue',
 cropHint:'Drag corners or edge handles · arrows for fine tuning',snapT:'Snap to edge',fineT:'Fine',finding:'Finding edges…',holdOrig:'Hold for original',nextPage:'Page',done:'Done',
 tFilters:'Filters',tAdjust:'Adjust',tMarkup:'Edit',tErase:'Erase',tPage:'Page',original:'Original',f_auto:'Auto',f_magic:'Color',f_gray:'Gray',f_bw:'B&W',f_deshadow:'No shadow',f_flat:'Even bg',f_ink:'Strong ink',f_print:'Print',f_hand:'Handwriting',f_card:'ID card',
 bright:'Brightness',contrast:'Contrast',satur:'Color',reset:'Reset',
 pen:'Pen',cbrush:'Clean brush',sign:'Signature',hand:'Move',ocrbox:'Replace text',classo:'Lasso erase',cbox:'Clean area',hl:'Highlight',text:'Text',note:'Note',arrow:'Arrow',box:'Box',redact:'Hide info',check:'Tick',cross:'Cross',erase:'Erase',undo:'Undo',redo:'Redo',clearAll:'Clear all marks',
 textPh:'Type your note',add:'Add',cancel:'Cancel',rotL:'Left',rotR:'Right',edges:'Edges',earlier:'Earlier',later:'Later',del:'Delete',delSure:'Tap again',
 pageN:n=>'Page '+n,newPage:'New page',saveTitle:'Save document',fileName:'File name',format:'Format',quality:'Quality',qSmall:'Small',qMed:'Medium',qHigh:'High',
 pageSize:'PDF page size',psFit:'Fit image',pagesSel:'Pages',zipNote:'Several images are saved together in one ZIP file.',pdfNote:'All selected pages go into one PDF, in order.',
 saveBtn:'Save',preparing:(i,n)=>`Preparing page ${i} of ${n}…`,saved:'Saved',cancelled:'Save cancelled',saveFail:'Saving is not available here',
 fbImg:'Press and hold the image to save it.',fbOpen:'Open the file',openFail:'Could not open this image',added:'Page added',back:'Back',selectPages:'Select at least one page'},
ar:{docName:'اسم المستند',newDoc:'جديد',newDoc2:'اضغط لمسح الكل',gallery:'المعرض',scan:'سكان',save:'حفظ',
 emptyT:'صوّر أول صفحة',emptyP:'افتح الكاميرا وصوّر المستند. Timaxo بيعدّل الزاوية وينضّف الألوان ويسيب الكلام زي ما هو.',
 sample:'جرّب صفحة تجريبية',pages:n=>arPlural(n),cropTitle:'اضبط الحواف',auto:'تلقائي',full:'كامل',cont:'متابعة',
 cropHint:'اسحب الأركان أو مقابض الحواف · الأسهم للضبط الدقيق',snapT:'التصاق بالحافة',fineT:'دقيق',finding:'جاري تحديد الحواف…',holdOrig:'اضغط لرؤية الأصل',nextPage:'صفحة',done:'تم',
 tFilters:'فلاتر',tAdjust:'ضبط',tMarkup:'تعديل',tErase:'مسح',tPage:'الصفحة',original:'الأصل',f_auto:'تلقائي',f_magic:'ألوان',f_gray:'رمادي',f_bw:'أبيض وأسود',f_deshadow:'بدون ظل',f_flat:'خلفية موحّدة',f_ink:'حبر قوي',f_print:'للطباعة',f_hand:'خط يد',f_card:'بطاقة',
 bright:'السطوع',contrast:'التباين',satur:'الألوان',reset:'إعادة ضبط',
 pen:'قلم',cbrush:'فرشاة مسح',sign:'توقيع',hand:'تحريك',ocrbox:'استبدال النص',classo:'لاسو مسح',cbox:'مسح مربع',hl:'تظليل',text:'نص',note:'ملاحظة',arrow:'سهم',box:'مربع',redact:'إخفاء بيانات',check:'صح',cross:'خطأ',erase:'ممحاة',undo:'تراجع',redo:'إعادة',clearAll:'مسح كل العلامات',
 textPh:'اكتب ملاحظتك',add:'إضافة',cancel:'إلغاء',rotL:'يسار',rotR:'يمين',edges:'الحواف',earlier:'قدّم',later:'أخّر',del:'حذف',delSure:'اضغط مرة أخرى',
 pageN:n=>'صفحة '+n,newPage:'صفحة جديدة',saveTitle:'حفظ المستند',fileName:'اسم الملف',format:'الصيغة',quality:'الجودة',qSmall:'صغير',qMed:'متوسط',qHigh:'عالي',
 pageSize:'مقاس صفحة PDF',psFit:'حسب الصورة',pagesSel:'الصفحات',zipNote:'الصور المتعددة بتتحفظ مع بعض في ملف ZIP واحد.',pdfNote:'كل الصفحات المختارة بتتحفظ في ملف PDF واحد بالترتيب.',
 saveBtn:'حفظ',preparing:(i,n)=>`جاري تجهيز الصفحة ${i} من ${n}…`,saved:'تم الحفظ',cancelled:'تم إلغاء الحفظ',saveFail:'الحفظ غير متاح هنا',
 fbImg:'اضغط مطولًا على الصورة لحفظها.',fbOpen:'افتح الملف',openFail:'مقدرتش أفتح الصورة',added:'اتضافت الصفحة',back:'رجوع',selectPages:'اختار صفحة واحدة على الأقل'}
};
let lang=ls.get('tx-lang')||'ar'; if(!STR[lang]) lang='ar';
const t=(k,...a)=>{const s=STR[lang][k]??STR.en[k]??k;return typeof s==='function'?s(...a):s;};

/* ---------- state ---------- */
let stagNext=true;const state={pages:[],name:'',draft:null,queue:[],id:null};
const E={page:null,isDraft:false,base:null,tiny:null,tool:'pen',color:'#E5322D',size:1,cur:null,tab:'pFilters',pending:null,raf:0,orig:false};
const C={page:null,src:null,w:0,h:0,drag:-1,from:'new'};
const FILTERS=['original','auto','magic','gray','bw'].concat(window.TXF?TXF.IDS:[]); /* الجديدة: deshadow, flat, ink, print, hand, card (من filters.js) */
const COLORS=['#E5322D','#1F5BFF','#12A150','#FFD60A','#FF8A00','#111111'];
const TOOLS=[['pen','i-pen'],['hl','i-hl'],['text','i-text'],['note','i-note'],['arrow','i-arrow'],['box','i-box'],['redact','i-redact'],['check','i-check'],['cross','i-cross'],['erase','i-erase'],['cbrush','i-pen'],['classo','i-hl'],['cbox','i-box'],['sign','i-pen'],['ocrbox','i-box'],['hand','i-full']];
const defName=()=>{const d=new Date();return (lang==='ar'?'مستند ':'Scan ')+String(d.getDate()).padStart(2,'0')+'-'+String(d.getMonth()+1).padStart(2,'0');};

/* ---------- persistence (best effort) ---------- */
let db=null;
const idbReady=(async()=>{try{db=await new Promise((res,rej)=>{const r=indexedDB.open('timaxo-scan',2);r.onupgradeneeded=()=>{const d=r.result;if(!d.objectStoreNames.contains('pages'))d.createObjectStore('pages',{keyPath:'id'});if(!d.objectStoreNames.contains('meta'))d.createObjectStore('meta');if(!d.objectStoreNames.contains('docs'))d.createObjectStore('docs',{keyPath:'id'});};r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error);r.onblocked=()=>rej(new Error('blocked'));});}catch(e){db=null;}})();
const tx=(store,mode,fn)=>new Promise(res=>{if(!db)return res();try{const tr=db.transaction(store,mode);fn(tr.objectStore(store));tr.oncomplete=tr.onerror=tr.onabort=()=>res();}catch(e){res();}});
const persist=p=>tx('pages','readwrite',s=>s.put({id:p.id,blob:p.blob,corners:p.corners,rot:p.rot,filter:p.filter,br:p.br,ct:p.ct,sat:p.sat,ann:p.ann,thumb:p.thumb}));
const persistMeta=()=>tx('meta','readwrite',s=>s.put({order:state.pages.map(p=>p.id),name:state.name,id:state.id,tags:getTags()},'doc'));
const unpersist=id=>tx('pages','readwrite',s=>s.delete(id));
const clearStore=()=>tx('pages','readwrite',s=>s.clear());
async function restore(){
  await idbReady; if(!db) return;
  const get=(store,key)=>new Promise(res=>{try{const r=key===undefined?db.transaction(store).objectStore(store).getAll():db.transaction(store).objectStore(store).get(key);r.onsuccess=()=>res(r.result);r.onerror=()=>res(null);}catch(e){res(null);}});
  const rows=(await get('pages'))||[]; const meta=await get('meta','doc');
  const map=new Map(rows.map(r=>[r.id,r])); const order=(meta&&meta.order)||rows.map(r=>r.id);
  state.pages=order.map(id=>map.get(id)).filter(Boolean).map(r=>({...r,src:null,hist:[],fut:[]}));
  if(meta&&meta.name) state.name=meta.name;state.id=(meta&&meta.id)||newId();state.tags=(meta&&meta.tags)||[];state.tagsFor=state.id;
}

/* ---------- image helpers ---------- */
async function decodeBlob(blob,maxEdge=3000){
  let bmp;
  try{bmp=await createImageBitmap(blob,{imageOrientation:'from-image'});}
  catch(e){bmp=await new Promise((res,rej)=>{const u=URL.createObjectURL(blob);const im=new Image();im.onload=()=>res(im);im.onerror=rej;im.src=u;});}
  const w=bmp.width||bmp.naturalWidth,h=bmp.height||bmp.naturalHeight;
  const k=Math.min(1,maxEdge/Math.max(w,h));
  const c=mk(Math.round(w*k),Math.round(h*k)); const x=c.getContext('2d',{willReadFrequently:true}); x.imageSmoothingQuality='high'; x.drawImage(bmp,0,0,c.width,c.height);
  if(bmp.close) bmp.close();
  return c;
}
function boxBlur(a,w,h,r){
  const t=new Float32Array(w*h),o=new Float32Array(w*h),n=2*r+1;
  for(let y=0;y<h;y++){const row=y*w;let s=0;for(let x=-r;x<=r;x++)s+=a[row+clamp(x,0,w-1)];
    for(let x=0;x<w;x++){t[row+x]=s/n;s+=a[row+Math.min(w-1,x+r+1)]-a[row+Math.max(0,x-r)];}}
  const cs=new Float64Array(w);
  for(let y=-r;y<=r;y++){const b=clamp(y,0,h-1)*w;for(let x=0;x<w;x++)cs[x]+=t[b+x];}
  for(let y=0;y<h;y++){const ro=y*w,ra=Math.min(h-1,y+r+1)*w,rs=Math.max(0,y-r)*w;for(let x=0;x<w;x++){o[ro+x]=cs[x]/n;cs[x]+=t[ra+x]-t[rs+x];}}
  return o;
}
function maxFilter(a,w,h,r){
  const t=new Float32Array(w*h),o=new Float32Array(w*h);
  for(let y=0;y<h;y++){const ro=y*w;for(let x=0;x<w;x++){let m=0;const k1=Math.min(w-1,x+r);for(let k=Math.max(0,x-r);k<=k1;k++){const v=a[ro+k];if(v>m)m=v;}t[ro+x]=m;}}
  for(let y=0;y<h;y++){const y0=Math.max(0,y-r),y1=Math.min(h-1,y+r);for(let x=0;x<w;x++){let m=0;for(let k=y0;k<=y1;k++){const v=t[k*w+x];if(v>m)m=v;}o[y*w+x]=m;}}
  return o;
}

function asp(q){const d=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y),W=(d(q[0],q[1])+d(q[3],q[2]))/2,H=(d(q[0],q[3])+d(q[1],q[2]))/2,r=Math.max(W,H)/Math.max(1,Math.min(W,H));return[1.414,1.294,1.586,1].some(v=>Math.abs(r-v)<.07)?1.08:1;}
/* ---------- sub-pixel edge refinement: fits a straight line to each edge on the full-res image ---------- */
const GRAYC=new WeakMap();
function grayOf(src){
  let g=GRAYC.get(src);if(g)return g;
  const K=Math.min(1,1400/Math.max(src.width,src.height)),w=Math.max(8,Math.round(src.width*K)),h=Math.max(8,Math.round(src.height*K));
  const c=mk(w,h),x=c.getContext('2d',{willReadFrequently:true});x.imageSmoothingQuality='high';x.drawImage(src,0,0,w,h);
  const d=x.getImageData(0,0,w,h).data,a=new Float32Array(w*h);
  for(let i=0;i<w*h;i++)a[i]=.299*d[i*4]+.587*d[i*4+1]+.114*d[i*4+2];
  g={a:boxBlur(a,w,h,1),w,h};GRAYC.set(src,g);return g;
}
function bilG(G,x,y){x=clamp(x,0,G.w-1.001);y=clamp(y,0,G.h-1.001);const x0=x|0,y0=y|0,fx=x-x0,fy=y-y0,i=y0*G.w+x0,a=G.a;
  return a[i]*(1-fx)*(1-fy)+a[i+1]*fx*(1-fy)+a[i+G.w]*(1-fx)*fy+a[i+G.w+1]*fx*fy;}
function lineInter2(p1,p2,p3,p4){const den=(p1.x-p2.x)*(p3.y-p4.y)-(p1.y-p2.y)*(p3.x-p4.x);if(Math.abs(den)<1e-9)return null;
  const t=((p1.x-p3.x)*(p3.y-p4.y)-(p1.y-p3.y)*(p3.x-p4.x))/den;return{x:p1.x+t*(p2.x-p1.x),y:p1.y+t*(p2.y-p1.y)};}
function refineQuad(src,q,opt){
  opt=opt||{};const G=grayOf(src),W=G.w,H=G.h,M=Math.min(W,H),only=opt.only||[0,1,2,3],passes=opt.passes||2;
  let cur=q.map(p=>({x:p.x*W,y:p.y*H}));
  for(let ps=0;ps<passes;ps++){
    const R=Math.max(3,(opt.R||.03)*M/(ps+1)),L=[];
    for(let i=0;i<4;i++){
      const a=cur[i],b=cur[(i+1)%4],dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy)||1;let line={a,b};
      if(only.includes(i)&&len>M*.15){
        const nx=-dy/len,ny=dx/len,NS_=Math.max(24,Math.min(80,(len/6)|0)),pts=[];
        for(let k=0;k<NS_;k++){
          const t=.06+.88*(k+.5)/NS_,px=a.x+dx*t,py=a.y+dy*t;let bd=0,bm=0,bs=0,bsc=-1;
          for(let d=-R;d<=R;d+=.5){
            const v=bilG(G,px+nx*(d+1.2),py+ny*(d+1.2))-bilG(G,px+nx*(d-1.2),py+ny*(d-1.2)),m=Math.abs(v),sc=m*(1-.35*Math.abs(d)/R);
            if(sc>bsc){bsc=sc;bd=d;bm=m;bs=v>0?1:-1;}
          }
          pts.push({t,d:bd,m:bm,s:bs});
        }
        const vote=pts.reduce((a2,p)=>a2+p.s*p.m,0),sg=vote>=0?1:-1;
        let P=pts.filter(p=>p.s===sg);const mx=Math.max(1,...P.map(p=>p.m));
        if(mx>=10){
          P=P.filter(p=>p.m>=mx*.3);
          const fit=S=>{const n=S.length;let st=0,sd=0,stt=0,std=0;for(const p of S){st+=p.t;sd+=p.d;stt+=p.t*p.t;std+=p.t*p.d;}
            const den=n*stt-st*st;if(n<2||Math.abs(den)<1e-9)return[sd/(n||1),0];const c1=(n*std-st*sd)/den;return[(sd-c1*st)/n,c1];};
          let c0=0,c1=0,inl=P;
          if(P.length>=6){
            [c0,c1]=fit(P);
            for(let it=0;it<4;it++){
              const res=P.map(p=>Math.abs(p.d-(c0+c1*p.t))),sorted=res.slice().sort((x,y)=>x-y),med=sorted[sorted.length>>1],th=Math.max(1,2.2*med),S=P.filter((p,j)=>res[j]<=th);
              if(S.length<6)break;inl=S;[c0,c1]=fit(S);
            }
            if(inl.length>=Math.max(6,NS_*.35)&&Math.abs(c0)<=R&&Math.abs(c0+c1)<=R)
              line={a:{x:a.x+nx*c0,y:a.y+ny*c0},b:{x:b.x+nx*(c0+c1),y:b.y+ny*(c0+c1)}};
          }
        }
      }
      L.push(line);
    }
    cur=cur.map((c,i)=>{const A=L[(i+3)%4],B=L[i],p=lineInter2(A.a,A.b,B.a,B.b);return p&&isFinite(p.x)&&isFinite(p.y)&&Math.hypot(p.x-c.x,p.y-c.y)<=R*2.2?p:c;});
  }
  return cur.map(p=>({x:clamp(p.x/W,0,1),y:clamp(p.y/H,0,1)}));
}
/* ---------- edge detection ---------- */
function detectCorners(src,fast,thorough){
  const K=(fast===2?360:fast?480:thorough?640:520)/Math.max(src.width,src.height),w=Math.max(8,Math.round(src.width*K)),h=Math.max(8,Math.round(src.height*K)),N=w*h;
  const c=mk(w,h),cx=c.getContext('2d',{willReadFrequently:true});cx.drawImage(src,0,0,w,h);
  const d=cx.getImageData(0,0,w,h).data,g=new Float32Array(N);
  for(let i=0;i<N;i++)g[i]=.299*d[i*4]+.587*d[i*4+1]+.114*d[i*4+2];
  const gs=boxBlur(Float32Array.from(g),w,h,1),gb=boxBlur(Float32Array.from(g),w,h,3);
  const mag=new Float32Array(N),GX=new Float32Array(N),GY=new Float32Array(N);let mx=1;
  for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){const i=y*w+x;
    const gx=gs[i-w+1]+2*gs[i+1]+gs[i+w+1]-gs[i-w-1]-2*gs[i-1]-gs[i+w-1];
    const gy=gs[i+w-1]+2*gs[i+w]+gs[i+w+1]-gs[i-w-1]-2*gs[i-w]-gs[i-w+1];
    const m=Math.sqrt(gx*gx+gy*gy);mag[i]=m;GX[i]=gx;GY[i]=gy;if(m>mx)mx=m;}
  const hist=new Uint32Array(256);for(let i=0;i<N;i++)hist[Math.min(255,(mag[i]/mx*255)|0)]++;
  const thrAt=p=>{let a=0;for(let b=255;b>=0;b--){a+=hist[b];if(a>=p*N)return b/255*mx;}return 0;};
  const mm=new Float32Array(N);
  mm.set(maxFilter(mag,w,h,1));
  const tS=thrAt(.12);
  const comp=m=>{const lab=new Int32Array(N),st=new Int32Array(N);let bl=0,bn=0,L=0;
    for(let s=0;s<N;s++){if(!m[s]||lab[s])continue;L++;let sp=0,n=0;st[sp++]=s;lab[s]=L;
      while(sp){const p=st[--sp];n++;const x=p%w,y=(p/w)|0;
        if(x>0&&m[p-1]&&!lab[p-1]){lab[p-1]=L;st[sp++]=p-1;}
        if(x<w-1&&m[p+1]&&!lab[p+1]){lab[p+1]=L;st[sp++]=p+1;}
        if(y>0&&m[p-w]&&!lab[p-w]){lab[p-w]=L;st[sp++]=p-w;}
        if(y<h-1&&m[p+w]&&!lab[p+w]){lab[p+w]=L;st[sp++]=p+w;}}
      if(n>bn){bn=n;bl=L;}}
    return{lab,bl,bn};};
  const cross=(o,a,b)=>(a.x-o.x)*(b.y-o.y)-(a.y-o.y)*(b.x-o.x);
  const hull=P=>{P.sort((a,b)=>a.x-b.x||a.y-b.y);const lo=[];for(const p of P){while(lo.length>1&&cross(lo[lo.length-2],lo[lo.length-1],p)<=0)lo.pop();lo.push(p);}
    const up=[];for(let i=P.length-1;i>=0;i--){const p=P[i];while(up.length>1&&cross(up[up.length-2],up[up.length-1],p)<=0)up.pop();up.push(p);}
    lo.pop();up.pop();return lo.concat(up);};
  const inter2=(a,b,c,e)=>{const rx=b.x-a.x,ry=b.y-a.y,ux=c.x-e.x,uy=c.y-e.y,den=rx*uy-ry*ux;if(Math.abs(den)<1e-9)return null;
    const t=((e.x-a.x)*uy-(e.y-a.y)*ux)/den,s=((e.x-a.x)*ry-(e.y-a.y)*rx)/den;if(t<1||s<1)return null;return{x:a.x+t*rx,y:a.y+t*ry};};
  const to4=H=>{let v=H.slice();
    while(v.length>4){const n=v.length;let bi=-1,bq=null,ba=1e18;
      for(let i=0;i<n;i++){const q=inter2(v[(i+n-1)%n],v[i],v[(i+1)%n],v[(i+2)%n]);if(!q)continue;
        const b=v[i],cc=v[(i+1)%n],ar=Math.abs((b.x-q.x)*(cc.y-q.y)-(b.y-q.y)*(cc.x-q.x))/2;if(ar<ba){ba=ar;bi=i;bq=q;}}
      if(bi<0){let k=0,m=1e18;for(let i=0;i<n;i++){const ar=Math.abs(cross(v[(i+n-1)%n],v[i],v[(i+1)%n]));if(ar<m){m=ar;k=i;}}v.splice(k,1);continue;}
      const j=(bi+1)%n,out=[];for(let k=0;k<n;k++){if(k===bi)out.push(bq);else if(k!==j)out.push(v[k]);}v=out;}
    return v;};
  const order=q=>{const mx_=q.reduce((s,p)=>s+p.x,0)/4,my=q.reduce((s,p)=>s+p.y,0)/4;
    return q.slice().sort((a,b)=>Math.atan2(a.y-my,a.x-mx_)-Math.atan2(b.y-my,b.x-mx_));};
  const quadOf=(lab,l)=>{const rl=new Int32Array(h).fill(-1),rr=new Int32Array(h).fill(-1),ct=new Int32Array(w).fill(-1),cb=new Int32Array(w).fill(-1);
    for(let i=0;i<N;i++){if(lab[i]!==l)continue;const x=i%w,y=(i/w)|0;if(rl[y]<0)rl[y]=x;rr[y]=x;if(ct[x]<0)ct[x]=y;cb[x]=y;}
    const P=[];for(let y=0;y<h;y++)if(rl[y]>=0){P.push({x:rl[y],y},{x:rr[y],y});}for(let x=0;x<w;x++)if(ct[x]>=0){P.push({x,y:ct[x]},{x,y:cb[x]});}
    if(P.length<8)return null;const H=hull(P);if(H.length<4)return null;const q=to4(H);return q.length===4?order(q):null;};
  const area=q=>Math.abs(q.reduce((s,p,i)=>{const n=q[(i+1)%4];return s+p.x*n.y-n.x*p.y;},0))/2;
  const score=q=>{const A=area(q)/N;if(A<.08||A>1.15)return 0;let sum=0,mn=1,ang=1;
    for(let i=0;i<4;i++){const a=q[i],b=q[(i+1)%4],e=q[(i+2)%4],len=Math.hypot(b.x-a.x,b.y-a.y),n=Math.max(12,(len/5)|0);let hit=0;
      for(let k=0;k<n;k++){const f=(k+.5)/n,x=Math.round(a.x+(b.x-a.x)*f),y=Math.round(a.y+(b.y-a.y)*f);
        if(x<=1||y<=1||x>=w-2||y>=h-2)hit+=.55;else if(mm[y*w+x]>tS)hit++;}
      const s=hit/n;sum+=s;mn=Math.min(mn,s);
      const ux=a.x-b.x,uy=a.y-b.y,vx=e.x-b.x,vy=e.y-b.y,co=(ux*vx+uy*vy)/((Math.hypot(ux,uy)*Math.hypot(vx,vy))||1);if(Math.abs(co)>.6)ang*=.5;}
    return(.5*sum/4+.5*mn)*Math.min(1,A/.3)*ang*(A>.9?.5:1)*asp(q);};
  const inter=(A,B)=>{const den=A.dx*B.dy-A.dy*B.dx;if(Math.abs(den)<1e-6)return null;const t=((B.x-A.x)*B.dy-(B.y-A.y)*B.dx)/den;return{x:A.x+t*A.dx,y:A.y+t*A.dy};};
  const snap=(q,R)=>{const Ls=[];
    for(let i=0;i<4;i++){const a=q[i],b=q[(i+1)%4],dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy)||1,nx=-dy/len,ny=dx/len;let bd=0,bs=-1;
      for(let dd=-R;dd<=R;dd++){let s=0;for(let k=1;k<24;k++){const f=k/24,x=Math.round(a.x+dx*f+nx*dd),y=Math.round(a.y+dy*f+ny*dd);if(x>=0&&y>=0&&x<w&&y<h)s+=mm[y*w+x];}s-=Math.abs(dd)*.01*mx;if(s>bs){bs=s;bd=dd;}}
      Ls.push({x:a.x+nx*bd,y:a.y+ny*bd,dx,dy});}
    const r=[];for(let i=0;i<4;i++){const p=inter(Ls[(i+3)%4],Ls[i]);r.push(p&&isFinite(p.x)&&isFinite(p.y)?p:q[i]);}
    return r;};
  const cands=[];
  let fOK=0;const good=()=>!thorough&&fOK||!thorough&&cands.length>0&&Math.max(...cands.map(c=>c.s))>=.78; /* early exit: stop trying more strategies once one is clearly good */
  /* real-boundary gate: each side must separate two clearly different colours (paper vs background) and the inside must look like one sheet */
  const px3=(x,y)=>{x=clamp(Math.round(x),1,w-2);y=clamp(Math.round(y),1,h-2);let r=0,g2=0,b2=0;for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++){const k=((y+j)*w+x+i)*4;r+=d[k];g2+=d[k+1];b2+=d[k+2];}return[r/9,g2/9,b2/9];};
  const gate=q=>{const cxq=(q[0].x+q[1].x+q[2].x+q[3].x)/4,cyq=(q[0].y+q[1].y+q[2].y+q[3].y)/4,off=Math.max(3,Math.round(Math.max(w,h)/90)),T=9;let sum=0,mn=1;
    for(let i=0;i<4;i++){const a=q[i],b=q[(i+1)%4],dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy)||1;let nx=-dy/len,ny=dx/len;
      if(nx*(cxq-(a.x+b.x)/2)+ny*(cyq-(a.y+b.y)/2)<0){nx=-nx;ny=-ny;}
      const n=Math.max(10,(len/4)|0);let ok=0,tot=0;
      for(let k=0;k<n;k++){const f=(k+.5)/n,x=a.x+dx*f,y=a.y+dy*f,ox=x-nx*off,oy=y-ny*off,ix=x+nx*off,iy=y+ny*off;
        tot++;if(ox<2||oy<2||ox>w-3||oy>h-3||ix<2||iy<2||ix>w-3||iy>h-3){ok+=.6;continue;}
        const A=px3(ix,iy),B=px3(ox,oy);if((Math.abs(A[0]-B[0])+Math.abs(A[1]-B[1])+Math.abs(A[2]-B[2]))/3>=T)ok++;}
      const sd=ok/tot;sum+=sd;if(sd<mn)mn=sd;}
    return{mean:sum/4,min:mn};};
  const geo=q=>{const A=area(q)/N;if(A<.08||A>1.15)return 0;let ang=1;
    for(let i=0;i<4;i++){const a=q[i],b=q[(i+1)%4],e=q[(i+2)%4],ux=a.x-b.x,uy=a.y-b.y,vx=e.x-b.x,vy=e.y-b.y,co=(ux*vx+uy*vy)/((Math.hypot(ux,uy)*Math.hypot(vx,vy))||1);if(Math.abs(co)>.6)ang*=.5;}
    return Math.min(1,A/.3)*ang*(A>.9?.5:1)*asp(q);};
  const add=q=>{if(!q)return;const s0=score(q);let b=q,s=s0;const q2=snap(q,8),s2=score(q2);if(s2>=s0*.95&&Math.abs(area(q2)-area(q))<.25*area(q)){b=q2;s=s2;}
    const gm=geo(b);if(gm<=0)return;const gg=gate(b);if(gg.min<.5||gg.mean<.7)return;cands.push({q:b,s:(.6*gg.mean+.4*gg.min)*gm*(.75+.25*Math.min(1,s))});};

  /* F) straight-line quad finder: oriented Hough on strong edges, then the best-supported 4-line rectangle. Robust for hand-held boxes and papers with busy backgrounds */
  const houghQuads=()=>{
    const cM=new Float32Array(N),cX=new Float32Array(N),cY=new Float32Array(N);let cmx=1;
    for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){const i=y*w+x,a0=(i-w-1)*4,a1=(i-w)*4,a2=(i-w+1)*4,b0=(i-1)*4,b2=(i+1)*4,c0=(i+w-1)*4,c1=(i+w)*4,c2=(i+w+1)*4;
      for(let ch=0;ch<3;ch++){const gx=d[a2+ch]+2*d[b2+ch]+d[c2+ch]-d[a0+ch]-2*d[b0+ch]-d[c0+ch],gy=d[c0+ch]+2*d[c1+ch]+d[c2+ch]-d[a0+ch]-2*d[a1+ch]-d[a2+ch],m=gx*gx+gy*gy;
        if(m>cM[i]){cM[i]=m;cX[i]=gx;cY[i]=gy;}}}
    const ch2=new Uint32Array(256);for(let i=0;i<N;i++){const m=Math.sqrt(cM[i]);cM[i]=m;if(m>cmx)cmx=m;}
    for(let i=0;i<N;i++)ch2[Math.min(255,(cM[i]/cmx*255)|0)]++;
    const pct=pp=>{let a=0;for(let b=255;b>=0;b--){a+=ch2[b];if(a>=pp*N)return b/255*cmx;}return 0;};
    const tH=Math.max(pct(.1),cmx*.05),tC=Math.max(pct(.12),cmx*.05),cmm=maxFilter(cM,w,h,1),diag=Math.ceil(Math.hypot(w,h)),RW=2*diag+1,TB=180,acc=new Float32Array(TB*RW),TS=Math.PI/TB,CT=new Float32Array(TB),ST=new Float32Array(TB);for(let b=0;b<TB;b++){CT[b]=Math.cos(b*TS);ST[b]=Math.sin(b*TS);}
    for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){const i=y*w+x,m=cM[i];if(m<tH)continue;
      let a=Math.atan2(cY[i],cX[i]);if(a<0)a+=Math.PI;if(a>=Math.PI)a-=Math.PI;const b0=Math.round(a/TS),wt=m/tH;
      for(let db=-2;db<=2;db++){const b=(b0+db+TB)%TB,r=Math.round(x*CT[b]+y*ST[b])+diag;acc[b*RW+r]+=wt*(db===0?1:Math.abs(db)===1?.7:.35);}}
    const minV=.22*Math.min(w,h),Ls=[],rs=Math.max(4,Math.round(Math.max(w,h)*.02));
    /* smooth over rho and pick peaks with suppression */
    const sm2=new Float32Array(TB*RW);for(let b=0;b<TB;b++){const o=b*RW;for(let r=1;r<RW-1;r++)sm2[o+r]=acc[o+r-1]*.5+acc[o+r]+acc[o+r+1]*.5;}
    const pk=[],thr=minV*.7;
    for(let b=0;b<TB;b++){const o=b*RW,o1=((b+1)%TB)*RW,o0=((b+TB-1)%TB)*RW;for(let r=1;r<RW-1;r++){const v=sm2[o+r];if(v<thr)continue;
      if(v>=sm2[o+r-1]&&v>=sm2[o+r+1]&&v>=sm2[o1+r]&&v>=sm2[o0+r])pk.push({b,r,v});}}
    pk.sort((a,b)=>b.v-a.v);
    for(const P of pk){if(Ls.length>=36)break;let near=0;
      for(const L of Ls){let db=Math.abs(L.b-P.b);if(db>TB/2)db=TB-db;if(db<=7&&Math.abs(L.r-P.r)<=rs){near=1;break;}}
      if(!near)Ls.push({b:P.b,r:P.r,th:P.b*TS,rho:P.r-diag,v:P.v});}
    const Hs=[],Vs=[];
    for(const L of Ls){const c=Math.cos(L.th),sn=Math.sin(L.th);L.c=c;L.s=sn;
      if(L.th<Math.PI/4||L.th>=3*Math.PI/4){L.pos=(L.rho-(h/2)*sn)/(c||1e-6);Vs.push(L);}else{L.pos=(L.rho-(w/2)*c)/(sn||1e-6);Hs.push(L);}}
    Hs.sort((a,b)=>b.v-a.v);Vs.sort((a,b)=>b.v-a.v);Hs.length=Math.min(Hs.length,11);Vs.length=Math.min(Vs.length,11);Hs.sort((a,b)=>a.pos-b.pos);Vs.sort((a,b)=>a.pos-b.pos);
    const X=(A,B)=>{const den=A.c*B.s-A.s*B.c;if(Math.abs(den)<.3)return null;return{x:(A.rho*B.s-B.rho*A.s)/den,y:(A.c*B.rho-B.c*A.rho)/den};};
    const out=[],mg=.12;let tried=0;
    for(let i=0;i<Hs.length;i++)for(let j=i+1;j<Hs.length;j++){if(Hs[j].pos-Hs[i].pos<h*.18)continue;
     for(let k=0;k<Vs.length;k++)for(let l=k+1;l<Vs.length;l++){if(Vs[l].pos-Vs[k].pos<w*.18)continue;
      const q=[X(Hs[i],Vs[k]),X(Hs[i],Vs[l]),X(Hs[j],Vs[l]),X(Hs[j],Vs[k])];if(q.some(p=>!p))continue;
      if(q.some(p=>p.x<-w*mg||p.x>w*(1+mg)||p.y<-h*mg||p.y>h*(1+mg)))continue;
      let sg=0,ok=1;for(let t=0;t<4;t++){const c=cross(q[t],q[(t+1)%4],q[(t+2)%4]);if(!sg)sg=c>0?1:-1;else if((c>0?1:-1)!==sg){ok=0;break;}}
      if(!ok)continue;const A=area(q)/N;if(A<.1||A>1.2)continue;
      for(let t=0;t<4;t++){const a=q[t],b=q[(t+1)%4],e=q[(t+2)%4],ux=a.x-b.x,uy=a.y-b.y,vx=e.x-b.x,vy=e.y-b.y,co=(ux*vx+uy*vy)/((Math.hypot(ux,uy)*Math.hypot(vx,vy))||1);if(Math.abs(co)>.55){ok=0;break;}}
      if(!ok)continue;tried++;
      let sum=0,mn=1,bad=0;
      for(let t=0;t<4;t++){const a=q[t],b=q[(t+1)%4],len=Math.hypot(b.x-a.x,b.y-a.y),n=Math.max(12,(len/3.5)|0);let hit=0;
        for(let u=0;u<n;u++){const f=(u+.5)/n,x=Math.round(a.x+(b.x-a.x)*f),y=Math.round(a.y+(b.y-a.y)*f);
          if(x<=1||y<=1||x>=w-2||y>=h-2)hit+=.55;else if(cmm[y*w+x]>tC)hit++;}
        const sd=hit/n;if(sd<.4){bad=1;break;}sum+=sd;if(sd<mn)mn=sd;}
      if(bad)continue;
      const sc=(.5*sum/4+.5*mn)*(.5+.5*Math.sqrt(Math.min(1,A)));
      out.push({q,sc,mn,A});}}
    out.sort((a,b)=>b.sc-a.sc);const top=out.slice(0,6),rest=out.slice(6).sort((a,b)=>b.sc*b.A-a.sc*a.A).slice(0,4);return top.concat(rest);};
  const add2=(q,fs)=>{const qc=q.map(p=>({x:clamp(p.x,0,w-1),y:clamp(p.y,0,h-1)}));const gm=geo(qc);if(gm<=0)return;const gg=gate(qc),sc=score(qc);
    if(gg.min<.3||gg.mean<.55){if(fs>=.6)cands.push({q:qc,s:.55*fs*gm});return;}
    cands.push({q:qc,s:(.6*gg.mean+.4*gg.min)*gm*(.75+.25*Math.min(1,sc))*(.8+.2*Math.min(1,area(qc)/N/.55))});};
  // A) brightness segmentation, both polarities
  const hs=new Float64Array(256);for(let i=0;i<N;i++)hs[clamp(gb[i]|0,0,255)]++;
  let sum=0;for(let i=0;i<256;i++)sum+=i*hs[i];let wB=0,sB=0,bv=-1,th=128;
  for(let i=0;i<256;i++){wB+=hs[i];if(!wB)continue;const wF=N-wB;if(!wF)break;sB+=i*hs[i];const mB=sB/wB,mF=(sum-sB)/wF,v=wB*wF*(mB-mF)*(mB-mF);if(v>bv){bv=v;th=i;}}
  for(const pol of[true,false]){const m=new Uint8Array(N);for(let i=0;i<N;i++)m[i]=((gb[i]>th)===pol)?1:0;const r=comp(m);if(r.bn/N>.1)add(quadOf(r.lab,r.bl));}
  if(!fast||!good()){try{const HQ=houghQuads();for(const o of HQ)if(o.mn>=.4)add2(o.q,o.sc);if(HQ.length&&HQ[0].sc>=.7&&HQ[0].mn>=.6&&cands.length)fOK=1;}catch(e){}}
  // B) closed-edge regions at several sensitivities
  if(!good())for(const p of[.06,.1,.15,.22]){if(good())break;const th2=thrAt(p),e=new Float32Array(N);for(let i=0;i<N;i++)e[i]=mag[i]>th2?1:0;
    const ed=boxBlur(e,w,h,2),bg=new Uint8Array(N),st=new Int32Array(N);let sp=0;
    const seed=i=>{if(!bg[i]&&ed[i]<=.02){bg[i]=1;st[sp++]=i;}};
    for(let x=0;x<w;x++){seed(x);seed((h-1)*w+x);}for(let y=0;y<h;y++){seed(y*w);seed(y*w+w-1);}
    while(sp){const i=st[--sp],x=i%w,y=(i/w)|0;if(x>0)seed(i-1);if(x<w-1)seed(i+1);if(y>0)seed(i-w);if(y<h-1)seed(i+w);}
    const reg=new Uint8Array(N);for(let i=0;i<N;i++)reg[i]=bg[i]?0:1;const r=comp(reg);if(r.bn/N>.1)add(quadOf(r.lab,r.bl));}
  // C) colour distance from the border background (white paper on light table)
  if(!good()){const bw=Math.max(3,Math.round(Math.min(w,h)*.04)),smp=[];
   for(let y=0;y<h;y++)for(let x=0;x<w;x++){if(x<bw||y<bw||x>=w-bw||y>=h-bw)smp.push(y*w+x);}
   const med=c=>{const H=new Uint32Array(256);for(let k=0;k<smp.length;k++)H[d[smp[k]*4+c]]++;let a=0;const t=smp.length>>1;for(let v=0;v<256;v++){a+=H[v];if(a>t)return v;}return 0;},mr=med(0),mg=med(1),mb=med(2);
   const ds=new Float32Array(N);for(let i=0;i<N;i++)ds[i]=(Math.abs(d[i*4]-mr)+Math.abs(d[i*4+1]-mg)+Math.abs(d[i*4+2]-mb))/3;
   const db=boxBlur(ds,w,h,2),hh=new Float64Array(256);for(let i=0;i<N;i++)hh[clamp(db[i]|0,0,255)]++;
   let s2=0;for(let i=0;i<256;i++)s2+=i*hh[i];let w1=0,s1=0,bv2=-1,t2=20;
   for(let i=0;i<256;i++){w1+=hh[i];if(!w1)continue;const w2=N-w1;if(!w2)break;s1+=i*hh[i];const m1=s1/w1,m2=(s2-s1)/w2,v=w1*w2*(m1-m2)*(m1-m2);if(v>bv2){bv2=v;t2=i;}}
   t2=Math.max(12,t2);const cm=new Uint8Array(N);for(let i=0;i<N;i++)cm[i]=db[i]>t2?1:0;
   const cr=comp(cm);if(cr.bn/N>.1)add(quadOf(cr.lab,cr.bl));}
  // D) region-grow from the centre of the frame (the sheet is usually where the user points the camera)
  if(!good()){const ch=[0,1,2].map(c=>{const a=new Float32Array(N);for(let i=0;i<N;i++)a[i]=d[i*4+c];return boxBlur(a,w,h,2);}),med=[0,0,0],
    x0=(w*.42)|0,x1=(w*.58)|0,y0=(h*.42)|0,y1=(h*.58)|0;
   for(let c=0;c<3;c++){const v=[];for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++)v.push(ch[c][y*w+x]);v.sort((a,b)=>a-b);med[c]=v[v.length>>1];}
   for(const tol of[18,32]){const m=new Uint8Array(N),st=new Int32Array(N);let sp=0;
    const ok=i=>!m[i]&&(Math.abs(ch[0][i]-med[0])+Math.abs(ch[1][i]-med[1])+Math.abs(ch[2][i]-med[2]))/3<=tol;
    const seed=(w>>1)+(h>>1)*w;m[seed]=1;st[sp++]=seed;
    while(sp){const i=st[--sp],x=i%w,y=(i/w)|0;
     if(x>0&&ok(i-1)){m[i-1]=1;st[sp++]=i-1;}if(x<w-1&&ok(i+1)){m[i+1]=1;st[sp++]=i+1;}
     if(y>0&&ok(i-w)){m[i-w]=1;st[sp++]=i-w;}if(y<h-1&&ok(i+w)){m[i+w]=1;st[sp++]=i+w;}}
    const r=comp(m);if(r.bn/N>.1)add(quadOf(r.lab,r.bl));}}
  // E) shadow-proof paper mask: signed distance (brighter than the surface, or bluish-white tint) so a darker cast shadow is never counted as paper
  if(!good()){const bw=Math.max(3,Math.round(Math.min(w,h)*.04)),smp=[];
   for(let y=0;y<h;y++)for(let x=0;x<w;x++){if(x<bw||y<bw||x>=w-bw||y>=h-bw)smp.push(y*w+x);}
   const all=[];for(let i=0;i<N;i+=3)all.push(i);
   const medOf=(S,c)=>{const H=new Uint32Array(256);for(let k=0;k<S.length;k++)H[d[S[k]*4+c]]++;let a=0;const t=S.length>>1;for(let v=0;v<256;v++){a+=H[v];if(a>t)return v;}return 0;};
   const refs=[smp,all].map(S=>[medOf(S,0),medOf(S,1),medOf(S,2)]);
   for(const R0 of refs){const Lb=.299*R0[0]+.587*R0[1]+.114*R0[2],tb=R0[2]-R0[0],fs=new Float32Array(N);
    for(let i=0;i<N;i++){const r=d[i*4],g2=d[i*4+1],b=d[i*4+2],L=.299*r+.587*g2+.114*b;fs[i]=Math.max(0,L-Lb)+1.5*Math.max(0,(b-r)-tb);}
    const fb=boxBlur(boxBlur(fs,w,h,1),w,h,1),hh=new Float64Array(256);for(let i=0;i<N;i++)hh[clamp(fb[i]|0,0,255)]++;
    let s2=0;for(let i=0;i<256;i++)s2+=i*hh[i];let w1=0,s1=0,bv2=-1,t2=20;
    for(let i=0;i<256;i++){w1+=hh[i];if(!w1)continue;const w3=N-w1;if(!w3)break;s1+=i*hh[i];const m1=s1/w1,m2=(s2-s1)/w3,v=w1*w3*(m1-m2)*(m1-m2);if(v>bv2){bv2=v;t2=i;}}
    t2=clamp(t2,8,90);
    for(const k of[1,.6]){const m0=new Float32Array(N);for(let i=0;i<N;i++)m0[i]=fb[i]>t2*k?1:0;
     const dl=boxBlur(m0,w,h,2),m=new Uint8Array(N);for(let i=0;i<N;i++)m[i]=dl[i]>.02?1:0;
     const m3=new Float32Array(N);for(let i=0;i<N;i++)m3[i]=m[i];const er=boxBlur(m3,w,h,2);for(let i=0;i<N;i++)m[i]=er[i]>.98?1:0;
     const r=comp(m);if(r.bn/N>.08){const n0=cands.length;add(quadOf(r.lab,r.bl));for(let j=n0;j<cands.length;j++)cands[j].s*=1.2;}}}}
  cands.sort((a,b)=>b.s-a.s);
  const norm=q=>{const cxm=q.reduce((s,p)=>s+p.x,0)/4,cym=q.reduce((s,p)=>s+p.y,0)/4;
    return q.map(p=>({x:clamp((p.x+.5)/w-((p.x+.5)/w-(cxm+.5)/w)*.002,0,1),y:clamp((p.y+.5)/h-((p.y+.5)/h-(cym+.5)/h)*.002,0,1)}));};
  const full=[{x:.05,y:.05},{x:.95,y:.05},{x:.95,y:.95},{x:.05,y:.95}];
  const raw=[];
  for(const c of cands){if(c.s<Math.max(.3,cands[0].s*.55))break;const n=norm(c.q);
    if(!raw.some(o=>o.every((p,i)=>Math.hypot(p.x-n[i].x,p.y-n[i].y)<.05)))raw.push(n);if(raw.length>=3)break;}
  const out=fast?raw:raw.map((n,i)=>{if(i>0&&!thorough)return n;try{return refineQuad(src,n,{R:.025,passes:3});}catch(e){return n;}});
  const nFound=raw.length;
  if(nFound&&out.length<3){const b=out[0],cx=b.reduce((a,p)=>a+p.x,0)/4,cy=b.reduce((a,p)=>a+p.y,0)/4;
   for(const k of[.965,1.035]){if(out.length>=3)break;const g=k<1?-.025:.025,d=b.map(p=>{const dx=p.x-cx,dy=p.y-cy,L=Math.sqrt(dx*dx+dy*dy)||1;return{x:clamp(p.x+dx/L*g,.01,.99),y:clamp(p.y+dy/L*g,.01,.99)};});
    if(!out.some(o=>o.every((p,i)=>Math.hypot(p.x-d[i].x,p.y-d[i].y)<.012)))out.push(d);}}
  out.push(full);
  detectCorners.alts=out;detectCorners.src=src;detectCorners.full=!!thorough;detectCorners.found=nFound>0;detectCorners.best=cands.length?cands[0].s:0;
  return out[0];
}
(window.__edges=window.__edges||{}).detectCorners=detectCorners;(window.__edges).refineQuad=refineQuad; /* hook للاختبار: بيكشف الدوال من غير ما يغيّر أي سلوك */

/* ---------- perspective warp ---------- */
function solveH(dst,srcp){
  const A=[],B=[];
  for(let i=0;i<4;i++){const[x,y]=dst[i],[u,v]=srcp[i];
    A.push([x,y,1,0,0,0,-u*x,-u*y]);B.push(u);A.push([0,0,0,x,y,1,-v*x,-v*y]);B.push(v);}
  const n=8;for(let i=0;i<n;i++){A[i].push(B[i]);}
  for(let i=0;i<n;i++){let m=i;for(let r=i+1;r<n;r++)if(Math.abs(A[r][i])>Math.abs(A[m][i]))m=r;[A[i],A[m]]=[A[m],A[i]];
    const pv=A[i][i]||1e-12;for(let j=i;j<=n;j++)A[i][j]/=pv;
    for(let r=0;r<n;r++){if(r===i)continue;const f=A[r][i];if(!f)continue;for(let j=i;j<=n;j++)A[r][j]-=f*A[i][j];}}
  return A.map(r=>r[n]);
}

/* true page aspect (w/h) from a perspective quad; assumes square pixels + centred principal point (Zhang&He) */
function pageAspect(P,sw,sh){
  const u0=sw/2,v0=sh/2,m1=[P[0].x,P[0].y,1],m2=[P[1].x,P[1].y,1],m3=[P[3].x,P[3].y,1],m4=[P[2].x,P[2].y,1];
  const cr=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],dt=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
  const d=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
  const nw=(d(P[0],P[1])+d(P[3],P[2]))/2,nh=(d(P[0],P[3])+d(P[1],P[2]))/2,naive=nw/Math.max(1,nh);
  let r=naive;
  const k2=dt(cr(m1,m4),m3)/dt(cr(m2,m4),m3),k3=dt(cr(m1,m4),m2)/dt(cr(m3,m4),m2);
  if(isFinite(k2)&&isFinite(k3)&&k2>0&&k3>0&&(Math.abs(k2-1)>.01||Math.abs(k3-1)>.01)){
    const n2=[k2*m2[0]-m1[0],k2*m2[1]-m1[1],k2*m2[2]-m1[2]],n3=[k3*m3[0]-m1[0],k3*m3[1]-m1[1],k3*m3[2]-m1[2]];
    const den=n2[2]*n3[2];let f=0;
    if(Math.abs(den)>1e-3*Math.max(1,Math.abs(n2[2]),Math.abs(n3[2]))){
      const f2=-(1/den)*((n2[0]*n3[0]-(n2[0]*n3[2]+n2[2]*n3[0])*u0+den*u0*u0)+(n2[1]*n3[1]-(n2[1]*n3[2]+n2[2]*n3[1])*v0+den*v0*v0));
      if(f2>0&&isFinite(f2))f=Math.sqrt(f2);
    }
    if(!(f>0.3*Math.max(sw,sh)&&f<3*Math.max(sw,sh)))f=.8*Math.max(sw,sh); // degenerate (one pair parallel): typical phone focal length
    const q=n=>{const a=(n[0]-u0*n[2])/f,b=(n[1]-v0*n[2])/f;return a*a+b*b+n[2]*n[2];};
    const rr=Math.sqrt(q(n2)/q(n3));
    if(isFinite(rr)&&rr>.3&&rr<3.3&&rr/naive>.6&&rr/naive<1.7)r=rr;
  }
  // snap to standard paper (A4/A5 1.414, Letter 1.294; مع tx_edge2: وبطاقة ID-1 1.586) when close
  const lg=Math.max(r,1/r),sm=Math.min(r,1/r);void sm;
  for(const s of(localStorage.getItem('tx_edge2')!=='0'?[1.4142,1.2941,1.5857]:[1.4142,1.2941])){if(Math.abs(lg-s)/s<.045){r=r>=1?s:1/s;break;}}
  return r;
}
function warp(src,corners,maxEdge){
  const sw=src.width,sh=src.height,P=corners.map(p=>({x:p.x*sw,y:p.y*sh}));
  const d=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
  let W=Math.max(d(P[0],P[1]),d(P[3],P[2])),H=Math.max(d(P[0],P[3]),d(P[1],P[2]));
  try{const r=pageAspect(P,sw,sh);if(r){const a=W*H;let nw=Math.sqrt(a*r),nh=nw/r;W=nw;H=nh;}}catch(e){}
  const k=Math.min(1,maxEdge/Math.max(W,H));W=Math.max(8,Math.round(W*k));H=Math.max(8,Math.round(H*k));
  const hm=solveH([[0,0],[W,0],[W,H],[0,H]],P.map(p=>[p.x,p.y]));
  const sd=src.getContext('2d',{willReadFrequently:true}).getImageData(0,0,sw,sh).data;
  const out=new ImageData(W,H),o=out.data;
  const [h0,h1,h2,h3,h4,h5,h6,h7]=hm;
  for(let y=0;y<H;y++){for(let x=0;x<W;x++){
    const xx=x+.5,yy=y+.5,den=h6*xx+h7*yy+1;
    let u=(h0*xx+h1*yy+h2)/den-.5,v=(h3*xx+h4*yy+h5)/den-.5;
    u=clamp(u,0,sw-1.001);v=clamp(v,0,sh-1.001);
    const x0=u|0,y0=v|0,fx=u-x0,fy=v-y0,i00=(y0*sw+x0)*4,i10=i00+4,i01=i00+sw*4,i11=i01+4;
    const w00=(1-fx)*(1-fy),w10=fx*(1-fy),w01=(1-fx)*fy,w11=fx*fy,oi=(y*W+x)*4;
    o[oi]=sd[i00]*w00+sd[i10]*w10+sd[i01]*w01+sd[i11]*w11;
    o[oi+1]=sd[i00+1]*w00+sd[i10+1]*w10+sd[i01+1]*w01+sd[i11+1]*w11;
    o[oi+2]=sd[i00+2]*w00+sd[i10+2]*w10+sd[i01+2]*w01+sd[i11+2]*w11;
    o[oi+3]=255;}}
  const c=mk(W,H);c.getContext('2d').putImageData(out,0,0);return c;
}
(window.__edges=window.__edges||{}).warp=warp;
function rotateCanvas(c,r){r=((r%4)+4)%4;if(!r)return c;const o=r%2?mk(c.height,c.width):mk(c.width,c.height);const x=o.getContext('2d');x.translate(o.width/2,o.height/2);x.rotate(r*Math.PI/2);x.drawImage(c,-c.width/2,-c.height/2);return o;}
const warpRot=(src,p,edge)=>rotateCanvas(warp(src,p.corners,edge),p.rot);

/* ---------- enhancement ---------- */
function makeBase(canvas){
  const w=canvas.width,h=canvas.height,img=canvas.getContext('2d',{willReadFrequently:true}).getImageData(0,0,w,h),s8=img.data,N=w*h;
  const s=Math.max(2,Math.round(Math.max(w,h)/140)),gw=Math.ceil(w/s),gh=Math.ceil(h/s),G=gw*gh;
  /* 1) how bright is the paper normally? (60th percentile) -> tells real glare apart from plain white paper */
  const h0=new Uint32Array(256);for(let i=0;i<N;i++)h0[(s8[i*4]*77+s8[i*4+1]*150+s8[i*4+2]*29)>>8]++;
  let ac0=0,p60=255;for(let i=0;i<256;i++){ac0+=h0[i];if(ac0>=N*.6){p60=i;break;}}
  /* 2) flash / glare hot-spots: clipped in every channel while the page is clearly darker; grown a little to cover the bloom halo */
  const gl=new Uint8Array(N);let gc=0;
  if(p60<226)for(let i=0;i<N;i++){const k=i*4;if(s8[k]>=246&&s8[k+1]>=246&&s8[k+2]>=246){gl[i]=1;gc++;}}
  let ga=null;const mxe=Math.max(w,h);
  if(gc>N*.0004){const m0=new Float32Array(N);for(let i=0;i<N;i++)m0[i]=gl[i];const dl=boxBlur(m0,w,h,Math.max(3,Math.round(mxe/22))),m1=new Float32Array(N);
    for(let i=0;i<N;i++){if(gl[i]){m1[i]=1;continue;}if(dl[i]>.02){const k=i*4;if(((s8[k]*77+s8[k+1]*150+s8[k+2]*29)>>8)>p60+18)m1[i]=1;}}
    for(let i=0;i<N;i++)gl[i]=m1[i];ga=boxBlur(m1,w,h,Math.max(2,Math.round(mxe/300)));}else gc=0;
  /* 3) paper-colour field, glare pixels excluded then filled from their neighbours; dilate+blur drops text so the field is the lit paper (shadows included) */
  const ch=[new Float32Array(G),new Float32Array(G),new Float32Array(G)],cnt=new Float32Array(G);
  for(let y=0;y<h;y++){const gy=((y/s)|0)*gw;for(let x=0;x<w;x++){const i=y*w+x;if(gl[i])continue;const gi=gy+((x/s)|0),k=i*4;cnt[gi]++;ch[0][gi]+=s8[k];ch[1][gi]+=s8[k+1];ch[2][gi]+=s8[k+2];}}
  const need=s*s*.12,ok=new Uint8Array(G);
  for(let i=0;i<G;i++){if(cnt[i]>=need){ok[i]=1;for(let c=0;c<3;c++)ch[c][i]/=cnt[i];}else for(let c=0;c<3;c++)ch[c][i]=0;}
  for(let it=0;it<80;it++){let miss=0;const add=[];
    for(let gy=0;gy<gh;gy++)for(let gx=0;gx<gw;gx++){const i=gy*gw+gx;if(ok[i])continue;let n=0,a=0,b2=0,c2=0;
      const nb=[gx>0?i-1:-1,gx<gw-1?i+1:-1,gy>0?i-gw:-1,gy<gh-1?i+gw:-1];
      for(const j of nb)if(j>=0&&ok[j]){n++;a+=ch[0][j];b2+=ch[1][j];c2+=ch[2][j];}
      if(n)add.push([i,a/n,b2/n,c2/n]);else miss++;}
    for(const q of add){ch[0][q[0]]=q[1];ch[1][q[0]]=q[2];ch[2][q[0]]=q[3];ok[q[0]]=1;}if(!miss)break;}
  for(let i=0;i<G;i++)if(!ok[i]){ch[0][i]=ch[1][i]=ch[2][i]=200;}
  for(let c=0;c<3;c++)ch[c]=boxBlur(maxFilter(ch[c],gw,gh,2),gw,gh,2);
  /* 4) read the page: median paper colour of the brighter half -> white paper or a vivid/coloured background? */
  const lumB=new Float32Array(G);for(let i=0;i<G;i++)lumB[i]=.299*ch[0][i]+.587*ch[1][i]+.114*ch[2][i];
  const ord=Array.from({length:G},(_,i)=>i).sort((a,b2)=>lumB[b2]-lumB[a]).slice(0,Math.max(1,G>>1));
  const med=c=>{const v=ord.map(i=>ch[c][i]).sort((a,b2)=>a-b2);return v[v.length>>1];};
  const mr=med(0),mg=med(1),mb=med(2),mL=.299*mr+.587*mg+.114*mb,mxc=Math.max(mr,mg,mb),mnc=Math.min(mr,mg,mb),sat=mxc>0?(mxc-mnc)/mxc:0;
  const vivid=sat>.27&&mL>60,Tl=Math.min(mL*1.08,mL*250/Math.max(1,mxc)),mc=[mr,mg,mb];
  const norm=new Uint8ClampedArray(s8.length),hist=new Float64Array(256);
  const x0=new Int32Array(w),x1=new Int32Array(w),wx=new Float32Array(w);
  for(let x=0;x<w;x++){const fx=clamp((x+.5)/s-.5,0,gw-1);x0[x]=fx|0;x1[x]=Math.min(gw-1,x0[x]+1);wx[x]=fx-x0[x];}
  const fill=vivid?[mr/mL*Tl,mg/mL*Tl,mb/mL*Tl]:[250,250,250];
  for(let y=0;y<h;y++){const fy=clamp((y+.5)/s-.5,0,gh-1),y0=fy|0,y1=Math.min(gh-1,y0+1),wy=fy-y0,r0=y0*gw,r1=y1*gw,bgc=[0,0,0];
    for(let x=0;x<w;x++){const i=(y*w+x)*4,a=x0[x],b2=x1[x],fx=wx[x];
      for(let c=0;c<3;c++){const A=ch[c];const top=A[r0+a]*(1-fx)+A[r0+b2]*fx,bot=A[r1+a]*(1-fx)+A[r1+b2]*fx;bgc[c]=top*(1-wy)+bot*wy;}
      if(vivid){/* coloured page: flatten brightness only, keep the hue (per-channel division would bleach it) */
        const bL=.299*bgc[0]+.587*bgc[1]+.114*bgc[2],k=clamp(Tl/Math.max(bL,mL*.3),.7,3.2);
        for(let c=0;c<3;c++)norm[i+c]=Math.min(255,s8[i+c]*k);
      }else{for(let c=0;c<3;c++){const bg=Math.max(55,.3*mc[c],bgc[c]);norm[i+c]=Math.min(255,s8[i+c]*250/bg);}}
      if(ga){const al=ga[y*w+x];if(al>.01)for(let c=0;c<3;c++)norm[i+c]+=(fill[c]-norm[i+c])*al;}
      norm[i+3]=255;hist[(norm[i]*77+norm[i+1]*150+norm[i+2]*29)>>8]++;}}
  const total=w*h;let acc=0,lo=0,hi=255,gotLo=false;
  for(let i=0;i<256;i++){acc+=hist[i];if(!gotLo&&acc>=total*.006){lo=i;gotLo=true;}if(acc>=total*.7){hi=i;break;}}
  lo=Math.min(lo,90);hi=clamp(hi,190,255);
  if(vivid){lo=Math.min(lo,12);hi=255;}
  return{w,h,src:s8,norm,lo:lo/255,hi:hi/255,vivid,glare:gc/N,sat};
}
function buildLUT(f,br,ct,lo,hi,vv){
  const L=new Uint8ClampedArray(256),bAdd=br/100*.3,cf=ct>=0?1+ct/60:1+ct/150;
  for(let i=0;i<256;i++){let v=i/255;
    if(f!=='original'){v=clamp((v-lo)/(hi-lo),0,1);}
    if(f==='magic'){v=clamp((v-.5)*(vv?1.08:1.22)+.5,0,1);}
    else if(f==='gray'){v=clamp((v-.5)*1.1+.5,0,1);}
    else if(f==='bw'){v=clamp((v-.6)*8+.5,0,1);}
    v+=bAdd;v=(v-.5)*cf+.5;L[i]=clamp(v,0,1)*255;}
  return L;
}
/* سطوع/تباين/تشبّع فوق ناتج الفلاتر الجديدة (نفس منحنى السطوع والتباين القديم، من غير مط lo/hi) */
function txAdjust(o,br,ct,sat){
  if(!br&&!ct&&!sat)return;const L=buildLUT('original',br,ct,0,1,false),sf=1+sat/100;
  for(let i=0;i<o.length;i+=4){let r=L[o[i]],g=L[o[i+1]],b=L[o[i+2]];
    if(sat){const l=.299*r+.587*g+.114*b;r=l+(r-l)*sf;g=l+(g-l)*sf;b=l+(b-l)*sf;}
    o[i]=r;o[i+1]=g;o[i+2]=b;}
}
function toneCanvas(base,f,br,ct,sat){
  const{w,h}=base,sd=f==='original'?base.src:base.norm,lut=buildLUT(f,br,ct,base.lo,base.hi,base.vivid);
  const mc=toneCanvas._m||(toneCanvas._m={}),mk2=w+'x'+h,out=mc[mk2]||(mc[mk2]=new ImageData(w,h)),o=out.data,gray=f==='gray'||f==='bw';
  if(window.TXF&&TXF.has(f)){TXF.render(f,base,o);txAdjust(o,br,ct,sat);const c2=mk(w,h);c2.getContext('2d').putImageData(out,0,0);return c2;} /* فلاتر المرحلة 2 (filters.js) */
  const sf=gray?1:Math.min((f==='magic'?1.3:f==='auto'?1.06:1),base.vivid&&f!=='original'?1.05:9)*(1+sat/100),doSat=!gray&&Math.abs(sf-1)>.01;
  for(let i=0;i<sd.length;i+=4){let r=sd[i],g=sd[i+1],b=sd[i+2];
    if(gray){const l=lut[(r*77+g*150+b*29)>>8];r=g=b=l;}
    else{r=lut[r];g=lut[g];b=lut[b];if(doSat){const l=.299*r+.587*g+.114*b;r=l+(r-l)*sf;g=l+(g-l)*sf;b=l+(b-l)*sf;}}
    o[i]=r;o[i+1]=g;o[i+2]=b;o[i+3]=255;}
  const c=mk(w,h);c.getContext('2d').putImageData(out,0,0);return c;
}

(window.__edges=window.__edges||{}).makeBase=makeBase;window.__edges.toneCanvas=toneCanvas; /* hook للاختبار (مرحلة 2) */
/* ---------- annotations ---------- */
const mctx=mk(2,2).getContext('2d');
const isRtl=s=>/[֐-ࣿ]/.test(s);
const TFONTS={cairo:['Cairo',"Cairo,Inter,system-ui,sans-serif"],noto:['Noto Sans Arabic',"'Noto Sans Arabic',Inter,system-ui,sans-serif"],inter:['Inter',"Inter,Cairo,system-ui,sans-serif"],manrope:['Manrope','Manrope,Cairo,system-ui,sans-serif'],outfit:['Outfit','Outfit,Cairo,system-ui,sans-serif'],serif:['Serif',"Georgia,'Times New Roman',Cairo,serif"],mono:['Mono','ui-monospace,Menlo,Consolas,Cairo,monospace']};
const TPICK=['cairo','noto','inter'],TSAMP={cairo:'أبجد Aa',noto:'أبجد Aa',inter:'Abc 123'};
const TWTS=[[400,'عادي','Regular'],[600,'متوسط','Medium'],[800,'عريض','Bold']];
window.TXFONTS=(document.readyState==='complete'?Promise.resolve():new Promise(r=>addEventListener('load',r,{once:true}))).then(function(){try{const a=[];[['Cairo','أبجد Aa'],['Noto Sans Arabic','أبجد Aa'],['Inter','Abc 123']].forEach(f=>[400,600,800].forEach(w=>a.push(document.fonts.load(w+' 20px "'+f[0]+'"',f[1]).catch(()=>0))));return Promise.all(a).then(()=>{try{redrawOv()}catch(_){}});}catch(e){return Promise.resolve();}});
function fontCards(host,cur,pick){host.innerHTML='';host.className='fcards';host.setAttribute('role','radiogroup');
  TPICK.forEach(k=>{const b=document.createElement('button');b.type='button';b.className='fcard';b.dataset.k=k;b.setAttribute('role','radio');b.setAttribute('aria-label',TFONTS[k][0]);
    const a=document.createElement('span');a.className='fs';a.textContent=TSAMP[k];a.style.fontFamily=TFONTS[k][1];const n=document.createElement('span');n.className='fn';n.textContent=TFONTS[k][0].replace('Noto Sans Arabic','Noto Arabic');
    b.append(a,n);b.onclick=()=>pick(k);host.appendChild(b);});fontCardsSet(host,cur);}
function fontCardsSet(host,cur){host.querySelectorAll('.fcard').forEach(b=>{const on=b.dataset.k===cur;b.classList.toggle('on',on);b.setAttribute('aria-checked',on?'true':'false');});}
function wtSeg(host,cur,pick){const ar=(typeof lang==='undefined'||lang==='ar');host.innerHTML='';host.className='wseg';host.setAttribute('role','radiogroup');
  TWTS.forEach(w=>{const b=document.createElement('button');b.type='button';b.dataset.w=w[0];b.textContent=ar?w[1]:w[2];b.style.fontWeight=w[0];b.setAttribute('role','radio');b.onclick=()=>pick(w[0]);host.appendChild(b);});wtSet(host,cur);}
function wtSet(host,cur){host.querySelectorAll('button').forEach(b=>{const on=+b.dataset.w===+cur;b.classList.toggle('on',on);b.setAttribute('aria-checked',on?'true':'false');});}
function tpos(L,w,h,a){return[clamp(a.x*w,0,Math.max(0,w-L.bw)),clamp(a.y*h,0,Math.max(0,h-L.bh))];}
function drawSel(x,w,h){const a=E.sel;if(!a||!E.page||(!E.page.ann.includes(a)&&a!==E.draft))return;if(a.t==='sig'){const S=a.s*w,bh=a.r*S,m=w*.012;x.save();x.setLineDash([w*.012,w*.008]);x.lineWidth=Math.max(1.5,w*.003);x.strokeStyle='#1B63F0';x.strokeRect(a.x*w-S/2-m,a.y*h-bh/2-m,S+m*2,bh+m*2);x.restore();return;}if(a.t!=='text'&&a.t!=='note')return;
  const L=layoutText(mctx,w,a),q=tpos(L,w,h,a),m=w*.01;x.save();x.setLineDash([w*.012,w*.008]);x.lineWidth=Math.max(1.5,w*.003);x.strokeStyle='#1B63F0';x.strokeRect(q[0]-m,q[1]-m,L.bw+m*2,L.bh+m*2);x.restore();}
function layoutText(ctx,w,a){
  const fs=a.s*w,pad=a.t==='note'?fs*.6:0,maxW=(a.t==='note'?.42:.8)*w-pad*2;
  ctx.font=`${a.w||600} ${fs}px ${(TFONTS[a.f]||TFONTS.manrope)[1]}`;
  const lines=[];
  for(const para of String(a.txt).split('\n')){const words=para.split(/\s+/);let cur='';
    for(const wd of words){const tr=cur?cur+' '+wd:wd;if(ctx.measureText(tr).width>maxW&&cur){lines.push(cur);cur=wd;}else cur=tr;}
    lines.push(cur);}
  const lh=fs*1.3;let bw=0;for(const l of lines)bw=Math.max(bw,ctx.measureText(l).width);
  return{lines,fs,pad,lh,bw:bw+pad*2,bh:lines.length*lh+pad*2-(lh-fs)*.4};
}
function drawOne(ctx,w,h,a){if(a.t==='sig'){sigDraw(ctx,w,h,a);return;}if(a.t==='txtr'){txtDraw(ctx,w,h,a);return;}if(a.t==='fill'){if(a.live)fillShape(ctx,w,h,a,'rgba(229,50,45,.5)');return;}
  ctx.save();ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle=a.c;ctx.fillStyle=a.c;
  const lw=(a.w||0)*w;
  if(a.t==='pen'||a.t==='hl'){
    if(a.t==='hl'){ctx.globalAlpha=.4;ctx.lineCap='butt';}
    ctx.lineWidth=lw;ctx.beginPath();const p=a.p;ctx.moveTo(p[0][0]*w,p[0][1]*h);
    if(p.length===1)ctx.lineTo(p[0][0]*w+.01,p[0][1]*h);
    for(let i=1;i<p.length-1;i++){ctx.quadraticCurveTo(p[i][0]*w,p[i][1]*h,(p[i][0]+p[i+1][0])/2*w,(p[i][1]+p[i+1][1])/2*h);}
    if(p.length>1)ctx.lineTo(p[p.length-1][0]*w,p[p.length-1][1]*h);
    ctx.stroke();
  }else if(a.t==='arrow'){
    const x1=a.a[0]*w,y1=a.a[1]*h,x2=a.b[0]*w,y2=a.b[1]*h,ang=Math.atan2(y2-y1,x2-x1),hl=Math.max(lw*4.5,w*.02);
    ctx.lineWidth=lw;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();
    ctx.beginPath();ctx.moveTo(x2,y2);ctx.lineTo(x2-hl*Math.cos(ang-.45),y2-hl*Math.sin(ang-.45));ctx.moveTo(x2,y2);ctx.lineTo(x2-hl*Math.cos(ang+.45),y2-hl*Math.sin(ang+.45));ctx.stroke();
  }else if(a.t==='box'){
    ctx.lineWidth=lw;const x=Math.min(a.a[0],a.b[0])*w,y=Math.min(a.a[1],a.b[1])*h,bw=Math.abs(a.a[0]-a.b[0])*w,bh=Math.abs(a.a[1]-a.b[1])*h;
    ctx.beginPath();if(ctx.roundRect)ctx.roundRect(x,y,bw,bh,Math.min(bw,bh)*.08);else ctx.rect(x,y,bw,bh);ctx.stroke();
  }else if(a.t==='redact'){
    const x=Math.min(a.a[0],a.b[0])*w,y=Math.min(a.a[1],a.b[1])*h,bw=Math.abs(a.a[0]-a.b[0])*w,bh=Math.abs(a.a[1]-a.b[1])*h;ctx.save();ctx.globalAlpha=1;ctx.fillStyle='#000';ctx.fillRect(x,y,bw,bh);ctx.restore();
  }else if(a.t==='check'||a.t==='cross'){
    const s=a.s*w,x=a.x*w,y=a.y*h;ctx.lineWidth=Math.max(2,s*.16);ctx.beginPath();
    if(a.t==='check'){ctx.moveTo(x-s*.5,y+s*.02);ctx.lineTo(x-s*.12,y+s*.4);ctx.lineTo(x+s*.52,y-s*.4);}
    else{ctx.moveTo(x-s*.4,y-s*.4);ctx.lineTo(x+s*.4,y+s*.4);ctx.moveTo(x+s*.4,y-s*.4);ctx.lineTo(x-s*.4,y+s*.4);}
    ctx.stroke();
  }else if(a.t==='text'||a.t==='note'){
    const L=layoutText(ctx,w,a),q=tpos(L,w,h,a),x=q[0],y=q[1];ctx.textBaseline='top';
    if(a.t==='note'){
      ctx.shadowColor='rgba(0,0,0,.28)';ctx.shadowBlur=w*.012;ctx.shadowOffsetY=w*.004;ctx.fillStyle='#FFE46B';
      ctx.beginPath();if(ctx.roundRect)ctx.roundRect(x,y,L.bw,L.bh,L.fs*.35);else ctx.rect(x,y,L.bw,L.bh);ctx.fill();ctx.shadowColor='transparent';ctx.fillStyle='#2A2200';
    }else if(a.sk){ctx.lineWidth=L.fs*.18;ctx.strokeStyle=a.sk;}
    L.lines.forEach((ln,i)=>{const rtl=isRtl(ln);ctx.direction=rtl?'rtl':'ltr';ctx.textAlign=rtl?'right':'left';
      const tx=rtl?x+L.bw-L.pad:x+L.pad,ty=y+L.pad+i*L.lh;if(a.t==='text'&&a.sk)ctx.strokeText(ln,tx,ty);ctx.fillText(ln,tx,ty);});
  }
  ctx.restore();
}
const drawAnn=(ctx,w,h,list)=>{for(const a of list)drawOne(ctx,w,h,a);};
function segDist(px,py,x1,y1,x2,y2){const dx=x2-x1,dy=y2-y1,l=dx*dx+dy*dy;let tt=l?((px-x1)*dx+(py-y1)*dy)/l:0;tt=clamp(tt,0,1);return Math.hypot(px-(x1+tt*dx),py-(y1+tt*dy));}
function hitTest(a,px,py,w,h,tol){if(a.t==='fill'||a.t==='sig'||a.t==='txtr')return false;
  if(a.t==='pen'||a.t==='hl'){const r=tol+a.w*w/2,p=a.p;if(p.length===1)return Math.hypot(px-p[0][0]*w,py-p[0][1]*h)<=r;
    for(let i=1;i<p.length;i++)if(segDist(px,py,p[i-1][0]*w,p[i-1][1]*h,p[i][0]*w,p[i][1]*h)<=r)return true;return false;}
  if(a.t==='arrow')return segDist(px,py,a.a[0]*w,a.a[1]*h,a.b[0]*w,a.b[1]*h)<=tol+a.w*w;
  if(a.t==='box'){const x1=Math.min(a.a[0],a.b[0])*w,x2=Math.max(a.a[0],a.b[0])*w,y1=Math.min(a.a[1],a.b[1])*h,y2=Math.max(a.a[1],a.b[1])*h,e=tol+a.w*w;
    const inX=px>=x1-e&&px<=x2+e,inY=py>=y1-e&&py<=y2+e;return inX&&inY&&(Math.abs(px-x1)<=e||Math.abs(px-x2)<=e||Math.abs(py-y1)<=e||Math.abs(py-y2)<=e);}
  if(a.t==='redact'){const x1=Math.min(a.a[0],a.b[0])*w-tol,x2=Math.max(a.a[0],a.b[0])*w+tol,y1=Math.min(a.a[1],a.b[1])*h-tol,y2=Math.max(a.a[1],a.b[1])*h+tol;return px>=x1&&px<=x2&&py>=y1&&py<=y2;}
  if(a.t==='check'||a.t==='cross'){const s=a.s*w/2+tol;return Math.abs(px-a.x*w)<=s&&Math.abs(py-a.y*h)<=s;}
  const L=layoutText(mctx,w,a),q=tpos(L,w,h,a),x=q[0],y=q[1];return px>=x-tol&&px<=x+L.bw+tol&&py>=y-tol&&py<=y+L.bh+tol;
}

/* ---------- views ---------- */
const V={cur:'vHome'};
function show(id){if(id!=='vEdit'){try{closeEditDocks();}catch(_){}}V.cur=id;$$('.view').forEach(v=>v.classList.toggle('on',v.id===id));}
let toastT=0;
function toast(msg){const el=$('#toast');el.textContent=msg;el.classList.add('on');clearTimeout(toastT);toastT=setTimeout(()=>el.classList.remove('on'),2200);}
const busy=on=>$('#busy').classList.toggle('on',on);

/* ---------- home ---------- */
function applyLang(){
  document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';
  $$('[data-t]').forEach(el=>el.textContent=t(el.dataset.t));
  $$('[data-tp]').forEach(el=>el.placeholder=t(el.dataset.tp));
  $$('[data-ta]').forEach(el=>el.setAttribute('aria-label',t(el.dataset.ta)));
  $('#langBtn').textContent=lang==='ar'?'EN':'ع';
  $('#newBtn').textContent=t('newDoc');
  buildTools();buildFilters();renderHome();updateEditTitle();resetDel();
  if(!$('#docName').value) $('#docName').value=state.name||'';
}
function renderHome(fresh){
  const sh=$('#shelf'),n=state.pages.length,AR0=(typeof lang==='undefined'||lang==='ar');
  $('#count').textContent=n?t('pages',n):'';updLib();
  try{ordBtnSync(n)}catch(e){}
  $('#exportBtn').disabled=!n;$('#newBtn').style.visibility=n?'visible':'hidden';
  if(!n){
    sh.innerHTML=`<div class="empty"><div class="demo"><span class="corner a"></span><span class="corner b"></span><span class="corner c"></span><span class="corner d"></span><div class="sheet-d"><div class="beam"></div></div></div><h1>${t('emptyT')}</h1><p>${t('emptyP')}</p><div class="emact"><button class="btn pri" id="emCam" type="button"><i class="emi"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"/><circle cx="12" cy="13" r="3"/></svg></i><span>${AR0?'صوّر أول مستند':'Scan your first document'}</span></button><button class="btn" id="emGal" type="button"><i class="emi g"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/></svg></i><span>${AR0?'من المعرض أو PDF':'Gallery or PDF'}</span></button></div><ul class="emtips"><li><i class="tipi"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L4 14h7l-1 8 9-12h-7z" fill="currentColor"/></svg></i><span>${AR0?'صوّر الورقة على سطح غامق وإضاءة كويسة عشان القص التلقائي يظبط.':'Shoot the page on a dark surface in good light for cleaner auto-crop.'}</span></li><li><i class="tipi"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2"/><rect x="8" y="8" width="8" height="8" rx="1.5"/></svg></i><span>${AR0?'تقدر تضيف صفحات تانية لنفس المستند وتصدّره PDF واحد.':'Add more pages to the same document and export one PDF.'}</span></li><li><i class="tipi"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" fill="currentColor"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" fill="currentColor"/></svg></i><span>${AR0?'كل حاجة بتتحفظ على جهازك بس، فاعمل نسخة احتياطية من «مستنداتي» من وقت للتاني.':'Everything stays on your device only, so back up from My documents once in a while.'}</span></li></ul><button class="btn" id="sampleBtn"><i class="crn"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h4"/></svg></i><span>${t('sample')}</span></button></div>`;
    $('#sampleBtn').onclick=startSample;$('#emCam').onclick=()=>$('#camIn').click();$('#emGal').onclick=()=>$('#galIn').click();return;
  }
  sh.innerHTML='<div class="grid"></div>';const g=$('.grid',sh);
  try{if(n>1&&!localStorage.getItem('tx_hint_drag')){const h=document.createElement('div');h.className='txhint';h.innerHTML='<span>'+(AR0?'💡 اضغط مطوّلًا على أي صفحة واسحبها لتغيير ترتيبها. وبالضغط المطوّل على زرار الكاميرا تلاقي صفحة A4 فاضية.':'💡 Long-press a page and drag to reorder. Long-press the camera button for a blank A4 page.')+'</span><button type="button" aria-label="OK">✕</button>';h.querySelector('button').onclick=()=>{try{localStorage.setItem('tx_hint_drag','1')}catch(_){}h.remove()};sh.insertBefore(h,g)}}catch(_){}
  state.pages.forEach((p,i)=>{const b=document.createElement('div');b.className='pg'+(p.id===fresh?' fresh':'');b.tabIndex=0;b.setAttribute('role','button');
    b.innerHTML=`<img alt="" src="${p.thumb}"><span class="num">${i+1}</span><button class="pgdel" type="button" aria-label="${t('del')}"><svg class="i"><use href="#i-trash"/></svg></button>`;
    b.onclick=()=>openEdit(p,false);b.onkeydown=e=>{if(e.target===b&&e.key==='Enter')openEdit(p,false);};
    const dl=$('.pgdel',b);let arm=0,tm=0;
    dl.onclick=e=>{e.stopPropagation();
      if(!arm){arm=1;dl.classList.add('arm');dl.innerHTML=`<svg class="i"><use href="#i-trash"/></svg><span>${t('delSure')}</span>`;tm=setTimeout(()=>{arm=0;dl.classList.remove('arm');dl.innerHTML='<svg class="i"><use href="#i-trash"/></svg>';},2600);return;}
      clearTimeout(tm);deletePage(p);};
    g.appendChild(b);});
  const ad=document.createElement('button');ad.className='add';ad.innerHTML='<svg class="i" style="width:30px;height:30px"><use href="#i-plus"/></svg>';ad.setAttribute('aria-label',t('scan'));ad.onclick=()=>$('#camIn').click();g.appendChild(ad);
  [...g.children].forEach((e,i)=>e.style.setProperty('--i',Math.min(i,14)));if(stagNext){g.classList.add('stag');stagNext=false;}
  updLib();
}
function goHome(fresh){
  window.__txCamBack=0;releaseSrc();show('vHome');renderHome(fresh);
}
let undoT=0;
async function deletePage(p){
  const i=state.pages.indexOf(p);if(i<0)return;
  state.pages.splice(i,1);await unpersist(p.id);await persistMeta();renderHome();
  let bar=$('#undoBar');if(!bar){bar=document.createElement('div');bar.id='undoBar';$('#app').appendChild(bar);}
  bar.innerHTML='<span></span><button type="button"></button>';
  $('span',bar).textContent=lang==='ar'?'اتحذفت الصفحة':'Page deleted';
  const bt=$('button',bar);bt.textContent=lang==='ar'?'تراجع':'Undo';
  bt.onclick=async()=>{clearTimeout(undoT);bar.classList.remove('on');state.pages.splice(Math.min(i,state.pages.length),0,p);await persist(p);await persistMeta();renderHome(p.id);};
  bar.classList.add('on');clearTimeout(undoT);undoT=setTimeout(()=>bar.classList.remove('on'),10000);
}
function releaseSrc(){for(const p of state.pages){if(p!==E.page&&p!==C.page)p.src=null;}}
async function getSrc(p){if(!p.src)p.src=await decodeBlob(p.blob);return p.src;}
async function makeThumb(p){const src=await getSrc(p),w=warpRot(src,p,360),b=makeBase(w),tc=toneCanvas(b,p.filter,p.br,p.ct,p.sat);applyFills(tc.getContext('2d'),tc.width,tc.height,p.ann,p);drawAnn(tc.getContext('2d'),tc.width,tc.height,p.ann);return tc.toDataURL('image/jpeg',.82);}

/* ---------- capture / import ---------- */
/* full edge analysis off the UI thread (imports, captured photos, auto button); falls back to the main thread */
let _dw=null,_did=0;
function detWorker(){if(_dw!==null)return _dw||null;
  try{if(!(window.Worker&&window.OffscreenCanvas&&window.createImageBitmap)){_dw=false;return null;}
   const code='const clamp='+clamp.toString()+';const mk=(w,h)=>new OffscreenCanvas(w,h);'+boxBlur.toString()+';'+maxFilter.toString()+';'+asp.toString()+';const GRAYC=new WeakMap();'+grayOf.toString()+';'+bilG.toString()+';'+lineInter2.toString()+';'+refineQuad.toString()+';'+detectCorners.toString()
    +';onmessage=e=>{const b=e.data.bm,r={id:e.data.id};try{r.q=detectCorners(b);r.alts=detectCorners.alts;r.found=detectCorners.found;r.best=detectCorners.best;}catch(x){r.err=String(x);}try{b.close()}catch(x){}postMessage(r);};';
   const u=URL.createObjectURL(new Blob([code],{type:'text/javascript'}));_dw=new Worker(u);setTimeout(()=>URL.revokeObjectURL(u),3000);
   _dw.onerror=()=>{try{_dw.terminate()}catch(x){}_dw=false;};return _dw;}catch(e){_dw=false;return null;}}
/* ---- كشف هجين تجريبي (tx_edge2=1): نموذج ONNX + الخوارزمية الحالية، مرتّبين بدرجة ثقة. أي خطأ = نرجع للمسار القديم ---- */
const EDGE2_REVIEW=.8,reviewThr=()=>(window.EdgeLearn&&EdgeLearn.enabled()&&EdgeLearn.params().thr)||EDGE2_REVIEW; // تحت الثقة دي بنقول للمستخدم يراجع الحواف (اتقاس على 18 صورة: كل الفاشلين تحتها وصورة ناجحة واحدة بس)
let _e2=null;
const loadEdge2=()=>_e2||(_e2=Promise.all(['edge-model.js','edge-hybrid.js','edge-learn.js'].map(f=>new Promise((ok,no)=>{const e=document.createElement('script');e.src=f;e.onload=ok;e.onerror=()=>no(new Error(f));document.head.appendChild(e);}))).catch(e=>{_e2=null;throw e;}));
/* نموذج الوجه (3.4ب): تحميل كسول مرة واحدة بعد loadEdge2؛ لو فشل (الملف أو المحرك ناقص) المقدّر المؤقت يكمّل من غير أي رسالة */
let _fc=null;const loadFace=()=>_fc||(_fc=loadEdge2().then(()=>new Promise((ok,no)=>{if(window.TXAFace)return ok();const e=document.createElement('script');e.src='assistant-face.js';e.onload=ok;e.onerror=()=>no(new Error('assistant-face.js'));document.head.appendChild(e);})).then(()=>window.TXAFace.install()).catch(()=>false));
async function edge2Wrap(canvas,q0){
  if(localStorage.getItem('tx_edge2')==='0'){detectCorners.edge2=null;return q0;}
  detectCorners.edge2=null;
  try{
    await loadEdge2();
    const f=detectCorners,cands=[];
    if(q0)cands.push({quad:q0,src:'current',conf:f.found?Math.min(1,f.best||0):0});
    (f.alts||[]).slice(1,3).forEach(a=>cands.push({quad:a,src:'current-alt',conf:Math.min(1,(f.best||0)*.6)}));
    if(await EdgeModel.available()){const m=await EdgeModel.detect(canvas);if(m.quad)cands.push({quad:m.quad,src:'model',conf:m.score});}
    const r=EdgeHybrid.rank(cands,EdgeHybrid.prepare(canvas),canvas.width/canvas.height);
    if(!r.length)return q0;
    f.alts=r.map(x=>x.quad);f.best=r[0].score;f.edge2=r[0].src;f.e2tok=window.EdgeLearn?EdgeLearn.record(r):null;     // مميزات المرشحين (محلي) لحد ما تأكّد القص
    if(r[0].src==='model'&&r[0].score>.35)f.found=true;     // لو النموذج لقى حاجة والحالية ماتلقتش
    return r[0].quad;
  }catch(e){console.warn('edge2 fallback',e);return q0;}
}
/* مساعد الاقتراحات: اتنقل من الهيدر لقايمة «الإعدادات». هنا بس واجهة برمجية صغيرة للقايمة (شغّال افتراضيًا) */
window.__txAsg={on:()=>{try{return !!(window.TXA&&TXA.enabled())}catch(e){return true}},set:v=>{try{window.TXA&&TXA.setEnabled(!!v)}catch(e){}},reset:()=>{try{window.TXA&&TXA.resetLog()}catch(e){}}};
/* ===== AI (الكشف الذكي + التعلّم من تعديلاتك): شغّال افتراضيًا، مفتاح واحد (tx_edge2: '0' = متوقف). موجود جوه الكاميرا وجوه «المزيد» ===== */
const TXAI=(function(){
  const K='tx_edge2',subs=[];
  const on=()=>{try{return localStorage.getItem(K)!=='0'}catch(e){return true}};
  const cnt=()=>{try{return window.EdgeLearn?EdgeLearn.stats().n:0}catch(e){return 0}};
  const apply=v=>{try{if(window.EdgeLearn)EdgeLearn.setEnabled(v)}catch(e){}};
  const msg=v=>v?(lang==='ar'?'AI شغّال — كشف ذكي وتعلّم من تعديلاتك'+(cnt()?' ('+cnt()+' تعديل)':''):'AI is ON — smart detection & learning'+(cnt()?' ('+cnt()+' edits)':'')):(lang==='ar'?'AI متوقف — رجع الكشف العادي':'AI is OFF — standard detection');
  function set(v){try{localStorage.setItem(K,v?'1':'0')}catch(e){}if(v)loadEdge2().then(()=>apply(true)).catch(()=>{});else apply(false);subs.slice().forEach(f=>{try{f(v)}catch(e){}});}
  function css(){if(document.getElementById('txai-css'))return;const st=document.createElement('style');st.id='txai-css';
    st.textContent='#lv .ib.ai{position:relative;transition:transform .15s,color .25s,background .3s,box-shadow .3s}#lv .ib.ai svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linejoin:round;transition:opacity .25s}'
    +'#lv .ib.ai:not(.on) svg{opacity:.5}#lv .ib.ai:not(.on)::after{content:"";position:absolute;width:24px;height:2px;border-radius:1px;background:currentColor;opacity:.75;transform:rotate(-45deg)}'
    +'#lv.v3 .ib.ai.on{background:rgba(34,211,245,.2);color:#22d3f5;animation:txaiglow 2.8s ease-in-out infinite}#lv .ib.ai.on .s2{transform-box:fill-box;transform-origin:center;animation:txaitw 2.8s ease-in-out infinite}'
    +'#lv .ib.ai.pop,#lv.v3 .ib.ai.on.pop{animation:txaipop .38s cubic-bezier(.3,1.6,.5,1)}.cd.aipop .ic{animation:txaipop .38s cubic-bezier(.3,1.6,.5,1)}'
    +'#lv .aitip{position:absolute;right:10px;top:calc(env(safe-area-inset-top,0px) + 56px);z-index:7;max-width:80%;padding:7px 14px;border-radius:999px;background:rgba(6,10,22,.78);color:#bdf3ff;border:1px solid rgba(34,211,245,.45);font:600 13px system-ui;opacity:0;transform:translateY(-4px);pointer-events:none;transition:opacity .2s,transform .2s;direction:rtl}#lv .aitip.off{color:#cfd6e6;border-color:rgba(255,255,255,.25)}#lv .aitip.on{opacity:1;transform:none}'
    +'@keyframes txaiglow{0%,100%{box-shadow:0 0 0 0 rgba(34,211,245,0)}50%{box-shadow:0 0 0 5px rgba(34,211,245,.16),0 0 14px rgba(34,211,245,.35)}}@keyframes txaitw{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.3;transform:scale(.7)}}@keyframes txaipop{0%{transform:scale(.8)}60%{transform:scale(1.2)}100%{transform:scale(1)}}'
    +'@media (prefers-reduced-motion:reduce){#lv.v3 .ib.ai.on,#lv .ib.ai.on .s2,#lv .ib.ai.pop,.cd.aipop .ic{animation:none}#lv .aitip{transition:none}}';document.head.appendChild(st);}
  const SPARK='<svg viewBox="0 0 24 24"><path d="M11 3l1.9 5.6 5.6 1.9-5.6 1.9L11 18l-1.9-5.6L3.5 10.5l5.6-1.9z"/><path class="s2" d="M19 14.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9z"/></svg>';
  function camBtn(m){css();const b=document.createElement('button');b.type='button';b.className='ib ai'+(on()?' on':'');b.setAttribute('aria-label','AI');b.setAttribute('aria-pressed',on()?'true':'false');b.title='AI';b.innerHTML=SPARK;
    const tip=document.createElement('div');tip.className='aitip';tip.setAttribute('role','status');m.appendChild(tip);let tm=0;
    const paint=v=>{if(!b.isConnected){const i=subs.indexOf(paint);if(i>=0)subs.splice(i,1);return;}b.classList.toggle('on',v);b.setAttribute('aria-pressed',v?'true':'false');};subs.push(paint);
    b.addEventListener('animationend',()=>b.classList.remove('pop'));
    b.addEventListener('click',()=>{const v=!on();set(v);b.classList.remove('pop');void b.offsetWidth;b.classList.add('pop');
      try{if(localStorage.getItem('tx_hap')!=='0'&&navigator.vibrate)navigator.vibrate(8)}catch(e){}
      tip.textContent=msg(v);tip.classList.toggle('off',!v);tip.classList.add('on');clearTimeout(tm);tm=setTimeout(()=>tip.classList.remove('on'),1800);});
    return b;}
  return{on,set,msg,camBtn,css,cnt};
})();
async function detectAsync(canvas){return edge2Wrap(canvas,await detectAsync0(canvas));}
async function detectAsync0(canvas){
  const sync=async()=>{await new Promise(r=>setTimeout(r,20));try{return detectCorners(canvas);}catch(e){return null;}};
  const w=detWorker();if(!w)return sync();
  try{const bm=await createImageBitmap(canvas),id=++_did;
   const r=await new Promise((ok,no)=>{const tm=setTimeout(()=>{w.removeEventListener('message',on);no(new Error('timeout'));},12000);
     const on=e=>{if(e.data.id!==id)return;clearTimeout(tm);w.removeEventListener('message',on);ok(e.data);};w.addEventListener('message',on);w.postMessage({bm,id},[bm]);});
   if(r.err||!r.alts)return sync();
   detectCorners.alts=r.alts;detectCorners.src=canvas;detectCorners.full=false;detectCorners.found=r.found;detectCorners.best=r.best;return r.q;
  }catch(e){try{if(_dw){_dw.terminate();}}catch(x){}_dw=null;return sync();}}
(window.__edges=window.__edges||{}).detectAsync=detectAsync;
/* v154: بطاقة — تحديد الحواف الحقيقية للبطاقة جوه الإطار + ضبط الميل (المنظور) قبل التعديل. لو الكشف مش منطقي بنرجع لحواف الإطار بعد تدقيقها */
async function txCardQuad(cv,gq){
  const W=cv.width,H=cv.height,pt=a=>a.map(p=>({x:p.x,y:p.y}));
  const dist=(a,b)=>Math.hypot((a.x-b.x)*W,(a.y-b.y)*H);
  const area=q=>{let s=0;for(let i=0;i<4;i++){const a=q[i],b=q[(i+1)%4];s+=(a.x*W)*(b.y*H)-(b.x*W)*(a.y*H);}return Math.abs(s)/2;};
  const ok=q=>{if(!q||q.length!==4)return false;const gA=area(gq),A=area(q);if(!(A>gA*.45&&A<gA*1.5))return false;
    const w=(dist(q[0],q[1])+dist(q[3],q[2]))/2,h=(dist(q[0],q[3])+dist(q[1],q[2]))/2,r=Math.max(w,h)/Math.max(1,Math.min(w,h));if(!(r>1.3&&r<1.95))return false;
    const m=Math.max.apply(null,q.map((p,i)=>Math.hypot((p.x-gq[i].x)*W,(p.y-gq[i].y)*H)));return m<Math.max(W,H)*.2;};
  try{await new Promise(r=>setTimeout(r,0));
    const d=await detectAsync(cv);
    if(d&&detectCorners.found&&ok(d)){try{const r2=refineQuad(cv,pt(d),{R:.015,passes:3});if(ok(r2))return r2;}catch(e){}return d;}
  }catch(e){}
  try{const r=refineQuad(cv,pt(gq),{R:.035,passes:3});if(ok(r))return r;}catch(e){}
  setTimeout(()=>{try{toast(lang==='ar'?'راجع حواف البطاقة':'Check the card edges')}catch(e){}},900);
  return gq;
}
async function ingest(file){
  busy(true);
  try{
    const canvas=(file&&file.__cv)||await decodeBlob((file&&file.__blob)||file),bp=(file&&file.__blob)?Promise.resolve(file.__blob):toBlob(canvas,'image/jpeg',.9);
    let lq=(file&&file.__q)||null,cr0;
    if(lq&&file.__x&&file.__id){cr0=await txCardQuad(canvas,lq.map(x=>({x:x.x,y:x.y})));}
    else if(lq&&file.__x)cr0=lq.map(x=>({x:x.x,y:x.y}));
    else if(lq){try{cr0=refineQuad(canvas,lq.map(x=>({x:x.x,y:x.y})),{R:.02,passes:3});}catch(e){cr0=lq;}
     /* full analysis of the captured frame: results feed the auto button; if it agrees with the live quad, use its sharper fit */
     try{const d0=await detectAsync(canvas),al=detectCorners.alts;if(d0&&detectCorners.found){const dd=Math.max(...d0.map((p,i)=>Math.hypot(p.x-cr0[i].x,p.y-cr0[i].y)));
      if(dd<.03)cr0=d0;
      else if(detectCorners.edge2&&detectCorners.edge2!=='current'&&detectCorners.best>=reviewThr()){const live=cr0.map(p=>({x:p.x,y:p.y}));cr0=d0;al.push(live);detectCorners.alts=al.slice(0,5);}
      else{al.splice(0,0,cr0.map(p=>({x:p.x,y:p.y})));detectCorners.alts=al.slice(0,4).concat(al.slice(-1));}}}catch(e){}}
    else{cr0=(await detectAsync(canvas))||[{x:.05,y:.05},{x:.95,y:.05},{x:.95,y:.95},{x:.05,y:.95}];}
    window.__lastDet={src:canvas};
    const blob=await bp,p={id:newId(),blob,src:canvas,corners:cr0,rot:0,filter:'auto',br:0,ct:0,sat:0,ann:[],hist:[],fut:[],thumb:'',ap:1};
    state.draft=p;busy(false);
    if(window.EdgeLearn&&detectCorners.e2tok){EdgeLearn.bind(p,detectCorners.e2tok);detectCorners.e2tok=null;}
    if(detectCorners.edge2&&detectCorners.best<reviewThr())setTimeout(()=>toast(lang==='ar'?'راجع الحواف — الثقة منخفضة':'Check the edges — low confidence'),900);
    await openCrop(p,'new');
  }catch(e){busy(false);toast(t('openFail'));console.error(e);}
}
function nextQueued(){const f=state.queue.shift();if(f){ingest(f);return true;}return false;}
$('#camIn').addEventListener('change',e=>{const fs=[...e.target.files];e.target.value='';if(fs.length)ingest(fs[0]);});
const isPdf=f=>f&&(f.type==='application/pdf'||/\.pdf$/i.test(f.name||''));
async function importPdf(file){
  busy(true);let made=0,first=null;
  try{
    const lib=await import('./pdf.min.mjs');lib.GlobalWorkerOptions.workerSrc=new URL('./pdf.worker.min.mjs',location.href).href;
    const doc=await lib.getDocument({data:await file.arrayBuffer(),wasmUrl:new URL('./',location.href).href}).promise;
    const MAXP=60,n=Math.min(doc.numPages,MAXP);let cv=null,chain=Promise.resolve();
    if(window.__txNew){window.__txNew=false;if(state.pages.length)await startNew();}
    for(let i=1;i<=n;i++){
      toast(lang==='ar'?('بحوّل صفحة '+i+' من '+n+'…'):('Converting page '+i+' of '+n+'…'));await sleep(16);
      const pg=await doc.getPage(i),v0=pg.getViewport({scale:1}),sc=Math.min(4,2200/Math.max(v0.width,v0.height)),vp=pg.getViewport({scale:sc});
      if(!cv)cv=document.createElement('canvas');cv.width=Math.ceil(vp.width);cv.height=Math.ceil(vp.height);const cx=cv.getContext('2d');cx.fillStyle='#fff';cx.fillRect(0,0,cv.width,cv.height);
      await pg.render({canvasContext:cx,viewport:vp,canvas:cv}).promise;pg.cleanup();
      /* v117: toBlob بياخد لقطة من الكانفس فورًا، فنقدر نرسم الصفحة اللي بعدها على نفس الكانفس والترميز والحفظ يكملوا في الخلفية بالترتيب */
      const bp=toBlob(cv,'image/jpeg',.9),k=360/Math.max(cv.width,cv.height),tc=mk(Math.round(cv.width*k),Math.round(cv.height*k)),tx=tc.getContext('2d');tx.imageSmoothingQuality='high';tx.drawImage(cv,0,0,tc.width,tc.height);
      const p={id:newId(),blob:null,src:null,corners:[{x:0,y:0},{x:1,y:0},{x:1,y:1},{x:0,y:1}],rot:0,filter:'original',br:0,ct:0,sat:0,ann:[],hist:[],fut:[],thumb:tc.toDataURL('image/jpeg',.82)};
      chain=chain.then(async()=>{p.blob=await bp;state.pages.push(p);await persist(p);made++;if(!first)first=p;});
      if(i%4===0)await chain;
    }
    await chain;
    if(cv)cv.width=cv.height=1;await persistMeta();try{doc.destroy();}catch(_){}
    if(doc.numPages>MAXP)toast(lang==='ar'?('اتحوّل أول '+MAXP+' صفحة بس'):('Only the first '+MAXP+' pages were imported'));
    else toast(lang==='ar'?('اتضاف '+made+' صفحة من الـPDF'):(made+' page(s) imported from PDF'));
  }catch(e){console.error(e);toast(lang==='ar'?'تعذّر فتح ملف الـPDF (ممكن يكون محمي بكلمة سر أو تالف)':'Could not open the PDF (it may be password-protected or damaged)');}
  busy(false);
  if(first){goHome();renderHome(first.id);}
}
window.__txImportPdf=importPdf;
$('#galIn').addEventListener('change',async e=>{const fs=[...e.target.files];e.target.value='';if(!fs.length)return;
  const pdfs=fs.filter(isPdf),imgs=fs.filter(f=>!isPdf(f));
  for(const f of pdfs)await importPdf(f);
  if(imgs.length){window.__txCamBack=0;state.queue=imgs.slice(1);ingest(imgs[0]);}});
$('#scanBtn').onclick=()=>$('#camIn').click();
$('#galBtn').onclick=()=>$('#galIn').click();

async function startSample(){
  busy(true);await sleep(16);
  const W=1600,H=1200,c=mk(W,H),x=c.getContext('2d');
  let g=x.createLinearGradient(0,0,W,H);g.addColorStop(0,'#4a4640');g.addColorStop(1,'#26231f');x.fillStyle=g;x.fillRect(0,0,W,H);
  x.globalAlpha=.07;for(let i=0;i<90;i++){x.fillStyle=i%2?'#fff':'#000';x.fillRect(0,(i*97)%H,W,1+(i%4));}x.globalAlpha=1;
  x.save();x.translate(W*.5,H*.52);x.transform(1,-.07,.12,1,0,0);x.rotate(-.1);
  const pw=700,ph=960;x.shadowColor='rgba(0,0,0,.6)';x.shadowBlur=46;x.shadowOffsetY=22;x.fillStyle='#f4f1e8';x.fillRect(-pw/2,-ph/2,pw,ph);x.shadowColor='transparent';
  x.translate(-pw/2,-ph/2);x.fillStyle='#1b2434';x.font='700 44px Inter, sans-serif';x.fillText('Invoice  #2048',48,92);
  x.font='500 20px Inter, sans-serif';x.fillStyle='#4a5568';x.fillText('Sample page · Timaxo scan',48,128);
  x.fillStyle='#1b2434';x.font='600 22px Inter, sans-serif';
  const rows=[['Studio rental, 2 days','240.00'],['Camera operator','180.00'],['Tripod and light kit','65.00'],['Voice-over recording','90.00'],['Color grading','120.00'],['Printed notes','18.50']];
  x.fillRect(48,170,pw-96,3);rows.forEach((r,i)=>{const y=222+i*58;x.font='500 22px Inter, sans-serif';x.fillText(r[0],48,y);x.textAlign='right';x.fillText(r[1],pw-48,y);x.textAlign='left';x.fillStyle='#c9ccd2';x.fillRect(48,y+18,pw-96,1.5);x.fillStyle='#1b2434';});
  x.font='700 28px Inter, sans-serif';x.fillText('Total',48,622);x.textAlign='right';x.fillText('713.50',pw-48,622);x.textAlign='left';
  x.font='400 18px Inter, sans-serif';x.fillStyle='#4a5568';
  ['Payment is due within 14 days of the invoice date.','Thank you for your business. Questions about this','invoice can be sent to the address printed above.'].forEach((s,i)=>x.fillText(s,48,700+i*30));
  x.save();x.translate(pw-170,820);x.rotate(-.2);x.strokeStyle='#b53b2e';x.lineWidth=5;x.strokeRect(-90,-34,180,68);x.fillStyle='#b53b2e';x.font='700 40px Inter, sans-serif';x.textAlign='center';x.fillText('PAID',0,14);x.restore();
  const sh=x.createLinearGradient(0,0,pw,ph);sh.addColorStop(0,'rgba(0,0,0,.34)');sh.addColorStop(.55,'rgba(0,0,0,.04)');sh.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=sh;x.fillRect(0,0,pw,ph);
  x.restore();
  await ingest({__cv:c}); /* v115: نمرّر الكانفس مباشرة بدل ترميز JPEG وفك ترميزه تاني */
}

/* ---------- crop ---------- */
const NS='http://www.w3.org/2000/svg';
(function buildHandles(){const g=$('#handles');
  for(let e=0;e<4;e++){const gg=document.createElementNS(NS,'g');gg.dataset.e=e;
    const r=document.createElementNS(NS,'rect');r.setAttribute('x',-12);r.setAttribute('y',-4.5);r.setAttribute('width',24);r.setAttribute('height',9);r.setAttribute('rx',4.5);r.setAttribute('class','edot');
    const h=document.createElementNS(NS,'circle');h.setAttribute('r',20);h.setAttribute('class','hit');gg.append(r,h);g.append(gg);}
  for(let i=0;i<4;i++){const gg=document.createElementNS(NS,'g');gg.dataset.i=i;
  const d=document.createElementNS(NS,'circle');d.setAttribute('r',10);d.setAttribute('class','dot');
  const h=document.createElementNS(NS,'circle');h.setAttribute('r',30);h.setAttribute('class','hit');gg.append(d,h);g.append(gg);}})();
async function openCrop(p,from){
  C.page=p;C.from=from;C.src=await getSrc(p);C.drag=-1;C.edge=-1;C.sel=0;
  $('#cropSvg').classList.remove('in');$('#cropHint').style.opacity=0;
  show('vCrop');await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));layoutCrop();
  if(from==='new'){
    const target=p.corners.map(q=>({...q}));p.corners=[{x:.06,y:.06},{x:.94,y:.06},{x:.94,y:.94},{x:.06,y:.94}];drawQuad();
    const b=$('#beam');b.classList.remove('run');void b.offsetWidth;b.classList.add('run');
    await sleep(120);$('#cropSvg').classList.add('in');await tween(p.corners,target,200);
  }else{$('#cropSvg').classList.add('in');}
  $('#cropHint').style.opacity=1;
}
function layoutCrop(){
  if(!C.src)return;const st=$('#cropStage'),pad=26,sw=st.clientWidth,sh=st.clientHeight;
  const k=Math.min((sw-pad*2)/C.src.width,(sh-pad*2)/C.src.height),w=Math.max(40,Math.round(C.src.width*k)),h=Math.max(40,Math.round(C.src.height*k));
  const box=$('#cropBox');box.style.width=w+'px';box.style.height=h+'px';
  const cv=$('#cropCv'),dpr=Math.min(2,window.devicePixelRatio||1);cv.width=Math.round(w*dpr);cv.height=Math.round(h*dpr);cv.getContext('2d').drawImage(C.src,0,0,cv.width,cv.height);
  C.w=w;C.h=h;$('#cropSvg').setAttribute('viewBox',`0 0 ${w} ${h}`);drawQuad();
}
function drawQuad(){
  const p=C.page;if(!p||!C.w)return;const pts=p.corners.map(q=>[q.x*C.w,q.y*C.h]);
  $('#quad').setAttribute('points',pts.map(q=>q.join(',')).join(' '));
  $('#mask').setAttribute('d',`M0 0H${C.w}V${C.h}H0Z M${pts.map(q=>q.join(' ')).join(' L')} Z`);
  $$('#handles g[data-i]').forEach((g,i)=>{$$('circle',g).forEach(c=>{c.setAttribute('cx',pts[i][0]);c.setAttribute('cy',pts[i][1]);});g.classList.toggle('sel',i===C.sel);});
  $$('#handles g[data-e]').forEach(g=>{const i=+g.dataset.e,a=pts[i],b=pts[(i+1)%4],ang=Math.atan2(b[1]-a[1],b[0]-a[0])*180/Math.PI;
    g.setAttribute('transform',`translate(${(a[0]+b[0])/2} ${(a[1]+b[1])/2}) rotate(${ang})`);});
}
function tween(arr,to,ms){return new Promise(res=>{const from=arr.map(q=>({...q})),t0=performance.now();
  const step=now=>{const k=clamp((now-t0)/ms,0,1),e=1-Math.pow(1-k,3);arr.forEach((q,i)=>{q.x=from[i].x+(to[i].x-from[i].x)*e;q.y=from[i].y+(to[i].y-from[i].y)*e;});drawQuad();k<1?requestAnimationFrame(step):res();};
  requestAnimationFrame(step);});}
function loupe(pt){
  const lp=$('#loupe'),cv=$('#loupeCv'),x=cv.getContext('2d'),S=C.src,reg=Math.max(30,Math.min(S.width,S.height)*.07),ox=pt.x*S.width-reg/2,oy=pt.y*S.height-reg/2,k=208/reg;
  x.clearRect(0,0,208,208);x.drawImage(S,ox,oy,reg,reg,0,0,208,208);
  x.save();x.strokeStyle='#22D3F5';x.lineWidth=1.6;x.beginPath();
  C.page.corners.forEach((q,i)=>{const X=(q.x*S.width-ox)*k,Y=(q.y*S.height-oy)*k;i?x.lineTo(X,Y):x.moveTo(X,Y);});x.closePath();x.stroke();x.restore();
  lp.style.left=pt.x<.5?'auto':'12px';lp.style.right=pt.x<.5?'12px':'auto';lp.classList.add('on');
}
const svg=$('#cropSvg');
const svgPt=e=>{const r=svg.getBoundingClientRect();return{x:(e.clientX-r.left)/r.width,y:(e.clientY-r.top)/r.height};};
C.snap=true;C.fine=false;C.edge=-1;C.sel=0;
svg.addEventListener('pointerdown',e=>{const ge=e.target.closest('g[data-e]'),g=e.target.closest('g[data-i]');if(!g&&!ge)return;
  C.p0=svgPt(e);C.start=C.page.corners.map(q=>({...q}));
  if(g){C.drag=+g.dataset.i;C.edge=-1;C.sel=C.drag;loupe(C.page.corners[C.drag]);}
  else{C.edge=+ge.dataset.e;C.drag=-1;C.sel=C.edge;const a=C.start[C.edge],b=C.start[(C.edge+1)%4];loupe({x:(a.x+b.x)/2,y:(a.y+b.y)/2});}
  svg.setPointerCapture(e.pointerId);drawQuad();e.preventDefault();});
svg.addEventListener('pointermove',e=>{if(C.drag<0&&C.edge<0)return;
  const p=svgPt(e),gn=C.fine?.35:1,dx=(p.x-C.p0.x)*gn,dy=(p.y-C.p0.y)*gn,S=C.start,cs=C.page.corners;
  if(C.drag>=0){cs[C.drag]={x:clamp(S[C.drag].x+dx,0,1),y:clamp(S[C.drag].y+dy,0,1)};loupe(cs[C.drag]);}
  else{const i=C.edge,j=(i+1)%4,a=S[i],b=S[j],ex=(b.x-a.x)*C.w,ey=(b.y-a.y)*C.h,Ln=Math.hypot(ex,ey)||1,nx=-ey/Ln,ny=ex/Ln,pr=dx*C.w*nx+dy*C.h*ny,mx=nx*pr/C.w,my=ny*pr/C.h;
    cs[i]={x:clamp(a.x+mx,0,1),y:clamp(a.y+my,0,1)};cs[j]={x:clamp(b.x+mx,0,1),y:clamp(b.y+my,0,1)};loupe({x:(cs[i].x+cs[j].x)/2,y:(cs[i].y+cs[j].y)/2});}
  drawQuad();});
function snapRelease(){
  const only=C.drag>=0?[(C.drag+3)%4,C.drag]:[C.edge];
  try{const q=refineQuad(C.src,C.page.corners,{R:.012,passes:2,only});tween(C.page.corners,q,160);}catch(e){}
}
const endDrag=()=>{const was=C.drag>=0||C.edge>=0;if(was&&C.snap)snapRelease();C.drag=-1;C.edge=-1;$('#loupe').classList.remove('on');};
svg.addEventListener('pointerup',endDrag);svg.addEventListener('pointercancel',()=>{C.drag=-1;C.edge=-1;$('#loupe').classList.remove('on');});
/* precision tools: snap, fine drag, 1-pixel nudge */
$('#snapB').onclick=()=>{C.snap=!C.snap;$('#snapB').classList.toggle('on',C.snap);};
$('#fineB').onclick=()=>{C.fine=!C.fine;$('#fineB').classList.toggle('on',C.fine);};
let nudgeLt=0;
function nudge(dx,dy){const q=C.page&&C.page.corners[C.sel];if(!q)return;q.x=clamp(q.x+dx/C.src.width,0,1);q.y=clamp(q.y+dy/C.src.height,0,1);drawQuad();loupe(q);clearTimeout(nudgeLt);nudgeLt=setTimeout(()=>$('#loupe').classList.remove('on'),900);}
$$('#nudge .nb').forEach(b=>{const dir={l:[-1,0],r:[1,0],u:[0,-1],d:[0,1]}[b.dataset.d];let t1=0,t2=0,n=0;
  const stop=()=>{clearTimeout(t1);clearInterval(t2);};
  b.addEventListener('pointerdown',e=>{e.preventDefault();stop();n=0;nudge(dir[0],dir[1]);t1=setTimeout(()=>{t2=setInterval(()=>{n++;const k=n>15?4:1;nudge(dir[0]*k,dir[1]*k);},45);},380);});
  ['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev,stop));});
addEventListener('keydown',e=>{if(V.cur!=='vCrop'||!C.page||/INPUT|TEXTAREA/.test((e.target&&e.target.tagName)||''))return;
  const m={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key];if(!m)return;e.preventDefault();const k=e.shiftKey?5:1;nudge(m[0]*k,m[1]*k);});
new ResizeObserver(()=>{if(V.cur==='vCrop')layoutCrop();}).observe($('#cropStage'));
let autoI=0;$('#autoBtn').onclick=async()=>{if(!C.page)return;if(detectCorners.src!==C.src){busy(true);await detectAsync(C.src);busy(false);autoI=0;}else{autoI++;}const al=detectCorners.alts;await tween(C.page.corners,al[autoI%al.length],380);if(al.length>1)toast((lang==='ar'?'اقتراح ':'Suggestion ')+((autoI%al.length)+1)+'/'+al.length+(lang==='ar'?' — اضغط تاني لاقتراح مختلف':' — tap again for another'));};
$('#fullBtn').onclick=()=>tween(C.page.corners,[{x:0,y:0},{x:1,y:0},{x:1,y:1},{x:0,y:1}],320);
$('#cropBack').onclick=()=>{
  const cam=!!window.__txCamBack;
  if(C.from==='new'||(C.from==='edit'&&E.isDraft&&cam)){state.draft=null;C.page=null;E.page=null;state.queue=[];if(cam)window.__txCamWait=Date.now()+2500;goHome();
    if(cam)setTimeout(()=>{try{window.__txOpenLive&&window.__txOpenLive()}catch(e){}},140);}
  else{openEdit(C.page,E.isDraft,true);}
};
$('#cropGo').onclick=()=>{ try{if(window.EdgeLearn&&C.page)EdgeLearn.observePage(C.page);}catch(e){} if(C.from==='new'){openEdit(C.page,true);}else{openEdit(C.page,E.isDraft,true);} };

/* ---------- editor ---------- */
function updateEditTitle(){const p=E.page;if(!p)return;const i=state.pages.indexOf(p);$('#editTitle').textContent=i<0?t('newPage'):t('pageN',i+1);}
async function openEdit(p,isDraft,rebuild=true){
  E.page=p;E.isDraft=isDraft;C.page=null;busy(true);await sleep(20);
  try{await buildBases();}catch(e){console.error(e);}
  busy(false);
  show('vEdit');updateEditTitle();syncControls();setTab(E.tab);
  await sleep(40);fitWrap();renderEdit();
}
async function buildBases(){resetZ();
  const p=E.page,src=await getSrc(p),small=warpRot(src,p,1200);
  E.base=makeBase(small);
  /* نسخة معاينة مصغّرة (≤640px) عشان تبديل الفلاتر وسحب السلايدر يبقى سريع على موبايل متوسط */
  E.pbase=null;const pk=640/Math.max(small.width,small.height);
  if(pk<.9){const pc=mk(Math.round(small.width*pk),Math.round(small.height*pk)),px=pc.getContext('2d');px.imageSmoothingQuality='high';px.drawImage(small,0,0,pc.width,pc.height);E.pbase=makeBase(pc);}
  const k=170/Math.max(small.width,small.height),tiny=mk(small.width*k,small.height*k);tiny.getContext('2d').drawImage(small,0,0,tiny.width,tiny.height);
  E.tiny=makeBase(tiny);buildFilterThumbs();
  /* الصفحة الجديدة: الفلتر الافتراضي = اختيار ✨ (مرة واحدة، والمستخدم يغيّره بعدها براحته) */
  if(p.ap){p.ap=0;try{const r=smartPick(E.base);p.filter=r.f;p.br=r.br;p.ct=r.ct;p.sat=r.sat;setTimeout(()=>toast('✨ '+r.why),400);}catch(e){console.error(e);}}
  const cb=$('#cvBase'),ov=$('#ov');cb.width=ov.width=E.base.w;cb.height=ov.height=E.base.h;
}
function fitWrap(){
  if(!E.base)return;const st=$('#editStage'),pad=18,aw=st.clientWidth-pad*2,ah=st.clientHeight-pad*2;
  const k=Math.min(aw/E.base.w,ah/E.base.h),w=Math.max(40,Math.floor(E.base.w*k)),h=Math.max(40,Math.floor(E.base.h*k));
  const wr=$('#wrap');wr.style.width=w+'px';wr.style.height=h+'px';
}
new ResizeObserver(()=>{if(V.cur==='vEdit')fitWrap();}).observe($('#editStage'));
/* v174: بعد الرجوع من الخلفية الأندرويد ممكن يمسح الكانفس (الصفحة بيضا) — نعيد بناءه */
{let hid=0,rb=0;document.addEventListener('visibilitychange',()=>{if(document.hidden){hid=Date.now();return;}
 if(V.cur!=='vEdit'||!E.page||rb||Date.now()-hid<2500)return;rb=1;(async()=>{try{await buildBases();fitWrap();renderEdit();}catch(e){console.warn('resume',e);}finally{rb=0;}})();});}
function renderEdit(fast){
  if(!E.base||!E.page)return;const p=E.page,f=E.orig?'original':p.filter,B=fast&&E.pbase?E.pbase:E.base,tc=toneCanvas(B,f,E.orig?0:p.br,E.orig?0:p.ct,E.orig?0:p.sat);
  const cx=$('#cvBase').getContext('2d');if(B!==E.base){cx.drawImage(tc,0,0,E.base.w,E.base.h);redrawOv();return;} /* معاينة سريعة: بدون fills، والكامل بيتبعها */
  cx.drawImage(tc,0,0);if(!E.orig)applyFills(cx,tc.width,tc.height,p.ann,p);E.fsg=fsig(p);redrawOv();
}
function redrawOv(){if(E.page&&!E.orig&&E.fsg!==fsig(E.page)){renderEdit();return;}
  const ov=$('#ov'),x=ov.getContext('2d');x.clearRect(0,0,ov.width,ov.height);if(E.orig||!E.page)return;
  drawAnn(x,ov.width,ov.height,E.page.ann);if(E.draft)drawOne(x,ov.width,ov.height,E.draft);if(E.cur&&!E.cur.mv&&!E.cur.sv)drawOne(x,ov.width,ov.height,E.cur);drawSel(x,ov.width,ov.height);
}
const schedule=()=>{if(E.raf)return;E.raf=requestAnimationFrame(()=>{E.raf=0;const p=E.page;clearTimeout(E.ft);
  if(E.pbase&&p&&!E.orig&&!p.ink&&!p.ann.some(a=>a.t==='fill'||a.t==='txtr')){renderEdit(true);E.ft=setTimeout(renderEdit,180);}else renderEdit();});};
function buildFilters0(){
  const row=$('#fltRow');row.innerHTML='';
  FILTERS.forEach(f=>{const b=document.createElement('button');b.className='flt';b.dataset.f=f;b.innerHTML=`<canvas width="4" height="4"></canvas><span>${f==='original'?t('original'):t('f_'+f)}</span>`;
    b.onclick=()=>{if(!E.page)return;E.page.filter=f;syncControls();schedule();};row.appendChild(b);});
  if(E.tiny)buildFilterThumbs();
}
function buildFilterThumbs(){
  if(!E.tiny)return;$$('.flt').forEach(b=>{const tc=toneCanvas(E.tiny,b.dataset.f,0,0,0),cv=$('canvas',b);cv.width=tc.width;cv.height=tc.height;cv.getContext('2d').drawImage(tc,0,0);});
}
function buildTools0(){
  const row=$('#toolRow');row.innerHTML='';
  TOOLS.forEach(([k,ic])=>{const b=document.createElement('button');b.className='tool'+(E.tool===k?' on':'');b.dataset.k=k;b.setAttribute('aria-label',t(k));b.title=t(k);b.innerHTML=`<svg class="i"><use href="#${ic}"/></svg>`;
    b.onclick=()=>{E.tool=k;E.sel=null;if(k==='hl'&&E.color==='#111111')E.color='#FFD60A';$$('.tool',row).forEach(x=>x.classList.toggle('on',x===b));syncControls();closeTextBar();};row.appendChild(b);});
  const sw=$('#swRow');sw.innerHTML='';
  COLORS.forEach(c=>{const b=document.createElement('button');b.className='sw';b.style.background=c;b.dataset.c=c;b.setAttribute('aria-label',c);b.onclick=()=>{E.color=c;syncControls();};sw.appendChild(b);});
}
function syncControls(){
  const p=E.page;
  $$('.flt').forEach(b=>b.classList.toggle('on',p&&b.dataset.f===p.filter));
  $$('#swRow .sw').forEach(b=>b.classList.toggle('on',b.dataset.c===E.color));
  $$('#szSeg button').forEach(b=>b.classList.toggle('on',+b.dataset.s===E.size));
  if(p){$('#sBr').value=p.br;$('#sCt').value=p.ct;$('#sSa').value=p.sat;$('#oBr').textContent=p.br;$('#oCt').textContent=p.ct;$('#oSa').textContent=p.sat;}
  const i=p?state.pages.indexOf(p):-1;
  $('#mvE').disabled=i<=0;$('#mvL').disabled=i<0||i>=state.pages.length-1;
  $('#undoBtn').disabled=!p||!p.hist.length;$('#redoBtn').disabled=!p||!p.fut.length;$('#clrBtn').disabled=!p||!p.ann.length;
  $('#undoBtn').style.opacity=$('#undoBtn').disabled?.35:1;$('#redoBtn').style.opacity=$('#redoBtn').disabled?.35:1;$('#clrBtn').style.opacity=$('#clrBtn').disabled?.35:1;
  $('#ov').style.cursor=E.tool==='erase'?'cell':'crosshair';
  $$('#inkRow .chip').forEach(b=>b.classList.toggle('on',+b.dataset.v===((p&&p.ink)||0)));
  resetDel();
}
const ERA_T=['classo','cbrush','cbox','erase'];
function setTab(id){
  const vid=id==='pErase'?'pMarkup':id; /* «مسح» تبويب مستقل في الشريط لكن بيستخدم نفس لوحة التعديل (نفس الـcanvas والأدوات) */
  if(vid==='pMarkup'){const sub=id==='pErase'?'erase':'edit';if(E.sub!==sub){E.sub=sub;const ok=sub==='erase'?ERA_T.includes(E.tool):!ERA_T.includes(E.tool);if(!ok)E.tool=sub==='erase'?'classo':'hand';try{buildTools();}catch(e){console.error(e);}try{syncControls();}catch(e){}}}
  E.tab=vid;['pFilters','pAdjust','pMarkup','pPage'].forEach(k=>{$('#'+k).hidden=k!==vid;});
  $$('.tab').forEach(b=>b.classList.toggle('on',b.dataset.tab===id));
  if(vid!=='pMarkup')closeTextBar();
  ov_enable(vid==='pMarkup');
  try{window.TXOrd&&TXOrd.sync();}catch(e){}
}
function ov_enable(on){$('#ov').style.pointerEvents=on?'auto':'none';}
$$('.tab').forEach(b=>b.onclick=()=>setTab(b.dataset.tab));
$('#szSeg').onclick=e=>{const b=e.target.closest('button');if(!b)return;E.size=+b.dataset.s;syncControls();};
['sBr:br:oBr','sCt:ct:oCt','sSa:sat:oSa'].forEach(s=>{const[id,key,out]=s.split(':');$('#'+id).addEventListener('input',e=>{E.page[key]=+e.target.value;$('#'+out).textContent=e.target.value;schedule();});});
$('#adjReset').onclick=()=>{Object.assign(E.page,{br:0,ct:0,sat:0});syncControls();schedule();};
const cmp=$('#cmpBtn');
cmp.addEventListener('pointerdown',e=>{E.orig=true;renderEdit();cmp.setPointerCapture(e.pointerId);});
['pointerup','pointercancel'].forEach(ev=>cmp.addEventListener(ev,()=>{E.orig=false;renderEdit();}));

/* markup interaction */
const SIZES={cl:[.014,.028,.05],pen:[.003,.0055,.0095],hl:[.014,.024,.04],txt:[.026,.038,.056],stamp:[.04,.06,.09]};
function ptOf(e){const r=$('#ov').getBoundingClientRect();return[clamp((e.clientX-r.left)/r.width,0,1),clamp((e.clientY-r.top)/r.height,0,1)];}
function addAnn(a){const p=E.page;if(a.t==='redact'){try{const o=JSON.parse(localStorage.getItem('tx_oidx')||'{}');delete o[p.id];localStorage.setItem('tx_oidx',JSON.stringify(o));}catch(e){}}p.ann.push(a);p.hist.push({k:'add',a});p.fut.length=0;redrawOv();syncControls();}
function eraseAt(pt){
  const ov=$('#ov'),r=ov.getBoundingClientRect(),w=ov.width,h=ov.height,tol=16*(w/r.width),px=pt[0]*w,py=pt[1]*h,p=E.page;
  for(let i=p.ann.length-1;i>=0;i--){if(hitTest(p.ann[i],px,py,w,h,tol)){const a=p.ann.splice(i,1)[0];p.hist.push({k:'del',a,i});p.fut.length=0;redrawOv();syncControls();return;}}
}
const ov=$('#ov');
ov.addEventListener('pointerdown',e=>{
  if(!E.page||E.tab!=='pMarkup')return;if(E.pick){const f=E.pick;E.pick=null;e.preventDefault();f(e);return;}const pt=ptOf(e),k=E.tool;if(k!=='text'&&k!=='note')E.sel=null;ov.setPointerCapture(e.pointerId);e.preventDefault();
  if(k==='pen'||k==='hl')E.cur={t:k,c:E.color,w:SIZES[k][E.size],p:[pt]};
  else if(k==='arrow'||k==='box'||k==='redact')E.cur={t:k,c:E.color,w:SIZES.pen[E.size],a:pt,b:pt};
  else if(k==='check'||k==='cross'){addAnn({t:k,c:k==='check'&&E.color==='#111111'?'#12A150':E.color,x:pt[0],y:pt[1],s:SIZES.stamp[E.size]});}
  else if(k==='text'||k==='note'){
    if(!$('#textBar').hidden){$('#textAdd').click();E.cur=null;return;}
    const o=$('#ov'),rc=o.getBoundingClientRect(),w=o.width,h=o.height,tol=14*(w/rc.width),px=pt[0]*w,py=pt[1]*h;let hit=null;
    for(let i=E.page.ann.length-1;i>=0;i--){const a=E.page.ann[i];if((a.t==='text'||a.t==='note')&&hitTest(a,px,py,w,h,tol)){hit=a;break;}}
    if(hit){const L=layoutText(mctx,w,hit),q=tpos(L,w,h,hit);E.cur={mv:hit,ox:pt[0]-q[0]/w,oy:pt[1]-q[1]/h,sx:pt[0],sy:pt[1],cx:e.clientX,cy:e.clientY,before:{x:hit.x,y:hit.y},moved:false};E.sel=hit;redrawOv();}
    else{E.sel=null;openTextBar(pt);}
  }
  else if(k==='erase'){E.cur={erase:true};eraseAt(pt);}
  else if(k==='cbrush'||k==='classo')E.cur={t:'fill',k:k==='cbrush'?'b':'l',live:1,id:newId(),w:SIZES.cl[E.size]/Z.s,p:[pt]};
  else if(k==='cbox')E.cur={t:'fill',k:'x',live:1,id:newId(),a:pt,b:pt};
  else if(k==='sign'){const sd=document.getElementById('sgD'),o=$('#ov'),rc=o.getBoundingClientRect(),w=o.width,h=o.height,tol=16*(w/rc.width);let hit=null;
    for(let i=E.page.ann.length-1;i>=0;i--){const a=E.page.ann[i];if(a.t==='sig'){const S=a.s*w,bh=a.r*S;if(Math.abs(pt[0]-a.x)*w<=S/2+tol&&Math.abs(pt[1]-a.y)*h<=bh/2+tol){hit=a;break;}}}
    if(hit){sgOpen(hit);E.cur={sv:hit,ox:pt[0]-hit.x,oy:pt[1]-hit.y,cx:e.clientX,cy:e.clientY,moved:false};}
    else if(sd)sgClose();else placeSig(pt);}
  else if(k==='ocrbox'){const hh=E.page.ann.slice().reverse().find(a=>a.t==='txtr'&&pt[0]>=Math.min(a.x0,a.x1)&&pt[0]<=Math.max(a.x0,a.x1)&&pt[1]>=Math.min(a.y0,a.y1)&&pt[1]<=Math.max(a.y0,a.y1));if(hh)txtSheet(hh);else E.cur={t:'fill',k:'x',live:1,id:newId(),a:pt,b:pt,ocr:1};}
});
ov.addEventListener('pointermove',e=>{
  const c=E.cur;if(!c)return;const pt=ptOf(e);
  if(c.erase){eraseAt(pt);return;}
  if(c.sv){if(!c.moved&&Math.hypot(e.clientX-c.cx,e.clientY-c.cy)<=6)return;c.moved=true;c.sv.x=clamp(pt[0]-c.ox,.02,.98);c.sv.y=clamp(pt[1]-c.oy,.02,.98);if(!E._mf){E._mf=requestAnimationFrame(()=>{E._mf=0;redrawOv();});}return;}
  if(c.mv){if(!c.moved&&Math.hypot(e.clientX-c.cx,e.clientY-c.cy)<=8)return;c.moved=true;const o=$('#ov'),w=o.width,h=o.height,L=layoutText(mctx,w,c.mv);
    c.mv.x=clamp(pt[0]-c.ox,0,Math.max(0,1-L.bw/w));c.mv.y=clamp(pt[1]-c.oy,0,Math.max(0,1-L.bh/h));if(!E._mf){E._mf=requestAnimationFrame(()=>{E._mf=0;redrawOv();});}return;}
  if(c.p){const l=c.p[c.p.length-1];if(Math.hypot(pt[0]-l[0],pt[1]-l[1])>.0015)c.p.push(pt);}else c.b=pt;
  redrawOv();
});
const upOv=()=>{const c=E.cur;E.cur=null;
  if(c&&c.mv){const a=c.mv,p=E.page;if(c.moved){if(a.x!==c.before.x||a.y!==c.before.y){p.hist.push({k:'mod',a,b:c.before,n:{x:a.x,y:a.y}});p.fut.length=0;}redrawOv();syncControls();}else openTextBar(null,a);return;}
  if(c&&c.sv){redrawOv();return;}if(!c||c.erase){return;}
  if(c.b&&Math.hypot(c.a[0]-c.b[0],c.a[1]-c.b[1])<.01){redrawOv();return;}
  if(c.t==='fill'){if(c.ocr){E.cur=null;redrawOv();ocrModal(E.page,{x0:Math.min(c.a[0],c.b[0]),y0:Math.min(c.a[1],c.b[1]),x1:Math.max(c.a[0],c.b[0]),y1:Math.max(c.a[1],c.b[1])});return;}delete c.live;if(c.k==='l'&&c.p.length<3){redrawOv();return;}}addAnn(c);};
ov.addEventListener('pointerup',upOv);ov.addEventListener('pointercancel',()=>{const c=E.cur;E.cur=null;if(c&&c.mv&&c.moved){const a=c.mv,p=E.page;if(a.x!==c.before.x||a.y!==c.before.y){p.hist.push({k:'mod',a,b:c.before,n:{x:a.x,y:a.y}});p.fut.length=0;}syncControls();}redrawOv();});
function txRevealRect(top,bot){const tb=$('#textBar'),sh=document.getElementById('txS')||document.getElementById('sgD'),st=$('#editStage').getBoundingClientRect(),dock=sh||(tb&&!tb.hidden?tb:null);let lim=innerHeight;
  if(dock){const pop=dock.querySelector('.txpop');lim=(pop&&!pop.hidden?pop:dock).getBoundingClientRect().top;}
  lim-=10;const tt=st.top+6;let dy=0;if(bot>lim)dy=lim-bot;if(top+dy<tt)dy=tt-top;if(Math.abs(dy)<1)return;
  if(Z.s>1.001){Z.y+=dy;limZ();}else{const h=$('#ov').getBoundingClientRect().height;Z.lift=clamp((Z.lift||0)-dy,0,h*.7);applyZ();}}
function txVisible(a){const tb=$('#textBar');if(!a||!E.page||!tb||tb.hidden)return;const o=$('#ov'),rc=o.getBoundingClientRect(),w=o.width,h=o.height;if(!w||!rc.width)return;const L=layoutText(mctx,w,a),q=tpos(L,w,h,a),k=rc.width/w;txRevealRect(rc.top+q[1]*k,rc.top+(q[1]+L.bh)*k);}
function txVis(){cancelAnimationFrame(E._txr);E._txr=requestAnimationFrame(()=>txVisible(E.ta));}
function txTabIn(dock,k){const pop=dock.querySelector('.txpop'),cur=pop.dataset.cur===k?'':k;pop.dataset.cur=cur;pop.hidden=!cur;pop.querySelectorAll('.pp').forEach(x=>x.hidden=x.dataset.pp!==cur);dock.querySelectorAll('.txc[data-p]').forEach(b=>b.classList.toggle('on',b.dataset.p===cur));
  if(cur){const t=dock.querySelector('textarea');if(t)t.blur();}setTimeout(()=>{if(dock._rv)dock._rv();},40);}
(function(){const vv=window.visualViewport,rs=document.documentElement.style;let t=0;const set=()=>{const h=vv?vv.height:innerHeight,top=vv?vv.offsetTop:0,kb=vv?Math.max(0,Math.round(innerHeight-h-top)):0;rs.setProperty('--kb',kb+'px');rs.setProperty('--vvh',Math.round(h)+'px');rs.setProperty('--vvt',Math.round(top)+'px');cancelAnimationFrame(t);t=requestAnimationFrame(()=>{const tb=$('#textBar'),d=document.getElementById('txS')||document.getElementById('sgD')||(tb&&!tb.hidden?tb:null);if(d&&d._rv)d._rv();});};if(vv){vv.addEventListener('resize',set);vv.addEventListener('scroll',set);}addEventListener('resize',set);set();})();
function ensureTf(){let r=$('#txPop');if(r)return r;const ar=(typeof lang==='undefined'||lang==='ar'),tb=$('#textBar'),ti=$('#textIn');
  const r1=document.createElement('div');r1.className='txr1';tb.insertBefore(r1,ti);r1.append(ti,$('#textAdd'),$('#textCancel'));
  const r2=document.createElement('div');r2.className='txr2';
  r2.innerHTML='<button type="button" class="txc" data-p="f" aria-label="'+(ar?'الخط':'Font')+'"><span class="txf"></span></button><button type="button" class="txc" data-z="-1" aria-label="'+(ar?'تصغير':'Smaller')+'">A−</button><button type="button" class="txc" data-p="s" id="txBN" aria-label="'+(ar?'الحجم':'Size')+'"></button><button type="button" class="txc" data-z="1" aria-label="'+(ar?'تكبير':'Larger')+'">A+</button><button type="button" class="txc" data-p="c" id="txBC" aria-label="'+(ar?'اللون':'Color')+'"><i class="txd"></i></button><button type="button" class="txc" data-p="k" id="txBK" aria-label="'+(ar?'حد النص':'Outline')+'"><i class="txk"></i><span>'+(ar?'حد':'Outline')+'</span></button>';   r1.after(r2);
  r=document.createElement('div');r.id='txPop';r.className='txpop';r.hidden=true;
  r.innerHTML='<div class="pp" data-pp="f"><div id="tfFonts"></div><div id="tfWt" style="margin-top:8px"></div></div><div class="pp" data-pp="s"><label class="tfs"><span>'+(ar?'الحجم':'Size')+'</span><input type="range" id="tfSz" min="15" max="110"></label></div><div class="pp" data-pp="c"><div id="tfCol"></div></div><div class="pp" data-pp="k"><div id="tfSk"></div></div>';
  tb.appendChild(r);tb._rv=()=>txVisible(E.ta);
  const col=$('#tfCol',r);COLORS.concat(['#FFFFFF']).forEach(c=>{const b=document.createElement('button');b.type='button';b.className='tfc';b.style.background=c;b.dataset.c=c;b.setAttribute('aria-label',c);b.onclick=()=>{E.tc=c;tfApply();tfSync();};col.appendChild(b);});
  const sk=$('#tfSk',r);['',...COLORS,'#FFFFFF'].forEach(c=>{const b=document.createElement('button');b.type='button';b.className='tfc tfk'+(c?'':' none');if(c)b.style.background=c;else b.textContent='✕';b.dataset.c=c;b.setAttribute('aria-label',c||(ar?'بدون حد':'No outline'));b.onclick=()=>{E.tsk=c;tfApply();tfSync();};sk.appendChild(b);});
   fontCards($('#tfFonts',r),E.tf,k=>{E.tf=k;tfApply();tfSync();});wtSeg($('#tfWt',r),E.tw||600,w=>{E.tw=w;tfApply();tfSync();});
  $('#tfSz',r).oninput=e=>{E.tsz=e.target.value/1000;tfApply();tfSync();};
  ti.addEventListener('input',tfApply);
  const keep=e=>{if(e.target.closest('[data-z]'))e.preventDefault();};r2.addEventListener('pointerdown',keep);r2.addEventListener('mousedown',keep);
  r2.onclick=e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.z){E.tsz=clamp(E.tsz+(+b.dataset.z)*.003,.015,.11);tfApply();tfSync();}else if(b.dataset.p)txTabIn(tb,b.dataset.p);};
  try{window.TXFONTS.then(()=>redrawOv());}catch(_){}
  return r;}
function tfApply(){const a=E.ta;if(!a)return;const ti=$('#textIn');a.txt=ti.value;a.f=E.tf;a.w=E.tw||600;a.s=E.tsz;if(a.t==='text'&&E.tc)a.c=E.tc;if(a.t==='text'){if(E.tsk)a.sk=E.tsk;else delete a.sk;}ti.style.height='auto';ti.style.height=Math.min(ti.scrollHeight+2,84)+'px';redrawOv();txVis();}
function tfSync(){const r=$('#txPop'),ti=$('#textIn'),a=E.ta;if(!r||!a)return;fontCardsSet($('#tfFonts',r),E.tf);wtSet($('#tfWt',r),E.tw||600);const n=Math.round(E.tsz*1000);$('#tfSz',r).value=n;$('#txBN').textContent=n;
  const f=TFONTS[E.tf]||TFONTS.manrope,fb=$('#textBar').querySelector('.txf');fb.textContent=f[0].replace('Noto Sans Arabic','Noto');fb.style.fontFamily=f[1];fb.style.fontWeight=E.tw||600;
  const cb=$('#txBC');cb.style.display=a.t==='note'?'none':'';cb.querySelector('.txd').style.background=E.tc||'#111';const kb=$('#txBK');if(kb){kb.style.display=a.t==='note'?'none':'';const kd=kb.querySelector('.txk');kd.style.background=E.tsk||'transparent';kd.classList.toggle('off',!E.tsk);}$$('.tfk',r).forEach(b=>b.classList.toggle('on',(b.dataset.c||'').toLowerCase()===String(E.tsk||'').toLowerCase()));
  $$('.tfc',r).forEach(b=>b.classList.toggle('on',b.dataset.c.toLowerCase()===String(E.tc).toLowerCase()));
  ti.style.fontFamily=f[1];ti.style.fontWeight=E.tw||600;ti.style.fontSize='16px';}
function openTextBar(pt,edit){ensureTf();const ti=$('#textIn'),isNote=edit?edit.t==='note':E.tool==='note';E.pending=pt||null;E.edit=edit||null;E.draft=null;
  if(edit){E.ta=edit;E.snap={txt:edit.txt,f:edit.f,w:edit.w||600,s:edit.s,c:edit.c,sk:edit.sk};E.tsk=edit.sk||'';E.tf=edit.f||'manrope';E.tw=edit.w||600;E.tsz=edit.s;E.tc=edit.c;E.sel=edit;ti.value=edit.txt;}
  else{E.snap=null;E.tf=E.tfPref||'cairo';E.tw=E.twPref||600;E.tsz=E.tszPref||SIZES.txt[E.size]*(isNote?.85:1);E.tc=(E.color==='#FFD60A'?'#111111':E.color);E.tsk=E.tskPref||'';     const d={t:isNote?'note':'text',c:isNote?'#2A2200':E.tc,x:pt[0],y:pt[1],s:E.tsz,f:E.tf,txt:''};E.draft=d;E.ta=d;E.sel=d;ti.value='';}
  $('#textBar').hidden=false;const pp=$('#txPop');pp.hidden=true;pp.dataset.cur='';$$('#textBar .txc.on').forEach(x=>x.classList.remove('on'));tfSync();ti.style.height='auto';ti.style.height=Math.min(ti.scrollHeight+2,84)+'px';redrawOv();ti.focus();setTimeout(txVis,80);setTimeout(txVis,420);}
function closeTextBar(keep){if(!keep&&E.edit&&E.snap)Object.assign(E.ta,E.snap);E.draft=null;E.ta=null;E.edit=null;E.snap=null;E.pending=null;if(!keep)E.sel=null;
  const tb=$('#textBar');if(tb)tb.hidden=true;const ti=$('#textIn');if(ti)ti.blur();try{Z.lift=0;applyZ();}catch(_){}redrawOv();}
$('#textCancel').onclick=()=>closeTextBar();
$('#textAdd').onclick=()=>{const a=E.ta,v=$('#textIn').value.trim();if(!a){closeTextBar();return;}
  if(E.edit){const p=E.page;
    if(!v){const i=p.ann.indexOf(a);if(i>=0){p.ann.splice(i,1);p.hist.push({k:'del',a,i});p.fut.length=0;}E.sel=null;closeTextBar(true);syncControls();return;}
    tfApply();a.txt=v;const n={txt:a.txt,f:a.f,w:a.w,s:a.s,c:a.c,sk:a.sk},sn=E.snap;
    if(sn.txt!==n.txt||sn.f!==n.f||sn.w!==n.w||sn.s!==n.s||sn.c!==n.c||sn.sk!==n.sk){p.hist.push({k:'mod',a,b:sn,n});p.fut.length=0;}
    E.tfPref=E.tf;E.twPref=E.tw;E.tszPref=E.tsz;E.tskPref=E.tsk;closeTextBar(true);syncControls();return;}
  if(!v){closeTextBar();return;}
  tfApply();a.txt=v;E.draft=null;E.tfPref=E.tf;E.twPref=E.tw;E.tszPref=E.tsz;E.tskPref=E.tsk;addAnn(a);E.sel=a;closeTextBar(true);};
$('#textIn').addEventListener('keydown',e=>{if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();$('#textAdd').click();}});
$('#undoBtn').onclick=()=>{const p=E.page,op=p.hist.pop();if(!op)return;if(op.k==='mod')Object.assign(op.a,op.b);else if(op.k==='add'){const i=p.ann.indexOf(op.a);if(i>=0)p.ann.splice(i,1);}else p.ann.splice(op.i,0,op.a);p.fut.push(op);redrawOv();syncControls();};
$('#redoBtn').onclick=()=>{const p=E.page,op=p.fut.pop();if(!op)return;if(op.k==='mod')Object.assign(op.a,op.n);else if(op.k==='add')p.ann.push(op.a);else{const i=p.ann.indexOf(op.a);if(i>=0)p.ann.splice(i,1);}p.hist.push(op);redrawOv();syncControls();};
$('#clrBtn').onclick=()=>{const p=E.page;if(!p.ann.length)return;const all=p.ann.slice();p.ann.length=0;all.forEach(a=>p.hist.push({k:'del',a,i:0}));p.hist=p.hist.slice(-200);p.fut.length=0;redrawOv();syncControls();};

/* page tab */
async function rebuildAfterGeometry(){busy(true);await sleep(20);await buildBases();busy(false);fitWrap();renderEdit();}
$('#rotL').onclick=()=>{E.page.rot=(E.page.rot+3)%4;rebuildAfterGeometry();};
$('#rotR').onclick=()=>{E.page.rot=(E.page.rot+1)%4;rebuildAfterGeometry();};
$('#recrop').onclick=()=>{openCrop(E.page,'edit');};
function movePage(d){const p=E.page,i=state.pages.indexOf(p),j=i+d;if(i<0||j<0||j>=state.pages.length)return;state.pages.splice(i,1);state.pages.splice(j,0,p);persistMeta();syncControls();updateEditTitle();}
$('#mvE').onclick=()=>movePage(-1);$('#mvL').onclick=()=>movePage(1);
let delArm=0;
function resetDel(){delArm=0;const b=$('#delPg');if(!b)return;b.classList.remove('arm');$('#delLbl').textContent=t('del');}
$('#delPg').onclick=async()=>{
  if(!delArm){delArm=1;$('#delPg').classList.add('arm');$('#delLbl').textContent=t('delSure');setTimeout(()=>{if(delArm)resetDel();},2500);return;}
  const p=E.page,i=state.pages.indexOf(p);if(i>=0){state.pages.splice(i,1);unpersist(p.id);persistMeta();}
  state.draft=null;E.page=null;resetDel();goHome();
};
async function commitPage(){
  const p=E.page;if(!p)return;
  if(E.isDraft){state.pages.push(p);E.isDraft=false;state.draft=null;}
  p.thumb=await makeThumb(p);await persist(p);await persistMeta();
}
$('#doneBtn').onclick=async()=>{try{if(E.page)OCRMEM.delete(E.page.id);}catch(_){}closeEditDocks();busy(true);await commitPage();const id=E.page&&E.page.id;busy(false);E.page=null;if(!nextQueued())goHome(id);};
$('#nextBtn').onclick=async()=>{
  closeEditDocks();$('#camIn').click();
  await commitPage();const id=E.page&&E.page.id;E.page=null;goHome(id);
};
$('#editBack').onclick=async()=>{
  closeEditDocks();
  if(E.isDraft){openCrop(E.page,'edit');return;}
  busy(true);await commitPage();const id=E.page.id;busy(false);E.page=null;goHome(id);
};

/* ---------- export ---------- */
const QUAL={small:{edge:1400,q:.6},medium:{edge:1800,q:.8},high:{edge:2200,q:.92}};
const X={fmt:'pdf',size:'high',ps:'fit',sel:new Set(),busy:false};
let DL=null;
(async()=>{try{if(window.claude&&claude.use)DL=(await claude.use('downloads'))||null;}catch(e){DL=null;}})();
function openSheet(only,opt){
  if(!state.pages.length)return;
  const one=Array.isArray(only)&&only.length>0;opt=(one&&opt)||{};
  X.sel=new Set(one?only:state.pages.map((_,i)=>i));X.mode=one?(only.length===1?'one':'pick'):'all';X.busy=false;X.act='save';$('#xFb').hidden=true;$('#xFb').innerHTML='';
  try{const f=localStorage.getItem('tx_xfmt'),ps=localStorage.getItem('tx_xps'),sz=localStorage.getItem('tx_xsz2');if(f&&/^(pdf|jpg|png)$/.test(f))X.fmt=f;if(ps&&/^(fit|a4|a5|letter)$/.test(ps))X.ps=ps;if(sz&&QUAL[sz])X.size=sz;}catch(_){}
  if(opt.fmt)X.fmt=opt.fmt;if(opt.ps)X.ps=opt.ps;
  $('#xName').value=(one&&opt.file)||state.name||defName();buildXPages();syncX();$('#scrim').classList.add('on');$('#sheet').classList.add('on');
}
function closeSheet(){$('#scrim').classList.remove('on');$('#sheet').classList.remove('on');}
function buildXPages(){const box=$('#xPages');box.innerHTML='';
  state.pages.forEach((p,i)=>{const b=document.createElement('button');b.type='button';b.className='chip xth';b.setAttribute('aria-label',t('pageN',i+1));b.innerHTML=(p.thumb?'<img alt="" src="'+p.thumb+'">':'')+'<b>'+(i+1)+'</b><i></i>';
    b.onclick=()=>{if(X.busy)return;if(X.mode==='one'){X.sel=new Set([i]);}else{X.sel.has(i)?X.sel.delete(i):X.sel.add(i);}syncX();};box.appendChild(b);});}
function syncX0(){
  $$('#xFmt .chip').forEach(b=>b.classList.toggle('on',b.dataset.v===X.fmt));
  $$('#xSize .chip').forEach(b=>b.classList.toggle('on',b.dataset.v===X.size));
  $$('#xPs .chip').forEach(b=>b.classList.toggle('on',b.dataset.v===X.ps));
  $$('#xPages .chip').forEach((b,i)=>b.classList.toggle('on',X.sel.has(i)));
  $('#xPsRow').hidden=X.fmt!=='pdf';
  $('#xNote').textContent=X.fmt==='pdf'?t('pdfNote'):(X.sel.size>1?t('zipNote'):'');
  $('#xGoLbl').textContent=X.busy?'':t('saveBtn');
  $('#xGo').disabled=!X.sel.size;
}
$('#xFmt').onclick=e=>{const b=e.target.closest('.chip');if(b&&!X.busy){X.fmt=b.dataset.v;syncX();}};
$('#xSize').onclick=e=>{const b=e.target.closest('.chip');if(b&&!X.busy){X.size=b.dataset.v;syncX();}};
$('#xPs').onclick=e=>{const b=e.target.closest('.chip');if(b&&!X.busy){X.ps=b.dataset.v;syncX();}};
$('#scrim').onclick=()=>{if(!X.busy)closeSheet();};
$('#exportBtn').onclick=openSheet;
$('#xName').addEventListener('input',e=>{state.name=e.target.value;$('#docName').value=e.target.value;});

async function renderFinal(p,edge){
  try{await window.TXFONTS}catch(_){}
  const src=p.src||await decodeBlob(p.blob),w=warpRot(src,p,edge),b=makeBase(w),tc=toneCanvas(b,p.filter,p.br,p.ct,p.sat);
  applyFills(tc.getContext('2d'),tc.width,tc.height,p.ann,p);drawAnn(tc.getContext('2d'),tc.width,tc.height,p.ann);return stampOut(tc,p);
}
function u32(n){return[n&255,(n>>>8)&255,(n>>>16)&255,(n>>>24)&255];}
function u16(n){return[n&255,(n>>>8)&255];}
const CRC=(()=>{const t=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0;}return t;})();
const crc32=u=>{let c=0xFFFFFFFF;for(let i=0;i<u.length;i++)c=CRC[(c^u[i])&255]^(c>>>8);return(c^0xFFFFFFFF)>>>0;};
function buildZip(files){
  const enc=new TextEncoder(),parts=[],central=[];let off=0;
  for(const f of files){const nm=enc.encode(f.name),crc=crc32(f.data),sz=f.data.length;
    const lh=new Uint8Array([0x50,0x4b,3,4,20,0,0,8,0,0,0,0,0x21,0,...u32(crc),...u32(sz),...u32(sz),...u16(nm.length),0,0]);
    parts.push(lh,nm,f.data);
    central.push(new Uint8Array([0x50,0x4b,1,2,20,0,20,0,0,8,0,0,0,0,0x21,0,...u32(crc),...u32(sz),...u32(sz),...u16(nm.length),0,0,0,0,0,0,0,0,0,0,0,0,...u32(off)]),nm);
    off+=lh.length+nm.length+sz;}
  let cl=0;central.forEach(c=>cl+=c.length);
  const end=new Uint8Array([0x50,0x4b,5,6,0,0,0,0,...u16(files.length),...u16(files.length),...u32(cl),...u32(off),0,0]);
  return new Blob([...parts,...central,end],{type:'application/zip'});
}
function buildPDF(items,mode){
  const enc=new TextEncoder(),parts=[],offs=[];let off=0;
  const push=b=>{const u=typeof b==='string'?enc.encode(b):b;parts.push(u);off+=u.length;};
  push('%PDF-1.4\n');push(new Uint8Array([0x25,0xE2,0xE3,0xCF,0xD3,10]));
  const n=items.length,obj=(id,body)=>{offs[id]=off;push(`${id} 0 obj\n${body}\nendobj\n`);};
  obj(1,'<< /Type /Catalog /Pages 2 0 R >>');
  obj(2,`<< /Type /Pages /Count ${n} /Kids [${items.map((_,i)=>`${3+i*3} 0 R`).join(' ')}] >>`);
  items.forEach((it,i)=>{
    const pid=3+i*3,cid=pid+1,iid=pid+2;let pw,ph,dw,dh,x,y;
    if(mode!=='fit'){const S=mode==='a5'?[419.53,595.28]:mode==='letter'?[612,792]:[595.28,841.89],land=it.w>it.h;pw=land?S[1]:S[0];ph=land?S[0]:S[1];const k=Math.min(pw/it.w,ph/it.h);dw=it.w*k;dh=it.h*k;x=(pw-dw)/2;y=(ph-dh)/2;}
    else{pw=it.w*.36;ph=it.h*.36;dw=pw;dh=ph;x=0;y=0;}
    obj(pid,`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pw.toFixed(2)} ${ph.toFixed(2)}] /Resources << /XObject << /Im0 ${iid} 0 R >> >> /Contents ${cid} 0 R >>`);
    const cs=`q ${dw.toFixed(2)} 0 0 ${dh.toFixed(2)} ${x.toFixed(2)} ${y.toFixed(2)} cm /Im0 Do Q`;
    obj(cid,`<< /Length ${cs.length} >>\nstream\n${cs}\nendstream`);
    offs[iid]=off;push(`${iid} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${it.w} /Height ${it.h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${it.bytes.length} >>\nstream\n`);push(it.bytes);push('\nendstream\nendobj\n');
  });
  const total=2+n*3,xo=off;let xr=`xref\n0 ${total+1}\n0000000000 65535 f \n`;
  for(let id=1;id<=total;id++)xr+=String(offs[id]).padStart(10,'0')+' 00000 n \n';
  push(xr);push(`trailer\n<< /Size ${total+1} /Root 1 0 R >>\nstartxref\n${xo}\n%%EOF`);
  return new Blob(parts,{type:'application/pdf'});
}
const safeName=s=>(s||'Timaxo scan').replace(/[\\/:*?"<>|\u0000-\u001f]/g,'').trim().slice(0,60)||'Timaxo scan';
function setProg(i,n){$('#xBar').style.transform=`scaleX(${n?i/n:0})`;$('#xGoLbl').textContent=t('preparing',Math.min(i+1,n),n);}
$('#xGo').onclick=async()=>{
  if(X.busy)return;const idx=[...X.sel].sort((a,b)=>a-b);if(!idx.length){toast(t('selectPages'));return;}
  X.busy=true;$('#xFb').hidden=true;$('#xFb').innerHTML='';
  const Q=QUAL[X.size],name=safeName($('#xName').value),items=[];
  try{
    for(let k=0;k<idx.length;k++){setProg(k,idx.length);await sleep(30);
      const c=await renderFinal(state.pages[idx[k]],Q.edge);
      const blob=await toBlob(c,X.fmt==='png'?'image/png':'image/jpeg',Q.q);items.push({blob,w:c.width,h:c.height});}
    $('#xBar').style.transform='scaleX(1)';
    let out,filename,kind;
    if(X.fmt==='pdf'){for(const it of items)it.bytes=new Uint8Array(await it.blob.arrayBuffer());out=buildPDF(items,X.ps);filename=name+'.pdf';kind='pdf';}
    else{const ext=X.fmt==='png'?'png':'jpg';
      if(items.length===1){out=items[0].blob;filename=`${name}.${ext}`;kind='img';}
      else{const files=[];for(let k=0;k<items.length;k++)files.push({name:`${name}-${String(idx[k]+1).padStart(2,'0')}.${ext}`,data:new Uint8Array(await items[k].blob.arrayBuffer())});out=buildZip(files);filename=name+'.zip';kind='zip';}}
    await deliver(out,filename,kind);
  }catch(e){console.error(e);toast(t('saveFail'));}
  X.busy=false;$('#xBar').style.transform='scaleX(0)';syncX();
};
(function(){
  const DAY=864e5;let shown=0;
  window.__txBkCheck=async function(){
    if(shown)return;try{
      let first=+localStorage.getItem('tx_first')||0;if(!first){first=Date.now();localStorage.setItem('tx_first',String(first));}
      const last=+localStorage.getItem('tx_lastbk')||0,snooze=+localStorage.getItem('tx_bksnooze')||0,now=Date.now();
      if(now<snooze)return;if(now-Math.max(last,first)<(last?14:7)*DAY)return;
      const n=(await allSaved()).length+(state.pages.length?1:0);if(!n)return;
      shown=1;const bar=document.createElement('div');bar.id='bkBar';
      bar.innerHTML='<span></span><button type="button" class="y"></button><button type="button" class="n" aria-label="x">✕</button>';
      bar.querySelector('span').textContent=Lg('مستنداتك محفوظة على الجهاز بس. اعمل نسخة احتياطية دلوقتي؟','Your documents live on this device only. Back up now?');
      bar.querySelector('.y').textContent=Lg('نسخة احتياطية','Back up');
      bar.querySelector('.y').onclick=()=>{bar.remove();const l=document.getElementById('libBtn');if(l)l.click();};
      bar.querySelector('.n').onclick=()=>{try{localStorage.setItem('tx_bksnooze',String(Date.now()+3*DAY));}catch(_){}bar.remove();};
      document.body.appendChild(bar);
    }catch(_){}
  };
  setTimeout(()=>{try{window.__txBkCheck();}catch(_){}},5000);
})();
window.__txQuickPdf=async function(r){
  const pages=r.isCur?state.pages.slice():(r.rows||[]);if(!pages.length){toast(Lg('المستند فاضي','The document is empty'));return;}
  busy(true);const Q=QUAL.medium,items=[];
  try{
    for(let k=0;k<pages.length;k++){const c=await renderFinal(pages[k],Q.edge);const blob=await toBlob(c,'image/jpeg',Q.q);items.push({blob,w:c.width,h:c.height,bytes:new Uint8Array(await blob.arrayBuffer())});}
    const out=buildPDF(items,'fit');busy(false);await deliver(out,safeName(r.name)+'.pdf','pdf');
  }catch(e){console.error(e);toast(t('saveFail'));}
  if(!r.isCur)pages.forEach(p=>{p.src=null;});busy(false);
};
async function saveFile(blob,filename){
  if(DL){try{await DL.save({filename,data:blob});return'saved';}catch(e){if(e&&e.code==='declined')return'cancelled';}}
  const hosted=!!(window.claude&&window.claude.use),act=X.act||'save';X.act='save';
  if(!hosted){
    if(act==='share'){try{const f=new File([blob],filename,{type:blob.type});if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],title:filename});return'saved';}}catch(e){if(e&&e.name==='AbortError')return'cancelled';}}
    try{const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),60000);return'saved';}catch(e){}
  }
  return'fallback';
}
async function deliver(blob,filename,kind){
  const r=await saveFile(blob,filename);
  if(r==='saved'){toast(t('saved'));closeSheet();return;}
  if(r==='cancelled'){toast(t('cancelled'));return;}
  const fb=$('#xFb'),url=URL.createObjectURL(blob);fb.hidden=false;
  fb.innerHTML=(kind==='img'?`<img alt="" src="${url}"><div>${t('fbImg')}</div>`:`<div>${t('saveFail')}</div>`)+`<a href="${url}" target="_blank" rel="noopener" download="${filename}">${t('fbOpen')}</a>`;
  window.__lastExport={blob,filename,kind};
}

/* ---------- misc wiring ---------- */
$('#docName').addEventListener('input',e=>{state.name=e.target.value;persistMeta();});
let newArm=0;
$('#newBtn').onclick=async()=>{
  const b=$('#newBtn');if(!newArm){newArm=1;b.textContent=t('newDoc2');setTimeout(()=>{newArm=0;b.textContent=t('newDoc');},2600);return;}
  newArm=0;state.pages=[];state.name='';$('#docName').value=defName();state.name=$('#docName').value;await clearStore();await persistMeta();b.textContent=t('newDoc');renderHome();
};
$('#langBtn').onclick=()=>{lang=lang==='ar'?'en':'ar';ls.set('tx-lang',lang);const wasDefault=!state.name||/^(Scan|مستند) \d\d-\d\d$/.test(state.name);if(wasDefault){state.name=defName();}$('#docName').value=state.name;applyLang();};

(async()=>{
  await restore();
  if(!state.name)state.name=defName();$('#docName').value=state.name;
  applyLang();
})();

/* ===== Documents library, backup, export stamps ===== */
const Lg=(a,e)=>lang==='ar'?a:e;
const allSaved=()=>new Promise(res=>{if(!db)return res([]);try{const r=db.transaction('docs').objectStore('docs').getAll();r.onsuccess=()=>res((r.result||[]).filter(x=>!x.trashed));r.onerror=()=>res([]);}catch(e){res([]);}});
function curRec(){if(!state.pages.length)return null;if(!state.id)state.id=newId();
  const rows=state.pages.map(p=>({id:p.id,blob:p.blob,corners:p.corners,rot:p.rot,filter:p.filter,br:p.br,ct:p.ct,sat:p.sat,ann:p.ann,thumb:p.thumb}));
  return{id:state.id,name:state.name||defName(),rows,order:rows.map(r=>r.id),count:rows.length,thumb:rows[0].thumb,ts:Date.now(),pinned:state.pinnedId===state.id,tags:getTags()};}
async function snapDoc(){const r=curRec();if(r)await tx('docs','readwrite',s=>s.put(r));}
async function loadRec(rec){state.pinnedId=rec.pinned?rec.id:null;state.tags=rec.tags||[];state.tagsFor=rec.id;state.pages=rec.order.map(id=>rec.rows.find(r=>r.id===id)).filter(Boolean).map(r=>({...r,src:null,hist:[],fut:[]}));
  state.name=rec.name;state.id=rec.id;$('#docName').value=state.name;
  await tx('docs','readwrite',s=>s.delete(rec.id));await clearStore();for(const p of state.pages)await persist(p);await persistMeta();}
async function startNew(){await snapDoc();state.pages=[];state.id=newId();state.name=defName();$('#docName').value=state.name;await clearStore();await persistMeta();stagNext=true;renderHome();}
async function updLib(){const el=$('#libB');if(!el)return;const n=(await allSaved()).length;el.textContent=n?String(n):'';$('#libBtn').setAttribute('aria-label',Lg('مستنداتي','My documents'));const lt=document.querySelector('#libBtn .libt');if(lt)lt.textContent=Lg('المستندات','Documents');}
$('#newBtn').onclick=async()=>{if(!state.pages.length)return;await startNew();toast(Lg('بدأت مستند جديد — القديم محفوظ في "مستنداتي"','New document started — the previous one is saved in My documents'));};
const libSheet=document.createElement('div');libSheet.className='sheet';libSheet.id='libSheet';libSheet.setAttribute('role','dialog');
libSheet.innerHTML='<div class="grab"></div><h2 id="libT"></h2><input id="libQ" type="search" autocomplete="off"><div id="libList"></div><div id="libUse"></div><button class="libtr" id="libTr"></button><div class="libact"><button class="btn pri" id="libNew"><svg class="i"><use href="#i-plus"/></svg><span></span></button><button class="btn" id="libBk"><svg class="i"><use href="#i-bk"/></svg><span></span></button><button class="btn" id="libRs"><svg class="i"><use href="#i-rs"/></svg><span></span></button></div><input type="file" id="rsIn" accept=".json,application/json" hidden>';
$('#app').appendChild(libSheet);
function libLabels(){$('#libT').textContent=Lg('مستنداتي','My documents');$('#libNew span').textContent=Lg('مستند جديد','New document');$('#libBk span').textContent=Lg('نسخة احتياطية','Backup');$('#libRs span').textContent=Lg('استعادة','Restore');}
function closeLib(){libMode='docs';libSheet.classList.remove('on');if(!$('#sheet').classList.contains('on'))$('#scrim').classList.remove('on');}
$('#scrim').addEventListener('click',closeLib);
async function openLib(){libLabels();await renderLib();$('#scrim').classList.add('on');libSheet.classList.add('on');}
async function renderLib0(){const box=$('#libList');box.innerHTML='';const saved=(await allSaved()).filter(matchQ).filter(tagOk).sort((a,b)=>((b.pinned?1:0)-(a.pinned?1:0))||b.ts-a.ts);const cur0=curRec();const cur=cur0&&matchQ(cur0)&&tagOk(cur0)?cur0:null;let i=0;
  const item=(r,isCur)=>{const b=document.createElement('div');b.className='lib-it'+(isCur?' cur':'');b.style.setProperty('--i',i++);b.tabIndex=0;b.setAttribute('role','button');
    b.innerHTML=`<img alt="" src="${r.thumb}"><div class="tx"><b></b><small>${Lg(r.count+' صفحة',r.count+(r.count===1?' page':' pages'))}</small></div>${isCur?`<span class="go"><svg class="i" style="width:18px;height:18px"><use href="#i-cur"/></svg>${Lg('مفتوح','Open')}</span>`:''}<button class="libdel" aria-label="delete"><svg class="i"><use href="#i-trash"/></svg></button>`;
    $('b',b).textContent=(r.pinned?'📌 ':'')+r.name;if(!isCur){const pn=document.createElement('button');pn.type='button';pn.textContent=r.pinned?Lg('إلغاء التثبيت','Unpin'):Lg('📌 تثبيت','📌 Pin');pn.style.cssText='margin-top:4px;padding:2px 10px;border-radius:10px;border:1px solid #8886;background:transparent;color:inherit;font-size:12px';pn.onclick=async e=>{e.stopPropagation();await tx('docs','readwrite',st=>st.put({...r,pinned:!r.pinned}));await renderLib();};$('.tx',b).appendChild(pn);}
    {const tags=isCur?getTags():(r.tags||[]);const bs='margin:4px 6px 0 0;padding:2px 10px;border-radius:10px;border:1px solid #8886;background:transparent;color:inherit;font-size:12px';
     if(tags.length){const tl=document.createElement('small');tl.style.cssText='display:block;opacity:.8';tl.textContent=tags.map(x=>'#'+x).join(' ');$('.tx',b).appendChild(tl);}
     const tb=document.createElement('button');tb.type='button';tb.textContent=Lg('🏷 وسوم','🏷 Tags');tb.style.cssText=bs;
     tb.onclick=async e=>{e.stopPropagation();const v=prompt(Lg('اكتب الوسوم مفصولة بفاصلة (بتشتغل زي المجلدات)','Tags separated by commas (they work like folders)'),tags.join('، '));if(v===null)return;const arr=[...new Set(v.split(/[,،]/).map(x=>x.trim()).filter(Boolean))].slice(0,6);
      if(isCur){setTags(arr);try{persistMeta();}catch(er){}}else await tx('docs','readwrite',st=>st.put({...r,tags:arr}));await renderLib();};$('.tx',b).appendChild(tb);}
    {const ex=expiryOf(r);if(ex){const past=new Date(ex+'T23:59:59Z')<new Date(),el=document.createElement('small');el.style.cssText='display:block;opacity:.85';el.textContent=(past?Lg('منتهي: ','Expired: '):Lg('ينتهي: ','Expires: '))+ex;$('.tx',b).appendChild(el);
     if(!past){const eb=document.createElement('button');eb.type='button';eb.textContent=Lg('⏰ ذكّرني','⏰ Remind me');eb.style.cssText='margin:4px 6px 0 0;padding:2px 10px;border-radius:10px;border:1px solid #8886;background:transparent;color:inherit;font-size:12px';eb.onclick=e=>{e.stopPropagation();expiryIcs(r,ex);};$('.tx',b).appendChild(eb);}}}let arm=0;const del=$('.libdel',b);
    del.onclick=async e=>{e.stopPropagation();if(!arm){arm=1;del.classList.add('arm');del.textContent=Lg('تأكيد الحذف','Confirm');setTimeout(()=>{arm=0;del.classList.remove('arm');del.innerHTML='<svg class="i"><use href="#i-trash"/></svg>';},2600);return;}
      if(isCur){{const rr=curRec();if(rr)await tx('docs','readwrite',s=>s.put({...rr,trashed:Date.now()}));}state.pages=[];state.id=newId();state.name=defName();$('#docName').value=state.name;await clearStore();await persistMeta();}else{await tx('docs','readwrite',s=>s.put({...r,trashed:Date.now()}));toast(Lg('اتنقل لسلة المحذوفات (٣٠ يوم)','Moved to Trash (30 days)'));}
      renderHome();await renderLib();};
    b.onclick=async()=>{if(isCur){closeLib();return;}await snapDoc();await loadRec(r);closeLib();stagNext=true;renderHome();toast(Lg('تم فتح: ','Opened: ')+r.name);};
    b.onkeydown=e=>{if(e.key==='Enter')b.onclick();};box.appendChild(b);};
  if(cur)item(cur,true);saved.forEach(r=>item(r,false));
  if(!cur&&!saved.length)box.innerHTML=`<div class="empty" style="padding:18px 0"><p>${Lg('مفيش مستندات محفوظة لسه. أي مستند جديد بتبدأه بيحفظ القديم هنا تلقائياً.','No saved documents yet. Starting a new one saves the current one here.')}</p></div>`;}


/* ===== v17: Smart enhance chip + estimated export size ===== */
function smartPick(b){
  if(window.TXF){try{const r=TXF.pick(b);return{f:r.f,why:Lg(r.whyAr,r.whyEn),br:r.br,ct:r.ct,sat:r.sat};}catch(e){console.error(e);}} /* المرحلة 2: اختيار بتحليل الصورة، والقديم احتياطي */
  const n=b.norm,sr=b.src,N=b.w*b.h,st=Math.max(1,Math.floor(N/20000));let c=0,ink=0,mid=0,col=0,sl=0;
  for(let k=0;k<N;k+=st){const i=k*4,r=n[i],g=n[i+1],bl=n[i+2],l=(r*77+g*150+bl*29)>>8;c++;if(l<110)ink++;if(l>=60&&l<190)mid++;if(Math.max(r,g,bl)-Math.min(r,g,bl)>45)col++;sl+=(sr[i]*77+sr[i+1]*150+sr[i+2]*29)>>8;}
  ink/=c;mid/=c;col/=c;sl/=c;const spread=b.hi-b.lo;let f,why;
  if(mid>.5&&col>.3){f='original';why=Lg('صورة','Photo');}
  else if(col>.06){f='magic';why=Lg('مستند ملوّن','Colour document');}
  else if(ink>.008&&ink<.25&&mid<.12){f='bw';why=Lg('نص واضح','Clean text');}
  else{f='gray';why=Lg('نص/خط يد','Text / handwriting');}
  return{f,why,br:sl<95?Math.min(25,Math.round((110-sl)/2)):0,ct:spread<.55?12:0,sat:f==='magic'&&col<.15?8:0};}
function buildFilters(){buildFilters0();const row=$('#fltRow'),b=document.createElement('button');b.className='smartb';b.innerHTML='<b>✨</b><span>'+Lg('ذكي','Smart')+'</span>';
  b.onclick=()=>{const p=E.page;if(!p||!E.base)return;const r=smartPick(E.base);p.filter=r.f;p.br=r.br;p.ct=r.ct;p.sat=r.sat;syncControls();schedule();
    b.classList.remove('pulse');void b.offsetWidth;b.classList.add('pulse');toast('✨ '+r.why+' → '+(r.f==='original'?t('original'):t('f_'+r.f)));};row.prepend(b);}
const EST={};let estTok=0,estT=0;
const fmtB=b=>b>=1048576?(b/1048576).toFixed(1)+' MB':Math.max(1,Math.round(b/1024))+' KB';
function syncX(){syncX0();try{xUi();}catch(e){console.warn('xUi',e);}clearTimeout(estT);estT=setTimeout(estSize,300);}
async function estSize(){const el=$('#xEst');if(!el||X.busy)return;const idx=[...X.sel].sort((a,b)=>a-b);if(!idx.length){el.innerHTML='';return;}
  const p=state.pages[idx[0]],key=p.id+'|'+fsig(p)+'|'+X.fmt,my=++estTok;
  if(!EST[key]){el.textContent=Lg('بحسب الحجم المتوقع…','Estimating size…');
    try{const big=await renderFinal(p,QUAL.high.edge);if(my!==estTok)return;const res={};
      for(const k of ['high','medium','small']){const Q=QUAL[k];let c=big;if(k!=='high'){const sc=Q.edge/QUAL.high.edge;c=mk(Math.round(big.width*sc),Math.round(big.height*sc));const cx=c.getContext('2d');cx.imageSmoothingQuality='high';cx.drawImage(big,0,0,c.width,c.height);}
        res[k]=(await toBlob(c,X.fmt==='png'?'image/png':'image/jpeg',Q.q)).size;}EST[key]=res;}catch(e){el.textContent='';return;}}
  if(my!==estTok)return;const r=EST[key],lab={small:t('qSmall'),medium:t('qMed'),high:t('qHigh')};
  el.innerHTML=['small','medium','high'].map(k=>`<span class="${k===X.size?'cur':''}">${lab[k]} ≈ ${fmtB(r[k]*idx.length)}</span>`).join('')+(r[X.size]*idx.length<3145728?`<em>${Lg('✓ مناسب للواتساب','✓ WhatsApp-friendly')}</em>`:'');}
/* ===== v16: doc search (name + OCR text), 30-day trash, storage meter ===== */
let libMode='docs';
const norm=x=>String(x||'').toLowerCase().replace(/[\u064B-\u0652\u0640]/g,'').replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه');
const OI=()=>{try{return JSON.parse(localStorage.getItem('tx_oidx')||'{}')}catch(e){return{}}};
function ocrIdx(p,T,box){if(!p||!T)return;const o=OI();o[p.id]=(box&&o[p.id]?o[p.id]+'\n':'')+T.slice(0,4000);const k=Object.keys(o);if(k.length>300)for(const x of k.slice(0,k.length-300))delete o[x];try{localStorage.setItem('tx_oidx',JSON.stringify(o))}catch(e){}}
function matchQ(r){const q=norm($('#libQ').value).trim();if(!q)return true;if(norm(r.name).includes(q)||(r.tags||[]).some(x=>norm(x).includes(q)))return true;const o=OI();return (r.order||[]).some(id=>norm(o[id]).includes(q));}
const allRaw=()=>new Promise(res=>{if(!db)return res([]);try{const r=db.transaction('docs').objectStore('docs').getAll();r.onsuccess=()=>res(r.result||[]);r.onerror=()=>res([]);}catch(e){res([]);}});
const allTrash=async()=>(await allRaw()).filter(x=>x.trashed);
async function renderTrash(){const box=$('#libList');box.innerHTML='';const tr=(await allTrash()).sort((a,b)=>b.trashed-a.trashed);
  if(!tr.length){box.innerHTML=`<div class="empty" style="padding:18px 0"><p>${Lg('السلة فاضية. المستندات المحذوفة بتفضل هنا ٣٠ يوم.','Trash is empty. Deleted documents stay here for 30 days.')}</p></div>`;return;}
  tr.forEach((r,i)=>{const b=document.createElement('div');b.className='lib-it';b.style.setProperty('--i',i);const d=Math.max(0,30-Math.floor((Date.now()-r.trashed)/864e5));
    b.innerHTML=`<img alt="" src="${r.thumb}"><div class="tx"><b></b><small>${Lg('هيتمسح خلال '+d+' يوم','Deleted in '+d+' days')}</small></div><button class="btn sm" data-a="r"></button><button class="libdel" data-a="x" aria-label="delete"><svg class="i"><use href="#i-trash"/></svg></button>`;
    $('b',b).textContent=r.name;const rb=$('[data-a=r]',b),xb=$('[data-a=x]',b);rb.textContent=Lg('استرجاع','Restore');let arm=0;
    rb.onclick=async()=>{const q={...r};delete q.trashed;await tx('docs','readwrite',s=>s.put(q));toast(Lg('اترجع: ','Restored: ')+r.name);renderHome();renderLib();};
    xb.onclick=async()=>{if(!arm){arm=1;xb.classList.add('arm');xb.textContent=Lg('تأكيد','Confirm');setTimeout(()=>{arm=0;xb.classList.remove('arm');xb.innerHTML='<svg class="i"><use href="#i-trash"/></svg>';},2600);return;}await tx('docs','readwrite',s=>s.delete(r.id));renderLib();};
    box.appendChild(b);});}
async function renderLib(){const trash=libMode==='trash',q=$('#libQ');q.hidden=trash;q.placeholder=Lg('ابحث بالاسم أو بنص الـOCR…','Search by name or OCR text…');
  if(trash){await renderTrash();await libChips();}else{await renderLib0();await libChips();if(norm(q.value).trim()&&$('#libList .empty p'))$('#libList .empty p').textContent=Lg('مفيش نتايج.','No results.');}
  const n=(await allTrash()).length,tb=$('#libTr');tb.textContent=trash?Lg('→ رجوع للمستندات','← Back to documents'):Lg('🗑 المحذوفات ('+n+')','🗑 Trash ('+n+')');tb.hidden=!trash&&!n;
  try{const e=await navigator.storage.estimate();$('#libUse').textContent=Lg('المساحة المستخدمة: ','Storage used: ')+(e.usage/1048576).toFixed(1)+' MB';}catch(_){}}
$('#libQ').oninput=()=>renderLib();
$('#libTr').onclick=()=>{libMode=libMode==='trash'?'docs':'trash';renderLib();};
idbReady.then(async()=>{for(const r of await allTrash())if(Date.now()-r.trashed>30*864e5)await tx('docs','readwrite',s=>s.delete(r.id));
  try{const e=await navigator.storage.estimate();if(e.quota&&e.usage/e.quota>.8)setTimeout(()=>toast(Lg('المساحة قربت تخلص — اعمل نسخة احتياطية وامسح مستندات قديمة','Storage almost full — back up and delete old documents')),3500);}catch(_){}});
$('#libBtn').onclick=openLib;
$('#libNew').onclick=async()=>{closeLib();if(state.pages.length){await startNew();toast(Lg('مستند جديد جاهز','New document ready'));}else $('#camIn').click();};
const b64=b=>new Promise(r=>{const f=new FileReader();f.onload=()=>r(f.result);f.readAsDataURL(b);});
const bs=u=>{let x='';for(let i=0;i<u.length;i+=32768)x+=String.fromCharCode.apply(null,u.subarray(i,i+32768));return btoa(x);},fb=x=>Uint8Array.from(atob(x),c=>c.charCodeAt(0));
const bkKey=async(pw,salt,iter,use)=>{const km=await crypto.subtle.importKey('raw',new TextEncoder().encode(pw),'PBKDF2',false,['deriveKey']);return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:iter,hash:'SHA-256'},km,{name:'AES-GCM',length:256},false,[use]);};
const encBk=async(txt,pw)=>{const salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12)),iter=310000,key=await bkKey(pw,salt,iter,'encrypt'),ct=new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv},key,new TextEncoder().encode(txt)));return JSON.stringify({app:'timaxo-scan',v:2,enc:{alg:'AES-GCM',kdf:'PBKDF2-SHA256',iter,salt:bs(salt),iv:bs(iv)},data:bs(ct)});};
const decBk=async(j,pw)=>{const it=+j.enc.iter;if(!(it>=1e5&&it<=2e6))throw 0;const key=await bkKey(pw,fb(j.enc.salt),it,'decrypt');return new TextDecoder().decode(await crypto.subtle.decrypt({name:'AES-GCM',iv:fb(j.enc.iv)},key,fb(j.data)));};
$('#libBk').onclick=async()=>{busy(true);try{const all=[...(await allSaved())];const c=curRec();if(c)all.unshift(c);if(!all.length){busy(false);toast(Lg('مفيش حاجة تتحفظ','Nothing to back up'));return;}
  const docs=[];for(const r of all)docs.push({...r,rows:await Promise.all(r.rows.map(async x=>({...x,blob:await b64(x.blob)})))});
  let payload=JSON.stringify({app:'timaxo-scan',v:1,docs});busy(false);
  const pw=prompt(Lg('كلمة سر لتشفير النسخة (سيبها فاضية لو مش عايز تشفير). لو نسيتها مش هتقدر تستعيد النسخة','Password to encrypt the backup (leave empty for none). If you forget it, the backup cannot be restored'));
  if(pw===null){toast(Lg('تم إلغاء الحفظ','Save cancelled'));return;}
  busy(true);if(pw)payload=await encBk(payload,pw);
  const blob=new Blob([payload],{type:'application/json'});
  const r=await saveFile(blob,'Timaxo-backup-'+new Date().toISOString().slice(0,10)+'.json');busy(false);
  if(r==='saved'){try{localStorage.setItem('tx_lastbk',String(Date.now()));}catch(_){}}toast(r==='saved'?Lg('تم حفظ النسخة الاحتياطية','Backup saved'):r==='cancelled'?Lg('تم إلغاء الحفظ','Save cancelled'):Lg('الحفظ غير متاح هنا','Saving is not available here'));}catch(e){busy(false);toast(Lg('فشل النسخ الاحتياطي','Backup failed'));console.error(e);}};
const d2b=u=>{const[m,b]=u.split(',');const bin=atob(b),a=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)a[i]=bin.charCodeAt(i);return new Blob([a],{type:(m.match(/:(.*?);/)||[])[1]||'image/jpeg'});};
$('#libRs').onclick=()=>$('#rsIn').click();
$('#rsIn').onchange=async e=>{const f=e.target.files[0];e.target.value='';if(!f)return;busy(true);
  try{let j=JSON.parse(await f.text());if(j.app!=='timaxo-scan')throw 0;
    if(j.enc){busy(false);const pw=prompt(Lg('النسخة مشفّرة. اكتب كلمة السر','This backup is encrypted. Enter the password'));if(pw===null)return;busy(true);try{j=JSON.parse(await decBk(j,pw));}catch(_){busy(false);toast(Lg('كلمة السر غلط أو الملف تالف','Wrong password or damaged file'));return;}}const have=new Set((await allSaved()).map(r=>r.id));if(state.id)have.add(state.id);let n=0,first=null;
    for(const r of j.docs){const rows=r.rows.map(x=>({...x,blob:d2b(x.blob)}));const rec={...r,rows,id:have.has(r.id)?newId():r.id,ts:Date.now()};await tx('docs','readwrite',s=>s.put(rec));n++;if(n===1)first=rec;}
    if(!state.pages.length&&first){await loadRec(first);stagNext=true;renderHome();}
    busy(false);toast(Lg('تمت استعادة '+n+' مستند','Restored '+n+' document(s)'));await renderLib();updLib();}catch(err){busy(false);toast(Lg('الملف مش نسخة احتياطية صالحة','Not a valid backup file'));}};
// export stamps: watermark + page numbers
const XO={wm:'',num:false,tile:false};
function stampOut(c,p){const w=c.width,h=c.height,x=c.getContext('2d');
  if(XO.wm){x.save();const ar=/[\u0600-\u06FF]/.test(XO.wm);if(ar)x.direction='rtl';
    let fs=Math.round(Math.min(w,h)*(XO.tile?.05:.1));x.font=`700 ${fs}px sans-serif`;const tw=x.measureText(XO.wm).width,mw=Math.hypot(w,h)*.7;if(tw>mw){fs=Math.round(fs*mw/tw);x.font=`700 ${fs}px sans-serif`;}
    x.textAlign='center';x.textBaseline='middle';x.lineJoin='round';x.lineWidth=Math.max(1,fs*.06);
    const draw=()=>{x.globalAlpha=.16;x.strokeStyle='#fff';x.strokeText(XO.wm,0,0);x.globalAlpha=.2;x.fillStyle='#1B63F0';x.fillText(XO.wm,0,0);};
    const ang=-Math.atan2(h,w)*.75;
    if(XO.tile){const gx=Math.max(tw,fs)*1.6,gy=fs*3.2,R=Math.hypot(w,h);x.translate(w/2,h/2);x.rotate(ang);let r=0;for(let yy=-R/2;yy<R/2;yy+=gy,r++)for(let xx=-R/2+(r%2?gx/2:0);xx<R/2;xx+=gx){x.save();x.translate(xx,yy);draw();x.restore();}}
    else{x.translate(w/2,h/2);x.rotate(ang);draw();}
    x.restore();}
  if(XO.num){const i=state.pages.indexOf(p)+1,n=state.pages.length,fs=Math.round(Math.min(w,h)*.026);x.save();x.font=`600 ${fs}px sans-serif`;x.textAlign='center';x.fillStyle='rgba(50,62,100,.85)';x.fillText(i+' / '+n,w/2,h-fs*1.5);x.restore();}
  return c;}
$('#xPsRow').insertAdjacentHTML('afterend','<div class="fld" id="xStamp"><span class="l" id="xStL"></span><input class="docname" id="xWm" maxlength="40" autocomplete="off" spellcheck="false" style="margin-bottom:8px"><div class="chips"><button class="chip" id="xNumB"></button><button class="chip" id="xTileB"></button></div></div>');
const stLabels=()=>{$('#xStL').textContent=Lg('علامة مائية وترقيم','Watermark & numbering');$('#xWm').placeholder=Lg('نص علامة مائية (اختياري)','Watermark text (optional)');$('#xNumB').textContent=Lg('ترقيم الصفحات','Page numbers');$('#xTileB').textContent=Lg('علامة مكررة','Tiled mark');};
$('#xWm').addEventListener('input',e=>{XO.wm=e.target.value.trim();});
$('#xTileB').onclick=()=>{XO.tile=!XO.tile;$('#xTileB').classList.toggle('on',XO.tile);};
$('#xNumB').onclick=()=>{XO.num=!XO.num;$('#xNumB').classList.toggle('on',XO.num);};
$('#exportBtn').addEventListener('click',stLabels);
$('#langBtn').addEventListener('click',()=>setTimeout(()=>{libLabels();stLabels();updLib();},40));
stLabels();libLabels();

/* ===== v2: content eraser, zoom/pan ===== */
function fillPath(ctx,w,h,a){ctx.beginPath();
 if(a.k==='x'){ctx.rect(Math.min(a.a[0],a.b[0])*w,Math.min(a.a[1],a.b[1])*h,Math.abs(a.a[0]-a.b[0])*w,Math.abs(a.a[1]-a.b[1])*h);return;}
 const p=a.p;ctx.moveTo(p[0][0]*w,p[0][1]*h);for(let i=1;i<p.length;i++)ctx.lineTo(p[i][0]*w,p[i][1]*h);
 if(p.length===1)ctx.lineTo(p[0][0]*w+.01,p[0][1]*h);if(a.k==='l')ctx.closePath();}
function fillShape(ctx,w,h,a,style,fe){ctx.save();ctx.fillStyle=ctx.strokeStyle=style;ctx.lineJoin=ctx.lineCap='round';fe=fe||0;
 ctx.lineWidth=a.k==='b'?a.w*w+fe:Math.max(2,w*.003)+fe;fillPath(ctx,w,h,a);if(a.k!=='b')ctx.fill();ctx.stroke();ctx.restore();}
function fillBox(a,w,h,m){const xs=a.k==='x'?[a.a[0],a.b[0]]:a.p.map(q=>q[0]),ys=a.k==='x'?[a.a[1],a.b[1]]:a.p.map(q=>q[1]),e=(a.k==='b'?a.w*w/2:0)+m;
 return[Math.max(0,Math.floor(Math.min(...xs)*w-e)),Math.max(0,Math.floor(Math.min(...ys)*h-e)),Math.min(w,Math.ceil(Math.max(...xs)*w+e)),Math.min(h,Math.ceil(Math.max(...ys)*h+e))];}
function bandMed(d,W,r0,r1){const R=[],G=[],B=[],st=Math.max(1,(W/160)|0);
 for(let y=r0;y<r1;y++)for(let x=0;x<W;x+=st){const i=(y*W+x)*4;R.push(d[i]);G.push(d[i+1]);B.push(d[i+2]);}
 const m=A=>(A.sort((p,q)=>p-q),A[A.length>>1]);return`rgb(${m(R)},${m(G)},${m(B)})`;}
function applyFills(ctx,w,h,list,pg){if(pg&&pg.ink)applyInk(ctx,w,h,pg.ink);for(let a of list){let bgc=null;if(a.t==='txtr'){bgc=a.bg||null;a={k:'x',a:[a.x0,a.y0],b:[a.x1,a.y1],__t:1};}else if(a.t!=='fill'||a.live)continue;
 const[x0,y0,x1,y1]=fillBox(a,w,h,2),bw=Math.max(3,Math.round(w*.008)),ya=Math.max(0,y0-bw),yb=Math.min(h,y1+bw),W=x1-x0,H=yb-ya;if(W<1||H<1)continue;
 if(!bgc&&a.__t){try{if(bgCoons(ctx,x0,y0,x1,y1,w,h))continue;}catch(e){}}
 const d=ctx.getImageData(x0,ya,W,H).data,tp=y0-ya,bt=yb-y1,tc=tp>=2?bandMed(d,W,0,tp):null,bc=bt>=2?bandMed(d,W,H-bt,H):null;
 const g=ctx.createLinearGradient(0,y0,0,y1+.001);g.addColorStop(0,tc||bc||'#fff');g.addColorStop(1,bc||tc||'#fff');
 fillShape(ctx,w,h,a,bgc||g,w*.004);}}
const fsig=p=>p.id+':'+p.ann.filter(a=>a.t==='fill'||a.t==='txtr').map(a=>a.id+(a.bg||'')).join();
$('#toolRow').addEventListener('click',e=>{const b=e.target.closest('.tool');if(b&&b.dataset.k==='ocrbox')warmOcr();if(b&&/^(cbrush|classo|cbox)$/.test(b.dataset.k))toast(lang==='ar'?'حدّد العنصر غير المرغوب وسيُمسح بلون الورقة':'Mark the unwanted item; it is filled with the paper color');});
const Z={s:1,x:0,y:0},PT=new Map();let zp=null;
function applyZ(){const ly=Z.lift||0;$('#wrap').style.transform=(Z.s===1&&!Z.x&&!Z.y&&!ly)?'':`translate(${Z.x}px,${Z.y-ly}px) scale(${Z.s})`;}
function resetZ(){Z.s=1;Z.x=Z.y=0;applyZ();}
function zoomAt(cx,cy,s2){if(Z.lift){Z.y-=Z.lift;Z.lift=0;}const r=$('#editStage').getBoundingClientRect(),ox=r.left+r.width/2,oy=r.top+r.height/2;s2=clamp(s2,1,8);const k=s2/Z.s;
 Z.x=(cx-ox)-(cx-ox-Z.x)*k;Z.y=(cy-oy)-(cy-oy-Z.y)*k;Z.s=s2;limZ();}
function limZ(){if(Z.s<=1.001){Z.s=1;Z.x=Z.y=0;}else{const wr=$('#wrap'),lx=wr.offsetWidth*Z.s/2,ly=wr.offsetHeight*Z.s/2;Z.x=clamp(Z.x,-lx,lx);Z.y=clamp(Z.y,-ly,ly);}applyZ();}
const stg=$('#editStage');stg.style.touchAction='none';
const gm=()=>{const a=[...PT.values()];return{x:(a[0].x+a[1].x)/2,y:(a[0].y+a[1].y)/2,d:Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y)||1};};
let gest=0;stg.addEventListener('pointerdown',e=>{PT.set(e.pointerId,{x:e.clientX,y:e.clientY});if(PT.size>=2){gest=1;E.cur=null;redrawOv();e.stopPropagation();if(PT.size===2)zp=gm();}else if(E.tab==='pMarkup'&&E.tool==='hand')e.stopPropagation();},true);
stg.addEventListener('pointermove',e=>{const q=PT.get(e.pointerId);if(!q)return;const ox=q.x,oy=q.y;q.x=e.clientX;q.y=e.clientY;
 if(PT.size===2&&zp){const g=gm();zoomAt(g.x,g.y,Z.s*g.d/zp.d);Z.x+=g.x-zp.x;Z.y+=g.y-zp.y;limZ();zp=g;e.stopPropagation();e.preventDefault();}
 else if(PT.size===1&&Z.s>1&&!window.__lsel&&(E.tab!=='pMarkup'||E.tool==='hand')){Z.x+=e.clientX-ox;Z.y+=e.clientY-oy;limZ();}},true);
['pointerup','pointercancel'].forEach(ev=>stg.addEventListener(ev,e=>{if(gest){e.stopPropagation();E.cur=null;}PT.delete(e.pointerId);zp=null;if(!PT.size){gest=0;redrawOv();}},true));
stg.addEventListener('wheel',e=>{e.preventDefault();zoomAt(e.clientX,e.clientY,Z.s*Math.exp(-e.deltaY*.0015));},{passive:false});
stg.addEventListener('dblclick',resetZ);
try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist();}catch(e){}

/* ===== v3: text enhance, signature, PIN lock, error log ===== */
const AR=()=>lang==='ar';
function applyInk(ctx,w,h,lv){const im=ctx.getImageData(0,0,w,h),d=im.data,o=new Uint8ClampedArray(d),k=lv>1?1.1:.6,r=w*4;
 for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){const i=(y*w+x)*4;for(let c=0;c<3;c++){const j=i+c;o[j]=d[j]*(1+4*k)-k*(d[j-4]+d[j+4]+d[j-r]+d[j+r]);}}
 if(lv>1)for(let i=0;i<o.length;i+=4)for(let c=0;c<3;c++){const v=o[i+c];o[i+c]=v>=215?255:v<=90?v*.75:67.5+(v-90)*1.5;}
 im.data.set(o);ctx.putImageData(im,0,0);}
$('#pAdjust').insertAdjacentHTML('beforeend','<div class="fld"><span class="l">'+(AR()?'تحسين النص':'Text enhance')+'</span><div class="chips" id="inkRow"><button class="chip" data-v="0">'+(AR()?'بدون':'Off')+'</button><button class="chip" data-v="1">'+(AR()?'حدّة':'Sharpen')+'</button><button class="chip" data-v="2">'+(AR()?'حبر قوي':'Strong ink')+'</button></div></div>');
$('#inkRow').onclick=e=>{const b=e.target.closest('.chip'),p=E.page;if(!b||!p)return;p.ink=+b.dataset.v;syncControls();renderEdit();};
function sigDraw(ctx,w,h,a){const S=a.s*w,ox=a.x*w-S/2,oy=a.y*h-a.r*S/2;ctx.save();ctx.strokeStyle=a.c;ctx.lineWidth=Math.max(1.5,S*.014);ctx.lineCap=ctx.lineJoin='round';
 for(const st of a.st){ctx.beginPath();st.forEach((q,i)=>i?ctx.lineTo(ox+q[0]*S,oy+q[1]*S):ctx.moveTo(ox+q[0]*S,oy+q[1]*S));if(st.length===1)ctx.lineTo(ox+st[0][0]*S+.1,oy+st[0][1]*S);ctx.stroke();}ctx.restore();}
function getSig(){try{return JSON.parse(localStorage.getItem('tx_sig'));}catch(e){return null;}}
function placeSig(pt){const g=getSig();if(!g){setTimeout(()=>sigPad(pt),0);return;}const a={t:'sig',id:newId(),x:pt[0],y:pt[1],s:.28,r:g.r,st:g.st,c:E.color==='#FFD60A'?'#111111':E.color};addAnn(a);setTimeout(()=>sgOpen(a),0);}
function sigPad(pt,upd){if(document.getElementById('sgPad'))return;const ar=AR(),m=document.createElement('div');m.id='sgPad';m.className='mdl-bd';
 m.innerHTML='<div class="mdl" role="dialog" aria-modal="true"><div class="grab"></div><div class="mdl-h"><div class="mdl-ic">'+'<svg class="i" style="width:20px;height:20px"><use href="#i-pen"/></svg>'+'</div><div class="mdl-t">'+(ar?'التوقيع':'Signature')+'<small>'+(ar?'بيتحفظ على جهازك بس وتقدر تغيّره في أي وقت':'Saved on this device only, change it anytime')+'</small></div><button type="button" class="mdl-x" data-a="x" aria-label="'+(ar?'إغلاق':'Close')+'">'+'<svg class="i" style="width:20px;height:20px"><use href="#i-cross"/></svg>'+'</button></div><div class="sig-pad"><canvas class="sig-cv" width="600" height="300"></canvas><div class="ln"></div><div class="xm">×</div><div class="hn">'+(ar?'وقّع هنا بإصبعك':'Sign here with your finger')+'</div></div><div class="acts"><button type="button" class="chip" data-a="c">'+(ar?'مسح':'Clear')+'</button><button type="button" class="chip on" data-a="s">'+(ar?'حفظ التوقيع':'Save signature')+'</button></div></div>';
 document.body.appendChild(m);const c=m.querySelector('canvas'),x=c.getContext('2d'),hn=m.querySelector('.hn');let st=[],cur=null;x.lineWidth=4.5;x.lineCap=x.lineJoin='round';x.strokeStyle='#111';
 const P=e=>{const r=c.getBoundingClientRect();return[(e.clientX-r.left)/r.width*c.width,(e.clientY-r.top)/r.height*c.height];};
 c.onpointerdown=e=>{c.setPointerCapture(e.pointerId);hn.hidden=true;cur=[P(e)];st.push(cur);};
 c.onpointermove=e=>{if(!cur)return;const q=P(e),l=cur[cur.length-1];cur.push(q);x.beginPath();x.moveTo(l[0],l[1]);x.lineTo(q[0],q[1]);x.stroke();};
 c.onpointerup=c.onpointercancel=()=>{cur=null;};
 m.onclick=e=>{if(e.target===m){m.remove();return;}const t=e.target.closest('[data-a]'),a=t&&t.dataset.a;if(!a)return;if(a==='c'){st=[];x.clearRect(0,0,c.width,c.height);hn.hidden=false;return;}
  if(a==='s'){if(!st.length){hn.hidden=false;return;}let X=1e9,Y=1e9,X2=-1e9,Y2=-1e9;st.forEach(s=>s.forEach(q=>{X=Math.min(X,q[0]);Y=Math.min(Y,q[1]);X2=Math.max(X2,q[0]);Y2=Math.max(Y2,q[1]);}));
   const W=Math.max(1,X2-X),H=Math.max(1,Y2-Y);localStorage.setItem('tx_sig',JSON.stringify({r:H/W,st:st.map(s=>s.map(q=>[+((q[0]-X)/W).toFixed(4),+((q[1]-Y)/W).toFixed(4)]))}));if(!pt&&!upd)toast(AR()?'اتحفظ التوقيع، المس الصفحة لإضافته':'Saved. Tap the page to place it');}
  m.remove();if(a==='s'){const g=getSig();if(g&&upd){upd.st=g.st;upd.r=g.r;redrawOv();}else if(g&&pt)setTimeout(()=>placeSig(pt),0);}};}
function sgClose(){const d=document.getElementById('sgD');if(!d)return;const a=d._a,p=d._pg,sn=d._sn;d.remove();
 if(a&&p&&sn&&(a.x!==sn.x||a.y!==sn.y||a.s!==sn.s||a.c!==sn.c)){p.hist.push({k:'mod',a,b:sn,n:{x:a.x,y:a.y,s:a.s,c:a.c}});p.fut.length=0;}
 if(E.sel===a)E.sel=null;try{Z.lift=0;applyZ();}catch(_){}redrawOv();syncControls();}
function sgOpen(a){const old=document.getElementById('sgD');if(old&&old._a===a)return;if(old)sgClose();const ar=AR(),m=document.createElement('div');m.id='sgD';m.className='tbar txdock';m._a=a;m._pg=E.page;m._sn={x:a.x,y:a.y,s:a.s,c:a.c};E.sel=a;
 m.innerHTML='<div class="txcap">'+(ar?'التوقيع · اسحبه لتحريكه':'Signature · drag it to move')+'</div><label class="sgz"><span>'+(ar?'الحجم':'Size')+'</span><input type="range" min="6" max="80" step="1"><b></b></label><div class="txr2 sgc"></div><div class="txr2"><button type="button" class="txc" data-x="r">'+(ar?'رسم تاني':'Redraw')+'</button><span style="flex:1"></span><button type="button" class="txc" data-x="d" aria-label="'+(ar?'حذف':'Delete')+'"><svg class="i" style="width:18px;height:18px"><use href="#i-trash"/></svg></button><button type="button" class="txc pri" data-x="k">'+(ar?'تم':'Done')+'</button></div>';
 document.body.appendChild(m);const rg=m.querySelector('input[type=range]'),vb=m.querySelector('.sgz b'),cr=m.querySelector('.sgc');
 const sy=()=>{rg.value=Math.round(a.s*100);vb.textContent=Math.round(a.s*100)+'%';cr.querySelectorAll('.tfc').forEach(b=>b.classList.toggle('on',b.dataset.c.toLowerCase()===String(a.c).toLowerCase()));};
 ['#111111','#0B3D91','#1B63F0','#C62828','#12A150'].forEach(c=>{const b=document.createElement('button');b.type='button';b.className='tfc';b.style.background=c;b.dataset.c=c;b.setAttribute('aria-label',c);b.onclick=()=>{a.c=c;sy();redrawOv();};cr.appendChild(b);});
 rg.oninput=()=>{a.s=rg.value/100;vb.textContent=rg.value+'%';redrawOv();};rg.onchange=()=>m._rv();
 m._rv=()=>{const rc=$('#ov').getBoundingClientRect(),S=a.s*rc.width,bh=a.r*S,cy=rc.top+a.y*rc.height;txRevealRect(cy-bh/2,cy+bh/2);};
 m.onclick=e=>{const b=e.target.closest('[data-x]');if(!b)return;const x=b.dataset.x;if(x==='k')sgClose();else if(x==='r')sigPad(null,a);else if(x==='d'){const p=E.page,i=p.ann.indexOf(a);if(i>=0){p.ann.splice(i,1);p.hist.push({k:'del',a,i});p.fut.length=0;}m._sn=null;sgClose();}};
 sy();redrawOv();setTimeout(m._rv,60);setTimeout(m._rv,420);}
setInterval(()=>{const d=document.getElementById('sgD');if(d&&(E.page!==d._pg||E.tab!=='pMarkup'||E.tool!=='sign'))sgClose();},400);
$('#toolRow').addEventListener('click',e=>{const b=e.target.closest('.tool');if(b&&b.dataset.k==='sign'&&!getSig())setTimeout(()=>sigPad(),60);});
$('#toolRow').addEventListener('dblclick',e=>{const b=e.target.closest('.tool');if(b&&b.dataset.k==='sign'){localStorage.removeItem('tx_sig');sigPad();}});
(function(){const L=localStorage,K='tx_pin',KB='tx_bio',tt=(a,c)=>AR()?a:c,
 h=async v=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode('tx|'+v)))].map(b=>b.toString(16).padStart(2,'0')).join(''),
 b64=u=>btoa(String.fromCharCode(...u)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,''),
 unb=t=>Uint8Array.from(atob(t.replace(/-/g,'+').replace(/_/g,'/')+'='.repeat((4-t.length%4)%4)),c=>c.charCodeAt(0)),
 rnd=n=>crypto.getRandomValues(new Uint8Array(n)),
 hasPin=()=>!!L.getItem(K),hasBio=()=>!!L.getItem(KB),locked=()=>hasPin()||hasBio();
 /* biometrics = WebAuthn platform authenticator (fingerprint / face / device screen-lock), nothing leaves the phone */
 const bioOK=async()=>{try{return !!(window.PublicKeyCredential&&navigator.credentials&&await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable());}catch(e){return false;}};
 const bioReg=async()=>{try{const c=await navigator.credentials.create({publicKey:{challenge:rnd(32),rp:{name:'Timaxo Scan'},user:{id:rnd(16),name:'timaxo',displayName:'Timaxo'},pubKeyCredParams:[{type:'public-key',alg:-7},{type:'public-key',alg:-257}],authenticatorSelection:{authenticatorAttachment:'platform',userVerification:'required',residentKey:'discouraged'},timeout:60000,attestation:'none'}});
  if(!c)return false;L.setItem(KB,b64(new Uint8Array(c.rawId)));return true;}catch(e){return false;}};
 const bioAuth=async()=>{try{const id=L.getItem(KB);if(!id)return false;const r=await navigator.credentials.get({publicKey:{challenge:rnd(32),allowCredentials:[{type:'public-key',id:unb(id)}],userVerification:'required',timeout:60000}});return !!r;}catch(e){return false;}};
 const ov=document.createElement('div');ov.style.cssText='position:fixed;inset:0;z-index:99999;background:radial-gradient(circle at 50% 18%,#1a3a7a 0%,#0a1230 55%,#060a18 100%);color:#fff;display:none;flex-direction:column;align-items:center;justify-content:center;gap:18px;font:700 18px system-ui;padding:24px;box-sizing:border-box;text-align:center';
 ov.innerHTML='<div style="display:flex;flex-direction:column;align-items:center;gap:12px;margin-bottom:6px"><span style="width:92px;height:92px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(135deg,#4a86ff,#22d3f5);box-shadow:0 14px 40px -10px rgba(34,211,245,.7),0 0 0 8px rgba(255,255,255,.07)"><svg viewBox="0 0 24 24" width="42" height="42" fill="none" stroke="#031033" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="10.5" width="16" height="10" rx="3"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/><circle cx="12" cy="15.5" r="1.3" fill="#031033"/></svg></span><span style="font:800 13px system-ui;letter-spacing:2px;opacity:.7">TIMAXO SCAN</span></div><div style="font:800 22px system-ui"></div><button type="button" style="display:none;align-items:center;justify-content:center;gap:10px;min-width:230px;padding:15px 28px;border-radius:18px;border:0;background:linear-gradient(135deg,#4a86ff,#22d3f5);color:#031033;font:800 16px system-ui;box-shadow:0 12px 28px -10px rgba(34,211,245,.8)"></button><input type="password" inputmode="numeric" maxlength="8" autocomplete="off" style="font:700 30px system-ui;text-align:center;width:min(240px,80vw);padding:12px;border-radius:18px;border:1.5px solid rgba(255,255,255,.22);background:rgba(255,255,255,.09);color:#fff;letter-spacing:12px;outline:none"><div style="color:#ff9a90;min-height:22px;font:600 14px system-ui"></div>';
 document.body.appendChild(ov);const[,ti,bb,inp,er]=ov.children;
 const open=()=>{ov.style.display='none';};
 const tryBio=async()=>{if(!hasBio())return;if(await bioAuth())open();else er.textContent=tt('البصمة ماتأكدتش','Fingerprint not verified');};
 const show=()=>{ov.style.display='flex';ti.textContent=hasPin()?tt('أدخل الرقم السري','Enter PIN'):tt('افتح بالبصمة','Unlock with fingerprint');
  inp.style.display=hasPin()?'':'none';bb.style.display=hasBio()?'flex':'none';bb.innerHTML='<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4"/><path d="M14 13.12c0 2.38 0 6.38-1 8.88"/><path d="M2 12a10 10 0 0 1 18-6"/><path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2"/><path d="M9 6.8a6 6 0 0 1 9 5.2v2"/></svg><span>'+tt('افتح بالبصمة','Use fingerprint')+'</span>';inp.value='';er.textContent='';
  if(hasPin())setTimeout(()=>{if(!hasBio())inp.focus();},60);if(hasBio())setTimeout(tryBio,250);};
 bb.onclick=tryBio;
 const chk=async()=>{if(inp.value.length>=4&&await h(inp.value)===L.getItem(K)){open();return true;}return false;};
 inp.oninput=chk;inp.onkeydown=async e=>{if(e.key==='Enter'&&!await chk()){er.textContent=tt('رقم خاطئ','Wrong PIN');inp.value='';}};
 /* settings sheet: PIN / fingerprint / both / none — asks for current auth before changing anything */
 const verify=async()=>{if(!locked())return true;if(hasPin()){const v=prompt(tt('أدخل الرقم السري الحالي','Enter current PIN'));return !!v&&await h(v)===L.getItem(K);}return await bioAuth();};
 const sheet=()=>{const bg=document.createElement('div');bg.style.cssText='position:fixed;inset:0;z-index:99990;background:rgba(0,0,0,.5);display:flex;align-items:flex-end;justify-content:center';
  const bx=document.createElement('div');bx.style.cssText='background:var(--surface,#fff);color:var(--ink,#071a4d);width:min(460px,100%);border-radius:26px 26px 0 0;padding:20px 16px calc(env(safe-area-inset-bottom,0px) + 18px);font:600 15px system-ui;display:flex;flex-direction:column;gap:10px;box-shadow:0 -10px 40px rgba(0,0,0,.3)';
  bg.appendChild(bx);bg.onclick=e=>{if(e.target===bg)bg.remove();};document.body.appendChild(bg);
  const SV={pin:'<rect x="3" y="3" width="18" height="18" rx="5"/><path d="M12 8v8M8.5 14l7-4M8.5 10l7 4"/>',bio:'<path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4"/><path d="M14 13.12c0 2.38 0 6.38-1 8.88"/><path d="M17.29 21.02c.12-.6.43-2.3.5-3.02"/><path d="M2 12a10 10 0 0 1 18-6"/><path d="M2 16h.01"/><path d="M21.8 16c.2-2 .131-5.354 0-6"/><path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2"/><path d="M8.65 22c.21-.66.45-1.32.57-2"/><path d="M9 6.8a6 6 0 0 1 9 5.2v2"/>'};
  const row=(txt,on,fn)=>{const b=document.createElement('button');b.type='button';const i=txt.indexOf(' '),ic=txt.slice(0,i),lb=txt.slice(i+1),isPin=ic==='🔢',sub=isPin?tt('4 إلى 8 أرقام بتكتبها عند الفتح','4-8 digits typed on open'):tt('بصمة أو وجه أو قفل شاشة الجهاز','Fingerprint, face or device screen lock'),c1=isPin?'#ff5f8d':'#3b82f6',c2=isPin?'#ff9a5c':'#22d3f5';
   b.style.cssText='display:flex;align-items:center;gap:14px;padding:14px;border-radius:20px;border:1.5px solid '+(on?c1:'var(--line,#8883)')+';background:'+(on?'color-mix(in srgb,'+c1+' 10%,var(--surface2,#f1f3f7))':'var(--surface2,#f1f3f7)')+';color:inherit;font:inherit;text-align:start;width:100%;transition:border-color .2s,background .2s';
   b.innerHTML='<span style="width:52px;height:52px;border-radius:17px;display:grid;place-items:center;flex:none;color:#fff;background:linear-gradient(135deg,'+c1+','+c2+');box-shadow:0 10px 20px -8px '+c1+'"><svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+SV[isPin?'pin':'bio']+'</svg></span><span style="flex:1;min-width:0"><b style="display:block;font:800 15.5px system-ui">'+lb+'</b><small style="display:block;font:500 12px/1.4 system-ui;opacity:.65;margin-top:3px">'+sub+'</small></span><span style="flex:none;width:50px;height:30px;border-radius:999px;position:relative;background:'+(on?'linear-gradient(135deg,'+c1+','+c2+')':'#8886')+';transition:background .2s"><i style="position:absolute;top:3px;'+(on?'inset-inline-end:3px':'inset-inline-start:3px')+';width:24px;height:24px;border-radius:50%;background:#fff;box-shadow:0 2px 6px rgba(0,0,0,.3)"></i></span>';b.onclick=fn;bx.appendChild(b);};
  const draw=()=>{bx.innerHTML='';const t=document.createElement('div');t.style.cssText='font:800 19px system-ui;margin:4px 2px 6px';t.textContent=tt('قفل التطبيق','App lock');bx.appendChild(t);
   row('🔢 '+tt('رقم سري','PIN code'),hasPin(),async()=>{if(hasPin()){if(!hasBio()||await verify()){if(hasBio()||await verify()){L.removeItem(K);toast(tt('اتلغى الرقم السري','PIN removed'));draw();}}}
     else{const v=prompt(tt('اختر رقم سري (4 إلى 8 أرقام)','Choose a PIN (4-8 digits)'));if(v&&/^\d{4,8}$/.test(v)){const v2=prompt(tt('أعد كتابة الرقم للتأكيد','Re-enter the PIN to confirm'));if(v2===v){L.setItem(K,await h(v));toast(tt('الرقم السري اتفعّل','PIN enabled'));draw();}else toast(tt('الرقمين مش متطابقين','PINs do not match'));}}});
   row('👆 '+tt('بصمة / قفل الجهاز','Fingerprint / device lock'),hasBio(),async()=>{if(hasBio()){if(await verify()){L.removeItem(KB);toast(tt('اتلغت البصمة','Fingerprint removed'));draw();}}
     else{if(!await bioOK()){toast(tt('الجهاز أو المتصفح مش بيدعم البصمة هنا','Biometrics not supported here'));return;}if(await bioReg()){toast(tt('البصمة اتفعّلت','Fingerprint enabled'));draw();}else toast(tt('ماتمش تفعيل البصمة','Fingerprint setup failed'));}});
   const n=document.createElement('div');n.style.cssText='font:500 12px system-ui;opacity:.65;line-height:1.5';n.textContent=tt('تقدر تفعّل الاتنين مع بعض. القفل بيحمي فتح التطبيق على الجهاز ده.','You can enable both. The lock protects opening the app on this device.');bx.appendChild(n);
   const c=document.createElement('button');c.type='button';c.textContent=tt('تم','Done');c.style.cssText='padding:14px;border-radius:16px;border:0;background:linear-gradient(135deg,#4a86ff,#22d3f5);color:#031033;font:800 15px system-ui;margin-top:4px';c.onclick=()=>bg.remove();bx.appendChild(c);};draw();};
 const b=document.createElement('button');b.type='button';b.className='ib';b.id='setBtn';b.setAttribute('aria-label',tt('الإعدادات','Settings'));
 b.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>';
 const openLock=async()=>{if(locked()&&!await verify()){toast(tt('ماتأكدش','Not verified'));return;}sheet();};
 b.addEventListener('click',()=>{
  const ex=document.getElementById('mrBg');if(ex){ex._close&&ex._close();return;}
  const old=document.getElementById('mrcss');if(old)old.remove();
  if(!document.getElementById('mrcss2')){const s=document.createElement('style');s.id='mrcss2';s.textContent=`
#mrBg{position:fixed;inset:0;z-index:99990;display:flex;align-items:flex-end;justify-content:center;-webkit-tap-highlight-color:transparent;pointer-events:auto}
#mrBg .scrim{position:absolute;inset:0;background:rgba(3,8,24,0);transition:background .18s ease-out}
#mrBg.in .scrim{background:rgba(3,8,24,.52)}
#mrBg.under .scrim{background:rgba(3,8,24,.62)}
#mrBx{position:relative;background:var(--surface,#fff);color:var(--ink,#071a4d);width:min(480px,calc(100% - 20px));max-height:calc(100% - 96px);margin:0 10px calc(env(safe-area-inset-bottom,0px) + 10px);overflow-y:auto;overscroll-behavior:contain;border-radius:30px;padding:0 14px 20px;font:600 14px var(--fb,system-ui);box-shadow:0 14px 36px -12px rgba(0,0,0,.55),0 0 0 1px color-mix(in srgb,currentColor 9%,transparent);transform:scale(.08);opacity:0;will-change:transform,opacity;touch-action:pan-y;scrollbar-width:none;transition:transform .26s cubic-bezier(.2,.9,.3,1),opacity .14s ease-out}
#mrBx::-webkit-scrollbar{display:none}
#mrBg.in #mrBx{transform:none;opacity:1}
#mrBg:not(.in) #mrBx{transition:transform .18s cubic-bezier(.4,0,1,1),opacity .14s ease-in}
#mrBg.under #mrBx{transform:scale(.96) translateY(-8px);opacity:.6;pointer-events:none;overflow:hidden}
#mrBx .mh{position:sticky;top:0;z-index:3;display:flex;align-items:center;gap:12px;padding:16px 2px 12px;margin:0 -2px;background:var(--surface,#fff)}
#mrBx .mi{width:44px;height:44px;border-radius:15px;flex:none;display:grid;place-items:center;color:#fff;background:linear-gradient(135deg,#1f6bff,#22d3f5);box-shadow:0 8px 18px -8px #1f6bff}
#mrBx .mi svg{width:24px;height:24px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
#mrBx .tt{flex:1;min-width:0}
#mrBx .tt h3{margin:0;font:800 20px/1.2 var(--fb,system-ui)}
#mrBx .tt p{margin:2px 0 0;font:500 12.5px/1.3 var(--fb,system-ui);opacity:.6}
#mrBx .mx{flex:none;width:36px;height:36px;border-radius:50%;border:0;display:grid;place-items:center;color:inherit;background:color-mix(in srgb,currentColor 9%,transparent);cursor:pointer;transition:transform .12s}
#mrBx .mx:active{transform:scale(.9)}
#mrBx .mx svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round}
#mrBx .gl{margin:18px 8px 7px;font:700 11.5px var(--fb,system-ui);letter-spacing:.4px;opacity:.55}
#mrBx .lst{border-radius:20px;background:color-mix(in srgb,currentColor 5.5%,var(--surface,#fff));border:1px solid color-mix(in srgb,currentColor 8%,transparent);overflow:hidden;animation:mrUp .22s both}
#mrBx.st .lst{animation:none}
#mrBx .rw{--c:#1b63f0;all:unset;box-sizing:border-box;display:flex;align-items:center;gap:12px;width:100%;padding:11px 13px;min-height:58px;cursor:pointer;position:relative;-webkit-tap-highlight-color:transparent;transition:background .15s}
#mrBx .rw+.rw::before,#mrBx .sgw+.rw::before{content:"";position:absolute;inset-inline-start:61px;inset-inline-end:0;top:0;height:1px;background:color-mix(in srgb,currentColor 9%,transparent)}
#mrBx .rw:active{background:color-mix(in srgb,currentColor 8%,transparent)}
#mrBx .rw:focus-visible{outline:2px solid var(--c);outline-offset:-2px}
#mrBx .rw.flash{animation:mrFl 1.4s ease-out}
#mrBx .ri{width:36px;height:36px;border-radius:11px;flex:none;display:grid;place-items:center;color:#fff;background:linear-gradient(145deg,color-mix(in srgb,var(--c) 82%,#fff),var(--c));box-shadow:0 5px 12px -6px var(--c)}
#mrBx .ri svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
#mrBx .rt{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}
#mrBx .rt b{font:700 15px/1.3 var(--fb,system-ui)}
#mrBx .rt small{font:500 12px/1.35 var(--fb,system-ui);opacity:.58}
#mrBx .vl{flex:none;font:600 13px var(--fb,system-ui);opacity:.6;max-width:44%;text-align:end}
#mrBx .vl.ok{color:var(--c);opacity:1}
#mrBx .cv{flex:none;width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round;opacity:.35}
#mrBx[dir=rtl] .cv{transform:scaleX(-1)}
#mrBx .tsw{flex:none;width:48px;height:29px;border-radius:99px;position:relative;background:color-mix(in srgb,currentColor 20%,transparent);transition:background .22s}
#mrBx .tsw i{position:absolute;top:3px;inset-inline-start:3px;width:23px;height:23px;border-radius:50%;background:#fff;box-shadow:0 2px 6px rgba(0,0,0,.3);transition:inset-inline-start .22s cubic-bezier(.3,1.3,.5,1)}
#mrBx .tsw.on{background:var(--c)}
#mrBx .tsw.on i{inset-inline-start:22px}
#mrBx .sgw{padding:0 13px 13px}
#mrBx .sg{display:flex;gap:4px;padding:3px;border-radius:13px;background:color-mix(in srgb,currentColor 9%,transparent)}
#mrBx .sg button{all:unset;box-sizing:border-box;flex:1;text-align:center;padding:9px 4px;border-radius:10px;font:700 12.5px/1.2 var(--fb,system-ui);cursor:pointer;opacity:.7;transition:background .18s,color .18s,opacity .18s,box-shadow .18s;-webkit-tap-highlight-color:transparent}
#mrBx .sg button.on{background:var(--c);color:#fff;opacity:1;box-shadow:0 4px 10px -4px var(--c)}
#mrBx .rw.hd2{cursor:default}
#mrBx .rw.hd2:active{background:none}
#mrBx .ver{text-align:center;margin:18px 0 2px;font:500 11.5px var(--fb,system-ui);opacity:.45}
@keyframes mrUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
@keyframes mrFl{0%,60%{background:color-mix(in srgb,var(--c) 24%,transparent)}100%{background:transparent}}
.txls .bx{width:min(480px,calc(100% - 20px))!important;margin:0 10px calc(env(safe-area-inset-bottom,0px) + 10px);border-radius:30px!important;border-bottom:1px solid var(--line)!important;max-height:calc(100% - 96px);overflow-y:auto}
.txls{z-index:100050!important;background:rgba(3,8,24,.42)!important;}
html body #vHome .top .hdock>#setBtn svg{transition:transform .6s cubic-bezier(.3,1.35,.5,1)}
html body #vHome .top .hdock>#setBtn.open svg{transform:rotate(180deg)}
html:root body #vHome .top .hdock>#setBtn.open{background:color-mix(in srgb,currentColor 16%,transparent)!important;box-shadow:0 0 0 1.5px color-mix(in srgb,currentColor 35%,transparent)!important}
@media (prefers-reduced-motion:reduce){#mrBx,#mrBg .scrim{transition:opacity .15s!important}#mrBx .lst{animation:none}#mrBx .tsw i,#mrBx .tsw,#setBtn svg{transition:none!important}}
`;document.head.appendChild(s);}
  const P={
    ai:'<path d="M11 3l1.9 5.6 5.6 1.9-5.6 1.9L11 18l-1.9-5.6L3.5 10.5l5.6-1.9z"/><path d="M19 14.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9z"/>',
    bulb:'<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
    txt:'<path d="M4 7V5h16v2M12 5v14M9 19h6"/>',
    lock:'<rect x="5" y="11" width="14" height="9" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    snd:'<path d="M11 5L6 9H3v6h3l5 4zM16 9a4 4 0 0 1 0 6M19 7a7 7 0 0 1 0 10"/>',
    ocr:'<path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2M8 9h8M8 12.5h8M8 16h5"/>',
    idx:'<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.2-4.2M9 11h4M11 9v4"/>',
    off:'<path d="M7 18a4 4 0 0 1-.5-7.97A6 6 0 0 1 18 9.5 4 4 0 0 1 17 18"/><path d="M12 11v7M9 15l3 3 3-3"/>',
    lib:'<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    lng:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
    rot:'<rect x="2.5" y="7" width="19" height="10" rx="2.5"/><path d="M18.5 12h.01M7 3.6A9 9 0 0 1 12 2.2M17 20.4a9 9 0 0 1-5 1.4"/>',
    thm:'<circle cx="12" cy="12" r="9"/><path d="M12 3v18" /><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" fill-opacity=".35"/>',
    inst:'<path d="M12 4v11M7.5 11 12 15.5 16.5 11M5 20h14"/>',
    shield:'<path d="M12 3l7 3v5c0 4.4-2.9 8.3-7 10-4.1-1.7-7-5.6-7-10V6z"/><path d="M9 12l2 2 4-4"/>'};
  const bg=document.createElement('div');bg.id='mrBg';
  const scrim=document.createElement('div');scrim.className='scrim';
  const bx=document.createElement('div');bx.id='mrBx';bx.setAttribute('role','dialog');bx.setAttribute('aria-modal','true');bg.append(scrim,bx);
  const place=()=>{const r=b.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;bg.style.setProperty('--ix',cx+'px');bg.style.setProperty('--iy',cy+'px');bx.style.transformOrigin=(cx-bx.offsetLeft)+'px '+(cy-bx.offsetTop)+'px';};
  let mo=null,lo=null;
  const onKey=e=>{if(e.key==='Escape'&&!bg.classList.contains('under'))close();};
  const close=()=>{if(bg._closing)return;bg._closing=1;b.classList.remove('open');place();bg.classList.remove('in');document.removeEventListener('keydown',onKey);try{mo&&mo.disconnect();lo&&lo.disconnect();}catch(e){}setTimeout(()=>bg.remove(),230);};
  bg._close=close;
  bg.addEventListener('click',e=>{if(!bx.contains(e.target))close();});
  /* swipe: sideways or down = collapse back into the gear */
  let x0=null,y0=0;bx.addEventListener('touchstart',e=>{x0=e.touches[0].clientX;y0=e.touches[0].clientY;},{passive:true});
  bx.addEventListener('touchend',e=>{if(x0===null)return;const dx=e.changedTouches[0].clientX-x0,dy=e.changedTouches[0].clientY-y0;x0=null;if((Math.abs(dx)>80&&Math.abs(dx)>1.6*Math.abs(dy))||(dy>80&&bx.scrollTop<=0&&dy>1.6*Math.abs(dx)))close();},{passive:true});
  const rd=(k,d)=>{try{const v=localStorage.getItem(k);return v===null?d:v}catch(e){return d}},wr=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
  const APPV='174';
  function build(first){
   const ar=AR(),T=(a,c)=>ar?a:c;let gi=0;
   bx.dir=ar?'rtl':'ltr';bx.setAttribute('aria-label',T('الإعدادات','Settings'));bx.classList.toggle('st',!first);
   bx.innerHTML='<div class="mh"><span class="mi"><svg viewBox="0 0 24 24"><path d="M4 6h10M18 6h2M4 12h2M10 12h10M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="8" cy="12" r="2"/><circle cx="18" cy="18" r="2"/></svg></span><div class="tt"><h3>'+T('الإعدادات','Settings')+'</h3><p>'+T('خصّص Timaxo بالشكل اللي يريحك','Make Timaxo work your way')+'</p></div><button type="button" class="mx" aria-label="'+T('إغلاق','Close')+'"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>';
   bx.querySelector('.mx').onclick=close;
   const grp=(txt)=>{const h=document.createElement('div');h.className='gl';h.textContent=txt;bx.appendChild(h);const l=document.createElement('div');l.className='lst';l.style.animationDelay=(gi++*22)+'ms';bx.appendChild(l);return l;};
   const OnOff=v=>v?T('مفعّل','On'):T('متوقف','Off');
   const row=(g,o)=>{const x=document.createElement('button');x.type='button';x.className='rw';x.style.setProperty('--c',o.c);if(o.id)x.dataset.id=o.id;
    x.innerHTML='<span class="ri"><svg viewBox="0 0 24 24">'+P[o.ic]+'</svg></span><span class="rt"><b>'+o.t+'</b>'+(o.s?'<small>'+o.s+'</small>':'')+'</span>'+(o.tog?'<span class="tsw'+(o.on?' on':'')+'"><i></i></span>':(o.v!=null?'<span class="vl'+(o.ok?' ok':'')+'">'+o.v+'</span>':'')+(o.nochev?'':'<svg class="cv" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>'));
    if(o.tog){x.setAttribute('role','switch');x.setAttribute('aria-checked',String(!!o.on));}
    x.onclick=()=>{if(o.keep)o.fn(x);else{close();setTimeout(o.fn,200);}};g.appendChild(x);return x;};
   const setOn=(x,v)=>{x.querySelector('.tsw').classList.toggle('on',!!v);x.setAttribute('aria-checked',String(!!v));};
   const setVal=(x,t,ok)=>{const e=x.querySelector('.vl');if(e){e.textContent=t;e.classList.toggle('ok',!!ok);}};
   const seg=(g,o)=>{const w=document.createElement('div');w.style.setProperty('--c',o.c);
    w.innerHTML='<div class="rw hd2" style="--c:'+o.c+'"><span class="ri"><svg viewBox="0 0 24 24">'+P[o.ic]+'</svg></span><span class="rt"><b>'+o.t+'</b>'+(o.s?'<small>'+o.s+'</small>':'')+'</span></div><div class="sgw"><div class="sg" role="radiogroup"></div></div>';
    const sg=w.querySelector('.sg');
    const paint=k=>sg.querySelectorAll('button').forEach(e=>{const on=e.dataset.k===k;e.classList.toggle('on',on);e.setAttribute('aria-checked',String(on));});
    o.opts.forEach(([k,l])=>{const e=document.createElement('button');e.type='button';e.dataset.k=k;e.setAttribute('role','radio');e.textContent=l;e.onclick=ev=>{paint(k);o.fn(k,ev);};sg.appendChild(e);});
    paint(o.cur);g.appendChild(w);return w;};
   /* 1) المظهر واللغة */
   const g0=grp(T('المظهر واللغة','Appearance & language'));
   seg(g0,{ic:'thm',c:'#6366f1',t:T('المظهر','Theme'),cur:document.documentElement.getAttribute('data-theme')||'blue',opts:[['light',T('فاتح','Light')],['blue',T('أزرق','Blue')],['dark',T('داكن','Dark')]],fn:(k,ev)=>{if(window.__txSetTheme)__txSetTheme(k,ev);else{document.documentElement.setAttribute('data-theme',k);wr('tx_theme3',k);}}});
   row(g0,{ic:'lng',c:'#1b9fd0',t:T('اللغة','Language'),s:T('العربية والإنجليزية والفصحى','Arabic, English & formal Arabic'),v:ar?(window.TXMSA&&TXMSA.on()?'العربية الفصحى':'العربية (مصر)'):'English',keep:1,fn:()=>{if(window.TXLANG)TXLANG.pick();else{const l=document.getElementById('langBtn');if(l)l.click();}}});
   const landOn=()=>{try{return window.__txLandOn()}catch(e){return false}};
   row(g0,{ic:'rot',c:'#5b6ee1',t:T('قفل التدوير','Rotation lock'),s:T('تثبيت اتجاه الشاشة','Keep the screen orientation'),tog:1,on:landOn(),keep:1,fn:async(x)=>{
    const want=!landOn(),ok=window.__txLand?await window.__txLand(want):false;
    if(!ok){setOn(x,false);toast(T('القفل مش متاح هنا. ثبّت التطبيق (إضافة للشاشة الرئيسية) وجرّبه من هناك، وعلى iPhone استخدم قفل الدوران من الجهاز','Not available here. Install the app to your home screen and try from there; on iPhone use the device rotation lock'));return;}
    setOn(x,landOn());toast(landOn()?T('التدوير اتقفل على الوضع الحالي','Rotation locked in current orientation'):T('القفل اتفك','Rotation unlocked'));}});
   /* 2) الذكاء */
   TXAI.css();
   const g1=grp(T('الذكاء والمساعدة','Smart features'));
   row(g1,{ic:'ai',c:'#22a7d8',t:T('الكشف الذكي','Smart detection'),s:T('يتعلّم من تعديلاتك على الصور','Learns from your edits'),tog:1,on:TXAI.on(),keep:1,fn:(x)=>{const v=!TXAI.on();TXAI.set(v);setOn(x,v);toast(TXAI.msg(v));}});
   const asg=window.__txAsg||{on:()=>false,set(){},reset(){}};
   row(g1,{ic:'bulb',c:'#f2a413',t:T('مساعد الاقتراحات','Suggestions assistant'),s:T('يقترح أدوات مناسبة للصفحة','Suggests tools that fit the page'),tog:1,on:asg.on(),keep:1,fn:(x)=>{const v=!asg.on();asg.set(v);if(v)asg.reset();setOn(x,v);toast(v?T('مساعد الاقتراحات شغّال','Suggestions assistant is ON'):T('مساعد الاقتراحات متوقف','Suggestions assistant is OFF'));}});
   row(g1,{ic:'txt',c:'#8a5cf0',t:T('اقتراح استخراج النص','Text extraction hint'),s:T('ينبّهك لما الصفحة فيها نص','Hints when a page contains text'),tog:1,on:rd('tx_ohint','1')!=='0',keep:1,fn:(x)=>{const v=rd('tx_ohint','1')==='0';wr('tx_ohint',v?'1':'0');setOn(x,v);}});
   /* 3) الأمان */
   const g2=grp(T('الأمان والخصوصية','Security & privacy'));
   row(g2,{ic:'lock',c:'#e0527a',t:T('قفل التطبيق','App lock'),s:T('رقم سري أو بصمة','PIN or fingerprint'),v:OnOff(locked()),ok:locked(),keep:1,fn:openLock});
   /* 4) الصوت */
   const g3=grp(T('الصوت والاهتزاز','Sound & haptics'));
   seg(g3,{ic:'snd',c:'#e08a1b',t:T('ردود فعل التطبيق','App feedback'),s:T('أصوات الكاميرا والضغط والاهتزاز','Camera, tap sounds and vibration'),cur:(window.__txFX?__txFX.mode():'all'),opts:[['all',T('صوت + اهتزاز','Sound + haptics')],['hap',T('اهتزاز فقط','Haptics only')],['off',T('صامت','Silent')]],fn:k=>{if(window.__txFX){__txFX.set(k);__txFX.play(k==='off'?'tap':'sel');}else{wr('tx_snd',k==='all'?'1':'0');wr('tx_hap',k==='off'?'0':'1');}}});
   /* 5) OCR */
   const g4=grp(T('قراءة النص (OCR)','Text recognition (OCR)'));
   seg(g4,{ic:'ocr',c:'#0891b2',t:T('دقة القراءة','Reading accuracy'),s:T('العالية أدق لكن أبطأ','High is more accurate but slower'),cur:rd('tx_oq','best')==='fast'?'fast':'best',opts:[['best',T('عالية','High')],['fast',T('سريعة','Fast')]],fn:k=>{wr('tx_oq',k);toast(k==='best'?T('نموذج عالي الدقة (أبطأ وأول مرة بينزّل أكبر)','High-accuracy model (slower, larger first download)'):T('نموذج سريع (أقل دقة)','Fast model (less accurate)'));}});
   row(g4,{ic:'idx',c:'#6d5ce8',t:T('فهرسة النص للبحث','Text indexing'),s:T('تتيح البحث جوه محتوى المستندات','Search inside your documents'),tog:1,on:bgOn(),keep:1,fn:(x)=>{
    wr('tx_bgocr',bgOn()?'0':'1');setOn(x,bgOn());
    toast(bgOn()?T('الفهرسة التلقائية شغالة (تحتاج إنترنت)','Auto-index on (needs internet)'):T('الفهرسة التلقائية موقوفة','Auto-index off'));if(bgOn())setTimeout(bgOcr,300);}});
   const offOk=()=>!!rd('tx_offline','');
   row(g4,{ic:'off',c:'#16a34a',t:T('تجهيز الأوفلاين','Prepare offline'),s:T('تحميل محرك القراءة مرة واحدة','Download the reading engine once'),v:offOk()?T('جاهز','Ready'):T('غير جاهز','Not ready'),ok:offOk(),keep:1,fn:async(x)=>{
    if(!navigator.onLine){toast(T('محتاج إنترنت مرة واحدة للتجهيز','Needs internet once to prepare'));return;}
    if(!window.__txWarm){toast(T('الميزة مش متاحة دلوقتي','Not available right now'));return;}
    setVal(x,T('جاري التحميل…','Downloading…'),0);toast(T('بحمّل محرك التعرف على النص مرة واحدة، ممكن ياخد دقيقة','Downloading the text engine once, may take a minute'));
    try{await window.__txWarm();wr('tx_offline',String(Date.now()));setVal(x,T('جاهز','Ready'),1);toast(T('جاهز: الـOCR هيشتغل بدون إنترنت','Ready: OCR will work offline'));}
    catch(e){setVal(x,T('فشل','Failed'),0);toast(T('تعذّر التحميل، جرّب مع إنترنت أقوى','Download failed, try a stronger connection'));}}});
   /* 6) البيانات */
   const g5=grp(T('البيانات','Data'));
   row(g5,{ic:'lib',c:'#1b63f0',t:T('مستنداتي والنسخ الاحتياطي','Documents & backup'),s:T('المكتبة والاستعادة والتصدير','Library, restore and export'),fn:()=>{const l=document.getElementById('libBtn');if(l)l.click();}});
   /* 7) عن التطبيق */
   const ib=document.querySelector('button.inst'),g6=grp(T('عن التطبيق','About'));
   if(ib&&!ib.hidden)row(g6,{ic:'inst',c:'#0ea5e9',t:T('تثبيت التطبيق','Install the app'),s:T('أضفه للشاشة الرئيسية وافتحه أوفلاين','Add to home screen, works offline'),fn:()=>{ib.click();}});
   row(g6,{ic:'shield',c:'#64748b',t:T('سياسة الخصوصية','Privacy policy'),s:T('مستنداتك بتفضل على جهازك','Your documents stay on your device'),fn:()=>{window.__txPriv&&window.__txPriv();}});
   const v=document.createElement('div');v.className='ver';v.textContent='Timaxo · v'+APPV;bx.appendChild(v);
  }
  const refresh=()=>{const sc=bx.scrollTop;build(false);bx.scrollTop=sc;};
  build(true);
  /* layers over settings (language sheet, app-lock sheet): settings stays open, blurs, and comes back when they close */
  const isOv=e=>e!==bg&&e.nodeType===1&&(e.classList.contains('txls')||(e.style&&e.style.position==='fixed'&&e.style.zIndex==='99990'));
  const swipe=el=>{if(el._sw)return;el._sw=1;let sx=0,sy=0;
    el.addEventListener('touchstart',e=>{sx=e.touches[0].clientX;sy=e.touches[0].clientY;},{passive:true});
    el.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy;if(Math.abs(dx)>80&&Math.abs(dx)>1.6*Math.abs(dy)){const c=el.firstElementChild;if(c&&c.animate){c.animate([{transform:'none',opacity:1},{transform:'translateX('+(dx>0?'':'-')+'110%)',opacity:0}],{duration:230,easing:'ease-in',fill:'forwards'});setTimeout(()=>el.click(),210);}else el.click();}},{passive:true});};
  mo=new MutationObserver(()=>{const ovs=[...document.body.children].filter(isOv);ovs.forEach(swipe);const was=bg.classList.contains('under');bg.classList.toggle('under',ovs.length>0);if(was&&!ovs.length&&!bg._closing)setTimeout(refresh,60);});
  mo.observe(document.body,{childList:true});
  let rt=0;lo=new MutationObserver(()=>{clearTimeout(rt);rt=setTimeout(()=>{if(!bg._closing)refresh();},120);});lo.observe(document.documentElement,{attributes:true,attributeFilter:['lang','dir','data-msa']});
  document.addEventListener('keydown',onKey);
  document.body.appendChild(bg);place();b.classList.add('open');
  void bg.offsetWidth;requestAnimationFrame(()=>bg.classList.add('in'));});
 const lb=document.getElementById('langBtn');if(lb&&lb.parentNode)lb.parentNode.insertBefore(b,lb);if(locked())show();
 let hid=0;document.addEventListener('visibilitychange',()=>{if(document.hidden)hid=Date.now();else if(locked()&&hid&&Date.now()-hid>60000)show();});})();
addEventListener('error',e=>{try{const a=JSON.parse(localStorage.getItem('tx_err')||'[]');a.push([Date.now(),String(e.message)]);localStorage.setItem('tx_err',JSON.stringify(a.slice(-20)));}catch(_){}});

/* ===== v4: live camera with auto-detect + auto-capture ===== */
let nat=0;
const camAsk=id=>navigator.mediaDevices.getUserMedia({video:Object.assign(id?{deviceId:{exact:id}}:{facingMode:{ideal:'environment'}},{width:{ideal:1920},height:{ideal:1440},frameRate:{ideal:30,max:30}}),audio:false});
const camOpen=()=>camAsk(localStorage.getItem('tx_lens')).catch(()=>camAsk(null));
let camP=null,camT=0;
document.addEventListener('pointerdown',e=>{try{if(nat||camP||document.getElementById('lv')||!(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia))return;
 if(!e.target.closest||!e.target.closest('#scanBtn,#emCam,.add,#libNew'))return;
 camT=performance.now();const pr=camP=camOpen();pr.catch(()=>{});
 setTimeout(()=>{if(camP===pr){camP=null;pr.then(s=>s.getTracks().forEach(t=>t.stop())).catch(()=>{});}},3500);}catch(x){}},true);
$('#camIn').addEventListener('click',e=>{if(nat||!(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia))return;e.preventDefault();e.stopImmediatePropagation();openLive();},true);
window.__txOpenLive=function(){if(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia&&!document.getElementById('lv'))return openLive()};
async function openLive(){
 const ar=AR(),T=(a,b)=>ar?a:b;
 document.documentElement.classList.add('txcam');
 if(!document.getElementById('lvperf')){const sp2=document.createElement('style');sp2.id='lvperf';sp2.textContent=`
html.txcam *,html.txcam *::before,html.txcam *::after{animation-play-state:paused!important}
html.txcam #lv,html.txcam #lv *,html.txcam #lv *::before,html.txcam #lv *::after{animation-play-state:running!important}
html.txcam #lv.v3 .ib.ai.on{animation:none!important;box-shadow:0 0 0 3px rgba(34,211,245,.16),0 0 12px rgba(34,211,245,.3)}
html.txcam #lv .ib.ai.on .s2{animation:none!important}
#lv{animation-duration:.14s!important}
#lv.out{transition-duration:.1s!important}
#lv .tgp{animation-duration:.12s!important}
#lv.v3 .seg{-webkit-mask-image:none!important;mask-image:none!important;scroll-snap-type:none!important}
#lv.v3 .seg button{transition-duration:.12s!important}
#lv .txsw{transition:opacity .12s}
#lv .txsw i{transition-duration:.14s!important}
#lv .ops,#lv .opw{transition-duration:.14s!important}
#lv .asg,#lv .sug,#lv .aitip{transition-duration:.14s!important}
#lv.v3 .gw.e .dn{-webkit-backdrop-filter:none!important;backdrop-filter:none!important}

html.txcam,html.txcam body{overscroll-behavior:none}
#lv{overscroll-behavior:none}
#lv .txsw{transition:opacity .12s}
#lv .bt{position:relative}
#lv .bt .hqb{position:absolute;top:12px;right:8px;z-index:6;width:28px;height:28px;border-radius:50%;border:1px solid rgba(255,255,255,.22);background:rgba(12,20,40,.5);color:#fff;font:700 14px/26px system-ui;padding:0;text-align:center}
#lv .hqb:active{background:rgba(34,211,245,.35)}
#lv .hqw{position:absolute;inset:0;z-index:35;pointer-events:none;touch-action:none}
#lv .hqw.on{pointer-events:auto}
#lv .hqp{position:absolute;right:12px;width:min(272px,78vw);box-sizing:border-box;padding:12px 14px 12px;border-radius:16px;background:rgba(12,20,40,.84);border:1px solid rgba(255,255,255,.12);box-shadow:0 10px 30px rgba(0,0,0,.4);color:#fff;opacity:0;transform:translateY(4px) scale(.95);transform-origin:bottom right;transition:opacity .1s,transform .1s;pointer-events:none}
#lv .hqw.on .hqp{opacity:1;transform:none;pointer-events:auto}
#lv .hqh{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px}
#lv .hqt{font:700 14px system-ui;color:#22d3f5}
#lv .hqx{width:24px;height:24px;border-radius:50%;border:0;background:rgba(255,255,255,.1);color:#fff;font:400 17px/22px system-ui;padding:0}
#lv .hqp ol{margin:0;padding-inline-start:18px;font:400 12.5px/1.65 system-ui;color:rgba(255,255,255,.88)}
#lv .hqp li{margin:2px 0}
#lv .ox{width:calc(100% - 20px);max-width:400px;margin:0 auto calc(env(safe-area-inset-bottom,0px) + 10px);padding:2px 0 4px;box-sizing:border-box;background:rgba(12,20,40,.86);color:#fff;border:1px solid rgba(255,255,255,.1);border-radius:22px;box-shadow:0 12px 40px rgba(0,0,0,.45);transform:translateY(130%);transition:transform .16s cubic-bezier(.2,.8,.2,1);font:500 14px system-ui;will-change:transform;overscroll-behavior:contain}
#lv .opw.on .ox{transform:none}
#lv .ox .gr{display:block;position:relative;height:22px;touch-action:none}
#lv .ox .gr::after{content:"";position:absolute;left:50%;top:9px;width:36px;height:4px;margin-left:-18px;border-radius:2px;background:rgba(255,255,255,.3)}
#lv .ox .rw{display:flex;align-items:center;gap:10px;width:100%;padding:9px 14px;border:0;background:none;color:inherit;text-align:start;font:inherit;box-sizing:border-box;min-height:50px}
#lv .ox .rw+.rw{border-top:1px solid rgba(255,255,255,.07)}
#lv .ox .ic{width:30px;height:30px;flex:none;border-radius:9px;background:rgba(34,211,245,.15);color:#22d3f5;display:grid;place-items:center}
#lv .ox .ic svg{width:17px;height:17px}
#lv .ox b{font:600 14px system-ui;white-space:nowrap}
#lv .ox .tx{flex:1;min-width:0}
#lv .ox .sg2{display:flex;gap:2px;padding:3px;border-radius:11px;background:rgba(0,0,0,.28);flex:1;max-width:200px;margin-inline-start:auto}
#lv .ox .sg2 button{flex:1;min-width:0;border:0;background:none;color:rgba(255,255,255,.65);padding:7px 4px;border-radius:8px;font:600 12.5px system-ui;white-space:nowrap;transition:background .12s,color .12s}
#lv .ox .sg2 button.on{background:#22d3f5;color:#04202b}
#lv .ox .swt{position:relative;flex:none;width:42px;height:26px;border-radius:13px;background:rgba(255,255,255,.2);transition:background .14s}
#lv .ox .swt::after{content:"";position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:#fff;transition:transform .14s;box-shadow:0 1px 3px rgba(0,0,0,.4)}
#lv .ox .tgr.on .swt{background:#22d3f5}
#lv .ox .tgr.on .swt::after{transform:translateX(16px)}
#lv .ox .tgr:active{background:rgba(255,255,255,.05)}
#lv .qres{position:absolute;left:14px;right:14px;bottom:14px;z-index:8;background:var(--surface);color:var(--ink);border-radius:18px;padding:14px;box-shadow:0 10px 30px rgba(0,0,0,.5);animation:lvin .14s ease-out}
#lv .qres p{margin:0 0 10px;word-break:break-all;max-height:30vh;overflow:auto;-webkit-user-select:text;user-select:text}
#lv .qres div{display:flex;gap:8px;flex-wrap:wrap}
`;document.head.appendChild(sp2);}
 const ask=camAsk;
 let stream=null;const sp=camP||camOpen();camP=null;sp.catch(()=>{});
 if(!document.getElementById('lvcss')){const s=document.createElement('style');s.id='lvcss';s.textContent=`
#lv{position:fixed;inset:0;z-index:9500;background:#000;display:flex;flex-direction:column;font-family:system-ui,-apple-system,sans-serif;-webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none;animation:lvin .2s ease-out}
@keyframes lvin{from{opacity:0;transform:scale(1.04)}}
#lv.out{opacity:0;transition:opacity .15s}
#lv .st{position:relative;flex:1;min-height:0;overflow:hidden}
#lv video{width:100%;height:100%;object-fit:contain;background:#000}
#lv canvas{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
#lv .tb{position:absolute;top:calc(env(safe-area-inset-top,0px) + 12px);left:12px;right:12px;display:flex;justify-content:space-between;direction:ltr}
#lv .tb>div{display:flex;gap:10px}
#lv .tgp{display:flex;gap:10px;animation:lvin .18s ease-out}
#lv .tb>div>.ib>svg{transition:transform .2s}
#lv button{font-family:inherit;cursor:pointer;outline:0}
#lv .ib{width:44px;height:44px;border-radius:50%;border:0;background:rgba(18,22,38,.66);color:#fff;display:grid;place-items:center;transition:transform .12s,background .15s,color .15s;padding:0}
#lv .ib:active{transform:scale(.86)}
#lv svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round;display:block}
#lv .ib.on{background:#22d3f5;color:#04202b}
#lv .ib.fl.on svg{fill:currentColor}
#lv .ib.sp svg{animation:lvsp .35s ease}
@keyframes lvsp{to{transform:rotate(180deg)}}
#lv .hint{position:absolute;inset-inline:auto;bottom:auto;right:auto;height:auto;width:max-content;max-width:92%;top:calc(env(safe-area-inset-top,0px) + 70px);left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:8px;padding:8px 14px;border-radius:999px;background:rgba(18,22,38,.66);color:#fff;font:600 13px system-ui;white-space:nowrap;direction:rtl}
#lv .hint i{width:9px;height:9px;border-radius:50%;background:#22d3f5;transition:background .15s,transform .2s}
#lv .hint.ok i{background:#22e07a;transform:scale(1.4)}
#lv .fl2{position:absolute;inset:0;background:#fff;opacity:0;pointer-events:none}
#lv .fl2.go{animation:lvfl .3s ease-out}
@keyframes lvfl{0%{opacity:.85}100%{opacity:0}}
#lv .bt{background:linear-gradient(0deg,#000 65%,rgba(0,0,0,0));padding:12px 14px calc(env(safe-area-inset-bottom,0px) + 14px);direction:ltr}
#lv .seg{position:relative;display:flex;margin:0 auto 16px;max-width:340px;background:rgba(255,255,255,.12);border-radius:999px;padding:4px}
#lv .seg b{position:absolute;top:4px;bottom:4px;left:4px;width:calc((100% - 8px)/3);border-radius:999px;background:#22d3f5;transition:transform .22s cubic-bezier(.3,1.25,.5,1)}
#lv .seg button{position:relative;flex:1;border:0;background:none;color:#cfd6e6;height:40px;border-radius:999px;display:flex;align-items:center;justify-content:center;gap:6px;font:600 13px system-ui;transition:color .15s;padding:0}
#lv .seg button svg{width:18px;height:18px}
#lv .seg button.on{color:#04202b}
#lv .row{display:flex;align-items:center;justify-content:space-between}
#lv .row>div{width:100px;display:flex;align-items:center}
#lv .row>div:last-child{justify-content:flex-end}
#lv .sh{position:relative;width:80px;height:80px;border:0;border-radius:50%;background:conic-gradient(#22e07a var(--p,0%),rgba(255,255,255,.5) 0);padding:0}
#lv .sh .in{position:absolute;inset:5px;border-radius:50%;background:#fff;box-shadow:0 0 0 4px #000;transition:transform .1s}
#lv .sh:active .in{transform:scale(.85)}
#lv .chip{height:40px;padding:0 12px;border-radius:20px;border:0;background:rgba(255,255,255,.14);color:#fff;display:flex;gap:6px;align-items:center;font:600 13px system-ui;transition:opacity .15s,background .15s,color .15s,transform .12s}
#lv .chip svg{width:18px;height:18px}
#lv .chip:active{transform:scale(.92)}
#lv .chip.on{background:rgba(34,224,122,.22);color:#6dffb0}
#lv .dn{height:44px;padding:0 16px;border-radius:22px;border:0;background:#22d3f5;color:#04202b;display:none;gap:6px;align-items:center;font:700 14px system-ui}
#lv .dn.pop{animation:lvpop .3s cubic-bezier(.3,1.6,.5,1)}
@keyframes lvpop{from{transform:scale(.7)}}
`;document.head.appendChild(s);}
 const I={x:'<path d="M6 6l12 12M18 6L6 18"/>',fl:'<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',lens:'<path d="M20 11a8 8 0 0 0-14-4M4 4v4h4M4 13a8 8 0 0 0 14 4M20 20v-4h-4"/>',mu:'<path d="M12 3l9 5-9 5-9-5zM3 13l9 5 9-5"/>',
  sn:'<path d="M11 5L6 9H3v6h3l5 4zM16 9a4 4 0 0 1 0 6M19 7a7 7 0 0 1 0 10"/>',sm:'<path d="M11 5L6 9H3v6h3l5 4zM17 9l5 6M22 9l-5 6"/>',
  doc:'<path d="M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6"/>',id:'<rect x="3" y="6" width="18" height="12" rx="2.5"/><circle cx="8" cy="11" r="1.7"/><path d="M5.5 15.5c.5-1.5 4.5-1.5 5 0M13 10h5M13 14h5"/>',
  ph:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',au:'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z"/>',ck:'<path d="M5 12l5 5 9-10"/>'};
 const S=k=>'<svg viewBox="0 0 24 24">'+I[k]+'</svg>';
 const m=document.createElement('div');m.id='lv';m.className='v3';m.style.zIndex='9500';
 m.innerHTML='<div class="st"><video playsinline muted autoplay poster="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" disablepictureinpicture></video><canvas></canvas><div class="tb"><button class="ib" data-a="x" aria-label="close">'+S('x')+'</button><div><button class="ib" data-a="sn" aria-label="'+(typeof Lg==='function'?Lg:function(a,b){return b})('لقطة','Snap')+'">'+S('sn')+'</button><button class="ib fl" data-a="f" aria-label="'+(typeof Lg==='function'?Lg:function(a,b){return b})('الفلاش','Flash')+'">'+S('fl')+'</button></div></div><div class="hint"><i></i><span></span></div><div class="fl2"></div></div>'
 +'<div class="bt"><div class="txsw"><i></i><span></span><span></span><span></span></div><div class="seg"><b></b><button data-m="doc">'+S('doc')+T('مستند','Doc')+'</button><button data-m="id">'+S('id')+T('بطاقة','Card')+'</button><button data-m="ph">'+T('صورة شخصية','ID photo')+'</button><button data-m="tb">'+T('جدول','Table')+'</button><button data-m="book">'+T('كتاب','Book')+'</button><button data-m="ocr">'+T('استخراج نص','Text')+'</button><button data-m="qr">QR</button></div>'
 +'<div class="row"><div><button class="ob" data-a="o" aria-label="options"><svg viewBox="0 0 24 24"><path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/></svg></button><button class="chip" data-a="a">'+S('au')+'<span></span></button></div><button class="sh" data-a="s" aria-label="capture"><span class="rp"></span><span class="in"></span></button><div><button class="dn" data-a="d">'+S('ck')+'<span></span></button></div></div></div>';
 document.body.appendChild(m);
 const $q=s=>m.querySelector(s),v=$q('video'),cv=$q('canvas'),hintEl=$q('.hint'),hintT=$q('.hint span'),fl=$q('.fl2'),seg=$q('.seg b'),sh=$q('.sh'),ab=$q('[data-a=a]'),db=$q('[data-a=d]'),fb=$q('[data-a=f]'),snb=$q('[data-a=sn]');
 /* v15: collapsible side tools (sound / multi / lens) — flash stays visible; state remembered */
 {const grp=$q('.tb>div');if(grp){const wrap=document.createElement('div');wrap.className='tgp';
  [snb].forEach(x=>wrap.appendChild(x));try{wrap.appendChild(TXAI.camBtn(m));}catch(e){}const tgl=document.createElement('button');tgl.className='ib';tgl.type='button';tgl.setAttribute('aria-label','tools');
  tgl.innerHTML='<svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>';grp.prepend(wrap);grp.prepend(tgl);
  let col=localStorage.getItem('tx_tbc')==='1';const ap=()=>{wrap.style.display=col?'none':'flex';tgl.style.transform=col?'rotate(180deg)':'none';};ap();
  tgl.onclick=()=>{col=!col;try{localStorage.setItem('tx_tbc',col?'1':'0')}catch(e){}ap();};}}
 let tool='',xpaint=null,qrOn=false,qrShown=0,qrQ=null,qrDet=null,lastOb=null,segA=0,cvDirty=false,calmT=0,lastHs=0,mu0=localStorage.getItem('tx_multi')==='1',fbk=localStorage.getItem('tx_fb')==='1',helpAuto=null,gdOn=localStorage.getItem('tx_grid')==='1';
 const segGo=(sg,to)=>{cancelAnimationFrame(segA);const a=sg.scrollLeft,d=to-a;if(Math.abs(d)<2)return;const t0=performance.now(),D=130,st=t=>{const k=Math.min(1,(t-t0)/D),e=1-Math.pow(1-k,3);sg.scrollLeft=a+d*e;if(k<1)segA=requestAnimationFrame(st);};segA=requestAnimationFrame(st);};
 let uiM='doc',amu=0,mode=(uiM==='id'?'id':'doc'),multi=localStorage.getItem('tx_multi')==='1',auto=localStorage.getItem('tx_auto')==='1',snd=localStorage.getItem('tx_snd')!=='0';
 let stable=0,last=null,lastGood=null,alive=true,gb=0,armed=true,torch=false,trk=null,files=[],bz=0,lockT=0,dtm=0,raf=0,backs=[],bi=0,hk='',fm=localStorage.getItem('tx_fm')||'off',tmv=0,cnt=0,cntI=0,fmTry=0,sugN=0,sugT=0,galFn=null,flyFn=null,sugFn=null;
 /* ---- feedback: haptics + synthesized sounds ---- */
 const buzz=n=>{try{if(localStorage.getItem('tx_hap')!=='0'&&navigator.vibrate)navigator.vibrate(n)}catch(e){}};
 let ac=null;try{ac=new(window.AudioContext||window.webkitAudioContext)();}catch(e){}
 const tone=(f,d,t,vol,f2)=>{if(!snd||!ac)return;try{if(ac.state==='suspended')ac.resume();const o=ac.createOscillator(),g=ac.createGain(),n=ac.currentTime;o.type=t||'sine';o.frequency.setValueAtTime(f,n);if(f2)o.frequency.exponentialRampToValueAtTime(f2,n+d);g.gain.setValueAtTime(vol||.12,n);g.gain.exponentialRampToValueAtTime(.0001,n+d);o.connect(g);g.connect(ac.destination);o.start(n);o.stop(n+d+.02);}catch(e){}};
 const click=()=>{if(!snd||!ac)return;try{if(ac.state==='suspended')ac.resume();const A=ac,n0=A.currentTime+.005,sr=A.sampleRate;
  const mkN=sec=>{const b=A.createBuffer(1,Math.max(1,Math.floor(sr*sec)),sr),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;return b;};
  const mst=A.createGain();mst.gain.value=.9;const cmp=A.createDynamicsCompressor();cmp.threshold.value=-14;cmp.ratio.value=4;mst.connect(cmp);cmp.connect(A.destination);
  const burst=(at,dur,f,q,vol)=>{const s=A.createBufferSource(),bp=A.createBiquadFilter(),g=A.createGain();s.buffer=mkN(dur+.02);bp.type='bandpass';bp.frequency.value=f;bp.Q.value=q;
   g.gain.setValueAtTime(0.0001,at);g.gain.exponentialRampToValueAtTime(vol,at+.002);g.gain.exponentialRampToValueAtTime(.0001,at+dur);s.connect(bp);bp.connect(g);g.connect(mst);s.start(at);s.stop(at+dur+.02);};
  const body=(at,f0,f1,dur,vol)=>{const o=A.createOscillator(),lp=A.createBiquadFilter(),g=A.createGain();o.type='sine';o.frequency.setValueAtTime(f0,at);o.frequency.exponentialRampToValueAtTime(f1,at+dur);lp.type='lowpass';lp.frequency.value=700;
   g.gain.setValueAtTime(0.0001,at);g.gain.exponentialRampToValueAtTime(vol,at+.003);g.gain.exponentialRampToValueAtTime(.0001,at+dur);o.connect(lp);lp.connect(g);g.connect(mst);o.start(at);o.stop(at+dur+.02);};
  /* 1) shutter opens: soft mechanical clack */
  burst(n0,.022,3100,1.4,.34);body(n0,210,95,.05,.3);
  /* 2) shutter closes: second, slightly lower clack */
  burst(n0+.052,.028,1900,1.1,.26);body(n0+.052,160,80,.06,.22);
  /* 3) fine glass tick for polish */
  const o=A.createOscillator(),tg=A.createGain();o.type='sine';o.frequency.value=4200;tg.gain.setValueAtTime(0.0001,n0+.052);tg.gain.exponentialRampToValueAtTime(.035,n0+.054);tg.gain.exponentialRampToValueAtTime(.0001,n0+.085);o.connect(tg);tg.connect(mst);o.start(n0+.052);o.stop(n0+.09);
  /* 4) scanner sweep: gentle copier-style pass of light, filtered noise rising in pitch */
  {const at=n0+.085,dur=.24,s=A.createBufferSource(),bp=A.createBiquadFilter(),g=A.createGain();s.buffer=mkN(dur+.05);bp.type='bandpass';bp.Q.value=4;bp.frequency.setValueAtTime(700,at);bp.frequency.exponentialRampToValueAtTime(3000,at+dur);
   g.gain.setValueAtTime(0.0001,at);g.gain.exponentialRampToValueAtTime(.09,at+.06);g.gain.exponentialRampToValueAtTime(.0001,at+dur);s.connect(bp);bp.connect(g);g.connect(mst);s.start(at);s.stop(at+dur+.05);}
 }catch(e){}};
 const sfx={sel:()=>{requestAnimationFrame(()=>setTimeout(()=>{tone(820,.05,'sine',.1);buzz(8)},0))},on:()=>{tone(620,.07,'sine',.12,980);buzz(12)},off:()=>{tone(900,.07,'sine',.1,560);buzz(8)},lock:()=>{tone(880,.08,'sine',.12);setTimeout(()=>tone(1320,.12,'sine',.12),80);buzz(8)},shut:()=>{click();buzz(14)}};
 const setHint=(t,ok,warn)=>{const k=t+(ok?1:0)+(warn?'w':'');if(k===hk)return;hk=k;hintT.textContent=t;hintEl.classList.toggle('ok',!!ok);hintEl.classList.toggle('warn',!!warn);};
 /* focus: tap-to-focus, sharpness meter, and capture that waits for a sharp frame */
 let shNow=0,shPk=0,fT=0,rfBusy=0,blurSince=0,bad=false,lumNow=128,clipNow=0;
 const SW=192,SH=144,shc=document.createElement('canvas');shc.width=SW;shc.height=SH;const shx=shc.getContext('2d',{willReadFrequently:true});
 const sharpMeasure=()=>{if(!v.videoWidth)return 0;const vw=v.videoWidth,vh=v.videoHeight;shx.drawImage(v,vw*.325,vh*.325,vw*.35,vh*.35,0,0,SW,SH);const d=shx.getImageData(0,0,SW,SH).data,st=SW*4;let a=0,n=0,lm=0,cl=0;
  for(let y=1;y<SH-1;y++)for(let x=1;x<SW-1;x++){const i=y*st+x*4,l=d[i]*.3+d[i+1]*.59+d[i+2]*.11,lx=d[i+4]*.3+d[i+5]*.59+d[i+6]*.11,ly=d[i+st]*.3+d[i+st+1]*.59+d[i+st+2]*.11;a+=Math.abs(l-lx)+Math.abs(l-ly);n++;lm+=l;if(d[i]>=250&&d[i+1]>=250&&d[i+2]>=250)cl++;}lumNow=lumNow*.6+(lm/n)*.4;clipNow=clipNow*.6+(cl/n)*.4;return a/n;};
 const qualMsg=q=>{const dd=(a,b)=>Math.hypot((a.x-b.x)*v.videoWidth,(a.y-b.y)*v.videoHeight),wt=dd(q[0],q[1]),wb=dd(q[3],q[2]),hl=dd(q[0],q[3]),hr=dd(q[1],q[2]),pr=Math.max(wt,wb)/Math.max(1,Math.min(wt,wb)),pv=Math.max(hl,hr)/Math.max(1,Math.min(hl,hr));
  tiltNow=false;
  if(lumNow<52)return T('الإضاءة ضعيفة — فعّل الفلاش أو قرّب من نور','Low light — turn on the flash or move to a brighter spot');
  if(clipNow>.08)return T('في انعكاس نور — غيّر الزاوية شوية','Glare detected — tilt the page slightly');
  if(Math.max(pr,pv)>1.28){tiltNow=true;return T('الكاميرا مايلة — خليها فوق الورقة مباشرة','Camera is tilted — hold it straight above the page');}
  return '';};
 let lowN=0,plT=0;const shLoop=()=>{if(!alive)return;try{if(!document.hidden&&!gb&&performance.now()>=calmT){shNow=sharpMeasure();lowN=lumNow<52?lowN+1:(lumNow>64?0:lowN);if(fm==='on'&&!torch&&!fmTry&&trk){fmTry=1;setTorch(true);}if(fm==='auto'&&lowN>=6&&!torch&&!fmTry&&trk){fmTry=1;setTorch(true);}fb.classList.remove('pl');fb.classList.toggle('tr',lowN>=6&&!torch&&fm==='off');shPk=Math.max(shPk*.95,shNow);bad=shPk>=6&&shNow<shPk*.72;if(bad){if(!blurSince)blurSince=Date.now();}else blurSince=0;}}catch(e){}setTimeout(shLoop,260);};
 const fOk=()=>!bad||(blurSince&&Date.now()-blurSince>3000);
 const refocus=async(px,py)=>{if(!trk)return false;try{const cp=(trk.getCapabilities&&trk.getCapabilities())||{},fm=cp.focusMode||[];if(!fm.length)return false;
   if(fm.indexOf('single-shot')>=0||fm.indexOf('manual')>=0){const adv={focusMode:fm.indexOf('single-shot')>=0?'single-shot':'continuous'};if(px!=null&&'pointsOfInterest' in cp)adv.pointsOfInterest=[{x:clamp(px,0,1),y:clamp(py,0,1)}];
     await trk.applyConstraints({advanced:[adv]});await sleep(380);}
   if(fm.indexOf('continuous')>=0)await trk.applyConstraints({advanced:[{focusMode:'continuous'}]});shPk=shNow;return true;}catch(e){return false;}};
 const shoot=async()=>{if(gb||rfBusy||qrOn)return;if(!fOk()&&trk){rfBusy=1;setHint(T('بيظبط الفوكس...','Focusing...'),false);try{await refocus();const t0=Date.now();while(!fOk()&&Date.now()-t0<600)await sleep(60);}catch(e){}rfBusy=0;}grab();};
 if(!document.getElementById('lvcss2')){const s2=document.createElement('style');s2.id='lvcss2';s2.textContent='#lv .fr{position:absolute;width:72px;height:72px;margin:-36px 0 0 -36px;border:2px solid #22d3f5;border-radius:50%;pointer-events:none;animation:lvfr .9s ease-out forwards}@keyframes lvfr{0%{transform:scale(1.6);opacity:0}25%{opacity:1}60%{transform:scale(1);opacity:1}100%{transform:scale(1);opacity:0}}#lv .gd{position:absolute;inset:0;pointer-events:none;opacity:0;transition:opacity .25s;background:linear-gradient(to right,transparent calc(33.33% - .5px),rgba(255,255,255,.4) 33.33%,transparent calc(33.33% + .5px),transparent calc(66.66% - .5px),rgba(255,255,255,.4) 66.66%,transparent calc(66.66% + .5px)),linear-gradient(to bottom,transparent calc(33.33% - .5px),rgba(255,255,255,.4) 33.33%,transparent calc(33.33% + .5px),transparent calc(66.66% - .5px),rgba(255,255,255,.4) 66.66%,transparent calc(66.66% + .5px))}#lv .ts{position:absolute;left:0;right:0;bottom:10px;display:flex;gap:8px;justify-content:center;direction:ltr;padding:6px 14px;overflow-x:auto}#lv .ts button{position:relative;flex:0 0 auto;width:44px;height:58px;border-radius:8px;border:2px solid rgba(255,255,255,.75);background:#222 center/cover no-repeat;padding:0}#lv .ts button b{position:absolute;top:-8px;right:-8px;width:22px;height:22px;border-radius:50%;background:#ff453a;color:#fff;font:700 14px/22px system-ui;text-align:center}';document.head.appendChild(s2);}
 if(!document.getElementById('lvcss3')){const s3=document.createElement('style');s3.id='lvcss3';s3.textContent=`
#lv.v3 .tb{top:calc(env(safe-area-inset-top,0px) + 10px);left:10px;right:10px}
#lv.v3 .ib{width:38px;height:38px;background:rgba(6,10,22,.5);transition:transform .15s,color .2s,background .3s}
#lv.v3 .ib svg{width:20px;height:20px}
#lv.v3 .ib.pl{animation:lvpl 1.1s ease-in-out 3}
@keyframes lvpl{0%{box-shadow:0 0 0 0 rgba(34,211,245,.6);background:rgba(6,10,22,.5);color:#fff}35%{background:#22d3f5;color:#04202b;box-shadow:0 0 0 11px rgba(34,211,245,0)}100%{box-shadow:0 0 0 0 rgba(34,211,245,0);background:rgba(6,10,22,.5);color:#fff}}
#lv.v3 .hint{top:calc(env(safe-area-inset-top,0px) + 58px);background:rgba(6,10,22,.72);padding:7px 14px;font:500 13px system-ui;transition:opacity .2s,background .2s,color .2s}
#lv.v3 .hint.warn{background:#06304a;color:#a8ecff}
#lv.v3 .hint.warn i{background:#22d3f5}
#lv.v3 .bt{background:#050914;padding:10px 14px calc(env(safe-area-inset-bottom,0px) + 16px)}
#lv.v3 .seg{background:none;max-width:300px;margin-bottom:14px;padding:3px}
#lv.v3 .seg b{top:3px;bottom:3px;left:3px;width:calc((100% - 6px)/3);background:rgba(255,255,255,.16)}
#lv.v3 .seg button{height:34px;color:rgba(255,255,255,.55);font:500 14px system-ui}
#lv.v3 .seg button svg{display:none}
#lv.v3 .seg button.on{color:#fff}
#lv.v3 .sh{width:76px;height:76px;background:conic-gradient(#22e07a var(--p,0%),rgba(255,255,255,.9) 0)}
#lv.v3 .sh .in{inset:5px;box-shadow:0 0 0 3px #050914;transition:transform .12s}
#lv.v3 .sh:active .in{transform:scale(.88)}
#lv.v3 .sh .rp{position:absolute;inset:0;border-radius:50%;border:2px solid #fff;opacity:0;pointer-events:none}
#lv.v3 .sh.go .rp{animation:lvrp .3s ease-out}
@keyframes lvrp{from{transform:scale(1);opacity:.6}to{transform:scale(1.55);opacity:0}}
#lv.v3 .sh.go .in{animation:lvin2 .18s ease-out}
@keyframes lvin2{from{transform:scale(.84)}}
#lv.v3 .fl2.go{animation:lvfl3 .13s ease-out}
@keyframes lvfl3{0%{opacity:.6}100%{opacity:0}}
#lv.v3 .chip{height:38px;background:rgba(255,255,255,.12)}
@media (prefers-reduced-motion:reduce){#lv.v3 .sh.go .rp,#lv.v3 .sh.go .in,#lv.v3 .ib.pl{animation:none}}
`;document.head.appendChild(s3);}
 const stg=document.querySelector('#lv .st');
 if(stg)stg.addEventListener('pointerdown',e=>{if(e.target.closest('button')||!v.videoWidth)return;const r=v.getBoundingClientRect(),vw=v.videoWidth,vh=v.videoHeight,sc=Math.min(r.width/vw,r.height/vh),dw=vw*sc,dh=vh*sc,ox=r.left+(r.width-dw)/2,oy=r.top+(r.height-dh)/2,nx=(e.clientX-ox)/dw,ny=(e.clientY-oy)/dh;if(nx<0||ny<0||nx>1||ny>1)return;
  const sr=stg.getBoundingClientRect(),ring=document.createElement('i');ring.className='fr';ring.style.left=(e.clientX-sr.left)+'px';ring.style.top=(e.clientY-sr.top)+'px';stg.appendChild(ring);setTimeout(()=>ring.remove(),900);buzz(6);refocus(nx,ny);});
 const attach=s=>{stream=s;v.srcObject=s;trk=s.getVideoTracks()[0];
  try{const cp=trk.getCapabilities&&trk.getCapabilities()||{},adv=[];if(cp.focusMode&&cp.focusMode.indexOf('continuous')>=0)adv.push({focusMode:'continuous'});if(cp.zoom&&cp.zoom.min<1)adv.push({zoom:1});if(adv.length)trk.applyConstraints({advanced:adv}).catch(()=>{});}catch(e){}
  if(torch)setTorch(true);shPk=0;shNow=0;bad=false;blurSince=0;setTimeout(()=>{refocus();},450);};
 const setTorch=async on=>{torch=on;fb.classList.toggle('on',on);try{await trk.applyConstraints({advanced:[{torch:on}]});}catch(e){torch=false;fb.classList.remove('on');if(on)toast(T('الفلاش مش مدعوم على العدسة دي','Flash not supported on this lens'));}};
 const lab=()=>{multi=(mode==='id'&&fbk)?true:mu0;{const hk2=qrOn?'qr':tool==='card'?'id':(tool||uiM);helpAuto&&helpAuto(hk2);}ab.querySelector('span').textContent=T('تلقائي','Auto');ab.classList.toggle('on',auto);ab.style.opacity=mode==='doc'?1:0;ab.style.pointerEvents=mode==='doc'?'auto':'none';sh.style.visibility=qrOn?'hidden':'';if(gdOn&&grid)grid.style.opacity='1';
  snb.classList.toggle('on',snd);if(snb.__s!==snd){snb.__s=snd;snb.innerHTML=S(snd?'sn':'sm');}
  const ck=qrOn?'qr':tool==='card'?'id':(tool||uiM);m.querySelectorAll('[data-m]').forEach(b=>b.classList.toggle('on',b.dataset.m===ck));const ob=m.querySelector('[data-m].on'),sg=ob&&ob.parentNode;if(sg&&ob!==lastOb){lastOb=ob;segGo(sg,ob.offsetLeft-(sg.clientWidth-ob.offsetWidth)/2);}xpaint&&xpaint();
  db.style.display='flex';db.querySelector('span').textContent=T('تم','Done')+' · '+files.length;db.setAttribute('aria-label',T('تم','Done')+' · '+files.length);galFn&&galFn();};
 const close=()=>{window.__txTool=null;alive=false;clearInterval(cntI);clearTimeout(dtm);cancelAnimationFrame(raf);try{wk&&wk.terminate()}catch(e){}wk=null;try{ac&&ac.close()}catch(e){}stream&&stream.getTracks().forEach(t=>t.stop());m.classList.add('out');setTimeout(()=>{m.remove();document.documentElement.classList.remove('txcam');},110);};
 const finish=()=>{const tl=tool,mu=multi;close();if(!files.length)return;window.__txPend=tl?{id:tl,n:files.length,multi:!!mu,start:state.pages.length,f:{}}:null;state.queue=files.slice(1);window.__txCamBack=1;ingest(files[0]);};
 const guideQ=()=>{const vw=v.videoWidth||4,vh=v.videoHeight||3;let gw,gh;
  if(mode==='qr'){gw=gh=Math.min(.7*vw,.7*vh);}else if(mode==='id'){gw=.88*vw;gh=gw/1.586;if(gh>.78*vh){gh=.78*vh;gw=gh*1.586;}}else{gh=.8*vh;gw=gh*.75;if(gw>.88*vw){gw=.88*vw;gh=gw/.75;}}
  const x0=(vw-gw)/2/vw,y0=(vh-gh)/2/vh,x1=x0+gw/vw,y1=y0+gh/vh;return[{x:x0,y:y0},{x:x1,y:y0},{x:x1,y:y1},{x:x0,y:y1}];};
 /* ---- smooth overlay (rAF + interpolation) ---- */
 const lp=(a,b,k)=>a+(b-a)*k;let cur=null,dq=null,dtg=null,dA=0,gA=0,rad=.07,pP='';
 const prog=()=>{const pc=(auto&&mode==='doc'&&lockT)?Math.min(100,(performance.now()-lockT)/800*100):0;const pk=pc.toFixed(0);if(pk!==pP){pP=pk;sh.style.setProperty('--p',pk+'%');}if(pc>=100&&armed&&auto&&mode==='doc'&&fOk()&&!(multi&&dupNow()))grab();};
 const frame=()=>{if(!alive)return;raf=requestAnimationFrame(frame);if(!v.videoWidth)return;
  const gt=guideQ();if(!cur)cur=gt.map(p=>({x:p.x,y:p.y}));
  cur=cur.map((p,i)=>({x:lp(p.x,gt[i].x,.45),y:lp(p.y,gt[i].y,.45)}));gA=lp(gA,mode==='doc'?0:1,.35);rad=lp(rad,mode==='id'?.07:mode==='qr'?.12:mode==='ph'?.07:.045,.35);
  if(dtg){if(!dq)dq=dtg.map(p=>({x:p.x,y:p.y}));dq=dq.map((p,i)=>({x:lp(p.x,dtg[i].x,.35),y:lp(p.y,dtg[i].y,.35)}));}
  dA=lp(dA,dtg&&mode==='doc'?1:0,.25);if(dA<.02&&!dtg)dq=null;
  const need=gA>.02||(dA>.02&&!!dq)||(qrOn&&!!qrQ);if(!need&&!cvDirty){prog();return;}
  const hs=gA*7+dA*11+cur.reduce((a,p,i)=>a+(p.x*3+p.y*5)*(i+1),0)+(dq?dq.reduce((a,p,i)=>a+(p.x*3+p.y*5)*(i+2),0):0)+(qrQ?qrQ.reduce((a,p,i)=>a+(p.x*3+p.y*5)*(i+3),0):0)+(stable>=2?13:0)+(mode==='ph'?17:0)+cv.clientWidth*.001+cv.clientHeight*.0013;
  if(need&&cvDirty&&Math.abs(hs-lastHs)<1e-4){prog();return;}lastHs=hs;cvDirty=need;
  const dpr=Math.min(window.devicePixelRatio||1,1),cw=cv.clientWidth,ch=cv.clientHeight;if(cv.width!==Math.round(cw*dpr)||cv.height!==Math.round(ch*dpr)){cv.width=Math.round(cw*dpr);cv.height=Math.round(ch*dpr);}
  const g=cv.getContext('2d');g.setTransform(dpr,0,0,dpr,0,0);g.clearRect(0,0,cw,ch);
  const sc=Math.min(cw/v.videoWidth,ch/v.videoHeight),ox=(cw-v.videoWidth*sc)/2,oy=(ch-v.videoHeight*sc)/2,X=p=>ox+p.x*v.videoWidth*sc,Y=p=>oy+p.y*v.videoHeight*sc;
  if(gA>.02){const x=X(cur[0]),y=Y(cur[0]),w=X(cur[1])-x,h=Y(cur[3])-y,r=Math.min(w,h)*rad;
   g.globalAlpha=gA;g.fillStyle='rgba(3,10,24,.64)';g.beginPath();g.rect(0,0,cw,ch);rr(g,x,y,w,h,r);g.fill('evenodd');
   g.lineCap='round';g.lineJoin='round';
   if(mode==='id'){g.lineWidth=1.5;g.strokeStyle='rgba(255,255,255,.2)';g.beginPath();rr(g,x+w*.07,y+h*.3,w*.27,h*.46,6);
    for(let k=0;k<3;k++){const ly=y+h*(.32+k*.14);g.moveTo(x+w*.44,ly);g.lineTo(x+w*(k===2?.7:.9),ly);}g.stroke();}
   const L=Math.max(26,Math.min(46,Math.min(w,h)*.2)),cn=()=>{g.beginPath();
    g.moveTo(x,y+r+L);g.lineTo(x,y+r);g.arcTo(x,y,x+r,y,r);g.lineTo(x+r+L,y);
    g.moveTo(x+w-r-L,y);g.lineTo(x+w-r,y);g.arcTo(x+w,y,x+w,y+r,r);g.lineTo(x+w,y+r+L);
    g.moveTo(x+w,y+h-r-L);g.lineTo(x+w,y+h-r);g.arcTo(x+w,y+h,x+w-r,y+h,r);g.lineTo(x+w-r-L,y+h);
    g.moveTo(x+r+L,y+h);g.lineTo(x+r,y+h);g.arcTo(x,y+h,x,y+h-r,r);g.lineTo(x,y+h-r-L);};
   g.lineWidth=10;g.strokeStyle='rgba(34,211,245,.24)';cn();g.stroke();
   g.lineWidth=4;g.strokeStyle='#fff';cn();g.stroke();
   if(mode==='qr'){const cx=x+w/2,cy=y+h/2;g.lineWidth=2;g.strokeStyle='rgba(255,255,255,.6)';g.beginPath();g.moveTo(cx-10,cy);g.lineTo(cx+10,cy);g.moveTo(cx,cy-10);g.lineTo(cx,cy+10);g.stroke();}
   if(mode==='ph'){g.lineWidth=2.2;g.strokeStyle='rgba(255,255,255,.55)';g.beginPath();g.ellipse(x+w/2,y+h*.4,w*.2,h*.18,0,0,Math.PI*2);
    g.moveTo(x+w*.12,y+h*.95);g.bezierCurveTo(x+w*.14,y+h*.72,x+w*.34,y+h*.67,x+w*.5,y+h*.67);g.bezierCurveTo(x+w*.66,y+h*.67,x+w*.86,y+h*.72,x+w*.88,y+h*.95);g.stroke();}
   g.lineCap='butt';g.globalAlpha=1;}
  if(dA>.02&&dq){const lk=stable>=2;g.globalAlpha=dA;g.beginPath();dq.forEach((p,i)=>{i?g.lineTo(X(p),Y(p)):g.moveTo(X(p),Y(p));});g.closePath();g.lineWidth=3;g.strokeStyle=lk?'#22e07a':'#22d3f5';g.fillStyle=lk?'rgba(34,224,122,.2)':'rgba(34,211,245,.12)';g.fill();g.stroke();
   g.fillStyle=lk?'#22e07a':'#22d3f5';dq.forEach(p=>{g.beginPath();g.arc(X(p),Y(p),5,0,7);g.fill();});g.globalAlpha=1;}
  if(qrOn&&qrQ){g.beginPath();qrQ.forEach((p,i)=>{i?g.lineTo(X(p),Y(p)):g.moveTo(X(p),Y(p));});g.closePath();g.lineWidth=3;g.strokeStyle='#22e07a';g.fillStyle='rgba(34,224,122,.22)';g.fill();g.stroke();}
  prog();};
 const rr=(g,x,y,w,h,r)=>{g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath();};
 /* ---- detection loop (adaptive: never starves the UI) ---- */
 const sm=document.createElement('canvas'),sx=sm.getContext('2d',{willReadFrequently:true});
 const area=q=>{let a=0;for(let i=0;i<4;i++){const p=q[i],n=q[(i+1)%4];a+=p.x*n.y-n.x*p.y;}return Math.abs(a)/2;};
 /* worker keeps detection off the UI thread; falls back to the main thread when OffscreenCanvas/Worker aren't available */
 let wk=null,wkBusy=0,wkT=0,miss=0,wkFails=0;const canWk=!!(window.Worker&&window.OffscreenCanvas&&window.createImageBitmap);
 const mkWorker=()=>{try{if(!(window.Worker&&window.OffscreenCanvas&&window.createImageBitmap))return null;
  const code='const clamp='+clamp.toString()+';const mk=(w,h)=>new OffscreenCanvas(w,h);'+boxBlur.toString()+';'+maxFilter.toString()+';'+asp.toString()+';const GRAYC=new WeakMap();'+grayOf.toString()+';'+bilG.toString()+';'+lineInter2.toString()+';'+refineQuad.toString()+';'+detectCorners.toString()
   +';let P=null,N=0;onmessage=e=>{const b=e.data;let q=null,f=false,s=0;try{if(P&&N%3){try{const r=refineQuad(b,P.q,{R:.035,passes:2}),dd=Math.max.apply(null,r.map((p,i)=>Math.hypot(p.x-P.q[i].x,p.y-P.q[i].y)));if(dd<.03){q=r;f=true;s=P.s;}}catch(x){}}if(!q){q=detectCorners(b,1);f=detectCorners.found;s=detectCorners.best;if(f&&q){try{q=refineQuad(b,q,{R:.03,passes:2})}catch(x){}}}P=(f&&q)?{q:q,s:s}:null;N++;}catch(x){}try{b.close()}catch(x){}postMessage({q:q,f:f,s:s})};';
  const u=URL.createObjectURL(new Blob([code],{type:'text/javascript'})),w=new Worker(u);setTimeout(()=>URL.revokeObjectURL(u),3000);
  w.onmessage=e=>{wkBusy=0;try{if(alive&&e.data&&e.data.q&&mode==='doc'&&!gb)judge(e.data.q,e.data.f,e.data.s);}catch(x){}};
  w.onerror=()=>{wkBusy=0;try{w.terminate()}catch(x){}if(wk===w)wk=(++wkFails<3)?mkWorker():null;};return w;}catch(e){return null;}};
 const judge=(q,found,best)=>{
  const ar2=area(q),vw=v.videoWidth,vh=v.videoHeight,d=(a,b)=>Math.hypot((a.x-b.x)*vw,(a.y-b.y)*vh),w=(d(q[0],q[1])+d(q[3],q[2]))/2,h=(d(q[0],q[3])+d(q[1],q[2]))/2,rt=Math.max(w,h)/Math.max(1,Math.min(w,h)),
   ok=found&&best>=.5&&ar2>.12&&ar2<.9&&rt<3,dl=last?Math.max(...q.map((p,i)=>Math.hypot(p.x-last[i].x,p.y-last[i].y))):1;
  if(!ok&&dtg&&miss<2){miss++;return;}   /* tolerate a couple of dropped frames so the outline doesn't flicker */
  if(ok)miss=0;
  last=ok?q:null;const was=stable;const fo=fOk();stable=(ok&&dl<.025&&fo)?stable+1:0;if(ok&&dl<.025&&!fo&&Date.now()-fT>1300){fT=Date.now();refocus(q.reduce((a,p)=>a+p.x,0)/4,q.reduce((a,p)=>a+p.y,0)/4);}if(ok&&stable>=2)lastGood=q;if(!ok)armed=true;
  dtg=ok?q:null;const qm=ok?qualMsg(q):'',dp=ok&&multi&&stable>=2&&dupNow();grid.style.opacity=gdOn?'1':'0';
  if(stable>=2&&was<2){lockT=performance.now();sfx.lock();}if(stable<2)lockT=0;
  setHint(!ok?(uiM==='tb'?T('وجّه الكاميرا على الجدول','Point at the table'):T('وجّه الكاميرا على الورقة','Point at the document')):qm?qm:dp?T('نفس الصفحة — اقلب للصفحة التالية','Same page — turn to the next one'):stable>=2?(auto?T('ثبّت الجهاز...','Hold steady...'):T('جاهز للتصوير','Ready')):(!fo?T('بيظبط الفوكس...','Focusing...'):T('جاري التحديد','Detecting')),stable>=2&&!qm&&!dp,!!qm&&lumNow<52&&!torch&&fm==='off');sugFn&&sugFn(ok&&stable>=2);};
 const detect=()=>{const W=canWk?360:240,H=Math.round(W*v.videoHeight/v.videoWidth);sm.width=W;sm.height=H;sx.drawImage(v,0,0,W,H);let q=detectCorners(sm,2);const f=detectCorners.found,b=detectCorners.best;if(f){try{q=refineQuad(sm,q,{R:.03,passes:2});}catch(e){}}judge(q,f,b);};
 const loop=()=>{if(!alive)return;const nx=ms=>{dtm=setTimeout(loop,ms)};
  if(document.hidden||mode!=='doc'||!v.videoWidth||gb){if(mode!=='doc'){dtg=null;setHint(mode==='qr'?T('وجّه الكاميرا على كود QR','Point at a QR code'):mode==='id'?(fbk?(files.length?T('دلوقتي صوّر ظهر البطاقة','Now capture the back of the card'):T('صوّر وجه البطاقة الأول','Capture the front of the card first')):T('ضع البطاقة داخل المستطيل','Fit the card inside the frame')):T('ضع الوجه داخل الإطار','Fit the face inside the frame'),false);}nx(200);return;}
  /* v119: الكشف في الـworker بس. لو الـworker بطيء بنستنّاه (ونعيد تشغيله لو علّق)، ومبنرجعش للخيط الرئيسي عشان الشاشة ماتهنّجش */
  if(canWk){
   if(!wk){nx(500);return;}
   if(wkBusy){if(performance.now()-wkT>15000){try{wk.terminate()}catch(e){}wkBusy=0;wk=(++wkFails<4)?mkWorker():null;}nx(120);return;}
   wkBusy=1;wkT=performance.now();const W=360,H=Math.round(W*v.videoHeight/v.videoWidth);
   createImageBitmap(v,{resizeWidth:W,resizeHeight:H,resizeQuality:'low'}).then(bm=>wk&&wk.postMessage(bm,[bm])).catch(()=>{wkBusy=0;});
   nx(100);return;}
  const t0=performance.now();try{detect();}catch(e){}
  nx(Math.min(1500,Math.max(600,(performance.now()-t0)*4)));};
 /* capture: grab the frame synchronously and hand the canvas straight to ingest (no encode/decode round-trip) */
 /* multi-page: duplicate-page guard + thumbnail strip with per-page delete */
 let lastSig=null,tiltNow=false;const grid=document.createElement('div');grid.className='gd';m.querySelector('.st').appendChild(grid);
 const sigOf=()=>{if(!v.videoWidth)return null;const c=sigOf.c||(sigOf.c=document.createElement('canvas'));c.width=24;c.height=32;const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(v,0,0,24,32);const d=x.getImageData(0,0,24,32).data,o=new Float32Array(768);let mn=0;for(let i=0;i<768;i++){o[i]=d[i*4]*.3+d[i*4+1]*.59+d[i*4+2]*.11;mn+=o[i];}mn/=768;for(let i=0;i<768;i++)o[i]-=mn;return o;};
 const dupNow=()=>{if(!lastSig)return false;const g=sigOf();if(!g)return false;let a=0;for(let i=0;i<768;i++)a+=Math.abs(g[i]-lastSig[i]);return a/768<7;};
 const strip=document.createElement('div');strip.className='ts';m.querySelector('.st').appendChild(strip);
 const renderStrip=()=>{strip.innerHTML='';if(!multi)return;files.slice(-8).forEach(F=>{if(!F.__th)return;const b=document.createElement('button');b.type='button';b.style.backgroundImage='url('+F.__th+')';const x=document.createElement('b');x.textContent='×';x.onclick=e=>{e.stopPropagation();const i=files.indexOf(F);if(i>=0)files.splice(i,1);renderStrip();lab();toast(T('اتحذفت الصفحة','Page removed'));};b.appendChild(x);strip.appendChild(b);});strip.scrollLeft=strip.scrollWidth;};
 /* v119: لقطة بدقة الكاميرا الكاملة (ImageCapture.takePhoto) بدل إطار الفيديو (≈2MP). لو مش مدعومة أو النسبة مختلفة بنكمّل بالإطار */
  let ic=null,icCap=null;
  const hiPhoto=async(vw,vh)=>{try{
   if(!window.ImageCapture||!trk||trk.readyState!=='live')return null;
   ic=ic||new ImageCapture(trk);icCap=icCap||await ic.getPhotoCapabilities();
   const mw=icCap.imageWidth&&icCap.imageWidth.max,mh=icCap.imageHeight&&icCap.imageHeight.max;if(!mw||!mh)return null;
   const ar=vw/vh;let W=Math.min(mw,4096),H=Math.round(W/ar);if(H>mh){H=mh;W=Math.round(H*ar);}
   if(W<=vw*1.15)return null;
   const o={imageWidth:W,imageHeight:H};if(!torch)o.fillLightMode='off';
   const bl=await Promise.race([ic.takePhoto(o),new Promise((_,rj)=>setTimeout(()=>rj('timeout'),2600))]);
   const bm=await createImageBitmap(bl);
   if(Math.abs(bm.width/bm.height-ar)>.03){try{bm.close()}catch(e){}return null;}
   const c2=document.createElement('canvas');c2.width=bm.width;c2.height=bm.height;c2.getContext('2d',{alpha:false}).drawImage(bm,0,0);try{bm.close()}catch(e){}
   return c2;}catch(e){return null;}};
  const grab=()=>{if(gb||!v.videoWidth)return;gb=1;lastSig=sigOf();try{window.TXA&&TXA.noteShot(lastSig)}catch(e){}lockT=0;sfx.shut();fl.classList.remove('go');sh.classList.remove('go');void fl.offsetWidth;fl.classList.add('go');sh.classList.add('go');
  const vw=v.videoWidth,vh=v.videoHeight,md=mode,q=md==='doc'?(dtg||null):guideQ();
  const c=document.createElement('canvas');c.width=vw;c.height=vh;c.getContext('2d',{alpha:false}).drawImage(v,0,0);
  const F={__cv:c,__q:q,__x:(md!=='doc'&&q)?1:0,__id:md==='id'?1:0};files.push(F);
  const go=()=>{if(multi){try{const tc=document.createElement('canvas');tc.width=60;tc.height=80;const k=Math.max(60/vw,80/vh);tc.getContext('2d').drawImage(F.__cv,(60-vw*k)/2,(80-vh*k)/2,vw*k,vh*k);F.__th=tc.toDataURL('image/jpeg',.6);}catch(e){}F.__cv.toBlob(bl=>{if(bl){F.__blob=bl;F.__cv=null;}},'image/jpeg',.92);armed=false;stable=0;last=null;dtg=null;setTimeout(()=>armed=true,5000);lab();renderStrip();db.classList.remove('pop');void db.offsetWidth;db.classList.add('pop');flyFn&&flyFn(F.__th);gb=0;if(fbk&&mode==='id'&&files.length>=2)setTimeout(finish,320);}else finish();};
   hiPhoto(vw,vh).then(h=>{if(h)F.__cv=h;go();},()=>go());};
 const sw=async id=>{const prev=trk&&trk.getSettings().deviceId;stream.getTracks().forEach(t=>t.stop());
  try{attach(await ask(id));localStorage.setItem('tx_lens',id);}catch(e){try{attach(await ask(prev||null));}catch(e2){}toast(T('العدسة دي مش متاحة','Lens unavailable'));}};
 const isW=d=>/ultra|wide|0\.5/i.test(d.label),isT=d=>/tele|zoom/i.test(d.label);
 const score=d=>(isW(d)?10:isT(d)?20:0)+(/back camera|camera2? 0\b/i.test(d.label)?-5:0);
 const lensRef=()=>{const row=opw.querySelector('.lnr');if(!row)return;row.style.display=backs.length>1?'':'none';const box=row.querySelector('.sg2');box.textContent='';
  const nm=backs.map(d=>isW(d)?T('عريضة','Wide'):isT(d)?T('تقريب','Tele'):T('أساسية','Main'));
  backs.forEach((d,i)=>{const b=document.createElement('button');b.type='button';b.dataset.ln=i;const k=nm.slice(0,i+1).filter(x=>x===nm[i]).length;b.textContent=nm[i]+(nm.filter(x=>x===nm[i]).length>1?' '+k:'');b.classList.toggle('on',i===bi);box.appendChild(b);});};
 const pickLens=i=>{if(i===bi||!backs[i])return;bi=i;fmTry=0;sfx.sel();lensRef();sw(backs[i].deviceId);};
 const lenses=async()=>{try{const all=(await navigator.mediaDevices.enumerateDevices()).filter(d=>d.kind==='videoinput'&&!/front|user|selfie/i.test(d.label));
  const ds=all.filter(d=>!/macro|depth|infrared|\bir\b/i.test(d.label));const L=ds.length?ds:all;
  L.sort((a,b)=>score(a)-score(b)||a.label.localeCompare(b.label));backs=L;const cur2=trk.getSettings().deviceId,saved=localStorage.getItem('tx_lens');
  bi=Math.max(0,L.findIndex(d=>d.deviceId===cur2));const cd=L.find(d=>d.deviceId===cur2);
  if(!saved&&L.length>1&&L[0].deviceId!==cur2&&(!cd||score(cd)>score(L[0]))){bi=0;await sw(L[0].deviceId);}
  lensRef();}catch(e){}};
 m.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
  if(b.dataset.m){goKey(b.dataset.m);return;}
  const a=b.dataset.a;
  if(a==='x'||a==='d'){buzz(8);finish();}else if(a==='s')shootT();
  else if(a==='a'){auto=!auto;localStorage.setItem('tx_auto',auto?'1':'0');stable=0;lockT=0;lab();auto?sfx.on():sfx.off();}
  else if(a==='sn'){snd=!snd;localStorage.setItem('tx_snd',snd?'1':'0');lab();if(snd)sfx.on();buzz(8);}
  else if(a==='gd'){gdOn=!gdOn;try{localStorage.setItem('tx_grid',gdOn?'1':'0')}catch(x){}grid.style.opacity=gdOn?'1':'0';optRef();sfx.sel();}
  else if(a==='f'){cycleFm();}});
 /* 0.2-C1: options sheet (flash off/auto/on, timer, toggles) */
 if(!document.getElementById('lvcss4')){const s4=document.createElement('style');s4.id='lvcss4';s4.textContent=`
#lv .ob{width:44px;height:44px;border-radius:50%;border:0;background:rgba(255,255,255,.12);color:#fff;display:flex;align-items:center;justify-content:center;padding:0}
#lv .ob svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round}
#lv .row>div:first-child{display:flex;gap:8px;align-items:center}
#lv .chip{display:none!important}
#lv .ib{position:relative}
#lv .ib.au::after{content:"A";position:absolute;right:2px;bottom:1px;font:700 10px/12px system-ui;color:#22d3f5}
#lv .opw{position:absolute;inset:0;z-index:30;display:flex;align-items:flex-end;background:rgba(0,0,0,.45);opacity:0;pointer-events:none;transition:opacity .2s}
#lv .opw.on{opacity:1;pointer-events:auto}
#lv .ops{width:100%;background:#0b1224;color:#fff;border-radius:20px 20px 0 0;padding:14px 16px calc(env(safe-area-inset-bottom,0px) + 18px);transform:translateY(24px);transition:transform .22s ease-out;font:500 14px system-ui}
#lv .opw.on .ops{transform:none}
#lv .ops h4{margin:2px 0 10px;font:600 15px system-ui}
#lv .ops .r{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:10px 0}
#lv .ops .sg{display:flex;background:rgba(255,255,255,.1);border-radius:999px;padding:3px;gap:2px}
#lv .ops .sg button,#lv .ops .tg{border:0;background:none;color:rgba(255,255,255,.65);padding:7px 14px;border-radius:999px;font:500 13px system-ui}
#lv .ops .sg button.on{background:rgba(255,255,255,.2);color:#fff}
#lv .ops .tgs{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
#lv .ops .tg{background:rgba(255,255,255,.1)}
#lv .ops .tg.on{background:#22e07a;color:#04210f}
#lv .cd{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font:700 96px system-ui;color:#fff;text-shadow:0 2px 18px rgba(0,0,0,.6);pointer-events:none;opacity:0}
#lv .cd.t{animation:lvcd .9s ease-out}
@keyframes lvcd{from{transform:scale(1.5);opacity:.2}30%{opacity:1}to{transform:scale(1)}}
@media (prefers-reduced-motion:reduce){#lv .cd.t,#lv .ops,#lv .opw{animation:none;transition:none}}
`;document.head.appendChild(s4);}
 const stg4=m.querySelector('.st'),cd=document.createElement('div');cd.className='cd';stg4.appendChild(cd);
 const opw=document.createElement('div');opw.className='opw';
 opw.innerHTML='<div class="ox"><i class="gr"></i>'
  +'<div class="rw"><span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L4 14h7l-1 8 9-12h-7z"/></svg></span><b>'+T('الفلاش','Flash')+'</b><div class="sg2" data-g="fm"><button data-fm="off">'+T('إيقاف','Off')+'</button><button data-fm="auto">'+T('تلقائي','Auto')+'</button><button data-fm="on">'+T('تشغيل','On')+'</button></div></div>'
  +'<div class="rw lnr" style="display:none"><span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.2"/></svg></span><b>'+T('العدسة','Lens')+'</b><div class="sg2"></div></div>'
  +'<button type=\"button\" class=\"rw tgr\" data-a=\"a\"><span class=\"ic\"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/></svg></span><span class=\"tx\"><b>'+T('تصوير تلقائي','Auto-capture')+'</b></span><i class=\"swt\"></i></button>'
  +'<button type=\"button\" class=\"rw tgr\" data-a=\"gd\"><span class=\"ic\"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v16H4zM9.33 4v16M14.67 4v16M4 9.33h16M4 14.67h16"/></svg></span><span class=\"tx\"><b>'+T('خطوط الشبكة','Grid lines')+'</b></span><i class=\"swt\"></i></button>'
  +'<button type=\"button\" class=\"rw tgr\" data-a=\"sn\"><span class=\"ic\"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H3v6h3l5 4zM16 9a4 4 0 0 1 0 6"/></svg></span><span class=\"tx\"><b>'+T('الصوت','Sound')+'</b></span><i class=\"swt\"></i></button></div>';
 m.appendChild(opw);
 {const gr=opw.querySelector('.gr'),ox=opw.querySelector('.ox');let y0=null;const rs=()=>{y0=null;ox.style.transition='';ox.style.transform='';};
  gr.addEventListener('pointerdown',e=>{y0=e.clientY;try{gr.setPointerCapture(e.pointerId)}catch(x){}ox.style.transition='none';});
  gr.addEventListener('pointermove',e=>{if(y0==null)return;ox.style.transform='translateY('+Math.max(0,e.clientY-y0)+'px)';});
  gr.addEventListener('pointerup',e=>{if(y0==null)return;const d=e.clientY-y0;rs();if(d>45)opw.classList.remove('on');});
  gr.addEventListener('pointercancel',rs);}
 const optRef=()=>{opw.querySelectorAll('[data-fm]').forEach(b=>b.classList.toggle('on',b.dataset.fm===fm));opw.querySelectorAll('[data-tm]').forEach(b=>b.classList.toggle('on',+b.dataset.tm===tmv));
  opw.querySelector('.tgr[data-a=a]').classList.toggle('on',auto);opw.querySelector('.tgr[data-a=gd]').classList.toggle('on',gdOn);opw.querySelector('.tgr[data-a=sn]').classList.toggle('on',snd);fb.classList.toggle('au',fm==='auto');};
 const setFm=x=>{fm=x;fmTry=0;try{localStorage.setItem('tx_fm',fm)}catch(e){}if(fm==='off'||fm==='auto'){if(torch)setTorch(false);}optRef();};
 const cycleFm=()=>{if(fb.classList.contains('tr')){fb.classList.remove('tr');setTorch(true);sfx.on();return;}setFm(fm==='off'?'auto':fm==='auto'?'on':'off');sfx.sel();toast(T('الفلاش: ','Flash: ')+(fm==='off'?T('إيقاف','Off'):fm==='auto'?T('تلقائي','Auto'):T('تشغيل','On')));};
 const cdShow=()=>{cd.textContent=cnt;cd.style.opacity=1;cd.classList.remove('t');void cd.offsetWidth;cd.classList.add('t');sfx.sel();};
 const shootT=()=>{if(cnt){clearInterval(cntI);cnt=0;cd.style.opacity=0;return;}if(!tmv||gb){shoot();return;}cnt=tmv;cdShow();cntI=setInterval(()=>{cnt--;if(cnt<=0){clearInterval(cntI);cnt=0;cd.style.opacity=0;shoot();}else cdShow();},1000);};
 opw.addEventListener('click',e=>{if(e.target===opw){opw.classList.remove('on');return;}const b=e.target.closest('button');if(!b)return;if(b.dataset.ln!=null){pickLens(+b.dataset.ln);}else if(b.dataset.fm){setFm(b.dataset.fm);sfx.sel();}else if(b.dataset.tm!=null){tmv=+b.dataset.tm;try{localStorage.setItem('tx_tm',String(tmv))}catch(x){}sfx.sel();}setTimeout(optRef,0);});
 m.querySelector('.ob').addEventListener('click',()=>{optRef();opw.classList.add('on');sfx.sel();});
 optRef();

 /* 0.2-C2: mini gallery replaces the Done button + flying thumbnail + count badge */
 if(!document.getElementById('lvcss5')){const s5=document.createElement('style');s5.id='lvcss5';s5.textContent=`
#lv.v3 .dn{position:relative;width:48px;height:60px;padding:0;border-radius:10px;background:#1b2338 center/cover no-repeat;border:2px solid rgba(255,255,255,.85);box-shadow:5px -4px 0 -2px rgba(255,255,255,.28),9px -8px 0 -4px rgba(255,255,255,.14);justify-content:center}
#lv.v3 .dn>svg{position:absolute;right:-8px;bottom:-8px;width:22px;height:22px;padding:4px;border-radius:50%;background:#22e07a;color:#04210f;box-sizing:border-box}
#lv.v3 .dn>span{display:none}
#lv.v3 .dn .bg{position:absolute;top:-9px;left:-9px;min-width:22px;height:22px;border-radius:11px;background:#ff453a;color:#fff;font:700 13px/22px system-ui;text-align:center;padding:0 5px;box-sizing:border-box}
#lv .fly{position:fixed;z-index:9600;width:48px;height:60px;border-radius:8px;border:2px solid #fff;background:center/cover no-repeat;pointer-events:none;will-change:transform,opacity}
`;document.head.appendChild(s5);}
 const gw=document.createElement('div');gw.className='gw';db.parentNode.insertBefore(gw,db);gw.appendChild(db);const bg=document.createElement('b');bg.className='bg';gw.appendChild(bg);const ckb=document.createElement('i');ckb.className='ck';ckb.innerHTML='<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';gw.appendChild(ckb);const phi=document.createElement('i');phi.className='phi';phi.innerHTML='<svg viewBox="0 0 24 24"><rect x="3.5" y="4.5" width="17" height="15" rx="3"/><circle cx="9" cy="10" r="1.6"/><path d="M4 17l5-4.5 3.5 3L16 12l4.5 4.5"/></svg>';gw.appendChild(phi);db.addEventListener('click',e=>{if(!files.length){e.stopImmediatePropagation();toast(multi?T('الصفحات اللي هتصوّرها هتظهر هنا','Captured pages will appear here'):T('فعّل "عدة صور" لتصوير أكتر من صفحة','Switch to "Multiple" to scan several pages'));}});
 galFn=()=>{const L=files.slice().reverse().find(F=>F.__th);{const u=L?'url('+L.__th+')':'';if(db.__u!==u){db.__u=u;db.style.backgroundImage=u;}}bg.textContent=files.length;gw.style.display='block';gw.style.visibility=qrOn?'hidden':'';gw.classList.toggle('m',files.length>1);gw.classList.toggle('e',!files.length);};
 flyFn=th=>{try{if(!th||matchMedia('(prefers-reduced-motion:reduce)').matches)return;const a=sh.getBoundingClientRect(),b=db.getBoundingClientRect();if(!b.width)return;const el=document.createElement('div');el.className='fly';el.style.backgroundImage='url('+th+')';el.style.left=(a.left+a.width/2-24)+'px';el.style.top=(a.top+a.height/2-30)+'px';m.appendChild(el);
  const dx=b.left+b.width/2-(a.left+a.width/2),dy=b.top+b.height/2-(a.top+a.height/2),an=el.animate([{transform:'translate(0,0) scale(1.5)',opacity:.9},{transform:'translate('+dx+'px,'+dy+'px) scale(1)',opacity:.35}],{duration:340,easing:'cubic-bezier(.4,0,.2,1)'});an.onfinish=()=>{el.remove();db.classList.remove('pop');void db.offsetWidth;db.classList.add('pop');};setTimeout(()=>el.remove(),600);}catch(e){}};
 galFn();

 /* 0.2-C3: four modes (doc / card / pages / table), swipe to switch. pages = doc detection + multi-page on; table = doc detection with its own hint */
 if(!document.getElementById('lvcss121')){const s1=document.createElement('style');s1.id='lvcss121';s1.textContent=`
#lv.v3 .seg{max-width:min(100%,380px);overflow-x:auto;overflow-y:hidden;scrollbar-width:none;touch-action:pan-x;-webkit-overflow-scrolling:touch;scroll-snap-type:x proximity;padding:3px 10px;gap:2px;-webkit-mask-image:linear-gradient(90deg,transparent 0,#000 16px,#000 calc(100% - 16px),transparent 100%);mask-image:linear-gradient(90deg,transparent 0,#000 16px,#000 calc(100% - 16px),transparent 100%)}
#lv.v3 .seg::-webkit-scrollbar{display:none}
#lv.v3 .seg b{display:none}
#lv.v3 .seg button{flex:none;padding:0 15px;white-space:nowrap;scroll-snap-align:center;transition:background .2s,color .2s}
#lv.v3 .seg button.on{background:rgba(255,255,255,.18);color:#fff}
#lv .txsw{position:relative;display:flex;direction:ltr;width:210px;height:32px;margin:0 auto 10px;padding:3px;box-sizing:border-box;border-radius:999px;background:rgba(255,255,255,.12);touch-action:none;-webkit-user-select:none;user-select:none}
#lv .txsw i{position:absolute;top:3px;bottom:3px;left:3px;width:calc((100% - 6px)/2);border-radius:999px;background:linear-gradient(135deg,#1b63f0,#22d3f5);box-shadow:0 4px 12px -4px #22d3f5;transition:transform .2s cubic-bezier(.3,1.25,.5,1);will-change:transform}
#lv .txsw span{position:relative;flex:1;display:grid;place-items:center;font:600 12.5px system-ui;color:rgba(255,255,255,.62);transition:color .15s}
#lv .txsw span.on{color:#fff}
`;document.head.appendChild(s1);}
if(!document.getElementById('lvcss6')){const s6=document.createElement('style');s6.id='lvcss6';s6.textContent=`
#lv.v3 .seg{max-width:340px;direction:ltr}
#lv.v3 .seg b{width:calc((100% - 6px)/4)}
#lv .st{touch-action:pan-y}
`;document.head.appendChild(s6);}
 const UIO=['doc','id','pg','tb'];
 const setUi=x=>{if(x===uiM||UIO.indexOf(x)<0)return;uiM=x;mode=x==='id'?'id':'doc';try{localStorage.setItem('tx_ui',uiM);localStorage.setItem('tx_mode',mode)}catch(e){}
  if(x==='pg'){if(!multi){multi=true;amu=1;}}else if(amu){multi=false;amu=0;}
  stable=0;last=null;lastGood=null;dtg=null;lockT=0;hk='';lab();renderStrip();sfx.sel();};
 if(uiM==='pg'&&!multi){multi=true;amu=1;lab();renderStrip();}
 /* v122: tools live in the bottom slider; single/multi is a swipe switch */
 const KEYS=['doc','id','ph','tb','book','ocr','qr'],swEl=$q('.txsw'),swI=swEl.querySelector('i'),swS=swEl.querySelectorAll('span');
 swS[0].textContent=T('صورة واحدة','Single');swS[1].textContent=T('وش وظهر','Front & back');swS[2].textContent=T('عدة صور','Multiple');
 xpaint=()=>{const idm=mode==='id',n=idm?3:2,p=idm?(fbk?1:(mu0?2:0)):(mu0?1:0),act=idm?p:(p?2:0);swEl.style.opacity=qrOn?'0':'1';swEl.style.pointerEvents=qrOn?'none':'';swEl.style.width=idm?'282px':'210px';swS[1].style.display=idm?'':'none';swI.style.width='calc((100% - 6px)/'+n+')';swI.style.transform='translateX('+(p*100)+'%)';swS.forEach((x,i)=>x.classList.toggle('on',i===act));};
 const setPos=p=>{const idm=mode==='id';let nf=fbk,nu=mu0;if(idm){nf=p===1;nu=p===2;}else nu=p===1;if(nf===fbk&&nu===mu0)return;fbk=nf;mu0=nu;try{localStorage.setItem('tx_fb',fbk?'1':'0');localStorage.setItem('tx_multi',mu0?'1':'0');localStorage.setItem('tx_tmulti',mu0?'1':'0')}catch(e){}lab();if(window.__txTool)window.__txTool.multi=multi;renderStrip();sfx.sel();};
 const setMulti=x=>setPos(mode==='id'?(x?2:0):(x?1:0));
 {let sx=null,mv=0;const np=()=>mode==='id'?3:2,cp=()=>mode==='id'?(fbk?1:(mu0?2:0)):(mu0?1:0);
 swEl.addEventListener('pointerdown',e=>{sx=e.clientX;mv=0;});
 swEl.addEventListener('pointermove',e=>{if(sx==null)return;const d=e.clientX-sx;if(Math.abs(d)>14){mv=1;sx=e.clientX;setPos(Math.max(0,Math.min(np()-1,cp()+(d>0?1:-1))));}});
 swEl.addEventListener('pointerup',e=>{if(sx==null)return;sx=null;if(mv)return;const r=swEl.getBoundingClientRect();setPos(Math.max(0,Math.min(np()-1,Math.floor((e.clientX-r.left)/r.width*np()))));});
 swEl.addEventListener('pointercancel',()=>{sx=null;});}
 const txReset=()=>{stable=0;last=null;lastGood=null;dtg=null;lockT=0;hk='';};
 const qrBox=document.createElement('div');qrBox.className='qres';qrBox.style.display='none';m.querySelector('.st').appendChild(qrBox);
 let qrT=0,qrBusy=0;
 const qrShow=t=>{qrBox.textContent='';const p=document.createElement('p');p.textContent=t;qrBox.appendChild(p);const row=document.createElement('div');
  const bt=(x,f)=>{const e=document.createElement('button');e.type='button';e.className='btn sm';e.textContent=x;e.onclick=ev=>{ev.stopPropagation();f();};row.appendChild(e);};
  if(/^https?:\/\//i.test(t))bt(T('فتح','Open'),()=>window.open(t,'_blank','noopener'));
  bt(T('نسخ','Copy'),()=>{navigator.clipboard&&navigator.clipboard.writeText(t).then(()=>toast(T('اتنسخ','Copied')))});
  bt(T('مسح تاني','Scan again'),()=>{qrBox.style.display='none';qrShown=0;qrQ=null;});
  qrBox.appendChild(row);qrBox.style.display='block';sfx.lock();};
 const qrStep=()=>{if(!alive||!qrOn)return;
  if(qrShown||qrBusy||document.hidden||!v.videoWidth){qrT=setTimeout(qrStep,180);return;}
  qrBusy=1;qrDet.detect(v).then(r=>{qrBusy=0;if(!qrOn||qrShown)return;
   if(!r.length){qrQ=null;return;}
   const o=r[0],w=v.videoWidth,h=v.videoHeight;qrQ=(o.cornerPoints&&o.cornerPoints.length>=4)?o.cornerPoints.map(p=>({x:p.x/w,y:p.y/h})):null;
   qrShown=1;qrShow(o.rawValue||'');}).catch(()=>{qrBusy=0;}).then(()=>{if(qrOn)qrT=setTimeout(qrStep,qrShown?200:150);});};
 const leaveQr=()=>{qrOn=false;qrShown=0;qrQ=null;clearTimeout(qrT);qrBox.style.display='none';qrBox.textContent='';if(mode==='qr')mode='doc';};
 const enterQr=()=>{if(qrOn)return;
  if(!('BarcodeDetector' in window)){toast(T('المتصفح ده مش بيدعم قراءة QR','QR scanning is not supported here'));return;}
  try{qrDet=qrDet||mkDet();}catch(e){toast(T('المتصفح ده مش بيدعم قراءة QR','QR scanning is not supported here'));return;}
  tool='';window.__txTool=null;qrOn=true;qrShown=0;qrQ=null;mode='qr';txReset();lab();renderStrip();sfx.sel();clearTimeout(qrT);qrStep();};
 const applyTool=(id,mu)=>{
  if(qrOn)leaveQr();
  if(id==='card'){fbk=true;mu0=false;try{localStorage.setItem('tx_fb','1');localStorage.setItem('tx_multi','0');localStorage.setItem('tx_tmulti','0')}catch(e){}}
  else if(mu!=null){mu0=!!mu;}
  tool=id;window.__txTool={id:id,multi:(id==='card'&&fbk)||mu0};mode=id==='card'?'id':id==='ph'?'ph':'doc';amu=0;txReset();lab();renderStrip();sfx.sel();};
 const goKey=k=>{calmT=performance.now()+300;
  if(k==='qr'){enterQr();return;}
  if(k==='doc'||k==='tb'){
   if(qrOn)leaveQr();
   if(tool){tool='';window.__txTool=null;mode='doc';txReset();if(uiM===k){lab();renderStrip();sfx.sel();return;}}
   else if(uiM===k){lab();renderStrip();sfx.sel();return;}
   setUi(k);return;}
  applyTool(k==='id'?'card':k);};
 const HELP={
  doc:[T('مستند','Document'),[T('وجّه الكاميرا على الورقة وخلّيها كاملة جوه الشاشة.','Point the camera at the page and keep all of it in view.'),T('لما الإطار يتحول للأخضر ويثبت هيصوّر لوحده (لو التصوير التلقائي شغال).','When the outline turns green it captures by itself (if Auto-capture is on).'),T('تقدر تصوّر يدوي بزر التصوير في أي وقت، وتختار "عدة صور" لأكتر من صفحة.','Tap the shutter any time, or pick "Multiple" for several pages.')]],
  id:[T('بطاقة','ID card'),[T('حط البطاقة جوه الإطار وصوّرها بزر التصوير.','Fit the card inside the frame and tap the shutter.'),T('"وش وظهر": صوّر الوجه وبعده الظهر، وبعد الصورتين بتتجمع على صفحة واحدة.','"Front & back": capture the front, then the back; both are combined on one page.'),T('تأكد إن الإضاءة كويسة ومفيش لمعة على البطاقة.','Use good light and avoid glare on the card.')]],
  ph:[T('صورة شخصية','ID photo'),[T('خلّي وشك جوه الشكل المنقّط والكتفين تحته.','Keep your face inside the dotted outline with your shoulders below it.'),T('قدّام إضاءة واضحة وخلفية فاتحة بسيطة.','Face a clear light with a plain light background.'),T('بعد التصوير تقدر تقصّ الصورة وتظبطها.','After capture you can crop and adjust it.')]],
  tb:[T('جدول','Table'),[T('صوّر الجدول كله وخليه مستوي قدّام الكاميرا.','Capture the whole table and keep it level in front of the camera.'),T('التطبيق هيتعامل معاه كجدول بعد التصوير.','The app treats it as a table after capture.')]],
  book:[T('كتاب','Book'),[T('افتح الكتاب وصوّر الصفحتين مع بعض.','Open the book and capture both pages together.'),T('بعد التصوير بيتقسموا لصفحتين منفصلتين.','Afterwards they are split into two separate pages.')]],
  ocr:[T('استخراج نص','Text'),[T('صوّر النص المكتوب بوضوح وبإضاءة كويسة.','Capture the text clearly with good light.'),T('بعد التصوير بيتحوّل لنص تقدر تنسخه.','Afterwards it is converted to text you can copy.')]],
  qr:[T('QR','QR'),[T('وجّه الكاميرا على كود QR جوه الإطار المربع.','Point the camera at a QR code inside the square frame.'),T('بيتقرا لوحده، وتقدر تفتح الرابط أو تنسخ النص.','It is read automatically; open the link or copy the text.')]]};
 const hqb=document.createElement('button');hqb.type='button';hqb.className='hqb';hqb.textContent='?';m.querySelector('.bt').appendChild(hqb);
 const hqw=document.createElement('div');hqw.className='hqw';hqw.innerHTML='<div class="hqp"><div class="hqh"><span class="hqt"></span><button type="button" class="hqx">\u00d7</button></div><ol></ol></div>';m.appendChild(hqw);
 let hqK='';const hqp=hqw.querySelector('.hqp');
 const hqClose=()=>hqw.classList.remove('on');
 const hqOpen=k=>{const H=HELP[k];if(!H)return;hqK=k;hqw.querySelector('.hqt').textContent=H[0];const ol=hqw.querySelector('ol');ol.textContent='';H[1].forEach(t=>{const li=document.createElement('li');li.textContent=t;ol.appendChild(li);});
  const mr=m.getBoundingClientRect(),br=hqb.getBoundingClientRect();hqp.style.top='auto';hqp.style.bottom=Math.round(mr.bottom-br.top+8)+'px';hqw.classList.add('on');};
 const curKey=()=>qrOn?'qr':tool==='card'?'id':(tool||uiM);
 hqb.addEventListener('click',e=>{e.stopPropagation();hqw.classList.contains('on')?hqClose():hqOpen(curKey());});
 {let hx=null;hqw.addEventListener('pointerdown',e=>{hx=e.clientX;});
  hqw.addEventListener('pointerup',e=>{if(hx==null)return;const d=e.clientX-hx;hx=null;if(Math.abs(d)>40||!e.target.closest('.hqp')||e.target.closest('.hqx'))hqClose();});
  hqw.addEventListener('pointercancel',()=>{hx=null;});}
 let seenH=null;helpAuto=k=>{if(hqw.classList.contains('on')&&hqK!==k)hqClose();if(!seenH){seenH={};try{seenH=JSON.parse(localStorage.getItem('tx_hs')||'{}')}catch(e){}}
  if(seenH[k]||!HELP[k])return;seenH[k]=1;try{localStorage.setItem('tx_hs',JSON.stringify(seenH))}catch(e){}
  setTimeout(()=>{if(alive&&curKey()===k&&!opw.classList.contains('on'))hqOpen(k);},350);};
 const mkDet=()=>{try{return new BarcodeDetector({formats:['qr_code']})}catch(e){return new BarcodeDetector()}};
 setTimeout(()=>{try{if(alive&&'BarcodeDetector' in window)qrDet=qrDet||mkDet();}catch(e){}},1200);
 if(tool)applyTool(tool,window.__txTool.multi);else lab();
 let sw0=null;
 m.addEventListener('pointerdown',e=>{sw0=(e.target.closest('.st')&&!e.target.closest('.ops,.ts,.opw,.qres,.hqw,.hqb'))?{x:e.clientX,y:e.clientY}:null;});
 m.addEventListener('pointercancel',()=>{sw0=null;});
 m.addEventListener('pointerup',e=>{if(!sw0)return;const dx=e.clientX-sw0.x,dy=e.clientY-sw0.y;sw0=null;if(Math.abs(dx)>70&&Math.abs(dy)<45){const ck=qrOn?'qr':tool==='card'?'id':(tool||uiM),i=KEYS.indexOf(ck)+(dx<0?1:-1);if(i>=0&&i<KEYS.length)goKey(KEYS[i]);}});

 /* v76: flash suggestion tremble, press-state fix, clean page thumbnails, auto-capture suggestion */
 if(!document.getElementById('lvcss7')){const s7=document.createElement('style');s7.id='lvcss7';s7.textContent=`
#lv.v3 .ib:hover{background:rgba(6,10,22,.5);color:#fff}
#lv.v3 .ib:active{background:rgba(255,255,255,.3);color:#fff;transform:scale(.88)}
#lv.v3 .ib.on,#lv.v3 .ib.on:hover{background:rgba(34,211,245,.2);color:#22d3f5}
#lv.v3 .ib.on:active{background:rgba(34,211,245,.38);color:#7defff}
#lv.v3 .ib[data-a=f].on,#lv.v3 .ib[data-a=f].on:hover{background:rgba(34,211,245,.16);color:#22d3f5}
#lv.v3 .ib[data-a=f].on svg{fill:currentColor;filter:drop-shadow(0 0 5px rgba(34,211,245,.8))}
#lv.v3 .ib.tr svg{animation:lvtr 2.6s ease-in-out infinite}
@keyframes lvtr{0%,100%{color:#fff;filter:none;transform:none}
5%{color:#22d3f5;filter:drop-shadow(0 0 7px rgba(34,211,245,.95))}
8%{transform:translateX(-2px) rotate(-14deg)}12%{transform:translateX(2px) rotate(14deg)}16%{transform:translateX(-2px) rotate(-12deg)}20%{transform:translateX(2px) rotate(10deg)}24%{transform:translateX(-1px) rotate(-6deg)}
28%{transform:none;color:#22d3f5;filter:drop-shadow(0 0 7px rgba(34,211,245,.95))}
40%{color:#fff;filter:none}
52%{color:#22d3f5;filter:drop-shadow(0 0 6px rgba(34,211,245,.8));transform:scale(1.12)}
64%{color:#fff;filter:none;transform:none}}
@media (prefers-reduced-motion:reduce){#lv.v3 .ib.tr svg{animation:none;color:#22d3f5}}
#lv.v3 .dn>svg{display:none}
#lv.v3 .gw{position:relative;width:48px;height:60px;display:none;flex:none}
#lv.v3 .gw .dn{position:absolute;inset:0;overflow:visible}
#lv.v3 .gw:not(.m) .dn{box-shadow:none}
#lv.v3 .gw .bg{position:absolute;top:-8px;left:-8px;z-index:2;min-width:22px;height:22px;border-radius:11px;background:#ff453a;color:#fff;font:700 13px/22px system-ui;text-align:center;padding:0 5px;box-sizing:border-box;pointer-events:none;border:2px solid #050914;line-height:18px}
#lv.v3 .gw .ck{position:absolute;right:-7px;bottom:-7px;z-index:2;width:22px;height:22px;border-radius:50%;background:#22e07a;display:grid;place-items:center;pointer-events:none;border:2px solid #050914;box-sizing:border-box}
#lv.v3 .gw .ck svg{width:12px;height:12px;stroke:#04210f;stroke-width:3}
#lv.v3 .gw .dn{background-color:rgba(255,255,255,.08)}
#lv.v3 .gw.e .dn{border:1.5px dashed rgba(255,255,255,.4);background-image:none!important;box-shadow:none;backdrop-filter:blur(6px)}
#lv.v3 .gw.e .bg,#lv.v3 .gw.e .ck{display:none}
#lv.v3 .gw .phi{display:none;position:absolute;inset:0;place-items:center;pointer-events:none;color:rgba(255,255,255,.8)}
#lv.v3 .gw.e .phi{display:grid}
#lv.v3 .gw .phi svg{width:24px;height:24px;fill:none;stroke:currentColor;stroke-width:1.7}
#lv .ts{gap:7px}
#lv .ts button{width:38px;height:50px;border:1.5px solid rgba(255,255,255,.7);border-radius:7px}
#lv .ts button b{top:2px;right:2px;width:17px;height:17px;background:rgba(0,0,0,.62);font:700 12px/17px system-ui}
#lv .sug{position:absolute;left:50%;top:calc(env(safe-area-inset-top,0px) + 100px);transform:translateX(-50%) translateY(-4px);z-index:6;border:1px solid rgba(34,224,122,.55);background:rgba(6,10,22,.7);color:#bff5d6;border-radius:999px;padding:6px 13px;font:500 12px system-ui;white-space:nowrap;opacity:0;pointer-events:none;transition:opacity .25s,transform .25s}
#lv .sug.on{opacity:1;pointer-events:auto;transform:translateX(-50%)}
`;document.head.appendChild(s7);}
 const sug=document.createElement('button');sug.type='button';sug.className='sug';sug.textContent=T('التصوير التلقائي متوقف — اضغط لتفعيله','Auto-capture is off — tap to enable');m.querySelector('.st').appendChild(sug);
 let sugHide=0;const sugOff=()=>{sug.classList.remove('on');clearTimeout(sugHide);};
 sug.addEventListener('click',e=>{e.stopPropagation();auto=true;try{localStorage.setItem('tx_auto','1')}catch(x){}stable=0;lockT=0;lab();optRef();sfx.on();sugOff();});
 sugFn=st=>{if(auto){if(sug.classList.contains('on'))sugOff();return;}
  if(!st||sugN>=1||gb||Date.now()-sugT<1500)return;let n=0;try{n=+localStorage.getItem('tx_sg')||0}catch(x){}if(n>=5)return;
  sugN++;sugT=Date.now();try{localStorage.setItem('tx_sg',String(n+1))}catch(x){}sug.classList.add('on');sugHide=setTimeout(sugOff,6500);};

 /* ---- مساعد الاقتراحات (المرحلة 3، assistant.js): شريط صغير بزر قبول وزر تجاهل. القبول بس هو اللي بيبدّل الوضع؛ مفيش حاجة بتحصل تلقائي.
    الفحص كل 250ms، والقياس بس لما الكادر يقفل (stable≥2، قبل التصوير التلقائي بـ0.8 ثانية) ومرة كل 1.5 ثانية على الأكتر. الشريط بيوقّف التصوير التلقائي (armed=false) لحد ما المستخدم يرد. الصفحات المتعددة بتتبني على لقطات الجلسة (TXA.recentShots). ---- */
 if(window.TXA&&window.__edges&&window.__edges.warp){(function(){
  if(!document.getElementById('lvcss8')){const s8=document.createElement('style');s8.id='lvcss8';s8.textContent=`
#lv .asg{position:absolute;left:50%;top:calc(env(safe-area-inset-top,0px) + 140px);transform:translateX(-50%) translateY(-4px);z-index:6;max-width:94%;display:flex;align-items:center;gap:8px;border:1px solid rgba(34,211,245,.55);background:rgba(6,10,22,.8);color:#e6faff;border-radius:16px;padding:7px 8px 7px 12px;font:500 12.5px/1.35 system-ui;opacity:0;pointer-events:none;transition:opacity .25s,transform .25s}
#lv .asg.on{opacity:1;pointer-events:auto;transform:translateX(-50%)}
#lv .asg span{flex:1;min-width:0}
#lv .asg button{border:0;border-radius:999px;padding:6px 12px;font:600 12px system-ui;cursor:pointer;white-space:nowrap}
#lv .asg .y{background:#22d3f5;color:#04222a}
#lv .asg .n{background:rgba(255,255,255,.14);color:#e6faff}
`;document.head.appendChild(s8);}
  const bar=document.createElement('div');bar.className='asg';bar.setAttribute('role','status');
  const tx=document.createElement('span'),by=document.createElement('button'),bn=document.createElement('button');
  by.type=bn.type='button';by.className='y';bn.className='n';bar.append(tx,by,bn);m.querySelector('.st').appendChild(bar);
  let cur=null,busy=0,hT=0,lm=0;const shown={};
  const hide=()=>{clearTimeout(hT);bar.classList.remove('on');if(cur)armed=true;cur=null;}; /* armed: التصوير التلقائي واقف طول ما الشريط ظاهر */
  const show=s=>{cur=s;shown[s.kind]=Date.now();tx.textContent=T(s.ar,s.en);by.textContent=T('قبول','Accept');bn.textContent=T('تجاهل','Dismiss');bar.classList.add('on');armed=false;hT=setTimeout(hide,9000);};
  const TO={id:'id',table:'tb',multi:'pg'},NM={id:['وضع البطاقة','ID mode'],table:['وضع الجدول','Table mode'],multi:['وضع الصفحات','Pages mode']};
  by.onclick=e=>{e.stopPropagation();const s=cur;if(!s)return;TXA.accept(s);hide();if(s.kind==='multi'){if(!multi)setMulti(true);}else setUi(TO[s.kind]);let nm=0;
    if(s.kind==='multi'){try{if(typeof XO!=='undefined'&&!XO.num){XO.num=true;nm=1;const nb=document.getElementById('xNumB');if(nb)nb.classList.add('on');}}catch(x){}} /* 3.5: قبول الصفحات المتعددة بيفعّل ترقيم التصدير الموجود (XO.num)؛ الترتيب = ترتيب التصوير */
    toast(T('اتفعّل '+NM[s.kind][0]+(nm?' + ترقيم الصفحات':''),NM[s.kind][1]+' on'+(nm?' + page numbers':'')));};
  bn.onclick=e=>{e.stopPropagation();if(cur)TXA.dismiss(cur);hide();};
  const tick=async()=>{
    if(!alive){clearInterval(iv);bar.remove();return;}
    if(cur||busy||gb||cnt||qrOn||tool||!TXA.enabled()||document.hidden)return;
    busy=1;
    try{
      const now=Date.now(),sig={},ctx={mode:uiM,multi,shots:TXA.recentShots(now),now};
      if(last&&stable>=2&&v.videoWidth&&now-lm>1500){lm=now;
        const c=document.createElement('canvas'),W=480,H=Math.round(W*v.videoHeight/v.videoWidth);c.width=W;c.height=H;c.getContext('2d').drawImage(v,0,0,W,H);
        const w=window.__edges.warp(c,last,420),d=w.getContext('2d',{willReadFrequently:true}).getImageData(0,0,w.width,w.height);
        Object.assign(sig,TXA.measure(d.data,w.width,w.height));
        if(sig.aspect>1.3&&sig.aspect<1.95)sig.face=await TXA.face(d.data,w.width,w.height);
      }
      if(!alive||cur)return;
      const s=TXA.suggest(sig,ctx);
      if(s&&now-(shown[s.kind]||0)>60000)show(s);
    }catch(e){console.error('assistant',e);}finally{busy=0;}
  };
  const iv=setInterval(tick,250);
  setTimeout(()=>{if(alive&&TXA.enabled()&&TXAI.on())loadFace();},1500); /* في الخلفية بعد فتح الكاميرا، مش بيعطّل القياس */
 })();}

 wk=mkWorker();
  let s0;try{s0=await sp;}catch(e){alive=false;try{wk&&wk.terminate()}catch(x){}wk=null;m.remove();document.documentElement.classList.remove('txcam');toast(T('الكاميرا غير متاحة، هنفتح كاميرا الجهاز','Camera unavailable, using device camera'));nat=1;$('#camIn').click();nat=0;return;}
  if(!alive){s0.getTracks().forEach(t=>t.stop());return;}
  attach(s0);shLoop();lab();lenses();raf=requestAnimationFrame(frame);loop();
}

/* ===== v6: OCR (full page + region), text replace ===== */
const VB=new URL('vendor/',document.baseURI).href; /* نسخة محلية من tesseract (مجلد vendor) — لو مش موجودة بيرجع للـCDN */
const TU=[VB+'tesseract/tesseract.min.js','https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js'];
const loadT=async()=>{if(window.Tesseract)return window.Tesseract;for(const u of TU){try{await new Promise((ok,no)=>{const sc=document.createElement('script');sc.src=u;sc.onload=ok;sc.onerror=()=>{sc.remove();no(new Error('script'));};document.head.appendChild(sc);});if(window.Tesseract){window.__txLocal=u.indexOf(VB)===0;return window.Tesseract;}}catch(_){}}throw new Error('script blocked or offline');};
const WK={};let logCb=()=>{};let LOGMUTE=0;
const FONTS=[['Tahoma',"Tahoma,'Segoe UI',Arial,sans-serif"],['نسخ',"'Noto Naskh Arabic','Traditional Arabic',Amiri,'Times New Roman',serif"],['Arial',"Arial,Helvetica,sans-serif"],['Times',"'Times New Roman',Times,serif"],['Courier',"'Courier New',monospace"],['Cairo',TFONTS.cairo[1]],['Noto Sans Arabic',TFONTS.noto[1]],['Inter',TFONTS.inter[1]]];
function txtDraw(ctx,w,h,a){let bx=Math.min(a.x0,a.x1)*w,by=Math.min(a.y0,a.y1)*h,bw=Math.abs(a.x1-a.x0)*w,bh=Math.abs(a.y1-a.y0)*h;const cx0=bx+bw/2,cy0=by+bh/2,rt=a.rot||0;let rotd=0;
 if(Math.abs(rt)>.008){const cc=Math.abs(Math.cos(rt)),sn=Math.abs(Math.sin(rt)),dd=cc*cc-sn*sn;if(dd>.3){const L2=(bw*cc-bh*sn)/dd,H2=(bh*cc-bw*sn)/dd;if(L2>4&&H2>3){bw=L2;bh=H2;bx=-bw/2;by=-bh/2;rotd=1;}}}
 const L=a.txt.split('\n').filter(x=>x.trim()),n=Math.max(1,L.length),rtl=/[\u0600-\u06FF]/.test(a.txt),ff=(FONTS[a.ff==null?5:a.ff]||FONTS[5])[1],wt=(a.w||(a.b?800:400))+' ';
 let fs=bh/n*.8;ctx.save();if(rotd){ctx.translate(cx0,cy0);ctx.rotate(rt);}ctx.font=wt+fs+'px '+ff;const mx=Math.max(1,...L.map(l=>ctx.measureText(l).width));if(mx>bw*.98)fs*=bw*.98/mx;fs*=(a.sz||1);ctx.font=wt+fs+'px '+ff;
 ctx.direction=rtl?'rtl':'ltr';ctx.textAlign=rtl?'right':'left';ctx.textBaseline='middle';ctx.fillStyle=ctx.shadowColor=a.c;ctx.globalAlpha=.92;ctx.shadowBlur=fs*(a.bl==null?3:a.bl)*.012;
 const lh=bh/n;L.forEach((l,i)=>ctx.fillText(l,rtl?bx+bw:bx,by+lh*(i+.5)));ctx.restore();}
function closeEditDocks(){const m=document.getElementById('txS');if(m)m.remove();E.pick=null;try{sgClose();}catch(_){}try{Z.lift=0;applyZ();}catch(_){}}
setInterval(()=>{if(document.getElementById('txS')&&(V.cur!=='vEdit'||!E.page))closeEditDocks();},300);
function txtSheet(a){const p=E.page,old=document.getElementById('txS');if(old)old.remove();const ar=AR(),m=document.createElement('div');m.id='txS';m.className='tbar txdock';if(!a.c0)a.c0=a.c;
 const SWB=['#FFFFFF','#F6F1E4','#EDEDED','#FFF6BF','#DDEBFF','#222222'];
 const seg=g=>'<div class="mdl-seg" data-g="'+g+'"><button type="button" data-m="a">'+(ar?'تلقائي':'Auto')+'</button><button type="button" data-m="m">'+(ar?'أنا أختار':'Manual')+'</button></div>';
 const sws=(g,arr)=>'<div class="cgs" data-s="'+g+'" hidden>'+arr.map(c=>'<button type="button" class="sw2" data-c="'+c+'" style="background:'+c+'" aria-label="'+c+'"></button>').join('')+'<label class="sw2 cus" aria-label="'+(ar?'لون مخصص':'Custom')+'"><input type="color" data-k="'+g+'" value="#ffffff"></label>'+(g==='bg'?'<button type="button" class="txc" data-pick="1">'+(ar?'التقاط من الصفحة':'Pick from page')+'</button>':'')+'</div>';
 m.innerHTML='<div class="txhd"><div class="txcap">'+(ar?'استبدال النص في الصورة':'Replace text in image')+'</div><button type="button" class="txc" data-x="d" aria-label="'+(ar?'حذف':'Delete')+'"><svg class="i" style="width:18px;height:18px"><use href="#i-trash"/></svg></button></div>'+
 '<div class="txr1"><textarea dir="auto" rows="2"></textarea><button type="button" class="txc pri" data-x="k" style="min-height:44px;padding:0 18px">'+(ar?'تم':'Done')+'</button></div>'+
 '<div class="txr2"><button type="button" class="txc" data-p="f"><span class="txf"></span></button><button type="button" class="txc" data-p="s">'+(ar?'الحجم':'Size')+'</button><button type="button" class="txc" data-p="b">'+(ar?'التنعيم':'Blur')+'</button><button type="button" class="txc" data-p="c">'+(ar?'الألوان':'Colors')+'</button></div>'+
 '<div class="txpop" hidden><div class="pp" data-pp="f"><div id="txF"></div><div id="txW" style="margin-top:8px"></div></div><div class="pp" data-pp="s"><label class="tfs"><span>'+(ar?'الحجم':'Size')+'</span><input type="range" min="50" max="170" data-r="sz"></label></div><div class="pp" data-pp="b"><label class="tfs"><span>'+(ar?'التنعيم':'Blur')+'</span><input type="range" min="0" max="10" step=".5" data-r="bl"></label></div>'+
 '<div class="pp" data-pp="c"><div class="cg"><div class="cgt">'+(ar?'لون الخلفية':'Background')+'<small>'+(ar?'بيغطّي النص القديم':'covers the old text')+'</small></div>'+seg('bg')+sws('bg',SWB)+'</div><div class="cg" style="margin-top:12px"><div class="cgt">'+(ar?'لون النص':'Text color')+'</div>'+seg('tx')+sws('tx',COLORS.concat(['#FFFFFF']))+'</div></div></div>';
 document.body.appendChild(m);const ta=m.querySelector('textarea'),sz=m.querySelector('[data-r=sz]'),bl=m.querySelector('[data-r=bl]'),fb=m.querySelector('.txf');ta.value=a.txt;sz.value=(a.sz||1)*100;bl.value=a.bl==null?3:a.bl;
 const fc=m.querySelector('#txF'),wg=m.querySelector('#txW');
 const hex=(r,g,b)=>'#'+[r,g,b].map(v=>v.toString(16).padStart(2,'0')).join(''),toHex=c=>{if(/^#[0-9a-f]{6}$/i.test(c))return c;const t=String(c).match(/\d+/g);return t&&t.length>=3?hex(+t[0],+t[1],+t[2]):'#222222';};
 const guess=()=>{try{const c=$('#cvBase'),g=c.getContext('2d'),W=c.width,H=c.height,X0=Math.round(Math.min(a.x0,a.x1)*W),X1=Math.round(Math.max(a.x0,a.x1)*W),Y0=Math.round(Math.min(a.y0,a.y1)*H),Y1=Math.round(Math.max(a.y0,a.y1)*H),m=Math.max(3,Math.round(W*.008)),rx=clamp(X0-m,0,W-1),ry=clamp(Y0-m,0,H-1),rw=clamp(X1+m,1,W)-rx,rh=clamp(Y1+m,1,H)-ry;if(rw<1||rh<1)return '#FFFFFF';
  const d=g.getImageData(rx,ry,rw,rh).data,R=[],G=[],B=[];for(let y=0;y<rh;y++)for(let x=0;x<rw;x++){const X=rx+x,Y=ry+y;if(X>=X0&&X<X1&&Y>=Y0&&Y<Y1)continue;const i=(y*rw+x)*4;if(d[i+3]<10)continue;R.push(d[i]);G.push(d[i+1]);B.push(d[i+2]);}
  if(!R.length)return '#FFFFFF';const md=A=>(A.sort((p,q)=>p-q),A[A.length>>1]);return hex(md(R),md(G),md(B));}catch(e){return '#FFFFFF';}};
 const syc=()=>{[['bg',a.bg],['tx',a.cm?a.c:null]].forEach(([g,v])=>{const man=!!v;m.querySelectorAll('[data-g='+g+'] button').forEach(b=>b.classList.toggle('on',(b.dataset.m==='m')===man));const row=m.querySelector('[data-s='+g+']');row.hidden=!man;row.querySelectorAll('.sw2[data-c]').forEach(b=>b.classList.toggle('on',man&&b.dataset.c.toLowerCase()===String(v).toLowerCase()));if(man)row.querySelector('input[type=color]').value=toHex(v);});};
 const sy=()=>{const k=TPICK[(a.ff==null?5:a.ff)-5]||'cairo',f=TFONTS[k];fontCardsSet(fc,k);wtSet(wg,a.w||(a.b?800:400));fb.textContent=f[0].replace('Noto Sans Arabic','Noto');fb.style.fontFamily=f[1];};
 fontCards(fc,null,k=>{a.ff=5+TPICK.indexOf(k);sy();redrawOv();});wtSeg(wg,null,w=>{a.w=w;a.b=0;sy();redrawOv();});sy();syc();
 const fit=()=>{ta.style.height='auto';ta.style.height=Math.min(ta.scrollHeight+2,84)+'px';};fit();
 m._rv=()=>{const rc=$('#ov').getBoundingClientRect();txRevealRect(rc.top+Math.min(a.y0,a.y1)*rc.height,rc.top+Math.max(a.y0,a.y1)*rc.height);};
 let dt=0;const later=()=>{clearTimeout(dt);dt=setTimeout(()=>redrawOv(),90);};
 ta.oninput=()=>{fit();if(ta.value.trim()){a.txt=ta.value;redrawOv();}};sz.oninput=()=>{a.sz=sz.value/100;redrawOv();};bl.oninput=()=>{a.bl=+bl.value;redrawOv();};
 m.addEventListener('input',e=>{const t=e.target;if(t.type==='color'){if(t.dataset.k==='bg')a.bg=t.value;else{a.c=t.value;a.cm=1;}later();}});
 m.addEventListener('change',e=>{if(e.target.type==='color')syc();});
 const end=()=>{E.pick=null;m.remove();try{Z.lift=0;applyZ();}catch(_){}};
 m.onclick=e=>{const T=e.target,pk=T.closest('[data-pick]'),sg=T.closest('[data-g] button'),sw=T.closest('.sw2[data-c]'),b=T.closest('[data-p],[data-x]');
  if(pk){E.pick=ev=>{const c=$('#cvBase'),g=c.getContext('2d'),q=ptOf(ev),d=g.getImageData(Math.min(c.width-1,q[0]*c.width|0),Math.min(c.height-1,q[1]*c.height|0),1,1).data;a.bg=hex(d[0],d[1],d[2]);syc();redrawOv();};txTabIn(m,'c');toast(ar?'المس أي مكان في الصفحة لأخذ لونه':'Tap anywhere on the page to take its color');return;}
  if(sg){const g=sg.parentNode.dataset.g,man=sg.dataset.m==='m';if(g==='bg')a.bg=man?(a.bg||guess()):null;else{if(man)a.cm=1;else{a.cm=0;a.c=a.c0;}}syc();redrawOv();return;}
  if(sw){const g=sw.parentNode.dataset.s;if(g==='bg')a.bg=sw.dataset.c;else{a.c=sw.dataset.c;a.cm=1;}syc();redrawOv();return;}
  if(!b)return;if(b.dataset.p)txTabIn(m,b.dataset.p);else if(b.dataset.x==='k')end();else if(b.dataset.x==='d'){p.ann=p.ann.filter(x=>x!==a);p.hist=p.hist.filter(h=>h.a!==a);p.fut=p.fut.filter(h=>h.a!==a);end();renderEdit();syncControls();}};
 setTimeout(m._rv,60);setTimeout(m._rv,420);}
/* ===== v56: smarter OCR engine (image preparation + multi-pass + quality models) and a new extraction sheet ===== */
const OCR_LANGS=[/* add a language here and it appears in the sheet (model downloads on first use) */
 {c:'ara',ar:'العربية',en:'Arabic'},{c:'eng',ar:'الإنجليزية',en:'English'},
 {c:'fra',ar:'الفرنسية',en:'French'},{c:'deu',ar:'الألمانية',en:'German'},{c:'spa',ar:'الإسبانية',en:'Spanish'},{c:'ita',ar:'الإيطالية',en:'Italian'},
 {c:'tur',ar:'التركية',en:'Turkish'},{c:'fas',ar:'الفارسية',en:'Persian'},{c:'urd',ar:'الأردية',en:'Urdu'},{c:'rus',ar:'الروسية',en:'Russian'},{c:'por',ar:'البرتغالية',en:'Portuguese'}];
const OQ=()=>{try{return localStorage.getItem('tx_oq')==='fast'?'fast':'best';}catch(e){return 'best';}};
const LPATH_CDN={best:'https://cdn.jsdelivr.net/gh/naptha/tessdata@gh-pages/4.0.0_best',fast:'https://cdn.jsdelivr.net/gh/naptha/tessdata@gh-pages/4.0.0_fast'};
const LPATH_LOCAL={best:VB+'tessdata/best',fast:VB+'tessdata/fast'};
const wopts=q=>window.__txLocal?{workerPath:VB+'tesseract/worker.min.js',corePath:VB+'tesseract-core',langPath:LPATH_LOCAL[q]}:{langPath:LPATH_CDN[q]};
/* v159: لو ملف في كاش vendor اتخزّن غلط (صفحة HTML بدل المكتبة) بنمسحه */
async function txHealVendor(){try{for(const n of['timaxo-vendor-v1','timaxo-vendor-v2']){if(!(await caches.has(n)))continue;const c=await caches.open(n);for(const rq of await c.keys()){const rs=await c.match(rq);if(!rs||!rs.ok||/text\/html/i.test(rs.headers.get('content-type')||''))await c.delete(rq);}}}catch(e){}}
window.__txHeal=txHealVendor;
let __txBestOK=null;async function txBestLocal(){if(__txBestOK!==null)return __txBestOK;try{const r=await fetch(VB+'tessdata/best/eng.traineddata.gz',{method:'HEAD',cache:'no-store'});__txBestOK=!!(r.ok&&!/text\/html/i.test(r.headers.get('content-type')||''));}catch(e){__txBestOK=false;}return __txBestOK;}
async function getW(l,q){q=q||'fast';if(q==='best'&&window.__txLocal&&!(await txBestLocal()))q='fast'; /* v179: best مش موجود محليًا → نموذج سريع فورًا بدل محاولات فاشلة */const k=l+'|'+q;if(WK[k])return WK[k];const T=await loadT();const lg={logger:x=>{if(!LOGMUTE)logCb(x)}};
 try{return WK[k]=await T.createWorker(l,1,Object.assign(wopts(q),lg));}
 catch(e){delete WK[k];
  if(window.__txLocal&&/importScripts|NetworkError|failed to load|Failed to fetch/i.test(String(e&&e.message||e))){
   await txHealVendor();
   try{return WK[k]=await T.createWorker(l,1,Object.assign(wopts(q),lg));}catch(e2){delete WK[k];}
   try{return WK[k]=await T.createWorker(l,1,Object.assign({langPath:LPATH_CDN[q]},lg));}catch(e3){delete WK[k];} /* آخر حل: نسخة الـCDN */
  }
  if(q==='best')return getW(l,'fast');throw e;}}
window.__txWarm=async function(){await loadT();for(const q of['fast','best']){try{const w=await getW('ara+eng',q);if(q==='fast'){/* keep: used by background indexing */}}catch(_){}}return 1;};
/* ---- image preparation: evens out lighting and contrast, which is what Tesseract needs most ---- */
function ocrBox(a,w,h,r){const t=new Float32Array(w*h),o=new Float32Array(w*h),n=2*r+1;
 for(let y=0;y<h;y++){const row=y*w;let s=0;for(let x=-r;x<=r;x++)s+=a[row+Math.min(w-1,Math.max(0,x))];for(let x=0;x<w;x++){t[row+x]=s/n;s+=a[row+Math.min(w-1,x+r+1)]-a[row+Math.max(0,x-r)];}}
 const cs=new Float64Array(w);for(let y=-r;y<=r;y++){const b=Math.min(h-1,Math.max(0,y))*w;for(let x=0;x<w;x++)cs[x]+=t[b+x];}
 for(let y=0;y<h;y++){const ro=y*w,ra=Math.min(h-1,y+r+1)*w,rs=Math.max(0,y-r)*w;for(let x=0;x<w;x++){o[ro+x]=cs[x]/n;cs[x]+=t[ra+x]-t[rs+x];}}return o;}
function ocrBlurBig(a,w,h,sig){const f=Math.max(1,Math.floor(sig/8)),sw=Math.max(2,Math.ceil(w/f)),sh=Math.max(2,Math.ceil(h/f)),s=new Float32Array(sw*sh);
 for(let y=0;y<sh;y++)for(let x=0;x<sw;x++){let v=0,n=0;for(let j=0;j<f;j++){const yy=y*f+j;if(yy>=h)break;for(let i=0;i<f;i++){const xx=x*f+i;if(xx>=w)break;v+=a[yy*w+xx];n++;}}s[y*sw+x]=v/(n||1);}
 let b=s;const r=Math.max(1,Math.round(sig/f/1.8));for(let k=0;k<3;k++)b=ocrBox(b,sw,sh,r);
 const o=new Float32Array(w*h);for(let y=0;y<h;y++){const fy=Math.min(sh-1.001,Math.max(0,y/f-.5)),y0=fy|0,wy=fy-y0;for(let x=0;x<w;x++){const fx=Math.min(sw-1.001,Math.max(0,x/f-.5)),x0=fx|0,wx=fx-x0,i=y0*sw+x0;
  o[y*w+x]=b[i]*(1-wx)*(1-wy)+b[i+1]*wx*(1-wy)+b[i+sw]*(1-wx)*wy+b[i+sw+1]*wx*wy;}}return o;}
function ocrPrep(cv,mode,kk){if(kk&&kk!==1){const s2=document.createElement('canvas');s2.width=Math.max(8,Math.round(cv.width*kk));s2.height=Math.max(8,Math.round(cv.height*kk));const sx2=s2.getContext('2d');sx2.imageSmoothingQuality='high';sx2.drawImage(cv,0,0,s2.width,s2.height);cv=s2;}const w=cv.width,h=cv.height,d=cv.getContext('2d').getImageData(0,0,w,h).data,N=w*h,g=new Float32Array(N);
 const ch=mode==='chB'?2:mode==='chR'?0:-1;
 for(let i=0;i<N;i++)g[i]=ch<0?.299*d[i*4]+.587*d[i*4+1]+.114*d[i*4+2]:d[i*4+ch];if(mode==='inv')for(let i=0;i<N;i++)g[i]=255-g[i];
 let n=g;
 if(mode==='flat'||mode==='flat40'||mode==='chB'||mode==='chR'||mode==='inv'||mode==='bin'){const sig=mode==='flat40'?Math.max(w,h)/40:Math.max(w,h)/12,bg=ocrBlurBig(g,w,h,sig);n=new Float32Array(N);for(let i=0;i<N;i++){const v=g[i]/(bg[i]+1)*200;n[i]=v>255?255:v;}}
 const hs=new Uint32Array(256);for(let i=0;i<N;i++)hs[Math.max(0,Math.min(255,n[i]|0))]++;let a=0,lo=0,hi=255;for(let i=0;i<256;i++){a+=hs[i];if(a>=N*.01){lo=i;break;}}a=0;for(let i=255;i>=0;i--){a+=hs[i];if(a>=N*.01){hi=i;break;}}
 const sc=255/Math.max(20,hi-lo),o=document.createElement('canvas');o.width=w;o.height=h;const x=o.getContext('2d'),im=x.createImageData(w,h),p=im.data;
 for(let i=0;i<N;i++){let v=(n[i]-lo)*sc;v=v<0?0:v>255?255:v;if(mode==='bin')v=v<150?0:255;p[i*4]=p[i*4+1]=p[i*4+2]=v;p[i*4+3]=255;}
 x.putImageData(im,0,0);return o;}
const ocrWords=r=>{let W=r&&r.data&&r.data.words;if(!W||!W.length){W=[];((r&&r.data&&r.data.lines)||[]).forEach(l=>(l.words||[]).forEach(w=>W.push(w)));}return W;};
const ocrScore=W=>{let tot=0,n=0,s=0;for(const w of W){const c=w.confidence,t=(w.text||'').trim();if(c>=50&&/[\p{L}\p{N}]/u.test(t)){tot+=c/100*Math.min(t.length,10);n++;s+=c;}}return{tot,n,mean:n?s/n:0};};
function ocrText(r,minConf){const Ls=(r&&r.data&&r.data.lines)||[];let T='';
 if(Ls.length){T=Ls.map(l=>{const ws=(l.words||[]).filter(w=>w.confidence>=minConf&&/[\p{L}\p{N}]/u.test(w.text||''));return ws.map(w=>w.text).join(' ').trim();}).filter(s=>s&&/[\p{L}\p{N}]{2}|^[\p{L}\p{N}]$/u.test(s)).join('\n');}
 else T=((r&&r.data&&r.data.text)||'').trim();return T;}
/* v59: parallel band recognition (2-3 workers) — big speed-up on multi-core phones */
const WPN=()=>{const hc=navigator.hardwareConcurrency||4,dm=navigator.deviceMemory||4;return dm<3?1:Math.max(1,Math.min(3,hc-2));};
async function getPool(lang,q,n){const out=[await getW(lang,q)];if(n<2)return out;const T=await loadT(),k=lang+'|'+q+'|x';WK[k]=WK[k]||[];const need=n-1-WK[k].length;
 if(need>0){const mk=[];for(let i=0;i<need;i++)mk.push(T.createWorker(lang,1,wopts(q)).catch(()=>null));(await Promise.all(mk)).forEach(w=>w&&WK[k].push(w));}
 return out.concat(WK[k].slice(0,n-1));}
function ocrSplit(pc,n){const w=pc.width,h=pc.height;if(n<2||h<1100)return[[0,h]];const d=pc.getContext('2d').getImageData(0,0,w,h).data,row=new Float32Array(h);
 for(let y=0;y<h;y++){let s=0;for(let x=0,i=y*w*4;x<w;x+=2,i+=8)if(d[i]<110)s++;row[y]=s;}
 const cuts=[0];for(let i=1;i<n;i++){const t=h*i/n,lo=Math.max(cuts[cuts.length-1]+300,t-h*.1|0),hi=Math.min(h-300,t+h*.1|0);if(hi<=lo)continue;let by=-1,bv=1e9;for(let y=lo;y<hi;y++){const v=row[y-1]+row[y]+row[y+1];if(v<bv){bv=v;by=y;}}if(by>0&&bv/3<w*.02)cuts.push(by);}
 cuts.push(h);const o=[];for(let i=0;i<cuts.length-1;i++)o.push([cuts[i],cuts[i+1]]);return o;}
async function ocrRec(wk,pc,lang,q,psm){
 const n=WPN();if(n<2||pc.height<1100)return wk.recognize(pc);const bands=ocrSplit(pc,n);if(bands.length<2)return wk.recognize(pc);
 let ws;try{ws=await getPool(lang,q,bands.length);}catch(_){return wk.recognize(pc);}if(ws.length<2)return wk.recognize(pc);
 LOGMUTE=1;try{
  await Promise.all(ws.map(w=>w.setParameters({tessedit_pageseg_mode:psm,preserve_interword_spaces:'1',user_defined_dpi:'300'}).catch(()=>{})));
  let k=0;const R=await Promise.all(bands.map((b,i)=>{const c=document.createElement('canvas');c.width=pc.width;c.height=b[1]-b[0];c.getContext('2d').drawImage(pc,0,b[0],pc.width,c.height,0,0,pc.width,c.height);
   return ws[i%ws.length].recognize(c).then(r=>{k++;try{logCb({status:'recognizing text',progress:k/bands.length});}catch(_){}return{r,y:b[0]};});}));
  const sh=(b,y)=>b&&{x0:b.x0,x1:b.x1,y0:b.y0+y,y1:b.y1+y},lines=[],words=[];let text='';
  for(const{r,y}of R){const d=r.data||{};text+=(d.text||'').replace(/\s+$/,'')+'\n';
   if(d.lines&&d.lines.length)d.lines.forEach(l=>{const L={...l,bbox:sh(l.bbox,y),words:(l.words||[]).map(w=>({...w,bbox:sh(w.bbox,y)}))};lines.push(L);L.words.forEach(w=>words.push(w));});
   else(d.words||[]).forEach(w=>words.push({...w,bbox:sh(w.bbox,y)}));}
  return{data:{text,lines,words}};
 }finally{LOGMUTE=0;}}
/* runs 1-2 passes (more in deep mode) over differently prepared copies of the image and keeps the one Tesseract trusts most */
const OCRMEM=new Map();
window.__txOB=0;async function ocrRun(cv,lang,q,psm,deep,stage,isDead){window.__txOB++;try{return await ocrRun0(cv,lang,q,psm,deep,stage,isDead);}finally{window.__txOB--;}}
window.__txFreeOcr=function(){if(window.__txOB>0)return false;for(const k in WK){try{const w=WK[k];delete WK[k];w&&w.terminate&&w.terminate();}catch(_){}}try{window.TXOnnx&&TXOnnx.free&&TXOnnx.free();}catch(_){}return true;};
async function ocrRun0(cv,lang,q,psm,deep,stage,isDead){
 const wk=await getW(lang,q),sp=psm==='6'?'6':'11',R=[];let pc1=null,idx=0;
 const plan=deep?[{m:'flat',k:1,p:psm},{m:'plain',k:1,p:psm},{m:'flat',k:.4,p:sp},{m:'flat',k:.22,p:sp},{m:'inv',k:1,p:sp},{m:'bin',k:.5,p:sp},{m:'flat40',k:1,p:psm},{m:'chB',k:1,p:psm}]:[];
 const run=async v=>{if(isDead())return false;stage(idx++,deep?plan.length:3);
  try{await wk.setParameters({tessedit_pageseg_mode:v.p,preserve_interword_spaces:'1',user_defined_dpi:'300'});}catch(_){}
  const pc=ocrPrep(cv,v.m,v.k);if(v.m==='flat'&&v.k===1&&!pc1)pc1=pc;await new Promise(r=>setTimeout(r,0));
  const r=await ocrRec(wk,pc,lang,q,v.p);if(isDead())return false;
  const W=ocrWords(r);R.push({r,W,N:ocrNorm(W,v.k,0),sc:ocrScore(W),v:v.m,k:v.k});return true;};
 const top=()=>R.reduce((a,x)=>!a||x.sc.tot>a.sc.tot?x:a,null);
 if(deep){const t0=Date.now();let k=0;for(const v of plan){
   if(k>=2){const b=top();if(b){const ms=Date.now()-t0,miss=ocrMiss(pc1,b.N);
    if(b.sc.mean>=88&&b.sc.n>=8&&miss<.04)break; /* v174: ثقة عالية = كفاية */
    if(k>=3&&b.sc.mean>=80&&miss<.08)break;
    if(ms>16000&&b.sc.mean>=70)break; /* ميزانية وقت */}}
   if(!await run(v))return null;k++;}}
 else{
  if(!await run({m:'flat',k:1,p:psm}))return null;
  let b=top(),miss=ocrMiss(pc1,b.N),weak=b.sc.mean<82||b.sc.n<10;const hs=b.N.map(w=>w.y1-w.y0).sort((x,y)=>x-y),small=psm!=='6'&&hs.length>5&&hs[hs.length>>1]<17&&cv.width<2600;
  /* small text (dense pages, Arabic dots) reads better enlarged */
  if(small){if(!await run({m:'flat',k:1.6,p:psm}))return null;b=top();weak=b.sc.mean<82||b.sc.n<10;miss=ocrMiss(pc1,b.N);}
  /* big / decorative text is usually missed at full size: retry on a shrunk copy with sparse-text mode */
  if((weak||miss>.06)&&!(psm==='6'&&b.sc.n>=1&&b.sc.mean>=70)){if(!await run({m:'flat',k:.4,p:sp}))return null;b=top();
   if(b.sc.mean<80||b.sc.n<8){if(!await run({m:'plain',k:1,p:psm}))return null;}}
 }
 const P=top(),mg=ocrMerge(P.N,R.filter(x=>x!==P).map(x=>x.N.filter(w=>w.c>=55)));
 return{r:P.r,W:P.W,sc:P.sc,v:P.v,M:mg.M,pc:pc1,T:mg.changed?(P.k===1?ocrCompose(P,mg.added):tbText(mg.M.filter(w=>w.c>=35),null)):null};}
$('#pPage .pgact').insertAdjacentHTML('beforeend','<button class="pa" id="ocrB"><svg class="i"><use href="#i-ocr"/></svg><span>'+(AR()?'استخراج النص':'Extract text')+'</span></button>');
$('#ocrB').onclick=()=>{if(E.page)ocrModal(E.page,null);};
$('#pPage .pgact').insertAdjacentHTML('beforeend','<button class="pa" id="ltBtn"><svg class="i"><use href="#i-live"/></svg><span>'+(AR()?'نص حي':'Live text')+'</span></button>');
$('#ltBtn').onclick=()=>{if(E.page)liveText(E.page);};
if(!document.getElementById('oxcss')){const s=document.createElement('style');s.id='oxcss';s.textContent=`
.ox{gap:10px}
.ox-h{display:flex;align-items:center;gap:11px}
.ox-ic{width:42px;height:42px;border-radius:14px;display:grid;place-items:center;flex:none;color:#fff;background:var(--grad,linear-gradient(135deg,#1B63F0,#22D3F5));box-shadow:0 6px 16px -6px var(--accent,#1b63f0)}
.ox-ic svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.ox-langs{display:flex;gap:6px;overflow-x:auto;padding:2px 1px 4px;margin:0 -2px;scrollbar-width:none;flex:none}
.ox-langs::-webkit-scrollbar{display:none}
.ox-chip{flex:none;min-height:36px;padding:0 14px;border-radius:999px;border:1.5px solid var(--line);background:transparent;color:var(--ink);font:700 13px system-ui;display:flex;align-items:center;gap:6px;transition:background .15s,border-color .15s,color .15s,transform .1s}
.ox-chip:active{transform:scale(.95)}
.ox-chip.on{background:var(--accent,#1b63f0);border-color:var(--accent,#1b63f0);color:#fff}
.ox-chip.auto.on{background:var(--grad,linear-gradient(135deg,#1B63F0,#22D3F5));border-color:transparent}
.ox-chip.more{color:var(--ink2);border-style:dashed}
.ox-more{display:flex;flex-wrap:wrap;gap:6px;flex:none}
.ox-more[hidden]{display:none}
.ox-run{display:flex;gap:12px;align-items:center;padding:10px;border-radius:18px;background:var(--surface2);flex:none}
.ox-run[hidden]{display:none}
.ox-th{position:relative;width:62px;height:82px;border-radius:10px;overflow:hidden;flex:none;background:#fff;box-shadow:0 4px 12px -4px #0007}
.ox-th canvas{width:100%;height:100%;object-fit:cover;display:block}
.ox-th::after{content:'';position:absolute;inset-inline:0;height:26%;top:-26%;background:linear-gradient(180deg,transparent,rgba(34,211,245,.55));border-bottom:2px solid #22d3f5;animation:oxb 1.5s ease-in-out infinite}
.ox-th.done::after{display:none}
@keyframes oxb{to{top:100%}}
.ox-rt{flex:1;min-width:0}
.ox-rt b{display:block;font:800 14px/1.3 system-ui;color:var(--ink)}
.ox-rt span{display:block;margin-top:2px;font:600 12px/1.4 system-ui;color:var(--ink2)}
.ox-pb{height:5px;border-radius:3px;background:var(--line);overflow:hidden;margin-top:8px}
.ox-pb i{display:block;height:100%;width:0;border-radius:3px;background:var(--grad,linear-gradient(90deg,#1b63f0,#22d3f5));transition:width .25s}
.ox-res{display:flex;flex-direction:column;gap:8px;min-height:0;flex:1 1 auto;overflow:auto}
.ox-res[hidden]{display:none}
.ox-meta{display:flex;gap:6px;flex-wrap:wrap;align-items:center;flex:none}
.ox-b{display:inline-flex;align-items:center;gap:5px;height:26px;padding:0 10px;border-radius:13px;font:700 12px system-ui;background:var(--surface2);color:var(--ink2)}
.ox-b.q{color:#fff}.ox-b.q.g{background:#16a34a}.ox-b.q.m{background:#d97706}.ox-b.q.l{background:#dc2626}
.ox-note{font:600 12px/1.5 system-ui;color:var(--ink2)}
.ox-acts{display:flex;gap:8px;flex:none}
.ox-acts[hidden]{display:none}
.ox-btn{height:48px;border-radius:16px;padding:0 16px;font:800 14px system-ui;display:flex;align-items:center;justify-content:center;gap:7px;background:var(--surface2);color:var(--ink);transition:transform .1s}
.ox-btn:active{transform:scale(.96)}
.ox-btn.pri{flex:1;background:var(--grad,linear-gradient(135deg,#1B63F0,#22A8F5));color:#fff;box-shadow:0 8px 18px -8px var(--accent,#1b63f0)}
.ox-btn svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.ox-btn[hidden]{display:none}
.ox .ocx{order:0;margin-top:0}
#oHint{position:fixed;top:0;left:0;z-index:8500;pointer-events:auto;height:32px;min-width:32px;padding:0 10px;border-radius:16px;display:flex;align-items:center;justify-content:center;gap:6px;background:rgba(10,18,34,.78);color:#fff;border:1px solid rgba(34,211,245,.55);font:700 12px system-ui;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);opacity:0;transform:translateY(-6px) scale(.92);transition:opacity .35s,transform .35s,padding .3s;touch-action:none;box-shadow:0 0 0 0 rgba(34,211,245,.5)}
#oHint.in{opacity:1;transform:none;animation:ohp 2.2s ease-out 1}
#oHint.min{padding:0;width:32px;opacity:.62}
#oHint.min span{display:none}
#oHint svg{width:16px;height:16px;fill:none;stroke:#22d3f5;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round;flex:none}
@keyframes ohp{0%{box-shadow:0 0 0 0 rgba(34,211,245,.55)}70%{box-shadow:0 0 0 10px rgba(34,211,245,0)}100%{box-shadow:0 0 0 0 rgba(34,211,245,0)}}
`;document.head.appendChild(s);}
const OX_SVG={scan:'<svg viewBox="0 0 24 24"><path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3"/><path d="M9 9h6M12 9v6"/></svg>',
 copy:'<svg viewBox="0 0 24 24"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h8"/></svg>',
 share:'<svg viewBox="0 0 24 24"><path d="M12 15V3M8 7l4-4 4 4M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/></svg>',
 dl:'<svg viewBox="0 0 24 24"><path d="M12 3v12M8 11l4 4 4-4M5 19h14"/></svg>',
 redo:'<svg viewBox="0 0 24 24"><path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"/></svg>',
 x:'<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>',
 plus:'<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
 tr:'<svg viewBox="0 0 24 24"><path d="M4 5h9M8.5 3v2M6 5c.5 4 3 7 6.5 9M12.5 5c-.5 4-3.5 7.5-8 9.5M13 20l4-9 4 9M14.5 17h5"/></svg>',
 more:'<svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="19" cy="12" r="1.7"/></svg>',
 sel:'<svg viewBox="0 0 24 24"><path d="M5 4h4M5 20h4M15 4h4M15 20h4M12 4v16"/></svg>',
 doc:'<svg viewBox="0 0 24 24"><path d="M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6"/></svg>',
 tbl:'<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M9 5v14M15 5v14"/></svg>',
 cog:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4"/></svg>'};
/* ===== v57: merge passes + tables (detect > editable grid > copy / Excel / Word) ===== */
function ocrNorm(W,k,minC){return(W||[]).filter(w=>w&&w.bbox&&(w.text||'').trim()&&w.confidence>=minC&&/[\p{L}\p{N}]/u.test(w.text)).map(w=>({t:w.text.trim(),x0:w.bbox.x0/k,y0:w.bbox.y0/k,x1:w.bbox.x1/k,y1:w.bbox.y1/k,c:w.confidence}));}
function ocrCov(a,b){const ix=Math.min(a.x1,b.x1)-Math.max(a.x0,b.x0),iy=Math.min(a.y1,b.y1)-Math.max(a.y0,b.y0);if(ix<=0||iy<=0)return 0;return ix*iy/Math.max(1,Math.min((a.x1-a.x0)*(a.y1-a.y0),(b.x1-b.x0)*(b.y1-b.y0)));}
function ocrMerge(P,Es){let M=P.slice(),ch=false;const added=[];
 for(const E of Es)for(const e of E){if(e.c<55)continue;const hit=M.filter(m=>ocrCov(m,e)>.3);
  if(!hit.length){M.push(e);added.push(e);ch=true;}
  else if(e.c>=70&&hit.every(m=>m.c<e.c-15)){M=M.filter(m=>!hit.includes(m));M.push(e);added.push(e);ch=true;}}
 return{M,changed:ch,added};}
function ocrMiss(pc,N){try{const w=pc.width,h=pc.height,d=pc.getContext('2d').getImageData(0,0,w,h).data,cov=new Uint8Array(w*h);
 for(const b of N){const x0=Math.max(0,(b.x0|0)-2),x1=Math.min(w-1,(b.x1|0)+2),y0=Math.max(0,(b.y0|0)-2),y1=Math.min(h-1,(b.y1|0)+2);for(let y=y0;y<=y1;y++)cov.fill(1,y*w+x0,y*w+x1+1);}
 let tot=0,un=0;for(let i=0;i<w*h;i++)if(d[i*4]<110){tot++;if(!cov[i])un++;}return tot>200?un/tot:0;}catch(e){return 0;}}
function ocrCompose(P,extra){const Ls=((P.r&&P.r.data&&P.r.data.lines)||[]).map(l=>{const ws=(l.words||[]).filter(w=>w.confidence>=35&&/[\p{L}\p{N}]/u.test(w.text||'')),bb=l.bbox||{x0:0,y0:0,x1:0,y1:0};
  return{t:ws.map(w=>w.text).join(' ').trim(),cy:(bb.y0+bb.y1)/2,x0:bb.x0,x1:bb.x1,y0:bb.y0,y1:bb.y1,c:ws.length?Math.max(...ws.map(w=>w.confidence)):0};}).filter(l=>l.t&&/[\p{L}\p{N}]{2}|^[\p{L}\p{N}]$/u.test(l.t));
 for(const el of tbLines(extra)){const bb={x0:Math.min(...el.w.map(w=>w.x0)),x1:Math.max(...el.w.map(w=>w.x1)),y0:Math.min(...el.w.map(w=>w.y0)),y1:Math.max(...el.w.map(w=>w.y1))};
  for(let i=Ls.length-1;i>=0;i--)if(Ls[i].c<60&&ocrCov(Ls[i],bb)>.3)Ls.splice(i,1);
  const t=tbText(el.w,null);let at=0;for(let i=0;i<Ls.length;i++)if(Ls[i].cy<el.cy)at=i+1;Ls.splice(at,0,{t,cy:el.cy,c:100});}
 return Ls.map(l=>l.t).join('\n');}
const tbIsAr=s=>(s.match(/[\u0600-\u06FF]/g)||[]).length>(s.match(/[A-Za-z]/g)||[]).length;
const tbDigits=s=>String(s).replace(/[\u0660-\u0669]/g,c=>String(c.charCodeAt(0)-1632)).replace(/[\u06f0-\u06f9]/g,c=>String(c.charCodeAt(0)-1776));
function tbMedian(a){if(!a.length)return 0;const b=a.slice().sort((x,y)=>x-y);return b[b.length>>1];}
function tbLines(ws){const s=ws.slice().sort((a,b)=>(a.y0+a.y1)-(b.y0+b.y1)),L=[];
 for(const w of s){const cy=(w.y0+w.y1)/2,h=w.y1-w.y0,ln=L[L.length-1];
  if(ln&&Math.abs(cy-ln.cy)<Math.max(ln.h,h)*.5){ln.w.push(w);ln.cy=(ln.cy*(ln.w.length-1)+cy)/ln.w.length;ln.h=Math.max(ln.h,h);}else L.push({w:[w],cy,h});}
 return L;}
function tbText(ws,rtl){return tbLines(ws).map(l=>{const r=typeof rtl==='boolean'?rtl:tbIsAr(l.w.map(w=>w.t).join(' '));return l.w.slice().sort((p,q)=>r?q.x0-p.x0:p.x0-q.x0).map(w=>w.t).join(' ');}).join('\n');}
function tbCols(ws,x0,x1,nR){const W=Math.max(1,Math.round(x1-x0)+1),cov=new Uint16Array(W);
 for(const w of ws)for(let x=Math.max(0,Math.floor(w.x0-x0));x<=Math.min(W-1,Math.floor(w.x1-x0));x++)cov[x]++;
 const mh=tbMedian(ws.map(w=>w.y1-w.y0)),minGap=Math.max(6,mh*.7),thr=Math.floor(nR*.12),cut=[x0];let x=0;
 while(x<W){if(cov[x]<=thr){const s=x;while(x<W&&cov[x]<=thr)x++;if(s>0&&x<W&&x-s>=minGap)cut.push(x0+Math.round((s+x)/2));}else x++;}
 cut.push(x1+1);return cut;}
/* finds ruled tables: groups long horizontal lines with the same extent, then vertical lines between them */
function tbGrid(cv,pc){pc=pc||ocrPrep(cv,'flat');const w=pc.width,h=pc.height,d=pc.getContext('2d').getImageData(0,0,w,h).data,minL=Math.max(90,w*.15),H=[];
 for(let y=0;y<h;y++){let st=-1,last=-1,b=0,bs=0,be=0;const o=y*w;
  for(let x=0;x<w;x++){if(d[(o+x)*4]<150){if(st<0)st=x;last=x;}else if(st>=0&&x-last>3){if(last-st+1>b){b=last-st+1;bs=st;be=last;}st=-1;}}
  if(st>=0&&last-st+1>b){b=last-st+1;bs=st;be=last;}
  if(b>=minL)H.push({y,x0:bs,x1:be});}
 if(H.length<2)return null;
 const C=[];for(const l of H){const c=C[C.length-1];if(c&&l.y-c.y1<=3){c.y1=l.y;c.x0=Math.min(c.x0,l.x0);c.x1=Math.max(c.x1,l.x1);}else C.push({y0:l.y,y1:l.y,x0:l.x0,x1:l.x1});}
 const T=C.filter(c=>c.y1-c.y0<=12);let grp=[];for(const a of T){const g=T.filter(b=>Math.abs(b.x0-a.x0)<w*.04&&Math.abs(b.x1-a.x1)<w*.04);if(g.length>grp.length)grp=g;}
 if(grp.length<2)return null;
 const x0=Math.min(...grp.map(c=>c.x0)),x1=Math.max(...grp.map(c=>c.x1)),ya=grp[0].y0,yb=grp[grp.length-1].y1,hh=yb-ya;if(hh<24)return null;
 const ys=grp.map(c=>(c.y0+c.y1)/2),V=[];
 for(let x=x0;x<=x1;x++){let n=0;for(let y=ya;y<=yb;y++)if(d[(y*w+x)*4]<150)n++;if(n>=hh*.6)V.push(x);}
 const VC=[];for(const x of V){const c=VC[VC.length-1];if(c&&x-c.b<=3){c.b=x;}else VC.push({a:x,b:x});}
 let xs=VC.map(c=>(c.a+c.b)/2);
 if(xs.length>=2){if(xs[0]-x0>14)xs.unshift(x0);if(x1-xs[xs.length-1]>14)xs.push(x1+1);}else xs=null;
 return{ys,xs,x0,x1,ya,yb};}
function tbBuild(M,cv,pc){const ws=M.filter(w=>w.c>=30&&(w.y1-w.y0)>4);if(ws.length<4)return null;
 const rtl=tbIsAr(ws.map(w=>w.t).join(' '));let g=null;try{g=tbGrid(cv,pc);}catch(e){}
 /* v160: محرك البنية الجديد (table-engine.js): خطوط بالتباين + دمج خلايا + جداول متعددة. لو ماطلعش حاجة بنكمّل بالكشف القديم */
 try{const E2=window.TXTable;if(E2){const p2=pc||ocrPrep(cv,'flat'),R2=E2.detect(p2.getContext('2d').getImageData(0,0,p2.width,p2.height)),outs=[],usedH=new Set();let ci=null;try{if(cv.width===p2.width&&cv.height===p2.height)ci=cv.getContext('2d').getImageData(0,0,cv.width,cv.height);}catch(_){}
  for(const t of R2.tables){const bx=t.box,iw=ws.filter(w=>{const cx=(w.x0+w.x1)/2,cy=(w.y0+w.y1)/2;return cx>=bx.x0-3&&cx<=bx.x1+3&&cy>=bx.y0-3&&cy<=bx.y1+3;});
   if(iw.length<3)continue;E2.fill(t,iw,rtl,tbText);const f=t.cells.filter(c=>c.t).length;if(f<Math.max(3,t.cells.length*.2))continue;
   try{E2.attachHeader(t,ws.filter(w=>!usedH.has(w)),rtl,tbText).forEach(w=>usedH.add(w));}catch(_){}
   if(ci){try{E2.styles(t,ci);}catch(_){}}const gr=E2.grid(t,rtl);if(gr.nR<2||gr.nC<2)continue;
   outs.push({rows:gr.rows,rtl,ruled:true,strong:true,engine:2,spans:gr.spans,voids:gr.voids,st:gr.st,colW:gr.colW,rowH:gr.rowH,nR:gr.nR,nC:gr.nC,y0:t.box.y0,before:[],tail:[],nf:f,boxes:gr.boxes.map((r,i)=>r.map(b2=>b2||{x0:0,x1:0,y0:t.ys[i],y1:t.ys[i+1]}))});}
  if(outs.length){
   /* النص اللي برا الجداول (عناوين/ملاحظات/توقيعات) بيتحفظ في مكانه بين الجداول وبيتكتب في Word */
   try{const inT=w=>{const cx=(w.x0+w.x1)/2,cy=(w.y0+w.y1)/2;return R2.tables.some(t=>cx>=t.box.x0-4&&cx<=t.box.x1+4&&cy>=t.box.y0-4&&cy<=t.box.y1+4);};
    const ow=M.filter(w=>w.c>=55&&(w.y1-w.y0)>4&&!inT(w)&&!usedH.has(w)),mh=tbMedian(ow.map(w=>w.y1-w.y0)),W0=p2.width,segs=[];
    for(const ln of tbLines(ow)){const sw=ln.w.slice().sort((a,b)=>a.x0-b.x0),ls=[];let cur=[sw[0]];for(let i=1;i<sw.length;i++){if(sw[i].x0-cur[cur.length-1].x1>Math.max(40,ln.h*3)){ls.push({w:cur,cy:ln.cy,h:ln.h});cur=[];}cur.push(sw[i]);}ls.push({w:cur,cy:ln.cy,h:ln.h});if(rtl)ls.reverse();segs.push(...ls);}
    for(const sg of segs){const t=tbText(sg.w,null).trim();if(!t)continue;const x0=Math.min(...sg.w.map(w=>w.x0)),x1=Math.max(...sg.w.map(w=>w.x1)),mid=(x0+x1)/2,al=Math.abs(mid-W0/2)<W0*.1&&(x1-x0)<W0*.8?'c':(mid<W0/2?'l':'r'),k=outs.findIndex(o=>sg.cy<o.y0),it={t,al,big:sg.h>mh*1.35};(k<0?outs[outs.length-1].tail:outs[k].before).push(it);}}catch(e){console.warn('tbl-out',e);}
   const P=outs.reduce((m,o)=>o.nf>m.nf?o:m);P.all=outs;return P;}}}catch(e){console.warn('tbl2',e);}
 let ys=null,xs=null,x0,x1,ruled=false,inw=ws;
 if(g){inw=ws.filter(w=>{const cx=(w.x0+w.x1)/2,cy=(w.y0+w.y1)/2;return cx>=g.x0-4&&cx<=g.x1+4&&cy>=g.ya-4&&cy<=g.yb+4;});
  if(inw.length>=3){x0=g.x0;x1=g.x1;xs=g.xs;if(g.ys.length>=3){ys=g.ys;ruled=true;}}else{g=null;inw=ws;}}
 if(!ys){const ln=tbLines(inw);if(ln.length<3)return null;
  if(!g){x0=Math.min(...inw.map(w=>w.x0));x1=Math.max(...inw.map(w=>w.x1));}
  ys=[ln[0].cy-ln[0].h];for(let i=0;i<ln.length-1;i++)ys.push((ln[i].cy+ln[i+1].cy)/2);ys.push(ln[ln.length-1].cy+ln[ln.length-1].h);}
 if(!xs)xs=tbCols(inw,x0,x1,ys.length-1);
 const nR=ys.length-1,nC=xs.length-1;if(nC<2||nR<2)return null;
 const cell=Array.from({length:nR},()=>Array.from({length:nC},()=>[])),fi=(a,v)=>{for(let i=0;i<a.length-1;i++)if(v>=a[i]&&v<a[i+1])return i;return-1;};
 for(const w of inw){const r=fi(ys,(w.y0+w.y1)/2),c=fi(xs,(w.x0+w.x1)/2);if(r>=0&&c>=0)cell[r][c].push(w);}
 if(ruled){const f=cell.flat().filter(c=>c.length).length;if(f<Math.max(3,nR*nC*.2))return null;}
 else{const mu=cell.filter(r=>r.filter(c=>c.length).length>=2).length;if(mu<3||mu<nR*.6)return null;}
 const rows=cell.map(r=>r.map(c=>tbText(c,rtl))),kc=[],kr=[];
 for(let c=0;c<nC;c++)if(rows.some(r=>r[c]))kc.push(c);for(let r=0;r<nR;r++)if(rows[r].some(x=>x))kr.push(r);
 if(kc.length<2||kr.length<2)return null;if(rtl)kc.reverse();
 return{rows:kr.map(r=>kc.map(c=>rows[r][c])),rtl,ruled,strong:ruled||(kr.length>=4&&kc.length>=3),boxes:kr.map(r=>kc.map(c=>({x0:xs[c],x1:xs[c+1],y0:ys[r],y1:ys[r+1]})))};}
/* re-reads every cell on its own (zoomed, one block) which is the most accurate way for numbers */
async function tbRefine(cv,tb,lang,q,prog,isDead){const wk=await getW(lang,q);try{await wk.setParameters({tessedit_pageseg_mode:'6',preserve_interword_spaces:'1',user_defined_dpi:'300'});}catch(_){}
 const f=ocrPrep(cv,'flat'),fx=f.getContext('2d'),tot=tb.boxes.length*tb.boxes[0].length,mh=tbMedian(tb.boxes.map(r=>r[0].y1-r[0].y0));let n=0;const out=[];
 for(const row of tb.boxes){const o=[];for(const b of row){if(isDead())return null;
  const ins=5,x0=Math.max(0,Math.round(b.x0+ins)),y0=Math.max(0,Math.round(b.y0+ins)),sw=Math.min(Math.round(b.x1-b.x0-ins*2),f.width-x0),sh=Math.min(Math.round(b.y1-b.y0-ins*2),f.height-y0);let txt='';
  if(sw>=10&&sh>=8){const dd=fx.getImageData(x0,y0,sw,sh).data;let dk=0;for(let i=0;i<dd.length;i+=4)if(dd[i]<130)dk++;
   if(dk>sw*sh*.004){const k=Math.max(1,Math.min(4,90/sh)),pd=16,c=document.createElement('canvas');c.width=Math.round(sw*k)+pd*2;c.height=Math.round(sh*k)+pd*2;const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.imageSmoothingQuality='high';x.drawImage(f,x0,y0,sw,sh,pd,pd,sw*k,sh*k);
    txt=ocrText(await wk.recognize(c),25);}}
  o.push(txt.replace(/\s*\n\s*/g,sh>mh*2.2?'\n':' ').trim());n++;prog(n/tot);await new Promise(r=>setTimeout(r,0));}out.push(o);}
 return out;}
/* v171: re-read ONE cell with 2 engines (modern ONNX on original+flat crops, Tesseract), pick best by confidence, keep the others as alternatives */
const TBFLAT=new WeakMap();
async function tbRefineOne(cv,b0,tb,lang,q,pcw){let f=TBFLAT.get(cv);if(!f){f=ocrPrep(cv,'flat');TBFLAT.set(cv,f);}
 const sc=pcw&&Math.abs(cv.width/pcw-1)>.02?cv.width/pcw:1,b={x0:b0.x0*sc,y0:b0.y0*sc,x1:b0.x1*sc,y1:b0.y1*sc},ins=Math.max(4,Math.min(b.x1-b.x0,b.y1-b.y0)*.05),
  x0=Math.max(0,Math.round(b.x0+ins)),y0=Math.max(0,Math.round(b.y0+ins)),sw=Math.min(Math.round(b.x1-b.x0-ins*2),f.width-x0),sh=Math.min(Math.round(b.y1-b.y0-ins*2),f.height-y0);
 if(sw<10||sh<8)return{t:'',alts:[]};
 const fx=f.getContext('2d'),dd=fx.getImageData(x0,y0,sw,sh).data;let dk=0;for(let i=0;i<dd.length;i+=4)if(dd[i]<130)dk++;if(dk<=sw*sh*.003)return{t:'',alts:[]};
 const mh=tbMedian(tb.boxes.map(r=>(r[0].y1-r[0].y0)*sc)),multi=sh>mh*1.7;
 const mk=(src,k,pd)=>{const c=document.createElement('canvas');c.width=Math.round(sw*k)+pd*2;c.height=Math.round(sh*k)+pd*2;const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.imageSmoothingQuality='high';x.drawImage(src,x0,y0,sw,sh,pd,pd,sw*k,sh*k);return c;};
 const fin=t=>{t=String(t||'').replace(/\s*\n\s*/g,multi?'\n':' ').trim();try{if(window.TXFields&&t)t=TXFields.fixDigits(t);}catch(_){}return t;};
 const C=[];
 /* 1) نفس مسار «قراءة الصفحة» العميق (تعدد تمريرات + دمج) بس على الخلية لوحدها: ده الأدق */
 try{const k=Math.max(1,Math.min(4,120/sh)),pd=Math.round(Math.max(24,sh*k*.3)),c=mk(cv,k,pd),r=await ocrRun(c,lang,q,'6',true,()=>{},()=>false);
  if(r){const t=fin(r.T!=null?r.T:ocrText(r.r,25));if(t)C.push({t:t,conf:(r.sc&&r.sc.mean)||0,e:'deep'});}}catch(e){console.warn('cell deep',e);}
 /* 2) المحرك الحديث على قصّة الأصل (للمقارنة) */
 try{if(window.TXOnnx&&localStorage.getItem('tx_onnx')!=='0'){const sd=await TXOnnx.pickScript(lang);if(sd){const k=Math.max(1,Math.min(4,120/sh)),pd=Math.round(Math.max(20,sh*k*.25));
   const r=await TXOnnx.run(mk(cv,k,pd),sd,{fast:q==='fast'});if(r&&r.T&&r.T.trim())C.push({t:fin(r.T),conf:(r.sc&&r.sc.mean)||0,e:'onnx'});}}}catch(e){console.warn('cell onnx',e);}
 if(!C.length)return{t:'',alts:[]};
 /* القراءة العميقة لها أفضلية، واتفاق محركين يرفع الثقة */
 const norm=x=>x.replace(/\s+/g,'').toLowerCase();C.forEach(x=>{x.s=x.conf+(x.e==='deep'?14:0)+C.filter(y=>y!==x&&norm(y.t)===norm(x.t)).length*8;});
 C.sort((u,v)=>v.s-u.s);const alts=[];C.forEach(x=>{if(x.t&&x.t!==C[0].t&&!alts.includes(x.t))alts.push(x.t);});
 return{t:C[0].t,alts:alts.slice(0,3)};}
/* ---- file writers (no libraries: tiny store-only ZIP so .xlsx / .docx work offline) ---- */
const TBCRC=(()=>{const t=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0;}return t;})();
const tbCrc=u=>{let c=0xFFFFFFFF;for(let i=0;i<u.length;i++)c=TBCRC[(c^u[i])&255]^(c>>>8);return(c^0xFFFFFFFF)>>>0;};
function tbZip(files,mime){const enc=new TextEncoder(),parts=[],cen=[],u16=v=>[v&255,(v>>8)&255],u32=v=>[v&255,(v>>8)&255,(v>>16)&255,(v>>>24)&255];let off=0;
 for(const f of files){const nm=enc.encode(f.n),d=enc.encode(f.d),crc=tbCrc(d),lh=new Uint8Array([0x50,0x4b,3,4,...u16(20),...u16(0x0800),...u16(0),...u16(0),...u16(0x21),...u32(crc),...u32(d.length),...u32(d.length),...u16(nm.length),...u16(0)]);
  parts.push(lh,nm,d);cen.push(new Uint8Array([0x50,0x4b,1,2,...u16(20),...u16(20),...u16(0x0800),...u16(0),...u16(0),...u16(0x21),...u32(crc),...u32(d.length),...u32(d.length),...u16(nm.length),...u16(0),...u16(0),...u16(0),...u16(0),...u32(0),...u32(off)]),nm);off+=lh.length+nm.length+d.length;}
 let cs=0;for(const c of cen)cs+=c.length;
 return new Blob([...parts,...cen,new Uint8Array([0x50,0x4b,5,6,0,0,0,0,...u16(files.length),...u16(files.length),...u32(cs),...u32(off),0,0])],{type:mime});}
const tbX=s=>String(s).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g,'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const tbNum=s=>{const t=tbDigits(s).replace(/[\u066c\u060c]/g,',').replace(/\u066b/g,'.').trim();
 if(/^[-+]?(0|[1-9]\d{0,2}(,\d{3})+|[1-9]\d*)(\.\d+)?$|^[-+]?0\.\d+$/.test(t)){const v=t.replace(/,/g,'').replace(/^\+/,'');if(v.replace(/\D/g,'').length<=15)return v;}return null;};
function tbHtml(rows,rtl){const e=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>');
 return'<meta charset="utf-8"><table dir="'+(rtl?'rtl':'ltr')+'" border="1" cellspacing="0" cellpadding="6" style="border-collapse:collapse;border:1px solid #000">'+rows.map(r=>'<tr>'+r.map(c=>'<td style="border:1px solid #000;vertical-align:middle">'+e(c)+'</td>').join('')+'</tr>').join('')+'</table>';}
function tbTsv(rows){return rows.map(r=>r.map(c=>{c=String(c);return/[\t\n"]/.test(c)?'"'+c.replace(/"/g,'""')+'"':c;}).join('\t')).join('\r\n');}
function tbCsv(rows){return'\ufeff'+rows.map(r=>r.map(c=>'"'+String(c).replace(/"/g,'""')+'"').join(',')).join('\r\n');}
const TBH='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
function tbXlsx(rows,rtl){const nC=Math.max(...rows.map(r=>r.length)),cn=i=>{let s='',n=i+1;while(n>0){const m=(n-1)%26;s=String.fromCharCode(65+m)+s;n=(n-m-1)/26;}return s;},wd=[];
 for(let c=0;c<nC;c++){let m=4;for(const r of rows)for(const ln of String(r[c]||'').split('\n'))m=Math.max(m,ln.length);wd.push(Math.min(60,Math.round(m*1.25+3)));}
 let sd='';rows.forEach((r,i)=>{sd+='<row r="'+(i+1)+'">';for(let c=0;c<nC;c++){const v=r[c]==null?'':String(r[c]),ref=cn(c)+(i+1),nm=tbNum(v);
  if(v==='')sd+='<c r="'+ref+'" s="1"/>';else if(nm!==null)sd+='<c r="'+ref+'" s="2"><v>'+nm+'</v></c>';else sd+='<c r="'+ref+'" s="1" t="inlineStr"><is><t xml:space="preserve">'+tbX(v)+'</t></is></c>';}sd+='</row>';});
 const NS='xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"',RN='http://schemas.openxmlformats.org/package/2006/relationships',OD='http://schemas.openxmlformats.org/officeDocument/2006/relationships';
 return tbZip([
 {n:'[Content_Types].xml',d:TBH+'<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>'},
 {n:'_rels/.rels',d:TBH+'<Relationships xmlns="'+RN+'"><Relationship Id="rId1" Type="'+OD+'/officeDocument" Target="xl/workbook.xml"/></Relationships>'},
 {n:'xl/workbook.xml',d:TBH+'<workbook '+NS+' xmlns:r="'+OD+'"><sheets><sheet name="Table" sheetId="1" r:id="rId1"/></sheets></workbook>'},
 {n:'xl/_rels/workbook.xml.rels',d:TBH+'<Relationships xmlns="'+RN+'"><Relationship Id="rId1" Type="'+OD+'/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="'+OD+'/styles" Target="styles.xml"/></Relationships>'},
 {n:'xl/styles.xml',d:TBH+'<styleSheet '+NS+'><fonts count="1"><font><sz val="12"/><name val="Arial"/><family val="2"/></font></fonts><fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills><borders count="2"><border><left/><right/><top/><bottom/><diagonal/></border><border><left style="thin"><color auto="1"/></left><right style="thin"><color auto="1"/></right><top style="thin"><color auto="1"/></top><bottom style="thin"><color auto="1"/></bottom><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="3"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment vertical="center" wrapText="1"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf></cellXfs></styleSheet>'},
 {n:'xl/worksheets/sheet1.xml',d:TBH+'<worksheet '+NS+'><sheetViews><sheetView workbookViewId="0"'+(rtl?' rightToLeft="1"':'')+'/></sheetViews><sheetFormatPr defaultRowHeight="18"/><cols>'+wd.map((x,i)=>'<col min="'+(i+1)+'" max="'+(i+1)+'" width="'+x+'" customWidth="1"/>').join('')+'</cols><sheetData>'+sd+'</sheetData></worksheet>'}
 ],'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');}
function tbDocx(rows,rtl){const nC=Math.max(...rows.map(r=>r.length)),wide=nC>6,TW=wide?15300:10400,len=[];
 for(let c=0;c<nC;c++){let m=4;for(const r of rows)for(const ln of String(r[c]||'').split('\n'))m=Math.max(m,ln.length);len.push(Math.min(m,40));}
 const sum=len.reduce((a,b)=>a+b,0),tw=len.map(l=>Math.max(700,Math.round(TW*l/sum))),AR=/[\u0600-\u06FF]/;
 const para=t=>{const a=AR.test(t);return'<w:p><w:pPr>'+(a?'<w:bidi/>':'')+'<w:spacing w:before="40" w:after="40"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/><w:sz w:val="22"/><w:szCs w:val="22"/>'+(a?'<w:rtl/>':'')+'</w:rPr><w:t xml:space="preserve">'+tbX(t)+'</w:t></w:r></w:p>';};
 const B=['top','left','bottom','right','insideH','insideV'].map(s=>'<w:'+s+' w:val="single" w:sz="6" w:space="0" w:color="000000"/>').join('');
 let tb='<w:tbl><w:tblPr>'+(rtl?'<w:bidiVisual/>':'')+'<w:tblW w:w="'+TW+'" w:type="dxa"/><w:tblBorders>'+B+'</w:tblBorders><w:tblLayout w:type="fixed"/><w:tblCellMar><w:left w:w="80" w:type="dxa"/><w:right w:w="80" w:type="dxa"/></w:tblCellMar></w:tblPr><w:tblGrid>'+tw.map(x=>'<w:gridCol w:w="'+x+'"/>').join('')+'</w:tblGrid>';
 for(const r of rows){tb+='<w:tr><w:trPr><w:cantSplit/></w:trPr>';for(let c=0;c<nC;c++){const t=r[c]==null?'':String(r[c]);tb+='<w:tc><w:tcPr><w:tcW w:w="'+tw[c]+'" w:type="dxa"/><w:vAlign w:val="center"/></w:tcPr>'+(t?t.split('\n').map(para).join(''):'<w:p/>')+'</w:tc>';}tb+='</w:tr>';}
 tb+='</w:tbl><w:p/>';
 const W='xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"';
 return tbZip([
 {n:'[Content_Types].xml',d:TBH+'<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>'},
 {n:'_rels/.rels',d:TBH+'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>'},
 {n:'word/document.xml',d:TBH+'<w:document '+W+'><w:body>'+tb+'<w:sectPr>'+(wide?'<w:pgSz w:w="16838" w:h="11906" w:orient="landscape"/>':'<w:pgSz w:w="11906" w:h="16838"/>')+'<w:pgMar w:top="720" w:right="720" w:bottom="720" w:left="720" w:header="360" w:footer="360" w:gutter="0"/>'+(rtl?'<w:bidi/>':'')+'</w:sectPr></w:body></w:document>'}
 ],'application/vnd.openxmlformats-officedocument.wordprocessingml.document');}
/* ===== end v57 helpers ===== */
/* ===== v58: live text (select text right on the image, like Live Text) ===== */
const LTC={};let LT=null;
function ocrLtWords(M,W,H){const ws=M.filter(w=>w.c>=40&&(w.y1-w.y0)>4),out=[];let li=0;
 for(const l of tbLines(ws).sort((a,b)=>a.cy-b.cy)){const r=tbIsAr(l.w.map(w=>w.t).join(' '));
  for(const w of l.w.slice().sort((p,q)=>r?q.x0-p.x0:p.x0-q.x0))out.push({t:w.t,x0:w.x0/W,y0:w.y0/H,x1:w.x1/W,y1:w.y1/H,l:li,r:r?1:0});li++;}
 return out;}
function ltSig(p,lg){try{return lg+'|'+JSON.stringify(p,(k,v)=>(k==='src'||k==='blob'||k==='th'||k==='thumb'||k==='id'||(typeof v==='string'&&v.length>300)||(typeof Blob!=='undefined'&&v instanceof Blob)||(typeof HTMLCanvasElement!=='undefined'&&v instanceof HTMLCanvasElement)||(typeof ImageBitmap!=='undefined'&&v instanceof ImageBitmap))?undefined:v);}catch(e){return lg+'|'+Date.now();}}
function ltStore(p,cv,M,sig){try{LTC[p.id]={ar:cv.width/cv.height,sig:sig,ws:ocrLtWords(M,cv.width,cv.height)};}catch(e){}}
function ltText(ws,a,b){let o='',pl=-1;for(let i=a;i<=b;i++){const w=ws[i];if(pl>=0)o+=w.l===pl?' ':'\n';o+=w.t;pl=w.l;}return o;}
/* v60: smart background rebuild, skew detection, button-fit safety net */
function bgCoons(ctx,x0,y0,x1,y1,w,h){
 const W=x1-x0,H=y1-y0;if(W<3||H<3)return false;const bw=Math.max(3,Math.round(w*.008)),rx0=Math.max(0,x0-bw),ry0=Math.max(0,y0-bw),rx1=Math.min(w,x1+bw),ry1=Math.min(h,y1+bw),RW=rx1-rx0,d=ctx.getImageData(rx0,ry0,RW,ry1-ry0).data;
 const med=a=>(a.sort((p,q)=>p-q),a[a.length>>1]),px=(x,y)=>((y-ry0)*RW+(x-rx0))*4;
 const lum=v=>.3*v[0]+.59*v[1]+.11*v[2];
 /* the old text is always the minority inside its own box, so the box median is a good reference for 'paper' */
 const IL=[];for(let y=y0;y<y1;y+=2)for(let x=x0;x<x1;x+=2){const k=px(x,y);IL.push(.3*d[k]+.59*d[k+1]+.11*d[k+2]);}
 const refL=IL.length?med(IL.slice()):null,refD=refL==null?0:med(IL.map(v=>Math.abs(v-refL)).sort((p,q)=>p-q)),refT=Math.max(48,4*refD*1.48);
 const prof=(n,get)=>{const P=[];let any=false;for(let i=0;i<n;i++){const pts=get(i);let v=[];for(const p of pts){const k=px(p[0],p[1]);v.push([d[k],d[k+1],d[k+2]]);}v=refL==null?v:v.filter(q=>Math.abs(lum(q)-refL)<=refT);P.push(v);if(v.length)any=true;}
  if(!any)return null;
  const mid=v=>{const R=v.map(q=>q[0]),G=v.map(q=>q[1]),B=v.map(q=>q[2]);return[med(R),med(G),med(B)];};
  let o=P.map(v=>v.length?mid(v):null);
  /* noise level of this side, then drop pixels that are far from their local median (ink / neighbouring letters) */
  const dev=[];P.forEach((v,i)=>{if(o[i]){const l=lum(o[i]);v.forEach(q=>dev.push(Math.abs(lum(q)-l)));}});
  const thr=Math.max(16,3*(dev.length?med(dev.slice())*1.48:0));
  o=P.map((v,i)=>{if(!o[i])return null;const l=lum(o[i]),ok=v.filter(q=>Math.abs(lum(q)-l)<=thr);return ok.length>=Math.max(1,v.length*.3)?mid(ok):null;});
  /* rows/columns still dominated by ink: compare against the neighbours and discard */
  const wk=Math.max(3,Math.round(n/8)),ls=o.map(v=>v?lum(v):null);
  o=o.map((v,i)=>{if(!v)return null;const nb=[];for(let j=Math.max(0,i-wk);j<=Math.min(n-1,i+wk);j++)if(ls[j]!=null)nb.push(ls[j]);return Math.abs(ls[i]-med(nb.slice()))>thr*1.6?null:v;});
  if(!o.some(v=>v))return null;
  /* fill the gaps by linear interpolation between the nearest good neighbours */
  let a=-1;for(let i=0;i<n;i++){if(o[i]){if(a<0){for(let j=0;j<i;j++)o[j]=o[i];}else if(i-a>1){for(let j=a+1;j<i;j++){const t=(j-a)/(i-a);o[j]=[0,1,2].map(c=>o[a][c]*(1-t)+o[i][c]*t);}}a=i;}}
  for(let j=a+1;j<n;j++)o[j]=o[a];
  const k=Math.max(2,Math.round(n/10)),s=[];for(let i=0;i<n;i++){let x=0,y=0,z=0,m=0;for(let j=Math.max(0,i-k);j<=Math.min(n-1,i+k);j++){x+=o[j][0];y+=o[j][1];z+=o[j][2];m++;}s.push([x/m,y/m,z/m]);}return s;};
 const rng=(a,b)=>{const r=[];for(let i=a;i<b;i++)r.push(i);return r;};
 let L=x0-rx0>=2?prof(H,y=>rng(rx0,x0).map(x=>[x,y0+y])):null,R=rx1-x1>=2?prof(H,y=>rng(x1,rx1).map(x=>[x,y0+y])):null,T=y0-ry0>=2?prof(W,x=>rng(ry0,y0).map(y=>[x0+x,y])):null,B=ry1-y1>=2?prof(W,x=>rng(y1,ry1).map(y=>[x0+x,y])):null;
 if(!(L||R)&&!(T||B))return false;
 const fix=a=>a&&a.every(v=>v)?a:null;L=fix(L);R=fix(R);T=fix(T);B=fix(B);if(!(L||R||T||B))return false;
 const avgP=(p,n)=>{const o=[];for(let i=0;i<n;i++)o.push([0,1,2].map(c=>0));return o;};
 const flat=(n,c)=>{const o=[];for(let i=0;i<n;i++)o.push(c);return o;};
 const mean=a=>{let s=[0,0,0];a.forEach(v=>{s[0]+=v[0];s[1]+=v[1];s[2]+=v[2];});return s.map(v=>v/a.length);};
 const base=mean([L,R,T,B].filter(Boolean).map(mean));
 if(!L&&!R){L=flat(H,T?T[0]:B[0]);R=flat(H,T?T[W-1]:B[W-1]);}else{L=L||R;R=R||L;}
 if(!T&&!B){T=flat(W,L[0]);B=flat(W,L[H-1]);}else{T=T||B;B=B||T;}
 let g=[];for(let y=0;y<H;y+=2){const k=px(rx0,y0+y);}
 const gs=[];const S=(x,y)=>{const k=px(x,y);gs.push(d[k+1]);};
 if(x0-rx0>=2)for(let y=y0;y<y1;y+=2)for(let x=rx0;x<x0;x++)S(x,y);if(y0-ry0>=2)for(let x=x0;x<x1;x+=2)for(let y=ry0;y<y0;y++)S(x,y);
 let sg=0;if(gs.length>8){const m=med(gs.slice()),dv=gs.map(v=>Math.abs(v-m));sg=Math.min(8,med(dv)*1.48);}
 const out=ctx.createImageData(W,H),o=out.data,C00=T[0],C10=T[W-1],C01=B[0],C11=B[W-1];
 for(let y=0;y<H;y++){const s=(y+.5)/H,l=L[y],r=R[y];for(let x=0;x<W;x++){const t=(x+.5)/W,tp=T[x],bt=B[x];
  let hs=(((x0+x)*73856093)^((y0+y)*19349663))>>>0;hs=Math.imul(hs^(hs>>>15),2246822519)>>>0;const n=(((hs&1023)+((hs>>>10)&1023))/1023-1)*2.4*sg,i=(y*W+x)*4;
  for(let c=0;c<3;c++){const v=(1-t)*l[c]+t*r[c]+(1-s)*tp[c]+s*bt[c]-((1-t)*(1-s)*C00[c]+t*(1-s)*C10[c]+(1-t)*s*C01[c]+t*s*C11[c])+n;o[i+c]=v<0?0:v>255?255:v;}o[i+3]=255;}}
 ctx.putImageData(out,x0,y0);return true;}
function ocrRot(cv,a){const c=Math.abs(Math.cos(a)),s=Math.abs(Math.sin(a)),w=Math.ceil(cv.width*c+cv.height*s),h=Math.ceil(cv.width*s+cv.height*c),o=document.createElement('canvas');o.width=w;o.height=h;const x=o.getContext('2d'),p=cv.getContext('2d').getImageData(1,1,1,1).data;x.fillStyle='rgb('+p[0]+','+p[1]+','+p[2]+')';x.fillRect(0,0,w,h);x.imageSmoothingQuality='high';x.translate(w/2,h/2);x.rotate(a);x.drawImage(cv,-cv.width/2,-cv.height/2);return o;}
/* text slope (radians, clockwise positive) by maximising row-profile sharpness */
function ocrSkew(cv){try{const s=Math.min(1,240/cv.width),w=Math.max(8,Math.round(cv.width*s)),h=Math.max(8,Math.round(cv.height*s)),c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');x.drawImage(cv,0,0,w,h);
 const d=x.getImageData(0,0,w,h).data,g=new Float32Array(w*h);let m=0;for(let i=0;i<w*h;i++){g[i]=d[i*4]*.3+d[i*4+1]*.59+d[i*4+2]*.11;m+=g[i];}m/=w*h;
 let dk=0,lt=0;for(let i=0;i<w*h;i++){if(g[i]<m-35)dk++;else if(g[i]>m+35)lt++;}const dark=dk<=lt,P=[];
 for(let y=0;y<h;y++)for(let xx=0;xx<w;xx++){const v=g[y*w+xx];if(dark?v<m-35:v>m+35)P.push(xx,y);}
 if(P.length<120)return 0;const sc=a=>{const co=Math.cos(a),si=Math.sin(a),bins=new Float32Array(w+h+4);for(let i=0;i<P.length;i+=2){const yy=P[i+1]*co-P[i]*si+w*.5;bins[Math.max(0,Math.min(bins.length-1,Math.round(yy)))]++;}let t=0;for(const b of bins)t+=b*b;return t;};
 const r=Math.PI/180;let ba=0,bs=sc(0),s0=bs;for(let a=-20;a<=20;a++){const v=sc(a*r);if(v>bs){bs=v;ba=a*r;}}
 for(let a=ba-r;a<=ba+r;a+=r/4){const v=sc(a);if(v>bs){bs=v;ba=a;}}
 return(bs>s0*1.05&&Math.abs(ba)>.012)?ba:0;}catch(e){return 0;}}
function warmOcr(){try{if(window.__w59)return;window.__w59=1;let lg=(localStorage.getItem('tx_ol')||'ara+eng').split('+').filter(x=>OCR_LANGS.some(l=>l.c===x));const c=navigator.connection;if(c&&(c.saveData||/2g/.test(c.effectiveType)))return;getW((lg.length?lg:['ara','eng']).join('+'),OQ()).catch(()=>{window.__w59=0;});}catch(_){}}
/* safety net: any button whose label spills out shrinks its font until it fits (Arabic + English) */
(function(){const st=document.createElement('style');st.textContent='.ox-acts{flex-wrap:wrap}.ox-acts .ox-btn{flex:1 1 auto;min-width:0;white-space:nowrap;padding:0 12px}.ox-acts .ox-btn[aria-label]{flex:0 0 52px;padding:0}.ox-res textarea{color:var(--ink,#fff)!important;-webkit-text-fill-color:var(--ink,#fff)!important;opacity:1!important;min-height:130px}';document.head.appendChild(st);
 const fit=list=>{const bs=list.filter(b=>b.clientWidth>0&&b.clientHeight>0&&b.clientHeight<92&&b.textContent.trim().length>1&&!b.dataset.nofit);
  for(let it=0;it<7;it++){const bad=bs.filter(b=>b.scrollWidth>b.clientWidth+1||b.scrollHeight>b.clientHeight+2);if(!bad.length)return;
   const fs=bad.map(b=>parseFloat(getComputedStyle(b).fontSize));bad.forEach((b,i)=>{b.style.whiteSpace='nowrap';if(fs[i]>9.5)b.style.fontSize=(fs[i]-1)+'px';else{b.style.overflow='hidden';b.style.textOverflow='ellipsis';}});}};
 const all=()=>fit([...document.querySelectorAll('button')]);let tm=0,tm2=0;const q=new Set();
 new MutationObserver(ms=>{for(const m of ms)m.addedNodes.forEach(n=>{if(n.nodeType===1)q.add(n);});if(q.size){clearTimeout(tm);tm=setTimeout(()=>{const set=new Set();[...q].forEach(r=>{if(!r.isConnected)return;if(r.tagName==='BUTTON')set.add(r);r.querySelectorAll('button').forEach(b=>set.add(b));});q.clear();fit([...set]);},160);}}).observe(document.body,{childList:true,subtree:true});
 const later=()=>{clearTimeout(tm2);tm2=setTimeout(all,300);};document.addEventListener('click',later,true);addEventListener('resize',later);addEventListener('orientationchange',later);
 (document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(()=>setTimeout(all,500));})();
/* v59: live text 2.0 — tap a word, drag handles, double-tap a line, floating menu */
(function(){const s=document.createElement('style');s.id='ltcss2';s.textContent=`#ltO{cursor:default}#ltH{position:absolute;inset:0;pointer-events:none}#ltH b{position:absolute;display:block;background:rgba(27,99,240,.3);border-radius:4px;box-shadow:0 0 0 1px rgba(27,99,240,.35)}
#ltU{position:fixed;inset:0;z-index:8600;pointer-events:none}.lth{position:fixed;display:none;width:44px;height:44px;margin:-8px 0 0 -22px;pointer-events:auto;touch-action:none}
.lth::before{content:'';position:absolute;left:50%;top:6px;width:3px;height:14px;margin-left:-1.5px;background:#1b63f0}.lth::after{content:'';position:absolute;left:50%;top:18px;width:16px;height:16px;margin-left:-8px;border-radius:50%;background:#1b63f0;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.35)}
.ltm{position:fixed;display:none;gap:2px;padding:4px;border-radius:14px;background:rgba(10,18,34,.94);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);box-shadow:0 6px 22px rgba(0,0,0,.4);pointer-events:auto;font:700 13px system-ui;touch-action:manipulation}
.ltm button{height:36px;padding:0 14px;border:0;border-radius:10px;background:transparent;color:#fff;font:inherit}.ltm button:active{background:rgba(255,255,255,.18)}.ltm button+button{border-inline-start:1px solid rgba(255,255,255,.14)}
#oHint{z-index:99999!important;pointer-events:auto!important}`;document.head.appendChild(s);})();
function ltExit(){const S=LT;if(!S)return;S.dead=1;clearInterval(S.iv);cancelAnimationFrame(S.raf);try{S.o.remove();S.bar.remove();S.ui.remove();}catch(_){}window.__lsel=0;LT=null;}
async function liveText(p){
 const T=(a,b)=>AR()?a:b;
 try{
  if(!p||!E.page||E.page.id!==p.id)return;if(LT)ltExit();
  const wrap=document.getElementById('wrap'),st=document.getElementById('editStage'),cb=document.getElementById('cvBase');if(!wrap||!st||!cb||!cb.width)return;
  const h0=document.getElementById('oHint');if(h0)h0.remove();
  const o=document.createElement('div');o.id='ltO';wrap.appendChild(o);const hl=document.createElement('div');hl.id='ltH';o.appendChild(hl);
  const bar=document.createElement('div');bar.id='ltB';st.appendChild(bar);
  const ui=document.createElement('div');ui.id='ltU';document.body.appendChild(ui);
  const h1=document.createElement('div'),h2=document.createElement('div'),mn=document.createElement('div');h1.className=h2.className='lth';mn.className='ltm';ui.append(h1,h2,mn);
  const S={o,bar,ui,dead:0,a:null,b:null,drag:false,hd:null,dn:-1,ws:[],pr:0};LT=S;window.__lsel=1;
  S.iv=setInterval(()=>{if(V.cur!=='vEdit'||!E.page||E.page.id!==p.id)ltExit();},500);
  bar.onpointerdown=mn.onpointerdown=e=>e.stopPropagation();
  const rg=()=>S.a==null?null:[Math.min(S.a,S.b),Math.max(S.a,S.b)];
  const drawBar=()=>{const r=rg();let h;
   if(S.busy)h='<span class="t">'+(S.pr?T('جاري القراءة ','Reading ')+S.pr+'%':T('تجهيز محرك القراءة…','Preparing the reader…'))+'</span>';
   else h='<span class="t">'+(r?ltText(S.ws,r[0],r[1]).replace(/\n/g,' '):T('المس كلمة أو اسحب لتحديد النص','Tap a word or drag to select'))+'</span><button type="button" class="p" data-k="c">'+T('نسخ الكل','Copy all')+'</button><button type="button" data-k="m">'+T('النص الكامل','Full text')+'</button>';
   bar.innerHTML=h+'<button type="button" data-k="x" aria-label="x">✕</button>';};
  const place=()=>{const r=rg(),R=o.getBoundingClientRect();
   if(!r||S.busy||!S.ws[r[0]]){h1.style.display=h2.style.display=mn.style.display='none';return;}
   const A=S.ws[r[0]],B=S.ws[r[1]],X=x=>R.left+x*R.width,Y=y=>R.top+y*R.height;
   h1.style.display=h2.style.display='block';h1.style.left=X(A.r?A.x1:A.x0)+'px';h1.style.top=Y(A.y1)+'px';h2.style.left=X(B.r?B.x0:B.x1)+'px';h2.style.top=Y(B.y1)+'px';
   if(S.drag){mn.style.display='none';return;}
   mn.style.display='flex';let y0=1e9,y1=0,x0=1e9,x1=0;for(let i=r[0];i<=r[1];i++){const w=S.ws[i];y0=Math.min(y0,w.y0);y1=Math.max(y1,w.y1);x0=Math.min(x0,w.x0);x1=Math.max(x1,w.x1);}
   const mw=mn.offsetWidth||200,mh=mn.offsetHeight||44;let ty=Y(y0)-mh-14;if(ty<Math.max(8,R.top+4))ty=Y(y1)+44;ty=Math.max(8,Math.min(innerHeight-mh-8,ty));
   let tx=(X(x0)+X(x1))/2-mw/2;tx=Math.max(8,Math.min(innerWidth-mw-8,tx));mn.style.top=ty+'px';mn.style.left=tx+'px';};
  const paint=()=>{const r=rg();hl.innerHTML='';
   if(r){const m=new Map();for(let i=r[0];i<=r[1];i++){const w=S.ws[i],q=m.get(w.l);if(!q)m.set(w.l,{x0:w.x0,x1:w.x1,y0:w.y0,y1:w.y1});else{q.x0=Math.min(q.x0,w.x0);q.x1=Math.max(q.x1,w.x1);q.y0=Math.min(q.y0,w.y0);q.y1=Math.max(q.y1,w.y1);}}
    hl.innerHTML=[...m.values()].map(q=>'<b style="left:'+q.x0*100+'%;top:'+q.y0*100+'%;width:'+(q.x1-q.x0)*100+'%;height:'+(q.y1-q.y0)*100+'%"></b>').join('');
    if(!S.drag)mn.innerHTML='<button type="button" data-k="c">'+T('نسخ','Copy')+'</button><button type="button" data-k="a">'+T('الكل','All')+'</button><button type="button" data-k="t">'+T('ترجمة','Translate')+'</button>'+(navigator.share?'<button type="button" data-k="s">'+T('مشاركة','Share')+'</button>':'');}
   drawBar();place();};
  const copy=async t=>{let ok=false;try{await navigator.clipboard.writeText(t);ok=true;}catch(_){try{const ta=document.createElement('textarea');ta.value=t;ta.style.cssText='position:fixed;opacity:0';document.body.appendChild(ta);ta.select();ok=document.execCommand('copy');ta.remove();}catch(__){}}toast(ok?T('اتنسخ','Copied'):T('تعذّر النسخ','Copy failed'));};
  const clk=async e=>{const k=(e.target.closest('[data-k]')||{dataset:{}}).dataset.k;if(!k||S.busy&&k!=='x')return;const r=rg();
   if(k==='x')ltExit();else if(k==='m'){ltExit();ocrModal(p,null);}else if(k==='a'){S.a=0;S.b=S.ws.length-1;paint();}
    else if(k==='t'){const tx=r?ltText(S.ws,r[0],r[1]):ltText(S.ws,0,S.ws.length-1);if(tx.trim())TXTr.open({text:tx,ar:AR(),toast});}
   else if(k==='c')copy(r?ltText(S.ws,r[0],r[1]):ltText(S.ws,0,S.ws.length-1));
   else if(k==='s'&&r){try{await navigator.share({text:ltText(S.ws,r[0],r[1])});}catch(_){}}};
  bar.onclick=mn.onclick=clk;
  S.busy=true;drawBar();
  let lg=['ara','eng'];try{(localStorage.getItem('tx_ol')||'').split('+').forEach(x=>{if(OCR_LANGS.some(l=>l.c===x)&&!lg.includes(x))lg.push(x);});}catch(_){}
  const sig=ltSig(p,lg.join('+'));let c=LTC[p.id];const asp=cb.width/cb.height;
  if(!c||c.sig!==sig||Math.abs(c.ar-asp)/asp>.01){o.classList.add('scan');
   logCb=x=>{if(S.dead)return;if(x.status==='recognizing text'){const v=Math.round(x.progress*100);if(v>S.pr){S.pr=v;drawBar();}}};
   try{const f=await renderFinal(p,2200);if(S.dead)return;
    let best=null;try{best=await TXOnnx.tryRun(f,lg.join('+'),pr=>{if(!S.dead){const v=Math.round(pr*100);if(v>S.pr){S.pr=v;drawBar();}}},()=>S.dead,{skew:ocrSkew,fast:OQ()==='fast'});}catch(_){}if(S.dead)return;if(!best)best=await ocrRun(f,lg.join('+'),OQ(),'3',false,()=>{},()=>S.dead);if(S.dead||!best)return;ltStore(p,f,best.M,sig);c=LTC[p.id];}
   catch(err){console.error(err);if(!S.dead){toast(T('تعذّرت القراءة — محتاج إنترنت أول مرة','Could not read — needs internet the first time'));ltExit();}return;}}
  if(S.dead)return;o.classList.remove('scan');S.busy=false;S.ws=(c&&c.ws)||[];
  if(!S.ws.length){bar.innerHTML='<span class="t">'+T('ما لقيتش نص واضح','No clear text found')+'</span><button type="button" data-k="m">'+T('النص الكامل','Full text')+'</button><button type="button" data-k="x">✕</button>';setTimeout(()=>{if(LT===S&&!S.ws.length)ltExit();},2600);return;}
  o.insertAdjacentHTML('beforeend',S.ws.map(w=>'<i style="left:'+(w.x0*100)+'%;top:'+(w.y0*100)+'%;width:'+((w.x1-w.x0)*100)+'%;height:'+((w.y1-w.y0)*100)+'%"></i>').join(''));
  o.classList.add('flash');setTimeout(()=>o.classList.remove('flash'),1500);drawBar();
  const pick=(x,y,strict)=>{const r=o.getBoundingClientRect(),nx=(x-r.left)/r.width,ny=(y-r.top)/r.height;let bi=-1,bd=1e9;
   for(let i=0;i<S.ws.length;i++){const w=S.ws[i],dx=nx<w.x0?w.x0-nx:nx>w.x1?nx-w.x1:0,dy=ny<w.y0?w.y0-ny:ny>w.y1?ny-w.y1:0,d=Math.hypot(dx*r.width,dy*r.height);if(d<bd){bd=d;bi=i;}}
   return strict&&bd>30?-1:bi;};
  [h1,h2].forEach((h,n)=>{h.onpointerdown=e=>{e.stopPropagation();e.preventDefault();S.hd=(n===0)===(S.a<=S.b)?'a':'b';S.drag=true;try{h.setPointerCapture(e.pointerId);}catch(_){}place();};
   h.onpointermove=e=>{if(!S.hd)return;const j=pick(e.clientX,e.clientY-24,false);if(j>=0&&j!==S[S.hd]){S[S.hd]=j;paint();}e.preventDefault();};
   h.onpointerup=h.onpointercancel=()=>{S.drag=false;S.hd=null;paint();};});
  let moved=0,sx=0,sy=0,lt=0,lw=-1;
  o.addEventListener('pointerdown',e=>{if(!e.isPrimary){S.drag=false;S.dn=-1;return;}e.stopPropagation();sx=e.clientX;sy=e.clientY;moved=0;const i=pick(e.clientX,e.clientY,true);try{o.setPointerCapture(e.pointerId);}catch(_){}
   if(i>=0){S.a=S.b=i;S.drag=true;S.dn=i;paint();}else{S.drag=false;S.dn=-1;}});
  o.addEventListener('pointermove',e=>{if(!e.isPrimary)return;if(Math.hypot(e.clientX-sx,e.clientY-sy)>8)moved=1;if(!S.drag||S.hd)return;const j=pick(e.clientX,e.clientY,false);if(j>=0&&j!==S.b){S.b=j;paint();}e.preventDefault();});
  o.addEventListener('pointerup',e=>{if(!e.isPrimary)return;
   if(S.dn<0&&!moved){S.a=S.b=null;}
   else if(S.dn>=0&&!moved){const n=Date.now();if(lw===S.dn&&n-lt<340){const L=S.ws[S.dn].l;let f=S.dn,g=S.dn;while(f>0&&S.ws[f-1].l===L)f--;while(g<S.ws.length-1&&S.ws[g+1].l===L)g++;S.a=f;S.b=g;lw=-1;}else{lw=S.dn;lt=n;}}
   S.drag=false;S.dn=-1;paint();});
  o.addEventListener('pointercancel',()=>{S.drag=false;S.dn=-1;paint();});
  const tick=()=>{if(S.dead)return;const R=o.getBoundingClientRect(),k=[R.left,R.top,R.width,R.height].map(Math.round).join();if(k!==S.k){S.k=k;place();}S.raf=requestAnimationFrame(tick);};tick();
 }catch(e){console.error('liveText',e);ltExit();}}

/* المرحلة 4.4أ: بطاقة تنزيل نماذج القراءة الحديثة (ocr-models.js) — بتتنزّل وقت الحاجة بس مع شريط تقدم */
function ocrModelsCard(res,ar){
 const old=res.querySelector('.om');if(old)old.remove();
 const M=window.TXOcrModels;if(!M||!window.caches)return;
 if(!document.getElementById('omcss')){const st=document.createElement('style');st.id='omcss';
  st.textContent='.om{margin-top:14px;padding:12px;border-radius:14px;border:1px dashed var(--bd,rgba(127,127,127,.4))}.om-t{font-size:13px;font-weight:600}.om-h{font-size:11px;opacity:.7;margin:3px 0 9px}.om-r{display:flex;flex-wrap:wrap;gap:6px}.om-b{padding:7px 12px;border-radius:12px;border:1px solid var(--bd,rgba(127,127,127,.35));background:transparent;color:inherit;font:inherit;font-size:13px;cursor:pointer}.om-b[disabled]{opacity:.6;cursor:default}.om-b.on{border-color:#22a45d}.om-p{height:4px;border-radius:4px;background:rgba(127,127,127,.25);margin-top:10px;overflow:hidden;display:none}.om-p i{display:block;height:100%;width:0;background:#22a45d;transition:width .15s}.om-m{font-size:11px;margin-top:6px;opacity:.8;min-height:14px}';
  document.head.appendChild(st);}
 const SC=[['ch','إنجليزي وأرقام (الأسرع)','English + numbers (fastest)'],['arabic','عربي','Arabic'],['latin','لاتيني','Latin'],['cyrillic','سيريلي','Cyrillic']];
 const box=document.createElement('div');box.className='om';
 box.innerHTML='<div class="om-t">'+(ar?'محرك القراءة الحديث (اختياري)':'Modern reading engine (optional)')+'<i class="om-cv"></i></div><div class="om-h">'+(ar?'بينزّل مرة واحدة ويتخزّن على جهازك، وبعدها يشتغل بدون نت. الأحسن تنزّله على واي فاي.':'Downloads once and stays on your device, then works offline. Best on Wi-Fi.')+'</div><div class="om-r"></div><div class="om-p"><i></i></div><div class="om-m"></div>';
 const row=box.querySelector('.om-r'),bar=box.querySelector('.om-p'),fill=bar.firstChild,msg=box.querySelector('.om-m'),btns=[];
 const lab=(b,s,on)=>{b.textContent=(on?'✓ ':'⬇ ')+(ar?s[1]:s[2]);b.classList.toggle('on',on);b.title=on?(ar?'متنزّل':'Installed'):(ar?'تنزيل':'Download');};
 SC.forEach(s=>{const b=document.createElement('button');b.type='button';b.className='om-b';lab(b,s,false);row.appendChild(b);btns.push(b);
  M.has(s[0]).then(on=>lab(b,s,on)).catch(()=>{});
  b.onclick=async()=>{
   if(b.classList.contains('on')){msg.textContent=ar?'النموذج ده متنزّل بالفعل.':'Already installed.';return;}
   btns.forEach(x=>x.disabled=true);bar.style.display='block';fill.style.width='0';msg.textContent=ar?'بنجهّز التنزيل…':'Starting…';
   try{await M.install(s[0],(f,id)=>{fill.style.width=Math.round(f*100)+'%';msg.textContent=(ar?'بنزّل ':'Downloading ')+(id==='done'?'':id)+' · '+Math.round(f*100)+'%';});
    lab(b,s,true);msg.textContent=ar?'تمام، النموذج اتخزّن على جهازك.':'Done — stored on your device.';}
   catch(e){msg.textContent=(ar?'فشل التنزيل: ':'Download failed: ')+(e&&e.message||e);}
   finally{btns.forEach(x=>x.disabled=false);setTimeout(()=>{bar.style.display='none'},1500);}
  };});
 const imp=document.createElement('button');imp.type='button';imp.className='om-b';imp.textContent='📂 '+(ar?'استيراد من ملف':'Import from file');row.appendChild(imp);
 const fi=document.createElement('input');fi.type='file';fi.multiple=true;fi.accept='.onnx,.txt';fi.style.display='none';box.appendChild(fi);
 imp.onclick=()=>fi.click();
 fi.onchange=async()=>{const fs=[...fi.files];if(!fs.length)return;
  try{const r=await M.importFiles(fs);msg.textContent=(ar?'اتخزّن: ':'Stored: ')+(r.ok.join('، ')||'—')+(r.skipped.length?(ar?' · اتجاهل: ':' · Skipped: ')+r.skipped.join('، '):'');
   SC.forEach((s,i)=>M.has(s[0]).then(on=>lab(btns[i],s,on)));}
  catch(e){msg.textContent=(ar?'فشل الاستيراد: ':'Import failed: ')+(e&&e.message||e);}
  fi.value='';};
 box.querySelector('.om-t').onclick=()=>box.classList.toggle('open');
 res.appendChild(box);
}
/* المرحلة 4.2: شرائح الحقول المستخرجة (تواريخ، أرقام، هواتف، بريد…) فوق نص الـOCR — fields.js */
function ocrFields(res,T,ar){
 const old=res.querySelector('.fx');if(old)old.remove();
 if(!window.TXFields||!T)return;
 const fs=TXFields.suggest(TXFields.extract(T),ar);if(!fs.length)return;
 if(!document.getElementById('fxcss')){const st=document.createElement('style');st.id='fxcss';
  st.textContent='.fx{margin-top:12px}.fx-t{font-size:12px;opacity:.7;margin:0 2px 6px}.fx-l{display:flex;flex-wrap:wrap;gap:6px}.fx-c{display:inline-flex;align-items:center;gap:6px;max-width:100%;padding:7px 11px;border-radius:12px;border:1px solid var(--bd,rgba(127,127,127,.3));background:transparent;color:inherit;font:inherit;font-size:13px;cursor:pointer}.fx-c small{opacity:.65;font-size:11px}.fx-c b{font-weight:600;direction:ltr;unicode-bidi:plaintext;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.fx-c.ok{border-color:#22a45d}.fx-a{text-decoration:none;color:inherit;padding:7px 10px;border-radius:12px;border:1px solid var(--bd,rgba(127,127,127,.3));font-size:12px}.fx-i{font-size:11px;opacity:.7;margin:4px 2px 0}';
  document.head.appendChild(st);}
 const NM={email:['بريد','Email'],url:['رابط','Link'],phone:['هاتف','Phone'],date:['تاريخ','Date'],national_id:['رقم قومي','National ID'],amount:['مبلغ','Amount']};
 const box=document.createElement('div');box.className='fx';
 box.innerHTML='<div class="fx-t">'+(ar?'حقول لقيتها في النص':'Fields found in the text')+'</div><div class="fx-l"></div>';
 const list=box.querySelector('.fx-l'),esc=x=>String(x).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const copy=async v=>{try{await navigator.clipboard.writeText(v)}catch(_){const t=document.createElement('textarea');t.value=v;document.body.appendChild(t);t.select();try{document.execCommand('copy')}catch(__){}t.remove();}};
 const ics=d=>{const ymd=d.replace(/-/g,''),nx=new Date(Date.UTC(+d.slice(0,4),+d.slice(5,7)-1,+d.slice(8,10)+1)).toISOString().slice(0,10).replace(/-/g,'');
  const b=new Blob(['BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Timaxo//AR\r\nBEGIN:VEVENT\r\nUID:'+ymd+'-'+Date.now()+'@timaxo\r\nDTSTAMP:'+new Date().toISOString().replace(/[-:]|\.\d+/g,'')+'\r\nDTSTART;VALUE=DATE:'+ymd+'\r\nDTEND;VALUE=DATE:'+nx+'\r\nSUMMARY:Timaxo\r\nEND:VEVENT\r\nEND:VCALENDAR'],{type:'text/calendar'});
  const u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download='event-'+ymd+'.ics';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),4000);};
 fs.forEach(f=>{
  const c=document.createElement('button');c.type='button';c.className='fx-c';
  c.innerHTML='<small>'+(NM[f.type]?NM[f.type][ar?0:1]:f.type)+'</small><b>'+esc(f.value)+'</b>';
  c.title=ar?'اضغط للنسخ':'Tap to copy';
  c.onclick=async()=>{await copy(f.value);c.classList.add('ok');setTimeout(()=>c.classList.remove('ok'),1200);};
  list.appendChild(c);
  if(f.action){
   if(f.action.href){const a=document.createElement('a');a.className='fx-a';a.href=f.action.href;if(/^https?:/.test(f.action.href)){a.target='_blank';a.rel='noopener'}a.textContent=f.action.label;list.appendChild(a);}
   else if(f.action.ics){const a=document.createElement('button');a.type='button';a.className='fx-a';a.textContent=f.action.label;a.onclick=()=>ics(f.action.ics);list.appendChild(a);}
  }
  if(f.type==='national_id'&&f.info){const i=document.createElement('div');i.className='fx-i';i.style.flexBasis='100%';i.textContent=(ar?'ميلاد ':'Born ')+f.info.birth+' · '+(f.info.governorate||'')+' · '+f.info.gender;list.appendChild(i);}
 });
 res.appendChild(box);
}
async function ocrModal(p,box){const ar=AR(),L2=(a,b)=>ar?a:b;
 let sel=(localStorage.getItem('tx_ol')||(ar?'ara+eng':'eng+ara')).split('+').filter(x=>OCR_LANGS.some(l=>l.c===x));if(!sel.length)sel=['ara','eng'];
 const lname=l=>ar?l.ar:l.en,main=OCR_LANGS.slice(0,2),extra=OCR_LANGS.slice(2);
 const m=document.createElement('div');m.className='mdl-bd';
 m.innerHTML='<div class="mdl ox" role="dialog" aria-modal="true"><div class="grab"></div>'+
  '<div class="ox-h"><div class="ox-ic">'+OX_SVG.scan+'</div><div class="mdl-t">'+(box?L2('قراءة المنطقة المحددة','Read selected area'):L2('استخراج النص','Extract text'))+'<small id="oLG" role="button" tabindex="0"></small></div><button type="button" class="mdl-x" data-a="x" aria-label="'+L2('إغلاق','Close')+'">'+OX_SVG.x.replace('<svg','<svg style="width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round"')+'</button></div>'+
  '<div class="ox-langs" id="oL"></div><div class="ox-more" id="oM" hidden></div>'+
  '<div class="ox-run" id="oRun"><div class="ox-th" id="oTh"></div><div class="ox-rt"><b id="oT1"></b><span id="oT2"></span><div class="ox-pb"><i id="oP"></i></div><div class="ox-pc" id="oPc">0%</div></div></div>'+
  '<div class="ox-res" id="oRes" hidden><div class="ox-meta" id="oMeta"></div><textarea dir="auto" rows="7"></textarea><div class="ox-note" id="oNote"></div></div>'+
  '<div class="ox-acts" id="oActs" hidden><button type="button" class="ox-btn pri" data-a="c">'+OX_SVG.copy+'<span>'+L2('نسخ النص','Copy text')+'</span></button>'+(box?'<button type="button" class="ox-btn" data-a="r">'+L2('استبدال','Replace')+'</button>':'')+'<button type="button" class="ox-btn" data-a="t">'+OX_SVG.tr+'<span>'+L2('ترجمة','Translate')+'</span></button><button type="button" class="ox-btn ic" data-a="o" aria-label="'+L2('المزيد','More')+'">'+OX_SVG.more+'<span>'+L2('المزيد','More')+'</span></button></div><div class="ox-menu" id="oMenu" hidden></div></div></div>';
 document.body.appendChild(m);
 const $m=s=>m.querySelector(s),ta=$m('textarea'),pb=$m('#oP'),t1=$m('#oT1'),t2=$m('#oT2'),res=$m('#oRes'),run=$m('#oRun'),acts=$m('#oActs'),meta=$m('#oMeta'),note=$m('#oNote'),th=$m('#oTh');
 let dead=0,rid=0,cv=null,ink='#222',deepNext=false,sk=0,sbox=null,bm=null,lastBest=null,lastDeep=false;
 /* v141: «تحديد النص من الصورة» انتقل لقايمة الإعدادات (⚙) */
 const chip=(l,cls)=>'<button type="button" class="ox-chip '+(cls||'')+'" data-l="'+l.c+'">'+lname(l)+'</button>';
 const isAuto=()=>sel.length===2&&sel.includes('ara')&&sel.includes('eng');
 const paint=()=>{$m('#oL').innerHTML='<button type="button" class="ox-chip auto'+(isAuto()?' on':'')+'" data-auto="1">'+L2('تلقائي','Auto')+'</button>'+main.map(l=>chip(l,sel.includes(l.c)&&!isAuto()?'on':'')).join('')+'<button type="button" class="ox-chip more'+(sel.some(x=>extra.some(l=>l.c===x))?' on':'')+'" data-more="1">'+L2('أخرى','More')+'</button>';
  $m('#oM').innerHTML=extra.map(l=>chip(l,sel.includes(l.c)?'on':'')).join('');{const g=$m('#oLG');if(g)g.textContent=L2('اللغة: ','Language: ')+(isAuto()?L2('تلقائي','Auto'):sel.map(c=>lname(OCR_LANGS.find(l=>l.c===c))).join(' + '))+' ▾';}};paint();
 const lang=()=>{const o=OCR_LANGS.map(l=>l.c);return sel.slice().sort((a,b)=>o.indexOf(a)-o.indexOf(b)).join('+');};
 const stage=(i,n)=>{t1.textContent=n>1&&i>0?L2('بجرّب طريقة تانية للصورة…','Trying another image treatment…'):L2('بيظبط الصورة ويقرأ…','Tuning the image and reading…');};
 const finish=(best,deep)=>{const W=best.W,sc=best.sc;sbox=null;
   try{if(box&&bm&&!sk&&best.M&&best.M.length){let ax=1e9,ay=1e9,bx=-1e9,by=-1e9,n=0;best.M.forEach(w=>{if(w.c<35)return;n++;ax=Math.min(ax,w.x0);ay=Math.min(ay,w.y0);bx=Math.max(bx,w.x1);by=Math.max(by,w.y1);});
    if(n){const cx=x=>((x-bm.pd)/bm.k+bm.sx)/bm.fw,cy=y=>((y-bm.pd)/bm.k+bm.sy)/bm.fh,px=2/bm.fw,py=2/bm.fh;
     const nb={x0:Math.max(box.x0,cx(ax)-px),y0:Math.max(box.y0,cy(ay)-py),x1:Math.min(box.x1,cx(bx)+px),y1:Math.min(box.y1,cy(by)+py)};
     const ar0=(box.x1-box.x0)*(box.y1-box.y0),ar1=(nb.x1-nb.x0)*(nb.y1-nb.y0);if(nb.x1>nb.x0&&nb.y1>nb.y0&&ar1/ar0>=.15)sbox=nb;}}}catch(_){} /* v141: تضييق مربع الاستبدال على حدود النص الفعلية */let T=best.T!=null?best.T:ocrText(best.r,35);try{if(window.TXFields)T=TXFields.fixDigits(T)}catch(_){}
  lastBest=best;lastDeep=!!deep;ta.value=T;res.hidden=false;acts.hidden=false;run.hidden=true;th.classList.add('done');
  const pct=Math.round(sc.mean),qc=pct>=85?'g':pct>=70?'m':'l',ql=pct>=85?L2('دقة عالية','High accuracy'):pct>=70?L2('دقة جيدة','Good accuracy'):L2('راجع النص','Please review');
  tbQ={pct:pct,qc:qc,ql:ql};const nw=T.split(/\s+/).filter(Boolean).length,nl=T.split('\n').filter(Boolean).length;
  meta.innerHTML=T?'<span class="ox-b q '+qc+'"><i></i>'+ql+' · '+pct+'%</span><span class="ox-b mu">'+nw+' '+L2('كلمة','words')+' · '+nl+' '+L2('سطر','lines')+'</span>':'';
  note.textContent=T?(pct<70?L2('الثقة منخفضة. جرّب «قراءة أدق» أو غيّر اللغة، وراجع الأرقام والأسماء.','Low confidence. Try Deep read or another language, and check numbers and names.'):''):L2('ما لقيتش نص واضح. جرّب لغة تانية أو «قراءة أدق».','No clear text. Try another language or Deep read.');
  try{ocrIdx(p,T,box);ocrExtras(ta,p,T,box)}catch(_){}try{ocrFields(res,T,ar)}catch(e){console.warn('fx',e)}{const ox=ta.nextElementSibling;if(ox&&ox.classList.contains('ocx'))ox.dataset.l=L2('تصدير كـ','Export as');}
  if(!T)ta.hidden=true;else ta.hidden=false;deepNext=!deep;try{tblInit(best)}catch(e){console.warn('tbl',e)}};
 const tbx=document.createElement('div');tbx.className='tbx';tbx.hidden=true;res.appendChild(tbx);
 let TB=null,tbTok=0,tbSrc=null,tbCrop=null,tbCmp=localStorage.getItem('tx_tbcmp')!=='0',tbZ=1,tbEdOpen=false,tbLast=null,tbLP=0,tbCpOpen=false,tbAlt=null,tbRC=0,tbCv=null,tbQ=null,tbSplit=0,tbHist=[],tbWt=localStorage.getItem('tx_tbwt')!=='0';
 const tbSave=(n,b)=>{const u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download=n;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),4000);};
 const tbRows=()=>{if(TB&&TB.engine===2&&TB.nR){const M2=Array.from({length:TB.nR},()=>Array(TB.nC).fill(''));tbx.querySelectorAll('.tbx-t td[data-r]').forEach(td=>{M2[+td.dataset.r][+td.dataset.c]=td.innerText.replace(/\u00a0/g,' ').trim();});return M2;}return Array.from(tbx.querySelectorAll('.tbx-t tr')).map(tr=>Array.from(tr.children).map(td=>td.innerText.replace(/\u00a0/g,' ').trim()));};
 const tbEd=()=>{if(!(TB&&TB.engine===2))return'';const sw=['','FFF2CC','DDEBFF','E2F0D9','FCE4D6','D9D9D9','93B2DE'];
  return'<div class="tbx-ed">'+[['mr',L2('دمج جنب','Merge next')],['md',L2('دمج تحت','Merge below')],['un',L2('فك الدمج','Unmerge')],['b','B'],['sz+','A+'],['sz-','A\u2212']].map(a=>'<button type="button" class="ox-chip" data-ed="'+a[0]+'">'+a[1]+'</button>').join('')+'<i class="tbx-dv"></i>'+sw.map(c=>'<button type="button" class="tbx-sw2" data-ed="bg" data-v="'+c+'" style="background:'+(c?'#'+c:'transparent')+'" aria-label="color"></button>').join('')+'</div>';};
 const tbSet=rs=>(TB.all&&TB.all.length>1?TB.all:[TB]).map(t=>t===TB?Object.assign({},t,{rows:rs}):t);
 const tbLum=h=>parseInt(h.slice(0,2),16)*.3+parseInt(h.slice(2,4),16)*.59+parseInt(h.slice(4,6),16)*.11;
 let tbCur=null;
 const tbBody=()=>{const R=TB.rows;if(TB.engine===2&&window.TXExport){const L=TXExport.layout(TB),AL={l:'left',c:'center',r:'right'};let o='';
   for(let r=0;r<TB.nR;r++){o+='<tr>';for(let c=0;c<TB.nC;c++){const e=L[r][c];if(e.k==='cov')continue;
    if(e.k==='void'){o+='<td class="tbx-v" data-r="'+r+'" data-c="'+c+'"></td>';continue;}
    const s0=(TB.st&&TB.st[r]&&TB.st[r][c])||{},bg=s0.bg,fg=s0.fg||(bg?(tbLum(bg)<140?'FFFFFF':'111111'):null);
    o+='<td tabindex="-1" dir="auto" data-r="'+r+'" data-c="'+c+'"'+(tbCur&&tbCur.r===r&&tbCur.c===c?' class="tbx-sel"':'')+(e.cs>1?' colspan="'+e.cs+'"':'')+(e.rs>1?' rowspan="'+e.rs+'"':'')+' style="'+(bg?'background:#'+bg+';':'')+(fg?'color:#'+fg+';':'')+(s0.al?'text-align:'+AL[s0.al]+';':'')+(s0.b?'font-weight:700;':'')+(s0.sz?'font-size:'+Math.round(s0.sz/11*100)+'%;':'')+'">'+tbX(R[r][c]||'').replace(/\n/g,'<br>')+'</td>';}
    o+='</tr>';}return o;}
  return R.map(r=>'<tr>'+r.map(c=>'<td contenteditable="true" dir="auto">'+tbX(c).replace(/\n/g,'<br>')+'</td>').join('')+'</tr>').join('');};
 const tbView=v=>{const on=v==='tb',ox=ta.nextElementSibling;{const mm=m.querySelector('.mdl');if(mm)mm.classList.toggle('tbmode',on);}tbx.hidden=!on;ta.hidden=on||!ta.value.trim();if(ox&&ox.classList.contains('ocx'))ox.hidden=on;note.hidden=on;acts.hidden=on;meta.querySelectorAll('[data-tv]').forEach(b=>b.classList.toggle('on',b.dataset.tv===v));};
const tbPaintSrc=()=>{const c=tbx.querySelector('#tbSrcC');if(!c||!tbSrc)return;const pc=tbSrc.pc,cv0=tbSrc.cv,W=pc.width,H=pc.height;let src=pc;try{if(cv0&&Math.abs(cv0.width/cv0.height-W/H)<.02)src=cv0;}catch(_){}
  let x0=0,y0=0,x1=W,y1=H;if(TB&&TB.engine===2&&TB.boxes){let a=1e9,b=1e9,c2=-1e9,d=-1e9;TB.boxes.forEach(r=>r.forEach(q=>{if(q&&q.x1>q.x0){a=Math.min(a,q.x0);b=Math.min(b,q.y0);c2=Math.max(c2,q.x1);d=Math.max(d,q.y1);}}));if(c2>a&&d>b){const pd=Math.max(8,W*.01);x0=Math.max(0,a-pd);y0=Math.max(0,b-pd);x1=Math.min(W,c2+pd);y1=Math.min(H,d+pd);}}
  tbCrop={x0:x0,y0:y0,w:x1-x0,h:y1-y0};const k=Math.min(1,1500/tbCrop.w),sc=src.width/W;c.width=Math.max(8,Math.round(tbCrop.w*k));c.height=Math.max(8,Math.round(tbCrop.h*k));const g=c.getContext('2d');g.imageSmoothingQuality='high';g.drawImage(src,x0*sc,y0*sc,tbCrop.w*sc,tbCrop.h*sc,0,0,c.width,c.height);
  const w=tbx.querySelector('#tbSc');if(w)w.style.width=Math.round(tbZ*100)+'%';if(tbCur)tbHlShow(tbCur.r,tbCur.c,false);};
 const tbHlShow=(r,c,scroll)=>{const h=tbx.querySelector('#tbHl'),w=tbx.querySelector('#tbSrcW');if(!h||!tbCrop||!TB||!TB.boxes){return;}const q=TB.boxes[r]&&TB.boxes[r][c];if(!q||!(q.x1>q.x0)){h.hidden=true;return;}
  h.hidden=false;h.style.left=((q.x0-tbCrop.x0)/tbCrop.w*100)+'%';h.style.top=((q.y0-tbCrop.y0)/tbCrop.h*100)+'%';h.style.width=((q.x1-q.x0)/tbCrop.w*100)+'%';h.style.height=((q.y1-q.y0)/tbCrop.h*100)+'%';
  if(scroll&&w){const sc=tbx.querySelector('#tbSc'),cw=sc.clientWidth,ch=sc.clientHeight,cx=((q.x0+q.x1)/2-tbCrop.x0)/tbCrop.w*cw,cy=((q.y0+q.y1)/2-tbCrop.y0)/tbCrop.h*ch;w.scrollTo({left:cx-w.clientWidth/2,top:cy-w.clientHeight/2,behavior:'smooth'});}};
 const tbPick=e=>{const sc=tbx.querySelector('#tbSc');if(!sc||!tbCrop||!TB||!TB.boxes)return;const R=sc.getBoundingClientRect(),X=tbCrop.x0+(e.clientX-R.left)/R.width*tbCrop.w,Y=tbCrop.y0+(e.clientY-R.top)/R.height*tbCrop.h;
  for(let r=0;r<TB.boxes.length;r++)for(let c=0;c<TB.boxes[r].length;c++){const q=TB.boxes[r][c];if(q&&X>=q.x0&&X<=q.x1&&Y>=q.y0&&Y<=q.y1){const td=tbx.querySelector('td[data-r="'+r+'"][data-c="'+c+'"]');if(!td)continue;tbx.querySelectorAll('td.tbx-sel').forEach(x=>x.classList.remove('tbx-sel'));td.classList.add('tbx-sel');tbCur={r:r,c:c};tbx.classList.add('hascur');tbHlShow(r,c,false);td.scrollIntoView({block:'center',inline:'center',behavior:'smooth'});return;}}};
const tbSnap=()=>JSON.stringify({rows:TB.rows,spans:TB.spans,st:TB.st,voids:TB.voids});
 const tbUndo=()=>{const z=tbHist.pop();if(!z){toast(L2('مفيش حاجة للتراجع عنها','Nothing to undo'));return;}try{Object.assign(TB,JSON.parse(z));}catch(_){return;}tbDraw();};
 const tbEdit=td=>{td.contentEditable='true';td.focus();try{const g=getSelection(),rg=document.createRange();rg.selectNodeContents(td);rg.collapse(false);g.removeAllRanges();g.addRange(rg);}catch(_){}};
 const tbTap=td=>{if(tbLP){tbLP=0;return;}if(td.isContentEditable)return;const r=+td.dataset.r,c=+td.dataset.c,now=Date.now();
  /* الكيبورد بيطلع بس بضغطتين سريعتين أو ضغطة مطوّلة؛ الضغطة الواحدة تحديد بس */
  if(tbLast&&tbLast.r===r&&tbLast.c===c&&now-tbLast.t<380){tbLast=null;tbEdit(td);return;}tbLast={r:r,c:c,t:now};
  tbx.querySelectorAll('td.tbx-sel').forEach(x=>x.classList.remove('tbx-sel'));td.classList.add('tbx-sel');tbCur={r:r,c:c};tbx.classList.add('hascur');tbHlShow(r,c,true);
  const n=tbx.querySelector('#tbN');if(n)n.textContent=L2('الخلية المختارة: صف ','Selected: row ')+(r+1)+L2(' · عمود ',' · col ')+(c+1)+' — '+L2('ضغطتين أو ضغطة مطوّلة للكتابة','double-tap or long-press to type');};
 const tbWire=()=>{const tl=tbx.querySelector('.tbw-tools'),tw=tbx.querySelector('.tbw-tw');if(tl&&tw){const upd=()=>{const mx=tl.scrollWidth-tl.clientWidth,rt=getComputedStyle(tl).direction==='rtl',p=Math.abs(tl.scrollLeft);tw.classList.toggle('cl',mx>4&&(rt?p<mx-2:p>2));tw.classList.toggle('cr',mx>4&&(rt?p>2:p<mx-2));};tl.onscroll=upd;upd();setTimeout(upd,150);}
  const dv=tbx.querySelector('#tbDv'),sp=tbx.querySelector('#tbSrcP');
  if(dv&&sp){if(tbSplit)sp.style.flex='0 0 '+tbSplit+'px';dv.onpointerdown=e=>{try{dv.setPointerCapture(e.pointerId);}catch(_){}const y0=e.clientY,h0=sp.getBoundingClientRect().height,mx=tbx.querySelector('.tbw-main').clientHeight-150;dv.onpointermove=ev=>{const h=Math.max(70,Math.min(h0+ev.clientY-y0,mx));sp.style.flex='0 0 '+h+'px';tbSplit=h;};dv.onpointerup=dv.onpointercancel=()=>{dv.onpointermove=null;};};}
  const sw=tbx.querySelector('#tbSrcW');if(sw){const P=new Map();let d0=0,z0=1;sw.onpointerdown=e=>{P.set(e.pointerId,[e.clientX,e.clientY]);if(P.size===2){const a=[...P.values()];d0=Math.hypot(a[0][0]-a[1][0],a[0][1]-a[1][1])||1;z0=tbZ;}};
   sw.onpointermove=e=>{if(!P.has(e.pointerId))return;P.set(e.pointerId,[e.clientX,e.clientY]);if(P.size===2&&d0){const a=[...P.values()],d=Math.hypot(a[0][0]-a[1][0],a[0][1]-a[1][1]);tbZ=Math.max(1,Math.min(5,z0*d/d0));const sc=tbx.querySelector('#tbSc');if(sc)sc.style.width=Math.round(tbZ*100)+'%';}};
   sw.onpointerup=sw.onpointercancel=e=>{P.delete(e.pointerId);d0=0;};}};
const tbApply=(k,v)=>{if(!TB||TB.engine!==2)return;if(!tbCur){toast(L2('اضغط على خلية الأول','Tap a cell first'));return;}TB.rows=tbRows();tbHist.push(tbSnap());if(tbHist.length>30)tbHist.shift();if(!TXExport.op(TB,tbCur,k,v))toast(L2('مش ينفع هنا','Not possible here'));tbDraw();};
const tbReadCell=async()=>{if(!TB||TB.engine!==2||!TB.boxes)return;if(!tbCur){toast(L2('اضغط على خلية الأول','Tap a cell first'));return;}if(tbRC){toast(L2('لسه بقرأ الخلية…','Still reading…'));return;}
  const r=tbCur.r,c=tbCur.c;let L=null;try{L=TXExport.layout(TB);}catch(_){}const e0=L&&L[r]&&L[r][c],cs=(e0&&e0.cs)||1,rs=(e0&&e0.rs)||1;let b=null;
  for(let i=r;i<Math.min(TB.nR,r+rs);i++)for(let j=c;j<Math.min(TB.nC,c+cs);j++){const q=TB.boxes[i]&&TB.boxes[i][j];if(q&&q.x1>q.x0)b=b?{x0:Math.min(b.x0,q.x0),y0:Math.min(b.y0,q.y0),x1:Math.max(b.x1,q.x1),y1:Math.max(b.y1,q.y1)}:{x0:q.x0,y0:q.y0,x1:q.x1,y1:q.y1};}
  if(!b){toast(L2('مش قادر أحدد مكان الخلية في الصورة','Cannot locate the cell in the image'));return;}
  const my=++tbTok,td=tbx.querySelector('td[data-r="'+r+'"][data-c="'+c+'"]'),hint=tbx.querySelector('#tbN');tbRC=1;if(td)td.classList.add('tbx-rd');tbx.classList.add('rding');if(hint)hint.textContent=L2('بقرأ الخلية دي بس من الصورة الأصلية…','Reading just this cell from the original image…');
  let txt=null,alts=[];try{const rr=await tbRefineOne(tbCv||cv,b,TB,lang(),OQ(),tbSrc&&tbSrc.pc&&tbSrc.pc.width);txt=rr.t;alts=rr.alts||[];}catch(err){console.error(err);toast(L2('تعذّرت قراءة الخلية: ','Failed: ')+String(err&&err.message||err).slice(0,60));}
  tbRC=0;tbx.classList.remove('rding');if(td)td.classList.remove('tbx-rd');if(dead||my!==tbTok)return;
  if(txt==null){return;}if(!txt){toast(L2('ملقتش نص في الخلية دي','No text found in this cell'));if(hint)hint.textContent=L2('ملقتش نص في الخلية دي','No text found in this cell');return;}
  TB.rows=tbRows();const old=TB.rows[r]&&TB.rows[r][c];if(old===txt){toast(L2('نفس النتيجة — القراءة الحالية صح غالبًا','Same result — current text is probably right'));return;}
  tbHist.push(tbSnap());if(tbHist.length>30)tbHist.shift();TB.rows[r][c]=txt;tbAlt={r:r,c:c,l:alts};tbDraw();const n2=tbx.querySelector('#tbN');if(n2){n2.textContent=L2('اتقرأت الخلية ✓ ','Cell read ✓ ')+(alts.length?L2('لو مش مظبوطة جرّب بديل:','If wrong try:'):L2('راجع النتيجة','check it'));alts.forEach((a,i)=>{const bt=document.createElement('button');bt.type='button';bt.className='tbx-alt';bt.dataset.alt=i;bt.textContent=a.length>26?a.slice(0,26)+'…':a;n2.appendChild(bt);});}};
 tbx.addEventListener('change',e=>{const ci=e.target.closest&&e.target.closest('.tbw-cc');if(ci)tbApply('bg',String(ci.value||'').replace('#','').toUpperCase());});
const tbBusy=title=>{const o=document.createElement('div');o.className='tbw-busy';o.innerHTML='<div class="tbw-bc"><div class="tbw-ring" style="--p:0"><b>0%</b></div><div class="tbw-bt">'+title+'</div><small>'+L2('ممكن ياخد دقيقة. تقدر تلغي في أي وقت','May take a minute. You can cancel anytime')+'</small><button type="button">'+L2('إلغاء','Cancel')+'</button></div>';
  m.querySelector('.mdl').appendChild(o);o.querySelector('button').onclick=()=>{tbTok++;o.remove();toast(L2('اتلغت القراءة','Cancelled'));};
  return{set:v=>{const p=Math.round(Math.max(0,Math.min(1,v))*100),r=o.querySelector('.tbw-ring');if(r){r.style.setProperty('--p',p);r.firstChild.textContent=p+'%';}},end:()=>o.remove()};};
 const tbDraw=()=>{const R=TB.rows,nC=Math.max(...R.map(r=>r.length));const mm=m.querySelector('.mdl');if(mm)mm.classList.toggle('tbcmp',!!(tbCmp&&tbSrc));
  tbx.classList.toggle('hascur',!!tbCur);tbx.classList.toggle('cpo',tbCpOpen);
  const S0={a:tbx.querySelector('.tbw-tools'),b:tbx.querySelector('.tbx-w'),c:tbx.querySelector('#tbSrcW'),d:tbx.querySelector('.tbw-main')},SV={tl:S0.a?S0.a.scrollLeft:0,wt:S0.b?S0.b.scrollTop:0,wl:S0.b?S0.b.scrollLeft:0,st:S0.c?S0.c.scrollTop:0,sl:S0.c?S0.c.scrollLeft:0,mt:S0.d?S0.d.scrollTop:0};
  const IC=p=>'<svg viewBox="0 0 24 24">'+p+'</svg>',q=tbQ||{pct:0,qc:'g',ql:''};
  const TL=(k,ic,lb,need,extra)=>'<button type="button" class="tbw-tl'+(need?' need':'')+'" '+k+'>'+ic+'<span>'+lb+'</span></button>';
  const ED=(k,ic,lb)=>TL('data-ed="'+k+'"',ic,lb,1);
  const sw=['','FFF2CC','FFE699','DDEBFF','BDD7EE','E2F0D9','C6E0B4','FCE4D6','F8CBAD','F4CCCC','E4D7F5','D9D9D9','93B2DE','1F4E79'];
  const eng2=TB.engine===2;
  const cs0=tbCur&&TB.st&&TB.st[tbCur.r]&&TB.st[tbCur.r][tbCur.c],curBg=(cs0&&cs0.bg)||'';
  const XI={copy:'<rect class="d" x="9" y="9" width="11" height="11" rx="2.5"/><path d="M5 15V6.5A2.5 2.5 0 0 1 7.5 4H15"/>',xlsx:'<rect x="3.5" y="4" width="17" height="16" rx="2.5"/><path d="M3.5 9.5h17M9.5 9.5V20M15 9.5V20"/>',docx:'<path d="M7 3.5h7.5L19 8v11a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 6 19V5a1.5 1.5 0 0 1 1-1.5z"/><path d="M14 3.5V8h5M9 12.5h6M9 16h6"/>',csv:'<path d="M5 7h14M5 12h14M5 17h9"/><circle cx="18" cy="17" r="1.3"/>'};
  const XM={
 xlsx:'<svg viewBox="0 0 48 48"><defs><linearGradient id="gxl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#34d889"/><stop offset="1" stop-color="#0c7a43"/></linearGradient></defs><rect x="15" y="5" width="30" height="38" rx="6" fill="#fff" opacity=".95"/><path d="M27 15h11M27 22h11M27 29h11M27 36h11" stroke="#1d9a5b" stroke-width="2.3" stroke-linecap="round" opacity=".5"/><rect x="3" y="10" width="26" height="28" rx="6" fill="url(#gxl)"/><path d="M10.5 18l11 12M21.5 18l-11 12" stroke="#fff" stroke-width="3.6" stroke-linecap="round"/></svg>',
 docx:'<svg viewBox="0 0 48 48"><defs><linearGradient id="gwd" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5aa2ff"/><stop offset="1" stop-color="#1747b8"/></linearGradient></defs><rect x="15" y="5" width="30" height="38" rx="6" fill="#fff" opacity=".95"/><path d="M27 15h11M27 22h11M27 29h11M27 36h11" stroke="#2f6ae0" stroke-width="2.3" stroke-linecap="round" opacity=".5"/><rect x="3" y="10" width="26" height="28" rx="6" fill="url(#gwd)"/><path d="M8.5 18.5l3.3 11 4.2-8.5 4.2 8.5 3.3-11" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
 csv:'<svg viewBox="0 0 48 48"><defs><linearGradient id="gcv" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffb84d"/><stop offset="1" stop-color="#e2680c"/></linearGradient></defs><rect x="15" y="5" width="30" height="38" rx="6" fill="#fff" opacity=".95"/><path d="M27 15h11M27 22h11M27 29h11M27 36h11" stroke="#f08a24" stroke-width="2.3" stroke-linecap="round" opacity=".5"/><rect x="3" y="10" width="26" height="28" rx="6" fill="url(#gcv)"/><text x="16" y="29.5" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="900" font-size="10.5" fill="#fff">CSV</text></svg>'};
  const XB=(k,cl,nm,ds)=>'<button type="button" class="tbw-ec '+cl+'" data-t="'+k+'"><i'+(XM[k]?' class="mk">'+XM[k]:'>'+IC(XI[k]))+'</i><span><b>'+nm+'</b><small>'+ds+'</small></span></button>';
  tbx.innerHTML=
  '<div class="tbw-bar"><button type="button" class="tbw-x" data-a="x" aria-label="'+L2('إغلاق','Close')+'">\u2715</button><div class="tbw-seg"><button type="button" data-tv2="t">'+L2('النص','Text')+'</button><button type="button" class="on" data-tv2="tb">'+L2('جدول','Table')+'</button></div><button type="button" class="tbw-exp" data-t="exp">'+IC('<path d="M12 3v12M7 8l5-5 5 5M5 21h14"/>')+'<span>'+L2('تصدير','Export')+'</span></button></div>'+
  '<div class="tbw-st"><span class="tbw-q '+q.qc+'"><i></i>'+(q.ql||'')+(q.pct?' · '+q.pct+'%':'')+'</span><span class="tbw-sz" title="'+R.length+' '+L2('صف','rows')+' × '+nC+' '+L2('عمود','cols')+'">'+R.length+' × '+nC+'</span><button type="button" class="tbw-imp" data-t="refine" title="'+L2('تحسين الدقة: قراءة كل خلية لوحدها','Improve accuracy: re-read every cell')+'" aria-label="'+L2('تحسين الدقة','Improve accuracy')+'">'+IC('<path class="d" d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/>')+'<span>'+L2('تحسين','Improve')+'</span></button></div>'+
  (TB.all&&TB.all.length>1?'<div class="tbx-sw">'+TB.all.map((x,i)=>'<button type="button" class="ox-chip'+(x===TB?' on':'')+'" data-tt="'+i+'">'+L2('جدول ','Table ')+(i+1)+'</button>').join('')+'</div>':'')+
  '<div class="tbw-main">'+
  (tbSrc?(tbCmp?'<div class="tbw-sp" id="tbSrcP"><div class="tbx-src" id="tbSrcW" dir="ltr"><div class="tbx-sc" id="tbSc"><canvas id="tbSrcC"></canvas><i class="tbx-hl" id="tbHl" hidden></i></div></div><div class="tbw-fz"><button type="button" data-zm="1" aria-label="+">+</button><button type="button" data-zm="-1" aria-label="-">\u2212</button><button type="button" data-cm="0">'+L2('إخفاء الأصل','Hide')+'</button></div><span class="tbw-tag">'+L2('الأصل','Original')+'</span></div><div class="tbw-dv" id="tbDv" role="separator" aria-label="'+L2('اسحب لتغيير الحجم','Drag to resize')+'"><i></i></div>':'<button type="button" class="tbx-showsrc" data-cm="1">'+L2('قارن مع الأصل','Compare with original')+'</button>'):'')+
  '<div class="tbx-w"><table class="tbx-t" dir="'+(TB.rtl?'rtl':'ltr')+'">'+tbBody()+'</table></div></div>'+
  '<div class="tbw-hint" id="tbN">'+(eng2?L2('اضغط لاختيار الخلية · ضغطتين سريعتين أو ضغطة مطوّلة للكتابة','Tap to select · double-tap or long-press to type'):L2('اضغط على أي خلية لتعديلها','Tap any cell to edit'))+'</div>'+
  (eng2?'<div class="tbw-cp"'+(tbCpOpen?'':' hidden')+'>'+sw.map(c=>'<button type="button" class="tbx-sw2'+(curBg===c?' on':'')+'" data-ed="bg" data-v="'+c+'" style="background:'+(c?'#'+c:'transparent')+'" aria-label="color"></button>').join('')+'<label class="tbx-sw2 cu" aria-label="custom color"><input type="color" class="tbw-cc" value="#'+(curBg||'ffd966')+'"></label></div>'+
  '<div class="tbw-tw"><div class="tbw-tools">'+TL('data-undo="1"',IC('<path d="M9 6.5L4.5 11 9 15.5"/><path d="M4.5 11H14a5.5 5.5 0 0 1 0 11h-2.5"/>'),L2('تراجع','Undo'),0)+TL('data-rc="1"',IC('<rect class="d" x="3" y="5" width="12" height="10" rx="1.6"/><circle cx="16.5" cy="16.5" r="3.6"/><path d="M19.2 19.2l2.3 2.3M6.5 10h5"/>'),L2('قراءة الخلية','Read cell'),1)+'<i class="tbw-g"></i>'+
   ED('mr',IC('<rect class="d" x="3" y="6" width="18" height="12" rx="2.6"/><path d="M12 6v3M12 15v3M7.5 12h9M7.5 12l2.2-2.2M7.5 12l2.2 2.2M16.5 12l-2.2-2.2M16.5 12l-2.2 2.2"/>'),L2('دمج جنب','Merge →'))+ED('md',IC('<rect class="d" x="6" y="3" width="12" height="18" rx="2.6"/><path d="M6 12h3M15 12h3M12 7.5v9M12 7.5l-2.2 2.2M12 7.5l2.2 2.2M12 16.5l-2.2-2.2M12 16.5l2.2-2.2"/>'),L2('دمج تحت','Merge ↓'))+ED('un',IC('<rect class="d" x="3.5" y="4.5" width="17" height="15" rx="2.6"/><path d="M12 4.5v15M3.5 12h17"/><circle cx="12" cy="12" r="2" fill="currentColor" stroke="none"/>'),L2('فك الدمج','Split'))+'<i class="tbw-g"></i>'+
   ED('b','<b class="tbw-t">B</b>',L2('عريض','Bold'))+ED('sz+','<b class="tbw-t">A+</b>',L2('تكبير','Larger'))+ED('sz-','<b class="tbw-t sm">A\u2212</b>',L2('تصغير','Smaller'))+TL('data-cp="1"',IC('<path class="d" d="M12 3.2s6 6 6 10.2a6 6 0 0 1-12 0C6 9.2 12 3.2 12 3.2z"/><path d="M9.2 14a3 3 0 0 0 2.2 2.6"/>'),L2('لون الخلية','Fill'),1)+'<i class="tbw-g"></i>'+
   TL('data-t="deep"',IC('<path class="d" d="M6 3h9l4 4v14H6z"/><path d="M9 12h7M9 16h7"/>'),L2('قراءة الصفحة','Read page'),0)+'</div><button type="button" class="tbw-ar l" data-sc="-1" aria-label="scroll left">\u2039</button><button type="button" class="tbw-ar r" data-sc="1" aria-label="scroll right">\u203A</button></div>':'<div class="tbw-tools"><button type="button" class="tbw-tl" data-t="deep">'+IC('<path class="d" d="M6 3h9l4 4v14H6z"/><path d="M9 12h7M9 16h7"/>')+'<span>'+L2('قراءة أدق','Deep read')+'</span></button></div>')+
  '<div class="tbw-ex" hidden><div class="tbw-scrim" data-t="exp"></div><div class="tbw-ep"><i class="tbw-gr"></i><div class="tbw-eh">'+L2('تصدير الجدول','Export table')+'</div><div class="tbw-es">'+L2('اختار الصيغة المناسبة','Choose a format')+'</div>'+
  XB('copy','pri',L2('نسخ الجدول','Copy table'),L2('الصقه مباشرة في Word أو Excel','Paste straight into Word or Excel'))+'<div class="tbw-eg">'+XB('xlsx','x','Excel',L2('بالدمج والألوان','Merges & colors'))+XB('docx','w','Word',L2('جاهز للطباعة','Ready to print'))+XB('csv','c','CSV',L2('نص بسيط','Plain text'))+'</div>'+
  '<button type="button" class="tbw-er tgl'+(tbWt?'':' off')+'" data-t="wt"><span><b>'+L2('نص برا الجدول في Word','Text outside the table in Word')+'</b><small>'+L2('العناوين والملاحظات اللي حوالين الجدول','Titles and notes around the table')+'</small></span><em>'+(tbWt?L2('شغّال','On'):L2('متوقف','Off'))+'</em></button></div></div>';
  if(tbCmp&&tbSrc)tbPaintSrc();tbWire();
  {const a=tbx.querySelector('.tbw-tools'),b=tbx.querySelector('.tbx-w'),c=tbx.querySelector('#tbSrcW'),d=tbx.querySelector('.tbw-main');if(a){a.scrollLeft=SV.tl;a.dispatchEvent(new Event('scroll'));}if(b){b.scrollTop=SV.wt;b.scrollLeft=SV.wl;}if(c){c.scrollTop=SV.st;c.scrollLeft=SV.sl;}if(d)d.scrollTop=SV.mt;}};
 document.addEventListener('visibilitychange',()=>{if(!document.hidden&&!tbx.hidden&&tbSrc){setTimeout(()=>{try{tbPaintSrc();}catch(_){}} ,120);}});
 /* v174: زوم بصباعين جوه الجدول/الأصل بس */
 {let d0=0,z0=1,on=0;const dist=t=>Math.hypot(t[0].clientX-t[1].clientX,t[0].clientY-t[1].clientY);
  tbx.addEventListener('touchstart',e=>{if(e.touches.length===2&&e.target.closest&&e.target.closest('.tbx-w,#tbSrcW')){d0=dist(e.touches);z0=tbZ;on=1;}},{passive:true});
  tbx.addEventListener('touchmove',e=>{if(!on||e.touches.length!==2)return;e.preventDefault();const z=Math.max(1,Math.min(4,z0*dist(e.touches)/d0));if(Math.abs(z-tbZ)>.02){tbZ=z;const sc=tbx.querySelector('#tbSc');if(sc)sc.style.width=Math.round(tbZ*100)+'%';}},{passive:false});
  ['touchend','touchcancel'].forEach(n=>tbx.addEventListener(n,e=>{if(on&&e.touches.length<2){on=0;if(tbCur)setTimeout(()=>tbHlShow(tbCur.r,tbCur.c,true),30);}}));}
 tbx.addEventListener('focusin',e=>{const td=e.target.closest&&e.target.closest('td[data-r]');if(td&&TB&&TB.engine===2){const n={r:+td.dataset.r,c:+td.dataset.c};if(!tbCur||tbCur.r!==n.r||tbCur.c!==n.c){tbx.querySelectorAll('td.tbx-sel').forEach(x=>x.classList.remove('tbx-sel'));td.classList.add('tbx-sel');}tbCur=n;tbx.classList.add('hascur');tbHlShow(n.r,n.c,true);}});
 tbx.addEventListener('focusout',e=>{const td=e.target.closest&&e.target.closest('td[data-r]');if(td)td.contentEditable='false';});
 {let lt=null,lx=0,ly=0;const clr=()=>{clearTimeout(lt);lt=null;};
  tbx.addEventListener('pointerdown',e=>{const td=e.target.closest&&e.target.closest('td[data-r]');if(!td||!TB||TB.engine!==2||td.isContentEditable||e.pointerType==='mouse'&&e.button)return;lx=e.clientX;ly=e.clientY;clr();lt=setTimeout(()=>{lt=null;tbLP=0;if(!td.classList.contains('tbx-sel'))tbTap(td);tbLast=null;tbLP=1;setTimeout(()=>{tbLP=0;},700);try{navigator.vibrate&&navigator.vibrate(12);}catch(_){}tbEdit(td);},430);});
  tbx.addEventListener('pointermove',e=>{if(lt&&Math.hypot(e.clientX-lx,e.clientY-ly)>9)clr();});['pointerup','pointercancel','pointerleave'].forEach(n=>tbx.addEventListener(n,clr));
  tbx.addEventListener('contextmenu',e=>{const td=e.target.closest&&e.target.closest('td[data-r]');if(td&&!td.isContentEditable)e.preventDefault();});}
 tbx.onclick=async e=>{const scb=e.target.closest('[data-sc]');if(scb){const t0=tbx.querySelector('.tbw-tools');if(t0)t0.scrollBy({left:+scb.dataset.sc*190,behavior:'smooth'});return;}const tv=e.target.closest('[data-tv2]');if(tv){tbView(tv.dataset.tv2);return;}const ud=e.target.closest('[data-undo]');if(ud){tbUndo();return;}const al=e.target.closest('[data-alt]');if(al&&tbAlt&&TB){const v=tbAlt.l[+al.dataset.alt];if(v!=null){TB.rows=tbRows();tbHist.push(tbSnap());TB.rows[tbAlt.r][tbAlt.c]=v;const old=TB.rows[tbAlt.r][tbAlt.c];tbAlt.l=tbAlt.l.filter(x=>x!==v);tbDraw();toast(L2('اتبدّلت للبديل','Switched to alternative'));}return;}const rc=e.target.closest('[data-rc]');if(rc){tbReadCell();return;}const cp=e.target.closest('[data-cp]');if(cp){if(!tbCur){toast(L2('اضغط على خلية الأول','Tap a cell first'));return;}tbCpOpen=!tbCpOpen;tbx.classList.toggle('cpo',tbCpOpen);const pp=tbx.querySelector('.tbw-cp');if(pp)pp.hidden=!tbCpOpen;return;}const tdc=e.target.closest('td[data-r]');if(tdc&&TB&&TB.engine===2){tbTap(tdc);return;}const cm=e.target.closest('[data-cm]');if(cm){tbCmp=cm.dataset.cm==='1';try{localStorage.setItem('tx_tbcmp',tbCmp?'1':'0');}catch(_){}try{TB.rows=tbRows();}catch(_){}tbDraw();return;}const zm=e.target.closest('[data-zm]');if(zm){tbZ=Math.max(1,Math.min(4,tbZ+(+zm.dataset.zm)*.5));const sc=tbx.querySelector('#tbSc');if(sc)sc.style.width=Math.round(tbZ*100)+'%';if(tbCur)setTimeout(()=>tbHlShow(tbCur.r,tbCur.c,true),30);return;}if(e.target.closest('#tbSc')){tbPick(e);return;}const et=e.target.closest('[data-et]');if(et){tbEdOpen=!tbEdOpen;tbx.classList.toggle('edo',tbEdOpen);return;}const ed=e.target.closest('[data-ed]');if(ed&&TB&&TB.engine===2){try{navigator.vibrate&&navigator.vibrate(8);}catch(_){}if(!tbCur){toast(L2('اضغط على خلية الأول','Tap a cell first'));return;}const k=ed.dataset.ed;TB.rows=tbRows();tbHist.push(tbSnap());if(tbHist.length>30)tbHist.shift();const ok=TXExport.op(TB,tbCur,k.startsWith('sz')?'sz':k,k==='sz+'?1:k==='sz-'?-1:ed.dataset.v);if(!ok)toast(L2('مش ينفع هنا','Not possible here'));tbDraw();{const sd=tbx.querySelector('td.tbx-sel');if(sd){sd.classList.add('tbx-pop');setTimeout(()=>sd.classList.remove('tbx-pop'),360);}}return;}const sw=e.target.closest('[data-tt]');if(sw&&TB&&TB.all){const nt=TB.all[+sw.dataset.tt];if(nt&&nt!==TB){try{TB.rows=tbRows();}catch(_){}TB=nt;tbDraw();}return;}const b=e.target.closest('[data-t]');if(!b||!TB)return;const k=b.dataset.t;{const mn=tbx.querySelector('.tbw-ex');if(k==='exp'){if(mn)mn.hidden=!mn.hidden;return;}if(mn&&k!=='wt')mn.hidden=true;}const rows=tbRows(),nm=(state.name||'Timaxo').replace(/[\\/:*?"<>|]/g,'_')+L2('-جدول','-table');
  if(k==='copy'){let ok=false;try{if(window.ClipboardItem){await navigator.clipboard.write([new ClipboardItem({'text/html':new Blob([TB.engine===2&&window.TXExport?TXExport.html(Object.assign({},TB,{rows})):tbHtml(rows,TB.rtl)],{type:'text/html'}),'text/plain':new Blob([tbTsv(rows)],{type:'text/plain'})})]);ok=true;}}catch(_){}
   if(!ok){try{await navigator.clipboard.writeText(tbTsv(rows));ok=true;}catch(_){}}
   toast(ok?L2('اتنسخ الجدول — الصقه في Word أو Excel','Table copied — paste it into Word or Excel'):L2('تعذّر النسخ','Copy failed'));}
  else if(k==='xlsx')tbSave(nm+'.xlsx',TB.engine===2&&window.TXExport?TXExport.xlsx(tbSet(rows).map((g,i)=>({g,name:L2('جدول ','Table ')+(i+1)}))):tbXlsx(rows,TB.rtl));
  else if(k==='docx')tbSave(nm+'.docx',TB.engine===2&&window.TXExport?TXExport.docx(tbSet(rows).map(g=>tbWt?g:Object.assign({},g,{before:[],tail:[]}))):tbDocx(rows,TB.rtl));
  else if(k==='csv')tbSave(nm+'.csv',new Blob([tbCsv(rows)],{type:'text/csv;charset=utf-8'}));
  else if(k==='deep')go(true);
  else if(k==='wt'){tbWt=!tbWt;try{localStorage.setItem('tx_tbwt',tbWt?'1':'0');}catch(_){}{const em=b.querySelector('em');if(em)em.textContent=tbWt?L2('شغّال','On'):L2('متوقف','Off');b.classList.toggle('off',!tbWt);}}
  else if(k==='refine'){const my=++tbTok,ov=tbBusy(L2('بقرأ الخلايا واحدة واحدة','Reading cells one by one'));
   try{const out=await tbRefine(tbCv||cv,TB,lang(),OQ(),pr=>ov.set(pr),()=>dead||my!==tbTok);
    if(out&&!dead&&my===tbTok){tbHist.push(tbSnap());TB.rows=out;tbDraw();const n2=tbx.querySelector('#tbN');if(n2)n2.textContent=L2('تمت القراءة الدقيقة ✓ راجع الأرقام قبل الاستخدام','Precise read done ✓ check the numbers');}}
   catch(err){console.error(err);toast(L2('تعذّرت القراءة: ','Failed: ')+String(err&&err.message||err).slice(0,80));}
   finally{ov.end();}}};
 meta.onclick=e=>{const b=e.target.closest('[data-tv]');if(b)tbView(b.dataset.tv);};
 const tblInit=best=>{if(!box&&best&&best.M)ltStore(p,cv,best.M);tbTok++;tbx.hidden=true;tbx.innerHTML='';TB=null;meta.querySelectorAll('[data-tv]').forEach(x=>x.remove());
  if(box||!best||!best.M)return;let M2=best.M,pc2=best.pc,cv2=cv;/* v164: الصورة المايلة: نعدّلها ونحوّل إحداثيات الكلمات قبل كشف الجدول */
  if(best.engine==='onnx'&&Math.abs(best.skew||0)>.012&&best.pc&&best.pc.width){try{const a=-best.skew,base=best.pc,r=ocrRot(base,a),c=Math.cos(a),sn=Math.sin(a),W=base.width,H=base.height;
   M2=best.M.map(w=>{const dx=(w.x0+w.x1)/2-W/2,dy=(w.y0+w.y1)/2-H/2,nx=dx*c-dy*sn+r.width/2,ny=dx*sn+dy*c+r.height/2,hw=(w.x1-w.x0)/2,hh=(w.y1-w.y0)/2;return Object.assign({},w,{x0:nx-hw,x1:nx+hw,y0:ny-hh,y1:ny+hh});});pc2=r;cv2=r;}catch(_){M2=best.M;pc2=best.pc;cv2=cv;}}
  const t=tbBuild(M2,cv2,pc2);if(!t)return;TB=t;tbCv=cv2;tbSrc={cv:cv2,pc:pc2};tbDraw();
  meta.insertAdjacentHTML('beforeend','<button type="button" class="ox-chip on" data-tv="t">'+L2('النص','Text')+'</button><button type="button" class="ox-chip" data-tv="tb">'+L2('جدول','Table')+'</button>');
  tbView(t.strong?'tb':'t');};
 const go=async(deep)=>{const id=++rid;{const mm=m.querySelector('.mdl');if(mm)mm.classList.remove('tbmode');}res.hidden=true;acts.hidden=true;run.hidden=false;th.classList.remove('done');t1.textContent=L2('جاري التحميل…','Loading…');t2.textContent=lang().split('+').map(c=>lname(OCR_LANGS.find(l=>l.c===c))).join(' + ')+' · '+(OQ()==='best'?L2('نموذج عالي الدقة','High-accuracy model'):L2('نموذج سريع','Fast model'));pb.style.transition='width .45s cubic-bezier(.2,.8,.2,1)';pb.style.width='6%';
  const pcl=$m('#oPc'),setPb=v=>{const cur=parseFloat(pb.style.width)||0;if(v>cur)pb.style.width=Math.min(100,v).toFixed(1)+'%';if(pcl)pcl.textContent=Math.round(parseFloat(pb.style.width)||0)+'%';};setPb(6);
  const crp=setInterval(()=>{if(dead||id!==rid){clearInterval(crp);return;}const w=parseFloat(pb.style.width)||0;if(w>0&&w<93)setPb(w+(95-w)*.045+.12);},500);
  let sg='render';
  try{if(!cv){const f=await renderFinal(p,2200);if(!box)cv=f;else{const sx=Math.round(box.x0*f.width),sy=Math.round(box.y0*f.height),cw=Math.max(8,Math.round((box.x1-box.x0)*f.width)),ch=Math.max(8,Math.round((box.y1-box.y0)*f.height)),k=clamp(110/ch,1,3),pd=12;
    const d=f.getContext('2d').getImageData(sx,sy,Math.min(cw,f.width-sx),Math.min(ch,f.height-sy)).data,Y=[];for(let i=0;i<d.length;i+=4)Y.push([d[i]*.3+d[i+1]*.59+d[i+2]*.11,i]);Y.sort((a,b)=>a[0]-b[0]);const nk=Math.max(1,Y.length*.06|0);let r=0,g=0,b=0;for(let i=0;i<nk;i++){r+=d[Y[i][1]];g+=d[Y[i][1]+1];b+=d[Y[i][1]+2];}ink=`rgb(${r/nk|0},${g/nk|0},${b/nk|0})`;
    cv=document.createElement('canvas');cv.width=cw*k+pd*2;cv.height=ch*k+pd*2;const x=cv.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,cv.width,cv.height);x.imageSmoothingQuality='high';x.drawImage(f,sx,sy,cw,ch,pd,pd,cw*k,ch*k);bm={sx:sx,sy:sy,k:k,pd:pd,fw:f.width,fh:f.height};sk=ocrSkew(cv);if(Math.abs(sk)>.012)cv=ocrRot(cv,-sk);else sk=0;}
    const tc=document.createElement('canvas');tc.width=124;tc.height=164;const kk=Math.max(124/cv.width,164/cv.height);tc.getContext('2d').drawImage(cv,(124-cv.width*kk)/2,0,cv.width*kk,cv.height*kk);th.innerHTML='';th.appendChild(tc);}
   sg='worker';let passI=0,passN=1;logCb=x=>{if(id===rid&&!dead&&x.status==='recognizing text'){const base=passI/passN;setPb(Math.round((base+x.progress/passN)*100));t2.textContent=L2('جاري القراءة ','Reading ')+Math.round(x.progress*100)+'%'+(passN>1&&passI>0?' · '+L2('محاولة ','try ')+(passI+1):'');}};
   sg='recognize';
   let best=null;
   if(!deep){try{best=await TXOnnx.tryRun(cv,lang(),pr=>{if(id===rid&&!dead){setPb(Math.round(8+pr*88));t1.textContent=L2('بالمحرك الحديث…','Modern engine…');t2.textContent=Math.round(pr*100)+'%';}},()=>dead||id!==rid,{skew:box?null:ocrSkew,fast:OQ()==='fast'});}catch(e){console.warn('onnx',e);}}
   if(!best)best=await ocrRun(cv,lang(),OQ(),box?'6':'3',!!deep,(i,n)=>{passI=i;passN=Math.max(n,2);stage(i,n);},()=>dead||id!==rid);
   if(!best||dead||id!==rid)return;setPb(100);finish(best,!!deep);}
  catch(e){if(!dead&&id===rid){console.error(e);run.hidden=false;th.classList.add('done');t1.textContent=L2('تعذّر استخراج النص','Could not extract text');{const em=String(e&&e.message||e);t2.textContent=/importScripts|NetworkError|Failed to fetch|failed to load|script blocked|Load failed/i.test(em)?L2('ملفات القراءة ماتحمّلتش. اتأكد من الاتصال وجرّب تاني، ولو استمرت افتح صفحة /check.html وابعت لي النتيجة.','Reading files failed to load. Check your connection and retry; if it persists open /check.html and send me the result.'):sg+': '+em.slice(0,140)+(navigator.onLine?'':' · '+L2('مفيش إنترنت. جهّز الأوفلاين من «المزيد».','Offline. Prepare offline from More.'));}pb.style.width='0';if(pcl)pcl.textContent='0%';}}finally{clearInterval(crp);}};
 const doRep=txt=>{dead=1;m.remove();const bb=sbox||box,na={t:'txtr',id:newId(),x0:bb.x0,y0:bb.y0,x1:bb.x1,y1:bb.y1,txt:txt,c:ink,c0:ink,bg:null,ff:5,sz:1,bl:3,rot:sk};addAnn(na);txtSheet(na);};
 const mEl=$m('#oMenu'),exBtn=re=>[...m.querySelectorAll('.ocx button')].find(b=>re(b.textContent));
 const menuOpen=()=>{const I=OX_SVG,mi=(a,ic,tx,sm)=>'<button type="button" class="ox-mi" data-a="'+a+'">'+ic+'<span>'+tx+'</span>'+(sm?'<small>'+sm+'</small>':'')+'</button>',on=localStorage.getItem('tx_onnx')!=='0';
  let h='';if(!box)h+=mi('live',I.sel,L2('تحديد النص من الصورة','Select text on the image'));
  h+=mi('h',I.redo,L2('قراءة أدق','Deep read'),L2('بتاخد وقت أكتر','Slower'));
  h+='<div class="ox-ms"></div>'+(navigator.share?mi('s',I.share,L2('مشاركة النص','Share text')):'')+mi('d',I.dl,L2('حفظ كملف TXT','Save as TXT'));
  if(exBtn(t=>/^Word$/.test(t)))h+=mi('xw',I.doc,L2('تصدير Word','Export Word'));
  if(exBtn(t=>/CSV/.test(t)&&!/→/.test(t)))h+=mi('xc',I.tbl,L2('تصدير جدول CSV','Export CSV table'));
  if(exBtn(t=>/→/.test(t)))h+=mi('xi',I.tbl,L2('فاتورة → CSV','Invoice → CSV'));
  h+='<div class="ox-ms"></div>'+mi('eng',I.cog,L2('المحرك الحديث','Modern engine'),on?L2('شغّال','On'):L2('متوقف','Off'))+mi('oq',I.cog,L2('جودة القراءة','Reading quality'),OQ()==='best'?L2('دقيقة','Accurate'):L2('سريعة','Fast'));
  mEl.innerHTML=h;mEl.hidden=false;const mr=m.querySelector('.mdl').getBoundingClientRect(),ar2=acts.getBoundingClientRect();mEl.style.bottom=Math.max(8,mr.bottom-ar2.top+8)+'px';};
 m.onclick=async e=>{if(e.target===m){saveMem();dead=1;m.remove();return;}
   {const mm=m.querySelector('.mdl');if(e.target.closest('#oLG')){mm.classList.toggle('lgopen');return;}if(e.target.closest('[data-l],[data-auto]'))mm.classList.remove('lgopen');}
   if(!mEl.hidden&&!e.target.closest('#oMenu,[data-a=o]'))mEl.hidden=true;
  const t=e.target.closest('[data-l],[data-a],[data-auto],[data-more]');if(!t)return;const a=t.dataset.a;
  if(t.dataset.more){const mm=$m('#oM');mm.hidden=!mm.hidden;return;}
  if(t.dataset.auto){sel=['ara','eng'];localStorage.setItem('tx_ol',lang());paint();go();return;}
     if(t.dataset.l){const c=t.dataset.l,isMain=main.some(l=>l.c===c);if(isMain){if(sel.length===1&&sel[0]===c)return;sel=[c];}else{const i=sel.indexOf(c);if(i>=0){if(sel.length>1)sel.splice(i,1);}else sel.push(c);}try{localStorage.setItem('tx_ol',lang());}catch(_){}paint();clearTimeout(m._lt);m._lt=setTimeout(()=>go(),350);return;}
  if(a==='x'){saveMem();dead=1;m.remove();}
  else if(a==='c'){try{await navigator.clipboard.writeText(ta.value);}catch(_){ta.select();document.execCommand('copy');}toast(L2('اتنسخ','Copied'));}
  else if(a==='s'){try{await navigator.share({text:ta.value});}catch(_){}}
     else if(a==='h'){mEl.hidden=true;go(true);}
   else if(a==='o'){if(mEl.hidden)menuOpen();else mEl.hidden=true;}
   else if(a==='t'){mEl.hidden=true;if(!ta.value.trim())return;TXTr.open({text:ta.value,ar:ar,toast:toast,onReplace:box?doRep:null});}
   else if(a==='live'){mEl.hidden=true;dead=1;m.remove();liveText(p);}
   else if(a==='xw'||a==='xc'||a==='xi'){mEl.hidden=true;const b=exBtn(a==='xw'?(t=>/^Word$/.test(t)):a==='xi'?(t=>/→/.test(t)):(t=>/CSV/.test(t)&&!/→/.test(t)));if(b)b.click();}
   else if(a==='eng'){try{localStorage.setItem('tx_onnx',localStorage.getItem('tx_onnx')==='0'?'1':'0');}catch(_){}menuOpen();toast(localStorage.getItem('tx_onnx')==='0'?L2('المحرك الحديث متوقف — هيشتغل الكلاسيك','Modern engine off — using classic'):L2('المحرك الحديث شغّال','Modern engine on'));}
   else if(a==='oq'){try{localStorage.setItem('tx_oq',OQ()==='best'?'fast':'best');}catch(_){}menuOpen();toast(OQ()==='best'?L2('جودة دقيقة','Accurate quality'):L2('جودة سريعة','Fast quality'));}
  else if(a==='d'){const u=URL.createObjectURL(new Blob(['﻿'+ta.value],{type:'text/plain;charset=utf-8'})),q=document.createElement('a');q.href=u;q.download='scan.txt';q.click();setTimeout(()=>URL.revokeObjectURL(u),3000);}
     else if(a==='r'&&ta.value.trim()){doRep(ta.value);}};
 const saveMem=()=>{if(box||!lastBest)return;try{if(TB&&!tbx.hidden){try{TB.rows=tbRows();}catch(_){}}OCRMEM.set(p.id,{lang:lang(),q:OQ(),sig:(p.a&&p.a.length)||0,best:lastBest,deep:lastDeep,cv:cv,ink:ink,sk:sk,bm:bm,text:ta.value,tb:TB?tbSnap():null,tbOn:!tbx.hidden});}catch(e){console.warn('mem',e);}};
 const mem=!box&&OCRMEM.get(p.id);
 if(mem&&mem.lang===lang()&&mem.q===OQ()&&mem.sig===((p.a&&p.a.length)||0)){try{cv=mem.cv;ink=mem.ink;sk=mem.sk;bm=mem.bm;finish(mem.best,mem.deep);ta.value=mem.text;if(TB&&mem.tb){Object.assign(TB,JSON.parse(mem.tb));tbDraw();}tbView(mem.tbOn&&TB?'tb':'t');}catch(e){console.warn('restore',e);OCRMEM.delete(p.id);go();}}
 else go();}
/* ---- small, deliberate suggestion: appears only when the opened page looks like it has text ---- */
const oHintOn=()=>{try{return localStorage.getItem('tx_ohint')!=='0';}catch(e){return true;}};
const oHinted=new Set();
function textLikely(cv){try{const W=300,H=Math.max(40,Math.round(cv.height*W/cv.width)),c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(cv,0,0,W,H);
 const d=x.getImageData(0,0,W,H).data,g=new Float32Array(W*H);for(let i=0;i<W*H;i++)g[i]=.299*d[i*4]+.587*d[i*4+1]+.114*d[i*4+2];
 const row=new Float32Array(H);let tot=0;for(let y=1;y<H-1;y++){let n=0;for(let xx=2;xx<W-2;xx++){const i=y*W+xx,gx=Math.abs(g[i+1]-g[i-1]);if(gx>34)n++;}row[y]=n/W;tot+=row[y];}
 const avg=tot/H;if(avg<.012||avg>.32)return false;let bands=0,on=false,dens=0;const th=avg*.8;for(let y=2;y<H-2;y++){const v=(row[y-1]+row[y]+row[y+1])/3;if(v>th&&!on){on=true;bands++;}else if(v<=th*.6)on=false;if(v>th)dens++;}
 const fr=dens/H;return bands>=5&&fr>.2&&fr<.85;}catch(e){return false;}}
function ocrHintMaybe(p){try{if(!oHintOn()||!p||oHinted.has(p.id)||!E.page||E.page.id!==p.id)return;
 const idx=(typeof OI==='function'&&OI()[p.id])||'';const cb=document.getElementById('cvBase');if(!cb||!cb.width)return;
 if(!(idx.length>=25||textLikely(cb)))return;oHinted.add(p.id);setTimeout(()=>{try{if(!window.__w59){window.__w59=1;let lg=(localStorage.getItem('tx_ol')||'ara+eng').split('+').filter(x=>OCR_LANGS.some(l=>l.c===x));const c=navigator.connection;if(!(c&&(c.saveData||/2g/.test(c.effectiveType))))getW((lg.length?lg:['ara','eng']).join('+'),OQ()).catch(()=>{window.__w59=0;});}}catch(_){}},900);
 const st=document.getElementById('editStage');if(!st)return;const old=document.getElementById('oHint');if(old)old.remove();
 const b=document.createElement('button');b.id='oHint';b.type='button';b.setAttribute('aria-label',AR()?'اقتراح: استخراج النص من الصورة':'Suggestion: extract text from the image');b.innerHTML=OX_SVG.scan+'<span>'+(AR()?'فيها نص؟':'Has text?')+'</span>';document.body.appendChild(b);const place=()=>{const r=st.getBoundingClientRect();b.style.top=(r.top+10)+'px';if(AR()){b.style.left=(r.left+10)+'px';b.style.right='auto';}else{b.style.right=(innerWidth-r.right+10)+'px';b.style.left='auto';}};place();
 const born=Date.now();let sx=0,sy=0,mv=0,down=0,opened=0;const openIt=()=>{if(opened)return;opened=1;kill();try{liveText(p);}catch(e){try{ocrModal(p,null);}catch(_){}}};const kill=()=>{try{document.removeEventListener('pointerdown',pd,true);document.removeEventListener('pointerup',pu,true);}catch(_){}clearTimeout(t1);clearTimeout(t2);clearInterval(iv);b.classList.remove('in');setTimeout(()=>b.remove(),380);};
 requestAnimationFrame(()=>b.classList.add('in'));const t1=setTimeout(()=>b.classList.add('min'),6500),t2=setTimeout(kill,16000);
 const iv=setInterval(()=>{if(!b.isConnected||V.cur!=='vEdit'||!E.page||E.page.id!==p.id){kill();}else place();},500);
 const hit=e=>{const r=b.getBoundingClientRect();return e.clientX>=r.left-8&&e.clientX<=r.right+8&&e.clientY>=r.top-8&&e.clientY<=r.bottom+8;};let dn=null;
 const pd=e=>{dn=hit(e)?{x:e.clientX,y:e.clientY,t:Date.now()}:null;},pu=e=>{if(dn&&hit(e)&&Math.hypot(e.clientX-dn.x,e.clientY-dn.y)<14&&Date.now()-dn.t<900){e.stopPropagation();openIt();}dn=null;};
 document.addEventListener('pointerdown',pd,true);document.addEventListener('pointerup',pu,true);
 b.addEventListener('pointerdown',e=>{e.stopPropagation();sx=e.clientX;sy=e.clientY;mv=0;down=1;});
 b.addEventListener('pointermove',e=>{if(down&&Math.hypot(e.clientX-sx,e.clientY-sy)>14)mv=1;e.stopPropagation();});
 b.addEventListener('pointerup',e=>{e.stopPropagation();if(!down)return;down=0;const dx=e.clientX-sx,dy=e.clientY-sy;if(Math.hypot(dx,dy)>24){kill();return;}
  if(mv)return;openIt();});
 b.addEventListener('pointercancel',()=>{down=0;});b.addEventListener('touchend',e=>{e.stopPropagation();e.preventDefault();openIt();},{passive:false});b.addEventListener('click',e=>{e.stopPropagation();e.preventDefault();if(!mv)openIt();});
 const ov=document.getElementById('ov');if(ov)ov.addEventListener('pointerdown',()=>{if(b.isConnected)b.classList.add('min');},{once:true});
}catch(e){console.warn('ocrHint',e);}}
{const _oe=openEdit;openEdit=async function(p){const r=await _oe.apply(this,arguments);setTimeout(()=>ocrHintMaybe(p),1100);return r;};}

/* ===== v21: background OCR indexing (phase 1.1) ===== */
const BGK='tx_bgocr';const bgOn=()=>{try{return localStorage.getItem(BGK)!=='0'}catch(e){return true}};
const bgTried=new Set();let bgBusy=0,bgAgain=0;
async function bgOcr(){
 if(bgBusy){bgAgain=1;return;}
 if(!bgOn()||!navigator.onLine||document.hidden&&0)return;
 bgBusy=1;bgPill(1);
 try{do{bgAgain=0;
  for(const p of (state.pages||[]).slice()){
   if(!bgOn())break;
    if(!p||!p.id||bgTried.has(p.id)||OI()[p.id]!==undefined)continue;
   bgTried.add(p.id);
   try{
    const cv=await renderFinal(p,1600);if(!cv)continue;
    const wk=await getW('ara+eng');await wk.setParameters({tessedit_pageseg_mode:'3'});
    const r=await wk.recognize(cv);const Ls=r.data.lines;let T=(r.data.text||'').trim();
    if(Ls&&Ls.length)T=Ls.map(l=>(l.words||[]).filter(w=>w.confidence>=50).map(w=>w.text).join(' ').trim()).filter(Boolean).join('\n');
    if(T)ocrIdx(p,T,null);
   }catch(e){console.warn('bgOcr',e);}
   await new Promise(r=>setTimeout(r,400));
  }
 }while(bgAgain&&bgOn());}finally{bgBusy=0;bgPill(0);}
}
function bgPill(on){let b=document.getElementById('bgPill');
 if(!on){if(b){b.hidden=true;b._shown=0;clearTimeout(b._t);}return;}
 if(b&&b._shown)return; /* v141: بيظهر مرة واحدة في بداية الفهرسة ويختفي لوحده بدل ما يفضل ظاهر طول المدة */
 if(!b){b=document.createElement('div');b.id='bgPill';b.setAttribute('role','status');
  b.style.cssText='position:fixed;inset-inline:12px;bottom:calc(env(safe-area-inset-bottom,0px) + 92px);margin:0 auto;width:fit-content;max-width:calc(100% - 24px);z-index:60;display:flex;align-items:center;gap:6px;padding:4px 6px 4px 14px;border-radius:999px;background:rgba(5,12,38,.9);color:#fff;font:700 13px/1.4 system-ui,sans-serif;box-shadow:0 6px 20px rgba(0,0,0,.3)';
  b.innerHTML='<span></span><button type="button" style="min-width:44px;min-height:44px;padding:0 12px;border-radius:22px;color:#22d3f5;font-weight:800"></button>';
  b.lastChild.onclick=()=>{try{localStorage.setItem(BGK,'0')}catch(e){}b.hidden=true;toast(Lg('اتوقفت الفهرسة التلقائية. تقدر تشغّلها من الإعدادات','Auto-index stopped. Re-enable it from Settings'));};
  document.body.appendChild(b);}
 b.firstChild.textContent=Lg('جاري فهرسة النص…','Indexing text…');b.lastChild.textContent=Lg('إيقاف','Stop');b.hidden=false;b._shown=1;clearTimeout(b._t);b._t=setTimeout(()=>{b.hidden=true;},3200);}
{const _snap=snapDoc;snapDoc=async function(){const r=await _snap.apply(this,arguments);setTimeout(bgOcr,1500);return r;};}
setTimeout(bgOcr,6000);

window.__ord={pages:()=>state.pages,home:()=>renderHome(),run:()=>ordPages()}; /* خطاف للاختبار بس (tools/order-ui-test.js) */
/* ===== 3.5ب: ترتيب الصفحات بالأرقام. بيستخدم فهرس النص الموجود (OI) ويقرا بس الصفحات اللي لسه ما اتفهرستش؛ بيطبّق بس لو كل الصفحات مرقّمة وبدون تكرار، وفيه تراجع ===== */
let ordBusy=0;
function ordBtnSync(n){let b=document.getElementById('ordBtn');
  if(n<2||!window.TXA||!TXA.pageNum){if(b)b.hidden=true;return;}
  if(!b){b=document.createElement('button');b.id='ordBtn';b.type='button';b.className='btn sm';b.onclick=ordPages;document.getElementById('count').insertAdjacentElement('afterend',b);}
  b.hidden=false;if(!ordBusy)b.textContent=Lg('رتّب بالأرقام','Sort by page numbers');}
async function ordPages(){
  if(ordBusy||!window.TXA)return;const b=document.getElementById('ordBtn'),pages=state.pages.slice();if(pages.length<2)return;
  ordBusy=1;if(b)b.disabled=true;
  try{
    const todo=pages.filter(p=>OI()[p.id]===undefined);let k=0;
    for(const p of todo){
      if(b)b.textContent=Lg('قراءة '+(++k)+'/'+todo.length+'…','Reading '+k+'/'+todo.length+'…');
      bgTried.add(p.id);
      const cv=await renderFinal(p,1600);if(!cv)continue;
      const wk=await getW('ara+eng');await wk.setParameters({tessedit_pageseg_mode:'3'});
      const r=await wk.recognize(cv);const Ls=r.data.lines;let T=(r.data.text||'').trim();
      if(Ls&&Ls.length)T=Ls.map(l=>(l.words||[]).filter(w=>w.confidence>=50).map(w=>w.text).join(' ').trim()).filter(Boolean).join('\n');
      if(T)ocrIdx(p,T,null);
    }
    const o=OI(),res=TXA.orderPlan(pages.map(p=>TXA.pageNum(o[p.id])));
    if(!res.ok){
      toast(res.reason==='missing'?Lg('مش لاقي رقم صفحة في: '+res.idx.map(i=>i+1).join('، ')+' — رتّب يدويًا','No page number found on: '+res.idx.map(i=>i+1).join(', ')+' — sort manually'):
            res.reason==='dup'?Lg('في رقمين متكررين — ما رتّبتش','Duplicate numbers — not sorted'):Lg('إجمالي الصفحات مش متطابق — ما رتّبتش','Page totals disagree — not sorted'));
      return;}
    if(res.sorted){toast(Lg('الصفحات مترتبة بالأرقام بالفعل','Already in page-number order'));return;}
    const prev=pages.slice();state.pages.splice(0,state.pages.length,...res.order.map(i=>pages[i]));persistMeta();renderHome();
    toast(Lg('اترتبت بالأرقام','Sorted by page numbers'));
    const u=document.createElement('div');u.className='txhint';u.innerHTML='<span></span><button type="button" style="min-height:44px;padding:0 14px;font-weight:800"></button>';u.firstChild.textContent=Lg('اترتبت بالأرقام','Sorted by page numbers');u.lastChild.textContent=Lg('تراجع','Undo');
    const sh=document.getElementById('shelf');if(sh)sh.insertAdjacentElement('beforebegin',u);
    const gone=()=>{try{u.remove()}catch(e){}};setTimeout(gone,10000);
    u.lastChild.onclick=()=>{const cur=state.pages.slice(),back=prev.filter(x=>cur.includes(x));state.pages.splice(0,state.pages.length,...back);persistMeta();renderHome();gone();};
  }catch(e){console.warn('ordPages',e);toast(Lg('ما قدرتش أقرا الصفحات: ','Could not read pages: ')+(e&&e.message||e));}
  finally{ordBusy=0;if(b){b.disabled=false;b.textContent=Lg('رتّب بالأرقام','Sort by page numbers');}}
}
/* ===== v22: tags (work as folders) + automatic category / name ===== */
var libTag='';
function getTags(){return state.tagsFor===state.id&&Array.isArray(state.tags)?state.tags:[];}
function setTags(a){state.tags=[...new Set((a||[]).map(x=>String(x).trim()).filter(Boolean))].slice(0,6);state.tagsFor=state.id;}
function tagOk(r){return !libTag||(r.tags||[]).includes(libTag);}
async function libChips(){let row=document.getElementById('libTagRow');const list=document.getElementById('libList');if(!list)return;
 if(libMode==='trash'){if(row)row.remove();return;}
 const set=new Set(getTags());try{(await allSaved()).filter(r=>!r.trashed).forEach(r=>(r.tags||[]).forEach(x=>set.add(x)));}catch(e){}
 if(libTag&&!set.has(libTag))libTag='';
 if(!set.size){if(row)row.remove();return;}
 if(!row){row=document.createElement('div');row.id='libTagRow';row.style.cssText='display:flex;flex-wrap:wrap;gap:6px;margin:6px 0 8px';list.parentNode.insertBefore(row,list);}
 row.innerHTML='';const chip=(label,val)=>{const b=document.createElement('button');b.type='button';b.textContent=label;const on=libTag===val;
  b.style.cssText='padding:5px 12px;border-radius:999px;font-size:13px;font-weight:700;border:1.5px solid '+(on?'#22d3f5':'#8886')+';background:'+(on?'rgba(34,211,245,.16)':'transparent')+';color:inherit';
  b.onclick=()=>{libTag=val;renderLib();};row.appendChild(b);};
 chip(Lg('الكل','All'),'');[...set].sort().forEach(x=>chip('#'+x,x));}
const CATS=[['هوية','ID',/الرقم القومي|national id|passport|جواز سفر|رخصة قيادة|driving licen[cs]e/i],
 ['فاتورة','Invoice',/فاتورة|invoice|إيصال|ايصال|receipt|الإجمالي|الاجمالي|total due/i],
 ['بنك','Bank',/كشف حساب|bank statement|\biban\b|رقم الحساب/i],
 ['عقد','Contract',/\bعقد\b|contract|agreement|الطرف الأول|الطرف الاول/i],
 ['طبي','Medical',/روشتة|prescription|تحليل|مستشفى|hospital|clinic|عيادة/i],
 ['شهادة','Certificate',/شهادة|certificate|diploma|دبلوم/i]];
function autoClass(){try{if(!state.pages.length)return;const o=OI();let T=state.pages.map(p=>o[p.id]||'').join('\n');if(T.length<12)return;
 T=T.replace(/[٠-٩]/g,c=>'٠١٢٣٤٥٦٧٨٩'.indexOf(c));
 const hit=CATS.find(c=>c[2].test(T));if(!hit)return;const cat=Lg(hit[0],hit[1]);
 if(!getTags().length){setTags([cat]);try{persistMeta();}catch(e){}}
 const def=!state.name||/^(Scan|مستند) \d\d-\d\d$/.test(state.name);
 if(def){const pd=n=>String(n).padStart(2,'0');let d='',m=T.match(/\b(20\d{2})[-\/.](0?[1-9]|1[0-2])[-\/.](0?[1-9]|[12]\d|3[01])\b/);
  if(m)d=m[1]+'-'+pd(m[2])+'-'+pd(m[3]);else{m=T.match(/\b(0?[1-9]|[12]\d|3[01])[-\/.](0?[1-9]|1[0-2])[-\/.](20\d{2})\b/);if(m)d=m[3]+'-'+pd(m[2])+'-'+pd(m[1]);}
  const nm=cat+' - '+(d||defName().replace(/^\D+/,''));state.name=nm;const di=document.getElementById('docName');if(di)di.value=nm;try{persistMeta();}catch(e){}toast(Lg('اسم المستند: ','Name: ')+nm);}
}catch(e){console.warn('autoClass',e);}}
{const _oi=ocrIdx;ocrIdx=function(){const r=_oi.apply(this,arguments);setTimeout(autoClass,400);return r;};}
/* images shared from other apps (Web Share Target) */
setTimeout(async()=>{try{if(!/[?&]shared=1/.test(location.search))return;history.replaceState(null,'',location.pathname);const c=await caches.open('timaxo-share'),ks=await c.keys(),fs=[];
 for(const k of ks){const rs=await c.match(k);if(rs){const b=await rs.blob();fs.push(new File([b],'shared-'+fs.length+'.jpg',{type:b.type||'image/jpeg'}));}await c.delete(k);}
 if(!fs.length)return;state.queue=fs.slice(1);ingest(fs[0]);}catch(e){console.warn('share',e);}},1300);
/* expiry date -> calendar reminder (.ics, 30 days before) */
function expiryOf(r){try{const o=OI();let T=(r.order||[]).map(id=>o[id]||'').join('\n');if(!T)return '';T=T.replace(/[٠-٩]/g,c=>'٠١٢٣٤٥٦٧٨٩'.indexOf(c));
 const k=/(انتهاء|ينتهي|تنتهي|صالح(?:ة)? حتى|صالحة لغاية|expiry|expires?|valid (?:until|thru|through)|exp\.?)/ig;let m;const pd=n=>String(n).padStart(2,'0');
 while((m=k.exec(T))){const seg=T.slice(m.index,m.index+m[0].length+45);let d=seg.match(/(20\d{2})[-\/.](\d{1,2})[-\/.](\d{1,2})/);if(d)return d[1]+'-'+pd(d[2])+'-'+pd(d[3]);
  d=seg.match(/(\d{1,2})[-\/.](\d{1,2})[-\/.](20\d{2})/);if(d)return d[3]+'-'+pd(d[2])+'-'+pd(d[1]);
  d=seg.match(/(\d{1,2})[-\/.](20\d{2})/);if(d&&+d[1]>=1&&+d[1]<=12){const last=new Date(Date.UTC(+d[2],+d[1],0)).getUTCDate();return d[2]+'-'+pd(d[1])+'-'+pd(last);}}
 }catch(e){}return '';}
function expiryIcs(r,ex){const e=new Date(ex+'T00:00:00Z'),rm=new Date(e.getTime()-30*864e5),at=rm>new Date()?rm:new Date(Date.now()+864e5),f=d=>d.toISOString().slice(0,10).replace(/-/g,''),nx=new Date(at.getTime()+864e5);
 const nm=(r.name||'Timaxo').replace(/[\r\n,;]/g,' '),msg=Lg('ينتهي في ','Expires on ')+ex;
 const ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Timaxo Scan//AR','BEGIN:VEVENT','UID:tx-'+r.id+'-'+ex+'@timaxo','DTSTAMP:'+new Date().toISOString().replace(/[-:]/g,'').slice(0,15)+'Z','DTSTART;VALUE=DATE:'+f(at),'DTEND;VALUE=DATE:'+f(nx),'SUMMARY:'+nm+' - '+msg,'DESCRIPTION:'+msg,'BEGIN:VALARM','ACTION:DISPLAY','DESCRIPTION:'+nm+' - '+msg,'TRIGGER:PT9H','END:VALARM','END:VEVENT','END:VCALENDAR'].join('\r\n');
 dl('reminder-'+ex+'.ics','text/calendar',ics);toast(Lg('افتح الملف عشان يتضاف لتقويمك','Open the file to add it to your calendar'));}
/* ===== v8: grouped tools, theme toggle ===== */
function buildTools(){buildTools0();try{regroup();}catch(e){console.error(e);}try{window.TXOrd&&TXOrd.mark();}catch(e){}}
let tcat=-1;
function regroup(){const row=$('#toolRow'),ar=lang==='ar',M={};$$('.tool',row).forEach(b=>M[b.dataset.k]=b);
 const er=E.sub==='erase',GR=er?[[ar?'مسح':'Erase',['classo','cbrush','cbox','erase']]]:[[ar?'تعديل':'Edit',['ocrbox','text','pen','hl','hand','note','arrow','box','check','cross','redact','sign']]];
 if(window.TXOrd)GR[0][1]=TXOrd.sort(er?'erase':'edit',GR[0][1]); /* v144: ترتيب حسب استخدام المستخدم أو ترتيبه اليدوي */
 tcat=0; /* v143: مجموعة واحدة لكل تبويب مرتّبة بأولوية الاستخدام، وبتتعرض كشريط أفقي بسلايدر */
 row.innerHTML='';const bar=document.createElement('div'),rw=document.createElement('div');bar.className='tcats';rw.className='tgr';bar.hidden=true;row.append(bar,rw);
 GR.forEach((g,gi)=>{const c=document.createElement('button');c.className='tcat';c.textContent=g[0];c.onclick=()=>show(gi);bar.append(c);g[1].forEach(k=>{const b=M[k];if(!b)return;if(!b.querySelector('span')){const sp=document.createElement('span');sp.textContent=t(k);b.appendChild(sp);}if(k==='ocrbox'||k==='classo')b.classList.add('key');rw.append(b);});});
 const show=gi=>{tcat=gi;$$('.tcat',bar).forEach((c,i)=>c.classList.toggle('on',i===gi));GR.forEach((g,i)=>g[1].forEach((k,n)=>{const b=M[k];if(b){b.style.display=i===gi?'':'none';b.style.setProperty('--i',n);}}));rw.scrollLeft=0;};show(tcat);}
(function(){const R=document.documentElement,K='tx_theme3',ORD=['light','blue','dark'],G={light:'☀',blue:'✦',dark:'☾'};let m=R.getAttribute('data-theme')||'blue';
 const ui=()=>{$$('.sw3').forEach(w=>{w.style.setProperty('--k',ORD.indexOf(m));$$('button',w).forEach(b=>b.classList.toggle('on',b.dataset.m===m));});$$('.ut.th').forEach(b=>b.textContent=G[m]);};
 const set=(nm,ev)=>{if(nm===m)return;const x=ev?ev.clientX:innerWidth/2,y=ev?ev.clientY:0,r=Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y)),ap=()=>{m=nm;R.setAttribute('data-theme',m);try{localStorage.setItem(K,m);}catch(_){}ui();};
  if(document.startViewTransition&&!matchMedia('(prefers-reduced-motion:reduce)').matches){try{const vt=document.startViewTransition(ap);vt.ready.then(()=>R.animate({opacity:[0,1]},{duration:260,easing:'ease-out',pseudoElement:'::view-transition-new(root)'})).catch(()=>{});return;}catch(_){}}
  R.classList.add('tx-anim');ap();setTimeout(()=>R.classList.remove('tx-anim'),320);};window.__txSetTheme=set;
 $$('header.top').forEach((h,i)=>{const w=document.createElement('div');w.className='utils';
  if(i===0){const sw=document.createElement('div');sw.className='sw3';sw.innerHTML='<i></i>'+ORD.map(o=>'<button data-m="'+o+'" aria-label="'+o+'"><span>'+G[o]+'</span></button>').join('');{let dg=0,sx=0;const idx=e=>{const r=sw.getBoundingClientRect(),W=(r.width-4)/3;return{k:Math.max(0,Math.min(2,(e.clientX-r.left-2-W/2)/W)),i:Math.max(0,Math.min(2,Math.floor((e.clientX-r.left-2)/W)))};};
  sw.addEventListener('pointerdown',e=>{dg=1;sx=e.clientX;sw.setPointerCapture(e.pointerId);sw.classList.add('drag');sw.style.setProperty('--k',idx(e).k);});
  sw.addEventListener('pointermove',e=>{if(dg)sw.style.setProperty('--k',idx(e).k);});
  const up=e=>{if(!dg)return;dg=0;sw.classList.remove('drag');const nm=ORD[idx(e).i];if(nm===m)ui();else set(nm,e);};
  sw.addEventListener('pointerup',up);sw.addEventListener('pointercancel',()=>{dg=0;sw.classList.remove('drag');ui();});}w.append(sw);
   const lk=document.querySelector('button[aria-label=PIN]');if(lk){lk.style.cssText='';lk.className='ut';w.append(lk);}}
  else{const b=document.createElement('button');b.className='ut th';b.setAttribute('aria-label','theme');b.onclick=e=>set(ORD[(ORD.indexOf(m)+1)%3],e);w.append(b);}
  h.append(w);});ui();})();
buildTools();window.__E=E;window.__buildTools=buildTools;

/* ===== v9: collapsible bottom dock ===== */
(function(){const mk=$('#pMarkup'),par=mk.parentElement,items=[...par.children].filter(c=>c.classList.contains('panel')||c.id==='tabs');
 const dk=document.createElement('div');dk.className='edk';par.insertBefore(dk,items[0]);const g=document.createElement('button');g.className='grab';g.setAttribute('aria-label','panel');dk.append(g);items.forEach(x=>dk.append(x));
 g.onclick=()=>dk.classList.toggle('mini');
 $('#tabs').addEventListener('click',e=>{const b=e.target.closest('.tab');if(!b)return;if(b.classList.contains('on'))dk.classList.toggle('mini');else dk.classList.remove('mini');},true);})();

/* ===== v11: tool name on dock handle, auto-minimize after picking a tool ===== */
(function(){const dk=document.querySelector('.edk'),g=dk.querySelector('.grab');const nm=k=>{g.dataset.n=t(k);};nm(E.tool);
 $('#tabs').addEventListener('click',e=>{const b=e.target.closest('.tab');if(b&&(b.dataset.tab==='pMarkup'||b.dataset.tab==='pErase')&&!b.classList.contains('on')){const er=b.dataset.tab==='pErase';E.sub=er?'erase':'edit';E.tool=er?'classo':'hand';tcat=0;buildTools();nm(E.tool);}},true);
 $('#toolRow').addEventListener('click',e=>{const b=e.target.closest('.tool');if(!b)return;nm(b.dataset.k);if(b.dataset.k!=='sign')setTimeout(()=>dk.classList.add('mini'),300);});})();

/* ===== v20.1: features moved inside the app scope ===== */
(function(){
const A=()=>{try{return AR()}catch(e){return true}},L=(a,b)=>A()?a:b;
/* ---- update banner ---- */
if('serviceWorker' in navigator){const show=w=>{const f=()=>window.TXU?TXU.offer(null,w):setTimeout(f,400);f();};
 navigator.serviceWorker.ready.then(reg=>{if(reg.waiting&&navigator.serviceWorker.controller)show(reg.waiting);
  reg.addEventListener('updatefound',()=>{const w=reg.installing;if(!w)return;w.addEventListener('statechange',()=>{if(w.state==='installed'&&navigator.serviceWorker.controller)show(w)})});
  const up=()=>reg.update().catch(()=>{});setInterval(up,30*60*1000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)up()});up();}).catch(()=>{});}
/* ---- OCR extras: auto-name + Word/CSV/TXT ---- */
const dl=(name,mime,txt)=>{const u=URL.createObjectURL(new Blob([txt],{type:mime}));const a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),4000);};
const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
window.ocrExtras=function(ta,p,T,box){
 if(!box&&state.pages[0]&&state.pages[0].id===p.id&&(!state.name||/^(Scan|مستند) \d\d-\d\d$/.test(state.name))){
  const ln=(T.split('\n').map(x=>x.replace(/[^\p{L}\p{N} \-_.]/gu,' ').replace(/\s+/g,' ').trim()).find(x=>x.length>=3)||'').slice(0,36).trim();
  if(ln){state.name=ln;const d=document.getElementById('docName');if(d)d.value=ln;try{persistMeta()}catch(e){}toast(L('اسم المستند: ','Name: ')+ln);}}
 if(ta._x)return;ta._x=1;const bar=document.createElement('div');bar.className='ocx';
 const nm=()=>(state.name||'Timaxo').replace(/[\\/:*?"<>|]/g,'_');
 const mk=(t,f)=>{const b=document.createElement('button');b.className='btn sm';b.textContent=t;b.onclick=f;bar.appendChild(b)};
 mk('Word',()=>dl(nm()+'.doc','application/msword','\ufeff<html xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"></head><body dir="'+(A()?'rtl':'ltr')+'">'+ta.value.split('\n').map(l=>'<p>'+esc(l)+'</p>').join('')+'</body></html>'));
 mk(L('جدول CSV','CSV table'),()=>dl(nm()+'.csv','text/csv;charset=utf-8','\ufeff'+ta.value.split('\n').filter(l=>l.trim()).map(l=>l.split(/\t| {2,}| \| /).map(c=>'"'+c.trim().replace(/"/g,'""')+'"').join(',')).join('\r\n')));
 mk('TXT',()=>dl(nm()+'.txt','text/plain;charset=utf-8','\ufeff'+ta.value));
 ta.insertAdjacentElement('afterend',bar);};
/* ---- QR / barcode reader ---- */
const fab=document.createElement('button');fab.id='qrFab';fab.setAttribute('aria-label','QR');
fab.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8V5a2 2 0 0 1 2-2h3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3"/><path d="M7 12h10"/></svg>';
document.body.appendChild(fab);
const hv=document.getElementById('vHome');if(hv){const sync=()=>fab.classList.toggle('on',hv.classList.contains('on'));new MutationObserver(sync).observe(hv,{attributes:true,attributeFilter:['class']});sync();}
fab.onclick=async()=>{
 if(!('BarcodeDetector' in window)||!(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia)){toast(L('المتصفح ده مش بيدعم قراءة QR','QR scanning is not supported here'));return;}
 let st;const gum=c=>navigator.mediaDevices.getUserMedia({video:c,audio:false}),env={facingMode:{ideal:'environment'}};try{st=await gum(env);}catch(e){toast(L('الكاميرا غير متاحة','Camera unavailable'));return;}
 /* 0.3: same main-lens choice as the document camera (skip ultra-wide/tele/macro/IR; honour a saved lens) */
 try{const cur=st.getVideoTracks()[0].getSettings().deviceId,saved=localStorage.getItem('tx_lens'),sc=d=>(/ultra|wide|0\.5|tele|macro|depth|zoom|infrared|\bir\b/i.test(d.label)?10:0)+(/back camera|camera2? 0\b/i.test(d.label)?-5:0),
  ds=(await navigator.mediaDevices.enumerateDevices()).filter(d=>d.kind==='videoinput'&&!/front|user|selfie/i.test(d.label));ds.sort((x,y)=>sc(x)-sc(y)||x.label.localeCompare(y.label));
  const pick=(saved&&ds.find(d=>d.deviceId===saved))||ds[0],cd=ds.find(d=>d.deviceId===cur);
  if(pick&&pick.deviceId!==cur&&((saved&&pick.deviceId===saved)||!cd||sc(cd)>sc(pick))){st.getTracks().forEach(t=>t.stop());try{st=await gum({deviceId:{exact:pick.deviceId}});}catch(e){st=await gum(env);}}}catch(e){}
 const ov=document.createElement('div');ov.id='qrOv';ov.innerHTML='<video playsinline muted autoplay poster="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" disablepictureinpicture></video><div class="qf"></div><button class="qx">✕</button>';document.body.appendChild(ov);
 const v=ov.querySelector('video');v.srcObject=st;const det=new BarcodeDetector();let shown=0,res=null;
 const close=()=>{clearInterval(tm);st.getTracks().forEach(t=>t.stop());ov.remove();};
 ov.querySelector('.qx').onclick=close;
 const tm=setInterval(()=>{if(shown||!v.videoWidth)return;det.detect(v).then(r=>{if(!r.length||shown)return;shown=1;const t=r[0].rawValue||'';res=document.createElement('div');res.className='qres';
  const pp=document.createElement('p');pp.textContent=t;res.appendChild(pp);const row=document.createElement('div');
  const b=(x,f)=>{const e=document.createElement('button');e.className='btn sm';e.textContent=x;e.onclick=f;row.appendChild(e)};
  if(/^https?:\/\//i.test(t))b(L('فتح','Open'),()=>window.open(t,'_blank','noopener'));
  b(L('نسخ','Copy'),()=>{navigator.clipboard&&navigator.clipboard.writeText(t).then(()=>toast(L('اتنسخ','Copied')))});
  b(L('مسح تاني','Scan again'),()=>{res.remove();shown=0});res.appendChild(row);ov.appendChild(res);}).catch(()=>{});},250);};
/* ---- home-screen shortcuts ---- */
const q=new URLSearchParams(location.search).get('s');if(q){setTimeout(()=>{const e=document.getElementById(q==='lib'?'libBtn':'scanBtn');if(e)e.click()},900);}
})();
/* ===== v19.2: system Back = in-app back (one history entry per open layer) ===== */
(function(){
const A=()=>{try{return AR()}catch(e){return true}};
const q=x=>document.querySelector(x);
let pushed=0,syncing=0,sT=0,raf=0,act=0,shT=0;
const vcur=()=>{try{return V.cur}catch(e){return'vHome'}};
const bodyDiv=z=>[...document.body.children].find(e=>e.tagName==='DIV'&&e.style.zIndex===z);
function layers(){let n=0;
 n+=document.querySelectorAll('#mrBg.in,#nwBg,.mdl-bd,.txls').length; /* قائمة المزيد + نوافذ منبثقة: الرجوع يقفلها بدل ما يخرّج التطبيق */
 if(q('#qrOv'))n++;
 if(bodyDiv('9500'))n++;
 if(bodyDiv('9000'))n++;
 if(q('#textBar:not([hidden])'))n++;
 if(q('#scrim.on'))n++;
 if(vcur()!=='vHome')n++;
 if(window.__txCamWait&&Date.now()<window.__txCamWait&&!q('#lv'))n++; /* v159: الكاميرا لسه بتفتح بعد الرجوع من تحديد الحواف */
 if(vcur()==='vHome'&&window.__txLayer&&window.__txLayer())n++;
 return n;}
function back(){
 {const ms=[...document.querySelectorAll('#mrBg.in,#nwBg,.mdl-bd,.txls')];if(ms.length){const top=document.querySelector('.txls')||document.querySelector('#mrBg.in')||ms[ms.length-1];top.click();return true}}
 let e=q('#qrOv .qx');if(e){e.click();return true}
 e=bodyDiv('9500');if(e){const o=e.querySelector('.opw.on,.hqw.on');if(o){o.classList.remove('on');return true}const b=e.querySelector('[data-a=x]');if(b){b.click();return true}}
 e=bodyDiv('9000');if(e){const b=e.querySelector('[data-a=x],[data-a=close]');if(b)b.click();else e.remove();return true}
 e=q('#textBar:not([hidden]) #textCancel');if(e){e.click();return true}
 if(q('#scrim.on')){q('#scrim').click();document.querySelectorAll('.sheet.on').forEach(x=>{try{if(!X.busy)x.classList.remove('on')}catch(_){x.classList.remove('on')}});return true}
 const c=vcur();
 if(c==='vEdit'){e=q('#editBack');if(e){e.click();return true}}
 if(c==='vCrop'){e=q('#cropBack');if(e){e.click();return true}}
 if(c==='vHome'&&window.__txLayer&&window.__txLayer()){q('#docsBack').click();return true}
 return false;}
let lastPush=0;
/* v119: Chrome بيتخطّى (skip) أي entry اتضافت من غير لمسة جديدة، وده كان بيخلّي السحب للرجوع من شاشة الحواف يقفل التطبيق.
  فبنضيف entry واحدة بس مع كل لمسة (مش كذا entry مرة واحدة)، وبنحتفظ بـentry احتياطية (spare) فوق الـlayers. */
function sync(g){
 const want=4+layers();
 if(pushed<want){if(!g||!act||Date.now()<exitUntil)return;const nw=Date.now();if(nw-lastPush<350)return;try{history.pushState({tx:pushed+1},'');pushed++;lastPush=nw}catch(e){}}
 else if(pushed>want&&!syncing){if(!shT)shT=setTimeout(()=>{shT=0;const w=4+layers();if(pushed>w&&!syncing){const n=pushed-w;syncing=1;clearTimeout(sT);sT=setTimeout(()=>{syncing=0},900);pushed=w;try{history.go(-n)}catch(e){}}},800);}}
/* a real tap/key is required before Chrome treats pushed entries as back-able */
['touchend','pointerup','click','keydown'].forEach(t=>addEventListener(t,()=>{act=1;sync(1)},{capture:true,passive:true}));
new MutationObserver(()=>{if(raf)return;raf=requestAnimationFrame(()=>{raf=0;sync()})}).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','hidden']});
let lastBk=0,exitUntil=0;
addEventListener('popstate',()=>{
 if(syncing){syncing=0;return}
 pushed=Math.max(0,pushed-1);
 const nw=Date.now();
 /* v159: الرجوع جوه طبقات التطبيق (تعديل ← حواف ← كاميرا ← رئيسية) عمره ما يتحسب خروج، حتى لو اتسحب بسرعة.
    وقت ما الكاميرا بتفتح تاني بعد الرجوع من الحواف مفيش طبقة ظاهرة لحظيًا، فنتجاهل الرجعة بدل ما تتحسب خروج. */
 if(layers()>0){lastBk=0;if(pushed<1){try{history.pushState({tx:'r'},'');pushed++}catch(e){}}back();return}
 if(lastBk&&nw-lastBk<700){ /* رجعتين ورا بعض بسرعة = خروج: نفضّي الـentries وأي رجعة بعدها بتخرّج التطبيق */
  lastBk=0;exitUntil=nw+4000;const n=pushed;pushed=0;
  if(n>0){syncing=1;clearTimeout(sT);sT=setTimeout(()=>{syncing=0},900);try{history.go(-n)}catch(e){}}
  try{toast(A()?'اسحب مرة كمان للخروج':'Swipe back once more to exit')}catch(e){}
  setTimeout(()=>{try{window.close()}catch(e){}},120);return}
 lastBk=nw;
 try{toast(A()?'اضغط رجوع مرة تانية للخروج':'Press back again to exit')}catch(e){}
 if(pushed>0){const n=pushed;pushed=0;syncing=1;clearTimeout(sT);sT=setTimeout(()=>{syncing=0},900);try{history.go(-n)}catch(e){}}   /* نرجع للـentry الأولى عشان الرجعة التانية تخرّج فعلًا */
});
window.__txBack=function(){return layers()>0?back():false};
window.__txToast=function(m){try{toast(m)}catch(e){}};
const st=document.createElement('style');st.textContent='#libUse::after{content:" · v19.2"}';document.head.appendChild(st);
})();
/* ===== v20: target size • card & ID-photo layouts • invoice→CSV ===== */
(function(){
const A=()=>{try{return AR()}catch(e){return true}},L=(a,b)=>A()?a:b,q=x=>document.querySelector(x);
/* ---- 1) compress to a target size ---- */
XO.limit=0;
q('#xStamp').insertAdjacentHTML('afterend','<div class="fld" id="xLim"><span class="l" id="xLimL"></span><div class="chips" id="xLimC"></div></div>');
function limUI(){q('#xLimL').textContent=L('الحد الأقصى للحجم','Max file size');const c=q('#xLimC');c.innerHTML='';
 [0,1,2,5].forEach(v=>{const b=document.createElement('button');b.className='chip'+(XO.limit===v?' on':'');b.textContent=v?v+' MB'+(v===2?L(' (واتساب)',' (WhatsApp)'):''):L('بدون','None');b.onclick=()=>{XO.limit=v;limUI()};c.appendChild(b)});}
limUI();q('#exportBtn').addEventListener('click',limUI);
const xGo=q('#xGo'),orig=xGo.onclick;
xGo.onclick=async()=>{
 const idx=[...X.sel].sort((a,b)=>a-b);
 if(X.busy||!XO.limit||X.fmt==='png'||!idx.length)return orig();
 X.busy=true;q('#xGoLbl').textContent=L('بظبط الحجم…','Fitting size…');
 let best=null,last=null;const lim=XO.limit*1048576*.94,N=idx.length;
 try{const pick=[0,Math.floor(N/2),N-1].filter((v,i,a)=>a.indexOf(v)===i).map(k=>state.pages[idx[k]]);
  const bigs=[];for(const p of pick)bigs.push(await renderFinal(p,2200));
  const sc=(c,e)=>{const m=Math.max(c.width,c.height);if(e>=m)return c;const k=e/m,o=document.createElement('canvas');o.width=Math.round(c.width*k);o.height=Math.round(c.height*k);const x=o.getContext('2d');x.imageSmoothingQuality='high';x.drawImage(c,0,0,o.width,o.height);return o;};
  for(const [e,qq] of [[2200,.9],[2200,.8],[1800,.8],[1800,.7],[1400,.7],[1400,.6],[1100,.6],[1100,.5],[800,.5],[800,.4],[600,.4]]){
   let tot=0;for(const b of bigs)tot+=(await toBlob(sc(b,e),'image/jpeg',qq)).size;
   const est=tot/bigs.length*N;last={e,q:qq,est};if(est<=lim){best=last;break;}}
  if(!best)best=last;}catch(e){console.error(e)}
 X.busy=false;const Q=QUAL[X.size],sv={edge:Q.edge,q:Q.q};if(best){Q.edge=best.e;Q.q=best.q;}
 try{await orig();}finally{Q.edge=sv.edge;Q.q=sv.q;}
 if(best)try{toast(L('ضغط ذكي: حوالي ','Smart compress: ~')+(best.est/1048576).toFixed(1)+' MB')}catch(e){}};
/* ---- 2) card (front+back) and ID-photo layouts ---- */
const mm=v=>Math.round(v*7.874),W=mm(210),H=mm(297);
const LAY={card:{ar:'بطاقة (وش + ضهر)',en:'ID card (front + back)'},p34:{ar:'صور 3×4 سم',en:'Photos 3×4 cm',w:30,h:40},pass:{ar:'جواز 3.5×4.5 سم',en:'Passport 3.5×4.5 cm',w:35,h:45},p46:{ar:'صور 4×6 سم',en:'Photos 4×6 cm',w:40,h:60}};
const fab=document.createElement('button');fab.className='fab2';fab.style.bottom='calc(env(safe-area-inset-bottom,0px) + 160px)';fab.setAttribute('aria-label','ID');
fab.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M6 16c.6-1.6 1.8-2.2 3-2.2s2.4.6 3 2.2M14 10h4M14 13h3"/></svg>';
document.body.appendChild(fab);
setInterval(()=>{const hv=q('#vHome');fab.classList.toggle('on',!!(hv&&hv.classList.contains('on')&&state.pages.length&&(!window.__txMode||window.__txMode()==='pages')&&!q('#idOv')));},500);
const cover=(x,img,dx,dy,dw,dh)=>{const k=Math.max(dw/img.width,dh/img.height),w=img.width*k,h=img.height*k;x.save();x.beginPath();x.rect(dx,dy,dw,dh);x.clip();x.drawImage(img,dx+(dw-w)/2,dy+(dh-h)/2,w,h);x.restore();x.strokeStyle='#b8bec9';x.lineWidth=2;x.strokeRect(dx,dy,dw,dh);};
const rrp=(x,X,Y,Wd,Ht,r)=>{x.beginPath();x.moveTo(X+r,Y);x.arcTo(X+Wd,Y,X+Wd,Y+Ht,r);x.arcTo(X+Wd,Y+Ht,X,Y+Ht,r);x.arcTo(X,Y+Ht,X,Y,r);x.arcTo(X,Y,X+Wd,Y,r);x.closePath();};
/* ISO/IEC 7810 ID-1 card: 85.6 x 54 mm with a 3.18 mm corner radius, clipped like the real thing with a fine edge line */
const coverR=(x,img,dx,dy,dw,dh)=>{const r=mm(3.18),k=Math.max(dw/img.width,dh/img.height),w=img.width*k,h=img.height*k;x.save();rrp(x,dx,dy,dw,dh,r);x.clip();x.imageSmoothingQuality='high';x.drawImage(img,dx+(dw-w)/2,dy+(dh-h)/2,w,h);x.restore();x.save();x.strokeStyle='#c3c9d3';x.lineWidth=1.5;rrp(x,dx+.75,dy+.75,dw-1.5,dh-1.5,r-.75);x.stroke();x.restore();};
fab.onclick=()=>{
 const ov=document.createElement('div');ov.id='idOv';ov.style.zIndex='9000';let sel=state.pages.length===1?[0]:[],lay='card',cnt=8;
 ov.innerHTML='<button class="x" data-a="x">✕</button><h2></h2><p class="h"></p><div class="tg"></div><span class="l" id="i1"></span><div class="chips" id="iL"></div><span class="l" id="i2"></span><div class="chips" id="iC"></div><p class="msg" id="iMsg"></p><button class="btn go" id="iGo"></button>';
 const $o=s=>ov.querySelector(s);$o('h2').textContent=L('بطاقة وصور شخصية','Card & ID photos');
 $o('.h').textContent=L('اختار الصفحات بالترتيب (وش ثم ضهر) وبعدين الشكل. هتتضاف صفحة A4 جاهزة للطباعة.','Pick pages in order (front, then back), then a layout. A ready-to-print A4 page is added.');
 const tg=$o('.tg');state.pages.forEach((p,i)=>{const b=document.createElement('button');b.className='idt';b.innerHTML='<img alt="" src="'+p.thumb+'"><b></b>';b.onclick=()=>{const k=sel.indexOf(i);if(k>=0)sel.splice(k,1);else{if(sel.length>=2)sel.shift();sel.push(i)}draw()};tg.appendChild(b)});
 function draw(){[...tg.children].forEach((b,i)=>{const k=sel.indexOf(i);b.classList.toggle('on',k>=0);b.querySelector('b').textContent=k+1});
  $o('#i1').textContent=L('الشكل','Layout');const lc=$o('#iL');lc.innerHTML='';
  Object.keys(LAY).forEach(k=>{const b=document.createElement('button');b.className='chip'+(lay===k?' on':'');b.textContent=L(LAY[k].ar,LAY[k].en);b.onclick=()=>{lay=k;draw()};lc.appendChild(b)});
  const ph=lay!=='card';$o('#i2').hidden=!ph;$o('#iC').hidden=!ph;$o('#i2').textContent=L('عدد النسخ','Copies');const cc=$o('#iC');cc.innerHTML='';
  [4,6,8,12].forEach(n=>{const b=document.createElement('button');b.className='chip'+(cnt===n?' on':'');b.textContent=n;b.onclick=()=>{cnt=n;draw()};cc.appendChild(b)});
  $o('#iGo').textContent=L('إنشاء صفحة A4','Create A4 page');const need=lay==='card'?2:1;$o('#iMsg').textContent=sel.length<need?(lay==='card'?L('اختار صفحتين من فوق: الوش ثم الضهر ('+sel.length+'/2)','Pick 2 pages above: front then back ('+sel.length+'/2)'):L('اختار صفحة واحدة من فوق ('+sel.length+'/1)','Pick one page above ('+sel.length+'/1)')):'';}
 draw();document.body.appendChild(ov);$o('.x').onclick=()=>ov.remove();
 $o('#iGo').onclick=async()=>{
  if(lay==='card'&&sel.length<2){draw();return}
  if(!sel.length){draw();return}
  busy(true);await new Promise(r=>setTimeout(r,30));
  try{const cv=document.createElement('canvas');cv.width=W;cv.height=H;const x=cv.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,W,H);
   if(lay==='card'){const a=await renderFinal(state.pages[sel[0]],1600),b=await renderFinal(state.pages[sel[1]],1600),cw=mm(85.6),ch=mm(54),dx=Math.round((W-cw)/2);
    coverR(x,a,dx,mm(40),cw,ch);coverR(x,b,dx,mm(40)+ch+mm(14),cw,ch);}
   else{const im=await renderFinal(state.pages[sel[0]],1400),d=LAY[lay],cw=mm(d.w),ch=mm(d.h),g=mm(3),mg=mm(10);
    const cols=Math.max(1,Math.floor((W-2*mg+g)/(cw+g))),rows=Math.max(1,Math.floor((H-2*mg+g)/(ch+g))),n=Math.min(cnt,cols*rows),tw=cols*cw+(cols-1)*g,ox=Math.round((W-tw)/2);
    for(let i=0;i<n;i++)cover(x,im,ox+(i%cols)*(cw+g),mg+Math.floor(i/cols)*(ch+g),cw,ch);}
   const blob=await toBlob(cv,'image/jpeg',.92),p={id:newId(),blob,src:cv,corners:[{x:0,y:0},{x:1,y:0},{x:1,y:1},{x:0,y:1}],rot:0,filter:'original',br:0,ct:0,sat:0,ann:[],hist:[],fut:[],thumb:''};
   p.thumb=await makeThumb(p);state.pages.push(p);await persist(p);await persistMeta();ov.remove();renderHome(p.id);toast(L('اتضافت صفحة A4 جديدة','New A4 page added'));
  }catch(e){console.error(e);$o('#iMsg').textContent=L('حصلت مشكلة: ','Error: ')+(e&&e.message||e)}
  busy(false);};};
/* ---- 3) invoice → CSV (adds a button next to the OCR export buttons) ---- */
const prev=window.ocrExtras;
window.ocrExtras=function(ta){prev.apply(this,arguments);
 if(ta._inv)return;ta._inv=1;const bar=ta.nextElementSibling;if(!bar||!bar.classList.contains('ocx'))return;
 const b=document.createElement('button');b.className='btn sm';b.textContent=L('فاتورة → CSV','Invoice → CSV');
 b.onclick=()=>{const dg=s=>s.replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/[۰-۹]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/٫/g,'.').replace(/٬/g,',');
  const lines=dg(ta.value).split('\n').map(l=>l.trim()).filter(Boolean),num=l=>{const m=l.match(/\d[\d,]*\.?\d*/g);return m?parseFloat(m[m.length-1].replace(/,/g,'')):null};
  const dm=lines.join(' ').match(/\b(\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4}|\d{4}[\/\-.]\d{1,2}[\/\-.]\d{1,2})\b/);
  const isTot=l=>/(grand\s*total|amount\s*due|total|الاجمالي|الإجمالي|اجمالي|إجمالي|المجموع|المبلغ المستحق|الصافي)/i.test(l)&&!/sub\s*total|قبل/i.test(l),isTax=l=>/(vat|tax|ضريبة|القيمة المضافة)/i.test(l);
  const tl=lines.filter(isTot).filter(l=>num(l)!==null).pop(),xl=lines.filter(isTax).filter(l=>num(l)!==null).pop();
  const items=lines.filter(l=>!isTot(l)&&!isTax(l)).map(l=>l.match(/^(.*\p{L}.*?)\s+(\d[\d,]*\.?\d{0,2})$/u)).filter(Boolean).map(m=>[m[1].trim(),m[2].replace(/,/g,'')]);
  const ven=(lines.find(l=>(l.match(/\p{L}/gu)||[]).length>=3)||'').slice(0,60),Q=v=>'"'+String(v).replace(/"/g,'""')+'"';
  const rows=[['Field','Value'],['Vendor',ven],['Date',dm?dm[1]:''],['Tax',xl?num(xl):''],['Total',tl?num(tl):''],[],['Item','Price'],...items];
  const u=URL.createObjectURL(new Blob(['\ufeff'+rows.map(r=>r.map(Q).join(',')).join('\r\n')],{type:'text/csv;charset=utf-8'})),a=document.createElement('a');
  a.href=u;a.download=((state.name||'invoice').replace(/[\\/:*?"<>|]/g,'_'))+'-invoice.csv';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),4000);
  toast(L('اتصدّر: ','Exported: ')+items.length+L(' بند',' items'));};
 bar.appendChild(b);};
})();
/* v22: بند 12 — ترتيب بالسحب + تحديد عدة صفحات */
(function(){
var LG=function(a,e){return lang==='ar'?a:e};
var sel=new Set(),mode=false,drag=null,sup=false,armDel=0,armT=0;
var row=document.createElement('div');row.className='selrow';
var cnt=document.getElementById('count');cnt.parentNode.insertBefore(row,cnt);row.appendChild(cnt);
var sb=document.createElement('button');sb.id='selBtn';sb.type='button';row.appendChild(sb);
var bar=document.createElement('div');bar.id='selBar';document.getElementById('app').appendChild(bar);
bar.innerHTML='<span class="n"></span><button data-a="all"></button><button data-a="first"></button><button data-a="last"></button><button class="dng" data-a="del"></button>';
var B=function(a){return bar.querySelector('[data-a='+a+']')};
function ids(){return new Set(state.pages.map(function(p){return p.id}))}
function labels(){
  sb.textContent=mode?LG('إلغاء','Cancel'):LG('تحديد','Select');sb.classList.toggle('on',mode);
  B('all').textContent=LG('الكل','All');B('first').textContent=LG('للأول','To first');B('last').textContent=LG('للآخر','To last');
  B('del').textContent=armDel?LG('متأكد؟','Sure?'):LG('حذف','Delete');
  var n=sel.size;bar.querySelector('.n').textContent=n?LG('اتحدد '+n,n+' selected'):LG('اختار صفحات','Pick pages');
  ['first','last','del'].forEach(function(a){B(a).disabled=!n});
}
function setMode(m){mode=m;if(!m){sel.clear();armDel=0}document.body.classList.toggle('selmode',m);bar.classList.toggle('on',m);renderHome();}
sb.onclick=function(){setMode(!mode)};
function decorate(){
  var n=state.pages.length;row.style.display='flex';sb.style.visibility=n?'visible':'hidden';
  if(mode&&!n){mode=false;sel.clear();document.body.classList.remove('selmode');bar.classList.remove('on')}
  var have=ids();sel.forEach(function(i){if(!have.has(i))sel.delete(i)});
  labels();
  var g=document.querySelector('#shelf .grid');if(!g)return;
  g.classList.toggle('sel',mode);
  var pgs=g.querySelectorAll('.pg');
  state.pages.forEach(function(p,i){var b=pgs[i];if(!b)return;
    b.classList.toggle('picked',sel.has(p.id));
    var orig=b.onclick;
    b.onclick=function(e){
      if(sup){sup=false;e.stopPropagation();return}
      if(mode){if(sel.has(p.id))sel.delete(p.id);else sel.add(p.id);armDel=0;b.classList.toggle('picked',sel.has(p.id));labels();return}
      orig&&orig.call(b,e)};
    b.onpointerdown=function(e){if(mode||drag||e.target.closest('.pgdel')||(e.pointerType==='mouse'&&e.button!==0))return;startPress(e,b,g)};
  });
}
var _rh=renderHome;renderHome=function(f){_rh(f);decorate()};
/* سحب */
function startPress(e,b,g){
  var x0=e.clientX,y0=e.clientY,pid=e.pointerId,done=false,tm;
  function cleanup(){clearTimeout(tm);document.removeEventListener('pointermove',mv,true);document.removeEventListener('pointerup',up,true);document.removeEventListener('pointercancel',up,true)}
  function mv(ev){if(ev.pointerId!==pid)return;if(!drag&&Math.hypot(ev.clientX-x0,ev.clientY-y0)>10){cleanup()}}
  function up(ev){if(ev.pointerId!==pid)return;cleanup()}
  document.addEventListener('pointermove',mv,true);document.addEventListener('pointerup',up,true);document.addEventListener('pointercancel',up,true);
  tm=setTimeout(function(){cleanup();beginDrag(b,g,pid,x0,y0)},380);
}
function beginDrag(b,g,pid,x0,y0){
  var r=b.getBoundingClientRect(),gh=document.createElement('div');gh.className='dragghost';
  gh.style.width=r.width+'px';gh.style.height=r.height+'px';gh.innerHTML='<img alt="" src="'+b.querySelector('img').src+'">';
  document.body.appendChild(gh);b.classList.add('dragsrc');
  drag={b:b,g:g,gh:gh,dx:x0-r.left,dy:y0-r.top,y:y0,pid:pid};
  try{navigator.vibrate&&navigator.vibrate(18)}catch(e){}
  place(x0,y0);
  document.addEventListener('pointermove',dmv,true);document.addEventListener('pointerup',dend,true);document.addEventListener('pointercancel',dend,true);
  drag.sc=setInterval(function(){var s=document.getElementById('shelf'),sr=s.getBoundingClientRect(),y=drag.y;if(y<sr.top+70)s.scrollTop-=12;else if(y>sr.bottom-70)s.scrollTop+=12},16);
}
function place(x,y){drag.gh.style.left=(x-drag.dx)+'px';drag.gh.style.top=(y-drag.dy)+'px';drag.y=y}
function dmv(e){if(!drag||e.pointerId!==drag.pid)return;e.preventDefault();place(e.clientX,e.clientY);
  var cx=e.clientX,cy=e.clientY,kids=[].slice.call(drag.g.querySelectorAll('.pg'));
  for(var i=0;i<kids.length;i++){var k=kids[i];if(k===drag.b)continue;var q=k.getBoundingClientRect();
    if(cx>=q.left&&cx<=q.right&&cy>=q.top&&cy<=q.bottom){
      var bi=kids.indexOf(drag.b);
      if(bi<i)k.after(drag.b);else k.before(drag.b);
      kids.forEach(function(el,j){var nm=el.querySelector('.num');});
      drag.g.querySelectorAll('.pg').forEach(function(el,j){el.querySelector('.num').textContent=j+1});
      break}}
}
document.addEventListener('touchmove',function(e){if(drag&&e.cancelable)e.preventDefault()},{passive:false});
document.addEventListener('contextmenu',function(e){if(drag||e.target.closest&&e.target.closest('.pg'))e.preventDefault()});
async function dend(e){
  if(!drag||(e&&e.pointerId!==drag.pid))return;
  document.removeEventListener('pointermove',dmv,true);document.removeEventListener('pointerup',dend,true);document.removeEventListener('pointercancel',dend,true);
  clearInterval(drag.sc);drag.gh.remove();
  var g=drag.g,b=drag.b;b.classList.remove('dragsrc');
  var order=[].slice.call(g.querySelectorAll('.pg')),old=state.pages.slice();
  var moved=order.map(function(el){return old[[].indexOf.call(g.querySelectorAll('.pg'),el)]});
  /* الـ DOM اتحرك، والترتيب الأصلي محفوظ في old حسب الفهرس القديم */
  drag=null;sup=true;setTimeout(function(){sup=false},400);
  var newPages=order.map(function(el){return el._p}).filter(Boolean);
  if(newPages.length===old.length){state.pages=newPages;await persistMeta();toast(LG('اتغير الترتيب','Order changed'))}
  renderHome();
}
/* نربط كل بطاقة بصفحتها عشان الترتيب الجديد يتقرا من الـ DOM */
var _dec=decorate;decorate=function(){_dec();var g=document.querySelector('#shelf .grid');if(!g)return;var pgs=g.querySelectorAll('.pg');state.pages.forEach(function(p,i){if(pgs[i])pgs[i]._p=p})};
var _rh2=renderHome;renderHome=function(f){_rh2(f)};
/* أزرار شريط التحديد */
bar.addEventListener('click',async function(e){
  var a=e.target.closest('button');if(!a)return;a=a.dataset.a;
  var pick=state.pages.filter(function(p){return sel.has(p.id)});
  if(a==='all'){if(sel.size===state.pages.length)sel.clear();else state.pages.forEach(function(p){sel.add(p.id)});armDel=0;renderHome();return}
  if(!pick.length)return;
  if(a==='first'||a==='last'){var rest=state.pages.filter(function(p){return!sel.has(p.id)});state.pages=a==='first'?pick.concat(rest):rest.concat(pick);await persistMeta();armDel=0;renderHome();toast(LG('اتنقلت '+pick.length+' صفحة','Moved '+pick.length+' pages'));return}
  if(a==='del'){
    if(!armDel){armDel=1;labels();clearTimeout(armT);armT=setTimeout(function(){armDel=0;labels()},2600);return}
    clearTimeout(armT);armDel=0;
    var snap=pick.map(function(p){return{p:p,i:state.pages.indexOf(p)}});
    state.pages=state.pages.filter(function(p){return!sel.has(p.id)});
    for(var k=0;k<pick.length;k++)await unpersist(pick[k].id);
    await persistMeta();sel.clear();
    if(!state.pages.length)setMode(false);else renderHome();
    var ub=document.getElementById('undoBar');if(!ub){ub=document.createElement('div');ub.id='undoBar';document.getElementById('app').appendChild(ub)}
    ub.innerHTML='<span></span><button type="button"></button>';
    ub.querySelector('span').textContent=LG('اتحذفت '+snap.length+' صفحة','Deleted '+snap.length+' pages');
    var bt=ub.querySelector('button');bt.textContent=LG('تراجع','Undo');
    bt.onclick=async function(){ub.classList.remove('on');
      snap.sort(function(x,y){return x.i-y.i}).forEach(function(s){state.pages.splice(Math.min(s.i,state.pages.length),0,s.p)});
      for(var k=0;k<snap.length;k++)await persist(snap[k].p);await persistMeta();renderHome()};
    ub.classList.add('on');setTimeout(function(){ub.classList.remove('on')},10000);
  }
});
renderHome();
})();
(function(){
var fab=document.getElementById('scanBtn'),menu=document.getElementById('fabMenu');if(!fab||!menu)return;
var LGf=function(a,e){return lang==='ar'?a:e};
function labels(){var b=menu.querySelectorAll('button'),IM=['<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"/><circle cx="12" cy="13" r="3"/></svg>','<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/></svg>','<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>'],TX=[LGf('كاميرا','Camera'),LGf('من المعرض','From gallery'),LGf('صفحة A4 فاضية','Blank A4 page')];b.forEach(function(x,i){x.innerHTML='<i class="mi">'+IM[i]+'</i><span>'+TX[i]+'</span>'});
 var sv=document.querySelector('#exportBtn span');if(sv)sv.textContent=LGf('حفظ','Save');fab.setAttribute('aria-label',LGf('مسح','Scan'))}
labels();var lb=document.getElementById('langBtn');if(lb)lb.addEventListener('click',function(){setTimeout(labels,60)});
var tm=0,long=false;function hide(){menu.hidden=true}
fab.addEventListener('pointerdown',function(){long=false;clearTimeout(tm);if(window.__txMode&&window.__txMode()==='docs')return;tm=setTimeout(function(){long=true;menu.hidden=false;try{navigator.vibrate&&navigator.vibrate(15)}catch(_){}},450)});
['pointerup','pointercancel','pointerleave'].forEach(function(ev){fab.addEventListener(ev,function(){clearTimeout(tm)})});
fab.addEventListener('contextmenu',function(e){e.preventDefault()});
fab.addEventListener('click',function(e){e.stopImmediatePropagation();e.preventDefault();if(long){long=false;return}if(!menu.hidden){hide();return}if(window.__txMode&&window.__txMode()==='docs'){window.__txNewChooser();return}window.__txNew=window.__txMode&&window.__txMode()==='docs';document.getElementById('camIn').click()},true);
document.addEventListener('pointerdown',function(e){if(!menu.hidden&&!e.target.closest('#fabMenu')&&!e.target.closest('#scanBtn'))hide()},true);
menu.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;hide();var a=b.dataset.a;window.__txNew=window.__txMode&&window.__txMode()==='docs';
 if(a==='cam')document.getElementById('camIn').click();
 else if(a==='gal')document.getElementById('galIn').click();
 else if(a==='blank'){var c=document.createElement('canvas');c.width=1240;c.height=1754;var x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);
  c.toBlob(function(bl){if(!bl)return;bl.__q=[{x:0,y:0},{x:1,y:0},{x:1,y:1},{x:0,y:1}];bl.__x=1;ingest(bl)},'image/jpeg',.92)}});
})();
/* ===== v19: home = document cards (item 16) ===== */
(function(){
var homeMode='docs',pendTag='',pendQ='';
window.__txMode=function(){return homeMode};
window.__txNew=false;
var home=document.getElementById('vHome'),shelf=document.getElementById('shelf'),row=home.querySelector('.docrow');
var bk=document.createElement('button');bk.className='ib';bk.id='docsBack';bk.type='button';bk.hidden=true;
bk.innerHTML='<svg class="i flip"><use href="#i-back"/></svg>';row.insertBefore(bk,row.firstChild);
window.__txLayer=function(){return homeMode==='pages'&&!bk.hidden};
function setMode(m){homeMode=m;home.classList.toggle('docsmode',m==='docs')}
bk.onclick=function(){setMode('docs');renderHome()};
var _gh=goHome;goHome=function(f){setMode('pages');_gh(f)};
var _lr=loadRec;loadRec=async function(r){await _lr(r);setMode('pages')};
var _ing=ingest;ingest=function(f){if(window.__txNew){window.__txNew=false;return(async function(){if(state.pages.length)await startNew();setMode('pages');return _ing(f)})()}setMode('pages');return _ing(f)};
var _rh=renderHome;
renderHome=function(f){
  if(homeMode==='docs'){home.classList.add('docsmode');renderDocs();return}
  home.classList.remove('docsmode');_rh(f);
  bk.hidden=!(state.pages.length||($('#libB')&&$('#libB').textContent));
};
function matchD(r,q){if(!q)return true;if(norm(r.name).includes(q)||(r.tags||[]).some(function(x){return norm(x).includes(q)}))return true;var o=OI();return(r.order||[]).some(function(id){return norm(o[id]).includes(q)})}
var rdT=0;
var DS=window.__txDS||(window.__txDS={on:false,ids:{}});
var DELI='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></svg>';
async function trashRecs(list){
  for(var i=0;i<list.length;i++){var r=list[i];
    if(r.isCur){var rr=curRec();if(rr)await tx('docs','readwrite',function(s){s.put(Object.assign({},rr,{trashed:Date.now()}))});state.pages=[];state.id=newId();state.name=defName();$('#docName').value=state.name;await clearStore();await persistMeta();}
    else await tx('docs','readwrite',function(s){s.put(Object.assign({},r,{trashed:Date.now()}))});}
  toast(Lg(list.length===1?'اتنقل لسلة المحذوفات (٣٠ يوم)':'اتنقل '+list.length+' مستند لسلة المحذوفات (٣٠ يوم)',list.length===1?'Moved to Trash (30 days)':list.length+' documents moved to Trash (30 days)'));}
async function renderDocs(){
  var my=++rdT,saved=await allSaved(),cur=null;
  if(state.pages.length)cur={id:state.id,name:state.name||defName(),count:state.pages.length,thumb:state.pages[0].thumb,tags:getTags(),pinned:state.pinnedId===state.id,order:state.pages.map(function(p){return p.id}),isCur:true};
  if(my!==rdT)return;
  if(!cur&&!saved.length){setMode('pages');renderHome();return}
  var all=(cur?[cur]:[]).concat(saved.sort(function(a,b){return((b.pinned?1:0)-(a.pinned?1:0))||b.ts-a.ts}));
  var tags=new Set();all.forEach(function(r){(r.tags||[]).forEach(function(x){tags.add(x)})});
  if(pendTag&&pendTag!=='__pin'&&!tags.has(pendTag))pendTag='';
  var q=norm(pendQ).trim();
  var list=all.filter(function(r){return matchD(r,q)&&(!pendTag||(pendTag==='__pin'?r.pinned:(r.tags||[]).indexOf(pendTag)>=0))});
  var hadFocus=document.activeElement&&document.activeElement.id==='dQ';
  shelf.innerHTML='';
  var top=document.createElement('div');top.className='dtop';
  top.innerHTML='<input id="dQ" type="search" autocomplete="off"><button class="btn sm" id="dNew" type="button"></button><button class="ib" id="dSel" type="button"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.7 2.7L16 9.5"/></svg></button><button class="ib" id="dMore" type="button" aria-label="'+(typeof Lg==='function'?Lg:function(a,b){return b})('المستندات','Documents')+'"><svg class="i"><use href="#i-docs"/></svg></button>';
  var dn=top.querySelector('#dNew');dn.textContent=Lg('+ مستند جديد','+ New doc');dn.style.cssText='flex:none;white-space:nowrap;padding:0 12px';dn.onclick=function(){window.__txNewChooser()};
  shelf.appendChild(top);var qi=top.querySelector('#dQ');qi.value=pendQ;qi.placeholder=Lg('ابحث بالاسم أو بنص الـOCR…','Search by name or OCR text…');
  var tm=0;qi.oninput=function(){pendQ=qi.value;clearTimeout(tm);tm=setTimeout(renderDocs,220)};
  top.querySelector('#dMore').setAttribute('aria-label',Lg('نسخ احتياطي والمحذوفات','Backup & trash'));top.querySelector('#dMore').onclick=openLib;
  var dsb=top.querySelector('#dSel');dsb.setAttribute('aria-label',Lg('تحديد عدة مستندات','Select documents'));dsb.onclick=function(){DS.on=!DS.on;DS.ids={};updSel()};
  var chips=document.createElement('div');chips.className='dchips';
  function chip(label,val){var b=document.createElement('button');b.type='button';b.textContent=label;if(pendTag===val)b.className='on';b.onclick=function(){pendTag=val;renderDocs()};chips.appendChild(b)}
  chip(Lg('الكل','All'),'');if(all.some(function(r){return r.pinned}))chip(Lg('📌 المثبّت','📌 Pinned'),'__pin');[].concat(Array.from(tags)).sort().forEach(function(x){chip('#'+x,x)});
  if(chips.children.length>1||pendTag)shelf.appendChild(chips);
  var g=document.createElement('div');g.className='dgrid';var cards=[];
  if(!list.length){g.innerHTML='<p class="dnone">'+Lg('مفيش نتايج.','No results.')+'</p>'}
  list.forEach(function(r,i){
    var c=document.createElement('div');c.className='dcard'+(r.isCur?' cur':'');c.tabIndex=0;c.setAttribute('role','button');c.style.setProperty('--i',Math.min(i,10));
    c.innerHTML='<div class="dcov"><img alt="" src="'+r.thumb+'"><span class="dck"></span>'+(r.isCur?'<span class="dbadge">'+Lg('مفتوح','Open')+'</span>':'')+'</div><div class="dinf"><b></b><small>'+Lg(r.count+' صفحة',r.count+(r.count===1?' page':' pages'))+'</small><div class="dtg"></div></div>';
    c.querySelector('b').textContent=(r.pinned?'📌 ':'')+r.name;
    c.querySelector('.dtg').textContent=(r.tags||[]).map(function(x){return '#'+x}).join(' ');
    if(!r.isCur){var pb=document.createElement('button');pb.type='button';pb.className='dpin'+(r.pinned?' on':'');pb.textContent='📌';pb.setAttribute('aria-label',Lg('تثبيت','Pin'));
      pb.onclick=async function(e){e.stopPropagation();await tx('docs','readwrite',function(st){st.put(Object.assign({},r,{pinned:!r.pinned}))});renderDocs()};c.querySelector('.dcov').appendChild(pb)}
    {var sb=document.createElement('button');sb.type='button';sb.className='dshare';sb.setAttribute('aria-label',Lg('مشاركة كـPDF','Share as PDF'));sb.innerHTML='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V3M8 7l4-4 4 4"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/></svg>';
     sb.onclick=function(e){e.stopPropagation();window.__txQuickPdf(r)};c.querySelector('.dcov').appendChild(sb)}
    {var dl=document.createElement('button'),darm=0;dl.type='button';dl.className='ddel';dl.setAttribute('aria-label',Lg('حذف المستند','Delete document'));dl.innerHTML=DELI;
     dl.onclick=async function(e){e.stopPropagation();if(!darm){darm=1;dl.classList.add('arm');dl.textContent=Lg('تأكيد الحذف','Confirm');setTimeout(function(){darm=0;dl.classList.remove('arm');dl.innerHTML=DELI},2600);return}await trashRecs([r]);renderDocs()};c.querySelector('.dcov').appendChild(dl)}
    var lp=0,lpf=0,px=0,py=0;
    c.addEventListener('pointerdown',function(e){if(DS.on)return;lpf=0;px=e.clientX;py=e.clientY;clearTimeout(lp);lp=setTimeout(function(){lpf=1;DS.on=true;DS.ids={};DS.ids[r.id]=1;updSel();try{navigator.vibrate&&navigator.vibrate(15)}catch(x){}},520)});
    c.addEventListener('pointermove',function(e){if(Math.abs(e.clientX-px)+Math.abs(e.clientY-py)>12)clearTimeout(lp)});
    ['pointerup','pointercancel','pointerleave'].forEach(function(ev){c.addEventListener(ev,function(){clearTimeout(lp)})});
    c.addEventListener('contextmenu',function(e){e.preventDefault()});
    c.onclick=async function(){if(lpf){lpf=0;return}if(DS.on){if(DS.ids[r.id])delete DS.ids[r.id];else DS.ids[r.id]=1;updSel();return}if(!r.isCur){await snapDoc();await loadRec(r)}setMode('pages');stagNext=true;renderHome()};
    c.onkeydown=function(e){if(e.key==='Enter')c.onclick()};
    cards.push([c,r]);g.appendChild(c)});
  shelf.appendChild(g);
  var bar2=document.createElement('div');bar2.className='dselbar';
  bar2.innerHTML='<b class="dn"></b><button type="button" class="dall"></button><button type="button" class="ddl"></button><button type="button" class="dx"></button>';
  var bN=bar2.querySelector('.dn'),bA=bar2.querySelector('.dall'),bD=bar2.querySelector('.ddl'),bX=bar2.querySelector('.dx'),barm=0;
  bX.textContent='✕';bX.setAttribute('aria-label',Lg('إلغاء التحديد','Cancel selection'));bA.textContent=Lg('الكل','All');
  function updSel(){var n=0;cards.forEach(function(x){var on=!!DS.ids[x[1].id];if(on)n++;x[0].classList.toggle('sel',on)});
    home.classList.toggle('dsel',DS.on);g.classList.toggle('sel',DS.on);barm=0;bD.classList.remove('arm');bD.textContent=Lg('حذف','Delete');bD.disabled=!n;
    bN.textContent=Lg(n+' محدد',n+' selected');bA.textContent=(n&&n===cards.length)?Lg('إلغاء الكل','None'):Lg('الكل','All')}
  bX.onclick=function(){DS.on=false;DS.ids={};updSel()};
  bA.onclick=function(){var all2=cards.length&&cards.every(function(x){return DS.ids[x[1].id]});DS.ids={};if(!all2)cards.forEach(function(x){DS.ids[x[1].id]=1});updSel()};
  bD.onclick=async function(){var ch=cards.filter(function(x){return DS.ids[x[1].id]}).map(function(x){return x[1]});if(!ch.length)return;
    if(!barm){barm=1;bD.classList.add('arm');bD.textContent=Lg('تأكيد حذف '+ch.length,'Confirm '+ch.length);setTimeout(function(){if(barm){barm=0;bD.classList.remove('arm');bD.textContent=Lg('حذف','Delete')}},2600);return}
    await trashRecs(ch);DS.on=false;DS.ids={};renderDocs()};
  shelf.appendChild(bar2);var keep={};cards.forEach(function(x){if(DS.ids[x[1].id])keep[x[1].id]=1});DS.ids=keep;if(!cards.length)DS.on=false;updSel();
  $('#count').textContent='';bk.hidden=true;try{updLib()}catch(e){}
  if(hadFocus){var n=shelf.querySelector('#dQ');if(n){n.focus();var l=n.value.length;try{n.setSelectionRange(l,l)}catch(e){}}}
}
setMode('docs');
idbReady.then(function(){setTimeout(function(){if(homeMode==='docs')renderHome()},60)});
})();

/* ===== v21: Book mode — split an open-book spread into two pages ===== */
(function(){
const A=()=>{try{return AR()}catch(e){return true}},L=(a,b)=>A()?a:b,q=x=>document.querySelector(x);
q('#pPage .pgact').insertAdjacentHTML('beforeend','<button class="pa" id="bookB"><svg class="i"><use href="#i-book"/></svg><span>'+L('تقسيم كتاب','Split book')+'</span></button>');
const lum=(d,o)=>d[o]*.299+d[o+1]*.587+d[o+2]*.114;
function findGutter(cv){
 const w=cv.width,h=cv.height,sw=Math.min(w,600),sh=Math.max(1,Math.round(h*sw/w)),t=mk(sw,sh),g=t.getContext('2d');g.drawImage(cv,0,0,sw,sh);
 const d=g.getImageData(0,0,sw,sh).data,col=new Float32Array(sw),y0=Math.floor(sh*.1),y1=Math.ceil(sh*.9);
 for(let i=0;i<sw;i++){let s=0;for(let y=y0;y<y1;y++)s+=lum(d,(y*sw+i)*4);col[i]=s/Math.max(1,y1-y0);}
 const r=Math.max(2,Math.round(sw*.015)),sm=new Float32Array(sw);
 for(let i=0;i<sw;i++){let s=0,n=0;for(let j=Math.max(0,i-r);j<=Math.min(sw-1,i+r);j++){s+=col[j];n++;}sm[i]=s/n;}
 const a=Math.floor(sw*.35),b=Math.ceil(sw*.65);let mi=a;for(let i=a;i<=b;i++)if(sm[i]<sm[mi])mi=i;
 let ref=0,n=0;for(let i=Math.floor(sw*.1);i<sw*.9;i++){ref+=sm[i];n++;}ref/=Math.max(1,n);
 return sm[mi]<ref*.93?mi/sw:.5;
}
function flatten(cv,side){ // side 'L': gutter on the right edge, 'R': on the left edge
 const w=cv.width,h=cv.height,g=cv.getContext('2d'),zone=Math.max(8,Math.round(w*.2)),x0=side==='L'?w-zone:0,im=g.getImageData(x0,0,zone,h),d=im.data,col=new Float32Array(zone),ya=Math.floor(h*.05),yb=Math.ceil(h*.95);
 for(let i=0;i<zone;i++){let s=0;for(let y=ya;y<yb;y++)s+=lum(d,(y*zone+i)*4);col[i]=s/Math.max(1,yb-ya);}
 const r=Math.max(2,Math.round(zone*.04)),sm=new Float32Array(zone);
 for(let i=0;i<zone;i++){let s=0,n=0;for(let j=Math.max(0,i-r);j<=Math.min(zone-1,i+r);j++){s+=col[j];n++;}sm[i]=s/n;}
 const fa=side==='L'?0:Math.floor(zone*.7),fb=side==='L'?Math.ceil(zone*.3):zone;let ref=0,n=0;for(let i=fa;i<fb;i++){ref+=sm[i];n++;}ref/=Math.max(1,n);
 for(let i=0;i<zone;i++){const gain=Math.min(1.7,Math.max(1,ref/Math.max(30,sm[i])));if(gain<1.01)continue;
  for(let y=0;y<h;y++){const o=(y*zone+i)*4;d[o]=Math.min(255,d[o]*gain);d[o+1]=Math.min(255,d[o+1]*gain);d[o+2]=Math.min(255,d[o+2]*gain);}}
 g.putImageData(im,x0,0);
}
const half=(cv,a,b)=>{const c=mk(b-a,cv.height);c.getContext('2d').drawImage(cv,a,0,b-a,cv.height,0,0,b-a,cv.height);return c;};
const newPage=async cv=>{const blob=await toBlob(cv,'image/jpeg',.92),p={id:newId(),blob,src:cv,corners:[{x:0,y:0},{x:1,y:0},{x:1,y:1},{x:0,y:1}],rot:0,filter:'original',br:0,ct:0,sat:0,ann:[],hist:[],fut:[],thumb:''};p.thumb=await makeThumb(p);return p;};
q('#bookB').onclick=async()=>{
 const p=E.page;if(!p)return;busy(true);await sleep(30);let cv;
 try{cv=await renderFinal(p,3000);}catch(e){busy(false);toast(L('حصلت مشكلة: ','Error: ')+(e&&e.message||e));return;}
 busy(false);
 let gx=findGutter(cv),rtl=localStorage.getItem('tx_bkrtl')==null?A():localStorage.getItem('tx_bkrtl')==='1',flt=localStorage.getItem('tx_bkfl')!=='0',del=false;
 const ov=document.createElement('div');ov.style.cssText='position:fixed;inset:0;z-index:9000;background:rgba(0,0,0,.7);display:flex;align-items:center;justify-content:center;padding:14px';
 ov.innerHTML='<div style="background:var(--surface,#fff);color:var(--ink,#111);border-radius:18px;padding:14px;width:min(520px,100%);max-height:94%;overflow:auto;display:flex;flex-direction:column;gap:10px;font:600 14px system-ui"><b style="font-size:16px">'+L('تقسيم صفحتين كتاب','Split a book spread')+'</b><small style="font-weight:500;opacity:.75">'+L('اسحب الخط الأزرق على كعب الكتاب لو مش في مكانه','Drag the blue line onto the book gutter if it is off')+'</small><div class="bkw" style="position:relative;width:fit-content;max-width:100%;margin:auto;touch-action:none"><canvas class="bkc" style="display:block;max-width:100%;max-height:42vh;border-radius:8px"></canvas><i class="bkl" style="position:absolute;top:0;bottom:0;width:3px;margin-left:-1.5px;background:#22d3f5;box-shadow:0 0 0 1px #0006;pointer-events:none"></i></div><div class="chips bko"></div><div style="display:flex;gap:8px;justify-content:flex-end"><button class="btn sm bkx" type="button">'+L('إلغاء','Cancel')+'</button><button class="btn sm bkg" type="button" style="background:var(--accent,#22d3f5);color:#04202b">'+L('قسّم','Split')+'</button></div></div>';
 document.body.appendChild(ov);const o=s=>ov.querySelector(s),pc=o('.bkc'),sc=Math.min(1,720/cv.width);pc.width=Math.round(cv.width*sc);pc.height=Math.round(cv.height*sc);pc.getContext('2d').drawImage(cv,0,0,pc.width,pc.height);
 const line=()=>{o('.bkl').style.left=(gx*100)+'%';},opts=()=>{const c=o('.bko');c.innerHTML='';
  [[L('ترتيب عربي (اليمين الأول)','Right-to-left'),'r',rtl],[L('ترتيب إنجليزي (الشمال الأول)','Left-to-right'),'l',!rtl],[L('تخفيف ظل الكعب','Reduce gutter shadow'),'f',flt],[L('احذف الصفحة الأصلية','Delete the original'),'d',del]].forEach(a=>{const b=document.createElement('button');b.type='button';b.className='chip'+(a[2]?' on':'');b.textContent=a[0];b.onclick=()=>{if(a[1]==='r')rtl=true;else if(a[1]==='l')rtl=false;else if(a[1]==='f')flt=!flt;else del=!del;opts();};c.appendChild(b);});};
 const mv=e=>{const r=o('.bkw').getBoundingClientRect();gx=Math.min(.7,Math.max(.3,(e.clientX-r.left)/r.width));line();};
 o('.bkw').onpointerdown=e=>{o('.bkw').setPointerCapture(e.pointerId);mv(e);o('.bkw').onpointermove=mv;};o('.bkw').onpointerup=()=>{o('.bkw').onpointermove=null;};
 line();opts();o('.bkx').onclick=()=>ov.remove();
 o('.bkg').onclick=async()=>{
  localStorage.setItem('tx_bkrtl',rtl?'1':'0');localStorage.setItem('tx_bkfl',flt?'1':'0');ov.remove();busy(true);await sleep(30);
  try{const W=cv.width,X=Math.round(W*gx),tr=Math.round(W*.004),a=half(cv,0,Math.max(10,X-tr)),b=half(cv,Math.min(W-10,X+tr),W);
   if(flt){flatten(a,'L');flatten(b,'R');}
   const pl=await newPage(a),pr=await newPage(b),two=rtl?[pr,pl]:[pl,pr];
   let i=state.pages.indexOf(p);if(i<0){i=state.pages.length;E.isDraft=false;state.draft=null;}else if(del){state.pages.splice(i,1);unpersist(p.id);}else i++;
   state.pages.splice(i,0,two[0],two[1]);await persist(two[0]);await persist(two[1]);await persistMeta();
   E.page=null;if(!(window.__txPend&&nextQueued())){goHome();renderHome(two[0].id);}toast(L('اتقسمت لصفحتين','Split into 2 pages'));
  }catch(e){console.error(e);toast(L('حصلت مشكلة: ','Error: ')+(e&&e.message||e));}
  busy(false);};
};
})();
/* ===== v122: Timaxo tools — home button (replaces QR) fans out like the + menu; camera gets tools in the bottom slider ===== */
(function(){
const A=()=>{try{return AR()}catch(e){return true}};
const LIST=[
 {id:'card',c:'#0e9f8e',ar:'تصوير البطاقة',en:'ID card',da:'وش وضهر على صفحة A4 جاهزة',de:'Front & back on one A4 page',svg:'<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M14 10h4M14 14h3M6 16c.6-1.6 1.8-2 3-2s2.4.4 3 2"/>'},
 {id:'ph',c:'#8a5cf0',ar:'صورة شخصية',en:'ID photo',da:'مقاسات الجواز والبطاقة للطباعة',de:'Passport & ID sizes, print-ready',svg:'<circle cx="12" cy="9" r="3.5"/><path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5"/>'},
 {id:'book',c:'#f59e0b',ar:'تصوير كتاب',en:'Book',da:'تقسيم الصفحتين تلقائيًا',de:'Splits the spread into two pages',svg:'<path d="M12 6c-2-1.5-5-2-8-1.5v13c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5v-13C17 4 14 4.5 12 6z"/><path d="M12 6v13"/>'},
 {id:'ocr',c:'#3b82f6',ar:'استخراج النص',en:'Extract text',da:'عربي وإنجليزي من الصورة',de:'Arabic & English from the photo',svg:'<path d="M4 7V5a1 1 0 0 1 1-1h2M17 4h2a1 1 0 0 1 1 1v2M20 17v2a1 1 0 0 1-1 1h-2M7 20H5a1 1 0 0 1-1-1v-2"/><path d="M8 9h8M8 12h8M8 15h5"/>'},
 {id:'qr',c:'#22b8e8',ar:'قراءة QR',en:'QR code',da:'قراءة فورية وفتح الرابط',de:'Instant scan, open the link',svg:'<path d="M3 8V5a2 2 0 0 1 2-2h3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3"/><path d="M7 12h10"/>'}];
const GRID='<rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/>';
const pm=()=>{try{return localStorage.getItem('tx_tmulti')==='1'}catch(e){return false}};
const vib=p=>{try{if(localStorage.getItem('tx_hap')!=='0'&&navigator.vibrate)navigator.vibrate(p)}catch(e){}};
const red=()=>matchMedia('(prefers-reduced-motion:reduce)').matches;
if(!document.getElementById('txtlcss')){const s=document.createElement('style');s.id='txtlcss';s.textContent=`
.txfan.txl{align-items:flex-start!important}
.txfan.txl .row{flex-direction:row-reverse}
.txfan.txl.out .row{animation-delay:0ms!important}
html body #qrFab svg{width:24px!important;height:24px!important}
`;document.head.appendChild(s);}
function launch(id,mu){
 if(id==='qr'){if(window.__txQR)window.__txQR();return;}
 window.__txTool={id:id,multi:!!mu};
 try{camP=camOpen();camP.catch(()=>{});}catch(e){}
 const c=document.getElementById('camIn');if(c)c.click();}
window.TXTL={list:LIST,launch:launch};
/* home: the QR circle becomes "Tools" and fans out exactly like the + menu */
let open=null,poll=0;
function fanClose(fast){const o=open;if(!o)return;open=null;clearInterval(poll);
 const rm=()=>o.forEach(e=>e.remove());
 if(fast||red()){rm();return}
 o.forEach(e=>e.classList.add('out'));setTimeout(rm,200);}
function fan(){
 if(open){vib(8);fanClose();return}
 const ar=A(),b=document.getElementById('qrFab');if(!b)return;
 const s=document.createElement('div');s.className='txfs';
 const f=document.createElement('div');f.className='txfan txl';f.setAttribute('role','menu');
 LIST.forEach((t,i)=>{const r=document.createElement('button');r.type='button';r.className='row';r.style.setProperty('--c',t.c);r.style.setProperty('--k',LIST.length-1-i);
  r.innerHTML='<span class="lb"><b></b><small></small></span><span class="ic"><svg viewBox="0 0 24 24">'+t.svg+'</svg></span>';
  r.querySelector('b').textContent=ar?t.ar:t.en;r.querySelector('small').textContent=ar?t.da:t.de;
  r.onclick=e=>{e.stopPropagation();vib(12);fanClose(true);launch(t.id,pm());};f.appendChild(r);});
 const x=document.createElement('button');x.type='button';x.className='txx';x.setAttribute('aria-label',ar?'إغلاق':'Close');x.innerHTML='<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>';
 s.onclick=()=>fanClose();x.onclick=()=>{vib(8);fanClose();};
 document.body.appendChild(s);document.body.appendChild(f);document.body.appendChild(x);
 const r=b.getBoundingClientRect();
 f.style.setProperty('left',Math.max(8,r.left+(r.width-54)/2)+'px','important');f.style.right='auto';f.style.bottom=(innerHeight-r.top+16)+'px';
 x.style.left=(r.left+r.width/2-23)+'px';x.style.top=(r.top+r.height/2-23)+'px';
 open=[s,f,x];vib([14,24,10]);
 poll=setInterval(()=>{const v=document.getElementById('vHome');if(!v||!v.classList.contains('on'))fanClose(true)},250);}
const qb=document.getElementById('qrFab');
if(qb){window.__txQR=qb.onclick;qb.setAttribute('aria-label',A()?'أدوات':'Tools');qb.innerHTML='<svg viewBox="0 0 24 24">'+GRID+'</svg>';qb.onclick=fan;
 new MutationObserver(()=>qb.setAttribute('aria-label',A()?'أدوات':'Tools')).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});}
document.addEventListener('keydown',e=>{if(e.key==='Escape')fanClose()});
document.addEventListener('visibilitychange',()=>{if(document.hidden)fanClose(true)});
/* after capture: land in the tool's own step */
const _oc=openCrop;openCrop=async function(p,from){const r=await _oc.apply(this,arguments);const pd=window.__txPend;
 if(pd&&(pd.id==='card'||pd.id==='ph')&&from==='new')setTimeout(()=>{const b=document.getElementById('cropGo'),v=document.getElementById('vCrop');if(b&&v&&v.classList.contains('on')&&window.__txPend===pd)b.click();},380);return r;};
const _oe=openEdit;openEdit=async function(p,d,rb){const r=await _oe.apply(this,arguments);const pd=window.__txPend;
 if(pd&&(pd.id==='ocr'||pd.id==='book')&&p&&!pd.f[p.id]){pd.f[p.id]=1;setTimeout(()=>{const b=document.getElementById(pd.id==='ocr'?'ocrB':'bookB');if(b&&E.page===p)b.click();},420);}return r;};
function idTool(pd){
 const f=document.querySelector('.fab2[aria-label="ID"]');if(!f||!state.pages.length)return;f.click();
 const ov=document.getElementById('idOv');if(!ov)return;
 const th=()=>[...ov.querySelectorAll('.idt')],n=th().length,pick=i=>{const t=th()[i];if(t)t.click();};
 if(pd.id==='card'){pick(n-2);pick(n-1);}else{pick(n-1);const ch=ov.querySelectorAll('#iL .chip');if(ch[2])ch[2].click();}}
async function cardAuto(pd){
 try{idTool(pd);const ov=document.getElementById('idOv'),go=ov&&ov.querySelector('#iGo');if(!go)return;ov.style.visibility='hidden';const n0=state.pages.length;go.click();
  for(let k=0;k<100&&document.getElementById('idOv');k++)await sleep(100);
  const ov2=document.getElementById('idOv');if(ov2)ov2.style.visibility='';
  if(state.pages.length>n0)openSheet([state.pages.length-1],{fmt:'pdf',ps:'a4',file:Lg('بطاقة','ID card')+' '+defName().replace(/^\S+\s*/,'')});}catch(e){console.warn('cardAuto',e);}}
const _gh=goHome;goHome=function(fr){const r=_gh.apply(this,arguments);const pd=window.__txPend;
 if(pd&&!state.queue.length){window.__txPend=null;const add=state.pages.length-pd.start;
  if(pd.id==='card'&&pd.multi&&add>=2)setTimeout(()=>cardAuto(pd),300);
  else if(pd.id==='ph'&&add>=1)setTimeout(()=>idTool(pd),300);}
 return r;};
})();


/* ===== v147: modern update banner ===== */
(function(){
  if(!document.getElementById('upd147')){const st=document.createElement('style');st.id='upd147';st.textContent=`
html body .upd{all:unset;box-sizing:border-box;position:fixed;left:50%;top:calc(env(safe-area-inset-top,0px) + 10px);transform:translateX(-50%);z-index:9990;width:min(calc(100vw - 24px),400px);display:flex;align-items:center;gap:12px;padding:10px 10px 10px 14px;border-radius:20px;background:color-mix(in srgb,var(--surface,#0c1230) 82%,transparent);-webkit-backdrop-filter:blur(18px) saturate(1.4);backdrop-filter:blur(18px) saturate(1.4);border:1px solid color-mix(in srgb,var(--accent,#3b82f6) 45%,transparent);color:var(--ink,#fff);box-shadow:0 18px 40px -14px rgba(0,0,0,.65),0 0 0 1px rgba(255,255,255,.04) inset,0 0 26px -10px var(--accent,#3b82f6);cursor:pointer;-webkit-tap-highlight-color:transparent;animation:upd147in .55s cubic-bezier(.18,1,.3,1)}
html body .upd:active{transform:translateX(-50%) scale(.98)}
html body .upd .ui{flex:none;width:42px;height:42px;border-radius:14px;display:grid;place-items:center;background:linear-gradient(135deg,#1F6BFF,#8A56FF);box-shadow:0 6px 16px -6px rgba(90,100,255,.9)}
html body .upd .ui svg{width:22px;height:22px;fill:none;stroke:#fff;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
html body .upd .ut{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px;text-align:start}
html body .upd .ut b{font:800 14.5px/1.25 system-ui}
html body .upd .ut span{font:600 12px/1.3 system-ui;color:var(--ink2,#9aa4c7)}
html body .upd .ub{flex:none;height:36px;padding:0 16px;border-radius:12px;display:flex;align-items:center;background:linear-gradient(100deg,#1F6BFF,#8A56FF);color:#fff;font:800 13px system-ui;box-shadow:0 6px 14px -6px rgba(90,100,255,.9)}
html body .upd.busy{pointer-events:none}
html body .upd.busy .ui svg{animation:upd147spin 1s linear infinite}
html body .upd.busy .ub{opacity:.55}
@keyframes upd147in{from{opacity:0;transform:translate(-50%,-24px) scale(.96)}to{opacity:1;transform:translateX(-50%)}}
@keyframes upd147spin{to{transform:rotate(360deg)}}
@media (prefers-reduced-motion:reduce){html body .upd,html body .upd.busy .ui svg{animation:none}}
`;document.head.appendChild(st);}
  window.txUpdFill=function(b,busy){let ar=true;try{ar=!!AR();}catch(_){}
    const T=ar?['تحديث جديد متاح','اضغط لتطبيق آخر التحسينات','تحديث','جارٍ التحديث…','برجاء الانتظار']:['New update available','Tap to get the latest improvements','Update','Updating…','Please wait'];
    b.innerHTML='<span class="ui"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/></svg></span><span class="ut"><b>'+T[busy?3:0]+'</b><span>'+T[busy?4:1]+'</span></span>'+(busy?'':'<span class="ub">'+T[2]+'</span>');
    b.classList.toggle('busy',!!busy);b.setAttribute('role','button');};
})();

/* v148: center the selected thumbnail inside the strip ONLY (scrollIntoView also scrolled #app/body and pushed the whole screen sideways) */
function xCenter(){try{const st=$('#xPages'),on=st&&st.querySelector('.chip.on');if(!st||!on||!st.offsetWidth)return;
  const a=st.getBoundingClientRect(),b=on.getBoundingClientRect();st.scrollBy({left:(b.left+b.width/2)-(a.left+a.width/2),behavior:'auto'});}catch(_){}
  ['#app','#sheet'].forEach(q=>{const e=document.querySelector(q);if(e&&e.scrollLeft)e.scrollLeft=0;});
  const de=document.scrollingElement;if(de&&de.scrollLeft)de.scrollLeft=0;}
{const _os=openSheet;openSheet=function(){const r=_os.apply(this,arguments);setTimeout(xCenter,60);return r;};}
/* ===== v146: quick save icon + new save sheet (thumbnails, save-to-phone / share) ===== */
function xUi(){
  const m=X.mode||'all',n=state.pages.length;
  const fld=$('#xPgFld');if(!fld)return;fld.dataset.m=m;fld.hidden=n<2;
  const lab={all:Lg('كل الصفحات','All pages'),one:Lg('صفحة واحدة','One page'),pick:Lg('اختيار','Pick')};
  $$('#xMode button').forEach(b=>{b.textContent=lab[b.dataset.m];b.classList.toggle('on',b.dataset.m===m);});
  const adv=!$('#xAdv').hidden,ql={small:Lg('صغيرة','Small'),medium:Lg('متوسطة','Medium'),high:Lg('عالية','High')},wm=($('#xWm')||{}).value;
  const mb=$('#xMore');mb.innerHTML='<span class="xml">'+Lg('خيارات إضافية','More options')+'</span><span class="xms">'+Lg('الجودة: ','Quality: ')+ql[X.size]+(wm?' · '+Lg('علامة مائية','Watermark'):'')+'</span><svg class="i xch" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
  mb.setAttribute('aria-expanded',adv?'true':'false');mb.classList.toggle('open',adv);$('#xAdv').classList.toggle('open',adv);
  $('#xShLbl').textContent=Lg('مشاركة','Share');$('#xClose').setAttribute('aria-label',Lg('إغلاق','Close'));
  if(!X.busy)$('#xGoLbl').textContent=Lg('حفظ على الجهاز','Save to device')+(X.sel.size>1?' · '+X.sel.size:'');
  $('#xShare').disabled=!X.sel.size||X.busy;
}
(function(){
  if(!document.getElementById('qs146')){const st=document.createElement('style');st.id='qs146';st.textContent=`
html body #sheet{padding:6px 18px calc(env(safe-area-inset-bottom,0px) + 16px);border-radius:28px 28px 0 0}
html body #sheet .xhd{display:flex;align-items:center;justify-content:space-between;margin:2px 0 12px}
html body #sheet .xhd h2{margin:0;font-size:20px}
html body #sheet .xclose{width:36px;height:36px;border:0;border-radius:50%;background:var(--surface2);color:var(--ink2);display:grid;place-items:center;padding:0}
html body #sheet .xclose .i{width:18px;height:18px}
html body #sheet .fld{margin-bottom:12px;gap:8px}
html body #sheet .xmode,html body #sheet .xseg{display:flex;flex-wrap:nowrap;gap:4px;padding:4px;border-radius:14px;background:var(--surface2)}
html body #sheet .xmode button,html body #sheet .xseg .chip{flex:1 1 0;min-width:0;height:38px;padding:0 6px;border:0;border-radius:11px;background:transparent;color:var(--ink2);font-weight:700;font-size:13px;box-shadow:none;transition:background .15s,color .15s}
html body #sheet .xmode button.on,html body #sheet .xseg .chip.on{background:linear-gradient(100deg,#1F6BFF,#8A56FF);color:#fff;box-shadow:0 4px 12px -5px rgba(90,100,255,.9)}
html body #sheet .xseg .chip{white-space:nowrap}
html body #sheet #xPs .chip{flex:1 1 auto;padding:0 10px}
html body:has(.sheet.on) .fab2{opacity:0!important;pointer-events:none!important}
html body #sheet #xPgFld[data-m="all"] .xstrip{display:none}
html body #sheet .xstrip{display:flex;gap:10px;overflow-x:auto;padding:4px 2px 8px;scroll-snap-type:x proximity;-webkit-overflow-scrolling:touch}
html body #sheet .chip.xth{position:relative;flex:none;width:64px;height:86px;min-width:0;padding:0;border:2px solid transparent;border-radius:12px;overflow:hidden;background:var(--surface2);scroll-snap-align:center;box-shadow:none;opacity:.55;transition:opacity .15s,border-color .15s,transform .12s}
html body #sheet .chip.xth.on{opacity:1;border-color:var(--accent);background:var(--surface2);color:inherit;box-shadow:none}
html body #sheet .chip.xth:active{transform:scale(.94)}
html body #sheet .chip.xth img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
html body #sheet .chip.xth b{position:absolute;inset-inline-start:4px;bottom:4px;min-width:18px;height:18px;padding:0 5px;border-radius:9px;background:rgba(8,12,24,.72);color:#fff;font:700 11px/18px system-ui;text-align:center}
html body #sheet .chip.xth i{position:absolute;top:4px;inset-inline-end:4px;width:18px;height:18px;border-radius:50%;background:var(--accent);opacity:0;transform:scale(.5);transition:opacity .15s,transform .15s}
html body #sheet .chip.xth i::after{content:"";position:absolute;left:5px;top:3px;width:4px;height:8px;border:solid var(--accent-ink,#fff);border-width:0 2px 2px 0;transform:rotate(45deg)}
html body #sheet .chip.xth.on i{opacity:1;transform:none}
html body #sheet{--xl:color-mix(in srgb,var(--ink2) 22%,transparent)}
html body #sheet .fld>.l,html body #sheet .fld>label{font-size:12px;font-weight:800;letter-spacing:.2px;color:var(--ink2);opacity:.9}
html body #sheet .docname{height:46px;border-radius:14px;font-size:15px;font-weight:600}
html body #sheet .xmore{display:flex;align-items:center;gap:10px;width:100%;min-height:52px;margin:2px 0 10px;padding:0 14px;border:1px solid var(--xl);border-radius:16px;background:color-mix(in srgb,var(--surface2) 60%,transparent);color:var(--ink);text-align:start;cursor:pointer;transition:background .15s,border-color .15s}
html body #sheet .xmore:active{transform:scale(.99)}
html body #sheet .xmore .xml{font:800 14px system-ui;flex:none}
html body #sheet .xmore .xms{flex:1;min-width:0;font:600 12px system-ui;color:var(--ink2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;opacity:.85}
html body #sheet .xmore .xch{flex:none;width:26px;height:26px;padding:4px;border-radius:50%;background:var(--surface2);color:var(--ink);fill:none;stroke:currentColor;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round;transition:transform .25s,background .15s,color .15s}
html body #sheet .xmore.open{border-color:var(--accent);border-bottom-left-radius:0;border-bottom-right-radius:0;margin-bottom:0}
html body #sheet .xmore.open .xch{transform:rotate(180deg);background:var(--accent);color:var(--accent-ink,#fff)}
html body #sheet .xadv{margin:0 0 12px;padding:14px 12px 4px;border:1px solid var(--accent);border-top:0;border-radius:0 0 16px 16px;background:color-mix(in srgb,var(--surface2) 40%,transparent);animation:xin .2s ease-out}
html body #sheet .xadv .fld:last-child{margin-bottom:8px}
html body #sheet .xadv .chips:not(.xseg){display:flex;flex-wrap:wrap;gap:8px}
html body #sheet .xadv .chips:not(.xseg) .chip{height:36px;padding:0 14px;border-radius:12px;font-weight:700;font-size:13px}
html body #sheet .xadv .docname{height:42px}
html body #sheet #xEst{font-size:12px;color:var(--ink2);padding:0 4px}
html body #sheet .xact .savebtn{font-weight:800;box-shadow:0 10px 22px -10px rgba(90,100,255,.85)}
@keyframes xin{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){html body #sheet .xadv{animation:none}html body #sheet .xmore .xch{transition:none}}
html body #sheet .xadv[hidden]{display:none}
html body #app{overflow:clip}
html,body{overflow-x:clip}
html body #sheet{overflow-x:hidden}
html body #sheet>*{min-width:0;max-width:100%}
html body #sheet .fld{display:flex;flex-direction:column;min-width:0}
html body #sheet #xPgFld{display:block}
html body #sheet #xPgFld>.l{display:block;margin-bottom:8px}
html body #sheet .xstrip{width:100%;max-width:100%;min-width:0;box-sizing:border-box;overscroll-behavior-x:contain;scrollbar-width:none}
html body #sheet .xstrip::-webkit-scrollbar{display:none}
html body #sheet #xEst{display:flex;flex-wrap:wrap;gap:6px;min-width:0}
html body #sheet #xEst>*{max-width:100%}
html body #sheet .note{overflow-wrap:anywhere}
html body #sheet .note:empty{display:none}
html body #sheet #xEst{margin:0 0 10px;min-height:0}
html body #sheet .xact{display:grid;grid-template-columns:1fr auto;gap:10px}
html body #sheet .xact .btn{height:54px;border-radius:16px;font-size:16px;display:flex;align-items:center;justify-content:center;gap:8px}
html body #sheet .xact .xshare{padding:0 20px;background:var(--surface2);color:var(--ink);border:0;font-weight:700}
html body #sheet .xact .xshare:disabled,html body #sheet .xact .savebtn:disabled{opacity:.4}
html body #qsBtn{flex:none;width:40px;height:40px;border-radius:50%;display:grid;place-items:center;padding:0}
html body #qsBtn .i{width:20px;height:20px}
`;document.head.appendChild(st);}
  /* move the extra fields (quality, watermark, max size) under "More options" */
  {const adv=$('#xAdv');['xStamp','xLim'].forEach(id=>{const e=document.getElementById(id);if(e)adv.appendChild(e);});}
  $('#xMore').onclick=()=>{const a=$('#xAdv');a.hidden=!a.hidden;xUi();};
  $('#xClose').onclick=()=>{if(!X.busy)closeSheet();};
  $('#xMode').onclick=e=>{const b=e.target.closest('button');if(!b||X.busy)return;const m=b.dataset.m,prev=X.mode;
    if(m==='all')X.sel=new Set(state.pages.map((_,i)=>i));
    else if(m==='one'){const cur=E.page?state.pages.indexOf(E.page):-1,keep=prev==='pick'?[...X.sel].sort((a,b)=>a-b)[0]:undefined;X.sel=new Set([keep!==undefined?keep:(prev==='one'&&X.sel.size?[...X.sel][0]:(cur>=0?cur:state.pages.length-1))]);}
    X.mode=m;syncX();xCenter();};
  ['xFmt','xPs','xSize'].forEach(id=>$('#'+id).addEventListener('click',()=>{try{localStorage.setItem('tx_xfmt',X.fmt);localStorage.setItem('tx_xps',X.ps);localStorage.setItem('tx_xsz2',X.size);}catch(_){}}));
  $('#xGo').addEventListener('pointerdown',()=>{X.act='save';});
  $('#xShare').onclick=()=>{if(X.busy||!X.sel.size)return;X.act='share';$('#xGo').click();};
  $('#qsBtn').onclick=async()=>{const pg=E.page;if(!pg||X.busy)return;
    try{closeEditDocks();busy(true);await commitPage();}catch(e){console.error(e);}finally{busy(false);}
    const i=state.pages.indexOf(pg);if(i<0)return;openSheet([i]);};
  const ql=()=>{$('#qsBtn').setAttribute('aria-label',Lg('حفظ الصفحة دي','Save this page'));$('#qsBtn').title=Lg('حفظ الصفحة دي','Save this page');};ql();
  $('#langBtn').addEventListener('click',()=>setTimeout(()=>{ql();xUi();},60));
  $('#xWm')&&$('#xWm').addEventListener('input',()=>{try{xUi();}catch(_){}});
  xUi();
})();

})();
