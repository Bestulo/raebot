module.exports = {
  apps: [
    {
      name: "telegram-bot",
      script: "index.ts", // Your bot's main script file
      interpreter: "/home/dd/.bun/bin/bun", // Updated path to your Bun executable
      args: "", // If your script requires additional arguments, add them here
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
