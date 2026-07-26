import Link from "next/link";
import { notFound } from "next/navigation";
import { getCity, SITE_URL } from "../../../../lib/data.js";
import {
  getService,
  companiesForService,
  serviceCityCombos,
} from "../../../../lib/services.js";
import { CompanyCard, Breadcrumbs, JsonLd } from "../../../../components/Ui.jsx";

export const dynamicParams = false;

export function generateStaticParams() {
  return serviceCityCombos().map((c) => ({ service: c.service, city: c.city }));
}

export async function generateMetadata({ params }) {
  const { service, city } = await params;
  const s = getService(service);
  const cityInfo = getCity(city);
  if (!s || !cityInfo) return {};
  const list = companiesForService(service, city);
  return {
    title: `${s.name} ${cityInfo.name} – jämför ${list.length} städfirmor`,
    description: `${s.name} i ${cityInfo.name}: jämför ${list.length} städfirmor med Google-omdömen, priser och RUT-avdrag. Kontakta firmorna direkt – helt gratis.`,
    alternates: { canonical: `/tjanster/${s.slug}/${cityInfo.slug}/` },
  };
}

export default async function ServiceCityPage({ params }) {
  const { service, city } = await params;
  const s = getService(service);
  const cityInfo = getCity(city);
  if (!s || !cityInfo) notFound();

  const companies = companiesForService(service, city);
  if (!companies.length) notFound();
  const withRut = companies.filter((c) => c.rutAvdrag === "Ja").length;
  const rated = companies.filter((c) => c.rating);
  const avg =
    rated.length > 0
      ? (rated.reduce((a, c) => a + c.rating, 0) / rated.length).toFixed(1).replace(".", ",")
      : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${s.name} i ${cityInfo.name}`,
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
      { "@type": "ListItem", position: 2, name: s.name, item: `${SITE_URL}/tjanster/${s.slug}/` },
      {
        "@type": "ListItem",
        position: 3,
        name: `${s.name} ${cityInfo.name}`,
        item: `${SITE_URL}/tjanster/${s.slug}/${cityInfo.slug}/`,
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
          { label: s.name, href: `/tjanster/${s.slug}/` },
          { label: cityInfo.name },
        ]}
      />
      <section className="section" style={{ paddingTop: 24 }}>
        <div className="container">
          <h1>
            {s.name} i {cityInfo.name}
          </h1>
          <p className="lead">
            {s.intro} I {cityInfo.name} listar vi {companies.length} städfirmor som
            erbjuder {s.name.toLowerCase()}
            {avg ? `, med ett genomsnittligt betyg på ${avg} av 5` : ""}.
            {withRut
              ? ` ${withRut} av dem erbjuder RUT-avdrag.`
              : ""}{" "}
            Jämför och kontakta firmorna direkt nedan.
          </p>
          <div className="company-list">
            {companies.map((c) => (
              <CompanyCard key={c.slug} company={c} />
            ))}
          </div>
          <p className="small-print">
            Se även{" "}
            <Link href={`/${cityInfo.slug}/`}>alla städfirmor i {cityInfo.name}</Link>{" "}
            eller <Link href={`/tjanster/${s.slug}/`}>{s.name.toLowerCase()} i andra städer</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
