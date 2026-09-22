import { getAllCompanies, getCities } from "../../../lib/data.js";

export async function GET() {
  const cities = getCities().map((c) => ({ name: c.name, slug: c.slug, count: c.count }));
  const companies = getAllCompanies().map((c) => ({
    name: c.name,
    city: c.city,
    citySlug: c.citySlug,
    slug: c.slug,
    area: c.area || "",
  }));
  return Response.json(
    { cities, companies },
    { headers: { "Cache-Control": "public, max-age=60, s-maxage=300" } }
  );
}
