import Link from "next/link";
import Logo from "./Logo.jsx";
import { SERVICES } from "../lib/services.js";

const FEATURED_CITIES = [
  { name: "Stockholm", slug: "stockholm" },
  { name: "Göteborg", slug: "goteborg" },
  { name: "Malmö", slug: "malmo" },
  { name: "Uppsala", slug: "uppsala" },
  { name: "Linköping", slug: "linkoping" },
  { name: "Västerås", slug: "vasteras" },
  { name: "Örebro", slug: "orebro" },
  { name: "Helsingborg", slug: "helsingborg" },
];

export default function Footer() {
  return (
    <footer
      className="on-dark"
      style={{
        background: "var(--ink)",
        color: "var(--white)",
        padding: "80px 0 40px",
        borderTop: "1px solid var(--ink-2)",
      }}
    >
      <div
        style={{
          maxWidth: "var(--maxw)",
          margin: "0 auto",
          padding: "0 var(--gutter)",
        }}
      >
        <div className="foot-grid">
          <div>
            <div style={{ marginBottom: "20px" }}>
              <Logo onDark={true} size="large" />
            </div>
            <p
              style={{
                margin: 0,
                maxWidth: "40ch",
                fontSize: "16px",
                lineHeight: 1.6,
                color: "var(--on-dark-2)",
              }}
            >
              Sveriges katalog över städfirmor. Vi samlar omdömen, tjänster och
              kontaktuppgifter så att du hittar rätt städhjälp där du bor.
            </p>
          </div>

          <div>
            <h3
              className="d"
              style={{
                margin: "0 0 16px",
                fontSize: "28px",
                lineHeight: 1,
              }}
            >
              Tjänster
            </h3>
            <ul
              style={{
                margin: 0,
                padding: 0,
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                fontSize: "16px",
                color: "var(--on-dark-2)",
              }}
            >
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link href={`/tjanster/${s.slug}/`}>{s.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3
              className="d"
              style={{
                margin: "0 0 16px",
                fontSize: "28px",
                lineHeight: 1,
              }}
            >
              Städfirmor per stad
            </h3>
            <ul
              style={{
                margin: 0,
                padding: 0,
                listStyle: "none",
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "10px 24px",
                fontSize: "16px",
                color: "var(--on-dark-2)",
              }}
            >
              {FEATURED_CITIES.map((c) => (
                <li key={c.slug}>
                  <Link href={`/${c.slug}/`}>{c.name}</Link>
                </li>
              ))}
              <li>
                <Link
                  href="/#stader"
                  style={{
                    fontWeight: 700,
                    color: "var(--sun)",
                  }}
                >
                  Alla 45 orter
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <p
          style={{
            margin: "64px 0 0",
            maxWidth: "90ch",
            fontSize: "14px",
            lineHeight: 1.55,
            color: "var(--on-dark-3)",
          }}
        >
          © 2026 Städtorget. Uppgifterna kommer från offentliga källor och
          företagens egna webbplatser och kan innehålla fel. Städtorget är en
          oberoende katalog och har inget samröre med de listade företagen.
        </p>
      </div>

      <style>{`
        .foot-grid {
          display: grid;
          grid-template-columns: minmax(0, 5fr) minmax(0, 3fr) minmax(0, 4fr);
          gap: 48px;
        }
        .foot-grid a:hover {
          text-decoration: underline;
          text-underline-offset: 4px;
        }
        @media (max-width: 860px) {
          .foot-grid {
            grid-template-columns: minmax(0, 1fr);
            gap: 40px;
          }
        }
      `}</style>
    </footer>
  );
}
