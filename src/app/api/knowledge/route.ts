import { NextResponse } from "next/server";
import { platform } from "@/platform";

export async function GET() {
  return NextResponse.json({ docs: platform.knowledge.list() });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  if (body.action === "query") {
    const result = await platform.knowledge.query(String(body.q ?? ""), Number(body.k ?? 5));
    return NextResponse.json(result);
  }
  const title = String(body.title ?? "Untitled");
  const text = String(body.text ?? "");
  if (!text) return NextResponse.json({ error: "text required" }, { status: 400 });
  const result = await platform.knowledge.ingest(title, text, body.tags ?? []);
  return NextResponse.json(result, { status: result.ok ? 201 : 400 });
}