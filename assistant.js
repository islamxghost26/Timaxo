/* assistant.js — مساعد الاقتراحات (المرحلة 3). كود أصلي للمشروع، قواعد + قياسات، محلي بالكامل بدون مكتبات.
   الفكرة: بياخد "بصمة" الصورة (نسبة الأبعاد، دوران الزوايا، وجه، كثافة نص، خطوط جدول، نص OCR)
   وبيرجّع اقتراح واحد بس في المرة (أو null). مبينفّذش حاجة بنفسه: الواجهة هي اللي بتنفّذ بعد موافقة المستخدم.
   الواجهة: TXA.enabled() / TXA.setEnabled(b) / TXA.suggest(sig,ctx) / TXA.dismiss(s) / TXA.accept(s) / TXA.resetLog()
   sig = {aspect, round, face, text, gridH, gridV, ocr}   ← كلها اختيارية؛ الناقص بيتحسب "غير معروف" مش صفر
   ctx = {mode:'doc'|'id'|'pg'|'tb', multi:bool, shots:[{t, sig}], now} */
(function(root){
'use strict';
const KEY_ON='tx_asst',KEY_LOG='tx_asst_log',DAY=864e5;
const cfg={minScore:.6,idAspect:1.586,idTol:.12,burstMs:25000,bgSame:.82,dismissBlockDays:30,dismissKindMax:3,logMax:60,
  tableMinH:3,tableMinV:2,faceMin:.5};
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const num=v=>typeof v==='number'&&isFinite(v);
const AR_DIG=/[٠-٩]/g,toEn=s=>s.replace(AR_DIG,d=>d.charCodeAt(0)-1632);

/* ---------- تخزين آمن (localStorage ممكن يفشل في وضع الخصوصية) ---------- */
function lsGet(k){try{return root.localStorage.getItem(k)}catch(e){return null}}
function lsSet(k,v){try{root.localStorage.setItem(k,v)}catch(e){}}
function enabled(){return lsGet(KEY_ON)!=='0'}
function setEnabled(b){lsSet(KEY_ON,b?'1':'0')}

/* ---------- سجل الاقتراحات (المقبولة والمرفوضة) ---------- */
function readLog(){try{const a=JSON.parse(lsGet(KEY_LOG)||'[]');return Array.isArray(a)?a:[]}catch(e){return[]}}
function writeLog(a){lsSet(KEY_LOG,JSON.stringify(a.slice(-cfg.logMax)))}
function resetLog(){lsSet(KEY_LOG,'[]')}
/* بصمة الاقتراح: النوع + شريحة نسبة الأبعاد (نفس الشكل تقريبًا = نفس البصمة) */
function fingerprint(kind,sig){const a=sig&&num(sig.aspect)?Math.round(Math.max(sig.aspect,1/sig.aspect)*10):0;return kind+':'+a}
function dismiss(s,now){if(!s)return;const a=readLog();a.push({k:s.kind,fp:s.fp,r:0,t:now||Date.now()});writeLog(a)}
function accept(s,now){if(!s)return;const a=readLog();a.push({k:s.kind,fp:s.fp,r:1,t:now||Date.now()});writeLog(a)}
/* ممنوع لو: نفس البصمة اترفضت في آخر 30 يوم، أو النوع اترفض 3 مرات في آخر 30 يوم */
function blocked(kind,fp,now){
  const lim=(now||Date.now())-cfg.dismissBlockDays*DAY,a=readLog().filter(e=>e.r===0&&e.t>=lim);
  return a.some(e=>e.fp===fp)||a.filter(e=>e.k===kind).length>=cfg.dismissKindMax;
}

/* ---------- أدوات قياس صغيرة (الواجهة بتحسب الأرقام الخام، وهنا التفسير) ---------- */
/* شكل 12×16 رمادي من RGBA → بصمة خلفية. similar() بيرجّع 0..1 (ارتباط مطبّع) */
function sigFromRGBA(rgba,w,h,gw,gh){gw=gw||16;gh=gh||12;const o=new Float32Array(gw*gh);
  for(let y=0;y<gh;y++)for(let x=0;x<gw;x++){const sx=Math.min(w-1,((x+.5)*w/gw)|0),sy=Math.min(h-1,((y+.5)*h/gh)|0),i=(sy*w+sx)*4;o[y*gw+x]=.299*rgba[i]+.587*rgba[i+1]+.114*rgba[i+2];}
  return o}
function similar(a,b){if(!a||!b||a.length!==b.length||!a.length)return 0;let ma=0,mb=0;const n=a.length;
  for(let i=0;i<n;i++){ma+=a[i];mb+=b[i];}ma/=n;mb/=n;let sab=0,saa=0,sbb=0;
  for(let i=0;i<n;i++){const x=a[i]-ma,y=b[i]-mb;sab+=x*y;saa+=x*x;sbb+=y*y;}
  if(saa<1e-6&&sbb<1e-6)return 1;if(saa<1e-6||sbb<1e-6)return 0;return clamp(sab/Math.sqrt(saa*sbb),0,1)}

/* ---------- قراءة نص OCR الخفيف: كلمات دالة (بطاقة/جدول) + أرقام ---------- */
function ocrHints(txt){
  if(!txt||typeof txt!=='string')return{id:0,table:0,known:false};
  const t=toEn(txt).toLowerCase();let id=0,table=0;
  if(/\b\d{14}\b/.test(t.replace(/[\s-]/g,'')))id+=.5;                       // رقم قومي 14 رقم
  if(/(بطاق|الرقم القومى|الرقم القومي|جمهورية|تحقيق شخصية|رخصة|id card|national id|passport|date of birth|dob)/.test(t))id+=.4;
  const lines=t.split(/\n+/).filter(l=>l.trim().length>1);
  if(lines.length>=3){const numRows=lines.filter(l=>(l.match(/\d+([.,]\d+)?/g)||[]).length>=2).length;
    if(numRows/lines.length>=.5)table+=.35;                                  // أغلب السطور فيها أرقام متعددة
    const seps=lines.filter(l=>/\s{2,}|\||\t|;/.test(l)).length;if(seps/lines.length>=.5)table+=.25;}
  if(/(الإجمالي|الاجمالي|المجموع|الكمية|السعر|total|qty|price|amount|subtotal)/.test(t))table+=.2;
  return{id:clamp(id,0,1),table:clamp(table,0,1),known:true};
}

/* ---------- القواعد: كل واحدة بترجّع درجة 0..1 وسبب ---------- */
function ruleId(s,c){
  if(c.mode==='id')return null;                                                // هو أصلًا في وضع البطاقة
  const parts=[],w=[];
  if(num(s.aspect)){const r=Math.max(s.aspect,1/s.aspect),d=Math.abs(r-cfg.idAspect)/cfg.idTol;
    if(d>1.6)return null;                                                      // النسبة بعيدة جدًا = مش بطاقة
    parts.push(clamp(1-d,0,1));w.push(.40);}else return null;
  if(num(s.round)){parts.push(clamp(s.round/.6,0,1));w.push(.20);}
  if(num(s.face)){parts.push(s.face>=cfg.faceMin?1:0);w.push(.25);}
  const oh=ocrHints(s.ocr);if(oh.known){parts.push(oh.id);w.push(.15);}
  if(num(s.text)){parts.push(s.text<=.95?1:.5);w.push(.08);}                      // كثافة النص تأثير خفيف بس: البطاقات الحقيقية طلعت 0.2–1.0 في القياس
  if(!((num(s.round)&&s.round>=.5)||(num(s.face)&&s.face>=cfg.faceMin)||oh.id>=.5))return null; // النسبة لوحدها مش كفاية (روشتة وعلبة منتج طلعوا 1.58): لازم دليل قوي تاني
  const sc=wavg(parts,w);
  const why=[];if(num(s.round)&&s.round>=.3)why.push('زوايا مدورة');if(num(s.face)&&s.face>=cfg.faceMin)why.push('صورة شخصية');why.unshift('مقاس بطاقة');
  return{kind:'id',score:sc,why:why.join(' + ')};
}
function ruleTable(s,c){
  if(c.mode==='tb')return null;
  const h=num(s.gridH)?s.gridH:0,v=num(s.gridV)?s.gridV:0;
  const gridOk=h>=cfg.tableMinH&&v>=cfg.tableMinV,oh=ocrHints(s.ocr);
  if(!gridOk&&oh.table<.5)return null;
  const g=gridOk?clamp(.62+.06*(h-cfg.tableMinH)+.06*(v-cfg.tableMinV),0,1):0;
  const sc=gridOk?clamp(g+.15*oh.table,0,1):clamp(oh.table,0,.85);        // الخطوط كفاية لوحدها، والـOCR بيقوّيها أو يكفي لوحده لو قوي
  return{kind:'table',score:sc,why:gridOk?'خطوط جدول ('+h+'×'+v+')':'أرقام مرتبة في صفوف'};
}
function ruleMulti(s,c){
  if(c.multi||c.mode==='pg')return null;                                        // الصفحات المتعددة شغّالة أصلًا
  const sh=(c.shots||[]).filter(x=>x&&num(x.t)).sort((a,b)=>a.t-b.t),now=c.now||Date.now();
  if(sh.length<2)return null;
  const last=sh[sh.length-1],prev=sh[sh.length-2],gap=last.t-prev.t;
  if(now-last.t>cfg.burstMs*2)return null;                                      // اللقطات قديمة
  const near=gap<=cfg.burstMs,simBg=(last.sig&&prev.sig)?similar(last.sig,prev.sig):0,same=simBg>=cfg.bgSame;
  if(!near&&!same)return null;
  const sc=clamp((near&&same?.9:.62)+(sh.length>=3?.08:0),0,1);               // واحد منهم يكفي، والاتنين أقوى
  return{kind:'multi',score:sc,why:(near?'لقطتين ورا بعض':'')+(near&&same?' + ':'')+(same?'نفس الخلفية':''),pages:sh.length};
}
function wavg(p,w){let a=0,b=0;for(let i=0;i<p.length;i++){a+=p[i]*w[i];b+=w[i];}return b?a/b:0}

/* ---------- الاقتراح النهائي: واحد بس، الأعلى درجة بعد استبعاد المرفوض ---------- */
const TXT={
  id:{ar:'ده شكله بطاقة — تفعّل وضع البطاقة؟',en:'Looks like an ID card — switch to ID mode?'},
  table:{ar:'ده شكله جدول — تفعّل وضع الجدول؟',en:'Looks like a table — switch to Table mode?'},
  multi:{ar:'صوّرت أكتر من صفحة — تفعّل وضع الصفحات المتعددة؟',en:'Several pages — turn on multi-page mode?'}  /* شريحة 3.5: الترتيب والترقيم والطباعة هتتضاف للنص ده لما تتنفّذ فعلًا */};
function suggest(sig,ctx){
  if(!enabled())return null;
  const s=sig||{},c=ctx||{},now=c.now||Date.now();
  const cands=[ruleId(s,c),ruleTable(s,c),ruleMulti(s,c)].filter(Boolean)
    .map(x=>{x.fp=fingerprint(x.kind,x.kind==='multi'?null:s);return x})
    .filter(x=>x.score>=cfg.minScore&&!blocked(x.kind,x.fp,now));
  if(!cands.length)return null;
  cands.sort((a,b)=>b.score-a.score);
  const b=cands[0];b.ar=TXT[b.kind].ar;b.en=TXT[b.kind].en;b.score=Math.round(b.score*100)/100;
  return b;
}

/* ---------- القياسات من الصورة (شريحة 3.2) — بتشتغل على RGBA بعد الـwarp، من غير DOM ---------- */
function gray(rgba,w,h,maxSide){const k=Math.min(1,maxSide/Math.max(w,h)),gw=Math.max(8,Math.round(w*k)),gh=Math.max(8,Math.round(h*k)),o=new Float32Array(gw*gh),cnt=new Float32Array(gw*gh);
  for(let y=0;y<h;y++){const gy=Math.min(gh-1,(y*k)|0);for(let x=0;x<w;x++){const gx=Math.min(gw-1,(x*k)|0),i=(y*w+x)*4,j=gy*gw+gx;o[j]+=.299*rgba[i]+.587*rgba[i+1]+.114*rgba[i+2];cnt[j]++;}}
  for(let j=0;j<o.length;j++)o[j]=cnt[j]?o[j]/cnt[j]:255;return{g:o,w:gw,h:gh}}
function boxBlurF(a,w,h,r){const t=new Float32Array(a.length),o=new Float32Array(a.length),n=2*r+1;
  for(let y=0;y<h;y++){let s=0;for(let x=-r;x<=r;x++)s+=a[y*w+clamp(x,0,w-1)];for(let x=0;x<w;x++){t[y*w+x]=s/n;s+=a[y*w+Math.min(w-1,x+r+1)]-a[y*w+Math.max(0,x-r)];}}
  for(let x=0;x<w;x++){let s=0;for(let y=-r;y<=r;y++)s+=t[clamp(y,0,h-1)*w+x];for(let y=0;y<h;y++){o[y*w+x]=s/n;s+=t[Math.min(h-1,y+r+1)*w+x]-t[Math.max(0,y-r)*w+x];}}
  return o}
/* خريطة الحبر: بكسل غامق نسبةً لمحيطه المحلي (بتشيل الظل والإضاءة) */
function inkMap(rgba,w,h){const G=gray(rgba,w,h,320),bg=boxBlurF(G.g,G.w,G.h,Math.max(6,Math.round(Math.min(G.w,G.h)/12))),m=new Uint8Array(G.g.length);
  for(let i=0;i<m.length;i++)m[i]=(bg[i]-G.g[i]>28&&bg[i]>60)?1:0;return{m,w:G.w,h:G.h}}
/* عدد الخطوط الطويلة المتصلة (مع سماح فجوة صغيرة)؛ الصفوف المتجاورة بتتحسب خط واحد */
function countLines(m,w,h,horiz){const L=horiz?h:w,len=horiz?w:h,need=len*.55,gapOk=2,hit=new Uint8Array(L);
  for(let a=0;a<L;a++){let best=0,run=0,gap=0;for(let b=0;b<len;b++){const v=horiz?m[a*w+b]:m[b*w+a];
      if(v){run+=1+gap;gap=0;if(run>best)best=run;}else if(run&&gap<gapOk)gap++;else{run=0;gap=0;}}
    if(best>=need)hit[a]=1;}
  let n=0,prev=0;for(let a=0;a<L;a++){if(hit[a]&&!prev)n++;prev=hit[a];}return n}
function textDensity(im){let s=0;for(let i=0;i<im.m.length;i++)s+=im.m[i];return clamp(s/im.m.length/.12,0,1)} // 0.12 حبر = صفحة كثيفة جدًا
/* دوران الزوايا: الـquad غالبًا طالع برّه البطاقة بكام بكسل (هامش خلفية)، فمنقيسش الركن نفسه.
   لكل ركن: مرجع = وسيط لون جوّه البطاقة (عمق 40–60% من النافذة)، وبعدين لكل صف B[j] = أول بكسل بيطابق المرجع (حد البطاقة).
   الركن المدوّر = حد بينزل من ≥20% من النافذة لحد ما يستقر، ومنحني (النزول السريع في الأول: نص النزول بيحصل في أول <40% من مداه).
   الحافة المايلة (خط مستقيم) والهامش الثابت والحبر القريب من الركن مش بيعدّوا. الناتج 0..1 = نسبة الأركان اللي عدّت. */
function median(a){a.sort((x,y)=>x-y);return a[a.length>>1]}
function cornerRound(rgba,w,h){const r=Math.max(8,Math.round(Math.min(w,h)*.09)),px=(x,y,c)=>rgba[(y*w+x)*4+c];
  if(w<r*6||h<r*6)return 0;
  const specs=[[0,0,1,1],[w-1,0,-1,1],[w-1,h-1,-1,-1],[0,h-1,1,-1]];let pass=0;
  for(const[cx,cy,dx,dy]of specs){
    const S=[[],[],[]];
    for(let t=r;t<r*3;t+=2)for(let u=Math.round(r*.4);u<=Math.round(r*.6);u+=2)for(const[x,y]of[[cx+dx*t,cy+dy*u],[cx+dx*u,cy+dy*t]])for(let c=0;c<3;c++)S[c].push(px(x,y,c));
    const ref=[median(S[0]),median(S[1]),median(S[2])],B=new Array(r);
    for(let j=0;j<r;j++){let n=0;while(n<r){const x=cx+dx*n,y=cy+dy*j;if(Math.abs(px(x,y,0)-ref[0])+Math.abs(px(x,y,1)-ref[1])+Math.abs(px(x,y,2)-ref[2])>70)n++;else break;}B[j]=n;}
    let js=-1;for(let j=0;j<r;j++)if(B[j]<r*.98){js=j;break;}
    if(js<0||js>r*.5)continue;
    const head=Math.max(B[js],B[Math.min(r-1,js+1)],B[Math.min(r-1,js+2)]),tail=(B[r-1]+B[r-2]+B[r-3])/3,hd=head-tail;
    if(hd<r*.2||head>r*.95||tail>r*.6)continue;
    let mono=true;for(let j=js+1;j<r;j++)if(B[j]>B[j-1]+Math.max(1,r*.06)){mono=false;break;}
    if(!mono)continue;
    let j50=-1,jend=-1;for(let j=js;j<r;j++){if(j50<0&&B[j]<=tail+.5*hd)j50=j;if(B[j]<=tail+.1*hd){jend=j;break;}}
    if(j50<0||jend<=js)continue;
    if((j50-js)<=.4*(jend-js))pass++;}
  return pass/4}
/* ---------- الوجه (شريحة 3.3) ----------
   مقدّر مؤقت أصلي (مش نموذج): أكبر كتلة جلد متصلة على صورة مصغّرة بشكل وجه (مساحة 2–35%، نسبة عرض/طول 0.55–1.5،
   امتلاء ≥50%، مش لازقة في 3 حواف) + ملامح غامقة جواها (عيون/فم). بيرجّع 0..1.
   الأدق لاحقًا: BlazeFace (Apache-2.0) عبر TXA.setFaceDetector(async (rgba,w,h)=>0..1) — القواعد مش بتتغيّر. */
function hueOf(r,g,b){const mx=Math.max(r,g,b),mn=Math.min(r,g,b),d=mx-mn;if(!d)return 0;let h=mx===r?((g-b)/d)%6:mx===g?(b-r)/d+2:(r-g)/d+4;h*=60;return h<0?h+360:h}
function faceScore(rgba,w,h){
  const G=96,k=Math.min(1,G/Math.max(w,h)),gw=Math.max(8,Math.round(w*k)),gh=Math.max(8,Math.round(h*k)),n=gw*gh,R=new Float32Array(n),Gc=new Float32Array(n),B=new Float32Array(n),c=new Float32Array(n);
  for(let y=0;y<h;y++){const gy=Math.min(gh-1,(y*k)|0);for(let x=0;x<w;x++){const j=gy*gw+Math.min(gw-1,(x*k)|0),i=(y*w+x)*4;R[j]+=rgba[i];Gc[j]+=rgba[i+1];B[j]+=rgba[i+2];c[j]++;}}
  const skin=new Uint8Array(n),L=new Float32Array(n);
  for(let j=0;j<n;j++){const q=c[j]||1,r=R[j]/q,g=Gc[j]/q,b=B[j]/q,mx=Math.max(r,g,b),sat=mx?(mx-Math.min(r,g,b))/mx:0,lum=.299*r+.587*g+.114*b;L[j]=lum;
    skin[j]=(hueOf(r,g,b)<45&&sat>.14&&sat<.7&&lum>60&&lum<235&&r>g&&g>=b*.9)?1:0;}
  const seen=new Uint8Array(n),st=[];let best=0;
  for(let s0=0;s0<n;s0++){if(!skin[s0]||seen[s0])continue;
    let area=0,x0=gw,x1=0,y0=gh,y1=0;st.length=0;st.push(s0);seen[s0]=1;const mem=[];
    while(st.length){const p=st.pop(),px=p%gw,py=(p/gw)|0;mem.push(p);area++;if(px<x0)x0=px;if(px>x1)x1=px;if(py<y0)y0=py;if(py>y1)y1=py;
      if(px>0&&skin[p-1]&&!seen[p-1]){seen[p-1]=1;st.push(p-1);}if(px<gw-1&&skin[p+1]&&!seen[p+1]){seen[p+1]=1;st.push(p+1);}
      if(py>0&&skin[p-gw]&&!seen[p-gw]){seen[p-gw]=1;st.push(p-gw);}if(py<gh-1&&skin[p+gw]&&!seen[p+gw]){seen[p+gw]=1;st.push(p+gw);}}
    const af=area/n,bw=x1-x0+1,bh=y1-y0+1,ratio=bw/bh,fill=area/(bw*bh);
    if(af<.02||af>.35||ratio<.55||ratio>1.5||fill<.5)continue;
    const edges=(x0===0)+(x1===gw-1)+(y0===0)+(y1===gh-1);if(edges>=3)continue;
    let dark=0,tot=0;for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const p=y*gw+x;tot++;if(!skin[p]&&L[p]<95)dark++;}
    const feat=Math.min(1,(dark/tot)/.06),shape=Math.min(1,fill/.7);
    best=Math.max(best,.35+.25*shape+.4*feat);}
  return Math.min(1,best)}
let faceDet=null;function setFaceDetector(fn){faceDet=typeof fn==='function'?fn:null}
async function face(rgba,w,h){if(faceDet){try{const v=await faceDet(rgba,w,h);if(num(v))return clamp(v,0,1)}catch(e){}}return faceScore(rgba,w,h)}

/* قياس كامل على RGBA (ناتج الـwarp): بيرجّع جزء من sig. الأبعاد aspect من أبعاد الصورة نفسها */
function measure(rgba,w,h){const im=inkMap(rgba,w,h);
  return{aspect:Math.max(w,h)/Math.max(1,Math.min(w,h)),round:cornerRound(rgba,w,h),text:textDensity(im),gridH:countLines(im.m,im.w,im.h,true),gridV:countLines(im.m,im.w,im.h,false)}}

/* ---------- لقطات الجلسة (في الذاكرة بس، مش بتتخزّن): بصمة + وقت كل لقطة، عشان اقتراح الصفحات المتعددة ---------- */
const shots=[];
function noteShot(sig,t){shots.push({t:t||Date.now(),sig:sig||null});if(shots.length>6)shots.shift()}
function recentShots(now,maxAge){const n=now||Date.now(),a=maxAge||180000;return shots.filter(x=>n-x.t<=a)}
function clearShots(){shots.length=0}

/* ---- ترتيب الصفحات بالأرقام (3.5ب): دوال نقية. pageNum بتقرا رقم الصفحة من نص OCR (آخر 3 سطور الأول ثم أول سطرين)،
   وorderPlan بتحسب الترتيب بس لو كل الصفحات مرقّمة وبدون تكرار وأي إجمالي مكتوب متطابق؛ غير كده بترجّع سبب ومفيش ترتيب. ---- */
function pageNum(text){
  if(!text)return null;
  const D={'٠':0,'١':1,'٢':2,'٣':3,'٤':4,'٥':5,'٦':6,'٧':7,'٨':8,'٩':9,'۰':0,'۱':1,'۲':2,'۳':3,'۴':4,'۵':5,'۶':6,'۷':7,'۸':8,'۹':9};
  const L=String(text).split(/\r?\n/).map(x=>x.replace(/[٠-٩۰-۹]/g,c=>D[c]).replace(/^[\s\-–—_.•·|()\[\]{}«»"'*~]+|[\s\-–—_.•·|()\[\]{}«»"'*~]+$/g,'').replace(/\s+/g,' ')).filter(Boolean);
  const SEP='(?:\\/|من|of)';
  const re=[new RegExp('^(\\d{1,3}) ?'+SEP+' ?(\\d{1,3})$','i'),new RegExp('^(?:صفحة|صفحه|ص|page|pg|p\\.?) ?(\\d{1,3})(?: ?'+SEP+' ?(\\d{1,3}))?$','i'),/^(\d{1,3})()$/];
  const pick=l=>{for(const r of re){const m=l.match(r);if(m){const n=+m[1],t=m[2]?+m[2]:0;if(n>=1&&(!t||n<=t))return{n,total:t};}}return null;};
  const cands=L.slice(-3).reverse().concat(L.slice(0,2));
  for(const l of cands){const r=pick(l);if(r)return r;}
  return null;
}
function orderPlan(items){
  const n=items.length,miss=[];items.forEach((x,i)=>{if(!x)miss.push(i)});
  if(miss.length)return{ok:false,reason:'missing',idx:miss};
  const seen={};for(const x of items){if(seen[x.n])return{ok:false,reason:'dup'};seen[x.n]=1;}
  const tot=items.map(x=>x.total).filter(Boolean);if(tot.some(t=>t!==tot[0]))return{ok:false,reason:'total'};
  const order=items.map((x,i)=>i).sort((a,b)=>items[a].n-items[b].n);
  return{ok:true,order,sorted:order.every((v,i)=>v===i)};
}
root.TXA={pageNum,orderPlan,noteShot,recentShots,clearShots,cfg,enabled,setEnabled,suggest,dismiss,accept,resetLog,readLog,sigFromRGBA,similar,ocrHints,fingerprint,measure,inkMap,countLines,textDensity,cornerRound,faceScore,face,setFaceDetector};
})(typeof window!=='undefined'?window:globalThis);
