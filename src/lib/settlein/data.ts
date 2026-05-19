// SettleIn domain data & helpers

export type Group = 1 | 2 | 3; // 1 EU, 2 special (TR/UK), 3 standard non-EU

export type Nationality = {
  adjective: string;
  flag: string;
  country: string;
  group: Group;
  tbExempt: boolean;
};

// Adjective form per spec — never country name.
export const NATIONALITIES: Nationality[] = [
  // Group 1 - EU/EEA/CH
  { adjective: "Hungarian", flag: "🇭🇺", country: "Hungary", group: 1, tbExempt: true },
  { adjective: "German", flag: "🇩🇪", country: "Germany", group: 1, tbExempt: true },
  { adjective: "French", flag: "🇫🇷", country: "France", group: 1, tbExempt: true },
  { adjective: "Polish", flag: "🇵🇱", country: "Poland", group: 1, tbExempt: true },
  { adjective: "Romanian", flag: "🇷🇴", country: "Romania", group: 1, tbExempt: true },
  { adjective: "Italian", flag: "🇮🇹", country: "Italy", group: 1, tbExempt: true },
  { adjective: "Spanish", flag: "🇪🇸", country: "Spain", group: 1, tbExempt: true },
  { adjective: "Bulgarian", flag: "🇧🇬", country: "Bulgaria", group: 1, tbExempt: true },
  { adjective: "Czech", flag: "🇨🇿", country: "Czechia", group: 1, tbExempt: true },
  { adjective: "Slovak", flag: "🇸🇰", country: "Slovakia", group: 1, tbExempt: true },
  { adjective: "Austrian", flag: "🇦🇹", country: "Austria", group: 1, tbExempt: true },
  { adjective: "Belgian", flag: "🇧🇪", country: "Belgium", group: 1, tbExempt: true },
  { adjective: "Danish", flag: "🇩🇰", country: "Denmark", group: 1, tbExempt: true },
  { adjective: "Finnish", flag: "🇫🇮", country: "Finland", group: 1, tbExempt: true },
  { adjective: "Greek", flag: "🇬🇷", country: "Greece", group: 1, tbExempt: true },
  { adjective: "Swedish", flag: "🇸🇪", country: "Sweden", group: 1, tbExempt: true },
  { adjective: "Portuguese", flag: "🇵🇹", country: "Portugal", group: 1, tbExempt: true },
  { adjective: "Irish", flag: "🇮🇪", country: "Ireland", group: 1, tbExempt: true },
  { adjective: "Norwegian", flag: "🇳🇴", country: "Norway", group: 1, tbExempt: true },
  { adjective: "Swiss", flag: "🇨🇭", country: "Switzerland", group: 1, tbExempt: true },
  { adjective: "Dutch", flag: "🇳🇱", country: "Netherlands", group: 1, tbExempt: true },
  { adjective: "Estonian", flag: "🇪🇪", country: "Estonia", group: 1, tbExempt: true },
  { adjective: "Latvian", flag: "🇱🇻", country: "Latvia", group: 1, tbExempt: true },
  { adjective: "Lithuanian", flag: "🇱🇹", country: "Lithuania", group: 1, tbExempt: true },
  { adjective: "Slovenian", flag: "🇸🇮", country: "Slovenia", group: 1, tbExempt: true },
  { adjective: "Croatian", flag: "🇭🇷", country: "Croatia", group: 1, tbExempt: true },
  { adjective: "Maltese", flag: "🇲🇹", country: "Malta", group: 1, tbExempt: true },
  { adjective: "Cypriot", flag: "🇨🇾", country: "Cyprus", group: 1, tbExempt: true },
  { adjective: "Luxembourgish", flag: "🇱🇺", country: "Luxembourg", group: 1, tbExempt: true },
  { adjective: "Icelandic", flag: "🇮🇸", country: "Iceland", group: 1, tbExempt: true },
  { adjective: "Liechtensteiner", flag: "🇱🇮", country: "Liechtenstein", group: 1, tbExempt: true },
  // Group 2
  { adjective: "Turkish", flag: "🇹🇷", country: "Turkey", group: 2, tbExempt: true },
  { adjective: "British", flag: "🇬🇧", country: "United Kingdom", group: 2, tbExempt: true },
  // Group 3
  { adjective: "Brazilian", flag: "🇧🇷", country: "Brazil", group: 3, tbExempt: false },
  { adjective: "Indian", flag: "🇮🇳", country: "India", group: 3, tbExempt: false },
  { adjective: "Moroccan", flag: "🇲🇦", country: "Morocco", group: 3, tbExempt: false },
  { adjective: "Indonesian", flag: "🇮🇩", country: "Indonesia", group: 3, tbExempt: false },
  { adjective: "American", flag: "🇺🇸", country: "United States", group: 3, tbExempt: true },
  { adjective: "Canadian", flag: "🇨🇦", country: "Canada", group: 3, tbExempt: true },
  { adjective: "Australian", flag: "🇦🇺", country: "Australia", group: 3, tbExempt: true },
  { adjective: "South African", flag: "🇿🇦", country: "South Africa", group: 3, tbExempt: false },
  { adjective: "Japanese", flag: "🇯🇵", country: "Japan", group: 3, tbExempt: true },
  { adjective: "Mexican", flag: "🇲🇽", country: "Mexico", group: 3, tbExempt: false },
  { adjective: "Colombian", flag: "🇨🇴", country: "Colombia", group: 3, tbExempt: false },
  { adjective: "Peruvian", flag: "🇵🇪", country: "Peru", group: 3, tbExempt: false },
  { adjective: "Nigerian", flag: "🇳🇬", country: "Nigeria", group: 3, tbExempt: false },
  { adjective: "Chinese", flag: "🇨🇳", country: "China", group: 3, tbExempt: true },
  { adjective: "Korean", flag: "🇰🇷", country: "South Korea", group: 3, tbExempt: false },
  { adjective: "Russian", flag: "🇷🇺", country: "Russia", group: 3, tbExempt: true },
  { adjective: "Argentine", flag: "🇦🇷", country: "Argentina", group: 3, tbExempt: false },
  { adjective: "Chilean", flag: "🇨🇱", country: "Chile", group: 3, tbExempt: false },
  { adjective: "Egyptian", flag: "🇪🇬", country: "Egypt", group: 3, tbExempt: false },
  { adjective: "Kenyan", flag: "🇰🇪", country: "Kenya", group: 3, tbExempt: false },
  { adjective: "Pakistani", flag: "🇵🇰", country: "Pakistan", group: 3, tbExempt: false },
  { adjective: "Filipino", flag: "🇵🇭", country: "Philippines", group: 3, tbExempt: false },
  { adjective: "Vietnamese", flag: "🇻🇳", country: "Vietnam", group: 3, tbExempt: false },
  { adjective: "Thai", flag: "🇹🇭", country: "Thailand", group: 3, tbExempt: false },
  { adjective: "Ukrainian", flag: "🇺🇦", country: "Ukraine", group: 3, tbExempt: true },
];

