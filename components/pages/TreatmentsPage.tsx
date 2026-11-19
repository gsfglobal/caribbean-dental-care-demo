import { ArrowRight } from "lucide-react";
import { InnerHero } from "./Inner";
import { CategoryNav } from "./CategoryNav";
import { ContactButtons, TiltCard } from "@/components/ui/Bits";
import { TreatmentIcon } from "@/components/ui/Icons";
import { groups, treatments, type Treatment } from "@/lib/treatments";

export function TreatmentsPage() {
  const order = Object.keys(groups) as Treatment["group"][];
  return (
    <>
      <InnerHero
        kicker="Behandelingen"
        crumbs={[{ label: "Behandelingen" }]}
        title="Tandheelkundige zorg, helder uitgelegd."
        intro="Hieronder vindt u de behandelingen van Caribbean Dental Care. Welke behandeling bij u past, bespreekt de tandarts altijd persoonlijk met u."
      >
        <CategoryNav items={order.map((g) => ({ id: `groep-${g}`, label: groups[g] }))} />
      </InnerHero>

      <div className="py-16 md:py-24">
        {order.map((g) => {
          const list = treatments.filter((t) => t.group === g);
          return (
            <section key={g} id={`groep-${g}`} aria-labelledby={`h-${g}`} className="wrap scroll-mt-28 py-8">
              <h2 id={`h-${g}`} tabIndex={-1} className="h-md rv outline-none">
                {groups[g]}
              </h2>
              <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((t) => (
                  <li key={t.slug} className="rv">
                    <TiltCard href={`/behandelingen/${t.slug}/`} className="card flex h-full flex-col p-7">
                      <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-soft text-blue group-hover:text-green-ink">
                        <TreatmentIcon name={t.icon} className="h-7 w-7" />
                      </span>
                      <h3 className="relative mt-6 font-display text-[20px] font-bold text-navy">{t.title}</h3>
                      <p className="relative mt-3 flex-1 text-[15px] leading-relaxed text-ink/75">{t.short}</p>
                      <span className="relative mt-5 inline-flex items-center gap-2 text-[14px] font-semibold text-green-ink">
                        Meer informatie <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                      </span>
                    </TiltCard>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <section className="pb-20">
        <div className="wrap">
          <div className="rv card flex flex-col gap-6 bg-soft p-8 md:flex-row md:items-center md:justify-between md:p-12">
            <div>
              <h2 className="h-md">Twijfelt u welke behandeling u nodig heeft?</h2>
              <p className="body mt-2">Neem contact op. We denken graag met u mee.</p>
            </div>
            <ContactButtons />
          </div>
        </div>
      </section>
    </>
  );
}
