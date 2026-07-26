import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_URL } from "../../../lib/data.js";
import {
  SERVICES,
  getService,
  citiesForService,
  companiesForService,
} from "../../../lib/services.js";
import { Breadcrumbs, JsonLd } from "../../../components/Ui.jsx";
import { ServiceIcon } from "../../../components/Illustrations.jsx";

export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICES.map((s) => ({ service: s.slug }));
}

export async function generateMetadata({ params }) {
  const { service } = await params;
  const s = getService(service);
  if (!s) return {};
  const total = companiesForService(s.slug).length;
  return {
    title: `${s.name} – jämför ${total} städfirmor i 20 städer`,
    description: `${s.name}: jämför ${total} städfirmor med omdömen och RUT-avdrag i Sveriges största städer. ${s.intro}`,
    alternates: { canonical: `/tjanster/${s.slug}/` },
  };
}

export default async function ServicePage({ params }) {
  const { service } = await params;
  const s = getService(service);
  if (!s) notFound();

  const cities = citiesForService(s.slug);
  const total = companiesForService(s.slug).length;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Hem", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: s.name, item: `${SITE_URL}/tjanster/${s.slug}/` },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <Breadcrumbs items={[{ label: "Hem", href: "/" }, { label: s.name }]} />
      <section className="section" style={{ paddingTop: 24 }}>
        <div className="container">
          <div className="service-card" style={{ display: "inline-flex", padding: 12, marginBottom: 18 }}>
            <div className="icon" style={{ margin: 0 }}><ServiceIcon icon={s.icon} /></div>
          </div>
          <h1>{s.name} – jämför firmor i din stad</h1>
          <p className="lead">
            {s.intro} Just nu listar vi {total} städfirmor som erbjuder{" "}
            {s.name.toLowerCase()} i Sveriges största städer. Välj din stad nedan.
          </p>
          <div className="city-grid">
            {cities.map((c) => (
              <Link key={c.slug} href={`/tjanster/${s.slug}/${c.slug}/`} className="city-card">
                <span>
                  <span className="name">{c.name}</span>
                  <br />
                  <span className="count">{c.serviceCount} firmor</span>
                </span>
                <span className="arrow">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
