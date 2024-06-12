// src/middleware/auth.ts
import { TRPCError } from '@trpc/server';
import { middleware } from "../trpc";
import { SECRET } from '..';
import jwt from "jsonwebtoken"

export const isBankAuthenticated = middleware(async (opts) => {
    const { ctx } = opts;
  const customAuthHeader = ctx.req.headers['x-bankAuth-token'];

  if ( !customAuthHeader) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Missing authorization headers' });
  }
 
  const token  = customAuthHeader;

  const userBankDetails =  new Promise<{bankId:string,bankUsername:string}>((resolve) => {
    jwt.verify(token,SECRET, (err:any, userBankDetails:any) => {
        if (userBankDetails) {
            resolve({bankId: userBankDetails.bankId, bankUsername:userBankDetails.username});
        } else {
            throw new TRPCError({ code: 'UNAUTHORIZED', message: 'invalid authorization headers' });
        }
    });
    })
  return opts.next({
    ctx: {
      ...ctx,
      userBankDetails
    },
  });
});
