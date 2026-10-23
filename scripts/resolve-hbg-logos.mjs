import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const TARGETS = [
  {
    name: "Ren & Flytt - Flyttfirma & Städ",
    slug: "ren-flytt-flyttfirma-stad",
    base: "helsingborg-ren-flytt-flyttfirma-stad",
    website: "https://www.renochflytt.se/",
    candidates: [
      "https://www.renochflytt.se/wp-content/uploads/2024/02/renflytt_logga.png",
      "https://www.renochflytt.se/wp-content/uploads/2024/02/cropped-renflytt_logga.png",
      "https://www.renochflytt.se/wp-content/uploads/2024/02/cropped-renflytt_logga-192x192.png",
      "https://www.renochflytt.se/wp-content/uploads/2024/02/cropped-renflytt_logga-270x270.png",
      "https://www.renochflytt.se/wp-content/uploads/2024/02/cropped-renflytt_logga-180x180.png"
    ]
  },
  {
    name: "Predx AB – Flytt • Städning • Hantverk",
    slug: "predx-ab-flytt-stadning-hantverk",
    base: "helsingborg-predx-ab-flytt-stadning-hantverk",
    website: "https://predx.se/",
    candidates: [
      "https://predx.se/wp-content/uploads/2024/08/cropped-Favicon.png",
      "https://predx.se/wp-content/uploads/2024/08/Favicon.png",
      "https://predx.se/wp-content/uploads/2024/08/cropped-Favicon-192x192.png",
      "https://predx.se/wp-content/uploads/2024/08/cropped-Favicon-270x270.png",
      "https://predx.se/wp-content/uploads/2024/08/cropped-Favicon-180x180.png"
    ]
  },
  {
    name: "Fina Utsikter Fönsterputs",
    slug: "fina-utsikter-fonsterputs",
    base: "helsingborg-fina-utsikter-fonsterputs",
    website: "https://www.finautsikter.se/",
    candidates: [
      "https://www.finautsikter.se/wp-content/uploads/2024/02/cropped-Favicon.jpg",
      "https://www.finautsikter.se/wp-content/uploads/2024/02/cropped-Favicon-192x192.jpg",
      "https://www.finautsikter.se/wp-content/uploads/2024/02/cropped-Favicon-270x270.jpg",
      "https://www.finautsikter.se/wp-content/uploads/2024/02/cropped-Favicon-180x180.jpg"
    ]
  },
  {
    name: "Larssons Allstäd AB - Flyttstäd Helsingborg",
    slug: "larssons-allstad-ab-flyttstad-helsingborg",
    base: "helsingborg-larssons-allstad-ab-flyttstad-helsingborg",
    website: "https://larssonsallstad.se/",
    candidates: []
  },
  {
    name: "M Dasilva Städ AB",
    slug: "m-dasilva-stad-ab",
    base: "helsingborg-m-dasilva-stad-ab",
    website: "https://mdasilvastad.se/",
    candidates: []
  },
  {
    name: "Städ Eliten - En del av A.L Group Syd AB",
    slug: "stad-eliten-en-del-av-a-l-group-syd-ab",
    base: "helsingborg-stad-eliten-en-del-av-a-l-group-syd-ab",
    website: "https://www.stadhelsingborg.se/",
    candidates: []
  },
  {
    name: "Klarvy Fönsterputs AB",
    slug: "klarvy-fonsterputs-ab",
    base: "helsingborg-klarvy-fonsterputs-ab",
    website: "https://klarvyfonsterputs.se/",
    candidates: []
  },
  {
    name: "HomeMaid Helsingborg - Hemstäd, flyttstäd & fönsterputs",
    slug: "homemaid-helsingborg-hemstad-flyttstad-fonsterputs",
    base: "helsingborg-homemaid-helsingborg-hemstad-flyttstad-fonsterputs",
    website: "https://homemaid.se/",
    candidates: [
      "https://homemaid.se/wp-content/themes/homemaid/assets/images/logo.svg",
      "https://homemaid.se/wp-content/uploads/2021/04/HomeMaid_logo.svg",
      "https://homemaid.se/wp-content/uploads/2021/04/HomeMaid_logo.png"
    ]
  },
  {
    name: "Immex Städservice - Flyttstädning Helsingborg, Höganäs, Ängelholm, Åstorp och Båstad",
    slug: "immex-stadservice-flyttstadning-helsingborg-hoganas-angelholm-astorp-och-bastad",
    base: "helsingborg-immex-stadservice-flyttstadning-helsingborg-hoganas-angelholm-astorp-och-bastad",
    website: "https://immex.se/",
    candidates: []
  },
  {
    name: "Städfirma Helsingborg",
    slug: "stadfirma-helsingborg",
    base: "helsingborg-stadfirma-helsingborg",
    website: "https://www.xn--stdperfekt-r5a.se/",
    candidates: []
  },
  {
    name: "Ridderborgs fönsterputs AB",
    slug: "ridderborgs-fonsterputs-ab",
    base: "helsingborg-ridderborgs-fonsterputs-ab",
    website: "https://ridderborgs.se/",
    candidates: []
  },
  {
    name: "Städ Time & Redo för Renovering få offert för Flyttstädning i Helsingbog & Landskrona Företag städning Fönsterputs",
    slug: "stad-time-redo-for-renovering-fa-offert-for-flyttstadning-i-helsingbog-landskrona-foretag-stadning-fonsterputs",
    base: "helsingborg-stad-time-redo-for-renovering-fa-offert-for-flyttstadning-i-helsingbog-landskrona-foretag-stadning-fonsterputs",
    website: "https://www.xn--stdtime-6wa.com/",
    candidates: []
  }
];

