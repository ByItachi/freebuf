import { NextResponse } from "next/server";
import { cloneProject, createProject, getProject, listProjects } from "@/lib/store";

export async function GET() {
  const projects = await listProjects();
  return NextResponse.json({ projects });
}

export async function POST(request: Request) {
  try {
    // Remix: clone an existing project when ?from=<id> is given (no body needed).
    const from = new URL(request.url).searchParams.get("from");
    if (from) {
      const source = await getProject(from);
      if (!source) {
        return NextResponse.json({ error: "source project not found" }, { status: 404 });
      }
      const cloned = await cloneProject(source);
      return NextResponse.json({ project: cloned }, { status: 201 });
    }

    let body: Record<string, unknown> | null = null;
    try {
      body = (await request.json()) as Record<string, unknown>;
    } catch {
      body = null; // empty/invalid body — fall through to validation below
    }

    const prompt = String(body?.prompt ?? "").trim();
    const name = body?.name ? String(body.name) : undefined;
    if (!prompt && !name) {
      return NextResponse.json({ error: "prompt or name required" }, { status: 400 });
    }
    const project = await createProject({ prompt: prompt || name || "New project", name });
    return NextResponse.json({ project }, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}