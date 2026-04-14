-- Events table
create table public.events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  date timestamptz not null,
  end_time timestamptz,
  venue_name text not null,
  venue_address text,
  venue_lat float8,
  venue_lng float8,
  dress_code text,
  description text,
  sort_order smallint default 0,
  created_at timestamptz default now()
);

alter table public.events enable row level security;

create policy "Events are publicly readable"
  on public.events for select
  using (true);

-- Guests table
create table public.guests (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text,
  phone text,
  party_name text,
  max_plus_ones smallint default 0,
  table_number smallint,
  created_at timestamptz default now()
);

create unique index guests_name_unique
  on public.guests (lower(first_name), lower(last_name));

alter table public.guests enable row level security;

-- No public access to guests table — lookups go through server actions

-- RSVPs table
create table public.rsvps (
  id uuid primary key default gen_random_uuid(),
  guest_id uuid not null references public.guests(id) on delete cascade,
  attending boolean not null,
  meal_choice text,
  dietary_restrictions text,
  plus_one_name text,
  plus_one_meal_choice text,
  plus_one_dietary text,
  notes text,
  submitted_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint rsvps_guest_unique unique (guest_id)
);

alter table public.rsvps enable row level security;

-- Gallery images table
create table public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  src text not null,
  alt text,
  sort_order smallint default 0,
  created_at timestamptz default now()
);

alter table public.gallery_images enable row level security;

create policy "Gallery images are publicly readable"
  on public.gallery_images for select
  using (true);
