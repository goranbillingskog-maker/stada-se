import Link from "next/link";
import { notFound } from "next/navigation";
import { getCity, SITE_URL, placePreposition } from "../../../../lib/data.js";
import {
  SERVICES,
  getService,
  companiesForService,
  serviceCityCombos,
  citiesForService,
  CITY_COORDS,
} from "../../../../lib/services.js";
import { CompanyCard, Breadcrumbs, JsonLd } from "../../../../components/Ui.jsx";
import { ServiceIcon } from "../../../../components/Illustrations.jsx";
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
  const isB2B = ["kontorsstadning", "byggstadning", "trappstadning"].includes(service);
  const contentKey = `${s.slug}/${cityInfo.slug}`;
  const customContent = serviceCityContent[contentKey] || null;
  const prep = placePreposition(cityInfo.slug);

  const rated = list.filter((c) => c.rating);
  const avg =
    rated.length > 0
      ? (rated.reduce((a, c) => a + c.rating, 0) / rated.length).toFixed(1).replace(".", ",")
      : null;

  const replacePlaceholders = (text) => {
    if (!text) return "";
    return text
      .replaceAll("[ANTAL FÖRETAG]", list.length)
      .replaceAll("[BETYG]", avg || "[VÄRDE SAKNAS]");
  };

  const title = customContent?.title
    ? replacePlaceholders(customContent.title)
    : `${s.name} ${prep} ${cityInfo.name} – jämför ${list.length} städfirmor`;

  const description = customContent?.description
    ? replacePlaceholders(customContent.description)
    : isB2B
    ? `${s.name} ${prep} ${cityInfo.name}: jämför ${list.length} städfirmor med Google-omdömen och priser. Kontakta firmorna direkt – helt gratis.`
    : `${s.name} ${prep} ${cityInfo.name}: jämför ${list.length} städfirmor med Google-omdömen, priser och RUT-avdrag. Kontakta firmorna direkt – helt gratis.`;

  return {
    title,
    description,
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
  const prep = placePreposition(cityInfo.slug);

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
    : `${s.intro} ${prep.charAt(0).toUpperCase() + prep.slice(1)} ${cityInfo.name} listar vi ${companies.length} städfirmor som erbjuder ${s.name.toLowerCase()}${avg ? `, med ett genomsnittligt betyg på ${avg} av 5` : ""}.${withRut && !isB2B ? ` ${withRut} av dem erbjuder RUT-avdrag.` : ""} Jämför och kontakta firmorna direkt nedan.`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${s.name} ${prep} ${cityInfo.name}`,
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
        name: `${s.name} ${prep} ${cityInfo.name}`,
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

  const isPilot = s.slug === "hemstadning" && cityInfo.slug === "stockholm";

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      {faqJsonLd && <JsonLd data={faqJsonLd} />}

      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "8px clamp(16px, 4vw, 32px) 80px" }}>
        <Breadcrumbs
          items={[
            { label: "Hem", href: "/" },
            { label: s.name, href: `/tjanster/${s.slug}/` },
            { label: cityInfo.name },
          ]}
        />
        <div style={{ maxWidth: "800px", marginBottom: 32 }}>
          <h1
            className="d"
            style={{
              margin: "0 0 20px",
              fontSize: "clamp(56px, 8vw, 110px)",
              lineHeight: 0.88,
              letterSpacing: "-0.02em",
            }}
          >
            {s.name} {prep} {cityInfo.name}
          </h1>
          <p style={{ margin: 0, fontSize: 19, color: "var(--text-2)" }}>
            {introText}
          </p>
        </div>

        <p className="w" style={{ margin: "0 0 16px", fontSize: 14, color: "var(--text-3)" }}>
          Listan sorteras efter Google-betyg.
        </p>
        <div style={{ background: "var(--grout)", padding: 6, borderRadius: 12, display: "flex", flexDirection: "column", gap: 6, marginBottom: 40 }}>
          {companies.map((c) => (
            <CompanyCard key={c.slug} company={c} hideRut={isB2B} />
          ))}
        </div>

        {s.slug === "flyttstadning" && cityInfo.slug === "sodermalm" && (
          <p style={{ marginTop: -16, marginBottom: 32, fontSize: "0.95rem", color: "var(--text-3)" }}>
            Fler städfirmor som utför flyttstädning på Södermalm tillkommer löpande. Se även alla{" "}
            <Link href="/sodermalm/" style={{ textDecoration: "underline" }}>städfirmor på Södermalm</Link>.
          </p>
        )}

        {customContent?.faq && customContent.faq.length > 0 && (
          <div style={{ marginTop: 64, marginBottom: 40, display: "grid", gridTemplateColumns: "minmax(0, 4fr) minmax(0, 7fr)", gap: 48 }}>
            <h2 className="d" style={{ margin: 0, fontSize: "clamp(36px, 4vw, 56px)", lineHeight: 0.95, letterSpacing: "-0.015em" }}>
              Vanliga frågor om {s.name.toLowerCase()} {prep} {cityInfo.name}
            </h2>
            <div style={{ background: "var(--grout)", padding: 6, borderRadius: 12, display: "flex", flexDirection: "column", gap: 6 }}>
              {customContent.faq.map((f, index) => (
                <details key={index} style={{ background: "var(--white)", borderRadius: "var(--r-tile)", padding: "20px 24px" }}>
                  <summary style={{ fontWeight: 700, cursor: "pointer", fontSize: 17 }}>{f.q}</summary>
                  <p style={{ margin: "12px 0 0", color: "var(--text-2)", fontSize: 16, lineHeight: 1.6 }}>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        )}

        {customContent?.faktaruta && (
          <div style={{ marginTop: 32, marginBottom: 40, background: "var(--mint)", borderRadius: "var(--r-box)", padding: "28px 32px", color: "var(--ink)" }}>
            <h2 className="d" style={{ margin: "0 0 12px", fontSize: "clamp(28px, 3vw, 36px)" }}>{customContent.faktaruta.title}</h2>
            <p className="w" style={{ margin: 0, fontSize: 16, lineHeight: 1.6 }}>{customContent.faktaruta.text}</p>
          </div>
        )}

        <div style={{ marginTop: 40, background: "var(--white)", borderRadius: "var(--r-tile)", padding: "24px 28px", border: "1px solid var(--grout)" }}>
          <h3 className="d" style={{ fontSize: 24, margin: "0 0 10px" }}>Relaterade städtjänster</h3>
          <p className="w" style={{ margin: "0 0 14px", fontSize: 15, color: "var(--text-2)" }}>
            Hitta även {s.name.toLowerCase()} i:{" "}
            {relatedCities.map((rc, idx) => (
              <span key={rc.slug}>
                {idx > 0 ? ", " : ""}
                <Link href={`/tjanster/${s.slug}/${rc.slug}/`} style={{ textDecoration: "underline" }}>{rc.name}</Link>
              </span>
            ))}
          </p>
          {relatedService ? (
            <p className="w" style={{ margin: 0, fontSize: 15, color: "var(--text-2)" }}>
              Behöver du andra städtjänster {prep} {cityInfo.name}? Jämför även{" "}
              <Link href={`/tjanster/${relatedService.slug}/${cityInfo.slug}/`} style={{ textDecoration: "underline" }}>
                {relatedService.name.toLowerCase()} {prep} {cityInfo.name}
              </Link>.
            </p>
          ) : null}
        </div>

        <p className="w" style={{ margin: "32px 0 0", fontSize: 14, color: "var(--text-3)" }}>
          Se även{" "}
          <Link href={`/${cityInfo.slug}/`} style={{ textDecoration: "underline" }}>alla städfirmor {prep} {cityInfo.name}</Link>{" "}
          eller <Link href={`/tjanster/${s.slug}/`} style={{ textDecoration: "underline" }}>{s.name.toLowerCase()} i andra städer</Link>.
        </p>
      </section>
    </>
  );
}


