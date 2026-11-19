/**
 * Cloudflare Pages Function — POST /api/request
 * Riceve il modulo contatti, verifica antispam (honeypot lato client + Turnstile + tempo minimo),
 * valida i campi, salva in Supabase con la service role key (solo lato server) e invia una notifica.
 * Variabili d'ambiente (Cloudflare → Settings → Environment variables, cifrate):
 *   TURNSTILE_SECRET_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, NOTIFY_EMAIL, RESEND_API_KEY
 */
import { validate, type RequestInput } from "../../lib/requests";

type Env = { TURNSTILE_SECRET_KEY: string; SUPABASE_URL: string; SUPABASE_SERVICE_ROLE_KEY: string; NOTIFY_EMAIL?: string; RESEND_API_KEY?: string };
type Ctx = { request: Request; env: Env };

const json = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

export async function onRequestPost({ request, env }: Ctx) {
  let body: RequestInput & { turnstileToken?: string; startedAt?: number };
  try {
    body = await request.json();
  } catch {
    return json(400, { error: "invalid" });
  }
  if (!body.startedAt || Date.now() - body.startedAt < 2500) return json(400, { error: "too_fast" });
  if (Object.keys(validate(body)).length) return json(422, { error: "validation" });

  // Turnstile (antispam)
  const ip = request.headers.get("CF-Connecting-IP") ?? "";
  const ts = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: body.turnstileToken ?? "", remoteip: ip }),
  }).then((r) => r.json() as Promise<{ success: boolean }>);
  if (!ts.success) return json(403, { error: "spam" });

  const row = {
    name: body.name.trim().slice(0, 80),
    phone: body.phone.trim().slice(0, 20),
    email: body.email?.trim().slice(0, 120) || null,
    preferred_moment: body.preferredMoment?.slice(0, 40) || null,
    subject: body.subject,
  };
  const ins = await fetch(`${env.SUPABASE_URL}/rest/v1/contact_requests`, {
    method: "POST",
    headers: { apikey: env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`, "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify(row),
  });
  if (!ins.ok) return json(500, { error: "store" });

  // Notifica allo studio: nessun dato personale nell'oggetto; il dettaglio si legge nella dashboard.
  if (env.RESEND_API_KEY && env.NOTIFY_EMAIL) {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: "website@DOMINIO", to: env.NOTIFY_EMAIL, subject: "Nieuwe contactaanvraag via de website", text: "Er is een nieuwe aanvraag binnengekomen. Bekijk deze in de beheeromgeving." }),
    }).catch(() => {});
  }
  return json(200, { ok: true });
}
