# Dirección B — "Instrumento" · especificación de implementación

> Sistema de diseño del rediseño de la landing. Es la fuente de verdad para
> cualquiera (persona o agente) que escriba una sección.
> Los tokens viven en `src/index.css`; las primitivas en
> `src/components/motion.jsx` y `src/components/ui/`.

---

## 0. La idea

Fondo casi-negro (o casi-blanco) sobre el que el **ámbar de marca `#FF9100`** —el
del wordmark real— funciona como **señal**, no como decoración. Cada bloque
grande vive dentro de un **stage**: un panel de color saturado y apagado que
sostiene la UI real del producto o un bloque de datos. La página se lee como el
instrumento, no como el folleto.

Referencias: lapyme.com.ar (paneles de color por sección), Linear (contención,
filetes finos), paper.design (la UI real como protagonista).

**Lo que esta dirección NO hace** (son los tells que salimos a corregir):

- Sin acento serif-itálico. Sin Instrument Serif. Sin Inter.
- Sin gradientes decorativos, sin glow, sin grano, sin mesh blobs.
- Sin tarjetas idénticas con el icono arriba.
- Sin eyebrows numerados ornamentales (`01·`, `02·`…) salvo donde hay secuencia real.
- Sin filas de stat-banners repetidas. Los números grandes aparecen **una vez** por sección.
- Sin bordes de color a la izquierda de las tarjetas.

---

## 1. Tokens

Todos son variables CSS con valor para **claro y oscuro**. Nunca escribas un hex
de marca a mano: usá el token. La única excepción legítima son los colores de
serie de un gráfico y los colores de marca de terceros (WhatsApp, Meta…).

| Token | Para qué |
|---|---|
| `--bg` / `--bg-2` / `--bg-3` | fondo de página / superficie elevada / hover |
| `--ink` / `--ink-2` / `--ink-3` | texto principal / secundario / micro-labels |
| `--line` / `--line-2` | filete sutil / filete visible |
| `--accent` | ámbar de marca. Marcas, rellenos y **fondo** de botón, en los dos temas |
| `--accent-text` | ámbar para **texto** (se oscurece en claro para llegar a 4.5:1) |
| `--accent-on` | color del texto **encima** del ámbar |
| `--accent-soft` / `--accent-ring` | fondo tenue / halo de foco y hover |
| `--pos` / `--neg` | positivo / negativo |
| `--stage-amber`, `--stage-teal`, `--stage-indigo` | fondos de stage |
| `--stage-line` / `--stage-hair` | borde y divisor **dentro** de un stage |
| `--r-xs … --r-lg`, `--r-pill` | radios (3 / 6 / 10 / 16 / 999) |

**Regla de contraste, ya verificada:** dentro de un stage, el texto usa los
tokens de tinta normales (`--ink`, `--ink-2`, `--ink-3`). No inventes un gris por
hue de stage: los tres fondos son igual de oscuros (o de claros) y las tintas
estándar pasan AA sobre los tres. `--ink-3` es el piso: no bajes de ahí.

