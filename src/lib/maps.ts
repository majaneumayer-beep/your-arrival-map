export type POICategory = "gemeente" | "ind" | "ggd" | "university" | "transport" | "social";

export type POI = {
  id: string;
  name: string;
  category: POICategory;
  address: string;
  lat: number;
  lng: number;
  note: string;
};

export const POI_CATEGORIES: { id: POICategory; label: string; emoji: string }[] = [
  { id: "gemeente", label: "Gemeente", emoji: "🏛️" },
  { id: "ind", label: "IND", emoji: "🛂" },
  { id: "ggd", label: "GGD", emoji: "🏥" },
  { id: "university", label: "University", emoji: "🎓" },
  { id: "transport", label: "Transport", emoji: "🚉" },
  { id: "social", label: "Social", emoji: "☕" },
];

export const CITY_POIS: Record<string, POI[]> = {
  Rotterdam: [
    { id: "rtm-gem", name: "Gemeente Rotterdam — Stadswinkel Centrum", category: "gemeente", address: "Coolsingel 40, 3011 AD Rotterdam", lat: 51.9225, lng: 4.4792, note: "BSN registration. Book online at rotterdam.nl. 2–3 week wait." },
    { id: "rtm-ind", name: "IND Loket Rotterdam", category: "ind", address: "Stationsplein 49, 3013 AK Rotterdam", lat: 51.9244, lng: 4.4691, note: "Residence permit pickup. Appointment only via ind.nl." },
    { id: "rtm-ggd", name: "GGD Rotterdam-Rijnmond", category: "ggd", address: "Schiedamsedijk 95, 3011 EN Rotterdam", lat: 51.9148, lng: 4.4823, note: "TB test for non-EU. Mandatory within 3 months." },
    { id: "rtm-uni", name: "Erasmus University Rotterdam", category: "university", address: "Burgemeester Oudlaan 50, 3062 PA Rotterdam", lat: 51.9176, lng: 4.5269, note: "Erasmus Student Service Centre handles registration days." },
    { id: "rtm-cs", name: "Rotterdam Centraal", category: "transport", address: "Stationsplein 1, 3013 AJ Rotterdam", lat: 51.9249, lng: 4.4690, note: "NS Service desk for OV-chipkaart and 40% student travel discount." },
    { id: "rtm-soc", name: "Markthal Rotterdam", category: "social", address: "Dominee Jan Scharpstraat 298, 3011 GZ Rotterdam", lat: 51.9201, lng: 4.4870, note: "Great first-week food hall and meeting spot." },
  ],
  Amsterdam: [
    { id: "ams-gem", name: "Stadsloket Centrum", category: "gemeente", address: "Amstel 1, 1011 PN Amsterdam", lat: 52.3676, lng: 4.9041, note: "BSN registration. 6–8 week wait — book before you leave. Students: use university special days." },
    { id: "ams-ind", name: "IND Loket Amsterdam", category: "ind", address: "Stationsplein 15, 1012 AB Amsterdam", lat: 52.3791, lng: 4.9003, note: "Residence permit collection. Appointment only." },
    { id: "ams-ggd", name: "GGD Amsterdam", category: "ggd", address: "Nieuwe Achtergracht 100, 1018 WT Amsterdam", lat: 52.3618, lng: 4.9097, note: "TB screening for non-EU residents." },
    { id: "ams-uni", name: "University of Amsterdam (UvA)", category: "university", address: "Spui 21, 1012 WX Amsterdam", lat: 52.3697, lng: 4.8901, note: "International Student Office: Roeterseiland Campus." },
    { id: "ams-cs", name: "Amsterdam Centraal", category: "transport", address: "Stationsplein, 1012 AB Amsterdam", lat: 52.3791, lng: 4.9003, note: "GVB and NS hub. Buy OV-chipkaart at the yellow machines." },
    { id: "ams-soc", name: "Vondelpark", category: "social", address: "Vondelpark 1, 1071 AA Amsterdam", lat: 52.3580, lng: 4.8686, note: "Free, central, where every newcomer meets people in summer." },
  ],
  Utrecht: [
    { id: "utr-gem", name: "Stadskantoor Utrecht", category: "gemeente", address: "Stadsplateau 1, 3521 AZ Utrecht", lat: 52.0890, lng: 5.1100, note: "BSN registration. 3–4 week wait. Book via utrecht.nl." },
    { id: "utr-ind", name: "IND Loket Utrecht", category: "ind", address: "Pahud de Mortangesdreef 75, 3562 AB Utrecht", lat: 52.1100, lng: 5.1410, note: "Residence permit pickup." },
    { id: "utr-ggd", name: "GGD regio Utrecht", category: "ggd", address: "De Dreef 5, 3706 BR Zeist", lat: 52.0890, lng: 5.2330, note: "TB test for non-EU. Free for permit holders." },
    { id: "utr-uni", name: "Utrecht University", category: "university", address: "Heidelberglaan 8, 3584 CS Utrecht", lat: 52.0855, lng: 5.1781, note: "International Office at Bestuursgebouw, Utrecht Science Park." },
    { id: "utr-cs", name: "Utrecht Centraal", category: "transport", address: "Stationshal 12, 3511 CE Utrecht", lat: 52.0894, lng: 5.1097, note: "Largest NS station in NL — connections to every city." },
    { id: "utr-soc", name: "Neude Square", category: "social", address: "Neude, 3512 AE Utrecht", lat: 52.0930, lng: 5.1200, note: "Central café square. Many language exchange meetups." },
  ],
  "Den Haag": [
    { id: "dh-gem", name: "Stadsdeelkantoor Centrum", category: "gemeente", address: "Spui 70, 2511 BT Den Haag", lat: 52.0780, lng: 4.3134, note: "BSN registration. 3–4 week wait. Book at denhaag.nl." },
    { id: "dh-ind", name: "IND Loket Den Haag", category: "ind", address: "Wijnhaven 26, 2511 GA Den Haag", lat: 52.0796, lng: 4.3162, note: "Residence permit pickup." },
    { id: "dh-ggd", name: "GGD Haaglanden", category: "ggd", address: "Westeinde 128, 2512 HE Den Haag", lat: 52.0758, lng: 4.3030, note: "TB screening for non-EU." },
    { id: "dh-uni", name: "Leiden University — Campus Den Haag", category: "university", address: "Schouwburgstraat 2, 2511 VA Den Haag", lat: 52.0791, lng: 4.3142, note: "International Office for The Hague programmes." },
    { id: "dh-cs", name: "Den Haag Centraal", category: "transport", address: "Koningin Julianaplein 10, 2595 AA Den Haag", lat: 52.0809, lng: 4.3247, note: "NS + HTM tram hub." },
    { id: "dh-soc", name: "Scheveningen Beach", category: "social", address: "Strandweg, 2586 JK Scheveningen", lat: 52.1100, lng: 4.2780, note: "Beach day with friends — Den Haag's biggest social spot." },
  ],
  Groningen: [
    { id: "gro-gem", name: "Gemeente Groningen — Loket", category: "gemeente", address: "Kreupelstraat 1, 9712 HW Groningen", lat: 53.2194, lng: 6.5665, note: "BSN registration. 1–2 week wait — fastest in NL." },
    { id: "gro-ind", name: "IND Loket Zwolle (serves Groningen)", category: "ind", address: "Dokter van Deenweg 1, 8025 BP Zwolle", lat: 52.5092, lng: 6.1010, note: "Nearest IND desk — book ahead." },
    { id: "gro-ggd", name: "GGD Groningen", category: "ggd", address: "Hanzeplein 120, 9713 GW Groningen", lat: 53.2196, lng: 6.5817, note: "TB test for non-EU." },
    { id: "gro-uni", name: "University of Groningen (RUG)", category: "university", address: "Broerstraat 5, 9712 CP Groningen", lat: 53.2192, lng: 6.5665, note: "Student Service Centre handles registration days." },
    { id: "gro-cs", name: "Groningen Centraal", category: "transport", address: "Stationsplein 1, 9726 AE Groningen", lat: 53.2106, lng: 6.5640, note: "OV-chipkaart sales and NS service desk." },
    { id: "gro-soc", name: "Vismarkt", category: "social", address: "Vismarkt, 9711 KS Groningen", lat: 53.2185, lng: 6.5660, note: "Central square — Tuesday & Saturday markets." },
  ],
  Eindhoven: [
    { id: "ehv-gem", name: "Inwonersplein Eindhoven", category: "gemeente", address: "Stadhuisplein 10, 5611 EM Eindhoven", lat: 51.4416, lng: 5.4719, note: "BSN registration. 3–4 week wait." },
    { id: "ehv-ind", name: "IND Loket Den Bosch (serves Eindhoven)", category: "ind", address: "Magistratenlaan 184, 5223 MA 's-Hertogenbosch", lat: 51.6921, lng: 5.2926, note: "Nearest IND desk to Eindhoven." },
    { id: "ehv-ggd", name: "GGD Brabant-Zuidoost", category: "ggd", address: "Clausplein 10, 5611 XP Eindhoven", lat: 51.4400, lng: 5.4780, note: "TB screening for non-EU residents." },
    { id: "ehv-uni", name: "TU Eindhoven (TU/e)", category: "university", address: "De Groene Loper 3, 5612 AE Eindhoven", lat: 51.4480, lng: 5.4900, note: "International Office in Atlas building." },
    { id: "ehv-cs", name: "Eindhoven Centraal", category: "transport", address: "Stationsplein 17, 5611 AC Eindhoven", lat: 51.4432, lng: 5.4794, note: "NS + bus hub. Airport bus 400/401 from here." },
    { id: "ehv-soc", name: "Strijp-S", category: "social", address: "Torenallee, 5617 BB Eindhoven", lat: 51.4470, lng: 5.4570, note: "Creative district — bars, food halls, weekend markets." },
  ],
  Wageningen: [
    { id: "wag-gem", name: "Gemeentehuis Wageningen", category: "gemeente", address: "Markt 22, 6701 CX Wageningen", lat: 51.9692, lng: 5.6630, note: "BSN registration. 1–2 week wait." },
    { id: "wag-ind", name: "IND Loket Den Bosch (serves Wageningen)", category: "ind", address: "Magistratenlaan 184, 5223 MA 's-Hertogenbosch", lat: 51.6921, lng: 5.2926, note: "Nearest IND desk." },
    { id: "wag-ggd", name: "GGD Gelderland-Midden", category: "ggd", address: "Eusebiusbuitensingel 43, 6828 HZ Arnhem", lat: 51.9820, lng: 5.9100, note: "TB test for non-EU — Arnhem office." },
    { id: "wag-uni", name: "Wageningen University (WUR)", category: "university", address: "Droevendaalsesteeg 4, 6708 PB Wageningen", lat: 51.9870, lng: 5.6630, note: "Student Service Centre at Forum building." },
    { id: "wag-cs", name: "Ede-Wageningen Station", category: "transport", address: "Stationsplein 1, 6711 PT Ede", lat: 52.0290, lng: 5.6660, note: "Nearest NS station — bus 88 to campus." },
    { id: "wag-soc", name: "Forum Library", category: "social", address: "Droevendaalsesteeg 2, 6708 PB Wageningen", lat: 51.9858, lng: 5.6634, note: "Where every WUR student meets — open late." },
  ],
};

export function googleMapsDirections(poi: POI): string {
  const q = encodeURIComponent(`${poi.name}, ${poi.address}`);
  return `https://www.google.com/maps/dir/?api=1&destination=${q}`;
}

export function googleMapsSearch(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