export type City = { name: string; waitWeeks?: string; note?: string };

export const CITIES: City[] = [
  { name: "Rotterdam", waitWeeks: "2–3 week wait" },
  { name: "Amsterdam", waitWeeks: "6–8 week wait — book before you leave" },
  { name: "Utrecht", waitWeeks: "3–4 week wait" },
  { name: "Den Haag", waitWeeks: "3–4 week wait" },
  { name: "Groningen", waitWeeks: "1–2 week wait" },
  { name: "Wageningen", waitWeeks: "1–2 week wait" },
  { name: "Eindhoven", waitWeeks: "3–4 week wait" },
  { name: "Delft" },
  { name: "Maastricht" },
  { name: "Leiden" },
  { name: "Tilburg" },
  { name: "Breda" },
  { name: "Nijmegen" },
  { name: "Enschede" },
  { name: "Haarlem" },
  { name: "Arnhem" },
  { name: "Zwolle" },
  { name: "Amersfoort" },
  { name: "Apeldoorn" },
  { name: "Den Bosch" },
  { name: "Leeuwarden" },
  { name: "Middelburg" },
  { name: "Almere" },
  { name: "Deventer" },
  { name: "Alkmaar" },
  { name: "Dordrecht" },
];

export type StayLength = "≤90 days" | "3–6 months" | "6–12 months" | ">1 year";
export type Purpose = "Full degree student" | "Exchange semester" | "Internship or traineeship" | "Starting a job";
export type Housing = "sorted" | "looking" | "university";

