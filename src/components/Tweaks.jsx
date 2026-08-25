// Host edit-mode panel (theme / density / accent). Only reachable when the page
// is embedded and the host posts __activate_edit_mode.
//
// Accent handling: the brand amber lives in src/index.css, where it already has
// a per-theme value for marks (--accent) and for text (--accent-text, darkened
// in light mode to clear 4.5:1). So "orange" REMOVES the inline overrides and
// lets the stylesheet win; only the alternate accents write inline values, and
// they carry their own light/dark text pair for the same reason.
//
// The map below is mirrored by the pre-paint script in index.html — change both.
const ACCENTS = {
  orange: { label: "Naranja", brand: true, v: "#ff9100" },
  blue: { label: "Azul", v: "#5b8cff", v2: "#7ea4ff", textLight: "#2e4fb4", textDark: "#8fb0ff" },
  green: { label: "Verde", v: "#2fb27d", v2: "#4ecb98", textLight: "#0f7a4a", textDark: "#3ecf8e" },
};

export const applyTweaks = (t) => {
  const root = document.documentElement;
  root.setAttribute("data-theme", t.theme);
  root.setAttribute("data-density", t.density);
  root.style.setProperty("--density", t.density === "compact" ? "0.7" : "1");

  const a = ACCENTS[t.accent] || ACCENTS.orange;
  if (a.brand) {
    root.style.removeProperty("--accent");
    root.style.removeProperty("--accent-2");
    root.style.removeProperty("--accent-text");
  } else {
    root.style.setProperty("--accent", a.v);
    root.style.setProperty("--accent-2", a.v2);
    root.style.setProperty("--accent-text", t.theme === "dark" ? a.textDark : a.textLight);
  }
};

export const TweakPanel = ({ tweaks, setTweaks, visible }) => {
  if (!visible) return null;
  const update = (k, v) => {
    const next = { ...tweaks, [k]: v };
    setTweaks(next);
    applyTweaks(next);
    try {
      window.parent.postMessage({ type: "__edit_mode_set_keys", edits: { [k]: v } }, "*");
    } catch (e) {}
  };
  return (
    <div className="fixed bottom-6 right-6 z-[100] panel p-4 w-[280px] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.35)]">
      <div className="label ink-3 mb-3">Tweaks</div>

      <div className="mb-4">
        <div className="text-xs ink-2 mb-1.5">Acento</div>
        <div className="flex gap-2">
          {Object.entries(ACCENTS).map(([k, a]) => (
            <button
              key={k}
              onClick={() => update("accent", k)}
              className={`w-8 h-8 rounded-full border-2 transition ${tweaks.accent === k ? "border-[var(--ink)]" : "border-transparent"}`}
              style={{ background: a.v }}
              title={a.label}
            />
          ))}
        </div>
      </div>

      <div className="mb-4">
        <div className="text-xs ink-2 mb-1.5">Tema</div>
        <div className="flex gap-1 p-1 border border-line rounded-full text-xs">
          {["light", "dark"].map((k) => (
            <button
              key={k}
              onClick={() => update("theme", k)}
              className={`flex-1 py-1.5 rounded-full transition ${tweaks.theme === k ? "bg-[var(--ink)] text-[var(--bg)]" : "ink-2"}`}
            >
              {k === "light" ? "Claro" : "Oscuro"}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="text-xs ink-2 mb-1.5">Densidad</div>
        <div className="flex gap-1 p-1 border border-line rounded-full text-xs">
          {["cozy", "compact"].map((k) => (
            <button
              key={k}
              onClick={() => update("density", k)}
              className={`flex-1 py-1.5 rounded-full transition ${tweaks.density === k ? "bg-[var(--ink)] text-[var(--bg)]" : "ink-2"}`}
            >
              {k === "cozy" ? "Cómoda" : "Compacta"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
