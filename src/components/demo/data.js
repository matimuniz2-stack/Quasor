// Datos de la demo del CRM. Todo es ficticio (inmobiliaria, concesionaria,
// personas, teléfonos), pero las etiquetas, etapas, fuentes, estados y campos
// salen del código real de quasor-crm (locales/es + shared/labels) para que la
// demo no prometa nada que la app no tenga.
//
// "Hoy" en la demo es el viernes 25/09/2026: fecha fija a propósito, así el
// prerender y el cliente muestran lo mismo y el calendario siempre cae en una
// semana hábil.

export const TODAY = { d: 25, m: 9, y: 2026, label: "viernes 25 de septiembre" };
export const PERIOD = "12 – 25 sep 2026";

// ── Etapas del pipeline (status-badge.tsx + kanban-column.tsx) ──────────────
export const STAGE_META = {
  INTERESTED:           { label: "Interesado",          c: "#3b82f6", icon: "sparkles" },
  IN_FOLLOW_UP:         { label: "En seguimiento",      c: "#06b6d4", icon: "messages" },
  VISIT_SCHEDULED:      { label: "Visita agendada",     c: "#0ea5e9", icon: "calcheck" },
  VISITED:              { label: "Visitó la propiedad", c: "#6366f1", icon: "eye" },
  TEST_DRIVE_SCHEDULED: { label: "Test drive agendado", c: "#0ea5e9", icon: "calcheck" },
  TEST_DRIVE_COMPLETED: { label: "Realizó test drive",  c: "#6366f1", icon: "car" },
  OFFER_MADE:           { label: "Hizo una oferta",     c: "#8b5cf6", icon: "handcoins" },
  RESERVED:             { label: "Reservó",             c: "#f59e0b", icon: "bookmark" },
  CLOSING:              { label: "Cierre en curso",     c: "#14b8a6", icon: "arrowcircle" },
  SALE_COMPLETED:       { label: "Venta concretada",    c: "#16a34a", icon: "checkbig" },
  LOST:                 { label: "Cerrado sin venta",   c: "#ef4444", icon: "circlex" },
};

export const LOST_REASONS = [
  "Precio fuera de presupuesto", "Eligió competencia", "Postergado / sin urgencia",
  "Sin respuesta", "No calificaba", "Problemas de financiación", "Cambió lo que buscaba",
  "Lead duplicado", "Otro",
];

// ── Fuentes (migración 105_lead_source_system_colors) ───────────────────────
export const SOURCE_COLORS = {
  "Sitio Web": "#3b82f6", "Referido": "#10b981", "Teléfono": "#0ea5e9", "WhatsApp": "#22c55e",
  "Salón": "#8b5cf6", "Google Ads": "#f59e0b", "Meta Ads": "#3b82f6", "Tokko Broker": "#f97316",
  "Mercado Libre": "#eab308", "Argenprop": "#f43f5e", "Zonaprop": "#14b8a6", "Manual": "#64748b", "Otro": "#9ca3af",
};

export const LEAD_STATUS = {
  NEW:       { label: "Nuevo",      c: "#71717a" },
  CONTACTED: { label: "Contactado", c: "#3b82f6" },
  QUALIFIED: { label: "Calificado", c: "#d97706" },
  CUSTOMER:  { label: "Cliente",    c: "#16a34a" },
};

export const TEMPS = {
  hot:  { label: "Caliente",   c: "#ef4444", icon: "flame" },
  mid:  { label: "Medio",      c: "#f59e0b", icon: "thermosun" },
  cold: { label: "Frío",       c: "#0ea5e9", icon: "snow" },
  none: { label: "Sin marcar", c: "#a1a1aa", icon: "thermo" },
};

export const TASK_TYPES = {
  CALL:      { label: "Llamada",     icon: "phone" },
  MEETING:   { label: "Reunión",     icon: "users" },
  EMAIL:     { label: "Email",       icon: "mail" },
  TASK:      { label: "Tarea",       icon: "checksq" },
  FOLLOW_UP: { label: "Seguimiento", icon: "arrowcircle" },
};
export const PRIORITIES = {
  URGENT: { label: "Urgente", c: "#ef4444" },
  HIGH:   { label: "Alta",    c: "#f97316" },
  MEDIUM: { label: "Media",   c: "#eab308" },
  LOW:    { label: "Baja",    c: "#a1a1aa" },
};
export const TASK_STATUS = {
  PENDING:     { label: "Pendiente",   c: "#3b82f6", icon: "circle" },
  IN_PROGRESS: { label: "En progreso", c: "#0ea5e9", icon: "play" },
  ON_HOLD:     { label: "En espera",   c: "#f59e0b", icon: "hourglass" },
  COMPLETED:   { label: "Completada",  c: "#16a34a", icon: "checkbig" },
  CANCELLED:   { label: "Cancelada",   c: "#ef4444", icon: "circlex" },
};

export const ASSET_STATUS = {
  Disponible: "#16a34a", Reservado: "#d97706", Vendido: "#ef4444", Agotado: "#f97316", Archivado: "#71717a",
};

// Paleta de gráficos (chart-1..9 de app.css)
export const CHART = ["#f97316", "#0ea5e9", "#16a34a", "#8b5cf6", "#f43f5e", "#14b8a6", "#eab308", "#db2777", "#8391a7"];

const byDay = (leads, key) =>
  leads.map((v, i) => ({ d: `${String(12 + i).padStart(2, "0")}/09`, leads: v, key: key[i] }));

// ════════════════════════════════════════════════════════════════════════════
//  INMOBILIARIA
// ════════════════════════════════════════════════════════════════════════════
const LF = "Lucía Fernández", MR = "Martín Ríos", SV = "Sofía Vega", DT = "Diego Torres", PG = "Paula Gómez";

