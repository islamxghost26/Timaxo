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
