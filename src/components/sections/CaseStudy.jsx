import { CountUp } from "../motion.jsx";
import { SectionHead, Stage } from "../ui/index.js";
import { TESTIMONIALS } from "../../data.js";

const T = TESTIMONIALS[0];

// El cuadro antes/después es propio de este caso: no está en data.js porque no
// lo consume ninguna otra sección ni el JSON-LD del build.
const BEFORE_AFTER = [
  { k: "Leads perdidos", a: "62 %", b: "≈ 0 %", d: "−99,9 %" },
  { k: "Cierres por mes", a: "12", b: "17", d: "+43 %" },
  { k: "Tiempo de asignación", a: "4 h", b: "menos de 2 min", d: "−97 %" },
  { k: "Trazabilidad de punta a punta", a: "0 %", b: "100 %", d: "+100 %" },
  { k: "Plataformas a revisar", a: "4", b: "1", d: "−3" },
];

const BIG = "block leading-none text-[34px] md:text-[44px] font-semibold";
const TH = "label ink-3 pb-3 align-bottom";
const TD = "label label-lc num py-3.5 whitespace-nowrap";

export const CaseStudy = () => (
  <section id="caso" className="py-20 md:py-28">
    <div className="max-w-[1280px] mx-auto px-6 md:px-10">
      <SectionHead
        label="Caso medido"
        meta="Identidad bajo NDA"
        title={["Seis semanas en una", "inmobiliaria de Mar del Plata."]}
        lead="Seis vendedores, cuatro plataformas abiertas y una planilla que nunca coincidía con la realidad. Las cifras de abajo son las medidas en producción, no proyecciones."
      />

      <Stage tone="indigo" className="mt-12 p-6 md:p-10" data-reveal>
        <div data-reveal-group className="grid grid-cols-1 md:grid-cols-3">
          <div className="pb-6 md:pb-0 md:pr-8">
            <CountUp
              to={99.9}
              format={(n) => `−${n.toFixed(1).replace(".", ",")} %`}
              className={`${BIG} accent-text`}
            />
            <span className="label label-lc ink-3 block mt-3">Leads perdidos</span>
          </div>

          <div className="py-6 md:py-0 md:px-8">
            <CountUp
              to={43}
              format={(n) => `+${Math.round(n)} %`}
              className={`${BIG} ink`}
            />
            <span className="label label-lc ink-3 block mt-3">Cierres por mes</span>
          </div>

          <div className="pt-6 md:pt-0 md:pl-8">
            <span className={`num ${BIG} ink`}>4 → 1</span>
            <span className="label label-lc ink-3 block mt-3">Plataformas a revisar</span>
          </div>
        </div>

        {/* Sin filete: la cita se separa de los KPI por aire, no por línea. */}
        <blockquote className="mt-10 md:mt-12">
          <p className="ink text-[17px] md:text-[19px] leading-relaxed max-w-[62ch]">
            {T.quote}
          </p>
          <footer className="mt-6">
            <span className="label ink block">{T.who}</span>
            <span className="label label-lc ink-3 block mt-1.5">
              Inmobiliaria · Mar del Plata · 6 vendedores · identidad bajo NDA
            </span>
          </footer>
        </blockquote>
      </Stage>

      <div className="mt-8" data-reveal>
        {/* La tabla no entra en pantallas chicas: la región que scrollea lleva
            tabIndex para que el teclado también pueda recorrerla. */}
        <div
          role="group"
          aria-labelledby="caso-tabla"
          tabIndex={0}
          className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0"
        >
          <table className="w-full min-w-[580px] border-collapse">
            <caption id="caso-tabla" className="sr-only">
              Antes y después de las seis semanas, métrica por métrica.
            </caption>
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className={`${TH} text-left pr-4`}>Métrica</th>
                <th scope="col" className={`${TH} text-right px-4`}>Antes</th>
                <th scope="col" className={`${TH} text-right px-4`}>Después</th>
                <th scope="col" className={`${TH} text-right pl-4`}>Variación</th>
              </tr>
            </thead>
            <tbody>
              {BEFORE_AFTER.map((r) => (
                <tr key={r.k} className="border-b border-line">
                  <th scope="row" className="label label-lc ink-2 py-3.5 pr-4 text-left">
                    {r.k}
                  </th>
                  <td className={`${TD} ink-3 text-right px-4`}>{r.a}</td>
                  <td className={`${TD} ink text-right px-4`}>{r.b}</td>
                  <td className={`${TD} accent-text text-right pl-4`}>{r.d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </section>
);
