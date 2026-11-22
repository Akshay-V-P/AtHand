import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../styles/globals.css'
import App from '../app/App'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import {store} from '../store/store'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/QueryClient'
import {ReactQueryDevtools} from "@tanstack/react-query-devtools"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>

        <BrowserRouter>
          <App />
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
)
