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
  <section id="servicios" className="py-20 md:py-28">
    <div className="max-w-[1280px] mx-auto px-6 md:px-10">
      <SectionHead
        label="Servicios"
        title={["El CRM es el centro.", "Tres sistemas alrededor."]}
        lead="Tres pilares conectados al mismo dato: no hay que exportar nada para que hablen entre sí."
      />

      {/* Las cuatro bandas (etiqueta, titular, bajada, viñetas) son filas de la
          grilla exterior y cada pilar las hereda con subgrid: así el titular de
          dos líneas del primero no empuja sus viñetas por debajo de las de los
          otros dos. El divisor es el borde izquierdo del pilar, no un hijo
          aparte, para que la grilla siga teniendo tres columnas limpias. */}
      <div
        data-reveal-group
        className="mt-12 md:mt-16 md:grid md:grid-cols-3 md:[grid-template-rows:auto_auto_auto_auto]"
      >
        {SERVICES.map((s, i) => (
          <div
            key={s.k}
            className={[
              "md:grid md:grid-rows-subgrid md:row-span-4 md:min-w-0",
              i > 0 ? "pt-10 mt-10 md:mt-0 md:pt-0 md:pl-8 lg:pl-10" : "",
              i < SERVICES.length - 1 ? "md:pr-8 lg:pr-10" : "",
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
        ))}
      </div>
    </div>
  </section>
);
