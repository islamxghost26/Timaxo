/* tool-order.js (v144) — ترتيب أيقونات اللوحات حسب استخدام كل مستخدم + ترتيب يدوي خاص.
   • بيعدّ كل ضغطة على أداة/زر صفحة (localStorage: tx_tuse) ويرتّب الأكتر استخدامًا أولًا (عند فتح اللوحة، مش لحظيًا عشان الأماكن ما تتلخبطش).
   • علامة صغيرة في ركن الدوك (⇅) بتفتح وضع الترتيب اليدوي: اختار أيقونة ← قدّم/أخّر ← تم. «تلقائي» بيرجّع الترتيب حسب الاستخدام. (tx_tord) */
(function (g) {
  'use strict';
  const KU = 'tx_tuse', KO = 'tx_tord';
  const jg = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v && typeof v === 'object' ? v : d; } catch (e) { return d; } };
  const js = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } };
  const AR = () => document.documentElement.lang === 'ar', RTL = () => document.documentElement.dir === 'rtl';
  const T = (a, b) => (AR() ? a : b);
  const PAGE_DEF = ['ocrB', 'ltBtn', 'rotR', 'rotL', 'recrop', 'bookB', 'mvE', 'mvL', 'delPg'];
  let on = false, sel = null, grp = null, btn, bar;

  /** يرتّب defs: الترتيب اليدوي لو موجود، وإلا الأكتر استخدامًا (والتعادل بالترتيب الافتراضي). أي عنصر جديد بيتحط في الآخر. */
  function sort(group, defs) {
    const ord = jg(KO, {})[group];
    if (Array.isArray(ord) && ord.length) return ord.filter(k => defs.includes(k)).concat(defs.filter(k => !ord.includes(k)));
    const use = jg(KU, {});
    return defs.map((k, i) => [k, i]).sort((a, b) => (use[b[0]] || 0) - (use[a[0]] || 0) || a[1] - b[1]).map(x => x[0]);
  }
  const E = () => g.__E;
  function group() { const e = E(); if (!e) return null; if (e.tab === 'pPage') return 'page'; if (e.tab === 'pMarkup') return e.sub === 'erase' ? 'erase' : 'edit'; return null; }
  const pageEls = () => [...document.querySelectorAll('#pPage .pgact .pa')];
  function applyPage() {
    const els = pageEls(); if (!els.length) return;
    const ids = els.map(e => e.id).filter(Boolean);
    const defs = PAGE_DEF.filter(i => ids.includes(i)).concat(ids.filter(i => !PAGE_DEF.includes(i)));
    sort('page', defs).forEach((id, i) => { const e = document.getElementById(id); if (e) e.style.order = i + 1; });
  }
  const current = () => grp === 'page' ? pageEls().sort((a, b) => (parseInt(a.style.order) || 0) - (parseInt(b.style.order) || 0)).map(e => e.id) : [...document.querySelectorAll('#toolRow .tgr .tool')].map(b => b.dataset.k);
  const elOf = k => grp === 'page' ? document.getElementById(k) : document.querySelector('#toolRow .tool[data-k="' + k + '"]');
  function mark() {
    document.querySelectorAll('.ord-sel').forEach(e => e.classList.remove('ord-sel'));
    if (on && sel) { const e = elOf(sel); if (e) e.classList.add('ord-sel'); }
    updBar();
  }
  function updBar() {
    if (!bar) return;
    const e = sel && elOf(sel), nm = e ? (e.textContent || e.getAttribute('aria-label') || '').trim() : '';
    bar.querySelector('.h').textContent = nm ? T('حرّك «' + nm + '»', 'Move “' + nm + '”') : T('اختار أيقونة وبعدها حرّكها', 'Pick an icon, then move it');
    bar.querySelectorAll('[data-m]').forEach(b => { b.disabled = !sel; });
  }
  function refresh() { if (grp === 'page') applyPage(); else if (g.__buildTools) g.__buildTools(); mark(); const e = sel && elOf(sel); if (e && e.scrollIntoView) e.scrollIntoView({ inline: 'nearest', block: 'nearest', behavior: 'smooth' }); }
  function move(d) {
    const cur = current(), i = cur.indexOf(sel), j = i + d;
    if (i < 0 || j < 0 || j >= cur.length) return;
    [cur[i], cur[j]] = [cur[j], cur[i]];
    const o = jg(KO, {}); o[grp] = cur; js(KO, o); refresh();
  }
  function auto() { const o = jg(KO, {}); delete o[grp]; js(KO, o); refresh(); }
  function enter() { grp = group(); if (!grp) return; on = true; sel = null; document.querySelector('.edk').classList.add('ordmode'); bar.hidden = false; btn.classList.add('on'); mark(); }
  function exit() { on = false; sel = null; const d = document.querySelector('.edk'); if (d) d.classList.remove('ordmode'); if (bar) bar.hidden = true; if (btn) btn.classList.remove('on'); mark(); }
  /** بيتنادى من setTab وبعد كل تغيير تبويب */
  function sync() { if (on) exit(); if (btn) btn.hidden = !group(); applyPage(); }

  function init() {
    const dk = document.querySelector('.edk'); if (!dk || btn) return;
    const CSS = `.edk{position:relative}
.ordk{position:absolute;top:-2px;inset-inline-start:12px;z-index:4;width:26px;height:26px;border-radius:50%;display:grid;place-items:center;border:1px solid var(--line);background:var(--surface);color:var(--ink2);padding:0;opacity:.85}
.ordk svg{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.ordk.on{background:var(--accent,#1b63f0);color:#fff;border-color:transparent;opacity:1}
.ordk[hidden],.edk.mini .ordk{display:none}
.ordbar{display:flex;align-items:center;gap:6px;padding:4px 12px 6px}
.ordbar[hidden]{display:none}
.ordbar .h{flex:1;min-width:0;font:700 11.5px/1.3 system-ui;color:var(--ink2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ordbar button{flex:none;height:32px;padding:0 11px;border-radius:12px;border:1px solid var(--line);background:var(--surface);color:var(--ink);font:800 12px system-ui}
.ordbar button[disabled]{opacity:.4}
.ordbar button.pri{background:var(--accent,#1b63f0);color:#fff;border-color:transparent}
.edk.ordmode .tool,.edk.ordmode .pa{animation:ordw .45s ease-in-out infinite alternate!important}
@keyframes ordw{from{transform:rotate(-1.2deg)}to{transform:rotate(1.2deg)}}
.edk.ordmode .ord-sel{outline:2.5px solid var(--accent,#1b63f0);outline-offset:1px;animation:none!important;transform:scale(1.05)}
@media (prefers-reduced-motion:reduce){.edk.ordmode .tool,.edk.ordmode .pa{animation:none!important}}`;
    const st = document.createElement('style'); st.id = 'tordcss'; st.textContent = CSS; document.head.appendChild(st);
    btn = document.createElement('button'); btn.type = 'button'; btn.className = 'ordk'; btn.hidden = true;
    btn.setAttribute('aria-label', T('ترتيب الأيقونات', 'Arrange icons')); btn.title = btn.getAttribute('aria-label');
    btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M7 19V5M4 8l3-3 3 3M17 5v14M14 16l3 3 3-3"/></svg>';
    btn.onclick = e => { e.stopPropagation(); on ? exit() : enter(); };
    const grab = dk.querySelector('.grab');
    dk.insertBefore(btn, grab ? grab.nextSibling : dk.firstChild);
    bar = document.createElement('div'); bar.className = 'ordbar'; bar.hidden = true;
    const fw = RTL() ? '→' : '←', bk = RTL() ? '←' : '→'; // «قدّم» = ناحية بداية الصف
    bar.innerHTML = '<span class="h"></span><button type="button" data-m="-1">' + fw + ' ' + T('قدّم', 'Earlier') + '</button><button type="button" data-m="1">' + T('أخّر', 'Later') + ' ' + bk + '</button><button type="button" data-a="auto">' + T('تلقائي', 'Auto') + '</button><button type="button" class="pri" data-a="done">' + T('تم', 'Done') + '</button>';
    bar.onclick = e => { const b = e.target.closest('button'); if (!b) return; if (b.dataset.m) move(+b.dataset.m); else if (b.dataset.a === 'auto') auto(); else exit(); };
    dk.insertBefore(bar, btn.nextSibling);
    // اختيار الأيقونة في وضع الترتيب (بدل تشغيلها)
    dk.addEventListener('click', e => {
      if (!on || e.target.closest('.ordk,.ordbar,.tabs,.grab')) return;
      const t = e.target.closest('.tool[data-k],.pa[id]');
      if (t) { e.preventDefault(); e.stopPropagation(); sel = t.dataset.k || t.id; mark(); }
    }, true);
    // عدّاد الاستخدام
    document.addEventListener('click', e => {
      if (on) return;
      const t = e.target.closest && e.target.closest('#toolRow .tool[data-k],#pPage .pa[id]');
      if (!t) return;
      const k = t.dataset.k || t.id, u = jg(KU, {}); u[k] = (u[k] || 0) + 1; js(KU, u);
    }, true);
    const pg = document.querySelector('#pPage .pgact');
    if (pg) new MutationObserver(() => applyPage()).observe(pg, { childList: true });
    const r = document.getElementById('adjReset'); if (r) { r.setAttribute('aria-label', T('إعادة ضبط', 'Reset')); r.title = r.getAttribute('aria-label'); }
    sync();
    if (g.__buildTools) g.__buildTools();
  }

  g.TXOrd = { sort, sync, mark, init, applyPage, _jg: jg };
  if (typeof document !== 'undefined') { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init(); }
})(typeof window !== 'undefined' ? window : globalThis);
