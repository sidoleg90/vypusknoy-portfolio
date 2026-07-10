# AGENTS.md — инструкция для AI-агента (Codex / Claude)

Это выпускной сайт-портфолио Олега: одностраничный прокручиваемый сайт с проектами,
сделанными персональным AI-агентом за 7,5 недель.
**Живая страница: https://sidoleg90.github.io/vypusknoy-portfolio/** (GitHub Pages,
branch `main` / root — включено владельцем 10.07.2026, репо публичный по его решению).
Любой push в `main` автоматически обновляет живой сайт.

Если тебя попросили «пересобрать / поправить / улучшить» — читай этот файл целиком, дальше всё есть.

## Две версии дизайна (v1 и V2)
- **v1** — корень репо (`index.html`, `app.js`, `data/`, `assets/`). Живёт на
  `…github.io/vypusknoy-portfolio/`. НЕ трогать без явной просьбы — сохраняется как есть.
- **V2** — папка `v2/` (полная копия + редизайн). Живёт на `…/vypusknoy-portfolio/v2/`.
  Отличия V2 (только визуал, контент/данные те же): редакторский serif-заголовок **Playfair
  Display** (токен `--display`) для крупных заголовков и чисел; тёплая искра `--spark` (амбер) —
  призрачные номера секций 01–05, подчёркивания в nav; градиент смещён с фиолета к индиго
  (`--g2:#6366F1`, `--g3:#0EA5E9`) — уход от «AI-клише»; зерно-текстура (`body::before` noise);
  хайрлайны + крупные номера в шапках секций; точечная сетка и staggered-загрузка в hero;
  плашка «V2» в nav/футере. Токены — в `v2/index.html :root`. Правки контента v2 — в
  `v2/data/projects.json` → `cd v2 && npm run build-data`.
- Обе версии автодеплоятся с ветки `main` (Pages) при пуше.

## TL;DR как запустить и посмотреть
```bash
# просто открой index.html в браузере (работает по file://)
xdg-open index.html          # Linux
open index.html              # macOS
# или локальный сервер:
npm run serve                # → http://localhost:8123
```

## Архитектура (важно)
- **Единый источник правды — `data/projects.json`.** Весь контент (проекты, цифры, ссылки) там.
- `data/projects.js` — это `window.PORTFOLIO = {…}`, **сгенерирован** из JSON. Его грузит страница
  тегом `<script>` (так работает под `file://`, где `fetch()` локального JSON запрещён браузером).
- `app.js` — рендерит все секции из `window.PORTFOLIO` + анимации (reveal, count-up) + подстановка QR.
- `index.html` — каркас + все дизайн-токены в `:root` (CSS-переменные) + пустые контейнеры с id.
- `assets/` — QR-коды (`qr-*.svg`) и превью-скриншоты флагманов (`shot-*.png`) + баннер.

### Поток правок контента
1. Правишь **`data/projects.json`** (только его).
2. Регенеришь JS: `npm run build-data` (или `node -e` из package.json).
3. Если менял ссылки с `"qr": true` или `live_demos` — регенери QR: `python3 tools/gen_qr.py`
   (нужен segno: `pip install --user --break-system-packages segno`).
4. Обнови превью (если надо): см. «Скриншоты».

### Модель данных `data/projects.json`
- `meta` — владелец, курс, дата, период.
- `stats_hero[]` — плашки в hero: `{value, label}`.
- `stats_numbers[]` — блок «Итоги в цифрах» (count-up): `{value(число), prefix, suffix, decimals, label, sub}`.
- `statuses{}` — словарь статусов: ключ → `{label, dot}`. Ключи: `prod|done|wip|research`.
- `flagships[]` — крупные кейсы: `{id, title, tagline, status, client, problem, did,
  engineering[], stack[], result, links[{label,url,primary,qr}], repo, screenshot}`.
