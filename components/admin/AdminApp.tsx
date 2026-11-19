"use client";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Inbox,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Phone,
  Plus,
  RotateCcw,
  Search,
  Settings,
  Trash2,
  X,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { statusLabel, type ContactRequest, type RequestStatus } from "@/lib/requests";
import { addAppointment, loadAppointments, loadContent, loadRequests, removeAppointment, resetDemo, saveContent, updateRequest, type Appointment } from "@/lib/admin-demo";
import { readEvents, type EventName } from "@/lib/analytics";
import { clinic, pendingItems } from "@/lib/site";
import { treatments } from "@/lib/treatments";
import { generalFaq } from "@/lib/content";

type View = "overzicht" | "aanvragen" | "agenda" | "inhoud" | "statistieken" | "instellingen";
const NAV: { id: View; label: string; icon: typeof Inbox }[] = [
  { id: "overzicht", label: "Overzicht", icon: LayoutDashboard },
  { id: "aanvragen", label: "Aanvragen", icon: Inbox },
  { id: "agenda", label: "Agenda", icon: CalendarDays },
  { id: "inhoud", label: "Inhoud", icon: FileText },
  { id: "statistieken", label: "Statistieken", icon: BarChart3 },
  { id: "instellingen", label: "Instellingen", icon: Settings },
];
const STATUSES: RequestStatus[] = ["nieuw", "in_behandeling", "contact_opgenomen", "afgerond"];
const statusStyle: Record<RequestStatus, string> = {
  nieuw: "bg-[#e7f1fb] text-[#2f5d86] ring-[#c9def2]",
  in_behandeling: "bg-[#fff5e0] text-[#8a5a00] ring-[#f3dfb0]",
  contact_opgenomen: "bg-[#eaf4ea] text-[#3f7341] ring-[#cfe5cf]",
  afgerond: "bg-[#eef1f3] text-[#4b5d69] ring-[#dbe2e6]",
};
/** In de preview (hash-routing) gebruiken de beheerweergaven geen #hash. */
const HASH_NAV = process.env.NEXT_PUBLIC_PREVIEW !== "1";
const fmtDate = (iso: string) => new Date(iso).toLocaleString("nl-NL", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
const waFor = (r: ContactRequest) => `https://wa.me/${r.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Goedendag ${r.name.replace(/\s*\(voorbeeld\)/, "")}, u heeft een aanvraag gedaan bij Caribbean Dental Care.`)}`;

function Badge({ s }: { s: RequestStatus }) {
  return <span className={`inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-2.5 py-1 text-[12px] font-semibold ring-1 ${statusStyle[s]}`}>{statusLabel[s]}</span>;
}

export function AdminApp() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [view, setView] = useState<View>("overzicht");
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [toast, setToast] = useState("");

  const refresh = useCallback(() => setRequests(loadRequests()), []);
  useEffect(() => {
    try {
      setAuthed(sessionStorage.getItem("cdc-admin-demo") === "1");
    } catch {
      setAuthed(false);
    }
    refresh();
    const on = () => refresh();
    window.addEventListener("cdc-requests", on);
    window.addEventListener("storage", on);
    const h = () => {
      if (!HASH_NAV) return;
      const v = window.location.hash.replace("#", "") as View;
      if (NAV.some((n) => n.id === v)) setView(v);
    };
    h();
    window.addEventListener("hashchange", h);
    return () => {
      window.removeEventListener("cdc-requests", on);
      window.removeEventListener("storage", on);
      window.removeEventListener("hashchange", h);
    };
  }, [refresh]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  const go = (v: View) => {
    setView(v);
    if (HASH_NAV) {
      try {
        history.replaceState(null, "", `#${v}`);
      } catch {}
    }
    window.scrollTo(0, 0);
  };

  if (authed === null) return <div className="min-h-screen bg-soft" />;
  if (!authed) return <Login onEnter={() => { try { sessionStorage.setItem("cdc-admin-demo", "1"); } catch {} setAuthed(true); }} />;

  const newCount = requests.filter((r) => r.status === "nieuw").length;

  return (
    <div className="min-h-screen bg-soft text-ink lg:flex">
      <aside className="sticky top-0 hidden h-screen w-[260px] shrink-0 flex-col border-r border-line bg-white p-5 lg:flex">
        <Logo />
        <p className="mt-2 text-[12px] font-medium text-muted">Beheeromgeving</p>
        <nav aria-label="Beheer" className="mt-8 flex-1">
          <ul className="space-y-1">
            {NAV.map(({ id, label, icon: I }) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => go(id)}
                  aria-current={view === id ? "page" : undefined}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium text-ink/75 transition hover:bg-soft aria-[current=page]:bg-navy aria-[current=page]:text-white"
                >
                  <I className="h-[18px] w-[18px]" aria-hidden="true" /> {label}
                  {id === "aanvragen" && newCount > 0 && <span className="ml-auto rounded-full bg-green px-2 py-0.5 text-[11px] font-bold text-white">{newCount}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <DemoNote />
        <button type="button" onClick={() => { try { sessionStorage.removeItem("cdc-admin-demo"); } catch {} setAuthed(false); }} className="mt-4 flex items-center gap-2 rounded-xl px-3 py-2 text-[14px] text-muted hover:bg-soft hover:text-navy">
          <LogOut className="h-4 w-4" aria-hidden="true" /> Uitloggen
        </button>
      </aside>

      <div className="min-w-0 flex-1 pb-24 lg:pb-10">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-line bg-white/85 px-5 py-3.5 backdrop-blur-xl md:px-8">
          <div className="flex items-center gap-3">
            <span className="lg:hidden">
              <Logo className="scale-90" />
            </span>
            <h1 className="hidden font-display text-[20px] font-bold text-navy lg:block">{NAV.find((n) => n.id === view)?.label}</h1>
          </div>
          <span className="rounded-full border border-dashed border-blue-soft bg-soft px-3 py-1 text-[12px] font-semibold text-blue">Demo · fictieve gegevens</span>
        </header>
        <main className="px-5 py-6 md:px-8 md:py-8">
          <h1 className="mb-5 font-display text-[24px] font-bold text-navy lg:hidden">{NAV.find((n) => n.id === view)?.label}</h1>
          {view === "overzicht" && <Overview requests={requests} go={go} />}
          {view === "aanvragen" && <Requests requests={requests} onChange={(id, p) => { updateRequest(id, p); refresh(); setToast("Wijziging opgeslagen"); }} />}
          {view === "agenda" && <Agenda onToast={setToast} />}
          {view === "inhoud" && <Content onToast={setToast} />}
          {view === "statistieken" && <Stats requests={requests} />}
          {view === "instellingen" && <SettingsView onReset={() => { resetDemo(); refresh(); setToast("Demo teruggezet naar de voorbeeldgegevens"); }} />}
        </main>
      </div>

      <nav aria-label="Beheer mobiel" className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur lg:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        <ul className="grid grid-cols-6">
          {NAV.map(({ id, label, icon: I }) => (
            <li key={id}>
              <button type="button" onClick={() => go(id)} aria-current={view === id ? "page" : undefined} className="relative flex w-full flex-col items-center gap-1 py-2.5 text-[10.5px] font-medium text-muted aria-[current=page]:text-navy">
                <I className="h-5 w-5" aria-hidden="true" />
                {label}
                {id === "aanvragen" && newCount > 0 && <span className="absolute right-3 top-1.5 h-2 w-2 rounded-full bg-green" />}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {toast && (
        <div role="status" className="fixed bottom-24 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-navy px-5 py-3 text-[14px] font-medium text-white shadow-xl lg:bottom-8">
          <CheckCircle2 className="h-4 w-4 text-green-soft" aria-hidden="true" /> {toast}
        </div>
      )}
    </div>
  );
}

function DemoNote() {
  return (
    <p className="rounded-2xl border border-dashed border-blue-soft bg-soft p-3 text-[12px] leading-relaxed text-blue">
      <strong>Demo-omgeving.</strong> Alle namen zijn fictief. Wijzigingen worden alleen in deze browser bewaard.
    </p>
  );
}

function Login({ onEnter }: { onEnter: () => void }) {
  return (
    <main className="brand-wash flex min-h-screen items-center justify-center p-5">
      <div className="w-full max-w-md rounded-[28px] border border-line bg-white p-8 shadow-[0_40px_80px_-40px_rgba(20,43,59,0.35)] md:p-10">
        <Logo />
        <h1 className="mt-8 font-display text-[26px] font-bold text-navy">Beheeromgeving</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-ink/75">Voor het personeel van Caribbean Dental Care: contactaanvragen, agenda en website-inhoud op één plek.</p>
        <div className="mt-6 rounded-2xl border border-dashed border-blue-soft bg-soft p-4 text-[13.5px] leading-relaxed text-blue">
          <strong>Dit is een demo met fictieve gegevens.</strong> In de definitieve versie logt het personeel in met een persoonlijk account; de toegang wordt op de server gecontroleerd en patiëntgegevens staan nooit in de publieke website.
        </div>
        <button type="button" onClick={onEnter} className="btn btn-primary mt-6 w-full !min-h-14">
          Demo openen
        </button>
        <Link href="/" className="mt-4 block text-center text-[14px] text-muted hover:text-navy">
          ← Terug naar de website
        </Link>
      </div>
    </main>
  );
}

/* ---------------- Overzicht ---------------- */
function Overview({ requests, go }: { requests: ContactRequest[]; go: (v: View) => void }) {
  const c = (s: RequestStatus) => requests.filter((r) => r.status === s).length;
  const kpis = [
    { l: "Aanvragen ontvangen", v: requests.length, sub: "totaal in deze demo" },
    { l: "Nieuw", v: c("nieuw"), sub: "nog niet opgepakt", accent: true },
    { l: "In behandeling", v: c("in_behandeling"), sub: "wordt aan gewerkt" },
    { l: "Contact opgenomen / afgerond", v: c("contact_opgenomen") + c("afgerond"), sub: "afgehandeld" },
  ];
  const days = useMemo(() => {
    const out: { label: string; n: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      out.push({ label: d.toLocaleDateString("nl-NL", { weekday: "short" }), n: requests.filter((r) => r.createdAt.slice(0, 10) === key).length });
    }
    return out;
  }, [requests]);
  const max = Math.max(1, ...days.map((d) => d.n));
  const fresh = requests.filter((r) => r.status === "nieuw").slice(0, 4);
  return (
    <div className="space-y-6">
      <p className="text-[15px] text-ink/70">Goedendag! Hier ziet u in één oogopslag hoeveel aanvragen er zijn binnengekomen en wat er nog moet gebeuren.</p>
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <li key={k.l} className={`rounded-[22px] border p-5 ${k.accent ? "border-navy bg-navy text-white" : "border-line bg-white"}`}>
            <p className={`text-[13px] font-medium ${k.accent ? "text-white/70" : "text-muted"}`}>{k.l}</p>
            <p className={`mt-2 font-display text-[38px] font-extrabold leading-none ${k.accent ? "text-white" : "text-navy"}`}>{k.v}</p>
            <p className={`mt-2 text-[12px] ${k.accent ? "text-white/60" : "text-muted"}`}>{k.sub}</p>
          </li>
        ))}
      </ul>
      <div className="grid gap-6 xl:grid-cols-5">
        <section className="rounded-[22px] border border-line bg-white p-6 xl:col-span-3" aria-labelledby="week">
          <h2 id="week" className="font-display text-[17px] font-bold text-navy">Aanvragen per dag · afgelopen 7 dagen</h2>
          <div className="mt-6 flex h-48 items-end gap-3" role="img" aria-label={`Aanvragen per dag: ${days.map((d) => `${d.label} ${d.n}`).join(", ")}`}>
            {days.map((d, i) => (
              <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <span className="text-[12px] font-semibold text-navy">{d.n}</span>
                <div className="w-full max-w-12 rounded-t-xl bg-[linear-gradient(180deg,var(--cdc-green),var(--cdc-green-ink))] transition-all duration-700" style={{ height: `${(d.n / max) * 100}%`, minHeight: d.n ? 8 : 2, opacity: d.n ? 1 : 0.25 }} />
                <span className="text-[12px] text-muted">{d.label}</span>
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-[22px] border border-line bg-white p-6 xl:col-span-2" aria-labelledby="todo">
          <div className="flex items-center justify-between">
            <h2 id="todo" className="font-display text-[17px] font-bold text-navy">Nog op te pakken</h2>
            <button type="button" onClick={() => go("aanvragen")} className="text-[13px] font-semibold text-green-ink hover:underline">
              Alle aanvragen →
            </button>
          </div>
          {fresh.length ? (
            <ul className="mt-4 divide-y divide-line">
              {fresh.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-navy">{r.name}</p>
                    <p className="truncate text-[13px] text-muted">{r.subject} · {fmtDate(r.createdAt)}</p>
                  </div>
                  <a href={`tel:${r.phone.replace(/\s/g, "")}`} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-soft text-navy hover:bg-green-soft" aria-label={`Bel ${r.name}`}>
                    <Phone className="h-4 w-4" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-[14px] text-muted">Geen nieuwe aanvragen. 🎉</p>
          )}
        </section>
      </div>
      <p className="text-[13px] text-muted">Tip: vul op de website het contactformulier in — de aanvraag verschijnt hier direct (in deze browser).</p>
    </div>
  );
}

/* ---------------- Aanvragen ---------------- */
function Requests({ requests, onChange }: { requests: ContactRequest[]; onChange: (id: string, p: { status?: RequestStatus; notes?: string }) => void }) {
  const [filter, setFilter] = useState<RequestStatus | "alle">("alle");
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const list = requests.filter((r) => (filter === "alle" || r.status === filter) && (r.name + r.phone + r.subject).toLowerCase().includes(q.toLowerCase()));
  const open = requests.find((r) => r.id === openId) ?? null;
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter op status">
          {(["alle", ...STATUSES] as const).map((s) => (
            <button key={s} type="button" aria-pressed={filter === s} onClick={() => setFilter(s)} className="rounded-full border border-line bg-white px-3.5 py-2 text-[13px] font-semibold text-ink/75 aria-pressed:border-navy aria-pressed:bg-navy aria-pressed:text-white">
              {s === "alle" ? "Alle" : statusLabel[s]} <span className="opacity-60">({s === "alle" ? requests.length : requests.filter((r) => r.status === s).length})</span>
            </button>
          ))}
        </div>
        <label className="relative block md:w-72">
          <span className="sr-only">Zoeken</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Zoek op naam, nummer, onderwerp" className="w-full rounded-full border border-line bg-white py-2.5 pl-10 pr-4 text-[14px] outline-none focus:border-blue" />
        </label>
      </div>

      <div className="overflow-hidden rounded-[22px] border border-line bg-white">
        <table className="hidden w-full text-left text-[14px] md:table">
          <thead className="bg-soft text-[12px] uppercase tracking-[0.08em] text-muted">
            <tr>
              <th className="px-5 py-3 font-semibold">Naam</th>
              <th className="px-5 py-3 font-semibold">Contact</th>
              <th className="px-5 py-3 font-semibold">Datum aanvraag</th>
              <th className="px-5 py-3 font-semibold">Onderwerp</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold">Interne notitie</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {list.map((r) => (
              <tr key={r.id} className="cursor-pointer transition hover:bg-soft/60" onClick={() => setOpenId(r.id)}>
                <td className="px-5 py-4">
                  <button type="button" className="text-left font-semibold text-navy hover:underline" onClick={(e) => { e.stopPropagation(); setOpenId(r.id); }}>
                    {r.name}
                  </button>
                  {r.source === "website" && <span className="ml-2 rounded-full bg-green-soft/40 px-2 py-0.5 text-[11px] font-semibold text-green-ink">via website</span>}
                </td>
                <td className="px-5 py-4 text-ink/80">
                  {r.phone}
                  {r.email && <span className="block text-[12px] text-muted">{r.email}</span>}
                </td>
                <td className="px-5 py-4 text-ink/80">{fmtDate(r.createdAt)}</td>
                <td className="px-5 py-4 text-ink/80">{r.subject}</td>
                <td className="px-5 py-4"><Badge s={r.status} /></td>
                <td className="max-w-[220px] truncate px-5 py-4 text-muted">{r.notes || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <ul className="divide-y divide-line md:hidden">
          {list.map((r) => (
            <li key={r.id}>
              <button type="button" onClick={() => setOpenId(r.id)} className="flex w-full items-start justify-between gap-3 p-4 text-left">
                <span className="min-w-0">
                  <span className="block truncate font-semibold text-navy">{r.name}</span>
                  <span className="block truncate text-[13px] text-muted">{r.subject}</span>
                  <span className="block text-[12px] text-muted">{fmtDate(r.createdAt)}</span>
                </span>
                <Badge s={r.status} />
              </button>
            </li>
          ))}
        </ul>
        {!list.length && <p className="p-8 text-center text-[14px] text-muted">Geen aanvragen gevonden.</p>}
      </div>
      <p className="text-[13px] text-muted">De statussen gaan over de afhandeling van de aanvraag — niet over automatisch vastgelegde afspraken.</p>

      {open && <RequestPanel r={open} onClose={() => setOpenId(null)} onChange={onChange} />}
    </div>
  );
}

function RequestPanel({ r, onClose, onChange }: { r: ContactRequest; onClose: () => void; onChange: (id: string, p: { status?: RequestStatus; notes?: string }) => void }) {
  const [notes, setNotes] = useState(r.notes);
  useEffect(() => setNotes(r.notes), [r.id, r.notes]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-navy/30 backdrop-blur-[2px]" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="req-title" className="h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-2xl md:p-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">Aanvraag</p>
            <h2 id="req-title" className="mt-1 font-display text-[24px] font-bold text-navy">{r.name}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-2 hover:bg-soft" autoFocus>
            <X className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">Sluiten</span>
          </button>
        </div>
        <dl className="mt-6 grid grid-cols-[130px_1fr] gap-y-3 text-[14px]">
          <dt className="text-muted">Telefoon</dt><dd className="font-semibold text-navy">{r.phone}</dd>
          <dt className="text-muted">E-mail</dt><dd>{r.email || "—"}</dd>
          <dt className="text-muted">Onderwerp</dt><dd>{r.subject}</dd>
          <dt className="text-muted">Contactmoment</dt><dd>{r.preferredMoment || "Geen voorkeur"}</dd>
          <dt className="text-muted">Ontvangen</dt><dd>{fmtDate(r.createdAt)}</dd>
          <dt className="text-muted">Bron</dt><dd>{r.source === "website" ? "Contactformulier website" : "Voorbeeldgegevens"}</dd>
        </dl>
        <div className="mt-6 grid grid-cols-2 gap-2">
          <a href={`tel:${r.phone.replace(/\s/g, "")}`} className="btn btn-primary !min-h-11 !text-[14px]"><Phone className="h-4 w-4" aria-hidden="true" /> Bellen</a>
          <a href={waFor(r)} target="_blank" rel="noopener" className="btn btn-green !min-h-11 !text-[14px]"><MessageCircle className="h-4 w-4" aria-hidden="true" /> WhatsApp</a>
        </div>
        <fieldset className="mt-8">
          <legend className="text-[14px] font-semibold text-navy">Status</legend>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {STATUSES.map((s) => (
              <label key={s} className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-[14px] ${r.status === s ? "border-navy bg-soft font-semibold text-navy" : "border-line"}`}>
                <input type="radio" name="status" className="accent-[var(--cdc-navy)]" checked={r.status === s} onChange={() => onChange(r.id, { status: s })} /> {statusLabel[s]}
              </label>
            ))}
          </div>
        </fieldset>
        <label className="mt-8 block">
          <span className="text-[14px] font-semibold text-navy">Interne notitie (administratief)</span>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} className="mt-2 w-full rounded-2xl border border-line p-3 text-[14px] outline-none focus:border-blue" placeholder="Bijv. teruggebeld, voicemail ingesproken…" />
          <span className="mt-1 block text-[12px] text-muted">Geen medische gegevens noteren — die horen in het praktijkbeheersysteem.</span>
        </label>
        <button type="button" onClick={() => onChange(r.id, { notes })} className="btn btn-primary mt-4 w-full">
          Notitie opslaan
        </button>
      </div>
    </div>
  );
}

/* ---------------- Agenda ---------------- */
function Agenda({ onToast }: { onToast: (s: string) => void }) {
  const [items, setItems] = useState<Appointment[]>([]);
  const [week, setWeek] = useState(0);
  const [adding, setAdding] = useState(false);
  useEffect(() => setItems(loadAppointments()), []);
  const monday = useMemo(() => {
    const d = new Date();
    const wd = (d.getDay() + 6) % 7;
    d.setDate(d.getDate() - wd + week * 7);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [week]);
  const days = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(d.getDate() + i);
    return d;
  });
  const key = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const today = key(new Date());

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    addAppointment({ date: String(f.get("date")), time: String(f.get("time")), name: String(f.get("name")), type: String(f.get("type")), chair: String(f.get("chair") || "") });
    setItems(loadAppointments());
    setAdding(false);
    onToast("Afspraak toegevoegd");
  }

  return (
    <div className="space-y-5">
      <p className="rounded-2xl border border-line bg-white p-4 text-[14px] leading-relaxed text-ink/75">
        Administratieve agenda voor afspraken die het personeel <strong className="text-navy">handmatig heeft bevestigd</strong> met de patiënt. Dit vervangt geen gecertificeerd tandheelkundig praktijkbeheersysteem.
      </p>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setWeek(week - 1)} className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white hover:border-navy" aria-label="Vorige week"><ChevronLeft className="h-4 w-4" /></button>
          <button type="button" onClick={() => setWeek(0)} className="rounded-full border border-line bg-white px-4 py-2 text-[13px] font-semibold">Deze week</button>
          <button type="button" onClick={() => setWeek(week + 1)} className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white hover:border-navy" aria-label="Volgende week"><ChevronRight className="h-4 w-4" /></button>
          <span className="ml-2 font-display text-[16px] font-bold text-navy">
            {days[0].toLocaleDateString("nl-NL", { day: "numeric", month: "short" })} – {days[5].toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" })}
          </span>
        </div>
        <button type="button" onClick={() => setAdding(true)} className="btn btn-primary !min-h-11 !text-[14px]"><Plus className="h-4 w-4" aria-hidden="true" /> Bevestigde afspraak toevoegen</button>
      </div>
      <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
        {days.map((d) => {
          const k = key(d);
          const list = items.filter((a) => a.date === k);
          return (
            <section key={k} className={`min-h-40 rounded-[20px] border bg-white p-4 ${k === today ? "border-green ring-2 ring-green/20" : "border-line"}`} aria-label={d.toLocaleDateString("nl-NL", { weekday: "long", day: "numeric", month: "long" })}>
              <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-muted">{d.toLocaleDateString("nl-NL", { weekday: "short" })}</p>
              <p className="font-display text-[22px] font-bold text-navy">{d.getDate()}</p>
              <ul className="mt-3 space-y-2">
                {list.map((a) => (
                  <li key={a.id} className="group rounded-xl bg-soft p-2.5 text-[13px]">
                    <p className="font-semibold text-navy">{a.time} · {a.type}</p>
                    <p className="text-ink/70">{a.name}</p>
                    {a.chair && <p className="text-[12px] text-muted">{a.chair}</p>}
                    {!a.sample && (
                      <button type="button" onClick={() => { removeAppointment(a.id); setItems(loadAppointments()); onToast("Afspraak verwijderd"); }} className="mt-1 inline-flex items-center gap-1 text-[12px] text-muted hover:text-[#b4432f]">
                        <Trash2 className="h-3 w-3" aria-hidden="true" /> Verwijderen
                      </button>
                    )}
                  </li>
                ))}
                {!list.length && <li className="text-[12px] text-muted/70">—</li>}
              </ul>
            </section>
          );
        })}
      </div>
      {adding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/30 p-4" onClick={() => setAdding(false)}>
          <form role="dialog" aria-modal="true" aria-labelledby="add-title" onSubmit={submit} onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-[24px] bg-white p-6 shadow-2xl">
            <h2 id="add-title" className="font-display text-[20px] font-bold text-navy">Bevestigde afspraak toevoegen</h2>
            <div className="mt-5 grid grid-cols-2 gap-3 text-[14px]">
              <label className="col-span-2">Naam patiënt<input name="name" required className="mt-1 w-full rounded-xl border border-line p-2.5" autoFocus /></label>
              <label>Datum<input name="date" type="date" required defaultValue={today} className="mt-1 w-full rounded-xl border border-line p-2.5" /></label>
              <label>Tijd<input name="time" type="time" required defaultValue="09:00" className="mt-1 w-full rounded-xl border border-line p-2.5" /></label>
              <label className="col-span-2">Soort afspraak<input name="type" required placeholder="Bijv. controle" className="mt-1 w-full rounded-xl border border-line p-2.5" /></label>
              <label className="col-span-2">Stoel / kamer (optioneel)<input name="chair" className="mt-1 w-full rounded-xl border border-line p-2.5" /></label>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setAdding(false)} className="btn btn-ghost !min-h-11">Annuleren</button>
              <button type="submit" className="btn btn-primary !min-h-11">Opslaan</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

/* ---------------- Inhoud ---------------- */
const DAYS = ["Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag", "Zondag"];
function Content({ onToast }: { onToast: (s: string) => void }) {
  const [tab, setTab] = useState<"behandelingen" | "faq" | "openingstijden" | "contact" | "fotos">("behandelingen");
  const [tr, setTr] = useState(() => treatments.map((t) => ({ slug: t.slug, title: t.title, short: t.short })));
  const [faq, setFaq] = useState(generalFaq);
  const [hours, setHours] = useState<string[]>(DAYS.map(() => ""));
  const [photos, setPhotos] = useState<string[]>([]);
  useEffect(() => {
    setTr(loadContent("treatments", treatments.map((t) => ({ slug: t.slug, title: t.title, short: t.short }))));
    setFaq(loadContent("faq", generalFaq));
    setHours(loadContent("hours", DAYS.map(() => "")));
  }, []);
  const save = (k: string, v: unknown) => {
    saveContent(k, v);
    onToast("Opgeslagen in de demo — in productie na controle gepubliceerd");
  };
  const tabs = [
    ["behandelingen", "Behandelingen"],
    ["faq", "Veelgestelde vragen"],
    ["openingstijden", "Openingstijden"],
    ["contact", "Contactgegevens"],
    ["fotos", "Foto's"],
  ] as const;
  const input = "mt-1 w-full rounded-xl border border-line bg-white p-2.5 text-[14px] outline-none focus:border-blue";
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2" role="tablist">
        {tabs.map(([id, l]) => (
          <button key={id} role="tab" aria-selected={tab === id} type="button" onClick={() => setTab(id)} className="rounded-full border border-line bg-white px-4 py-2 text-[13px] font-semibold text-ink/75 aria-selected:border-navy aria-selected:bg-navy aria-selected:text-white">
            {l}
          </button>
        ))}
      </div>
      <div className="rounded-[22px] border border-line bg-white p-5 md:p-7">
        {tab === "behandelingen" && (
          <div className="space-y-4">
            {tr.map((t, i) => (
              <div key={t.slug} className="grid gap-3 border-b border-line pb-4 md:grid-cols-[220px_1fr]">
                <label className="text-[13px] font-semibold text-navy">Titel<input className={input} value={t.title} onChange={(e) => setTr(tr.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))} /></label>
                <label className="text-[13px] font-semibold text-navy">Korte omschrijving<textarea rows={2} className={input} value={t.short} onChange={(e) => setTr(tr.map((x, j) => (j === i ? { ...x, short: e.target.value } : x)))} /></label>
              </div>
            ))}
            <button type="button" onClick={() => save("treatments", tr)} className="btn btn-primary">Wijzigingen opslaan</button>
          </div>
        )}
        {tab === "faq" && (
          <div className="space-y-4">
            {faq.map((f, i) => (
              <div key={i} className="grid gap-2 border-b border-line pb-4">
                <label className="text-[13px] font-semibold text-navy">Vraag<input className={input} value={f.q} onChange={(e) => setFaq(faq.map((x, j) => (j === i ? { ...x, q: e.target.value } : x)))} /></label>
                <label className="text-[13px] font-semibold text-navy">Antwoord<textarea rows={3} className={input} value={f.a} onChange={(e) => setFaq(faq.map((x, j) => (j === i ? { ...x, a: e.target.value } : x)))} /></label>
              </div>
            ))}
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => setFaq([...faq, { q: "", a: "" }])} className="btn btn-ghost"><Plus className="h-4 w-4" aria-hidden="true" /> Vraag toevoegen</button>
              <button type="button" onClick={() => save("faq", faq)} className="btn btn-primary">Wijzigingen opslaan</button>
            </div>
          </div>
        )}
        {tab === "openingstijden" && (
          <div className="space-y-3">
            <p className="tbc">Nog te bevestigen door de praktijk — op de website staat nu “neem telefonisch contact op”</p>
            {DAYS.map((d, i) => (
              <label key={d} className="grid grid-cols-[120px_1fr] items-center gap-3 text-[14px] font-semibold text-navy">
                {d}
                <input className={input} placeholder="bijv. 08:00 – 17:00 of Gesloten" value={hours[i]} onChange={(e) => setHours(hours.map((h, j) => (j === i ? e.target.value : h)))} />
              </label>
            ))}
            <button type="button" onClick={() => save("hours", hours)} className="btn btn-primary">Openingstijden opslaan</button>
          </div>
        )}
        {tab === "contact" && (
          <dl className="grid gap-4 text-[14px] md:grid-cols-2">
            {[
              ["Telefoon", clinic.phone.display],
              ["WhatsApp", clinic.whatsapp.display],
              ["Adres", `${clinic.address.street}, ${clinic.address.city}`],
              ["E-mail voor patiënten", clinic.email.value ?? "Nog te bevestigen"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-2xl bg-soft p-4">
                <dt className="text-muted">{k}</dt>
                <dd className="mt-1 font-semibold text-navy">{v}</dd>
              </div>
            ))}
            <p className="text-[13px] text-muted md:col-span-2">Contactgegevens worden centraal beheerd zodat ze overal op de website gelijk blijven (NAP-consistentie voor Google).</p>
          </dl>
        )}
        {tab === "fotos" && (
          <div>
            <p className="text-[14px] text-ink/75">Upload foto&apos;s van de praktijk en het team (alleen met toestemming van de personen op de foto). In de demo blijven ze in deze browser.</p>
            <label className="btn btn-ghost mt-4 cursor-pointer">
              <Plus className="h-4 w-4" aria-hidden="true" /> Foto&apos;s kiezen
              <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => setPhotos([...photos, ...Array.from(e.target.files ?? []).map((f) => URL.createObjectURL(f))])} />
            </label>
            <ul className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
              {photos.map((p) => (
                // eslint-disable-next-line @next/next/no-img-element
                <li key={p}><img src={p} alt="Geüploade foto (voorbeeld)" className="aspect-[4/3] w-full rounded-xl object-cover" /></li>
              ))}
              {!photos.length && <li className="col-span-full rounded-2xl border border-dashed border-line p-8 text-center text-[14px] text-muted">Nog geen foto&apos;s</li>}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- Statistieken ---------------- */
function Stats({ requests }: { requests: ContactRequest[] }) {
  const [ev, setEv] = useState<Record<string, Partial<Record<EventName, number>>>>({});
  useEffect(() => setEv(readEvents()), []);
  const sum = (n: EventName) => Object.values(ev).reduce((a, d) => a + (d[n] ?? 0), 0);
  const pv = sum("pageview");
  const forms = sum("form_submit");
  const cards = [
    { l: "Paginaweergaven", v: pv },
    { l: "Klikken op bellen", v: sum("click_phone") },
    { l: "Klikken op WhatsApp", v: sum("click_whatsapp") },
    { l: "Verzonden formulieren", v: forms },
  ];
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const k = d.toISOString().slice(0, 10);
    const e = ev[k] ?? {};
    return { label: d.toLocaleDateString("nl-NL", { weekday: "short" }), contact: (e.click_phone ?? 0) + (e.click_whatsapp ?? 0) + (e.form_submit ?? 0) };
  });
  const max = Math.max(1, ...days.map((d) => d.contact));
  return (
    <div className="space-y-6">
      <p className="rounded-2xl border border-dashed border-blue-soft bg-soft p-4 text-[14px] leading-relaxed text-blue">
        <strong>Gemeten in deze browser (demo).</strong> Bezoek de website en klik op bellen of WhatsApp om de tellers te zien veranderen. In productie komen deze cijfers uit een privacyvriendelijke, cookievrije statistiekdienst — zonder persoonsgegevens.
      </p>
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <li key={c.l} className="rounded-[22px] border border-line bg-white p-5">
            <p className="text-[13px] font-medium text-muted">{c.l}</p>
            <p className="mt-2 font-display text-[36px] font-extrabold leading-none text-navy">{c.v}</p>
          </li>
        ))}
      </ul>
      <div className="grid gap-6 xl:grid-cols-3">
        <section className="rounded-[22px] border border-line bg-white p-6 xl:col-span-2" aria-labelledby="contacts-chart">
          <h2 id="contacts-chart" className="font-display text-[17px] font-bold text-navy">Contactmomenten per dag (bellen + WhatsApp + formulier)</h2>
          <div className="mt-6 flex h-44 items-end gap-3">
            {days.map((d, i) => (
              <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <span className="text-[12px] font-semibold text-navy">{d.contact}</span>
                <div className="w-full max-w-12 rounded-t-xl bg-[linear-gradient(180deg,var(--cdc-blue-soft),var(--cdc-blue))]" style={{ height: `${(d.contact / max) * 100}%`, minHeight: d.contact ? 8 : 2, opacity: d.contact ? 1 : 0.25 }} />
                <span className="text-[12px] text-muted">{d.label}</span>
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-[22px] border border-line bg-white p-6" aria-labelledby="conv">
          <h2 id="conv" className="font-display text-[17px] font-bold text-navy">Conversie formulier</h2>
          <p className="mt-4 font-display text-[44px] font-extrabold text-green-ink">{pv ? ((forms / pv) * 100).toFixed(1) : "0.0"}%</p>
          <p className="text-[13px] text-muted">verzonden formulieren / paginaweergaven</p>
          <p className="mt-6 text-[13px] text-muted">Aanvragen in de lijst (incl. voorbeelden): {requests.length}</p>
        </section>
      </div>
    </div>
  );
}

/* ---------------- Instellingen ---------------- */
function SettingsView({ onReset }: { onReset: () => void }) {
  const items = pendingItems();
  const [email, setEmail] = useState("");
  useEffect(() => setEmail(loadContent("notifyEmail", "")), []);
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <section className="rounded-[22px] border border-line bg-white p-6" aria-labelledby="s-praktijk">
        <h2 id="s-praktijk" className="font-display text-[17px] font-bold text-navy">Praktijkgegevens</h2>
        <div className="mt-5 flex items-center gap-4 rounded-2xl bg-soft p-4">
          <Logo />
          <span className="tbc ml-auto">Origineel logobestand volgt</span>
        </div>
        <dl className="mt-5 grid grid-cols-[140px_1fr] gap-y-3 text-[14px]">
          <dt className="text-muted">Naam</dt><dd className="font-semibold text-navy">{clinic.name}</dd>
          <dt className="text-muted">Adres</dt><dd>{clinic.address.street}, {clinic.address.city}, {clinic.address.island}</dd>
          <dt className="text-muted">Telefoon</dt><dd>{clinic.phone.display}</dd>
          <dt className="text-muted">WhatsApp</dt><dd>{clinic.whatsapp.display}</dd>
        </dl>
        <form className="mt-6" onSubmit={(e) => { e.preventDefault(); saveContent("notifyEmail", email); }}>
          <label className="text-[14px] font-semibold text-navy">
            E-mail voor meldingen van nieuwe aanvragen
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nog te bevestigen" className="mt-2 w-full rounded-xl border border-line p-2.5 text-[14px] outline-none focus:border-blue" />
          </label>
          <p className="mt-1 text-[12px] text-muted">In de demo worden geen e-mails verstuurd.</p>
          <button type="submit" className="btn btn-primary mt-3 !min-h-11 !text-[14px]">Opslaan</button>
        </form>
      </section>
      <section className="rounded-[22px] border border-line bg-white p-6" aria-labelledby="s-todo">
        <h2 id="s-todo" className="font-display text-[17px] font-bold text-navy">Nog te bevestigen door de praktijk</h2>
        <ul className="mt-4 space-y-2">
          {items.map((i) => (
            <li key={i.key} className="flex gap-3 rounded-xl bg-soft p-3 text-[14px]">
              <span aria-hidden="true" className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-soft" />
              <span>{i.note}</span>
            </li>
          ))}
        </ul>
      </section>
      <section className="rounded-[22px] border border-line bg-white p-6 xl:col-span-2" aria-labelledby="s-sec">
        <h2 id="s-sec" className="font-display text-[17px] font-bold text-navy">Beveiliging en gegevens</h2>
        <ul className="mt-4 grid gap-3 text-[14px] text-ink/80 md:grid-cols-3">
          <li className="rounded-xl bg-soft p-4">Persoonlijke accounts voor personeel, toegang gecontroleerd op de server.</li>
          <li className="rounded-xl bg-soft p-4">Aanvragen opgeslagen in een beveiligde database, nooit in de publieke website.</li>
          <li className="rounded-xl bg-soft p-4">Geen medische gegevens via het webformulier.</li>
        </ul>
        <button type="button" onClick={onReset} className="btn btn-ghost mt-6 !min-h-11 !text-[14px]"><RotateCcw className="h-4 w-4" aria-hidden="true" /> Demo terugzetten</button>
      </section>
    </div>
  );
}
