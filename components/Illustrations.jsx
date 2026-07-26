// Enkla linjeillustrationer i Anthropic-stil (tunna streck, varma toner)

const stroke = { fill: "none", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };

export function ServiceIcon({ icon }) {
  switch (icon) {
    case "home":
      return (
        <svg viewBox="0 0 24 24" {...stroke} stroke="currentColor">
          <path d="M3 11.5 12 4l9 7.5" />
          <path d="M5.5 10v9h13v-9" />
          <path d="M10 19v-5h4v5" />
        </svg>
      );
    case "box":
      return (
        <svg viewBox="0 0 24 24" {...stroke} stroke="currentColor">
          <path d="M3.5 8 12 4l8.5 4v8L12 20l-8.5-4z" />
          <path d="M3.5 8 12 12l8.5-4" />
          <path d="M12 12v8" />
        </svg>
      );
    case "office":
      return (
        <svg viewBox="0 0 24 24" {...stroke} stroke="currentColor">
          <rect x="5" y="4" width="14" height="16" rx="1.5" />
          <path d="M9 8h2M13 8h2M9 12h2M13 12h2M9 16h2M13 16h2" />
        </svg>
      );
    case "sparkle":
      return (
        <svg viewBox="0 0 24 24" {...stroke} stroke="currentColor">
          <path d="M12 3c.7 3.9 2.1 5.3 6 6-3.9.7-5.3 2.1-6 6-.7-3.9-2.1-5.3-6-6 3.9-.7 5.3-2.1 6-6Z" />
          <path d="M19 15c.3 1.7.9 2.3 2.5 2.5-1.6.3-2.2.9-2.5 2.5-.3-1.6-.9-2.2-2.5-2.5 1.6-.2 2.2-.8 2.5-2.5Z" />
        </svg>
      );
    case "window":
      return (
        <svg viewBox="0 0 24 24" {...stroke} stroke="currentColor">
          <rect x="4.5" y="4.5" width="15" height="15" rx="1.5" />
          <path d="M12 4.5v15M4.5 12h15" />
        </svg>
      );
    case "hammer":
      return (
        <svg viewBox="0 0 24 24" {...stroke} stroke="currentColor">
          <path d="m13 7 6.5 6.5M4 20l7-7" />
          <path d="M10.5 4.5 15 3l4 4-1.5 4.5-3-1-5-5z" />
        </svg>
      );
    case "stairs":
      return (
        <svg viewBox="0 0 24 24" {...stroke} stroke="currentColor">
          <path d="M4 20h4v-4h4v-4h4V8h4" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" {...stroke} stroke="currentColor">
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
}

// Hero-illustration: hink, kvast och glittrande stjärnor
export function HeroArt() {
  return (
    <svg viewBox="0 0 420 360" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* mjuk bakgrundsform */}
      <ellipse cx="215" cy="200" rx="180" ry="150" fill="#f0eee6" />
      {/* hus */}
      <path d="M120 210 L215 130 L310 210" stroke="#1f1e1d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M145 195 v95 h140 v-95" stroke="#1f1e1d" strokeWidth="3" strokeLinecap="round" fill="#ffffff" />
      <rect x="192" y="235" width="46" height="55" rx="2" stroke="#1f1e1d" strokeWidth="3" fill="#f9ede6" />
      <rect x="160" y="215" width="24" height="24" rx="2" stroke="#1f1e1d" strokeWidth="2.5" fill="#e4efeb" />
      <rect x="246" y="215" width="24" height="24" rx="2" stroke="#1f1e1d" strokeWidth="2.5" fill="#e4efeb" />
      {/* kvast */}
      <path d="M330 110 L300 240" stroke="#bf5f3f" strokeWidth="4" strokeLinecap="round" />
      <path d="M300 240 l-18 44 M300 240 l-4 46 M300 240 l10 45 M300 240 l-30 38" stroke="#d97757" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M287 238 q13 10 26 2" stroke="#bf5f3f" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* hink */}
      <path d="M92 250 h56 l-7 46 a6 6 0 0 1-6 5 h-30 a6 6 0 0 1-6-5 z" stroke="#1f1e1d" strokeWidth="3" fill="#e4efeb" strokeLinejoin="round" />
      <path d="M96 250 a24 12 0 0 1 48 0" stroke="#1f1e1d" strokeWidth="3" fill="none" />
      {/* bubblor */}
      <circle cx="104" cy="228" r="7" stroke="#0f6b5c" strokeWidth="2.5" />
      <circle cx="124" cy="216" r="10" stroke="#0f6b5c" strokeWidth="2.5" />
      <circle cx="143" cy="230" r="5" stroke="#0f6b5c" strokeWidth="2.5" />
      {/* glitter */}
      <path d="M190 84 c1.8 9 5 12.2 14 14 -9 1.8-12.2 5-14 14 -1.8-9-5-12.2-14-14 9-1.8 12.2-5 14-14Z" fill="#d97757" />
      <path d="M104 130 c1.2 6 3.3 8.1 9.3 9.3 -6 1.2-8.1 3.3-9.3 9.3 -1.2-6-3.3-8.1-9.3-9.3 6-1.2 8.1-3.3 9.3-9.3Z" fill="#eab308" />
      <path d="M338 60 c1.2 6 3.3 8.1 9.3 9.3 -6 1.2-8.1 3.3-9.3 9.3 -1.2-6-3.3-8.1-9.3-9.3 6-1.2 8.1-3.3 9.3-9.3Z" fill="#0f6b5c" />
      <circle cx="252" cy="96" r="4" fill="#d97757" opacity="0.5" />
      <circle cx="76" cy="186" r="4" fill="#0f6b5c" opacity="0.4" />
    </svg>
  );
}
