import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.join(__dirname, '../data/service_city_content.json');
const csvPath = path.join(__dirname, '../../stadtorget v2 /stadtorget-batch2-84sidor.csv');

// Simple robust CSV parser
function parseCSV(csvText) {
  const result = [];
  let row = [];
  let currentVal = '';
  let inQuotes = false;
  
  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentVal += '"';
        i++; // skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(currentVal);
      currentVal = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++; // skip LF
      }
      row.push(currentVal);
      result.push(row);
      row = [];
      currentVal = '';
    } else {
      currentVal += char;
    }
  }
  if (currentVal || row.length > 0) {
    row.push(currentVal);
    result.push(row);
  }
  return result;
}

// Read existing JSON content
let contentDb = {};
if (fs.existsSync(jsonPath)) {
  contentDb = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
}

// Read CSV
const csvText = fs.readFileSync(csvPath, 'utf8');
const rows = parseCSV(csvText);

// Headers: URL,Tjänst,Ort,RUT_status,Introtext,Faktaruta,FAQ_Fraga_1,FAQ_Svar_1,FAQ_Fraga_2,FAQ_Svar_2
const header = rows[0];
console.log("Headers detected:", header);

let importedCount = 0;

for (let i = 1; i < rows.length; i++) {
  const row = rows[i];
  if (!row || row.length < 5 || !row[0]) continue;
  
  const [url, serviceName, cityName, rutStatus, introText, faktarutaText, faqQ1, faqA1, faqQ2, faqA2] = row;
  
  try {
    const urlObj = new URL(url.trim());
    const parts = urlObj.pathname.split('/').filter(Boolean); // e.g. ['tjanster', 'byggstadning', 'eskilstuna']
    const serviceSlug = parts[1];
    const citySlug = parts[2];
    
    if (!serviceSlug || !citySlug) {
      console.warn(`Could not parse slugs from URL: ${url}`);
      continue;
    }
    
    const key = `${serviceSlug}/${citySlug}`;
    const hasRut = rutStatus.toUpperCase().includes("JA");
    const title = hasRut ? "RUT-avdrag" : "Viktigt att notera";
    
    const faq = [];
    if (faqQ1 && faqQ1.trim() && faqA1 && faqA1.trim()) {
      faq.push({ q: faqQ1.trim(), a: faqA1.trim() });
    }
    if (faqQ2 && faqQ2.trim() && faqA2 && faqA2.trim()) {
      faq.push({ q: faqQ2.trim(), a: faqA2.trim() });
    }
    
    contentDb[key] = {
      introtext: introText.trim(),
      faktaruta: {
        title: title,
        text: faktarutaText.trim()
      },
      faq: faq
    };
    
    importedCount++;
  } catch (e) {
    console.error(`Error parsing row ${i}:`, e.message);
  }
}

// Save merged JSON
fs.writeFileSync(jsonPath, JSON.stringify(contentDb, null, 2), 'utf8');

console.log(`\nSuccessfully imported ${importedCount} pages from CSV.`);
console.log(`Total database entries now: ${Object.keys(contentDb).length}`);