const inmoAssets = [
  { id: "a1", title: "Departamento 2 amb en Plaza Colón", short: "Depto · Plaza Colón", price: 103500, cur: "USD", zone: "Plaza Colón, Mar del Plata", attrs: ["Departamento", "2 amb.", "50 m²", "Venta"], status: "Disponible", img: ["#6d8aa8", "#3d5a72"], team: [LF] },
  { id: "a2", title: "Casa 5 amb en barrio San Juan", short: "Casa · San Juan", price: 200000, cur: "USD", zone: "San Juan, Mar del Plata", attrs: ["Casa", "5 amb.", "239 m²", "Venta"], status: "Disponible", img: ["#8a7056", "#4a3d31"], team: [MR, DT] },
  { id: "a3", title: "Departamento 3 amb frente a Playa Varese", short: "Depto · Playa Varese", price: 250000, cur: "USD", zone: "Varese, Mar del Plata", attrs: ["Departamento", "3 amb.", "92 m²", "Venta"], status: "Reservado", img: ["#5f7aa6", "#39425c"], team: [MR] },
  { id: "a4", title: "PH 3 amb con patio en Los Troncos", short: "PH · Los Troncos", price: 138000, cur: "USD", zone: "Los Troncos, Mar del Plata", attrs: ["PH", "3 amb.", "84 m²", "Venta"], status: "Disponible", img: ["#6f8a63", "#3b4a33"], team: [SV] },
  { id: "a5", title: "Oficina en Terminal Vieja", short: "Oficina · Terminal", price: 1800, cur: "USD", per: "/mes", zone: "Terminal, Mar del Plata", attrs: ["Oficina", "186 m²", "Alquiler"], status: "Disponible", img: ["#4b5059", "#1f2226"], team: [DT] },
  { id: "a6", title: "Departamento 2 amb en Güemes", short: "Depto · Güemes", price: 118000, cur: "USD", zone: "Güemes, Mar del Plata", attrs: ["Departamento", "2 amb.", "58 m²", "Venta"], status: "Disponible", img: ["#94708f", "#5c3f5e"], team: [PG] },
  { id: "a7", title: "Casa en Divino Rostro", short: "Casa · Divino Rostro", price: 165000, cur: "USD", zone: "Divino Rostro, Mar del Plata", attrs: ["Casa", "4 amb.", "160 m²", "Venta"], status: "Vendido", img: ["#7d8a5a", "#454d2f"], team: [DT] },
  { id: "a8", title: "Departamento 1 amb en Plaza Mitre", short: "Depto · Plaza Mitre", price: 800, cur: "USD", per: "/mes", zone: "Plaza Mitre, Mar del Plata", attrs: ["Departamento", "1 amb.", "38 m²", "Alquiler"], status: "Disponible", img: ["#8f7f68", "#554939"], team: [LF] },
];

const inmoLeads = [
  { id: "l1",  name: "Diego Herrera",    email: "diego.herrera@gmail.com", phone: "+54 223 555-0142", src: "Meta Ads",      status: "NEW",       temp: "hot",  owner: LF, date: "25/09/2026", sla: { live: true, min: 14 }, asset: "a1", campaign: "Captación · Deptos 2 amb" },
  { id: "l2",  name: "Valentina Pedre",  email: "valen.pedre@gmail.com",   phone: "+54 223 555-0188", src: "Tokko Broker",  status: "CONTACTED", temp: "mid",  owner: MR, date: "25/09/2026", sla: { min: 12 }, asset: "a2" },
  { id: "l3",  name: "Santiago López",   email: "slopez@gmail.com",        phone: "+54 223 555-0211", src: "WhatsApp",      status: "NEW",       temp: "none", owner: SV, date: "25/09/2026", sla: { live: true, min: 72 }, asset: "a4" },
  { id: "l4",  name: "Carla Benítez",    email: "c.benitez@gmail.com",     phone: "+54 223 555-0309", src: "Meta Ads",      status: "QUALIFIED", temp: "hot",  owner: LF, date: "24/09/2026", sla: { min: 7 }, asset: "a3", campaign: "Captación · Deptos 2 amb" },
  { id: "l5",  name: "Mariana Ávila",    email: "mavila@gmail.com",        phone: "+54 223 555-0533", src: "Mercado Libre", status: "NEW",       temp: "mid",  owner: PG, date: "24/09/2026", sla: { live: true, min: 188 }, asset: "a6", mlPending: true },
  { id: "l6",  name: "Pablo Iriarte",    email: "piriarte@hotmail.com",    phone: "+54 223 555-0421", src: "Referido",      status: "CUSTOMER",  temp: "none", owner: DT, date: "23/09/2026", sla: { min: 25 }, asset: "a7" },
  { id: "l7",  name: "Lucas Romano",     email: "lromano@gmail.com",       phone: "+54 223 555-0644", src: "Google Ads",    status: "QUALIFIED", temp: "hot",  owner: MR, date: "23/09/2026", sla: { min: 9 }, asset: "a3", campaign: "Búsqueda · Venta deptos MdP" },
  { id: "l8",  name: "Florencia Díaz",   email: "flor.diaz@gmail.com",     phone: "+54 223 555-0719", src: "Zonaprop",      status: "CONTACTED", temp: "cold", owner: SV, date: "22/09/2026", sla: { min: 55 }, asset: "a6" },
  { id: "l9",  name: "Tomás Aguirre",    email: "t.aguirre@gmail.com",     phone: "+54 223 555-0752", src: "Sitio Web",     status: "CONTACTED", temp: "mid",  owner: DT, date: "22/09/2026", sla: { min: 18 }, asset: "a2" },
  { id: "l10", name: "Julieta Sosa",     email: "julisosa@gmail.com",      phone: "+54 223 555-0810", src: "Argenprop",     status: "QUALIFIED", temp: "cold", owner: PG, date: "21/09/2026", sla: { min: 130 }, asset: "a4" },
  { id: "l11", name: "Nicolás Paz",      email: "npaz@gmail.com",          phone: "+54 223 555-0877", src: "Referido",      status: "QUALIFIED", temp: "hot",  owner: LF, date: "19/09/2026", sla: { min: 6 }, asset: "a1" },
  { id: "l12", name: "Ramiro Cáceres",   email: "rcaceres@gmail.com",      phone: "+54 223 555-0931", src: "Meta Ads",      status: "CONTACTED", temp: "cold", owner: SV, date: "18/09/2026", sla: { min: 34 }, asset: "a2", campaign: "Tasaciones · Propietarios" },
];