export type Profile = {
  name: string;
  nationality: Nationality;
  city: string;
  stay?: StayLength;
  arrivalISO: string; // YYYY-MM-DD
  purpose: Purpose;
  housing: Housing;
};

export type TaskDoc = { id: string; label: string; critical?: boolean };

export type Task = {
  id: number;
  title: string;
  detail: string;
  tag?: string;
  tagTone?: "teal" | "amber" | "red" | "green" | "grey";
  phase: string;
  phaseTone: "amber" | "red" | "yellow" | "green";
  deps?: number[];
  optional?: boolean;
  docs?: TaskDoc[];
};

const DOCS: Record<string, TaskDoc[]> = {
  housing: [
    { id: "id", label: "Valid passport or EU national ID", critical: true },
    { id: "income", label: "Proof of income or funding (contract, scholarship letter)" },
    { id: "deposit", label: "Funds for deposit (typically 1–2 months rent)" },
    { id: "reference", label: "Previous landlord reference (if requested)" },
  ],
  ehic: [
    { id: "id", label: "National ID from your home country", critical: true },
    { id: "insuranceNo", label: "Home health-insurance member number", critical: true },
  ],
  brpEU: [
    { id: "passport", label: "Valid passport or EU national ID", critical: true },
    { id: "birth", label: "Birth certificate (original, recent)", critical: true },
    { id: "rental", label: "Rental contract showing your NL address", critical: true },
    { id: "enrollment", label: "University enrollment letter or employer contract" },
    { id: "photos", label: "2 passport photos" },
  ],
  brpNonEU: [
    { id: "passport", label: "Valid passport with MVV / entry visa sticker", critical: true },
    { id: "birth", label: "Birth certificate — apostilled and translated", critical: true },
    { id: "rental", label: "Rental contract showing your NL address", critical: true },
    { id: "enrollment", label: "University enrollment letter or employer contract", critical: true },
    { id: "photos", label: "2 passport photos" },
  ],
  ind: [
    { id: "passport", label: "Valid passport", critical: true },
    { id: "indLetter", label: "IND confirmation letter (V-number)", critical: true },
    { id: "photos", label: "2 recent passport photos" },
    { id: "fee", label: "Card / iDEAL for permit fee" },
  ],
  digid: [
    { id: "bsn", label: "BSN number", critical: true },
    { id: "address", label: "Registered NL address on BRP", critical: true },
  ],
  bank: [
    { id: "bsn", label: "BSN number", critical: true },
    { id: "id", label: "Valid passport or EU ID", critical: true },
    { id: "address", label: "Proof of NL address (rental or BRP extract)", critical: true },
  ],
  insurance: [
    { id: "bsn", label: "BSN number", critical: true },
    { id: "id", label: "Valid passport or ID", critical: true },
    { id: "iban", label: "Dutch IBAN for direct debit" },
    { id: "startDate", label: "Confirmed NL arrival / start-work date", critical: true },
  ],
  tb: [
    { id: "passport", label: "Valid passport", critical: true },
    { id: "permit", label: "Residence permit or IND sticker", critical: true },
    { id: "indLetter", label: "IND TB referral form (Appendix TB)" },
  ],
  huisarts: [
    { id: "bsn", label: "BSN number", critical: true },
    { id: "insurance", label: "Health-insurance card (EHIC or Dutch policy)", critical: true },
    { id: "id", label: "Valid passport or ID" },
  ],
  belastingdienst: [
    { id: "bsn", label: "BSN number", critical: true },
    { id: "contract", label: "Signed employer contract", critical: true },
    { id: "iban", label: "Dutch IBAN for salary" },
  ],
};

