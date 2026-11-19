import { InnerHero } from "./Inner";
import { clinic } from "@/lib/site";

/**
 * CONCEPT — juridisch te laten controleren vóór publicatie.
 * Op Bonaire geldt de Wet bescherming persoonsgegevens BES (niet de AVG).
 */
export function LegalPage({ kind }: { kind: "privacy" | "cookies" }) {
  const privacy = kind === "privacy";
  return (
    <>
      <InnerHero kicker="Juridisch" crumbs={[{ label: privacy ? "Privacyverklaring" : "Cookies" }]} title={privacy ? "Privacyverklaring" : "Cookies"} />
      <section className="py-14 md:py-20">
        <div className="wrap max-w-3xl space-y-6 text-[16px] leading-relaxed text-ink/85">
          <p className="tbc">Concept — wordt vóór publicatie door de praktijk gecontroleerd en aangevuld</p>
          {privacy ? (
            <>
              <h2 className="h-md">Wie zijn wij?</h2>
              <p>
                {clinic.name}, {clinic.address.street}, {clinic.address.city}, {clinic.address.island}. Telefoon {clinic.phone.display}.
              </p>
              <h2 className="h-md">Welke gegevens verzamelen wij via deze website?</h2>
              <p>
                Via het contactformulier vragen wij uw naam, telefoonnummer, en optioneel uw e-mailadres, uw voorkeur voor een contactmoment en het onderwerp van uw vraag. Wij vragen via de website bewust géén medische gegevens, geboortedatum of identiteitsgegevens.
              </p>
              <h2 className="h-md">Waarvoor gebruiken wij uw gegevens?</h2>
              <p>Uitsluitend om contact met u op te nemen over uw aanvraag en om een afspraak in te plannen.</p>
              <h2 className="h-md">Hoe lang bewaren wij uw gegevens?</h2>
              <p>Niet langer dan nodig voor de afhandeling van uw aanvraag. De precieze bewaartermijn wordt door de praktijk vastgesteld.</p>
              <h2 className="h-md">Websitestatistieken</h2>
              <p>Wij tellen anoniem hoe vaak pagina&apos;s worden bekeken en hoe vaak op de knoppen voor bellen en WhatsApp wordt geklikt. Daarbij gebruiken wij geen cookies en verzamelen wij geen persoonsgegevens.</p>
              <h2 className="h-md">Uw rechten</h2>
              <p>U kunt de praktijk vragen om inzage, correctie of verwijdering van uw gegevens. Neem hiervoor telefonisch contact op.</p>
            </>
          ) : (
            <>
              <p>Deze website plaatst geen tracking- of advertentiecookies. Voor het onthouden van technische voorkeuren kan lokale opslag in uw browser worden gebruikt.</p>
              <p>De kaart van Google Maps wordt pas geladen nadat u daarvoor kiest. Google kan daarbij eigen cookies plaatsen; zie het privacybeleid van Google.</p>
              <p>WhatsApp-links openen de app of website van WhatsApp. Daarop is het privacybeleid van WhatsApp van toepassing.</p>
            </>
          )}
        </div>
      </section>
    </>
  );
}
