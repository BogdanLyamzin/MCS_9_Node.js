const pptxgen = require('pptxgenjs');

const pptx = new pptxgen();
pptx.layout = 'LAYOUT_WIDE';
pptx.author = 'GoIT';
pptx.subject = 'Розгортання Node.js застосунків у production';
pptx.title = 'Розгортання Node.js застосунків';
pptx.company = 'GoIT';
pptx.lang = 'uk-UA';
pptx.theme = {
  headFontFace: 'Aptos Display',
  bodyFontFace: 'Aptos',
  lang: 'uk-UA',
};
pptx.defineLayout({ name: 'CUSTOM_WIDE', width: 13.333, height: 7.5 });
pptx.layout = 'CUSTOM_WIDE';

const C = {
  bg: '0B1020',
  bg2: '10182B',
  panel: '151E33',
  panel2: '1C2944',
  text: 'F4F7FC',
  muted: 'A9B7CF',
  cyan: '42D7E8',
  blue: '5E8CFF',
  green: '55D6A5',
  amber: 'FFB84D',
  red: 'FF6B7A',
  purple: 'A67CFF',
  white: 'FFFFFF',
  line: '2C3C5E',
  dark: '07101D',
};

const W = 13.333;
const H = 7.5;
const slides = [];

function rect(slide, x, y, w, h, fill, radius = 0.12, line = fill) {
  slide.addShape(radius ? pptx.ShapeType.roundRect : pptx.ShapeType.rect, {
    x, y, w, h,
    rectRadius: radius,
    fill: { color: fill },
    line: { color: line, transparency: line === fill ? 100 : 0, width: 1 },
  });
}

function line(slide, x, y, w, h, color = C.line, width = 1.5, beginArrowType, endArrowType) {
  slide.addShape(pptx.ShapeType.line, {
    x, y, w, h,
    line: { color, width, beginArrowType, endArrowType },
  });
}

function text(slide, value, x, y, w, h, options = {}) {
  slide.addText(value, {
    x, y, w, h,
    fontFace: options.fontFace || 'Aptos',
    fontSize: options.fontSize || 18,
    color: options.color || C.text,
    bold: options.bold || false,
    italic: options.italic || false,
    align: options.align || 'left',
    valign: options.valign || 'mid',
    margin: options.margin === undefined ? 0 : options.margin,
    breakLine: false,
    fit: 'shrink',
    paraSpaceAfterPt: options.paraSpaceAfterPt || 0,
    bullet: options.bullet,
    isTextBox: true,
  });
}

function richText(slide, runs, x, y, w, h, options = {}) {
  slide.addText(runs, {
    x, y, w, h,
    fontFace: 'Aptos',
    fontSize: options.fontSize || 18,
    color: options.color || C.text,
    valign: options.valign || 'mid',
    margin: options.margin === undefined ? 0 : options.margin,
    fit: 'shrink',
    breakLine: false,
  });
}

function pill(slide, label, x, y, w, color, textColor = C.dark) {
  rect(slide, x, y, w, 0.32, color, 0.16);
  text(slide, label.toUpperCase(), x, y + 0.01, w, 0.27, {
    fontSize: 10.5, color: textColor, bold: true, align: 'center',
  });
}

function addBase(slide, section, n) {
  slide.background = { color: C.bg };
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: W, h: 0.08,
    fill: { color: C.cyan }, line: { color: C.cyan, transparency: 100 },
  });
  if (section) pill(slide, section, 0.58, 0.3, Math.max(1.25, section.length * 0.105), C.panel2, C.cyan);
  line(slide, 0.58, 7.08, 12.15, 0, C.line, 0.8);
  text(slide, 'NODE.JS • DEPLOYMENT', 0.58, 7.13, 2.8, 0.18, { fontSize: 9, color: C.muted, bold: true });
  text(slide, String(n).padStart(2, '0'), 12.2, 7.1, 0.5, 0.22, { fontSize: 10, color: C.muted, bold: true, align: 'right' });
}

function addSlide(section) {
  const slide = pptx.addSlide();
  slides.push(slide);
  addBase(slide, section, slides.length);
  return slide;
}

function titleBlock(slide, title, subtitle, titleSize = 27) {
  text(slide, title, 0.58, 0.78, 11.9, 0.67, { fontSize: titleSize, bold: true });
  if (subtitle) text(slide, subtitle, 0.58, 1.48, 11.6, 0.38, { fontSize: 14, color: C.muted });
}

function card(slide, { x, y, w, h, title, body, color = C.cyan, index, titleSize = 17, bodySize = 13 }) {
  rect(slide, x, y, w, h, C.panel, 0.16, C.line);
  slide.addShape(pptx.ShapeType.rect, {
    x, y, w: 0.06, h,
    fill: { color }, line: { color, transparency: 100 },
  });
  if (index !== undefined) {
    rect(slide, x + 0.22, y + 0.23, 0.45, 0.45, color, 0.22);
    text(slide, String(index), x + 0.22, y + 0.23, 0.45, 0.43, { fontSize: 13, color: C.dark, bold: true, align: 'center' });
    text(slide, title, x + 0.78, y + 0.18, w - 1.0, 0.54, { fontSize: titleSize, bold: true });
  } else {
    text(slide, title, x + 0.25, y + 0.18, w - 0.5, 0.48, { fontSize: titleSize, bold: true });
  }
  text(slide, body, x + 0.25, y + 0.78, w - 0.5, h - 0.95, { fontSize: bodySize, color: C.muted, valign: 'top' });
}

