# Repository Guidelines

## Project Structure & Module Organization

This repository is a minimal full-stack JavaScript application. The React 19 client lives in `frontend/`; entry points are `frontend/src/main.jsx` and `frontend/src/App.jsx`, with shared styles in `frontend/src/index.css`. The Express 5 API is in `backend/src/server.js`. Root-level orchestration belongs in `scripts/` (currently `scripts/dev.mjs`). Store documentation screenshots in `screenshots/`; generated `dist/` output and all `node_modules/` directories must remain untracked.

The Vite server runs on port 5000 and proxies `/api` to the backend on port 3001. Keep browser concerns in `frontend/` and API or server concerns in `backend/`.

## Build, Test, and Development Commands

- `npm install` installs the root dependency tree from `package-lock.json`.
- `npm run dev` starts the Vite frontend and watch-mode Express backend together.
- `npm run build` creates a production frontend bundle in `frontend/dist/`.
- `npm start` starts only the backend without watch mode.
- `curl http://localhost:3001/api/health` verifies the API and should return `{"status":"ok"}`.

Run commands from the repository root unless a command explicitly uses a package prefix.

## Coding Style & Naming Conventions

Use modern ES modules, two-space indentation, semicolons, double quotes, and trailing commas in multiline structures, matching the existing source. Name React components in PascalCase (`CaseSummary.jsx`), hooks and functions in camelCase, and constants descriptively. Keep route paths lowercase and grouped under `/api`. Prefer Tailwind utility classes for UI styling and keep global CSS limited to base rules. No formatter or linter is configured; preserve the established style and keep diffs focused.

## Testing Guidelines

No automated test framework or coverage threshold is configured yet. Before submitting changes, run `npm run build`, start the app with `npm run dev`, confirm the health endpoint, and exercise affected UI flows. If adding tests, colocate frontend tests as `*.test.jsx` and backend tests as `*.test.js`, and add the corresponding root npm script.

## Commit & Pull Request Guidelines

Recent history uses short, imperative summaries such as `scaffold React and Express application`. Follow that pattern: one logical change per commit, concise subject, no trailing period. Pull requests should explain the motivation and implementation, list validation performed, link relevant issues, and include screenshots for visible UI changes. Call out new environment variables or API contract changes explicitly; never commit `.env` files or secrets.
