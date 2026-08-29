# Judicial Workflow Automation

Minimal React and Express starter project.

## Structure

- `frontend/` — React + Vite + Tailwind CSS client
- `backend/` — Node.js + Express API

## Run locally

From the project root:

```bash
npm install
npm run dev
```

The frontend runs on port 5000 and proxies `/api` requests to the backend on port 3001.

Health check: `GET /api/health`
