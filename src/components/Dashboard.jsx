import { useState, useEffect, Fragment } from 'react';

// Quasor CRM — réplica interactiva del producto real, con datos de ejemplo.
// Refleja la app actual (v1.1.0): Inicio con widgets, Leads, Propiedades,
// Pipeline de 7 etapas, Tareas, Ventas/comisiones e Integraciones reales.
// Inmobiliaria y nombres son ficticios; los números son representativos.

// ── Agentes ficticios (color por hash del nombre, ver avatarFromName) ──
const A = {
  LF: "Lucía Fernández",
  MR: "Martín Ríos",
  SV: "Sofía Vega",
  DT: "Diego Torres",
  PG: "Paula Gómez",
};

const DEMO_INMO = {
  // ── KPIs (Inicio · período 14–28 jun 2026) ──
  kpis: [
    { key: "leads", value: 128,  label: "Leads nuevos",          delta: 23.4, note: "+24 vs. período anterior" },
    { key: "opps",  value: 64,   label: "Oportunidades activas", delta: 12.5, note: "+7 vs. período anterior" },
    { key: "conv",  value: 18.4, label: "Tasa de conversión",    delta: 2.1, suffix: "%", decimals: 1, note: "+2,1 pp vs. anterior" },
  ],

  // ── Etapas del pipeline (también alimenta las barras de Inicio) ──
  stages: [
    { k: "Interesado",          v: 28, c: "#ff7a59" },
    { k: "Visita agendada",     v: 16, c: "#3c6df0" },
    { k: "Visitó la propiedad", v: 11, c: "#9a56d0" },
    { k: "Reservó",             v: 6,  c: "#d6a51e" },
    { k: "Cierre en curso",     v: 3,  c: "#2fb27d" },
    { k: "Venta concretada",    v: 5,  c: "#1f9d6b" },
    { k: "Perdido",             v: 9,  c: "#e4576b" },
  ],

  // ── Donut: leads por origen (suma 128) ──
  origins: [
    { k: "Meta Ads",     v: 52, c: "#3c6df0" },
    { k: "Tokko Broker", v: 34, c: "#ff7a59" },
    { k: "WhatsApp",     v: 22, c: "#25D366" },
    { k: "Referido",     v: 14, c: "#9a56d0" },
    { k: "Otro",         v: 6,  c: "#9a9689" },
  ],

  // ── Donut: propiedades por estado (suma 142) ──
  propStatus: [
    { k: "Disponible", v: 118, c: "#2fb27d" },
    { k: "Reservado",  v: 24,  c: "#3c6df0" },
  ],

  // ── Serie temporal: leads nuevos vs propiedades visitadas ──
  byDay: [
    { d: "14/06", leads: 8,  visits: 3 },
    { d: "15/06", leads: 11, visits: 4 },
    { d: "16/06", leads: 6,  visits: 2 },
    { d: "17/06", leads: 9,  visits: 4 },
    { d: "18/06", leads: 7,  visits: 3 },
    { d: "19/06", leads: 10, visits: 5 },
    { d: "20/06", leads: 8,  visits: 3 },
    { d: "21/06", leads: 12, visits: 6 },
    { d: "22/06", leads: 9,  visits: 4 },
    { d: "23/06", leads: 14, visits: 6 },
    { d: "24/06", leads: 7,  visits: 3 },
    { d: "25/06", leads: 6,  visits: 2 },
    { d: "26/06", leads: 10, visits: 5 },
    { d: "27/06", leads: 11, visits: 5 },
    { d: "28/06", leads: 9,  visits: 4 },
  ],

  // ── Leads (vista Leads) ──
  leads: [
    { name: "Diego Herrera",   email: "diego.herrera@gmail.com", phone: "+54 223 555-0142", src: "Meta Ads",     status: "Calificado", owner: A.LF, date: "28/06/2026" },
    { name: "Valentina Pedre", email: "valen.pedre@gmail.com",   phone: "+54 223 555-0188", src: "Tokko Broker", status: "Nuevo",      owner: A.MR, date: "28/06/2026" },
    { name: "Santiago López",  email: "slopez@gmail.com",        phone: "+54 223 555-0211", src: "WhatsApp",     status: "Nuevo",      owner: A.SV, date: "28/06/2026" },
    { name: "Carla Benítez",   email: "c.benitez@gmail.com",     phone: "+54 223 555-0309", src: "Meta Ads",     status: "Calificado", owner: A.LF, date: "27/06/2026" },
    { name: "Pablo Iriarte",   email: "piriarte@hotmail.com",    phone: "+54 223 555-0421", src: "Referido",     status: "Cliente",    owner: A.DT, date: "27/06/2026" },
    { name: "Mariana Ávila",   email: "mavila@gmail.com",        phone: "+54 223 555-0533", src: "Tokko Broker", status: "Nuevo",      owner: A.PG, date: "27/06/2026" },
    { name: "Lucas Romano",    email: "lromano@gmail.com",       phone: "+54 223 555-0644", src: "Referido",     status: "Cliente",    owner: A.MR, date: "26/06/2026" },
    { name: "Florencia Díaz",  email: "flor.diaz@gmail.com",     phone: "+54 223 555-0719", src: "WhatsApp",     status: "Calificado", owner: A.SV, date: "26/06/2026" },
  ],

  // ── Propiedades (vista Propiedades) ──
  props: [
    { title: "Departamento en Plaza Colón", price: "US$ 103.500",   zone: "Plaza Colón, Mar del Plata",   type: "Departamento", amb: "2 amb", m2: "50 m²",  op: "Venta",    status: "Disponible", bg: "linear-gradient(135deg, #5b7994, #3d5a72)" },
    { title: "Casa en barrio San Juan",     price: "US$ 200.000",   zone: "San Juan, Mar del Plata",      type: "Casa",         amb: "5 amb", m2: "239 m²", op: "Venta",    status: "Disponible", bg: "linear-gradient(135deg, #6b5847, #4a3d31)" },
    { title: "Departamento · Playa Varese", price: "US$ 250.000",   zone: "Varese, Mar del Plata",        type: "Departamento", amb: "3 amb", m2: "92 m²",  op: "Venta",    status: "Reservado",  bg: "linear-gradient(135deg, #5a6b8c, #39425c)" },
    { title: "Oficina en Terminal Vieja",   price: "US$ 1.800/mes", zone: "Terminal, Mar del Plata",      type: "Oficina",      amb: "0 amb", m2: "186 m²", op: "Alquiler", status: "Disponible", bg: "linear-gradient(135deg, #3a3e44, #1f2226)" },
    { title: "Terreno en Divino Rostro",    price: "US$ 90.000",    zone: "Divino Rostro, Mar del Plata", type: "Terreno",      amb: "0 amb", m2: "480 m²", op: "Venta",    status: "Disponible", bg: "linear-gradient(135deg, #4a5a3d, #2f3a27)" },
    { title: "Departamento · Plaza Mitre",  price: "US$ 800/mes",   zone: "Plaza Mitre, Mar del Plata",   type: "Departamento", amb: "2 amb", m2: "45 m²",  op: "Alquiler", status: "Disponible", bg: "linear-gradient(135deg, #8a6d8c, #5c3f5e)" },
  ],

  // ── Pipeline (vista Pipeline · kanban de 7 columnas) ──
  pipeline: [
    { stage: "Interesado", color: "#ff7a59", count: 28, cards: [
      { who: "Diego Herrera", src: "Meta Ads",     date: "28/06", owner: A.LF, days: "1d" },
      { who: "Mariana Ávila", src: "Tokko Broker", date: "27/06", owner: A.PG, days: "2d" },
    ]},
    { stage: "Visita agendada", color: "#3c6df0", count: 16, cards: [
      { who: "Carla Benítez", src: "Meta Ads", date: "27/06", owner: A.LF, days: "2d", prop: "Depto · Plaza Colón" },
    ]},
    { stage: "Visitó la propiedad", color: "#9a56d0", count: 11, cards: [
      { who: "Santiago López", src: "WhatsApp", date: "26/06", owner: A.SV, days: "3d", prop: "Casa · San Juan" },
    ]},
    { stage: "Reservó", color: "#d6a51e", count: 6, cards: [
      { who: "Valentina Pedre", src: "Tokko Broker", date: "25/06", owner: A.MR, days: "4d", prop: "Depto · Varese", price: "US$ 250.000" },
    ]},
    { stage: "Cierre en curso", color: "#2fb27d", count: 3, cards: [
      { who: "Lucas Romano", src: "Referido", date: "24/06", owner: A.MR, days: "5d", prop: "Casa · San Juan", price: "US$ 200.000" },
    ]},
    { stage: "Venta concretada", color: "#1f9d6b", count: 5, cards: [
      { who: "Pablo Iriarte", src: "Referido", date: "23/06", owner: A.DT, prop: "Depto · Plaza Colón", price: "US$ 103.500" },
    ]},
    { stage: "Perdido", color: "#e4576b", count: 9, cards: [
      { who: "Florencia Díaz", src: "Meta Ads", date: "22/06", owner: A.SV },
    ]},
  ],

  // ── Tareas (vista Tareas) ──
  tasks: [
    { title: "Llamar a Diego Herrera · depto Plaza Colón", type: "Llamado",     prio: "Alta",  due: "Hoy",   owner: A.LF },
    { title: "Enviar tasación a Mariana Ávila",            type: "Email",       prio: "Media", due: "29/06", owner: A.PG },
    { title: "Coordinar visita · Casa San Juan",           type: "Visita",      prio: "Alta",  due: "30/06", owner: A.SV },
    { title: "Seguimiento de reserva · Valentina Pedre",   type: "Seguimiento", prio: "Media", due: "01/07", owner: A.MR },
    { title: "Firma de boleto · Lucas Romano",             type: "Seguimiento", prio: "Alta",  due: "27/06", owner: A.MR, overdue: true },
    { title: "Subir fotos nuevas · Depto Varese",          type: "Otro",        prio: "Baja",  due: "02/07", owner: A.DT, done: true },
  ],

  // ── Ventas / comisiones (vista Ventas) ──
  sales: [
    { date: "27/06/2026", op: "Venta",    prop: "Casa en barrio San Juan",     agent: A.DT, value: "US$ 200.000", gross: "US$ 8.000",  grossNote: "4%",      office: "US$ 4.000" },
    { date: "25/06/2026", op: "Venta",    prop: "Departamento · Plaza Colón",  agent: A.LF, value: "US$ 103.500", gross: "US$ 4.140",  grossNote: "4%",      office: "US$ 2.070" },
    { date: "23/06/2026", op: "Alquiler", prop: "Depto 2 amb frente al mar",   agent: A.MR, value: "US$ 1.200",   gross: "US$ 2.400",  grossNote: "2 meses", office: "US$ 480" },
    { date: "21/06/2026", op: "Venta",    prop: "Departamento · Playa Varese", agent: A.SV, value: "US$ 250.000", gross: "US$ 10.000", grossNote: "4%",      office: "US$ 5.000" },
  ],
  salesTotals: { gross: "US$ 24.540", office: "US$ 11.550" },
};

