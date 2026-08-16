# Städtorget.se — Innehållspaket för indexeringsproblemet

Det här dokumentet innehåller två delar:

1. **Sammanfattning av intern länkning** (vad som redan fungerar, vad som bör kollas)
2. **Färdiga texter för 9 pilotsidor** — klistra in direkt på respektive sida
3. **En återanvändbar mall** för resterande tjänst×ort-sidor

Alla siffror om RUT-avdrag nedan är kontrollerade mot aktuella källor (se sist i dokumentet). Priser är *riktvärden* från branschguider — byt gärna ut mot era egna siffror om ni har mer exakt data, eller mot statistik från era listade städfirmor.

---

## Del 1: Intern länkning — status

**Det som redan fungerar bra:**
- Varje ort-sida (t.ex. `/stockholm/`) länkar till alla 7 tjänster och till övriga 19 städer.
- Varje tjänst-sida (t.ex. `/tjanster/hemstadning/`) länkar till samtliga 20 orter för just den tjänsten.
- Breadcrumbs finns på plats (Hem › Hemstädning › Stockholm).

**Det som bör kontrolleras av er utvecklare:**
- Startsidans menylänk "Tjänster" pekar mot `/#tjanster` (en ankarlänk på samma sida). Be utvecklaren öppna sidans källkod (höger-klick → "Visa sidkälla", inte bara det som visas i webbläsaren) och kontrollera att det finns riktiga `<a href="/tjanster/hemstadning/">`-länkar där. Om länkarna bara byter innehåll via JavaScript utan att peka på en riktig webbadress ser Googlebot dem inte som klickbara vägar in till sidorna.
- Överväg att lägga till 2–3 "Relaterat"-länkar längst ner på varje tjänst×ort-sida (t.ex. till grannstäder eller andra tjänster i samma stad) samt kontextuella länkar från blogginlägg till specifika tjänst×ort-sidor — det ger dem tyngre interna länksignaler än en rad bland 20 likvärdiga länkar i sidfoten.

**Huvudslutsatsen:** länkstrukturen är i grunden sund. Det som mest sannolikt håller tillbaka indexeringen är att sidorna innehållsmässigt är för lika varandra (samma mall, mest listor med företagskort) i kombination med att sajten är stor (~880 URL:er) i förhållande till sin nuvarande auktoritet. Texterna nedan är till för att göra varje sida tillräckligt unik för att Google ska vilja crawla och indexera den.

---

## Del 2: Pilottexter (9 sidor)

**Instruktion:** klistra in "Introtext" som ett textblock ovanför eller bredvid företagslistan på respektive sida. Byt ut `[ANTAL FÖRETAG]` och `[BETYG]` mot era faktiska, aktuella siffror innan publicering — gissa aldrig på dessa.

---

### 1. Hemstädning i Stockholm
**Sida:** `/tjanster/hemstadning/stockholm/`

**Introtext:**
Stockholm är en stad av lägenheter, bostadsrätter och pressade scheman — och det märks i efterfrågan på återkommande hemstädning. Många stockholmare väljer en fast städdag varannan eller var fjärde vecka snarare än storstädning några gånger om året, eftersom det håller hemmet rent utan att det tar tid från jobb och familj. På Städtorget hittar du [ANTAL FÖRETAG] granskade städfirmor som är aktiva i Stockholms län, med snittbetyg [BETYG] av 5.

**Faktaruta — RUT-avdrag:**
Hemstädning i din bostad är en av de vanligaste RUT-berättigade tjänsterna. Du drar av 50 % av arbetskostnaden direkt på fakturan, upp till ett tak på 75 000 kr per person och år (delas med ROT-avdraget). Ett vanligt timpris innan avdrag ligger på ca 440–650 kr/timme, vilket landar på ungefär 220–325 kr/timme efter RUT.

**Vanliga frågor:**
- *Hur ofta bör jag boka hemstädning i en lägenhet i Stockholm?* De flesta väljer varannan vecka för en normalstor lägenhet, men veckostädning är vanligt bland barnfamiljer och husdjursägare.
- *Gäller RUT-avdraget även för bostadsrätt och hyresrätt?* Ja, RUT gäller alla boendeformer så länge städningen sker i din egen bostad.

