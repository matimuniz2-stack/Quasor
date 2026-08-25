import { Chip, Panel, SectionHead } from "../ui/index.js";

// Cada etapa lleva su conteo y su avance en el embudo. La barra pinta el avance
// (por eso crece hacia el cierre) y el número queda al costado: dos lecturas
// distintas del mismo pipeline, sin repetir la cifra dos veces.
const VERTICALS = [
  {
    name: "Inmobiliarias",
    status: "En producción",
    accent: false,
    body: "Captura desde Meta Lead Ads, Google Ads, Tokko y WhatsApp. Asignación automática al vendedor y conversión medida por vendedor.",
    stages: [
      { stage: "Consulta", count: 34, pct: 22 },
      { stage: "Contactado", count: 22, pct: 38 },
      { stage: "Visita", count: 12, pct: 55 },
      { stage: "Oferta", count: 6, pct: 78 },
      { stage: "Cerrado", count: 3, pct: 100 },
    ],
  },
  {
    name: "Concesionarias",
    status: "Lista para arrancar",
    accent: true,
    body: "Ficha de vehículo completa (marca, modelo, km, GNC, estado de dominio) y un pipeline con test drive, oferta y reserva.",
    stages: [
      { stage: "Consulta", count: 44, pct: 18 },
      { stage: "Contactado", count: 28, pct: 30 },
      { stage: "Test drive agendado", count: 16, pct: 42 },
      { stage: "Test drive realizado", count: 11, pct: 56 },
      { stage: "Oferta", count: 7, pct: 72 },
      { stage: "Reserva", count: 5, pct: 88 },
      { stage: "Cerrado", count: 4, pct: 100 },
    ],
  },
];

export const UseCases = () => (
  <section id="casos" className="border-t border-line py-20 md:py-28">
    <div className="max-w-[1280px] mx-auto px-6 md:px-10">
      <SectionHead
        label="Verticales"
        title={["Un pipeline por vertical.", "Las etapas que usás de verdad."]}
        lead="Las etapas no son genéricas: cada vertical tiene el recorrido real. Inmobiliarias en producción; concesionarias, lista para arrancar."
      />

      {VERTICALS.map((v) => (
        <Panel key={v.name} className="mt-8 p-6 md:p-8" data-reveal>
          <div className="flex flex-col lg:flex-row lg:gap-12">
            <div className="lg:w-[300px] lg:shrink-0">
              <span className="label ink block">{v.name}</span>
              <div className="mt-3">
                <Chip accent={v.accent}>
                  {!v.accent && (
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: "var(--pos)" }}
                      aria-hidden="true"
                    />
                  )}
                  {v.status}
                </Chip>
              </div>
              <p className="ink-2 text-[14.5px] leading-relaxed mt-4">{v.body}</p>
            </div>

            <ul className="flex-1 min-w-0 mt-8 lg:mt-0 space-y-3">
              {v.stages.map((s, i) => (
                <li key={s.stage} className="flex items-center gap-4">
                  <span className="label label-lc ink-3 w-[92px] sm:w-[130px] md:w-[150px] shrink-0">
                    {s.stage}
                  </span>
                  <div
                    className="flex-1 min-w-0 h-3 rounded-[var(--r-xs)] bg-[var(--bg-3)] overflow-hidden"
                    role="img"
                    aria-label={`${s.pct} % de avance en el embudo`}
                  >
                    <div
                      className="fill h-full rounded-[var(--r-xs)]"
                      style={{
                        "--w": `${s.pct}%`,
                        "--d": `${i * 90}ms`,
                        background:
                          i >= v.stages.length - 2 ? "var(--accent)" : "var(--line-2)",
                      }}
                    />
                  </div>
                  <span className="label num w-8 text-right ink">{s.count}</span>
                </li>
              ))}
            </ul>
          </div>
        </Panel>
      ))}
    </div>
  </section>
);
