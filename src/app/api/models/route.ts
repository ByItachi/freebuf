import { NextResponse } from "next/server";

export async function GET() {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 2000);
    const res = await fetch("http://localhost:11434/api/tags", {
      signal: ctrl.signal,
      cache: "no-store",
    });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`ollama http ${res.status}`);
    const data = await res.json();
    const models = (data.models ?? []).map((m: { name: string }) => m.name);
    return NextResponse.json({ running: true, models });
  } catch {
    return NextResponse.json({ running: false, models: [] });
  }
}