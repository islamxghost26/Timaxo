/* ===== Timaxo v161: table-export.js =====
   مُصدّر الجداول (أوفلاين، بدون مكتبات): Excel (.xlsx) وWord (.docx) وHTML للنسخ، بنفس شكل الصورة:
   دمج خلايا، ألوان خلفية/خط، محاذاة، اتجاه RTL، عرض الأعمدة وارتفاع الصفوف، وشيت/جدول لكل جدول في الصورة.
   g = {rows,spans,voids,st,colW,rowH,rtl,nR,nC,before?,tail?} (ناتج TXTable.grid، والنص ممكن يتعدّل). */
(function(root){
'use strict';
const enc=new TextEncoder(),AR=/[\u0600-\u06FF]/,TBH='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
const CRC=(()=>{const t=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0;}return t;})();
const crc=u=>{let c=0xFFFFFFFF;for(let i=0;i<u.length;i++)c=CRC[(c^u[i])&255]^(c>>>8);return(c^0xFFFFFFFF)>>>0;};
function zip(files,mime){const parts=[],cen=[],u16=v=>[v&255,(v>>8)&255],u32=v=>[v&255,(v>>8)&255,(v>>16)&255,(v>>>24)&255];let off=0;
 for(const f of files){const nm=enc.encode(f.n),d=enc.encode(f.d),cr=crc(d),lh=new Uint8Array([0x50,0x4b,3,4,...u16(20),...u16(0x0800),...u16(0),...u16(0),...u16(0x21),...u32(cr),...u32(d.length),...u32(d.length),...u16(nm.length),...u16(0)]);
  parts.push(lh,nm,d);cen.push(new Uint8Array([0x50,0x4b,1,2,...u16(20),...u16(20),...u16(0x0800),...u16(0),...u16(0),...u16(0x21),...u32(cr),...u32(d.length),...u32(d.length),...u16(nm.length),...u16(0),...u16(0),...u16(0),...u16(0),...u32(0),...u32(off)]),nm);off+=lh.length+nm.length+d.length;}
 let cs=0;for(const c of cen)cs+=c.length;
 return new Blob([...parts,...cen,new Uint8Array([0x50,0x4b,5,6,0,0,0,0,...u16(files.length),...u16(files.length),...u32(cs),...u32(off),0,0])],{type:mime});}
const X=s=>String(s).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g,'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const dig=s=>String(s).replace(/[\u0660-\u0669]/g,c=>String(c.charCodeAt(0)-1632)).replace(/[\u06f0-\u06f9]/g,c=>String(c.charCodeAt(0)-1776));
const NUM=s=>{const t=dig(s).replace(/[\u066c\u060c]/g,',').replace(/\u066b/g,'.').trim();
 if(/^[-+]?(0|[1-9]\d{0,2}(,\d{3})+|[1-9]\d*)(\.\d+)?$|^[-+]?0\.\d+$/.test(t)){const v=t.replace(/,/g,'').replace(/^\+/,'');if(v.replace(/\D/g,'').length<=15)return v;}return null;};
const med=a=>{if(!a.length)return 1;const b=a.slice().sort((x,y)=>x-y);return b[b.length>>1]||1;};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const lum=h=>{const r=parseInt(h.slice(0,2),16),g=parseInt(h.slice(2,4),16),b=parseInt(h.slice(4,6),16);return .3*r+.59*g+.11*b;};
const autoFg=(bg,fg)=>fg||(bg&&lum(bg)<120?'FFFFFF':null);
const colName=i=>{let s='',n=i+1;while(n>0){const m=(n-1)%26;s=String.fromCharCode(65+m)+s;n=(n-m-1)/26|0;}return s;};

/* تخطيط: لكل خلية own (مالكة الدمج) أو cov (مغطّاة) أو void (فاضية خارج الشكل) */
function layout(g){const nR=g.nR,nC=g.nC,L=Array.from({length:nR},()=>Array(nC).fill(null)),sp=new Map();
 for(const [r,c] of g.voids||[])if(L[r])L[r][c]={k:'void'};
 (g.spans||[]).forEach(s=>sp.set(s.r+','+s.c,s));
 for(let r=0;r<nR;r++)for(let c=0;c<nC;c++){if(L[r][c])continue;const s=sp.get(r+','+c)||{rs:1,cs:1},o={k:'own',r,c,rs:s.rs,cs:s.cs};L[r][c]=o;
  for(let i=r;i<r+s.rs&&i<nR;i++)for(let j=c;j<c+s.cs&&j<nC;j++)if(!(i===r&&j===c))L[i][j]={k:'cov',o};}
 return L;}
const sty=(g,r,c)=>(g.st&&g.st[r]&&g.st[r][c])||{};

/* ---------- Excel ---------- */
function xlsx(items){
 const fonts=['<font><sz val="11"/><name val="Arial"/><family val="2"/></font>'],fm=new Map(),fills=['<fill><patternFill patternType="none"/></fill>','<fill><patternFill patternType="gray125"/></fill>'],flm=new Map(),
  xfs=['<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>'],xm=new Map();
 const fid=(fg,b)=>{if(!fg&&!b)return 0;const k=(fg||'')+'|'+(b?1:0);if(fm.has(k))return fm.get(k);fonts.push('<font>'+(b?'<b/>':'')+'<sz val="11"/>'+(fg?'<color rgb="FF'+fg+'"/>':'')+'<name val="Arial"/><family val="2"/></font>');fm.set(k,fonts.length-1);return fonts.length-1;};
 const flid=bg=>{if(!bg)return 0;if(flm.has(bg))return flm.get(bg);fills.push('<fill><patternFill patternType="solid"><fgColor rgb="FF'+bg+'"/><bgColor indexed="64"/></patternFill></fill>');flm.set(bg,fills.length-1);return fills.length-1;};
 const HA={l:'left',c:'center',r:'right'};
 const xf=o=>{const k=[o.bg||'',o.fg||'',o.al||'',o.rtl?1:0].join('|');if(xm.has(k))return xm.get(k);
  xfs.push('<xf numFmtId="0" fontId="'+fid(o.fg,0)+'" fillId="'+flid(o.bg)+'" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="'+(HA[o.al]||'general')+'" vertical="center" wrapText="1"'+(o.rtl?' readingOrder="2"':'')+'/></xf>');
  xm.set(k,xfs.length-1);return xfs.length-1;};
 const used=new Set(),sheets=items.map((it,idx)=>{const g=it.g||it,L=layout(g),nR=g.nR,nC=g.nC;
  let nm=String(it.name||('Table '+(idx+1))).replace(/[\\\/\*\?:\[\]]/g,' ').trim().slice(0,31)||('Table '+(idx+1));while(used.has(nm.toLowerCase()))nm=nm.slice(0,28)+' '+(idx+1);used.add(nm.toLowerCase());
  const cw=g.colW||Array(nC).fill(1),sw=cw.reduce((a,b)=>a+b,0)||1,tot=clamp(nC*16,70,150),widths=[];
  for(let c=0;c<nC;c++){let m=0;for(let r=0;r<nR;r++)if(L[r][c].k==='own'&&L[r][c].cs===1)for(const ln of String(g.rows[r][c]||'').split('\n'))m=Math.max(m,ln.length);widths.push(clamp(Math.max(cw[c]/sw*tot,Math.min(m*1.15+3,45)),6,60));}
  const rh=g.rowH||Array(nR).fill(1),md=med(rh);let sd='',merges=[];
  for(let r=0;r<nR;r++){let ml=1;
   for(let c=0;c<nC;c++){const e=L[r][c];if(e.k==='own')ml=Math.max(ml,String(g.rows[r][c]||'').split('\n').length*(e.rs>1?1/e.rs:1));}
   const ht=clamp(Math.max(rh[r]/md*18,ml*15+4),16,160);let cells='';
   for(let c=0;c<nC;c++){const e=L[r][c],ref=colName(c)+(r+1);if(e.k==='void')continue;
    const o=e.k==='own'?e:e.o,v=String(g.rows[o.r][o.c]||''),s0=sty(g,o.r,o.c),isA=AR.test(v);
    const s=xf({bg:s0.bg,fg:autoFg(s0.bg,s0.fg),al:s0.al||(g.rtl?'c':null),rtl:isA});
    if(e.k==='cov'){cells+='<c r="'+ref+'" s="'+s+'"/>';continue;}
    if(e.rs>1||e.cs>1)merges.push(colName(c)+(r+1)+':'+colName(c+e.cs-1)+(r+e.rs));
    const nmv=v===''?null:NUM(v);
    cells+=v===''?'<c r="'+ref+'" s="'+s+'"/>':nmv!==null?'<c r="'+ref+'" s="'+s+'"><v>'+nmv+'</v></c>':'<c r="'+ref+'" s="'+s+'" t="inlineStr"><is><t xml:space="preserve">'+X(v)+'</t></is></c>';}
   sd+='<row r="'+(r+1)+'" ht="'+ht.toFixed(1)+'" customHeight="1">'+cells+'</row>';}
  const NS='xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"';
  const xml=TBH+'<worksheet '+NS+'><sheetPr><pageSetUpPr fitToPage="1"/></sheetPr><sheetViews><sheetView workbookViewId="0"'+(idx===0?' tabSelected="1"':'')+(g.rtl?' rightToLeft="1"':'')+' showGridLines="0"/></sheetViews><sheetFormatPr defaultRowHeight="18"/><cols>'+widths.map((x,i)=>'<col min="'+(i+1)+'" max="'+(i+1)+'" width="'+x.toFixed(1)+'" customWidth="1"/>').join('')+'</cols><sheetData>'+sd+'</sheetData>'+(merges.length?'<mergeCells count="'+merges.length+'">'+merges.map(m=>'<mergeCell ref="'+m+'"/>').join('')+'</mergeCells>':'')+'<pageMargins left="0.4" right="0.4" top="0.5" bottom="0.5" header="0.3" footer="0.3"/><pageSetup orientation="'+(nC>6?'landscape':'portrait')+'" fitToWidth="1" fitToHeight="0"/></worksheet>';
  return{nm,xml};});
 const NS='xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"',RN='http://schemas.openxmlformats.org/package/2006/relationships',OD='http://schemas.openxmlformats.org/officeDocument/2006/relationships',n=sheets.length;
 const files=[
  {n:'[Content_Types].xml',d:TBH+'<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'+sheets.map((_,i)=>'<Override PartName="/xl/worksheets/sheet'+(i+1)+'.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>').join('')+'<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>'},
  {n:'_rels/.rels',d:TBH+'<Relationships xmlns="'+RN+'"><Relationship Id="rId1" Type="'+OD+'/officeDocument" Target="xl/workbook.xml"/></Relationships>'},
  {n:'xl/workbook.xml',d:TBH+'<workbook '+NS+' xmlns:r="'+OD+'"><sheets>'+sheets.map((s,i)=>'<sheet name="'+X(s.nm)+'" sheetId="'+(i+1)+'" r:id="rId'+(i+1)+'"/>').join('')+'</sheets></workbook>'},
  {n:'xl/_rels/workbook.xml.rels',d:TBH+'<Relationships xmlns="'+RN+'">'+sheets.map((_,i)=>'<Relationship Id="rId'+(i+1)+'" Type="'+OD+'/worksheet" Target="worksheets/sheet'+(i+1)+'.xml"/>').join('')+'<Relationship Id="rId'+(n+1)+'" Type="'+OD+'/styles" Target="styles.xml"/></Relationships>'},
  {n:'xl/styles.xml',d:TBH+'<styleSheet '+NS+'><fonts count="'+fonts.length+'">'+fonts.join('')+'</fonts><fills count="'+fills.length+'">'+fills.join('')+'</fills><borders count="2"><border><left/><right/><top/><bottom/><diagonal/></border><border><left style="thin"><color auto="1"/></left><right style="thin"><color auto="1"/></right><top style="thin"><color auto="1"/></top><bottom style="thin"><color auto="1"/></bottom><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="'+xfs.length+'">'+xfs.join('')+'</cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>'}
 ];
 sheets.forEach((s,i)=>files.push({n:'xl/worksheets/sheet'+(i+1)+'.xml',d:s.xml}));
 return zip(files,'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');}

/* ---------- Word ---------- */
/* jc في فقرة bidi بيتقلب (left=بداية السطر يعني اليمين) فبنقلب عشان المحاذاة الفعلية تطلع زي الصورة */
function par(t,o){o=o||{};const a=AR.test(t),al=o.al||(a?'r':'l'),jc=al==='c'?'center':(a?(al==='r'?'left':'right'):(al==='r'?'right':'left')),sz=o.sz||22;
 return'<w:p><w:pPr>'+(a?'<w:bidi/>':'')+'<w:spacing w:before="'+(o.sp==null?40:o.sp)+'" w:after="'+(o.sp==null?40:o.sp)+'"/><w:jc w:val="'+jc+'"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>'+(o.bold?'<w:b/><w:bCs/>':'')+(o.color?'<w:color w:val="'+o.color+'"/>':'')+'<w:sz w:val="'+sz+'"/><w:szCs w:val="'+sz+'"/>'+(a?'<w:rtl/>':'')+'</w:rPr><w:t xml:space="preserve">'+X(t)+'</w:t></w:r></w:p>';}
function wtbl(g,TW){const L=layout(g),nR=g.nR,nC=g.nC,cw=g.colW||Array(nC).fill(1),sm=cw.reduce((a,b)=>a+b,0)||1,tw=cw.map(x=>Math.max(600,Math.round(TW*x/sm))),rh=g.rowH||Array(nR).fill(1),md=med(rh);
 const B=['top','left','bottom','right','insideH','insideV'].map(s=>'<w:'+s+' w:val="single" w:sz="6" w:space="0" w:color="000000"/>').join('');
 let o='<w:tbl><w:tblPr>'+(g.rtl?'<w:bidiVisual/>':'')+'<w:tblW w:w="'+tw.reduce((a,b)=>a+b,0)+'" w:type="dxa"/><w:tblBorders>'+B+'</w:tblBorders><w:tblLayout w:type="fixed"/><w:tblCellMar><w:left w:w="80" w:type="dxa"/><w:right w:w="80" w:type="dxa"/></w:tblCellMar></w:tblPr><w:tblGrid>'+tw.map(x=>'<w:gridCol w:w="'+x+'"/>').join('')+'</w:tblGrid>';
 for(let r=0;r<nR;r++){o+='<w:tr><w:trPr><w:cantSplit/><w:trHeight w:val="'+clamp(Math.round(rh[r]/md*400),340,3200)+'" w:hRule="atLeast"/></w:trPr>';
  for(let c=0;c<nC;){const e=L[r][c];let span=1,pr,body;
   if(e.k==='void'){pr='<w:tcW w:w="'+tw[c]+'" w:type="dxa"/><w:tcBorders><w:top w:val="nil"/><w:left w:val="nil"/><w:bottom w:val="nil"/><w:right w:val="nil"/></w:tcBorders>';body='<w:p/>';}
   else{const ow=e.k==='own'?e:e.o;span=ow.cs;let w=0;for(let k=c;k<c+span;k++)w+=tw[k];
    const s0=sty(g,ow.r,ow.c);
    pr='<w:tcW w:w="'+w+'" w:type="dxa"/>'+(span>1?'<w:gridSpan w:val="'+span+'"/>':'')+(ow.rs>1?(e.k==='own'?'<w:vMerge w:val="restart"/>':'<w:vMerge/>'):'')+(s0.bg?'<w:shd w:val="clear" w:color="auto" w:fill="'+s0.bg+'"/>':'')+'<w:vAlign w:val="center"/>';
    const t=e.k==='own'?String(g.rows[r][c]||''):'';
    body=t?t.split('\n').map(x=>par(x,{al:s0.al||(g.rtl?'c':null),color:autoFg(s0.bg,s0.fg)})).join(''):'<w:p/>';}
   o+='<w:tc><w:tcPr>'+pr+'</w:tcPr>'+body+'</w:tc>';c+=span;}
  o+='</w:tr>';}
 return o+'</w:tbl>';}
function docx(items){
 const gs=items.map(i=>i.g||i),wide=gs.some(g=>g.nC>6),TW=wide?15300:10400,pp=p=>par(p.t,{al:p.al,bold:p.big,sz:p.big?28:22,sp:p.big?80:40});
 let body='';
 gs.forEach(g=>{(g.before||[]).forEach(p=>{body+=pp(p);});body+=wtbl(g,TW)+'<w:p/>';});
 ((gs[gs.length-1]||{}).tail||[]).forEach(p=>{body+=pp(p);});
 const rtl=gs.some(g=>g.rtl),W='xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"';
 return zip([
  {n:'[Content_Types].xml',d:TBH+'<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>'},
  {n:'_rels/.rels',d:TBH+'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>'},
  {n:'word/document.xml',d:TBH+'<w:document '+W+'><w:body>'+body+'<w:sectPr>'+(wide?'<w:pgSz w:w="16838" w:h="11906" w:orient="landscape"/>':'<w:pgSz w:w="11906" w:h="16838"/>')+'<w:pgMar w:top="720" w:right="720" w:bottom="720" w:left="720" w:header="360" w:footer="360" w:gutter="0"/>'+(rtl?'<w:bidi/>':'')+'</w:sectPr></w:body></w:document>'}
 ],'application/vnd.openxmlformats-officedocument.wordprocessingml.document');}

/* ---------- HTML للنسخ (بيتلصق في Word/Excel بالدمج والألوان) ---------- */
function html(g){const L=layout(g);let o='<meta charset="utf-8"><table dir="'+(g.rtl?'rtl':'ltr')+'" border="1" cellspacing="0" cellpadding="6" style="border-collapse:collapse;border:1px solid #000">';
 for(let r=0;r<g.nR;r++){o+='<tr>';for(let c=0;c<g.nC;c++){const e=L[r][c];if(e.k==='cov')continue;
  if(e.k==='void'){o+='<td style="border:0"></td>';continue;}
  const s0=sty(g,r,c),fg=autoFg(s0.bg,s0.fg),al={l:'left',c:'center',r:'right'}[s0.al]||'';
  o+='<td'+(e.cs>1?' colspan="'+e.cs+'"':'')+(e.rs>1?' rowspan="'+e.rs+'"':'')+' style="border:1px solid #000;vertical-align:middle'+(s0.bg?';background:#'+s0.bg:'')+(fg?';color:#'+fg:'')+(al?';text-align:'+al:'')+'">'+X(g.rows[r][c]||'').replace(/\n/g,'<br>')+'</td>';}
  o+='</tr>';}
 return o+'</table>';}

root.TXExport={layout,xlsx,docx,html};
if(typeof module!=='undefined')module.exports=root.TXExport;
})(typeof window!=='undefined'?window:globalThis);
