import { NextResponse } from "next/server";
import { platform } from "@/platform";

export async function GET() {
  return NextResponse.json({
    agents: platform.agents.listAgents(),
    tools: platform.agents.listTools(),
  });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const agentId = String(body.agentId ?? "builder");
  const input = String(body.input ?? body.prompt ?? "");
  if (!input) return NextResponse.json({ error: "input required" }, { status: 400 });
  const gate = platform.governance.evaluate("agents.run");
  if (!gate.allowed) return NextResponse.json({ error: "denied" }, { status: 403 });
  platform.security.audit(platform.kernel.defaultContext().userId, "agents.run", agentId);
  const started = Date.now();
  const result = await platform.agents.run(agentId, input);
  platform.observability.span("agents.run", Date.now() - started);
  platform.messaging.publish("agents.runs", result);
  if (!result.ok) return NextResponse.json(result, { status: 400 });
  return NextResponse.json(result);
}