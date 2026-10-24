/* Timaxo: صفحة استقبال رد Google OAuth. بتقرأ الـtoken من الـhash وتبلّغ التطبيق وتقفل نفسها (أو ترجع للتطبيق لو مش نافذة منبثقة) */
(function(){
 var h=new URLSearchParams(location.hash.slice(1)),q=new URLSearchParams(location.search);
 var d={state:h.get('state')||q.get('state')||'',token:h.get('access_token')||'',exp:+h.get('expires_in')||3600,error:h.get('error')||q.get('error')||(h.get('access_token')?'':'no_token')};
 try{history.replaceState(null,'',location.pathname)}catch(e){}
 try{if('BroadcastChannel' in window){var c=new BroadcastChannel('timaxo-drive');c.postMessage(d);c.close();}}catch(e){}
 try{localStorage.setItem('tx_drv_cb',JSON.stringify(d));}catch(e){}
 var mode=(d.state||'').charAt(0);
 if(mode==='r'){location.replace('./?drive=1');return;}
 setTimeout(function(){try{window.close();}catch(e){}document.getElementById('m').textContent=d.error?'تعذّر الربط، ارجع للتطبيق':'تم الربط ✓ تقدر ترجع للتطبيق';},250);
})();
