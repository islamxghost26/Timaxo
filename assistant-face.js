/* assistant-face.js — كشف الوجه بنموذج BlazeFace short-range (ONNX) على الجهاز، لمساعد الاقتراحات.
   النموذج: vendor/edge/blaze_face_short_range.onnx — Unity (unity/inference-engine-blaze-face، Apache-2.0)، محوّل من MediaPipe بـtf2onnx.
   مدخل `input` [1,128,128,3] (NHWC) قيم -1..1 RGB. مخرجات خام: regressors [1,896,16] و classificators [1,896,1] (logit).
   احنا محتاجين وجود الوجه ودرجته بس: الدرجة = sigmoid(أعلى logit) على 896 anchor، فمفيش فك صناديق ولا NMS.
   بنقيس 3 مناظر: كامل + النص الشمال + النص اليمين (الوجه الصغير في بطاقة بيطلع أعلى في نص الصورة) ونرجّع أعلى درجة.
   اتقاس: وجهين حقيقيين 0.91–0.92، وأعلى إنذار كاذب 0.675 → عتبة 0.8. تحت العتبة بنرجّع max(درجة,..)≤0.4 عشان قواعد المساعد (face≥0.5) ما تتأثرش.
   المحرك (onnxruntime-web) هو نفسه بتاع edge-model.js (EdgeModel.runtime).
   الاستخدام: TXAFace.install() → بيسجّل نفسه في TXA.setFaceDetector لو الملف والمحرك موجودين، وإلا بيسيب المقدّر المؤقت. */
(function (root) {
  'use strict';
  const S = 128, CONF = 0.8, LOW = 0.4;
  const url = p => new URL('vendor/edge/' + p, root.location.href).href;
  const F = { _s: null, _loading: null, SIZE: S, CONF };

  F.load = function () {
    if (F._s) return Promise.resolve(F._s);
    return F._loading || (F._loading = (async () => {
      if (!root.EdgeModel || !root.EdgeModel.runtime) throw new Error('edge-model.js مش محمّل');
      const ort = await root.EdgeModel.runtime();
      const r = await fetch(url('blaze_face_short_range.onnx')); if (!r.ok) throw new Error('الملف مش موجود: vendor/edge/blaze_face_short_range.onnx');
      F._ort = ort; F._s = await ort.InferenceSession.create(await r.arrayBuffer(), { executionProviders: ['wasm'] });
      return F._s;
    })().catch(e => { F._loading = null; throw e; }));
  };

  /* تصغير بمتوسط المساحة (box average) من جزء من RGBA لـ128×128 → Float32 [1,128,128,3] (NHWC) بقيم (x-127.5)/127.5 */
  F.prep = function (rgba, w, h, x0, y0, cw, ch) {
    const out = new Float32Array(3 * S * S);
    for (let y = 0; y < S; y++) {
      const ya = y0 + y * ch / S, yb = y0 + (y + 1) * ch / S, ys = Math.floor(ya), ye = Math.max(ys + 1, Math.min(h, Math.ceil(yb)));
      for (let x = 0; x < S; x++) {
        const xa = x0 + x * cw / S, xb = x0 + (x + 1) * cw / S, xs = Math.floor(xa), xe = Math.max(xs + 1, Math.min(w, Math.ceil(xb)));
        let r = 0, g = 0, b = 0, c = 0;
        for (let yy = ys; yy < ye; yy++) for (let xx = xs; xx < xe; xx++) { const i = (yy * w + xx) * 4; r += rgba[i]; g += rgba[i + 1]; b += rgba[i + 2]; c++; }
        c = c || 1; const j = (y * S + x) * 3;
        out[j] = (r / c - 127.5) / 127.5; out[j + 1] = (g / c - 127.5) / 127.5; out[j + 2] = (b / c - 127.5) / 127.5;
      }
    }
    return out;
  };

  /* أعلى ثقة وجه في منظر واحد (0..1): sigmoid لأعلى logit في classificators (896 قيمة) */
  F.conf = async function (tensor) {
    const ort = F._ort, o = await F._s.run({ input: new ort.Tensor('float32', tensor, [1, S, S, 3]) });
    const t = o.classificators || o[Object.keys(o)[1]];
    if (!t || !t.data || !t.data.length) return 0;
    let m = -Infinity; for (let i = 0; i < t.data.length; i++) if (t.data[i] > m) m = t.data[i];
    return 1 / (1 + Math.exp(-Math.max(-100, Math.min(100, m))));
  };

  /* الدرجة 0..1: أعلى ثقة على المناظر التلاتة؛ تحت العتبة بتتحدد بـ LOW. بترمي خطأ لو النموذج مش جاهز (TXA.face بيرجع للمقدّر) */
  F.score = async function (rgba, w, h) {
    await F.load();
    const hw = Math.floor(w / 2), views = [[0, 0, w, h], [0, 0, hw, h], [w - hw, 0, hw, h]];
    let best = 0;
    for (const v of views) best = Math.max(best, await F.conf(F.prep(rgba, w, h, v[0], v[1], v[2], v[3])));
    return best >= CONF ? best : Math.min(best, LOW);
  };

  /* تركيب: بس لو الملف موجود. بيرجّع true/false من غير ما يرمي */
  F.install = async function () {
    try { if (!root.TXA) return false; await F.load(); root.TXA.setFaceDetector(F.score); return true; }
    catch (e) { return false; }
  };

  root.TXAFace = F;
})(typeof window !== 'undefined' ? window : globalThis);
