// Shared data for dashboard + sections
const DATASETS = {
  concesionaria: {
    label: "Concesionaria",
    sub: "Toyota · Mar del Plata",
    totals: {
      gasto: { v: 4.2, unit: "M", sub: "USD invertidos en 90 días", delta: -12 },
      leads: { v: 1847, unit: "", sub: "nuevos este mes", delta: 23 },
      cpl:   { v: 12.4, unit: "k", sub: "meta $15k", delta: -8 },
      conv:  { v: 4.7, unit: "%", sub: "de lead a patente", delta: -0.3 },
    },
    spark: [12, 18, 14, 22, 28, 24, 32, 30, 36, 42, 38, 46, 44, 52, 48, 58, 55, 62, 68, 64, 71, 74, 70, 78, 82, 86, 84, 92, 88, 96],
    channels: [
      { k: "Meta Ads", pct: 48, color: "#3c6df0" },
      { k: "Google",   pct: 34, color: "#ff7a59" },
      { k: "TikTok",   pct: 12, color: "#111" },
      { k: "Orgánico", pct:  6, color: "#9a9689" },
    ],
    campaigns: [
      { name: "Hilux SR5 — Marzo",        plat: "Meta Ads", spend: 890,  leads: 84,  cpl: 10.6, status: "ok"   },
      { name: "Corolla Cross CVT",        plat: "Google",   spend: 720,  leads: 52,  cpl: 13.8, status: "ok"   },
      { name: "Usados Premium",           plat: "Meta Ads", spend: 1120, leads: 127, cpl:  8.8, status: "hot"  },
      { name: "Plan Ahorro Yaris",        plat: "Google",   spend: 480,  leads: 41,  cpl: 11.7, status: "ok"   },
      { name: "RAV4 Hybrid — Awareness",  plat: "TikTok",   spend: 320,  leads:  9,  cpl: 35.5, status: "warn" },
      { name: "Retargeting Test Drive",   plat: "Meta Ads", spend: 210,  leads: 38,  cpl:  5.5, status: "hot"  },
    ],
    leads: [
      { name: "Martín Acuña",     car: "Hilux SR5",      src: "Meta",   stage: "Test drive",  score: 92, when: "hace 6m" },
      { name: "Lucía Fernández",  car: "Corolla Cross",  src: "Google", stage: "Cotización",  score: 78, when: "hace 18m" },
      { name: "Diego Pereyra",    car: "Yaris XLS",      src: "Meta",   stage: "Contactado",  score: 64, when: "hace 42m" },
      { name: "Florencia Ríos",   car: "RAV4 Hybrid",    src: "TikTok", stage: "Nuevo",       score: 58, when: "hace 1h" },
      { name: "Javier Molina",    car: "Usado — Etios",  src: "Google", stage: "Cerrado ✓",   score: 99, when: "hace 2h" },
      { name: "Camila Ozán",      car: "Corolla GR",     src: "Meta",   stage: "Negociación", score: 81, when: "hace 3h" },
    ],
    alerts: [
      { level: "high", title: "CPL disparado en RAV4 Hybrid — TikTok", body: "$35.5k vs promedio $13.2k. Se triplicó en 48h.", when: "hace 12m" },
      { level: "med",  title: "Gasto ↑ sin clicks en Plan Ahorro",     body: "Budget consumido 94% y CTR cayó -22%.",            when: "hace 2h"  },
      { level: "low",  title: "Hilux SR5 — Marzo cierra hoy",          body: "Queda 6% de budget. Sugerencia: duplicar.",        when: "hace 5h"  },
    ],
    reports: {
      weekly: ["Semana 12 — Leads +14%, CPL -9%", "Semana 11 — Usados Premium supera proyección", "Semana 10 — Lanzamiento Corolla GR"],
      bench: { you: 4.7, market: 2.8 },
    },
  },
  inmobiliaria: {
    label: "Inmobiliaria",
    sub: "Grupo Costa · Mar del Plata",
    totals: {
      gasto: { v: 1.8, unit: "M", sub: "USD invertidos en 90 días", delta: -4 },
      leads: { v: 942,  unit: "", sub: "consultas este mes", delta: 17 },
      cpl:   { v: 9.2,  unit: "k", sub: "meta $12k",       delta: -14 },
      conv:  { v: 3.1,  unit: "%", sub: "de consulta a seña", delta: 0.4 },
    },
    spark: [20, 24, 22, 28, 26, 32, 30, 36, 34, 40, 38, 42, 46, 44, 50, 48, 54, 52, 58, 56, 62, 60, 66, 64, 70, 68, 74, 72, 78, 80],
    channels: [
      { k: "Portales",  pct: 42, color: "#3c6df0" },
      { k: "Meta Ads",  pct: 31, color: "#ff7a59" },
      { k: "Referidos", pct: 18, color: "#111" },
      { k: "Orgánico",  pct:  9, color: "#9a9689" },
    ],
    campaigns: [
      { name: "Departamentos Centro — 1A", plat: "ZonaProp", spend: 420, leads: 78, cpl:  5.4, status: "hot"  },
      { name: "Casas Barrio Parque",       plat: "Meta Ads", spend: 380, leads: 46, cpl:  8.3, status: "ok"   },
      { name: "Monoambientes Inversores",  plat: "Argenprop",spend: 240, leads: 31, cpl:  7.7, status: "ok"   },
      { name: "Pozo Torres del Mar",       plat: "Meta Ads", spend: 560, leads: 22, cpl: 25.4, status: "warn" },
      { name: "Alquileres Temporarios",    plat: "Google",   spend: 180, leads: 54, cpl:  3.3, status: "hot"  },
    ],
    leads: [
      { name: "Sofía Iglesias",  car: "Depto 2 amb · Centro",    src: "ZonaProp", stage: "Visita agendada", score: 88, when: "hace 9m" },
      { name: "Ramiro Salas",    car: "Casa · Parque Luro",      src: "Meta",     stage: "Cotización",      score: 72, when: "hace 22m" },
      { name: "Alejo Vera",      car: "PH · Güemes",             src: "Portal",   stage: "Nuevo",           score: 60, when: "hace 48m" },
      { name: "Paula Ortiz",     car: "Depto pozo · Torre Mar",  src: "Meta",     stage: "Negociación",     score: 84, when: "hace 1h" },
      { name: "Juan Benítez",    car: "Casa · Alem",             src: "Referido", stage: "Cerrado ✓",       score: 99, when: "hace 3h" },
    ],
    alerts: [
      { level: "high", title: "Pozo Torres del Mar — CPL 3x", body: "Creatividad 'vista al mar' saturada. Rotar.", when: "hace 18m" },
      { level: "med",  title: "Consultas por WhatsApp sin asignar", body: "7 leads nuevos hace >30min sin dueño.", when: "hace 45m" },
      { level: "low",  title: "Visitas del fin de semana", body: "12 agendadas · confirmar 48hs antes.", when: "hace 4h"  },
    ],
    reports: {
      weekly: ["Semana 12 — Centro sigue liderando (+18%)", "Semana 11 — Temporarios: ROI 4.2x", "Semana 10 — Nuevo inventario Alem"],
      bench: { you: 3.1, market: 1.9 },
    },
  },
};

