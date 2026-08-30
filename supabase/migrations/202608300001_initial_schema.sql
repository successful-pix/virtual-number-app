-- Virtual Number App initial schema
-- Run this migration in the NEW Supabase project only.

create extension if not exists pgcrypto;

create type public.user_role as enum ('user', 'admin');
create type public.number_status as enum ('available', 'reserved', 'active', 'expired', 'released');
create type public.rental_status as enum ('pending', 'active', 'expired', 'cancelled');
create type public.message_direction as enum ('inbound', 'outbound');
create type public.transaction_type as enum ('deposit', 'number_purchase', 'number_renewal', 'refund', 'adjustment');
create type public.transaction_status as enum ('pending', 'completed', 'failed', 'refunded');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  country_code text,
  role public.user_role not null default 'user',
  balance numeric(20,8) not null default 0 check (balance >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.countries (
  id uuid primary key default gen_random_uuid(),
  iso_code text not null unique check (length(iso_code) between 2 and 3),
  name text not null unique,
  dial_code text not null,
  enabled boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.providers (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  enabled boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.virtual_numbers (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid references public.providers(id) on delete set null,
  country_id uuid not null references public.countries(id),
  phone_number text not null unique,
  provider_number_id text,
  status public.number_status not null default 'available',
  monthly_price numeric(20,8) not null default 0 check (monthly_price >= 0),
  currency text not null default 'USD',
  capabilities jsonb not null default '{"sms":true}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.rentals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  number_id uuid not null references public.virtual_numbers(id) on delete restrict,
  status public.rental_status not null default 'pending',
  started_at timestamptz,
  expires_at timestamptz,
  cancelled_at timestamptz,
  price numeric(20,8) not null default 0 check (price >= 0),
  currency text not null default 'USD',
  provider_rental_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index rentals_one_active_per_number on public.rentals(number_id) where status in ('pending','active');

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  rental_id uuid not null references public.rentals(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  direction public.message_direction not null default 'inbound',
  sender text,
  recipient text,
  body text not null,
  provider_message_id text,
  received_at timestamptz not null default now(),
  read_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type public.transaction_type not null,
  status public.transaction_status not null default 'pending',
  amount numeric(20,8) not null check (amount >= 0),
  currency text not null default 'USD',
  reference text unique,
  rental_id uuid references public.rentals(id) on delete set null,
  description text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table public.payment_methods (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  provider text not null,
  provider_customer_id text,
  provider_payment_method_id text,
  type text not null,
  last4 text,
  brand text,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index virtual_numbers_country_status_idx on public.virtual_numbers(country_id, status);
create index rentals_user_status_idx on public.rentals(user_id, status);
create index messages_user_received_idx on public.messages(user_id, received_at desc);
create index transactions_user_created_idx on public.transactions(user_id, created_at desc);
create index audit_logs_created_idx on public.audit_logs(created_at desc);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger numbers_updated_at before update on public.virtual_numbers for each row execute function public.set_updated_at();
create trigger rentals_updated_at before update on public.rentals for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger language plpgsql security invoker set search_path = public as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (new.id, new.raw_user_meta_data ->> 'full_name', new.phone)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.countries enable row level security;
alter table public.providers enable row level security;
alter table public.virtual_numbers enable row level security;
alter table public.rentals enable row level security;
alter table public.messages enable row level security;
alter table public.transactions enable row level security;
alter table public.payment_methods enable row level security;
alter table public.audit_logs enable row level security;

create policy "profiles_select_own" on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "profiles_update_own" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create policy "countries_read_enabled" on public.countries for select to authenticated using (enabled = true);
create policy "providers_read_enabled" on public.providers for select to authenticated using (enabled = true);
create policy "numbers_read_available" on public.virtual_numbers for select to authenticated using (status = 'available' or exists (select 1 from public.rentals r where r.number_id = virtual_numbers.id and r.user_id = (select auth.uid())));

create policy "rentals_select_own" on public.rentals for select to authenticated using ((select auth.uid()) = user_id);
create policy "rentals_insert_own" on public.rentals for insert to authenticated with check ((select auth.uid()) = user_id);

create policy "messages_select_own" on public.messages for select to authenticated using ((select auth.uid()) = user_id);
create policy "messages_update_own" on public.messages for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "transactions_select_own" on public.transactions for select to authenticated using ((select auth.uid()) = user_id);
create policy "payment_methods_select_own" on public.payment_methods for select to authenticated using ((select auth.uid()) = user_id);
create policy "payment_methods_insert_own" on public.payment_methods for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "payment_methods_delete_own" on public.payment_methods for delete to authenticated using ((select auth.uid()) = user_id);

-- Administrative writes should be performed server-side using privileged, audited operations.
-- Do not expose service-role credentials to the browser.

insert into public.countries (iso_code, name, dial_code) values
  ('US', 'United States', '+1'),
  ('GB', 'United Kingdom', '+44'),
  ('CA', 'Canada', '+1'),
  ('AU', 'Australia', '+61'),
  ('DE', 'Germany', '+49'),
  ('FR', 'France', '+33'),
  ('NG', 'Nigeria', '+234')
on conflict (iso_code) do nothing;
