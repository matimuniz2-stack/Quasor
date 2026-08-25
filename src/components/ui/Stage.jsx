// The signature surface of this design: a large panel of muted, saturated color
// that holds real product UI or a block of data. One hue per section, so the
// page gets rhythm from color instead of from another row of identical cards.
//
//   <Stage tone="amber" className="p-6 md:p-8"> … </Stage>
//
// Tones map to --stage-* tokens, which flip with the theme (deep fields in
// dark, soft tints in light) while keeping the same hue identity.
const TONES = {
  amber: "stage-amber",
  teal: "stage-teal",
  indigo: "stage-indigo",
  neutral: "stage-neutral",
};

export const Stage = ({ as: Tag = "div", tone = "neutral", className = "", children, ...rest }) => (
  <Tag className={`stage ${TONES[tone] || TONES.neutral} ${className}`.replace(/\s+/g, " ").trim()} {...rest}>
    {children}
  </Tag>
);
