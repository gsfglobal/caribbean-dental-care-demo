/**
 * DEMO-gegevens voor de beheeromgeving. Alle namen en nummers zijn FICTIEF.
 * In productie komen aanvragen en afspraken uit de database (backend/supabase/schema.sql)
 * en wordt toegang server-side gecontroleerd (Supabase Auth + Row Level Security).
 */
import { demoStore, type ContactRequest, type RequestStatus } from "./requests";

const day = (offset: number, h: number, m = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - offset);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
};

export const sampleRequests: ContactRequest[] = [
  { id: "vb-1", createdAt: day(0, 9, 12), name: "M. de Vries (voorbeeld)", phone: "+599 700 0001", subject: "Controle of gebitsreiniging", preferredMoment: "Ochtend", status: "nieuw", notes: "", source: "demo-voorbeeld" },
  { id: "vb-2", createdAt: day(0, 8, 2), name: "J. Martis (voorbeeld)", phone: "+599 700 0002", subject: "Ik heb pijn of klachten", preferredMoment: "Zo snel mogelijk", status: "in_behandeling", notes: "Teruggebeld, voicemail ingesproken.", source: "demo-voorbeeld" },
  { id: "vb-3", createdAt: day(1, 15, 40), name: "A. Rosario (voorbeeld)", phone: "+599 700 0003", email: "voorbeeld@example.com", subject: "Afspraak voor mijn kind", status: "contact_opgenomen", notes: "Afspraak voorgesteld voor volgende week.", source: "demo-voorbeeld" },
  { id: "vb-4", createdAt: day(2, 11, 5), name: "S. Janssen (voorbeeld)", phone: "+599 700 0004", subject: "Beugel of aligners", status: "afgerond", notes: "Beoordeling ingepland.", source: "demo-voorbeeld" },
  { id: "vb-5", createdAt: day(3, 17, 22), name: "L. Pietersz (voorbeeld)", phone: "+599 700 0005", subject: "Tandenbleken", preferredMoment: "Middag", status: "nieuw", notes: "", source: "demo-voorbeeld" },
  { id: "vb-6", createdAt: day(4, 10, 30), name: "R. Thomas (voorbeeld)", phone: "+599 700 0006", subject: "Behandeling (vulling, kroon, wortelkanaal)", status: "afgerond", notes: "", source: "demo-voorbeeld" },
  { id: "vb-7", createdAt: day(5, 9, 50), name: "K. Bakker (voorbeeld)", phone: "+599 700 0007", subject: "Controle of gebitsreiniging", status: "contact_opgenomen", notes: "", source: "demo-voorbeeld" },
];

export type Appointment = { id: string; date: string; time: string; name: string; type: string; chair?: string; note?: string; sample?: boolean };

const ymd = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
};
export const sampleAppointments: Appointment[] = [
  { id: "a1", date: ymd(0), time: "09:00", name: "A. Rosario (voorbeeld)", type: "Controle kind", chair: "Stoel 1", sample: true },
  { id: "a2", date: ymd(1), time: "10:30", name: "S. Janssen (voorbeeld)", type: "Beoordeling aligners", chair: "Stoel 2", sample: true },
  { id: "a3", date: ymd(2), time: "14:00", name: "K. Bakker (voorbeeld)", type: "Gebitsreiniging", chair: "Mondhygiëne", sample: true },
];

/* ---------- lokale opslag (alleen demo) ---------- */
const OV = "cdc-demo-overrides-v1";
const AP = "cdc-demo-appointments-v1";
const CM = "cdc-demo-content-v1";

type Overrides = Record<string, { status?: RequestStatus; notes?: string }>;
const read = <T,>(k: string, d: T): T => {
  try {
    const r = localStorage.getItem(k);
    return r ? (JSON.parse(r) as T) : d;
  } catch {
    return d;
  }
};
const write = (k: string, v: unknown) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {}
};

export function loadRequests(): ContactRequest[] {
  const ov = read<Overrides>(OV, {});
  return [...demoStore.read(), ...sampleRequests]
    .map((r) => ({ ...r, ...(ov[r.id] ?? {}) }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
export function updateRequest(id: string, patch: { status?: RequestStatus; notes?: string }) {
  const ov = read<Overrides>(OV, {});
  ov[id] = { ...(ov[id] ?? {}), ...patch };
  write(OV, ov);
}
export function loadAppointments(): Appointment[] {
  return [...read<Appointment[]>(AP, []), ...sampleAppointments].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
}
export function addAppointment(a: Omit<Appointment, "id">) {
  write(AP, [{ ...a, id: `ap-${Date.now().toString(36)}` }, ...read<Appointment[]>(AP, [])]);
}
export function removeAppointment(id: string) {
  write(AP, read<Appointment[]>(AP, []).filter((a) => a.id !== id));
}
export function loadContent<T>(key: string, fallback: T): T {
  return read<Record<string, T>>(CM, {})[key] ?? fallback;
}
export function saveContent(key: string, value: unknown) {
  const all = read<Record<string, unknown>>(CM, {});
  all[key] = value;
  write(CM, all);
}
export function resetDemo() {
  [OV, AP, CM, demoStore.KEY, "cdc-demo-events-v1"].forEach((k) => {
    try {
      localStorage.removeItem(k);
    } catch {}
  });
}
