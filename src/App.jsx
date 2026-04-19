const App = () => {
  const [tweaks, setTweaks] = React.useState(window.__TWEAKS__ || { accent: "orange", theme: "light", density: "cozy" });
  const [showTweaks, setShowTweaks] = React.useState(false);

  React.useEffect(() => {
    window.applyTweaks(tweaks);

    const onMsg = (e) => {
      const d = e.data || {};
      if (d.type === "__activate_edit_mode")   setShowTweaks(true);
      if (d.type === "__deactivate_edit_mode") setShowTweaks(false);
    };
    window.addEventListener("message", onMsg);

    try { window.parent.postMessage({ type: "__edit_mode_available" }, "*"); } catch(e) {}

    // Reveal on scroll: observe every <section> and add .reveal/.in
    const sections = document.querySelectorAll("section");
    sections.forEach(s => s.classList.add("reveal"));
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -60px 0px" });
    sections.forEach(s => io.observe(s));

    // ============================================================
    // LENIS smooth scroll
    // ============================================================
    let lenis = null;
    let rafId = null;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (window.Lenis && !prefersReduced) {
      lenis = new window.Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
      });
      const raf = (t) => { lenis.raf(t); rafId = requestAnimationFrame(raf); };
      rafId = requestAnimationFrame(raf);
      // Smooth anchor scroll
      document.addEventListener("click", (e) => {
        const a = e.target.closest('a[href^="#"]');
        if (!a) return;
        const id = a.getAttribute("href");
        if (id && id.length > 1) {
          const tgt = document.querySelector(id);
          if (tgt) { e.preventDefault(); lenis.scrollTo(tgt, { offset: -80, duration: 1.4 }); }
        }
      });
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
    // CUSTOM CURSOR + MAGNETIC BUTTONS
    // ============================================================
    const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let cursorCleanup = null;
    if (isFinePointer) {
      document.body.classList.add("has-custom-cursor");
      const dot = document.createElement("div"); dot.className = "q-cursor";
      const ring = document.createElement("div"); ring.className = "q-cursor-ring";
      document.body.appendChild(dot); document.body.appendChild(ring);
      let mx = window.innerWidth/2, my = window.innerHeight/2;
      let rx = mx, ry = my;
      let ready = false;
      const onMove = (e) => {
        mx = e.clientX; my = e.clientY;
        dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
        if (!ready) { ready = true; dot.classList.add("ready"); ring.classList.add("ready"); }
      };
      const tick = () => {
        rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
        ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
        requestAnimationFrame(tick);
      };
      window.addEventListener("mousemove", onMove, { passive: true });
      tick();
      // Hover states
      const linkSel = 'a, button, [role="button"], [data-magnetic]';
      const textSel = 'input, textarea, [contenteditable="true"]';
      document.addEventListener("mouseover", (e) => {
        if (e.target.closest(linkSel)) { dot.classList.add("is-link"); ring.classList.add("is-link"); }
        else if (e.target.closest(textSel)) { dot.classList.add("is-text"); ring.classList.add("is-text"); }
      });
      document.addEventListener("mouseout", (e) => {
        if (e.target.closest(linkSel)) { dot.classList.remove("is-link"); ring.classList.remove("is-link"); }
        if (e.target.closest(textSel)) { dot.classList.remove("is-text"); ring.classList.remove("is-text"); }
      });
      document.addEventListener("mouseleave", () => { dot.classList.add("is-hidden"); ring.classList.add("is-hidden"); });
      document.addEventListener("mouseenter", () => { dot.classList.remove("is-hidden"); ring.classList.remove("is-hidden"); });

      // Magnetic buttons
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
      cursorCleanup = () => {
        window.removeEventListener("mousemove", onMove);
        magHandlers.forEach(([el, mm, ml]) => { el.removeEventListener("mousemove", mm); el.removeEventListener("mouseleave", ml); });
        dot.remove(); ring.remove();
        document.body.classList.remove("has-custom-cursor");
      };
    }

    return () => {
      window.removeEventListener("message", onMsg);
      io.disconnect();
      rwIo.disconnect();
      if (lenis) { lenis.destroy(); cancelAnimationFrame(rafId); }
      if (cursorCleanup) cursorCleanup();
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Nav />
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
      <Footer />
      <TweakPanel tweaks={tweaks} setTweaks={setTweaks} visible={showTweaks} />
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
