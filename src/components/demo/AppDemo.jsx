import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./demo.css";
import { Ic, Avatar, Kbd, Tint, PortalCtx } from "./ui.jsx";
import { slaSeconds } from "./domain.jsx";
import { DEMO_INMO, DEMO_AUTO, STAGE_META, UPDATES } from "./data.js";
import { Inicio } from "./views/Inicio.jsx";
import { Leads, LeadDetail } from "./views/Leads.jsx";
import { Pipeline } from "./views/Pipeline.jsx";
import { Tasks } from "./views/Tasks.jsx";
import { Assets, Sales, Pedidos, Tasaciones, Presupuestos, Permutas, Llaves, Objetivos, Integraciones, Updates } from "./views/Modules.jsx";

// Quasor CRM — réplica interactiva del producto real con datos de ejemplo.
// Espeja la app a fines de sept. 2026: shell con topbar + sidebar agrupada,
// buscador ⌘K, notificaciones, Quasor IA, y los módulos por rubro
// (inmobiliaria: Pedidos, Tasaciones, Llaves · concesionaria: Presupuestos).
// Todo lo que se toca cambia el estado local: nada sale de la página.

const VERTICALS = { inmo: DEMO_INMO, auto: DEMO_AUTO };

const NAV = {
  inicio:       { label: "Inicio", icon: "home", path: "" },
  leads:        { label: "Leads", icon: "users", path: "leads" },
  assets:       { label: null, icon: null, path: "assets" },
  pipeline:     { label: "Pipeline", icon: "kanban", path: "pipeline" },
  pedidos:      { label: "Pedidos", icon: "search", path: "pedidos" },
  tasaciones:   { label: "Tasaciones", icon: "calculator", path: "tasaciones" },
  presupuestos: { label: "Presupuestos", icon: "file", path: "presupuestos" },
  tareas:       { label: "Tareas", icon: "listtodo", path: "tasks" },
  llaves:       { label: "Llaves", icon: "key", path: "llaves" },
  permutas:     { label: "Permutas", icon: "repeat", path: "permutas" },
  ventas:       { label: "Ventas", icon: "handshake", path: "sales" },
  objetivos:    { label: "Objetivos", icon: "target", path: "objetivos" },
  integ:        { label: "Integraciones", icon: "plug", path: "integrations" },
  updates:      { label: "Actualizaciones", icon: "rocket", path: "updates" },
};

const clone = (x) => JSON.parse(JSON.stringify(x));

const initNotifs = (D) => D.key === "inmo" ? [
  { id: "n1", icon: "inbox", title: "Nuevo lead asignado", body: "Lead automático desde Meta Ads · Diego Herrera", when: "hace 14 min", unread: true, lead: "l1" },
  { id: "n2", icon: "hourglass", title: "Oportunidad estancada", body: "Julieta Sosa · Visitó la propiedad · 6 días sin cambios", when: "hace 1 h", unread: true, lead: "l10" },
  { id: "n3", icon: "clock", title: "Lead por reasignarse", body: "Mariana Ávila pasa a otro vendedor en 2 h hábiles si no la contactás", when: "hace 2 h", unread: true, lead: "l5" },
  { id: "n4", icon: "at", title: "Martín Ríos te mencionó", body: "Lucas Romano: «¿le pasamos la contraoferta hoy?»", when: "hace 3 h", lead: "l7" },
  { id: "n5", icon: "alert", title: "Tarea vencida", body: "Seguimiento de reserva · Lucas Romano", when: "ayer" },
  { id: "n6", icon: "search", title: "Nueva sugerencia para un pedido", body: "Depto 2 amb en Güemes cumple todo lo que busca Gabriela Ortiz", when: "ayer" },
] : [
  { id: "n1", icon: "eye", title: "Presupuesto abierto", body: "Sabrina Molina volvió a abrir el presupuesto #0012 · 5 visitas · la anterior hace 2 días", when: "hace 20 min", unread: true, lead: "l10" },
  { id: "n2", icon: "inbox", title: "Nuevo lead asignado", body: "Lead automático desde Meta Ads · Pablo Suárez", when: "hace 11 min", unread: true, lead: "l1" },
  { id: "n3", icon: "clock", title: "Lead por reasignarse", body: "Rocío Méndez pasa a otro vendedor en 2 h hábiles si no la contactás", when: "hace 2 h", unread: true, lead: "l5" },
  { id: "n4", icon: "hourglass", title: "Oportunidad estancada", body: "Sabrina Molina · Realizó test drive · 5 días sin cambios", when: "hace 4 h", lead: "l10" },
  { id: "n5", icon: "at", title: "Diego Ramírez te mencionó", body: "Hernán Vidal: «aprobaron el crédito, ¿cerramos el lunes?»", when: "ayer", lead: "l7" },
];

const initState = (D) => ({
  leads: clone(D.leads),
  opps: clone(D.opps),
  tasks: clone(D.tasks),
  sales: clone(D.sales),
  assets: clone(D.assets),
  notifs: initNotifs(D),
  liveDone: false,
});

// Lead que "entra en vivo" a los pocos segundos de ver la demo
const LIVE = {
  inmo: { name: "Joaquín Albornoz", email: "joaco.albornoz@gmail.com", phone: "+54 223 555-0966", src: "Meta Ads", owner: "Sofía Vega", asset: "a6", campaign: "Captación · Deptos 2 amb" },
  auto: { name: "Agustina Correa", email: "agus.correa@gmail.com", phone: "+54 223 555-0966", src: "Meta Ads", owner: "Camila Herrera", asset: "v2", campaign: "0km · Cronos y Pulse" },
};

// ── Mini markdown: **negrita**, viñetas "- " y saltos de línea ───────────
const Md = ({ text }) => (
  <>
    {text.split("\n").map((line, i) => {
      const bullet = line.startsWith("- ");
      const parts = (bullet ? line.slice(2) : line).split(/(\*\*[^*]+\*\*)/g).map((p, k) =>
        p.startsWith("**") && p.endsWith("**") ? <b key={k}>{p.slice(2, -2)}</b> : <span key={k}>{p}</span>
      );
      if (!line.trim()) return <div key={i} className="h-1.5" />;
      return bullet
        ? <div key={i} className="flex gap-1.5 pl-1"><span>•</span><span>{parts}</span></div>
        : <div key={i}>{parts}</div>;
    })}
  </>
);

