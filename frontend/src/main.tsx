import { PostHogProvider } from 'posthog-js/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {import.meta.env.MODE === 'development' ? (
      <App />
    ) : (
      <PostHogProvider
        apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
        options={{
          api_host: 'https://eu.i.posthog.com',
          debug: false
        }}
      >
        <App />
      </PostHogProvider>
    )}
  </StrictMode>
)
