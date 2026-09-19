import { kernel } from "./kernel";
import { identity } from "./identity";
import { security } from "./security";
import { gateway } from "./gateway";
import { aiGateway } from "./ai";
import { agentPlatform } from "./agents";
import { workflowEngine } from "./workflow";
import { knowledge } from "./knowledge";
import { memory } from "./memory";
import { dataPlatform } from "./data";
import { messaging } from "./messaging";
import { search } from "./search";
import { developer } from "./developer";
import { infra } from "./infra";
import { observability } from "./observability";
import { governance } from "./governance";
import { llmops } from "./llmops";
import { runtimeIntelligence } from "./runtime";
import { controlCenter } from "./control";
import { digitalTwin } from "./twin";
import { autonomy } from "./autonomy";
import { integrationFabric } from "./fabric";

kernel.register("identity", identity);
kernel.register("security", security);
kernel.register("gateway", gateway);
kernel.register("ai", aiGateway);
kernel.register("agents", agentPlatform);
kernel.register("workflow", workflowEngine);
kernel.register("knowledge", knowledge);
kernel.register("memory", memory);
kernel.register("data", dataPlatform);
kernel.register("messaging", messaging);
kernel.register("search", search);
kernel.register("developer", developer);
kernel.register("infra", infra);
kernel.register("observability", observability);
kernel.register("governance", governance);
kernel.register("llmops", llmops);
kernel.register("runtime", runtimeIntelligence);
kernel.register("control", controlCenter);
kernel.register("twin", digitalTwin);
kernel.register("autonomy", autonomy);
kernel.register("fabric", integrationFabric);

export const platform = {
  kernel,
  identity,
  security,
  gateway,
  ai: aiGateway,
  agents: agentPlatform,
  workflow: workflowEngine,
  knowledge,
  memory,
  data: dataPlatform,
  messaging,
  search,
  developer,
  infra,
  observability,
  governance,
  llmops,
  runtime: runtimeIntelligence,
  control: controlCenter,
  twin: digitalTwin,
  autonomy,
  fabric: integrationFabric,
};

export type ManusPlatform = typeof platform;