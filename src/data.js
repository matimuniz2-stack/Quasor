// Shared data for dashboard + sections

export const DATASETS = {
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
      { name: "Hilux SR5 · Marzo",        plat: "Meta Ads", spend: 890,  leads: 84,  cpl: 10.6, status: "ok"   },
      { name: "Corolla Cross CVT",        plat: "Google",   spend: 720,  leads: 52,  cpl: 13.8, status: "ok"   },
      { name: "Usados Premium",           plat: "Meta Ads", spend: 1120, leads: 127, cpl:  8.8, status: "hot"  },
      { name: "Plan Ahorro Yaris",        plat: "Google",   spend: 480,  leads: 41,  cpl: 11.7, status: "ok"   },
      { name: "RAV4 Hybrid · Awareness",  plat: "TikTok",   spend: 320,  leads:  9,  cpl: 35.5, status: "warn" },
      { name: "Retargeting Test Drive",   plat: "Meta Ads", spend: 210,  leads: 38,  cpl:  5.5, status: "hot"  },
    ],
    leads: [
      { name: "Martín Acuña",     car: "Hilux SR5",      src: "Meta",   stage: "Test drive",  score: 92, when: "hace 6m" },
      { name: "Lucía Fernández",  car: "Corolla Cross",  src: "Google", stage: "Cotización",  score: 78, when: "hace 18m" },
      { name: "Diego Pereyra",    car: "Yaris XLS",      src: "Meta",   stage: "Contactado",  score: 64, when: "hace 42m" },
      { name: "Florencia Ríos",   car: "RAV4 Hybrid",    src: "TikTok", stage: "Nuevo",       score: 58, when: "hace 1h" },
      { name: "Javier Molina",    car: "Usado · Etios",  src: "Google", stage: "Cerrado ✓",   score: 99, when: "hace 2h" },
      { name: "Camila Ozán",      car: "Corolla GR",     src: "Meta",   stage: "Negociación", score: 81, when: "hace 3h" },
    ],
    alerts: [
      { level: "high", title: "CPL disparado en RAV4 Hybrid · TikTok", body: "$35.5k vs promedio $13.2k. Se triplicó en 48h.", when: "hace 12m" },
      { level: "med",  title: "Inversión ↑ sin clicks en Plan Ahorro", body: "Budget consumido 94% y CTR cayó -22%.",            when: "hace 2h"  },
      { level: "low",  title: "Hilux SR5 · Marzo cierra hoy",          body: "Queda 6% de budget. Sugerencia: duplicar.",        when: "hace 5h"  },
    ],
    reports: {
      weekly: ["Semana 12 · Leads +14%, CPL -9%", "Semana 11 · Usados Premium supera proyección", "Semana 10 · Lanzamiento Corolla GR"],
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
      { name: "Departamentos Centro · 1A", plat: "Meta Ads", spend: 420, leads: 78, cpl:  5.4, status: "hot"  },
      { name: "Casas Barrio Parque",       plat: "Meta Ads", spend: 380, leads: 46, cpl:  8.3, status: "ok"   },
      { name: "Monoambientes Inversores",  plat: "Google",   spend: 240, leads: 31, cpl:  7.7, status: "ok"   },
      { name: "Pozo Torres del Mar",       plat: "Meta Ads", spend: 560, leads: 22, cpl: 25.4, status: "warn" },
      { name: "Alquileres Temporarios",    plat: "Google",   spend: 180, leads: 54, cpl:  3.3, status: "hot"  },
    ],
    leads: [
      { name: "Sofía Iglesias",  car: "Depto 2 amb · Centro",    src: "Meta",     stage: "Visita agendada", score: 88, when: "hace 9m" },
      { name: "Ramiro Salas",    car: "Casa · Parque Luro",      src: "Meta",     stage: "Cotización",      score: 72, when: "hace 22m" },
      { name: "Alejo Vera",      car: "PH · Güemes",             src: "Portal",   stage: "Nuevo",           score: 60, when: "hace 48m" },
      { name: "Paula Ortiz",     car: "Depto pozo · Torre Mar",  src: "Meta",     stage: "Negociación",     score: 84, when: "hace 1h" },
      { name: "Juan Benítez",    car: "Casa · Alem",             src: "Referido", stage: "Cerrado ✓",       score: 99, when: "hace 3h" },
    ],
    alerts: [
      { level: "high", title: "Pozo Torres del Mar · CPL 3x", body: "Creatividad 'vista al mar' saturada. Rotar.", when: "hace 18m" },
      { level: "med",  title: "Consultas por WhatsApp sin asignar", body: "7 leads nuevos hace >30min sin dueño.", when: "hace 45m" },
      { level: "low",  title: "Visitas del fin de semana", body: "12 agendadas · confirmar 48hs antes.", when: "hace 4h"  },
    ],
    reports: {
      weekly: ["Semana 12 · Centro sigue liderando (+18%)", "Semana 11 · Temporarios: ROI 4.2x", "Semana 10 · Nuevo inventario Alem"],
      bench: { you: 3.1, market: 1.9 },
    },
  },
};

