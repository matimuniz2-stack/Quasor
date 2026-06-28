// Static legal-page generator.
//
// The 6 legal pages must stay crawlable WITHOUT JS (Meta/Google submit & verify
// these URLs), keep their exact paths, titles, descriptions and hreflang, and
// now also support dark mode. Instead of 6 hand-duplicated shells, the shell
// (head boilerplate, header, footer chrome, CSS, theme toggle) lives ONCE here
// and is re-applied to every page.
//
// Source of truth for CONTENT is each page's own <main>…</main> + <footer> +
// <title>/description/hreflang, which we extract verbatim and re-wrap. The pass
// is idempotent: re-running reproduces byte-identical output.
//
// Run: `node scripts/gen-legal.mjs` (also runs automatically before `vite build`).

import { readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const FILES = [
  "legal/privacidad.html",
  "legal/terminos.html",
  "legal/eliminar-datos.html",
  "legal/en/privacy.html",
  "legal/en/terms.html",
  "legal/en/data-deletion.html",
];

// Shared design tokens + typography. Light values match src/index.css :root;
// the dark block mirrors src/index.css html[data-theme="dark"] so the legal
// pages flip with the same `quasor-theme` localStorage key as the main site.
const SHARED_CSS = `
    :root {
      --bg: #ffffff;
      --bg-2: #f6f6f7;
      --ink: #0a0a0a;
      --ink-2: #2a2a2a;
      --ink-3: #6b6b6b;
      --line: #ececec;
      --line-2: #d9d9d9;
      --accent: #ff5a1f;
    }
    html[data-theme="dark"] {
      --bg: #0b0b0c;
      --bg-2: #141416;
      --ink: #f4f1ea;
      --ink-2: #bab5ab;
      --ink-3: #7a756d;
      --line: #1e1e21;
      --line-2: #2a2a2f;
      --accent: #ff7a3d;
    }
    html { color-scheme: light; }
    html[data-theme="dark"] { color-scheme: dark; }
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; }
    body {
      font-family: "Inter", sans-serif;
      background: var(--bg);
      color: var(--ink);
      font-size: 16px;
      line-height: 1.65;
      -webkit-font-smoothing: antialiased;
    }
    .serif { font-family: "Instrument Serif", serif; font-weight: 400; }
    .mono { font-family: "JetBrains Mono", monospace; }
    .ink-2 { color: var(--ink-2); }
    .ink-3 { color: var(--ink-3); }
    .accent { color: var(--accent); }
    header {
      position: sticky; top: 0; z-index: 40;
      background: color-mix(in oklab, var(--bg) 90%, transparent);
      backdrop-filter: blur(8px);
      border-bottom: 1px solid var(--line);
    }
    .nav-wrap {
      max-width: 1000px; margin: 0 auto; padding: 0 24px;
      height: 56px; display: flex; align-items: center; justify-content: space-between;
    }
    .logo { font-family: "Instrument Serif", serif; font-size: 24px; text-decoration: none; color: var(--ink); }
    .back { text-decoration: none; color: var(--ink-2); font-size: 14px; transition: color .2s; }
    .back:hover { color: var(--accent); }
    .nav-right { display: flex; gap: 16px; align-items: center; }
    .lang { font-family: "JetBrains Mono", monospace; font-size: 12px; color: var(--ink-3); text-decoration: none; border: 1px solid var(--line); padding: 4px 10px; border-radius: 12px; transition: all .2s; }
    .lang:hover { color: var(--accent); border-color: var(--accent); }
    .theme-toggle {
      width: 32px; height: 32px; border-radius: 999px;
      border: 1px solid var(--line); background: transparent; color: var(--ink-2);
      display: grid; place-items: center; cursor: pointer; padding: 0;
      transition: color .2s, border-color .2s;
    }
    .theme-toggle:hover { color: var(--accent); border-color: var(--accent); }
    .theme-toggle svg { width: 16px; height: 16px; }
    .theme-toggle .icon-sun { display: none; }
    html[data-theme="dark"] .theme-toggle .icon-sun { display: block; }
    html[data-theme="dark"] .theme-toggle .icon-moon { display: none; }

    main {
      max-width: 760px;
      margin: 0 auto;
      padding: 80px 24px 120px;
    }
    .kicker {
      font-family: "JetBrains Mono", monospace;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      color: var(--ink-3);
    }
    h1 {
      font-family: "Instrument Serif", serif;
      font-weight: 400;
      font-size: clamp(48px, 8vw, 88px);
      line-height: 0.98;
      letter-spacing: -0.035em;
      margin: 16px 0 32px;
    }
    h1 em { font-style: italic; color: var(--accent); }
    .updated {
      font-family: "JetBrains Mono", monospace;
      font-size: 12px;
      color: var(--ink-3);
      padding: 14px 18px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--bg-2);
      display: inline-block;
      margin-bottom: 48px;
    }
    h2 {
      font-family: "Instrument Serif", serif;
      font-weight: 400;
      font-size: 32px;
      line-height: 1.1;
      letter-spacing: -0.02em;
      margin: 56px 0 16px;
      padding-top: 24px;
      border-top: 1px solid var(--line);
    }
    h2:first-of-type { border-top: none; padding-top: 0; }
    h2 .num {
      font-family: "JetBrains Mono", monospace;
      font-size: 13px;
      color: var(--ink-3);
      letter-spacing: 0.1em;
      margin-right: 12px;
      vertical-align: middle;
    }
    h3 {
      font-family: "Inter", sans-serif;
      font-weight: 600;
      font-size: 17px;
      margin: 28px 0 8px;
      color: var(--ink);
    }
    p, li { color: var(--ink-2); font-size: 16px; }
    p { margin: 12px 0; }
    ul, ol { padding-left: 20px; margin: 12px 0; }
    li { margin: 6px 0; }
    ul li::marker { color: var(--accent); }
    strong { color: var(--ink); font-weight: 600; }
    code { font-family: "JetBrains Mono", monospace; font-size: 0.88em; background: var(--bg-2); border: 1px solid var(--line); padding: 1px 6px; border-radius: 4px; color: var(--ink); }
    em { font-style: italic; }
    a { color: var(--accent); text-decoration: none; border-bottom: 1px dotted var(--accent); }
    a:hover { opacity: 0.8; }
    .callout {
      border-left: 3px solid var(--accent);
      background: var(--bg-2);
      padding: 18px 22px;
      margin: 24px 0;
      border-radius: 4px;
    }
    .callout p { margin: 0; }
    footer.pagefoot {
      border-top: 1px solid var(--line);
      padding: 40px 24px;
      text-align: center;
      font-family: "JetBrains Mono", monospace;
      font-size: 11px;
      color: var(--ink-3);
    }
    footer.pagefoot a { color: var(--ink-2); border: none; margin: 0 12px; }
    footer.pagefoot a:hover { color: var(--accent); }`;

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">`;

// Runs before paint so there's no flash of the wrong theme. Same key as the SPA.
const THEME_DETECT = `<script>
    (function(){try{var s=localStorage.getItem('quasor-theme');var m=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.setAttribute('data-theme',s||m);}catch(e){document.documentElement.setAttribute('data-theme','light');}})();
  </script>`;

const TOGGLE_SCRIPT = `<script>
    (function(){var b=document.querySelector('.theme-toggle');if(!b)return;b.addEventListener('click',function(){var cur=document.documentElement.getAttribute('data-theme')==='dark'?'dark':'light';var next=cur==='dark'?'light':'dark';document.documentElement.setAttribute('data-theme',next);try{localStorage.setItem('quasor-theme',next);}catch(e){}});})();
  </script>`;

const ICON_MOON = `<svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
const ICON_SUN = `<svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`;

const TOGGLE_LABEL = { es: "Cambiar tema", en: "Toggle theme" };

const first = (re, html, fallback = "") => {
  const m = html.match(re);
  return m ? m[1] : fallback;
};

function transform(html) {
  const lang = first(/<html lang="([^"]+)"/, html, "es");
  const title = first(/<title>([\s\S]*?)<\/title>/, html);
  const description = first(/<meta name="description" content="([^"]*)"/, html);
  const robots = first(/<meta name="robots" content="([^"]*)"/, html, "index, follow");
  const hreflang = (html.match(/<link rel="alternate"[^>]*>/g) || []).join("\n  ");
  const main = (html.match(/<main>[\s\S]*?<\/main>/) || [""])[0];
  const footer = (html.match(/<footer class="pagefoot">[\s\S]*?<\/footer>/) || [""])[0];
  const langLink = (html.match(/<a [^>]*class="lang"[^>]*>[\s\S]*?<\/a>/) || [""])[0];
  const backLink = (html.match(/<a [^>]*class="back"[^>]*>[\s\S]*?<\/a>/) || [""])[0];

  const toggle = `<button type="button" class="theme-toggle" aria-label="${TOGGLE_LABEL[lang] || TOGGLE_LABEL.es}" title="${TOGGLE_LABEL[lang] || TOGGLE_LABEL.es}">${ICON_MOON}${ICON_SUN}</button>`;

  return `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <meta name="robots" content="${robots}" />
  ${hreflang}
  ${FONTS}
  ${THEME_DETECT}
  <style>${SHARED_CSS}
  </style>
</head>
<body>
  <header>
    <div class="nav-wrap">
      <a href="/" class="logo">quasor<span class="accent">.</span></a>
      <div class="nav-right">
        ${toggle}
        ${langLink}
        ${backLink}
      </div>
    </div>
  </header>

  ${main}

  ${footer}
  ${TOGGLE_SCRIPT}
</body>
</html>
`;
}

let count = 0;
for (const rel of FILES) {
  const path = join(ROOT, rel);
  const src = await readFile(path, "utf8");
  const out = transform(src);
  await writeFile(path, out, "utf8");
  count++;
  console.log(`  ✓ ${rel}`);
}
console.log(`Generated ${count} legal pages (shared shell + dark mode).`);
