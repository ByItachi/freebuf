import type { Result } from "../types";

export type ModelRoute = {
  id: string;
  provider: string;
  model: string;
  tier: "free" | "paid" | "local" | "demo";
  maxTokens: number;
};

const routes: ModelRoute[] = [
  { id: "demo", provider: "manus", model: "manus-builder", tier: "demo", maxTokens: 4096 },
  { id: "ollama-default", provider: "ollama", model: "llama3.2", tier: "local", maxTokens: 8192 },
  { id: "openai-mini", provider: "openai", model: "gpt-4.1-mini", tier: "paid", maxTokens: 16384 },
  { id: "groq-fast", provider: "groq", model: "llama-3.3-70b-versatile", tier: "free", maxTokens: 8192 },
];

export const aiGateway = {
  listRoutes() {
    return routes;
  },
  pick(preferred?: string): ModelRoute {
    if (preferred) {
      const hit = routes.find((r) => r.id === preferred || r.model === preferred);
      if (hit) return hit;
    }
    return routes[0];
  },
  estimateTokens(text: string) {
    return Math.ceil(text.length / 4);
  },
  async embed(text: string): Promise<Result<number[]>> {
    // deterministic pseudo-embedding for local RAG demos
    const dim = 32;
    const out = new Array<number>(dim).fill(0);
    for (let i = 0; i < text.length; i++) out[i % dim] += (text.charCodeAt(i) % 31) / 31;
    const norm = Math.sqrt(out.reduce((s, v) => s + v * v, 0)) || 1;
    return { ok: true, data: out.map((v) => v / norm) };
  },
};