---

### 2. Hemstädning i Malmö
**Sida:** `/tjanster/hemstadning/malmo/`

**Introtext:**
Malmö har en av landets mest internationella befolkningar och en bostadsmarknad som domineras av hyresrätter och studentbostäder, med närhet till Köpenhamn som gör vardagen extra tidspressad för många. Det gör återkommande hemstädning till en av de mest efterfrågade tjänsterna i staden. På Städtorget listar vi [ANTAL FÖRETAG] granskade städfirmor i Malmö med kunder som ger snittbetyget [BETYG] av 5.

**Faktaruta — RUT-avdrag:**
Precis som i övriga Sverige är hemstädning RUT-berättigat i Malmö: 50 % av arbetskostnaden dras av direkt på fakturan, upp till 75 000 kr per person och år. Räkna med ett timpris runt 220–325 kr efter avdrag, beroende på städfirma och bostadens storlek.

**Vanliga frågor:**
- *Kan jag boka hemstädning på engelska i Malmö?* Flera av städfirmorna i vår lista har personal som talar engelska — kontrollera respektive företagsprofil.
- *Vad ingår i en standardstädning?* Vanligtvis dammtorkning, dammsugning, golvtvätt, badrum och kök. Fönsterputs och skåprensning tillkommer oftast som tillägg.

---

### 3. Flyttstädning i Stockholm
**Sida:** `/tjanster/flyttstadning/stockholm/`

**Introtext:**
På en bostadsmarknad så het som Stockholms är det få saker som stressar en flytt mer än en godkänd besiktning. Bostadsrättsföreningar och hyresvärdar i Stockholm har ofta höga krav på flyttstädningen, och many köpare och hyresgäster begär en flyttstädningsgaranti innan tillträdet. På Städtorget hittar du [ANTAL FÖRETAG] granskade flyttstädfirmor i Stockholm som arbetar med garanti och efterbesiktning.

**Faktaruta — RUT-avdrag:**
Flyttstädning är RUT-berättigat på samma sätt som hemstädning, så länge städningen sker i din egen bostad (inte i en lokal du bara ska sälja/förmedla). Fråga alltid företaget om priset redan är angivet efter avdrag.

**Vanliga frågor:**
- *Vad händer om städfirman missar besiktningen?* De flesta seriösa firmor erbjuder en garanti där de återkommer och åtgärdar brister kostnadsfritt inom en viss tid.
- *Bör jag boka flyttstädning i god tid i Stockholm?* Ja — under högsäsong (maj–augusti och kring månadsskiften) är det klokt att boka minst 1–2 veckor i förväg.

---

### 4. Flyttstädning i Göteborg
**Sida:** `/tjanster/flyttstadning/goteborg/`

**Introtext:**
Göteborg är en stad av kontraster — allt från villor i Örgryte till lägenheter på Hisingen och radhus i ytterområdena. Det gör att flyttstädningens omfattning varierar mer än i en typisk innerstadsflytt, och det är extra viktigt att välja en firma som är van vid både stora och små objekt. På Städtorget listar vi [ANTAL FÖRETAG] granskade flyttstädfirmor som är aktiva i hela Göteborgsområdet.

**Faktaruta — RUT-avdrag:**
Flyttstädning i din bostad omfattas av RUT-avdraget: 50 % av arbetskostnaden dras direkt på fakturan, upp till 75 000 kr per person och år.

**Vanliga frågor:**
- *Ingår fönsterputs i flyttstädningen i Göteborg?* Hos de flesta firmor ingår invändig fönsterputs som standard vid flyttstädning — bekräfta alltid med företaget.
- *Kostar det mer att flyttstäda en villa än en lägenhet?* Ja, priset sätts oftast efter kvadratmeter och antal rum/våningar, så villor och radhus kostar generellt mer än en motsvarande lägenhet.

---

### 5. Flyttstädning i Malmö
**Sida:** `/tjanster/flyttstadning/malmo/`