export type Roadmap = {
  profile: Profile;
  tasks: Task[];
  noticeTone: "green" | "red";
  notice: string;
};

export function daysUntil(iso: string): number {
  const target = new Date(iso + "T00:00:00");
  const now = new Date();
  now.setHours(0,0,0,0);
  return Math.round((target.getTime() - now.getTime()) / 86_400_000);
}

export function countdownTone(days: number): "teal" | "amber" | "red" {
  if (days >= 60) return "teal";
  if (days >= 30) return "amber";
  return "red";
}

export function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export function formatDateShort(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function arrivalMinusDays(iso: string, n: number): string {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() - n);
  return formatDateShort(d.toISOString().slice(0, 10));
}

export function gemeenteWait(city: string): string {
  const c = CITIES.find(c => c.name === city);
  if (!c?.waitWeeks) return "2–4 weeks";
  return c.waitWeeks.replace(" — book before you leave","");
}

function tasksForEUStudent(profile: Profile): Task[] {
  const isRotterdam = profile.city === "Rotterdam";
  return [
    { id: 1, title: `Find housing in ${profile.city}`, detail: "You need a confirmed address first. Confirm landlord allows gemeente registration.", tag: "First ⚡", tagTone: "amber", phase: "Before arrival", phaseTone: "amber" },
    { id: 2, title: `Book ${profile.city} gemeente appointment`, detail: `${gemeenteWait(profile.city)} wait. ${isRotterdam ? "Book at rotterdam.nl before you fly — up to 4 weeks ahead. Choose Afspraak Eerste vestiging Studenten." : "Book online before you fly."}`, tag: "Book now", tagTone: "teal", phase: "Before arrival", phaseTone: "amber", deps: [1] },
    { id: 3, title: "Confirm Erasmus enrollment by Jul 15", detail: "Required before arrival for student services.", tag: "Jul 15", tagTone: "amber", phase: "Before arrival", phaseTone: "amber" },
    { id: 4, title: `Get EHIC card from ${profile.nationality.country}`, detail: "Free from your national health authority. Covers necessary medical treatment from day one. No Dutch health insurance needed until you start paid work.", tag: "Free — get before leaving", tagTone: "green", phase: "Before arrival", phaseTone: "amber" },
    { id: 5, title: `Register at ${profile.city} gemeente BRP`, detail: "Within 5 days of arrival — legally required. Fine up to €325 for late registration. BSN usually received at appointment.", tag: "Day 1–5", tagTone: "red", phase: "First week", phaseTone: "amber", deps: [1, 2] },
    { id: 6, title: "Apply for DigiD", detail: "At digid.nl after your BSN. Activation letter by post in 3–5 working days to registered address — cannot be forwarded.", tag: "After BSN", tagTone: "teal", phase: "First week", phaseTone: "amber", deps: [5] },
    { id: 7, title: "Open Dutch bank account", detail: "ING, ABN AMRO or Bunq. Bunq is fully digital — easiest for internationals. Needs BSN.", tag: "Needs BSN", tagTone: "teal", phase: "First month", phaseTone: "yellow", deps: [5] },
    { id: 8, title: "Dutch health insurance", detail: "Only needed when you start paid work. As a study-only student you CANNOT legally take out Dutch public health insurance — your EHIC covers you.", tag: "Optional — study only", tagTone: "grey", phase: "First month", phaseTone: "yellow", deps: [5], optional: true },
    { id: 9, title: "OV public transport — use OVpay", detail: "Tap your bank card or phone on any NL transport. Check OV-studentenkaart eligibility at duo.nl — most new arrivals don't qualify (need 5+ years NL residence or 56+ hours/month paid work).", tag: "No extra card needed", tagTone: "teal", phase: "First month", phaseTone: "yellow" },
    { id: 10, title: `Register with a huisarts (GP) in ${profile.city}`, detail: "Find one at huisartsenzoeken.nl. Bring your BSN.", tag: "Recommended", tagTone: "teal", phase: "First 3 months", phaseTone: "green", deps: [5] },
    { id: 11, title: "Check DUO eligibility at duo.nl", detail: "New arrivals almost never qualify immediately. Needs BSN + DigiD + Dutch bank + work/residence criteria. Always check — never assume.", tag: "Check first", tagTone: "amber", phase: "First 3 months", phaseTone: "green", deps: [6, 7] },
    { id: 12, title: "Apply for zorgtoeslag if eligible", detail: "Only if you have Dutch health insurance. Max €129/month in 2026. Income below €40,857/year. Needs BSN + DigiD + Dutch health insurance + Dutch bank. Can be backdated 3 months.", tag: "Up to €129/mo · optional", tagTone: "grey", phase: "First 3 months", phaseTone: "green", deps: [6, 7, 8], optional: true },
  ];
}

