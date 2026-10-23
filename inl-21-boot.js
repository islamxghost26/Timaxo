
/* v43: lock rotation at the CURRENT orientation (installed PWA on Android; not iOS) */
(function(){var K='tx_land';function on(){try{return localStorage.getItem(K)==='1'}catch(e){return false}}
async function apply(v,gesture){var o=screen.orientation;if(!o||!o.lock)throw new Error('no');
  if(!v){if(o.unlock)o.unlock();try{if(document.fullscreenElement&&document.exitFullscreen)await document.exitFullscreen()}catch(e){}return}
  var ty=o.type||'portrait-primary',fam=ty.indexOf('landscape')===0?'landscape':'portrait';
  async function lk(){try{await o.lock(ty)}catch(e){await o.lock(fam)}}
  try{await lk()}catch(e){
    if(!gesture)throw e;var el=document.documentElement;if(!el.requestFullscreen)throw e;
    await el.requestFullscreen();await lk()}}
window.__txLandOn=on;
window.__txLand=async function(v){try{await apply(v,true);try{localStorage.setItem(K,v?'1':'0')}catch(e){}return true}catch(e){return false}};
if(on())apply(true).catch(function(){});
document.addEventListener('visibilitychange',function(){if(!document.hidden&&on())apply(true).catch(function(){})});})();
