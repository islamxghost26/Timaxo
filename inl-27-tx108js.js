
(function(){
var R=document.documentElement,$=function(i){return document.getElementById(i)};
var A='<svg viewBox="0 0 24 24" aria-hidden="true">',Z='</svg>';
var IC={light:A+'<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6"/>'+Z,
blue:A+'<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5v17a8.5 8.5 0 0 0 0-17z" fill="currentColor"/>'+Z,
dark:A+'<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>'+Z};
var DOTS=A+'<circle cx="5.5" cy="12" r="1.7" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.7" fill="currentColor" stroke="none"/><circle cx="18.5" cy="12" r="1.7" fill="currentColor" stroke="none"/>'+Z;
function paint(){var th=$('thBtn');if(!th)return;var m=R.getAttribute('data-theme')||'blue';if(th.querySelector('svg')&&th.dataset.m===m)return;th.dataset.m=m;th.innerHTML=IC[m]||IC.blue;
 var mt=document.querySelector('meta[name=theme-color]');if(mt)mt.setAttribute('content',m==='dark'?'#000000':m==='light'?'#1B63F0':'#000515');}
function more(){var d=document.querySelector('#vHome .hdock');if(!d)return;[].forEach.call(d.children,function(b){if(b.tagName==='BUTTON'&&b.textContent.trim()==='\u22EF'){b.innerHTML=DOTS;}});}
function lib(){var l=$('libBtn'),r=document.querySelector('#vHome .docrow');if(l&&r&&l.parentNode!==r)r.appendChild(l);}
function all(){paint();more();lib();var th=$('thBtn');if(th&&!th._t108){th._t108=1;new MutationObserver(function(){if(!th.querySelector('svg'))paint();}).observe(th,{childList:true,characterData:true,subtree:true});}}
new MutationObserver(function(){paint();}).observe(R,{attributes:true,attributeFilter:['data-theme']});
var v=$('vHome');if(v)new MutationObserver(lib).observe(v,{childList:true});
function boot(){all();[300,900,1800,3200].forEach(function(t){setTimeout(all,t)});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
