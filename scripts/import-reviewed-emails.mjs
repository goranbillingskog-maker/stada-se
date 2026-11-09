import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[åä]/g, "a")
    .replace(/[ö]/g, "o")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseCSV(text) {
  const lines = text.trim().split("\n");
  const header = lines[0].split(",").map(h => h.trim().replace(/^[\uFEFF]/, ""));
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    const values = [];
    let current = "";
    let inQuotes = false;
    for (let c = 0; c < line.length; c++) {
      const char = line[c];
      const next = line[c + 1];
      if (char === "\"" && inQuotes && next === "\"") {
        current += "\"";
        c++;
      } else if (char === "\"") {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        values.push(current);
        current = "";
      } else {
        current += char;
      }
    }
    values.push(current);
    const obj = {};
    header.forEach((h, idx) => {
      obj[h] = values[idx] !== undefined ? values[idx] : "";
    });
    rows.push(obj);
  }
  return rows;
}

const companiesPath = path.join(__dirname, '../data/companies.json');
const granskadPath = path.join(__dirname, '../data/stadtorget_epost_granskad.csv');
const rapportPath = path.join(__dirname, '../data/stadtorget_granskningsrapport.csv');
const logPath = path.join(__dirname, '../data/epost_importlogg_2026-11-09.json');

const companies = JSON.parse(fs.readFileSync(companiesPath, 'utf8'));
const granskadRows = parseCSV(fs.readFileSync(granskadPath, 'utf8'));
const rapportRows = parseCSV(fs.readFileSync(rapportPath, 'utf8'));

// Build URL mapping matching lib/data.js
const seen = new Map();
const dbIndexed = companies.map((c, idx) => {
  const name = String(c.company_name || "").trim();
  const city = String(c.city || "").trim();
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
  const url = `https://stadtorget.se/${citySlug}/${slug}/`;
  return { ...c, _index: idx, _url: url };
});

const reportMap = new Map();
rapportRows.forEach(r => {
  reportMap.set(r.datarad, r);
  reportMap.set(r.foretagsnamn, r);
});

let updatedCount = 0;
let alreadyCorrectCount = 0;
let skippedEmptyCount = 0;
let conflictCount = 0;

const importLog = [];

granskadRows.forEach((row, idx) => {
  const datarad = String(idx + 1);
  const targetUrl = row.profillank_stadtorget.trim();
  const dbMatch = dbIndexed.find(c => c._url === targetUrl);

  if (!dbMatch) {
    throw new Error(`Kunde inte hitta matchning för rad ${datarad}: ${row.foretagsnamn} (${targetUrl})`);
  }

  const origCompany = companies[dbMatch._index];
  const csvEmail = row.epost.trim();
  const currentDbEmail = (origCompany.email || "").trim();
  const sourceText = row.kalla.trim();

  const reportEntry = reportMap.get(datarad) || reportMap.get(row.foretagsnamn);
  const bedomning = reportEntry ? reportEntry.bedomning : "Ej djupgranskad";
  const beslut = reportEntry ? reportEntry.beslut : (csvEmail ? "Behållen" : "Ingen adress");
  const kommentar = reportEntry ? reportEntry.kommentar : "";
  const manuellKontroll = bedomning === "Medel";

  const logEntry = {
    datarad: Number(datarad),
    foretagsnamn: row.foretagsnamn,
    stad: row.stad,
    profillank: targetUrl,
    org_nummer: row.org_nummer || origCompany.org_number || "",
    csv_epost: csvEmail,
    tidigare_db_epost: currentDbEmail,
    status: "",
    bedomning,
    beslut,
    kommentar,
    manuell_kontroll_krav: manuellKontroll,
    kalla: sourceText
  };

  if (!csvEmail) {
    skippedEmptyCount++;
    logEntry.status = "SKIPPED_EMPTY_IN_CSV";
  } else if (currentDbEmail.toLowerCase() === csvEmail.toLowerCase()) {
    alreadyCorrectCount++;
    logEntry.status = "ALREADY_CORRECT";
  } else if (currentDbEmail !== "") {
    conflictCount++;
    logEntry.status = "CONFLICT_NOT_OVERWRITTEN";
    console.warn(`KONFLIKT: Rad ${datarad} ${row.foretagsnamn} har redan epost "${currentDbEmail}" men CSV har "${csvEmail}"`);
  } else {
    // Perform update
    origCompany.email = csvEmail;
    origCompany.last_verified = "2026-11-09";

    // Extract URL from sourceText if present to add to sources
    if (sourceText) {
      const urlMatch = sourceText.match(/https?:\/\/[^\s"',]+/);
      if (urlMatch) {
        const sourceUrl = urlMatch[0];
        const existingSources = (origCompany.sources || "").split("|").map(s => s.trim()).filter(Boolean);
        if (!existingSources.includes(sourceUrl)) {
          existingSources.push(sourceUrl);
          origCompany.sources = existingSources.join("|");
        }
      }
    }

    updatedCount++;
    logEntry.status = "UPDATED";
  }

  importLog.push(logEntry);
});

// Write updated companies.json
fs.writeFileSync(companiesPath, JSON.stringify(companies, null, 2) + "\n", "utf8");

// Write import log
fs.writeFileSync(logPath, JSON.stringify({
  datum: "2026-11-09",
  totalt_granskade_rader: granskadRows.length,
  uppdaterade: updatedCount,
  redan_korrekta: alreadyCorrectCount,
  overhoppade_tomma: skippedEmptyCount,
  konflikter: conflictCount,
  poster: importLog
}, null, 2) + "\n", "utf8");

console.log("=== IMPORT SLUTFÖRD ===");
console.log(`Totalt granskade rader: ${granskadRows.length}`);
console.log(`Uppdaterade profiler: ${updatedCount}`);
console.log(`Redan korrekta profiler: ${alreadyCorrectCount}`);
console.log(`Överhoppade (saknar verifierad adress): ${skippedEmptyCount}`);
console.log(`Konflikter: ${conflictCount}`);
console.log(`Importlogg sparad till: ${logPath}`);
