// Quasor CRM — replica interactiva con datos demo

const DEMO = {
  leads: [
    { name: "Diego Herrera",     email: "diego.h@gmail.com",      phone: "+54 223 555-0142", src: "Google Ads", score: 92, owner: "TR", date: "07/04/2026", stage: "Visitó la propiedad", prop: "Departamento en venta en La Perla", price: "US$ 95.000" },
    { name: "Ricardo Gómez",     email: "rgomez@outlook.com",     phone: "+54 223 555-0188", src: "Meta Ads",   score: 88, owner: "MG", date: "06/04/2026", stage: "Reservó",             prop: "Casa · Mar del Plata",           price: "US$ 50.000" },
    { name: "Santiago López",    email: "slopez@gmail.com",       phone: "+54 223 555-0211", src: "Meta Ads",   score: 84, owner: "TR", date: "07/04/2026", stage: "Reservó",             prop: "Casa en venta · Los Troncos",    price: "US$ 70.000" },
    { name: "Carla Benítez",     email: "c.benitez@gmail.com",    phone: "+54 223 555-0309", src: "Tokko",      score: 76, owner: "MG", date: "05/04/2026", stage: "Visita agendada",     prop: "Depto 2 amb · Centro",           price: "US$ 42.000" },
    { name: "Pablo Iriarte",     email: "piriarte@hotmail.com",   phone: "+54 223 555-0421", src: "Google Ads", score: 71, owner: "TR", date: "05/04/2026", stage: "Interesado",          prop: "Local · Mar del Plata",          price: "US$ 120.000" },
    { name: "Mariana Ávila",     email: "mavila@gmail.com",       phone: "+54 223 555-0533", src: "Meta Ads",   score: 68, owner: "MG", date: "04/04/2026", stage: "Interesado",          prop: "Depto pozo · Torres del Mar",    price: "US$ 88.000" },
    { name: "Lucas Romano",      email: "lromano@gmail.com",      phone: "+54 223 555-0644", src: "Referido",   score: 95, owner: "MG", date: "03/04/2026", stage: "Cierre en curso",     prop: "Casa · Los Troncos",             price: "US$ 180.000" },
  ],
  props: [
    { title: "Departamento en Terminal Nueva", type: "Departamento", amb: "1 amb", m2: "35 m²",  op: "Alquiler", owner: null, bg: "#1a1d22" },
    { title: "Local en Mar del Plata",         type: "Local",        amb: "0 amb", m2: "350 m²", op: "Alquiler", owner: null, bg: "#a8b8c0" },
    { title: "Departamento en Mar del Plata",  type: "Departamento", amb: "2 amb", m2: "85 m²",  op: "Venta",    owner: "TR", bg: "#5b7994" },
    { title: "Local en Mar del Plata",         type: "Local",        amb: "0 amb", m2: "280 m²", op: "Alquiler", owner: null, bg: "#2a2e35" },
    { title: "Casa · Mar del Plata",           type: "Casa",         amb: "4 amb", m2: "200 m²", op: "Venta",    owner: null, bg: "#6b5847" },
    { title: "Galpón · Mar del Plata",         type: "Galpón",       amb: "0 amb", m2: "250 m²", op: "Alquiler", owner: null, bg: "#3a3e44" },
  ],
  pipeline: [
    { stage: "Interesado",         color: "#ff7a59", count: 4, cards: [
      { who: "Pablo Iriarte", src: "Google Ads", prop: "Local · Mar del Plata",        date: "05/04/2026" },
      { who: "Mariana Ávila", src: "Meta Ads",   prop: "Depto pozo · Torres del Mar",  date: "04/04/2026" },
    ]},
    { stage: "Visita agendada",    color: "#3c6df0", count: 2, cards: [
      { who: "Carla Benítez",  src: "Tokko",     prop: "Depto 2 amb · Centro",         date: "05/04/2026" },
    ]},
    { stage: "Visitó la propiedad", color: "#9a56d0", count: 1, cards: [
      { who: "Diego Herrera",  src: "Google Ads",prop: "Departamento en venta · La Perla", date: "06/04/2026" },
    ]},
    { stage: "Reservó",            color: "#d6a51e", count: 2, cards: [
      { who: "Ricardo Gómez",  src: "Meta Ads",  prop: "Casa · Mar del Plata",         date: "06/04/2026" },
      { who: "Santiago López", src: "Meta Ads",  prop: "Casa · Los Troncos",           date: "07/04/2026" },
    ]},
    { stage: "Cierre en curso",    color: "#2fb27d", count: 1, cards: [
      { who: "Lucas Romano",   src: "Referido",  prop: "Casa · Los Troncos",           date: "03/04/2026" },
    ]},
  ],
  funnel: [
    { k: "Interesado",          v: 48 },
    { k: "Visita agendada",     v: 32 },
    { k: "Visitó la propiedad", v: 24 },
    { k: "Reservó",             v: 14 },
    { k: "Cierre en curso",     v: 8 },
    { k: "Venta concretada",    v: 6 },
    { k: "Perdido",             v: 11 },
  ],
  leadsByDay: [
    { d: "05/04", total: 12, qual: 4 },
    { d: "06/04", total: 18, qual: 7 },
    { d: "07/04", total: 14, qual: 5 },
    { d: "08/04", total: 22, qual: 9 },
    { d: "09/04", total: 19, qual: 8 },
    { d: "10/04", total: 28, qual: 12 },
    { d: "11/04", total: 24, qual: 11 },
    { d: "12/04", total: 31, qual: 14 },
    { d: "13/04", total: 27, qual: 13 },
    { d: "14/04", total: 34, qual: 17 },
    { d: "15/04", total: 29, qual: 15 },
    { d: "16/04", total: 38, qual: 20 },
    { d: "17/04", total: 33, qual: 18 },
    { d: "18/04", total: 42, qual: 24 },
  ],
};

