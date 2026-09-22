"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function Search() {
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(null);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  async function loadIndex() {
    if (index) return;
    try {
      const res = await fetch("/api/search-index/");
      setIndex(await res.json());
    } catch {
      setIndex({ cities: [], companies: [] });
    }
  }

  useEffect(() => {
    function onClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const rawQ = query.trim().toLowerCase();
  const q = rawQ;
  let cityHits = [];
  let companyHits = [];
  if (index && rawQ.length >= 2) {
    // 1. Direkt delsträngsmatchning
    cityHits = index.cities.filter((c) => c.name.toLowerCase().includes(rawQ)).slice(0, 4);
    companyHits = index.companies
      .filter((c) => c.name.toLowerCase().includes(rawQ) || c.city.toLowerCase().includes(rawQ) || (c.area && c.area.toLowerCase().includes(rawQ)))
      .slice(0, 8);

    // 2. Om ingen direkt träff, eller sökfrasen innehåller vanliga ord som "företag", "på", "i", "städfirma"
    if (!cityHits.length || !companyHits.length) {
      const stopWords = new Set([
        "företag", "städföretag", "städfirma", "städfirmor", "städbolag",
        "städ", "städning", "städare", "på", "i", "hos", "till", "om", "en", "ett", "av", "och"
      ]);
      const tokens = rawQ.split(/[\s,.-]+/).filter((t) => t && !stopWords.has(t));

      if (tokens.length > 0) {
        if (!cityHits.length) {
          cityHits = index.cities.filter((c) => {
            const cityName = c.name.toLowerCase();
            return tokens.some((t) => cityName.includes(t));
          }).slice(0, 4);
        }

        if (!companyHits.length) {
          companyHits = index.companies.filter((c) => {
            const name = c.name.toLowerCase();
            const city = c.city.toLowerCase();
            const area = (c.area || "").toLowerCase();
            return tokens.every((t) => name.includes(t) || city.includes(t) || area.includes(t));
          }).slice(0, 8);
        }
      }
    }
  }

  return (
    <div className="search-wrap" ref={wrapRef}>
      <input
        type="search"
        className="search-input"
        placeholder="Sök stad eller städfirma…"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => { loadIndex(); setOpen(true); }}
        aria-label="Sök stad eller städfirma"
      />
      {open && q.length >= 2 ? (
        <div className="search-results">
          {cityHits.map((c) => (
            <Link key={c.slug} href={`/${c.slug}/`} onClick={() => setOpen(false)}>
              <span><strong>{c.name}</strong></span>
              <span className="kind">{c.count} städfirmor →</span>
            </Link>
          ))}
          {companyHits.map((c) => (
            <Link key={`${c.citySlug}/${c.slug}`} href={`/${c.citySlug}/${c.slug}/`} onClick={() => setOpen(false)}>
              <span>{c.name}</span>
              <span className="kind">{c.city}</span>
            </Link>
          ))}
          {!cityHits.length && !companyHits.length ? (
            <div className="search-empty">
              {index ? "Inga träffar – prova ett annat ord." : "Laddar…"}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
