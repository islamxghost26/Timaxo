
/* ===== v49: elastic pull-to-switch theme button + spinning globe language button next to the logo ===== */
(function(){
'use strict';
var R=document.documentElement;
function hap(n){try{if(localStorage.getItem('tx_hap')!=='0'&&navigator.vibrate)navigator.vibrate(n)}catch(e){}}
function red(){return matchMedia('(prefers-reduced-motion:reduce)').matches}
function ar(){return R.lang!=='en'}
var st=document.createElement('style');
st.textContent='#vHome .hdock>#thBtn{touch-action:none;position:relative;z-index:3;will-change:transform;-webkit-tap-highlight-color:transparent;-webkit-user-select:none;user-select:none}'
+'#vHome .hdock>#thBtn.pull{transition:none!important}'
+'#vHome .hdock>#thBtn.snap{transition:transform .6s cubic-bezier(.34,1.7,.5,1),background .15s!important}'
+'#vHome .hdock>#thBtn.armed{background:rgba(255,255,255,.28)!important}'
+'.txband{position:fixed;left:0;top:0;width:100px;height:3px;border-radius:3px;pointer-events:none;z-index:9998;transform-origin:0 50%;background:linear-gradient(90deg,rgba(255,255,255,.15),rgba(255,255,255,.9));will-change:transform;opacity:0}'
+'.txring{position:fixed;left:0;top:0;width:200px;height:200px;box-sizing:border-box;border-radius:50%;border:2px solid rgba(255,255,255,.7);pointer-events:none;z-index:9999;will-change:transform,opacity;animation:txring .8s cubic-bezier(.22,1,.36,1) forwards}'
+'@keyframes txring{0%{transform:translate(var(--x),var(--y)) translate(-50%,-50%) scale(0);opacity:var(--o,.9)}70%{opacity:calc(var(--o,.9)*.5)}100%{transform:translate(var(--x),var(--y)) translate(-50%,-50%) scale(var(--s));opacity:0}}'
+'#vHome .brand #globeBtn{flex:none;position:relative;width:32px;height:32px;margin:0;padding:0;border-radius:50%;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.1);color:#fff;display:grid;place-items:center;perspective:120px;-webkit-tap-highlight-color:transparent;transition:background .15s,transform .12s}'
+'#vHome .brand #globeBtn:active{background:rgba(255,255,255,.22);transform:scale(.9)}'
+'#globeBtn svg{width:19px;height:19px}'
+'#globeBtn i{position:absolute;inset-inline-end:-4px;bottom:-3px;font:800 8px/1 system-ui,sans-serif;font-style:normal;padding:2px 3px;border-radius:6px;background:#fff;color:#0B3BB5;pointer-events:none}'
+'#globeBtn.spin svg{animation:txspin .8s cubic-bezier(.45,.05,.2,1)}'
+'@keyframes txspin{0%{transform:rotateY(0) scale(1)}40%{transform:rotateY(180deg) scale(1.18)}100%{transform:rotateY(360deg) scale(1)}}'
+'@media (max-width:340px){#globeBtn i{display:none}}'
+'@media (prefers-reduced-motion:reduce){#globeBtn.spin svg{animation:none}.txring{display:none}}';
document.head.appendChild(st);

function ring(x,y,p){
 if(red())return;
 var r=Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y)),d=document.createElement('div');
 d.className='txring';d.style.setProperty('--x',x+'px');d.style.setProperty('--y',y+'px');d.style.setProperty('--s',(1.8*r/200).toFixed(2));d.style.setProperty('--o',(.55+.45*(p||0)).toFixed(2));
 document.body.appendChild(d);setTimeout(function(){d.remove()},900);
}

