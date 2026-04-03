import { useState } from "react";
import { Leaf } from "lucide-react";
import { t, type Language } from "@/lib/translations";

interface ProfileSetupProps {
  onComplete: (profile: { name: string; mobile: string; address: string }) => void;
  lang: Language;
}

export default function ProfileSetup({ onComplete, lang }: ProfileSetupProps) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && mobile.trim()) {
      onComplete({ name: name.trim(), mobile: mobile.trim(), address: address.trim() || "Akola, Maharashtra" });
    }
  };

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center px-4 py-10"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1920&q=80')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0" style={{ background: "rgba(5, 10, 0, 0.68)" }} />

      <div className="relative z-10 w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Leaf size={18} color="#4ade80" />
            <span
              className="text-2xl font-black tracking-widest whitespace-nowrap"
              style={{
                background: "linear-gradient(135deg, #4ade80, #fde047)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "0.18em",
              }}
            >
              SENSOTECH
            </span>
            <Leaf size={18} color="#4ade80" />
          </div>
          <h2 className="text-2xl font-black text-white mb-1">{t(lang, "profileSetup")}</h2>
          <p className="text-white/50 text-sm">{t(lang, "profileSubtitle")}</p>
        </div>

        <div
          className="rounded-2xl p-6"
          style={{ background: "rgba(0, 12, 0, 0.65)", border: "1px solid rgba(74, 222, 128, 0.25)", backdropFilter: "blur(20px)" }}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="text-green-300 text-xs font-bold uppercase tracking-wider mb-2 block">
                {t(lang, "fullName")}
              </label>
              <input type="text" className="form-input" placeholder={t(lang, "namePlaceholder")} value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <label className="text-green-300 text-xs font-bold uppercase tracking-wider mb-2 block">
                {t(lang, "mobileNumber")}
              </label>
              <input type="tel" className="form-input" placeholder={t(lang, "mobilePlaceholder")} value={mobile} onChange={(e) => setMobile(e.target.value)} required />
            </div>
            <div>
              <label className="text-green-300 text-xs font-bold uppercase tracking-wider mb-2 block">
                {t(lang, "address")}
              </label>
              <input type="text" className="form-input" placeholder="Akola, Maharashtra" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
            <div>
              <label className="text-green-300 text-xs font-bold uppercase tracking-wider mb-2 block">
                {t(lang, "serialNumber")}
              </label>
              <div className="relative">
                <input type="text" className="form-input" value="001" disabled />
                <div
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(74, 222, 128, 0.15)", color: "#4ade80" }}
                >
                  {t(lang, "serialAuto")}
                </div>
              </div>
              <p className="text-white/30 text-xs mt-1">{t(lang, "serialNote")}</p>
            </div>
            <button
              type="submit"
              className="w-full py-4 rounded-xl text-white font-bold text-lg mt-2 transition-all duration-200 active:scale-95 hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #16a34a, #4ade80)", boxShadow: "0 4px 20px rgba(74, 222, 128, 0.3)" }}
            >
              {t(lang, "startSmartFarming")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
