import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log("Testing connection to Supabase...");
  console.log("URL:", supabaseUrl);
  
  try {
    const { data, error } = await supabase.from('complaints').select('id').limit(1);
    if (error) {
      console.error("Supabase Query Error:", error);
    } else {
      console.log("Connection successful! Fetched data:", data);
    }
  } catch (err) {
    console.error("Exception caught:", err);
  }
}

testConnection();
