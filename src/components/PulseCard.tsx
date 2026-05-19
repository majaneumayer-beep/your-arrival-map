import type { Profile } from "@/lib/settlein/data";
import { buildRoadmap, daysUntil, CITIES } from "@/lib/settlein/data";

function gemeenteMaxWeeks(city: string): number {
  const c = CITIES.find(c => c.name === city);
  if (!c?.waitWeeks) return 4;
  const nums = c.waitWeeks.match(/\d+/g);
  if (!nums) return 4;
  return Math.max(...nums.map(Number));
}

type Pulse = { emoji: string; line: string; tone: "teal" | "amber" | "red" };

function computePulse(profile: Profile, roadmap: ReturnType<typeof buildRoadmap>, doneIds: Set<number>): Pulse {
  const days = daysUntil(profile.arrivalISO);
  const urgent = roadmap.tasks.filter(t => t.phaseTone === "red" || t.phaseTone === "amber");
  const urgentDone = urgent.filter(t => doneIds.has(t.id)).length;
  const urgentTotal = urgent.length;

  const gemeenteWeeks = gemeenteMaxWeeks(profile.city);
  const isNonEU = profile.nationality.group !== 1;
  const isWorker = profile.purpose === "Starting a job" || profile.purpose === "Internship or traineeship";
  const needsGVVA = isNonEU && isWorker;

  const gemeenteTask = roadmap.tasks.find(t => t.title.toLowerCase().includes("gemeente appointment"));
  const gemeenteBooked = gemeenteTask ? doneIds.has(gemeenteTask.id) : false;

  // Hard blocker: GVVA needs ~5–7 weeks and arrival is too soon.
  if (needsGVVA && days > 0 && days < 35) {
    return {
      emoji: "🚨",
      tone: "red",
      line: `Behind schedule — GVVA takes 5–7 weeks but you arrive in ${days} days. Push employer HR today.`,
    };
  }

  // Gemeente not booked and arrival is approaching faster than the wait.
  if (!gemeenteBooked && days > 0 && days < gemeenteWeeks * 7 + 5) {
    return {
      emoji: "⚠️",
      tone: "amber",
      line: `Getting tight — ${days} days left, ${profile.city} gemeente not booked yet (${gemeenteWeeks}-week wait).`,
    };
  }

  // Past arrival — focus on what's left.
  if (days <= 0) {
    const undone = roadmap.tasks.filter(t => !doneIds.has(t.id)).length;
    if (undone === 0) return { emoji: "🎉", tone: "teal", line: "You're fully settled — every task done. Welcome home." };
    return { emoji: "👋", tone: "amber", line: `You've arrived — ${undone} tasks still open. Tackle the red ones first.` };
  }

  // On-track default.
  if (urgentDone >= Math.ceil(urgentTotal * 0.6)) {
    return {
      emoji: "✅",
      tone: "teal",
      line: `You're on track — ${days} days left, ${urgentDone} of ${urgentTotal} urgent tasks done.`,
    };
  }

  return {
    emoji: "👀",
    tone: "amber",
    line: `Heads up — ${days} days left and only ${urgentDone} of ${urgentTotal} urgent tasks done. Pick one today.`,
  };
}

const TONE = {
  teal: { bg: "var(--teal-bg)", border: "#99F6E4", fg: "#115E59" },
  amber: { bg: "#FFF7ED", border: "#FED7AA", fg: "#9A3412" },
  red: { bg: "#FEF2F2", border: "#FCA5A5", fg: "#991B1B" },
};

export default function PulseCard({ profile, roadmap, doneIds }: {
  profile: Profile;
  roadmap: ReturnType<typeof buildRoadmap>;
  doneIds: Set<number>;
}) {
  const pulse = computePulse(profile, roadmap, doneIds);
  const t = TONE[pulse.tone];
  return (
    <div className="p-3.5 rounded-xl flex items-start gap-3" style={{ background: t.bg, border: `0.5px solid ${t.border}` }}>
      <span className="text-[20px] leading-none mt-0.5" aria-hidden>{pulse.emoji}</span>
      <div className="flex-1">
        <div className="text-[10px] uppercase tracking-wider font-medium" style={{ color: t.fg, opacity: 0.7 }}>
          Weekly pulse — am I on track?
        </div>
        <div className="text-[13px] mt-0.5 leading-snug" style={{ color: t.fg, fontWeight: 500 }}>
          {pulse.line}
        </div>
      </div>
    </div>
  );
}
