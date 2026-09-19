import { platform } from "@/platform";
import { NextResponse } from "next/server";
import { PROVIDERS, getProvider, type AIProvider, type ChatMessage } from "@/lib/models";

type ChatRequest = {
  source: "ollama" | "remote" | "demo";
  baseUrl?: string;
  providerId?: string;
  apiKey?: string;
  model: string;
  messages: ChatMessage[];
};

const OLLAMA_URL = "http://localhost:11434/api/chat";
const ANTHROPIC_VERSION = "2023-06-01";
const TIMEOUT_MS = 180000;

/** Provider availability for the picker (reveals nothing secret). */
export async function GET() {
  return NextResponse.json({
    providers: PROVIDERS.map((p: AIProvider) => ({
      id: p.id,
      hasEnvKey: p.envKey ? Boolean(process.env[p.envKey]) : false,
    })),
  });
}

function missingKeyError(provider: AIProvider) {
  const envHint = provider.envKey ? ` or set ${provider.envKey} on the server` : "";
  return (
    `${provider.name} needs an API key. Paste yours in the model picker${envHint} ` +
    `(get one: ${provider.keyUrl}).`
  );
}

async function callOpenAICompatible(baseUrl: string, apiKey: string, model: string, messages: ChatMessage[]) {
  const url = `${baseUrl.replace(/\/+$/, "")}/chat/completions`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model, messages, stream: false }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const err = data?.error?.message ?? data?.message ?? `HTTP ${res.status}`;
    throw new Error(`API error: ${err}`);
  }
  const content = data.choices?.[0]?.message?.content ?? "";
  if (!content) throw new Error("Empty response from provider");
  return { content, usage: data.usage ?? null };
}

async function callAnthropic(baseUrl: string, apiKey: string, model: string, messages: ChatMessage[]) {
  const url = `${baseUrl.replace(/\/+$/, "")}/messages`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": ANTHROPIC_VERSION,
    },
    body: JSON.stringify({ model, max_tokens: 4096, messages }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const err = data?.error?.message ?? data?.message ?? `HTTP ${res.status}`;
    throw new Error(`API error: ${err}`);
  }
  const content = Array.isArray(data.content)
    ? data.content
        .filter((b: { type?: string }) => b?.type === "text")
        .map((b: { text?: string }) => b.text ?? "")
        .join("")
    : "";
  if (!content) throw new Error("Empty response from provider");
  return { content, usage: data.usage ?? null };
}

export async function POST(request: Request) {
  let body: ChatRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.model || !Array.isArray(body.messages)) {
    return NextResponse.json({ error: "Missing model or messages" }, { status: 400 });
  }

  try {
      // Local builder brain when no provider key / Ollama is available
  if (body.source === "demo") {
    const lastUser = [...body.messages].reverse().find((m) => m.role === "user")?.content ?? "";
    const { demoAssistantReply, buildPreviewHtml } = await import("@/lib/store");
    const content = demoAssistantReply(lastUser, "your project");
    const previewHtml = buildPreviewHtml(lastUser);
    return NextResponse.json({ content, previewHtml, demo: true });
  }
if (body.source === "ollama") {
      let res: Response;
      try {
        res = await fetch(OLLAMA_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ model: body.model, messages: body.messages, stream: false }),
          signal: AbortSignal.timeout(TIMEOUT_MS),
        });
      } catch {
        return NextResponse.json(
          {
            error:
              "Cannot reach Ollama on localhost:11434. Start it with `ollama serve`, then pick an installed model.",
          },
          { status: 502 },
        );
      }
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        const err = data?.error ?? `Ollama returned HTTP ${res.status}`;
        return NextResponse.json({ error: `Ollama: ${err}` }, { status: 502 });
      }
      const content = data.message?.content ?? "";
      return NextResponse.json({ content });
    }

    const provider = body.providerId ? getProvider(body.providerId) : undefined;
    const baseUrl = provider && !body.baseUrl ? provider.baseUrl : body.baseUrl;
    if (!baseUrl) {
      return NextResponse.json({ error: "Missing base URL for provider." }, { status: 400 });
    }

    const apiKey =
      body.apiKey?.trim() || (provider?.envKey ? process.env[provider.envKey] : undefined);
    if (!apiKey) {
      return NextResponse.json(
        { error: provider ? missingKeyError(provider) : "This provider needs an API key." },
        { status: 400 },
      );
    }

    const protocol = provider?.protocol ?? "openai";
    const result =
      protocol === "anthropic"
        ? await callAnthropic(baseUrl, apiKey, body.model, body.messages)
        : await callOpenAICompatible(baseUrl, apiKey, body.model, body.messages);
    return NextResponse.json(result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: msg.includes("abort") ? "Request timed out" : `Chat failed: ${msg}` },
      { status: 502 },
    );
  }
}
