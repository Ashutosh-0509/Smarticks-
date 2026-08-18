import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

const emailSendTimestamps = new Map();

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT || '465', 10),
    secure: process.env.MAIL_SECURE === 'true',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });

    // Rate Limit: 1 per 30s per hot instance
    const lastSent = emailSendTimestamps.get(email);
    if (lastSent && Date.now() - lastSent < 30000) {
      return res.status(429).json({ error: "Please wait 30 seconds before requesting another code." });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const code_hash = await bcrypt.hash(code, 10);
    const expires_at = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    const { error: dbError } = await supabase
      .from('otp_codes')
      .insert([{ email, code_hash, expires_at }]);

    if (dbError) {
      console.error("DB Error on send-code:", dbError);
      return res.status(500).json({ error: "Failed to generate OTP in database" });
    }

    emailSendTimestamps.set(email, Date.now());

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: 'CivicReport Login Code',
      text: `Your CivicReport login code is: ${code}\n\nIt expires in 5 minutes.`,
    });

    res.status(200).json({ message: "Code sent successfully" });
  } catch (error) {
    console.error("Send Code Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
