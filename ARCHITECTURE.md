# خريطة الكود (ARCHITECTURE)

> مولّدة تلقائيًا من علامات `/* ===== … ===== */` في `index.html` (v119). الأرقام أرقام أسطر تقريبية.

## الملفات

- `LICENSES.md` — تراخيص المكتبات والنماذج
- `PROGRESS.md` — سجل الشرائح (done/remaining/next)
- `assistant-face.js` — كشف الوجه للمساعد
- `assistant.js` — مساعد الاقتراحات
- `edge-hybrid.js` — ترتيب مرشّحات الحواف
- `edge-learn.js` — التعلّم على الجهاز من تعديلات المستخدم
- `edge-model.js` — نموذج كشف الحواف
- `filters.js` — فلاتر الصورة
- `index.html` — التطبيق كله (HTML + CSS + JS) — ملف واحد
- `manifest.webmanifest` — ملف الـPWA
- `sw.js` — Service Worker (الأوفلاين + CACHE)

## أقسام index.html (بالترتيب)

- سطر 237: Timaxo Scan 2.0 theme: matches the app icon (royal navy, electric blue, cyan scan beam)
- سطر 280: Motion + icon polish
- سطر 301: Library
- سطر 454: Timaxo 3.0 "Neon Scan" : aurora, glass, scan-beam motion
- سطر 858: Timaxo Neon UI (v104): ستايل التصميم الجديد
- سطر 931: v105
- سطر 978: v106
- سطر 995: Timaxo v107: توحيد تصميم الشاشة الرئيسية (دارك/ليت/عربي/إنجليزي)
- سطر 1928: AI (الكشف الذكي + التعلّم من تعديلاتك): شغّال افتراضيًا، مفتاح واحد (tx_edge2: '0' = متوقف). موجود جوه الكاميرا وجوه «المزيد»
- سطر 2491: Documents library, backup, export stamps
- سطر 2531: v17: Smart enhance chip + estimated export size
- سطر 2556: v16: doc search (name + OCR text), 30-day trash, storage meter
- سطر 2626: v2: content eraser, zoom/pan
- سطر 2663: v3: text enhance, signature, PIN lock, error log
- سطر 2830: v4: live camera with auto-detect + auto-capture
- سطر 3258: v6: OCR (full page + region), text replace
- سطر 3303: v56: smarter OCR engine (image preparation + multi-pass + quality models) and a new extraction sheet
- سطر 3442: v57: merge passes + tables (detect > editable grid > copy / Excel / Word)
- سطر 3560: end v57 helpers
- سطر 3561: v58: live text (select text right on the image, like Live Text)
- سطر 3816: v21: background OCR indexing (phase 1.1)
- سطر 3851: 3.5ب: ترتيب الصفحات بالأرقام. بيستخدم فهرس النص الموجود (OI) ويقرا بس الصفحات اللي لسه ما اتفهرستش؛ بيطبّق بس لو كل الصفحات مرقّمة وبدون تكرار، وفيه تراجع
- سطر 3886: v22: tags (work as folders) + automatic category / name
- سطر 3932: v8: grouped tools, theme toggle
- سطر 3957: v9: collapsible bottom dock
- سطر 3963: v11: tool name on dock handle, auto-minimize after picking a tool
- سطر 3968: v20.1: features moved inside the app scope
- سطر 4018: v19.2: system Back = in-app back (one history entry per open layer)
- سطر 4068: v20: target size • card & ID-photo layouts • invoice→CSV
- سطر 4281: v19: home = document cards (item 16)
- سطر 4376: v21: Book mode — split an open-book spread into two pages
- سطر 4430: PWA + productivity layer
- سطر 4460: App-wide feedback: synthesized sounds + vibration (shares tx_snd with the camera; tx_hap = vibration)
- سطر 4591: v45: "What can Timaxo do?" guide — small button in the home header + searchable bottom sheet
- سطر 4762: v49: elastic pull-to-switch theme button + spinning globe language button next to the logo
- سطر 4890: v51: keep every label in the current language (fixes mixed Arabic/English after switching or restarting)
- سطر 4933: v60: fix globe language badge visibility, relabel stuck English buttons, distinct icons for Extract text / Split book
- سطر 4991: Timaxo v108: إصلاح التغطية + دارك حقيقي + قوائم بنفس الستايل + سحب الثيم
- سطر 5053: Timaxo v109
- سطر 5208: Timaxo v111: علامة + زي المرجع + قايمة أيقونات بتطلع من العدسة
- سطر 5268: Timaxo v112: إصلاح اتجاه القايمة + اللاج + علامة + مدمجة
- سطر 5296: Timaxo v114: قايمة العدسة أسرع + إخفاء QR خارج الرئيسية
- سطر 5362: v116: الفصحى — طبقة تحويل من العامية المصرية للفصحى (بتشتغل على النص الظاهر بس، والأصل بيتحفظ ويرجع)

## أحجام الكتل
- CSS الرئيسي ≈ 82KB، كتل CSS صغيرة تانية ≈ 50KB، ≈ 298KB خطوط/صور مضمّنة (data URI) — مش تكرار.
- أكبر سكريبت ≈ 350KB. فحص التكرار الحرفي للقواعد: 3 قواعد بس (95 بايت) فمفيش مكسب من دمج الـCSS.

## قواعد الشغل
- تعديل بـ`str_replace` على شرائح صغيرة، وبعد كل شريحة: PROGRESS.md + رفع `CACHE` في sw.js.
- اللغات: `lang` = ar|en للمنطق، والفصحى = `TXMSA` (قاموس `PHR` + `TOK`). أي نص عامي جديد يتضاف في `PHR`.
- الرجوع بالسحب: وحدة `v19.2` (+ v119): entry واحدة لكل لمسة + spare.
