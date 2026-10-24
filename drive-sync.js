/* Timaxo · Google Drive — نسخة تلقائية من المستندات المصدَّرة والمفتوحة والمحذوفة.
   - صلاحية drive.file بس: التطبيق مايشوفش غير الملفات اللي هو بيعملها.
   - مفيش سيرفر وسيط: الرفع من جهازك مباشرة لـ Google Drive بتاعك.
   - الرفع بيتم بطابور على الجهاز: لو النت وقع بيكمّل لوحده لما يرجع. */
(function(){'use strict';
var CLIENT_ID=''; /* ← حط هنا الـOAuth Client ID (Web) من Google Cloud Console. أو يتحط من نافذة Drive نفسها. */
var SCOPE='https://www.googleapis.com/auth/drive.file',API='https://www.googleapis.com/',LS=localStorage;
var ar=function(){return document.documentElement.lang!=='en'},L=function(a,e){return ar()?a:e};
var J=function(k,d){try{var v=JSON.parse(LS.getItem(k));return v==null?d:v}catch(e){return d}};
var W=function(k,v){try{LS.setItem(k,JSON.stringify(v))}catch(e){}};
var S={tok:J('tx_drv_tok',null),set:Object.assign({x:1,d:1},J('tx_drv_set',{})),log:J('tx_drv_log',[]),fol:J('tx_drv_fol',{}),map:J('tx_drv_map',{}),acc:J('tx_drv_acc',null),prog:null,busy:0,state:'idle'};
var cid=function(){return CLIENT_ID||LS.getItem('tx_drv_cid')||''};
var linked=function(){return !!S.acc};
var host=function(){return window.__txDrvHost||{}};
var emit=function(){try{dispatchEvent(new CustomEvent('txdrv'))}catch(e){}};
var esc=function(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
var toast=function(m){try{host().toast?host().toast(m):pill(m,'ok')}catch(e){}};

/* ---------- قاعدة بيانات الطابور (منفصلة عن مستنداتك) ---------- */
var qdb=null;
function qopen(){return qdb?Promise.resolve(qdb):new Promise(function(res){try{var r=indexedDB.open('timaxo-drive',1);r.onupgradeneeded=function(){r.result.createObjectStore('q',{keyPath:'id'})};r.onsuccess=function(){qdb=r.result;res(qdb)};r.onerror=function(){res(null)}}catch(e){res(null)}})}
function qdo(mode,fn){return qopen().then(function(d){return new Promise(function(res){if(!d)return res();try{var t=d.transaction('q',mode),s=t.objectStore('q'),out=fn(s);t.oncomplete=function(){res(out&&out.result)};t.onerror=t.onabort=function(){res()}}catch(e){res()}})})}
var qput=function(j){return qdo('readwrite',function(s){s.put(j)})};
var qdel=function(id){return qdo('readwrite',function(s){s.delete(id)})};
var qall=function(){return qdo('readonly',function(s){return s.getAll()}).then(function(a){return(a||[]).sort(function(x,y){return x.ts-y.ts})})};

/* ---------- تسجيل الدخول (OAuth بدون مكتبات خارجية) ---------- */
var ch='BroadcastChannel' in window?new BroadcastChannel('timaxo-drive'):null;
function authUrl(prompt,hint,mode){var st=mode+Math.random().toString(36).slice(2,12);LS.setItem('tx_drv_st',st);
 var p=new URLSearchParams({client_id:cid(),redirect_uri:new URL('drive-callback.html',location.href).href,response_type:'token',scope:SCOPE,state:st,include_granted_scopes:'true',prompt:prompt});
 if(hint)p.set('login_hint',hint);return'https://accounts.google.com/o/oauth2/v2/auth?'+p.toString()}
function waitCb(ms){var st=LS.getItem('tx_drv_st');return new Promise(function(res){var done=0,to;
 function fin(v){if(done)return;done=1;clearTimeout(to);if(ch)ch.removeEventListener('message',h);removeEventListener('storage',sh);try{LS.removeItem('tx_drv_cb')}catch(e){}res(v)}
 function take(d){if(d&&d.state===st)fin(d)}
 function h(e){take(e.data)}function sh(e){if(e.key==='tx_drv_cb'&&e.newValue){try{take(JSON.parse(e.newValue))}catch(_){}}}
 if(ch)ch.addEventListener('message',h);addEventListener('storage',sh);to=setTimeout(function(){fin({error:'timeout'})},ms)})}
function accept(d){if(!d||!d.token)return{error:(d&&d.error)||'fail'};S.tok={t:d.token,exp:Date.now()+(d.exp||3600)*1000-90000};W('tx_drv_tok',S.tok);return{ok:1}}
async function connect(){
 if(!cid())return{error:'noid'};
 var w=null;try{w=window.open(authUrl('select_account','','p'),'txdrv','width=480,height=680')}catch(e){}
 if(!w){location.href=authUrl('select_account','','r');return{redirect:1}}
 var r=accept(await waitCb(240000));try{w.close()}catch(e){}
 if(r.ok)await afterConnect();return r}
async function silent(){
 if(!S.acc||!cid())return false;
 var f=document.createElement('iframe');f.hidden=true;f.setAttribute('aria-hidden','true');f.src=authUrl('none',S.acc.email||'','s');document.body.appendChild(f);
 var r=accept(await waitCb(12000));f.remove();return!!r.ok}
async function token(){if(S.tok&&S.tok.exp>Date.now())return S.tok.t;if(await silent())return S.tok.t;return null}
async function afterConnect(){
 try{var r=await api(API+'drive/v3/about?fields=user(emailAddress,displayName,photoLink)'),u=(await r.json()).user||{};
  S.acc={email:u.emailAddress||'',name:u.displayName||''};W('tx_drv_acc',S.acc)}catch(e){S.acc=S.acc||{email:'',name:''};W('tx_drv_acc',S.acc)}
 S.state='idle';emit();pump()}
function disconnect(){
 var t=S.tok&&S.tok.t;if(t){try{fetch('https://oauth2.googleapis.com/revoke?token='+encodeURIComponent(t),{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'}})}catch(e){}}
 S.tok=null;S.acc=null;S.fol={};S.map={};['tx_drv_tok','tx_drv_acc','tx_drv_fol','tx_drv_map'].forEach(function(k){LS.removeItem(k)});
 qall().then(function(a){a.forEach(function(j){qdel(j.id)})});S.state='idle';emit()}

/* ---------- Drive API ---------- */
async function api(url,opt){
 var t=await token();if(!t){S.state='auth';emit();throw new Error('auth')}
 opt=opt||{};opt.headers=Object.assign({Authorization:'Bearer '+t},opt.headers||{});
 var r=await fetch(url,opt);
 if(r.status===401){S.tok=null;W('tx_drv_tok',null);S.state='auth';emit();throw new Error('auth')}
 if(!r.ok){var e=new Error('http'+r.status);e.status=r.status;throw e}
 return r}
var NAMES={r:'Timaxo Scan',x:'Exports',d:'Deleted',o:'Open documents'},checked={};
async function mkFolder(name,parent){
 var r=await api(API+'drive/v3/files?fields=id',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:name,mimeType:'application/vnd.google-apps.folder',parents:parent?[parent]:undefined})});
 return(await r.json()).id}
async function alive(id){if(!id)return false;if(checked[id])return true;
 try{var r=await api(API+'drive/v3/files/'+id+'?fields=id,trashed'),j=await r.json();if(j.trashed)return false;checked[id]=1;return true}catch(e){if(e.status===404||e.status===403)return false;throw e}}
async function folder(k){
 if(!await alive(S.fol.r)){S.fol={r:await mkFolder(NAMES.r)};checked[S.fol.r]=1}
 if(k==='r')return S.fol.r;
 if(!await alive(S.fol[k])){S.fol[k]=await mkFolder(NAMES[k],S.fol.r);checked[S.fol[k]]=1}
 W('tx_drv_fol',S.fol);return S.fol[k]}
async function upload(o){
 var meta=o.fileId?{name:o.name}:{name:o.name,parents:[o.parent]},base=API+'upload/drive/v3/files'+(o.fileId?'/'+o.fileId:''),m=o.fileId?'PATCH':'POST',mime=o.mime||'application/octet-stream';
 if(o.blob.size<4e6){
  var b='tx'+Math.random().toString(36).slice(2);
  var body=new Blob(['--'+b+'\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n'+JSON.stringify(meta)+'\r\n--'+b+'\r\nContent-Type: '+mime+'\r\n\r\n',o.blob,'\r\n--'+b+'--']);
  return(await api(base+'?uploadType=multipart&fields=id,webViewLink',{method:m,headers:{'Content-Type':'multipart/related; boundary='+b},body:body})).json()}
 var init=await api(base+'?uploadType=resumable&fields=id,webViewLink',{method:m,headers:{'Content-Type':'application/json; charset=UTF-8','X-Upload-Content-Type':mime,'X-Upload-Content-Length':String(o.blob.size)},body:JSON.stringify(meta)});
 var loc=init.headers.get('Location');if(!loc)throw new Error('noloc');
 var r=await fetch(loc,{method:'PUT',headers:{'Content-Type':mime},body:o.blob});if(!r.ok){var e=new Error('http'+r.status);e.status=r.status;throw e}return r.json()}

/* ---------- الطابور ---------- */
var K={x:{ar:'مصدَّر',en:'Exported'},o:{ar:'مفتوح',en:'Open'},d:{ar:'محذوف',en:'Deleted'}};
function log(j,s,link){S.log.unshift({k:j.kind==='m'?'d':j.kind,n:j.name,s:s,l:link||'',ts:Date.now()});S.log=S.log.slice(0,20);W('tx_drv_log',S.log)}
async function run(j){
 if(j.kind==='m'){ /* نقل ملف "مفتوح" اتعمله نسخة قبل كده لمجلد المحذوفات بدل رفعه من جديد */
  var e=S.map[j.docId];
  if(e){try{var fo=await folder('d'),r=await api(API+'drive/v3/files/'+e.id+'?addParents='+fo+'&removeParents='+(S.fol.o||'')+'&fields=id,webViewLink',{method:'PATCH'}),x=await r.json();delete S.map[j.docId];W('tx_drv_map',S.map);return x.webViewLink||''}catch(er){if(er.status!==404)throw er}}
  if(!j.blob)return''}
 var parent=await folder(j.kind==='o'?'o':j.kind==='d'?'d':'x'),fid=j.kind==='o'&&S.map[j.docId]?S.map[j.docId].id:null,x;
 try{x=await upload({name:j.name,blob:j.blob,mime:j.mime,parent:parent,fileId:fid})}
 catch(er){if(fid&&er.status===404){delete S.map[j.docId];x=await upload({name:j.name,blob:j.blob,mime:j.mime,parent:parent})}else throw er}
 if(j.kind==='o'){S.map[j.docId]={id:x.id,sig:j.sig||''};W('tx_drv_map',S.map)}
 return x.webViewLink||''}
var pumping=0;
async function pump(){
 if(pumping||!linked()||!navigator.onLine)return;pumping=1;S.state='sync';emit();
 try{var q=await qall();
  for(var i=0;i<q.length;i++){var j=q[i];S.prog={i:i,n:q.length,name:j.name};emit();pill(j.name,'up',q.length-i);
   try{var link=await run(j);await qdel(j.id);log(j,'ok',link);pill(j.name,'ok',0,link)}
   catch(er){if(er.message==='auth'){pill(L('محتاج تسجّل دخول Google تاني','Sign in to Google again'),'err');S.prog=null;pumping=0;emit();return}
    j.tries=(j.tries||0)+1;if(j.tries>=5||(er.status&&er.status<500&&er.status!==429&&er.status!==403)){await qdel(j.id);log(j,'err');pill(j.name,'err')}else{await qput(j);S.state='retry';setTimeout(pump,30000*j.tries)}}}
  S.state=S.state==='retry'?'retry':'idle'}catch(e){}
 S.prog=null;pumping=0;emit()}
async function enqueue(j){j.id=Date.now().toString(36)+Math.random().toString(36).slice(2,6);j.ts=Date.now();await qput(j);emit();pump()}

/* ---------- الخطافات من التطبيق ---------- */
function onExport(blob,filename){if(!linked()||!S.set.x||!blob)return;enqueue({kind:'x',name:filename,blob:blob,mime:blob.type||'application/octet-stream'})}
async function onDelete(rec){
 if(!linked()||!S.set.d||!rec)return;
 var nm=(rec.name||'Timaxo scan')+' — '+new Date().toISOString().slice(0,10)+'.pdf';
 if(S.map[rec.id]){await enqueue({kind:'m',name:nm,docId:rec.id});return}
 try{var blob=await host().pdf(rec);if(blob)await enqueue({kind:'d',name:nm,blob:blob,mime:'application/pdf',docId:rec.id})}catch(e){}}
async function backupOpen(){
 if(!linked()||S.busy)return;S.busy=1;emit();var n=0;
 try{var docs=await host().docs(),todo=[];
  docs.forEach(function(r){var sig=r.isCur?'':[r.id,r.count,r.ts].join('|');if(!r.isCur&&S.map[r.id]&&S.map[r.id].sig===sig)return;todo.push([r,sig])});
  if(!todo.length){toast(L('كل مستنداتك محفوظة على Drive ✓','All documents are already on Drive ✓'));return}
  for(var i=0;i<todo.length;i++){S.prog={i:i,n:todo.length,name:todo[i][0].name,building:1};emit();
   var blob=await host().pdf(todo[i][0]);if(blob){await qput({id:'o'+Date.now().toString(36)+i,ts:Date.now()+i,kind:'o',name:(todo[i][0].name||'Timaxo scan')+'.pdf',blob:blob,mime:'application/pdf',docId:todo[i][0].id,sig:todo[i][1]});n++}}
  S.prog=null}catch(e){}
 S.busy=0;S.prog=null;emit();if(n)pump()}

/* ---------- كبسولة الحالة (تظهر ثواني وتختفي) ---------- */
var pillEl=null,pillT=0;
function pill(txt,kind,left,link){
 try{if(!pillEl){pillEl=document.createElement('div');pillEl.id='dvPill';pillEl.setAttribute('role','status');document.body.appendChild(pillEl)}
  var ic=kind==='up'?'<i class="dvs"></i>':kind==='ok'?'<svg viewBox="0 0 24 24"><path d="M5 12.5l4.2 4.2L19 7"/></svg>':'<svg viewBox="0 0 24 24"><path d="M12 7v6M12 17h.01"/></svg>';
  var lb=kind==='up'?L('بيترفع على Drive','Uploading to Drive'):kind==='ok'?L('اتحفظ على Drive','Saved to Drive'):L('Drive','Drive');
  pillEl.className='on '+kind;pillEl.innerHTML=ic+'<span><b>'+esc(lb)+(left>1?' · '+left:'')+'</b><small>'+esc(txt)+'</small></span>'+(link?'<a href="'+esc(link)+'" target="_blank" rel="noopener">'+L('فتح','Open')+'</a>':'');
  clearTimeout(pillT);if(kind!=='up')pillT=setTimeout(function(){pillEl&&pillEl.classList.remove('on')},kind==='err'?5200:3600)}catch(e){}}

/* ---------- النافذة ---------- */
var sheet=null;
var ICO={drive:'<svg viewBox="0 0 24 24"><path d="M8.6 3h6.8l6.1 10.6-3.4 5.9H5.9L2.5 13.6z"/><path d="M8.6 3l6.1 10.6M15.4 3L9.3 13.6M5.9 19.5l3.4-5.9h12.2"/></svg>',
 up:'<svg viewBox="0 0 24 24"><path d="M12 16V5M7.5 9.5L12 5l4.5 4.5M5 19h14"/></svg>',tr:'<svg viewBox="0 0 24 24"><path d="M5.7 8h12.6l-.9 10.7a2 2 0 01-2 1.8H8.6a2 2 0 01-2-1.8zM4 8h16M9.5 8V5.5h5V8"/></svg>',
 doc:'<svg viewBox="0 0 24 24"><path d="M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6"/></svg>',lock:'<svg viewBox="0 0 24 24"><rect x="5" y="10.5" width="14" height="9.5" rx="2"/><path d="M8 10.5V8a4 4 0 018 0v2.5"/></svg>',x:'<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>',ext:'<svg viewBox="0 0 24 24"><path d="M14 4h6v6M20 4l-9 9M18 14v5H5V6h5"/></svg>'};
function css(){if(document.getElementById('dvcss'))return;var s=document.createElement('style');s.id='dvcss';s.textContent=
'.dv .bx{max-height:92vh;overflow-y:auto;overscroll-behavior:contain}.dv .ph{display:flex;align-items:center;gap:12px;margin:0 2px 12px}.dv .ph .ti{flex:1}.dv .ph h3{margin:0;font:800 19px var(--fb,system-ui)}.dv .ph p{margin:2px 0 0;font:600 12.5px var(--fb,system-ui);opacity:.65}'+
'.dv .xb{width:36px;height:36px;border-radius:50%;border:1px solid var(--line);background:var(--surface2);color:inherit;display:grid;place-items:center}.dv .xb svg{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round}'+
'.dv .hero{position:relative;overflow:hidden;border-radius:22px;padding:18px 16px 16px;margin-bottom:12px;color:#fff;background:linear-gradient(135deg,#1a73e8 0%,#0f9d58 52%,#f4b400 100%)}.dv .hero:before{content:"";position:absolute;inset:0;background:radial-gradient(120% 90% at 85% 0,rgba(255,255,255,.28),transparent 60%)}'+
'.dv .hero>*{position:relative}.dv .hero .lg{width:52px;height:52px;border-radius:16px;background:rgba(255,255,255,.2);backdrop-filter:blur(6px);display:grid;place-items:center;margin-bottom:10px}.dv .hero .lg svg{width:30px;height:30px;stroke:#fff;fill:none;stroke-width:1.7;stroke-linejoin:round;stroke-linecap:round}'+
'.dv .hero b{display:block;font:800 18px/1.4 var(--fb,system-ui)}.dv .hero p{margin:4px 0 0;font:600 13px/1.6 var(--fb,system-ui);opacity:.95}'+
'.dv .ft{display:flex;gap:12px;align-items:flex-start;padding:10px 4px}.dv .ft .ic{flex:none;width:38px;height:38px;border-radius:12px;display:grid;place-items:center;color:#fff}.dv .ft .ic svg{width:20px;height:20px;stroke:#fff;fill:none;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}.dv .ft b{display:block;font:700 14.5px var(--fb,system-ui)}.dv .ft small{display:block;font:500 12.5px/1.6 var(--fb,system-ui);opacity:.72}'+
'.dv .go{width:100%;margin-top:8px;padding:14px;border:0;border-radius:18px;background:var(--accent,#1b63f0);color:#fff;font:800 16px var(--fb,system-ui);display:flex;gap:8px;align-items:center;justify-content:center;cursor:pointer}.dv .go:disabled{opacity:.55}.dv .go svg{width:20px;height:20px;stroke:#fff;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}.dv .go.ln{background:transparent;color:inherit;border:1.5px solid var(--line)}'+
'.dv .note{display:flex;gap:8px;align-items:flex-start;margin:12px 2px 2px;font:500 12px/1.6 var(--fb,system-ui);opacity:.72}.dv .note svg{flex:none;width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:1.9;margin-top:2px}'+
'.dv .acc{display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:20px;background:var(--surface2);border:1.5px solid var(--line);margin-bottom:10px}.dv .av{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#1a73e8,#0f9d58);color:#fff;display:grid;place-items:center;font:800 17px system-ui;flex:none}.dv .acc .t{flex:1;min-width:0}.dv .acc b{display:block;font:700 14.5px var(--fb,system-ui);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.dv .acc small{display:flex;align-items:center;gap:5px;font:600 12px var(--fb,system-ui);color:#16a34a}.dv .acc small:before{content:"";width:7px;height:7px;border-radius:50%;background:currentColor}.dv .acc small.w{color:#e08a1b}'+
'.dv .lk{border:1px solid var(--line);background:transparent;color:inherit;border-radius:12px;padding:7px 12px;font:700 12.5px var(--fb,system-ui);cursor:pointer}'+
'.dv .tg{display:flex;align-items:center;gap:12px;width:100%;padding:12px 14px;margin-bottom:10px;border-radius:20px;background:var(--surface2);border:1.5px solid var(--line);color:inherit;text-align:start;font:inherit;cursor:pointer}.dv .tg .ic{flex:none;width:38px;height:38px;border-radius:12px;display:grid;place-items:center}.dv .tg .ic svg{width:20px;height:20px;stroke:#fff;fill:none;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}.dv .tg .t{flex:1}.dv .tg b{display:block;font:700 14.5px var(--fb,system-ui)}.dv .tg small{display:block;font:500 12px/1.5 var(--fb,system-ui);opacity:.7}'+
'.dv .sw{flex:none;width:46px;height:28px;border-radius:14px;background:var(--line);position:relative;transition:background .2s}.dv .sw:after{content:"";position:absolute;top:3px;inset-inline-start:3px;width:22px;height:22px;border-radius:50%;background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.4);transition:transform .22s cubic-bezier(.3,1.4,.5,1)}.dv .tg.on .sw{background:#16a34a}.dv .tg.on .sw:after{transform:translateX(18px)}[dir=rtl] .dv .tg.on .sw:after{transform:translateX(-18px)}'+
'.dv .pg{height:6px;border-radius:3px;background:var(--line);overflow:hidden;margin:10px 2px 0}.dv .pg i{display:block;height:100%;background:linear-gradient(90deg,#1a73e8,#16a34a);transition:width .3s}.dv .sub{font:600 12px var(--fb,system-ui);opacity:.7;margin:8px 4px 0;text-align:center}'+
'.dv h4{margin:16px 4px 8px;font:800 13px var(--fb,system-ui);opacity:.65;letter-spacing:.02em}.dv .lg2{display:flex;align-items:center;gap:10px;padding:9px 4px;border-bottom:1px solid var(--line)}.dv .lg2:last-child{border:0}.dv .lg2 .d{flex:none;width:9px;height:9px;border-radius:50%;background:#16a34a}.dv .lg2 .d.err{background:#dc2626}.dv .lg2 .t{flex:1;min-width:0}.dv .lg2 b{display:block;font:600 13px var(--fb,system-ui);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.dv .lg2 small{font:500 11.5px var(--fb,system-ui);opacity:.65}.dv .lg2 a{color:var(--accent,#1b63f0);display:grid;place-items:center;width:30px;height:30px}.dv .lg2 a svg{width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round}'+
'.dv .cfg{margin-top:12px;padding:12px;border-radius:16px;border:1.5px dashed var(--line)}.dv .cfg input{width:100%;box-sizing:border-box;margin-top:8px;padding:11px 12px;border-radius:12px;border:1.5px solid var(--line);background:var(--surface2);color:inherit;font:600 13px ui-monospace,monospace;direction:ltr}.dv .cfg small{display:block;font:500 12px/1.6 var(--fb,system-ui);opacity:.75}'+
'#dvPill{position:fixed;z-index:100000;left:50%;bottom:calc(env(safe-area-inset-bottom,0px) + 92px);transform:translate(-50%,24px) scale(.96);opacity:0;pointer-events:none;display:flex;align-items:center;gap:10px;max-width:min(92vw,380px);padding:10px 16px 10px 14px;border-radius:999px;background:rgba(8,18,52,.94);color:#fff;border:1px solid rgba(255,255,255,.16);box-shadow:0 14px 40px -10px rgba(0,0,0,.7);backdrop-filter:blur(12px);transition:transform .3s cubic-bezier(.2,1.2,.4,1),opacity .2s}#dvPill.on{opacity:1;transform:translate(-50%,0);pointer-events:auto}#dvPill span{min-width:0}#dvPill b{display:block;font:800 12.5px system-ui}#dvPill small{display:block;font:500 11.5px system-ui;opacity:.75;max-width:210px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#dvPill svg{flex:none;width:22px;height:22px;stroke:#4ade80;fill:none;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round}#dvPill.err svg{stroke:#fbbf24}#dvPill a{color:#7dd3fc;font:800 12.5px system-ui;text-decoration:none;padding:4px 6px}#dvPill .dvs{flex:none;width:20px;height:20px;border-radius:50%;border:3px solid rgba(125,211,252,.25);border-top-color:#7dd3fc;animation:dvr .8s linear infinite}@keyframes dvr{to{transform:rotate(360deg)}}@media(prefers-reduced-motion:reduce){#dvPill,#dvPill .dvs{transition:none;animation-duration:2s}}';
 document.head.appendChild(s)}
function ago(ts){var m=Math.max(0,Math.round((Date.now()-ts)/6e4));if(m<1)return L('دلوقتي','just now');if(m<60)return L('من '+m+' د',''+m+'m ago');var h=Math.round(m/60);if(h<24)return L('من '+h+' س','' +h+'h ago');return L('من '+Math.round(h/24)+' يوم',Math.round(h/24)+'d ago')}
function view(){
 var a=ar(),h='<div class="hd"></div><div class="ph"><div class="ti"><h3>Google Drive</h3><p>'+L('نسخة تلقائية من مستنداتك على درايفك','Automatic copies of your documents in your Drive')+'</p></div><button type="button" class="xb" data-a="close" aria-label="'+L('إغلاق','Close')+'">'+ICO.x+'</button></div>';
 if(!linked()){
  h+='<div class="hero"><div class="lg">'+ICO.drive+'</div><b>'+L('مستنداتك في أمان حتى لو الموبايل ضاع','Your documents stay safe even if you lose your phone')+'</b><p>'+L('اربط حساب Google مرة واحدة، وTimaxo يحفظ لك نسخة PDF تلقائيًا.','Link your Google account once and Timaxo keeps a PDF copy for you.')+'</p></div>'+
  [['up','#1a73e8',L('كل تصدير بيترفع لوحده','Every export uploads itself'),L('أي PDF أو صورة تصدّرها بتتحفظ في مجلد Exports.','Any PDF or image you export is saved to Exports.')],
   ['tr','#e0527a',L('نسخة قبل الحذف','A copy before delete'),L('لما تمسح مستند بتتحفظ نسخته في مجلد Deleted.','When you delete a document, its copy goes to Deleted.')],
   ['doc','#16a34a',L('المستندات المفتوحة بضغطة','Open documents in one tap'),L('بتحفظ كل مستنداتك الحالية، وبعدها التغييرات بس.','Backs up all current documents, then only changes.')]].map(function(f){return'<div class="ft"><span class="ic" style="background:'+f[1]+'">'+ICO[f[0]]+'</span><div><b>'+f[2]+'</b><small>'+f[3]+'</small></div></div>'}).join('');
  if(!cid())h+='<div class="cfg"><small><b>'+L('إعداد المطوّر (مرة واحدة):','Developer setup (once):')+'</b> '+L('الصق OAuth Client ID من Google Cloud Console (نوع Web، وأضف رابط التطبيق في Authorized JavaScript origins ورابط drive-callback.html في Authorized redirect URIs).','Paste the OAuth Client ID from Google Cloud Console (Web type; add the app URL to Authorized JavaScript origins and drive-callback.html to Authorized redirect URIs).')+'</small><input id="dvCid" placeholder="123456-abc.apps.googleusercontent.com" autocomplete="off" spellcheck="false"></div>';
  h+='<button type="button" class="go" data-a="connect">'+ICO.drive+L('ربط حساب Google','Link Google account')+'</button>';
  h+='<div class="note">'+ICO.lock+'<span>'+L('الصلاحية محدودة بالملفات اللي Timaxo بيعملها بس (drive.file). مقدرش أشوف أو أغيّر باقي ملفاتك، وتقدر تفصل الحساب في أي وقت. التفاصيل في سياسة الخصوصية.','Access is limited to files Timaxo creates (drive.file). It cannot see or change your other files, and you can unlink any time. See the Privacy Policy.')+'</span></div>'}
 else{
  var warn=S.state==='auth',acc=S.acc||{},ini=(acc.name||acc.email||'G').trim().charAt(0).toUpperCase();
  h+='<div class="acc"><span class="av">'+esc(ini)+'</span><div class="t"><b>'+esc(acc.email||acc.name||'Google')+'</b><small class="'+(warn?'w':'')+'">'+(warn?L('محتاج إعادة تسجيل دخول','Sign-in needed'):S.state==='sync'?L('بيرفع الآن…','Syncing…'):S.state==='retry'?L('هيحاول تاني تلقائيًا','Will retry automatically'):L('متصل','Connected'))+'</small></div>'+(warn?'<button type="button" class="lk" data-a="connect">'+L('إعادة الربط','Reconnect')+'</button>':'<button type="button" class="lk" data-a="off">'+L('فصل','Unlink')+'</button>')+'</div>';
  [['x','up','#1a73e8',L('رفع تلقائي بعد التصدير','Auto-upload after export'),L('كل ملف تصدّره يتحفظ كمان على Drive.','Every exported file is also saved to Drive.')],
   ['d','tr','#e0527a',L('نسخة قبل الحذف','Copy before delete'),L('المستند المحذوف يتحفظ في Deleted.','Deleted documents are kept in Deleted.')]].forEach(function(t){h+='<button type="button" class="tg'+(S.set[t[0]]?' on':'')+'" data-a="set" data-k="'+t[0]+'" role="switch" aria-checked="'+(S.set[t[0]]?'true':'false')+'"><span class="ic" style="background:'+t[2]+'">'+ICO[t[1]]+'</span><span class="t"><b>'+t[3]+'</b><small>'+t[4]+'</small></span><span class="sw"></span></button>'});
  var p=S.prog;h+='<button type="button" class="go" data-a="backup"'+(S.busy?' disabled':'')+'>'+ICO.doc+(S.busy?L('بيجهّز المستندات…','Preparing…'):L('احفظ المستندات المفتوحة دلوقتي','Back up open documents now'))+'</button>';
  if(p)h+='<div class="pg"><i style="width:'+Math.round((p.i+(p.building?0:1))/p.n*100)+'%"></i></div><div class="sub">'+esc(p.name||'')+' · '+(p.i+1)+'/'+p.n+'</div>';
  if(S.log.length){h+='<h4>'+L('آخر النشاط','Recent activity')+'</h4>'+S.log.slice(0,6).map(function(e){return'<div class="lg2"><span class="d'+(e.s==='err'?' err':'')+'"></span><div class="t"><b>'+esc(e.n)+'</b><small>'+(K[e.k]?K[e.k][a?'ar':'en']:'')+' · '+(e.s==='err'?L('فشل','Failed'):ago(e.ts))+'</small></div>'+(e.l?'<a href="'+esc(e.l)+'" target="_blank" rel="noopener" aria-label="'+L('فتح في Drive','Open in Drive')+'">'+ICO.ext+'</a>':'')+'</div>'}).join('')}
  if(S.fol.r)h+='<a class="go ln" style="text-decoration:none;margin-top:14px" href="https://drive.google.com/drive/folders/'+esc(S.fol.r)+'" target="_blank" rel="noopener">'+ICO.ext+L('فتح مجلد Timaxo Scan في Drive','Open Timaxo Scan folder in Drive')+'</a>';
  h+='<div class="note">'+ICO.lock+'<span>'+L('الرفع من جهازك مباشرة لدرايفك، ومفيش سيرفر وسيط. لو النت فصل بيكمّل لوحده.','Uploads go straight from your device to your Drive, with no middle server. If the connection drops it resumes by itself.')+'</span></div>'}
 return h}
function render(){if(!sheet)return;var bx=sheet.firstChild,sc=bx.scrollTop,v=document.getElementById('dvCid'),keep=v?v.value:'';bx.innerHTML=view();bx.scrollTop=sc;if(keep){var n=document.getElementById('dvCid');if(n)n.value=keep}}
function key(e){if(e.key==='Escape'){e.stopPropagation();e.preventDefault();close()}}
function close(){var s=sheet;if(!s)return;sheet=null;document.removeEventListener('keydown',key,true);removeEventListener('txdrv',render);
 if(matchMedia('(prefers-reduced-motion:reduce)').matches||!s.animate)return s.remove();
 s.firstChild.animate([{transform:'none'},{transform:'translateY(100%)'}],{duration:160,easing:'cubic-bezier(.4,0,1,1)',fill:'forwards'});s.animate([{opacity:1},{opacity:0}],{duration:160,fill:'forwards'}).onfinish=function(){s.remove()}}
function open(){
 if(sheet)return;css();var s=document.createElement('div');s.className='txls dv';s.dir=ar()?'rtl':'ltr';s.innerHTML='<div class="bx" role="dialog" aria-modal="true" aria-label="Google Drive">'+view()+'</div>';
 s.addEventListener('click',async function(e){
  if(e.target===s)return close();var b=e.target.closest&&e.target.closest('[data-a]');if(!b)return;var a=b.dataset.a;
  if(a==='close')close();
  else if(a==='set'){S.set[b.dataset.k]=S.set[b.dataset.k]?0:1;W('tx_drv_set',S.set);render()}
  else if(a==='backup')backupOpen();
  else if(a==='off'){if(confirm(L('تفصل حساب Drive؟ الملفات اللي اترفعت هتفضل في درايفك.','Unlink Drive? Files already uploaded stay in your Drive.')))disconnect()}
  else if(a==='connect'){var i=document.getElementById('dvCid');if(i&&i.value.trim()){LS.setItem('tx_drv_cid',i.value.trim())}
   if(!cid()){toast(L('الصق الـClient ID الأول','Paste the Client ID first'));return}
   b.disabled=true;var r=await connect();if(r.redirect)return;if(!r.ok){toast(r.error==='timeout'?L('انتهت مهلة الربط','Sign-in timed out'):L('الربط ما تمش، جرّب تاني','Linking did not complete, try again'));}else toast(L('تم ربط Drive ✓','Drive linked ✓'));render()}});
 document.body.appendChild(s);sheet=s;document.addEventListener('keydown',key,true);addEventListener('txdrv',render);
 if(!matchMedia('(prefers-reduced-motion:reduce)').matches&&s.animate){s.animate([{opacity:0},{opacity:1}],{duration:150,fill:'both'});s.firstChild.animate([{transform:'translateY(100%)'},{transform:'none'}],{duration:230,easing:'cubic-bezier(.2,.9,.3,1)',fill:'both'})}}

/* ---------- بدء التشغيل ---------- */
(function(){
 var cb=J('tx_drv_cb',null);
 if(cb&&cb.state&&cb.state===LS.getItem('tx_drv_st')&&cb.state.charAt(0)==='r'){LS.removeItem('tx_drv_cb');var r=accept(cb);if(r.ok)afterConnect().then(function(){setTimeout(open,700)});try{history.replaceState(null,'',location.pathname)}catch(e){}}
 addEventListener('online',function(){setTimeout(pump,800)});
 setTimeout(function(){if(linked())pump()},4000)})();

window.__txDrive={open:open,onExport:onExport,onDelete:onDelete,backupOpen:backupOpen,linked:linked,
 badge:function(){return{v:linked()?(S.state==='auth'?L('إعادة ربط','Reconnect'):L('متصل','Connected')):L('غير مربوط','Not linked'),ok:linked()&&S.state!=='auth'}}};
})();
