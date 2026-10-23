
/* ===== PWA + productivity layer ===== */
(()=>{
const ar=()=>document.documentElement.lang==='ar'||document.documentElement.dir==='rtl';
const head=document.head;
const meta=(n,c)=>{const m=document.createElement('meta');m.name=n;m.content=c;head.appendChild(m);};
meta('theme-color','#000515');meta('apple-mobile-web-app-capable','yes');meta('mobile-web-app-capable','yes');
meta('apple-mobile-web-app-title','Timaxo Scan');meta('apple-mobile-web-app-status-bar-style','black-translucent');
const lk=(rel,href,extra)=>{const l=document.createElement('link');l.rel=rel;l.href=href;if(extra)l.sizes=extra;head.appendChild(l);return l;};
lk('icon','favicon.png?v=2');lk('apple-touch-icon','apple-touch-icon.png?v=2');
const hosted=location.protocol==='https:'&&!/claude|srcdoc/.test(location.hostname);
if(window.__TIMAXO_FILES__){}
else{try{const base=location.href.split('#')[0];
 const mf={name:'Timaxo Scan',short_name:'Timaxo',description:'Scan, enhance and export documents',start_url:base,scope:base,display:'standalone',orientation:'any',background_color:'#041044',theme_color:'#041044',icons:[{src:'data:image/png;base64,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',sizes:'180x180',type:'image/png',purpose:'any'}]};
 lk('manifest',URL.createObjectURL(new Blob([JSON.stringify(mf)],{type:'application/manifest+json'})));}catch(e){}}
if(window.__TIMAXO_FILES__&&'serviceWorker' in navigator){addEventListener('load',()=>{ /* safety: never register an empty/broken sw.js (a 0-byte worker silently replaces the good one and kills offline + updates) */
 fetch('sw.js',{cache:'no-store'}).then(r=>r.ok?r.text():'').then(t=>{if((t||'').indexOf('addEventListener')<0){console.warn('sw.js is empty or invalid, skipped');return;}return navigator.serviceWorker.register('sw.js');}).catch(()=>{});});}
// Install button
let dip=null;const top=document.querySelector('#vHome .top');
const standalone=matchMedia('(display-mode: standalone)').matches||navigator.standalone;
const ib=document.createElement('button');ib.className='inst';ib.hidden=true;
const setIb=()=>{ib.textContent=ar()?'ثبّت التطبيق':'Install app';};setIb();
const ios=/iphone|ipad|ipod/i.test(navigator.userAgent);
if(top&&!standalone){top.insertBefore(ib,document.getElementById('langBtn'));
 addEventListener('beforeinstallprompt',e=>{e.preventDefault();dip=e;ib.hidden=false;});
 if(ios)ib.hidden=false;
 ib.onclick=async()=>{if(dip){dip.prompt();await dip.userChoice;dip=null;ib.hidden=true;}
  else{const m=ar()?'من زر المشاركة اختر: إضافة إلى الشاشة الرئيسية':'Tap Share, then Add to Home Screen';const t=document.getElementById('toast');t.textContent=m;t.classList.add('on');setTimeout(()=>t.classList.remove('on'),3500);}};
 addEventListener('appinstalled',()=>{ib.hidden=true;});
 document.getElementById('langBtn')?.addEventListener('click',()=>setTimeout(setIb,50));}
// Haptics
/* ===== App-wide feedback: synthesized sounds + vibration (shares tx_snd with the camera; tx_hap = vibration) ===== */
const FX=(()=>{
 const rd=k=>{try{return localStorage.getItem(k)}catch(e){return null}},wr=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
 const snd=()=>rd('tx_snd')!=='0',hap=()=>rd('tx_hap')!=='0';
 let ac=null,lastT=0;
 const ctx=()=>{if(!ac){try{ac=new(window.AudioContext||window.webkitAudioContext)();}catch(e){}}if(ac&&ac.state==='suspended')ac.resume().catch(()=>{});return ac;};
 const tone=(f,d,t,vol,f2,at)=>{if(!snd())return;const a=ctx();if(!a)return;try{const o=a.createOscillator(),g=a.createGain(),n=a.currentTime+(at||0);o.type=t||'sine';o.frequency.setValueAtTime(f,n);if(f2)o.frequency.exponentialRampToValueAtTime(f2,n+d);g.gain.setValueAtTime(0.0001,n);g.gain.exponentialRampToValueAtTime(vol||.06,n+.006);g.gain.exponentialRampToValueAtTime(.0001,n+d);o.connect(g);g.connect(a.destination);o.start(n);o.stop(n+d+.03);}catch(e){}};
 const vib=p=>{if(!hap())return;try{navigator.vibrate&&navigator.vibrate(p)}catch(e){}};
 const K={
  tap:()=>{tone(1150,.03,'sine',.045);vib(7)},
  sel:()=>{tone(780,.05,'sine',.06,980);vib(9)},
  tick:()=>{tone(1500,.015,'sine',.025);vib(4)},
  ok:()=>{tone(660,.09,'sine',.08);tone(990,.14,'sine',.08,null,.08);vib([12,50,18])},
  err:()=>{tone(240,.16,'triangle',.09,150);vib([35,45,35])},
  del:()=>{tone(520,.12,'triangle',.07,260);vib(22)},
  note:()=>{tone(880,.07,'sine',.05);vib(8)}
 };
 const play=k=>{const n=performance.now();if(n-lastT<35&&k!=='ok'&&k!=='err')return;lastT=n;try{(K[k]||K.tap)()}catch(e){}};
 const mode=()=>snd()&&hap()?'all':hap()?'hap':'off';
 return{play,mode,tone,vib,snd,hap,warm:()=>{if(!ac&&snd()){try{ac=new(window.AudioContext||window.webkitAudioContext)();}catch(e){}}},set:m=>{wr('tx_snd',m==='all'?'1':'0');wr('tx_hap',m==='off'?'0':'1');}};
})();window.__txFX=FX;
window.TXFX=FX;
setTimeout(()=>{try{(window.requestIdleCallback||(f=>f()))(()=>FX.warm())}catch(e){}},2500); /* v159: تجهيز الصوت وقت الراحة عشان أول لمسة ماتتعلّقش */
const buzz=n=>FX.vib(n);
(()=>{ /* wiring */
 const OKB=new Set(['cropGo','doneBtn','xGo','iGo','nextBtn']),DELB=/^(delPg|clrBtn)$/;
 const clsOf=el=>{const id=el.id||'',c=el.className&&el.className.baseVal===undefined?String(el.className):'';
  if(DELB.test(id)||/\b(pgdel|del|trash)\b/.test(c))return'del';
  if(OKB.has(id))return'ok';
  if(/\b(tool|tab|chip|seg|flt|tgl|sw)\b/.test(c)||el.getAttribute('role')==='tab'||el.getAttribute('aria-pressed')!==null)return'sel';
  return'tap';};
 addEventListener('pointerdown',e=>{const t=e.target.closest&&e.target.closest('button,[role=button],[role=tab],.chip,.tool,.pg,.idt,label.sw,a.btn,summary');
  if(!t||t.disabled||t.closest('#lv,#qrOv'))return;if(t.dataset&&t.dataset.nofx!==undefined)return;
  const k=clsOf(t);if(k==='ok')return;FX.play(k);paintFx();},true);          /* 'ok' buttons play on click so a cancelled press stays silent */
 addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('button');if(!t||t.closest('#lv,#qrOv'))return;if(clsOf(t)==='ok')FX.play('ok');},true);
 let sl=0;addEventListener('input',e=>{const t=e.target;if(t&&t.type==='range'){const n=performance.now();if(n-sl>70){sl=n;FX.play('tick');}}},true);
 const tt=document.getElementById('toast');
 if(tt){let was=false;new MutationObserver(()=>{const on=tt.classList.contains('on');if(on&&!was){const m=tt.textContent||'';
   FX.play(/تعذّر|تعذر|فشل|مش |غير متاح|مفيش|خاطئ|failed|unavailable|not |can.?t|error|wrong|cannot/i.test(m)?'err':/اتصدّر|اتحفظ|حفظ|تمت|اتفعّل|اتلغى|جاهز|بدأت|saved|exported|done|ready|restored|started|enabled|removed/i.test(m)?'ok':'note');}was=on;}).observe(tt,{attributes:true,attributeFilter:['class']});}
 /* sound / vibration switch in the header */
 const lang=document.getElementById('langBtn');
 window.paintFx=function(){};if(false){const b=document.createElement('button');b.className='lang';b.id='fxBtn';b.dataset.nofx='';b.style.cssText='min-width:42px;display:grid;place-items:center;padding:0 10px';
  const IC={all:'<path d="M11 5L6 9H3v6h3l5 4zM16 9a4 4 0 0 1 0 6M19 7a7 7 0 0 1 0 10"/>',hap:'<rect x="8" y="3" width="8" height="18" rx="2"/><path d="M3 8v8M21 8v8M5.5 10.5v3M18.5 10.5v3"/>',off:'<path d="M11 5L6 9H3v6h3l5 4zM17 9l5 6M22 9l-5 6"/>'};
  const L={all:['صوت واهتزاز','Sound + vibration'],hap:['اهتزاز بس','Vibration only'],off:['صامت','Silent']};
  const isAr=()=>document.documentElement.lang==='ar'||document.documentElement.dir==='rtl';
  const paint=()=>{const m=FX.mode();b.innerHTML='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">'+IC[m]+'</svg>';b.setAttribute('aria-label',L[m][isAr()?0:1]);};
  window.paintFx=paint;paint();
  b.onclick=()=>{const o=['all','hap','off'],n=o[(o.indexOf(FX.mode())+1)%3];FX.set(n);paint();FX.play(n==='off'?'tap':'sel');
   const tm=document.getElementById('toast');if(tm){tm.textContent=L[n][isAr()?0:1];tm.classList.add('on');clearTimeout(window.__fxT);window.__fxT=setTimeout(()=>tm.classList.remove('on'),1400);}};
  lang.parentNode.insertBefore(b,lang);document.addEventListener('visibilitychange',paint);}
})();
function paintFx(){window.paintFx&&window.paintFx();}
// Drag & drop + paste (desktop PWA)
const gal=document.getElementById('galIn'),dz=document.getElementById('dropzone');
const feed=files=>{const imgs=[...files].filter(f=>f.type.startsWith('image/'));if(!imgs.length||!gal)return;
 const dt=new DataTransfer();imgs.forEach(f=>dt.items.add(f));gal.files=dt.files;gal.dispatchEvent(new Event('change',{bubbles:true}));};
const dtxt=()=>{const d=document.getElementById('dzTxt');if(d)d.textContent=ar()?'أفلت الصور هنا للمسح':'Drop images to scan';};
let dc=0;
addEventListener('dragenter',e=>{if(!e.dataTransfer?.types?.includes('Files'))return;e.preventDefault();dc++;dtxt();dz.classList.add('on');});
addEventListener('dragover',e=>e.preventDefault());
addEventListener('dragleave',()=>{dc=Math.max(0,dc-1);if(!dc)dz.classList.remove('on');});
addEventListener('drop',e=>{e.preventDefault();dc=0;dz.classList.remove('on');if(e.dataTransfer?.files?.length)feed(e.dataTransfer.files);});
addEventListener('paste',e=>{const fs=[...(e.clipboardData?.files||[])];if(fs.length)feed(fs);});
// Offline awareness
addEventListener('offline',()=>{const t=document.getElementById('toast');t.textContent=ar()?'أنت بدون إنترنت — التطبيق يعمل عادي':'Offline — everything still works';t.classList.add('on');setTimeout(()=>t.classList.remove('on'),2500);});
})();
