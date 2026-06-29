# Qué hace Quasor — contexto de producto para la landing

> **Para qué sirve este documento.** Es la fuente de verdad, en lenguaje coloquial, de **qué hace
> realmente Quasor** hoy. Está pensado para que un agente que trabaja sobre la landing
> (`quasor-landing/`) tenga contexto del producto y escriba copy con la **dosis justa**: aspiracional
> y vendedor, pero anclado en lo que el software hace o puede hacer pronto.
>
> **Criterio de tono (importante).** No subvendas. Está perfecto prometer cosas que se cumplen rápido
> —sumar una industria nueva, una métrica derivada, un campo— porque la arquitectura lo permite y se
> entrega en días. Lo marcado como "construido" se afirma con total seguridad; lo que es un quick-win
> (la data ya existe, falta cablear) se puede vender como capacidad. El único límite real es lo que
> depende de terceros pesados o tiempos largos (telefonía, firma digital, inbox de WhatsApp 2 vías):
> eso no lo afirmes como ya disponible.
>
> Fuente principal: el código del repo `quasor/` (backend NestJS + frontend React) +
> [`docs/GLOSARIO.md`](GLOSARIO.md) (lenguaje de dominio). Última revisión del código: junio 2026.

---

## 1. El pitch en una frase

**Quasor es un CRM + plataforma de atribución de publicidad, hecho a medida para inmobiliarias y
automotoras de Argentina/LATAM.** Captura los leads de todos los canales (anuncios de Meta y Google,
el portal Tokko y los formularios de la propia web), los hace avanzar por un embudo de ventas visual,
cierra operaciones con reparto de comisiones, y cruza el **gasto en publicidad** con los **leads y las
ventas** para mostrar el costo real por lead de cada campaña — todo en español rioplatense y
adaptándose solo al rubro (propiedades vs. vehículos).

**Lo que lo hace distinto de un CRM común:** Quasor tiene a la vez el **gasto en ads** *y* lo que pasa
después con cada lead adentro del CRM (si avanzó, si cerró, cuánta comisión dejó). Esa combinación es
lo que ningún CRM genérico ni ninguna herramienta de tracking de ads tiene sola.

---

## 2. Para quién es (industrias)

**Las dos verticales pulidas hoy** (con embudo, atributos de inventario, métricas y vocabulario
propios, andando de punta a punta):

- 🏠 **Inmobiliarias** (`REAL_ESTATE`) — el activo es la **propiedad**.
- 🚗 **Automotoras / concesionarias** (`AUTOMOTIVE`) — el activo es el **vehículo / auto**.

Toda la app se reconfigura sola según el rubro del cliente: vocabulario, íconos, campos del
formulario de inventario, etapas del embudo y métricas (ver §10).

**Abierto a otros rubros (y se puede vender así).** La app está armada por "estrategias" de industria
(atributos + embudo + labels), así que **sumar una vertical nueva es cuestión de días, no de
reescribir nada**. En la landing está perfecto liderar con inmobiliarias y automotoras —las dos que
ya están afiladas— y al mismo tiempo invitar a otros rubros: *"¿Tu negocio es otro? El motor —cada
activo con su ficha y su ciclo de venta, cada lead con su seguimiento y su atribución de ads— se
adapta a tu rubro. Hablemos."* Es honesto: el core es genérico y la verticalización es rápida.

> Dato interno (no para la landing): el sistema lista ~15 industrias en un enum, pero solo
> inmobiliaria y automotora tienen su estrategia **ya cargada**; para otro rubro hay que definirla
> primero (días de trabajo). Por eso el pitch correcto para un rubro nuevo es "lo adaptamos a tu
> negocio", no "ya funciona out-of-the-box".

**Foco geográfico:** Argentina (con detalles locales: dólar blue, WhatsApp, DNI/CUIT, GNC, estado de
dominio/prenda en autos, comisión en "meses de alquiler", etc.).

---

## 3. Los 3 diferenciadores fuertes (lo que conviene destacar)

