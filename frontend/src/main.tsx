import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { fetchCurrentUser } from './services/auth'
import useAuthStore from './store/authStore'

const queryClient = new QueryClient()

function Root() {
  const setUser = useAuthStore((state) => state.setUser)

  useEffect(() => {
    void fetchCurrentUser()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem('auth_token')
      })
  }, [setUser])

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