const SERVICES = [
  {
    k: "CRM",
    name: "CRM para inmobiliarias",
    body: "Pipeline visual, asignación automática y seguimiento de cada lead en un sistema pensado para el rubro. Configurable, no a medida — arrancás en días, no en meses.",
    bullets: ["Pipeline visual por etapa", "Asignación automática", "Permisos por rol"],
  },
  {
    k: "DASH",
    name: "Dashboards analíticos",
    body: "Paneles que unifican todas tus fuentes de datos en un solo lugar. Con alertas, reportes automáticos y la verdad de los números.",
    bullets: ["Meta + Google + CRM en uno", "Alertas por Slack/WhatsApp", "Reportes PDF automáticos"],
  },
  {
    k: "API",
    name: "Integraciones & APIs",
    body: "Conectamos Meta, Google, WhatsApp Business, CRMs externos y cualquier API que tu negocio necesite. Todo sincronizado en tiempo real.",
    bullets: ["Webhooks bidireccionales", "Sync < 60s", "Retry con cola"],
  },
  {
    k: "IA",
    name: "Automatizaciones + IA",
    body: "Procesos que antes eran manuales ahora corren solos. Sync de datos, alertas, asignaciones, y modelos de IA donde realmente suman.",
    bullets: ["Scoring de leads con IA", "Respuestas automáticas", "Detección de anomalías"],
  },
];

