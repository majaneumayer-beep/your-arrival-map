// Rough 2026 monthly cost estimates for first-month-in-NL planning.
import type { Profile } from "@/lib/settlein/data";

export type CostLine = { id: string; label: string; amount: number; color: "teal" | "amber" | "navy" | "grey"; note?: string };
export type SavingLine = { id: string; label: string; amount: number; note: string };

export type CostBreakdown = {
  lines: CostLine[];
  total: number;
  savings: SavingLine[];
  netTotal: number;
};

// Per-city average room rent (mid-range, single room or small studio share).
const CITY_RENT: Record<string, number> = {
  Rotterdam: 600,
  Amsterdam: 800,
  Utrecht: 650,
  "Den Haag": 700,
  Groningen: 450,
  Eindhoven: 550,
  Wageningen: 500,
  Delft: 600,
  Leiden: 650,
  Maastricht: 550,
  Tilburg: 500,
  Nijmegen: 500,
  Enschede: 450,
};

function rentFor(city: string): number {
  return CITY_RENT[city] ?? 575;
}

export function calculateMonthlyCosts(profile: Profile): CostBreakdown {
  const isEU = profile.nationality.group === 1;
  const isWorker = profile.purpose === "Starting a job" || profile.purpose === "Internship or traineeship";
  const isStudyOnly = !isWorker;

  // EU study-only people can use EHIC and don't take Dutch insurance.
  const needsDutchInsurance = !(isEU && isStudyOnly);

  const rent = rentFor(profile.city);

  const lines: CostLine[] = [
    { id: "rent", label: "Rent (room avg)", amount: rent, color: "navy", note: `${profile.city} mid-range room` },
    { id: "insurance", label: "Health insurance", amount: needsDutchInsurance ? 135 : 0, color: "teal", note: needsDutchInsurance ? "basisverzekering" : "Covered by EHIC" },
    { id: "transport", label: "Transport (OV)", amount: 90, color: "amber", note: "OVpay average" },
    { id: "groceries", label: "Groceries", amount: 250, color: "teal", note: "Albert Heijn / Jumbo" },
    { id: "phone", label: "Phone plan", amount: 15, color: "amber", note: "Simyo / Lebara SIM-only" },
    { id: "gemeente", label: "Gemeente registration", amount: 0, color: "grey", note: "Free for first BRP registration" },
  ];

  const total = lines.reduce((s, l) => s + l.amount, 0);

  const savings: SavingLine[] = [];
  // Zorgtoeslag: needs Dutch insurance + income below threshold; assume eligible for workers/interns at entry-level pay.
  if (needsDutchInsurance) {
    savings.push({ id: "zorgtoeslag", label: "Zorgtoeslag (healthcare allowance)", amount: 129, note: "If income < €40,857/yr — apply via Belastingdienst" });
  }
  // 30% ruling: only for incoming workers recruited from abroad.
  if (profile.purpose === "Starting a job" && !isEU) {
    savings.push({ id: "ruling30", label: "30% ruling — tax savings", amount: 600, note: "Approx €600/mo on a €4,000 gross salary — employer must apply" });
  } else if (profile.purpose === "Starting a job" && isEU) {
    savings.push({ id: "ruling30", label: "30% ruling — tax savings", amount: 400, note: "Available to EU hires recruited from abroad — confirm with HR" });
  }

  const netTotal = total - savings.reduce((s, l) => s + l.amount, 0);

  return { lines, total, savings, netTotal };
}
