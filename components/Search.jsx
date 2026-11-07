"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function normalizeText(str) {
  return String(str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

const STOP_WORDS = new Set([
  "foretag", "stadforetag", "stadfirma", "stadfirmor", "stadbolag",
  "stad", "stadning", "stadare", "pa", "i", "hos", "till", "om", "en", "ett", "av", "och"
]);

export default function Search() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(null);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  async function loadIndex() {
    if (index) return;
    try {
      const res = await fetch("/api/search-index/?v=20260922c", { cache: "no-cache" });
      if (!res.ok) throw new Error("Kunde inte ladda sökindex");
      setIndex(await res.json());
    } catch {
      try {
        const fallback = await fetch("/api/search-index/");
        setIndex(await fallback.json());
      } catch {
        setIndex({ cities: [], companies: [] });
      }
    }
  }

  useEffect(() => {
    loadIndex();
  }, []);

  useEffect(() => {
    function onClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const rawQ = query.trim();
  const normQ = normalizeText(rawQ);

  let cityHits = [];
  let companyHits = [];

  if (index && normQ.length >= 2) {
    cityHits = index.cities.filter((c) => {
      const name = normalizeText(c.name);
      const slug = normalizeText(c.slug);
      return name.includes(normQ) || slug.includes(normQ);
    }).slice(0, 4);

    companyHits = index.companies.filter((c) => {
      const name = normalizeText(c.name);
      const city = normalizeText(c.city);
      const citySlug = normalizeText(c.citySlug);
      const area = normalizeText(c.area);
      return name.includes(normQ) || city.includes(normQ) || citySlug.includes(normQ) || area.includes(normQ);
    }).slice(0, 8);

    if (cityHits.length === 0 || companyHits.length === 0) {
      const tokens = normQ.split(/[\s,.-]+/).filter((t) => t && !STOP_WORDS.has(t));
      const searchTokens = tokens.length > 0 ? tokens : [normQ];

      if (cityHits.length === 0) {
        cityHits = index.cities.filter((c) => {
          const name = normalizeText(c.name);
          const slug = normalizeText(c.slug);
          return searchTokens.some((t) => name.includes(t) || slug.includes(t));
        }).slice(0, 4);
      }

      if (companyHits.length === 0) {
        companyHits = index.companies.filter((c) => {
          const name = normalizeText(c.name);
          const city = normalizeText(c.city);
          const citySlug = normalizeText(c.citySlug);
          const area = normalizeText(c.area);
          return searchTokens.every((t) => name.includes(t) || city.includes(t) || citySlug.includes(t) || area.includes(t));
        }).slice(0, 8);
      }
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (cityHits.length > 0) {
      setOpen(false);
      router.push(`/${cityHits[0].slug}/`);
    } else if (companyHits.length > 0) {
      setOpen(false);
      router.push(`/${companyHits[0].citySlug}/${companyHits[0].slug}/`);
    } else if (normQ.length >= 2) {
      // Om ingen direkt träff, scrolla till städer
      const elem = document.getElementById("stader");
      if (elem) elem.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <div style={{ position: "relative", maxWidth: "520px", width: "100%" }} ref={wrapRef}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "flex-end" }}>
        <div style={{ flex: "1 1 220px", display: "flex", flexDirection: "column", gap: "6px" }}>
          <label className="w" htmlFor="search-stad" style={{ fontSize: "14px", fontWeight: 650 }}>
            Din stad
          </label>
          <input
            id="search-stad"
            type="text"
            placeholder="Till exempel Uppsala"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
              loadIndex();
            }}
            onFocus={() => {
              setOpen(true);
              loadIndex();
            }}
            style={{
              boxSizing: "border-box",
              height: "56px",
              padding: "0 16px",
              border: "2px solid var(--ink)",
              borderRadius: "var(--r-tile)",
              background: "var(--white)",
              font: "inherit",
              fontSize: "17px",
              color: "var(--ink)",
              outline: "none",
            }}
          />
        </div>
        <button
          className="w"
          type="submit"
          style={{
            height: "56px",
            padding: "0 24px",
            border: 0,
            borderRadius: "var(--r-tile)",
            background: "var(--sun)",
            color: "var(--ink)",
            fontSize: "15px",
            fontWeight: 700,
            cursor: "pointer",
            transition: "background-color 0.15s",
          }}
        >
          Visa städfirmor
        </button>
      </form>

      {open && rawQ.length >= 2 && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            right: 0,
            background: "var(--grout)",
            padding: "6px",
            borderRadius: "var(--r-box)",
            boxShadow: "0 10px 25px rgba(14, 43, 59, 0.15)",
            zIndex: 100,
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            maxHeight: "360px",
            overflowY: "auto",
          }}
        >
          {cityHits.map((c) => (
            <Link
              key={c.slug}
              href={`/${c.slug}/`}
              onClick={() => setOpen(false)}
              className="search-hit"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px",
                background: "var(--white)",
                borderRadius: "var(--r-tile)",
                color: "var(--ink)",
                transition: "background-color 0.15s",
              }}
            >
              <span className="d" style={{ fontSize: "18px" }}>{c.name}</span>
              <span className="w" style={{ fontSize: "13px", color: "var(--text-3)" }}>
                {c.count} städfirmor →
              </span>
            </Link>
          ))}

          {companyHits.map((c) => (
            <Link
              key={`${c.citySlug}/${c.slug}`}
              href={`/${c.citySlug}/${c.slug}/`}
              onClick={() => setOpen(false)}
              className="search-hit"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px",
                background: "var(--white)",
                borderRadius: "var(--r-tile)",
                color: "var(--ink)",
                transition: "background-color 0.15s",
              }}
            >
              <span style={{ fontWeight: 600, fontSize: "15px" }}>{c.name}</span>
              <span className="w" style={{ fontSize: "13px", color: "var(--text-3)" }}>
                {c.city}
              </span>
            </Link>
          ))}

          {!cityHits.length && !companyHits.length && (
            <div
              style={{
                padding: "16px",
                background: "var(--white)",
                borderRadius: "var(--r-tile)",
                color: "var(--text-3)",
                fontSize: "14px",
                textAlign: "center",
              }}
            >
              {index ? "Inga träffar – prova ett annat ord." : "Laddar städer och firmor…"}
            </div>
          )}
        </div>
      )}

      <style>{`
        .search-hit:hover {
          background: var(--sun) !important;
        }
      `}</style>
    </div>
  );
}
