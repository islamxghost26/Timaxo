/*
 * edge-model.js — كشف أركان المستند بنموذج DocAligner (ONNX) على الجهاز.
 * النموذج: heatmap regression، مدخل 'img' = [1,3,256,256] float32 بترتيب BGR (قيم 0..1)،
 *          مخرج 'heatmap' = [1,C,H,W] حيث أول 4 قنوات = الأركان بالترتيب: يسار-فوق، يمين-فوق، يمين-تحت، يسار-تحت.
 * المصدر: DocsaidLab/DocAligner (Apache-2.0) — راجع LICENSES.md.
 * الملفات (محمّلة من لوحة test-edges.html ومخزنة في كاش vendor):
 *    vendor/edge/ort/<ort.wasm.min.js + *.wasm>   و   vendor/edge/model.onnx
 * بيرجّع نتايج بإحداثيات مُطبَّعة 0..1، وفي حالة الفشل بيرمي خطأ واضح (الخوارزمية الحالية هي الاحتياطي).
 */
(function (root) {
  'use strict';
  const VCACHE = 'timaxo-vendor-v1';                 // نفس اسم كاش vendor في sw.js
  const SIZE = 256;                                  // مقاس مدخل النموذج
  const THRESH = 0.3;                                // نفس عتبة المصدر الأصلي (heatmap_threshold)
  const url = p => new URL('vendor/edge/' + p, root.location.href).href;

  const EdgeModel = { _s: null, _ort: null, _loading: null, SIZE };

  /* ---------- تحميل المحرك والنموذج (مرة واحدة) ---------- */
  async function cached(name) {
    try { const c = await caches.open(VCACHE), r = await c.match(url(name)); if (r) return r; } catch (e) { /* نكمل بالشبكة */ }
    const r = await fetch(url(name)); if (!r.ok) throw new Error('الملف مش موجود: vendor/edge/' + name);
    return r;
  }

  /* المحرك لازم يكون في كاش vendor (من لوحة test-edges). النموذج: في الكاش أو ملف على السيرفر (vendor/edge/model.onnx). */
  EdgeModel.hasRuntime = async function () {
    try { const k = (await (await caches.open(VCACHE)).keys()).map(r => r.url); return k.some(u => /vendor\/edge\/ort\/ort(\.wasm)?\.min\.js$/.test(u)) && k.some(u => /vendor\/edge\/ort\/.*\.wasm$/.test(u)); }
    catch (e) { return false; }
  };
  EdgeModel.hasModel = async function () {
    try {
      if ((await (await caches.open(VCACHE)).keys()).some(r => r.url.endsWith('vendor/edge/model.onnx'))) return true;
      const r = await fetch(url('model.onnx'), { method: 'HEAD' });                    // ملف على السيرفر؟
      return r.ok && !/html/i.test(r.headers.get('content-type') || '') && +(r.headers.get('content-length') || 1e7) > 1e6;
    } catch (e) { return false; }
  };
  EdgeModel.available = async function () { return (await EdgeModel.hasRuntime()) && (await EdgeModel.hasModel()); };

  function loadRuntime() {
    if (root.ort) return Promise.resolve(root.ort);
    let js = 'ort.wasm.min.js';
    try { js = (JSON.parse(root.localStorage.getItem('edge_rt')) || {}).js || js; } catch (e) { /* الافتراضي */ }
    return new Promise((ok, no) => {
      const s = root.document.createElement('script'); s.src = url('ort/' + js);
      s.onload = () => ok(root.ort); s.onerror = () => no(new Error('محرك ONNX ماتحمّلش (أعد تحميل الصفحة مرة عشان الـservice worker يمسكها)'));
      root.document.head.appendChild(s);
    });
  }

  /* المحرك لوحده (من غير تحميل نموذج الأركان): بيستخدمه assistant-face.js لنموذج الوجه */
  EdgeModel.runtime = async function () {
    const ort = await loadRuntime();
    ort.env.wasm.wasmPaths = url('ort/'); ort.env.wasm.numThreads = 1; ort.env.wasm.proxy = false;
    EdgeModel._ort = ort; return ort;
  };

  EdgeModel.load = function () {
    if (EdgeModel._s) return Promise.resolve(EdgeModel._s);
    return EdgeModel._loading || (EdgeModel._loading = (async () => {
      const ort = await loadRuntime();
      ort.env.wasm.wasmPaths = url('ort/'); ort.env.wasm.numThreads = 1; ort.env.wasm.proxy = false;   // خيط واحد: من غير SharedArrayBuffer
      const buf = await (await cached('model.onnx')).arrayBuffer();
      EdgeModel._ort = ort; EdgeModel._s = await ort.InferenceSession.create(buf, { executionProviders: ['wasm'] });
      return EdgeModel._s;
    })().catch(e => { EdgeModel._loading = null; throw e; }));
  };

  /* ---------- تجهيز المدخل: تصغير لـ256×256 بـ bilinear "خام" (زي cv2.INTER_LINEAR) + BGR + /255 ----------
     مهم: النموذج اتدرّب على التصغير الخام (من غير فلتر تنعيم). تصغير المتصفح الناعم (drawImage بجودة عالية) بيغيّر الصورة
     كفاية إن النموذج يفوّت مستندات كاملة (اتقاس: 7-8 من 18 بدل 10)، فبنعمل العينات بإيدينا. */
  EdgeModel.preprocess = function (src) {
    let w = src.width, h = src.height, from = src;
    if (Math.max(w, h) > 2048) {                         // صور ضخمة: نصغّرها الأول (زي ما اتقاس) عشان ما نقراش 48MB بكسل
      const k = 1600 / Math.max(w, h), t = root.document.createElement('canvas'); t.width = Math.round(w * k); t.height = Math.round(h * k);
      t.getContext('2d').drawImage(src, 0, 0, t.width, t.height); from = t; w = t.width; h = t.height;
    }
    const c = root.document.createElement('canvas'); c.width = w; c.height = h;
    const g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(from, 0, 0);
    const px = g.getImageData(0, 0, w, h).data, n = SIZE * SIZE, out = new Float32Array(3 * n), fx = w / SIZE, fy = h / SIZE;
    for (let y = 0; y < SIZE; y++) {
      const sy = Math.min(h - 1, Math.max(0, (y + .5) * fy - .5)), y0 = Math.floor(sy), y1 = Math.min(h - 1, y0 + 1), wy = sy - y0;
      for (let x = 0; x < SIZE; x++) {
        const sx = Math.min(w - 1, Math.max(0, (x + .5) * fx - .5)), x0 = Math.floor(sx), x1 = Math.min(w - 1, x0 + 1), wx = sx - x0;
        const i00 = (y0 * w + x0) * 4, i01 = (y0 * w + x1) * 4, i10 = (y1 * w + x0) * 4, i11 = (y1 * w + x1) * 4, o = y * SIZE + x;
        for (let ch = 0; ch < 3; ch++) {                 // ch: 0=R 1=G 2=B في الصورة ← قناة النموذج (2-ch): B,G,R
          const v = px[i00 + ch] * (1 - wx) * (1 - wy) + px[i01 + ch] * wx * (1 - wy) + px[i10 + ch] * (1 - wx) * wy + px[i11 + ch] * wx * wy;
          out[(2 - ch) * n + o] = v / 255;
        }
      }
    }
    return out;
  };

  /* ---------- معالجة الـheatmap: لكل ركن أكبر منطقة فوق العتبة ← مركز ثقل موزون بالقيم ---------- */
  EdgeModel.postprocess = function (data, C, H, W) {
    const quad = [], conf = [], n = H * W;
    for (let k = 0; k < 4 && k < C; k++) {
      const ch = data.subarray(k * n, (k + 1) * n), lab = new Int32Array(n);
      let best = null, id = 0;
      for (let s = 0; s < n; s++) {
        if (ch[s] < THRESH || lab[s]) continue;
        id++; const stack = [s]; lab[s] = id;
        let sw = 0, sx = 0, sy = 0, cnt = 0, peak = 0;
        while (stack.length) {                     // تتبّع المنطقة المتصلة (4 اتجاهات)
          const p = stack.pop(), x = p % W, y = (p / W) | 0, v = ch[p];
          sw += v; sx += v * (x + .5); sy += v * (y + .5); cnt++; if (v > peak) peak = v;
          if (x > 0 && !lab[p - 1] && ch[p - 1] >= THRESH) { lab[p - 1] = id; stack.push(p - 1); }
          if (x < W - 1 && !lab[p + 1] && ch[p + 1] >= THRESH) { lab[p + 1] = id; stack.push(p + 1); }
          if (y > 0 && !lab[p - W] && ch[p - W] >= THRESH) { lab[p - W] = id; stack.push(p - W); }
          if (y < H - 1 && !lab[p + W] && ch[p + W] >= THRESH) { lab[p + W] = id; stack.push(p + W); }
        }
        if (!best || cnt > best.cnt) best = { cnt, peak, x: sx / sw / W, y: sy / sw / H };   // أكبر مساحة (زي المصدر)
      }
      if (!best) return { quad: null, score: 0, found: false };
      quad.push({ x: best.x, y: best.y }); conf.push(best.peak);
    }
    if (quad.length < 4) return { quad: null, score: 0, found: false };
    return { quad, score: conf.reduce((a, b) => a + b, 0) / 4, found: true };
  };

  /* ---------- الواجهة: canvas ← { quad, score, found, ms } ---------- */
  EdgeModel.detect = async function (canvas) {
    const s = await EdgeModel.load(), ort = EdgeModel._ort, t0 = performance.now();
    const x = new ort.Tensor('float32', EdgeModel.preprocess(canvas), [1, 3, SIZE, SIZE]);
    const r = await s.run({ [s.inputNames[0]]: x });
    const hm = r.heatmap || r[s.outputNames[0]], d = hm.dims;          // [1, C, H, W]
    if (d.length !== 4 || d[1] < 4) throw new Error('شكل مخرج النموذج غير متوقع: [' + d + ']');
    const out = EdgeModel.postprocess(hm.data, d[1], d[2], d[3]);
    out.ms = Math.round(performance.now() - t0);
    return out;
  };

  root.EdgeModel = EdgeModel;
})(typeof window !== 'undefined' ? window : globalThis);
