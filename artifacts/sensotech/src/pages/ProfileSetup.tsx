import { useState } from "react";

interface ProfileSetupProps {
  onComplete: (profile: { name: string; mobile: string; address: string }) => void;
}

export default function ProfileSetup({ onComplete }: ProfileSetupProps) {
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
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "rgba(74, 222, 128, 0.15)", border: "2px solid rgba(74, 222, 128, 0.4)" }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <h2 className="text-2xl font-black text-white mb-1">Farmer Profile Setup</h2>
          <p className="text-white/50 text-sm">Complete your profile to get started</p>
        </div>

        <div
          className="rounded-2xl p-6"
          style={{ background: "rgba(0, 12, 0, 0.65)", border: "1px solid rgba(74, 222, 128, 0.25)", backdropFilter: "blur(20px)" }}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="text-green-300 text-xs font-bold uppercase tracking-wider mb-2 block">
                Full Name
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-green-300 text-xs font-bold uppercase tracking-wider mb-2 block">
                Mobile Number
              </label>
              <input
                type="tel"
                className="form-input"
                placeholder="+91 XXXXX XXXXX"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-green-300 text-xs font-bold uppercase tracking-wider mb-2 block">
                Address
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="Akola, Maharashtra"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div>
              <label className="text-green-300 text-xs font-bold uppercase tracking-wider mb-2 block">
                Device Serial Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="form-input"
                  value="001"
                  disabled
                />
                <div
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(74, 222, 128, 0.15)", color: "#4ade80" }}
                >
                  Auto
                </div>
              </div>
              <p className="text-white/30 text-xs mt-1">Serial number is pre-assigned to your device</p>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl text-white font-bold text-lg mt-2 transition-all duration-200 active:scale-95 hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #16a34a, #4ade80)",
                boxShadow: "0 4px 20px rgba(74, 222, 128, 0.3)",
              }}
            >
              Start Smart Farming
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
