import { createContext, useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  LuLayoutDashboard, LuUsers, LuBuilding2, LuCar, LuKanban, LuSearch, LuCalculator, LuFileText,
  LuListTodo, LuKeyRound, LuRepeat2, LuHandshake, LuTarget, LuSettings, LuPlug, LuRocket, LuSparkles,
  LuBell, LuMoon, LuSun, LuChevronDown, LuFlame, LuThermometerSun, LuSnowflake, LuThermometer, LuTimer,
  LuPause, LuMessagesSquare, LuCalendarCheck, LuEye, LuHandCoins, LuBookmarkCheck, LuCircleArrowRight,
  LuCircleCheckBig, LuCircleX, LuPhone, LuMail, LuCheck, LuX, LuPlus, LuRefreshCw, LuPanelLeft, LuInbox,
  LuMessageSquare, LuArrowRight, LuListPlus, LuCircleCheck, LuTrophy, LuMedal, LuArrowUpRight,
  LuArrowDownRight, LuGripVertical, LuEllipsisVertical, LuClipboardCheck, LuHourglass, LuUserPlus,
  LuArrowRightLeft, LuAtSign, LuMapPin, LuGauge, LuCalendar, LuCalendarDays, LuList, LuReceipt,
  LuDollarSign, LuMegaphone, LuCode, LuSend, LuLink2, LuDownload, LuCopy, LuTriangleAlert, LuClock,
  LuCircle, LuPlay, LuUserRoundCheck, LuBanknote, LuPercent, LuMousePointerClick, LuShieldCheck,
  LuChevronRight, LuImage, LuSquareCheck, LuTrendingUp, LuFilter, LuTag, LuRuler, LuBedDouble, LuHouse,
  LuRadio, LuUser, LuMessageCircle, LuFileDown, LuPencil, LuChevronLeft, LuPanelLeftClose, LuHistory,
} from "react-icons/lu";

export const I = {
  home: LuLayoutDashboard, users: LuUsers, building: LuBuilding2, car: LuCar, kanban: LuKanban,
  search: LuSearch, calculator: LuCalculator, file: LuFileText, listtodo: LuListTodo, key: LuKeyRound,
  repeat: LuRepeat2, handshake: LuHandshake, target: LuTarget, settings: LuSettings, plug: LuPlug,
  rocket: LuRocket, sparkles: LuSparkles, bell: LuBell, moon: LuMoon, sun: LuSun, chevdown: LuChevronDown,
  flame: LuFlame, thermosun: LuThermometerSun, snow: LuSnowflake, thermo: LuThermometer, timer: LuTimer,
  pause: LuPause, messages: LuMessagesSquare, calcheck: LuCalendarCheck, eye: LuEye, handcoins: LuHandCoins,
  bookmark: LuBookmarkCheck, arrowcircle: LuCircleArrowRight, checkbig: LuCircleCheckBig, circlex: LuCircleX,
  phone: LuPhone, mail: LuMail, check: LuCheck, x: LuX, plus: LuPlus, refresh: LuRefreshCw, panel: LuPanelLeft,
  panelclose: LuPanelLeftClose, inbox: LuInbox, message: LuMessageSquare, arrowright: LuArrowRight,
  listplus: LuListPlus, circlecheck: LuCircleCheck, trophy: LuTrophy, medal: LuMedal, up: LuArrowUpRight,
  down: LuArrowDownRight, grip: LuGripVertical, more: LuEllipsisVertical, clipboard: LuClipboardCheck,
  hourglass: LuHourglass, userplus: LuUserPlus, swap: LuArrowRightLeft, at: LuAtSign, pin: LuMapPin,
  gauge: LuGauge, cal: LuCalendar, caldays: LuCalendarDays, list: LuList, receipt: LuReceipt,
  dollar: LuDollarSign, megaphone: LuMegaphone, code: LuCode, send: LuSend, link: LuLink2,
  download: LuDownload, copy: LuCopy, alert: LuTriangleAlert, clock: LuClock, circle: LuCircle, play: LuPlay,
  usercheck: LuUserRoundCheck, banknote: LuBanknote, percent: LuPercent, click: LuMousePointerClick,
  shield: LuShieldCheck, chevright: LuChevronRight, chevleft: LuChevronLeft, image: LuImage,
  checksq: LuSquareCheck, trending: LuTrendingUp, filter: LuFilter, tag: LuTag, ruler: LuRuler,
  bed: LuBedDouble, house: LuHouse, radio: LuRadio, user: LuUser, whatsapp: LuMessageCircle,
  filedown: LuFileDown, pencil: LuPencil, history: LuHistory,
};

