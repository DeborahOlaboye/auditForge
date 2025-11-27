import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { appkit } from './config/wallet';
import App from './App';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <appkit.Provider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </appkit.Provider>
  </React.StrictMode>
);
