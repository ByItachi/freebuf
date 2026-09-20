import { NextResponse } from "next/server";
import { listConnectorStates } from "@/lib/admin-store";

/**
 * Public connector states for workspace UI (dashboard pill ordering,
 * connectors page). Returns only non-sensitive flags — no keys, no member data.
 */
export async function GET() {
  const connectors = await listConnectorStates();
  return NextResponse.json({
    connectors: connectors.map((c) => ({ id: c.id, enabled: c.enabled, connected: c.connected })),
  });
}