1. **Atribución de publicidad de punta a punta — "del aviso a la comisión".** Captura leads de Meta
   Ads, Google Ads, Tokko y el sitio web, y **ata cada lead a la campaña / conjunto de anuncios /
   anuncio exacto** que lo generó. Sincroniza el gasto diario de cada anuncio. Resultado: **costo real
   por lead (CPL) por campaña y por anuncio**, y —porque también tiene las ventas y comisiones de cada
   lead— puede mostrar **qué campaña genera ganancia y cuál genera pérdida**, no solo el costo por
   click. Eso ningún CRM genérico ni herramienta de ads lo tiene solo (ver §7).
2. **Reparto de comisiones de verdad.** El cierre de una operación no es solo "marcar como ganado":
   carga precio final, comisión, y reparte entre todos los que cobran (vendedor, oficina, broker
   externo, referido) con montos por destinatario y multimoneda.
3. **CRM que se amolda al rubro.** El mismo producto habla distinto y tiene embudos distintos para
   inmobiliarias y automotoras, listo en es-AR y con detalles argentinos.

---

## 4. Cómo entra cada lead (captación multicanal)

Quasor junta en un solo lugar leads que hoy se pierden repartidos en WhatsApp personales, mails y
planillas. Las **4 fuentes** terminan todas en lo mismo: se crea (o se de-duplica) el lead, se le abre
una **oportunidad** y, si hay datos de anuncio, se **ata a la publicidad** que lo trajo.

- **Meta Lead Ads** (Facebook/Instagram) — el lead entra **en tiempo real** por webhook apenas alguien
  completa el formulario del aviso. **Funcional, real.**
- **Google Lead Forms** — entra por webhook **+ un chequeo cada 15 minutos** como red de seguridad por
  si se pierde un webhook. **Funcional, real.**
- **Formularios de la propia web del cliente** — con el pixel/script `q.js` (ver §8). **Funcional, real.**
- **Tokko Broker** (solo inmobiliarias) — las consultas que entran por los portales (Zonaprop,
  Argenprop, Mercado Libre, etc.) y caen en Tokko se sincronizan cada 30 min y se vuelven leads +
  oportunidades. **Funcional, real.**
- Más la **carga manual** desde la app.

Detalles que dan confianza (sirven para el pitch de "no se te pierde un lead"):
- **De-duplicación** por email: si la misma persona ya entró por otro canal, no se duplica.
- **Asignación automática** del lead a un vendedor por reparto de menor carga (round-robin): apenas
  entra, ya tiene dueño y el vendedor recibe la notificación.
- **Bandeja de eventos** de integración: cada lead entrante queda registrado (recibido → procesado /
  falló) para auditar y reintentar, en vez de perderse en logs.

---

## 5. El embudo de ventas (el núcleo del CRM)

El recorrido completo: **Lead → Oportunidad (deal) → Activo(s) del inventario → Venta cerrada →
Comisiones.**

- **Leads (interesados).** La agenda central de potenciales clientes. Estado automático
  **Nuevo → Contactado → Calificado → Cliente** (se deriva del avance de sus oportunidades; solo
  "Contactado" es manual). Ficha con info, atribución del aviso de origen, oportunidades y comentarios.
  Exportable a CSV, filtrable, con botón de WhatsApp directo.
- **Oportunidades (deals).** El corazón transaccional. Cada oportunidad es un intento de venta que
  avanza por etapas. Un lead puede tener varias en el tiempo. Guarda **historial inmutable** de cada
  cambio de etapa (append-only), documentos PDF adjuntos, notas con @menciones. Se relaciona con uno o
  varios activos según la etapa (en "visita/test drive" el cliente mira varios; al cerrar, queda uno).
- **Pipeline (tablero Kanban).** El tablero visual donde el equipo **arrastra** las tarjetas entre
  columnas (etapas). Al mover, pide lo que la etapa exige (precio/seña, motivo de pérdida, vincular
  activo). Tarjetas con lead, fuente, precio, miniaturas de activos, badge de "días estancado".
  *(Depende del feature flag de Kanban, que viene en plan STARTER en adelante.)*
- **Activos (inventario).** El catálogo de propiedades/vehículos, en grilla de tarjetas con foto.
  Atributos ricos por rubro, estados (Disponible/Reservado/Vendido/Archivado), precio + moneda
  (USD/ARS), galería de fotos con visor a pantalla completa. Extras lindos: **generador de flyer
  1080×1350** para redes/WhatsApp (foto, precio, ficha, logo) y **geolocalización en mapa**.