function bulletList(slide, items, x, y, w, h, options = {}) {
  const runs = [];
  items.forEach((item, i) => {
    runs.push({
      text: item,
      options: {
        bullet: { indent: options.indent || 16 },
        hanging: options.hanging || 4,
        breakLine: i < items.length - 1,
        paraSpaceAfterPt: options.spaceAfter || 12,
        color: options.color || C.text,
        fontSize: options.fontSize || 16,
      },
    });
  });
  slide.addText(runs, {
    x, y, w, h,
    fontFace: 'Aptos',
    fontSize: options.fontSize || 16,
    color: options.color || C.text,
    valign: 'top',
    margin: 0,
    breakLine: false,
    fit: 'shrink',
  });
}

function metric(slide, value, label, x, y, color) {
  text(slide, value, x, y, 1.25, 0.5, { fontSize: 28, bold: true, color });
  text(slide, label, x, y + 0.53, 1.65, 0.38, { fontSize: 11.5, color: C.muted, valign: 'top' });
}

// 1 — Cover
{
  const slide = pptx.addSlide();
  slides.push(slide);
  slide.background = { color: C.bg };
  slide.addShape(pptx.ShapeType.rect, { x: 8.55, y: 0, w: 4.78, h: 7.5, fill: { color: C.panel }, line: { transparency: 100 } });
  for (let i = 0; i < 7; i++) {
    const yy = 0.6 + i * 0.9;
    line(slide, 9.15, yy, 3.35, i % 2 === 0 ? 0.55 : -0.48, i % 3 === 0 ? C.cyan : C.line, i % 3 === 0 ? 2.2 : 1.2);
    rect(slide, 8.95 + (i % 2) * 2.95, yy - 0.09, 0.18, 0.18, i % 3 === 0 ? C.cyan : C.blue, 0.09);
  }
  pill(slide, 'УРОК • PRODUCTION', 0.72, 0.7, 2.1, C.cyan);
  text(slide, 'Розгортання\nNode.js застосунків', 0.72, 1.45, 7.2, 1.65, { fontSize: 36, bold: true, valign: 'top' });
  text(slide, 'Від локального npm start — до надійного,\nспостережуваного та масштабованого сервісу', 0.72, 3.35, 6.7, 0.92, { fontSize: 19, color: C.muted, valign: 'top' });
  rect(slide, 0.72, 5.35, 6.85, 0.82, C.panel2, 0.2);
  richText(slide, [
    { text: 'Фокус: ', options: { bold: true, color: C.cyan } },
    { text: 'моделі виконання • платформи • Docker • CI/CD • observability • scaling', options: { color: C.text } },
  ], 1.0, 5.58, 6.3, 0.33, { fontSize: 13.5 });
  text(slide, 'LESSON 12', 11.0, 6.85, 1.55, 0.24, { fontSize: 11, bold: true, color: C.muted, align: 'right' });
}

// 2 — Deployment gap
{
  const slide = addSlide('ВСТУП');
  titleBlock(slide, '`npm start` — ще не deployment', 'Локальний запуск доводить, що код працює. Production має довести, що система витримає реальність.');
  rect(slide, 0.72, 2.1, 3.05, 3.6, C.panel, 0.2, C.line);
  pill(slide, 'LOCAL', 1.0, 2.37, 0.85, C.green);
  text(slide, 'Розробник', 1.0, 2.9, 2.4, 0.45, { fontSize: 23, bold: true });
  bulletList(slide, ['один процес', 'ручний запуск', 'відоме середовище', 'помилка ≠ інцидент'], 1.0, 3.52, 2.35, 1.72, { fontSize: 15, color: C.muted, spaceAfter: 8 });
  line(slide, 4.15, 3.7, 1.55, 0, C.cyan, 3, undefined, 'triangle');
  text(slide, 'deployment', 4.25, 3.23, 1.35, 0.28, { fontSize: 12, color: C.cyan, bold: true, align: 'center' });
  rect(slide, 6.02, 2.1, 6.2, 3.6, C.panel2, 0.2, C.line);
  pill(slide, 'PRODUCTION', 6.35, 2.37, 1.25, C.cyan);
  text(slide, 'Система', 6.35, 2.9, 2.6, 0.45, { fontSize: 23, bold: true });
  const issues = [
    ['↻', 'перезапуск після збою'],
    ['⇄', 'оновлення без простою'],
    ['◎', 'логи, метрики, алерти'],
    ['⌁', 'секрети й мережеві межі'],
  ];
  issues.forEach((it, i) => {
    rect(slide, 6.35 + (i % 2) * 2.75, 3.56 + Math.floor(i / 2) * 0.82, 2.5, 0.62, C.bg2, 0.14);
    text(slide, it[0], 6.52 + (i % 2) * 2.75, 3.66 + Math.floor(i / 2) * 0.82, 0.34, 0.28, { fontSize: 16, color: C.cyan, bold: true, align: 'center' });
    text(slide, it[1], 6.94 + (i % 2) * 2.75, 3.64 + Math.floor(i / 2) * 0.82, 1.7, 0.34, { fontSize: 12.5, color: C.muted });
  });
  rect(slide, 0.72, 6.05, 11.5, 0.55, C.dark, 0.14, C.red);
  text(slide, 'Питання до класу: що станеться після перезавантаження сервера?', 1.0, 6.17, 10.95, 0.26, { fontSize: 14, color: C.red, bold: true, align: 'center' });
}