// ── Concesionaria (vista AUTOMOTIVE) — datos basados en el seed real del producto ──
const AUTO_A = {
  FA: "Fernando Acosta",
  DR: "Diego Ramírez",
  CH: "Camila Herrera",
};

const DEMO_AUTO = {
  kpis: [
    { key: "leads", value: 96,   label: "Leads nuevos",          delta: 18.2, note: "+15 vs. período anterior" },
    { key: "opps",  value: 41,   label: "Oportunidades activas", delta: 9.8,  note: "+4 vs. período anterior" },
    { key: "conv",  value: 13.3, label: "Tasa de conversión",    delta: 1.4, suffix: "%", decimals: 1, note: "+1,4 pp vs. anterior" },
  ],
  stages: [
    { k: "Interesado",          v: 22, c: "#ff7a59" },
    { k: "Test drive agendado", v: 12, c: "#3c6df0" },
    { k: "Realizó test drive",  v: 8,  c: "#9a56d0" },
    { k: "Hizo una oferta",     v: 5,  c: "#d6a51e" },
    { k: "Reservó",             v: 4,  c: "#2fb27d" },
    { k: "Venta concretada",    v: 4,  c: "#1f9d6b" },
    { k: "Perdido",             v: 7,  c: "#e4576b" },
  ],
  origins: [
    { k: "Meta Ads",   v: 38, c: "#3c6df0" },
    { k: "Google Ads", v: 27, c: "#ff7a59" },
    { k: "WhatsApp",   v: 18, c: "#25D366" },
    { k: "Referido",   v: 9,  c: "#9a56d0" },
    { k: "Otro",       v: 4,  c: "#9a9689" },
  ],
  propStatus: [
    { k: "Disponible", v: 31, c: "#2fb27d" },
    { k: "Reservado",  v: 6,  c: "#3c6df0" },
  ],
  byDay: [
    { d: "14/06", leads: 6,  visits: 2 },
    { d: "15/06", leads: 8,  visits: 3 },
    { d: "16/06", leads: 5,  visits: 2 },
    { d: "17/06", leads: 7,  visits: 3 },
    { d: "18/06", leads: 6,  visits: 2 },
    { d: "19/06", leads: 9,  visits: 4 },
    { d: "20/06", leads: 6,  visits: 2 },
    { d: "21/06", leads: 8,  visits: 3 },
    { d: "22/06", leads: 7,  visits: 3 },
    { d: "23/06", leads: 10, visits: 4 },
    { d: "24/06", leads: 6,  visits: 2 },
    { d: "25/06", leads: 5,  visits: 2 },
    { d: "26/06", leads: 8,  visits: 3 },
    { d: "27/06", leads: 7,  visits: 3 },
    { d: "28/06", leads: 6,  visits: 2 },
  ],
  leads: [
    { name: "Pablo Suárez",    email: "pablo.suarez@gmail.com", phone: "+54 223 555-0142", src: "Meta Ads",   status: "Calificado", owner: AUTO_A.FA, date: "28/06/2026" },
    { name: "Julieta Navarro", email: "juli.navarro@gmail.com", phone: "+54 223 555-0188", src: "Google Ads", status: "Nuevo",      owner: AUTO_A.DR, date: "28/06/2026" },
    { name: "Marcos Quiroga",  email: "mquiroga@gmail.com",     phone: "+54 223 555-0211", src: "WhatsApp",   status: "Nuevo",      owner: AUTO_A.CH, date: "28/06/2026" },
    { name: "Daniela Sosa",    email: "d.sosa@gmail.com",       phone: "+54 223 555-0309", src: "Meta Ads",   status: "Calificado", owner: AUTO_A.FA, date: "27/06/2026" },
    { name: "Hernán Vidal",    email: "hvidal@hotmail.com",     phone: "+54 223 555-0421", src: "Referido",   status: "Cliente",    owner: AUTO_A.DR, date: "27/06/2026" },
    { name: "Rocío Méndez",    email: "rocio.mendez@gmail.com", phone: "+54 223 555-0533", src: "Google Ads", status: "Nuevo",      owner: AUTO_A.CH, date: "27/06/2026" },
    { name: "Gastón Pérez",    email: "gaston.perez@gmail.com", phone: "+54 223 555-0644", src: "Referido",   status: "Cliente",    owner: AUTO_A.FA, date: "26/06/2026" },
    { name: "Belén Acosta",    email: "belen.acosta@gmail.com", phone: "+54 223 555-0719", src: "WhatsApp",   status: "Calificado", owner: AUTO_A.DR, date: "26/06/2026" },
  ],
  props: [
    { title: "Toyota Hilux SRV 2.8 TDI 4x4 AT",  price: "US$ 42.000",  zone: "Usados · Mar del Plata", meta: ["Pickup", "2023", "35.000 km", "Diésel"],   op: "Venta", status: "Disponible", bg: "linear-gradient(135deg, #4a5568, #2d3748)" },
    { title: "Toyota Corolla Cross SEG HEV",     price: "US$ 38.500",  zone: "Usados · Mar del Plata", meta: ["SUV", "2024", "8.000 km", "Híbrido"],      op: "Venta", status: "Disponible", bg: "linear-gradient(135deg, #5b7994, #3d5a72)" },
    { title: "VW Amarok V6 Extreme 3.0 TDI",     price: "US$ 52.000",  zone: "Usados · Mar del Plata", meta: ["Pickup", "2022", "45.000 km", "Diésel"],   op: "Venta", status: "Reservado",  bg: "linear-gradient(135deg, #3a3e44, #1f2226)" },
    { title: "Fiat Cronos Drive 1.3 GSE",        price: "US$ 12.500",  zone: "Usados · Mar del Plata", meta: ["Sedán", "2021", "62.000 km", "Nafta"],     op: "Venta", status: "Disponible", bg: "linear-gradient(135deg, #6b5847, #4a3d31)" },
    { title: "VW Gol Trend 1.6 MSI Comfortline", price: "$ 8.500.000", zone: "Usados · Mar del Plata", meta: ["Hatchback", "2019", "98.000 km", "GNC"],   op: "Venta", status: "Disponible", bg: "linear-gradient(135deg, #4a5a3d, #2f3a27)" },
    { title: "Peugeot 208 Feline 1.6 Tiptronic", price: "US$ 16.500",  zone: "Usados · Mar del Plata", meta: ["Hatchback", "2022", "29.000 km", "Nafta"], op: "Venta", status: "Disponible", bg: "linear-gradient(135deg, #8a6d8c, #5c3f5e)" },
  ],
  pipeline: [
    { stage: "Interesado", color: "#ff7a59", count: 22, cards: [
      { who: "Pablo Suárez", src: "Meta Ads",   date: "28/06", owner: AUTO_A.FA, days: "1d" },
      { who: "Rocío Méndez", src: "Google Ads", date: "27/06", owner: AUTO_A.CH, days: "2d" },
    ]},
    { stage: "Test drive agendado", color: "#3c6df0", count: 12, cards: [
      { who: "Daniela Sosa", src: "Meta Ads", date: "27/06", owner: AUTO_A.FA, days: "2d", prop: "Corolla Cross HEV" },
    ]},
    { stage: "Realizó test drive", color: "#9a56d0", count: 8, cards: [
      { who: "Marcos Quiroga", src: "WhatsApp", date: "26/06", owner: AUTO_A.CH, days: "3d", prop: "Hilux SRV 4x4" },
    ]},
    { stage: "Hizo una oferta", color: "#d6a51e", count: 5, cards: [
      { who: "Julieta Navarro", src: "Google Ads", date: "25/06", owner: AUTO_A.DR, days: "4d", prop: "Amarok V6", price: "US$ 52.000" },
    ]},
    { stage: "Reservó", color: "#2fb27d", count: 4, cards: [
      { who: "Hernán Vidal", src: "Referido", date: "24/06", owner: AUTO_A.DR, days: "5d", prop: "Fiat Cronos", price: "US$ 12.500" },
    ]},
    { stage: "Venta concretada", color: "#1f9d6b", count: 4, cards: [
      { who: "Gastón Pérez", src: "Referido", date: "23/06", owner: AUTO_A.FA, prop: "Peugeot 208 Feline", price: "US$ 16.500" },
    ]},
    { stage: "Perdido", color: "#e4576b", count: 7, cards: [
      { who: "Belén Acosta", src: "WhatsApp", date: "22/06", owner: AUTO_A.DR },
    ]},
  ],
  tasks: [
    { title: "Llamar a Pablo Suárez · Hilux SRV",      type: "Llamado",     prio: "Alta",  due: "Hoy",   owner: AUTO_A.FA },
    { title: "Enviar cotización a Julieta Navarro",    type: "Email",       prio: "Media", due: "29/06", owner: AUTO_A.DR },
    { title: "Coordinar test drive · Corolla Cross",   type: "Visita",      prio: "Alta",  due: "30/06", owner: AUTO_A.CH },
    { title: "Seguimiento de oferta · Marcos Quiroga", type: "Seguimiento", prio: "Media", due: "01/07", owner: AUTO_A.CH },
    { title: "Transferencia y patente · Hernán Vidal", type: "Seguimiento", prio: "Alta",  due: "27/06", owner: AUTO_A.DR, overdue: true },
    { title: "Subir fotos nuevas · Peugeot 208",       type: "Otro",        prio: "Baja",  due: "02/07", owner: AUTO_A.FA, done: true },
  ],
  sales: [
    { date: "27/06/2026", op: "Venta", prop: "Toyota Hilux SRV 4x4", agent: AUTO_A.FA, value: "US$ 42.000", gross: "US$ 1.680", grossNote: "4%", office: "US$ 840" },
    { date: "25/06/2026", op: "Venta", prop: "Fiat Cronos Drive 1.3", agent: AUTO_A.DR, value: "US$ 12.500", gross: "US$ 500",   grossNote: "4%", office: "US$ 250" },
    { date: "23/06/2026", op: "Venta", prop: "Peugeot 208 Feline",   agent: AUTO_A.FA, value: "US$ 16.500", gross: "US$ 660",   grossNote: "4%", office: "US$ 330" },
    { date: "20/06/2026", op: "Venta", prop: "Corolla Cross HEV",    agent: AUTO_A.CH, value: "US$ 38.500", gross: "US$ 1.540", grossNote: "4%", office: "US$ 770" },
  ],
  salesTotals: { gross: "US$ 4.380", office: "US$ 2.190" },
};

