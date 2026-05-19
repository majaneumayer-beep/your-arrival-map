import type { Profile } from "@/lib/settlein/data";
import { calculateMonthlyCosts, type CostLine } from "@/lib/cost-calculator";

const COLOR: Record<CostLine["color"], string> = {
  teal: "var(--teal)",
  amber: "var(--urgent)",
  navy: "var(--navy)",
  grey: "#CBD5E1",
};

function fmt(n: number): string {
  return "€" + n.toLocaleString("en-GB");
}

export default function CostCalculator({ profile }: { profile: Profile }) {
  const { lines, total, savings, netTotal } = calculateMonthlyCosts(profile);
  const visible = lines.filter(l => l.amount > 0);
  const savingsTotal = savings.reduce((s, l) => s + l.amount, 0);

  return (
    <div className="p-4 rounded-xl" style={{ background: "white", border: "0.5px solid #E2E8F0" }}>
      <div className="flex items-baseline justify-between">
        <h3 className="text-[14px] font-medium" style={{ color: "var(--navy)" }}>Your estimated first month</h3>
        <span className="text-[11px]" style={{ color: "#64748B" }}>2026 estimate</span>
      </div>
      <div className="mt-1 text-[28px] font-semibold" style={{ color: "var(--navy)" }}>{fmt(total)}</div>
      <div className="text-[11px]" style={{ color: "#64748B" }}>
        {profile.city} · {profile.purpose}
        {savingsTotal > 0 && <> · net after allowances <span style={{ color: "var(--teal)", fontWeight: 600 }}>{fmt(netTotal)}</span></>}
      </div>

      <div className="mt-3 h-2 rounded-full overflow-hidden flex" style={{ background: "#F1F5F9" }}>
        {visible.map(l => (
          <div key={l.id} title={`${l.label} — ${fmt(l.amount)}`}
            style={{ width: `${(l.amount / total) * 100}%`, background: COLOR[l.color] }} />
        ))}
      </div>

      <ul className="mt-3 space-y-1.5">
        {lines.map(l => (
          <li key={l.id} className="flex items-center justify-between text-[12px]">
            <span className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full" style={{ background: COLOR[l.color] }} />
              <span style={{ color: "var(--navy)" }}>{l.label}</span>
              {l.note && <span className="text-[10px]" style={{ color: "#94A3B8" }}>· {l.note}</span>}
            </span>
            <span style={{ color: l.amount === 0 ? "#94A3B8" : "var(--navy)", fontWeight: 500 }}>
              {l.amount === 0 ? "Free" : fmt(l.amount)}
            </span>
          </li>
        ))}
      </ul>

      {savings.length > 0 && (
        <div className="mt-4 pt-3" style={{ borderTop: "0.5px solid #E2E8F0" }}>
          <div className="flex items-baseline justify-between">
            <h4 className="text-[12px] font-medium" style={{ color: "var(--teal)" }}>💰 Monthly money coming back</h4>
            <span className="text-[12px] font-semibold" style={{ color: "var(--teal)" }}>−{fmt(savingsTotal)}</span>
          </div>
          <ul className="mt-2 space-y-1.5">
            {savings.map(s => (
              <li key={s.id} className="p-2 rounded-lg" style={{ background: "var(--teal-bg)" }}>
                <div className="flex justify-between text-[12px]">
                  <span style={{ color: "var(--navy)", fontWeight: 500 }}>{s.label}</span>
                  <span style={{ color: "var(--teal)", fontWeight: 600 }}>{fmt(s.amount)}/mo</span>
                </div>
                <div className="text-[10px] mt-0.5" style={{ color: "#64748B" }}>{s.note}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
