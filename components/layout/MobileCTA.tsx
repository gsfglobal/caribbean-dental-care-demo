"use client";
import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/Brand";
import { tel, waLink } from "@/lib/site";

/** Discrete balk onderaan op mobiel: bellen en WhatsApp, verschijnt na het eerste scherm. */
export function MobileCTA() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > window.innerHeight * 0.6);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <div
      className={`fixed inset-x-3 bottom-3 z-40 transition-[transform,opacity] duration-500 ease-[var(--ease-soft)] md:hidden ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-24 opacity-0"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="grid grid-cols-2 gap-2 rounded-full border border-line bg-white/90 p-1.5 shadow-[0_18px_40px_-18px_rgba(20,43,59,0.45)] backdrop-blur-xl">
        <a href={tel} className="btn btn-primary !min-h-12 !px-3 !text-[14px]" tabIndex={show ? 0 : -1}>
          <Phone className="h-4 w-4" aria-hidden="true" /> Bel ons
        </a>
        <a href={waLink()} target="_blank" rel="noopener" className="btn btn-green !min-h-12 !px-3 !text-[14px]" tabIndex={show ? 0 : -1}>
          <WhatsAppIcon className="h-4 w-4" /> WhatsApp
        </a>
      </div>
    </div>
  );
}
