// Typing terminal (for process steps)
const Terminal = ({ lines, playKey }) => {
  const [shown, setShown] = React.useState([]);
  const [cursorLine, setCursorLine] = React.useState(0);
  const [cursorChar, setCursorChar] = React.useState(0);

  React.useEffect(() => {
    setShown([]); setCursorLine(0); setCursorChar(0);
  }, [playKey]);

  React.useEffect(() => {
    if (cursorLine >= lines.length) return;
    const line = lines[cursorLine];
    const speed = line.p === "$" ? 32 : line.p === ">" ? 24 : 18;
    if (cursorChar < line.t.length) {
      const id = setTimeout(() => setCursorChar(cursorChar + 1), speed);
      return () => clearTimeout(id);
    }
    const wait = line.w || 240;
    const id = setTimeout(() => {
      setShown(s => [...s, line]);
      setCursorLine(cursorLine + 1);
      setCursorChar(0);
    }, wait);
    return () => clearTimeout(id);
  }, [cursorLine, cursorChar, playKey]);

  const typing = cursorLine < lines.length ? lines[cursorLine] : null;

  return (
    <div className="mono text-[12.5px] leading-[1.8] bg-[var(--bg-2)] border border-line rounded-lg p-4 h-[180px] overflow-hidden">
      {shown.map((l, i) => (
        <div key={i} className="flex gap-2">
          <span className="ink-3 w-3 shrink-0">{l.p}</span>
          <span className={l.p === "//" ? "accent" : l.p === "↗" ? "ink" : "ink-2"}>{l.t}</span>
        </div>
      ))}
      {typing && (
        <div className="flex gap-2">
          <span className="ink-3 w-3 shrink-0">{typing.p}</span>
          <span className="ink-2">
            {typing.t.slice(0, cursorChar)}
            <span className="blink accent">▌</span>
          </span>
        </div>
      )}
    </div>
  );
};

// Nav
const Nav = () => (
  <header className="sticky top-0 z-40 bg-[color-mix(in_oklab,var(--bg)_85%,transparent)] backdrop-blur border-b border-line">
    <div className="max-w-[1280px] mx-auto px-6 md:px-10 h-14 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <a href="#" className="serif text-xl tracking-tight">quasor<span className="accent">.</span></a>
        <nav className="hidden md:flex items-center gap-6 text-sm ink-2">
          <a href="#producto" className="hover:ink">Producto</a>
          <a href="#casos" className="hover:ink">Casos</a>
          <a href="#servicios" className="hover:ink">Servicios</a>
          <a href="#por-que" className="hover:ink">Por qué</a>
          <a href="#proceso" className="hover:ink">Proceso</a>
          <a href="#precios" className="hover:ink">Precios</a>
          <a href="#faq" className="hover:ink">FAQ</a>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 mono text-[11px] ink-3">
          <span className="relative flex">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--pos)]" />
            <span className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-[var(--pos)] animate-ping opacity-70" />
          </span>
          <span>Disponible · 2 slots abril</span>
        </div>
        <a href="#contacto" className="text-sm px-3.5 py-1.5 rounded-full bg-[var(--ink)] text-[var(--bg)] hover:opacity-90 transition">Agendar demo →</a>
      </div>
    </div>
  </header>
);

// Typing rotator — pausa al hover y respeta prefers-reduced-motion
const TypeRotator = ({ words, className }) => {
  const [idx, setIdx] = React.useState(0);
  const [len, setLen] = React.useState(0);
  const [deleting, setDeleting] = React.useState(false);
  const [paused, setPaused] = React.useState(false);
  const reduced = React.useMemo(() => typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);

  React.useEffect(() => {
    if (reduced) { setLen(words[idx].length); return; }
    if (paused) return;
    const w = words[idx];
    if (!deleting && len < w.length) {
      const t = setTimeout(() => setLen(len + 1), 70);
      return () => clearTimeout(t);
    }
    if (!deleting && len === w.length) {
      const t = setTimeout(() => setDeleting(true), 1600);
      return () => clearTimeout(t);
    }
    if (deleting && len > 0) {
      const t = setTimeout(() => setLen(len - 1), 35);
      return () => clearTimeout(t);
    }
    if (deleting && len === 0) {
      setDeleting(false);
      setIdx((idx + 1) % words.length);
    }
  }, [len, deleting, idx, paused, reduced]);

  return (
    <span
      className={className}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{ cursor: "default" }}
    >
      {words[idx].slice(0, len)}
      <span className="inline-block w-[0.08em] h-[0.85em] align-middle ml-1" style={{ background: "var(--accent)", animation: paused ? "none" : "blink 0.9s steps(1) infinite", opacity: paused ? 0.3 : 1 }} />
    </span>
  );
};

// Floating testimonial (Hyros-style, flotando sobre el hero)
const FloatingQuote = ({ className, style, quote, who, where, init, accent }) => (
  <div className={`card p-4 md:p-5 max-w-[280px] ${className}`} style={style}>
    <div className="flex items-center gap-3 mb-3">
      <div className="w-10 h-10 rounded-full grid place-items-center mono text-xs font-semibold shrink-0" style={{ background: accent ? "var(--accent)" : "var(--ink)", color: accent ? "#fff" : "var(--bg)" }}>
        {init}
      </div>
      <div className="min-w-0">
        <div className="text-[13px] font-medium truncate">{who}</div>
        <div className="mono text-[10px] ink-3 truncate">{where}</div>
      </div>
    </div>
    <div className="text-[13px] ink-2 leading-snug">"{quote}"</div>
  </div>
);

