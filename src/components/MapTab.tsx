import { useState, useMemo, useEffect } from "react";
import { MapPin, ExternalLink, ChevronDown } from "lucide-react";
import type { Profile } from "@/lib/settlein/data";
import { CITY_POIS, POI_CATEGORIES, googleMapsDirections, googleMapsSearch, type POICategory, type POI } from "@/lib/maps";
import { QUICK_LINKS } from "@/lib/government-api";

function Header({ profile }: { profile: Profile }) {
  const isEU = profile.nationality.group === 1;
  return (
    <div className="px-5 pt-5 pb-3 flex items-center justify-between">
      <h1 className="text-[18px] font-medium" style={{ color: "var(--navy)" }}>Map</h1>
      <span
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium"
        style={{ background: isEU ? "var(--teal-soft)" : "#FEF3C7", color: isEU ? "#115E59" : "var(--amber-deep)" }}
      >
        <MapPin size={11} />{profile.city}
      </span>
    </div>
  );
}

const CAT_COLOR: Record<POICategory, { bg: string; fg: string }> = {
  gemeente: { bg: "var(--teal-soft)", fg: "#115E59" },
  ind: { bg: "#FEF3C7", fg: "var(--amber-deep)" },
  ggd: { bg: "#FEE2E2", fg: "#991B1B" },
  university: { bg: "#E0E7FF", fg: "#3730A3" },
  transport: { bg: "#DCFCE7", fg: "#14532D" },
  social: { bg: "#FCE7F3", fg: "#9D174D" },
};

export default function MapTab({ profile }: { profile: Profile }) {
  const [filter, setFilter] = useState<POICategory | "all">("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const isStudent = profile.purpose === "Full degree student" || profile.purpose === "Exchange semester";
  const isWorker = !isStudent;

  // Reset filter if it was on university and user is a worker
  useEffect(() => {
    if (isWorker && filter === "university") setFilter("all");
  }, [profile.purpose]);

  const pois = (CITY_POIS[profile.city] ?? []).filter(p => {
    if (isWorker && p.category === "university") return false;
    return true;
  });

  const visibleCategories = POI_CATEGORIES.filter(c => {
    if (isWorker && c.id === "university") return false;
    return true;
  });

  const filtered = useMemo(() => filter === "all" ? pois : pois.filter(p => p.category === filter), [pois, filter]);

  return (
    <>
      <Header profile={profile} />
      <div className="px-5 space-y-4">
        {pois.length === 0 && (
          <div className="p-4 rounded-xl text-[13px]" style={{ background: "var(--surface)", color: "#475569", border: "0.5px solid #E2E8F0" }}>
            Detailed map data for {profile.city} is coming. In the meantime, try a Google Maps search below.
            <a href={googleMapsSearch(`gemeente ${profile.city}`)} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-[12px] font-medium" style={{ color: "var(--teal)" }}>
              Search "gemeente {profile.city}" <ExternalLink size={11} />
            </a>
          </div>
        )}

        {pois.length > 0 && (
          <>
            <div className="flex gap-1.5 overflow-x-auto -mx-5 px-5 pb-1">
              <FilterChip active={filter === "all"} onClick={() => setFilter("all")} label="All" emoji="📍" />
              {visibleCategories.map(c => (
                <FilterChip key={c.id} active={filter === c.id} onClick={() => setFilter(c.id)} label={c.label} emoji={c.emoji} />
              ))}
            </div>

            <div className="space-y-2.5">
              {filtered.map(p => (
                <POICard key={p.id} poi={p} open={openId === p.id} onToggle={() => setOpenId(openId === p.id ? null : p.id)} />
              ))}
              {filtered.length === 0 && (
                <div className="p-4 rounded-xl text-center text-[12.5px]" style={{ background: "var(--surface)", color: "#64748B" }}>
                  No {filter} locations saved for {profile.city} yet.
                </div>
              )}
            </div>
          </>
        )}

        <div>
          <h2 className="text-[13px] font-medium mb-2" style={{ color: "var(--navy)" }}>Quick links</h2>
          <div className="grid grid-cols-2 gap-2">
            {QUICK_LINKS.map(q => (
              <a
                key={q.id}
                href={q.url}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl flex items-center gap-2 text-[12.5px] font-medium transition-colors"
                style={{ border: "0.5px solid #E2E8F0", background: "white", color: "var(--navy)" }}
              >
                <span className="text-[16px]">{q.emoji}</span>
                <span className="flex-1">{q.label}</span>
                <ExternalLink size={11} style={{ color: "#94A3B8" }} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function FilterChip({ active, onClick, label, emoji }: { active: boolean; onClick: () => void; label: string; emoji: string }) {
  return (
    <button
      onClick={onClick}
      className="flex-shrink-0 px-3 py-1.5 rounded-full text-[12px] font-medium whitespace-nowrap transition-colors"
      style={{
        background: active ? "var(--teal)" : "white",
        color: active ? "white" : "#475569",
        border: `0.5px solid ${active ? "var(--teal)" : "#E2E8F0"}`,
      }}
    >
      <span className="mr-1">{emoji}</span>{label}
    </button>
  );
}

function POICard({ poi, open, onToggle }: { poi: POI; open: boolean; onToggle: () => void }) {
  const cat = POI_CATEGORIES.find(c => c.id === poi.category)!;
  const color = CAT_COLOR[poi.category];
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "0.5px solid #E2E8F0", background: "white" }}>
      <button onClick={onToggle} className="w-full text-left p-3.5 flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center text-[16px] flex-shrink-0" style={{ background: color.bg }}>
          {cat.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium" style={{ background: color.bg, color: color.fg }}>{cat.label}</span>
          </div>
          <h3 className="text-[13.5px] font-medium mt-1 leading-tight" style={{ color: "var(--navy)" }}>{poi.name}</h3>
          <p className="text-[11.5px] mt-0.5" style={{ color: "#64748B" }}>{poi.address}</p>
        </div>
        <ChevronDown size={16} style={{ color: "#94A3B8", transform: open ? "rotate(180deg)" : "none", transition: "transform 200ms" }} />
      </button>
      {open && (
        <div className="px-3.5 pb-3.5 pt-0 anim-fade-up">
          <p className="text-[12.5px] leading-relaxed mb-2.5" style={{ color: "#475569" }}>{poi.note}</p>
          <a
            href={googleMapsDirections(poi)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-medium"
            style={{ background: "var(--teal)", color: "white" }}
          >
            <MapPin size={12} /> Get directions <ExternalLink size={11} />
          </a>
        </div>
      )}
    </div>
  );
}
