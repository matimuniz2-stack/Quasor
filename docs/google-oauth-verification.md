# OAuth Verification — Checklist de Preparación

Lo que tiene que estar listo el día que mandamos la verificación a Google. Los reviewers de Google evalúan **video del flujo + justification por scope + privacy policy + uso real**. Si alguno de los tres scopes restricted (`adwords`, `calendar.events`, `business.manage`) está sin justificar bien, rechazan toda la submission.

**Timeline esperado:** 4–6 semanas para restricted scopes, a veces más si los reviewers piden cambios.

---

## Pre-requisitos antes de submit

- [ ] Pasos 1–7 de `google-integration-setup-mati.md` completos
- [ ] Privacy policy publicada en `https://quasor.io/legal/privacidad.html` — sección **06 Integración con Google** publicada y accesible sin auth ni bot-protection (verificar con `curl -A "Mozilla/5.0" https://quasor.io/legal/privacidad.html` desde una IP de datacenter)
- [ ] Terms en `https://quasor.io/legal/terminos.html` publicado y accesible
- [ ] Eliminar-datos en `https://quasor.io/legal/eliminar-datos.html` publicado con sección **05 Revocar permisos de Google**
- [ ] Dominio `quasor.io` verificado en Search Console
- [ ] Dev confirma que el OAuth flow corre E2E contra sandbox (al menos: arrancar OAuth, consent, callback, llamar 1 endpoint por scope, mostrar el dato accedido en la UI)
- [ ] Existe **al menos una pantalla en Quasor que demuestre uso real** de cada uno de los 3 scopes. Si un scope no se usa visiblemente, los reviewers rechazan.

---

## Video del flujo — guión

Google espera **2–5 min**, una sola corrida, mínima edición. Pantalla compartida + audio explicando lo que mostrás. Idioma español o inglés está OK — si lo hacés en español, agregá subtítulos en inglés (Google reviewers están en distintos países).

### Orden a grabar

**1. Intro — 15 s**

> "Soy [Mati], de Quasor, un CRM para inmobiliarias en Argentina. Voy a mostrar cómo un cliente inmobiliario conecta su cuenta de Google a Quasor y cómo usamos los 3 scopes restricted que pedimos: `adwords`, `calendar.events` y `business.manage`."

**2. Login a Quasor — 15 s**

- App de Quasor abierta, logueado como un usuario real (un cliente inmobiliario).
- Aclarar: "el usuario ya está autenticado en Quasor con nuestro propio sistema; ahora va a conectar Google como integración aparte."

**3. Disparar el OAuth flow — 30 s**

- Click en **Settings → Integrations → Conectar Google**.
- Aparece el consent screen de Google.
- **Acercar (zoom in) al panel de scopes** y leer en voz alta los tres restricted: `adwords`, `calendar.events`, `business.manage`.
- Click en el link de **Privacy Policy** del consent screen → abre `https://quasor.io/legal/privacidad.html`. Scrollear hasta la sección **06 Integración con Google**, dejarla unos segundos en pantalla. Volver al consent.
- Click **Allow**.

**4. Uso de `adwords` — 45 s**

- Mostrar pantalla en Quasor de "Lead Form Assets conectados".
- Mostrar listado de leads ya sincronizados desde Google Ads (datos mock: nombre, email, teléfono, formulario de origen).
- Aclarar: "estos leads llegaron por webhook desde Google Ads y se sincronizaron al CRM del cliente. No accedemos a otras campañas ni a accounts que el cliente no autorizó."

**5. Uso de `calendar.events` — 45 s**

- Abrir un lead, click **Agendar visita**.
- Llenar form: propiedad + fecha + hora + lead.
- Submit → confirmación de que se creó el evento.
- Cambiar a la app de Google Calendar (otra pestaña) → mostrar el evento creado ahí mismo.
- Aclarar: "Quasor crea, lee y actualiza eventos sólo del calendario que el corredor conectó. Nunca toca otros calendarios."

**6. Uso de `business.manage` — 45 s**

- Pantalla **Mis fichas de Google Business Profile** en Quasor.
- Click en una ficha → ver reviews recibidas.
- Click **Responder review** → escribir respuesta corta → enviar.
- Mostrar que la respuesta se publicó (refrescar la vista, mostrar el reply).
- Aclarar: "publicamos sólo cuando el agente lo dispara explícitamente desde Quasor."

**7. Revocación — 15 s**

