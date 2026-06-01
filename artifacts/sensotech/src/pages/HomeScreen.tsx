import { useState } from "react";
import { Leaf } from "lucide-react";
import { t, type Language } from "@/lib/translations";

interface HomeScreenProps {
  profile: { name: string; mobile: string; address: string };
  onFarmClick: (farmName: string) => void;
  onNav: (tab: "home" | "chat" | "news") => void;
  activeNav: "home" | "chat" | "news";
  lang: Language;
}

const farms = [
  {
    id: "mauli",
    name: "Mauli Farm",
    cropKey: "lemonOrchard",
    emoji: "🍌",
    area: "4.5 Acres",
    statusKey: "healthy",
    statusColor: "#4ade80",
    image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800&q=80",
  },
  {
    id: "sarvadnya",
    name: "Sarvadnya Farm",
    cropKey: "mushroomFarm",
    emoji: "🍄",
    area: "1.2 Acres",
    statusKey: "growing",
    statusColor: "#fde047",
    image: "https://images.unsplash.com/photo-1504545102780-26774c1bb073?w=800&q=80",
  },
  {
    id: "kranti",
    name: "Kranti Farm",
    cropKey: "appleOrchard",
    emoji: "🍎",
    area: "6.0 Acres",
    statusKey: "needsWater",
    statusColor: "#fb923c",
    image: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=800&q=80",
  },
];

