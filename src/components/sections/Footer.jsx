// Cierre de página y mapa de anclas. Los IDs (#producto, #ads, …) son los mismos
// que usan la nav y el sitemap: se referencian, no se inventan.

const PRODUCTO = [
  { label: "Sistema", href: "#producto" },
  { label: "Atribución de ads", href: "#ads" },
  { label: "Casos de uso", href: "#casos" },
  { label: "Servicios", href: "#servicios" },
  { label: "Planes", href: "#precios" },
  { label: "FAQ", href: "#faq" },
];

// Los legales viven una sola vez: la columna Empresa y la barra final los comparten.
const LEGAL = [
  { label: "Privacidad", href: "/legal/privacidad" },
  { label: "Términos", href: "/legal/terminos" },
  { label: "Eliminar mis datos", href: "/legal/eliminar-datos" },
];

const EMPRESA = [
  { label: "Por qué Quasor", href: "#por-que" },
  { label: "Puesta en marcha", href: "#proceso" },
  { label: "Contacto", href: "#contacto" },
  ...LEGAL,
];

const REDES = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/quasortech/",
    external: true,
    aria: "Instagram de Quasor — abre en una pestaña nueva",
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/5492236892809",
    external: true,
    aria: "WhatsApp de Quasor — abre en una pestaña nueva",
  },
  { label: "Email", href: "mailto:ventas@quasor.io", aria: "Escribir a ventas@quasor.io" },
];

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
      {title}
    </span>
    <ul className="mt-3 md:mt-4 flex flex-col">
      {links.map(({ label, href, external, aria }) => (
        <li key={href}>
          <a
            href={href}
            className={LINK}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : null)}
            {...(aria ? { "aria-label": aria } : null)}
          >
            {label}
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
  <footer className="border-t border-line bg-surface-2 theme-tx">
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
            Quasor CRM: pipeline de ventas y atribución publicitaria para inmobiliarias y
            concesionarias. Desde Mar del Plata, para toda la Argentina.
          </p>
          <div className="mt-5 md:mt-6 flex flex-col">
            <a href="mailto:ventas@quasor.io" className={MICRO_LINK}>
              ventas@quasor.io
            </a>
            <a href="tel:+5492236892809" className={MICRO_LINK}>
              +54 9 223 689 2809
            </a>
          </div>
        </div>

        <Column id="footer-producto" title="Producto" links={PRODUCTO} />
        <Column id="footer-empresa" title="Empresa" links={EMPRESA} />
        <Column id="footer-redes" title="Redes" links={REDES} arrow />
      </div>

      <div
        data-reveal
        style={{ "--d": "120ms" }}
        className="hairline mt-12 md:mt-14 pt-6 flex flex-wrap items-center justify-between gap-x-8 gap-y-2"
      >
        <span className="label ink-3">
          © {new Date().getFullYear()} Quasor · Mar del Plata, AR
        </span>
        {/* El punto medio va DETRÁS de cada enlace, no delante del siguiente:
            si la fila se parte a 390px, el separador queda cerrando la línea
            en vez de abrir la siguiente. */}
        <ul className="flex flex-wrap items-center gap-x-2">
          {LEGAL.map(({ label, href }, i) => (
            <li key={href} className="flex items-center gap-2">
              <a href={href} className={LEGAL_LINK}>
                {label}
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
