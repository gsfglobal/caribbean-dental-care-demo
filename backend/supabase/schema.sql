-- Caribbean Dental Care — database per la versione di produzione (Supabase / Postgres)
-- Le richieste NON sono mai leggibili dal sito pubblico: solo staff autenticato (RLS).

create table if not exists public.staff (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null default 'staff' check (role in ('staff','admin')),
  created_at timestamptz not null default now()
);

create type public.request_status as enum ('nieuw','in_behandeling','contact_opgenomen','afgerond');

create table if not exists public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 2 and 80),
  phone text not null check (char_length(phone) between 7 and 20),
  email text,
  preferred_moment text,
  subject text not null,
  status public.request_status not null default 'nieuw',
  notes text not null default '',          -- solo note amministrative, niente dati clinici
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

create table if not exists public.appointments (     -- agenda amministrativa (confermate a mano)
  id uuid primary key default gen_random_uuid(),
  starts_at timestamptz not null,
  patient_name text not null,
  kind text not null,
  chair text,
  request_id uuid references public.contact_requests(id) on delete set null,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.site_content (     -- testi/FAQ/orari modificabili dalla dashboard
  key text primary key,
  value jsonb not null,
  published boolean not null default false,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

alter table public.staff enable row level security;
alter table public.contact_requests enable row level security;
alter table public.appointments enable row level security;
alter table public.site_content enable row level security;

create or replace function public.is_staff() returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.staff where user_id = auth.uid());
$$;

-- Solo lo staff legge e aggiorna. Gli INSERT del modulo arrivano dalla funzione server con service role.
create policy "staff read requests" on public.contact_requests for select using (public.is_staff());
create policy "staff update requests" on public.contact_requests for update using (public.is_staff());
create policy "staff all appointments" on public.appointments for all using (public.is_staff()) with check (public.is_staff());
create policy "staff all content" on public.site_content for all using (public.is_staff()) with check (public.is_staff());
create policy "public read published content" on public.site_content for select using (published);
create policy "staff read self" on public.staff for select using (user_id = auth.uid());