**El ámbar en texto:** en claro, `--accent` (#FF9100) sobre fondo claro da 2.1:1
y **no se puede usar para texto**. Para texto siempre `--accent-text`. Para
rellenos, barras, puntos, bordes y fondos de botón, `--accent`.

---

## 2. Tipografía

Dos familias, nada más:

- **Schibsted Grotesk** — display y texto.
- **JetBrains Mono** — labels, cifras, metadatos.

| Clase | Uso |
|---|---|
| `.display` | h1. weight 600, tracking −0.042em, lh 1.04 |
| `.display-2` | h2/h3 de sección. weight 600, tracking −0.036em, lh 1.08 |
| `.label` | mono 11px, mayúsculas, tracking .14em — los eyebrows y metadatos |
| `.label-lc` | modificador de `.label`: minúsculas, tracking normal |
| `.num` | `tabular-nums` + tracking −0.03em — TODA cifra que cambie o se compare |

Escala (Tailwind arbitrario está bien): h1 `text-[38px] md:text-[54px] xl:text-[62px]`,
h2 `text-[30px] md:text-[42px]`, h3 `text-[22px] md:text-[25px]`,
título de bloque `text-[17px] md:text-[18px] font-semibold`, cuerpo
`text-[15px] md:text-base leading-relaxed` en `ink-2`.

Los titulares son **moderados**, no gigantes: el tell de la página vieja era el
grotesk negro a 72px en cada sección.

---

## 3. Superficies y componentes

```jsx
import { Button, Badge, Chip, Panel, Stage, SectionHead } from './ui/index.js';
import { Lines, CountUp, useParallax } from './motion.jsx';
```

- **`<Stage tone="amber|teal|indigo|neutral">`** — el panel de color. Es la firma
  visual. Una sección grande = un stage. No los apiles ni los anides.
- **`<Panel hover>`** — superficie neutra con filete. Para bloques secundarios.
- **`<Chip accent>`** — tag redondeado. `accent` solo donde significa algo.
- **`<Badge dot pulse>`** — indicador de estado con punto.
- **`<Button variant="primary|ghost">`** — envolvé la flecha final en
  `<span className="arrow">→</span>` para que se desplace en hover.
- **`<SectionHead label meta title={[...]} lead />`** — el encabezado de sección.
  **Usalo siempre**: es lo que mantiene el ritmo entre secciones escritas por
  distintas manos. `title` es un array de LÍNEAS (los cortes son composición).

Radios: botones y chips chicos (`--r-sm` / pill), paneles `--r-md`, stages
`--r-lg`. Nada de `rounded-2xl` por todos lados.

---

## 4. Animaciones

Cinco gestos, aplicados con criterio. Casi todo es **declarativo**: un
`IntersectionObserver` global en `App.jsx` agrega `.in` y el CSS hace el resto.
Las secciones no necesitan hooks.

| Gesto | Cómo se pide |
|---|---|
| **rise** — entrada del hero, sin esperar scroll | `className="rise"` + `style={{ "--d": "160ms" }}` |
| **reveal** — aparece al entrar en pantalla | `data-reveal` (+ `--d` para el delay) |
| **grupo escalonado** | `data-reveal-group` en el padre; los hijos directos entran de a uno |
| **lines** — titular que sube desde una máscara | `<Lines as="h2" lines={["…","…"]} />` (`SectionHead` ya lo hace) |
| **fill** — barra que crece hasta su valor | `className="fill"` + `style={{ "--w": "62%", "--d": "120ms" }}`, dentro de un ancestro con `data-reveal` |
| **trace** — pulso ámbar recorriendo un camino SVG | `className="trace-static"` para la línea, `className="trace-pulse"` para el pulso |
| **contador** | `<CountUp to={43} format={n => `+${Math.round(n)} %`} />` |
| **paralaje** | `const ref = useParallax(); <div ref={ref} className="plate">` — SOLO la placa del hero |

Micro-interacciones permitidas (ya están en el CSS, no inventes otras):
`.btn:hover .arrow`, `.chip:hover`, `.panel-hover:hover`, `.nav-link:hover`,
`.acc-open` para el acordeón, `.pulse-dot` (**una sola vez en toda la página**,
en el badge del demo en vivo).

**Reglas duras**

1. Todo debe llegar a su estado final con `prefers-reduced-motion: reduce`. El
   bloque global de `index.css` ya lo cubre para las clases de arriba; si
   agregás una animación propia, cubrila vos.
2. Nada anima `width`/`height`/`top`/`left` salvo `.fill` (que es el punto).
   Usá `transform` y `opacity`.
3. El prerender de build (`renderToStaticMarkup`) **no corre efectos**. Cualquier
   cosa que dependa de JS tiene que renderizar contenido legible en su estado
   inicial. `CountUp` ya arranca en el valor final por eso.
4. Un contador por sección como mucho. Si todo cuenta, no cuenta nada.

---

## 5. Estructura y convenciones de código

- Un componente de sección por archivo, en `src/components/sections/`.
- **Export nombrado**, sin default: `export const AdTracking = () => (…)`.
- Los datos vienen de `src/data.js` cuando ya están ahí (`SERVICES`, `PROCESS`,
  `TESTIMONIALS`, `EXPECTED_RESULTS`, `FAQ`). **No dupliques ni cambies cifras.**
  `FAQ` alimenta el JSON-LD del build: si tocás el texto de una pregunta, se
  desincroniza el schema.
- Tailwind v4 + las clases utilitarias de `index.css`. Sin CSS nuevo en archivos
  de sección: si falta un patrón, va a `index.css`.
- Sin dependencias nuevas.
- Contenedor estándar: `max-w-[1280px] mx-auto px-6 md:px-10`.
- Ritmo vertical de sección: `py-20 md:py-28`.

**IDs de ancla — no se tocan** (los usan la nav, el footer y el sitemap):
`#producto`, `#ads`, `#casos`, `#caso`, `#servicios`, `#por-que`, `#proceso`,
`#precios`, `#faq`, `#contacto`.

**Accesibilidad:** un solo `<h1>`; jerarquía de headings correcta; `aria-hidden`
en todo lo decorativo (SVG, flechas, puntos); área táctil ≥44px en mobile;
`aria-expanded`/`aria-controls` en el acordeón; foco visible (ya está en el CSS).

**Copy:** castellano rioplatense, voseo, registro profesional. Sin
informalidades, sin muletillas de marketing, sin fórmulas "no es solo X, es Y",
y con los guiones largos racionados. Las cifras son las que ya están en el repo:
si falta un dato real, va entre corchetes, no se inventa.
