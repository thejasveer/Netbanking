// trpcClient.ts

import { createTRPCClient, httpBatchLink } from '@trpc/client';
 
import type { AppRouter } from '../../server/src';

export const trpc = createTRPCClient<AppRouter>({
    links: [
        httpBatchLink({
            url: 'http://localhost:3004',
            async headers() {
                return {
                    Authorization: "Bearer 1"
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
