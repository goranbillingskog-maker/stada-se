import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_URL } from "../../../lib/data.js";
import {
  SERVICES,
  getService,
  citiesForService,
  companiesForService,
} from "../../../lib/services.js";
import { ARTICLES } from "../../../data/articles.js";
import Breadcrumbs from "../../../components/Breadcrumbs.jsx";
import Accordion from "../../../components/Accordion.jsx";
import { JsonLd } from "../../../components/Ui.jsx";

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

const CITY_COLORS = [
  "#FFC933", // sun
  "#C4E6DA", // mint
  "#9CCBE4", // water
  "#FFFFFF", // white
  "#E1ECE9", // pale
  "#C4E6DA", // mint
  "#9CCBE4", // water
  "#E1ECE9", // pale
];

export default async function ServicePage({ params }) {
  const { service } = await params;
  const s = getService(service);
  if (!s) notFound();

  const cities = citiesForService(s.slug);
  const total = companiesForService(s.slug).length;
  const isB2B = ["kontorsstadning", "byggstadning", "trappstadning"].includes(service);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Hem", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: s.name, item: `${SITE_URL}/tjanster/${s.slug}/` },
    ],
  };

  const faqJsonLd =
    s.faq && s.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: s.faq.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }
      : null;

  // Relevant articles
  const relevantArticles = ARTICLES.filter((a) => {
    if (s.slug === "flyttstadning" && a.slug === "flyttstadning-checklista") return true;
    if (!isB2B && a.slug === "rut-avdrag-stadning-2026") return true;
    return false;
  });
  const displayArticles = relevantArticles.length > 0 ? relevantArticles : ARTICLES.slice(0, 2);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      {faqJsonLd && <JsonLd data={faqJsonLd} />}

      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "8px clamp(16px, 4vw, 32px) 64px" }}>
        <Breadcrumbs items={[{ label: "Hem", href: "/" }, { label: s.name }]} />
        <div style={{ maxWidth: "800px" }}>
          <h1
            className="d"
            style={{
              margin: "0 0 24px",
              fontSize: "clamp(56px, 8vw, 110px)",
              lineHeight: 0.88,
              letterSpacing: "-0.02em",
            }}
          >
            {s.name} – jämför firmor i din stad
          </h1>
          <p style={{ margin: 0, fontSize: 19, color: "var(--text-2)", maxWidth: "56ch" }}>
            {s.intro} Just nu listar vi {total} städfirmor som erbjuder {s.name.toLowerCase()} i {cities.length} städer och områden. Välj din stad nedan.
          </p>
        </div>
      </section>

      {s.priceEstimate && (
        <section style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(16px, 4vw, 32px) 64px" }}>
          <div style={{ background: "var(--grout)", padding: 6, borderRadius: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 6 }}>
              <div
                style={{
                  background: "var(--sun)",
                  borderRadius: "var(--r-tile)",
                  padding: "28px 32px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: 16,
                }}
              >
                <span className="w" style={{ fontSize: 15, fontWeight: 600 }}>
                  Ungefärligt pris
                </span>
                <span className="d" style={{ fontSize: "clamp(36px, 4.5vw, 64px)", lineHeight: 0.9 }}>
                  {s.priceEstimate}
                </span>
              </div>
              <div
                style={{
                  background: "var(--white)",
                  borderRadius: "var(--r-tile)",
                  padding: "28px 32px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <h2 className="d" style={{ margin: "0 0 12px", fontSize: "clamp(24px, 2.8vw, 36px)", lineHeight: 1 }}>
                  Vad kostar {s.name.toLowerCase()}?
                </h2>
                <p className="w" style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: "var(--text-2)" }}>
                  {s.priceRange}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(16px, 4vw, 32px) 80px" }}>
        <h2 className="d" style={{ margin: "0 0 24px", fontSize: "clamp(36px, 4.5vw, 64px)", lineHeight: 0.9, letterSpacing: "-0.015em" }}>
          Välj stad för {s.name.toLowerCase()}
        </h2>
        <div className="cities">
          {cities
            .sort((a, b) => b.serviceCount - a.serviceCount)
            .map((c, i) => (
              <Link
                key={c.slug}
                className="city"
                href={`/tjanster/${s.slug}/${c.slug}/`}
                style={{ background: CITY_COLORS[i % CITY_COLORS.length] }}
              >
                <span className="d" style={{ fontSize: 40, lineHeight: 0.95 }}>{c.name}</span>
                <span className="w" style={{ fontSize: 13 }}>{c.serviceCount} firmor</span>
              </Link>
            ))}
        </div>
      </section>

      {s.faq && s.faq.length > 0 && (
        <section style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(16px, 4vw, 32px) 96px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 4fr) minmax(0, 7fr)", gap: 48 }}>
            <h2 className="d" style={{ margin: 0, fontSize: "clamp(36px, 4.5vw, 60px)", lineHeight: 0.92, letterSpacing: "-0.015em" }}>
              Vanliga frågor om {s.name.toLowerCase()}
            </h2>
            <Accordion items={s.faq.map((item) => ({ question: item.question, answer: item.answer }))} />
          </div>
        </section>
      )}

      {displayArticles.length > 0 && (
        <section style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(16px, 4vw, 32px) 112px" }}>
          <h2 className="d" style={{ margin: "0 0 24px", fontSize: "clamp(36px, 4.5vw, 64px)", lineHeight: 0.9, letterSpacing: "-0.015em" }}>
            Guider och artiklar
          </h2>
          <div style={{ background: "var(--grout)", padding: 6, borderRadius: 12, display: "flex", flexDirection: "column", gap: 6 }}>
            {displayArticles.map((art) => (
              <Link
                key={art.slug}
                href={`/blogg/${art.slug}/`}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 20,
                  padding: "20px 28px",
                  background: "var(--white)",
                  borderRadius: "var(--r-tile)",
                  textDecoration: "none",
                  transition: "background-color 0.15s",
                }}
                className="blog-row-link"
              >
                <span className="d" style={{ fontSize: "clamp(20px, 2.4vw, 30px)", lineHeight: 1.1 }}>
                  {art.title}
                </span>
                <span className="w" style={{ fontSize: 14, color: "var(--text-3)", flex: "none" }}>
                  {art.publishedAt} →
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
