# Quasor — Demo para Meta App Review

Mini app que simula el flujo completo de Quasor CRM con los tres permisos que estamos solicitando a Meta. Sirve **únicamente** para grabar el video de App Review mientras los permisos no están aprobados todavía.

## Permisos cubiertos

| Permiso | Pantalla donde se ve | Qué demuestra |
|---|---|---|
| `public_profile` | Toda la app (chip arriba a la derecha) | Que mostramos el perfil del usuario que se autenticó vía Facebook Login. |
| `pages_show_list` | `/dashboard.html` | Que listamos las Páginas que administra el usuario para que elija de cuál traer leads. |
| `leads_retrieval` | `/leads.html` y `/lead-detail.html` | Que recibimos los leads de los formularios de Lead Ads vía webhook y los procesamos en el CRM. |

## Cómo correrlo

```bash
cd meta-app-review-demo
npm install
npm start
```

Abrí `http://localhost:3000` en el navegador.

> Es una app local con datos mock. **No** se conecta a Meta de verdad — usa una pantalla de consentimiento simulada con la misma estética de Facebook Login para que el reviewer entienda visualmente qué se le pediría al usuario en producción.

## Guión del video (≈ 90 segundos)

Grabar con OBS, Loom o screen recorder de macOS/Windows. **Resolución mínima 1280×720**, audio claro. El reviewer espera ver narración explicando cada permiso.

### 0:00 — 0:10 — Apertura

> "Hola, soy Carlos. Trabajo en **Quasor**, un CRM para inmobiliarias. En este video voy a mostrarte cómo usamos los tres permisos que estamos solicitando: `public_profile`, `pages_show_list` y `leads_retrieval`."

(Pantalla: `http://localhost:3000` — landing del CRM con el botón "Conectar con Facebook".)

### 0:10 — 0:25 — Login y `public_profile`

> "El usuario es el dueño o el comercial de una inmobiliaria. Para empezar a usar el CRM hace clic en **Conectar con Facebook**."

Clic en **Conectar con Facebook** → aparece la pantalla de consentimiento.

> "Acá Facebook le pide explícitamente que apruebe los tres permisos. El primero es `public_profile`, que usamos sólo para identificar a quien se autenticó: nombre, foto y user ID."

Clic en **Continuar como Carlos**.

(Pantalla: dashboard de elección de páginas, con el chip de Carlos arriba a la derecha.)

> "Una vez aprobado, el nombre y la foto del usuario aparecen acá arriba — eso es todo lo que hacemos con `public_profile`."

### 0:25 — 0:45 — `pages_show_list`

(Pantalla: lista de páginas en `/dashboard.html`.)

> "El segundo permiso es `pages_show_list`. Lo usamos para mostrarle al usuario la lista de Páginas de Facebook que administra. Acá ve tres: la inmobiliaria principal, la cuenta de alquileres y la de loteos."

> "El usuario elige **de cuál Página** quiere traer leads. **No tocamos ninguna Página que no haya seleccionado expresamente**, ni leemos su contenido, mensajes ni publicaciones — únicamente leemos el nombre y el ID para mostrarlos en esta pantalla."

Clic en la primera Página → clic en **Continuar →**.

### 0:45 — 1:15 — `leads_retrieval`

(Pantalla: `/leads.html` — vacía, esperando webhook.)

> "Tercer permiso: `leads_retrieval`. Es el corazón del CRM. Cuando alguien completa uno de los formularios de Lead Ads de la Página conectada, Meta nos envía un webhook con los datos. Acá voy a simular uno."

Clic en **+ Simular nuevo lead (webhook)**.

> "Aparece Lucía Fernández, con su email, teléfono y las respuestas del formulario: tipo de propiedad, zona, presupuesto. Quasor lo guarda automáticamente, lo vincula con una propiedad del catálogo de la inmobiliaria, lo asigna a la vendedora Sofía Pereyra siguiendo las reglas de turno, y le envía un email."

Clic en la fila de Lucía → se abre `/lead-detail.html`.

> "En el detalle del lead se ve todo lo que llegó por `leads_retrieval`: los datos personales que la persona aceptó compartir al completar el formulario, junto con la metadata del anuncio para trazabilidad. Y la línea de tiempo del lado derecho muestra los cuatro pasos que ejecutamos: webhook recibido, lead guardado, asignación al vendedor y aviso por email."

(Opcional: volver atrás y simular un segundo lead para mostrar que el webhook es continuo.)

### 1:15 — 1:30 — Cierre

> "Y eso es todo. Tres permisos, tres usos puntuales: identificar al usuario, mostrarle sus Páginas, e ingestar los leads de sus formularios. Nunca publicamos en su nombre, nunca accedemos a contenido fuera de lo que aprobó, y la integración se puede revocar en cualquier momento desde Facebook. Gracias por revisar."

(Pantalla final: el detalle del lead con el timeline completo.)

## Checklist antes de grabar

- [ ] `npm install` corrido y sin errores.
- [ ] El navegador abierto en pantalla completa (sin barras de favoritos visibles).
- [ ] Audio del micrófono probado.
- [ ] Reseteado el estado: si ya grabaste antes, llamá a `POST /api/reset` o reiniciá el server.
- [ ] El narrador menciona explícitamente cada uno de los tres nombres de permiso (`public_profile`, `pages_show_list`, `leads_retrieval`) — Meta lo busca en el audio/captions.

## Archivos

```
meta-app-review-demo/
├── server.js              ← Express + estado en memoria + endpoints mock
├── package.json
├── README.md              ← este archivo
└── public/
    ├── index.html         ← Landing con botón "Conectar con Facebook"
    ├── oauth-consent.html ← Pantalla de consentimiento simulada (estilo FB)
    ├── dashboard.html     ← Lista de Páginas (pages_show_list)
    ├── leads.html         ← Tabla de leads en vivo (leads_retrieval)
    ├── lead-detail.html   ← Detalle de un lead + timeline de procesamiento
    └── styles.css
```

## Notas para Meta (a incluir en el formulario de submission)

> Quasor es un CRM para inmobiliarias argentinas que automatiza la captura y gestión de leads. Los tres permisos solicitados se usan así:
>
> - **`public_profile`**: para identificar al usuario que se autentica con Facebook Login y mostrar su nombre/foto en la interfaz del CRM.
> - **`pages_show_list`**: para mostrar al usuario la lista de Páginas de Facebook que administra, y que pueda elegir cuáles conectar al CRM. No accedemos al contenido de las Páginas.
> - **`leads_retrieval`**: para ingestar los leads de los formularios de Lead Ads de las Páginas conectadas, mediante webhooks. Los leads se asignan a un vendedor y se le envía notificación por email.
>
> No publicamos contenido en nombre del usuario, no accedemos a mensajes ni a Páginas que no haya conectado expresamente, y la integración se puede revocar desde la configuración de Facebook.
