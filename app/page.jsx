import Link from "next/link";
import { getCities, getAllCompanies, getTopCompanies, SITE_URL } from "../lib/data.js";
import { SERVICES } from "../lib/services.js";
import { CompanyCard, JsonLd } from "../components/Ui.jsx";
import { ServiceIcon } from "../components/Illustrations.jsx";
import Search from "../components/Search.jsx";
import GeoBanner from "../components/GeoBanner.jsx";

export const metadata = {
  title: "Hitta städfirma i din stad – jämför 600+ städfirmor | Städtorget",
  description:
    "Jämför städfirmor i 45 städer och områden i Sverige. Se Google-omdömen, tjänster, priser och RUT-avdrag. Hitta rätt städhjälp – hemstädning, flyttstädning och kontorsstädning.",
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
    a: "Titta på omdömen från tidigare kunder, kontrollera att företaget har organisationsnummer och F-skatt, fråga om försäkring och kollektivavtal, och jämför alltid minst två offerter. På Städtorget ser du betyg och företagsuppgifter samlade på ett ställe.",
  },
  {
    q: "Är det gratis att använda Städtorget?",
    a: "Ja. Städtorget är en fri katalog – du kontaktar städfirmorna direkt utan mellanhänder, förbindelser eller dolda avgifter.",
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
    name: "Städtorget",
    url: SITE_URL,
  };

  return (
    <div className="theme-pilot">
      <JsonLd data={siteJsonLd} />
      <JsonLd data={faqJsonLd} />

      <section className="hero">
        <div className="container hero-grid">
          <div>
            <GeoBanner cities={cities} />
            <h1>
              Hitta rätt städfirma – <em>utan att leta</em>
            </h1>
            <p className="sub">
              Jämför {companies.length} städfirmor i Sveriges största städer och
              områden. Riktiga omdömen, tydliga tjänster, RUT-avdrag – och du
              kontaktar firmorna direkt, helt gratis.
            </p>
            <Search />
            <div className="hero-stats">
              <div className="hero-stat">
                <strong>{companies.length}</strong>
                <span>städfirmor</span>
              </div>
              <div className="hero-stat">
                <strong>{cities.length}</strong>
                <span>städer & områden</span>
              </div>
              <div className="hero-stat">
                <strong>100 %</strong>
                <span>gratis, inga mellanhänder</span>
              </div>
            </div>
          </div>
          <div className="hero-art">
            <img src="/images/home-hero.png" alt="Städtorget illustration" style={{ width: "100%", height: "auto", borderRadius: "var(--radius)" }} />
          </div>
        </div>
      </section>

      <section className="section" id="tjanster">
        <div className="container">
          <h2>Vad behöver du hjälp med?</h2>
          <p className="lead">
            Välj tjänst för att se firmor, priser och vad som ingår – i just din stad.
          </p>
          <div className="service-grid">
            {SERVICES.map((s) => (
              <Link key={s.slug} href={`/tjanster/${s.slug}/`} className="service-card">
                <div className="icon"><ServiceIcon icon={s.icon} /></div>
                <h3>{s.name}</h3>
                <p>Jämför firmor & priser →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt" id="stader">
        <div className="container">
          <h2>Städfirmor per stad och område</h2>
          <p className="lead">
            Välj din stad eller ditt område för att se alla städfirmor med omdömen,
            tjänster och kontaktuppgifter.
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

      <section className="section">
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

      <section className="section section-alt">
        <div className="container">
          <h2>Så funkar det</h2>
          <p className="lead">Tre steg till ett rent hem – utan formulär och säljsamtal.</p>
          <div className="steps">
            <div className="step">
              <div className="num">1</div>
              <h3>Välj stad eller tjänst</h3>
              <p>
                Börja med din stad eller det du behöver hjälp med – hemstädning,
                flyttstädning, fönsterputs och mer.
              </p>
            </div>
            <div className="step">
              <div className="num">2</div>
              <h3>Jämför omdömen</h3>
              <p>
                Se Google-betyg, tjänster, certifieringar och om firman erbjuder
                RUT-avdrag – allt samlat på ett ställe.
              </p>
            </div>
            <div className="step">
              <div className="num">3</div>
              <h3>Kontakta direkt</h3>
              <p>
                Ring eller mejla firmorna du gillar och jämför offerter. Inga
                mellanhänder, inga dolda avgifter.
              </p>
            </div>
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
    </div>
  );
}
