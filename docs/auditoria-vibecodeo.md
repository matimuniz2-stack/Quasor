# Auditoría: ¿se nota que la landing está "vibecodeada"? (AI slop)

> **Fecha:** 2026-06-29
> **Objetivo:** que la landing de Quasor no se lea como una página generada por IA / plantilla.
> **Estado:** diagnóstico terminado. Plan accionable pendiente de ejecutar.
> **Cómo usar este doc:** abrilo en otra sesión de Claude Code y ejecutá la sección
> [Plan accionable](#plan-accionable-priorizado). Cada ítem dice qué tocar y dónde.

---

## 0. TL;DR

El tell más fuerte de una landing "vibecodeada" **no es ningún detalle puntual: es la *mismidad*.**
La gente no detecta *un* error, reconoce *la plantilla* a simple vista ("they all look the same" /
"screams AI/slop" aparecen cada uno en ~13% de los posts on-topic minados de Reddit).

Por eso la estrategia no es corregir un ítem suelto, sino **romper el patrón conjunto**.

Quasor **ya esquiva el tell visual #1 absoluto** (usa naranja, no el "AI purple") y tiene copy honesto
y específico. Pero acumula varios tells de manual —sobre todo el **acento serif-itálico repetido**,
**Inter**, la **numeración ornamental**, los **stat-banners** y la fórmula de copy **"No es solo un CRM"**—
que juntos delatan el origen.

---

## 1. Metodología y límites del research

- **Fuentes:** consenso de foros (un repo que minó 3,2M posts de Reddit en 47 subreddits →
  `JCarterJohnson/vibecoded-design-tells`) + blogs de diseñadores con corroboración cruzada
  (Adrian Krebs, Developers Digest, prg.sh, dev.to, etc.). Ver [Fuentes](#fuentes).
- **Calidad:** evidencia de grado **opinión/consenso**, no dato primario revisado por pares. Las cifras
  exactas (~13%, rankings) son blandas — el propio repo recomienda *"trust the relative ordering more
  than the exact percentages"*.
- **Sesgo:** el corpus está **muy concentrado en tells visuales/estructurales**. Los tells de **copy**
  salieron poco; los pocos relevantes se rescataron igual.
- **Caducidad:** los tells evolucionan. El morado es "el tell de 2024"; ya se menciona una estética
  emergente 2026 (cream + serif display + sage green) que también conviene evitar para no parecer la
  *nueva* plantilla.
- **Especificidad B2B:** ninguna fuente distingue tells B2B SaaS vs. consumo; la aplicación a B2B es
  inferencia.

---

## 2. Catálogo de tells (qué delata, según la gente)

### Meta-tell
- **Mismidad / reconocible a simple vista.** El esqueleto repetido (hero + features + social proof + CTA)
  con los defaults de siempre. Es el problema raíz; todo lo de abajo lo alimenta.

### Visual / diseño
- **Defaults crudos de shadcn/Tailwind** + **gradiente "AI purple"** (morado→índigo). Los dos tells que
  encabezan el ranking minado de Reddit. El morado-índigo es "the Times New Roman of AI-generated design"
  (se atribuye a Notion/Linear/Vercel/Tailwind UI dominando el training data).
- **Dark mode permanente** + **texto de cuerpo gris medio** (contraste apenas suficiente) + **labels de
  sección en MAYÚSCULAS**.
- **Gradientes por todos lados**, **texto de hero con gradiente**, **glows neón no solicitados**,
  **box-shadows de colores**. Regla que la IA absorbió: *"dark background + glow = premium"*.
- **Tipografía Inter para todo**, sobre todo en **headlines de hero centrados**, con frecuencia
  **una palabra-acento en serif-itálica** dentro de un header por lo demás en Inter. Inter = "el
  Helvetica/Times New Roman de la era LLM". (Inter *sola* es señal débil; la fuerza está en la combinación.)
- **Iconos Lucide** (el set que la IA mete por default) y **emojis usados como iconos**.

### Estructural / layout
- **Hero centrado + grilla de 3 tarjetas** (la disposición estereotípica).
- **Badge en MAYÚSCULAS justo encima del H1** del hero.
- **Tarjetas de feature idénticas con el icono arriba** (icon-on-top).
- **Secuencias de pasos numeradas "1, 2, 3".**
- **Filas de stat-banners** (con números redondos y dramáticos).
- **Bordes de color en las tarjetas** (borde superior o izquierdo) — citado como "casi tan confiable
  como los em-dashes en texto IA: una vez que lo notás, no podés dejar de notarlo".
- **Las mismas animaciones en todos lados.**

### Copy / texto (menos cubierto, pero relevante)
- **Fórmula de contraste "It's not just X, it's Y" / "No es X, es Y"** para fingir profundidad.
- **Em-dashes "como confeti"** (—) metidos por todos lados.
- **Buzzwords**: delve, unlock, empower, elevate, supercharge, "crucial", "navigate"…
- **Estructura vacía**: "headline, subheadline, tres bullets de beneficio, CTA — estructuralmente
  correcto, vacío de estrategia".
- **Headlines genéricos** tipo "Accelerate your marketing with the power of AI".

### Técnico (señales de descuido)
- OpenGraph incompleto/roto, favicon default/placeholder, **año de copyright desactualizado**.
  *(Quasor NO cae en esto — ver §4.)*

---

## 3. Cruce con Quasor — exposición actual

Ordenado por **cuánto delata hoy**. Referencias de archivo según el mapa del código
(`src/components/Sections.jsx`, `src/index.css`, `src/data.js`, `package.json`).

### 🔴 Alta exposición

| # | Tell | Cómo aparece en Quasor | Dónde |
|---|------|------------------------|-------|
| 1 | **Palabra-acento serif-itálica repetida** | Es la firma visual: *"Excel y…"*, *"todo lo que ya usás"*, *"Por tamaño de equipo"*, *"para vos?"*, *"Sin demoras"*, *"Sin recortes"*, *"con Quasor"*… en ~8 secciones. **El más delator.** | `.serif em` en `src/index.css`; headings en `Sections.jsx` (hero, marquee, pricing, etc.) |
| 2 | **Inter para todo** | Inter es la sans base. Combinada con el acento serif-itálico = la firma exacta era-LLM. | `--font-sans` / `Inter` en `src/index.css`; `index.html` (Google Fonts) |
| 3 | **Numeración ornamental** | Eyebrows numerados `01·INTEGRACIONES` … `11·CONTACTO` + `01/03 02/03 03/03` en tarjetas. | eyebrows en cada sección de `Sections.jsx` |
| 4 | **Stat-banner rows** con números redondos | `+43% / −95% / −97% / 100%` repetido en hero, caso real y "resultados por vertical". Tell + huele a métrica inflada. | hero stats + Testimonials en `Sections.jsx`; valores en `src/data.js` |
| 5 | **Iconos Lucide** | `lucide-react` es el set default de la IA. | `package.json` (`lucide-react`); imports en `Sections.jsx` |
| 6 | **Copy "No es solo un CRM" + em-dashes** | *"**No es solo un CRM.** Sabés qué ad pagó cada venta"* = fórmula "It's not just X, it's Y". Em-dashes en varios párrafos (*"—marca, modelo, km, GNC—"*). | sección Ad Tracking en `Sections.jsx`; textos en `src/data.js` |
| 7 | **Dark fijo + glow + gradient hero text** | Fondo oscuro permanente, glow naranja radial, texto de hero con gradiente, labels mono mayúscula. **Mitigado:** el acento es naranja, no morado. | mesh/glow en `src/index.css`; hero en `Sections.jsx` |

### 🟡 Media exposición

- **Grids de 3 tarjetas idénticas con icono arriba** (Services, Ad Tracking) + **dos comparativas con
  columna central "RECOMENDADO"** (WhyQuasor + Pricing). Skeleton B2B clásico.
- **"Mismas animaciones en todos lados"**: count-up, word-reveal, marquee infinito, tilt 3D, typewriter.
  Lindas por separado; juntas = "stack de microinteracciones" asociado a vibecoding.
- **Borde/tinte de acento en cards "recomendado"** (tell menor pero presente).

---

## 4. Lo que YA hace bien (NO tocar)

- ✅ **Naranja en vez de morado** → esquiva el tell visual #1 absoluto.
- ✅ **Hero asimétrico con mockup de producto real**, no el hero centrado genérico.
- ✅ **Cero emojis como iconos.**
- ✅ **Copy de dominio específico + hedges honestos** (*"datos de ejemplo"*, *"el objetivo, no la
  promesa"*, *"identidad bajo NDA"*, *"validado en piloto"*) y **voseo** consistente. Lo más anti-slop
  que tiene.
- ✅ **OG/Schema.org completos, favicons reales, © 2026** → los tells técnicos no aplican.
- ✅ **Sin "trusted by" falso, sin "4.9★", sin contadores inventados** presentados como prueba.

---

## 5. Plan accionable priorizado

> Orden por relación **impacto / esfuerzo**. Hacer de arriba hacia abajo.

1. **Racionar el serif-itálico.** Dejarlo en **1, máximo 2 lugares** (idealmente solo el hero). Quitarlo
   de las otras ~6 secciones. *Cambio de mayor impacto con menor esfuerzo.*
   → headings en `src/components/Sections.jsx`; regla `.serif em` en `src/index.css`.

2. **Quitar la numeración ornamental** de los eyebrows (`01· … 11·`). Mantener numeración solo donde hay
   secuencia real (proceso). → eyebrows en `Sections.jsx`.

3. **Cambiar Inter por una sans con carácter** (p. ej. Geist, General Sans, una grotesk). Rompe la firma
   tipográfica al instante. → `src/index.css` + `index.html` (carga de fuente).

4. **Reescribir "No es solo un CRM"** y peinar los em-dashes (los dos tells de *copy*).
   → `src/data.js` + sección Ad Tracking en `Sections.jsx`.

5. **Desarmar/replantear una de las dos comparativas "RECOMENDADO"** (la doble tabla con columna central
   destacada es muy template) y **reducir los stat-banners** de 3 apariciones a 1.
   → WhyQuasor + Pricing + hero/Testimonials en `Sections.jsx`.

### Extra (limpieza)
- **Borrar `Gemini_Generated_Image_ae36loae36loae36.png`** (~6,3 MB, sin referenciar en el código) para
  no dejar rastro de assets generados en el repo.

### Opcionales / más esfuerzo
- Reemplazar parte de los iconos **Lucide** por un set propio o custom SVG en las secciones más visibles.
- Reducir la densidad de animaciones (elegir 2–3 firmas y bajar el resto).
- Variar el layout de algún grid de 3 tarjetas para romper la repetición icon-on-top.

---

## 6. Fuentes

- `https://github.com/JCarterJohnson/vibecoded-design-tells` — repo que mina Reddit (base cuantitativa).
- `https://www.adriankrebs.ch/blog/design-slop/` — catálogo de tells visuales/estructurales (Show HN).
- `https://www.developersdigest.tech/blog/ai-design-slop-and-how-to-spot-it` — "16 Patterns That Out Your App as Vibe-Coded".
- `https://prg.sh/ramblings/Why-Your-AI-Keeps-Building-the-Same-Purple-Gradient-Website` — el mecanismo del look genérico.
- `https://dev.to/alanwest/why-every-ai-built-website-looks-the-same-blame-tailwinds-indigo-500-3h2p` — el morado/índigo de Tailwind.
- `https://www.925studios.co/blog/ai-slop-web-design-guide`, `https://uxplanet.org/how-to-spot-ai-generated-design-697aaabe76c8`,
  `https://huntingthemuse.net/library/how-to-tell-if-writing-is-ai`, `https://martech.org/lessons-from-letting-ai-vibe-code-a-landing-page/`,
  `https://dev.to/kaplich/i-analyzed-100-vibe-coded-websites-and-found-these-common-mistakes-5275` — corroboración.

### Preguntas abiertas (para profundizar)
- Tells concretos de **copy/texto** (frases cliché, claims vacíos, estructura) — poco cubiertos.
- Patrones de **social proof falso** (testimonios genéricos, logos placeholder, badges "4.9★").
- La estética **emergente 2026** (cream + serif display + sage green) — evitarla para no parecer la nueva plantilla.
- Diferencias específicas de tells en **B2B SaaS** vs. landings de consumo.