// 3 — Five qualities
{
  const slide = addSlide('ВИМОГИ');
  titleBlock(slide, 'П’ять властивостей production-середовища', 'Це не функції платформи «за замовчуванням», а свідомі інженерні рішення.');
  const items = [
    ['01', 'Відтворюваність', 'Той самий код → той самий результат', C.cyan],
    ['02', 'Доступність', 'Запити обслуговуються під час оновлень і збоїв', C.green],
    ['03', 'Спостережуваність', 'Стан системи видно без SSH', C.blue],
    ['04', 'Відновлюваність', 'Відкат займає хвилини, не години', C.amber],
    ['05', 'Безпека', 'Секрети, доступи й периметр контрольовані', C.red],
  ];
  items.forEach((it, i) => {
    const y = 2.05 + i * 0.88;
    rect(slide, 0.72, y, 11.55, 0.68, i === 0 ? C.panel2 : C.panel, 0.16, C.line);
    text(slide, it[0], 0.98, y + 0.14, 0.55, 0.3, { fontSize: 12, color: it[3], bold: true, align: 'center' });
    line(slide, 1.68, y + 0.14, 0, 0.38, it[3], 3);
    text(slide, it[1], 1.96, y + 0.11, 3.2, 0.38, { fontSize: 17, bold: true });
    text(slide, it[2], 5.2, y + 0.11, 6.65, 0.38, { fontSize: 14, color: C.muted });
  });
}

// 4 — execution models
{
  const slide = addSlide('МОДЕЛІ');
  titleBlock(slide, 'Три моделі виконання коду', 'Топологія застосунку визначає, де його взагалі можна розгорнути.');
  card(slide, { x: 0.65, y: 2.05, w: 3.85, h: 3.95, title: 'Довготривалий процес', body: 'Express слухає порт постійно.\n\n+ WebSocket\n+ пул БД у пам’яті\n+ фонові таймери\n\nПриклад: PaaS, IaaS, Kubernetes', color: C.green, index: 1, bodySize: 14 });
  card(slide, { x: 4.74, y: 2.05, w: 3.85, h: 3.95, title: 'Функція на запит', body: 'Платформа запускає handler під подію.\n\n+ scale to zero\n+ автоматичний scale out\n− cold start\n− немає гарантованого стану\n\nПриклад: AWS Lambda, Vercel', color: C.blue, index: 2, bodySize: 13.6 });
  card(slide, { x: 8.83, y: 2.05, w: 3.85, h: 3.95, title: 'Edge-виконання', body: 'Код працює біля користувача у V8 isolates.\n\n+ мінімальна затримка\n+ швидкий старт\n− обмежений Node.js API\n− не всі npm-пакети\n\nПриклад: Cloudflare Workers', color: C.purple, index: 3, bodySize: 13.6 });
  text(slide, 'Проєктуємо архітектуру → обираємо модель → обираємо платформу', 0.9, 6.35, 11.55, 0.32, { fontSize: 15.5, color: C.cyan, bold: true, align: 'center' });
}

// 5 — constraints
{
  const slide = addSlide('АРХІТЕКТУРА');
  titleBlock(slide, 'Архітектурні рішення мають наслідки', 'П’ять типових залежностей, які обмежують варіанти розгортання.');
  const rows = [
    ['WebSocket', 'Потрібен довгоживучий процес', 'Не класичний FaaS', C.red],
    ['Кеш у Map', 'Різні інстанси не бачать один одного', 'Redis / база даних', C.amber],
    ['node-cron', 'Таймер зникає разом із процесом', 'Планувальник платформи', C.blue],
    ['Локальні файли', 'Диск контейнера ефемерний', 'S3 / Cloudinary / GCS', C.purple],
    ['Пул БД', 'Serverless множить з’єднання', 'PgBouncer / RDS Proxy', C.green],
  ];
  text(slide, 'ЗАЛЕЖНІСТЬ', 0.85, 2.02, 2.1, 0.3, { fontSize: 10.5, color: C.muted, bold: true });
  text(slide, 'РИЗИК', 3.35, 2.02, 4.0, 0.3, { fontSize: 10.5, color: C.muted, bold: true });
  text(slide, 'PRODUCTION-РІШЕННЯ', 8.05, 2.02, 3.5, 0.3, { fontSize: 10.5, color: C.muted, bold: true });
  rows.forEach((r, i) => {
    const y = 2.42 + i * 0.79;
    rect(slide, 0.72, y, 11.6, 0.61, i % 2 ? C.bg2 : C.panel, 0.1);
    rect(slide, 0.9, y + 0.15, 0.16, 0.16, r[3], 0.08);
    text(slide, r[0], 1.18, y + 0.1, 1.82, 0.32, { fontSize: 14.5, bold: true });
    text(slide, r[1], 3.35, y + 0.1, 4.2, 0.32, { fontSize: 13.5, color: C.muted });
    text(slide, r[2], 8.05, y + 0.1, 3.8, 0.32, { fontSize: 13.5, color: r[3], bold: true });
  });
}

// 6 — platform spectrum
{
  const slide = addSlide('ПЛАТФОРМИ');
  titleBlock(slide, 'Платформа = розподіл відповідальності', 'Чим більше контролю залишає команда, тим більший операційний тягар.');
  const names = ['IaaS', 'PaaS', 'Kubernetes', 'FaaS', 'Edge'];
  const colors = [C.red, C.amber, C.green, C.blue, C.purple];
  const labels = [
    'VM, мережа, OS',
    'код + конфіг',
    'контейнери + кластер',
    'окремі функції',
    'логіка біля користувача',
  ];
  names.forEach((name, i) => {
    const x = 0.75 + i * 2.45;
    const barH = 2.15 - i * 0.32;
    rect(slide, x, 4.55 - barH, 1.95, barH, colors[i], 0.16);
    text(slide, name, x, 4.66, 1.95, 0.45, { fontSize: 19, bold: true, align: 'center' });
    text(slide, labels[i], x - 0.08, 5.2, 2.1, 0.52, { fontSize: 11.5, color: C.muted, align: 'center', valign: 'top' });
  });
  line(slide, 0.85, 6.15, 11.35, 0, C.line, 1.6, undefined, 'triangle');
  text(slide, 'БІЛЬШЕ КОНТРОЛЮ / OPS', 0.85, 6.3, 3.0, 0.25, { fontSize: 10, color: C.red, bold: true });
  text(slide, 'БІЛЬШЕ АБСТРАКЦІЇ / МЕНШЕ OPS', 9.0, 6.3, 3.2, 0.25, { fontSize: 10, color: C.purple, bold: true, align: 'right' });
}

