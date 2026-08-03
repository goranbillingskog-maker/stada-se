"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

// Samma tjänster som visas som egna SEO-sidor på sajten (lib/services.js).
// Kryssrutorna nedan matchar dessa namn exakt.
const KNOWN_SERVICES = [
  "Hemstädning",
  "Flyttstädning",
  "Kontorsstädning",
  "Storstädning",
  "Fönsterputs",
  "Byggstädning",
  "Trappstädning",
];

const EMPTY_COMPANY = {
  company_name: "",
  legal_name: "",
  org_number: "",
  legal_form: "",
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
  rut_avdrag: "Okänt",
  pricing_info: "",
  booking_method: "",
  google_rating: "",
  google_reviews: "",
  google_maps_url: "",
  review_snippets: "",
  other_ratings: "",
  certifications: "",
  languages: "",
  social_links: "",
  last_verified: "",
  hidden: false,
};

// Tjänster lagras som en "|"-separerad textsträng i data-filen (t.ex.
// "Hemstädning|Flyttstädning|Balkongstädning"). Vi delar upp det i dels de
// kända tjänsterna (kryssrutor) och dels resten (fritext).
function splitServices(servicesValue) {
  const list = Array.isArray(servicesValue)
    ? servicesValue
    : String(servicesValue || "")
        .split("|")
        .map((s) => s.trim())
        .filter(Boolean);
  const checked = new Set();
  const extra = [];
  for (const s of list) {
    const match = KNOWN_SERVICES.find((k) => k.toLowerCase() === s.toLowerCase());
    if (match) checked.add(match);
    else extra.push(s);
  }
  return { checked, extraText: extra.join(", ") };
}

function joinServices(checkedSet, extraText) {
  const extra = extraText
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return [...KNOWN_SERVICES.filter((s) => checkedSet.has(s)), ...extra].join("|");
}

