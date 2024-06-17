import { optional, z } from "zod"
import { publicProcedure, router } from "../trpc"
import { isLoggedIn } from "../middleware/user"
import { hashPassword, verifyPassword } from "../utils/passwordManager"
import jwt from "jsonwebtoken"
import { SECRET } from ".."
import { isBankAuthenticated } from "../middleware/bank"
import { TRPCError } from "@trpc/server"
 


export const bankRouter= router({
    getBanks: publicProcedure
 
    .output(z.array(z.object({
        id:z.number(),
        bankName:z.string(),
        placeholder:z.string(),
        logo:z.string()
 
    }))) 
    .query(async (opts)=>{
        let banks = await opts.ctx.db.banks.findMany();
   
        return banks.map((x)=>({
            id:x.bankId,
            bankName: x.name,
            placeholder: x.usernamePlaceholder,
            logo:x.imgUrl
             }))
            }),
    
    login: publicProcedure
    .use(isLoggedIn)
    .input(
        z.object({
            bankId : z.number(),
            username:z.string(),
            password:z.string()
            
        }))
        .mutation(async(opts)=>{
            const existingBank = await opts.ctx.db.userBank.findFirst({
                where:{
                    userId:Number(opts.ctx.userId),
                    bankId:opts.input.bankId,
                  }
            })
            if(!existingBank){
                const hashedPassword = await hashPassword(opts.input.password);
                const newUserBank = await opts.ctx.db.userBank.create({
                    data:{
                        userId:Number(opts.ctx.userId),
                        bankId:opts.input.bankId,
                        username:opts.input.username,
                        password: hashedPassword
                    }
                });
                const loginTokenForBank =  jwt.sign({username:newUserBank.username,bankId:newUserBank.bankId},SECRET);
                return {
                    loginTokenForBank
                }
            }else{
               const {username,password}= opts.input;
               if(existingBank.username==username&& await verifyPassword(password,existingBank.password)){
                const loginTokenForBank =  jwt.sign({username:existingBank.username,bankId:existingBank.bankId},SECRET);
                return {
                    loginTokenForBank
                }
               }else{
                throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid credentials. Please try with correct credentials' });
               }
              
            }
        }),
        action: publicProcedure
        .use(isLoggedIn)
        .use(isBankAuthenticated )
       
        .input(z.object({
            token:z.string(),
         }))
         .mutation(async(opts)=>{
            try{
                const payload:any = await new Promise((resolve,reject)=>{
                    jwt.verify(
                        opts.input.token,
                        SECRET,
                        (err,payload)=>{
                            if(payload){
                                resolve(payload)
                            }else{
                                throw new TRPCError({ code: 'BAD_REQUEST', message: 'We can\'t fullfil your request' });
             
                            }
                        }
                      );
                      
                });

                //verify enoygh balance
                const userBankDetails = await opts.ctx.db.userBank.findFirst({
                    where:{bankId:Number(opts.ctx.userBankDetails.bankId),username:opts.ctx.userBankDetails.bankUsername}
                });
                console.log(userBankDetails?.balance,payload.amount)
                if(userBankDetails && payload && userBankDetails?.balance>payload.amount)
                {
                

                    

                }else{
                    
                    throw new TRPCError({ code: 'BAD_REQUEST', message: 'Insufficient funds.' });  
                }
                //make tranasction row with initiated
                //inform websoket server and make transcation there tooo
                //put into redis queue



                console.log("payload",payload)

            }catch(err){
                    console.log(err)
            }
          })
}) 