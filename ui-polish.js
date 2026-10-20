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
`;
  const st = document.createElement('style');
  st.id = 'uipolish';
  st.textContent = css;
  document.head.appendChild(st);
})();
