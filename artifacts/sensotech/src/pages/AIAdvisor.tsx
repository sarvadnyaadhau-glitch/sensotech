import { Leaf } from "lucide-react";
import { t, type Language } from "@/lib/translations";
const sensorData = {
  moisture: 55,
  ph: 6.8,
  ec: 2.4,
  nitrogen: 42,
  temperature: 34,
};
interface AIAdvisorProps {
  onBack: () => void;
  lang: Language;
}

export default function AIAdvisor({ onBack, lang }: AIAdvisorProps) {
  const sections = [
    {
      id: "crop",
      icon: "🌱",
      title: t(lang, "cropRecommendation"),
      color: "#4ade80",
      bgColor: "rgba(74, 222, 128, 0.08)",
      borderColor: "rgba(74, 222, 128, 0.25)",
      badge: "Optimal",
      badgeColor: "#4ade80",
      content:
        lang === "mr"
          ? `तुमचा EC मूल्य (${sensorData.ec} mS/cm) आणि pH (${sensorData.ph}) यांच्या आधारावर, लिंबाची वाढ सध्या इष्टतम आहे. तुमचे मातीचे रसायन लिंबू पिकासाठी चांगले संतुलित आहे.`
          : lang === "hi"
            ? `आपके EC मान (${sensorData.ec} mS/cm) और pH (${sensorData.ph}) के आधार पर, नींबू की वृद्धि वर्तमान में इष्टतम है। आपकी मिट्टी का रसायन साइट्रस फसलों के लिए अच्छी तरह से संतुलित है।`
            : `Based on your EC value (${sensorData.ec} mS/cm) and pH (${sensorData.ph}), Lemon growth is currently optimal. Your soil chemistry is well-balanced for citrus crops.`,
      sub:
        lang === "mr"
          ? "मातीचे सूक्ष्मजीव सुधारण्यासाठी आणि कीड नियंत्रणासाठी ओळींमध्ये तुळस किंवा पुदिना यासारख्या सुगंधी औषधी वनस्पतींचे आंतरपिक घ्या."
          : lang === "hi"
            ? "मिट्टी के माइक्रोबायोम को बेहतर बनाने और कीटों को दूर करने के लिए पंक्तियों के बीच तुलसी या पुदीना जैसी सुगंधित जड़ी-बूटियों की अंतर-फसल करें।"
            : "Consider intercropping with small aromatic herbs such as tulsi or mint between rows to improve soil microbiome and deter pests naturally.",
      tip:
        lang === "mr"
          ? "पुढील कृती: चांगल्या उत्पन्नासाठी पावसाळ्यापूर्वी मृत फांद्या छाटा."
          : lang === "hi"
            ? "अगली क्रिया: बेहतर उपज के लिए मानसून से पहले मृत शाखाओं की छंटाई करें।"
            : "Next action: Prune dead branches before the monsoon season for better yield.",
    },
    {
      id: "fertilizer",
      icon: "🧪",
      title: t(lang, "fertilizerGuide"),
      color: "#fde047",
      bgColor: "rgba(253, 224, 71, 0.06)",
      borderColor: "rgba(253, 224, 71, 0.2)",
      badge: "Low N",
      badgeColor: "#fde047",
      content:
        lang === "mr"
          ? `नायट्रोजन (N) ${sensorData.nitrogen} mg/L आहे — लिंबू झाडांसाठी इष्टतम श्रेणी 50-80 mg/L पेक्षा किंचित कमी.`
          : lang === "hi"
            ? `नाइट्रोजन (N) ${sensorData.nitrogen} mg/L है — नींबू के पेड़ों के लिए इष्टतम सीमा 50-80 mg/L से थोड़ा कम।`
            : `Nitrogen (N) reading is ${sensorData.nitrogen} mg/L — slightly below the optimal range of 50-80 mg/L for lemon trees at this growth stage.`,
      sub:
        lang === "mr"
          ? "प्रत्येक झाडासाठी 10 लिटर पाण्यात 500 ग्रॅम NPK 19:19:19 विरघळवा. मुळाजवळ द्या, खोडाजवळ नाही. सकाळी 5-7 दरम्यान द्या."
          : lang === "hi"
            ? "प्रत्येक पेड़ के लिए 10 लीटर पानी में 500 ग्राम NPK 19:19:19 घोलें। जड़ क्षेत्र के पास दें, तने के पास नहीं। सबसे अच्छा समय: सुबह 5-7 बजे।"
            : "Apply 500g of NPK 19:19:19 per tree, dissolved in 10 liters of water. Apply near the root zone, not the trunk. Best time: early morning (5-7 AM).",
      tip:
        lang === "mr"
          ? "15 दिवसांनी पुन्हा द्या. जास्त नायट्रोजन फळांऐवजी पाने वाढवते."
          : lang === "hi"
            ? "15 दिन बाद दोबारा दें। अत्यधिक नाइट्रोजन फल के बजाय पत्ते उगाता है।"
            : "Repeat in 15 days. Avoid over-application — excess nitrogen causes leaf growth at the expense of fruit.",
    },
    {
      id: "watering",
      icon: "💧",
      title: t(lang, "wateringSchedule"),
      color: "#60a5fa",
      bgColor: "rgba(96, 165, 250, 0.06)",
      borderColor: "rgba(96, 165, 250, 0.2)",
      badge: "Scheduled",
      badgeColor: "#60a5fa",
      content:
        lang === "mr"
          ? `सध्याची मातीतील आर्द्रता ${sensorData.moisture}% आहे — लिंबू बागांसाठी स्वीकार्य श्रेणी (50-70%) मध्ये. आत्ताच पाणी देण्याची गरज नाही.`
          : lang === "hi"
            ? `वर्तमान मिट्टी की नमी ${sensorData.moisture}% है — नींबू के बागों के लिए स्वीकार्य सीमा (50-70%) में। अभी सिंचाई की जरूरत नहीं है।`
            : `Current soil moisture is ${sensorData.moisture}% — within the acceptable range (50-70%) for lemon orchards. No immediate watering required.`,
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
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0, 6, 0, 0.78)" }}
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <div
          className="flex items-center gap-3 px-4 py-4"
          style={{ borderBottom: "1px solid rgba(74, 222, 128, 0.15)" }}
        >
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{
              background: "rgba(74, 222, 128, 0.12)",
              border: "1px solid rgba(74, 222, 128, 0.3)",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4ade80"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Leaf size={14} color="#4ade80" />
              <span className="text-white/60 text-xs font-bold tracking-widest">
                SENSOTECH
              </span>
            </div>
            <h1 className="text-white font-black text-xl">
              {t(lang, "aiAdvisor")}
            </h1>
          </div>
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #15803d, #4ade80)",
              boxShadow: "0 0 15px rgba(74, 222, 128, 0.4)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
          </div>
        </div>

        {/* Live data bar */}
        <div
          className="flex items-center gap-3 mx-4 mt-4 rounded-xl px-4 py-3"
          style={{
            background: "rgba(74, 222, 128, 0.08)",
            border: "1px solid rgba(74, 222, 128, 0.2)",
          }}
        >
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-white/70 text-xs">Live sensor analysis</span>
          <div className="flex gap-2 ml-1">
            <span
              className="px-2 py-0.5 rounded-full text-xs"
              style={{
                background: "rgba(96, 165, 250, 0.15)",
                color: "#60a5fa",
              }}
            >
              💧 {sensorData.moisture}%
            </span>
            <span
              className="px-2 py-0.5 rounded-full text-xs"
              style={{
                background: "rgba(253, 224, 71, 0.15)",
                color: "#fde047",
              }}
            >
              pH {sensorData.ph}
            </span>
            <span
              className="px-2 py-0.5 rounded-full text-xs"
              style={{
                background: "rgba(74, 222, 128, 0.15)",
                color: "#4ade80",
              }}
            >
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
                background: section.bgColor,
                border: `1px solid ${section.borderColor}`,
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                    style={{ background: "rgba(0,0,0,0.3)" }}
                  >
                    {section.icon}
                  </div>
                  <h3 className="text-white font-bold text-base">
                    {section.title}
                  </h3>
                </div>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-bold flex-shrink-0"
                  style={{
                    background: "rgba(0,0,0,0.3)",
                    color: section.badgeColor,
                    border: `1px solid ${section.badgeColor}40`,
                  }}
                >
                  {section.badge}
                </span>
              </div>
              <p className="text-white/85 text-sm leading-relaxed mb-3">
                {section.content}
              </p>
              <div
                className="rounded-xl p-3 mb-3"
                style={{
                  background: "rgba(0,0,0,0.3)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <p className="text-white/70 text-sm leading-relaxed">
                  {section.sub}
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span style={{ color: section.color }}>→</span>
                <p className="text-sm" style={{ color: section.color }}>
                  {section.tip}
                </p>
              </div>
            </div>
          ))}

          {/* Overall assessment */}
          <div
            className="rounded-2xl p-5 mt-2"
            style={{
              background: "rgba(74, 222, 128, 0.08)",
              border: "1px solid rgba(74, 222, 128, 0.3)",
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🤖</span>
              <h3 className="text-green-300 font-bold">
                {lang === "mr"
                  ? "AI एकूण मूल्यांकन"
                  : lang === "hi"
                    ? "AI समग्र मूल्यांकन"
                    : "AI Overall Assessment"}
              </h3>
            </div>
            <p className="text-white/75 text-sm leading-relaxed mb-4">
              {lang === "mr" ? (
                <>
                  <span className="text-green-400 font-bold">
                    माउली शेत चांगले कामगिरी करत आहे.
                  </span>{" "}
                  तुमची लिंबाची बाग निरोगी आहे. मुख्य आवश्यक कृती म्हणजे
                  नायट्रोजन पूरक. वरील खत मार्गदर्शकाचे पालन करा आणि पुढील{" "}
                  <span className="text-yellow-300 font-bold">
                    8-10 आठवड्यांत
                  </span>{" "}
                  अंदाजे{" "}
                  <span className="text-green-300 font-bold">~1,200 kg</span>{" "}
                  उत्पन्न अपेक्षित आहे.
                </>
              ) : lang === "hi" ? (
                <>
                  <span className="text-green-400 font-bold">
                    माउली खेत अच्छा प्रदर्शन कर रहा है।
                  </span>{" "}
                  आपका नींबू का बाग स्वस्थ है। मुख्य कार्रवाई नाइट्रोजन पूरकता
                  है। ऊपर के उर्वरक गाइड का पालन करें और अगली फसल{" "}
                  <span className="text-yellow-300 font-bold">8-10 हफ्तों</span>{" "}
                  में{" "}
                  <span className="text-green-300 font-bold">~1,200 kg</span>{" "}
                  उपज की उम्मीद है।
                </>
              ) : (
                <>
                  <span className="text-green-400 font-bold">
                    Mauli Farm is performing well.
                  </span>{" "}
                  Your lemon orchard is in good health. The primary action
                  needed is nitrogen supplementation. Your next estimated
                  harvest will be in{" "}
                  <span className="text-yellow-300 font-bold">8-10 weeks</span>{" "}
                  with an expected yield of{" "}
                  <span className="text-green-300 font-bold">~1,200 kg</span>.
                </>
              )}
            </p>
            <div
              className="flex items-center gap-3 rounded-xl p-3"
              style={{ background: "rgba(0,0,0,0.3)" }}
            >
              <div className="text-center flex-1">
                <p className="text-green-300 font-black text-xl">92%</p>
                <p className="text-white/50 text-xs">
                  {lang === "mr"
                    ? "शेत आरोग्य"
                    : lang === "hi"
                      ? "खेत स्वास्थ्य"
                      : "Farm Health"}
                </p>
              </div>
              <div
                className="w-px h-8"
                style={{ background: "rgba(74, 222, 128, 0.2)" }}
              />
              <div className="text-center flex-1">
                <p className="text-yellow-300 font-black text-xl">3</p>
                <p className="text-white/50 text-xs">
                  {lang === "mr"
                    ? "कृती"
                    : lang === "hi"
                      ? "कार्रवाई"
                      : "Actions"}
                </p>
              </div>
              <div
                className="w-px h-8"
                style={{ background: "rgba(74, 222, 128, 0.2)" }}
              />
              <div className="text-center flex-1">
                <p className="text-blue-300 font-black text-xl">8w</p>
                <p className="text-white/50 text-xs">
                  {lang === "mr"
                    ? "कापणीपर्यंत"
                    : lang === "hi"
                      ? "फसल तक"
                      : "To Harvest"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