const PROCESS = [
  {
    n: "01", tag: "CONOCEMOS", name: "Entendemos tu inmobiliaria",
    body: "Cómo trabaja tu equipo hoy, qué portales usás, qué está roto. Una reunión corta, sin humo.",
    term: [
      { p: "$", t: "onboarding --cliente", w: 1200 },
      { p: ">", t: "¿Cómo entra un lead hoy?" },
      { p: ">", t: "¿Qué portales usás?" },
      { p: ">", t: "¿Cuántos vendedores?" },
      { p: "//", t: "plan activado ✓" },
    ],
  },
  {
    n: "02", tag: "CONFIGURAMOS", name: "Dejamos todo andando",
    body: "Conectamos tus portales, WhatsApp y mail. Importamos tus contactos. Configuramos alertas y reportes. Todo en una o dos semanas, no meses.",
    term: [
      { p: "$", t: "setup --inmobiliaria", w: 800 },
      { p: "├", t: "ZonaProp + Argenprop ✓" },
      { p: "├", t: "WhatsApp Business ✓" },
      { p: "├", t: "Importados: 1.240 contactos" },
      { p: "└", t: "Usuarios: 6 vendedores" },
      { p: "//", t: "listo para operar · 9 días" },
    ],
  },
  {
    n: "03", tag: "CONSTRUIMOS", name: "Entregas semanales reales",
    body: "Deploy a staging cada viernes. Repo privado en GitHub desde el día 1. Ves avances, no promesas.",
    n: "03", tag: "CAPACITAMOS", name: "Tu equipo usando el sistema",
    body: "Capacitación en vivo con tu equipo. Videos cortos para consultar después. Manual en español. Arrancan a usar el sistema desde el día 1.",
    term: [
      { p: "$", t: "onboarding --users=6", w: 800 },
      { p: ">", t: "Sesión grupal: 45 min" },
      { p: ">", t: "Videos tutoriales: 12" },
      { p: ">", t: "Manual PDF + FAQ interno" },
      { p: "//", t: "equipo operativo ✓" },
    ],
  },
  {
    n: "04", tag: "ACOMPAÑAMOS", name: "Mejoras cada mes",
    body: "Nuevas features, integraciones y mejoras liberadas periódicamente. El sistema crece con el uso. Soporte por WhatsApp y email.",
    term: [
      { p: "$", t: "status --all", w: 800 },
      { p: ">", t: "Uptime 99.98%" },
      { p: ">", t: "Updates mensuales" },
      { p: ">", t: "Soporte < 4h" },
      { p: "//", t: "tu CRM evoluciona ✓" },
    ],
  },
];

const TESTIMONIALS = [
  {
    quote: "Antes perdíamos consultas en los WhatsApps personales de cada vendedor. Ahora cada lead queda registrado, asignado y con seguimiento. Tengo visibilidad real del pipeline por primera vez.",
    who: "Cliente piloto",
    where: "Inmobiliaria · Mar del Plata",
    init: "●",
    metric: { v: "100%", k: "Leads trazados" },
    real: true,
  },
];

