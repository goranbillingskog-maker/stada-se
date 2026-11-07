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
        width="160"
        height="90"
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
        width="160"
        height="90"
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

export { default as CompanyCard } from "./CompanyCard.jsx";

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
