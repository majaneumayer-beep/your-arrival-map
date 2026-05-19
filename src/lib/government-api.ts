export type GovService = {
  id: string;
  name: string;
  shortName: string;
  what: string;
  who: string;
  url: string;
  bookingUrl?: string;
  cost: string;
  timing: string;
};

export const GOV_SERVICES: GovService[] = [
  {
    id: "gemeente",
    name: "Gemeente (City Hall) — BRP registration",
    shortName: "Gemeente",
    what: "Register your address and get your BSN (national ID number).",
    who: "Everyone staying > 4 months.",
    url: "https://www.government.nl/topics/personal-data/citizen-service-number-bsn",
    bookingUrl: "https://www.amsterdam.nl/en/civil-affairs/registration-non-dutch/",
    cost: "Free",
    timing: "Within 5 days of arrival. Book BEFORE you leave.",
  },
  {
    id: "digid",
    name: "DigiD — Digital identity",
    shortName: "DigiD",
    what: "The login you'll use for almost every Dutch government website.",
    who: "Everyone with a BSN.",
    url: "https://www.digid.nl/en",
    bookingUrl: "https://www.digid.nl/en/apply-or-activate/",
    cost: "Free",
    timing: "Apply right after you receive your BSN. Activation letter arrives in ~5 days.",
  },
  {
    id: "ind",
    name: "IND — Immigration and Naturalisation Service",
    shortName: "IND",
    what: "Residence permits, work permits, family reunification.",
    who: "Non-EU citizens.",
    url: "https://ind.nl/en",
    bookingUrl: "https://ind.nl/en/service-contact/make-an-appointment-with-the-ind",
    cost: "€210–€350 depending on permit type",
    timing: "Application usually starts before arrival via your sponsor (employer / university).",
  },
  {
    id: "ggd",
    name: "GGD — Public Health Service",
    shortName: "GGD",
    what: "Tuberculosis (TB) screening and public vaccinations.",
    who: "Non-EU citizens from countries on the IND TB list.",
    url: "https://www.ggdghor.nl/en",
    cost: "Free for permit holders",
    timing: "Within 3 months of receiving your residence permit.",
  },
  {
    id: "duo",
    name: "DUO — Education Executive Agency",
    shortName: "DUO",
    what: "Student loans, transport (OV) discount, diploma recognition.",
    who: "Students — EU and qualifying non-EU.",
    url: "https://duo.nl/particulier/international-student/",
    cost: "Free to apply; loan terms vary",
    timing: "Apply after BSN + DigiD. Working ≥56h/month qualifies EU students.",
  },
  {
    id: "belastingdienst",
    name: "Belastingdienst — Tax authority",
    shortName: "Belastingdienst",
    what: "Income tax, allowances (zorgtoeslag, huurtoeslag), 30% ruling.",
    who: "Anyone earning or paying rent in NL.",
    url: "https://www.belastingdienst.nl/wps/wcm/connect/en/individuals/individuals",
    cost: "Free",
    timing: "Allowance applications anytime after BSN; tax filing by 1 May annually.",
  },
];

export const QUICK_LINKS: { id: string; label: string; url: string; emoji: string }[] = [
  { id: "ind-appt",     label: "Book IND appointment",    url: "https://ind.nl/en/service-contact/make-an-appointment-with-the-ind", emoji: "🛂" },
  { id: "digid",        label: "Apply for DigiD",          url: "https://www.digid.nl/en/", emoji: "🔐" },
  { id: "duo-ov",       label: "DUO student OV card",      url: "https://duo.nl/particulier/geld-voor-school-en-studie/", emoji: "🚊" },
  { id: "zorgtoeslag",  label: "Zorgtoeslag (healthcare)", url: "https://www.belastingdienst.nl/wps/wcm/connect/nl/toeslagen/toeslagen", emoji: "💊" },
  { id: "30ruling",     label: "30% ruling info",          url: "https://www.belastingdienst.nl/wps/wcm/connect/nl/zoeken/zoeken?q=verzoek%20loonheffingen%20expatregeling%20(30%25-regeling)", emoji: "💼" },
  { id: "ns",           label: "NS train tickets",         url: "https://www.ns.nl/en", emoji: "🚆" },
  { id: "swapfiets",    label: "Swapfiets bike rental",    url: "https://swapfiets.nl/en", emoji: "🚲" },
];