- **Ventas + comisiones.** Al pasar una oportunidad a "Venta concretada", se crea la venta (no se carga
  a mano) y se arma el **reparto de comisiones**: por categoría (lado vendedor / comprador /
  intermediario) y rol (agente, oficina, broker externo, referido), eligiendo si cobra un usuario
  interno, un contacto externo o "la Oficina". Soporta venta y alquiler; comisión en **porcentaje** o
  en **meses de alquiler**. La vista de Ventas muestra totales acumulados por moneda. *(Concretar una
  venta es exclusivo de Admin/Manager.)*
- **Tareas.** Llamadas, reuniones, emails y follow-ups, enganchables a leads/oportunidades/contactos.
  Vista Kanban o lista, prioridades, vencimientos (las vencidas se resaltan), recordatorios automáticos.
- **Contactos (Entities).** Directorio de terceros que **no** son leads (propietarios, brokers,
  referidos, garantes, empresas), sobre todo para asignarles comisiones. *(Solo Admin/Manager.)*

---

## 6. Dashboard y reporting (centro de inteligencia)

Es uno de los módulos más sofisticados. **No son reportes fijos: el usuario arma sus propios tableros**
estilo Looker/Hyros, combinando libremente **métrica × desglose × tipo de widget + filtros**.

- **Tableros propios en pestañas**, con grilla **drag & drop** (mover/redimensionar, se guarda solo).
  Al entrar por primera vez ya vienen sembradas dos vistas: **"General"** (CRM) y **"Ads"**.
- **11 tipos de widget:** KPI (con comparación vs período anterior), líneas, barras, barras apiladas,
  área, torta, **embudo/funnel** (pipeline por etapa, adaptado al rubro), tabla, **pivot de Ads**
  (jerarquía Campaña → Conjunto → Anuncio), texto y encabezado.
- **17 métricas:** CRM (leads nuevos, conversión, etapa clave alcanzada, oportunidades
  creadas/activas/ganadas/perdidas), ventas (monto vendido, cantidad), ads (inversión, impresiones,
  clicks, CTR, CPC, **CPL**, leads atribuidos), inventario (cantidad de propiedades/vehículos).
- **Desgloses:** tiempo, fuente del lead, etapa, vendedor, plataforma de ads, campaña, estado y tipo de
  activo. **Comparación contra período anterior** con variación %. Chip del **dólar blue** para clientes
  de Argentina.
- **Gating:** el dashboard es para **Admin/Manager**; las métricas de plata de ads tienen un candado
  extra para esos roles.

---

## 7. Atribución de ads — el diferenciador, con sus límites exactos

**Lo que SÍ hace (funcional, real):**
- Conectar cuentas de **Meta Ads** y **Google Ads** por OAuth (con wizard para elegir qué cuentas
  sincronizar). El cliente conecta una vez y listo.
- **Sincronizar el gasto diario** de cada campaña/conjunto/anuncio, en la moneda real de la cuenta
  (ej. ARS), automáticamente todos los días.
- **Atar cada lead al anuncio exacto** que lo generó (campaña → adset → anuncio), incluso los leads que
  llegan por el formulario de la web (si el visitante venía clickeando un aviso).
- Calcular y mostrar **CPL (costo por lead), CPC, CTR, inversión, impresiones, clicks y leads
  atribuidos** — por campaña y por anuncio, en el **pivot de Ads** del dashboard.
- Etiquetar solo al lead con el **nombre del aviso** del que vino (tag automático), así el vendedor ve
  el origen sin abrir el dashboard.

**Ganancia / ROI por canal — se puede vender como capacidad central.** Quasor tiene a la vez el gasto
en ads *y* la venta + comisión que dejó cada lead, atado al anuncio que lo trajo. O sea: la data para
decir *"esta campaña costó $X y dejó $Y de comisión"* **ya está toda en el sistema** (lead → anuncio →
oportunidad → venta). Convertirlo en un KPI/columna de "ganancia y ROI por campaña/anuncio" es un
quick-win real: es básicamente sumar las ventas y dividirlas por campaña/adset/anuncio sobre joins que
ya existen, sin data nueva. Por eso está OK que la landing lo presente como diferenciador central:
*"sabé qué campaña genera ganancia y cuál genera pérdida, no solo el costo por click"*.

