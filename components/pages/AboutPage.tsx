import Link from "next/link";
import { Globe2, HeartHandshake, Repeat, ShieldCheck, Smile, UserRound } from "lucide-react";
import { InnerHero } from "./Inner";
import { ContactButtons, SectionHead } from "@/components/ui/Bits";
import { clinic } from "@/lib/site";

const values = [
  { i: ShieldCheck, t: "Toegankelijke zorg", d: "Goede mondzorg hoort bereikbaar te zijn. We denken mee en leggen uit wat er nodig is en waarom." },
  { i: Smile, t: "Preventie eerst", d: "Problemen voorkomen is beter dan genezen. Daarom besteden we veel aandacht aan controle en mondhygiëne." },
  { i: Repeat, t: "Continuïteit", d: "Wij bieden zorg op lange termijn, zodat u weet waar u terechtkunt — nu en in de toekomst." },
  { i: HeartHandshake, t: "Heldere communicatie", d: "Geen vaktaal, maar duidelijke uitleg. U beslist samen met de tandarts." },
  { i: UserRound, t: "Aandacht voor kinderen", d: "Een rustige, vriendelijke aanpak zodat kinderen zonder spanning naar de tandarts gaan." },
  { i: Globe2, t: "Iedereen welkom", d: "Wij ontvangen patiënten van alle leeftijden, culturen en talen." },
];

export function AboutPage() {
  const teamReady = clinic.team.status === "confermato" && (clinic.team.value?.length ?? 0) > 0;
  return (
    <>
      <InnerHero
        kicker="Over ons"
        crumbs={[{ label: "Over ons" }]}
        title="Een vertrouwde plek voor uw mondgezondheid."
        intro="Caribbean Dental Care is een tandartspraktijk aan de Kaya Korona in Kralendijk. Wij staan voor persoonlijke, toegankelijke zorg voor iedereen op Bonaire."
      />

      <section aria-labelledby="story" className="py-16 md:py-24">
        <div className="wrap grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHead id="story" kicker="Ons verhaal" title="Zorg die verder gaat op een bekende plek." />
          </div>
          <div className="rv space-y-5 lg:col-span-7">
            <p className="lead">
              De praktijk aan de Kaya Korona is al vele jaren een begrip op Bonaire. Onder de naam Caribbean Dental Care wordt de tandheelkundige zorg op deze locatie voortgezet door nieuwe eigenaren, met een modern ingerichte praktijk en een internationaal team.
            </p>
            <p className="body">
              Onze focus ligt op algemene tandheelkunde: controle en preventie, diagnostiek, het herstellen van tanden en kiezen, zorg voor kinderen, de behandeling van pijnklachten en het onderhouden van een gezonde mond. Daarnaast kunt u bij ons terecht voor onder meer kronen, wortelkanaalbehandelingen, beugels, aligners en tandenbleken.
            </p>
            <p className="body">
              Wij vinden het belangrijk dat iedereen zich welkom voelt, ongeacht leeftijd, taal of achtergrond. Daarom nemen we de tijd voor uitleg en voor uw vragen.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="values" className="bg-soft py-16 md:py-24">
        <div className="wrap">
          <SectionHead id="values" kicker="Waar wij voor staan" title="Onze uitgangspunten." />
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {values.map(({ i: I, t, d }, k) => (
              <li key={t} className={`rv rv-d${(k % 3) + 1} card p-7`}>
                <I className="h-7 w-7 text-green-ink" aria-hidden="true" />
                <h3 className="mt-5 font-display text-[19px] font-bold text-navy">{t}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink/75">{d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="team" className="py-16 md:py-24">
        <div className="wrap">
          <SectionHead id="team" kicker="Ons team" title="De mensen achter de praktijk." intro="Ons team bestaat uit tandartsen, assistenten en een mondhygiënist, die samen zorgen voor uw mondgezondheid." />
          {teamReady ? (
            <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {clinic.team.value!.map((m) => (
                <li key={m.name} className="card p-6">
                  <p className="font-display text-[18px] font-bold text-navy">{m.name}</p>
                  <p className="text-[14px] text-muted">{m.role}</p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rv mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" aria-label="Teampresentatie volgt">
              {["Tandarts", "Tandarts", "Mondhygiënist", "Assistentie"].map((r, i) => (
                <div key={i} className="card overflow-hidden">
                  <div className="flex aspect-[4/5] items-center justify-center bg-[linear-gradient(160deg,#eef4f2,#e4ebf1)]">
                    <UserRound className="h-16 w-16 text-blue-soft" aria-hidden="true" />
                  </div>
                  <div className="p-5">
                    <p className="font-display text-[17px] font-bold text-navy">{r}</p>
                    <p className="mt-1 text-[13px] text-muted">Voorstelling volgt binnenkort</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="pb-20">
        <div className="wrap">
          <div className="rv card flex flex-col gap-6 bg-soft p-8 md:flex-row md:items-center md:justify-between md:p-12">
            <div>
              <h2 className="h-md">Kennismaken met onze praktijk?</h2>
              <p className="body mt-2">
                Bel ons of stuur een bericht. Of bekijk eerst onze <Link href="/behandelingen/" className="font-semibold text-navy underline underline-offset-4">behandelingen</Link>.
              </p>
            </div>
            <ContactButtons />
          </div>
        </div>
      </section>
    </>
  );
}
