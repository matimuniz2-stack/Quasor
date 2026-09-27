import { useState, Fragment } from "react";
import { Ic, Avatar, Dialog, PageHeader, RefreshBtn, SearchBox, FilterChip, Tint, Dot, money, fmtN, WaBtn } from "../ui.jsx";
import { AssetStatus, AssetThumb, SrcBadge } from "../domain.jsx";
import { Meter } from "../charts.jsx";
import { ASSET_STATUS, UPDATES } from "../data.js";
import metaLogo from "../../../assets/logos/meta.svg";
import googleAdsLogo from "../../../assets/logos/google-ads.svg";
import googleCalLogo from "../../../assets/logos/google-calendar.svg";
import mlLogo from "../../../assets/logos/mercadolibre.svg";
import tokkoLogo from "../../../assets/logos/tokko.png";

const priceOf = (a) => `${money(a.price, a.cur)}${a.per || ""}`;
const Th = ({ children, right, className = "" }) => <th className={`py-2.5 px-3 font-medium whitespace-nowrap ${right ? "text-right" : ""} ${className}`}>{children}</th>;
const Td = ({ children, right, className = "" }) => <td className={`py-2.5 px-3 ${right ? "text-right q-num" : ""} ${className}`}>{children}</td>;
const Table = ({ head, children, min = 640 }) => (
  <div className="q-card !rounded-xl overflow-hidden">
    <div className="overflow-x-auto q-scroll">
      <table className="w-full text-[12.5px]" style={{ minWidth: min }}>
        <thead><tr className="q-th text-left border-b">{head}</tr></thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  </div>
);
const Person = ({ name }) => name ? <span className="flex items-center gap-1.5 whitespace-nowrap"><Avatar name={name} size={20} />{name}</span> : <span className="q-mut">—</span>;

