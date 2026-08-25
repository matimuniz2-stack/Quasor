import { useEffect, useState } from "react";
import { SiWhatsapp } from "react-icons/si";

// Barra de acciones flotante, solo mobile. Aparece cuando el hero ya quedó
// atrás y se retira cuando #contacto entra en pantalla: ahí los mismos CTA ya
// están en el flujo y la barra pasaría a tapar el formulario.
const SHOW_AFTER = 520;

// `.btn` fija border-radius: var(--r-sm) desde CSS sin @layer, y eso le gana a
// la utilidad `rounded-full`, que Tailwind emite dentro de @layer utilities.
// El pill de las dos acciones va por style, o quedarían en 6px dentro de la
// cápsula.
const PILL = { borderRadius: "var(--r-pill)" };

export const StickyMobileCTA = () => {
  const [scrolled, setScrolled] = useState(false);
  const [atContact, setAtContact] = useState(false);

  useEffect(() => {
    let raf = null;
    const update = () => {
      setScrolled(window.scrollY > SHOW_AFTER);
      raf = null;
    };
    const onScroll = () => {
      if (raf == null) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const target = document.getElementById("contacto");
    if (!target) return;
    const io = new IntersectionObserver(([entry]) => setAtContact(entry.isIntersecting));
    io.observe(target);
    return () => io.disconnect();
  }, []);

  const visible = scrolled && !atContact;

  return (
    <div
      className={`md:hidden fixed bottom-3 left-3 right-3 z-30 transition duration-300 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      aria-hidden={visible ? undefined : "true"}
      // React 18 no conoce `inert` como booleano: la cadena vacía es la forma
      // correcta de presentar el atributo y saca la barra del foco al ocultarse.
      inert={visible ? undefined : ""}
    >
      <div className="flex gap-2 p-1.5 rounded-full border border-line bg-[color-mix(in_oklab,var(--bg)_92%,transparent)] backdrop-blur-md shadow-[0_10px_30px_-14px_rgba(0,0,0,0.45)]">
        <a
          href="https://wa.me/5492236892809"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chatear por WhatsApp"
          className="btn btn-ghost flex-1 min-h-[44px] px-3 text-[13px] whitespace-nowrap"
          style={PILL}
        >
          <SiWhatsapp aria-hidden="true" className="text-[15px] shrink-0" />
          WhatsApp
        </a>
        <a
          href="#contacto"
          className="btn btn-accent flex-1 min-h-[44px] px-3 text-[13px] whitespace-nowrap"
          style={PILL}
        >
          Coordinar 30 min
          <span className="arrow" aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  );
};