// Universities per Dutch city — all institutions, not just Erasmus.
export const CITY_UNIVERSITIES: Record<string, string[]> = {
  Rotterdam: [
    "Erasmus University Rotterdam (EUR)",
    "Rotterdam University of Applied Sciences (Hogeschool Rotterdam)",
    "Codarts University of the Arts",
    "Willem de Kooning Academy",
  ],
  Amsterdam: [
    "University of Amsterdam (UvA)",
    "Vrije Universiteit Amsterdam (VU)",
    "Amsterdam University of Applied Sciences (HvA)",
    "Amsterdam University of the Arts (AHK)",
    "Inholland University of Applied Sciences",
  ],
  Utrecht: [
    "Utrecht University (UU)",
    "University of Applied Sciences Utrecht (HU)",
    "HKU University of the Arts Utrecht",
  ],
  "Den Haag": [
    "The Hague University of Applied Sciences (De Haagse Hogeschool)",
    "Leiden University — The Hague campus",
    "University of the Arts The Hague (KABK / Koninklijk Conservatorium)",
  ],
  Groningen: [
    "University of Groningen (RUG)",
    "Hanze University of Applied Sciences",
    "Minerva Art Academy",
  ],
  Eindhoven: [
    "Eindhoven University of Technology (TU/e)",
    "Fontys University of Applied Sciences",
    "Design Academy Eindhoven",
  ],
  Delft: [
    "Delft University of Technology (TU Delft)",
    "Inholland University of Applied Sciences — Delft",
  ],
  Wageningen: [
    "Wageningen University & Research (WUR)",
  ],
  Leiden: [
    "Leiden University",
    "Leiden University of Applied Sciences (De Haagse Hogeschool — Leiden)",
  ],
  Maastricht: [
    "Maastricht University (UM)",
    "Zuyd University of Applied Sciences",
    "Jan van Eyck Academie",
  ],
  Tilburg: [
    "Tilburg University",
    "Fontys University of Applied Sciences — Tilburg",
  ],
  Nijmegen: [
    "Radboud University",
    "HAN University of Applied Sciences",
    "ArtEZ University of the Arts — Arnhem/Nijmegen",
  ],
  Enschede: [
    "University of Twente (UT)",
    "Saxion University of Applied Sciences",
    "ArtEZ University of the Arts — Enschede",
  ],
  Arnhem: [
    "HAN University of Applied Sciences",
    "ArtEZ University of the Arts",
  ],
  Leeuwarden: [
    "NHL Stenden University of Applied Sciences",
    "Van Hall Larenstein University of Applied Sciences",
  ],
  Zwolle: [
    "Windesheim University of Applied Sciences",
    "NHL Stenden — Zwolle campus",
  ],
  Breda: [
    "Avans University of Applied Sciences",
    "NHTV Breda University of Applied Sciences (BUAS)",
  ],
  Amersfoort: [
    "University of Applied Sciences Utrecht (HU) — Amersfoort campus",
  ],
  Haarlem: [
    "Inholland University of Applied Sciences — Haarlem",
  ],
  "Den Bosch": [
    "Avans University of Applied Sciences — Den Bosch",
    "HKU University of the Arts — Den Bosch",
  ],
  Middelburg: [
    "Roosevelt University College (UCR)",
    "HZ University of Applied Sciences",
  ],
  Almere: [
    "Windesheim Flevoland University of Applied Sciences",
  ],
};
