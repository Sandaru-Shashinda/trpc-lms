import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { ErrorBoundary } from './components/shared/ErrorBoundary';
import App from './App.tsx';
import './styles/globals.css';

import { trpc, trpcClient } from './lib/trpc';
import { queryClient } from './lib/queryClient';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <App />
          <Toaster position="top-right" richColors />
        </QueryClientProvider>
      </trpc.Provider>
    </ErrorBoundary>
  </React.StrictMode>
);
