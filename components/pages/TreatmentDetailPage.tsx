import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { InnerHero } from "./Inner";
import { ContactButtons, FaqList, TiltCard } from "@/components/ui/Bits";
import { TreatmentIcon } from "@/components/ui/Icons";
import { getTreatment, groups, treatments } from "@/lib/treatments";

export function TreatmentDetailPage({ slug }: { slug: string }) {
  const t = getTreatment(slug)!;
  const related = treatments.filter((x) => x.slug !== t.slug && x.group === t.group).concat(treatments.filter((x) => x.group !== t.group && x.featured)).slice(0, 3);
  return (
    <>
      <InnerHero kicker={groups[t.group]} crumbs={[{ href: "/behandelingen/", label: "Behandelingen" }, { label: t.title }]} title={t.title} intro={t.short}>
        <div className="rv rv-d3 mt-8">
          <ContactButtons />
        </div>
      </InnerHero>

      <div className="wrap grid gap-12 py-16 md:py-24 lg:grid-cols-12">
        <article className="lg:col-span-7">
          <section aria-labelledby="need" className="rv">
            <h2 id="need" className="h-md">
              Wanneer is deze behandeling nodig?
            </h2>
            <p className="body mt-4">{t.need}</p>
          </section>
          <section aria-labelledby="how" className="rv mt-12">
            <h2 id="how" className="h-md">
              Hoe gaat het in grote lijnen?
            </h2>
            <ol className="mt-6 space-y-4">
              {t.how.map((s, i) => (
                <li key={i} className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy font-display text-[15px] font-bold text-white">{i + 1}</span>
                  <p className="body pt-1">{s}</p>
                </li>
              ))}
            </ol>
            <p className="mt-6 text-[14px] text-muted">Dit is algemene informatie. Het verloop kan per persoon verschillen; de tandarts bespreekt uw situatie altijd persoonlijk met u.</p>
          </section>
          {t.note && (
            <p role="note" className="rv mt-8 flex gap-3 rounded-2xl border border-[#b4432f]/25 bg-[#b4432f]/5 p-5 text-[15px] font-medium text-[#8e3424]">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" /> {t.note}
            </p>
          )}
          <section aria-labelledby="faq" className="rv mt-12">
            <h2 id="faq" className="h-md">
              Veelgestelde vragen
            </h2>
            <div className="mt-6">
              <FaqList items={t.faq} name={`faq-${t.slug}`} />
            </div>
          </section>
        </article>
        <aside className="lg:col-span-5">
          <div className="sticky top-28 space-y-5">
            <div className="rv card relative overflow-hidden bg-[linear-gradient(150deg,#f4f8f7,#ffffff)] p-8">
              <div aria-hidden="true" className="floaty mx-auto flex h-40 w-40 items-center justify-center rounded-full bg-white text-blue shadow-[0_30px_60px_-30px_rgba(20,43,59,0.35),inset_0_0_0_1px_var(--cdc-line)]">
                <TreatmentIcon name={t.icon} className="h-20 w-20" />
              </div>
              <h2 className="mt-8 font-display text-[20px] font-bold text-navy">Vragen over {t.title.toLowerCase()}?</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-ink/75">Neem contact op met de praktijk. Wij beantwoorden uw vragen en plannen samen met u een afspraak.</p>
              <Link href="/contact/" className="btn btn-primary mt-6 w-full">
                Maak een afspraak
              </Link>
            </div>
          </div>
        </aside>
      </div>

      <section aria-labelledby="related" className="bg-soft py-16 md:py-20">
        <div className="wrap">
          <h2 id="related" className="h-md rv">
            Andere behandelingen
          </h2>
          <ul className="mt-6 grid gap-5 md:grid-cols-3">
            {related.map((r) => (
              <li key={r.slug} className="rv">
                <TiltCard href={`/behandelingen/${r.slug}/`} className="card flex h-full items-center gap-4 p-6">
                  <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-soft text-blue">
                    <TreatmentIcon name={r.icon} className="h-7 w-7" />
                  </span>
                  <span className="relative font-display text-[17px] font-bold text-navy">{r.title}</span>
                  <ArrowRight className="relative ml-auto h-4 w-4 text-green-ink" aria-hidden="true" />
                </TiltCard>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
