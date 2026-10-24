
(function(){function go(){try{var lt=document.getElementById('libBtn'),vh=document.getElementById('vHome');if(lt&&vh&&lt.parentNode!==vh)vh.appendChild(lt);var gb=document.getElementById('globeBtn'),br=document.querySelector('#vHome .top .brand');if(gb&&br&&gb.parentNode===br)br.insertAdjacentElement('afterend',gb);var lb=document.getElementById('asgBtn');if(!lb)return setTimeout(go,300);

lb.addEventListener('click',function(){lb.classList.remove('ignite');void lb.offsetWidth;lb.classList.add('ignite');try{navigator.vibrate&&navigator.vibrate([14,40,22])}catch(_){}},true)}catch(e){}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(go,400)});else setTimeout(go,400)})();

/* v189: إشعار زرار الدليل «؟» (#tgBtn): نقطة تنبيه + وميض لما الواجهة تقعد ساكنة */
(function(){
  var IDLE=15000,REPEAT=7000,st=document.createElement('style');
  st.textContent='#tgBtn .asgDot{position:absolute;top:3px;inset-inline-end:3px;width:12px;height:12px;border-radius:50%;background:#ff3b5c;border:2px solid #04245a;box-shadow:0 0 8px rgba(255,59,92,.9);pointer-events:none;z-index:3;animation:asgDotP 1.6s ease-in-out infinite}'
   +'@keyframes asgDotP{0%,100%{transform:scale(1)}50%{transform:scale(1.28)}}'
   +'html:root body #vHome .hdock>#tgBtn{position:relative}'
   +'html:root body #vHome .hdock>#tgBtn.tgFlash{animation:tgFl .9s ease-in-out}'
   +'html:root body #vHome .hdock>#tgBtn.tgFlash svg{animation:tgWg .9s ease-in-out}'
   +'@keyframes tgFl{0%,100%{box-shadow:0 0 0 0 rgba(255,214,10,0)}40%{box-shadow:0 0 0 2px rgba(255,214,10,.9),0 0 26px 6px rgba(255,214,10,.75)}}'
   +'@keyframes tgWg{0%,100%{transform:none;filter:none}25%{transform:scale(1.18) rotate(-14deg);filter:drop-shadow(0 0 8px #ffd60a)}55%{transform:scale(1.1) rotate(10deg);filter:drop-shadow(0 0 10px #ffd60a)}80%{transform:scale(1.05) rotate(-4deg)}}'
   +'@media (prefers-reduced-motion:reduce){#tgBtn .asgDot{animation:none}}';
  document.head.appendChild(st);
  var reduced=false;try{reduced=matchMedia('(prefers-reduced-motion:reduce)').matches}catch(_){}
  var tries=0;function init(){
    var lb=document.getElementById('tgBtn'),vh=document.getElementById('vHome');
    if(!lb||!vh){if(++tries<60)setTimeout(init,500);return}
    var idleT=0,repT=0,wasOn=false;
    var homeOn=function(){return vh.classList.contains('on')&&!document.hidden};
    function showDot(){if(!lb.querySelector('.asgDot')){var d=document.createElement('span');d.className='asgDot';lb.appendChild(d)}}
    function hideDot(){var d=lb.querySelector('.asgDot');if(d)d.remove()}
    function flash(){lb.classList.remove('tgFlash');void lb.offsetWidth;lb.classList.add('tgFlash')}
    function stopFlash(){clearTimeout(idleT);clearInterval(repT);idleT=repT=0}
    function armIdle(){
      stopFlash();if(reduced||!homeOn())return;
      idleT=setTimeout(function(){flash();repT=setInterval(function(){homeOn()?flash():stopFlash()},REPEAT)},IDLE);
    }
    /* أي استخدام = يوقف الوميض ويبدأ العدّ من الأول */
    ['pointerdown','touchstart','keydown','wheel','scroll'].forEach(function(ev){
      document.addEventListener(ev,armIdle,{capture:true,passive:true});
    });
    /* الدوس على المصباح بيشيل النقطة */
    lb.addEventListener('click',hideDot,true);
    /* النقطة بتظهر: عند فتح التطبيق، الرجوع له من برّه، والرجوع للواجهة الرئيسية */
    function arm(){showDot();armIdle()}
    document.addEventListener('visibilitychange',function(){if(document.hidden){stopFlash()}else{arm()}});
    window.addEventListener('pageshow',arm);
    new MutationObserver(function(){var on=vh.classList.contains('on');if(on&&!wasOn)arm();else if(!on)stopFlash();wasOn=on}).observe(vh,{attributes:true,attributeFilter:['class']});
    wasOn=vh.classList.contains('on');arm();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(init,600)});else setTimeout(init,600);
})();
