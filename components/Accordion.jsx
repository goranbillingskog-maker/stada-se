export default function Accordion({ items = [] }) {
  // items: [{ question: "...", answer: "..." }]
  return (
    <div className="accordion">
      {items.map((item, index) => (
        <details key={index} className="accordion-item">
          <summary className="accordion-summary">
            <span
              className="d"
              style={{
                fontSize: "28px",
                lineHeight: 1,
                fontStretch: "78%",
                fontWeight: 700,
              }}
            >
              {item.question}
            </span>
            <svg
              className="plus"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                d="M10 3v14M3 10h14"
                stroke="var(--ink)"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </summary>
          <p className="accordion-content">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
