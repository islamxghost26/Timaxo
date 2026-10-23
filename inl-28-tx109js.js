
(function(){
var R=document.documentElement;
function vib(p){try{if(localStorage.getItem('tx_hap')==='0')return;if(navigator.vibrate)navigator.vibrate(p)}catch(e){}}
function red(){return matchMedia('(prefers-reduced-motion:reduce)').matches}
function cur(){return R.lang==='en'?'en':(window.TXMSA&&TXMSA.on()?'sa':'ar')}
function sndOn(){try{return localStorage.getItem('tx_snd')!=='0'}catch(e){return true}}
/* ---- صوت الصفحة (مولّد بالكود، من غير ملفات) ---- */
function ctx(){var C=window.AudioContext||window.webkitAudioContext;if(!C)return null;var a=window._txac||(window._txac=new C());if(a.state==='suspended')a.resume();return a}
function swoosh(){if(!sndOn())return;try{var ac=ctx();if(!ac)return;var t=ac.currentTime,n=Math.floor(ac.sampleRate*.55),b=ac.createBuffer(1,n,ac.sampleRate),d=b.getChannelData(0);for(var i=0;i<n;i++)d[i]=Math.random()*2-1;
 var s=ac.createBufferSource();s.buffer=b;var f=ac.createBiquadFilter();f.type='bandpass';f.Q.value=.8;f.frequency.setValueAtTime(700,t);f.frequency.exponentialRampToValueAtTime(4600,t+.3);
 var g=ac.createGain();g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.6,t+.1);g.gain.exponentialRampToValueAtTime(.0001,t+.46);s.connect(f);f.connect(g);g.connect(ac.destination);s.start(t);s.stop(t+.55);}catch(e){}}
function thud(){if(!sndOn())return;try{var ac=ctx();if(!ac)return;var t=ac.currentTime,o=ac.createOscillator(),g=ac.createGain();o.type='sine';o.frequency.setValueAtTime(190,t);o.frequency.exponentialRampToValueAtTime(65,t+.1);g.gain.setValueAtTime(.28,t);g.gain.exponentialRampToValueAtTime(.0001,t+.14);o.connect(g);g.connect(ac.destination);o.start(t);o.stop(t+.16);}catch(e){}}

var GLOBE='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10.5"/><ellipse cx="12" cy="12" rx="4.6" ry="10.5"/><path d="M1.5 12h21M3.6 7h16.8M3.6 17h16.8"/></svg>';
var FL={
 ar:'<svg viewBox="0 0 40 40"><defs><clipPath id="txcEG"><circle cx="20" cy="20" r="20"/></clipPath></defs><g clip-path="url(#txcEG)"><rect width="40" height="13.5" fill="#CE1126"/><rect y="13.3" width="40" height="13.5" fill="#fff"/><rect y="26.6" width="40" height="13.4" fill="#111"/><path d="M20 15.2l3.2 2.4v3.3c0 2.1-1.5 3.7-3.2 4.3-1.7-.6-3.2-2.2-3.2-4.3v-3.3z" fill="#C09300"/><path d="M20 17v6.6M17.8 19.4h4.4" stroke="#7a5c00" stroke-width="1"/></g></svg>',
 en:'<svg viewBox="0 0 40 40"><defs><clipPath id="txcUK"><circle cx="20" cy="20" r="20"/></clipPath></defs><g clip-path="url(#txcUK)"><rect width="40" height="40" fill="#012169"/><path d="M0 0L40 40M40 0L0 40" stroke="#fff" stroke-width="7"/><path d="M0 0L40 40M40 0L0 40" stroke="#C8102E" stroke-width="2.6"/><path d="M20 0v40M0 20h40" stroke="#fff" stroke-width="11"/><path d="M20 0v40M0 20h40" stroke="#C8102E" stroke-width="6.4"/></g></svg>'};
/* سجل اللغات: أضف لغة جديدة هنا (key, اسمها، حرف الأيقونة، علمها، اتجاهها) */
FL.sa='<svg viewBox="9 3 42 36" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><image href="data:image/png;base64,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" width="60" height="40" preserveAspectRatio="xMidYMid slice"/></svg>';
var LANGS=[{k:'ar',name:'العربية (مصر)',sn:'مصري',sub:'Egyptian Arabic',code:'ع',flag:FL.ar,dir:'rtl'},{k:'sa',name:'العربية الفصحى',sn:'فصحى',sub:'Modern Standard Arabic',code:'ف',flag:FL.sa,dir:'rtl'},{k:'en',name:'English\u200E',sn:'English\u200E',sub:'English\u200E',code:'EN',flag:FL.en,dir:'ltr'}];
function L(k){for(var i=0;i<LANGS.length;i++)if(LANGS[i].k===k)return LANGS[i];return LANGS[0]}
var pop=null,sheet=null,busy=0;
function applyLang(k){var lb=document.getElementById('langBtn');if(window.TXMSA)TXMSA.set(k==='sa');if(lb&&(k==='en')!==(R.lang==='en'))lb.click();}  /* حالياً لغتين: الزر بيبدّل. عند إضافة لغات اربط هنا دالة ضبط اللغة مباشرة */
function closePop(fast){var p=pop,g=document.getElementById('globeBtn');if(!p)return;pop=null;if(g)g.classList.remove('open');
 if(red()||!p.animate||fast){p.remove();return}
 var a=p.animate([{opacity:1,transform:'none'},{opacity:0,transform:'translateY(-6px) scale(.7)'}],{duration:170,easing:'cubic-bezier(.4,0,1,1)',fill:'forwards'});a.onfinish=function(){p.remove()};}
function openPop(g){
 if(pop){closePop();return}
 vib(10);g.classList.add('open');
 var p=document.createElement('div');p.className='txlang';p.setAttribute('role','menu');
 var QK=window.TXMSA?TXMSA.quick():['ar','en'];LANGS.filter(function(l){return QK.indexOf(l.k)>=0}).forEach(function(l){var b=document.createElement('button');b.type='button';b.innerHTML=l.flag;b.setAttribute('aria-label',l.name);if(l.k===cur())b.classList.add('on');b.onclick=function(e){e.stopPropagation();choose(l.k)};p.appendChild(b)});
 document.body.appendChild(p);
 var r=g.getBoundingClientRect(),w=p.offsetWidth,left=Math.max(8,Math.min(innerWidth-w-8,r.left+r.width/2-w/2));
 p.style.left=left+'px';p.style.top=(r.bottom+10)+'px';p.style.transformOrigin=(r.left+r.width/2-left)+'px 0';pop=p;
 if(!red()&&p.animate){p.animate([{opacity:0,transform:'translateY(-10px) scale(.5)'},{opacity:1,transform:'none'}],{duration:380,easing:'cubic-bezier(.34,1.56,.64,1)',fill:'both'});
  [].forEach.call(p.children,function(b,i){b.animate([{opacity:0,transform:'scale(.3) rotate(-40deg)'},{opacity:1,transform:'none'}],{duration:420,delay:70+i*55,easing:'cubic-bezier(.34,1.7,.5,1)',fill:'both'})});}
}
/* ---- قلب الصفحة ---- */
function choose(k){
 closePop();closeSheet(true);
 if(busy)return;
 if(k===cur()){vib(8);return}
 busy=1;
 var b=document.body;
 if(red()||!b.animate){applyLang(k);busy=0;vib(20);return}
 var toRight=L(k).dir==='rtl',a=toRight?86:-86,P='perspective(1500px) rotateY(';
 b.style.transformOrigin=toRight?'100% 50%':'0% 50%';R.style.overflow='hidden';R.style.background='var(--bg)';b.style.willChange='transform,filter';
 vib([24,40,36]);swoosh();
 var out=b.animate([{transform:P+'0deg)',filter:'brightness(1)'},{transform:P+a+'deg)',filter:'brightness(.82)'}],{duration:300,easing:'cubic-bezier(.55,0,.8,.45)',fill:'forwards'});
 out.onfinish=function(){
  applyLang(k);
  setTimeout(function(){
   var inn=b.animate([{transform:P+(-a)+'deg)',filter:'brightness(.82)'},{transform:P+'0deg)',filter:'brightness(1)'}],{duration:460,easing:'cubic-bezier(.2,.8,.2,1)',fill:'both'});
   out.cancel();
   inn.onfinish=function(){inn.cancel();b.style.willChange='';b.style.transformOrigin='';R.style.overflow='';R.style.background='';busy=0;thud();vib(30)};
  },70);
 };
}
/* ---- قايمة اختيار اللغة (من قايمة المزيد) ---- */
function closeSheet(fast){var s=sheet;if(!s)return;sheet=null;if(fast||red()||!s.animate){s.remove();return}
 var bx=s.firstChild;bx.animate([{transform:'none'},{transform:'translateY(100%)'}],{duration:160,easing:'cubic-bezier(.4,0,1,1)',fill:'forwards'});var a=s.animate([{opacity:1},{opacity:0}],{duration:160,fill:'forwards'});a.onfinish=function(){s.remove()};}
function pick(){
 if(sheet)return;vib(10);
 var s=document.createElement('div');s.className='txls';
 var en=cur()==='en';
 var X={t:en?'Language':'اللغة',st:en?'Choose the app language':'اختر لغة التطبيق',q:en?'Quick switch':'التبديل السريع',qh:en?'Pick the two languages the globe button switches between.':'اختر اللغتين اللتين يبدّل بينهما زر الكرة الأرضية في الأعلى.',a:en?'First':'الأولى',b:en?'Second':'الثانية'};
 var CK='<svg class="ck" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
 var h='<div class="bx" role="dialog" aria-modal="true" aria-label="'+X.t+'"><div class="hd"></div><h3>'+X.t+'</h3><p class="tl-st">'+X.st+'</p><div class="tl-lst" role="radiogroup">';
 LANGS.forEach(function(l){h+='<button type="button" role="radio" aria-checked="'+(l.k===cur())+'" class="r'+(l.k===cur()?' on':'')+'" data-k="'+l.k+'"><span class="fg">'+l.flag+'</span><span class="nm"><b>'+l.name+'</b><small>'+l.sub+'</small></span>'+CK+'</button>'});
 h+='</div><h4 class="tl-sec">'+X.q+'</h4><p class="tl-hint">'+X.qh+'</p>';
 [X.a,X.b].forEach(function(lb,ix){h+='<div class="tl-slot" data-i="'+ix+'"><span>'+lb+'</span><div class="tl-seg" role="radiogroup">';
  LANGS.forEach(function(l){h+='<button type="button" role="radio" data-q="'+l.k+'" aria-label="'+l.name+'"><span class="fg">'+l.flag+'</span><em>'+l.sn+'</em></button>'});
  h+='</div></div>'});
 s.innerHTML=h+'</div>';
 function paint(){var a=TXMSA.quick();[].forEach.call(s.querySelectorAll('.tl-slot'),function(sl){var k=a[+sl.dataset.i];[].forEach.call(sl.querySelectorAll('.tl-seg button'),function(b){var on=b.dataset.q===k;b.classList.toggle('on',on);b.setAttribute('aria-checked',on)})})}
 s.addEventListener('click',function(e){if(e.target===s){closeSheet()}});
 [].forEach.call(s.querySelectorAll('.tl-seg button'),function(b){b.onclick=function(e){e.stopPropagation();var ix=+b.parentNode.parentNode.dataset.i,a=TXMSA.quick().slice(),k=b.dataset.q;if(a[ix]===k)return;if(a[1-ix]===k)a[1-ix]=a[ix];a[ix]=k;TXMSA.setQuick(a);vib(8);paint()}});
 [].forEach.call(s.querySelectorAll('.r'),function(r){r.onclick=function(){choose(r.dataset.k)}});
 paint();
 document.body.appendChild(s);sheet=s;
 if(!red()&&s.animate){s.animate([{opacity:0},{opacity:1}],{duration:150,fill:'both'});s.firstChild.animate([{transform:'translateY(100%)'},{transform:'none'}],{duration:380,easing:'cubic-bezier(.2,.9,.3,1.1)',fill:'both'});}
}
window.TXLANG={langs:LANGS,pick:pick,choose:choose,current:cur};
/* ---- زر الكرة الأرضية ---- */
function setup(){
 var g=document.getElementById('globeBtn');if(!g)return false;if(g._t110)return true;
 var n=g.cloneNode(false);n.innerHTML=GLOBE+'<b class="gl"></b>';n._t110=1;n.id='globeBtn';n.removeAttribute('style');
 g.replaceWith(n);
 var upd=function(){n.setAttribute('aria-label',cur()!=='en'?'اللغة':'Language');var c=n.querySelector('.gl');if(c)c.textContent=L(cur()).code};upd();
 new MutationObserver(upd).observe(R,{attributes:true,attributeFilter:['lang','data-msa']});
 n.addEventListener('click',function(e){e.stopPropagation();openPop(n)});
 return true;
}
document.addEventListener('pointerdown',function(e){if(pop&&!e.target.closest('.txlang')&&!e.target.closest('#globeBtn'))closePop()},true);
document.addEventListener('keydown',function(e){if(e.key==='Escape'){closePop();closeSheet()}});
addEventListener('scroll',function(){closePop(true)},true);
var t=0,iv=setInterval(function(){var ok=setup();if(ok||++t>60)clearInterval(iv)},250);
setTimeout(setup,1200);
new MutationObserver(function(){var g=document.getElementById('globeBtn');if(g&&!g._t110)setup()}).observe(document.body,{childList:true,subtree:true});
})();
