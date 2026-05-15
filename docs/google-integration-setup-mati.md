# Setup Google Cloud Project para Quasor — Checklist Mati

Lista de trámites manuales en consolas de Google. No se pueden scriptear. Tachá a medida que avanzás. Cualquier valor que aparezca como "anotar" termina pasándoselo al dev (ver tabla al final).

---

## Cuenta a usar

- [ ] Logueado con `quasortech@gmail.com` (cuenta corporativa, NO la personal `matimuniz2@gmail.com`).
- [ ] Usar Chrome en ventana incógnito o un perfil de Chrome separado ("Quasor") para no mezclar con la cuenta personal.

> Si te aparece tu cuenta personal en alguno de los paneles, cerrá sesión y entrá de nuevo con `quasortech@gmail.com`. No mezcles cuentas en el mismo perfil de Chrome.

---

## 1. Crear el Google Cloud Project

- [ ] Entrar a <https://console.cloud.google.com/projectcreate>
- [ ] **Project name:** `Quasor`
- [ ] **Organization:** dejar en blanco (no tenemos Workspace organizational account)
- [ ] Click "Create"
- [ ] **Anotar el Project ID** (formato `quasor-XXXXX`): `__________________`

---

## 2. Verificar quasor.io en Google Search Console

(Necesario para poder declarar `quasor.io` como Authorized Domain en el OAuth consent screen del paso 3.)

- [ ] Entrar a <https://search.google.com/search-console>
- [ ] Add property → tipo **Domain** → `quasor.io`
- [ ] Google te da un TXT record para cargar en el DNS
- [ ] Cargar el TXT en Hostinger DNS de quasor.io (Hostinger panel → Dominios → quasor.io → DNS)
- [ ] Esperar 5–30 min y dale "Verify" en Search Console
- [ ] Confirmar status **verified**

---

## 3. Configurar OAuth Consent Screen

- [ ] Entrar a <https://console.cloud.google.com/apis/credentials/consent>
- [ ] **User type:** External
- [ ] Click "Create"

### App information

- [ ] **App name:** `Quasor`
- [ ] **User support email:** `quasortech@gmail.com`
- [ ] **App logo:** subir el mismo PNG del logo que usamos en Meta App Review (mínimo 120×120, idealmente 256×256, fondo claro)

### App domain

- [ ] **Application home page:** `https://quasor.io`
- [ ] **Application privacy policy link:** `https://quasor.io/legal/privacidad.html`
- [ ] **Application terms of service link:** `https://quasor.io/legal/terminos.html`

### Authorized domains

- [ ] Agregar `quasor.io` (tiene que estar verificado en Search Console — paso 2)

### Developer contact

- [ ] **Developer contact email:** `quasortech@gmail.com`

- [ ] Click "Save and Continue"

### Scopes

- [ ] Click "Add or remove scopes" y agregar TODOS estos:

| Scope | Tipo | Para qué |
| --- | --- | --- |
| `openid` | non-sensitive | identificación |
| `.../auth/userinfo.email` | non-sensitive | leer email del usuario |
| `.../auth/userinfo.profile` | non-sensitive | leer nombre y foto |
| `.../auth/adwords` | **restricted** | Google Ads API (lead forms) |
| `.../auth/calendar.events` | **restricted** | Google Calendar (eventos) |
| `.../auth/business.manage` | **restricted** | Business Profile (reviews + posts) |

Los 3 **restricted** son los que disparan la OAuth verification obligatoria. Sin verificación, sólo podés tener hasta 100 test users.

- [ ] Click "Save and Continue"

### Test users

- [ ] Agregar como test user:
  - `quasortech@gmail.com`
  - `matimuniz2@gmail.com` (para probar desde tu personal)
  - Los emails de los clientes inmobiliarios que vayan a probar antes de la verificación

- [ ] Click "Save and Continue" → "Back to Dashboard"

> La app va a quedar en status **Testing** hasta que pidamos verificación. En Testing, sólo los emails listados acá pueden conectar.

---

## 4. Habilitar las 3 APIs

- [ ] <https://console.cloud.google.com/apis/library/googleads.googleapis.com> → Enable
- [ ] <https://console.cloud.google.com/apis/library/calendar-json.googleapis.com> → Enable
- [ ] <https://console.cloud.google.com/apis/library/mybusinessbusinessinformation.googleapis.com> → Enable
- [ ] <https://console.cloud.google.com/apis/library/mybusinessaccountmanagement.googleapis.com> → Enable

(Las dos últimas son parte del stack de Business Profile; ambas requieren acceso aprobado — ver paso 7.)

---

## 5. Crear OAuth 2.0 Client ID

- [ ] Entrar a <https://console.cloud.google.com/apis/credentials>
- [ ] Click "Create credentials" → "OAuth client ID"
- [ ] **Application type:** Web application
- [ ] **Name:** `Quasor Web Client`
- [ ] **Authorized JavaScript origins:** pedir al dev. Típicamente:
  - `https://app.quasor.io` (prod)
  - `http://localhost:3000` (dev local)
- [ ] **Authorized redirect URIs:** pedir al dev. Típicamente:
  - `https://app.quasor.io/auth/google/callback` (prod)
  - `http://localhost:3000/auth/google/callback` (dev local)
- [ ] Click "Create"
- [ ] Descargar el JSON con `client_id` y `client_secret`
- [ ] Mandárselos al dev por canal privado. **NO commitear al repo.**

