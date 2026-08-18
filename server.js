import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Allow larger payload for base64 images

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
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

// Store timestamps for rate-limiting
const emailSendTimestamps = new Map();

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

app.post('/api/auth/send-code', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });

    // Rate Limit: 1 per 30s
    const lastSent = emailSendTimestamps.get(email);
    if (lastSent && Date.now() - lastSent < 30000) {
      return res.status(429).json({ error: "Please wait 30 seconds before requesting another code." });
    }

    const code = generateOTP();
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

    res.json({ message: "Code sent successfully" });
  } catch (error) {
    console.error("Send Code Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post('/api/auth/verify-code', async (req, res) => {
  try {
    const { email, code } = req.body;
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

    let userRole = 'citizen';
    let userId = null;

    if (!profiles || profiles.length === 0) {
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert([{ email, role: 'citizen' }])
        .select()
        .single();
      
      if (!insertError && newProfile) {
        userId = newProfile.id;
        userRole = newProfile.role;
      } else {
        // Fallback for demo if profiles table missing
        userId = 'temp-id-' + Math.random();
      }
    } else {
      userId = profiles[0].id;
      userRole = profiles[0].role;
    }

    const token = jwt.sign(
      { id: userId, email, role: userRole },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, role: userRole });
  } catch (error) {
    console.error("Verify Code Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

app.get('/api/dashboard-only', authMiddleware, (req, res) => {
  if (req.user.role !== 'staff') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  res.json({ message: "Welcome to staff dashboard" });
});

app.post('/api/analyze', async (req, res) => {
  try {
    const { title, description, image_url } = req.body;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        category: { type: Type.STRING },
        priority: { type: Type.STRING },
        department_id: { type: Type.STRING },
        department_name: { type: Type.STRING },
        ai_summary: { type: Type.STRING },
        ai_reasoning: { type: Type.STRING },
        ai_confidence: { type: Type.NUMBER },
        evidence_score: { type: Type.NUMBER },
        evidence_flags: { type: Type.ARRAY, items: { type: Type.STRING } },
        is_duplicate: { type: Type.BOOLEAN }
      },
      required: [
        "category", "priority", "department_id", "department_name", 
        "ai_summary", "ai_reasoning", "ai_confidence", 
        "evidence_score", "evidence_flags", "is_duplicate"
      ]
    };

    let prompt = `Analyze the following civic complaint and categorize it appropriately.
Title: ${title}
Description: ${description}

Instructions:
- priority must be one of: High, Medium, Low
- category should be a short noun phrase (e.g., Pothole, Streetlight, Garbage, Water Leakage)
- department_id must be a short string (e.g., dept-roads, dept-sanitation, dept-electrical, dept-water, dept-drainage, dept-general)
- department_name must be the full name of the department
- ai_summary must be a one-sentence summary of the issue
- ai_reasoning must be a one-sentence explanation of why you chose this priority
- ai_confidence is a float between 0.0 and 1.0
- evidence_score is an integer from 0 to 100 based on the quality of the report and image (if provided)
- evidence_flags is an array of strings noting any issues with the evidence (e.g., "Missing photo", "Vague description"). If good, leave empty.
- is_duplicate should be false.`;

    let contents = [prompt];

    if (image_url && image_url.startsWith('data:image/')) {
      const matches = image_url.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        contents.push({
          inlineData: {
            mimeType: matches[1],
            data: matches[2]
          }
        });
      }
    } else if (image_url) {
      contents.push(`\nImage reference: ${image_url}`);
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2
      }
    });

    const resultText = response.text;
    const resultObj = JSON.parse(resultText);

    res.json(resultObj);
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Failed to analyze complaint with AI" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
