import { useState, useEffect, useMemo, useRef } from 'react';
import { SiWhatsapp, SiMeta, SiGoogleads, SiInstagram, SiGmail } from 'react-icons/si';
import { Dashboard } from './Dashboard.jsx';
import { SERVICES, PROCESS, TESTIMONIALS, EXPECTED_RESULTS, FAQ, getCurrentSlots } from '../data.js';

// 3D tilt wrapper — perspective + lerp-smoothed rotation following the cursor.
// No-op on touch devices and when prefers-reduced-motion is set.
const TiltWrapper = ({ children, max = 5 }) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let targetX = 0, targetY = 0, currX = 0, currY = 0, raf;

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      targetX = ((e.clientX - r.left) / r.width - 0.5) * 2;   // -1..1
      targetY = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    const onLeave = () => { targetX = 0; targetY = 0; };
    const tick = () => {
      currX += (targetX - currX) * 0.08;
      currY += (targetY - currY) * 0.08;
      const ry = currX * max;
      const rx = -currY * max * 0.6;
      el.style.transform = `perspective(1600px) rotateX(${rx.toFixed(3)}deg) rotateY(${ry.toFixed(3)}deg)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      el.style.transform = '';
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{ willChange: 'transform', transformStyle: 'preserve-3d', transition: 'transform 0.4s cubic-bezier(.2,.7,.2,1)' }}
    >
      {children}
    </div>
  );
};

// Typing terminal (for process steps)
const Terminal = ({ lines, playKey }) => {
  const [shown, setShown] = useState([]);
  const [cursorLine, setCursorLine] = useState(0);
  const [cursorChar, setCursorChar] = useState(0);

  useEffect(() => {
    setShown([]); setCursorLine(0); setCursorChar(0);
  }, [playKey]);

  useEffect(() => {
    if (cursorLine >= lines.length) return;
    const line = lines[cursorLine];
    const speed = line.p === "$" ? 32 : line.p === ">" ? 24 : 18;
    if (cursorChar < line.t.length) {
      const id = setTimeout(() => setCursorChar(cursorChar + 1), speed);
      return () => clearTimeout(id);
    }
    const wait = line.w || 240;
    const id = setTimeout(() => {
      setShown(s => [...s, line]);
      setCursorLine(cursorLine + 1);
      setCursorChar(0);
    }, wait);
    return () => clearTimeout(id);
  }, [cursorLine, cursorChar, playKey]);

  const typing = cursorLine < lines.length ? lines[cursorLine] : null;

  return (
    <div className="mono text-[12.5px] leading-[1.8] bg-[var(--bg-2)] border border-line rounded-lg p-4 h-[180px] overflow-hidden">
      {shown.map((l, i) => (
        <div key={i} className="flex gap-2">
          <span className="ink-3 w-3 shrink-0">{l.p}</span>
          <span className={l.p === "//" ? "accent" : l.p === "↗" ? "ink" : "ink-2"}>{l.t}</span>
        </div>
      ))}
      {typing && (
        <div className="flex gap-2">
          <span className="ink-3 w-3 shrink-0">{typing.p}</span>
          <span className="ink-2">
            {typing.t.slice(0, cursorChar)}
            <span className="blink accent">▌</span>
          </span>
        </div>
      )}
    </div>
  );
};

// Slim scroll progress bar — sits at the top edge of the Nav.
const ScrollProgress = () => {
  const ref = useRef(null);
  useEffect(() => {
    let rafId = null;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      if (ref.current) ref.current.style.transform = `scaleX(${pct})`;
      rafId = null;
    };
    const onScroll = () => { if (rafId == null) rafId = requestAnimationFrame(update); };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);
  return (
    <div className="absolute top-0 left-0 right-0 h-[2px] overflow-hidden pointer-events-none">
      <div
        ref={ref}
        className="h-full bg-[var(--accent)] origin-left"
        style={{ transform: 'scaleX(0)', willChange: 'transform' }}
      />
    </div>
  );
};

const SunIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <circle cx="12" cy="12" r="4"/>
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
  </svg>
);
const MoonIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/>
  </svg>
);

const ThemeToggle = ({ theme, onToggle }) => {
  const isDark = theme === 'dark';
  return (
    <button
      onClick={onToggle}
      aria-label={isDark ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
      title={isDark ? "Tema claro" : "Tema oscuro"}
      className="w-8 h-8 rounded-full border border-line hover:border-[var(--accent)] hover:text-[var(--accent)] grid place-items-center transition ink-2"
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
};

const NAV_LINKS = [
  ["#producto", "Producto"],
  ["#casos", "Casos"],
  ["#servicios", "Servicios"],
  ["#por-que", "Por qué"],
  ["#proceso", "Proceso"],
  ["#precios", "Empezar"],
  ["#faq", "FAQ"],
];

const HamburgerIcon = ({ open }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    {open
      ? <><path d="M6 6l12 12"/><path d="M18 6L6 18"/></>
      : <><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/></>
    }
  </svg>
);

export const Nav = ({ theme, onToggleTheme }) => {
  const slots = getCurrentSlots();
  const [menuOpen, setMenuOpen] = useState(false);

  // Lock body scroll when mobile menu is open + close on Escape
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 bg-[color-mix(in_oklab,var(--bg)_85%,transparent)] backdrop-blur border-b border-line">
      <ScrollProgress />
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 h-14 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <a href="#" className="serif text-xl tracking-tight">quasor<span className="accent">.</span></a>
          <nav className="hidden md:flex items-center gap-6 text-sm ink-2" aria-label="Navegación principal">
            {NAV_LINKS.map(([href, label]) => (
              <a key={href} href={href} className="hover:ink">{label}</a>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 mono text-[11px] ink-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--pos)] pulse-dot" />
            <span>Disponible · {slots.count} slots {slots.month}</span>
          </div>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <a href="#contacto" className="hidden sm:inline-flex text-sm px-3.5 py-1.5 rounded-full btn-accent hover:opacity-95 transition items-center font-medium">Agendar demo →</a>
          <button
            type="button"
            className="md:hidden w-8 h-8 rounded-full border border-line grid place-items-center ink-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <HamburgerIcon open={menuOpen} />
          </button>
        </div>
      </div>

      {/* Mobile menu — slides down from below the nav. `inert` removes from tab order when closed. */}
      <div
        id="mobile-menu"
        className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-out border-t border-line ${menuOpen ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"}`}
        inert={!menuOpen ? "" : undefined}
      >
        <nav className="max-w-[1280px] mx-auto px-6 py-4 flex flex-col gap-1" aria-label="Navegación móvil">
          {NAV_LINKS.map(([href, label]) => (
            <a
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="py-2.5 text-base ink-2 hover:accent border-b border-line last:border-b-0"
            >
              {label}
            </a>
          ))}
          <div className="mt-3 flex items-center gap-2 mono text-[11px] ink-3 pb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--pos)] pulse-dot" />
            <span>Disponible · {slots.count} slots {slots.month}</span>
          </div>
          <a
            href="#contacto"
            onClick={() => setMenuOpen(false)}
            className="sm:hidden mt-1 text-center text-sm px-3.5 py-3 rounded-full btn-accent font-medium"
          >
            Agendar demo →
          </a>
        </nav>
      </div>
    </header>
  );
};

const TypeRotator = ({ words, className }) => {
  const [idx, setIdx] = useState(0);
  const [len, setLen] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [paused, setPaused] = useState(false);
  const reduced = useMemo(() => typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);

  useEffect(() => {
    if (reduced) { setLen(words[idx].length); return; }
    if (paused) return;
    const w = words[idx];
    if (!deleting && len < w.length) {
      const t = setTimeout(() => setLen(len + 1), 70);
      return () => clearTimeout(t);
    }
    if (!deleting && len === w.length) {
      const t = setTimeout(() => setDeleting(true), 1600);
      return () => clearTimeout(t);
    }
    if (deleting && len > 0) {
      const t = setTimeout(() => setLen(len - 1), 35);
      return () => clearTimeout(t);
    }
    if (deleting && len === 0) {
      setDeleting(false);
      setIdx((idx + 1) % words.length);
    }
  }, [len, deleting, idx, paused, reduced]);

  // SR users hear a single static phrase via the visually-hidden span; the
  // animated text is hidden from them so the rotator doesn't spam aria-live.
  return (
    <>
      <span className="sr-only">{words[0]}</span>
      <span
        className={className}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        style={{ cursor: "default" }}
        aria-hidden="true"
      >
        {words[idx].slice(0, len)}
        <span className="inline-block w-[0.08em] h-[0.85em] align-middle ml-1" style={{ background: "var(--accent)", animation: paused ? "none" : "blink 0.9s steps(1) infinite", opacity: paused ? 0.3 : 1 }} />
      </span>
    </>
  );
};

