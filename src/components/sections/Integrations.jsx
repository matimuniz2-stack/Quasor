import { SectionHead } from "../ui/index.js";

// El motivo gráfico sale del propio logo: trazas en ángulo recto con nodos
// cuadrados. En desktop la idea es topológica (seis fuentes → un núcleo → tres
// salidas) y por eso es un circuito; en mobile ese dibujo sería ilegible, así
// que la misma información se sirve como lista de integraciones con su estado.

// Geometría del circuito (viewBox 1248×292). Cada fuente tiene su propio codo
// para que las seis trazas no se pisen antes de entrar al bus de y=146.
const SOURCES = [
  { name: "Meta Lead Ads", y: 26, elbow: 262, status: "Nativa" },
  { name: "Google Ads", y: 74, elbow: 302, status: "Nativa" },
  { name: "Tokko Broker", y: 122, elbow: 342, status: "Sincronizando", live: true },
  { name: "WhatsApp", y: 170, elbow: 382, status: "Click-to-chat" },
  { name: "Portales", y: 218, elbow: 422, status: "Nativa" },
  { name: "Tu sitio web", y: 266, elbow: 462, status: "Un script" },
];

const OUTPUTS = [
  { name: "Pipeline", y: 70, elbow: 796 },
  { name: "Atribución", y: 146, elbow: null },
  { name: "Reportes", y: 222, elbow: 836 },
];

const MONO = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

const inPath = (s) => `M182 ${s.y}H${s.elbow}V146H556`;
const outPath = (o) => (o.elbow ? `M692 146H${o.elbow}V${o.y}H1000` : "M692 146H1000");

export const Integrations = () => (
  <section className="border-t border-line py-20 md:py-28">
    <div className="max-w-[1280px] mx-auto px-6 md:px-10">
      <SectionHead
        label="Entrada de datos"
        meta="6 integraciones"
        title={["Los leads entran solos,", "desde donde ya trabajás."]}
        lead="Meta Lead Ads, Google Ads, Tokko Broker, WhatsApp, los portales y los formularios de tu sitio. Se configura una vez; después la sincronización corre sola, todos los días."
      />

      <div data-reveal style={{ "--d": "120ms" }} className="hidden md:block mt-14 lg:mt-16">
        <svg
          viewBox="0 0 1248 292"
          width="100%"
          className="block w-full h-auto"
          role="img"
          aria-label="Diagrama: Meta Lead Ads, Google Ads, Tokko Broker, WhatsApp, los portales y tu sitio web entran a Quasor por una sola vía, y de ahí salen a pipeline, atribución y reportes."
        >
          {/* Las trazas van primero: los nodos y el núcleo se pintan encima y
              tapan los extremos, que es lo que da el remate limpio del circuito. */}
          <g>
            {SOURCES.map((s) => (
              <path key={s.name} d={inPath(s)} className="trace-static" />
            ))}
            {OUTPUTS.map((o) => (
              <path key={o.name} d={outPath(o)} className="trace-static" />
            ))}
          </g>

          {/* Dos pulsos, no nueve: uno entrando y uno saliendo alcanzan para leer
              el sentido del recorrido sin convertir el diagrama en una guirnalda. */}
          <path d={inPath(SOURCES[0])} className="trace-pulse" style={{ "--d": "0s" }} />
          <path d={outPath(OUTPUTS[0])} className="trace-pulse" style={{ "--d": "1.1s" }} />

          {SOURCES.map((s) => (
            <rect key={s.name} x="177" y={s.y - 5} width="10" height="10" className="trace-node" />
          ))}
          {OUTPUTS.map((o) => (
            <rect key={o.name} x="995" y={o.y - 5} width="10" height="10" className="trace-node" />
          ))}

          <rect x="556" y="120" width="136" height="52" fill="var(--bg)" stroke="var(--ink)" />
          <g stroke="var(--accent)" strokeWidth="1.5" fill="none">
            <path d="M556 127V120H563" />
            <path d="M685 120H692V127" />
            <path d="M692 165V172H685" />
            <path d="M563 172H556V165" />
          </g>
          <text
            x="624"
            y="146"
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="'Schibsted Grotesk', system-ui, sans-serif"
            fontSize="19"
            fontWeight="600"
            letterSpacing="-0.035em"
            fill="var(--ink)"
          >
            {/* El punto del wordmark es TEXTO: va en --accent-text, que es lo
                que usan la nav y el footer. --accent puro da 2.1:1 en claro. */}
            quasor<tspan fill="var(--accent-text)">.</tspan>
          </text>

          <g fontFamily={MONO} fontSize="11.5" dominantBaseline="central">
            {SOURCES.map((s) => (
              <text key={s.name} x="163" y={s.y} textAnchor="end" fill="var(--ink-2)">
                {s.name}
              </text>
            ))}
            {OUTPUTS.map((o) => (
              <text key={o.name} x="1019" y={o.y} fill="var(--ink)">
                {o.name}
              </text>
            ))}
          </g>
        </svg>
      </div>

      <ul data-reveal className="md:hidden mt-10 border-t border-line">
        {SOURCES.map((s) => (
          <li
            key={s.name}
            className="flex items-center gap-3 py-3 min-h-[44px] border-b border-line"
          >
            <span
              aria-hidden="true"
              className="w-2 h-2 shrink-0 border"
              style={{
                borderColor: "var(--line-2)",
                background: s.live ? "var(--accent)" : "transparent",
              }}
            />
            <span className="text-[14.5px] ink min-w-0">{s.name}</span>
            <span className="label ink-3 ml-auto pl-3 shrink-0">{s.status}</span>
          </li>
        ))}
      </ul>

      <div
        data-reveal
        className="hairline mt-12 pt-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2"
      >
        <p className="text-[15px] ink-2">
          ¿Usás otra herramienta?{" "}
          <a href="#contacto" className="accent-text underline decoration-dotted underline-offset-4">
            La integramos a medida
          </a>
        </p>
        <span className="label ink-3">Sin captura manual · Sin duplicados</span>
      </div>
    </div>
  </section>
);
