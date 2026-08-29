# Replit setup

## Run the project

Use the root command:

```bash
npm run dev
```

This starts both services:

- Frontend: Vite on `0.0.0.0:5000`
- Backend: Express on `0.0.0.0:3001`

The Vite development server proxies `/api` requests to the backend. The health endpoint is available at `GET /api/health` and returns `{"status":"ok"}`.