const useCountUp = (target, duration = 1200, deps = []) => {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setV(target);
      return;
    }
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

const NavItem = ({ icon, label, active, badge, onClick }) => (
  <button
    onClick={onClick}
    title={label}
    aria-label={label}
    className={`w-full flex items-center gap-2.5 justify-center @[540px]/dash:justify-start px-2 @[540px]/dash:px-3 py-2 rounded-md text-sm transition ${active ? "bg-[color-mix(in_oklab,var(--accent)_14%,var(--bg))] accent font-medium" : "ink-2 hover:bg-surface-2"}`}
  >
    <span className="w-4 h-4 shrink-0">{icon}</span>
    <span className="hidden @[540px]/dash:inline">{label}</span>
    {badge && (
      <span className="hidden @[540px]/dash:inline ml-auto mono text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: "color-mix(in oklab, var(--accent) 16%, var(--bg))", color: "var(--accent)" }}>
        {badge}
      </span>
    )}
  </button>
);

const Icon = {
  home: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="10" width="8" height="8"/><rect x="13" y="10" width="8" height="8"/><rect x="3" y="4" width="8" height="4"/><rect x="13" y="4" width="8" height="4"/></svg>,
  leads: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="7" r="2"/><path d="M15 15h6"/></svg>,
  props: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 10 12 3l9 7v10a2 2 0 0 1-2 2h-4v-6h-6v6H5a2 2 0 0 1-2-2V10Z"/></svg>,
  pipe: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="4" height="16"/><rect x="10" y="4" width="4" height="10"/><rect x="17" y="4" width="4" height="14"/></svg>,
  tasks: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M10 6h11M10 12h11M10 18h11"/><path d="M3 6l1.4 1.4L7 5"/><path d="M3 12l1.4 1.4L7 11"/><path d="M3 18l1.4 1.4L7 17"/></svg>,
  sales: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2.5" y="6" width="19" height="12" rx="2"/><circle cx="12" cy="12" r="2.4"/><path d="M6 12h.01M18 12h.01"/></svg>,
  plug: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.2 16.2l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.2 7.7l2.8-2.8"/></svg>,
  refresh: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/></svg>,
  cal: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></svg>,
  bell: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>,
  sun: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19"/></svg>,
  pin: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>,
  users: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="3.5"/><path d="M5 20c0-3.5 3-6.5 7-6.5s7 3 7 6.5"/></svg>,
  target: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></svg>,
  trend: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 17 9 11l4 4 8-8"/><path d="M14 4h7v7"/></svg>,
  car: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 11l1.6-4.2A2 2 0 0 1 8.5 5.5h7a2 2 0 0 1 1.9 1.3L19 11"/><path d="M3 11h18v5h-2.5M3 11v5h2.5M8.5 16h7"/><circle cx="6.5" cy="16.5" r="1.5"/><circle cx="17.5" cy="16.5" r="1.5"/></svg>,
};

const kpiIcon = { leads: Icon.users, opps: Icon.target, conv: Icon.trend };

// Config por vertical — espeja useIndustryConfig() de la app real (REAL_ESTATE / AUTOMOTIVE).
const IC = {
  inmo: {
    subtitle: "Inmobiliaria Demo",
    assetLabel: "Propiedades",
    assetSingular: "Propiedad",
    assetIcon: Icon.props,
    assetTotal: "142",
    assetCountLabel: "142 propiedades",
    assetStatusTitle: "Propiedades por estado",
    assetSearch: "Buscar propiedades...",
    assetChips: ["Estado: Todos", "Operación: Todas", "Tipo: Todos", "Zona: Todas"],
    assetNew: "+ Nueva",
    assetHasSync: true,
    assetSyncNote: "Tokko actualizado: hace 2h",
    salesSearch: "Buscar por propiedad o nota...",
    salesAssetCol: "Propiedad",
    trendTitle: "Leads nuevos y propiedades visitadas",
    trendLegend2: "Propiedades visitadas",
    leadsTotal: "128",
    headerUser: { name: "Carolina Méndez", initials: "CM" },
    integConnected: "2 de 4 conectadas",
    integBadge: "2/4",
    hasTokko: true,
  },
  auto: {
    subtitle: "Concesionaria Demo",
    assetLabel: "Automóviles",
    assetSingular: "Automóvil",
    assetIcon: Icon.car,
    assetTotal: "37",
    assetCountLabel: "37 automóviles",
    assetStatusTitle: "Vehículos por estado",
    assetSearch: "Buscar automóviles...",
    assetChips: ["Estado: Todos", "Marca: Todas", "Combustible: Todos", "Año: Todos"],
    assetNew: "+ Nuevo",
    assetHasSync: false,
    assetSyncNote: null,
    salesSearch: "Buscar por vehículo o nota...",
    salesAssetCol: "Vehículo",
    trendTitle: "Leads nuevos y test drives",
    trendLegend2: "Test drives",
    leadsTotal: "96",
    headerUser: { name: "Fernando Acosta", initials: "FA" },
    integConnected: "2 de 3 conectadas",
    integBadge: "2/3",
    hasTokko: false,
  },
};

