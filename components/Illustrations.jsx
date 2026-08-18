// Enkla linjeillustrationer i Anthropic-stil (tunna streck, varma toner)

const stroke = { fill: "none", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };

export function ServiceIcon({ icon }) {
  switch (icon) {
    case "home":
      return <img src="/images/icons/hemstad.png" alt="Hemstädning" width="24" height="24" style={{ display: "block" }} />;
    case "box":
      return <img src="/images/icons/flyttstad.png" alt="Flyttstädning" width="24" height="24" style={{ display: "block" }} />;
    case "office":
      return <img src="/images/icons/kontorsstad.png" alt="Kontorsstädning" width="24" height="24" style={{ display: "block" }} />;
    case "sparkle":
      return <img src="/images/icons/storstad.png" alt="Storstädning" width="24" height="24" style={{ display: "block" }} />;
    case "window":
      return <img src="/images/icons/fonsterputs.png" alt="Fönsterputs" width="24" height="24" style={{ display: "block" }} />;
    case "hammer":
      return <img src="/images/icons/byggstad.png" alt="Byggstädning" width="24" height="24" style={{ display: "block" }} />;
    case "stairs":
      return <img src="/images/icons/trappstad.png" alt="Trappstädning" width="24" height="24" style={{ display: "block" }} />;
    default:
      return (
        <svg viewBox="0 0 24 24" width="24" height="24">
          <circle cx="12" cy="12" r="8" fill="none" stroke="#565656" strokeWidth="2" />
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