function tasksForEUWorker(profile: Profile): Task[] {
  const isRotterdam = profile.city === "Rotterdam";
  const isIntern = profile.purpose === "Internship or traineeship";
  return [
    { id: 1, title: `Find housing in ${profile.city}`, detail: "You need a confirmed address first. Confirm landlord allows gemeente registration.", tag: "First ⚡", tagTone: "amber", phase: "Before arrival", phaseTone: "amber" },
    { id: 2, title: `Book ${profile.city} gemeente appointment`, detail: `${gemeenteWait(profile.city)} wait. ${isRotterdam ? "Book at rotterdam.nl before you fly — up to 4 weeks ahead." : "Book online before you fly."}`, tag: "Book now", tagTone: "teal", phase: "Before arrival", phaseTone: "amber", deps: [1] },
    { id: 3, title: "Register employment with Belastingdienst", detail: `Your employer registers you for payroll tax. Confirm with HR that they've filed your details so your BSN links to wage tax (loonheffing) from day one.`, tag: isIntern ? "Via employer" : "Via employer", tagTone: "amber", phase: "Before arrival", phaseTone: "amber" },
    { id: 4, title: "Arrange Dutch health insurance (mandatory when working)", detail: "Required within 4 months of starting paid work in NL — even as an EU citizen. Compare basisverzekering plans on zorgwijzer.nl (~€140/month). Fines apply for late enrollment.", tag: "Mandatory", tagTone: "red", phase: "Before arrival", phaseTone: "amber" },
    { id: 5, title: `Register at ${profile.city} gemeente BRP`, detail: "Within 5 days of arrival — legally required. Fine up to €325 for late registration. BSN usually received at appointment.", tag: "Day 1–5", tagTone: "red", phase: "First week", phaseTone: "amber", deps: [1, 2] },
    { id: 6, title: "Apply for DigiD", detail: "At digid.nl after your BSN. Activation letter by post in 3–5 working days to registered address — cannot be forwarded.", tag: "After BSN", tagTone: "teal", phase: "First week", phaseTone: "amber", deps: [5] },
    { id: 7, title: "Open Dutch bank account", detail: "ING, ABN AMRO or Bunq. Bunq is fully digital — easiest for internationals. Needed for salary payment. Share IBAN with employer HR.", tag: "Needs BSN", tagTone: "teal", phase: "First month", phaseTone: "yellow", deps: [5] },
    { id: 8, title: "Activate Dutch health insurance with BSN", detail: "Backdate policy to your arrival date. Bring BSN to your chosen insurer to finalize the basisverzekering.", tag: "Needs BSN", tagTone: "teal", phase: "First month", phaseTone: "yellow", deps: [5, 4] },
    { id: 9, title: "OV public transport — use OVpay", detail: "Tap your bank card or phone on any NL transport. No extra card needed.", tag: "No extra card needed", tagTone: "teal", phase: "First month", phaseTone: "yellow" },
    { id: 10, title: `Register with a huisarts (GP) in ${profile.city}`, detail: "Find one at huisartsenzoeken.nl. Bring your BSN.", tag: "Recommended", tagTone: "teal", phase: "First 3 months", phaseTone: "green", deps: [5] },
    { id: 11, title: "Apply for zorgtoeslag if eligible", detail: "Now that you have Dutch health insurance, apply via belastingdienst.nl. Max €129/month in 2026. Income below €40,857/year. Can be backdated 3 months.", tag: "Up to €129/mo · optional", tagTone: "grey", phase: "First 3 months", phaseTone: "green", deps: [6, 7, 8], optional: true },
    { id: 12, title: "Check 30% ruling eligibility", detail: "Highly skilled migrant tax benefit — your employer must apply within 4 months of your start date. Ask HR if you qualify.", tag: "Ask HR · optional", tagTone: "grey", phase: "First 3 months", phaseTone: "green", deps: [5], optional: true },
  ];
}

