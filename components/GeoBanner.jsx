"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function GeoBanner({ cities }) {
  const [citySlug, setCitySlug] = useState("");
  const router = useRouter();

  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem("stada-city") : null;
    if (saved && cities.some((c) => c.slug === saved)) {
      setCitySlug(saved);
      return;
    }
    fetch("/api/geo/")
      .then((r) => r.json())
      .then((d) => {
        if (d.city && cities.some((c) => c.slug === d.city)) setCitySlug(d.city);
      })
      .catch(() => {});
  }, [cities]);

  function onChange(e) {
    const slug = e.target.value;
    setCitySlug(slug);
    if (slug) window.localStorage.setItem("stada-city", slug);
  }

  const current = cities.find((c) => c.slug === citySlug);

  return (
    <div>
      <div className="geo-chip">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <span>Din stad:</span>
        <select value={citySlug} onChange={onChange} aria-label="Välj din stad">
          <option value="">Välj stad…</option>
          {cities.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>
      {current ? (
        <div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => router.push(`/${current.slug}/`)}
          >
            Se {current.count} städfirmor i {current.name} →
          </button>
        </div>
      ) : null}
    </div>
  );
}
