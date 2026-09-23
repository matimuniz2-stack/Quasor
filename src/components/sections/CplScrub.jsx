import { useState, useEffect, useRef } from "react";
import { prefersReducedMotion } from "../motion.jsx";

// El costo por lead de una campaña que se está yendo al carajo, dibujado
// contra el scroll: la curva se revela a medida que bajás, el número sube
// con ella y, pasado el pico, el trazo vira a --neg y aparece la lectura.
//
// Va debajo de la ficha de campaña de Atribución a propósito: esa ficha
// muestra una campaña que CIERRA bien ($92.250 por venta). Ésta muestra la
// otra mitad del argumento — la que hay que cortar a tiempo. Juntas dicen
// "no te mostramos el lead, te mostramos cuál deja plata y cuál la quema".
//
// El resto de la página anima por atributos (data-reveal + el IO global de
// App.jsx). Acá no alcanza: esto no es un estado binario dentro/fuera, es
// una función continua del scroll. Por eso es el único componente de la
// landing con su propio rAF — y se apaga solo cuando no hay scroll o la
// sección no se ve.

const CPL_BASE = 8200;
const CPL_PICO = 25400;
const CAMPANA = "Pozo Torres del Mar · Meta Ads";

// Mismo formateador que la ficha de campaña de arriba: Intl con
// style:"currency" mete un espacio ("$ 25.400") y quedaba desalineado
// contra los "$92.250" que ya muestra la sección.
const money = (n) => `$${Math.round(n).toLocaleString("es-AR")}`;

// La serie se calcula una vez, determinista. Nada de Math.random(): un
// gráfico que baila entre renders (y con StrictMode, entre los dos montajes)
// pierde justo lo que tiene que transmitir, que es que el dato es real.
const PUNTOS = (() => {
  const pts = [];
  for (let i = 0; i < 16; i++) {
    // Dos senos desfasados: ruido que parece orgánico y siempre es el mismo.
    const w = Math.sin(i * 1.9) * 0.55 + Math.sin(i * 0.7 + 1.3) * 0.45;
    pts.push(7600 + (w * 0.5 + 0.5) * 1300); // 7.600 → 8.900
  }
  const desde = pts[15];
  for (let i = 0; i < 8; i++) {
    const t = (i + 1) / 8;
    pts.push(desde + (CPL_PICO - desde) * Math.pow(t, 2.4)); // subida exponencial
  }
  return pts;
})();

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
// smoothstep para el viraje de color: un if binario se ve como un corte.
const smoothstep = (t) => t * t * (3 - 2 * t);

const rgba = (c, a) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
const mezcla = (a, b, t) => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

/* Parsear color-mix()/oklch() a mano sería frágil y quedaría desactualizado
   con el tema. Le damos el valor al propio canvas, que acepta todo lo que
   acepta CSS y nos lo devuelve normalizado. Más barato que un parser. */
const canalesDe = (() => {
  let probe = null;
  return (valor, fallback) => {
    if (!probe) {
      const c = document.createElement("canvas");
      c.width = c.height = 1;
      probe = c.getContext("2d");
    }
    if (!probe || !valor) return fallback;
    try {
      probe.fillStyle = "#000";
      probe.fillStyle = valor;
      const s = probe.fillStyle; // siempre "#rrggbb" o "rgba(...)"
      if (s[0] === "#") {
        return [
          parseInt(s.slice(1, 3), 16),
          parseInt(s.slice(3, 5), 16),
          parseInt(s.slice(5, 7), 16),
        ];
      }
      const m = s.match(/[\d.]+/g);
      return m ? [+m[0], +m[1], +m[2]] : fallback;
    } catch (e) {
      return fallback;
    }
  };
})();