const inmoOpps = [
  { id: "o1",  lead: "l1",  stage: "INTERESTED",      asset: "a1", created: "25/09", days: 0 },
  { id: "o5",  lead: "l5",  stage: "INTERESTED",      asset: "a6", created: "24/09", days: 1 },
  { id: "o3",  lead: "l3",  stage: "INTERESTED",      asset: "a4", created: "25/09", days: 0 },
  { id: "o9",  lead: "l9",  stage: "INTERESTED",      asset: "a2", created: "22/09", days: 3, contacted: true },
  { id: "o4",  lead: "l4",  stage: "VISIT_SCHEDULED", asset: "a3", created: "24/09", days: 1, docs: 1, visit: "Sáb 26/09 · 11:00" },
  { id: "o8",  lead: "l8",  stage: "VISIT_SCHEDULED", asset: "a6", created: "22/09", days: 2, visit: "Lun 28/09 · 17:00" },
  { id: "o2",  lead: "l2",  stage: "VISITED",         asset: "a2", created: "25/09", days: 0 },
  { id: "o10", lead: "l10", stage: "VISITED",         asset: "a4", created: "21/09", days: 6 },
  { id: "o7",  lead: "l7",  stage: "RESERVED",        asset: "a3", created: "23/09", days: 2, price: 245000, deposit: 10000, docs: 2 },
  { id: "o11", lead: "l11", stage: "CLOSING",         asset: "a1", created: "19/09", days: 4, price: 101000, docs: 3 },
  { id: "o6",  lead: "l6",  stage: "SALE_COMPLETED",  asset: "a7", created: "23/09", days: 0, price: 165000 },
  { id: "o12", lead: "l12", stage: "LOST",            asset: "a2", created: "18/09", days: 0, lost: "Precio fuera de presupuesto" },
];

const inmoTasks = [
  { id: "t1", title: "Llamar a Diego Herrera", client: "Diego Herrera", type: "CALL", prio: "HIGH", status: "PENDING", day: 25, time: "10:30", owner: LF },
  { id: "t2", title: "Enviar tasación a Mariana Ávila", client: "Mariana Ávila", type: "EMAIL", prio: "MEDIUM", status: "IN_PROGRESS", day: 25, time: "15:00", owner: PG },
  { id: "t3", title: "Recontactar a Florencia Díaz", client: "Florencia Díaz", type: "CALL", prio: "MEDIUM", status: "PENDING", day: 25, time: "17:30", owner: SV },
  { id: "t4", title: "Visita · Depto Playa Varese", client: "Carla Benítez", type: "MEETING", prio: "HIGH", status: "PENDING", day: 26, time: "11:00", owner: LF, auto: true },
  { id: "t5", title: "Seguimiento de reserva", client: "Lucas Romano", type: "FOLLOW_UP", prio: "MEDIUM", status: "PENDING", day: 24, time: "17:00", owner: MR },
  { id: "t6", title: "Firma de boleto · Depto Plaza Colón", client: "Nicolás Paz", type: "MEETING", prio: "URGENT", status: "ON_HOLD", day: 23, time: "12:00", owner: LF },
  { id: "t7", title: "Coordinar visita · Casa San Juan", client: "Valentina Pedre", type: "FOLLOW_UP", prio: "HIGH", status: "COMPLETED", day: 22, time: "10:00", owner: MR },
  { id: "t8", title: "Subir fotos nuevas · PH Los Troncos", client: null, type: "TASK", prio: "LOW", status: "COMPLETED", day: 21, time: "16:00", owner: SV },
  { id: "t9", title: "Reunión de equipo semanal", client: null, type: "MEETING", prio: "MEDIUM", status: "COMPLETED", day: 21, time: "09:00", owner: DT },
  { id: "t10", title: "Mandar fichas a Tomás Aguirre", client: "Tomás Aguirre", type: "EMAIL", prio: "LOW", status: "PENDING", day: 22, time: "11:30", owner: DT },
];

