#!/usr/bin/env python3
"""
fetch-edge-model.py — تنزيل مكتبة onnxruntime-web ونموذج تقسيم المستند (ONNX) لمجلد vendor/edge.

بيشتغل على أي جهاز فيه إنترنت وبايثون 3 (من غير أي مكتبات إضافية). شغّله من جذر المشروع:

    python3 vendor/fetch-edge-model.py

الاختيارات:
    --model-url URL      رابط ملف .onnx مباشر (لو عايز نموذج بعينه)
    --repo OWNER/NAME    مستودع GitHub اللي هنجيب منه النموذج (الافتراضي: DocsaidLab/DocAligner)
    --pick TEXT          اسم (أو جزء من اسم) ملف الـonnx من إصدارات المستودع
    --license-url URL    رابط نص ترخيص النموذج (الافتراضي: LICENSE من المستودع)
    --accept-license     لازم تكتبه بعد ما تقرا الترخيص اللي اتطبع وتتأكد إنه Apache/MIT
    --ort-version X.Y.Z  إصدار onnxruntime-web (الافتراضي مثبّت)
    --out DIR            مجلد الإخراج (الافتراضي vendor/edge)
    --inspect            اطبع مدخلات ومخرجات النموذج (محتاج: pip install onnx)

القواعد: ترخيص Apache-2.0 أو MIT بس. لو النص فيه GPL أو AGPL السكريبت بيرفض.
"""
import argparse
import hashlib
import io
import json
import os
import re
import sys
import tarfile
import time
import urllib.request
from datetime import date

ORT_VERSION = "1.18.0"
DEFAULT_REPO = "DocsaidLab/DocAligner"
UA = {"User-Agent": "timaxo-fetch/1.0"}
MAX_MODEL_MB = 40          # أكبر من كده مش مناسب لموبايل
FORBIDDEN = re.compile(r"GNU (AFFERO )?GENERAL PUBLIC LICENSE|\bAGPL\b|\bGPL-?[23]", re.I)
ALLOWED = [("Apache-2.0", re.compile(r"Apache License[\s\S]{0,40}Version 2\.0", re.I)),
           ("MIT", re.compile(r"\bMIT License\b|Permission is hereby granted, free of charge", re.I))]


def say(msg):
    print(msg, flush=True)


def fetch(url, tries=3):
    """تنزيل بايتات من رابط مع إعادة محاولة. بيدعم file:// للاختبار."""
    last = None
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers=UA)
            with urllib.request.urlopen(req, timeout=60) as r:
                return r.read()
        except Exception as e:  # noqa: BLE001 — أي خطأ شبكة بنعيد المحاولة
            last = e
            time.sleep(1.5 * (i + 1))
    raise SystemExit(f"فشل التنزيل: {url}\n  السبب: {last}")


def sha256(data):
    return hashlib.sha256(data).hexdigest()


def save(path, data):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "wb") as f:
        f.write(data)


# ---------- 1) onnxruntime-web (MIT) ----------
def fetch_ort(version, out, tar_url=None):
    url = tar_url or f"https://registry.npmjs.org/onnxruntime-web/-/onnxruntime-web-{version}.tgz"
    say(f"[1/3] onnxruntime-web {version} ← {url}")
    blob = fetch(url)
    wanted, copied = [], []
    with tarfile.open(fileobj=io.BytesIO(blob), mode="r:gz") as tf:
        members = {m.name: m for m in tf.getmembers() if m.isfile()}
        base = "package/dist/"
        names = sorted(n[len(base):] for n in members if n.startswith(base) and "/" not in n[len(base):])
        # الحزمة الأخف: ort.wasm.min.js (CPU/WASM بس). لو مش موجودة نرجع لـort.min.js
        js = "ort.wasm.min.js" if "ort.wasm.min.js" in names else "ort.min.js"
        wanted.append(js)
        wanted += [n for n in names if n.endswith(".wasm") and "jsep" not in n and "webgpu" not in n and "webnn" not in n]
        for n in wanted:
            data = tf.extractfile(members[base + n]).read()
            save(os.path.join(out, "ort", n), data)
            copied.append({"file": f"ort/{n}", "bytes": len(data), "sha256": sha256(data)})
        lic = tf.extractfile(members["package/LICENSE"]).read().decode("utf-8", "replace")
    save(os.path.join(out, "ort", "LICENSE"), lic.encode())
    if "MIT" not in lic[:400].upper() and "PERMISSION IS HEREBY GRANTED" not in lic.upper():
        raise SystemExit("ترخيص onnxruntime-web مش MIT كما هو متوقع — اتوقفت. راجع ort/LICENSE.")
    for c in copied:
        say(f"    ✓ {c['file']}  ({c['bytes']/1e6:.2f} MB)")
    say("    الترخيص: MIT ✓")
    return {"name": "onnxruntime-web", "version": version, "license": "MIT", "source": url, "files": copied}


