import { useState, useRef, useEffect } from "react";
import { Leaf, Mic, MicOff, Trash2 } from "lucide-react";
import { t, type Language } from "@/lib/translations";
import { useSensorData } from "@/lib/useSensorData";

interface VoiceAIProps {
  onBack: () => void;
  lang: Language;
}

interface ChatMessage {
  id: number;
  role: "user" | "ai";
  text: string;
  timestamp: Date;
}

type Phase = "idle" | "listening" | "processing" | "speaking";

const LANG_CODE: Record<Language, string> = {
  en: "en-IN",
  mr: "mr-IN",
  hi: "hi-IN",
};

const UI = {
  en: {
    title: "Voice AI Assistant",
    subtitle: "Ask anything about your farm",
    startListening: "Start Listening",
    stopListening: "Stop",
    listening: "Listening...",
    processing: "AI is thinking...",
    speaking: "AI is speaking...",
    youSaid: "You said",
    clearChat: "Clear chat",
    noHistory: "No conversation yet.\nTap the mic and ask a farming question!",
    sensorLive: "Live sensor data connected",
    placeholder: "Tap mic to speak",
    errorNoSpeech: "Could not hear you. Please try again in a quiet place.",
    errorBrowser: "Voice not supported. Please use Chrome browser.",
    errorAI: "AI request failed. Please check your connection.",
    examples: ["Which crop should I grow?", "Is my soil healthy?", "Which fertilizer should I use?"],
    examplesHi: "Try asking:",
  },
  mr: {
    title: "व्हॉइस AI सहाय्यक",
    subtitle: "तुमच्या शेताबद्दल काहीही विचारा",
    startListening: "ऐकणे सुरू करा",
    stopListening: "थांबा",
    listening: "ऐकत आहे...",
    processing: "AI विचार करत आहे...",
    speaking: "AI बोलत आहे...",
    youSaid: "तुम्ही म्हणालात",
    clearChat: "बातचीत साफ करा",
    noHistory: "अजून कोणतीही संभाषण नाही.\nमाइक दाबा आणि शेतीबद्दल प्रश्न विचारा!",
    sensorLive: "लाइव्ह सेन्सर डेटा जोडलेला आहे",
    placeholder: "बोलण्यासाठी माइक दाबा",
    errorNoSpeech: "तुमचा आवाज ऐकू आला नाही. शांत जागी पुन्हा प्रयत्न करा.",
    errorBrowser: "आवाज समर्थित नाही. कृपया Chrome ब्राउझर वापरा.",
    errorAI: "AI विनंती अयशस्वी. कृपया तुमचे इंटरनेट तपासा.",
    examples: ["कोणते पीक घ्यावे?", "माझी माती निरोगी आहे का?", "कोणते खत वापरावे?"],
    examplesHi: "विचारण्याचा प्रयत्न करा:",
  },
  hi: {
    title: "वॉइस AI सहायक",
    subtitle: "अपने खेत के बारे में कुछ भी पूछें",
    startListening: "सुनना शुरू करें",
    stopListening: "रोकें",
    listening: "सुन रहा हूँ...",
    processing: "AI सोच रहा है...",
    speaking: "AI बोल रहा है...",
    youSaid: "आपने कहा",
    clearChat: "बातचीत साफ करें",
    noHistory: "अभी कोई बातचीत नहीं।\nमाइक दबाएं और खेती के बारे में सवाल पूछें!",
    sensorLive: "लाइव सेंसर डेटा जुड़ा है",
    placeholder: "बोलने के लिए माइक दबाएं",
    errorNoSpeech: "आपकी आवाज नहीं सुनाई दी। शांत जगह पर दोबारा कोशिश करें।",
    errorBrowser: "वॉइस समर्थित नहीं है। कृपया Chrome ब्राउज़र उपयोग करें।",
    errorAI: "AI अनुरोध विफल। कृपया अपना इंटरनेट जांचें।",
    examples: ["कौन सी फसल लगाएं?", "मेरी मिट्टी स्वस्थ है?", "कौन सा खाद इस्तेमाल करें?"],
    examplesHi: "पूछने की कोशिश करें:",
  },
};

let msgCounter = 0;