export const DEMO_INMO = {
  key: "inmo",
  tenant: { name: "Inmobiliaria Demo", initials: "ID" },
  user: { name: "Carolina Méndez", initials: "CM", email: "carolina@inmobiliariademo.com", role: "Gerencia" },
  asset: { label: "Propiedades", singular: "Propiedad", icon: "building", newLabel: "Nueva propiedad", lower: "propiedades" },
  keyStage: "Propiedades visitadas",
  agents: [LF, MR, SV, DT, PG],
  stages: ["INTERESTED", "VISIT_SCHEDULED", "VISITED", "RESERVED", "CLOSING", "SALE_COMPLETED", "LOST"],
  nav: ["inicio", "leads", "assets", "pipeline", "pedidos", "tasaciones", "tareas", "llaves", "permutas", "ventas", "objetivos"],
  kpis: [
    { id: "leads", label: "Leads nuevos", value: 128, delta: 23.4, diff: "+24", icon: "users" },
    { id: "opps", label: "Oportunidades activas", value: 64, delta: 12.5, diff: "+7", icon: "target" },
    { id: "conv", label: "Tasa de conversión", value: 18.4, delta: 2.1, diff: "+2,1 pp", icon: "trending", suffix: "%", decimals: 1 },
  ],
  series: byDay([8, 11, 6, 9, 7, 10, 8, 12, 9, 14, 7, 6, 10, 11], [3, 4, 2, 4, 3, 5, 3, 6, 4, 6, 3, 2, 5, 5]),
  convSeries: [14.2, 15.1, 15.8, 15.2, 16.4, 16.9, 17.3, 16.8, 17.6, 18.1, 17.9, 18.4, 18.2, 18.4],
  funnel: [["INTERESTED", 28], ["VISIT_SCHEDULED", 16], ["VISITED", 11], ["RESERVED", 6], ["CLOSING", 3], ["SALE_COMPLETED", 5]],
  origins: [["Meta Ads", 48], ["Tokko Broker", 28], ["WhatsApp", 20], ["Mercado Libre", 14], ["Google Ads", 12], ["Referido", 6]],
  assetStatus: [["Disponible", 118], ["Reservado", 24], ["Vendido", 9]],
  assetTotal: 151,
  ads: {
    spendUSD: 1520, leads: 86, impressions: 184300, clicks: 3920, attributedSales: 5, revenueUSD: 21400,
    channels: [
      { p: "Meta Ads", spend: 940, leads: 58, sales: 3 },
      { p: "Google Ads", spend: 580, leads: 28, sales: 2 },
    ],
    pivot: [
      { p: "Meta Ads", name: "Captación · Deptos 2 amb", spend: 640, imp: 88400, clicks: 1710, leads: 41, children: [
        { name: "Ad set — Intereses", spend: 380, imp: 51200, clicks: 1030, leads: 25, children: [
          { name: "Video · Recorrido Plaza Colón", spend: 220, imp: 29800, clicks: 640, leads: 16 },
          { name: "Carrusel · 6 deptos a estrenar", spend: 160, imp: 21400, clicks: 390, leads: 9 },
        ] },
        { name: "Ad set — Lookalike", spend: 260, imp: 37200, clicks: 680, leads: 16 },
      ] },
      { p: "Meta Ads", name: "Tasaciones · Propietarios", spend: 300, imp: 47100, clicks: 820, leads: 17 },
      { p: "Google Ads", name: "Búsqueda · Venta deptos MdP", spend: 580, imp: 48800, clicks: 1390, leads: 28 },
    ],
  },
  assets: inmoAssets,
  leads: inmoLeads,
  opps: inmoOpps,
  tasks: inmoTasks,
  sales: [
    { id: "s1", date: "23/09/2026", op: "Venta", asset: "a7", agent: DT, value: 165000, commPct: 4, splits: [["Oficina", "Oficina", 50], [DT, "Agente vendedor", 30], [LF, "Agente comprador", 20]] },
    { id: "s2", date: "17/09/2026", op: "Venta", asset: "a1", title: "Departamento 2 amb en Chauvín", agent: LF, value: 96000, commPct: 4, splits: [["Oficina", "Oficina", 50], [LF, "Agente vendedor", 35], ["Gustavo Leiva", "Referente", 15]] },
    { id: "s3", date: "15/09/2026", op: "Alquiler", asset: "a8", title: "Departamento 1 amb en Plaza Mitre", agent: MR, value: 800, commMonths: 2, splits: [["Oficina", "Oficina", 60], [MR, "Agente vendedor", 40]] },
    { id: "s4", date: "09/09/2026", op: "Venta", asset: "a2", title: "Casa 3 amb en Punta Mogotes", agent: SV, value: 142000, commPct: 4, splits: [["Oficina", "Oficina", 50], [SV, "Agente vendedor", 30], ["Inmobiliaria Costa", "Inmobiliaria externa", 20]] },
  ],
  pedidos: [
    { name: "Gabriela Ortiz", phone: "+54 223 555-1102", criteria: "Departamento · 2 a 3 amb · Güemes, Plaza Colón", budget: "US$ 120.000", tol: "Hasta 10% más", matches: 4, match: "Cumple todo", status: "Activo", owner: PG, created: "24/09", src: "WhatsApp" },
    { name: "Federico Luna", phone: "+54 223 555-1148", criteria: "Casa · 4+ amb · cochera · Los Troncos, San Carlos", budget: "US$ 210.000", tol: "Precio exacto", matches: 2, match: "Cumple 4 de 5", status: "Activo", owner: DT, created: "23/09", src: "Referido" },
    { name: "Micaela Ferreyra", phone: "+54 223 555-1187", criteria: "PH · 3 amb · patio · apto crédito", budget: "US$ 140.000", tol: "Hasta 10% más", matches: 3, match: "Cumple todo", status: "Activo", owner: SV, created: "21/09", src: "Zonaprop" },
    { name: "Hernán Castro", phone: "+54 223 555-1203", criteria: "Local comercial · Centro · Alquiler", budget: "US$ 1.500/mes", tol: "Hasta 20% más", matches: 0, match: "No cumple", status: "Pausado", owner: MR, created: "15/09", src: "Sitio Web" },
    { name: "Laura Benedetti", phone: "+54 223 555-1266", criteria: "Departamento · 1 amb · frente al mar", budget: "US$ 85.000", tol: "Precio exacto", matches: 1, match: "Cumple 3 de 5", status: "Cerrado", owner: LF, created: "02/09", src: "Mercado Libre" },
  ],
  tasaciones: [
    { owner: "Roberto Giménez", addr: "Alvarado 2150, 4°B", status: "Tasada", value: "US$ 112.000", suggested: "US$ 118.000", m2: "US$ 1.931/m²", who: DT, auth: null, date: "24/09" },
    { owner: "Silvia Marchetti", addr: "Chile 1432 (PH)", status: "Captada", value: "US$ 134.000", suggested: "US$ 138.000", m2: "US$ 1.643/m²", who: SV, auth: "Vigente", date: "20/09" },
    { owner: "Jorge Albornoz", addr: "Olavarría 2890", status: "Visitada", value: "—", suggested: "—", who: MR, auth: null, date: "25/09" },
    { owner: "Ana Paula Ríos", addr: "Av. Colón 1850, 9°A", status: "Solicitada", value: "—", suggested: "—", who: LF, auth: null, date: "25/09" },
    { owner: "Marcelo Duarte", addr: "Formosa 450", status: "Captada", value: "US$ 158.000", suggested: "US$ 165.000", m2: "US$ 1.031/m²", who: DT, auth: "Vence 08/10", date: "02/09" },
    { owner: "Patricia Lema", addr: "Güemes 3120, 2°C", status: "Perdida", value: "US$ 99.000", suggested: "US$ 104.000", who: PG, auth: null, date: "29/08", lost: "Captó otra inmobiliaria" },
  ],
  llaves: [
    { code: "PC-12", color: "#ef4444", prop: "Depto · Plaza Colón", status: "Prestada", holder: LF, since: "hoy 09:40", back: "hoy 13:00", owner: "Propietario", copies: 2 },
    { code: "SJ-04", color: "#3b82f6", prop: "Casa · San Juan", status: "En oficina", holder: null, owner: "Propietario", copies: 3 },
    { code: "LT-07", color: "#22c55e", prop: "PH · Los Troncos", status: "Prestada", holder: SV, since: "ayer 17:10", back: "ayer 19:00", overdue: true, owner: "Propietario", copies: 1 },
    { code: "GU-21", color: "#eab308", prop: "Depto · Güemes", status: "En oficina", holder: null, owner: "Administración", copies: 2 },
    { code: "TV-02", color: "#8b5cf6", prop: "Oficina · Terminal", status: "En oficina", holder: null, owner: "Propietario", copies: 4 },
    { code: "VA-09", color: "#f97316", prop: "Depto · Playa Varese", status: "Perdida", holder: null, owner: "Propietario", copies: 1 },
  ],
  permutas: [
    { client: "Lucas Romano", item: "Depto 1 amb en Chauvín · 36 m²", value: "US$ 68.000", status: "Tasado", by: MR, date: "23/09" },
    { client: "Nicolás Paz", item: "Monoambiente en La Perla · 30 m²", value: "US$ 52.000", status: "Aceptado", by: LF, date: "19/09" },
    { client: "Julieta Sosa", item: "Terreno en Sierra de los Padres · 600 m²", value: "—", status: "Pendiente", by: PG, date: "21/09" },
    { client: "Carlos Medina", item: "Cochera en Centro", value: "US$ 14.000", status: "Rechazado", by: DT, date: "11/09" },
  ],
  goals: { companyGoal: 520000, sold: 403000, daysLeft: 5, daysDone: 25, month: "septiembre 2026", sellers: [
    { name: LF, goal: 120000, sold: 128400 }, { name: DT, goal: 110000, sold: 115300 }, { name: MR, goal: 110000, sold: 87200 },
    { name: SV, goal: 100000, sold: 49600 }, { name: PG, goal: 80000, sold: 22500 },
  ] },
  integ: { connected: 4, total: 6, tokko: true, ml: "INMOBILIARIADEMO" },
};

