-- Ethnic wear store: Supabase / PostgreSQL schema
-- Run in Supabase SQL editor. Amounts are stored in paise (integer) to avoid float errors.

create extension if not exists "pgcrypto";

-- ───────── Enums ─────────
create type order_status as enum ('pending','paid','shipped','out_for_delivery','delivered','cancelled');
create type payment_method as enum ('razorpay','cod');
create type payment_status as enum ('unpaid','paid','failed','refunded');
create type user_role as enum ('customer','admin');

-- ───────── Profiles (extends auth.users) ─────────
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role user_role not null default 'customer',
  created_at timestamptz not null default now()
);

create function handle_new_user() returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, full_name, phone)
  values (new.id, new.raw_user_meta_data->>'full_name', new.phone);
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function handle_new_user();

create function is_admin() returns boolean language sql stable security definer as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin');
$$;

-- ───────── Addresses ─────────
create table addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  full_name text not null,
  phone text not null,
  house_no text not null,
  street text not null,
  landmark text,
  city text not null,
  state text not null,
  pincode text not null check (pincode ~ '^[1-9][0-9]{5}$'),
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);
create index on addresses (user_id);

-- ───────── Catalog ─────────
create table categories (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references categories(id) on delete set null,  -- subcategory support
  name text not null,
  slug text not null unique,
  image_url text,
  sort_order int not null default 0
);

create table products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references categories(id),
  name text not null,
  slug text not null unique,
  description text,
  care_instructions text,
  fabric text,                          -- Cotton, Silk, Georgette, Chiffon
  work_type text,                       -- Embroidery, Mirror, Print, Bandhani
  occasion text[] not null default '{}',-- {'navratri','festive','casual','wedding'}
  price int not null check (price >= 0),
  discount_price int check (discount_price is null or discount_price < price),
  allow_custom_stitching boolean not null default false,
  is_active boolean not null default true,
  is_featured boolean not null default false,
  popularity int not null default 0,    -- bumped on order; used for "Popularity" sort
  created_at timestamptz not null default now()
);
create index on products (category_id);
create index on products (is_active, created_at desc);
create index on products using gin (occasion);

create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  color_name text,                      -- null = shown for all colors
  url text not null,                    -- Cloudinary URL
  is_primary boolean not null default false,
  sort_order int not null default 0
);
create index on product_images (product_id);
create unique index one_primary_image on product_images (product_id) where is_primary;

-- One row per Color + Size combination; stock lives here
create table variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  color_name text not null,
  color_hex text not null,              -- swatch
  size text not null,                   -- S, M, L, XL, XXL, Custom, Free
  sku text unique,
  stock int not null default 0 check (stock >= 0),
  unique (product_id, color_name, size)
);
create index on variants (product_id);

-- ───────── Wishlist & Reviews ─────────
create table wishlist_items (
  user_id uuid not null references profiles(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

create table reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  title text,
  body text,
  photo_urls text[] not null default '{}',
  is_approved boolean not null default false,   -- admin moderation
  created_at timestamptz not null default now(),
  unique (product_id, user_id)
);

-- ───────── Coupons ─────────
create table coupons (
  code text primary key,
  discount_type text not null check (discount_type in ('percent','flat')),
  discount_value int not null check (discount_value > 0),
  min_order_amount int not null default 0,
  max_discount int,
  usage_limit int,
  used_count int not null default 0,
  expires_at timestamptz,
  is_active boolean not null default true
);

-- ───────── Orders ─────────
create sequence order_number_seq start 1001;

create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique default ('ORD-' || nextval('order_number_seq')),
  user_id uuid not null references profiles(id),
  status order_status not null default 'pending',
  payment_method payment_method not null,
  payment_status payment_status not null default 'unpaid',
  subtotal int not null,
  discount int not null default 0,
  shipping_fee int not null default 0,
  tax int not null default 0,
  total int not null,
  coupon_code text references coupons(code),
  -- address is snapshotted so later edits don't alter past orders
  shipping_address jsonb not null,
  razorpay_order_id text unique,
  razorpay_payment_id text,
  courier_name text,
  tracking_number text,
  tracking_url text,
  created_at timestamptz not null default now()
);
create index on orders (user_id, created_at desc);
create index on orders (status);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid not null references products(id),
  variant_id uuid not null references variants(id),
  product_name text not null,           -- snapshots
  color_name text not null,
  size text not null,
  image_url text,
  unit_price int not null,
  quantity int not null check (quantity > 0),
  custom_notes text                     -- custom stitching / alteration notes
);
create index on order_items (order_id);

-- ───────── Banners & announcements ─────────
create table banners (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  image_url text not null,
  link_url text,
  sort_order int not null default 0,
  is_active boolean not null default true
);

create table announcements (
  id uuid primary key default gen_random_uuid(),
  message text not null,
  is_active boolean not null default true,
  starts_at timestamptz,
  ends_at timestamptz
);

-- ───────── Atomic stock decrement (called from server after order creation) ─────────
create function decrement_stock(p_variant uuid, p_qty int) returns boolean
language plpgsql security definer as $$
begin
  update variants set stock = stock - p_qty where id = p_variant and stock >= p_qty;
  return found;
end $$;

-- ───────── Row Level Security ─────────
alter table profiles enable row level security;
alter table addresses enable row level security;
alter table wishlist_items enable row level security;
alter table reviews enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table categories enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table variants enable row level security;
alter table banners enable row level security;
alter table announcements enable row level security;
alter table coupons enable row level security;

-- Public read on catalog content
create policy "public read categories" on categories for select using (true);
create policy "public read products" on products for select using (is_active or is_admin());
create policy "public read images" on product_images for select using (true);
create policy "public read variants" on variants for select using (true);
create policy "public read banners" on banners for select using (is_active or is_admin());
create policy "public read announcements" on announcements for select using (is_active or is_admin());
create policy "public read approved reviews" on reviews for select using (is_approved or user_id = auth.uid() or is_admin());

-- Admin full control on catalog/content
create policy "admin write categories" on categories for all using (is_admin()) with check (is_admin());
create policy "admin write products" on products for all using (is_admin()) with check (is_admin());
create policy "admin write images" on product_images for all using (is_admin()) with check (is_admin());
create policy "admin write variants" on variants for all using (is_admin()) with check (is_admin());
create policy "admin write banners" on banners for all using (is_admin()) with check (is_admin());
create policy "admin write announcements" on announcements for all using (is_admin()) with check (is_admin());
create policy "admin all coupons" on coupons for all using (is_admin()) with check (is_admin());
create policy "admin moderate reviews" on reviews for update using (is_admin());

-- Owner access
create policy "own profile read" on profiles for select using (id = auth.uid() or is_admin());
create policy "own profile update" on profiles for update using (id = auth.uid())
  with check (id = auth.uid() and role = (select role from profiles where id = auth.uid()));
create policy "own addresses" on addresses for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own wishlist" on wishlist_items for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own reviews insert" on reviews for insert with check (user_id = auth.uid());
create policy "own orders read" on orders for select using (user_id = auth.uid() or is_admin());
create policy "admin update orders" on orders for update using (is_admin());
create policy "own order items read" on order_items for select
  using (exists (select 1 from orders o where o.id = order_id and (o.user_id = auth.uid() or is_admin())));

-- NOTE: order/order_items inserts and payment updates happen only via the server
-- using the service-role key (API routes), never from the browser.
