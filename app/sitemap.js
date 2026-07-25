import { getCities, getAllCompanies, SITE_URL } from "../lib/data.js";

export default function sitemap() {
  const now = new Date();
  const entries = [
    { url: `${SITE_URL}/`, lastModified: now, priority: 1 },
    { url: `${SITE_URL}/om-oss/`, lastModified: now, priority: 0.3 },
  ];
  for (const c of getCities()) {
    entries.push({
      url: `${SITE_URL}/${c.slug}/`,
      lastModified: now,
      priority: 0.9,
    });
  }
  for (const c of getAllCompanies()) {
    entries.push({
      url: `${SITE_URL}/${c.citySlug}/${c.slug}/`,
      lastModified: now,
      priority: 0.7,
    });
  }
  return entries;
}
