// Small rounded tag. `accent` marks the one chip that carries meaning
// (a live status, the recommended plan); the rest stay neutral.
//
// Sin estado :hover — es una etiqueta de estado, no un control: levantarla al
// pasar el mouse la hacía parecer clickeable.
export const Chip = ({ accent = false, className = "", children, ...rest }) => (
  <span className={`chip ${accent ? "chip-accent" : ""} ${className}`.replace(/\s+/g, " ").trim()} {...rest}>
    {children}
  </span>
);
