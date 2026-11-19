# Caribbean Dental Care — nuovo sito (demo commerciale)

Sito in olandese per Caribbean Dental Care, Kaya Korona 18, Kralendijk (Bonaire), con dashboard per lo staff.
Progetto autonomo: il progetto Longobardi non è stato toccato (ne riprende stack e architettura, non palette né contenuti).

## Avvio
```bash
npm install
npm run dev              # http://localhost:3000
npm run build            # sito statico in /out (Next.js static export)
npm run build:preview    # anteprima a pagina singola (hash routing) in /preview-dist → artifact privato
npm run typecheck && npm run lint
python3 tests/e2e.py http://localhost:4321   # dopo: cd out && python3 -m http.server 4321
```

## Stack
Next.js 15 (App Router, static export) · React 19 · TypeScript · Tailwind 4 · Three.js + React Three Fiber + Drei · Lucide.
Il dente 3D è procedurale (SDF → marching cubes, `components/three/tooth.ts`): 0 KB di modelli da scaricare. Caricamento lazy, frameloop in pausa fuori schermo, fallback SVG senza WebGL, supporto `prefers-reduced-motion`, risoluzione ridotta su mobile.

## Struttura
- `lib/site.ts` — **configurazione centrale** (NAP, link WhatsApp precompilato, campi `da confermare`)
- `lib/treatments.ts` — 11 trattamenti confermati (testi NL prudenti) · `lib/content.ts` — FAQ, valori, percorso
- `app/(site)/*` — 5 pagine + 11 pagine trattamento + privacy/cookie · `app/admin` — dashboard
- `components/pages/*` — pagine (condivise con l'anteprima) · `components/home/Hero.tsx` + `components/three/*` — hero 3D
- `components/admin/AdminApp.tsx` — Overzicht, Aanvragen, Agenda, Inhoud, Statistieken, Instellingen
- `lib/requests.ts` — modulo: validazione condivisa, honeypot, tempo minimo; adapter server/demo
- `lib/analytics.ts` — conteggio senza cookie di pageview, clic telefono/WhatsApp, invii modulo
- `backend/supabase/schema.sql` — tabelle + Row Level Security · `functions/api/request.ts` — Cloudflare Pages Function del modulo (Turnstile, Supabase, notifica email)
- `research/sources.md` — fonti verificate · `CLIENT_TODO.md` — dati che il cliente deve confermare

## Modalità demo vs produzione
Senza `NEXT_PUBLIC_FORM_ENDPOINT` il sito è in **modalità demo**: `noindex`, robots `Disallow: /`, niente schema.org, il modulo salva la richiesta **solo nel browser** e lo dichiara; la dashboard usa dati fittizi etichettati e un accesso dimostrativo senza password (dichiarato a schermo).

## Messa in produzione (Cloudflare Pages + Supabase, consigliato)
1. Supabase: nuovo progetto (regione EU o US-East), eseguire `backend/supabase/schema.sql`, creare gli account staff (Auth → Users) e inserirli in `public.staff`.
2. Cloudflare Turnstile: creare il widget per il dominio; aggiungere il widget al `ContactForm` (token in `submitRequest`).
3. Cloudflare Pages: build `npm run build`, output `out`, cartella `functions/` inclusa. Variabili: `NEXT_PUBLIC_FORM_ENDPOINT=/api/request`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`; segrete: `TURNSTILE_SECRET_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `NOTIFY_EMAIL`, `RESEND_API_KEY`. Nessuna chiave nel frontend.
4. Dashboard reale: sostituire `lib/admin-demo.ts` con chiamate Supabase (client con chiave anon + login staff; RLS fa i controlli lato server) e proteggere `/admin` con Cloudflare Access come secondo livello.
5. Statistiche: Cloudflare Web Analytics o Plausible (cookieless); `track()` inoltra già a `window.plausible`.
6. Logo: copiare il file originale in `public/media/logo.png` (+ `logo-white.png`) e impostare `LOGO_FILE_READY = true` in `components/ui/Logo.tsx`.
7. Rivedere privacy/cookie (concept, riferimento: Wet bescherming persoonsgegevens BES).

## Test eseguiti (19/11/2026)
typecheck OK · ESLint 0 errori/warning · `next build` OK (25 pagine statiche) · e2e: 390/768/1440 px senza scroll orizzontale su 8 pagine, 0 errori console, link `tel:+5997178106`, link WhatsApp con messaggio codificato correttamente, un solo H1, validazione modulo, conferma che non promette l'appuntamento, richiesta visibile in dashboard, cambio stato salvato · anteprima hash-routing verificata (navigazione, pagine trattamento, dashboard).
