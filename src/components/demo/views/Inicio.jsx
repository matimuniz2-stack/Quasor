import { useState, Fragment } from "react";
import { Ic, fmtN, money, useCountUp, Dialog, Switch, Avatar } from "../ui.jsx";
import { LineChart, Funnel, Donut, Meter } from "../charts.jsx";
import { STAGE_META, SOURCE_COLORS, CHART, ASSET_STATUS, PERIOD } from "../data.js";

const BLUE = 1385; // Dólar blue de referencia para la conversión ARS ↔ USD

// ── Shell de widget: header que arrastra + título + menú ─────────────────
const Widget = ({ title, children, className = "", center, delay = 0 }) => (
  <div className={`q-card q-card-hover flex flex-col min-w-0 q-in group ${className}`} style={{ animationDelay: `${delay}ms` }}>
    <div className="flex items-center gap-1.5 px-4 pt-3 pb-1 shrink-0">
      <Ic n="grip" className="w-3.5 h-3.5 q-mut opacity-0 group-hover:opacity-100 transition-opacity -ml-1 cursor-grab" />
      <span className="text-[13px] font-semibold truncate">{title}</span>
      <Ic n="more" className="w-3.5 h-3.5 q-mut ml-auto opacity-60" />
    </div>
    <div className={`px-4 pb-4 pt-1 flex-1 min-h-0 ${center ? "flex flex-col justify-center" : ""}`}>{children}</div>
  </div>
);

// KPI: ícono en tile primary/10 + tendencia + valor 3xl + label + "vs. período anterior"
const KPI = ({ icon, label, value, delta, diff, suffix = "", prefix = "", decimals = 0, invert, playKey, delay, format, small }) => {
  const v = useCountUp(value, 1100, playKey);
  const good = invert ? delta <= 0 : delta >= 0;
  return (
    <div className="q-card q-card-hover p-4 min-w-0 q-in" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-center justify-between">
        <span className="rounded-lg p-2" style={{ background: "color-mix(in oklab, var(--q-primary) 10%, transparent)", color: "var(--q-primary)" }}>
          <Ic n={icon} className="w-4 h-4" />
        </span>
        <span className="inline-flex items-center gap-0.5 text-[12px] font-medium q-num" style={{ color: good ? "var(--q-success)" : "var(--q-danger)" }}>
          <Ic n={delta >= 0 ? "up" : "down"} className="w-3.5 h-3.5" />
          {fmtN(Math.abs(delta), 1)}%
        </span>
      </div>
      <div className={`${small ? "text-[21px] @[1200px]/app:text-[24px]" : "text-[26px] @[1100px]/app:text-[28px]"} font-bold q-num tracking-[-0.03em] mt-3 leading-none whitespace-nowrap`}>
        {format ? format(v) : `${prefix}${fmtN(v, decimals)}${suffix}`}
      </div>
      <div className="text-[12.5px] q-mut mt-1.5 truncate">{label}</div>
      {diff && <div className="text-[11px] q-mut mt-2 pt-2 border-t truncate"><span className="font-medium q-fg2">{diff}</span> vs. período anterior</div>}
    </div>
  );
};

// ── Catálogo de "Agregar widget" (tipos reales del sheet) ────────────────
const WIDGET_TYPES = [
  { t: "kpi", label: "KPI", icon: "gauge", d: "Una métrica con su comparación de período" },
  { t: "line", label: "Líneas", icon: "trending", d: "Evolución de hasta 4 métricas, o de una métrica por categoría" },
  { t: "bars", label: "Barras", icon: "kanban", d: "Comparación por período o por categoría" },
  { t: "pie", label: "Torta", icon: "circle", d: "Distribución de una métrica por categoría" },
  { t: "funnel", label: "Embudo", icon: "filter", d: "Pipeline de oportunidades por etapa" },
  { t: "table", label: "Tabla", icon: "list", d: "Ranking por categoría con hasta 8 métricas como columnas" },
  { t: "pivot", label: "Pivot de Ads", icon: "megaphone", d: "Campaña → Ad set → Ad con inversión, clicks y leads atribuidos" },
  { t: "goal", label: "Objetivo del mes", icon: "target", d: "Vendido contra el objetivo mensual, por vendedor, sucursal o empresa" },
];

