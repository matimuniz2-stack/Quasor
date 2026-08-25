import { SiWhatsapp, SiGmail } from "react-icons/si";
import { Lines } from "../motion.jsx";
import { Button, Stage } from "../ui/index.js";

// El cierre repite el stage ámbar del hero: la última pantalla rima con la
// primera y la página termina donde empezó, en la señal de marca.

const FACTS = [
  { k: "Respuesta", v: "menos de 6 h", note: "hábiles · 09–19 ART" },
  { k: "Ubicación", v: "Mar del Plata", note: "trabajamos en toda la Argentina" },
  { k: "Disponibilidad", v: "Inmediata", note: "coordinamos esta semana" },
];

export const Contact = () => (
  <section id="contacto" className="border-t border-line">
    <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-20 md:py-28">
      <Stage tone="amber" className="p-8 md:p-14" data-reveal>
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          <div className="flex-1 min-w-0">
            <span className="label accent-text">Consulta inicial · sin compromiso</span>

            <Lines
              as="h2"
              className="display-2 text-[32px] md:text-[46px] mt-6 max-w-[16ch]"
              lines={["Treinta minutos", "para saber si podemos ayudarte."]}
            />

            <p className="ink-2 text-[15px] md:text-[16.5px] leading-relaxed mt-6 max-w-[560px]">
              Conversamos sobre tu operación actual y los objetivos que querés
              resolver. Hacemos preguntas y al final te decimos con franqueza si
              encajamos. Si no, te orientamos hacia algo que sí.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                href="https://wa.me/5492236892809"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chatear por WhatsApp (abre en una pestaña nueva)"
                className="px-5 py-3.5 text-[15px]"
              >
                <SiWhatsapp aria-hidden="true" size={17} />
                +54 9 223 689 2809
              </Button>

              <Button
                variant="ghost"
                href="mailto:ventas@quasor.io"
                className="px-5 py-3.5 text-[15px]"
              >
                <SiGmail aria-hidden="true" size={16} className="opacity-70" />
                ventas@quasor.io
              </Button>
            </div>
          </div>

          <div className="lg:w-[300px] lg:shrink-0">
            {FACTS.map((f, i) => (
              <div key={f.k}>
                {i > 0 && <div className="stage-rule h-px my-6" aria-hidden="true" />}
                <span className="label ink-3 block">{f.k}</span>
                <p className="text-[24px] md:text-[27px] font-semibold tracking-[-0.03em] mt-1.5">
                  {f.v}
                </p>
                <span className="label label-lc ink-3 block mt-1">{f.note}</span>
              </div>
            ))}
          </div>
        </div>
      </Stage>
    </div>
  </section>
);
