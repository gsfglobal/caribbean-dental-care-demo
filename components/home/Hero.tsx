"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { Phone, ShieldCheck, Users, HeartHandshake } from "lucide-react";
import { SceneShell, useIsMobile, useReducedMotion } from "@/components/three/SceneShell";
import { ToothFallback } from "@/components/three/ToothFallback";
import { clinic, tel } from "@/lib/site";
import type { Progress } from "@/components/three/HeroScene";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), { ssr: false });

export function Hero() {
  const reduced = useReducedMotion();
  const compact = useIsMobile();
  const progress: Progress = useRef(0);
  const section = useRef<HTMLElement>(null);

  useEffect(() => {
    const on = () => {
      const el = section.current;
      if (!el) return;
      const h = el.offsetHeight || 1;
      progress.current = Math.min(1, Math.max(0, window.scrollY / h));
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [progress]);

  return (
    <section ref={section} aria-labelledby="hero-title" className="brand-wash relative overflow-hidden pt-[96px] md:pt-[120px]">
      {/* Decoratieve boog, verwijzing naar de lijn in het logo */}
      <svg aria-hidden="true" viewBox="0 0 1440 300" className="draw rv pointer-events-none absolute -bottom-6 left-0 w-full text-green/40" fill="none">
        <path d="M-20 120C300 330 1100 340 1460 40" stroke="currentColor" strokeWidth="2" />
        <path d="M-20 170C380 360 1000 330 1460 110" stroke="#879fb4" strokeOpacity=".5" strokeWidth="1.2" />
      </svg>
      <div className="wrap relative grid items-center gap-6 pb-16 md:pb-24 lg:min-h-[calc(100svh-120px)] lg:grid-cols-12 lg:gap-10">
        <div className="relative z-10 lg:col-span-6">
          <p className="kicker rv">Tandartspraktijk in Kralendijk, Bonaire</p>
          <h1 id="hero-title" className="h-xl mt-5">
            <span className="line-mask rv"><span>Uw glimlach verdient</span></span>
            <span className="line-mask rv rv-d1"><span className="text-green-ink">persoonlijke aandacht.</span></span>
          </h1>
          <p className="lead rv rv-d2 mt-6 max-w-xl">
            Van periodieke controles tot uitgebreide tandheelkundige zorg. Bij Caribbean Dental Care in Kralendijk staan uw mondgezondheid, vertrouwen en persoonlijke aandacht centraal.
          </p>
          <div className="rv rv-d3 mt-8 flex flex-wrap gap-3">
            <Link href="/contact/" className="btn btn-primary !min-h-14 !px-7 !text-[16px]">
              Maak een afspraak
            </Link>
            <a href={tel} className="btn btn-ghost !min-h-14 !px-7 !text-[16px]">
              <Phone className="h-4 w-4" aria-hidden="true" /> Bel ons direct
            </a>
          </div>
          <p className="rv rv-d3 mt-4 text-[14px] text-muted">
            {clinic.address.street}, {clinic.address.city} · <a href={tel} className="font-semibold text-navy">{clinic.phone.display}</a>
          </p>
          <ul className="rv rv-d3 mt-10 grid max-w-xl grid-cols-3 gap-3 text-[13px] font-medium text-ink/75">
            {[
              { i: HeartHandshake, t: "Persoonlijke aandacht" },
              { i: ShieldCheck, t: "Preventie voorop" },
              { i: Users, t: "Voor het hele gezin" },
            ].map(({ i: I, t }) => (
              <li key={t} className="flex flex-col gap-2 rounded-2xl border border-white bg-white/60 p-3 backdrop-blur md:flex-row md:items-center">
                <I className="h-5 w-5 shrink-0 text-green-ink" aria-hidden="true" /> {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative h-[340px] sm:h-[420px] lg:col-span-6 lg:h-[640px]">
          <div aria-hidden="true" className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.95),rgba(255,255,255,0)_68%)]" />
          <SceneShell className="absolute inset-0 [mask-image:radial-gradient(closest-side,#000_72%,transparent)]" eager label="Driedimensionale illustratie van een kies, omringd door groene en blauwe lijnen" fallback={<ToothFallback />}>
            {(active) => <HeroScene progress={progress} active={active} reduced={reduced} compact={compact} />}
          </SceneShell>
          <p className="absolute bottom-2 right-2 rounded-full bg-white/70 px-3 py-1 text-[11px] text-muted backdrop-blur">3D-illustratie</p>
        </div>
      </div>
    </section>
  );
}
