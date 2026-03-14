import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { AppRouter } from './routes/AppRouter'
import { queryClient } from './services/core/client.query'
import AuthInit from './components/auth/AuthInit'
import { Toast } from './components/ui/toast/Toast'
import "./main.css";

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <AuthInit />
    <Toast />
    <AppRouter />
  </QueryClientProvider>
)