**Introtext:**
Med sitt läge nära Öresundsbron har Malmö en ovanligt rörlig bostadsmarknad — många flyttar in och ut ur staden, ofta i samband med studier eller jobb på andra sidan sundet. Det ställer krav på flyttstädfirmor som kan hålla snäva tidsramar och garantera godkänd besiktning även med kort varsel. Vi listar [ANTAL FÖRETAG] granskade flyttstädfirmor i Malmö.

**Faktaruta — RUT-avdrag:**
RUT-avdraget gäller flyttstädning i Malmö precis som i övriga landet — 50 % av arbetskostnaden, upp till 75 000 kr per person och år.

**Vanliga frågor:**
- *Kan jag boka flyttstädning i Malmö med kort varsel?* Flera av de listade firmorna erbjuder akutbokning, men tillgängligheten varierar — kontakta gärna flera samtidigt vid tidsbrist.
- *Behöver jag vara hemma under städningen?* Nej, de flesta firmor kan städa med nyckelöverlämning eller kod, så länge ni kommer överens om det i förväg.

---

### 6. Fönsterputs i Stockholm
**Sida:** `/tjanster/fonsterputs/stockholm/`

**Introtext:**
Stockholms läge vid vatten innebär salthaltig luft och täta regnskurar, vilket gör att fönster smutsas ner snabbare än i inlandsstäder. I kombination med att många bor högt upp i flerbostadshus — där egen fönsterputsning både är opraktisk och riskfylld — är återkommande professionell fönsterputs extra efterfrågat i huvudstaden. Vi listar [ANTAL FÖRETAG] granskade fönsterputsfirmor i Stockholm.

**Faktaruta — RUT-avdrag:**
Fönsterputs är RUT-berättigat på samma villkor som hemstädning: 50 % av arbetskostnaden dras av direkt på fakturan.

**Vanliga frågor:**
- *Hur ofta bör man putsa fönster i en lägenhet i Stockholm?* 2–4 gånger per år är vanligt, oftare om lägenheten ligger nära en trafikerad gata.
- *Putsar firmorna fönster på höga hus?* Ja, flera av de listade firmorna har utrustning och certifiering för fönsterputs på högre höjder — fråga specifikt om detta vid bokning.

---

### 7. Fönsterputs i Göteborg
**Sida:** `/tjanster/fonsterputs/goteborg/`

**Introtext:**
Västkustklimatet gör Göteborg till en av landets mest krävande städer för fönster — blåst, regn och havsnära luft sliter snabbt på glasytorna. Många göteborgare väljer därför ett återkommande abonnemang istället för att boka fönsterputs enstaka gånger om året. Vi listar [ANTAL FÖRETAG] granskade fönsterputsfirmor som är aktiva i Göteborg med omnejd.

**Faktaruta — RUT-avdrag:**
Fönsterputs i din bostad omfattas av RUT-avdraget — 50 % av arbetskostnaden, upp till 75 000 kr per person och år.

**Vanliga frågor:**
- *Kan jag teckna ett abonnemang för fönsterputs i Göteborg?* Ja, de flesta firmor i listan erbjuder återkommande putsning kvartalsvis eller halvårsvis.
- *Putsar de även altandörrar och uterum?* Vanligtvis ja — fråga företaget om exakt vad som ingår i offerten.

---

### 8. Fönsterputs i Malmö
**Sida:** `/tjanster/fonsterputs/malmo/`

**Introtext:**
Malmös platta landskap gör staden extra utsatt for blåst året runt, vilket i kombination med stora fönsterpartier i nyare områden som Västra Hamnen skapar ett kontinuerligt behov av professionell fönsterputs. Vi listar [ANTAL FÖRETAG] granskade fönsterputsfirmor som är aktiva i Malmö.

**Faktaruta — RUT-avdrag:**
Fönsterputs är RUT-berättigat: 50 % av arbetskostnaden dras av direkt på fakturan, upp till 75 000 kr per person och år.

