-- Incremental migration for branch facilities and branch gallery
-- Run this in Supabase SQL Editor, then rerun: npm run supabase:seed

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

create index if not exists branch_facilities_branch_sort_idx
  on public.branch_facilities(branch_id, sort_order);

create index if not exists branch_gallery_branch_sort_idx
  on public.branch_gallery(branch_id, sort_order);

alter table public.branch_facilities enable row level security;
alter table public.branch_gallery enable row level security;

drop policy if exists admin_full_access on public.branch_facilities;
create policy admin_full_access
on public.branch_facilities
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists admin_full_access on public.branch_gallery;
create policy admin_full_access
on public.branch_gallery
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

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