export default function VoiceAI({ onBack, lang }: VoiceAIProps) {
  const { data: sensorData } = useSensorData();
  const [phase, setPhase] = useState<Phase>("idle");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [error, setError] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const ui = UI[lang];

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
      window.speechSynthesis?.cancel();
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, phase]);

  const addMessage = (role: "user" | "ai", text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: ++msgCounter, role, text, timestamp: new Date() },
    ]);
  };

  const stopAll = () => {
    recognitionRef.current?.abort();
    window.speechSynthesis?.cancel();
    setPhase("idle");
    setCurrentTranscript("");
  };

  const startListening = () => {
    setError("");
    const SR =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SR) {
      setError(ui.errorBrowser);
      return;
    }

    const recognition: SpeechRecognition = new SR();
    recognition.lang = LANG_CODE[lang];
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;
    setPhase("listening");
    setCurrentTranscript("");

    recognition.onresult = async (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setCurrentTranscript(transcript);
      addMessage("user", transcript);
      setPhase("processing");

      try {
        const baseUrl = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";
        const resp = await fetch(`${baseUrl}/api/farm-ai/ask`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: transcript,
            language: lang,
            sensorData: {
              moisture: sensorData.moisture,
              ph: sensorData.ph,
              nitrogen: sensorData.nitrogen,
              phosphorus: sensorData.phosphorus,
              potassium: sensorData.potassium,
              crop: sensorData.crop,
              fertilizer: sensorData.fertilizer,
            },
            farmName: "Mauli Farm",
            cropType: sensorData.crop,
          }),
        });
        const json = await resp.json();
        const answer: string = json.answer || ui.errorAI;
        addMessage("ai", answer);
        setPhase("speaking");

        const utter = new SpeechSynthesisUtterance(answer);
        utter.lang = LANG_CODE[lang];
        utter.rate = 0.88;
        utter.pitch = 1.05;
        synthRef.current = utter;
        utter.onend = () => { setPhase("idle"); setCurrentTranscript(""); };
        utter.onerror = () => { setPhase("idle"); setCurrentTranscript(""); };
        window.speechSynthesis.speak(utter);
      } catch {
        setError(ui.errorAI);
        setPhase("idle");
        setCurrentTranscript("");
      }
    };

    recognition.onerror = (e: SpeechRecognitionErrorEvent) => {
      if (e.error !== "aborted") setError(ui.errorNoSpeech);
      setPhase("idle");
      setCurrentTranscript("");
    };

    recognition.onend = () => {
      setPhase((p) => (p === "listening" ? "idle" : p));
    };

    recognition.start();
  };

  const handleMicButton = () => {
    if (phase === "idle") {
      startListening();
    } else {
      stopAll();
    }
  };

  const phaseColor =
    phase === "listening" ? "#ef4444"
    : phase === "processing" ? "#f59e0b"
    : phase === "speaking" ? "#60a5fa"
    : "#4ade80";

  const phaseLabel =
    phase === "listening" ? ui.listening
    : phase === "processing" ? ui.processing
    : phase === "speaking" ? ui.speaking
    : ui.placeholder;

  const formatTime = (d: Date) =>
    d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

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
      <div className="absolute inset-0" style={{ background: "rgba(0,6,0,0.82)" }} />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <div
          className="flex items-center gap-3 px-4 py-4 flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(74,222,128,0.15)" }}
        >
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.3)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Leaf size={13} color="#4ade80" />
              <span className="text-white/50 text-xs font-bold tracking-widest">SENSOTECH</span>
            </div>
            <h1 className="text-white font-black text-lg leading-tight">{ui.title}</h1>
          </div>
          {messages.length > 0 && (
            <button
              onClick={() => { setMessages([]); setError(""); }}
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}
              title={ui.clearChat}
            >
              <Trash2 size={15} color="rgba(255,255,255,0.5)" />
            </button>
          )}
        </div>

        {/* Live sensor strip */}
        <div
          className="flex items-center gap-2 mx-4 mt-3 rounded-xl px-3 py-2 flex-shrink-0"
          style={{ background: "rgba(0,10,0,0.8)", border: "1px solid rgba(74,222,128,0.2)" }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-white/50 text-xs">{ui.sensorLive}</span>
          <div className="flex gap-1.5 ml-1 flex-wrap">
            {[
              { label: `💧${sensorData.moisture}%`, color: "#60a5fa" },
              { label: `pH ${sensorData.ph}`, color: "#fde047" },
              { label: `N ${sensorData.nitrogen}`, color: "#4ade80" },
              { label: `P ${sensorData.phosphorus}`, color: "#c084fc" },
              { label: `K ${sensorData.potassium}`, color: "#fb923c" },
            ].map((s) => (
              <span key={s.label} className="text-xs px-1.5 py-0.5 rounded-full"
                style={{ background: `${s.color}18`, color: s.color, border: `1px solid ${s.color}40` }}>
                {s.label}
              </span>
            ))}
          </div>
        </div>

        {/* Chat history */}
        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-3">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[200px] gap-5 py-6">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)" }}
              >
                <Mic size={32} color="rgba(74,222,128,0.6)" />
              </div>
              <p className="text-white/40 text-sm text-center whitespace-pre-line leading-relaxed">
                {ui.noHistory}
              </p>
              <div
                className="rounded-xl p-3 w-full"
                style={{ background: "rgba(0,10,0,0.7)", border: "1px solid rgba(74,222,128,0.15)" }}
              >
                <p className="text-white/40 text-xs mb-2">{ui.examplesHi}</p>
                {ui.examples.map((ex) => (
                  <div key={ex} className="flex items-center gap-2 py-1">
                    <span className="text-green-400 text-xs">→</span>
                    <span className="text-white/60 text-xs italic">"{ex}"</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "ai" && (
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center mr-2 mt-1 flex-shrink-0"
                      style={{ background: "linear-gradient(135deg,#15803d,#4ade80)" }}
                    >
                      <span className="text-xs">🤖</span>
                    </div>
                  )}
                  <div style={{ maxWidth: "80%" }}>
                    <div
                      className="rounded-2xl px-4 py-3"
                      style={
                        msg.role === "user"
                          ? { background: "rgba(74,222,128,0.15)", border: "1px solid rgba(74,222,128,0.3)", borderBottomRightRadius: 4 }
                          : { background: "rgba(0,10,0,0.88)", border: "1px solid rgba(74,222,128,0.2)", borderBottomLeftRadius: 4 }
                      }
                    >
                      {msg.role === "user" && (
                        <p className="text-green-300 text-xs font-bold mb-1">{ui.youSaid}</p>
                      )}
                      {msg.role === "ai" && (
                        <p className="text-green-400 text-xs font-bold mb-1">🤖 SENSOTECH AI</p>
                      )}
                      <p className="text-white text-sm leading-relaxed">{msg.text}</p>
                    </div>
                    <p className="text-white/25 text-xs mt-1 px-1 text-right">
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              ))}

              {/* Typing / speaking indicator */}
              {phase === "processing" && (
                <div className="flex justify-start">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center mr-2 mt-1 flex-shrink-0" style={{ background: "linear-gradient(135deg,#15803d,#4ade80)" }}>
                    <span className="text-xs">🤖</span>
                  </div>
                  <div className="rounded-2xl px-4 py-3" style={{ background: "rgba(0,10,0,0.88)", border: "1px solid rgba(74,222,128,0.2)", borderBottomLeftRadius: 4 }}>
                    <div className="flex gap-1 items-center h-5">
                      {[0, 1, 2].map((i) => (
                        <div key={i} className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 0.18}s` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mx-4 mb-2 px-4 py-2 rounded-xl text-orange-300 text-sm flex-shrink-0"
            style={{ background: "rgba(251,146,60,0.1)", border: "1px solid rgba(251,146,60,0.25)" }}>
            ⚠️ {error}
          </div>
        )}

        {/* Mic area */}
        <div
          className="flex-shrink-0 flex flex-col items-center gap-4 py-6 px-4"
          style={{ borderTop: "1px solid rgba(74,222,128,0.12)", background: "rgba(0,6,0,0.9)" }}
        >
          {/* Status label */}
          <div className="flex items-center gap-2">
            {phase !== "idle" && (
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: phaseColor }} />
            )}
            <p className="text-sm font-medium" style={{ color: phase === "idle" ? "rgba(255,255,255,0.35)" : phaseColor }}>
              {phaseLabel}
            </p>
          </div>

          {/* Transcript preview */}
          {phase !== "idle" && currentTranscript && (
            <p className="text-white/50 text-xs italic text-center px-4">"{currentTranscript}"</p>
          )}

          {/* Mic button */}
          <button
            onClick={handleMicButton}
            className="relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300"
            style={{
              background:
                phase === "listening" ? "#dc2626"
                : phase === "processing" ? "#d97706"
                : phase === "speaking" ? "#1d4ed8"
                : "linear-gradient(135deg,#15803d,#4ade80)",
              boxShadow:
                phase === "listening" ? "0 0 32px rgba(220,38,38,0.6)"
                : phase === "processing" ? "0 0 32px rgba(217,119,6,0.5)"
                : phase === "speaking" ? "0 0 32px rgba(96,165,250,0.5)"
                : "0 0 24px rgba(74,222,128,0.4)",
            }}
          >
            {phase === "idle" ? <Mic size={32} color="white" /> : <MicOff size={32} color="white" />}
            {phase !== "idle" && (
              <>
                <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping" style={{ animationDuration: "1s" }} />
                <div className="absolute inset-[-10px] rounded-full border border-white/15 animate-ping" style={{ animationDuration: "1.4s", animationDelay: "0.2s" }} />
              </>
            )}
          </button>

          {/* Start / Stop label buttons */}
          <div className="flex gap-3">
            <button
              onClick={phase === "idle" ? startListening : stopAll}
              className="px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-200"
              style={
                phase === "idle"
                  ? { background: "rgba(74,222,128,0.15)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.4)" }
                  : { background: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.4)" }
              }
            >
              {phase === "idle" ? ui.startListening : ui.stopListening}
            </button>
          </div>

          {/* Language indicator */}
          <p className="text-white/25 text-xs">
            {lang === "mr" ? "🗣️ मराठी" : lang === "hi" ? "🗣️ हिंदी" : "🗣️ English"} — Web Speech API
          </p>
        </div>
      </div>
    </div>
  );
}
