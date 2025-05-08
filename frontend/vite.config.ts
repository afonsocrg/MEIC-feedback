import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfig from './tsconfig.json'

// Convert paths from tsconfig.json
function getAlias() {
  const paths = tsconfig.compilerOptions.paths as Record<string, string[]>
  const alias: Record<string, string> = {}
  for (const path in paths) {
    alias[path.replace('/*', '')] = paths[path][0]
      .replace('/*', '')
      .replace('.', '')
  }
  return alias
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react']
  },
  resolve: {
    alias: getAlias()
  }
})
