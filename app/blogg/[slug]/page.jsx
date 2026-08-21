import Link from "next/link";
import { notFound } from "next/navigation";
import { ARTICLES } from "../../../data/articles.js";
import { SITE_URL, SITE_NAME } from "../../../lib/data.js";

// Generera statiska parametrar för Next.js
export async function generateStaticParams() {
  return ARTICLES.map((article) => ({
    slug: article.slug,
  }));
}

// Dynamisk metadata per artikel
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.description,
    alternates: {
      canonical: `/blogg/${article.slug}/`,
    },
    openGraph: {
      title: article.title,
      description: article.description,
      url: `${SITE_URL}/blogg/${article.slug}/`,
      siteName: SITE_NAME,
      type: "article",
      publishedTime: article.publishedAt,
      authors: [article.author],
      images: [
        {
          url: `${SITE_URL}${article.image || "/stada.png"}`,
          width: 800,
          height: 600,
          alt: article.title,
        },
      ],
    },
  };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  // JSON-LD strukturerad data för sökmotorer (Article / BlogPosting)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": article.title,
    "description": article.description,
    "image": `${SITE_URL}${article.image || "/stada.png"}`,
    "datePublished": article.publishedAt,
    "author": {
      "@type": "Organization",
      "name": SITE_NAME,
      "url": SITE_URL,
    },
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME,
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE_URL}/logo.png`,
      },
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blogg/${article.slug}/`,
    },
  };

  return (
    <section className="section">
      {/* Skjut in strukturerad data i headen */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container" style={{ maxWidth: 740 }}>
        {/* Brödsmulor (Breadcrumbs) */}
        <nav
          aria-label="Brödsmulor"
          style={{ fontSize: "0.85rem", color: "var(--ink-soft)", marginBottom: "24px" }}
        >
          <Link href="/">Hem</Link> &raquo;{" "}
          <Link href="/blogg/">Blogg</Link> &raquo;{" "}
          <span style={{ color: "var(--ink)" }}>{article.title}</span>
        </nav>

        <article>
          <header style={{ marginBottom: "32px" }}>
            <h1
              style={{
                fontSize: "clamp(2rem, 5vw, 2.75rem)",
                lineHeight: "1.15",
                marginBottom: "16px",
                fontFamily: "var(--font-serif)",
              }}
            >
              {article.title}
            </h1>
            <div
              style={{
                fontSize: "0.88rem",
                color: "var(--ink-soft)",
                display: "flex",
                gap: "12px",
              }}
            >
              <time dateTime={article.publishedAt}>{article.publishedAt}</time>
              <span>•</span>
              <span>{article.readTime}</span>
              <span>•</span>
              <span>Av {article.author}</span>
            </div>
          </header>

          {article.image && (
            <div style={{ marginBottom: "32px" }}>
              <img
                src={article.image}
                alt={article.title}
                style={{
                  width: "100%",
                  maxHeight: "400px",
                  objectFit: "cover",
                  borderRadius: "var(--radius)",
                  border: "1px solid var(--line)",
                }}
              />
            </div>
          )}

          {/* Brödtexten med stilar för rubriker, listor etc. */}
          <div
            className="article-body"
            style={{
              fontSize: "1.06rem",
              lineHeight: "1.75",
              color: "var(--ink)",
            }}
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>
      </div>
    </section>
  );
}
