import { useState, useRef, useEffect, useCallback } from "react";
import { Leaf, Mic, MicOff, Trash2, Send, Volume2, VolumeX } from "lucide-react";
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
    title: "AI Farm Assistant",
    youSaid: "You",
    clearChat: "Clear chat",
    noHistory: "Ask SENSOTECH AI anything about your farm",
    sensorLive: "Live sensors",
    typeHere: "Type your farming question…",
    listening: "Listening…",
    processing: "AI thinking…",
    speaking: "Speaking…",
    errPermission: "Mic blocked — type your question below instead.",
    errNoSpeech: "No speech detected — type your question below.",
    errNetwork: "Network error with voice — type your question.",
    errBrowser: "Voice not supported here — use the text box.",
    errAI: "AI request failed. Please try again.",
    replay: "Replay answer",
    stopSpeech: "Stop speaking",
    examplesLabel: "Tap a question to ask instantly:",
    examples: [
      "What is your name?",
      "Which crop should I grow?",
      "Is my soil healthy?",
      "Which fertilizer should I use?",
      "When should I water my farm?",
    ],
  },
  mr: {
    title: "AI शेती सहाय्यक",
    youSaid: "तुम्ही",
    clearChat: "बातचीत साफ करा",
    noHistory: "तुमच्या शेताबद्दल SENSOTECH AI ला काहीही विचारा",
    sensorLive: "लाइव्ह सेन्सर",
    typeHere: "शेतीबद्दल प्रश्न टाइप करा…",
    listening: "ऐकत आहे…",
    processing: "AI विचार करत आहे…",
    speaking: "बोलत आहे…",
    errPermission: "माइक ब्लॉक — खाली प्रश्न टाइप करा.",
    errNoSpeech: "आवाज ऐकू आला नाही — खाली टाइप करा.",
    errNetwork: "व्हॉइस नेटवर्क त्रुटी — टाइप करा.",
    errBrowser: "व्हॉइस समर्थित नाही — टेक्स्ट बॉक्स वापरा.",
    errAI: "AI विनंती अयशस्वी. पुन्हा प्रयत्न करा.",
    replay: "उत्तर पुन्हा ऐका",
    stopSpeech: "थांबवा",
    examplesLabel: "थेट विचारण्यासाठी प्रश्न दाबा:",
    examples: [
      "तुमचे नाव काय आहे?",
      "कोणते पीक घ्यावे?",
      "माझी माती निरोगी आहे का?",
      "कोणते खत वापरावे?",
      "शेतात पाणी कधी द्यावे?",
    ],
  },
  hi: {
    title: "AI खेती सहायक",
    youSaid: "आप",
    clearChat: "बातचीत साफ करें",
    noHistory: "अपने खेत के बारे में SENSOTECH AI से कुछ भी पूछें",
    sensorLive: "लाइव सेंसर",
    typeHere: "खेती के बारे में सवाल टाइप करें…",
    listening: "सुन रहा हूँ…",
    processing: "AI सोच रहा है…",
    speaking: "बोल रहा हूँ…",
    errPermission: "माइक ब्लॉक — नीचे सवाल टाइप करें।",
    errNoSpeech: "आवाज नहीं सुनाई दी — नीचे टाइप करें।",
    errNetwork: "वॉइस नेटवर्क त्रुटि — टाइप करें।",
    errBrowser: "वॉइस समर्थित नहीं — टेक्स्ट बॉक्स उपयोग करें।",
    errAI: "AI अनुरोध विफल। दोबारा कोशिश करें।",
    replay: "जवाब फिर सुनें",
    stopSpeech: "रोकें",
    examplesLabel: "सीधे पूछने के लिए सवाल दबाएं:",
    examples: [
      "आपका नाम क्या है?",
      "कौन सी फसल लगाएं?",
      "मेरी मिट्टी स्वस्थ है?",
      "कौन सा खाद इस्तेमाल करें?",
      "खेत में पानी कब दें?",
    ],
  },
};

