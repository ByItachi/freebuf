import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import {
  getAIConfig,
  providerKeyFlags,
  setProviderKey,
  updateAIConfig,
} from "@/lib/admin-store";
import { PROVIDERS } from "@/lib/models";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  const [ai, envFlags, storedFlags] = await Promise.all([
    getAIConfig(),
    Promise.resolve(
      Object.fromEntries(PROVIDERS.map((p) => [p.id, Boolean(p.envKey && process.env[p.envKey])])),
    ),
    providerKeyFlags(),
  ]);
  return NextResponse.json({
    ai,
    envKeyFlags: envFlags,
    storedKeyFlags: storedFlags,
    providers: PROVIDERS.map((p) => ({ id: p.id, name: p.name, keyUrl: p.keyUrl })),
  });
}

type Body = {
  ai?: { defaultProviderId?: string | null; demoFallback?: boolean; allowOllama?: boolean; maxTokens?: number };
  providerId?: string;
  apiKey?: string | null;
};

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (body.ai) {
    const patch: Parameters<typeof updateAIConfig>[0] = {};
    if (body.ai.defaultProviderId !== undefined) patch.defaultProviderId = body.ai.defaultProviderId;
    if (typeof body.ai.demoFallback === "boolean") patch.demoFallback = body.ai.demoFallback;
    if (typeof body.ai.allowOllama === "boolean") patch.allowOllama = body.ai.allowOllama;
    if (typeof body.ai.maxTokens === "number") {
      patch.maxTokens = Math.min(32768, Math.max(256, Math.round(body.ai.maxTokens)));
    }
    await updateAIConfig(patch);
  }

  if (body.providerId) {
    if (!PROVIDERS.some((p) => p.id === body.providerId)) {
      return NextResponse.json({ error: "unknown provider" }, { status: 400 });
    }
    await setProviderKey(body.providerId, body.apiKey ? String(body.apiKey).trim() : null);
  }

  const [ai, storedKeyFlags] = await Promise.all([getAIConfig(), providerKeyFlags()]);
  return NextResponse.json({ ai, storedKeyFlags });
}
