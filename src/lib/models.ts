export type ChatMessage = { role: "user" | "assistant"; content: string };

export type ModelSelection = {
  /** "demo" = built-in offline builder brain (no provider needed). */
  source: "ollama" | "remote" | "demo";
  providerId?: string;
  model: string;
};

export type OllamaModel = {
  id: string;
  tag: string;
  size: string;
};

export type ProviderTier = "free" | "paid";
export type ProviderProtocol = "openai" | "anthropic";

export type ProviderModel = {
  id: string;
  label: string;
  /** Overrides the provider tier for this model (e.g. a paid model on a free-tier provider). */
  tier?: ProviderTier;
};

export type AIProvider = {
  id: string;
  name: string;
  baseUrl: string;
  keyUrl: string;
  note: string;
  tier: ProviderTier;
  /** Wire protocol. Defaults to "openai" (POST {baseUrl}/chat/completions). */
  protocol?: ProviderProtocol;
  /** Server-side env var holding the key. When set, no key needs to be pasted. */
  envKey?: string;
  models: ProviderModel[];
};

export const OLLAMA_MODELS: OllamaModel[] = [
  { id: "qwen3.8:latest", tag: "qwen3.8", size: "27B" },
  { id: "qwen3.6:latest", tag: "qwen3.6", size: "27B / 35B" },
  { id: "deepseek-v4-flash:latest", tag: "deepseek-v4-flash", size: "1M ctx" },
  { id: "glm-5.3-flash:latest", tag: "glm-5.3-flash", size: "18B active" },
  { id: "glm-5.3:latest", tag: "glm-5.3", size: "flagship" },
  { id: "granite4.2:latest", tag: "granite4.2", size: "3B / 8B / 30B" },
  { id: "ornith-1.5:latest", tag: "ornith-1.5", size: "9B / 35B / 397B" },
  { id: "kimi-k2.7-code:latest", tag: "kimi-k2.7-code", size: "coding" },
  { id: "nemotron-3.5-lightning:latest", tag: "nemotron-3.5-lightning", size: "30B MoE" },
  { id: "muse-glimmer:latest", tag: "muse-glimmer", size: "30B" },
  { id: "llama3.2:latest", tag: "llama3.2", size: "3B / 11B" },
  { id: "mistral-small3.1:latest", tag: "mistral-small3.1", size: "24B" },
];

