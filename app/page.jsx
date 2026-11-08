import Link from "next/link";
import { getCities, getAllCompanies, getTopCompanies, formatCompanyLocation, SITE_URL } from "../lib/data.js";
import { SERVICES } from "../lib/services.js";
import { JsonLd } from "../components/Ui.jsx";
import Search from "../components/Search.jsx";
import HomeWall from "../components/HomeWall.jsx";
import Pips from "../components/Pips.jsx";
import Accordion from "../components/Accordion.jsx";

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
  const top = getTopCompanies(5);

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

  const accordionItems = FAQ.map((f) => ({
    question: f.q,
    answer: f.a,
  }));

  return (
    <div>
      <JsonLd data={siteJsonLd} />
      <JsonLd data={faqJsonLd} />

      {/* HERO SECTION */}
      <section
        style={{
          maxWidth: "var(--maxw)",
          margin: "0 auto",
          padding: "24px var(--gutter) 104px",
        }}
      >
        <div className="hero-grid">
          <div>
            <h1
              className="d"
              style={{
                margin: "0 0 32px",
                fontSize: "clamp(44px, 7.8vw, 112px)",
                lineHeight: 0.86,
                letterSpacing: "-0.02em",
              }}
            >
              <span style={{ display: "block" }}>Hitta rätt</span>
              <span style={{ display: "block" }}>städfirma –</span>
              <span style={{ display: "block" }}>nära dig</span>
            </h1>

            <p
              style={{
                margin: "0 0 32px",
                maxWidth: "46ch",
                fontSize: "19px",
                lineHeight: 1.55,
                color: "var(--text-2)",
              }}
            >
              Jämför {companies.length} städfirmor i Sveriges största städer och
              områden. Riktiga omdömen, tydliga tjänster, RUT-avdrag – och du
              kontaktar firmorna direkt, helt gratis.
            </p>

            <Search />

            <p
              style={{
                margin: "40px 0 0",
                maxWidth: "48ch",
                fontSize: "16px",
                lineHeight: 1.5,
                color: "var(--text-3)",
              }}
            >
              Eller välj en kakel i väggen. Större kakel betyder fler firmor. På
              kakeln ser du hur många som erbjuder RUT-avdrag och vilken firma
              som har högst betyg på Google (minst 10 omdömen).{" "}
              <Link
                href="/#stader"
                style={{
                  fontWeight: 600,
                  textDecoration: "underline",
                  textUnderlineOffset: "4px",
                }}
              >
                Se alla 45 orter
              </Link>
            </p>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", width: "100%", minWidth: 0, overflow: "hidden" }}>
            <HomeWall />
          </div>
        </div>
      </section>

      {/* VAD BEHÖVER DU HJÄLP MED? */}
      <section
        id="tjanster"
        style={{
          maxWidth: "var(--maxw)",
          margin: "0 auto",
          padding: "0 var(--gutter) 112px",
        }}
      >
        <h2
          className="d"
          style={{
            margin: "0 0 16px",
            fontSize: "clamp(48px, 6vw, 88px)",
            lineHeight: 0.9,
            letterSpacing: "-0.015em",
          }}
        >
          Vad behöver du hjälp med?
        </h2>
        <p
          style={{
            margin: "0 0 40px",
            maxWidth: "52ch",
            color: "var(--text-2)",
          }}
        >
          Välj tjänst för att se firmor, priser och vad som ingår – i just din
          stad. Priserna är ungefärliga, så be alltid firman om offert.
        </p>

        <div
          style={{
            background: "var(--grout)",
            padding: "6px",
            borderRadius: "var(--r-box)",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          {SERVICES.map((s) => (
            <Link
              key={s.slug}
              href={`/tjanster/${s.slug}/`}
              className="svc-row"
            >
              <span
                className="d"
                style={{
                  fontSize: "clamp(38px, 4.4vw, 60px)",
                  lineHeight: 0.9,
                }}
              >
                {s.name}
              </span>
              <span style={{ fontSize: "16px", color: "var(--text-2)" }}>
                {s.shortDescription || s.intro}
              </span>
              <span
                className="svc-price w"
                style={{
                  fontSize: "15px",
                  fontWeight: 600,
                  textAlign: "right",
                  whiteSpace: "nowrap",
                }}
              >
                {s.priceEstimate}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ALLA 45 STÄDER (#stader) */}
      <section
        id="stader"
        style={{
          maxWidth: "var(--maxw)",
          margin: "0 auto",
          padding: "0 var(--gutter) 112px",
        }}
      >
        <h2
          className="d"
          style={{
            margin: "0 0 16px",
            fontSize: "clamp(48px, 6vw, 88px)",
            lineHeight: 0.9,
            letterSpacing: "-0.015em",
          }}
        >
          Städfirmor per stad och område
        </h2>
        <p
          style={{
            margin: "0 0 40px",
            maxWidth: "52ch",
            color: "var(--text-2)",
          }}
        >
          Välj din stad eller ditt område för att se alla städfirmor med
          omdömen, tjänster och kontaktuppgifter.
        </p>

        <div
          className="cities-grid"
          style={{
            background: "var(--grout)",
            padding: "6px",
            borderRadius: "var(--r-box)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "6px",
          }}
        >
          {cities.map((c) => (
            <Link
              key={c.slug}
              href={`/${c.slug}/`}
              className="city-tile"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "16px 20px",
                background: "var(--white)",
                borderRadius: "var(--r-tile)",
                color: "var(--ink)",
                minHeight: "100px",
                transition: "background-color 0.15s, color 0.15s",
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,.55), inset 0 -3px 0 rgba(14,43,59,.09)",
              }}
            >
              <span className="d" style={{ fontSize: "28px", lineHeight: 1 }}>
                {c.name}
              </span>
              <span className="w" style={{ fontSize: "14px", color: "var(--text-3)" }}>
                {c.count} städfirmor →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* HÖGST BETYG JUST NU (on-dark) */}
      <section
        className="on-dark"
        style={{
          background: "var(--ink)",
          color: "var(--white)",
          padding: "96px 0",
        }}
      >
        <div
          style={{
            maxWidth: "var(--maxw)",
            margin: "0 auto",
            padding: "0 var(--gutter)",
          }}
        >
          <h2
            className="d"
            style={{
              margin: "0 0 16px",
              fontSize: "clamp(48px, 6vw, 88px)",
              lineHeight: 0.9,
              letterSpacing: "-0.015em",
            }}
          >
            Högst betyg just nu
          </h2>
          <p
            style={{
              margin: "0 0 40px",
              maxWidth: "52ch",
              color: "var(--on-dark-2)",
            }}
          >
            Firmor med 5,0 på Google och flest omdömen.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {top.map((c) => {
              const locationStr = formatCompanyLocation(c);
              const ratingNum = c.rating ? c.rating.toFixed(1).replace(".", ",") : "5,0";

              return (
                <Link
                  key={`${c.citySlug}/${c.slug}`}
                  href={`/${c.citySlug}/${c.slug}/`}
                  className="rate-row"
                >
                  <span
                    className="d"
                    style={{
                      fontSize: "clamp(30px, 3vw, 44px)",
                      lineHeight: 0.95,
                    }}
                  >
                    {c.name}
                  </span>
                  <span className="w" style={{ fontSize: "14px" }}>
                    {locationStr}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <Pips rating={c.rating || 5} variant="dark" />
                    <span className="d" style={{ fontSize: "40px", lineHeight: 0.9 }}>
                      {ratingNum}
                    </span>
                  </span>
                  <span className="w" style={{ fontSize: "14px", textAlign: "right" }}>
                    {c.reviews} omdömen
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* SÅ FUNKAR DET */}
      <section
        style={{
          maxWidth: "var(--maxw)",
          margin: "0 auto",
          padding: "112px var(--gutter)",
        }}
      >
        <h2
          className="d"
          style={{
            margin: "0 0 16px",
            fontSize: "clamp(48px, 6vw, 88px)",
            lineHeight: 0.9,
            letterSpacing: "-0.015em",
          }}
        >
          Så funkar det
        </h2>
        <p
          style={{
            margin: "0 0 48px",
            maxWidth: "52ch",
            color: "var(--text-2)",
          }}
        >
          Tre steg. Inga formulär och inga säljsamtal.
        </p>

        <div className="steps-grid">
          <div>
            <div
              className="d"
              style={{
                width: "96px",
                height: "96px",
                borderRadius: "var(--r-logo)",
                background: "var(--sun)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "76px",
                lineHeight: 1,
                marginBottom: "24px",
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,.55), inset 0 -3px 0 rgba(14,43,59,.09)",
              }}
            >
              1
            </div>
            <h3
              className="d"
              style={{
                margin: "0 0 10px",
                fontSize: "36px",
                lineHeight: 0.95,
              }}
            >
              Välj stad eller tjänst
            </h3>
            <p
              style={{
                margin: 0,
                maxWidth: "36ch",
                fontSize: "17px",
                lineHeight: 1.5,
                color: "var(--text-2)",
              }}
            >
              Börja med din stad eller med det du behöver hjälp med, till
              exempel hemstädning, flyttstädning eller fönsterputs.
            </p>
          </div>

          <div>
            <div
              className="d"
              style={{
                width: "96px",
                height: "96px",
                borderRadius: "var(--r-logo)",
                background: "var(--mint)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "76px",
                lineHeight: 1,
                marginBottom: "24px",
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,.55), inset 0 -3px 0 rgba(14,43,59,.09)",
              }}
            >
              2
            </div>
            <h3
              className="d"
              style={{
                margin: "0 0 10px",
                fontSize: "36px",
                lineHeight: 0.95,
              }}
            >
              Jämför omdömen
            </h3>
            <p
              style={{
                margin: 0,
                maxWidth: "36ch",
                fontSize: "17px",
                lineHeight: 1.5,
                color: "var(--text-2)",
              }}
            >
              Se Google-betyg, tjänster och om firman erbjuder RUT-avdrag. Allt
              på samma sida.
            </p>
          </div>

          <div>
            <div
              className="d"
              style={{
                width: "96px",
                height: "96px",
                borderRadius: "var(--r-logo)",
                background: "var(--water)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "76px",
                lineHeight: 1,
                marginBottom: "24px",
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,.55), inset 0 -3px 0 rgba(14,43,59,.09)",
              }}
            >
              3
            </div>
            <h3
              className="d"
              style={{
                margin: "0 0 10px",
                fontSize: "36px",
                lineHeight: 0.95,
              }}
            >
              Kontakta firman direkt
            </h3>
            <p
              style={{
                margin: 0,
                maxWidth: "36ch",
                fontSize: "17px",
                lineHeight: 1.5,
                color: "var(--text-2)",
              }}
            >
              Ring eller mejla de firmor du gillar och jämför offerter. Inga
              mellanhänder och inga dolda avgifter.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section
        style={{
          maxWidth: "var(--maxw)",
          margin: "0 auto",
          padding: "0 var(--gutter) 112px",
        }}
      >
        <div className="faq-layout">
          <div>
            <h2
              className="d"
              style={{
                margin: "0 0 16px",
                fontSize: "clamp(44px, 4.8vw, 68px)",
                lineHeight: 0.9,
                letterSpacing: "-0.015em",
              }}
            >
              Vanliga frågor om städfirmor
            </h2>
            <p
              style={{
                margin: 0,
                maxWidth: "34ch",
                color: "var(--text-2)",
              }}
            >
              Det här undrar flest innan de anlitar städhjälp.
            </p>
          </div>

          <div>
            <Accordion items={accordionItems} />
          </div>
        </div>
      </section>

      <style>{`
        .hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 5fr) minmax(0, 6fr);
          gap: 64px;
          align-items: start;
        }

        .svc-row {
          display: grid;
          grid-template-columns: minmax(0, 1.3fr) minmax(0, 1.1fr) minmax(0, 0.9fr);
          gap: 24px;
          align-items: center;
          padding: 22px 28px;
          background: var(--white);
          border-radius: var(--r-tile);
          color: var(--ink);
          transition: background-color 0.15s;
        }
        .svc-row:hover {
          background: var(--sun) !important;
        }

        .city-tile:hover {
          background: var(--ink) !important;
          color: var(--white) !important;
        }
        .city-tile:hover .w {
          color: var(--on-dark-2) !important;
        }

        .rate-row {
          display: grid;
          grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr) auto auto;
          gap: 24px;
          align-items: center;
          padding: 20px 28px;
          background: var(--ink-2);
          border-radius: var(--r-tile);
          color: var(--white);
          transition: background-color 0.15s, color 0.15s;
        }
        .rate-row:hover {
          background: var(--sun) !important;
          color: var(--ink) !important;
        }
        .rate-row:hover .pip {
          background: var(--ink) !important;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 48px;
        }

        .faq-layout {
          display: grid;
          grid-template-columns: minmax(0, 4fr) minmax(0, 7fr);
          gap: 64px;
          align-items: start;
        }

        @media (max-width: 1180px) {
          .hero-grid {
            grid-template-columns: minmax(0, 1fr);
            gap: 40px;
          }
        }

        @media (max-width: 860px) {
          .svc-row {
            grid-template-columns: minmax(0, 1fr);
            gap: 6px;
          }
          .svc-price {
            text-align: left !important;
          }
          .rate-row {
            grid-template-columns: minmax(0, 1fr) auto;
            gap: 8px 16px;
          }
          .steps-grid {
            grid-template-columns: minmax(0, 1fr);
            gap: 32px;
          }
          .faq-layout {
            grid-template-columns: minmax(0, 1fr);
            gap: 32px;
          }
        }
      `}</style>
    </div>
  );
}
