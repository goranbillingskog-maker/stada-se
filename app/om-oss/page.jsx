import Link from "next/link";
import Breadcrumbs from "../../components/Breadcrumbs.jsx";

export const metadata = {
  title: "Om oss",
  description:
    "Städtorget är en oberoende katalog över städfirmor i Sveriges största städer. Läs om hur vi samlar in och verifierar uppgifterna.",
  alternates: { canonical: "/om-oss/" },
};

export default function OmOssPage() {
  return (
    <section style={{ maxWidth: 1280, margin: "0 auto", padding: "8px clamp(16px, 4vw, 32px) 112px" }}>
      <Breadcrumbs items={[{ label: "Hem", href: "/" }, { label: "Om oss" }]} />
      <article style={{ maxWidth: "68ch" }}>
        <h1
          className="d"
          style={{
            margin: "0 0 24px",
            fontSize: "clamp(48px, 6vw, 88px)",
            lineHeight: 0.9,
            letterSpacing: "-0.015em",
          }}
        >
          Om Städtorget
        </h1>
        <p style={{ fontSize: 18, lineHeight: 1.7, color: "var(--ink)", margin: "0 0 24px" }}>
          Städtorget är en oberoende katalog över städfirmor i 45 städer och områden runt
          om i Sverige. Vårt mål är enkelt: att göra det lätt att hitta en seriös
          städfirma där du bor – utan formulär, mellanhänder eller dolda avgifter.
        </p>
        <p style={{ fontSize: 18, lineHeight: 1.7, color: "var(--ink)", margin: "0 0 36px" }}>
          För varje företag samlar vi uppgifter från offentliga källor, företagens
          egna webbplatser och Google: tjänster, omdömen, organisationsnummer,
          RUT-avdrag och kontaktuppgifter. Du kontaktar alltid städfirman direkt.
        </p>

        <h2
          className="d"
          style={{
            margin: "48px 0 16px",
            fontSize: "clamp(32px, 3.5vw, 44px)",
            lineHeight: 0.95,
            letterSpacing: "-0.012em",
          }}
        >
          Hur aktuella är uppgifterna?
        </h2>
        <p style={{ fontSize: 18, lineHeight: 1.7, color: "var(--ink)", margin: "0 0 36px" }}>
          Varje företagsprofil visar när uppgifterna senast verifierades. Hittar du
          något som inte stämmer, eller driver du en städfirma som vill uppdatera
          sin profil? Hör av dig till{" "}
          <a href="mailto:info@stadtorget.se" style={{ textDecoration: "underline" }}>
            info@stadtorget.se
          </a>{" "}
          så rättar vi det.
        </p>

        <h2
          className="d"
          style={{
            margin: "48px 0 16px",
            fontSize: "clamp(32px, 3.5vw, 44px)",
            lineHeight: 0.95,
            letterSpacing: "-0.012em",
          }}
        >
          För städfirmor
        </h2>
        <p style={{ fontSize: 18, lineHeight: 1.7, color: "var(--ink)", margin: 0 }}>
          Är du städfirma och vill synas bättre på Städtorget? Vi arbetar med utökade
          företagsprofiler. Kontakta oss på{" "}
          <a href="mailto:info@stadtorget.se" style={{ textDecoration: "underline" }}>
            info@stadtorget.se
          </a>
          .
        </p>
      </article>
    </section>
  );
}
