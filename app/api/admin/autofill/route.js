import { NextResponse } from "next/server";
import { lookupGoogleMaps, extractFromWebsite } from "../../../../lib/browseract.js";

export const dynamic = "force-dynamic";

// Tar ett företagsnamn + stad, hämtar data via BrowserAct, och lämnar
// tillbaka ett objekt med samma fältnamn som companies.json/admin-formuläret.
// Sparar INGENTING – adminpanelen visar det bara som ett ifyllt utkast som
// du själv granskar och klickar "Spara" på.
export async function POST(request) {
  try {
    const { company_name, city } = await request.json();
    if (!company_name || !city) {
      return NextResponse.json(
        { error: "Ange både företagsnamn och stad." },
        { status: 400 }
      );
    }

    const { best, allResults } = await lookupGoogleMaps(company_name, city);
    if (!best) {
      return NextResponse.json(
        { error: `Hittade inget på Google Maps för "${company_name}" i ${city}. Prova ett annat sökord eller fyll i manuellt.` },
        { status: 404 }
      );
    }

    const website = best.website || best.website_url || "";
    let siteData = null;
    try {
      siteData = website ? await extractFromWebsite(website) : null;
    } catch (e) {
      // Misslyckas hemsidesextraktionen (t.ex. sidan blockerar botar) fortsätter
      // vi ändå med Google Maps-datan – bättre ett halvfyllt utkast än inget alls.
      siteData = { _error: e.message };
    }

    const draft = {
      company_name: best.name || best.title || company_name,
      street_address: best.address || best.full_address || "",
      postal_code: best.postal_code || "",
      city: best.city || city,
      area: best.area || "",
      phone: best.phone || best.phone_number || "",
      website: website,
      logo_url: website
        ? `https://www.google.com/s2/favicons?domain=${new URL(website).hostname}&sz=128`
        : "",
      image_urls: Array.isArray(best.photos) ? best.photos.slice(0, 5).join(", ") : "",
      google_rating: best.rating || best.google_rating || "",
      google_reviews: best.reviews_count || best.review_count || "",
      google_maps_url: best.google_maps_url || best.url || "",
      place_id: best.place_id || "",
      org_number: siteData?.org_number || "",
      pricing_info: siteData?.pricing_info || "",
      booking_method: siteData?.booking_method || "",
      services: siteData?.services || "",
      about: siteData?.about || "",
      last_verified: new Date().toISOString().slice(0, 10),
    };

    return NextResponse.json({
      draft,
      matchCount: allResults.length,
      siteExtractionSkipped: !website,
      siteExtractionError: siteData?._error || null,
    });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
