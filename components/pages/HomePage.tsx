import Link from "next/link";
import { ArrowRight, HeartHandshake, MapPin, Phone, ShieldCheck, Users } from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { ContactButtons, FaqList, MapBlock, SectionHead, TiltCard } from "@/components/ui/Bits";
import { TreatmentIcon } from "@/components/ui/Icons";
import { featuredTreatments, getTreatment } from "@/lib/treatments";
import { generalFaq, journey, pillars } from "@/lib/content";
import { clinic, directionsLink, tel } from "@/lib/site";

const pillarIcons = [HeartHandshake, ShieldCheck, Users];

export function HomePage() {
  const whitening = getTreatment("tandenbleken")!;
  const aligners = getTreatment("aligners")!;
  return (
    <>
      <Hero />

      {/* 2 — Vertrouwen */}
      <section aria-labelledby="trust-title" className="py-20 md:py-28">
        <div className="wrap grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHead id="trust-title" kicker="Onze praktijk" title="Persoonlijke tandheelkundige zorg op Bonaire." />
            <p className="body rv mt-5 max-w-md">
              Wij geloven in toegankelijke zorg, duidelijke uitleg en continuïteit. Patiënten van alle leeftijden, achtergronden en talen zijn welkom aan de Kaya Korona.
            </p>
          </div>
          <ul className="grid gap-4 sm:grid-cols-3 lg:col-span-7">
            {pillars.map((p, i) => {
              const I = pillarIcons[i];
              return (
                <li key={p.title} className={`rv rv-d${i + 1} card flex flex-col p-6 md:p-7`}>
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-soft text-green-ink">
                    <I className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-6 font-display text-[19px] font-bold text-navy">{p.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink/75">{p.text}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* 3 — Behandelingen */}
      <section aria-labelledby="treat-title" className="bg-soft py-20 md:py-28">
        <div className="wrap">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHead id="treat-title" kicker="Behandelingen" title="Zorg voor elke fase van uw mondgezondheid." intro="Van preventie tot herstel. Kies een behandeling voor meer uitleg." />
            <Link href="/behandelingen/" className="btn btn-ghost rv shrink-0">
              Alle behandelingen <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredTreatments.map((t, i) => (
              <li key={t.slug} className={`rv rv-d${(i % 3) + 1}`}>
                <TiltCard href={`/behandelingen/${t.slug}/`} className="card h-full p-7 md:p-8">
                  <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--cdc-soft),#fff)] text-blue shadow-[inset_0_0_0_1px_var(--cdc-line)] transition-colors duration-500 group-hover:text-green-ink">
                    <TreatmentIcon name={t.icon} className="h-8 w-8" />
                  </span>
                  <h3 className="relative mt-7 font-display text-[21px] font-bold text-navy">{t.title}</h3>
                  <p className="relative mt-3 text-[15px] leading-relaxed text-ink/75">{t.short}</p>
                  <span className="relative mt-6 inline-flex items-center gap-2 text-[14px] font-semibold text-green-ink">
                    Meer informatie <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </TiltCard>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4 — Esthetiek */}
      <section aria-labelledby="aesth-title" className="py-20 md:py-28">
        <div className="wrap grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHead id="aesth-title" kicker="Esthetische tandheelkunde" title="Een glimlach waar u zich prettig bij voelt." />
            <p className="body rv mt-5">
              Wilt u lichtere tanden of een rechtere glimlach? Of tandenbleken of aligners geschikt zijn, hangt af van uw persoonlijke situatie. Daarom begint het altijd met een individuele beoordeling en eerlijk advies.
            </p>
            <Link href="/contact/" className="btn btn-primary rv mt-8">
              Vraag een individuele beoordeling aan
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:col-span-7">
            {[whitening, aligners].map((t, i) => (
              <TiltCard key={t.slug} href={`/behandelingen/${t.slug}/`} className={`rv rv-d${i + 1} card overflow-hidden`}>
                <div className="relative h-44 overflow-hidden bg-[linear-gradient(140deg,#eef5f1,#e6edf3)]">
                  {i === 0 ? <ShadeIllustration /> : <AlignerIllustration />}
                  <span className="absolute left-4 top-4 rounded-full bg-white/80 px-3 py-1 text-[11px] text-muted backdrop-blur">Illustratie</span>
                </div>
                <div className="p-7">
                  <h3 className="font-display text-[21px] font-bold text-navy">{t.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink/75">{t.short}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-[14px] font-semibold text-green-ink">
                    Lees meer <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* 5 — De praktijk */}
      <section aria-labelledby="studio-title" className="pb-20 md:pb-28">
        <div className="wrap">
          <div className="dark-wash on-dark relative grid overflow-hidden rounded-[36px] text-white lg:grid-cols-2">
            <div className="relative z-10 p-8 md:p-14">
              <p className="kicker !text-green-soft before:!bg-green-soft">De praktijk</p>
              <h2 id="studio-title" className="h-lg mt-4 !text-white">
                Vertrouwde zorg aan de Kaya Korona.
              </h2>
              <p className="mt-5 text-[17px] leading-relaxed text-white/80">
                Caribbean Dental Care zet de tandheelkundige zorg voort op een plek die veel inwoners van Bonaire al kennen: de praktijk aan de Kaya Korona in Kralendijk. Met een team dat aandacht heeft voor preventie, heldere communicatie en zorg voor het hele gezin.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/over-ons/" className="btn btn-light">
                  Over ons
                </Link>
                <a href={directionsLink} target="_blank" rel="noopener" className="btn btn-outline-light">
                  <MapPin className="h-4 w-4" aria-hidden="true" /> Route plannen
                </a>
              </div>
            </div>
            <div className="relative min-h-[280px] lg:min-h-full">
              <PracticeIllustration />
              <span className="absolute bottom-5 right-5 rounded-full bg-white/15 px-3 py-1 text-[11px] text-white/80 backdrop-blur">Illustratie · foto&apos;s van de praktijk volgen</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6 — Patiëntreis */}
      <section aria-labelledby="journey-title" className="bg-soft py-20 md:py-28">
        <div className="wrap">
          <SectionHead id="journey-title" kicker="Zo werkt het" title="In drie stappen naar uw afspraak." center />
          <ol className="relative mt-14 grid gap-5 md:grid-cols-3">
            <svg aria-hidden="true" className="draw rv pointer-events-none absolute left-[16%] right-[16%] top-10 hidden h-8 w-[68%] md:block" viewBox="0 0 600 30" preserveAspectRatio="none" fill="none">
              <path d="M0 15C150 -5 450 35 600 15" stroke="#99c79a" strokeWidth="2" strokeDasharray="6 8" />
            </svg>
            {journey.map((s, i) => (
              <li key={s.title} className={`rv rv-d${i + 1} card relative p-8 text-center`}>
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-navy font-display text-[20px] font-extrabold text-white shadow-[0_0_0_8px_var(--cdc-soft)]">{i + 1}</span>
                <h3 className="mt-6 font-display text-[20px] font-bold text-navy">{s.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink/75">{s.text}</p>
              </li>
            ))}
          </ol>
          <div className="rv mt-10 flex justify-center">
            <ContactButtons />
          </div>
        </div>
      </section>

      {/* 7 — Spoed */}
      <section aria-labelledby="urgent-title" className="py-20 md:py-24">
        <div className="wrap">
          <div className="rv relative overflow-hidden rounded-[32px] border-2 border-green/50 bg-[linear-gradient(120deg,#f1f8f2,#ffffff_60%)] p-8 md:flex md:items-center md:justify-between md:gap-10 md:p-12">
            <div className="max-w-2xl">
              <p className="kicker">Spoed</p>
              <h2 id="urgent-title" className="h-lg mt-3">
                Last van kiespijn?
              </h2>
              <p className="lead mt-4">Heeft u kiespijn of dringend tandheelkundige hulp nodig? Bel onze praktijk rechtstreeks.</p>
              <p className="mt-3 text-[14px] text-muted">Bij ernstige zwelling, koorts of moeite met slikken of ademhalen: zoek direct medische hulp of bel 911.</p>
            </div>
            <a href={tel} className="btn btn-primary mt-8 !min-h-16 !px-8 !text-[18px] md:mt-0">
              <Phone className="h-5 w-5" aria-hidden="true" /> {clinic.phone.display}
            </a>
          </div>
        </div>
      </section>

      {/* 8 — Locatie */}
      <section aria-labelledby="loc-title" className="pb-20 md:pb-28">
        <div className="wrap grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHead id="loc-title" kicker="Locatie" title="Midden in Kralendijk." />
            <address className="rv mt-6 not-italic">
              <p className="font-display text-[19px] font-bold text-navy">{clinic.name}</p>
              <p className="body mt-1">
                {clinic.address.street}
                <br />
                {clinic.address.city}, {clinic.address.island}
              </p>
            </address>
            <p className="body rv mt-4">De praktijk ligt aan de Kaya Korona in Kralendijk. Plan uw route via Google Maps of bel ons als u de weg wilt weten.</p>
            <div className="rv mt-6 flex flex-wrap gap-3">
              <a href={directionsLink} target="_blank" rel="noopener" className="btn btn-primary">
                Routebeschrijving
              </a>
              <a href={tel} className="btn btn-ghost">
                Bel ons
              </a>
            </div>
          </div>
          <MapBlock className="rv h-[380px] lg:col-span-8 lg:h-[460px]" />
        </div>
      </section>

      {/* 9 — FAQ */}
      <section aria-labelledby="faq-title" className="bg-soft py-20 md:py-28">
        <div className="wrap grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHead id="faq-title" kicker="Veelgestelde vragen" title="Goed om te weten." />
            <p className="body rv mt-5">Staat uw vraag er niet bij? Neem gerust contact op.</p>
            <Link href="/voor-patienten/" className="btn btn-ghost rv mt-6">
              Informatie voor patiënten
            </Link>
          </div>
          <div className="rv lg:col-span-8">
            <FaqList items={generalFaq.slice(0, 6)} name="home-faq" />
          </div>
        </div>
      </section>

      {/* 10 — Slot-CTA */}
      <section aria-labelledby="final-title" className="py-20 md:py-28">
        <div className="wrap">
          <div className="rv relative overflow-hidden rounded-[40px] dark-wash on-dark px-8 py-16 text-center text-white md:px-16 md:py-24">
            <svg aria-hidden="true" viewBox="0 0 800 200" className="pointer-events-none absolute inset-x-0 bottom-0 w-full opacity-40" fill="none">
              <path d="M0 150C200 230 600 230 800 60" stroke="#99c79a" strokeWidth="2" />
            </svg>
            <h2 id="final-title" className="h-lg relative mx-auto max-w-3xl !text-white">
              Zet vandaag de eerste stap naar een gezonde glimlach.
            </h2>
            <p className="relative mx-auto mt-5 max-w-xl text-[17px] text-white/75">Bel de praktijk of stuur ons een bericht via WhatsApp. Wij helpen u graag verder.</p>
            <div className="relative mt-9 flex justify-center">
              <ContactButtons dark size="lg" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ShadeIllustration() {
  const shades = ["#e9dcc4", "#efe5d2", "#f3ecdf", "#f7f3ea", "#fbf9f4", "#ffffff"];
  return (
    <svg viewBox="0 0 320 176" className="h-full w-full" aria-hidden="true">
      {shades.map((c, i) => (
        <g key={c} transform={`translate(${34 + i * 44} ${58 + Math.sin(i / 1.6) * 8})`}>
          <rect width="34" height="70" rx="17" fill={c} stroke="#dfe6e3" />
        </g>
      ))}
      <path d="M30 150C120 175 220 175 300 140" stroke="#629963" strokeWidth="2" fill="none" />
    </svg>
  );
}

function AlignerIllustration() {
  return (
    <svg viewBox="0 0 320 176" className="h-full w-full" aria-hidden="true">
      <path d="M50 70c40 70 180 70 220 0" stroke="#425f78" strokeOpacity=".55" strokeWidth="26" strokeLinecap="round" fill="none" />
      <path d="M50 70c40 70 180 70 220 0" stroke="#ffffff" strokeOpacity=".9" strokeWidth="18" strokeLinecap="round" fill="none" strokeDasharray="20 6" />
      <path d="M40 66c44 82 196 82 240 0" stroke="#99c79a" strokeWidth="2" fill="none" />
    </svg>
  );
}

function PracticeIllustration() {
  return (
    <svg viewBox="0 0 600 460" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <defs>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#99c79a" stopOpacity=".55" />
          <stop offset="1" stopColor="#99c79a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g stroke="#ffffff" strokeOpacity=".08" strokeWidth="1">
        {Array.from({ length: 16 }, (_, i) => (
          <path key={`v${i}`} d={`M${i * 40} 0V460`} />
        ))}
        {Array.from({ length: 12 }, (_, i) => (
          <path key={`h${i}`} d={`M0 ${i * 40}H600`} />
        ))}
      </g>
      <g fill="none" stroke="#ffffff" strokeOpacity=".22" strokeWidth="6" strokeLinecap="round">
        <path d="M40 300C180 260 260 330 420 250S560 200 640 160" />
        <path d="M120 -20C150 120 210 200 300 230S420 360 430 480" />
      </g>
      <path d="M470 -10c-30 120 40 220 0 330s30 120 10 160" fill="none" stroke="#99c79a" strokeOpacity=".5" strokeWidth="2" />
      <circle cx="300" cy="230" r="150" fill="url(#glow)" />
      {[110, 76, 46].map((r, i) => (
        <circle key={r} cx="300" cy="230" r={r} fill="none" stroke="#99c79a" strokeOpacity={0.18 + i * 0.12} />
      ))}
      <g transform="translate(300 230)">
        <path d="M0-44c-17 0-30 13-30 30 0 23 30 48 30 48s30-25 30-48c0-17-13-30-30-30Z" fill="#ffffff" />
        <path d="M0-30c-2.5-1.8-5.5-2.1-7.6-.8-2.7 1.7-3.1 5.4-2.1 9.1.8 3 1.3 6.2 1.9 9.4.4 2.1 1.1 3.8 2.5 3.8 1.6 0 2-2.1 2.5-4.6.3-1.7 1.1-3 2.8-3s2.6 1.3 2.8 3c.5 2.5.9 4.6 2.5 4.6 1.4 0 2.1-1.7 2.5-3.8.6-3.2 1.1-6.4 1.9-9.4 1-3.7.6-7.4-2.1-9.1-2.1-1.3-5.1-1-7.6.8Z" fill="#629963" />
      </g>
      <text x="300" y="330" textAnchor="middle" fill="#ffffff" fillOpacity=".85" fontFamily="Manrope, sans-serif" fontSize="18" fontWeight="700" letterSpacing="1">Kaya Korona 18</text>
      <text x="300" y="356" textAnchor="middle" fill="#99c79a" fontFamily="Inter, sans-serif" fontSize="12" letterSpacing="4">KRALENDIJK · BONAIRE</text>
    </svg>
  );
}
