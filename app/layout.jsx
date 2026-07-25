import Link from "next/link";
import "./globals.css";
import { getCities, SITE_URL, SITE_NAME } from "../lib/data.js";

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
      <body>
        <header className="site-header">
          <div className="container">
            <Link href="/" className="logo">
              Stada<span>.se</span>
            </Link>
            <nav className="main-nav" aria-label="Huvudmeny">
              <Link href="/">Hem</Link>
              <Link href="/#stader">Städer</Link>
              <Link href="/om-oss/">Om oss</Link>
            </nav>
          </div>
        </header>

        <main>{children}</main>

        <footer className="site-footer">
          <div className="container footer-grid">
            <div>
              <h3>Stada.se</h3>
              <p>
                Sveriges katalog över städfirmor. Vi samlar omdömen, tjänster och
                kontaktuppgifter så att du enkelt hittar rätt städhjälp där du bor.
              </p>
              <p>
                <Link href="/om-oss/">Om oss</Link>
              </p>
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
            © {new Date().getFullYear()} Stada.se. Uppgifterna kommer från offentliga
            källor och företagens egna webbplatser och kan innehålla fel. Stada.se är en
            oberoende katalog och har inget samröre med de listade företagen.
          </div>
        </footer>
      </body>
    </html>
  );
}
