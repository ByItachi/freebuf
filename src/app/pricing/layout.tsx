import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing | Lovable",
  description: "Start for free. Upgrade to get the capacity that exactly matches your team's needs.",
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
