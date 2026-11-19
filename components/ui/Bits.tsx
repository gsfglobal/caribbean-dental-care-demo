"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { ChevronDown, MapPin, Navigation, Phone } from "lucide-react";
import { WhatsAppIcon } from "./Brand";
import { clinic, directionsLink, fullAddress, mapsLink, tel, waLink } from "@/lib/site";

export function SectionHead({ kicker, title, intro, center, id }: { kicker?: string; title: React.ReactNode; intro?: React.ReactNode; center?: boolean; id?: string }) {
  return (
    <div className={`rv max-w-3xl ${center ? "mx-auto text-center" : ""}`}>
      {kicker && <p className="kicker">{kicker}</p>}
      <h2 id={id} className="h-lg mt-4">
        {title}
      </h2>
      {intro && <p className="lead mt-5">{intro}</p>}
    </div>
  );
}

/** Toegankelijke uitklaplijst (native <details>). */
export function FaqList({ items, name = "faq" }: { items: { q: string; a: string }[]; name?: string }) {
  return (
    <div className="divide-y divide-line overflow-hidden rounded-[24px] border border-line bg-white">
      {items.map((f, i) => (
        <details key={i} name={name} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-6 py-5 text-left font-display text-[17px] font-semibold text-navy transition hover:bg-soft md:px-8 md:text-[18px] [&::-webkit-details-marker]:hidden">
            {f.q}
            <ChevronDown className="h-5 w-5 shrink-0 text-green-ink transition-transform duration-300 group-open:rotate-180" aria-hidden="true" />
          </summary>
          <p className="body px-6 pb-6 md:px-8">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

/** Kaart pas laden na een klik (privacy: Google laadt niets zonder toestemming). */
export function MapBlock({ className = "" }: { className?: string }) {
  const [load, setLoad] = useState(false);
  const src = `https://www.google.com/maps?q=${encodeURIComponent(clinic.mapsQuery)}&output=embed`;
  return (
    <div className={`relative overflow-hidden rounded-[28px] border border-line bg-soft ${className}`}>
      {load ? (
        <iframe title={`Kaart: ${fullAddress}`} src={src} className="absolute inset-0 h-full w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      ) : (
        <div className="absolute inset-0">
          <MapIllustration />
          <div className="absolute inset-x-4 bottom-4 flex flex-col gap-3 rounded-[20px] border border-line bg-white/90 p-4 backdrop-blur md:inset-x-auto md:left-6 md:max-w-sm md:p-5">
            <p className="flex items-start gap-2 font-semibold text-navy">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-green-ink" aria-hidden="true" /> {fullAddress}
            </p>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => setLoad(true)} className="btn btn-primary !min-h-11 !px-4 !text-[14px]">
                Kaart laden
              </button>
              <a href={directionsLink} target="_blank" rel="noopener" className="btn btn-ghost !min-h-11 !px-4 !text-[14px]">
                <Navigation className="h-4 w-4" aria-hidden="true" /> Route plannen
              </a>
            </div>
            <p className="text-[12px] leading-snug text-muted">De kaart wordt geladen via Google Maps. Daarbij kunnen gegevens met Google worden gedeeld.</p>
          </div>
        </div>
      )}
      <a href={mapsLink} target="_blank" rel="noopener" className="sr-only">
        Open {fullAddress} in Google Maps
      </a>
    </div>
  );
}

/** Abstracte plattegrond (geen echte kaart): zee, kustlijn, markering. */
function MapIllustration() {
  return (
    <svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden="true">
      <rect width="600" height="400" fill="#e8f0f2" />
      <path d="M0 0h360c-20 60 10 110-10 170s20 120 0 230H0Z" fill="#f4f8f7" />
      <g stroke="#dfe8e4" strokeWidth="10" fill="none" strokeLinecap="round">
        <path d="M30 80h300M20 160h320M40 250h300M90 20v360M200 10v390M290 30v350" />
      </g>
      <g stroke="#ffffff" strokeWidth="5" fill="none" strokeLinecap="round">
        <path d="M30 80h300M20 160h320M40 250h300M90 20v360M200 10v390M290 30v350" />
      </g>
      <path d="M360 0c-20 60 10 110-10 170s20 120 0 230" fill="none" stroke="#c9dccf" strokeWidth="3" />
      <g transform="translate(200 160)">
        <circle r="34" fill="#629963" opacity=".18" />
        <circle r="18" fill="#629963" opacity=".28" />
        <path d="M0-30c-12 0-21 9-21 21 0 16 21 34 21 34s21-18 21-34c0-12-9-21-21-21Z" fill="#142b3b" />
        <circle cy="-9" r="7" fill="#99c79a" />
      </g>
      <text x="420" y="210" fill="#879fb4" fontFamily="Inter, sans-serif" fontSize="15" letterSpacing="4">ZEE</text>
    </svg>
  );
}

export function ContactButtons({ dark = false, size = "md" }: { dark?: boolean; size?: "md" | "lg" }) {
  const pad = size === "lg" ? "!min-h-14 !px-7 !text-[16px]" : "";
  return (
    <div className="flex flex-wrap gap-3">
      <a href={tel} className={`btn ${dark ? "btn-light" : "btn-primary"} ${pad}`}>
        <Phone className="h-4 w-4" aria-hidden="true" /> Bel onze praktijk
      </a>
      <a href={waLink()} target="_blank" rel="noopener" className={`btn ${dark ? "btn-outline-light" : "btn-green"} ${pad}`}>
        <WhatsAppIcon className="h-5 w-5" /> Neem contact op via WhatsApp
      </a>
    </div>
  );
}

/** Kaart met subtiel 3D-kanteleffect bij hover (uit bij reduced motion / touch). */
export function TiltCard({ href, className = "", children }: { href: string; className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const move = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg) translateY(-4px)`;
    el.style.setProperty("--mx", `${(x + 0.5) * 100}%`);
    el.style.setProperty("--my", `${(y + 0.5) * 100}%`);
  };
  const leave = () => {
    if (ref.current) ref.current.style.transform = "";
  };
  return (
    <Link ref={ref} href={href} onPointerMove={move} onPointerLeave={leave} className={`tilt group relative block overflow-hidden ${className}`}>
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: "radial-gradient(380px circle at var(--mx,50%) var(--my,50%), rgba(153,199,154,0.22), transparent 60%)" }} />
      {children}
    </Link>
  );
}
