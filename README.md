# StudyGame

A React + Vite platform named **StudyGame** (a study helper that feels like a game).

## Local dev

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy (GitHub Pages)

- A GitHub Actions workflow is included at `.github/workflows/deploy.yml`.
- `vite.config.js` sets `base` automatically from `GITHUB_REPOSITORY`, so the app works under `/<repo>/` on Pages.

On GitHub: `Settings` → `Pages` → `Build and deployment` → select **GitHub Actions**.
