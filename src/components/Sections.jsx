import { useState, useEffect, useMemo, useRef } from 'react';
import { SiWhatsapp, SiMeta, SiGoogleads, SiInstagram, SiGmail } from 'react-icons/si';
import { Dashboard } from './Dashboard.jsx';
import { Button, Badge, Card, FeatureSurface } from './ui/index.js';
import { SERVICES, PROCESS, TESTIMONIALS, EXPECTED_RESULTS, FAQ } from '../data.js';

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
          <Badge pulse className="max-md:hidden mono text-[11px] ink-3">
            <span>Disponible · respondemos hoy</span>
          </Badge>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <Button href="#contacto" className="max-sm:hidden text-sm px-3.5 py-1.5 font-medium">Agendar demo →</Button>
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
          <Badge pulse className="mt-3 mono text-[11px] ink-3 pb-2">
            <span>Disponible · respondemos hoy</span>
          </Badge>
          <Button
            href="#contacto"
            onClick={() => setMenuOpen(false)}
            className="sm:hidden w-full mt-1 text-sm px-3.5 py-3 font-medium"
          >
            Agendar demo →
          </Button>
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
  return (
    <section className="relative overflow-hidden">
      {/* Cinematic background: mesh blobs + dotted grid + grain */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="mesh-blob mesh-blob-1" />
        <div className="mesh-blob mesh-blob-2" />
        <div className="mesh-blob mesh-blob-3" />
      </div>
      <div className="absolute inset-0 dotted-grid pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-0 grain pointer-events-none" />
      <div className="relative max-w-[1280px] mx-auto px-6 md:px-10 pt-10 md:pt-16 pb-12 md:pb-20">
        {/* Eyebrow row */}
        <div className="flex items-center gap-2 mono text-[11px] ink-3 uppercase tracking-[0.18em] rise">
          <span>Quasor</span><span>·</span><span>Mar del Plata, AR</span>
        </div>

        {/* Two-column hero: text left, live dashboard right (kicks in at lg+ for laptop visibility) */}
        {/* items-start: title is anchored to the top so dashboard view-switching doesn't push it up/down */}
        <div className="mt-8 md:mt-10 grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-5 xl:col-span-4">
            <h1
              className="serif text-[44px] md:text-[56px] lg:text-[60px] leading-[1] tracking-[-0.035em] rise"
              style={{ animationDelay: "40ms" }}
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
              CRM y tracking de ads para inmobiliarias argentinas: pipeline, integraciones con portales y WhatsApp, y la inversión en tus ads atada a cada lead. A la derecha, una demo interactiva del producto, con datos de ejemplo.
            </p>

            <div
              className="mt-8 flex flex-wrap items-center gap-3 rise"
              style={{ animationDelay: "240ms" }}
            >
              <Button href="#contacto" className="text-[15px] px-5 py-3 font-medium">
                Hablemos 30 min <span>→</span>
              </Button>
              <Button href="#casos" variant="secondary" className="text-[15px] px-5 py-3">
                Ver caso real
              </Button>
            </div>
            <div className="mt-4 flex items-center gap-3 mono text-[11px] ink-3 flex-wrap">
              <span className="inline-flex items-center gap-1.5">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12l5 5L20 7"/></svg>
                mensual, sin permanencia
              </span>
              <span aria-hidden="true">·</span>
              <span>exportás tus datos cuando quieras</span>
            </div>
          </div>

          {/* Dashboard — right column on lg+, full-width below text on md- */}
          <div
            className="lg:col-span-7 xl:col-span-8 lg:-mr-2 rise"
            style={{ animationDelay: "320ms" }}
          >
            <div className="relative">
              <div className="hidden md:flex items-center gap-2 mono text-[10px] uppercase tracking-[0.18em] ink-3 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--pos)] pulse-dot" />
                <span>live demo · datos de ejemplo</span>
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
            ["+43%", "cierres mes a mes"],
            ["−99.9%", "leads perdidos"],
            ["−97%", "tiempo de asignación"],
            ["99.9%", "leads trazados · ad → cierre"],
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
        <div className="mono text-[11px] uppercase tracking-[0.18em] ink-3 mb-4">01 · integraciones · 8</div>
        <h2 className="serif text-3xl md:text-5xl tracking-tight leading-[1.05]">
          Conectamos con <em className="italic">todo lo que ya usás.</em>
        </h2>
        <p className="mono text-[12px] ink-3 mt-5 flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--pos)]" aria-hidden="true" />
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
          <span className="mono text-[11px] uppercase tracking-[0.18em] ink-3">en producción · 6 semanas</span>
          <div className="flex items-center gap-3 pl-3 pr-4 py-2 rounded-full border border-line bg-surface">
            <span className="w-8 h-8 rounded-md grid place-items-center accent" style={{ background: "var(--bg-2)", border: "1px solid var(--line)" }} aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M5 21V9l7-5 7 5v12"/></svg>
            </span>
            <div className="leading-tight">
              <div className="text-sm font-medium">Inmobiliaria · Mar del Plata</div>
              <div className="mono text-[10px] ink-3">6 vendedores · 100% leads trazados</div>
            </div>
            <span className="mono text-[10px] ink-3 opacity-60" aria-label="Identidad del cliente bajo acuerdo de confidencialidad">NDA</span>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// Closed-loop ad tracking — the "no es solo un CRM" section.
// Frames Quasor as CRM + ad-tracker: ingest spend → attribute the lead →
// measure the real cost per close. Sits right after the integrations marquee
// so it answers "los conectás, ¿y qué hacés con eso?".
const AD_STEPS = [
  {
    n: "01",
    tag: "Sincronizamos",
    title: "Tu inversión, sincronizada.",
    body: "Conectás Meta Ads y Google Ads una vez. Importamos campañas, avisos y lo que invertís cada día, sin planillas ni captura manual.",
    chip: "Meta + Google · sync diaria",
  },
  {
    n: "02",
    tag: "Atribuimos",
    title: "Cada lead, atado a su ad.",
    body: "La consulta entra ya atada a la campaña y el aviso que la generaron. Se asigna al vendedor al instante y queda trazada de punta a punta.",
    chip: "lead ↔ campaña ↔ aviso",
  },
  {
    n: "03",
    tag: "Medís",
    title: "Costo por venta, no por click.",
    body: "Ves cuánto te cuesta realmente un lead y una venta cerrada. Sabés qué campaña genera ganancia y cuál genera pérdida, y la pausás a tiempo.",
    chip: "CPL + costo por cierre real",
  },
];

// Conceptual attribution chain — labeled nodes joined by arrows. The arrow
// points down when the row stacks on mobile, right when it lays out on md+.
const AD_CHAIN = [
  { t: "Inversión en ads",  s: "Meta + Google, sync diaria" },
  { t: "Lead atribuido",    s: "campaña + aviso atados" },
  { t: "Vendedor asignado", s: "automático, al instante" },
  { t: "Venta cerrada",     s: "trazada de punta a punta" },
  { t: "ROI por campaña",   s: "costo por venta real", hi: true },
];

export const AdTracking = () => (
  <section id="ads" className="relative border-t border-line">
    <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-24 md:py-32">
      {/* Header */}
      <div className="flex items-end justify-between gap-8 flex-wrap mb-14">
        <div>
          <div className="mono text-[11px] uppercase tracking-[0.18em] ink-3">02 · del ad al cierre</div>
          <h2 data-reveal-words className="serif text-5xl md:text-7xl leading-[0.98] mt-4 tracking-tight max-w-3xl">
            No es solo un CRM. <em className="italic accent">Sabés qué ad pagó cada venta.</em>
          </h2>
        </div>
        <p className="ink-2 max-w-sm">
          Quasor también trackea tus ads: importa la inversión en Meta y Google, la ata al lead que generó y te muestra el costo real, por lead y por venta cerrada.
        </p>
      </div>

      {/* 3-step loop */}
      <div className="grid md:grid-cols-3 gap-px bg-[var(--line)] border border-line rounded-2xl overflow-hidden">
        {AD_STEPS.map((s) => (
          <div key={s.n} className="bg-surface p-7 md:p-9 flex flex-col">
            <div className="flex items-center justify-between mb-5">
              <span className="mono text-[11px] uppercase tracking-[0.18em] accent">{s.tag}</span>
              <span className="mono text-[11px] ink-3">{s.n}/03</span>
            </div>
            <h3 className="serif text-2xl md:text-3xl leading-tight tracking-tight mb-3 md:min-h-[2.5em]">{s.title}</h3>
            <p className="ink-2 text-sm leading-relaxed mb-6">{s.body}</p>
            <div className="mt-auto inline-flex self-start items-center gap-2 mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-surface-2 border border-line">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" aria-hidden="true" />
              {s.chip}
            </div>
          </div>
        ))}
      </div>

      {/* Attribution chain — the full closed loop, in one place */}
      <div className="mt-8 md:mt-10 card p-6 md:p-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <div className="mono text-[11px] uppercase tracking-[0.18em] ink-3">el loop completo · en un solo lugar</div>
          <div className="mono text-[10px] ink-3">de lo que invertís → a lo que cerrás</div>
        </div>
        <div className="flex flex-col md:flex-row md:items-stretch gap-3 md:gap-0">
          {AD_CHAIN.map((node, i) => (
            <div key={node.t} className="flex flex-col md:flex-row md:items-center md:flex-1">
              <div
                className={`flex-1 rounded-xl border px-4 py-3 ${
                  node.hi
                    ? "border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_8%,var(--bg))]"
                    : "border-line bg-surface-2"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: node.hi ? "var(--accent)" : "var(--ink-3)" }} aria-hidden="true" />
                  <span className={`text-sm font-medium leading-tight ${node.hi ? "accent" : "ink"}`}>{node.t}</span>
                </div>
                <div className="mono text-[10px] ink-3 mt-1 leading-snug">{node.s}</div>
              </div>
              {i < AD_CHAIN.length - 1 && (
                <span className="grid place-items-center mono text-lg accent select-none shrink-0 py-1 md:py-0 md:px-2 rotate-90 md:rotate-0" aria-hidden="true">→</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// Animated pipeline preview for the inmobiliarias hero card.
// Bars fill on group-hover via CSS — see .pipeline-bar in index.css.
const PipelinePreview = () => (
  <div className="absolute inset-0 p-5 md:p-7 flex flex-col gap-2.5">
    <div className="flex items-center justify-between mb-2">
      <div className="mono text-[10px] uppercase tracking-[0.18em] ink-3">pipeline · abril</div>
      <div className="mono text-[10px] accent flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" aria-hidden="true" />
        live
      </div>
    </div>
    {[
      { n: "Consulta",   c: 34, w: 22,  delay: 0 },
      { n: "Contactado", c: 22, w: 38,  delay: 120 },
      { n: "Visita",     c: 12, w: 55,  delay: 240 },
      { n: "Oferta",     c: 6,  w: 78,  delay: 360 },
      { n: "Cerrado",    c: 3,  w: 100, delay: 480 },
    ].map((s, i) => (
      <div key={i} className="flex items-center gap-3">
        <div className="mono text-[10px] ink-3 w-16 shrink-0">{s.n}</div>
        <div className="flex-1 h-4 md:h-5 rounded bg-surface-2 overflow-hidden relative">
          <div
            className="pipeline-bar absolute inset-y-0 left-0 rounded"
            style={{
              "--bar-w": `${s.w}%`,
              "--bar-delay": `${s.delay}ms`,
              background: i >= 3 ? "var(--accent)" : "var(--ink-2)",
            }}
          />
        </div>
        <div className="mono text-[11px] tabular-nums w-6 text-right font-medium">{s.c}</div>
      </div>
    ))}
  </div>
);

export const UseCases = () => {
  return (
    <section id="casos" className="relative border-t border-line bg-surface">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-24 md:py-32">
        <div className="flex items-end justify-between gap-8 flex-wrap mb-14">
          <div>
            <div className="mono text-[11px] uppercase tracking-[0.18em] ink-3">03 · vertical primario</div>
            <h2 data-reveal-words className="serif text-5xl md:text-7xl leading-[0.98] mt-4 tracking-tight max-w-3xl">
              Para empresas que <em className="italic accent">venden todos los días.</em>
            </h2>
          </div>
          <p className="ink-2 max-w-sm">
            Inmobiliarias en producción.<br/>
            Resto de verticales: bajo consulta.
          </p>
        </div>

        {/* Primary case — Inmobiliarias, in-production deep dive */}
        <Card hover className="overflow-hidden grid md:grid-cols-2 group">
          <div className="relative h-72 md:h-auto md:min-h-[420px] bg-surface-2 border-b md:border-b-0 md:border-r border-line overflow-hidden">
            <PipelinePreview />
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--bg)]/30 via-transparent to-transparent pointer-events-none" />
          </div>
          <div className="p-7 md:p-10 flex flex-col">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div className="mono text-[11px] uppercase tracking-[0.18em] accent">Inmobiliarias</div>
              <div
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full mono text-[10px] uppercase tracking-wider"
                style={{
                  background: "color-mix(in oklab, var(--pos) 12%, var(--bg))",
                  color: "var(--pos)",
                  border: "1px solid color-mix(in oklab, var(--pos) 30%, transparent)"
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--pos)]" aria-hidden="true" />
                en producción
              </div>
            </div>
            <h3 className="serif text-3xl md:text-5xl leading-[1.02] tracking-tight mb-4">Pipeline inmobiliario, end-to-end.</h3>
            <p className="ink-2 mb-6 max-w-md leading-relaxed">
              Captura desde Meta Lead Ads, Google Ads, Tokko y WhatsApp. Asigna por zona, mide conversión por vendedor. Reportes automáticos sin Excel.
            </p>
            <div className="flex flex-wrap gap-1.5 mt-auto">
              <span className="mono text-[10px] ink-3 uppercase tracking-wider mr-1 self-center">track:</span>
              {["leads", "visitas", "cierres", "conversión por vendedor", "fuente del lead"].map(t => (
                <span key={t} className="mono text-[10px] px-2 py-0.5 rounded-full bg-surface-2 border border-line">{t}</span>
              ))}
            </div>
          </div>
        </Card>
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
    lostPct: 1,
    lostDisplay: "≈0.01",
    color: "var(--accent)",
    barNote: "de 62% → ≈0% · -99.9%",
    metrics: [
      { k: "cierres / mes",           before: "12", after: "17",     delta: "+43%" },
      { k: "tiempo de asignación",    before: "4h", after: "< 2min", delta: "-97%" },
      { k: "trazabilidad end-to-end", before: "0%", after: "100%",   delta: "+100%" },
    ],
    chart: [32, 38, 45, 58, 71, 88],
    highlightFrom: 4,
  },
];

// Phase-specific inline SVG visualizations.
// Built minimally — each anchors the eye with a different "shape" so the
// scrollytelling reads as a progression even if the user skims.
const PhaseVisual = ({ kind, active }) => {
  const dim = active ? 1 : 0.5;
  if (kind === "chaos") {
    // Scattered chat bubbles, some lost (faded with red strikethrough).
    return (
      <svg viewBox="0 0 320 110" className="w-full h-24 md:h-28" aria-hidden="true">
        <g style={{ opacity: dim, transition: "opacity .7s" }}>
          <rect x="12"  y="18" width="60" height="20" rx="10" fill="var(--ink-3)" opacity="0.35"/>
          <rect x="86"  y="8"  width="48" height="18" rx="9"  fill="var(--ink-3)" opacity="0.55"/>
          <rect x="148" y="22" width="56" height="20" rx="10" fill="var(--ink-3)" opacity="0.3"/>
          <rect x="218" y="6"  width="52" height="18" rx="9"  fill="var(--ink-3)" opacity="0.45"/>
          <rect x="22"  y="58" width="64" height="20" rx="10" fill="var(--neg)"   opacity="0.45"/>
          <line x1="22" y1="58" x2="86" y2="78" stroke="var(--neg)" strokeWidth="1.5" opacity="0.7"/>
          <line x1="22" y1="78" x2="86" y2="58" stroke="var(--neg)" strokeWidth="1.5" opacity="0.7"/>
          <rect x="106" y="62" width="44" height="20" rx="10" fill="var(--ink-3)" opacity="0.4"/>
          <rect x="170" y="56" width="58" height="20" rx="10" fill="var(--accent)" opacity="0.7"/>
          <rect x="244" y="64" width="60" height="20" rx="10" fill="var(--ink-3)" opacity="0.35"/>
        </g>
      </svg>
    );
  }
  if (kind === "pipeline") {
    // Sources on left → hub in center → pipeline stages on right.
    return (
      <svg viewBox="0 0 320 110" className="w-full h-24 md:h-28" aria-hidden="true">
        <g style={{ opacity: dim, transition: "opacity .7s" }}>
          <rect x="8"   y="14" width="60" height="14" rx="7" fill="var(--ink-3)" opacity="0.55"/>
          <rect x="8"   y="38" width="60" height="14" rx="7" fill="var(--ink-3)" opacity="0.55"/>
          <rect x="8"   y="62" width="60" height="14" rx="7" fill="var(--ink-3)" opacity="0.55"/>
          <line x1="68" y1="21" x2="138" y2="55" stroke="var(--accent)" strokeWidth="1" opacity="0.5"/>
          <line x1="68" y1="45" x2="138" y2="55" stroke="var(--accent)" strokeWidth="1" opacity="0.5"/>
          <line x1="68" y1="69" x2="138" y2="55" stroke="var(--accent)" strokeWidth="1" opacity="0.5"/>
          <circle cx="160" cy="55" r="22" fill="var(--accent)" opacity="0.95"/>
          <text x="160" y="59" textAnchor="middle" fill="white" fontSize="9" fontFamily="ui-monospace" letterSpacing="0.05em">CRM</text>
          <line x1="182" y1="55" x2="252" y2="21" stroke="var(--accent)" strokeWidth="1" opacity="0.5"/>
          <line x1="182" y1="55" x2="252" y2="45" stroke="var(--accent)" strokeWidth="1" opacity="0.5"/>
          <line x1="182" y1="55" x2="252" y2="69" stroke="var(--accent)" strokeWidth="1" opacity="0.5"/>
          <rect x="252" y="14" width="60" height="14" rx="7" fill="var(--ink-3)" opacity="0.6"/>
          <rect x="252" y="38" width="60" height="14" rx="7" fill="var(--ink-3)" opacity="0.75"/>
          <rect x="252" y="62" width="60" height="14" rx="7" fill="var(--accent)" opacity="0.85"/>
        </g>
      </svg>
    );
  }
  // growth
  return (
    <svg viewBox="0 0 320 110" className="w-full h-24 md:h-28" aria-hidden="true">
      <g style={{ opacity: dim, transition: "opacity .7s" }}>
        <line x1="12" y1="84" x2="308" y2="84" stroke="var(--line-2)" strokeWidth="1"/>
        {[
          { h: 18, c: "var(--ink-3)", o: 0.35 },
          { h: 26, c: "var(--ink-3)", o: 0.45 },
          { h: 36, c: "var(--accent)", o: 0.55 },
          { h: 48, c: "var(--accent)", o: 0.7 },
          { h: 58, c: "var(--accent)", o: 0.85 },
          { h: 70, c: "var(--accent)", o: 1 },
        ].map((b, i) => (
          <rect key={i} x={28 + i * 44} y={84 - b.h} width="28" height={b.h} rx="3" fill={b.c} opacity={b.o}/>
        ))}
        <path d="M 42 75 Q 110 65, 180 45 T 290 18" stroke="var(--accent)" strokeWidth="1.5" fill="none" strokeDasharray="3 3" opacity="0.6"/>
        <circle cx="290" cy="18" r="6" fill="var(--pos)"/>
        <path d="M 286 18 L 289 21 L 294 15.5" stroke="white" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
    </svg>
  );
};

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
      body: "Los leads caían en chats personales. Nadie sabía quién atendía a quién, ni cómo medir conversión real.",
      stat: { v: "62%", k: "leads perdidos" },
      visual: "chaos",
    },
    {
      label: "02 / Solución",
      title: "Una sola fuente de verdad.",
      body: "Captura automática desde portales, Meta y WhatsApp. Asignación por zona y disponibilidad. Pipeline visible para todos.",
      stat: { v: "3 → 1", k: "plataformas a revisar" },
      visual: "pipeline",
    },
    {
      label: "03 / Resultado",
      title: "6 semanas. Otra operación.",
      body: "Trazabilidad end-to-end. Asignación instantánea. Más cierres con el mismo equipo.",
      stat: { v: "+43%", k: "cierres / mes" },
      visual: "growth",
    },
  ];

  const data = USECASE_PHASES[activePhase];
  const animatedLost = useCountUp(data.lostPct);

  return (
    <section className="relative max-w-[1280px] mx-auto px-6 md:px-10 py-24 md:py-32">
      {/* Section header */}
      <div className="mb-16 md:mb-20 max-w-3xl">
        <div className="mono text-[11px] uppercase tracking-[0.18em] ink-3">04 · caso real</div>
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
        <div className="space-y-16 md:space-y-[55vh] md:pr-4">
          {phases.map((p, i) => {
            const ref = i === 0 ? phase0 : i === 1 ? phase1 : phase2;
            const isActive = activePhase === i;
            const phaseColor = USECASE_PHASES[i].color;
            return (
              <div
                key={i}
                ref={ref}
                className={`transition-all duration-700 ease-out ${
                  isActive ? "opacity-100 md:scale-100" : "md:opacity-30 md:scale-[0.97]"
                }`}
              >
                {/* Visual anchor — eye lands here first */}
                <div
                  className="mb-6 rounded-xl border border-line bg-surface-2 px-4 py-3 overflow-hidden transition-colors duration-500"
                  style={{
                    borderColor: isActive ? `color-mix(in oklab, ${phaseColor} 35%, var(--line))` : undefined,
                    boxShadow: isActive ? `0 10px 30px -16px ${phaseColor}` : undefined,
                  }}
                >
                  <PhaseVisual kind={p.visual} active={isActive} />
                </div>

                {/* Phase label */}
                <div className="flex items-center gap-2 mono text-[11px] uppercase tracking-[0.18em] accent mb-3">
                  <span>{p.label}</span>
                  <span className="h-px flex-1 max-w-[60px]" style={{ background: "color-mix(in oklab, var(--accent) 50%, transparent)" }} aria-hidden="true" />
                </div>

                {/* Punchier title */}
                <h3 className="serif text-4xl md:text-6xl leading-[1] tracking-[-0.025em] mb-5">{p.title}</h3>

                {/* Tighter body */}
                <p className="ink-2 text-lg leading-relaxed max-w-md mb-6">{p.body}</p>

                {/* Stat callout — visual punch + memorability */}
                <div className="inline-flex items-baseline gap-3 pt-4 border-t border-line">
                  <span
                    className="serif num tabular-nums text-4xl md:text-5xl leading-none transition-colors duration-500"
                    style={{ color: isActive ? phaseColor : "var(--ink-2)" }}
                  >
                    {p.stat.v}
                  </span>
                  <span className="mono text-[11px] uppercase tracking-wider ink-3">{p.stat.k}</span>
                </div>
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
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: data.color, transition: "background .7s" }} />
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
                      {data.lostDisplay ?? animatedLost}<span className="text-5xl">%</span>
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
                  {data.metrics.map((r, i) => {
                    // Every delta here is an improvement, so it reads green.
                    // The arrow tracks the real direction of the value: down
                    // when the number drops (e.g. tiempo de asignación) — a
                    // lower time is the win — and up when it rises.
                    const isDown = r.delta?.trim().startsWith("-");
                    return (
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
                        style={{ color: "var(--pos)", opacity: r.delta ? 1 : 0 }}
                        aria-hidden={!r.delta}
                      >
                        {r.delta || ""}
                      </span>
                      <span
                        className="text-sm transition-opacity duration-500"
                        style={{ color: "var(--pos)", opacity: r.delta ? 1 : 0 }}
                        aria-hidden="true"
                      >{isDown ? "▼" : "▲"}</span>
                    </div>
                    );
                  })}
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
          <div className="mono text-[11px] uppercase tracking-[0.18em] ink-3">05 · más allá del CRM</div>
          <h2 className="serif text-5xl md:text-7xl leading-[0.98] mt-4 tracking-tight max-w-3xl">
            El CRM es el corazón. <em className="italic">Esto lo amplifica.</em>
          </h2>
        </div>
        <p className="ink-2 max-w-sm">
          Tres pilares más, conectados al CRM.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-px bg-[var(--line)] border border-line">
        {SERVICES.map((s, i) => {
          const ServiceIcon = SERVICE_ICONS[s.k] || SERVICE_ICONS.CRM;
          return (
            <div key={s.k} className="bg-surface p-8 md:p-10 group hover:bg-[color-mix(in_oklab,var(--accent)_3%,var(--bg))] transition-colors overflow-hidden">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl grid place-items-center transition-transform duration-300 group-hover:scale-105 group-hover:rotate-2" style={{ background: "color-mix(in oklab, var(--accent) 12%, var(--bg))", color: "var(--accent)" }}>
                  <ServiceIcon />
                </div>
                <div className="text-right">
                  <div className="mono text-[11px] ink-3">{String(i+1).padStart(2,"0")} / {SERVICES.length.toString().padStart(2,"0")}</div>
                  <div className="mono text-[11px] ink-3 mt-0.5">{s.k}</div>
                </div>
              </div>
              <h3 className="serif text-3xl md:text-4xl mt-6 leading-[1] tracking-tight break-words hyphens-auto">{s.name}</h3>
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
      k: "internacional",
      name: "HubSpot · Zoho · Salesforce",
      tone: "neutral",
      desc: "Líderes globales, no enfocados en ARG",
      rows: [
        { v: "Precios en USD · sin factura local", good: false, hint: "Planes complejos. Cambio de divisa y reconciliación con AFIP a tu cargo." },
        { v: "Dashboards y soporte en inglés", good: false, hint: "Tu equipo se capacita en jerga US, no en el lenguaje del rubro AR." },
        { v: "Tokko / Meta Lead Ads / Google: vía Zapier", good: false, hint: "Sin integraciones nativas para el stack inmobiliario AR. Conectores externos en el medio." },
      ],
    },
    {
      k: "quasor",
      name: "Quasor",
      tone: "accent",
      desc: "Hecho para inmobiliarias argentinas",
      rows: [
        { v: "Precios en AR$ · sin permanencia", good: true, hint: "Factura local. Cancelás cuando quieras." },
        { v: "Tokko · WhatsApp · Meta · Google · nativos", good: true, hint: "Integraciones nativas. Sync < 60s. Sin Zapier en el medio." },
        { v: "Soporte WhatsApp horario AR · < 2h", good: true, hint: "Hablás directo con quien programa. Sin tickets ni account managers." },
      ],
    },
    {
      k: "local",
      name: "Tokko · Wasi",
      tone: "neutral",
      desc: "Gestión inmobiliaria · CRM secundario",
      rows: [
        { v: "Foco: catálogo y administración", good: false, hint: "El CRM es un módulo, no el foco. La gestión de propiedades primero; el pipeline de ventas, después." },
        { v: "Pipeline / automatización: limitados", good: false, hint: "Asignación inteligente y alertas requieren soluciones improvisadas." },
        { v: "Cambios custom: cola + ticket", good: false, hint: "Software empaquetado, no a medida de tu operación." },
      ],
    },
  ];
  return (
    <section id="por-que" className="relative border-t border-line">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-24 md:py-32">
        <div className="flex items-end justify-between gap-8 flex-wrap mb-14">
          <div>
            <div className="mono text-[11px] uppercase tracking-[0.18em] ink-3">06 · por qué Quasor</div>
            <h2 className="serif text-5xl md:text-7xl leading-[0.98] mt-4 tracking-tight max-w-3xl">
              ¿Y por qué <em className="italic">nosotros?</em>
            </h2>
          </div>
          <p className="ink-2 max-w-sm">
            Tres caminos. Sin letra chica.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-[var(--line)] border border-line rounded-xl overflow-hidden">
          {cols.map((c) => {
            const isUs = c.tone === "accent";
            return (
              <div
                key={c.k}
                className={`p-8 md:p-10 relative ${isUs ? "" : "bg-surface"}`}
                style={isUs ? {
                  background: "var(--rec-bg)",
                  color: "var(--rec-fg)",
                  boxShadow: "inset 0 0 0 1px color-mix(in oklab, var(--accent) 22%, transparent)"
                } : undefined}
              >
                {isUs && (
                  <div className="absolute top-4 right-4 mono text-[10px] uppercase tracking-wider accent border border-[var(--accent)] px-2 py-0.5 rounded-full">
                    recomendado
                  </div>
                )}
                <div
                  className="mono text-[11px] uppercase tracking-[0.18em]"
                  style={isUs ? { color: "var(--rec-fg-muted)" } : undefined}
                >
                  {isUs ? c.k : <span className="ink-3">{c.k}</span>}
                </div>
                <h3 className="serif text-3xl md:text-4xl mt-3 tracking-tight leading-tight">{c.name}</h3>
                <p
                  className={`mt-2 text-sm ${isUs ? "" : "ink-2"}`}
                  style={isUs ? { color: "var(--rec-fg-muted)" } : undefined}
                >
                  {c.desc}
                </p>
                <div
                  className={`hl-grad my-6 ${isUs ? "" : ""}`}
                  style={isUs ? { background: "linear-gradient(90deg, transparent, var(--rec-divider), transparent)" } : undefined}
                />
                <ul className="space-y-3.5">
                  {c.rows.map((r, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span
                        className={`mt-0.5 shrink-0 w-5 h-5 rounded-full grid place-items-center text-[11px] font-bold ${
                          r.good
                            ? "bg-[var(--accent)] text-white"
                            : isUs
                              ? ""
                              : "bg-surface-2 ink-3"
                        }`}
                        style={!r.good && isUs ? { background: "var(--rec-chip-bg)", color: "var(--rec-chip-fg)" } : undefined}
                      >
                        {r.good ? "✓" : "×"}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm ${isUs ? "" : "ink"}`}>{r.v}</div>
                        {r.hint && isUs && (
                          <div className="mono text-[10px] mt-0.5" style={{ color: "var(--rec-fg-muted)" }}>{r.hint}</div>
                        )}
                      </div>
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

  // Dots sit at the left edge of each grid column. Center of dot i is at
  // (i / N)*100% + 12px from the left. So the track from dot 0 to dot (N-1)
  // spans ((N-1)/N)*100% of width starting at 12px (=left-3).
  const trackLenPct = ((PROCESS.length - 1) / PROCESS.length) * 100;
  const progressPct = PROCESS.length > 1 ? (active / (PROCESS.length - 1)) * trackLenPct : 0;

  return (
    <section id="proceso" className="relative border-t border-line">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-24 md:py-32">
        <div className="flex items-end justify-between gap-8 flex-wrap mb-12">
          <div>
            <div className="mono text-[11px] uppercase tracking-[0.18em] ink-3">08 · proceso</div>
            <h2 className="serif text-5xl md:text-7xl leading-[0.98] mt-4 tracking-tight">
              Cuatro etapas. <em className="italic">Sin vueltas.</em>
            </h2>
          </div>
          <p className="ink-2 max-w-xs">
            Cada una con un entregable concreto. Sin reuniones que podrían haber sido un email.
          </p>
        </div>

        {/* Horizontal timeline — desktop */}
        <div
          className="relative mb-10 hidden md:block"
          role="tablist"
          aria-label="Etapas del proceso"
          onKeyDown={onTabKeyDown}
        >
          {/* Track + progress fill — both start at center of dot 0 (12px = left-3) */}
          <div
            className="absolute top-[11px] left-3 h-px bg-[var(--line-2)]"
            style={{ width: `${trackLenPct}%` }}
            aria-hidden="true"
          />
          <div
            className="absolute top-[11px] left-3 h-px bg-[var(--accent)] transition-[width] duration-700 ease-out"
            style={{ width: `${progressPct}%` }}
            aria-hidden="true"
          />
          <div className="grid grid-cols-4 gap-4 relative">
            {PROCESS.map((p, i) => {
              const isActive = active === i;
              const isDone = i < active;
              return (
                <button
                  key={p.n}
                  ref={(el) => (tabRefs.current[i] = el)}
                  onClick={() => setActive(i)}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`process-panel-${i}`}
                  id={`process-tab-${i}`}
                  tabIndex={isActive ? 0 : -1}
                  className="text-left group focus:outline-none"
                >
                  <div
                    className={`relative w-6 h-6 rounded-full grid place-items-center mb-4 transition-all duration-300 mono text-[10px] font-bold ${
                      isActive
                        ? "bg-[var(--accent)] text-white scale-110 shadow-[0_0_0_4px_color-mix(in_oklab,var(--accent)_18%,transparent)]"
                        : isDone
                          ? "bg-[var(--accent)] text-white"
                          : "bg-surface ink-3 border border-line-2 group-hover:border-[var(--accent)]"
                    }`}
                  >
                    {isDone ? "✓" : i + 1}
                  </div>
                  <div className={`mono text-[10px] uppercase tracking-[0.18em] mb-1 transition-colors ${isActive ? "accent" : "ink-3"}`}>{p.tag}</div>
                  <div className={`serif text-lg leading-tight transition-colors ${isActive ? "ink" : "ink-2 group-hover:ink"}`}>{p.name}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile — horizontal scroll pills */}
        <div
          className="md:hidden mb-6 flex gap-2 overflow-x-auto pb-3 -mx-6 px-6"
          role="tablist"
          aria-label="Etapas del proceso"
          onKeyDown={onTabKeyDown}
        >
          {PROCESS.map((p, i) => {
            const isActive = active === i;
            return (
              <button
                key={p.n}
                ref={(el) => (tabRefs.current[i] = el)}
                onClick={() => setActive(i)}
                role="tab"
                aria-selected={isActive}
                aria-controls={`process-panel-${i}`}
                tabIndex={isActive ? 0 : -1}
                className={`shrink-0 text-left p-3 rounded-lg border min-w-[180px] transition ${isActive ? "border-line-2 bg-surface-2" : "border-line"}`}
              >
                <div className="mono text-[10px] ink-3">{p.n} · {p.tag}</div>
                <div className="serif text-lg mt-1">{p.name}</div>
              </button>
            );
          })}
        </div>

        {/* Active panel */}
        <div
          className="card p-6 md:p-8 grid md:grid-cols-[1fr_1.2fr] gap-6 md:gap-10 items-center"
          role="tabpanel"
          id={`process-panel-${active}`}
          aria-labelledby={`process-tab-${active}`}
        >
          <div>
            <div className="mono text-[11px] ink-3 uppercase tracking-[0.18em]">{PROCESS[active].tag}</div>
            <h3 className="serif text-3xl md:text-4xl mt-2 tracking-tight leading-tight">{PROCESS[active].name}</h3>
            <p className="ink-2 mt-4 max-w-md leading-relaxed">{PROCESS[active].body}</p>
          </div>
          <Terminal lines={PROCESS[active].term} playKey={active} />
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
            <div className="mono text-[11px] uppercase tracking-[0.18em] ink-3">07 · voz del cliente</div>
            <h2 className="serif text-5xl md:text-7xl leading-[0.98] mt-4 tracking-tight max-w-3xl">
              Lo que dicen los <em className="italic">que ya operan</em> con esto.
            </h2>
          </div>
          <p className="ink-2 max-w-xs">
            Inmobiliaria de Mar del Plata · 6 vendedores · 6 semanas en producción.
            Los resultados abajo son los que esperás según tu vertical.
          </p>
        </div>

        <div className="grid md:grid-cols-[0.9fr_1.3fr] gap-0 border border-line rounded-2xl overflow-hidden bg-surface">
          <FeatureSurface className="relative p-8 md:p-10 overflow-hidden">
            <div className="absolute inset-0 glow opacity-60 pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-2 mono text-[11px] uppercase tracking-[0.18em] opacity-80">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--pos)]" /> resultado real · 6 semanas
              </div>
              <div className="serif num leading-[0.88] mt-3 accent accent-glow" style={{ fontSize: "clamp(72px, 12vw, 128px)" }}>{hero.metric.v}</div>
              <div className="mono text-sm opacity-80 mt-2">{hero.metric.k}</div>
              <div className="hl-grad my-7 opacity-30" />
              <div className="mono text-[11px] uppercase tracking-wider opacity-60">
                inmobiliaria · Mar del Plata · 6 vendedores
              </div>
            </div>
          </FeatureSurface>
          <figure className="p-8 md:p-10 flex flex-col justify-between">
            <div>
              <div className="serif text-7xl accent leading-none opacity-30">"</div>
              <blockquote className="serif text-2xl md:text-3xl leading-[1.25] tracking-tight mt-2">
                {hero.quote}
              </blockquote>
            </div>
            <div className="mt-8 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full grid place-items-center accent" style={{ background: "var(--bg-2)", border: "1px solid var(--line)" }} aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 21h18M5 21V9l7-5 7 5v12M9 13h2M9 17h2M13 13h2M13 17h2"/>
                  </svg>
                </div>
                <div>
                  <div className="font-medium">{hero.who}</div>
                  <div className="mono text-[11px] ink-3">{hero.where}</div>
                </div>
              </div>
              <div className="mono text-[10px] ink-3 opacity-60" aria-label="Nombre del cliente bajo acuerdo de confidencialidad">identidad bajo NDA</div>
            </div>
          </figure>
        </div>

        <div className="mt-16">
          <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
            <div>
              <div className="mono text-[11px] uppercase tracking-[0.18em] ink-3">resultados por vertical</div>
              <h3 className="serif text-3xl md:text-4xl mt-2 tracking-tight">El piso, no la promesa.</h3>
            </div>
            <p className="mono text-[11px] ink-3 max-w-xs">
              Inmobiliarias: validado en piloto.<br/>
              Otras verticales: benchmark del rubro.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--line)] border border-line rounded-xl overflow-hidden">
            {EXPECTED_RESULTS.map((r, i) => (
              <div key={i} className="bg-surface p-5 md:p-6">
                <div className="mono text-[10px] uppercase tracking-wider accent mb-3">{r.vertical}</div>
                <div className="serif text-4xl md:text-5xl num leading-none mb-2">{r.metric.v}</div>
                <div className="mono text-[10px] uppercase tracking-wider ink-3">{r.metric.k}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Pricing: 3 tiers + qualification filter + CTA strip.
// Tiers viven en el array `tiers` abajo — editar ahí para ajustar tag o features.
// El precio NO se publica: se define en la primera reunión.
export const Pricing = () => {
  const tiers = [
    {
      k: "esencial",
      name: "Esencial",
      tag: "Inmobiliarias pequeñas · 4–6 vendedores",
      features: [
        "WhatsApp Business",
        "Tokko · sync de catálogo",
        "Pipeline + asignación a vendedor",
        "Reportes mensuales",
        "Soporte WhatsApp en horario AR",
      ],
      recommended: false,
    },
    {
      k: "pro",
      name: "Pro",
      tag: "Inmobiliarias medianas · 6–12 vendedores",
      features: [
        "Todo lo de Esencial, más:",
        "Meta Lead Ads + Google Ads",
        "Automatizaciones (auto-respuesta, alertas, scoring)",
        "Dashboards multi-fuente",
        "Reportes semanales + ad-hoc",
        "Soporte prioritario · < 4h",
      ],
      recommended: true,
    },
    {
      k: "custom",
      name: "Custom",
      tag: "12+ vendedores · grupos · multi-sucursal",
      features: [
        "Todo lo de Pro, más:",
        "Integraciones custom (cualquier API)",
        "White-label del CRM",
        "Base de datos dedicada en Google Cloud",
        "SLA firmado · uptime 99.9%",
        "Account manager dedicado",
      ],
      recommended: false,
    },
  ];

  const fitYou = [
    { t: "Tenés 4+ vendedores activos", h: "Si sos solo, una planilla alcanza." },
    { t: "Recibís 50+ consultas por mes", h: "Acá la asignación automática rinde." },
    { t: "Querés medir conversión por vendedor", h: "Cada lead atribuido y medible." },
  ];
  const notYou = [
    { t: "Buscás algo gratis o muy barato", h: "Hay opciones. Esta no es esa." },
    { t: "Vendés 2-3 propiedades al año", h: "El ROI no se justifica a esa escala." },
    { t: "Querés un sistema que se haga solo", h: "Las primeras 2 semanas requieren tu participación." },
  ];

  return (
    <section id="precios" className="relative border-t border-line">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-24 md:py-32">
        {/* Header — pricing */}
        <div className="flex items-end justify-between gap-8 flex-wrap mb-14">
          <div>
            <div className="mono text-[11px] uppercase tracking-[0.18em] ink-3">09 · precios</div>
            <h2 className="serif text-5xl md:text-7xl leading-[0.98] mt-4 tracking-tight">
              Tres planes. <em className="italic">Honestos.</em>
            </h2>
          </div>
          <p className="ink-2 max-w-sm">
            Mensual, sin permanencia. Cancelás cuando quieras.<br/>
            <span className="mono text-[11px] ink-3">Precio según escala e integraciones.</span>
          </p>
        </div>

        {/* Tier cards */}
        <div className="grid md:grid-cols-3 gap-px bg-[var(--line)] border border-line rounded-2xl overflow-hidden mb-16 md:mb-20">
          {tiers.map((t) => {
            const isRec = t.recommended;
            return (
              <div
                key={t.k}
                className={`relative p-7 md:p-9 flex flex-col ${isRec ? "" : "bg-surface"}`}
                style={isRec ? { background: "var(--rec-bg)", color: "var(--rec-fg)" } : undefined}
              >
                {isRec && (
                  <div className="absolute top-4 right-4 mono text-[10px] uppercase tracking-wider accent border border-[var(--accent)] px-2 py-0.5 rounded-full">
                    recomendado
                  </div>
                )}
                <div className="mono text-[11px] uppercase tracking-[0.18em]" style={isRec ? { color: "var(--rec-fg-muted)" } : undefined}>
                  {isRec ? t.k : <span className="ink-3">{t.k}</span>}
                </div>
                <h3 className="serif text-3xl md:text-4xl mt-3 tracking-tight leading-tight">{t.name}</h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="serif italic text-2xl md:text-3xl leading-none">A medida</span>
                  <span className="mono text-[12px]" style={isRec ? { color: "var(--rec-fg-muted)" } : { color: "var(--ink-3)" }}>· según tu escala</span>
                </div>
                <p className={`mt-4 text-sm ${isRec ? "" : "ink-2"}`} style={isRec ? { color: "var(--rec-fg-muted)" } : undefined}>
                  {t.tag}
                </p>
                <div
                  className="hl-grad my-6"
                  style={isRec ? { background: "linear-gradient(90deg, transparent, var(--rec-divider), transparent)" } : undefined}
                />
                <ul className="space-y-2.5 flex-1">
                  {t.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="accent mono mt-0.5 shrink-0">→</span>
                      <span style={isRec ? { color: "var(--rec-fg-muted)" } : { color: "var(--ink-2)" }}>{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#contacto"
                  className={`mt-7 inline-flex items-center justify-center w-full gap-2 px-5 py-3 rounded-full text-[14px] font-medium transition ${
                    isRec ? "btn-accent hover:opacity-95" : "border border-line-2 hover:bg-surface-2"
                  }`}
                  style={!isRec ? undefined : undefined}
                >
                  Reservar 30 min <span aria-hidden="true">→</span>
                </a>
              </div>
            );
          })}
        </div>

        {/* Fit / qualification — sub-bloque sin nuevo número */}
        <div className="flex items-end justify-between gap-8 flex-wrap mb-10 pt-12 border-t border-line">
          <div>
            <div className="mono text-[11px] uppercase tracking-[0.18em] ink-3">antes de empezar</div>
            <h3 className="serif text-3xl md:text-5xl leading-[1.05] mt-3 tracking-tight">
              ¿Es <em className="italic accent">para vos?</em>
            </h3>
          </div>
          <p className="ink-2 max-w-sm">
            Cuándo encajamos. Y cuándo no.
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
                <div className="serif text-2xl md:text-3xl tracking-tight ink-2">No encajamos.</div>
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
        <FeatureSurface className="mt-12 md:mt-16 relative rounded-2xl border border-line overflow-hidden">
          <div className="absolute inset-0 opacity-50 pointer-events-none" style={{ background: "radial-gradient(700px 400px at 100% 0%, color-mix(in oklab, var(--accent) 50%, transparent), transparent 60%)" }} />
          <div className="relative p-8 md:p-12 grid md:grid-cols-[1.4fr_1fr] gap-8 items-center">
            <div>
              <div className="mono text-[10px] uppercase tracking-[0.18em] opacity-60 mb-3">primera reunión gratis · sin venta</div>
              <h3 className="serif text-3xl md:text-5xl leading-[1.05] tracking-tight">
                30 minutos para evaluar si <em className="italic">podemos ayudarte.</em>
              </h3>
              <p className="opacity-80 text-base mt-4 max-w-md">
                Te escuchamos, hacemos preguntas y al final te decimos con honestidad si encajamos. Si no, te orientamos hacia algo que sí. Sin compromiso y sin que te vendamos nada.
              </p>
            </div>
            <div className="flex flex-col gap-3 md:items-end">
              <Button href="#contacto" className="px-6 py-3.5 text-sm font-semibold">
                Reservar 30 min →
              </Button>
              <Badge className="mono text-[10px] opacity-70">
                <span>respondemos en 2h hábiles</span>
              </Badge>
            </div>
          </div>
        </FeatureSurface>
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
          <div className="mono text-[11px] uppercase tracking-[0.18em] ink-3">10 · FAQ</div>
          <h2 className="serif text-5xl md:text-6xl leading-[0.98] mt-4 tracking-tight">
            Preguntas <em className="italic">frecuentes.</em>
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
  return (
  <section id="contacto" className="relative border-t border-line overflow-hidden">
    <div className="absolute inset-0 glow opacity-60 pointer-events-none" />
    <div className="relative max-w-[1280px] mx-auto px-6 md:px-10 py-28 md:py-40">
      <div className="mono text-[11px] uppercase tracking-[0.18em] ink-3">11 · contacto</div>
      <h2 data-reveal-words className="serif text-5xl md:text-[72px] xl:text-[104px] leading-[0.95] tracking-[-0.02em] mt-6 max-w-5xl">
        ¿Tu operación depende de <em className="italic accent">buena voluntad?</em> Hablemos.
      </h2>
      <p className="ink-2 mt-8 text-lg max-w-xl">
        30 minutos por WhatsApp o videollamada. Te contamos qué haríamos, cuánto tarda y cuánto cuesta.
        Si no te convence, no hay problema.
      </p>

      <div className="mt-12 flex flex-wrap gap-4 items-center">
        <Button href="https://wa.me/5492236892809" target="_blank" rel="noopener noreferrer" aria-label="Chatear por WhatsApp (abre en nueva pestaña)" className="gap-3 px-6 py-4 text-[16px] font-medium">
          <SiWhatsapp aria-hidden="true" />
          +54 9 223 689 2809
        </Button>
        <Button href="mailto:ventas@quasor.io" variant="secondary" className="gap-3 px-6 py-4 text-[16px]">
          <SiGmail aria-hidden="true" className="opacity-70" />
          ventas@quasor.io
        </Button>
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
          <div className="serif text-3xl mt-2">Inmediata</div>
          <div className="text-sm ink-2">coordinamos esta semana</div>
        </div>
      </div>
    </div>
  </section>
  );
};

// Sticky mobile CTA — floating bar at bottom of viewport.
// Visible only on mobile (md:hidden). Fades in after the user scrolls past
// the hero, hides itself once #contacto is in view so we don't double-CTA.
export const StickyMobileCTA = () => {
  const [visible, setVisible] = useState(false);
  const [atContacto, setAtContacto] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 520);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    let io = null;
    const target = document.getElementById('contacto');
    if (target) {
      io = new IntersectionObserver(
        (entries) => entries.forEach(e => setAtContacto(e.isIntersecting)),
        { threshold: 0.05 }
      );
      io.observe(target);
    }

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (io) io.disconnect();
    };
  }, []);

  const show = visible && !atContacto;
  return (
    <div
      className={`md:hidden fixed bottom-3 left-3 right-3 z-30 transition-all duration-300 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
      aria-hidden={!show}
      inert={!show ? "" : undefined}
    >
      <div className="flex items-stretch gap-2 p-1.5 rounded-full border border-line bg-[color-mix(in_oklab,var(--bg)_92%,transparent)] backdrop-blur-md shadow-[0_10px_30px_-10px_rgba(0,0,0,0.35)]">
        <a
          href="https://wa.me/5492236892809"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chatear por WhatsApp"
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-line-2 text-[14px] font-medium ink"
        >
          <SiWhatsapp aria-hidden="true" />
          WhatsApp
        </a>
        <a
          href="#contacto"
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full btn-accent text-[14px] font-medium"
        >
          Hablar 30 min <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>
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
            CRM + tracking de ads para inmobiliarias argentinas. Desde Mar del Plata, para todo el país.
          </p>
          <div className="mono text-[11px] ink-3 mt-5">
            <div>ventas@quasor.io</div>
            <div className="mt-1">+54 9 223 689 2809</div>
          </div>
        </div>

        <div>
          <div className="mono text-[11px] uppercase tracking-[0.18em] ink-3 mb-4">Producto</div>
          <div className="flex flex-col gap-2.5 text-sm ink-2">
            <a href="#producto" className="hover:accent transition">Sistema</a>
            <a href="#ads" className="hover:accent transition">Tracking de ads</a>
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
            <a href="legal/eliminar-datos.html" className="hover:accent transition">Eliminar mis datos</a>
          </div>
        </div>

        <div>
          <div className="mono text-[11px] uppercase tracking-[0.18em] ink-3 mb-4">Redes</div>
          <div className="flex flex-col gap-2.5 text-sm ink-2">
            <a href="https://www.instagram.com/quasortech/" target="_blank" rel="noopener noreferrer" aria-label="Instagram (abre en nueva pestaña)" className="hover:accent transition">Instagram ↗</a>
            <a href="https://wa.me/5492236892809" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp (abre en nueva pestaña)" className="hover:accent transition">WhatsApp ↗</a>
            <a href="mailto:ventas@quasor.io" aria-label="Enviar email a ventas" className="hover:accent transition">Email ↗</a>
          </div>
        </div>
      </div>

      <div className="hl-grad my-10" />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="mono text-[11px] ink-3">
          © {year} Quasor · Mar del Plata, AR
        </div>
        <div className="flex items-center gap-4 mono text-[11px] ink-3">
          <a href="legal/privacidad.html" className="hover:accent transition">Política de Privacidad</a>
          <span>·</span>
          <a href="legal/terminos.html" className="hover:accent transition">Términos y Condiciones</a>
          <span>·</span>
          <a href="legal/eliminar-datos.html" className="hover:accent transition">Eliminar mis datos</a>
        </div>
      </div>
    </div>
  </footer>
  );
};
