-- Create contact_messages table
create table if not exists public.contact_messages (
  id uuid not null default gen_random_uuid (),
  name character varying(200) not null,
  email character varying(255) not null,
  phone character varying(20) null,
  subject character varying(100) not null,
  message text not null,
  status character varying(50) not null default 'new'::character varying,
  notes text null,
  created_at timestamp with time zone not null default timezone ('utc'::text, now()),
  updated_at timestamp with time zone not null default timezone ('utc'::text, now()),
  replied_at timestamp with time zone null,
  constraint contact_messages_pkey primary key (id),
  constraint contact_messages_status_check check (
    (
      (status)::text = any (
        (
          array[
            'new'::character varying,
            'read'::character varying,
            'replied'::character varying,
            'archived'::character varying
          ]
        )::text[]
      )
    )
  ),
  constraint contact_messages_subject_check check (
    (
      (subject)::text = any (
        (
          array[
            'general'::character varying,
            'order'::character varying,
            'support'::character varying,
            'other'::character varying
          ]
        )::text[]
      )
    )
  )
) tablespace pg_default;

-- Create indexes for better query performance
create index if not exists idx_contact_messages_status 
  on public.contact_messages using btree (status) tablespace pg_default;

create index if not exists idx_contact_messages_email 
  on public.contact_messages using btree (email) tablespace pg_default;

create index if not exists idx_contact_messages_created_at 
  on public.contact_messages using btree (created_at desc) tablespace pg_default;

create index if not exists idx_contact_messages_subject 
  on public.contact_messages using btree (subject) tablespace pg_default;

-- Create trigger to automatically update updated_at timestamp
create trigger update_contact_messages_updated_at 
  before update on contact_messages 
  for each row
  execute function update_updated_at_column();

-- Enable Row Level Security
alter table public.contact_messages enable row level security;

-- Create policy for authenticated users (admins) to view all messages
create policy "Admins can view all contact messages"
  on public.contact_messages
  for select
  to authenticated
  using (true);

-- Create policy for authenticated users (admins) to update messages
create policy "Admins can update contact messages"
  on public.contact_messages
  for update
  to authenticated
  using (true)
  with check (true);

-- Create policy to allow public insert (for contact form submissions)
create policy "Anyone can create contact messages"
  on public.contact_messages
  for insert
  to anon, authenticated
  with check (true);

-- Add comment to table
comment on table public.contact_messages is 'Stores contact form submissions from the website';
