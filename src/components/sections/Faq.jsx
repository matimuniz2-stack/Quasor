import { useState } from "react";
import { Lines } from "../motion.jsx";
import { FAQ } from "../../data.js";

// El texto de FAQ alimenta el JSON-LD de FAQPage que arma el build: se lee de
// data.js tal cual, sin reescribirlo acá.
//
// El acordeón es estado de React y no <details> porque la animación de alto
// (.acc-body, grid-template-rows 0fr → 1fr) necesita la clase .acc-open en el
// contenedor. El índice arranca en 0 para que el prerender —que no corre
// efectos— deje al menos una respuesta visible.
export const Faq = () => {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="py-20 md:py-28">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <div className="grid gap-10 lg:gap-20 lg:grid-cols-[360px_minmax(0,1fr)]">
          <div>
            <span className="label accent-text">Preguntas frecuentes</span>
            <Lines
              as="h2"
              className="display-2 text-[28px] md:text-[36px] mt-6"
              lines={["Lo que preguntan", "antes de empezar."]}
            />
            {/* El enlace va subrayado: distinguirlo solo por color falla 1.4.1 —
                en oscuro el ámbar y --ink-2 tienen casi la misma luminancia. */}
            <p data-reveal style={{ "--d": "180ms" }} className="ink-2 text-[15px] mt-5">
              ¿No está la tuya?{" "}
              <a
                href="#contacto"
                className="accent-text underline underline-offset-4 decoration-1"
              >
                Escribinos
              </a>{" "}
              y respondemos en menos de 6 h hábiles.
            </p>
          </div>

          <div data-reveal-group>
            {FAQ.map((item, i) => {
              const isOpen = open === i;
              const panelId = "faq-panel-" + i;
              const buttonId = "faq-q-" + i;

              return (
                <div
                  key={item.q}
                  className={`border-t border-line${i === FAQ.length - 1 ? " border-b" : ""}${isOpen ? " acc-open" : ""}`}
                >
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="w-full flex items-start justify-between gap-6 text-left py-5 min-h-[44px] cursor-pointer"
                  >
                    <span className="display-2 text-[18px] md:text-[21px] pr-2">{item.q}</span>
                    <span
                      className="acc-sign ink-3 text-[20px] leading-none shrink-0 mt-0.5"
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </button>

                  <div className="acc-body" id={panelId}>
                    <div>
                      <p className="ink-2 text-[15px] leading-relaxed pb-6 max-w-[62ch]">{item.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
