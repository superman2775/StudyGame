import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => {
  const repo = process.env.GITHUB_REPOSITORY?.split('/')[1]
  const base = repo ? `/${repo}/` : '/'

  return {
    base,
    plugins: [react()],
  }
})