// 7 — comparison
{
  const slide = addSlide('ПОРІВНЯННЯ');
  titleBlock(slide, 'Категорії платформ: швидка карта', 'Жодна модель не є «найкращою» — є відповідність конкретному сценарію.');
  const cols = [0.65, 3.0, 4.6, 6.45, 8.25, 10.45];
  const widths = [2.3, 1.5, 1.75, 1.7, 2.1, 2.2];
  const headers = ['Категорія', 'Контроль', 'Ops', 'Cold start', 'Сильний сценарій', 'Приклади'];
  headers.forEach((h, i) => {
    rect(slide, cols[i], 2.08, widths[i], 0.52, C.panel2, 0.08);
    text(slide, h, cols[i] + 0.08, 2.2, widths[i] - 0.16, 0.24, { fontSize: 10.5, color: C.cyan, bold: true, align: i ? 'center' : 'left' });
  });
  const data = [
    ['IaaS', 'макс.', 'високий', 'немає', 'legacy / регуляції', 'EC2, DO'],
    ['PaaS', 'середній', 'низький', 'немає', 'REST API / MVP', 'Render, Fly'],
    ['Kubernetes', 'високий', 'високий', 'немає', 'багато сервісів', 'EKS, GKE'],
    ['FaaS', 'низький', 'мінім.', 'відчутний', 'події / вебхуки', 'Lambda'],
    ['Edge', 'низький', 'мінім.', 'мінім.', 'middleware / geo', 'Workers'],
  ];
  const rowColors = [C.red, C.amber, C.green, C.blue, C.purple];
  data.forEach((row, r) => {
    const y = 2.75 + r * 0.67;
    row.forEach((v, i) => {
      rect(slide, cols[i], y, widths[i], 0.54, r % 2 ? C.bg2 : C.panel, 0.06);
      text(slide, v, cols[i] + 0.08, y + 0.11, widths[i] - 0.16, 0.27, { fontSize: 11.2, color: i === 0 ? rowColors[r] : C.text, bold: i === 0, align: i ? 'center' : 'left' });
    });
  });
  rect(slide, 0.75, 6.37, 11.5, 0.36, C.dark, 0.1);
  text(slide, 'Для навчального Express API природна стартова точка — PaaS.', 0.95, 6.44, 11.1, 0.2, { fontSize: 13.2, color: C.amber, bold: true, align: 'center' });
}

// 8 — containers
{
  const slide = addSlide('DOCKER');
  titleBlock(slide, 'Контейнер — універсальний артефакт доставки', 'Один образ збираємо один раз, тестуємо і просуваємо між середовищами.', 24);
  const stages = [
    ['CODE', 'Git commit', C.blue],
    ['BUILD', 'Docker image', C.cyan],
    ['TEST', 'Staging', C.green],
    ['SHIP', 'Production', C.amber],
  ];
  stages.forEach((s, i) => {
    const x = 0.8 + i * 3.08;
    rect(slide, x, 2.25, 2.35, 2.2, C.panel, 0.2, C.line);
    rect(slide, x + 0.18, 2.46, 1.99, 0.38, s[2], 0.12);
    text(slide, s[0], x + 0.18, 2.52, 1.99, 0.22, { fontSize: 11, color: C.dark, bold: true, align: 'center' });
    text(slide, s[1], x + 0.22, 3.08, 1.9, 0.42, { fontSize: 20, bold: true, align: 'center' });
    text(slide, i === 0 ? 'source' : i === 1 ? 'sha256:…' : 'той самий digest', x + 0.28, 3.7, 1.8, 0.25, { fontSize: 11.5, color: C.muted, align: 'center' });
    if (i < stages.length - 1) line(slide, x + 2.44, 3.34, 0.46, 0, C.line, 2, undefined, 'triangle');
  });
  rect(slide, 2.0, 5.22, 9.3, 0.95, C.panel2, 0.18);
  metric(slide, '1×', 'збираємо', 2.45, 5.32, C.cyan);
  metric(slide, 'N×', 'запускаємо', 5.0, 5.32, C.green);
  metric(slide, '≈ min', 'відкат', 7.65, 5.32, C.amber);
  text(slide, 'Незмінний артефакт = відтворюваність + швидкий rollback', 9.2, 5.42, 1.6, 0.55, { fontSize: 12.2, color: C.text, bold: true, align: 'center' });
}

