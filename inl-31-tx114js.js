
(function(){
var open=null,poll=0;
function vib(p){try{if(localStorage.getItem('tx_hap')==='0')return;if(navigator.vibrate)navigator.vibrate(p)}catch(e){}}
function red(){return matchMedia('(prefers-reduced-motion:reduce)').matches}
var S='<svg viewBox="0 0 24 24">',E='</svg>';
var IC={cam:S+'<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"/><circle cx="12" cy="13" r="3.4"/>'+E,
gal:S+'<rect width="18" height="18" x="3" y="3" rx="3"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/>'+E,
blank:S+'<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/><path d="M14 2v4a2 2 0 0 0 2 2h4M9 13h6M9 17h4"/>'+E};
function close(fast){var o=open;if(!o)return;open=null;clearInterval(poll);
 var rm=function(){o.els.forEach(function(e){e.remove()})};
 if(fast||red()){rm();return}
 o.els.forEach(function(e){e.classList.add('out')});setTimeout(rm,240)}
window.__txFanClose=close;
function chooser(){
 if(open){vib(8);close();return}
 var ar=document.documentElement.lang!=='en',T=function(a,e){return ar?a:e};
 var fab=document.getElementById('scanBtn');if(!fab)return;
 var O=[['blank','#f59e0b',T('صفحة A4 فاضية','Blank A4 page'),T('ابدأ بورقة بيضا','Start with a white page')],
        ['gal','#8a5cf0',T('من المعرض أو PDF','Gallery or PDF'),T('صور أو ملف PDF','Photos or a PDF file')],
        ['cam','#2f7bff',T('تصوير بالكاميرا','Scan with camera'),T('قص وتحسين تلقائي','Auto-crop and enhance')]];
 var s=document.createElement('div');s.className='txfs';
 var f=document.createElement('div');f.className='txfan';f.setAttribute('role','menu');
 O.forEach(function(o,i){var b=document.createElement('button');b.type='button';b.className='row';b.style.setProperty('--c',o[1]);b.style.setProperty('--k',O.length-1-i);
  b.innerHTML='<span class="lb"><b></b><small></small></span><span class="ic">'+IC[o[0]]+'</span>';
  b.querySelector('b').textContent=o[2];b.querySelector('small').textContent=o[3];
  b.onclick=function(e){e.stopPropagation();vib(12);var m=document.querySelector('#fabMenu [data-a="'+o[0]+'"]');if(m)m.click();close(false)};f.appendChild(b)});
 var x=document.createElement('button');x.type='button';x.className='txx';x.setAttribute('aria-label',T('إغلاق','Close'));x.innerHTML=S+'<path d="M12 5v14M5 12h14"/>'+E;
 s.onclick=function(){close()};x.onclick=function(){vib(8);close()};
 document.body.appendChild(s);document.body.appendChild(f);document.body.appendChild(x);
 var r=fab.getBoundingClientRect();
 f.style.right=Math.max(8,innerWidth-r.right+(r.width-54)/2)+'px';f.style.bottom=(innerHeight-r.top+16)+'px';
 x.style.left=(r.left+r.width/2-23)+'px';x.style.top=(r.top+r.height/2-23)+'px';
 open={els:[s,f,x]};vib([14,24,10]);
 poll=setInterval(function(){var v=document.getElementById('vHome');if(!v||!v.classList.contains('on'))close(true)},250);
}
window.__txNewChooser=chooser;
document.addEventListener('keydown',function(e){if(e.key==='Escape')close()});
document.addEventListener('visibilitychange',function(){if(document.hidden)close(true)});
/* الضغط المطوّل على العدسة جوه مستند: نفس القايمة */
var fm=document.getElementById('fabMenu');
if(fm)new MutationObserver(function(){if(!fm.hidden){fm.hidden=true;if(!open)chooser()}}).observe(fm,{attributes:true,attributeFilter:['hidden']});
/* زر QR والبطاقة: في الرئيسية بس */
function sync(){var v=document.getElementById('vHome'),on=!!(v&&v.classList.contains('on'));
 var q=document.getElementById('qrFab');if(q)q.style.setProperty('display',on?'grid':'none','important');
 [].forEach.call(document.querySelectorAll('.fab2'),function(e){if(!on)e.style.setProperty('display','none','important');else e.style.removeProperty('display')})}
function hook(){var v=document.getElementById('vHome');if(!v)return false;if(v._t114)return true;v._t114=1;new MutationObserver(function(){sync();if(!v.classList.contains('on'))close(true)}).observe(v,{attributes:true,attributeFilter:['class']});sync();return true}
var n=0,iv=setInterval(function(){if(hook()||++n>40)clearInterval(iv)},250);
[300,1200,3000].forEach(function(d){setTimeout(function(){hook();sync()},d)});
})();
