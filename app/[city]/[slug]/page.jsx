import { notFound } from "next/navigation";
import {
  getAllCompanies,
  getCompany,
  getCity,
  SITE_URL,
  placePreposition,
  formatCompanyLocation,
  formatCompanyAddressSchema,
} from "../../../lib/data.js";
import { Avatar, Rating, Breadcrumbs, JsonLd } from "../../../components/Ui.jsx";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllCompanies().map((c) => ({ city: c.citySlug, slug: c.slug }));
}

export async function generateMetadata({ params }) {
  const { city, slug } = await params;
  const c = getCompany(city, slug);
  if (!c) return {};
  const ratingPart = c.rating
    ? ` Betyg ${c.rating.toFixed(1).replace(".", ",")}/5 (${c.reviews ?? 0} omdömen).`
    : "";
  const prep = placePreposition(c.citySlug);
  const loc = formatCompanyLocation(c);
  return {
    title: `${c.name} – Städfirma ${prep} ${c.city}`,
    description: `${c.name} (${loc}): ${c.services
      .slice(0, 4)
      .join(", ")}.${ratingPart} Se tjänster, RUT-avdrag och kontaktuppgifter.`,
    alternates: { canonical: `/${c.citySlug}/${c.slug}/` },
  };
}

function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <tr>
      <th scope="row">{label}</th>
      <td>{value}</td>
    </tr>
  );
}

export default async function CompanyPage({ params }) {
  const { city, slug } = await params;
  const c = getCompany(city, slug);
  if (!c) notFound();
  const cityInfo = getCity(city);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: c.name,
    ...(c.legalName ? { legalName: c.legalName } : {}),
    ...(c.website ? { url: c.website } : {}),
    ...(c.phone ? { telephone: c.phone } : {}),
    address: formatCompanyAddressSchema(c),
    ...(c.rating && c.reviews
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: c.rating,
            reviewCount: c.reviews,
            bestRating: 5,
          },
        }
      : {}),
    ...(c.services.length
      ? { makesOffer: c.services.map((s) => ({ "@type": "Offer", name: s })) }
      : {}),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Hem", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: `Städfirmor ${placePreposition(c.citySlug)} ${c.city}`,
        item: `${SITE_URL}/${c.citySlug}/`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: c.name,
        item: `${SITE_URL}/${c.citySlug}/${c.slug}/`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <Breadcrumbs
        items={[
          { label: "Hem", href: "/" },
          { label: `Städfirmor ${placePreposition(c.citySlug)} ${cityInfo?.name ?? c.city}`, href: `/${c.citySlug}/` },
          { label: c.name },
        ]}
      />
      <div className="container">
        <header className="company-header">
          <Avatar company={c} />
          <div style={{ width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap", marginBottom: "6px" }}>
              <h1 style={{ margin: 0 }}>{c.name}</h1>
              <Rating company={c} />
            </div>
            <div className="company-meta" style={{ margin: 0 }}>
              Städfirma {placePreposition(c.citySlug)} {formatCompanyLocation(c)}
              {c.foundedYear ? ` · Grundad ${c.foundedYear}` : ""}
            </div>
          </div>
        </header>

        {c.photo ? (
          <img
            className="photo-hero"
            src={c.photo}
            alt={`${c.name} i ${c.city}`}
            loading="lazy"
          />
        ) : null}

        {c.notice ? (
          <div style={{ padding: "14px 18px", background: "rgba(245, 158, 11, 0.1)", border: "1px solid rgba(245, 158, 11, 0.3)", borderRadius: 8, marginBottom: 24, color: "#92400e", fontSize: "0.95rem", lineHeight: 1.5 }}>
            <strong>Viktig information:</strong> {c.notice}
          </div>
        ) : null}

        <div className="two-col">
          <div>
            {c.about ? (
              <section className="panel">
                <h2>Om {c.name}</h2>
                <p>{c.about}</p>
              </section>
            ) : null}

            {c.services.length ? (
              <section className="panel">
                <h2>Tjänster</h2>
                <div className="badges" style={{ marginBottom: 14 }}>
                  {c.services.map((s) => (
                    <span className="badge" key={s}>{s}</span>
                  ))}
                </div>
                {c.serviceDescriptions ? <p>{c.serviceDescriptions}</p> : null}
                {c.serviceAreas ? (
                  <p>
                    <strong>Verksamhetsområde:</strong> {c.serviceAreas}
                  </p>
                ) : null}
              </section>
            ) : null}

            {c.reviewSnippets.length ? (
              <section className="panel">
                <h2>Vad kunder säger</h2>
                {c.reviewSnippets.map((q, i) => (
                  <blockquote className="quote" key={i}>
                    ”{q}”
                  </blockquote>
                ))}
              </section>
            ) : null}

            <section className="panel">
              <h2>Företagsuppgifter</h2>
              <table className="info-table">
                <tbody>
                  <InfoRow label="Juridiskt namn" value={c.legalName} />
                  <InfoRow label="Organisationsnummer" value={c.orgNumber} />
                  <InfoRow label="Bolagsform" value={c.legalForm} />
                  <InfoRow
                    label="Adress"
                    value={
                      c.address
                        ? `${c.address}, ${c.postalCode ? c.postalCode + " " : ""}${formatCompanyLocation(c)}`
                        : ""
                    }
                  />
                  <InfoRow label="Grundat" value={c.foundedYear} />
                  <InfoRow label="Grundare" value={c.founder} />
                  <InfoRow label="Antal anställda" value={c.employees} />
                  <InfoRow
                    label="RUT-avdrag"
                    value={c.rutAvdrag && c.rutAvdrag !== "Okänt" ? c.rutAvdrag : ""}
                  />
                  <InfoRow
                    label="Certifieringar"
                    value={c.certifications.join(", ")}
                  />
                  <InfoRow label="Språk" value={c.languages.join(", ")} />
                  <InfoRow label="Bokning" value={c.bookingMethod} />
                  <InfoRow label="Prisinformation" value={c.pricingInfo} />
                </tbody>
              </table>
              {c.lastVerified ? (
                <p className="small-print">
                  Uppgifterna verifierades senast {c.lastVerified}.
                </p>
              ) : null}
            </section>
          </div>

          <aside>
            <section className="panel">
              <h2>Kontakta {c.name}</h2>
              <div className="contact-actions">
                {c.phone ? (
                  <a className="btn btn-primary" href={`tel:${c.phone.replace(/[^+\d]/g, "")}`}>
                    Ring {c.phone}
                  </a>
                ) : null}
                {c.email ? (
                  <a className="btn btn-outline" href={`mailto:${c.email}`}>
                    Mejla företaget
                  </a>
                ) : null}
                {c.website ? (
                  <a
                    className="btn btn-outline"
                    href={c.website}
                    target="_blank"
                    rel="noopener nofollow"
                  >
                    Besök webbplats
                  </a>
                ) : null}
                {c.mapsUrl ? (
                  <a
                    className="btn btn-outline"
                    href={c.mapsUrl}
                    target="_blank"
                    rel="noopener nofollow"
                  >
                    Visa på Google Maps
                  </a>
                ) : null}
              </div>
              <p className="small-print">
                Du kontaktar företaget direkt – Städtorget är en oberoende katalog
                och tar inte emot din förfrågan.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </>
  );
}
