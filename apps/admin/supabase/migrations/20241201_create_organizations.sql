-- Create organizations table
create table organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  type text not null default 'other',
  address text,
  city text,
  state text,
  country text,
  phone text,
  email text,
  website text,
  description text,
  services jsonb default '[]'::jsonb,
  operating_hours jsonb default '{}'::jsonb,
  status text not null default 'active' check (status in ('active', 'inactive', 'pending', 'suspended')),
  verified boolean default false,
  rating numeric(3,2) default 0.0,
  review_count integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Set up Row Level Security (RLS)
alter table organizations enable row level security;

-- Policy to allow authenticated users to view organizations
create policy "Authenticated users can view organizations"
on organizations for select
using (auth.role() = 'authenticated');

-- Policy to allow authenticated users to insert organizations
create policy "Authenticated users can insert organizations"
on organizations for insert
with check (auth.role() = 'authenticated');

-- Policy to allow authenticated users to update organizations
create policy "Authenticated users can update organizations"
on organizations for update
using (auth.role() = 'authenticated');

-- Policy to allow authenticated users to delete organizations
create policy "Authenticated users can delete organizations"
on organizations for delete
using (auth.role() = 'authenticated');

-- Insert some sample data
insert into organizations (name, type, address, city, state, phone, email, website, description, services, status, verified, rating, review_count) values
('Paws & Care Vet', 'veterinary_clinic', '123 Main St. Suite 4', 'Austin', 'TX', '(586) 123-4567', 'info@pawsandcare.com', 'https://pawsandcare.com', 'Full-service veterinary clinic specializing in pet wellness and emergency care.', '["consultation", "vaccination", "surgery", "emergency"]', 'active', true, 4.8, 127),
('Happy Tails Grooming', 'grooming', '456 Oak Avenue', 'Austin', 'TX', '(512) 987-6543', 'hello@happytails.com', 'https://happytails.com', 'Professional pet grooming services with experienced stylists.', '["grooming", "bathing", "nail trimming"]', 'active', true, 4.9, 89),
('Walk & Wag Services', 'walking_service', '789 Pine Street', 'Austin', 'TX', '(512) 555-0123', 'contact@walkandwag.com', 'https://walkandwag.com', 'Reliable dog walking and pet sitting services.', '["walking", "pet sitting", "overnight care"]', 'active', false, 4.7, 156),
('Pet Paradise Hotel', 'pet_hotel', '321 Elm Drive', 'Austin', 'TX', '(512) 444-7890', 'reservations@petparadise.com', 'https://petparadise.com', 'Luxury pet boarding with 24/7 care and activities.', '["boarding", "grooming", "training"]', 'active', true, 4.6, 203),
('Furry Friends Training', 'training', '654 Maple Lane', 'Austin', 'TX', '(512) 333-4567', 'info@furryfriends.com', 'https://furryfriends.com', 'Professional dog training services for all ages and breeds.', '["training", "behavioral consultation"]', 'active', false, 4.9, 78);
