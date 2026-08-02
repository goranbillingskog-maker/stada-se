"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const EMPTY_COMPANY = {
  company_name: "",
  legal_name: "",
  org_number: "",
  street_address: "",
  postal_code: "",
  city: "",
  area: "",
  phone: "",
  email: "",
  website: "",
  logo_url: "",
  image_urls: "",
  services: "",
  service_descriptions: "",
  service_areas: "",
  about: "",
  founded_year: "",
  founder: "",
  employees: "",
  legal_form: "",
  rut_avdrag: "Okänt",
  google_rating: "",
  google_reviews: "",
  hidden: false,
};

export default function AdminPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState(null);
  const [sha, setSha] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [editing, setEditing] = useState(null); // {index, data} eller {index: -1, data} för ny
  const [confirmDelete, setConfirmDelete] = useState(null); // index

  async function load() {
    setError("");
    try {
      const res = await fetch("/api/admin/companies/", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Kunde inte ladda företag.");
      setCompanies(data.companies);
      setSha(data.sha);
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const cities = useMemo(() => {
    if (!companies) return [];
    return [...new Set(companies.map((c) => c.city).filter(Boolean))].sort((a, b) =>
      a.localeCompare(b, "sv")
    );
  }, [companies]);

  const filtered = useMemo(() => {
    if (!companies) return [];
    const q = search.trim().toLowerCase();
    return companies
      .map((c, index) => ({ c, index }))
      .filter(({ c }) => (cityFilter ? c.city === cityFilter : true))
      .filter(({ c }) =>
        q ? (c.company_name || "").toLowerCase().includes(q) || (c.city || "").toLowerCase().includes(q) : true
      );
  }, [companies, search, cityFilter]);

  async function persist(nextCompanies, message) {
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const res = await fetch("/api/admin/companies/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companies: nextCompanies, sha, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Kunde inte spara.");
      setCompanies(nextCompanies);
      setSha(data.sha);
      setNotice(
        "Sparat! Sajten byggs om automatiskt på Vercel — ändringen syns live om 1–3 minuter."
      );
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  function startEdit(index) {
    const c = companies[index];
    setEditing({
      index,
      data: {
        ...EMPTY_COMPANY,
        ...c,
        services: Array.isArray(c.services) ? c.services.join(", ") : c.services || "",
      },
    });
  }

  function startNew() {
    setEditing({ index: -1, data: { ...EMPTY_COMPANY } });
  }

  function saveEdit(e) {
    e.preventDefault();
    const { index, data } = editing;
    const cleaned = {
      ...data,
      services: data.services
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .join("|"),
    };
    let next;
    if (index === -1) {
      next = [...companies, cleaned];
    } else {
      next = companies.map((c, i) => (i === index ? { ...c, ...cleaned } : c));
    }
    setEditing(null);
    persist(next, index === -1 ? `Lägg till ${cleaned.company_name}` : `Uppdatera ${cleaned.company_name}`);
  }

  function toggleHidden(index) {
    const next = companies.map((c, i) =>
      i === index ? { ...c, hidden: !c.hidden } : c
    );
    persist(
      next,
      next[index].hidden
        ? `Dölj ${next[index].company_name}`
        : `Visa ${next[index].company_name}`
    );
  }

  function doDelete(index) {
    const name = companies[index].company_name;
    const next = companies.filter((_, i) => i !== index);
    setConfirmDelete(null);
    persist(next, `Ta bort ${name}`);
  }

  async function logout() {
    await fetch("/api/admin/logout/", { method: "POST" });
    router.push("/admin/login");
  }

  if (error && !companies) {
    return (
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container">
          <p style={{ color: "#a32d2d" }}>{error}</p>
        </div>
      </section>
    );
  }

  if (!companies) {
    return (
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container">
          <p>Laddar…</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section" style={{ paddingTop: 32 }}>
      <div className="container">
        <div className="admin-bar">
          <h1 style={{ fontSize: "1.5rem", margin: 0 }}>Städtorget admin</h1>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--ink-soft)" }}>
              {companies.length} företag
            </span>
            <button className="btn btn-outline" onClick={logout} type="button">
              Logga ut
            </button>
          </div>
        </div>

        {notice ? (
          <p style={{ background: "var(--teal-light)", color: "var(--teal)", padding: "10px 16px", borderRadius: 10, fontSize: "0.9rem" }}>
            {notice}
          </p>
        ) : null}
        {error ? (
          <p style={{ background: "#fcebeb", color: "#a32d2d", padding: "10px 16px", borderRadius: 10, fontSize: "0.9rem" }}>
            {error}
          </p>
        ) : null}

        {editing ? (
          <div className="panel">
            <h2>{editing.index === -1 ? "Lägg till företag" : "Redigera företag"}</h2>
            <form onSubmit={saveEdit} className="admin-form">
              <div>
                <label>Företagsnamn *</label>
                <input
                  required
                  value={editing.data.company_name}
                  onChange={(e) => setEditing({ ...editing, data: { ...editing.data, company_name: e.target.value } })}
                />
              </div>
              <div>
                <label>Stad *</label>
                <input
                  required
                  value={editing.data.city}
                  onChange={(e) => setEditing({ ...editing, data: { ...editing.data, city: e.target.value } })}
                />
              </div>
              <div>
                <label>Område</label>
                <input
                  value={editing.data.area}
                  onChange={(e) => setEditing({ ...editing, data: { ...editing.data, area: e.target.value } })}
                />
              </div>
              <div>
                <label>Adress</label>
                <input
                  value={editing.data.street_address}
                  onChange={(e) => setEditing({ ...editing, data: { ...editing.data, street_address: e.target.value } })}
                />
              </div>
              <div>
                <label>Telefon</label>
                <input
                  value={editing.data.phone}
                  onChange={(e) => setEditing({ ...editing, data: { ...editing.data, phone: e.target.value } })}
                />
              </div>
              <div>
                <label>E-post</label>
                <input
                  value={editing.data.email}
                  onChange={(e) => setEditing({ ...editing, data: { ...editing.data, email: e.target.value } })}
                />
              </div>
              <div className="full">
                <label>Webbplats</label>
                <input
                  value={editing.data.website}
                  onChange={(e) => setEditing({ ...editing, data: { ...editing.data, website: e.target.value } })}
                />
              </div>
              <div className="full">
                <label>Tjänster (kommaseparerat)</label>
                <input
                  placeholder="Hemstädning, Flyttstädning, Fönsterputs"
                  value={editing.data.services}
                  onChange={(e) => setEditing({ ...editing, data: { ...editing.data, services: e.target.value } })}
                />
              </div>
              <div className="full">
                <label>Om företaget</label>
                <textarea
                  rows={3}
                  value={editing.data.about}
                  onChange={(e) => setEditing({ ...editing, data: { ...editing.data, about: e.target.value } })}
                />
              </div>
              <div>
                <label>RUT-avdrag</label>
                <select
                  value={editing.data.rut_avdrag}
                  onChange={(e) => setEditing({ ...editing, data: { ...editing.data, rut_avdrag: e.target.value } })}
                >
                  <option value="Okänt">Okänt</option>
                  <option value="Ja">Ja</option>
                  <option value="Nej">Nej</option>
                </select>
              </div>
              <div>
                <label>Google-betyg (0–5)</label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={editing.data.google_rating}
                  onChange={(e) => setEditing({ ...editing, data: { ...editing.data, google_rating: e.target.value } })}
                />
              </div>
              <div>
                <label>Antal omdömen</label>
                <input
                  type="number"
                  min="0"
                  value={editing.data.google_reviews}
                  onChange={(e) => setEditing({ ...editing, data: { ...editing.data, google_reviews: e.target.value } })}
                />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="checkbox"
                  id="hidden-checkbox"
                  checked={Boolean(editing.data.hidden)}
                  onChange={(e) => setEditing({ ...editing, data: { ...editing.data, hidden: e.target.checked } })}
                  style={{ width: "auto" }}
                />
                <label htmlFor="hidden-checkbox" style={{ margin: 0 }}>Dold (visas inte på sajten)</label>
              </div>
              <div className="full" style={{ display: "flex", gap: 10 }}>
                <button className="btn btn-primary" type="submit" disabled={saving}>
                  {saving ? "Sparar…" : "Spara"}
                </button>
                <button className="btn btn-outline" type="button" onClick={() => setEditing(null)}>
                  Avbryt
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            <div className="admin-toolbar">
              <input
                type="text"
                placeholder="Sök namn eller stad…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}>
                <option value="">Alla städer</option>
                {cities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <button className="btn btn-primary" type="button" onClick={startNew}>
                + Lägg till företag
              </button>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Företag</th>
                    <th>Stad</th>
                    <th>Status</th>
                    <th style={{ textAlign: "right" }}>Åtgärder</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(({ c, index }) => (
                    <tr key={index}>
                      <td>{c.company_name}</td>
                      <td>{c.city}</td>
                      <td>
                        <span className={c.hidden ? "status-pill status-hidden" : "status-pill status-visible"}>
                          {c.hidden ? "Dold" : "Synlig"}
                        </span>
                      </td>
                      <td className="admin-actions" style={{ textAlign: "right" }}>
                        <button type="button" onClick={() => startEdit(index)}>Redigera</button>
                        <button type="button" onClick={() => toggleHidden(index)} disabled={saving}>
                          {c.hidden ? "Visa" : "Dölj"}
                        </button>
                        {confirmDelete === index ? (
                          <>
                            <button type="button" onClick={() => doDelete(index)} disabled={saving} style={{ color: "#a32d2d" }}>
                              Bekräfta
                            </button>
                            <button type="button" onClick={() => setConfirmDelete(null)}>Avbryt</button>
                          </>
                        ) : (
                          <button type="button" onClick={() => setConfirmDelete(index)}>Ta bort</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 ? <p style={{ color: "var(--ink-soft)" }}>Inga träffar.</p> : null}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
