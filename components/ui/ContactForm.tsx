"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Info, Loader2 } from "lucide-react";
import { moments, submitRequest, subjects, validate, type RequestInput } from "@/lib/requests";
import { track } from "@/lib/analytics";
import { clinic, tel } from "@/lib/site";

type Errors = Partial<Record<keyof RequestInput | "consent", string>>;

export function ContactForm({ defaultSubject }: { defaultSubject?: string }) {
  const [state, setState] = useState<"idle" | "sending" | "done-server" | "done-demo">("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const startedAt = useRef(0);
  const resultRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  useEffect(() => {
    if (state.startsWith("done")) resultRef.current?.focus();
  }, [state]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const input: RequestInput = {
      name: String(fd.get("name") || ""),
      phone: String(fd.get("phone") || ""),
      email: String(fd.get("email") || ""),
      preferredMoment: String(fd.get("moment") || ""),
      subject: String(fd.get("subject") || ""),
    };
    const errs: Errors = validate(input);
    if (!fd.get("consent")) errs.consent = "Geef toestemming zodat de praktijk contact met u kan opnemen.";
    setErrors(errs);
    setFormError("");
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0];
      (e.currentTarget.elements.namedItem(first === "moment" ? "moment" : first) as HTMLElement | null)?.focus();
      return;
    }
    setState("sending");
    const res = await submitRequest(input, { honeypot: String(fd.get("website") || ""), startedAt: startedAt.current });
    if (!res.ok) {
      setFormError(res.error);
      setState("idle");
      return;
    }
    track("form_submit");
    setState(res.mode === "server" ? "done-server" : "done-demo");
  }

  if (state === "done-server" || state === "done-demo") {
    return (
      <div ref={resultRef} tabIndex={-1} role="status" className="card p-7 outline-none md:p-10">
        <CheckCircle2 className="h-10 w-10 text-green-ink" aria-hidden="true" />
        <h3 className="h-md mt-5">Bedankt, uw aanvraag is verzonden.</h3>
        <p className="body mt-3">
          De praktijk neemt zo snel mogelijk contact met u op om samen een moment te kiezen. <strong className="text-navy">Let op: uw afspraak is pas bevestigd wanneer de praktijk dit met u heeft afgesproken.</strong>
        </p>
        <p className="body mt-3">
          Heeft u pijn of is het dringend? Bel dan rechtstreeks{" "}
          <a href={tel} className="font-semibold text-navy underline underline-offset-4">
            {clinic.phone.display}
          </a>
          .
        </p>
        {state === "done-demo" && (
          <p className="mt-5 flex gap-2 rounded-2xl border border-dashed border-blue-soft bg-soft p-4 text-[14px] leading-relaxed text-blue">
            <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>
              <strong>Demoversie:</strong> dit formulier is nog niet gekoppeld aan de praktijk. Uw gegevens zijn niet verzonden en alleen in deze browser bewaard, zodat u de aanvraag kunt terugzien in de demo-omgeving voor personeel.
            </span>
          </p>
        )}
        <button type="button" className="btn btn-ghost mt-6" onClick={() => { setState("idle"); startedAt.current = Date.now(); }}>
          Nieuwe aanvraag
        </button>
      </div>
    );
  }

  const field = "mt-2 block w-full rounded-2xl border border-line bg-white px-4 py-3.5 text-[16px] text-ink outline-none transition placeholder:text-muted/70 focus:border-blue focus:ring-4 focus:ring-blue-soft/25 aria-[invalid=true]:border-[#b4432f]";
  const label = "text-[14px] font-semibold text-navy";
  const err = (k: keyof Errors) =>
    errors[k] ? (
      <p id={`${k}-error`} className="mt-2 text-[13px] font-medium text-[#b4432f]">
        {errors[k]}
      </p>
    ) : null;

  return (
    <form onSubmit={onSubmit} noValidate className="card relative p-6 md:p-9" aria-describedby="form-note">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="name" className={label}>
            Naam
          </label>
          <input id="name" name="name" autoComplete="name" required aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} className={field} />
          {err("name")}
        </div>
        <div>
          <label htmlFor="phone" className={label}>
            Telefoonnummer
          </label>
          <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" required placeholder="+599 …" aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "phone-error" : undefined} className={field} />
          {err("phone")}
        </div>
        <div>
          <label htmlFor="email" className={label}>
            E-mailadres <span className="font-normal text-muted">(optioneel)</span>
          </label>
          <input id="email" name="email" type="email" autoComplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} className={field} />
          {err("email")}
        </div>
        <div>
          <label htmlFor="moment" className={label}>
            Gewenst contactmoment <span className="font-normal text-muted">(optioneel)</span>
          </label>
          <select id="moment" name="moment" className={field} defaultValue="">
            <option value="">Maak een keuze</option>
            {moments.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label htmlFor="subject" className={label}>
            Onderwerp
          </label>
          <select id="subject" name="subject" required defaultValue={defaultSubject ?? ""} aria-invalid={!!errors.subject} aria-describedby={errors.subject ? "subject-error" : undefined} className={field}>
            <option value="" disabled>
              Waar kunnen we u mee helpen?
            </option>
            {subjects.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          {err("subject")}
        </div>
      </div>

      {/* Honeypot tegen spam: onzichtbaar voor bezoekers */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-6">
        <label className="flex items-start gap-3 text-[14px] leading-relaxed text-ink/80">
          <input type="checkbox" name="consent" className="mt-1 h-5 w-5 shrink-0 accent-[var(--cdc-green-ink)]" aria-invalid={!!errors.consent} aria-describedby={errors.consent ? "consent-error" : undefined} />
          <span>
            Ik ga ermee akkoord dat Caribbean Dental Care mijn gegevens gebruikt om contact met mij op te nemen over deze aanvraag. Lees de{" "}
            <Link href="/privacy/" className="font-semibold text-navy underline underline-offset-4">
              privacyverklaring
            </Link>
            .
          </span>
        </label>
        {err("consent")}
      </div>

      <p id="form-note" className="mt-5 flex gap-2 rounded-2xl bg-soft p-4 text-[14px] leading-relaxed text-ink/75">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue" aria-hidden="true" />
        Vermeld hier geen medische gegevens. Die bespreekt u veilig met de praktijk zelf. Een aanvraag is nog geen bevestigde afspraak.
      </p>

      {formError && (
        <p role="alert" className="mt-4 rounded-2xl border border-[#b4432f]/30 bg-[#b4432f]/5 p-4 text-[14px] font-medium text-[#8e3424]">
          {formError}
        </p>
      )}

      <button type="submit" disabled={state === "sending"} className="btn btn-primary mt-6 w-full !min-h-14 md:w-auto">
        {state === "sending" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Bezig met verzenden…
          </>
        ) : (
          "Verstuur aanvraag"
        )}
      </button>
    </form>
  );
}
