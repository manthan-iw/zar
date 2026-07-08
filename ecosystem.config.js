module.exports = {
  apps: [
    {
      name: "zar-frontend",
      script: "npm",
      args: "run start",
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3000 // You can change this port if 3000 is already in use
      }
    }
  ]
};
