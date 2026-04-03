import { useState, useRef, useEffect } from "react";
import { Leaf, Mic, MicOff, Phone } from "lucide-react";
import { t, type Language } from "@/lib/translations";

interface FarmDashboardProps {
  farmId: string;
  profile: { name: string; address: string };
  onBack: () => void;
  onAIAdvisor: () => void;
  lang: Language;
}

export const sensorData = {
  moisture: 55,
  ph: 6.8,
  ec: 2.4,
  nitrogen: 42,
  temperature: 34,
};

function CircleProgress({ value, max, color, label, unit, icon }: {
  value: number; max: number; color: string; label: string; unit: string; icon: string;
}) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(value / max, 1);
  const filled = pct * circumference;
  const gap = circumference - filled;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: 130, height: 130 }}>
        <svg width="130" height="130" viewBox="0 0 130 130">
          <circle cx="65" cy="65" r={radius} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="11" />
          <circle
            cx="65" cy="65" r={radius}
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
          <span className="text-white font-black text-lg leading-none mt-0.5">{value}</span>
          <span className="text-white/50 text-xs">{unit}</span>
        </div>
      </div>
      <span className="text-white/70 text-xs mt-2 text-center font-medium leading-tight">{label}</span>
    </div>
  );
}

const weatherDays = [
  { dayKey: "Mon", icon: "☀️", high: 38, low: 24, cond: "Sunny" },
  { dayKey: "Tue", icon: "⛅", high: 35, low: 22, cond: "Partly" },
  { dayKey: "Wed", icon: "🌧️", high: 29, low: 20, cond: "Rainy" },
  { dayKey: "Thu", icon: "⛈️", high: 27, low: 19, cond: "Storm" },
  { dayKey: "Fri", icon: "🌤️", high: 33, low: 21, cond: "Cloudy" },
];

interface VoiceAIState {
  phase: "idle" | "listening" | "processing" | "speaking";
  transcript: string;
  answer: string;
  error: string;
}