// Hero
const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 glow opacity-70 pointer-events-none" />
      <div className="absolute inset-0 grain pointer-events-none" />
      <div className="relative max-w-[1280px] mx-auto px-6 md:px-10 pt-12 md:pt-16 pb-8">
        <div className="flex items-center gap-2 mono text-[11px] ink-3 uppercase tracking-[0.18em] rise">
          <span>Quasor</span><span>·</span><span>Mar del Plata, AR</span><span>·</span><span>CRM para inmobiliarias</span>
        </div>

        <h1 className="serif mt-5 text-[48px] md:text-[72px] leading-[0.95] tracking-[-0.035em] max-w-[820px] rise" style={{ animationDelay: "80ms" }}>
          Tu empresa funciona con<br/>
          <em className="italic accent accent-glow">
            <TypeRotator words={["Excel y WhatsApp.", "planillas sin orden.", "chats personales.", "notas en papel.", "sistemas que no hablan."]} />
          </em><br/>
          Nosotros lo resolvemos.
        </h1>

        <div className="relative grid lg:grid-cols-[1fr_auto] gap-12 items-end">
          <div>
            <p className="mt-6 text-lg md:text-xl ink-2 max-w-2xl rise" style={{ animationDelay: "160ms" }}>
              Dashboards, CRMs y automatizaciones que reemplazan el caos de planillas.
              No mostramos mockups — abajo tenés el sistema real, con datos en vivo.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3 rise" style={{ animationDelay: "240ms" }}>
              <a href="#contacto" data-magnetic="0.3" className="text-[15px] px-5 py-3 rounded-full btn-accent hover:opacity-95 transition flex items-center gap-2 font-medium">
                Agendar una demo <span>→</span>
              </a>
              <a href="#producto" data-magnetic="0.25" className="text-[15px] px-5 py-3 rounded-full border border-line-2 hover:bg-surface-2 transition">
                Ver el sistema
              </a>
              <div className="flex items-center gap-2 ml-2 mono text-[12px] ink-3">
                <span>respondemos en 2h hábiles</span>
              </div>
            </div>
          </div>

          {/* Floating testimonials — solo desktop, al costado derecho debajo del H1 */}
          <div className="hidden lg:flex flex-col gap-4 pb-2">
            <div className="rise" style={{ animationDelay: "400ms", transform: "rotate(1.5deg)" }}>
              <FloatingQuote
                quote="Antes perdíamos consultas en los WhatsApps de cada vendedor. Ahora todo queda registrado y asignado."
                who="Cliente piloto"
                where="Inmobiliaria · Mar del Plata"
                init="●"
                accent={true}
              />
            </div>
            <div className="rise self-end" style={{ animationDelay: "560ms", transform: "rotate(-2deg) translateX(-24px)" }}>
              <div className="card p-4 md:p-5 max-w-[280px]">
                <div className="flex items-center gap-2 mb-3 mono text-[10px] uppercase tracking-wider ink-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--pos)]" /> cupo abril
                </div>
                <div className="serif text-2xl leading-tight tracking-tight mb-2">
                  2 <span className="ink-3">/</span> 3 slots
                </div>
                <div className="mono text-[11px] ink-3">disponibles para abrir proyecto este mes</div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero dashboard */}
        <div id="producto" className="mt-14 md:mt-20 rise" style={{ animationDelay: "320ms" }}>
          <div className="flex items-end justify-between mb-5 flex-wrap gap-3">
            <div>
              <div className="mono text-[11px] uppercase tracking-[0.18em] ink-3">01 — producto real</div>
              <div className="serif text-3xl md:text-4xl mt-2">Un dashboard que controla <span className="accent">$4.2M</span> en ads.</div>
            </div>
            <div className="mono text-[11px] ink-3 max-w-xs text-right hidden md:block">
              Navegá el CRM real.<br/>
              Datos demo · lo que ves corre hoy en producción.
            </div>
          </div>
          <Dashboard />

          <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-0 border border-line rounded-lg overflow-hidden bg-surface">
            {[
              ["$4.2M", "ad spend trackeado"],
              ["1.8k", "leads/mes en promedio"],
              ["99.98%", "uptime · 14 meses"],
              ["< 60s", "sync con Meta/Google"],
            ].map(([v, k], i) => (
              <div key={i} className="px-5 py-4 border-r last:border-r-0 border-line">
                <div className="serif text-3xl num">{v}</div>
                <div className="mono text-[11px] ink-3 mt-1">{k}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Integrations scroll — many logos
const INTEGRATIONS = [
  { n: "Facebook",      c: "#1877F2", g: "f" },
  { n: "Instagram",     c: "#E4405F", g: "IG" },
  { n: "WhatsApp",      c: "#25D366", g: "W" },
  { n: "Tokko Broker",  c: "#ff5a1f", g: "t" },
  { n: "Google",        c: "#4285F4", g: "G" },
  { n: "Meta",          c: "#0866ff", g: "M" },
  { n: "ZonaProp",      c: "#f05000", g: "Z" },
  { n: "Argenprop",     c: "#009a44", g: "A" },
  { n: "Gmail",         c: "#EA4335", g: "@" },
  { n: "Google Sheets", c: "#0F9D58", g: "▦" },
];

const IntegrationChip = ({ i }) => (
  <div className="shrink-0 flex items-center gap-2.5 px-4 py-2.5 rounded-full border border-line bg-surface hover:bg-surface-2 hover:border-[var(--accent)] transition group">
    <span className="w-6 h-6 rounded-md grid place-items-center text-white text-[10px] font-bold" style={{ background: i.c }}>{i.g}</span>
    <span className="text-sm font-medium whitespace-nowrap">{i.n}</span>
    <span className="mono text-[9px] ink-3 group-hover:accent transition">●</span>
  </div>
);

const Marquee = () => (
  <section className="border-y border-line bg-surface-2 py-12 overflow-hidden relative">
    <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[var(--bg-2)] to-transparent z-10 pointer-events-none"/>
    <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[var(--bg-2)] to-transparent z-10 pointer-events-none"/>
    <div className="max-w-[1280px] mx-auto px-6 md:px-10 mb-8">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="mono text-[11px] uppercase tracking-[0.18em] ink-3">integraciones</div>
          <h3 className="serif text-4xl md:text-5xl mt-2 tracking-tight">Conectamos con <em className="italic accent">todo lo que ya usás.</em></h3>
        </div>
        <div className="mono text-[11px] ink-3 max-w-xs">
          10 integraciones nativas · sync bidireccional · &lt; 60s<br/>
          ¿No está la tuya? la construimos.
        </div>
      </div>
    </div>

    <div className="overflow-hidden">
      <div className="flex gap-3 whitespace-nowrap" style={{ animation: "mqSlow 60s linear infinite" }}>
        {[...INTEGRATIONS, ...INTEGRATIONS].map((i, k) => <IntegrationChip key={"a"+k} i={i}/>)}
      </div>
    </div>
    <div className="overflow-hidden mt-3">
      <div className="flex gap-3 whitespace-nowrap" style={{ animation: "mqSlowR 70s linear infinite" }}>
        {[...INTEGRATIONS.slice().reverse(), ...INTEGRATIONS.slice().reverse()].map((i, k) => <IntegrationChip key={"b"+k} i={i}/>)}
      </div>
    </div>
    <div className="overflow-hidden mt-3">
      <div className="flex gap-3 whitespace-nowrap" style={{ animation: "mqSlow 80s linear infinite" }}>
        {[...INTEGRATIONS, ...INTEGRATIONS].map((i, k) => <IntegrationChip key={"c"+k} i={{ ...i, n: i.n }}/>)}
      </div>
    </div>

    <div className="max-w-[1280px] mx-auto px-6 md:px-10 mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
      <span className="mono text-[11px] uppercase tracking-[0.18em] ink-3">primer caso en producción</span>
      <div className="group flex items-center gap-3 pl-3 pr-4 py-2 rounded-full border border-line bg-surface">
        <span className="w-8 h-8 rounded-md grid place-items-center accent font-bold text-[11px]" style={{ background: "var(--surface-2)", border: "1px solid var(--line)" }}>●</span>
        <div className="leading-tight">
          <div className="text-sm font-medium">Cliente piloto</div>
          <div className="mono text-[10px] ink-3">Inmobiliaria · Mar del Plata</div>
        </div>
        <span className="mono text-[10px] ink-3">confidencial</span>
      </div>
    </div>

    <style>{`
      @keyframes mqSlow { to { transform: translateX(-50%); } }
      @keyframes mqSlowR { from { transform: translateX(-50%); } to { transform: translateX(0); } }
    `}</style>
  </section>
);

// Use cases grid (Hyros-style: "Choose your use case")
const UseCases = () => {
  const cases = [
    {
      tag: "Inmobiliarias",
      title: "Gestión completa de pipeline",
      desc: "Captura leads desde ZonaProp, Argenprop, Tokko y WhatsApp. Asigna por zona, mide conversión por vendedor.",
      track: ["leads", "visitas", "cierres", "conversión por vendedor", "fuente del lead"],
      preview: "inmobiliaria",
    },
    {
      tag: "Concesionarias",
      title: "Del aviso al patentamiento",
      desc: "Seguimiento de consultas, reservas, test drives y stock en tiempo real. Dashboards de venta por modelo.",
      track: ["stock", "test drives", "reservas", "ticket promedio", "ad spend vs ventas"],
      preview: "concesionaria",
    },
    {
      tag: "Agencias de marketing",
      title: "Reporting automático a clientes",
      desc: "Conecta Meta, Google, TikTok. Genera reportes white-label. Muestra ROI real por campaña, sin Excel.",
      track: ["ROAS", "CPL", "CPA", "spend por cliente", "reportes automáticos"],
      preview: "agencia",
    },
    {
      tag: "E-commerce",
      title: "Operación centralizada",
      desc: "Stock, ventas, logística y atención unificados. Integra con Tienda Nube, Mercado Libre, Shopify.",
      track: ["stock", "órdenes", "LTV", "carritos abandonados", "integraciones"],
      preview: "ecommerce",
    },
  ];

  // Mini previews: cada caso tiene su propio visual placeholder
  const MiniPreview = ({ kind }) => {
    if (kind === "inmobiliaria") {
      return (
        <div className="absolute inset-0 p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between mb-1">
            <div className="mono text-[9px] uppercase ink-3">pipeline · abril</div>
            <div className="mono text-[9px] accent">● live</div>
          </div>
          {[
            { n: "Consulta", c: 34, w: "22%" },
            { n: "Contactado", c: 22, w: "38%" },
            { n: "Visita", c: 12, w: "55%" },
            { n: "Oferta", c: 6, w: "78%" },
            { n: "Cerrado", c: 3, w: "100%" },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="mono text-[9px] ink-3 w-16 shrink-0">{s.n}</div>
              <div className="flex-1 h-4 rounded bg-surface-2 overflow-hidden relative">
                <div className="absolute inset-y-0 left-0 rounded" style={{ width: s.w, background: i >= 3 ? "var(--accent)" : "var(--ink-2)" }} />
              </div>
              <div className="mono text-[9px] tabular-nums w-6 text-right">{s.c}</div>
            </div>
          ))}
        </div>
      );
    }
    if (kind === "concesionaria") {
      return (
        <div className="absolute inset-0 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="mono text-[9px] uppercase ink-3">stock · 142 unidades</div>
            <div className="mono text-[9px] accent">▲ 12%</div>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {Array.from({length: 20}).map((_, i) => (
              <div key={i} className="aspect-[3/2] rounded" style={{
                background: i % 7 === 0 ? "var(--accent)" : i % 3 === 0 ? "var(--ink-2)" : "var(--line)",
                opacity: i % 5 === 0 ? 0.4 : 1,
              }} />
            ))}
          </div>
          <div className="mt-3 flex items-end gap-1 h-8">
            {[45,62,38,71,88,55,92].map((h, i) => (
              <div key={i} className="flex-1 rounded-t-sm" style={{ height: `${h}%`, background: "var(--accent)", opacity: 0.7 + i*0.04 }} />
            ))}
          </div>
        </div>
      );
    }
    if (kind === "agencia") {
      return (
        <div className="absolute inset-0 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="mono text-[9px] uppercase ink-3">ROAS por cliente</div>
            <div className="mono text-[9px] ink-3">7d</div>
          </div>
          {[
            { n: "Cliente A", v: "4.2x", w: "85%" },
            { n: "Cliente B", v: "3.1x", w: "62%" },
            { n: "Cliente C", v: "2.8x", w: "56%" },
            { n: "Cliente D", v: "5.7x", w: "100%" },
          ].map((c, i) => (
            <div key={i} className="flex items-center gap-2 py-1.5 border-t border-line first:border-t-0">
              <div className="mono text-[10px] w-16">{c.n}</div>
              <div className="flex-1 h-1 rounded bg-surface-2 overflow-hidden">
                <div className="h-full rounded" style={{ width: c.w, background: "var(--accent)" }} />
              </div>
              <div className="mono text-[10px] tabular-nums accent font-semibold">{c.v}</div>
            </div>
          ))}
        </div>
      );
    }
    return (
      <div className="absolute inset-0 p-4">
        <div className="mono text-[9px] uppercase ink-3 mb-2">ventas · hoy</div>
        <div className="serif text-4xl num">$847k</div>
        <div className="mono text-[10px] accent">▲ 23% vs ayer</div>
        <div className="mt-3 grid grid-cols-3 gap-1 h-10">
          {[40,68,55,82,71,94,62,78,88].map((h,i) => (
            <div key={i} className="rounded-t-sm" style={{ height: `${h}%`, background: i === 5 ? "var(--accent)" : "var(--ink-2)", opacity: i === 5 ? 1 : 0.3 }} />
          ))}
        </div>
        <div className="mt-2 flex justify-between mono text-[9px] ink-3">
          <span>32 órdenes</span><span>LTV $12.4k</span>
        </div>
      </div>
    );
  };

  return (
    <section id="casos" className="relative border-t border-line bg-surface">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-24 md:py-32">
        <div className="flex items-end justify-between gap-8 flex-wrap mb-14">
          <div>
            <div className="mono text-[11px] uppercase tracking-[0.18em] ink-3">02 — casos de uso</div>
            <h2 data-reveal-words className="serif text-5xl md:text-7xl leading-[0.98] mt-4 tracking-tight max-w-3xl">
              Para empresas que <em className="italic accent">venden todos los días.</em>
            </h2>
          </div>
          <p className="ink-2 max-w-sm">
            Un CRM pensado para inmobiliarias argentinas. Con todo lo que necesitás
            para operar: pipeline, portales, WhatsApp y reportes en un solo lugar.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {cases.map((c, i) => (
            <div key={i} className="card overflow-hidden hover:border-[var(--accent)] transition group cursor-pointer">
              {/* Preview area */}
              <div className="relative h-52 bg-surface-2 border-b border-line overflow-hidden">
                <MiniPreview kind={c.preview} />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)]/40 via-transparent to-transparent pointer-events-none" />
              </div>
              <div className="p-6 md:p-7">
                <div className="flex items-center justify-between mb-3">
                  <div className="mono text-[11px] uppercase tracking-[0.18em] accent">{c.tag}</div>
                  <div className="mono text-[10px] ink-3 group-hover:accent transition">ver caso →</div>
                </div>
                <h3 className="serif text-2xl md:text-3xl tracking-tight mb-2">{c.title}</h3>
                <p className="ink-2 text-sm mb-4">{c.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="mono text-[10px] ink-3 uppercase tracking-wider mr-1">track:</span>
                  {c.track.map(t => (
                    <span key={t} className="mono text-[10px] px-2 py-0.5 rounded-full bg-surface-2 border border-line">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Use case (caso real)
const UseCase = () => (
  <section className="relative max-w-[1280px] mx-auto px-6 md:px-10 py-24 md:py-32">
    <div className="grid md:grid-cols-[1fr_1.2fr] gap-12">
      <div>
        <div className="mono text-[11px] uppercase tracking-[0.18em] ink-3">03 — caso real</div>
        <h2 data-reveal-words className="serif text-5xl md:text-6xl leading-[1] mt-4 tracking-tight">
          Los leads no <em className="italic accent">se pierden.</em><br/>
          Se pierden de vista.
        </h2>
        <p className="mt-6 text-lg ink-2 max-w-md">
          Una inmobiliaria de Mar del Plata con 6 vendedores y cero visibilidad del pipeline.
          En 6 semanas pasó de "¿a quién le tocaba este cliente?" a saber la conversión exacta de cada uno.
        </p>
        <div className="mt-8 space-y-5">
          <div>
            <div className="mono text-[11px] uppercase tracking-[0.18em] ink-3 mb-1">El problema</div>
            <p className="ink-2">Los leads caían en chats personales de cada vendedor. Se perdían consultas, nadie sabía quién atendía a quién, no había forma de medir conversión real.</p>
          </div>
          <div>
            <div className="mono text-[11px] uppercase tracking-[0.18em] ink-3 mb-1">La solución</div>
            <p className="ink-2">Un CRM que captura cada consulta automáticamente desde portales, Meta y WhatsApp Business. La asigna al vendedor correcto según zona y disponibilidad. Le da al dueño visibilidad total del pipeline.</p>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute -inset-6 glow opacity-50 blur-2xl pointer-events-none" />
        <div className="relative card overflow-hidden">
          {/* Header barra */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-line bg-surface-2">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[var(--pos)]" />
              <div className="mono text-[11px] uppercase tracking-[0.18em] ink-3">resultados · 6 semanas</div>
            </div>
            <div className="mono text-[11px] ink-3">reporte #0142</div>
          </div>

          <div className="p-6 md:p-8">
            {/* Headline result */}
            <div className="mb-7">
              <div className="flex items-baseline gap-3">
                <span className="serif text-7xl md:text-8xl num leading-none">-62<span className="text-5xl accent">%</span></span>
                <span className="mono text-[11px] uppercase tracking-wider ink-3 pb-2">leads perdidos</span>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex-1 h-1.5 bg-surface-2 rounded-full overflow-hidden relative">
                  <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: "38%", background: "var(--accent)", boxShadow: "0 0 12px var(--accent)" }} />
                </div>
                <span className="mono text-[10px] ink-3 tabular-nums">de 100% → 38%</span>
              </div>
            </div>

            {/* 3 mini-stats con antes/después */}
            <div className="space-y-4">
              {[
                { k: "cierres mes/mes",           before: "12", after: "17", delta: "+43%", positive: true },
                { k: "tiempo de asignación",      before: "4h", after: "< 2min", delta: "-97%", positive: true },
                { k: "trazabilidad end-to-end",   before: "0%", after: "100%", delta: "+100%", positive: true },
              ].map((r, i) => (
                <div key={i} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 py-3 border-t border-line first:border-t-0">
                  <div className="mono text-[11px] uppercase tracking-wider ink-2">{r.k}</div>
                  <div className="flex items-center gap-2 mono text-xs">
                    <span className="ink-3 line-through tabular-nums">{r.before}</span>
                    <span className="ink-3">→</span>
                    <span className="tabular-nums font-semibold" style={{ color: "var(--ink)" }}>{r.after}</span>
                  </div>
                  <span className="mono text-[11px] tabular-nums accent font-semibold">{r.delta}</span>
                  <span className="accent text-sm">▲</span>
                </div>
              ))}
            </div>

            {/* Mini-chart placeholder: bar viz weekly */}
            <div className="mt-7 pt-6 border-t border-line">
              <div className="flex items-center justify-between mb-3">
                <div className="mono text-[11px] uppercase tracking-[0.18em] ink-3">leads atendidos / semana</div>
                <div className="mono text-[10px] ink-3">semanas 1–6</div>
              </div>
              <div className="flex items-end gap-1.5 h-20">
                {[32, 38, 45, 58, 71, 88].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full rounded-t-sm transition-all" style={{
                      height: `${h}%`,
                      background: i >= 4 ? "var(--accent)" : "var(--ink-3)",
                      opacity: i >= 4 ? 1 : 0.35,
                      boxShadow: i >= 4 ? "0 0 8px rgba(255,90,31,0.4)" : "none",
                    }}/>
                    <span className="mono text-[9px] ink-3">S{i+1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bullets fuera del cuadro */}
        <div className="mt-6 space-y-2.5">
          {[
            "Historial de cada cliente desde la consulta hasta el cierre",
            "Asignación automática por zona, tipo y disponibilidad",
            "Métricas de conversión por vendedor en tiempo real",
            "Agenda de visitas y seguimientos que no se pierden",
          ].map((t, i) => (
            <div key={i} className="flex gap-3 items-start">
              <span className="accent mt-1">✓</span>
              <span className="ink-2 text-sm">{t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// Services
const Services = () => (
  <section id="servicios" className="relative border-t border-line bg-surface-2">
    <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-24 md:py-32">
      <div className="flex items-end justify-between mb-14 gap-8 flex-wrap">
        <div>
          <div className="mono text-[11px] uppercase tracking-[0.18em] ink-3">04 — servicios</div>
          <h2 data-reveal-words className="serif text-5xl md:text-7xl leading-[0.98] mt-4 tracking-tight max-w-3xl">
            Enfocados. <em className="italic accent">Nada más.</em>
          </h2>
        </div>
        <p className="ink-2 max-w-sm">
          Cuatro pilares. Las hacemos todos los días desde hace años,
          en producción, para inmobiliarias que las usan.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-px bg-[var(--line)] border border-line">
        {SERVICES.map((s, i) => (
          <div key={s.k} className="bg-surface p-8 md:p-10 group">
            <div className="flex items-start justify-between">
              <div className="mono text-[11px] ink-3">{String(i+1).padStart(2,"0")} / {SERVICES.length.toString().padStart(2,"0")}</div>
              <div className="mono text-[11px] ink-3">{s.k}</div>
            </div>
            <h3 className="serif text-4xl md:text-5xl mt-6 leading-[1] tracking-tight">{s.name}</h3>
            <p className="mt-4 ink-2 max-w-sm">{s.body}</p>
            <ul className="mt-6 space-y-2">
              {s.bullets.map(b => (
                <li key={b} className="flex items-center gap-2 text-sm ink-2">
                  <span className="accent mono">→</span> {b}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// Why Quasor — comparativa transparente
const WhyQuasor = () => {
  const cols = [
    {
      k: "freelance",
      name: "Dev freelance",
      tone: "neutral",
      desc: "Barato, rápido de contratar",
      rows: [
        { v: "1 persona", good: false, hint: "Si se enferma o desaparece, tu proyecto también" },
        { v: "Sin procesos", good: false },
        { v: "Cotiza por hora", good: false, hint: "Incentivo a estirar horas" },
        { v: "Soporte variable", good: false },
        { v: "Código sin docs", good: false },
      ],
    },
    {
      k: "quasor",
      name: "Quasor",
      tone: "accent",
      desc: "Estudio pequeño, procesos reales",
      rows: [
        { v: "Equipo de 3+", good: true, hint: "Dev lead, diseño y producto" },
        { v: "Demo semanal + staging", good: true },
        { v: "Precio fijo por entregable", good: true },
        { v: "Soporte post-launch", good: true },
        { v: "Código documentado · vos sos dueño", good: true },
      ],
    },
    {
      k: "agencia",
      name: "Agencia tradicional",
      tone: "neutral",
      desc: "Grande, formal, lenta",
      rows: [
        { v: "Equipo rotativo", good: false, hint: "Empezás con seniors, terminás con juniors" },
        { v: "3 meses de discovery", good: false },
        { v: "Retainer mensual alto", good: false },
        { v: "Account manager de por medio", good: false },
        { v: "Código que no podés mantener", good: false },
      ],
    },
  ];
  return (
    <section id="por-que" className="relative border-t border-line">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-24 md:py-32">
        <div className="flex items-end justify-between gap-8 flex-wrap mb-14">
          <div>
            <div className="mono text-[11px] uppercase tracking-[0.18em] ink-3">05 — por qué Quasor</div>
            <h2 data-reveal-words className="serif text-5xl md:text-7xl leading-[0.98] mt-4 tracking-tight max-w-3xl">
              ¿Y por qué <em className="italic accent">nosotros?</em>
            </h2>
          </div>
          <p className="ink-2 max-w-sm">
            Te podés encontrar con tres caminos para llevar tu operación al siguiente nivel.
            Esta es la verdad de cada uno, sin vender humo.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-[var(--line)] border border-line rounded-xl overflow-hidden">
          {cols.map((c) => {
            const isUs = c.tone === "accent";
            return (
              <div key={c.k} className={`p-8 md:p-10 ${isUs ? "bg-[var(--ink)] text-[var(--bg)] relative" : "bg-surface"}`}>
                {isUs && (
                  <div className="absolute top-4 right-4 mono text-[10px] uppercase tracking-wider accent border border-[var(--accent)] px-2 py-0.5 rounded-full">
                    recomendado
                  </div>
                )}
                <div className={`mono text-[11px] uppercase tracking-[0.18em] ${isUs ? "opacity-60" : "ink-3"}`}>{c.k}</div>
                <h3 className="serif text-3xl md:text-4xl mt-3 tracking-tight leading-tight">{c.name}</h3>
                <p className={`mt-2 text-sm ${isUs ? "opacity-80" : "ink-2"}`}>{c.desc}</p>
                <div className={`hl-grad my-6 ${isUs ? "opacity-40" : ""}`} />
                <ul className="space-y-3.5">
                  {c.rows.map((r, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className={`mt-0.5 shrink-0 w-5 h-5 rounded-full grid place-items-center text-[11px] font-bold ${
                        r.good
                          ? "bg-[var(--accent)] text-white"
                          : isUs
                            ? "bg-white/10 text-white/60"
                            : "bg-surface-2 ink-3"
                      }`}>
                        {r.good ? "✓" : "×"}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm ${isUs ? "" : "ink"}`}>{r.v}</div>
                        {r.hint && (
                          <div className={`mono text-[10px] mt-0.5 ${isUs ? "opacity-50" : "ink-3"}`}>{r.hint}</div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <p className="mt-8 mono text-[11px] ink-3 text-center max-w-2xl mx-auto">
          No somos para todos. Si buscás la opción más barata o la agencia con 200 personas, hay mejores opciones afuera.
        </p>
      </div>
    </section>
  );
};

// Process
const Process = () => {
  const [active, setActive] = React.useState(0);
  return (
    <section id="proceso" className="relative border-t border-line">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-24 md:py-32">
        <div className="mono text-[11px] uppercase tracking-[0.18em] ink-3">06 — proceso</div>
        <h2 data-reveal-words className="serif text-5xl md:text-7xl leading-[0.98] mt-4 tracking-tight max-w-3xl">
          Simple, directo, <em className="italic">sin vueltas.</em>
        </h2>
        <p className="ink-2 mt-5 max-w-lg">Cuatro etapas. Cada una con un entregable concreto. Sin reuniones que podrían haber sido un email.</p>

        <div className="mt-14 grid md:grid-cols-[260px_1fr] gap-10">
          <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
            {PROCESS.map((p, i) => (
              <button
                key={p.n}
                onClick={() => setActive(i)}
                className={`text-left p-4 rounded-lg border transition shrink-0 md:w-full ${active === i ? "border-line-2 bg-surface-2" : "border-transparent hover:bg-surface-2"}`}
              >
                <div className="mono text-[11px] ink-3">{p.n} — {p.tag}</div>
                <div className="serif text-xl mt-1">{p.name}</div>
              </button>
            ))}
          </div>
          <div className="card p-8">
            <div className="flex items-baseline justify-between gap-4 mb-4">
              <div>
                <div className="mono text-[11px] ink-3 uppercase tracking-[0.18em]">{PROCESS[active].tag}</div>
                <h3 className="serif text-4xl md:text-5xl mt-2 tracking-tight">{PROCESS[active].name}</h3>
              </div>
              <div className="serif text-6xl ink-3 opacity-40">{PROCESS[active].n}</div>
            </div>
            <p className="ink-2 max-w-lg">{PROCESS[active].body}</p>
            <div className="mt-6">
              <Terminal lines={PROCESS[active].term} playKey={active} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Testimonials — 1 real (Zamboni) + resultados esperados transparentes
const Testimonials = () => {
  const hero = TESTIMONIALS[0];
  return (
    <section className="relative border-t border-line bg-surface-2">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-24 md:py-32">
        <div className="flex items-end justify-between gap-8 flex-wrap mb-14">
          <div>
            <div className="mono text-[11px] uppercase tracking-[0.18em] ink-3">07 — cliente real</div>
            <h2 data-reveal-words className="serif text-5xl md:text-7xl leading-[0.98] mt-4 tracking-tight max-w-3xl">
              Arrancamos con <em className="italic accent">un cliente.</em><br/>Bien.
            </h2>
          </div>
          <p className="ink-2 max-w-xs">
            Preferimos decir que tenemos 1 cliente feliz antes que inventar 10.
            Los resultados abajo son los que esperás según tu vertical.
          </p>
        </div>

        {/* Hero: testimonio real Zamboni */}
        <div className="grid md:grid-cols-[0.9fr_1.3fr] gap-0 border border-line rounded-2xl overflow-hidden bg-surface">
          <div className="relative p-8 md:p-10 bg-[var(--ink)] text-[var(--bg)] overflow-hidden">
            <div className="absolute inset-0 glow opacity-60 pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-2 mono text-[11px] uppercase tracking-[0.18em] opacity-80">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--pos)]" /> cliente piloto
              </div>
              <div className="serif num leading-[0.88] mt-3 accent accent-glow" style={{ fontSize: "clamp(72px, 12vw, 128px)" }}>{hero.metric.v}</div>
              <div className="mono text-sm opacity-80 mt-2">{hero.metric.k}</div>
              <div className="hl-grad my-7 opacity-30" />
              <div className="mono text-[11px] uppercase tracking-wider opacity-60">
                primer caso · Mar del Plata
              </div>
            </div>
          </div>
          <figure className="p-8 md:p-10 flex flex-col justify-between">
            <div>
              <div className="serif text-7xl accent leading-none opacity-30">"</div>
              <blockquote className="serif text-2xl md:text-3xl leading-[1.25] tracking-tight mt-2">
                {hero.quote}
              </blockquote>
            </div>
            <div className="mt-8 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full grid place-items-center mono text-xl font-semibold accent" style={{ background: "var(--surface-2)", border: "1px solid var(--line)" }}>{hero.init}</div>
                <div>
                  <div className="font-medium">{hero.who}</div>
                  <div className="mono text-[11px] ink-3">{hero.where}</div>
                </div>
              </div>
              <div className="mono text-[11px] ink-3">identidad reservada</div>
            </div>
          </figure>
        </div>

        {/* Resultados esperados por vertical — honestos */}
        <div className="mt-16">
          <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
            <div>
              <div className="mono text-[11px] uppercase tracking-[0.18em] ink-3">resultados esperados · por vertical</div>
              <h3 className="serif text-3xl md:text-4xl mt-2 tracking-tight">Lo que podés esperar si te sumás hoy.</h3>
            </div>
            <p className="mono text-[11px] ink-3 max-w-xs">
              Basado en datos reales del piloto + benchmarks de mercado.<br/>
              No son promesas: son el piso técnico del sistema.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {EXPECTED_RESULTS.map((r, i) => (
              <div key={i} className="card p-6 flex flex-col justify-between min-h-[200px]">
                <div>
                  <div className="mono text-[10px] uppercase tracking-wider accent mb-3">{r.vertical}</div>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="serif text-5xl num leading-none">{r.metric.v}</span>
                  </div>
                  <div className="mono text-[10px] uppercase tracking-wider ink-3 mb-3">{r.metric.k}</div>
                </div>
                <p className="ink-2 text-sm leading-snug">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Pricing
const Pricing = () => (
  <section id="precios" className="relative border-t border-line">
    <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-24 md:py-32">
      <div className="flex items-end justify-between gap-8 flex-wrap mb-14">
        <div>
          <div className="mono text-[11px] uppercase tracking-[0.18em] ink-3">08 — precios</div>
          <h2 data-reveal-words className="serif text-5xl md:text-7xl leading-[0.98] mt-4 tracking-tight">
            Precios <em className="italic">claros.</em> Sin sorpresas.
          </h2>
        </div>
        <p className="ink-2 max-w-sm">Servicio mensual. Sin permanencia, sin costos ocultos. El sistema crece con tu empresa — nuevas features cada mes.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {PRICING.map((p, i) => (
          <div key={p.name} className={`relative p-8 rounded-2xl border ${p.featured ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--bg)]" : "border-line bg-surface"}`}>
            {p.featured && (
              <div className="absolute -top-3 left-8 mono text-[10px] uppercase tracking-[0.18em] px-2 py-1 rounded-full bg-accent text-[var(--ink)]">Más elegido</div>
            )}
            <div className={`mono text-[11px] uppercase tracking-[0.18em] ${p.featured ? "opacity-70" : "ink-3"}`}>{p.tag}</div>
            <h3 className={`serif text-4xl mt-3 ${p.featured ? "" : "ink"}`}>{p.name}</h3>
            <div className={`flex items-baseline gap-2 mt-5`}>
              <span className="serif text-5xl num">{p.price}</span>
              <span className={`mono text-[11px] ${p.featured ? "opacity-60" : "ink-3"}`}>{p.period || "/mes"}</span>
            </div>
            <p className={`mt-3 text-sm ${p.featured ? "opacity-80" : "ink-2"}`}>{p.body}</p>
            <div className={`my-6 h-px ${p.featured ? "bg-white/15" : "bg-[var(--line)]"}`} />
            <ul className="space-y-2.5 text-sm">
              {p.items.map(x => (
                <li key={x} className="flex gap-2.5">
                  <span className={p.featured ? "accent" : "accent"}>→</span>
                  <span className={p.featured ? "opacity-90" : "ink-2"}>{x}</span>
                </li>
              ))}
            </ul>
            <a href="#contacto" className={`mt-8 inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm transition ${p.featured ? "bg-accent text-[var(--ink)] hover:opacity-90" : "border border-line-2 hover:bg-surface-2"}`}>
              {p.cta} →
            </a>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// FAQ
const FaqItem = ({ item, i }) => {
  const [open, setOpen] = React.useState(i === 0);
  return (
    <div className="border-t border-line">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between gap-6 py-6 text-left">
        <span className="serif text-2xl md:text-3xl tracking-tight">{item.q}</span>
        <span className={`mono text-2xl ink-3 transition-transform ${open ? "rotate-45" : ""}`}>+</span>
      </button>
      <div className={`grid transition-all duration-500 ${open ? "grid-rows-[1fr] pb-7" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <p className="ink-2 max-w-2xl">{item.a}</p>
        </div>
      </div>
    </div>
  );
};

const Faq = () => (
  <section id="faq" className="relative border-t border-line bg-surface-2">
    <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-24 md:py-32">
      <div className="grid md:grid-cols-[1fr_1.4fr] gap-16">
        <div>
          <div className="mono text-[11px] uppercase tracking-[0.18em] ink-3">09 — FAQ</div>
          <h2 data-reveal-words className="serif text-5xl md:text-6xl leading-[0.98] mt-4 tracking-tight">
            Preguntas <em className="italic accent">frecuentes.</em>
          </h2>
          <p className="ink-2 mt-5">¿No está la tuya? <a href="#contacto" className="underline decoration-dotted underline-offset-4">Escribinos</a> y respondemos en 2h hábiles.</p>
        </div>
        <div>
          {FAQ.map((f, i) => <FaqItem key={i} item={f} i={i} />)}
          <div className="border-t border-line" />
        </div>
      </div>
    </div>
  </section>
);

// Contact
const Contact = () => (
  <section id="contacto" className="relative border-t border-line overflow-hidden">
    <div className="absolute inset-0 glow opacity-60 pointer-events-none" />
    <div className="relative max-w-[1280px] mx-auto px-6 md:px-10 py-28 md:py-40">
      <div className="mono text-[11px] uppercase tracking-[0.18em] ink-3">10 — contacto</div>
      <h2 data-reveal-words className="serif text-6xl md:text-[120px] leading-[0.92] tracking-[-0.02em] mt-6 max-w-5xl">
        ¿Tu operación depende de <em className="italic accent">buena voluntad?</em> Hablemos.
      </h2>
      <p className="ink-2 mt-8 text-lg max-w-xl">
        15 minutos por WhatsApp o videollamada. Te contamos qué haríamos, cuánto tarda y cuánto cuesta.
        Si no te cierra, no pasa nada.
      </p>

      <div className="mt-12 flex flex-wrap gap-4 items-center">
        <a href="https://wa.me/5492236892809" data-magnetic="0.3" className="inline-flex items-center gap-3 px-6 py-4 rounded-full bg-accent text-[var(--ink)] text-[16px] hover:opacity-90 transition">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-1 1.1-.2.2-.4.2-.7.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.4.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.3 5.2 4.6.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3zM12 2C6.5 2 2 6.5 2 12c0 1.9.5 3.7 1.5 5.3L2 22l4.8-1.3c1.5.8 3.3 1.3 5.2 1.3 5.5 0 10-4.5 10-10S17.5 2 12 2z"/></svg>
          +54 9 223 689 2809
        </a>
        <a href="mailto:ventas@quasor.com" data-magnetic="0.25" className="inline-flex items-center gap-3 px-6 py-4 rounded-full border border-line-2 text-[16px] hover:bg-surface-2 transition">
          ✉ ventas@quasor.com
        </a>
      </div>

      <div className="mt-16 grid md:grid-cols-3 gap-6 border-t border-line pt-10">
        <div>
          <div className="mono text-[11px] uppercase tracking-[0.18em] ink-3">respuesta</div>
          <div className="serif text-3xl mt-2">&lt; 2h</div>
          <div className="text-sm ink-2">hábiles · 09–19 ART</div>
        </div>
        <div>
          <div className="mono text-[11px] uppercase tracking-[0.18em] ink-3">ubicación</div>
          <div className="serif text-3xl mt-2">Mar del Plata</div>
          <div className="text-sm ink-2">trabajamos en toda Argentina</div>
        </div>
        <div>
          <div className="mono text-[11px] uppercase tracking-[0.18em] ink-3">disponibilidad</div>
          <div className="serif text-3xl mt-2">2 slots · abril</div>
          <div className="text-sm ink-2">después: lista de espera</div>
        </div>
      </div>
    </div>
  </section>
);

// Footer
const Footer = () => (
  <footer className="border-t border-line">
    <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-14 md:py-16">
      <div className="grid md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-10 md:gap-16">
        <div>
          <div className="serif text-5xl">quasor<span className="accent">.</span></div>
          <p className="ink-2 text-sm mt-4 max-w-xs">
            CRM para inmobiliarias argentinas. Desde Mar del Plata, para todo el país.
          </p>
          <div className="mono text-[11px] ink-3 mt-5">
            <div>ventas@quasor.com</div>
            <div className="mt-1">+54 9 223 689 2809</div>
          </div>
        </div>

        <div>
          <div className="mono text-[11px] uppercase tracking-[0.18em] ink-3 mb-4">Producto</div>
          <div className="flex flex-col gap-2.5 text-sm ink-2">
            <a href="#producto" className="hover:accent transition">Sistema</a>
            <a href="#casos" className="hover:accent transition">Casos de uso</a>
            <a href="#servicios" className="hover:accent transition">Servicios</a>
            <a href="#precios" className="hover:accent transition">Precios</a>
            <a href="#faq" className="hover:accent transition">FAQ</a>
          </div>
        </div>

        <div>
          <div className="mono text-[11px] uppercase tracking-[0.18em] ink-3 mb-4">Empresa</div>
          <div className="flex flex-col gap-2.5 text-sm ink-2">
            <a href="#por-que" className="hover:accent transition">Por qué Quasor</a>
            <a href="#proceso" className="hover:accent transition">Proceso</a>
            <a href="#contacto" className="hover:accent transition">Contacto</a>
            <a href="legal/privacidad.html" className="hover:accent transition">Privacidad</a>
            <a href="legal/terminos.html" className="hover:accent transition">Términos</a>
          </div>
        </div>

        <div>
          <div className="mono text-[11px] uppercase tracking-[0.18em] ink-3 mb-4">Redes</div>
          <div className="flex flex-col gap-2.5 text-sm ink-2">
            <a href="https://www.instagram.com/quasortech/" target="_blank" rel="noopener" className="hover:accent transition">Instagram ↗</a>
            <a href="https://wa.me/5492236892809" target="_blank" rel="noopener" className="hover:accent transition">WhatsApp ↗</a>
            <a href="mailto:ventas@quasor.com" className="hover:accent transition">Email ↗</a>
          </div>
        </div>
      </div>

      <div className="hl-grad my-10" />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="mono text-[11px] ink-3">© 2026 Quasor · CRM para inmobiliarias · mar del plata, ar</div>
        <div className="flex items-center gap-4 mono text-[11px] ink-3">
          <a href="legal/privacidad.html" className="hover:accent transition">Política de Privacidad</a>
          <span>·</span>
          <a href="legal/terminos.html" className="hover:accent transition">Términos y Condiciones</a>
        </div>
      </div>
    </div>
  </footer>
);

Object.assign(window, { Nav, Hero, Marquee, UseCases, UseCase, Services, WhyQuasor, Process, Testimonials, Pricing, Faq, Contact, Footer });
