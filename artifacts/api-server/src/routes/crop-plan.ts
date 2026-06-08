import { Router } from "express";
import { ai } from "@workspace/integrations-gemini-ai";

const router = Router();

/* ════════════════════════════════════════════════════════════════════════
   CROP PLANNING ENGINE — Multi-step conversational flow
   ════════════════════════════════════════════════════════════════════════ */

interface CropSchedule {
  landPrep: string;
  seedTreatment: string;
  sowing: string;
  fertilizerDates: string[];
  irrigationDates: string[];
  pestInspectionDates: string[];
  harvestDate: string;
  totalDays: number;
}

const langMap: Record<string, string> = {
  en: "English",
  mr: "Marathi",
  hi: "Hindi",
};

/* ── Crop timeline data (days relative to start) ── */
const CROP_TIMELINES: Record<string, {
  totalDays: number;
  landPrep: number;          // day offset
  seedTreatment: number;      // day offset
  sowing: number;             // day offset
  fertilizers: number[];      // day offsets
  irrigations: number[];      // day offsets
  pestInspections: number[];  // day offsets
  harvest: number;            // day offset
}> = {
  Cotton: {
    totalDays: 160,
    landPrep: 0,
    seedTreatment: 0,
    sowing: 3,
    fertilizers: [20, 45, 70, 100],
    irrigations: [3, 10, 20, 35, 50, 70, 90, 110, 130, 145],
    pestInspections: [15, 30, 45, 60, 75, 90, 105, 120, 135, 150],
    harvest: 155,
  },
  Pomegranate: {
    totalDays: 200,
    landPrep: 0,
    seedTreatment: 0,
    sowing: 7,
    fertilizers: [30, 60, 90, 120, 150],
    irrigations: [7, 14, 28, 42, 56, 70, 84, 98, 112, 126, 140, 154, 168, 182],
    pestInspections: [30, 60, 90, 120, 150, 180],
    harvest: 190,
  },
  Soybean: {
    totalDays: 100,
    landPrep: 0,
    seedTreatment: 0,
    sowing: 2,
    fertilizers: [25, 50],
    irrigations: [2, 10, 20, 35, 50, 65, 80],
    pestInspections: [15, 30, 45, 60, 75, 90],
    harvest: 95,
  },
  Wheat: {
    totalDays: 130,
    landPrep: 0,
    seedTreatment: 0,
    sowing: 5,
    fertilizers: [25, 55, 85],
    irrigations: [5, 20, 40, 60, 80, 100],
    pestInspections: [20, 40, 60, 80, 100, 120],
    harvest: 125,
  },
  "Bengal Gram": {
    totalDays: 120,
    landPrep: 0,
    seedTreatment: 0,
    sowing: 3,
    fertilizers: [20, 50, 80],
    irrigations: [3, 15, 30, 50, 70, 90],
    pestInspections: [15, 30, 45, 60, 75, 90, 105],
    harvest: 115,
  },
  Rice: {
    totalDays: 140,
    landPrep: 0,
    seedTreatment: 0,
    sowing: 5,
    fertilizers: [20, 40, 60, 80],
    irrigations: [5, 12, 20, 30, 40, 55, 70, 85, 100, 115],
    pestInspections: [20, 40, 60, 80, 100, 120],
    harvest: 135,
  },
  Maize: {
    totalDays: 110,
    landPrep: 0,
    seedTreatment: 0,
    sowing: 3,
    fertilizers: [20, 40, 60],
    irrigations: [3, 12, 25, 40, 55, 70, 85],
    pestInspections: [15, 30, 45, 60, 75, 90],
    harvest: 105,
  },
  Turmeric: {
    totalDays: 270,
    landPrep: 0,
    seedTreatment: 0,
    sowing: 7,
    fertilizers: [30, 60, 90, 120, 150, 180],
    irrigations: [7, 21, 35, 49, 63, 77, 91, 105, 119, 133, 147, 161, 175, 189, 203, 217, 231, 245],
    pestInspections: [30, 60, 90, 120, 150, 180, 210, 240],
    harvest: 260,
  },
  Onion: {
    totalDays: 130,
    landPrep: 0,
    seedTreatment: 0,
    sowing: 5,
    fertilizers: [20, 45, 70, 95],
    irrigations: [5, 15, 28, 42, 56, 70, 84, 98, 112],
    pestInspections: [20, 40, 60, 80, 100, 120],
    harvest: 125,
  },
  Tomato: {
    totalDays: 100,
    landPrep: 0,
    seedTreatment: 0,
    sowing: 3,
    fertilizers: [15, 30, 50, 70],
    irrigations: [3, 10, 20, 30, 42, 55, 68, 80],
    pestInspections: [15, 30, 45, 60, 75, 90],
    harvest: 95,
  },
  Lemon: {
    totalDays: 180,
    landPrep: 0,
    seedTreatment: 0,
    sowing: 10,
    fertilizers: [30, 60, 90, 120],
    irrigations: [10, 25, 45, 65, 85, 105, 125, 145, 165],
    pestInspections: [30, 60, 90, 120, 150],
    harvest: 170,
  },
  Groundnut: {
    totalDays: 110,
    landPrep: 0,
    seedTreatment: 0,
    sowing: 3,
    fertilizers: [20, 45, 70],
    irrigations: [3, 15, 30, 45, 60, 75, 90],
    pestInspections: [20, 40, 60, 80, 100],
    harvest: 105,
  },
  Jowar: {
    totalDays: 105,
    landPrep: 0,
    seedTreatment: 0,
    sowing: 5,
    fertilizers: [25, 50],
    irrigations: [5, 20, 35, 50, 65, 80],
    pestInspections: [20, 40, 60, 80],
    harvest: 100,
  },
  Bajra: {
    totalDays: 80,
    landPrep: 0,
    seedTreatment: 0,
    sowing: 3,
    fertilizers: [20, 45],
    irrigations: [3, 15, 30, 45, 60],
    pestInspections: [15, 30, 45, 60],
    harvest: 75,
  },
};

