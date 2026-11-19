import { Clock, MapPin, MessageCircle, Navigation, Phone } from "lucide-react";
import { InnerHero } from "./Inner";
import { ContactForm } from "@/components/ui/ContactForm";
import { MapBlock } from "@/components/ui/Bits";
import { WhatsAppIcon } from "@/components/ui/Brand";
import { clinic, directionsLink, tel, waLink } from "@/lib/site";

export function ContactPage() {
  return (
    <>
      <InnerHero
        kicker="Contact & afspraak"
        crumbs={[{ label: "Contact & afspraak" }]}
        title="Maak een afspraak."
        intro="Bel ons, stuur een WhatsApp-bericht of laat uw gegevens achter. De praktijk neemt zo snel mogelijk contact met u op."
      />

      <section className="py-14 md:py-20">
        <div className="wrap grid gap-5 md:grid-cols-3">
          <a href={tel} className="rv card group flex flex-col p-7 transition hover:border-navy">
            <Phone className="h-7 w-7 text-green-ink" aria-hidden="true" />
            <span className="mt-5 text-[13px] font-semibold uppercase tracking-[0.14em] text-muted">Bel onze praktijk</span>
            <span className="mt-1 font-display text-[24px] font-bold text-navy">{clinic.phone.display}</span>
            <span className="mt-3 text-[14px] text-ink/70">De snelste weg, ook bij pijn of spoed.</span>
          </a>
          <a href={waLink()} target="_blank" rel="noopener" className="rv rv-d1 card group flex flex-col p-7 transition hover:border-green">
            <WhatsAppIcon className="h-7 w-7 text-green-ink" />
            <span className="mt-5 text-[13px] font-semibold uppercase tracking-[0.14em] text-muted">WhatsApp</span>
            <span className="mt-1 font-display text-[24px] font-bold text-navy">{clinic.whatsapp.display}</span>
            <span className="mt-3 text-[14px] text-ink/70">Er staat al een bericht voor u klaar.</span>
          </a>
          <a href={directionsLink} target="_blank" rel="noopener" className="rv rv-d2 card group flex flex-col p-7 transition hover:border-blue">
            <MapPin className="h-7 w-7 text-green-ink" aria-hidden="true" />
            <span className="mt-5 text-[13px] font-semibold uppercase tracking-[0.14em] text-muted">Adres</span>
            <span className="mt-1 font-display text-[22px] font-bold text-navy">{clinic.address.street}</span>
            <span className="mt-3 inline-flex items-center gap-1.5 text-[14px] text-ink/70">
              {clinic.address.city}, {clinic.address.island} · <Navigation className="h-3.5 w-3.5" aria-hidden="true" /> route
            </span>
          </a>
        </div>
      </section>

      <section aria-labelledby="form-title" className="bg-soft py-16 md:py-24">
        <div className="wrap grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="kicker rv">Contactformulier</p>
            <h2 id="form-title" className="h-lg rv mt-4">
              Vraag een afspraak aan.
            </h2>
            <p className="body rv mt-5">Vul het formulier in. De praktijk belt of mailt u terug om samen een geschikt moment te kiezen.</p>
            <ul className="rv mt-8 space-y-4 text-[15px] text-ink/80">
              <li className="flex gap-3">
                <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-ink" aria-hidden="true" /> Een aanvraag is nog geen bevestigde afspraak.
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-green-ink" aria-hidden="true" /> Bij pijn of spoed: bel {clinic.phone.display}.
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-green-ink" aria-hidden="true" /> Voor openingstijden kunt u de praktijk bellen.
              </li>
            </ul>
          </div>
          <div className="rv lg:col-span-8">
            <ContactForm />
          </div>
        </div>
      </section>

      <section aria-labelledby="route" className="py-16 md:py-24">
        <div className="wrap grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="kicker rv">Route</p>
            <h2 id="route" className="h-lg rv mt-4">
              Zo vindt u ons.
            </h2>
            <p className="body rv mt-5">
              {clinic.name}
              <br />
              {clinic.address.street}, {clinic.address.city}
              <br />
              {clinic.address.island}, {clinic.address.country}
            </p>
            <p className="body rv mt-4">De praktijk ligt aan de Kaya Korona in Kralendijk. Gebruik de knop hieronder om uw route te plannen.</p>
            <a href={directionsLink} target="_blank" rel="noopener" className="btn btn-primary rv mt-6">
              <Navigation className="h-4 w-4" aria-hidden="true" /> Routebeschrijving in Google Maps
            </a>
          </div>
          <MapBlock className="rv h-[400px] lg:col-span-8 lg:h-[480px]" />
        </div>
      </section>
    </>
  );
}
