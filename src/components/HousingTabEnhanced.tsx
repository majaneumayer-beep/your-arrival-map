import { useState, useMemo } from "react";
import { AlertTriangle, ExternalLink, ChevronDown, ShieldCheck, ShieldAlert, Shield, Search } from "lucide-react";
import type { Profile } from "@/lib/settlein/data";
import { arrivalMinusDays, gemeenteWait } from "@/lib/settlein/data";
import { HOUSING_PLATFORMS, CITY_HOUSING, SCAM_RED_FLAGS, checkListingForRedFlags, type TrustLevel, type HousingPlatform } from "@/lib/housing-api";

function Header({ profile }: { profile: Profile }) {
  const isEU = profile.nationality.group === 1;
  return (
    <div className="px-5 pt-5 pb-3 flex items-center justify-between">
      <h1 className="text-[18px] font-medium" style={{ color: "var(--navy)" }}>Housing</h1>
      <span
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium"
        style={{ background: isEU ? "var(--teal-soft)" : "#FEF3C7", color: isEU ? "#115E59" : "var(--amber-deep)" }}
      >
        {profile.city}
      </span>
    </div>
  );
}

const TRUST_STYLE: Record<TrustLevel, { bg: string; fg: string; label: string; Icon: typeof ShieldCheck }> = {
  safe: { bg: "#DCFCE7", fg: "#14532D", label: "Safer choice", Icon: ShieldCheck },
  verify: { bg: "#FFEDD5", fg: "#9A3412", label: "Verify first", Icon: Shield },
  risky: { bg: "#FEE2E2", fg: "#991B1B", label: "Scam risk", Icon: ShieldAlert },
};

