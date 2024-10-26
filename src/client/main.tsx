import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import './index.css'
import './assets/index.css';
import { queryClient, trpcReactClient, trpcService } from './trpcService/trpcClientService.ts'
import { routeTree } from './routing/routeTree.tsx'

const router = createRouter({ routeTree });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <trpcService.Provider client={trpcReactClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </trpcService.Provider>
  </StrictMode>,
)
