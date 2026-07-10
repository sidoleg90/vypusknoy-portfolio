#!/usr/bin/env python3
"""Скриншоты для портфолио.
1) Превью живых сайтов флагманов → assets/shot-*.png (коммитим)
2) Проверочные скрины самого портфолио (desktop+mobile) → в OUT_DIR
Запуск через venv с playwright:
  /home/agent/projects/lpr-parser-samara/venv/bin/python tools/shots.py [out_dir]
"""
import os, sys
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS = os.path.join(ROOT, "assets")
OUT = sys.argv[1] if len(sys.argv) > 1 else ASSETS
os.makedirs(OUT, exist_ok=True)

THUMBS = [
    ("https://sidoleg90.github.io/lindaily-guide/", "shot-lindaily-guide.png"),
    ("https://sidoleg90.github.io/kovry-calculator/", "shot-kovry-calculator.png"),
    ("https://shuraflo.ru", "shot-shuraflo.png"),
    ("https://sidoleg90.github.io/kovry-plan/", "shot-kovry-plan.png"),
]

CHROME = os.environ.get("CHROME_BIN", "/root/.cache/ms-playwright/chromium-1224/chrome-linux64/chrome")

with sync_playwright() as p:
    b = p.chromium.launch(executable_path=CHROME, args=["--no-sandbox"])
    # --- превью живых сайтов ---
    pg = b.new_page(viewport={"width": 1280, "height": 800}, device_scale_factor=2)
    for url, name in THUMBS:
        try:
            pg.goto(url, wait_until="networkidle", timeout=30000)
            pg.wait_for_timeout(1200)
            pg.screenshot(path=os.path.join(ASSETS, name), clip={"x": 0, "y": 0, "width": 1280, "height": 800})
            print("thumb OK:", name)
        except Exception as e:
            print("thumb FAIL:", name, "->", repr(e)[:120])
    pg.close()

    # --- проверка самого портфолио ---
    local = "file://" + os.path.join(ROOT, "index.html")
    d = b.new_page(viewport={"width": 1440, "height": 1000}, device_scale_factor=1)
    d.goto(local, wait_until="load", timeout=20000)
    d.wait_for_timeout(1500)
    # финальное состояние: показать все reveal и досчитать числа
    d.evaluate("document.querySelectorAll('.reveal').forEach(e=>e.classList.add('in'))")
    d.evaluate("document.querySelectorAll('[data-count]').forEach(e=>{e.textContent=(e.getAttribute('data-prefix')||'')+parseFloat(e.getAttribute('data-count')).toFixed(+e.getAttribute('data-dec')||0).replace('.',',')+(e.getAttribute('data-suffix')||'')})")
    d.wait_for_timeout(700)
    d.screenshot(path=os.path.join(OUT, "portfolio-desktop.png"), full_page=True)
    ow = d.evaluate("document.documentElement.scrollWidth"); iw = d.evaluate("window.innerWidth")
    print("desktop scrollW=%s innerW=%s overflow=%s" % (ow, iw, ow > iw + 1))
    d.close()

    m = b.new_page(viewport={"width": 390, "height": 844}, device_scale_factor=2)
    m.goto(local, wait_until="load", timeout=20000)
    m.wait_for_timeout(1300)
    m.evaluate("document.querySelectorAll('.reveal').forEach(e=>e.classList.add('in'))")
    m.evaluate("document.querySelectorAll('[data-count]').forEach(e=>{e.textContent=(e.getAttribute('data-prefix')||'')+parseFloat(e.getAttribute('data-count')).toFixed(+e.getAttribute('data-dec')||0).replace('.',',')+(e.getAttribute('data-suffix')||'')})")
    m.wait_for_timeout(600)
    m.screenshot(path=os.path.join(OUT, "portfolio-mobile.png"), full_page=True)
    ow = m.evaluate("document.documentElement.scrollWidth"); iw = m.evaluate("window.innerWidth")
    print("mobile scrollW=%s innerW=%s overflow=%s" % (ow, iw, ow > iw + 1))
    m.close()
    b.close()
print("done. OUT =", OUT)
