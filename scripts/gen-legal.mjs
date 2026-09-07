// Static legal-page generator.
//
// The 6 legal pages must stay crawlable WITHOUT JS (Meta/Google submit & verify
// these URLs) and keep their exact paths, titles, descriptions and hreflang.
// Instead of 6 hand-duplicated shells, the shell (head boilerplate, header,
// footer, CSS, theme toggle) lives ONCE here and is re-applied to every page.
//
// Source of truth for CONTENT is each page's own <main>…</main> plus its
// <title>/description/hreflang, which we extract verbatim and re-wrap. The pass
// is idempotent: re-running reproduces byte-identical output.
//
// Source of truth for the CHROME is split in two, on purpose:
//   · the tokens and the type scale are mirrored from src/index.css (the values
//     are copied because these pages ship zero Tailwind — see SHARED_CSS);
//   · the navigation and footer CONTENT is imported from src/site.js, the same
//     module Nav.jsx and Footer.jsx read.
// The second half is what keeps a landing redesign from leaving the legal pages
// behind: when a section is renamed or an anchor moves, these pages follow.
//
// Run: `node scripts/gen-legal.mjs` (also runs automatically before `vite build`).

import { readFile, writeFile } from "node:fs/promises";
import { join, dirname, posix } from "node:path";
import { fileURLToPath } from "node:url";
import {
  NAV_LINKS,
  DESCRIPTOR,
  CTA,
  CONTACT,
  BLURB,
  FOOTER_PRODUCTO,
  FOOTER_EMPRESA,
  LEGAL_DOCS,
  legalLinks,
  FOOTER_REDES,
  FOOTER_TITLES,
  absolute,
  t,
} from "../src/site.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

// El origen, una sola vez. Las URL absolutas (canonical, OG, Twitter) se
// derivan del path de la página; el path es el dato primitivo porque además es
// lo que el pie compara para marcar el documento que estás leyendo.
const SITE = "https://quasor.io";

// La tabla de archivos sale de LEGAL_DOCS, así que las rutas legales se
// declaran UNA sola vez en todo el repo. Con `cleanUrls`, la URL
// `/legal/privacidad` se sirve desde el archivo `legal/privacidad.html`: sacarle
// la barra inicial y agregarle la extensión reconstruye el path exacto.
//
// Cada documento produce sus dos idiomas, y el `alt` de cada uno — el destino
// del selector de idioma del header — es el href de su traducción. El par no
// se puede desalinear porque no son dos listas: es una.
const FILES = LEGAL_DOCS.flatMap((doc) => [
  { file: `${doc.es.href.slice(1)}.html`, lang: "es", alt: doc.en.href },
  { file: `${doc.en.href.slice(1)}.html`, lang: "en", alt: doc.es.href },
]);

const COPY = {
  es: {
    skip: "Saltar al contenido",
    sections: "Secciones",
    menu: "Menú de secciones",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    toDark: "Cambiar a tema oscuro",
    toLight: "Cambiar a tema claro",
    home: "Quasor — ir al inicio",
    altLabel: "EN",
    altAria: "Read this page in English",
    legalNav: "Documentos legales",
  },
  en: {
    skip: "Skip to content",
    sections: "Sections",
    menu: "Section menu",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    toDark: "Switch to dark theme",
    toLight: "Switch to light theme",
    home: "Quasor — go to homepage",
    altLabel: "ES",
    altAria: "Leer esta página en español",
    legalNav: "Legal documents",
  },
};

/* ============================================================================
   CSS
   ----------------------------------------------------------------------------
   Mirrors src/index.css. These pages carry no Tailwind and no build step of
   their own, so every value that the landing gets from a utility class is
   written out here against the same token. Where a number appears (60px header,
   1280px container, 24/40px gutters, the 11px/0.14em mono label) it is the same
   number the JSX uses — if one moves, both move.
   ============================================================================ */
