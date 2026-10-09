const CACHE='timaxo-v3';
self.addEventListener('install',()=>{});            // مفيش skipWaiting تلقائي: البانر هو اللي بيطلبه
self.addEventListener('message',e=>{if(e.data==='skip')self.skipWaiting()});
self.addEventListener('activate',e=>e.waitUntil(
  caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET')return;
  const same=new URL(r.url).origin===location.origin;
  if(same){ // ملفات التطبيق: النت الأول، والكاش للأوفلاين
    e.respondWith(fetch(r,{cache:'no-cache'}).then(res=>{const c=res.clone();caches.open(CACHE).then(x=>x.put(r,c));return res})
      .catch(()=>caches.match(r).then(m=>m||caches.match('index.html'))));
  }else{ // خطوط ومكتبات خارجية: الكاش الأول
    e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{if(res&&(res.ok||res.type==='opaque')){const c=res.clone();caches.open(CACHE).then(x=>x.put(r,c))}return res})));
  }
});
