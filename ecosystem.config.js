module.exports = {
  apps: [
    {
      name: 'lifepath-backend',
      cwd:  './backend',
      script: 'src/index.js',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      error_file: './logs/backend-error.log',
      out_file:   './logs/backend-out.log',
    },
    {
      name: 'lifepath-frontend',
      cwd:  './frontend',
      script: 'node_modules/.bin/vite',
      args: 'preview --port 3000 --host',
      env: {
        NODE_ENV: 'production',
      },
      instances: 1,
      autorestart: true,
      watch: false,
      error_file: './logs/frontend-error.log',
      out_file:   './logs/frontend-out.log',
    }
  ]
}
