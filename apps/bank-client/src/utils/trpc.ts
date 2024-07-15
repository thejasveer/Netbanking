// trpcClient.ts

import { createTRPCClient, httpBatchLink } from '@trpc/client';
 
import type { AppRouter } from '../../../bank-server/src';
 
import dotenv from 'dotenv'
dotenv.config({ path:"./../../.env.bankClient.dev" })
 
export const TRPC_SERVER_URL=process.env.TRPC_SERVER_URL!
 
 
export const trpc = createTRPCClient<AppRouter>({
    links: [
        httpBatchLink({
            url: TRPC_SERVER_URL,
            async headers() {
                return {
                    // Authorization: "Bearer "
                };
            },
        }),
    ],
});

export async function getLoginToken(username:string,password:string) {
    
    const response:any = await trpc.user.signup.mutate({
        username: username,
        password: password
    });
    return response.loginToken;
}
