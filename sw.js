const CACHE='timaxo-v168';
const VCACHE='timaxo-vendor-v2'; // مكتبة OCR وبيانات اللغة: كاش منفصل عشان ميتمسحش مع كل تحديث
const VENDOR_PRE=['vendor/tesseract/tesseract.min.js','vendor/tesseract/worker.min.js','vendor/tessdata/fast/ara.traineddata.gz','vendor/tessdata/fast/eng.traineddata.gz','vendor/edge/blaze_face_short_range.onnx']; // الباقي (core وبيانات best) بيتخزن أول استخدام
const SHELL=['./','index.html','manifest.webmanifest','favicon.png','icon-192.png','font-Cairo.woff','font-NotoSansArabic.woff','font-Inter.woff','apple-touch-icon.png','edge-model.js','edge-hybrid.js','edge-learn.js','filters.js','fields.js','ocr-models.js','ocr-onnx.js','table-engine.js','table-export.js','translate.js','tool-order.js','ui-polish.js','assistant.js','assistant-face.js','bg-dark.jpg','bg-black.jpg','bg-light.jpg'];
const badRes=r=>!r||!r.ok||/text\/html/i.test(r.headers.get('content-type')||''); // v159: الـSPA fallback بيرجّع index.html بكود 200 لأي ملف ناقص، وكان بيتخزّن في الكاش للأبد
self.addEventListener('install',e=>e.waitUntil(Promise.all([caches.open(CACHE).then(c=>Promise.all(SHELL.map(u=>c.add(u).catch(()=>{})))),caches.open(VCACHE).then(c=>Promise.all(VENDOR_PRE.map(u=>c.match(u).then(h=>h||fetch(u).then(r=>{if(!badRes(r))return c.put(u,r)})).catch(()=>{}))))])));            // مفيش skipWaiting تلقائي: البانر هو اللي بيطلبه
self.addEventListener('message',e=>{if(e.data==='skip')self.skipWaiting()});
self.addEventListener('activate',e=>e.waitUntil(
  caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE&&x!==VCACHE&&x!=='timaxo-ocr-v2'&&x!=='timaxo-share').map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method==='POST'&&new URL(r.url).searchParams.get('share')==='1'){e.respondWith((async()=>{try{const fd=await r.formData(),fs=fd.getAll('media').filter(f=>f&&f.size),c=await caches.open('timaxo-share');for(const k of await c.keys())await c.delete(k);let i=0;for(const f of fs)await c.put('/__share/'+(i++),new Response(f,{headers:{'Content-Type':f.type||'image/jpeg'}}));}catch(x){}return Response.redirect('./?shared=1',303);})());return;}
  if(r.method!=='GET')return;
  const same=new URL(r.url).origin===location.origin;
  if(!same&&/huggingface\.co\/(SWHL|pitapo)\/rapidocr|PaddlePaddle\/PaddleOCR|\/npm\/@gutenye\/ocr-models@/.test(r.url))return; // نماذج OCR بتتخزّن في كاش vendor من ocr-models.js بس
  if(!same&&/\/npm\/onnxruntime-web@/.test(r.url))return; // المحرك بيتخزن في كاش vendor من صفحة الإعداد؛ مفيش داعي لنسخة تانية في كاش التطبيق
  if(same&&new URL(r.url).pathname.indexOf('/models/ocr/')>=0){ // نماذج OCR المتضمّنة: الكاش الخاص أولًا (ocr-models.js هو اللي بيخزّن)، من غير تحديث في الخلفية
    e.respondWith(caches.open('timaxo-ocr-v2').then(c=>c.match(r).then(m=>m||fetch(r))));return;
  }
  if(same&&new URL(r.url).pathname.indexOf('/vendor/')>=0){ // ملفات OCR المحلية: الكاش الأول بدون تحديث في الخلفية (ملفات كبيرة)
    e.respondWith(caches.open(VCACHE).then(async c=>{const m=await c.match(r);if(m&&!badRes(m))return m;if(m)await c.delete(r);const res=await fetch(r);if(!badRes(res))c.put(r,res.clone());return res;}));return;
  }
  if(same){ // ملفات التطبيق: النت الأول، والكاش للأوفلاين
    e.respondWith(caches.match(r).then(m=>{const net=fetch(r,{cache:'no-cache'}).then(res=>{if(res&&res.ok){const c=res.clone();caches.open(CACHE).then(x=>x.put(r,c));}return res}).catch(()=>m||caches.match('index.html'));
      return m||net;})); // الكاش الأول (فتح فوري) + تحديث في الخلفية
  }else{ // خطوط ومكتبات خارجية: الكاش الأول
    e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{if(res&&(res.ok||res.type==='opaque')){const c=res.clone();caches.open(CACHE).then(x=>x.put(r,c))}return res})));
  }
});
