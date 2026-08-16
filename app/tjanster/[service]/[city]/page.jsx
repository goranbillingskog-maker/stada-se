import Link from "next/link";
import { notFound } from "next/navigation";
import { getCity, SITE_URL } from "../../../../lib/data.js";
import {
  SERVICES,
  getService,
  companiesForService,
  serviceCityCombos,
  citiesForService,
  CITY_COORDS,
} from "../../../../lib/services.js";
import { CompanyCard, Breadcrumbs, JsonLd } from "../../../../components/Ui.jsx";
import serviceCityContent from "../../../../data/service_city_content.json";

export const dynamicParams = false;

export function generateStaticParams() {
  return serviceCityCombos().map((c) => ({ service: c.service, city: c.city }));
}

export async function generateMetadata({ params }) {
  const { service, city } = await params;
  const s = getService(service);
  const cityInfo = getCity(city);
  if (!s || !cityInfo) return {};
  const list = companiesForService(service, city);
  return {
    title: `${s.name} ${cityInfo.name} – jämför ${list.length} städfirmor`,
    description: `${s.name} i ${cityInfo.name}: jämför ${list.length} städfirmor med Google-omdömen, priser och RUT-avdrag. Kontakta firmorna direkt – helt gratis.`,
    alternates: { canonical: `/tjanster/${s.slug}/${cityInfo.slug}/` },
  };
}

function getRelatedLinks(serviceSlug, citySlug) {
  // Find other cities close to this one
  const currentCoords = CITY_COORDS[citySlug];
  const allCitiesWithService = citiesForService(serviceSlug);
  
  let relatedCities = [];
  if (currentCoords) {
    const [lat1, lon1] = currentCoords;
    relatedCities = allCitiesWithService
      .filter((c) => c.slug !== citySlug)
      .map((c) => {
        const coords = CITY_COORDS[c.slug];
        let distance = Infinity;
        if (coords) {
          const [lat2, lon2] = coords;
          distance = Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lon1 - lon2, 2));
        }
        return { ...c, distance };
      })
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 2);
  } else {
    relatedCities = allCitiesWithService
      .filter((c) => c.slug !== citySlug)
      .slice(0, 2);
  }

  // Find another service in this city
  const relatedService = SERVICES.find((s) => {
    if (s.slug === serviceSlug) return false;
    return companiesForService(s.slug, citySlug).length > 0;
  });

  return { relatedCities, relatedService };
}

