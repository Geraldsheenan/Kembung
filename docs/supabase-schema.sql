-- Kembung Supabase schema
-- Apply this file in Supabase SQL Editor or split it into migrations later.

create extension if not exists pgcrypto;

-- ============================================================================
-- Enum types
-- ============================================================================

do $$
begin
  if not exists (
    select 1 from pg_type where typname = 'navigation_location'
  ) then
    create type public.navigation_location as enum (
      'navbar',
      'footer_help',
      'footer_social'
    );
  end if;

  if not exists (
    select 1 from pg_type where typname = 'article_status'
  ) then
    create type public.article_status as enum ('draft', 'published');
  end if;

  if not exists (
    select 1 from pg_type where typname = 'device_type'
  ) then
    create type public.device_type as enum ('desktop', 'mobile');
  end if;

  if not exists (
    select 1 from pg_type where typname = 'newsletter_status'
  ) then
    create type public.newsletter_status as enum ('subscribed', 'unsubscribed');
  end if;

  if not exists (
    select 1 from pg_type where typname = 'contact_message_status'
  ) then
    create type public.contact_message_status as enum (
      'new',
      'read',
      'replied',
      'archived'
    );
  end if;
end $$;

-- ============================================================================
-- Helpers
-- ============================================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    or (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin',
    false
  );
$$;

-- ============================================================================
-- Core tables
-- ============================================================================

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  singleton_key boolean not null default true,
  site_name text not null,
  tagline text,
  description text,
  phone_display text,
  phone_international text,
  site_url text,
  instagram_url text,
  tiktok_url text,
  logo_url text,
  favicon_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint site_settings_singleton unique (singleton_key)
);

