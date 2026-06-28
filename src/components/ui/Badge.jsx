// Status pill / indicator: an optional colored dot + label.
// `pill` adds the bordered surface chrome; without it you get a bare dot+label
// (the mono "Disponible · …" style). Typography stays per-call via className.
export const Badge = ({
  dot = true,
  dotColor = "var(--pos)",
  pulse = false,
  pill = false,
  className = "",
  children,
  ...rest
}) => {
  const base = pill
    ? "inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full border border-line bg-surface"
    : "inline-flex items-center gap-2";
  return (
    <span className={`${base} ${className}`.replace(/\s+/g, " ").trim()} {...rest}>
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${pulse ? "pulse-dot" : ""}`.trim()}
          style={{ background: dotColor }}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
};