// ════════════════════════════════════════════════════════════════════════
//  PROPIEDADES / AUTOMÓVILES
// ════════════════════════════════════════════════════════════════════════
const StatusMenu = ({ a, onPick, keys }) => {
  const [open, setOpen] = useState(false);
  const opts = keys.filter((k) => k !== a.status);
  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <AssetStatus s={a.status} glass onClick={() => setOpen((o) => !o)} />
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-7 z-40 w-40 q-bg-pop border rounded-xl p-1 q-pop" style={{ boxShadow: "var(--q-shadow-lg)" }}>
            <div className="px-2 py-1 text-[10.5px] q-mut">Cambiar estado</div>
            {opts.map((k) => (
              <button key={k} onClick={() => { setOpen(false); onPick(k); }} className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-[12px] hover:bg-[var(--q-muted)]">
                <Dot c={ASSET_STATUS[k]} />{k}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const AssetCard = ({ a, D, api, i, keys }) => {
  const attrIcons = D.key === "inmo" ? ["house", "bed", "ruler", "tag"] : ["car", "cal", "gauge"];
  const attrs = D.key === "inmo" && a.attrs.length === 3 ? [a.attrs[0], null, a.attrs[1], a.attrs[2]] : a.attrs;
  return (
    <div className="q-card q-card-hover overflow-hidden q-in hover:-translate-y-0.5" style={{ animationDelay: `${i * 40}ms` }}>
      <AssetThumb a={a} className="h-32" icon={D.asset.icon} />
      <div className="p-3">
        <div className="flex items-start gap-2">
          <div className="text-[13px] font-semibold leading-snug line-clamp-2 flex-1">{a.title}</div>
          <StatusMenu a={a} keys={keys} onPick={(s) => api.setAssetStatus(a.id, s)} />
        </div>
        <div className="text-[15px] font-bold q-num mt-1">{priceOf(a)}</div>
        <div className="flex items-center gap-1 text-[11.5px] q-mut mt-1"><Ic n="pin" className="w-3 h-3" /><span className="truncate">{a.zone}</span></div>
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mt-2 text-[11px] q-fg2">
          {attrs.map((t, k) => t && <span key={k} className="inline-flex items-center gap-1"><Ic n={attrIcons[k] || "tag"} className="w-3 h-3 q-mut" />{t}</span>)}
        </div>
        <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t">
          <span className="flex -space-x-1.5">{a.team.map((n) => <Avatar key={n} name={n} size={20} className="ring-2 ring-[var(--q-card)]" />)}</span>
          {D.key === "inmo" && <span className="text-[10.5px] q-mut flex items-center gap-1"><Ic n="key" className="w-3 h-3" />{(a.id.charCodeAt(1) % 3) + 1} llaves</span>}
        </div>
      </div>
    </div>
  );
};

export const Assets = ({ D, S, api }) => {
  const [status, setStatus] = useState("Disponible");
  const [q, setQ] = useState("");
  const [mode, setMode] = useState("modelo");
  const keys = D.key === "inmo" ? ["Disponible", "Reservado", "Vendido", "Archivado"] : ["Disponible", "Reservado", "Vendido", "Agotado", "Archivado"];
  const list = S.assets.filter((a) => (!status || a.status === status) && (!q || a.title.toLowerCase().includes(q.toLowerCase())));
  const grid = (arr) => (
    <div className="grid grid-cols-1 @[560px]/app:grid-cols-2 @[900px]/app:grid-cols-3 @[1200px]/app:grid-cols-4 gap-3">
      {arr.map((a, i) => <AssetCard key={a.id} a={a} D={D} api={api} i={i} keys={keys} />)}
    </div>
  );
  return (
    <div>
      <PageHeader title={D.asset.label} meta={`${D.assetTotal} en inventario`}>
        {D.key === "auto" && (
          <div className="q-seg">
            <button aria-pressed={mode === "modelo"} onClick={() => setMode("modelo")}>Por modelo</button>
            <button aria-pressed={mode === "todas"} onClick={() => setMode("todas")}>Todas las unidades</button>
          </div>
        )}
        <RefreshBtn />
        {D.integ.tokko && <button className="q-btn q-btn-out" onClick={() => api.toast("Sincronización iniciada. Este proceso puede tardar varios minutos.")}><img src={tokkoLogo} alt="" className="w-3.5 h-3.5 rounded-sm" />Sincronizar con Tokko</button>}
        <button className="q-btn q-btn-out hidden @[760px]/app:inline-flex"><img src={mlLogo} alt="" className="w-3.5 h-3.5" />Publicaciones</button>
        <button className="q-btn q-btn-pri"><Ic n="plus" className="w-3.5 h-3.5" />{D.asset.newLabel}</button>
      </PageHeader>
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <SearchBox value={q} onChange={setQ} placeholder={`Buscar ${D.asset.lower}...`} className="w-full @[640px]/app:w-56" />
        <FilterChip label="Estado" value={status} options={keys} onChange={setStatus} />
        <span className="h-8 px-2.5 rounded-lg border text-[12px] inline-flex items-center gap-1.5 q-bg-card q-mut"><Ic n="filter" className="w-3 h-3" />{D.key === "inmo" ? "Operación · Tipo · Zona" : "Marca · Modelo · Condición"}</span>
        <span className="h-8 px-2.5 rounded-lg border text-[12px] inline-flex items-center gap-1.5 q-bg-card q-mut">Ordenar: Más recientes</span>
      </div>
      {D.key === "auto" && mode === "modelo" ? (
        <div className="space-y-4">
          <div>
            <div className="text-[13px] font-semibold mb-2">0km por modelo ({list.filter((a) => a.zone.startsWith("0km")).length})</div>
            {grid(list.filter((a) => a.zone.startsWith("0km")))}
          </div>
          <div>
            <div className="text-[13px] font-semibold mb-2">Usados ({list.filter((a) => !a.zone.startsWith("0km")).length})</div>
            {grid(list.filter((a) => !a.zone.startsWith("0km")))}
          </div>
        </div>
      ) : grid(list)}
      {list.length === 0 && <div className="text-center q-mut text-[12px] py-10">No hay {D.asset.lower} con ese estado</div>}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════
//  VENTAS
// ════════════════════════════════════════════════════════════════════════
const ROLE_C = { "Agente vendedor": "#16a34a", "Agente comprador": "#3b82f6", "Inmobiliaria externa": "#6366f1", "Oficina": "#d97706", "Referente": "#0ea5e9", "Otro": "#71717a" };
const CAT = { "Agente vendedor": ["Vendedores", "#10b981"], "Oficina": ["Vendedores", "#10b981"], "Referente": ["Vendedores", "#10b981"], "Agente comprador": ["Compradores", "#3b82f6"], "Inmobiliaria externa": ["Intermediarios", "#8b5cf6"] };

const grossOf = (s) => (s.op === "Alquiler" ? s.value * s.commMonths : (s.value * s.commPct) / 100);

export const Sales = ({ D, S, api }) => {
  const [open, setOpen] = useState({});
  if (D.key === "auto") {
    return (
      <div>
        <PageHeader title="Ventas" meta={`${S.sales.length} operaciones · últimos 90 días`}>
          <RefreshBtn />
          <button className="q-btn q-btn-out"><Ic n="download" className="w-3.5 h-3.5" />Descargar Excel</button>
          <button className="q-btn q-btn-pri"><Ic n="plus" className="w-3.5 h-3.5" />Nueva venta</button>
        </PageHeader>
        <Table min={860} head={<><Th>Fecha</Th><Th>Automóvil</Th><Th>Vendedor</Th><Th right>Precio de venta</Th><Th>Permuta</Th><Th right>Margen</Th><Th right>Comisión</Th><Th>Estado</Th></>}>
          {S.sales.map((s) => {
            const a = D.assets.find((x) => x.id === s.asset);
            const off = ((s.list - s.value) / s.list) * 100;
            const m = s.margin;
            const st = s.status === "Aprobada" ? ["#16a34a", "checkbig"] : s.status === "Rechazada" ? ["#ef4444", "circlex"] : ["#d97706", "clock"];
            return (
              <tr key={s.id} className={`border-b last:border-b-0 q-row ${s.fresh ? "q-flash" : ""}`}>
                <Td className="q-num q-mut whitespace-nowrap">{s.date}</Td>
                <Td><span className="flex items-center gap-2 min-w-0"><AssetThumb a={a} className="w-10 h-7 rounded shrink-0" icon="car" /><span className="min-w-0"><span className="block font-medium truncate">{s.title || a.title}</span><span className="text-[10.5px] q-mut">{s.plate}</span></span></span></Td>
                <Td><Person name={s.agent} /></Td>
                <Td right><span className="block font-medium whitespace-nowrap">{money(s.value, s.cur)}</span><span className="text-[10.5px] q-mut">{off > 0 ? `−${fmtN(off, 1)}% de lista` : "precio de lista"}</span></Td>
                <Td>{s.tradeIn ? <span><span className="block q-num whitespace-nowrap">{money(s.tradeIn.v, s.cur)}</span><span className="text-[10.5px] q-mut">{s.tradeIn.t}</span></span> : <span className="q-mut">—</span>}</Td>
                <Td right><span className="block font-semibold whitespace-nowrap" style={{ color: m >= 0 ? "#059669" : "var(--q-danger)" }}>{money(m, s.cur)}</span><span className="text-[10.5px] q-mut">{fmtN((m / s.value) * 100, 1)}%</span></Td>
                <Td right className="whitespace-nowrap">{money(s.comm, s.cur)}</Td>
                <Td><Tint c={st[0]}><Ic n={st[1]} className="w-3 h-3" />{s.status}</Tint></Td>
              </tr>
            );
          })}
        </Table>
      </div>
    );
  }
  const tot = S.sales.reduce((a, s) => {
    const g = grossOf(s);
    const off = s.splits.find((x) => x[1] === "Oficina");
    return { gross: a.gross + g, office: a.office + (off ? (g * off[2]) / 100 : 0) };
  }, { gross: 0, office: 0 });
  return (
    <div>
      <PageHeader title="Ventas" meta={`${S.sales.length} operaciones · últimos 90 días`}>
        <RefreshBtn />
        <button className="q-btn q-btn-out"><Ic n="download" className="w-3.5 h-3.5" />Descargar Excel</button>
        <button className="q-btn q-btn-pri"><Ic n="plus" className="w-3.5 h-3.5" />Nueva venta</button>
      </PageHeader>
      <Table min={820} head={<><Th className="w-8" /><Th>Fecha</Th><Th>Operación</Th><Th>Propiedad</Th><Th>Agente principal</Th><Th right>Valor</Th><Th right>Comisión</Th><Th right>Comisión oficina</Th></>}>
        {S.sales.map((s) => {
          const a = D.assets.find((x) => x.id === s.asset);
          const g = grossOf(s);
          const off = s.splits.find((x) => x[1] === "Oficina");
          return (
            <Fragment key={s.id}>
              <tr className={`border-b q-row cursor-pointer ${s.fresh ? "q-flash" : ""}`} onClick={() => setOpen((o) => ({ ...o, [s.id]: !o[s.id] }))}>
                <Td><Ic n="chevright" className={`w-3.5 h-3.5 q-mut transition-transform ${open[s.id] ? "rotate-90" : ""}`} /></Td>
                <Td className="q-num q-mut whitespace-nowrap">{s.date}</Td>
                <Td><Tint c={s.op === "Venta" ? "#16a34a" : "#d97706"}>{s.op}</Tint></Td>
                <Td><span className="flex items-center gap-2 min-w-0"><AssetThumb a={a} className="w-10 h-7 rounded shrink-0" /><span className="font-medium truncate">{s.title || a.title}</span></span></Td>
                <Td><Person name={s.agent} /></Td>
                <Td right className="whitespace-nowrap">{money(s.value, "USD")}{s.op === "Alquiler" ? "/mes" : ""}</Td>
                <Td right><span className="block font-medium whitespace-nowrap">{money(g, "USD")}</span><span className="text-[10.5px] q-mut">{s.op === "Alquiler" ? `${s.commMonths} meses` : `${s.commPct}%`}</span></Td>
                <Td right className="font-semibold whitespace-nowrap" ><span style={{ color: "var(--q-success)" }}>{off ? money((g * off[2]) / 100, "USD") : "—"}</span></Td>
              </tr>
              {open[s.id] && (
                <tr className="border-b">
                  <td colSpan={8} className="px-4 py-3 q-fade" style={{ background: "color-mix(in oklab, var(--q-muted) 35%, transparent)" }}>
                    <div className="text-[12px] font-semibold mb-2">Desglose de comisiones ({s.splits.length})</div>
                    <table className="w-full text-[12px]">
                      <thead><tr className="q-th text-left"><th className="font-medium pb-1">Destinatario</th><th className="font-medium pb-1">Categoría</th><th className="font-medium pb-1">Rol</th><th className="font-medium pb-1 text-right">% bruto</th><th className="font-medium pb-1 text-right">Importe</th></tr></thead>
                      <tbody>
                        {s.splits.map(([to, role, pct]) => (
                          <tr key={to + role} className="border-t">
                            <td className="py-1.5">{to === "Oficina" ? <span className="flex items-center gap-1.5"><Ic n="building" className="w-3.5 h-3.5 q-mut" />Oficina</span> : <Person name={to} />}</td>
                            <td className="py-1.5"><Tint c={(CAT[role] || ["Otro", "#71717a"])[1]}>{(CAT[role] || ["Otro"])[0]}</Tint></td>
                            <td className="py-1.5"><Tint c={ROLE_C[role]}>{role}</Tint></td>
                            <td className="py-1.5 text-right q-num">{pct}%</td>
                            <td className="py-1.5 text-right q-num font-medium">{money((g * pct) / 100, "USD")}</td>
                          </tr>
                        ))}
                        <tr className="border-t font-semibold"><td className="py-1.5" colSpan={3}>Subtotal (USD)</td><td className="py-1.5 text-right q-num">100%</td><td className="py-1.5 text-right q-num">{money(g, "USD")}</td></tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
            </Fragment>
          );
        })}
        <tr className="font-semibold" style={{ background: "color-mix(in oklab, var(--q-muted) 45%, transparent)" }}>
          <td colSpan={6} className="py-2.5 px-3">Totales (USD)</td>
          <td className="py-2.5 px-3 text-right q-num whitespace-nowrap">{money(tot.gross, "USD")}</td>
          <td className="py-2.5 px-3 text-right q-num whitespace-nowrap" style={{ color: "var(--q-success)" }}>{money(tot.office, "USD")}</td>
        </tr>
      </Table>
      <div className="text-[11.5px] q-mut mt-2 flex items-center gap-1.5"><Ic n="chevright" className="w-3 h-3" />Tocá una operación para ver cómo se reparte la comisión.</div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════
//  PEDIDOS (inmobiliaria)
// ════════════════════════════════════════════════════════════════════════
const PED_C = { Activo: "#14b8a6", Pausado: "#d97706", Cerrado: "#ef4444" };
const matchC = (m) => (m === "Cumple todo" ? "#16a34a" : m === "No cumple" ? "#ef4444" : "#d97706");

export const Pedidos = ({ D, api }) => {
  const [view, setView] = useState("tabla");
  const [sel, setSel] = useState(null);
  const p = sel != null ? D.pedidos[sel] : null;
  return (
    <div>
      <PageHeader title="Pedidos" meta="búsquedas de compradores, cruzadas contra tu cartera">
        <div className="q-seg">
          <button aria-pressed={view === "tabla"} onClick={() => setView("tabla")}><Ic n="list" className="w-3.5 h-3.5" />Tabla</button>
          <button aria-pressed={view === "tablero"} onClick={() => setView("tablero")}><Ic n="kanban" className="w-3.5 h-3.5" />Tablero</button>
        </div>
        <button className="q-btn q-btn-pri"><Ic n="plus" className="w-3.5 h-3.5" />Nuevo pedido</button>
      </PageHeader>
      {view === "tabla" ? (
        <Table min={900} head={<><Th>Solicitante</Th><Th>Criterios</Th><Th>Presupuesto</Th><Th>Coincidencias</Th><Th>Estado</Th><Th>Responsable</Th><Th>Creado</Th><Th>Fuente</Th></>}>
          {D.pedidos.map((r, i) => (
            <tr key={r.name} className="border-b last:border-b-0 q-row cursor-pointer" onClick={() => setSel(i)}>
              <Td><span className="block font-medium">{r.name}</span><span className="text-[10.5px] q-mut q-num">{r.phone}</span></Td>
              <Td className="max-w-[240px]"><span className="line-clamp-2 q-fg2">{r.criteria}</span></Td>
              <Td><span className="block q-num whitespace-nowrap">{r.budget}</span><span className="text-[10.5px] q-mut">{r.tol}</span></Td>
              <Td><span className="flex items-center gap-1.5"><span className="font-semibold q-num">{r.matches}</span><Tint c={matchC(r.match)}>{r.match}</Tint></span></Td>
              <Td><Tint c={PED_C[r.status]}>{r.status}</Tint></Td>
              <Td><Person name={r.owner} /></Td>
              <Td className="q-num q-mut">{r.created}</Td>
              <Td><SrcBadge src={r.src} /></Td>
            </tr>
          ))}
        </Table>
      ) : (
        <div className="flex gap-3 overflow-x-auto q-scroll pb-2">
          {Object.keys(PED_C).map((s) => (
            <div key={s} className="w-[270px] shrink-0 rounded-xl border q-bg-canvas" style={{ borderTop: `2px solid ${PED_C[s]}` }}>
              <div className="px-3 py-2 flex items-center gap-2 text-[12.5px] font-semibold">{s}<span className="text-[10.5px] rounded-md px-1.5 q-tint" style={{ "--c": PED_C[s] }}>{D.pedidos.filter((r) => r.status === s).length}</span></div>
              <div className="px-2 pb-2 space-y-2">
                {D.pedidos.map((r, i) => r.status === s && (
                  <button key={r.name} onClick={() => setSel(i)} className="w-full text-left rounded-xl border q-bg-card p-2.5 text-[12px] hover:border-[var(--q-primary)] transition-colors">
                    <div className="font-semibold">{r.name}</div>
                    <div className="q-mut text-[11px] mt-0.5 line-clamp-2">{r.criteria}</div>
                    <div className="flex items-center justify-between mt-2"><span className="q-num font-medium">{r.budget}</span><Tint c={matchC(r.match)}>{r.matches} coincid.</Tint></div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      {p && (
        <Dialog open onClose={() => setSel(null)} width={640} title={<>{p.name}<Tint c={PED_C[p.status]}>{p.status}</Tint></>} subtitle={<>{p.criteria} · hasta {p.budget} ({p.tol.toLowerCase()})</>}>
          <div className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[13px] font-semibold">Posibles Propiedades ({Math.max(1, p.matches)})</span>
              <span className="text-[11px] q-mut">se recalculan cuando entra una propiedad nueva</span>
            </div>
            <div className="space-y-2">
              {D.assets.filter((a) => a.status === "Disponible" && a.cur === "USD" && !a.per).slice(0, Math.max(1, Math.min(4, p.matches))).map((a, i) => (
                <div key={a.id} className="flex items-center gap-3 p-2.5 rounded-xl border q-in" style={{ animationDelay: `${i * 60}ms` }}>
                  <AssetThumb a={a} className="w-16 h-11 rounded-lg shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-[12.5px] font-medium truncate">{a.title}</div>
                    <div className="text-[11px] q-mut q-num">{priceOf(a)} · {a.attrs.slice(1, 3).join(" · ")}</div>
                  </div>
                  <Tint c={i === 0 ? "#16a34a" : "#d97706"}>{i === 0 ? "Cumple todo" : "Cumple 4 de 5"}</Tint>
                  <button className="q-btn q-btn-out !h-7" onClick={() => api.toast(`Sugerida a ${p.name}. Te avisamos cuando responda.`)}>Sugerir</button>
                </div>
              ))}
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════
//  TASACIONES (inmobiliaria)
// ════════════════════════════════════════════════════════════════════════
const TAS_C = { Solicitada: "#64748b", Visitada: "#d97706", Tasada: "#3b82f6", Captada: "#10b981", Perdida: "#ef4444" };

export const Tasaciones = ({ D, api }) => {
  const [rows, setRows] = useState(D.tasaciones);
  const [view, setView] = useState("cards");
  const captar = (i) => {
    setRows((r) => r.map((x, k) => (k === i ? { ...x, status: "Captada", auth: "Vigente" } : x)));
    api.toast(`${rows[i].addr} entró a tu cartera de propiedades`);
  };
  const authC = (a) => (a === "Vigente" ? "#16a34a" : a?.startsWith("Vence") ? "#d97706" : "#ef4444");
  return (
    <div>
      <PageHeader title="Tasaciones" meta={`${rows.filter((r) => r.status === "Captada").length} captadas este mes`}>
        <div className="q-seg">
          <button aria-pressed={view === "cards"} onClick={() => setView("cards")}>Tarjetas</button>
          <button aria-pressed={view === "tabla"} onClick={() => setView("tabla")}>Tabla</button>
        </div>
        <button className="q-btn q-btn-pri"><Ic n="plus" className="w-3.5 h-3.5" />Nueva tasación</button>
      </PageHeader>
      {view === "cards" ? (
        <div className="grid grid-cols-1 @[640px]/app:grid-cols-2 @[1000px]/app:grid-cols-3 gap-3">
          {rows.map((r, i) => (
            <div key={r.addr} className="q-card q-card-hover p-3.5 q-in" style={{ animationDelay: `${i * 40}ms` }}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-[13px] font-semibold truncate">{r.owner}</div>
                  <div className="text-[11.5px] q-mut flex items-center gap-1 truncate"><Ic n="pin" className="w-3 h-3" />{r.addr}</div>
                </div>
                <Tint c={TAS_C[r.status]}>{r.status}</Tint>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="rounded-lg px-2.5 py-2" style={{ background: "color-mix(in oklab, var(--q-muted) 60%, transparent)" }}>
                  <div className="text-[10.5px] q-mut">Valor de tasación</div>
                  <div className="text-[14px] font-bold q-num">{r.value}</div>
                  {r.m2 && <div className="text-[10.5px] q-mut q-num">{r.m2}</div>}
                </div>
                <div className="rounded-lg px-2.5 py-2" style={{ background: "color-mix(in oklab, var(--q-muted) 60%, transparent)" }}>
                  <div className="text-[10.5px] q-mut">Precio sugerido</div>
                  <div className="text-[14px] font-bold q-num">{r.suggested}</div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 text-[11.5px]">
                <Person name={r.who} />
                {r.auth ? <Tint c={authC(r.auth)}><Ic n="shield" className="w-3 h-3" />{r.auth}</Tint> : r.lost ? <span className="q-mut">{r.lost}</span> : <span className="q-mut">{r.date}</span>}
              </div>
              {r.status === "Tasada" && (
                <div className="flex gap-2 mt-3">
                  <button className="q-btn q-btn-pri flex-1 !h-8" onClick={() => captar(i)}><Ic n="building" className="w-3.5 h-3.5" />Captar</button>
                  <button className="q-btn q-btn-out !h-8" onClick={() => api.toast("Generando el informe de tasación en PDF")}><Ic n="filedown" className="w-3.5 h-3.5" />Informe PDF</button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <Table min={820} head={<><Th>Propietario/a</Th><Th>Estado</Th><Th right>Valor de tasación</Th><Th right>Precio sugerido</Th><Th>Asignada a</Th><Th>Autorización</Th><Th>Fecha</Th></>}>
          {rows.map((r) => (
            <tr key={r.addr} className="border-b last:border-b-0 q-row">
              <Td><span className="block font-medium">{r.owner}</span><span className="text-[10.5px] q-mut">{r.addr}</span></Td>
              <Td><Tint c={TAS_C[r.status]}>{r.status}</Tint></Td>
              <Td right>{r.value}</Td><Td right>{r.suggested}</Td>
              <Td><Person name={r.who} /></Td>
              <Td>{r.auth ? <Tint c={authC(r.auth)}>{r.auth}</Tint> : <span className="q-mut">—</span>}</Td>
              <Td className="q-mut q-num">{r.date}</Td>
            </tr>
          ))}
        </Table>
      )}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════
//  PRESUPUESTOS (concesionaria)
// ════════════════════════════════════════════════════════════════════════
const PRE_C = { Borrador: "#71717a", Vigente: "#16a34a", Vencido: "#ef4444" };

export const Presupuestos = ({ D, api }) => {
  const [sel, setSel] = useState(null);
  const p = sel != null ? D.presupuestos[sel] : null;
  return (
    <div>
      <PageHeader title="Presupuestos" meta="link público con aviso cuando el cliente lo abre">
        <RefreshBtn />
        <button className="q-btn q-btn-pri"><Ic n="plus" className="w-3.5 h-3.5" />Nuevo presupuesto</button>
      </PageHeader>
      <Table min={820} head={<><Th>Cliente</Th><Th>Vehículos</Th><Th right>Total</Th><Th>Estado</Th><Th>Vendedor</Th><Th>Vistas</Th><Th>Fecha</Th></>}>
        {D.presupuestos.map((r, i) => (
          <tr key={r.num + r.client} className="border-b last:border-b-0 q-row cursor-pointer" onClick={() => setSel(i)}>
            <Td><span className="block font-medium">{r.client}</span><span className="text-[10.5px] q-mut q-num">{r.num}</span></Td>
            <Td><span className="whitespace-nowrap">{r.vehicles}</span>{r.more ? <span className="q-mut"> +{r.more}</span> : null}</Td>
            <Td right className="font-medium whitespace-nowrap">{r.total}</Td>
            <Td><Tint c={PRE_C[r.status]}>{r.status}</Tint></Td>
            <Td><Person name={r.seller} /></Td>
            <Td>{r.views ? <span className="inline-flex items-center gap-1 q-num" title={`Última vez ${r.last}`}><Ic n="eye" className="w-3.5 h-3.5 q-pri" />{r.views}<span className="q-mut text-[10.5px] hidden @[1100px]/app:inline">· {r.last}</span></span> : <span className="q-mut text-[11px]">Sin abrir</span>}</Td>
            <Td className="q-mut q-num">{r.date}</Td>
          </tr>
        ))}
      </Table>
      {p && (
        <Dialog open onClose={() => setSel(null)} width={860} title={<>Presupuesto {p.num}<Tint c={PRE_C[p.status]}>{p.status}</Tint></>} subtitle={<>{p.client} · {p.vehicles}</>}>
          <div className="px-5 pt-3 flex flex-wrap gap-2">
            <button className="q-btn q-btn-out !h-7" onClick={() => api.toast("Descargando el PDF del presupuesto")}><Ic n="filedown" className="w-3.5 h-3.5" />Descargar PDF</button>
            <button className="q-btn q-btn-out !h-7" onClick={() => api.toast("Link público copiado")}><Ic n="link" className="w-3.5 h-3.5" />Copiar link</button>
            <button className="q-btn q-btn-out !h-7"><Ic n="copy" className="w-3.5 h-3.5" />Duplicar</button>
            <button className="q-btn q-btn-out !h-7" onClick={() => api.toast(`WhatsApp a ${p.client} con el link del presupuesto`)}><span className="text-[#25D366]"><Ic n="whatsapp" className="w-3.5 h-3.5" /></span>Enviar por WhatsApp</button>
          </div>
          <div className="p-5 grid grid-cols-1 @[760px]/app:grid-cols-[1fr_260px] gap-4">
            <div className="space-y-3">
              <div className="rounded-xl border p-3.5 text-[12px] space-y-1.5">
                <div className="text-[12.5px] font-semibold mb-1">Presupuesto</div>
                <div className="flex justify-between"><span className="q-mut">Vendedor</span><Person name={p.seller} /></div>
                <div className="flex justify-between"><span className="q-mut">Emitido</span><span>{p.date}/2026</span></div>
                <div className="flex justify-between"><span className="q-mut">Válido hasta</span><span>{p.status === "Vencido" ? "17/09/2026" : "25/10/2026"}</span></div>
                <div className="flex justify-between items-center pt-1.5 border-t">
                  <span className="q-mut">Visto por el cliente</span>
                  {p.views ? <span className="font-medium flex items-center gap-1" style={{ color: "var(--q-success)" }}><Ic n="eye" className="w-3.5 h-3.5" />{p.views} visitas · Última vez {p.last}</span> : <span className="q-mut">Todavía no fue abierto</span>}
                </div>
              </div>
              <div className="rounded-xl border p-3.5 text-[12px]">
                <div className="text-[12.5px] font-semibold mb-2">Opciones de financiación</div>
                <div className="grid grid-cols-3 gap-2">
                  {[["12 cuotas", "0% TNA"], ["24 cuotas", "29,9% TNA"], ["48 cuotas", "39,9% TNA"]].map(([a, b]) => (
                    <div key={a} className="rounded-lg border p-2 text-center"><div className="font-semibold">{a}</div><div className="text-[10.5px] q-mut">{b}</div></div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-dashed p-3 text-[11.5px] q-mut flex gap-2">
                <Ic n="bell" className="w-3.5 h-3.5 mt-0.5 q-pri" />Cuando {p.client.split(" ")[0]} abre el link, te llega el aviso: «{p.client} abrió el presupuesto {p.num}».
              </div>
            </div>
            {/* Vista previa de la página pública (mobile-first) */}
            <div className="rounded-[22px] border-[6px] border-[#18181b] overflow-hidden bg-white text-[#09090b] mx-auto w-[240px] shadow-lg">
              <div className="px-3 py-2 flex items-center justify-between border-b border-[#e4e4e7] text-[10px]"><span className="font-bold">{D.tenant.name}</span><span className="text-[#71717a]">Descargar PDF</span></div>
              <div className="p-3">
                <div className="text-[9px] text-[#71717a]">Presupuesto {p.num}</div>
                <div className="text-[15px] font-bold leading-tight">Para {p.client.split(" ")[0]}</div>
                <div className="text-[9px] text-[#71717a] mt-0.5">Válido hasta 25/10/2026</div>
                <div className="mt-2 h-[92px] rounded-lg" style={{ background: "linear-gradient(135deg,#3a4a5c,#1c2530)" }} />
                <div className="text-[11px] font-semibold mt-1.5">{p.vehicles}</div>
                <div className="text-[12px] font-bold text-[#f97316]">{p.total}</div>
                <div className="mt-1.5 text-[9px] border border-[#e4e4e7] rounded px-1.5 py-1 text-center">Ver ficha técnica</div>
                <div className="mt-2 flex gap-1.5">
                  <span className="flex-1 text-center text-[9px] font-semibold text-white rounded py-1.5 bg-[#25D366]">WhatsApp</span>
                  <span className="flex-1 text-center text-[9px] font-semibold rounded py-1.5 border border-[#e4e4e7]">PDF</span>
                </div>
              </div>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════
//  PERMUTAS · LLAVES
// ════════════════════════════════════════════════════════════════════════
const PER_C = { Pendiente: "#64748b", Tasado: "#3b82f6", Aceptado: "#10b981", Rechazado: "#ef4444", Ingresado: "#8b5cf6" };

export const Permutas = ({ D }) => (
  <div>
    <PageHeader title="Permutas" meta={D.key === "auto" ? "usados que entran como parte de pago" : "propiedades que entran como parte de pago"}>
      <RefreshBtn />
    </PageHeader>
    <Table min={700} head={<><Th>Cliente</Th><Th>{D.key === "auto" ? "Vehículo" : "Propiedad"}</Th><Th right>Tasación</Th><Th>Estado</Th><Th>Tasó</Th><Th>Fecha</Th></>}>
      {D.permutas.map((r) => (
        <tr key={r.client + r.item} className="border-b last:border-b-0 q-row">
          <Td className="font-medium">{r.client}</Td>
          <Td className="q-fg2">{r.item}</Td>
          <Td right className="font-medium whitespace-nowrap">{r.value}</Td>
          <Td><Tint c={PER_C[r.status]}>{r.status}</Tint></Td>
          <Td><Person name={r.by} /></Td>
          <Td className="q-mut q-num">{r.date}</Td>
        </tr>
      ))}
    </Table>
    <div className="text-[11.5px] q-mut mt-2">Las permutas se cargan desde la oportunidad («Registrar permuta») y, una vez aceptadas, se dan de alta en el inventario con un click.</div>
  </div>
);

const KEY_C = { "En oficina": "#10b981", Prestada: "#d97706", Perdida: "#ef4444" };

export const Llaves = ({ D, api }) => {
  const [rows, setRows] = useState(D.llaves);
  const devolver = (i) => {
    setRows((r) => r.map((x, k) => (k === i ? { ...x, status: "En oficina", holder: null, overdue: false } : x)));
    api.toast(`Llave ${rows[i].code} devuelta a la oficina`);
  };
  return (
    <div>
      <PageHeader title="Llaves" meta={`${rows.filter((r) => r.status === "Prestada").length} prestadas ahora`}>
        <RefreshBtn />
        <button className="q-btn q-btn-pri"><Ic n="plus" className="w-3.5 h-3.5" />Nueva llave</button>
      </PageHeader>
      <Table min={760} head={<><Th>Llave</Th><Th>Propiedad</Th><Th>Estado</Th><Th>Quién la tiene</Th><Th>Dueño</Th><Th>Copias</Th><Th /></>}>
        {rows.map((r, i) => (
          <tr key={r.code} className="border-b last:border-b-0 q-row">
            <Td><span className="flex items-center gap-2 font-medium q-num"><span className="w-3 h-3 rounded-full border" style={{ background: r.color }} />{r.code}</span></Td>
            <Td>{r.prop}</Td>
            <Td><Tint c={KEY_C[r.status]}>{r.status}</Tint></Td>
            <Td>{r.holder ? <span><Person name={r.holder} /><span className={`block text-[10.5px] mt-0.5 ${r.overdue ? "text-[#dc2626]" : "q-mut"}`}>{r.overdue ? `Devolución esperada ${r.back}` : `desde ${r.since}`}</span></span> : <span className="q-mut">—</span>}</Td>
            <Td className="q-fg2">{r.owner}</Td>
            <Td className="q-num">{r.copies}</Td>
            <Td>{r.status === "Prestada" ? <button className="q-btn q-btn-out !h-7" onClick={() => devolver(i)}>Registrar devolución</button> : r.status === "En oficina" ? <button className="q-btn q-btn-ghost !h-7 q-mut">Registrar retiro</button> : null}</Td>
          </tr>
        ))}
      </Table>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════
//  OBJETIVOS
// ════════════════════════════════════════════════════════════════════════
export const Objetivos = ({ D }) => {
  const g = D.goals;
  const f = (v) => (g.units ? `${v} u.` : money(v, "USD"));
  const ranked = [...g.sellers].sort((a, b) => b.sold / b.goal - a.sold / a.goal);
  const done = g.sellers.filter((s) => s.sold >= s.goal).length;
  const podium = [ranked[1], ranked[0], ranked[2]];
  return (
    <div>
      <PageHeader title="Objetivos" meta={g.month}>
        <div className="q-seg"><button aria-pressed={!g.units}>Monto</button><button aria-pressed={!!g.units}>Unidades</button></div>
        <button className="q-btn q-btn-out"><Ic n="pencil" className="w-3.5 h-3.5" />Editar objetivos</button>
      </PageHeader>
      <div className="grid grid-cols-1 @[900px]/app:grid-cols-[1fr_1.2fr] gap-3 mb-3">
        <div className="q-card p-4 flex flex-col items-center q-in">
          <div className="text-[13px] font-semibold self-start">Objetivo de la empresa · {g.month.split(" ")[0]}</div>
          <div className="mt-3"><Meter pct={g.sold / g.companyGoal} label={`${Math.round((g.sold / g.companyGoal) * 100)}%`} sub={`${f(g.sold)} de ${f(g.companyGoal)}`} /></div>
          <div className="text-[12px] q-mut mt-2">Faltan <b className="q-fg">{f(g.companyGoal - g.sold)}</b> · quedan {g.daysLeft} días</div>
        </div>
        <div className="q-card p-4 grid grid-cols-2 gap-3 q-in" style={{ animationDelay: "80ms" }}>
          {[
            ["target", "En objetivo", `${done} / ${g.sellers.length}`, "cumplieron la meta"],
            ["trophy", "Mejor del mes", ranked[0].name.split(" ")[0], `${Math.round((ranked[0].sold / ranked[0].goal) * 100)}% del objetivo`],
            ["dollar", "Monto del equipo", f(g.sold), "vendido en el mes"],
            ["cal", "Avance del mes", `${g.daysDone} / 30 días`, `${Math.round((g.daysDone / 30) * 100)}% del mes transcurrido`],
          ].map(([ic, k, v, s]) => (
            <div key={k} className="rounded-xl p-3" style={{ background: "color-mix(in oklab, var(--q-muted) 55%, transparent)" }}>
              <div className="flex items-center gap-1.5 text-[11.5px] q-mut"><Ic n={ic} className="w-3.5 h-3.5" />{k}</div>
              <div className="text-[18px] font-bold q-num mt-1 truncate">{v}</div>
              <div className="text-[10.5px] q-mut">{s}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="q-card p-4 q-in" style={{ animationDelay: "140ms" }}>
        <div className="text-[13px] font-semibold mb-4">Ranking por vendedor</div>
        <div className="flex items-end justify-center gap-3 mb-5">
          {podium.map((s, i) => s && (
            <div key={s.name} className="flex flex-col items-center gap-1.5 w-[110px]">
              <Avatar name={s.name} size={i === 1 ? 40 : 32} />
              <span className="text-[11.5px] font-medium truncate max-w-full">{s.name.split(" ")[0]}</span>
              <div className="w-full rounded-t-lg grid place-items-center pt-2" style={{ height: i === 1 ? 64 : i === 0 ? 48 : 36, background: i === 1 ? "color-mix(in oklab, #f59e0b 22%, var(--q-card))" : "color-mix(in oklab, var(--q-muted) 80%, transparent)" }}>
                <span style={{ color: i === 1 ? "#d97706" : "var(--q-muted-fg)" }}><Ic n={i === 1 ? "trophy" : "medal"} className="w-4 h-4" /></span>
                <span className="text-[11px] font-semibold q-num">{Math.round((s.sold / s.goal) * 100)}%</span>
              </div>
            </div>
          ))}
        </div>
        <table className="w-full text-[12.5px]">
          <thead><tr className="q-th text-left border-b"><th className="font-medium py-2 w-14">Puesto</th><th className="font-medium py-2">Nombre</th><th className="font-medium py-2 text-right">Objetivo</th><th className="font-medium py-2 w-[40%] pl-4">Cumplimiento</th></tr></thead>
          <tbody>
            {ranked.map((s, i) => {
              const p = s.sold / s.goal;
              return (
                <tr key={s.name} className="border-b last:border-b-0">
                  <td className="py-2 q-num q-mut">{i + 1}°</td>
                  <td className="py-2"><Person name={s.name} /></td>
                  <td className="py-2 text-right q-num">{f(s.goal)}</td>
                  <td className="py-2 pl-4">
                    <span className="flex items-center gap-2">
                      <span className="flex-1 h-2 rounded-full q-bg-muted overflow-hidden"><span className="block h-full rounded-full" style={{ width: `${Math.min(100, p * 100)}%`, background: p >= 1 ? "var(--q-success)" : "var(--q-primary)", transformOrigin: "left", animation: `qGrowX .9s ${i * 0.07}s cubic-bezier(.2,.7,.2,1) both` }} /></span>
                      <span className="w-11 text-right q-num font-medium">{Math.round(p * 100)}%</span>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════
//  INTEGRACIONES
// ════════════════════════════════════════════════════════════════════════
const Logo = ({ src, bg, children }) => (
  <span className="w-9 h-9 rounded-lg grid place-items-center shrink-0" style={{ background: bg }}>
    {src ? <img src={src} alt="" className="w-5 h-5 object-contain" /> : children}
  </span>
);

const IntegCard = ({ logo, name, desc, status, oauth, accounts, cta, onConnect }) => {
  const st = {
    on: ["Conectado", "#16a34a"], off: ["No conectado", "#71717a"], unset: ["No configurado", "#71717a"],
    installed: ["Instalado", "#16a34a"],
  }[status];
  return (
    <div className="q-card q-card-hover p-4 flex flex-col">
      <div className="flex items-start gap-3">
        {logo}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[13px] font-semibold">{name}</span>
            <Tint c={st[1]}><Dot c={st[1]} />{st[0]}</Tint>
            {oauth && <Tint c="#3b82f6">OAuth</Tint>}
          </div>
          <div className="text-[11.5px] q-mut mt-1 leading-snug">{desc}</div>
        </div>
      </div>
      {accounts ? (
        <div className="mt-3 space-y-1.5">
          {accounts.map(([a, s]) => (
            <div key={a} className="flex items-center justify-between rounded-lg border px-2.5 py-1.5 text-[11.5px]">
              <span className="min-w-0"><span className="block font-medium truncate">{a}</span><span className="block text-[10.5px] q-mut truncate">{s}</span></span>
              <Ic n="settings" className="w-3.5 h-3.5 q-mut" />
            </div>
          ))}
          <button className="text-[11.5px] q-pri font-medium mt-1">+ Conectar otra cuenta</button>
        </div>
      ) : (
        <button onClick={onConnect} className="q-btn q-btn-pri mt-3 w-full">{cta || "Conectar"}</button>
      )}
    </div>
  );
};

const Section = ({ title, desc, children }) => (
  <div>
    <div className="text-[13.5px] font-semibold">{title}</div>
    <div className="text-[11.5px] q-mut mb-2.5">{desc}</div>
    <div className="grid grid-cols-1 @[700px]/app:grid-cols-2 gap-3">{children}</div>
  </div>
);

export const Integraciones = ({ D, api }) => {
  const [gads, setGads] = useState(false);
  const [gcal, setGcal] = useState(false);
  return (
    <div className="space-y-5">
      <PageHeader title="Integraciones" meta={`${D.integ.connected + (gads ? 1 : 0) + (gcal ? 1 : 0)} de ${D.integ.total} conectadas`} />
      <Section title="Plataformas publicitarias" desc="Conectá tus cuentas para rastrear el origen y gasto de tus leads.">
        <IntegCard logo={<Logo src={metaLogo} bg="color-mix(in oklab, #3b82f6 10%, transparent)" />} name="Meta Ads" oauth status="on" desc="Facebook e Instagram, campañas y gasto publicitario." accounts={[[`Publicidad ${D.tenant.name.split(" ")[1]}`, "ID: 345810498 · sincronizado hace 40 min"]]} />
        <IntegCard logo={<Logo src={googleAdsLogo} bg="color-mix(in oklab, #ef4444 10%, transparent)" />} name="Google Ads" oauth status={gads ? "on" : "off"} desc="Búsqueda, Display y YouTube, campañas y gasto publicitario." accounts={gads ? [["Cuenta de Google Ads", "ID: 812-440-1937 · recién conectada"]] : null} onConnect={() => { setGads(true); api.toast("Google Ads conectado. La inversión se sincroniza todos los días."); }} />
      </Section>
      <Section title="Portales" desc="Recibí las consultas de tus publicaciones directo en el CRM.">
        <IntegCard logo={<Logo src={mlLogo} bg="color-mix(in oklab, #eab308 16%, transparent)" />} name="Mercado Libre" status="on" desc="Las consultas de tus publicaciones entran solas al CRM, con nombre y teléfono." accounts={[[D.integ.ml, "1 cuenta conectada · Última sincronización hace 12 min"]]} />
      </Section>
      {D.integ.tokko && (
        <Section title="Integraciones de terceros" desc="Conectá servicios externos para sincronizar datos.">
          <IntegCard logo={<Logo src={tokkoLogo} bg="color-mix(in oklab, #f97316 14%, transparent)" />} name="Tokko Broker" status="on" desc="Sincroniza tus propiedades desde Tokko Broker." accounts={[["Clave API configurada", "Última sincronización hace 2 h"]]} />
        </Section>
      )}
      <Section title="Rastreo web" desc="Instalá un script en tu sitio para capturar leads de tus formularios.">
        <IntegCard logo={<Logo bg="color-mix(in oklab, #8b5cf6 14%, transparent)"><span className="text-[#8b5cf6]"><Ic n="code" /></span></Logo>} name="Rastreo del sitio web" status="installed" desc="Capturá leads desde los formularios de tu sitio web, con la campaña de la que vinieron." accounts={[["www." + D.tenant.name.toLowerCase().replace(" ", "") + ".com.ar", "Último lead: hace 3 h · Última actividad: hace 4 min"]]} />
      </Section>
      <Section title="Mi agenda" desc="Conexiones personales de cada usuario, no del equipo.">
        <IntegCard logo={<Logo src={googleCalLogo} bg="color-mix(in oklab, #3b82f6 8%, transparent)" />} name="Google Calendar" status={gcal ? "on" : "off"} desc="Espejá tus tareas planificadas en tu agenda de Google, en las dos direcciones." accounts={gcal ? [[D.user.email, "Sincronizando tareas planificadas"]] : null} onConnect={() => { setGcal(true); api.toast("Google Calendar conectado. Tus tareas ya aparecen en tu agenda."); }} />
      </Section>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════
//  ACTUALIZACIONES
// ════════════════════════════════════════════════════════════════════════
export const Updates = () => (
  <div>
    <PageHeader title="Actualizaciones" meta="lo que salió en las últimas semanas" />
    <div className="q-card !rounded-xl overflow-hidden">
      {UPDATES.map((u, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3 border-b last:border-b-0 q-in" style={{ animationDelay: `${i * 35}ms`, background: u.unread ? "color-mix(in oklab, var(--q-primary) 5%, transparent)" : undefined }}>
          <span className="w-9 h-9 rounded-full q-bg-muted grid place-items-center shrink-0"><Ic n="rocket" className="w-4 h-4 q-fg2" /></span>
          <div className="min-w-0 flex-1">
            <div className="text-[12.5px] font-medium">{u.title}</div>
            <div className="text-[11px] q-mut q-num">{u.date}</div>
          </div>
          {u.unread && <span className="w-2 h-2 rounded-full shrink-0" style={{ background: "var(--q-primary)" }} />}
        </div>
      ))}
    </div>
  </div>
);
