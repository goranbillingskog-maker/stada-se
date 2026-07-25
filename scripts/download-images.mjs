// Laddar ner logotyper och foton till public/images/companies/
// så att de serveras från Vercels egna CDN i stället för externa källor.
// Körs automatiskt före varje bygge ("prebuild"), och kan även köras manuellt:
//   npm run download-images
// Scriptet kraschar aldrig bygget: misslyckade nedladdningar hoppas över
// och sajten använder då automatiskt fallback-bilder (favicon/initialer).

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const DATA_FILE = path.join(ROOT, "data", "companies.json");
const OUT_DIR = path.join(ROOT, "public", "images", "companies");
const MANIFEST_FILE = path.join(ROOT, "data", "images-manifest.json");
const CONCURRENCY = 8;
const TIMEOUT_MS = 12000;
const MAX_EARLY_FAILURES = 10; // om nätverket verkar helt nere: avbryt snällt

function slugify(str) {
  return String(str)
    .toLowerCase()
    .replace(/å/g, "a")
    .replace(/ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/é/g, "e")
    .replace(/ü/g, "u")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function extFromContentType(ct) {
  if (!ct) return null;
  if (ct.includes("svg")) return "svg";
  if (ct.includes("png")) return "png";
  if (ct.includes("webp")) return "webp";
  if (ct.includes("gif")) return "gif";
  if (ct.includes("jpeg") || ct.includes("jpg")) return "jpg";
  if (ct.includes("image/x-icon") || ct.includes("ico")) return "ico";
  return null;
}

function existingFile(base) {
  for (const ext of ["svg", "png", "webp", "jpg", "gif", "ico"]) {
    const p = path.join(OUT_DIR, `${base}.${ext}`);
    if (fs.existsSync(p)) return `/images/companies/${base}.${ext}`;
  }
  return null;
}

async function download(url, base) {
  const already = existingFile(base);
  if (already) return { ok: true, path: already, cached: true };
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0 (compatible; StadaSeBot/1.0)" },
    });
    clearTimeout(timer);
    if (!res.ok) return { ok: false, reason: `HTTP ${res.status}` };
    const ct = res.headers.get("content-type") || "";
    const ext = extFromContentType(ct);
    if (!ext) return { ok: false, reason: `oväntad content-type: ${ct}` };
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 100) return { ok: false, reason: "tom fil" };
    if (buf.length > 5 * 1024 * 1024) return { ok: false, reason: "för stor fil" };
    const rel = `/images/companies/${base}.${ext}`;
    fs.writeFileSync(path.join(OUT_DIR, `${base}.${ext}`), buf);
    return { ok: true, path: rel };
  } catch (e) {
    return { ok: false, reason: e.name === "AbortError" ? "timeout" : String(e.message || e), network: true };
  }
}

async function main() {
  if (process.env.SKIP_IMAGES === "1") {
    console.log("SKIP_IMAGES=1 – hoppar över bildnedladdning.");
    return;
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const companies = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));

  // Bygg jobblista med samma slug-logik som sajten (unika per stad)
  const seen = new Map();
  const jobs = [];
  for (const r of companies) {
    const citySlug = slugify(r.city || "");
    let slug = slugify(r.company_name || "") || "foretag";
    const key = `${citySlug}/${slug}`;
    if (seen.has(key)) {
      const n = seen.get(key) + 1;
      seen.set(key, n);
      slug = `${slug}-${n}`;
    } else {
      seen.set(key, 1);
    }
    const base = `${citySlug}-${slug}`;
    const logoUrl = (r.logo_url || "").trim();
    const photoUrl = ((r.image_urls || "").split("|")[0] || "").trim();
    jobs.push({ key: `${citySlug}/${slug}`, base, logoUrl, photoUrl });
  }

  const manifest = {};
  let netFailures = 0;
  let attempts = 0;
  let downloaded = 0;
  let aborted = false;

  async function worker(queue) {
    while (queue.length) {
      if (aborted) return;
      const job = queue.shift();
      const entry = {};
      if (job.logoUrl) {
        const r = await download(job.logoUrl, `${job.base}-logo`);
        attempts++;
        if (r.ok) {
          entry.logo = r.path;
          if (!r.cached) downloaded++;
        } else if (r.network) netFailures++;
      }
      if (job.photoUrl) {
        const r = await download(job.photoUrl, `${job.base}-photo`);
        attempts++;
        if (r.ok) {
          entry.photo = r.path;
          if (!r.cached) downloaded++;
        } else if (r.network) netFailures++;
      }
      if (entry.logo || entry.photo) manifest[job.key] = entry;
      if (attempts >= MAX_EARLY_FAILURES && netFailures === attempts) {
        aborted = true;
        console.log("Nätverket verkar otillgängligt – hoppar över resterande bilder.");
      }
    }
  }

  const queue = [...jobs];
  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker(queue)));

  // Plocka även upp filer som redan fanns sedan tidigare körningar
  for (const job of jobs) {
    if (!manifest[job.key]) {
      const logo = existingFile(`${job.base}-logo`);
      const photo = existingFile(`${job.base}-photo`);
      if (logo || photo) {
        manifest[job.key] = {};
        if (logo) manifest[job.key].logo = logo;
        if (photo) manifest[job.key].photo = photo;
      }
    }
  }

  fs.writeFileSync(MANIFEST_FILE, JSON.stringify(manifest, null, 2));
  console.log(
    `Bilder klara: ${downloaded} nedladdade nu, ${Object.keys(manifest).length} företag har bilder totalt.`
  );
}

main().catch((e) => {
  console.error("Bildscript-fel (bygget fortsätter ändå):", e.message);
});
