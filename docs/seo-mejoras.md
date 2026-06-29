# SEO — Diagnóstico y hoja de ruta de mejoras

> Guía para mejorar el SEO de la landing de Quasor (`quasor.io`).
> Estado relevado: **2026-06-29**. Stack: Vite 6 + React 18 (SPA, sin SSR/SSG), deploy en Vercel.
> Cada ítem marca **impacto** (🟢 alto / 🟡 medio / ⚪ bajo) y **esfuerzo** aproximado.

---

## TL;DR

- **Ser "una sola página" NO es malo para SEO.** Lo que conviene cambiar es que hoy el contenido se renderiza **100% en el cliente** (CSR): el `<body>` llega vacío y lo arma React.
- El `<head>` (title, meta, Open Graph, JSON-LD, sitemap, robots) ya está **bien hecho** → previews sociales y datos estructurados funcionan aunque el body esté vacío.
- **La mejora de mayor impacto y bajo esfuerzo es prerenderizar/SSG la home**, porque el contenido es estático (sale de `src/data.js` + componentes, sin datos por usuario).
- Una sola URL = un solo clúster de keywords. Para más alcance → páginas dedicadas por vertical (decisión de marketing, no un bug técnico).

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

### 1. 🟢 Prerenderizar / SSG la home — *la mejora clave*

Que el HTML salga del build **ya con el contenido**, sin cambiar la UX. El sitio es estático, así que es casi gratis. Opciones (de menor a mayor cambio):

- **A) Plugin de prerender sobre el Vite actual** — menor fricción.
  - `vite-plugin-prerender` o `vite-prerender-plugin` (Puppeteer headless rendea las rutas al final del `vite build`).
  - Pros: cambio mínimo, no se toca la app. Contras: arrastra Chromium al build.
- **B) Migrar a Astro** — lo más limpio para una landing.
  - Se pueden reusar los componentes React como **islas** (`client:visible` solo donde haya interactividad real: switcher de demo, dashboard).
  - Pros: HTML estático por defecto, JS mínimo, muy buen Core Web Vitals. Contras: re-armar el shell de la página.
- **C) Vike (ex `vite-plugin-ssr`) en modo SSG / pre-rendering** — si se quiere quedar en Vite+React con routing real.

**Criterio de aceptación:** `curl -s https://quasor.io/ | grep -i "<h1"` devuelve el H1 y el copy principal **sin ejecutar JS**. Ver "Cómo verificar" abajo.

> Nota: las legales ya se prerenderizan (`gen-legal.mjs`). La home es la que falta.

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

### 4. ⚪ Higiene y mejoras incrementales

- [ ] **`<title>` y `meta description` por página** una vez que existan rutas (no repetir el de la home).
- [ ] Mantener **JSON-LD sincronizado con el copy** (el `FAQPage` del `index.html` debe coincidir con el FAQ real de `src/data.js`; hoy hay que actualizarlos a mano en dos lados — considerar generarlo del mismo origen).
- [ ] **`alt` descriptivo** en todas las imágenes con peso semántico (logos de integraciones, capturas).
- [ ] **`lastmod` del `sitemap.xml`** actualizado cuando cambia el contenido (hoy es manual: `public/sitemap.xml`).
- [ ] Revisar **Core Web Vitals** (LCP/CLS/INP) en PageSpeed Insights; el dashboard animado del hero es el principal sospechoso de LCP/CLS.
- [ ] Confirmar que **no se está cargando contenido importante solo tras interacción** (acordeones, tabs) sin estar en el DOM.
- [ ] Dar de alta el sitio en **Google Search Console** y **Bing Webmaster Tools**; mandar el sitemap y mirar "Cobertura" / "Páginas renderizadas".
- [ ] Verificar que el `og-image.jpg` y las URLs absolutas de schema sigan vivas tras cada cambio de dominio/branding.

---

## Cómo verificar (tests rápidos)

```bash
# 1. ¿El HTML crudo trae el contenido o llega vacío? (hoy: llega vacío salvo el <head>)
curl -s https://quasor.io/ | grep -ci "<h1"          # esperado tras prerender: >= 1
curl -s https://quasor.io/ | grep -i "inmobiliarias" # ¿aparece el copy sin JS?

# 2. Ver el <head> y los JSON-LD
curl -s https://quasor.io/ | grep -iE "og:title|application/ld\+json|canonical"

# 3. Las legales SÍ deberían traer contenido sin JS (control positivo)
curl -s https://quasor.io/legal/privacidad.html | grep -ci "privacidad"

# 4. robots + sitemap accesibles
curl -s https://quasor.io/robots.txt
curl -s https://quasor.io/sitemap.xml | head
```

Herramientas:
- **Google Search Console → Inspección de URL → "Probar URL publicada" → "Ver página renderizada"**: muestra exactamente lo que Google ve después de renderizar el JS. Es la prueba de fuego.
- **Rich Results Test** (search.google.com/test/rich-results): valida el `FAQPage` / `SoftwareApplication`.
- **PageSpeed Insights**: Core Web Vitals reales (campo + lab).
- Para previews sociales: depurador de Facebook/LinkedIn y "Card validator" — aunque al usar `<head>` estático deberían andar ya.

---

## Decisión de fondo

| Concepto | ¿Problema SEO? | Acción |
|---|---|---|
| Una sola URL, sin rutas | No es penalización; es techo de alcance | Sumar páginas por vertical **si** hay copy específico (paso 2) |
| Render 100% en cliente (CSR) | **Sí, riesgo real** | **Prerender / SSG (paso 1)** ← prioridad |
| `<head>` / schema / sitemap | Ya está bien | Mantener sincronizado con el copy |

**Resumen:** lo de "página autocontenida" no perjudica. La palanca real es **prerenderizar la home** (barato, porque es estática); el resto es crecimiento opcional vía más páginas y contenido.