- `catalog[]` — группы каталога: `{category, items[{id,title,status,summary,stack[],repo,url?,screenshot?}]}`.
- `how_it_works` — тёмный блок «за кадром»: `{title, intro, points[{k,v}]}`.
- `live_demos[]` — секция QR: `{label, url, note}`.
- `contact` — финальный CTA-блок с портретом: `{eyebrow, title, subtitle, body, result, image,
  image_alt, channels[{id, label, url, button, primary}]}`. QR для `channels` генерит `gen_qr.py`.
  На десктопе панель QR оверлеем поверх фото, на ≤900px — стеком под кнопками (grid-areas).

Статусы (`status`) управляют цветом точки/бейджа: prod=зелёный, done=серый, wip=янтарный, research=фиолетовый.

## Дизайн-система (правь в `index.html` → `:root`)
- База: **Notion×Apple** (тёплая бумага `--paper:#FBFAF8`, много воздуха) + **Vercel**-моно в
  технических блоках (`--mono` JetBrains Mono, тёмный фон `#0E0E11`).
- Акцент/градиент: `--accent:#2563EB`; `--grad` = синий→фиолетовый→бирюзовый (`#2563EB→#7C3AED→#06B6D4`).
  Используется в hero-меше, градиентном тексте, кнопках `.btn-grad`, рамках флагманов при hover.
- Шрифты: Inter (текст) + JetBrains Mono (моно). Подключены с Google Fonts + системный fallback.
- Анимации уважают `prefers-reduced-motion` (тогда всё статично).
- Палитра/шрифты выбраны по скиллу ui-ux-pro-max (палитра #11 Portfolio/Personal, пары #5+#9).

## QR и скриншоты
- **QR:** `python3 tools/gen_qr.py` → `assets/qr-<slug>.svg`. Слаг URL считается ОДИНАКОВО в
  `tools/gen_qr.py` (Python) и `app.js` (функция `slug()`) — если меняешь один, поменяй оба.
- **Скриншоты флагманов и проверка вёрстки:**
  ```bash
  /home/agent/projects/lpr-parser-samara/venv/bin/python tools/shots.py [out_dir]
  ```
  Пишет `assets/shot-*.png` (превью живых сайтов) и `portfolio-desktop.png` / `portfolio-mobile.png`
  (проверка, по умолчанию в `assets/` — передай out_dir, чтобы не мусорить).
  Требует Chromium; путь задаётся `CHROME_BIN` (по умолчанию из ms-playwright).

## Приватность — статус
Изначально показ планировался локальным из-за внутренних цифр Линдэйли (портфель 113,8 млн ₽,
имена клиентов, договорный рычаг 1 014 897 ₽). **10.07.2026 владелец осознанно принял решение
опубликовать как есть** (сам перевёл репо в public и включил Pages). Если владелец попросит
«обезличить» — сокращай: суммы → «план выполнен, +7,8% г/г», имена должников → отрасли,
договорные суммы — убрать; править в `data/projects.json`.

## Ожидаемые файлы скриншотов ЛПР (Олег пришлёт руками)
Флагман «Парсер ЛПР» ждёт 4 файла в `assets/` (пока их нет — показывается плейсхолдер, галерея скрыта):
- `shot-lpr-excel.png` — сводная таблица «Обзвон» (главное превью, `screenshot`).
- `shot-lpr-chat.png` — диалог с ботом (LLM Qwen, погода/web_search).
- `shot-lpr-cities.png` — меню выбора города (18 городов).
- `shot-lpr-result.png` — «Поиск завершён» + выгрузка Excel.
Как положишь файлы с этими именами — всё появится само (обработчик в app.js подхватит). Имена
можно поменять в `data/projects.json` → flagship `lpr-parser-samara` (`screenshot` и `gallery[].src`).

## Что можно улучшить (необязательно)
- Тёмная тема (токены готовы к расширению).
- Ужать PNG-превью (сейчас 2560×1600 — можно 1280×800).

## Полный контекст задачи
См. `docs/brief.md` — исходный бриф и источники всех цифр.
