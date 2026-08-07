# Städtorget.se – katalog över städfirmor i Sverige

En SEO-optimerad Next.js-sajt med 423 städfirmor i Sveriges 20 största städer.
Varje stad och varje företag har en egen sida med metadata, schema.org-markup,
sitemap och robots.txt – allt genereras automatiskt från `data/companies.json`.

## Så publicerar du sajten (steg för steg, ingen kod behövs)

### Steg 1: Skapa ett GitHub-konto och ladda upp projektet

1. Gå till [github.com](https://github.com) och skapa ett konto (gratis) om du inte har ett.
2. Klicka på **+** uppe till höger → **New repository**.
3. Döp det till `stada-se`, välj **Private**, klicka **Create repository**.
4. Klicka på länken **uploading an existing file** på nästa sida.
5. Dra in **allt innehåll i den här mappen** (inte mappen själv – öppna mappen
   och markera alla filer och undermappar) till uppladdningsytan.
   *Obs: mappen `node_modules` ska INTE laddas upp (den finns bara om du kört
   projektet lokalt – hoppa över den).*
6. Klicka **Commit changes** längst ner.

### Steg 2: Publicera på Vercel

1. Gå till [vercel.com](https://vercel.com) och välj **Sign up → Continue with GitHub**.
2. Klicka **Add New… → Project**.
3. Välj ditt repository `stada-se` och klicka **Import**.
4. Rör inga inställningar – Vercel känner igen Next.js automatiskt. Klicka **Deploy**.
5. Efter 2–4 minuter är sajten live på en adress i stil med `stada-se.vercel.app`.

Under bygget laddar sajten automatiskt ner företagens logotyper och foton och
lägger dem i `public/images/` – de serveras sedan från **Vercels globala CDN**.
Ingen separat bildtjänst eller databas behövs. Bilder som inte går att hämta
ersätts automatiskt med företagets favicon eller en snygg initial-avatar.

### Steg 3: Koppla domänen stadtorget.se

1. I Vercel: öppna projektet → **Settings → Domains** → skriv `stadtorget.se` → **Add**.
2. Vercel visar då vilka DNS-poster du ska lägga in (vanligen en **A-post** till
   `76.76.21.21` och en **CNAME** för `www`).
3. Logga in hos din domänleverantör (t.ex. Loopia, One.com, Namecheap) och lägg
   in posterna under DNS-inställningarna för stadtorget.se.
4. Vänta upp till någon timme – Vercel ordnar HTTPS-certifikat automatiskt.

### Steg 4: Berätta för Google att sajten finns

1. Gå till [Google Search Console](https://search.google.com/search-console)
   och lägg till `stadtorget.se` (välj "Domän", verifiera via DNS enligt instruktionerna).
2. Under **Sitemaps**, skicka in: `https://stadtorget.se/sitemap.xml`.
3. Klart – Google börjar indexera stads- och företagssidorna.

## Adminpanel (lägg till / redigera / dölj / ta bort företag)

Gå till `https://stadtorget.se/admin` för att hantera företag via ett formulär
i stället för att redigera JSON-filen direkt. Ändringar sparas automatiskt som
en commit på GitHub, och Vercel bygger om sajten inom 1–3 minuter.

**Så aktiverar du admin (görs en gång):**

1. Skapa en ny GitHub-token med skrivbehörighet: gå till
   [github.com/settings/tokens/new](https://github.com/settings/tokens/new)
   (inloggad som `goranbillingskog-maker`) → Note: `stadtorget-admin` →
   Expiration: **No expiration** (eller så lång tid som känns rimligt) →
   bocka i **repo** → **Generate token** → kopiera koden (`ghp_...`).
2. I Vercel: öppna projektet → **Settings → Environment Variables** och lägg
   till följande (miljö: Production, gärna även Preview):

   | Namn | Värde |
   |---|---|
   | `GITHUB_TOKEN` | token du just skapade |
   | `GITHUB_OWNER` | `goranbillingskog-maker` |
   | `GITHUB_REPO` | `stada-se` |
   | `GITHUB_BRANCH` | `main` |
   | `ADMIN_PASSWORD` | ett lösenord du väljer själv |
   | `ADMIN_SESSION_SECRET` | en lång slumpad textsträng (bara du behöver veta den) |

3. Klicka **Redeploy** på senaste deployen så att miljövariablerna aktiveras.
4. Gå till `/admin`, logga in med ditt lösenord.

Kom ihåg att radera token-koden i det här dokumentet innan du delar filen med
någon annan.

## Uppdatera företagsdatan

All data ligger i **`data/companies.json`**. Byt ut filen mot en ny version
(samma format) direkt på GitHub: öppna filen i ditt repo → pennikonen →
klistra in nytt innehåll → **Commit changes**. Vercel bygger då om sajten
automatiskt inom några minuter.

## Miljövariabler (valfritt)

| Variabel | Vad den gör | Standard |
|---|---|---|
| `SITE_URL` | Sajtens adress i sitemap/metadata | `https://stadtorget.se` |
| `SKIP_IMAGES` | Sätt till `1` för att hoppa över bildnedladdning vid bygge | av |

Sätts i Vercel under **Settings → Environment Variables**.

## Struktur

- `app/page.jsx` – startsidan (stadslista, topplista, FAQ med schema-markup)
- `app/[city]/page.jsx` – stadssidor, t.ex. `/uppsala/`
- `app/[city]/[slug]/page.jsx` – företagssidor, t.ex. `/uppsala/rs-lokalvard/`
- `app/sitemap.js`, `app/robots.js` – genereras automatiskt
- `lib/data.js` – all datalogik (läser `data/companies.json`)
- `scripts/download-images.mjs` – hämtar bilder till Vercels CDN vid bygge