export default function HousingTabEnhanced({ profile }: { profile: Profile }) {
  const deadline = arrivalMinusDays(profile.arrivalISO, 5);
  const isAmsterdam = profile.city === "Amsterdam";
  const market = CITY_HOUSING[profile.city];
  const [openPlatform, setOpenPlatform] = useState<string | null>(null);

  return (
    <>
      <Header profile={profile} />
      <div className="px-5 space-y-4 pb-4">
        {/* Deadline alert */}
        <div className="p-3.5 rounded-xl text-[12.5px] leading-relaxed" style={{ background: "#FFEDD5", color: "#9A3412", border: "0.5px solid #FDBA74" }}>
          <div className="flex items-start gap-2">
            <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
            <div>
              You need a confirmed address by <strong>{deadline}</strong>. {profile.city} gemeente wait is <strong>{gemeenteWait(profile.city)}</strong> — book before you leave.
              {isAmsterdam && (profile.purpose === "Full degree student" || profile.purpose === "Exchange semester") && <div className="mt-1.5">Contact your university international office for special student registration days — do NOT use regular gemeente.nl appointments.</div>}
            </div>
          </div>
        </div>

        {/* Market overview */}
        {market && (
          <div className="p-4 rounded-xl" style={{ background: "linear-gradient(135deg, var(--teal-bg), white)", border: "0.5px solid var(--teal-soft)" }}>
            <h2 className="text-[13px] font-medium mb-2.5" style={{ color: "var(--navy)" }}>{profile.city} market</h2>
            <div className="grid grid-cols-3 gap-2 mb-2.5">
              <PriceCell label="Room" value={market.avgRoom} />
              <PriceCell label="Studio" value={market.avgStudio} />
              <PriceCell label="Apt" value={market.avgApartment} />
            </div>
            <p className="text-[12px] leading-relaxed" style={{ color: "#475569" }}>{market.marketNote}</p>
          </div>
        )}

        {/* Platforms */}
        <div>
          <h2 className="text-[13px] font-medium mb-2" style={{ color: "var(--navy)" }}>Where to search</h2>
          <div className="space-y-2.5">
            {HOUSING_PLATFORMS.map(p => (
              <PlatformCard key={p.id} platform={p} open={openPlatform === p.id} onToggle={() => setOpenPlatform(openPlatform === p.id ? null : p.id)} />
            ))}
          </div>
        </div>

        {/* Neighborhoods */}
        {market && (
          <div>
            <h2 className="text-[13px] font-medium mb-2" style={{ color: "var(--navy)" }}>Neighborhoods in {profile.city}</h2>
            <div className="space-y-2">
              {market.neighborhoods.map(n => (
                <div key={n.name} className="p-3 rounded-xl flex items-center gap-3" style={{ border: "0.5px solid #E2E8F0", background: "white" }}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-[13px] font-medium" style={{ color: "var(--navy)" }}>{n.name}</h3>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium" style={{ background: "var(--teal-soft)", color: "#115E59" }}>{n.priceBand}</span>
                    </div>
                    <p className="text-[12px] mt-0.5" style={{ color: "#64748B" }}>{n.vibe}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scam detector */}
        <ScamDetector />

        {/* Red flags reference */}
        <div className="p-3.5 rounded-xl text-[12px] leading-relaxed" style={{ background: "#FFFBEB", color: "#78350F", border: "0.5px solid #FCD34D" }}>
          <div className="font-medium mb-1.5 flex items-center gap-1.5"><AlertTriangle size={12} /> Red flags to watch for</div>
          <ul className="space-y-1.5">
            {SCAM_RED_FLAGS.map(r => (
              <li key={r.flag}>
                <div>· <strong>{r.flag}</strong></div>
                <div className="ml-3 text-[11.5px]" style={{ color: "#92400E" }}>{r.why}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

function PriceCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-2 rounded-lg text-center" style={{ background: "white", border: "0.5px solid var(--teal-soft)" }}>
      <div className="text-[10px] uppercase tracking-wide" style={{ color: "#94A3B8" }}>{label}</div>
      <div className="text-[12.5px] font-medium mt-0.5" style={{ color: "var(--navy)" }}>{value}</div>
    </div>
  );
}

function PlatformCard({ platform, open, onToggle }: { platform: HousingPlatform; open: boolean; onToggle: () => void }) {
  const trust = TRUST_STYLE[platform.trust];
  const Icon = trust.Icon;
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "0.5px solid #E2E8F0", background: "white" }}>
      <button onClick={onToggle} className="w-full text-left p-3.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[14px] font-medium" style={{ color: "var(--navy)" }}>{platform.name}</h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap inline-flex items-center gap-1" style={{ background: trust.bg, color: trust.fg }}>
            <Icon size={10} /> {trust.label}
          </span>
        </div>
        <p className="text-[12px] mt-1" style={{ color: "#64748B" }}>{platform.description}</p>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-[11px]" style={{ color: "#94A3B8" }}>Best for: {platform.bestFor}</span>
          <ChevronDown size={14} style={{ color: "#94A3B8", transform: open ? "rotate(180deg)" : "none", transition: "transform 200ms" }} />
        </div>
      </button>
      {open && (
        <div className="px-3.5 pb-3.5 anim-fade-up">
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <div className="text-[10px] uppercase tracking-wide font-medium mb-1" style={{ color: "#16A34A" }}>Pros</div>
              <ul className="space-y-0.5">{platform.pros.map(p => <li key={p} className="text-[11.5px]" style={{ color: "#475569" }}>+ {p}</li>)}</ul>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wide font-medium mb-1" style={{ color: "#DC2626" }}>Cons</div>
              <ul className="space-y-0.5">{platform.cons.map(c => <li key={c} className="text-[11.5px]" style={{ color: "#475569" }}>− {c}</li>)}</ul>
            </div>
          </div>
          <a
            href={platform.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-medium"
            style={{ background: "var(--teal)", color: "white" }}
          >
            Visit {platform.name} <ExternalLink size={11} />
          </a>
        </div>
      )}
    </div>
  );
}

function ScamDetector() {
  const [text, setText] = useState("");
  const hits = useMemo(() => text.trim().length > 10 ? checkListingForRedFlags(text) : [], [text]);
  const checked = text.trim().length > 10;
  return (
    <div className="p-4 rounded-xl" style={{ border: "0.5px solid #E2E8F0", background: "white" }}>
      <h2 className="text-[13px] font-medium mb-1 flex items-center gap-1.5" style={{ color: "var(--navy)" }}>
        <Search size={13} /> Scam detector
      </h2>
      <p className="text-[11.5px] mb-2" style={{ color: "#64748B" }}>Paste a listing or message — we'll flag scam patterns.</p>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Paste the listing text or landlord message here…"
        className="w-full text-[12.5px] p-2.5 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-offset-0"
        style={{ border: "0.5px solid #E2E8F0", color: "var(--navy)", minHeight: 80 }}
      />
      {checked && (
        <div className="mt-2.5">
          {hits.length === 0 ? (
            <div className="p-2.5 rounded-lg text-[12px] flex items-start gap-2" style={{ background: "#DCFCE7", color: "#14532D" }}>
              <ShieldCheck size={13} className="mt-0.5 flex-shrink-0" />
              <span>No obvious scam patterns detected. Still verify in person and use a written contract.</span>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="text-[11.5px] font-medium" style={{ color: "#991B1B" }}>{hits.length} red flag{hits.length > 1 ? "s" : ""} detected:</div>
              {hits.map((h, i) => (
                <div key={i} className="p-2.5 rounded-lg text-[12px]" style={{ background: "#FEE2E2", color: "#991B1B" }}>
                  <div className="font-medium flex items-start gap-1.5"><ShieldAlert size={12} className="mt-0.5 flex-shrink-0" />{h.flag}</div>
                  <div className="mt-0.5 text-[11.5px] ml-4" style={{ color: "#7F1D1D" }}>{h.why}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
