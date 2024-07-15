import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from  '../../../bank-server/src';

export const trpc = createTRPCReact<AppRouter>();