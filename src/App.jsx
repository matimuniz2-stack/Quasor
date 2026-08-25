import { useState, useEffect } from 'react';
import Lenis from 'lenis';
import {
  Nav, Hero, Integrations, AdTracking, UseCases, CaseStudy,
  Services, WhyQuasor, Process, Pricing, Faq, Contact, Footer,
  StickyMobileCTA,
} from './components/sections/index.js';
import { TweakPanel, applyTweaks } from './components/Tweaks.jsx';

const App = () => {
  // Hydrate from <html data-theme>, which the inline script in index.html has
  // already resolved (localStorage > prefers-color-scheme). During the
  // build-time prerender there is no document, so fall back to the same
  // defaults declared in index.html's __TWEAKS__ block.
  const [tweaks, setTweaks] = useState(() => {
    if (typeof document === 'undefined') {
      return { accent: 'orange', density: 'compact', theme: 'light' };
    }
    const initialTheme = document.documentElement.getAttribute('data-theme') || 'light';
    return { ...(window.__TWEAKS__ || { accent: 'orange', density: 'cozy' }), theme: initialTheme };
  });
  const [showTweaks, setShowTweaks] = useState(false);

  const toggleTheme = () => {
    const next = tweaks.theme === 'dark' ? 'light' : 'dark';
    const updated = { ...tweaks, theme: next };
    setTweaks(updated);
    applyTweaks(updated);
    try { localStorage.setItem('quasor-theme', next); } catch (e) {}
  };

  useEffect(() => {
    applyTweaks(tweaks);

    // Colour transitions are armed only AFTER the first paint, so loading the
    // page doesn't look like a 400ms fade-in — but toggling the theme does.
    const readyId = requestAnimationFrame(() =>
      document.documentElement.classList.add('theme-ready')
    );

    if (!window.__QUASOR_HELLO__) {
      window.__QUASOR_HELLO__ = true;
      console.log(
        '%cquasor.',
        'color: #ff9100; font-size: 28px; font-weight: 700; letter-spacing: -0.04em;'
      );
      console.log(
        '%c¿Te interesa cómo está construido? Escribinos: @quasortech en IG.',
        'color: #868d9b; font-family: ui-monospace, monospace; font-size: 12px;'
      );
    }

    // Follow the system theme while the visitor hasn't chosen one manually.
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onSystemChange = (e) => {
      try { if (localStorage.getItem('quasor-theme')) return; } catch (err) { return; }
      const updated = { ...tweaks, theme: e.matches ? 'dark' : 'light' };
      setTweaks(updated);
      applyTweaks(updated);
    };
    mq.addEventListener('change', onSystemChange);

    const onMsg = (e) => {
      const d = e.data || {};
      if (d.type === '__activate_edit_mode') setShowTweaks(true);
      if (d.type === '__deactivate_edit_mode') setShowTweaks(false);
    };
    window.addEventListener('message', onMsg);
    try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch (e) {}

    // ========================================================================
    // ONE observer drives every scroll animation on the page.
    //
    // Sections stay declarative: they mark elements with data-reveal /
    // data-reveal-group / .lines and this flips `.in` once, which is what the
    // CSS transitions key off. Elements already on screen at mount are marked
    // immediately, so a StrictMode double-mount can never strand content at
    // opacity 0.
    // ========================================================================
    const SELECTOR = '[data-reveal], [data-reveal-group], .lines';
    const targets = Array.from(document.querySelectorAll(SELECTOR));
    const pending = [];
    targets.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('in');
      else pending.push(el);
    });
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('in');
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    pending.forEach((el) => io.observe(el));

    // ========================================================================
    // Smooth scroll
    // ========================================================================
    let lenis = null;
    let rafId = null;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReduced) {
      lenis = new Lenis({
        duration: 1.05,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
      });
      const raf = (t) => { lenis.raf(t); rafId = requestAnimationFrame(raf); };
      rafId = requestAnimationFrame(raf);
    }

    // Anchor clicks scroll smoothly through Lenis. The bare "#" on the logo
    // returns to the top without leaving a dangling hash in the URL.
    const smoothAnchorClick = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      // El skip link tiene que seguir el salto NATIVO del navegador: es lo que
      // mueve el foco al destino. Interceptarlo lo convertía en un control que
      // scrollea pero deja el foco en la nav.
      if (a.classList.contains('skip-link')) return;
      const id = a.getAttribute('href');
      if (id === '#') {
        e.preventDefault();
        if (lenis) lenis.scrollTo(0, { duration: 1.3 });
        else window.scrollTo({ top: 0 });
        history.replaceState(null, '', window.location.pathname + window.location.search);
        return;
      }
      if (id && id.length > 1 && lenis) {
        const tgt = document.querySelector(id);
        if (tgt) {
          e.preventDefault();
          lenis.scrollTo(tgt, { offset: id === '#contacto' ? 0 : -72, duration: 1.3 });
        }
      }
    };
    document.addEventListener('click', smoothAnchorClick);

    return () => {
      cancelAnimationFrame(readyId);
      window.removeEventListener('message', onMsg);
      mq.removeEventListener('change', onSystemChange);
      document.removeEventListener('click', smoothAnchorClick);
      io.disconnect();
      if (lenis) {
        lenis.destroy();
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return (
    <div className="min-h-screen">
      <a href="#main" className="skip-link">Saltar al contenido</a>
      <Nav theme={tweaks.theme} onToggleTheme={toggleTheme} />
      <main id="main" className="pb-20 md:pb-0">
        <Hero />
        <Integrations />
        <AdTracking />
        <UseCases />
        <CaseStudy />
        <Services />
        <WhyQuasor />
        <Process />
        <Pricing />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <StickyMobileCTA />
      <TweakPanel tweaks={tweaks} setTweaks={setTweaks} visible={showTweaks} />
    </div>
  );
};

export default App;
