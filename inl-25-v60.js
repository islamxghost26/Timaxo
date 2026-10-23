
/* ===== v60: fix globe language badge visibility, relabel stuck English buttons, distinct icons for Extract text / Split book ===== */
(function(){
var st=document.createElement('style');
st.textContent='#vHome .brand,#vHome .top{overflow:visible!important}'
+'#vHome .brand #globeBtn{width:36px!important;height:36px!important;overflow:visible!important}'
+'#globeBtn svg{width:20px!important;height:20px!important;margin-block-end:7px;margin-inline-end:7px}'
+'#globeBtn i{display:block!important;inset-inline-end:3px!important;bottom:3px!important;min-width:17px;box-sizing:border-box;text-align:center;font:800 10px/1 Cairo,system-ui,sans-serif!important;padding:2px 3px!important;border-radius:7px!important;background:#fff!important;color:#0B2A8F!important;box-shadow:0 0 0 1.5px rgba(8,20,80,.55);z-index:2}';
document.head.appendChild(st);
var SV=function(p){return '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">'+p+'</svg>'};
var IC={ocrB:SV('<path d="M6 3h8l5 5v13H6z"/><path d="M14 3v5h5M9 13h7M9 17h5"/>'),
 bookB:SV('<path d="M12 6c-2-1.5-5-2-8-1.5v13c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5v-13C17 4 14 4.5 12 6z"/><path d="M12 6v13"/>')};
function icons(){var done=0;for(var id in IC){var b=document.getElementById(id);if(!b)continue;var s=b.querySelector('svg');if(s&&!s.dataset.v60){var t=document.createElement('span');t.innerHTML=IC[id];var n=t.firstChild;n.dataset.v60='1';s.replaceWith(n);}done++;}return done>=2}
var n=0,iv=setInterval(function(){if(icons()||++n>30)clearInterval(iv)},300);
})();
