import cors from 'cors';
import { bankRouter } from './routers/bank';
import { userRouter } from './routers/user';
import { router } from './trpc';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import db from "@repo/db/client"
const appRouter = router({
  user:userRouter,
  bank:bankRouter
});
dotenv.config({ path: __dirname + "/../.env" })
export const SECRET =  process.env.JWT_SECRET||'secret'
export const WEBHOOK_URL =  process.env.WEBHOOK_URL||''
 
 
export type AppRouter = typeof appRouter;

const server  = createHTTPServer({
    router:appRouter,
    middleware:cors(),
    createContext(opts) {
        let authHeader = opts.req.headers["authorization"];
        if (authHeader) {
            const token = authHeader.split(' ')[1]||'';
            // console.log(token);
            return new Promise<{db:typeof db, userId?: string,req:any}>((resolve) => {
                    jwt.verify(token,SECRET, (err, user:any) => {
                    if (user) {
                        resolve({userId: user.userId, db:db,req:opts.req});
                    } else {
                        resolve({req:opts.req,db:db});
                    }
                });
            })
        }

        return {
            db: db,req:opts.req
        }
    }
})
 
server.listen(3004)
