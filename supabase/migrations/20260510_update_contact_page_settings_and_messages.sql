alter table if exists public.contact_page_settings
  add column if not exists address_label text,
  add column if not exists address_text text,
  add column if not exists phone_label text,
  add column if not exists phone_number text,
  add column if not exists email_label text,
  add column if not exists email_address text,
  add column if not exists website_label text,
  add column if not exists website_url text,
  add column if not exists website_text text,
  add column if not exists social_media_label text,
  add column if not exists instagram_handle text,
  add column if not exists tiktok_handle text,
  add column if not exists operational_hours_title text,
  add column if not exists weekday_hours text,
  add column if not exists saturday_hours text,
  add column if not exists holiday_hours text,
  add column if not exists form_title text,
  add column if not exists form_description text,
  add column if not exists closing_statement text;

alter table if exists public.contact_messages
  add column if not exists subject text;

update public.contact_page_settings
set
  address_label = coalesce(address_label, studio_label),
  address_text = coalesce(address_text, studio_address)
where singleton_key = true;
