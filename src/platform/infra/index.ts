export const infra = {
  profile: "local-next",
  compute: "nodejs",
  storage: ".data/",
  cache: "memory",
  region: "local",
  status() {
    return {
      healthy: true,
      runtime: process.version,
      platform: process.platform,
      uptimeSec: Math.round(process.uptime()),
      memoryMB: Math.round(process.memoryUsage().rss / 1024 / 1024),
      profile: this.profile,
    };
  },
};