// 9 — multistage Dockerfile
{
  const slide = addSlide('DOCKERFILE');
  titleBlock(slide, 'Multi-stage build: залишаємо тільки runtime', 'Фінальний образ менший, швидший і має меншу поверхню атаки.');
  rect(slide, 0.72, 2.0, 5.72, 4.55, C.dark, 0.18, C.line);
  pill(slide, 'BUILDER', 1.0, 2.25, 0.95, C.blue);
  const code1 = [
    ['FROM node:22-alpine AS builder', C.cyan],
    ['WORKDIR /app', C.text],
    ['COPY package*.json ./', C.text],
    ['RUN npm ci', C.green],
    ['COPY src ./src', C.text],
    ['RUN npm run build', C.green],
  ];
  code1.forEach((r, i) => text(slide, r[0], 1.02, 2.85 + i * 0.43, 4.95, 0.29, { fontFace: 'Consolas', fontSize: 13.3, color: r[1] }));
  rect(slide, 6.85, 2.0, 5.72, 4.55, C.dark, 0.18, C.line);
  pill(slide, 'RUNTIME', 7.13, 2.25, 1.05, C.green);
  const code2 = [
    ['FROM node:22-alpine AS runtime', C.cyan],
    ['ENV NODE_ENV=production', C.amber],
    ['RUN npm ci --omit=dev', C.green],
    ['COPY --from=builder /app/dist ./dist', C.text],
    ['USER node', C.red],
    ['CMD ["node", "dist/index.js"]', C.green],
  ];
  code2.forEach((r, i) => text(slide, r[0], 7.15, 2.85 + i * 0.43, 4.92, 0.29, { fontFace: 'Consolas', fontSize: 12.7, color: r[1] }));
  line(slide, 6.45, 4.2, 0.38, 0, C.amber, 3, undefined, 'triangle');
  text(slide, 'dist + prod deps', 5.78, 3.68, 1.72, 0.32, { fontSize: 10.5, color: C.amber, bold: true, align: 'center' });
}

// 10 — production ready checklist
{
  const slide = addSlide('PRODUCTION-READY');
  titleBlock(slide, 'Код має бути готовим до платформи', 'Шість практик, які роблять Node.js застосунок переносним між середовищами.');
  const checks = [
    ['01', 'NODE_ENV=production', 'правильні оптимізації та поведінка залежностей', C.cyan],
    ['02', 'JSON-логи у stdout', 'платформа збирає й індексує потік', C.blue],
    ['03', 'Graceful shutdown', 'SIGTERM → stop traffic → close resources', C.green],
    ['04', '/healthz + /readyz', 'окремо живучість і готовність', C.amber],
    ['05', 'ENV-конфігурація', 'жодних production-значень у коді', C.purple],
    ['06', 'Non-root container', 'USER node зменшує ризик атаки', C.red],
  ];
  checks.forEach((c, i) => {
    const x = 0.72 + (i % 2) * 6.0;
    const y = 2.03 + Math.floor(i / 2) * 1.35;
    rect(slide, x, y, 5.58, 1.04, C.panel, 0.16, C.line);
    rect(slide, x + 0.2, y + 0.22, 0.58, 0.58, c[3], 0.28);
    text(slide, c[0], x + 0.2, y + 0.32, 0.58, 0.25, { fontSize: 12, color: C.dark, bold: true, align: 'center' });
    text(slide, c[1], x + 1.0, y + 0.16, 4.25, 0.34, { fontSize: 16.2, bold: true });
    text(slide, c[2], x + 1.0, y + 0.56, 4.25, 0.25, { fontSize: 11.8, color: C.muted });
  });
}

// 11 — graceful shutdown
{
  const slide = addSlide('ЖИТТЄВИЙ ЦИКЛ');
  titleBlock(slide, 'Graceful shutdown: завершитись коректно', 'Платформа не «вбиває» процес несподівано — вона надсилає SIGTERM і чекає.');
  const flow = [
    ['SIGTERM', 'сигнал від платформи', C.red],
    ['STOP', 'не приймати нові запити', C.amber],
    ['DRAIN', 'дочекатися активних', C.blue],
    ['CLOSE', 'БД, черги, sockets', C.purple],
    ['EXIT 0', 'успішне завершення', C.green],
  ];
  flow.forEach((f, i) => {
    const x = 0.63 + i * 2.53;
    rect(slide, x, 2.35, 2.05, 1.4, C.panel, 0.18, C.line);
    pill(slide, f[0], x + 0.26, 2.6, 1.53, f[2]);
    text(slide, f[1], x + 0.2, 3.05, 1.65, 0.45, { fontSize: 11.5, color: C.muted, align: 'center', valign: 'top' });
    if (i < flow.length - 1) line(slide, x + 2.1, 3.05, 0.37, 0, C.line, 2.5, undefined, 'triangle');
  });
  rect(slide, 1.35, 4.55, 10.55, 1.45, C.dark, 0.18, C.line);
  text(slide, "process.on('SIGTERM', () => shutdown('SIGTERM'));", 1.72, 4.86, 9.8, 0.33, { fontFace: 'Consolas', fontSize: 17, color: C.cyan, align: 'center' });
  text(slide, 'У shutdown: server.close() → prisma.$disconnect() → process.exit(0)', 1.72, 5.35, 9.8, 0.3, { fontFace: 'Consolas', fontSize: 13.3, color: C.muted, align: 'center' });
  text(slide, 'Без цього запити обриваються, транзакції лишаються незавершеними.', 1.15, 6.36, 11.0, 0.3, { fontSize: 13.5, color: C.red, bold: true, align: 'center' });
}

