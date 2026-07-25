import Link from "next/link";
import { getCities, getAllCompanies, getTopCompanies, SITE_URL } from "../lib/data.js";
import { CompanyCard, JsonLd } from "../components/Ui.jsx";

export const metadata = {
  title: "Hitta städfirma i din stad – jämför 400+ städfirmor | Stada.se",
  description:
    "Jämför städfirmor i Sveriges 20 största städer. Se Google-omdömen, tjänster, priser och RUT-avdrag. Hitta rätt städhjälp – hemstädning, flyttstädning och kontorsstädning.",
  alternates: { canonical: "/" },
};

const FAQ = [
  {
    q: "Vad kostar en städfirma?",
    a: "Priset varierar med tjänst och stad. Hemstädning kostar ofta 200–350 kr per timme efter RUT-avdrag, medan flyttstädning vanligen prissätts per kvadratmeter. Kontakta flera firmor och jämför offerter innan du bestämmer dig.",
  },
  {
    q: "Vad är RUT-avdrag och vem kan använda det?",
    a: "RUT-avdraget ger dig som privatperson 50 % rabatt på arbetskostnaden för hushållsnära tjänster som hemstädning och flyttstädning, direkt på fakturan. De flesta seriösa städfirmor hanterar avdraget åt dig – på varje firmas sida ser du om de erbjuder RUT.",
  },
  {
    q: "Hur väljer jag rätt städfirma?",
    a: "Titta på omdömen från tidigare kunder, kontrollera att företaget har organisationsnummer och F-skatt, fråga om försäkring och kollektivavtal, och jämför alltid minst två offerter. På Stada.se ser du betyg och företagsuppgifter samlade på ett ställe.",
  },
  {
    q: "Är det gratis att använda Stada.se?",
    a: "Ja. Stada.se är en fri katalog – du kontaktar städfirmorna direkt utan mellanhänder, förbindelser eller dolda avgifter.",
  },
];

export default function HomePage() {
  const cities = getCities();
  const companies = getAllCompanies();
  const top = getTopCompanies(6);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const siteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Stada.se",
    url: SITE_URL,
  };

  return (
    <>
      <JsonLd data={siteJsonLd} />
      <JsonLd data={faqJsonLd} />

      <section className="hero">
        <div className="container">
          <h1>Hitta rätt städfirma i din stad</h1>
          <p>
            Jämför städfirmor med riktiga omdömen – hemstädning, flyttstädning,
            kontorsstädning och mer. Helt gratis, utan mellanhänder.
          </p>
          <div className="hero-stats">
            <div className="hero-stat">
              <strong>{companies.length}</strong>
              <span>städfirmor</span>
            </div>
            <div className="hero-stat">
              <strong>{cities.length}</strong>
              <span>städer</span>
            </div>
            <div className="hero-stat">
              <strong>100 %</strong>
              <span>gratis att använda</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="stader">
        <div className="container">
          <h2>Städfirmor per stad</h2>
          <p className="lead">
            Välj din stad för att se alla städfirmor med omdömen, tjänster och
            kontaktuppgifter.
          </p>
          <div className="city-grid">
            {cities.map((c) => (
              <Link key={c.slug} href={`/${c.slug}/`} className="city-card">
                <span>
                  <span className="name">{c.name}</span>
                  <br />
                  <span className="count">{c.count} städfirmor</span>
                </span>
                <span className="arrow">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <h2>Högst betyg just nu</h2>
          <p className="lead">
            Städfirmor med toppbetyg på Google och minst tio omdömen.
          </p>
          <div className="company-list">
            {top.map((c) => (
              <CompanyCard key={`${c.citySlug}/${c.slug}`} company={c} />
            ))}
          </div>
        </div>
      </section>

      <section className="section faq">
        <div className="container">
          <h2>Vanliga frågor om städfirmor</h2>
          <p className="lead">Det här undrar flest inför att anlita städhjälp.</p>
          {FAQ.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
