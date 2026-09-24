"use client";

import { useState } from "react";
import {
  AdidasLogo,
  AsanaLogo,
  ElevenLabsLogo,
  NvidiaLogo,
  WorkdayLogo,
  ZendeskLogo,
} from "@/components/brand-logos";

const LOGOS = [
  { name: "Adidas", Logo: AdidasLogo },
  { name: "Asana", Logo: AsanaLogo },
  { name: "ElevenLabs", Logo: ElevenLabsLogo },
  { name: "Zendesk", Logo: ZendeskLogo },
  { name: "Workday", Logo: WorkdayLogo },
  { name: "Nvidia", Logo: NvidiaLogo },
];

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4 shrink-0" aria-hidden="true">
      <path d="M9.75 18c0 1.519-1.231 2.75-2.75 2.75S4.25 19.519 4.25 18V6C4.25 4.481 5.481 3.25 7 3.25S9.75 4.481 9.75 6v12Zm10 0c0 1.519-1.231 2.75-2.75 2.75S14.25 19.519 14.25 18V6c0-1.519 1.231-2.75 2.75-2.75S19.75 4.481 19.75 6v12Z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4 shrink-0" aria-hidden="true">
      <path d="M7.5 5.6v12.8a1 1 0 0 0 1.54.84l10.05-6.4a1 1 0 0 0 0-1.68L9.04 4.76A1 1 0 0 0 7.5 5.6Z" />
    </svg>
  );
}

/**
 * "Trusted by teams at leading companies" — infinite monochrome logo marquee
 * with edge mask fade and a pause/play control (freebuff.dev marketers page).
 */
export function TrustedBy() {
  const [paused, setPaused] = useState(false);

  return (
    <div className="mb-10 w-full py-5 text-charcoal/70">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <p className="sr-only">Trusted by teams at leading companies</p>
        <div className="flex w-full flex-col-reverse">
          <div className="mt-2 flex justify-end">
            <button
              type="button"
              onClick={() => setPaused((v) => !v)}
              aria-label={paused ? "Play animation" : "Pause animation"}
              aria-pressed={paused}
              className="flex size-7 items-center justify-center rounded-full text-dim-gray transition-colors hover:bg-black/[0.05] hover:text-charcoal"
            >
              {paused ? <PlayIcon /> : <PauseIcon />}
            </button>
          </div>
          <div className="flex w-full justify-center" aria-hidden="true">
            <div className="w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent_3%,black_17%,black_83%,transparent_97%)]">
              <div
                className={`flex w-max animate-marquee items-center gap-x-24 ${
                  paused ? "[animation-play-state:paused]" : ""
                }`}
              >
                {[...LOGOS, ...LOGOS].map(({ name, Logo }, i) => (
                  <Logo key={`${name}-${i}`} className="h-10 w-auto shrink-0" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