create table if not exists public.navigation_items (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  href text not null,
  location public.navigation_location not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.branches (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  area text not null,
  badge text,
  address text not null,
  short_address text,
  latitude numeric(10, 7),
  longitude numeric(10, 7),
  hours text,
  mobile_hours text,
  description text,
  amenity text,
  amenity_icon text,
  theme text,
  mobile_subtitle text,
  mobile_address_line text,
  mobile_status text,
  mobile_status_tone text,
  mobile_feature_icon text,
  map_url text,
  map_embed text,
  image_url text,
  image_class_name text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.branch_facilities (
  id uuid primary key default gen_random_uuid(),
  branch_id uuid not null references public.branches(id) on delete cascade,
  text text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.branch_gallery (
  id uuid primary key default gen_random_uuid(),
  branch_id uuid not null references public.branches(id) on delete cascade,
  image_url text not null,
  alt_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text not null,
  price text not null,
  short_description text,
  description text,
  image_url text,
  badge text,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  seo_title text,
  meta_description text,
  whatsapp_message_template text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.product_specs (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  label text not null,
  value text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.product_features (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  text text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.product_colors (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.product_audiences (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  text text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.product_gallery (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  image_url text not null,
  alt_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null,
  excerpt text,
  seo_title text,
  meta_description text,
  published_date date,
  read_time text,
  author text,
  author_role text,
  image_url text,
  image_alt text,
  intro text,
  quote text,
  canonical_url text,
  og_image_url text,
  status public.article_status not null default 'draft',
  is_featured boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.article_tags (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references public.articles(id) on delete cascade,
  tag text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.article_sections (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references public.articles(id) on delete cascade,
  heading text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.article_section_paragraphs (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.article_sections(id) on delete cascade,
  content text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.homepage_sections (
  id uuid primary key default gen_random_uuid(),
  section_key text not null unique,
  title text,
  subtitle text,
  description text,
  image_url text,
  primary_cta_label text,
  primary_cta_href text,
  secondary_cta_label text,
  secondary_cta_href text,
  extra_json jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.homepage_featured_products (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  device_type public.device_type not null,
  label text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.homepage_reason_items (
  id uuid primary key default gen_random_uuid(),
  device_type public.device_type not null,
  title text not null,
  description text,
  icon_key text,
  theme_key text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.about_page_sections (
  id uuid primary key default gen_random_uuid(),
  section_key text not null unique,
  eyebrow text,
  title text,
  description text,
  image_url text,
  quote_text text,
  extra_json jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.about_values (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  icon_key text,
  theme_key text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.contact_page_settings (
  id uuid primary key default gen_random_uuid(),
  singleton_key boolean not null default true,
  title text,
  description text,
  whatsapp_card_title text,
  whatsapp_card_description text,
  studio_label text,
  studio_address text,
  studio_map_image_url text,
  instagram_url text,
  tiktok_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint contact_page_settings_singleton unique (singleton_key)
);

create table if not exists public.newsletter_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text,
  status public.newsletter_status not null default 'subscribed',
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  source text,
  status public.contact_message_status not null default 'new',
  admin_note text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  bucket_name text not null,
  file_path text not null,
  public_url text not null,
  alt_text text,
  tag text,
  created_at timestamptz not null default timezone('utc', now())
);

-- ============================================================================
-- Indexes
-- ============================================================================

create index if not exists navigation_items_location_sort_idx
  on public.navigation_items(location, sort_order);

create index if not exists branches_active_sort_idx
  on public.branches(is_active, sort_order);

create index if not exists products_active_sort_idx
  on public.products(is_active, sort_order);

create index if not exists products_featured_sort_idx
  on public.products(is_featured, sort_order);

create index if not exists product_specs_product_sort_idx
  on public.product_specs(product_id, sort_order);

create index if not exists product_features_product_sort_idx
  on public.product_features(product_id, sort_order);

create index if not exists product_colors_product_sort_idx
  on public.product_colors(product_id, sort_order);

create index if not exists product_audiences_product_sort_idx
  on public.product_audiences(product_id, sort_order);

create index if not exists product_gallery_product_sort_idx
  on public.product_gallery(product_id, sort_order);

create index if not exists branch_facilities_branch_sort_idx
  on public.branch_facilities(branch_id, sort_order);

create index if not exists branch_gallery_branch_sort_idx
  on public.branch_gallery(branch_id, sort_order);

create index if not exists articles_status_featured_date_idx
  on public.articles(status, is_featured, published_date desc);

create index if not exists article_tags_article_sort_idx
  on public.article_tags(article_id, sort_order);

create index if not exists article_sections_article_sort_idx
  on public.article_sections(article_id, sort_order);

create index if not exists article_section_paragraphs_section_sort_idx
  on public.article_section_paragraphs(section_id, sort_order);

create index if not exists homepage_sections_active_idx
  on public.homepage_sections(is_active, section_key);

create index if not exists homepage_featured_products_device_sort_idx
  on public.homepage_featured_products(device_type, sort_order);

create index if not exists homepage_reason_items_device_sort_idx
  on public.homepage_reason_items(device_type, sort_order);

create index if not exists about_page_sections_active_sort_idx
  on public.about_page_sections(is_active, sort_order);

create index if not exists about_values_active_sort_idx
  on public.about_values(is_active, sort_order);

create index if not exists newsletter_signups_status_created_idx
  on public.newsletter_signups(status, created_at desc);

create index if not exists contact_messages_status_created_idx
  on public.contact_messages(status, created_at desc);

create unique index if not exists homepage_featured_products_unique_slot_idx
  on public.homepage_featured_products(device_type, sort_order);

create unique index if not exists media_assets_bucket_path_idx
  on public.media_assets(bucket_name, file_path);

-- ============================================================================
-- Triggers
-- ============================================================================

drop trigger if exists set_site_settings_updated_at on public.site_settings;
create trigger set_site_settings_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

drop trigger if exists set_navigation_items_updated_at on public.navigation_items;
create trigger set_navigation_items_updated_at
before update on public.navigation_items
for each row execute function public.set_updated_at();

drop trigger if exists set_branches_updated_at on public.branches;
create trigger set_branches_updated_at
before update on public.branches
for each row execute function public.set_updated_at();

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at
before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists set_articles_updated_at on public.articles;
create trigger set_articles_updated_at
before update on public.articles
for each row execute function public.set_updated_at();

drop trigger if exists set_homepage_sections_updated_at on public.homepage_sections;
create trigger set_homepage_sections_updated_at
before update on public.homepage_sections
for each row execute function public.set_updated_at();

drop trigger if exists set_homepage_reason_items_updated_at on public.homepage_reason_items;
create trigger set_homepage_reason_items_updated_at
before update on public.homepage_reason_items
for each row execute function public.set_updated_at();

drop trigger if exists set_about_page_sections_updated_at on public.about_page_sections;
create trigger set_about_page_sections_updated_at
before update on public.about_page_sections
for each row execute function public.set_updated_at();

drop trigger if exists set_about_values_updated_at on public.about_values;
create trigger set_about_values_updated_at
before update on public.about_values
for each row execute function public.set_updated_at();

drop trigger if exists set_contact_page_settings_updated_at on public.contact_page_settings;
create trigger set_contact_page_settings_updated_at
before update on public.contact_page_settings
for each row execute function public.set_updated_at();

-- ============================================================================
-- Row level security
-- ============================================================================

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'site_settings',
    'navigation_items',
    'branches',
    'branch_facilities',
    'branch_gallery',
    'products',
    'product_specs',
    'product_features',
    'product_colors',
    'product_audiences',
    'product_gallery',
    'articles',
    'article_tags',
    'article_sections',
    'article_section_paragraphs',
    'homepage_sections',
    'homepage_featured_products',
    'homepage_reason_items',
    'about_page_sections',
    'about_values',
    'contact_page_settings',
    'newsletter_signups',
    'contact_messages',
    'media_assets'
  ]
  loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('drop policy if exists admin_full_access on public.%I', table_name);
    execute format(
      'create policy admin_full_access on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())',
      table_name
    );
  end loop;
end $$;

-- Public read: global settings
drop policy if exists public_read_site_settings on public.site_settings;
create policy public_read_site_settings
on public.site_settings
for select
to public
using (true);

drop policy if exists public_read_navigation_items on public.navigation_items;
create policy public_read_navigation_items
on public.navigation_items
for select
to public
using (is_active = true);

drop policy if exists public_read_active_branches on public.branches;
create policy public_read_active_branches
on public.branches
for select
to public
using (is_active = true);

drop policy if exists public_read_branch_facilities on public.branch_facilities;
create policy public_read_branch_facilities
on public.branch_facilities
for select
to public
using (
  exists (
    select 1
    from public.branches
    where branches.id = branch_facilities.branch_id
      and branches.is_active = true
  )
);

drop policy if exists public_read_branch_gallery on public.branch_gallery;
create policy public_read_branch_gallery
on public.branch_gallery
for select
to public
using (
  exists (
    select 1
    from public.branches
    where branches.id = branch_gallery.branch_id
      and branches.is_active = true
  )
);

drop policy if exists public_read_active_products on public.products;
create policy public_read_active_products
on public.products
for select
to public
using (is_active = true);

drop policy if exists public_read_product_specs on public.product_specs;
create policy public_read_product_specs
on public.product_specs
for select
to public
using (
  exists (
    select 1
    from public.products
    where products.id = product_specs.product_id
      and products.is_active = true
  )
);

drop policy if exists public_read_product_features on public.product_features;
create policy public_read_product_features
on public.product_features
for select
to public
using (
  exists (
    select 1
    from public.products
    where products.id = product_features.product_id
      and products.is_active = true
  )
);

drop policy if exists public_read_product_colors on public.product_colors;
create policy public_read_product_colors
on public.product_colors
for select
to public
using (
  exists (
    select 1
    from public.products
    where products.id = product_colors.product_id
      and products.is_active = true
  )
);

drop policy if exists public_read_product_audiences on public.product_audiences;
create policy public_read_product_audiences
on public.product_audiences
for select
to public
using (
  exists (
    select 1
    from public.products
    where products.id = product_audiences.product_id
      and products.is_active = true
  )
);

drop policy if exists public_read_product_gallery on public.product_gallery;
create policy public_read_product_gallery
on public.product_gallery
for select
to public
using (
  exists (
    select 1
    from public.products
    where products.id = product_gallery.product_id
      and products.is_active = true
  )
);

drop policy if exists public_read_published_articles on public.articles;
create policy public_read_published_articles
on public.articles
for select
to public
using (status = 'published');

drop policy if exists public_read_article_tags on public.article_tags;
create policy public_read_article_tags
on public.article_tags
for select
to public
using (
  exists (
    select 1
    from public.articles
    where articles.id = article_tags.article_id
      and articles.status = 'published'
  )
);

drop policy if exists public_read_article_sections on public.article_sections;
create policy public_read_article_sections
on public.article_sections
for select
to public
using (
  exists (
    select 1
    from public.articles
    where articles.id = article_sections.article_id
      and articles.status = 'published'
  )
);

drop policy if exists public_read_article_section_paragraphs on public.article_section_paragraphs;
create policy public_read_article_section_paragraphs
on public.article_section_paragraphs
for select
to public
using (
  exists (
    select 1
    from public.article_sections
    join public.articles
      on articles.id = article_sections.article_id
    where article_sections.id = article_section_paragraphs.section_id
      and articles.status = 'published'
  )
);

drop policy if exists public_read_homepage_sections on public.homepage_sections;
create policy public_read_homepage_sections
on public.homepage_sections
for select
to public
using (is_active = true);

drop policy if exists public_read_homepage_featured_products on public.homepage_featured_products;
create policy public_read_homepage_featured_products
on public.homepage_featured_products
for select
to public
using (
  is_active = true
  and exists (
    select 1
    from public.products
    where products.id = homepage_featured_products.product_id
      and products.is_active = true
  )
);

drop policy if exists public_read_homepage_reason_items on public.homepage_reason_items;
create policy public_read_homepage_reason_items
on public.homepage_reason_items
for select
to public
using (is_active = true);

drop policy if exists public_read_about_page_sections on public.about_page_sections;
create policy public_read_about_page_sections
on public.about_page_sections
for select
to public
using (is_active = true);

drop policy if exists public_read_about_values on public.about_values;
create policy public_read_about_values
on public.about_values
for select
to public
using (is_active = true);

drop policy if exists public_read_contact_page_settings on public.contact_page_settings;
create policy public_read_contact_page_settings
on public.contact_page_settings
for select
to public
using (true);

-- Public insert: forms
drop policy if exists public_insert_newsletter_signups on public.newsletter_signups;
create policy public_insert_newsletter_signups
on public.newsletter_signups
for insert
to public
with check (
  email is not null
  and length(trim(email)) > 3
);

drop policy if exists public_insert_contact_messages on public.contact_messages;
create policy public_insert_contact_messages
on public.contact_messages
for insert
to public
with check (
  name is not null
  and email is not null
  and message is not null
  and length(trim(name)) >= 2
  and length(trim(message)) >= 10
);

-- ============================================================================
-- Suggested storage buckets
-- ============================================================================

insert into storage.buckets (id, name, public)
values
  ('public-media', 'public-media', true)
on conflict (id) do nothing;

-- If you prefer separate buckets later, use these instead of public-media:
-- insert into storage.buckets (id, name, public) values
--   ('products', 'products', true),
--   ('branches', 'branches', true),
--   ('articles', 'articles', true),
--   ('site', 'site', true),
--   ('about', 'about', true),
--   ('contact', 'contact', true)
-- on conflict (id) do nothing;
