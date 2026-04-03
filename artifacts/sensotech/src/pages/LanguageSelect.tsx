import { Leaf } from "lucide-react";
import { type Language } from "@/lib/translations";

interface LanguageSelectProps {
  onSelect: (lang: Language) => void;
}

const languages: { code: Language; native: string; label: string }[] = [
  { code: "en", native: "English", label: "English" },
  { code: "mr", native: "मराठी", label: "Marathi" },
  { code: "hi", native: "हिंदी", label: "Hindi" },
  { code: "ta" as Language, native: "தமிழ்", label: "Tamil" },
  { code: "te" as Language, native: "తెలుగు", label: "Telugu" },
  { code: "kn" as Language, native: "ಕನ್ನಡ", label: "Kannada" },
  { code: "gu" as Language, native: "ગુજરાતી", label: "Gujarati" },
  { code: "pa" as Language, native: "ਪੰਜਾਬੀ", label: "Punjabi" },
];

export default function LanguageSelect({ onSelect }: LanguageSelectProps) {
  const handleSelect = (code: string) => {
    const lang: Language = (["en", "mr", "hi"].includes(code) ? code : "en") as Language;
    onSelect(lang);
  };

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center px-4 py-10"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1920&q=80')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0" style={{ background: "rgba(0, 10, 0, 0.62)" }} />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Leaf size={16} color="#4ade80" />
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
            <Leaf size={16} color="#4ade80" />
          </div>
          <h2 className="text-3xl font-black text-white mb-2">Choose Your Language</h2>
          <p className="text-white/60 text-sm">अपनी भाषा चुनें • भाषा निवडा</p>
        </div>

        <div
          className="rounded-2xl p-5"
          style={{ background: "rgba(0,15,0,0.65)", border: "1px solid rgba(74, 222, 128, 0.2)", backdropFilter: "blur(20px)" }}
        >
          <div className="grid grid-cols-2 gap-3">
            {languages.map((lang, idx) => (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className="lang-btn rounded-xl py-5 px-4 flex flex-col items-center gap-1 text-center relative overflow-hidden"
                style={{ background: "rgba(0, 15, 0, 0.4)" }}
              >
                <span className="text-2xl font-bold text-green-300">{lang.native}</span>
                <span className="text-white/50 text-xs">{lang.label}</span>
                <span
                  className="absolute top-2 left-2 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                  style={{ background: "rgba(74, 222, 128, 0.2)", color: "#4ade80", fontSize: "10px" }}
                >
                  {idx + 1}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
