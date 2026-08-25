// CTA. Renders <a> when `href` is set, otherwise <button>.
// Sizing and font-size stay per-call in className; the variant only owns color.
// Wrap the trailing glyph in <span className="arrow"> to get the hover nudge.
const VARIANTS = {
  primary: "btn btn-accent",
  ghost: "btn btn-ghost",
};

export const Button = ({ variant = "primary", href, as, className = "", children, ...rest }) => {
  const Tag = as || (href ? "a" : "button");
  const cls = `${VARIANTS[variant] || VARIANTS.primary} ${className}`.replace(/\s+/g, " ").trim();
  return (
    <Tag href={href} className={cls} {...rest}>
      {children}
    </Tag>
  );
};
