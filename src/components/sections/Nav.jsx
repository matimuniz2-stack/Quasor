import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/index.js";
import { NAV_LINKS, DESCRIPTOR, CTA, t } from "../../site.js";

// Los ocho anclas viven en src/site.js: las comparten esta barra, el footer y
// el cromado de las páginas legales (HTML estático, fuera de React).
//
// La fila de enlaces aparece recién en lg: medido sobre la tipografía real, los
// ocho suman 381px de texto y con el interlineado mínimo no entran junto al
// wordmark, el toggle y el CTA en un viewport de 768px. Abajo de lg la
// navegación completa vive en el menú desplegable, así ninguna sección queda
// sin entrada en ningún ancho.

/* Barra de progreso de lectura, pegada al filo superior del header.
   Anima transform y no width, para no forzar layout en cada frame; el listener
   se coalesce con rAF porque Lenis dispara scroll en todos los frames. */
const ScrollProgress = () => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = null;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      el.style.transform = `scaleX(${p.toFixed(4)})`;
      raf = null;
    };
    const onScroll = () => {
      if (raf == null) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf != null) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[2px] overflow-hidden">
      <div
        ref={ref}
        className="h-full w-full origin-left"
        style={{ background: "var(--accent)", transform: "scaleX(0)", willChange: "transform" }}
      />
    </div>
  );
};

const ThemeToggle = ({ theme, onToggle }) => {
  const dark = theme === "dark";
  const label = dark ? "Cambiar a tema claro" : "Cambiar a tema oscuro";

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={label}
      title={label}
      // El círculo mide 32px por diseño; el ::before lo lleva a 44px de área
      // táctil en mobile sin alterar la altura de la barra.
      className="relative shrink-0 w-8 h-8 grid place-items-center rounded-full border border-line text-[var(--ink-2)] hover:text-[var(--ink)] transition-colors before:content-[''] before:absolute before:-inset-1.5 md:before:hidden"
    >
      {dark ? (
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" aria-hidden="true">
          <circle cx="8" cy="8" r="3.1" />
          <path d="M8 1.2v1.4M8 13.4v1.4M1.2 8h1.4M13.4 8h1.4M3.3 3.3l1 1M11.7 11.7l1 1M12.7 3.3l-1 1M4.3 11.7l-1 1" />
        </svg>
      ) : (
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" aria-hidden="true">
          <path d="M13.4 9.9A5.6 5.6 0 0 1 6.1 2.6 5.9 5.9 0 1 0 13.4 9.9Z" />
        </svg>
      )}
    </button>
  );
};

export const Nav = ({ theme, onToggleTheme }) => {
  const [open, setOpen] = useState(false);
  const burgerRef = useRef(null);

  // Escape cierra y devuelve el foco al disparador: si no, el foco queda
  // atrapado dentro de un contenedor que acaba de volverse inert.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        burgerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header
      className="sticky top-0 z-40 border-b border-line backdrop-blur-xl theme-tx"
      style={{ background: "color-mix(in oklab, var(--bg) 82%, transparent)" }}
    >
      <ScrollProgress />

      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <div className="h-[60px] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="#"
              aria-label="Quasor CRM"
              className="inline-flex items-center min-h-[44px] font-semibold text-[19px] tracking-[-0.035em] leading-none"
            >
              quasor<span className="accent-text">.</span>
            </a>
            {/* El descriptor entra recién en xl. El contenedor tope de 1280px deja
                1200px útiles y los ocho enlaces con su interlineado ya se llevan
                549: en lg el descriptor los pisaba. Separa del wordmark por
                espacio, no por filete. */}
            <span className="hidden xl:inline label ink-3 whitespace-nowrap ml-1">{t(DESCRIPTOR)}</span>
          </div>

          <nav aria-label="Secciones" className="hidden lg:flex items-center gap-x-5 xl:gap-x-6 min-w-0">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="nav-link text-[13.5px] ink-2 whitespace-nowrap">
                {t(l)}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />

            <Button href="#contacto" className="max-sm:hidden text-[13px] px-4 py-2">
              {t(CTA)}<span className="arrow" aria-hidden="true">→</span>
            </Button>

            <button
              ref={burgerRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="nav-mobile"
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              className="lg:hidden w-11 h-11 -mr-2 grid place-items-center rounded-[var(--r-sm)] text-[var(--ink-2)] hover:text-[var(--ink)] transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
                {open ? <path d="M4.2 4.2l9.6 9.6M13.8 4.2l-9.6 9.6" /> : <path d="M2.5 6h13M2.5 12h13" />}
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div
        id="nav-mobile"
        inert={open ? undefined : ""}
        className={`lg:hidden overflow-hidden border-t border-line transition-[max-height,opacity] duration-300 ease-out ${
          open ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 pt-2 pb-6">
          <nav aria-label="Menú de secciones" className="flex flex-col">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={close}
                className="nav-link flex items-center min-h-[44px] py-3 text-[15px] ink-2"
              >
                {t(l)}
              </a>
            ))}
          </nav>

          <div className="mt-5">
            <Button href="#contacto" onClick={close} className="w-full text-[13px] px-4 py-3">
              {t(CTA)}<span className="arrow" aria-hidden="true">→</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
