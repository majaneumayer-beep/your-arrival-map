export type TrustLevel = "safe" | "verify" | "risky";

export type HousingPlatform = {
  id: string;
  name: string;
  url: string;
  trust: TrustLevel;
  description: string;
  bestFor: string;
  pros: string[];
  cons: string[];
};

export const HOUSING_PLATFORMS: HousingPlatform[] = [
  {
    id: "housinganywhere",
    name: "HousingAnywhere",
    url: "https://housinganywhere.com",
    trust: "safe",
    description: "International-friendly platform with secure payments and verified landlords.",
    bestFor: "Booking from abroad before arrival.",
    pros: ["Secure escrow payments", "Verified landlords", "English-first support", "Free cancellation window"],
    cons: ["Service fee (≈ 25% of first month)", "Limited long-term Dutch contracts"],
  },
  {
    id: "kamernet",
    name: "Kamernet",
    url: "https://kamernet.nl",
    trust: "verify",
    description: "Largest Dutch student & young-professional housing database.",
    bestFor: "Finding a room (kamer) once you're in NL.",
    pros: ["Huge listing volume", "Direct landlord contact", "Filters by gender, age, study"],
    cons: ["Paid subscription to message", "Verify each listing — scams exist", "Often requires viewing in person"],
  },
  {
    id: "pararius",
    name: "Pararius",
    url: "https://pararius.com",
    trust: "safe",
    description: "Professional real-estate agency listings, mostly entire apartments.",
    bestFor: "Workers and couples looking for full apartments.",
    pros: ["Agency-verified listings", "No platform fee for tenants", "English interface"],
    cons: ["Agency fees apply", "Competitive — apply within hours", "Income requirement (3–4× rent)"],
  },
  {
    id: "funda",
    name: "Funda",
    url: "https://funda.nl/huur",
    trust: "safe",
    description: "The standard Dutch real-estate portal — agency rentals and sales.",
    bestFor: "Long-term apartment hunting.",
    pros: ["Most complete market view", "Trusted agencies", "Detailed listings"],
    cons: ["Mostly Dutch interface", "Strict income checks", "Fast-moving market"],
  },
  {
    id: "facebook",
    name: "Facebook groups",
    url: "https://www.facebook.com/search/groups/?q=housing%20netherlands",
    trust: "risky",
    description: "Expat and Erasmus housing groups per city.",
    bestFor: "Last-minute rooms and sublets.",
    pros: ["Free", "Direct contact", "Subletters often flexible"],
    cons: ["High scam rate", "No protection", "Never pay before viewing"],
  },
];

export type Neighborhood = { name: string; vibe: string; priceBand: "€" | "€€" | "€€€" };

export type CityHousingInfo = {
  avgRoom: string;
  avgStudio: string;
  avgApartment: string;
  marketNote: string;
  neighborhoods: Neighborhood[];
};

