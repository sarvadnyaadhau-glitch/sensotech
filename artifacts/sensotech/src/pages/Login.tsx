import { useState } from "react";

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
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
      <div className="absolute inset-0 bg-overlay" />

      <div className="relative z-10 flex flex-col items-center px-6 text-center max-w-sm w-full">
        <div className="mb-2 flex items-center justify-center">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: "rgba(74, 222, 128, 0.15)", border: "2px solid rgba(74, 222, 128, 0.5)" }}
          >
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
              <path d="M22 4C12.06 4 4 12.06 4 22s8.06 18 18 18 18-8.06 18-18S31.94 4 22 4z" fill="rgba(74,222,128,0.2)" stroke="#4ade80" strokeWidth="1.5"/>
              <path d="M22 10c-3 0-5.5 1.5-7 4 2 .5 4 2 5.5 4.5C22 15 24 12 26 11c-1.2-.65-2.6-1-4-1z" fill="#4ade80"/>
              <path d="M15 14c-2 1.5-3.5 4-3.5 7.5 0 1 .1 2 .4 2.9 1.5-1 3.5-1.5 5.6-1.5-.5-2.9 0-5.9 1.5-8.4-1.4-.1-2.8.2-4 .5z" fill="#86efac"/>
              <path d="M29 14c-1.2-.3-2.5-.6-3.8-.5 1.5 2.5 2 5.5 1.5 8.4 2.1 0 4.1.5 5.6 1.5.3-.9.4-1.9.4-2.9 0-3.5-1.5-6-3.7-7.5z" fill="#86efac"/>
              <path d="M17.5 24.4c-2 0-3.8.5-5 1.3.8 2.5 2.5 4.6 4.8 5.8.5-2.1 2-4 4-5.1-.7-.7-2.3-1.3-3.8-1.3v.3z" fill="#4ade80"/>
              <path d="M26.5 24.4c-1.5 0-3 .6-4 1.3 2 1.1 3.5 3 4 5.1 2.3-1.2 4-3.3 4.8-5.8-1.2-.8-3-1.3-5-1.3l.2.7z" fill="#4ade80"/>
              <circle cx="22" cy="26" r="3" fill="#22c55e"/>
            </svg>
          </div>
        </div>

        <h1
          className="text-5xl font-black tracking-widest mb-1"
          style={{
            background: "linear-gradient(135deg, #4ade80 0%, #86efac 50%, #fde047 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontFamily: "'Inter', sans-serif",
            letterSpacing: "0.2em",
          }}
        >
          SENSO
        </h1>
        <h1
          className="text-5xl font-black tracking-widest mb-2"
          style={{
            background: "linear-gradient(135deg, #4ade80 0%, #86efac 50%, #fde047 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontFamily: "'Inter', sans-serif",
            letterSpacing: "0.2em",
          }}
        >
          TECH
        </h1>
        <p className="text-green-300 text-sm font-semibold tracking-widest uppercase mb-1">Smart Farming Ecosystem</p>
        <p className="text-white/60 text-xs mb-10">Powered by AI & IoT</p>

        <div
          className="w-full rounded-2xl p-6 mb-6"
          style={{ background: "rgba(0,15,0,0.55)", border: "1px solid rgba(74, 222, 128, 0.2)", backdropFilter: "blur(20px)" }}
        >
          <p className="text-white/70 text-sm mb-4">Sign in to access your smart farm dashboard</p>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-xl font-bold text-gray-800 transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{
              background: "white",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            }}
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
            <span className="text-base">{loading ? "Signing in..." : "Continue with Google"}</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-green-400/60 text-xs">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          <span>Secured with 256-bit SSL encryption</span>
        </div>
      </div>
    </div>
  );
}
