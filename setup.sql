-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS otp_codes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  code_hash text NOT NULL,
  expires_at timestamptz NOT NULL,
  consumed boolean DEFAULT false,
  attempts int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- We need to allow the backend to read/write using the anon key. 
-- Note: In a production app with a dedicated backend, you'd use the Service Role Key instead of Anon Key to bypass RLS.
-- Since we are using the Anon key for the backend in this hackathon, we temporarily allow all access.
ALTER TABLE otp_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all for anon on otp_codes" ON otp_codes FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS profiles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  role text DEFAULT 'citizen',
  name text,
  phone text,
  department text,
  employee_id text,
  created_at timestamptz DEFAULT now()
);

-- Allow public access for backend using anon key
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all for anon on profiles" ON profiles FOR ALL USING (true) WITH CHECK (true);

-- Seed a dummy staff profile so you can test staff login
INSERT INTO profiles (email, role, name)
VALUES ('admin@city.gov.in', 'staff', 'Officer A. Sharma')
ON CONFLICT (email) DO NOTHING;
