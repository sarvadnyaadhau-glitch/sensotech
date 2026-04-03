interface LanguageSelectProps {
  onSelect: (lang: string) => void;
}

const languages = [
  { code: "en", label: "English", native: "English", functional: true },
  { code: "mr", label: "Marathi", native: "मराठी", functional: true },
  { code: "hi", label: "Hindi", native: "हिंदी", functional: true },
  { code: "ta", label: "Tamil", native: "தமிழ்", functional: false },
  { code: "te", label: "Telugu", native: "తెలుగు", functional: false },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ", functional: false },
  { code: "gu", label: "Gujarati", native: "ગુજરાતી", functional: false },
  { code: "pa", label: "Punjabi", native: "ਪੰਜਾਬੀ", functional: false },
];

export default function LanguageSelect({ onSelect }: LanguageSelectProps) {
  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center px-4 py-10"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1920&q=80')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-overlay" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-1 h-8 rounded-full" style={{ background: "linear-gradient(to bottom, #4ade80, #86efac)" }} />
            <span className="text-green-300 text-xs font-bold tracking-widest uppercase">SENSOTECH</span>
            <div className="w-1 h-8 rounded-full" style={{ background: "linear-gradient(to bottom, #86efac, #4ade80)" }} />
          </div>
          <h2
            className="text-3xl font-black text-white mb-2"
            style={{ textShadow: "0 2px 20px rgba(0,0,0,0.8)" }}
          >
            Choose Your Language
          </h2>
          <p className="text-white/60 text-sm">अपनी भाषा चुनें • Choose Your Language</p>
        </div>

        <div
          className="rounded-2xl p-5"
          style={{ background: "rgba(0,15,0,0.6)", border: "1px solid rgba(74, 222, 128, 0.2)", backdropFilter: "blur(20px)" }}
        >
          <div className="grid grid-cols-2 gap-3">
            {languages.map((lang, idx) => (
              <button
                key={lang.code}
                onClick={() => onSelect(lang.code)}
                className="lang-btn rounded-xl py-5 px-4 flex flex-col items-center gap-1 text-center relative overflow-hidden"
                style={{
                  background: lang.functional
                    ? "rgba(74, 222, 128, 0.1)"
                    : "rgba(0, 15, 0, 0.4)",
                }}
              >
                <span
                  className="text-2xl font-bold"
                  style={{ color: lang.functional ? "#4ade80" : "#86efac" }}
                >
                  {lang.native}
                </span>
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

          <p className="text-center text-white/30 text-xs mt-4">
            All languages navigate to next step
          </p>
        </div>
      </div>
    </div>
  );
}
