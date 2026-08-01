import { useEffect, useState } from "react";
import {
  ClerkProvider,
  SignIn,
  SignUp,
  useAuth,
  useClerk,
  useUser,
} from "@clerk/react";
import { publishableKeyFromHost } from "@clerk/react/internal";
import { shadcn } from "@clerk/themes";
import {
  Redirect,
  Route,
  Router as WouterRouter,
  Switch,
  useLocation,
} from "wouter";
import Login from "@/pages/Login";
import LanguageSelect from "@/pages/LanguageSelect";
import ProfileSetup from "@/pages/ProfileSetup";
import HomeScreen from "@/pages/HomeScreen";
import FarmDashboard from "@/pages/FarmDashboard";
import AIAdvisor from "@/pages/AIAdvisor";
import VoiceAI from "@/pages/VoiceAI";
import { type Language } from "@/lib/translations";

type Step = "language" | "profile" | "home" | "dashboard" | "ai" | "voiceai";
type NavTab = "home" | "chat" | "news";

interface Profile {
  name: string;
  mobile: string;
  address: string;
}

const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
const ADMIN_EMAIL = "vanshalmadhau@gmail.com";

if (!clerkPubKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY.");
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: "clerk",
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: "#16a34a",
    colorForeground: "#f0fdf4",
    colorMutedForeground: "#bbf7d0",
    colorDanger: "#fca5a5",
    colorBackground: "#051405",
    colorInput: "#0a200d",
    colorInputForeground: "#f0fdf4",
    colorNeutral: "#166534",
    fontFamily: "Inter, sans-serif",
    borderRadius: "0.75rem",
  },
  elements: {
    cardBox:
      "bg-[#051405] border border-green-900/60 rounded-2xl w-[440px] max-w-full overflow-hidden",
    card: "!shadow-none !border-0 !bg-transparent",
    footer: "!shadow-none !border-0 !bg-transparent",
    headerTitle: "text-green-50",
    headerSubtitle: "text-green-200/70",
    socialButtonsBlockButtonText: "text-green-50",
    formFieldLabel: "text-green-100",
    footerActionLink: "text-green-300 hover:text-green-200",
    footerActionText: "text-green-200/70",
    dividerText: "text-green-200/60",
    formButtonPrimary: "bg-green-700 hover:bg-green-600",
    formFieldInput: "bg-green-950/60 border-green-800 text-green-50",
    socialButtonsBlockButton: "border-green-800 bg-green-950/40 hover:bg-green-900/50",
    formFieldSuccessText: "text-green-300",
    alertText: "text-red-200",
  },
};

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

function AuthLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#051405] text-green-200">
      <div className="h-8 w-8 rounded-full border-2 border-green-900 border-t-green-400 animate-spin" />
    </div>
  );
}

function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020a02] px-4 py-8">
      <SignIn
        routing="path"
        path={`${basePath}/sign-in`}
        signUpUrl={`${basePath}/sign-up`}
        fallbackRedirectUrl={basePath || "/"}
        appearance={clerkAppearance}
      />
    </div>
  );
}

function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020a02] px-4 py-8">
      <SignUp
        routing="path"
        path={`${basePath}/sign-up`}
        signInUrl={`${basePath}/sign-in`}
        fallbackRedirectUrl={basePath || "/"}
        appearance={clerkAppearance}
      />
    </div>
  );
}

function PublicHome() {
  const [, setLocation] = useLocation();

  return (
    <Login
      lang="en"
      onOpenSignIn={() => setLocation("/sign-in")}
      onOpenSignUp={() => setLocation("/sign-up")}
    />
  );
}

function AuthenticatedApp() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [step, setStep] = useState<Step>("language");
  const [lang, setLang] = useState<Language>("en");
  const [profile, setProfile] = useState<Profile>(() => ({
    name:
      user?.fullName ??
      user?.firstName ??
      user?.primaryEmailAddress?.emailAddress ??
      "",
    mobile: "",
    address: "Akola, Maharashtra",
  }));
  const [activeFarm, setActiveFarm] = useState<string>("");
  const [activeNav, setActiveNav] = useState<NavTab>("home");
  const isNight = useNightMode();
  const isAdmin =
    user?.primaryEmailAddress?.emailAddress.toLowerCase() === ADMIN_EMAIL;

  useEffect(() => {
    if (isNight) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("night-mode");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("night-mode");
    }
  }, [isNight]);

  const handleLogout = () => {
    void signOut({ redirectUrl: basePath || "/" });
  };

  if (step === "language") {
    return (
      <LanguageSelect
        onSelect={(selectedLanguage) => {
          setLang(selectedLanguage);
          setStep("profile");
        }}
      />
    );
  }

  if (step === "profile") {
    return (
      <ProfileSetup
        onComplete={(nextProfile) => {
          setProfile(nextProfile);
          setStep("home");
        }}
        lang={lang}
      />
    );
  }

  if (step === "home") {
    return (
      <HomeScreen
        profile={profile}
        onFarmClick={(farmId) => {
          setActiveFarm(farmId);
          setStep("dashboard");
        }}
        onNav={(tab) => setActiveNav(tab)}
        activeNav={activeNav}
        lang={lang}
        onLogout={handleLogout}
        isAdmin={isAdmin}
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
        onVoiceAI={() => setStep("voiceai")}
        lang={lang}
      />
    );
  }

  if (step === "ai") {
    return <AIAdvisor onBack={() => setStep("dashboard")} lang={lang} />;
  }

  return <VoiceAI onBack={() => setStep("dashboard")} />;
}

function HomeRoute() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return <AuthLoading />;
  return isSignedIn ? <AuthenticatedApp /> : <PublicHome />;
}

function ClerkRoutes() {
  return (
    <Switch>
      <Route path="/sign-in/*?" component={SignInPage} />
      <Route path="/sign-up/*?" component={SignUpPage} />
      <Route path="/" component={HomeRoute} />
      <Route>
        <Redirect to="/" />
      </Route>
    </Switch>
  );
}

function useNightMode() {
  const [isNight, setIsNight] = useState(() => {
    const hour = new Date().getHours();
    return hour >= 18 || hour < 6;
  });

  useEffect(() => {
    const checkTime = () => {
      const hour = new Date().getHours();
      setIsNight(hour >= 18 || hour < 6);
    };
    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return isNight;
}

export default function App() {
  return (
    <WouterRouter base={basePath}>
      <ClerkProvider
        publishableKey={clerkPubKey}
        proxyUrl={clerkProxyUrl}
        appearance={clerkAppearance}
        signInUrl={`${basePath}/sign-in`}
        signUpUrl={`${basePath}/sign-up`}
        routerPush={(to) => {
          window.history.pushState({}, "", to);
          window.dispatchEvent(new PopStateEvent("popstate"));
        }}
        routerReplace={(to) => {
          window.history.replaceState({}, "", to);
          window.dispatchEvent(new PopStateEvent("popstate"));
        }}
      >
        <ClerkRoutes />
      </ClerkProvider>
    </WouterRouter>
  );
}