
(function(){function go(){try{var lt=document.getElementById('libBtn'),vh=document.getElementById('vHome');if(lt&&vh&&lt.parentNode!==vh)vh.appendChild(lt);var gb=document.getElementById('globeBtn'),br=document.querySelector('#vHome .top .brand');if(gb&&br&&gb.parentNode===br)br.insertAdjacentElement('afterend',gb);var lb=document.getElementById('asgBtn');if(!lb)return setTimeout(go,300);

lb.addEventListener('click',function(){lb.classList.remove('ignite');void lb.offsetWidth;lb.classList.add('ignite');try{navigator.vibrate&&navigator.vibrate([14,40,22])}catch(_){}},true)}catch(e){}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(go,400)});else setTimeout(go,400)})();

/* v191: زرار الدليل «؟» (#tgBtn): تنبيه أنيق — توهج أصفر + نبض + هزّة، وبعدها فقاعة إشعار تطلع من الأيقونة */
(function(){
  var T_IDLE=7000, T_BUBBLE=15000, T_HIDE=8000;
  var ar=function(){return document.documentElement.lang==='ar'};
  var reduced=false;try{reduced=matchMedia('(prefers-reduced-motion:reduce)').matches}catch(_){}
  var st=document.createElement('style');
  st.textContent=
   'html:root body #vHome .hdock>#tgBtn{position:relative;transition:color .35s,background .35s}'
  +'html:root body #vHome .hdock>#tgBtn.tgAttn{color:#ffd60a!important;background:rgba(255,214,10,.12)!important;animation:tgPulse 2.4s ease-in-out infinite}'
  +'html:root body #vHome .hdock>#tgBtn.tgAttn svg{animation:tgShake 2.4s ease-in-out infinite;transform-origin:50% 50%}'
  +'@keyframes tgPulse{0%,100%{transform:scale(1);box-shadow:0 0 0 0 rgba(255,214,10,0)}28%{transform:scale(1.15);box-shadow:0 0 0 2px rgba(255,214,10,.9),0 0 26px 6px rgba(255,214,10,.7)}56%{transform:scale(1);box-shadow:0 0 0 1px rgba(255,214,10,.5),0 0 12px 2px rgba(255,214,10,.35)}}'
  +'@keyframes tgShake{0%,34%,100%{transform:rotate(0);filter:drop-shadow(0 0 4px rgba(255,214,10,.6))}40%{transform:rotate(-16deg)}48%{transform:rotate(13deg)}56%{transform:rotate(-9deg)}64%{transform:rotate(6deg)}72%{transform:rotate(-2deg)}}'
  +'@media (prefers-reduced-motion:reduce){html:root body #vHome .hdock>#tgBtn.tgAttn,html:root body #vHome .hdock>#tgBtn.tgAttn svg{animation:none}html:root body #vHome .hdock>#tgBtn.tgAttn{box-shadow:0 0 0 2px rgba(255,214,10,.8),0 0 18px 3px rgba(255,214,10,.55)}}'
  +'#tgNote{position:fixed;z-index:100060;max-width:min(260px,calc(100vw - 16px));padding:11px 14px 12px;border-radius:16px;color:#eaf2ff;font:600 13.5px/1.45 system-ui,-apple-system,"Segoe UI",sans-serif;'
  +'background:linear-gradient(160deg,rgba(10,52,128,.96),rgba(4,28,76,.97));border:1.5px solid rgba(255,214,10,.65);box-shadow:0 10px 30px rgba(0,0,0,.45),0 0 22px -4px rgba(255,214,10,.45);'
  +'-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);opacity:0;transform:translateY(-8px) scale(.4);transition:opacity .28s ease,transform .42s cubic-bezier(.2,1.25,.4,1);cursor:pointer;-webkit-tap-highlight-color:transparent}'
  +'#tgNote.on{opacity:1;transform:none}'
  +'#tgNote b{display:block;font-size:14px;color:#ffd60a;margin-bottom:2px}'
  +'#tgNote span{opacity:.92;font-weight:500}'
  +'#tgNote i{position:absolute;top:-7px;width:12px;height:12px;background:rgba(10,52,128,.98);border-left:1.5px solid rgba(255,214,10,.65);border-top:1.5px solid rgba(255,214,10,.65);transform:rotate(45deg);border-radius:3px 0 0 0}'
  +'@media (prefers-reduced-motion:reduce){#tgNote{transition:opacity .2s;transform:none}}';
  document.head.appendChild(st);

  var tries=0;
  function init(){
    var lb=document.getElementById('tgBtn'),vh=document.getElementById('vHome');
    if(!lb||!vh){if(++tries<60)setTimeout(init,500);return}
    var t7=0,t15=0,tHide=0,note=null,openPending=true,wasOn=false,noteFromIdle=false;
    var homeOn=function(){return vh.classList.contains('on')&&!document.hidden&&!lb.classList.contains('open')};

    function attnOn(){if(homeOn())lb.classList.add('tgAttn')}
    function attnOff(){lb.classList.remove('tgAttn')}

    function noteHide(){clearTimeout(tHide);if(!note)return;var n=note;note=null;n.classList.remove('on');setTimeout(function(){n.remove()},350)}
    function noteShow(){
      if(note||!homeOn())return;
      var n=document.createElement('div');n.id='tgNote';n.setAttribute('role','status');
      n.innerHTML='<i></i><b>'+(ar()?'تحتاج مساعدة؟':'Need a hand?')+'</b><span>'+(ar()?'اضغط هنا لمشاهدة دليل الاستخدام':'Tap for a quick tour of the app')+'</span>';
      document.body.appendChild(n);note=n;
      var r=lb.getBoundingClientRect(),w=n.offsetWidth,cx=r.left+r.width/2,left=Math.max(8,Math.min(innerWidth-w-8,cx-w/2));
      n.style.top=(r.bottom+12)+'px';n.style.left=left+'px';
      n.querySelector('i').style.left=Math.max(14,Math.min(w-26,cx-left-6))+'px';
      n.style.transformOrigin=(cx-left)+'px -10px';
      n.addEventListener('click',function(e){e.stopPropagation();noteHide();lb.click()});
      requestAnimationFrame(function(){requestAnimationFrame(function(){n.classList.add('on')})});
      clearTimeout(tHide);tHide=setTimeout(noteHide,T_HIDE);
      try{navigator.vibrate&&navigator.vibrate(12)}catch(_){}
    }

    function schedule(){
      clearTimeout(t7);clearTimeout(t15);
      if(!homeOn())return;
      t7=setTimeout(attnOn,T_IDLE);                         /* 7ث سكون ← الأيقونة تنوّر وتنبض وتتهز */
      t15=setTimeout(function(){noteFromIdle=true;noteShow()},T_BUBBLE); /* 15ث سكون ← الفقاعة */
    }

    /* أي حركة: الأيقونة تقف، وأول حركة بعد فتح التطبيق تطلّع الإشعار */
    var lastAct=0;
    function onAct(e){
      var now=Date.now();if(now-lastAct<120&&e&&e.type!=='pointerdown')return;lastAct=now;
      var onIcon=e&&e.target&&lb.contains(e.target),onNote=e&&e.target&&note&&note.contains(e.target);
      var hadAttn=lb.classList.contains('tgAttn');
      attnOff();
      if(onNote)return;
      if(note&&e&&(e.type==='pointerdown'||e.type==='touchstart'||e.type==='keydown'))noteHide();
      if(openPending&&homeOn()){
        openPending=false;
        if(!onIcon&&hadAttn)setTimeout(noteShow,180);       /* بعد ما الأيقونة تهدى، الإشعار يطلع منها */
      }
      if(onIcon){noteHide();openPending=false}
      schedule();
    }
    ['pointerdown','touchstart','keydown','wheel','scroll'].forEach(function(ev){document.addEventListener(ev,onAct,{capture:true,passive:true})});

    /* فتح التطبيق / الرجوع له / الرجوع للواجهة الرئيسية */
    function opened(){
      openPending=true;noteHide();attnOff();
      if(!homeOn())return;
      if(!reduced||true)attnOn();                           /* توهج فوري عند الفتح */
      schedule();
    }
    document.addEventListener('visibilitychange',function(){if(document.hidden){attnOff();noteHide();clearTimeout(t7);clearTimeout(t15)}else opened()});
    window.addEventListener('pageshow',opened);
    new MutationObserver(function(){
      var on=vh.classList.contains('on');
      if(on&&!wasOn)opened();else if(!on){attnOff();noteHide();clearTimeout(t7);clearTimeout(t15)}
      wasOn=on;
    }).observe(vh,{attributes:true,attributeFilter:['class']});
    new MutationObserver(function(){if(lb.classList.contains('open')){attnOff();noteHide();clearTimeout(t7);clearTimeout(t15)}}).observe(lb,{attributes:true,attributeFilter:['class']});
    wasOn=vh.classList.contains('on');opened();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(init,600)});else setTimeout(init,600);
})();
