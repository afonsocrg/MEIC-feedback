import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'
import tsconfig from './tsconfig.json'

// Convert paths from tsconfig.json
function getAlias() {
  const paths = tsconfig.compilerOptions.paths as Record<string, string[]>
  const alias: Record<string, string> = {}
  for (const pathKey in paths) {
    const target = paths[pathKey][0]
    const key = pathKey.replace('/*', '')
    const value = target.replace('/*', '').replace('./', '').replace('../', '')

    // Handle relative paths
    if (target.startsWith('../')) {
      alias[key] = path.resolve(__dirname, target.replace('/*', ''))
    } else {
      alias[key] = path.resolve(__dirname, value)
    }
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
