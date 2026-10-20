/* ocr-models.js — تنزيل نماذج OCR (PP-OCR ONNX، Apache-2.0) من جوه التطبيق وتخزينها في كاش vendor.
   بيتنزّل النموذج وقت الحاجة بس، مع تقدّم، ومفيش أي بيانات بتتبعت لأي حد (طلبات GET لملفات النماذج بس). */
(function (g) {
  'use strict';
  const VCACHE = 'timaxo-vendor-v1';
  const HF = 'https://huggingface.co/SWHL/RapidOCR/resolve/main/';
  const PD = 'https://raw.githubusercontent.com/PaddlePaddle/PaddleOCR/release/2.7/ppocr/utils/dict/';
  // نفس العناصر في tools/fetch-ocr-models.py. الروابط من الذاكرة ومش متجرّبة: ممكن تتبدّل من localStorage (tx_ocr_urls).
  const ITEMS = {
    det: { role: 'det', script: 'any', url: HF + 'PP-OCRv4/ch_PP-OCRv4_det_infer.onnx' },
    'rec-latin': { role: 'rec', script: 'latin', url: HF + 'PP-OCRv3/latin_PP-OCRv3_rec_infer.onnx' },
    'rec-arabic': { role: 'rec', script: 'arabic', url: HF + 'PP-OCRv3/arabic_PP-OCRv3_rec_infer.onnx' },
    'rec-cyrillic': { role: 'rec', script: 'cyrillic', url: HF + 'PP-OCRv3/cyrillic_PP-OCRv3_rec_infer.onnx' },
    'dict-latin': { role: 'dict', script: 'latin', url: PD + 'latin_dict.txt' },
    'dict-arabic': { role: 'dict', script: 'arabic', url: PD + 'arabic_dict.txt' },
    'dict-cyrillic': { role: 'dict', script: 'cyrillic', url: PD + 'cyrillic_dict.txt' }
  };
  const MAX = 40 * 1048576;
  const urlOf = id => {
    try { const o = JSON.parse(localStorage.getItem('tx_ocr_urls') || '{}'); if (o[id]) return o[id]; } catch (e) { }
    return ITEMS[id].url;
  };
  const idsFor = s => ['det', 'rec-' + s, 'dict-' + s];
  const cached = async id => { try { return !!(await (await caches.open(VCACHE)).match(urlOf(id))); } catch (e) { return false; } };
  const has = async s => (await Promise.all(idsFor(s).map(cached))).every(Boolean);

  async function fetchItem(id, onBytes) {
    const url = urlOf(id), r = await fetch(url);
    if (!r.ok) { const e = new Error('HTTP ' + r.status + ' — ' + id); e.item = id; throw e; }
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
