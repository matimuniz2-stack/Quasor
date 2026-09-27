import { useEffect, useState } from "react";
import { Ic, Tint, Dot } from "./ui.jsx";
import { STAGE_META, SOURCE_COLORS, LEAD_STATUS, TEMPS, ASSET_STATUS, PRIORITIES, TASK_STATUS } from "./data.js";

export const SrcBadge = ({ src, small }) => {
  const c = SOURCE_COLORS[src] || "#9ca3af";
  return (
    <Tint c={c} className={small ? "!text-[10px] !px-1 !py-0" : ""}>
      <Dot c={c} size={small ? 5 : 6} />
      {src}
    </Tint>
  );
};

export const StageBadge = ({ stage, small }) => {
  const m = STAGE_META[stage];
  return (
    <Tint c={m.c} className={small ? "!text-[10px]" : ""}>
      <Ic n={m.icon} className="w-3 h-3" />
      {m.label}
    </Tint>
  );
};

export const LeadStatus = ({ s }) => {
  const m = LEAD_STATUS[s];
  return <Tint c={m.c}>{m.label}</Tint>;
};

export const TempChip = ({ t, compact, onClick }) => {
  const m = TEMPS[t || "none"];
  if (compact) {
    return (
      <span title={`Temperatura: ${m.label}`} style={{ color: m.c }} className="inline-flex">
        <Ic n={m.icon} className="w-3.5 h-3.5" />
      </span>
    );
  }
  return (
    <Tint c={m.c} onClick={onClick} title="Temperatura">
      <Ic n={m.icon} className="w-3 h-3" />
      {m.label}
    </Tint>
  );
};

export const AssetStatus = ({ s, onClick, glass }) => {
  const c = ASSET_STATUS[s] || "#71717a";
  if (glass) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center gap-1 rounded-md px-1.5 py-[2px] text-[11px] font-medium text-white backdrop-blur-sm border"
        style={{ background: `color-mix(in oklab, ${c} 55%, rgba(0,0,0,.25))`, borderColor: "rgba(255,255,255,.25)" }}
        title="Cambiar estado"
      >
        {s}
        <Ic n="chevdown" className="w-3 h-3 opacity-80" />
      </button>
    );
  }
  return <Tint c={c}>{s}</Tint>;
};

export const PrioBadge = ({ p }) => {
  const m = PRIORITIES[p];
  return (
    <Tint c={m.c}>
      <Dot c={m.c} />
      {m.label}
    </Tint>
  );
};

export const TaskStatusBadge = ({ s }) => {
  const m = TASK_STATUS[s];
  return (
    <Tint c={m.c}>
      <Ic n={m.icon} className="w-3 h-3" />
      {m.label}
    </Tint>
  );
};

// ── SLA de primer contacto ────────────────────────────────────────────────
// Objetivo 30 min / incumplimiento 2 h (Configuración › SLA de leads).
// Mientras el lead sigue "Nuevo" el reloj corre en vivo.
const sev = (min) => (min < 30 ? "#16a34a" : min < 120 ? "#d97706" : "#dc2626");
const dur = (sec) => {
  const m = Math.floor(sec / 60);
  if (m < 60) return `${m}m ${String(Math.floor(sec % 60)).padStart(2, "0")}s`;
  return `${Math.floor(m / 60)}h ${m % 60}m`;
};
const durShort = (min) => (min < 60 ? `${min}m` : `${Math.floor(min / 60)}h ${min % 60}m`);

// El reloj corre contra la hora real desde que se cargó la página, así no se
// reinicia al cambiar de pantalla. Un lead nuevo guarda su propio "at".
const T0 = typeof Date !== "undefined" ? Date.now() : 0;
export const slaSeconds = (sla) => sla.min * 60 + Math.max(0, Math.floor((Date.now() - (sla.at ?? T0)) / 1000));

export const useTick = (on) => {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!on) return;
    const id = setInterval(() => setT((x) => x + 1), 1000);
    return () => clearInterval(id);
  }, [on]);
  return t;
};

export const SlaBadge = ({ sla, contacted }) => {
  const live = sla.live && !contacted;
  useTick(live); // solo fuerza el re-render cada segundo
  if (!live) {
    const c = sev(sla.min);
    return (
      <span title={`Primer contacto ${durShort(sla.min)} después de ingresar`} className="inline-flex items-center gap-1 h-5 px-1.5 rounded-md text-[10px] font-semibold q-num q-tint" style={{ "--c": c }}>
        <Ic n="check" className="w-3 h-3" />
        {durShort(sla.min)}
      </span>
    );
  }
  const sec = slaSeconds(sla);
  const c = sev(sec / 60);
  return (
    <span title={`Sin contactar hace ${dur(sec)}`} className="inline-flex items-center gap-1 h-5 px-1.5 rounded-md text-[10px] font-semibold q-num q-tint-strong" style={{ "--c": c }}>
      <Ic n="timer" className="w-3 h-3" />
      {dur(sec)}
    </span>
  );
};

// Días sin actividad en la etapa (verde / ámbar al 70% del umbral / rojo)
export const StagnantBadge = ({ days, threshold = 5 }) => {
  if (days == null) return null;
  const c = days >= threshold ? "#dc2626" : days >= threshold * 0.7 ? "#d97706" : days === 0 ? "#71717a" : "#16a34a";
  return (
    <span title={`Sin actividad hace ${days} días`} className="inline-flex items-center h-5 px-1.5 rounded-md text-[10px] font-semibold q-num q-tint" style={{ "--c": c }}>
      {days}d
    </span>
  );
};

// Placeholder de foto: degradé con silueta (la demo no carga imágenes reales)
export const AssetThumb = ({ a, className = "", icon = "building" }) => (
  <div className={`relative overflow-hidden ${className}`} style={{ background: `linear-gradient(135deg, ${a.img[0]}, ${a.img[1]})` }}>
    <div className="absolute inset-0" style={{ background: "radial-gradient(120% 80% at 80% 0%, rgba(255,255,255,.22), transparent 55%)" }} />
    <Ic n={icon} className="absolute right-2 bottom-2 w-5 h-5 text-white/35" />
  </div>
);