// Resultados esperados basados en el caso piloto y benchmarks de mercado
const EXPECTED_RESULTS = [
  {
    metric: { v: "-62%", k: "Leads perdidos" },
    desc: "Consultas que antes caían en chats personales, hoy se capturan y asignan automáticamente.",
    vertical: "Inmobiliarias",
  },
  {
    metric: { v: "+43%", k: "Cierres mes/mes" },
    desc: "Con pipeline visible y asignación inteligente, el equipo cierra más en menos tiempo.",
    vertical: "Concesionarias",
  },
  {
    metric: { v: "10h", k: "Ahorradas/semana" },
    desc: "Reportes automáticos a clientes, sin armar Excel ni copiar datos entre plataformas.",
    vertical: "Agencias de marketing",
  },
  {
    metric: { v: "4 → 1", k: "Plataformas a revisar" },
    desc: "ZonaProp, Argenprop, Tokko y WhatsApp integrados en un solo tablero.",
    vertical: "Inmobiliarias",
  },
];

const PRICING = [
  {
    name: "Starter", price: "USD 120", period: "/mes", tag: "Para empezar",
    body: "Para equipos que necesitan ver qué está pasando hoy.",
    items: ["Dashboard con métricas clave", "Integraciones básicas (Meta + Google)", "Alertas automáticas", "Hasta 3 usuarios", "Soporte por email"],
    cta: "Empezar",
  },
  {
    name: "Growth", price: "USD 240", period: "/mes", tag: "El más elegido", featured: true,
    body: "CRM completo + dashboard + automatizaciones. Escala con tu equipo.",
    items: ["CRM completo para tu inmobiliaria", "Dashboard + alertas inteligentes", "Integraciones bidireccionales", "Automatizaciones + 1 modelo IA", "Hasta 10 usuarios", "Nuevas features cada mes", "Soporte prioritario"],
    cta: "Empezar ahora",
  },
  {
    name: "Scale", price: "A cotizar", period: "", tag: "Empresa + multi-sede",
    body: "Para operaciones con múltiples sucursales y necesidades específicas.",
    items: ["Todo Growth +", "Multi-empresa / multi-zona", "SLA firmado", "Auditorías y logs", "Usuarios ilimitados", "Soporte dedicado 24/7", "Roadmap compartido"],
    cta: "Hablemos",
  },
];

const FAQ = [
  { q: "¿Cuánto tarda en estar andando?", a: "Setup inicial: 1-2 semanas. Configuramos integraciones, importamos tus datos si los tenés y capacitamos al equipo. Empezás a usar el sistema desde el día 1 con la configuración base." },
  { q: "¿De quién son mis datos?", a: "Tuyos. 100%. Podés exportarlos en cualquier momento — CSV, JSON o backup completo de la base. Si preferís tener el sistema en tu propio servidor (on-premise), también se puede. Sin lock-in, sin letra chica." },,
  { q: "¿Trabajan con empresas fuera de Mar del Plata?", a: "Sí. Trabajamos 100% remoto con reuniones semanales y entregas asincrónicas. La ubicación no es limitante — si tenés buena conexión y decisores disponibles, arrancamos." },
  { q: "¿Qué pasa si quiero cortar el servicio?", a: "Cortás cuando quieras — contrato mensual sin permanencia. Te exportamos todos tus datos en formato estándar (CSV, JSON). Sin lock-in." },
  { q: "¿El precio incluye nuevas features?", a: "Sí. El CRM se va ampliando mes a mes con mejoras y nuevas integraciones. Además, cada cliente puede pedir features específicas — las que benefician a varios, las incluimos en el roadmap." },
];

const CLIENTS = ["Grupo Costa", "Toyota MdP", "InmoSur", "Nordelta Motors", "AutoPlus", "Torre Mar", "Sede Norte", "Benetti"];

window.DATASETS = DATASETS;
window.SERVICES = SERVICES;
window.PROCESS = PROCESS;
window.TESTIMONIALS = TESTIMONIALS;
window.EXPECTED_RESULTS = EXPECTED_RESULTS;
window.PRICING = PRICING;
window.FAQ = FAQ;
window.CLIENTS = CLIENTS;
