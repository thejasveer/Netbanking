import { z } from "zod"
import { publicProcedure, router } from "../trpc"
import { hashPassword } from "../utils/passwordManager";
import { SECRET } from "..";
import jwt from "jsonwebtoken";
import { TRPCError } from "@trpc/server";
import { isLoggedIn } from "../middleware/user";




export const userRouter= router({
    signup: publicProcedure
    .input(z.object({
        username:z.string(),
        password:z.string()
    }))
    .mutation(async (opts)=>{
        let username = opts.input.username;
        let password = await hashPassword(opts.input.password);
        const existingUser = await opts.ctx.db.user.findFirst({
            where:{username}
        });
        if(existingUser){
            return {
                loginToken : existingUser.loginToken
            }
        }
        let response:any = await opts.ctx.db.user.create({ data: {
            username,
            password,
          }});
          console.log(response)
          let userId = response.userId;
        const token: string = jwt.sign({ userId:userId }, SECRET);

        await opts.ctx.db.user.update({
            where:{
                userId:userId
            }, data: {
           loginToken:token
          }});
          return {
            loginToken:token
          }
     



    }),
    login: publicProcedure
    .input(z.object({
        username: z.string(),
        password: z.string()
    }))
    .mutation(async (opts) => {
        let response = await opts.ctx.db.user.findFirst({
           where:{username: opts.input.username}
        });
        if (!response) {
            throw new TRPCError({ code: 'UNAUTHORIZED' });
        }
//Todo:"Add verify hasing apssword"

        const token: string = jwt.sign({ userId: opts.ctx.userId }, SECRET, { expiresIn: '1h' });

        return {
            token
        }
    }),
    me: publicProcedure
    .use(isLoggedIn)
    .output(z.object({
        email: z.string()
    }))
    .query(async (opts) => {
        let response = await opts.ctx.db.user.findFirst({where:{userId:Number(opts.ctx.userId)}});
        if (!response) {
            // shouldn't happen
            throw new TRPCError({ code: 'UNAUTHORIZED' });
        }
        return {
            email: response.username || "",
        }
    }),

}) 