import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function InnerHero({ kicker, title, intro, crumbs, children }: { kicker: string; title: React.ReactNode; intro?: React.ReactNode; crumbs: { href?: string; label: string }[]; children?: React.ReactNode }) {
  return (
    <section className="brand-wash relative overflow-hidden pb-14 pt-[120px] md:pb-20 md:pt-[150px]">
      <svg aria-hidden="true" viewBox="0 0 1440 260" className="draw rv pointer-events-none absolute -bottom-10 left-0 w-full" fill="none">
        <path d="M-20 140C380 300 1060 290 1460 30" stroke="#629963" strokeOpacity=".35" strokeWidth="2" />
      </svg>
      <div className="wrap relative">
        <nav aria-label="Kruimelpad" className="rv">
          <ol className="flex flex-wrap items-center gap-1.5 text-[13px] text-muted">
            <li>
              <Link href="/" className="hover:text-navy">
                Home
              </Link>
            </li>
            {crumbs.map((c) => (
              <li key={c.label} className="flex items-center gap-1.5">
                <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                {c.href ? (
                  <Link href={c.href} className="hover:text-navy">
                    {c.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="font-medium text-navy">
                    {c.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <p className="kicker rv mt-8">{kicker}</p>
        <h1 className="h-xl rv rv-d1 mt-4 max-w-4xl !text-[38px] md:!text-[56px]">{title}</h1>
        {intro && <p className="lead rv rv-d2 mt-6 max-w-2xl">{intro}</p>}
        {children}
      </div>
    </section>
  );
}
