/* ocr-onnx.js (v141) — محرك OCR على الجهاز: كشف (PP-OCRv6 DB) + قراءة (PP-OCRv5/v6 CRNN-CTC) بـ onnxruntime-web.
   تحسينات v141 (متجرّبة على نماذج حقيقية):
   • العربي: نموذج العربي + نموذج الإنجليزي على نفس السطر، والدمج بالـtimestep (الأرقام واللاتيني بتتصحّح من نموذج الإنجليزي لما ثقته عالية).
   • مواضع الكلمات من الـCTC نفسه (مش تقسيم بالتناسب) → تحديد النص الحي أدق بكتير.
   • تعديل ميل الصفحة قبل الكشف وإرجاع المواضع للصورة الأصلية، وإعادة محاولة بتحسين تباين للسطور ضعيفة الثقة.
   • ترتيب أصح للعربي (أرقام شرقية، علامات الترقيم، الأقواس).
   لو أي حاجة ناقصة أو الثقة ضعيفة بيرجّع null والتطبيق يكمّل بـTesseract. */
(function (g) {
  'use strict';

  const REC_H = 48, REC_MAXW = 3200;
  const DEF = { detMax: 1280, thresh: 0.2, boxThresh: 0.4, unclip: 1.4, minSide: 3, minConf: 0.55, retryBelow: 0.8, fast: false };
  const LAT = /[0-9A-Za-z@.,:;/$%+\-_#&()*!?'"=<>\[\]|]/;
  const ARL = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/;
  const KEEP = /[a-zA-Z0-9 :*./%+\-@$,_#&=\u0660-\u0669\u06F0-\u06F9\u066B\u066C]/; // بتفضل بترتيبها جوه النص العربي
  const MIR = { '(': ')', ')': '(', '[': ']', ']': '[', '{': '}', '}': '{', '<': '>', '>': '<', '«': '»', '»': '«' };

  /* ===================== دوال نقية (بتتجرّب في node) ===================== */

  /** قاموس → قايمة رموز: [blank, ...dict, ' '] (مع مطابقة طول مخرج النموذج C) */
  function buildChars(dictText, C) {
    const lines = String(dictText).split(/\r?\n/);
    if (lines.length && lines[lines.length - 1] === '') lines.pop();
    const chars = ['\u0000'].concat(lines, [' ']);
    if (C && chars.length === C + 1) chars.pop(); // نموذج من غير رمز المسافة
    return chars;
  }

  /** فك CTC الجشع بخطوات: [{t,c,p}] — t رقم الـtimestep، c الحرف، p احتمال الحرف. probs = Float32Array بحجم T*C */
  function ctcSteps(probs, T, C, chars) {
    let prev = -1;
    const out = [];
    for (let t = 0; t < T; t++) {
      let best = 0, bp = -1;
      const o = t * C;
      for (let c = 0; c < C; c++) { const p = probs[o + c]; if (p > bp) { bp = p; best = c; } }
      if (best !== 0 && best !== prev && chars[best] !== undefined) out.push({ t, c: chars[best], p: bp });
      prev = best;
    }
    return out;
  }
  const meanConf = st => { const k = st.filter(x => x.c !== ' '); return k.length ? k.reduce((a, x) => a + x.p, 0) / k.length : 0; };
  /** توافق قديم: نص + ثقة */
  function ctcDecode(probs, T, C, chars) {
    const st = ctcSteps(probs, T, C, chars);
    return { text: st.map(x => x.c).join(''), conf: st.length ? st.reduce((a, x) => a + x.p, 0) / st.length : 0, steps: st };
  }

  /** دمج قراءة العربي (A) مع قراءة الإنجليزي (E) لنفس السطر بنفس الـtimesteps.
      كلمات E اللاتينية/الأرقام (ثقة ≥ .9) بتحلّ محل حروف A في نفس المدى، بشرط ما يكونش فيه حروف عربية هناك. */
  function mergeScripts(A, E) {
    const toks = [];
    let cur = [];
    const flush = () => { if (cur.length) toks.push(cur); cur = []; };
    for (const s of E) {
      if (s.c === ' ' || !LAT.test(s.c) || (cur.length && s.t - cur[cur.length - 1].t > 6)) flush();
      if (s.c !== ' ' && LAT.test(s.c)) cur.push(s);
    }
    flush();
    let res = A.slice();
    const added = [];
    for (const r of toks) {
      if (!r.some(x => /[0-9A-Za-z]/.test(x.c))) continue;
      const cf = r.reduce((a, x) => a + x.p, 0) / r.length, t0 = r[0].t - 1, t1 = r[r.length - 1].t + 1;
      if (cf < 0.9) continue;
      if (res.some(a => a.t >= t0 && a.t <= t1 && ARL.test(a.c))) continue;
      res = res.filter(a => !(a.t >= t0 && a.t <= t1)).concat(r);
      added.push([r[0].t, r[r.length - 1].t]);
    }
    res.sort((a, b) => a.t - b.t);
    const inA = (t, k) => added.findIndex(([s, e]) => t >= s && t <= e) === k;
    const idx = t => added.findIndex(([s, e]) => t >= s && t <= e);
    const out = [];
    for (const a of res) {
      const p = out[out.length - 1];
      if (p && p.c !== ' ' && a.c !== ' ') {
        const ip = idx(p.t), ia = idx(a.t);
        if (ip !== ia) out.push({ t: p.t, c: ' ', p: 1 }); // كلمة مستبدلة لازم تتفصل بمسافة عن اللي جنبها
      }
      out.push(a);
    }
    return out;
  }

  /** ترتيب نص عربي (زي pred_reverse في PaddleOCR): الأرقام واللاتيني بيفضلوا بترتيبهم، والباقي بيتعكس (مع قلب الأقواس).
      والنقطتين قبل كلمة عربية بنعاملها كرمز لوحده عشان تفضل بعد التسمية (الاسم: محمد). */
  function arabicReorder(s) {
    s = String(s).replace(/\s*:(?=\s*[\u0600-\u06FF])/g, '\u0001');
    const out = [];
    let cur = '';
    const flush = () => {
      if (!cur) return;
      const m = cur.match(/^(\s*)([\s\S]*?)(\s*)$/);
      if (m[1]) out.push(m[1]); if (m[2]) out.push(m[2]); if (m[3]) out.push(m[3]);
      cur = '';
    };
    for (const c of s) {
      if (!KEEP.test(c)) { flush(); out.push(MIR[c] || c); } else cur += c;
    }
    flush();
    return out.reverse().join('').replace(/\u0001/g, ': ');
  }

  /** تنظيف خفيف للسطر: مسافات مكررة، مسافة قبل علامة ترقيم */
  function tidy(s) {
    return String(s).replace(/[ \t]{2,}/g, ' ').replace(/\s+([،؛؟!.,:;])/g, '$1').trim();
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

  /** ترتيب القراءة: أسطر من فوق لتحت (بتداخل رأسي ≥ نص الارتفاع)، وجوّا كل سطر يمين→شمال لو rtl وإلا شمال→يمين */
  function orderBoxes(boxes, rtl) {
    const b = boxes.slice().sort((a, c) => (a.y0 + a.y1) - (c.y0 + c.y1));
    const lines = [];
    for (const x of b) {
      const L = lines[lines.length - 1];
      if (L) {
        const ov = Math.min(L.y1, x.y1) - Math.max(L.y0, x.y0);
        if (ov > 0.5 * Math.min(L.y1 - L.y0, x.y1 - x.y0)) { L.items.push(x); L.y0 = Math.min(L.y0, x.y0); L.y1 = Math.max(L.y1, x.y1); continue; }
      }
      lines.push({ y0: x.y0, y1: x.y1, items: [x] });
    }
    lines.forEach(L => L.items.sort((a, c) => rtl ? c.x0 - a.x0 : a.x0 - c.x0));
    return lines;
  }

  /** يوزّع كلمات سطر على صندوقه بالتناسب مع عدد الحروف (احتياطي لما مفيش timesteps) */
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

  /** كلمات السطر بمواضعها الحقيقية من الـtimesteps. steps بالترتيب البصري (شمال→يمين).
      region = {sx,sw}: مدى الصورة اللي دخلت للقراءة؛ Tn عدد الـtimesteps؛ box = حدود السطر المكتشف. */
  const WA = 0.8, WB = 1.8; // امتداد الكلمة قبل أول/بعد آخر timestep (بالـsteps) — معايَر على نصوص مرسومة بخطوط معروفة
  function wordsFromSteps(steps, Tn, region, box, rtlLine, conf) {
    const words = [];
    let cur = [];
    const flush = () => { if (cur.length) words.push(cur); cur = []; };
    for (const s of steps) {
      if (s.c === ' ') { flush(); continue; }
      if (cur.length && s.t - cur[cur.length - 1].t > 9) flush();
      cur.push(s);
    }
    flush();
    const px = t => region.sx + t / Tn * region.sw;
    return words.map(w => {
      const vis = w.map(s => s.c).join(''), isAr = ARL.test(vis);
      const x0 = Math.max(box.x0, px(w[0].t - WA)), x1 = Math.min(box.x1, px(w[w.length - 1].t + WB));
      return { t: isAr ? arabicReorder(vis) : vis, x0, y0: box.y0, x1: Math.max(x1, x0 + 2), y1: box.y1, c: (w.reduce((a, s) => a + s.p, 0) / w.length) * 100 };
    }).filter(w => w.t);
  }

  /* ===================== الصورة ← تنسور ===================== */
  const mk = (w, h) => { const c = g.document.createElement('canvas'); c.width = w; c.height = h; return c; };

  /** يرسم جزء من المصدر بالحجم المطلوب ويرجّع Float32Array [1,3,h,w] بترتيب BGR. stretch = مط التباين (2%–98%) */
  function toTensor(src, sx, sy, sw, sh, w, h, mean, std, stretch) {
    const c = mk(w, h), x = c.getContext('2d', { willReadFrequently: true });
    x.fillStyle = '#fff'; x.fillRect && x.fillRect(0, 0, w, h);
    x.imageSmoothingQuality = 'high';
    x.drawImage(src, sx, sy, sw, sh, 0, 0, w, h);
    const d = x.getImageData(0, 0, w, h).data, P = w * h, out = new Float32Array(3 * P);
    let lo = 0, sc = 1;
    if (stretch) {
      const hist = new Uint32Array(256);
      for (let i = 0; i < d.length; i += 4) hist[(d[i] * 77 + d[i + 1] * 150 + d[i + 2] * 29) >> 8]++;
      let a = 0, l = 0, hgh = 255;
      for (let v = 0; v < 256; v++) { a += hist[v]; if (a >= P * 0.02) { l = v; break; } }
      a = 0; for (let v = 255; v >= 0; v--) { a += hist[v]; if (a >= P * 0.02) { hgh = v; break; } }
      if (hgh - l > 30) { lo = l; sc = 255 / (hgh - l); }
    }
    const f = v => { v = (v - lo) * sc; return (v < 0 ? 0 : v > 255 ? 255 : v) / 255; };
    for (let i = 0, p = 0; p < P; i += 4, p++) {
      out[p] = (f(d[i + 2]) - mean[0]) / std[0];          // B
      out[P + p] = (f(d[i + 1]) - mean[1]) / std[1];      // G
      out[2 * P + p] = (f(d[i]) - mean[2]) / std[2];      // R
    }
    return out;
  }

  /** يدوّر الكانفس بزاوية a (راديان، موجب = في اتجاه عقارب الساعة) مع توسيع، ويرجّع {cv, back(x,y)} لإرجاع نقطة للإحداثيات الأصلية */
  function rotate(cv, a) {
    const c = Math.abs(Math.cos(a)), s = Math.abs(Math.sin(a)), w = Math.ceil(cv.width * c + cv.height * s), h = Math.ceil(cv.width * s + cv.height * c);
    const o = mk(w, h), x = o.getContext('2d'), p = cv.getContext('2d').getImageData(1, 1, 1, 1).data;
    x.fillStyle = 'rgb(' + p[0] + ',' + p[1] + ',' + p[2] + ')'; x.fillRect(0, 0, w, h);
    x.imageSmoothingQuality = 'high'; x.translate(w / 2, h / 2); x.rotate(a); x.drawImage(cv, -cv.width / 2, -cv.height / 2);
    const co = Math.cos(a), si = Math.sin(a), cx0 = cv.width / 2, cy0 = cv.height / 2;
    return { cv: o, back: (px, py) => { const dx = px - w / 2, dy = py - h / 2; return [dx * co + dy * si + cx0, -dx * si + dy * co + cy0]; } };
  }

  /* ===================== المحرك ===================== */
  const S = { ort: null, det: {}, rec: {}, chars: {} };

  async function getOrt() {
    if (S.ort) return S.ort;
    const E = g.EdgeModel;
    if (!E || !E.runtime) throw new Error('محرك onnxruntime مش متاح');
    return (S.ort = await E.runtime());
  }
  async function session(id) {
    const buf = await g.TXOcrModels.get(id);
    if (!buf) throw new Error('نموذج ' + id + ' مش متاح');
    const ort = await getOrt();
    return ort.InferenceSession.create(new Uint8Array(buf), { executionProviders: ['wasm'], graphOptimizationLevel: 'all' });
  }
  async function loadRec(script) {
    if (!S.rec[script]) {
      S.rec[script] = await session('rec-' + script);
      S.chars[script] = await g.TXOcrModels.get('dict-' + script).then(b => new TextDecoder('utf-8').decode(b));
    }
    return S.rec[script];
  }

  /** الكتابة المناسبة للغات المختارة (مثلًا 'ara+eng'). null لو مفيش (والتطبيق يرجع لـTesseract). */
  async function pickScript(langStr) {
    const L = String(langStr || '').split('+').filter(Boolean);
    let s;
    if (L.some(l => /^(ara|fas|urd|pus|uig|kur)$/.test(l))) s = 'arabic';
    else if (L.some(l => /^(rus|ukr|bul|bel|srp|mkd)$/.test(l))) s = 'cyrillic';
    else if (L.some(l => /^(chi|jpn|kor)/.test(l))) s = 'ch';
    else if (L.every(l => l === 'eng')) s = 'latin';
    else s = 'ch'; // لغات لاتينية بحروف مشكّلة (فرنسي/ألماني/إسباني…): قاموس v6 فيه كل الحروف المشكّلة
    return (await g.TXOcrModels.has(s)) ? s : null;
  }

  /** يقرا سطر واحد (صندوق) → {text, steps, conf, Tn, region} */
  async function readBox(cv, b, script, opt, ort) {
    const rec = S.rec[script], helper = script === 'arabic' ? S.rec.latin : null;
    const attempt = async (padK, stretch) => {
      const pad = Math.max(2, (b.y1 - b.y0) * padK);
      const sx = Math.max(0, b.x0 - pad), sy = Math.max(0, b.y0 - pad), sw = Math.min(cv.width, b.x1 + pad) - sx, sh = Math.min(cv.height, b.y1 + pad) - sy;
      if (sw < 2 || sh < 2) return null;
      const rw = Math.max(16, Math.min(REC_MAXW, Math.ceil(REC_H * sw / sh / 4) * 4));
      const rt = toTensor(cv, sx, sy, sw, sh, rw, REC_H, [0.5, 0.5, 0.5], [0.5, 0.5, 0.5], stretch);
      const run = async (m) => {
        const ro = await m.run({ [m.inputNames[0]]: new ort.Tensor('float32', rt, [1, 3, REC_H, rw]) });
        const out = ro[m.outputNames[0]], dims = out.dims;
        return { data: out.data, Tn: dims[1], C: dims[2] };
      };
      const A = await run(rec);
      let st = ctcSteps(A.data, A.Tn, A.C, g.TXOnnx._chars(script, A.C));
      if (helper) {
        const E = await run(helper);
        st = mergeScripts(st, ctcSteps(E.data, E.Tn, E.C, g.TXOnnx._chars('latin', E.C)));
      }
      return { steps: st, conf: meanConf(st), Tn: A.Tn, region: { sx, sw }, vis: st.map(x => x.c).join('') };
    };
    let r = await attempt(0.1, false);
    if (r && r.conf < opt.retryBelow) { // سطر ضعيف الثقة: جرّب تباين أعلى وحواف أوسع واختار الأحسن
      const r2 = await attempt(0.25, true);
      if (r2 && (r2.conf > r.conf + 0.02 || !r.vis.trim())) r = r2;
    }
    return r;
  }

  async function run(cv0, script, opt) {
    opt = Object.assign({}, DEF, opt);
    const prog = opt.onProgress || (() => { }), dead = opt.isDead || (() => false);
    const ort = await getOrt();
    prog(0.04);
    // تعديل الميل (بيتحوّل للإحداثيات الأصلية بعد القراءة)
    let cv = cv0, rot = null, skew = 0;
    if (typeof opt.skew === 'function') { try { skew = opt.skew(cv0) || 0; } catch (e) { skew = 0; } }
    if (Math.abs(skew) > 0.012 && Math.abs(skew) < 0.45) { rot = rotate(cv0, -skew); cv = rot.cv; } else skew = 0;
    const detId = opt.fast ? 'det-fast' : 'det';
    if (!S.det[detId]) S.det[detId] = await session(detId);
    await loadRec(script);
    if (script === 'arabic') { try { await loadRec('latin'); } catch (e) { console.warn('TXOnnx helper', e); } }
    if (dead()) return null;
    // --- كشف ---
    const det = S.det[detId];
    const k = Math.min(opt.detMax / Math.max(cv.width, cv.height), 1.6);
    const dw = Math.max(32, Math.round(cv.width * k / 32) * 32), dh = Math.max(32, Math.round(cv.height * k / 32) * 32);
    const dt = toTensor(cv, 0, 0, cv.width, cv.height, dw, dh, [0.485, 0.456, 0.406], [0.229, 0.224, 0.225]);
    const dout = await det.run({ [det.inputNames[0]]: new ort.Tensor('float32', dt, [1, 3, dh, dw]) });
    const prob = dout[det.outputNames[0]].data;
    prog(0.25);
    const rtl = script === 'arabic';
    const boxes = dbBoxes(prob, dw, dh, Object.assign({}, opt, opt.fast ? { boxThresh: 0.4 } : { boxThresh: 0.45 })).map(b => ({ x0: b.x0 * cv.width / dw, x1: b.x1 * cv.width / dw, y0: b.y0 * cv.height / dh, y1: b.y1 * cv.height / dh, score: b.score }));
    const lines = orderBoxes(boxes, rtl), total = boxes.length;
    // --- قراءة ---
    let done = 0, confSum = 0, chars = 0, T = '', M = [];
    const back = rot ? rot.back : null;
    for (const L of lines) {
      const parts = [];
      for (const b of L.items) {
        if (dead()) return null;
        const r = await readBox(cv, b, script, opt, ort);
        done++; prog(0.25 + 0.75 * done / Math.max(1, total));
        if (!r || !r.vis.trim()) continue;
        const arLine = ARL.test(r.vis);
        let text = tidy(arLine ? arabicReorder(r.vis) : r.vis);
        if (!text || (r.conf < 0.3 && text.length < 3)) continue; // ضوضاء
        parts.push(text); confSum += r.conf * text.length; chars += text.length;
        let ws = wordsFromSteps(r.steps, r.Tn, r.region, b, arLine, r.conf);
        if (!ws.length) ws = splitWords(text, b, r.conf, arLine);
        if (back) ws = ws.map(w => { // مركز الكلمة يرجع للإحداثيات الأصلية بنفس الحجم (الميل صغير)
          const c = back((w.x0 + w.x1) / 2, (w.y0 + w.y1) / 2), hw = (w.x1 - w.x0) / 2, hh = (w.y1 - w.y0) / 2;
          return Object.assign({}, w, { x0: c[0] - hw, x1: c[0] + hw, y0: c[1] - hh, y1: c[1] + hh });
        });
        M.push.apply(M, ws);
      }
      if (parts.length) T += (T ? '\n' : '') + parts.join(' ');
    }
    const mean = chars ? confSum / chars : 0;
    return { T, M, W: [], r: null, pc: cv0, engine: 'onnx', script, skew, sc: { mean: mean * 100, n: chars, tot: mean * T.length } };
  }

  /** يجهّز النماذج لو لسه (من ملفات التطبيق) ثم يشغّل المحرك. بيرجّع كائن بنفس شكل ocrRun أو null (مش متاح/ثقة ضعيفة/خطأ). */
  async function tryRun(cv, langStr, onProgress, isDead, extra) {
    try {
      if (!g.TXOcrModels || !g.EdgeModel || localStorage.getItem('tx_onnx') === '0') return null;
      const script = await pickScript(langStr);
      if (!script) return null;
      const fast = !!(extra && extra.fast);
      try { await g.TXOcrModels.install(script, f => onProgress && onProgress(f * 0.04), fast); } catch (e) { console.warn('TXOnnx install', e); return null; }
      const r = await run(cv, script, Object.assign({}, extra, { onProgress, isDead, fast }));
      if (!r || !r.T.trim() || r.sc.mean < DEF.minConf * 100) return null;
      return r;
    } catch (e) { console.warn('TXOnnx', e); return null; }
  }

  g.TXOnnx = {
    tryRun, run, pickScript, buildChars, ctcDecode, ctcSteps, mergeScripts, arabicReorder, tidy, dbBoxes, orderBoxes, splitWords, wordsFromSteps, toTensor, rotate,
    _chars(script, C) { const k = script + ':' + C; return (S._ck = S._ck || {})[k] || (S._ck[k] = buildChars(S.chars[script], C)); },
    _state: S, DEF
  };
  if (typeof module !== 'undefined') module.exports = g.TXOnnx;
})(typeof window !== 'undefined' ? window : globalThis);
