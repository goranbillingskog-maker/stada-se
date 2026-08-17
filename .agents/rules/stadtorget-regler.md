# Stadtorget.se — Regler för AI-agenter (Antigravity)

**Placera den här filen i `.agents/rules/stadtorget-regler.md` i sajtens kodbas, så läses den automatiskt av Antigravity-agenter som jobbar i projektet.**

## Om sajten

- Domän: stadtorget.se
- Syfte: katalog/marknadsplats som listar granskade städfirmor i svenska städer, för att ranka i Google på sökningar som "hemstädning Stockholm", "flyttstädning Malmö" osv.
- Målgrupp: privatpersoner och företag som söker städfirma. Ägaren av sajten är icke-utvecklare — förklara tekniska beslut i klartext i rapporter/walkthroughs, anta ingen kodkunskap.

## Innehållsregler

- Hitta aldrig på siffror: antal företag, betygsnitt, priser eller andra statistikuppgifter. Om ett värde saknas eller inte går att hitta i sajtens egen datakälla, använd platshållaren `[VÄRDE SAKNAS]` och flagga det tydligt i din rapport — gissa aldrig.
- RUT-avdrag gäller för: hemstädning, flyttstädning, fönsterputs, storstädning (alla i privatbostad)
- RUT-avdrag gäller inte för kontorsstädning, byggstädning, trappstädning
- Aktuell RUT-nivå (kontrollera alltid mot Skatteverkets webbplats innan publicering, eftersom nivåerna kan ändras av riksdagen): 50 % avdrag på arbetskostnaden, tak 75 000 kr per person och år (delas med ROT-avdraget).
- Skriv all text på svenska, med naturlig ton. Undvik överdrivna superlativ eller påståenden som inte kan beläggas ("Sveriges bästa städfirma" etc.).
- Varje ny tjänst×ort-text ska ha en egen vinkel/inledning — kopiera inte samma mening och byt bara ut ortsnamnet, det är precis det mönstret som gjort datan svår att indexera.

## Tekniska regler

- Bevara befintlig design, komponentbibliotek och funktionalitet (sökning, filter, företagslistning). Nytt innehåll ska fogas in i den befintliga stilen, inte ersätta den.
- Vid arbete med interna länkar: verifiera alltid crawlbarhet genom att kontrollera "Visa sidkälla" (statisk HTML som skickas till klienten), inte bara det som visas i webbläsarens renderade DOM efter JavaScript har körts. En länk som bara finns i JS-genererad DOM utan motsvarande `<a href>` i källkoden räknas inte som fixad.
- Arbeta alltid i en gren/förhandsgranskning. Publicera aldrig direkt till produktion utan explicit godkännande från sajtägaren.
- Om kodbasen, plattformen eller en nödvändig datakälla inte går att hitta eller identifiera: stanna och rapportera istället för att gissa eller hårdkoda ett värde.
- Dokumentera alla ändrade filer i en walkthrough/sammanfattning skriven för en icke-utvecklare.

## Källor för fakta ovan

- [RUT-avdrag 2026 – Holmens Marknad](https://www.holmensmarknad.se/rut-avdrag-2026-vad-galler-for-stadning-och-flyttstadning/)
- [Hemstädning pris per timme 2026 – VardagsPartner](https://www.vardagspartner.se/stadskola/hur-mycket-kostar-hemstadning-per-timme/)
- [Hur mycket kostar hemstädning – Offerta](https://offerta.se/guider/stadning/hur-mycket-kostar-hemstadning)
