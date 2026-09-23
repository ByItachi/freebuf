import type { Metadata } from "next";
import { CtaBand, InnerHero, Section } from "@/components/site/inner";
import { FreebuffDownload } from "./freebuff-download";

export const metadata: Metadata = {
  title: "Download & CLI — Manus",
  description:
    "Manus desktop for Windows, macOS and Linux — plus the manus CLI with an interactive terminal REPL.",
};

export default function DownloadPage() {
  return (
    <main className="bg-parchment">
      <InnerHero
        eyebrow="Apps"
        title="Dream it. Build it. Ship it."
        sub="Manus Desktop for Windows, macOS and Linux — plus the manus CLI with an interactive REPL for your terminal workflow."
        primary={{ label: "Download for Windows", href: "/api/download/windows" }}
      />
      <section className="mx-auto max-w-6xl px-4 md:px-8">
        <FreebuffDownload />
      </section>

      <Section eyebrow="Terminal" title="manus CLI">
        <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-2 md:gap-12">
          <div className="rounded-2xl border border-linen-border bg-warm-sand/60 p-5">
            <p className="text-[13px] font-medium tracking-tight text-charcoal">
              Kurulum &amp; interaktif REPL
            </p>
            <pre className="mt-3 overflow-x-auto rounded-xl bg-charcoal p-4 text-[12.5px] leading-relaxed text-parchment">
              <code>{`$ npm i -g manus-cli
$ manus login --server http://localhost:3000
$ manus chat

  __  __
 |  \\/  |   _ __     ___   _ __    ___
  manus  · http://localhost:3000

available commands:
  /exit or Ctrl+C    stop or exit
  /regen             regenerate the last response
  /clear             clear the chat history
  /read <file>       attach a text file
  /projects          list workspace projects
  /new <prompt>      create a project and select it

you > merhaba
manus > Merhaba! Projen için ne yapabilirim?`}</code>
            </pre>
          </div>
          <div>
            <h3 className="text-2xl font-medium tracking-tight text-charcoal md:text-3xl">
              Agent&apos;ınla terminalde konuş
            </h3>
            <p className="mt-3 text-lg leading-snug text-charcoal/65">
              llama-cli esintili interaktif REPL: dosya ekleyin (<code className="rounded bg-black/[0.05] px-1 text-[0.85em]">/read</code>),
              proje oluşturun (<code className="rounded bg-black/[0.05] px-1 text-[0.85em]">/new</code>), yanıtları yeniden üretin
              (<code className="rounded bg-black/[0.05] px-1 text-[0.85em]">/regen</code>). Windows, macOS ve Linux&apos;ta Node.js 18+ ile çalışır.
            </p>
          </div>
        </div>
      </Section>
      <CtaBand />
    </main>
  );
}
