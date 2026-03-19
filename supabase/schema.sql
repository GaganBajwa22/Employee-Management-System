-- Create a table for public profiles
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text not null,
  name text,
  role text check (role in ('admin', 'employee')) default 'employee',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

create policy "Admins can update all profiles." on profiles
  for update using ( exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') );

-- Create a table for tasks
create table public.tasks (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  status text check (status in ('pending', 'in_progress', 'completed')) default 'pending',
  assigned_to uuid references public.profiles(id),
  created_by uuid references public.profiles(id),
  due_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.tasks enable row level security;

create policy "Tasks viewable by assigned employee or admins." on tasks
  for select using (
    auth.uid() = assigned_to 
    or 
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Tasks insertable by admins." on tasks
  for insert with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Tasks updateable by assigned employee or admins." on tasks
  for update using (
    auth.uid() = assigned_to 
    or 
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Tasks deleteable by admins." on tasks
  for delete using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Function to handle new user signup
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, name, role)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'name', 
    coalesce(new.raw_user_meta_data->>'role', 'employee')
  );
  return new;
end;
$$;

-- Trigger to call handle_new_user on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
