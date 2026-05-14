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
- `vite.config.js` defaults `base` to `./` so the same build works on project pages and custom domains. To force an absolute base (e.g. `/StudyGame/`), set `VITE_BASE` in your build environment.

On GitHub: `Settings` → `Pages` → `Build and deployment` → select **GitHub Actions**.
