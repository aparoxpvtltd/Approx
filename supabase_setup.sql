-- 1. Enable the pg_net extension to allow secure HTTP requests directly from PostgreSQL
create extension if not exists pg_net;

-- 2. Create the contact submissions table if it doesn't already exist
create table if not exists public.contact_submissions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  email text not null,
  message text not null
);

-- 3. Enable Row Level Security (RLS) for security
alter table public.contact_submissions enable row level security;

-- 4. Allow ANYONE (anonymous public) to insert rows into this table (required for contact forms)
-- But note: Since there is no SELECT policy, public users CANNOT read data from this table, making it completely secure.
drop policy if exists "Allow public inserts to contact_submissions" on public.contact_submissions;
create policy "Allow public inserts to contact_submissions"
on public.contact_submissions
for insert
with check (true);

-- 5. Create a function to send the HTTP POST request to Zeptomail API whenever a row is inserted
create or replace function public.handle_contact_submission()
returns trigger
language plpgsql
security definer -- Runs with administrative permissions to securely bypass RLS/schema limits
as $$
begin
  perform net.http_post(
    url := 'https://api.zeptomail.in/v1.0/email',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Zoho-enczptapikey PHtE6r1bS7rujmEupERV7PXqFpH3PN4v/OtlLQFHt4pADKJXS01S/9ErlGWzqxl/A6FDRvOSnY4+uLObsbrRJG67YT1IX2qyqK3sx/VYSPOZsbq6x00csFgScEfcUYTqcdBi3CPUutfaNA=='
    ),
    body := jsonb_build_object(
      'from', jsonb_build_object('address', 'noreply@aparox.in', 'name', 'Aparox AI Website'),
      'to', jsonb_build_array(
        jsonb_build_object(
          'email_address', jsonb_build_object('address', 'aparoxpvtltd@gmail.com', 'name', 'Aparox Support')
        )
      ),
      'reply_to', jsonb_build_array(
        jsonb_build_object('address', NEW.email, 'name', NEW.name)
      ),
      'subject', 'New Project Inquiry from ' || NEW.name,
      'htmlbody', '
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 25px; border: 1px solid #eaeaea; border-radius: 8px; background-color: #fafafa;">
          <h2 style="color: #4f46e5; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; margin-top: 0;">New Contact Submission</h2>
          
          <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
            <tr>
              <td style="padding: 6px 0; font-weight: bold; color: #4b5563; width: 100px;">Name:</td>
              <td style="padding: 6px 0; color: #1f2937;">' || NEW.name || '</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold; color: #4b5563;">Email:</td>
              <td style="padding: 6px 0; color: #1f2937;"><a href="mailto:' || NEW.email || '" style="color: #4f46e5; text-decoration: none;">' || NEW.email || '</a></td>
            </tr>
          </table>
          
          <div style="margin-top: 25px;">
            <h4 style="color: #4b5563; margin-bottom: 8px;">Message:</h4>
            <div style="background-color: #ffffff; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb; color: #374151; white-space: pre-wrap; line-height: 1.5;">' || replace(NEW.message, E'\n', '<br>') || '</div>
          </div>
          
          <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 30px 0 20px 0;" />
          <p style="font-size: 11px; color: #9ca3af; text-align: center; margin: 0;">Sent automatically via Supabase pg_net</p>
        </div>
      '
    )
  );
  return NEW;
end;
$$;

-- 6. Bind the function to the AFTER INSERT trigger on the contact_submissions table
drop trigger if exists on_contact_submission on public.contact_submissions;
create trigger on_contact_submission
  after insert on public.contact_submissions
  for each row
  execute function public.handle_contact_submission();
