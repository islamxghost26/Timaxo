/* v151: ONE update coordinator (SW waiting + changed index.html) — banner once, one tap, one reload */
(function(){var K='timaxo_html_hash',D='tx_upd_done',shown=0,busy=0,pend=null;
 async function sha(t){var b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(t));return Array.from(new Uint8Array(b)).map(function(x){return x.toString(16).padStart(2,'0')}).join('')}
 async function fresh(){var r=await fetch('index.html?_='+Date.now(),{cache:'no-store'});if(!r.ok)throw 0;return sha(await r.text())}
 function recent(){try{return Date.now()-(+localStorage.getItem(D)||0)<120000}catch(e){return false}}
 function offer(hh,w){if(hh)pend=hh;if(shown||recent())return;if(document.querySelector('.upd'))return;shown=1;
  var b=document.createElement('button');b.className='upd';b.type='button';txUpdFill(b);b.onclick=function(){apply(b)};document.body.appendChild(b)}
 async function apply(b){if(busy)return;busy=1;txUpdFill(b,1);
  try{localStorage.setItem(D,String(Date.now()))}catch(e){}
  try{localStorage.setItem(K,pend||await fresh())}catch(e){}
  var done=0,go=function(){if(done)return;done=1;location.reload()},reg=null;
  try{reg=await navigator.serviceWorker.getRegistration()}catch(e){}
  if(reg){
   navigator.serviceWorker.addEventListener('controllerchange',go);
   try{if(!reg.waiting){await reg.update();var w=reg.installing;if(w&&w.state!=='installed'&&w.state!=='activated')await new Promise(function(res){w.addEventListener('statechange',function(){if(w.state==='installed'||w.state==='activated')res()});setTimeout(res,6000)})}}catch(e){}
   if(reg.waiting){reg.waiting.postMessage('skip');setTimeout(go,4000);return}
  }
  try{var k=await caches.keys();await Promise.all(k.filter(function(x){return /^timaxo-v\d+$/.test(x)}).map(function(x){return caches.delete(x)}))}catch(e){}
  go()}
 window.TXU={offer:offer};
 async function check(){if(!navigator.onLine||shown||recent())return;try{var hh=await fresh(),o=localStorage.getItem(K);if(!o){localStorage.setItem(K,hh);return}if(o!==hh)offer(hh)}catch(e){}}
 addEventListener('load',function(){setTimeout(check,800)});document.addEventListener('visibilitychange',function(){if(!document.hidden){var n=Date.now();if(n-(window.__txLc||0)<900000)return;window.__txLc=n;setTimeout(check,4000)}})})();