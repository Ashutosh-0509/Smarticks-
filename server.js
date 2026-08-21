import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

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
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

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
    const { email, role, isRegistration } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });

    // Handle Staff Registration specific check
    if (isRegistration && role === 'staff') {
      const { data: staff, error: staffErr } = await supabase
        .from('authorized_staff')
        .select('email')
        .eq('email', email)
        .single();
      
      if (staffErr || !staff) {
        return res.status(403).json({ error: "This email is not authorized for staff access. Contact your municipal IT administrator." });
      }
    }

    // Handle Login Account Verification
    if (!isRegistration) {
      const { data: profile, error: profileErr } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email)
        .eq('role', role)
        .single();
        
      if (profileErr || !profile) {
        return res.status(404).json({ error: "No account found for this email. Please register first." });
      }
    }

    // Rate Limit: 1 per 30s
    const lastSent = emailSendTimestamps.get(email);
    if (lastSent && Date.now() - lastSent < 30000) {
      return res.status(429).json({ error: "Please wait 30 seconds before requesting another code." });
    }

    // Security & Hygiene: Invalidate any existing OTPs for this email before issuing a new one
    await supabase.from('otp_codes').delete().eq('email', email);

    const code = generateOTP();
    const code_hash = await bcrypt.hash(code, 10);
    const expires_at = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    const payload = { email, code_hash, expires_at };
    console.log('Attempting to write to Supabase:', { table: 'otp_codes', payload });

    const { data, error: dbError } = await supabase
      .from('otp_codes')
      .insert([payload])
      .select();

    console.log('Supabase write result:', { data, error: dbError });

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
    const { email, code, requested_role, name } = req.body;
    if (!email || !code) return res.status(400).json({ error: "Email and code required" });

    const { data: otps, error: fetchError } = await supabase
      .from('otp_codes')
      .select('*')
      .eq('email', email)
      .eq('consumed', false)
      .lt('attempts', 5)
      .order('created_at', { ascending: false })
      .limit(1);

    if (fetchError || !otps || otps.length === 0) {
      return res.status(400).json({ error: "Invalid code" });
    }

    const otpRecord = otps[0];
    
    // Explicit Expiry Handling
    if (new Date(otpRecord.expires_at) < new Date()) {
      await supabase.from('otp_codes').delete().eq('id', otpRecord.id);
      return res.status(400).json({ error: "This code has expired. Request a new one." });
    }
    const isMatch = await bcrypt.compare(code, otpRecord.code_hash);

    if (!isMatch) {
      await supabase
        .from('otp_codes')
        .update({ attempts: otpRecord.attempts + 1 })
        .eq('id', otpRecord.id);
      return res.status(400).json({ error: "Invalid code" });
    }

    // Hygiene: Delete OTP record upon successful verification instead of just marking consumed
    await supabase
      .from('otp_codes')
      .delete()
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
      const insertData = { email, role: userRole };
      if (name) insertData.name = name;

      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert([insertData])
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
      
      // HACKATHON DEMO: Override their role to what they clicked on the UI
      if (requested_role && profiles[0].role !== requested_role) {
         await supabase.from('profiles').update({ role: requested_role }).eq('id', userId);
         userRole = requested_role;
      } else {
         userRole = profiles[0].role;
      }
    }

    const tokenPayloadName = (!profiles || profiles.length === 0) ? name : profiles[0].name;

    const token = jwt.sign(
      { id: userId, email, role: userRole, name: tokenPayloadName },
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

    // Detect if this is a pothole-related complaint for enhanced analysis
    const combinedText = `${title || ''} ${description || ''}`.toLowerCase();
    const isPotholeRelated = ['pothole', 'road damage', 'crater', 'asphalt', 'road surface', 'broken road', 'road hole', 'khadda', 'rut', 'depression'].some(kw => combinedText.includes(kw));

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
        is_duplicate: { type: Type.BOOLEAN },
        // Pothole-specific fields (returned for all, populated when relevant)
        pothole_severity: { type: Type.STRING },
        pothole_dimensions: { type: Type.STRING },
        is_safety_hazard: { type: Type.BOOLEAN },
        damage_type: { type: Type.STRING }
      },
      required: [
        "category", "priority", "department_id", "department_name", 
        "ai_summary", "ai_reasoning", "ai_confidence", 
        "evidence_score", "evidence_flags", "is_duplicate",
        "pothole_severity", "pothole_dimensions", "is_safety_hazard", "damage_type"
      ]
    };

    // Build prompt — enhanced with pothole-reporter vision logic when relevant
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

    // Enhanced pothole-specific prompt inspired by pothole-reporter app
    if (isPotholeRelated || (image_url && image_url.startsWith('data:image/'))) {
      prompt += `

POTHOLE / ROAD DAMAGE ANALYSIS (adapted from pothole-reporter):
If this complaint involves road damage, also analyze:
- pothole_severity: Must be one of "Minor" (< 5cm deep, cosmetic surface wear), "Moderate" (5-10cm deep, vehicle hazard), "Severe" (> 10cm deep or > 30cm wide, immediate danger), or "None" if not a road damage issue.
- pothole_dimensions: Estimate dimensions from the photo if available (e.g., "Approx. 25cm wide × 8cm deep"), or "Not visible" if no photo.
- is_safety_hazard: true if the damage could cause vehicle damage, pedestrian injury, or forces traffic to swerve.
- damage_type: Classify the road damage type. Must be one of: "Pothole Cavity", "Failed Patch", "Surface Breakup", "Rut/Depression", "Edge Break", "Crocodile Cracking", "None".

If the issue is NOT road damage related, set pothole_severity to "None", pothole_dimensions to "N/A", is_safety_hazard to false, and damage_type to "None".`;
    } else {
      prompt += `

For the pothole-specific fields:
- pothole_severity: Set to "None" since this is not a road damage complaint.
- pothole_dimensions: Set to "N/A".
- is_safety_hazard: Set to false.
- damage_type: Set to "None".`;
    }

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

