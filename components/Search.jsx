"use client";

import { useEffect, useRef, useState } from "react";
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
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(null);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  async function loadIndex() {
    if (index) return;
    try {
      // Använd versionsparameter och no-cache för att tvinga webbläsaren att kringgå äldre diskcache
      const res = await fetch("/api/search-index/?v=20260922c", { cache: "no-cache" });
      if (!res.ok) throw new Error("Kunde inte ladda sökindex");
      setIndex(await res.json());
    } catch (e) {
      console.error("Fel vid laddning av sökindex:", e);
      try {
        const fallback = await fetch("/api/search-index/");
        setIndex(await fallback.json());
      } catch {
        setIndex({ cities: [], companies: [] });
      }
    }
  }

  // Förladda indexet direkt vid sidladdning i bakgrunden
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
    // 1. Försök hitta städer (matcha både visningsnamn och slug, med och utan å/ä/ö)
    cityHits = index.cities.filter((c) => {
      const name = normalizeText(c.name);
      const slug = normalizeText(c.slug);
      return name.includes(normQ) || slug.includes(normQ);
    }).slice(0, 4);

    // 2. Försök hitta företag (matcha namn, stad, slug, delområde)
    companyHits = index.companies.filter((c) => {
      const name = normalizeText(c.name);
      const city = normalizeText(c.city);
      const citySlug = normalizeText(c.citySlug);
      const area = normalizeText(c.area);
      return name.includes(normQ) || city.includes(normQ) || citySlug.includes(normQ) || area.includes(normQ);
    }).slice(0, 8);

    // 3. Om få eller inga träffar, tokenisera och ta bort fyllnadsord (t.ex. "företag", "på", "i", "städfirma")
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

  return (
    <div className="search-wrap" ref={wrapRef}>
      <input
        type="search"
        className="search-input"
        placeholder="Sök stad eller städfirma…"
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
        aria-label="Sök stad eller städfirma"
      />
      {open && rawQ.length >= 2 ? (
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
