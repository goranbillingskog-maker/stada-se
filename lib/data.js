import fs from "fs";
import path from "path";
import raw from "../data/companies.json";
import { slugify } from "./slug.js";

export const SITE_URL = process.env.SITE_URL || "https://stada.se";
export const SITE_NAME = "Stada.se";

// Optional manifest written by scripts/download-images.mjs
let imageManifest = {};
try {
  const p = path.join(process.cwd(), "data", "images-manifest.json");
  if (fs.existsSync(p)) {
    imageManifest = JSON.parse(fs.readFileSync(p, "utf8"));
  }
} catch {
  imageManifest = {};
}

function splitList(value) {
  if (!value) return [];
  return String(value)
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);
}

function clean(value) {
  const s = String(value ?? "").trim();
  return s;
}

function faviconFor(website, logoUrl) {
  if (logoUrl && logoUrl.includes("google.com/s2/favicons")) return logoUrl;
  if (website) {
    try {
      const host = new URL(website).hostname;
      return `https://www.google.com/s2/favicons?domain=${host}&sz=128`;
    } catch {
      return "";
    }
  }
  return "";
}

function buildCompanies() {
  const seen = new Map();
  const companies = raw.map((r) => {
    const name = clean(r.company_name);
    const city = clean(r.city);
    const citySlug = slugify(city);
    let slug = slugify(name) || "foretag";
    const key = `${citySlug}/${slug}`;
    if (seen.has(key)) {
      const n = seen.get(key) + 1;
      seen.set(key, n);
      slug = `${slug}-${n}`;
    } else {
      seen.set(key, 1);
    }

    const website = clean(r.website);
    const logoUrl = clean(r.logo_url);
    const manifestEntry = imageManifest[`${citySlug}/${slug}`] || {};
    const rating = r.google_rating ? parseFloat(r.google_rating) : null;
    const reviews = r.google_reviews ? parseInt(r.google_reviews, 10) : null;

    return {
      name,
      legalName: clean(r.legal_name),
      orgNumber: clean(r.org_number),
      address: clean(r.street_address),
      postalCode: clean(r.postal_code),
      city,
      citySlug,
      area: clean(r.area),
      phone: clean(r.phone),
      email: clean(r.email),
      website,
      services: splitList(r.services),
      serviceDescriptions: clean(r.service_descriptions),
      serviceAreas: clean(r.service_areas),
      about: clean(r.about),
      foundedYear: clean(r.founded_year),
      founder: clean(r.founder),
      employees: clean(r.employees),
      legalForm: clean(r.legal_form),
      rutAvdrag: clean(r.rut_avdrag),
      rating: Number.isFinite(rating) ? rating : null,
      reviews: Number.isFinite(reviews) ? reviews : null,
      reviewSnippets: splitList(r.review_snippets),
      otherRatings: clean(r.other_ratings),
      certifications: splitList(r.certifications),
      bookingMethod: clean(r.booking_method),
      pricingInfo: clean(r.pricing_info),
      languages: splitList(r.languages),
      socialLinks: splitList(r.social_links),
      mapsUrl: clean(r.google_maps_url),
      lastVerified: clean(r.last_verified),
      slug,
      logo: manifestEntry.logo || "",
      photo: manifestEntry.photo || "",
      favicon: faviconFor(website, logoUrl),
    };
  });
  return companies;
}

const ALL = buildCompanies();

export function getAllCompanies() {
  return ALL;
}

export function getCities() {
  const map = new Map();
  for (const c of ALL) {
    if (!map.has(c.citySlug)) {
      map.set(c.citySlug, { name: c.city, slug: c.citySlug, count: 0, ratings: [] });
    }
    const entry = map.get(c.citySlug);
    entry.count += 1;
    if (c.rating) entry.ratings.push(c.rating);
  }
  const cities = [...map.values()].map((c) => ({
    name: c.name,
    slug: c.slug,
    count: c.count,
    avgRating: c.ratings.length
      ? Math.round((c.ratings.reduce((a, b) => a + b, 0) / c.ratings.length) * 10) / 10
      : null,
  }));
  cities.sort((a, b) => a.name.localeCompare(b.name, "sv"));
  return cities;
}

export function getCity(citySlug) {
  return getCities().find((c) => c.slug === citySlug) || null;
}

export function getCompaniesByCity(citySlug) {
  const list = ALL.filter((c) => c.citySlug === citySlug);
  list.sort((a, b) => {
    const ra = a.rating ?? -1;
    const rb = b.rating ?? -1;
    if (rb !== ra) return rb - ra;
    return (b.reviews ?? 0) - (a.reviews ?? 0);
  });
  return list;
}

export function getCompany(citySlug, slug) {
  return ALL.find((c) => c.citySlug === citySlug && c.slug === slug) || null;
}

export function getTopCompanies(limit = 6) {
  return [...ALL]
    .filter((c) => c.rating && c.reviews && c.reviews >= 10)
    .sort((a, b) => b.rating - a.rating || b.reviews - a.reviews)
    .slice(0, limit);
}

export function topServicesInCity(citySlug, limit = 5) {
  const counts = new Map();
  for (const c of getCompaniesByCity(citySlug)) {
    for (const s of c.services) {
      counts.set(s, (counts.get(s) || 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, count]) => ({ name, count }));
}

export function initials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}