export const PROVIDERS: AIProvider[] = [
  /* ---------------- Flagships (paid) ---------------- */
  {
    id: "openai",
    name: "OpenAI",
    baseUrl: "https://api.openai.com/v1",
    keyUrl: "https://platform.openai.com/api-keys",
    note: "Pay-as-you-go · GPT-5 family",
    tier: "paid",
    envKey: "OPENAI_API_KEY",
    models: [
      { id: "gpt-5.2", label: "GPT-5.2" },
      { id: "gpt-5.1", label: "GPT-5.1" },
      { id: "gpt-5-mini", label: "GPT-5 Mini" },
      { id: "gpt-4.1", label: "GPT-4.1" },
    ],
  },
  {
    id: "anthropic",
    name: "Anthropic",
    baseUrl: "https://api.anthropic.com/v1",
    keyUrl: "https://console.anthropic.com/settings/keys",
    note: "Pay-as-you-go · Claude family",
    tier: "paid",
    protocol: "anthropic",
    envKey: "ANTHROPIC_API_KEY",
    models: [
      { id: "claude-opus-4-5", label: "Claude Opus 4.5" },
      { id: "claude-sonnet-4-5", label: "Claude Sonnet 4.5" },
      { id: "claude-haiku-4-5", label: "Claude Haiku 4.5" },
    ],
  },
  {
    id: "xai",
    name: "xAI",
    baseUrl: "https://api.x.ai/v1",
    keyUrl: "https://console.x.ai/",
    note: "Pay-as-you-go · Grok family",
    tier: "paid",
    envKey: "XAI_API_KEY",
    models: [
      { id: "grok-4", label: "Grok 4" },
      { id: "grok-3-mini", label: "Grok 3 Mini" },
    ],
  },
  {
    id: "mistral",
    name: "Mistral",
    baseUrl: "https://api.mistral.ai/v1",
    keyUrl: "https://console.mistral.ai/api-keys",
    note: "La Plateforme · pay-as-you-go",
    tier: "paid",
    envKey: "MISTRAL_API_KEY",
    models: [
      { id: "mistral-large-latest", label: "Mistral Large" },
      { id: "mistral-medium-latest", label: "Mistral Medium" },
      { id: "mistral-small-latest", label: "Mistral Small" },
    ],
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    baseUrl: "https://api.deepseek.com/v1",
    keyUrl: "https://platform.deepseek.com/api_keys",
    note: "Very cheap · pay-as-you-go",
    tier: "paid",
    envKey: "DEEPSEEK_API_KEY",
    models: [
      { id: "deepseek-chat", label: "DeepSeek Chat" },
      { id: "deepseek-reasoner", label: "DeepSeek Reasoner" },
    ],
  },
  {
    id: "experiential",
    name: "Experiential",
    baseUrl: "https://api.experientiallabs.ai/v1",
    keyUrl: "https://api.experientiallabs.ai",
    note: "GPT-6 Astra · runs on your Experiential credits",
    tier: "paid",
    envKey: "EXPLABS_API_KEY",
    models: [{ id: "gpt-6-astra", label: "GPT-6 Astra" }],
  },
  /* ---------------- Free / free-tier APIs ---------------- */
  {
    id: "groq",
    name: "Groq",
    baseUrl: "https://api.groq.com/openai/v1",
    keyUrl: "https://console.groq.com/keys",
    note: "No credit card · 30 RPM",
    tier: "free",
    envKey: "GROQ_API_KEY",
    models: [
      { id: "qwen3.6-27b", label: "Qwen3.6 27B" },
      { id: "llama-3.3-70b-versatile", label: "Llama 3.3 70B" },
      { id: "minimax-m2.7", label: "MiniMax M2.7" },
    ],
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    baseUrl: "https://openrouter.ai/api/v1",
    keyUrl: "https://openrouter.ai/keys",
    note: "No card · 50 free req/day · any model ID works with your key",
    tier: "free",
    envKey: "OPENROUTER_API_KEY",
    models: [
      { id: "google/gemini-2.0-flash-001", label: "Gemini 2.0 Flash" },
      { id: "meta-llama/llama-3.3-70b-instruct", label: "Llama 3.3 70B" },
    ],
  },
  {
    id: "ollama-cloud",
    name: "Ollama Cloud",
    baseUrl: "https://ollama.com/v1",
    keyUrl: "https://ollama.com/cloud",
    note: "Free light tier",
    tier: "free",
    models: [
      { id: "gpt-oss-120b", label: "GPT-OSS 120B" },
      { id: "qwen3.5", label: "Qwen3.5" },
      { id: "deepseek-v4-flash", label: "DeepSeek V4 Flash" },
    ],
  },
  {
    id: "zai",
    name: "Z.AI (GLM)",
    baseUrl: "https://api.z.ai/api/paas/v4",
    keyUrl: "https://z.ai/",
    note: "GLM-4.5/4.7-Flash free forever",
    tier: "free",
    envKey: "ZAI_API_KEY",
    models: [
      { id: "glm-4.7-flash", label: "GLM-4.7-Flash" },
      { id: "glm-4.5-flash", label: "GLM-4.5-Flash" },
    ],
  },
  {
    id: "google",
    name: "Google AI Studio",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai",
    keyUrl: "https://aistudio.google.com/apikey",
    note: "Gemini free tier · same key unlocks paid quota",
    tier: "free",
    envKey: "GEMINI_API_KEY",
    models: [
      { id: "gemini-3.1-flash", label: "Gemini 3.1 Flash" },
      { id: "gemini-3.0-flash", label: "Gemini 3.0 Flash" },
      { id: "gemini-3.0-flash-lite", label: "Gemini 3.0 Flash-Lite" },
      { id: "gemini-3-pro", label: "Gemini 3 Pro", tier: "paid" },
    ],
  },
  {
    id: "huggingface",
    name: "Hugging Face",
    baseUrl: "https://router.huggingface.co/v1",
    keyUrl: "https://huggingface.co/settings/tokens",
    note: "300 req/hr",
    tier: "free",
    envKey: "HF_TOKEN",
    models: [
      { id: "meta-llama/Llama-3.2-3B-Instruct", label: "Llama 3.2 3B" },
      { id: "Qwen/Qwen2.5-72B-Instruct", label: "Qwen 2.5 72B" },
      { id: "google/gemma-2-9b-it", label: "Gemma 2 9B" },
    ],
  },
];

/** Back-compat alias (was: free-only list). */
export const FREE_PROVIDERS: AIProvider[] = PROVIDERS.filter((p) => p.tier === "free");
export type FreeProvider = AIProvider;

export function getProvider(id?: string) {
  return PROVIDERS.find((p) => p.id === id);
}

export function getOllamaModel(id: string) {
  return OLLAMA_MODELS.find((m) => m.id === id);
}

export function modelTier(provider: AIProvider, modelId: string): ProviderTier {
  return provider.models.find((m) => m.id === modelId)?.tier ?? provider.tier;
}
