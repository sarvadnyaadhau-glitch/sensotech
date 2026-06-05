import { Router } from "express";
import { ai } from "@workspace/integrations-gemini-ai";

const router = Router();

router.post("/ask", async (req, res) => {
  try {
    const { question, language, sensorData, farmName, cropType } = req.body;

    if (!question || !sensorData) {
      res.status(400).json({ error: "question and sensorData are required" });
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
- AI Recommended Crop: ${crop}
- AI Recommended Fertilizer: ${fertilizer}

IMPORTANT RULES:
1. Always respond in ${langName} language ONLY. Never mix languages.
2. Only answer farming-related questions (crops, soil, irrigation, fertilizers, weather, pests, harvest).
3. Keep answers concise — 2 to 4 sentences max. Be direct and practical.
4. Use the actual sensor data above when the question is about soil health, crops, or fertilizer.
5. If the question is NOT related to farming, soil, crops, irrigation, fertilizers, pests, or agriculture, respond ONLY with:
   - English: "I am not sure about this. For better guidance, please click on the Expert Call button."
   - Marathi: "मला याबद्दल खात्री नाही. चांगल्या मार्गदर्शनासाठी, कृपया Expert Call बटण वापरा."
   - Hindi: "मुझे इस बारे में यकीन नहीं है। बेहतर मार्गदर्शन के लिए, कृपया Expert Call बटन दबाएं।"
6. Be warm, encouraging, and supportive like a trusted local farming advisor.
7. When talking about crops — refer to "${crop}" from the sensor data.
8. When talking about fertilizer — refer to "${fertilizer}" from the sensor data.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        { role: "user", parts: [{ text: question }] },
      ],
      config: {
        systemInstruction: systemPrompt,
        maxOutputTokens: 256,
      },
    });

    const answer = response.text ?? "Unable to process your question. Please try again.";
    res.json({ answer, confidence: "high" });
  } catch (error) {
    req.log.error({ error }, "Farm AI error");
    res.status(500).json({
      answer: language === "mr"
        ? "माफ करा, AI सध्या उपलब्ध नाही. कृपया पुन्हा प्रयत्न करा."
        : language === "hi"
        ? "माफ करें, AI अभी उपलब्ध नहीं है। कृपया दोबारा कोशिश करें।"
        : "Sorry, AI is temporarily unavailable. Please try again.",
      confidence: "low",
    });
  }
});

export default router;
