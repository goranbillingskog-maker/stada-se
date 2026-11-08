import Link from "next/link";
import { getCities } from "../lib/data.js";

const CITY_COLORS = [
  "#FFC933", // sun
  "#C4E6DA", // mint
  "#9CCBE4", // water
  "#FFFFFF", // white
  "#E1ECE9", // pale
  "#C4E6DA", // mint
  "#9CCBE4", // water
  "#FFFFFF", // white
];

export default function NotFound() {
  const topCities = getCities()
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  return (
    <section style={{ maxWidth: 1280, margin: "0 auto", padding: "48px clamp(16px, 4vw, 32px) 112px" }}>
      <div style={{ maxWidth: 640, marginBottom: 48 }}>
        <span
          className="d"
          style={{
            display: "block",
            fontSize: "clamp(88px, 12vw, 160px)",
            lineHeight: 0.8,
            color: "var(--ink)",
            marginBottom: 16,
          }}
        >
          404
        </span>
        <h1
          className="d"
          style={{
            margin: "0 0 16px",
            fontSize: "clamp(36px, 4vw, 56px)",
            lineHeight: 0.95,
          }}
        >
          Sidan hittades inte
        </h1>
        <p className="w" style={{ margin: 0, fontSize: 18, color: "var(--text-2)" }}>
          Sidan du letar efter finns inte eller har flyttats. Gå till{" "}
          <Link href="/" style={{ textDecoration: "underline", fontWeight: 600 }}>
            startsidan
          </Link>{" "}
          eller välj en stad nedan:
        </p>
      </div>

      <h2 className="d" style={{ margin: "0 0 20px", fontSize: 28 }}>
        Populära städer
      </h2>
      <div className="cities">
        {topCities.map((c, i) => (
          <Link
            key={c.slug}
            className="city"
            href={`/${c.slug}/`}
            style={{ background: CITY_COLORS[i % CITY_COLORS.length] }}
          >
            <span className="d" style={{ fontSize: 40, lineHeight: 0.95 }}>
              {c.name}
            </span>
            <span className="w" style={{ fontSize: 13 }}>
              {c.count} firmor
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
