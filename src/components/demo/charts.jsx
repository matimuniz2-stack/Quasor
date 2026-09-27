import { useEffect, useRef, useState } from "react";
import { fmtN } from "./ui.jsx";

const useWidth = () => {
  const ref = useRef(null);
  const [w, setW] = useState(520);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(160, Math.round(e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w];
};

// Líneas con área suave + crosshair y tooltip (recharts ComposedChart en la app)
export const LineChart = ({ labels, series, height = 190, fmt = (v) => fmtN(v), area = true, playKey }) => {
  const [ref, w] = useWidth();
  const [hover, setHover] = useState(null);
  const pad = { t: 12, r: 10, b: 24, l: 30 };
  const all = series.flatMap((s) => s.data);
  const maxRaw = Math.max(...all);
  const minRaw = series[0].min ?? 0;
  const max = Math.ceil(maxRaw * 1.12);
  const n = labels.length;
  const x = (i) => pad.l + (i / (n - 1)) * (w - pad.l - pad.r);
  const y = (v) => height - pad.b - ((v - minRaw) / (max - minRaw || 1)) * (height - pad.t - pad.b);
  const path = (d) => d.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * w;
    const i = Math.round(((px - pad.l) / (w - pad.l - pad.r)) * (n - 1));
    setHover(Math.max(0, Math.min(n - 1, i)));
  };

  return (
    <div ref={ref} className="relative w-full" style={{ height }}>
      <svg width={w} height={height} className="block overflow-visible" onMouseMove={onMove} onMouseLeave={() => setHover(null)} key={playKey}>
        <defs>
          {series.map((s, si) => (
            <linearGradient key={si} id={`qg-${s.id}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={s.c} stopOpacity="0.22" />
              <stop offset="100%" stopColor={s.c} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>
        {[0, 0.5, 1].map((p) => {
          const yy = pad.t + p * (height - pad.t - pad.b);
          return (
            <g key={p}>
              <line x1={pad.l} x2={w - pad.r} y1={yy} y2={yy} stroke="var(--q-border)" strokeDasharray="3 3" />
              <text x={pad.l - 6} y={yy + 3} fontSize="10" fill="var(--q-muted-fg)" textAnchor="end">{fmt(max - p * (max - minRaw))}</text>
            </g>
          );
        })}
        {labels.map((l, i) => ((i % Math.ceil(n / 7) === 0 && n - 1 - i >= Math.ceil(n / 7)) || i === n - 1) && (
          <text key={i} x={x(i)} y={height - 6} fontSize="10" fill="var(--q-muted-fg)" textAnchor="middle">{l}</text>
        ))}
        {series.map((s, si) => (
          <g key={s.id}>
            {area && (
              <path d={`${path(s.data)} L${x(n - 1)},${height - pad.b} L${x(0)},${height - pad.b} Z`} fill={`url(#qg-${s.id})`} style={{ animation: `qFade .8s ${si * 0.15}s both` }} />
            )}
            <path d={path(s.data)} fill="none" stroke={s.c} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" pathLength="1" style={{ strokeDasharray: 1, strokeDashoffset: 1, animation: `qDraw 1.2s ${si * 0.15}s cubic-bezier(.2,.7,.2,1) forwards` }} />
          </g>
        ))}
        {hover != null && (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={pad.t} y2={height - pad.b} stroke="var(--q-muted-fg)" strokeOpacity=".4" />
            {series.map((s) => <circle key={s.id} cx={x(hover)} cy={y(s.data[hover])} r="3.5" fill="var(--q-card)" stroke={s.c} strokeWidth="2" />)}
          </g>
        )}
      </svg>
      {hover != null && (
        <div
          className="absolute pointer-events-none q-bg-pop border rounded-lg px-2.5 py-1.5 text-[11px] q-fade"
          style={{ top: 4, left: Math.min(x(hover) + 10, w - 150), boxShadow: "var(--q-shadow)" }}
        >
          <div className="font-medium mb-0.5">{labels[hover]}</div>
          {series.map((s) => (
            <div key={s.id} className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="w-2 h-2 rounded-full" style={{ background: s.c }} />
              <span className="q-mut">{s.label}</span>
              <span className="ml-auto pl-3 font-medium q-num">{fmt(s.data[hover])}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Embudo: BarChart horizontal con relleno degradé (12%→60%) y borde
export const Funnel = ({ rows, playKey, onPick }) => {
  const max = Math.max(...rows.map((r) => r.v));
  return (
    <div className="space-y-1.5" key={playKey}>
      {rows.map((r, i) => (
        <button
          type="button"
          key={r.k}
          onClick={() => onPick?.(r)}
          className="w-full grid grid-cols-[minmax(0,118px)_1fr_28px] items-center gap-2.5 group text-left"
          title={onPick ? `Ver ${r.label} en el pipeline` : undefined}
        >
          <span className="text-[11.5px] q-fg2 truncate text-right group-hover:text-[var(--q-fg)]">{r.label}</span>
          <span className="h-[22px] rounded-md relative overflow-hidden">
            <span
              className="absolute inset-y-0 left-0 rounded-md border"
              style={{
                width: `${Math.max(6, (r.v / max) * 100)}%`,
                borderColor: r.c,
                background: `linear-gradient(90deg, color-mix(in oklab, ${r.c} 12%, transparent), color-mix(in oklab, ${r.c} 60%, transparent))`,
                transformOrigin: "left",
                animation: `qGrowX .8s ${i * 0.06}s cubic-bezier(.2,.7,.2,1) both`,
              }}
            />
          </span>
          <span className="text-[12px] font-semibold q-num text-right">{r.v}</span>
        </button>
      ))}
    </div>
  );
};

// Torta tipo dona con etiqueta central + leyenda con hover
export const Donut = ({ rows, center, centerLabel, size = 132 }) => {
  const [hi, setHi] = useState(null);
  const total = rows.reduce((s, r) => s + r.v, 0) || 1;
  const r = size / 2 - 10;
  const c = 2 * Math.PI * r;
  let off = 0;
  const cur = hi != null ? rows[hi] : null;
  return (
    <div className="flex items-center gap-4 min-w-0">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
          <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--q-muted)" strokeWidth="14" />
            {rows.map((s, i) => {
              const len = (s.v / total) * c;
              const el = (
                <circle
                  key={s.k}
                  cx={size / 2} cy={size / 2} r={r} fill="none" stroke={s.c}
                  strokeWidth={hi === i ? 18 : 14}
                  strokeDasharray={`${Math.max(0, len - 2).toFixed(2)} ${(c - len + 2).toFixed(2)}`}
                  strokeDashoffset={(-off).toFixed(2)}
                  onMouseEnter={() => setHi(i)} onMouseLeave={() => setHi(null)}
                  style={{ transition: "stroke-width .15s", opacity: hi == null || hi === i ? 1 : 0.35, animation: `qFade .5s ${0.1 + i * 0.08}s both` }}
                />
              );
              off += len;
              return el;
            })}
          </g>
        </svg>
        <div className="absolute inset-0 grid place-items-center text-center pointer-events-none">
          <div>
            <div className="text-[22px] font-bold q-num leading-none">{cur ? cur.v : center}</div>
            <div className="text-[10px] q-mut mt-1 max-w-[80px] truncate">{cur ? cur.k : centerLabel}</div>
          </div>
        </div>
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        {rows.map((s, i) => (
          <div key={s.k} onMouseEnter={() => setHi(i)} onMouseLeave={() => setHi(null)} className={`flex items-center gap-2 text-[11.5px] rounded px-1 -mx-1 cursor-default ${hi === i ? "q-bg-muted" : ""}`}>
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: s.c }} />
            <span className="q-fg2 truncate">{s.k}</span>
            <span className="ml-auto pl-2 q-num q-mut">{s.v}</span>
            <span className="w-9 text-right q-num q-mut hidden @[900px]/app:inline">{Math.round((s.v / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Medidor semicircular (Objetivo de la empresa)
export const Meter = ({ pct, size = 180, label, sub }) => {
  const r = size / 2 - 14;
  const len = Math.PI * r;
  const [on, setOn] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setOn(true), 60);
    return () => clearTimeout(id);
  }, []);
  const d = `M14,${size / 2} A${r},${r} 0 0 1 ${size - 14},${size / 2}`;
  return (
    <div className="relative" style={{ width: size, height: size / 2 + 22 }}>
      <svg width={size} height={size / 2 + 8} viewBox={`0 0 ${size} ${size / 2 + 8}`}>
        <path d={d} fill="none" stroke="var(--q-muted)" strokeWidth="14" strokeLinecap="round" />
        <path
          d={d} fill="none" stroke="var(--q-primary)" strokeWidth="14" strokeLinecap="round"
          strokeDasharray={`${len} ${len}`}
          style={{ strokeDashoffset: on ? len * (1 - Math.min(1, pct)) : len, transition: "stroke-dashoffset 1.3s cubic-bezier(.2,.7,.2,1)" }}
        />
      </svg>
      <div className="absolute inset-x-0 bottom-0 text-center">
        <div className="text-[26px] font-bold q-num leading-none">{label}</div>
        {sub && <div className="text-[11px] q-mut mt-1">{sub}</div>}
      </div>
    </div>
  );
};