export const CplScrub = ({ className = "" }) => {
  const stageRef = useRef(null);
  const canvasRef = useRef(null);

  // Durante el prerender de build los efectos no corren, así que el HTML que
  // leen los crawlers tiene que salir ya con el valor final — mismo criterio
  // que <CountUp/>. En el navegador arranca en la base y sube con el scroll.
  const [valor, setValor] = useState(() =>
    typeof window === "undefined" || prefersReducedMotion() ? CPL_PICO : CPL_BASE
  );
  const [alerta, setAlerta] = useState(
    () => typeof window === "undefined" || prefersReducedMotion()
  );

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return undefined;
    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined; // sin 2d queda el número y la lectura, no un hueco

    const raiz = document.documentElement;

    /* --- colores del sistema. Nunca hardcodeados: se releen del :root, así
       el theme toggle y el TweakPanel (que escribe --accent inline en <html>)
       repintan el gráfico sin que nadie tenga que avisar. --- */
    let cAccent = [217, 119, 6];
    let cNeg = [224, 36, 36];
    let cLinea = [217, 217, 217];
    let cInk3 = [107, 107, 107];
    let firma = "";
    const leerColores = () => {
      const cs = getComputedStyle(raiz);
      const crudo = [
        cs.getPropertyValue("--accent").trim(),
        cs.getPropertyValue("--neg").trim(),
        cs.getPropertyValue("--stage-line").trim(),
        cs.getPropertyValue("--ink-3").trim(),
      ];
      const f = crudo.join("|");
      if (f === firma) return false;
      firma = f;
      cAccent = canalesDe(crudo[0], cAccent);
      cNeg = canalesDe(crudo[1], cNeg);
      cLinea = canalesDe(crudo[2], cLinea);
      cInk3 = canalesDe(crudo[3], cInk3);
      return true;
    };
    leerColores();

    /* --- geometría --- */
    let W = 0;
    let H = 0;
    const mqMd = window.matchMedia("(min-width: 768px)");
    const redimensionar = () => {
      const ancho = canvas.clientWidth || stage.clientWidth || 320;
      const alto = mqMd.matches ? 220 : 160;
      canvas.style.height = alto + "px";
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // arriba de 2 el fill-rate no paga
      W = ancho;
      H = alto;
      canvas.width = Math.max(1, Math.round(ancho * dpr));
      canvas.height = Math.max(1, Math.round(alto * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const PAD_X = 2;
    const PAD_T = 14;
    const PAD_B = 22;
    const MIN_V = 7000;
    const MAX_V = CPL_PICO * 1.06;
    const n = PUNTOS.length;
    const px = (i) => PAD_X + (i / (n - 1)) * (W - PAD_X * 2);
    const py = (v) => H - PAD_B - ((v - MIN_V) / (MAX_V - MIN_V)) * (H - PAD_T - PAD_B);

    // Altura de la curva en un x dado, para el punto de luz de la cabeza.
    // Interpolación lineal: a esta escala el ojo no la distingue de la real.
    const yEnX = (x) => {
      const t = clamp01((x - PAD_X) / Math.max(1, W - PAD_X * 2)) * (n - 1);
      const i = Math.min(n - 2, Math.floor(t));
      const f = t - i;
      return py(PUNTOS[i] + (PUNTOS[i + 1] - PUNTOS[i]) * f);
    };

    // quadraticCurveTo entre puntos medios: con 24 puntos una polilínea se ve
    // "de Excel"; esto queda continuo y no cuesta más.
    const trazarCurva = () => {
      ctx.beginPath();
      ctx.moveTo(px(0), py(PUNTOS[0]));
      for (let i = 1; i < n - 1; i++) {
        const xa = px(i);
        const ya = py(PUNTOS[i]);
        ctx.quadraticCurveTo(xa, ya, (xa + px(i + 1)) / 2, (ya + py(PUNTOS[i + 1])) / 2);
      }
      ctx.lineTo(px(n - 1), py(PUNTOS[n - 1]));
    };

    let mix = 0; // 0 = accent, 1 = neg

    const dibujar = (p) => {
      if (!W || !H) return;
      ctx.clearRect(0, 0, W, H);
      const color = mezcla(cAccent, cNeg, smoothstep(mix));
      const corte = Math.max(0, p * W);

      // Sin la línea del promedio el pico no tiene contra qué leerse.
      const yBase = py(CPL_BASE);
      ctx.save();
      ctx.setLineDash([3, 4]);
      ctx.lineWidth = 1;
      ctx.strokeStyle = rgba(cLinea, 1);
      ctx.beginPath();
      ctx.moveTo(PAD_X, yBase);
      ctx.lineTo(W - PAD_X, yBase);
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.font = '10px "JetBrains Mono", ui-monospace, monospace';
      ctx.fillStyle = rgba(cInk3, 1);
      ctx.textBaseline = "top";
      ctx.fillText(`promedio ${money(CPL_BASE)}`, PAD_X, Math.min(H - 12, yBase + 5));
      ctx.restore();

      if (corte <= 0.5) return;

      // El revelado es un clip sobre el path completo: recalcular 24 curvas
      // por frame sería caro, recortar es una sola operación del compositor.
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, corte, H);
      ctx.clip();

      ctx.beginPath();
      trazarCurva();
      ctx.lineTo(px(n - 1), H - PAD_B);
      ctx.lineTo(px(0), H - PAD_B);
      ctx.closePath();
      const grad = ctx.createLinearGradient(0, PAD_T, 0, H - PAD_B);
      grad.addColorStop(0, rgba(color, 0.16));
      grad.addColorStop(1, rgba(color, 0));
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.lineWidth = 2;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.strokeStyle = rgba(color, 1);
      trazarCurva();
      ctx.stroke();
      ctx.restore();

      // Punto de luz en la cabeza: es lo que lo hace leer como "está pasando
      // ahora" en vez de como una imagen.
      const xh = Math.min(corte, px(n - 1));
      const yh = yEnX(xh);
      ctx.save();
      ctx.beginPath();
      ctx.arc(xh, yh, 8, 0, Math.PI * 2);
      ctx.fillStyle = rgba(color, 0.14);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(xh, yh, 3, 0, Math.PI * 2);
      ctx.fillStyle = rgba(color, 1);
      ctx.fill();
      ctx.restore();
    };

    let tColores = 0;
    let pUlt = 0;
    let redibujar = () => dibujar(pUlt);
    /* El TweakPanel escribe en <html style> y el theme toggle en data-theme.
       La relectura va debounceada y comparando firma porque getComputedStyle
       por frame es un recálculo de estilos forzado. */
    const refrescarColores = () => {
      clearTimeout(tColores);
      tColores = setTimeout(() => {
        if (leerColores()) redibujar();
      }, 180);
    };
    const mo = new MutationObserver(refrescarColores);
    mo.observe(raiz, { attributes: true, attributeFilter: ["data-theme", "style"] });

    /* ---------------- RAMA MOVIMIENTO REDUCIDO ----------------
       Una sola pasada con p=1: curva completa, número final, alerta visible.
       Cero rAF, cero listener de scroll. */
    if (prefersReducedMotion()) {
      redimensionar();
      mix = 1;
      dibujar(1);
      setValor(CPL_PICO);
      setAlerta(true);
      redibujar = () => dibujar(1);
      const roR = new ResizeObserver(() => {
        redimensionar();
        dibujar(1);
      });
      roR.observe(canvas);
      return () => {
        roR.disconnect();
        mo.disconnect();
        clearTimeout(tColores);
      };
    }

    /* ---------------- RAMA CON MOVIMIENTO ---------------- */
    let raf = 0;
    let ultimoScroll = 0;
    let enPantalla = false;
    let pPrev = -1;
    let ultimoValor = -1;
    let alertaOn = false;
    let tPrev = 0;

    const frame = (ahora) => {
      const vh = window.innerHeight;
      const r = canvas.getBoundingClientRect();
      /* El scrub va de "el canvas asoma por abajo" (top = vh) a "su centro
         llega al 40% del alto de pantalla" (top = vh*0.4 - h/2). Termina con
         el bloque bien a la vista y no pegado al nav: la alerta es el final
         de la historia y tiene que poder leerse tranquila, no de refilón
         mientras se va para arriba. */
      const p = clamp01((vh - r.top) / (vh * 0.6 + r.height / 2));
      pUlt = p;

      // El color viaja a --neg en 240ms, no salta.
      const dt = tPrev ? Math.min(64, ahora - tPrev) : 16;
      tPrev = ahora;
      const objetivo = p > 0.78 ? 1 : 0;
      const paso = dt / 240;
      const mixAnterior = mix;
      mix = objetivo > mix ? Math.min(1, mix + paso) : Math.max(0, mix - paso);

      // No redibujar por deltas invisibles; pero si el color todavía viaja,
      // sí hay algo nuevo que mostrar.
      if (Math.abs(p - pPrev) > 0.004 || mix !== mixAnterior) {
        pPrev = p;
        dibujar(p);
      }

      const v = CPL_BASE + (CPL_PICO - CPL_BASE) * easeOutCubic(clamp01((p - 0.55) / 0.45));
      // Throttle por magnitud: React no tiene por qué re-renderizar 60 veces
      // por segundo para mover un dígito que el ojo no ve cambiar.
      if (Math.abs(v - ultimoValor) >= 100) {
        ultimoValor = v;
        setValor(v);
      }
      const debe = p > 0.78;
      if (debe !== alertaOn) {
        alertaOn = debe;
        setAlerta(debe);
      }

      // Idle stop: 200ms sin scroll y el rAF se apaga. Salvo que el color
      // siga en tránsito, en cuyo caso hay que terminar la transición.
      const quieto = ahora - ultimoScroll > 200 && mix === objetivo;
      raf = quieto || !enPantalla ? 0 : requestAnimationFrame(frame);
    };

    const arrancar = () => {
      ultimoScroll = performance.now();
      if (!raf && enPantalla) raf = requestAnimationFrame(frame);
    };

    redimensionar();
    dibujar(0);

    // Lenis emite scroll nativo, así que un listener passive lo cubre.
    window.addEventListener("scroll", arrancar, { passive: true });

    const io = new IntersectionObserver(
      (entries) => {
        enPantalla = entries.some((e) => e.isIntersecting);
        if (enPantalla) arrancar();
      },
      { rootMargin: "120px 0px 120px 0px" }
    );
    io.observe(stage);

    const ro = new ResizeObserver(() => {
      redimensionar();
      pPrev = -1; // invalida el cache: el próximo dibujo va sí o sí
      dibujar(pUlt);
    });
    ro.observe(canvas);

    const onMq = () => {
      redimensionar();
      dibujar(pUlt);
    };
    mqMd.addEventListener("change", onMq);

    return () => {
      window.removeEventListener("scroll", arrancar);
      mqMd.removeEventListener("change", onMq);
      io.disconnect();
      ro.disconnect();
      mo.disconnect();
      clearTimeout(tColores);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={stageRef} className={className}>
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <span className="label ink-3">Alerta de costo</span>
          <div className="label label-lc ink-2 mt-1">{CAMPANA}</div>
        </div>
        <span
          className="display-2 num text-4xl md:text-5xl"
          style={{ color: alerta ? "var(--neg)" : "var(--ink)", transition: "color 240ms ease" }}
        >
          {money(valor)}
        </span>
      </div>

      <canvas
        ref={canvasRef}
        className="block w-full mt-4"
        style={{ height: 160 }}
        role="img"
        aria-label={`Costo por lead de la campaña ${CAMPANA}: estable alrededor de ${money(
          CPL_BASE
        )} y disparado a ${money(CPL_PICO)} en los últimos días.`}
      />

      <div
        className="mt-4 flex items-start gap-3 rounded-[var(--r-md)] border px-4 py-3"
        style={{
          borderColor: alerta ? "var(--neg)" : "var(--stage-line)",
          opacity: alerta ? 1 : 0.55,
          transition: "border-color 240ms ease, opacity 240ms ease",
        }}
      >
        <span
          aria-hidden="true"
          className="w-2 h-2 rounded-full shrink-0 mt-1.5"
          style={{ background: alerta ? "var(--neg)" : "var(--ink-3)" }}
        />
        <p className="ink-2 text-[14.5px] leading-relaxed">
          <strong className="ink font-medium">
            Costo por lead disparado: {money(CPL_PICO)}
          </strong>{" "}
          — 3,1× el promedio de la cuenta. Quasor te avisa el mismo día, no a fin de mes.
        </p>
      </div>
    </div>
  );
};