export default function FarmDashboard({ farmId: _farmId, profile, onBack, onAIAdvisor, lang }: FarmDashboardProps) {
  const [pumpOn, setPumpOn] = useState(true);
  const [connectingExpert, setConnectingExpert] = useState(false);
  const [voice, setVoice] = useState<VoiceAIState>({ phase: "idle", transcript: "", answer: "", error: "" });
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
      window.speechSynthesis?.cancel();
    };
  }, []);

  const handleExpertCall = () => {
    setConnectingExpert(true);
    setTimeout(() => setConnectingExpert(false), 4000);
  };

  const startVoice = () => {
    if (voice.phase !== "idle") {
      recognitionRef.current?.abort();
      window.speechSynthesis?.cancel();
      setVoice({ phase: "idle", transcript: "", answer: "", error: "" });
      return;
    }

    const SpeechRecognition = (window as Window & typeof globalThis & { SpeechRecognition?: typeof window.SpeechRecognition; webkitSpeechRecognition?: typeof window.SpeechRecognition }).SpeechRecognition || (window as Window & typeof globalThis & { webkitSpeechRecognition?: typeof window.SpeechRecognition }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoice(v => ({ ...v, error: "Voice not supported in this browser. Please use Chrome.", phase: "idle" }));
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = lang === "mr" ? "mr-IN" : lang === "hi" ? "hi-IN" : "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    setVoice({ phase: "listening", transcript: "", answer: "", error: "" });

    recognition.onresult = async (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setVoice(v => ({ ...v, phase: "processing", transcript }));

      try {
        const baseUrl = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";
        const resp = await fetch(`${baseUrl}/api/farm-ai/ask`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: transcript,
            language: lang,
            sensorData,
            farmName: "Mauli Farm",
            cropType: "Lemon Orchard",
          }),
        });
        const data = await resp.json();
        const answer: string = data.answer || "Unable to process. Please try again.";
        setVoice(v => ({ ...v, phase: "speaking", answer }));

        const utter = new SpeechSynthesisUtterance(answer);
        utter.lang = lang === "mr" ? "mr-IN" : lang === "hi" ? "hi-IN" : "en-IN";
        utter.rate = 0.9;
        synthRef.current = utter;
        utter.onend = () => setVoice(v => ({ ...v, phase: "idle" }));
        window.speechSynthesis.speak(utter);
      } catch {
        setVoice(v => ({ ...v, phase: "idle", error: "AI request failed. Please try again." }));
      }
    };

    recognition.onerror = () => {
      setVoice(v => ({ ...v, phase: "idle", error: "Could not hear you. Please try again." }));
    };

    recognition.onend = () => {
      if (voice.phase === "listening") {
        setVoice(v => v.phase === "listening" ? { ...v, phase: "idle" } : v);
      }
    };

    recognition.start();
  };

  const micBgColor = voice.phase === "listening"
    ? "#dc2626"
    : voice.phase === "processing" || voice.phase === "speaking"
      ? "#d97706"
      : "linear-gradient(135deg, #15803d, #4ade80)";

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
            <h1 className="text-white font-black text-xl">Mauli Farm {t(lang, "dashboard")}</h1>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-xs">{t(lang, "liveSensors")}</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-4 pt-4 pb-28 overflow-y-auto">
          {/* Weather */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-white font-bold text-base">{t(lang, "weatherAkola")}</h2>
              <span className="text-white/40 text-xs">Maharashtra</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {weatherDays.map((day, i) => (
                <div
                  key={day.dayKey}
                  className="weather-card flex-shrink-0"
                  style={{
                    background: i === 0 ? "rgba(74, 222, 128, 0.15)" : "rgba(0, 20, 0, 0.5)",
                    border: i === 0 ? "1px solid rgba(74, 222, 128, 0.4)" : "1px solid rgba(74, 222, 128, 0.15)",
                  }}
                >
                  <p className="text-white/50 text-xs mb-1">{day.dayKey}</p>
                  <div className="text-2xl mb-1">{day.icon}</div>
                  <p className="text-white font-bold text-sm">{day.high}°</p>
                  <p className="text-white/40 text-xs">{day.low}°</p>
                  <p className="text-green-300 text-xs mt-1">{day.cond}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sensor Charts - Large */}
          <div className="mb-5">
            <h2 className="text-white font-bold text-base mb-3">{t(lang, "sensorReadings")}</h2>
            <div
              className="rounded-2xl p-4"
              style={{ background: "rgba(0, 15, 0, 0.6)", border: "1px solid rgba(74, 222, 128, 0.2)" }}
            >
              <div className="grid grid-cols-3 gap-2 mb-4 justify-items-center">
                <CircleProgress value={sensorData.moisture} max={100} color="#60a5fa" label={t(lang, "soilMoisture")} unit="%" icon="💧" />
                <CircleProgress value={sensorData.ph} max={14} color="#fde047" label={t(lang, "phValue")} unit="pH" icon="🧪" />
                <CircleProgress value={sensorData.ec} max={5} color="#c084fc" label={t(lang, "ecValue")} unit="mS" icon="⚡" />
              </div>
              <div className="grid grid-cols-2 gap-2 justify-items-center">
                <CircleProgress value={sensorData.nitrogen} max={100} color="#4ade80" label={t(lang, "nitrogen")} unit="mg/L" icon="🌿" />
                <CircleProgress value={sensorData.temperature} max={50} color="#fb923c" label={t(lang, "temperature")} unit="°C" icon="🌡️" />
              </div>
            </div>
          </div>

          {/* Pump Control */}
          <div className="mb-5">
            <h2 className="text-white font-bold text-base mb-3">{t(lang, "pumpControl")}</h2>
            <div className="rounded-2xl p-4" style={{ background: "rgba(0, 15, 0, 0.6)", border: "1px solid rgba(74, 222, 128, 0.2)" }}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-white font-bold">{t(lang, "pumpAutoOnOff")}</p>
                  <p className="text-white/50 text-xs mt-0.5">{pumpOn ? t(lang, "pumpRunning") : t(lang, "pumpStopped")}</p>
                </div>
                <button
                  onClick={() => setPumpOn(!pumpOn)}
                  className="relative w-16 h-8 rounded-full transition-all duration-300"
                  style={{
                    background: pumpOn ? "linear-gradient(135deg, #16a34a, #4ade80)" : "rgba(255,255,255,0.1)",
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
              <div className="flex items-center gap-2 rounded-xl p-3" style={{ background: "rgba(74, 222, 128, 0.06)", border: "1px solid rgba(74, 222, 128, 0.15)" }}>
                <span className="text-green-400">🤖</span>
                <p className="text-white/60 text-xs">{t(lang, "systemStatus")}</p>
                <div className="ml-auto"><div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /></div>
              </div>
            </div>
          </div>

          {/* Voice AI Answer Display */}
          {(voice.phase !== "idle" || voice.answer || voice.error) && (
            <div className="mb-5 rounded-2xl p-4" style={{ background: "rgba(0, 20, 0, 0.7)", border: "1px solid rgba(74, 222, 128, 0.3)" }}>
              {voice.phase === "listening" && (
                <div className="flex items-center gap-3">
                  <div className="flex gap-1 items-end">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-1 bg-green-400 rounded-full animate-bounce" style={{ height: `${8 + i * 4}px`, animationDelay: `${i * 0.1}s` }} />
                    ))}
                  </div>
                  <p className="text-green-300 text-sm font-bold">{t(lang, "listening")}</p>
                </div>
              )}
              {voice.phase === "processing" && (
                <div>
                  {voice.transcript && <p className="text-white/50 text-xs mb-2">"{voice.transcript}"</p>}
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-green-400 border-t-transparent animate-spin" />
                    <p className="text-green-300 text-sm">{t(lang, "aiProcessing")}</p>
                  </div>
                </div>
              )}
              {voice.phase === "speaking" && voice.answer && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-green-400 text-xs font-bold">🤖 SENSOTECH AI</span>
                    <div className="flex gap-0.5">
                      {[1,2,3].map(i => <div key={i} className="w-1 h-3 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />)}
                    </div>
                  </div>
                  <p className="text-white text-sm leading-relaxed">{voice.answer}</p>
                </div>
              )}
              {voice.error && <p className="text-orange-400 text-sm">{voice.error}</p>}
            </div>
          )}
        </div>

        {/* Dashboard Bottom Navigation */}
        <div
          className="bottom-nav fixed bottom-0 left-0 right-0 flex items-center justify-between px-6 py-3"
          style={{ background: "rgba(0, 8, 0, 0.92)", border: "1px solid rgba(74, 222, 128, 0.15)", borderBottom: "none" }}
        >
          {/* AI Suggestions */}
          <button onClick={onAIAdvisor} className="flex flex-col items-center gap-1 py-1 px-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "rgba(74, 222, 128, 0.1)", border: "1px solid rgba(74, 222, 128, 0.3)" }}>
              <span className="text-xl">💡</span>
            </div>
            <span className="text-green-300 text-xs font-medium">{t(lang, "aiSuggestions")}</span>
          </button>

          {/* Voice AI Mic */}
          <button onClick={startVoice} className="flex flex-col items-center gap-1 py-1">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center relative"
              style={{
                background: typeof micBgColor === "string" && micBgColor.startsWith("linear")
                  ? micBgColor
                  : micBgColor,
                backgroundColor: typeof micBgColor === "string" && !micBgColor.startsWith("linear") ? micBgColor : undefined,
                boxShadow: voice.phase !== "idle" ? `0 0 24px ${voice.phase === "listening" ? "rgba(220,38,38,0.6)" : "rgba(217,119,6,0.6)"}` : "0 0 20px rgba(74, 222, 128, 0.4)",
                transition: "all 0.3s",
              }}
            >
              {voice.phase === "idle" ? (
                <Mic size={26} color="white" />
              ) : (
                <MicOff size={26} color="white" />
              )}
              {voice.phase !== "idle" && (
                <div
                  className="absolute inset-0 rounded-full border-2 border-white/40 animate-ping"
                  style={{ animationDuration: "1s" }}
                />
              )}
            </div>
            <span className="text-white/50 text-xs">{t(lang, "voiceAI")}</span>
          </button>

          {/* Expert Call */}
          <button onClick={handleExpertCall} className="flex flex-col items-center gap-1 py-1 px-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300"
              style={{
                background: connectingExpert ? "rgba(74, 222, 128, 0.2)" : "rgba(74, 222, 128, 0.1)",
                border: `1px solid ${connectingExpert ? "rgba(74, 222, 128, 0.7)" : "rgba(74, 222, 128, 0.3)"}`,
                boxShadow: connectingExpert ? "0 0 16px rgba(74,222,128,0.4)" : "none",
              }}
            >
              {connectingExpert ? (
                <div className="w-5 h-5 rounded-full border-2 border-green-400 border-t-transparent animate-spin" />
              ) : (
                <Phone size={20} color="#4ade80" />
              )}
            </div>
            <span className="text-green-300 text-xs font-medium text-center leading-tight">
              {connectingExpert ? t(lang, "connectingExpert").split("...")[0] + "..." : t(lang, "expertCall")}
            </span>
          </button>
        </div>

        {/* Expert Connecting Popup */}
        {connectingExpert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div className="relative rounded-2xl p-8 text-center w-full max-w-xs" style={{ background: "rgba(0, 20, 0, 0.95)", border: "1px solid rgba(74, 222, 128, 0.4)" }}>
              <div className="relative w-20 h-20 mx-auto mb-4">
                <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #16a34a, #4ade80)" }}>
                  <Phone size={32} color="white" />
                </div>
                <div className="absolute inset-0 rounded-full border-2 border-green-400/50 animate-ping" />
                <div className="absolute inset-[-8px] rounded-full border border-green-400/30 animate-ping" style={{ animationDelay: "0.3s" }} />
              </div>
              <p className="text-green-300 font-bold text-lg mb-1">SENSOTECH Expert</p>
              <p className="text-white/60 text-sm mb-4">{t(lang, "connectingExpert")}</p>
              <div className="flex justify-center gap-1">
                {[1,2,3].map(i => <div key={i} className="w-2 h-2 rounded-full bg-green-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