export const Ic = ({ n, className = "w-4 h-4", ...rest }) => {
  const C = I[n] || LuCircle;
  return <C className={`shrink-0 ${className}`} aria-hidden="true" {...rest} />;
};

// ── Formato ──────────────────────────────────────────────────────────────
export const fmtN = (n, d = 0) =>
  Number(n).toLocaleString("es-AR", { minimumFractionDigits: d, maximumFractionDigits: d });
export const money = (n, cur = "USD") => (cur === "USD" ? "US$ " : "$ ") + fmtN(Math.round(n));

export const useCountUp = (target, duration = 1100, key) => {
  const [v, setV] = useState(target);
  useEffect(() => {
    if (typeof window === "undefined" || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setV(target);
      return;
    }
    let raf, start;
    const step = (t) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / duration);
      setV(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    setV(0);
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, key]);
  return v;
};

// ── Avatar con color por hash (igual criterio que la app) ────────────────
const AV = ["#3b82f6", "#8b5cf6", "#16a34a", "#d97706", "#f97316", "#db2777", "#0891b2"];
export const initials = (name) => {
  const p = name.split(" ").filter(Boolean);
  return ((p[0]?.[0] || "?") + (p[1]?.[0] || "")).toUpperCase();
};
export const avColor = (name) => {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
  return AV[Math.abs(h) % AV.length];
};
export const Avatar = ({ name, size = 24, className = "" }) => (
  <span
    title={name}
    className={`rounded-full grid place-items-center text-white font-semibold shrink-0 ${className}`}
    style={{ width: size, height: size, fontSize: Math.max(8, size * 0.38), background: avColor(name) }}
  >
    {initials(name)}
  </span>
);

// ── Badges ───────────────────────────────────────────────────────────────
export const Tint = ({ c, children, className = "", strong, title, onClick }) => {
  const Tag = onClick ? "button" : "span";
  return (
    <Tag
      title={title}
      onClick={onClick}
      className={`inline-flex items-center gap-1 rounded-md px-1.5 py-[2px] text-[11px] font-medium whitespace-nowrap ${strong ? "q-tint-strong" : "q-tint"} ${className}`}
      style={{ "--c": c }}
    >
      {children}
    </Tag>
  );
};

export const Dot = ({ c, size = 6 }) => (
  <span className="rounded-full shrink-0" style={{ width: size, height: size, background: c }} />
);

// Mercado Libre sin responder: el puntito amarillo de PendingQuestionDot
export const MlDot = () => (
  <span title="Tenés una consulta de Mercado Libre pendiente" className="w-1.5 h-1.5 rounded-full bg-[#eab308] shrink-0" />
);

export const Kbd = ({ children }) => (
  <kbd className="text-[10px] font-medium px-1.5 py-0.5 rounded border q-bg-muted q-mut">{children}</kbd>
);

// Botón de WhatsApp verde (#25D366) de la tabla de leads
export const WaBtn = ({ onClick, size = 22 }) => (
  <button
    type="button"
    onClick={(e) => { e.stopPropagation(); onClick?.(); }}
    title="Abrir WhatsApp"
    className="rounded-full grid place-items-center text-[#25D366] hover:bg-[#25D366]/15 transition-colors shrink-0"
    style={{ width: size, height: size }}
  >
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2a9.9 9.9 0 0 0-8.5 15l-1.4 5 5.2-1.4A9.9 9.9 0 1 0 12.04 2Zm5.8 14.1c-.25.7-1.44 1.33-2 1.4-.52.08-1.17.1-1.9-.12a17 17 0 0 1-1.7-.63 13.4 13.4 0 0 1-5.1-4.5c-.37-.5-1.13-1.52-1.13-2.9s.72-2.05.98-2.33a1.03 1.03 0 0 1 .75-.35h.54c.17 0 .4-.07.63.48.24.57.8 1.96.87 2.1.07.14.12.3.02.48-.1.2-.14.3-.28.47-.14.16-.3.37-.42.5-.14.14-.29.29-.12.57.16.28.72 1.2 1.56 1.94 1.07.95 1.97 1.25 2.25 1.39.28.14.44.12.6-.07.17-.2.7-.82.9-1.1.18-.28.37-.23.62-.14.25.1 1.62.77 1.9.9.28.15.47.22.54.34.07.12.07.68-.18 1.37Z" />
    </svg>
  </button>
);

// ── Popover / Dialog contenidos DENTRO de la demo ────────────────────────
// Los diálogos se montan en la raíz de la demo (portal) para tapar topbar y
// sidebar como en la app, sin escaparse de la placa de la landing.
export const PortalCtx = createContext(null);