export const CITY_HOUSING: Record<string, CityHousingInfo> = {
  Rotterdam: {
    avgRoom: "€550–750",
    avgStudio: "€900–1,200",
    avgApartment: "€1,300–1,800",
    marketNote: "Tighter than 2 years ago but still the most affordable big city. Decide within 24h.",
    neighborhoods: [
      { name: "Kralingen", vibe: "Student-heavy, near Erasmus campus, lakeside", priceBand: "€€" },
      { name: "Noord", vibe: "Young creatives, hip cafés, fast-changing", priceBand: "€€" },
      { name: "Centrum", vibe: "Modern high-rises, walkable, nightlife", priceBand: "€€€" },
      { name: "Delfshaven", vibe: "Historic harbour, diverse, quieter", priceBand: "€" },
    ],
  },
  Amsterdam: {
    avgRoom: "€800–1,100",
    avgStudio: "€1,400–1,800",
    avgApartment: "€2,000–2,800",
    marketNote: "The hardest market in NL. Apply within hours, expect 50+ competitors per listing.",
    neighborhoods: [
      { name: "De Pijp", vibe: "Trendy, café culture, young professionals", priceBand: "€€€" },
      { name: "Oost", vibe: "Diverse, foodie, well-connected", priceBand: "€€" },
      { name: "Noord", vibe: "Industrial-cool, ferry to centre, cheaper", priceBand: "€€" },
      { name: "Nieuw-West", vibe: "Family-friendly, more space, longer commute", priceBand: "€" },
    ],
  },
  Utrecht: {
    avgRoom: "€600–850",
    avgStudio: "€1,000–1,400",
    avgApartment: "€1,500–2,100",
    marketNote: "Compact city, very competitive near the centre. Move fast.",
    neighborhoods: [
      { name: "Binnenstad", vibe: "Canal-side, walkable, students everywhere", priceBand: "€€€" },
      { name: "Lombok", vibe: "Multicultural, food markets, hip", priceBand: "€€" },
      { name: "Utrecht Science Park", vibe: "On-campus, dorm-style, quiet", priceBand: "€€" },
      { name: "Overvecht", vibe: "Affordable, further out, metro connected", priceBand: "€" },
    ],
  },
  "Den Haag": {
    avgRoom: "€650–900",
    avgStudio: "€1,100–1,500",
    avgApartment: "€1,600–2,200",
    marketNote: "Strong expat/diplomatic market. International landlords common.",
    neighborhoods: [
      { name: "Statenkwartier", vibe: "Elegant, embassy area, families", priceBand: "€€€" },
      { name: "Centrum", vibe: "Lively, students, public transport", priceBand: "€€" },
      { name: "Scheveningen", vibe: "Beach life, seasonal vibe", priceBand: "€€" },
      { name: "Laak", vibe: "Affordable, diverse, near Hollands Spoor", priceBand: "€" },
    ],
  },
  Groningen: {
    avgRoom: "€400–600",
    avgStudio: "€700–950",
    avgApartment: "€1,000–1,400",
    marketNote: "Most affordable university city. Aug–Sept very tight.",
    neighborhoods: [
      { name: "Centrum", vibe: "Where everyone wants to live, very social", priceBand: "€€" },
      { name: "Korrewegwijk", vibe: "Student neighbourhood, cycling distance", priceBand: "€" },
      { name: "Helpman", vibe: "Quieter, leafy, popular with PhDs", priceBand: "€€" },
      { name: "Paddepoel", vibe: "Cheap, near Zernike campus", priceBand: "€" },
    ],
  },
  Eindhoven: {
    avgRoom: "€500–750",
    avgStudio: "€900–1,250",
    avgApartment: "€1,300–1,800",
    marketNote: "Tech/expat boom — supply tight, especially near TU/e and ASML.",
    neighborhoods: [
      { name: "Strijp", vibe: "Creative, lofts, young, walk to centre", priceBand: "€€" },
      { name: "Centrum", vibe: "Nightlife, students, compact", priceBand: "€€" },
      { name: "Woensel", vibe: "Family-friendly, affordable, north", priceBand: "€" },
      { name: "Tongelre", vibe: "Quiet, near campus, well-connected", priceBand: "€€" },
    ],
  },
  Wageningen: {
    avgRoom: "€450–650",
    avgStudio: "€750–1,000",
    avgApartment: "€1,100–1,500",
    marketNote: "Small town, WUR-driven. Apply via Idealis student housing first.",
    neighborhoods: [
      { name: "Centrum", vibe: "Walk to campus, small-town feel", priceBand: "€€" },
      { name: "Bornsesteeg", vibe: "Idealis student blocks, very social", priceBand: "€" },
      { name: "De Nude", vibe: "Quieter student streets, mixed", priceBand: "€" },
      { name: "Hoevestein", vibe: "Furthest Idealis complex, cheapest", priceBand: "€" },
    ],
  },
};

export const SCAM_RED_FLAGS: { flag: string; why: string }[] = [
  { flag: "Asked to wire money before viewing", why: "Real landlords always allow a viewing first — in person or video." },
  { flag: "Price is well below market", why: "Scammers bait with €450 Amsterdam studios. If it feels too good, it is." },
  { flag: "Landlord claims to be abroad", why: "Classic scam pattern — 'I'm in the UK, send deposit and I'll mail keys'." },
  { flag: "No written rental contract", why: "A contract is legally required. No paper = no protection." },
  { flag: "Refuses BRP / gemeente registration at the address", why: "You can't get a BSN without registering. This is a hard dealbreaker." },
  { flag: "Pressure to decide in minutes", why: "Urgency is a manipulation tactic. Walk away and verify." },
  { flag: "Pays only via crypto / Western Union / gift cards", why: "Untraceable payments = irreversible. Use bank transfer with IBAN only." },
];

export function checkListingForRedFlags(text: string): { flag: string; why: string }[] {
  const lower = text.toLowerCase();
  const hits: { flag: string; why: string }[] = [];
  if (/wire|western union|moneygram|gift card|crypto|bitcoin/.test(lower)) hits.push(SCAM_RED_FLAGS[6]);
  if (/abroad|out of country|in the uk|in the us|overseas/.test(lower)) hits.push(SCAM_RED_FLAGS[2]);
  if (/no contract|without contract|verbal/.test(lower)) hits.push(SCAM_RED_FLAGS[3]);
  if (/no registration|no brp|no gemeente|cannot register/.test(lower)) hits.push(SCAM_RED_FLAGS[4]);
  if (/today only|right now|decide now|act fast/.test(lower)) hits.push(SCAM_RED_FLAGS[5]);
  if (/send (?:deposit|money) (?:first|before)/.test(lower)) hits.push(SCAM_RED_FLAGS[0]);
  return hits;
}
