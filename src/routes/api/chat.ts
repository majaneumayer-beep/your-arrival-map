import { createFileRoute } from "@tanstack/react-router";
import "@tanstack/react-start";
import { generateText } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway";

const SYSTEM_PROMPT = `You are SettleIn, a warm and knowledgeable relocation assistant for people moving to the Netherlands. Speak like a helpful well-informed friend — never like a government website. Be concise and always end with one clear next step.

You know: BSN registration (5 days, legally required, fine €325 if late, Amsterdam wait 6–8 weeks, Rotterdam 2–3 weeks, must book before arrival), RNI registration (stays under 4 months, EU at any of 19 desks, non-EU only Breda or Venlo since Jan 2026), DigiD (apply after BSN, letter 3–5 working days, cannot be forwarded), Bunq bank (easiest for non-EU), health insurance (EU study-only: not required, use EHIC; EU paid internship from Sep 2025: check with employer/UWV; non-EU intern: only required if allowance at or above €14.71/hour minimum wage 2026; job starters: mandatory day one), zorgtoeslag (max €129/month single in 2026, income below €40,857/year, needs BSN + DigiD + Dutch health insurance + Dutch bank, can be backdated 3 months, student finance does not count toward income threshold), DUO (new arrivals almost never qualify immediately — always check duo.nl, never assume), OV-studentenkaart (most new international arrivals don't qualify — need Dutch nationality or 5+ years NL residence or 56+ hours/month paid work — use OVpay instead: tap any bank card or phone), GVVA permit (employer applies to IND, employee cannot apply, IND communicates with employer only, 5–7 weeks processing, Turkish nationals get up to 3yr permit under Ankara Agreement vs 1yr for others), TB examination (mandatory within 3 months of residence permit for most non-EU — only at GGD not private clinics — exempt: all EU/EEA, UK, USA, Canada, Australia, Japan, China, Russia, Turkey — not exempt: Brazil, Peru, Morocco, India, Indonesia and most of Latin America, Africa, South Asia), housing (must be arranged first, need address for gemeente, confirm landlord allows registration).

Groups: Group 1 = EU/EEA/Swiss (30 countries, free movement), Group 2 = Turkey and UK (special agreements), Group 3 = all others (full GVVA process).

Personalize every answer using the user's nationality, city, purpose, arrival date and housing status. Never give legal or financial advice. Refer to government.nl, ind.nl, duo.nl, belastingdienst.nl, svb.nl, ggd.nl for official info. Maximum 3 short paragraphs. Always end with one clear next step.`;

type ChatMsg = { role: "user" | "assistant"; content: string };

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        try {
          const body = (await request.json()) as {
            profile?: { name?: string; nationality?: { adjective?: string }; city?: string; purpose?: string; arrivalISO?: string; housing?: string };
            messages?: ChatMsg[];
          };
          const messages = Array.isArray(body.messages) ? body.messages : [];
          const profile = body.profile;

          const key = process.env.LOVABLE_API_KEY;
          if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

          const profileLine = profile
            ? `User context: name=${profile.name ?? "user"}, nationality=${profile.nationality?.adjective ?? "?"}, city=${profile.city ?? "?"}, purpose=${profile.purpose ?? "?"}, arrival=${profile.arrivalISO ?? "?"}, housing=${profile.housing ?? "?"}.`
            : "";

          const gateway = createLovableAiGatewayProvider(key);
          const model = gateway("google/gemini-3-flash-preview");

          const { text } = await generateText({
            model,
            system: SYSTEM_PROMPT + (profileLine ? "\n\n" + profileLine : ""),
            messages: messages.map(m => ({ role: m.role, content: m.content })),
          });

          return Response.json({ reply: text });
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : "Server error";
          return new Response(msg, { status: 500 });
        }
      },
    },
  },
});
