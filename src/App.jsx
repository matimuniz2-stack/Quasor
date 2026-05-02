import { useState, useEffect } from 'react';
import Lenis from 'lenis';
import {
  Nav, Hero, Marquee, UseCases, UseCase, Services,
  WhyQuasor, Process, Testimonials, Pricing, Faq, Contact, Footer
} from './components/Sections.jsx';
import { TweakPanel, applyTweaks } from './components/Tweaks.jsx';

const App = () => {
  // Hydrate from <html data-theme> set by the inline script in index.html.
  // That script already read localStorage > prefers-color-scheme.
  const [tweaks, setTweaks] = useState(() => {
    const initialTheme = document.documentElement.getAttribute('data-theme') || 'light';
    return { ...(window.__TWEAKS__ || { accent: "orange", density: "cozy" }), theme: initialTheme };
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

    // Easter egg para devs curiosos en la consola
    if (!window.__QUASOR_HELLO__) {
      window.__QUASOR_HELLO__ = true;
      console.log(
        "%cquasor.",
        "color: #ff5a1f; font-size: 28px; font-weight: 700; letter-spacing: -0.04em;"
      );
      console.log(
        "%c¿sos dev curioso? hablanos: ventas@quasor.com\n%cconstruido en Mar del Plata 🌊",
        "color: #6b6b6b; font-family: ui-monospace, monospace; font-size: 12px;",
        "color: #6b6b6b; font-family: ui-monospace, monospace; font-size: 11px;"
      );
    }

    // Live-respond to system theme changes IF the user hasn't picked manually
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onSystemChange = (e) => {
      try { if (localStorage.getItem('quasor-theme')) return; } catch (err) { return; }
      const next = e.matches ? 'dark' : 'light';
      const updated = { ...tweaks, theme: next };
      setTweaks(updated);
      applyTweaks(updated);
    };
    mq.addEventListener('change', onSystemChange);
    const cleanupSystemListener = () => mq.removeEventListener('change', onSystemChange);

    const onMsg = (e) => {
      const d = e.data || {};
      if (d.type === "__activate_edit_mode")   setShowTweaks(true);
      if (d.type === "__deactivate_edit_mode") setShowTweaks(false);
    };
    window.addEventListener("message", onMsg);

    try { window.parent.postMessage({ type: "__edit_mode_available" }, "*"); } catch(e) {}

    // Reveal on scroll: observe every <section> and add .reveal/.in
    // Sections already inside the viewport on mount are revealed immediately —
    // avoids a blank page when StrictMode double-mounts cancel the IO's initial firing.
    const sections = document.querySelectorAll("section");
    sections.forEach(s => {
      const rect = s.getBoundingClientRect();
      const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
      s.classList.add("reveal");
      if (inViewport) s.classList.add("in");
    });
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -60px 0px" });
    sections.forEach(s => { if (!s.classList.contains("in")) io.observe(s); });

    // ============================================================
    // LENIS smooth scroll
    // ============================================================
    let lenis = null;
    let rafId = null;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let smoothAnchorClick = null;
    if (!prefersReduced) {
      lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
      });
      const raf = (t) => { lenis.raf(t); rafId = requestAnimationFrame(raf); };
      rafId = requestAnimationFrame(raf);
      // Smooth anchor scroll
      smoothAnchorClick = (e) => {
        const a = e.target.closest('a[href^="#"]');
        if (!a) return;
        const id = a.getAttribute("href");
        if (id && id.length > 1) {
          const tgt = document.querySelector(id);
          if (tgt) { e.preventDefault(); lenis.scrollTo(tgt, { offset: -80, duration: 1.4 }); }
        }
      };
      document.addEventListener("click", smoothAnchorClick);
    }

    // ============================================================
    // WORD REVEAL on scroll (recursive — preserves <em>, <br/>, etc)
    // ============================================================
    const splitWords = (root) => {
      if (root.dataset.rwSplit === "1") return;
      let wordIdx = 0;
      const walk = (node) => {
        const kids = [...node.childNodes];
        for (const child of kids) {
          if (child.nodeType === Node.TEXT_NODE) {
            const text = child.textContent;
            if (!text.trim()) continue;
            const frag = document.createDocumentFragment();
            const parts = text.split(/(\s+)/);
            parts.forEach(chunk => {
              if (!chunk) return;
              if (/^\s+$/.test(chunk)) { frag.appendChild(document.createTextNode(chunk)); return; }
              const w = document.createElement("span");
              w.className = "rw-word";
              const inner = document.createElement("span");
              inner.textContent = chunk;
              inner.style.setProperty("--rw-delay", (wordIdx * 45) + "ms");
              w.appendChild(inner);
              frag.appendChild(w);
              wordIdx++;
            });
            child.replaceWith(frag);
          } else if (child.nodeType === Node.ELEMENT_NODE) {
            if (child.tagName === "BR") continue;
            walk(child);
          }
        }
      };
      walk(root);
      root.dataset.rwSplit = "1";
    };
    const revealTargets = document.querySelectorAll("[data-reveal-words]");
    revealTargets.forEach(splitWords);
    const rwIo = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add("rw-in"); rwIo.unobserve(en.target); }
      });
    }, { threshold: 0.2, rootMargin: "0px 0px -40px 0px" });
    revealTargets.forEach(t => rwIo.observe(t));

    // ============================================================
    // MAGNETIC BUTTONS (only on fine pointer + non-reduced-motion)
    // ============================================================
    const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let magCleanup = null;
    if (isFinePointer && !prefersReduced) {
      const mags = document.querySelectorAll("[data-magnetic]");
      const magHandlers = [];
      mags.forEach(el => {
        let inner = el.querySelector(".mag-inner");
        if (!inner) {
          inner = document.createElement("span");
          inner.className = "mag-inner";
          while (el.firstChild) inner.appendChild(el.firstChild);
          el.appendChild(inner);
        }
        const strength = parseFloat(el.dataset.magnetic) || 0.35;
        const mm = (e) => {
          const r = el.getBoundingClientRect();
          const x = e.clientX - (r.left + r.width/2);
          const y = e.clientY - (r.top + r.height/2);
          el.style.transform = `translate(${x*strength}px, ${y*strength}px)`;
          inner.style.transform = `translate(${x*strength*0.5}px, ${y*strength*0.5}px)`;
        };
        const ml = () => { el.style.transform = ""; inner.style.transform = ""; };
        el.addEventListener("mousemove", mm);
        el.addEventListener("mouseleave", ml);
        magHandlers.push([el, mm, ml]);
      });
      magCleanup = () => {
        magHandlers.forEach(([el, mm, ml]) => {
          el.removeEventListener("mousemove", mm);
          el.removeEventListener("mouseleave", ml);
        });
      };
    }

    return () => {
      window.removeEventListener("message", onMsg);
      io.disconnect();
      rwIo.disconnect();
      if (lenis) {
        if (smoothAnchorClick) document.removeEventListener("click", smoothAnchorClick);
        lenis.destroy();
        cancelAnimationFrame(rafId);
      }
      if (magCleanup) magCleanup();
      cleanupSystemListener();
    };
  }, []);

  return (
    <div className="min-h-screen">
      <a href="#main" className="skip-link">Saltar al contenido</a>
      <Nav theme={tweaks.theme} onToggleTheme={toggleTheme} />
      <main id="main">
        <Hero />
        <Marquee />
        <UseCases />
        <UseCase />
        <Services />
        <WhyQuasor />
        <Process />
        <Testimonials />
        <Pricing />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <TweakPanel tweaks={tweaks} setTweaks={setTweaks} visible={showTweaks} />
    </div>
  );
};

export default App;