const KPI = ({ icon, value, label, delta, note, prefix = "", suffix = "", decimals = 0 }) => {
  const v = useCountUp(value, 1400, [value]);
  const positive = delta >= 0;
  return (
    <div className="bg-surface border border-line rounded-xl p-3 @[760px]/dash:p-4 hover:border-[var(--accent)] transition-colors min-w-0">
      <div className="flex items-center justify-between mb-2 @[760px]/dash:mb-3">
        <div className="w-7 h-7 @[760px]/dash:w-9 @[760px]/dash:h-9 rounded-lg grid place-items-center shrink-0" style={{ background: "color-mix(in oklab, var(--accent) 12%, var(--bg))", color: "var(--accent)" }}>
          {icon}
        </div>
        <span className={`mono text-[10px] @[760px]/dash:text-[11px] tabular-nums ${positive ? "text-[var(--pos)]" : "text-[var(--neg)]"}`}>
          {positive ? "↗" : "↘"} {Math.abs(delta).toFixed(1)}%
        </span>
      </div>
      <div className="flex items-baseline gap-1 min-w-0">
        <span className="text-xl @[760px]/dash:text-2xl @[1040px]/dash:text-3xl font-semibold num ink truncate">{prefix}{fmt(v, decimals)}{suffix}</span>
      </div>
      <div className="text-[10px] @[760px]/dash:text-[13px] @[900px]/dash:text-sm ink-2 mt-0.5 leading-tight">{label}</div>
      <div className="mono text-[10px] @[760px]/dash:text-[11px] ink-3 mt-1 truncate">{note}</div>
    </div>
  );
};

// Editorial donut — animated fade-in segments + center figure + legend.
const Donut = ({ segments, centerValue, centerLabel, size = 116 }) => {
  const total = segments.reduce((s, x) => s + x.v, 0) || 1;
  const r = size / 2 - 9;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="flex items-center gap-3 @[760px]/dash:gap-4">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg viewBox={`0 0 ${size} ${size}`} style={{ width: size, height: size }}>
          <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line)" strokeWidth="11" />
            {segments.map((s, i) => {
              const len = (s.v / total) * c;
              const el = (
                <circle
                  key={i} cx={size / 2} cy={size / 2} r={r} fill="none"
                  stroke={s.c} strokeWidth="11" strokeLinecap="butt"
                  strokeDasharray={`${len.toFixed(2)} ${(c - len).toFixed(2)}`}
                  strokeDashoffset={(-offset).toFixed(2)}
                  style={{ opacity: 0, animation: `donutIn .5s ${0.15 + i * 0.1}s forwards` }}
                />
              );
              offset += len;
              return el;
            })}
          </g>
        </svg>
        <div className="absolute inset-0 grid place-items-center text-center">
          <div>
            <div className="text-xl @[900px]/dash:text-2xl font-semibold num leading-none">{centerValue}</div>
            <div className="mono text-[9px] uppercase tracking-wider ink-3 mt-0.5">{centerLabel}</div>
          </div>
        </div>
      </div>
      <div className="min-w-0 space-y-1.5 flex-1">
        {segments.map((s) => (
          <div key={s.k} className="flex items-center gap-2 text-[11px]">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: s.c }} />
            <span className="ink-2 truncate">{s.k}</span>
            <span className="mono tabular-nums ink-3 ml-auto pl-2">{s.v}</span>
          </div>
        ))}
      </div>
      <style>{`@keyframes donutIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
    </div>
  );
};

// Dual-series area chart: leads nuevos (accent) + propiedades visitadas (blue).
const TrendChart = ({ data, playKey }) => {
  const w = 560, h = 168, pad = { t: 16, r: 10, b: 26, l: 26 };
  const max = Math.max(...data.map(d => d.leads));
  const xs = (i) => pad.l + (i / (data.length - 1)) * (w - pad.l - pad.r);
  const ys = (v) => h - pad.b - (v / max) * (h - pad.t - pad.b);
  const linePath = (key) => data.map((d, i) => (i === 0 ? "M" : "L") + xs(i).toFixed(1) + "," + ys(d[key]).toFixed(1)).join(" ");
  const areaPath = (key) => linePath(key) + ` L ${xs(data.length - 1).toFixed(1)},${h - pad.b} L ${xs(0).toFixed(1)},${h - pad.b} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[168px]" key={playKey}>
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
      {[0, 0.5, 1].map((p, i) => (
        <line key={i} x1={pad.l} x2={w - pad.r} y1={pad.t + p * (h - pad.t - pad.b)} y2={pad.t + p * (h - pad.t - pad.b)} stroke="var(--line)" strokeDasharray="2 3"/>
      ))}
      {[0, 0.5, 1].map((p, i) => (
        <text key={i} x={pad.l - 6} y={pad.t + 4 + p * (h - pad.t - pad.b)} fontSize="9" fill="var(--ink-3)" textAnchor="end" fontFamily="JetBrains Mono, monospace">{Math.round(max * (1 - p))}</text>
      ))}
      {data.map((d, i) => i % 3 === 0 && (
        <text key={i} x={xs(i)} y={h - 8} fontSize="9" fill="var(--ink-3)" textAnchor="middle" fontFamily="JetBrains Mono, monospace">{d.d}</text>
      ))}
      <path d={areaPath("leads")} fill="url(#areaOrange)" style={{ animation: "drawFade .9s cubic-bezier(.2,.7,.2,1)" }} />
      <path d={linePath("leads")} fill="none" stroke="var(--accent)" strokeWidth="1.8" style={{ strokeDasharray: 2000, strokeDashoffset: 2000, animation: "draw 1.4s cubic-bezier(.2,.7,.2,1) forwards" }} />
      <path d={areaPath("visits")} fill="url(#areaBlue)" style={{ animation: "drawFade 1.1s cubic-bezier(.2,.7,.2,1)" }} />
      <path d={linePath("visits")} fill="none" stroke="#3c6df0" strokeWidth="1.5" style={{ strokeDasharray: 2000, strokeDashoffset: 2000, animation: "draw 1.6s .2s cubic-bezier(.2,.7,.2,1) forwards" }} />
      {data.map((d, i) => (
        <circle key={"t" + i} cx={xs(i)} cy={ys(d.leads)} r="2.4" fill="var(--accent)" style={{ opacity: 0, animation: `fadeInDot .3s ${0.6 + i * 0.03}s forwards` }} />
      ))}
      <style>{`
        @keyframes draw { to { stroke-dashoffset: 0; } }
        @keyframes fadeInDot { to { opacity: 1; } }
        @keyframes drawFade { from { opacity: 0; } }
      `}</style>
    </svg>
  );
};

