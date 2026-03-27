# Pulscare Site (React + Node.js)

## Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- Deployment: Docker / Docker Compose

## Local Run
```bash
npm install
npm run dev
```
- React: http://localhost:5173
- API: http://localhost:3001

## Production Build
```bash
npm run build
npm run start
```

## Docker Run
```bash
docker compose up --build -d
```
- App + API: http://localhost:3001

## Environment
Create `.env` from `.env.example`.

Variables:
- `VITE_YM_COUNTER_ID` — Yandex.Metrika counter ID (frontend)
- `PORT` — server port (default 3001)

## Implemented Logic
- SPA routing: `/`, `/privacy-policy`, `/public-offer`, `/service-rules`
- Modal feedback form in project style
- Feedback API endpoint: `POST /api/feedback`
- Yandex.Metrika script injection (enabled when `VITE_YM_COUNTER_ID` is set)

## Next Step
- SEO preparation (meta, OG, schema.org, sitemap, robots, canonical strategy)