const useCountUp = (target, duration = 1200, deps = []) => {
  const [v, setV] = React.useState(0);
  React.useEffect(() => {
    let raf, start;
    const step = (t) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(target * eased);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, deps);
  return v;
};

const fmt = (n, d = 0) => n.toLocaleString("es-AR", { minimumFractionDigits: d, maximumFractionDigits: d });

// Sidebar item
const NavItem = ({ icon, label, active, onClick }) => (
  <button onClick={onClick}
    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition ${active ? "bg-[color-mix(in_oklab,var(--accent)_14%,var(--bg))] accent font-medium" : "ink-2 hover:bg-surface-2"}`}>
    <span className="w-4 h-4 shrink-0">{icon}</span>
    <span>{label}</span>
  </button>
);

const Icon = {
  home: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="10" width="8" height="8"/><rect x="13" y="10" width="8" height="8"/><rect x="3" y="4" width="8" height="4"/><rect x="13" y="4" width="8" height="4"/></svg>,
  leads: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="7" r="2"/><path d="M15 15h6"/></svg>,
  props: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 10 12 3l9 7v10a2 2 0 0 1-2 2h-4v-6h-6v6H5a2 2 0 0 1-2-2V10Z"/></svg>,
  pipe: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="4" height="16"/><rect x="10" y="4" width="4" height="10"/><rect x="17" y="4" width="4" height="14"/></svg>,
  plug: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.2 16.2l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.2 7.7l2.8-2.8"/></svg>,
  refresh: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/></svg>,
  cal: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></svg>,
  users: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="3.5"/><path d="M5 20c0-3.5 3-6.5 7-6.5s7 3 7 6.5"/></svg>,
  target: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></svg>,
  trend: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 17 9 11l4 4 8-8"/><path d="M14 4h7v7"/></svg>,
  dollar: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2v20M17 6H9a3 3 0 0 0 0 6h6a3 3 0 0 1 0 6H6"/></svg>,
};

// KPI card
const KPI = ({ icon, value, label, delta, prefix = "", suffix = "", decimals = 0 }) => {
  const v = useCountUp(value, 1400, [value]);
  const positive = delta >= 0;
  return (
    <div className="bg-surface border border-line rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="w-9 h-9 rounded-lg grid place-items-center" style={{ background: "color-mix(in oklab, var(--accent) 12%, var(--bg))", color: "var(--accent)" }}>
          {icon}
        </div>
        <span className={`mono text-[11px] tabular-nums ${positive ? "text-[var(--pos)]" : "text-[var(--neg)]"}`}>
          {positive ? "↗" : "↘"} {Math.abs(delta).toFixed(1)}%
        </span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-semibold num ink">{prefix}{fmt(v, decimals)}{suffix}</span>
      </div>
      <div className="text-sm ink-2 mt-0.5">{label}</div>
      <div className="mono text-[11px] ink-3 mt-1">vs período anterior</div>
    </div>
  );
};

// Area chart — Leads por Período
const LeadsChart = ({ data, playKey }) => {
  const w = 560, h = 200, pad = { t: 20, r: 10, b: 30, l: 30 };
  const max = Math.max(...data.map(d => d.total));
  const xs = (i) => pad.l + (i / (data.length - 1)) * (w - pad.l - pad.r);
  const ys = (v) => h - pad.b - (v / max) * (h - pad.t - pad.b);

  const linePath = (key) => data.map((d, i) => (i === 0 ? "M" : "L") + xs(i).toFixed(1) + "," + ys(d[key]).toFixed(1)).join(" ");
  const areaPath = (key) => linePath(key) + ` L ${xs(data.length-1).toFixed(1)},${h - pad.b} L ${xs(0).toFixed(1)},${h - pad.b} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[200px]" key={playKey}>
      <defs>
        <linearGradient id="areaOrange" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.28" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="areaBlue" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#3c6df0" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#3c6df0" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
        <line key={i} x1={pad.l} x2={w - pad.r} y1={pad.t + p * (h - pad.t - pad.b)} y2={pad.t + p * (h - pad.t - pad.b)} stroke="var(--line)" strokeDasharray="2 3"/>
      ))}
      {[0, 0.5, 1].map((p, i) => (
        <text key={i} x={pad.l - 6} y={pad.t + 4 + p * (h - pad.t - pad.b)} fontSize="9" fill="var(--ink-3)" textAnchor="end" fontFamily="JetBrains Mono, monospace">{Math.round(max * (1 - p))}</text>
      ))}
      {data.map((d, i) => i % 2 === 0 && (
        <text key={i} x={xs(i)} y={h - 10} fontSize="9" fill="var(--ink-3)" textAnchor="middle" fontFamily="JetBrains Mono, monospace">{d.d}</text>
      ))}
      <path d={areaPath("total")} fill="url(#areaOrange)" style={{ animation: "drawFade .9s cubic-bezier(.2,.7,.2,1)" }} />
      <path d={linePath("total")} fill="none" stroke="var(--accent)" strokeWidth="1.8" style={{ strokeDasharray: 2000, strokeDashoffset: 2000, animation: "draw 1.4s cubic-bezier(.2,.7,.2,1) forwards" }} />
      <path d={areaPath("qual")} fill="url(#areaBlue)" style={{ animation: "drawFade 1.1s cubic-bezier(.2,.7,.2,1)" }} />
      <path d={linePath("qual")} fill="none" stroke="#3c6df0" strokeWidth="1.5" style={{ strokeDasharray: 2000, strokeDashoffset: 2000, animation: "draw 1.6s .2s cubic-bezier(.2,.7,.2,1) forwards" }} />
      {data.map((d, i) => (
        <circle key={"t" + i} cx={xs(i)} cy={ys(d.total)} r="2.5" fill="var(--accent)" style={{ opacity: 0, animation: `fadeIn .3s ${0.6 + i * 0.03}s forwards` }} />
      ))}
      <style>{`
        @keyframes draw { to { stroke-dashoffset: 0; } }
        @keyframes fadeIn { to { opacity: 1; } }
        @keyframes drawFade { from { opacity: 0; } }
      `}</style>
    </svg>
  );
};