> Nota interna (no cambia el copy): hoy el dashboard ya muestra CPL, gasto, CTR, impresiones y clicks
> por campaña/anuncio (pivot de Ads); el rollup de **comisiones por campaña** como métrica clickeable
> es el pedazo chico que falta cablear (trivial, data presente). A nivel plataformas, la atribución
> corre con **Meta y Google** (las dos que importan en LATAM); el pixel además anota click-ids de
> TikTok/Bing por si se suman después.

---

## 8. El pixel `q.js` (tracking de la web propia)

El cliente pega **un solo `<script>`** en su web (o vía Google Tag Manager) y, sin programar, cada lead
del formulario entra al CRM. **Funcional, real.** Lo interesante:
- **Privacy-first:** solo lee los campos que el cliente marca explícitamente (email, teléfono, nombre);
  nunca contraseñas ni heurísticas. Trae presets para CRMs de plantilla (ej. Tokko) que no se pueden
  taggear a mano.
- **Atribución:** captura de la URL los identificadores del aviso (Meta/Google) y los UTMs, con
  persistencia de 30 días, así un lead del formulario de la web **cae en el mismo anuncio** que un lead
  de webhook y comparte su costo/CPL.

---

## 9. Colaboración, notificaciones e integraciones

- **Comentarios con @menciones** (transversal a leads, oportunidades, contactos, tareas). Editor
  enriquecido estilo Notion; al mencionar a un compañero le llega notificación + email. Hay
  **comentarios "de Sistema"** (sin autor) que arman solos el historial/timeline de cada registro
  (ej. "Consulta de Tokko · Origen: Zonaprop (WhatsApp)", cambios de etapa). Reemplazó las viejas notas.
- **Notificaciones (campanita) + emails.** Cada evento relevante avisa in-app y, los importantes,
  también por email: tarea asignada / por vencer / vencida, oportunidad asignada / cambió de etapa,
  **oportunidad estancada** (recordatorio si un deal queda X días parado en una etapa), nuevo lead
  asignado, "te mencionaron". Nunca te notificás a vos mismo; nunca rompe una operación.
- **WhatsApp click-to-chat.** Botón que abre `wa.me` con el teléfono normalizado (formato argentino),
  en leads, oportunidades y contactos. Es contacto en un click (no un inbox compartido de 2 vías), así
  que *"contactá por WhatsApp al toque"* sí; *"inbox / CRM de WhatsApp"* todavía no.
- **Integraciones que existen:** Tokko Broker (inventario + consultas, solo inmobiliarias), Meta Ads,
  Google Ads, y el pixel web. Más, por detrás: **MailerSend** (emails), **Cloudflare R2**
  (almacenamiento de fotos y documentos), **Nominatim/OpenStreetMap** (geolocalización de direcciones,
  solo Argentina), **DolarAPI** (cotización del dólar blue).
- **Administración (Admin/Manager):** gestión de **tags** (manuales + los importados de Tokko + los
  derivados de anuncios), **catálogo de anuncios** (renombrar con alias interno, archivar, ver el
  "último lead" de cada pieza), y gestión de **usuarios y roles**.

---

## 10. Diferencias por industria (tabla)

| Aspecto | 🏠 Inmobiliaria (Real Estate) | 🚗 Automotora (Automotive) |
|---|---|---|
| El activo se llama | Propiedad / Propiedades | Vehículo / Automóvil |
| Operaciones | **Venta, Alquiler, Alquiler temporario** | Solo **Venta** |
| Atributos del inventario | Tipo (depto/casa/PH/terreno/local…), superficies m², ambientes, baños, cocheras, orientación, amenities (pileta, SUM, seguridad…), servicios, expensas, apto crédito, ubicación (provincia/ciudad/barrio) | Marca, modelo, versión, año, km, combustible (incl. GNC), transmisión, carrocería, patente, VIN, **estado del título/dominio** (libre/prendado/embargado), dueños anteriores, equipo de GNC |
| Etapas del embudo | Interesado → Visita agendada → **Visitó** → Reservó → Cierre → Venta / Perdido | Interesado → Test drive agendado → **Test drive realizado** → **Hizo oferta** → Reservó → Cierre → Venta / Perdido |
| Hito de "intención fuerte" | Visitó la propiedad | Realizó el test drive |
| Comisión | % o **meses de alquiler** | Solo % |
| Tokko Broker | ✅ Sí (sync de inventario + consultas) | ❌ No habilitado |