// ════════════════════════════════════════════════════════════════════════════
//  CONCESIONARIA
// ════════════════════════════════════════════════════════════════════════════
const FA = "Fernando Acosta", DR = "Diego Ramírez", CH = "Camila Herrera", NB = "Nahuel Bustos";

const autoAssets = [
  { id: "v1", title: "Fiat Cronos Drive 1.3 CVT", short: "Cronos Drive CVT", price: 27950000, cur: "ARS", zone: "0km · Sucursal Centro", attrs: ["Fiat Cronos", "2026", "0 km"], status: "Disponible", img: ["#8b1e2d", "#4a0f18"], team: [FA, DR] },
  { id: "v2", title: "Fiat Pulse Audace 1.0 Turbo", short: "Pulse Audace", price: 33400000, cur: "ARS", zone: "0km · Sucursal Centro", attrs: ["Fiat Pulse", "2026", "0 km"], status: "Disponible", img: ["#3a4a5c", "#1c2530"], team: [CH] },
  { id: "v3", title: "Toyota Hilux SRV 2.8 TDI 4x4 AT", short: "Hilux SRV 4x4", price: 42000, cur: "USD", zone: "Usados · Mar del Plata", attrs: ["Toyota Hilux", "2023", "35.000 km"], status: "Disponible", img: ["#4a5568", "#2d3748"], team: [FA] },
  { id: "v4", title: "Toyota Corolla Cross SEG HEV", short: "Corolla Cross HEV", price: 38500, cur: "USD", zone: "Usados · Mar del Plata", attrs: ["Toyota Corolla Cross", "2024", "8.000 km"], status: "Reservado", img: ["#6d8aa8", "#3d5a72"], team: [CH] },
  { id: "v5", title: "VW Amarok V6 Extreme 3.0 TDI", short: "Amarok V6", price: 52000, cur: "USD", zone: "Usados · Mar del Plata", attrs: ["Volkswagen Amarok", "2022", "45.000 km"], status: "Disponible", img: ["#3a3e44", "#1f2226"], team: [DR] },
  { id: "v6", title: "Peugeot 208 Feline 1.6 Tiptronic", short: "208 Feline", price: 16500, cur: "USD", zone: "Usados · Mar del Plata", attrs: ["Peugeot 208", "2022", "29.000 km"], status: "Vendido", img: ["#94708f", "#5c3f5e"], team: [NB] },
  { id: "v7", title: "Fiat Toro Volcano 2.0 AT9 4x4", short: "Toro Volcano", price: 47800000, cur: "ARS", zone: "0km · Sucursal Centro", attrs: ["Fiat Toro", "2026", "0 km"], status: "Agotado", img: ["#8a7056", "#4a3d31"], team: [DR] },
  { id: "v8", title: "Fiat Strada Freedom 1.3 CD", short: "Strada Freedom", price: 25300000, cur: "ARS", zone: "0km · Sucursal Centro", attrs: ["Fiat Strada", "2026", "0 km"], status: "Disponible", img: ["#6f8a63", "#3b4a33"], team: [NB] },
];

