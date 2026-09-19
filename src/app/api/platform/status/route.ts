import { NextResponse } from "next/server";
import { platform } from "@/platform";

export async function GET() {
  platform.observability.metric("platform.status.hit", 1);
  platform.observability.log("info", "platform status requested");
  const kernel = platform.kernel.status();
  return NextResponse.json({
    ok: true,
    brand: "Manus",
    design: "lovable-parchment",
    kernel,
    control: platform.control.missionControl(),
    capabilities: platform.kernel.capabilities,
    agents: platform.agents.listAgents(),
    workflows: platform.workflow.list(),
    aiRoutes: platform.ai.listRoutes(),
    policies: platform.governance.listPolicies(),
    fabric: platform.fabric.list(),
    twin: platform.twin.topology(),
    developer: platform.developer,
  });
}