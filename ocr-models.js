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
  // ممكن تتبدّل الروابط من localStorage (tx_ocr_urls) لو مصدر اتغيّر.
  const ITEMS = {
    det: { role: 'det', script: 'any', urls: [HF + 'onnx/PP-OCRv4/det/ch_PP-OCRv4_det_infer.onnx'] },
    'rec-latin': { role: 'rec', script: 'latin', urls: [HF + 'onnx/PP-OCRv4/rec/latin_PP-OCRv3_rec_infer.onnx'] },
    'rec-arabic': { role: 'rec', script: 'arabic', urls: [HF + 'onnx/PP-OCRv4/rec/arabic_PP-OCRv4_rec_infer.onnx'] },
    'rec-cyrillic': { role: 'rec', script: 'cyrillic', urls: [HF + 'onnx/PP-OCRv4/rec/cyrillic_PP-OCRv3_rec_infer.onnx'] },
    'dict-latin': { role: 'dict', script: 'latin', urls: [HD + 'latin_PP-OCRv3_rec_infer/latin_dict.txt', PD + 'latin_dict.txt'] },
    'dict-arabic': { role: 'dict', script: 'arabic', urls: [HD + 'arabic_PP-OCRv4_rec_infer/arabic_dict.txt', PD + 'arabic_dict.txt'] },
    'dict-cyrillic': { role: 'dict', script: 'cyrillic', urls: [HD + 'cyrillic_PP-OCRv3_rec_infer/cyrillic_dict.txt', PD + 'cyrillic_dict.txt'] }
  };
  const MAX = 40 * 1048576;
  const override = id => { try { return (JSON.parse(localStorage.getItem('tx_ocr_urls') || '{}'))[id] || null; } catch (e) { return null; } };
  const candidates = id => { const o = override(id); return o ? [o] : ITEMS[id].urls; };
  const urlOf = id => candidates(id)[0]; // مفتاح الكاش
  const idsFor = s => ['det', 'rec-' + s, 'dict-' + s];
  const cached = async id => { try { return !!(await (await caches.open(VCACHE)).match(urlOf(id))); } catch (e) { return false; } };
  const has = async s => (await Promise.all(idsFor(s).map(cached))).every(Boolean);

  async function fetchItem(id, onBytes) {
    let r = null, err = null;
    for (const u of candidates(id)) { // جرّب المصادر بالترتيب لحد ما واحد ينجح
      try { const x = await fetch(u); if (x.ok) { r = x; break; } err = 'HTTP ' + x.status; } catch (e) { err = 'تعذّر الاتصال بالمصدر (شبكة أو حجب)'; }
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

  async function remove(script) {
    const c = await caches.open(VCACHE);
    for (const id of ['rec-' + script, 'dict-' + script]) await c.delete(urlOf(id));
  }
  /** يرجّع محتوى عنصر متخزّن (ArrayBuffer) أو null */
  async function get(id) {
    const m = await (await caches.open(VCACHE)).match(urlOf(id));
    return m ? m.arrayBuffer() : null;
  }

  g.TXOcrModels = { ITEMS, idsFor, has, install, remove, get, urlOf };
})(typeof window !== 'undefined' ? window : globalThis);