const autoLeads = [
  { id: "l1",  name: "Pablo Suárez",     email: "pablo.suarez@gmail.com", phone: "+54 223 555-0142", src: "Meta Ads",      status: "NEW",       temp: "hot",  owner: FA, date: "25/09/2026", sla: { live: true, min: 11 }, asset: "v1", campaign: "0km · Cronos y Pulse" },
  { id: "l2",  name: "Julieta Navarro",  email: "juli.navarro@gmail.com", phone: "+54 223 555-0188", src: "Google Ads",    status: "CONTACTED", temp: "mid",  owner: DR, date: "25/09/2026", sla: { min: 9 }, asset: "v5", campaign: "Búsqueda · Usados certificados" },
  { id: "l3",  name: "Marcos Quiroga",   email: "mquiroga@gmail.com",     phone: "+54 223 555-0211", src: "WhatsApp",      status: "NEW",       temp: "none", owner: CH, date: "25/09/2026", sla: { live: true, min: 64 }, asset: "v3" },
  { id: "l4",  name: "Daniela Sosa",     email: "d.sosa@gmail.com",       phone: "+54 223 555-0309", src: "Meta Ads",      status: "QUALIFIED", temp: "hot",  owner: FA, date: "24/09/2026", sla: { min: 5 }, asset: "v4", campaign: "0km · Cronos y Pulse" },
  { id: "l5",  name: "Rocío Méndez",     email: "rocio.mendez@gmail.com", phone: "+54 223 555-0533", src: "Mercado Libre", status: "NEW",       temp: "mid",  owner: CH, date: "24/09/2026", sla: { live: true, min: 176 }, asset: "v5", mlPending: true },
  { id: "l6",  name: "Gastón Pérez",     email: "gaston.perez@gmail.com", phone: "+54 223 555-0644", src: "Referido",      status: "CUSTOMER",  temp: "none", owner: NB, date: "23/09/2026", sla: { min: 21 }, asset: "v6" },
  { id: "l7",  name: "Hernán Vidal",     email: "hvidal@hotmail.com",     phone: "+54 223 555-0421", src: "Salón",         status: "QUALIFIED", temp: "hot",  owner: DR, date: "23/09/2026", sla: { min: 0 }, asset: "v1" },
  { id: "l8",  name: "Belén Acosta",     email: "belen.acosta@gmail.com", phone: "+54 223 555-0719", src: "Mercado Libre", status: "CONTACTED", temp: "cold", owner: DR, date: "22/09/2026", sla: { min: 48 }, asset: "v3" },
  { id: "l9",  name: "Ignacio Ferro",    email: "iferro@gmail.com",       phone: "+54 223 555-0752", src: "Sitio Web",     status: "CONTACTED", temp: "mid",  owner: NB, date: "22/09/2026", sla: { min: 16 }, asset: "v8" },
  { id: "l10", name: "Sabrina Molina",   email: "sabri.molina@gmail.com", phone: "+54 223 555-0810", src: "Meta Ads",      status: "QUALIFIED", temp: "mid",  owner: CH, date: "21/09/2026", sla: { min: 26 }, asset: "v2", campaign: "Mensajes · Test drive" },
  { id: "l11", name: "Emiliano Rossi",   email: "erossi@gmail.com",       phone: "+54 223 555-0877", src: "Teléfono",      status: "QUALIFIED", temp: "hot",  owner: FA, date: "19/09/2026", sla: { min: 4 }, asset: "v8" },
  { id: "l12", name: "Carolina Vera",    email: "caro.vera@gmail.com",    phone: "+54 223 555-0931", src: "Google Ads",    status: "CONTACTED", temp: "cold", owner: NB, date: "18/09/2026", sla: { min: 140 }, asset: "v2" },
];

const autoOpps = [
  { id: "o1",  lead: "l1",  stage: "INTERESTED",           asset: "v1", created: "25/09", days: 0 },
  { id: "o3",  lead: "l3",  stage: "INTERESTED",           asset: "v3", created: "25/09", days: 0 },
  { id: "o5",  lead: "l5",  stage: "INTERESTED",           asset: "v5", created: "24/09", days: 1 },
  { id: "o9",  lead: "l9",  stage: "IN_FOLLOW_UP",         asset: "v8", created: "22/09", days: 3, contacted: true },
  { id: "o2",  lead: "l2",  stage: "IN_FOLLOW_UP",         asset: "v5", created: "25/09", days: 0, contacted: true },
  { id: "o4",  lead: "l4",  stage: "TEST_DRIVE_SCHEDULED", asset: "v4", created: "24/09", days: 1, visit: "Sáb 26/09 · 10:00" },
  { id: "o10", lead: "l10", stage: "TEST_DRIVE_COMPLETED", asset: "v2", created: "21/09", days: 5 },
  { id: "o8",  lead: "l8",  stage: "TEST_DRIVE_COMPLETED", asset: "v3", created: "22/09", days: 2 },
  { id: "o7",  lead: "l7",  stage: "OFFER_MADE",           asset: "v1", created: "23/09", days: 2, price: 27100000, docs: 1 },
  { id: "o11", lead: "l11", stage: "RESERVED",             asset: "v8", created: "19/09", days: 3, price: 25300000, deposit: 1500000, docs: 2 },
  { id: "o6",  lead: "l6",  stage: "SALE_COMPLETED",       asset: "v6", created: "23/09", days: 0, price: 16500 },
  { id: "o12", lead: "l12", stage: "LOST",                 asset: "v2", created: "18/09", days: 0, lost: "Problemas de financiación" },
];

