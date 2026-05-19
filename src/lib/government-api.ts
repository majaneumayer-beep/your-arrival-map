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
    bookingUrl: "https://ind.nl/en/contact/appointment",
    cost: "€210–€350 depending on permit type",
    timing: "Application usually starts before arrival via your sponsor (employer / university).",
  },
  {
    id: "ggd",
    name: "GGD — Public Health Service",
    shortName: "GGD",
    what: "Tuberculosis (TB) screening and public vaccinations.",
    who: "Non-EU citizens from countries on the IND TB list.",
    url: "https://www.ggd.nl/",
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
    url: "https://www.belastingdienst.nl/wps/wcm/connect/en/individuals",
    cost: "Free",
    timing: "Allowance applications anytime after BSN; tax filing by 1 May annually.",
  },
];

export const QUICK_LINKS: { id: string; label: string; url: string; emoji: string }[] = [
  { id: "ind-appt", label: "Book IND appointment", url: "https://ind.nl/en/contact/appointment", emoji: "🛂" },
  { id: "digid", label: "Apply for DigiD", url: "https://www.digid.nl/en/apply-or-activate-digid", emoji: "🔐" },
  { id: "duo-ov", label: "DUO student OV", url: "https://duo.nl/particulier/student-finance/student-travel-product.jsp", emoji: "🚊" },
  { id: "zorgtoeslag", label: "Healthcare allowance", url: "https://www.belastingdienst.nl/wps/wcm/connect/en/benefits/", emoji: "💊" },
  { id: "30ruling", label: "30% ruling info", url: "https://www.belastingdienst.nl/wps/wcm/connect/bldcontenten/belastingdienst/individuals/working_in_the_netherlands_temporarily/30_facility_for_incoming_employees/", emoji: "💼" },
  { id: "ns", label: "NS train tickets", url: "https://www.ns.nl/en", emoji: "🚆" },
];
