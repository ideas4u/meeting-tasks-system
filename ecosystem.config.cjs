module.exports = {
  apps: [{
    name: "meeting-tasks-api",
    script: "npm",
    args: "run server",
    env_production: {
      NODE_ENV: "production",
      PORT: 3001,
      DB_HOST: "43.139.222.146",
      DB_USER: "root",
      DB_PASSWORD: "123456",
      DB_NAME: "meeting_tasks",
      DB_PORT: 3306
    }
  }]
} 
