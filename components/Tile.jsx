import Link from "next/link";

const BG_MAP = {
  sun: "var(--sun)",
  mint: "var(--mint)",
  water: "var(--water)",
  white: "var(--white)",
  pale: "var(--pale)",
};

export default function Tile({
  children,
  href,
  color = "white",
  size = "s", // "s" | "m" | "l"
  className = "",
  style = {},
  ...props
}) {
  const bg = BG_MAP[color] || "var(--white)";
  const paddingMap = {
    s: "8px 10px",
    m: "12px 14px",
    l: "16px 18px",
  };

  const tileStyle = {
    background: bg,
    padding: paddingMap[size] || "8px 10px",
    borderRadius: "var(--r-tile)",
    boxShadow: "inset 0 0 0 1px rgba(255,255,255,.55), inset 0 -3px 0 rgba(14,43,59,.09)",
    color: "var(--ink)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxSizing: "border-box",
    minWidth: 0,
    minHeight: 0,
    overflow: "hidden",
    transition: "background-color 0.15s, color 0.15s",
    ...style,
  };

  const fullClassName = `tile tile--${color} tile--${size} ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={fullClassName} style={tileStyle} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <div className={fullClassName} style={tileStyle} {...props}>
      {children}
    </div>
  );
}
