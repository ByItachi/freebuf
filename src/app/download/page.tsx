import { CtaBand, InnerHero, Section } from "@/components/site/inner";
import { px } from "@/lib/img";

export default function DownloadPage() {
  return (
    <main className="bg-parchment">
      <InnerHero
        eyebrow="Apps"
        title="Dream it. Build it. Ship it."
        sub="Your best ideas. On the go — plus Figma to Lovable for your design workflow."
        primary={{ label: "Get the mobile app", href: "/new" }}
        secondary={{ label: "Figma to Lovable", href: "/new" }}
      />
      <section className="mx-auto max-w-6xl px-4 md:px-8">
        <div className="overflow-hidden rounded-3xl border border-black/10 shadow-sm">
          <img
            src={px("https://lovable.dev/cdn-cgi/image/width=2000,f=auto,fit=scale-down/https://assets.lovable.dev/img/download/downloads-desktop.webp")}
            alt="Lovable desktop app"
            loading="eager"
            decoding="async"
            className="aspect-[16/9] w-full object-cover"
          />
        </div>
      </section>

      <Section eyebrow="Design to product" title="Figma to Lovable">
        <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-2 md:gap-12">
          <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
            <img
              src={px("https://lovable.dev/cdn-cgi/image/width=1164,f=auto,fit=scale-down/img/download/figma-plugin-window.webp")}
              alt="Figma plugin window"
              loading="lazy"
              decoding="async"
              className="aspect-[4/3] w-full object-cover object-top"
            />
          </div>
          <div>
            <h3 className="text-2xl font-medium tracking-tight text-charcoal md:text-3xl">
              Send frames straight into a working project
            </h3>
            <p className="mt-3 text-lg leading-snug text-charcoal/65">
              Keep your design workflow. Import frames and get functional, responsive pages back —
              ready to refine with prompts.
            </p>
          </div>
        </div>
      </Section>
      <CtaBand />
    </main>
  );
}
