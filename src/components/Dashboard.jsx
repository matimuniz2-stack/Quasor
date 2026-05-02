import { useState, useEffect } from 'react';

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
    { title: "Depto · Terminal Nueva", type: "Departamento", amb: "1 amb", m2: "35 m²",  op: "Alquiler", price: "US$ 480/mes",     zone: "Centro",       owner: null, bg: "linear-gradient(135deg, #1a1d22, #2a2e35)" },
    { title: "Local · Av. Independencia", type: "Local",     amb: "0 amb", m2: "350 m²", op: "Alquiler", price: "US$ 2.200/mes",   zone: "Microcentro",  owner: null, bg: "linear-gradient(135deg, #a8b8c0, #6b8290)" },
    { title: "Depto · Playa Grande",   type: "Departamento", amb: "2 amb", m2: "85 m²",  op: "Venta",    price: "US$ 95.000",      zone: "Playa Grande", owner: "TR", bg: "linear-gradient(135deg, #5b7994, #3d5a72)" },
    { title: "Local · Güemes",         type: "Local",        amb: "0 amb", m2: "280 m²", op: "Alquiler", price: "US$ 1.800/mes",   zone: "Güemes",       owner: null, bg: "linear-gradient(135deg, #2a2e35, #1a1d22)" },
    { title: "Casa · Los Troncos",     type: "Casa",         amb: "4 amb", m2: "200 m²", op: "Venta",    price: "US$ 180.000",     zone: "Los Troncos",  owner: null, bg: "linear-gradient(135deg, #6b5847, #4a3d31)" },
    { title: "Galpón · Puerto",        type: "Galpón",       amb: "0 amb", m2: "250 m²", op: "Alquiler", price: "US$ 1.400/mes",   zone: "Puerto",       owner: null, bg: "linear-gradient(135deg, #3a3e44, #1f2226)" },
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
  const [v, setV] = useState(0);
  useEffect(() => {
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

const NavItem = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    title={label}
    aria-label={label}
    className={`w-full flex items-center gap-2.5 justify-center @[680px]/dash:justify-start px-2 @[680px]/dash:px-3 py-2 rounded-md text-sm transition ${active ? "bg-[color-mix(in_oklab,var(--accent)_14%,var(--bg))] accent font-medium" : "ink-2 hover:bg-surface-2"}`}
  >
    <span className="w-4 h-4 shrink-0">{icon}</span>
    <span className="hidden @[680px]/dash:inline">{label}</span>
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

const KPI = ({ icon, value, label, delta, prefix = "", suffix = "", decimals = 0 }) => {
  const v = useCountUp(value, 1400, [value]);
  const positive = delta >= 0;
  return (
    <div className="bg-surface border border-line rounded-xl p-3 @[680px]/dash:p-4 hover:border-[var(--accent)] transition-colors">
      <div className="flex items-center justify-between mb-2 @[680px]/dash:mb-3">
        <div className="w-7 h-7 @[680px]/dash:w-9 @[680px]/dash:h-9 rounded-lg grid place-items-center" style={{ background: "color-mix(in oklab, var(--accent) 12%, var(--bg))", color: "var(--accent)" }}>
          {icon}
        </div>
        <span className={`mono text-[10px] @[680px]/dash:text-[11px] tabular-nums ${positive ? "text-[var(--pos)]" : "text-[var(--neg)]"}`}>
          {positive ? "↗" : "↘"} {Math.abs(delta).toFixed(1)}%
        </span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl @[680px]/dash:text-3xl font-semibold num ink">{prefix}{fmt(v, decimals)}{suffix}</span>
      </div>
      <div className="text-xs @[680px]/dash:text-sm ink-2 mt-0.5 leading-tight">{label}</div>
      <div className="mono text-[11px] ink-3 mt-1">vs período anterior</div>
    </div>
  );
};

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

const ViewInicio = ({ playKey }) => (
  <div className="p-5 space-y-4">
    <div className="flex items-center justify-between gap-2 flex-wrap">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-line text-xs ink-2 mono">
        <span className="w-3.5 h-3.5">{Icon.cal}</span>
        <span>05 abr – 19 abr 2026</span>
      </div>
      <div className="flex items-center gap-2 text-xs">
        <span className="hidden @[600px]/dash:flex items-center gap-1.5 ink-2">
          <span className="w-9 h-5 bg-accent rounded-full relative">
            <span className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-white"/>
          </span>
          <span>Comparar</span>
        </span>
        <button aria-label="Refrescar datos" title="Refrescar" className="w-8 h-8 rounded-md border border-line grid place-items-center ink-2 hover:bg-surface-2">{Icon.refresh}</button>
      </div>
    </div>
    <div className="grid grid-cols-2 @[680px]/dash:grid-cols-4 gap-3">
      <KPI icon={Icon.users}  value={147}  label="Total Leads"        delta={23.4} />
      <KPI icon={Icon.target} value={48}   label="Oportunidades"      delta={12.5} />
      <KPI icon={Icon.trend}  value={18.4} label="Tasa Conversión"    delta={2.1} suffix="%" decimals={1} />
      <KPI icon={Icon.dollar} value={42.8} label="Inversión Ads"      delta={-4.2} prefix="$" suffix="k" decimals={1} />
    </div>
    <div className="grid @[680px]/dash:grid-cols-[1.4fr_1fr] gap-3">
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

const srcPill = (s) => {
  const map = {
    "Meta Ads":    "bg-[color-mix(in_oklab,#3c6df0_15%,var(--bg))] text-[#3c6df0]",
    "Google Ads":  "bg-[color-mix(in_oklab,#ff7a59_14%,var(--bg))] accent",
    "Tokko":       "bg-[color-mix(in_oklab,#d6a51e_15%,var(--bg))] text-[#b88a1b]",
    "Referido":    "bg-[color-mix(in_oklab,#2fb27d_15%,var(--bg))] text-[#2fb27d]",
  };
  return map[s] || "bg-surface-2 ink-2";
};

// Stage → color (line + pill background hint)
const stageColor = (s) => {
  if (s.includes("Cierre") || s.includes("Cerrado") || s.includes("✓")) return "#2fb27d";
  if (s.includes("Reservó") || s.includes("Negociación")) return "#d6a51e";
  if (s.includes("Visit")) return "#9a56d0";
  if (s.includes("Cotiz") || s.includes("Test")) return "#3c6df0";
  if (s.includes("Interesado") || s.includes("Contactado")) return "#ff7a59";
  return "#9a9689";
};

// Avatar from name initials, color-tinted by hash
const avatarFromName = (name) => {
  const parts = name.split(" ").filter(Boolean);
  const initials = (parts[0]?.[0] || "?") + (parts[1]?.[0] || "");
  const palette = ["#3c6df0", "#9a56d0", "#2fb27d", "#d6a51e", "#ff7a59", "#e4405f"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) | 0;
  const color = palette[Math.abs(hash) % palette.length];
  return { initials: initials.toUpperCase(), color };
};

const ViewLeads = () => (
  <div className="p-5">
    {/* Top bar: stats + actions */}
    <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
      <div className="flex items-center gap-2 text-xs ink-3">
        <span className="mono">{DEMO.leads.length} leads activos</span>
        <span className="w-1 h-1 rounded-full bg-[var(--ink-3)]" />
        <span className="mono">7 hoy</span>
      </div>
      <div className="flex items-center gap-2">
        <button aria-label="Refrescar datos" title="Refrescar" className="w-8 h-8 rounded-md border border-line grid place-items-center ink-2 hover:bg-surface-2">{Icon.refresh}</button>
        <button className="px-3 py-1.5 rounded-md bg-accent text-white text-xs font-medium">+ Nuevo Lead</button>
      </div>
    </div>

    {/* Compact filter chips */}
    <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
      <div className="flex items-center gap-1.5 px-3 py-1.5 border border-line rounded-full text-xs ink-3 bg-surface shrink-0">
        🔍 <span>Buscar leads...</span>
      </div>
      {["Etapa: Todas", "Fuente: Todas", "Score: Todos", "Responsable: Todos"].map(f => (
        <button key={f} className="px-3 py-1.5 border border-line rounded-full text-xs ink-2 hover:bg-surface-2 shrink-0 mono">
          {f} <span className="ink-3 ml-1">▾</span>
        </button>
      ))}
    </div>

    {/* Table */}
    <div className="bg-surface border border-line rounded-xl overflow-hidden">
      <div className="grid grid-cols-[1.6fr_1.1fr_1fr_.8fr_.5fr_.6fr] gap-3 px-4 py-2.5 mono text-[10px] uppercase tracking-wider ink-3 border-b border-line bg-surface-2">
        <span>Lead</span><span>Etapa</span><span>Interés</span><span>Fuente</span><span>Score</span><span>Asignado</span>
      </div>
      {DEMO.leads.map((l, i) => {
        const av = avatarFromName(l.name);
        const stColor = stageColor(l.stage);
        return (
          <div
            key={i}
            className="group grid grid-cols-[1.6fr_1.1fr_1fr_.8fr_.5fr_.6fr] gap-3 px-4 py-3 text-xs items-center border-b border-line last:border-b-0 hover:bg-surface-2 transition cursor-pointer relative"
            style={{ animation: `rowIn .4s ${i * 50}ms both` }}
          >
            {/* Stage indicator strip on hover */}
            <span className="absolute left-0 top-0 bottom-0 w-[3px] opacity-0 group-hover:opacity-100 transition" style={{ background: stColor }} />

            {/* Lead: avatar + name + email + when */}
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className="w-8 h-8 rounded-full grid place-items-center mono text-[10px] font-semibold text-white shrink-0"
                style={{ background: av.color }}
              >
                {av.initials}
              </span>
              <div className="min-w-0">
                <div className="font-medium ink truncate">{l.name}</div>
                <div className="mono text-[10px] ink-3 truncate">{l.email}</div>
              </div>
            </div>

            {/* Stage pill */}
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: stColor }} />
              <span className="text-[11px] truncate" style={{ color: stColor }}>{l.stage}</span>
            </div>

            {/* Interest (property) */}
            <span className="ink-2 truncate text-[11px]">{l.prop}</span>

            {/* Source pill */}
            <span className={`mono text-[10px] px-2 py-0.5 rounded justify-self-start ${srcPill(l.src)}`}>{l.src}</span>

            {/* Score */}
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-1 bg-surface-2 rounded-full overflow-hidden">
                <div className="h-full transition-all" style={{ width: l.score + "%", background: l.score > 85 ? "var(--accent)" : "var(--ink-2)" }}/>
              </div>
              <span className="mono tabular-nums text-[11px]">{l.score}</span>
            </div>

            {/* Owner avatar */}
            <div className="flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-full bg-[var(--ink)] text-[var(--bg)] grid place-items-center mono text-[9px] font-semibold">{l.owner}</span>
            </div>
          </div>
        );
      })}
      <div className="flex items-center justify-between px-4 py-2.5 mono text-[10px] ink-3">
        <span>1-{DEMO.leads.length} de {DEMO.leads.length} · página 1 de 1</span>
        <span>Por página 20 ▾</span>
      </div>
    </div>
    <style>{`@keyframes rowIn { from { opacity: 0; transform: translateY(4px); } }`}</style>
  </div>
);

const PropCard = ({ p, i }) => (
  <div
    className="group bg-surface border border-line rounded-xl overflow-hidden hover:border-[var(--accent)] hover:-translate-y-0.5 transition-[transform,border-color] duration-300"
    style={{ animation: `rowIn .5s ${i * 60}ms both` }}
  >
    <div className="h-[180px] relative overflow-hidden" style={{ background: p.bg }}>
      {/* gradient overlay for legibility */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%)" }}/>
      {/* big editorial type label */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
        <div className="mono text-[9px] uppercase tracking-[0.18em] text-white/85 px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">{p.op}</div>
        <div className="mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#2fb27d]/30 text-white border border-[#2fb27d]/40 backdrop-blur-sm">Disponible</div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-3 flex items-end justify-between">
        <div>
          <div className="serif text-3xl text-white leading-none tracking-tight" style={{ fontStyle: "italic", textShadow: "0 2px 14px rgba(0,0,0,0.4)" }}>
            {p.type}
          </div>
          <div className="mono text-[10px] text-white/75 uppercase tracking-wider mt-1.5">{p.zone}</div>
        </div>
        <div className="mono text-[11px] text-white font-semibold tabular-nums text-right" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>
          {p.price}
        </div>
      </div>
    </div>
    <div className="px-4 py-3">
      <div className="text-sm font-medium leading-tight mb-2 truncate">{p.title}</div>
      <div className="flex items-center justify-between text-[11px] ink-2">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          <span>{p.amb}</span>
          <span className="ink-3">·</span>
          <span>{p.m2}</span>
        </div>
        {p.owner ? (
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-5 h-5 rounded-full bg-[var(--ink)] text-[var(--bg)] grid place-items-center mono text-[9px]">{p.owner}</span>
            <span className="ink-3 text-[10px]">asignado</span>
          </div>
        ) : (
          <span className="mono text-[10px] ink-3">sin asignar</span>
        )}
      </div>
    </div>
  </div>
);

const ViewProps = () => (
  <div className="p-5">
    <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
      <div className="flex items-center gap-2 text-xs ink-3">
        <span className="mono">236 propiedades</span>
        <span className="w-1 h-1 rounded-full bg-[var(--ink-3)]" />
        <span className="mono">última sync: hace 2h</span>
      </div>
      <div className="flex items-center gap-2">
        <button aria-label="Refrescar datos" title="Refrescar" className="w-8 h-8 rounded-md border border-line grid place-items-center ink-2 hover:bg-surface-2">{Icon.refresh}</button>
        <button className="px-3 py-1.5 rounded-md border border-line text-xs hover:bg-surface-2">↻ Tokko</button>
        <button className="px-3 py-1.5 rounded-md bg-accent text-white text-xs font-medium">+ Nueva</button>
      </div>
    </div>

    {/* Compact filter chips row instead of fat sidebar */}
    <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
      <div className="flex items-center gap-1.5 px-3 py-1.5 border border-line rounded-full text-xs ink-3 bg-surface shrink-0">
        🔍 <span>Buscar...</span>
      </div>
      {["Tipo: Todos", "Operación: Todos", "Ambientes: Todos", "Zona: Todas"].map(f => (
        <button key={f} className="px-3 py-1.5 border border-line rounded-full text-xs ink-2 hover:bg-surface-2 shrink-0 mono">
          {f} <span className="ink-3 ml-1">▾</span>
        </button>
      ))}
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {DEMO.props.map((p, i) => <PropCard key={i} p={p} i={i} />)}
    </div>
    <div className="flex items-center justify-between mt-4 text-[11px] ink-3">
      <span>1-6 de 236 propiedades</span>
      <div className="flex items-center gap-2"><span>Por página 10 ▾</span><span>Página 1 de 24</span></div>
    </div>
  </div>
);

const ViewPipeline = () => {
  const totalDeals = DEMO.pipeline.reduce((sum, col) => sum + col.count, 0);
  return (
    <div className="p-5">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
        <div className="flex items-center gap-2 text-xs ink-3">
          <span className="mono">{totalDeals} oportunidades activas</span>
          <span className="w-1 h-1 rounded-full bg-[var(--ink-3)]" />
          <span className="mono">3 cierran esta semana</span>
        </div>
        <div className="flex items-center gap-2">
          <button aria-label="Refrescar datos" title="Refrescar" className="w-8 h-8 rounded-md border border-line grid place-items-center ink-2 hover:bg-surface-2">{Icon.refresh}</button>
          <button className="px-3 py-1.5 rounded-md bg-accent text-white text-xs font-medium">+ Oportunidad</button>
        </div>
      </div>

      {/* Compact filter chips */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
        <div className="flex items-center gap-1.5 px-3 py-1.5 border border-line rounded-full text-xs ink-3 bg-surface shrink-0">
          🔍 <span>Buscar...</span>
        </div>
        {["Responsable: Todos", "Fuente: Todas", "Rango: Últimos 30d"].map(f => (
          <button key={f} className="px-3 py-1.5 border border-line rounded-full text-xs ink-2 hover:bg-surface-2 shrink-0 mono">
            {f} <span className="ink-3 ml-1">▾</span>
          </button>
        ))}
      </div>

      {/* Kanban columns */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {DEMO.pipeline.map((col, ci) => (
          <div key={col.stage} className="min-w-[210px] flex-1">
            {/* Column header */}
            <div className="flex items-center gap-2 px-2 py-2 border-b-2 mb-2" style={{ borderColor: col.color }}>
              <span className="w-2 h-2 rounded-full" style={{ background: col.color }}/>
              <span className="text-xs font-semibold">{col.stage}</span>
              <span
                className="mono text-[10px] ml-auto px-1.5 py-0.5 rounded font-semibold"
                style={{ background: `color-mix(in oklab, ${col.color} 18%, transparent)`, color: col.color }}
              >
                {col.count}
              </span>
            </div>

            {/* Cards container */}
            <div className="space-y-2 min-h-[180px] p-1.5 rounded-lg">
              {col.cards.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 px-3 border border-dashed border-line rounded-md text-center">
                  <div className="w-7 h-7 rounded-full grid place-items-center mb-2 opacity-40" style={{ background: col.color }}>
                    <span className="text-white text-xs">+</span>
                  </div>
                  <span className="mono text-[10px] ink-3">arrastrá aquí</span>
                </div>
              ) : col.cards.map((c, i) => {
                const av = avatarFromName(c.who);
                return (
                  <div
                    key={i}
                    className="relative p-3 rounded-lg bg-surface border border-line text-xs hover:border-[var(--accent)] hover:-translate-y-0.5 transition-[transform,border-color] duration-300 cursor-pointer overflow-hidden"
                    style={{ animation: `rowIn .4s ${(ci * 100 + i * 80)}ms both` }}
                  >
                    {/* Color stripe at top */}
                    <span className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: col.color }} />

                    {/* Header: avatar + name + source */}
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="w-7 h-7 rounded-full grid place-items-center mono text-[10px] font-semibold text-white shrink-0"
                        style={{ background: av.color }}
                      >
                        {av.initials}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold truncate">{c.who}</div>
                        <div className="mono text-[9px] ink-3 truncate">{c.date}</div>
                      </div>
                    </div>

                    {/* Property */}
                    <div className="text-[11px] ink-2 truncate mb-2 px-2 py-1 bg-surface-2 rounded">
                      {c.prop}
                    </div>

                    {/* Footer: source pill */}
                    <div className="flex items-center justify-between gap-2">
                      <span className={`mono text-[9px] px-1.5 py-0.5 rounded ${srcPill(c.src)}`}>{c.src}</span>
                      <span className="mono text-[9px] ink-3">#0{(ci * 10 + i + 142).toString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

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

// Compact integration card — handles connected, available, and coming-soon states
const IntegCard = ({ logo, name, desc, status, lastSync, account }) => {
  const isConnected = status === "connected";
  const isComingSoon = status === "soon";
  const statusStyle = isConnected
    ? { dot: "#2fb27d", text: "Conectado", className: "bg-[color-mix(in_oklab,#2fb27d_15%,var(--bg))] text-[#2fb27d]" }
    : isComingSoon
      ? { dot: "#9a56d0", text: "Próximamente", className: "bg-[color-mix(in_oklab,#9a56d0_15%,var(--bg))] text-[#9a56d0]" }
      : { dot: "#9a9689", text: "Disponible", className: "bg-surface-2 ink-3" };

  return (
    <div className={`bg-surface border rounded-xl p-4 transition hover:-translate-y-0.5 hover:border-[var(--accent)] ${isConnected ? "border-line" : "border-line opacity-90"}`}>
      <div className="flex items-start gap-3">
        <div className="shrink-0">{logo}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm truncate">{name}</span>
            <span className="flex items-center gap-1 mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0" style={{ background: `color-mix(in oklab, ${statusStyle.dot} 15%, var(--bg))`, color: statusStyle.dot }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusStyle.dot }} />
              {statusStyle.text}
            </span>
          </div>
          <div className="text-[11px] ink-3 leading-snug">{desc}</div>
        </div>
      </div>

      {isConnected && account && (
        <div className="mt-3 px-2.5 py-2 border border-line rounded-md flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-medium truncate">{account}</div>
            {lastSync && <div className="mono text-[9px] ink-3 mt-0.5">sync: {lastSync}</div>}
          </div>
          <button aria-label="Configurar integración" title="Configurar" className="mono text-[10px] ink-3 hover:accent shrink-0">⚙</button>
        </div>
      )}

      {!isConnected && !isComingSoon && (
        <button className="mt-3 w-full py-2 rounded-md bg-[var(--ink)] text-[var(--bg)] text-xs font-medium hover:opacity-90 transition">
          Conectar →
        </button>
      )}

      {isComingSoon && (
        <button className="mt-3 w-full py-2 rounded-md border border-dashed border-line text-xs ink-3" disabled>
          Avisame cuando esté lista
        </button>
      )}
    </div>
  );
};

const ZonapropLogo = () => <div className="w-8 h-8 rounded-lg bg-[#f05000] text-white grid place-items-center font-bold text-sm">Z</div>;
const ArgenpropLogo = () => <div className="w-8 h-8 rounded-lg bg-[#009a44] text-white grid place-items-center font-bold text-sm">A</div>;
const WhatsAppLogo = () => <div className="w-8 h-8 rounded-lg bg-[#25D366] text-white grid place-items-center font-bold text-sm">W</div>;
const InstagramLogo = () => <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#fd1d1d] via-[#fcb045] to-[#833ab4] text-white grid place-items-center font-bold text-[10px]">IG</div>;

const ViewIntegr = () => (
  <div className="p-5 space-y-5">
    {/* Header with sync status */}
    <div className="flex items-center justify-between gap-2 flex-wrap">
      <div className="flex items-center gap-2 text-xs ink-3">
        <span className="mono">5 conectadas</span>
        <span className="w-1 h-1 rounded-full bg-[var(--ink-3)]" />
        <span className="mono">última sync: hace 12s</span>
      </div>
      <div className="flex items-center gap-2">
        <button aria-label="Refrescar datos" title="Refrescar" className="w-8 h-8 rounded-md border border-line grid place-items-center ink-2 hover:bg-surface-2">{Icon.refresh}</button>
        <button className="px-3 py-1.5 rounded-md border border-line text-xs hover:bg-surface-2">Sincronizar todas</button>
      </div>
    </div>

    {/* Connected section */}
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--pos)] pulse-dot" />
        <span className="mono text-[10px] uppercase tracking-[0.18em] ink-3">conectadas · 5</span>
      </div>
      <div className="grid grid-cols-1 @[600px]/dash:grid-cols-2 gap-3">
        <IntegCard
          logo={<MetaLogo/>}
          name="Meta Ads"
          desc="Facebook + Instagram — campañas y gasto."
          status="connected"
          account="Inmobiliaria Demo"
          lastSync="hace 12s"
        />
        <IntegCard
          logo={<TokkoLogo/>}
          name="Tokko Broker"
          desc="Importa propiedades + sync bidireccional."
          status="connected"
          account="API conectada"
          lastSync="hace 8m"
        />
        <IntegCard
          logo={<ZonapropLogo/>}
          name="ZonaProp"
          desc="Auto-import de leads desde portal."
          status="connected"
          account="grupocosta.zonaprop.com.ar"
          lastSync="hace 2m"
        />
        <IntegCard
          logo={<ArgenpropLogo/>}
          name="Argenprop"
          desc="Auto-import de leads desde portal."
          status="connected"
          account="Grupo Costa Inmobiliaria"
          lastSync="hace 5m"
        />
        <IntegCard
          logo={<WhatsAppLogo/>}
          name="WhatsApp Business"
          desc="Captura y asigna conversaciones."
          status="connected"
          account="+54 9 223 689-2809"
          lastSync="en vivo"
        />
      </div>
    </div>

    {/* Available + coming soon */}
    <div>
      <div className="mono text-[10px] uppercase tracking-[0.18em] ink-3 mb-3">disponibles para conectar</div>
      <div className="grid grid-cols-1 @[600px]/dash:grid-cols-2 gap-3">
        <IntegCard
          logo={<GoogleLogo/>}
          name="Google Ads"
          desc="Búsqueda, Display, YouTube — gasto y leads."
          status="available"
        />
        <IntegCard
          logo={<InstagramLogo/>}
          name="Instagram DM"
          desc="DMs como leads, asignación automática."
          status="soon"
        />
      </div>
    </div>
  </div>
);

export const Dashboard = () => {
  const [view, setView] = useState("inicio");
  const [playKey, setPlayKey] = useState(0);

  useEffect(() => { setPlayKey(k => k + 1); }, [view]);

  const titles = { inicio: "Inicio", leads: "Leads", props: "Propiedades", pipe: "Pipeline", plug: "Integraciones" };

  return (
    <div className="card overflow-hidden shadow-[0_40px_100px_-40px_rgba(0,0,0,0.25)] @container/dash">
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

      <div className="grid grid-cols-[56px_1fr] @[680px]/dash:grid-cols-[180px_1fr] min-h-[620px] transition-[grid-template-columns] duration-300">
        <aside className="border-r border-line bg-surface p-2 @[680px]/dash:p-3">
          <div className="flex items-center gap-2 justify-center @[680px]/dash:justify-start @[680px]/dash:px-2 mb-0.5">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-[var(--accent)] to-[#ffb08a] grid place-items-center text-white font-bold text-[11px] shrink-0">Q</div>
            <span className="serif text-xl leading-none hidden @[680px]/dash:inline">quasor</span>
          </div>
          <div className="hidden @[680px]/dash:block px-2 mono text-[10px] ink-3 mb-4">Inmobiliaria Demo</div>
          <div className="@[680px]/dash:hidden h-4" />
          <nav className="space-y-0.5">
            <NavItem icon={Icon.home}  label="Inicio"        active={view === "inicio"} onClick={() => setView("inicio")}/>
            <NavItem icon={Icon.leads} label="Leads"         active={view === "leads"}  onClick={() => setView("leads")}/>
            <NavItem icon={Icon.props} label="Propiedades"   active={view === "props"}  onClick={() => setView("props")}/>
            <NavItem icon={Icon.pipe}  label="Pipeline"      active={view === "pipe"}   onClick={() => setView("pipe")}/>
            <NavItem icon={Icon.plug}  label="Integraciones" active={view === "plug"}   onClick={() => setView("plug")}/>
          </nav>
        </aside>

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