export const Dialog = ({ open, onClose, title, subtitle, children, footer, width = 560, icon }) => {
  const host = useContext(PortalCtx);
  if (!open) return null;
  const node = (
    <div className="absolute inset-0 z-40 flex items-start justify-center p-3 @[640px]/app:p-6 overflow-hidden" role="dialog" aria-modal="true" aria-label={typeof title === "string" ? title : undefined}>
      <div className="absolute inset-0 bg-black/45 backdrop-blur-[1px] q-fade" onClick={onClose} />
      <div className="relative q-bg-pop rounded-2xl border q-pop flex flex-col max-h-full w-full overflow-hidden" style={{ maxWidth: width, boxShadow: "var(--q-shadow-lg)" }}>
        <div className="flex items-start gap-3 px-5 pt-4 pb-3 border-b">
          {icon}
          <div className="min-w-0 flex-1">
            <div className="text-[15px] font-semibold leading-tight flex items-center gap-2 flex-wrap">{title}</div>
            {subtitle && <div className="text-[12px] q-mut mt-1 flex items-center gap-1.5 flex-wrap">{subtitle}</div>}
          </div>
          <button onClick={onClose} className="q-btn q-btn-ghost q-btn-icon -mr-2 -mt-1" aria-label="Cerrar"><Ic n="x" /></button>
        </div>
        <div className="overflow-y-auto q-scroll flex-1 min-h-0">{children}</div>
        {footer && <div className="px-5 py-3 border-t flex items-center justify-end gap-2 q-bg-card">{footer}</div>}
      </div>
    </div>
  );
  return host ? createPortal(node, host) : node;
};

export const Switch = ({ on, onChange, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={on}
    aria-label={label}
    onClick={() => onChange(!on)}
    className="relative w-8 h-[18px] rounded-full transition-colors shrink-0"
    style={{ background: on ? "var(--q-primary)" : "var(--q-border)" }}
  >
    <span className="absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white shadow transition-transform" style={{ left: 2, transform: on ? "translateX(14px)" : "none" }} />
  </button>
);

// Encabezado de página: h1 text-lg semibold + acciones a la derecha
export const PageHeader = ({ title, meta, children }) => (
  <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
    <div className="flex items-baseline gap-2.5 min-w-0">
      <h3 className="text-[17px] font-semibold tracking-[-0.02em]">{title}</h3>
      {meta && <span className="text-[12px] q-mut truncate">{meta}</span>}
    </div>
    <div className="flex items-center gap-2 flex-wrap">{children}</div>
  </div>
);

export const RefreshBtn = () => (
  <button className="q-btn q-btn-ghost q-btn-icon" title="Actualizar" aria-label="Actualizar"><Ic n="refresh" className="w-3.5 h-3.5" /></button>
);

export const SearchBox = ({ value, onChange, placeholder, className = "" }) => (
  <label className={`relative flex items-center ${className}`}>
    <Ic n="search" className="w-3.5 h-3.5 absolute left-2.5 q-mut pointer-events-none" />
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="q-input w-full"
      style={{ paddingLeft: 30 }}
      aria-label={placeholder}
    />
  </label>
);

// Chips de filtro (select simple por click) — ciclan entre opciones
export const FilterChip = ({ label, value, options, onChange }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`h-8 px-2.5 rounded-lg border text-[12px] inline-flex items-center gap-1.5 whitespace-nowrap transition-colors ${value ? "q-fg" : "q-mut"} hover:bg-[var(--q-muted)]`}
        style={value ? { borderColor: "color-mix(in oklab, var(--q-primary) 45%, var(--q-border))", background: "color-mix(in oklab, var(--q-primary) 6%, var(--q-card))" } : { background: "var(--q-card)" }}
      >
        <Ic n="filter" className="w-3 h-3" />
        {label}{value ? `: ${value}` : ""}
        <Ic n="chevdown" className="w-3 h-3 opacity-60" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-9 z-40 min-w-[170px] q-bg-pop border rounded-xl p-1 q-pop" style={{ boxShadow: "var(--q-shadow-lg)" }}>
            {[null, ...options].map((o) => (
              <button
                key={o || "todos"}
                onClick={() => { onChange(o); setOpen(false); }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg text-[12px] hover:bg-[var(--q-muted)] flex items-center gap-2"
              >
                <span className="w-3.5">{value === o && <Ic n="check" className="w-3.5 h-3.5 q-pri" />}</span>
                {o || "Todos"}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export const Empty = ({ icon = "inbox", text }) => (
  <div className="flex flex-col items-center justify-center gap-2 py-10 q-mut text-[12px]">
    <Ic n={icon} className="w-5 h-5" />
    {text}
  </div>
);