// Horizontal bar chart — funnel
const FunnelBars = ({ data, playKey }) => {
  const max = Math.max(...data.map(d => d.v));
  return (
    <div className="space-y-2" key={playKey}>
      {data.map((d, i) => (
        <div key={d.k} className="grid grid-cols-[120px_1fr_28px] items-center gap-3">
          <span className="text-[11px] ink-2 text-right leading-tight">{d.k}</span>
          <div className="h-5 bg-surface-2 rounded-sm overflow-hidden">
            <div className="h-full rounded-sm" style={{
              width: (d.v / max * 100) + "%",
              background: "var(--ink)",
              animation: `grow .8s ${i * 0.06}s cubic-bezier(.2,.7,.2,1) both`,
              transformOrigin: "left",
            }} />
          </div>
          <span className="mono text-[11px] tabular-nums text-right">{d.v}</span>
        </div>
      ))}
      <style>{`@keyframes grow { from { transform: scaleX(0); } }`}</style>
    </div>
  );
};

// INICIO view
const ViewInicio = ({ playKey }) => (
  <div className="p-5 space-y-5">
    <div className="flex items-center justify-end gap-3 flex-wrap">
      <button className="w-8 h-8 rounded-md border border-line grid place-items-center ink-2 hover:bg-surface-2">{Icon.refresh}</button>
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-line text-sm ink-2">
        <span className="w-4 h-4">{Icon.cal}</span>
        <span className="mono text-xs">05 abr 2026 – 19 abr 2026</span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <span className="w-9 h-5 bg-accent rounded-full relative">
          <span className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-white"/>
        </span>
        <span className="ink-2">Comparar con</span>
        <div className="px-3 py-1.5 border border-line rounded-md text-sm">Período anterior ▾</div>
      </div>
    </div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <KPI icon={Icon.users}  value={147}  label="Total Leads"        delta={23.4} />
      <KPI icon={Icon.target} value={48}   label="Oportunidades Activas" delta={12.5} />
      <KPI icon={Icon.trend}  value={18.4} label="Tasa de Conversión" delta={2.1} suffix="%" decimals={1} />
      <KPI icon={Icon.dollar} value={42.8} label="Inversión Publicitaria" delta={-4.2} prefix="$" suffix="k" decimals={1} />
    </div>
    <div className="grid md:grid-cols-[1.4fr_1fr] gap-3">
      <div className="bg-surface border border-line rounded-xl p-4">
        <div className="flex items-baseline justify-between mb-1">
          <div>
            <div className="text-sm font-medium">Leads por Período</div>
            <div className="text-xs ink-3">Tendencia de captación de leads</div>
          </div>
        </div>
        <LeadsChart data={DEMO.leadsByDay} playKey={playKey} />
        <div className="flex items-center justify-center gap-4 text-[11px] ink-2 mt-1">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-accent"/> Total Leads</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#3c6df0]"/> Leads Calificados</span>
        </div>
      </div>
      <div className="bg-surface border border-line rounded-xl p-4">
        <div className="text-sm font-medium">Pipeline de Oportunidades</div>
        <div className="text-xs ink-3 mb-4">Distribución por etapa del embudo</div>
        <FunnelBars data={DEMO.funnel} playKey={playKey} />
      </div>
    </div>
  </div>
);

