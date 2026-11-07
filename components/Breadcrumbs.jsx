import Link from "next/link";

export default function Breadcrumbs({ items = [] }) {
  // items: [{ label: "Hem", href: "/" }, { label: "Städfirmor i Uppsala", href: "/uppsala/" }, { label: "Vasaglansen AB" }]
  return (
    <nav
      className="crumbs w"
      aria-label="Brödsmula"
      style={{
        margin: "0 0 40px",
        fontSize: "14px",
        color: "var(--text-3)",
      }}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={index}>
            {item.href && !isLast ? (
              <Link href={item.href}>{item.label}</Link>
            ) : (
              <span>{item.label}</span>
            )}
            {!isLast && (
              <span aria-hidden="true" style={{ margin: "0 8px" }}>
                ›
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
