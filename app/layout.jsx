import Link from "next/link";
import "./globals.css";
import { getCities, SITE_URL, SITE_NAME } from "../lib/data.js";
import { SERVICES } from "../lib/services.js";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `Hitta städfirma i din stad – jämför omdömen | ${SITE_NAME}`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Jämför städfirmor i Sveriges 20 största städer. Se omdömen, tjänster, RUT-avdrag och kontaktuppgifter – helt gratis.",
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    locale: "sv_SE",
  },
};

export default function RootLayout({ children }) {
  const cities = getCities();
  return (
    <html lang="sv">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body>
        <header className="site-header">
          <div className="container">
            <Link href="/" className="logo" aria-label="Städtorget" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
              <img src="/logo.png" alt="Städtorget logotyp" width="44" height="44" style={{ borderRadius: "8px", display: "block" }} />
              <span className="logo-word" style={{ fontSize: "22px", letterSpacing: "-0.02em" }}>
                <span style={{ fontWeight: 800, color: "var(--mint-dark)" }}>STÄD</span>
                <span style={{ fontWeight: 500, color: "#000" }}>TORGET</span>
              </span>
            </Link>
            <nav className="main-nav" aria-label="Huvudmeny">
              <div className="nav-dropdown">
                <Link href="/#tjanster" className="dropdown-trigger">Tjänster</Link>
                <div className="dropdown-menu">
                  {SERVICES.map((s) => (
                    <Link key={s.slug} href={`/tjanster/${s.slug}/`}>
                      {s.name}
                    </Link>
                  ))}
                </div>
              </div>
              <Link href="/#stader">Städer</Link>
              <Link href="/blogg/">Blogg</Link>
              <Link href="/om-oss/">Om oss</Link>
              <Link href="/#stader" className="nav-cta">Hitta städfirma</Link>
            </nav>
          </div>
        </header>

        <main>{children}</main>

        <footer className="site-footer">
          <div className="container footer-grid">
            <div>
              <h3>Städtorget</h3>
              <p>
                Sveriges katalog över städfirmor. Vi samlar omdömen, tjänster och
                kontaktuppgifter så att du enkelt hittar rätt städhjälp där du bor.
              </p>
              <p style={{ display: "flex", gap: "16px" }}>
                <Link href="/om-oss/">Om oss</Link>
                <Link href="/blogg/">Blogg</Link>
              </p>
            </div>
            <div>
              <h3>Tjänster</h3>
              <div className="footer-links">
                {SERVICES.map((s) => (
                  <Link key={s.slug} href={`/tjanster/${s.slug}/`}>
                    {s.name}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h3>Städfirmor per stad</h3>
              <div className="footer-cities">
                {cities.map((c) => (
                  <Link key={c.slug} href={`/${c.slug}/`}>
                    Städfirma {c.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="container footer-bottom">
            © {new Date().getFullYear()} Städtorget. Uppgifterna kommer från offentliga
            källor och företagens egna webbplatser och kan innehålla fel. Städtorget är en
            oberoende katalog och har inget samröre med de listade företagen.
          </div>
        </footer>
      </body>
    </html>
  );
}
