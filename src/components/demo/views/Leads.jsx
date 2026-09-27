import { useMemo, useState } from "react";
import { Ic, Avatar, Dialog, PageHeader, RefreshBtn, SearchBox, FilterChip, MlDot, WaBtn, Tint, Empty } from "../ui.jsx";
import { SrcBadge, LeadStatus, TempChip, SlaBadge, StageBadge, StagnantBadge, AssetThumb } from "../domain.jsx";
import { LEAD_STATUS, TEMPS, STAGE_META, TASK_TYPES, SOURCE_COLORS } from "../data.js";

// ── Tabla de Leads ───────────────────────────────────────────────────────
export const Leads = ({ D, S, api }) => {
  const [q, setQ] = useState("");
  const [fStatus, setFStatus] = useState(null);
  const [fTemp, setFTemp] = useState(null);
  const [fOwner, setFOwner] = useState(null);
  const [sel, setSel] = useState(new Set());
  const [creating, setCreating] = useState(false);

  const rows = useMemo(() => S.leads.filter((l) => {
    if (q && !`${l.name} ${l.email} ${l.phone}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (fStatus && LEAD_STATUS[l.status].label !== fStatus) return false;
    if (fTemp && TEMPS[l.temp].label !== fTemp) return false;
    if (fOwner && l.owner !== fOwner) return false;
    return true;
  }), [S.leads, q, fStatus, fTemp, fOwner]);

  const toggle = (id) => setSel((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const allOn = rows.length > 0 && rows.every((r) => sel.has(r.id));
  const waiting = S.leads.filter((l) => l.status === "NEW").length;

  return (
    <div>
      <PageHeader title="Leads" meta={`${S.leads.length} en el período · ${waiting} sin contactar`}>
        <button className="q-btn q-btn-ghost q-btn-icon" title="Configurar tiempo hasta el primer contacto" aria-label="Configurar tiempo hasta el primer contacto"><Ic n="timer" className="w-3.5 h-3.5" /></button>
        <RefreshBtn />
        <button className="q-btn q-btn-out hidden @[640px]/app:inline-flex"><Ic n="download" className="w-3.5 h-3.5 rotate-180" />Importar CSV</button>
        <button className="q-btn q-btn-pri" onClick={() => setCreating(true)}><Ic n="plus" className="w-3.5 h-3.5" />Nuevo Lead</button>
      </PageHeader>

      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <SearchBox value={q} onChange={setQ} placeholder="Buscar leads..." className="w-full @[640px]/app:w-56" />
        <FilterChip label="Estado" value={fStatus} options={Object.values(LEAD_STATUS).map((s) => s.label)} onChange={setFStatus} />
        <FilterChip label="Temperatura" value={fTemp} options={["Caliente", "Medio", "Frío"]} onChange={setFTemp} />
        <FilterChip label="Responsable" value={fOwner} options={D.agents} onChange={setFOwner} />
        <span className="hidden @[1000px]/app:inline-flex q-btn q-btn-out !font-normal ml-auto"><Ic n="cal" className="w-3.5 h-3.5 q-mut" />Últimos 30 días</span>
      </div>

      <div className="q-card overflow-hidden !rounded-xl">
        <div className="overflow-x-auto q-scroll">
          <table className="w-full text-[12.5px]">
            <thead>
              <tr className="q-th text-left border-b q-bg-muted/40">
                <th className="w-9 py-2.5 pl-3"><input type="checkbox" checked={allOn} onChange={() => setSel(allOn ? new Set() : new Set(rows.map((r) => r.id)))} aria-label="Seleccionar todo" className="accent-[var(--q-primary)]" /></th>
                <th className="py-2.5 px-2 font-medium">Nombre Completo</th>
                <th className="py-2.5 px-2 font-medium hidden @[1100px]/app:table-cell">Email</th>
                <th className="py-2.5 px-2 font-medium hidden @[760px]/app:table-cell">Teléfono</th>
                <th className="py-2.5 px-2 font-medium">Fuente</th>
                <th className="py-2.5 px-2 font-medium">Estado</th>
                <th className="py-2.5 px-2 font-medium hidden @[640px]/app:table-cell">Temperatura</th>
                <th className="py-2.5 px-2 font-medium hidden @[960px]/app:table-cell">Asignado</th>
                <th className="py-2.5 px-2 font-medium">Primer contacto</th>
                <th className="py-2.5 px-2 pr-3 font-medium text-right hidden @[1200px]/app:table-cell">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((l, i) => (
                <tr
                  key={l.id}
                  onClick={() => api.openLead(l.id)}
                  className={`border-b last:border-b-0 q-row cursor-pointer ${l.fresh ? "q-flash" : ""}`}
                  style={{ animation: `qIn .35s ${i * 30}ms both`, background: sel.has(l.id) ? "color-mix(in oklab, var(--q-primary) 6%, transparent)" : undefined }}
                >
                  <td className="py-2.5 pl-3" onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" checked={sel.has(l.id)} onChange={() => toggle(l.id)} aria-label={`Seleccionar ${l.name}`} className="accent-[var(--q-primary)]" />
                  </td>
                  <td className="py-2.5 px-2">
                    <span className="flex items-center gap-1.5 font-medium whitespace-nowrap">
                      {l.name}
                      {l.mlPending && <MlDot />}
                      {l.fresh && <Tint c="#f97316" className="!text-[9.5px] !py-0">Nuevo</Tint>}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 q-mut hidden @[1100px]/app:table-cell">{l.email}</td>
                  <td className="py-2.5 px-2 hidden @[760px]/app:table-cell">
                    <span className="flex items-center gap-1 whitespace-nowrap q-num">{l.phone}<WaBtn onClick={() => api.whatsapp(l.id)} /></span>
                  </td>
                  <td className="py-2.5 px-2"><SrcBadge src={l.src} /></td>
                  <td className="py-2.5 px-2"><LeadStatus s={l.status} /></td>
                  <td className="py-2.5 px-2 hidden @[640px]/app:table-cell"><TempChip t={l.temp} /></td>
                  <td className="py-2.5 px-2 hidden @[960px]/app:table-cell"><span className="flex items-center gap-1.5 whitespace-nowrap"><Avatar name={l.owner} size={20} />{l.owner}</span></td>
                  <td className="py-2.5 px-2"><SlaBadge sla={l.sla} contacted={l.status !== "NEW"} /></td>
                  <td className="py-2.5 px-2 pr-3 text-right q-mut q-num hidden @[1200px]/app:table-cell">{l.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && <Empty text="No hay leads con esos filtros" />}
        </div>
        <div className="flex items-center justify-between px-3 py-2 border-t text-[11.5px] q-mut">
          <span>{rows.length} de {S.leads.length} leads</span>
          <span className="flex items-center gap-2">Filas por página <span className="q-btn q-btn-out !h-6 !px-2 !text-[11px]">20</span></span>
        </div>
      </div>

      {sel.size > 0 && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-5 z-30 q-bg-pop border rounded-xl px-3 py-2 flex items-center gap-2 q-pop text-[12px]" style={{ boxShadow: "var(--q-shadow-lg)" }}>
          <span className="font-medium whitespace-nowrap">{sel.size} seleccionado{sel.size > 1 ? "s" : ""}</span>
          <span className="w-px h-5 q-bg-muted" />
          <button className="q-btn q-btn-ghost !h-7" disabled={sel.size < 2} style={{ opacity: sel.size < 2 ? 0.5 : 1 }} title={sel.size < 2 ? "Seleccioná al menos 2 leads para fusionar" : undefined} onClick={() => api.toast("En tu cuenta se abre la comparación para fusionar")}><Ic n="swap" className="w-3.5 h-3.5" />Fusionar</button>
          <button className="q-btn q-btn-ghost !h-7" onClick={() => api.toast(`Exportando ${sel.size} leads a CSV`)}><Ic n="download" className="w-3.5 h-3.5" />Exportar CSV</button>
          <button className="q-btn q-btn-ghost q-btn-icon !h-7 !w-7" title="Deseleccionar todo" onClick={() => setSel(new Set())}><Ic n="x" className="w-3.5 h-3.5" /></button>
        </div>
      )}

      <NewLeadDialog open={creating} onClose={() => setCreating(false)} D={D} onCreate={(l) => { setCreating(false); api.addLead(l); }} />
    </div>
  );
};

// ── Alta de lead ─────────────────────────────────────────────────────────
const NewLeadDialog = ({ open, onClose, D, onCreate }) => {
  const [f, setF] = useState({ name: "", phone: "", src: "WhatsApp", owner: D.agents[0] });
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));
  const ok = f.name.trim().length > 2;
  const sources = Object.keys(SOURCE_COLORS).filter((s) => D.key === "inmo" || !["Tokko Broker", "Argenprop", "Zonaprop"].includes(s));
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Nuevo Lead"
      subtitle="El reparto lo asigna solo si no elegís responsable"
      width={460}
      footer={<>
        <button className="q-btn q-btn-out" onClick={onClose}>Cancelar</button>
        <button className="q-btn q-btn-pri" disabled={!ok} style={{ opacity: ok ? 1 : 0.5 }} onClick={() => onCreate({ ...f, name: f.name.trim(), phone: f.phone || "+54 223 555-0000" })}>Crear lead</button>
      </>}
    >
      <div className="p-5 grid gap-3 text-[12px]">
        <label className="grid gap-1"><span className="font-medium">Nombre completo</span><input className="q-input" autoFocus value={f.name} onChange={set("name")} placeholder="Ej. Julián Pereyra" /></label>
        <label className="grid gap-1"><span className="font-medium">Teléfono</span><input className="q-input" value={f.phone} onChange={set("phone")} placeholder="+54 223 ..." /></label>
        <div className="grid grid-cols-2 gap-3">
          <label className="grid gap-1"><span className="font-medium">Fuente</span>
            <select className="q-input" value={f.src} onChange={set("src")}>{sources.map((s) => <option key={s}>{s}</option>)}</select>
          </label>
          <label className="grid gap-1"><span className="font-medium">Responsable</span>
            <select className="q-input" value={f.owner} onChange={set("owner")}>{D.agents.map((s) => <option key={s}>{s}</option>)}</select>
          </label>
        </div>
      </div>
    </Dialog>
  );
};

// ── Ficha del lead: diálogo grande de 3 columnas ─────────────────────────
const Row = ({ icon, label, children }) => (
  <div className="flex items-start gap-2.5 py-1.5 text-[12px]">
    <Ic n={icon} className="w-3.5 h-3.5 q-mut mt-0.5" />
    <span className="q-mut w-[92px] shrink-0">{label}</span>
    <span className="min-w-0 flex-1 break-words">{children}</span>
  </div>
);

const Card = ({ title, action, children }) => (
  <div className="rounded-xl border q-bg-card p-3.5">
    <div className="flex items-center justify-between mb-1.5">
      <span className="text-[12.5px] font-semibold">{title}</span>
      {action}
    </div>
    {children}
  </div>
);

const EV = {
  inbox: { c: "#f97316" }, message: { c: "#14b8a6" }, handshake: { c: "#8b5cf6" },
  arrowright: { c: "#3b82f6" }, listplus: { c: "#d97706" }, circlecheck: { c: "#16a34a" }, at: { c: "#71717a" },
};

export const LeadDetail = ({ D, S, api, id, onClose }) => {
  const l = S.leads.find((x) => x.id === id);
  const [comment, setComment] = useState("");
  if (!l) return null;
  const opps = S.opps.filter((o) => o.lead === l.id);
  const asset = D.assets.find((a) => a.id === l.asset);
  const tasks = S.tasks.filter((t) => t.client === l.name);
  const contacted = l.status !== "NEW";

  const events = [
    { icon: "inbox", text: <>Consulta desde <b>{l.src}</b>{l.campaign ? <> · campaña «{l.campaign}»</> : null}</>, when: l.date.slice(0, 5) },
    ...(contacted ? [{ icon: "message", text: "Primer contacto con el cliente", when: l.date.slice(0, 5) }] : []),
    ...opps.flatMap((o) => {
      const e = [{ icon: "handshake", text: <>Se abrió una oportunidad en <b>Interesado</b></>, when: o.created }];
      if (o.stage !== "INTERESTED") e.push({ icon: "arrowright", text: <>Etapa: Interesado → <b>{STAGE_META[o.stage].label}</b></>, when: o.moved || o.created });
      return e;
    }),
    ...tasks.map((t) => ({ icon: t.status === "COMPLETED" ? "circlecheck" : "listplus", text: <>{t.status === "COMPLETED" ? "Se completó" : "Se creó"} la tarea «{t.title}»</>, when: `${t.day}/09` })),
    ...(l.comments || []).map((c) => ({ icon: "at", text: <><b>{D.user.name}</b>: {c}</>, when: "recién" })),
  ];

  return (
    <Dialog
      open
      onClose={onClose}
      width={980}
      title={<>{l.name}<LeadStatus s={l.status} /><TempChip t={l.temp} /><StagnantBadge days={opps[0]?.days ?? 0} /></>}
      subtitle={<><SrcBadge src={l.src} small /> <span>· ingresó el {l.date}</span></>}
    >
      <div className="px-5 pt-3 flex flex-wrap gap-2">
        <button className="q-btn q-btn-out !h-7" onClick={() => api.toast("Link de la ficha copiado")}><Ic n="link" className="w-3.5 h-3.5" />Compartir</button>
        {opps.length === 0 && <button className="q-btn q-btn-out !h-7" style={{ color: "var(--q-success)", borderColor: "color-mix(in oklab, var(--q-success) 40%, var(--q-border))" }} onClick={() => api.createOpp(l.id)}><Ic n="handshake" className="w-3.5 h-3.5" />Crear oportunidad</button>}
        <button className="q-btn q-btn-out !h-7" onClick={() => api.whatsapp(l.id)}><span className="text-[#25D366]"><Ic n="whatsapp" className="w-3.5 h-3.5" /></span>WhatsApp</button>
        <button className="q-btn q-btn-out !h-7"><Ic n="pencil" className="w-3.5 h-3.5" />Editar</button>
      </div>
      <div className="p-5 pt-3 grid grid-cols-1 @[820px]/app:grid-cols-[1fr_1.25fr_0.95fr] gap-3">
        <div className="space-y-3 min-w-0">
          <Card title="Datos">
            <Row icon="mail" label="Email">{l.email}</Row>
            <Row icon="phone" label="Teléfono"><span className="inline-flex items-center gap-1 q-num">{l.phone}<WaBtn onClick={() => api.whatsapp(l.id)} /></span></Row>
            <Row icon="radio" label="Fuente"><SrcBadge src={l.src} /></Row>
            {l.campaign && <Row icon="megaphone" label="Campaña">{l.campaign}</Row>}
            <Row icon="user" label="Responsable"><span className="inline-flex items-center gap-1.5"><Avatar name={l.owner} size={18} />{l.owner}</span></Row>
            <Row icon="timer" label="1er contacto">{contacted ? <SlaBadge sla={{ ...l.sla, live: false }} contacted /> : <SlaBadge sla={l.sla} />}</Row>
            <Row icon="cal" label="Creado">{l.date}</Row>
          </Card>
          <Card title="Oportunidades">
            {opps.length === 0 ? <div className="text-[12px] q-mut py-2">Sin oportunidades todavía</div> : opps.map((o) => {
              const a = D.assets.find((x) => x.id === o.asset);
              return (
                <button key={o.id} onClick={() => { onClose(); api.go("pipeline"); }} className="w-full flex items-center gap-2.5 p-2 -mx-1 rounded-lg hover:bg-[var(--q-muted)] text-left">
                  <AssetThumb a={a} className="w-10 h-8 rounded-md shrink-0" icon={D.asset.icon} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[12px] font-medium truncate">{a.short}</span>
                    <StageBadge stage={o.stage} small />
                  </span>
                </button>
              );
            })}
          </Card>
        </div>

        <Card title="Actividad">
          <div className="relative mt-2">
            <span className="absolute left-3 top-2 bottom-2 w-px q-bg-muted" />
            <div className="space-y-3">
              {events.map((e, i) => (
                <div key={i} className="relative flex items-start gap-2.5 q-in" style={{ animationDelay: `${i * 50}ms` }}>
                  <span className="relative w-6 h-6 rounded-full grid place-items-center shrink-0 q-tint" style={{ "--c": EV[e.icon].c }}><Ic n={e.icon} className="w-3 h-3" /></span>
                  <span className="text-[12px] leading-snug pt-1 flex-1 min-w-0">{e.text}</span>
                  <span className="text-[10.5px] q-mut pt-1 q-num shrink-0">{e.when}</span>
                </div>
              ))}
            </div>
          </div>
          <form
            className="mt-4 flex items-center gap-2"
            onSubmit={(e) => { e.preventDefault(); if (!comment.trim()) return; api.updateLead(l.id, { comments: [...(l.comments || []), comment.trim()] }); setComment(""); }}
          >
            <input className="q-input flex-1" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Escribí un comentario… usá @ para mencionar" />
            <button className="q-btn q-btn-pri q-btn-icon" aria-label="Enviar comentario"><Ic n="send" className="w-3.5 h-3.5" /></button>
          </form>
        </Card>

        <div className="space-y-3 min-w-0">
          <Card title="Tareas" action={<button className="q-btn q-btn-ghost !h-6 !px-1.5 !text-[11px]" onClick={() => api.addTask({ title: `Recontactar a ${l.name}`, client: l.name, type: "CALL", prio: "MEDIUM", day: 28, time: "10:00", owner: l.owner })}><Ic n="plus" className="w-3 h-3" />Nueva</button>}>
            {tasks.length === 0 ? <div className="text-[12px] q-mut py-2">Sin tareas todavía</div> : tasks.map((t) => (
              <label key={t.id} className="flex items-start gap-2 py-1.5 text-[12px] cursor-pointer">
                <input type="checkbox" checked={t.status === "COMPLETED"} onChange={() => api.toggleTask(t.id)} className="mt-0.5 accent-[var(--q-success)]" aria-label="Marcar como completada" />
                <span className="min-w-0">
                  <span className={`block ${t.status === "COMPLETED" ? "line-through q-mut" : ""}`}>{t.title}</span>
                  <span className="flex items-center gap-1 text-[10.5px] q-mut"><Ic n={TASK_TYPES[t.type].icon} className="w-3 h-3" />{TASK_TYPES[t.type].label} · {t.day}/09 {t.time}</span>
                </span>
              </label>
            ))}
          </Card>
          <Card title="Resumen">
            <div className="grid grid-cols-2 gap-2 mt-1">
              {[
                [events.length, "interacciones"],
                [opps[0] ? Math.max(1, 25 - parseInt(opps[0].created)) : 0, "días en pipeline"],
                [tasks.filter((t) => t.status !== "COMPLETED").length, "tareas abiertas"],
                [tasks.find((t) => t.status !== "COMPLETED") ? `${tasks.find((t) => t.status !== "COMPLETED").day}/09` : "—", "próximo paso"],
              ].map(([v, k]) => (
                <div key={k} className="rounded-lg q-bg-muted/60 px-2.5 py-2" style={{ background: "color-mix(in oklab, var(--q-muted) 60%, transparent)" }}>
                  <div className="text-[16px] font-bold q-num leading-none">{v}</div>
                  <div className="text-[10.5px] q-mut mt-1">{k}</div>
                </div>
              ))}
            </div>
          </Card>
          {asset && (
            <Card title={`${D.asset.singular} de interés`}>
              <div className="flex items-center gap-2.5">
                <AssetThumb a={asset} className="w-14 h-10 rounded-md shrink-0" icon={D.asset.icon} />
                <span className="min-w-0 text-[12px]">
                  <span className="block font-medium truncate">{asset.title}</span>
                  <span className="q-mut q-num">{asset.cur === "USD" ? "US$ " : "$ "}{asset.price.toLocaleString("es-AR")}{asset.per || ""}</span>
                </span>
              </div>
            </Card>
          )}
        </div>
      </div>
    </Dialog>
  );
};
