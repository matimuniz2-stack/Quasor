// Standard CTA button. Renders <a> when `href` is set, otherwise <button>.
// Keep only color/border/hover in the variant — sizing, font-weight and gap
// overrides stay per-call via className so callers can't fight each other.
const VARIANTS = {
  primary: "btn-accent hover:opacity-95",
  secondary: "border border-line-2 hover:bg-surface-2",
};

export const Button = ({ variant = "primary", href, as, className = "", children, ...rest }) => {
  const Tag = as || (href ? "a" : "button");
  const cls = `inline-flex items-center justify-center gap-2 rounded-full transition ${VARIANTS[variant] || ""} ${className}`
    .replace(/\s+/g, " ")
    .trim();
  return (
    <Tag href={href} className={cls} {...rest}>
      {children}
    </Tag>
  );
};