const SHARED_CSS = `
    /* --- TOKENS · espejo de :root en src/index.css ------------------------ */
    :root {
      --bg: #fafaf9;
      --bg-2: #f1f1ef;
      --bg-3: #e8e8e5;

      --ink: #14171c;
      --ink-2: #4a4f59;
      --ink-3: #646a78;

      --line: #e4e4e1;
      --line-2: #cfcfca;

      /* Un solo ámbar: --accent es el de marca (rellenos, botones, barras) en
         los DOS temas; --accent-text es la variante legible sobre fondo claro.
         Confundirlos apagaba el ámbar de la marca en toda la página. */
      --accent: #ff9100;
      --accent-2: #e07600;
      --accent-text: #a8560a;
      --accent-on: #14171c;
      --accent-ring: color-mix(in oklab, var(--accent) 34%, transparent);

      --stage-amber: #fdf0dc;
      --stage-line: color-mix(in oklab, var(--ink) 10%, transparent);

      /* El stack mono se usa en cinco reglas de acá abajo. Es el mismo valor
         que --font-mono en el bloque @theme de src/index.css. */
      --font-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;

      --r-xs: 3px;
      --r-sm: 6px;
      --r-md: 10px;
      --r-lg: 16px;
      --r-pill: 999px;

      color-scheme: light;
    }
    html[data-theme="dark"] {
      --bg: #0b0c0f;
      --bg-2: #14161b;
      --bg-3: #1a1d24;

      --ink: #ecedf0;
      --ink-2: #a8aeba;
      --ink-3: #868d9b;

      --line: #1f232b;
      --line-2: #2c3038;

      --accent: #ff9100;
      --accent-2: #ffb259;
      --accent-text: #ff9100;
      --accent-on: #0b0c0f;
      --accent-ring: color-mix(in oklab, var(--accent) 40%, transparent);

      --stage-amber: #241806;
      --stage-line: color-mix(in oklab, var(--ink) 14%, transparent);

      color-scheme: dark;
    }

    /* --- BASE ------------------------------------------------------------- */
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; }
    body {
      font-family: 'Schibsted Grotesk', system-ui, -apple-system, sans-serif;
      background: var(--bg);
      color: var(--ink);
      font-size: 16px;
      line-height: 1.65;
      letter-spacing: -0.006em;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    /* La transición de color se arma DESPUÉS del primer paint, así cambiar de
       tema se cruza suave pero cargar la página no se ve como un fundido. */
    html.theme-ready body,
    html.theme-ready .theme-tx {
      transition: background-color .42s ease, color .42s ease, border-color .42s ease;
    }
    ::selection { background: color-mix(in oklab, var(--accent) 30%, transparent); color: var(--ink); }
    main, footer { overflow-x: clip; }

    /* --- TIPOGRAFÍA Y COLOR · espejo de las @utility de index.css ---------- */
    .label {
      font-family: var(--font-mono);
      font-size: 11px;
      line-height: 1.5;
      font-weight: 500;
      letter-spacing: 0.14em;
      text-transform: uppercase;
    }
    .label-lc { text-transform: none; letter-spacing: 0.02em; }
    .ink { color: var(--ink); }
    .ink-3 { color: var(--ink-3); }
    .accent-text { color: var(--accent-text); }

    /* --- CROMADO ---------------------------------------------------------- */
    :focus { outline: none; }
    :focus-visible {
      outline: 2px solid var(--accent-text);
      outline-offset: 3px;
      border-radius: var(--r-xs);
    }
    button:focus-visible, a:focus-visible { outline-offset: 2px; }

    ::-webkit-scrollbar { width: 10px; height: 10px; }
    ::-webkit-scrollbar-thumb { background: var(--line-2); border-radius: var(--r-pill); }
    ::-webkit-scrollbar-track { background: transparent; }

    .skip-link {
      position: fixed;
      top: -100px;
      left: 16px;
      z-index: 100;
      padding: 10px 16px;
      background: var(--accent);
      color: var(--accent-on);
      font-weight: 600;
      border-radius: var(--r-sm);
      text-decoration: none;
      transition: top .2s ease;
    }
    .skip-link:focus { top: 16px; outline: none; }

    /* --- HEADER ----------------------------------------------------------- */
    .head {
      position: sticky;
      top: 0;
      z-index: 40;
      background: color-mix(in oklab, var(--bg) 82%, transparent);
      -webkit-backdrop-filter: blur(24px);
      backdrop-filter: blur(24px);
      border-bottom: 1px solid var(--line);
    }
    /* Barra de progreso de lectura: anima transform y no width, para no forzar
       layout en cada frame de scroll. */
    .progress { position: absolute; inset-inline: 0; top: 0; height: 2px; overflow: hidden; }
    .progress > span {
      display: block;
      height: 100%;
      width: 100%;
      transform-origin: left;
      transform: scaleX(0);
      background: var(--accent);
      will-change: transform;
    }
    .wrap { max-width: 1280px; margin: 0 auto; padding: 0 24px; }
    .head-row { height: 60px; display: flex; align-items: center; justify-content: space-between; gap: 16px; }
    .head-left { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
    .wordmark {
      display: inline-flex;
      align-items: center;
      min-height: 44px;
      font-size: 19px;
      font-weight: 600;
      letter-spacing: -0.035em;
      line-height: 1;
      color: var(--ink);
      text-decoration: none;
    }
    .descriptor { display: none; white-space: nowrap; margin-left: 4px; }
    .head-nav { display: none; align-items: center; gap: 20px; min-width: 0; }
    /* Enlace de navegación: subrayado que se despliega desde la izquierda. */
    .nav-link { position: relative; color: var(--ink-2); text-decoration: none; transition: color .22s ease; }
    .nav-link::after {
      content: "";
      position: absolute;
      left: 0; right: 0; bottom: -5px;
      height: 1px;
      background: var(--accent);
      transform: scaleX(0);
      transform-origin: left;
      transition: transform .3s cubic-bezier(.2,.7,.2,1);
    }
    .nav-link:hover { color: var(--ink); }
    .nav-link:hover::after { transform: scaleX(1); }
    .head-nav .nav-link { font-size: 13.5px; white-space: nowrap; }
    .head-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }

    /* El círculo mide 32px por diseño; el ::before lo lleva a 44px de área
       táctil en mobile sin alterar la altura de la barra. */
    .toggle {
      position: relative;
      flex-shrink: 0;
      width: 32px; height: 32px;
      display: grid;
      place-items: center;
      padding: 0;
      border: 1px solid var(--line);
      border-radius: var(--r-pill);
      background: transparent;
      color: var(--ink-2);
      cursor: pointer;
      transition: color .22s ease, border-color .22s ease;
    }
    .toggle::before { content: ""; position: absolute; inset: -6px; }
    .toggle:hover { color: var(--ink); }
    .toggle .icon-sun { display: none; }
    html[data-theme="dark"] .toggle .icon-sun { display: block; }
    html[data-theme="dark"] .toggle .icon-moon { display: none; }

    /* Pastilla de idioma: el .chip del sistema, con el código en mono. */
    .lang {
      display: inline-flex;
      align-items: center;
      flex-shrink: 0;
      padding: 5px 11px;
      border: 1px solid var(--line-2);
      border-radius: var(--r-pill);
      color: var(--ink-2);
      text-decoration: none;
      transition: color .22s ease, border-color .22s ease;
    }
    .lang:hover { color: var(--accent-text); border-color: var(--accent-ring); }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      border-radius: var(--r-sm);
      font-family: inherit;
      font-weight: 600;
      text-decoration: none;
      background: var(--accent);
      color: var(--accent-on);
      border: 1px solid var(--accent);
      cursor: pointer;
      transition: background-color .22s ease, border-color .22s ease, box-shadow .22s ease;
    }
    .btn:hover {
      background: var(--accent-2);
      border-color: var(--accent-2);
      box-shadow: 0 8px 24px -12px var(--accent-ring);
    }
    /* La flecha de los CTA se desplaza en hover — el único micro-gesto repetido. */
    .btn .arrow { transition: transform .25s cubic-bezier(.2,.7,.2,1); }
    .btn:hover .arrow { transform: translateX(3px); }
    .head-cta { display: none; font-size: 13px; padding: 8px 16px; }

    .burger {
      width: 44px; height: 44px;
      margin-right: -8px;
      display: grid;
      place-items: center;
      border: 0;
      border-radius: var(--r-sm);
      background: transparent;
      color: var(--ink-2);
      cursor: pointer;
      transition: color .22s ease;
    }
    .burger:hover { color: var(--ink); }
    .burger .icon-close { display: none; }
    .head.open .burger .icon-close { display: block; }
    .head.open .burger .icon-open { display: none; }

    .nav-mobile {
      overflow: hidden;
      border-top: 1px solid var(--line);
      max-height: 0;
      opacity: 0;
      transition: max-height .3s ease-out, opacity .3s ease-out;
    }
    .head.open .nav-mobile { max-height: 640px; opacity: 1; }
    .nav-mobile .wrap { padding-top: 8px; padding-bottom: 24px; }
    .nav-mobile nav { display: flex; flex-direction: column; }
    .nav-mobile .nav-link { display: flex; align-items: center; min-height: 44px; padding: 12px 0; font-size: 15px; }
    .nav-mobile .btn { width: 100%; margin-top: 20px; font-size: 13px; padding: 12px 16px; }

    /* --- DOCUMENTO -------------------------------------------------------- */
    /* El documento se alinea a la izquierda del mismo contenedor de 1280px que
       la barra y el pie — el wordmark, el título y la primera columna del pie
       caen todos sobre la misma vertical. La medida de lectura la pone el tope
       de 760px de cada bloque, no un contenedor centrado. */
    main { max-width: 1280px; margin: 0 auto; padding: 64px 24px 104px; }
    main > * { max-width: 760px; }

    .kicker { color: var(--accent-text); }

    h1 {
      font-weight: 600;
      font-size: clamp(34px, 6vw, 50px);
      line-height: 1.04;
      letter-spacing: -0.042em;
      margin: 18px 0 0;
    }
    /* El <em> del titular NO se pinta de ámbar: en la landing no hay un solo
       titular con una palabra en color — el acento vive en la etiqueta mono, en
       las cifras grandes y en los enlaces. Un titular bicolor acá era el único
       de todo el sitio. Se conserva la etiqueta por semántica y se neutraliza
       la itálica, que tampoco pertenece al sistema. */
    h1 em { font-style: normal; color: inherit; }

    /* Estado del documento, con el mismo lenguaje que el Badge de la landing:
       pastilla en bg-2, filete de 1px y un punto ámbar. */
    .updated {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin: 28px 0 0;
      padding: 6px 14px 6px 12px;
      border: 1px solid var(--line);
      border-radius: var(--r-pill);
      background: var(--bg-2);
      font-family: var(--font-mono);
      font-size: 11.5px;
      font-weight: 500;
      letter-spacing: 0.02em;
      color: var(--ink-3);
    }
    .updated::before {
      content: "";
      width: 6px; height: 6px;
      border-radius: var(--r-pill);
      background: var(--accent);
      flex-shrink: 0;
    }

    /* Sin filete entre secciones: el rediseño saca los filetes repetidos y deja
       que separen el aire y la etiqueta mono del número. */
    h2 {
      font-weight: 600;
      font-size: 24px;
      line-height: 1.08;
      letter-spacing: -0.036em;
      margin: 64px 0 14px;
    }
    h2 .num {
      display: block;
      margin-bottom: 12px;
      font-family: var(--font-mono);
      font-size: 11px;
      font-weight: 500;
      line-height: 1.5;
      letter-spacing: 0.14em;
      color: var(--accent-text);
    }
    h3 {
      font-weight: 600;
      font-size: 17px;
      line-height: 1.35;
      letter-spacing: -0.01em;
      color: var(--ink);
      margin: 30px 0 8px;
    }

    p, li { color: var(--ink-2); font-size: 15.5px; }
    p { margin: 14px 0; line-height: 1.7; }

    /* Viñetas con raya ámbar, como las de Servicios y Por qué en la landing. */
    ul { list-style: none; padding-left: 0; margin: 14px 0; }
    ul li { position: relative; padding-left: 22px; margin: 8px 0; line-height: 1.6; }
    ul li::before {
      content: "—";
      position: absolute;
      left: 0;
      color: var(--accent-text);
    }
    ol { padding-left: 24px; margin: 14px 0; }
    ol li { margin: 8px 0; line-height: 1.6; }
    ol li::marker {
      font-family: var(--font-mono);
      font-size: 0.85em;
      color: var(--ink-3);
    }

    strong { color: var(--ink); font-weight: 600; }
    em { font-style: italic; }
    a {
      color: var(--accent-text);
      text-decoration: underline;
      text-decoration-thickness: 1px;
      text-underline-offset: 3px;
      text-decoration-color: color-mix(in oklab, var(--accent) 38%, transparent);
      transition: text-decoration-color .22s ease;
    }
    a:hover { text-decoration-color: currentColor; }
    code {
      font-family: var(--font-mono);
      font-size: 0.88em;
      background: var(--bg-2);
      border: 1px solid var(--line);
      border-radius: var(--r-xs);
      padding: 1px 6px;
      color: var(--ink);
    }

    /* El "stage" ámbar del sistema: el panel de color que sostiene el bloque
       destacado. Sin el filete lateral de 3px, que era otro filete de más. */
    .callout {
      background: var(--stage-amber);
      border: 1px solid var(--stage-line);
      border-radius: var(--r-lg);
      padding: 20px 24px;
      margin: 28px 0;
    }
    .callout p { margin: 0; }
    .callout p + p { margin-top: 10px; }

    /* Los saltos al resto de los legales, al pie del documento. */
    .doc-next { margin-top: 56px; padding-top: 24px; border-top: 1px solid var(--line); }
    .doc-next a { text-decoration: none; font-size: 14px; }
    .doc-next a:hover { text-decoration: underline; text-underline-offset: 3px; }
    .doc-next br { line-height: 2.4; }

    /* --- PIE -------------------------------------------------------------- */
    .foot { background: var(--bg-2); }
    .foot .wrap { padding-top: 56px; padding-bottom: 56px; }
    .foot-grid { display: grid; gap: 40px 32px; }
    .foot-brand {
      display: inline-block;
      font-size: 30px;
      font-weight: 600;
      letter-spacing: -0.04em;
      line-height: 1;
      color: var(--ink);
      text-decoration: none;
    }
    .foot-blurb { color: var(--ink-3); font-size: 13.5px; line-height: 1.625; margin: 16px 0 0; max-width: 300px; }
    .foot-contact { margin-top: 20px; display: flex; flex-direction: column; }
    .foot-micro {
      display: inline-flex;
      align-items: center;
      width: fit-content;
      min-height: 44px;
      color: var(--ink-3);
      text-decoration: none;
      transition: color .22s ease;
    }
    .foot-micro:hover { color: var(--accent-text); }
    .foot-col ul { list-style: none; margin: 12px 0 0; padding: 0; display: flex; flex-direction: column; }
    .foot-col li { margin: 0; padding: 0; }
    .foot-col li::before { content: none; }
    .foot-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      min-height: 44px;
      font-size: 13.5px;
      line-height: 1.375;
      color: var(--ink-2);
      text-decoration: none;
      transition: color .22s ease;
    }
    .foot-link:hover { color: var(--accent-text); }
    .foot-link[aria-current="page"] { color: var(--ink); }
    .foot-link .ext { font-size: 11px; line-height: 1; }
    .foot-bar {
      margin-top: 48px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 8px 32px;
    }
    .foot-legal { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; align-items: center; gap: 0 8px; }
    .foot-legal li { display: flex; align-items: center; gap: 8px; margin: 0; padding: 0; }
    .foot-legal li::before { content: none; }
    .foot-legal a {
      display: inline-flex;
      align-items: center;
      min-height: 44px;
      color: var(--ink-3);
      text-decoration: none;
      transition: color .22s ease;
    }
    .foot-legal a:hover { color: var(--accent-text); }
    /* El documento que estás leyendo no se enlaza a sí mismo como si fuera otro
       destino: queda marcado. */
    .foot-legal a[aria-current="page"] { color: var(--ink); }

    /* --- BREAKPOINTS · los mismos de Tailwind que usa la landing ---------- */
    @media (min-width: 640px) {
      .head-cta { display: inline-flex; }
      .head-right { gap: 12px; }
      .foot-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    @media (min-width: 768px) {
      .wrap { padding-left: 40px; padding-right: 40px; }
      main { padding: 88px 40px 120px; }
      h2 { font-size: 26px; margin-top: 72px; }
      .foot .wrap { padding-top: 64px; padding-bottom: 64px; }
      .foot-micro, .foot-link, .foot-legal a { min-height: 0; }
      .foot-micro { padding: 2px 0; }
      .foot-link { padding: 3px 0; }
      .foot-contact { margin-top: 24px; }
      .foot-bar { margin-top: 56px; }
    }
    @media (min-width: 1024px) {
      .head-nav { display: flex; }
      .burger, .nav-mobile { display: none; }
      .foot-grid { grid-template-columns: 1.5fr 1fr 1fr 1fr; gap: 40px; }
    }
    @media (min-width: 1280px) {
      .descriptor { display: inline; }
      .head-nav { gap: 24px; }
    }

    /* --- MOVIMIENTO REDUCIDO --------------------------------------------- */
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: .01ms !important;
        transition-duration: .01ms !important;
        transition-delay: 0s !important;
      }
    }`;

