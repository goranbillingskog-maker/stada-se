import { CITY_COORDS } from "../../../lib/services.js";

export const dynamic = "force-dynamic";

function dist(lat1, lon1, lat2, lon2) {
  const toRad = (d) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export async function GET(request) {
  const lat = parseFloat(request.headers.get("x-vercel-ip-latitude") || "");
  const lon = parseFloat(request.headers.get("x-vercel-ip-longitude") || "");

  let best = null;
  if (Number.isFinite(lat) && Number.isFinite(lon)) {
    let bestDist = Infinity;
    for (const [slug, [clat, clon]] of Object.entries(CITY_COORDS)) {
      const d = dist(lat, lon, clat, clon);
      if (d < bestDist) {
        bestDist = d;
        best = slug;
      }
    }
    if (bestDist > 200) best = null; // för långt från alla städer
  }

  return Response.json(
    { city: best },
    { headers: { "Cache-Control": "no-store" } }
  );
}
