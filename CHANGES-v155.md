# v155 (من v154)
- _headers جديد (CSP في وضع Report-Only + nosniff + Referrer-Policy + Permissions-Policy). غيّر الاسم لـ Content-Security-Policy بعد ما الـConsole يبقى نضيف.
- شيلنا Google Fonts (الخطوط الباقية محلية). --fb/--fd بقت Inter ثم Cairo.
- Tesseract: شيلنا unpkg وcdnjs، وjsDelivr بقت مثبّتة على 5.1.1 (احتياطي لو vendor مش موجود).
- esc() بقت بتهرّب علامات الاقتباس كمان.
- سياسة الخصوصية (privacy.html والقايمة جوه التطبيق): بريد التواصل، OCR المحلي، الترجمة الأونلاين بموافقة، الاستضافة، حدود القفل بالرقم السري.
- vendor/vendor/edge اتنقل لـ vendor/edge (المسار اللي بيدوّر عليه الكود).
- vendor/fetch-vendor.py جديد (الـ .sh القديم كان فاضي). لازم يتشغّل ويتعمل commit لـ vendor/.
- .assetsignore: test-edges.html وtools والملفات الداخلية ما تتنشرش.
- sw.js وAPPV = 155.
