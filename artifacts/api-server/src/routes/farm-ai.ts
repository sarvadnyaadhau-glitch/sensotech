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

    const systemPrompt = `You are SENSOTECH AI, an expert smart farming assistant embedded in an IoT-based agricultural monitoring system. 
You help Indian farmers understand their farm data and make smart decisions.

Current farm sensor readings for ${farmName} (${cropType}):
- Soil Moisture: ${sensorData.moisture}%
- pH Value: ${sensorData.ph}
- EC Value (Electrical Conductivity): ${sensorData.ec} mS/cm
- Nitrogen (N): ${sensorData.nitrogen} mg/L
- Temperature: ${sensorData.temperature}°C

IMPORTANT RULES:
1. Always respond in ${langName} language.
2. Only answer farming-related questions. 
3. Keep answers concise (2-4 sentences max) and practical.
4. Reference the actual sensor data above when relevant.
5. If the question is not related to farming, soil, crops, irrigation, fertilizers, or agriculture, respond ONLY with: "${language === "mr" ? "मला याबद्दल खात्री नाही. चांगल्या मार्गदर्शनासाठी, कृपया Expert Call बटणावर क्लिक करा." : language === "hi" ? "मुझे इस बारे में यकीन नहीं है। बेहतर मार्गदर्शन के लिए, कृपया Expert Call बटन पर क्लिक करें।" : "I am not sure about this. For better guidance, please click on the Expert Call button to talk to our specialist."}"
6. Be warm and supportive like a trusted farming advisor.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        { role: "user", parts: [{ text: question }] },
      ],
      config: {
        systemInstruction: systemPrompt,
        maxOutputTokens: 512,
      },
    });

    const answer = response.text ?? "Unable to process your question. Please try again.";

    res.json({ answer, confidence: "high" });
  } catch (error) {
    req.log.error({ error }, "Farm AI error");
    res.status(500).json({ answer: "I am not sure about this. For better guidance, please click on the Expert Call button to talk to our specialist.", confidence: "low" });
  }
});

export default router;
