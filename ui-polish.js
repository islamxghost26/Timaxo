/* ui-polish.js — تحسين الشكل: نافذة استخراج النص + التحديد في النص الحي.
   CSS فقط (بدون ما نلمس المنطق)، بـ"html body" عشان يكسب على الأنماط القديمة. */
(function () {
  'use strict';
  if (document.getElementById('uipolish')) return;
  const css = `
/* ===== نافذة استخراج النص: أبسط وأهدى ===== */
html body .ox .mdl-t small{display:block;margin-top:2px;font:600 11.5px/1.4 system-ui;color:var(--ink2);opacity:.85}
html body .ox-live{border:0;background:color-mix(in srgb,var(--accent,#1b63f0) 11%,transparent);border-radius:14px;height:44px;font-weight:700}
html body .ox-live:active{transform:scale(.985)}
html body .ox-chip{min-height:34px;padding:0 13px;border-width:1px;font-weight:600}
html body .ox-res textarea{font:500 17px/1.85 system-ui;padding:14px 16px;border-radius:18px;border:1px solid var(--line);background:var(--surface2);letter-spacing:.1px;resize:none;min-height:150px}
html body .ox-res textarea:focus{outline:2px solid color-mix(in srgb,var(--accent,#1b63f0) 55%,transparent);outline-offset:1px}
html body .ox-note{font-size:11.5px;opacity:.75}
html body .ox-acts{gap:8px}
html body .ox-btn{height:50px;border-radius:16px;font-weight:700}
html body .ox-btn.pri{background:linear-gradient(135deg,#1B63F0,#22A8F5);color:#fff;box-shadow:0 10px 22px -10px var(--accent,#1b63f0)}
html body .ox-btn:active{transform:scale(.97)}
/* ===== شرائح الحقول ===== */
html body .fx{margin-top:14px;padding-top:12px;border-top:1px solid var(--line)}
html body .fx-t{font:700 12px system-ui;opacity:.65;letter-spacing:.2px;margin-bottom:8px}
html body .fx-c{border-radius:12px;padding:7px 12px;background:var(--surface2);border:1px solid transparent}
html body .fx-c small{font-weight:700;color:var(--accent,#1b63f0);opacity:1}
html body .fx-c.ok{border-color:#22a45d;background:color-mix(in srgb,#22a45d 14%,var(--surface2))}
html body .fx-a{border:0;border-radius:12px;padding:8px 12px;font-weight:700;background:color-mix(in srgb,var(--accent,#1b63f0) 14%,transparent);color:var(--accent,#1b63f0)}
/* ===== بطاقة النماذج: مطويّة افتراضيًا ===== */
html body .om{margin-top:12px;padding:0;border:0;border-top:1px solid var(--line);border-radius:0}
html body .om-t{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:12px 2px;cursor:pointer;font:700 12.5px system-ui;opacity:.8}
html body .om-cv{width:8px;height:8px;border-inline-end:2px solid currentColor;border-bottom:2px solid currentColor;transform:rotate(45deg);transition:transform .2s;margin-inline-end:4px}
html body .om.open .om-cv{transform:rotate(-135deg)}
html body .om:not(.open) .om-h,html body .om:not(.open) .om-r,html body .om:not(.open) .om-p,html body .om:not(.open) .om-m{display:none!important}
html body .om-b{border-radius:12px;padding:7px 12px;font-weight:600;background:var(--surface2);border-color:transparent}
html body .om-b.on{background:color-mix(in srgb,#22a45d 16%,var(--surface2));border-color:#22a45d}
/* ===== النص الحي: التحديد ===== */
html body #ltH b{background:color-mix(in srgb,var(--accent,#1b63f0) 24%,transparent);border-radius:6px;box-shadow:inset 0 -2px 0 color-mix(in srgb,var(--accent,#1b63f0) 85%,transparent);transition:background .12s}
html body .lth::before{width:2px;margin-left:-1px;height:15px;top:5px;background:var(--accent,#1b63f0);border-radius:2px}
html body .lth::after{top:18px;width:18px;height:18px;margin-left:-9px;background:var(--accent,#1b63f0);border:2.5px solid #fff;box-shadow:0 3px 10px rgba(0,0,0,.35);transition:transform .12s}
html body .lth:active::after{transform:scale(1.18)}
html body .ltm{border-radius:999px;padding:3px;background:rgba(20,24,38,.96);box-shadow:0 8px 26px rgba(0,0,0,.42),0 0 0 1px rgba(255,255,255,.08);animation:ltIn .14s ease-out}
html body .ltm button{height:38px;padding:0 17px;border-radius:999px;font-weight:700;font-size:13.5px}
html body .ltm button+button{border-inline-start:0;position:relative}
html body .ltm button+button::before{content:'';position:absolute;inset-inline-start:0;top:10px;bottom:10px;width:1px;background:rgba(255,255,255,.16)}
@keyframes ltIn{from{opacity:0;transform:translateY(4px) scale(.96)}to{opacity:1;transform:none}}
/* ===== النص الحي: الشريط العلوي ===== */
html body #ltB{top:12px;padding:5px 6px 5px 10px;border-radius:999px;background:rgba(18,22,36,.88);border:1px solid rgba(255,255,255,.14);box-shadow:0 8px 24px rgba(0,0,0,.35);flex-wrap:nowrap;gap:4px;font-weight:600}
html body #ltB .t{max-width:42vw;opacity:.95;font-size:12.5px}
html body #ltB button{height:34px;padding:0 13px;border-radius:999px;background:rgba(255,255,255,.12);font-weight:700}
html body #ltB button.p{background:linear-gradient(135deg,#1B63F0,#22A8F5)}
html body #ltB button[data-k=x]{width:34px;padding:0;flex:none}
@media (prefers-reduced-motion:reduce){html body .ltm{animation:none}}

/* ===== v141: قايمة استخراج النص — أنضف وأهدى ===== */
html body .ox{position:relative;gap:12px}
html body .ox .ox-live,html body .ox .ocx,html body .ox .om{display:none!important}
html body .ox-langs{display:flex;gap:2px;padding:4px;margin:0;border-radius:16px;background:var(--surface2);overflow:visible}
html body .ox-langs .ox-chip{flex:1 1 0;justify-content:center;min-height:38px;padding:0 6px;border:0;border-radius:12px;background:transparent;color:var(--ink2);font-weight:700;white-space:nowrap}
html body .ox-langs .ox-chip.on,html body .ox-langs .ox-chip.auto.on{background:var(--surface);color:var(--ink);box-shadow:0 1px 8px rgba(0,0,0,.16)}
html body .ox-langs .ox-chip.more{flex:0 0 auto;border:0;color:var(--ink2)}
html body .ox-more{padding:2px 0}
html body .ox-meta{gap:10px;padding:0 2px;min-height:22px}
html body .ox-b{height:auto;padding:0;background:transparent;font:700 12px system-ui;color:var(--ink2)}
html body .ox-b.q{display:inline-flex;align-items:center;gap:6px}
html body .ox-b.q i{width:8px;height:8px;border-radius:50%;background:currentColor}
html body .ox-b.q.g{background:transparent;color:#16a34a}html body .ox-b.q.m{background:transparent;color:#d97706}html body .ox-b.q.l{background:transparent;color:#dc2626}
html body .ox-b.mu{margin-inline-start:auto;font-weight:600}
html body .ox-note{padding:8px 12px;border-radius:12px;background:color-mix(in srgb,#d97706 12%,transparent);color:var(--ink);font:600 12px/1.5 system-ui}
html body .ox-note:empty{display:none}
html body .ox-acts{display:flex;flex-wrap:nowrap;gap:8px}
html body .ox-acts .ox-btn{flex:0 1 auto;height:50px;padding:0 16px}
html body .ox-acts .ox-btn.pri{flex:1 1 auto}
html body .ox-acts .ox-btn.ic{flex:0 0 50px;padding:0}
html body .ox-btn.ic svg circle{fill:currentColor;stroke:none}
html body .ox-menu{position:absolute;inset-inline:12px;bottom:84px;z-index:6;padding:6px;border-radius:20px;background:var(--surface);border:1px solid var(--line);box-shadow:0 22px 50px -14px rgba(0,0,0,.5);max-height:62%;overflow:auto;animation:oxmn .16s ease-out}
html body .ox-menu[hidden]{display:none}
@keyframes oxmn{from{opacity:0;transform:translateY(8px) scale(.98)}}
html body .ox-mi{display:flex;align-items:center;gap:12px;width:100%;height:48px;padding:0 12px;border:0;border-radius:14px;background:transparent;color:var(--ink);font:700 14px system-ui;text-align:start}
html body .ox-mi:active{background:var(--surface2)}
html body .ox-mi svg{width:20px;height:20px;flex:none;fill:none;stroke:var(--ink2);stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
html body .ox-mi small{margin-inline-start:auto;color:var(--ink2);font:600 12px system-ui}
html body .ox-ms{height:1px;margin:4px 10px;background:var(--line)}
html body .fx-l{flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;padding-bottom:2px}
html body .fx-l::-webkit-scrollbar{display:none}
html body .fx-c,html body .fx-a{flex:none}
html body .fx-i{flex:none!important;flex-basis:auto!important;align-self:center;font-size:11px;opacity:.7;white-space:nowrap}
@media (prefers-reduced-motion:reduce){html body .ox-menu{animation:none}}

/* ===== v141: شريط التبويبات (5 تبويبات) + أيقونات أنعم ===== */
html body .tabs{grid-template-columns:repeat(5,1fr)!important}
html body .tabs .tab{min-width:0;padding-inline:2px}
html body .tabs .tab span{font-size:11.5px;white-space:nowrap}
html body .tabs .tab svg.i{transition:transform .25s cubic-bezier(.34,1.56,.64,1)}
html body .tabs .tab.on svg.i{transform:translateY(-1px) scale(1.08)}
html body .tabs .tab.on svg.i [fill-opacity]{fill-opacity:.3}
html body svg.i{stroke-linecap:round;stroke-linejoin:round}
html body #bgPill{bottom:calc(env(safe-area-inset-bottom,0px) + 112px)!important;animation:bgp .22s ease-out}
@keyframes bgp{from{opacity:0;transform:translateY(8px)}}
@media (prefers-reduced-motion:reduce){html body .tabs .tab svg.i{transition:none}}

/* ===== v143: كل لوحات المحرر بارتفاع لوحة الفلاتر — شريط أفقي بسلايدر ومرتّب بأولوية الاستخدام ===== */
@media (orientation:portrait){
html body #vEdit .edk>.panel{max-height:none;overflow:visible;min-height:0;padding:2px 12px 6px;justify-content:flex-start}
/* الصفحة */
html body #vEdit #pPage .pgact{display:flex!important;grid-template-columns:none!important;flex-wrap:nowrap;gap:8px;overflow-x:auto;overflow-y:hidden;scrollbar-width:none;padding:4px 2px 6px}
html body #vEdit #pPage .pgact::-webkit-scrollbar{display:none}
html body #vEdit .pa{flex:none;width:78px;height:74px;flex-direction:column;gap:6px;padding:8px 4px;border-radius:18px;font-size:11.5px!important;line-height:1.2;text-align:center;white-space:normal}
html body #vEdit .pa svg.i{width:24px;height:24px}
html body #vEdit #ocrB{order:1}html body #vEdit #ltBtn{order:2}html body #vEdit #rotR{order:3}html body #vEdit #rotL{order:4}html body #vEdit #recrop{order:5}html body #vEdit #bookB{order:6}html body #vEdit #mvE{order:7}html body #vEdit #mvL{order:8}html body #vEdit #delPg{order:9}
html body #vEdit #ocrB,html body #vEdit #ltBtn{background:color-mix(in srgb,var(--accent,#1b63f0) 14%,var(--surface));border-color:color-mix(in srgb,var(--accent,#1b63f0) 38%,var(--line))}
/* الضبط */
html body #vEdit #pAdjust:not([hidden]){display:flex;flex-direction:row;flex-wrap:nowrap;align-items:stretch;gap:10px;overflow-x:auto;overflow-y:hidden;scrollbar-width:none;padding:6px 2px 8px}
html body #vEdit #pAdjust::-webkit-scrollbar{display:none}
html body #vEdit #pAdjust .sld{flex:none;width:196px;display:grid;grid-template-columns:1fr auto;grid-template-rows:auto auto;gap:8px;align-content:center;padding:11px 14px 9px;border-radius:18px;background:var(--surface);border:1px solid var(--line)}
html body #vEdit #pAdjust .sld span{grid-column:1;grid-row:1;font-size:13px!important}
html body #vEdit #pAdjust .sld output{grid-column:2;grid-row:1}
html body #vEdit #pAdjust .sld input{grid-column:1/-1;grid-row:2;width:100%;margin:0}
html body #vEdit #pAdjust>.fld{order:1;flex:none;display:flex;flex-direction:column;justify-content:center;gap:7px;padding:9px 12px;border-radius:18px;background:var(--surface);border:1px solid var(--line)}
html body #vEdit #pAdjust .chips{display:flex;flex-wrap:nowrap;gap:6px}
html body #vEdit #pAdjust .chip{flex:none;height:34px;min-height:34px;padding:0 13px}
html body #vEdit #pAdjust>.row{order:2;flex:none;align-items:center}
/* التعديل والمسح */
html body #vEdit .tcats{display:none!important}
html body #vEdit #toolRow{margin-bottom:2px!important}
html body #vEdit .tgr{display:flex!important;grid-template-columns:none!important;flex-wrap:nowrap!important;overflow-x:auto!important;overflow-y:hidden!important;gap:8px;padding:4px 2px 6px}
html body #vEdit .tool{flex:none;width:68px!important;min-width:0;height:64px!important;min-height:0!important;padding:6px 3px!important;gap:5px;border-radius:18px}
html body #vEdit .tool svg.i{width:24px;height:24px}
html body #vEdit .tool span{font-size:11px!important;white-space:nowrap;line-height:1.15}
html body #vEdit #pMarkup>.row:last-child{flex-wrap:nowrap!important;gap:6px!important;align-items:center}
html body #vEdit #swRow{flex:1 1 0;min-width:0;gap:9px!important;padding:3px 4px!important}
html body #vEdit #swRow .sw{width:26px;height:26px}
html body #vEdit #szSeg{flex:none}
html body #vEdit #szSeg button{min-width:30px;height:30px;padding:0 8px}
html body #vEdit #pMarkup .row .ib{width:34px;height:34px;flex:none}
}
`;
  const st = document.createElement('style');
  st.id = 'uipolish';
  st.textContent = css;
  document.head.appendChild(st);
})();
