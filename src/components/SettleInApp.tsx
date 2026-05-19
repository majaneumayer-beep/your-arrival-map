import { useState, useEffect, useCallback, useMemo } from "react";
import { toast, Toaster } from "sonner";
import { PlaneLanding, MapPin, ArrowRight, ArrowLeft, Check, Lock, Search, Map as MapIcon, Home, MessageCircle, User, Calendar, Sparkles, Info, AlertTriangle, ShieldCheck, Send, Flag, Briefcase, FileText, KeyRound, Stethoscope, TrendingUp, CheckCircle2, Clock, Globe2, Settings, RotateCcw } from "lucide-react";
import {
  NATIONALITIES, CITIES, type Nationality, type City, type Profile, type Purpose, type Housing, type StayLength,
  buildRoadmap, daysUntil, countdownTone, formatDate, arrivalMinusDays, gemeenteWait,
  PERSONA_MAJA, PERSONA_VALENTINA, DEMO_CHAT_MAJA, DEMO_CHAT_VALENTINA,
} from "@/lib/settlein/data";
import MapTab from "@/components/MapTab";
import HousingTabEnhanced from "@/components/HousingTabEnhanced";
import PulseCard from "@/components/PulseCard";
import CostCalculator from "@/components/CostCalculator";

type AppTab = "roadmap" | "map" | "housing" | "ask" | "profile" | "about";

type Screen =
  | { kind: "welcome" }
  | { kind: "onboarding"; step: number }
  | { kind: "loading" }
  | { kind: "app"; tab: AppTab };

type Draft = {
  nationality?: Nationality;
  city?: string;
  stay?: StayLength;
  arrivalISO?: string;
  purpose?: Purpose;
  housing?: Housing;
  name?: string;
};

const STORAGE_KEY = "settlein.v1";

type Persisted = {
  profile: Profile;
  doneIds: number[];
};

function loadPersisted(): Persisted | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Persisted;
  } catch { return null; }
}
function savePersisted(p: Persisted) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch {}
}
function clearPersisted() {
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
}

export default function SettleInApp() {
  const [screen, setScreen] = useState<Screen>({ kind: "welcome" });
  const [draft, setDraft] = useState<Draft>({});
  const [profile, setProfile] = useState<Profile | null>(null);
  const [doneIds, setDoneIds] = useState<Set<number>>(new Set());
  const [confetti, setConfetti] = useState<{ x: number; y: number; key: number } | null>(null);

  // hydrate
  useEffect(() => {
    const p = loadPersisted();
    if (p) {
      setProfile(p.profile);
      setDoneIds(new Set(p.doneIds));
      setScreen({ kind: "app", tab: "roadmap" });
    }
  }, []);

  useEffect(() => {
    if (profile) savePersisted({ profile, doneIds: Array.from(doneIds) });
  }, [profile, doneIds]);

  const roadmap = useMemo(() => (profile ? buildRoadmap(profile) : null), [profile]);

  const toggleTask = useCallback((id: number, e?: React.MouseEvent) => {
    setDoneIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); return next; }
      next.add(id);
      if (e) setConfetti({ x: e.clientX, y: e.clientY, key: Date.now() });
      const total = roadmap?.tasks.length ?? 0;
      const remaining = total - next.size;
      toast.success(`✓ Done! ${remaining} step${remaining === 1 ? "" : "s"} remaining`);
      return next;
    });
  }, [roadmap]);

  const loadPersona = (which: "maja" | "valentina") => {
    const p = which === "maja" ? PERSONA_MAJA : PERSONA_VALENTINA;
    setProfile(p);
    setDoneIds(new Set(which === "maja" ? [1] : []));
    setScreen({ kind: "app", tab: "roadmap" });
  };

  const resetAll = () => {
    clearPersisted();
    setProfile(null);
    setDoneIds(new Set());
    setDraft({});
    setScreen({ kind: "welcome" });
  };

  // --- render ---
  return (
    <div className="min-h-screen w-full bg-white text-[color:var(--navy)]">
      <Toaster position="top-center" toastOptions={{ style: { background: "var(--navy)", color: "white", border: "none" } }} />
      <div className="mx-auto max-w-[480px] min-h-screen flex flex-col relative overflow-hidden">
        {screen.kind === "welcome" && (
          <WelcomeScreen
            onStart={() => setScreen({ kind: "onboarding", step: 2 })}
            onMaja={() => loadPersona("maja")}
            onValentina={() => loadPersona("valentina")}
          />
        )}
        {screen.kind === "onboarding" && (
          <Onboarding
            step={screen.step}
            draft={draft}
            setDraft={setDraft}
            onBack={() => {
              const prev = prevStep(screen.step, draft);
              if (prev === 1) setScreen({ kind: "welcome" });
              else setScreen({ kind: "onboarding", step: prev });
            }}
            onNext={() => {
              const next = nextStep(screen.step, draft);
              if (next > 9) {
                // finalize
                const p: Profile = {
                  name: draft.name || "You",
                  nationality: draft.nationality!,
                  city: draft.city!,
                  stay: draft.stay,
                  arrivalISO: draft.arrivalISO!,
                  purpose: draft.purpose!,
                  housing: draft.housing!,
                };
                setProfile(p);
                setDoneIds(new Set());
                setScreen({ kind: "loading" });
                setTimeout(() => setScreen({ kind: "app", tab: "roadmap" }), 3000);
              } else {
                setScreen({ kind: "onboarding", step: next });
              }
            }}
          />
        )}
        {screen.kind === "loading" && <LoadingScreen />}
        {screen.kind === "app" && roadmap && profile && (
          <AppShell
            tab={screen.tab}
            setTab={(t) => setScreen({ kind: "app", tab: t })}
            profile={profile}
            roadmap={roadmap}
            doneIds={doneIds}
            toggleTask={toggleTask}
            onResetPersona={resetAll}
            onSwitchPersona={loadPersona}
          />
        )}

        {confetti && <Confetti key={confetti.key} x={confetti.x} y={confetti.y} onDone={() => setConfetti(null)} />}
      </div>
    </div>
  );
}

function prevStep(step: number, draft: Draft): number {
  if (step === 6) {
    // came from 5 (stay) only if non-EU; else from 4
    if (draft.nationality && draft.nationality.group === 1) return 4;
    return 5;
  }
  return step - 1;
}
function nextStep(step: number, draft: Draft): number {
  if (step === 4) {
    if (draft.nationality && draft.nationality.group === 1) return 6;
    return 5;
  }
  return step + 1;
}

