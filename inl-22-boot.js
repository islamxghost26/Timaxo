
/* ===== v45: "What can Timaxo do?" guide — small button in the home header + searchable bottom sheet ===== */
(function(){
const A=()=>document.documentElement.lang!=='en',L=(a,b)=>A()?a:b,SEEN='tx_guide_seen'; /* the app's own AR() lives in another scope, so read the language the app stamps on <html> */
const ic=p=>'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">'+p+'</svg>';
const D=[
{c:['#E8501A','#ff8a4c'],i:ic('<path d="M4 8a2 2 0 0 1 2-2h1.5l1.2-2h6.6l1.2 2H18a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="3.5"/>'),
 t:['التصوير والاستيراد','Capture & import'],s:['كاميرا ذكية وصور وPDF','Smart camera, photos & PDF'],w:['الرئيسية ← الزرار العايم','Home ← floating button'],
 p:[['الكاميرا|اضغط الزرار العايم وصوّر، والحواف بتتحدد لوحدها','Camera|Tap the floating button and shoot; edges are found for you','cam'],
 ['استيراد|صور أو PDF من الجهاز (لحد ٦٠ صفحة)','Import|Photos or a PDF from your device (up to 60 pages)','gal'],
 ['صفحة A4 فاضية|اضغط مطوّلًا على زرار الكاميرا','Blank A4 page|Long-press the camera button','blank'],
 ['ترتيب الصفحات|اضغط مطوّلًا على صفحة واسحبها','Reorder|Long-press a page and drag it']]},
{c:['#1b63f0','#5b9bff'],i:ic('<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>'),
 t:['تعديل الصفحة','Edit a page'],s:['خمس تابات تحت الصورة','Five tabs under the image'],w:['افتح أي صفحة ← التابات','Open a page ← the tabs'],
 p:[['فلاتر|أصلي، تلقائي، سحري، رمادي، أبيض وأسود','Filters|Original, Auto, Magic, Gray, B&W','tab:pFilters'],
 ['ضبط|السطوع والتباين والألوان','Adjust|Brightness, contrast, colors','tab:pAdjust'],
 ['تعديل|نص، قلم، تظليل، سهم، إخفاء، توقيع','Edit|Text, pen, highlighter, arrow, redact, signature','tab:pMarkup'],
 ['توقيعك بالتصوير|صوّره مرة واحدة واحفظ لحد ٥ توقيعات، وحطه على أي مستند بضغطة','Signature from a photo|Photograph it once, keep up to 5, place it with one tap','sig'],
 ['التحكم في التوقيع|الحجم، ألوان أقلام حقيقية، ولف في أي اتجاه','Control your signature|Size, real pen colors, rotate any way','sig'],
 ['مسح|امسح جزء من الصورة','Erase|Wipe part of the image','tab:pErase'],
 ['الصفحة|تدوير، حواف، ترتيب، حذف','Page|Rotate, edges, order, delete','tab:pPage'],
 ['حفظ سريع|الأيقونة فوق بتحفظ الصفحة دي لوحدها','Quick save|The top icon saves just this page']]},
{c:['#0e9f8e','#37d6c3'],i:ic('<path d="M6 3v4M6 17v4M3 6h4M17 6h4M3 18h4M17 18h4"/><rect x="8" y="8" width="8" height="8" rx="1"/>'),
 t:['الحواف والقص','Edges & crop'],s:['قص تلقائي وتعديل بإيدك','Auto-crop, fine-tune by hand'],w:['بعد التصوير · تاب الصفحة','After a shot · Page tab'],
 p:[['ضبط الحواف|اسحب أي ركن أو ضلع','Adjust edges|Drag any corner or side','edge'],
 ['تلقائي|يقترح تحديد مختلف كل ضغطة','Auto|Suggests a new outline each tap'],
 ['الصفحة كاملة|لو عايز من غير قص','Full page|When you want no crop']]},
{c:['#7c4dff','#b28cff'],i:ic('<path d="M4 6h16M4 12h10M4 18h14"/><circle cx="19" cy="15" r="2.5"/>'),
 t:['النص والترجمة','Text & translate'],s:['عربي وإنجليزي وبدون نت','Arabic & English, offline'],w:['تاب الصفحة ← استخراج النص','Page tab ← Extract text'],
 p:[['استخراج النص|استخرج النص وراجعه قبل الاستخدام','Extract text|Pull out the text and review it','ocr'],
 ['نص حي|حدّد الكلام على الصورة نفسها','Live text|Select words right on the image','pg:نص حي|Live'],
 ['ترجمة وتصدير|من شريط الأزرار: نسخ، ترجمة، TXT / Word / CSV','Translate & export|From the bar: copy, translate, TXT / Word / CSV'],
 ['بحث في المستندات|فعّل فهرسة النص','Search documents|Turn on text indexing','more:فهرسة النص|Text indexing']]},
{c:['#d98a00','#ffc24a'],i:ic('<path d="M12 3v12M7 10l5 5 5-5"/><path d="M4 19h16"/>'),
 t:['الحفظ والمشاركة','Save & share'],s:['PDF أو صور، صفحة أو كلها','PDF or images, one page or all'],w:['الرئيسية ← حفظ','Home ← Save'],
 p:[['اختيار الصفحات|كلها، واحدة، أو اختيار بالصور المصغّرة','Pages|All, one, or pick from thumbnails','save'],
 ['الصيغة والمقاس|PDF أو JPG أو PNG، وA4 أو A5 أو Letter','Format & size|PDF, JPG or PNG; A4, A5 or Letter'],
 ['خيارات إضافية|الجودة (الافتراضي عالية)، علامة مائية، حد أقصى للحجم','More options|Quality (High by default), watermark, size cap'],
 ['حفظ أو مشاركة|حفظ على الجهاز، أو قايمة المشاركة','Save or share|To the device, or the share sheet']]},
{c:['#0e9f8e','#2bd1a0'],i:ic('<rect x="3" y="5" width="18" height="14" rx="3"/><circle cx="9" cy="11" r="2"/><path d="M14 10h4M14 14h3M6 16c.6-1.6 1.8-2 3-2s2.4.4 3 2"/>'),
 t:['بطاقة وصور شخصية','ID card & photos'],s:['وش وضهر على A4 للطباعة','Front & back on a print-ready A4'],w:['الكاميرا ← وضع بطاقة','Camera ← Card mode'],
 p:[['صوّر الوش ثم الضهر|بيتعمل A4 جاهز تلقائي','Shoot front then back|An A4 page is built automatically'],
 ['من الأدوات|اختار الصفحات والشكل وعدد النسخ','From Tools|Pick pages, layout and copies']]},
{c:['#e0245e','#ff6b9a'],i:ic('<path d="M3 7h18v13H3z"/><path d="M3 7l2-3h14l2 3M10 12h4"/>'),
 t:['المستندات والأمان','Documents & security'],s:['مكتبة ونسخ احتياطي وقفل','Library, backup and lock'],w:['أيقونة المستندات · ⚙ الإعدادات','Documents icon · ⚙ Settings'],
 p:[['مستنداتي|ثبّت وصنّف وابحث','My documents|Pin, tag and search','docs'],
 ['سلة المحذوفات|المحذوف بيفضل ٣٠ يوم وتقدر تسترجعه','Trash|Deleted items stay 30 days and can be restored'],
 ['نسخة احتياطية|ملف واحد ترجّعه وقت ما تحب','Backup|One file you can restore any time','more:مستنداتي والنسخ الاحتياطي|Documents & backup'],
 ['Google Drive|اربط حسابك مرة، والمصدَّر والمحذوف والمفتوح بيتحفظوا تلقائيًا','Google Drive|Link once; exported, deleted and open docs are saved automatically','more:Google Drive|Google Drive'],
 ['قفل التطبيق|رقم سري أو بصمة','App lock|PIN or fingerprint','more:قفل التطبيق|App lock']]},
{c:['#16a34a','#4ade80'],i:ic('<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>'),
 t:['الإعدادات والأدوات','Settings & tools'],s:['ثيم، لغة، QR وأوفلاين','Theme, language, QR & offline'],w:['الكبسولة فوق · ⚙ الإعدادات','Top capsule · ⚙ Settings'],
 p:[['الكبسولة فوق|الثيم والصوت والدليل وقايمة ⋯','Top capsule|Theme, sound, this guide and ⋯'],
 ['اللغة|زرار الكرة بيبدّل عربي / English','Language|The globe button switches Arabic / English'],
 ['قارئ QR|من الزرار العايم في الرئيسية','QR reader|From the floating button on Home','qr'],
 ['أوفلاين|جهّزه مرة بالنت وبعدها من غير نت','Offline|Prepare once online, then no internet needed','more:تجهيز الأوفلاين|Prepare offline']]}
];
const QS=[['١','صوّر','Scan','cam'],['٢','عدّل','Edit','tab:pFilters'],['٣','احفظ','Save','save']];
const sleep=ms=>new Promise(r=>setTimeout(r,ms)),q1=x=>document.querySelector(x);
const msg=m=>{try{if(typeof toast==='function')toast(m);}catch(e){}};
async function ensureEdit(){
 if(q1('#vEdit.on'))return true;
 const pg=(typeof state!=='undefined'&&state.pages)||[];
 if(!pg.length){msg(L('صوّر أو استورد صفحة الأول، وبعدها جرّب الأداة دي','Scan or import a page first, then try this tool'));return false;}
 try{await openEdit(pg[0],false);}catch(e){return false;}
 await sleep(120);return true;}
async function tab(id){if(!await ensureEdit())return false;const t=q1('.tab[data-tab="'+id+'"]');if(t)t.click();await sleep(220);return true;}
async function run(a){
 const c=a.indexOf(':'),k=c<0?a:a.slice(0,c),v=c<0?'':a.slice(c+1);
 try{
 if(k==='cam'){const b=q1('#scanBtn');b&&b.click();}
 else if(k==='gal'){const b=q1('#galFab');b&&b.click();}
 else if(k==='blank'){const b=q1('#fabMenu [data-a="blank"]');b?b.click():msg(L('اضغط مطوّلًا على زرار الكاميرا','Long-press the camera button'));}
 else if(k==='docs'){const b=q1('#libBtn');b&&b.click();}
 else if(k==='save'){if(!((typeof state!=='undefined'&&state.pages)||[]).length){msg(L('مفيش صفحات لسه. صوّر أو استورد الأول','No pages yet. Scan or import first'));return;}const b=q1('#exportBtn');b&&b.click();}
 else if(k==='qr'){const b=q1('#qrFab');b?b.click():msg(L('زرار QR بيظهر في الشاشة الرئيسية','The QR button lives on the Home screen'));}
 else if(k==='tab'){await tab(v);}
 else if(k==='sig'){if(await tab('pMarkup')){const b=q1('#toolRow .tool[data-k="sign"]');b&&b.click();}}
 else if(k==='ocr'){if(await tab('pPage')){const b=q1('#ocrB');b&&b.click();}}
 else if(k==='edge'){if(await tab('pPage')){const b=q1('#recrop');b&&b.click();}}
 else if(k==='pg'){if(await tab('pPage')){const w=v.split('|').map(x=>x.toLowerCase()),b=[...document.querySelectorAll('#pPage button')].find(e=>{const t=(e.textContent+' '+(e.getAttribute('aria-label')||'')).toLowerCase();return w.some(x=>t.includes(x));});b&&b.click();}}
 else if(k==='more'){const m=document.getElementById('setBtn');if(!m)return;m.click();await sleep(380);
  const w=v.split('|').map(x=>x.toLowerCase()),b=[...document.querySelectorAll('#mrBx button.rw')].find(e=>w.some(x=>e.textContent.toLowerCase().includes(x)));if(b){b.scrollIntoView({block:'center',behavior:'smooth'});b.classList.add('flash');if(b.getAttribute('role')!=='switch')setTimeout(()=>b.click(),450);}}
 }catch(e){console.warn('guide go',e);}
}
const css=`#tg{position:fixed;inset:0;display:flex;align-items:flex-end;justify-content:center;background:rgba(6,12,30,.55);opacity:0;transition:opacity .2s;font-family:inherit}
#tg.in{opacity:1}
#tg .bx{width:100%;max-width:560px;max-height:92%;background:var(--surface,#fff);color:var(--ink,#0F1A2B);border-radius:28px 28px 0 0;display:flex;flex-direction:column;transform:translateY(36px);transition:transform .26s ease-out;overflow:hidden;box-shadow:0 -18px 46px -18px rgba(0,0,0,.55)}
#tg.in .bx{transform:none}
#tg .hero{position:relative;padding:10px 18px 16px;background:linear-gradient(150deg,var(--navy1,#0a1f6b),var(--navy2,#14409a));color:#fff;flex:none}
#tg .hd{width:42px;height:5px;border-radius:9px;background:rgba(255,255,255,.4);margin:0 auto 12px}
#tg .hero h2{margin:0;font-size:20px;font-weight:800;line-height:1.3}
#tg .hero p{margin:3px 0 12px;font-size:13px;opacity:.82}
#tg .x{position:absolute;top:14px;inset-inline-end:14px;width:36px;height:36px;border-radius:50%;border:0;background:rgba(255,255,255,.16);color:#fff;font-size:16px;cursor:pointer}
#tg .sr{display:flex;align-items:center;gap:8px;background:rgba(255,255,255,.14);border-radius:14px;padding:0 12px;height:42px}
#tg .sr input{flex:1;min-width:0;background:none;border:0;outline:0;color:#fff;font-weight:600;font-size:14px;font-family:inherit}
#tg .sr input::placeholder{color:rgba(255,255,255,.65)}
#tg .ls{overflow-y:auto;padding:12px 12px 6px;-webkit-overflow-scrolling:touch;overscroll-behavior:contain}
#tg details{background:var(--bg,#EDEFF2);border:1px solid var(--line,#D2D8E0);border-radius:18px;margin-bottom:10px;overflow:hidden}
#tg details[open]{border-color:var(--accent,#E8501A);background:var(--surface,#fff)}
#tg summary{list-style:none;display:flex;align-items:center;gap:12px;padding:12px;cursor:pointer;-webkit-tap-highlight-color:transparent}
#tg summary::-webkit-details-marker{display:none}
#tg .ti{width:46px;height:46px;border-radius:15px;display:grid;place-items:center;color:#fff;flex:none;box-shadow:0 8px 16px -8px rgba(0,0,0,.5)}
#tg .tt{flex:1;min-width:0}#tg .tt b{display:block;font-size:15.5px;font-weight:800}#tg .tt small{display:block;font-size:12.5px;opacity:.65;margin-top:1px}
#tg .ch{width:18px;height:18px;opacity:.5;transition:transform .2s;flex:none}
#tg details[open] .ch{transform:rotate(180deg)}
#tg .bd{padding:2px 14px 14px}
#tg .wh{display:inline-flex;align-items:center;gap:6px;font-weight:700;font-size:12px;font-family:inherit;padding:5px 11px;border-radius:99px;background:color-mix(in srgb,var(--accent,#E8501A) 12%,transparent);color:var(--accent,#E8501A);margin:2px 0 10px;max-width:100%}
#tg ol{margin:0;padding:0;list-style:none;counter-reset:n}
#tg li{counter-increment:n;position:relative;padding-inline-start:30px;margin-bottom:9px;font-size:14px;line-height:1.6}
#tg li::before{content:counter(n);position:absolute;inset-inline-start:0;top:2px;width:21px;height:21px;border-radius:50%;background:var(--ink,#0F1A2B);color:var(--surface,#fff);font:800 11.5px/21px system-ui;text-align:center}
#tg .em{text-align:center;padding:26px 10px;opacity:.6;font-size:14px}
#tg .ft{flex:none;padding:10px 14px calc(env(safe-area-inset-bottom,0px) + 14px);border-top:1px solid var(--line,#D2D8E0)}
#tg .go{width:100%;height:50px;border:0;border-radius:16px;background:linear-gradient(135deg,var(--accent,#E8501A),#ff8a4c);color:#fff;font-weight:800;font-size:16px;font-family:inherit;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px}
#tgBtn{position:relative;padding:0;display:grid;place-items:center;min-width:38px;width:38px}
#tgBtn svg{width:20px;height:20px}
#tgBtn i{position:absolute;top:5px;inset-inline-end:5px;width:9px;height:9px;border-radius:50%;background:#ffd60a;box-shadow:0 0 0 0 rgba(255,214,10,.7);animation:tgp 1.8s ease-out infinite}
@keyframes tgp{to{box-shadow:0 0 0 9px rgba(255,214,10,0)}}
@media (prefers-reduced-motion:reduce){#tgBtn i{animation:none}}`;
const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
const st2=document.createElement('style');st2.textContent=`
html body #tg{background:none!important;-webkit-backdrop-filter:none!important;backdrop-filter:none!important;opacity:1!important;transition:none!important}
html body #tg::before{content:"";position:absolute;inset:0;background:rgba(4,8,22,0);transition:background .3s,backdrop-filter .3s,-webkit-backdrop-filter .3s;-webkit-mask-image:radial-gradient(circle at var(--ix,50%) var(--iy,0),transparent 21px,#000 22px);mask-image:radial-gradient(circle at var(--ix,50%) var(--iy,0),transparent 21px,#000 22px)}
html body #tg.in::before{background:rgba(4,8,22,.58);-webkit-backdrop-filter:blur(5px);backdrop-filter:blur(5px)}
html body #tg .bx{position:relative;z-index:1;width:min(560px,calc(100% - 20px))!important;max-height:calc(100% - 96px)!important;margin:0 10px calc(env(safe-area-inset-bottom,0px) + 10px);transform:scale(.04)!important;opacity:0;will-change:transform,opacity;transition:transform .5s cubic-bezier(.2,.95,.25,1.04),opacity .2s ease-out!important}
html body #tg.in .bx{transform:none!important;opacity:1}
html body #tg:not(.in) .bx{transition:transform .34s cubic-bezier(.55,0,.8,.3),opacity .22s ease-in .1s!important}
html:root body #vHome .top .hdock>#tgBtn.open{color:#ffd60a!important;background:rgba(255,214,10,.14)!important;box-shadow:0 0 0 1.5px rgba(255,214,10,.65),0 0 20px 3px rgba(255,214,10,.55)!important;animation:tgOpenGlow 1.8s ease-in-out infinite}
html:root body #vHome .top .hdock>#tgBtn svg{transition:transform .45s cubic-bezier(.3,1.5,.5,1),filter .3s}
html:root body #vHome .top .hdock>#tgBtn.open svg{transform:scale(1.12) rotate(-8deg);filter:drop-shadow(0 0 6px rgba(255,214,10,.95))}
@keyframes tgOpenGlow{50%{box-shadow:0 0 0 1.5px rgba(255,214,10,.9),0 0 30px 7px rgba(255,214,10,.75)}}
@media (prefers-reduced-motion:reduce){html body #tg .bx,html body #tg::before{transition:opacity .15s!important}html:root body #vHome .top .hdock>#tgBtn.open{animation:none}}
html body #tg .bx{border-radius:30px 30px 0 0;box-shadow:0 -24px 60px -20px rgba(0,0,0,.7);transition:transform .4s cubic-bezier(.18,1,.3,1)}
html body #tg .hero{padding:10px 16px 14px;background:radial-gradient(120% 90% at 100% 0,rgba(138,86,255,.55),transparent 60%),radial-gradient(110% 90% at 0 0,rgba(34,211,245,.28),transparent 55%),linear-gradient(150deg,var(--navy1,#0a1f6b),var(--navy2,#14409a))}
html body #tg .hero h2{font-size:21px;letter-spacing:.1px;padding-inline-end:44px}
html body #tg .hero p{font-size:12.5px;line-height:1.55;margin:4px 0 12px;opacity:.85;padding-inline-end:6px}
html body #tg .x{width:34px;height:34px;display:grid;place-items:center;padding:0;font-size:14px;background:rgba(255,255,255,.16);transition:background .15s,transform .12s}
html body #tg .x:active{background:rgba(255,255,255,.3);transform:scale(.92)}
html body #tg .qs{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:0 0 10px}
html body #tg .qt{all:unset;box-sizing:border-box;display:flex;align-items:center;justify-content:center;gap:8px;height:42px;border-radius:14px;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.18);color:#fff;font:800 14px system-ui;cursor:pointer;-webkit-tap-highlight-color:transparent;transition:background .15s,transform .12s}
html body #tg .qt:active{transform:scale(.95);background:rgba(255,255,255,.26)}
html body #tg .qt b{width:22px;height:22px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(135deg,#1F6BFF,#8A56FF);font:800 12px system-ui}
html body #tg .sr{background:rgba(255,255,255,.13);border:1px solid rgba(255,255,255,.14)}
html body #tg .ls{padding:12px 12px 4px}
html body #tg details{border-radius:20px;border:1px solid color-mix(in srgb,var(--ink2,#8a94b8) 22%,transparent);background:color-mix(in srgb,var(--surface2,#eef) 55%,transparent);margin-bottom:10px;transition:border-color .2s,background .2s,box-shadow .2s}
html body #tg details[open]{border-color:var(--tc,var(--accent,#3b82f6));background:var(--surface,#fff);box-shadow:0 12px 28px -18px var(--tc,#3b82f6)}
html body #tg summary{padding:12px 12px;gap:12px}
html body #tg .ti{width:44px;height:44px;border-radius:14px}
html body #tg .tt b{font-size:15px}html body #tg .tt small{font-size:12px;line-height:1.4}
html body #tg .ch{width:26px;height:26px;padding:4px;border-radius:50%;background:var(--surface2,#eef);opacity:1;stroke-width:2.4}
html body #tg details[open] .ch{background:var(--tc,#3b82f6);color:#fff}
html body #tg .bd{padding:0 14px 8px}
html body #tg .wh{display:flex;width:max-content;max-width:100%;background:color-mix(in srgb,var(--tc,#3b82f6) 14%,transparent);color:var(--ink,#0F1A2B);font-size:12px!important;margin:0 0 6px;white-space:normal;line-height:1.4}
html body #tg ol{padding:0}
html body #tg li{display:flex;align-items:center;gap:10px;position:static;padding:10px 0;margin:0;border-top:1px dashed color-mix(in srgb,var(--ink2,#8a94b8) 28%,transparent);font-size:13.5px;line-height:1.6}
html body #tg li:first-child{border-top:0}
html body #tg li::before{position:static;flex:none;width:22px;height:22px;line-height:22px;background:color-mix(in srgb,var(--tc,#3b82f6) 16%,transparent);color:var(--ink,#0F1A2B);font-size:11.5px}
html body #tg li .tx{flex:1;min-width:0}
html body #tg .gb{all:unset;box-sizing:border-box;flex:none;width:34px;height:34px;border-radius:12px;display:grid;place-items:center;color:#fff;background:linear-gradient(135deg,var(--tc,#3b82f6),color-mix(in srgb,var(--tc,#3b82f6) 55%,#8A56FF));box-shadow:0 6px 14px -7px var(--tc,#3b82f6);cursor:pointer;-webkit-tap-highlight-color:transparent;transition:transform .12s,box-shadow .12s}
html body #tg .gb:active{transform:scale(.88);box-shadow:none}
html body #tg .ft{padding-top:10px}
html body #tg .go{height:52px;border-radius:17px;background:linear-gradient(100deg,#1F6BFF,#8A56FF);box-shadow:0 12px 24px -12px rgba(90,100,255,.9);transition:transform .12s}
html body #tg .go:active{transform:scale(.98)}
html body #tgBtn.tgpulse{overflow:visible!important;isolation:isolate;animation:tgbeat 2.6s cubic-bezier(.45,0,.2,1) infinite}
html body #tgBtn.tgpulse::before,html body #tgBtn.tgpulse::after{content:"";position:absolute;inset:0;border-radius:50%;pointer-events:none;z-index:-1}
html body #tgBtn.tgpulse::before{background:radial-gradient(circle,rgba(255,214,10,.65),rgba(34,211,245,.35) 45%,transparent 70%);animation:tgglow 2.6s ease-out infinite}
html body #tgBtn.tgpulse::after{border:2px solid rgba(255,214,10,.85);animation:tgring 2.6s ease-out infinite .35s}
html body #tgBtn.tgpulse svg{animation:tgspark 2.6s ease-in-out infinite;filter:drop-shadow(0 0 6px rgba(255,214,10,.9))}
@keyframes tgbeat{0%,60%,100%{transform:scale(1) rotate(0)}8%{transform:scale(1.22) rotate(-12deg)}16%{transform:scale(1.22) rotate(12deg)}24%{transform:scale(1.16) rotate(-8deg)}32%{transform:scale(1.12) rotate(5deg)}42%{transform:scale(1.06) rotate(0)}}
@keyframes tgglow{0%{transform:scale(.7);opacity:0}12%{opacity:1}70%,100%{transform:scale(2.7);opacity:0}}
@keyframes tgring{0%{transform:scale(.8);opacity:.9}75%,100%{transform:scale(2.3);opacity:0}}
@keyframes tgspark{0%,60%,100%{filter:drop-shadow(0 0 2px rgba(255,214,10,.4))}14%{filter:drop-shadow(0 0 10px rgba(255,214,10,1))}}
#tg .tgv{text-align:center;margin-top:8px;font:600 12px system-ui;opacity:.75;letter-spacing:.02em;display:block!important;visibility:visible!important}html body #tg .ft{display:block;flex:none!important;min-height:auto}
#tgTip{position:fixed;z-index:9500;padding:14px;border-radius:20px;color:var(--ink,#fff);background:color-mix(in srgb,var(--surface,#0d1433) 88%,transparent);-webkit-backdrop-filter:blur(20px) saturate(1.5);backdrop-filter:blur(20px) saturate(1.5);border:1px solid color-mix(in srgb,var(--accent,#3b82f6) 50%,transparent);box-shadow:0 24px 50px -16px rgba(0,0,0,.7),0 0 34px -12px var(--accent,#3b82f6);opacity:0;transform:translateY(-8px) scale(.92);transition:opacity .3s,transform .42s cubic-bezier(.18,1,.3,1);box-sizing:border-box}
#tgTip.in{opacity:1;transform:none}
#tgTip .ar{position:absolute;top:-7px;width:14px;height:14px;background:inherit;border:inherit;border-right:0;border-bottom:0;border-radius:4px 0 0 0;transform:rotate(45deg);-webkit-backdrop-filter:inherit;backdrop-filter:inherit}
#tgTip .tr{display:flex;gap:12px;align-items:flex-start}
#tgTip .tic{flex:none;width:40px;height:40px;border-radius:13px;display:grid;place-items:center;color:#fff;background:linear-gradient(135deg,#1F6BFF,#8A56FF);box-shadow:0 8px 18px -8px rgba(90,100,255,.9)}
#tgTip b{display:block;font:800 15px/1.3 system-ui;margin-bottom:3px}
#tgTip p{margin:0;font:600 13px/1.55 system-ui;color:var(--ink2,#9aa4c7)}
#tgTip .ta{display:flex;gap:8px;margin-top:12px}
#tgTip .ta button{all:unset;box-sizing:border-box;flex:1;height:40px;display:grid;place-items:center;border-radius:13px;font:800 13.5px system-ui;color:var(--ink,#fff);background:var(--surface2,rgba(255,255,255,.1));cursor:pointer;-webkit-tap-highlight-color:transparent}
#tgTip .ta button.p{flex:1.6;color:#fff;background:linear-gradient(100deg,#1F6BFF,#8A56FF);box-shadow:0 8px 18px -10px rgba(90,100,255,.95)}
#tgTip .ta button:active{transform:scale(.96)}
@media (prefers-reduced-motion:reduce){html body #tgBtn.tgpulse,html body #tgBtn.tgpulse::before,html body #tgBtn.tgpulse::after,html body #tgBtn.tgpulse svg{animation:none}html body #tgBtn.tgpulse::after{opacity:.8;transform:scale(1.5)}#tgTip{transition:opacity .2s;transform:none}}
`;document.head.appendChild(st2);
const st3=document.createElement('style');st3.textContent=`
html body #tg .hero{padding:10px 18px 14px;background:linear-gradient(150deg,var(--navy1,#0a1f6b),var(--navy2,#14409a))}
html body #tg .hero h2{font-size:20px}
html body #tg .hero p{font-size:12.5px;margin:3px 0 12px;opacity:.8}
html body #tg .sr{height:40px;background:rgba(255,255,255,.12);border:0}
html body #tg .ls{padding:6px 14px 8px}
html body #tg .qh{font:800 12px system-ui;color:var(--ink2,#8a94b8);margin:14px 4px 8px;letter-spacing:.2px}
html body #tg .qs{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:0}
html body #tg .qt{height:68px;flex-direction:column;gap:6px;border-radius:16px;background:var(--surface2,#eef);border:0;color:var(--ink,#0F1A2B);font:800 13px system-ui}
html body #tg .qt:active{background:color-mix(in srgb,var(--accent,#3b82f6) 18%,var(--surface2,#eef))}
html body #tg .qt b{width:24px;height:24px;font-size:12px}
html body #tg details{border:0;border-radius:18px;margin-bottom:8px;background:var(--surface2,#eef);box-shadow:none}
html body #tg details[open]{background:var(--surface,#fff);box-shadow:inset 0 0 0 1.5px var(--tc,#3b82f6)}
html body #tg summary{padding:10px 12px;gap:12px}
html body #tg .ti{width:40px;height:40px;border-radius:12px;box-shadow:none}
html body #tg .ti svg{width:20px;height:20px}
html body #tg .tt b{font-size:14.5px}
html body #tg .tt small{font-size:12px;opacity:.6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
html body #tg .ch{width:18px;height:18px;padding:0;background:none;border-radius:0;opacity:.45}
html body #tg details[open] .ch{background:none;color:inherit;opacity:.8}
html body #tg .bd{padding:0 14px 6px}
html body #tg .wh{display:block;width:auto;background:none;border-radius:0;padding:0 0 8px;margin:0;color:var(--ink2,#8a94b8);font-size:11.5px!important;font-weight:700}
html body #tg ol{margin:0}
html body #tg li{padding:10px 0;gap:10px;border-top:1px solid color-mix(in srgb,var(--ink2,#8a94b8) 16%,transparent);font-size:13px}
html body #tg li:first-child{border-top:1px solid color-mix(in srgb,var(--ink2,#8a94b8) 16%,transparent)}
html body #tg li::before{display:none}
html body #tg li .tx{display:flex;flex-direction:column;gap:2px}
html body #tg li .tx b{font-size:14px;font-weight:800}
html body #tg li .tx span{font-size:12.5px;line-height:1.5;color:var(--ink2,#8a94b8)}
html body #tg .gb{width:32px;height:32px;border-radius:50%;background:color-mix(in srgb,var(--tc,#3b82f6) 15%,transparent);color:var(--tc,#3b82f6);box-shadow:none}
html body #tg .gb:active{background:var(--tc,#3b82f6);color:#fff}
html body #tg .ft{padding-top:8px}
html body #tg .go{height:50px;box-shadow:none}
`;document.head.appendChild(st3);
let ov=null;
function tgOrigin(o){const tb=document.getElementById('tgBtn'),bx=o.querySelector('.bx');if(!tb||!bx)return;const r=tb.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;o.style.setProperty('--ix',cx+'px');o.style.setProperty('--iy',cy+'px');bx.style.transformOrigin=(cx-bx.offsetLeft)+'px '+(cy-bx.offsetTop)+'px';}
function close(){if(!ov)return;const o=ov;ov=null;const tb=document.getElementById('tgBtn');if(tb)tb.classList.remove('open');tgOrigin(o);o.classList.remove('in');setTimeout(()=>o.remove(),420);}
const BOLT='<svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true"><path d="M13.2 2.5 5 13.2h5.6l-1 8.3 8.4-11h-5.7z"/></svg>';
function open(){
 if(ov)return;try{localStorage.setItem(SEEN,'1');localStorage.setItem('tx_guide_tip','1')}catch(e){}
 const d0=document.querySelector('#tgBtn i');if(d0)d0.remove();const pb=document.getElementById('tgBtn');if(pb)pb.classList.remove('tgpulse');const tp=document.getElementById('tgTip');if(tp)tp.remove();
 const o=document.createElement('div');o.id='tg';o.style.zIndex='9000';o.setAttribute('role','dialog');o.setAttribute('aria-modal','true');
 const k=A()?0:1,gl=L('جرّبها الآن','Try it now');
 o.innerHTML='<div class="bx"><div class="hero"><div class="hd"></div><button class="x" type="button" data-a="x" aria-label="'+L('إغلاق','Close')+'">✕</button><h2>'+L('التطبيق يقدر يعمل إيه؟','What can Timaxo do?')+'</h2><p>'+L('اضغط ⚡ جنب أي خطوة وهتروح للأداة على طول.','Tap ⚡ next to any step to jump straight to the tool.')+'</p><label class="sr">'+ic('<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>').replace('width="22" height="22"','width="18" height="18"')+'<input type="search" id="tgQ" autocomplete="off" placeholder="'+L('ابحث: قفل، PDF، بطاقة، ترجمة…','Search: lock, PDF, card, translate…')+'"></label></div><div class="ls" id="tgL"></div><div class="ft"><button class="go" type="button" id="tgGo">'+L('ابدأ التصوير','Start scanning')+'</button><div class="tgv">Timaxo · v'+(window.TXV||'207')+'</div></div></div>';
 const ls=o.querySelector('#tgL');
 ls.insertAdjacentHTML('beforeend','<div class="qh" id="tgQH">'+L('ابدأ في ٣ خطوات','Start in 3 steps')+'</div><div class="qs" id="tgQS">'+QS.map(a=>'<button type="button" class="qt" data-g="'+a[3]+'"><b>'+a[0]+'</b><span>'+a[A()?1:2]+'</span></button>').join('')+'</div><div class="qh">'+L('الأدوات حسب الموضوع','Tools by topic')+'</div>');
 const stp=t=>{const p=t.split('|');return p.length>1?'<b>'+p[0]+'</b><span>'+p[1]+'</span>':'<span>'+t+'</span>';};
 D.forEach((x,n)=>{const dt=document.createElement('details');dt.style.setProperty('--tc',x.c[0]);
  dt.dataset.s=(x.t[k]+' '+x.s[k]+' '+x.w[k]+' '+x.p.map(a=>a[k]).join(' ')).toLowerCase();
  dt.innerHTML='<summary><span class="ti" style="background:linear-gradient(135deg,'+x.c[0]+','+x.c[1]+')">'+x.i+'</span><span class="tt"><b>'+x.t[k]+'</b><small>'+x.s[k]+'</small></span>'+ic('<path d="M6 9l6 6 6-6"/>').replace('width="22" height="22"','class="ch" width="18" height="18"')+'</summary><div class="bd"><span class="wh">📍 '+x.w[k]+'</span><ol>'+x.p.map(a=>'<li><span class="tx">'+stp(a[k])+'</span>'+(a[2]?'<button type="button" class="gb" data-g="'+a[2]+'" aria-label="'+gl+'" title="'+gl+'">'+BOLT+'</button>':'')+'</li>').join('')+'</ol></div>';
  dt.addEventListener('toggle',()=>{if(dt.open&&!o.querySelector('#tgQ').value)ls.querySelectorAll('details[open]').forEach(e=>{if(e!==dt)e.open=false;});});
  ls.appendChild(dt);});
 const em=document.createElement('div');em.className='em';em.hidden=true;em.textContent=L('مفيش نتايج. جرّب كلمة تانية.','No results. Try another word.');ls.appendChild(em);
 o.querySelector('#tgQ').addEventListener('input',e=>{const v=e.target.value.trim().toLowerCase();let n=0;ls.querySelectorAll('.qh,.qs').forEach(x=>x.hidden=!!v);ls.querySelectorAll('details').forEach(d=>{const m=!v||d.dataset.s.includes(v);d.hidden=!m;if(m)n++;if(v&&m)d.open=true;});em.hidden=n>0;});
 o.addEventListener('click',e=>{if(e.target===o||e.target.closest('[data-a=x]')){close();return;}const g=e.target.closest('[data-g]');if(g){const a=g.dataset.g;close();setTimeout(()=>run(a),260);}});
 o.querySelector('#tgGo').onclick=()=>{close();setTimeout(()=>{const b=document.getElementById('scanBtn');if(b)b.click();},240);};
 let y0=null;const hero=o.querySelector('.hero');hero.addEventListener('touchstart',e=>{y0=e.touches[0].clientY;},{passive:true});hero.addEventListener('touchend',e=>{if(y0!==null&&e.changedTouches[0].clientY-y0>60)close();y0=null;},{passive:true});
 document.body.appendChild(o);ov=o;tgOrigin(o);{const tb=document.getElementById('tgBtn');if(tb)tb.classList.add('open');}
 {let sx=0,sy=0;o.addEventListener('touchstart',e=>{sx=e.touches[0].clientX;sy=e.touches[0].clientY;},{passive:true});o.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy;if(Math.abs(dx)>80&&Math.abs(dx)>1.6*Math.abs(dy))close();},{passive:true});}
 void o.offsetWidth;requestAnimationFrame(()=>o.classList.add('in'));
}
/* ---- first-run: pulsing icon + coach-mark that points at it ---- */
function coach(b){
 let tip=1,seen=0;try{tip=localStorage.getItem('tx_guide_tip');seen=localStorage.getItem(SEEN);}catch(e){}
 if(tip||seen)return;
 let tries=0;const tick=()=>{if(++tries>40||!b.isConnected)return;
  const sp=document.getElementById('splash'),cs=sp&&getComputedStyle(sp),spOn=cs&&cs.display!=='none'&&cs.visibility!=='hidden'&&parseFloat(cs.opacity)>0.05,r=b.getBoundingClientRect(),home=document.querySelector('#vHome.on');
  if(spOn||!home||!r.width||document.getElementById('tg')||document.querySelector('.sheet.on'))return setTimeout(tick,450);
  show(b,r);};
 setTimeout(tick,1800);
 function show(b,r){
  try{localStorage.setItem('tx_guide_tip','1')}catch(e){}const el=document.createElement('div');el.id='tgTip';el.setAttribute('role','dialog');
  el.innerHTML='<i class="ar"></i><div class="tr"><span class="tic">'+ic('<path d="M12 3l1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9z"/>').replace('width="22" height="22"','width="20" height="20"')+'</span><div><b>'+L('مش عارف تبدأ منين؟','Not sure where to start?')+'</b><p>'+L('اضغط على الأيقونة اللامعة فوق، وهتلاقي دليل مبسّط بيشرح كل أدوات التطبيق خطوة بخطوة.','Tap the glowing icon above for a simple guide to every tool, step by step.')+'</p></div></div><div class="ta"><button type="button" class="p" data-t="go">'+L('افتح الدليل','Open the guide')+'</button><button type="button" data-t="no">'+L('لاحقًا','Later')+'</button></div>';
  document.body.appendChild(el);
  const w=Math.min(innerWidth-24,330);el.style.width=w+'px';
  let left=r.left+r.width/2-w/2;left=Math.max(12,Math.min(innerWidth-w-12,left));
  el.style.left=left+'px';el.style.top=(r.bottom+14)+'px';
  el.querySelector('.ar').style.left=Math.max(18,Math.min(w-30,r.left+r.width/2-left-7))+'px';
  el.style.transformOrigin=(r.left+r.width/2-left)+'px 0';
  requestAnimationFrame(()=>el.classList.add('in'));
  const kill=()=>{try{localStorage.setItem('tx_guide_tip','1')}catch(e){}document.removeEventListener('pointerdown',away,true);el.classList.remove('in');setTimeout(()=>el.remove(),260);};
  const away=e=>{if(!el.contains(e.target)&&!b.contains(e.target))kill();};
  setTimeout(()=>document.addEventListener('pointerdown',away,true),600);setTimeout(kill,9000);
  el.addEventListener('click',e=>{const t=e.target.closest('[data-t]');if(!t)return;kill();if(t.dataset.t==='go')setTimeout(()=>b.click(),120);});
 }
}
function mount(){
 const lb=document.getElementById('langBtn');if(!lb||document.getElementById('tgBtn'))return;
 const b=document.createElement('button');b.id='tgBtn';b.type='button';b.className=lb.className;b.setAttribute('aria-label',L('دليل التطبيق','App guide'));
 let seen=0;try{seen=localStorage.getItem(SEEN)}catch(e){}
 b.innerHTML=ic('<circle cx="12" cy="12" r="9.2"/><path d="M9.2 9.4a2.9 2.9 0 0 1 5.6.9c0 1.9-2.8 2.4-2.8 4.1"/><path d="M12 17.6h.01"/>')+(seen?'':'<i></i>');
 b.onclick=()=>{b.setAttribute('aria-label',L('دليل التطبيق','App guide'));if(ov){close();return;}open();};
 lb.parentNode.insertBefore(b,lb);if(!seen){let tp0=0;try{tp0=localStorage.getItem('tx_guide_tip')}catch(e){}if(!tp0){b.classList.add('tgpulse');setTimeout(()=>b.classList.remove('tgpulse'),12000)}coach(b);}
 const fix=()=>{b.setAttribute('aria-label',L('دليل التطبيق','App guide'));const g=document.getElementById('galFab');if(g)g.setAttribute('aria-label',L('استيراد من الجهاز','Import from device'));};
 fix();new MutationObserver(fix).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
}
/* ---- slim header: logo on one side, ONE glass capsule (theme · sound · ✨ guide · ⋯ more) on the other; language & theme-switch move out of the row ---- */
const dcss=document.createElement('style');dcss.textContent=`
#vHome .top{flex-wrap:nowrap!important;row-gap:0!important;align-items:center}
#vHome .top .utils,#vHome .top #langBtn{display:none!important}
#vHome .top .brand{flex:1 1 0!important;min-width:0!important;order:0!important}
#vHome .hdock{display:flex;align-items:center;gap:1px;padding:2px;border-radius:99px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);flex:none;order:1}
#vHome .hdock>button{width:34px!important;min-width:34px!important;height:34px!important;padding:0!important;margin:0!important;border:0!important;border-radius:50%!important;background:transparent!important;color:#fff!important;display:grid!important;place-items:center;font-size:12px;font-weight:800;opacity:1!important;box-shadow:none!important;transition:background .15s,transform .12s}
#vHome .hdock>button:active{background:rgba(255,255,255,.22)!important;transform:scale(.9)}
#vHome .hdock>button svg{width:19px;height:19px}
#vHome .hdock>#thBtn{font-size:17px;line-height:1}
#vHome .top .inst{order:1;flex:none;height:32px;padding:0 9px;font-size:11.5px;white-space:nowrap}`;
document.head.appendChild(dcss);
function dock(){
 const top=document.querySelector('#vHome .top');if(!top||top.querySelector('.hdock'))return;
 const lb=document.getElementById('langBtn'),tg=document.getElementById('tgBtn'),fx=document.getElementById('fxBtn');
 const more=document.getElementById('setBtn');
 if(!lb||!tg)return;
 const R=document.documentElement,G={light:'☀',blue:'✦',dark:'☾'},ORD=['light','blue','dark'];
 const th=document.createElement('button');th.id='thBtn';th.type='button';
 const paint=()=>{const m=R.getAttribute('data-theme')||'blue';th.textContent=G[m]||'✦';th.setAttribute('aria-label',L('تغيير الثيم','Change theme'));};paint();
 new MutationObserver(paint).observe(R,{attributes:true,attributeFilter:['data-theme','lang']});
 th.onclick=e=>{const b=document.querySelector('.ut.th');
  if(b){b.dispatchEvent(new MouseEvent('click',{bubbles:true,clientX:e.clientX,clientY:e.clientY}));return;}
  const m=R.getAttribute('data-theme')||'blue',nx=ORD[(ORD.indexOf(m)+1)%3];R.setAttribute('data-theme',nx);try{localStorage.setItem('tx_theme3',nx)}catch(_){}};
 const d=document.createElement('div');d.className='hdock';lb.parentNode.insertBefore(d,lb);
 [th,fx,tg,more].forEach(e=>{if(e)d.appendChild(e);});
}
function start(){mount();dock();setTimeout(dock,700);setTimeout(dock,2000);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
