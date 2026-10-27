(function(){'use strict';
var out=document.getElementById('o');function log(s){out.textContent+=s+'\n'}
var VB=new URL('vendor/',document.baseURI).href;
document.addEventListener('securitypolicyviolation',function(e){log('CSP[page] '+e.violatedDirective+' blocked '+e.blockedURI)});
function wtest(code,label){return new Promise(function(res){
  var u=URL.createObjectURL(new Blob([code],{type:'application/javascript'})),w;
  try{w=new Worker(u)}catch(e){log(label+': WORKER-CREATE-FAIL '+e);return res()}
  var t=setTimeout(function(){log(label+': TIMEOUT');w.terminate();res()},20000);
  w.onmessage=function(e){log(label+': '+e.data);if(/^(OK|FAIL)/.test(e.data)){clearTimeout(t);w.terminate();res()}};
  w.onerror=function(e){clearTimeout(t);log(label+': ERROR '+(e.message||'worker error')+' '+(e.filename||''));w.terminate();res()};
})}
function imp(url){return 'self.addEventListener("securitypolicyviolation",function(e){postMessage("CSP "+e.violatedDirective+" blocked "+e.blockedURI)});try{importScripts("'+url+'");postMessage("OK")}catch(e){postMessage("FAIL "+e.message)}'}
var FILES=['tesseract/tesseract.min.js','tesseract/worker.min.js','tesseract-core/tesseract-core-simd-lstm.wasm.js','tesseract-core/tesseract-core-lstm.wasm.js','tesseract-core/tesseract-core-simd.wasm.js','tesseract-core/tesseract-core.wasm.js','tessdata/fast/eng.traineddata.gz','tessdata/fast/ara.traineddata.gz'];
async function run(){
  out.textContent='';log('UA '+navigator.userAgent);log('SW controller: '+(navigator.serviceWorker&&navigator.serviceWorker.controller?'yes':'no'));
  log('\n[1] fetch from page');
  for(var i=0;i<FILES.length;i++){try{var r=await fetch(VB+FILES[i],{cache:'no-store'});var b=await r.arrayBuffer();log((r.ok?'OK ':'BAD ')+r.status+' '+(r.headers.get('content-type')||'')+' '+b.byteLength+'  '+FILES[i])}catch(e){log('FAIL '+FILES[i]+' '+e.message)}}
  log('\n[2] importScripts inside a blob worker');
  await wtest(imp(VB+'tesseract/worker.min.js'),'worker.min.js');
  await wtest(imp(VB+'tesseract-core/tesseract-core-simd-lstm.wasm.js'),'core simd-lstm');
  await wtest(imp(VB+'tesseract-core/tesseract-core-lstm.wasm.js'),'core lstm');
  log('\n[3] full createWorker (eng, fast)');
  try{
    await new Promise(function(ok,no){var s=document.createElement('script');s.src=VB+'tesseract/tesseract.min.js';s.onload=ok;s.onerror=function(){no(new Error('tesseract.min.js blocked'))};document.head.appendChild(s)});
    var w=await Tesseract.createWorker('eng',1,{workerPath:VB+'tesseract/worker.min.js',corePath:VB+'tesseract-core',langPath:VB+'tessdata/fast'});
    log('createWorker: OK');await w.terminate();
  }catch(e){log('createWorker FAIL: '+(e&&e.message||e))}
  log('\nDONE');
}
document.getElementById('go').onclick=function(){run().catch(function(e){log('ERR '+e);log('DONE')})};
})();
