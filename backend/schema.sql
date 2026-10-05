-- All tables are private to the service role. Browser clients have no direct read/write access.
create table public.piano_access (id integer primary key check(id=1), salt text not null, hash text not null, iterations integer not null default 210000);
create table public.piano_progress (id integer primary key check(id=1), data jsonb not null default '{"stages":{},"journal":[],"path":"pop"}', version integer not null default 0);
insert into public.piano_progress(id) values(1);
create table public.piano_sessions (token_hash text primary key, expires_at timestamptz not null);
create table public.piano_rate (bucket text primary key, count integer not null default 0, reset_at timestamptz not null);
alter table public.piano_access enable row level security;
alter table public.piano_progress enable row level security;
alter table public.piano_sessions enable row level security;
alter table public.piano_rate enable row level security;
revoke all on public.piano_access,public.piano_progress,public.piano_sessions,public.piano_rate from anon,authenticated;
grant all on public.piano_access,public.piano_progress,public.piano_sessions,public.piano_rate to service_role;
create function public.piano_rate_hit(bucket_key text) returns integer language plpgsql security invoker set search_path='' as $$
declare hits integer;
begin
 insert into public.piano_rate(bucket,count,reset_at) values(bucket_key,1,now()+interval '15 minutes')
 on conflict(bucket) do update set count=case when public.piano_rate.reset_at<now() then 1 else public.piano_rate.count+1 end,
 reset_at=case when public.piano_rate.reset_at<now() then now()+interval '15 minutes' else public.piano_rate.reset_at end returning count into hits;
 delete from public.piano_rate where reset_at<now()-interval '1 day';
 delete from public.piano_sessions where expires_at<now();
 return hits;
end;$$;
revoke all on function public.piano_rate_hit(text) from public,anon,authenticated;
grant execute on function public.piano_rate_hit(text) to service_role;
-- Provision password separately using PBKDF2 SHA-256; never commit password/hash into this file.
