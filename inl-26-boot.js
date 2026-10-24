
(function(){function go(){try{var lt=document.getElementById('libBtn'),vh=document.getElementById('vHome');if(lt&&vh&&lt.parentNode!==vh)vh.appendChild(lt);var gb=document.getElementById('globeBtn'),br=document.querySelector('#vHome .top .brand');if(gb&&br&&gb.parentNode===br)br.insertAdjacentElement('afterend',gb);var lb=document.getElementById('asgBtn');if(!lb)return setTimeout(go,300);

lb.addEventListener('click',function(){lb.classList.remove('ignite');void lb.offsetWidth;lb.classList.add('ignite');try{navigator.vibrate&&navigator.vibrate([14,40,22])}catch(_){}},true)}catch(e){}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(go,400)});else setTimeout(go,400)})();

/* v189: إشعار مصباح المساعد (#asgBtn): نقطة تنبيه + وميض لما الواجهة تقعد ساكنة */
(function(){
  var IDLE=15000,REPEAT=7000,st=document.createElement('style');
  st.textContent='#asgBtn .asgDot{position:absolute;top:-4px;inset-inline-end:-4px;width:13px;height:13px;border-radius:50%;background:#ff3b5c;border:2px solid #04245a;box-shadow:0 0 8px rgba(255,59,92,.9);pointer-events:none;z-index:3;animation:asgDotP 1.6s ease-in-out infinite}'
   +'@keyframes asgDotP{0%,100%{transform:scale(1)}50%{transform:scale(1.28)}}'
   +'@media (prefers-reduced-motion:reduce){#asgBtn .asgDot{animation:none}}';
  document.head.appendChild(st);
  var reduced=false;try{reduced=matchMedia('(prefers-reduced-motion:reduce)').matches}catch(_){}
  function init(){
    var lb=document.getElementById('asgBtn'),vh=document.getElementById('vHome');
    if(!lb||!vh)return setTimeout(init,400);
    var idleT=0,repT=0,wasOn=false;
    var homeOn=function(){return vh.classList.contains('on')&&!document.hidden};
    function showDot(){if(!lb.querySelector('.asgDot')){var d=document.createElement('span');d.className='asgDot';lb.appendChild(d)}}
    function hideDot(){var d=lb.querySelector('.asgDot');if(d)d.remove()}
    function flash(){lb.classList.remove('ignite');void lb.offsetWidth;lb.classList.add('ignite')}
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
