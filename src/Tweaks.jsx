// Tweaks panel
const ACCENTS = {
  orange: { v: "#ff7a59", ink: "#c04624", label: "Naranja" },
  blue:   { v: "#5b8cff", ink: "#2e4fb4", label: "Azul" },
  green:  { v: "#2fb27d", ink: "#197253", label: "Verde" },
};

const applyTweaks = (t) => {
  const root = document.documentElement;
  root.setAttribute("data-theme", t.theme);
  root.setAttribute("data-density", t.density);
  const a = ACCENTS[t.accent] || ACCENTS.orange;
  root.style.setProperty("--accent", a.v);
  root.style.setProperty("--accent-ink", a.ink);
  root.style.setProperty("--density", t.density === "compact" ? "0.7" : "1");
};

const TweakPanel = ({ tweaks, setTweaks, visible }) => {
  if (!visible) return null;
  const update = (k, v) => {
    const next = { ...tweaks, [k]: v };
    setTweaks(next);
    applyTweaks(next);
    try {
      window.parent.postMessage({ type: "__edit_mode_set_keys", edits: { [k]: v } }, "*");
    } catch(e) {}
  };
  return (
    <div className="fixed bottom-6 right-6 z-[100] card p-4 w-[280px] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.3)]">
      <div className="mono text-[10px] uppercase tracking-[0.18em] ink-3 mb-3">Tweaks</div>

      <div className="mb-4">
        <div className="text-xs ink-2 mb-1.5">Acento</div>
        <div className="flex gap-2">
          {Object.entries(ACCENTS).map(([k, a]) => (
            <button key={k} onClick={() => update("accent", k)}
              className={`w-8 h-8 rounded-full border-2 transition ${tweaks.accent === k ? "border-[var(--ink)]" : "border-transparent"}`}
              style={{ background: a.v }} title={a.label} />
          ))}
        </div>
      </div>

      <div className="mb-4">
        <div className="text-xs ink-2 mb-1.5">Tema</div>
        <div className="flex gap-1 p-1 border border-line rounded-full text-xs">
          {["light", "dark"].map(k => (
            <button key={k} onClick={() => update("theme", k)}
              className={`flex-1 py-1.5 rounded-full transition ${tweaks.theme === k ? "bg-[var(--ink)] text-[var(--bg)]" : "ink-2"}`}>
              {k === "light" ? "Claro" : "Oscuro"}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="text-xs ink-2 mb-1.5">Densidad</div>
        <div className="flex gap-1 p-1 border border-line rounded-full text-xs">
          {["cozy", "compact"].map(k => (
            <button key={k} onClick={() => update("density", k)}
              className={`flex-1 py-1.5 rounded-full transition ${tweaks.density === k ? "bg-[var(--ink)] text-[var(--bg)]" : "ink-2"}`}>
              {k === "cozy" ? "Cómoda" : "Compacta"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

window.TweakPanel = TweakPanel;
window.applyTweaks = applyTweaks;
