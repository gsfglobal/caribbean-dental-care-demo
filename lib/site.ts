/**
 * CONFIGURAZIONE CENTRALE DELLO STUDIO
 * ------------------------------------------------------------------
 * Unico punto in cui vivono i dati della praktijk. Tutto ciò che non è
 * verificato è marcato `status: "da confermare"` e NON viene mostrato
 * come dato certo sul sito né inserito nei dati strutturati (schema.org).
 * Fonti: research/sources.md
 */

export type Pending<T> = { value: T | null; status: "confermato" | "da confermare"; note?: string };
const tbc = <T,>(note?: string, value: T | null = null): Pending<T> => ({ value, status: "da confermare", note });
const ok = <T,>(value: T): Pending<T> => ({ value, status: "confermato" });

export const BASE_PATH = process.env.NEXT_PUBLIC_BASE ?? "";
/** Modalità demo: copia di presentazione (noindex, niente schema.org, modulo senza backend). */
export const IS_DEMO = BASE_PATH !== "" || !process.env.NEXT_PUBLIC_FORM_ENDPOINT;
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://dominio-da-confermare.example";

export const clinic = {
  name: "Caribbean Dental Care",
  legalName: tbc<string>("Ragione sociale e numero KvK per il footer legale"),
  address: {
    street: "Kaya Korona 18",
    city: "Kralendijk",
    island: "Bonaire",
    country: "Caribisch Nederland",
    countryCode: "BQ",
  },
  phone: { display: "+599 717 8106", e164: "+5997178106" },
  whatsapp: { number: "5997178106", display: "+599 717 8106" },
  /** Email pubblica per i pazienti: NON usare admin@chirinodentalclinic.com (contatto di recruiting). */
  email: tbc<string>("Email pubblica per le richieste dei pazienti"),
  notifyEmail: tbc<string>("Email interna che riceve le notifiche del modulo"),
  openingHours: tbc<{ day: string; hours: string }[]>("Orari definitivi di apertura"),
  emergencyPolicy: tbc<string>("Come gestire le urgenze fuori orario"),
  insurance: tbc<string>("Convenzioni assicurative (ZJCN, assicurazioni private)"),
  prices: tbc<string>("Prezzi e listini — non pubblicati"),
  team: tbc<{ name: string; role: string; photo?: string }[]>("Nomi, titoli e foto autorizzate del team"),
  teamSnapshot: tbc<string>(
    "Annuncio KNMT (ultima modifica 26/10/2026): 2 tandartsen, 4 behandelstoelen, 3 assistenten, 1 mondhygiënist — snapshot, non pubblicato"
  ),
  certifications: tbc<string>("Certificazioni / iscrizioni (BIG, ecc.)"),
  reviews: tbc<string>("Recensioni autorizzate — nessuna pubblicata"),
  photos: tbc<string>("Foto reali della praktijk e del team"),
  logo: { src: "/media/logo.png", status: "da confermare" as const, note: "Inserire il file originale fornito dallo studio" },
  onlineBooking: { available: false, note: "Nessuna prenotazione in tempo reale: lo studio richiama" },
  languages: tbc<string[]>("Lingue parlate al banco (NL, EN, ES, Papiamentu?)"),
  /** Coordinate approssimative di Kralendijk centro: usate solo per il link mappa, non nel markup strutturato. */
  mapsQuery: "Kaya Korona 18, Kralendijk, Bonaire",
};

export const tel = `tel:${clinic.phone.e164}`;
export const WA_MESSAGE = "Goedendag, ik wil graag een afspraak aanvragen bij Caribbean Dental Care. Kunt u mij helpen?";
export const waLink = (message: string = WA_MESSAGE) => `https://wa.me/${clinic.whatsapp.number}?text=${encodeURIComponent(message)}`;
export const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clinic.mapsQuery)}`;
export const directionsLink = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(clinic.mapsQuery)}`;
export const fullAddress = `${clinic.address.street}, ${clinic.address.city}, ${clinic.address.island}`;

export const nav = [
  { href: "/", label: "Home" },
  { href: "/behandelingen/", label: "Behandelingen" },
  { href: "/over-ons/", label: "Over ons" },
  { href: "/voor-patienten/", label: "Voor patiënten" },
  { href: "/contact/", label: "Contact & afspraak" },
];

/** Elenco per il cliente: cosa manca ancora (mostrato anche nella dashboard → Instellingen). */
export function pendingItems() {
  return Object.entries(clinic)
    .filter(([, v]) => v && typeof v === "object" && "status" in v && (v as Pending<unknown>).status === "da confermare")
    .map(([k, v]) => ({ key: k, note: (v as Pending<unknown>).note ?? "" }));
}

export { ok };
