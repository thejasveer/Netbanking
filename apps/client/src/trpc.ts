// trpcClient.ts

import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import db from '@repo/db/client';
import type { AppRouter } from '../../server/src';

export const trpc = createTRPCProxyClient<AppRouter>({
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
