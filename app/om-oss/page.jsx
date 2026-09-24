export const metadata = {
  title: "Om oss",
  description:
    "Städtorget är en oberoende katalog över städfirmor i Sveriges största städer. Läs om hur vi samlar in och verifierar uppgifterna.",
  alternates: { canonical: "/om-oss/" },
};

export default function OmOssPage() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 760 }}>
        <h1>Om Städtorget</h1>
        <p>
          Städtorget är en oberoende katalog över städfirmor i 45 städer och områden runt
          om i Sverige. Vårt mål är enkelt: att göra det lätt att hitta en seriös
          städfirma där du bor – utan formulär, mellanhänder eller dolda avgifter.
        </p>
        <p>
          För varje företag samlar vi uppgifter från offentliga källor, företagens
          egna webbplatser och Google: tjänster, omdömen, organisationsnummer,
          RUT-avdrag och kontaktuppgifter. Du kontaktar alltid städfirman direkt.
        </p>
        <h2>Hur aktuella är uppgifterna?</h2>
        <p>
          Varje företagsprofil visar när uppgifterna senast verifierades. Hittar du
          något som inte stämmer, eller driver du en städfirma som vill uppdatera
          sin profil? Hör av dig till{" "}
          <a href="mailto:info@stadtorget.se">info@stadtorget.se</a> så rättar vi det.
        </p>
        <h2>För städfirmor</h2>
        <p>
          Är du städfirma och vill synas bättre på Städtorget? Vi arbetar med utökade
          företagsprofiler. Kontakta oss på{" "}
          <a href="mailto:info@stadtorget.se">info@stadtorget.se</a>.
        </p>
      </div>
    </section>
  );
}
