/*
 * edge-learn.js — تعلّم محلي على الجهاز من تعديلات المستخدم على حواف القص.
 *
 * بيتعلّم حاجتين (مفيش شبكة عصبية ولا بيانات بتخرج من الجهاز):
 *   1) أوزان ترتيب المرشحين (تباين الحواف / اتفاق المصادر / ثقة المصدر / الحجم) + تفضيل بسيط لمصدر (نموذج أو خوارزمية حالية).
 *   2) حد "راجع الحواف" (بدل الثابت 0.8) على حسب إمتى بتضطر تعدّل القص بإيدك.
 *
 * طريقة التعلم: كل مرة تأكّد القص، بنقارن رباعيك النهائي بالمرشحين (IoU). المرشح الأقرب (≥ 0.9) هو "الصح"،
 * وكل مرشح واضح إنه أسوأ (IoU < 0.8) لو درجته قريبة أو أعلى بنحرّك الأوزان ناحية الصح (perceptron ترتيبي).
 *
 * أمان: التعلم بيشتغل فعليًا بعد 20 ملاحظة، وبيتدرّج لحد 60. وبنقارن دايمًا "الأوزان المتعلّمة" بـ"الافتراضية" على كل ملاحظة جديدة
 * قبل ما نتعلّم منها (prequential)؛ لو المتعلّمة مش أحسن أو مساوية على آخر ملاحظات، بنرجع للافتراضي أوتوماتيك.
 * التخزين: localStorage (مفتاح tx_learn)، آخر 150 ملاحظة بأرقام بس (مفيش صور). مفعّل افتراضيًا ويتوقف بزر.
 */