export const Hero = () => {
  const slots = getCurrentSlots();
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 glow opacity-70 pointer-events-none" />
      <div className="absolute inset-0 grain pointer-events-none" />
      <div className="relative max-w-[1280px] mx-auto px-6 md:px-10 pt-10 md:pt-16 pb-12 md:pb-20">
        {/* Eyebrow row */}
        <div className="flex items-center gap-2 mono text-[11px] ink-3 uppercase tracking-[0.18em] rise">
          <span>Quasor</span><span>·</span><span>Mar del Plata, AR</span><span>·</span><span>CRM para inmobiliarias</span>
          <span className="ml-auto hidden md:flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--pos)] pulse-dot" />
            <span>{slots.count} slots · {slots.month}</span>
          </span>
        </div>

        {/* Two-column hero: text left, live dashboard right (kicks in at xl to avoid cramped dashboard on lg) */}
        {/* items-start: title is anchored to the top so dashboard view-switching doesn't push it up/down */}
        <div className="mt-8 md:mt-10 grid xl:grid-cols-12 gap-10 xl:gap-12 items-start">
          <div className="xl:col-span-5">
            <h1
              className="serif text-[44px] md:text-[56px] xl:text-[60px] leading-[1] tracking-[-0.035em] rise"
              style={{ animationDelay: "80ms" }}
            >
              Tu empresa funciona con<br/>
              <em className="italic accent accent-glow">
                <TypeRotator words={["Excel y WhatsApp.", "chats personales.", "sistemas que no hablan."]} />
              </em><br/>
              Nosotros lo resolvemos.
            </h1>

            <p
              className="mt-6 text-base md:text-lg ink-2 max-w-md rise"
              style={{ animationDelay: "160ms" }}
            >
              Dashboards, CRMs y automatizaciones que reemplazan el caos de planillas. A la derecha, el sistema real — interfaz funcional con datos de ejemplo.
            </p>

            <div
              className="mt-8 flex flex-wrap items-center gap-3 rise"
              style={{ animationDelay: "240ms" }}
            >
              <a href="#contacto" data-magnetic="0.3" className="text-[15px] px-5 py-3 rounded-full btn-accent hover:opacity-95 transition flex items-center gap-2 font-medium">
                Agendar una demo <span>→</span>
              </a>
              <a href="#casos" data-magnetic="0.25" className="text-[15px] px-5 py-3 rounded-full border border-line-2 hover:bg-surface-2 transition">
                Ver casos
              </a>
            </div>
            <div className="mt-3 mono text-[12px] ink-3">
              respondemos en 2h hábiles
            </div>
          </div>

          {/* Dashboard — right column on xl+, full-width below text on lg- */}
          <div
            className="xl:col-span-7 xl:-mr-2 rise"
            style={{ animationDelay: "320ms" }}
          >
            <div className="relative">
              <div className="hidden md:flex items-center gap-2 mono text-[10px] uppercase tracking-[0.18em] ink-3 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--pos)] pulse-dot" />
                <span>live demo · interfaz real, datos de ejemplo</span>
              </div>
              <TiltWrapper max={5}>
                <Dashboard />
              </TiltWrapper>
            </div>
          </div>
        </div>

        {/* Stats bar — anchor for #producto */}
        <div
          id="producto"
          className="mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-0 border border-line rounded-xl overflow-hidden bg-surface rise"
          style={{ animationDelay: "400ms" }}
        >
          {[
            ["6 sem", "en producción con piloto"],
            ["100%", "leads trackeados (vs 38% antes)"],
            ["< 60s", "sync portales + Meta/Google"],
            ["Cloud", "infra moderna · zero downtime deploys"],
          ].map(([v, k], i) => (
            <div key={i} className="px-5 py-4 border-r last:border-r-0 border-line">
              <div className="serif text-3xl num">{v}</div>
              <div className="mono text-[11px] ink-3 mt-1">{k}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Real brand SVGs from Simple Icons (react-icons/si — imported up top).
// Custom monograms for AR-local platforms that don't ship public brand assets.
const ZonaPropMark = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M5 4h14v2.6L9.7 17H19v3H5v-2.6L14.3 7H5V4z"/>
  </svg>
);
const ArgenPropMark = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 3.5L21 20h-3.4l-1.7-3.2H8.1L6.4 20H3l9-16.5zm0 5L9.3 14h5.4L12 8.5z"/>
  </svg>
);
const TokkoMark = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M3.5 4h17v3.4h-6.6V20h-3.8V7.4H3.5z"/>
  </svg>
);

const INTEGRATIONS = [
  { n: "ZonaProp",     c: "#f05000", Logo: ZonaPropMark   },
  { n: "Argenprop",    c: "#009a44", Logo: ArgenPropMark  },
  { n: "Tokko Broker", c: "#ff5a1f", Logo: TokkoMark      },
  { n: "WhatsApp",     c: "#25D366", Logo: SiWhatsapp     },
  { n: "Meta Ads",     c: "#0866ff", Logo: SiMeta         },
  { n: "Google Ads",   c: "#4285F4", Logo: SiGoogleads    },
  { n: "Instagram",    c: "#E4405F", Logo: SiInstagram    },
  { n: "Gmail",        c: "#EA4335", Logo: SiGmail        },
];

// Triple to give wide viewports enough chip-width to fill seamlessly.
// Track translates -33.333% per loop, landing exactly on the start of the
// second copy. The third copy is the buffer keeping the right edge populated.
const INTEGRATIONS_LOOP = [...INTEGRATIONS, ...INTEGRATIONS, ...INTEGRATIONS];

const IntegrationChip = ({ i, ariaHidden }) => {
  const { Logo } = i;
  return (
    <li
      className="integration-chip"
      aria-hidden={ariaHidden ? "true" : undefined}
    >
      <span
        className="chip-icon"
        style={{ background: i.c, boxShadow: `0 6px 16px -8px ${i.c}` }}
      >
        <Logo />
      </span>
      <span className="chip-name">{i.n}</span>
    </li>
  );
};

// Radial connection lines using a pixel-coordinate viewBox + xMidYMid meet.
// Endpoints are placed asymmetrically so the constellation reads as organic
// rather than a six-pointed star.
const RadialLines = () => {
  // Stage is 1280×360 max; we use 1280×360 viewBox with center at (640,180).
  // Endpoints chosen to avoid perfect symmetry while still spreading evenly.
  const cx = 640, cy = 180;
  const endpoints = [
    { x: 60,   y: 70  },
    { x: 1220, y: 95  },
    { x: 30,   y: 195 },
    { x: 1250, y: 220 },
    { x: 110,  y: 295 },
    { x: 1180, y: 310 },
    { x: 470,  y: 30  },
    { x: 820,  y: 340 },
  ];
  return (
    <svg
      className="qlines"
      viewBox="0 0 1280 360"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      {endpoints.map((p, i) => {
        const isPulse = i % 2 === 0;
        return (
          <line
            key={i}
            x1={cx} y1={cy} x2={p.x} y2={p.y}
            className={isPulse ? "qline-pulse" : ""}
            style={isPulse ? { animationDelay: `${(i * 0.42).toFixed(2)}s` } : undefined}
          />
        );
      })}
    </svg>
  );
};

export const Marquee = () => (
  <section className="border-y border-line bg-surface-2 relative">
    <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-20 md:py-24">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
        <div className="mono text-[11px] uppercase tracking-[0.18em] ink-3 mb-4">integraciones · 8</div>
        <h2 className="serif text-3xl md:text-5xl tracking-tight leading-[1.05]">
          Conectamos con <em className="italic accent">todo lo que ya usás.</em>
        </h2>
        <p className="mono text-[12px] ink-3 mt-5 flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--pos)] pulse-dot" />
          sync bidireccional · &lt; 60s
        </p>
      </div>

      {/* Constellation: radial lines + 2 marquee rows + central core */}
      <div className="integrations-stage relative h-[300px] md:h-[360px]">
        <RadialLines />

        {/* Top row scrolls left → right */}
        <ul
          className="mq-track absolute top-6 md:top-10 left-0 z-[2]"
          role="list"
          aria-label="Integraciones disponibles"
        >
          {INTEGRATIONS_LOOP.map((i, idx) => (
            <IntegrationChip key={`t-${idx}`} i={i} ariaHidden={idx >= INTEGRATIONS.length} />
          ))}
        </ul>

        {/* Quasor core, dead-center */}
        <div className="absolute inset-0 grid place-items-center pointer-events-none z-[3]" aria-hidden="true">
          <div className="qcore">
            <span className="qcore-label">quasor.</span>
          </div>
        </div>

        {/* Bottom row scrolls right → left (decorative — same content as top) */}
        <ul
          className="mq-track mq-track--rtl absolute bottom-6 md:bottom-10 left-0 z-[2]"
          role="list"
          aria-hidden="true"
        >
          {INTEGRATIONS_LOOP.map((i, idx) => (
            <IntegrationChip key={`b-${idx}`} i={i} ariaHidden />
          ))}
        </ul>
      </div>

      {/* Footer micro-copy + trust strip */}
      <div className="mt-12 md:mt-14 flex flex-col items-center gap-6">
        <a href="#contacto" className="inline-flex items-center gap-2 text-sm accent group">
          ¿No está la tuya? la construimos
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </a>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          <span className="mono text-[11px] uppercase tracking-[0.18em] ink-3">primer caso en producción</span>
          <div className="flex items-center gap-3 pl-3 pr-4 py-2 rounded-full border border-line bg-surface">
            <span className="w-8 h-8 rounded-md grid place-items-center accent font-bold text-[11px]" style={{ background: "var(--bg-2)", border: "1px solid var(--line)" }}>●</span>
            <div className="leading-tight">
              <div className="text-sm font-medium">Cliente piloto</div>
              <div className="mono text-[10px] ink-3">Inmobiliaria · Mar del Plata</div>
            </div>
            <span className="mono text-[10px] ink-3" title="Bajo acuerdo de confidencialidad">NDA</span>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export const UseCases = () => {
  const cases = [
    {
      tag: "Inmobiliarias",
      title: "Gestión completa de pipeline",
      desc: "Captura leads desde ZonaProp, Argenprop, Tokko y WhatsApp. Asigna por zona, mide conversión por vendedor.",
      track: ["leads", "visitas", "cierres", "conversión por vendedor", "fuente del lead"],
      preview: "inmobiliaria",
    },
    {
      tag: "Concesionarias",
      title: "Del aviso al patentamiento",
      desc: "Seguimiento de consultas, reservas, test drives y stock en tiempo real. Dashboards de venta por modelo.",
      track: ["stock", "test drives", "reservas", "ticket promedio", "ad spend vs ventas"],
      preview: "concesionaria",
    },
    {
      tag: "Agencias de marketing",
      title: "Reporting automático a clientes",
      desc: "Conecta Meta, Google, TikTok. Genera reportes white-label. Muestra ROI real por campaña, sin Excel.",
      track: ["ROAS", "CPL", "CPA", "spend por cliente", "reportes automáticos"],
      preview: "agencia",
    },
    {
      tag: "E-commerce",
      title: "Operación centralizada",
      desc: "Stock, ventas, logística y atención unificados. Integra con Tienda Nube, Mercado Libre, Shopify.",
      track: ["stock", "órdenes", "LTV", "carritos abandonados", "integraciones"],
      preview: "ecommerce",
    },
  ];

  const MiniPreview = ({ kind }) => {
    if (kind === "inmobiliaria") {
      return (
        <div className="absolute inset-0 p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between mb-1">
            <div className="mono text-[9px] uppercase ink-3">pipeline · abril</div>
            <div className="mono text-[9px] accent">● live</div>
          </div>
          {[
            { n: "Consulta", c: 34, w: "22%" },
            { n: "Contactado", c: 22, w: "38%" },
            { n: "Visita", c: 12, w: "55%" },
            { n: "Oferta", c: 6, w: "78%" },
            { n: "Cerrado", c: 3, w: "100%" },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="mono text-[9px] ink-3 w-16 shrink-0">{s.n}</div>
              <div className="flex-1 h-4 rounded bg-surface-2 overflow-hidden relative">
                <div className="absolute inset-y-0 left-0 rounded" style={{ width: s.w, background: i >= 3 ? "var(--accent)" : "var(--ink-2)" }} />
              </div>
              <div className="mono text-[9px] tabular-nums w-6 text-right">{s.c}</div>
            </div>
          ))}
        </div>
      );
    }
    if (kind === "concesionaria") {
      return (
        <div className="absolute inset-0 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="mono text-[9px] uppercase ink-3">stock · 142 unidades</div>
            <div className="mono text-[9px] accent">▲ 12%</div>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {Array.from({length: 20}).map((_, i) => (
              <div key={i} className="aspect-[3/2] rounded" style={{
                background: i % 7 === 0 ? "var(--accent)" : i % 3 === 0 ? "var(--ink-2)" : "var(--line)",
                opacity: i % 5 === 0 ? 0.4 : 1,
              }} />
            ))}
          </div>
          <div className="mt-3 flex items-end gap-1 h-8">
            {[45,62,38,71,88,55,92].map((h, i) => (
              <div key={i} className="flex-1 rounded-t-sm" style={{ height: `${h}%`, background: "var(--accent)", opacity: 0.7 + i*0.04 }} />
            ))}
          </div>
        </div>
      );
    }
    if (kind === "agencia") {
      return (
        <div className="absolute inset-0 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="mono text-[9px] uppercase ink-3">ROAS por cliente</div>
            <div className="mono text-[9px] ink-3">7d</div>
          </div>
          {[
            { n: "Cliente A", v: "4.2x", w: "85%" },
            { n: "Cliente B", v: "3.1x", w: "62%" },
            { n: "Cliente C", v: "2.8x", w: "56%" },
            { n: "Cliente D", v: "5.7x", w: "100%" },
          ].map((c, i) => (
            <div key={i} className="flex items-center gap-2 py-1.5 border-t border-line first:border-t-0">
              <div className="mono text-[10px] w-16">{c.n}</div>
              <div className="flex-1 h-1 rounded bg-surface-2 overflow-hidden">
                <div className="h-full rounded" style={{ width: c.w, background: "var(--accent)" }} />
              </div>
              <div className="mono text-[10px] tabular-nums accent font-semibold">{c.v}</div>
            </div>
          ))}
        </div>
      );
    }
    return (
      <div className="absolute inset-0 p-4">
        <div className="mono text-[9px] uppercase ink-3 mb-2">ventas · hoy</div>
        <div className="serif text-4xl num">$847k</div>
        <div className="mono text-[10px] accent">▲ 23% vs ayer</div>
        <div className="mt-3 grid grid-cols-3 gap-1 h-10">
          {[40,68,55,82,71,94,62,78,88].map((h,i) => (
            <div key={i} className="rounded-t-sm" style={{ height: `${h}%`, background: i === 5 ? "var(--accent)" : "var(--ink-2)", opacity: i === 5 ? 1 : 0.3 }} />
          ))}
        </div>
        <div className="mt-2 flex justify-between mono text-[9px] ink-3">
          <span>32 órdenes</span><span>LTV $12.4k</span>
        </div>
      </div>
    );
  };

  return (
    <section id="casos" className="relative border-t border-line bg-surface">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-24 md:py-32">
        <div className="flex items-end justify-between gap-8 flex-wrap mb-14">
          <div>
            <div className="mono text-[11px] uppercase tracking-[0.18em] ink-3">02 — casos de uso</div>
            <h2 data-reveal-words className="serif text-5xl md:text-7xl leading-[0.98] mt-4 tracking-tight max-w-3xl">
              Para empresas que <em className="italic accent">venden todos los días.</em>
            </h2>
          </div>
          <p className="ink-2 max-w-sm">
            Un CRM pensado para inmobiliarias argentinas. Con todo lo que necesitás
            para operar: pipeline, portales, WhatsApp y reportes en un solo lugar.
          </p>
        </div>

        {/* Bento grid: Inmobiliarias dominates (2x2), Concesi + Agencias 1x1, E-commerce wide */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-5 md:auto-rows-[230px]">
          {cases.map((c, i) => {
            // 0 = Inmobiliarias (big 2x2), 1 = Concesi, 2 = Agencias, 3 = E-commerce (wide 2x1)
            const isBig = i === 0;
            const isWide = i === 3;
            const layout = isBig
              ? "md:col-span-2 md:row-span-2"
              : isWide
                ? "md:col-span-2 md:row-start-2 md:col-start-3"
                : i === 1
                  ? "md:col-start-3 md:row-start-1"
                  : "md:col-start-4 md:row-start-1";

            const previewH = isBig ? "h-64 md:h-[50%]" : "h-36 md:h-[55%]";
            const titleSize = isBig ? "serif text-3xl md:text-4xl" : "serif text-xl md:text-2xl";
            const showDesc = isBig || isWide;
            const trackPills = isBig ? c.track : c.track.slice(0, 3);

            return (
              <div
                key={i}
                className={`card overflow-hidden hover:border-[var(--accent)] hover:-translate-y-0.5 transition-[transform,border-color] duration-300 group cursor-pointer flex flex-col ${layout}`}
              >
                <div className={`relative ${previewH} bg-surface-2 border-b border-line overflow-hidden shrink-0`}>
                  <MiniPreview kind={c.preview} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)]/40 via-transparent to-transparent pointer-events-none" />
                </div>
                <div className={`p-5 ${isBig ? "md:p-7" : "md:p-5"} flex-1 flex flex-col`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="mono text-[11px] uppercase tracking-[0.18em] accent">{c.tag}</div>
                    <div className="mono text-[10px] ink-3 group-hover:accent transition">ver caso →</div>
                  </div>
                  <h3 className={`${titleSize} tracking-tight mb-2 leading-[1.05]`}>{c.title}</h3>
                  {showDesc && <p className="ink-2 text-sm mb-3 leading-snug">{c.desc}</p>}
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {isBig && <span className="mono text-[10px] ink-3 uppercase tracking-wider mr-1 self-center">track:</span>}
                    {trackPills.map(t => (
                      <span key={t} className="mono text-[10px] px-2 py-0.5 rounded-full bg-surface-2 border border-line">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Lerp a number from its previous value to `target` over `duration` using
// easeOutCubic. Starts from the current displayed value so re-firing while
// still animating doesn't snap.
const useCountUp = (target, duration = 700) => {
  const [val, setVal] = useState(target);
  const fromRef = useRef(target);
  useEffect(() => {
    const from = fromRef.current;
    if (from === target) return;
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const v = Math.round(from + (target - from) * eased);
      setVal(v);
      fromRef.current = v;
      if (t < 1) raf = requestAnimationFrame(tick);
      else fromRef.current = target;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
};

// Card data per phase. Same shape across all three so transitions just
// interpolate between values; no mid-stream layout shift.
const USECASE_PHASES = [
  {
    label: "antes · WhatsApps personales",
    lostPct: 62,
    color: "var(--neg)",
    barNote: "62 de cada 100 consultas",
    metrics: [
      { k: "cierres / mes",           before: "12", after: null,     delta: null   },
      { k: "tiempo de asignación",    before: "4h", after: null,     delta: null   },
      { k: "trazabilidad end-to-end", before: "0%", after: null,     delta: null   },
    ],
    chart: [30, 32, 28, 31, 30, 33],
    highlightFrom: 99,
  },
  {
    label: "implementando · semana 3 de 6",
    lostPct: 48,
    color: "var(--accent-2)",
    barNote: "piloto en marcha",
    metrics: [
      { k: "cierres / mes",           before: "12", after: "14",     delta: "+17%" },
      { k: "tiempo de asignación",    before: "4h", after: "20m",    delta: "-83%" },
      { k: "trazabilidad end-to-end", before: "0%", after: "60%",    delta: "+60%" },
    ],
    chart: [30, 32, 35, 42, 48, 52],
    highlightFrom: 3,
  },
  {
    label: "resultados · 6 semanas",
    lostPct: 38,
    color: "var(--accent)",
    barNote: "de 62% → 38% · -24pp",
    metrics: [
      { k: "cierres / mes",           before: "12", after: "17",     delta: "+43%" },
      { k: "tiempo de asignación",    before: "4h", after: "< 2min", delta: "-97%" },
      { k: "trazabilidad end-to-end", before: "0%", after: "100%",   delta: "+100%" },
    ],
    chart: [32, 38, 45, 58, 71, 88],
    highlightFrom: 4,
  },
];

export const UseCase = () => {
  const [activePhase, setActivePhase] = useState(0);
  const phase0 = useRef(null);
  const phase1 = useRef(null);
  const phase2 = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const refs = [phase0, phase1, phase2];
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          const idx = refs.findIndex(r => r.current === en.target);
          if (idx >= 0) setActivePhase(idx);
        }
      });
    }, { rootMargin: "-45% 0px -45% 0px", threshold: 0.01 });
    refs.forEach(r => r.current && observer.observe(r.current));
    return () => observer.disconnect();
  }, []);

  const phases = [
    {
      label: "01 / Problema",
      title: "Cero visibilidad.",
      body: "Los leads caían en chats personales de cada vendedor. Se perdían consultas, nadie sabía quién atendía a quién, no había forma de medir conversión real.",
    },
    {
      label: "02 / Solución",
      title: "Una sola fuente de verdad.",
      body: "Un CRM que captura cada consulta automáticamente desde portales, Meta y WhatsApp Business. La asigna al vendedor correcto según zona y disponibilidad. Le da al dueño visibilidad total del pipeline.",
    },
    {
      label: "03 / Resultado",
      title: "6 semanas. Otra operación.",
      body: "Trazabilidad end-to-end. Asignación instantánea. Más cierres con el mismo equipo. Y por primera vez, una operación que se mide.",
    },
  ];

  const data = USECASE_PHASES[activePhase];
  const animatedLost = useCountUp(data.lostPct);

  return (
    <section className="relative max-w-[1280px] mx-auto px-6 md:px-10 py-24 md:py-32">
      {/* Section header */}
      <div className="mb-16 md:mb-20 max-w-3xl">
        <div className="mono text-[11px] uppercase tracking-[0.18em] ink-3">03 — caso real</div>
        <h2 data-reveal-words className="serif text-5xl md:text-6xl leading-[1] mt-4 tracking-tight">
          Los leads no <em className="italic accent">se pierden.</em><br/>
          Se pierden de vista.
        </h2>
        <p className="mt-6 text-lg ink-2 max-w-md">
          Una inmobiliaria de Mar del Plata con 6 vendedores. Acompañala mientras pasa de "¿a quién le tocaba este cliente?" a saber la conversión exacta de cada uno.
        </p>
      </div>

      <div className="grid md:grid-cols-[1fr_1.2fr] gap-12 md:gap-16">
        {/* LEFT — scrolling phases. On mobile a tighter gap; on md+ we
            need ~55vh so the IO rootMargin (-45/-45) can activate one
            phase at a time as the user scrolls past them. */}
        <div className="space-y-12 md:space-y-[55vh] md:pr-4">
          {phases.map((p, i) => {
            const ref = i === 0 ? phase0 : i === 1 ? phase1 : phase2;
            return (
              <div
                key={i}
                ref={ref}
                className={`transition-opacity duration-500 ${activePhase === i ? "opacity-100" : "md:opacity-30"}`}
              >
                <div className="mono text-[11px] uppercase tracking-[0.18em] accent mb-3">{p.label}</div>
                <h3 className="serif text-3xl md:text-5xl leading-[1.05] tracking-tight mb-5">{p.title}</h3>
                <p className="ink-2 text-lg leading-relaxed max-w-md">{p.body}</p>
              </div>
            );
          })}
        </div>

        {/* RIGHT — sticky results card. All values keyed off `activePhase`. */}
        <div className="md:sticky md:top-24 md:self-start">
          <div className="relative">
            <div className="absolute -inset-6 glow opacity-50 blur-2xl pointer-events-none" />
            <div className="relative card overflow-hidden">
              {/* Header morphs with active phase */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-line bg-surface-2">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-2 h-2 rounded-full pulse-dot shrink-0" style={{ background: data.color, transition: "background .7s" }} />
                  <div key={data.label} className="mono text-[11px] uppercase tracking-[0.18em] ink-3 truncate" style={{ animation: 'rise .4s cubic-bezier(.2,.7,.2,1) both' }}>
                    {data.label}
                  </div>
                </div>
                <div className="mono text-[11px] ink-3 shrink-0">reporte #0142</div>
              </div>

              <div className="p-6 md:p-8">
                {/* Phase progress dots */}
                <div className="flex items-center gap-1.5 mb-6" aria-label={`Fase ${activePhase + 1} de 3`}>
                  {[0, 1, 2].map(p => (
                    <div key={p} className="h-1 flex-1 rounded-full overflow-hidden bg-surface-2">
                      <div
                        className="h-full rounded-full transition-[width] duration-700"
                        style={{
                          width: p < activePhase ? "100%" : p === activePhase ? "65%" : "0%",
                          background: "var(--accent)",
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* Headline metric — animates count + color across phases */}
                <div className="mb-7">
                  <div className="flex items-baseline gap-3">
                    <span
                      className="serif text-7xl md:text-8xl num leading-none tabular-nums"
                      style={{ color: data.color, transition: "color .7s cubic-bezier(.2,.7,.2,1)" }}
                    >
                      {animatedLost}<span className="text-5xl">%</span>
                    </span>
                    <span className="mono text-[11px] uppercase tracking-wider ink-3 pb-2">leads perdidos</span>
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-surface-2 rounded-full overflow-hidden relative">
                      <div
                        className="absolute inset-y-0 left-0 rounded-full transition-[width,background] duration-700"
                        style={{
                          width: `${data.lostPct}%`,
                          background: data.color,
                          boxShadow: `0 0 12px ${data.color}`,
                        }}
                      />
                    </div>
                    <span key={data.barNote} className="mono text-[10px] ink-3 tabular-nums whitespace-nowrap" style={{ animation: 'rise .4s cubic-bezier(.2,.7,.2,1) both' }}>
                      {data.barNote}
                    </span>
                  </div>
                </div>

                {/* Metrics rows — `after` and `delta` fade in once they exist */}
                <div className="space-y-4">
                  {data.metrics.map((r, i) => (
                    <div key={i} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 py-3 border-t border-line first:border-t-0">
                      <div className="mono text-[11px] uppercase tracking-wider ink-2">{r.k}</div>
                      <div className="flex items-center gap-2 mono text-xs">
                        <span className={`tabular-nums transition-all duration-500 ${r.after ? "ink-3 line-through" : "ink"}`}>{r.before}</span>
                        <span
                          className="ink-3 transition-opacity duration-500"
                          style={{ opacity: r.after ? 1 : 0 }}
                          aria-hidden={!r.after}
                        >→</span>
                        <span
                          key={`${i}-${r.after}`}
                          className="tabular-nums font-semibold transition-opacity duration-500"
                          style={{ color: "var(--ink)", opacity: r.after ? 1 : 0, animation: r.after ? 'rise .5s cubic-bezier(.2,.7,.2,1) both' : 'none' }}
                        >
                          {r.after || "—"}
                        </span>
                      </div>
                      <span
                        className="mono text-[11px] tabular-nums font-semibold transition-opacity duration-500"
                        style={{ color: data.color, opacity: r.delta ? 1 : 0 }}
                        aria-hidden={!r.delta}
                      >
                        {r.delta || ""}
                      </span>
                      <span
                        className="text-sm transition-opacity duration-500"
                        style={{ color: data.color, opacity: r.delta ? 1 : 0 }}
                        aria-hidden="true"
                      >▲</span>
                    </div>
                  ))}
                </div>

                <div className="mt-7 pt-6 border-t border-line">
                  <div className="flex items-center justify-between mb-3">
                    <div className="mono text-[11px] uppercase tracking-[0.18em] ink-3">leads atendidos / semana</div>
                    <div className="mono text-[10px] ink-3">semanas 1–6</div>
                  </div>
                  <div className="flex items-end gap-1.5 h-20">
                    {data.chart.map((h, i) => {
                      const isHi = i >= data.highlightFrom;
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div
                            className="w-full rounded-t-sm transition-all duration-700"
                            style={{
                              height: `${h}%`,
                              background: isHi ? data.color : "var(--ink-3)",
                              opacity: isHi ? 1 : 0.35,
                              boxShadow: isHi ? `0 0 8px ${data.color}` : "none",
                            }}
                          />
                          <span className="mono text-[9px] ink-3">S{i+1}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bullets — moved out of sticky column to remain visible */}
      <div className="mt-16 md:mt-20 pt-10 border-t border-line grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          "Historial de cada cliente desde la consulta hasta el cierre",
          "Asignación automática por zona, tipo y disponibilidad",
          "Métricas de conversión por vendedor en tiempo real",
          "Agenda de visitas y seguimientos que no se pierden",
        ].map((t, i) => (
          <div key={i} className="flex gap-3 items-start">
            <span className="accent mt-1 shrink-0">✓</span>
            <span className="ink-2 text-sm">{t}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

const SERVICE_ICONS = {
  CRM:  () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="7" r="2"/><path d="M15 15h6"/></svg>,
  DASH: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 17 9 11l4 4 8-8"/><path d="M14 4h7v7"/></svg>,
  API:  () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>,
  IA:   () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/><circle cx="12" cy="12" r="3.5"/></svg>,
};

export const Services = () => (
  <section id="servicios" className="relative border-t border-line bg-surface-2">
    <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-24 md:py-32">
      <div className="flex items-end justify-between mb-14 gap-8 flex-wrap">
        <div>
          <div className="mono text-[11px] uppercase tracking-[0.18em] ink-3">04 — servicios</div>
          <h2 className="serif text-5xl md:text-7xl leading-[0.98] mt-4 tracking-tight max-w-3xl">
            Enfocados. <em className="italic accent">Nada más.</em>
          </h2>
        </div>
        <p className="ink-2 max-w-sm">
          Cuatro pilares. Hechos en producción para que tu equipo los use,
          no que los mire.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-px bg-[var(--line)] border border-line">
        {SERVICES.map((s, i) => {
          const ServiceIcon = SERVICE_ICONS[s.k] || SERVICE_ICONS.CRM;
          return (
            <div key={s.k} className="bg-surface p-8 md:p-10 group hover:bg-[color-mix(in_oklab,var(--accent)_3%,var(--bg))] transition-colors">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl grid place-items-center transition-transform duration-300 group-hover:scale-105 group-hover:rotate-2" style={{ background: "color-mix(in oklab, var(--accent) 12%, var(--bg))", color: "var(--accent)" }}>
                  <ServiceIcon />
                </div>
                <div className="text-right">
                  <div className="mono text-[11px] ink-3">{String(i+1).padStart(2,"0")} / {SERVICES.length.toString().padStart(2,"0")}</div>
                  <div className="mono text-[11px] ink-3 mt-0.5">{s.k}</div>
                </div>
              </div>
              <h3 className="serif text-4xl md:text-5xl mt-6 leading-[1] tracking-tight">{s.name}</h3>
              <p className="mt-4 ink-2 max-w-sm">{s.body}</p>
              <ul className="mt-6 space-y-2">
                {s.bullets.map(b => (
                  <li key={b} className="flex items-center gap-2 text-sm ink-2">
                    <span className="accent mono">→</span> {b}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

export const WhyQuasor = () => {
  const cols = [
    {
      k: "freelance",
      name: "Dev freelance",
      tone: "neutral",
      desc: "Barato, rápido de contratar",
      rows: [
        { v: "1 persona", good: false, hint: "Si se enferma o desaparece, tu proyecto también" },
        { v: "Sin procesos", good: false },
        { v: "Cotiza por hora", good: false, hint: "Incentivo a estirar horas" },
        { v: "Soporte variable", good: false },
        { v: "Código sin docs", good: false },
      ],
    },
    {
      k: "quasor",
      name: "Quasor",
      tone: "accent",
      desc: "Estudio pequeño, procesos reales",
      rows: [
        { v: "2 personas dedicadas", good: true, hint: "Hablás directo con quien programa. Sin account managers." },
        { v: "Demo semanal + staging", good: true },
        { v: "Precio fijo por entregable", good: true },
        { v: "Soporte post-launch", good: true },
        { v: "Código documentado · vos sos dueño", good: true },
      ],
    },
    {
      k: "agencia",
      name: "Agencia tradicional",
      tone: "neutral",
      desc: "Grande, formal, lenta",
      rows: [
        { v: "Equipo rotativo", good: false, hint: "Empezás con seniors, terminás con juniors" },
        { v: "3 meses de discovery", good: false },
        { v: "Retainer mensual alto", good: false },
        { v: "Account manager de por medio", good: false },
        { v: "Código que no podés mantener", good: false },
      ],
    },
  ];
  return (
    <section id="por-que" className="relative border-t border-line">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-24 md:py-32">
        <div className="flex items-end justify-between gap-8 flex-wrap mb-14">
          <div>
            <div className="mono text-[11px] uppercase tracking-[0.18em] ink-3">05 — por qué Quasor</div>
            <h2 className="serif text-5xl md:text-7xl leading-[0.98] mt-4 tracking-tight max-w-3xl">
              ¿Y por qué <em className="italic accent">nosotros?</em>
            </h2>
          </div>
          <p className="ink-2 max-w-sm">
            Te podés encontrar con tres caminos para llevar tu operación al siguiente nivel.
            Esta es la verdad de cada uno, sin vender humo.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-[var(--line)] border border-line rounded-xl overflow-hidden">
          {cols.map((c) => {
            const isUs = c.tone === "accent";
            return (
              <div key={c.k} className={`p-8 md:p-10 ${isUs ? "bg-[var(--ink)] text-[var(--bg)] relative" : "bg-surface"}`}>
                {isUs && (
                  <div className="absolute top-4 right-4 mono text-[10px] uppercase tracking-wider accent border border-[var(--accent)] px-2 py-0.5 rounded-full">
                    recomendado
                  </div>
                )}
                <div className={`mono text-[11px] uppercase tracking-[0.18em] ${isUs ? "opacity-60" : "ink-3"}`}>{c.k}</div>
                <h3 className="serif text-3xl md:text-4xl mt-3 tracking-tight leading-tight">{c.name}</h3>
                <p className={`mt-2 text-sm ${isUs ? "opacity-80" : "ink-2"}`}>{c.desc}</p>
                <div className={`hl-grad my-6 ${isUs ? "opacity-40" : ""}`} />
                <ul className="space-y-3.5">
                  {c.rows.map((r, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className={`mt-0.5 shrink-0 w-5 h-5 rounded-full grid place-items-center text-[11px] font-bold ${
                        r.good
                          ? "bg-[var(--accent)] text-white"
                          : isUs
                            ? "bg-white/10 text-white/60"
                            : "bg-surface-2 ink-3"
                      }`}>
                        {r.good ? "✓" : "×"}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm ${isUs ? "" : "ink"}`}>{r.v}</div>
                        {r.hint && (
                          <div className={`mono text-[10px] mt-0.5 ${isUs ? "opacity-50" : "ink-3"}`}>{r.hint}</div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <p className="mt-8 mono text-[11px] ink-3 text-center max-w-2xl mx-auto">
          No somos para todos. Si buscás la opción más barata o la agencia con 200 personas, hay mejores opciones afuera.
        </p>
      </div>
    </section>
  );
};

export const Process = () => {
  const [active, setActive] = useState(0);
  const tabRefs = useRef([]);

  // Roving-tabindex keyboard nav. Arrow keys move focus + selection across
  // tabs; Home/End jump to first/last. Standard ARIA tablist pattern.
  const onTabKeyDown = (e) => {
    const max = PROCESS.length - 1;
    let next = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = active === max ? 0 : active + 1;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = active === 0 ? max : active - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = max;
    if (next !== null) {
      e.preventDefault();
      setActive(next);
      tabRefs.current[next]?.focus();
    }
  };

  return (
    <section id="proceso" className="relative border-t border-line">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-24 md:py-32">
        <div className="mono text-[11px] uppercase tracking-[0.18em] ink-3">06 — proceso</div>
        <h2 className="serif text-5xl md:text-7xl leading-[0.98] mt-4 tracking-tight max-w-3xl">
          Simple, directo, <em className="italic">sin vueltas.</em>
        </h2>
        <p className="ink-2 mt-5 max-w-lg">Cuatro etapas. Cada una con un entregable concreto. Sin reuniones que podrían haber sido un email.</p>

        <div className="mt-14 grid md:grid-cols-[260px_1fr] gap-10">
          <div className="relative">
            <div
              className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-3 md:pb-0"
              role="tablist"
              aria-label="Etapas del proceso"
              onKeyDown={onTabKeyDown}
            >
              {PROCESS.map((p, i) => (
                <button
                  key={p.n}
                  ref={(el) => (tabRefs.current[i] = el)}
                  onClick={() => setActive(i)}
                  role="tab"
                  aria-selected={active === i}
                  aria-controls={`process-panel-${i}`}
                  id={`process-tab-${i}`}
                  tabIndex={active === i ? 0 : -1}
                  className={`text-left p-4 rounded-lg border transition shrink-0 md:w-full min-w-[200px] md:min-w-0 ${active === i ? "border-line-2 bg-surface-2" : "border-transparent hover:bg-surface-2"}`}
                >
                  <div className="mono text-[11px] ink-3">{p.n} — {p.tag}</div>
                  <div className="serif text-xl mt-1">{p.name}</div>
                </button>
              ))}
            </div>
            {/* Mobile-only edge fade hint to suggest horizontal scroll */}
            <div className="md:hidden absolute right-0 top-0 bottom-3 w-12 pointer-events-none bg-gradient-to-l from-[var(--bg)] to-transparent" />
          </div>
          <div
            className="card p-8"
            role="tabpanel"
            id={`process-panel-${active}`}
            aria-labelledby={`process-tab-${active}`}
          >
            <div className="flex items-baseline justify-between gap-4 mb-4">
              <div>
                <div className="mono text-[11px] ink-3 uppercase tracking-[0.18em]">{PROCESS[active].tag}</div>
                <h3 className="serif text-4xl md:text-5xl mt-2 tracking-tight">{PROCESS[active].name}</h3>
              </div>
              <div className="serif text-6xl ink-3 opacity-40" aria-hidden="true">{PROCESS[active].n}</div>
            </div>
            <p className="ink-2 max-w-lg">{PROCESS[active].body}</p>
            <div className="mt-6">
              <Terminal lines={PROCESS[active].term} playKey={active} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const Testimonials = () => {
  const hero = TESTIMONIALS[0];
  return (
    <section className="relative border-t border-line bg-surface-2">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-24 md:py-32">
        <div className="flex items-end justify-between gap-8 flex-wrap mb-14">
          <div>
            <div className="mono text-[11px] uppercase tracking-[0.18em] ink-3">07 — cliente real</div>
            <h2 className="serif text-5xl md:text-7xl leading-[0.98] mt-4 tracking-tight max-w-3xl">
              Arrancamos con <em className="italic accent">un cliente.</em><br/>Bien.
            </h2>
          </div>
          <p className="ink-2 max-w-xs">
            Preferimos decir que tenemos 1 cliente feliz antes que inventar 10.
            Los resultados abajo son los que esperás según tu vertical.
          </p>
        </div>

        <div className="grid md:grid-cols-[0.9fr_1.3fr] gap-0 border border-line rounded-2xl overflow-hidden bg-surface">
          <div className="relative p-8 md:p-10 bg-[var(--ink)] text-[var(--bg)] overflow-hidden">
            <div className="absolute inset-0 glow opacity-60 pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-2 mono text-[11px] uppercase tracking-[0.18em] opacity-80">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--pos)]" /> cliente piloto
              </div>
              <div className="serif num leading-[0.88] mt-3 accent accent-glow" style={{ fontSize: "clamp(72px, 12vw, 128px)" }}>{hero.metric.v}</div>
              <div className="mono text-sm opacity-80 mt-2">{hero.metric.k}</div>
              <div className="hl-grad my-7 opacity-30" />
              <div className="mono text-[11px] uppercase tracking-wider opacity-60">
                primer caso · Mar del Plata
              </div>
            </div>
          </div>
          <figure className="p-8 md:p-10 flex flex-col justify-between">
            <div>
              <div className="serif text-7xl accent leading-none opacity-30">"</div>
              <blockquote className="serif text-2xl md:text-3xl leading-[1.25] tracking-tight mt-2">
                {hero.quote}
              </blockquote>
            </div>
            <div className="mt-8 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full grid place-items-center mono text-xl font-semibold accent" style={{ background: "var(--surface-2)", border: "1px solid var(--line)" }}>{hero.init}</div>
                <div>
                  <div className="font-medium">{hero.who}</div>
                  <div className="mono text-[11px] ink-3">{hero.where}</div>
                </div>
              </div>
              <div className="mono text-[11px] ink-3" title="Bajo acuerdo de confidencialidad">bajo NDA</div>
            </div>
          </figure>
        </div>

        <div className="mt-16">
          <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
            <div>
              <div className="mono text-[11px] uppercase tracking-[0.18em] ink-3">resultados esperados · por vertical</div>
              <h3 className="serif text-3xl md:text-4xl mt-2 tracking-tight">Lo que podés esperar si te sumás hoy.</h3>
            </div>
            <p className="mono text-[11px] ink-3 max-w-xs">
              Inmobiliarias: validado en el piloto. Otras verticales: benchmarks + capacidad técnica.<br/>
              No son promesas: son el piso del sistema.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {EXPECTED_RESULTS.map((r, i) => (
              <div key={i} className="card p-6 flex flex-col justify-between min-h-[200px]">
                <div>
                  <div className="mono text-[10px] uppercase tracking-wider accent mb-3">{r.vertical}</div>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="serif text-5xl num leading-none">{r.metric.v}</span>
                  </div>
                  <div className="mono text-[10px] uppercase tracking-wider ink-3 mb-3">{r.metric.k}</div>
                </div>
                <p className="ink-2 text-sm leading-snug">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Renamed from "Pricing" — same export name kept for App.jsx compat,
// but now shows a qualification filter ("para quién es") instead of price tiers.
export const Pricing = () => {
  const fitYou = [
    { t: "Tenés 4+ vendedores activos en cancha", h: "Si sos solo, una planilla alcanza." },
    { t: "Recibís 50+ consultas por mes", h: "Acá la asignación automática rinde de verdad." },
    { t: "Ya invertís en Meta o Google Ads", h: "Conectamos el spend al lead en tiempo real." },
    { t: "Querés medir conversión por vendedor", h: "Cada lead queda atribuido y trackeable." },
    { t: "Tenés un decisor con 1-2 semanas para el setup", h: "El primer mes es de implementación, no de operación." },
  ];
  const notYou = [
    { t: "Buscás algo gratis o muy barato", h: "Hay opciones. Esta no es esa." },
    { t: "Vendés 2-3 propiedades al año", h: "El ROI no cierra a esa escala." },
    { t: "No tenés tiempo para implementar", h: "El setup necesita decisores presentes." },
    { t: "Querés un sistema \"que se haga solo\"", h: "Las primeras 2 semanas requieren tu input." },
    { t: "Necesitás operar offline / on-premise", h: "Cloud-first. Si lo necesitás on-prem, hablemos antes." },
  ];

  return (
    <section id="precios" className="relative border-t border-line">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-24 md:py-32">
        <div className="flex items-end justify-between gap-8 flex-wrap mb-14">
          <div>
            <div className="mono text-[11px] uppercase tracking-[0.18em] ink-3">08 — para quién es</div>
            <h2 className="serif text-5xl md:text-7xl leading-[0.98] mt-4 tracking-tight">
              ¿Es <em className="italic accent">para vos?</em>
            </h2>
          </div>
          <p className="ink-2 max-w-sm">
            Antes que el precio, está la pregunta de si tiene sentido. Acá te decimos cuándo sí y cuándo no — sin vueltas.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {/* Es para vos si */}
          <div className="relative p-7 md:p-9 rounded-2xl border border-line bg-surface">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-full grid place-items-center" style={{ background: "color-mix(in oklab, var(--pos) 15%, var(--bg))", color: "var(--pos)" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7"/></svg>
              </div>
              <div>
                <div className="mono text-[10px] uppercase tracking-[0.18em] ink-3">Es para vos si</div>
                <div className="serif text-2xl md:text-3xl tracking-tight">Encajamos.</div>
              </div>
            </div>
            <ul className="space-y-4">
              {fitYou.map((r, i) => (
                <li key={i} className="flex gap-3">
                  <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full grid place-items-center text-[11px] font-bold bg-[color-mix(in_oklab,var(--pos)_18%,var(--bg))] text-[var(--pos)]">✓</span>
                  <div>
                    <div className="text-sm font-medium ink leading-snug">{r.t}</div>
                    <div className="mono text-[10px] ink-3 mt-0.5">{r.h}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* No es para vos si */}
          <div className="relative p-7 md:p-9 rounded-2xl border border-line bg-surface-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-full grid place-items-center bg-surface-2 ink-3 border border-line">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M6 6l12 12"/><path d="M18 6L6 18"/></svg>
              </div>
              <div>
                <div className="mono text-[10px] uppercase tracking-[0.18em] ink-3">No es para vos si</div>
                <div className="serif text-2xl md:text-3xl tracking-tight ink-2">Mejor no perdamos tiempo.</div>
              </div>
            </div>
            <ul className="space-y-4">
              {notYou.map((r, i) => (
                <li key={i} className="flex gap-3">
                  <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full grid place-items-center text-[11px] font-bold bg-surface ink-3 border border-line">×</span>
                  <div>
                    <div className="text-sm ink-2 leading-snug">{r.t}</div>
                    <div className="mono text-[10px] ink-3 mt-0.5">{r.h}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom CTA strip */}
        <div className="mt-12 md:mt-16 relative rounded-2xl border border-line bg-[var(--ink)] text-[var(--bg)] overflow-hidden">
          <div className="absolute inset-0 opacity-50 pointer-events-none" style={{ background: "radial-gradient(700px 400px at 100% 0%, color-mix(in oklab, var(--accent) 50%, transparent), transparent 60%)" }} />
          <div className="relative p-8 md:p-12 grid md:grid-cols-[1.4fr_1fr] gap-8 items-center">
            <div>
              <div className="mono text-[10px] uppercase tracking-[0.18em] opacity-60 mb-3">discovery — gratis · sin venta</div>
              <h3 className="serif text-3xl md:text-5xl leading-[1.05] tracking-tight">
                30 minutos para saber si <em className="italic accent">tiene sentido.</em>
              </h3>
              <p className="opacity-80 text-base mt-4 max-w-md">
                Te escuchamos, hacemos preguntas, y al final te decimos si encajamos. Si no, te orientamos a algo que sí. Sin compromiso, sin pitch.
              </p>
            </div>
            <div className="flex flex-col gap-3 md:items-end">
              <a href="#contacto" data-magnetic="0.3" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full btn-accent text-sm font-semibold hover:opacity-95 transition">
                Reservar 30 min →
              </a>
              <div className="flex items-center gap-2 mono text-[10px] opacity-70">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--pos)] pulse-dot" />
                <span>respondemos en 2h hábiles</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Native <details>/<summary> for built-in keyboard + screen reader support.
// First item starts open. The plus icon rotates via group-open from
// Tailwind's open-state variant.
const FaqItem = ({ item, i }) => (
  <details
    className="faq-item border-t border-line group"
    {...(i === 0 ? { open: true } : {})}
  >
    <summary className="flex items-center justify-between gap-6 py-6 cursor-pointer list-none">
      <span className="serif text-2xl md:text-3xl tracking-tight">{item.q}</span>
      <span className="mono text-2xl ink-3 transition-transform group-open:rotate-45 shrink-0" aria-hidden="true">+</span>
    </summary>
    <div className="pb-7">
      <p className="ink-2 max-w-2xl">{item.a}</p>
    </div>
  </details>
);

export const Faq = () => (
  <section id="faq" className="relative border-t border-line bg-surface-2">
    <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-24 md:py-32">
      <div className="grid md:grid-cols-[1fr_1.4fr] gap-16">
        <div>
          <div className="mono text-[11px] uppercase tracking-[0.18em] ink-3">09 — FAQ</div>
          <h2 className="serif text-5xl md:text-6xl leading-[0.98] mt-4 tracking-tight">
            Preguntas <em className="italic accent">frecuentes.</em>
          </h2>
          <p className="ink-2 mt-5">¿No está la tuya? <a href="#contacto" className="underline decoration-dotted underline-offset-4">Escribinos</a> y respondemos en 2h hábiles.</p>
        </div>
        <div>
          {FAQ.map((f, i) => <FaqItem key={i} item={f} i={i} />)}
          <div className="border-t border-line" />
        </div>
      </div>
    </div>
  </section>
);

export const Contact = () => {
  const slots = getCurrentSlots();
  return (
  <section id="contacto" className="relative border-t border-line overflow-hidden">
    <div className="absolute inset-0 glow opacity-60 pointer-events-none" />
    <div className="relative max-w-[1280px] mx-auto px-6 md:px-10 py-28 md:py-40">
      <div className="mono text-[11px] uppercase tracking-[0.18em] ink-3">10 — contacto</div>
      <h2 data-reveal-words className="serif text-5xl md:text-[72px] xl:text-[104px] leading-[0.95] tracking-[-0.02em] mt-6 max-w-5xl">
        ¿Tu operación depende de <em className="italic accent">buena voluntad?</em> Hablemos.
      </h2>
      <p className="ink-2 mt-8 text-lg max-w-xl">
        15 minutos por WhatsApp o videollamada. Te contamos qué haríamos, cuánto tarda y cuánto cuesta.
        Si no te cierra, no pasa nada.
      </p>

      <div className="mt-12 flex flex-wrap gap-4 items-center">
        <a href="https://wa.me/5492236892809" data-magnetic="0.3" target="_blank" rel="noopener noreferrer" aria-label="Chatear por WhatsApp (abre en nueva pestaña)" className="inline-flex items-center gap-3 px-6 py-4 rounded-full btn-accent text-[16px] font-medium hover:opacity-95 transition">
          <SiWhatsapp aria-hidden="true" />
          +54 9 223 689 2809
        </a>
        <a href="mailto:ventas@quasor.com" data-magnetic="0.25" className="inline-flex items-center gap-3 px-6 py-4 rounded-full border border-line-2 text-[16px] hover:bg-surface-2 transition">
          <SiGmail aria-hidden="true" className="opacity-70" />
          ventas@quasor.com
        </a>
      </div>

      <div className="mt-16 grid md:grid-cols-3 gap-6 border-t border-line pt-10">
        <div>
          <div className="mono text-[11px] uppercase tracking-[0.18em] ink-3">respuesta</div>
          <div className="serif text-3xl mt-2">&lt; 2h</div>
          <div className="text-sm ink-2">hábiles · 09–19 ART</div>
        </div>
        <div>
          <div className="mono text-[11px] uppercase tracking-[0.18em] ink-3">ubicación</div>
          <div className="serif text-3xl mt-2">Mar del Plata</div>
          <div className="text-sm ink-2">trabajamos en toda Argentina</div>
        </div>
        <div>
          <div className="mono text-[11px] uppercase tracking-[0.18em] ink-3">disponibilidad</div>
          <div className="serif text-3xl mt-2">{slots.count} slots · {slots.month}</div>
          <div className="text-sm ink-2">después: lista de espera</div>
        </div>
      </div>
    </div>
  </section>
  );
};

export const Footer = () => {
  const year = new Date().getFullYear();
  return (
  <footer className="border-t border-line">
    <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-14 md:py-16">
      <div className="grid md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-10 md:gap-16">
        <div>
          <div className="serif text-5xl">quasor<span className="accent">.</span></div>
          <p className="ink-2 text-sm mt-4 max-w-xs">
            CRM para inmobiliarias argentinas. Desde Mar del Plata, para todo el país.
          </p>
          <div className="mono text-[11px] ink-3 mt-5">
            <div>ventas@quasor.com</div>
            <div className="mt-1">+54 9 223 689 2809</div>
          </div>
          <div className="mt-5 inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full border border-line bg-surface mono text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--pos)] pulse-dot" />
            <span className="ink-2">Sistemas operativos</span>
          </div>
        </div>

        <div>
          <div className="mono text-[11px] uppercase tracking-[0.18em] ink-3 mb-4">Producto</div>
          <div className="flex flex-col gap-2.5 text-sm ink-2">
            <a href="#producto" className="hover:accent transition">Sistema</a>
            <a href="#casos" className="hover:accent transition">Casos de uso</a>
            <a href="#servicios" className="hover:accent transition">Servicios</a>
            <a href="#precios" className="hover:accent transition">Empezar</a>
            <a href="#faq" className="hover:accent transition">FAQ</a>
          </div>
        </div>

        <div>
          <div className="mono text-[11px] uppercase tracking-[0.18em] ink-3 mb-4">Empresa</div>
          <div className="flex flex-col gap-2.5 text-sm ink-2">
            <a href="#por-que" className="hover:accent transition">Por qué Quasor</a>
            <a href="#proceso" className="hover:accent transition">Proceso</a>
            <a href="#contacto" className="hover:accent transition">Contacto</a>
            <a href="legal/privacidad.html" className="hover:accent transition">Privacidad</a>
            <a href="legal/terminos.html" className="hover:accent transition">Términos</a>
          </div>
        </div>

        <div>
          <div className="mono text-[11px] uppercase tracking-[0.18em] ink-3 mb-4">Redes</div>
          <div className="flex flex-col gap-2.5 text-sm ink-2">
            <a href="https://www.instagram.com/quasortech/" target="_blank" rel="noopener noreferrer" aria-label="Instagram (abre en nueva pestaña)" className="hover:accent transition">Instagram ↗</a>
            <a href="https://wa.me/5492236892809" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp (abre en nueva pestaña)" className="hover:accent transition">WhatsApp ↗</a>
            <a href="mailto:ventas@quasor.com" aria-label="Enviar email a ventas" className="hover:accent transition">Email ↗</a>
          </div>
        </div>
      </div>

      <div className="hl-grad my-10" />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="mono text-[11px] ink-3 flex items-center gap-1.5">
          <span>© {year} Quasor · construido frente al mar</span>
          <svg width="14" height="8" viewBox="0 0 24 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="opacity-60">
            <path d="M1 4 Q 4 1, 7 4 T 13 4 T 19 4 T 25 4">
              <animate attributeName="d" dur="3s" repeatCount="indefinite" values="M1 4 Q 4 1, 7 4 T 13 4 T 19 4 T 25 4; M1 4 Q 4 7, 7 4 T 13 4 T 19 4 T 25 4; M1 4 Q 4 1, 7 4 T 13 4 T 19 4 T 25 4"/>
            </path>
          </svg>
          <span>mar del plata, AR</span>
        </div>
        <div className="flex items-center gap-4 mono text-[11px] ink-3">
          <a href="legal/privacidad.html" className="hover:accent transition">Política de Privacidad</a>
          <span>·</span>
          <a href="legal/terminos.html" className="hover:accent transition">Términos y Condiciones</a>
        </div>
      </div>
    </div>
  </footer>
  );
};
