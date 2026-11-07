import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCities,
  getCity,
  getCompaniesByCity,
  STOCKHOLM_DISTRICTS,
  SITE_URL,
  placePreposition,
} from "../../lib/data.js";
import { SERVICES, companiesForService } from "../../lib/services.js";
import CompanyCard from "../../components/CompanyCard.jsx";
import Breadcrumbs from "../../components/Breadcrumbs.jsx";
import Accordion from "../../components/Accordion.jsx";
import { JsonLd } from "../../components/Ui.jsx";
import cityContent from "../../data/city_content.json";

export const dynamicParams = false;

export function generateStaticParams() {
  return getCities().map((c) => ({ city: c.slug }));
}

const OTHER_CITY_COLORS = [
  "#FFC933", // sun
  "#C4E6DA", // mint
  "#9CCBE4", // water
  "#E1ECE9", // pale
  "#E1ECE9", // pale
  "#9CCBE4", // water
  "#C4E6DA", // mint
];

export async function generateMetadata({ params }) {
  const { city } = await params;
  const cityInfo = getCity(city);
  if (!cityInfo) return {};
  const custom = cityContent[cityInfo.slug] || null;
  const companies = getCompaniesByCity(city);
  const rated = companies.filter((c) => c.rating);
  const avg =
    rated.length > 0
      ? (rated.reduce((a, c) => a + c.rating, 0) / rated.length).toFixed(1).replace(".", ",")
      : null;

  const replacePlaceholders = (text) => {
    if (!text) return "";
    return text
      .replaceAll("[ANTAL FÖRETAG]", companies.length)
      .replaceAll("[BETYG]", avg || "[VÄRDE SAKNAS]");
  };

  const prep = placePreposition(cityInfo.slug);
  const title = custom?.title
    ? replacePlaceholders(custom.title)
    : `Städfirma ${cityInfo.name} – jämför ${companies.length} städfirmor med omdömen`;
  const description = custom?.description
    ? replacePlaceholders(custom.description)
    : `Hitta städfirma ${prep} ${cityInfo.name}. Jämför ${companies.length} städfirmor med Google-omdömen, tjänster, RUT-avdrag och kontaktuppgifter. Hemstädning, flyttstädning och kontorsstädning ${prep} ${cityInfo.name}.`;

  return {
    title,
    description,
    alternates: { canonical: `/${cityInfo.slug}/` },
  };
}

