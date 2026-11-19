import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { clinic, directionsLink, nav, tel, waLink } from "@/lib/site";
import { treatments } from "@/lib/treatments";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="dark-wash on-dark relative overflow-hidden text-white">
      <div className="wrap grid gap-12 pb-28 pt-20 md:grid-cols-12 md:pb-12">
        <div className="md:col-span-4">
          <Logo tone="white" />
          <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-white/70">
            Persoonlijke tandheelkundige zorg in Kralendijk, Bonaire. Voor controle, preventie en behandeling — voor het hele gezin.
          </p>
          <address className="mt-6 not-italic text-[15px] leading-relaxed text-white/85">
            {clinic.name}
            <br />
            {clinic.address.street}
            <br />
            {clinic.address.city}, {clinic.address.island}
            <br />
            {clinic.address.country}
          </address>
          <a href={directionsLink} target="_blank" rel="noopener" className="mt-3 inline-block text-[14px] font-semibold text-green-soft underline-offset-4 hover:underline">
            Routebeschrijving →
          </a>
        </div>
        <nav aria-label="Footer navigatie" className="md:col-span-2">
          <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-white/50">Praktijk</p>
          <ul className="mt-4 space-y-2.5 text-[15px]">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="text-white/85 hover:text-white">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Behandelingen" className="md:col-span-3">
          <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-white/50">Behandelingen</p>
          <ul className="mt-4 grid grid-cols-1 gap-2.5 text-[15px]">
            {treatments.slice(0, 8).map((t) => (
              <li key={t.slug}>
                <Link href={`/behandelingen/${t.slug}/`} className="text-white/85 hover:text-white">
                  {t.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="md:col-span-3">
          <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-white/50">Contact</p>
          <ul className="mt-4 space-y-3 text-[15px]">
            <li>
              <a href={tel} className="font-semibold text-white hover:text-green-soft">
                Telefoon {clinic.phone.display}
              </a>
            </li>
            <li>
              <a href={waLink()} target="_blank" rel="noopener" className="font-semibold text-white hover:text-green-soft">
                WhatsApp {clinic.whatsapp.display}
              </a>
            </li>
            <li className="text-white/60">Openingstijden: neem telefonisch contact op</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="wrap flex flex-col gap-3 py-6 text-[13px] text-white/55 md:flex-row md:items-center md:justify-between">
          <p>© {year} {clinic.name} · Kralendijk, Bonaire</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            <li>
              <Link href="/privacy/" className="hover:text-white">
                Privacyverklaring
              </Link>
            </li>
            <li>
              <Link href="/cookies/" className="hover:text-white">
                Cookies
              </Link>
            </li>
            <li>
              <Link href="/admin/" className="hover:text-white" rel="nofollow">
                Inloggen personeel
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
