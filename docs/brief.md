# Бриф проекта (контекст для агента)

## Что и зачем
Выпускной «Завод нейроагентов», 10 июля 2026.
Олегу нужно презентовать проекты, сделанные его AI-агентом за ~7,5 недель.
Формат: **одностраничный сайт-портфолио**, показ **локально** со своего экрана.
Герои — сами проекты и бизнес-результаты; агент на втором плане как инструмент.
Полный каталог всех проектов, флагманы — крупно.

## Дизайн (по просьбе Олега)
- Референс styles.refero.design: **Notion × Apple** (основной экран) + **Vercel**-типографика
  (технические блоки).
- Скилл ui-ux-pro-max: палитра #11 Portfolio/Personal (монохром + синий #2563EB), шрифты
  Inter (#5 Minimal Swiss) + JetBrains Mono (#9 Developer Mono).
- Сочные градиенты, градиентные кнопки, анимация (reveal, count-up, hover). Уважать reduced-motion.

## Источники цифр (всё реальное, не выдумано)
- **113,8 млн ₽** — портфель ключевых клиентов Линдэйли, T1 2026, +7,8% г/г, +1,2% к прогнозу.
  Источник: `~/projects/kp-carpets/rech_T1_2026.md`.
- **~54 лида, 13 директоров, MemoryMax=1.2G, @parsing_lpr_bot** — `~/projects/lpr-parser-samara/_progress.md`.
- **2 платежа ЮKassa, «ЗАПУЩЕН ✓»** — `~/projects/Shura_flo/PROJECT.md`.
- **ii-agent-lindaily** (RAG/MCP/Docker/обезличивание, ветки main + codex/lindaily-v1,
  Python 307 КБ + Shell 43 КБ) — GitHub `sidoleg90/ii-agent-lindaily` (приватный) + README.
- **kam-portfolio-agent, ai-agent-army-guide, hermes-personal-agent, portfolio-lindeli,
  samara-corporate-2026, ulyanovsk-trip** — репозитории GitHub `sidoleg90`.
- **1 014 897 ₽** (рычаг выкупа) — `~/projects/zashchitnye-pokrytiya/`.
- **51 партнёр Казани, 25 AI-кейсов, скрипты 77 КБ** — `~/projects/shura-flo/`.
- Живые страницы (проверены, работают): lindaily-guide, kovry-calculator, kovry-plan, shuraflo.ru.

## Ключевые решения
- Показ локальный → реальные цифры и имена оставлены как есть, публично НЕ выкладываем.
- Данные вынесены в `data/projects.json` (data-driven) — чтобы легко пересобрать/поправить.
- `data/projects.js` генерится из json (для загрузки под `file://` без CORS).
- QR — локальные SVG (segno), без внешних запросов.
- Итоговый счётчик проектов: 4 флагмана + 23 в каталоге = 27 (в hero округлено до «~25»,
  можно поправить в `data/projects.json → stats_hero`).

## Как доставили
Файл открывается локально; можно отправить Олегу в Telegram тегом `[ФАЙЛ: …index.html]`
(но HTML тянет `app.js`/`data`/`assets` — для переноса отдавать всю папку целиком, напр. zip).