// ---------------- Welcome ----------------
function WelcomeScreen({ onStart, onMaja, onValentina }: { onStart: () => void; onMaja: () => void; onValentina: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 anim-fade-up"
      style={{ background: "linear-gradient(180deg, #F0FDFA 0%, #FFFFFF 60%)" }}>

      {/* Big logo */}
      <div className="w-24 h-24 rounded-[28px] flex items-center justify-center mb-5 anim-pop shadow-lg"
        style={{ background: "linear-gradient(135deg, #0D9488 0%, #0F766E 100%)" }}>
        <PlaneLanding size={44} color="white" strokeWidth={2} />
      </div>

      <h1 className="text-[28px] font-semibold tracking-tight" style={{ color: "var(--navy)" }}>SettleIn</h1>
      <p className="text-[15px] mt-1" style={{ color: "#64748B" }}>New country. Zero stress.</p>

      <button
        onClick={onStart}
        className="w-full max-w-[320px] h-13 rounded-xl text-white text-[15px] font-semibold transition active:scale-[0.98] shadow-md mt-10"
        style={{ background: "var(--teal)", height: "52px" }}
      >Get started →</button>
      <p className="text-[11px] mt-2.5" style={{ color: "#94A3B8" }}>Your personal roadmap in 5 minutes</p>

      <div className="mt-10 w-full max-w-[320px] flex flex-col gap-2">
        <p className="text-[10px] uppercase tracking-wider text-center" style={{ color: "#94A3B8" }}>Demo personas</p>
        <button onClick={onMaja} className="text-[12px] py-2.5 rounded-xl border font-medium" style={{ borderColor: "#E2E8F0", color: "#64748B" }}>Try as Maja 🇭🇺 (EU · 89 days)</button>
        <button onClick={onValentina} className="text-[12px] py-2.5 rounded-xl border font-medium" style={{ borderColor: "#E2E8F0", color: "#64748B" }}>Try as Valentina 🇧🇷 (non-EU · 28 days)</button>
      </div>
    </div>
  );
}

// ---------------- Onboarding ----------------
function Onboarding({ step, draft, setDraft, onBack, onNext }: { step: number; draft: Draft; setDraft: (d: Draft) => void; onBack: () => void; onNext: () => void; }) {
  // determine total steps (skip stay for EU)
  const isEU = draft.nationality?.group === 1;
  const totalSteps = isEU ? 8 : 9;
  // logical position
  let pos = step;
  if (isEU && step >= 6) pos = step - 1;

  const canNext = canProceed(step, draft);

  return (
    <div className="flex-1 flex flex-col px-5 py-6 anim-slide-in" key={step}>
      <div className="w-full h-1 rounded-full bg-[#E2E8F0] overflow-hidden">
        <div className="h-full transition-all duration-500" style={{ width: `${(pos / totalSteps) * 100}%`, background: "var(--teal)" }} />
      </div>
      <p className="text-[11px] mt-2" style={{ color: "#94A3B8" }}>{pos} of {totalSteps}</p>

      <div className="flex-1 mt-4">
        {step === 2 && <StepNationality draft={draft} setDraft={setDraft} />}
        {step === 3 && <StepCountry />}
        {step === 4 && <StepCity draft={draft} setDraft={setDraft} />}
        {step === 5 && <StepStay draft={draft} setDraft={setDraft} />}
        {step === 6 && <StepArrival draft={draft} setDraft={setDraft} />}
        {step === 7 && <StepPurpose draft={draft} setDraft={setDraft} />}
        {step === 8 && <StepHousing draft={draft} setDraft={setDraft} />}
        {step === 9 && <StepName draft={draft} setDraft={setDraft} />}
      </div>

      <div className="pt-4">
        <button
          onClick={onNext}
          disabled={!canNext}
          className="w-full h-12 rounded-lg text-white text-[14px] font-medium transition disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] flex items-center justify-center gap-1.5"
          style={{ background: "var(--teal)" }}
        >
          {step === 8 ? "Build my roadmap" : "Next"}
          <ArrowRight size={16} />
        </button>
        <button onClick={onBack} className="w-full mt-3 text-[12px]" style={{ color: "#64748B" }}>
          <ArrowLeft size={12} className="inline mr-1" />Back
        </button>
      </div>
    </div>
  );
}

function canProceed(step: number, d: Draft): boolean {
  switch (step) {
    case 2: return !!d.nationality;
    case 3: return true;
    case 4: return !!d.city;
    case 5: return !!d.stay;
    case 6: return !!d.arrivalISO;
    case 7: return !!d.purpose;
    case 8: return !!d.housing;
    case 9: return !!d.name && d.name.trim().length > 0;
    default: return false;
  }
}

function QuestionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-[20px] font-medium leading-snug mb-4" style={{ color: "var(--navy)" }}>{children}</h2>;
}

function OptionCard({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-4 py-3 rounded-xl transition"
      style={{
        border: selected ? "1.5px solid var(--teal)" : "0.5px solid #E2E8F0",
        background: selected ? "var(--teal-soft)" : "white",
      }}
    >{children}</button>
  );
}

function StepNationality({ draft, setDraft }: { draft: Draft; setDraft: (d: Draft) => void }) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => NATIONALITIES.filter(n => n.adjective.toLowerCase().includes(q.toLowerCase())), [q]);
  const sel = draft.nationality;
  const banner = sel ? bannerFor(sel) : null;
  return (
    <div className="flex flex-col h-full">
      <QuestionTitle>What is your nationality?</QuestionTitle>
      <div className="relative mb-3">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" color="#94A3B8" />
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search nationality…"
          className="w-full h-10 pl-9 pr-3 rounded-lg text-[14px] outline-none"
          style={{ border: "0.5px solid #E2E8F0" }}
        />
      </div>
      <div className="flex-1 overflow-y-auto max-h-[42vh] space-y-1.5 pr-1">
        {filtered.map(n => (
          <OptionCard key={n.adjective} selected={sel?.adjective === n.adjective} onClick={() => setDraft({ ...draft, nationality: n })}>
            <span className="text-[14px]"><span className="mr-2">{n.flag}</span>{n.adjective}</span>
          </OptionCard>
        ))}
      </div>
      {banner && (
        <div className="mt-3 px-3 py-2.5 rounded-lg text-[12px] anim-fade-up" style={{ background: banner.bg, color: banner.fg, border: `0.5px solid ${banner.border}` }}>
          {banner.text}
        </div>
      )}
    </div>
  );
}

function bannerFor(n: Nationality) {
  if (n.group === 1) return { bg: "#DCFCE7", fg: "#14532D", border: "#86EFAC", text: "✓ EU citizen — no visa or work permit needed. Free movement applies." };
  if (n.adjective === "Turkish") return { bg: "#FEF3C7", fg: "#78350F", border: "#FCD34D", text: "🤝 Ankara Agreement — up to 3yr permit, progressive work rights." };
  if (n.adjective === "British") return { bg: "#FEF3C7", fg: "#78350F", border: "#FCD34D", text: "🤝 Post-Brexit agreement — work permit required for employment." };
  return { bg: "#FEE2E2", fg: "#7F1D1D", border: "#FCA5A5", text: "🔒 Non-EU — full permit process included in your roadmap." };
}