// =========================================================
// Pothole Officer Lookup Endpoint
// Searches the ward_officers table by location keywords
// =========================================================
app.post('/api/pothole/officer', async (req, res) => {
  try {
    const { location, coordinates } = req.body;

    if (!location) {
      return res.status(400).json({ error: "Location is required" });
    }

    const locationLower = location.toLowerCase();

    // Fetch all ward officers from Supabase
    const { data: officers, error: dbError } = await supabase
      .from('ward_officers')
      .select('*');

    if (dbError) {
      console.error("Ward officers DB error:", dbError);
      return res.status(500).json({ error: "Failed to query officer database" });
    }

    if (!officers || officers.length === 0) {
      return res.json({
        found: false,
        message: "No officer records found in database. Please run setup-pothole-officers.sql in your Supabase SQL Editor."
      });
    }

    // Score each ward by how many location keywords match the user's location string
    let bestMatch = null;
    let bestScore = 0;

    for (const officer of officers) {
      if (officer.ward_no === 'GEN') continue; // skip generic fallback for now

      const keywords = officer.location_keywords || [];
      let score = 0;

      for (const keyword of keywords) {
        if (locationLower.includes(keyword.toLowerCase())) {
          // Longer keyword matches are more specific and score higher
          score += keyword.length;
        }
      }

      // Also check ward_name and city
      if (locationLower.includes(officer.ward_name.toLowerCase())) {
        score += officer.ward_name.length;
      }
      if (locationLower.includes(officer.city.toLowerCase())) {
        score += 2;
      }

      if (score > bestScore) {
        bestScore = score;
        bestMatch = officer;
      }
    }

    // If no specific match found, use the generic fallback
    if (!bestMatch) {
      bestMatch = officers.find(o => o.ward_no === 'GEN') || null;
    }

    if (!bestMatch) {
      return res.json({
        found: false,
        message: "Could not determine the responsible ward for this location."
      });
    }

    res.json({
      found: true,
      ward_no: bestMatch.ward_no,
      ward_name: bestMatch.ward_name,
      city: bestMatch.city,
      officer_name: bestMatch.officer_name,
      officer_designation: bestMatch.officer_designation,
      officer_email: bestMatch.officer_email,
      officer_phone: bestMatch.officer_phone,
      officer_department: bestMatch.officer_department,
      contractor_name: bestMatch.contractor_name,
      contractor_contact: bestMatch.contractor_contact
    });
  } catch (error) {
    console.error("Officer lookup error:", error);
    res.status(500).json({ error: "Failed to look up responsible officer" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Scheduled Cleanup Job: Delete expired OTPs every 15 minutes as a fallback safety net
setInterval(async () => {
  try {
    const { error } = await supabase
      .from('otp_codes')
      .delete()
      .lt('expires_at', new Date().toISOString());
    if (error) {
      console.error("Scheduled OTP Cleanup Error:", error);
    } else {
      console.log(`[${new Date().toISOString()}] Cleaned up expired OTPs`);
    }
  } catch (err) {
    console.error("Scheduled OTP Cleanup Exception:", err);
  }
}, 15 * 60 * 1000);