// Horizontal stage bars — "Pipeline de oportunidades" widget.
const StageBars = ({ data, playKey }) => {
  const max = Math.max(...data.map(d => d.v));
  return (
    <div className="space-y-2" key={playKey}>
      {data.map((d, i) => (
        <div key={d.k} className="grid grid-cols-[112px_1fr_24px] items-center gap-3">
          <span className="text-[11px] ink-2 text-right leading-tight truncate">{d.k}</span>
          <div className="h-5 bg-surface-2 rounded-sm overflow-hidden">
            <div className="h-full rounded-sm" style={{
              width: (d.v / max * 100) + "%",
              background: d.c,
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

const Panel = ({ title, subtitle, children, center = false, className = "" }) => (
  <div className={`bg-surface border border-line rounded-xl p-4 flex flex-col ${className}`}>
    <div className="flex items-start justify-between gap-2 shrink-0">
      <div className="min-w-0">
        <div className="text-sm font-medium truncate">{title}</div>
        {subtitle && <div className="text-xs ink-3 truncate">{subtitle}</div>}
      </div>
      <span className="ink-3 mono text-xs shrink-0" aria-hidden="true">⋮</span>
    </div>
    {/* `center` vertically centers the body in the leftover space so short
        widgets (e.g. a 2-segment donut) sit equidistant from the title and the
        panel bottom instead of pinned under the title. The header carries no
        bottom margin so the centering region is symmetric; non-centered panels
        get the title→content gap back via mt-3. */}
    <div className={center ? "flex-1 flex flex-col justify-center" : "mt-3"}>{children}</div>
  </div>
);

const ViewInicio = ({ data, ic, playKey }) => (
  <div className="p-4 @[760px]/dash:p-5 space-y-3.5">
    {/* Toolbar — tabs + ad spend + period + add widget */}
    <div className="flex items-center justify-between gap-2 flex-wrap">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-surface-2 border border-line">
          <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-surface accent">General</span>
          <span className="px-2.5 py-1 rounded-md text-xs ink-3">Ads</span>
        </div>
        <span className="mono text-[10px] px-2 py-1 rounded-md tabular-nums" style={{ background: "color-mix(in oklab, var(--pos) 12%, var(--bg))", color: "var(--pos)" }}>$ USD 1.500</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="hidden @[600px]/dash:flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-line text-[11px] ink-2 mono">
          <span className="w-3.5 h-3.5">{Icon.cal}</span>
          <span>14 – 28 jun 2026</span>
        </div>
        <span className="hidden @[760px]/dash:inline px-2.5 py-1.5 rounded-md text-xs font-medium bg-accent text-white">+ Agregar widget</span>
        <button aria-label="Refrescar datos" title="Refrescar" className="w-7 h-7 rounded-md grid place-items-center ink-3 hover:bg-surface-2 hover:ink-2 transition-colors"><span className="w-3.5 h-3.5">{Icon.refresh}</span></button>
      </div>
    </div>

    {/* KPI row */}
    <div className="grid grid-cols-1 @[540px]/dash:grid-cols-3 gap-3">
      {data.kpis.map((k) => (
        <KPI key={k.key} icon={kpiIcon[k.key]} value={k.value} label={k.label} delta={k.delta} note={k.note} suffix={k.suffix} decimals={k.decimals} />
      ))}
    </div>

    {/* Charts row 1 — trend + origin donut */}
    <div className="grid @[540px]/dash:grid-cols-[1.45fr_1fr] gap-3">
      <Panel title={ic.trendTitle} subtitle="Últimos 14 días">
        <TrendChart data={data.byDay} playKey={playKey} />
        <div className="flex items-center justify-center gap-4 text-[11px] ink-2 mt-1">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-accent"/> Leads nuevos</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#3c6df0]"/> {ic.trendLegend2}</span>
        </div>
      </Panel>
      <Panel title="Leads por origen" subtitle="Atribución de cada lead" center>
        <Donut segments={data.origins} centerValue={ic.leadsTotal} centerLabel="Leads" />
      </Panel>
    </div>

    {/* Charts row 2 — pipeline bars + property status donut */}
    <div className="grid @[540px]/dash:grid-cols-[1.45fr_1fr] gap-3">
      <Panel title="Pipeline de oportunidades" subtitle="Distribución por etapa">
        <StageBars data={data.stages} playKey={playKey} />
      </Panel>
      <Panel title={ic.assetStatusTitle} subtitle="Inventario activo" center>
        <Donut segments={data.propStatus} centerValue={ic.assetTotal} centerLabel="Activos" />
      </Panel>
    </div>
  </div>
);

const srcPill = (s) => {
  const map = {
    "Meta Ads":     "bg-[color-mix(in_oklab,#3c6df0_15%,var(--bg))] text-[#3c6df0]",
    "Google Ads":   "bg-[color-mix(in_oklab,#ff7a59_14%,var(--bg))] accent",
    "Tokko Broker": "bg-[color-mix(in_oklab,#ff7a59_14%,var(--bg))] accent",
    "WhatsApp":     "bg-[color-mix(in_oklab,#25D366_16%,var(--bg))] text-[#1f9d54]",
    "Referido":     "bg-[color-mix(in_oklab,#9a56d0_16%,var(--bg))] text-[#9a56d0]",
  };
  return map[s] || "bg-surface-2 ink-2";
};

// Estado del lead → pill colors (Nuevo / Calificado / Cliente).
const statusPill = (s) => {
  const map = {
    "Nuevo":      { dot: "#9a9689", className: "bg-surface-2 ink-2" },
    "Calificado": { dot: "#d6a51e", className: "bg-[color-mix(in_oklab,#d6a51e_16%,var(--bg))] text-[#b88a1b]" },
    "Cliente":    { dot: "#2fb27d", className: "bg-[color-mix(in_oklab,#2fb27d_15%,var(--bg))] text-[#2fb27d]" },
  };
  return map[s] || map["Nuevo"];
};

// Avatar from name initials, color-tinted by hash.
const avatarFromName = (name) => {
  const parts = name.split(" ").filter(Boolean);
  const initials = (parts[0]?.[0] || "?") + (parts[1]?.[0] || "");
  const palette = ["#3c6df0", "#9a56d0", "#2fb27d", "#d6a51e", "#ff7a59", "#e4405f"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) | 0;
  const color = palette[Math.abs(hash) % palette.length];
  return { initials: initials.toUpperCase(), color };
};

const FilterChips = ({ search, chips }) => (
  <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
    <div className="flex items-center gap-1.5 px-3 py-1.5 border border-line rounded-full text-xs ink-3 bg-surface shrink-0">
      🔍 <span>{search}</span>
    </div>
    {chips.map(f => (
      <button key={f} className="px-3 py-1.5 border border-line rounded-full text-xs ink-2 hover:bg-surface-2 shrink-0 mono">
        {f} <span className="ink-3 ml-1">▾</span>
      </button>
    ))}
  </div>
);

const ViewLeads = ({ data, ic }) => (
  <div className="p-4 @[760px]/dash:p-5">
    {/* Top bar: stats + actions */}
    <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
      <div className="flex items-center gap-2 text-xs ink-3">
        <span className="mono">{ic.leadsTotal} leads · período actual</span>
        <span className="w-1 h-1 rounded-full bg-[var(--ink-3)]" />
        <span className="mono">8 nuevos hoy</span>
      </div>
      <div className="flex items-center gap-2">
        <button aria-label="Refrescar datos" title="Refrescar" className="w-7 h-7 rounded-md grid place-items-center ink-3 hover:bg-surface-2 hover:ink-2 transition-colors"><span className="w-3.5 h-3.5">{Icon.refresh}</span></button>
        <button className="px-3 py-1.5 rounded-md bg-accent text-white text-xs font-medium">+ Nuevo Lead</button>
      </div>
    </div>

    <FilterChips search="Buscar leads..." chips={["Estado: Todos", "Fuente: Todas", "Responsable: Todos", "Tags: Todos"]} />

    {/* Table */}
    <div className="bg-surface border border-line rounded-xl overflow-hidden">
      <div className="grid grid-cols-[1.4fr_.85fr_1.05fr_.95fr_.95fr_.65fr] gap-3 px-4 py-2.5 mono text-[10px] uppercase tracking-wider ink-3 border-b border-line bg-surface-2">
        <span>Lead</span>
        <span className="hidden @[680px]/dash:block">Teléfono</span>
        <span>Fuente</span><span>Estado</span>
        <span className="hidden @[600px]/dash:block">Asignado</span>
        <span className="text-right">Fecha</span>
      </div>
      {data.leads.map((l, i) => {
        const ow = avatarFromName(l.owner);
        const st = statusPill(l.status);
        return (
          <div
            key={i}
            className="group grid grid-cols-[1.4fr_.85fr_1.05fr_.95fr_.95fr_.65fr] gap-3 px-4 py-3 text-xs items-center border-b border-line last:border-b-0 hover:bg-surface-2 transition cursor-pointer relative"
            style={{ animation: `rowIn .4s ${i * 45}ms both` }}
          >
            <span className="absolute left-0 top-0 bottom-0 w-[3px] opacity-0 group-hover:opacity-100 transition" style={{ background: st.dot }} />

            {/* Lead: name + email (no avatar) */}
            <div className="min-w-0">
              <div className="font-medium ink truncate">{l.name}</div>
              <div className="mono text-[10px] ink-3 truncate">{l.email}</div>
            </div>

            {/* Phone + WhatsApp */}
            <div className="hidden @[680px]/dash:flex items-center gap-1.5 mono text-[11px] ink-2 min-w-0">
              <span className="w-4 h-4 rounded-full bg-[color-mix(in_oklab,#25D366_18%,var(--bg))] text-[#1f9d54] grid place-items-center text-[9px] shrink-0">✆</span>
              <span className="truncate">{l.phone}</span>
            </div>

            {/* Source pill */}
            <span className={`mono text-[10px] px-2 py-0.5 rounded justify-self-start whitespace-nowrap ${srcPill(l.src)}`}>{l.src}</span>

            {/* Status pill */}
            <span className={`inline-flex items-center gap-1.5 mono text-[10px] px-2 py-0.5 rounded justify-self-start ${st.className}`}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: st.dot }} />{l.status}
            </span>

            {/* Assigned */}
            <div className="hidden @[600px]/dash:flex items-center gap-1.5 min-w-0">
              <span className="w-5 h-5 rounded-full grid place-items-center mono text-[9px] font-semibold text-white shrink-0" style={{ background: ow.color }}>{ow.initials}</span>
              <span className="ink-2 text-[11px] truncate">{l.owner}</span>
            </div>

            {/* Date */}
            <span className="mono text-[10px] ink-3 text-right tabular-nums">{l.date}</span>
          </div>
        );
      })}
      <div className="flex items-center justify-between px-4 py-2.5 mono text-[10px] ink-3">
        <span>1-{data.leads.length} de {ic.leadsTotal} leads · página 1 de 7</span>
        <span>Por página 20 ▾</span>
      </div>
    </div>
    <style>{`@keyframes rowIn { from { opacity: 0; transform: translateY(4px); } }`}</style>
  </div>
);

const PropMeta = ({ p }) => {
  const chips = p.meta || [p.type, p.amb, p.m2, p.op];
  return (
    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mono text-[10px] ink-2">
      {chips.map((c, i) => (
        <Fragment key={i}>
          {i > 0 && <span className="ink-3">·</span>}
          <span>{c}</span>
        </Fragment>
      ))}
    </div>
  );
};

const PropCard = ({ p, i }) => {
  const reserved = p.status === "Reservado";
  return (
    <div
      className="group bg-surface border border-line rounded-xl overflow-hidden hover:border-[var(--accent)] hover:-translate-y-0.5 transition-[transform,border-color] duration-300"
      style={{ animation: `rowIn .5s ${i * 55}ms both` }}
    >
      {/* Image area (demo: gradient placeholder) */}
      <div className="h-[112px] relative overflow-hidden" style={{ background: p.bg }}>
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.45) 100%)" }}/>
        <span className="absolute top-2.5 right-2.5 mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full border backdrop-blur-sm"
          style={reserved
            ? { background: "rgba(60,109,240,0.28)", color: "#fff", borderColor: "rgba(60,109,240,0.5)" }
            : { background: "rgba(47,178,125,0.30)", color: "#fff", borderColor: "rgba(47,178,125,0.5)" }}>
          {p.status}
        </span>
        <span className="absolute bottom-2.5 left-3 mono text-[9px] uppercase tracking-[0.15em] text-white/85 px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">{p.op}</span>
      </div>
      {/* Body */}
      <div className="px-3.5 py-3">
        <div className="text-sm font-medium leading-tight truncate">{p.title}</div>
        <div className="serif text-lg leading-none mt-1.5 mb-2 accent tabular-nums">{p.price}</div>
        <div className="flex items-center gap-1.5 text-[11px] ink-3 mb-2 min-w-0">
          <span className="w-3.5 h-3.5 shrink-0">{Icon.pin}</span>
          <span className="truncate">{p.zone}</span>
        </div>
        <PropMeta p={p} />
      </div>
    </div>
  );
};

const ViewProps = ({ data, ic }) => (
  <div className="p-4 @[760px]/dash:p-5">
    <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
      <div className="flex items-center gap-2 text-xs ink-3">
        <span className="mono">{ic.assetCountLabel}</span>
        {ic.assetSyncNote && (
          <>
            <span className="w-1 h-1 rounded-full bg-[var(--ink-3)]" />
            <span className="mono">{ic.assetSyncNote}</span>
          </>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button aria-label="Refrescar datos" title="Refrescar" className="w-7 h-7 rounded-md grid place-items-center ink-3 hover:bg-surface-2 hover:ink-2 transition-colors"><span className="w-3.5 h-3.5">{Icon.refresh}</span></button>
        {ic.assetHasSync && (
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-line text-xs hover:bg-surface-2"><span className="w-3.5 h-3.5">{Icon.refresh}</span> Sincronizar con Tokko</button>
        )}
        <button className="px-3 py-1.5 rounded-md bg-accent text-white text-xs font-medium">{ic.assetNew}</button>
      </div>
    </div>

    <FilterChips search={ic.assetSearch} chips={ic.assetChips} />

    <div className="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-3">
      {data.props.map((p, i) => <PropCard key={i} p={p} i={i} />)}
    </div>
    <div className="flex items-center justify-between mt-4 text-[11px] ink-3">
      <span>1-{data.props.length} de {ic.assetCountLabel}</span>
      <div className="flex items-center gap-2"><span>Por página 10 ▾</span><span>Página 1 de 24</span></div>
    </div>
  </div>
);

const ViewPipeline = ({ data }) => {
  const totalDeals = data.pipeline.reduce((sum, col) => sum + col.count, 0);
  return (
    <div className="p-4 @[760px]/dash:p-5">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
        <div className="flex items-center gap-2 text-xs ink-3">
          <span className="mono">{totalDeals} oportunidades</span>
          <span className="w-1 h-1 rounded-full bg-[var(--ink-3)]" />
          <span className="mono">3 cierran esta semana</span>
        </div>
        <div className="flex items-center gap-2">
          <button aria-label="Refrescar datos" title="Refrescar" className="w-7 h-7 rounded-md grid place-items-center ink-3 hover:bg-surface-2 hover:ink-2 transition-colors"><span className="w-3.5 h-3.5">{Icon.refresh}</span></button>
          <button className="px-3 py-1.5 rounded-md bg-accent text-white text-xs font-medium">+ Nueva Oportunidad</button>
        </div>
      </div>

      <FilterChips search="Buscar por nombre de lead..." chips={["Responsable: Todos", "Fuente: Todas", "Tags: Todos"]} />

      {/* Kanban columns */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {data.pipeline.map((col, ci) => (
          <div key={col.stage} className="min-w-[196px] flex-1">
            {/* Column header */}
            <div className="flex items-center gap-2 px-2 py-2 border-b-2 mb-2" style={{ borderColor: col.color }}>
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: col.color }}/>
              <span className="text-xs font-semibold truncate">{col.stage}</span>
              <span
                className="mono text-[10px] ml-auto px-1.5 py-0.5 rounded font-semibold shrink-0"
                style={{ background: `color-mix(in oklab, ${col.color} 18%, transparent)`, color: col.color }}
              >
                {col.count}
              </span>
            </div>

            {/* Cards container */}
            <div className="space-y-2 min-h-[160px] p-1.5 rounded-lg">
              {col.cards.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 px-3 border border-dashed border-line rounded-md text-center">
                  <span className="mono text-[10px] ink-3">Sin oportunidades</span>
                </div>
              ) : col.cards.map((c, i) => {
                const av = avatarFromName(c.who);
                const ow = avatarFromName(c.owner);
                return (
                  <div
                    key={i}
                    className="relative p-3 rounded-lg bg-surface border border-line text-xs hover:border-[var(--accent)] hover:-translate-y-0.5 transition-[transform,border-color] duration-300 cursor-pointer overflow-hidden"
                    style={{ animation: `rowIn .4s ${(ci * 90 + i * 70)}ms both` }}
                  >
                    <span className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: col.color }} />

                    {/* Header: avatar + name + days badge */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-7 h-7 rounded-full grid place-items-center mono text-[10px] font-semibold text-white shrink-0" style={{ background: av.color }}>{av.initials}</span>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold truncate">{c.who}</div>
                        <div className="mono text-[9px] ink-3 flex items-center gap-1"><span className="w-2.5 h-2.5">{Icon.cal}</span>{c.date}</div>
                      </div>
                      {c.days && <span className="mono text-[9px] px-1.5 py-0.5 rounded-full bg-surface-2 ink-3 shrink-0">{c.days}</span>}
                    </div>

                    {/* Property */}
                    {c.prop && (
                      <div className="text-[11px] ink-2 truncate mb-2 px-2 py-1 bg-surface-2 rounded">{c.prop}</div>
                    )}

                    {/* Price */}
                    {c.price && <div className="serif text-sm accent tabular-nums mb-2">{c.price}</div>}

                    {/* Footer: source + owner */}
                    <div className="flex items-center justify-between gap-2">
                      <span className={`mono text-[9px] px-1.5 py-0.5 rounded ${srcPill(c.src)}`}>{c.src}</span>
                      <span className="w-5 h-5 rounded-full grid place-items-center mono text-[8px] font-semibold text-white shrink-0" style={{ background: ow.color }} title={c.owner}>{ow.initials}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <style>{`@keyframes rowIn { from { opacity: 0; transform: translateY(4px); } }`}</style>
    </div>
  );
};

const prioPill = (p) => {
  const map = {
    "Alta":  { dot: "#e4576b", className: "bg-[color-mix(in_oklab,#e4576b_15%,var(--bg))] text-[#e4576b]" },
    "Media": { dot: "#d6a51e", className: "bg-[color-mix(in_oklab,#d6a51e_16%,var(--bg))] text-[#b88a1b]" },
    "Baja":  { dot: "#9a9689", className: "bg-surface-2 ink-3" },
  };
  return map[p] || map["Media"];
};

const ViewTasks = ({ data }) => (
  <div className="p-4 @[760px]/dash:p-5">
    {/* Top bar: view toggle + stats + action */}
    <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-surface-2 border border-line">
          <span className="px-2.5 py-1 rounded-md text-xs ink-3">Kanban</span>
          <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-surface accent">Lista</span>
        </div>
        <span className="text-xs ink-3 mono hidden @[600px]/dash:inline">6 tareas · 2 para hoy</span>
      </div>
      <div className="flex items-center gap-2">
        <button className="px-3 py-1.5 rounded-full border border-line text-xs ink-2 hover:bg-surface-2 mono hidden @[680px]/dash:inline">Mis tareas</button>
        <button className="px-3 py-1.5 rounded-full border border-line text-xs text-[#e4576b] hover:bg-surface-2 mono">Vencidas · 1</button>
        <button className="px-3 py-1.5 rounded-md bg-accent text-white text-xs font-medium">+ Nueva tarea</button>
      </div>
    </div>

    {/* Task list */}
    <div className="bg-surface border border-line rounded-xl overflow-hidden">
      {data.tasks.map((t, i) => {
        const pr = prioPill(t.prio);
        const ow = avatarFromName(t.owner);
        return (
          <div
            key={i}
            className="grid grid-cols-[auto_1fr_auto] @[680px]/dash:grid-cols-[auto_1fr_auto_auto_auto] gap-3 px-4 py-3 items-center border-b border-line last:border-b-0 hover:bg-surface-2 transition cursor-pointer"
            style={{ animation: `rowIn .4s ${i * 45}ms both` }}
          >
            {/* Checkbox */}
            <span className={`w-4 h-4 rounded border grid place-items-center shrink-0 ${t.done ? "bg-[var(--pos)] border-[var(--pos)] text-white" : "border-line"}`}>
              {t.done && <span className="text-[10px] leading-none">✓</span>}
            </span>

            {/* Title + type */}
            <div className="min-w-0">
              <div className={`text-xs font-medium truncate ${t.done ? "line-through ink-3" : "ink"}`}>{t.title}</div>
              <div className="mono text-[10px] ink-3 mt-0.5">{t.type}</div>
            </div>

            {/* Priority */}
            <span className={`inline-flex items-center gap-1.5 mono text-[10px] px-2 py-0.5 rounded justify-self-start ${pr.className}`}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: pr.dot }} />{t.prio}
            </span>

            {/* Due date */}
            <span className={`hidden @[680px]/dash:inline-flex items-center gap-1.5 mono text-[10px] tabular-nums ${t.overdue ? "text-[#e4576b]" : "ink-2"}`}>
              <span className="w-3 h-3">{Icon.cal}</span>{t.overdue ? `Vencida · ${t.due}` : t.due}
            </span>

            {/* Owner */}
            <span className="hidden @[680px]/dash:grid w-6 h-6 rounded-full place-items-center mono text-[9px] font-semibold text-white shrink-0" style={{ background: ow.color }} title={t.owner}>{ow.initials}</span>
          </div>
        );
      })}
    </div>
    <style>{`@keyframes rowIn { from { opacity: 0; transform: translateY(4px); } }`}</style>
  </div>
);

const ViewSales = ({ data, ic }) => (
  <div className="p-4 @[760px]/dash:p-5">
    {/* Top bar */}
    <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
      <div className="flex items-center gap-2 text-xs ink-3">
        <span className="mono">4 operaciones cerradas</span>
        <span className="w-1 h-1 rounded-full bg-[var(--ink-3)]" />
        <span className="mono text-[var(--pos)]">{data.salesTotals.gross} en comisiones</span>
      </div>
      <button aria-label="Refrescar datos" title="Refrescar" className="w-7 h-7 rounded-md grid place-items-center ink-3 hover:bg-surface-2 hover:ink-2 transition-colors"><span className="w-3.5 h-3.5">{Icon.refresh}</span></button>
    </div>

    <FilterChips search={ic.salesSearch} chips={["Operación: Todas", "Moneda: USD", "Agente: Todos"]} />

    {/* Sales table */}
    <div className="bg-surface border border-line rounded-xl overflow-hidden">
      <div className="grid grid-cols-[.8fr_.7fr_1.6fr_1fr_.9fr_.9fr] gap-3 px-4 py-2.5 mono text-[10px] uppercase tracking-wider ink-3 border-b border-line bg-surface-2">
        <span>Fecha</span><span>Op.</span>
        <span>{ic.salesAssetCol}</span>
        <span className="hidden @[680px]/dash:block">Agente</span><span className="@[680px]/dash:hidden" />
        <span className="text-right">Com. bruta</span>
        <span className="text-right">Com. oficina</span>
      </div>
      {data.sales.map((s, i) => {
        const isRent = s.op === "Alquiler";
        return (
          <div
            key={i}
            className="grid grid-cols-[.8fr_.7fr_1.6fr_1fr_.9fr_.9fr] gap-3 px-4 py-3 text-xs items-center border-b border-line last:border-b-0 hover:bg-surface-2 transition"
            style={{ animation: `rowIn .4s ${i * 50}ms both` }}
          >
            <span className="mono text-[11px] ink-2 tabular-nums">{s.date}</span>
            <span className={`mono text-[10px] px-2 py-0.5 rounded justify-self-start ${isRent ? "bg-[color-mix(in_oklab,#d6a51e_16%,var(--bg))] text-[#b88a1b]" : "bg-[color-mix(in_oklab,#2fb27d_15%,var(--bg))] text-[#2fb27d]"}`}>{s.op}</span>
            <div className="min-w-0">
              <div className="ink font-medium truncate text-[11px]">{s.prop}</div>
              <div className="mono text-[10px] ink-3 truncate @[680px]/dash:hidden">{s.agent}</div>
            </div>
            <span className="hidden @[680px]/dash:block ink-2 text-[11px] truncate">{s.agent}</span>
            <div className="text-right">
              <div className="mono tabular-nums ink font-medium">{s.gross}</div>
              <div className="mono text-[9px] ink-3">{s.grossNote}</div>
            </div>
            <span className="mono tabular-nums text-right text-[var(--pos)] font-medium">{s.office}</span>
          </div>
        );
      })}
      {/* Totals */}
      <div className="grid grid-cols-[.8fr_.7fr_1.6fr_1fr_.9fr_.9fr] gap-3 px-4 py-2.5 items-center bg-surface-2 mono text-[11px]">
        <span className="uppercase tracking-wider ink-3 text-[10px] col-span-4">Totales (USD)</span>
        <span className="tabular-nums text-right ink font-semibold">{data.salesTotals.gross}</span>
        <span className="tabular-nums text-right text-[var(--pos)] font-semibold">{data.salesTotals.office}</span>
      </div>
    </div>
    <style>{`@keyframes rowIn { from { opacity: 0; transform: translateY(4px); } }`}</style>
  </div>
);

// Consistent light tile that holds each brand glyph (matches the real app).
const LogoTile = ({ bg, children }) => (
  <div className="w-8 h-8 rounded-lg grid place-items-center shrink-0" style={{ background: bg }}>{children}</div>
);
const MetaLogo = () => (
  <LogoTile bg="color-mix(in oklab, #0081fb 12%, var(--bg))">
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="#0081fb" strokeWidth="2.4">
      <circle cx="8.4" cy="12" r="3.6"/>
      <circle cx="15.6" cy="12" r="3.6"/>
    </svg>
  </LogoTile>
);
const GoogleLogo = () => (
  <LogoTile bg="color-mix(in oklab, #4285F4 10%, var(--bg))">
    <svg viewBox="0 0 24 24" className="w-5 h-5">
      <rect x="9.9" y="3" width="4.2" height="17" rx="2.1" fill="#FBBC04" transform="rotate(-22 12 4)"/>
      <rect x="9.9" y="3" width="4.2" height="17" rx="2.1" fill="#4285F4" transform="rotate(22 12 4)"/>
      <circle cx="6.4" cy="18.4" r="2.7" fill="#34A853"/>
    </svg>
  </LogoTile>
);
const TokkoLogo = () => (
  <LogoTile bg="linear-gradient(135deg, #ff5a1f, #e0492f)">
    <span className="text-white font-bold text-sm leading-none">t</span>
  </LogoTile>
);
const WebLogo = () => (
  <LogoTile bg="color-mix(in oklab, #9a56d0 16%, var(--bg))">
    <span className="text-[#9a56d0] font-bold text-[11px] mono leading-none">&lt;/&gt;</span>
  </LogoTile>
);

// Integration row — connected, available, or not-configured.
const IntegRow = ({ logo, name, desc, status, badge, account, sub, cta }) => {
  const isConnected = status === "connected";
  const statusStyle = isConnected
    ? { dot: "#2fb27d", text: "Conectado" }
    : status === "notset"
      ? { dot: "#9a9689", text: "No configurado" }
      : { dot: "#9a9689", text: "No conectado" };

  return (
    <div className="bg-surface border border-line rounded-xl p-4 transition hover:-translate-y-0.5 hover:border-[var(--accent)]">
      <div className="flex items-start gap-3">
        <div className="shrink-0">{logo}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-2 mb-1">
            <span className="font-semibold text-sm truncate">{name}</span>
            <span className="flex items-center gap-1 mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0" style={{ background: `color-mix(in oklab, ${statusStyle.dot} 15%, var(--bg))`, color: statusStyle.dot }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusStyle.dot }} />
              {statusStyle.text}
            </span>
            {badge && <span className="mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-[color-mix(in_oklab,#3c6df0_14%,var(--bg))] text-[#3c6df0] shrink-0">{badge}</span>}
          </div>
          <div className="text-[11px] ink-3 leading-snug">{desc}</div>
        </div>
      </div>

      {isConnected ? (
        <div className="mt-3 px-2.5 py-2 border border-line rounded-md flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-medium truncate">{account}</div>
            {sub && <div className="mono text-[9px] ink-3 mt-0.5 truncate">{sub}</div>}
          </div>
          <span className="mono text-[10px] ink-3 hover:accent shrink-0 whitespace-nowrap">{cta || "⚙"}</span>
        </div>
      ) : (
        <button className="mt-3 w-full py-2 rounded-md bg-[var(--ink)] text-[var(--bg)] text-xs font-medium hover:opacity-90 transition">
          {cta || "Conectar →"}
        </button>
      )}
    </div>
  );
};

const ViewIntegr = ({ ic }) => (
  <div className="p-4 @[760px]/dash:p-5 space-y-5">
    {/* Header */}
    <div className="flex items-center justify-between gap-2 flex-wrap">
      <div className="flex items-center gap-2 text-xs ink-3">
        <span className="mono">{ic.integConnected}</span>
        <span className="w-1 h-1 rounded-full bg-[var(--ink-3)]" />
        <span className="mono">última actualización: hace 2h</span>
      </div>
      <button aria-label="Refrescar datos" title="Refrescar" className="w-7 h-7 rounded-md grid place-items-center ink-3 hover:bg-surface-2 hover:ink-2 transition-colors"><span className="w-3.5 h-3.5">{Icon.refresh}</span></button>
    </div>

    {/* Plataformas publicitarias */}
    <div>
      <div className="mb-1 font-medium text-sm">Plataformas publicitarias</div>
      <div className="mono text-[10px] ink-3 mb-3">Conectá tus cuentas para rastrear el origen y la inversión de tus leads.</div>
      <div className="grid grid-cols-1 @[600px]/dash:grid-cols-2 gap-3">
        <IntegRow logo={<MetaLogo/>} name="Meta Ads" badge="OAuth" desc="Facebook e Instagram: campañas e inversión publicitaria." status="connected" account="Publicidad Demo" sub="ID 345810498" cta="Conectar otra" />
        <IntegRow logo={<GoogleLogo/>} name="Google Ads" desc="Búsqueda, Display y YouTube: campañas e inversión." status="available" cta="Conectar →" />
      </div>
    </div>

    {/* Integraciones de terceros — solo inmobiliaria (Tokko es de real estate) */}
    {ic.hasTokko && (
      <div>
        <div className="mb-1 font-medium text-sm">Integraciones de terceros</div>
        <div className="mono text-[10px] ink-3 mb-3">Conectá servicios externos para sincronizar datos.</div>
        <div className="grid grid-cols-1 @[600px]/dash:grid-cols-2 gap-3">
          <IntegRow logo={<TokkoLogo/>} name="Tokko Broker" desc="Sincroniza tus propiedades desde Tokko Broker." status="connected" account="API conectada" sub="última sincronización: hace 2h" cta="Actualizar clave" />
        </div>
      </div>
    )}

    {/* Rastreo web */}
    <div>
      <div className="mb-1 font-medium text-sm">Rastreo web</div>
      <div className="mono text-[10px] ink-3 mb-3">Instalá un script en tu sitio para capturar leads de tus formularios.</div>
      <div className="grid grid-cols-1 @[600px]/dash:grid-cols-2 gap-3">
        <IntegRow logo={<WebLogo/>} name="Rastreo del sitio web" desc="Capturá leads desde los formularios de tu sitio web." status="notset" cta="Configurar" />
      </div>
    </div>
  </div>
);

export const Dashboard = () => {
  const [view, setView] = useState("inicio");
  const [vertical, setVertical] = useState("inmo");
  const [playKey, setPlayKey] = useState(0);

  useEffect(() => { setPlayKey(k => k + 1); }, [view, vertical]);

  const data = vertical === "inmo" ? DEMO_INMO : DEMO_AUTO;
  const ic = IC[vertical];
  const titles = { inicio: "Inicio", leads: "Leads", props: ic.assetLabel, pipe: "Pipeline", tareas: "Tareas", ventas: "Ventas", plug: "Integraciones" };

  return (
    <div className="card overflow-hidden shadow-[0_40px_100px_-40px_rgba(0,0,0,0.25)] @container/dash">
      <div className="flex items-center justify-between gap-2 px-4 py-2.5 border-b border-line bg-surface-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"/>
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"/>
          <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"/>
          <span className="mono text-[11px] ink-3 ml-3 hidden @[680px]/dash:inline truncate">quasor.app/{view}</span>
        </div>
        {/* Vertical switcher — prueba viva del multivertical (espeja la app real) */}
        <div className="flex items-center gap-0.5 p-0.5 rounded-md bg-surface border border-line shrink-0" role="group" aria-label="Cambiar rubro del demo">
          {[["inmo", "Inmobiliaria"], ["auto", "Concesionaria"]].map(([k, lbl]) => (
            <button
              key={k}
              type="button"
              onClick={() => setVertical(k)}
              aria-pressed={vertical === k}
              className={`mono text-[10px] px-2 py-0.5 rounded transition-colors ${vertical === k ? "text-white" : "ink-3 hover:ink-2"}`}
              style={vertical === k ? { background: "var(--accent-strong)" } : undefined}
            >
              {lbl}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-[56px_1fr] @[540px]/dash:grid-cols-[184px_1fr] h-[620px] transition-[grid-template-columns] duration-300">
        <aside className="border-r border-line bg-surface p-2 @[540px]/dash:p-3 flex flex-col">
          <div className="flex items-center justify-center @[540px]/dash:justify-start @[540px]/dash:px-2 mb-0.5">
            <span className="serif text-xl leading-none tracking-tight">
              <span className="@[540px]/dash:hidden">q<span className="accent">.</span></span>
              <span className="hidden @[540px]/dash:inline">quasor<span className="accent">.</span></span>
            </span>
          </div>
          <div className="hidden @[540px]/dash:block px-2 mono text-[10px] ink-3 mb-4">{ic.subtitle}</div>
          <div className="@[540px]/dash:hidden h-4" />
          <nav className="space-y-0.5">
            <NavItem icon={Icon.home}  label="Inicio"      active={view === "inicio"} onClick={() => setView("inicio")}/>
            <NavItem icon={Icon.leads} label="Leads"       active={view === "leads"}  onClick={() => setView("leads")}/>
            <NavItem icon={ic.assetIcon} label={ic.assetLabel} active={view === "props"}  onClick={() => setView("props")}/>
            <NavItem icon={Icon.pipe}  label="Pipeline"    active={view === "pipe"}   onClick={() => setView("pipe")}/>
            <NavItem icon={Icon.tasks} label="Tareas"      active={view === "tareas"} onClick={() => setView("tareas")}/>
            <NavItem icon={Icon.sales} label="Ventas"      active={view === "ventas"} onClick={() => setView("ventas")}/>
          </nav>
          <div className="hidden @[540px]/dash:block px-2 mt-4 mb-2 mono text-[9px] uppercase tracking-[0.18em] ink-3">Configuración</div>
          <div className="@[540px]/dash:hidden my-2 mx-2 border-t border-line" />
          <nav className="space-y-0.5">
            <NavItem icon={Icon.plug} label="Integraciones" badge={ic.integBadge} active={view === "plug"} onClick={() => setView("plug")}/>
          </nav>
          <div className="mt-auto hidden @[540px]/dash:block px-2 pt-3 mono text-[9px] ink-3">Quasor · v1.1.0</div>
        </aside>

        <main className="bg-surface-2 overflow-hidden flex flex-col min-h-0">
          <header className="flex items-center justify-between px-5 py-3 border-b border-line bg-surface shrink-0">
            <div className="flex items-center gap-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ink-2"><rect x="3" y="4" width="7" height="16"/><rect x="14" y="4" width="7" height="16"/></svg>
              <span className="text-sm font-medium">{titles[view]}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-4 h-4 ink-3 hidden @[600px]/dash:inline">{Icon.sun}</span>
              <span className="w-4 h-4 ink-3 hidden @[600px]/dash:inline">{Icon.bell}</span>
              <span className="mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-[color-mix(in_oklab,#9a56d0_15%,var(--bg))] text-[#9a56d0]">Admin</span>
              <span className="text-xs ink-2 hidden sm:inline">{ic.headerUser.name}</span>
              <span className="w-7 h-7 rounded-full bg-accent text-white grid place-items-center mono text-[10px] font-bold">{ic.headerUser.initials}</span>
            </div>
          </header>
          <div key={playKey} className="flex-1 min-h-0 overflow-y-auto dash-scroll animate-[fadeIn_.4s_ease-out]">
            {view === "inicio" && <ViewInicio data={data} ic={ic} playKey={playKey}/>}
            {view === "leads"  && <ViewLeads data={data} ic={ic}/>}
            {view === "props"  && <ViewProps data={data} ic={ic}/>}
            {view === "pipe"   && <ViewPipeline data={data}/>}
            {view === "tareas" && <ViewTasks data={data}/>}
            {view === "ventas" && <ViewSales data={data} ic={ic}/>}
            {view === "plug"   && <ViewIntegr ic={ic}/>}
          </div>
        </main>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } }
        .dash-scroll { scrollbar-width: thin; scrollbar-color: var(--line) transparent; }
        .dash-scroll::-webkit-scrollbar { width: 7px; height: 7px; }
        .dash-scroll::-webkit-scrollbar-thumb { background: var(--line); border-radius: 4px; }
        .dash-scroll::-webkit-scrollbar-thumb:hover { background: var(--ink-3); }
        .dash-scroll::-webkit-scrollbar-track { background: transparent; }
      `}</style>
    </div>
  );
};
