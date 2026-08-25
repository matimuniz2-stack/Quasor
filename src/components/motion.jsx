// Motion primitives for the "Instrumento" redesign.
//
// The contract is deliberately DECLARATIVE: almost every animation is driven by
// attributes/classes that a single global IntersectionObserver (see App.jsx)
// flips to `.in`. Section components stay plain JSX with no hooks, which keeps
// the motion language identical across every section.
//
//   data-reveal        → fade + rise once in view          (--d sets the delay)
//   data-reveal-group  → same, staggering direct children
//   .lines             → headline whose lines rise out of a mask
//   .fill              → bar that grows to --w once its ancestor is `.in`
//
// Only counters need real JS, because they interpolate a value: <CountUp/>.
//
// Everything degrades to its final state under prefers-reduced-motion — the
// media query in index.css zeroes the durations, and the hooks below bail out.

import { useState, useEffect, useRef } from 'react';

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* --------------------------------------------------------------- useInView --
   Fires once, then unobserves. Elements already on screen at mount resolve
   immediately so a StrictMode double-mount can never leave content invisible. */
export const useInView = ({ threshold = 0.2, rootMargin = '0px 0px -12% 0px' } = {}) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true);
            io.unobserve(e.target);
          }
        });
      },
      { threshold, rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, rootMargin]);

  return [ref, inView];
};

/* ----------------------------------------------------------------- Lines ---
   A headline whose lines rise out of a mask, one after the other.

     <Lines as="h2" className="display-2 text-4xl" lines={["Del aviso", "a la comisión."]} />

   Each entry becomes its own masked row, so pass the line breaks you actually
   want — this is typographic composition, not automatic wrapping. */
export const Lines = ({
  as: Tag = 'h2',
  lines = [],
  className = '',
  step = 90,
  delay = 0,
  ...rest
}) => (
  <Tag className={`lines ${className}`.trim()} {...rest}>
    {lines.map((line, i) => (
      <span className="line" key={i}>
        {/* El espacio final es para el TEXTO PLANO: sin él, el prerender que
            leen los crawlers concatena "atada al" + "aviso" como una palabra.
            Visualmente no cambia nada, cada .line es un bloque. */}
        <span style={{ '--ld': `${delay + i * step}ms` }}>
          {line}
          {i < lines.length - 1 ? ' ' : ''}
        </span>
      </span>
    ))}
  </Tag>
);

/* ---------------------------------------------------------------- CountUp ---
   Counts to `to` once in view. `format` receives the interpolated number and
   returns the string to paint, so callers keep control of separators, signs
   and units ("−99,9 %", "$92.250", "4 → 1").

   Under reduced motion — and during the build-time prerender, where effects
   never run — it renders the final value immediately. */
export const CountUp = ({
  to,
  from = 0,
  duration = 1100,
  format = (n) => String(Math.round(n)),
  className = '',
  as: Tag = 'span',
  ...rest
}) => {
  const [ref, inView] = useInView({ threshold: 0.4 });
  const [value, setValue] = useState(() =>
    typeof window === 'undefined' || prefersReducedMotion() ? to : from
  );

  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion()) {
      setValue(to);
      return;
    }
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(from + (to - from) * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, from, duration]);

  return (
    <Tag ref={ref} className={`num ${className}`.trim()} {...rest}>
      {format(value)}
    </Tag>
  );
};

/* ------------------------------------------------------------- useParallax --
   Very small vertical offset tied to scroll, for the hero product plate only.
   `strength` is the fraction of the scrolled distance to give back, so 0.06
   means the plate lags ~6% behind the page. Kept tiny on purpose: the point is
   that the plate feels seated in the stage, not that it slides. */
export const useParallax = (strength = 0.06, max = 40) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const wide = window.matchMedia('(min-width: 768px)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let raf = null;
    let attached = false;
    const update = () => {
      const r = el.getBoundingClientRect();
      const fromCenter = r.top + r.height / 2 - window.innerHeight / 2;
      const offset = Math.max(-max, Math.min(max, -fromCenter * strength));
      el.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
      raf = null;
    };
    const onScroll = () => {
      if (raf == null) raf = requestAnimationFrame(update);
    };

    // Rotar el teléfono o activar movimiento reducido con la página abierta
    // tiene que apagar el efecto, no dejarlo corriendo con el último offset.
    const sync = () => {
      const on = wide.matches && !reduced.matches;
      if (on && !attached) {
        window.addEventListener('scroll', onScroll, { passive: true });
        attached = true;
        update();
      } else if (!on && attached) {
        window.removeEventListener('scroll', onScroll);
        attached = false;
        if (raf) cancelAnimationFrame(raf);
        raf = null;
        el.style.transform = '';
      }
    };
    sync();
    wide.addEventListener('change', sync);
    reduced.addEventListener('change', sync);
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      wide.removeEventListener('change', sync);
      reduced.removeEventListener('change', sync);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
      el.style.transform = '';
    };
  }, [strength, max]);

  return ref;
};
