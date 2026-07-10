#!/usr/bin/env python3
"""Генерация QR-кодов (SVG) из data/projects.json.
Собирает все ссылки с "qr": true во флагманах + все live_demos,
пишет assets/qr-<slug>.svg. Слаг совпадает с функцией slug() в app.js.
Запуск: python3 tools/gen_qr.py   (нужен segno: pip install --user segno)
"""
import json, re, os, sys
try:
    import segno
except ImportError:
    sys.exit("Нет segno. Установи: pip install --user --break-system-packages segno")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = json.load(open(os.path.join(ROOT, "data", "projects.json"), encoding="utf-8"))
ASSETS = os.path.join(ROOT, "assets")
os.makedirs(ASSETS, exist_ok=True)

def slug(url:str)->str:
    s = re.sub(r'^https?://', '', url)
    s = re.sub(r'[^a-zA-Z0-9]+', '-', s).strip('-').lower()
    return s

urls = set()
for f in DATA.get("flagships", []):
    for l in f.get("links", []):
        if l.get("qr"):
            urls.add(l["url"])
for d in DATA.get("live_demos", []):
    urls.add(d["url"])
for c in (DATA.get("contact") or {}).get("channels", []):
    urls.add(c["url"])

count = 0
for url in sorted(urls):
    qr = segno.make(url, error='m')
    path = os.path.join(ASSETS, f"qr-{slug(url)}.svg")
    qr.save(path, kind='svg', scale=1, border=2, dark='#18181B', light=None)
    count += 1
    print("QR:", os.path.basename(path), "→", url)

print(f"\nГотово: {count} QR-кодов в assets/")
