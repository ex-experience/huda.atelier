-- Run in Supabase SQL editor
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  city text,
  notes text,
  created_at timestamptz default now()
);

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id),
  name text,
  phone text,
  email text,
  topic text,
  message text,
  source text default 'site',
  created_at timestamptz default now()
);

create table if not exists public.client_log (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id),
  kind text,
  payload jsonb,
  created_at timestamptz default now()
);

alter table public.clients enable row level security;
alter table public.inquiries enable row level security;
alter table public.client_log enable row level security;

create policy "anon insert clients" on public.clients for insert to anon with check (true);
create policy "anon insert inquiries" on public.inquiries for insert to anon with check (true);
create policy "anon insert log" on public.client_log for insert to anon with check (true);