// LEADS view
const srcPill = (s) => {
  const map = {
    "Meta Ads":    "bg-[color-mix(in_oklab,#3c6df0_15%,var(--bg))] text-[#3c6df0]",
    "Google Ads":  "bg-[color-mix(in_oklab,#ff7a59_14%,var(--bg))] accent",
    "Tokko":       "bg-[color-mix(in_oklab,#d6a51e_15%,var(--bg))] text-[#b88a1b]",
    "Referido":    "bg-[color-mix(in_oklab,#2fb27d_15%,var(--bg))] text-[#2fb27d]",
  };
  return map[s] || "bg-surface-2 ink-2";
};

const ViewLeads = () => (
  <div className="p-5">
    <div className="flex items-center justify-end gap-3 mb-4">
      <button className="w-8 h-8 rounded-md border border-line grid place-items-center ink-2">{Icon.refresh}</button>
      <button className="px-3 py-1.5 rounded-md bg-accent text-white text-sm font-medium">+ Nuevo Lead</button>
    </div>
    <div className="grid md:grid-cols-[220px_1fr] gap-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Filtros</span>
          <span className="mono text-[11px] accent">× Limpiar</span>
        </div>
        {[
          { l: "Buscar",         v: "🔍 Buscar leads..." },
          { l: "Rango de fechas",v: "📅 04 abr 2026 – 18 abr 2026" },
          { l: "Responsable",    v: "Todos ▾" },
          { l: "Fuente",         v: "Todos ▾" },
        ].map(f => (
          <div key={f.l}>
            <div className="text-xs ink-2 mb-1">{f.l}</div>
            <div className="w-full px-3 py-2 border border-line rounded-md text-xs ink-3 bg-surface">{f.v}</div>
          </div>
        ))}
      </div>
      <div className="bg-surface border border-line rounded-xl overflow-hidden">
        <div className="grid grid-cols-[1.2fr_1.4fr_1fr_.8fr_.6fr_.7fr_.8fr] gap-3 px-4 py-2.5 text-[11px] ink-3 border-b border-line bg-surface-2">
          <span>Nombre Completo</span><span>Email</span><span>Teléfono</span><span>Fuente</span><span>Score</span><span>Asignado</span><span>Fecha</span>
        </div>
        {DEMO.leads.map((l, i) => (
          <div key={i}
            className="grid grid-cols-[1.2fr_1.4fr_1fr_.8fr_.6fr_.7fr_.8fr] gap-3 px-4 py-2.5 text-xs items-center border-b border-line last:border-b-0 hover:bg-surface-2 transition"
            style={{ animation: `rowIn .4s ${i * 50}ms both` }}>
            <span className="font-medium ink">{l.name}</span>
            <span className="ink-2 truncate">{l.email}</span>
            <span className="mono ink-2 text-[11px]">{l.phone}</span>
            <span className={`mono text-[10px] px-2 py-0.5 rounded justify-self-start ${srcPill(l.src)}`}>{l.src}</span>
            <div className="flex items-center gap-1.5">
              <div className="w-8 h-1 bg-surface-2 rounded-full overflow-hidden">
                <div className="h-full" style={{ width: l.score + "%", background: l.score > 85 ? "var(--accent)" : "var(--ink)" }}/>
              </div>
              <span className="mono tabular-nums">{l.score}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-[var(--ink)] text-[var(--bg)] grid place-items-center mono text-[9px]">{l.owner}</span>
            </div>
            <span className="mono text-[10px] ink-3">{l.date}</span>
          </div>
        ))}
        <div className="flex items-center justify-between px-4 py-2.5 text-[11px] ink-3">
          <span>1-{DEMO.leads.length} de {DEMO.leads.length} leads</span>
          <div className="flex items-center gap-2">
            <span>Por página 20 ▾</span><span>Página 1 de 1</span>
          </div>
        </div>
      </div>
    </div>
    <style>{`@keyframes rowIn { from { opacity: 0; transform: translateY(4px); } }`}</style>
  </div>
);