function initTheme(){
 var b=document.getElementById('thBtn');
 if(!b||!b.parentNode||b._v49)return !!(b&&b._v49);
 b._v49=1;
 var dock=b.parentNode,TH=34,MAX=80,DEAD=7,id=null,ox=0,oy=0,sx=0,sy=0,pull=0,armed=0,sup=0,mag=0,ang=0,band=null,t=0,lvl=0;
 function center(){var r=b.getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height/2}}
 function bandAt(len,a,k){return 'translate('+ox+'px,'+(oy-1.5)+'px) rotate('+a+'rad) scale('+(len/100)+','+k+')'}
 b.addEventListener('pointerdown',function(e){
  if(id!==null||(e.button&&e.button!==0))return;
  id=e.pointerId;var c=center();ox=c.x;oy=c.y;sx=e.clientX;sy=e.clientY;pull=0;armed=0;mag=0;clearTimeout(t);
  try{b.setPointerCapture(id)}catch(_){}
 });
 b.addEventListener('pointermove',function(e){
  if(e.pointerId!==id)return;
  var dx=e.clientX-sx,dy=e.clientY-sy;mag=Math.hypot(dx,dy);
  if(!pull){
   if(mag<DEAD)return;
   pull=1;
   if(!band){band=document.createElement('div');band.className='txband';document.body.appendChild(band)}
   b.classList.remove('snap');b.classList.add('pull');band.style.transition='none';band.style.opacity=1;
  }
  var k=mag?MAX*Math.tanh(mag/MAX)/mag:0,ex=dx*k,ey=dy*k,len=Math.hypot(ex,ey);
  ang=Math.atan2(ey,ex);
  b.style.transform='translate('+ex+'px,'+ey+'px) scale('+(1+Math.min(mag,MAX)/260)+')';
  band.style.transform=bandAt(len,ang,Math.max(.35,1-len/140));
  if(!armed&&mag>=TH){armed=1;lvl=0;b.classList.add('armed');hap(8)}
  else if(armed&&mag<TH-8){armed=0;b.classList.remove('armed')}
  if(armed){var q=Math.min(4,Math.floor((mag-TH)/28));if(q>lvl){lvl=q;hap(5+q*3)}else if(q<lvl)lvl=Math.max(q,0)}
 });
 function end(e){
  if(e.pointerId!==id)return;
  id=null;try{b.releasePointerCapture(e.pointerId)}catch(_){}
  if(!pull)return;
  pull=0;sup=1;setTimeout(function(){sup=0},120);
  var go=armed&&e.type==='pointerup',p=Math.min(1,mag/150),sg=Math.cos(ang)>=0?-1:1;
  if(e.type==='pointerup'){
   hap([Math.round(10+p*40),28,Math.round(6+p*18),40,Math.round(3+p*10)]);
   if(!red()&&b.animate){var A=Math.round(8+p*22);try{b.animate({rotate:['0deg',sg*A+'deg',-sg*A*.7+'deg',sg*A*.45+'deg',-sg*A*.22+'deg','0deg'],scale:[1,1+p*.22,1-p*.12,1+p*.07,1-p*.03,1],offset:[0,.2,.45,.68,.85,1]},{duration:Math.round(560+p*260),delay:70,easing:'cubic-bezier(.3,0,.3,1)'})}catch(_){}}
  }
  b.classList.remove('pull','armed');b.classList.add('snap');b.style.transform='';
  band.style.transition='transform .6s cubic-bezier(.34,1.7,.5,1),opacity .35s .15s';
  band.style.transform=bandAt(0,ang,1);band.style.opacity=0;
  if(go)setTimeout(function(){
   var c=center();ring(c.x,c.y,p);
   if(typeof b.onclick==='function')b.onclick({clientX:c.x,clientY:c.y});else b.click();
  },170);
  t=setTimeout(function(){b.classList.remove('snap')},700);
 }
 b.addEventListener('pointerup',end);b.addEventListener('pointercancel',end);
 dock.addEventListener('click',function(e){
  if(!e.target.closest||!e.target.closest('#thBtn'))return;
  if(sup){e.stopPropagation();e.preventDefault();return}
  var c=center();ring(c.x,c.y);
 },true);
 return true;
}

function langSwap(lb,g){
 var toEn=ar();
 if(!document.startViewTransition||red()){lb.click();return}
 try{
  g.style.viewTransitionName='txglobe';
  var vt=document.startViewTransition(function(){lb.click()});
  vt.ready.then(function(){
   R.animate({opacity:[0,1]},{duration:240,easing:'ease-out',pseudoElement:'::view-transition-new(root)'});
  }).catch(function(){});
  vt.finished.then(function(){g.style.viewTransitionName=''},function(){g.style.viewTransitionName=''});
 }catch(e){g.style.viewTransitionName='';lb.click()}
}
function initGlobe(){
 if(document.getElementById('globeBtn'))return true;
 var br=document.querySelector('#vHome .top .brand'),lb=document.getElementById('langBtn');
 if(!br||!lb)return false;
 var g=document.createElement('button');g.id='globeBtn';g.type='button';
 g.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18M4.6 7.5h14.8M4.6 16.5h14.8"/></svg><i></i>';
 br.appendChild(g);
 var bd=g.querySelector('i');
 function paint(){bd.textContent=lb.textContent.trim();g.setAttribute('aria-label',ar()?'تغيير اللغة':'Change language')}
 paint();
 new MutationObserver(paint).observe(lb,{childList:true,characterData:true,subtree:true});
 new MutationObserver(paint).observe(R,{attributes:true,attributeFilter:['lang']});
 var busy=0;
 g.addEventListener('click',function(){
  if(busy)return;busy=1;hap(10);
  g.classList.remove('spin');void g.offsetWidth;g.classList.add('spin');
  setTimeout(function(){langSwap(lb,g)},red()?0:140);
  setTimeout(function(){g.classList.remove('spin');busy=0},800);
 });
 return true;
}

var n=0,iv=setInterval(function(){var a=initGlobe(),b=initTheme();if((a&&b)||++n>40)clearInterval(iv)},300);
})();
