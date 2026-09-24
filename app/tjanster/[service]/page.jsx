import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_URL } from "../../../lib/data.js";
import {
  SERVICES,
  getService,
  citiesForService,
  companiesForService,
} from "../../../lib/services.js";
import { Breadcrumbs, JsonLd } from "../../../components/Ui.jsx";
import { ServiceIcon } from "../../../components/Illustrations.jsx";

export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICES.map((s) => ({ service: s.slug }));
}

export async function generateMetadata({ params }) {
  const { service } = await params;
  const s = getService(service);
  if (!s) return {};
  const total = companiesForService(s.slug).length;
  const numCities = citiesForService(s.slug).length;
  const isB2B = ["kontorsstadning", "byggstadning", "trappstadning"].includes(service);
  const description = isB2B
    ? `${s.name}: jämför ${total} städfirmor med omdömen i ${numCities} städer och områden. ${s.intro}`
    : `${s.name}: jämför ${total} städfirmor med omdömen och RUT-avdrag i ${numCities} städer och områden. ${s.intro}`;
  return {
    title: `${s.name} – jämför ${total} städfirmor i ${numCities} städer`,
    description,
    alternates: { canonical: `/tjanster/${s.slug}/` },
  };
}

export default async function ServicePage({ params }) {
  const { service } = await params;
  const s = getService(service);
  if (!s) notFound();

  const cities = citiesForService(s.slug);
  const total = companiesForService(s.slug).length;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Hem", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: s.name, item: `${SITE_URL}/tjanster/${s.slug}/` },
    ],
  };

  const faqJsonLd = s.faq && s.faq.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": s.faq.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer,
      },
    })),
  } : null;

  return (
    <div className="theme-pilot">
      <JsonLd data={breadcrumbJsonLd} />
      {faqJsonLd && <JsonLd data={faqJsonLd} />}
      <Breadcrumbs items={[{ label: "Hem", href: "/" }, { label: s.name }]} />
      <section className="section" style={{ paddingTop: 24 }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
            <div className="service-card" style={{ display: "inline-flex", padding: 12, margin: 0 }}>
              <div className="icon" style={{ margin: 0 }}><ServiceIcon icon={s.icon} /></div>
            </div>
            <h1 style={{ margin: 0 }}>
              {s.name} – jämför firmor i din stad
            </h1>
          </div>
          <p className="lead" style={{ marginBottom: 32 }}>
            {s.intro} Just nu listar vi {total} städfirmor som erbjuder{" "}
            {s.name.toLowerCase()} i {cities.length} städer och områden. Välj din stad nedan.
          </p>

          {s.priceRange && (
            <div style={{ marginBottom: 40, padding: 24, background: "#fdfdfd", border: "1px solid #eaeaea", borderRadius: 8 }}>
              <h2 style={{ marginTop: 0, marginBottom: 12, fontSize: "1.4rem" }}>
                Vad kostar {s.name.toLowerCase()}?
              </h2>
              <p style={{ margin: 0, lineHeight: 1.6, color: "#444" }}>
                {s.priceRange}
              </p>
            </div>
          )}

          <h2 style={{ fontSize: "1.4rem", marginBottom: 16 }}>Välj stad för {s.name.toLowerCase()}</h2>
          <div className="city-grid" style={{ marginBottom: 48 }}>
            {cities.map((c) => (
              <Link key={c.slug} href={`/tjanster/${s.slug}/${c.slug}/`} className="city-card">
                <span>
                  <span className="name">{c.name}</span>
                  <br />
                  <span className="count">{c.serviceCount} firmor</span>
                </span>
                <span className="arrow">→</span>
              </Link>
            ))}
          </div>

          {s.faq && s.faq.length > 0 && (
            <div style={{ borderTop: "1px solid #eaeaea", paddingTop: 40, marginTop: 40 }}>
              <h2 style={{ fontSize: "1.6rem", marginBottom: 24 }}>
                Vanliga frågor och svar om {s.name.toLowerCase()}
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {s.faq.map((item, index) => (
                  <details
                    key={index}
                    style={{
                      background: "#f9f9f9",
                      padding: "16px 20px",
                      borderRadius: 8,
                      border: "1px solid #eaeaea",
                    }}
                  >
                    <summary style={{ fontWeight: "600", cursor: "pointer", outline: "none" }}>
                      {item.question}
                    </summary>
                    <p style={{ marginTop: 12, marginBottom: 0, lineHeight: 1.6, color: "#555" }}>
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
