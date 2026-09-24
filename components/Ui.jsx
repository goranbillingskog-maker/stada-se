import Link from "next/link";
import { initials, formatCompanyLocation } from "../lib/data.js";

export function Avatar({ company }) {
  const src = company.logo || company.favicon;
  if (src) {
    return (
      <img
        className="company-avatar"
        src={src}
        alt={`${company.name} logotyp`}
        loading="lazy"
        width="96"
        height="96"
      />
    );
  }
  return <div className="avatar-fallback" aria-hidden="true">{initials(company.name)}</div>;
}

export function CompanyVisual({ company }) {
  if (company.photo) {
    return (
      <img
        className="company-photo"
        src={company.photo}
        alt={`${company.name} i ${company.city}`}
        loading="lazy"
        width="96"
        height="96"
      />
    );
  }
  return <Avatar company={company} />;
}

export function Stars({ rating }) {
  if (!rating) return null;
  const full = Math.round(rating);
  return (
    <span className="stars" aria-label={`${rating} av 5 stjärnor`}>
      {"★".repeat(full)}
      {"☆".repeat(5 - full)}
    </span>
  );
}

export function Rating({ company }) {
  if (!company.rating) return null;
  return (
    <div className="rating">
      <div className="score">{company.rating.toFixed(1).replace(".", ",")}</div>
      <Stars rating={company.rating} />
      {company.reviews ? <div className="count">{company.reviews} omdömen</div> : null}
    </div>
  );
}

export function CompanyCard({ company, headingLevel = "h3", hideRut = false }) {
  const H = headingLevel;
  const href = `/${company.citySlug}/${company.slug}/`;
  return (
    <article className="company-card">
      <Link href={href} aria-hidden="true" tabIndex={-1} className="company-visual">
        <CompanyVisual company={company} />
      </Link>
      <div>
        <H>
          <Link href={href}>{company.name}</Link>
        </H>
        <div className="company-meta">
          <span>{company.address ? `${company.address}, ${formatCompanyLocation(company)}` : formatCompanyLocation(company)}</span>
          {company.phone ? (
            <span> · <a href={`tel:${company.phone.replace(/[^+\d]/g, "")}`} style={{ color: "inherit", textDecoration: "none" }}>{company.phone}</a></span>
          ) : null}
          {company.website && company.hasOwnWebsite !== false ? (
            <span> · <a href={company.website} target="_blank" rel="noopener nofollow" style={{ color: "var(--primary)", textDecoration: "none" }}>Hemsida ↗</a></span>
          ) : null}
          {company.coverageNote ? (
            <span style={{ color: "var(--primary)", fontWeight: 500 }}> · {company.coverageNote}</span>
          ) : null}
        </div>
        <div className="badges">
          {company.rutAvdrag === "Ja" && !hideRut ? (
            <span className="badge badge-rut" style={{ background: "rgba(16, 185, 129, 0.1)", color: "#059669", borderColor: "rgba(16, 185, 129, 0.2)" }}>RUT-avdrag</span>
          ) : null}
          {company.services.map((s) => (
            <span className="badge" key={s}>{s}</span>
          ))}
        </div>
        {company.notice ? (
          <div style={{ marginTop: 8, padding: "6px 10px", background: "rgba(245, 158, 11, 0.1)", border: "1px solid rgba(245, 158, 11, 0.3)", borderRadius: 6, fontSize: "0.85rem", color: "#92400e" }}>
            ℹ️ {company.notice}
          </div>
        ) : null}
      </div>
      <Rating company={company} />
    </article>
  );
}

export function Breadcrumbs({ items }) {
  return (
    <nav className="breadcrumbs container" aria-label="Brödsmulor">
      {items.map((item, i) => (
        <span key={i}>
          {i > 0 ? " › " : ""}
          {item.href ? <Link href={item.href}>{item.label}</Link> : <span>{item.label}</span>}
        </span>
      ))}
    </nav>
  );
}

export function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
