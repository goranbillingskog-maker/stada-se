import { getAllCompanies, getCompaniesByCity, getCities } from "./data.js";

export const SERVICES = [
  {
    slug: "hemstadning",
    name: "Hemstädning",
    keywords: ["hemstäd", "hemstädning"],
    icon: "home",
    intro:
      "Regelbunden städning av hemmet – dammsugning, våttorkning, badrum och kök. De flesta firmor erbjuder veckostäd eller varannan vecka, och med RUT-avdrag halveras arbetskostnaden.",
    priceRange: "Hemstädning kostar vanligtvis 450–650 kr/timme innan RUT-avdrag, vilket blir 225–325 kr/timme efter avdraget. Priset varierar beroende på ort, boyta och om du tecknar löpande abonnemang eller bokar enstaka tillfällen — löpande städning är oftast billigare per gång. (Uppskattat marknadspris — jämför alltid offerter från firmorna nedan för exakt pris.)",
    faq: [
      {
        question: "Vad ingår i hemstädning?",
        answer: "Vanligtvis dammsugning, våttorkning av golv, rengöring av kök och badrum, dammtorkning av ytor samt tömning av papperskorgar. Fönsterputs och storstädning ingår normalt inte utan bokas separat."
      },
      {
        question: "Hur ofta bör man hemstäda?",
        answer: "De flesta väljer städning varannan vecka eller en gång i veckan. Hushåll med barn, husdjur eller allergier städar ofta tätare."
      },
      {
        question: "Får jag RUT-avdrag på hemstädning?",
        answer: "Ja, hemstädning i din permanentbostad omfattas av RUT-avdraget om du är minst 18 år och skattskyldig i Sverige."
      },
      {
        question: "Är det billigare med löpande abonnemang än enstaka städning?",
        answer: "Ja, de flesta städfirmor ger lägre timpris vid regelbunden städning jämfört med engångsbokningar, eftersom planeringen blir enklare för firman."
      }
    ]
  },
  {
    slug: "flyttstadning",
    name: "Flyttstädning",
    keywords: ["flyttstäd"],
    icon: "box",
    intro:
      "Grundlig städning när du flyttar – ofta med besiktningsgaranti så att lägenheten godkänns av hyresvärd eller köpare. Prissätts vanligen per kvadratmeter och ger rätt till RUT-avdrag.",
    priceRange: "Flyttstädning kostar i snitt 30–45 kr per kvadratmeter efter RUT-avdrag. För en tvåa (50–75 kvm) landar priset ofta på 2 400–3 600 kr efter RUT (cirka 4 800–7 200 kr innan avdrag), och för en trea (80–110 kvm) 3 200–4 800 kr efter RUT. Priset kan bli högre vid extra smuts, helgbokning eller om balkong/garage ska ingå. (Uppskattat marknadspris — be firman om fast pris innan bokning.)",
    faq: [
      {
        question: "Vad ingår i flyttstädning?",
        answer: "En grundlig genomgång av alla rum inklusive kök (inuti skåp, ugn, kyl/frys), badrum, golv, fönster invändigt, dörrar och karmar — mer omfattande än vanlig hemstädning."
      },
      {
        question: "Ger flyttstädning godkänt vid besiktning?",
        answer: "De flesta seriösa firmor lämnar en garanti och åtgärdar kostnadsfritt om hyresvärden eller köparen anmärker på städningen inom en viss tid — kolla alltid vad som gäller innan du bokar."
      },
      {
        question: "Får jag RUT-avdrag på flyttstädning?",
        answer: "Ja, precis som hemstädning omfattas flyttstädning av RUT-avdraget för privatpersoner."
      },
      {
        question: "Hur långt innan flytten bör jag boka flyttstädning?",
        answer: "Boka gärna 1–2 veckor i förväg, och särskilt tidigt om flytten sker i samband med månadsskifte då efterfrågan är som högst."
      }
    ]
  },
  {
    slug: "kontorsstadning",
    name: "Kontorsstädning",
    keywords: ["kontorsstäd", "företagsstäd", "lokalvård", "butiksstäd"],
    icon: "office",
    intro:
      "Städning för företag och kontor – dagligen, veckovis eller efter behov. Många firmor skräddarsyr upplägget med egen kontaktperson och kvalitetsuppföljning.",
    priceRange: "Kontorsstädning prissätts oftast per månad snarare än per tillfälle. Ett mindre till mellanstort kontor med veckostädning ligger typiskt på 1 800–6 500 kr/månad — ett kontor på 150 kvm med 2 toaletter och städning en gång i veckan hamnar ofta runt 5 000 kr/månad. (Uppskattat marknadspris baserat på yta, frekvens och antal toaletter — begär offert för exakt pris.)",
    faq: [
      {
        question: "Vad påverkar priset för kontorsstädning?",
        answer: "Kontorets yta, städfrekvens, städnivå (standard vs. desinfektion av kontaktytor), antal toaletter/pentryn samt eventuella tillägg som fönsterputs eller golvvård."
      },
      {
        question: "Gäller RUT-avdrag för kontorsstädning?",
        answer: "Nej. RUT-avdraget gäller bara städning i privatbostäder — kontorsstädning är en företagstjänst och räknas inte in."
      },
      {
        question: "Hur ofta städas ett kontor vanligtvis?",
        answer: "De flesta kontor städas 1–3 gånger per vecka beroende på antal medarbetare och besökare."
      },
      {
        question: "Kan man boka kontorsstädning utanför kontorstid?",
        answer: "Ja, de flesta städfirmor erbjuder städning kvällstid eller tidig morgon för att inte störa verksamheten."
      }
    ]
  },
  {
    slug: "storstadning",
    name: "Storstädning",
    keywords: ["storstäd", "storsstäd"],
    icon: "sparkle",
    intro:
      "Djupgående städning av hela hemmet – bakom vitvaror, i skåp, fönsterkarmar och golvlister. Perfekt inför högtider, efter renovering eller som nystart. RUT-avdrag gäller.",
    priceRange: "Storstädning prissätts vanligen som ett totalpris utifrån bostadsstorlek (efter RUT-avdrag): etta (30–45 kvm) 2 200–3 200 kr, tvåa (50–70 kvm) 3 000–4 500 kr, trea (70–90 kvm) 4 200–6 000 kr, fyra/villa (100+ kvm) 6 000–10 000 kr. Priset beror även på bostadens skick. (Uppskattat marknadspris — de flesta firmor ger fast offert efter en snabb bedömning.)",
    faq: [
      {
        question: "Vad är skillnaden mellan storstädning och hemstädning?",
        answer: "Storstädning är mer grundlig och görs mer sällan — den täcker sådant som ugn, kyl/frys invändigt, fönsterbänkar, element och ventiler, till skillnad från löpande hemstädning."
      },
      {
        question: "Hur ofta bör man storstäda?",
        answer: "Vanligt är 1–2 gånger per år, men fler gånger vid allergier, husdjur eller inför en fest eller visning."
      },
      {
        question: "Får jag RUT-avdrag på storstädning?",
        answer: "Ja, storstädning i din permanentbostad omfattas av RUT-avdraget."
      },
      {
        question: "Kan priset bli högre än offerten?",
        answer: "Seriösa firmor lämnar oftast fast pris efter en bedömning av bostaden — eventuella tillägg (t.ex. extremt nedgången bostad) ska godkännas av dig innan de tillkommer."
      }
    ]
  },
  {
    slug: "fonsterputs",
    name: "Fönsterputs",
    keywords: ["fönsterputs"],
    icon: "window",
    intro:
      "Skinande rena fönster – invändigt och utvändigt, ofta som abonnemang några gånger per år. Många firmor putsar även höga och svåråtkomliga fönster. RUT-avdrag gäller för privatpersoner.",
    priceRange: "Fönsterputs kostar ofta 40–80 kr per standardfönster efter RUT-avdrag (cirka 80–160 kr innan avdrag), alternativt 350–550 kr/timme innan RUT. Priset påverkas av fönstertyp, antal sidor som putsas och hur lättillgängliga fönstren är. (Uppskattat marknadspris — spröjsade fönster och höga våningsplan kan kosta mer.)",
    faq: [
      {
        question: "Putsas fönstren både in- och utvändigt?",
        answer: "De flesta firmor erbjuder båda delarna, ofta som tillval — fråga alltid vad som ingår i priset."
      },
      {
        question: "Får jag RUT-avdrag på fönsterputs?",
        answer: "Ja, fönsterputs i din bostad räknas som en RUT-berättigad tjänst."
      },
      {
        question: "Hur ofta bör man putsa fönster?",
        answer: "Vanligt är 1–2 gånger per år, oftare vid gatunära lägen eller om fönstren utsätts för mycket smuts."
      },
      {
        question: "Behöver jag vara hemma när fönstren putsas?",
        answer: "Beror på firman — vissa kan putsa utsidan utan att du är hemma, men insidan kräver oftast tillträde till bostaden."
      }
    ]
  },
  {
    slug: "byggstadning",
    name: "Byggstädning",
    keywords: ["byggstäd"],
    icon: "hammer",
    intro:
      "Städning efter renovering eller nybyggnation – byggdamm, skyddsplast och grovavfall tas bort så att lokalen blir inflyttningsklar.",
    priceRange: "Byggstädning efter renovering kostar för privatpersoner ofta 35–50 kr/kvm efter RUT-avdrag (30–55 kr/kvm vid rena renoveringsprojekt). För företag ligger priset istället på 50–100 kr/kvm exklusive moms, eftersom RUT-avdrag bara gäller privatpersoners permanentbostad — inte fritidshus, nybygge som företag beställer, eller kommersiella lokaler. (Uppskattat marknadspris — begär offert baserat på ytans skick.)",
    faq: [
      {
        question: "Vad ingår i byggstädning?",
        answer: "Grundlig rengöring av byggdamm och rester efter renovering eller nybygge — golv, ytor, fönster, ventilation och ofta även fönsterbänkar och lister."
      },
      {
        question: "Får jag RUT-avdrag på byggstädning?",
        answer: "Ja, om det gäller din egen permanentbostad efter en renovering. Nej, om det gäller nybygge, fritidshus eller en lokal som beställs av ett företag."
      },
      {
        question: "När i renoveringsprocessen bör man boka byggstädning?",
        answer: "Direkt efter att hantverkarna är klara och innan du flyttar in möbler, för att undvika att byggdamm sprids vidare."
      },
      {
        question: "Skiljer sig byggstädning från vanlig storstädning?",
        answer: "Ja — byggstädning hanterar grövre smuts som cementdamm, färgrester och spikar, och kräver ofta andra verktyg och rengöringsmedel än vanlig städning."
      }
    ]
  },
  {
    slug: "trappstadning",
    name: "Trappstädning",
    keywords: ["trappstäd"],
    icon: "stairs",
    intro:
      "Regelbunden städning av trapphus och gemensamma utrymmen för bostadsrättsföreningar och fastighetsägare – ett rent trapphus är fastighetens första intryck.",
    priceRange: "Trappstädning för en mindre till mellanstor fastighet (1–3 trapphus, bi-veckovis städning) kostar vanligen 1 200–4 200 kr/månad, beroende på antal trapphus, våningar och tillval som hiss- eller källarstädning. Eftersom trappstädning oftast beställs av en bostadsrättsförening (en juridisk person) gäller inte RUT-avdrag — det är enskilda medlemmar som saknar den möjligheten för gemensamma ytor. (Uppskattat marknadspris — kontakta flera firmor för offert anpassad efter er fastighet.)",
    faq: [
      {
        question: "Hur ofta städas en trappuppgång vanligtvis?",
        answer: "Vanligast är varannan vecka, men veckovis städning förekommer i fastigheter med hög genomströmning."
      },
      {
        question: "Vem beställer trappstädning — föreningen eller de boende?",
        answer: "Normalt är det bostadsrättsföreningens styrelse eller en fastighetsägare som tecknar avtalet, inte den enskilda medlemmen."
      },
      {
        question: "Gäller RUT-avdrag för trappstädning i en BRF?",
        answer: "Nej, eftersom avtalet tecknas av föreningen (en juridisk person) och inte av en privatperson."
      },
      {
        question: "Vad ingår utöver själva trappstädningen?",
        answer: "Vanliga tillval är hisstädning, fönsterputs i trapphuset och städning av källar- och tvättstugeutrymmen."
      }
    ]
  }
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
