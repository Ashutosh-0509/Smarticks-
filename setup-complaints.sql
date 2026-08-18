-- Run this in your Supabase SQL Editor to create the complaints table

DROP TABLE IF EXISTS complaints CASCADE;
DROP TABLE IF EXISTS complaint_updates CASCADE;

CREATE TABLE complaints (
  id text PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  priority text NOT NULL,
  department_id text NOT NULL,
  department_name text NOT NULL,
  status text NOT NULL,
  location text NOT NULL,
  coordinates jsonb NOT NULL,
  image_url text NOT NULL,
  ai_summary text,
  ai_reasoning text,
  ai_confidence numeric,
  evidence_score integer,
  evidence_flags jsonb,
  is_duplicate boolean DEFAULT false,
  timeline jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS and allow anonymous access for the hackathon
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all for anon on complaints" ON complaints FOR ALL USING (true) WITH CHECK (true);
