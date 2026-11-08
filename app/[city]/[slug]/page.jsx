import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllCompanies,
  getCompany,
  getCity,
  getCompaniesByCity,
  SITE_URL,
  placePreposition,
  formatCompanyLocation,
  formatCompanyAddressSchema,
} from "../../../lib/data.js";
import FirmLogo from "../../../components/FirmLogo.jsx";
import Pips from "../../../components/Pips.jsx";
import Breadcrumbs from "../../../components/Breadcrumbs.jsx";
import { JsonLd } from "../../../components/Ui.jsx";

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

const TILE_COLORS = ["var(--mint)", "var(--water)", "var(--white)", "var(--pale)"];

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

  const breadcrumbItems = [
    { label: "Hem", href: "/" },
    {
      label: `Städfirmor ${placePreposition(c.citySlug)} ${cityInfo?.name ?? c.city}`,
      href: `/${c.citySlug}/`,
    },
    { label: c.name },
  ];

  // Service descriptions map
  const descMap = new Map();
  if (c.serviceDescriptions) {
    for (const part of c.serviceDescriptions.split("|")) {
      const [sName, ...rest] = part.split(":");
      if (sName && rest.length) {
        descMap.set(sName.trim().toLowerCase(), rest.join(":").trim());
      }
    }
  }

  // Facts
  const hasAnyFacts = Boolean(c.foundedYear || c.employees || c.pricingInfo || (c.rutAvdrag && c.rutAvdrag !== "Okänt"));

  // About paragraphs
  const aboutParagraphs = c.about ? c.about.split("\n\n").map((p) => p.trim()).filter(Boolean) : [];
  const aboutFirst = aboutParagraphs[0] || "";
  const aboutRest = aboutParagraphs.slice(1);

  // Info rows for company details
  const infoRows = [
    c.legalName && ["Juridiskt namn", c.legalName],
    c.orgNumber && ["Organisationsnummer", c.orgNumber],
    c.legalForm && ["Bolagsform", c.legalForm],
    c.address && ["Adress", `${c.address}${c.postalCode ? `, ${c.postalCode}` : ""} ${formatCompanyLocation(c)}`],
    c.foundedYear && ["Grundat", c.foundedYear],
    c.founder && ["Grundare", c.founder],
    c.employees && ["Antal anställda", c.employees],
    c.rutAvdrag && c.rutAvdrag !== "Okänt" && ["RUT-avdrag", c.rutAvdrag],
    c.certifications?.length > 0 && ["Certifieringar", c.certifications.join(", ")],
    c.languages?.length > 0 && ["Språk", c.languages.join(", ")],
    c.pricingInfo && ["Pris", c.pricingInfo],
    c.bookingMethod && ["Bokning", c.bookingMethod],
  ].filter(Boolean);

  // Other top firms in same city
  let otherTopFirms = getCompaniesByCity(c.citySlug)
    .filter((other) => other.slug !== c.slug && other.rating && other.reviews && other.reviews >= 10)
    .slice(0, 3);

  if (otherTopFirms.length < 2) {
    otherTopFirms = getCompaniesByCity(c.citySlug)
      .filter((other) => other.slug !== c.slug && other.rating)
      .slice(0, 3);
  }

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "8px clamp(16px, 4vw, 32px) 56px" }}>
        <Breadcrumbs items={breadcrumbItems} />
        <div className="profile">
          <div>
            <div style={{ marginBottom: 20 }}>
              <FirmLogo company={c} size={104} />
            </div>
            <h1 className="d" style={{ margin: "0 0 24px", fontSize: "clamp(56px, 9vw, 132px)", lineHeight: 0.86, letterSpacing: "-0.02em" }}>
              {c.name}
            </h1>
            <p style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 600 }}>
              Städfirma {placePreposition(c.citySlug)} {formatCompanyLocation(c)}
            </p>
            {c.address ? (
              <p className="w" style={{ margin: "0 0 32px", fontSize: 14, color: "var(--text-3)" }}>
                {c.address}{c.postalCode ? `, ${c.postalCode}` : ""} {c.city}
              </p>
            ) : null}
            <div className="cta w">
              {c.phone ? (
                <a className="btn btn--primary" href={`tel:${c.phone.replace(/[^+\d]/g, "")}`}>
                  Ring {c.phone}
                </a>
              ) : null}
              {c.email ? (
                <a className="btn" href={`mailto:${c.email}`}>Mejla</a>
              ) : null}
              {c.website && c.hasOwnWebsite !== false ? (
                <a className="btn" href={c.website} target="_blank" rel="noopener nofollow">
                  Besök webbplatsen
                </a>
              ) : null}
            </div>
            <p style={{ margin: "20px 0 0", maxWidth: "52ch", fontSize: 15, color: "var(--text-3)" }}>
              Du kontaktar företaget direkt. Städtorget är en oberoende katalog och tar inte emot din förfrågan.
            </p>
            {c.notice ? (
              <div style={{ marginTop: 20, padding: "14px 18px", background: "rgba(255, 201, 51, 0.2)", border: "1px solid var(--sun)", borderRadius: 8, color: "var(--ink)", fontSize: "0.95rem", lineHeight: 1.5 }}>
                <strong>Viktig information:</strong> {c.notice}
              </div>
            ) : null}
          </div>

          {c.rating ? (
            <div className="wallbox">
              <div className="score">
                <span className="d" style={{ fontSize: "clamp(130px, 15vw, 220px)", lineHeight: 0.8 }}>
                  {c.rating.toFixed(1).replace(".", ",")}
                </span>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <Pips rating={c.rating} size={24} variant="score" />
                  {c.reviews ? (
                    <span className="w" style={{ fontSize: 14 }}>{c.reviews} omdömen på Google</span>
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {hasAnyFacts && (
        <section style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(16px, 4vw, 32px) 112px" }}>
          <div className="facts">
            {c.foundedYear ? (
              <div className="fact" style={{ background: "var(--mint)" }}>
                <span className="w" style={{ fontSize: 15, fontWeight: 600 }}>Grundat</span>
                <span className="fact-num d">{c.foundedYear}</span>
              </div>
            ) : null}
            {c.employees ? (
              <div className="fact" style={{ background: "var(--water)" }}>
                <span className="w" style={{ fontSize: 15, fontWeight: 600 }}>Anställda</span>
                <span className="fact-num d">{c.employees}</span>
              </div>
            ) : null}
            {c.pricingInfo ? (
              <div className="fact" style={{ background: "var(--white)" }}>
                <span className="w" style={{ fontSize: 15, fontWeight: 600 }}>Prisinformation</span>
                <span className="fact-num d" style={{ fontSize: "clamp(28px, 3vw, 44px)" }}>{c.pricingInfo}</span>
              </div>
            ) : null}
            {c.rutAvdrag && c.rutAvdrag !== "Okänt" ? (
              <div className="fact" style={{ background: "var(--pale)" }}>
                <span className="w" style={{ fontSize: 15, fontWeight: 600 }}>Erbjuder RUT-avdrag</span>
                <span className="fact-num d">{c.rutAvdrag}</span>
              </div>
            ) : null}
          </div>
        </section>
      )}

      {c.about ? (
        <section style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(16px, 4vw, 32px) 112px" }}>
          <div className="about">
            <h2 className="d" style={{ margin: 0, fontSize: "clamp(44px, 4.8vw, 68px)", lineHeight: 0.9, letterSpacing: "-0.015em" }}>
              Om {c.name}
            </h2>
            <div>
              <p style={{ margin: "0 0 20px", maxWidth: "46ch", fontSize: 24, lineHeight: 1.4, fontWeight: 500 }}>
                {aboutFirst}
              </p>
              {aboutRest.length > 0 && aboutRest.map((p, idx) => (
                <p key={idx} style={{ margin: "0 0 16px", maxWidth: "58ch", fontSize: 17, color: "var(--text-2)" }}>
                  {p}
                </p>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {c.services && c.services.length > 0 ? (
        <section style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(16px, 4vw, 32px) 112px" }}>
          <h2 className="d" style={{ margin: "0 0 12px", fontSize: "clamp(44px, 5.2vw, 76px)", lineHeight: 0.9, letterSpacing: "-0.015em" }}>
            Tjänster
          </h2>
          {c.serviceAreas ? (
            <p style={{ margin: "0 0 32px", maxWidth: "52ch", color: "var(--text-2)" }}>
              Verksamhetsområde: {c.serviceAreas}.
            </p>
          ) : null}
          <div className="svtiles">
            {c.services.map((s, idx) => {
              const desc = descMap.get(s.toLowerCase());
              const isFirst = idx === 0;
              return (
                <div
                  key={s}
                  className={`svtile ${isFirst ? "svtile--2" : ""}`.trim()}
                  style={{ background: isFirst ? "var(--sun)" : TILE_COLORS[(idx - 1) % TILE_COLORS.length] }}
                >
                  <span className="d" style={{ fontSize: isFirst ? "clamp(38px, 4vw, 56px)" : "clamp(30px, 3vw, 40px)", lineHeight: 0.9 }}>
                    {s}
                  </span>
                  {desc && <span className="w" style={{ fontSize: 13, maxWidth: "40ch" }}>{desc}</span>}
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      {c.reviewSnippets && c.reviewSnippets.length > 0 ? (
        <section style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(16px, 4vw, 32px) 112px" }}>
          <h2 className="d" style={{ margin: "0 0 24px", fontSize: "clamp(44px, 5.2vw, 76px)", lineHeight: 0.9, letterSpacing: "-0.015em" }}>
            Vad kunder säger
          </h2>
          <div style={{ background: "var(--grout)", padding: 6, borderRadius: 12, display: "flex", flexDirection: "column", gap: 6 }}>
            {c.reviewSnippets.map((q, i) => (
              <blockquote key={i} style={{ margin: 0, padding: "20px 24px", background: "var(--white)", borderRadius: "var(--r-tile)", fontStyle: "italic", fontSize: 16, color: "var(--text-2)" }}>
                ”{q}”
              </blockquote>
            ))}
          </div>
        </section>
      ) : null}

      {infoRows.length > 0 && (
        <section style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(16px, 4vw, 32px) 112px" }}>
          <h2 className="d" style={{ margin: "0 0 32px", fontSize: "clamp(44px, 5.2vw, 76px)", lineHeight: 0.9, letterSpacing: "-0.015em" }}>
            Företagsuppgifter
          </h2>
          <div style={{ background: "var(--grout)", padding: 6, borderRadius: 12, display: "flex", flexDirection: "column", gap: 6 }}>
            {infoRows.map(([label, val]) => (
              <div key={label} className="kv">
                <span className="w" style={{ fontSize: 14, color: "var(--text-3)" }}>{label}</span>
                <span style={{ fontWeight: 600 }}>{val}</span>
              </div>
            ))}
          </div>
          {c.lastVerified ? (
            <p className="w" style={{ margin: "16px 0 0", fontSize: 13, color: "var(--text-3)" }}>
              Uppgifterna verifierades senast {c.lastVerified}.
            </p>
          ) : null}
        </section>
      )}

      <section className="on-dark" style={{ background: "var(--ink)", color: "var(--white)", padding: "96px 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(16px, 4vw, 32px)" }}>
          <h2 className="d" style={{ margin: "0 0 32px", fontSize: "clamp(48px, 6vw, 88px)", lineHeight: 0.9, letterSpacing: "-0.015em" }}>
            Kontakta {c.name}
          </h2>
          {c.phone ? (
            <a className="big-call d" href={`tel:${c.phone.replace(/[^+\d]/g, "")}`}>
              {c.phone}
            </a>
          ) : null}
          <div className="contact-links w" style={{ margin: "40px 0 0", display: "flex", flexWrap: "wrap", gap: "12px 40px", fontSize: 16, fontWeight: 550 }}>
            {c.email ? <a href={`mailto:${c.email}`}>{c.email}</a> : null}
            {c.website && c.hasOwnWebsite !== false ? (
              <a href={c.website} target="_blank" rel="noopener nofollow">
                {c.website.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
              </a>
            ) : null}
            {c.address ? <span>{c.address}{c.postalCode ? `, ${c.postalCode}` : ""} {c.city}</span> : null}
          </div>
          <p style={{ margin: "32px 0 0", maxWidth: "58ch", fontSize: 15, color: "var(--on-dark-2)" }}>
            Du kontaktar företaget direkt. Städtorget är en oberoende katalog och tar inte emot din förfrågan.
          </p>
        </div>
      </section>

      {otherTopFirms.length > 0 && (
        <section style={{ maxWidth: 1280, margin: "0 auto", padding: "112px clamp(16px, 4vw, 32px)" }}>
          <h2 className="d" style={{ margin: "0 0 12px", fontSize: "clamp(44px, 5.2vw, 76px)", lineHeight: 0.9, letterSpacing: "-0.015em" }}>
            Fler högt betygsatta firmor {placePreposition(c.citySlug)} {cityInfo?.name ?? c.city}
          </h2>
          <p style={{ margin: "0 0 32px", maxWidth: "52ch", color: "var(--text-2)" }}>
            Jämför gärna med fler firmor innan du bestämmer dig.
          </p>
          <div style={{ background: "var(--grout)", padding: 6, borderRadius: 12, display: "flex", flexDirection: "column", gap: 6 }}>
            {otherTopFirms.map((other) => (
              <Link key={other.slug} className="more" href={`/${other.citySlug}/${other.slug}/`}>
                <span className="d" style={{ fontSize: "clamp(30px, 3vw, 44px)", lineHeight: 0.95 }}>
                  {other.name}
                </span>
                <span className="w" style={{ fontSize: 14 }}>
                  {formatCompanyLocation(other)}
                </span>
                {other.rating ? (
                  <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Pips rating={other.rating} size={18} />
                    <span className="d" style={{ fontSize: 40, lineHeight: 0.9 }}>
                      {other.rating.toFixed(1).replace(".", ",")}
                    </span>
                  </span>
                ) : <span />}
                <span className="w" style={{ fontSize: 14, textAlign: "right" }}>
                  {other.reviews ? `${other.reviews} omdömen` : ""}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
