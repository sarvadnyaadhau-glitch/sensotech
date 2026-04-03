import { useState } from "react";

interface FarmDashboardProps {
  farmId: string;
  onBack: () => void;
  onAIAdvisor: () => void;
}

function CircleProgress({ value, max, color, label, unit, icon }: {
  value: number; max: number; color: string; label: string; unit: string; icon: string;
}) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / max) * circumference;
  const dash = circumference - progress;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
          <circle
            cx="50" cy="50" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${progress} ${dash}`}
            className="progress-ring-circle"
            style={{
              filter: `drop-shadow(0 0 6px ${color}80)`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl">{icon}</span>
          <span className="text-white font-black text-sm leading-none">{value}</span>
          <span className="text-white/50 text-xs">{unit}</span>
        </div>
      </div>
      <span className="text-white/70 text-xs mt-1.5 text-center font-medium">{label}</span>
    </div>
  );
}

const weatherDays = [
  { day: "Mon", icon: "☀️", high: 38, low: 24, cond: "Sunny" },
  { day: "Tue", icon: "⛅", high: 35, low: 22, cond: "Partly" },
  { day: "Wed", icon: "🌧️", high: 29, low: 20, cond: "Rainy" },
  { day: "Thu", icon: "⛈️", high: 27, low: 19, cond: "Storm" },
  { day: "Fri", icon: "🌤️", high: 33, low: 21, cond: "Cloudy" },
];

export default function FarmDashboard({ farmId: _farmId, onBack, onAIAdvisor }: FarmDashboardProps) {
  const [pumpOn, setPumpOn] = useState(true);
  const [connectingExpert, setConnectingExpert] = useState(false);

  const handleExpertCall = () => {
    setConnectingExpert(true);
    setTimeout(() => setConnectingExpert(false), 3000);
  };

  return (
    <div
      className="relative min-h-screen flex flex-col"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=1920&q=80')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0" style={{ background: "rgba(0, 8, 0, 0.72)" }} />

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
            <h1 className="text-white font-black text-xl">Mauli Farm Dashboard</h1>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 text-xs">Live Sensors Active</span>
            </div>
          </div>
          <div
            className="px-3 py-1 rounded-full text-xs font-bold"
            style={{ background: "rgba(74, 222, 128, 0.15)", color: "#4ade80", border: "1px solid rgba(74, 222, 128, 0.3)" }}
          >
            🍋 Lemon
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-4 pt-4 pb-28 overflow-y-auto">
          {/* Weather */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-white font-bold">5-Day Weather — Akola</h2>
              <span className="text-white/40 text-xs">Maharashtra</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {weatherDays.map((day, i) => (
                <div
                  key={day.day}
                  className="weather-card flex-shrink-0"
                  style={{
                    background: i === 0 ? "rgba(74, 222, 128, 0.15)" : "rgba(0, 20, 0, 0.5)",
                    border: i === 0 ? "1px solid rgba(74, 222, 128, 0.4)" : "1px solid rgba(74, 222, 128, 0.15)",
                  }}
                >
                  <p className="text-white/50 text-xs mb-1">{day.day}</p>
                  <div className="text-2xl mb-1">{day.icon}</div>
                  <p className="text-white font-bold text-sm">{day.high}°</p>
                  <p className="text-white/40 text-xs">{day.low}°</p>
                  <p className="text-green-300 text-xs mt-1">{day.cond}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sensor Data */}
          <div className="mb-5">
            <h2 className="text-white font-bold mb-3">Sensor Readings</h2>
            <div
              className="rounded-2xl p-4"
              style={{ background: "rgba(0, 15, 0, 0.6)", border: "1px solid rgba(74, 222, 128, 0.2)" }}
            >
              <div className="grid grid-cols-3 gap-3 mb-3">
                <CircleProgress value={55} max={100} color="#60a5fa" label="Soil Moisture" unit="%" icon="💧" />
                <CircleProgress value={6.8} max={14} color="#fde047" label="pH Value" unit="pH" icon="🧪" />
                <CircleProgress value={2.4} max={5} color="#c084fc" label="EC Value" unit="mS" icon="⚡" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <CircleProgress value={42} max={100} color="#4ade80" label="Nitrogen (N)" unit="mg/L" icon="🌿" />
                <CircleProgress value={34} max={50} color="#fb923c" label="Temperature" unit="°C" icon="🌡️" />
              </div>
            </div>
          </div>

          {/* Pump Control */}
          <div className="mb-5">
            <h2 className="text-white font-bold mb-3">Pump Control</h2>
            <div
              className="rounded-2xl p-4"
              style={{ background: "rgba(0, 15, 0, 0.6)", border: "1px solid rgba(74, 222, 128, 0.2)" }}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-white font-bold">Pump Auto ON/OFF</p>
                  <p className="text-white/50 text-xs mt-0.5">
                    {pumpOn ? "Currently running" : "Currently stopped"}
                  </p>
                </div>
                <button
                  onClick={() => setPumpOn(!pumpOn)}
                  className="relative w-16 h-8 rounded-full transition-all duration-300 toggle-switch"
                  style={{
                    background: pumpOn
                      ? "linear-gradient(135deg, #16a34a, #4ade80)"
                      : "rgba(255,255,255,0.1)",
                    boxShadow: pumpOn ? "0 0 12px rgba(74, 222, 128, 0.5)" : "none",
                    border: "1.5px solid rgba(74, 222, 128, 0.4)",
                  }}
                >
                  <div
                    className="absolute top-0.5 w-7 h-7 rounded-full bg-white shadow-md transition-all duration-300"
                    style={{ left: pumpOn ? "calc(100% - 30px)" : "2px" }}
                  />
                </button>
              </div>
              <div
                className="flex items-center gap-2 rounded-xl p-3"
                style={{ background: "rgba(74, 222, 128, 0.06)", border: "1px solid rgba(74, 222, 128, 0.15)" }}
              >
                <span className="text-green-400">🤖</span>
                <div>
                  <p className="text-green-300 text-xs font-bold">System Status</p>
                  <p className="text-white/60 text-xs">Self-Operated (AI Controlled)</p>
                </div>
                <div className="ml-auto">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Bottom Navigation */}
        <div
          className="bottom-nav fixed bottom-0 left-0 right-0 flex items-center justify-between px-6 py-3"
          style={{
            background: "rgba(0, 8, 0, 0.90)",
            border: "1px solid rgba(74, 222, 128, 0.15)",
            borderBottom: "none",
          }}
        >
          {/* AI Suggestions */}
          <button
            onClick={onAIAdvisor}
            className="flex flex-col items-center gap-1 py-1 px-3"
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: "rgba(74, 222, 128, 0.1)", border: "1px solid rgba(74, 222, 128, 0.3)" }}
            >
              <span className="text-xl">💡</span>
            </div>
            <span className="text-green-300 text-xs font-medium">AI Suggestions</span>
          </button>

          {/* Center Mic */}
          <button className="flex flex-col items-center gap-1 py-1">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center relative mic-pulse"
              style={{
                background: "linear-gradient(135deg, #15803d, #4ade80)",
                boxShadow: "0 0 20px rgba(74, 222, 128, 0.4)",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
              </svg>
            </div>
            <span className="text-white/50 text-xs">Voice AI</span>
          </button>

          {/* Expert Call */}
          <button
            onClick={handleExpertCall}
            className="flex flex-col items-center gap-1 py-1 px-3"
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{
                background: connectingExpert ? "rgba(74, 222, 128, 0.2)" : "rgba(74, 222, 128, 0.1)",
                border: `1px solid ${connectingExpert ? "rgba(74, 222, 128, 0.6)" : "rgba(74, 222, 128, 0.3)"}`,
              }}
            >
              {connectingExpert ? (
                <div className="w-4 h-4 rounded-full border-2 border-green-400 border-t-transparent animate-spin" />
              ) : (
                <span className="text-xl">📞</span>
              )}
            </div>
            <span className="text-green-300 text-xs font-medium">
              {connectingExpert ? "Connecting..." : "Expert Call"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
