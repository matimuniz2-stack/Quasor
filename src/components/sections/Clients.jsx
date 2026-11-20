import { SectionHead } from "../ui/index.js";
import zamboni from "../../assets/clientes/cl-zamboni.png";
import giama from "../../assets/clientes/cl-giama.png";
import mg from "../../assets/clientes/cl-mg.png";
import chery from "../../assets/clientes/cl-chery.png";
import fiat from "../../assets/clientes/cl-fiat.svg";

// Quién usa Quasor, con permiso: Zamboni, MG y Chery desde el 2026-09-27;
// Fiat Giama y Senderos los sumó Mati el 2026-11-20. Senderos es el local
// multimarca nuevo del Grupo Giama (Fiat, Jeep, Chery y MG) que abre en
// diciembre de 2026: no tiene logo propio, así que se dibuja con las marcas
// que vende. Jeep va en texto porque Jeep no es cliente de Quasor: lo es Giama.
//
// El árbol es el mismo trazo de los carriles del hero: Giama arriba y una
// línea fina a cada punto de venta. Se dibuja una sola vez, cuando el tablero
// entra en pantalla (data-reveal → .in, lo maneja el observer de App.jsx).
const BRANCHES = [
  { name: "MG", kind: "Concesionaria", logo: { src: mg, w: 132, h: 132, cls: "cl-b-mg" } },
  { name: "Chery", kind: "Concesionaria", logo: { src: chery, w: 300, h: 100, cls: "cl-b-chery" } },
  { name: "Fiat", kind: "Concesionaria", tag: "Nuevo", logo: { src: fiat, w: 54, h: 41, cls: "cl-b-fiat" } },
  { name: "Senderos", kind: "Local multimarca", tag: "Diciembre", multi: true },
];

// Del nodo de Giama (x = 300) a los centros de cuatro columnas iguales. El SVG
// ocupa 3/4 del ancho, así 0, 200, 400 y 600 caen en 1/8, 3/8, 5/8 y 7/8.
const RAILS = [0, 200, 400, 600].map((x) => `M300 0 C300 52 ${x} 36 ${x} 88`);

const Multi = () => (
  <span className="cl-multi" aria-hidden="true">
    <span className="cl-coin"><img className="cl-logo" src={fiat} alt="" width="54" height="41" /></span>
    <span className="cl-coin cl-coin-txt">Jeep</span>
    <span className="cl-coin"><img className="cl-logo" src={chery} alt="" width="300" height="100" /></span>
    <span className="cl-coin"><img className="cl-logo" src={mg} alt="" width="132" height="132" /></span>
  </span>
);

export const Clients = () => (
  <section id="clientes" className="py-20 md:py-28">
    <div className="max-w-[1280px] mx-auto px-6 md:px-10">
      <SectionHead
        label="Clientes"
        meta="Inmobiliarias y concesionarias"
        title={["Ya trabajan con Quasor.", "Una inmobiliaria y un grupo automotor."]}
        lead="Zamboni maneja sus consultas en Quasor. El Grupo Giama lo usa en sus concesionarias MG, Chery y Fiat, y en Senderos, el local multimarca que abre en diciembre."
      />

      <div className="cl-board mt-12" data-reveal>
        <article className="cl-card cl-inmo" aria-label="Inmobiliaria: Zamboni Negocios Inmobiliarios, Mar del Plata">
          <p className="cl-tag label ink-3"><i aria-hidden="true" />Inmobiliaria</p>
          <div className="cl-zam">
            <img className="cl-logo cl-logo-color" src={zamboni} alt="Zamboni Negocios Inmobiliarios" width="420" height="76" loading="lazy" />
          </div>
          <p className="cl-foot">
            <b className="ink">Zamboni Negocios Inmobiliarios</b>
            <span className="ink-3">Mar del Plata</span>
          </p>
        </article>

        <article
          className="cl-card cl-group"
          aria-label="Grupo Giama: concesionarias MG, Chery y Fiat, y Senderos, local multimarca de Fiat, Jeep, Chery y MG que abre en diciembre"
        >
          <p className="cl-tag label ink-3"><i aria-hidden="true" />Concesionarias · Grupo Giama</p>
          <div className="cl-tree">
            <div className="cl-root">
              <img className="cl-logo" src={giama} alt="Giama" width="300" height="68" loading="lazy" />
              <span className="cl-node" aria-hidden="true" />
            </div>
            <svg className="cl-rails" viewBox="0 0 600 88" preserveAspectRatio="none" aria-hidden="true">
              {RAILS.map((d, i) => (
                <g key={d}>
                  <path className={`cl-r cl-r${i + 1}`} d={d} pathLength="100" vectorEffect="non-scaling-stroke" />
                  <path className="cl-p" style={{ "--d": `${i * 110}ms` }} d={d} pathLength="100" vectorEffect="non-scaling-stroke" />
                </g>
              ))}
            </svg>
            <ul className="cl-brands">
              {BRANCHES.map((b, i) => (
                <li key={b.name} style={{ "--d": `${700 + i * 100}ms` }}>
                  <span className="cl-lb">
                    {b.multi ? (
                      <Multi />
                    ) : (
                      <img className={`cl-logo ${b.logo.cls}`} src={b.logo.src} alt={b.name} width={b.logo.w} height={b.logo.h} loading="lazy" />
                    )}
                  </span>
                  <b className="ink">
                    {b.name}
                    {b.tag && <em className="cl-new">{b.tag}</em>}
                  </b>
                  <span className="label label-lc ink-3">{b.kind}</span>
                  {b.multi && <span className="cl-sub ink-3">Fiat · Jeep · Chery · MG</span>}
                </li>
              ))}
            </ul>
          </div>
        </article>
      </div>
    </div>
  </section>
);
