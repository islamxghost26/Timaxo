/*
 * edge-hybrid.js — ترتيب مرشحي أركان المستند (النموذج + الخوارزمية الحالية + بدائلها) بدرجة ثقة.
 * الإحداثيات كلها مُطبَّعة 0..1 بترتيب: يسار-فوق، يمين-فوق، يمين-تحت، يسار-تحت.
 *
 * الدرجة النهائية = الصلاحية الهندسية (بوابة 0..1) × ( 0.30 تباين الحواف + 0.25 اتفاق المصادر + 0.25 ثقة المصدر + 0.20 حجم معقول )
 *   - الصلاحية الهندسية: رباعي محدب، مساحة معقولة، زوايا قريبة من القائمة، أضلاع متقابلة متناسقة.
 *   - تباين الحواف: فرق اللون بين جوه وبرّه كل ضلع (بنقيس على صورة مصغّرة).
 *   - الاتفاق: أعلى تقاطع (IoU) مع مرشح من مصدر تاني (مثلًا النموذج والخوارزمية الحالية اتفقوا).
 * مفيش اعتماد على أي مكتبة؛ شغّال في المتصفح وNode.
 */
(function (root) {
  'use strict';
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const EdgeHybrid = { DEFAULT_W: [0.30, 0.25, 0.25, 0.20] };
  const srcClass = s => (s === 'model' ? 'model' : String(s || '').startsWith('current') ? 'current' : 'other');

  /* ---------- هندسة ---------- */
  function area(q) { let a = 0; for (let i = 0; i < 4; i++) { const p = q[i], n = q[(i + 1) % 4]; a += p.x * n.y - n.x * p.y; } return a / 2; }
  function isConvex(q) {
    let s = 0;
    for (let i = 0; i < 4; i++) {
      const a = q[i], b = q[(i + 1) % 4], c = q[(i + 2) % 4], z = (b.x - a.x) * (c.y - b.y) - (b.y - a.y) * (c.x - b.x);
      if (Math.abs(z) < 1e-9) return false;
      if (!s) s = Math.sign(z); else if (Math.sign(z) !== s) return false;
    }
    return true;
  }
  function angles(q, asp) {                       // الزوايا بالدرجات (بنصحّح النسبة لو الصورة مش مربعة)
    return q.map((p, i) => {
      const a = q[(i + 3) % 4], b = q[(i + 1) % 4];
      const v1 = { x: (a.x - p.x) * asp, y: a.y - p.y }, v2 = { x: (b.x - p.x) * asp, y: b.y - p.y };
      const c = (v1.x * v2.x + v1.y * v2.y) / ((Math.hypot(v1.x, v1.y) * Math.hypot(v2.x, v2.y)) || 1);
      return Math.acos(clamp(c, -1, 1)) * 180 / Math.PI;
    });
  }
  function inside(q, x, y) {                      // even-odd
    let c = false;
    for (let i = 0, j = 3; i < 4; j = i++) {
      if ((q[i].y > y) !== (q[j].y > y) && x < (q[j].x - q[i].x) * (y - q[i].y) / (q[j].y - q[i].y) + q[i].x) c = !c;
    }
    return c;
  }
  function iou(a, b) {                            // تقاطع/اتحاد بشبكة 64×64
    let i = 0, u = 0; const N = 64;
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      const px = (x + .5) / N, py = (y + .5) / N, A = inside(a, px, py), B = inside(b, px, py);
      if (A && B) i++; if (A || B) u++;
    }
    return u ? i / u : 0;
  }

  /* ---------- الصلاحية الهندسية (0..1) ---------- */
  function geometry(q, asp) {
    if (!q || q.length !== 4 || q.some(p => !isFinite(p.x) || !isFinite(p.y))) return { g: 0, why: 'invalid' };
    if (!isConvex(q)) return { g: 0, why: 'non-convex' };
    const A = Math.abs(area(q));
    if (A < 0.08) return { g: 0, why: 'tiny' };
    const ang = angles(q, asp);
    const angScore = Math.min(...ang.map(a => clamp(1 - (Math.abs(a - 90) - 15) / 40, 0, 1)));   // لحد 15° انحراف مفيش خصم؛ بعد 55° صفر
    const d = (a, b) => Math.hypot((a.x - b.x) * asp, a.y - b.y);
    const w1 = d(q[0], q[1]), w2 = d(q[3], q[2]), h1 = d(q[0], q[3]), h2 = d(q[1], q[2]);
    const pair = (a, b) => clamp((Math.min(a, b) / Math.max(a, b) - 0.35) / 0.35, 0, 1);          // أضلاع متقابلة قريبة من بعض (المنظور بيسمح بفرق)
    const frame = A > 0.93 ? 0.5 : 1;                                                              // الإطار الكامل غالبًا احتياطي مش كشف حقيقي
    return { g: angScore * Math.min(pair(w1, w2), pair(h1, h2)) * frame, why: 'ok', area: A };
  }

  /* ---------- تباين الحواف ---------- */
  EdgeHybrid.prepare = function (canvas, maxSide) {      // صورة مصغّرة RGBA للقياس
    maxSide = maxSide || 360; const k = Math.min(1, maxSide / Math.max(canvas.width, canvas.height));
    const w = Math.max(8, Math.round(canvas.width * k)), h = Math.max(8, Math.round(canvas.height * k));
    const c = (root.document ? root.document.createElement('canvas') : null); c.width = w; c.height = h;
    const g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(canvas, 0, 0, w, h);
    return { w, h, px: g.getImageData(0, 0, w, h).data };
  };
  function sample(img, x, y) {                           // bilinear، null لو برّه الصورة
    if (x < 0 || y < 0 || x > img.w - 1 || y > img.h - 1) return null;
    const x0 = x | 0, y0 = y | 0, fx = x - x0, fy = y - y0, x1 = Math.min(x0 + 1, img.w - 1), y1 = Math.min(y0 + 1, img.h - 1), d = img.px, o = [0, 0, 0];
    for (let c = 0; c < 3; c++) {
      o[c] = d[(y0 * img.w + x0) * 4 + c] * (1 - fx) * (1 - fy) + d[(y0 * img.w + x1) * 4 + c] * fx * (1 - fy) +
             d[(y1 * img.w + x0) * 4 + c] * (1 - fx) * fy + d[(y1 * img.w + x1) * 4 + c] * fx * fy;
    }
    return o;
  }
  function contrast(q, img) {
    const P = q.map(p => ({ x: p.x * img.w, y: p.y * img.h })), sgn = Math.sign(area(P)) || 1, dd = Math.max(2, 0.012 * Math.min(img.w, img.h));
    const side = [];
    for (let i = 0; i < 4; i++) {
      const a = P[i], b = P[(i + 1) % 4], dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy) || 1;
      const nx = sgn * dy / L, ny = -sgn * dx / L;     // ناحية برّه الرباعي
      let sum = 0, n = 0;
      for (let t = 0.08; t <= 0.92; t += 0.84 / 23) {
        const x = a.x + dx * t, y = a.y + dy * t; let diff = 0, m = 0;
        for (const k of [1, 1.8]) {
          const A = sample(img, x - nx * dd * k, y - ny * dd * k), B = sample(img, x + nx * dd * k, y + ny * dd * k);
          if (A && B) { diff += (Math.abs(A[0] - B[0]) + Math.abs(A[1] - B[1]) + Math.abs(A[2] - B[2])) / 765; m++; }
        }
        if (m) { sum += diff / m; n++; }
      }
      side.push(n < 6 ? 0.5 : clamp((sum / n) / 0.10, 0, 1));       // ضلع على حافة الصورة: درجة محايدة
    }
    return 0.5 * (side.reduce((a, b) => a + b, 0) / 4) + 0.5 * Math.min(...side);
  }

  /* ---------- الترتيب ---------- */
  // cands: [{ quad, src: 'model'|'current'|..., conf: 0..1 }]، img: ناتج prepare (اختياري)
  EdgeHybrid.rank = function (cands, img, aspect) {
    const asp = aspect || 1;
    const items = cands.filter(c => c && c.quad).map(c => {
      const geo = geometry(c.quad, asp);
      return { quad: c.quad, src: c.src, conf: clamp(c.conf == null ? 0.5 : c.conf, 0, 1), geo, area: geo.area || 0 };
    });
    const L = root.EdgeLearn && root.EdgeLearn.params ? root.EdgeLearn.params() : null;      // أوزان متعلّمة (لو التعلم المحلي شغّال وكفاية ملاحظات)
    const W = L ? L.w : EdgeHybrid.DEFAULT_W;
    items.forEach(it => {
      const others = items.filter(o => o !== it && o.src !== it.src && o.geo.g > 0);
      it.agree = others.length ? Math.max(...others.map(o => iou(it.quad, o.quad))) : 0;
      it.contrast = (it.geo.g > 0 && img) ? contrast(it.quad, img) : 0;
      it.fillV = clamp((it.area - 0.08) / 0.32, 0, 1);
      const bias = L ? L.bias[srcClass(it.src)] : 0;
      it.score = it.geo.g > 0 ? it.geo.g * (W[0] * it.contrast + W[1] * it.agree + W[2] * it.conf + W[3] * it.fillV) + bias : 0;
    });
    items.sort((a, b) => b.score - a.score);
    // إزالة المكرر (نفس الرباعي تقريبًا من مصدرين): نحتفظ بالأعلى
    const out = [];
    for (const it of items) if (!out.some(o => iou(o.quad, it.quad) > 0.93)) out.push(it);
    return out;
  };

  EdgeHybrid.iou = iou;
  root.EdgeHybrid = EdgeHybrid;
  if (typeof module !== 'undefined') module.exports = EdgeHybrid;
})(typeof window !== 'undefined' ? window : globalThis);
