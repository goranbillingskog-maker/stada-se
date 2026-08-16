import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.join(__dirname, '../data/companies.json');
const csvOutputPath = path.join(__dirname, '../data/companies_export.csv');

// Read companies
const rawData = fs.readFileSync(jsonPath, 'utf8');
const companies = JSON.parse(rawData);

const totalCompanies = companies.length;
console.log(`Total companies: ${totalCompanies}`);

// Collect all unique fields/keys across all companies
const allKeys = new Set();
companies.forEach(company => {
  Object.keys(company).forEach(key => allKeys.add(key));
});

const keysArray = Array.from(allKeys);

// Analyze field presence and completeness
const stats = {};
keysArray.forEach(key => {
  stats[key] = {
    type: new Set(),
    populatedCount: 0,
  };
});

companies.forEach(company => {
  keysArray.forEach(key => {
    const value = company[key];
    if (value !== undefined && value !== null) {
      stats[key].type.add(typeof value);
      if (String(value).trim() !== "") {
        stats[key].populatedCount++;
      }
    }
  });
});

console.log("\nField Analysis:");
console.log("--------------------------------------------------------------------------------");
console.log(
  `${"Field Name".padEnd(25)} | ${"JS Type(s)".padEnd(15)} | ${"Populated Count".padEnd(16)} | ${"Completeness %"}`
);
console.log("--------------------------------------------------------------------------------");
keysArray.forEach(key => {
  const s = stats[key];
  const typesStr = Array.from(s.type).join(', ');
  const completeness = ((s.populatedCount / totalCompanies) * 100).toFixed(1);
  console.log(
    `${key.padEnd(25)} | ${typesStr.padEnd(15)} | ${String(s.populatedCount).padStart(15)} | ${completeness.padStart(13)}%`
  );
});
console.log("--------------------------------------------------------------------------------");

// Extra distributions
const cities = {};
const legalForms = {};
const confidences = { High: 0, Medium: 0, Low: 0, Unknown: 0 };

companies.forEach(company => {
  const city = company.city || 'Okänd';
  cities[city] = (cities[city] || 0) + 1;

  const form = company.legal_form || 'Okänd';
  legalForms[form] = (legalForms[form] || 0) + 1;

  const conf = company.data_confidence || '';
  if (conf.toLowerCase().startsWith('high')) confidences.High++;
  else if (conf.toLowerCase().startsWith('medium')) confidences.Medium++;
  else if (conf.toLowerCase().startsWith('low')) confidences.Low++;
  else confidences.Unknown++;
});

console.log("\nCity distribution:");
Object.entries(cities).sort((a,b) => b[1]-a[1]).forEach(([city, count]) => {
  console.log(`  - ${city}: ${count}`);
});

console.log("\nLegal Form distribution:");
Object.entries(legalForms).sort((a,b) => b[1]-a[1]).forEach(([form, count]) => {
  console.log(`  - ${form}: ${count}`);
});

console.log("\nConfidence distribution:");
Object.entries(confidences).forEach(([conf, count]) => {
  console.log(`  - ${conf}: ${count}`);
});

// Export CSV helper
function escapeCSVValue(val) {
  if (val === null || val === undefined) return '';
  let str = String(val);
  // Replace double quotes with two double quotes
  str = str.replace(/"/g, '""');
  // Enclose in double quotes if there are commas, double quotes, or newlines
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str}"`;
  }
  return str;
}

// Generate CSV content
const csvHeaders = keysArray.map(escapeCSVValue).join(',');
const csvRows = companies.map(company => {
  return keysArray.map(key => escapeCSVValue(company[key])).join(',');
});

const csvContent = [csvHeaders, ...csvRows].join('\n');
fs.writeFileSync(csvOutputPath, csvContent, 'utf8');
console.log(`\nSuccessfully exported to: ${csvOutputPath}`);
