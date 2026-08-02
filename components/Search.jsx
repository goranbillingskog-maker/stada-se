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

  const q = query.trim().toLowerCase();
  let cityHits = [];
  let companyHits = [];
  if (index && q.length >= 2) {
    cityHits = index.cities.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 4);
    companyHits = index.companies
      .filter((c) => c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q))
      .slice(0, 8);
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
