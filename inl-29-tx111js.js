
(function(){
var R=document.documentElement;
function vib(p){try{if(localStorage.getItem('tx_hap')==='0')return;if(navigator.vibrate)navigator.vibrate(p)}catch(e){}}
function red(){return matchMedia('(prefers-reduced-motion:reduce)').matches}
var S='<svg viewBox="0 0 24 24">',E='</svg>';
var IC={cam:S+'<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"/><circle cx="12" cy="13" r="3.4"/>'+E,
gal:S+'<rect width="18" height="18" x="3" y="3" rx="3"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/>'+E,
blank:S+'<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/><path d="M14 2v4a2 2 0 0 0 2 2h4M9 13h6M9 17h4"/>'+E};
var open=null;
function close(fast,cb){var o=open;if(!o)return;open=null;R.classList.remove('txfan-open');
 var done=function(){o.s.remove();o.f.remove();cb&&cb()};
 if(fast||red()||!o.f.animate){done();return}
 var rows=[].slice.call(o.f.children);
 rows.forEach(function(r,i){r.animate([{opacity:1,transform:'none'},{opacity:0,transform:'translateY('+(60+i*0)+'px) scale(.4)'}],{duration:200,delay:(rows.length-1-i)*30,easing:'cubic-bezier(.5,0,1,.6)',fill:'forwards'})});
 var a=o.s.animate([{opacity:1},{opacity:0}],{duration:240,fill:'forwards'});a.onfinish=done;}
window.__txNewChooser=function(){
 if(open){vib(8);close();return}
 var ar=document.documentElement.lang!=='en',T=function(a,e){return ar?a:e};
 var host=document.getElementById('vHome')||document.body,fab=document.getElementById('scanBtn');if(!fab)return;
 var O=[['blank','#f59e0b',T('صفحة A4 فاضية','Blank A4 page'),T('ابدأ بورقة بيضا','Start with a white page')],
        ['gal','#8a5cf0',T('من المعرض أو PDF','Gallery or PDF'),T('صور أو ملف PDF','Photos or a PDF file')],
        ['cam','#2f7bff',T('تصوير بالكاميرا','Scan with camera'),T('قص وتحسين تلقائي','Auto-crop and enhance')]];
 var s=document.createElement('div');s.className='txfs';var f=document.createElement('div');f.className='txfan';f.setAttribute('role','menu');
 O.forEach(function(o){var b=document.createElement('button');b.type='button';b.className='row';b.style.setProperty('--c',o[1]);
  b.innerHTML='<span class="lb"><b></b><small></small></span><span class="ic">'+IC[o[0]]+'</span>';
  b.querySelector('b').textContent=o[2];b.querySelector('small').textContent=o[3];
  b.onclick=function(e){e.stopPropagation();vib(12);close(false,function(){var m=document.querySelector('#fabMenu [data-a="'+o[0]+'"]');if(m)m.click()})};f.appendChild(b)});
 s.onclick=function(){close()};
 host.appendChild(s);host.appendChild(f);
 var r=fab.getBoundingClientRect();
 f.style.right=Math.max(8,innerWidth-r.right+(r.width-54)/2)+'px';
 f.style.bottom=(innerHeight-r.top+16)+'px';
 open={s:s,f:f};R.classList.add('txfan-open');vib([14,24,10]);
 if(!red()&&f.animate){
  s.animate([{opacity:0},{opacity:1}],{duration:220,fill:'both'});
  var rows=[].slice.call(f.children),n=rows.length;
  rows.forEach(function(row,i){var k=n-1-i; /* الأقرب للعدسة يطلع الأول */
   row.animate([{opacity:0,transform:'translateY('+(70+k*52)+'px) scale(.3)'},{opacity:1,transform:'none'}],{duration:460,delay:k*70,easing:'cubic-bezier(.34,1.45,.5,1)',fill:'both'});
   var ic=row.querySelector('.ic');ic.animate([{transform:'rotate(-120deg) scale(.5)'},{transform:'none'}],{duration:520,delay:k*70,easing:'cubic-bezier(.34,1.6,.5,1)',fill:'both'});
   row.querySelector('.lb').animate([{opacity:0,transform:'translateX(18px) scale(.9)'},{opacity:1,transform:'none'}],{duration:340,delay:k*70+140,easing:'cubic-bezier(.2,.8,.2,1)',fill:'both'});});
 }
};
document.addEventListener('keydown',function(e){if(e.key==='Escape')close()});
addEventListener('scroll',function(){close(true)},true);
})();
