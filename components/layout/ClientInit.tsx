"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { installClickTracking, track } from "@/lib/analytics";

/** Telt paginaweergaven en klikken op telefoon/WhatsApp (zonder cookies of persoonsgegevens). */
export function ClientInit() {
  const path = usePathname();
  useEffect(() => installClickTracking(), []);
  useEffect(() => {
    track("pageview");
  }, [path]);
  return null;
}
