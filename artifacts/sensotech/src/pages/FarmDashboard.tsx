import { useState, useEffect } from "react";
import { Leaf, Mic, Phone } from "lucide-react";
import { t, type Language } from "@/lib/translations";
import { useSensorData } from "@/lib/useSensorData";

interface FarmDashboardProps {
  farmId: string;
  profile: { name: string; address: string };
  onBack: () => void;
  onAIAdvisor: () => void;
  onVoiceAI: () => void;
  lang: Language;
}

function CircleProgress({
  value,
  max,
  color,
  label,
  unit,
  icon,
}: {
  value: number;
  max: number;
  color: string;
  label: string;
  unit: string;
  icon: string;
}) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const safeValue = Number(value) || 0;
  const pct = Math.max(0, Math.min(safeValue / max, 1));
  const filled = pct * circumference;
  const gap = circumference - filled;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: 130, height: 130 }}>
        <svg width="130" height="130" viewBox="0 0 130 130">
          <circle
            cx="65"
            cy="65"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="11"
          />
          <circle
            cx="65"
            cy="65"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="11"
            strokeLinecap="round"
            strokeDasharray={`${filled} ${gap}`}
            className="progress-ring-circle"
            style={{ filter: `drop-shadow(0 0 8px ${color}90)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl">{icon}</span>
          <span className="text-white font-black text-lg leading-none mt-0.5">
            {safeValue}
          </span>
          <span className="text-white/50 text-xs">{unit}</span>
        </div>
      </div>
      <span className="text-white/70 text-xs mt-2 text-center font-medium leading-tight">
        {label}
      </span>
    </div>
  );
}

interface WeatherDay {
  dayKey: string;
  icon: string;
  high: number;
  low: number;
  cond: string;
  isToday: boolean;
}

function wmoToWeather(code: number): { icon: string; cond: string } {
  if (code === 0) return { icon: "☀️", cond: "Sunny" };
  if (code === 1) return { icon: "🌤️", cond: "Clear" };
  if (code === 2) return { icon: "⛅", cond: "Partly" };
  if (code === 3) return { icon: "☁️", cond: "Cloudy" };
  if (code === 45 || code === 48) return { icon: "🌫️", cond: "Foggy" };
  if (code >= 51 && code <= 55) return { icon: "🌦️", cond: "Drizzle" };
  if (code >= 61 && code <= 65) return { icon: "🌧️", cond: "Rainy" };
  if (code >= 71 && code <= 77) return { icon: "❄️", cond: "Snow" };
  if (code >= 80 && code <= 82) return { icon: "🌧️", cond: "Showers" };
  if (code === 85 || code === 86) return { icon: "🌨️", cond: "Snow" };
  if (code === 95) return { icon: "⛈️", cond: "Storm" };
  if (code === 96 || code === 99) return { icon: "⛈️", cond: "Storm" };
  return { icon: "🌤️", cond: "Clear" };
}

const CACHE_KEY = "akola_weather_cache_v2";

function getCachedWeather(): { date: string; days: WeatherDay[] } | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

async function fetchAkolaWeather(): Promise<WeatherDay[]> {
  const today = new Date().toISOString().slice(0, 10);
  const cached = getCachedWeather();
  if (cached && cached.date === today) return cached.days;

  const res = await fetch(
    "https://api.open-meteo.com/v1/forecast?latitude=20.7002&longitude=77.0082&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Asia%2FKolkata&forecast_days=5",
  );
  if (!res.ok) throw new Error("Weather fetch failed");
  const data = await res.json();

  // API uses weather_code (new) or weathercode (old) — handle both
  const weatherCodes: number[] =
    data.daily.weather_code ?? data.daily.weathercode ?? [];

  const days: WeatherDay[] = (data.daily.time as string[]).map((dateStr, i) => {
    const date = new Date(dateStr);
    const { icon, cond } = wmoToWeather(weatherCodes[i] ?? 0);
    const dayLabel =
      i === 0
        ? "Today"
        : i === 1
          ? "Tmrw"
          : date.toLocaleDateString("en-US", { weekday: "short" });
    return {
      dayKey: dayLabel,
      icon,
      high: Math.round(data.daily.temperature_2m_max[i] as number),
      low: Math.round(data.daily.temperature_2m_min[i] as number),
      cond,
      isToday: i === 0,
    };
  });

  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ date: today, days }));
  } catch {
    /* ignore */
  }

  return days;
}

export default function FarmDashboard({
  farmId: _farmId,
  profile,
  onBack,
  onAIAdvisor,
  onVoiceAI,
  lang,
}: FarmDashboardProps) {
  const { data: sensorData } = useSensorData();
  const [pumpOn, setPumpOn] = useState(true);
  const [weatherDays, setWeatherDays] = useState<WeatherDay[]>([]);
  const [weatherLoading, setWeatherLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const days = await fetchAkolaWeather();
        if (!cancelled) {
          setWeatherDays(days);
          setWeatherLoading(false);
        }
      } catch {
        if (!cancelled) setWeatherLoading(false);
      }
    }
    load();

    // Refresh at midnight so the rolling window advances automatically
    const now = new Date();
    const msUntilMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() -
      now.getTime();
    const midnightTimer = setTimeout(() => {
      localStorage.removeItem(CACHE_KEY);
      load();
    }, msUntilMidnight);

    return () => {
      cancelled = true;
      clearTimeout(midnightTimer);
    };
  }, []);
  const speak = (text: string) => {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang === "hi" ? "hi-IN" : lang === "mr" ? "mr-IN" : "en-IN";
    window.speechSynthesis.speak(utter);
  };
  const startListening = () => {
    const SR = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SR) {
      alert("Speech Recognition not supported");
      return;
    }

    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.lang =
      lang === "hi" ? "hi-IN" : lang === "mr" ? "mr-IN" : "en-IN";

    recognition.onresult = async (event: SpeechRecognitionEvent) => {
      const question = event.results[0][0].transcript;
      if (!callLanguage) {
        const q = question.toLowerCase();

        if (q.includes("hindi")) {
          setCallLanguage("hi");
          speak("ठीक है, अब मैं हिंदी में बात करूंगी। आपका प्रश्न क्या है?");
          return;
        }

        if (q.includes("marathi")) {
          setCallLanguage("mr");
          speak("ठीक आहे, आता मी मराठीत बोलेन. तुमचा प्रश्न काय आहे?");
          return;
        }

        if (q.includes("english")) {
          setCallLanguage("en");
          speak("Okay, I will speak in English. What is your question?");
          return;
        }

        speak("Please say Hindi, Marathi or English.");
        return;
      }

      try {
        const resp = await fetch("/api/farm-ai/ask", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question,
            language: lang,
            sensorData: {
              moisture: sensorData.moisture,
              ph: sensorData.ph,
              temperature: sensorData.temperature,
              ec: sensorData.ec,
              nitrogen: sensorData.nitrogen,
              phosphorus: sensorData.phosphorus,
              potassium: sensorData.potassium,
              crop: sensorData.crop,
              fertilizer: sensorData.fertilizer,
            },
          }),
        });

        const json = await resp.json();
        speak(json.answer || "Mujhe jawab nahi mila");
      } catch {
        speak("Server error aaya hai");
      }
    };

    recognition.onerror = () => {};
  };
  const [connectingExpert, setConnectingExpert] = useState(false);
  const [callLanguage, setCallLanguage] = useState("");
  const handleExpertCall = () => {
    setConnectingExpert(true);
    const msg =
      "Welcome to Senso Tech Expert Support. Please choose your language. Hindi, Marathi or English.";
    speak(msg);
    window.speechSynthesis.cancel();

    const utter = new SpeechSynthesisUtterance(msg);

    utter.onend = () => {
      startListening();
    };

    window.speechSynthesis.speak(utter);

    // setTimeout(() => {
    //   startListening();
    // }, 3000);
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
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0, 8, 0, 0.72)" }}
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
              Mauli Farm {t(lang, "dashboard")}
            </h1>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-xs">
              {t(lang, "liveSensors")}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-4 pt-4 pb-28 overflow-y-auto">
          {/* Weather */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-white font-bold text-base">
                {t(lang, "weatherAkola")}
              </h2>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-white/40 text-xs">Akola, MH</span>
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {weatherLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="weather-card flex-shrink-0 animate-pulse"
                      style={{
                        background: "rgba(0,20,0,0.4)",
                        border: "1px solid rgba(74,222,128,0.1)",
                      }}
                    >
                      <div className="w-8 h-2 rounded bg-white/10 mb-2" />
                      <div className="w-8 h-7 rounded bg-white/10 mb-2" />
                      <div className="w-6 h-3 rounded bg-white/10 mb-1" />
                      <div className="w-6 h-2 rounded bg-white/10" />
                    </div>
                  ))
                : weatherDays.map((day) => (
                    <div
                      key={day.dayKey}
                      className="weather-card flex-shrink-0"
                      style={{
                        background: day.isToday
                          ? "rgba(74, 222, 128, 0.15)"
                          : "rgba(0, 20, 0, 0.5)",
                        border: day.isToday
                          ? "1px solid rgba(74, 222, 128, 0.45)"
                          : "1px solid rgba(74, 222, 128, 0.15)",
                      }}
                    >
                      <p
                        className="font-bold mb-1"
                        style={{
                          fontSize: "10px",
                          color: day.isToday
                            ? "#4ade80"
                            : "rgba(255,255,255,0.5)",
                        }}
                      >
                        {day.dayKey}
                      </p>
                      <div className="text-2xl mb-1">{day.icon}</div>
                      <p className="text-white font-bold text-sm">
                        {day.high}°
                      </p>
                      <p className="text-white/40 text-xs">{day.low}°</p>
                      <p
                        className="text-xs mt-1"
                        style={{
                          color: day.isToday
                            ? "#86efac"
                            : "rgba(134,239,172,0.7)",
                        }}
                      >
                        {day.cond}
                      </p>
                    </div>
                  ))}
            </div>
          </div>

          {/* Sensor Charts - Large */}
          <div className="mb-5">
            <h2 className="text-white font-bold text-base mb-3">
              {t(lang, "sensorReadings")}
            </h2>
            <div
              className="rounded-2xl p-4"
              style={{
                background: "rgba(0, 15, 0, 0.6)",
                border: "1px solid rgba(74, 222, 128, 0.2)",
              }}
            >
              <div className="grid grid-cols-3 gap-2 mb-4 justify-items-center">
                <CircleProgress
                  value={sensorData.moisture}
                  max={100}
                  color="#60a5fa"
                  label={t(lang, "soilMoisture")}
                  unit="%"
                  icon="💧"
                />
                <CircleProgress
                  value={sensorData.ph}
                  max={14}
                  color="#fde047"
                  label={t(lang, "phValue")}
                  unit="pH"
                  icon="🧪"
                />
                <CircleProgress
                  value={sensorData.phosphorus}
                  max={500}
                  color="#c084fc"
                  label="Phosphorus"
                  unit="mg/L"
                  icon="⚗️"
                />
              </div>
              <div className="grid grid-cols-2 gap-2 justify-items-center">
                <CircleProgress
                  value={sensorData.nitrogen}
                  max={200}
                  color="#4ade80"
                  label={t(lang, "nitrogen")}
                  unit="mg/L"
                  icon="🌿"
                />
                <CircleProgress
                  value={sensorData.potassium}
                  max={500}
                  color="#fb923c"
                  label="Potassium"
                  unit="mg/L"
                  icon="🌾"
                />
                <CircleProgress
                  value={sensorData.temperature}
                  max={60}
                  color="#ef4444"
                  label="Temperature"
                  unit="°C"
                  icon="🌡️"
                />

                <CircleProgress
                  value={sensorData.ec}
                  max={3000}
                  color="#06b6d4"
                  label="EC"
                  unit="µS/cm"
                  icon="⚡"
                />
              </div>
            </div>
          </div>

          {/* Pump Control */}
          <div className="mb-5">
            <h2 className="text-white font-bold text-base mb-3">
              {t(lang, "pumpControl")}
            </h2>
            <div
              className="rounded-2xl p-4"
              style={{
                background: "rgba(0, 15, 0, 0.6)",
                border: "1px solid rgba(74, 222, 128, 0.2)",
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-white font-bold">
                    {t(lang, "pumpAutoOnOff")}
                  </p>
                  <p className="text-white/50 text-xs mt-0.5">
                    {pumpOn ? t(lang, "pumpRunning") : t(lang, "pumpStopped")}
                  </p>
                </div>
                <button
                  onClick={() => setPumpOn(!pumpOn)}
                  className="relative w-16 h-8 rounded-full transition-all duration-300"
                  style={{
                    background: pumpOn
                      ? "linear-gradient(135deg, #16a34a, #4ade80)"
                      : "rgba(255,255,255,0.1)",
                    boxShadow: pumpOn
                      ? "0 0 12px rgba(74, 222, 128, 0.5)"
                      : "none",
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
                style={{
                  background: "rgba(74, 222, 128, 0.06)",
                  border: "1px solid rgba(74, 222, 128, 0.15)",
                }}
              >
                <span className="text-green-400">🤖</span>
                <p className="text-white/60 text-xs">
                  {t(lang, "systemStatus")}
                </p>
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
            background: "rgba(0, 8, 0, 0.92)",
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
              style={{
                background: "rgba(74, 222, 128, 0.1)",
                border: "1px solid rgba(74, 222, 128, 0.3)",
              }}
            >
              <span className="text-xl">💡</span>
            </div>
            <span className="text-green-300 text-xs font-medium">
              {t(lang, "aiSuggestions")}
            </span>
          </button>

          {/* Voice AI Mic */}
          <button
            onClick={onVoiceAI}
            className="flex flex-col items-center gap-1 py-1"
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center relative"
              style={{
                background: "linear-gradient(135deg, #15803d, #4ade80)",
                boxShadow: "0 0 20px rgba(74, 222, 128, 0.4)",
                transition: "all 0.3s",
              }}
            >
              <Mic size={26} color="white" />
            </div>
            <span className="text-white/50 text-xs">{t(lang, "voiceAI")}</span>
          </button>

          {/* Expert Call */}
          <button
            onClick={handleExpertCall}
            className="flex flex-col items-center gap-1 py-1 px-3"
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300"
              style={{
                background: connectingExpert
                  ? "rgba(74, 222, 128, 0.2)"
                  : "rgba(74, 222, 128, 0.1)",
                border: `1px solid ${connectingExpert ? "rgba(74, 222, 128, 0.7)" : "rgba(74, 222, 128, 0.3)"}`,
                boxShadow: connectingExpert
                  ? "0 0 16px rgba(74,222,128,0.4)"
                  : "none",
              }}
            >
              {connectingExpert ? (
                <div className="w-5 h-5 rounded-full border-2 border-green-400 border-t-transparent animate-spin" />
              ) : (
                <Phone size={20} color="#4ade80" />
              )}
            </div>
            <span className="text-green-300 text-xs font-medium text-center leading-tight">
              {connectingExpert
                ? t(lang, "connectingExpert").split("...")[0] + "..."
                : t(lang, "expertCall")}
            </span>
          </button>
        </div>

        {/* Expert Connecting Popup */}
        {connectingExpert && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            onClick={() => setConnectingExpert(false)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div
              className="relative rounded-2xl p-8 text-center w-full max-w-xs"
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "rgba(0, 20, 0, 0.95)",
                border: "1px solid rgba(74, 222, 128, 0.4)",
              }}
            >
              <div className="relative w-20 h-20 mx-auto mb-4">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #16a34a, #4ade80)",
                  }}
                >
                  <Phone size={32} color="white" />
                </div>
                <div className="absolute inset-0 rounded-full border-2 border-green-400/50 animate-ping" />
                <div
                  className="absolute inset-[-8px] rounded-full border border-green-400/30 animate-ping"
                  style={{ animationDelay: "0.3s" }}
                />
              </div>
              <p className="text-green-300 font-bold text-lg mb-1">
                SENSOTECH Expert
              </p>
              <p className="text-white text-sm mt-2">
                📞 Tring Tring... SENSOTECH AI Calling
              </p>
              <p className="text-white/60 text-sm mb-4">
                {t(lang, "connectingExpert")}
              </p>
              <button
                onClick={startListening}
                className="mt-4 w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg,#15803d,#4ade80)",
                }}
              >
                <Mic size={28} color="white" />
              </button>
              <div className="flex justify-center gap-1">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-green-400 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
