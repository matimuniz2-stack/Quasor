import { Button, Badge, Stage } from "../ui/index.js";
import { Lines, useParallax } from "../motion.jsx";
import { Dashboard } from "../Dashboard.jsx";

// Composición centrada: el texto entra con `rise` (no con data-reveal) porque
// está sobre el fold y esperar al observer lo dejaría en blanco durante el
// primer paint. El escalonado se pide con --d, no con hooks.
export const Hero = () => {
  // El paralaje va SOLO en la placa: mover el stage arrastraría el color de la
  // sección entera y rompería la sensación de UI apoyada dentro del panel.
  const plateRef = useParallax(0.05, 26);

  return (
    // El aire de abajo va en la <section>, no en el div interno: así lo gobierna
    // la misma regla de densidad que el resto de las secciones y el salto al
    // bloque siguiente mide igual que todos los demás.
    <section className="relative pb-20 md:pb-28">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 pt-10 md:pt-16">
        <div className="text-center">
          {/* inline-block: `rise` traslada, y transform no aplica a un inline puro. */}
          <span className="rise inline-block label accent-text" style={{ "--d": "0ms" }}>
            CRM + atribución publicitaria · Argentina
          </span>

          <Lines
            as="h1"
            delay={160}
            className="display text-[33px] min-[400px]:text-[38px] md:text-[54px] xl:text-[62px] max-w-[880px] mx-auto mt-6"
            lines={["Quasor ata cada venta", "al aviso que la pagó."]}
          />

          <p
            className="rise mx-auto max-w-[620px] mt-6 ink-2 text-[15px] md:text-[17px] leading-relaxed"
            style={{ "--d": "300ms" }}
          >
            Quasor captura los leads de Meta, Google, los portales y tu sitio, los hace avanzar por
            un pipeline visual y cierra con reparto de comisiones. La inversión publicitaria entra
            sincronizada todos los días: ves el costo por lead y por venta cerrada, no solo por clic.
          </p>

          <div
            className="rise mt-8 flex flex-wrap items-center justify-center gap-3"
            style={{ "--d": "400ms" }}
          >
            <Button href="#contacto" className="text-[15px] px-5 py-3">
              Coordinar 30 minutos
              <span className="arrow" aria-hidden="true">→</span>
            </Button>
            <Button variant="ghost" href="#caso" className="text-[15px] px-5 py-3">
              Ver el caso medido
            </Button>
          </div>

          <div className="rise label ink-3 mt-5" style={{ "--d": "480ms" }}>
            Mensual, sin permanencia · Exportás tus datos cuando quieras
          </div>
        </div>

        <Stage tone="amber" className="mt-12 md:mt-16 p-3 md:p-6" data-reveal>
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 mb-3">
            <Badge dot pulse dotColor="var(--pos)" className="label ink-3">
              Demo en vivo · datos de ejemplo
            </Badge>
            <span className="label ink-3 max-md:hidden">quasor.app/inicio</span>
          </div>

          {/* #producto es ancla de la nav y del footer: no se mueve de acá. */}
          <div id="producto" ref={plateRef} className="plate">
            <Dashboard />
          </div>
        </Stage>
      </div>
    </section>
  );
};
