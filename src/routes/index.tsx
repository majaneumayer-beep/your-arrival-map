import { createFileRoute } from "@tanstack/react-router";
import SettleInApp from "@/components/SettleInApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SettleIn — Your personal relocation roadmap" },
      { name: "description", content: "Moving to the Netherlands? SettleIn builds your personal relocation roadmap in 2 minutes — BSN, DigiD, housing, permits." },
      { property: "og:title", content: "SettleIn — Don't just move. Arrive." },
      { property: "og:description", content: "Your personal relocation roadmap for the Netherlands in 2 minutes." },
    ],
  }),
  component: SettleInApp,
});
