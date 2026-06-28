# Correr la landing en local

Landing estática **Vite 6 + React 18 + Tailwind v4**. No necesita variables de entorno ni backend.

Todo corre dentro de Docker (no hace falta tener Node/npm en la máquina).

## Puertos

Elegidos para **no chocar** con la Quasor app (el devcontainer del `main_app_repo`):

| Servicio | Quasor app (no tocar) | Esta landing |
|---|---|---|
| Frontend / dev | `5173` | **`5180`** |
| Preview (build) | — | **`4180`** |
| Backend | `3001` | — |
| Debug node | `9229` | — |
| Postgres | `5433` | — |

## Uso rápido

Desde la carpeta del repo (`quasor-landing/`):

```bash
# Levantar el dev server con hot-reload
docker compose up -d dev

# Ver logs
docker compose logs -f dev

# Parar
docker compose down
```

Abrir 👉 **http://localhost:5180**

El código está montado como volumen, así que **el hot-reload funciona**: editás los archivos y se reflejan solo.

## Build de producción / preview

```bash
# Compila y sirve el build real (perfil "preview")
docker compose --profile preview up preview
```

Abrir 👉 **http://localhost:4180**

Para solo generar el `dist/` sin servirlo:

```bash
docker compose run --rm dev npm run build
```

## Detalles

- La primera vez, el contenedor corre `npm ci` automáticamente si no existe `node_modules`.
- Usamos el **mismo puerto adentro y afuera** del contenedor (`5180:5180`) a propósito: así el websocket de HMR de Vite apunta al puerto correcto y no al server del main app en el 5173.
- Imagen base: `node:22`.

### Comandos sueltos (sin compose)

```bash
# Instalar deps manualmente
docker run --rm -v "$PWD":/app -w /app node:22 npm ci

# Agregar una dependencia (mantiene el lockfile en sync)
docker run --rm -v "$PWD":/app -w /app node:22 npm install <paquete>
```