export default async function ServiceCityPage({ params }) {
  const { service, city } = await params;
  const s = getService(service);
  const cityInfo = getCity(city);
  if (!s || !cityInfo) notFound();

  const companies = companiesForService(service, city);
  if (!companies.length) notFound();
  const withRut = companies.filter((c) => c.rutAvdrag === "Ja").length;
  const rated = companies.filter((c) => c.rating);
  const avg =
    rated.length > 0
      ? (rated.reduce((a, c) => a + c.rating, 0) / rated.length).toFixed(1).replace(".", ",")
      : null;

  const isB2B = ["kontorsstadning", "byggstadning", "trappstadning"].includes(s.slug);

  // Load custom content if it exists
  const contentKey = `${s.slug}/${cityInfo.slug}`;
  const customContent = serviceCityContent[contentKey] || null;

  const replacePlaceholders = (text) => {
    if (!text) return "";
    return text
      .replaceAll("[ANTAL FÖRETAG]", companies.length)
      .replaceAll("[BETYG]", avg || "[VÄRDE SAKNAS]");
  };

  const introText = customContent
    ? replacePlaceholders(customContent.introtext)
    : `${s.intro} I ${cityInfo.name} listar vi ${companies.length} städfirmor som erbjuder ${s.name.toLowerCase()}${avg ? `, med ett genomsnittligt betyg på ${avg} av 5` : ""}.${withRut && !isB2B ? ` ${withRut} av dem erbjuder RUT-avdrag.` : ""} Jämför och kontakta firmorna direkt nedan.`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${s.name} i ${cityInfo.name}`,
    numberOfItems: companies.length,
    itemListElement: companies.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      url: `${SITE_URL}/${c.citySlug}/${c.slug}/`,
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Hem", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: s.name, item: `${SITE_URL}/tjanster/${s.slug}/` },
      {
        "@type": "ListItem",
        position: 3,
        name: `${s.name} ${cityInfo.name}`,
        item: `${SITE_URL}/tjanster/${s.slug}/${cityInfo.slug}/`,
      },
    ],
  };

  // Generate FAQ schema if custom content has FAQs
  const faqJsonLd = customContent && customContent.faq && customContent.faq.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: customContent.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  } : null;

  const { relatedCities, relatedService } = getRelatedLinks(s.slug, cityInfo.slug);

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      {faqJsonLd && <JsonLd data={faqJsonLd} />}
      <Breadcrumbs
        items={[
          { label: "Hem", href: "/" },
          { label: s.name, href: `/tjanster/${s.slug}/` },
          { label: cityInfo.name },
        ]}
      />
      <section className="section" style={{ paddingTop: 24 }}>
        <div className="container">
          <h1>
            {s.name} i {cityInfo.name}
          </h1>

          {customContent ? (
            <div className="two-col" style={{ padding: "16px 0" }}>
              <div>
                <p className="lead" style={{ marginBottom: 24 }}>
                  {introText}
                </p>

                <div className="company-list" style={{ marginBottom: 32 }}>
                  {companies.map((c) => (
                    <CompanyCard key={c.slug} company={c} hideRut={isB2B} />
                  ))}
                </div>

                {customContent.faq && customContent.faq.length > 0 && (
                  <section className="faq" style={{ marginTop: 40, marginBottom: 32 }}>
                    <h2>Vanliga frågor om {s.name.toLowerCase()} i {cityInfo.name}</h2>
                    {customContent.faq.map((f, index) => (
                      <details key={index}>
                        <summary>{f.q}</summary>
                        <p>{f.a}</p>
                      </details>
                    ))}
                  </section>
                )}

                <div className="panel" style={{ marginTop: 24, padding: "20px 24px" }}>
                  <h3 style={{ fontSize: "1.15rem", margin: "0 0 10px" }}>Relaterade städtjänster</h3>
                  <p style={{ margin: "0 0 10px", fontSize: "0.9rem" }}>
                    Hitta även {s.name.toLowerCase()} i:{" "}
                    {relatedCities.map((rc, idx) => (
                      <span key={rc.slug}>
                        {idx > 0 ? ", " : ""}
                        <Link href={`/tjanster/${s.slug}/${rc.slug}/`}>{rc.name}</Link>
                      </span>
                    ))}
                  </p>
                  {relatedService ? (
                    <p style={{ margin: 0, fontSize: "0.9rem" }}>
                      Behöver du andra städtjänster i {cityInfo.name}? Jämför även{" "}
                      <Link href={`/tjanster/${relatedService.slug}/${cityInfo.slug}/`}>
                        {relatedService.name.toLowerCase()} i {cityInfo.name}
                      </Link>.
                    </p>
                  ) : null}
                </div>
              </div>

              <aside style={{ marginTop: 0 }}>
                {customContent.faktaruta && (
                  <section className="panel" style={{ background: "var(--card)" }}>
                    <h2>{customContent.faktaruta.title}</h2>
                    <p style={{ fontSize: "0.95rem", lineHeight: "1.5" }}>{customContent.faktaruta.text}</p>
                  </section>
                )}
              </aside>
            </div>
          ) : (
            <>
              <p className="lead">
                {introText}
              </p>
              <div className="company-list">
                {companies.map((c) => (
                  <CompanyCard key={c.slug} company={c} hideRut={isB2B} />
                ))}
              </div>
              <p className="small-print">
                Se även{" "}
                <Link href={`/${cityInfo.slug}/`}>alla städfirmor i {cityInfo.name}</Link>{" "}
                eller <Link href={`/tjanster/${s.slug}/`}>{s.name.toLowerCase()} i andra städer</Link>.
              </p>
            </>
          )}
        </div>
      </section>
    </>
  );
}

