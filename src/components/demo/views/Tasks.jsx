import { useState } from "react";
import { Ic, Avatar, PageHeader, SearchBox, Tint } from "../ui.jsx";
import { PrioBadge, TaskStatusBadge, TempChip } from "../domain.jsx";
import { TASK_TYPES, PRIORITIES, TASK_STATUS, TODAY } from "../data.js";

const WEEK = [21, 22, 23, 24, 25, 26, 27];
const WD = ["lun", "mar", "mié", "jue", "vie", "sáb", "dom"];
const isOverdue = (t) => t.status !== "COMPLETED" && t.status !== "CANCELLED" && t.day < TODAY.d;
const isSoon = (t) => t.status !== "COMPLETED" && !isOverdue(t) && t.day - TODAY.d <= 2;

const DateChip = ({ t }) => {
  const over = isOverdue(t);
  const soon = isSoon(t);
  const c = over ? "#dc2626" : soon ? "#d97706" : "#71717a";
  return (
    <span title={over ? "Vencida" : soon ? `Vence ${t.day}/09` : undefined} className="inline-flex items-center gap-1 rounded-md px-1.5 py-[1px] text-[10.5px] font-medium q-num q-tint" style={{ "--c": c }}>
      <Ic n={over ? "alert" : "cal"} className="w-3 h-3" />{String(t.day).padStart(2, "0")}/09 {t.time}
    </span>
  );
};

const Compact = ({ t, api, draggable, onDragStart }) => {
  const done = t.status === "COMPLETED";
  const over = isOverdue(t);
  return (
    <div
      draggable={draggable}
      onDragStart={(e) => { e.dataTransfer.setData("text/plain", t.id); onDragStart?.(t.id); }}
      className={`group rounded-lg border px-2 py-1.5 text-[11.5px] q-bg-card cursor-grab active:cursor-grabbing hover:border-[color-mix(in_oklab,var(--q-primary)_40%,var(--q-border))] transition-colors ${t.fresh ? "q-flash" : ""}`}
      style={{ borderLeft: `3px solid ${PRIORITIES[t.prio].c}` }}
    >
      <div className="flex items-center gap-1.5 min-w-0">
        <span className="q-num q-mut text-[10.5px]">{t.time}</span>
        {over && <span className="text-[#dc2626]"><Ic n="alert" className="w-3 h-3" /></span>}
        <button onClick={() => api.toggleTask(t.id)} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" title="Marcar completada" style={{ color: done ? "var(--q-success)" : "var(--q-muted-fg)" }}>
          <Ic n="circlecheck" className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className={`flex items-start gap-1 mt-0.5 ${done ? "line-through q-mut" : ""}`}>
        <Ic n={TASK_TYPES[t.type].icon} className="w-3 h-3 mt-[2px] q-mut" />
        <span className="leading-snug line-clamp-2">{t.title}</span>
      </div>
      {t.client && <div className="text-[10.5px] q-mut truncate mt-0.5 pl-4">{t.client}</div>}
    </div>
  );
};

