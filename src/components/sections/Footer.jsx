import {
  FOOTER_PRODUCTO,
  FOOTER_EMPRESA,
  legalLinks,
  FOOTER_REDES,
  FOOTER_TITLES,
  BLURB,
  CONTACT,
  t,
} from "../../site.js";

// Cierre de página y mapa de anclas. Los IDs (#producto, #ads, …) son los
// mismos que usan la nav y el sitemap: se referencian, no se inventan.
//
// Las cuatro columnas y los legales viven en src/site.js porque el pie de las
// páginas legales — HTML estático generado por scripts/gen-legal.mjs, fuera de
// React — arma el mismo footer con los mismos arrays.

// Los legales aparecen dos veces en el pie (en la columna Empresa y en la barra
// final), y una sola vez en el archivo de datos.
const LEGAL = legalLinks();
const EMPRESA = [...FOOTER_EMPRESA, ...LEGAL];

// El área táctil de 44px solo hace falta en mobile; en desktop la lista se
// compacta para que la columna no quede desarmada.
//
// El color base va como utilidad arbitraria y no como .ink-2 / .ink-3: esas
// clases viven FUERA de @layer en index.css y en la cascada le ganan a
// cualquier utilidad de Tailwind, incluido el hover. Con text-[var(--ink-2)]
// las dos declaraciones quedan en @layer utilities y gana la más específica.
const LINK =
  "inline-flex items-center gap-1.5 min-h-[44px] md:min-h-0 md:py-[3px] " +
  "text-[13.5px] leading-snug text-[var(--ink-2)] transition-colors " +
  "hover:text-[var(--accent-text)]";

const MICRO_LINK =
  "label label-lc text-[var(--ink-3)] inline-flex items-center min-h-[44px] " +
  "md:min-h-0 md:py-[2px] w-fit transition-colors hover:text-[var(--accent-text)]";

const LEGAL_LINK =
  "label text-[var(--ink-3)] inline-flex items-center min-h-[44px] md:min-h-0 " +
  "transition-colors hover:text-[var(--accent-text)]";

const Column = ({ id, title, links, arrow = false }) => (
  <nav aria-labelledby={id}>
    <span id={id} className="label ink">
      {t(title)}
    </span>
    <ul className="mt-3 md:mt-4 flex flex-col">
      {links.map((item) => (
        <li key={item.href}>
          <a
            href={item.href}
            className={LINK}
            {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : null)}
            {...(item.aria ? { "aria-label": t(item.aria) } : null)}
          >
            {t(item)}
            {arrow && (
              <span aria-hidden="true" className="text-[11px] leading-none">
                ↗
              </span>
            )}
          </a>
        </li>
      ))}
    </ul>
  </nav>
);

export const Footer = () => (
  <footer className="bg-surface-2 theme-tx">
    <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-14 md:py-16 pb-28 md:pb-16">
      <div
        data-reveal-group
        className="grid gap-y-10 gap-x-8 md:gap-x-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]"
      >
        <div>
          {/* El pseudo-elemento estira el área táctil a 46px sin mover el
              wordmark ni el párrafo de abajo (mismo recurso que la nav). */}
          <a
            href="#"
            aria-label="Quasor — volver al inicio de la página"
            className="relative inline-block text-[30px] font-semibold tracking-[-0.04em] ink leading-none before:content-[''] before:absolute before:-inset-y-2 before:inset-x-0 md:before:hidden"
          >
            quasor<span className="accent-text">.</span>
          </a>
          <p className="ink-3 text-[13.5px] leading-relaxed mt-4 max-w-[300px]">
            {t(BLURB)}
          </p>
          <div className="mt-5 md:mt-6 flex flex-col">
            <a href={`mailto:${CONTACT.email}`} className={MICRO_LINK}>
              {CONTACT.email}
            </a>
            <a href={CONTACT.tel} className={MICRO_LINK}>
              {CONTACT.phone}
            </a>
          </div>
        </div>

        <Column id="footer-producto" title={FOOTER_TITLES.producto} links={FOOTER_PRODUCTO} />
        <Column id="footer-empresa" title={FOOTER_TITLES.empresa} links={EMPRESA} />
        <Column id="footer-redes" title={FOOTER_TITLES.redes} links={FOOTER_REDES} arrow />
      </div>

      <div
        data-reveal
        style={{ "--d": "120ms" }}
        className="mt-12 md:mt-14 flex flex-wrap items-center justify-between gap-x-8 gap-y-2"
      >
        <span className="label ink-3">
          © {new Date().getFullYear()} Quasor · {t(CONTACT.city)}
        </span>
        {/* El punto medio va DETRÁS de cada enlace, no delante del siguiente:
            si la fila se parte a 390px, el separador queda cerrando la línea
            en vez de abrir la siguiente. */}
        <ul className="flex flex-wrap items-center gap-x-2">
          {LEGAL.map((item, i) => (
            <li key={item.href} className="flex items-center gap-2">
              <a href={item.href} className={LEGAL_LINK}>
                {t(item)}
              </a>
              {i < LEGAL.length - 1 && (
                <span aria-hidden="true" className="label text-[var(--ink-3)]">
                  ·
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </footer>
);