function tasksForNonEUStudent(profile: Profile): Task[] {
  const arrivalDeadline = arrivalMinusDays(profile.arrivalISO, 5);
  return [
    { id: 1, title: `Find housing in ${profile.city}`, detail: `Must have confirmed address by ${arrivalDeadline} — 5 days before arrival. Confirm landlord allows gemeente registration at the address.`, tag: "First ⚡", tagTone: "amber", phase: "Before arrival — do today", phaseTone: "red" },
    { id: 2, title: "University files entry visa (MVV) + residence permit at IND", detail: "Your university is your IND sponsor and files the application. Takes 2–4 weeks. Chase the international office now.", tag: "Today — critical 🔴", tagTone: "red", phase: "Before arrival — do today", phaseTone: "red" },
    { id: 3, title: "Get international health insurance", detail: "Required for the residence permit application. Must be active before arrival. As a study-only student you cannot take Dutch public insurance.", tag: "Required", tagTone: "red", phase: "Before arrival — do today", phaseTone: "red" },
    { id: 4, title: "Contact university international office for student registration days", detail: `${profile.city} regular gemeente wait is ${gemeenteWait(profile.city)}. Universities run special fast-track BRP days for new international students. Do NOT use regular gemeente.nl appointments.`, tag: "Today", tagTone: "amber", phase: "Before arrival — do today", phaseTone: "red", deps: [1] },
    { id: 5, title: `Register at ${profile.city} gemeente BRP`, detail: "Within 5 days of arrival — legally required. Fine up to €325. Use university special registration days when available.", tag: "Day 1–5", tagTone: "red", phase: "First week", phaseTone: "amber", deps: [1, 4] },
    { id: 6, title: "Collect residence permit from IND desk", detail: "Book IND appointment in advance. Bring passport + IND confirmation letter.", tag: "Pre-book IND", tagTone: "amber", phase: "First week", phaseTone: "amber", deps: [2] },
    { id: 7, title: "Apply for DigiD", detail: "At digid.nl after BSN. Activation letter by post in 3–5 working days — cannot be forwarded.", tag: "After BSN", tagTone: "teal", phase: "First week", phaseTone: "amber", deps: [5] },
    { id: 8, title: "Open Dutch bank account", detail: "Bunq recommended — fully digital, no branch visit needed. Needs BSN.", tag: "Needs BSN", tagTone: "teal", phase: "First month", phaseTone: "yellow", deps: [5] },
    { id: 9, title: "TB examination at GGD " + profile.city, detail: `Mandatory for ${profile.nationality.adjective} nationals within 3 months of receiving residence permit. Simple chest x-ray. Only done by GGD — never a private clinic. Skipping this can cancel your permit.`, tag: "Mandatory", tagTone: "red", phase: "Within 3 months of permit — mandatory", phaseTone: "red", deps: [6] },
    { id: 10, title: `Register with a huisarts (GP) in ${profile.city}`, detail: "Find one at huisartsenzoeken.nl.", tag: "Recommended", tagTone: "teal", phase: "Within 3 months of permit — mandatory", phaseTone: "red", deps: [5] },
  ];
}