---

## 6. Google Ads — Manager Account (MCC) + Developer Token

(Independiente del Cloud Project, pero usá la misma cuenta `quasortech@gmail.com`.)

### Crear MCC

- [ ] <https://ads.google.com/aw/signup/manager> → signup gratuito como manager account
- [ ] **Anotar el Customer ID del MCC** (formato `XXX-XXX-XXXX`): `__________________`

### Pedir Developer Token

- [ ] Entrar al MCC → arriba a la derecha "Tools" → API Center
- [ ] Solicitar **Developer Token** → **Basic Access** (alcanza para empezar; Standard Access se pide después)
- [ ] Form de aplicación, llenar con:
  - **Company name:** Quasor
  - **Website:** https://quasor.io
  - **Use case:** "CRM para inmobiliarias en Argentina. Sincronizamos leads provenientes de Google Ads Lead Form Assets directamente al CRM del cliente, vía webhook configurado por la inmobiliaria sobre su propio Lead Form Asset. No accedemos a accounts que el cliente no haya autorizado explícitamente vía OAuth."
  - **API services:** Google Ads API
  - **Access level:** Basic Access
- [ ] Aprobación: típicamente 1–3 días hábiles
- [ ] **Anotar el developer token cuando lo aprueben:** `__________________`

---

## 7. Pedir acceso a Google Business Profile API

(Acceso gated, suele tardar 2–4 semanas. **No bloquea** Ads ni Calendar — la verificación de OAuth se puede pedir antes de tener esto.)

- [ ] Entrar a <https://developers.google.com/my-business/content/prereqs> y seguir el link al "Request Form"
- [ ] Use case a justificar: "Gestión de fichas de Google Business Profile de inmobiliarias multi-sucursal en Argentina. Funcionalidades: responder reviews recibidas en cada ficha y publicar novedades operativas (nuevas propiedades en venta, open houses, eventos). El acceso se ejerce siempre en nombre del cliente inmobiliario que conectó su cuenta vía OAuth — no operamos sus fichas sin autorización explícita."
- [ ] Mandar el form y esperar respuesta de Google a `quasortech@gmail.com`

---

## 8. OAuth Verification (al final, cuando el dev tenga el código listo)

Pre-condiciones para arrancar este paso:

- Code del dev funcionando E2E contra sandbox (al menos OAuth flow + un endpoint de prueba por scope)
- Video del flujo grabado (ver `docs/google-oauth-verification.md` para guión)

Cuando todo esto esté:

- [ ] Volver al OAuth consent screen
- [ ] Click "Publish App" (te avisa que va a iniciar el proceso de verificación)
- [ ] Click "Prepare for verification"
- [ ] Adjuntar video del flujo y justification por scope (texto plantilla en `docs/google-oauth-verification.md`)
- [ ] Submit
- [ ] Responder cualquier pregunta de los reviewers (suelen mandar mail a `quasortech@gmail.com`)

**Timeline esperado:** 4–6 semanas para restricted scopes. Mucho más rápido si las respuestas a los reviewers son sólidas.

---

## Valores a pasarle al dev

Cuando tengas estos valores, mandáselos por canal privado al dev. **No commitear al repo.**

| Variable de entorno | Valor | De dónde |
| --- | --- | --- |
| `GOOGLE_OAUTH_CLIENT_ID` | client_id del JSON descargado | Paso 5 |
| `GOOGLE_OAUTH_CLIENT_SECRET` | client_secret del JSON descargado | Paso 5 |
| `GOOGLE_OAUTH_REDIRECT_URI` | el que vos definiste en paso 5 (lo decidió el dev) | Paso 5 |
| `GOOGLE_ADS_DEVELOPER_TOKEN` | developer token aprobado | Paso 6 |
| `GOOGLE_ADS_LOGIN_CUSTOMER_ID` | Customer ID del MCC | Paso 6 |

El dev te tiene que dar a vos antes del paso 5:

- URLs exactos de **redirect URI** (prod + dev) para cargar en el OAuth Client ID
- URL del **webhook de Lead Forms** + el `key` que va a usar para validar firma (los necesitás cuando la inmobiliaria arme su Lead Form Asset)

---

## Cosas que NO hace falta hacer

- **Google Login NO se pide** — Quasor es B2B y el login lo maneja Quasor, no Google. Si en el OAuth consent screen aparece la opción de Google Sign-In, ignorala.
- **CASA tier (Cloud Application Security Assessment)** — Google a veces lo pide a apps con muchos usuarios o scopes muy sensibles. Si lo piden, te lo van a indicar en el flow de verification. No lo pidas vos preemptivamente.
- **Workspace organization / Cloud Identity** — no aplica, somos cuenta personal de Google + project externo.

---

## Links rápidos para el día a día

- Cloud Project dashboard: <https://console.cloud.google.com/home/dashboard>
- OAuth consent screen: <https://console.cloud.google.com/apis/credentials/consent>
- Credentials (Client IDs): <https://console.cloud.google.com/apis/credentials>
- Enabled APIs: <https://console.cloud.google.com/apis/dashboard>
- Google Ads MCC: <https://ads.google.com>
- Google Ads API Center: dentro del MCC → Tools → API Center
- Search Console: <https://search.google.com/search-console>
- Google API Services User Data Policy (la que citamos en privacidad.html): <https://developers.google.com/terms/api-services-user-data-policy>