const AddWidgetDialog = ({ open, onClose, onPick }) => (
  <Dialog open={open} onClose={onClose} title="Agregar widget" subtitle="Elegí el tipo y configurá métricas, desglose y filtros." width={620}>
    <div className="p-4 grid grid-cols-1 @[560px]/app:grid-cols-2 gap-2">
      {WIDGET_TYPES.map((w) => (
        <button key={w.t} onClick={() => onPick(w.t)} className="text-left flex items-start gap-3 p-3 rounded-xl border hover:border-[var(--q-primary)] hover:bg-[color-mix(in_oklab,var(--q-primary)_5%,transparent)] transition-colors">
          <span className="rounded-lg p-2 q-bg-muted"><Ic n={w.icon} className="w-4 h-4" /></span>
          <span className="min-w-0">
            <span className="block text-[13px] font-medium">{w.label}</span>
            <span className="block text-[11.5px] q-mut leading-snug mt-0.5">{w.d}</span>
          </span>
        </button>
      ))}
    </div>
  </Dialog>
);

// Widgets extra que se pueden sumar en vivo (datos de ejemplo coherentes)
const ExtraWidget = ({ t, D, playKey }) => {
  if (t === "kpi") return <KPI icon="timer" label="Tiempo de 1ª respuesta" value={18} suffix=" min" delta={-22.4} invert diff="−5 min" playKey={playKey} delay={0} />;
  if (t === "goal") {
    const g = D.goals;
    return (
      <Widget title="Objetivo del mes · Monto vendido por vendedor" className="@[900px]/app:col-span-6">
        <div className="space-y-2.5">
          {g.sellers.map((s) => {
            const p = s.sold / s.goal;
            return (
              <div key={s.name} className="flex items-center gap-2.5 text-[12px]">
                <Avatar name={s.name} size={22} />
                <span className="w-28 truncate q-fg2">{s.name}</span>
                <span className="flex-1 h-2 rounded-full q-bg-muted overflow-hidden">
                  <span className="block h-full rounded-full" style={{ width: `${Math.min(100, p * 100)}%`, background: p >= 1 ? "var(--q-success)" : "var(--q-primary)", transformOrigin: "left", animation: "qGrowX .9s cubic-bezier(.2,.7,.2,1) both" }} />
                </span>
                <span className="w-10 text-right q-num font-medium">{Math.round(p * 100)}%</span>
              </div>
            );
          })}
        </div>
      </Widget>
    );
  }
  if (t === "table") {
    const rows = D.agents.map((a, i) => ({ a, min: [6, 14, 22, 41, 68][i] ?? 30, pct: [100, 94, 88, 71, 52][i] ?? 80 }));
    return (
      <Widget title="1ª respuesta por vendedor" className="@[900px]/app:col-span-6">
        <table className="w-full text-[12px]">
          <thead><tr className="q-th text-left"><th className="font-medium pb-1.5">Usuario asignado</th><th className="font-medium pb-1.5 text-right">Tiempo de 1ª respuesta</th><th className="font-medium pb-1.5 text-right">Dentro del SLA</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.a} className="border-t q-row">
                <td className="py-1.5"><span className="flex items-center gap-2"><Avatar name={r.a} size={20} />{r.a}</span></td>
                <td className="py-1.5 text-right q-num">{r.min} min</td>
                <td className="py-1.5 text-right q-num" style={{ color: r.pct >= 85 ? "var(--q-success)" : r.pct >= 65 ? "#d97706" : "var(--q-danger)" }}>{r.pct}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Widget>
    );
  }
  if (t === "pie") {
    const rows = D.agents.map((a, i) => ({ k: a, v: [34, 29, 26, 22, 17][i] ?? 10, c: CHART[i] }));
    return <Widget title="Leads nuevos por Usuario asignado" className="@[900px]/app:col-span-4" center><Donut rows={rows} center={rows.reduce((s, r) => s + r.v, 0)} centerLabel="Leads" /></Widget>;
  }
  if (t === "funnel") {
    return <Widget title="Pipeline de oportunidades" className="@[900px]/app:col-span-5"><Funnel rows={D.funnel.map(([k, v]) => ({ k, v, label: STAGE_META[k].label, c: STAGE_META[k].c }))} playKey={playKey} /></Widget>;
  }
  if (t === "pivot") return <Widget title="Rendimiento por campaña, ad set y ad" className="@[900px]/app:col-span-12"><Pivot rows={D.ads.pivot} cur="USD" /></Widget>;
  // line / bars → evolución de leads de ads
  return (
    <Widget title="Leads de ads en el tiempo" className="@[900px]/app:col-span-6">
      <LineChart labels={D.series.map((s) => s.d)} series={[{ id: "ads" + t, label: "Leads de ads", c: CHART[1], data: D.series.map((s) => Math.round(s.leads * 0.67)) }]} height={170} playKey={playKey} />
    </Widget>
  );
};