function tasksForNonEUWorker(profile: Profile): Task[] {
  const arrivalDeadline = arrivalMinusDays(profile.arrivalISO, 5);
  const isIntern = profile.purpose === "Internship or traineeship";
  const reg4Title = isIntern
    ? "Contact university international office (if applicable)"
    : `Book gemeente BRP appointment at ${profile.city}.nl`;
  const reg4Detail = isIntern
    ? `If connected to a university, contact their international office for fast-track registration days. Otherwise, book a regular gemeente appointment — ${profile.city} wait is ${gemeenteWait(profile.city)}.`
    : `Regular ${profile.city} gemeente wait is ${gemeenteWait(profile.city)}. Book online via the gemeente website before you fly so your slot lines up with the 5-day deadline.`;
  const reg5Detail = isIntern
    ? "Within 5 days of arrival — legally required. Fine up to €325. Use a university fast-track day if available, otherwise your booked gemeente appointment."
    : "Within 5 days of arrival — legally required. Fine up to €325. Use your pre-booked gemeente appointment.";
  return [
    { id: 1, title: `Find housing in ${profile.city}`, detail: `Must have confirmed address by ${arrivalDeadline} — 5 days before arrival. Confirm landlord allows gemeente registration at the address.`, tag: "First ⚡", tagTone: "amber", phase: "Before arrival — do today", phaseTone: "red" },
    { id: 2, title: "Employer files GVVA permit at IND — TODAY", detail: "Takes 5–7 weeks. You arrive soon. You cannot apply yourself — employer must do this. IND only communicates with employer. Chase them now.", tag: "Today — critical 🔴", tagTone: "red", phase: "Before arrival — do today", phaseTone: "red" },
    { id: 3, title: "Get international health insurance", detail: "Required for the GVVA permit application. Must be active before arrival.", tag: "Required", tagTone: "red", phase: "Before arrival — do today", phaseTone: "red" },
    { id: 4, title: reg4Title, detail: reg4Detail, tag: "Today", tagTone: "amber", phase: "Before arrival — do today", phaseTone: "red", deps: [1] },
    { id: 5, title: `Register at ${profile.city} gemeente BRP`, detail: reg5Detail, tag: "Day 1–5", tagTone: "red", phase: "First week", phaseTone: "amber", deps: [1, 4] },
    { id: 6, title: "Collect residence permit from IND desk", detail: "Book IND appointment in advance. Bring passport + IND confirmation letter.", tag: "Pre-book IND", tagTone: "amber", phase: "First week", phaseTone: "amber", deps: [2] },
    { id: 7, title: "Apply for DigiD", detail: "At digid.nl after BSN. Activation letter by post in 3–5 working days — cannot be forwarded.", tag: "After BSN", tagTone: "teal", phase: "First week", phaseTone: "amber", deps: [5] },
    { id: 8, title: "Open Dutch bank account", detail: "Bunq recommended — fully digital, no branch visit needed. Needs BSN.", tag: "Needs BSN", tagTone: "teal", phase: "First month", phaseTone: "yellow", deps: [5] },
    { id: 9, title: "Dutch health insurance", detail: isIntern
      ? "Required ONLY if internship allowance is at or above €14.71/hour (minimum wage 2026). If below, international insurance is sufficient. Check with your employer."
      : "Mandatory within 4 months of starting paid work. Compare basisverzekering plans on zorgwijzer.nl (~€140/month).", tag: isIntern ? "Check with employer · optional" : "Mandatory", tagTone: isIntern ? "grey" : "red", phase: "First month", phaseTone: "yellow", deps: [5], optional: isIntern },
    { id: 10, title: "Apply for zorgtoeslag if eligible", detail: "Only if you have Dutch health insurance. Max €129/month in 2026. Income below €40,857/year. Needs BSN + DigiD + Dutch health insurance + Dutch bank.", tag: "Up to €129/mo · optional", tagTone: "grey", phase: "First month", phaseTone: "yellow", deps: [7, 8, 9], optional: true },
    { id: 11, title: "TB examination at GGD " + profile.city, detail: `Mandatory for ${profile.nationality.adjective} nationals within 3 months of receiving residence permit. Simple chest x-ray. Only done by GGD — never a private clinic. Skipping this can cancel your permit.`, tag: "Mandatory", tagTone: "red", phase: "Within 3 months of permit — mandatory", phaseTone: "red", deps: [6] },
    { id: 12, title: `Register with a huisarts (GP) in ${profile.city}`, detail: "Find one at huisartsenzoeken.nl.", tag: "Recommended", tagTone: "teal", phase: "Within 3 months of permit — mandatory", phaseTone: "red", deps: [5] },
  ];
}

