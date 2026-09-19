import { CtaBand, FeatureGrid, InnerHero, Section } from "@/components/site/inner";

export default function PartnersSolutionPage() {
  return (
    <main className="bg-parchment">
      <InnerHero
        eyebrow="Partners · Solution"
        title="Build client work at agency speed"
        sub="Ship landing pages, web apps and MVPs for clients — with hosting, SSL and backends handled."
        primary={{ label: "Become a partner", href: "/enterprise" }}
        secondary={{ label: "Start building", href: "/new" }}
      />
      <Section eyebrow="Why agencies partner" title="Everything client work needs">
        <FeatureGrid
          items={[
            { title: "Ship client projects faster", desc: "From kickoff to launch link in days, not sprints." },
            { title: "Custom domains per client", desc: "Professional URLs with SSL handled automatically." },
            { title: "White-label delivery", desc: "Your brand front and center; hand over clean code." },
            { title: "Private projects", desc: "Client work stays private until launch day." },
            { title: "GitHub sync & export", desc: "Every project is real code your devs can extend." },
            { title: "Priority support", desc: "A direct line when deadlines are tight." },
          ]}
        />
      </Section>
      <CtaBand
        title="Ready to ship for clients?"
        sub="Join the solution partner program and get listed, supported and rewarded."
      />
    </main>
  );
}
