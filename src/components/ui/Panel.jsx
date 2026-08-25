// Neutral bordered surface (bg-2 + hairline + medium radius).
// `hover` opts into the standard lift + accent border.
export const Panel = ({ as: Tag = "div", hover = false, className = "", children, ...rest }) => (
  <Tag className={`panel ${hover ? "panel-hover" : ""} ${className}`.replace(/\s+/g, " ").trim()} {...rest}>
    {children}
  </Tag>
);
