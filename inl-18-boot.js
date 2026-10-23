
/* بيانات الاستمارات: ملف شخصي محلي بيتحط كنص بنقرة */
(function(){var K='timaxo-profile',F=[['name','الاسم','Name'],['nid','الرقم القومي','National ID'],['phone','الموبايل','Phone'],['dob','تاريخ الميلاد','Date of birth'],['addr','العنوان','Address'],['email','الإيميل','Email']];
function get(){try{return JSON.parse(localStorage.getItem(K))||{}}catch(e){return{}}}
function put(o){try{localStorage.setItem(K,JSON.stringify(o))}catch(e){}}
var en=function(){return document.documentElement.lang==='en'||(typeof lang!=='undefined'&&lang==='en')};
var tb=document.getElementById('textBar'),ti=document.getElementById('textIn');if(!tb||!ti)return;
var row=document.createElement('div');row.id='pfRow';tb.insertBefore(row,tb.firstChild);
function draw(){var p=get(),e=en();row.innerHTML='';F.forEach(function(f){if(!p[f[0]])return;var b=document.createElement('button');b.className='chip';b.textContent=e?f[2]:f[1];b.onclick=function(){ti.value=p[f[0]];ti.focus();};row.appendChild(b);});
 var ed=document.createElement('button');ed.className='chip';ed.textContent=e?'✎ My data':'✎ بياناتي';ed.onclick=edit;row.appendChild(ed);}
function edit(){var p=get(),e=en(),m=document.createElement('div');m.id='pfMod';
 m.innerHTML='<div><b>'+(e?'My form data (stored on this device only)':'بياناتي للاستمارات (محفوظة على جهازك بس)')+'</b>'+F.map(function(f){return '<label>'+(e?f[2]:f[1])+'</label><input data-k="'+f[0]+'" autocomplete="off">'}).join('')+'<div class="acts"><button class="btn" data-x="c">'+(e?'Cancel':'إلغاء')+'</button><button class="btn pri" data-x="s">'+(e?'Save':'حفظ')+'</button></div></div>';
 m.querySelectorAll('input').forEach(function(i){i.value=p[i.dataset.k]||''});
 m.onclick=function(ev){if(ev.target===m||ev.target.dataset.x==='c')m.remove();else if(ev.target.dataset.x==='s'){var o={};m.querySelectorAll('input').forEach(function(i){var v=i.value.trim();if(v)o[i.dataset.k]=v});put(o);m.remove();draw();}};
 document.body.appendChild(m);}
new MutationObserver(function(){if(!tb.hidden)draw();}).observe(tb,{attributes:true,attributeFilter:['hidden']});draw();
})();
