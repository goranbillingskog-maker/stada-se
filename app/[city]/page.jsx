import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCities,
  getCity,
  getCompaniesByCity,
  topServicesInCity,
  STOCKHOLM_DISTRICTS,
  SITE_URL,
  placePreposition,
} from "../../lib/data.js";
import { SERVICES, companiesForService } from "../../lib/services.js";
import { CompanyCard, Breadcrumbs, JsonLd } from "../../components/Ui.jsx";
import cityContent from "../../data/city_content.json";

export const dynamicParams = false;

export function generateStaticParams() {
  return getCities().map((c) => ({ city: c.slug }));
}

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
  const topServices = topServicesInCity(city, 5);
  const withRut = companies.filter((c) => c.rutAvdrag === "Ja").length;
  const photos = companies.filter((c) => c.photo).slice(0, 3);
  const serviceChips = SERVICES.map((s) => ({
    ...s,
    count: companiesForService(s.slug, city).length,
  })).filter((s) => s.count > 0);

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
      }. ${
        topServices.length
          ? `Vanligaste tjänsterna är ${topServices
              .map((s) => s.name.toLowerCase())
              .slice(0, 3)
              .join(", ")}.`
          : ""
      } ${
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

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      {faqJsonLd && <JsonLd data={faqJsonLd} />}
      <Breadcrumbs items={breadcrumbItems} />
      <section className="section" style={{ paddingTop: 24 }}>
        <div className="container">
          <h1>Städfirmor {prep} {cityInfo.name}</h1>

          {custom ? (
            <div className="two-col" style={{ padding: "16px 0" }}>
              <div>
                <p className="lead" style={{ marginBottom: 24 }}>
                  {introText}
                </p>

                {serviceChips.length ? (
                  <div className="chip-row" style={{ marginBottom: 24 }}>
                    {serviceChips.map((s) => (
                      <Link key={s.slug} className="chip" href={`/tjanster/${s.slug}/${cityInfo.slug}/`}>
                        {s.name} <span className="n">({s.count})</span>
                      </Link>
                    ))}
                  </div>
                ) : null}

                {photos.length >= 2 ? (
                  <div className="photo-strip" style={{ marginBottom: 24 }}>
                    {photos.map((c) => (
                      <img key={c.slug} src={c.photo} alt={`${c.name} ${prep} ${cityInfo.name}`} loading="lazy" />
                    ))}
                  </div>
                ) : null}

                <div className="company-list" style={{ marginBottom: 32 }}>
                  {companies.map((c) => (
                    <CompanyCard key={c.slug} company={c} />
                  ))}
                </div>

                {custom.faq && custom.faq.length > 0 && (
                  <section className="faq" style={{ marginTop: 40, marginBottom: 32 }}>
                    <h2>Vanliga frågor om städfirmor {prep} {cityInfo.name}</h2>
                    {custom.faq.map((f, index) => (
                      <details key={index}>
                        <summary>{f.q}</summary>
                        <p>{f.a}</p>
                      </details>
                    ))}
                  </section>
                )}

                {isStockholmDistrict && (
                  <div className="panel" style={{ marginTop: 24, padding: "20px 24px" }}>
                    <h3 style={{ fontSize: "1.15rem", margin: "0 0 10px" }}>
                      Städfirmor i hela Stockholm
                    </h3>
                    <p style={{ margin: "0 0 10px", fontSize: "0.9rem" }}>
                      Behöver du städhjälp i andra delar av länet? Se{" "}
                      <Link href="/stockholm/">alla städfirmor i Stockholm</Link> eller utforska närliggande stadsdelar:{" "}
                      {STOCKHOLM_DISTRICTS.filter((d) => d.slug !== cityInfo.slug)
                        .slice(0, 4)
                        .map((d, idx) => (
                          <span key={d.slug}>
                            {idx > 0 ? ", " : ""}
                            <Link href={`/${d.slug}/`}>{d.name}</Link>
                          </span>
                        ))}
                      .
                    </p>
                  </div>
                )}
              </div>

              <aside style={{ marginTop: 0 }}>
                {custom.faktaruta && (
                  <section className="panel" style={{ background: "var(--card)" }}>
                    <h2>{custom.faktaruta.title}</h2>
                    <p style={{ fontSize: "0.95rem", lineHeight: "1.5" }}>{custom.faktaruta.text}</p>
                  </section>
                )}
              </aside>
            </div>
          ) : (
            <>
              <p className="lead">{introText}</p>

              {isStockholmMain && (
                <div
                  className="panel"
                  style={{
                    margin: "24px 0 32px",
                    padding: "24px 28px",
                    background: "var(--card)",
                  }}
                >
                  <h2 style={{ fontSize: "1.25rem", marginTop: 0, marginBottom: 8 }}>
                    Städfirmor i Stockholms stadsdelar och förorter
                  </h2>
                  <p style={{ fontSize: "0.95rem", color: "var(--muted)", marginBottom: 16 }}>
                    Hitta och jämför lokala städföretag i specifika delar av Stockholm:
                  </p>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                      gap: 14,
                    }}
                  >
                    {STOCKHOLM_DISTRICTS.map((d) => {
                      const dCompanies = getCompaniesByCity(d.slug);
                      const dPrep = placePreposition(d.slug);
                      return (
                        <div
                          key={d.slug}
                          style={{
                            padding: "14px 16px",
                            background: "var(--bg)",
                            borderRadius: 8,
                            border: "1px solid var(--border)",
                            display: "flex",
                            flexDirection: "column",
                            gap: 8,
                          }}
                        >
                          <Link
                            href={`/${d.slug}/`}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              fontWeight: 600,
                              fontSize: "1rem",
                              textDecoration: "none",
                              color: "inherit",
                            }}
                          >
                            <span>Städfirmor {dPrep} {d.name}</span>
                            <span style={{ fontSize: "0.85rem", color: "var(--muted)", fontWeight: 400 }}>
                              {dCompanies.length} st →
                            </span>
                          </Link>
                          <div style={{ fontSize: "0.85rem", color: "var(--muted)", display: "flex", flexWrap: "wrap", gap: 8 }}>
                            <Link
                              href={`/tjanster/flyttstadning/${d.slug}/`}
                              style={{ color: "var(--primary, #0284c7)", textDecoration: "none" }}
                            >
                              Flyttstädning {dPrep} {d.name}
                            </Link>
                            <span>·</span>
                            <Link
                              href={`/tjanster/hemstadning/${d.slug}/`}
                              style={{ color: "var(--primary, #0284c7)", textDecoration: "none" }}
                            >
                              Hemstädning {dPrep} {d.name}
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {serviceChips.length ? (
                <div className="chip-row">
                  {serviceChips.map((s) => (
                    <Link key={s.slug} className="chip" href={`/tjanster/${s.slug}/${cityInfo.slug}/`}>
                      {s.name} <span className="n">({s.count})</span>
                    </Link>
                  ))}
                </div>
              ) : null}

              {photos.length >= 2 ? (
                <div className="photo-strip">
                  {photos.map((c) => (
                    <img key={c.slug} src={c.photo} alt={`${c.name} ${prep} ${cityInfo.name}`} loading="lazy" />
                  ))}
                </div>
              ) : null}

              <div className="company-list">
                {companies.map((c) => (
                  <CompanyCard key={c.slug} company={c} />
                ))}
              </div>
              <p className="small-print">
                Listan sorteras efter Google-betyg. Uppgifterna kommer från offentliga
                källor och företagens egna webbplatser.
              </p>
            </>
          )}
        </div>
      </section>
    </>
  );
}
