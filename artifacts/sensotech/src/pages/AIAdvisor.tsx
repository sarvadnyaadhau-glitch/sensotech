import { Leaf } from "lucide-react";
import { t, type Language } from "@/lib/translations";
import { useSensorData } from "@/lib/useSensorData";

interface AIAdvisorProps {
  onBack: () => void;
  lang: Language;
}

export default function AIAdvisor({ onBack, lang }: AIAdvisorProps) {
  const { data: sensorData, loading } = useSensorData();

  const cropName = sensorData.crop || "Cotton";
  const fertilizerName = sensorData.fertilizer || "No Fertilizer Required";

  const sections = [
    {
      id: "crop",
      icon: "🌱",
      title: t(lang, "cropRecommendation"),
      color: "#4ade80",
      bgColor: "rgba(74, 222, 128, 0.08)",
      borderColor: "rgba(74, 222, 128, 0.25)",
      badge: loading ? "Loading..." : cropName,
      badgeColor: "#4ade80",
      content:
        lang === "mr"
          ? `तुमच्या मातीचे EC मूल्य आणि pH (${sensorData.ph}) यांच्या आधारावर, ${cropName} साठी वाढ सध्या इष्टतम आहे. नायट्रोजन ${sensorData.nitrogen} mg/L, फॉस्फरस ${sensorData.phosphorus} mg/L आणि पोटॅशियम ${sensorData.potassium} mg/L आहे.`
          : lang === "hi"
          ? `आपकी मिट्टी के pH (${sensorData.ph}) और पोषक तत्वों के आधार पर, ${cropName} की खेती के लिए परिस्थितियां उपयुक्त हैं। नाइट्रोजन ${sensorData.nitrogen} mg/L, फॉस्फोरस ${sensorData.phosphorus} mg/L और पोटेशियम ${sensorData.potassium} mg/L है।`
          : `Based on your soil pH (${sensorData.ph}) and nutrient levels, conditions are suitable for growing ${cropName}. Nitrogen: ${sensorData.nitrogen} mg/L, Phosphorus: ${sensorData.phosphorus} mg/L, Potassium: ${sensorData.potassium} mg/L.`,
      sub:
        lang === "mr"
          ? `मातीची आर्द्रता ${sensorData.moisture}% आहे. ${cropName} साठी नियमित सिंचन आणि पोषक व्यवस्थापन आवश्यक आहे.`
          : lang === "hi"
          ? `मिट्टी की नमी ${sensorData.moisture}% है। ${cropName} के लिए नियमित सिंचाई और पोषण प्रबंधन आवश्यक है।`
          : `Soil moisture is at ${sensorData.moisture}%. Regular irrigation and nutrient management is recommended for ${cropName} at this stage.`,
      tip:
        lang === "mr"
          ? `पुढील कृती: ${cropName} साठी योग्य बीज निवडा आणि माती परीक्षण करा.`
          : lang === "hi"
          ? `अगली क्रिया: ${cropName} के लिए उचित बीज चुनें और मिट्टी का परीक्षण करें।`
          : `Next action: Select appropriate seeds for ${cropName} and conduct a complete soil test.`,
    },
    {
      id: "fertilizer",
      icon: "🧪",
      title: t(lang, "fertilizerGuide"),
      color: "#fde047",
      bgColor: "rgba(253, 224, 71, 0.06)",
      borderColor: "rgba(253, 224, 71, 0.2)",
      badge: loading ? "Loading..." : fertilizerName === "No Fertilizer Required" ? "✓ Optimal" : "Action",
      badgeColor: "#fde047",
      content:
        lang === "mr"
          ? `AI शिफारस: ${fertilizerName}. नायट्रोजन ${sensorData.nitrogen} mg/L, फॉस्फरस ${sensorData.phosphorus} mg/L आणि पोटॅशियम ${sensorData.potassium} mg/L आहे.`
          : lang === "hi"
          ? `AI सिफारिश: ${fertilizerName}। नाइट्रोजन ${sensorData.nitrogen} mg/L, फॉस्फोरस ${sensorData.phosphorus} mg/L और पोटेशियम ${sensorData.potassium} mg/L है।`
          : `AI Recommendation: ${fertilizerName}. Current levels — Nitrogen: ${sensorData.nitrogen} mg/L, Phosphorus: ${sensorData.phosphorus} mg/L, Potassium: ${sensorData.potassium} mg/L.`,
      sub:
        fertilizerName === "No Fertilizer Required"
          ? lang === "mr"
            ? "तुमच्या मातीतील पोषकांचे प्रमाण सध्या पुरेसे आहे. जास्त खत टाळा कारण त्यामुळे मातीचे नुकसान होऊ शकते."
            : lang === "hi"
            ? "आपकी मिट्टी में पोषक तत्वों का स्तर अभी पर्याप्त है। अधिक खाद डालने से बचें क्योंकि इससे मिट्टी को नुकसान हो सकता है।"
            : "Your soil nutrient levels are currently sufficient. Avoid over-fertilizing as it may harm soil health and crop quality."
          : lang === "mr"
          ? `${fertilizerName} प्रत्येक झाडासाठी 10 लिटर पाण्यात विरघळवा. मुळाजवळ द्या. सकाळी 5-7 दरम्यान द्या.`
          : lang === "hi"
          ? `${fertilizerName} को प्रत्येक पेड़ के लिए 10 लीटर पानी में घोलें। जड़ क्षेत्र के पास दें। सुबह 5-7 बजे के बीच दें।`
          : `Apply ${fertilizerName} dissolved in 10 liters of water per plant. Apply near the root zone, not the trunk. Best time: early morning 5-7 AM.`,
      tip:
        lang === "mr"
          ? "खत दिल्यानंतर मातीची आर्द्रता तपासा. जास्त खत दिल्यास पीक जळू शकते."
          : lang === "hi"
          ? "खाद देने के बाद मिट्टी की नमी जांचें। अधिक खाद से फसल जल सकती है।"
          : "Monitor soil moisture after fertilizer application. Over-application can cause crop burn.",
    },
    {
      id: "watering",
      icon: "💧",
      title: t(lang, "wateringSchedule"),
      color: "#60a5fa",
      bgColor: "rgba(96, 165, 250, 0.06)",
      borderColor: "rgba(96, 165, 250, 0.2)",
      badge: sensorData.moisture >= 60 ? "Good" : sensorData.moisture >= 40 ? "Monitor" : "Water Now",
      badgeColor: "#60a5fa",
      content:
        lang === "mr"
          ? `सध्याची मातीतील आर्द्रता ${sensorData.moisture}% आहे — ${sensorData.moisture >= 60 ? "स्वीकार्य श्रेणीत आहे. आत्ताच पाणी देण्याची गरज नाही." : sensorData.moisture >= 40 ? "किंचित कमी आहे, लवकरच पाणी द्यावे." : "खूप कमी आहे, त्वरित पाणी द्यावे!"}`
          : lang === "hi"
          ? `वर्तमान मिट्टी की नमी ${sensorData.moisture}% है — ${sensorData.moisture >= 60 ? "स्वीकार्य सीमा में है। अभी सिंचाई की जरूरत नहीं है।" : sensorData.moisture >= 40 ? "थोड़ी कम है, जल्द ही सिंचाई करें।" : "बहुत कम है, तुरंत पानी दें!"}`
          : `Current soil moisture is ${sensorData.moisture}% — ${sensorData.moisture >= 60 ? "within the acceptable range. No immediate watering required." : sensorData.moisture >= 40 ? "slightly low, consider watering soon." : "critically low, immediate irrigation recommended!"}`,
      sub:
        lang === "mr"
          ? "स्मार्ट पंप सिस्टमद्वारे उद्या सकाळी 6:00 वाजता पुढील स्वयंचलित पाणी देण्याचे वेळापत्रक आहे. कालावधी: मध्यम दाबाने 45 मिनिटे."
          : lang === "hi"
          ? "स्मार्ट पंप सिस्टम के जरिए अगला स्वचालित पानी कल सुबह 6:00 बजे निर्धारित है। अवधि: मध्यम दबाव पर 45 मिनट।"
          : "Next automated watering is scheduled for tomorrow at 6:00 AM via the smart pump system. Duration: 45 minutes at medium pressure.",
      tip:
        lang === "mr"
          ? "बुधवारी पाऊस पडण्याचा अंदाज आहे — AI सिस्टम बुधवारचे वेळापत्रक आपोआप वगळेल."
          : lang === "hi"
          ? "मौसम पूर्वानुमान बुधवार को बारिश दिखाता है — AI प्रणाली बुधवार की अनुसूची स्वचालित रूप से छोड़ देगी।"
          : "Weather forecast shows rain on Wednesday — the AI system will skip Wednesday's schedule automatically to prevent over-watering.",
    },
  ];

  return (
    <div
      className="relative min-h-screen flex flex-col"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1920&q=80')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0" style={{ background: "rgba(0, 6, 0, 0.78)" }} />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-4" style={{ borderBottom: "1px solid rgba(74, 222, 128, 0.15)" }}>
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "rgba(74, 222, 128, 0.12)", border: "1px solid rgba(74, 222, 128, 0.3)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Leaf size={14} color="#4ade80" />
              <span className="text-white/60 text-xs font-bold tracking-widest">SENSOTECH</span>
            </div>
            <h1 className="text-white font-black text-xl">{t(lang, "aiAdvisor")}</h1>
          </div>
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #15803d, #4ade80)", boxShadow: "0 0 15px rgba(74, 222, 128, 0.4)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
          </div>
        </div>

        {/* Live data bar */}
        <div
          className="flex items-center gap-3 mx-4 mt-4 rounded-xl px-4 py-3"
          style={{
            background: "rgba(0, 10, 0, 0.85)",
            border: "1px solid rgba(74, 222, 128, 0.25)",
          }}
        >
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-white/70 text-xs">Live sensor analysis</span>
          <div className="flex gap-2 ml-1 flex-wrap">
            <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: "rgba(96, 165, 250, 0.15)", color: "#60a5fa" }}>
              💧 {sensorData.moisture}%
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: "rgba(253, 224, 71, 0.15)", color: "#fde047" }}>
              pH {sensorData.ph}
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: "rgba(74, 222, 128, 0.15)", color: "#4ade80" }}>
              N {sensorData.nitrogen}
            </span>
          </div>
        </div>

        {/* Sections */}
        <div className="flex-1 px-4 pt-5 pb-10 overflow-y-auto">
          {sections.map((section) => (
            <div
              key={section.id}
              className="ai-section"
              style={{
                background: "rgba(0, 10, 0, 0.88)",
                border: `1px solid ${section.borderColor}`,
                borderLeft: `3px solid ${section.color}`,
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                    style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${section.borderColor}` }}
                  >
                    {section.icon}
                  </div>
                  <h3 className="text-white font-bold text-base">{section.title}</h3>
                </div>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-bold flex-shrink-0"
                  style={{
                    background: `${section.color}18`,
                    color: section.badgeColor,
                    border: `1px solid ${section.badgeColor}50`,
                  }}
                >
                  {section.badge}
                </span>
              </div>
              <p className="text-white text-sm leading-relaxed mb-3">{section.content}</p>
              <div
                className="rounded-xl p-3 mb-3"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <p className="text-white/80 text-sm leading-relaxed">{section.sub}</p>
              </div>
              <div className="flex items-start gap-2">
                <span style={{ color: section.color }}>→</span>
                <p className="text-sm font-medium" style={{ color: section.color }}>{section.tip}</p>
              </div>
            </div>
          ))}

          {/* Overall assessment */}
          <div
            className="rounded-2xl p-5 mt-2"
            style={{
              background: "rgba(0, 10, 0, 0.88)",
              border: "1px solid rgba(74, 222, 128, 0.35)",
              borderLeft: "3px solid #4ade80",
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🤖</span>
              <h3 className="text-green-300 font-bold">
                {lang === "mr" ? "AI एकूण मूल्यांकन" : lang === "hi" ? "AI समग्र मूल्यांकन" : "AI Overall Assessment"}
              </h3>
              {loading && <div className="w-3 h-3 rounded-full border-2 border-green-400 border-t-transparent animate-spin ml-1" />}
            </div>
            <p className="text-white/75 text-sm leading-relaxed mb-4">
              {lang === "mr" ? (
                <>
                  <span className="text-green-400 font-bold">माउली शेत चांगले कामगिरी करत आहे.</span>{" "}
                  सध्याच्या मातीनुसार <span className="text-yellow-300 font-bold">{cropName}</span> साठी परिस्थिती अनुकूल आहे.{" "}
                  खत शिफारस: <span className="text-green-300 font-bold">{fertilizerName}</span>.
                </>
              ) : lang === "hi" ? (
                <>
                  <span className="text-green-400 font-bold">माउली खेत अच्छा प्रदर्शन कर रहा है।</span>{" "}
                  वर्तमान मिट्टी की स्थिति के अनुसार <span className="text-yellow-300 font-bold">{cropName}</span> के लिए परिस्थितियां अनुकूल हैं।{" "}
                  उर्वरक सिफारिश: <span className="text-green-300 font-bold">{fertilizerName}</span>.
                </>
              ) : (
                <>
                  <span className="text-green-400 font-bold">Mauli Farm is performing well.</span>{" "}
                  Based on current soil conditions, <span className="text-yellow-300 font-bold">{cropName}</span> is recommended for optimal yield.{" "}
                  Fertilizer recommendation: <span className="text-green-300 font-bold">{fertilizerName}</span>.
                </>
              )}
            </p>
            <div className="flex items-center gap-3 rounded-xl p-3" style={{ background: "rgba(0,0,0,0.3)" }}>
              <div className="text-center flex-1">
                <p className="text-green-300 font-black text-xl">
                  {sensorData.moisture >= 60 ? "92%" : sensorData.moisture >= 40 ? "74%" : "55%"}
                </p>
                <p className="text-white/50 text-xs">{lang === "mr" ? "शेत आरोग्य" : lang === "hi" ? "खेत स्वास्थ्य" : "Farm Health"}</p>
              </div>
              <div className="w-px h-8" style={{ background: "rgba(74, 222, 128, 0.2)" }} />
              <div className="text-center flex-1">
                <p className="text-yellow-300 font-black text-xl">{cropName.slice(0, 3)}</p>
                <p className="text-white/50 text-xs">{lang === "mr" ? "पीक" : lang === "hi" ? "फसल" : "Crop"}</p>
              </div>
              <div className="w-px h-8" style={{ background: "rgba(74, 222, 128, 0.2)" }} />
              <div className="text-center flex-1">
                <p className="text-blue-300 font-black text-sm leading-tight">
                  {fertilizerName === "No Fertilizer Required" ? "✓" : "!"}
                </p>
                <p className="text-white/50 text-xs">{lang === "mr" ? "खत" : lang === "hi" ? "उर्वरक" : "Fertilizer"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
