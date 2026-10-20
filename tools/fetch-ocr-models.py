#!/usr/bin/env python3
"""
fetch-ocr-models.py — تنزيل نماذج OCR بصيغة ONNX (PP-OCR عبر RapidOCR، ترخيص Apache-2.0) لمجلد vendor/ocr.

بيشتغل على أي جهاز فيه إنترنت وبايثون 3 (من غير مكتبات إضافية). شغّله من جذر المشروع:

    python3 tools/fetch-ocr-models.py --list
    python3 tools/fetch-ocr-models.py --accept-license                 # الكشف + عربي + لاتيني + سيريلي
    python3 tools/fetch-ocr-models.py --accept-license --scripts arabic latin

الاختيارات:
    --scripts S [S ...]   الكتابات المطلوبة: arabic latin cyrillic (الافتراضي: الكل). نموذج الكشف (det) بيتنزّل دايمًا.
    --url ID=URL          استبدال رابط عنصر (ID من --list) لو الرابط الافتراضي اتغيّر.
    --license-url URL     رابط نص الترخيص (الافتراضي: LICENSE بتاع PaddleOCR).
    --accept-license      لازم تكتبه بعد ما تقرا نص الترخيص اللي اتطبع.
    --out DIR             مجلد الإخراج (الافتراضي vendor/ocr).
    --list                اطبع العناصر والروابط وقف.

القواعد: Apache-2.0 أو MIT بس. لو نص الترخيص فيه GPL أو AGPL السكريبت بيرفض.
الروابط مكتوبة من الذاكرة (مش متجرّبة من بيئة التطوير)، فلو واحد رجّع 404 السكريبت بيكمّل الباقي
وفي الآخر بيطبع اللي فشل؛ صلّح الرابط بـ --url وشغّله تاني (اللي اتنزّل قبل كده بيتخطّاه).
"""
import argparse
import hashlib
import json
import os
import re
import sys
import urllib.request
from datetime import date

UA = {"User-Agent": "timaxo-fetch/1.0"}
MAX_MB = 40
HF = "https://huggingface.co/pitapo/rapidocr/resolve/main/"
PD = "https://raw.githubusercontent.com/PaddlePaddle/PaddleOCR/release/2.7/ppocr/utils/dict/"
LICENSE_URL = "https://raw.githubusercontent.com/PaddlePaddle/PaddleOCR/release/2.7/LICENSE"

FORBIDDEN = re.compile(r"GNU (AFFERO )?GENERAL PUBLIC LICENSE|\bAGPL\b|\bGPL-?[23]", re.I)
APACHE = re.compile(r"Apache License[\s\S]{0,40}Version 2\.0", re.I)
MIT = re.compile(r"\bMIT License\b|Permission is hereby granted, free of charge", re.I)

# id -> (الدور، الكتابة، الرابط، اسم الملف، ترخيص المصدر المتوقع)
ITEMS = {
    "det":        ("det",  "any",      HF + "onnx/PP-OCRv4/det/ch_PP-OCRv4_det_infer.onnx",        "det.onnx",            "Apache-2.0"),
    "rec-latin":  ("rec",  "latin",    HF + "onnx/PP-OCRv4/rec/latin_PP-OCRv3_rec_infer.onnx",     "rec-latin.onnx",      "Apache-2.0"),
    "rec-arabic": ("rec",  "arabic",   HF + "onnx/PP-OCRv4/rec/arabic_PP-OCRv4_rec_infer.onnx",    "rec-arabic.onnx",     "Apache-2.0"),
    "rec-cyrillic": ("rec", "cyrillic", HF + "onnx/PP-OCRv4/rec/cyrillic_PP-OCRv3_rec_infer.onnx", "rec-cyrillic.onnx",  "Apache-2.0"),
    "dict-latin": ("dict", "latin",    PD + "latin_dict.txt",                             "dict-latin.txt",      "Apache-2.0"),
    "dict-arabic": ("dict", "arabic",  PD + "arabic_dict.txt",                            "dict-arabic.txt",     "Apache-2.0"),
    "dict-cyrillic": ("dict", "cyrillic", PD + "cyrillic_dict.txt",                       "dict-cyrillic.txt",   "Apache-2.0"),
}


def say(m):
    print(m, flush=True)


def get(url, timeout=60):
    return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=timeout)