// PROPIEDADES view
const PropCard = ({ p, i }) => (
  <div className="bg-surface border border-line rounded-xl overflow-hidden" style={{ animation: `rowIn .5s ${i * 60}ms both` }}>
    <div className="h-[120px] relative overflow-hidden" style={{ background: p.bg }}>
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(255,255,255,.08), rgba(0,0,0,.25))" }}/>
      <div className="absolute top-3 left-3 mono text-[9px] uppercase tracking-wider text-white/70">// {p.type.toLowerCase()}</div>
      <div className="absolute bottom-3 right-3 mono text-[9px] text-white/50">img/{p.type.toLowerCase()}-0{(i % 6) + 1}.jpg</div>
    </div>
    <div className="p-3">
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-sm font-medium leading-tight flex-1">{p.title}</span>
        <span className="mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-[color-mix(in_oklab,#2fb27d_15%,var(--bg))] text-[#2fb27d] shrink-0">Disponible</span>
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] ink-2">
        <span>🏠 {p.type}</span><span>🚪 {p.amb}</span><span>📐 {p.m2}</span><span>{p.op}</span>
      </div>
      {p.owner && (
        <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-line">
          <span className="w-5 h-5 rounded-full bg-[var(--ink)] text-[var(--bg)] grid place-items-center mono text-[9px]">{p.owner}</span>
          <span className="text-[11px] ink-2">Tomás Ruiz</span>
        </div>
      )}
    </div>
  </div>
);

