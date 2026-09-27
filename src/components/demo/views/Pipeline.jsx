import { useState } from "react";
import { Ic, Avatar, Dialog, PageHeader, RefreshBtn, SearchBox, FilterChip, MlDot, WaBtn, Switch, money } from "../ui.jsx";
import { SrcBadge, StageBadge, TempChip, SlaBadge, StagnantBadge, AssetThumb } from "../domain.jsx";
import { STAGE_META, TEMPS, LOST_REASONS, TASK_TYPES } from "../data.js";

// Tinte de la card por temperatura (feat 25/09: "las cards se tiñen con la temperatura")
const tempTint = (t) => (t === "hot" ? "#ef4444" : t === "mid" ? "#f59e0b" : t === "cold" ? "#0ea5e9" : null);

const OppCard = ({ o, D, S, api, onDragStart, onMoveMenu, isTerminal }) => {
  const l = S.leads.find((x) => x.id === o.lead);
  const a = D.assets.find((x) => x.id === o.asset);
  const tint = tempTint(l.temp);
  const [menu, setMenu] = useState(false);
  const cur = a?.cur || "USD";
  return (
    <div
      draggable
      onDragStart={(e) => { e.dataTransfer.setData("text/plain", o.id); e.dataTransfer.effectAllowed = "move"; onDragStart(o.id); }}
      onDragEnd={() => onDragStart(null)}
      onClick={() => api.openLead(l.id)}
      className={`relative rounded-xl border p-3 cursor-grab active:cursor-grabbing transition-[transform,box-shadow,border-color] hover:-translate-y-0.5 group ${o.fresh ? "q-flash" : ""}`}
      style={{
        background: tint ? `color-mix(in oklab, ${tint} 5%, var(--q-card))` : "var(--q-card)",
        borderColor: tint ? `color-mix(in oklab, ${tint} 28%, var(--q-border))` : undefined,
        boxShadow: "0 1px 2px rgba(0,0,0,.05)",
        opacity: isTerminal && o.stage === "LOST" ? 0.85 : 1,
      }}
    >
      <div className="flex items-center gap-1 min-w-0">
        <span className="text-[12.5px] font-semibold truncate">{l.name}</span>
        {l.mlPending && <MlDot />}
        <WaBtn size={20} onClick={() => api.whatsapp(l.id)} />
        <span className="ml-auto"><SrcBadge src={l.src} small /></span>
      </div>

      {o.price && (
        <div className="mt-1.5">
          <div className="text-[13px] font-semibold q-num">{money(o.price, cur)}</div>
          {o.deposit && <div className="text-[11px] q-mut q-num">Seña: {money(o.deposit, cur)}</div>}
        </div>
      )}
      {o.lost && <div className="mt-1.5 text-[11px] q-mut flex items-center gap-1"><Ic n="circlex" className="w-3 h-3" />{o.lost}</div>}

      {a && (
        <div className="mt-2 pt-2 border-t flex items-center gap-2 min-w-0">
          <AssetThumb a={a} className="w-8 h-6 rounded shrink-0" icon={D.asset.icon} />
          <span className="text-[11.5px] q-fg2 truncate">{a.short}</span>
        </div>
      )}
      {o.visit && (
        <div className="mt-1.5 text-[11px] flex items-center gap-1 q-tint rounded-md px-1.5 py-0.5 w-fit" style={{ "--c": "#0ea5e9" }}>
          <Ic n="calcheck" className="w-3 h-3" />{o.visit}
        </div>
      )}

      <div className="mt-2 flex items-center gap-1.5 text-[10.5px] q-mut">
        <Ic n="cal" className="w-3 h-3" />{o.created}
        {o.docs ? <span className="inline-flex items-center gap-0.5 ml-1"><Ic n="file" className="w-3 h-3" />{o.docs}</span> : null}
        <span className="ml-auto flex items-center gap-1">
          {o.stage === "INTERESTED" && <SlaBadge sla={l.sla} contacted={o.contacted || l.status !== "NEW"} />}
          {!isTerminal && <StagnantBadge days={o.days} />}
          <TempChip t={l.temp} compact />
          {o.stage === "INTERESTED" && (
            <button
              onClick={(e) => { e.stopPropagation(); api.markContacted(l.id, o.id); }}
              title="Marcar como contactado"
              className="rounded-full"
              style={{ color: o.contacted || l.status !== "NEW" ? "var(--q-success)" : "var(--q-muted-fg)" }}
            >
              <Ic n="circlecheck" className="w-3.5 h-3.5" />
            </button>
          )}
        </span>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[10.5px] q-mut"><Avatar name={l.owner} size={18} />{l.owner.split(" ")[0]}</span>
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => setMenu((m) => !m)} className="q-btn q-btn-ghost !h-6 !px-1.5 !text-[10.5px] opacity-100 @[900px]/app:opacity-0 group-hover:opacity-100" title="Mover a otra etapa">
            <Ic n="swap" className="w-3 h-3" />Mover
          </button>
          {menu && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setMenu(false)} />
              <div className="absolute right-0 bottom-7 z-40 w-52 q-bg-pop border rounded-xl p-1 q-pop" style={{ boxShadow: "var(--q-shadow-lg)" }}>
                {D.stages.filter((s) => s !== o.stage).map((s) => (
                  <button key={s} onClick={() => { setMenu(false); onMoveMenu(o.id, s); }} className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-[12px] hover:bg-[var(--q-muted)] text-left">
                    <span style={{ color: STAGE_META[s].c }}><Ic n={STAGE_META[s].icon} className="w-3.5 h-3.5" /></span>{STAGE_META[s].label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Diálogo "Cambiar etapa" / "Concretar venta" ──────────────────────────
const nextTaskTitle = (to, name) => ({
  INTERESTED: `Recontactar a ${name}`,
  IN_FOLLOW_UP: `Seguimiento a ${name}`,
  VISITED: `Pedir devolución de la visita a ${name}`,
  TEST_DRIVE_COMPLETED: `Pedir devolución del test drive a ${name}`,
  OFFER_MADE: `Responder la oferta de ${name}`,
  RESERVED: `Seguimiento de reserva con ${name}`,
  CLOSING: `Coordinar el cierre con ${name}`,
}[to] || `Recontactar a ${name}`);

const WDAY = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const visitLabel = (v) => {
  const [y, m, d] = v.slice(0, 10).split("-").map(Number);
  return `${WDAY[new Date(y, m - 1, d).getDay()]} ${String(d).padStart(2, "0")}/${String(m).padStart(2, "0")} · ${v.slice(11, 16)}`;
};

const StageDialog = ({ move, D, S, onCancel, onConfirm }) => {
  const o = S.opps.find((x) => x.id === move.id);
  const l = S.leads.find((x) => x.id === o.lead);
  const a = D.assets.find((x) => x.id === o.asset);
  const to = move.to;
  const isSale = to === "SALE_COMPLETED";
  const isLost = to === "LOST";
  const isVisit = to === "VISIT_SCHEDULED" || to === "TEST_DRIVE_SCHEDULED";
  const needsPrice = ["OFFER_MADE", "RESERVED", "CLOSING", "SALE_COMPLETED"].includes(to);
  const [price, setPrice] = useState(o.price || a?.price || 0);
  const [deposit, setDeposit] = useState(o.deposit || "");
  const [reason, setReason] = useState(LOST_REASONS[0]);
  const [note, setNote] = useState("");
  const [when, setWhen] = useState("2026-09-26T11:00");
  const [task, setTask] = useState(!isSale && !isLost && !isVisit);
  const [taskTitle, setTaskTitle] = useState(nextTaskTitle(to, l.name));
  const [taskType, setTaskType] = useState(to === "CLOSING" ? "MEETING" : "CALL");
  const [taskDay, setTaskDay] = useState("2026-09-26");
  const cur = a?.cur || "USD";

  return (
    <Dialog
      open
      onClose={onCancel}
      width={isSale ? 720 : 560}
      title={isSale ? <>Concretar venta · {l.name}</> : l.name}
      subtitle={<><StageBadge stage={move.from} small /><Ic n="arrowright" className="w-3 h-3" /><StageBadge stage={to} small />{a && <span className="q-mut">· {a.short}</span>}</>}
      footer={<>
        <button className="q-btn q-btn-out" onClick={onCancel}>Cancelar</button>
        <button
          className="q-btn q-btn-pri"
          style={isSale ? { background: "var(--q-success)" } : undefined}
          onClick={() => onConfirm({
            price: needsPrice ? Number(price) : undefined,
            deposit: to === "RESERVED" && deposit ? Number(deposit) : undefined,
            lost: isLost ? reason : undefined,
            visit: isVisit ? visitLabel(when) : undefined,
            visitDay: isVisit ? Number(when.slice(8, 10)) : undefined,
            visitTime: isVisit ? when.slice(11, 16) : undefined,
            task: task && !isVisit ? { title: taskTitle, type: taskType, day: Number(taskDay.slice(8, 10)), time: "10:00" } : null,
          })}
        >
          {isSale ? <><Ic n="checkbig" className="w-3.5 h-3.5" />Concretar venta</> : "Confirmar cambio"}
        </button>
      </>}
    >
      <div className="p-5 grid gap-4 text-[12px]">
        {isSale && a && (
          <div className="flex items-center gap-3 p-3 rounded-xl border">
            <AssetThumb a={a} className="w-20 h-14 rounded-lg shrink-0" icon={D.asset.icon} />
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-[13px] truncate">{a.title}</div>
              <div className="q-mut">Precio de lista {money(a.price, cur)}{a.per || ""}</div>
            </div>
            <div className="text-right">
              <div className="text-[11px] q-mut">Descuento</div>
              <div className="font-semibold q-num">{a.price ? `${((1 - price / a.price) * 100).toLocaleString("es-AR", { maximumFractionDigits: 1 })}%` : "—"}</div>
            </div>
          </div>
        )}

        {isVisit && (
          <div className="grid gap-2">
            <label className="grid gap-1"><span className="font-medium">{to === "VISIT_SCHEDULED" ? "Fecha de la visita" : "Fecha del test drive"}</span>
              <input type="datetime-local" className="q-input" value={when} onChange={(e) => setWhen(e.target.value)} />
            </label>
            <div className="rounded-xl border border-dashed p-3 flex items-start gap-2.5">
              <span className="rounded-lg p-1.5 q-tint" style={{ "--c": "#0ea5e9" }}><Ic n="users" className="w-3.5 h-3.5" /></span>
              <div>
                <div className="font-medium">Se agenda una tarea de Reunión automática</div>
                <div className="q-mut">{to === "VISIT_SCHEDULED" ? "Se agenda una por propiedad, en su fecha." : "Se agenda una por vehículo, en su fecha."} La ves en Tareas y en tu Google Calendar.</div>
              </div>
            </div>
          </div>
        )}

        {needsPrice && (
          <div className="grid grid-cols-2 gap-3">
            <label className="grid gap-1"><span className="font-medium">{isSale ? "Precio final" : "Precio ofertado"}{to === "CLOSING" && " *"}</span>
              <input type="number" className="q-input q-num" value={price} onChange={(e) => setPrice(e.target.value)} />
            </label>
            {to === "RESERVED" && (
              <label className="grid gap-1"><span className="font-medium">Seña (opcional)</span>
                <input type="number" className="q-input q-num" value={deposit} onChange={(e) => setDeposit(e.target.value)} placeholder="0" />
              </label>
            )}
            {isSale && (
              <div className="grid gap-1"><span className="font-medium">Se registra en</span><span className="q-input flex items-center gap-1.5 q-mut"><Ic n="handshake" className="w-3.5 h-3.5" />Ventas, con reparto de comisiones</span></div>
            )}
          </div>
        )}

        {isLost && (
          <label className="grid gap-1"><span className="font-medium">Motivo de pérdida</span>
            <select className="q-input" value={reason} onChange={(e) => setReason(e.target.value)}>{LOST_REASONS.map((r) => <option key={r}>{r}</option>)}</select>
          </label>
        )}

        <label className="grid gap-1"><span className="font-medium">{isLost ? "Comentario adicional (opcional)" : "Motivo del cambio (opcional)"}</span>
          <textarea className="q-input !h-16 py-2 resize-none" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Agregar un motivo... usá @ para mencionar" />
        </label>

        {!isSale && !isLost && !isVisit && (
          <div className="rounded-xl border p-3 grid gap-3">
            <div className="flex items-center gap-2.5">
              <Switch on={task} onChange={setTask} label="Próxima tarea" />
              <div>
                <div className="font-medium">Próxima tarea</div>
                <div className="q-mut text-[11px]">La anterior se cierra sola al cambiar de etapa.</div>
              </div>
            </div>
            {task && (
              <div className="grid grid-cols-1 @[560px]/app:grid-cols-[1.6fr_1fr_1fr] gap-2 q-fade">
                <label className="grid gap-1"><span className="q-mut">Título</span><input className="q-input" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} /></label>
                <label className="grid gap-1"><span className="q-mut">Tipo</span>
                  <select className="q-input" value={taskType} onChange={(e) => setTaskType(e.target.value)}>{Object.entries(TASK_TYPES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select>
                </label>
                <label className="grid gap-1"><span className="q-mut">Fecha planificada</span><input type="date" className="q-input" value={taskDay} min="2026-09-21" max="2026-09-30" onChange={(e) => setTaskDay(e.target.value)} /></label>
              </div>
            )}
          </div>
        )}
      </div>
    </Dialog>
  );
};

export const Pipeline = ({ D, S, api }) => {
  const [q, setQ] = useState("");
  const [owner, setOwner] = useState(null);
  const [onlyNew, setOnlyNew] = useState(false);
  const [dragId, setDragId] = useState(null);
  const [over, setOver] = useState(null);
  const [move, setMove] = useState(null); // { id, to, from }

  const visible = S.opps.filter((o) => {
    const l = S.leads.find((x) => x.id === o.lead);
    if (q && !l.name.toLowerCase().includes(q.toLowerCase())) return false;
    if (owner && l.owner !== owner) return false;
    if (onlyNew && (l.status !== "NEW" || o.contacted)) return false;
    return true;
  });

  const startMove = (id, to) => {
    const o = S.opps.find((x) => x.id === id);
    if (!o || o.stage === to) return;
    if (to === "SALE_COMPLETED") {
      const a = D.assets.find((x) => x.id === o.asset);
      if (a && (a.status === "Vendido" || a.status === "Agotado")) {
        api.toast(`No se puede concretar la venta: ${a.short} está ${a.status.toLowerCase()}`, "error");
        return;
      }
    }
    api.moveOpp(id, to); // optimista: si se cancela, vuelve
    setMove({ id, to, from: o.stage });
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      <PageHeader title="Pipeline" meta={`${S.opps.filter((o) => !["SALE_COMPLETED", "LOST"].includes(o.stage)).length} oportunidades abiertas · arrastrá una card para moverla`}>
        <RefreshBtn />
        <button className="q-btn q-btn-pri" onClick={() => api.go("leads")}><Ic n="plus" className="w-3.5 h-3.5" />Nueva Oportunidad</button>
      </PageHeader>
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <SearchBox value={q} onChange={setQ} placeholder="Buscar por nombre de lead..." className="w-full @[640px]/app:w-56" />
        <FilterChip label="Responsable" value={owner} options={D.agents} onChange={setOwner} />
        <span className="h-8 px-2.5 rounded-lg border text-[12px] inline-flex items-center gap-1.5 q-bg-card"><Ic n="clock" className="w-3 h-3 q-mut" />Última actividad: Últimos 7 días</span>
        <label className="inline-flex items-center gap-2 text-[12px] q-fg2 cursor-pointer select-none">
          <Switch on={onlyNew} onChange={setOnlyNew} label="Sólo sin contactar" />Sólo sin contactar
        </label>
      </div>

      <div className="flex gap-3 overflow-x-auto q-scroll pb-2 flex-1 min-h-0 -mx-1 px-1">
        {D.stages.map((s) => {
          const m = STAGE_META[s];
          const cards = visible.filter((o) => o.stage === s);
          const terminal = s === "SALE_COMPLETED" || s === "LOST";
          const isOver = over === s && dragId;
          return (
            <div
              key={s}
              onDragOver={(e) => { e.preventDefault(); setOver(s); }}
              onDragLeave={() => setOver((x) => (x === s ? null : x))}
              onDrop={(e) => { e.preventDefault(); const id = e.dataTransfer.getData("text/plain") || dragId; setOver(null); setDragId(null); startMove(id, s); }}
              className="w-[248px] shrink-0 rounded-xl border flex flex-col min-h-0 transition-colors"
              style={{
                borderTop: `2px solid ${m.c}`,
                background: isOver
                  ? "color-mix(in oklab, var(--q-primary) 6%, var(--q-canvas))"
                  : s === "SALE_COMPLETED" ? "color-mix(in oklab, #16a34a 5%, var(--q-canvas))"
                  : s === "LOST" ? "color-mix(in oklab, #ef4444 4%, var(--q-canvas))" : "var(--q-canvas)",
                boxShadow: isOver ? "0 0 0 2px color-mix(in oklab, var(--q-primary) 40%, transparent)" : undefined,
              }}
            >
              <div className="flex items-center gap-2 px-2.5 py-2 shrink-0">
                <span className="rounded-md p-1 q-tint" style={{ "--c": m.c }}><Ic n={m.icon} className="w-3.5 h-3.5" /></span>
                <span className="text-[12.5px] font-semibold truncate">{m.label}</span>
                <span className="text-[10.5px] font-semibold rounded-md px-1.5 q-tint q-num" style={{ "--c": m.c }}>{cards.length}</span>
                <Ic n="more" className="w-3.5 h-3.5 q-mut ml-auto" />
              </div>
              <div className="px-2 pb-2 space-y-2 overflow-y-auto q-scroll flex-1 min-h-[120px]">
                {cards.length === 0 ? (
                  <div className="border border-dashed rounded-xl py-8 flex flex-col items-center gap-1.5 text-[11.5px] q-mut">
                    <Ic n="inbox" className="w-4 h-4" />Sin oportunidades
                  </div>
                ) : cards.map((o) => (
                  <div key={o.id} style={{ opacity: dragId === o.id ? 0.5 : 1 }}>
                    <OppCard o={o} D={D} S={S} api={api} isTerminal={terminal} onDragStart={setDragId} onMoveMenu={startMove} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {move && (
        <StageDialog
          move={move}
          D={D}
          S={S}
          onCancel={() => { api.moveOpp(move.id, move.from); setMove(null); }}
          onConfirm={(extra) => { api.confirmMove(move.id, move.to, { ...extra, from: move.from }); setMove(null); }}
        />
      )}
    </div>
  );
};
