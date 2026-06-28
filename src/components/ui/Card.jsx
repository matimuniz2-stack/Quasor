// Base surface card: the `.card` token (themed bg + border + radius).
// `hover` opts into the standard accent-border hover used across the page.
export const Card = ({ as: Tag = "div", hover = false, className = "", children, ...rest }) => {
  const hoverCls = hover ? "hover:border-[var(--accent)] transition-colors duration-300" : "";
  return (
    <Tag className={`card ${hoverCls} ${className}`.replace(/\s+/g, " ").trim()} {...rest}>
      {children}
    </Tag>
  );
};