const ViewProps = () => (
  <div className="p-5">
    <div className="flex items-center justify-end gap-2 mb-4">
      <button className="w-8 h-8 rounded-md border border-line grid place-items-center ink-2">{Icon.refresh}</button>
      <button className="px-3 py-1.5 rounded-md border border-line text-sm">↻ Sincronizar con Tokko</button>
      <button className="px-3 py-1.5 rounded-md bg-accent text-white text-sm font-medium">+ Nueva Propiedad</button>
    </div>
    <div className="grid md:grid-cols-[220px_1fr] gap-4">
      <div className="space-y-3">
        <div className="text-sm font-medium">Filtros</div>
        {["Buscar", "Rango de fechas", "Estado", "Tipo de propiedad", "Tipo de operación", "Ambientes"].map((f, i) => (
          <div key={f}>
            <div className="text-xs ink-2 mb-1">{f}</div>
            <div className="w-full px-3 py-2 border border-line rounded-md text-xs ink-3 bg-surface">{i < 2 ? (i === 0 ? "🔍 Buscar..." : "📅 Seleccionar fechas") : "Todos ▾"}</div>
          </div>
        ))}
      </div>
      <div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {DEMO.props.map((p, i) => <PropCard key={i} p={p} i={i} />)}
        </div>
        <div className="flex items-center justify-between mt-4 text-[11px] ink-3">
          <span>1-6 de 236 propiedades</span>
          <div className="flex items-center gap-2"><span>Por página 10 ▾</span><span>Página 1 de 24</span></div>
        </div>
      </div>
    </div>
  </div>
);

