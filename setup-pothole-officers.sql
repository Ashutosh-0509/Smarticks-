-- =============================================================
-- Pothole Officer Lookup Table
-- Run this in your Supabase SQL Editor
-- =============================================================

DROP TABLE IF EXISTS ward_officers CASCADE;

CREATE TABLE ward_officers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  ward_no text NOT NULL,
  ward_name text NOT NULL,
  city text NOT NULL DEFAULT 'Mumbai',
  -- Responsible Municipal Officer
  officer_name text NOT NULL,
  officer_designation text NOT NULL DEFAULT 'Assistant Engineer (Roads)',
  officer_email text NOT NULL,
  officer_phone text NOT NULL,
  officer_department text NOT NULL DEFAULT 'Roads & Infrastructure',
  -- Road Maintenance Contractor
  contractor_name text,
  contractor_contact text,
  -- Searchable keywords (location aliases for this ward)
  location_keywords text[],
  created_at timestamptz DEFAULT now()
);

-- Enable RLS and allow anonymous access
ALTER TABLE ward_officers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all for anon on ward_officers" ON ward_officers FOR ALL USING (true) WITH CHECK (true);

-- =============================================================
-- SEED DATA — Mumbai (MCGM) Wards
-- =============================================================
INSERT INTO ward_officers (ward_no, ward_name, city, officer_name, officer_designation, officer_email, officer_phone, officer_department, contractor_name, contractor_contact, location_keywords) VALUES
('A', 'Colaba-Fort', 'Mumbai', 'Suresh Patil', 'Assistant Engineer (Roads)', 'ae.roads.A@mcgm.gov.in', '+91-22-22620014', 'Roads & Infrastructure', 'Ramdas Infrastructure Pvt Ltd', '+91-98200-11234', ARRAY['colaba', 'fort', 'churchgate', 'nariman point', 'cuffe parade']),
('B', 'Mazagaon-Dongri', 'Mumbai', 'Rajesh Kumar Nair', 'Assistant Engineer (Roads)', 'ae.roads.B@mcgm.gov.in', '+91-22-23710043', 'Roads & Infrastructure', 'Shree Ganesh Road Works', '+91-98330-44521', ARRAY['mazagaon', 'dongri', 'mandvi', 'umerkhadi', 'masjid bunder']),
('C', 'Pydhonie-Bhuleshwar', 'Mumbai', 'Anita Shinde', 'Junior Engineer (Roads)', 'ae.roads.C@mcgm.gov.in', '+91-22-23428856', 'Roads & Infrastructure', 'Krishna Constructions', '+91-99200-23456', ARRAY['pydhonie', 'bhuleshwar', 'null bazaar', 'kalbadevi', 'mumbadevi']),
('D', 'Malabar Hill', 'Mumbai', 'Pradeep Deshmukh', 'Executive Engineer (Roads)', 'ae.roads.D@mcgm.gov.in', '+91-22-23633021', 'Roads & Infrastructure', 'Buildfast Solutions Ltd', '+91-98190-67890', ARRAY['malabar hill', 'gamdevi', 'charni road', 'grant road', 'girgaon', 'marine lines']),
('E', 'Byculla', 'Mumbai', 'Meenakshi Rao', 'Assistant Engineer (Roads)', 'ae.roads.E@mcgm.gov.in', '+91-22-23719200', 'Roads & Infrastructure', 'Paveco Road Builders', '+91-97690-34512', ARRAY['byculla', 'agripada', 'nagpada', 'madanpura', 'sewri']),
('F/N', 'Kurla', 'Mumbai', 'Vinod Kadam', 'Assistant Engineer (Roads)', 'ae.roads.FN@mcgm.gov.in', '+91-22-25011234', 'Roads & Infrastructure', 'Metro Infra Works', '+91-96190-55432', ARRAY['kurla', 'vidyavihar', 'chunabhatti', 'tilaknagar', 'ghatkopar west']),
('F/S', 'Andheri East', 'Mumbai', 'Santosh Jadhav', 'Assistant Engineer (Roads)', 'ae.roads.FS@mcgm.gov.in', '+91-22-26823450', 'Roads & Infrastructure', 'Sahyadri Road Corp', '+91-98920-78901', ARRAY['andheri east', 'marol', 'saki naka', 'jvlr', 'seepz', 'midc andheri']),
('G/N', 'Goregaon', 'Mumbai', 'Arun Bhosale', 'Junior Engineer (Roads)', 'ae.roads.GN@mcgm.gov.in', '+91-22-28757890', 'Roads & Infrastructure', 'Suraj Road Maintenance', '+91-99300-11234', ARRAY['goregaon', 'aarey', 'film city', 'malad east', 'malad west']),
('H/E', 'Bandra East', 'Mumbai', 'Kavita Naik', 'Assistant Engineer (Roads)', 'ae.roads.HE@mcgm.gov.in', '+91-22-26513456', 'Roads & Infrastructure', 'Trustline Infra Ltd', '+91-98700-43210', ARRAY['bandra east', 'vakola', 'kherwadi', 'bkc', 'kalanagar']),
('H/W', 'Bandra West', 'Mumbai', 'Sanjay Gupta', 'Executive Engineer (Roads)', 'ae.roads.HW@mcgm.gov.in', '+91-22-26553400', 'Roads & Infrastructure', 'Westernline Road Co', '+91-99200-98765', ARRAY['bandra west', 'khar west', 'santacruz west', 'linking road', 'hill road', 'turner road']),
-- Navi Mumbai (NMMC)
('NM-1', 'Vashi-Sector 17', 'Navi Mumbai', 'Prakash Shenoy', 'Assistant Engineer (Roads)', 'ae.roads.vashi@nmmc.gov.in', '+91-22-27560100', 'Roads & Infrastructure (NMMC)', 'NaviPath Builders', '+91-98190-34201', ARRAY['vashi', 'sector 17', 'sector 10', 'sector 9', 'vashi naka']),
('NM-2', 'Nerul-Seawoods', 'Navi Mumbai', 'Rupali Wagh', 'Junior Engineer (Roads)', 'ae.roads.nerul@nmmc.gov.in', '+91-22-27703456', 'Roads & Infrastructure (NMMC)', 'Coastal Road Works', '+91-98450-12345', ARRAY['nerul', 'seawoods', 'sanpada', 'juinagar', 'belapur']),
('NM-3', 'Kharghar-Panvel', 'Navi Mumbai', 'Arvind Patkar', 'Assistant Engineer (Roads)', 'ae.roads.kharghar@nmmc.gov.in', '+91-22-27745678', 'Roads & Infrastructure (NMMC)', 'Palm Infra Services', '+91-99204-56789', ARRAY['kharghar', 'panvel', 'kalamboli', 'kamothe', 'taloja']),
('NM-4', 'Turbhe-Ghansoli', 'Navi Mumbai', 'Deepa Kulkarni', 'Assistant Engineer (Roads)', 'ae.roads.turbhe@nmmc.gov.in', '+91-22-27680022', 'Roads & Infrastructure (NMMC)', 'Prime Road Corp', '+91-98330-87654', ARRAY['turbhe', 'ghansoli', 'rabale', 'mahape', 'ttc midc']),
-- Pune (PMC)
('PMC-1', 'Shivajinagar-Deccan', 'Pune', 'Nikhil Joshi', 'Assistant Engineer (Roads)', 'ae.roads.shivajinagar@pmc.gov.in', '+91-20-25500100', 'Roads & Infrastructure (PMC)', 'Pune Asphalt Works', '+91-98230-11111', ARRAY['shivajinagar', 'deccan', 'fc road', 'jm road', 'law college road']),
('PMC-2', 'Kothrud-Karve Nagar', 'Pune', 'Smita Kulkarni', 'Executive Engineer (Roads)', 'ae.roads.kothrud@pmc.gov.in', '+91-20-25467890', 'Roads & Infrastructure (PMC)', 'Sahakar Road Builders', '+91-99220-22222', ARRAY['kothrud', 'karve nagar', 'warje', 'bavdhan', 'chandni chowk']),
('PMC-3', 'Hadapsar-Manjri', 'Pune', 'Rajendra Mane', 'Junior Engineer (Roads)', 'ae.roads.hadapsar@pmc.gov.in', '+91-20-26890123', 'Roads & Infrastructure (PMC)', 'Eastside Road Corp', '+91-97660-33333', ARRAY['hadapsar', 'manjri', 'phursungi', 'magarpatta', 'fatimanagar']),
-- Thane (TMC)
('TMC-1', 'Thane East-Kopri', 'Thane', 'Hemant Chavan', 'Assistant Engineer (Roads)', 'ae.roads.thanee@tmc.gov.in', '+91-22-25337890', 'Roads & Infrastructure (TMC)', 'Konkan Road Works', '+91-98920-44444', ARRAY['thane east', 'kopri', 'vitawa', 'kausa', 'airoli']),
('TMC-2', 'Thane West-Naupada', 'Thane', 'Priya Sawant', 'Assistant Engineer (Roads)', 'ae.roads.thanew@tmc.gov.in', '+91-22-25302345', 'Roads & Infrastructure (TMC)', 'Shree Infra Services', '+91-99670-55555', ARRAY['thane west', 'naupada', 'cadbury junction', 'pokhran road', 'teen hath naka']),
-- Generic fallback
('GEN', 'General Ward', 'Maharashtra', 'Municipal Road Officer', 'Duty Officer (Roads)', 'roads.complaint@mcgm.gov.in', '+91-22-22621234', 'Roads & Infrastructure', 'Municipal Contractor', NULL, ARRAY['mumbai', 'maharashtra', 'india']);
