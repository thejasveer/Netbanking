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
 
dotenv.config({ path: "./../../.env " })
 

export const SECRET =  process.env.JWT_SECRET||'secret'
export const WEBHOOK_URL =  process.env.WEBHOOK_URL!
const PORT=  process.env.PORT!
    export const REDIS_URL=  process.env.REDIS_URL!
 
export type AppRouter = typeof appRouter;

const server  = createHTTPServer({
    router:appRouter,
    middleware:cors(),
    createContext(opts) {
        let authHeader = opts.req.headers["authorization"];
      
        if (authHeader) {
            const token = authHeader.split(' ')[1]||'';
        
            return new Promise<{db:typeof db, userId?: string,req:any}>((resolve) => {
               
                    jwt.verify(token,SECRET, (err, decoded:any) => {
                    
                        if (err) {
                      
                            resolve({ req: opts.req, db: db });
                        } else {
                           
                            resolve({ userId: decoded.userId, db: db, req: opts.req });
                        }
                    });
            })
        }

        return {
            db: db,req:opts.req
        }
    }
})
 
server.listen(PORT,()=>{
    console.log("Bank Server running on port "+PORT)
})
