# SEO — Diagnóstico y hoja de ruta de mejoras

> Guía para mejorar el SEO de la landing de Quasor (`quasor.io`).
> Estado relevado: **2026-06-29**. Stack: Vite 6 + React 18, deploy en Vercel.
> **Actualización 2026-06-29:** la home ahora se **prerenderiza en el build** (ver "Hecho").
> Cada ítem marca **impacto** (🟢 alto / 🟡 medio / ⚪ bajo) y **esfuerzo** aproximado.

---

## TL;DR

- **Ser "una sola página" NO es malo para SEO.** El problema real era que el contenido se renderizaba **100% en el cliente** (CSR): el `<body>` llegaba vacío y lo armaba React → **ya resuelto** con prerender en el build.
- El `<head>` (title, meta, Open Graph, JSON-LD, sitemap, robots) ya estaba **bien hecho** y se reforzó (WebSite + grafo de entidad + FAQ generado de una sola fuente).
- Una sola URL = un solo clúster de keywords. Para más alcance → páginas dedicadas por vertical (decisión de marketing, no un bug técnico).

---

## Hecho (cambio 2026-06-29)

El motivo de fondo (con evidencia 2025-2026): **los crawlers de IA NO ejecutan JavaScript.** GPTBot, ClaudeBot/Claude-User, OAI-SearchBot, ChatGPT-User y PerplexityBot hacen un GET y leen solo el HTML crudo; si el copy aparece recién tras hidratar React, **ven una página vacía**. Solo Google/Bing/Applebot (y Gemini, que usa la infra de Googlebot) renderizan JS — y Google igual lo hace en una 2ª pasada diferida. Fuentes: [Vercel+Merj](https://vercel.com/blog/the-rise-of-the-ai-crawler), [GSQI](https://www.gsqi.com/marketing-blog/ai-search-javascript-rendering/).

1. **🟢 Prerender de la home en el build.** `scripts/prerender.mjs` renderiza el árbol React a HTML estático (`renderToStaticMarkup` vía el SSR loader de Vite) y lo inyecta dentro de `<div id="root">` en `dist/index.html`. El cliente sigue siendo CSR: como monta con `createRoot().render()` (no `hydrateRoot`), React **reemplaza** el snapshot al montar → cero riesgo de hydration mismatch y cero drift (el snapshot sale del mismo código que la app). No usa Puppeteer/Chromium → build liviano y confiable en Vercel. Único guard necesario: `App.jsx` cae a defaults cuando no hay `document` (build).
2. **🟢 robots.txt** con allowlist explícita de bots de IA (OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-User/SearchBot, PerplexityBot, GPTBot, Google-Extended, etc.). Técnicamente redundante (RFC 9309: sin `Disallow` ya es "permitido") pero documenta la intención de dejarlos entrar.
3. **🟡 Datos estructurados.** Se agregó `WebSite` (sin `SearchAction`, deprecado por Google en 2024), se conectó el grafo con `@id` (`#software`, `#website`, `#organization`), y se enriqueció `SoftwareApplication` (`featureList`, `audience`, `screenshot`). El **`FAQPage` se genera desde `src/data.js` en el build** → no puede volver a desincronizarse del FAQ visible (antes tenía 6 ítems viejos vs 7 reales).
4. **⚪ llms.txt** (`public/llms.txt`) bien formado. Honestidad: su beneficio está **sin confirmar** (estudios muestran que casi ningún motor lo consume hoy); se suma por costo casi nulo, no por expectativa de citas.
5. **⚪ sitemap** `lastmod` de la home actualizado.

**Build:** `npm run build` = `gen-legal` → `vite build` → `prerender`. Nada nuevo que configurar en Vercel.

---

## Estado actual (qué hay hoy)

### Lo que YA está bien — no romper

- `index.html` con `<head>` sólido: `<title>` único, `meta description`, `canonical`, `robots: index,follow,max-image-preview:large`, `lang="es"`, `og:locale es_AR`.
- **Open Graph + Twitter Cards** completos, con `public/og-image.jpg` (1200×630).
- **3 bloques JSON-LD**: `SoftwareApplication`, `FAQPage` (elegible para rich snippets), `Organization`. Mantenerlos sincronizados con el copy real del sitio.
- `public/robots.txt` + `public/sitemap.xml` correctos, con `hreflang` es/en para las legales.
- Páginas **legales = HTML estático real** (las genera `scripts/gen-legal.mjs` en el build) → crawleables sin JS. Buen patrón a imitar.
- Exactamente **un `<h1>`** (hero, `src/components/Sections.jsx`). Jerarquía de headings con `<h2>` por sección.
- Performance: `preconnect` a fuentes, carga de fuentes no bloqueante, analytics cookieless (Plausible), assets con `Cache-Control immutable`.

### El problema central — renderizado solo en cliente (CSR)

- `index.html` trae `<div id="root"></div>` **vacío**; todo el contenido lo inyecta `src/main.jsx` (`createRoot(...).render(<App/>)`), sin SSR ni prerender.
- Consecuencia por crawler:

  | Crawler | ¿Ve el contenido del body? |
  |---|---|
  | Google | Sí, pero renderiza JS en una 2ª pasada (más lento; si el JS falla, indexa vacío) |
  | Bing | A veces; menos confiable con JS |
  | Meta / WhatsApp / LinkedIn / X (previews) | No ejecutan JS — pero les alcanza el `<head>` ✅ |
  | Bots de IA / herramientas SEO | Muchos no renderizan JS → ven body vacío ❌ |

- Riesgo práctico: el copy (propuestas de valor, FAQ, testimonios) **solo existe post-JS**. Si el render de Google se demora o falla, rankeás con contenido pobre.

### El límite de alcance — una sola URL

- Una URL apunta de forma realista a **un solo clúster de keywords**. Hoy se mezclan en la misma página: *CRM inmobiliarias*, *CRM concesionarias*, *tracking de ads Meta/Google*, *alternativa a Tokko*…
- No es penalización: es techo de cobertura. Para capturar cada intención de búsqueda hace falta una URL propia por tema.

---

## Hoja de ruta (orden de prioridad)

### 1. ✅ Prerenderizar / SSG la home — *HECHO (2026-06-29)*

Resuelto con un paso de build propio (`scripts/prerender.mjs`), sin migrar de stack ni arrastrar Chromium. Ver sección "Hecho" arriba para el detalle. Se descartó:

- **Plugin tipo `vite-prerender-plugin`**: requiere pasar a `hydrateRoot` y hacer la app SSR-safe → reintroduce riesgo de hydration mismatch (typewriter, dashboard animado).
- **Puppeteer (snapshot con browser real)**: válido, pero arrastra Chromium al build (frágil en Vercel/Amazon Linux) sin ventaja sobre `renderToStaticMarkup` para este caso.
- **Migrar a Astro/Vike**: over-engineering para 1 página dinámica + legales ya estáticas.

> Nota: las legales ya se prerenderizaban (`gen-legal.mjs`); ahora la home también.

### 2. 🟡 Páginas dedicadas por vertical / intención (si se busca más alcance)

- Crear URLs reales con su propio `<title>`, `<h1>`, copy y JSON-LD, p. ej.:
  - `/crm-inmobiliarias` — keywords de inmobiliarias + integración Tokko.
  - `/crm-concesionarias` — keywords de concesionarias/automotor.
  - (más adelante) comparativas: *alternativa a Tokko*, *tracking de ads para inmobiliarias*, etc.
- Cada página = un clúster de keywords. Enlazarlas desde la home y sumarlas al `sitemap.xml`.
- Requiere routing real → encaja naturalmente si se hace el paso 1 con Astro o Vike.
- **Es decisión de marketing/contenido**: sólo vale la pena si se va a escribir copy específico y útil por página (no clones).

### 3. 🟡 Blog / contenido (long-tail) — sólo si hay plan de sostenerlo

- Artículos tipo *"cómo medir el costo real por venta en inmobiliarias"*, *"Meta Lead Ads + CRM"*. Capturan búsquedas informativas y alimentan enlaces internos.
- No arrancar si no hay cadencia de publicación: contenido viejo y abandonado no ayuda.

### 3.5 🟡 Copy "extractable" para citas de IA (mejor palanca on-page con evidencia)

Lo que más correlaciona con ser citado por LLMs (auditorías de Search Engine Land + paper GEO, KDD 2024): **pregunta en un H2 + respuesta autocontenida de ~20-25 palabras justo debajo**, con un dato/cifra concreto, y arriba en la página (el ~44% de las citas salen del primer tercio). El FAQ ya cumple ese patrón y ahora es **texto visible prerenderizado** (las IAs leen texto, no JSON-LD). Próximo paso opcional: aplicar el mismo molde a 1-2 secciones clave (hero/ads) sin romper la voz.

### 4. ⚪ Higiene y mejoras incrementales

- [x] **JSON-LD sincronizado con el copy** — el `FAQPage` se **genera desde `src/data.js`** en el build (`scripts/prerender.mjs`); ya no se edita a mano en dos lados.
- [x] **`lastmod` del `sitemap.xml`** actualizado (home: 2026-06-29).
- [x] **`alt` en imágenes** — N/A: no hay `<img>` de contenido (todo es SVG inline decorativo con `aria-hidden`); el `og-image` ya tiene `og:image:alt`.
- [ ] **`<title>` y `meta description` por página** una vez que existan rutas (no repetir el de la home).
- [ ] Revisar **Core Web Vitals** (LCP/CLS/INP) en PageSpeed Insights; el dashboard animado del hero es el principal sospechoso de LCP/CLS. (El prerender ayuda al LCP: el copy ya viene en el HTML.)
- [ ] Dar de alta el sitio en **Google Search Console** y **Bing Webmaster Tools**; mandar el sitemap y mirar "Cobertura" / "Páginas renderizadas".
- [ ] **Off-page** (probablemente el mayor ROI para citas de IA, fuera del dominio): presencia en comparadores/reviews (G2, Capterra), menciones en medios/blogs de real estate y automotor AR. Los LLMs citan fuentes externas más que el markup propio.
- [ ] Verificar que el `og-image.jpg` y las URLs absolutas de schema sigan vivas tras cada cambio de dominio/branding.

---

## Cómo verificar (tests rápidos)

Tras el prerender, esto se puede correr contra el build local (`npm run build && npx serve dist`) o contra prod:

```bash
# 1. El HTML crudo ahora trae el contenido (lo clave para bots de IA, que no ejecutan JS)
curl -s https://quasor.io/ | grep -ci "<h1"            # esperado: 1
curl -s https://quasor.io/ | grep -i "Tu empresa funciona"   # copy del hero sin JS
curl -s https://quasor.io/ | grep -c "<h2"             # esperado: ~11 (jerarquía de headings)

# 2. Ver el <head> y los 4 JSON-LD (SoftwareApplication, WebSite, FAQPage, Organization)
curl -s https://quasor.io/ | grep -ic "application/ld\+json"   # esperado: 4

# 3. Las legales (control positivo, ya eran estáticas)
curl -s https://quasor.io/legal/privacidad.html | grep -ci "privacidad"

# 4. robots + sitemap + llms.txt accesibles
curl -s https://quasor.io/robots.txt | grep -i "GPTBot\|ClaudeBot\|PerplexityBot"
curl -s https://quasor.io/sitemap.xml | head
curl -s https://quasor.io/llms.txt | head -1
```

> **Validación local rápida** (sin desplegar): `npm run build` corre el prerender; revisar `dist/index.html`. El `<body>` ya no debe tener `<div id="root"></div>` vacío.

Herramientas:
- **Google Search Console → Inspección de URL → "Probar URL publicada" → "Ver página renderizada"**: muestra exactamente lo que Google ve después de renderizar el JS. Es la prueba de fuego.
- **Rich Results Test** (search.google.com/test/rich-results): valida el `FAQPage` / `SoftwareApplication`.
- **PageSpeed Insights**: Core Web Vitals reales (campo + lab).
- Para previews sociales: depurador de Facebook/LinkedIn y "Card validator" — aunque al usar `<head>` estático deberían andar ya.

---

## Decisión de fondo

| Concepto | ¿Problema SEO? | Estado |
|---|---|---|
| Render 100% en cliente (CSR) | **Era el riesgo real** (bots de IA no ejecutan JS) | ✅ **Resuelto** — prerender en el build |
| `<head>` / schema / sitemap | Ya estaba bien | ✅ Reforzado (WebSite + grafo `@id` + FAQ de una sola fuente) |
| Crawleo por IAs (robots/llms) | Ya permitía a todos | ✅ robots con allowlist explícita + llms.txt |
| Una sola URL, sin rutas | No es penalización; es techo de alcance | ⏳ Opcional: páginas por vertical **si** hay copy específico (paso 2) |

**Resumen:** la palanca grande (prerender de la home) ya está hecha — ahora el copy, la FAQ y el schema viajan en el HTML inicial, que es lo único que leen GPTBot/ClaudeBot/PerplexityBot y la 1ª pasada de Google. Lo que queda es **crecimiento opcional**: más páginas por vertical, copy "extractable" en más secciones, y sobre todo presencia off-page (reviews, menciones), que pesa más para citas de IA que cualquier markup propio.
