"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "./Logo.jsx";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Stäng menyn vid Escape-tangent
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    if (menuOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Logo />

        {/* Desktop navigation */}
        <nav className="nav-links w" aria-label="Huvudmeny">
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
          <Link href="/#stader" className="header-cta">
            Hitta städfirma
          </Link>
        </nav>

        {/* Mobil menyknapp (synlig endast under 860px) */}
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Stäng meny" : "Öppna meny"}
        >
          {menuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>
      </div>

      {/* Mobil meny (dropdown) */}
      {menuOpen && (
        <nav className="mobile-drawer w" aria-label="Mobil huvudmeny">
          <Link
            className="mobile-nav-link"
            href="/#tjanster"
            onClick={() => setMenuOpen(false)}
          >
            Tjänster
          </Link>
          <Link
            className="mobile-nav-link"
            href="/#stader"
            onClick={() => setMenuOpen(false)}
          >
            Städer
          </Link>
          <Link
            className="mobile-nav-link"
            href="/blogg/"
            onClick={() => setMenuOpen(false)}
          >
            Blogg
          </Link>
          <Link
            className="mobile-nav-link"
            href="/om-oss/"
            onClick={() => setMenuOpen(false)}
          >
            Om oss
          </Link>
          <Link
            href="/#stader"
            className="mobile-cta-btn"
            onClick={() => setMenuOpen(false)}
          >
            Hitta städfirma
          </Link>
        </nav>
      )}

      <style>{`
        .site-header {
          max-width: var(--maxw);
          margin: 0 auto;
          padding: 24px var(--gutter);
          position: relative;
          z-index: 100;
        }

        .header-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 32px;
          font-size: 15px;
          font-weight: 550;
        }

        .nav-link {
          color: var(--ink);
          text-decoration: none;
          transition: color 0.15s;
        }

        .nav-link:hover {
          text-decoration: underline;
          text-underline-offset: 6px;
          text-decoration-thickness: 2px;
        }

        .header-cta {
          background: var(--ink);
          color: var(--white);
          padding: 12px 20px;
          border-radius: var(--r-tile);
          font-weight: 700;
          line-height: 1;
          text-decoration: none;
          transition: background-color 0.15s, color 0.15s;
        }

        .header-cta:hover {
          background: var(--sun) !important;
          color: var(--ink) !important;
        }

        .mobile-menu-btn {
          display: none;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          padding: 0;
          background: var(--white);
          border: 2px solid var(--ink);
          border-radius: var(--r-tile);
          color: var(--ink);
          cursor: pointer;
          transition: background-color 0.15s;
        }

        .mobile-menu-btn:hover {
          background: var(--sun);
        }

        .mobile-drawer {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 16px;
          padding: 20px;
          background: var(--white);
          border: 1px solid var(--grout);
          border-radius: var(--r-box);
          box-shadow: 0 12px 30px rgba(14, 43, 59, 0.12);
        }

        .mobile-nav-link {
          display: flex;
          align-items: center;
          height: 48px;
          padding: 0 16px;
          border-radius: var(--r-tile);
          color: var(--ink);
          font-size: 18px;
          font-weight: 600;
          text-decoration: none;
          transition: background-color 0.15s;
        }

        .mobile-nav-link:hover {
          background: var(--pale);
        }

        .mobile-cta-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 52px;
          margin-top: 8px;
          background: var(--ink);
          color: var(--white);
          border-radius: var(--r-tile);
          font-size: 16px;
          font-weight: 700;
          text-decoration: none;
          transition: background-color 0.15s, color 0.15s;
        }

        .mobile-cta-btn:hover {
          background: var(--sun);
          color: var(--ink);
        }

        @media (max-width: 860px) {
          .nav-links {
            display: none !important;
          }
          .mobile-menu-btn {
            display: inline-flex;
          }
        }
      `}</style>
    </header>
  );
}
