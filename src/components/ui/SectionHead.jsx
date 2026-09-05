import { Lines } from "../motion.jsx";

// Every section opens the same way, so it lives in one place: a mono label on
// the left, an optional meta note on the right, then the headline (rising out
// of its mask) beside a short lead paragraph.
//
// Sin filete bajo la etiqueta: el borde superior de la sección ya separa, y
// dos líneas a 40px de distancia leían como ruido repetido en cada sección.
//
//   <SectionHead
//     label="Atribución"
//     meta="Meta + Google · diario"
//     title={["Del aviso a la comisión,", "sin cortes."]}
//     lead="La mayoría de los CRM te muestran el lead…"
//   />
//
// `title` is an array of LINES — pass the breaks you want; they are the
// composition, not an accident of the container width.
export const SectionHead = ({ label, meta, title = [], lead, className = "", titleClassName = "" }) => (
  <div className={className}>
    <div className="flex items-baseline justify-between gap-6 flex-wrap">
      <span className="label accent-text">{label}</span>
      {meta && <span className="label ink-3">{meta}</span>}
    </div>
    <div className="mt-7 flex flex-col lg:flex-row lg:items-end gap-6 lg:gap-16">
      <Lines
        as="h2"
        lines={title}
        className={`display-2 text-[30px] md:text-[42px] flex-1 ${titleClassName}`.trim()}
      />
      {lead && (
        <p
          data-reveal
          style={{ "--d": "180ms" }}
          className="ink-2 text-[15px] md:text-base leading-relaxed lg:max-w-[420px] lg:pb-1"
        >
          {lead}
        </p>
      )}
    </div>
  </div>
);
