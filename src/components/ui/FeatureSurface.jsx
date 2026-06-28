// "Featured" surface for the hero-metric / discovery boxes — the same
// accent-tinted elevated surface used by the recommended price card and the
// "Quasor" comparison column. The --rec-* tokens are theme-relative, so this
// respects the theme in BOTH modes (light: tinted panel + dark ink; dark:
// tinted charcoal + light ink) instead of a glaring inversion.
export const FeatureSurface = ({ as: Tag = "div", className = "", style, children, ...rest }) => (
  <Tag
    className={className}
    style={{ background: "var(--rec-bg)", color: "var(--rec-fg)", ...style }}
    {...rest}
  >
    {children}
  </Tag>
);
