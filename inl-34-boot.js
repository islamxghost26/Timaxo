
(function(){var R=document.documentElement,t=0;
function open(){return!!document.querySelector('#mrBg.in,.txls,.mdl-bd,#scrim.on,.sheet.on,#txS,#qrOv,.txfan-open')||R.classList.contains('txfan-open')}
function off(){if(open()){t=setTimeout(off,900);return}t=0;R.classList.remove('txcalm')}
function calm(){if(!R.classList.contains('txcalm'))R.classList.add('txcalm');clearTimeout(t);t=setTimeout(off,1400)}
['pointerdown','touchstart','keydown'].forEach(function(e){addEventListener(e,calm,{capture:true,passive:true})});
addEventListener('scroll',calm,{capture:true,passive:true});
})();
