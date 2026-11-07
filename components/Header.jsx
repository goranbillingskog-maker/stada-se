import Link from "next/link";
import Logo from "./Logo.jsx";

export default function Header() {
  return (
    <header
      style={{
        maxWidth: "var(--maxw)",
        margin: "0 auto",
        padding: "24px var(--gutter)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "24px",
        flexWrap: "wrap",
      }}
    >
      <Logo />
      <nav
        className="nav-links w"
        aria-label="Huvudmeny"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "32px",
          fontSize: "15px",
          fontWeight: 550,
        }}
      >
        <Link className="nav-link" href="/#tjanster">
          Tjänster
        </Link>
        <Link className="nav-link" href="/#stader">
          Städer
        </Link>
        <Link className="nav-link" href="/blogg/">
          Blogg
        </Link>
        <Link className="nav-link" href="/om-oss/">
          Om oss
        </Link>
        <Link
          href="/#stader"
          style={{
            background: "var(--ink)",
            color: "var(--white)",
            padding: "12px 20px",
            borderRadius: "var(--r-tile)",
            fontWeight: 700,
            lineHeight: 1,
            transition: "background-color 0.15s, color 0.15s",
          }}
          className="header-cta"
        >
          Hitta städfirma
        </Link>
      </nav>
      <style>{`
        .header-cta:hover {
          background: var(--sun) !important;
          color: var(--ink) !important;
        }
        @media (max-width: 860px) {
          .nav-links {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
