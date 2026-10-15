# LICENSES — المكتبات والنماذج المستخدمة

| المكوّن | الترخيص | ملاحظة |
|---|---|---|
| tesseract.js 5.1.1 | Apache-2.0 | يُحمَّل بـ vendor/fetch-vendor.sh |
| tesseract.js-core 5.1.1 | Apache-2.0 | نفس السكريبت |
| tessdata (ara, eng) | Apache-2.0 | نفس السكريبت |
| pdf.js (pdf.min.mjs) | Apache-2.0 | داخل الحزمة |
| Cairo / Noto Sans Arabic / Inter | OFL-1.1 | داخل الحزمة (font-OFL-Cairo.txt) |
| openjpeg / jbig2 / qcms (wasm) | يُراجَع | تأكد من نص ترخيص كل واحد قبل الإصدار النهائي |
| quickjs-eval.wasm | MIT (المتوقع) | يُراجَع قبل الإصدار |
| onnxruntime-web (1.18.0) | MIT | يتنزّل بـ vendor/fetch-edge-model.py إلى vendor/edge/ort — يُؤكَّد بعد أول تشغيل (السكريبت بيتحقق من نص MIT) |
| نموذج حواف المستند: DocAligner `lcnet100_h_e_bifpn_256_fp32.onnx` (المؤلف المذكور في README: Ze Yuan، 2023) | Apache-2.0 للمستودع (`licenses/DocAligner-LICENSE.txt`). **تنبيه:** ملف LICENSE هناك هو القالب القياسي وفيه `[name of copyright owner]` فاضي، وترخيص ملف الأوزان نفسه مش منصوص عليه بشكل منفصل (الأوزان بتنزل أوتوماتيك مع الحزمة Apache-2.0) | المصدر: https://github.com/DocsaidLab/DocAligner — الأوزان على Google Drive (file id في `docaligner/heatmap_reg/infer.py`: 1IlbLPkCv-TdaBLOPh_4J97P1_KHYYJ7a). مدخل `img` [1,3,256,256] BGR/255 ومخرج `heatmap` [1,C,H,W]. الملف الفعلي: `vendor/edge/model.onnx` (4.77 MB، sha256 `f4117b786e3a18470f3865c93f3c2bd69d9b998edd60f385574a5c665e79594e`) + نسخة الترخيص `vendor/edge/MODEL-LICENSE.txt`. اتفحص على onnxruntime (بايثون): مدخل `img` [1,3,256,256] float32، ومخرج `heatmap` [1,4,128,128] |

> الحالة: لم أتحقق من النصوص الأصلية أونلاين (لا يوجد اتصال في بيئتي). راجع الأسطر المكتوب فيها "يُراجَع".

> نص Apache-2.0 القياسي محفوظ في `licenses/Apache-2.0.txt` (النص العام بدون اسم صاحب حقوق). عند إضافة نموذج Apache لازم نسجّل هنا اسم المشروع وصاحب الحقوق ورابط المصدر، وننسخ ملف LICENSE/NOTICE بتاع المستودع نفسه جنب النموذج.

> `edge-model.js` و`edge-hybrid.js`: كود أصلي للمشروع (من غير مكتبات خارجية)؛ بيستخدموا onnxruntime-web (MIT) ونموذج DocAligner (Apache-2.0) المذكورين فوق.