// ── Pivot de Ads: Campaña → Ad set → Ad, expandible ──────────────────────
const Pivot = ({ rows, cur }) => {
  const [open, setOpen] = useState({ 0: true, "0.0": true });
  const conv = (usd) => (cur === "USD" ? money(usd, "USD") : money(usd * BLUE, "ARS"));
  const cpl = (r) => (r.leads ? conv(r.spend / r.leads) : "—");
  const flat = [];
  const walk = (list, depth, path) =>
    list.forEach((r, i) => {
      const id = path ? `${path}.${i}` : String(i);
      flat.push({ r, depth, id, hasKids: !!r.children });
      if (r.children && open[id]) walk(r.children, depth + 1, id);
    });
  walk(rows, 0, "");
  const tot = rows.reduce((a, r) => ({ spend: a.spend + r.spend, imp: a.imp + r.imp, clicks: a.clicks + r.clicks, leads: a.leads + r.leads }), { spend: 0, imp: 0, clicks: 0, leads: 0 });
  const plat = (p) => (p === "Meta Ads" ? "#3b82f6" : "#f59e0b");
  const rootPlat = {};
  rows.forEach((r, i) => (rootPlat[i] = r.p));
  return (
    <div className="overflow-x-auto q-scroll -mx-1">
      <table className="w-full text-[12px] min-w-[640px]">
        <thead>
          <tr className="q-th text-left">
            <th className="font-medium py-1.5 px-1">Plataforma</th>
            <th className="font-medium py-1.5 px-1">Nombre</th>
            <th className="font-medium py-1.5 px-1 text-right">Inversión</th>
            <th className="font-medium py-1.5 px-1 text-right">Impresiones</th>
            <th className="font-medium py-1.5 px-1 text-right">Clicks</th>
            <th className="font-medium py-1.5 px-1 text-right">CTR</th>
            <th className="font-medium py-1.5 px-1 text-right">Leads</th>
            <th className="font-medium py-1.5 px-1 text-right">Costo por Lead</th>
          </tr>
        </thead>
        <tbody>
          {flat.map(({ r, depth, id, hasKids }) => {
            const p = rootPlat[id.split(".")[0]];
            return (
              <tr key={id} className={`border-t q-row ${depth === 0 ? "font-medium" : ""}`}>
                <td className="py-1.5 px-1 whitespace-nowrap">{depth === 0 && <span className="inline-flex items-center gap-1.5 text-[11px]"><span className="w-1.5 h-1.5 rounded-full" style={{ background: plat(p) }} />{p}</span>}</td>
                <td className="py-1.5 px-1">
                  <span className="flex items-center gap-1" style={{ paddingLeft: depth * 16 }}>
                    {hasKids ? (
                      <button onClick={() => setOpen((o) => ({ ...o, [id]: !o[id] }))} className="rounded hover:bg-[var(--q-muted)] p-0.5" aria-label={open[id] ? "Contraer" : "Expandir"}>
                        <Ic n="chevright" className={`w-3.5 h-3.5 transition-transform ${open[id] ? "rotate-90" : ""}`} />
                      </button>
                    ) : <span className="w-[18px]" />}
                    <span className="truncate">{r.name}</span>
                  </span>
                </td>
                <td className="py-1.5 px-1 text-right q-num whitespace-nowrap">{conv(r.spend)}</td>
                <td className="py-1.5 px-1 text-right q-num">{fmtN(r.imp)}</td>
                <td className="py-1.5 px-1 text-right q-num">{fmtN(r.clicks)}</td>
                <td className="py-1.5 px-1 text-right q-num">{fmtN((r.clicks / r.imp) * 100, 2)}%</td>
                <td className="py-1.5 px-1 text-right q-num">{r.leads}</td>
                <td className="py-1.5 px-1 text-right q-num font-semibold whitespace-nowrap">{cpl(r)}</td>
              </tr>
            );
          })}
          <tr className="border-t-2 font-semibold q-bg-muted/40">
            <td className="py-2 px-1" colSpan={2}>Total</td>
            <td className="py-2 px-1 text-right q-num whitespace-nowrap">{conv(tot.spend)}</td>
            <td className="py-2 px-1 text-right q-num">{fmtN(tot.imp)}</td>
            <td className="py-2 px-1 text-right q-num">{fmtN(tot.clicks)}</td>
            <td className="py-2 px-1 text-right q-num">{fmtN((tot.clicks / tot.imp) * 100, 2)}%</td>
            <td className="py-2 px-1 text-right q-num">{tot.leads}</td>
            <td className="py-2 px-1 text-right q-num whitespace-nowrap">{conv(tot.spend / tot.leads)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

// ── Vista General ────────────────────────────────────────────────────────
const General = ({ D, playKey, extras, go }) => (
  <div className="grid grid-cols-1 @[640px]/app:grid-cols-6 @[900px]/app:grid-cols-12 gap-3 @[900px]/app:gap-4">
    {D.kpis.map((k, i) => (
      <div key={k.id} className="@[640px]/app:col-span-2 @[900px]/app:col-span-4">
        <KPI {...k} playKey={playKey} delay={i * 60} />
      </div>
    ))}
    <Widget title={`Leads nuevos y ${D.keyStage} en el tiempo`} className="@[640px]/app:col-span-6 @[900px]/app:col-span-7" delay={180}>
      <LineChart
        labels={D.series.map((s) => s.d)}
        series={[
          { id: "l" + D.key, label: "Leads nuevos", c: CHART[0], data: D.series.map((s) => s.leads) },
          { id: "k" + D.key, label: D.keyStage, c: CHART[1], data: D.series.map((s) => s.key) },
        ]}
        playKey={playKey}
      />
      <div className="flex items-center justify-center gap-4 text-[11px] q-mut mt-1">
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: CHART[0] }} />Leads nuevos</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: CHART[1] }} />{D.keyStage}</span>
      </div>
    </Widget>
    <Widget title="Pipeline de oportunidades" className="@[640px]/app:col-span-6 @[900px]/app:col-span-5" delay={240} center>
      <Funnel rows={D.funnel.map(([k, v]) => ({ k, v, label: STAGE_META[k].label, c: STAGE_META[k].c }))} playKey={playKey} onPick={() => go("pipeline")} />
    </Widget>
    <Widget title="Leads nuevos por Origen del lead" className="@[640px]/app:col-span-3 @[900px]/app:col-span-4" delay={300} center>
      <Donut rows={D.origins.map(([k, v]) => ({ k, v, c: SOURCE_COLORS[k] === "#3b82f6" && k === "Meta Ads" ? "#3b82f6" : SOURCE_COLORS[k] }))} center={D.kpis[0].value} centerLabel="Leads" size={120} />
    </Widget>
    <Widget title="Tasa de conversión en el tiempo" className="@[640px]/app:col-span-3 @[900px]/app:col-span-4" delay={360}>
      <LineChart labels={D.series.map((s) => s.d)} series={[{ id: "c" + D.key, label: "Tasa de conversión", c: CHART[2], data: D.convSeries, min: Math.floor(Math.min(...D.convSeries) - 2) }]} fmt={(v) => `${fmtN(v, 0)}%`} height={150} playKey={playKey} />
    </Widget>
    <Widget title={`${D.asset.label} por Estado del activo`} className="@[640px]/app:col-span-6 @[900px]/app:col-span-4" delay={420} center>
      <Donut rows={D.assetStatus.map(([k, v]) => ({ k, v, c: ASSET_STATUS[k] }))} center={D.assetTotal} centerLabel={D.asset.label} size={120} />
    </Widget>
    {extras.map((t, i) => (
      <div key={i} className={t === "kpi" ? "@[640px]/app:col-span-2 @[900px]/app:col-span-4" : "contents"}>
        <ExtraWidget t={t} D={D} playKey={playKey} />
      </div>
    ))}
  </div>
);

