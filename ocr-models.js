/* ocr-models.js — نماذج OCR (PP-OCR ONNX، Apache-2.0) متضمّنة مع التطبيق في models/ocr/ وبتتجهّز على الجهاز أول استخدام.
   v141: نماذج PP-OCRv6 للكشف (small/tiny) + PP-OCRv5 للعربي والإنجليزي + PP-OCRv6 tiny للصيني/الإنجليزي.
   مفيش تنزيل من برّه ولا بيانات بتتبعت لأي حد: الملفات من نفس موقع التطبيق وبتتخزّن في كاش خاص (timaxo-ocr-v2). */
(function (g) {
  'use strict';
  const OCACHE = 'timaxo-ocr-v2';
  const OLD = 'timaxo-vendor-v1'; // كاش النسخة القديمة (نماذج v4) — بننضّف منه مفاتيح vendor/ocr/ القديمة عشان المساحة
  const DIR = 'models/ocr/';
  const HF = 'https://huggingface.co/pitapo/rapidocr/resolve/main/';
  const MAX = 40 * 1048576;
  // role: det | rec | dict. remote: مصادر احتياطية (للسيريلي بس لأن مفيش نموذج متضمّن ليه).
  const ITEMS = {
    det: { role: 'det', script: 'any' },
    'det-fast': { role: 'det', script: 'any' },
    'rec-arabic': { role: 'rec', script: 'arabic' },
    'rec-latin': { role: 'rec', script: 'latin' },
    'rec-ch': { role: 'rec', script: 'ch' },
    'dict-arabic': { role: 'dict', script: 'arabic' },
    'dict-latin': { role: 'dict', script: 'latin' },
    'dict-ch': { role: 'dict', script: 'ch' },
    'rec-cyrillic': { role: 'rec', script: 'cyrillic', remote: [HF + 'onnx/PP-OCRv4/rec/cyrillic_PP-OCRv3_rec_infer.onnx'], nolocal: true },
    'dict-cyrillic': { role: 'dict', script: 'cyrillic', remote: ['https://raw.githubusercontent.com/PaddlePaddle/PaddleOCR/release/2.7/ppocr/utils/dict/cyrillic_dict.txt'], nolocal: true }
  };
  const BUNDLED = { arabic: true, latin: true, ch: true, cyrillic: false };
  // ملفات كل كتابة: الكشف (سريع/دقيق) + القراءة + القاموس. العربي بيستعين كمان بنموذج الإنجليزي للأرقام واللاتيني جوه نفس السطر.
  const idsFor = (s, fast) => [fast ? 'det-fast' : 'det', 'rec-' + s, 'dict-' + s];
  const helperIds = s => (s === 'arabic' ? ['rec-latin', 'dict-latin'] : []);

  const override = id => { try { return (JSON.parse(localStorage.getItem('tx_ocr_urls') || '{}'))[id] || null; } catch (e) { return null; } };
  const ext = id => (ITEMS[id].role === 'dict' ? '.txt' : '.onnx');
  const localUrl = id => new URL(DIR + id + ext(id), (g.document && g.document.baseURI) || g.location.href).href;
  const key = id => override(id) || (ITEMS[id].nolocal ? ITEMS[id].remote[0] : localUrl(id));
  const candidates = id => { const o = override(id); return o ? [o] : (ITEMS[id].nolocal ? [] : [localUrl(id)]).concat(ITEMS[id].remote || []); };

  const cached = async id => { try { return !!(await (await caches.open(OCACHE)).match(key(id))); } catch (e) { return false; } };
  /** الكتابة جاهزة؟ (متخزّنة أو متضمّنة مع التطبيق وتتجهّز تلقائي) */
  const has = async (s, fast) => {
    if (BUNDLED[s]) return true;
    return (await Promise.all(idsFor(s, fast).map(cached))).every(Boolean);
  };

  async function fetchItem(id, onBytes) {
    let r = null, err = null;
    for (const u of candidates(id)) {
      try {
        const x = await fetch(u);
        const ct = x.headers.get('Content-Type') || '';
        if (x.ok && !(ITEMS[id].role !== 'dict' && /text\/html/i.test(ct))) { r = x; break; } // السيرفر ساعات بيرجّع صفحة HTML بدل 404
        err = 'HTTP ' + x.status + ' (' + id + ')';
      } catch (e) { err = 'تعذّر تحميل ' + id + ' (' + ((e && e.message) || e) + ')'; }
    }
    if (!r) { const e = new Error(err || ('ملف ' + id + ' مش موجود')); e.item = id; throw e; }
    const total = +r.headers.get('Content-Length') || 0;
    if (total > MAX) throw new Error('الملف أكبر من 40 م.ب: ' + id);
    const rd = r.body && r.body.getReader(), parts = [];
    let got = 0;
    if (rd) {
      for (;;) {
        const { done, value } = await rd.read();
        if (done) break;
        parts.push(value); got += value.length;
        if (got > MAX) throw new Error('الملف أكبر من 40 م.ب: ' + id);
        onBytes && onBytes(got, total);
      }
    } else { const b = new Uint8Array(await r.arrayBuffer()); parts.push(b); got = b.length; onBytes && onBytes(got, got); }
    if (!got) throw new Error('ملف فاضي: ' + id);
    const c = await caches.open(OCACHE);
    await c.put(key(id), new Response(new Blob(parts), { headers: { 'Content-Type': ITEMS[id].role === 'dict' ? 'text/plain; charset=utf-8' : 'application/octet-stream' } }));
    return got;
  }

  /** يجهّز كتابة (arabic/latin/ch/cyrillic): الكشف + القراءة + القاموس (+ مساعد العربي). onProgress(0..1, id) */
  async function install(script, onProgress, fast) {
    const ids = idsFor(script, fast).concat(helperIds(script)), todo = [];
    for (const id of ids) if (!(await cached(id))) todo.push(id);
    if (!todo.length) { onProgress && onProgress(1, 'done'); return; }
    for (let i = 0; i < todo.length; i++) {
      await fetchItem(todo[i], (got, total) => onProgress && onProgress((i + (total ? got / total : 0.5)) / todo.length, todo[i]));
    }
    onProgress && onProgress(1, 'done');
    try { // تنظيف نماذج النسخة القديمة (v4) لو كانت متخزّنة
      const o = await caches.open(OLD);
      for (const k of await o.keys()) if (/\/vendor\/ocr\//.test(k.url)) await o.delete(k);
    } catch (e) { }
  }

  /** يرجّع محتوى عنصر (ArrayBuffer). لو مش متخزّن بيجهّزه من ملفات التطبيق. */
  async function get(id) {
    const c = await caches.open(OCACHE);
    let m = await c.match(key(id));
    if (!m) { await fetchItem(id); m = await c.match(key(id)); }
    return m ? m.arrayBuffer() : null;
  }

  /** يحدّد عنصر النموذج من اسم الملف (للاستيراد اليدوي) أو null */
  function classify(name) {
    const n = name.toLowerCase();
    const sc = /(^|[^a-z])ch_|ppocr_keys|chinese|v6_tiny_rec/.test(n) ? 'ch' : /arab/.test(n) ? 'arabic' : /cyril|eslav|\bru\b/.test(n) ? 'cyrillic' : /latin|\ben\b|english|en_/.test(n) ? 'latin' : null;
    if (/\.txt$/.test(n) || /dict/.test(n)) return sc ? 'dict-' + sc : null;
    if (/\.onnx$/.test(n)) return /small.*det|^det\./.test(n) ? 'det' : /det/.test(n) ? 'det-fast' : sc ? 'rec-' + sc : null;
    return null;
  }
  async function importFiles(files) {
    const c = await caches.open(OCACHE), ok = [], skipped = [];
    for (const f of files) {
      const id = classify(f.name);
      if (!id || f.size > MAX) { skipped.push(f.name); continue; }
      await c.put(key(id), new Response(f, { headers: { 'Content-Type': ITEMS[id].role === 'dict' ? 'text/plain; charset=utf-8' : 'application/octet-stream' } }));
      ok.push(id);
    }
    return { ok, skipped };
  }
  async function remove(script) {
    const c = await caches.open(OCACHE);
    for (const id of ['rec-' + script, 'dict-' + script]) await c.delete(key(id));
  }
  async function clearAll() { try { await caches.delete(OCACHE); } catch (e) { } }

  g.TXOcrModels = { ITEMS, idsFor, helperIds, has, install, remove, get, urlOf: key, importFiles, classify, clearAll, OCACHE };
})(typeof window !== 'undefined' ? window : globalThis);