// PIPELINE view — kanban
const ViewPipeline = () => (
  <div className="p-5">
    <div className="flex items-center justify-end gap-2 mb-4">
      <button className="w-8 h-8 rounded-md border border-line grid place-items-center ink-2">{Icon.refresh}</button>
      <button className="px-3 py-1.5 rounded-md bg-accent text-white text-sm font-medium">+ Nueva Oportunidad</button>
    </div>
    <div className="grid md:grid-cols-[220px_1fr] gap-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Filtros</span>
          <span className="mono text-[11px] accent">× Limpiar</span>
        </div>
        {["Buscar", "Rango de fechas", "Responsable", "Fuente"].map(f => (
          <div key={f}>
            <div className="text-xs ink-2 mb-1">{f}</div>
            <div className="w-full px-3 py-2 border border-line rounded-md text-xs ink-3 bg-surface">Todos ▾</div>
          </div>
        ))}
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {DEMO.pipeline.map((col, ci) => (
          <div key={col.stage} className="min-w-[200px] flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full" style={{ background: col.color }}/>
              <span className="text-xs font-medium">{col.stage}</span>
              <span className="mono text-[10px] ink-3 ml-auto">{col.count}</span>
            </div>
            <div className="space-y-2 min-h-[160px] p-2 bg-surface-2 rounded-lg border border-line">
              {col.cards.length === 0 ? (
                <div className="text-center py-8 mono text-[10px] ink-3">Sin oportunidades</div>
              ) : col.cards.map((c, i) => (
                <div key={i} className="p-2.5 rounded-md bg-surface border border-line text-xs"
                  style={{ animation: `rowIn .4s ${(ci * 100 + i * 80)}ms both` }}>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-medium truncate">{c.who}</span>
                    <span className={`mono text-[9px] px-1.5 py-0.5 rounded shrink-0 ${srcPill(c.src)}`}>{c.src}</span>
                  </div>
                  <div className="text-[11px] ink-2 truncate mt-1">🏠 {c.prop}</div>
                  <div className="mono text-[9px] ink-3 mt-1">📅 {c.date}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// INTEGRACIONES view
const MetaLogo = () => (
  <svg viewBox="0 0 40 40" className="w-8 h-8"><defs>
    <linearGradient id="mg1" x1="0" x2="1"><stop offset="0%" stopColor="#0064e1"/><stop offset="100%" stopColor="#0081fb"/></linearGradient>
    <linearGradient id="mg2" x1="0" x2="1"><stop offset="0%" stopColor="#0064e1"/><stop offset="100%" stopColor="#0082fb"/></linearGradient>
  </defs>
    <path d="M12 8c-3 0-5 3-5 8s2 8 5 8c2 0 3-1 5-3.5 2-2.5 3-4 4-4s2 1.5 4 4C27 22.5 29 24 31 24c3 0 5-3 5-8s-2-8-5-8c-2 0-3 1.5-5 4-2 2.5-3 4-4 4s-2-1.5-4-4C16 9 14.5 8 12 8Z" fill="url(#mg1)"/>
  </svg>
);
const GoogleLogo = () => (
  <svg viewBox="0 0 40 40" className="w-8 h-8">
    <circle cx="20" cy="20" r="14" fill="none" stroke="#4285F4" strokeWidth="4" strokeDasharray="22 30" transform="rotate(-30 20 20)"/>
    <path d="M 20 6 A 14 14 0 0 1 32 28" fill="none" stroke="#EA4335" strokeWidth="4"/>
    <path d="M 32 28 A 14 14 0 0 1 10 26" fill="none" stroke="#FBBC04" strokeWidth="4"/>
    <path d="M 10 26 A 14 14 0 0 1 20 6" fill="none" stroke="#34A853" strokeWidth="4"/>
  </svg>
);
const TokkoLogo = () => (
  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ff5a1f] to-[#ff7a59] text-white grid place-items-center font-bold text-sm">t</div>
);

const ViewIntegr = () => (
  <div className="p-5 max-w-3xl">
    <div className="flex items-center justify-end mb-4">
      <button className="w-8 h-8 rounded-md border border-line grid place-items-center ink-2">{Icon.refresh}</button>
    </div>
    <div className="mb-6">
      <div className="text-base font-semibold">Plataformas publicitarias</div>
      <div className="text-xs ink-3 mt-0.5">Conecta tus cuentas para rastrear el origen y gasto de tus leads.</div>
    </div>
    <div className="grid md:grid-cols-2 gap-3">
      <div className="bg-surface border border-line rounded-xl p-4">
        <div className="flex items-start gap-3">
          <MetaLogo/>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">Meta Ads</span>
              <span className="mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-[color-mix(in_oklab,#2fb27d_15%,var(--bg))] text-[#2fb27d]">Conectado</span>
              <span className="mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-[color-mix(in_oklab,#3c6df0_15%,var(--bg))] text-[#3c6df0]">OAuth</span>
            </div>
            <div className="text-xs ink-3 mt-0.5">Facebook e Instagram — campañas y gasto publicitario.</div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between px-3 py-2 border border-line rounded-md">
          <div>
            <div className="text-xs font-medium">Inmobiliaria Demo · Meta Ads</div>
            <div className="mono text-[10px] ink-3">ID: act.1234567890</div>
          </div>
          <button className="text-[#c43a2e] text-xs">Desconectar</button>
        </div>
        <button className="mt-2 w-full py-2 rounded-md border border-line text-xs">Conectar otra cuenta</button>
      </div>
      <div className="bg-surface border border-line rounded-xl p-4">
        <div className="flex items-start gap-3">
          <GoogleLogo/>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">Google Ads</span>
              <span className="mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-surface-2 ink-3">No conectado</span>
            </div>
            <div className="text-xs ink-3 mt-0.5">Búsqueda, Display y YouTube — campañas y gasto.</div>
          </div>
        </div>
        <button className="mt-6 w-full py-2.5 rounded-md bg-accent text-white text-sm font-medium">Conectar</button>
      </div>
    </div>
    <div className="mt-8 mb-4">
      <div className="text-base font-semibold">Integraciones de terceros</div>
      <div className="text-xs ink-3 mt-0.5">Conecta servicios externos para sincronizar datos.</div>
    </div>
    <div className="bg-surface border border-line rounded-xl p-4 md:max-w-[50%]">
      <div className="flex items-start gap-3">
        <TokkoLogo/>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">Tokko Broker</span>
            <span className="mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-[color-mix(in_oklab,#2fb27d_15%,var(--bg))] text-[#2fb27d]">Conectado</span>
          </div>
          <div className="text-xs ink-3 mt-0.5">Sincroniza tus propiedades desde Tokko Broker.</div>
        </div>
      </div>
      <div className="mt-4 px-3 py-2 border border-line rounded-md">
        <div className="mono text-[11px] ink-2">Última sincronización: 6 de abril, 22:23</div>
      </div>
      <div className="mt-2 flex gap-2">
        <button className="flex-1 py-2 text-[#c43a2e] text-xs">Desconectar</button>
        <button className="flex-1 py-2 rounded-md border border-line text-xs">Actualizar clave API</button>
      </div>
    </div>
  </div>
);

// Main CRM component
const QuasorCRM = () => {
  const [view, setView] = React.useState("inicio");
  const [playKey, setPlayKey] = React.useState(0);

  React.useEffect(() => { setPlayKey(k => k + 1); }, [view]);

  const titles = { inicio: "Inicio", leads: "Leads", props: "Propiedades", pipe: "Pipeline", plug: "Integraciones" };

  return (
    <div className="card overflow-hidden shadow-[0_40px_100px_-40px_rgba(0,0,0,0.25)]">
      {/* Window chrome */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-line bg-surface-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"/>
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"/>
          <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"/>
          <span className="mono text-[11px] ink-3 ml-3">app.quasor.io/{view}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--pos)] pulse-dot"/>
          <span className="mono text-[10px] ink-3 uppercase tracking-[0.14em]">live demo</span>
        </div>
      </div>

      <div className="grid grid-cols-[180px_1fr] min-h-[620px]">
        {/* Sidebar */}
        <aside className="border-r border-line bg-surface p-3">
          <div className="flex items-center gap-2 px-2 mb-0.5">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-[var(--accent)] to-[#ffb08a] grid place-items-center text-white font-bold text-[11px]">Q</div>
            <span className="serif text-xl leading-none">quasor</span>
          </div>
          <div className="px-2 mono text-[10px] ink-3 mb-4">Inmobiliaria Demo</div>
          <nav className="space-y-0.5">
            <NavItem icon={Icon.home}  label="Inicio"        active={view === "inicio"} onClick={() => setView("inicio")}/>
            <NavItem icon={Icon.leads} label="Leads"         active={view === "leads"}  onClick={() => setView("leads")}/>
            <NavItem icon={Icon.props} label="Propiedades"   active={view === "props"}  onClick={() => setView("props")}/>
            <NavItem icon={Icon.pipe}  label="Pipeline"      active={view === "pipe"}   onClick={() => setView("pipe")}/>
            <NavItem icon={Icon.plug}  label="Integraciones" active={view === "plug"}   onClick={() => setView("plug")}/>
          </nav>
        </aside>

        {/* Main */}
        <main className="bg-surface-2 overflow-hidden">
          <header className="flex items-center justify-between px-5 py-3 border-b border-line bg-surface">
            <div className="flex items-center gap-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ink-2"><rect x="3" y="4" width="7" height="16"/><rect x="14" y="4" width="7" height="16"/></svg>
              <span className="text-sm font-medium">{titles[view]}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-[color-mix(in_oklab,#9a56d0_15%,var(--bg))] text-[#9a56d0]">Admin</span>
              <span className="text-xs ink-2 hidden sm:inline">Carolina Méndez</span>
              <span className="w-7 h-7 rounded-full bg-accent text-white grid place-items-center mono text-[10px] font-bold">CM</span>
            </div>
          </header>
          <div key={playKey} className="animate-[fadeIn_.4s_ease-out]">
            {view === "inicio" && <ViewInicio playKey={playKey}/>}
            {view === "leads"  && <ViewLeads/>}
            {view === "props"  && <ViewProps/>}
            {view === "pipe"   && <ViewPipeline/>}
            {view === "plug"   && <ViewIntegr/>}
          </div>
        </main>
      </div>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } }`}</style>
    </div>
  );
};

window.Dashboard = QuasorCRM;