const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap";

// Misma carga no bloqueante que index.html: preload que se convierte en
// stylesheet al terminar, con <noscript> de respaldo.
const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preload" as="style" href="${FONT_HREF}" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="${FONT_HREF}"></noscript>`;

const FAVICONS = `<link rel="icon" type="image/png" sizes="192x192" href="/favicon.png" />
  <link rel="icon" type="image/png" sizes="512x512" href="/favicon-512.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />`;

// Corre antes del primer paint, así no hay destello del tema equivocado.
// Misma clave de localStorage que la SPA.
const THEME_DETECT = `<script>
    (function(){try{var s=localStorage.getItem('quasor-theme');var m=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.setAttribute('data-theme',s||m);}catch(e){document.documentElement.setAttribute('data-theme','light');}})();
  </script>`;

// Tres comportamientos, en vanilla y al final del body: tema, menú de mobile y
// barra de progreso. Es todo lo que la barra de la landing hace con React.
const CHROME_SCRIPT = `<script>
    (function () {
      var root = document.documentElement;
      var head = document.querySelector('.head');

      // Las transiciones de color se arman recién tras el primer paint.
      requestAnimationFrame(function () { root.classList.add('theme-ready'); });

      var toggle = head && head.querySelector('.toggle');
      if (toggle) {
        var sync = function () {
          var dark = root.getAttribute('data-theme') === 'dark';
          var label = toggle.getAttribute(dark ? 'data-to-light' : 'data-to-dark');
          toggle.setAttribute('aria-label', label);
          toggle.setAttribute('title', label);
        };
        sync();
        toggle.addEventListener('click', function () {
          var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
          root.setAttribute('data-theme', next);
          try { localStorage.setItem('quasor-theme', next); } catch (e) {}
          sync();
        });
      }

      var burger = head && head.querySelector('.burger');
      var panel = document.getElementById('nav-mobile');
      if (burger && panel) {
        var setOpen = function (open) {
          head.classList.toggle('open', open);
          burger.setAttribute('aria-expanded', String(open));
          var label = burger.getAttribute(open ? 'data-close' : 'data-open');
          burger.setAttribute('aria-label', label);
          // inert saca del árbol de accesibilidad y del foco lo que está
          // colapsado: sin esto el tab entra en un panel invisible.
          if (open) panel.removeAttribute('inert');
          else panel.setAttribute('inert', '');
        };
        burger.addEventListener('click', function () {
          setOpen(!head.classList.contains('open'));
        });
        panel.addEventListener('click', function (e) {
          if (e.target.closest('a')) setOpen(false);
        });
        // Escape cierra y devuelve el foco al disparador: si no, el foco queda
        // atrapado en un contenedor que acaba de volverse inert.
        document.addEventListener('keydown', function (e) {
          if (e.key === 'Escape' && head.classList.contains('open')) {
            setOpen(false);
            burger.focus();
          }
        });
      }

      var bar = document.querySelector('.progress > span');
      if (bar) {
        var raf = null;
        var update = function () {
          var max = root.scrollHeight - window.innerHeight;
          var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
          bar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
          raf = null;
        };
        var onScroll = function () { if (raf == null) raf = requestAnimationFrame(update); };
        update();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll, { passive: true });
      }
    })();
  </script>`;

