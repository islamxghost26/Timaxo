/* v174: أيقونات أحدث + قوائم أسرع + زوم في الأماكن المفيدة بس + ثبات التطبيق بعد الرجوع من الخلفية */
(function(){'use strict';
var D=document;
/* ---------- 1) CSS ---------- */
var css=`
@keyframes txfade{from{opacity:0}}
@keyframes txsheet{0%{transform:translate3d(0,46px,0);opacity:.4}100%{transform:none;opacity:1}}
@keyframes txrise{from{transform:translate3d(0,14px,0);opacity:0}}
@keyframes txpop{0%{transform:scale(.86)}60%{transform:scale(1.08)}100%{transform:scale(1)}}
@keyframes txin{from{opacity:0;transform:translate3d(0,10px,0) scale(.97)}}
/* --- شريط أدوات الجدول: مربعات متدرجة + خطوط دقيقة + ثنائية اللون --- */
html .tbx .tbw-tl{--h:215;width:70px;min-height:68px;gap:6px;-webkit-tap-highlight-color:transparent}
html .tbx .tbw-tl[data-undo]{--h:262}html .tbx .tbw-tl[data-rc]{--h:188}
html .tbx .tbw-tl[data-ed="mr"],html .tbx .tbw-tl[data-ed="md"],html .tbx .tbw-tl[data-ed="un"]{--h:214}
html .tbx .tbw-tl[data-ed="b"]{--h:24}html .tbx .tbw-tl[data-ed="sz+"],html .tbx .tbw-tl[data-ed="sz-"]{--h:292}
html .tbx .tbw-tl[data-cp]{--h:336}html .tbx .tbw-tl[data-t="deep"]{--h:152}
html .tbx .tbw-tl svg,html .tbx .tbw-tl .tbw-t{width:44px;height:36px;padding:6px 11px;border-radius:14px;
 background:linear-gradient(150deg,hsl(var(--h) 95% 60%/.24),hsl(var(--h) 95% 52%/.09));
 box-shadow:inset 0 0 0 1px hsl(var(--h) 90% 60%/.28);
 stroke:hsl(var(--h) 82% 50%);color:hsl(var(--h) 82% 50%);stroke-width:1.7;
 transition:transform .22s cubic-bezier(.3,1.5,.5,1),background .2s,box-shadow .2s,stroke .15s,color .15s}
html .tbx .tbw-tl svg .d{fill:hsl(var(--h) 92% 58%/.26);stroke-width:1.6}
html .tbx .tbw-tl:active{transform:none}
html .tbx .tbw-tl:active svg,html .tbx .tbw-tl:active .tbw-t{background:linear-gradient(150deg,hsl(var(--h) 92% 62%),hsl(var(--h) 90% 46%));
 stroke:#fff;color:#fff;box-shadow:0 8px 16px -6px hsl(var(--h) 90% 45%/.8);transform:scale(1.12) translateY(-1px)}
html .tbx .tbw-tl:active svg .d{fill:rgba(255,255,255,.3)}
html .tbx .tbw-tl span{font:650 10.5px/1.15 system-ui;letter-spacing:.1px}
html .tbx .tbw-tl.pulse svg,html .tbx .tbw-tl.pulse .tbw-t{animation:txpop .32s ease-out}
html .tbx .tbw-exp,html .tbx .tbw-imp{transition:transform .2s cubic-bezier(.3,1.5,.5,1)}
html .tbx .tbw-exp:active,html .tbx .tbw-imp:active{transform:scale(.94)}
html .tbx .tbw-exp svg,html .tbx .tbw-imp svg{stroke-linecap:round;stroke-linejoin:round}
/* --- قايمة التصدير: ظهور سريع وسلس + أيقونات Word/Excel حقيقية الشكل --- */
html .tbx .tbw-ex:not([hidden]) .tbw-scrim{animation:txfade .2s ease both;-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px)}
html .tbx .tbw-ex:not([hidden]) .tbw-ep{animation:txsheet .34s cubic-bezier(.22,1.18,.36,1) both;will-change:transform,opacity;contain:layout paint}
html .tbx .tbw-ex:not([hidden]) .tbw-ep>*:not(.tbw-gr){animation:txrise .38s cubic-bezier(.2,.9,.3,1) both}
html .tbx .tbw-ex:not([hidden]) .tbw-ep>*:nth-child(3){animation-delay:.03s}
html .tbx .tbw-ex:not([hidden]) .tbw-ep>*:nth-child(4){animation-delay:.06s}
html .tbx .tbw-ex:not([hidden]) .tbw-ep>*:nth-child(5){animation-delay:.1s}
html .tbx .tbw-ex:not([hidden]) .tbw-ep>*:nth-child(6){animation-delay:.14s}
html .tbx .tbw-ex:not([hidden]) .tbw-ep>*:nth-child(7){animation-delay:.18s}
html .tbx .tbw-ec{transition:transform .2s cubic-bezier(.3,1.5,.5,1),box-shadow .2s;-webkit-tap-highlight-color:transparent}
html .tbx .tbw-ec:active{transform:scale(.95)}
html .tbx .tbw-ec i.mk,html .tbx .tbw-ec.x i.mk,html .tbx .tbw-ec.w i.mk,html .tbx .tbw-ec.c i.mk{background:none;box-shadow:none;width:58px;height:58px;border-radius:0}
html .tbx .tbw-ec i.mk svg{width:58px;height:58px;fill:initial;stroke:none;stroke-width:0;filter:drop-shadow(0 6px 7px rgba(0,0,0,.28));transition:transform .25s cubic-bezier(.3,1.6,.5,1)}
html .tbx .tbw-ec:active i.mk svg{transform:scale(.9) rotate(-4deg)}
html .tbx .tbw-ec.pri i{background:linear-gradient(150deg,rgba(255,255,255,.34),rgba(255,255,255,.12));box-shadow:inset 0 0 0 1px rgba(255,255,255,.35);width:50px;height:50px;border-radius:16px}
html .tbx .tbw-ec.pri i svg{stroke-width:1.7}html .tbx .tbw-ec.pri i svg .d{fill:rgba(255,255,255,.3)}
html .tbx .tbw-eg .tbw-ec{gap:8px;padding:12px 6px 11px}
html .tbx .tbw-er em{transition:background .2s,color .2s}
/* --- قايمة استخراج النص (.ox) --- */
html body .mdl.ox{animation:txsheet .36s cubic-bezier(.22,1.18,.36,1) both;will-change:transform;background:linear-gradient(180deg,color-mix(in srgb,var(--surface) 92%,var(--accent,#1b63f0)),var(--surface) 38%);box-shadow:0 -22px 60px -20px #000c,inset 0 1px 0 rgba(255,255,255,.08)}
html body .mdl.ox>*{animation:txrise .4s cubic-bezier(.2,.9,.3,1) both}
html body .mdl.ox>*:nth-child(3){animation-delay:.04s}html body .mdl.ox>*:nth-child(4){animation-delay:.08s}html body .mdl.ox>*:nth-child(5){animation-delay:.12s}html body .mdl.ox>*:nth-child(n+6){animation-delay:.16s}
html body .ox-ic{width:46px;height:46px;border-radius:16px;background:linear-gradient(145deg,#4f8dff,#7a5cff);box-shadow:0 10px 22px -8px rgba(99,102,241,.9),inset 0 1px 0 rgba(255,255,255,.35)}
html body .ox-ic svg{stroke-width:1.8}
html body .ox-chip{min-height:40px;border-width:1px;font-weight:750;transition:background .2s,border-color .2s,color .2s,transform .22s cubic-bezier(.3,1.5,.5,1),box-shadow .2s}
html body .ox-chip.on{background:linear-gradient(145deg,#4f93ff,#2f6df0);box-shadow:0 8px 18px -8px rgba(47,109,240,.9),inset 0 1px 0 rgba(255,255,255,.3)}
html body .ox-chip:not(.on):active{background:var(--surface2)}
html body .ox-b{height:30px;padding:0 12px;border-radius:15px;font-weight:750;box-shadow:inset 0 0 0 1px color-mix(in srgb,currentColor 18%,transparent)}
html body .ox-res>*:first-child,html body .ox-res .ocx,html body .ox-res textarea{border-radius:22px}
html body .ox-btn{border-radius:18px;height:54px;font-weight:800;gap:8px;position:relative;overflow:hidden;box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--line) 80%,transparent);transition:transform .22s cubic-bezier(.3,1.5,.5,1),box-shadow .2s}
html body .ox-btn:active{transform:scale(.94)}
html body .ox-btn svg{width:22px;height:22px;stroke-width:1.7;transition:transform .25s cubic-bezier(.3,1.6,.5,1)}
html body .ox-btn:active svg{transform:scale(1.18) rotate(-6deg)}
html body .ox-btn:not(.pri) svg{color:var(--accent,#3d8bff)}
html body .ox-btn.pri{background:linear-gradient(135deg,#1b63f0,#22a8f5);box-shadow:0 12px 26px -10px rgba(27,99,240,.95),inset 0 1px 0 rgba(255,255,255,.35)}
html body .ox-btn.pri::after{content:"";position:absolute;inset:0;background:linear-gradient(110deg,transparent 35%,rgba(255,255,255,.28) 50%,transparent 65%);transform:translateX(-120%);animation:txshine 3.2s ease-in-out 1s infinite}
@keyframes txshine{0%,60%{transform:translateX(-120%)}100%{transform:translateX(120%)}}
html body .ox-btn:not(.pri){flex-direction:column;gap:3px;font-size:12.5px;min-width:76px}
/* --- إصلاح: صف الحالة كان بيطلع بره الشاشة بالإنجليزي ويزحّف الصفحة لليسار --- */
html .tbx{overflow-x:clip;max-width:100%;min-width:0}
/* v180: زرار نسخ النص ما يتقصّش مع الإنجليزي */
html body .mdl.ox .ox-acts{gap:6px}
html body .mdl.ox .ox-acts .ox-btn.pri{flex:1 0 auto;min-width:0;padding:0 14px;font-size:15px;white-space:nowrap}
html body .mdl.ox .ox-acts .ox-btn.pri span{white-space:nowrap;overflow:visible}
html body .mdl.ox .ox-acts .ox-btn:not(.pri){flex:1 1 0;min-width:0;max-width:74px;font-size:10.5px}
/* v182: خطوط إضافية (بتتحمّل عند الاستخدام بس) */
@font-face{font-family:Almarai;src:url(fonts/Almarai-400.woff) format('woff');font-weight:400;font-display:swap}
@font-face{font-family:Almarai;src:url(fonts/Almarai-800.woff) format('woff');font-weight:600 900;font-display:swap}
@font-face{font-family:'IBM Plex Sans Arabic';src:url(fonts/IBMPlexArabic-400.woff) format('woff');font-weight:100 500;font-display:swap}
@font-face{font-family:'IBM Plex Sans Arabic';src:url(fonts/IBMPlexArabic-700.woff) format('woff');font-weight:600 900;font-display:swap}
@font-face{font-family:'Google Sans';src:url(fonts/GoogleSans-var.woff) format('woff');font-weight:400 700;font-display:swap}
@font-face{font-family:'General Sans';src:url(fonts/GeneralSans-var.woff) format('woff');font-weight:200 700;font-display:swap}
@font-face{font-family:'Clash Display';src:url(fonts/ClashDisplay-var.woff) format('woff');font-weight:200 700;font-display:swap}
@font-face{font-family:Satoshi;src:url(fonts/Satoshi-var.woff) format('woff');font-weight:300 900;font-display:swap}
@font-face{font-family:Polt;src:url(fonts/Polt-400.woff) format('woff');font-weight:100 500;font-display:swap}
@font-face{font-family:Polt;src:url(fonts/Polt-800.woff) format('woff');font-weight:600 900;font-display:swap}
/* v183: واجهة اختيار الخط والسمك والحجم والألوان والمزيد — شكل أحدث وتفاعلي */
html .txdock .txr2{padding:4px;gap:4px;border-radius:18px;background:var(--surface2)}
html .txdock .txr2 .txc{flex:1 0 auto;min-height:40px;border:0;border-radius:14px;background:transparent;color:var(--ink2);font:700 13px system-ui;transition:background .2s,color .2s,box-shadow .2s}
html .txdock .txr2 .txc.on{background:var(--surface);color:var(--ink);box-shadow:0 3px 12px -3px rgba(0,0,0,.5),inset 0 0 0 1.5px color-mix(in srgb,var(--accent,#1b63f0) 60%,transparent)}
html .txc .fai{font:800 12px/1 Georgia,serif;margin-inline-end:7px;padding:4px 6px;border-radius:8px;background:linear-gradient(135deg,#1b63f0,#22a8f5);color:#fff}
html .txpop{padding:12px 10px;gap:14px;border-radius:22px;box-shadow:0 18px 44px -10px #000c;max-height:min(340px,calc(var(--vvh,100vh) - var(--kb,0px) - 190px))}
html .fcards{display:flex;flex-direction:row;flex-wrap:nowrap;gap:9px;max-height:none;overflow-x:auto;overflow-y:hidden;scroll-snap-type:x proximity;padding:8px 14px 12px;margin:0 -10px;width:auto;scrollbar-width:none;overscroll-behavior-x:contain;-webkit-mask-image:linear-gradient(90deg,transparent,#000 14px,#000 calc(100% - 14px),transparent);mask-image:linear-gradient(90deg,transparent,#000 14px,#000 calc(100% - 14px),transparent)}
html .fcards::-webkit-scrollbar{display:none}
html .fcard{flex:0 0 108px;scroll-snap-align:center;min-height:90px;gap:5px;padding:10px 6px;border:0;border-radius:22px;background:linear-gradient(160deg,var(--surface2),color-mix(in srgb,var(--surface2) 60%,transparent));box-shadow:inset 0 0 0 1px var(--line);transition:transform .3s cubic-bezier(.3,1.5,.5,1),box-shadow .25s,background .25s}
html .fcard .fs{font-size:30px;line-height:1.25}
html .fcard .fn{font:700 11px system-ui,sans-serif;opacity:.85}
html .fcard.on{transform:translateY(-3px) scale(1.06);background:linear-gradient(160deg,color-mix(in srgb,var(--accent,#1b63f0) 30%,transparent),color-mix(in srgb,var(--accent,#1b63f0) 9%,transparent));box-shadow:inset 0 0 0 1.6px var(--accent,#1b63f0),0 12px 24px -12px var(--accent,#1b63f0)}
html .fcards .fgrp{flex:0 0 auto;align-self:center;grid-column:auto;writing-mode:vertical-rl;transform:rotate(180deg);padding:12px 6px;border-radius:99px;background:var(--surface2);font:800 10px/1 system-ui,sans-serif;letter-spacing:.08em;color:var(--ink2);text-transform:uppercase;white-space:nowrap}
html .wseg{padding:4px;gap:3px;border-radius:16px}
html .wseg button{min-height:42px;border-radius:12px;font-size:14px;transition:background .2s,color .2s,box-shadow .2s}
html .wseg button.on{background:linear-gradient(135deg,var(--accent,#1b63f0),#22a8f5);color:#fff;box-shadow:0 8px 18px -8px var(--accent,#1b63f0)}
html .txpop .tfs,html #tfRow .tfs{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:12px;font:700 13px system-ui;color:var(--ink2)}
html .tfs input[type=range]{-webkit-appearance:none;appearance:none;width:100%;height:32px;background:transparent;margin:0;--p:50%}
html .tfs input[type=range]::-webkit-slider-runnable-track{height:8px;border-radius:99px;background:linear-gradient(90deg,var(--accent,#1b63f0) 0 var(--p),var(--surface2) var(--p) 100%)}
html .tfs input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:26px;height:26px;margin-top:-9px;border-radius:50%;background:#fff;border:0;box-shadow:0 3px 10px rgba(0,0,0,.5),0 0 0 5px color-mix(in srgb,var(--accent,#1b63f0) 30%,transparent);transition:transform .15s}
html .tfs input[type=range]:active::-webkit-slider-thumb{transform:scale(1.15)}
html .tfs input[type=range]::-moz-range-track{height:8px;border-radius:99px;background:var(--surface2)}
html .tfs input[type=range]::-moz-range-progress{height:8px;border-radius:99px;background:var(--accent,#1b63f0)}
html .tfs input[type=range]::-moz-range-thumb{width:24px;height:24px;border:0;border-radius:50%;background:#fff;box-shadow:0 3px 10px rgba(0,0,0,.5)}
html .tfs .tfo{min-width:48px;text-align:center;padding:6px 9px;border-radius:11px;background:var(--surface2);color:var(--ink);font:800 12.5px system-ui;font-variant-numeric:tabular-nums}
html .cg{padding:12px;border-radius:18px;background:color-mix(in srgb,var(--surface2) 65%,transparent)}
html .cgs{display:flex;flex-wrap:wrap;gap:10px;padding-top:10px}
html .sw2{width:38px;height:38px;border:0;box-shadow:inset 0 0 0 1.5px rgba(128,128,128,.5);transition:transform .15s,box-shadow .15s}
html .sw2:active{transform:scale(.92)}
html .sw2.on{box-shadow:0 0 0 2.5px var(--surface),0 0 0 5px var(--accent,#1b63f0)}
html .mdl-seg{padding:4px;border-radius:15px}
html .mdl-seg button.on{background:var(--accent,#1b63f0);color:#fff;box-shadow:0 6px 14px -6px var(--accent,#1b63f0)}
html .txdock textarea{transition:font-family .15s}
html .ox-menu{padding:8px;border-radius:26px;background:color-mix(in srgb,var(--surface) 94%,transparent);-webkit-backdrop-filter:blur(18px) saturate(1.4);backdrop-filter:blur(18px) saturate(1.4);border:1px solid var(--line);box-shadow:0 26px 60px -14px #000d}
html .ox-mi{display:flex;align-items:center;gap:12px;width:100%;min-height:56px;padding:8px 12px;border-radius:18px;background:transparent;color:var(--ink);font:700 15px system-ui,sans-serif;text-align:start;transition:background .15s,transform .15s}
html .ox-mi:active{background:color-mix(in srgb,var(--accent,#1b63f0) 14%,transparent);transform:scale(.985)}
html .ox-mi>svg{flex:none;width:40px;height:40px;padding:10px;border-radius:13px;background:color-mix(in srgb,var(--accent,#1b63f0) 16%,transparent);color:var(--accent,#1b63f0);stroke:currentColor}
html .ox-mi>span{flex:1;min-width:0}
html .ox-mi small{margin-inline-start:auto;font:600 11.5px system-ui,sans-serif;color:var(--ink2)}
html .ox-ms{height:1px;margin:6px 12px;background:var(--line)}
html .tbx .tbw-st{flex-wrap:wrap;row-gap:8px;min-width:0;max-width:100%;overflow:hidden}
html .tbx .tbw-st>*{min-width:0;max-width:100%}
html .tbx .tbw-imp{max-width:100%;white-space:nowrap}
/* v177: صف الحالة سطر واحد متناسق: [دقة] [عدّاد] ........ [زرار تحسين دائري] */
html .tbx .tbw-st{display:flex;flex-wrap:nowrap;align-items:center;gap:8px;overflow:visible}
html .tbx .tbw-st>.tbw-q{flex:0 0 auto;white-space:nowrap}
html .tbx .tbw-st>.tbw-sz{flex:1 1 0;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;opacity:.85;font-weight:700}
html .tbx .tbw-st>.tbw-imp{flex:0 0 auto;width:auto;height:34px;padding:0 13px 0 11px;gap:6px;border-radius:17px;margin-inline-start:auto;max-width:none;white-space:nowrap;border:1px solid color-mix(in srgb,var(--accent,#1b63f0) 45%,transparent);background:color-mix(in srgb,var(--accent,#1b63f0) 20%,transparent)}
html .tbx .tbw-st>.tbw-imp svg{width:17px;height:17px}
html .tbx .tbw-st>.tbw-imp>span{position:static;width:auto;height:auto;clip:auto;overflow:visible}
@media(max-width:350px){html .tbx .tbw-st>.tbw-sz{font-size:11.5px}html .tbx .tbw-st>.tbw-q{padding:0 9px}}
html .tbx .tbw-bar{min-width:0;max-width:100%;overflow:hidden}
html .tbx .tbw-bar>*{min-width:0}
/* --- القوائم العامة: ظهور أخف --- */
#mrBx{animation:txin .26s cubic-bezier(.2,1,.3,1) both}
/* --- أيقونات الشريط الرئيسي: ألوان وتفاعل --- */
html body .tool svg.i{stroke-width:1.65;transition:transform .22s cubic-bezier(.3,1.5,.5,1),filter .2s}
html body .tool:active svg.i{transform:scale(.84)}
html body .tool.on svg.i,html body .tool[aria-pressed="true"] svg.i{filter:drop-shadow(0 3px 6px color-mix(in srgb,var(--accent,#1b63f0) 55%,transparent))}
html body .pa svg.i,html body .ox-btn svg{transition:transform .2s cubic-bezier(.3,1.5,.5,1)}
html body .pa:active svg.i,html body .ox-btn:active svg{transform:scale(.86)}
/* --- التطبيق مش صفحة ويب: مفيش تحديد أو تكبير عشوائي --- */
html,body{touch-action:pan-x pan-y;-webkit-touch-callout:none}
#wrap,#ov,#cropSvg,#ltO,#lv{touch-action:none}
@media (prefers-reduced-motion:reduce){html .tbx *{animation-duration:.01s!important}}
`;
var st=D.createElement('style');st.id='v174-css';st.textContent=css;D.head.appendChild(st);

/* ---------- 2) زوم: ممنوع إلا في أماكن الزوم الحقيقية ---------- */
var OK='#wrap,#ov,#cropSvg,#ltO,#lv,.tbx-w,#tbSrcW,[data-zoomok]';
['gesturestart','gesturechange','gestureend'].forEach(function(n){D.addEventListener(n,function(e){if(!(e.target.closest&&e.target.closest(OK)))e.preventDefault();},{passive:false});});
D.addEventListener('touchmove',function(e){if(e.touches&&e.touches.length>1&&!(e.target.closest&&e.target.closest(OK)))e.preventDefault();},{passive:false});
/* مفيش منع للضغطتين: touch-action كفاية ومايبوّظش الضغطتين السريعتين في الجدول */

/* لو الصفحة اتزحزحت أفقيًا (scrollIntoView) نرجّعها */
D.addEventListener('scroll',function(e){var t=e.target;if(t&&t.classList&&t.classList.contains&&(t.matches('.mdl,.tbx,.sheet')||t===D.documentElement||t===D.body)&&t.scrollLeft!==0&&!t.matches('.tbw-tools,.tbw-tb'))t.scrollLeft=0;},true);
/* ---------- 3) نبضة على زر الأداة بعد الضغط ---------- */
D.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('.tbx .tbw-tl');if(!b)return;b.classList.remove('pulse');void b.offsetWidth;b.classList.add('pulse');setTimeout(function(){b.classList.remove('pulse')},360);},true);

