-- Add rating column to organizations table
alter table organizations add column if not exists rating decimal(3,2) default 0.0;

-- Add services column to organizations table
alter table organizations add column if not exists services text[] default '{}';

-- Add status column to organizations table
alter table organizations add column if not exists status text default 'active';

-- Add verified column to organizations table
alter table organizations add column if not exists verified boolean default false;

-- Add website column to organizations table
alter table organizations add column if not exists website text;

-- Add constraint for rating values (0.0 to 5.0)
do $$
begin
  if not exists (
    select 1 from pg_constraint 
    where conname = 'organizations_rating_check'
  ) then
    alter table organizations 
    add constraint organizations_rating_check 
    check (rating >= 0.0 and rating <= 5.0);
  end if;
end $$;

-- Add constraint for status values
do $$
begin
  if not exists (
    select 1 from pg_constraint 
    where conname = 'organizations_status_check'
  ) then
    alter table organizations 
    add constraint organizations_status_check 
    check (status in ('active', 'inactive', 'pending', 'suspended'));
  end if;
end $$;

-- Update existing rows with default values
update organizations set rating = 0.0 where rating is null;
update organizations set services = '{}' where services is null;
update organizations set status = 'active' where status is null;
update organizations set verified = false where verified is null;
