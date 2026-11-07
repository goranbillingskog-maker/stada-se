export default function Pips({
  rating = 5,
  max = 5,
  size = 18,
  variant = "default", // "default" | "score" | "dark"
}) {
  const rounded = Math.round(Number(rating) || 0);
  const formattedRating = typeof rating === "number" ? rating.toFixed(1).replace(".", ",") : "5,0";

  return (
    <span
      role="img"
      aria-label={`Betyg ${formattedRating} av ${max}`}
      className={`pips ${variant === "score" ? "score" : ""}`}
    >
      {Array.from({ length: max }).map((_, i) => {
        const isFilled = i < rounded;
        return (
          <span
            key={i}
            className={`pip ${isFilled ? "" : "pip--empty"}`}
            style={{
              width: `${size}px`,
              height: `${size}px`,
            }}
          />
        );
      })}
    </span>
  );
}
