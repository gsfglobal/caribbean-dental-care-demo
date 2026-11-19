/**
 * Meetpunten (zonder cookies, zonder persoonsgegevens):
 * paginaweergaven, klikken op telefoon/WhatsApp, verzonden formulieren.
 * - Demo: tellers alleen in de browser van de bezoeker (localStorage).
 * - Productie: koppel `send()` aan een privacyvriendelijke dienst (bijv. Plausible of
 *   Cloudflare Web Analytics) — zie README. Geen tracking zonder geldige grondslag.
 */
export type EventName = "pageview" | "click_phone" | "click_whatsapp" | "form_submit";
const KEY = "cdc-demo-events-v1";

export type Counter = Record<string, Partial<Record<EventName, number>>>; // per dag (YYYY-MM-DD)

export function track(name: EventName) {
  try {
    const day = new Date().toISOString().slice(0, 10);
    const all = JSON.parse(localStorage.getItem(KEY) || "{}") as Counter;
    all[day] = all[day] || {};
    all[day][name] = (all[day][name] || 0) + 1;
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    /* geen opslag beschikbaar */
  }
  // Productie: window.plausible?.(name)
  const w = window as unknown as { plausible?: (e: string) => void };
  w.plausible?.(name);
}

export function readEvents(): Counter {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}") as Counter;
  } catch {
    return {};
  }
}

/** Gedelegeerde klikmeting: elke link naar tel: of wa.me wordt geteld. */
export function installClickTracking() {
  const on = (e: MouseEvent) => {
    const a = (e.target as HTMLElement | null)?.closest("a");
    if (!a) return;
    const href = a.getAttribute("href") || "";
    if (href.startsWith("tel:")) track("click_phone");
    else if (href.includes("wa.me/")) track("click_whatsapp");
  };
  document.addEventListener("click", on, true);
  return () => document.removeEventListener("click", on, true);
}
