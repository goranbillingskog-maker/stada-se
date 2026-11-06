---
name: stadtorget-company-manager
description: >-
  Handles incoming emails, listing requests, and profile updates for cleaning companies
  on stadtorget.se. Researches and verifies Swedish corporate records (org.nr, F-skatt,
  Moms, Bolagsverket, Allabolag, RUT eligibility), updates existing profiles, or formats
  and adds new verified companies to data/companies.json.
---

# Städtorget Company Manager (Inbound Emails & Profile Updates)

Use this skill when processing emails, inquiries, or support requests from cleaning companies wanting to be listed or update their profile on **stadtorget.se**.

---

## 1. Company Verification Standards

Before listing or significantly modifying a company on `stadtorget.se`, verify these requirements:

1. **Active Legal Entity & Org Number:**
   - Company must have a valid Swedish organization number (`org_number`, e.g. `55XXXX-XXXX` or personal identity number for enskild firma).
   - Status must be active (NOT in bankruptcy, liquidation, or deregistered).
   - Cross-reference via official registries (Allabolag, Ratsit, Bolagsverket, Skatteverket).

2. **F-skatt & Moms (Crucial for RUT):**
   - Must be actively registered for **F-skatt** and **Moms**.
   - Cleaning services in private homes qualify for Swedish RUT-avdrag (50% deduction on labor cost, max 75 000 kr/person/year).
   - If F-skatt is missing or revoked, flag immediately to the site owner.

3. **Active Cleaning Business:**
   - Must operate within cleaning services (SNI code e.g. 81210 lokalvård/städning).
   - Must have an active website, contact method, or verified physical address in the specified city.

4. **Reviews & Reputation:**
   - Record Google Rating and Google Review count if available.

---

## 2. Workflow: Updating Existing Company Profiles

When an email or message requests an update to an existing listing (e.g. phone number, address, website, email, service offering):

1. **Locate the Company:**
   - Check the profile URL slug (e.g., `/jonkoping/klassiska-stad-jonkoping/`) or search by name in `stada-se/data/companies.json`.
2. **Verify the Information:**
   - Confirm the details match the company's official website or official registry records.
3. **Update `data/companies.json`:**
   - Update the modified field(s).
   - Update `last_verified` to the current date (`YYYY-MM-DD`).
4. **Sync the CSV export:**
   - Run `node scripts/analyze-and-export.mjs` inside `stada-se/` so `data/companies_export.csv` stays in sync.
5. **Report to User:**
   - Summarize the updated fields in clear plain Swedish or English for non-technical review.

---

## 3. Workflow: Onboarding & Listing a New Company

When a new company applies or sends an email to get listed:

1. **Extract Inbound Details:**
   - Company name, contact person, phone, email, website, city/service areas, claimed services.
2. **Research & Background Check:**
   - Find legal entity name, `org_number`, registered address, founding year, legal form (`Aktiebolag`, `Enskild firma`, etc.).
   - Verify F-skatt and VAT registration.
   - Verify Google reviews (rating and review count).
   - Generate standard favicon logo: `https://www.google.com/s2/favicons?domain=<domain>&sz=128`.
3. **Draft Listing Data (`companies.json` schema):**
   ```json
   {
     "company_name": "Företagsnamn",
     "legal_name": "Juridiskt Namn AB",
     "org_number": "55XXXX-XXXX",
     "street_address": "Gatuadress",
     "postal_code": "XXX XX",
     "city": "Stad",
     "area": "Stadsdel/Centrum",
     "phone": "0XX-XXX XX XX",
     "email": "kontakt@foretag.se",
     "website": "https://foretag.se",
     "logo_url": "https://www.google.com/s2/favicons?domain=foretag.se&sz=128",
     "image_urls": "",
     "services": "Hemstädning|Flyttstädning|Kontorsstädning|Fönsterputsning",
     "service_descriptions": "Beskrivning av tjänster...",
     "service_areas": "Stad",
     "about": "Professionell och objektiv beskrivning på svenska...",
     "founded_year": 2020,
     "founder": "",
     "employees": "",
     "legal_form": "Aktiebolag",
     "rut_avdrag": "Ja",
     "google_rating": 4.8,
     "google_reviews": 12,
     "review_snippets": "",
     "other_ratings": "",
     "certifications": "",
     "booking_method": "Telefon|E-post|Kontaktformulär",
     "pricing_info": "Pris lämnas via offert; RUT-avdrag tillämpas för privatpersoner.",
     "languages": "",
     "social_links": "",
     "google_maps_url": "",
     "place_id": "",
     "data_confidence": "High",
     "sources": "Officiell webbplats | allabolag.se",
     "last_verified": "YYYY-MM-DD"
   }
   ```
4. **Append to `data/companies.json`:**
   - Add the verified JSON object to the list in `stada-se/data/companies.json`.
5. **Sync CSV:**
   - Run `node scripts/analyze-and-export.mjs`.
6. **Flag Discrepancies:**
   - Never guess or fabricate information (see `.agents/rules/stadtorget-regler.md`). If a detail is missing, mark as empty string or flag to the user.
