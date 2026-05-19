// Accurate 2026 monthly cost estimates for first-month-in-NL planning.
import type { Profile } from "@/lib/settlein/data";

export type CostLine = { id: string; label: string; amount: number; color: "teal" | "amber" | "navy" | "grey"; note?: string };
export type SavingLine = { id: string; label: string; amount: number; note: string };

export type CostBreakdown = {
  lines: CostLine[];
  total: number;
  savings: SavingLine[];
  netTotal: number;
};

// Per-city average room rent — 2026 mid-range single room (Pararius / HousingAnywhere data).
const CITY_RENT: Record<string, number> = {
  Rotterdam:  750,   // up significantly since 2024
  Amsterdam:  950,   // cheapest realistic room incl. utils
  Utrecht:    800,
  "Den Haag": 800,
  Groningen:  550,
  Wageningen: 600,
  Eindhoven:  700,
  Delft:      750,
  Leiden:     800,
  Maastricht: 650,
  Tilburg:    600,
  Nijmegen:   600,
  Enschede:   550,
  Haarlem:    850,
  Breda:      650,
  Arnhem:     600,
  Zwolle:     625,
  Amersfoort: 700,
  "Den Bosch": 650,
  Leeuwarden: 525,
  Almere:     700,
};

function rentFor(city: string): number {
  return CITY_RENT[city] ?? 700;
}

export function calculateMonthlyCosts(profile: Profile): CostBreakdown {
  const isEU = profile.nationality.group === 1;
  const isWorker = profile.purpose === "Starting a job" || profile.purpose === "Internship or traineeship";
  const isStudyOnly = !isWorker;

  // EU study-only: use EHIC, no Dutch insurance needed.
  const needsDutchInsurance = !(isEU && isStudyOnly);

  const rent = rentFor(profile.city);

  // Health insurance 2026: avg basisverzekering is €159/mo (Zorginstituut NL figure).
  // We show the realistic avg, not the cheapest possible.
  const healthInsurance = needsDutchInsurance ? 159 : 0;

  const lines: CostLine[] = [
    {
      id: "rent",
      label: "Rent (room avg)",
      amount: rent,
      color: "navy",
      note: `${profile.city} mid-range room 2026`,
    },
    {
      id: "insurance",
      label: "Health insurance",
      amount: needsDutchInsurance ? 159 : 20,
      color: "teal",
      note: needsDutchInsurance
        ? "basisverzekering avg 2026"
        : "EHIC = emergencies only — most schools recommend +€20/mo supplemental",
    },
    {
      id: "bike",
      label: "Bike (recommended 🚲)",
      amount: 17,
      color: "teal",
      note: "Swapfiets Basic €17/mo — swap if broken, no deposit needed",
    },
    {
      id: "transport",
      label: "Public transport (OV)",
      amount: 60,
      color: "amber",
      // NL has no monthly pass — you pay per trip via OVpay
      // avg student uses train ~2x/week intercity + tram/bus daily = ~€60/mo realistic
      note: "No monthly pass in NL — OVpay per trip, ~€60/mo realistic avg",
    },
    {
      id: "groceries",
      label: "Groceries",
      amount: 280,
      color: "teal",
      note: "Albert Heijn / Jumbo / Lidl — realistic 2026 avg",
    },
    {
      id: "phone",
      label: "Phone plan",
      amount: 12,
      color: "amber",
      note: "Simyo / Lebara SIM-only",
    },
    {
      id: "gemeente",
      label: "Gemeente BRP registration",
      amount: 0,
      color: "grey",
      note: "Free — first registration",
    },
  ];

  const total = lines.reduce((s, l) => s + l.amount, 0);

  const savings: SavingLine[] = [];

  // Zorgtoeslag 2026: max €127/mo single under 65 (Belastingdienst).
  if (needsDutchInsurance) {
    savings.push({
      id: "zorgtoeslag",
      label: "Zorgtoeslag (healthcare allowance)",
      amount: 127,
      note: "Max 2026 single rate — income < €40,857/yr — apply at belastingdienst.nl",
    });
  }

  // 30% ruling — only for workers hired from abroad, salary above €46,107 (2026 threshold).
  if (profile.purpose === "Starting a job") {
    savings.push({
      id: "ruling30",
      label: "30% ruling — tax-free allowance",
      amount: 500,
      note: "Approx saving on €4,000 gross — employer must apply within 4 months of start date",
    });
  }

  const netTotal = total - savings.reduce((s, l) => s + l.amount, 0);

  return { lines, total, savings, netTotal };
}
