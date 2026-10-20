/* ocr-onnx.js — محرك OCR حديث على الجهاز: كشف (DB) + قراءة (CRNN/CTC) بنماذج PP-OCR ONNX.
   بيستخدم onnxruntime-web الموجود أصلًا في vendor/edge (EdgeModel.runtime) والنماذج اللي نزّلها ocr-models.js.
   لو أي حاجة ناقصة أو الثقة ضعيفة بيرجّع null، والتطبيق يكمّل بـTesseract زي الأول. */
(function (g) {
  'use strict';

  const REC_H = 48;
  const DEF = { detMax: 1152, thresh: 0.3, boxThresh: 0.55, unclip: 1.8, minSide: 3, minConf: 0.6 };

  /* ===================== دوال نقية (بتتجرّب في node) ===================== */

  /** قاموس → قايمة رموز: [blank, ...dict, ' '] (مع مطابقة طول مخرج النموذج C) */
  function buildChars(dictText, C) {
    const lines = String(dictText).split(/\r?\n/);
    if (lines.length && lines[lines.length - 1] === '') lines.pop();
    const chars = ['\u0000'].concat(lines, [' ']);
    if (C && chars.length === C + 1) chars.pop(); // نموذج من غير رمز المسافة
    return chars;
  }

  /** فك CTC الجشع: probs = Float32Array بحجم T*C (softmax) */
  function ctcDecode(probs, T, C, chars) {
    let prev = -1, text = '', sum = 0, n = 0;
    for (let t = 0; t < T; t++) {
      let best = 0, bp = -1;
      const o = t * C;
      for (let c = 0; c < C; c++) { const p = probs[o + c]; if (p > bp) { bp = p; best = c; } }
      if (best !== 0 && best !== prev && chars[best] !== undefined) { text += chars[best]; sum += bp; n++; }
      prev = best;
    }
    return { text, conf: n ? sum / n : 0 };
  }

  /** ترتيب نص عربي (زي pred_reverse في PaddleOCR): الأرقام والحروف اللاتينية بتفضل بترتيبها، والباقي بيتعكس.
      والنقطتين قبل كلمة عربية بنعاملها كرمز لوحده عشان تفضل بعد التسمية (الاسم: محمد). */
  function arabicReorder(s) {
    s = String(s).replace(/\s*:(?=\s*[\u0600-\u06FF])/g, '\u0001');
    const out = [];
    let cur = '';
    for (const c of s) {
      if (!/[a-zA-Z0-9 :*./%+\-]/.test(c)) { if (cur) out.push(cur); out.push(c); cur = ''; } else cur += c;
    }
    if (cur) out.push(cur);
    return out.reverse().join('').replace(/\u0001/g, ': ');
  }

  /** معالجة خريطة احتمالات DB → صناديق (للنص الأفقي). prob: Float32Array H*W */
  function dbBoxes(prob, W, H, o) {
    o = Object.assign({}, DEF, o);
    const n = W * H, seen = new Uint8Array(n), boxes = [], stack = new Int32Array(n);
    for (let i = 0; i < n; i++) {
      if (seen[i] || prob[i] <= o.thresh) continue;
      let sp = 0, x0 = W, y0 = H, x1 = -1, y1 = -1, cnt = 0, sum = 0;
      stack[sp++] = i; seen[i] = 1;
      while (sp) {
        const k = stack[--sp], x = k % W, y = (k / W) | 0;
        cnt++; sum += prob[k];
        if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
        for (let dy = -1; dy <= 1; dy++) {
          const yy = y + dy; if (yy < 0 || yy >= H) continue;
          for (let dx = -1; dx <= 1; dx++) {
            const xx = x + dx; if (xx < 0 || xx >= W) continue;
            const j = yy * W + xx;
            if (!seen[j] && prob[j] > o.thresh) { seen[j] = 1; stack[sp++] = j; }
          }
        }
      }
      const w = x1 - x0 + 1, h = y1 - y0 + 1;
      if (Math.min(w, h) < o.minSide || sum / cnt < o.boxThresh) continue;
      const d = (w * h * o.unclip) / (2 * (w + h)); // مسافة التوسيع (unclip) زي DB
      boxes.push({ x0: Math.max(0, x0 - d), y0: Math.max(0, y0 - d), x1: Math.min(W, x1 + 1 + d), y1: Math.min(H, y1 + 1 + d), score: sum / cnt });
    }
    return boxes;
  }

  /** ترتيب القراءة: أسطر من فوق لتحت، وجوّا كل سطر يمين→شمال لو rtl وإلا شمال→يمين */
  function orderBoxes(boxes, rtl) {
    const b = boxes.slice().sort((a, c) => (a.y0 + a.y1) - (c.y0 + c.y1));
    const lines = [];
    for (const x of b) {
      const L = lines[lines.length - 1];
      const cy = (x.y0 + x.y1) / 2;
      if (L && cy > L.y0 && cy < L.y1) { L.items.push(x); L.y0 = Math.min(L.y0, x.y0); L.y1 = Math.max(L.y1, x.y1); }
      else lines.push({ y0: x.y0, y1: x.y1, items: [x] });
    }
    lines.forEach(L => L.items.sort((a, c) => rtl ? c.x0 - a.x0 : a.x0 - c.x0));
    return lines;
  }

  /** يوزّع كلمات سطر على صندوقه بالتناسب مع عدد الحروف → [{t,x0,y0,x1,y1,c}] */
  function splitWords(text, box, conf, rtl) {
    const ws = text.split(/\s+/).filter(Boolean);
    if (!ws.length) return [];
    const tot = ws.reduce((a, w) => a + w.length, 0) + (ws.length - 1) * 0.5, wd = box.x1 - box.x0;
    let pos = 0;
    return ws.map(w => {
      const a = pos / tot, b = (pos + w.length) / tot;
      pos += w.length + 0.5;
      const x0 = rtl ? box.x1 - b * wd : box.x0 + a * wd, x1 = rtl ? box.x1 - a * wd : box.x0 + b * wd;
      return { t: w, x0, y0: box.y0, x1, y1: box.y1, c: conf * 100 };
    });
  }

  /* ===================== الصورة ← تنسور ===================== */
  const mk = (w, h) => { const c = g.document.createElement('canvas'); c.width = w; c.height = h; return c; };

  /** يرسم جزء من المصدر بالحجم المطلوب ويرجّع Float32Array [1,3,h,w] بترتيب BGR */
  function toTensor(src, sx, sy, sw, sh, w, h, mean, std) {
    const c = mk(w, h), x = c.getContext('2d');
    x.fillStyle = '#fff'; x.fillRect && x.fillRect(0, 0, w, h);
    x.imageSmoothingQuality = 'high';
    x.drawImage(src, sx, sy, sw, sh, 0, 0, w, h);
    const d = x.getImageData(0, 0, w, h).data, P = w * h, out = new Float32Array(3 * P);
    for (let i = 0, p = 0; p < P; i += 4, p++) {
      out[p] = (d[i + 2] / 255 - mean[0]) / std[0];          // B
      out[P + p] = (d[i + 1] / 255 - mean[1]) / std[1];      // G
      out[2 * P + p] = (d[i] / 255 - mean[2]) / std[2];      // R
    }
    return out;
  }

  /* ===================== المحرك ===================== */
  const S = { ort: null, det: null, rec: {}, chars: {} };

  async function getOrt() {
    if (S.ort) return S.ort;
    const E = g.EdgeModel;
    if (!E || !E.runtime) throw new Error('محرك onnxruntime مش متاح');
    return (S.ort = await E.runtime());
  }
  async function session(id) {
    const buf = await g.TXOcrModels.get(id);
    if (!buf) throw new Error('نموذج ' + id + ' مش متنزّل');
    const ort = await getOrt();
    return ort.InferenceSession.create(new Uint8Array(buf), { executionProviders: ['wasm'], graphOptimizationLevel: 'all' });
  }

  /** الكتابة المناسبة للغات المختارة (مثلًا 'ara+eng') من اللي متنزّل. null لو مفيش. */
  async function pickScript(langStr) {
    const M = g.TXOcrModels, L = String(langStr || '').split('+');
    // لو عربي أو سيريلي مطلوب لازم نموذجه هو بالذات (نموذج الإنجليزي هيقرا العربي حروف غلط بثقة عالية) وإلا نرجع لـTesseract
    const want = L.some(l => /^(ara|fas|urd)$/.test(l)) ? ['arabic']
      : L.some(l => /^(rus|ukr|bul|bel|srp|mkd)$/.test(l)) ? ['cyrillic'] : ['ch', 'latin'];
    for (const s of want) if (await M.has(s)) return s;
    return null;
  }

  async function run(cv, script, opt) {
    opt = Object.assign({}, DEF, opt);
    const prog = opt.onProgress || (() => { }), dead = opt.isDead || (() => false);
    const ort = await getOrt();
    prog(0.05);
    if (!S.det) S.det = await session('det');
    if (!S.rec[script]) {
      S.rec[script] = await session('rec-' + script);
      S.chars[script] = await g.TXOcrModels.get('dict-' + script).then(b => new TextDecoder('utf-8').decode(b));
    }
    if (dead()) return null;
    // --- كشف ---
    const k = Math.min(opt.detMax / Math.max(cv.width, cv.height), 1.6);
    const dw = Math.max(32, Math.round(cv.width * k / 32) * 32), dh = Math.max(32, Math.round(cv.height * k / 32) * 32);
    const dt = toTensor(cv, 0, 0, cv.width, cv.height, dw, dh, [0.485, 0.456, 0.406], [0.229, 0.224, 0.225]);
    const dout = await S.det.run({ [S.det.inputNames[0]]: new ort.Tensor('float32', dt, [1, 3, dh, dw]) });
    const prob = dout[S.det.outputNames[0]].data;
    prog(0.3);
    const rtl = script === 'arabic';
    const boxes = dbBoxes(prob, dw, dh, opt).map(b => ({ x0: b.x0 * cv.width / dw, x1: b.x1 * cv.width / dw, y0: b.y0 * cv.height / dh, y1: b.y1 * cv.height / dh, score: b.score }));
    const lines = orderBoxes(boxes, rtl), total = boxes.length;
    // --- قراءة ---
    const rec = S.rec[script];
    let done = 0, confSum = 0, nTxt = 0, T = '', M = [];
    for (const L of lines) {
      const parts = [];
      for (const b of L.items) {
        if (dead()) return null;
        const pad = Math.max(2, (b.y1 - b.y0) * 0.1);
        const sx = Math.max(0, b.x0 - pad), sy = Math.max(0, b.y0 - pad), sw = Math.min(cv.width, b.x1 + pad) - sx, sh = Math.min(cv.height, b.y1 + pad) - sy;
        if (sw < 2 || sh < 2) { done++; continue; }
        const rw = Math.max(16, Math.min(1280, Math.ceil(REC_H * sw / sh / 4) * 4));
        const rt = toTensor(cv, sx, sy, sw, sh, rw, REC_H, [0.5, 0.5, 0.5], [0.5, 0.5, 0.5]);
        const ro = await rec.run({ [rec.inputNames[0]]: new ort.Tensor('float32', rt, [1, 3, REC_H, rw]) });
        const out = ro[rec.outputNames[0]], dims = out.dims, Tn = dims[1], C = dims[2];
        const chars = g.TXOnnx._chars(script, C);
        const r = ctcDecode(out.data, Tn, C, chars);
        let text = r.text.trim();
        if (rtl && /[\u0600-\u06FF]/.test(text)) text = arabicReorder(text);
        if (text) {
          parts.push(text); confSum += r.conf; nTxt++;
          M.push.apply(M, splitWords(text, { x0: b.x0, x1: b.x1, y0: b.y0, y1: b.y1 }, r.conf, rtl && /[\u0600-\u06FF]/.test(text)));
        }
        done++; prog(0.3 + 0.7 * done / Math.max(1, total));
      }
      if (parts.length) T += (T ? '\n' : '') + parts.join(' ');
    }
    const mean = nTxt ? confSum / nTxt : 0;
    return { T, M, W: [], r: null, pc: cv, engine: 'onnx', script, sc: { mean: mean * 100, n: nTxt, tot: mean * T.length } };
  }

  /** يجرّب المحرك الحديث. بيرجّع كائن بنفس شكل ocrRun أو null (مش متاح/ثقة ضعيفة/خطأ) عشان نكمّل بـTesseract. */
  async function tryRun(cv, langStr, onProgress, isDead) {
    try {
      if (!g.TXOcrModels || !g.EdgeModel || localStorage.getItem('tx_onnx') === '0') return null;
      const script = await pickScript(langStr);
      if (!script) return null;
      const r = await run(cv, script, { onProgress, isDead });
      if (!r || !r.T.trim() || r.sc.mean < DEF.minConf * 100) return null;
      return r;
    } catch (e) { console.warn('TXOnnx', e); return null; }
  }

  g.TXOnnx = {
    tryRun, run, pickScript, buildChars, ctcDecode, arabicReorder, dbBoxes, orderBoxes, splitWords, toTensor,
    _chars(script, C) { const k = script + ':' + C; return (S._ck = S._ck || {})[k] || (S._ck[k] = buildChars(S.chars[script], C)); },
    _state: S
  };
  if (typeof module !== 'undefined') module.exports = g.TXOnnx;
})(typeof window !== 'undefined' ? window : globalThis);
