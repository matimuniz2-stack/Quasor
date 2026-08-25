import { SectionHead } from "../ui/index.js";
import { SERVICES } from "../../data.js";

// Cada pilar lleva un titular propio en vez de repetir el nombre del servicio:
// el nombre es la etiqueta (qué es) y el titular es la promesa (qué te resuelve).
const HEADLINES = {
  DASH: "Tus propios tableros, sin depender de nadie.",
  API: "Cada dato entra desde su fuente.",
  AUTO: "El trabajo repetitivo corre solo.",
};

export const Services = () => (
  <section id="servicios" className="border-t border-line py-20 md:py-28">
    <div className="max-w-[1280px] mx-auto px-6 md:px-10">
      <SectionHead
        label="Servicios"
        title={["El CRM es el centro.", "Tres sistemas alrededor."]}
        lead="Tres pilares conectados al mismo dato: no hay que exportar nada para que hablen entre sí."
      />

      {/* El divisor viaja dentro del pilar que sigue, así el grupo tiene
          exactamente tres hijos directos y el escalonado no cuenta filetes. */}
      <div data-reveal-group className="mt-12 md:mt-16 flex flex-col md:flex-row">
        {SERVICES.map((s, i) => (
          <div key={s.k} className="flex flex-col md:flex-row md:flex-1 md:min-w-0">
            {i > 0 && (
              <div
                aria-hidden="true"
                className="shrink-0 h-px w-full md:h-auto md:w-px md:self-stretch bg-[var(--line)]"
              />
            )}
            <div
              className={[
                "md:flex-1 md:min-w-0",
                i > 0 ? "pt-8 md:pt-0 md:pl-8 lg:pl-10" : "",
                i < SERVICES.length - 1 ? "pb-8 md:pb-0 md:pr-8 lg:pr-10" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <span className="label accent-text block">{s.name}</span>
              <h3 className="mt-3 text-[17px] md:text-[18px] font-semibold tracking-[-0.01em]">
                {HEADLINES[s.k]}
              </h3>
              <p className="ink-2 text-[14.5px] leading-relaxed mt-3">{s.body}</p>
              <ul className="mt-6 space-y-3">
                {s.bullets.map((b) => (
                  <li key={b} className="flex gap-2.5 ink-2 text-[13.5px] leading-snug">
                    <span className="accent-text shrink-0" aria-hidden="true">
                      —
                    </span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
