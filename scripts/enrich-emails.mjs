import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const jsonPath = path.join(__dirname, '../data/companies.json');

const raw = fs.readFileSync(jsonPath, 'utf8');
const companies = JSON.parse(raw);

const DISCARD_DOMAINS = new Set([
  'example.com',
  'domain.com',
  'sentry.io',
  'wix.com',
  'wixpress.com',
  'wordpress.org',
  'wordpress.com',
  'schema.org',
  'googleapis.com',
  'google.com',
  'github.com',
  'facebook.com',
  'instagram.com',
  'cloudflare.com',
  'cookiebot.com',
  'onetrust.com',
  'usercentrics.eu',
  'squarespace.com',
  'webflow.com',
  'shopify.com',
  'trustpilot.com',
  'apple.com',
  'android.com',
  'microsoft.com',
]);

const DISCARD_PREFIXES = new Set([
  'privacy',
  'abuse',
  'legal',
  'dpo',
  'noreply',
  'no-reply',
  'postmaster',
  'hostmaster',
  'webmaster',
  'support@wix.com',
]);

const FILE_EXTS = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.js', '.css', '.woff', '.woff2'];

function cleanEmail(rawEmail) {
  if (!rawEmail) return null;
  let e = rawEmail.trim().toLowerCase();

  // Strip mailto:
  if (e.startsWith('mailto:')) {
    e = e.slice(7);
  }

  // Strip query parameters e.g. ?subject=...
  if (e.includes('?')) {
    e = e.split('?')[0];
  }

  e = e.trim();

  // Strip surrounding quotes or parentheses
  e = e.replace(/^[<"'(]+|[>"')]+$/g, '');

  if (!e.includes('@')) return null;

  const [prefix, domain] = e.split('@');
  if (!prefix || !domain || !domain.includes('.')) return null;

  if (DISCARD_DOMAINS.has(domain)) return null;
  if (DISCARD_PREFIXES.has(prefix)) return null;
  if (FILE_EXTS.some(ext => domain.endsWith(ext))) return null;
  if (domain.length < 4 || prefix.length < 1) return null;

  return `${prefix}@${domain}`;
}

function extractEmailsFromHtml(html, baseHost) {
  if (!html) return [];
  const found = new Set();

  // 1. mailto: links
  const mailtoRegex = /href=["']mailto:([^"'>\s]+)["']/gi;
  let m;
  while ((m = mailtoRegex.exec(html)) !== null) {
    const cleaned = cleanEmail(m[1]);
    if (cleaned) found.add(cleaned);
  }

  // 2. decode HTML entities for @ (&#64; &#x40; &commat; %40)
  const decoded = html
    .replace(/&#64;/gi, '@')
    .replace(/&#x40;/gi, '@')
    .replace(/&commat;/gi, '@')
    .replace(/%40/gi, '@')
    .replace(/\[at\]|\(at\)/gi, '@');

  // 3. regex pattern
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
  while ((m = emailRegex.exec(decoded)) !== null) {
    const cleaned = cleanEmail(m[0]);
    if (cleaned) found.add(cleaned);
  }

  // Score each candidate
  const scored = Array.from(found).map(email => {
    const [prefix, domain] = email.split('@');
    let score = 0;

    // Highest priority: matches website domain
    if (baseHost && (domain === baseHost || baseHost.endsWith('.' + domain) || domain.endsWith('.' + baseHost))) {
      score += 100;
    }

    // Common business contact prefixes
    if (['info', 'kontakt', 'contact', 'hej', 'kundtjanst', 'kundservice', 'boka', 'bokning', 'offert', 'order', 'stad', 'kontor'].includes(prefix)) {
      score += 50;
    }

    // Personal Swedish providers
    if (['telia.com', 'bredband.net', 'tele2.se', 'comhem.se', 'swipnet.se'].includes(domain)) {
      score += 30;
    }

    // Common free email providers
    if (['gmail.com', 'outlook.com', 'hotmail.com', 'live.se', 'icloud.com'].includes(domain)) {
      score += 25;
    }

    return { email, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.map(s => s.email);
}

function findContactLinks(html, baseUrl) {
  if (!html) return [];
  const links = new Set();
  const linkRegex = /href=["']([^"'>#\s]+)["']/gi;
  let m;

  while ((m = linkRegex.exec(html)) !== null) {
    const href = m[1].trim();
    const lower = href.toLowerCase();
    if (
      lower.includes('kontakt') ||
      lower.includes('contact') ||
      lower.includes('om-oss') ||
      lower.includes('about') ||
      lower.includes('kundservice') ||
      lower.includes('hitta-oss')
    ) {
      try {
        const fullUrl = new URL(href, baseUrl).href;
        // Only same-domain links
        if (new URL(fullUrl).hostname === new URL(baseUrl).hostname) {
          links.add(fullUrl);
        }
      } catch {}
    }
  }

  return Array.from(links).slice(0, 3); // Max 3 contact pages
}

async function fetchWithTimeout(url, timeoutMs = 7000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'sv-SE,sv;q=0.9,en;q=0.8',
      },
      redirect: 'follow',
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    return await res.text();
  } catch {
    clearTimeout(timer);
    return null;
  }
}

async function scrapeCompanyEmail(company) {
  const website = (company.website || '').trim();
  if (!website || !website.startsWith('http')) return null;

  let baseHost = '';
  try {
    baseHost = new URL(website).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }

  // 1. Fetch homepage
  const homeHtml = await fetchWithTimeout(website);
  if (homeHtml) {
    const emails = extractEmailsFromHtml(homeHtml, baseHost);
    if (emails.length > 0) {
      return emails[0];
    }

    // 2. Look for contact links
    const contactLinks = findContactLinks(homeHtml, website);
    for (const link of contactLinks) {
      const pageHtml = await fetchWithTimeout(link);
      if (pageHtml) {
        const pageEmails = extractEmailsFromHtml(pageHtml, baseHost);
        if (pageEmails.length > 0) {
          return pageEmails[0];
        }
      }
    }
  }

  // Fallback: try common contact paths directly
  const directUrls = [
    new URL('/kontakt', website).href,
    new URL('/kontakt/', website).href,
    new URL('/contact', website).href,
  ];

  for (const url of directUrls) {
    const html = await fetchWithTimeout(url);
    if (html) {
      const emails = extractEmailsFromHtml(html, baseHost);
      if (emails.length > 0) {
        return emails[0];
      }
    }
  }

  return null;
}

// Concurrency helper
async function mapConcurrent(items, limit, fn) {
  const results = [];
  let index = 0;

  async function worker() {
    while (index < items.length) {
      const i = index++;
      results[i] = await fn(items[i], i);
    }
  }

  const workers = Array.from({ length: Math.min(limit, items.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

async function main() {
  const toProcess = companies.filter(c => (!c.email || !c.email.includes('@')) && c.website && c.website.startsWith('http'));
  console.log(`Hittade ${toProcess.length} företag med webbplats som saknar e-post.`);

  let foundCount = 0;
  const today = new Date().toISOString().split('T')[0];

  const results = await mapConcurrent(toProcess, 8, async (company, idx) => {
    const num = `[${idx + 1}/${toProcess.length}]`;
    try {
      const email = await scrapeCompanyEmail(company);
      if (email) {
        foundCount++;
        console.log(`${num} ✓ ${company.company_name} (${company.city}): ${email}`);
        return { company, email };
      } else {
        console.log(`${num} - ${company.company_name} (${company.city}): ingen e-post hittades`);
        return { company, email: null };
      }
    } catch (err) {
      console.log(`${num} ✗ ${company.company_name}: fel (${err.message})`);
      return { company, email: null };
    }
  });

  // Apply updates to main list
  const emailMap = new Map();
  results.forEach(r => {
    if (r.email) {
      emailMap.set(r.company.company_name + '|' + r.company.city, r.email);
    }
  });

  companies.forEach(c => {
    const key = c.company_name + '|' + c.city;
    if (emailMap.has(key)) {
      c.email = emailMap.get(key);
      c.last_verified = today;
    }
  });

  fs.writeFileSync(jsonPath, JSON.stringify(companies, null, 2) + '\n', 'utf8');
  console.log(`\n========================================`);
  console.log(`KLART! Hittade och sparade e-post för ${foundCount} av ${toProcess.length} företag.`);
  console.log(`Uppdaterade ${jsonPath}`);
}

main().catch(console.error);
