create extension if not exists pgcrypto;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  category text,
  price integer not null,
  badge text,
  seo_title text,
  meta_description text,
  wa_template text,
  image_url text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  is_featured boolean not null default false,
  short_description text,
  description text,
  features text[] not null default '{}'::text[],
  colors text[] not null default '{}'::text[],
  audiences text[] not null default '{}'::text[],
  gallery_urls text[] not null default '{}'::text[],
  specs jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.products
  add column if not exists wa_template text,
  add column if not exists features text[] not null default '{}'::text[],
  add column if not exists colors text[] not null default '{}'::text[],
  add column if not exists audiences text[] not null default '{}'::text[],
  add column if not exists gallery_urls text[] not null default '{}'::text[],
  add column if not exists specs jsonb not null default '[]'::jsonb;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'products'
      and column_name = 'whatsapp_message_template'
  ) then
    execute '
      update public.products
      set wa_template = coalesce(wa_template, whatsapp_message_template)
      where wa_template is null
    ';
  end if;
end $$;

do $$
declare
  current_type text;
begin
  select data_type
  into current_type
  from information_schema.columns
  where table_schema = 'public'
    and table_name = 'products'
    and column_name = 'price';

  if current_type is distinct from 'integer' then
    execute $sql$
      alter table public.products
      alter column price type integer
      using coalesce(
        nullif(regexp_replace(price::text, '[^0-9]', '', 'g'), ''),
        '0'
      )::integer
    $sql$;
  end if;
end $$;

alter table public.products
  alter column price set not null,
  alter column sort_order set default 0,
  alter column is_active set default true,
  alter column is_featured set default false,
  alter column specs set default '[]'::jsonb;

create or replace function public.set_products_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create index if not exists products_slug_idx
  on public.products(slug);

create index if not exists products_sort_order_idx
  on public.products(sort_order);

create index if not exists products_is_active_idx
  on public.products(is_active);

create index if not exists products_is_featured_idx
  on public.products(is_featured);

alter table public.products enable row level security;

drop policy if exists public_read_active_products on public.products;
create policy public_read_active_products
on public.products
for select
to public
using (is_active = true);

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at
before update on public.products
for each row execute function public.set_products_updated_at();
