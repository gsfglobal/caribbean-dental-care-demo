"use client";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { IS_DEMO } from "@/lib/site";

/** Duidelijke markering dat dit een presentatieversie is (alleen in demomodus). */
export function DemoBanner() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    try {
      setOpen(IS_DEMO && sessionStorage.getItem("cdc-demo-banner") !== "0");
    } catch {
      setOpen(IS_DEMO);
    }
  }, []);
  if (!open) return null;
  return (
    <div role="note" className="fixed bottom-3 left-3 z-[45] hidden max-w-xs items-start gap-3 rounded-2xl border border-line bg-white/95 p-4 text-[13px] leading-snug text-ink shadow-[0_18px_40px_-20px_rgba(20,43,59,0.5)] backdrop-blur md:flex">
      <span>
        <strong className="text-navy">Voorstel nieuwe website.</strong> Presentatieversie voor Caribbean Dental Care. Gegevens met “volgt” worden nog door de praktijk bevestigd.
      </span>
      <button
        type="button"
        onClick={() => {
          setOpen(false);
          try {
            sessionStorage.setItem("cdc-demo-banner", "0");
          } catch {}
        }}
        className="-m-1 rounded-full p-1 text-muted hover:text-navy"
      >
        <X className="h-4 w-4" aria-hidden="true" />
        <span className="sr-only">Sluiten</span>
      </button>
    </div>
  );
}