# ---------- 2) نموذج ONNX ----------
def pick_model_from_github(repo, pick):
    api = f"https://api.github.com/repos/{repo}/releases?per_page=20"
    say(f"[2/3] بدوّر على ملفات .onnx في إصدارات {repo}")
    releases = json.loads(fetch(api))
    assets = [(a["name"], a["size"], a["browser_download_url"]) for r in releases for a in r.get("assets", [])
              if a["name"].lower().endswith(".onnx")]
    if not assets:
        raise SystemExit("مالقيتش ملفات .onnx في إصدارات المستودع. مرّر الرابط المباشر بـ --model-url")
    for n, s, u in assets:
        say(f"    - {n}  ({s/1e6:.1f} MB)")
    pool = [a for a in assets if pick and pick.lower() in a[0].lower()] if pick else assets
    if not pool:
        raise SystemExit(f"مفيش ملف اسمه فيه '{pick}'.")
    if not pick:   # اختيار افتراضي: fp32 الأصغر (أسهل في المتصفح)، وإلا الأصغر عمومًا
        fp32 = [a for a in pool if "fp32" in a[0].lower()]
        pool = fp32 or pool
    name, size, url = sorted(pool, key=lambda a: a[1])[0]
    say(f"    → اخترت: {name}  (لو عايز غيره استخدم --pick)")
    return name, url


def check_license(text):
    if FORBIDDEN.search(text):
        raise SystemExit("الترخيص فيه GPL/AGPL — ممنوع في المشروع. اتوقفت.")
    for label, rx in ALLOWED:
        if rx.search(text):
            return label
    raise SystemExit("مقدرتش أتعرف على الترخيص (مش Apache-2.0 ولا MIT). راجعه بإيدك قبل ما تكمّل.")


def fetch_model(args, out):
    if args.model_url:
        url, name = args.model_url, os.path.basename(args.model_url.split("?")[0]) or "model.onnx"
        say(f"[2/3] النموذج ← {url}")
    else:
        name, url = pick_model_from_github(args.repo, args.pick)
    lic_url = args.license_url or f"https://raw.githubusercontent.com/{args.repo}/main/LICENSE"
    lic_text = fetch(lic_url).decode("utf-8", "replace")
    label = check_license(lic_text)
    say(f"    نص الترخيص ({lic_url}) — أول 12 سطر:")
    for line in [l for l in lic_text.splitlines() if l.strip()][:12]:
        say("      | " + line.strip()[:110])
    say(f"    اتعرّف عليه: {label}")
    if not args.accept_license:
        raise SystemExit("\nاقرا الترخيص فوق. تأكد كمان إن ترخيص *الأوزان* (صفحة النموذج/README) نفس ترخيص الكود.\n"
                         "لو تمام، شغّل نفس الأمر وضيف --accept-license")
    data = fetch(url)
    mb = len(data) / 1e6
    if mb > MAX_MODEL_MB:
        raise SystemExit(f"النموذج {mb:.0f} MB — أكبر من الحد ({MAX_MODEL_MB} MB) للموبايل.")
    if data[:1] not in (b"\x08", b"\x0a"):      # ملفات ONNX (protobuf) بتبدأ بحقل ir_version أو producer
        raise SystemExit("الملف اللي نزل شكله مش ONNX (ممكن صفحة خطأ). راجع الرابط.")
    save(os.path.join(out, "model.onnx"), data)
    save(os.path.join(out, "MODEL-LICENSE.txt"), lic_text.encode())
    say(f"    ✓ model.onnx  ({mb:.2f} MB)  sha256={sha256(data)[:16]}…")
    return {"name": name, "license": label, "source": url, "license_source": lic_url,
            "bytes": len(data), "sha256": sha256(data)}