function StepCountry() {
  return (
    <div>
      <QuestionTitle>Which country are you moving to?</QuestionTitle>
      <div className="space-y-2">
        <div className="px-4 py-3 rounded-xl text-[14px]" style={{ border: "1.5px solid var(--teal)", background: "var(--teal-soft)" }}>
          🇳🇱 Netherlands <span className="text-[11px] ml-2" style={{ color: "var(--teal)" }}>· available now</span>
        </div>
        <div className="px-4 py-3 rounded-xl text-[14px] opacity-50" style={{ border: "0.5px solid #E2E8F0" }}>
          🇩🇪 Germany <span className="text-[11px] ml-2 text-[#94A3B8]">· Coming Q3 2026</span>
        </div>
        <div className="px-4 py-3 rounded-xl text-[14px] opacity-50" style={{ border: "0.5px solid #E2E8F0" }}>
          🇧🇪 Belgium <span className="text-[11px] ml-2 text-[#94A3B8]">· Coming Q4 2026</span>
        </div>
      </div>
    </div>
  );
}

function StepCity({ draft, setDraft }: { draft: Draft; setDraft: (d: Draft) => void }) {
  return (
    <div className="flex flex-col h-full">
      <QuestionTitle>Which city in the Netherlands?</QuestionTitle>
      <div className="flex-1 overflow-y-auto max-h-[60vh] space-y-1.5 pr-1">
        {CITIES.map(c => (
          <OptionCard key={c.name} selected={draft.city === c.name} onClick={() => setDraft({ ...draft, city: c.name })}>
            <div className="text-[14px]">{c.name}</div>
            {c.waitWeeks && <div className="text-[11px] mt-0.5" style={{ color: "#64748B" }}>{c.waitWeeks}</div>}
          </OptionCard>
        ))}
      </div>
    </div>
  );
}

function StepStay({ draft, setDraft }: { draft: Draft; setDraft: (d: Draft) => void }) {
  const opts: StayLength[] = ["≤90 days", "3–6 months", "6–12 months", ">1 year"];
  return (
    <div>
      <QuestionTitle>How long are you staying?</QuestionTitle>
      <div className="space-y-2">
        {opts.map(o => (
          <OptionCard key={o} selected={draft.stay === o} onClick={() => setDraft({ ...draft, stay: o })}>
            <span className="text-[14px]">{o === "≤90 days" ? "Up to 90 days" : o === ">1 year" ? "More than 1 year" : o.replace("–", " to ")}</span>
          </OptionCard>
        ))}
      </div>
    </div>
  );
}

function StepArrival({ draft, setDraft }: { draft: Draft; setDraft: (d: Draft) => void }) {
  const today = new Date().toISOString().slice(0, 10);
  const days = draft.arrivalISO ? daysUntil(draft.arrivalISO) : null;
  const tone = days != null ? countdownTone(days) : null;
  const toneStyle = tone === "teal" ? { bg: "var(--teal-soft)", fg: "#115E59", text: `${days} days — you've got time` }
    : tone === "amber" ? { bg: "#FFEDD5", fg: "#9A3412", text: `${days} days — start soon` }
    : tone === "red" ? { bg: "#FEE2E2", fg: "#991B1B", text: `${days} days — act now!` }
    : null;
  return (
    <div>
      <QuestionTitle>When do you arrive?</QuestionTitle>
      <div className="relative">
        <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" color="#64748B" />
        <input
          type="date"
          min={today}
          value={draft.arrivalISO ?? ""}
          onChange={e => setDraft({ ...draft, arrivalISO: e.target.value })}
          className="w-full h-12 pl-9 pr-3 rounded-lg text-[14px] outline-none"
          style={{ border: "0.5px solid #E2E8F0" }}
        />
      </div>
      {toneStyle && (
        <div className="mt-3 inline-flex px-3 py-1.5 rounded-full text-[12px] font-medium anim-fade-up" style={{ background: toneStyle.bg, color: toneStyle.fg }}>
          {toneStyle.text}
        </div>
      )}
    </div>
  );
}

function StepPurpose({ draft, setDraft }: { draft: Draft; setDraft: (d: Draft) => void }) {
  const opts: Purpose[] = ["Full degree student", "Exchange semester", "Internship or traineeship", "Starting a job"];
  return (
    <div>
      <QuestionTitle>What brings you there?</QuestionTitle>
      <div className="space-y-2">
        {opts.map(o => (
          <OptionCard key={o} selected={draft.purpose === o} onClick={() => setDraft({ ...draft, purpose: o })}>
            <span className="text-[14px]">{o}</span>
          </OptionCard>
        ))}
      </div>
    </div>
  );
}

function StepHousing({ draft, setDraft }: { draft: Draft; setDraft: (d: Draft) => void }) {
  const opts: { v: Housing; label: string }[] = [
    { v: "sorted", label: "✅ Yes, all sorted" },
    { v: "looking", label: "🔍 No, still looking" },
    { v: "university", label: "🏫 University arranges it" },
  ];
  return (
    <div>
      <QuestionTitle>Do you have housing arranged?</QuestionTitle>
      <div className="space-y-2">
        {opts.map(o => (
          <OptionCard key={o.v} selected={draft.housing === o.v} onClick={() => setDraft({ ...draft, housing: o.v })}>
            <span className="text-[14px]">{o.label}</span>
          </OptionCard>
        ))}
      </div>
    </div>
  );
}

function StepName({ draft, setDraft }: { draft: Draft; setDraft: (d: Draft) => void }) {
  return (
    <div>
      <QuestionTitle>One last thing — what's your first name?</QuestionTitle>
      <input
        autoFocus
        value={draft.name ?? ""}
        onChange={e => setDraft({ ...draft, name: e.target.value })}
        placeholder="e.g. Alex"
        className="w-full h-12 px-3 rounded-lg text-[14px] outline-none"
        style={{ border: "0.5px solid #E2E8F0" }}
      />
      <p className="text-[11px] mt-2" style={{ color: "#94A3B8" }}>So your roadmap feels like yours.</p>
    </div>
  );
}

// ---------------- Loading ----------------
function LoadingScreen() {
  const lines = [
    "Detecting your nationality group",
    "Calculating your deadlines",
    "Adding permit and visa steps",
    "Personalising your journey",
  ];
  const [shown, setShown] = useState(0);
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const ticks = [400, 1100, 1800, 2500];
    const timers = ticks.map((t, i) => setTimeout(() => setShown(i + 1), t));
    let p = 0;
    const interval = setInterval(() => { p += 4; setPct(Math.min(p, 100)); }, 100);
    return () => { timers.forEach(clearTimeout); clearInterval(interval); };
  }, []);
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8" style={{ background: "var(--teal)" }}>
      <div className="w-16 h-16 rounded-full bg-white/15 flex items-center justify-center anim-pop">
        <MapIcon size={26} color="white" />
      </div>
      <h2 className="text-white text-[18px] font-medium mt-5">Building your roadmap…</h2>
      <div className="mt-6 space-y-2 self-stretch max-w-[320px] mx-auto">
        {lines.map((l, i) => (
          <div key={l} className="flex items-center gap-2 text-white text-[13px] transition-opacity duration-300" style={{ opacity: i < shown ? 1 : 0.3 }}>
            <span className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: i < shown ? "white" : "rgba(255,255,255,0.2)" }}>
              {i < shown && <Check size={12} color="var(--teal)" strokeWidth={3} />}
            </span>
            {l}
          </div>
        ))}
      </div>
      <div className="w-full max-w-[320px] mt-8 h-1 rounded-full bg-white/20 overflow-hidden">
        <div className="h-full bg-white transition-all duration-200" style={{ width: `${pct}%` }} />
      </div>
      <p className="absolute bottom-6 text-white/45 text-[11px]">Move smart. Settle faster.</p>
    </div>
  );
}

