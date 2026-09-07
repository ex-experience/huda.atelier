create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text, phone text, email text, city text,
  created_at timestamptz default now()
);
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text, phone text, email text, topic text, message text,
  source text, ref text, session_id text, page text,
  created_at timestamptz default now()
);
create table if not exists public.preorders (
  id uuid primary key default gen_random_uuid(),
  ref text, items jsonb, total numeric, page text, guidance text,
  session_id text, source text default 'preorder',
  created_at timestamptz default now()
);
create table if not exists public.visits (
  id uuid primary key default gen_random_uuid(),
  path text, referrer text, ua text, session_id text,
  created_at timestamptz default now()
);
create table if not exists public.event_log (
  id uuid primary key default gen_random_uuid(),
  kind text, payload jsonb, session_id text,
  created_at timestamptz default now()
);
alter table public.clients enable row level security;
alter table public.inquiries enable row level security;
alter table public.preorders enable row level security;
alter table public.visits enable row level security;
alter table public.event_log enable row level security;
create policy "anon insert inquiries" on public.inquiries for insert to anon with check (char_length(coalesce(message,'')) < 4000);
create policy "anon insert preorders" on public.preorders for insert to anon with check (total is null or total < 100000);
create policy "anon insert visits" on public.visits for insert to anon with check (true);
create policy "anon insert events" on public.event_log for insert to anon with check (true);
