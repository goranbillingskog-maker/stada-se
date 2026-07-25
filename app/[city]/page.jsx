import { notFound } from "next/navigation";
import {
  getCities,
  getCity,
  getCompaniesByCity,
  topServicesInCity,
  SITE_URL,
} from "../../lib/data.js";
import { CompanyCard, Breadcrumbs, JsonLd } from "../../components/Ui.jsx";

export const dynamicParams = false;

export function generateStaticParams() {
  return getCities().map((c) => ({ city: c.slug }));
}

export async function generateMetadata({ params }) {
  const { city } = await params;
  const cityInfo = getCity(city);
  if (!cityInfo) return {};
  return {
    title: `Städfirma ${cityInfo.name} – jämför ${cityInfo.count} städfirmor med omdömen`,
    description: `Hitta städfirma i ${cityInfo.name}. Jämför ${cityInfo.count} städfirmor med Google-omdömen, tjänster, RUT-avdrag och kontaktuppgifter. Hemstädning, flyttstädning och kontorsstädning i ${cityInfo.name}.`,
    alternates: { canonical: `/${cityInfo.slug}/` },
  };
}

export default async function CityPage({ params }) {
  const { city } = await params;
  const cityInfo = getCity(city);
  if (!cityInfo) notFound();

  const companies = getCompaniesByCity(city);
  const topServices = topServicesInCity(city, 5);
  const withRut = companies.filter((c) => c.rutAvdrag === "Ja").length;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Städfirmor i ${cityInfo.name}`,
    numberOfItems: companies.length,
    itemListElement: companies.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      url: `${SITE_URL}/${c.citySlug}/${c.slug}/`,
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Hem", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: `Städfirmor i ${cityInfo.name}`,
        item: `${SITE_URL}/${cityInfo.slug}/`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <Breadcrumbs
        items={[
          { label: "Hem", href: "/" },
          { label: `Städfirmor i ${cityInfo.name}` },
        ]}
      />
      <section className="section" style={{ paddingTop: 24 }}>
        <div className="container">
          <h1>Städfirmor i {cityInfo.name}</h1>
          <p className="lead">
            Här hittar du {companies.length} städfirmor i {cityInfo.name}
            {cityInfo.avgRating
              ? `, med ett genomsnittligt Google-betyg på ${String(cityInfo.avgRating).replace(".", ",")} av 5`
              : ""}
            .{" "}
            {topServices.length
              ? `Vanligaste tjänsterna är ${topServices
                  .map((s) => s.name.toLowerCase())
                  .slice(0, 3)
                  .join(", ")}.`
              : ""}{" "}
            {withRut
              ? `${withRut} av firmorna erbjuder RUT-avdrag, vilket halverar arbetskostnaden för dig som privatperson.`
              : ""}{" "}
            Jämför betyg och tjänster nedan och kontakta firmorna direkt – helt
            gratis.
          </p>
          <div className="company-list">
            {companies.map((c) => (
              <CompanyCard key={c.slug} company={c} />
            ))}
          </div>
          <p className="small-print">
            Listan sorteras efter Google-betyg. Uppgifterna kommer från offentliga
            källor och företagens egna webbplatser.
          </p>
        </div>
      </section>
    </>
  );
}
