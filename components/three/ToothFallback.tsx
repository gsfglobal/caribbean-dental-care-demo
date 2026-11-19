/** Statische illustratie wanneer WebGL ontbreekt, bij laden of bij prefers-reduced-motion zonder 3D. */
export function ToothFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <svg viewBox="0 0 400 400" className="h-[78%] w-auto drop-shadow-[0_30px_40px_rgba(20,43,59,0.18)]" aria-hidden="true">
        <defs>
          <radialGradient id="enamel" cx="38%" cy="30%" r="75%">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.55" stopColor="#f3f0ea" />
            <stop offset="1" stopColor="#d9dfe0" />
          </radialGradient>
        </defs>
        <path d="M60 230c40 70 250 80 290-20" fill="none" stroke="#629963" strokeWidth="5" strokeLinecap="round" opacity=".85" />
        <path d="M40 200c60 110 290 100 320-40" fill="none" stroke="#425f78" strokeWidth="2.5" strokeLinecap="round" opacity=".6" />
        <path
          d="M200 92c-28-20-62-24-86-9-30 19-35 62-24 104 9 34 15 70 21 107 5 24 12 43 28 43 17 0 22-24 27-52 4-20 13-34 34-34s30 14 34 34c5 28 10 52 27 52 16 0 23-19 28-43 6-37 12-73 21-107 11-42 6-85-24-104-24-15-58-11-86 9Z"
          fill="url(#enamel)"
        />
        <path d="M150 112c18 10 34 12 50 4" fill="none" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" opacity=".9" />
      </svg>
    </div>
  );
}