const autoTasks = [
  { id: "t1", title: "Llamar a Pablo Suárez", client: "Pablo Suárez", type: "CALL", prio: "HIGH", status: "PENDING", day: 25, time: "10:00", owner: FA },
  { id: "t2", title: "Enviar presupuesto Amarok", client: "Julieta Navarro", type: "EMAIL", prio: "MEDIUM", status: "IN_PROGRESS", day: 25, time: "12:30", owner: DR },
  { id: "t3", title: "Recontactar a Belén Acosta", client: "Belén Acosta", type: "CALL", prio: "MEDIUM", status: "PENDING", day: 25, time: "16:00", owner: DR },
  { id: "t4", title: "Test drive · Corolla Cross HEV", client: "Daniela Sosa", type: "MEETING", prio: "HIGH", status: "PENDING", day: 26, time: "10:00", owner: FA, auto: true },
  { id: "t5", title: "Seguimiento de oferta", client: "Hernán Vidal", type: "FOLLOW_UP", prio: "MEDIUM", status: "PENDING", day: 24, time: "18:00", owner: DR },
  { id: "t6", title: "Aprobación de crédito · Strada", client: "Emiliano Rossi", type: "FOLLOW_UP", prio: "URGENT", status: "ON_HOLD", day: 23, time: "11:00", owner: FA },
  { id: "t7", title: "Entrega · Peugeot 208 Feline", client: "Gastón Pérez", type: "MEETING", prio: "HIGH", status: "COMPLETED", day: 22, time: "17:00", owner: NB },
  { id: "t8", title: "Subir fotos · Hilux SRV", client: null, type: "TASK", prio: "LOW", status: "COMPLETED", day: 21, time: "15:00", owner: FA },
  { id: "t9", title: "Reunión comercial semanal", client: null, type: "MEETING", prio: "MEDIUM", status: "COMPLETED", day: 21, time: "09:00", owner: CH },
  { id: "t10", title: "Mandar ficha técnica Pulse", client: "Sabrina Molina", type: "EMAIL", prio: "LOW", status: "PENDING", day: 22, time: "12:00", owner: CH },
];

