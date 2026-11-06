create or replace function public.is_portfolio_admin()
returns boolean
language sql
stable
set search_path = ''
as $$
  select coalesce(
    (select auth.jwt() ->> 'email') = 'eyaddarwish257@gmail.com'
    and (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
    false
  );
$$;

revoke all on function public.is_portfolio_admin() from public;
grant execute on function public.is_portfolio_admin() to anon, authenticated;

create table if not exists public.cms_records (
  id text primary key,
  collection text not null check (collection in ('projects', 'skills', 'services', 'journey', 'messages')),
  data jsonb not null default '{}'::jsonb check (jsonb_typeof(data) = 'object'),
  sort_order numeric not null default 0,
  published boolean not null default false,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint cms_message_payload_valid check (
    collection <> 'messages'
    or (
      length(trim(coalesce(data ->> 'name', ''))) between 1 and 200
      and length(trim(coalesce(data ->> 'email', ''))) between 3 and 320
      and length(trim(coalesce(data ->> 'subject', ''))) between 1 and 300
      and length(trim(coalesce(data ->> 'message', ''))) between 1 and 5000
    )
  )
);

create index if not exists cms_records_collection_order_idx
  on public.cms_records (collection, sort_order);

alter table public.cms_records enable row level security;
revoke all on public.cms_records from anon, authenticated;
grant select, insert on public.cms_records to anon;
grant select, insert, update, delete on public.cms_records to authenticated;

drop policy if exists "Public can read published projects" on public.cms_records;
create policy "Public can read published projects"
  on public.cms_records for select to anon
  using (
    (collection = 'projects' and published)
    or (collection in ('skills', 'services', 'journey') and enabled)
  );

drop policy if exists "Admins can read all CMS records" on public.cms_records;
create policy "Admins can read all CMS records"
  on public.cms_records for select to authenticated
  using (public.is_portfolio_admin());

drop policy if exists "Public can submit contact messages" on public.cms_records;
create policy "Public can submit contact messages"
  on public.cms_records for insert to anon, authenticated
  with check (collection = 'messages');

drop policy if exists "Admins can create CMS records" on public.cms_records;
create policy "Admins can create CMS records"
  on public.cms_records for insert to authenticated
  with check (public.is_portfolio_admin());

drop policy if exists "Admins can update CMS records" on public.cms_records;
create policy "Admins can update CMS records"
  on public.cms_records for update to authenticated
  using (public.is_portfolio_admin())
  with check (public.is_portfolio_admin());

drop policy if exists "Admins can delete CMS records" on public.cms_records;
create policy "Admins can delete CMS records"
  on public.cms_records for delete to authenticated
  using (public.is_portfolio_admin());

create or replace function public.set_cms_record_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists cms_records_set_updated_at on public.cms_records;
create trigger cms_records_set_updated_at
  before update on public.cms_records
  for each row execute function public.set_cms_record_updated_at();

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('project-images', 'project-images', true, 8388608, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read project images" on storage.objects;
create policy "Public can read project images"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'project-images');

drop policy if exists "Admins can upload project images" on storage.objects;
create policy "Admins can upload project images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'project-images' and public.is_portfolio_admin());

drop policy if exists "Admins can update project images" on storage.objects;
create policy "Admins can update project images"
  on storage.objects for update to authenticated
  using (bucket_id = 'project-images' and public.is_portfolio_admin())
  with check (bucket_id = 'project-images' and public.is_portfolio_admin());

drop policy if exists "Admins can delete project images" on storage.objects;
create policy "Admins can delete project images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'project-images' and public.is_portfolio_admin());

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
     and not exists (
       select 1
       from pg_publication_tables
       where pubname = 'supabase_realtime'
         and schemaname = 'public'
         and tablename = 'cms_records'
     ) then
    alter publication supabase_realtime add table public.cms_records;
  end if;
end;
$$;