/* ---------- 4) ثبات التطبيق: تحرير الذاكرة في الخلفية + رجوع آمن ---------- */
var freeT=0,hidAt=0;
D.addEventListener('visibilitychange',function(){
 if(D.hidden){hidAt=Date.now();clearTimeout(freeT);
  freeT=setTimeout(function(){try{if(D.hidden&&window.__txFreeOcr)window.__txFreeOcr();}catch(_){}},5000);
 }else{clearTimeout(freeT);
  if(hidAt&&Date.now()-hidAt>1500)setTimeout(healthCheck,350);
 }});
addEventListener('pageshow',function(e){if(e.persisted)setTimeout(healthCheck,250);});
function healthCheck(){try{
 var ok=D.body&&D.getElementById('vHome')&&D.body.childElementCount>3;
 if(!ok){var k='tx174_rl',n=+sessionStorage.getItem(k)||0;if(n<2){sessionStorage.setItem(k,String(n+1));location.reload();}}
 else{try{sessionStorage.removeItem('tx174_rl');}catch(_){}}
}catch(_){}}
addEventListener('error',function(e){/* خطأ صامت في ملف خارجي مايوقفش التطبيق */if(e&&/Script error|ResizeObserver/i.test(e.message||''))e.preventDefault&&e.preventDefault();});
})();

