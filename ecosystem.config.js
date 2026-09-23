// PM2 process manager config — live server deployment.
// Usage: pm2 start ecosystem.config.js && pm2 save
module.exports = {
  apps: [
    {
      name: "freebuff-web",
      script: "server.js", // .next/standalone/server.js after build
      cwd: __dirname,
      instances: 1, // standalone server manages its own workers
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "0.0.0.0",
        // Keep user data out of the app dir so redeployments never wipe it.
        FREEBUFF_DATA_DIR: "/var/lib/freebuff",
        // Set a real password before exposing /admin publicly!
        ADMIN_PASSWORD: "change-me",
      },
      env_file: ".env.production",
    },
  ],
};
