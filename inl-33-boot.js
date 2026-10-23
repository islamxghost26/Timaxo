/* v154: سياسة الخصوصية كقايمة جوه التطبيق (نفس ستايل قايمة اللغة) */
(function(){var sheet=null;
function ar(){return document.documentElement.lang!=='en'}
var IC={
 db:'<svg viewBox="0 0 24 24"><ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/></svg>',
 dev:'<svg viewBox="0 0 24 24"><rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/></svg>',
 cam:'<svg viewBox="0 0 24 24"><path d="M4 8h3l1.5-2.5h7L17 8h3v11H4z"/><circle cx="12" cy="13" r="3.4"/></svg>',
 txt:'<svg viewBox="0 0 24 24"><path d="M4 7V4h16v3M12 4v16M9 20h6"/></svg>',
 kid:'<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.5"/><path d="M5 20c.8-4 3.5-6 7-6s6.2 2 7 6"/></svg>',
 shield:'<svg viewBox="0 0 24 24"><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z"/><path d="M9 12l2.2 2.2L15.5 10"/></svg>'};
function data(){var a=ar();return [
 ['db','#1b63f0',a?'البيانات اللي بنجمعها':'Data we collect',a?'التطبيق لا يجمع ولا يرسل أي مستندات أو صور أو بيانات شخصية لأي خادم. مفيش حسابات ولا إعلانات ولا أدوات تحليل.':'The app does not collect, upload or share any documents, photos or personal data. No accounts, no ads, no analytics.'],
 ['dev','#16a34a',a?'التخزين':'Storage',a?'كل المستندات والإعدادات بتتخزن على جهازك فقط. لو مسحت بيانات التطبيق أو حذفته، المستندات بتتمسح، فاستخدم النسخة الاحتياطية جوه التطبيق.':'All documents and settings stay only on your device. If you clear app data or uninstall, documents are deleted, so use the in-app backup.'],
 ['cam','#e0527a',a?'الكاميرا':'Camera',a?'بنطلب إذن الكاميرا لتصوير المستندات وقراءة QR، والصور بتتعالج على جهازك فقط.':'Camera permission is used to scan documents and read QR codes. Images are processed on your device only.'],
 ['txt','#0891b2',a?'قراءة النص (OCR)':'Text recognition (OCR)',a?'القراءة بتتم على جهازك بنماذج مرفقة مع التطبيق (عربي وإنجليزي وصيني). لبعض اللغات الإضافية قد يحمّل التطبيق ملفات لغة من jsDelivr أو Hugging Face أو GitHub. بيتم تحميل ملفات فقط ولا يُرسل أي مستند، لكن مزوّد الخدمة قد يرى عنوان IP الخاص بك كأي موقع ويب.':'Text recognition runs on your device using models bundled with the app (Arabic, English, Chinese). For some extra languages the app may download language files from jsDelivr, Hugging Face or GitHub. Only files are downloaded and no document is uploaded, though the provider may see your IP address like any website.'],
 ['txt','#7c3aed',a?'الترجمة':'Translation',a?'الترجمة على الجهاز لا ترسل شيئاً. الترجمة عبر الإنترنت اختيارية ولا تعمل إلا بعد موافقتك الصريحة، وفيها يُرسل النص الذي تترجمه إلى Google Translate أو MyMemory حسب المتاح. لا تستخدمها مع نصوص حساسة.':'On-device translation sends nothing. Online translation is optional and runs only after your explicit consent; the text you translate is then sent to Google Translate or MyMemory. Do not use it for sensitive text.'],
 ['shield','#475569',a?'الأمان والاستضافة':'Security and hosting',a?'القفل بالرقم السري يحمي واجهة التطبيق ولا يشفّر المستندات المخزنة. النسخة الاحتياطية مشفّرة بكلمة سر تختارها ولا نقدر نسترجعها لو نسيتها. الموقع مستضاف على Cloudflare وقد يسجّل عنوان IP لأغراض التشغيل والحماية.':'The PIN lock protects the app screen and does not encrypt stored documents. Backups are encrypted with a password you choose, and we cannot recover it if you forget it. The site is hosted on Cloudflare, which may log IP addresses for operation and protection.'],
 ['kid','#e08a1b',a?'الأطفال':'Children',a?'التطبيق لا يستهدف الأطفال ولا يجمع بيانات عنهم.':'The app is not directed at children and collects no data about them.']];}
function close(fast){var s=sheet;if(!s)return;sheet=null;document.removeEventListener('keydown',key,true);
 var red=matchMedia('(prefers-reduced-motion:reduce)').matches;
 if(fast||red||!s.animate){s.remove();return}
 var bx=s.firstChild;bx.animate([{transform:'none'},{transform:'translateY(100%)'}],{duration:160,easing:'cubic-bezier(.4,0,1,1)',fill:'forwards'});
 var a=s.animate([{opacity:1},{opacity:0}],{duration:160,fill:'forwards'});a.onfinish=function(){s.remove()};}
function key(e){if(e.key==='Escape'){e.stopPropagation();e.preventDefault();close()}}
function open(){if(sheet)return;var a=ar(),s=document.createElement('div');s.className='txls pv';s.dir=a?'rtl':'ltr';
 var t=a?'سياسة الخصوصية':'Privacy policy',h='<div class="bx" role="dialog" aria-modal="true" aria-label="'+t+'"><div class="hd"></div>'
 +'<div class="ph"><div class="ti"><h3>'+t+'</h3><p class="tl-st">'+(a?'آخر تحديث: 21 أكتوبر 2026':'Last updated: 21 October 2026')+'</p></div><button type="button" class="x" aria-label="'+(a?'إغلاق':'Close')+'"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>'
 +'<div class="hero"><span class="ic">'+IC.shield+'</span><p>'+(a?'مستنداتك بتفضل على جهازك. مفيش حسابات ولا إعلانات ولا تتبع.':'Your documents stay on your device. No accounts, no ads, no tracking.')+'</p></div>';
 data().forEach(function(d){h+='<div class="it"><span class="ic" style="background:'+d[1]+'">'+IC[d[0]]+'</span><div><b>'+d[2]+'</b><p>'+d[3]+'</p></div></div>'});
 h+='<div class="ft">Timaxo Scan · Timaxo.apps@gmail.com</div></div>';s.innerHTML=h;
 s.addEventListener('click',function(e){if(e.target===s)close()});
 s.querySelector('.x').onclick=function(e){e.stopPropagation();close()};
 document.body.appendChild(s);sheet=s;document.addEventListener('keydown',key,true);
 if(!matchMedia('(prefers-reduced-motion:reduce)').matches&&s.animate){s.animate([{opacity:0},{opacity:1}],{duration:150,fill:'both'});s.firstChild.animate([{transform:'translateY(100%)'},{transform:'none'}],{duration:230,easing:'cubic-bezier(.2,.9,.3,1)',fill:'both'});}}
window.__txPriv=open;})();
