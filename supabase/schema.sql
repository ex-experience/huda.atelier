-- ATELIER HUDA · Supabase schema V7
-- Run in the SQL editor of the Atelier Huda project.

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text, phone text, email text, city text, notes text,
  created_at timestamptz default now()
);

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  client_id uuid,
  name text, phone text, email text, topic text, message text, answer text,
  source text default 'site', ref text, session_id text, page text,
  created_at timestamptz default now()
);

create table if not exists public.client_log (
  id uuid primary key default gen_random_uuid(),
  client_id uuid, kind text, payload jsonb,
  created_at timestamptz default now()
);

create table if not exists public.preorders (
  id uuid primary key default gen_random_uuid(),
  ref text, items jsonb, total numeric, page text, guidance text,
  session_id text, source text default 'preorder',
  name text, phone text, email text, city text,
  privilege_percent integer default 10,
  privilege_expires timestamptz,
  created_at timestamptz default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  ref text, service_slug text, occasion text, city text, date_pref text,
  privacy text default 'silent', name text, phone text, email text,
  message text, status text default 'requested',
  session_id text, created_at timestamptz default now()
);

create table if not exists public.visits (
  id uuid primary key default gen_random_uuid(),
  path text, referrer text, ua text, session_id text,
  created_at timestamptz default now()
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id text, role text, content text,
  created_at timestamptz default now()
);

alter table public.clients enable row level security;
alter table public.inquiries enable row level security;
alter table public.client_log enable row level security;
alter table public.preorders enable row level security;
alter table public.bookings enable row level security;
alter table public.visits enable row level security;
alter table public.chat_messages enable row level security;

do $$ begin create policy "anon insert clients" on public.clients for insert to anon with check (true);
exception when duplicate_object then null; end $$;
do $$ begin create policy "anon insert inquiries" on public.inquiries for insert to anon with check (true);
exception when duplicate_object then null; end $$;
do $$ begin create policy "anon insert log" on public.client_log for insert to anon with check (true);
exception when duplicate_object then null; end $$;
do $$ begin create policy "anon insert preorders" on public.preorders for insert to anon with check (true);
exception when duplicate_object then null; end $$;
do $$ begin create policy "anon insert bookings" on public.bookings for insert to anon with check (true);
exception when duplicate_object then null; end $$;
do $$ begin create policy "anon insert visits" on public.visits for insert to anon with check (true);
exception when duplicate_object then null; end $$;
do $$ begin create policy "anon insert chat" on public.chat_messages for insert to anon with check (true);
exception when duplicate_object then null; end $$;

alter table public.preorders add column if not exists privilege_percent integer default 10;
alter table public.preorders add column if not exists privilege_expires timestamptz;
alter table public.preorders add column if not exists name text;
alter table public.preorders add column if not exists phone text;
alter table public.preorders add column if not exists email text;
alter table public.preorders add column if not exists city text;
alter table public.inquiries add column if not exists answer text;