export const AppDemo = () => {
  const rootRef = useRef(null);
  const mainRef = useRef(null);
  const [width, setWidth] = useState(1200);
  const [vertical, setVertical] = useState("inmo");
  const [states, setStates] = useState(() => ({ inmo: initState(DEMO_INMO), auto: initState(DEMO_AUTO) }));
  const [view, setView] = useState("inicio");
  const [playKey, setPlayKey] = useState(0);
  const [leadOpen, setLeadOpen] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [bell, setBell] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [palette, setPalette] = useState(false);
  const [collapsed, setCollapsed] = useState(null);
  const [mobileNav, setMobileNav] = useState(false);
  const [qtheme, setQtheme] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [hint, setHint] = useState(true);
  const [host, setHost] = useState(null);
  // El globo de "Probá Quasor IA" se va solo para no tapar contenido
  useEffect(() => {
    const id = setTimeout(() => setHint(false), 12000);
    return () => clearTimeout(id);
  }, []);

  const D = VERTICALS[vertical];
  const S = states[vertical];
  const setS = useCallback((fn) => setStates((all) => ({ ...all, [vertical]: fn(all[vertical]) })), [vertical]);

  // Ancho real de la demo → sidebar colapsada / oculta
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const phone = width < 640;
  const isCollapsed = collapsed ?? width < 1000;

  // ── Toasts ────────────────────────────────────────────────────────────
  const toast = useCallback((msg, kind = "ok") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t.slice(-2), { id, msg, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3400);
  }, []);

  const notify = useCallback((n) => setS((s) => ({ ...s, notifs: [{ id: Math.random().toString(36).slice(2), unread: true, when: "recién", ...n }, ...s.notifs] })), [setS]);

  const go = useCallback((v) => {
    setView(v);
    setPlayKey((k) => k + 1);
    setMobileNav(false);
    mainRef.current?.scrollTo?.({ top: 0 });
  }, []);

  // ── API que usan las vistas ───────────────────────────────────────────

  const addLeadRaw = useCallback((s, l, live) => {
    const id = "l" + Math.random().toString(36).slice(2, 7);
    const asset = l.asset || D.assets[0].id;
    const lead = {
      id, email: l.email || `${l.name.split(" ")[0].toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")}@gmail.com`, status: "NEW", temp: live ? "hot" : "mid",
      date: "25/09/2026", sla: { live: true, min: 0, at: Date.now() }, asset, fresh: true, ...l,
    };
    const opp = { id: "o" + id, lead: id, stage: D.stages[0], asset, created: "25/09", days: 0, fresh: true };
    return { ...s, leads: [lead, ...s.leads], opps: [opp, ...s.opps] };
  }, [D]);

  const api = useMemo(() => ({
    go, toast,
    openLead: (id) => setLeadOpen(id),
    updateLead: (id, patch) => setS((s) => ({ ...s, leads: s.leads.map((l) => (l.id === id ? { ...l, ...patch } : l)) })),
    whatsapp: (id) => {
      const l = S.leads.find((x) => x.id === id);
      setS((s) => ({
        ...s,
        leads: s.leads.map((x) => (x.id === id && x.status === "NEW" ? { ...x, status: "CONTACTED", sla: { min: Math.floor(slaSeconds(x.sla) / 60) } } : x)),
        opps: s.opps.map((o) => (o.lead === id ? { ...o, contacted: true } : o)),
      }));
      toast(l.status === "NEW" ? `WhatsApp abierto con el mensaje prellenado · ${l.name} pasa a Contactado` : `WhatsApp abierto con ${l.name}`);
    },
    markContacted: (leadId) => {
      setS((s) => ({
        ...s,
        leads: s.leads.map((x) => (x.id === leadId && x.status === "NEW" ? { ...x, status: "CONTACTED", sla: { min: Math.floor(slaSeconds(x.sla) / 60) } } : x)),
        opps: s.opps.map((o) => (o.lead === leadId ? { ...o, contacted: true } : o)),
      }));
      toast("Marcado como contactado: el reloj del primer contacto se detiene");
    },
    addLead: (l) => {
      setS((s) => addLeadRaw(s, l));
      notify({ icon: "inbox", title: "Nuevo lead asignado", body: `${l.name} · asignado a ${l.owner}` });
      toast(`${l.name} cargado y asignado a ${l.owner}`);
    },
    createOpp: (leadId) => {
      const l = S.leads.find((x) => x.id === leadId);
      setS((s) => ({ ...s, opps: [{ id: "o" + Math.random().toString(36).slice(2, 7), lead: leadId, stage: D.stages[0], asset: l.asset, created: "25/09", days: 0, fresh: true }, ...s.opps] }));
      toast(`Se abrió una oportunidad para ${l.name} en Interesado`);
    },
    moveOpp: (id, stage) => setS((s) => ({ ...s, opps: s.opps.map((o) => (o.id === id ? { ...o, stage } : o)) })),
    confirmMove: (id, to, x) => {
      const o = S.opps.find((y) => y.id === id);
      const l = S.leads.find((y) => y.id === o.lead);
      const a = S.assets.find((y) => y.id === o.asset);
      setS((s) => {
        let next = {
          ...s,
          opps: s.opps.map((y) => (y.id === id ? {
            ...y, stage: to, days: 0, moved: "25/09", fresh: true,
            price: x.price ?? y.price, deposit: x.deposit ?? y.deposit, lost: x.lost, visit: x.visit ?? y.visit,
          } : y)),
        };
        const tasks = [];
        if (x.visit) tasks.push({ title: `${to === "VISIT_SCHEDULED" ? "Visita" : "Test drive"} · ${a.short}`, client: l.name, type: "MEETING", prio: "HIGH", day: x.visitDay, time: x.visitTime, auto: true });
        if (x.task) tasks.push({ ...x.task, client: l.name, prio: "MEDIUM" });
        if (tasks.length) {
          next.tasks = [
            ...tasks.map((t) => ({ id: "t" + Math.random().toString(36).slice(2, 7), status: "PENDING", owner: l.owner, fresh: true, ...t })),
            ...s.tasks.map((t) => (t.client === l.name && t.status !== "COMPLETED" && x.task ? { ...t, status: "COMPLETED" } : t)),
          ];
        }
        if (to === "RESERVED") next.assets = s.assets.map((y) => (y.id === a.id && y.status === "Disponible" ? { ...y, status: "Reservado" } : y));
        if (to === "SALE_COMPLETED") {
          next.assets = s.assets.map((y) => (y.id === a.id ? { ...y, status: "Vendido" } : y));
          next.leads = s.leads.map((y) => (y.id === l.id ? { ...y, status: "CUSTOMER" } : y));
          const price = x.price || a.price;
          next.sales = [
            D.key === "inmo"
              ? { id: "s" + id, date: "25/09/2026", op: a.per ? "Alquiler" : "Venta", asset: a.id, title: a.title, agent: l.owner, value: price, commPct: 4, commMonths: 2, splits: [["Oficina", "Oficina", 50], [l.owner, "Agente vendedor", 50]], fresh: true }
              : { id: "s" + id, date: "25/09/2026", asset: a.id, title: a.title, agent: l.owner, plate: a.zone.startsWith("0km") ? "0km" : "—", list: a.price, value: price, cur: a.cur, tradeIn: null, margin: Math.round(price * 0.06), comm: Math.round(price * 0.02), status: "Pendiente de aprobación", fresh: true },
            ...s.sales,
          ];
        }
        return next;
      });
      notify({ icon: "swap", title: "Cambio de etapa de oportunidad", body: `${l.name} · ${STAGE_META[x.from]?.label || ""} → ${STAGE_META[to].label}` });
      if (to === "SALE_COMPLETED") toast(`Venta concretada: ${a.short} ya figura en Ventas`, "sale");
      else if (x.visit) toast(`${to === "VISIT_SCHEDULED" ? "Visita" : "Test drive"} agendado: la tarea quedó en el calendario`);
      else if (x.task) toast(`${l.name} pasó a ${STAGE_META[to].label} · próxima tarea agendada`);
      else toast(`${l.name} pasó a ${STAGE_META[to].label}`);
    },
    addTask: (t) => {
      setS((s) => ({ ...s, tasks: [{ id: "t" + Math.random().toString(36).slice(2, 7), status: "PENDING", owner: t.owner || D.user.name, fresh: true, ...t }, ...s.tasks] }));
      toast(`Tarea creada: ${t.title}`);
    },
    toggleTask: (id) => setS((s) => ({ ...s, tasks: s.tasks.map((t) => (t.id === id ? { ...t, status: t.status === "COMPLETED" ? "PENDING" : "COMPLETED" } : t)) })),
    moveTask: (id, day) => setS((s) => ({ ...s, tasks: s.tasks.map((t) => (t.id === id ? { ...t, day } : t)) })),
    setAssetStatus: (id, st) => { setS((s) => ({ ...s, assets: s.assets.map((a) => (a.id === id ? { ...a, status: st } : a)) })); toast(`Estado actualizado a ${st}`); },
  }), [go, toast, notify, setS, S, D, addLeadRaw]);

  // ── Lead en vivo: una sola vez por rubro, cuando la demo está a la vista ──
  useEffect(() => {
    if (S.liveDone || typeof IntersectionObserver === "undefined") return;
    let timer;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !timer) {
        timer = setTimeout(() => {
          const l = LIVE[vertical];
          setStates((all) => {
            const s = all[vertical];
            if (s.liveDone) return all;
            const withLead = addLeadRaw(s, l, true);
            return { ...all, [vertical]: { ...withLead, liveDone: true, notifs: [{ id: "live", icon: "inbox", title: "Nuevo lead asignado", body: `Lead automático desde Meta Ads · ${l.name}`, when: "recién", unread: true, lead: withLead.leads[0].id }, ...s.notifs] } };
          });
          toast(`Entró un lead de Meta Ads: ${l.name} · asignado a ${l.owner}`, "lead");
        }, 9000);
      }
    }, { threshold: 0.35 });
    if (rootRef.current) io.observe(rootRef.current);
    return () => { io.disconnect(); clearTimeout(timer); };
  }, [vertical, S.liveDone, addLeadRaw, toast]);

  const switchVertical = (v) => {
    if (v === vertical) return;
    setVertical(v);
    setLeadOpen(null);
    setChatOpen(false);
    if (!VERTICALS[v].nav.includes(view) && !["integ", "updates"].includes(view)) setView("inicio");
    setPlayKey((k) => k + 1);
  };

  const unread = S.notifs.filter((n) => n.unread).length;
  const navLabel = (k) => (k === "assets" ? D.asset.label : NAV[k].label);
  const navIcon = (k) => (k === "assets" ? D.asset.icon : NAV[k].icon);
  const effectiveDark = () => (qtheme ? qtheme === "dark" : typeof document !== "undefined" && document.documentElement.getAttribute("data-theme") === "dark");
  const themeClass = qtheme === "dark" ? "qx-dark" : qtheme === "light" ? "qx-light" : "";

  // ── Sidebar ───────────────────────────────────────────────────────────
  const NavBtn = ({ k, badge, dot }) => {
    const active = view === k;
    const small = isCollapsed && !phone;
    return (
      <button
        onClick={() => go(k)}
        title={small ? navLabel(k) : undefined}
        aria-current={active ? "page" : undefined}
        className={`w-full h-9 flex items-center gap-2.5 rounded-lg text-[13px] transition-colors ${small ? "justify-center px-0" : "px-2.5"} ${active ? "q-nav-active" : "q-fg2 hover:bg-[color-mix(in_oklab,var(--q-card)_70%,transparent)]"}`}
      >
        <span className="relative"><Ic n={navIcon(k)} className="w-4 h-4" />{dot && small && <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[var(--q-warning)]" />}</span>
        {!small && <span className="truncate">{navLabel(k)}</span>}
        {!small && badge}
        {!small && dot && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--q-warning)]" />}
      </button>
    );
  };

  const Group = ({ label, children }) => (
    <div className="mt-3 first:mt-0">
      {!(isCollapsed && !phone) && <div className="px-2.5 pb-1 text-[11.5px] font-medium opacity-70">{label}</div>}
      <div className="space-y-0.5">{children}</div>
    </div>
  );

  const sidebar = (
    <aside className={`flex flex-col h-full py-2 ${isCollapsed && !phone ? "w-[56px] px-2" : "w-[212px] px-2.5"} transition-[width] duration-200`}>
      <div className={`flex items-center gap-2 mb-3 ${isCollapsed && !phone ? "justify-center" : "px-1"}`}>
        <span className="w-7 h-7 rounded-md grid place-items-center text-[11px] font-semibold text-white shrink-0" style={{ background: "var(--q-primary)" }}>{D.tenant.initials}</span>
        {!(isCollapsed && !phone) && (
          <span className="min-w-0">
            <span className="block text-[13px] font-medium truncate leading-tight">{D.tenant.name}</span>
            <span className="block text-[11px] opacity-55 leading-tight">Workspace</span>
          </span>
        )}
      </div>
      <nav className="flex-1 overflow-y-auto q-scroll -mx-1 px-1">
        <Group label="Operación">
          {D.nav.map((k) => <NavBtn key={k} k={k} />)}
        </Group>
        <Group label="Administración">
          <NavBtn k="integ" badge={<span className="ml-auto inline-flex items-center gap-1 text-[10.5px] q-mut q-num"><span className="w-1.5 h-1.5 rounded-full bg-[var(--q-warning)]" />{D.integ.connected}/{D.integ.total}</span>} />
        </Group>
        <Group label="Recursos">
          <NavBtn k="updates" dot={UPDATES.some((u) => u.unread)} />
        </Group>
      </nav>
      {!(isCollapsed && !phone) && <div className="text-center text-[12px] opacity-60 py-2">Quasor</div>}
      {!phone && (
        <button onClick={() => setCollapsed(!isCollapsed)} className={`q-btn q-btn-ghost q-btn-icon ${isCollapsed ? "mx-auto" : ""}`} title="Contraer / expandir (Ctrl+B)" aria-label="Contraer o expandir la barra lateral">
          <Ic n={isCollapsed ? "panel" : "panelclose"} className="w-4 h-4" />
        </button>
      )}
    </aside>
  );

  const route = NAV[view].path;

  return (
    <PortalCtx.Provider value={host}>
    <div className="flex flex-col">
      {/* Barra del navegador + selector de rubro (fuera de la app) */}
      <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-line bg-surface-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
          <span className="mono text-[11px] ink-3 ml-3 truncate hidden sm:inline">quasor.app/{route}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="mono text-[10px] ink-3 hidden md:inline">Ver como</span>
          <div className="flex items-center gap-0.5 p-0.5 rounded-md bg-surface border border-line" role="group" aria-label="Cambiar rubro del demo">
            {[["inmo", "Inmobiliaria"], ["auto", "Concesionaria"]].map(([k, lbl]) => (
              <button
                key={k}
                type="button"
                onClick={() => switchVertical(k)}
                aria-pressed={vertical === k}
                className={`mono text-[10px] px-2 py-0.5 rounded transition-colors ${vertical === k ? "text-[var(--accent-on)]" : "ink-3 hover:ink-2"}`}
                style={vertical === k ? { background: "var(--accent)" } : undefined}
              >
                {lbl}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div ref={(el) => { rootRef.current = el; if (el && el !== host) setHost(el); }} className={`qx ${themeClass} @container/app relative h-[620px] md:h-[680px] flex flex-col overflow-hidden`}>
        {/* ── Topbar ───────────────────────────────────────────────── */}
        <header className="h-14 shrink-0 flex items-center gap-2 px-2.5">
          {phone ? (
            <button className="q-btn q-btn-ghost q-btn-icon" onClick={() => setMobileNav(true)} aria-label="Abrir menú"><Ic n="panel" /></button>
          ) : null}
          <div className={`flex items-center ${phone ? "" : isCollapsed ? "w-[40px] justify-center" : "w-[196px] pl-2"} shrink-0`}>
            <span className="text-[19px] font-bold tracking-[-0.04em] leading-none" style={{ color: "var(--q-primary)" }}>{isCollapsed && !phone ? "q." : "quasor"}</span>
          </div>
          <div className="flex-1 flex justify-center min-w-0">
            <button onClick={() => setPalette(true)} className="h-9 w-full max-w-md rounded-lg border px-3 flex items-center gap-2 text-[12.5px] q-mut transition-colors hover:text-[var(--q-fg)]" style={{ background: "color-mix(in oklab, var(--q-card) 60%, transparent)" }}>
              <Ic n="search" className="w-4 h-4" />
              <span className="truncate">Buscar páginas, leads o {D.asset.lower}</span>
              <span className="ml-auto hidden @[640px]/app:inline"><Kbd>Ctrl K</Kbd></span>
            </button>
          </div>
          <button className="q-btn q-btn-ghost q-btn-icon" onClick={() => setQtheme(effectiveDark() ? "light" : "dark")} title="Cambiar tema" aria-label="Cambiar tema de la demo">
            <Ic n={effectiveDark() ? "sun" : "moon"} className="w-4 h-4" />
          </button>
          <div className="relative">
            <button className="q-btn q-btn-ghost q-btn-icon relative" onClick={() => { setBell((b) => !b); setUserMenu(false); }} aria-label={`Notificaciones (${unread} sin leer)`}>
              <Ic n="bell" className="w-[18px] h-[18px]" />
              {unread > 0 && <span className="absolute top-0.5 right-0.5 min-w-4 h-4 px-1 rounded-full text-[9.5px] font-bold text-white grid place-items-center" style={{ background: "var(--q-danger)" }}>{unread}</span>}
            </button>
            {bell && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setBell(false)} />
                <div className="absolute right-0 top-10 z-50 w-[340px] max-w-[calc(100vw-40px)] q-bg-pop border rounded-xl q-pop overflow-hidden" style={{ boxShadow: "var(--q-shadow-lg)" }}>
                  <div className="flex items-center justify-between px-3.5 py-2.5 border-b">
                    <span className="text-[13px] font-semibold">Notificaciones</span>
                    <button className="text-[11.5px] q-pri font-medium" onClick={() => setS((s) => ({ ...s, notifs: s.notifs.map((n) => ({ ...n, unread: false })) }))}>Marcar todo como leído</button>
                  </div>
                  <div className="max-h-[360px] overflow-y-auto q-scroll">
                    {S.notifs.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => { setS((s) => ({ ...s, notifs: s.notifs.map((x) => (x.id === n.id ? { ...x, unread: false } : x)) })); setBell(false); if (n.lead) setLeadOpen(n.lead); }}
                        className="w-full text-left flex items-start gap-2.5 px-3.5 py-2.5 border-b last:border-b-0 hover:bg-[var(--q-muted)] transition-colors"
                        style={n.unread ? { background: "color-mix(in oklab, var(--q-primary) 6%, transparent)" } : undefined}
                      >
                        <span className="w-8 h-8 rounded-full q-bg-muted grid place-items-center shrink-0"><Ic n={n.icon} className="w-3.5 h-3.5" /></span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[12.5px] font-medium">{n.title}</span>
                          <span className="block text-[11.5px] q-mut leading-snug line-clamp-2">{n.body}</span>
                          <span className="block text-[10.5px] q-mut mt-0.5">{n.when}</span>
                        </span>
                        {n.unread && <span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: "var(--q-primary)" }} />}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="relative">
            <button className="flex items-center gap-2 pl-1 pr-1.5 h-9 rounded-lg hover:bg-[var(--q-muted)]" onClick={() => { setUserMenu((u) => !u); setBell(false); }}>
              <span className="hidden @[1100px]/app:inline"><Tint c="#8b5cf6">{D.user.role}</Tint></span>
              <span className="hidden @[1100px]/app:inline text-[12.5px] q-mut">{D.user.name}</span>
              <Avatar name={D.user.name} size={30} />
              <Ic n="chevdown" className="w-3.5 h-3.5 q-mut" />
            </button>
            {userMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setUserMenu(false)} />
                <div className="absolute right-0 top-10 z-50 w-60 q-bg-pop border rounded-xl p-1 q-pop" style={{ boxShadow: "var(--q-shadow-lg)" }}>
                  <div className="px-2.5 py-2 border-b mb-1">
                    <div className="text-[12.5px] font-medium">{D.user.name}</div>
                    <div className="text-[11px] q-mut truncate">{D.user.email}</div>
                  </div>
                  {[["pencil", "Editar perfil"], ["bell", "Preferencias de notificaciones"]].map(([i, l]) => (
                    <button key={l} className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[12.5px] hover:bg-[var(--q-muted)]"><Ic n={i} className="w-3.5 h-3.5" />{l}</button>
                  ))}
                  <div className="px-2.5 pt-2 pb-1 text-[10.5px] q-mut border-t mt-1">Empresa</div>
                  {Object.values(VERTICALS).map((v) => (
                    <button key={v.key} onClick={() => { setUserMenu(false); switchVertical(v.key); }} className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[12.5px] hover:bg-[var(--q-muted)]">
                      <span className="w-3.5 h-3.5 rounded-full border grid place-items-center">{vertical === v.key && <span className="w-2 h-2 rounded-full" style={{ background: "var(--q-primary)" }} />}</span>
                      {v.tenant.name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </header>

        {/* ── Cuerpo: sidebar + panel de contenido ─────────────────── */}
        <div className="flex-1 min-h-0 flex">
          {!phone && sidebar}
          <main ref={mainRef} className="flex-1 min-w-0 q-bg-card md:rounded-tl-xl border-t md:border-l overflow-y-auto q-scroll relative" style={{ scrollbarGutter: "stable" }}>
            <div key={view + vertical + playKey} className={`p-4 @[900px]/app:p-6 q-fade ${view === "pipeline" ? "h-full flex flex-col" : ""}`}>
              {view === "inicio" && <Inicio D={D} go={go} playKey={playKey} />}
              {view === "leads" && <Leads D={D} S={S} api={api} />}
              {view === "assets" && <Assets D={D} S={S} api={api} />}
              {view === "pipeline" && <Pipeline D={D} S={S} api={api} />}
              {view === "tareas" && <Tasks D={D} S={S} api={api} />}
              {view === "ventas" && <Sales D={D} S={S} api={api} />}
              {view === "pedidos" && <Pedidos D={D} api={api} />}
              {view === "tasaciones" && <Tasaciones D={D} api={api} />}
              {view === "presupuestos" && <Presupuestos D={D} api={api} />}
              {view === "permutas" && <Permutas D={D} />}
              {view === "llaves" && <Llaves D={D} api={api} />}
              {view === "objetivos" && <Objetivos D={D} />}
              {view === "integ" && <Integraciones D={D} api={api} />}
              {view === "updates" && <Updates />}
            </div>
          </main>
        </div>

        {/* Sidebar mobile como sheet */}
        {phone && mobileNav && (
          <div className="absolute inset-0 z-40 flex">
            <div className="absolute inset-0 bg-black/45 q-fade" onClick={() => setMobileNav(false)} />
            <div className="relative q-bg-canvas h-full q-pop border-r" style={{ boxShadow: "var(--q-shadow-lg)" }}>{sidebar}</div>
          </div>
        )}

        {/* Ficha del lead */}
        {leadOpen && <LeadDetail D={D} S={S} api={api} id={leadOpen} onClose={() => setLeadOpen(null)} />}

        {/* Buscador ⌘K */}
        {palette && <Palette D={D} S={S} onClose={() => setPalette(false)} go={go} openLead={(id) => setLeadOpen(id)} navLabel={navLabel} navIcon={navIcon} />}

        {/* Quasor IA */}
        <QuasorIA D={D} S={S} api={api} open={chatOpen} setOpen={(o) => { setChatOpen(o); setHint(false); }} hint={hint && !chatOpen && !phone} dismissHint={() => setHint(false)} />

        {/* Toasts */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center gap-2 pointer-events-none w-[min(440px,calc(100%-32px))]">
          {toasts.map((t) => (
            <div key={t.id} className="q-pop q-bg-pop border rounded-xl px-3.5 py-2.5 text-[12.5px] flex items-center gap-2.5 w-full" style={{ boxShadow: "var(--q-shadow-lg)" }}>
              <span style={{ color: t.kind === "error" ? "var(--q-danger)" : t.kind === "lead" ? "var(--q-primary)" : "var(--q-success)" }}>
                <Ic n={t.kind === "error" ? "circlex" : t.kind === "lead" ? "inbox" : t.kind === "sale" ? "trophy" : "circlecheck"} className="w-4 h-4" />
              </span>
              <span className="leading-snug">{t.msg}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
    </PortalCtx.Provider>
  );
};

// ── Buscador (command palette) ───────────────────────────────────────────
const Palette = ({ D, S, onClose, go, openLead, navLabel, navIcon }) => {
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const low = q.toLowerCase();
  const pages = [...D.nav, "integ", "updates"].filter((k) => navLabel(k).toLowerCase().includes(low)).map((k) => ({ kind: "page", k, label: navLabel(k), icon: navIcon(k) }));
  const leads = S.leads.filter((l) => q && l.name.toLowerCase().includes(low)).slice(0, 5).map((l) => ({ kind: "lead", id: l.id, label: l.name, sub: l.src, icon: "user" }));
  const assets = S.assets.filter((a) => q && a.title.toLowerCase().includes(low)).slice(0, 4).map((a) => ({ kind: "asset", label: a.title, sub: a.status, icon: D.asset.icon }));
  const items = [...pages, ...leads, ...assets];
  const pick = (it) => {
    onClose();
    if (it.kind === "page") go(it.k);
    else if (it.kind === "lead") openLead(it.id);
    else go("assets");
  };
  const groups = [["Páginas", pages], ["Leads", leads], [D.asset.label, assets]];
  let n = -1;
  return (
    <div className="absolute inset-0 z-50 flex items-start justify-center pt-16 px-3">
      <div className="absolute inset-0 bg-black/40 q-fade" onClick={onClose} />
      <div className="relative w-full max-w-[520px] q-bg-pop border rounded-2xl q-pop overflow-hidden" style={{ boxShadow: "var(--q-shadow-lg)" }}>
        <div className="flex items-center gap-2 px-3.5 border-b">
          <Ic n="search" className="w-4 h-4 q-mut" />
          <input
            autoFocus
            value={q}
            onChange={(e) => { setQ(e.target.value); setIdx(0); }}
            onKeyDown={(e) => {
              if (e.key === "Escape") onClose();
              if (e.key === "ArrowDown") { e.preventDefault(); setIdx((i) => Math.min(items.length - 1, i + 1)); }
              if (e.key === "ArrowUp") { e.preventDefault(); setIdx((i) => Math.max(0, i - 1)); }
              if (e.key === "Enter" && items[idx]) pick(items[idx]);
            }}
            placeholder={`Buscar páginas, leads o ${D.asset.lower}...`}
            className="flex-1 h-12 bg-transparent outline-none text-[13.5px]"
            aria-label="Buscador"
          />
          <Kbd>Esc</Kbd>
        </div>
        <div className="max-h-[330px] overflow-y-auto q-scroll p-1.5">
          {items.length === 0 && <div className="text-center q-mut text-[12.5px] py-8">Sin resultados para «{q}»</div>}
          {groups.map(([g, list]) => list.length > 0 && (
            <div key={g} className="mb-1">
              <div className="px-2.5 pt-2 pb-1 text-[11px] font-medium q-mut">{g}</div>
              {list.map((it) => {
                n += 1;
                const me = n;
                return (
                  <button key={g + it.label} onMouseEnter={() => setIdx(me)} onClick={() => pick(it)} className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] text-left" style={idx === me ? { background: "var(--q-muted)" } : undefined}>
                    <Ic n={it.icon} className="w-4 h-4 q-mut" />
                    <span className="truncate">{it.label}</span>
                    {it.sub && <span className="ml-auto text-[11px] q-mut shrink-0">{it.sub}</span>}
                  </button>
                );
              })}
            </div>
          ))}
          {!q && <div className="px-2.5 py-2 text-[11px] q-mut">Probá escribir «{S.leads[1].name.split(" ")[0]}» o «{D.key === "inmo" ? "casa" : "hilux"}»</div>}
        </div>
      </div>
    </div>
  );
};

// ── Quasor IA ────────────────────────────────────────────────────────────
const QuasorIA = ({ D, S, api, open, setOpen, hint, dismissHint }) => {
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scRef = useRef(null);
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => { const el = scRef.current; if (el) requestAnimationFrame(() => el.scrollTo({ top: el.scrollHeight })); }, [msgs]);
  useEffect(() => { setMsgs([]); setBusy(false); timers.current.forEach(clearTimeout); }, [D.key]);

  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));
  const patchLast = (fn) => setMsgs((m) => m.map((x, i) => (i === m.length - 1 ? fn(x) : x)));

  // Escribe la respuesta de a poco, con el cursor ▋ como en la app
  const stream = (text, after) => {
    let i = 0;
    const step = () => {
      i = Math.min(text.length, i + 3 + Math.floor(Math.random() * 4));
      patchLast((x) => ({ ...x, text: text.slice(0, i), streaming: i < text.length }));
      if (i < text.length) later(step, 18);
      else { setBusy(false); after?.(); }
    };
    step();
  };

  const hotLead = S.leads.find((l) => l.temp === "hot" && l.status !== "CUSTOMER") || S.leads[0];
  const freshAsset = D.assets.find((a) => a.status === "Disponible");
  const suggestions = [
    { q: "¿Cuántos leads nuevos entraron este mes?" },
    { q: "Cargame un lead nuevo", full: `Cargame un lead nuevo: Julián Pereyra, 223 555-0190, vino por WhatsApp por el ${freshAsset.short}` },
    { q: `Mostrame mi inventario de ${D.asset.lower}` },
    { q: "Recordame hacer un seguimiento mañana", full: `Recordame hacer un seguimiento mañana con ${hotLead.name}` },
  ];

  const run = (s) => {
    if (busy) return;
    const text = s.full || s.q;
    setBusy(true);
    setMsgs((m) => [...m, { role: "user", text }, { role: "ai", text: "", tools: [], streaming: true }]);
    const tool = (label, ms, then) => {
      later(() => patchLast((x) => ({ ...x, tools: [...x.tools, { label, done: false }] })), 250);
      later(() => { patchLast((x) => ({ ...x, tools: x.tools.map((t) => ({ ...t, done: true })) })); then(); }, ms);
    };

    if (s.q === suggestions[0].q) {
      const pending = S.leads.filter((l) => l.status === "NEW");
      const oldest = [...pending].sort((a, b) => b.sla.min - a.sla.min)[0];
      const o = D.origins;
      tool("Consultando leads…", 1100, () => tool("Calculando métricas…", 900, () => stream(
        `En septiembre entraron **${D.kpis[0].value + (S.liveDone ? 1 : 0)} leads nuevos**, un ${String(D.kpis[0].delta).replace(".", ",")}% más que en el período anterior.\n\nLos que más traen:\n- **${o[0][0]}**: ${o[0][1]}\n- **${o[1][0]}**: ${o[1][1]}\n- **${o[2][0]}**: ${o[2][1]}\n\nOjo: hay **${pending.length} sin contactar** ahora${oldest ? `; el que más espera es ${oldest.name} (asignado a ${oldest.owner}).` : "."}`
      )));
    } else if (s.q === suggestions[1].q) {
      const owner = D.agents[2];
      tool("Buscando duplicados…", 1000, () => stream("No está cargado. Esto es lo que voy a crear, ¿confirmás?", () => {
        patchLast((x) => ({
          ...x,
          proposal: {
            title: "Crear lead y oportunidad",
            lines: [["Nombre", "Julián Pereyra"], ["Teléfono", "+54 223 555-0190"], ["Fuente", "WhatsApp"], ["Interés", freshAsset.short], ["Responsable", `${owner} (reparto)`]],
            status: "Pendiente",
            onConfirm: () => api.addLead({ name: "Julián Pereyra", phone: "+54 223 555-0190", src: "WhatsApp", owner, asset: freshAsset.id }),
            done: `Listo. Julián quedó en Leads y en Interesado del pipeline; a ${owner.split(" ")[0]} le llegó el aviso.`,
          },
        }));
      }));
    } else if (s.q === suggestions[2].q) {
      const by = {};
      S.assets.forEach((a) => (by[a.status] = (by[a.status] || 0) + 1));
      const top = S.assets.filter((a) => a.status === "Disponible").slice(0, 3);
      tool("Consultando inventario…", 1200, () => stream(
        `Tenés **${D.assetTotal} ${D.asset.lower}** en inventario: ${D.assetStatus.map(([k, v]) => `${v} ${k.toLowerCase()}${v === 1 ? "" : "s"}`).join(", ")}.\n\nLas que más consultas tienen esta semana:\n${top.map((a) => `- **${a.title}** · ${a.cur === "USD" ? "US$" : "$"} ${a.price.toLocaleString("es-AR")}${a.per || ""}`).join("\n")}\n\n¿Querés que te arme la lista de las que llevan más de 60 días publicadas?`
      ));
    } else if (s.q === suggestions[3].q) {
      tool("Consultando leads…", 900, () => stream(`Te agendo el seguimiento con ${hotLead.name} para mañana. ¿Confirmás?`, () => {
        patchLast((x) => ({
          ...x,
          proposal: {
            title: "Crear tarea",
            lines: [["Título", `Seguimiento a ${hotLead.name}`], ["Tipo", "Seguimiento"], ["Planificada", "sáb 26/09 · 10:00"], ["Asignada a", "Vos"]],
            status: "Pendiente",
            onConfirm: () => api.addTask({ title: `Seguimiento a ${hotLead.name}`, client: hotLead.name, type: "FOLLOW_UP", prio: "HIGH", day: 26, time: "10:00", owner: D.user.name }),
            done: "Agendado. Lo vas a ver en Tareas y, si conectaste Google Calendar, también en tu agenda.",
          },
        }));
      }));
    } else {
      later(() => stream("En esta demo contesto las preguntas de ejemplo de arriba. En tu cuenta, **Quasor IA** consulta y carga tus datos reales: leads, campañas, ventas y tareas. También desde el celular, por Telegram."), 500);
    }
  };

  const decide = (ok) => {
    const last = msgs[msgs.length - 1];
    if (!last?.proposal || last.proposal.status !== "Pendiente") return;
    if (ok) last.proposal.onConfirm();
    patchLast((x) => ({ ...x, proposal: { ...x.proposal, status: ok ? "Confirmada" : "Cancelada" } }));
    if (ok) {
      setBusy(true);
      setMsgs((m) => [...m, { role: "ai", text: "", tools: [], streaming: true }]);
      later(() => stream(last.proposal.done), 350);
    }
  };

  return (
    <>
      {hint && (
        <div className="absolute right-[76px] bottom-8 z-30 q-bg-pop border rounded-xl pl-3 pr-2 py-2 text-[12px] flex items-center gap-2 q-pop max-w-[250px]" style={{ boxShadow: "var(--q-shadow-lg)", animationDelay: "1.2s" }}>
          <span>Probá <b>Quasor IA</b> ✨. Preguntale por tu negocio o pedile que cargue datos.</span>
          <button onClick={dismissHint} className="q-mut shrink-0" aria-label="Cerrar"><Ic n="x" className="w-3.5 h-3.5" /></button>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="absolute right-5 bottom-5 z-30 w-12 h-12 rounded-full grid place-items-center text-white"
        style={{ background: "var(--q-primary)", boxShadow: "0 10px 24px -8px color-mix(in oklab, var(--q-primary) 70%, transparent)" }}
        aria-label={open ? "Cerrar Quasor IA" : "Abrir Quasor IA"}
      >
        {!open && <span className="absolute inset-0 rounded-full q-ping" style={{ background: "color-mix(in oklab, var(--q-primary) 40%, transparent)" }} />}
        <Ic n={open ? "x" : "sparkles"} className="w-5 h-5 relative" />
      </button>
      {open && (
        <div className="absolute right-5 bottom-20 z-40 w-[min(370px,calc(100%-40px))] h-[min(470px,calc(100%-110px))] q-bg-pop border rounded-2xl q-pop flex flex-col overflow-hidden" style={{ boxShadow: "var(--q-shadow-lg)" }}>
          <div className="flex items-center gap-2.5 px-3.5 py-3 border-b">
            <span className="w-8 h-8 rounded-full grid place-items-center text-white" style={{ background: "var(--q-primary)" }}><Ic n="sparkles" className="w-4 h-4" /></span>
            <span className="min-w-0 flex-1">
              <span className="block text-[13px] font-semibold">Quasor IA</span>
              <span className="block text-[11px] q-mut">Consulta y carga datos por vos</span>
            </span>
            <button className="q-btn q-btn-ghost q-btn-icon !w-7 !h-7" title="Nuevo chat" onClick={() => { setMsgs([]); setBusy(false); timers.current.forEach(clearTimeout); }}><Ic n="plus" className="w-4 h-4" /></button>
            <button className="q-btn q-btn-ghost q-btn-icon !w-7 !h-7" title="Historial"><Ic n="history" className="w-4 h-4" /></button>
          </div>
          <div ref={scRef} className="flex-1 overflow-y-auto q-scroll p-3.5 space-y-3">
            {msgs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-2">
                <span className="w-10 h-10 rounded-full grid place-items-center mb-2" style={{ background: "color-mix(in oklab, var(--q-primary) 12%, transparent)", color: "var(--q-primary)" }}><Ic n="sparkles" className="w-5 h-5" /></span>
                <div className="text-[14px] font-semibold">¿En qué te ayudo?</div>
                <div className="text-[12px] q-mut mt-1 mb-4">Preguntame por tus leads, campañas y ventas, o pedime que cargue algo en el CRM.</div>
                <div className="w-full space-y-1.5">
                  {suggestions.map((s) => (
                    <button key={s.q} onClick={() => run(s)} className="w-full text-left text-[12px] rounded-xl border px-3 py-2 hover:border-[var(--q-primary)] hover:bg-[color-mix(in_oklab,var(--q-primary)_5%,transparent)] transition-colors">{s.q}</button>
                  ))}
                </div>
              </div>
            ) : msgs.map((m, i) => m.role === "user" ? (
              <div key={i} className="flex justify-end q-in"><div className="max-w-[85%] rounded-2xl rounded-br-md px-3 py-2 text-[12.5px] text-white" style={{ background: "var(--q-primary)" }}>{m.text}</div></div>
            ) : (
              <div key={i} className="max-w-[92%] space-y-1.5 q-in">
                {m.tools?.map((t, k) => (
                  <div key={k} className="flex items-center gap-1.5 text-[11.5px] q-mut">
                    {t.done ? <span style={{ color: "var(--q-success)" }}><Ic n="check" className="w-3.5 h-3.5" /></span> : <span className="w-3.5 h-3.5 rounded-full border-2 border-[var(--q-border)] border-t-[var(--q-primary)] q-spin" />}
                    {t.label}
                  </div>
                ))}
                {(m.text || (m.streaming && !m.tools?.length)) && (
                  <div className="rounded-2xl rounded-bl-md px-3 py-2 text-[12.5px] leading-relaxed q-bg-muted">
                    <Md text={m.text} />{m.streaming && <span className="q-caret">▋</span>}
                  </div>
                )}
                {m.proposal && (
                  <div className="rounded-xl border p-3 q-bg-card q-pop">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[12.5px] font-semibold">{m.proposal.title}</span>
                      <Tint c={m.proposal.status === "Confirmada" ? "#16a34a" : m.proposal.status === "Cancelada" ? "#71717a" : "#d97706"}>{m.proposal.status}</Tint>
                    </div>
                    {m.proposal.lines.map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-3 text-[11.5px] py-0.5"><span className="q-mut">{k}</span><span className="text-right">{v}</span></div>
                    ))}
                    {m.proposal.status === "Pendiente" && (
                      <div className="flex gap-2 mt-2.5">
                        <button className="q-btn q-btn-out flex-1 !h-8" onClick={() => decide(false)}>Cancelar</button>
                        <button className="q-btn q-btn-pri flex-1 !h-8" onClick={() => decide(true)}>Confirmar</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            {msgs.length > 0 && !busy && msgs[msgs.length - 1].proposal?.status !== "Pendiente" && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {suggestions.filter((s) => !msgs.some((m) => m.role === "user" && m.text === (s.full || s.q))).map((s) => (
                  <button key={s.q} onClick={() => run(s)} className="text-[11px] rounded-full border px-2.5 py-1 q-fg2 hover:border-[var(--q-primary)]">{s.q}</button>
                ))}
              </div>
            )}
          </div>
          <form className="p-2.5 border-t flex items-center gap-2" onSubmit={(e) => { e.preventDefault(); if (!input.trim()) return; const q = input.trim(); setInput(""); run({ q, full: q }); }}>
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Escribí tu mensaje…" className="q-input flex-1 !h-9 !rounded-xl" aria-label="Mensaje para Quasor IA" />
            <button className="q-btn q-btn-pri q-btn-icon !h-9 !w-9 !rounded-xl" aria-label="Enviar" disabled={busy}><Ic n="send" className="w-4 h-4" /></button>
          </form>
        </div>
      )}
    </>
  );
};
