import { SectionHead } from "../ui/index.js";

// La comparación se lee como una tabla de specs, no como una tarjeta de precios:
// por eso es una <table> real (con encabezados de fila y de columna) y no una
// grilla de divs. La columna de Quasor se distingue con un filete ámbar y un
// tinte del 5%, sin badge de "recomendado".

const TINT = "color-mix(in oklab, var(--accent) 5%, transparent)";

const COLS = [
  { name: "Internacional", sub: "HubSpot · Zoho · Salesforce" },
  { name: "Quasor", sub: "Hecho para el rubro en Argentina" },
  { name: "Local", sub: "Tokko · Wasi" },
];

const ROWS = [
  {
    k: "Precio y facturación",
    cells: [
      { t: "En USD, sin factura local", ok: false },
      { t: "En pesos, sin permanencia", ok: true },
      { t: "En pesos, factura local", ok: true },
    ],
  },
  {
    k: "Integraciones del stack argentino",
    cells: [
      { t: "Vía Zapier, no nativas", ok: false },
      { t: "Tokko, WhatsApp, Meta y Google nativos", ok: true },
      { t: "Parciales", ok: null },
    ],
  },
  {
    k: "Atribución del aviso a la venta",
    cells: [
      { t: "Add-on caro o trabajo manual", ok: false },
      { t: "Incluida, del aviso a la comisión", ok: true },
      { t: "No trackean la inversión", ok: false },
    ],
  },
  {
    k: "Reparto de comisiones",
    cells: [
      { t: "Módulo extra o planilla", ok: false },
      { t: "Nativo, multidestinatario y multimoneda", ok: true },
      { t: "Por fuera, en planilla", ok: false },
    ],
  },
  {
    k: "Pipeline y automatización",
    cells: [
      { t: "Potente, pero genérico", ok: null },
      { t: "Pensados para inmobiliarias y concesionarias", ok: true },
      { t: "Limitados", ok: false },
    ],
  },
  {
    k: "Soporte",
    cells: [
      { t: "En inglés, por tickets", ok: false },
      { t: "WhatsApp en horario AR, menos de 6 h", ok: true },
      { t: "Cola y ticket", ok: false },
    ],
  },
];

// SVG y no un glifo de texto: la tilde y la cruz tipográficas cambian de peso
// entre fuentes y temas, y acá tienen que leerse idénticas en los dos.
const Mark = ({ ok }) => {
  const label = ok === true ? "Sí" : ok === false ? "No" : "Parcial";
  const d = ok === true ? "M2.5 7 L5.2 9.7 L10.5 3.3" : ok === false ? "M3.2 3.2 L9.8 9.8 M9.8 3.2 L3.2 9.8" : "M3.4 6.5 L9.6 6.5";

  return (
    <svg
      role="img"
      aria-label={label}
      focusable="false"
      width="13"
      height="13"
      viewBox="0 0 13 13"
      className="shrink-0 mt-[4px]"
    >
      <path
        d={d}
        fill="none"
        stroke={ok === true ? "var(--accent)" : "var(--ink-3)"}
        strokeWidth={ok === true ? 1.9 : 1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const Cell = ({ t, ok, quasor }) => (
  <span className="flex items-start gap-2.5">
    <Mark ok={ok} />
    <span style={quasor ? { color: "var(--ink)" } : undefined} className={quasor ? "" : "ink-2"}>
      {t}
    </span>
  </span>
);

export const WhyQuasor = () => (
  <section id="por-que" className="border-t border-line py-20 md:py-28">
    <div className="max-w-[1280px] mx-auto px-6 md:px-10">
      <SectionHead
        label="Comparación"
        title={["La comparación,", "sin medias verdades."]}
        lead="Los CRM internacionales son más potentes en abstracto. Los locales facturan en pesos. Ninguno de los dos ata la inversión publicitaria a la venta."
      />

      <div data-reveal style={{ "--d": "120ms" }} className="mt-12 md:mt-16">
        {/* La tabla no entra en pantallas chicas: la región que scrollea lleva
            tabIndex para que el teclado también pueda recorrerla. */}
        <div
          role="group"
          aria-labelledby="por-que-tabla"
          tabIndex={0}
          className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0"
        >
          <table className="w-full min-w-[720px] border-collapse border-b border-line text-left">
            <caption id="por-que-tabla" className="sr-only">
              Quasor comparado con los CRM internacionales y los CRM locales, criterio por criterio.
            </caption>

            <colgroup>
              <col style={{ width: "22%" }} />
              <col style={{ width: "26%" }} />
              <col style={{ width: "26%" }} />
              <col style={{ width: "26%" }} />
            </colgroup>

            <thead>
              <tr>
                <th
                  scope="col"
                  className="align-bottom pb-5 pr-5 md:pr-8 border-b border-line"
                  style={{ borderTop: "2px solid transparent" }}
                >
                  <span className="sr-only">Criterio</span>
                </th>
                {COLS.map(({ name, sub }, i) => {
                  const quasor = i === 1;
                  return (
                    <th
                      key={name}
                      scope="col"
                      className="align-bottom px-4 md:px-5 pt-6 pb-5 border-b border-line"
                      style={{
                        borderTop: `2px solid ${quasor ? "var(--accent)" : "transparent"}`,
                        background: quasor ? TINT : undefined,
                      }}
                    >
                      <span
                        className={`block text-[19px] md:text-[21px] font-semibold tracking-[-0.03em] ${quasor ? "" : "ink-2"}`}
                        style={quasor ? { color: "var(--ink)" } : undefined}
                      >
                        {name}
                      </span>
                      <span className={`block label label-lc mt-2 ${quasor ? "accent-text" : "ink-3"}`}>
                        {sub}
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody className="text-[14px] md:text-[15px] leading-relaxed">
              {ROWS.map(({ k, cells }) => (
                <tr key={k}>
                  <th
                    scope="row"
                    className="align-top py-5 pr-5 md:pr-8 font-semibold border-t border-line"
                  >
                    {k}
                  </th>
                  {cells.map((c, i) => {
                    const quasor = i === 1;
                    return (
                      <td
                        key={COLS[i].name}
                        className="align-top py-5 px-4 md:px-5 border-t border-line"
                        style={quasor ? { background: TINT } : undefined}
                      >
                        <Cell {...c} quasor={quasor} />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
);
