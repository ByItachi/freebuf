import {
  Hero,
  PlatformPanel,
  LegacyAnchors,
  BuildingSection,
  Brands,
  Templates,
  Pricing,
  Cases,
  Stats,
  Reveal,
} from "@/components/site/sections";

export default function Home() {
  return (
    <>
      <main className="flex-1">
        <Hero />
        <Reveal>
          <PlatformPanel />
        </Reveal>
        <LegacyAnchors />
        <Reveal>
          <BuildingSection />
        </Reveal>
        <Reveal>
          <Templates />
        </Reveal>
        <Reveal>
          <Brands />
        </Reveal>
        <Reveal>
          <Cases />
        </Reveal>
        <Reveal>
          <Stats />
        </Reveal>
        <Reveal>
          <Pricing />
        </Reveal>
      </main>
    </>
  );
}
