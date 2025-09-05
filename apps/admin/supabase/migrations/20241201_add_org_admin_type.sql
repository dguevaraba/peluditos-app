-- Add constraint for organization type values including org_admin
do $$
begin
  if not exists (
    select 1 from pg_constraint 
    where conname = 'organizations_type_check'
  ) then
    alter table organizations 
    add constraint organizations_type_check 
    check (type in ('veterinary_clinic', 'grooming', 'walking_service', 'pet_hotel', 'training', 'pet_shop', 'org_admin', 'other'));
  else
    -- Drop and recreate constraint to include org_admin
    alter table organizations 
    drop constraint if exists organizations_type_check;
    alter table organizations 
    add constraint organizations_type_check 
    check (type in ('veterinary_clinic', 'grooming', 'walking_service', 'pet_hotel', 'training', 'pet_shop', 'org_admin', 'other'));
  end if;
end $$;
