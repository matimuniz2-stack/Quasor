// Shared data for landing sections (the Hero demo dashboard has its own data in Dashboard.jsx)

export const SERVICES = [
  {
    k: "DASH",
    name: "Dashboards",
    body: "Un tablero configurable que reúne Meta, Google, orgánicos y datos de carga manual en una sola vista.",
    bullets: ["Leads, conversión, oportunidades y ventas — por vendedor, origen o etapa", "Inversión, impresiones, CTR, CPC y CPL por campaña y plataforma", "Embudo de conversión y KPIs comparados contra períodos anteriores"],
  },
  {
    k: "API",
    name: "Integraciones",
    body: "Cada lead y cada dato entran desde su fuente de forma automática, sin captura manual.",
    bullets: ["Meta Lead Ads, Google Ads y los formularios de tu web", "Tokko: catálogo y consultas, siempre sincronizados", "¿Usás otra herramienta? La integramos a medida"],
  },
  {
    k: "AUTO",
    name: "Automatizaciones",
    body: "El trabajo repetitivo pasa solo. Vos recibís el aviso, no lo ejecutás.",
    bullets: ["Cada lead entra solo y se asigna a un vendedor", "Aviso por mail si un lead lleva demasiado tiempo en una etapa", "Costos de Meta y métricas, actualizados a diario de forma automática"],
  },
];

export const PROCESS = [
  {
    n: "01", tag: "CONOCEMOS", name: "Entendemos tu operación",
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
    n: "02", tag: "CONFIGURAMOS", name: "Dejamos todo funcionando",
    body: "Portales, WhatsApp, mail, contactos, alertas. Una o dos semanas. Sin meses.",
    term: [
      { p: "$", t: "setup --cliente", w: 800 },
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
      { p: ">", t: "Soporte < 6h" },
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
    desc: "Reportes automáticos, sin armar Excel ni copiar datos entre plataformas.",
    vertical: "Concesionarias",
  },
  {
    metric: { v: "4 → 1", k: "Plataformas a revisar" },
    desc: "Meta Ads, Google Ads, Tokko y WhatsApp integrados en un solo tablero.",
    vertical: "Inmobiliarias",
  },
];

export const FAQ = [
  { q: "¿Cuánto tarda en estar funcionando?", a: "Implementación inicial: 1-2 semanas. Configuramos integraciones, importamos tus datos si los tenés y capacitamos al equipo. Empezás a usar el sistema desde el día 1 con la configuración base." },
  { q: "¿Sirve para mi rubro?", a: "Hoy en producción con inmobiliarias, y el sistema está adaptado para concesionarias y agencias de autos. El motor —cada activo con su ficha y su ciclo de venta, y cada lead con su seguimiento— aplica a más rubros. Lo evaluamos juntos en la llamada." },
  { q: "¿De quién son mis datos?", a: "Tuyos. 100%. Podés exportarlos en cualquier momento (CSV, JSON o backup completo de la base). Tu información vive en la infraestructura de Google Cloud, la misma nube que usan bancos y empresas grandes, con encriptación y backups automáticos. Sin ataduras, sin letra chica." },
  { q: "¿Quasor también trackea la inversión en ads?", a: "Sí. No es solo un CRM. Sincronizamos a diario la inversión en Meta Ads y Google Ads, capturamos los leads de cada campaña y los atamos al aviso que los generó. Así ves el costo real de punta a punta: por lead y por venta cerrada, no te quedás en el click. Y sabés qué campaña genera ganancia y cuál genera pérdida." },
  { q: "¿Trabajan con empresas fuera de Mar del Plata?", a: "Sí. Trabajamos 100% remoto con reuniones semanales y entregas asincrónicas. La ubicación no es limitante: solo necesitamos buena conexión y que las personas que deciden estén disponibles para coordinar." },
  { q: "¿Qué pasa si quiero cortar el servicio?", a: "Cortás cuando quieras, contrato mensual sin permanencia. Te exportamos todos tus datos en formato estándar (CSV, JSON). Sin ataduras." },
  { q: "¿El precio incluye nuevas funciones?", a: "Sí. El CRM se va ampliando mes a mes con mejoras y nuevas integraciones. Y escuchamos lo que cada cliente necesita: si pedís una función puntual, la evaluamos y puede sumarse a la hoja de ruta del producto." },
];

