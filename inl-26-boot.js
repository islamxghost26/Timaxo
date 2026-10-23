
(function(){function go(){try{var lt=document.getElementById('libBtn'),vh=document.getElementById('vHome');if(lt&&vh&&lt.parentNode!==vh)vh.appendChild(lt);var gb=document.getElementById('globeBtn'),br=document.querySelector('#vHome .top .brand');if(gb&&br&&gb.parentNode===br)br.insertAdjacentElement('afterend',gb);var lb=document.getElementById('asgBtn');if(!lb)return setTimeout(go,300);

lb.addEventListener('click',function(){lb.classList.remove('ignite');void lb.offsetWidth;lb.classList.add('ignite');try{navigator.vibrate&&navigator.vibrate([14,40,22])}catch(_){}},true)}catch(e){}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(go,400)});else setTimeout(go,400)})();
