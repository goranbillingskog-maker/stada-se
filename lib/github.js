// Läser och skriver data/companies.json direkt mot GitHub, så att adminpanelen
// kan spara ändringar utan egen databas. Vercel bygger om sajten automatiskt
// varje gång en commit landar på huvudgrenen.

const OWNER = process.env.GITHUB_OWNER;
const REPO = process.env.GITHUB_REPO;
const BRANCH = process.env.GITHUB_BRANCH || "main";
const TOKEN = process.env.GITHUB_TOKEN;
const FILE_PATH = "data/companies.json";

function assertEnv() {
  if (!OWNER || !REPO || !TOKEN) {
    throw new Error(
      "GitHub-inställningar saknas. Kontrollera att GITHUB_OWNER, GITHUB_REPO och GITHUB_TOKEN är satta i Vercel."
    );
  }
}

export async function getCompaniesFile() {
  assertEnv();
  const res = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}`,
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        Accept: "application/vnd.github+json",
      },
      cache: "no-store",
    }
  );
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Kunde inte hämta companies.json (${res.status}): ${text}`);
  }
  const json = await res.json();

  // GitHubs Contents-API returnerar bara filinnehåll direkt för filer under 1 MB.
  // companies.json är större än så, då kommer "content" tomt – hämta då filen
  // via Git Blob-API:et istället (stödjer filer upp till 100 MB).
  let content;
  if (json.content) {
    content = Buffer.from(json.content, "base64").toString("utf8");
  } else {
    const blobRes = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/git/blobs/${json.sha}`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          Accept: "application/vnd.github+json",
        },
        cache: "no-store",
      }
    );
    if (!blobRes.ok) {
      const text = await blobRes.text().catch(() => "");
      throw new Error(`Kunde inte hämta companies.json via blob-API (${blobRes.status}): ${text}`);
    }
    const blobJson = await blobRes.json();
    content = Buffer.from(blobJson.content, "base64").toString("utf8");
  }

  return { companies: JSON.parse(content), sha: json.sha };
}

export async function saveCompaniesFile(companies, sha, message) {
  assertEnv();
  const content = Buffer.from(JSON.stringify(companies, null, 2), "utf8").toString(
    "base64"
  );
  const res = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message || "Uppdatera företagsdata via admin",
        content,
        sha,
        branch: BRANCH,
      }),
    }
  );
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    if (res.status === 409) {
      throw new Error(
        "Filen har ändrats av någon annan sedan du laddade sidan. Ladda om och försök igen."
      );
    }
    throw new Error(`Kunde inte spara companies.json (${res.status}): ${text}`);
  }
  const json = await res.json();
  return { sha: json.content.sha };
}
