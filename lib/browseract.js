// Anropar BrowserAct för att automatiskt hämta uppgifter om ett städföretag:
// 1) Grunddata (adress, telefon, öppettider, betyg, foton) via BrowserActs
//    officiella "Google Maps API"-mall.
// 2) Kompletterande fält (organisationsnummer, prisinfo, bokningssätt, m.m.)
//    via en egen BrowserAct-workflow som läser företagets hemsida.
//
// Se docs.browseract.com/workflow/api-reference för API-referensen.

const API_BASE = "https://api.browseract.com";
const API_KEY = process.env.BROWSERACT_API_KEY;
const GMAPS_TEMPLATE_ID = process.env.BROWSERACT_GMAPS_TEMPLATE_ID; // t.ex. "77577579210625331"
const SITE_WORKFLOW_ID = process.env.BROWSERACT_SITE_WORKFLOW_ID; // skapas manuellt i BrowserAct-dashboarden
const PROXY_REGION = process.env.BROWSERACT_PROXY_REGION || "US";

// Hur länge vi väntar på att en BrowserAct-uppgift blir klar innan vi ger upp.
const POLL_TIMEOUT_MS = 90_000;
const POLL_INTERVAL_MS = 3_000;

function assertEnv() {
  if (!API_KEY) {
    throw new Error(
      "BROWSERACT_API_KEY saknas. Lägg till den som miljövariabel i Vercel."
    );
  }
}

async function browseractFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const json = await res.json().catch(() => null);
  if (!res.ok || (json && typeof json.code === "number" && json.code !== 0)) {
    const msg = json?.msg || `BrowserAct-anrop misslyckades (${res.status})`;
    throw new Error(msg);
  }
  return json;
}

async function runTemplateTask(templateId, inputParameters) {
  const json = await browseractFetch("/v2/workflow/run-task-by-template", {
    method: "POST",
    body: JSON.stringify({
      proxyRegion: PROXY_REGION,
      workflow_template_id: templateId,
      input_parameters: inputParameters,
    }),
  });
  return json.id;
}

async function runWorkflowTask(workflowId, inputParameters) {
  const json = await browseractFetch("/v2/workflow/run-task", {
    method: "POST",
    body: JSON.stringify({
      workflow_id: workflowId,
      input_parameters: inputParameters,
    }),
  });
  return json.id;
}

// Väntar på att en BrowserAct-uppgift blir klar och returnerar dess textutdata.
async function waitForTask(taskId) {
  const deadline = Date.now() + POLL_TIMEOUT_MS;
  while (Date.now() < deadline) {
    const task = await browseractFetch(`/v2/workflow/get-task?task_id=${taskId}`);
    if (task.status === "finished") {
      return task.output?.string || "";
    }
    if (task.status === "failed" || task.status === "canceled") {
      throw new Error(
        task.task_failure_info?.message || `BrowserAct-uppgiften avslutades med status "${task.status}".`
      );
    }
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
  }
  throw new Error("BrowserAct-uppgiften tog för lång tid (mer än 90 sekunder). Försök igen.");
}

// Försök tolka BrowserActs textutdata som JSON. Vissa workflows lindar
// resultatet i en array eller ett {items: [...]}-objekt – hantera båda.
function parseOutput(raw) {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    if (Array.isArray(parsed.items)) return parsed.items;
    return [parsed];
  } catch {
    return null;
  }
}

// Steg 1: hämta grunddata från Google Maps via BrowserActs officiella mall.
export async function lookupGoogleMaps(companyName, city) {
  assertEnv();
  if (!GMAPS_TEMPLATE_ID) {
    throw new Error(
      "BROWSERACT_GMAPS_TEMPLATE_ID saknas. Lägg till den som miljövariabel i Vercel."
    );
  }
  const keywords = `${companyName} städfirma ${city}`.trim();
  const taskId = await runTemplateTask(GMAPS_TEMPLATE_ID, [
    { name: "keywords", value: keywords },
    { name: "language", value: "sv" },
    { name: "country", value: "se" },
  ]);
  const raw = await waitForTask(taskId);
  const results = parseOutput(raw) || [];

  // Om flera träffar kom tillbaka, välj den vars namn/stad ligger närmast det
  // vi sökte på istället för att bara ta första träffen blint.
  const wanted = companyName.toLowerCase();
  const best =
    results.find((r) => (r.name || r.title || "").toLowerCase().includes(wanted)) ||
    results[0] ||
    null;

  return { best, allResults: results };
}

// Steg 2: läs företagets egen hemsida för organisationsnummer, prisinfo m.m.
export async function extractFromWebsite(websiteUrl) {
  assertEnv();
  if (!SITE_WORKFLOW_ID) {
    // Inte konfigurerad än – hoppa bara över detta steg istället för att krascha.
    return null;
  }
  if (!websiteUrl) return null;
  const taskId = await runWorkflowTask(SITE_WORKFLOW_ID, [
    { name: "url", value: websiteUrl },
  ]);
  const raw = await waitForTask(taskId);
  const results = parseOutput(raw);
  return results && results[0] ? results[0] : null;
}
