-- Add missing columns to organizations table
alter table organizations 
add column if not exists type text default 'other',
add column if not exists country text,
add column if not exists description text,
add column if not exists operating_hours jsonb default '{}'::jsonb,
add column if not exists review_count integer default 0,
add column if not exists updated_at timestamp with time zone default now();

-- Update existing records with default values
update organizations 
set 
  type = 'veterinary_clinic',
  country = 'United States',
  description = 'Professional pet care services',
  review_count = 0,
  updated_at = now()
where type is null or type = 'other';

-- Add constraint for type values (if it doesn't exist)
do $$
begin
  if not exists (
    select 1 from pg_constraint 
    where conname = 'organizations_type_check'
  ) then
    alter table organizations 
    add constraint organizations_type_check 
    check (type in ('veterinary_clinic', 'grooming', 'walking_service', 'pet_hotel', 'training', 'pet_shop', 'other'));
  end if;
end $$;

-- Create trigger to update updated_at timestamp (if it doesn't exist)
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Drop trigger if it exists, then create it
drop trigger if exists update_organizations_updated_at on organizations;
create trigger update_organizations_updated_at
  before update on organizations
  for each row
  execute function update_updated_at_column();
