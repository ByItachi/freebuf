import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { listConnectorStates, setConnectorEnabled, setConnectorConnected } from "@/lib/admin-store";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  return NextResponse.json({ connectors: await listConnectorStates() });
}

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  let body: { id?: string; enabled?: boolean; connected?: boolean };
  try {
    body = (await request.json()) as { id?: string; enabled?: boolean; connected?: boolean };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });

  let state = null;
  if (typeof body.enabled === "boolean") {
    state = await setConnectorEnabled(body.id, body.enabled);
  }
  if (typeof body.connected === "boolean") {
    state = await setConnectorConnected(body.id, body.connected);
  }
  if (!state) return NextResponse.json({ error: "nothing to update" }, { status: 400 });
  return NextResponse.json({ connector: state });
}
