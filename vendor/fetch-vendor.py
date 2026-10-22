#!/usr/bin/env python3
"""fetch-vendor.py — ينزّل ملفات vendor المطلوبة (بدون مكتبات إضافية). شغّله من جذر المشروع على جهاز فيه نت:
    python3 vendor/fetch-vendor.py
بينزّل بإصدارات مثبّتة: onnxruntime-web 1.18.0 (vendor/edge/ort) و tesseract.js 5.1.1 + core + بيانات ara/eng السريعة.
بيطبع حجم وSHA-256 لكل ملف ويكتب vendor/MANIFEST-vendor.json. الملف اللي مانزلش بيتطبع FAIL."""
import hashlib, json, os, sys, urllib.request
J = "https://cdn.jsdelivr.net/npm/"
ORT = J + "onnxruntime-web@1.18.0/dist/"
TES = J + "tesseract.js@5.1.1/dist/"
COR = J + "tesseract.js-core@5.1.1/"
TD = "https://cdn.jsdelivr.net/gh/naptha/tessdata@gh-pages/4.0.0_fast/"
FILES = [(ORT + f, "vendor/edge/ort/" + f) for f in ("ort.wasm.min.js", "ort-wasm-simd.wasm", "ort-wasm-simd-threaded.wasm")]
FILES += [(TES + "tesseract.min.js", "vendor/tesseract/tesseract.min.js"), (TES + "worker.min.js", "vendor/tesseract/worker.min.js")]
FILES += [(COR + f, "vendor/tesseract-core/" + f) for f in ("tesseract-core.wasm.js", "tesseract-core-simd.wasm.js", "tesseract-core-lstm.wasm.js", "tesseract-core-simd-lstm.wasm.js")]
FILES += [(TD + l + ".traineddata.gz", "vendor/tessdata/fast/" + l + ".traineddata.gz") for l in ("ara", "eng")]
man, bad = {}, 0
for url, dst in FILES:
    try:
        d = urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "timaxo-fetch/2"}), timeout=120).read()
        if len(d) < 5000 or d[:9].lower().startswith(b"<!doctype"): raise ValueError("ملف مش سليم (%d بايت)" % len(d))
        os.makedirs(os.path.dirname(dst), exist_ok=True); open(dst, "wb").write(d)
        man[dst] = {"url": url, "bytes": len(d), "sha256": hashlib.sha256(d).hexdigest()}
        print("OK  ", dst, len(d))
    except Exception as e:
        bad += 1; print("FAIL", dst, e)
json.dump(man, open("vendor/MANIFEST-vendor.json", "w"), indent=1)
sys.exit(1 if bad else 0)
