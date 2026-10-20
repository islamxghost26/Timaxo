/* translate.js (v141) — ترجمة النص المستخرج: محرك + شاشة اختيار احترافية.
   الأولوية: على الجهاز (Translator API في Chrome — النص مش بيخرج من الجهاز) ← خدمة ترجمة على الإنترنت (بعد موافقة صريحة مرة واحدة).
   الأسطر المقطوعة بصريًا في الـOCR بتتجمّع في فقرات قبل الترجمة (ترجمة أدق)، وفيه مفتاح للحفاظ على الأسطر زي ما هي. */
(function (g) {
  'use strict';
  const LANGS = [
    { c: 'ar', a: 'العربية', e: 'Arabic' }, { c: 'en', a: 'الإنجليزية', e: 'English' }, { c: 'fr', a: 'الفرنسية', e: 'French' },
    { c: 'es', a: 'الإسبانية', e: 'Spanish' }, { c: 'de', a: 'الألمانية', e: 'German' }, { c: 'it', a: 'الإيطالية', e: 'Italian' },
    { c: 'tr', a: 'التركية', e: 'Turkish' }, { c: 'pt', a: 'البرتغالية', e: 'Portuguese' }, { c: 'ru', a: 'الروسية', e: 'Russian' },
    { c: 'fa', a: 'الفارسية', e: 'Persian' }, { c: 'ur', a: 'الأردية', e: 'Urdu' }, { c: 'hi', a: 'الهندية', e: 'Hindi' },
    { c: 'zh', a: 'الصينية', e: 'Chinese' }, { c: 'ja', a: 'اليابانية', e: 'Japanese' }, { c: 'ko', a: 'الكورية', e: 'Korean' },
    { c: 'nl', a: 'الهولندية', e: 'Dutch' }, { c: 'pl', a: 'البولندية', e: 'Polish' }, { c: 'uk', a: 'الأوكرانية', e: 'Ukrainian' },
    { c: 'id', a: 'الإندونيسية', e: 'Indonesian' }, { c: 'he', a: 'العبرية', e: 'Hebrew' }, { c: 'el', a: 'اليونانية', e: 'Greek' }, { c: 'sv', a: 'السويدية', e: 'Swedish' }
  ];
  const lname = (c, ar) => { const l = LANGS.find(x => x.c === c); return l ? (ar ? l.a : l.e) : c; };
  const WEB = { zh: 'zh-CN' }; // أكواد خدمة الويب المختلفة عن الأكواد الأساسية

  /** تخمين لغة النص من الكتابة (الاعتماد على نسبة الحروف) */
  function detect(text) {
    const s = String(text || '');
    const n = re => (s.match(re) || []).length;
    const ar = n(/[\u0600-\u06FF]/g), cy = n(/[\u0400-\u04FF]/g), han = n(/[\u4E00-\u9FFF]/g), kana = n(/[\u3040-\u30FF]/g), hang = n(/[\uAC00-\uD7AF]/g),
      dev = n(/[\u0900-\u097F]/g), he = n(/[\u0590-\u05FF]/g), gr = n(/[\u0370-\u03FF]/g), la = n(/[A-Za-z\u00C0-\u024F]/g);
    const m = Math.max(ar, cy, han, kana, hang, dev, he, gr, la);
    if (!m) return 'en';
    if (m === ar) return n(/[ٹڈڑںے]/g) > 0 ? 'ur' : n(/[پچژگ]/g) > 0 ? 'fa' : 'ar';
    if (m === cy) return /[іїєґ]/i.test(s) ? 'uk' : 'ru';
    if (m === kana || (kana && kana > han * 0.3)) return 'ja';
    if (m === han) return 'zh';
    if (m === hang) return 'ko';
    if (m === dev) return 'hi';
    if (m === he) return 'he';
    if (m === gr) return 'el';
    return 'en';
  }

  /** أسطر الـOCR → فقرات: السطر اللي مش منتهي بعلامة نهاية جملة بيتكمّل مع اللي بعده (إلا القوايم والعناوين القصيرة) */
  function paragraphs(text) {
    const lines = String(text || '').split(/\r?\n/), out = [];
    let cur = '';
    const isItem = l => /^\s*([-•*·▪●○]|\d+[.)\-]|[a-zA-Z][.)]|[٠-٩]+[.)\-])\s/.test(l);
    const ends = l => /[.!?؟…:;。！？]\s*$/.test(l);
    for (const raw of lines) {
      const l = raw.trim();
      if (!l) { if (cur) out.push(cur); cur = ''; out.push(''); continue; }
      if (!cur) { cur = l; continue; }
      if (isItem(l) || ends(cur) || (cur.length < 28 && !/[,،]\s*$/.test(cur))) { out.push(cur); cur = l; } else cur += ' ' + l;
    }
    if (cur) out.push(cur);
    return out;
  }
  /** تقسيم الفقرات لدفعات بحد أقصى max حرف (بنقسم الفقرة الطويلة عند علامات النهاية) */
  function batches(paras, max) {
    const units = [];
    paras.forEach((p, i) => {
      if (p.length <= max) { units.push({ i, t: p }); return; }
      let rest = p;
      while (rest.length > max) {
        let k = Math.max(rest.lastIndexOf('. ', max), rest.lastIndexOf('؟ ', max), rest.lastIndexOf('! ', max), rest.lastIndexOf('، ', max), rest.lastIndexOf(' ', max));
        if (k < max * 0.4) k = max; else k += 1;
        units.push({ i, t: rest.slice(0, k).trim(), cont: true }); rest = rest.slice(k);
      }
      if (rest.trim()) units.push({ i, t: rest.trim(), cont: true });
    });
    return units;
  }

  /* ---------------- المحركات ---------------- */
  const DEV = { cache: {} };
  async function deviceAvail(from, to) {
    try {
      if (!('Translator' in g)) return 'unavailable';
      return await g.Translator.availability({ sourceLanguage: from, targetLanguage: to });
    } catch (e) { return 'unavailable'; }
  }
  async function deviceTranslator(from, to, onDl) {
    const k = from + '>' + to;
    if (!DEV.cache[k]) DEV.cache[k] = g.Translator.create({ sourceLanguage: from, targetLanguage: to, monitor(m) { m.addEventListener('downloadprogress', e => onDl && onDl(e.loaded)); } });
    try { return await DEV.cache[k]; } catch (e) { delete DEV.cache[k]; throw e; }
  }
  const tmo = (p, ms) => Promise.race([p, new Promise((_, no) => setTimeout(() => no(new Error('انتهت المهلة')), ms))]);
  async function viaGoogle(txt, from, to, sig) {
    const u = 'https://translate.googleapis.com/translate_a/single?client=gtx&dt=t&sl=' + (from === 'auto' ? 'auto' : (WEB[from] || from)) + '&tl=' + (WEB[to] || to);
    const r = await tmo(fetch(u, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }, body: 'q=' + encodeURIComponent(txt), signal: sig }), 15000);
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const j = await r.json();
    if (!j || !Array.isArray(j[0])) throw new Error('رد غير متوقع');
    return j[0].map(x => x && x[0] || '').join('');
  }
  async function viaMyMemory(txt, from, to, sig) {
    const r = await tmo(fetch('https://api.mymemory.translated.net/get?q=' + encodeURIComponent(txt) + '&langpair=' + from + '|' + to, { signal: sig }), 15000);
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const j = await r.json();
    const t = j && j.responseData && j.responseData.translatedText;
    if (!t || /MYMEMORY WARNING|INVALID/i.test(t)) throw new Error((j && j.responseDetails) || 'رد غير متوقع');
    return t;
  }

  /** engines المتاحة دلوقتي لزوج لغات: ['device','google','mymemory'] بالترتيب */
  async function plan(from, to, pref) {
    const web = ['google', 'mymemory'];
    if (pref === 'online') return web;
    const av = from === 'auto' ? 'unavailable' : await deviceAvail(from, to);
    if (pref === 'device') return av === 'unavailable' ? [] : ['device'];
    return (av === 'unavailable' ? [] : ['device']).concat(web);
  }

  /** الترجمة: text → {text, engine, from, lines}. opts: {from:'auto'|code, to, engine:'auto'|'device'|'online', keepLines, onProgress(0..1,msg), signal, consent:()=>Promise<bool>} */
  async function translate(text, opts) {
    opts = opts || {};
    const to = opts.to || 'en';
    const auto = !opts.from || opts.from === 'auto';
    let from = auto ? detect(text) : opts.from;
    if (from === to && (!auto || from !== 'en')) return { text: String(text), engine: 'none', from, same: true }; // 'en' بالتخمين ممكن يكون لاتيني تاني، فنسيب الخدمة تحدد
    const sig = opts.signal, prog = opts.onProgress || (() => { });
    const paras = opts.keepLines ? String(text).split(/\r?\n/) : paragraphs(text);
    const units = batches(paras, 1200);
    const todo = units.filter(u => u.t.trim());
    if (!todo.length) return { text: '', engine: 'none', from };
    const engines = await plan(from, to, opts.engine || 'auto');
    if (!engines.length) { const e = new Error('الترجمة على الجهاز مش متاحة للغتين دول في المتصفح ده'); e.code = 'nodevice'; throw e; }
    let used = null, lastErr = null, outs = null;
    for (const eng of engines) {
      if (eng !== 'device' && opts.consent) { let ok = false; try { ok = await opts.consent(); } catch (e) { } if (!ok) { const e = new Error('محتاج موافقتك على الترجمة عبر الإنترنت'); e.code = 'consent'; throw e; } }
      try {
        outs = new Array(todo.length); let done = 0;
        if (eng === 'device') {
          const tr = await deviceTranslator(from, to, f => prog(0.02 + f * 0.2, 'dl'));
          for (let i = 0; i < todo.length; i++) { if (sig && sig.aborted) throw new Error('aborted'); outs[i] = await tr.translate(todo[i].t); prog(++done / todo.length, eng); }
        } else {
          const fn = eng === 'google' ? viaGoogle : viaMyMemory, size = eng === 'google' ? 1200 : 450;
          // ميمورى بيحتاج دفعات أصغر
          let work = todo; if (eng === 'mymemory') { work = []; const map = []; todo.forEach((u, ui) => batches([u.t], size).forEach(x => { work.push(x.t); map.push(ui); })); const parts = new Array(todo.length).fill(''); for (let i = 0; i < work.length; i++) { if (sig && sig.aborted) throw new Error('aborted'); parts[map[i]] += (parts[map[i]] ? ' ' : '') + await fn(work[i], from, to, sig); prog((i + 1) / work.length, eng); } outs = parts; }
          else {
            let next = 0, fail = null;
            const worker = async () => { while (next < todo.length && !fail) { const i = next++; try { outs[i] = await fn(todo[i].t, auto ? 'auto' : from, to, sig); prog(++done / todo.length, eng); } catch (e) { fail = e; } } };
            await Promise.all([worker(), worker(), worker()]); if (fail) throw fail;
          }
        }
        used = eng; break;
      } catch (e) { if (sig && sig.aborted) throw e; lastErr = e; outs = null; }
    }
    if (!outs) throw lastErr || new Error('تعذّرت الترجمة');
    // رجّع الفقرات بترتيبها
    const res = paras.map(() => '');
    todo.forEach((u, k) => { res[u.i] += (res[u.i] ? ' ' : '') + String(outs[k] || '').trim(); });
    return { text: res.join('\n').replace(/\n{3,}/g, '\n\n').trim(), engine: used, from };
  }

  /* ---------------- الواجهة ---------------- */
  const CSS = `
.tr .tr-h{display:flex;align-items:center;gap:11px}
.tr .tr-hint{font:600 11.5px/1.4 system-ui;color:var(--ink2);margin-top:2px}
.tr-lang{display:grid;grid-template-columns:1fr 40px 1fr;gap:8px;align-items:center}
.tr-sel{position:relative;display:block}
.tr-sel small{position:absolute;top:6px;inset-inline-start:14px;font:700 10.5px system-ui;color:var(--ink2);pointer-events:none;letter-spacing:.2px}
.tr-sel select{appearance:none;-webkit-appearance:none;width:100%;height:56px;padding:18px 36px 0 14px;border-radius:16px;border:1px solid var(--line);background:var(--surface2);color:var(--ink);font:700 15px system-ui;cursor:pointer}
html[dir=rtl] .tr-sel select{padding:18px 14px 0 36px}
.tr-sel::after{content:'';position:absolute;top:26px;inset-inline-end:15px;width:7px;height:7px;border-inline-end:2px solid var(--ink2);border-bottom:2px solid var(--ink2);transform:rotate(45deg);pointer-events:none}
.tr-swap{width:40px;height:40px;border-radius:50%;border:1px solid var(--line);background:var(--surface);color:var(--ink);display:grid;place-items:center;transition:transform .35s var(--spring,cubic-bezier(.34,1.56,.64,1))}
.tr-swap:active{transform:rotate(180deg) scale(.92)}
.tr-swap svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.tr-chips{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;margin:0 -2px;padding:1px 2px}
.tr-chips::-webkit-scrollbar{display:none}
.tr-chip{flex:none;height:32px;padding:0 13px;border-radius:999px;border:1px solid var(--line);background:transparent;color:var(--ink);font:700 12.5px system-ui}
.tr-chip.on{background:var(--accent,#1b63f0);border-color:var(--accent,#1b63f0);color:#fff}
.tr-card{border:1px solid var(--line);border-radius:18px;background:var(--surface2);padding:10px 14px 12px;display:flex;flex-direction:column;gap:6px;min-height:0}
.tr-card.res{background:color-mix(in srgb,var(--accent,#1b63f0) 7%,var(--surface2));border-color:color-mix(in srgb,var(--accent,#1b63f0) 28%,var(--line))}
.tr-cap{display:flex;align-items:center;justify-content:space-between;gap:8px;font:700 11.5px system-ui;color:var(--ink2)}
.tr-card textarea{width:100%;box-sizing:border-box;border:0;outline:0;background:transparent;color:var(--ink);-webkit-text-fill-color:var(--ink);font:500 16px/1.8 system-ui;resize:none;padding:0;min-height:64px;max-height:26vh}
.tr-card.res textarea{min-height:96px}
.tr-card.busy textarea{opacity:.35}
.tr-card.busy::after{content:'';height:3px;border-radius:3px;background:linear-gradient(90deg,transparent,var(--accent,#1b63f0),transparent);background-size:200% 100%;animation:trsh 1.1s linear infinite}
@keyframes trsh{from{background-position:200% 0}to{background-position:-200% 0}}
.tr-opts{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.tr-tg{height:34px;padding:0 13px;border-radius:999px;border:1px solid var(--line);background:transparent;color:var(--ink2);font:700 12px system-ui;display:flex;align-items:center;gap:6px}
.tr-tg.on{color:var(--accent,#1b63f0);border-color:var(--accent,#1b63f0);background:color-mix(in srgb,var(--accent,#1b63f0) 10%,transparent)}
.tr-st{flex:1;min-width:0;font:600 11.5px/1.4 system-ui;color:var(--ink2);text-align:start}
.tr-st.err{color:#dc2626}
.tr-ok{display:flex;gap:10px;align-items:center;padding:10px 12px;border-radius:14px;border:1px solid #d97706;background:color-mix(in srgb,#d97706 10%,transparent);font:600 12.5px/1.5 system-ui}
.tr-ok button{flex:none;height:34px;padding:0 14px;border-radius:12px;background:#d97706;color:#fff;font:800 12.5px system-ui}
.tr-ok[hidden]{display:none}
@media (prefers-reduced-motion:reduce){.tr-card.busy::after{animation:none}.tr-swap{transition:none}}`;
  const SWAP = '<svg viewBox="0 0 24 24"><path d="M7 4L3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7"/></svg>';
  const XSVG = '<svg viewBox="0 0 24 24" style="width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  const ICON = '<svg viewBox="0 0 24 24" style="width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round"><path d="M4 5h9M8.5 3v2M6 5c.5 4 3 7 6.5 9M12.5 5c-.5 4-3.5 7.5-8 9.5M13 20l4-9 4 9M14.5 17h5"/></svg>';
  const COPY = '<svg viewBox="0 0 24 24" style="width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h8"/></svg>';
  const ls = (k, v) => { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { } };

  /** يفتح شاشة الترجمة. o = {text, ar, onReplace(text), onClose} */
  function open(o) {
    o = o || {};
    const ar = o.ar !== undefined ? o.ar : (document.documentElement.lang || 'ar').slice(0, 2) === 'ar', L = (a, b) => ar ? a : b;
    if (!document.getElementById('trcss')) { const st = document.createElement('style'); st.id = 'trcss'; st.textContent = CSS; document.head.appendChild(st); }
    const old = document.getElementById('trSheet'); if (old) old.remove();
    const src0 = String(o.text || '').trim();
    let from = ls('tx_tr_from') || 'auto', to = ls('tx_tr_to') || (detect(src0) === 'ar' ? 'en' : 'ar'), pref = ls('tx_tr_eng') || 'auto', keep = ls('tx_tr_keep') === '1';
    if (from === 'auto' && detect(src0) === to) to = to === 'ar' ? 'en' : 'ar'; // نفس لغة النص: اقترح العكس
    const opt = (c, sel, auto) => (auto ? '<option value="auto"' + (sel === 'auto' ? ' selected' : '') + '>' + L('تلقائي', 'Auto-detect') + '</option>' : '') + LANGS.map(l => '<option value="' + l.c + '"' + (sel === l.c ? ' selected' : '') + '>' + (ar ? l.a : l.e) + '</option>').join('');
    const m = document.createElement('div'); m.id = 'trSheet'; m.className = 'mdl-bd';
    m.innerHTML = '<div class="mdl tr ox" role="dialog" aria-modal="true"><div class="grab"></div>'
      + '<div class="ox-h tr-h"><div class="ox-ic">' + ICON + '</div><div class="mdl-t">' + L('ترجمة', 'Translate') + '<small class="tr-hint" id="trHint"></small></div><button type="button" class="mdl-x" data-a="x" aria-label="' + L('إغلاق', 'Close') + '">' + XSVG + '</button></div>'
      + '<div class="tr-lang"><label class="tr-sel"><small>' + L('من', 'From') + '</small><select id="trFrom">' + opt('f', from, true) + '</select></label><button type="button" class="tr-swap" data-a="w" aria-label="' + L('تبديل اللغتين', 'Swap languages') + '">' + SWAP + '</button><label class="tr-sel"><small>' + L('إلى', 'To') + '</small><select id="trTo">' + opt('t', to, false) + '</select></label></div>'
      + '<div class="tr-chips" id="trChips"></div>'
      + '<div class="tr-card"><div class="tr-cap"><span>' + L('النص الأصلي', 'Original') + '</span><span id="trDet"></span></div><textarea id="trSrc" dir="auto" rows="3"></textarea></div>'
      + '<div class="tr-ok" id="trOk" hidden><span>' + L('الترجمة هتتم عبر خدمة على الإنترنت، والنص هيتبعت ليها. تكمّل؟', 'Translation uses an online service and the text will be sent to it. Continue?') + '</span><button type="button" data-a="ok">' + L('موافق', 'Allow') + '</button></div>'
      + '<div class="tr-card res" id="trResC"><div class="tr-cap"><span>' + L('الترجمة', 'Translation') + '</span><span id="trEng"></span></div><textarea id="trRes" dir="auto" rows="4" readonly></textarea></div>'
      + '<div class="tr-opts"><button type="button" class="tr-tg" data-a="k">' + L('الحفاظ على الأسطر', 'Keep line breaks') + '</button><button type="button" class="tr-tg" data-a="e"></button><span class="tr-st" id="trSt"></span></div>'
      + '<div class="ox-acts"><button type="button" class="ox-btn pri" data-a="c">' + COPY + '<span>' + L('نسخ الترجمة', 'Copy translation') + '</span></button>' + (o.onReplace ? '<button type="button" class="ox-btn" data-a="r">' + L('استبدال في الصورة', 'Replace in image') + '</button>' : '') + (navigator.share ? '<button type="button" class="ox-btn" data-a="s" aria-label="' + L('مشاركة', 'Share') + '"><svg viewBox="0 0 24 24"><path d="M12 15V3M8 7l4-4 4 4M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/></svg></button>' : '') + '</div></div>';
    document.body.appendChild(m);
    const $ = s => m.querySelector(s), src = $('#trSrc'), res = $('#trRes'), card = $('#trResC'), st = $('#trSt'), hint = $('#trHint'), okb = $('#trOk');
    src.value = src0; res.value = '';
    let tok = 0, ctl = null, tmr = 0, consented = ls('tx_tr_ok') === '1', gotRes = '';
    const ENG = { auto: L('تلقائي', 'Auto'), device: L('على الجهاز', 'On device'), online: L('إنترنت', 'Online') };
    const paintOpts = () => { $('[data-a=k]').classList.toggle('on', keep); const e = $('[data-a=e]'); e.textContent = ENG[pref]; e.classList.toggle('on', pref !== 'auto'); };
    const POP = ['ar', 'en', 'fr', 'es', 'de', 'tr', 'ru', 'it'];
    const paintChips = () => {
      let rec = []; try { rec = JSON.parse(ls('tx_tr_rec') || '[]'); } catch (e) { }
      const list = [...new Set(rec.concat(POP))].slice(0, 9);
      $('#trChips').innerHTML = list.map(c => '<button type="button" class="tr-chip' + (c === to ? ' on' : '') + '" data-c="' + c + '">' + lname(c, ar) + '</button>').join('');
    };
    const setHint = () => { const d = src.value.trim() ? detect(src.value) : ''; $('#trDet').textContent = from === 'auto' && d ? L('اتعرّفت: ', 'Detected: ') + lname(d, ar) : ''; };
    const run = async () => {
      const text = src.value.trim(); const my = ++tok; if (ctl) ctl.abort(); ctl = new AbortController();
      if (!text) { res.value = ''; st.textContent = ''; card.classList.remove('busy'); return; }
      card.classList.add('busy'); st.classList.remove('err'); st.textContent = L('بترجم…', 'Translating…'); okb.hidden = true;
      setHint();
      try {
        const r = await translate(text, { from, to, engine: pref, keepLines: keep, signal: ctl.signal,
          onProgress: (f, e) => { if (my === tok) st.textContent = e === 'dl' ? L('بتجهيز نموذج الترجمة على جهازك… ', 'Preparing the on-device model… ') + Math.round(f * 500) / 5 + '%' : L('بترجم… ', 'Translating… ') + Math.round(f * 100) + '%'; },
          consent: async () => { if (consented) return true; if (my !== tok) return false; okb.hidden = false; return false; } });
        if (my !== tok) return;
        card.classList.remove('busy'); res.value = r.text; gotRes = r.text; autoH(res);
        $('#trEng').textContent = r.engine === 'device' ? L('🔒 على الجهاز', '🔒 On device') : r.engine === 'none' ? '' : L('🌐 عبر الإنترنت', '🌐 Online');
        st.textContent = r.same ? L('النص أصلًا بنفس اللغة المختارة.', 'The text is already in that language.') : '';
        hint.textContent = r.engine === 'device' ? L('بيشتغل على جهازك — النص مش بيخرج منه', 'Runs on your device — the text never leaves it') : r.engine === 'none' ? '' : L('عبر خدمة على الإنترنت', 'Via an online service');
      } catch (e) {
        if (my !== tok || (e && e.message === 'aborted')) return;
        card.classList.remove('busy');
        if (e.code === 'consent') { st.textContent = ''; return; }
        st.classList.add('err'); st.textContent = (e.code === 'nodevice' ? e.message + ' — جرّب «إنترنت».' : L('تعذّرت الترجمة: ', 'Translation failed: ') + String(e && e.message || e).slice(0, 80) + (navigator.onLine ? '' : L(' · مفيش إنترنت', ' · offline')));
        if (e.code === 'nodevice' && !ar) st.textContent = e.message + ' — try “Online”.';
      }
    };
    const autoH = t => { t.style.height = 'auto'; t.style.height = Math.min(t.scrollHeight + 2, innerHeight * .28) + 'px'; };
    const later = () => { clearTimeout(tmr); tmr = setTimeout(run, 350); };
    const close = () => { tok++; if (ctl) ctl.abort(); m.remove(); o.onClose && o.onClose(); };
    const save = () => { ls('tx_tr_from', from); ls('tx_tr_to', to); ls('tx_tr_eng', pref); ls('tx_tr_keep', keep ? '1' : '0'); let rec = []; try { rec = JSON.parse(ls('tx_tr_rec') || '[]'); } catch (e) { } ls('tx_tr_rec', JSON.stringify([to].concat(rec.filter(x => x !== to)).slice(0, 4))); };
    $('#trFrom').onchange = e => { from = e.target.value; save(); setHint(); later(); };
    $('#trTo').onchange = e => { to = e.target.value; save(); paintChips(); later(); };
    src.oninput = () => { autoH(src); later(); };
    m.onclick = async e => {
      if (e.target === m) return close();
      const ch = e.target.closest('[data-c]'); if (ch) { to = ch.dataset.c; $('#trTo').value = to; save(); paintChips(); run(); return; }
      const b = e.target.closest('[data-a]'); if (!b) return; const a = b.dataset.a;
      if (a === 'x') close();
      else if (a === 'w') { const d = from === 'auto' ? detect(src.value) : from, nf = to, nt = d; from = nf; to = nt; if (gotRes && gotRes.trim()) { src.value = gotRes; } $('#trFrom').value = from; $('#trTo').value = to; save(); paintChips(); autoH(src); run(); }
      else if (a === 'k') { keep = !keep; save(); paintOpts(); run(); }
      else if (a === 'e') { pref = pref === 'auto' ? 'device' : pref === 'device' ? 'online' : 'auto'; save(); paintOpts(); run(); }
      else if (a === 'ok') { consented = true; ls('tx_tr_ok', '1'); okb.hidden = true; run(); }
      else if (a === 'c') { const t = res.value; if (!t) return; let ok = false; try { await navigator.clipboard.writeText(t); ok = true; } catch (_) { res.select(); try { ok = document.execCommand('copy'); } catch (__) { } } o.toast && o.toast(ok ? L('اتنسخت الترجمة', 'Translation copied') : L('تعذّر النسخ', 'Copy failed')); b.classList.add('ok'); }
      else if (a === 's') { try { await navigator.share({ text: res.value }); } catch (_) { } }
      else if (a === 'r') { const t = res.value.trim(); if (t) { close(); o.onReplace(t); } }
    };
    paintOpts(); paintChips(); setHint(); autoH(src);
    deviceAvail(detect(src0), to).then(a => { if (a !== 'unavailable') hint.textContent = L('متاحة على الجهاز (خاصة)', 'Available on device (private)'); });
    run();
    return { close, setText(t) { src.value = t; autoH(src); run(); } };
  }

  g.TXTr = { LANGS, detect, paragraphs, batches, translate, open, lname, deviceAvail };
  if (typeof module !== 'undefined') module.exports = g.TXTr;
})(typeof window !== 'undefined' ? window : globalThis);
