-- =========================================================
-- DATABASE SCHEMA: MITRA ASSET & PRODUCT KNOWLEDGE HUB
-- Run this script in the Supabase SQL Editor
-- =========================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE (User, Mitra, & Admin)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  role text default 'mitra' check (role in ('admin', 'mitra')),
  active_session_id text,
  last_device text,
  last_ip text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on Row Level Security
alter table public.profiles enable row level security;

-- Policies for profiles
create policy "Allow users to read their own profile" 
  on public.profiles for select 
  using (auth.uid() = id);

create policy "Allow users to update their own profile session" 
  on public.profiles for update 
  using (auth.uid() = id);

create policy "Allow admins full access to profiles" 
  on public.profiles for all 
  using (
    exists (
      select 1 from public.profiles 
      where id = auth.uid() and role = 'admin'
    )
  );

-- Trigger to auto-create profile on Google OAuth Sign-Up
create or replace function public.handle_new_user()
returns trigger as $$
declare
  is_admin boolean;
begin
  -- Check if user's email matches admin email patterns or is first user
  insert into public.profiles (id, email, full_name, avatar_url, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url',
    'mitra'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger definition
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. CATEGORIES TABLE
create table if not exists public.categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  description text,
  icon text default 'Package',
  display_order int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.categories enable row level security;

create policy "Allow all authenticated users to read categories" 
  on public.categories for select 
  using (true);

create policy "Allow admins to manage categories" 
  on public.categories for all 
  using (
    exists (
      select 1 from public.profiles 
      where id = auth.uid() and role = 'admin'
    )
  );


-- 3. PRODUCTS TABLE
create table if not exists public.products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  category_id uuid references public.categories(id) on delete set null,
  short_description text not null,
  full_description text not null,
  usp jsonb default '[]'::jsonb, -- Array of USP string points
  target_market text,
  price_consumer numeric(15, 2) default 0,
  price_partner numeric(15, 2) default 0,
  margin numeric(15, 2) default 0,
  faqs jsonb default '[]'::jsonb, -- Array of {question: string, answer: string}
  copywritings jsonb default '[]'::jsonb, -- Array of {id: string, title: string, tag: string, content: string}
  cover_image text not null,
  is_published boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.products enable row level security;

create policy "Allow all authenticated users to read published products" 
  on public.products for select 
  using (is_published = true or exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  ));

create policy "Allow admins to manage products" 
  on public.products for all 
  using (
    exists (
      select 1 from public.profiles 
      where id = auth.uid() and role = 'admin'
    )
  );


-- 4. PRODUCT ASSETS TABLE (Gambar & Video Iklan)
create table if not exists public.product_assets (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references public.products(id) on delete cascade not null,
  title text not null,
  media_type text not null check (media_type in ('image', 'video')),
  category_type text not null check (category_type in ('feed', 'story', 'video_promo', 'testimoni', 'banner')),
  file_url text not null,
  thumbnail_url text,
  file_size text,
  dimensions text,
  download_count int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.product_assets enable row level security;

create policy "Allow all authenticated users to read assets" 
  on public.product_assets for select 
  using (true);

create policy "Allow admins to manage assets" 
  on public.product_assets for all 
  using (
    exists (
      select 1 from public.profiles 
      where id = auth.uid() and role = 'admin'
    )
  );


-- 5. ENABLE REALTIME PUBLICATION FOR PROFILES
-- Critical for Single-Session kicks when user logs into computer while active on phone
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime;
commit;
alter publication supabase_realtime add table public.profiles;
alter publication supabase_realtime add table public.products;
alter publication supabase_realtime add table public.product_assets;

-- Set replica identity to full so that realtime events include previous & updated data
alter table public.profiles replica identity full;

-- 6. STORAGE BUCKET FOR ASSETS
insert into storage.buckets (id, name, public) 
values ('product-assets', 'product-assets', true)
on conflict (id) do nothing;

create policy "Allow authenticated users to download media"
  on storage.objects for select
  using (bucket_id = 'product-assets');

create policy "Allow admin to upload media"
  on storage.objects for insert
  with check (
    bucket_id = 'product-assets' and
    exists (
      select 1 from public.profiles 
      where id = auth.uid() and role = 'admin'
    )
  );