const ICON_MOON = `<svg class="icon-moon" width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round" aria-hidden="true"><path d="M13.4 9.9A5.6 5.6 0 0 1 6.1 2.6 5.9 5.9 0 1 0 13.4 9.9Z"/></svg>`;
const ICON_SUN = `<svg class="icon-sun" width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" aria-hidden="true"><circle cx="8" cy="8" r="3.1"/><path d="M8 1.2v1.4M8 13.4v1.4M1.2 8h1.4M13.4 8h1.4M3.3 3.3l1 1M11.7 11.7l1 1M12.7 3.3l-1 1M4.3 11.7l-1 1"/></svg>`;
const ICON_BURGER = `<svg class="icon-open" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" aria-hidden="true"><path d="M2.5 6h13M2.5 12h13"/></svg><svg class="icon-close" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" aria-hidden="true"><path d="M4.2 4.2l9.6 9.6M13.8 4.2l-9.6 9.6"/></svg>`;

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const first = (re, html, fallback = "") => {
  const m = html.match(re);
  return m ? m[1] : fallback;
};

// `terminos.html` visto desde legal/privacidad.html → `/legal/terminos`.
// Vercel corre con cleanUrls, así que la variante con extensión contesta 301:
// cada enlace interno con `.html` costaba una redirección por click.
const cleanHref = (href, fromDir) => {
  if (/^(https?:|mailto:|tel:|#|\/\/)/.test(href)) return href;
  const [path, hash = ""] = href.split(/(#.*)$/, 2);
  if (!/\.html$/.test(path)) return href;
  const abs = path.startsWith("/") ? path : posix.join("/", fromDir, path);
  return abs.replace(/\.html$/, "") + hash;
};

const cleanLinks = (html, fromDir) =>
  html.replace(/href="([^"]+)"/g, (_m, href) => `href="${cleanHref(href, fromDir)}"`);

/* ------------------------------------------------------------------ CHROME --- */

const navLinks = (lang) =>
  NAV_LINKS.map(
    (l) => `<a href="${absolute(l.href)}" class="nav-link">${esc(t(l, lang))}</a>`
  ).join("\n            ");

const header = (lang, alt) => {
  const c = COPY[lang];
  // La fila de desktop y el panel de mobile son el MISMO markup: uno se muestra
  // arriba de lg y el otro abajo, nunca los dos a la vez.
  const links = navLinks(lang);
  return `<header class="head theme-tx">
    <div class="progress" aria-hidden="true"><span></span></div>

    <div class="wrap">
      <div class="head-row">
        <div class="head-left">
          <a href="/" class="wordmark" aria-label="${esc(c.home)}">quasor<span class="accent-text">.</span></a>
          <span class="descriptor label ink-3">${esc(t(DESCRIPTOR, lang))}</span>
        </div>

        <nav class="head-nav" aria-label="${esc(c.sections)}">
          ${links}
        </nav>

        <div class="head-right">
          <button type="button" class="toggle" data-to-dark="${esc(c.toDark)}" data-to-light="${esc(c.toLight)}" aria-label="${esc(c.toDark)}" title="${esc(c.toDark)}">${ICON_MOON}${ICON_SUN}</button>
          <a href="${alt}" class="lang label" hreflang="${lang === "es" ? "en" : "es"}" aria-label="${esc(c.altAria)}">${c.altLabel}</a>
          <a href="/#contacto" class="btn head-cta">${esc(t(CTA, lang))}<span class="arrow" aria-hidden="true">→</span></a>
          <button type="button" class="burger" id="nav-burger" aria-controls="nav-mobile" aria-expanded="false" data-open="${esc(c.openMenu)}" data-close="${esc(c.closeMenu)}" aria-label="${esc(c.openMenu)}">${ICON_BURGER}</button>
        </div>
      </div>
    </div>

    <div class="nav-mobile" id="nav-mobile" inert>
      <div class="wrap">
        <nav aria-label="${esc(c.menu)}">
          ${links}
        </nav>
        <a href="/#contacto" class="btn">${esc(t(CTA, lang))}<span class="arrow" aria-hidden="true">→</span></a>
      </div>
    </div>
  </header>`;
};

const footColumn = (id, title, links, lang, { arrow = false, current = null } = {}) => {
  const items = links
    .map((item) => {
      const attrs = [
        `href="${absolute(item.href)}"`,
        `class="foot-link"`,
        item.external ? `target="_blank" rel="noopener noreferrer"` : "",
        item.aria ? `aria-label="${esc(t(item.aria, lang))}"` : "",
        current && item.href === current ? `aria-current="page"` : "",
      ]
        .filter(Boolean)
        .join(" ");
      const ext = arrow ? `<span class="ext" aria-hidden="true">↗</span>` : "";
      return `<li><a ${attrs}>${esc(t(item, lang))}${ext}</a></li>`;
    })
    .join("\n            ");

  return `<nav class="foot-col" aria-labelledby="${id}">
          <span id="${id}" class="label ink">${esc(t(title, lang))}</span>
          <ul>
            ${items}
          </ul>
        </nav>`;
};

const footer = (lang, currentPath) => {
  const c = COPY[lang];
  // El pie de una página en inglés enlaza a los legales en inglés.
  const legal = legalLinks(lang);
  const empresa = [...FOOTER_EMPRESA, ...legal];

  const legalBar = legal
    .map((item, i) => {
      const cur = item.href === currentPath ? ` aria-current="page"` : "";
      const sep =
        i < legal.length - 1
          ? `<span class="label ink-3" aria-hidden="true">·</span>`
          : "";
      return `<li><a href="${item.href}" class="label"${cur}>${esc(t(item, lang))}</a>${sep}</li>`;
    })
    .join("\n          ");

  return `<footer class="foot theme-tx">
    <div class="wrap">
      <div class="foot-grid">
        <div>
          <a href="/" class="foot-brand" aria-label="${esc(c.home)}">quasor<span class="accent-text">.</span></a>
          <p class="foot-blurb">${esc(t(BLURB, lang))}</p>
          <div class="foot-contact">
            <a href="mailto:${CONTACT.email}" class="foot-micro label label-lc">${CONTACT.email}</a>
            <a href="${CONTACT.tel}" class="foot-micro label label-lc">${CONTACT.phone}</a>
          </div>
        </div>

        ${footColumn("foot-producto", FOOTER_TITLES.producto, FOOTER_PRODUCTO, lang)}
        ${footColumn("foot-empresa", FOOTER_TITLES.empresa, empresa, lang, { current: currentPath })}
        ${footColumn("foot-redes", FOOTER_TITLES.redes, FOOTER_REDES, lang, { arrow: true })}
      </div>

      <div class="foot-bar">
        <span class="label ink-3">© ${new Date().getFullYear()} Quasor · ${esc(t(CONTACT.city, lang))}</span>
        <ul class="foot-legal" aria-label="${esc(c.legalNav)}">
          ${legalBar}
        </ul>
      </div>
    </div>
  </footer>`;
};

/* --------------------------------------------------------------- TRANSFORM --- */

function transform(html, { lang, alt, urlPath, dir }) {
  const c = COPY[lang];
  const canonical = SITE + urlPath;
  const title = first(/<title>([\s\S]*?)<\/title>/, html);
  const description = first(/<meta name="description" content="([^"]*)"/, html);
  const robots = first(/<meta name="robots" content="([^"]*)"/, html, "index, follow");
  const hreflang = (html.match(/<link rel="alternate"[^>]*>/g) || []).join("\n  ");

  // El <main> se toma por dentro y se vuelve a envolver, así el id del salto de
  // contenido no se duplica al regenerar.
  const body = (html.match(/<main[^>]*>([\s\S]*?)<\/main>/) || ["", ""])[1]
    // El bloque de saltos al resto de los legales tenía el margen inline.
    .replace(/<p style="margin-top: 48px;">/g, '<p class="doc-next">');

  const main = `<main id="doc">${cleanLinks(body, dir)}</main>`;

  return `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <meta name="author" content="Quasor" />
  <meta name="robots" content="${robots}" />
  <meta name="theme-color" content="#ff9100" media="(prefers-color-scheme: light)" />
  <meta name="theme-color" content="#0b0c0f" media="(prefers-color-scheme: dark)" />
  <link rel="canonical" href="${canonical}" />
  ${hreflang}

  <meta property="og:type" content="article" />
  <meta property="og:locale" content="${lang === "es" ? "es_AR" : "en_US"}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:site_name" content="Quasor" />
  <meta property="og:image" content="${SITE}/og-image.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@quasortech" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${SITE}/og-image.jpg" />

  ${FAVICONS}
  ${FONTS}
  ${THEME_DETECT}
  <style>${SHARED_CSS}
  </style>
</head>
<body>
  <a href="#doc" class="skip-link">${esc(c.skip)}</a>

  ${header(lang, alt)}

  ${main}

  ${footer(lang, urlPath)}
  ${CHROME_SCRIPT}
</body>
</html>
`;
}

let count = 0;
for (const { file, lang, alt } of FILES) {
  const path = join(ROOT, file);
  const src = await readFile(path, "utf8");
  // URL limpia (sin extensión), la que sirve Vercel con cleanUrls: de acá sale
  // el canonical autorreferencial, así la ruta .html nunca compite como
  // duplicado. Se llama urlPath y no path porque `path` ya está tomado arriba.
  const urlPath = `/${file.replace(/\.html$/, "")}`;
  const dir = posix.dirname(file);
  const out = transform(src, { lang, alt, urlPath, dir });
  await writeFile(path, out, "utf8");
  count++;
  console.log(`  ✓ ${file}`);
}
console.log(`Generated ${count} legal pages (shell compartido con la landing).`);
