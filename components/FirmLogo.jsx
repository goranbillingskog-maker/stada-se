const COLOR_BG_MAP = {
  sun: "var(--sun)",
  mint: "var(--mint)",
  water: "var(--water)",
  pale: "var(--pale)",
};

export default function FirmLogo({
  company,
  size = 104,
  mobileSize = 72,
  className = "",
  style = {},
}) {
  const { validLogo, fallbackLetter, fallbackColor, name } = company || {};
  const letter = fallbackLetter || (name ? name.trim()[0].toUpperCase() : "S");
  const bg = COLOR_BG_MAP[fallbackColor] || "var(--mint)";

  return (
    <div
      className={`firm-logo-wrap ${className}`.trim()}
      style={{
        ...style,
      }}
    >
      {validLogo ? (
        <img
          src={validLogo}
          alt={`Logotyp för ${name || "företaget"}`}
          width={size}
          height={size}
          className="firm-logo-img"
          loading="lazy"
        />
      ) : (
        <div
          className="firm-logo-fallback d"
          style={{
            background: bg,
          }}
          aria-hidden="true"
        >
          {letter}
        </div>
      )}
    </div>
  );
}
