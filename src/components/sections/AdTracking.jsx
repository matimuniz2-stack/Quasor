import { CountUp } from "../motion.jsx";
import { SectionHead, Stage } from "../ui/index.js";

// El formato del peso vive en un solo lugar: mientras el contador corre, las
// cinco filas tienen que compartir exactamente el mismo separador de miles.
const money = (n) => `$${Math.round(n).toLocaleString("es-AR")}`;

// Tinte ámbar para las dos piezas destacadas. Transparente (y no --accent-soft)
// para que se lea como una marca SOBRE el stage y no como un parche opaco.
const ACCENT_TINT = "color-mix(in oklab, var(--accent) 10%, transparent)";

const CHAIN = [
  { t: "Inversión en ads", m: "Meta + Google · diario" },
  { t: "Lead atribuido", m: "Campaña + aviso" },
  { t: "Vendedor asignado", m: "Automático, al instante" },
  { t: "Venta cerrada", m: "Trazada de punta a punta" },
  { t: "Ganancia por campaña", m: "Ingreso y comisión, no solo costo", hl: true },
];

const STEPS = [
  {
    n: "01 · Sincronizamos",
    h: "Tu inversión, todos los días.",
    p: "Conectás Meta Ads y Google Ads una vez. Importamos campañas, avisos y el gasto de cada día, sin planillas ni carga manual.",
  },
  {
    n: "02 · Atribuimos",
    h: "Cada lead, atado a su aviso.",
    p: "La consulta entra ya vinculada a la campaña y al aviso que la generaron. Se asigna al vendedor al instante y queda trazada de punta a punta.",
  },
  {
    n: "03 · Medimos",
    h: "Costo real, del clic al cierre.",
    p: "Ves cuánto cuesta un lead y cuánto cuesta una venta cerrada. Sabés qué campaña deja ganancia y cuál deja pérdida, y la pausás a tiempo.",
  },
];

const ROWS = [
  { k: "Inversión", to: 184500, format: money },
  { k: "Leads", to: 42 },
  { k: "Costo por lead", to: 4393, format: money },
  { k: "Ventas", to: 2 },
  { k: "Costo por venta", to: 92250, format: money, hl: true },
];

// Separador de la cadena: apunta a la derecha cuando los nodos son una fila y
// hacia abajo cuando se apilan. Es una marca, no texto: va en --accent.
//
// En md+ vive DENTRO del gap de la fila: ancho fijo w-7 anulado por -ml-7, así
// no le descuenta ancho a su nodo y los cinco quedan exactamente iguales (el
// primero, que no lleva flecha, si no quedaba 38px más ancho que el resto).
const Link = () => (
  <span
    aria-hidden="true"
    className="flex shrink-0 items-center justify-center py-1.5 md:-ml-7 md:w-7 md:py-0"
  >
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="rotate-90 md:rotate-0">
      <path
        d="M1.5 7h10M8 3.5 11.5 7 8 10.5"
        stroke="var(--accent)"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </span>
);

export const AdTracking = () => (
  <section id="ads" className="border-t border-line py-20 md:py-28">
    <div className="max-w-[1280px] mx-auto px-6 md:px-10">
      <SectionHead
        label="Atribución"
        meta="Meta + Google · sincronización diaria"
        title={["Del aviso a la comisión,", "sin cortes."]}
        lead="La mayoría de los CRM te muestran el lead. Quasor te muestra cuánto costó, qué campaña lo trajo y si esa campaña terminó dejando ganancia."
      />

      <Stage tone="teal" className="mt-12 p-6 md:p-10">
        <div data-reveal-group className="flex flex-col md:flex-row md:items-stretch md:gap-7">
          {CHAIN.map((node, i) => (
            <div key={node.t} className="min-w-0 flex flex-col md:flex-1 md:flex-row md:items-stretch">
              {i > 0 && <Link />}
              <div
                className={`flex-1 rounded-[var(--r-sm)] border px-4 py-3 ${
                  node.hl ? "" : "border-[var(--stage-line)]"
                }`}
                style={node.hl ? { borderColor: "var(--accent)", background: ACCENT_TINT } : undefined}
              >
                <div className={`text-[14.5px] font-medium leading-snug ${node.hl ? "text-[var(--accent-text-on-tint)]" : ""}`}>
                  {node.t}
                </div>
                <span className="label label-lc ink-3 mt-1 block">{node.m}</span>
              </div>
            </div>
          ))}
        </div>

        <div aria-hidden="true" className="mt-8 md:mt-10 h-px bg-[var(--stage-hair)]" />

        <div
          data-reveal-group
          className="mt-8 md:mt-10 grid gap-8 md:gap-0 md:grid-cols-3 lg:grid-cols-4"
        >
          {STEPS.map((step, i) => (
            <div
              key={step.n}
              className={
                i === 0
                  ? "md:pr-7"
                  : `md:border-l border-[var(--stage-hair)] md:pl-7 ${i === 1 ? "md:pr-7" : "lg:pr-7"}`
              }
            >
              <span className="label accent-text">{step.n}</span>
              <h3 className="mt-3 text-[17px] md:text-[18px] font-semibold leading-snug">{step.h}</h3>
              <p className="ink-2 text-[14.5px] leading-relaxed mt-2.5">{step.p}</p>
            </div>
          ))}

          <div className="md:col-span-3 md:mt-8 md:border-t border-[var(--stage-hair)] md:pt-8 lg:col-span-1 lg:mt-0 lg:border-t-0 lg:border-l lg:pl-7 lg:pt-0">
            <span className="label ink-3">Ficha de campaña</span>
            <div className="mt-3 rounded-[var(--r-md)] border border-[var(--stage-line)] overflow-hidden">
              <div className="px-4 py-3 text-[14.5px] font-medium">Depto 2 amb · Centro</div>
              {ROWS.map((row) => (
                <div
                  key={row.k}
                  className="flex items-baseline justify-between gap-3 border-t border-[var(--stage-hair)] px-4 py-2.5"
                  style={row.hl ? { background: ACCENT_TINT } : undefined}
                >
                  <span className="label label-lc ink-3">{row.k}</span>
                  <CountUp
                    to={row.to}
                    format={row.format}
                    className={`mono text-[13.5px] ${row.hl ? "text-[var(--accent-text-on-tint)]" : "ink"}`}
                  />
                </div>
              ))}
            </div>
            <span className="label ink-3 mt-3 block">Datos de ejemplo</span>
          </div>
        </div>
      </Stage>
    </div>
  </section>
);
