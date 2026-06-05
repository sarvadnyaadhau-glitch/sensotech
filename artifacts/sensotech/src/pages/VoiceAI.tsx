import { useState, useRef, useEffect } from "react";
import { Leaf, Mic, MicOff, Trash2, Send } from "lucide-react";
import { type Language } from "@/lib/translations";
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
    listening: "Listening… speak now",
    processing: "AI is thinking…",
    speaking: "AI is speaking…",
    youSaid: "You",
    clearChat: "Clear chat",
    noHistory: "No conversation yet.\nTap the mic or type a question!",
    sensorLive: "Live sensor data",
    placeholder: "Tap mic or type your question…",
    typeHere: "Type your question…",
    send: "Send",
    errPermission: "Microphone blocked. Please allow mic access in your browser settings, or type your question below.",
    errNoSpeech: "No speech heard. Please speak clearly, or type your question below.",
    errNetwork: "Network error with voice. Please type your question below.",
    errBrowser: "Voice not supported in this browser. Use the text box below.",
    errAI: "AI request failed. Please check your internet connection.",
    examples: ["Which crop should I grow?", "Is my soil healthy?", "Which fertilizer should I use?", "Why are leaves turning yellow?"],
    examplesLabel: "Try asking:",
    micTip: "Allow microphone → tap mic → speak your farming question",
  },
  mr: {
    title: "व्हॉइस AI सहाय्यक",
    subtitle: "तुमच्या शेताबद्दल काहीही विचारा",
    startListening: "ऐकणे सुरू करा",
    stopListening: "थांबा",
    listening: "ऐकत आहे… बोला",
    processing: "AI विचार करत आहे…",
    speaking: "AI बोलत आहे…",
    youSaid: "तुम्ही",
    clearChat: "बातचीत साफ करा",
    noHistory: "अजून कोणतीही संभाषण नाही.\nमाइक दाबा किंवा प्रश्न टाइप करा!",
    sensorLive: "लाइव्ह सेन्सर डेटा",
    placeholder: "माइक दाबा किंवा प्रश्न टाइप करा…",
    typeHere: "तुमचा प्रश्न टाइप करा…",
    send: "पाठवा",
    errPermission: "माइक ब्लॉक आहे. ब्राउझर सेटिंग्जमध्ये माइक परवानगी द्या, किंवा खालील बॉक्समध्ये टाइप करा.",
    errNoSpeech: "आवाज ऐकू आला नाही. स्पष्टपणे बोला किंवा खालील बॉक्समध्ये टाइप करा.",
    errNetwork: "व्हॉइससह नेटवर्क त्रुटी. कृपया खालील बॉक्समध्ये टाइप करा.",
    errBrowser: "या ब्राउझरमध्ये व्हॉइस समर्थित नाही. खालील बॉक्स वापरा.",
    errAI: "AI विनंती अयशस्वी. कृपया इंटरनेट तपासा.",
    examples: ["कोणते पीक घ्यावे?", "माझी माती निरोगी आहे का?", "कोणते खत वापरावे?", "पाने पिवळी का पडत आहेत?"],
    examplesLabel: "विचारण्याचा प्रयत्न करा:",
    micTip: "माइक परवानगी द्या → माइक दाबा → शेतीबद्दल बोला",
  },
  hi: {
    title: "वॉइस AI सहायक",
    subtitle: "अपने खेत के बारे में कुछ भी पूछें",
    startListening: "सुनना शुरू करें",
    stopListening: "रोकें",
    listening: "सुन रहा हूँ… बोलिए",
    processing: "AI सोच रहा है…",
    speaking: "AI बोल रहा है…",
    youSaid: "आप",
    clearChat: "बातचीत साफ करें",
    noHistory: "अभी कोई बातचीत नहीं।\nमाइक दबाएं या सवाल टाइप करें!",
    sensorLive: "लाइव सेंसर डेटा",
    placeholder: "माइक दबाएं या सवाल टाइप करें…",
    typeHere: "अपना सवाल टाइप करें…",
    send: "भेजें",
    errPermission: "माइक ब्लॉक है। ब्राउज़र सेटिंग में माइक की अनुमति दें, या नीचे टाइप करें।",
    errNoSpeech: "आवाज नहीं सुनाई दी। स्पष्ट बोलें या नीचे टाइप करें।",
    errNetwork: "वॉइस के साथ नेटवर्क त्रुटि। कृपया नीचे टाइप करें।",
    errBrowser: "इस ब्राउज़र में वॉइस समर्थित नहीं। नीचे बॉक्स उपयोग करें।",
    errAI: "AI अनुरोध विफल। कृपया इंटरनेट जांचें।",
    examples: ["कौन सी फसल लगाएं?", "मेरी मिट्टी स्वस्थ है?", "कौन सा खाद इस्तेमाल करें?", "पत्ते पीले क्यों हो रहे हैं?"],
    examplesLabel: "पूछने की कोशिश करें:",
    micTip: "माइक अनुमति दें → माइक दबाएं → खेती के बारे में बोलें",
  },
};