// 12 — health checks
{
  const slide = addSlide('HEALTH CHECKS');
  titleBlock(slide, 'Живий ≠ готовий', 'Liveness і readiness відповідають на різні питання та запускають різні реакції платформи.');
  card(slide, { x: 0.72, y: 2.05, w: 5.55, h: 3.72, title: '/healthz • liveness', body: 'Питання: чи Event Loop реагує?\n\nПеревірка: проста відповідь HTTP 200.\n\nЯкщо FAIL кілька разів:\nплатформа перезапускає контейнер.', color: C.green, bodySize: 15 });
  card(slide, { x: 6.62, y: 2.05, w: 5.55, h: 3.72, title: '/readyz • readiness', body: 'Питання: чи можна давати трафік?\n\nПеревірка: критичні залежності доступні.\n\nЯкщо FAIL:\nінстанс прибирають із load balancer.', color: C.amber, bodySize: 15 });
  line(slide, 6.43, 2.28, 0, 3.05, C.line, 1.4);
  rect(slide, 2.25, 6.15, 8.8, 0.5, C.panel2, 0.14);
  text(slide, 'Не робіть liveness залежним від БД: інакше збій БД спричинить restart storm.', 2.5, 6.26, 8.3, 0.25, { fontSize: 12.8, color: C.red, bold: true, align: 'center' });
}

// 13 — secrets
{
  const slide = addSlide('СЕКРЕТИ');
  titleBlock(slide, '`.env` — для локальної розробки, не для production', 'Секрети мають жити у централізованому сховищі платформи або secret manager.');
  rect(slide, 0.75, 2.05, 5.25, 3.92, C.panel, 0.18, C.red);
  pill(slide, 'НЕБЕЗПЕЧНО', 1.05, 2.32, 1.22, C.red);
  text(slide, '.env у Git', 1.05, 2.9, 4.4, 0.45, { fontSize: 24, bold: true });
  bulletList(slide, ['секрет лишається в git history', 'ручна доставка на сервер', 'синхронізація між інстансами', 'немає аудиту та ротації'], 1.05, 3.55, 4.35, 1.8, { fontSize: 15, color: C.muted, spaceAfter: 10 });
  line(slide, 6.23, 3.94, 0.65, 0, C.cyan, 3, undefined, 'triangle');
  rect(slide, 7.15, 2.05, 5.4, 3.92, C.panel2, 0.18, C.green);
  pill(slide, 'PRODUCTION', 7.45, 2.32, 1.18, C.green);
  text(slide, 'Secret manager', 7.45, 2.9, 4.45, 0.45, { fontSize: 24, bold: true });
  bulletList(slide, ['ENV інʼєкція під час запуску', 'IAM: мінімальні права', 'аудит доступу', 'ротація без зміни коду'], 7.45, 3.55, 4.4, 1.8, { fontSize: 15, color: C.muted, spaceAfter: 10 });
  text(slide, 'AWS Secrets Manager • GCP Secret Manager • Vault • secrets платформи', 1.0, 6.34, 11.3, 0.28, { fontSize: 13, color: C.cyan, bold: true, align: 'center' });
}

// 14 — CI/CD
{
  const slide = addSlide('CI/CD');
  titleBlock(slide, 'Автоматизована доставка: build once, deploy many', 'Pipeline перетворює commit на перевірений незмінний артефакт.');
  const steps = [
    ['01', 'COMMIT', 'Git push', C.blue],
    ['02', 'CHECK', 'lint + test', C.cyan],
    ['03', 'BUILD', 'Docker image', C.green],
    ['04', 'PUSH', 'registry + digest', C.purple],
    ['05', 'DEPLOY', 'staging → prod', C.amber],
  ];
  steps.forEach((s, i) => {
    const x = 0.55 + i * 2.53;
    rect(slide, x, 2.28, 2.08, 1.52, C.panel, 0.16, C.line);
    text(slide, s[0], x + 0.18, 2.45, 0.42, 0.3, { fontSize: 11, color: s[3], bold: true });
    text(slide, s[1], x + 0.18, 2.83, 1.7, 0.34, { fontSize: 16, bold: true });
    text(slide, s[2], x + 0.18, 3.25, 1.7, 0.24, { fontSize: 11.5, color: C.muted });
    if (i < steps.length - 1) line(slide, x + 2.12, 3.03, 0.35, 0, C.line, 2, undefined, 'triangle');
  });
  text(slide, 'Стратегії релізу', 0.72, 4.45, 3.0, 0.42, { fontSize: 20, bold: true });
  const strategies = [
    ['Rolling', 'поетапна заміна інстансів', C.blue],
    ['Blue/Green', 'миттєве перемикання середовищ', C.green],
    ['Canary', 'нова версія для частини трафіку', C.amber],
  ];
  strategies.forEach((s, i) => {
    const x = 0.72 + i * 4.04;
    rect(slide, x, 5.02, 3.72, 1.18, C.panel2, 0.16);
    rect(slide, x + 0.18, 5.28, 0.22, 0.22, s[2], 0.11);
    text(slide, s[0], x + 0.52, 5.18, 2.8, 0.34, { fontSize: 15.5, bold: true });
    text(slide, s[1], x + 0.52, 5.57, 2.85, 0.3, { fontSize: 11.5, color: C.muted });
  });
  text(slide, 'Rollback — штатна операція, а не аварійна імпровізація.', 2.0, 6.49, 9.3, 0.27, { fontSize: 13.5, color: C.red, bold: true, align: 'center' });
}