---

## 11. Plataforma, planes y administración

- **Multi-tenant:** cada cliente (inmobiliaria/automotora) es un "tenant" aislado, con su propia
  industria, plan y huso horario, y sus propios usuarios.
- **Roles:** Admin y Manager (ven todo y gestionan) vs. Agente y Vendedor (solo ven lo asignado).
- **Planes:** FREE / STARTER / PROFESSIONAL / ENTERPRISE, con feature flags y límites por plan
  (ej. Kanban desde STARTER; Meta/Google Ads desde PROFESSIONAL; Tokko en ENTERPRISE; máx. usuarios
  5/10/50/∞). El super-admin puede ajustar flags por cliente.
- **Soporte / onboarding:** el equipo de Quasor tiene un panel de plataforma aparte (`/system/*`) y
  puede **impersonar** a un usuario de cualquier cliente (auditado, con tiempo límite) para dar soporte
  o configurar sin pedir la contraseña.

> Nota de modelo comercial: el alta de clientes, el cambio de plan y los límites los maneja el equipo
> de Quasor (no hay checkout de pago autoservicio). Esto **encaja** con la venta consultiva de la
> landing ("te lo dejamos funcionando, capacitamos, acompañamos"); no es algo a esconder, es el modelo.

---

## 12. Cómo calibrar el copy (el criterio en una sección)

La regla es simple: **vendé fuerte lo construido y lo que se entrega rápido; sé cuidadoso solo con lo
que depende de terceros pesados.**

- ✅ **Afirmá con seguridad** todo lo de las secciones 4–11: está construido y andando.
- ✅ **Vendé como capacidad** los quick-wins donde la data ya existe: ganancia/ROI por campaña (§7),
  sumar tu industria (§2), nuevas métricas o campos derivados. Se cumplen en días.
- 🟨 **No lo afirmes como ya disponible** (depende de terceros / tiempos largos): inbox de WhatsApp de
  2 vías, telefonía / call tracking, firma digital, conversiones offline hacia Meta/Google, checkout
  de pago autoservicio. Si hace falta nombrarlos, que sea como *"lo armamos según tu necesidad"*, no
  como algo que ya está.
- ℹ️ Dos matices finos para no patinar: hoy WhatsApp es **click-to-chat** (abrir el chat), alcanza para
  no decir "inbox de WhatsApp" pero "contactá por WhatsApp en un click" es 100% cierto; y las
  comisiones se **registran y reparten** flexiblemente (no se auto-calculan desde un %).

---

## 13. Glosario express para la landing

- **Lead** = interesado/prospecto en el embudo. (En la UI puede decirse "lead" o "consulta/interesado".)
- **Contacto (Entity)** = tercero del directorio (propietario, broker, referido), NO es un lead.
- **Oportunidad** = el negocio/deal concreto que avanza por el embudo.
- **Activo (Asset)** = la propiedad o el vehículo del inventario.
- **Pipeline** = el tablero Kanban de oportunidades por etapa.
- **Atribución** = ligar un lead al anuncio que lo trajo.
- **CPL** = costo por lead.
- **Tenant** = cada empresa-cliente de Quasor (no es término de cara al usuario).

---

## 14. Stack / infraestructura (para precisión técnica)

Backend **NestJS + Prisma + Postgres** (un schema por tenant, aislamiento total). Frontend **React +
Vite**. Emails por **MailerSend**, archivos en **Cloudflare R2**, deploy en **Railway**. Tareas
periódicas (sync de costos de ads, recordatorios, polling de Google) por crons.

> Nota: la FAQ actual de la landing dice que los datos viven en "Google Cloud". La infra real de
> almacenamiento de archivos es **Cloudflare R2** y el deploy es **Railway**; si se quiere ser preciso
> sobre dónde viven los datos, conviene revisarlo. (No es necesariamente un error de marketing, pero
> tenelo en cuenta si tocás esa FAQ.)
</content>