export const DEMO_AUTO = {
  key: "auto",
  tenant: { name: "Concesionaria Demo", initials: "CD" },
  user: { name: "Fernando Acosta", initials: "FA", email: "fernando@concesionariademo.com", role: "Gerencia" },
  asset: { label: "Automóviles", singular: "Automóvil", icon: "car", newLabel: "Nuevo automóvil", lower: "automóviles" },
  keyStage: "Test drives realizados",
  agents: [FA, DR, CH, NB],
  stages: ["INTERESTED", "IN_FOLLOW_UP", "TEST_DRIVE_SCHEDULED", "TEST_DRIVE_COMPLETED", "OFFER_MADE", "RESERVED", "CLOSING", "SALE_COMPLETED", "LOST"],
  nav: ["inicio", "leads", "assets", "pipeline", "presupuestos", "tareas", "permutas", "ventas", "objetivos"],
  kpis: [
    { id: "leads", label: "Leads nuevos", value: 96, delta: 18.2, diff: "+15", icon: "users" },
    { id: "opps", label: "Oportunidades activas", value: 41, delta: 9.8, diff: "+4", icon: "target" },
    { id: "conv", label: "Tasa de conversión", value: 13.3, delta: 1.4, diff: "+1,4 pp", icon: "trending", suffix: "%", decimals: 1 },
  ],
  series: byDay([6, 8, 5, 7, 6, 9, 6, 8, 7, 10, 6, 5, 8, 5], [2, 3, 2, 3, 2, 4, 2, 3, 3, 4, 2, 2, 3, 2]),
  convSeries: [10.8, 11.2, 11.0, 11.9, 12.1, 12.0, 12.6, 12.4, 12.9, 13.0, 12.8, 13.3, 13.1, 13.3],
  funnel: [["INTERESTED", 22], ["IN_FOLLOW_UP", 16], ["TEST_DRIVE_SCHEDULED", 12], ["TEST_DRIVE_COMPLETED", 8], ["OFFER_MADE", 5], ["RESERVED", 4], ["SALE_COMPLETED", 4]],
  origins: [["Meta Ads", 32], ["Mercado Libre", 22], ["Google Ads", 20], ["WhatsApp", 12], ["Salón", 7], ["Referido", 3]],
  assetStatus: [["Disponible", 31], ["Reservado", 6], ["Agotado", 3]],
  assetTotal: 40,
  ads: {
    spendUSD: 1520, leads: 86, impressions: 212600, clicks: 4480, attributedSales: 6, revenueUSD: 9800,
    channels: [
      { p: "Meta Ads", spend: 1000, leads: 62, sales: 4 },
      { p: "Google Ads", spend: 520, leads: 24, sales: 2 },
    ],
    pivot: [
      { p: "Meta Ads", name: "0km · Cronos y Pulse", spend: 700, imp: 104200, clicks: 2210, leads: 44, children: [
        { name: "Ad set — Intereses autos", spend: 420, imp: 61800, clicks: 1320, leads: 27, children: [
          { name: "Video · Cronos en ruta", spend: 250, imp: 36900, clicks: 810, leads: 17 },
          { name: "Placa · Financiación 0%", spend: 170, imp: 24900, clicks: 510, leads: 10 },
        ] },
        { name: "Ad set — Lookalike clientes", spend: 280, imp: 42400, clicks: 890, leads: 17 },
      ] },
      { p: "Meta Ads", name: "Mensajes · Test drive", spend: 300, imp: 51900, clicks: 1030, leads: 18 },
      { p: "Google Ads", name: "Búsqueda · Usados certificados", spend: 520, imp: 56500, clicks: 1240, leads: 24 },
    ],
  },
  assets: autoAssets,
  leads: autoLeads,
  opps: autoOpps,
  tasks: autoTasks,
  sales: [
    { id: "s1", date: "23/09/2026", asset: "v6", agent: NB, plate: "AE 412 KD", list: 17200, value: 16500, cur: "USD", tradeIn: null, margin: 1480, comm: 330, status: "Aprobada" },
    { id: "s2", date: "20/09/2026", asset: "v1", agent: FA, plate: "0km", list: 27950000, value: 27400000, cur: "ARS", tradeIn: { v: 9800000, t: "VW Gol Trend 2017" }, margin: 1920000, comm: 548000, status: "Aprobada" },
    { id: "s3", date: "18/09/2026", asset: "v8", agent: DR, plate: "0km", list: 25300000, value: 23900000, cur: "ARS", tradeIn: null, margin: 1150000, comm: 478000, status: "Pendiente de aprobación" },
    { id: "s4", date: "12/09/2026", asset: "v3", title: "Toyota Hilux SR 2.4 4x2", agent: CH, plate: "AD 877 LM", list: 33500, value: 32000, cur: "USD", tradeIn: { v: 11000, t: "Ford Ranger XL 2016" }, margin: -300, comm: 320, status: "Aprobada" },
  ],
  presupuestos: [
    { num: "#0014", client: "Julieta Navarro", vehicles: "VW Amarok V6 Extreme", more: 0, total: "US$ 52.000", status: "Vigente", seller: DR, views: 3, last: "hace 2 horas", date: "25/09" },
    { num: "#0013", client: "Hernán Vidal", vehicles: "Fiat Cronos Drive 1.3 CVT", more: 1, total: "$ 27.100.000", status: "Vigente", seller: DR, views: 1, last: "ayer", date: "23/09" },
    { num: "#0012", client: "Sabrina Molina", vehicles: "Fiat Pulse Audace 1.0 Turbo", more: 0, total: "$ 33.400.000", status: "Vigente", seller: CH, views: 5, last: "hace 20 min", date: "22/09" },
    { num: "Borrador", client: "Pablo Suárez", vehicles: "Fiat Cronos Drive 1.3 CVT", more: 0, total: "$ 27.950.000", status: "Borrador", seller: FA, views: 0, last: null, date: "25/09" },
    { num: "#0011", client: "Emiliano Rossi", vehicles: "Fiat Strada Freedom 1.3 CD", more: 0, total: "$ 25.300.000", status: "Vigente", seller: FA, views: 2, last: "hace 3 días", date: "19/09" },
    { num: "#0009", client: "Carolina Vera", vehicles: "Fiat Pulse Audace 1.0 Turbo", more: 0, total: "$ 32.900.000", status: "Vencido", seller: NB, views: 0, last: null, date: "18/08" },
  ],
  permutas: [
    { client: "Hernán Vidal", item: "VW Gol Trend 1.6 2017 · 98.000 km", value: "$ 9.800.000", status: "Aceptado", by: DR, date: "23/09" },
    { client: "Emiliano Rossi", item: "Fiat Palio 1.4 2015 · 121.000 km", value: "$ 6.900.000", status: "Tasado", by: FA, date: "20/09" },
    { client: "Belén Acosta", item: "Chevrolet Onix LT 2019 · 64.000 km", value: "—", status: "Pendiente", by: DR, date: "24/09" },
    { client: "Carlos Medina", item: "Ford Ranger XL 2.2 2016 · 180.000 km", value: "US$ 11.000", status: "Ingresado", by: CH, date: "12/09" },
    { client: "Sergio Paredes", item: "Renault Kangoo 2012 · 240.000 km", value: "$ 4.100.000", status: "Rechazado", by: NB, date: "08/09" },
  ],
  goals: { companyGoal: 36, sold: 29, units: true, daysLeft: 5, daysDone: 25, month: "septiembre 2026", sellers: [
    { name: FA, goal: 10, sold: 11 }, { name: DR, goal: 10, sold: 9 }, { name: CH, goal: 8, sold: 6 }, { name: NB, goal: 8, sold: 3 },
  ] },
  integ: { connected: 3, total: 5, tokko: false, ml: "CONCESIONARIADEMO" },
};

// ── Actualizaciones: títulos reales del changelog de sept. 2026 ─────────────
export const UPDATES = [
  { date: "26/09/2026", title: "Al cambiar de etapa se agenda la próxima tarea y la anterior se cierra sola", unread: true },
  { date: "25/09/2026", title: "Las cards del pipeline se tiñen con la temperatura de la oportunidad", unread: true },
  { date: "25/09/2026", title: "El lead de un anuncio entra con el auto o la propiedad que le interesa", unread: true },
  { date: "25/09/2026", title: "El lead que nadie contacta en N horas hábiles salta a otro vendedor" },
  { date: "24/09/2026", title: "Temperatura en las oportunidades: caliente, medio y frío" },
  { date: "22/09/2026", title: "Aviso cuando el cliente abre el presupuesto" },
  { date: "21/09/2026", title: "Tarea automática por activo al agendar un test drive o una visita" },
  { date: "19/09/2026", title: "Las conversaciones iniciadas de Meta cuentan en el costo por lead" },
  { date: "13/09/2026", title: "Presupuestos con link público, PDF y fichas técnicas" },
  { date: "11/09/2026", title: "Roles editables por empresa con permisos granulares" },
];
