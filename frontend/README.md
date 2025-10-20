# Auditor Frontend (React + Vite)

This is the React-based frontend for the Smart Contract Security Auditor. It talks to the backend API at `http://localhost:3000` via a dev proxy.

## Prerequisites
- Node 18+
- Backend API running locally on port 3000

## Install & Run (development)
```bash
# from repo root
cd frontend
npm install
# if you installed the frontend before routing was added, ensure router is present
npm install react-router-dom
npm run dev
```

Then open:
- http://localhost:5173

Routes:
- `/` Landing page
- `/auditor` Auditor UI

## Build for production
```bash
npm run build
npm run preview
```

## Notes
- Dev server proxies requests from `/api/*` to `http://localhost:3000`. See `vite.config.ts`.
- Main entry: `src/main.tsx`. Routes in: `src/App.tsx`.
- Pages: `src/pages/Landing.tsx`, `src/pages/Auditor.tsx`.
- API calls: `src/services/api.ts`.
- Styles are in `src/index.css` (ported from the previous static HTML).
