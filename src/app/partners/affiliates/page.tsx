import { CtaBand, FeatureGrid, InnerHero, Section } from "@/components/site/inner";

export default function PartnersAffiliatesPage() {
  return (
    <main className="bg-parchment">
      <InnerHero
        eyebrow="Partners · Affiliates"
        title="Earn for every builder you bring"
        sub="Share Freebuff with your audience and earn recurring revenue on every paid referral."
        primary={{ label: "Join the program", href: "/enterprise" }}
      />
      <Section eyebrow="How it works" title="Simple, transparent, rewarding">
        <FeatureGrid
          items={[
            { title: "Sign up free", desc: "Get your unique referral link in minutes." },
            { title: "Share your link", desc: "Videos, posts, courses — anywhere builders listen." },
            { title: "Earn recurring revenue", desc: "A cut of every paid plan, for as long as they build." },
            { title: "Track everything", desc: "Real-time dashboard for clicks, trials and payouts." },
          ]}
        />
      </Section>
      <CtaBand
        title="Ready to earn with Freebuff?"
        sub="Join hundreds of creators already earning from the building boom."
      />
    </main>
  );
}
