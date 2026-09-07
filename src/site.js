// Navegación y datos de contacto del sitio — fuente ÚNICA.
//
// Los consumen tres lugares y por eso viven acá y no dentro de un componente:
//
//   · src/components/sections/Nav.jsx      (la barra de la landing)
//   · src/components/sections/Footer.jsx   (el cierre de la landing)
//   · scripts/gen-legal.mjs                (el cromado de las 6 páginas legales)
//
// El tercero es el motivo del archivo: las legales son HTML estático generado
// por un script de Node, no React, así que la única forma de que no se queden
// atrás cuando cambia la navegación es que lean los mismos arrays. Cuando el
// rediseño tocó la landing, la nav y el footer de las legales quedaron a mano y
// se desincronizaron; con esto no puede volver a pasar.
//
// Los `href` de sección se guardan como hash suelto (`#producto`) porque la
// landing los resuelve dentro de la misma página. Las legales viven en otra URL
// y necesitan el prefijo: para eso está `absolute()`.
//
// Cada entrada trae su etiqueta en los dos idiomas (`es` / `en`): las tres
// páginas legales en inglés usan el mismo cromado y no hay un home en inglés,
// así que la nav en inglés apunta al home en español a propósito — el rótulo
// dice a dónde vas, no en qué idioma está lo que hay del otro lado.

/** `#producto` → `/#producto`. Los que ya son absolutos o externos no se tocan. */
export const absolute = (href) => (href.startsWith("#") ? `/${href}` : href);

/** Toma la etiqueta del idioma pedido, con el español como respaldo. */
export const t = (item, lang = "es") => item[lang] || item.es;

// El descriptor del wordmark. Entra recién en xl en la landing: abajo de ese
// ancho los ocho enlaces ya se comen el espacio.
export const DESCRIPTOR = {
  es: "CRM + Atribución de ads",
  en: "CRM + ad attribution",
};

export const CTA = {
  es: "Coordinar 30 min",
  en: "Book 30 min",
};

// Los ocho anclas de la landing, en orden de aparición.
export const NAV_LINKS = [
  { href: "#producto", es: "Producto", en: "Product" },
  { href: "#ads", es: "Atribución", en: "Attribution" },
  { href: "#casos", es: "Casos", en: "Cases" },
  { href: "#servicios", es: "Servicios", en: "Services" },
  { href: "#por-que", es: "Por qué", en: "Why Quasor" },
  { href: "#proceso", es: "Proceso", en: "Process" },
  { href: "#precios", es: "Planes", en: "Plans" },
  { href: "#faq", es: "FAQ", en: "FAQ" },
];

export const CONTACT = {
  email: "ventas@quasor.io",
  phone: "+54 9 223 689 2809",
  tel: "tel:+5492236892809",
  whatsapp: "https://wa.me/5492236892809",
  instagram: "https://www.instagram.com/quasortech/",
  city: { es: "Mar del Plata, AR", en: "Mar del Plata, AR" },
};

export const BLURB = {
  es: "Quasor CRM: pipeline de ventas y atribución publicitaria para inmobiliarias y concesionarias. Desde Mar del Plata, para toda la Argentina.",
  en: "Quasor CRM: sales pipeline and ad attribution for real estate agencies and car dealerships. From Mar del Plata, for all of Argentina.",
};

// ------------------------------------------------------------------ FOOTER ---

export const FOOTER_PRODUCTO = [
  { href: "#producto", es: "Sistema", en: "The system" },
  { href: "#ads", es: "Atribución de ads", en: "Ad attribution" },
  { href: "#casos", es: "Casos de uso", en: "Use cases" },
  { href: "#servicios", es: "Servicios", en: "Services" },
  { href: "#precios", es: "Planes", en: "Plans" },
  { href: "#faq", es: "FAQ", en: "FAQ" },
];

// Los legales viven una sola vez. Cada documento se declara con sus DOS
// idiomas juntos, así el par es↔en es estructural: no puede desalinearse como
// pasaba con dos arrays espejo que dependían de "mismo orden, misma cantidad".
//
// Las URL son limpias (sin `.html`) porque Vercel corre con `cleanUrls: true` y
// la versión con extensión responde con un 301. De estas mismas URL sale la
// tabla de archivos de scripts/gen-legal.mjs, así que cada ruta legal se
// escribe UNA vez en todo el repo.
export const LEGAL_DOCS = [
  {
    es: { href: "/legal/privacidad", label: "Privacidad" },
    en: { href: "/legal/en/privacy", label: "Privacy" },
  },
  {
    es: { href: "/legal/terminos", label: "Términos" },
    en: { href: "/legal/en/terms", label: "Terms" },
  },
  {
    es: { href: "/legal/eliminar-datos", label: "Eliminar mis datos" },
    en: { href: "/legal/en/data-deletion", label: "Delete my data" },
  },
];

/**
 * Los legales del idioma pedido, con la misma forma `{href, es, en}` que el
 * resto de las entradas del pie — así los consumidores no distinguen una
 * columna de legales de cualquier otra.
 */
export const legalLinks = (lang = "es") =>
  LEGAL_DOCS.map((doc) => ({
    href: doc[lang].href,
    es: doc.es.label,
    en: doc.en.label,
  }));

export const FOOTER_EMPRESA = [
  { href: "#por-que", es: "Por qué Quasor", en: "Why Quasor" },
  { href: "#proceso", es: "Puesta en marcha", en: "Onboarding" },
  { href: "#contacto", es: "Contacto", en: "Contact" },
];

export const FOOTER_REDES = [
  {
    href: CONTACT.instagram,
    es: "Instagram",
    en: "Instagram",
    external: true,
    aria: {
      es: "Instagram de Quasor — abre en una pestaña nueva",
      en: "Quasor on Instagram — opens in a new tab",
    },
  },
  {
    href: CONTACT.whatsapp,
    es: "WhatsApp",
    en: "WhatsApp",
    external: true,
    aria: {
      es: "WhatsApp de Quasor — abre en una pestaña nueva",
      en: "Quasor on WhatsApp — opens in a new tab",
    },
  },
  {
    href: `mailto:${CONTACT.email}`,
    es: "Email",
    en: "Email",
    aria: {
      es: `Escribir a ${CONTACT.email}`,
      en: `Email ${CONTACT.email}`,
    },
  },
];

export const FOOTER_TITLES = {
  producto: { es: "Producto", en: "Product" },
  empresa: { es: "Empresa", en: "Company" },
  redes: { es: "Redes", en: "Social" },
};
