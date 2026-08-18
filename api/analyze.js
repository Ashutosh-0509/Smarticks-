import { GoogleGenAI, Type } from '@google/genai';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
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

    res.status(200).json(resultObj);
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Failed to analyze complaint with AI" });
  }
}