let msgCounter = 0;

export default function VoiceAI({ onBack, lang }: VoiceAIProps) {
  const { data: sensorData } = useSensorData();
  const [phase, setPhase] = useState<Phase>("idle");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [error, setError] = useState("");
  const [textInput, setTextInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
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
    setMessages((prev) => [...prev, { id: ++msgCounter, role, text, timestamp: new Date() }]);
  };

  const stopAll = () => {
    recognitionRef.current?.abort();
    window.speechSynthesis?.cancel();
    setPhase("idle");
    setCurrentTranscript("");
  };

  const askAI = async (question: string) => {
    addMessage("user", question);
    setPhase("processing");
    setError("");
    try {
      const baseUrl = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";
      const resp = await fetch(`${baseUrl}/api/farm-ai/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
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
      const answer: string = json.answer || ui.errAI;
      addMessage("ai", answer);
      setPhase("speaking");

      const utter = new SpeechSynthesisUtterance(answer);
      utter.lang = LANG_CODE[lang];
      utter.rate = 0.88;
      utter.pitch = 1.05;
      utter.onend = () => { setPhase("idle"); setCurrentTranscript(""); };
      utter.onerror = () => { setPhase("idle"); setCurrentTranscript(""); };
      window.speechSynthesis.speak(utter);
    } catch {
      setError(ui.errAI);
      setPhase("idle");
      setCurrentTranscript("");
    }
  };

  const startListening = () => {
    setError("");
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      setError(ui.errBrowser);
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
      await askAI(transcript);
    };

    recognition.onerror = (e: SpeechRecognitionErrorEvent) => {
      if (e.error === "aborted") return;
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        setError(ui.errPermission);
      } else if (e.error === "no-speech") {
        setError(ui.errNoSpeech);
      } else if (e.error === "network") {
        setError(ui.errNetwork);
      } else if (e.error === "audio-capture") {
        setError(ui.errPermission);
      } else {
        setError(ui.errNoSpeech);
      }
      setPhase("idle");
      setCurrentTranscript("");
    };

    recognition.onend = () => {
      setPhase((p) => (p === "listening" ? "idle" : p));
    };

    recognition.start();
  };

  const handleMicButton = () => {
    if (phase === "idle") startListening();
    else stopAll();
  };

  const handleTextSend = async () => {
    const q = textInput.trim();
    if (!q || isSending || phase === "processing") return;
    setTextInput("");
    setIsSending(true);
    await askAI(q);
    setIsSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleTextSend();
  };

  const handleExampleTap = (ex: string) => {
    setTextInput(ex);
    inputRef.current?.focus();
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
            <div className="flex items-center gap-1.5">
              <Leaf size={13} color="#4ade80" />
              <span className="text-white/50 text-xs font-bold tracking-widest">SENSOTECH</span>
            </div>
            <h1 className="text-white font-black text-lg leading-tight">{ui.title}</h1>
          </div>
          {messages.length > 0 && (
            <button
              onClick={() => { setMessages([]); setError(""); }}
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
              title={ui.clearChat}
            >
              <Trash2 size={15} color="rgba(255,255,255,0.45)" />
            </button>
          )}
        </div>

        {/* Live sensor strip */}
        <div
          className="flex items-center gap-2 mx-4 mt-3 rounded-xl px-3 py-2 flex-shrink-0 flex-wrap"
          style={{ background: "rgba(0,10,0,0.8)", border: "1px solid rgba(74,222,128,0.2)" }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
          <span className="text-white/45 text-xs flex-shrink-0">{ui.sensorLive}</span>
          {[
            { label: `💧${sensorData.moisture}%`, color: "#60a5fa" },
            { label: `pH ${sensorData.ph}`, color: "#fde047" },
            { label: `N ${sensorData.nitrogen}`, color: "#4ade80" },
            { label: `P ${sensorData.phosphorus}`, color: "#c084fc" },
            { label: `K ${sensorData.potassium}`, color: "#fb923c" },
          ].map((s) => (
            <span key={s.label} className="text-xs px-1.5 py-0.5 rounded-full flex-shrink-0"
              style={{ background: `${s.color}18`, color: s.color, border: `1px solid ${s.color}38` }}>
              {s.label}
            </span>
          ))}
        </div>

        {/* Chat history */}
        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-4">
              {/* Mic visual */}
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.18)" }}
              >
                <Mic size={28} color="rgba(74,222,128,0.55)" />
              </div>
              <p className="text-white/35 text-sm text-center whitespace-pre-line leading-relaxed px-4">
                {ui.noHistory}
              </p>
              {/* Tip */}
              <p className="text-white/25 text-xs text-center px-6">{ui.micTip}</p>
              {/* Example questions */}
              <div
                className="rounded-xl p-3 w-full"
                style={{ background: "rgba(0,10,0,0.7)", border: "1px solid rgba(74,222,128,0.13)" }}
              >
                <p className="text-white/35 text-xs mb-2">{ui.examplesLabel}</p>
                {ui.examples.map((ex) => (
                  <button
                    key={ex}
                    onClick={() => handleExampleTap(ex)}
                    className="flex items-center gap-2 py-1.5 w-full text-left"
                  >
                    <span className="text-green-400 text-xs flex-shrink-0">→</span>
                    <span className="text-white/55 text-xs italic hover:text-white/80 transition-colors">"{ex}"</span>
                  </button>
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
                          ? { background: "rgba(74,222,128,0.14)", border: "1px solid rgba(74,222,128,0.28)", borderBottomRightRadius: 4 }
                          : { background: "rgba(0,12,0,0.9)", border: "1px solid rgba(74,222,128,0.18)", borderBottomLeftRadius: 4 }
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
                    <p className="text-white/20 text-xs mt-1 px-1 text-right">{formatTime(msg.timestamp)}</p>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {phase === "processing" && (
                <div className="flex justify-start">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center mr-2 mt-1 flex-shrink-0"
                    style={{ background: "linear-gradient(135deg,#15803d,#4ade80)" }}>
                    <span className="text-xs">🤖</span>
                  </div>
                  <div className="rounded-2xl px-4 py-3"
                    style={{ background: "rgba(0,12,0,0.9)", border: "1px solid rgba(74,222,128,0.18)", borderBottomLeftRadius: 4 }}>
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

        {/* Error banner */}
        {error && (
          <div className="mx-4 mb-2 px-4 py-2.5 rounded-xl flex-shrink-0 flex items-start gap-2"
            style={{ background: "rgba(251,146,60,0.1)", border: "1px solid rgba(251,146,60,0.28)" }}>
            <span className="flex-shrink-0 mt-0.5">⚠️</span>
            <p className="text-orange-300 text-xs leading-relaxed">{error}</p>
          </div>
        )}

        {/* Bottom: Mic + Status + Text input */}
        <div
          className="flex-shrink-0 px-4 pt-4 pb-5"
          style={{ borderTop: "1px solid rgba(74,222,128,0.12)", background: "rgba(0,5,0,0.92)" }}
        >
          {/* Mic row */}
          <div className="flex flex-col items-center gap-2 mb-4">
            {/* Phase label */}
            <div className="flex items-center gap-2 h-5">
              {phase !== "idle" && (
                <div className="w-2 h-2 rounded-full animate-pulse flex-shrink-0" style={{ background: phaseColor }} />
              )}
              <p className="text-xs font-medium" style={{ color: phase === "idle" ? "rgba(255,255,255,0.28)" : phaseColor }}>
                {phaseLabel}
              </p>
            </div>

            {/* Transcript preview while listening */}
            {phase === "listening" && currentTranscript && (
              <p className="text-white/40 text-xs italic text-center px-4">"{currentTranscript}"</p>
            )}

            {/* Mic button */}
            <button
              onClick={handleMicButton}
              disabled={phase === "processing"}
              className="relative w-18 h-18 rounded-full flex items-center justify-center transition-all duration-300"
              style={{
                width: 72,
                height: 72,
                background:
                  phase === "listening" ? "#dc2626"
                  : phase === "processing" ? "#92400e"
                  : phase === "speaking" ? "#1e40af"
                  : "linear-gradient(135deg,#15803d,#4ade80)",
                boxShadow:
                  phase === "listening" ? "0 0 28px rgba(220,38,38,0.55)"
                  : phase === "processing" ? "0 0 20px rgba(146,64,14,0.4)"
                  : phase === "speaking" ? "0 0 28px rgba(30,64,175,0.5)"
                  : "0 0 20px rgba(74,222,128,0.38)",
                opacity: phase === "processing" ? 0.7 : 1,
              }}
            >
              {phase === "idle" || phase === "speaking"
                ? <Mic size={30} color="white" />
                : <MicOff size={30} color="white" />
              }
              {(phase === "listening") && (
                <>
                  <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping" style={{ animationDuration: "1s" }} />
                  <div className="absolute inset-[-10px] rounded-full border border-white/15 animate-ping" style={{ animationDuration: "1.5s", animationDelay: "0.25s" }} />
                </>
              )}
            </button>

            {/* Start / Stop button */}
            <button
              onClick={phase === "idle" ? startListening : stopAll}
              disabled={phase === "processing"}
              className="px-6 py-2 rounded-full text-xs font-bold transition-all duration-200"
              style={
                phase === "idle" || phase === "speaking"
                  ? { background: "rgba(74,222,128,0.13)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.38)" }
                  : { background: "rgba(239,68,68,0.13)", color: "#f87171", border: "1px solid rgba(239,68,68,0.38)" }
              }
            >
              {phase === "idle" || phase === "speaking" ? ui.startListening : ui.stopListening}
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
            <span className="text-white/25 text-xs">or type</span>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
          </div>

          {/* Text input */}
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={ui.typeHere}
              disabled={phase === "processing" || isSending}
              className="flex-1 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(74,222,128,0.22)",
                caretColor: "#4ade80",
              }}
            />
            <button
              onClick={handleTextSend}
              disabled={!textInput.trim() || phase === "processing" || isSending}
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
              style={{
                background: textInput.trim() ? "linear-gradient(135deg,#15803d,#4ade80)" : "rgba(255,255,255,0.06)",
                opacity: !textInput.trim() || phase === "processing" ? 0.5 : 1,
              }}
            >
              {isSending
                ? <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                : <Send size={16} color="white" />
              }
            </button>
          </div>

          {/* Lang indicator */}
          <p className="text-white/20 text-xs text-center mt-3">
            {lang === "mr" ? "🗣️ मराठी" : lang === "hi" ? "🗣️ हिंदी" : "🗣️ English"} · Gemini AI + Web Speech
          </p>
        </div>
      </div>
    </div>
  );
}