export function buildRoadmap(profile: Profile): Roadmap {
  const isEU = profile.nationality.group === 1;
  const isStudent = profile.purpose === "Full degree student" || profile.purpose === "Exchange semester";
  const tasks = isEU
    ? (isStudent ? tasksForEUStudent(profile) : tasksForEUWorker(profile))
    : (isStudent ? tasksForNonEUStudent(profile) : tasksForNonEUWorker(profile));

  return {
    profile,
    tasks,
    noticeTone: profile.nationality.tbExempt ? "green" : "red",
    notice: profile.nationality.tbExempt
      ? `No TB test required — ${profile.nationality.adjective} nationals are fully exempt (IND Appendix 7644).`
      : `TB examination mandatory — ${profile.nationality.adjective} nationals must complete a GGD chest x-ray within 3 months of receiving the residence permit. Only GGD, not private clinics. Skipping can cancel your permit.`,
  };
}

// Demo personas
function futureISO(days: number): string {
  const d = new Date();
  d.setHours(0,0,0,0);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export const PERSONA_MAJA: Profile = {
  name: "Maja",
  nationality: NATIONALITIES.find(n => n.adjective === "Hungarian")!,
  city: "Rotterdam",
  arrivalISO: futureISO(89),
  purpose: "Full degree student",
  housing: "looking",
};

export const PERSONA_VALENTINA: Profile = {
  name: "Valentina",
  nationality: NATIONALITIES.find(n => n.adjective === "Brazilian")!,
  city: "Amsterdam",
  stay: ">1 year",
  arrivalISO: futureISO(28),
  purpose: "Internship or traineeship",
  housing: "looking",
};

export const DEMO_CHAT_MAJA = [
  { role: "assistant" as const, content: "Hi Maja! 👋 You've got 89 days until Rotterdam — plenty of time. Rotterdam gemeente has only a 2–3 week wait, so you can book your BRP appointment about 4 weeks before you fly via rotterdam.nl (choose *Afspraak Eerste vestiging Studenten*).\n\nSince you're Hungarian and studying full-time, you don't need Dutch health insurance — your EHIC from Hungary covers you from day one.\n\n**Next step:** lock in housing first, then book that gemeente slot." },
  { role: "user" as const, content: "Do I need to apply for zorgtoeslag?" },
  { role: "assistant" as const, content: "Not yet. Zorgtoeslag only applies if you have a **Dutch health insurance policy** — and as a study-only EU student you can't legally take one out. Your EHIC is the right tool.\n\nIf you later start paid work (12+ hours/week), you'll need Dutch insurance and *then* zorgtoeslag becomes possible — up to €129/month in 2026 if your income is below €40,857.\n\n**Next step:** skip it for now, revisit if you take a side job." },
];

export const DEMO_CHAT_VALENTINA = [
  { role: "assistant" as const, content: "Hi Valentina ⚠️ — you've got **28 days** until Amsterdam. Two things are urgent:\n\n1. Your employer must file the **GVVA permit at IND today** — it takes 5–7 weeks and only the employer can submit it.\n2. Amsterdam gemeente wait is 6–8 weeks. Don't use gemeente.nl — contact your university's international office for a **special student registration day**.\n\n**Next step:** message your employer today to confirm the GVVA was filed, and email the university about registration days." },
  { role: "user" as const, content: "Do I need the TB test?" },
  { role: "assistant" as const, content: "Yes — as a **Brazilian national** the TB examination is mandatory within 3 months of receiving your residence permit. It's a simple chest x-ray done **only at GGD Amsterdam** — never a private clinic. Skipping it can cancel your permit.\n\nNo need to do anything before arrival.\n\n**Next step:** book your GGD appointment as soon as your IND permit is collected." },
];
