import { NextResponse } from "next/server";
import { lookupGoogleMaps, extractFromWebsite } from "../../../../lib/browseract.js";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // tillåt upp till 5 minuter (BrowserAct-anrop kan ta tid)

// Härleder ett rimligt visningsnamn från en webbadress, t.ex.
// "https://tidy.nu" -> "Tidy.nu", om inget företagsnamn angetts.
function nameFromWebsite(url) {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "");
    const base = hostname.split(".")[0];
    return base.charAt(0).toUpperCase() + base.slice(1) + "." + hostname.split(".").slice(1).join(".");
  } catch {
    return "";
  }
}

// Tar företagsnamn och/eller webbadress (stad är valfri men rekommenderas för
// bättre Google Maps-träffar), hämtar data via BrowserAct, och lämnar
// tillbaka ett objekt med samma fältnamn som companies.json/admin-formuläret.
// Sparar INGENTING – adminpanelen visar det bara som ett ifyllt utkast som
// du själv granskar och klickar "Spara" på.
export async function POST(request) {
  try {
    const body = await request.json();
    const city = (body.city || "").trim();
    const providedWebsite = (body.website || "").trim();
    let companyName = (body.company_name || "").trim();

    if (!companyName && !providedWebsite) {
      return NextResponse.json(
        { error: "Ange minst företagsnamn eller webbplats." },
        { status: 400 }
      );
    }
    if (!companyName) {
      companyName = nameFromWebsite(providedWebsite) || providedWebsite;
    }

    let best = null;
    let allResults = [];
    let mapsError = null;
    let siteData = null;

    if (providedWebsite) {
      // Vi vet redan webbadressen – kör Google Maps-sökningen (för
      // adress/telefon/betyg) och hemsidesläsningen (för org.nr/prisinfo/
      // bokning) SAMTIDIGT istället för i tur och ordning. Det halverar
      // väntetiden och håller oss inom Vercels 5-minutersgräns.
      const [mapsResult, siteResult] = await Promise.allSettled([
        lookupGoogleMaps(companyName, city),
        extractFromWebsite(providedWebsite),
      ]);
      if (mapsResult.status === "fulfilled") {
        best = mapsResult.value.best;
        allResults = mapsResult.value.allResults;
      } else {
        mapsError = mapsResult.reason?.message || String(mapsResult.reason);
      }
      if (siteResult.status === "fulfilled") {
        siteData = siteResult.value;
      } else {
        siteData = { _error: siteResult.reason?.message || String(siteResult.reason) };
      }
    } else {
      // Ingen webbadress angiven – vi måste först hitta den via Google Maps
      // innan vi kan läsa hemsidan, så de här stegen körs i tur och ordning.
      try {
        const result = await lookupGoogleMaps(companyName, city);
        best = result.best;
        allResults = result.allResults;
      } catch (e) {
        mapsError = e.message;
      }
      if (!best) {
        return NextResponse.json(
          {
            error: `Hittade inget på Google Maps för "${companyName}"${city ? ` i ${city}` : ""}. Prova ett annat sökord, lägg till stad, eller fyll i webbplats direkt.`,
          },
          { status: 404 }
        );
      }
      const foundWebsite = best?.website || best?.website_url || "";
      try {
        siteData = foundWebsite ? await extractFromWebsite(foundWebsite) : null;
      } catch (e) {
        siteData = { _error: e.message };
      }
    }

    const website = providedWebsite || best?.website || best?.website_url || "";

    if (!best && !website) {
      return NextResponse.json(
        { error: "Hittade varken Google Maps-data eller kunde läsa någon hemsida. Fyll i manuellt." },
        { status: 404 }
      );
    }

    const draft = {
      company_name: best?.name || best?.title || companyName,
      street_address: best?.address || best?.full_address || "",
      postal_code: best?.postal_code || "",
      city: best?.city || city,
      area: best?.area || "",
      phone: best?.phone || best?.phone_number || "",
      website: website,
      logo_url: website
        ? `https://www.google.com/s2/favicons?domain=${new URL(website).hostname}&sz=128`
        : "",
      image_urls: Array.isArray(best?.photos) ? best.photos.slice(0, 5).join(", ") : "",
      google_rating: best?.rating || best?.google_rating || "",
      google_reviews: best?.reviews_count || best?.review_count || "",
      google_maps_url: best?.google_maps_url || best?.url || "",
      place_id: best?.place_id || "",
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
      mapsSkippedOrFailed: !best,
      mapsError,
      siteExtractionSkipped: !website,
      siteExtractionError: siteData?._error || null,
    });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
