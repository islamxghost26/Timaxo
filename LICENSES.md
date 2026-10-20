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

> `edge-model.js` و`edge-hybrid.js` و`edge-learn.js`: كود أصلي للمشروع (من غير مكتبات خارجية)؛ بيستخدموا onnxruntime-web (MIT) ونموذج DocAligner (Apache-2.0) المذكورين فوق.

> `assistant.js` (مساعد الاقتراحات، المرحلة 3): كود أصلي للمشروع، قواعد وقياسات فقط، بدون مكتبات أو نماذج خارجية. كشف الوجه فيه مقدّر مؤقت أصلي (كتلة جلد + شكل + ملامح، بدون نموذج). نموذج الوجه `vendor/edge/blaze_face_short_range.onnx` (BlazeFace short-range، 418,465 بايت، sha256 `587fa34c93de9a523e691669d2405671d67faad86e595e9a63c6d3db401f18f4`): المصدر https://huggingface.co/unity/inference-engine-blaze-face (ملف `models/blaze_face_short_range.onnx`)، **ترخيص Apache-2.0 معلن على صفحة الريبو نفسها** (اتأكدت 17 أكتوبر 2026). الأصل: Google MediaPipe BlazeFace (Apache-2.0)، محوّل من TFLite لـONNX بواسطة Unity بـtf2onnx. التحميل اتعمل بإيد المستخدم من الرابط ده، وحجم الملف (418 kB) بيطابق اللي في صفحة الريبو؛ ما قدرتش أقارن البصمة بالمصدر (مفيش نت عندي). نص Apache-2.0 موجود في `vendor/edge/MODEL-LICENSE.txt`. تم استبدال ملف `garavv/blazeface-onnx` (بلا ترخيص معلن) وحذفه من المشروع. المحرك: onnxruntime-web (MIT) نفس اللي بيستخدمه edge-model.js. ملفات Haar بتاعة OpenCV (`haarcascade_frontalface*.xml`) **ما استخدمتهاش**: ترخيصها Intel/BSD مش Apache/MIT.

> `filters.js` (فلاتر المرحلة 2 والاختيار التلقائي): كود أصلي للمشروع، بدون مكتبات أو نماذج خارجية.
| fields.js (مستخرج الحقول) | كود داخلي للمشروع | بدون اعتماد على أي مكتبة؛ تجميع أنماط regex فقط |
| نماذج PP-OCR ONNX (كشف + قراءة: عربي/لاتيني/سيريلي) وقواميس الحروف | Apache-2.0 (PaddleOCR / RapidOCR) | **لسه متنزّلتش.** بتتنزّل بـ `python3 tools/fetch-ocr-models.py --accept-license` وبعدها السكريبت بيطبع صفوف جاهزة (الرابط + sha256) تتلصق هنا، وبيحفظ نص الترخيص في `licenses/PaddleOCR-LICENSE.txt` |
| ocr-models.js (منزّل النماذج) | كود داخلي للمشروع | بدون مكتبات؛ بيجيب ملفات النماذج الموثّقة فوق بطلبات GET وبيخزّنها في كاش vendor |