def check_license(url):
    say("جاري قراءة الترخيص: " + url)
    txt = get(url).read().decode("utf-8", "replace")
    if FORBIDDEN.search(txt):
        sys.exit("✗ الترخيص فيه GPL/AGPL — مرفوض.")
    kind = "Apache-2.0" if APACHE.search(txt) else "MIT" if MIT.search(txt) else None
    if not kind:
        sys.exit("✗ مش قادر أتأكد إن الترخيص Apache/MIT — راجعه بإيدك.")
    say("— أول سطور الترخيص —\n" + "\n".join(txt.strip().splitlines()[:6]) + "\n————")
    return kind, txt


def sha256(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for b in iter(lambda: f.read(1 << 20), b""):
            h.update(b)
    return h.hexdigest()


def download(url, dest):
    tmp = dest + ".part"
    with get(url, 120) as r, open(tmp, "wb") as f:
        total = int(r.headers.get("Content-Length") or 0)
        if total and total > MAX_MB * 1048576:
            raise RuntimeError("الملف أكبر من %d م.ب" % MAX_MB)
        got = 0
        while True:
            b = r.read(1 << 17)
            if not b:
                break
            f.write(b)
            got += len(b)
            if got > MAX_MB * 1048576:
                raise RuntimeError("الملف أكبر من %d م.ب" % MAX_MB)
        os.replace(tmp, dest)
    return os.path.getsize(dest)


def main():
    ap = argparse.ArgumentParser(description="تنزيل نماذج OCR (PP-OCR ONNX)")
    ap.add_argument("--scripts", nargs="+", default=["arabic", "latin", "cyrillic"], choices=["arabic", "latin", "cyrillic"])
    ap.add_argument("--url", action="append", default=[], metavar="ID=URL")
    ap.add_argument("--license-url", default=LICENSE_URL)
    ap.add_argument("--accept-license", action="store_true")
    ap.add_argument("--out", default="vendor/ocr")
    ap.add_argument("--list", action="store_true")
    a = ap.parse_args()

    items = {k: list(v) for k, v in ITEMS.items()}
    for kv in a.url:
        k, _, u = kv.partition("=")
        if k not in items or not u:
            sys.exit("✗ --url غلط: " + kv)
        items[k][2] = u

    want = [k for k, v in items.items() if v[1] in ("any", *a.scripts)]
    if a.list:
        for k, v in items.items():
            say("%-14s %-5s %-9s %s" % (k, v[0], v[1], v[2]))
        return

    kind, lic = check_license(a.license_url)
    if not a.accept_license:
        sys.exit("اقرا الترخيص فوق، ولو تمام شغّل تاني مع --accept-license")

    os.makedirs(a.out, exist_ok=True)
    os.makedirs("licenses", exist_ok=True)
    with open("licenses/PaddleOCR-LICENSE.txt", "w", encoding="utf-8") as f:
        f.write(lic)

    mpath = os.path.join(a.out, "ocr-models.json")
    meta = json.load(open(mpath, encoding="utf-8")) if os.path.exists(mpath) else {"files": {}}
    failed = []
    for k in want:
        role, scr, url, fn, lc = items[k]
        dest = os.path.join(a.out, fn)
        if os.path.exists(dest) and k in meta["files"]:
            say("• %s: موجود، اتخطّى" % k)
            continue
        say("• تنزيل %s …" % k)
        try:
            size = download(url, dest)
        except Exception as e:  # noqa
            failed.append((k, url, str(e)))
            say("  ✗ فشل: %s" % e)
            continue
        meta["files"][k] = {"file": fn, "role": role, "script": scr, "bytes": size,
                            "sha256": sha256(dest), "source": url, "license": lc,
                            "fetched": date.today().isoformat()}
        say("  ✓ %.1f م.ب" % (size / 1048576))
    meta["license_checked"] = kind
    json.dump(meta, open(mpath, "w", encoding="utf-8"), ensure_ascii=False, indent=1)

    say("\nصفوف جاهزة للصقها في LICENSES.md:")
    for k, v in meta["files"].items():
        say("| OCR %s (%s) | %s | %s — sha256 %s… |" % (k, v["file"], v["license"], v["source"], v["sha256"][:12]))
    if failed:
        say("\nاللي فشل (صلّح الرابط بـ --url ID=URL):")
        for k, u, e in failed:
            say("  %s  %s  (%s)" % (k, u, e))
        sys.exit(1)


if __name__ == "__main__":
    main()
