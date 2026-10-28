
(function(){var R=document.documentElement,t=0;
function open(){return!!document.querySelector('#mrBg.in,.txls,.mdl-bd,#scrim.on,.sheet.on,#txS,#qrOv,.txfan-open')||R.classList.contains('txfan-open')}
function off(){if(open()){t=setTimeout(off,900);return}t=0;R.classList.remove('txcalm')}
function calm(){if(!R.classList.contains('txcalm'))R.classList.add('txcalm');clearTimeout(t);t=setTimeout(off,1400)}
['pointerdown','touchstart','keydown'].forEach(function(e){addEventListener(e,calm,{capture:true,passive:true})});
addEventListener('scroll',calm,{capture:true,passive:true});
})();

/* ===== v206: "What's new" sheet — shows once after an update (signature upgrade) ===== */
(function(){
var KEY='tx_wn',VER='sig-1',AR=function(){return document.documentElement.lang!=='en';},L=function(a,b){return AR()?a:b;};
function seen(){try{return localStorage.getItem(KEY)===VER;}catch(e){return true;}}
function mark(){try{localStorage.setItem(KEY,VER);}catch(e){}}
var ic=function(p){return '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">'+p+'</svg>';};
var css='#wn{position:fixed;inset:0;z-index:9600;display:flex;align-items:flex-end;justify-content:center;background:rgba(6,12,30,.58);opacity:0;transition:opacity .24s;font-family:inherit;-webkit-tap-highlight-color:transparent}'
+'#wn.in{opacity:1}'
+'#wn .bx{width:100%;max-width:560px;max-height:92%;overflow-y:auto;overscroll-behavior:contain;background:var(--surface,#fff);color:var(--ink,#0F1A2B);border-radius:28px 28px 0 0;transform:translateY(46px);transition:transform .34s cubic-bezier(.2,.85,.25,1);padding-bottom:calc(14px + env(safe-area-inset-bottom,0px));box-shadow:0 -20px 50px -18px rgba(0,0,0,.6)}'
+'#wn.in .bx{transform:none}'
+'#wn .hero{position:relative;overflow:hidden;padding:12px 20px 20px;background:linear-gradient(150deg,var(--navy1,#0a1f6b),var(--navy2,#14409a));color:#fff}'
+'#wn .hd{width:42px;height:5px;border-radius:9px;background:rgba(255,255,255,.4);margin:0 auto 14px}'
+'#wn .bdg{display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:800;letter-spacing:.4px;padding:5px 11px;border-radius:99px;background:rgba(255,255,255,.18);backdrop-filter:blur(6px)}'
+'#wn .bdg i{width:7px;height:7px;border-radius:50%;background:#4ade80;box-shadow:0 0 0 4px rgba(74,222,128,.25)}'
+'#wn h2{margin:10px 0 4px;font-size:22px;font-weight:800;line-height:1.3}'
+'#wn .sub{margin:0;font-size:13.5px;opacity:.82;max-width:78%}'
+'#wn .sg{position:absolute;inset-inline-end:10px;top:46px;width:32%;height:auto;opacity:.85;pointer-events:none}'
+'#wn .sg path{fill:none;stroke:#7fb2ff;stroke-width:3.2;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:420;stroke-dashoffset:420;animation:wnd 1.6s .35s ease-out forwards}'
+'@keyframes wnd{to{stroke-dashoffset:0}}'
+'#wn .ls{padding:14px 14px 4px;display:grid;gap:10px}'
+'#wn .it{display:flex;align-items:center;gap:12px;padding:11px 12px;border-radius:18px;background:var(--bg,#EDEFF2);border:1px solid var(--line,#D2D8E0);opacity:0;transform:translateY(10px);animation:wni .4s ease-out forwards}'
+'#wn .it:nth-child(1){animation-delay:.12s}#wn .it:nth-child(2){animation-delay:.2s}#wn .it:nth-child(3){animation-delay:.28s}#wn .it:nth-child(4){animation-delay:.36s}'
+'@keyframes wni{to{opacity:1;transform:none}}'
+'#wn .ti{width:44px;height:44px;border-radius:14px;display:grid;place-items:center;color:#fff;flex:none;box-shadow:0 8px 16px -8px rgba(0,0,0,.5)}'
+'#wn .tx b{display:block;font-size:15px;font-weight:800}#wn .tx span{display:block;font-size:12.8px;opacity:.68;margin-top:2px;line-height:1.45}'
+'#wn .hw{margin:14px 14px 0;padding:12px;border-radius:18px;border:1px dashed var(--line,#D2D8E0)}'
+'#wn .hw h3{margin:0 0 10px;font-size:13px;font-weight:800;opacity:.7}'
+'#wn .st{display:flex;align-items:stretch;gap:6px}'
+'#wn .st div{flex:1;min-width:0;text-align:center;font-size:12.3px;font-weight:700;line-height:1.4}'
+'#wn .st em{display:grid;place-items:center;width:26px;height:26px;margin:0 auto 6px;border-radius:50%;background:var(--accent,#1B63F0);color:#fff;font-style:normal;font-size:13px;font-weight:800}'
+'#wn .ac{display:flex;flex-direction:column;gap:8px;padding:14px 14px 0}'
+'#wn .go{border:0;border-radius:16px;height:50px;font-weight:800;font-size:16px;font-family:inherit;color:#fff;background:linear-gradient(135deg,var(--accent,#1B63F0),#4a86ff);box-shadow:0 12px 26px -10px var(--accent,#1B63F0);cursor:pointer}'
+'#wn .go:active{transform:scale(.98)}'
+'#wn .ok{border:0;background:none;height:42px;font-weight:700;font-size:14px;font-family:inherit;color:inherit;opacity:.7;cursor:pointer}'
+'@media (prefers-reduced-motion:reduce){#wn,#wn .bx,#wn .it{transition:none;animation:none;opacity:1;transform:none}#wn .sg path{animation:none;stroke-dashoffset:0}}';
function build(){
 if(document.getElementById('wn'))return;
 var st=document.createElement('style');st.id='wnCss';if(!document.getElementById('wnCss'))document.head.appendChild(st),st.textContent=css;
 var items=[
  ['#e0245e','#ff6b9a',ic('<path d="M4 8a2 2 0 0 1 2-2h1.5l1.2-2h6.6l1.2 2H18a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="3.5"/>'),L('صوّر توقيعك','Photograph your signature'),L('نسخة نضيفة بخلفية شفافة من أي ورقة موقّعة','A clean, transparent copy from any signed paper')],
  ['#1b63f0','#5b9bff',ic('<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M7 14c1.2-3 2-3 3-1s2 2 3-1 2-1 4 0"/>'),L('٥ توقيعات جاهزة','5 ready signatures'),L('اختار واحد من الشريط واضغط على الصفحة فيتحط','Pick one from the bar, tap the page, done')],
  ['#d98a00','#ffc24a',ic('<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>'),L('ألوان أقلام حقيقية','Real pen colors'),L('أسود وكحلي وأزرق بيك وأحمر وأخضر، أو لون توقيعك الأصلي','Black, blue-black, ballpoint blue, red, green, or your original ink')],
  ['#7c4dff','#b28cff',ic('<path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 4v5h-5"/>'),L('تحريك ولف وتكبير','Move, rotate, resize'),L('اسحبه لأي مكان، والف بالمقبض الدايري أو الشريط في أي اتجاه','Drag anywhere, rotate with the round handle or slider')]
 ];
 var rows=items.map(function(i){return '<div class="it"><div class="ti" style="background:linear-gradient(135deg,'+i[0]+','+i[1]+')">'+i[2]+'</div><div class="tx"><b>'+i[3]+'</b><span>'+i[4]+'</span></div></div>';}).join('');
 var steps=[L('تعديل ← توقيع','Edit → Signature'),L('صوّر توقيعك أو ارسمه','Photograph or draw it'),L('اضغط على الصفحة لوضعه','Tap the page to place it')];
 var m=document.createElement('div');m.id='wn';m.setAttribute('role','dialog');m.setAttribute('aria-modal','true');
 m.innerHTML='<div class="bx"><div class="hero"><div class="hd"></div><span class="bdg"><i></i>'+L('تحديث جديد','NEW UPDATE')+'</span><h2>'+L('توقيعك بقى احترافي','Your signature, upgraded')+'</h2><p class="sub">'+L('وقّع على أي مستند في ثواني بتوقيعك الحقيقي','Sign any document in seconds with your real signature')+'</p>'
 +'<svg class="sg" viewBox="0 0 200 80" aria-hidden="true"><path d="M8 58c14-30 22-44 30-40s-10 40 6 38 16-34 28-30-4 30 10 28 22-26 34-22-2 22 10 22 28-14 66-18"/></svg></div>'
 +'<div class="ls">'+rows+'</div>'
 +'<div class="hw"><h3>'+L('إزاي تستخدمه','How to use it')+'</h3><div class="st">'+steps.map(function(t,k){return '<div><em>'+(AR()?['١','٢','٣'][k]:k+1)+'</em>'+t+'</div>';}).join('')+'</div></div>'
 +'<div class="ac"><button type="button" class="go" data-w="go">'+L('جرّبه الآن','Try it now')+'</button><button type="button" class="ok" data-w="ok">'+L('تمام، فهمت','Got it')+'</button></div></div>';
 document.body.appendChild(m);
 requestAnimationFrame(function(){requestAnimationFrame(function(){m.classList.add('in');});});
 var close=function(){mark();m.classList.remove('in');setTimeout(function(){m.remove();},280);document.removeEventListener('keydown',kd);};
 var kd=function(e){if(e.key==='Escape')close();};document.addEventListener('keydown',kd);
 m.onclick=function(e){if(e.target===m){close();return;}var b=e.target.closest('[data-w]');if(!b)return;
  if(b.dataset.w==='ok'){close();return;}
  close();setTimeout(tryIt,320);};
 var g=m.querySelector('.go');try{g.focus({preventScroll:true});}catch(e){}
}
function sleep(ms){return new Promise(function(r){setTimeout(r,ms);});}
async function tryIt(){
 try{
  var pg=(typeof state!=='undefined'&&state.pages)||[];
  if(!pg.length){if(typeof toast==='function')toast(L('صوّر أو استورد صفحة الأول، وبعدها جرّب التوقيع','Scan or import a page first, then try the signature'));return;}
  if(!document.querySelector('#vEdit.on'))await openEdit(pg[0],false);
  await sleep(160);var t=document.querySelector('.tab[data-tab="pMarkup"]');if(t)t.click();await sleep(240);
  var b=document.querySelector('#toolRow .tool[data-k="sign"]');if(b)b.click();
 }catch(e){}
}
function busy(){
 if(document.querySelector('.mdl-bd,#tg,#mrBg.in,#qrOv,#txS,#lv,#sgPad,#sgPh'))return true;
 try{var cx=innerWidth/2,ys=[innerHeight*.3,innerHeight*.5,innerHeight*.75];for(var q=0;q<ys.length;q++){var el=document.elementFromPoint(cx,ys[q]);while(el&&el!==document.body){if(el.id!=='wn'){var cs=getComputedStyle(el);if(cs.position==='fixed'){var r=el.getBoundingClientRect();if(r.width>=innerWidth*.9&&r.height>=innerHeight*.5&&(parseInt(cs.zIndex,10)||0)>=100)return true;}}el=el.parentElement;}}}catch(e){}
 return Array.prototype.some.call(document.body.children,function(e){return e.style&&e.style.zIndex==='99999'&&e.style.display==='flex';});
}
window.txWhatsNew=function(){build();};
if(!seen()){var n=0;setTimeout(function poll(){if(seen())return;if(++n>60)return;if(document.visibilityState!=='visible'||busy()){setTimeout(poll,900);return;}build();},1800);}
})();