(function (root) {
  'use strict';
  const KEY = 'tx_learn', DEF_W = [0.30, 0.25, 0.25, 0.20], DEF_THR = 0.8;
  const MAXLOG = 150, MAXPQ = 40, MAXEV = 60, MIN_OBS = 20, FULL_OBS = 60;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const SRC = { model: 0, current: 1, other: 2 };
  const srcClass = s => (s === 'model' ? 'model' : String(s || '').startsWith('current') ? 'current' : 'other');

  function fresh() { return { v: 1, on: 1, n: 0, miss: 0, w: DEF_W.slice(), b: [0, 0, 0], log: [], pq: [], ev: [] }; }
  function load() {
    try { const s = JSON.parse(root.localStorage.getItem(KEY)); if (s && s.v === 1 && Array.isArray(s.w) && s.w.length === 4) return s; } catch (e) { /* نبدأ من جديد */ }
    return fresh();
  }
  let S = load();
  function save() { try { root.localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* التخزين ممتلئ/ممنوع: نكمّل بالذاكرة */ } }

  /* درجة مرشح: f = [تباين، اتفاق، ثقة، حجم]، g = الصلاحية الهندسية */
  const score = (f, g, src, w, b) => (g > 0 ? g * (w[0] * f[0] + w[1] * f[1] + w[2] * f[2] + w[3] * f[3]) + b[SRC[src]] : 0);
  const blend = (a, b, k) => a.map((v, i) => v * (1 - k) + b[i] * k);
  const iou = (a, b) => (root.EdgeHybrid ? root.EdgeHybrid.iou(a, b) : 0);

  function top1(cands, w, b) {                       // فهرس أعلى مرشح بالأوزان دي
    let bi = -1, bs = -1;
    cands.forEach((c, i) => { const s = score(c.f, c.g, c.s, w, b); if (s > bs) { bs = s; bi = i; } });
    return bi;
  }
  function learnedActive() {
    if (!S.on || S.n < MIN_OBS || S.pq.length < 10) return 0;
    const d = S.pq.reduce((a, x) => a + x[0], 0), l = S.pq.reduce((a, x) => a + x[1], 0);
    if (l < d) return 0;                              // المتعلّمة أسوأ من الافتراضية: نرجع للافتراضي
    return clamp((S.n - MIN_OBS) / (FULL_OBS - MIN_OBS), 0, 1);
  }

  const EdgeLearn = {
    DEFAULT_W: DEF_W,
    enabled() { return !!S.on; },
    setEnabled(v) { S.on = v ? 1 : 0; save(); },
    reset() { const on = S.on; S = fresh(); S.on = on; save(); },
    stats() {
      const k = learnedActive(), d = S.pq.reduce((a, x) => a + x[0], 0), l = S.pq.reduce((a, x) => a + x[1], 0);
      return { on: !!S.on, n: S.n, miss: S.miss, active: k > 0, mix: k, thr: this.params().thr, defHits: d, learnHits: l, window: S.pq.length };
    },
    /* الأوزان الفعّالة لـ EdgeHybrid.rank وحد المراجعة */
    params() {
      const k = learnedActive();
      const out = { w: blend(DEF_W, S.w, k), bias: { model: 0, current: 0, other: 0 }, thr: DEF_THR, active: k > 0 };
      if (k > 0) { out.bias = { model: S.b[0] * k, current: S.b[1] * k, other: S.b[2] * k }; }
      const t = learnThr(); if (t != null) out.thr = +(DEF_THR * (1 - Math.max(k, 0.3)) + t * Math.max(k, 0.3)).toFixed(2);
      return out;
    },
    /* بعد الترتيب: بنحفظ مميزات المرشحين (محلي، بأرقام) لحد ما المستخدم يأكّد القص */
    record(ranked) {
      if (!S.on || !ranked || !ranked.length) return null;
      return { cands: ranked.filter(x => x.geo && x.geo.g > 0).map(x => ({ q: x.quad.map(p => ({ x: p.x, y: p.y })), f: [x.contrast, x.agree, x.conf, x.fillV], g: x.geo.g, s: srcClass(x.src) })), pickScore: ranked[0].score };
    },
    bind(page, tok) { if (tok) EdgeLearn._m.set(page, tok); },
    observePage(page) { const t = EdgeLearn._m.get(page); if (t && page && page.corners) { EdgeLearn._m.delete(page); EdgeLearn.observe(t, page.corners); } },
    observe(tok, finalQuad) {
      if (!S.on || !tok || !tok.cands.length || !finalQuad || finalQuad.length !== 4) return;
      const c = tok.cands, io = c.map(x => iou(x.q, finalQuad));
      const ti = io.indexOf(Math.max(...io)), solvable = io[ti] >= 0.9;
      const pickIdx = top1(c, DEF_W, [0, 0, 0]);                      // اللي كان هيتاختار بالافتراضي
      S.n++;
      // ملاحظة حد المراجعة: درجة المرشح الأول المعروض وهل كان صح؟
      S.ev.push([+tok.pickScore.toFixed(3), solvable && io[0] >= 0.9 ? 1 : 0]); if (S.ev.length > MAXEV) S.ev.shift();
      if (!solvable) { S.miss++; save(); return; }                    // مفيش مرشح صح: مفيش حاجة نرتّبها
      // prequential: مين كان هيصيب (الافتراضية ولا المتعلّمة) قبل ما نتعلّم من الملاحظة دي
      const lw = S.w, lb = S.b;
      S.pq.push([io[pickIdx] >= 0.9 ? 1 : 0, io[top1(c, lw, lb)] >= 0.9 ? 1 : 0]); if (S.pq.length > MAXPQ) S.pq.shift();
      // تحديث الأوزان
      const lr = 0.08 / (1 + S.n / 80), t = c[ti];
      c.forEach((o, i) => {
        if (i === ti || io[i] >= 0.8) return;
        if (score(o.f, o.g, o.s, S.w, S.b) + 0.02 >= score(t.f, t.g, t.s, S.w, S.b)) {
          for (let k = 0; k < 4; k++) S.w[k] += lr * (t.g * t.f[k] - o.g * o.f[k]);
          S.b[SRC[t.s]] += lr * 0.5 * t.g; S.b[SRC[o.s]] -= lr * 0.5 * o.g;
        }
      });
      S.w = S.w.map(v => Math.max(0.02, v)); const sum = S.w.reduce((a, v) => a + v, 0); S.w = S.w.map(v => v / sum);
      S.b = S.b.map(v => clamp(v, -0.12, 0.12));
      // سجل للمراجعة/التصحيح
      S.log.push(c.map((x, i) => [...x.f.map(v => +v.toFixed(3)), SRC[x.s], +x.g.toFixed(3), +io[i].toFixed(2)])); if (S.log.length > MAXLOG) S.log.shift();
      save();
    },
    _m: new WeakMap()
  };

  /* حد المراجعة: أنسب قيمة تفصل "المرشح الأول طلع غلط" عن "صح" (بعد ≥5 غلطات و≥10 صح) */
  function learnThr() {
    const bad = S.ev.filter(e => !e[1]), good = S.ev.filter(e => e[1]);
    if (bad.length < 5 || good.length < 10) return null;
    let best = null, bv = -9;
    for (let t = 0.50; t <= 0.951; t += 0.01) {
      const tpr = bad.filter(e => e[0] < t).length / bad.length, fpr = good.filter(e => e[0] < t).length / good.length;
      const v = tpr - 0.7 * fpr; if (v > bv) { bv = v; best = t; }
    }
    return +best.toFixed(2);
  }

  root.EdgeLearn = EdgeLearn;
  if (typeof module !== 'undefined') module.exports = EdgeLearn;
})(typeof window !== 'undefined' ? window : globalThis);
