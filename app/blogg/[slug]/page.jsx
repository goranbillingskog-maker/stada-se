import Link from "next/link";
import { notFound } from "next/navigation";
import { ARTICLES } from "../../../data/articles.js";
import { SITE_URL, SITE_NAME } from "../../../lib/data.js";
import Breadcrumbs from "../../../components/Breadcrumbs.jsx";
import { JsonLd } from "../../../components/Ui.jsx";

export async function generateStaticParams() {
  return ARTICLES.map((article) => ({
    slug: article.slug,
  }));
}

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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.description,
    image: `${SITE_URL}${article.image || "/stada.png"}`,
    datePublished: article.publishedAt,
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blogg/${article.slug}/`,
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />

      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "8px clamp(16px, 4vw, 32px) 112px" }}>
        <Breadcrumbs
          items={[
            { label: "Hem", href: "/" },
            { label: "Blogg", href: "/blogg/" },
            { label: article.title },
          ]}
        />

        <article style={{ maxWidth: "68ch" }}>
          <header style={{ marginBottom: "40px" }}>
            <h1
              className="d"
              style={{
                fontSize: "clamp(38px, 5vw, 64px)",
                lineHeight: "0.95",
                marginBottom: "20px",
                letterSpacing: "-0.015em",
              }}
            >
              {article.title}
            </h1>
            <div
              className="w"
              style={{
                fontSize: "14px",
                color: "var(--text-3)",
                display: "flex",
                flexWrap: "wrap",
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

          <div
            className="article-body"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          <div style={{ marginTop: 64, paddingTop: 32, borderTop: "1px solid var(--grout)" }}>
            <Link
              href="/blogg/"
              className="w"
              style={{
                fontSize: "15px",
                fontWeight: 600,
                color: "var(--ink)",
                textDecoration: "underline",
              }}
            >
              ← Tillbaka till alla artiklar
            </Link>
          </div>
        </article>
      </section>
    </>
  );
}
