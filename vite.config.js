import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig(() => {
  const explicitBase = process.env.VITE_BASE?.trim()
  const repo = process.env.GITHUB_REPOSITORY?.split('/')[1]

  // Use a relative base by default so the same build works on:
  // - GitHub project pages: https://<user>.github.io/<repo>/
  // - Custom domains at root: https://example.com/
  // - Custom domains behind a subpath reverse proxy: https://example.com/<repo>/
  //
  // If you want an absolute base, set `VITE_BASE` (e.g. "/StudyGame/").
  const base = explicitBase || './'

  return {
    base,
    plugins: [react()],
  }
})
