import Link from "next/link";

export default function Button({
  children,
  href,
  variant = "secondary", // "primary" | "secondary" | "sun"
  type = "button",
  onClick,
  style = {},
  className = "",
  ...props
}) {
  const variantClass =
    variant === "primary"
      ? "btn--primary"
      : variant === "sun"
      ? "btn--sun"
      : "";

  const combinedClass = `btn ${variantClass} ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={combinedClass} style={style} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={combinedClass}
      style={style}
      {...props}
    >
      {children}
    </button>
  );
}
