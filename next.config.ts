import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // `NEXT_OUTPUT=standalone npm run build` emits a self-contained server
  // (used by the Tauri desktop sidecar and the Docker image).
  ...(process.env.NEXT_OUTPUT === "standalone" ? { output: "standalone" as const } : {}),
  async redirects() {
    return [
      // Live lovable.dev slug for the enterprise demo page.
      { source: "/enterprise-landing", destination: "/enterprise", permanent: true },
      // Signup is served by the combined login/signup form.
      { source: "/signup", destination: "/login", permanent: true },
    ];
  },
};

export default nextConfig;