export default function HomeScreen({ profile, onFarmClick, onNav, activeNav, lang }: HomeScreenProps) {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div
      className="relative min-h-screen flex flex-col"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0" style={{ background: "rgba(0, 10, 0, 0.65)" }} />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Professional Header */}
        <div
          className="px-5 pt-5 pb-3"
          style={{ borderBottom: "1px solid rgba(74, 222, 128, 0.15)" }}
        >
          <div className="flex items-center justify-between mb-1">
            {/* Logo + Name */}
            <div className="flex items-center gap-2">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(74, 222, 128, 0.15)", border: "1.5px solid rgba(74, 222, 128, 0.4)" }}
              >
                <Leaf size={18} color="#4ade80" />
              </div>
              <span
                className="text-xl font-black tracking-widest whitespace-nowrap"
                style={{
                  background: "linear-gradient(135deg, #4ade80, #fde047)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: "0.18em",
                }}
              >
                SENSOTECH
              </span>
            </div>

            {/* Profile Icon */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-300 text-xs font-bold">{t(lang, "live")}</span>
              </div>
              <button
                onClick={() => setShowProfile(true)}
                className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-lg relative"
                style={{
                  background: "linear-gradient(135deg, #16a34a, #4ade80)",
                  boxShadow: "0 0 0 2px rgba(74, 222, 128, 0.4)",
                }}
              >
                {profile.name.charAt(0).toUpperCase()}
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-4 pt-5 pb-24 overflow-y-auto">
          {activeNav === "home" && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-black text-2xl">{t(lang, "myFarms")}</h2>
                <span className="text-white/40 text-xs">
                  {new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
                </span>
              </div>
              <div className="flex flex-col gap-4">
                {farms.map((farm) => (
                  <button
                    key={farm.id}
                    onClick={() => onFarmClick(farm.id)}
                    className="farm-card w-full rounded-2xl overflow-hidden text-left"
                    style={{ height: "200px", position: "relative", border: "1px solid rgba(74, 222, 128, 0.2)" }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        backgroundImage: `url('${farm.image}')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)" }} />
                    <div className="absolute inset-0 flex flex-col justify-end p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-2xl">{farm.emoji}</span>
                            <span
                              className="text-xs px-2 py-0.5 rounded-full font-bold"
                              style={{ background: "rgba(0,0,0,0.5)", color: farm.statusColor, border: `1px solid ${farm.statusColor}40` }}
                            >
                              {t(lang, farm.statusKey)}
                            </span>
                          </div>
                          <h3 className="text-white font-black text-xl" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>
                            {farm.name}
                          </h3>
                          <p className="text-white/70 text-sm">{t(lang, farm.cropKey)} • {farm.area}</p>
                        </div>
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ background: "rgba(74, 222, 128, 0.2)", border: "1px solid rgba(74, 222, 128, 0.5)" }}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
          {activeNav === "chat" && <CommunityChat lang={lang} />}
          {activeNav === "news" && <FarmingNews lang={lang} />}
        </div>

        {/* Bottom Navigation */}
        <div
          className="bottom-nav fixed bottom-0 left-0 right-0 flex items-center justify-around px-6 py-3"
          style={{ background: "rgba(0, 10, 0, 0.88)", border: "1px solid rgba(74, 222, 128, 0.15)", borderBottom: "none" }}
        >
          <button onClick={() => onNav("chat")} className="flex flex-col items-center gap-1 py-2 px-4">
            <span className="text-2xl" style={{ opacity: activeNav === "chat" ? 1 : 0.4, transform: activeNav === "chat" ? "scale(1.15)" : "scale(1)", transition: "all 0.2s" }}>💬</span>
            <span className="text-xs font-medium" style={{ color: activeNav === "chat" ? "#4ade80" : "rgba(255,255,255,0.4)" }}>{t(lang, "community")}</span>
          </button>
          <button onClick={() => onNav("home")} className="flex flex-col items-center gap-1 py-2 px-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: activeNav === "home" ? "linear-gradient(135deg, #16a34a, #4ade80)" : "rgba(74, 222, 128, 0.1)", border: "2px solid rgba(74, 222, 128, 0.4)", transition: "all 0.2s" }}
            >
              <span className="text-xl">🏠</span>
            </div>
            <span className="text-xs font-medium" style={{ color: activeNav === "home" ? "#4ade80" : "rgba(255,255,255,0.4)" }}>{t(lang, "home")}</span>
          </button>
          <button onClick={() => onNav("news")} className="flex flex-col items-center gap-1 py-2 px-4">
            <span className="text-2xl" style={{ opacity: activeNav === "news" ? 1 : 0.4, transform: activeNav === "news" ? "scale(1.15)" : "scale(1)", transition: "all 0.2s" }}>📰</span>
            <span className="text-xs font-medium" style={{ color: activeNav === "news" ? "#4ade80" : "rgba(255,255,255,0.4)" }}>{t(lang, "news")}</span>
          </button>
        </div>
      </div>

      {/* Profile Popup */}
      {showProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowProfile(false)} />
          <div className="relative w-full max-w-sm rounded-2xl p-6" style={{ background: "rgba(5, 20, 5, 0.95)", border: "1px solid rgba(74, 222, 128, 0.3)" }}>
            <button onClick={() => setShowProfile(false)} className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white" style={{ background: "rgba(255,255,255,0.05)" }}>✕</button>
            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black text-white mb-3" style={{ background: "linear-gradient(135deg, #16a34a, #4ade80)" }}>
                {profile.name.charAt(0).toUpperCase()}
              </div>
              <h3 className="text-white font-bold text-xl">{profile.name}</h3>
              <p className="text-green-300 text-sm">{profile.mobile}</p>
            </div>
            <div className="flex flex-col gap-3 mb-5">
              {[
                { label: t(lang, "address"), value: profile.address || "Akola, Maharashtra" },
                { label: "Serial No", value: "001", valueColor: "#4ade80" },
                { label: "Status", value: "Active ●", valueColor: "#4ade80" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between rounded-xl p-3" style={{ background: "rgba(74, 222, 128, 0.05)", border: "1px solid rgba(74, 222, 128, 0.1)" }}>
                  <span className="text-white/50 text-sm">{row.label}</span>
                  <span className="text-sm font-medium" style={{ color: row.valueColor ?? "white" }}>{row.value}</span>
                </div>
              ))}
            </div>
            <button className="w-full py-3 rounded-xl font-bold text-white/70 text-sm transition-all hover:text-white" style={{ background: "rgba(74, 222, 128, 0.08)", border: "1px solid rgba(74, 222, 128, 0.2)" }}>
              {t(lang, "editProfile")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function CommunityChat({ lang }: { lang: Language }) {
  const posts = [
    { id: 1, author: "Ramesh Patil", role: "Agricultural Expert", time: "2h ago", content: "Best time to apply NPK fertilizer for lemon trees is early morning. Mix 200g NPK with 10L water per tree. 🌿", likes: 48, comments: 12, avatar: "R" },
    { id: 2, author: "Dr. Sunita Jadhav", role: "Soil Scientist", time: "5h ago", content: "Soil moisture levels dropping across Maharashtra. Farmers in Vidarbha should activate drip irrigation immediately. pH should be 6.0–7.0.", likes: 92, comments: 27, avatar: "S" },
    { id: 3, author: "Santosh More", role: "Pomegranate Farmer", time: "1 day ago", content: "Using SENSOTECH AI pump control saved 35% water this season! The automated scheduling feature is amazing.", likes: 156, comments: 43, avatar: "S" },
  ];
  return (
    <div>
      <h2 className="text-white font-black text-xl mb-4">{t(lang, "communityFeed")}</h2>
      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <div key={post.id} className="rounded-2xl p-4" style={{ background: "rgba(0, 15, 0, 0.65)", border: "1px solid rgba(74, 222, 128, 0.15)" }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm" style={{ background: "linear-gradient(135deg, #166534, #4ade80)" }}>{post.avatar}</div>
              <div>
                <p className="text-white font-bold text-sm">{post.author}</p>
                <p className="text-green-400 text-xs">{post.role} • {post.time}</p>
              </div>
            </div>
            <p className="text-white/80 text-sm leading-relaxed mb-3">{post.content}</p>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1.5 text-white/50 text-xs hover:text-green-400 transition-colors"><span>👍</span><span>{post.likes}</span></button>
              <button className="flex items-center gap-1.5 text-white/50 text-xs hover:text-green-400 transition-colors"><span>💬</span><span>{post.comments}</span></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FarmingNews({ lang }: { lang: Language }) {
  const news = [
    { id: 1, title: "Maharashtra Farmers Get New Subsidy Scheme for Drip Irrigation", channel: "AgriTV India", views: "2.4M", time: "2 days ago", thumb: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80", duration: "12:34" },
    { id: 2, title: "New AI Technology Predicts Pest Attacks 2 Weeks in Advance", channel: "KisanTV", views: "890K", time: "3 days ago", thumb: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&q=80", duration: "8:21" },
    { id: 3, title: "Water Conservation Techniques for Summer Farming - Expert Guide", channel: "Smart Farming", views: "1.2M", time: "4 days ago", thumb: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80", duration: "15:07" },
    { id: 4, title: "MSP Rates Announced for Kharif 2025 Season", channel: "India AgriNews", views: "3.1M", time: "5 days ago", thumb: "https://images.unsplash.com/photo-1543257580-7269da773bf5?w=400&q=80", duration: "6:45" },
    { id: 5, title: "Soil Health Card Program: How to Get Maximum Benefits", channel: "Krishi Jagat", views: "567K", time: "6 days ago", thumb: "https://images.unsplash.com/photo-1586771107445-d3ca888129ce?w=400&q=80", duration: "10:12" },
  ];
  return (
    <div>
      <h2 className="text-white font-black text-xl mb-1">{t(lang, "farmingNews")}</h2>
      <p className="text-white/40 text-xs mb-4 uppercase tracking-wider">{t(lang, "last7Days")}</p>
      <div className="flex flex-col gap-4">
        {news.map((item) => (
          <div key={item.id} className="rounded-xl overflow-hidden" style={{ background: "rgba(0, 15, 0, 0.65)", border: "1px solid rgba(74, 222, 128, 0.15)" }}>
            <div className="relative">
              <img src={item.thumb} alt={item.title} className="w-full h-44 object-cover" />
              <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-white text-xs font-bold" style={{ background: "rgba(0,0,0,0.85)" }}>{item.duration}</div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.6)", border: "2px solid rgba(255,255,255,0.5)" }}>
                  <span style={{ marginLeft: "3px" }}>▶</span>
                </div>
              </div>
            </div>
            <div className="p-3">
              <p className="text-white font-bold text-sm leading-tight mb-2">{item.title}</p>
              <div className="flex items-center justify-between">
                <span className="text-green-400 text-xs">{item.channel}</span>
                <span className="text-white/40 text-xs">{item.views} views • {item.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
