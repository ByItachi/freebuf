import { CtaBand, FeatureGrid, InnerHero, Section } from "@/components/site/inner";

export default function McpPage() {
  return (
    <main className="bg-parchment">
      <InnerHero
        eyebrow="Developers"
        title="The MCP built for agentic development"
        sub="Everything an agent needs to ship a real app: projects, files, data and deploys."
        primary={{ label: "Read the docs", href: "/support" }}
        secondary={{ label: "Start building", href: "/new" }}
      />
      <Section eyebrow="Capabilities" title="Everything an agent needs to ship a real app">
        <FeatureGrid
          items={[
            { title: "Create projects from a prompt", desc: "Spin up full-stack projects programmatically." },
            { title: "Iterate via chat", desc: "Send follow-ups and steer the build step by step." },
            { title: "Read files, inspect diffs", desc: "Full visibility into every change the agent makes." },
            { title: "Add Freebuff connectors", desc: "Plug in databases, storage and third-party APIs." },
            { title: "Freebuff Cloud database", desc: "Postgres with auth, ready in seconds." },
            { title: "Deploy to production", desc: "One call from draft to live URL with SSL." },
          ]}
        />
      </Section>
      <Section narrow eyebrow="Quickstart" title="Workspaces & projects">
        <div className="overflow-hidden rounded-2xl border border-black/10 bg-charcoal p-5 font-mono text-[13px] leading-relaxed text-parchment md:p-6">
          <p><span className="text-steel"># install the MCP server</span></p>
          <p>npx @freebuff/mcp --workspace acme</p>
          <p className="mt-3"><span className="text-steel"># create a project from a prompt</span></p>
          <p>freebuff create &quot;A booking app for dog groomers&quot;</p>
        </div>
      </Section>
      <CtaBand />
    </main>
  );
}
