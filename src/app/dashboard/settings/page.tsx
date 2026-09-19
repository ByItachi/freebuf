"use client";

import { useEffect, useState } from "react";

const PROVIDERS = [
  { id: "openai", label: "OpenAI", env: "OPENAI_API_KEY" },
  { id: "anthropic", label: "Anthropic", env: "ANTHROPIC_API_KEY" },
  { id: "groq", label: "Groq (free tier)", env: "GROQ_API_KEY" },
  { id: "openrouter", label: "OpenRouter", env: "OPENROUTER_API_KEY" },
  { id: "google", label: "Google Gemini", env: "GEMINI_API_KEY" },
];

export default function SettingsPage() {
  const [keys, setKeys] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("lovable.keys");
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration-safe localStorage read; lazy init would mismatch SSR
      if (raw) setKeys(JSON.parse(raw));
    } catch {}
  }, []);

  function save() {
    localStorage.setItem("lovable.keys", JSON.stringify(keys));
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10 tracking-tight">
      <h1 className="text-[32px] font-medium text-charcoal">AI settings</h1>
      <p className="mt-2 text-[15px] text-dim-gray">
        Paste a provider key to use real models. Without a key, Manus AI demo mode still builds previews.
      </p>
      <div className="mt-8 space-y-4">
        {PROVIDERS.map((p) => (
          <label key={p.id} className="block">
            <span className="text-[13px] font-medium text-charcoal">{p.label}</span>
            <input
              type="password"
              value={keys[p.id] ?? ""}
              onChange={(e) => setKeys((k) => ({ ...k, [p.id]: e.target.value }))}
              placeholder={p.env}
              className="mt-1.5 w-full rounded-xl border border-linen-border bg-warm-sand px-3 py-2.5 text-[14px] outline-none focus:border-charcoal/30"
            />
          </label>
        ))}
      </div>
      <button
        type="button"
        onClick={save}
        className="mt-6 rounded-full bg-[rgba(0,0,0,0.88)] px-4 py-2 text-[13px] text-parchment"
      >
        {saved ? "Saved" : "Save keys"}
      </button>
    </div>
  );
}