// ── Vista Ads ────────────────────────────────────────────────────────────
const Ads = ({ D, cur, playKey }) => {
  const a = D.ads;
  const toCur = (usd) => (cur === "USD" ? usd : usd * BLUE);
  const fmtCur = (v) => money(v, cur);
  const cpl = a.spendUSD / a.leads;
  const cac = a.spendUSD / a.attributedSales;
  const roi = ((a.revenueUSD - a.spendUSD) / a.spendUSD) * 100;
  const roas = a.revenueUSD / a.spendUSD;
  return (
    <div className="grid grid-cols-1 @[640px]/app:grid-cols-6 @[1000px]/app:grid-cols-10 gap-3 @[900px]/app:gap-4">
      {[
        { icon: "handcoins", label: "Inversión publicitaria", value: toCur(a.spendUSD), delta: 6.3, format: fmtCur },
        { icon: "users", label: "Leads de ads", value: a.leads, delta: 19.4 },
        { icon: "target", label: "CPL", value: toCur(cpl), delta: -11.0, invert: true, format: fmtCur },
        { icon: "eye", label: "Impresiones", value: a.impressions, delta: 8.8 },
        { icon: "click", label: "CPC promedio", value: toCur(a.spendUSD / a.clicks), delta: -4.1, invert: true, format: (v) => (cur === "USD" ? `US$ ${fmtN(v, 2)}` : money(v, "ARS")) },
      ].map((k, i) => (
        <div key={k.label} className="@[640px]/app:col-span-2">
          <KPI {...k} small playKey={playKey + cur} delay={i * 50} />
        </div>
      ))}
      <div className="col-span-full flex items-center gap-2 pt-2">
        <span className="text-[14px] font-semibold">Atribución y rentabilidad</span>
        <span className="text-[11.5px] q-mut">cada venta vuelve al anuncio que trajo el lead</span>
      </div>
      {[
        { icon: "receipt", label: "Ventas atribuidas", value: a.attributedSales, delta: 25 },
        { icon: "usercheck", label: "CAC", value: toCur(cac), delta: -14.9, invert: true, format: fmtCur },
        { icon: "banknote", label: "Ingreso atribuido", value: toCur(a.revenueUSD), delta: 31.2, format: fmtCur },
        { icon: "percent", label: "ROI", value: roi, delta: 22.7, format: (v) => `${fmtN(v, 0)}%` },
        { icon: "trending", label: "ROAS", value: roas, delta: 18.1, format: (v) => `${fmtN(v, 1)}x` },
      ].map((k, i) => (
        <div key={k.label} className="@[640px]/app:col-span-2">
          <KPI {...k} small playKey={playKey + cur} delay={250 + i * 50} />
        </div>
      ))}
      <Widget title="Rendimiento por canal" className="col-span-full @[1000px]/app:col-span-5">
        <table className="w-full text-[12px]">
          <thead><tr className="q-th text-left"><th className="font-medium pb-1.5">Plataforma</th><th className="font-medium pb-1.5 text-right">Inversión</th><th className="font-medium pb-1.5 text-right">Leads</th><th className="font-medium pb-1.5 text-right">CPL</th><th className="font-medium pb-1.5 text-right">Ventas</th><th className="font-medium pb-1.5 text-right">CAC</th></tr></thead>
          <tbody>
            {a.channels.map((c) => (
              <tr key={c.p} className="border-t q-row">
                <td className="py-2"><span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full" style={{ background: c.p === "Meta Ads" ? "#3b82f6" : "#f59e0b" }} />{c.p}</span></td>
                <td className="py-2 text-right q-num whitespace-nowrap">{fmtCur(toCur(c.spend))}</td>
                <td className="py-2 text-right q-num">{c.leads}</td>
                <td className="py-2 text-right q-num whitespace-nowrap">{fmtCur(toCur(c.spend / c.leads))}</td>
                <td className="py-2 text-right q-num">{c.sales}</td>
                <td className="py-2 text-right q-num font-semibold whitespace-nowrap">{fmtCur(toCur(c.spend / c.sales))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Widget>
      <Widget title="Leads de ads en el tiempo" className="col-span-full @[1000px]/app:col-span-5">
        <LineChart
          labels={D.series.map((s) => s.d)}
          series={[{ id: "ad" + D.key, label: "Leads de ads", c: CHART[1], data: D.series.map((s) => Math.round(s.leads * 0.67)) }]}
          height={150}
          playKey={playKey}
        />
      </Widget>
      <Widget title="Rendimiento por campaña, ad set y ad" className="col-span-full">
        <Pivot rows={a.pivot} cur={cur} />
      </Widget>
    </div>
  );
};

export const Inicio = ({ D, go, playKey }) => {
  const [tab, setTab] = useState("General");
  const [cur, setCur] = useState("USD");
  const [cmp, setCmp] = useState(true);
  const [add, setAdd] = useState(false);
  const [extras, setExtras] = useState([]);
  return (
    <div>
      <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
        <h3 className="text-[17px] font-semibold tracking-[-0.02em]">Inicio</h3>
        <div className="flex items-center gap-2 flex-wrap">
          <button className="q-btn q-btn-ghost q-btn-icon" title="Actualizar" aria-label="Actualizar"><Ic n="refresh" className="w-3.5 h-3.5" /></button>
          <span className="q-btn q-btn-out !font-normal"><Ic n="cal" className="w-3.5 h-3.5 q-mut" />{PERIOD}</span>
          <div className="q-seg" role="group" aria-label="Moneda" title="Los montos en otra moneda se convierten al cierre del día de cada operación.">
            {["ARS", "USD"].map((c) => <button key={c} aria-pressed={cur === c} onClick={() => setCur(c)}>{c}</button>)}
          </div>
          <span className="hidden @[1000px]/app:inline-flex items-center gap-2 text-[12px] q-fg2">
            <Switch on={cmp} onChange={setCmp} label="Comparar con" />
            Comparar con <span className="q-btn q-btn-out !h-7 !font-normal">Período anterior <Ic n="chevdown" className="w-3 h-3 q-mut" /></span>
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 flex-wrap mb-4">
        <div className="flex items-center gap-1.5">
          <div className="q-seg" role="tablist">
            {["General", "Ads"].map((t) => <button key={t} role="tab" aria-pressed={tab === t} onClick={() => setTab(t)}>{t === "Ads" && <Ic n="megaphone" className="w-3 h-3" />}{t}</button>)}
          </div>
          <button className="q-btn q-btn-ghost q-btn-icon !w-7 !h-7" title="Nueva vista" aria-label="Nueva vista"><Ic n="plus" className="w-3.5 h-3.5" /></button>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden @[1100px]/app:inline text-[11.5px] q-mut">Dólar blue <span className="q-num q-fg2 font-medium">$ {fmtN(BLUE)}</span></span>
          <button className="q-btn q-btn-out hidden @[640px]/app:inline-flex"><Ic n="link" className="w-3.5 h-3.5" />Compartir</button>
          <button className="q-btn q-btn-pri" onClick={() => setAdd(true)}><Ic n="plus" className="w-3.5 h-3.5" />Agregar widget</button>
        </div>
      </div>

      {tab === "General"
        ? <General D={D} playKey={playKey} extras={extras} go={go} />
        : <Ads D={D} cur={cur} playKey={playKey + "ads"} />}

      <AddWidgetDialog
        open={add}
        onClose={() => setAdd(false)}
        onPick={(t) => { setAdd(false); setTab("General"); setExtras((e) => [...e, t]); }}
      />
    </div>
  );
};
