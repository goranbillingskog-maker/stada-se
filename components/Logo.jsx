import Link from "next/link";

export default function Logo({ onDark = false, size = "default" }) {
  const iconSize = onDark ? 36 : 30;
  const fontSize = onDark ? "44px" : "34px";
  const firstTileFill = onDark ? "#FFFFFF" : "var(--ink)";

  return (
    <Link
      href="/"
      className="d"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "12px",
        fontSize: size === "large" ? "44px" : fontSize,
        lineHeight: 1,
        letterSpacing: "-0.01em",
        color: onDark ? "var(--white)" : "var(--ink)",
      }}
    >
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 30 30"
        aria-hidden="true"
        style={{ flex: "none" }}
      >
        <rect x="1" y="1" width="13" height="13" rx="2.5" fill={firstTileFill} />
        <rect x="16" y="1" width="13" height="13" rx="2.5" fill="var(--water)" />
        <rect x="1" y="16" width="13" height="13" rx="2.5" fill="var(--mint)" />
        <rect x="16" y="16" width="13" height="13" rx="2.5" fill="var(--sun)" />
      </svg>
      <span>Städtorget</span>
    </Link>
  );
}