// ---------------- App shell with tabs ----------------
function AppShell({ tab, setTab, profile, roadmap, doneIds, toggleTask, onResetPersona, onSwitchPersona }: {
  tab: AppTab;
  setTab: (t: AppTab) => void;
  profile: Profile;
  roadmap: ReturnType<typeof buildRoadmap>;
  doneIds: Set<number>;
  toggleTask: (id: number, e?: React.MouseEvent) => void;
  onResetPersona: () => void;
  onSwitchPersona: (which: "maja" | "valentina") => void;
}) {
  return (
    <>
      <div className="flex-1 overflow-y-auto pb-20 anim-fade-up" key={tab}>
        {tab === "roadmap" && <RoadmapTab profile={profile} roadmap={roadmap} doneIds={doneIds} toggleTask={toggleTask} />}
        {tab === "map" && <MapTab profile={profile} />}
        {tab === "housing" && <HousingTabEnhanced profile={profile} />}
        {tab === "ask" && <AskTab profile={profile} />}
        {tab === "profile" && <ProfileTab profile={profile} roadmap={roadmap} doneIds={doneIds} onAbout={() => setTab("about")} onReset={onResetPersona} onSwitchPersona={onSwitchPersona} />}
        {tab === "about" && <AboutScreen onBack={() => setTab("profile")} />}
      </div>
      {tab !== "about" && <BottomNav tab={tab} setTab={setTab} />}
    </>
  );
}

function NameChip({ profile }: { profile: Profile }) {
  const isEU = profile.nationality.group === 1;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium"
      style={{
        background: isEU ? "var(--teal-soft)" : "#FEF3C7",
        color: isEU ? "#115E59" : "var(--amber-deep)",
      }}
    >{profile.name} {profile.nationality.flag}</span>
  );
}

function TopBar({ title, profile }: { title: string; profile: Profile }) {
  return (
    <div className="px-5 pt-5 pb-3 flex items-center justify-between">
      <h1 className="text-[18px] font-medium" style={{ color: "var(--navy)" }}>{title}</h1>
      <NameChip profile={profile} />
    </div>
  );
}

