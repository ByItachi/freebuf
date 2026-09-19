import { CtaBand, Faq, InnerHero, Section } from "@/components/site/inner";

const ICONS = ["google_mail", "google_calendar", "google_docs", "google_drive", "google_sheets", "google_slides"];

export default function ConnectPage() {
  return (
    <main className="bg-parchment">
      <InnerHero
        eyebrow="Integrations"
        title="Build from what you already use"
        sub="The Google Suite is live — plus your tools, your workflow, and everything you can build on top."
        primary={{ label: "Browse connectors", href: "/mcp" }}
        secondary={{ label: "Start building", href: "/new" }}
      />
      <Section eyebrow="Live now" title="The Google Suite is live">
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
          {ICONS.map((n) => (
            <div key={n} className="flex flex-col items-center gap-2 rounded-2xl border border-black/10 bg-white p-4">
              <img
                src={`https://lovable.dev/cdn-cgi/image/width=160,f=auto,fit=scale-down/https://assets.lovable.dev/img/connectors/${n}.svg`}
                alt={n.replace(/_/g, " ")}
                loading="lazy"
                className="h-10 w-10"
              />
              <span className="text-xs capitalize text-steel">{n.replace("google_", "").replace(/_/g, " ")}</span>
            </div>
          ))}
        </div>
      </Section>
      <Section eyebrow="Possibilities" title="What you can build">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { title: "Your tools, your workflow", desc: "Build from Gmail, Sheets, Drive and Calendar data." },
            { title: "Bring your stack", desc: "Ship the tool on top of the systems you already pay for." },
            { title: "Browse every connector", desc: "Dozens of integrations — databases, payments, comms and more." },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-black/10 bg-white p-5">
              <h3 className="font-medium text-charcoal">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-steel">{f.desc}</p>
            </div>
          ))}
        </div>
      </Section>
      <Section narrow eyebrow="FAQ" title="Frequently asked questions">
        <Faq
          items={[
            { q: "Which tools connect?", a: "Google Workspace today, plus databases, Stripe, GitHub and dozens more via connectors and MCP." },
            { q: "Is my data safe?", a: "Connections use scoped OAuth; business data never trains models." },
            { q: "Can I build on connected data?", a: "Yes — describe the tool and the agent queries your live data." },
          ]}
        />
      </Section>
      <CtaBand title="Bring your stack. Ship the tool." sub="Connect in minutes, build in hours." />
    </main>
  );
}
