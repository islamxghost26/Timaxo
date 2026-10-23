(function(){var s=document.getElementById('splash'),b=document.getElementById('sbeam');if(!s)return;
var dn=0;function done(){if(dn||!s.parentNode)return;dn=1;var pr=document.getElementById('pre');if(pr)pr.remove();s.classList.add('out');setTimeout(function(){s.remove()},650)}
var im=s.querySelector('img'),rd=0;function go(){if(rd)return;rd=1;requestAnimationFrame(function(){requestAnimationFrame(function(){s.classList.add('rdy');setTimeout(done,1750)})})}
try{(im&&im.decode?im.decode():Promise.resolve()).then(go,go)}catch(e){go()}setTimeout(go,1200);s.addEventListener('pointerdown',function(){if(s.classList.contains('rdy'))done()});
if(typeof window.show==='function'){var o=window.show;window.show=function(){try{b.classList.remove('go');void b.offsetWidth;b.classList.add('go')}catch(e){}return o.apply(this,arguments)}}
})();