// 15 — observability
{
  const slide = addSlide('OBSERVABILITY');
  titleBlock(slide, 'Три сигнали — одна картина', 'Метрика знаходить проблему, trace локалізує її, лог пояснює причину.');
  const signals = [
    ['LOGS', 'Що сталося?', 'події • stack trace • request_id', C.cyan],
    ['METRICS', 'Що змінюється?', 'RPS • errors • latency • CPU', C.green],
    ['TRACES', 'Де затримка?', 'шлях запиту • spans • trace_id', C.purple],
  ];
  signals.forEach((s, i) => {
    const x = 0.72 + i * 4.03;
    rect(slide, x, 2.1, 3.72, 2.55, C.panel, 0.2, C.line);
    rect(slide, x + 0.27, 2.37, 0.7, 0.7, s[3], 0.35);
    text(slide, String(i + 1), x + 0.27, 2.48, 0.7, 0.32, { fontSize: 17, color: C.dark, bold: true, align: 'center' });
    text(slide, s[0], x + 1.18, 2.36, 2.1, 0.38, { fontSize: 19, bold: true });
    text(slide, s[1], x + 0.28, 3.27, 3.05, 0.4, { fontSize: 16.5, color: s[3], bold: true });
    text(slide, s[2], x + 0.28, 3.87, 3.05, 0.42, { fontSize: 12.5, color: C.muted, valign: 'top' });
  });
  // cause-and-effect strip
  const chain = [
    ['5xx ↑', C.red], ['checkout trace', C.purple], ['DB timeout', C.cyan],
  ];
  chain.forEach((c, i) => {
    const x = 2.2 + i * 3.2;
    rect(slide, x, 5.35, 2.35, 0.75, C.panel2, 0.16);
    text(slide, c[0], x, 5.55, 2.35, 0.28, { fontSize: 15, color: c[1], bold: true, align: 'center' });
    if (i < 2) line(slide, x + 2.45, 5.72, 0.58, 0, C.line, 2, undefined, 'triangle');
  });
  text(slide, 'OpenTelemetry — вендор-нейтральний стандарт інструментування', 1.6, 6.45, 10.1, 0.26, { fontSize: 12.8, color: C.muted, align: 'center' });
}

// 16 — scaling
{
  const slide = addSlide('SCALING');
  titleBlock(slide, 'Scale up чи scale out?', 'Вертикальне масштабування простіше. Горизонтальне дає еластичність і відмовостійкість.');
  rect(slide, 0.72, 2.08, 5.35, 3.82, C.panel, 0.18, C.line);
  pill(slide, 'SCALE UP', 1.02, 2.35, 1.08, C.amber);
  text(slide, '1 інстанс', 1.02, 2.96, 2.4, 0.43, { fontSize: 22, bold: true });
  const heights = [0.55, 0.9, 1.3];
  heights.forEach((h, i) => {
    rect(slide, 1.18 + i * 1.2, 5.25 - h, 0.75, h, i === 2 ? C.amber : C.panel2, 0.08);
  });
  text(slide, 'більше CPU / RAM', 4.42, 4.25, 1.3, 0.48, { fontSize: 12.5, color: C.muted, bold: true, align: 'center' });
  text(slide, 'Просто, але є межа і single point of failure.', 1.05, 5.42, 4.7, 0.32, { fontSize: 12.5, color: C.muted, align: 'center' });
  rect(slide, 6.42, 2.08, 5.83, 3.82, C.panel2, 0.18, C.line);
  pill(slide, 'SCALE OUT', 6.72, 2.35, 1.12, C.green);
  text(slide, 'N інстансів', 6.72, 2.96, 2.8, 0.43, { fontSize: 22, bold: true });
  rect(slide, 7.0, 3.73, 4.55, 0.43, C.blue, 0.15);
  text(slide, 'LOAD BALANCER', 7.0, 3.82, 4.55, 0.2, { fontSize: 10.5, color: C.dark, bold: true, align: 'center' });
  [7.05, 8.55, 10.05].forEach((x) => {
    line(slide, 9.25, 4.17, x - 9.25, 0.45, C.line, 1.6);
    rect(slide, x, 4.63, 1.0, 0.58, C.green, 0.12);
    text(slide, 'APP', x, 4.75, 1.0, 0.22, { fontSize: 11, color: C.dark, bold: true, align: 'center' });
  });
  text(slide, 'Еластично, але застосунок має бути stateless.', 6.82, 5.42, 5.05, 0.32, { fontSize: 12.5, color: C.muted, align: 'center' });
  text(slide, 'Autoscaling: CPU / RPS ↑ → додати інстанс • навантаження ↓ → прибрати', 1.25, 6.35, 10.9, 0.3, { fontSize: 13.5, color: C.cyan, bold: true, align: 'center' });
}

// 17 — stateless and database
{
  const slide = addSlide('STATELESS');
  titleBlock(slide, 'Виносимо стан — знаходимо нове вузьке місце', 'Застосунок масштабується легко, але база даних і пул з’єднань — ні.');
  const apps = [0.9, 2.42, 3.94];
  apps.forEach((x, i) => {
    rect(slide, x, 2.32, 1.05, 0.75, C.green, 0.14);
    text(slide, `APP ${i + 1}`, x, 2.53, 1.05, 0.24, { fontSize: 11, color: C.dark, bold: true, align: 'center' });
    line(slide, x + 0.52, 3.08, 0, 0.75, C.line, 1.5);
  });
  rect(slide, 0.75, 3.88, 4.55, 0.7, C.panel2, 0.15);
  text(slide, 'Redis • Object Storage', 0.75, 4.08, 4.55, 0.26, { fontSize: 15, color: C.cyan, bold: true, align: 'center' });
  text(slide, 'сесії • кеш • файли • rate limits', 0.86, 4.78, 4.35, 0.34, { fontSize: 12.5, color: C.muted, align: 'center' });
  line(slide, 5.45, 3.45, 0.8, 0, C.amber, 3, undefined, 'triangle');
  rect(slide, 6.55, 2.15, 2.08, 2.75, C.panel, 0.18, C.amber);
  pill(slide, 'POOLER', 6.95, 2.44, 1.28, C.amber);
  text(slide, 'PgBouncer\nRDS Proxy\nPrisma Accelerate', 6.85, 3.15, 1.48, 1.1, { fontSize: 14, bold: true, align: 'center' });
  line(slide, 8.76, 3.45, 0.65, 0, C.amber, 3, undefined, 'triangle');
  rect(slide, 9.72, 2.15, 2.55, 2.75, C.panel2, 0.18, C.blue);
  slide.addShape(pptx.ShapeType.can, { x: 10.37, y: 2.58, w: 1.25, h: 1.2, fill: { color: C.blue }, line: { color: C.blue } });
  text(slide, 'PRIMARY DB', 9.92, 4.02, 2.15, 0.32, { fontSize: 13.5, bold: true, align: 'center' });
  rect(slide, 6.6, 5.48, 5.62, 0.58, C.dark, 0.14, C.red);
  text(slide, '100 інстансів × 10 connections = ліміт БД вичерпано', 6.82, 5.62, 5.2, 0.26, { fontSize: 12.6, color: C.red, bold: true, align: 'center' });
  text(slide, 'Read replicas масштабують читання; записи все одно йдуть у primary.', 1.2, 6.42, 10.9, 0.28, { fontSize: 13, color: C.muted, align: 'center' });
}

