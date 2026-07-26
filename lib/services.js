import { getAllCompanies, getCompaniesByCity, getCities } from "./data.js";

export const SERVICES = [
  {
    slug: "hemstadning",
    name: "Hemstädning",
    keywords: ["hemstäd", "hemstädning"],
    icon: "home",
    intro:
      "Regelbunden städning av hemmet – dammsugning, våttorkning, badrum och kök. De flesta firmor erbjuder veckostäd eller varannan vecka, och med RUT-avdrag halveras arbetskostnaden.",
  },
  {
    slug: "flyttstadning",
    name: "Flyttstädning",
    keywords: ["flyttstäd"],
    icon: "box",
    intro:
      "Grundlig städning när du flyttar – ofta med besiktningsgaranti så att lägenheten godkänns av hyresvärd eller köpare. Prissätts vanligen per kvadratmeter och ger rätt till RUT-avdrag.",
  },
  {
    slug: "kontorsstadning",
    name: "Kontorsstädning",
    keywords: ["kontorsstäd", "företagsstäd", "lokalvård", "butiksstäd"],
    icon: "office",
    intro:
      "Städning för företag och kontor – dagligen, veckovis eller efter behov. Många firmor skräddarsyr upplägget med egen kontaktperson och kvalitetsuppföljning.",
  },
  {
    slug: "storstadning",
    name: "Storstädning",
    keywords: ["storstäd", "storsstäd"],
    icon: "sparkle",
    intro:
      "Djupgående städning av hela hemmet – bakom vitvaror, i skåp, fönsterkarmar och golvlister. Perfekt inför högtider, efter renovering eller som nystart. RUT-avdrag gäller.",
  },
  {
    slug: "fonsterputs",
    name: "Fönsterputs",
    keywords: ["fönsterputs"],
    icon: "window",
    intro:
      "Skinande rena fönster – invändigt och utvändigt, ofta som abonnemang några gånger per år. Många firmor putsar även höga och svåråtkomliga fönster. RUT-avdrag gäller för privatpersoner.",
  },
  {
    slug: "byggstadning",
    name: "Byggstädning",
    keywords: ["byggstäd"],
    icon: "hammer",
    intro:
      "Städning efter renovering eller nybyggnation – byggdamm, skyddsplast och grovavfall tas bort så att lokalen blir inflyttningsklar.",
  },
  {
    slug: "trappstadning",
    name: "Trappstädning",
    keywords: ["trappstäd"],
    icon: "stairs",
    intro:
      "Regelbunden städning av trapphus och gemensamma utrymmen för bostadsrättsföreningar och fastighetsägare – ett rent trapphus är fastighetens första intryck.",
  },
];

export function getService(slug) {
  return SERVICES.find((s) => s.slug === slug) || null;
}

function matchesService(company, service) {
  const haystack = (company.services.join(" ") + " " + company.serviceDescriptions).toLowerCase();
  return service.keywords.some((k) => haystack.includes(k));
}

export function companiesForService(serviceSlug, citySlug = null) {
  const service = getService(serviceSlug);
  if (!service) return [];
  const base = citySlug ? getCompaniesByCity(citySlug) : getAllCompanies();
  return base.filter((c) => matchesService(c, service));
}

export function serviceCityCombos() {
  const combos = [];
  for (const service of SERVICES) {
    for (const city of getCities()) {
      const count = companiesForService(service.slug, city.slug).length;
      if (count > 0) combos.push({ service: service.slug, city: city.slug, count });
    }
  }
  return combos;
}

export function citiesForService(serviceSlug) {
  return getCities()
    .map((city) => ({
      ...city,
      serviceCount: companiesForService(serviceSlug, city.slug).length,
    }))
    .filter((c) => c.serviceCount > 0);
}

// Koordinater för platskänning (närmaste stad)
export const CITY_COORDS = {
  stockholm: [59.33, 18.06],
  goteborg: [57.71, 11.97],
  malmo: [55.6, 13.0],
  uppsala: [59.86, 17.64],
  vasteras: [59.61, 16.55],
  orebro: [59.27, 15.21],
  linkoping: [58.41, 15.62],
  helsingborg: [56.05, 12.69],
  jonkoping: [57.78, 14.16],
  norrkoping: [58.59, 16.19],
  lund: [55.7, 13.19],
  umea: [63.83, 20.26],
  gavle: [60.67, 17.14],
  boras: [57.72, 12.94],
  sodertalje: [59.2, 17.63],
  eskilstuna: [59.37, 16.51],
  halmstad: [56.67, 12.86],
  vaxjo: [56.88, 14.81],
  karlstad: [59.38, 13.5],
  sundsvall: [62.39, 17.31],
};
