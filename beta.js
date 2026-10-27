/* Timaxo beta gate — يشتغل بس على الأجهزة اللي فتحت رابط التجربة (?beta=1). النسخة العامة والصفحات التانية ما بتتأثرش.
   القفل: بتاريخ الانتهاء (EXP) أو عن بُعد من ملف beta-control.json. المسح عن بُعد بيمسح نسخة التطبيق الأوفلاين (الكاش) فقط، ومبيلمسش مستندات المستخدم. */
(function(){'use strict';
var EXP_DEFAULT='2026-11-15';           /* آخر يوم للتجربة (نهاية اليوم بتوقيت الجهاز) */
var GRACE_MIN=10;                        /* مهلة النسخ الاحتياطي من شاشة القفل */
var LS=null,SS=null;try{LS=localStorage}catch(_){}try{SS=sessionStorage}catch(_){}
function g(k){try{return LS.getItem(k)}catch(_){return null}}
function s(k,v){try{LS.setItem(k,v)}catch(_){}}
function sg(k){try{return SS.getItem(k)}catch(_){return null}}
function ss(k,v){try{SS.setItem(k,v)}catch(_){}}

/* 1) تسجيل الجهاز كجهاز تجربة */
try{var q=new URLSearchParams(location.search);
  if(q.get('beta')==='1'){s('tx_beta','1');try{history.replaceState(null,'',location.pathname+location.hash)}catch(_){}}
}catch(_){}
if(g('tx_beta')!=='1')return;

/* 2) القرار (دالة نقية للاختبار) */
function endOf(d){var t=Date.parse(String(d||'')+'T23:59:59');return isNaN(t)?Date.parse(EXP_DEFAULT+'T23:59:59'):t}
function decide(now,expStr,remoteLock){
  var end=endOf(expStr);
  if(remoteLock)return{locked:true,why:'remote',daysLeft:0};
  if(now>=end)return{locked:true,why:'expired',daysLeft:0};
  return{locked:false,why:'',daysLeft:Math.ceil((end-now)/864e5)};
}
window.__txBetaDecide=decide;
/* حماية من رجوع ساعة الجهاز للخلف: بنحتفظ بأكبر وقت اتشاف */
function nowSafe(){var n=Date.now(),m=+g('tx_beta_max')||0;if(n>m){s('tx_beta_max',String(n));m=n}return Math.max(n,m)}
function state(){return decide(nowSafe(),g('tx_beta_exp')||EXP_DEFAULT,g('tx_beta_rl')==='1')}

/* 3) الواجهة */
var AR=function(){return (document.documentElement.lang||navigator.language||'').slice(0,2)==='ar'};
var T=function(a,e){return AR()?a:e};
var ov=null,bar=null,toast=null;
function css(){
  if(document.getElementById('txbeta-css'))return;
  var st=document.createElement('style');st.id='txbeta-css';
  st.textContent='#txbeta{position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(5,12,38,.97);color:#fff;font:500 15px/1.7 system-ui,sans-serif;text-align:center;-webkit-tap-highlight-color:transparent}'
  +'#txbeta .c{max-width:380px;width:100%;border:1px solid rgba(120,160,255,.28);border-radius:24px;padding:28px 22px;background:linear-gradient(160deg,rgba(30,60,140,.35),rgba(10,16,40,.6));box-shadow:0 20px 60px -20px rgba(40,100,255,.6)}'
  +'#txbeta h2{margin:0 0 10px;font:800 21px/1.3 system-ui,sans-serif}#txbeta p{margin:0 0 18px;opacity:.82}'
  +'#txbeta button,#txbeta a{display:block;width:100%;box-sizing:border-box;margin:8px 0 0;padding:14px;border-radius:15px;border:0;font:700 15px system-ui,sans-serif;text-decoration:none;cursor:pointer}'
  +'#txbeta .p{background:linear-gradient(100deg,#1F6BFF,#8A56FF);color:#fff}#txbeta .q{background:rgba(255,255,255,.08);color:#fff;border:1px solid rgba(255,255,255,.16)}'
  +'#txbetabar{position:fixed;top:0;left:0;right:0;z-index:2147483646;padding:calc(env(safe-area-inset-top,0px) + 8px) 14px 8px;background:#B45309;color:#fff;font:600 13px/1.5 system-ui,sans-serif;text-align:center}'
  +'#txbetat{position:fixed;left:12px;right:12px;bottom:calc(env(safe-area-inset-bottom,0px) + 16px);z-index:2147483645;padding:12px 14px;border-radius:14px;background:#10204f;color:#fff;border:1px solid rgba(120,160,255,.35);font:600 13px/1.5 system-ui,sans-serif;text-align:center}';
  (document.head||document.documentElement).appendChild(st);
}
function mount(el){(document.body||document.documentElement).appendChild(el)}
function showLock(st){
  css();
  if(bar){bar.remove();bar=null}
  if(ov)return;
  ov=document.createElement('div');ov.id='txbeta';ov.setAttribute('role','alertdialog');ov.dir=AR()?'rtl':'ltr';
  var c=document.createElement('div');c.className='c';
  var h=document.createElement('h2');h.textContent=st.why==='remote'?T('التجربة متوقفة حاليًا','The beta is paused'):T('انتهت فترة التجربة','The beta has ended');
  var p=document.createElement('p');p.textContent=T('شكرًا لمساعدتك في تجربة Timaxo Scan 🙏 لو عندك مستندات على الجهاز، احفظ نسخة احتياطية قبل ما تقفل التطبيق.','Thank you for helping test Timaxo Scan 🙏 If you have documents on this device, save a backup before you close the app.');
  var b=document.createElement('button');b.className='p';b.type='button';b.textContent=T('احفظ نسخة احتياطية','Back up my documents');
  b.onclick=function(){ss('tx_beta_grace',String(Date.now()+GRACE_MIN*60000));hideLock();var l=document.getElementById('libBtn');if(l)try{l.click()}catch(_){}};
  var a=document.createElement('a');a.className='q';a.href='mailto:Timaxo.apps@gmail.com?subject=Timaxo%20beta%20feedback';a.textContent=T('ابعتلنا رأيك','Send us your feedback');
  c.appendChild(h);c.appendChild(p);c.appendChild(b);c.appendChild(a);ov.appendChild(c);mount(ov);
}
function hideLock(){if(ov){ov.remove();ov=null}showBar()}
function showBar(){
  css();if(bar)return;
  bar=document.createElement('div');bar.id='txbetabar';bar.dir=AR()?'rtl':'ltr';
  bar.textContent=T('انتهت التجربة. احفظ نسخة احتياطية الآن، وهيتقفل التطبيق تلقائيًا بعد دقائق.','The beta has ended. Back up now — the app will lock again in a few minutes.');
  mount(bar);
}
function warn(days){
  var k='tx_beta_warn',today=new Date().toISOString().slice(0,10);
  if(g(k)===today)return;s(k,today);css();
  toast=document.createElement('div');toast.id='txbetat';toast.dir=AR()?'rtl':'ltr';
  toast.textContent=days<=1?T('آخر يوم للتجربة اليوم. احفظ نسخة احتياطية من مستنداتك.','Last day of the beta. Please back up your documents.')
    :T('التجربة هتنتهي خلال '+days+' أيام. احفظ نسخة احتياطية من مستنداتك.','The beta ends in '+days+' days. Please back up your documents.');
  mount(toast);setTimeout(function(){if(toast){toast.remove();toast=null}},9000);
}
function apply(){
  var st=state();
  if(st.locked){
    var gr=+sg('tx_beta_grace')||0;
    if(Date.now()<gr){if(ov)hideLock();else showBar()}else{showLock(st)}
  }else{
    if(ov||bar){if(ov){ov.remove();ov=null}if(bar){bar.remove();bar=null}}
    if(st.daysLeft<=3)warn(st.daysLeft);
  }
}

/* 4) مسح نسخة التطبيق الأوفلاين (الكاش فقط، مش مستندات المستخدم) */
function wipe(){
  try{if(window.caches)caches.keys().then(function(k){return Promise.all(k.map(function(x){return caches.delete(x)}))}).catch(function(){})}catch(_){}
  try{if(navigator.serviceWorker)navigator.serviceWorker.getRegistrations().then(function(r){r.forEach(function(x){x.unregister()})}).catch(function(){})}catch(_){}
}

/* 5) قراءة ملف التحكم من الشبكة (لو أونلاين) */
function sync(){
  if(!window.fetch)return;
  fetch('beta-control.json?_='+Date.now(),{cache:'no-store'}).then(function(r){
    if(!r.ok)throw 0;
    try{var d=r.headers.get('Date');if(d){var t=Date.parse(d);if(t&&t>(+g('tx_beta_max')||0))s('tx_beta_max',String(t))}}catch(_){}
    return r.json();
  }).then(function(c){
    if(!c||typeof c!=='object')return;
    if(c.expires)s('tx_beta_exp',String(c.expires));
    s('tx_beta_rl',c.lock?'1':'0');
    if(c.wipeId&&String(c.wipeId)!==g('tx_beta_wipe')){s('tx_beta_wipe',String(c.wipeId));wipe()}
    apply();
  }).catch(function(){});
}

function boot(){apply();sync();setInterval(apply,15000);document.addEventListener('visibilitychange',function(){if(!document.hidden){apply();sync()}})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