export default function AdminPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState(null);
  const [sha, setSha] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [editing, setEditing] = useState(null); // {index, data, serviceChecks, serviceExtra} eller {index: -1, ...} för ny
  const [confirmDelete, setConfirmDelete] = useState(null); // index
  const [autofillName, setAutofillName] = useState("");
  const [autofillCity, setAutofillCity] = useState("");
  const [autofillWebsite, setAutofillWebsite] = useState("");
  const [autofillLoading, setAutofillLoading] = useState(false);
  const [autofillError, setAutofillError] = useState("");
  const [autofillNotice, setAutofillNotice] = useState("");

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
    const { checked, extraText } = splitServices(c.services);
    setEditing({
      index,
      data: { ...EMPTY_COMPANY, ...c },
      serviceChecks: checked,
      serviceExtra: extraText,
    });
  }

  function startNew() {
    setEditing({
      index: -1,
      data: { ...EMPTY_COMPANY },
      serviceChecks: new Set(),
      serviceExtra: "",
    });
  }

  function toggleServiceCheck(name) {
    setEditing((prev) => {
      const next = new Set(prev.serviceChecks);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return { ...prev, serviceChecks: next };
    });
  }

  async function runAutofill() {
    if (!autofillName.trim() || !autofillCity.trim()) {
      setAutofillError("Ange både företagsnamn och stad.");
      return;
    }
    setAutofillLoading(true);
    setAutofillError("");
    setAutofillNotice("");
    try {
      const res = await fetch("/api/admin/autofill/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_name: autofillName.trim(),
          city: autofillCity.trim(),
          website: autofillWebsite.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Kunde inte hämta data automatiskt.");
      const { checked, extraText } = splitServices(data.draft.services);
      setEditing((prev) => ({
        ...prev,
        data: { ...prev.data, ...data.draft },
        serviceChecks: checked,
        serviceExtra: extraText,
      }));
      setAutofillNotice(
        data.siteExtractionSkipped
          ? "Grunddata hämtad från Google Maps. Ingen hemsida hittades, så organisationsnummer/prisinfo/bokning fick fyllas i manuellt."
          : "Utkast ifyllt nedan – granska och rätta innan du sparar."
      );
    } catch (e) {
      setAutofillError(e.message);
    } finally {
      setAutofillLoading(false);
    }
  }

  function saveEdit(e) {
    e.preventDefault();
    const { index, data, serviceChecks, serviceExtra } = editing;
    const cleaned = {
      ...data,
      services: joinServices(serviceChecks, serviceExtra),
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

  function field(label, key, props = {}) {
    return (
      <div className={props.full ? "full" : undefined}>
        <label>{label}</label>
        {props.textarea ? (
          <textarea
            rows={props.rows || 3}
            value={editing.data[key]}
            onChange={(e) => setEditing({ ...editing, data: { ...editing.data, [key]: e.target.value } })}
          />
        ) : (
          <input
            type={props.type || "text"}
            min={props.min}
            max={props.max}
            step={props.step}
            placeholder={props.placeholder}
            required={props.required}
            value={editing.data[key]}
            onChange={(e) => setEditing({ ...editing, data: { ...editing.data, [key]: e.target.value } })}
          />
        )}
      </div>
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
            {editing.index === -1 ? (
              <div className="panel" style={{ background: "var(--teal-light)", marginBottom: 16 }}>
                <p style={{ margin: "0 0 8px", fontWeight: 600 }}>Hämta automatiskt (BrowserAct)</p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
                  <div>
                    <label>Företagsnamn</label>
                    <input
                      type="text"
                      value={autofillName}
                      onChange={(e) => setAutofillName(e.target.value)}
                      placeholder="T.ex. Ren Städ AB"
                    />
                  </div>
                  <div>
                    <label>Stad</label>
                    <input
                      type="text"
                      value={autofillCity}
                      onChange={(e) => setAutofillCity(e.target.value)}
                      placeholder="T.ex. Göteborg"
                    />
                  </div>
                  <div>
                    <label>Hemsida (valfritt, om du redan vet den)</label>
                    <input
                      type="text"
                      value={autofillWebsite}
                      onChange={(e) => setAutofillWebsite(e.target.value)}
                      placeholder="https://exempel.se"
                    />
                  </div>
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={runAutofill}
                    disabled={autofillLoading}
                  >
                    {autofillLoading ? "Hämtar…" : "Hämta automatiskt"}
                  </button>
                </div>
                {autofillError ? (
                  <p style={{ color: "#a32d2d", marginTop: 8, marginBottom: 0 }}>{autofillError}</p>
                ) : null}
                {autofillNotice ? (
                  <p style={{ color: "var(--teal)", marginTop: 8, marginBottom: 0 }}>{autofillNotice}</p>
                ) : null}
              </div>
            ) : null}
            <form onSubmit={saveEdit} className="admin-form">
              <h3 className="full" style={{ margin: "4px 0 -4px" }}>Grunduppgifter</h3>
              {field("Företagsnamn *", "company_name", { required: true })}
              {field("Juridiskt namn", "legal_name")}
              {field("Organisationsnummer", "org_number", { placeholder: "556677-8899" })}
              {field("Bolagsform", "legal_form", { placeholder: "Aktiebolag, Enskild firma…" })}
              {field("Grundat år", "founded_year", { placeholder: "2015" })}
              {field("Grundare", "founder")}
              {field("Antal anställda", "employees", { placeholder: "1-5" })}

              <h3 className="full" style={{ margin: "4px 0 -4px" }}>Adress</h3>
              {field("Adress", "street_address")}
              {field("Postnummer", "postal_code")}
              {field("Stad *", "city", { required: true })}
              {field("Område", "area")}

              <h3 className="full" style={{ margin: "4px 0 -4px" }}>Kontakt</h3>
              {field("Telefon", "phone")}
              {field("E-post", "email")}
              {field("Webbplats", "website", { full: true })}
              {field("Google Maps-länk", "google_maps_url", { full: true })}
              {field("Sociala medier-länkar (kommaseparerat)", "social_links", { full: true, placeholder: "https://facebook.com/..., https://instagram.com/..." })}

              <h3 className="full" style={{ margin: "4px 0 -4px" }}>Tjänster</h3>
              <div className="full">
                <label>Tjänster som erbjuds</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 20px", marginTop: 4 }}>
                  {KNOWN_SERVICES.map((name) => (
                    <label key={name} style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 400 }}>
                      <input
                        type="checkbox"
                        style={{ width: "auto" }}
                        checked={editing.serviceChecks.has(name)}
                        onChange={() => toggleServiceCheck(name)}
                      />
                      {name}
                    </label>
                  ))}
                </div>
              </div>
              <div className="full">
                <label>Övriga tjänster (kommaseparerat)</label>
                <input
                  placeholder="Balkongstädning, Fordonstvätt…"
                  value={editing.serviceExtra}
                  onChange={(e) => setEditing({ ...editing, serviceExtra: e.target.value })}
                />
              </div>
              {field("Beskrivning av tjänster", "service_descriptions", { full: true, textarea: true, rows: 2 })}
              {field("Verksamhetsområde (t.ex. städer/kommuner)", "service_areas", { full: true })}

              <h3 className="full" style={{ margin: "4px 0 -4px" }}>Om företaget</h3>
              {field("Om företaget", "about", { full: true, textarea: true })}

              <h3 className="full" style={{ margin: "4px 0 -4px" }}>Pris & bokning</h3>
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
              {field("Bokningssätt", "booking_method", { placeholder: "Telefon, hemsida, e-post…" })}
              {field("Prisinformation", "pricing_info", { full: true, textarea: true, rows: 2, placeholder: "T.ex. 350 kr/timme efter RUT-avdrag" })}

              <h3 className="full" style={{ margin: "4px 0 -4px" }}>Betyg & recensioner</h3>
              {field("Google-betyg (0–5)", "google_rating", { type: "number", min: "0", max: "5", step: "0.1" })}
              {field("Antal omdömen", "google_reviews", { type: "number", min: "0" })}
              {field("Övriga betyg", "other_ratings", { placeholder: "Trustpilot 4,5 (12 omdömen)" })}
              {field("Certifieringar (kommaseparerat)", "certifications", { placeholder: "F-skatt, ISO 9001…" })}
              {field("Språk som talas (kommaseparerat)", "languages", { placeholder: "Svenska, Engelska" })}
              {field("Citat från recensioner (kommaseparerat)", "review_snippets", { full: true, textarea: true, rows: 2, placeholder: "Jättenöjd med städningen!, Alltid punktliga…" })}
              {field("Senast verifierad", "last_verified", { placeholder: "2026-08-01" })}

              <h3 className="full" style={{ margin: "4px 0 -4px" }}>Bilder</h3>
              {field("Logotyp-URL", "logo_url", { full: true, placeholder: "https://exempel.se/logo.png" })}
              {field("Bild-URL:er (kommaseparerat, första används som foto)", "image_urls", { full: true, placeholder: "https://exempel.se/foto1.jpg, https://exempel.se/foto2.jpg" })}
              <p className="full" style={{ fontSize: "0.85rem", color: "var(--ink-soft)", margin: "-6px 0 0" }}>
                Bilder laddas ner automatiskt till Vercels CDN nästa gång sajten byggs om (kan ta någon minut extra efter sparande).
              </p>

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
