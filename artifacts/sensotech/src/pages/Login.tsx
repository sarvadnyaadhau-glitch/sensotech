import { useState } from "react";
import { Leaf } from "lucide-react";
import { t, type Language } from "@/lib/translations";

interface LoginProps {
  onLogin: () => void;
  lang: Language;
}

export default function Login({ onLogin, lang }: LoginProps) {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 1200);
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0" style={{ background: "rgba(0, 10, 0, 0.62)" }} />

      <div className="relative z-10 flex flex-col items-center px-6 text-center max-w-sm w-full">
        {/* Logo */}
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5"
          style={{ background: "rgba(74, 222, 128, 0.15)", border: "2px solid rgba(74, 222, 128, 0.5)" }}
        >
          <Leaf size={40} color="#4ade80" strokeWidth={1.5} />
        </div>

        {/* Brand Name - always one line */}
        <h1
          className="text-5xl font-black tracking-widest mb-1 whitespace-nowrap"
          style={{
            background: "linear-gradient(135deg, #4ade80 0%, #86efac 50%, #fde047 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "0.18em",
          }}
        >
          {t(lang, "appName")}
        </h1>
        <p className="text-green-300 text-sm font-semibold tracking-widest uppercase mb-1">{t(lang, "tagline")}</p>
        <p className="text-white/60 text-xs mb-10">{t(lang, "poweredBy")}</p>

        <div
          className="w-full rounded-2xl p-6 mb-6"
          style={{ background: "rgba(0,15,0,0.55)", border: "1px solid rgba(74, 222, 128, 0.2)", backdropFilter: "blur(20px)" }}
        >
          <p className="text-white/70 text-sm mb-4">{t(lang, "signInDesc")}</p>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-xl font-bold text-gray-800 transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{ background: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}
          >
            {loading ? (
              <div className="w-5 h-5 rounded-full border-2 border-gray-400 border-t-green-600 animate-spin" />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            <span className="text-base">{loading ? t(lang, "signingIn") : t(lang, "continueWithGoogle")}</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-green-400/60 text-xs">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          <span>{t(lang, "securedSSL")}</span>
        </div>
      </div>
    </div>
  );
}
