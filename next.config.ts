import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
