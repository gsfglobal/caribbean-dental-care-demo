/**
 * Contactaanvragen — adapter.
 * - Productie: NEXT_PUBLIC_FORM_ENDPOINT gezet → POST naar de server (backend/functions/api/request.ts),
 *   die antispam controleert en de aanvraag opslaat in de database (backend/supabase/schema.sql).
 * - Demo (geen endpoint): de aanvraag blijft ALLEEN in de browser van de bezoeker (localStorage)
 *   en verschijnt in de demo-dashboard op hetzelfde apparaat. Er wordt niets verzonden.
 */

export type RequestStatus = "nieuw" | "in_behandeling" | "contact_opgenomen" | "afgerond";
export const statusLabel: Record<RequestStatus, string> = {
  nieuw: "Nieuw",
  in_behandeling: "In behandeling",
  contact_opgenomen: "Contact opgenomen",
  afgerond: "Afgerond",
};

export type ContactRequest = {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email?: string;
  preferredMoment?: string;
  subject: string;
  status: RequestStatus;
  notes: string;
  source: "website" | "demo-voorbeeld";
};

export type RequestInput = Pick<ContactRequest, "name" | "phone" | "email" | "preferredMoment" | "subject">;

const KEY = "cdc-demo-requests-v1";
const ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? "";

export const subjects = [
  "Controle of gebitsreiniging",
  "Ik heb pijn of klachten",
  "Behandeling (vulling, kroon, wortelkanaal)",
  "Afspraak voor mijn kind",
  "Beugel of aligners",
  "Tandenbleken",
  "Andere vraag",
];

export const moments = ["Geen voorkeur", "Ochtend", "Middag", "Zo snel mogelijk"];

/** Validatie, gedeeld met de server. Retourneert foutmeldingen per veld (NL). */
export function validate(input: Partial<RequestInput>) {
  const e: Partial<Record<keyof RequestInput, string>> = {};
  const name = (input.name ?? "").trim();
  const phone = (input.phone ?? "").replace(/[\s().-]/g, "");
  const email = (input.email ?? "").trim();
  if (name.length < 2) e.name = "Vul uw naam in.";
  else if (name.length > 80) e.name = "Uw naam is te lang.";
  if (!/^\+?\d{7,15}$/.test(phone)) e.phone = "Vul een geldig telefoonnummer in, bijvoorbeeld +599 717 1234.";
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) e.email = "Dit e-mailadres lijkt niet te kloppen.";
  if (!input.subject || !subjects.includes(input.subject)) e.subject = "Kies een onderwerp.";
  return e;
}

function readLocal(): ContactRequest[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ContactRequest[]) : [];
  } catch {
    return [];
  }
}
function writeLocal(list: ContactRequest[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
    window.dispatchEvent(new Event("cdc-requests"));
  } catch {
    /* opslag niet beschikbaar: niets doen */
  }
}

export type SubmitResult = { ok: true; mode: "server" | "demo" } | { ok: false; error: string };

export async function submitRequest(input: RequestInput, extra: { honeypot: string; startedAt: number; turnstileToken?: string }): Promise<SubmitResult> {
  // Antispam aan de clientkant (de server controleert opnieuw)
  if (extra.honeypot) return { ok: true, mode: ENDPOINT ? "server" : "demo" }; // stil negeren
  if (Date.now() - extra.startedAt < 2500) return { ok: false, error: "Het formulier werd te snel verzonden. Probeer het opnieuw." };
  const errors = validate(input);
  if (Object.keys(errors).length) return { ok: false, error: "Controleer de gemarkeerde velden." };

  if (ENDPOINT) {
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...input, turnstileToken: extra.turnstileToken, startedAt: extra.startedAt }),
      });
      if (!res.ok) throw new Error(String(res.status));
      return { ok: true, mode: "server" };
    } catch {
      return { ok: false, error: "Verzenden is niet gelukt. Probeer het later opnieuw of bel ons op +599 717 8106." };
    }
  }

  const item: ContactRequest = {
    id: `web-${Date.now().toString(36)}`,
    createdAt: new Date().toISOString(),
    name: input.name.trim(),
    phone: input.phone.trim(),
    email: input.email?.trim() || undefined,
    preferredMoment: input.preferredMoment || undefined,
    subject: input.subject,
    status: "nieuw",
    notes: "",
    source: "website",
  };
  writeLocal([item, ...readLocal()]);
  return { ok: true, mode: "demo" };
}

export const demoStore = { read: readLocal, write: writeLocal, KEY };
