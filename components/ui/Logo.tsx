import { asset } from "@/lib/asset";

/**
 * Logo Caribbean Dental Care.
 * TIJDELIJK: zolang het originele logobestand niet is aangeleverd (LOGO_FILE_READY = false)
 * tonen we een typografische vervanging in de huisstijl. Zet het originele bestand in
 * public/media/logo.png (+ logo-white.png voor donkere achtergronden) en zet de vlag op true.
 */
export const LOGO_FILE_READY = false;

export function Logo({ tone = "color", className = "" }: { tone?: "color" | "white"; className?: string }) {
  if (LOGO_FILE_READY) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={asset(tone === "white" ? "/media/logo-white.png" : "/media/logo.png")} alt="Caribbean Dental Care" className={`h-11 w-auto ${className}`} />
    );
  }
  const blue = tone === "white" ? "#ffffff" : "var(--cdc-blue)";
  const green = tone === "white" ? "#99c79a" : "var(--cdc-green)";
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`} aria-label="Caribbean Dental Care" role="img">
      <svg viewBox="0 0 44 44" className="h-10 w-10 shrink-0" aria-hidden="true">
        {/* tand */}
        <path
          d="M22 9c-3-2.2-6.6-2.6-9.2-1-3.3 2-3.8 6.6-2.6 11.1 1 3.6 1.6 7.5 2.3 11.4.5 2.6 1.3 4.6 3 4.6 1.9 0 2.4-2.6 3-5.6.4-2.1 1.4-3.6 3.5-3.6s3.1 1.5 3.5 3.6c.6 3 1.1 5.6 3 5.6 1.7 0 2.5-2 3-4.6.7-3.9 1.3-7.8 2.3-11.4 1.2-4.5.7-9.1-2.6-11.1-2.6-1.6-6.2-1.2-9.2 1Z"
          fill={green}
        />
        {/* boog */}
        <path d="M4 30c8 6 26 7 36-3" fill="none" stroke={blue} strokeWidth="2.4" strokeLinecap="round" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="font-[Georgia,serif] text-[22px] italic tracking-[-0.01em]" style={{ color: blue }}>
          Caribbean
        </span>
        <span className="mt-1 text-[9.5px] font-bold tracking-[0.32em]" style={{ color: green }}>
          DENTAL CARE
        </span>
      </span>
    </span>
  );
}
