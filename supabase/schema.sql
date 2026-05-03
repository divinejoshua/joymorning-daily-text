create table if not exists public.daily_text_subscribers (
  id uuid primary key default gen_random_uuid(),
  phone_number text not null,
  country_code text not null,
  country_name text not null,
  country_calling_code text not null,
  timezone text not null,
  delivery_hour integer not null default 7 check (delivery_hour between 0 and 23),
  sample_message text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (phone_number, country_code)
);

create index if not exists daily_text_subscribers_delivery_idx
  on public.daily_text_subscribers (active, timezone, delivery_hour);
