import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { useState } from 'react';
import { trpc } from './utils/trpc';
import { BrowserRouter, Routes , Route, useParams } from "react-router-dom";

export function App() {
 
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: 'http://localhost:30004/trpc',

          // You can pass any HTTP headers you wish here
          async headers() {
            return {
              authorization: "Bearer 1",
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
        <Routes>
          <Route path="/banks/:token" element={<Banks/>} /> {/* 👈 Renders at /app/ */}
        </Routes>
      </BrowserRouter>
      </QueryClientProvider>
    </trpc.Provider>
 

  );
}

function Banks(){
  const {token} = useParams()
  trpc.bank

  return  (
    <>banks: {token}</>
  )

}

