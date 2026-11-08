import Link from "next/link";
import { ARTICLES } from "../../data/articles.js";
import Breadcrumbs from "../../components/Breadcrumbs.jsx";

export const metadata = {
  title: "Blogg & Guider om städtjänster",
  description:
    "Läs våra artiklar och guider för att lära dig mer om hemstädning, flyttstädning, RUT-avdrag och hur du hittar bästa städfirman.",
  alternates: { canonical: "/blogg/" },
};

export default function BloggPage() {
  return (
    <section style={{ maxWidth: 1280, margin: "0 auto", padding: "8px clamp(16px, 4vw, 32px) 112px" }}>
      <Breadcrumbs items={[{ label: "Hem", href: "/" }, { label: "Blogg" }]} />
      <div style={{ maxWidth: 860, marginBottom: 48 }}>
        <h1
          className="d"
          style={{
            margin: "0 0 20px",
            fontSize: "clamp(56px, 8vw, 110px)",
            lineHeight: 0.88,
            letterSpacing: "-0.02em",
          }}
        >
          Blogg & guider
        </h1>
        <p style={{ margin: 0, fontSize: 19, color: "var(--text-2)", maxWidth: "56ch" }}>
          Här samlar vi artiklar, guider och tips för att hjälpa dig att välja rätt städfirma, förstå RUT-avdraget och få bästa möjliga städresultat.
        </p>
      </div>

      <div
        style={{
          background: "var(--grout)",
          padding: 6,
          borderRadius: 12,
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        {ARTICLES.map((article) => (
          <Link
            key={article.slug}
            href={`/blogg/${article.slug}/`}
            className="blog-row-link"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 24,
              padding: "24px 28px",
              background: "var(--white)",
              borderRadius: "var(--r-tile)",
              textDecoration: "none",
              transition: "background-color 0.15s",
            }}
          >
            <div>
              <span
                className="d"
                style={{
                  display: "block",
                  fontSize: "clamp(24px, 2.8vw, 36px)",
                  lineHeight: 1.05,
                  marginBottom: 8,
                }}
              >
                {article.title}
              </span>
              <p
                className="w"
                style={{ margin: 0, fontSize: 15, color: "var(--text-2)", maxWidth: "60ch" }}
              >
                {article.description}
              </p>
            </div>
            <span
              className="w"
              style={{ fontSize: 14, color: "var(--text-3)", flex: "none" }}
            >
              {article.publishedAt} →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
