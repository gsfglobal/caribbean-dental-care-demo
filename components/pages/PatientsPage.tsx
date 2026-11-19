import Link from "next/link";
import { AlertTriangle, CalendarCheck, ClipboardList, Download, MessageCircle, Phone } from "lucide-react";
import { InnerHero } from "./Inner";
import { ContactButtons, FaqList, SectionHead } from "@/components/ui/Bits";
import { generalFaq } from "@/lib/content";
import { clinic, tel, waLink } from "@/lib/site";
import { asset } from "@/lib/asset";

export function PatientsPage() {
  return (
    <>
      <InnerHero
        kicker="Voor patiënten"
        crumbs={[{ label: "Voor patiënten" }]}
        title="Alles wat u moet weten voor uw bezoek."
        intro="Praktische informatie over contact opnemen, een afspraak aanvragen, uw eerste bezoek en wat u kunt doen bij kiespijn."
      />

      <section aria-labelledby="contact-ways" className="py-16 md:py-24">
        <div className="wrap">
          <SectionHead id="contact-ways" kicker="Contact" title="Zo neemt u contact met ons op." />
          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            <li className="rv card p-7">
              <Phone className="h-7 w-7 text-green-ink" aria-hidden="true" />
              <h3 className="mt-5 font-display text-[19px] font-bold text-navy">Bellen</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink/75">De snelste manier, zeker bij pijn of spoed.</p>
              <a href={tel} className="mt-4 inline-block font-semibold text-navy underline underline-offset-4">
                {clinic.phone.display}
              </a>
            </li>
            <li className="rv rv-d1 card p-7">
              <MessageCircle className="h-7 w-7 text-green-ink" aria-hidden="true" />
              <h3 className="mt-5 font-display text-[19px] font-bold text-navy">WhatsApp</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink/75">Stuur een bericht; de praktijk reageert zo snel mogelijk.</p>
              <a href={waLink()} target="_blank" rel="noopener" className="mt-4 inline-block font-semibold text-navy underline underline-offset-4">
                WhatsApp {clinic.whatsapp.display}
              </a>
            </li>
            <li className="rv rv-d2 card p-7">
              <ClipboardList className="h-7 w-7 text-green-ink" aria-hidden="true" />
              <h3 className="mt-5 font-display text-[19px] font-bold text-navy">Contactformulier</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink/75">Laat uw gegevens achter; wij bellen u terug.</p>
              <Link href="/contact/" className="mt-4 inline-block font-semibold text-navy underline underline-offset-4">
                Naar het formulier
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <section aria-labelledby="request" className="bg-soft py-16 md:py-24">
        <div className="wrap grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHead id="request" kicker="Afspraak" title="Een bezoek aanvragen." />
            <ol className="rv mt-8 space-y-5">
              {[
                "Neem contact op via telefoon, WhatsApp of het formulier en vertel kort waarvoor u komt.",
                "De praktijk neemt contact met u op en bespreekt de mogelijkheden.",
                "Samen kiest u een datum en tijd. Pas dan is uw afspraak bevestigd.",
              ].map((s, i) => (
                <li key={i} className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy font-display font-bold text-white">{i + 1}</span>
                  <p className="body pt-1">{s}</p>
                </li>
              ))}
            </ol>
            <p className="rv mt-6 flex items-start gap-2 text-[14px] text-muted">
              <CalendarCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> Online direct een tijd kiezen is (nog) niet mogelijk. Zo kan de praktijk elke aanvraag persoonlijk beoordelen.
            </p>
          </div>
          <div>
            <SectionHead kicker="Eerste bezoek" title="Wat kunt u verwachten?" />
            <ul className="rv mt-8 space-y-4">
              {[
                "Kennismaking en een gesprek over uw wensen en eventuele klachten.",
                "Een onderzoek van uw tanden, kiezen, tandvlees en mond.",
                "Uitleg over wat de tandarts heeft gezien en, indien nodig, een voorstel voor behandeling.",
                "Ruimte voor al uw vragen — u beslist zelf over vervolgstappen.",
              ].map((s) => (
                <li key={s} className="flex gap-3">
                  <span aria-hidden="true" className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-green" />
                  <p className="body">{s}</p>
                </li>
              ))}
            </ul>
            <p className="rv mt-6 text-[14px] text-muted">Bij het inplannen laat de praktijk u weten of u iets moet meenemen.</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="pain" className="py-16 md:py-24">
        <div className="wrap">
          <div className="rv overflow-hidden rounded-[32px] border-2 border-green/50 bg-[linear-gradient(120deg,#f1f8f2,#ffffff_60%)] p-8 md:p-12">
            <p className="kicker">Kiespijn</p>
            <h2 id="pain" className="h-lg mt-3">
              Wat te doen bij kiespijn?
            </h2>
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <ol className="space-y-4">
                {[
                  "Bel de praktijk rechtstreeks en beschrijf uw klachten.",
                  "Volg het advies van de praktijk over hoe snel u moet komen.",
                  "Gebruik pijnstillers alleen volgens de bijsluiter.",
                ].map((s, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-ink font-display font-bold text-white">{i + 1}</span>
                    <p className="body pt-1">{s}</p>
                  </li>
                ))}
              </ol>
              <div className="space-y-5">
                <p role="note" className="flex gap-3 rounded-2xl border border-[#b4432f]/25 bg-white p-5 text-[15px] font-medium text-[#8e3424]">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" /> Bij ernstige zwelling, koorts of moeite met slikken of ademhalen: zoek direct medische hulp of bel 911.
                </p>
                <a href={tel} className="btn btn-primary !min-h-14 !text-[17px]">
                  <Phone className="h-5 w-5" aria-hidden="true" /> Bel {clinic.phone.display}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="faq" className="bg-soft py-16 md:py-24">
        <div className="wrap grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHead id="faq" kicker="Veelgestelde vragen" title="Uw vragen beantwoord." />
            <a href={asset("/downloads/patientinformatie-caribbean-dental-care.pdf")} className="btn btn-ghost rv mt-8" download>
              <Download className="h-4 w-4" aria-hidden="true" /> Patiëntinformatie (PDF)
            </a>
          </div>
          <div className="rv lg:col-span-8">
            <FaqList items={generalFaq} name="patient-faq" />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="wrap flex flex-col items-center text-center">
          <h2 className="h-md rv">Heeft u nog een vraag?</h2>
          <div className="rv mt-6">
            <ContactButtons />
          </div>
        </div>
      </section>
    </>
  );
}
