/* filters.js — فلاتر المرحلة 2 (كود أصلي للمشروع، بدون مكتبات خارجية)
   الفكرة: كل الفلاتر الجديدة بتبني على "حقل الإضاءة" (تقدير ورقة الخلفية بتمويه كبير ثم قسمة)،
   و smartPick بيحلّل الصورة (ألوان، حبر، ختم، صورة شخصية) ويرجّع الفلتر + سبب مختصر.
   الواجهة: TXF.IDS / TXF.has(id) / TXF.render(id, base, outRGBA) / TXF.analyze(base) / TXF.pick(base)
   base = ناتج makeBase في index.html: {w,h,src,norm,lo,hi,vivid,...} (src = RGBA الأصلية بعد الـwarp). */
(function(root){
'use strict';
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const sstep=(a,b,x)=>{const t=clamp((x-a)/(b-a),0,1);return t*t*(3-2*t);};
const PAPER=252; // مستوى الورق بعد إزالة الظل (مش 255 عشان نسيب مساحة للتوهج)

/* ---------- أدوات صغيرة ---------- */
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
const pctl=(arr,p)=>{const s=Float32Array.from(arr).sort();return s[clamp(Math.floor(s.length*p),0,s.length-1)];};

/* تكبير شبكة لبكسلات كاملة بالـbilinear */
function upsample(g,gw,gh,s,w,h){
  const o=new Float32Array(w*h),x0=new Int32Array(w),x1=new Int32Array(w),wx=new Float32Array(w);
  for(let x=0;x<w;x++){const fx=clamp((x+.5)/s-.5,0,gw-1);x0[x]=fx|0;x1[x]=Math.min(gw-1,x0[x]+1);wx[x]=fx-x0[x];}
  for(let y=0;y<h;y++){const fy=clamp((y+.5)/s-.5,0,gh-1),y0=fy|0,y1=Math.min(gh-1,y0+1),wy=fy-y0,r0=y0*gw,r1=y1*gw,ro=y*w;
    for(let x=0;x<w;x++){const a=x0[x],c=x1[x],fx=wx[x];o[ro+x]=(g[r0+a]*(1-fx)+g[r0+c]*fx)*(1-wy)+(g[r1+a]*(1-fx)+g[r1+c]*fx)*wy;}}
  return o;
}

/* ---------- حقل الإضاءة (بيتحسب مرة لكل base ويتخزّن عليه) ---------- */
function field(b){
  if(b._txf)return b._txf;
  const w=b.w,h=b.h,S=b.src,s=Math.max(2,Math.round(Math.max(w,h)/120)),gw=Math.ceil(w/s),gh=Math.ceil(h/s),G=gw*gh;
  const R=new Float32Array(G),Gc=new Float32Array(G),B=new Float32Array(G),cnt=new Float32Array(G),st=s>=6?2:1;
  for(let y=0;y<h;y+=st){const gy=((y/s)|0)*gw;for(let x=0;x<w;x+=st){const gi=gy+((x/s)|0),k=(y*w+x)*4;cnt[gi]++;R[gi]+=S[k];Gc[gi]+=S[k+1];B[gi]+=S[k+2];}}
  const L=new Float32Array(G);
  for(let i=0;i<G;i++){const n=Math.max(1,cnt[i]);R[i]/=n;Gc[i]/=n;B[i]/=n;L[i]=.299*R[i]+.587*Gc[i]+.114*B[i];}
  /* الحروف أصغر من الخلية: الـmax بيشيلها، والتمويه الكبير بيطلّع الإضاءة الناعمة (الظل) */
  let bg=maxFilter(L,gw,gh,2);const br=Math.max(2,Math.round(gw/12));bg=boxBlur(boxBlur(bg,gw,gh,br),gw,gh,br);
  /* لون الورقة: متوسط ألوان أفتح 40% من الخلايا */
  const th=pctl(L,.6);let pr=0,pg=0,pb=0,pn=0;
  for(let i=0;i<G;i++)if(L[i]>=th){pr+=R[i];pg+=Gc[i];pb+=B[i];pn++;}
  pn=Math.max(1,pn);pr/=pn;pg/=pn;pb/=pn;
  const pL=Math.max(1,.299*pr+.587*pg+.114*pb),mx=Math.max(pr,pg,pb),mn=Math.min(pr,pg,pb),psat=mx>0?(mx-mn)/mx:0;
  const tinted=psat>.2,paper=tinted?[pr/pL*PAPER,pg/pL*PAPER,pb/pL*PAPER].map(v=>Math.min(255,v)):[PAPER,PAPER,PAPER];
  const kg=new Float32Array(G);for(let i=0;i<G;i++)kg[i]=clamp(PAPER/Math.max(30,bg[i]),.75,3.2);
  const km=upsample(kg,gw,gh,s,w,h);
  /* مرجع الورقة المحلي (شبكة أدق، نافذة ~12px): بيفرّق بين الحبر الرفيع وظلال التجاعيد العريضة */
  const s2=Math.max(2,Math.round(Math.max(w,h)/300)),g2w=Math.ceil(w/s2),g2h=Math.ceil(h/s2),L2=new Float32Array(g2w*g2h),n2=new Float32Array(g2w*g2h);
  for(let y=0;y<h;y++){const gy=((y/s2)|0)*g2w;for(let x=0;x<w;x++){const gi=gy+((x/s2)|0),k=(y*w+x)*4;n2[gi]++;L2[gi]+=(.299*S[k]+.587*S[k+1]+.114*S[k+2])*km[y*w+x];}}
  for(let i=0;i<L2.length;i++)L2[i]=L2[i]/Math.max(1,n2[i])/PAPER;
  let rg=boxBlur(maxFilter(L2,g2w,g2h,3),g2w,g2h,2);for(let i=0;i<rg.length;i++)rg[i]=clamp(rg[i],.8,1.05);
  const ref=upsample(rg,g2w,g2h,s2,w,h);
  return(b._txf={gw,gh,s,bg,km,ref,paper,tinted,paperChroma:mx-mn,shadow:pctl(bg,.95)>0?(pctl(bg,.95)-pctl(bg,.05))/pctl(bg,.95):0});
}

/* ---------- الفلاتر ---------- */
/* أ) إزالة الظل فقط: نفس الألوان بس إضاءة متساوية */
function rDeshadow(b,o){
  const S=b.src,km=field(b).km,n=b.w*b.h;
  for(let p=0,i=0;p<n;p++,i+=4){const k=km[p];o[i]=Math.min(255,S[i]*k);o[i+1]=Math.min(255,S[i+1]*k);o[i+2]=Math.min(255,S[i+2]*k);o[i+3]=255;}
}
/* ب) توحيد الخلفية: بعد إزالة الظل، أي بكسل "ورق" يتسحب لنفس لون الورقة بنعومة. الألوان الباهتة (ختم خفيف) بتتحمي بالتشبّع */
function rFlat(b,o,ret){
  const S=b.src,F=field(b),km=F.km,n=b.w*b.h,P=F.paper,c0=F.paperChroma*(PAPER/Math.max(1,.299*P[0]+.587*P[1]+.114*P[2]));
  for(let p=0,i=0;p<n;p++,i+=4){const k=km[p],r=Math.min(255,S[i]*k),g=Math.min(255,S[i+1]*k),bl=Math.min(255,S[i+2]*k),L=.299*r+.587*g+.114*bl;
    const ce=Math.max(r,g,bl)-Math.min(r,g,bl)-c0;
    const t=sstep(.84,.96,L/PAPER)*(1-sstep(10,34,ce));
    o[i]=r+(P[0]-r)*t;o[i+1]=g+(P[1]-g)*t;o[i+2]=bl+(P[2]-bl)*t;o[i+3]=255;}
  return F;
}
/* ج) تقوية الحبر: الحبر المحايد (أسود/رمادي) يغمّق بقوة، واللون العالي (ختم/قلم ملوّن) يغمّق بلطف ويحافظ على لونه */
function rInk(b,o){
  const S=b.src,F=field(b),km=F.km,ref=F.ref,P=F.paper,n=b.w*b.h,c0=F.paperChroma;
  for(let p=0,i=0;p<n;p++,i+=4){let k=km[p],rf=ref[p],ar=clamp(1-S[i]*k/(P[0]*rf),0,1),ag=clamp(1-S[i+1]*k/(P[1]*rf),0,1),ab=clamp(1-S[i+2]*k/(P[2]*rf),0,1);const
      d=.299*ar+.587*ag+.114*ab,dn=Math.max(0,d-.035)/.965;
    if(dn<=0){o[i]=P[0];o[i+1]=P[1];o[i+2]=P[2];o[i+3]=255;continue;}               // ورق: لون موحّد
    const kc=sstep(.08,.3,d);ar=d+(ar-d)*kc;ag=d+(ag-d)*kc;ab=d+(ab-d)*kc;          // الصبغة بس للحبر الغامق (لون إضاءة دافئة ≠ حبر)
    const ce=(Math.max(ar,ag,ab)-Math.min(ar,ag,ab))*255,pr=sstep(22,70,ce);       // pr=1 → ختم/لون قوي محمي
    const fN=Math.min(1,1.25*Math.pow(dn,.75)),fP=Math.min(1,1.1*Math.pow(dn,.85)),g=(fN+(fP-fN)*pr)/Math.max(.02,d);
    o[i]=P[0]*(1-clamp(ar*g,0,1));o[i+1]=P[1]*(1-clamp(ag*g,0,1));o[i+2]=P[2]*(1-clamp(ab*g,0,1));o[i+3]=255;}
}
/* مستوى الإضاءة الرمادي (للطباعة وخط اليد): خلط اللوما مع أغمق قناة عشان الحبر الملوّن ما يضعفش */
function darkPlane(b){
  const S=b.src,F=field(b),km=F.km,ref=F.ref,P=F.paper,n=b.w*b.h,D=new Float32Array(n),q0=1/P[0],q1=1/P[1],q2=1/P[2];
  for(let p=0,i=0;p<n;p++,i+=4){const k=km[p],r=S[i]*k*q0,g=S[i+1]*k*q1,bl=S[i+2]*k*q2,L=.299*r+.587*g+.114*bl,m=Math.min(r,g,bl);D[p]=clamp(1-(.65*L+.35*m)/ref[p],0,1);}
  return D;
}
/* حدّة الخطوط الرفيعة: unsharp على الغامقية مع coring عشان الضوضاء ما تتضخمش */
function sharpen(D,w,h,amount,r){
  const bl=boxBlur(D,w,h,r),n=w*h;
  for(let p=0;p<n;p++){let df=D[p]-bl[p];const a=Math.abs(df);df=a<.015?0:df-(df>0?.015:-.015);D[p]=clamp(D[p]+amount*df,0,1);}
}
/* د) وضع الطباعة: تباين عالٍ، الورق أبيض صافي، والدرجات الرمادية الرفيعة محفوظة (منحنى gamma مش threshold) */
function rPrint(b,o){
  const w=b.w,h=b.h,n=w*h,D=darkPlane(b);
  sharpen(D,w,h,.7,Math.max(1,Math.round(Math.max(w,h)/900)));
  for(let p=0,i=0;p<n;p++,i+=4){const t=clamp((D[p]-.08)/(.5-.08),0,1),v=255*(1-Math.pow(t,.7));o[i]=o[i+1]=o[i+2]=v;o[i+3]=255;}
}
/* هـ) خط اليد: يرفع الخطوط الخفيفة (رصاص/حبر فاتح) من غير ما يقلبها أسود، ويحتفظ بلون القلم الأزرق/الأحمر */
function rHand(b,o){
  const S=b.src,F=field(b),km=F.km,ref=F.ref,P=F.paper,w=b.w,h=b.h,n=w*h,D=darkPlane(b);
  sharpen(D,w,h,.5,Math.max(1,Math.round(Math.max(w,h)/1100)));
  for(let p=0,i=0;p<n;p++,i+=4){const t=clamp((D[p]-.06)/(.40-.06),0,1);
    if(t<=0){o[i]=P[0];o[i+1]=P[1];o[i+2]=P[2];o[i+3]=255;continue;}
    const k=km[p],rf=ref[p];let ar=clamp(1-S[i]*k/(P[0]*rf),0,1),ag=clamp(1-S[i+1]*k/(P[1]*rf),0,1),ab=clamp(1-S[i+2]*k/(P[2]*rf),0,1);
    const dl=.299*ar+.587*ag+.114*ab,kc=sstep(.08,.3,dl);ar=dl+(ar-dl)*kc;ag=dl+(ag-dl)*kc;ab=dl+(ab-dl)*kc;
    const A=Math.pow(t,.6),g=Math.min(6,A/Math.max(.02,dl)); // نرفع كثافة الحبر مع الحفاظ على صبغته
    o[i]=P[0]*(1-clamp(ar*g,0,1));o[i+1]=P[1]*(1-clamp(ag*g,0,1));o[i+2]=P[2]*(1-clamp(ab*g,0,1));o[i+3]=255;}
}
/* و) وضع البطاقة: ألوان حقيقية، إضاءة متوازنة بلطف (مفيش ورقة بيضا نفرضها)، وحدّة للصورة الشخصية والنص الصغير */
function rCard(b,o){
  const S=b.src,F=field(b),km=F.km,w=b.w,h=b.h,n=w*h,Y=new Float32Array(n);
  const cf=1+.12;
  for(let p=0,i=0;p<n;p++,i+=4){const k=clamp(1+.55*(km[p]-1),.9,1.5);
    let r=S[i]*k,g=S[i+1]*k,bl=S[i+2]*k;
    r=clamp((r/255-.5)*cf+.5,0,1)*255;g=clamp((g/255-.5)*cf+.5,0,1)*255;bl=clamp((bl/255-.5)*cf+.5,0,1)*255;
    const l=.299*r+.587*g+.114*bl,sf=1.1;
    o[i]=l+(r-l)*sf;o[i+1]=l+(g-l)*sf;o[i+2]=l+(bl-l)*sf;o[i+3]=255;Y[p]=(.299*o[i]+.587*o[i+1]+.114*o[i+2])/255;}
  const bl=boxBlur(Y,w,h,Math.max(1,Math.round(Math.max(w,h)/700)));
  for(let p=0,i=0;p<n;p++,i+=4){let df=Y[p]-bl[p];const a=Math.abs(df);df=a<.012?0:(df-(df>0?.012:-.012));
    const add=clamp(.85*df*255,-60,60);o[i]=clamp(o[i]+add,0,255);o[i+1]=clamp(o[i+1]+add,0,255);o[i+2]=clamp(o[i+2]+add,0,255);}
}

/* ---------- تحليل الصورة (للاختيار التلقائي) ---------- */
/* نسخة صغيرة (≤256px) بمتوسط الكتل: بتتحسب كل المميزات عليها بسرعة */
function thumb(b,M){
  const cs=Math.max(1,Math.ceil(Math.max(b.w,b.h)/M)),tw=Math.floor(b.w/cs),th=Math.floor(b.h/cs),n=tw*th,S=b.src,w=b.w;
  const R=new Float32Array(n),G=new Float32Array(n),B=new Float32Array(n),inv=1/(cs*cs);
  for(let ty=0;ty<th;ty++)for(let tx=0;tx<tw;tx++){let r=0,g=0,bl=0;
    for(let y=0;y<cs;y++){let k=((ty*cs+y)*w+tx*cs)*4;for(let x=0;x<cs;x++,k+=4){r+=S[k];g+=S[k+1];bl+=S[k+2];}}
    const i=ty*tw+tx;R[i]=r*inv;G[i]=g*inv;B[i]=bl*inv;}
  return{tw,th,n,R,G,B};
}
function hueOf(r,g,b){const mx=Math.max(r,g,b),mn=Math.min(r,g,b),d=mx-mn;if(d<1)return 0;let h=mx===r?((g-b)/d)%6:mx===g?(b-r)/d+2:(r-g)/d+4;h*=60;return h<0?h+360:h;}
function analyze(b){
  const T=thumb(b,256),{tw,th,n,R,G,B}=T,L=new Float32Array(n);
  for(let i=0;i<n;i++)L[i]=.299*R[i]+.587*G[i]+.114*B[i];
  const bg=boxBlur(maxFilter(L,tw,th,3),tw,th,5),Tp=Math.max(40,pctl(bg,.9));
  const rel=new Float32Array(n),ch=new Float32Array(n),valid=new Uint8Array(n);let nv=0;
  for(let i=0;i<n;i++){const bb=Math.max(30,bg[i]);rel[i]=clamp(L[i]/bb,0,1.2);ch[i]=(Math.max(R[i],G[i],B[i])-Math.min(R[i],G[i],B[i]))*(Tp/bb);
    if(L[i]>22){valid[i]=1;nv++;}}
  nv=Math.max(1,nv);
  const pc=[];for(let i=0;i<n;i++)if(valid[i]&&rel[i]>.92)pc.push(ch[i]);pc.sort((a,c)=>a-c);const c0=pc.length?pc[pc.length>>1]:0;
  let paper=0,ink=0,dark=0,col=0,stamp=0,blue=0,photo=0,inkRelSum=0;const hh=new Float32Array(12);
  const BN=6,skinB=new Float32Array(BN*BN),totB=new Float32Array(BN*BN);
  for(let y=0;y<th;y++)for(let x=0;x<tw;x++){const i=y*tw+x;if(!valid[i])continue;
    const ce=ch[i]-c0,bi=Math.min(BN-1,(y*BN/th)|0)*BN+Math.min(BN-1,(x*BN/tw)|0);totB[bi]++;
    if(rel[i]>.88&&ce<22)paper++;
    if(rel[i]<.82){ink++;inkRelSum+=rel[i];}
    if(rel[i]<.55)dark++;
    if(ce>40)col++;
    if(ce>35&&rel[i]<.9){stamp++;hh[Math.min(11,(hueOf(R[i],G[i],B[i])/30)|0)]++;}
    if(ce>25&&rel[i]<.8){const hu=hueOf(R[i],G[i],B[i]);if(hu>190&&hu<265)blue++;}
    if(ce>45&&rel[i]>.25&&rel[i]<.95)photo++;
    const hu=hueOf(R[i],G[i],B[i]),mx=Math.max(R[i],G[i],B[i]),sat=mx>0?ch[i]/mx:0;
    if(hu<45&&sat>.14&&sat<.7&&L[i]>60&&L[i]<225&&R[i]>G[i]&&G[i]>=B[i]*.9&&rel[i]>.3&&rel[i]<.88)skinB[bi]++;}
  let skinMax=0,skinBlocks=0;for(let k=0;k<BN*BN;k++){const f=totB[k]?skinB[k]/totB[k]:0;if(f>skinMax)skinMax=f;if(f>.35)skinBlocks++;}
  let top2=0;for(let k=0;k<12;k++)top2=Math.max(top2,hh[k]+hh[(k+1)%12]);
  /* مميزات بالدقة الكاملة (كل بكسل تاني، من غير بناء مستوى كامل): قلب الحبر الغامق ولونه — بيفرّق مطبوع أسود عن قلم أزرق/رصاص */
  const F=field(b),S=b.src,km=F.km,ref=F.ref,P=F.paper,w=b.w;let ia=0,ic=0,icol=0;
  for(let y=0;y<b.h;y+=2)for(let x=0;x<w;x+=2){const p=y*w+x,i=p*4,rf=ref[p],k=km[p]/rf,ar=1-S[i]*k/P[0],ag=1-S[i+1]*k/P[1],ab=1-S[i+2]*k/P[2],
      L=.299*(1-ar)+.587*(1-ag)+.114*(1-ab),m=1-Math.max(ar,ag,ab),d=clamp(1-(.65*L+.35*m),0,1);
    if(d<=.18)continue;ia++;if(d<=.5)continue;ic++;if(Math.max(ar,ag,ab)-Math.min(ar,ag,ab)>.14)icol++;}
  const r=Math.max(b.w,b.h)/Math.max(1,Math.min(b.w,b.h));
  return{coreFrac:ia?ic/ia:0,coreColor:ic?icol/ic:0,paperFrac:paper/nv,inkFrac:ink/nv,darkRatio:ink?dark/ink:0,inkRel:ink?inkRelSum/ink:1,colFrac:col/nv,
    stampFrac:stamp/nv,stampHue:stamp?top2/stamp:0,bluePen:ink?blue/ink:0,photoFrac:photo/nv,skinMax,skinBlocks,
    aspect:r,cardLike:Math.abs(r-1.586)<.11||Math.abs(r-1.75)<.09,shadow:F.shadow,paperLum:Tp,tinted:F.tinted};
}


/* ---------- الاختيار التلقائي: قواعد مرتّبة على نتيجة التحليل (العتبات في TXF.cfg عشان تتظبط من غير لمس المنطق) ---------- */
const cfg={photoPaper:.6,photoCol:.08,darkBgPaper:.3,darkBgInk:.5,cardInk:.1,cardCol:.1,skinCard:.45,
  magicCol:.05,typedInk:.06,handColor:.28,handInk:.075,stamp:.004,markColor:.1,sparse:.02};
function pick(b){
  const f=analyze(b),c=cfg;let id,ar,en;
  const T=(i,a,e)=>{id=i;ar=a;en=e;};
  if(f.paperFrac<c.photoPaper&&(f.colFrac>c.photoCol||f.photoFrac>c.photoCol))T('original','صورة ملوّنة/منتج — من غير معالجة','Colour photo / product — left untouched');
  else if(f.paperFrac<c.darkBgPaper&&f.inkFrac>c.darkBgInk)T('card','خلفية غامقة — حفظ الألوان والحدّة','Dark background — colours and sharpness kept');
  else if(f.cardLike&&(f.inkFrac>c.cardInk||f.colFrac>c.cardCol||f.skinMax>c.skinCard))T('card',f.skinMax>c.skinCard||f.colFrac>c.cardCol?'بطاقة بصورة وألوان — حفظ الألوان وحدّة الصورة':'بطاقة — حفظ الألوان والحدّة',f.skinMax>c.skinCard||f.colFrac>c.cardCol?'Card with photo and colours — colours kept, photo sharpened':'Card — colours and sharpness kept');
  else if(f.colFrac>c.magicCol&&f.paperFrac>=c.photoPaper)T('magic','مستند ملوّن — حفظ الألوان','Colour document — colours kept');
  else if(f.inkFrac>=c.typedInk&&f.coreColor<c.handColor){
    if(f.stampFrac>c.stamp||f.coreColor>c.markColor)T('ink','نص مطبوع مع ختم/توقيع ملوّن — تقوية الحبر وحماية اللون','Printed text with a colour stamp/signature — stronger ink, colour protected');
    else T('print','نص مطبوع — تباين عالٍ للطباعة','Printed text — high contrast for printing');}
  else if(f.inkFrac<c.sparse)T('flat','صفحة شبه فاضية — توحيد الخلفية','Mostly blank page — even background');
  else if(f.inkFrac<c.handInk)T('hand','خط يد — رفع الخطوط الخفيفة وحفظ لون القلم','Handwriting — faint strokes lifted, pen colour kept');
  else T('auto','مستند عادي — تحسين تلقائي','Regular document — auto enhance');
  /* إضاءة ضعيفة: الفلاتر الجديدة بتعدّلها لوحدها، لكن الأصل/تلقائي/ألوان محتاجين رفع بسيط */
  const br=(id==='original'||id==='auto'||id==='magic')&&f.paperLum<95?Math.min(25,Math.round((110-f.paperLum)/2)):0;
  return{f:id,whyAr:ar,whyEn:en,br,ct:0,sat:0,feat:f};
}

const R={deshadow:rDeshadow,flat:rFlat,ink:rInk,print:rPrint,hand:rHand,card:rCard};
const TXF={IDS:Object.keys(R),field,analyze,pick,cfg,
  has:id=>Object.prototype.hasOwnProperty.call(R,id),
  render(id,b,o){R[id](b,o);}};

root.TXF=TXF;
if(typeof module!=='undefined')module.exports=TXF;
})(typeof window!=='undefined'?window:globalThis);
