interface AIAdvisorProps {
  onBack: () => void;
}

export default function AIAdvisor({ onBack }: AIAdvisorProps) {
  const sections = [
    {
      id: "crop",
      icon: "🌱",
      title: "Crop Recommendation",
      color: "#4ade80",
      bgColor: "rgba(74, 222, 128, 0.08)",
      borderColor: "rgba(74, 222, 128, 0.25)",
      badge: "Optimal",
      badgeColor: "#4ade80",
      content: "Based on your EC value (2.4 mS/cm) and pH (6.8), Lemon growth is currently optimal. Your soil chemistry is well-balanced for citrus crops.",
      sub: "Consider intercropping with small aromatic herbs such as tulsi or mint between rows to improve soil microbiome and deter pests naturally.",
      tip: "Next action: Prune dead branches before the monsoon season for better yield.",
    },
    {
      id: "fertilizer",
      icon: "🧪",
      title: "Fertilizer Guide",
      color: "#fde047",
      bgColor: "rgba(253, 224, 71, 0.06)",
      borderColor: "rgba(253, 224, 71, 0.2)",
      badge: "Low N",
      badgeColor: "#fde047",
      content: "Nitrogen (N) reading is 42 mg/L — slightly below the optimal range of 50-80 mg/L for lemon trees at this growth stage.",
      sub: "Apply 500g of NPK 19:19:19 per tree, dissolved in 10 liters of water. Apply near the root zone, not the trunk. Best time: early morning (5-7 AM).",
      tip: "Repeat in 15 days. Avoid over-application — excess nitrogen causes excessive leaf growth at the expense of fruit.",
    },
    {
      id: "watering",
      icon: "💧",
      title: "Watering Schedule",
      color: "#60a5fa",
      bgColor: "rgba(96, 165, 250, 0.06)",
      borderColor: "rgba(96, 165, 250, 0.2)",
      badge: "Scheduled",
      badgeColor: "#60a5fa",
      content: "Current soil moisture is 55% — within the acceptable range (50-70%) for lemon orchards. No immediate watering required.",
      sub: "Next automated watering is scheduled for tomorrow at 6:00 AM via the smart pump system. Duration: 45 minutes at medium pressure.",
      tip: "Weather forecast shows rain on Wednesday — the AI system will skip Wednesday's schedule automatically to prevent over-watering.",
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
        <div
          className="flex items-center gap-3 px-4 py-4"
          style={{ borderBottom: "1px solid rgba(74, 222, 128, 0.15)" }}
        >
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "rgba(74, 222, 128, 0.12)", border: "1px solid rgba(74, 222, 128, 0.3)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-white font-black text-xl">AI Farm Advisor</h1>
            <p className="text-green-400 text-xs">Powered by Sensotech Intelligence</p>
          </div>
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #15803d, #4ade80)", boxShadow: "0 0 15px rgba(74, 222, 128, 0.4)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
          </div>
        </div>

        {/* Live Data Bar */}
        <div
          className="flex items-center gap-3 mx-4 mt-4 rounded-xl px-4 py-3"
          style={{ background: "rgba(74, 222, 128, 0.08)", border: "1px solid rgba(74, 222, 128, 0.2)" }}
        >
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-white/70 text-xs">Analysis based on</span>
          <div className="flex gap-2">
            <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: "rgba(96, 165, 250, 0.15)", color: "#60a5fa" }}>💧 55%</span>
            <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: "rgba(253, 224, 71, 0.15)", color: "#fde047" }}>pH 6.8</span>
            <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: "rgba(74, 222, 128, 0.15)", color: "#4ade80" }}>N 42</span>
          </div>
        </div>

        {/* Advisory Sections */}
        <div className="flex-1 px-4 pt-5 pb-10 overflow-y-auto">
          {sections.map((section) => (
            <div
              key={section.id}
              className="ai-section"
              style={{ background: section.bgColor, border: `1px solid ${section.borderColor}` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: "rgba(0,0,0,0.3)" }}
                  >
                    {section.icon}
                  </div>
                  <h3 className="text-white font-bold text-base">{section.title}</h3>
                </div>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-bold flex-shrink-0"
                  style={{ background: "rgba(0,0,0,0.3)", color: section.badgeColor, border: `1px solid ${section.badgeColor}40` }}
                >
                  {section.badge}
                </span>
              </div>

              <p className="text-white/85 text-sm leading-relaxed mb-3">{section.content}</p>

              <div
                className="rounded-xl p-3 mb-3"
                style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <p className="text-white/70 text-sm leading-relaxed">{section.sub}</p>
              </div>

              <div className="flex items-start gap-2">
                <span style={{ color: section.color }}>→</span>
                <p className="text-sm" style={{ color: section.color }}>{section.tip}</p>
              </div>
            </div>
          ))}

          {/* AI Summary */}
          <div
            className="rounded-2xl p-5 mt-2"
            style={{ background: "rgba(74, 222, 128, 0.08)", border: "1px solid rgba(74, 222, 128, 0.3)" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🤖</span>
              <h3 className="text-green-300 font-bold">AI Overall Assessment</h3>
            </div>
            <p className="text-white/75 text-sm leading-relaxed">
              <span className="text-green-400 font-bold">Mauli Farm is performing well.</span> Your lemon orchard is in good health. The primary action needed is nitrogen supplementation. Follow the fertilizer guide above and your next estimated harvest will be in <span className="text-yellow-300 font-bold">8-10 weeks</span> with an expected yield of <span className="text-green-300 font-bold">~1,200 kg</span>.
            </p>
            <div
              className="flex items-center gap-3 mt-4 rounded-xl p-3"
              style={{ background: "rgba(0,0,0,0.3)" }}
            >
              <div className="text-center">
                <p className="text-green-300 font-black text-lg">92%</p>
                <p className="text-white/50 text-xs">Farm Health</p>
              </div>
              <div className="w-px h-8" style={{ background: "rgba(74, 222, 128, 0.2)" }} />
              <div className="text-center">
                <p className="text-yellow-300 font-black text-lg">3</p>
                <p className="text-white/50 text-xs">Actions</p>
              </div>
              <div className="w-px h-8" style={{ background: "rgba(74, 222, 128, 0.2)" }} />
              <div className="text-center">
                <p className="text-blue-300 font-black text-lg">8w</p>
                <p className="text-white/50 text-xs">To Harvest</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
