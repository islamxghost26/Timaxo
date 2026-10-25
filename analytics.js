/* Timaxo · قياس استخدام مجهول عبر Umami Cloud.
   مقفول تماماً لحد ما يتحط الـWebsite ID تحت. بدون cookies، وبدون أي مستند أو نص أو بيانات شخصية: أسماء أحداث بس (فتح الكاميرا، نوع الملف المصدَّر).
   بيحترم «عدم التتبع» في المتصفح، وفيه مفتاح إيقاف في الإعدادات (tx_analytics). */
(function(){'use strict';
var ID='';
var SRC='https://cloud.umami.is/script.js',LS=null;try{LS=localStorage}catch(e){}
function enabled(){return !!ID}
function on(){try{return !!ID&&(!LS||LS.getItem('tx_analytics')!=='0')&&navigator.doNotTrack!=='1'&&window.doNotTrack!=='1'}catch(e){return false}}
function track(n,d){try{if(!on())return;var u=window.umami;if(u&&typeof u.track==='function'){if(d)u.track(n,d);else u.track(n)}}catch(e){}}
function load(){try{if(!on()||document.getElementById('txa'))return;var s=document.createElement('script');s.id='txa';s.defer=true;s.src=SRC;s.setAttribute('data-website-id',ID);s.setAttribute('data-do-not-track','true');(document.head||document.documentElement).appendChild(s)}catch(e){}}
function setOn(v){try{if(LS)LS.setItem('tx_analytics',v?'1':'0')}catch(e){}if(v)load()}
window.TXA={enabled:enabled,track:track,setOn:setOn};
if(!ID)return;
load();
try{document.addEventListener('click',function(e){var t=e.target&&e.target.closest;if(!t)return;if(e.target.closest('#camIn'))track('camera_open');else if(e.target.closest('[data-m="ocr"]'))track('ocr_mode')},true)}catch(e){}
try{var oc=HTMLAnchorElement.prototype.click;HTMLAnchorElement.prototype.click=function(){try{if(this.download){var m=/\.([a-z0-9]{2,5})$/i.exec(this.download);track('export',{type:m?m[1].toLowerCase():'file'})}}catch(e){}return oc.apply(this,arguments)}}catch(e){}
try{addEventListener('appinstalled',function(){track('install')})}catch(e){}
})();