/* ===== v177: شاشة اختيار اللغة أول فتح ===== */
(function(){
var R=document.documentElement,LS=null;try{LS=localStorage}catch(_){}
function done(){try{return LS&&LS.getItem('tx-lang-chosen')==='1'}catch(_){return true}}
function apply(k){
 try{if(window.TXMSA){TXMSA.set(k==='sa');/* عربي: اللغة المختارة + English في الاختصار. English: اختصار مختصر (English + عربي) والباقي من الإعدادات */TXMSA.setQuick(k==='en'?['en','ar']:[k,'en']);}}catch(_){}
 var lb=document.getElementById('langBtn');if(lb&&(k==='en')!==(R.lang==='en'))lb.click();
 try{LS.setItem('tx-lang-chosen','1')}catch(_){}
}

/* الشاشة بتتسحب جوه أيقونة اللغة (الكرة الأرضية) بحركة سلسة */
function suck(o,st){
 function fin(){try{o.remove();st.remove()}catch(_){}}
 var g=document.getElementById('globeBtn'),r=g&&g.getBoundingClientRect(),red=matchMedia('(prefers-reduced-motion:reduce)').matches;
 if(!g||!r||!r.width||!o.animate||red){o.classList.add('out');setTimeout(fin,300);return}
 var gx=r.left+r.width/2,gy=r.top+r.height/2,W=innerWidth,H=innerHeight,E='cubic-bezier(.65,0,.3,1)',D=640;
 o.style.animation='none';o.style.willChange='clip-path,opacity';
 var rad=Math.ceil(Math.hypot(Math.max(gx,W-gx),Math.max(gy,H-gy)))+20;
 var bg=o.animate([{clipPath:'circle('+rad+'px at '+gx+'px '+gy+'px)'},{clipPath:'circle('+(r.width/2)+'px at '+gx+'px '+gy+'px)'}],{duration:D,easing:E,fill:'forwards'});
 var kids=[].slice.call(o.querySelectorAll('.hd,.it,.ft'));
 kids.forEach(function(k,i){var c=k.getBoundingClientRect(),dx=gx-(c.left+c.width/2),dy=gy-(c.top+c.height/2);
  k.style.willChange='transform,opacity';
  k.animate([{transform:'none',opacity:1,filter:'blur(0)'},{transform:'translate('+dx+'px,'+dy+'px) scale(.08)',opacity:0,filter:'blur(3px)'}],{duration:D-i*30,delay:i*35,easing:E,fill:'forwards'})});
 bg.onfinish=function(){
  fin();
  try{g.animate([{transform:'scale(1)'},{transform:'scale(1.38)',offset:.4},{transform:'scale(.94)',offset:.7},{transform:'scale(1)'}],{duration:520,easing:'cubic-bezier(.3,1.4,.5,1)'});
  var ring=document.createElement('span');ring.style.cssText='position:fixed;pointer-events:none;z-index:10060;border-radius:50%;border:2px solid rgba(90,180,255,.9);left:'+r.left+'px;top:'+r.top+'px;width:'+r.width+'px;height:'+r.height+'px';
  document.body.appendChild(ring);var an=ring.animate([{transform:'scale(1)',opacity:.9},{transform:'scale(2.4)',opacity:0}],{duration:620,easing:'ease-out'});an.onfinish=function(){ring.remove()};
  if(navigator.vibrate&&LS.getItem('tx_hap')!=='0')navigator.vibrate([10,30,16])}catch(_){}
 };
}
function show(){
 if(done()||document.getElementById('txOnb')||!window.TXLANG||!TXLANG.langs)return;
 var st=document.createElement('style');st.id='txOnbCss';
 st.textContent='#txOnb{position:fixed;inset:0;z-index:10050;display:flex;flex-direction:column;justify-content:center;gap:22px;padding:max(28px,env(safe-area-inset-top)) 22px max(28px,env(safe-area-inset-bottom));background:radial-gradient(120% 80% at 50% 0%,color-mix(in srgb,var(--accent,#1b63f0) 22%,transparent),transparent 60%),var(--bg,#0b1226);color:var(--ink,#fff);font-family:inherit;animation:txOnbIn .45s cubic-bezier(.2,.9,.3,1) both;overflow-y:auto}'
 +'#txOnb.out{animation:txOnbOut .28s ease both;pointer-events:none}'
 +'@keyframes txOnbIn{from{opacity:0;transform:scale(1.03)}to{opacity:1;transform:none}}@keyframes txOnbOut{to{opacity:0;transform:scale(.98)}}'
 +'#txOnb .hd{text-align:center;margin-bottom:4px}#txOnb .gl{width:54px;height:54px;margin:0 auto 14px;display:grid;place-items:center;border-radius:18px;background:linear-gradient(135deg,#1b63f0,#22a8f5);box-shadow:0 14px 30px -12px rgba(27,99,240,.9);color:#fff}#txOnb .gl svg{width:28px;height:28px}'
 +'#txOnb h1{margin:0;font-size:26px;font-weight:800;line-height:1.3}#txOnb .hd p{margin:6px 0 0;font-size:14px;font-weight:600;color:var(--ink2,rgba(255,255,255,.7));direction:ltr}'
 +'#txOnb .ls{display:flex;flex-direction:column;gap:12px;max-width:440px;width:100%;margin:0 auto}'
 +'#txOnb .it{display:flex;align-items:center;gap:14px;width:100%;min-height:72px;padding:12px 16px;border-radius:20px;border:1.5px solid var(--line,rgba(255,255,255,.16));background:var(--surface,rgba(255,255,255,.06));color:inherit;font:inherit;text-align:start;cursor:pointer;transition:transform .25s cubic-bezier(.3,1.5,.5,1),border-color .2s,background .2s}'
 +'#txOnb .it:active{transform:scale(.97)}#txOnb .it.on{border-color:var(--accent,#1b63f0);background:color-mix(in srgb,var(--accent,#1b63f0) 16%,transparent)}'
 +'#txOnb .fg{flex:none;width:44px;height:44px;border-radius:50%;overflow:hidden;box-shadow:0 0 0 2px rgba(255,255,255,.18)}#txOnb .fg svg{width:100%;height:100%;display:block}'
 +'#txOnb .nm{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}#txOnb .nm b{font-size:18px;font-weight:800}#txOnb .nm small{font-size:12.5px;font-weight:600;color:var(--ink2,rgba(255,255,255,.65));direction:ltr;text-align:start}'
 +'#txOnb .ar{flex:none;width:20px;height:20px;opacity:.55}[dir=rtl] #txOnb .ar,#txOnb .it[dir=rtl] .ar{transform:scaleX(-1)}'
 +'#txOnb .ft{text-align:center;font-size:12.5px;font-weight:600;color:var(--ink2,rgba(255,255,255,.6));line-height:1.7}';
 document.head.appendChild(st);
 var o=document.createElement('div');o.id='txOnb';o.setAttribute('role','dialog');o.setAttribute('aria-modal','true');o.setAttribute('aria-label','Language / اللغة');
 var GL='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><ellipse cx="12" cy="12" rx="4.2" ry="10"/><path d="M2 12h20M4 7h16M4 17h16"/></svg>';
 var AR='<svg class="ar" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>';
 var h='<div class="hd"><div class="gl">'+GL+'</div><h1>اختر لغتك</h1><p>Choose your language</p></div><div class="ls" role="radiogroup">';
 TXLANG.langs.forEach(function(l){h+='<button type="button" role="radio" aria-checked="false" class="it" dir="'+l.dir+'" data-k="'+l.k+'"><span class="fg">'+l.flag+'</span><span class="nm"><b>'+l.name+'</b><small>'+l.sub+'</small></span>'+AR+'</button>'});
 h+='</div><div class="ft">تقدر تغيّرها في أي وقت من الإعدادات<br><span style="direction:ltr;display:inline-block">You can change it anytime in Settings</span></div>';
 o.innerHTML=h;
 o.addEventListener('click',function(e){var b=e.target.closest('.it');if(!b||o._d)return;o._d=1;b.classList.add('on');b.setAttribute('aria-checked','true');
  try{if(navigator.vibrate&&LS.getItem('tx_hap')!=='0')navigator.vibrate(14)}catch(_){}
  apply(b.dataset.k);setTimeout(function(){suck(o,st)},260)});
 document.body.appendChild(o);
}
if(document.body)setTimeout(show,60);else addEventListener('DOMContentLoaded',function(){setTimeout(show,60)});
})();

/* ===== v183: قيمة وتعبئة السلايدرز ===== */
(function(){
function upd(i){var mn=+i.min||0,mx=+i.max||100,p=(i.value-mn)/((mx-mn)||1)*100;i.style.setProperty('--p',p+'%');var o=i._o;if(!o)return;var v=+i.value,k=i.dataset.r;o.textContent=k==='sz'?Math.round(v)+'%':k==='bl'?String(Math.round(v*10)/10):String(Math.round(v));}
function dec(){document.querySelectorAll('.tfs input[type=range]:not([data-dec])').forEach(function(i){i.dataset.dec='1';var o=document.createElement('output');o.className='tfo';i.after(o);i._o=o;upd(i);i.addEventListener('input',function(){upd(i)});});}
new MutationObserver(dec).observe(document.body,{childList:true,subtree:true});dec();
setInterval(function(){document.querySelectorAll('.tfs input[data-dec]').forEach(upd)},350);
})();
