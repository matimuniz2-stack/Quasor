// Build-time prerender of the home into dist/index.html.
//
// Runs AFTER `vite build` (which emits dist/index.html with an empty
// <div id="root"></div> + the hashed CSS/JS links). We render <App/> to static
// markup via Vite's SSR module loader and inject it inside #root, so the served
// HTML already contains the real copy for crawlers that don't execute JS.
//
// Why Vite's ssrLoadModule instead of Puppeteer: no headless Chromium in the
// build (faster, reliable on Vercel), zero content drift (renders the same
// React source as the live app), and it mirrors the existing Node build step
// in gen-legal.mjs. The client still ships as a full CSR app; createRoot()
// replaces this snapshot on mount, so there is no hydration-mismatch surface.
//
// Run: `node scripts/prerender.mjs` (runs automatically at the end of `npm run build`).

import { readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST_INDEX = join(ROOT, 'dist', 'index.html');
const ROOT_DIV = '<div id="root"></div>';
// Matches the FAQ JSON-LD <script id="faq-jsonld"> … </script> in index.html.
const FAQ_SCRIPT_RE =
  /(<script type="application\/ld\+json" id="faq-jsonld">)[\s\S]*?(<\/script>)/;

// Build a schema.org FAQPage object from the same FAQ array the page renders,
// so the structured data can never drift from the visible Q&A.
const faqPageJsonLd = (faq) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
});

const vite = await createServer({
  root: ROOT,
  logLevel: 'warn',
  // Headless render: no HTML middleware, we only use the SSR module graph.
  appType: 'custom',
  server: { middlewareMode: true },
});

try {
  const { render } = await vite.ssrLoadModule('/src/prerender.jsx');
  const { FAQ } = await vite.ssrLoadModule('/src/data.js');
  const appHtml = render();

  let html = await readFile(DIST_INDEX, 'utf8');

  if (!html.includes(ROOT_DIV)) {
    throw new Error(
      `Could not find ${ROOT_DIV} in dist/index.html — did the build output change?`
    );
  }
  // Function replacers (not replacement strings): the rendered markup and the
  // FAQ JSON contain `$` (e.g. prices like "US$ …"), and String.replace would
  // otherwise interpret `$&`, `$$`, `$1`… as replacement patterns and corrupt
  // the output. A function replacer returns its argument verbatim.
  html = html.replace(ROOT_DIV, () => `<div id="root">${appHtml}</div>`);

  // Regenerate the FAQ structured data from data.js (single source of truth).
  if (!FAQ_SCRIPT_RE.test(html)) {
    throw new Error('Could not find <script id="faq-jsonld"> in dist/index.html.');
  }
  // Escape `<` to < so a future FAQ answer mentioning "</script>" can't
  // break out of the inline <script> tag (valid JSON, parses back to "<").
  const faqJson = JSON.stringify(faqPageJsonLd(FAQ), null, 2).replace(/</g, '\\u003c');
  html = html.replace(FAQ_SCRIPT_RE, (_m, open, close) => `${open}\n${faqJson}\n  ${close}`);

  await writeFile(DIST_INDEX, html, 'utf8');

  const kb = (Buffer.byteLength(html, 'utf8') / 1024).toFixed(1);
  console.log(
    `  ✓ Prerendered home + synced FAQ schema (${FAQ.length} Q&A) → dist/index.html (${kb} kB)`
  );
} finally {
  await vite.close();
}
