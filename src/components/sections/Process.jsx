import { PROCESS } from "../../data.js";
import { SectionHead } from "../ui/index.js";

// El entregable no vive en data.js: PROCESS describe qué pasa en la etapa, esto
// es lo que queda en manos del cliente cuando la etapa cierra.
const DELIVERABLES = [
  "Entregable · Plan de implementación",
  "Entregable · Sistema en producción",
  "Entregable · Equipo operativo",
  "Entregable · Respuesta en menos de 6 h",
];

// Divisores: horizontales al apilarse en mobile, verticales entre columnas en md+.
const edges = (i, last) =>
  [
    i > 0 &&
      "border-t border-line pt-8 mt-8 md:border-t-0 md:mt-0 md:pt-0 md:border-l md:pl-7",
    i < last && "md:pr-7",
  ]
    .filter(Boolean)
    .join(" ");

export const Process = () => (
  <section id="proceso" className="border-t border-line py-20 md:py-28">
    <div className="max-w-[1280px] mx-auto px-6 md:px-10">
      <SectionHead
        label="Puesta en marcha"
        title={["Cuatro etapas.", "Entre una y dos semanas."]}
        lead="Cada etapa tiene un entregable concreto y una fecha. Nada de proyectos abiertos durante meses."
      />

      {/* Los cuatro nodos son idénticos a propósito: esto es una secuencia
          publicada, no una barra de progreso de un proyecto en curso. */}
      <div aria-hidden="true" className="hidden md:block relative h-3 mt-12">
        <div className="absolute left-[5px] right-[5px] top-1/2 -translate-y-1/2 h-px bg-[var(--line-2)]" />
        <div className="relative grid grid-cols-4 h-full items-center">
          {PROCESS.map((p) => (
            <span key={p.n} className="block h-[10px] w-[10px] bg-[var(--accent)]" />
          ))}
        </div>
      </div>

      <div data-reveal-group className="grid md:grid-cols-4 mt-12 md:mt-9">
        {PROCESS.map((p, i) => (
          <div key={p.n} className={`flex flex-col ${edges(i, PROCESS.length - 1)}`}>
            <span className="label accent-text">
              {p.n} · {p.tag}
            </span>
            <h3 className="mt-3 text-[16.5px] md:text-[17.5px] font-semibold tracking-[-0.01em]">
              {p.name}
            </h3>
            {/* Crece para que los hairlines del pie queden a la misma altura. */}
            <p className="ink-2 text-[14px] leading-relaxed mt-2.5 md:grow">{p.body}</p>
            <div className="hairline mt-6 pt-4">
              <span className="label ink-3">{DELIVERABLES[i]}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
