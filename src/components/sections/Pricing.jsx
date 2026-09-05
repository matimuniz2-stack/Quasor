import { Button, SectionHead } from "../ui/index.js";

// Los planes no son tarjetas: son tres columnas de una misma tabla, separadas
// por filetes. Como el precio se cierra en la reunión, lo que ordena la lectura
// es el tamaño del equipo, no una lista de features recortada por plan.
const PLANS = [
  {
    name: "esencial",
    tag: "Equipos chicos que arrancan",
    features: [
      "Hasta 4 usuarios",
      "Meta o Google Ads: el canal que más usás",
      "Soporte por WhatsApp en horario AR",
    ],
  },
  {
    name: "pro",
    tag: "Equipos en crecimiento",
    featured: true,
    features: [
      "Hasta 8 usuarios",
      "Meta y Google Ads, todo en un solo lugar",
      "Soporte prioritario",
    ],
  },
  {
    name: "custom",
    tag: "Grupos y multisucursal",
    features: [
      "Más de 8 usuarios, sin límite",
      "Integraciones a medida con cualquier API",
      "API pública, webhooks y endpoints propios",
      "Account manager dedicado",
    ],
  },
];

const INCLUDED = [
  "WhatsApp en un clic",
  "Tokko: catálogo siempre al día",
  "Pipeline y asignación a vendedor",
  "Reparto de comisiones (venta y alquiler)",
  "Automatizaciones: asignación, alertas y captura",
  "Dashboards multifuente",
  "Reportes y exportación",
  "Tus datos son tuyos: CSV, JSON o backup completo",
  "Nuevas funciones incluidas, mes a mes",
];

const FIT = [
  "Tenés 4 o más vendedores activos",
  "Recibís 50 o más consultas por mes",
  "Querés medir conversión por vendedor",
];
const FIT_NOTES = [
  "Si trabajás solo, una planilla alcanza.",
  "Con ese volumen, la asignación automática rinde.",
  "Cada lead atribuido y medible.",
];

const NO_FIT = [
  "Buscás algo gratis o muy barato",
  "Vendés dos o tres propiedades al año",
  "Querés un sistema que se configure solo",
];
const NO_FIT_NOTES = [
  "Hay opciones. Esta no es esa.",
  "El retorno no se justifica a esa escala.",
  "Las primeras dos semanas requieren tu participación.",
];

const Check = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    className="shrink-0 mt-[5px]"
  >
    <path
      d="M2.8 8.4 6.2 11.7 13.2 4.3"
      stroke="var(--accent)"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Pricing = () => (
  <section id="precios" className="py-20 md:py-28">
    <div className="max-w-[1280px] mx-auto px-6 md:px-10">
      <SectionHead
        label="Planes"
        title={["Tres planes,", "por tamaño de equipo."]}
        lead="Mensual, sin permanencia. El precio se define en la primera reunión, cuando ya sabemos qué necesitás."
      />

      {/* --- Los tres planes ------------------------------------------------ */}
      <div data-reveal-group className="mt-12 grid md:grid-cols-3">
        {PLANS.map((plan, i) => (
          <div
            key={plan.name}
            style={plan.featured ? { borderTopColor: "var(--accent)" } : undefined}
            className={[
              "flex flex-col pt-7 pb-8 md:pt-8 md:pb-0",
              // El único filete que sobrevive es el naranja del plan destacado:
              // sin la regla gris al lado ya no separa columnas, marca una.
              plan.featured
                ? "border-t-2 md:px-8"
                : i === 0
                  ? "md:pr-8"
                  : "md:pl-8",
            ].join(" ")}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="label ink-3">{plan.name}</span>
              {plan.featured && <span className="label accent-text">Recomendado</span>}
            </div>

            <div className="mt-5">
              <span className="text-[30px] md:text-[34px] font-semibold tracking-[-0.035em]">
                A medida
              </span>
            </div>
            <p className="ink-3 text-[14px] mt-1">{plan.tag}</p>

            <ul className="mt-7 space-y-2.5">
              {plan.features.map((f) => (
                <li key={f} className="flex gap-2.5">
                  <span
                    aria-hidden="true"
                    className="shrink-0 select-none leading-[1.6]"
                    style={{ color: plan.featured ? "var(--accent-text)" : "var(--line-2)" }}
                  >
                    —
                  </span>
                  <span className="ink-2 text-[14px] leading-[1.6]">{f}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-8">
              <Button
                href="#contacto"
                variant={plan.featured ? "primary" : "ghost"}
                className="w-full min-h-[46px] px-4 py-3 text-[14px]"
                aria-label={`Reservar 30 min — plan ${plan.name}`}
              >
                Reservar 30 min
                <span className="arrow" aria-hidden="true">→</span>
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* --- Lo que va en los tres ------------------------------------------ */}
      <div data-reveal className="mt-14">
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
          <span className="label ink">En los tres planes, sin recortes</span>
          <span className="label ink-3">
            Solo cambia el tamaño del equipo y las plataformas de ads
          </span>
        </div>

        <ul className="mt-7 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2.5">
          {INCLUDED.map((item) => (
            <li key={item} className="flex gap-2.5">
              <Check />
              <span className="ink-2 text-[14px] leading-[1.6]">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* --- Encajamos / no encajamos ---------------------------------------- */}
      <div data-reveal className="mt-14 grid md:grid-cols-2">
        <div className="md:pr-10">
          <span className="label ink">Encajamos si</span>
          <ul className="mt-6 space-y-5">
            {FIT.map((title, i) => (
              <li key={title}>
                <p className="text-[15px] font-medium ink leading-snug">{title}</p>
                <span className="label label-lc ink-3 block mt-1">{FIT_NOTES[i]}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 md:mt-0 md:pl-10">
          <span className="label ink-3">No encajamos si</span>
          <ul className="mt-6 space-y-5">
            {NO_FIT.map((title, i) => (
              <li key={title}>
                <p className="text-[15px] ink-3 leading-snug">{title}</p>
                <span className="label label-lc ink-3 block mt-1">{NO_FIT_NOTES[i]}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
);