# ---------- 3) فحص النموذج + ملخصات ----------
def inspect_model(path):
    try:
        import onnx  # noqa: PLC0415
    except ImportError:
        return "مفيش مكتبة onnx. نزّلها بـ: pip install onnx  وبعدين أعد التشغيل مع --inspect"
    m = onnx.load(path)

    def shape(v):
        t = v.type.tensor_type
        return [d.dim_value or d.dim_param or "?" for d in t.shape.dim], onnx.TensorProto.DataType.Name(t.elem_type)
    lines = [f"opset: {[o.version for o in m.opset_import]}", f"producer: {m.producer_name} {m.producer_version}"]
    inits = {i.name for i in m.graph.initializer}
    for v in m.graph.input:
        if v.name not in inits:
            lines.append(f"input  {v.name}: {shape(v)}")
    for v in m.graph.output:
        lines.append(f"output {v.name}: {shape(v)}")
    return "\n".join(lines)


def main():
    ap = argparse.ArgumentParser(description="تنزيل onnxruntime-web ونموذج الحواف إلى vendor/edge")
    ap.add_argument("--model-url")
    ap.add_argument("--repo", default=DEFAULT_REPO)
    ap.add_argument("--pick")
    ap.add_argument("--license-url")
    ap.add_argument("--accept-license", action="store_true")
    ap.add_argument("--ort-version", default=ORT_VERSION)
    ap.add_argument("--ort-tar-url", help="للاختبار: رابط بديل لحزمة npm")
    ap.add_argument("--out", default=os.path.join("vendor", "edge"))
    ap.add_argument("--inspect", action="store_true")
    ap.add_argument("--skip-ort", action="store_true")
    args = ap.parse_args()

    out = args.out
    manifest = {"fetched": date.today().isoformat()}
    if not args.skip_ort:
        manifest["runtime"] = fetch_ort(args.ort_version, out, args.ort_tar_url)
    manifest["model"] = fetch_model(args, out)

    say("[3/3] ملخص الفحص")
    info = inspect_model(os.path.join(out, "model.onnx")) if args.inspect else "(شغّل مع --inspect عشان تطلّع مدخلات ومخرجات النموذج)"
    say("    " + info.replace("\n", "\n    "))
    if args.inspect:
        save(os.path.join(out, "model-info.txt"), info.encode())

    save(os.path.join(out, "MANIFEST.json"), json.dumps(manifest, ensure_ascii=False, indent=1).encode())
    m, r = manifest["model"], manifest.get("runtime")
    rows = []
    if r:
        rows.append(f"| onnxruntime-web {r['version']} | MIT | vendor/edge/ort — يتنزّل بـ vendor/fetch-edge-model.py |")
    rows.append(f"| نموذج حواف المستند ({m['name']}) | {m['license']} | vendor/edge/model.onnx — المصدر: {m['source']} — sha256 {m['sha256'][:16]}… |")
    save(os.path.join(out, "LICENSES-snippet.md"), ("\n".join(rows) + "\n").encode())
    say("\nخلصنا ✓  الصق الأسطر دي في LICENSES.md (محفوظة كمان في " + os.path.join(out, "LICENSES-snippet.md") + "):")
    say("\n".join(rows))
    say("\nابعتلي الملفات: MANIFEST.json و model-info.txt (لو شغّلت --inspect) — ومش لازم تبعت model.onnx نفسه.")


if __name__ == "__main__":
    sys.exit(main())