/* ── Date formatting helper ── */
function addDays(base: string, offset: number): string {
  const d = new Date(base);
  d.setDate(d.getDate() + offset);
  return d.toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

/* ── Generate schedule for a crop + start date ── */
function generateSchedule(crop: string, startDate: string): CropSchedule | null {
  const tl = CROP_TIMELINES[crop];
  if (!tl) return null;
  return {
    landPrep: addDays(startDate, tl.landPrep),
    seedTreatment: addDays(startDate, tl.seedTreatment),
    sowing: addDays(startDate, tl.sowing),
    fertilizerDates: tl.fertilizers.map((d) => addDays(startDate, d)),
    irrigationDates: tl.irrigations.map((d) => addDays(startDate, d)),
    pestInspectionDates: tl.pestInspections.map((d) => addDays(startDate, d)),
    harvestDate: addDays(startDate, tl.harvest),
    totalDays: tl.totalDays,
  };
}

/* ── Format schedule in the selected language ── */
function formatSchedule(
  schedule: CropSchedule,
  crop: string,
  startDate: string,
  lang: string,
): string {
  const l = langMap[lang] || "English";

  if (l === "Hindi") {
    return `\u{1F4C5} **${crop} की खेती योजना** (शुरू: ${startDate})

**\u2705 भूमि तैयारी:** ${schedule.landPrep}
**\u2705 बीज उपचार:** ${schedule.seedTreatment}
**\u2705 बोवाई:** ${schedule.sowing}

**\u{1F4E6} उर्वरक तिथियां:**
${schedule.fertilizerDates.map((d) => `\u2022 ${d}`).join("\n")}

**\u{1F4A7} सिंचाई तिथियां:**
${schedule.irrigationDates.map((d) => `\u2022 ${d}`).join("\n")}

**\u{1F41E} कीट जांच:**
${schedule.pestInspectionDates.map((d) => `\u2022 ${d}`).join("\n")}

**\u{1F33E} फसल कटाई:** ${schedule.harvestDate}
**\u23F1\uFE0F कुल अवधि:** ${schedule.totalDays} दिन`;
  }

  if (l === "Marathi") {
    return `\u{1F4C5} **${crop} ची शेती योजना** (सुरू: ${startDate})

**\u2705 जमीन तयारी:** ${schedule.landPrep}
**\u2705 बीज उपचार:** ${schedule.seedTreatment}
**\u2705 पेरणी:** ${schedule.sowing}

**\u{1F4E6} खत तारखा:**
${schedule.fertilizerDates.map((d) => `\u2022 ${d}`).join("\n")}

**\u{1F4A7} सिंचन तारखा:**
${schedule.irrigationDates.map((d) => `\u2022 ${d}`).join("\n")}

**\u{1F41E} किटक तपासणी:**
${schedule.pestInspectionDates.map((d) => `\u2022 ${d}`).join("\n")}

**\u{1F33E} कापणी:** ${schedule.harvestDate}
**\u23F1\uFE0F एकूण कालावधी:** ${schedule.totalDays} दिवस`;
  }

  // English
  return `\u{1F4C5} **${crop} Cultivation Plan** (Start: ${startDate})

**\u2705 Land Preparation:** ${schedule.landPrep}
**\u2705 Seed Treatment:** ${schedule.seedTreatment}
**\u2705 Sowing:** ${schedule.sowing}

**\u{1F4E6} Fertilizer Dates:**
${schedule.fertilizerDates.map((d) => `\u2022 ${d}`).join("\n")}

**\u{1F4A7} Irrigation Dates:**
${schedule.irrigationDates.map((d) => `\u2022 ${d}`).join("\n")}

**\u{1F41E} Pest Inspections:**
${schedule.pestInspectionDates.map((d) => `\u2022 ${d}`).join("\n")}

**\u{1F33E} Harvest Date:** ${schedule.harvestDate}
**\u23F1\uFE0F Total Duration:** ${schedule.totalDays} days`;
}

/* ── Recommend crops based on sensor data ── */
function recommendCrops(sensorData: any): string[] {
  const { moisture, ph, nitrogen, phosphorus, potassium } = sensorData;
  const crops: string[] = [];

  // Cotton: pH 6.0-8.0, moderate moisture, needs NPK
  if (ph >= 6.0 && ph <= 8.0 && moisture >= 40 && moisture <= 70) {
    crops.push("Cotton");
  }
  // Soybean: pH 6.0-7.5, moderate moisture
  if (ph >= 6.0 && ph <= 7.5 && moisture >= 35 && moisture <= 65) {
    crops.push("Soybean");
  }
  // Wheat: pH 6.5-7.5, moderate moisture
  if (ph >= 6.5 && ph <= 7.5 && moisture >= 30 && moisture <= 60) {
    crops.push("Wheat");
  }
  // Rice: pH 5.5-7.5, high moisture
  if (ph >= 5.5 && ph <= 7.5 && moisture >= 50) {
    crops.push("Rice");
  }
  // Pomegranate: pH 6.0-7.5, moderate moisture
  if (ph >= 6.0 && ph <= 7.5 && moisture >= 35) {
    crops.push("Pomegranate");
  }
  // Bengal Gram: pH 6.0-8.5, moderate moisture
  if (ph >= 6.0 && ph <= 8.5 && moisture >= 30) {
    crops.push("Bengal Gram");
  }
  // Maize: pH 5.8-7.5, moderate moisture
  if (ph >= 5.8 && ph <= 7.5 && moisture >= 35) {
    crops.push("Maize");
  }
  // Groundnut: pH 6.0-7.5, moderate moisture
  if (ph >= 6.0 && ph <= 7.5 && moisture >= 35) {
    crops.push("Groundnut");
  }
  // Jowar: pH 5.5-7.5, moderate moisture
  if (ph >= 5.5 && ph <= 7.5 && moisture >= 30) {
    crops.push("Jowar");
  }
  // Bajra: pH 5.5-7.5, moderate moisture
  if (ph >= 5.5 && ph <= 7.5 && moisture >= 30) {
    crops.push("Bajra");
  }

  // Fallback if no matches
  if (crops.length === 0) {
    crops.push("Cotton", "Soybean", "Bengal Gram");
  }

  return crops;
}

/* ── Format recommendation message ── */
function formatRecommendation(crops: string[], sensorData: any, lang: string): string {
  const l = langMap[lang] || "English";
  const cropList = crops.map((c, i) => `${i + 1}. ${c}`).join("\n");

  if (l === "Hindi") {
    return `\u{1F4C9} **आपकी मिट्टी के आंकड़ों के आधार पर:**
\u{1F33E} pH: ${sensorData.ph}
\u{1F4A7} नमी: ${sensorData.moisture}%
\u{1F331} N: ${sensorData.nitrogen}, P: ${sensorData.phosphorus}, K: ${sensorData.potassium}

**\u{1F31F} अनुशंसित फसलें:**
${cropList}

\u{1F449} क्या आप इनमें से किसी फसल की विस्तृत खेती योजना चाहते हैं? कृपया फसल का नाम लिखें।`;
  }

  if (l === "Marathi") {
    return `\u{1F4C9} **तुमच्या मातीच्या आकड्यांवर आधारित:**
\u{1F33E} pH: ${sensorData.ph}
\u{1F4A7} आर्द्रता: ${sensorData.moisture}%
\u{1F331} N: ${sensorData.nitrogen}, P: ${sensorData.phosphorus}, K: ${sensorData.potassium}

**\u{1F31F} शिफारस केलेली पीके:**
${cropList}

\u{1F449} या पैकी कोणत्याही पिकाची विस्तृत शेती योजना हवी आहे का? कृपया पिकाचे नाव लिहा.`;
  }

  return `\u{1F4C9} **Based on your soil data:**
\u{1F33E} pH: ${sensorData.ph}
\u{1F4A7} Moisture: ${sensorData.moisture}%
\u{1F331} N: ${sensorData.nitrogen}, P: ${sensorData.phosphorus}, K: ${sensorData.potassium}

**\u{1F31F} Recommended Crops:**
${cropList}

\u{1F449} Would you like a detailed farming plan for any of these? Please type the crop name.`;
}

/* ── Confirm plan prompt ── */
function confirmPlanPrompt(crop: string, lang: string): string {
  const l = langMap[lang] || "English";
  if (l === "Hindi") return `\u{1F33E} **${crop}** चुन लिया गया।\n\nक्या मैं इसकी पूरी खेती योजना तैयार करूँ?\n\n\u{1F449} "हाँ" टाइप करें या स्टार्ट डेट बताएं (उदाहरण: 15 जनवरी 2026)`;
  if (l === "Marathi") return `\u{1F33E} **${crop}** निवडले.\n\nकाय मी याची संपूर्ण शेती योजना तयार करू?\n\n\u{1F449} "हो" टाइप करा किंवा सुरू तारीख सांगा (उदाहरण: 15 जानेवारी 2026)`;
  return `\u{1F33E} **${crop}** selected.\n\nShould I generate a complete cultivation plan?\n\n\u{1F449} Type "yes" or tell me the start date (e.g., 15 January 2026)`;
}

/* ── Ask for date prompt ── */
function askDatePrompt(crop: string, lang: string): string {
  const l = langMap[lang] || "English";
  if (l === "Hindi") return `\u{1F4C5} **${crop}** की खेती योजना के लिए, कृपया शुरू तारीख बताएं।\n\nउदाहरण: "15 जनवरी 2026" या "1 फरवरी 2026"`;
  if (l === "Marathi") return `\u{1F4C5} **${crop}** ची शेती योजना साठी, कृपया सुरू तारीख सांगा.\n\nउदाहरण: "15 जानेवारी 2026" किंवा "1 फेब्रुवारी 2026"`;
  return `\u{1F4C5} For the **${crop}** cultivation plan, please tell me the start date.\n\nExample: "15 January 2026" or "1 February 2026"`;
}

/* ── Try to parse a date from user text ── */
function parseDate(text: string): Date | null {
  const t = text.trim();
  // Try ISO format
  const iso = new Date(t);
  if (!isNaN(iso.getTime())) return iso;

  // Try common formats: "15 Jan 2026", "15 January 2026", "1/2/2026", etc.
  const patterns = [
    /(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{4})/i,
    /(\d{1,2})\/(\d{1,2})\/(\d{4})/,
    /(\d{1,2})-(\d{1,2})-(\d{4})/,
    /(\d{1,2})\s+(\d{1,2})\s+(\d{4})/,
  ];
  const months: Record<string, number> = {
    jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
    jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
  };

  for (const p of patterns) {
    const m = t.match(p);
    if (m) {
      let d: number, mo: number, y: number;
      if (m[0].toLowerCase().includes("jan") || m[0].toLowerCase().includes("feb")) {
        // Named month
        const mn = m[2].toLowerCase().substring(0, 3);
        d = parseInt(m[1], 10);
        mo = months[mn] ?? 0;
        y = parseInt(m[3], 10);
      } else {
        d = parseInt(m[1], 10);
        mo = parseInt(m[2], 10) - 1;
        y = parseInt(m[3], 10);
      }
      const candidate = new Date(y, mo, d);
      if (!isNaN(candidate.getTime())) return candidate;
    }
  }

  // Try "today", "tomorrow", "next week"
  const lower = t.toLowerCase();
  const now = new Date();
  if (lower.includes("today")) return now;
  if (lower.includes("tomorrow")) { const d = new Date(now); d.setDate(d.getDate() + 1); return d; }
  if (lower.includes("next week")) { const d = new Date(now); d.setDate(d.getDate() + 7); return d; }

  return null;
}

/* ════════════════════════════════════════════════════════════════════════
   API ROUTES
   ════════════════════════════════════════════════════════════════════════ */

/* ── Step 1: Get crop recommendations ── */
router.post("/recommend", (req, res) => {
  const { sensorData, language } = req.body;
  try {
    const crops = recommendCrops(sensorData);
    const response = formatRecommendation(crops, sensorData, language || "en");
    res.json({
      type: "recommendation",
      crops,
      answer: response,
    });
  } catch {
    res.status(500).json({ answer: "Failed to generate recommendations." });
  }
});

/* ── Step 2: Confirm crop selection ── */
router.post("/confirm", (req, res) => {
  const { crop, language } = req.body;
  try {
    const answer = confirmPlanPrompt(crop, language || "en");
    res.json({
      type: "confirm",
      crop,
      answer,
    });
  } catch {
    res.status(500).json({ answer: "Failed to confirm crop." });
  }
});

/* ── Step 3: Ask for start date ── */
router.post("/ask-date", (req, res) => {
  const { crop, language } = req.body;
  try {
    const answer = askDatePrompt(crop, language || "en");
    res.json({
      type: "ask-date",
      crop,
      answer,
    });
  } catch {
    res.status(500).json({ answer: "Failed to ask for date." });
  }
});

/* ── Step 4: Generate schedule ── */
router.post("/schedule", (req, res) => {
  const { crop, startDate, language } = req.body;
  try {
    const parsed = parseDate(startDate);
    if (!parsed) {
      res.status(400).json({
        answer: language === "hi"
          ? "तारीख समझ नहीं आई। कृपया सही तारीख बताएं (उदाहरण: 15 जनवरी 2026)।"
          : language === "mr"
          ? "तारीख समजली नाही. कृपया योग्य तारीख सांगा (उदाहरण: 15 जानेवारी 2026)."
          : "Could not understand the date. Please provide a valid date (e.g., 15 January 2026).",
      });
      return;
    }

    const isoDate = parsed.toISOString().split("T")[0];
    const schedule = generateSchedule(crop, isoDate);
    if (!schedule) {
      res.status(400).json({
        answer: language === "hi"
          ? `माफ करें, ${crop} के लिए खेती योजना उपलब्ध नहीं है।`
          : language === "mr"
          ? `माफ करा, ${crop} साठी शेती योजना उपलब्ध नाही.`
          : `Sorry, cultivation plan for ${crop} is not available.`,
      });
      return;
    }

    const formatted = formatSchedule(schedule, crop, isoDate, language || "en");
    res.json({
      type: "schedule",
      crop,
      startDate: isoDate,
      schedule,
      answer: formatted,
    });
  } catch {
    res.status(500).json({ answer: "Failed to generate schedule." });
  }
});

/* ── Fallback: parse any crop-related intent and route ── */
router.post("/ask", async (req, res) => {
  const { question, language, sensorData, farmName, cropType } = req.body;
  const l = language || "en";

  // Quick intent detection for crop planning
  const q = (question || "").toLowerCase();
  const isRecommend = /which crop|kons?i fasal|kons?i ph?asl|kons?i piik|kons?e pik|kouns?i fasal|kaun sa crop|kaun si fasal|kaun sa beej|kons?i beej|suggest crop|recommend crop|best crop|suitable crop|which crop to|what crop to/.test(q);
  const isYes = /^(yes|haan|ha|h|haan|ha|yes|y|hooo|hoo|hooo|han|haan|hnn|haan|haa|ho|ho|haan|hn)$/i.test(q.trim());
  const isNo = /^(no|nahi|na|n|nhi|nahi|naa|nah|nahe|naheen|naa)$/i.test(q.trim());

  // If it's a recommendation request, return recommendations
  if (isRecommend) {
    const crops = recommendCrops(sensorData);
    const response = formatRecommendation(crops, sensorData, l);
    return res.json({
      type: "recommendation",
      crops,
      answer: response,
    });
  }

  // If it's a simple yes/no, handle it through the normal flow
  // The frontend will handle state management
  // Fallback to Gemini for everything else
  try {
    const langName = langMap[l] || "English";
    const crop = cropType || sensorData.crop || "Unknown";
    const fertilizer = sensorData.fertilizer || "Not specified";

    const systemPrompt = `You are SENSOTECH AI, an expert smart farming assistant.
Current live sensor readings for ${farmName || "the farm"} (Crop: ${crop}):
- Soil Moisture: ${sensorData.moisture}%
- pH Value: ${sensorData.ph}
- Nitrogen (N): ${sensorData.nitrogen} mg/L
- Phosphorus (P): ${sensorData.phosphorus} mg/L
- Potassium (K): ${sensorData.potassium} mg/L
- AI Recommended Crop: ${crop}
- AI Recommended Fertilizer: ${fertilizer}

IMPORTANT RULES:
1. You MUST answer ONLY in ${langName} language.
2. Keep answers concise — 2 to 4 sentences max.
3. ALWAYS spell "SENSOTECH" exactly in ALL CAPS.
4. The crop name is "${crop}". Do NOT translate it.
5. Be warm, encouraging, and supportive.
6. When talking about crops — refer to "${crop}".
7. When talking about fertilizer — refer to "${fertilizer}".`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: "user", parts: [{ text: question }] }],
      config: { systemInstruction: systemPrompt, maxOutputTokens: 8192 },
    });

    const answer: string =
      response.text ||
      (response as any).candidates?.[0]?.content?.parts?.[0]?.text ||
      (response as any).candidates?.[0]?.content?.parts?.map((p: any) => p.text).filter(Boolean).join("") ||
      "";

    // Sanitize
    let sanitized = answer;
    sanitized = sanitized.replace(/Sensotech/gi, "SENSOTECH");
    const cottonVariants = ["Kapas", "kapas", "कपास", "कापूस", "कापस", "कापूस", "कापस"];
    for (const v of cottonVariants) {
      const re = new RegExp(v, "g");
      sanitized = sanitized.replace(re, "Cotton");
    }

    res.json({ answer: sanitized, confidence: "high" });
  } catch (error) {
    req.log.error({ error }, "Crop plan fallback error");
    res.status(500).json({
      answer: l === "mr"
        ? "माफ करा, AI सध्या उपलब्ध नाही. कृपया पुन्हा प्रयत्न करा."
        : l === "hi"
        ? "माफ करें, AI अभी उपलब्ध नहीं है। कृपया दोबारा कोशिश करें।"
        : "Sorry, AI is temporarily unavailable. Please try again.",
    });
  }
});

export default router;
