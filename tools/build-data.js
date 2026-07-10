/* Генерирует data/projects.js из data/projects.json.
   projects.js грузит страница тегом <script> (работает под file://, где fetch JSON запрещён).
   Запуск: node tools/build-data.js   (или npm run build-data) */
const fs = require("fs");
const path = require("path");

const root = path.dirname(__dirname);
const json = path.join(root, "data", "projects.json");
const out = path.join(root, "data", "projects.js");

const data = JSON.parse(fs.readFileSync(json, "utf8"));
const header = "/* СГЕНЕРИРОВАНО из projects.json — не редактируй вручную. Правь projects.json и запусти: npm run build-data */\n";
fs.writeFileSync(out, header + "window.PORTFOLIO = " + JSON.stringify(data, null, 2) + ";\n");
console.log("build-data: projects.js обновлён (" + fs.statSync(out).size + " байт)");
