// Enkla linjeillustrationer i Anthropic-stil (tunna streck, varma toner)

const stroke = { fill: "none", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };

export function ServiceIcon({ icon }) {
  switch (icon) {
    case "home":
      return (
        <svg viewBox="0 0 24 24" width="24" height="24">
          {/* House body */}
          <path d="M5 20V11L12 5L19 11V20H5Z" fill="none" stroke="#565656" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {/* Door */}
          <path d="M10 20V14H14V20" fill="none" stroke="#565656" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {/* Roof (Terracotta) */}
          <path d="M2 11.5L12 3L22 11.5" fill="none" stroke="#91562d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {/* Sparkle (Coral) */}
          <path d="M18 6.5C18 7.5 17.5 8 16.5 8C17.5 8 18 8.5 18 9.5C18 8.5 18.5 8 19.5 8C18.5 8 18 7.5 18 6.5Z" fill="#d97757" />
        </svg>
      );
    case "box":
      return (
        <svg viewBox="0 0 24 24" width="24" height="24">
          {/* Box outline */}
          <path d="M3 8L12 4L21 8V16L12 20L3 16V8Z" fill="none" stroke="#91562d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {/* Box flaps/inner lines */}
          <path d="M3 8L12 12L21 8" fill="none" stroke="#565656" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 12V20" fill="none" stroke="#565656" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Moving Arrow (Teal) */}
          <path d="M7 13.5L9.5 11M9.5 11H7M9.5 11V13.5" fill="none" stroke="#0f6b5c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "office":
      return (
        <svg viewBox="0 0 24 24" width="24" height="24">
          {/* Buildings */}
          <rect x="4" y="6" width="9" height="15" rx="1" fill="none" stroke="#565656" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="13" y="10" width="7" height="11" rx="1" fill="none" stroke="#91562d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {/* Windows */}
          <path d="M7 9H9M7 12H9M7 15H9M16 13H18M16 16H18" fill="none" stroke="#565656" strokeWidth="1.5" strokeLinecap="round" />
          {/* Sparkle (Coral) */}
          <path d="M16 5.5C16 6.5 15.5 7 14.5 7C15.5 7 16 7.5 16 8.5C16 7.5 16.5 7 17.5 7C16.5 7 16 6.5 16 5.5Z" fill="#d97757" />
        </svg>
      );
    case "sparkle":
      return (
        <svg viewBox="0 0 24 24" width="24" height="24">
          {/* Spray bottle */}
          <path d="M7 11H12L11 20H8L7 11Z" fill="none" stroke="#565656" strokeWidth="2" strokeLinejoin="round" />
          <path d="M9 11V8H11V11" fill="none" stroke="#565656" strokeWidth="2" />
          {/* Spray head (Terracotta) */}
          <path d="M8 8H12L13 6H7L8 8Z" fill="#91562d" stroke="#91562d" strokeWidth="1" />
          {/* Sparkles (Coral & Teal) */}
          <path d="M17 5C17 6.5 16.2 7.2 14.8 7.5C16.2 7.8 17 8.5 17 10C17 8.5 17.8 7.8 19.2 7.5C17.8 7.2 17 6.5 17 5Z" fill="#d97757" />
          <path d="M19 14C19 15 18.5 15.5 17.5 15.7C18.5 15.9 19 16.4 19 17.4C19 16.4 19.5 15.9 20.5 15.7C19.5 15.5 19 15 19 14Z" fill="#0f6b5c" />
        </svg>
      );
    case "window":
      return (
        <svg viewBox="0 0 24 24" width="24" height="24">
          {/* Window Frame */}
          <rect x="4" y="4" width="16" height="16" rx="1.5" fill="none" stroke="#565656" strokeWidth="2" />
          <path d="M12 4V20M4 12H20" fill="none" stroke="#565656" strokeWidth="1.5" />
          {/* Squeegee (Terracotta/Brown) */}
          <path d="M13 7H21" fill="none" stroke="#91562d" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M17 7V13" fill="none" stroke="#91562d" strokeWidth="2" strokeLinecap="round" />
          {/* Clean sparkle (Teal) */}
          <path d="M8 7.5C8 8.3 7.6 8.7 6.8 8.9C7.6 9.1 8 9.5 8 10.3C8 9.5 8.4 9.1 9.2 8.9C8.4 8.7 8 8.3 8 7.5Z" fill="#0f6b5c" />
        </svg>
      );
    case "hammer":
      return (
        <svg viewBox="0 0 24 24" width="24" height="24">
          {/* Hammer handle */}
          <path d="M6 18L15 9" fill="none" stroke="#91562d" strokeWidth="2.5" strokeLinecap="round" />
          {/* Hammer head */}
          <path d="M13.5 7.5L16.5 4.5L19.5 7.5L16.5 10.5L13.5 7.5Z" fill="#565656" stroke="#565656" strokeWidth="1" />
          {/* Brush or Broom crossed */}
          <path d="M18 18L9 9" fill="none" stroke="#565656" strokeWidth="1.5" strokeLinecap="round" />
          {/* Broom bristles */}
          <path d="M7.5 7.5L6 6" fill="none" stroke="#0f6b5c" strokeWidth="2" strokeLinecap="round" />
          {/* Sparkle */}
          <path d="M20 12.5C20 13.1 19.7 13.4 19.1 13.5C19.7 13.6 20 13.9 20 14.5C20 13.9 20.3 13.6 20.9 13.5C20.3 13.4 20 13.1 20 12.5Z" fill="#d97757" />
        </svg>
      );
    case "stairs":
      return (
        <svg viewBox="0 0 24 24" width="24" height="24">
          {/* Stairs steps */}
          <path d="M4 19H8V15H12V11H16V7H20" fill="none" stroke="#565656" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Handrail (Terracotta) */}
          <path d="M4 12L16 4" fill="none" stroke="#91562d" strokeWidth="2" strokeLinecap="round" />
          <path d="M4 12V16M16 4V8" fill="none" stroke="#91562d" strokeWidth="1.5" strokeLinecap="round" />
          {/* Sparkles */}
          <path d="M12 6.5C12 7.1 11.7 7.4 11.1 7.5C11.7 7.6 12 7.9 12 8.5C12 7.9 12.3 7.6 12.9 7.5C12.3 7.4 12 7.1 12 6.5Z" fill="#d97757" />
          <path d="M8 10.5C8 11.1 7.7 11.4 7.1 11.5C7.7 11.6 8 11.9 8 12.5C8 11.9 8.3 11.6 8.9 11.5C8.3 11.4 8 11.1 8 10.5Z" fill="#0f6b5c" />
        </svg>
      );
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
