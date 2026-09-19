export const runtimeIntelligence = {
  suggestScale(load: number) {
    if (load > 0.85) return { action: "scale_up", replicas: 3 };
    if (load < 0.2) return { action: "scale_down", replicas: 1 };
    return { action: "hold", replicas: 2 };
  },
  heal(errorRate: number) {
    return errorRate > 0.05
      ? { action: "restart_unhealthy", reason: "elevated_error_rate" }
      : { action: "none" };
  },
};