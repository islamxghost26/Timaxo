/* ocr-models.js — تنزيل نماذج OCR (PP-OCR ONNX، Apache-2.0) من جوه التطبيق وتخزينها في كاش vendor.
   بيتنزّل النموذج وقت الحاجة بس، مع تقدّم، ومفيش أي بيانات بتتبعت لأي حد (طلبات GET لملفات النماذج بس). */
(function (g) {
  'use strict';
  const VCACHE = 'timaxo-vendor-v1';
  // المصدر: مستودع pitapo/rapidocr على HuggingFace (ترخيص apache-2.0 حسب بطاقة المستودع، وهو إعادة استضافة لنماذج RapidAI/RapidOCR).
  // المسارات مأخوذة من قايمة ملفات المستودع نفسه. القواميس ليها مصدر بديل من PaddleOCR (Apache-2.0).
  const HF = 'https://huggingface.co/pitapo/rapidocr/resolve/main/';
  const HD = HF + 'paddle/PP-OCRv4/rec/';
  const PD = 'https://raw.githubusercontent.com/PaddlePaddle/PaddleOCR/release/2.7/ppocr/utils/dict/';
  // مصدر jsDelivr (حزمة npm @gutenye/ocr-models، ترخيص MIT، نماذج PaddleOCR PP-OCRv4): نفس مكان مكتباتك فبيتحمّل من المتصفح. ⚠ المسارات من ذاكرتي (assets/) ومش متأكد منها.
  const JD = 'https://cdn.jsdelivr.net/npm/@gutenye/ocr-models@1.4.2/assets/';
  // ممكن تتبدّل الروابط من localStorage (tx_ocr_urls) لو مصدر اتغيّر.
  const ITEMS = {
    det: { role: 'det', script: 'any', urls: [JD + 'ch_PP-OCRv4_det_infer.onnx', HF + 'onnx/PP-OCRv4/det/ch_PP-OCRv4_det_infer.onnx'] },
    'rec-ch': { role: 'rec', script: 'ch', urls: [JD + 'ch_PP-OCRv4_rec_infer.onnx', HF + 'onnx/PP-OCRv4/rec/ch_PP-OCRv4_rec_infer.onnx'] },
    'dict-ch': { role: 'dict', script: 'ch', urls: [JD + 'ppocr_keys_v1.txt', PD + 'ppocr_keys_v1.txt'] },
    'rec-latin': { role: 'rec', script: 'latin', urls: [HF + 'onnx/PP-OCRv4/rec/latin_PP-OCRv3_rec_infer.onnx'] },
    'rec-arabic': { role: 'rec', script: 'arabic', urls: [HF + 'onnx/PP-OCRv4/rec/arabic_PP-OCRv4_rec_infer.onnx'] },
    'rec-cyrillic': { role: 'rec', script: 'cyrillic', urls: [HF + 'onnx/PP-OCRv4/rec/cyrillic_PP-OCRv3_rec_infer.onnx'] },
    'dict-latin': { role: 'dict', script: 'latin', urls: [HD + 'latin_PP-OCRv3_rec_infer/latin_dict.txt', PD + 'latin_dict.txt'] },
    'dict-arabic': { role: 'dict', script: 'arabic', urls: [HD + 'arabic_PP-OCRv4_rec_infer/arabic_dict.txt', PD + 'arabic_dict.txt'] },
    'dict-cyrillic': { role: 'dict', script: 'cyrillic', urls: [HD + 'cyrillic_PP-OCRv3_rec_infer/cyrillic_dict.txt', PD + 'cyrillic_dict.txt'] }
  };
  const MAX = 40 * 1048576;
  const override = id => { try { return (JSON.parse(localStorage.getItem('tx_ocr_urls') || '{}'))[id] || null; } catch (e) { return null; } };
  const fileOf = id => 'vendor/ocr/' + id + (ITEMS[id].role === 'dict' ? '.txt' : '.onnx'); // نفس أسماء ملفات tools/fetch-ocr-models.py
  // الأولوية: ملفات المشروع نفسه (vendor/ocr) ← بعدين الروابط الخارجية. كده التنزيل ميعتمدش على وصول المتصفح لمواقع برّه.
  const candidates = id => { const o = override(id); return o ? [o] : [fileOf(id)].concat(ITEMS[id].urls); };
  const urlOf = id => candidates(id)[0]; // مفتاح الكاش
  const idsFor = s => ['det', 'rec-' + s, 'dict-' + s];
  const cached = async id => { try { return !!(await (await caches.open(VCACHE)).match(urlOf(id))); } catch (e) { return false; } };
  const has = async s => (await Promise.all(idsFor(s).map(cached))).every(Boolean);

  async function fetchItem(id, onBytes) {
    let r = null, err = null;
    for (const u of candidates(id)) { // جرّب المصادر بالترتيب لحد ما واحد ينجح
      try {
        const x = await fetch(u);
        const ct = x.headers.get('Content-Type') || '';
        if (x.ok && !(ITEMS[id].role !== 'dict' && /text\/html/i.test(ct))) { r = x; break; } // السيرفر ساعات بيرجّع صفحة HTML بدل 404
        err = 'HTTP ' + x.status + ' (' + new URL(u, location.href).host + ')';
      } catch (e) { err = 'تعذّر الاتصال بـ ' + new URL(u, location.href).host + ' (' + ((e && e.message) || e) + ')'; }
    }
    if (!r) { const e = new Error(err + ' — ' + id); e.item = id; throw e; }
    const url = urlOf(id);
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
        onBytes(got, total);
      }
    } else { const b = new Uint8Array(await r.arrayBuffer()); parts.push(b); got = b.length; onBytes(got, got); }
    const c = await caches.open(VCACHE);
    await c.put(url, new Response(new Blob(parts), { headers: { 'Content-Type': r.headers.get('Content-Type') || 'application/octet-stream' } }));
    return got;
  }

  /** يثبّت كتابة (arabic/latin/cyrillic): الكشف (لو مش موجود) + القراءة + القاموس. onProgress(0..1, نص) */
  async function install(script, onProgress) {
    const todo = [];
    for (const id of idsFor(script)) if (!(await cached(id))) todo.push(id);
    if (!todo.length) { onProgress && onProgress(1, 'done'); return; }
    for (let i = 0; i < todo.length; i++) {
      await fetchItem(todo[i], (got, total) => {
        const frac = total ? got / total : 0.5;
        onProgress && onProgress((i + frac) / todo.length, todo[i]);
      });
    }
    onProgress && onProgress(1, 'done');
  }

  /** يحدّد عنصر النموذج من اسم الملف (det / rec-… / dict-…) أو null */
  function classify(name) {
    const n = name.toLowerCase();
    const sc = /(^|[^a-z])ch_|ppocr_keys|chinese/.test(n) ? 'ch' : /arab/.test(n) ? 'arabic' : /cyril|eslav|\bru\b/.test(n) ? 'cyrillic' : /latin|\ben\b|english|en_/.test(n) ? 'latin' : null;
    if (/\.txt$/.test(n) || /dict/.test(n)) return sc ? 'dict-' + sc : null;
    if (/\.onnx$/.test(n)) return /det/.test(n) ? 'det' : sc ? 'rec-' + sc : null;
    return null;
  }
  /** يخزّن ملفات اختارها المستخدم (File[]) في الكاش. يرجّع {ok:[ids], skipped:[names]} */
  async function importFiles(files) {
    const c = await caches.open(VCACHE), ok = [], skipped = [];
    for (const f of files) {
      const id = classify(f.name);
      if (!id || f.size > MAX) { skipped.push(f.name); continue; }
      await c.put(urlOf(id), new Response(f, { headers: { 'Content-Type': id.startsWith('dict') ? 'text/plain' : 'application/octet-stream' } }));
      ok.push(id);
    }
    return { ok, skipped };
  }

  async function remove(script) {
    const c = await caches.open(VCACHE);
    for (const id of ['rec-' + script, 'dict-' + script]) await c.delete(urlOf(id));
  }
  /** يرجّع محتوى عنصر متخزّن (ArrayBuffer) أو null */
  async function get(id) {
    const m = await (await caches.open(VCACHE)).match(urlOf(id));
    return m ? m.arrayBuffer() : null;
  }

  g.TXOcrModels = { ITEMS, idsFor, has, install, remove, get, urlOf, importFiles, classify };
})(typeof window !== 'undefined' ? window : globalThis);
