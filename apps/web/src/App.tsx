import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { useState } from 'react';
import { trpc } from './utils/trpc';
import { BrowserRouter, Routes , Route } from "react-router-dom";
 
import { Banks } from './Banks';
import { Appbar } from './components/Appbar';
 

export function App() {
 
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      }
    }
  }));
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: 'http://localhost:3004',

          // You can pass any HTTP headers you wish here
          async headers() {
            return {
              authorization: "Bearer "+localStorage.getItem('token'),
              'x-bankAuth-token': "Bearer "+localStorage.getItem('bToken'),
            };
           },
        }),
      ],
    }),
  );




  return (
    
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {/* Your app here */}
        <BrowserRouter >
       <Appbar/>
        <Routes>
          <Route path="/banks" element={<Banks/>} /> {/* 👈 Renders at /app/ */}
        </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </trpc.Provider>
 
  );
}









