import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

  try {
    const { email, code, requested_role } = req.body;
    if (!email || !code) return res.status(400).json({ error: "Email and code required" });

    const { data: otps, error: fetchError } = await supabase
      .from('otp_codes')
      .select('*')
      .eq('email', email)
      .eq('consumed', false)
      .lt('attempts', 5)
      .gte('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1);

    if (fetchError || !otps || otps.length === 0) {
      return res.status(400).json({ error: "Invalid or expired code" });
    }

    const otpRecord = otps[0];
    const isMatch = await bcrypt.compare(code, otpRecord.code_hash);

    if (!isMatch) {
      await supabase
        .from('otp_codes')
        .update({ attempts: otpRecord.attempts + 1 })
        .eq('id', otpRecord.id);
      return res.status(400).json({ error: "Invalid code" });
    }

    // Mark consumed
    await supabase
      .from('otp_codes')
      .update({ consumed: true })
      .eq('id', otpRecord.id);

    // Find or create profile
    let { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .limit(1);

    let userRole = requested_role || 'citizen';
    let userId = null;

    if (!profiles || profiles.length === 0) {
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert([{ email, role: userRole }])
        .select()
        .single();
      
      if (!insertError && newProfile) {
        userId = newProfile.id;
        userRole = newProfile.role;
      } else {
        userId = 'temp-id-' + Math.random();
      }
    } else {
      userId = profiles[0].id;
      
      // HACKATHON DEMO: Override their role to what they clicked on the UI
      if (requested_role && profiles[0].role !== requested_role) {
         await supabase.from('profiles').update({ role: requested_role }).eq('id', userId);
         userRole = requested_role;
      } else {
         userRole = profiles[0].role;
      }
    }

    const token = jwt.sign(
      { id: userId, email, role: userRole },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({ token, role: userRole });
  } catch (error) {
    console.error("Verify Code Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
