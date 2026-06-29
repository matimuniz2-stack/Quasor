// SSR entry used ONLY at build time by scripts/prerender.mjs.
//
// We render the real <App/> tree to static HTML so the home ships with its
// actual content (H1, value props, FAQ, testimonials…) for crawlers that don't
// run JS — AI bots (GPTBot, ClaudeBot, PerplexityBot) and Google's first pass.
//
// renderToStaticMarkup (not renderToString) because the client uses
// createRoot().render() — NOT hydrateRoot() — so React discards this snapshot
// and renders fresh on mount. No hydration, hence no mismatch risk: the
// snapshot is purely for no-JS consumers. Effects don't run here, so the
// animated demo dashboard/typewriter render in their initial (static) state,
// which is fine — that's chrome, not indexable copy.

import { renderToStaticMarkup } from 'react-dom/server';
import App from './App.jsx';

export function render() {
  return renderToStaticMarkup(<App />);
}