const Week = ({ tasks, api }) => {
  const [drag, setDrag] = useState(null);
  const [over, setOver] = useState(null);
  return (
    <div className="grid grid-cols-7 gap-1.5 @[900px]/app:gap-2 min-w-[760px]">
      {WEEK.map((d, i) => {
        const list = tasks.filter((t) => t.day === d).sort((a, b) => a.time.localeCompare(b.time));
        const today = d === TODAY.d;
        return (
          <div
            key={d}
            onDragOver={(e) => { e.preventDefault(); setOver(d); }}
            onDragLeave={() => setOver((x) => (x === d ? null : x))}
            onDrop={(e) => { e.preventDefault(); const id = e.dataTransfer.getData("text/plain") || drag; setOver(null); setDrag(null); api.moveTask(id, d); }}
            className="group/day rounded-lg border min-h-[330px] flex flex-col transition-colors"
            style={{ background: over === d ? "color-mix(in oklab, var(--q-primary) 7%, var(--q-canvas))" : "color-mix(in oklab, var(--q-muted) 30%, transparent)" }}
          >
            <div className="flex items-center justify-between px-2 pt-2 pb-1.5">
              <span className="text-[11px] q-mut uppercase tracking-wide">{WD[i]}</span>
              <span className={`w-6 h-6 rounded-full grid place-items-center text-[12px] font-semibold q-num ${today ? "text-white" : ""}`} style={today ? { background: "var(--q-primary)" } : undefined}>{d}</span>
            </div>
            <div className="px-1.5 pb-1.5 space-y-1.5 flex-1">
              {list.map((t) => <Compact key={t.id} t={t} api={api} draggable onDragStart={setDrag} />)}
              <button
                onClick={() => api.addTask({ title: "Nueva tarea", client: null, type: "TASK", prio: "MEDIUM", day: d, time: "12:00" })}
                className="w-full rounded-lg border border-dashed py-1 text-[11px] q-mut opacity-0 group-hover/day:opacity-100 transition-opacity hover:text-[var(--q-fg)]"
                title={`Nueva tarea el ${d}/9`}
              >
                <Ic n="plus" className="w-3 h-3 inline" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Month = ({ tasks, api }) => {
  // Septiembre 2026: el 1 cae martes → la grilla arranca el lunes 31/08
  const cells = Array.from({ length: 35 }, (_, i) => i - 1);
  return (
    <div className="grid grid-cols-7 gap-1 min-w-[640px]">
      {WD.map((w) => <div key={w} className="text-[11px] q-mut uppercase tracking-wide px-1.5 pb-1">{w}</div>)}
      {cells.map((n) => {
        const d = n + 1;
        const inMonth = d >= 1 && d <= 30;
        const list = inMonth ? tasks.filter((t) => t.day === d) : [];
        const today = d === TODAY.d;
        return (
          <div key={n} className="rounded-lg border min-h-[70px] p-1" style={{ opacity: inMonth ? 1 : 0.4, background: "color-mix(in oklab, var(--q-muted) 25%, transparent)" }}>
            <div className="flex justify-end">
              <span className={`w-5 h-5 rounded-full grid place-items-center text-[11px] q-num ${today ? "text-white font-semibold" : "q-mut"}`} style={today ? { background: "var(--q-primary)" } : undefined}>{inMonth ? d : d < 1 ? 31 : d - 30}</span>
            </div>
            <div className="space-y-0.5">
              {list.slice(0, 3).map((t) => (
                <button key={t.id} onClick={() => api.toggleTask(t.id)} className={`w-full text-left truncate text-[10px] rounded px-1 py-[1px] q-tint ${t.status === "COMPLETED" ? "line-through opacity-60" : ""}`} style={{ "--c": PRIORITIES[t.prio].c }}>
                  {t.time} {t.title}
                </button>
              ))}
              {list.length > 3 && <div className="text-[10px] q-mut px-1">+{list.length - 3} más</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Kanban = ({ tasks, api }) => (
  <div className="flex gap-3 min-w-max">
    {Object.entries(TASK_STATUS).map(([k, m]) => {
      const list = tasks.filter((t) => t.status === k).sort((a, b) => a.day - b.day || a.time.localeCompare(b.time));
      return (
        <div key={k} className="w-[236px] rounded-xl border q-bg-canvas" style={{ borderTop: `2px solid ${m.c}` }}>
          <div className="flex items-center gap-2 px-2.5 py-2">
            <span className="rounded-md p-1 q-tint" style={{ "--c": m.c }}><Ic n={m.icon} className="w-3.5 h-3.5" /></span>
            <span className="text-[12.5px] font-semibold">{m.label}</span>
            <span className="text-[10.5px] font-semibold rounded-md px-1.5 q-tint" style={{ "--c": m.c }}>{list.length}</span>
          </div>
          <div className="px-2 pb-2 space-y-2 min-h-[90px]">
            {list.map((t) => (
              <div key={t.id} className={`rounded-xl border q-bg-card p-2.5 text-[12px] ${t.fresh ? "q-flash" : ""}`}>
                <div className="flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: PRIORITIES[t.prio].c }} />
                  <Ic n={TASK_TYPES[t.type].icon} className="w-3.5 h-3.5 mt-0.5 q-mut" />
                  <span className={`font-medium leading-snug ${t.status === "COMPLETED" ? "line-through q-mut" : ""}`}>{t.title}</span>
                </div>
                {t.client && <div className="text-[11px] q-mut mt-1 pl-5">{t.client}</div>}
                <div className="flex items-center gap-1.5 mt-2">
                  <DateChip t={t} />
                  {t.auto && <Tint c="#8b5cf6" className="!text-[9.5px] !py-0">Automática</Tint>}
                  <button onClick={() => api.toggleTask(t.id)} className="ml-auto" title="Marcar completada" style={{ color: t.status === "COMPLETED" ? "var(--q-success)" : "var(--q-muted-fg)" }}><Ic n="circlecheck" className="w-4 h-4" /></button>
                  <Avatar name={t.owner} size={20} />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    })}
  </div>
);

const List = ({ tasks, api, S }) => (
  <div className="q-card !rounded-xl overflow-hidden">
    <table className="w-full text-[12.5px] min-w-[720px]">
      <thead>
        <tr className="q-th text-left border-b">
          {["Título", "Cliente", "Tipo", "Estado", "Prioridad", "Planificada", "Asignada a"].map((h) => <th key={h} className="py-2.5 px-3 font-medium">{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {[...tasks].sort((a, b) => a.day - b.day || a.time.localeCompare(b.time)).map((t) => {
          const lead = S.leads.find((l) => l.name === t.client);
          return (
            <tr key={t.id} className="border-b last:border-b-0 q-row">
              <td className="py-2.5 px-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={t.status === "COMPLETED"} onChange={() => api.toggleTask(t.id)} className="accent-[var(--q-success)]" />
                  <span className={`font-medium ${t.status === "COMPLETED" ? "line-through q-mut" : ""}`}>{t.title}</span>
                </label>
              </td>
              <td className="py-2.5 px-3"><span className="flex items-center gap-1.5">{t.client || <span className="q-mut">—</span>}{lead && <TempChip t={lead.temp} compact />}</span></td>
              <td className="py-2.5 px-3"><span className="flex items-center gap-1.5 q-fg2"><Ic n={TASK_TYPES[t.type].icon} className="w-3.5 h-3.5" />{TASK_TYPES[t.type].label}</span></td>
              <td className="py-2.5 px-3"><TaskStatusBadge s={t.status} /></td>
              <td className="py-2.5 px-3"><PrioBadge p={t.prio} /></td>
              <td className="py-2.5 px-3"><DateChip t={t} /></td>
              <td className="py-2.5 px-3"><span className="flex items-center gap-1.5 whitespace-nowrap"><Avatar name={t.owner} size={20} />{t.owner}</span></td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

export const Tasks = ({ D, S, api }) => {
  const [view, setView] = useState("cal");
  const [scale, setScale] = useState("week");
  const [mine, setMine] = useState(false);
  const [overdueOnly, setOverdueOnly] = useState(false);
  const [q, setQ] = useState("");
  const tasks = S.tasks.filter((t) => {
    if (q && !`${t.title} ${t.client || ""}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (mine && t.owner !== D.user.name && t.owner !== D.agents[0]) return false;
    if (overdueOnly && !isOverdue(t)) return false;
    return true;
  });
  const overdue = S.tasks.filter(isOverdue).length;
  const todayN = S.tasks.filter((t) => t.day === TODAY.d && t.status !== "COMPLETED").length;

  return (
    <div>
      <PageHeader title="Tareas" meta={`${todayN} para hoy · ${overdue} vencida${overdue === 1 ? "" : "s"}`}>
        <div className="q-seg">
          <button aria-pressed={view === "cal"} onClick={() => setView("cal")}><Ic n="caldays" className="w-3.5 h-3.5" />Calendario</button>
          <button aria-pressed={view === "kanban"} onClick={() => setView("kanban")}><Ic n="kanban" className="w-3.5 h-3.5" />Kanban</button>
          <button aria-pressed={view === "list"} onClick={() => setView("list")}><Ic n="list" className="w-3.5 h-3.5" />Lista</button>
        </div>
        <button className="q-btn q-btn-pri" onClick={() => api.addTask({ title: "Nueva tarea", client: null, type: "TASK", prio: "MEDIUM", day: TODAY.d, time: "18:00" })}><Ic n="plus" className="w-3.5 h-3.5" />Nueva tarea</button>
      </PageHeader>

      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <SearchBox value={q} onChange={setQ} placeholder="Buscar tareas..." className="w-full @[640px]/app:w-52" />
        <button onClick={() => setMine((m) => !m)} className={`h-8 px-3 rounded-lg border text-[12px] ${mine ? "q-tint font-medium" : "q-bg-card q-fg2"}`} style={{ "--c": "#f97316" }}>Mis tareas</button>
        <button onClick={() => setOverdueOnly((m) => !m)} className={`h-8 px-3 rounded-lg border text-[12px] inline-flex items-center gap-1.5 ${overdueOnly ? "q-tint font-medium" : "q-bg-card"}`} style={{ "--c": "#dc2626", color: overdueOnly ? undefined : "#dc2626" }}><Ic n="alert" className="w-3 h-3" />Vencidas · {overdue}</button>
        {view === "cal" && (
          <div className="flex items-center gap-2 ml-auto">
            <button className="q-btn q-btn-out !h-8">Hoy</button>
            <span className="flex"><button className="q-btn q-btn-ghost q-btn-icon" aria-label="Anterior"><Ic n="chevleft" /></button><button className="q-btn q-btn-ghost q-btn-icon" aria-label="Siguiente"><Ic n="chevright" /></button></span>
            <span className="text-[13px] font-medium hidden @[760px]/app:inline">{scale === "month" ? "Septiembre 2026" : scale === "day" ? "Viernes 25 de septiembre" : "21 – 27 sep 2026"}</span>
            <div className="q-seg">
              {[["month", "Mes"], ["week", "Semana"], ["day", "Día"]].map(([k, l]) => <button key={k} aria-pressed={scale === k} onClick={() => setScale(k)}>{l}</button>)}
            </div>
          </div>
        )}
      </div>

      <div className="overflow-x-auto q-scroll pb-2">
        {view === "cal" && scale === "week" && <Week tasks={tasks} api={api} />}
        {view === "cal" && scale === "month" && <Month tasks={tasks} api={api} />}
        {view === "cal" && scale === "day" && (
          <div className="max-w-[560px] space-y-2">
            {tasks.filter((t) => t.day === TODAY.d).sort((a, b) => a.time.localeCompare(b.time)).map((t) => <Compact key={t.id} t={t} api={api} />)}
          </div>
        )}
        {view === "kanban" && <Kanban tasks={tasks} api={api} />}
        {view === "list" && <List tasks={tasks} api={api} S={S} />}
      </div>
    </div>
  );
};
