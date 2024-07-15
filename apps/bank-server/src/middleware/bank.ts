// src/middleware/auth.ts
import { TRPCError } from '@trpc/server';
import { middleware } from "../trpc";
import { SECRET } from '..';
import jwt from "jsonwebtoken"
 
 
export const isBankAuthenticated = middleware(async (opts) => {
    const { ctx } = opts;
 
    const customAuthHeader = ctx.req.headers['x-bankauth-token'];
   
  if ( !customAuthHeader) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Missing authorization headers' });
  }
 
  const token = customAuthHeader.split(' ')[1]||'';
 
try {
  const userBankDetails = await  new Promise<{bankId:string,bankUsername:string}>((resolve,reject) => {
    jwt.verify(token,SECRET, (err:any, decoded:any) => {
        if (decoded) {
          
            resolve({bankId: decoded.bankId, bankUsername:decoded.username});
        } else {
           reject(err)
        }
    });
    })

  return opts.next({
    ctx: {
      ...ctx,
      userBankDetails
    },
  });
} catch (error) {
  throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid or expired token' });
}
 
});
