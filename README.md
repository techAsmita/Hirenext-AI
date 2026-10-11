# HireNext.ai

**Secure Multimodal AI Video Interview Assessment Platform**

Intelligent interviews. Explainable hiring.

Production-quality frontend foundation for a B.Tech Computer Engineering capstone.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- React Router · Recharts · Lucide icons

## Quick start

```bash
cd hirenext
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

### Demo login

Any email/password works. Pre-filled: admin@hirenext.ai / demo

Candidate experience: from login → “Open candidate experience”, or `/interview/i1`.

## Architecture

```
src/
  components/     UI primitives + layout
  layouts/        App shell
  pages/          Route screens
  services/api.ts ALL data access — swap demo → real API here
  types/          API interfaces
  data/demoData.ts Demo fixtures only
```

Scores come from the service layer. Replace demo adapters with real backend calls without rewriting UI.

## Routes

- /login — Recruiter sign-in
- /dashboard — Hiring intelligence
- /candidates, /candidates/:id
- /interviews, /interviews/create
- /interview/:id — Candidate session
- /processing/:id — Pipeline stages
- /analysis/:id — Multimodal intelligence
- /analysis/authenticity | behaviour | personality
- /analytics · /reports/:id · /settings

## Notes

- Demo scores until backend is connected (UI labels this)
- Processing stages map to future job status
- Personality includes non-clinical disclaimer
- Dark mode fully themed
