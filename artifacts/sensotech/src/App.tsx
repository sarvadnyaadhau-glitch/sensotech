import { useState, useEffect } from "react";
import Login from "@/pages/Login";
import LanguageSelect from "@/pages/LanguageSelect";
import ProfileSetup from "@/pages/ProfileSetup";
import HomeScreen from "@/pages/HomeScreen";
import FarmDashboard from "@/pages/FarmDashboard";
import AIAdvisor from "@/pages/AIAdvisor";
import { type Language } from "@/lib/translations";

type Step = "login" | "language" | "profile" | "home" | "dashboard" | "ai";
type NavTab = "home" | "chat" | "news";

interface Profile {
  name: string;
  mobile: string;
  address: string;
}

function useNightMode() {
  const [isNight, setIsNight] = useState(() => {
    const h = new Date().getHours();
    return h >= 18 || h < 6;
  });
  useEffect(() => {
    const checkTime = () => {
      const h = new Date().getHours();
      setIsNight(h >= 18 || h < 6);
    };
    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, []);
  return isNight;
}

export default function App() {
  const [step, setStep] = useState<Step>("login");
  const [lang, setLang] = useState<Language>("en");
  const [profile, setProfile] = useState<Profile>({ name: "", mobile: "", address: "Akola, Maharashtra" });
  const [activeFarm, setActiveFarm] = useState<string>("");
  const [activeNav, setActiveNav] = useState<NavTab>("home");
  const isNight = useNightMode();

  useEffect(() => {
    if (isNight) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("night-mode");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("night-mode");
    }
  }, [isNight]);

  if (step === "login") return <Login onLogin={() => setStep("language")} lang={lang} />;
  if (step === "language") return <LanguageSelect onSelect={(l) => { setLang(l); setStep("profile"); }} />;
  if (step === "profile") return <ProfileSetup onComplete={(p) => { setProfile(p); setStep("home"); }} lang={lang} />;

  if (step === "home") {
    return (
      <HomeScreen
        profile={profile}
        onFarmClick={(farmId) => { setActiveFarm(farmId); setStep("dashboard"); }}
        onNav={(tab) => setActiveNav(tab)}
        activeNav={activeNav}
        lang={lang}
      />
    );
  }

  if (step === "dashboard") {
    return (
      <FarmDashboard
        farmId={activeFarm}
        profile={profile}
        onBack={() => setStep("home")}
        onAIAdvisor={() => setStep("ai")}
        lang={lang}
      />
    );
  }

  if (step === "ai") return <AIAdvisor onBack={() => setStep("dashboard")} lang={lang} />;

  return null;
}
