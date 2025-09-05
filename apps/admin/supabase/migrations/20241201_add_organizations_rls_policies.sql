-- Enable RLS on organizations table
alter table organizations enable row level security;

-- Create policy for authenticated users to read organizations
create policy "Allow authenticated users to read organizations" on organizations
  for select
  to authenticated
  using (true);

-- Create policy for admin users to insert organizations
create policy "Allow admin users to insert organizations" on organizations
  for insert
  to authenticated
  with check (
    exists (
      select 1 from user_profiles 
      where user_profiles.id = auth.uid() 
      and user_profiles.role = 'Admin'
    )
  );

-- Create policy for admin users to update organizations
create policy "Allow admin users to update organizations" on organizations
  for update
  to authenticated
  using (
    exists (
      select 1 from user_profiles 
      where user_profiles.id = auth.uid() 
      and user_profiles.role = 'Admin'
    )
  )
  with check (
    exists (
      select 1 from user_profiles 
      where user_profiles.id = auth.uid() 
      and user_profiles.role = 'Admin'
    )
  );

-- Create policy for admin users to delete organizations
create policy "Allow admin users to delete organizations" on organizations
  for delete
  to authenticated
  using (
    exists (
      select 1 from user_profiles 
      where user_profiles.id = auth.uid() 
      and user_profiles.role = 'Admin'
    )
  );