export const SERVICES = [
  {
    k: "DASH",
    name: "Dashboards",
    body: "Una sola fuente para Meta, Google y tu CRM.",
    bullets: ["Multi-fuente unificada", "Alertas Slack/WhatsApp", "Reportes PDF automáticos"],
  },
  {
    k: "API",
    name: "Integraciones",
    body: "Cualquier API. Sync bidireccional en menos de 60s.",
    bullets: ["Cambios del portal en Quasor en < 60s", "Si el portal cae, los leads no se pierden", "Conectamos con cualquier endpoint"],
  },
  {
    k: "IA",
    name: "Automatizaciones",
    body: "Lo que antes hacías a mano, ahora es una notificación.",
    bullets: ["Alerta: lead respondió 2 veces sin asignar", "Auto-respuesta WhatsApp en < 30s", "Aviso si tu CPL se dispara 3x"],
  },
];

export const PROCESS = [
  {
    n: "01", tag: "CONOCEMOS", name: "Entendemos tu inmobiliaria",
    body: "Una reunión corta. Cómo trabajan, qué portales usan, qué está roto.",
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
    body: "Portales, WhatsApp, mail, contactos, alertas. Una o dos semanas. Sin meses.",
    term: [
      { p: "$", t: "setup --inmobiliaria", w: 800 },
      { p: "├", t: "Meta Lead Ads + Google Ads ✓" },
      { p: "├", t: "WhatsApp Business ✓" },
      { p: "├", t: "Importados: 1.240 contactos" },
      { p: "└", t: "Usuarios: 6 vendedores" },
      { p: "//", t: "listo para operar · 9 días" },
    ],
  },
  {
    n: "03", tag: "CAPACITAMOS", name: "Tu equipo usando el sistema",
    body: "Capacitación en vivo. Videos cortos. Operativos desde el día 1.",
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
    body: "Updates mensuales. Nuevas features e integraciones. Soporte por WhatsApp y mail.",
    term: [
      { p: "$", t: "status --all", w: 800 },
      { p: ">", t: "Uptime 99.98%" },
      { p: ">", t: "Updates mensuales" },
      { p: ">", t: "Soporte < 4h" },
      { p: "//", t: "tu CRM evoluciona ✓" },
    ],
  },
];

export const TESTIMONIALS = [
  {
    quote: "Antes perdíamos consultas en los WhatsApps personales de cada vendedor. Ahora cada lead queda registrado, asignado y con seguimiento. Tengo visibilidad real del pipeline por primera vez.",
    who: "Gerencia comercial",
    where: "Inmobiliaria · Mar del Plata",
    init: "●",
    metric: { v: "100%", k: "Leads trazados" },
    real: true,
  },
];

// Resultados esperados basados en el caso piloto y benchmarks de mercado
export const EXPECTED_RESULTS = [
  {
    metric: { v: "-99.9%", k: "Leads perdidos" },
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
    desc: "Meta Ads, Google Ads, Tokko y WhatsApp integrados en un solo tablero.",
    vertical: "Inmobiliarias",
  },
];

export const FAQ = [
  { q: "¿Cuánto tarda en estar andando?", a: "Implementación inicial: 1-2 semanas. Configuramos integraciones, importamos tus datos si los tenés y capacitamos al equipo. Empezás a usar el sistema desde el día 1 con la configuración base." },
  { q: "¿De quién son mis datos?", a: "Tuyos. 100%. Podés exportarlos en cualquier momento (CSV, JSON o backup completo de la base). Tu información vive en la infraestructura de Google Cloud, la misma nube que usan bancos y empresas grandes, con encriptación y backups automáticos. Sin ataduras, sin letra chica." },
  { q: "¿Quasor también trackea la inversión en ads?", a: "Sí. No es solo un CRM. Sincronizamos a diario la inversión en Meta Ads y Google Ads, capturamos los leads de cada campaña y los atamos al aviso que los generó. Así ves el costo real por lead y por venta cerrada, no por click, y sabés qué campaña genera ganancia y cuál genera pérdida." },
  { q: "¿Trabajan con empresas fuera de Mar del Plata?", a: "Sí. Trabajamos 100% remoto con reuniones semanales y entregas asincrónicas. La ubicación no es limitante: solo necesitamos buena conexión y que las personas que deciden estén disponibles para coordinar." },
  { q: "¿Qué pasa si quiero cortar el servicio?", a: "Cortás cuando quieras, contrato mensual sin permanencia. Te exportamos todos tus datos en formato estándar (CSV, JSON). Sin ataduras." },
  { q: "¿El precio incluye nuevas funciones?", a: "Sí. El CRM se va ampliando mes a mes con mejoras y nuevas integraciones. Y escuchamos lo que cada cliente necesita: si pedís una función puntual, la evaluamos y puede sumarse a la hoja de ruta del producto." },
];

export const CLIENTS = ["Grupo Costa", "Toyota MdP", "InmoSur", "Nordelta Motors", "AutoPlus", "Torre Mar", "Sede Norte", "Benetti"];