- Volver a Quasor → Settings → Integrations → **Desconectar Google**.
- Confirmar.
- Abrir `https://myaccount.google.com/permissions` en otra pestaña → mostrar que Quasor ya no aparece (o aparece sin permisos efectivos).

**8. Cierre — 10 s**

> "Quasor cumple con la Google API Services User Data Policy y los requisitos de Limited Use. Los datos accedidos se usan únicamente para las funcionalidades del CRM contratado por la inmobiliaria. Gracias."

### Cosas a NO hacer en el video

- No mostrar credenciales reales (client_secret, developer_token, refresh tokens).
- No usar datos personales reales de leads — usar mocks o anonimizar.
- No editar pesado el video; Google prefiere "raw" para confirmar que la app realmente hace lo que dice.
- No saltearse el consent screen mostrando los scopes — es la parte que más miran.

---

## Justification por scope

Texto plantilla para pegar en el form de verificación. Ajustar si el dev cambia funcionalidades. **En inglés** (los reviewers de Google leen inglés).

### `https://www.googleapis.com/auth/adwords`

> Quasor is a CRM for real estate agencies in Argentina. Agencies run Google Ads campaigns with Lead Form Assets to capture leads from house-shopping audiences. We use the Google Ads API with the `adwords` scope to:
>
> 1. List the Google Ads accounts the agency manages (so the user can choose which to connect).
> 2. Read the Lead Form Assets configured under those accounts.
> 3. Receive and process lead data submitted through those forms (name, email, phone, form responses).
>
> The agency configures the webhook URL of their Lead Form Asset to point to Quasor. Each lead is then synced into the agency's CRM record so the agent can follow up.
>
> We do NOT use this scope to launch campaigns, modify budgets, or access aggregate ad performance data. We do not access accounts the agency did not authorize via OAuth.
>
> A less-permissive scope is not available — `adwords` is the only scope that grants read access to Lead Form Assets and their lead data via the Google Ads API.

### `https://www.googleapis.com/auth/calendar.events`

> Quasor agents schedule property visits, follow-up calls, and contract signing meetings with leads. We use the Calendar API with the `calendar.events` scope to:
>
> 1. Create events on the agent's calendar when a visit is scheduled inside Quasor.
> 2. Read existing events to display availability and prevent double-booking.
> 3. Update or cancel events when the visit is rescheduled or canceled inside Quasor.
>
> We use Calendar Push Notifications (`events.watch`) to detect changes made by the agent on their own calendar (e.g., dragging an event to a different time on mobile). When such a change is detected, Quasor updates the corresponding visit record in the CRM.
>
> We only operate on calendars the agent has explicitly connected during OAuth. We do not access other users' calendars, we do not read events unrelated to scheduling visits, and we do not use event data for advertising or model training.
>
> `calendar.events` is the minimal scope for our use case. `calendar.events.readonly` was considered and rejected because we need event creation, which is the primary user action.

### `https://www.googleapis.com/auth/business.manage`

> Real estate agencies in Argentina maintain Google Business Profile listings for each office and, in many cases, for individual properties they sell. Quasor centralizes review responses and post publication so agents can manage all their listings from a single dashboard. We use the Business Profile API with the `business.manage` scope to:
>
> 1. List the Business Profile listings the agency manages (so the user selects which to connect).
> 2. Read reviews received on each connected listing.
> 3. Publish review replies that the agent authored inside Quasor.
> 4. Publish posts (new property announcements, open house events, operational updates) on connected listings, only when the agent explicitly triggers the action.
>
> We do NOT modify listing details (address, hours, categories). We do NOT publish content without explicit user action. We do not access listings the user did not connect.
>
> A read-only scope on reviews was considered, but it does not allow replies — and replying to reviews is the central use case for the integration.

---

## Privacy + compliance — qué validar antes de submit

Los reviewers leen la privacy policy buscando puntos concretos. Confirmá:

- [ ] Privacy policy menciona los 3 scopes explícitamente (`adwords`, `calendar.events`, `business.manage`). ✅ (sección 06 de `legal/privacidad.html`)
- [ ] Menciona literalmente **"Google API Services User Data Policy"** y **"Limited Use"**. ✅ (sección 06)
- [ ] Aclara que NO usamos los datos para entrenar modelos de IA generalizados, NO los vendemos, NO los compartimos con terceros con fines publicitarios. ✅ (sección 06)
- [ ] Explica cómo el usuario puede revocar (link a `myaccount.google.com/permissions`). ✅ (sección 06)
- [ ] Sección de retención menciona específicamente los datos provenientes de Google. ✅ (sección 11)
- [ ] Eliminar-datos tiene instrucciones específicas para revocar permisos de Google. ✅ (sección 05 de `legal/eliminar-datos.html`)
- [ ] Las 3 URLs (`privacidad.html`, `terminos.html`, `eliminar-datos.html`) devuelven 200 desde IPs de datacenter (no sólo desde IPs residenciales). Verificar con: `curl -I -A "Mozilla/5.0 (compatible; Google-Site-Verification/1.0)" https://quasor.io/legal/privacidad.html`. Si Vercel firewall bloquea, repetir el patrón de "Allow crawler" Custom Rule que aplicamos para `facebookexternalhit`.

---

## Después del submit — qué esperar

1. **Confirmación automática** dentro de pocas horas: "Submission received."
2. **Revisión técnica** por un humano: 1–4 semanas. Pueden:
   - Aprobar todo de una.
   - Pedir aclaraciones / cambios menores en privacy policy o en la app (responder rápido — cada respuesta resetea el timer si el reviewer queda satisfecho, pero esos días no se cuentan).
   - Rechazar y pedir resubmit (raro si la submission inicial está bien armada).
3. **Mails de reviewers llegan a `quasortech@gmail.com`** — asegurate de revisarlo seguido durante la ventana de revisión.

---

## FAQ — preguntas típicas de reviewers + respuestas tipo

### "Why do you need restricted scopes if you can use Google Sign-In with basic profile?"

> Quasor does not use Google Sign-In. The platform has its own user authentication system. The Google connection is a separate, opt-in integration the user activates after they're already authenticated in Quasor. The restricted scopes are required to read Lead Form leads (`adwords`), manage calendar events (`calendar.events`), and respond to reviews / publish posts (`business.manage`) — none of which can be accomplished with basic profile scopes.

### "Do you store the user's Google credentials?"

> No. We never store passwords. We store only OAuth refresh tokens, encrypted at rest with AES-256, the same mechanism we use for our existing Meta Lead Ads integration. The user can revoke at any time at `https://myaccount.google.com/permissions`; we also expose a "Disconnect" button inside Quasor that calls Google's `oauth2/revoke` endpoint and deletes the stored tokens.

### "How long do you retain user data after disconnection?"

> OAuth tokens: deleted within 7 days after disconnection. Data already synced to the agency's CRM (leads, past calendar events, prior review history) stays under the agency's control as the data controller, per the data processor model documented in our privacy policy. End-users (leads) can request deletion through `privacidad@quasor.io` per the instructions at `https://quasor.io/legal/eliminar-datos.html`.

### "Do you share Google user data with third parties?"

> No. Data flows from Google → Quasor → the connected agency's CRM. We do not share with advertising partners, data brokers, or any third party. The agency's own customers (leads) are not third parties — they are the data subjects, and the agency is the data controller of their data per the GDPR-style data processor model we operate under.

### "Are you using AI / ML on this data?"

> Quasor has an AI feature inside the CRM that scores leads by likelihood to convert. This model runs over the connecting agency's own data in isolation — we do not mix data across agencies, we do not train a generalized model, and we do not use the data for any purpose outside the CRM context. Google data accessed via restricted scopes is processed under the Limited Use requirements of the Google API Services User Data Policy.

### "Can a user request full deletion of their data?"

> Yes. The process is documented at `https://quasor.io/legal/eliminar-datos.html`. A request to `privacidad@quasor.io` triggers deletion within 7 days. The only exception is records we are legally required to retain under Argentine law (AFIP billing records, 5 years under Resolución General 1415/2003) — and even those are limited to billing data, never Google-sourced content.

### "Do you need Standard Access on the Google Ads API?"

> Not initially. Basic Access (limit of 15,000 ops/day) is sufficient for our current customer base. We will request Standard Access only when usage approaches the Basic limit, with a separate justification at that time.

---

## Si rechazan la submission

1. Leer el mail con la razón puntual. Suele ser específico (ej: "Privacy policy missing Limited Use clause" o "Video does not clearly demonstrate use of `business.manage`").
2. Corregir lo señalado (cambio en privacy policy, regrabar la parte del video que falte, etc.).
3. Pushear cambios a `quasor.io` y esperar 1 hora a que Vercel deployee.
4. Responder al mismo thread del mail con el changelog: "Fix applied: [what], visible at [URL]. Re-submitting." Algunos reviewers chequean sin re-submit; otros piden re-submit explícito desde el panel.
