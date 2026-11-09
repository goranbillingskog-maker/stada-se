import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import "./globals.css";
import { SITE_URL, SITE_NAME } from "../lib/data.js";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `Hitta städfirma i din stad – jämför omdömen | ${SITE_NAME}`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Jämför städfirmor i 45 städer och områden i Sverige. Se omdömen, tjänster, RUT-avdrag och kontaktuppgifter – helt gratis.",
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    locale: "sv_SE",
  },
};

// Anti-klonskydd: Skickar automatiskt besökare till den officiella sajten om någon speglar eller kopierar koden till en obehörig domän
const domainLockScript = `(function(){try{var h=window.location.hostname;if(h==='stadtorget.se'||h==='www.stadtorget.se'||h==='localhost'||h==='127.0.0.1'||h.endsWith('.vercel.app')||h.endsWith('.local')){return;}window.location.replace('https://stadtorget.se'+window.location.pathname+window.location.search);}catch(e){}})();`;

export default function RootLayout({ children }) {
  return (
    <html lang="sv">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script dangerouslySetInnerHTML={{ __html: domainLockScript }} />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