export default async function CityPage({ params }) {
  const { city } = await params;
  const cityInfo = getCity(city);
  if (!cityInfo) notFound();

  const companies = getCompaniesByCity(city);
  const withRut = companies.filter((c) => c.rutAvdrag === "Ja").length;
  const serviceChips = SERVICES.map((s) => ({
    ...s,
    count: companiesForService(s.slug, city).length,
  }))
    .filter((s) => s.count > 0)
    .sort((a, b) => b.count - a.count);

  const rated = companies.filter((c) => c.rating);
  const avg =
    rated.length > 0
      ? (rated.reduce((a, c) => a + c.rating, 0) / rated.length).toFixed(1).replace(".", ",")
      : null;

  const custom = cityContent[cityInfo.slug] || null;
  const isStockholmDistrict = STOCKHOLM_DISTRICTS.some((d) => d.slug === cityInfo.slug);
  const isStockholmMain = cityInfo.slug === "stockholm";

  const replacePlaceholders = (text) => {
    if (!text) return "";
    return text
      .replaceAll("[ANTAL FÖRETAG]", companies.length)
      .replaceAll("[BETYG]", avg || "[VÄRDE SAKNAS]");
  };

  const prep = placePreposition(cityInfo.slug);

  const introText = custom
    ? replacePlaceholders(custom.introtext)
    : `Här hittar du ${companies.length} städfirmor ${prep} ${cityInfo.name}${
        cityInfo.avgRating
          ? `, med ett genomsnittligt Google-betyg på ${String(cityInfo.avgRating).replace(".", ",")} av 5`
          : ""
      }. 24 av firmorna erbjuder RUT-avdrag, som halverar arbetskostnaden för dig som privatperson. Jämför betyg och tjänster och kontakta firmorna direkt, helt gratis.`;

  // Live intro fallback matching the live text:
  const liveIntroText = custom
    ? replacePlaceholders(custom.introtext)
    : `Här hittar du ${companies.length} städfirmor ${prep} ${cityInfo.name}${
        cityInfo.avgRating
          ? `, med ett genomsnittligt Google-betyg på ${String(cityInfo.avgRating).replace(".", ",")} av 5`
          : ""
      }. ${
        withRut
          ? `${withRut} av firmorna erbjuder RUT-avdrag, vilket halverar arbetskostnaden för dig som privatperson.`
          : ""
      } Jämför betyg och tjänster nedan och kontakta firmorna direkt – helt gratis.`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Städfirmor ${prep} ${cityInfo.name}`,
    numberOfItems: companies.length,
    itemListElement: companies.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      url: `${SITE_URL}/${c.citySlug}/${c.slug}/`,
    })),
  };

  const breadcrumbItems = isStockholmDistrict
    ? [
        { label: "Hem", href: "/" },
        { label: "Stockholm", href: "/stockholm/" },
        { label: `Städfirmor ${prep} ${cityInfo.name}` },
      ]
    : [
        { label: "Hem", href: "/" },
        { label: `Städfirmor ${prep} ${cityInfo.name}` },
      ];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: isStockholmDistrict
      ? [
          { "@type": "ListItem", position: 1, name: "Hem", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Stockholm", item: `${SITE_URL}/stockholm/` },
          {
            "@type": "ListItem",
            position: 3,
            name: `Städfirmor ${prep} ${cityInfo.name}`,
            item: `${SITE_URL}/${cityInfo.slug}/`,
          },
        ]
      : [
          { "@type": "ListItem", position: 1, name: "Hem", item: SITE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: `Städfirmor ${prep} ${cityInfo.name}`,
            item: `${SITE_URL}/${cityInfo.slug}/`,
          },
        ],
  };

  const faqJsonLd =
    custom && custom.faq && custom.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: custom.faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }
      : null;

  const allCities = getCities();
  const otherCities = allCities
    .filter((c) => c.slug !== cityInfo.slug)
    .sort((a, b) => b.count - a.count)
    .slice(0, 7);

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      {faqJsonLd && <JsonLd data={faqJsonLd} />}

      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "8px clamp(16px, 4vw, 32px) 80px" }}>
        <Breadcrumbs items={breadcrumbItems} />
        <div className="hero2">
          <div>
            <h1 className="d" style={{ margin: "0 0 32px", fontSize: "clamp(64px, 8.6vw, 128px)", lineHeight: 0.86, letterSpacing: "-0.02em" }}>
              <span style={{ display: "block" }}>Städfirmor</span>
              <span style={{ display: "block" }}>{prep} {cityInfo.name}</span>
            </h1>
            <p style={{ margin: 0, maxWidth: "52ch", fontSize: "19px", color: "var(--text-2)" }}>
              {liveIntroText}
            </p>
          </div>
          <div className="stats">
            <div className="stat stat--wide" style={{ background: "var(--sun)" }}>
              <span className="stat-num d">{companies.length}</span>
              <span className="stat-label w">städfirmor {prep} {cityInfo.name}</span>
            </div>
            {avg ? (
              <div className="stat" style={{ background: "var(--mint)" }}>
                <span className="stat-num d">{avg}</span>
                <span className="stat-label w">i snittbetyg på Google, av 5</span>
              </div>
            ) : null}
            <div className={`stat ${avg ? "" : "stat--wide"}`.trim()} style={{ background: "var(--water)" }}>
              <span className="stat-num d">{withRut}</span>
              <span className="stat-label w">firmor med RUT-avdrag</span>
            </div>
          </div>
        </div>
      </section>

      {serviceChips.length > 0 && (
        <section style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(16px, 4vw, 32px) 56px" }}>
          <h2 className="d" style={{ margin: "0 0 24px", fontSize: "clamp(40px, 4.4vw, 64px)", lineHeight: 0.9, letterSpacing: "-0.015em" }}>
            Vad behöver du städat {prep} {cityInfo.name}?
          </h2>
          <div className="chips">
            <a className="chip chip--on" href={`/${cityInfo.slug}/`}>
              <span className="d" style={{ fontSize: 28, lineHeight: 1 }}>Alla tjänster</span>
              <span className="w" style={{ fontSize: 14, fontWeight: 600 }}>{companies.length}</span>
            </a>
            {serviceChips.map((s) => (
              <Link key={s.slug} className="chip" href={`/tjanster/${s.slug}/${cityInfo.slug}/`}>
                <span className="d" style={{ fontSize: 28, lineHeight: 1 }}>{s.name}</span>
                <span className="w" style={{ fontSize: 14 }}>{s.count}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(16px, 4vw, 32px) 112px" }}>
        <p className="w" style={{ margin: "0 0 16px", fontSize: 14, color: "var(--text-3)" }}>
          Listan sorteras efter Google-betyg.
        </p>
        <div style={{ background: "var(--grout)", padding: 6, borderRadius: 12, display: "flex", flexDirection: "column", gap: 6 }}>
          {companies.map((c) => (
            <CompanyCard key={c.slug} company={c} />
          ))}
        </div>

        {custom?.faq && custom.faq.length > 0 && (
          <div style={{ marginTop: 64, display: "grid", gridTemplateColumns: "minmax(0, 4fr) minmax(0, 7fr)", gap: 48 }}>
            <h2 className="d" style={{ margin: 0, fontSize: "clamp(36px, 4vw, 56px)", lineHeight: 0.95, letterSpacing: "-0.015em" }}>
              Vanliga frågor om städfirmor {prep} {cityInfo.name}
            </h2>
            <Accordion items={custom.faq.map((f) => ({ question: f.q, answer: f.a }))} />
          </div>
        )}

        {custom?.faktaruta && (
          <div style={{ marginTop: 40, background: "var(--mint)", borderRadius: "var(--r-box)", padding: "28px 32px", color: "var(--ink)" }}>
            <h2 className="d" style={{ margin: "0 0 12px", fontSize: "clamp(28px, 3vw, 36px)" }}>{custom.faktaruta.title}</h2>
            <p className="w" style={{ margin: 0, fontSize: 16, lineHeight: 1.6 }}>{custom.faktaruta.text}</p>
          </div>
        )}

        {isStockholmDistrict && (
          <div style={{ marginTop: 40, background: "var(--white)", borderRadius: "var(--r-tile)", padding: "24px 28px", border: "1px solid var(--grout)" }}>
            <h3 className="d" style={{ fontSize: 24, margin: "0 0 10px" }}>
              Städfirmor i hela Stockholm
            </h3>
            <p className="w" style={{ margin: "0 0 14px", fontSize: 15, color: "var(--text-2)" }}>
              Behöver du städhjälp i andra delar av länet? Se{" "}
              <Link href="/stockholm/" style={{ textDecoration: "underline", fontWeight: 600 }}>alla städfirmor i Stockholm</Link> eller utforska närliggande stadsdelar:
            </p>
            <div className="chips">
              {STOCKHOLM_DISTRICTS.filter((d) => d.slug !== cityInfo.slug)
                .slice(0, 6)
                .map((d) => (
                  <Link key={d.slug} className="chip" href={`/${d.slug}/`}>
                    <span className="d" style={{ fontSize: 18 }}>{d.name}</span>
                  </Link>
                ))}
            </div>
          </div>
        )}

        {isStockholmMain && (
          <div style={{ margin: "48px 0 32px" }}>
            <h2 className="d" style={{ fontSize: "clamp(32px, 3.5vw, 48px)", margin: "0 0 12px" }}>
              Städfirmor i Stockholms stadsdelar och förorter
            </h2>
            <p className="w" style={{ fontSize: 16, color: "var(--text-3)", marginBottom: 24 }}>
              Hitta och jämför lokala städföretag i specifika delar av Stockholm:
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
              {STOCKHOLM_DISTRICTS.map((d) => {
                const dCompanies = getCompaniesByCity(d.slug);
                const dPrep = placePreposition(d.slug);
                return (
                  <div
                    key={d.slug}
                    style={{
                      padding: "16px 20px",
                      background: "var(--white)",
                      borderRadius: "var(--r-tile)",
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                      border: "1px solid var(--grout)",
                    }}
                  >
                    <Link
                      href={`/${d.slug}/`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        fontWeight: 700,
                        fontSize: "1.05rem",
                      }}
                    >
                      <span>Städfirmor {dPrep} {d.name}</span>
                      <span className="w" style={{ fontSize: "0.85rem", color: "var(--text-3)", fontWeight: 400 }}>
                        {dCompanies.length} st →
                      </span>
                    </Link>
                    <div className="w" style={{ fontSize: "0.85rem", color: "var(--text-3)", display: "flex", flexWrap: "wrap", gap: 8 }}>
                      <Link href={`/tjanster/flyttstadning/${d.slug}/`} style={{ textDecoration: "underline" }}>
                        Flyttstädning {dPrep} {d.name}
                      </Link>
                      <span>·</span>
                      <Link href={`/tjanster/hemstadning/${d.slug}/`} style={{ textDecoration: "underline" }}>
                        Hemstädning {dPrep} {d.name}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      <section className="on-dark" style={{ background: "var(--ink)", color: "var(--white)", padding: "96px 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(16px, 4vw, 32px)" }}>
          <h2 className="d" style={{ margin: "0 0 16px", fontSize: "clamp(48px, 6vw, 88px)", lineHeight: 0.9, letterSpacing: "-0.015em" }}>
            Städfirmor i andra städer
          </h2>
          <p style={{ margin: "0 0 40px", maxWidth: "52ch", color: "var(--on-dark-2)" }}>
            Bor du någon annanstans? Välj din stad.
          </p>
          <div className="cities">
            {otherCities.map((c, i) => (
              <Link
                key={c.slug}
                className="city"
                href={`/${c.slug}/`}
                style={{ background: OTHER_CITY_COLORS[i % OTHER_CITY_COLORS.length] }}
              >
                <span className="d" style={{ fontSize: 40, lineHeight: 0.95 }}>{c.name}</span>
                <span className="w" style={{ fontSize: 13 }}>{c.count} firmor</span>
              </Link>
            ))}
            <Link className="city" href="/#stader" style={{ background: "var(--white)" }}>
              <span className="d" style={{ fontSize: 40, lineHeight: 0.95 }}>Alla 45 orter</span>
              <span className="w" style={{ fontSize: 13 }}>Se hela listan</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
