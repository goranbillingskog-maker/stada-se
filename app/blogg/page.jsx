import Link from "next/link";
import { ARTICLES } from "../../data/articles.js";

export const metadata = {
  title: "Blogg & Guider om städtjänster",
  description:
    "Läs våra artiklar och guider för att lära dig mer om hemstädning, flyttstädning, RUT-avdrag och hur du hittar bästa städfirman.",
  alternates: { canonical: "/blogg/" },
};

export default function BloggPage() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 860 }}>
        <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", marginBottom: "16px" }}>
          Blogg & Guider
        </h1>
        <p className="lead" style={{ fontSize: "1.15rem", marginBottom: "40px" }}>
          Här samlar vi artiklar, guider och tips för att hjälpa dig att välja rätt städfirma, förstå RUT-avdraget och få bästa möjliga städresultat.
        </p>

        <div style={{ display: "grid", gap: "32px" }}>
          {ARTICLES.map((article) => (
            <article key={article.slug} className="blog-post-card">
              <div>
                <div
                  style={{
                    fontSize: "0.82rem",
                    color: "var(--ink-soft)",
                    marginBottom: "8px",
                    display: "flex",
                    gap: "12px",
                  }}
                >
                  <span>{article.publishedAt}</span>
                  <span>•</span>
                  <span>Av {article.author}</span>
                </div>
                <h2 style={{ fontSize: "1.5rem", margin: "0 0 12px 0", fontFamily: "var(--font-serif)" }}>
                  <Link href={`/blogg/${article.slug}/`} style={{ color: "var(--ink)", textDecoration: "none" }} className="hover-underline">
                    {article.title}
                  </Link>
                </h2>
                <p style={{ color: "var(--ink-soft)", margin: "0 0 20px 0", fontSize: "0.98rem" }}>
                  {article.description}
                </p>
                <Link
                  href={`/blogg/${article.slug}/`}
                  style={{
                    color: "var(--teal)",
                    fontWeight: "600",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "0.95rem"
                  }}
                >
                  Läs hela artikeln →
                </Link>
              </div>
              {article.image && (
                <Link href={`/blogg/${article.slug}/`} style={{ display: "block" }}>
                  <img
                    src={article.image}
                    alt={article.title}
                    className="blog-post-image"
                  />
                </Link>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