const OUT_DIR = path.join(process.cwd(), "stada-se", "public", "images", "companies");

async function fetchHtml(url) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" },
      signal: AbortSignal.timeout(8000),
      redirect: "follow"
    });
    if (!res.ok) return "";
    return await res.text();
  } catch (e) {
    return "";
  }
}

function extractLogosFromHtml(html, baseUrl) {
  const urls = [];
  if (!html) return urls;

  // 1. Apple touch icons
  const appleMatches = [...html.matchAll(/<link[^>]+rel=["']apple-touch-icon["'][^>]+href=["']([^"']+)["']/gi)];
  for (const m of appleMatches) urls.push(m[1]);

  // 2. OpenGraph image
  const ogMatches = [...html.matchAll(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/gi)];
  for (const m of ogMatches) urls.push(m[1]);

  // 3. Logo img tags
  const imgMatches = [...html.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)];
  for (const m of imgMatches) {
    const tag = m[0];
    const src = m[1];
    if (/logo|brand|header/i.test(tag) || /logo/i.test(src)) {
      urls.push(src);
    }
  }

  // 4. Icons
  const iconMatches = [...html.matchAll(/<link[^>]+rel=["'](?:shortcut )?icon["'][^>]+href=["']([^"']+)["']/gi)];
  for (const m of iconMatches) urls.push(m[1]);

  // Resolve relative URLs
  return urls.map(u => {
    try {
      return new URL(u, baseUrl).href;
    } catch {
      return null;
    }
  }).filter(Boolean);
}

async function tryDownloadImage(url) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" },
      signal: AbortSignal.timeout(8000),
      redirect: "follow"
    });
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 500) return null;
    const meta = await sharp(buf).metadata();
    if (!meta.width || !meta.height) return null;
    if (meta.width < 64 || meta.height < 32) return null;
    return { buf, meta, url };
  } catch {
    return null;
  }
}

function scoreCandidate(res, url) {
  let score = 0;
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes("logo") || lowerUrl.includes("logotyp")) score += 50;
  if (lowerUrl.includes("brand") || lowerUrl.includes("varumarke")) score += 30;
  if (lowerUrl.includes("header")) score += 20;
  if (lowerUrl.includes("apple-touch-icon")) score += 25;
  if (lowerUrl.includes("favicon")) score += 5;
  if (lowerUrl.includes("skarmavbild") || lowerUrl.includes("screenshot")) score -= 30;
  if (lowerUrl.includes("stressad") || lowerUrl.includes("banner")) score -= 20;

  // Aspect ratio bonus: logos are usually 1.2 to 4.5 ratio
  const ratio = res.meta.width / res.meta.height;
  if (ratio >= 1.2 && ratio <= 6.0) score += 25;
  if (ratio >= 0.9 && ratio <= 1.1) score += 10; // square logo/icon

  // Resolution bonus
  if (res.meta.width >= 160 && res.meta.width <= 1600 && res.meta.height >= 50) score += 30;
  if (res.meta.width < 100) score -= 20;

  return score;
}

async function processCompany(target) {
  console.log(`\n=== Scanning: ${target.name} (${target.website}) ===`);
  const candidates = [...target.candidates];
  
  const html = await fetchHtml(target.website);
  if (html) {
    const extracted = extractLogosFromHtml(html, target.website);
    candidates.push(...extracted);
  }

  // Deduplicate
  const uniqueUrls = [...new Set(candidates)];
  console.log(`Found ${uniqueUrls.length} candidate URLs.`);

  let best = null;
  let bestScore = -999;

  for (const u of uniqueUrls) {
    const res = await tryDownloadImage(u);
    if (res) {
      const s = scoreCandidate(res, u);
      console.log(`  [Candidate] score=${s} ${res.meta.width}x${res.meta.height} (${res.meta.format}) -> ${u}`);
      if (s > bestScore) {
        bestScore = s;
        best = res;
      }
    }
  }

  if (best && bestScore > 0) {
    const ext = best.meta.format === "jpeg" ? "jpg" : best.meta.format;
    const filename = `${target.base}-logo.${ext}`;
    const outPath = path.join(OUT_DIR, filename);
    fs.writeFileSync(outPath, best.buf);
    console.log(`=> SAVED: ${filename} (score ${bestScore}, ${best.meta.width}x${best.meta.height}, ${(best.buf.length/1024).toFixed(1)} kB) from ${best.url}`);
    return {
      key: `helsingborg/${target.slug}`,
      logo: `/images/companies/${filename}`,
      width: best.meta.width,
      height: best.meta.height,
      sourceUrl: best.url
    };
  } else {
    console.log(`=> NO SUITABLE LOGO FOUND for ${target.name}`);
    return null;
  }
}

async function main() {
  const results = [];
  for (const t of TARGETS) {
    const r = await processCompany(t);
    if (r) results.push(r);
  }

  console.log("\n==================================");
  console.log(`Successfully upgraded ${results.length} of ${TARGETS.length} companies!`);
  console.log(JSON.stringify(results, null, 2));

  // Write temporary json with results
  fs.writeFileSync("stada-se/data/hbg-upgrades.json", JSON.stringify(results, null, 2), "utf8");
}

main();
