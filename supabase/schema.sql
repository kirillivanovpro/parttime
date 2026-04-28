-- Part:time Supabase schema
-- Run this in Supabase Dashboard -> SQL Editor -> New query -> Run.

create extension if not exists "pgcrypto";

-- 1. Profiles: public user profile tied to auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text,
  city text default 'Рига',
  role text default 'both' check (role in ('customer', 'performer', 'both', 'admin')),
  bio text,
  avatar_url text,
  verified boolean default false,
  completed_tasks integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Tasks
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  category text not null,
  city text default 'Рига',
  price numeric(10,2) not null check (price > 0),
  description text,
  status text default 'open' check (status in ('open', 'assigned', 'in_progress', 'completed', 'cancelled', 'disputed')),
  selected_performer_id uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Applications / responses
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  performer_id uuid not null references public.profiles(id) on delete cascade,
  message text,
  proposed_price numeric(10,2),
  status text default 'sent' check (status in ('sent', 'accepted', 'rejected', 'withdrawn')),
  created_at timestamptz default now(),
  unique(task_id, performer_id)
);

-- 4. Messages
-- MVP-simple version: messages can be global/demo or tied to task_id later.
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  task_id uuid references public.tasks(id) on delete cascade,
  sender_id uuid references public.profiles(id) on delete set null,
  recipient_id uuid references public.profiles(id) on delete set null,
  body text not null,
  created_at timestamptz default now()
);

-- 5. Reviews
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  task_id uuid references public.tasks(id) on delete set null,
  reviewer_id uuid not null references public.profiles(id) on delete cascade,
  reviewee_id uuid not null references public.profiles(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  text text,
  created_at timestamptz default now()
);

-- 6. Storage bucket for avatars
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- RLS
alter table public.profiles enable row level security;
alter table public.tasks enable row level security;
alter table public.applications enable row level security;
alter table public.messages enable row level security;
alter table public.reviews enable row level security;

-- Profiles policies
drop policy if exists "Profiles are viewable by everyone" on public.profiles;
create policy "Profiles are viewable by everyone"
on public.profiles for select
using (true);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
on public.profiles for insert
with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

-- Tasks policies
drop policy if exists "Tasks are viewable by everyone" on public.tasks;
create policy "Tasks are viewable by everyone"
on public.tasks for select
using (true);

drop policy if exists "Authenticated users can create tasks" on public.tasks;
create policy "Authenticated users can create tasks"
on public.tasks for insert
with check (auth.uid() = customer_id);

drop policy if exists "Customers can update own tasks" on public.tasks;
create policy "Customers can update own tasks"
on public.tasks for update
using (auth.uid() = customer_id)
with check (auth.uid() = customer_id);

-- Applications policies
drop policy if exists "Related users can view applications" on public.applications;
create policy "Related users can view applications"
on public.applications for select
using (
  auth.uid() = performer_id
  or exists (
    select 1 from public.tasks
    where tasks.id = applications.task_id
    and tasks.customer_id = auth.uid()
  )
);

drop policy if exists "Authenticated performers can apply" on public.applications;
create policy "Authenticated performers can apply"
on public.applications for insert
with check (auth.uid() = performer_id);

drop policy if exists "Performers can update own applications" on public.applications;
create policy "Performers can update own applications"
on public.applications for update
using (auth.uid() = performer_id)
with check (auth.uid() = performer_id);

-- Messages policies
drop policy if exists "Users can view related messages" on public.messages;
create policy "Users can view related messages"
on public.messages for select
using (
  sender_id = auth.uid()
  or recipient_id = auth.uid()
  or recipient_id is null
);

drop policy if exists "Authenticated users can send messages" on public.messages;
create policy "Authenticated users can send messages"
on public.messages for insert
with check (auth.uid() = sender_id);

-- Reviews policies
drop policy if exists "Reviews are public" on public.reviews;
create policy "Reviews are public"
on public.reviews for select
using (true);

drop policy if exists "Authenticated users can create reviews" on public.reviews;
create policy "Authenticated users can create reviews"
on public.reviews for insert
with check (auth.uid() = reviewer_id);

-- Storage policies for avatar bucket
drop policy if exists "Avatar images are publicly accessible" on storage.objects;
create policy "Avatar images are publicly accessible"
on storage.objects for select
using (bucket_id = 'avatars');

drop policy if exists "Users can upload avatars" on storage.objects;
create policy "Users can upload avatars"
on storage.objects for insert
with check (
  bucket_id = 'avatars'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "Users can update own avatars" on storage.objects;
create policy "Users can update own avatars"
on storage.objects for update
using (
  bucket_id = 'avatars'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "Users can delete own avatars" on storage.objects;
create policy "Users can delete own avatars"
on storage.objects for delete
using (
  bucket_id = 'avatars'
  and auth.uid()::text = (storage.foldername(name))[1]
);