// 18 — choice workshop
{
  const slide = addSlide('ПРАКТИКА');
  titleBlock(slide, 'Обери платформу для сценарію', 'Спочатку знайди архітектурні обмеження. Потім оцінюй контроль, команду й бюджет.');
  const scenarios = [
    ['MVP / навчальний API', 'PaaS', 'Render • Railway • Fly.io', C.amber],
    ['WebSocket / real-time', 'PaaS або IaaS', 'довгоживучий процес', C.green],
    ['Webhook / подія / cron', 'FaaS', 'Lambda • Vercel Functions', C.blue],
    ['Десятки мікросервісів', 'Kubernetes', 'єдина площина керування', C.purple],
    ['Auth / geo middleware', 'Edge', 'Cloudflare Workers', C.cyan],
    ['Регуляторні вимоги', 'IaaS', 'повний контроль мережі', C.red],
  ];
  scenarios.forEach((s, i) => {
    const x = 0.68 + (i % 2) * 6.05;
    const y = 2.05 + Math.floor(i / 2) * 1.37;
    rect(slide, x, y, 5.65, 1.06, C.panel, 0.16, C.line);
    rect(slide, x + 0.18, y + 0.18, 0.18, 0.7, s[3], 0.09);
    text(slide, s[0], x + 0.55, y + 0.13, 2.8, 0.38, { fontSize: 15.2, bold: true });
    text(slide, s[2], x + 0.55, y + 0.58, 2.95, 0.26, { fontSize: 11.5, color: C.muted });
    pill(slide, s[1], x + 3.55, y + 0.35, 1.75, s[3]);
  });
  rect(slide, 1.18, 6.18, 10.92, 0.52, C.panel2, 0.14);
  text(slide, 'Командне завдання: аргументуйте вибір і назвіть головний компроміс.', 1.45, 6.3, 10.35, 0.26, { fontSize: 13.2, color: C.text, bold: true, align: 'center' });
}

// 19 — summary
{
  const slide = addSlide('ПІДСУМКИ');
  titleBlock(slide, 'Чотири рівні рішення', 'Production — не місце, куди копіюють код. Це система інженерних домовленостей.');
  const levels = [
    ['1', 'Модель виконання', 'process • FaaS • edge', C.green],
    ['2', 'Категорія платформи', 'IaaS • PaaS • K8s', C.blue],
    ['3', 'Production-ready код', 'ENV • logs • signals • probes', C.amber],
    ['4', 'Операційні процеси', 'CI/CD • rollback • observability • scaling', C.purple],
  ];
  levels.forEach((l, i) => {
    const y = 2.05 + i * 0.98;
    rect(slide, 0.9 + i * 0.28, y, 10.95 - i * 0.56, 0.76, i % 2 ? C.panel : C.panel2, 0.16, C.line);
    rect(slide, 1.13 + i * 0.28, y + 0.13, 0.5, 0.5, l[3], 0.25);
    text(slide, l[0], 1.13 + i * 0.28, y + 0.23, 0.5, 0.22, { fontSize: 13, color: C.dark, bold: true, align: 'center' });
    text(slide, l[1], 1.85 + i * 0.28, y + 0.13, 3.25, 0.38, { fontSize: 17, bold: true });
    text(slide, l[2], 5.2 + i * 0.18, y + 0.13, 5.8 - i * 0.25, 0.38, { fontSize: 13.5, color: C.muted, align: 'right' });
  });
  rect(slide, 1.75, 6.28, 9.85, 0.52, C.dark, 0.14, C.cyan);
  text(slide, 'Мета: повторюваний реліз, контрольований ризик, швидке відновлення.', 2.0, 6.39, 9.35, 0.26, { fontSize: 14, color: C.cyan, bold: true, align: 'center' });
}

// Speaker notes with teaching cues.
slides[1].addNotes('Запитайте студентів: які проблеми виникнуть, якщо просто скопіювати папку на сервер і виконати npm start?');
slides[3].addNotes('Попросіть назвати по одному прикладу застосунку для кожної моделі виконання.');
slides[6].addNotes('Підкресліть: категорії стабільніші за бренди. Для курсового Express API рекомендуйте PaaS як старт.');
slides[11].addNotes('Зверніть увагу: liveness не повинна перевіряти БД, інакше можливий каскад перезапусків.');
slides[17].addNotes('Дайте студентам 3–5 хвилин на обговорення у парах, потім зберіть аргументи й компроміси.');

pptx.writeFile({ fileName: 'nodejs-deployment-lesson.pptx' });
