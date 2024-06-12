import { z } from "zod"
import { publicProcedure, router } from "../trpc"
import { isLoggedIn } from "../middleware/user"
// import { hashPassword } from "../utils/passwordManager"
import jwt from "jsonwebtoken"
import { SECRET } from ".."
import { isBankAuthenticated } from "../middleware/bank"
 


export const bankRouter= router({
    login: publicProcedure
    .use(isLoggedIn)
    .input(
        z.object({
            bankId : z.string(),
            username:z.string(),
            password:z.string()
            
        }))
        .mutation(async(opts)=>{
            const existingBank = await opts.ctx.db.userBank.findFirst({
                where:{
                    userId:Number(opts.ctx.userId),
                    bankId:Number(opts.input.bankId),
                  }
            })
            if(!existingBank){
                const hashedPassword ="sasww"// await hashPassword(opts.input.password);
                const newUserBank = await opts.ctx.db.userBank.create({
                    data:{
                        userId:Number(opts.ctx.userId),
                        bankId:Number(opts.input.bankId),
                        username:opts.input.username,
                        password: hashedPassword
                    }
                });
                const loginTokenForBank =  jwt.sign({username:newUserBank.username,bankId:newUserBank.bankId},SECRET);
                return {
                    loginTokenForBank
                }
            }else{
                const loginTokenForBank =  jwt.sign(existingBank.username,SECRET);
                return {
                    loginTokenForBank
                }
            }
        }),
        debit: publicProcedure
        .use(isLoggedIn)
        .use(isBankAuthenticated )
       
        .input(z.object({
            token:z.string(),
         }))
         .mutation(async(opts)=>{
            try{
                const payload = new Promise(resolve=>{
                    jwt.verify(
                        opts.input.token,
                        opts.ctx.user?.loginToken || '',
                        // (err,payload)=>{
                        //     if(payload){
                        //         resolve(payload)
                        //     }
                        // }
                      );
                      
                });

                console.log(payload)

            }catch(err){
                    console.log(err)
            }
          })
}) 