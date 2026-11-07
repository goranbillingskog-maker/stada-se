import Logo from "../../components/Logo.jsx";
import Button from "../../components/Button.jsx";
import Tile from "../../components/Tile.jsx";
import Pips from "../../components/Pips.jsx";
import Tag from "../../components/Tag.jsx";
import Breadcrumbs from "../../components/Breadcrumbs.jsx";
import Accordion from "../../components/Accordion.jsx";
import FirmLogo from "../../components/FirmLogo.jsx";
import { getCompaniesByCity } from "../../lib/data.js";

export const metadata = {
  title: "Designsystem Provsida | Städtorget",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DesignTestPage() {
  const uppsalaCompanies = getCompaniesByCity("uppsala");
  const firmWithLogo = uppsalaCompanies.find((c) => c.validLogo) || {
    name: "Upplands Fönsterputs AB",
    validLogo: "/images/companies/uppsala-upplands-fonsterputs-ab-logo.png",
  };
  const firmWithoutLogoSun = {
    name: "Clean Move AB",
    validLogo: null,
    fallbackLetter: "C",
    fallbackColor: "sun",
  };
  const firmWithoutLogoMint = {
    name: "Fix & Fint Uppland AB",
    validLogo: null,
    fallbackLetter: "F",
    fallbackColor: "mint",
  };
  const firmWithoutLogoWater = {
    name: "Putspolarna i Uppsala AB",
    validLogo: null,
    fallbackLetter: "P",
    fallbackColor: "water",
  };
  const firmWithoutLogoPale = {
    name: "Städ & Fönsterputs i Uppland AB",
    validLogo: null,
    fallbackLetter: "S",
    fallbackColor: "pale",
  };

  const sampleFaq = [
    {
      question: "Vad kostar en städfirma?",
      answer:
        "Priset varierar med tjänst och stad. Hemstädning kostar ofta 200–350 kr per timme efter RUT-avdrag, medan flyttstädning vanligen prissätts per kvadratmeter.",
    },
    {
      question: "Vad är RUT-avdrag och vem kan använda det?",
      answer:
        "RUT-avdraget ger dig som privatperson 50 % rabatt på arbetskostnaden för hushållsnära tjänster direkt på fakturan.",
    },
  ];

  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <main style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "40px var(--gutter) 80px" }}>
        <Breadcrumbs
          items={[
            { label: "Hem", href: "/" },
            { label: "Designsystem", href: "/design-test/" },
            { label: "Komponentöversikt" },
          ]}
        />

        <div style={{ marginBottom: "64px" }}>
          <h1
            className="d"
            style={{
              fontSize: "clamp(48px, 6vw, 88px)",
              lineHeight: 0.9,
              letterSpacing: "-0.02em",
              margin: "0 0 16px",
            }}
          >
            Designsystem: Kakelväggen
          </h1>
          <p style={{ fontSize: "19px", color: "var(--text-2)", maxWidth: "60ch", margin: 0 }}>
            Här är alla gemensamma komponenter, typsnittsvarianter och färg-tokens samlade på en och samma provsida.
          </p>
        </div>

        {/* 1. TYPOGRAFIKONTROLL */}
        <section style={{ marginBottom: "64px" }}>
          <h2 className="d" style={{ fontSize: "36px", marginBottom: "20px" }}>
            1. Typografikontroll (Archivo variabel)
          </h2>
          <div className="grout-box" style={{ display: "flex", flexDirection: "column", gap: "12px", background: "var(--white)", padding: "24px" }}>
            <div>
              <span className="w" style={{ fontSize: "13px", color: "var(--text-3)", display: "block" }}>
                Rubrikstil (.d — font-stretch: 70%, vikt 800, smala och kraftiga bokstäver):
              </span>
              <div className="d" style={{ fontSize: "48px", lineHeight: 0.95 }}>
                Hitta rätt städfirma – utan att leta
              </div>
            </div>

            <hr style={{ border: 0, borderTop: "1px solid var(--grout)", margin: "12px 0" }} />

            <div>
              <span className="w" style={{ fontSize: "13px", color: "var(--text-3)", display: "block" }}>
                Normal brödtext (font-stretch: 100%, vikt 400, 18px, läsligt radavstånd):
              </span>
              <p style={{ margin: "4px 0 0", maxWidth: "62ch", fontSize: "18px", lineHeight: 1.55 }}>
                Det här är sajtens löpande brödtext. Den är satt i Archivo med normal bredd (100 %) för att vara lugn och bekväm att läsa på både mobil och dator.
              </p>
            </div>

            <hr style={{ border: 0, borderTop: "1px solid var(--grout)", margin: "12px 0" }} />

            <div>
              <span className="w" style={{ fontSize: "13px", color: "var(--text-3)", display: "block" }}>
                Småtext (.w — font-stretch: 112%, vikt 450, breddad och luftig):
              </span>
              <div className="w" style={{ fontSize: "15px", color: "var(--text-2)", display: "flex", gap: "24px", flexWrap: "wrap" }}>
                <span>225–325 kr/tim efter RUT</span>
                <span>Vasastan, Stockholm</span>
                <span>200 omdömen på Google</span>
                <span>Verifierat 2026-07-04</span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. FÄRGPALETT */}
        <section style={{ marginBottom: "64px" }}>
          <h2 className="d" style={{ fontSize: "36px", marginBottom: "20px" }}>
            2. Färg-tokens (Kakelpaletten)
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
              gap: "12px",
            }}
          >
            {[
              { name: "--ink", hex: "#0E2B3B", label: "Mörkblå / Text" },
              { name: "--sun", hex: "#FFC933", label: "Gul Accent" },
              { name: "--mint", hex: "#C4E6DA", label: "Mint kakel" },
              { name: "--water", hex: "#9CCBE4", label: "Vattenblå" },
              { name: "--pale", hex: "#E1ECE9", label: "Blek kakel" },
              { name: "--white", hex: "#FFFFFF", label: "Vit kakel" },
              { name: "--grout", hex: "#CBD9D6", label: "Fogfärg" },
              { name: "--paper", hex: "#EEF3F2", label: "Sidbakgrund" },
            ].map((c) => (
              <div
                key={c.name}
                style={{
                  background: c.hex,
                  padding: "16px",
                  borderRadius: "var(--r-tile)",
                  boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.08)",
                  color: c.name === "--ink" ? "#FFFFFF" : "var(--ink)",
                  minHeight: "100px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <span className="d" style={{ fontSize: "16px" }}>{c.name}</span>
                <span className="w" style={{ fontSize: "12px" }}>{c.label} ({c.hex})</span>
              </div>
            ))}
          </div>
        </section>

        {/* 3. KNAPPAR */}
        <section style={{ marginBottom: "64px" }}>
          <h2 className="d" style={{ fontSize: "36px", marginBottom: "20px" }}>
            3. Knappar (Button)
          </h2>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
            <Button variant="primary">Primär knapp (Ring 073-508 52 56)</Button>
            <Button variant="secondary">Sekundär knapp (Mejla)</Button>
            <Button variant="sun">Sökknapp (Visa städfirmor)</Button>
          </div>
        </section>

        {/* 4. KAKEL (TILE) */}
        <section style={{ marginBottom: "64px" }}>
          <h2 className="d" style={{ fontSize: "36px", marginBottom: "20px" }}>
            4. Kakelrutor (Tile)
          </h2>
          <div className="grout-box" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "6px" }}>
            <Tile color="sun" size="m">
              <span className="d" style={{ fontSize: "32px", lineHeight: 1 }}>Stockholm</span>
              <span className="w" style={{ fontSize: "14px" }}>127 firmor</span>
            </Tile>
            <Tile color="mint" size="m">
              <span className="d" style={{ fontSize: "32px", lineHeight: 1 }}>Uppsala</span>
              <span className="w" style={{ fontSize: "14px" }}>34 firmor</span>
            </Tile>
            <Tile color="water" size="m">
              <span className="d" style={{ fontSize: "32px", lineHeight: 1 }}>Karlstad</span>
              <span className="w" style={{ fontSize: "14px" }}>32 firmor</span>
            </Tile>
            <Tile color="pale" size="m">
              <span className="d" style={{ fontSize: "32px", lineHeight: 1 }}>Helsingborg</span>
              <span className="w" style={{ fontSize: "14px" }}>24 firmor</span>
            </Tile>
            <Tile color="white" size="m">
              <span className="d" style={{ fontSize: "32px", lineHeight: 1 }}>Göteborg</span>
              <span className="w" style={{ fontSize: "14px" }}>18 firmor</span>
            </Tile>
          </div>
        </section>

        {/* 5. BETYGSKAKEL & TAGGAR */}
        <section style={{ marginBottom: "64px" }}>
          <h2 className="d" style={{ fontSize: "36px", marginBottom: "20px" }}>
            5. Betyg (Pips) och Taggar (Tag)
          </h2>
          <div style={{ display: "flex", gap: "32px", flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ background: "var(--white)", padding: "16px 20px", borderRadius: "var(--r-tile)", display: "flex", alignItems: "center", gap: "12px" }}>
              <Pips rating={5.0} />
              <span className="d" style={{ fontSize: "32px", lineHeight: 1 }}>5,0</span>
            </div>
            <div style={{ background: "var(--white)", padding: "16px 20px", borderRadius: "var(--r-tile)", display: "flex", alignItems: "center", gap: "12px" }}>
              <Pips rating={4.0} />
              <span className="d" style={{ fontSize: "32px", lineHeight: 1 }}>4,0</span>
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <Tag isRut={true}>RUT-avdrag</Tag>
              <Tag>Hemstädning</Tag>
              <Tag>Flyttstädning</Tag>
              <Tag>Fönsterputsning</Tag>
            </div>
          </div>
        </section>

        {/* 6. FIRMALOGOTYPER OCH RESERVLÖSNING */}
        <section style={{ marginBottom: "64px" }}>
          <h2 className="d" style={{ fontSize: "36px", marginBottom: "20px" }}>
            6. FirmLogotyper: Riktig logotyp vs Stabil reservlösning
          </h2>
          <p style={{ margin: "0 0 16px", color: "var(--text-2)" }}>
            Om bilden saknas eller är mindre än 300 byte visas en stabil bokstavskakel i rätt färg direkt vid bygget:
          </p>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
            <div>
              <FirmLogo company={firmWithLogo} size={104} />
              <span className="w" style={{ fontSize: "12px", display: "block", marginTop: "4px" }}>
                Riktig logotyp
              </span>
            </div>
            <div>
              <FirmLogo company={firmWithoutLogoSun} size={104} />
              <span className="w" style={{ fontSize: "12px", display: "block", marginTop: "4px" }}>
                Reserv: Sun (C)
              </span>
            </div>
            <div>
              <FirmLogo company={firmWithoutLogoMint} size={104} />
              <span className="w" style={{ fontSize: "12px", display: "block", marginTop: "4px" }}>
                Reserv: Mint (F)
              </span>
            </div>
            <div>
              <FirmLogo company={firmWithoutLogoWater} size={104} />
              <span className="w" style={{ fontSize: "12px", display: "block", marginTop: "4px" }}>
                Reserv: Water (P)
              </span>
            </div>
            <div>
              <FirmLogo company={firmWithoutLogoPale} size={104} />
              <span className="w" style={{ fontSize: "12px", display: "block", marginTop: "4px" }}>
                Reserv: Pale (S)
              </span>
            </div>
          </div>
        </section>

        {/* 7. ACCORDION / FAQ */}
        <section style={{ marginBottom: "64px" }}>
          <h2 className="d" style={{ fontSize: "36px", marginBottom: "20px" }}>
            7. Accordion / FAQ (HTML details/summary)
          </h2>
          <Accordion items={sampleFaq} />
        </section>
      </main>
    </div>
  );
}
