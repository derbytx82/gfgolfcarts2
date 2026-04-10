-- Habilitar extensión para UUIDs
create extension if not exists "uuid-ossp";

-- 1. Crear tabla de productos
create table if not exists public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  short_description text,
  full_description text,
  price numeric,
  category text,
  seats integer,
  street_legal boolean default true,
  lithium boolean default false,
  lifted boolean default false,
  featured boolean default false,
  available boolean default true,
  cover_image text,
  gallery_images text[],
  tags text[],
  specs jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Crear tabla de configuraciones del sitio
create table if not exists public.site_settings (
  id uuid default gen_random_uuid() primary key,
  business_name text not null default 'GF Custom Golf Carts',
  phone text,
  whatsapp_number text,
  email text,
  address text,
  city text,
  state text,
  instagram_url text,
  facebook_url text,
  hours text,
  hero_background text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Crear tabla de contenido del sitio
create table if not exists public.site_content (
  id uuid default gen_random_uuid() primary key,
  section_key text unique not null,
  title text,
  subtitle text,
  body text,
  cta_text text,
  cta_link text,
  image_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Crear tabla de testimonios
create table if not exists public.testimonials (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  quote text not null,
  role text,
  avatar_url text,
  featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Crear tabla de galería
create table if not exists public.gallery_items (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  image_url text not null,
  sort_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Habilitar seguridad a nivel de filas (RLS) en todas las tablas
alter table public.products enable row level security;
alter table public.site_settings enable row level security;
alter table public.site_content enable row level security;
alter table public.testimonials enable row level security;
alter table public.gallery_items enable row level security;

-- 7. Crear políticas públicas de lectura (Cualquiera puede leer el contenido en la página web)
create policy "Public Select Products" on public.products for select using (true);
create policy "Public Select Settings" on public.site_settings for select using (true);
create policy "Public Select Content" on public.site_content for select using (true);
create policy "Public Select Testimonials" on public.testimonials for select using (true);
create policy "Public Select Gallery" on public.gallery_items for select using (true);

-- 8. Crear políticas de administración (Solo los logueados pueden insertar/actualizar/borrar)
-- Products
create policy "Admin Insert Products" on public.products for insert with check (auth.role() = 'authenticated');
create policy "Admin Update Products" on public.products for update using (auth.role() = 'authenticated');
create policy "Admin Delete Products" on public.products for delete using (auth.role() = 'authenticated');

-- Site Settings
create policy "Admin Insert Settings" on public.site_settings for insert with check (auth.role() = 'authenticated');
create policy "Admin Update Settings" on public.site_settings for update using (auth.role() = 'authenticated');
create policy "Admin Delete Settings" on public.site_settings for delete using (auth.role() = 'authenticated');

-- Site Content
create policy "Admin Insert Content" on public.site_content for insert with check (auth.role() = 'authenticated');
create policy "Admin Update Content" on public.site_content for update using (auth.role() = 'authenticated');
create policy "Admin Delete Content" on public.site_content for delete using (auth.role() = 'authenticated');

-- Testimonials
create policy "Admin Insert Testimonials" on public.testimonials for insert with check (auth.role() = 'authenticated');
create policy "Admin Update Testimonials" on public.testimonials for update using (auth.role() = 'authenticated');
create policy "Admin Delete Testimonials" on public.testimonials for delete using (auth.role() = 'authenticated');

-- Gallery
create policy "Admin Insert Gallery" on public.gallery_items for insert with check (auth.role() = 'authenticated');
create policy "Admin Update Gallery" on public.gallery_items for update using (auth.role() = 'authenticated');
create policy "Admin Delete Gallery" on public.gallery_items for delete using (auth.role() = 'authenticated');

-- Insertar configuración inicial por defecto para evitar pantallas en blanco si no hay datos
insert into public.site_settings (business_name) values ('GF Custom Golf Carts') on conflict do nothing;
