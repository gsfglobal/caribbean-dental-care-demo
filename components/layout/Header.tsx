"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Phone, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { WhatsAppIcon } from "@/components/ui/Brand";
import { clinic, nav, tel, waLink } from "@/lib/site";

const norm = (p: string) => (p.endsWith("/") ? p : p + "/");

export function Header() {
  const pathname = norm(usePathname() || "/");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (open) closeRef.current?.focus();
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open]);

  const active = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500 ${
          scrolled ? "bg-white/85 shadow-[0_1px_0_var(--cdc-line)] backdrop-blur-xl" : "bg-transparent"
        }`}
      >
        <div className="wrap flex h-[72px] items-center justify-between gap-6 md:h-[84px]">
          <Link href="/" aria-label="Caribbean Dental Care — home" className="shrink-0">
            <Logo />
          </Link>
          <nav aria-label="Hoofdmenu" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {nav.slice(1).map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    aria-current={active(n.href) ? "page" : undefined}
                    className="relative rounded-full px-4 py-2.5 text-[15px] font-medium text-ink/80 transition hover:text-navy aria-[current=page]:text-navy after:absolute after:inset-x-4 after:bottom-1 after:h-[2px] after:origin-left after:scale-x-0 after:rounded-full after:bg-green after:transition-transform after:duration-300 hover:after:scale-x-100 aria-[current=page]:after:scale-x-100"
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-2">
            <a href={tel} className="btn btn-ghost hidden !min-h-11 !px-4 md:inline-flex" aria-label={`Bel ons: ${clinic.phone.display}`}>
              <Phone className="h-4 w-4" aria-hidden="true" /> <span className="hidden xl:inline">{clinic.phone.display}</span>
              <span className="xl:hidden">Bel ons</span>
            </a>
            <Link href="/contact/" className="btn btn-primary !min-h-11 !px-5 max-sm:!px-4 max-sm:!text-[14px]">
              <span className="sm:hidden">Afspraak</span>
              <span className="hidden sm:inline">Maak een afspraak</span>
            </Link>
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="site-menu"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-navy/15 bg-white/70 lg:hidden"
            >
              <span className="sr-only">Menu openen</span>
              <span aria-hidden="true" className="flex w-5 flex-col items-end gap-[5px]">
                <span className="h-[2px] w-5 rounded bg-navy" />
                <span className="h-[2px] w-3.5 rounded bg-navy" />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div
        id="site-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!open}
        inert={!open}
        className={`fixed inset-0 z-[60] overflow-y-auto bg-white transition-[clip-path] duration-700 ease-[var(--ease-soft)] lg:hidden ${
          open ? "[clip-path:circle(150%_at_100%_0%)]" : "pointer-events-none [clip-path:circle(0%_at_100%_0%)]"
        }`}
      >
        <div className="wrap flex h-[72px] items-center justify-between">
          <Logo />
          <button
            ref={closeRef}
            type="button"
            onClick={() => {
              setOpen(false);
              toggleRef.current?.focus();
            }}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-navy/15"
          >
            <X className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">Menu sluiten</span>
          </button>
        </div>
        <nav aria-label="Hoofdmenu mobiel" className="wrap pt-6">
          <ul>
            {nav.map((n, i) => (
              <li key={n.href} className="overflow-hidden border-b border-line">
                <Link
                  href={n.href}
                  aria-current={active(n.href) ? "page" : undefined}
                  className={`flex items-center justify-between py-4 font-display text-[30px] font-bold tracking-[-0.02em] text-navy transition-transform duration-500 aria-[current=page]:text-green-ink ${
                    open ? "translate-y-0" : "translate-y-full"
                  }`}
                  style={{ transitionDelay: open ? `${100 + i * 50}ms` : "0ms" }}
                >
                  {n.label}
                  <span className="text-[13px] font-semibold text-blue-soft">0{i + 1}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 grid gap-3 pb-10">
            <a href={tel} className="btn btn-primary">
              <Phone className="h-4 w-4" aria-hidden="true" /> Bel onze praktijk · {clinic.phone.display}
            </a>
            <a href={waLink()} target="_blank" rel="noopener" className="btn btn-green">
              <WhatsAppIcon className="h-5 w-5" /> Neem contact op via WhatsApp
            </a>
            <p className="mt-2 text-[14px] text-muted">
              {clinic.address.street}, {clinic.address.city}, {clinic.address.island}
            </p>
          </div>
        </nav>
      </div>
    </>
  );
}
