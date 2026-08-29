# AI-Assisted PIL Filing and Scrutiny

A minimal React and Express prototype for PIL document extraction, automated procedural scrutiny, and mock registry review.

## Structure

- `frontend/` — React + Vite + Tailwind CSS client
- `backend/` — Node.js + Express API

## Run locally

From the project root:

```bash
npm install
GEMINI_API_KEY=your_key_here npm run dev
```

The frontend runs on port 5000 and proxies `/api` requests to the backend on port 3001.

Health check: `GET /api/health`

The analysis endpoint is `POST /api/pil/analyze`. It accepts one `mainPetition` PDF and up to four optional `supportingDocuments` PDFs as multipart form data. Each file is limited to 10 MB and is processed in memory.

Copy `backend/.env.example` as a reference for the required environment variable. The app reads the key from `process.env.GEMINI_API_KEY`; it does not load or expose it in the frontend.

## Verification

```bash
npm test
npm run build
curl http://localhost:3001/api/health
```