let msgCounter = 0;

export default function VoiceAI({ onBack, lang }: VoiceAIProps) {
  const { data: sensorData } = useSensorData();
  const [phase, setPhase] = useState<Phase>("idle");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [textInput, setTextInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [lastAIText, setLastAIText] = useState("");

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const ui = UI[lang];

  // ── Load TTS voices (they load async on first call) ──────────────────
  useEffect(() => {
    const load = () => {
      voicesRef.current = window.speechSynthesis?.getVoices() ?? [];
    };
    load();
    window.speechSynthesis?.addEventListener("voiceschanged", load);
    return () => {
      window.speechSynthesis?.removeEventListener("voiceschanged", load);
      stopSpeech();
      recognitionRef.current?.abort();
    };
  }, []);

  // Auto-focus
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, phase]);

  // ── Pick best voice for language ─────────────────────────────────────
  const getBestVoice = useCallback((langCode: string): SpeechSynthesisVoice | null => {
    const voices = voicesRef.current;
    if (!voices.length) return null;
    // 1. Exact match: "hi-IN"
    let v = voices.find((x) => x.lang === langCode);
    if (v) return v;
    // 2. Prefix match: "hi"
    const prefix = langCode.split("-")[0];
    v = voices.find((x) => x.lang.toLowerCase().startsWith(prefix));
    if (v) return v;
    // 3. Fallback to any English
    return voices.find((x) => x.lang.startsWith("en")) ?? null;
  }, []);

  // ── Stop any ongoing speech ───────────────────────────────────────────
  const stopSpeech = useCallback(() => {
    if (window.speechSynthesis?.speaking) {
      window.speechSynthesis.cancel();
    }
  }, []);

  // ── Speak text ────────────────────────────────────────────────────────
  const speakText = useCallback((text: string) => {
    if (!window.speechSynthesis) return;

    // Cancel previous speech first
    stopSpeech();

    const langCode = LANG_CODE[lang];
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = langCode;
    utter.rate = 0.88;
    utter.pitch = 1.05;
    utter.volume = 1;

    const voice = getBestVoice(langCode);
    if (voice) utter.voice = voice;

    utter.onstart = () => setPhase("speaking");
    utter.onend = () => setPhase("idle");
    utter.onerror = (e) => {
      // "interrupted" fires when we cancel intentionally — ignore
      if (e.error !== "interrupted" && e.error !== "canceled") {
        console.warn("TTS error:", e.error);
      }
      setPhase("idle");
    };

    utterRef.current = utter;

    // Chrome bug: speak() sometimes silently fails if called immediately after cancel().
    // A 50ms defer fixes it.
    setTimeout(() => {
      window.speechSynthesis.speak(utter);
    }, 50);
  }, [lang, getBestVoice, stopSpeech]);

  // ── Add message ───────────────────────────────────────────────────────
  const addMessage = (role: "user" | "ai", text: string) => {
    setMessages((prev) => [...prev, { id: ++msgCounter, role, text, timestamp: new Date() }]);
  };

  // ── Ask Gemini AI ─────────────────────────────────────────────────────
  const askAI = async (question: string) => {
    if (!question.trim()) return;
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
      setLastAIText(answer);
      // Speak the answer
      speakText(answer);
    } catch {
      setError(ui.errAI);
      setPhase("idle");
    }
  };

  // ── Replay last AI response ───────────────────────────────────────────
  const handleReplay = () => {
    if (!lastAIText) return;
    if (phase === "speaking") {
      stopSpeech();
      setPhase("idle");
    } else {
      speakText(lastAIText);
    }
  };

  // ── Text send ─────────────────────────────────────────────────────────
  const handleTextSend = async () => {
    const q = textInput.trim();
    if (!q || isSending || phase === "processing") return;
    setTextInput("");
    setIsSending(true);
    await askAI(q);
    setIsSending(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleTextSend();
  };

  // ── Example question tap ──────────────────────────────────────────────
  const handleExampleTap = async (ex: string) => {
    if (phase === "processing" || isSending) return;
    setIsSending(true);
    await askAI(ex);
    setIsSending(false);
    inputRef.current?.focus();
  };

  // ── Voice recognition ─────────────────────────────────────────────────
  const startListening = () => {
    if (phase !== "idle") {
      recognitionRef.current?.abort();
      stopSpeech();
      setPhase("idle");
      return;
    }
    setError("");
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { setError(ui.errBrowser); return; }

    const recognition: SpeechRecognition = new SR();
    recognition.lang = LANG_CODE[lang];
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;
    setPhase("listening");

    recognition.onresult = async (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setIsSending(true);
      await askAI(transcript);
      setIsSending(false);
    };

    recognition.onerror = (e: SpeechRecognitionErrorEvent) => {
      if (e.error === "aborted") return;
      if (e.error === "not-allowed" || e.error === "audio-capture" || e.error === "service-not-allowed") {
        setError(ui.errPermission);
      } else if (e.error === "network") {
        setError(ui.errNetwork);
      } else {
        setError(ui.errNoSpeech);
      }
      setPhase("idle");
    };

    recognition.onend = () => setPhase((p) => p === "listening" ? "idle" : p);
    recognition.start();
  };

  const formatTime = (d: Date) =>
    d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const isbusy = phase === "processing" || isSending;

  // Phase badge colors
  const phaseColor = {
    listening: { bg: "rgba(239,68,68,0.15)", border: "rgba(239,68,68,0.4)", dot: "#ef4444", text: "#fca5a5" },
    processing: { bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.4)", dot: "#f59e0b", text: "#fcd34d" },
    speaking:  { bg: "rgba(96,165,250,0.15)",  border: "rgba(96,165,250,0.4)",  dot: "#60a5fa", text: "#93c5fd" },
    idle: null,
  }[phase];

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
      <div className="absolute inset-0" style={{ background: "rgba(0,6,0,0.84)" }} />

      <div className="relative z-10 flex flex-col min-h-screen">

        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 px-4 py-4 flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(74,222,128,0.13)" }}>

          <button onClick={onBack}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.28)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <Leaf size={12} color="#4ade80" />
              <span className="text-white/45 text-xs font-bold tracking-widest">SENSOTECH</span>
            </div>
            <h1 className="text-white font-black text-base leading-tight">{ui.title}</h1>
          </div>

          {/* Phase badge */}
          {phaseColor && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full"
              style={{ background: phaseColor.bg, border: `1px solid ${phaseColor.border}` }}>
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: phaseColor.dot }} />
              <span className="text-xs font-medium" style={{ color: phaseColor.text }}>
                {phase === "listening" ? ui.listening : phase === "speaking" ? ui.speaking : ui.processing}
              </span>
            </div>
          )}

          {/* Replay button — visible when idle and there's a last response */}
          {phase === "idle" && lastAIText && (
            <button
              onClick={handleReplay}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
              style={{ background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.28)" }}
              title={ui.replay}
            >
              <Volume2 size={15} color="#93c5fd" />
            </button>
          )}

          {/* Stop speech button — visible while speaking */}
          {phase === "speaking" && (
            <button
              onClick={() => { stopSpeech(); setPhase("idle"); }}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
              style={{ background: "rgba(96,165,250,0.15)", border: "1px solid rgba(96,165,250,0.5)" }}
              title={ui.stopSpeech}
            >
              <VolumeX size={15} color="#60a5fa" />
            </button>
          )}

          {/* Clear chat */}
          {messages.length > 0 && phase === "idle" && !lastAIText && (
            <button onClick={() => { setMessages([]); setError(""); setLastAIText(""); }}
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}
              title={ui.clearChat}>
              <Trash2 size={14} color="rgba(255,255,255,0.4)" />
            </button>
          )}
        </div>

        {/* ── Sensor strip ───────────────────────────────────────────── */}
        <div className="flex items-center gap-1.5 mx-4 mt-2 flex-shrink-0 flex-wrap">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
          <span className="text-white/35 text-xs flex-shrink-0">{ui.sensorLive}:</span>
          {[
            { label: `💧 ${sensorData.moisture}%`, c: "#60a5fa" },
            { label: `pH ${sensorData.ph}`, c: "#fde047" },
            { label: `N ${sensorData.nitrogen}`, c: "#4ade80" },
            { label: `P ${sensorData.phosphorus}`, c: "#c084fc" },
            { label: `K ${sensorData.potassium}`, c: "#fb923c" },
          ].map((s) => (
            <span key={s.label} className="text-xs px-1.5 py-0.5 rounded-full flex-shrink-0"
              style={{ background: `${s.c}15`, color: s.c, border: `1px solid ${s.c}35` }}>
              {s.label}
            </span>
          ))}
        </div>

        {/* ── Chat area ──────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2">
          {messages.length === 0 ? (
            <div className="flex flex-col gap-2 pt-2">
              <p className="text-white/30 text-sm text-center pb-1">{ui.noHistory}</p>
              <p className="text-white/25 text-xs text-center">{ui.examplesLabel}</p>
              <div className="flex flex-col gap-2 mt-1">
                {ui.examples.map((ex) => (
                  <button key={ex} onClick={() => handleExampleTap(ex)} disabled={isbusy}
                    className="text-left rounded-xl px-4 py-3 transition-all duration-150 active:scale-95"
                    style={{ background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.18)" }}>
                    <div className="flex items-center gap-3">
                      <span className="text-green-400 text-sm flex-shrink-0">→</span>
                      <span className="text-white/70 text-sm">{ex}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {messages.map((msg, idx) => {
                const isLastAI = msg.role === "ai" && idx === messages.length - 1;
                return (
                  <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.role === "ai" && (
                      <div className="w-7 h-7 rounded-full flex items-center justify-center mr-2 mt-1 flex-shrink-0"
                        style={{ background: "linear-gradient(135deg,#15803d,#4ade80)" }}>
                        <span className="text-xs">🤖</span>
                      </div>
                    )}
                    <div style={{ maxWidth: "82%" }}>
                      <div className="rounded-2xl px-4 py-3"
                        style={
                          msg.role === "user"
                            ? { background: "rgba(74,222,128,0.13)", border: "1px solid rgba(74,222,128,0.26)", borderBottomRightRadius: 4 }
                            : { background: "rgba(0,12,0,0.92)", border: "1px solid rgba(74,222,128,0.16)", borderBottomLeftRadius: 4 }
                        }>
                        {msg.role === "user" && (
                          <p className="text-green-300/70 text-xs font-semibold mb-0.5">{ui.youSaid}</p>
                        )}
                        {msg.role === "ai" && (
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-green-400 text-xs font-bold">🤖 SENSOTECH AI</p>
                            {/* Per-message replay icon */}
                            <button
                              onClick={() => {
                                if (phase === "speaking") { stopSpeech(); setPhase("idle"); }
                                else { setLastAIText(msg.text); speakText(msg.text); }
                              }}
                              className="ml-2 p-1 rounded-full transition-all"
                              style={{
                                background: isLastAI && phase === "speaking" ? "rgba(96,165,250,0.2)" : "rgba(74,222,128,0.08)",
                                border: `1px solid ${isLastAI && phase === "speaking" ? "rgba(96,165,250,0.4)" : "rgba(74,222,128,0.15)"}`,
                              }}
                              title={phase === "speaking" ? ui.stopSpeech : ui.replay}
                            >
                              {isLastAI && phase === "speaking"
                                ? <VolumeX size={11} color="#60a5fa" />
                                : <Volume2 size={11} color="#4ade80" />
                              }
                            </button>
                          </div>
                        )}
                        <p className="text-white text-sm leading-relaxed">{msg.text}</p>
                      </div>
                      <p className="text-white/18 text-xs mt-0.5 px-1 text-right">{formatTime(msg.timestamp)}</p>
                    </div>
                  </div>
                );
              })}

              {/* Typing dots */}
              {phase === "processing" && (
                <div className="flex justify-start">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center mr-2 mt-1 flex-shrink-0"
                    style={{ background: "linear-gradient(135deg,#15803d,#4ade80)" }}>
                    <span className="text-xs">🤖</span>
                  </div>
                  <div className="rounded-2xl px-4 py-3"
                    style={{ background: "rgba(0,12,0,0.92)", border: "1px solid rgba(74,222,128,0.16)", borderBottomLeftRadius: 4 }}>
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

        {/* ── Error strip ────────────────────────────────────────────── */}
        {error && (
          <div className="mx-4 mb-1 px-3 py-2 rounded-xl flex items-start gap-2 flex-shrink-0"
            style={{ background: "rgba(251,146,60,0.09)", border: "1px solid rgba(251,146,60,0.24)" }}>
            <span className="text-base flex-shrink-0">⚠️</span>
            <p className="text-orange-300 text-xs leading-relaxed flex-1">{error}</p>
            <button onClick={() => setError("")} className="text-orange-300/50 text-xs flex-shrink-0">✕</button>
          </div>
        )}

        {/* ── Input bar ──────────────────────────────────────────────── */}
        <div className="flex-shrink-0 px-4 pt-3 pb-5"
          style={{ borderTop: "1px solid rgba(74,222,128,0.1)", background: "rgba(0,4,0,0.94)" }}>

          <div className="flex gap-2 items-center">
            {/* Mic button */}
            <button
              onClick={startListening}
              disabled={phase === "processing" || isSending}
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200"
              style={{
                background:
                  phase === "listening" ? "#dc2626"
                  : phase === "speaking" ? "#1d4ed8"
                  : "rgba(74,222,128,0.1)",
                border: `1px solid ${
                  phase === "listening" ? "rgba(220,38,38,0.6)"
                  : phase === "speaking" ? "rgba(29,78,216,0.5)"
                  : "rgba(74,222,128,0.28)"
                }`,
                boxShadow: phase === "listening" ? "0 0 16px rgba(220,38,38,0.4)" : "none",
                opacity: (phase === "processing" || isSending) ? 0.45 : 1,
              }}
            >
              {phase === "listening" ? <MicOff size={18} color="white" /> : <Mic size={18} color="#4ade80" />}
            </button>

            {/* Text input */}
            <input
              ref={inputRef}
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={ui.typeHere}
              disabled={isbusy}
              className="flex-1 rounded-xl px-4 py-3 text-sm text-white outline-none"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(74,222,128,0.2)",
                caretColor: "#4ade80",
              }}
            />

            {/* Send button */}
            <button
              onClick={handleTextSend}
              disabled={!textInput.trim() || isbusy}
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200"
              style={{
                background: textInput.trim() && !isbusy
                  ? "linear-gradient(135deg,#15803d,#4ade80)"
                  : "rgba(255,255,255,0.05)",
                border: "1px solid rgba(74,222,128,0.2)",
                opacity: !textInput.trim() || isbusy ? 0.4 : 1,
              }}
            >
              {isbusy && !textInput.trim()
                ? <div className="w-4 h-4 rounded-full border-2 border-green-400 border-t-transparent animate-spin" />
                : <Send size={17} color={textInput.trim() && !isbusy ? "white" : "#4ade80"} />
              }
            </button>
          </div>

          <p className="text-white/18 text-xs text-center mt-2.5">
            {lang === "mr" ? "🗣️ मराठी" : lang === "hi" ? "🗣️ हिंदी" : "🗣️ English"} · Gemini AI + Voice
          </p>
        </div>

      </div>
    </div>
  );
}