// ---------------- Roadmap tab ----------------
function RoadmapTab({ profile, roadmap, doneIds, toggleTask }: {
  profile: Profile;
  roadmap: ReturnType<typeof buildRoadmap>;
  doneIds: Set<number>;
  toggleTask: (id: number, e?: React.MouseEvent) => void;
}) {
  const isEU = profile.nationality.group === 1;
  const days = daysUntil(profile.arrivalISO);
  const tone = countdownTone(days);
  const total = roadmap.tasks.length;
  const done = roadmap.tasks.filter(t => doneIds.has(t.id)).length;
  const pct = Math.round((done / total) * 100);

  const phases = useMemo(() => {
    const map: Record<string, typeof roadmap.tasks> = {};
    roadmap.tasks.forEach(t => { (map[t.phase] ||= []).push(t); });
    return Object.entries(map);
  }, [roadmap]);

  const toneChip = tone === "teal" ? { bg: "var(--teal-soft)", fg: "#115E59", text: `${days} days — you've got time` }
    : tone === "amber" ? { bg: "#FFEDD5", fg: "#9A3412", text: `${days} days — start soon` }
    : { bg: "#FEE2E2", fg: "#991B1B", text: `${days} days — act now!` };

  return (
    <>
      <TopBar title="Your Roadmap" profile={profile} />

      <div className="px-5 pb-4">
        <p className="text-[12px]" style={{ color: "#64748B" }}>
          {profile.city} · {profile.purpose} · arriving {formatDate(profile.arrivalISO)}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-medium" style={{ background: toneChip.bg, color: toneChip.fg }}>{toneChip.text}</span>
          <span className="px-2 py-1 rounded-full text-[11px] font-medium" style={{ background: isEU ? "#DCFCE7" : "#FEE2E2", color: isEU ? "#14532D" : "#7F1D1D" }}>
            {isEU ? "EU ✓" : "Non-EU 🔒"}
          </span>
        </div>

        <div className="mt-4">
          <PulseCard profile={profile} roadmap={roadmap} doneIds={doneIds} />
        </div>


        <div className="mt-4 p-4 rounded-xl" style={{ background: "var(--surface)", border: "0.5px solid #E2E8F0" }}>
          <div className="flex justify-between text-[12px]" style={{ color: "var(--navy)" }}>
            <span className="font-medium">{pct}% Settled</span>
            <span style={{ color: "#64748B" }}>{done} of {total} done</span>
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-[#E2E8F0] overflow-hidden">
            <div className="h-full transition-all duration-500" style={{ width: `${pct}%`, background: "var(--teal)" }} />
          </div>
        </div>
      </div>

      <div className="px-5 space-y-5">
        {phases.map(([phase, tasks]) => (
          <div key={phase}>
            <PhaseHeader title={phase} tone={tasks[0].phaseTone} />
            <div className="space-y-2 mt-2">
              {tasks.map(t => (
                <TaskCard
                  key={t.id}
                  task={t}
                  done={doneIds.has(t.id)}
                  locked={!!t.deps && t.deps.some(d => !doneIds.has(d))}
                  blockedBy={t.deps?.filter(d => !doneIds.has(d)).map(id => roadmap.tasks.find(x => x.id === id)?.title).filter(Boolean) as string[] | undefined}
                  onToggle={(e) => toggleTask(t.id, e)}
                />
              ))}
            </div>
          </div>
        ))}

        <div className="p-3 rounded-xl text-[12px]" style={{
          background: roadmap.noticeTone === "green" ? "#DCFCE7" : "#FEE2E2",
          color: roadmap.noticeTone === "green" ? "#14532D" : "#7F1D1D",
          border: `0.5px solid ${roadmap.noticeTone === "green" ? "#86EFAC" : "#FCA5A5"}`,
        }}>
          <Info size={13} className="inline mr-1.5 -mt-0.5" />{roadmap.notice}
        </div>

        <CostCalculator profile={profile} />

        <div className="p-4 rounded-xl text-white" style={{ background: "var(--teal)" }}>

          <h3 className="text-[14px] font-medium">🎉 Events near you in {profile.city}</h3>
          <div className="mt-3 space-y-2">
            <div className="p-2.5 rounded-lg bg-white/10 text-[12px]">
              <div className="font-medium">International Welcome Night</div>
              <div className="text-white/75 text-[11px] mt-0.5">Free drinks · meet other internationals · Fri 19:00</div>
            </div>
            <div className="p-2.5 rounded-lg bg-white/10 text-[12px]">
              <div className="font-medium">Erasmus Student Network mixer</div>
              <div className="text-white/75 text-[11px] mt-0.5">Local pub · weekly Wednesdays · everyone welcome</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function PhaseHeader({ title, tone }: { title: string; tone: "amber" | "red" | "yellow" | "green" }) {
  const dot = tone === "red" ? "🔴" : tone === "amber" ? "🟠" : tone === "yellow" ? "🟡" : "🟢";
  return <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider" style={{ color: "#64748B" }}>
    <span>{dot}</span><span className="font-medium">{title}</span>
  </div>;
}

const DOCS_STORAGE_KEY = "settlein.docs.v1";
type DocsState = Record<string, Record<string, boolean>>;
function loadDocsState(): DocsState {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(DOCS_STORAGE_KEY) || "{}"); } catch { return {}; }
}
function saveDocsState(s: DocsState) {
  try { localStorage.setItem(DOCS_STORAGE_KEY, JSON.stringify(s)); } catch {}
}

function printDocChecklist(task: { id: number; title: string; docs?: { id: string; label: string; critical?: boolean }[] }, checked: Record<string, boolean>) {
  if (!task.docs || typeof window === "undefined") return;
  const w = window.open("", "_blank", "width=600,height=800");
  if (!w) return;
  const rows = task.docs.map(d => `
    <li style="display:flex;gap:10px;align-items:flex-start;padding:8px 0;border-bottom:0.5px solid #E2E8F0;">
      <span style="display:inline-block;width:14px;height:14px;border:1.5px solid #94A3B8;border-radius:3px;flex-shrink:0;margin-top:2px;">${checked[d.id] ? "✓" : ""}</span>
      <span style="flex:1;font-size:13px;color:#0F172A;">
        ${d.label}${d.critical ? ' <span style="color:#DC2626;font-size:11px;font-weight:600;">• required</span>' : ""}
      </span>
    </li>`).join("");
  w.document.write(`<!doctype html><html><head><title>${task.title} — documents</title>
    <style>body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;padding:32px;max-width:540px;margin:0 auto;color:#0F172A;}
    h1{font-size:18px;margin:0 0 4px;}p{font-size:12px;color:#64748B;margin:0 0 18px;}ul{list-style:none;padding:0;margin:0;}
    @media print{body{padding:16px;}}</style></head><body>
    <h1>${task.title}</h1><p>Bring these documents — SettleIn checklist</p><ul>${rows}</ul>
    <script>window.onload=()=>{window.print();}</script></body></html>`);
  w.document.close();
}

function TaskCard({ task, done, locked, blockedBy, onToggle }: {
  task: ReturnType<typeof buildRoadmap>["tasks"][number];
  done: boolean;
  locked: boolean;
  blockedBy?: string[];
  onToggle: (e: React.MouseEvent) => void;
}) {
  const tagColor = task.tagTone === "red" ? { bg: "#FEE2E2", fg: "#991B1B" }
    : task.tagTone === "amber" ? { bg: "#FFEDD5", fg: "#9A3412" }
    : task.tagTone === "green" ? { bg: "#DCFCE7", fg: "#14532D" }
    : task.tagTone === "grey" ? { bg: "#F1F5F9", fg: "#475569" }
    : { bg: "var(--teal-soft)", fg: "#115E59" };

  const [expanded, setExpanded] = useState(false);
  const [docsState, setDocsState] = useState<DocsState>(() => loadDocsState());
  const taskDocs = docsState[String(task.id)] || {};
  const docCount = task.docs?.length ?? 0;
  const readyCount = task.docs?.filter(d => taskDocs[d.id]).length ?? 0;

  const toggleDoc = (docId: string) => {
    const next: DocsState = {
      ...docsState,
      [String(task.id)]: { ...taskDocs, [docId]: !taskDocs[docId] },
    };
    setDocsState(next);
    saveDocsState(next);
  };

  return (
    <div className="p-3.5 rounded-xl flex gap-3" style={{
      border: "0.5px solid #E2E8F0",
      background: done ? "#F8FAFC" : "white",
      opacity: locked ? 0.65 : 1,
    }}>
      <button
        onClick={locked ? undefined : onToggle}
        className="w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center mt-0.5 transition"
        style={{
          background: done ? "var(--teal)" : "white",
          border: done ? "1.5px solid var(--teal)" : "1.5px solid #CBD5E1",
          cursor: locked ? "not-allowed" : "pointer",
        }}
        aria-label={done ? "Mark undone" : "Mark done"}
      >
        {locked ? <Lock size={11} color="#94A3B8" /> : done ? <Check size={13} color="white" strokeWidth={3} /> : null}
      </button>
      <div
        className="flex-1 min-w-0 cursor-pointer"
        onClick={() => setExpanded(v => !v)}
      >
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-[13.5px] font-medium leading-snug" style={{
            color: done ? "#94A3B8" : "var(--navy)",
            textDecoration: done ? "line-through" : "none",
          }}>{task.title}</h4>
          {task.tag && !locked && (
            <span className="text-[10px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap" style={{ background: tagColor.bg, color: tagColor.fg }}>{task.tag}</span>
          )}
        </div>
        <p className="text-[12px] mt-1 leading-relaxed" style={{ color: "#64748B" }}>{task.detail}</p>
        {locked && blockedBy && blockedBy.length > 0 && (
          <p className="text-[11px] mt-1.5" style={{ color: "var(--amber-deep)" }}>
            <Lock size={10} className="inline mr-1 -mt-0.5" />Complete first: {blockedBy[0]}
          </p>
        )}
        {task.optional && <p className="text-[10px] mt-1" style={{ color: "#94A3B8" }}>Optional</p>}

        {docCount > 0 && !expanded && (
          <div className="mt-2 flex items-center gap-1.5 text-[11px]" style={{ color: "#64748B" }}>
            <FileText size={11} />
            <span>{readyCount} of {docCount} documents ready</span>
            <span style={{ color: "var(--teal)" }}>· tap to view</span>
          </div>
        )}

        {docCount > 0 && expanded && (
          <div className="mt-2.5 pt-2.5" style={{ borderTop: "0.5px solid #E2E8F0" }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="text-[11px] font-medium uppercase tracking-wider" style={{ color: "#64748B" }}>
                Documents · {readyCount}/{docCount}
              </div>
              <button
                onClick={() => printDocChecklist(task, taskDocs)}
                className="text-[11px] px-2 py-0.5 rounded-md"
                style={{ background: "var(--teal-soft)", color: "#115E59" }}
              >
                🖨️ Print list
              </button>
            </div>
            <ul className="space-y-1.5">
              {task.docs!.map(d => {
                const checked = !!taskDocs[d.id];
                return (
                  <li key={d.id}>
                    <button
                      onClick={() => toggleDoc(d.id)}
                      className="w-full flex items-start gap-2 text-left py-1"
                    >
                      <span
                        className="w-4 h-4 rounded-sm flex-shrink-0 flex items-center justify-center mt-0.5"
                        style={{
                          background: checked ? "var(--teal)" : "white",
                          border: checked ? "1.5px solid var(--teal)" : "1.5px solid #CBD5E1",
                        }}
                      >
                        {checked && <Check size={11} color="white" strokeWidth={3} />}
                      </span>
                      <span className="text-[12px] leading-snug flex-1" style={{
                        color: checked ? "#94A3B8" : "var(--navy)",
                        textDecoration: checked ? "line-through" : "none",
                      }}>
                        {d.label}
                        {d.critical && (
                          <span
                            className="inline-block w-1.5 h-1.5 rounded-full ml-1.5 -mt-0.5 align-middle"
                            style={{ background: "#DC2626" }}
                            aria-label="Required"
                          />
                        )}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <p className="text-[10px] mt-2" style={{ color: "#94A3B8" }}>
              <span className="inline-block w-1.5 h-1.5 rounded-full mr-1 align-middle" style={{ background: "#DC2626" }} /> = legally required
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------- Housing tab ----------------
function HousingTab({ profile }: { profile: Profile }) {
  const deadline = arrivalMinusDays(profile.arrivalISO, 5);
  const isAmsterdam = profile.city === "Amsterdam";
  return (
    <>
      <TopBar title="Housing" profile={profile} />
      <div className="px-5 space-y-4">
        <div className="p-3.5 rounded-xl text-[12.5px] leading-relaxed" style={{ background: "#FFEDD5", color: "#9A3412", border: "0.5px solid #FDBA74" }}>
          <div className="flex items-start gap-2">
            <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
            <div>
              You need a confirmed address by <strong>{deadline}</strong>. {profile.city} gemeente wait is <strong>{gemeenteWait(profile.city)}</strong> — book your appointment before you leave.
              {isAmsterdam && <div className="mt-1.5">Contact your university international office for special student registration days — do NOT use regular gemeente.nl appointments.</div>}
            </div>
          </div>
        </div>

        <PlatformCard name="HousingAnywhere" subtitle="International-friendly · secure payments · verified landlords" tag="Safer choice" tagBg="#DCFCE7" tagFg="#14532D" />
        <PlatformCard name="Kamernet" subtitle="Largest NL student housing database" tag="Verify first" tagBg="#FFEDD5" tagFg="#9A3412" />
        <PlatformCard name="Facebook groups" subtitle="City expat and Erasmus housing groups" tag="Scam risk" tagBg="#FEE2E2" tagFg="#991B1B" />

        <div className="p-3.5 rounded-xl text-[12px] leading-relaxed" style={{ background: "#FFFBEB", color: "#78350F", border: "0.5px solid #FCD34D" }}>
          <div className="font-medium mb-1.5">⚠️ Red flags</div>
          <ul className="space-y-1">
            {[
              "Wire transfer before viewing",
              "Price well below market",
              "Landlord claims to be abroad",
              "No rental contract offered",
              "Deposit before signing",
              "Landlord refuses gemeente registration at the address",
            ].map(r => <li key={r}>· {r}</li>)}
          </ul>
        </div>
      </div>
    </>
  );
}

function PlatformCard({ name, subtitle, tag, tagBg, tagFg }: { name: string; subtitle: string; tag: string; tagBg: string; tagFg: string }) {
  return (
    <div className="p-4 rounded-xl" style={{ border: "0.5px solid #E2E8F0" }}>
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-[14px] font-medium" style={{ color: "var(--navy)" }}>{name}</h3>
        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap" style={{ background: tagBg, color: tagFg }}>{tag}</span>
      </div>
      <p className="text-[12px] mt-1" style={{ color: "#64748B" }}>{subtitle}</p>
    </div>
  );
}

// ---------------- Ask (AI Chat) ----------------
type ChatMsg = { role: "user" | "assistant"; content: string };

function AskTab({ profile }: { profile: Profile }) {
  const isMaja = profile.name === "Maja";
  const isValentina = profile.name === "Valentina";
  const initial: ChatMsg[] = isMaja ? DEMO_CHAT_MAJA : isValentina ? DEMO_CHAT_VALENTINA : [
    { role: "assistant", content: greetingFor(profile) },
  ];
  const [messages, setMessages] = useState<ChatMsg[]>(initial);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // reset when profile changes
  useEffect(() => { setMessages(initial); /* eslint-disable-next-line */ }, [profile.name]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const newMsgs: ChatMsg[] = [...messages, { role: "user", content: text }];
    setMessages(newMsgs);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ profile, messages: newMsgs }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setMessages([...newMsgs, { role: "assistant", content: data.reply as string }]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error("Couldn't reach SettleIn AI — " + msg);
      setMessages([...newMsgs, { role: "assistant", content: "Sorry, I couldn't reach the assistant just now. Please try again in a moment." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TopBar title="Ask SettleIn" profile={profile} />
      <div className="px-5 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`max-w-[88%] ${m.role === "user" ? "ml-auto" : ""}`}>
            {m.role === "user" ? (
              <div className="px-3.5 py-2.5 rounded-2xl rounded-tr-md text-[13.5px] text-white" style={{ background: "var(--teal)" }}>{m.content}</div>
            ) : (
              <div className="text-[13.5px] leading-relaxed whitespace-pre-wrap" style={{ color: "var(--navy)" }}>
                {renderMarkdownLite(m.content)}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="text-[12px] flex items-center gap-1.5" style={{ color: "#64748B" }}>
            <Sparkles size={12} /> Thinking…
          </div>
        )}
      </div>
      <div className="fixed bottom-16 left-0 right-0">
        <div className="mx-auto max-w-[480px] px-3 py-2 bg-white border-t" style={{ borderColor: "#E2E8F0" }}>
          <div className="flex gap-2 items-end">
            <textarea
              rows={1}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Ask about BSN, DigiD, zorgtoeslag…"
              className="flex-1 min-h-[40px] max-h-32 px-3 py-2 rounded-xl text-[13.5px] outline-none resize-none"
              style={{ border: "0.5px solid #E2E8F0" }}
            />
            <button onClick={send} disabled={loading || !input.trim()} className="w-10 h-10 rounded-full flex items-center justify-center text-white disabled:opacity-40" style={{ background: "var(--teal)" }}>
              <Send size={15} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function greetingFor(p: Profile): string {
  const days = daysUntil(p.arrivalISO);
  return `Hi ${p.name}! 👋 You're moving to ${p.city} in ${days} days. I've built your roadmap based on being ${p.nationality.adjective}, here for ${p.purpose.toLowerCase()}. Ask me anything — BSN, DigiD, health insurance, housing scams.\n\n**Next step:** check your roadmap tab for the first task.`;
}

function renderMarkdownLite(text: string): React.ReactNode {
  // simple bold + paragraph splitter
  const paras = text.split(/\n\n+/);
  return paras.map((p, i) => (
    <p key={i} className="mb-2 last:mb-0">
      {p.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
        part.startsWith("**") && part.endsWith("**")
          ? <strong key={j}>{part.slice(2, -2)}</strong>
          : <span key={j}>{part}</span>
      )}
    </p>
  ));
}

// ---------------- Profile tab ----------------
function ProfileTab({ profile, roadmap, doneIds, onAbout, onReset, onSwitchPersona }: {
  profile: Profile;
  roadmap: ReturnType<typeof buildRoadmap>;
  doneIds: Set<number>;
  onAbout: () => void;
  onReset: () => void;
  onSwitchPersona: (which: "maja" | "valentina") => void;
}) {
  const isEU = profile.nationality.group === 1;
  const total = roadmap.tasks.length;
  const done = roadmap.tasks.filter(t => doneIds.has(t.id)).length;
  const pct = Math.round((done / total) * 100);
  const days = daysUntil(profile.arrivalISO);
  const tbExempt = profile.nationality.tbExempt;
  const longStay = profile.stay === ">1 year" || profile.purpose !== "Internship or traineeship";
  const registrationLabel = longStay ? "Gemeente BRP (4+ months)" : "RNI (under 4 months)";

  const heroFrom = isEU ? "#0D9488" : "#BA7517";
  const heroTo = isEU ? "#0F766E" : "#9A5A0F";
  const heroGlow = isEU ? "#5EEAD4" : "#FCD34D";
  const circumference = 2 * Math.PI * 52;
  const dashOffset = circumference - (pct / 100) * circumference;

  return (
    <>
      {/* HERO */}
      <div
        className="relative px-5 pt-9 pb-20 text-white overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${heroFrom} 0%, ${heroTo} 100%)` }}
      >
        <div className="absolute -top-20 -right-16 w-64 h-64 rounded-full blur-3xl opacity-40" style={{ background: heroGlow }} />
        <div className="absolute -bottom-24 -left-20 w-72 h-72 rounded-full blur-3xl opacity-25" style={{ background: "#fff" }} />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "16px 16px" }}
        />

        <div className="relative flex items-center gap-3.5 anim-fade-up">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-[26px] font-semibold flex-shrink-0 ring-2 ring-white/30"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.35), rgba(255,255,255,0.12))",
              backdropFilter: "blur(12px)",
              boxShadow: "0 8px 24px -8px rgba(0,0,0,0.3)",
            }}
          >
            {profile.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-[26px] font-semibold tracking-tight leading-tight">
              <span className="truncate">{profile.name}</span>
              <span className="text-[22px] flex-shrink-0">{profile.nationality.flag}</span>
            </div>
            <p className="text-[13.5px] text-white/85 mt-1 font-normal flex items-center gap-1.5">
              <MapPin size={12} className="opacity-90" />
              <span className="truncate">{profile.city} · {profile.purpose}</span>
            </p>
          </div>
          <span
            className="text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.22)", backdropFilter: "blur(6px)" }}
          >
            {isEU ? "EU" : "Non-EU"}
          </span>
        </div>

        <div className="relative mt-7 flex flex-col items-center">
          <div className="relative w-[140px] h-[140px]">
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" stroke="rgba(255,255,255,0.18)" strokeWidth="9" fill="none" />
              <circle
                cx="60" cy="60" r="52"
                stroke="white" strokeWidth="9" fill="none" strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                style={{ transition: "stroke-dashoffset 800ms cubic-bezier(.2,.7,.2,1)" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-[40px] font-semibold leading-none tracking-tight">{pct}%</div>
              <div className="text-[11px] text-white/80 uppercase tracking-wider mt-1">Settled</div>
            </div>
          </div>
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11.5px] font-medium" style={{ background: "rgba(255,255,255,0.22)", backdropFilter: "blur(6px)" }}>
            <Clock size={11} />
            {days} days to arrival · {formatDate(profile.arrivalISO)}
          </div>
        </div>
      </div>

      {/* STAT GRID overlapping */}
      <div className="px-5 -mt-12 relative z-10">
        <div className="grid grid-cols-2 gap-3">
          <StatCard icon={<CheckCircle2 size={15} />} label="Steps done" value={`${done}/${total}`} tint="#0D9488" />
          <StatCard icon={<Calendar size={15} />} label="Arrival" value={`${days}d`} sub="until landing" tint="#F97316" />
          <StatCard icon={<TrendingUp size={15} />} label="Saving" value="€129" sub="per month · zorgtoeslag" tint="#22C55E" />
          <StatCard icon={<Stethoscope size={15} />} label="TB test" value={tbExempt ? "Exempt" : "Required"} tint={tbExempt ? "#22C55E" : "#E24B4A"} />
        </div>

        <div className="mt-7 flex items-center justify-between">
          <h3 className="text-[11px] uppercase tracking-[0.12em] font-semibold" style={{ color: "#64748B" }}>Your situation</h3>
          <span className="text-[10px]" style={{ color: "#94A3B8" }}>Auto-detected</span>
        </div>
        <div
          className="mt-2 rounded-2xl overflow-hidden bg-white"
          style={{ border: "0.5px solid #E2E8F0", boxShadow: "0 1px 3px rgba(15,23,42,0.04)" }}
        >
          <SituationRow icon={<Flag size={14} />} label="Nationality" value={`${profile.nationality.flag} ${profile.nationality.adjective}`} />
          <SituationRow icon={<MapPin size={14} />} label="City" value={profile.city} />
          <SituationRow icon={<Briefcase size={14} />} label="Purpose" value={profile.purpose} />
          <SituationRow icon={<FileText size={14} />} label="Registration" value={registrationLabel} />
          <SituationRow icon={<KeyRound size={14} />} label="Housing" value={profile.housing === "sorted" ? "Sorted" : profile.housing === "looking" ? "Looking" : "University"} valueTone={profile.housing === "sorted" ? "good" : profile.housing === "looking" ? "warn" : "neutral"} />
          <SituationRow icon={<Stethoscope size={14} />} label="TB test" value={tbExempt ? "No — exempt" : "Within 3 months"} valueTone={tbExempt ? "good" : "warn"} last />
        </div>

        <div className="mt-6 space-y-2.5 pb-2">
          <button
            onClick={onAbout}
            className="w-full px-4 py-3.5 rounded-2xl text-[13.5px] font-medium flex items-center justify-between transition active:scale-[0.98] bg-white"
            style={{ border: "0.5px solid #E2E8F0", boxShadow: "0 1px 3px rgba(15,23,42,0.04)" }}
          >
            <span className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--teal-soft)", color: "var(--teal)" }}>
                <Globe2 size={15} />
              </span>
              <span style={{ color: "var(--navy)" }}>About SettleIn</span>
            </span>
            <ArrowRight size={14} color="#94A3B8" />
          </button>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => onSwitchPersona(profile.name === "Maja" ? "valentina" : "maja")}
              className="px-3 py-3 rounded-2xl text-[12px] font-medium flex items-center justify-center gap-1.5 transition active:scale-[0.98] bg-white"
              style={{ border: "0.5px solid #E2E8F0", color: "#475569" }}
            >
              <Sparkles size={12} />
              Switch to {profile.name === "Maja" ? "Valentina" : "Maja"}
            </button>
            <button
              onClick={onReset}
              className="px-3 py-3 rounded-2xl text-[12px] font-medium flex items-center justify-center gap-1.5 transition active:scale-[0.98] bg-white"
              style={{ border: "0.5px solid #E2E8F0", color: "#475569" }}
            >
              <RotateCcw size={12} />
              Start over
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function StatCard({ icon, label, value, sub, tint }: { icon: React.ReactNode; label: string; value: string; sub?: string; tint: string }) {
  return (
    <div
      className="p-3.5 rounded-2xl bg-white transition active:scale-[0.98]"
      style={{ border: "0.5px solid #E2E8F0", boxShadow: "0 4px 14px -8px rgba(15,23,42,0.12)" }}
    >
      <span className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${tint}1A`, color: tint }}>
        {icon}
      </span>
      <div className="text-[10px] uppercase tracking-wider mt-2.5 font-medium" style={{ color: "#94A3B8" }}>{label}</div>
      <div className="text-[18px] font-semibold mt-0.5 leading-tight" style={{ color: "var(--navy)" }}>{value}</div>
      {sub && <div className="text-[10.5px] mt-0.5" style={{ color: "#94A3B8" }}>{sub}</div>}
    </div>
  );
}

function SituationRow({ icon, label, value, valueTone, last }: { icon: React.ReactNode; label: string; value: string; valueTone?: "good" | "warn" | "neutral"; last?: boolean }) {
  const valueColor = valueTone === "good" ? "#15803D" : valueTone === "warn" ? "#9A3412" : "var(--navy)";
  return (
    <div className={`px-4 py-3 flex items-center gap-3 ${last ? "" : "border-b"}`} style={{ borderColor: "#F1F5F9" }}>
      <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "#F8FAFC", color: "#64748B" }}>
        {icon}
      </span>
      <span className="text-[12.5px] flex-1" style={{ color: "#64748B" }}>{label}</span>
      <span className="text-[13px] font-medium text-right" style={{ color: valueColor }}>{value}</span>
    </div>
  );
}

function Stat({ label, value, sub, good, bad }: { label: string; value: string; sub?: string; good?: boolean; bad?: boolean }) {
  const fg = good ? "#15803D" : bad ? "#B91C1C" : "var(--navy)";
  return (
    <div className="p-3.5 rounded-xl" style={{ border: "0.5px solid #E2E8F0", background: "white" }}>
      <div className="text-[10px] uppercase tracking-wider" style={{ color: "#94A3B8" }}>{label}</div>
      <div className="text-[16px] font-medium mt-1" style={{ color: fg }}>{value}</div>
      {sub && <div className="text-[10px] mt-0.5" style={{ color: "#94A3B8" }}>{sub}</div>}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-4 py-3 flex justify-between items-center text-[13px]">
      <span style={{ color: "#64748B" }}>{label}</span>
      <span className="font-medium text-right" style={{ color: "var(--navy)" }}>{value}</span>
    </div>
  );
}

// ---------------- About ----------------
function AboutScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="px-5 pt-6 pb-8">
      <button onClick={onBack} className="text-[12px] mb-4" style={{ color: "#64748B" }}>
        <ArrowLeft size={12} className="inline mr-1" />Back
      </button>
      <h1 className="text-[22px] font-medium" style={{ color: "var(--navy)" }}>About SettleIn</h1>
      <p className="text-[13px] mt-2" style={{ color: "#64748B" }}>Don't just move. Arrive.</p>

      <section className="mt-6">
        <h2 className="text-[11px] uppercase tracking-wider mb-2" style={{ color: "#94A3B8" }}>Business model</h2>
        <ul className="space-y-2 text-[13px]" style={{ color: "var(--navy)" }}>
          <li><strong>Free for users</strong> — always.</li>
          <li><strong>Universities</strong> — €5–10k/year licensing per institution.</li>
          <li><strong>Employer & internship partnerships</strong> — €15 per intern.</li>
          <li><strong>Affiliate referrals</strong> — HousingAnywhere, Kamernet, Bunq, insurance providers.</li>
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="text-[11px] uppercase tracking-wider mb-2" style={{ color: "#94A3B8" }}>Vision</h2>
        <div className="space-y-2 text-[13px]" style={{ color: "var(--navy)" }}>
          <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--success)" }} /> Netherlands — live now</div>
          <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full" style={{ background: "#94A3B8" }} /> Germany — Q3 2026</div>
          <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full" style={{ background: "#94A3B8" }} /> Belgium — Q4 2026</div>
          <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full" style={{ background: "#94A3B8" }} /> France — Q1 2027</div>
          <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full" style={{ background: "#94A3B8" }} /> Spain — Q2 2027</div>
          <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full" style={{ background: "#94A3B8" }} /> → all of Europe</div>
        </div>
      </section>

      <div className="mt-8 p-4 rounded-xl text-center text-[12px]" style={{ background: "var(--teal-soft)", color: "#115E59" }}>
        <ShieldCheck size={16} className="inline mr-1 -mt-0.5" />
        Built with verified Dutch government data — IND, gemeente, Belastingdienst, GGD.
      </div>
    </div>
  );
}

// ---------------- Bottom nav ----------------
function BottomNav({ tab, setTab }: { tab: AppTab; setTab: (t: AppTab) => void }) {
  const items = [
    { id: "roadmap" as const, label: "Roadmap", icon: MapIcon },
    { id: "map" as const, label: "Map", icon: MapPin },
    { id: "housing" as const, label: "Housing", icon: Home },
    { id: "ask" as const, label: "Ask", icon: MessageCircle },
    { id: "profile" as const, label: "Profile", icon: User },
  ];
  return (
    <div className="fixed bottom-0 left-0 right-0">
      <div className="mx-auto max-w-[480px] bg-white border-t flex" style={{ borderColor: "#E2E8F0" }}>
        {items.map(it => {
          const active = tab === it.id;
          const Icon = it.icon;
          return (
            <button key={it.id} onClick={() => setTab(it.id)} className="flex-1 py-2.5 flex flex-col items-center gap-0.5">
              <Icon size={18} color={active ? "var(--teal)" : "#94A3B8"} strokeWidth={active ? 2.25 : 1.75} />
              <span className="text-[10px]" style={{ color: active ? "var(--teal)" : "#94A3B8", fontWeight: active ? 500 : 400 }}>{it.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------------- Confetti ----------------
function Confetti({ x, y, onDone }: { x: number; y: number; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 700); return () => clearTimeout(t); }, [onDone]);
  const colors = ["#0D9488", "#F97316", "#22C55E", "#FCD34D", "#E24B4A"];
  return (
    <div className="fixed pointer-events-none z-50" style={{ left: x, top: y }}>
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i / 16) * Math.PI * 2;
        const dist = 40 + Math.random() * 30;
        return (
          <span key={i}
            className="absolute w-1.5 h-1.5 rounded-sm"
            style={{
              background: colors[i % colors.length],
              ["--dx" as never]: `${Math.cos(angle) * dist}px`,
              ["--dy" as never]: `${Math.sin(angle) * dist}px`,
              animation: "confetti-burst 700ms ease-out forwards",
            }}
          />
        );
      })}
    </div>
  );
}
