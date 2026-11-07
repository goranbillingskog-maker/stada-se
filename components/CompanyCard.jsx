import Link from "next/link";
import FirmLogo from "./FirmLogo.jsx";
import Pips from "./Pips.jsx";
import { formatCompanyLocation } from "../lib/data.js";

export default function CompanyCard({ company, headingLevel = "h3", hideRut = false }) {
  const H = headingLevel;
  const href = `/${company.citySlug}/${company.slug}/`;

  return (
    <article className="firm">
      <FirmLogo company={company} size={104} />
      <div>
        <H className="d firm-name" style={{ margin: "0 0 6px", fontSize: "clamp(30px, 3vw, 42px)", lineHeight: 0.95 }}>
          <Link href={href}>{company.name}</Link>
        </H>
        <p className="w" style={{ margin: 0, fontSize: 14, color: "var(--text-3)" }}>
          {company.address ? `${company.address}, ${formatCompanyLocation(company)}` : formatCompanyLocation(company)}
        </p>
        <ul className="firm-tags w">
          {company.rutAvdrag === "Ja" && !hideRut && (
            <li className="tag tag--rut">RUT-avdrag</li>
          )}
          {company.services && company.services.map((s) => (
            <li key={s} className="tag">{s}</li>
          ))}
        </ul>
        {company.notice ? (
          <div style={{ marginTop: 8, padding: "6px 10px", background: "rgba(255, 201, 51, 0.2)", border: "1px solid var(--sun)", borderRadius: 6, fontSize: "0.85rem", color: "var(--ink)" }}>
            ℹ️ {company.notice}
          </div>
        ) : null}
      </div>
      <div className="firm-aside">
        {company.rating ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Pips rating={company.rating} size={16} />
            <span className="d" style={{ fontSize: 56, lineHeight: 0.85 }}>
              {company.rating.toFixed(1).replace(".", ",")}
            </span>
          </div>
        ) : null}
        {company.reviews ? (
          <span className="w" style={{ fontSize: 13, color: "var(--text-3)" }}>
            {company.reviews} omdömen
          </span>
        ) : null}
        {company.phone ? (
          <a className="call w" href={`tel:${company.phone.replace(/[^+\d]/g, "")}`}>
            {company.phone}
          </a>
        ) : null}
      </div>
    </article>
  );
}