**Vanliga frågor:**
- *Är fönsterputs dyrare i lägenheter med stora glaspartier?* Ja, priset sätts oftast per fönster eller kvadratmeter glas, så moderna lägenheter med stora fönster kan kosta mer per tillfälle.
- *Kan jag boka fönsterputs tillsammans med hemstädning?* Många firmor erbjuder kombinerade paket — kontrollera respektive företags erbjudande.

---

### 9. Kontorsstädning i Stockholm
**Sida:** `/tjanster/kontorsstadning/stockholm/`

**Introtext:**
Stockholm har landets tätaste koncentration av kontorshotell, coworking-ytor och företagslokaler i city-läge, vilket ställer höga krav på flexibla städtider utanför ordinarie kontorstid. På Städtorget listar vi [ANTAL FÖRETAG] granskade städfirmor som är specialiserade på kontorsstädning i Stockholmsområdet, med avtal anpassade för allt från enskilda kontorsrum till hela våningsplan.

**Viktigt att notera:** till skillnad från hemstädning omfattas kontorsstädning **inte** av RUT-avdraget, eftersom avdraget bara gäller arbete i privatbostäder. Lyft istället fram att kostnaden för företag ofta är avdragsgill som driftskostnad och att moms kan lyftas — kontrollera alltid med er revisor vad som gäller för det specifika företaget.

**Vanliga frågor:**
- *Kan städningen ske kvällar och helger?* Ja, de flesta kontorsstädfirmor i Stockholm erbjuder städning utanför kontorstid för att inte störa verksamheten.
- *Går det att teckna löpande avtal istället för enstaka bokningar?* Ja, de flesta firmor i listan erbjuder månads- eller årsavtal med fast pris.

---

## Del 3: Mall för resterande 84 tjänst×ort-sidor

Använd samma struktur för varje kombination. Kopiera mallen nedan och fyll i det som står inom hakparenteser — variera gärna meningsbyggnaden så att det inte blir för likt föregående text.

```
### [Tjänst] i [Stad]
Sida: /tjanster/[tjanst-slug]/[stad-slug]/

Introtext (100–200 ord):
- Öppna med EN lokal/kontextuell detalj om staden eller tjänsten
  (klimat, bostadstyper, befolkning, pendling, säsong — variera vinkel
  per stad, undvik att bara byta ut stadsnamnet i samma mening)
- Koppla detaljen till varför just den här tjänsten är relevant där
- Avsluta med [ANTAL FÖRETAG] och [BETYG] (hämta från er egen data,
  gissa aldrig)

Faktaruta:
- Hemstädning, flyttstädning, fönsterputs, storstädning, trappstädning
  i privatbostad → RUT-berättigat, 50 % avdrag, tak 75 000 kr/person/år
- Kontorsstädning, byggstädning i kommersiell lokal → INTE RUT-berättigat,
  lyft istället fram avdragsgill driftskostnad/momslyft för företag

Vanliga frågor (2–3 st):
- En fråga om lokala förhållanden (tillgänglighet, klimat, bostadstyp)
- En fråga om vad som ingår i tjänsten
- (valfritt) En fråga om bokning/garanti
```

**Prioriteringsordning för resten:** fortsätt med de större städerna (Uppsala, Örebro, Linköping, Helsingborg, Jönköping) innan de mindre orterna, och gå tjänst för tjänst snarare än stad för stad — det gör det lättare att återanvända faktarutorna.

---

## Källor för RUT-avdrag och prisuppgifter
- [Holmens Marknad — RUT-avdrag 2026](https://www.holmensmarknad.se/rut-avdrag-2026-vad-galler-for-stadning-och-flyttstadning/)
- [VardagsPartner — Hemstädning pris per timme 2026](https://www.vardagspartner.se/stadskola/hur-mycket-kostar-hemstadning-per-timme/)
- [Offerta — Hur mycket kostar hemstädning](https://offerta.se/guider/stadning/hur-mycket-kostar-hemstadning)

**Obs:** dubbelkolla RUT-taket (75 000 kr/person/år) och avdragsprocenten (50 %) mot Skatteverkets egen sida innan publicering, eftersom nivåerna justeras av riksdagen och kan ändras mellan budgetår.
