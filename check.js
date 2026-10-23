
var F=["vendor/edge/ort/ort.wasm.min.js","vendor/edge/ort/ort-wasm-simd.wasm","vendor/edge/ort/ort-wasm-simd-threaded.wasm","vendor/edge/model.onnx","vendor/tesseract/tesseract.min.js","vendor/tesseract/worker.min.js","vendor/tesseract-core/tesseract-core.wasm.js","vendor/tesseract-core/tesseract-core-simd.wasm.js","vendor/tesseract-core/tesseract-core-lstm.wasm.js","vendor/tesseract-core/tesseract-core-simd-lstm.wasm.js","vendor/tessdata/fast/ara.traineddata.gz","vendor/tessdata/fast/eng.traineddata.gz","models/ocr/det.onnx","models/ocr/det-fast.onnx","models/ocr/rec-arabic.onnx","models/ocr/rec-latin.onnx","models/ocr/dict-arabic.txt","models/ocr/dict-latin.txt","sw.js","privacy.html"];
var out=[],bad=0,t=document.getElementById("t");
(async function(){
for(var i=0;i<F.length;i++){var u=F[i],st,ct="",len="",ok=false;
try{var r=await fetch(u+"?chk="+Date.now(),{cache:"no-store"});st=r.status;ct=r.headers.get("content-type")||"";len=r.headers.get("content-length")||"";ok=r.ok&&!/text\/html/i.test(ct)||u==="privacy.html"&&r.ok;try{r.body&&r.body.cancel()}catch(e){}}catch(e){st="ERR"}
if(!ok)bad++;out.push((ok?"OK  ":"BAD ")+u+" "+st+" "+ct+" "+len);
var tr=document.createElement("tr");tr.innerHTML="<td class='"+(ok?"ok":"bad")+"'>"+(ok?"✓":"✗")+"</td><td></td><td>"+st+"</td>";tr.children[1].textContent=u+" · "+ct+" "+len;t.appendChild(tr)}
var cl=[];try{cl=JSON.parse(localStorage.getItem("tx_csp")||"[]")}catch(e){}out.push("CSP-VIOLATIONS:"+cl.length);cl.forEach(function(r){out.push("CSP "+r.join(" | "));var tr=document.createElement("tr");tr.innerHTML="<td class='bad'>CSP</td><td></td><td></td>";tr.children[1].textContent=r.join(" | ");t.appendChild(tr)});var sw="";try{var rg=await navigator.serviceWorker.getRegistrations();sw="SW:"+rg.length}catch(e){sw="SW:?"}
out.push(sw+" UA:"+navigator.userAgent);
document.getElementById("s").textContent=bad?("ناقص أو غلط: "+bad+" ملف"):"كل الملفات موجودة ✓"})();
document.getElementById("c").onclick=function(){var s=out.join("\n");try{navigator.clipboard.writeText(s).then(function(){alert("اتنسخ")})}catch(e){prompt("انسخ:",s)}};
