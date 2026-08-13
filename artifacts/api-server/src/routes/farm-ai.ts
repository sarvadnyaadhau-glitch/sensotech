import { Router } from "express";
import { ai, isAIConfigured } from "@workspace/integrations-gemini-ai";

const router = Router();

router.post("/ask", async (req, res) => {
  const { question, language, sensorData, farmName, cropType } = req.body;

  // Validate request body
  if (!question || typeof question !== "string" || !question.trim()) {
    res.status(400).json({ error: "question is required and must be a non-empty string" });
    return;
  }
  if (!sensorData || typeof sensorData !== "object") {
    res.status(400).json({ error: "sensorData is required" });
    return;
  }

  // If AI isn't configured, return a controlled 503
  if (!isAIConfigured()) {
    res.status(503).json({ error: "AI service not configured" });
    return;
  }

  const langMap: Record<string, string> = {
    en: "English",
    mr: "Marathi",
    hi: "Hindi",
  };
  const langName = langMap[language] || "English";

  const crop = cropType || sensorData.crop || "Unknown";
  const fertilizer = sensorData.fertilizer || "Not specified";

  const systemPrompt = `You are SENSOTECH AI, an expert smart farming assistant embedded in an IoT-based agricultural monitoring system.
You help Indian farmers understand their farm data and make smart decisions.

Current live sensor readings for ${farmName || "the farm"} (Crop: ${crop}):
- Soil Moisture: ${sensorData.moisture}%
- pH Value: ${sensorData.ph}
- Nitrogen (N): ${sensorData.nitrogen} mg/L
- Phosphorus (P): ${sensorData.phosphorus} mg/L
- Potassium (K): ${sensorData.potassium} mg/L
- Temperature: ${sensorData.temperature} °C
- Electrical Conductivity (EC): ${sensorData.ec} µS/cm
- AI Recommended Crop: ${crop}
- AI Recommended Fertilizer: ${fertilizer}

IMPORTANT RULES:
1. You MUST answer ONLY in ${langName} language. Do not use any other language at all. Every single word must be in ${langName}.
2. Only answer farming-related questions (crops, soil, irrigation, fertilizers, weather, pests, harvest).
3. Keep answers concise — 2 to 4 sentences max. Be direct and practical.
4. Use the actual sensor data aboveIf the user asks about temperature or EC, ALWAYS answer using the live Temperature and EC values above. Never say the data is unavailable if those values are present. when the question is about soil health, crops, or fertilizer.
5. ALWAYS spell the brand name "SENSOTECH" exactly in ALL CAPS. Never change it to "Sensotech", "Sensotech", or any other variation.
6. The crop name is "${crop}". Always use this exact name. Do NOT translate it to "Kapas", "कपास", "कापूस", or any other language variant.
7. If the question is about who created SENSOTECH, who built the app, who is the founder, or who made you, answer:
   - English: "SENSOTECH was created by Vanshal Mohan Adhau."
   - Marathi: "SENSOTECH ची निर्मिती वंशल मोहन अधाव यांनी केली."
   - Hindi: "SENSOTECH का निर्माण वंशल मोहन अधाव ने किया।"
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: "user", parts: [{ text: question }] }],
      config: {
        systemInstruction: systemPrompt,
        maxOutputTokens: 8192,
      },
    });

    const answer: string =
      response.text ||
      (response as any).candidates?.[0]?.content?.parts?.[0]?.text ||
      (response as any).candidates?.[0]?.content?.parts
        ?.map((p: any) => p.text)
        .filter(Boolean)
        .join("") ||
      "";

    req.log.info(
      {
        answerLength: answer.length,
        finishReason: (response as any).candidates?.[0]?.finishReason,
      },
      "Farm AI response",
    );

    if (!answer) {
      res.status(502).json({ error: "AI response was empty" });
      return;
    }

    // Sanitize brand name and crop name — catch any AI misspellings
    let sanitized = answer.replace(/Sensotech/gi, "SENSOTECH");
    const cottonVariants = ["Kapas", "kapas", "कपास", "कापूस", "कपास", "कापूस", "कापस"];
    for (const v of cottonVariants) {
      const re = new RegExp(v, "g");
      sanitized = sanitized.replace(re, "Cotton");
    }

    res.json({ answer: sanitized, confidence: "high" });
  } catch (error: unknown) {
    req.log.error({ err: error instanceof Error ? { message: error.message, stack: error.stack } : String(error) }, "Farm AI error");

    const isConfigError = error instanceof Error && /not configured/i.test(error.message);

    if (isConfigError) {
      res.status(503).json({ error: "AI service not configured" });
    } else {
      res.status(502).json({ error: "AI service temporarily unavailable" });
    }
  }
});

export default router;
