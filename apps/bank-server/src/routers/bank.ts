import {   z } from "zod"
import { publicProcedure, router } from "../trpc"
import { isLoggedIn } from "../middleware/user"
import { hashPassword, verifyPassword } from "../utils/passwordManager"
import jwt from "jsonwebtoken"
import { SECRET,WEBHOOK_URL } from ".."
import { isBankAuthenticated } from "../middleware/bank"
import { TRPCError } from "@trpc/server"
import axios from "axios"
 
import {PaymentStatus} from '@prisma/client'
 
import redisClient from "../redis"
 import { TransactionType} from '@prisma/client'


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
        .output( z.object({
            success: z.boolean(),
            userId:z.number() 
          }) )
        .input(z.object({
            token:z.string(),
         }))
         .mutation(async(opts)=>{
            let payload:any;
            try{
            payload  = await new Promise((resolve)=>{
               
                    jwt.verify(
                        opts.input.token,
                        SECRET,
                        (err,decoded:any)=>{
                            if(decoded){
                               
                                resolve(decoded)
                            }else{
                                console.log(err)
                                throw new TRPCError({ code: 'BAD_REQUEST', message: 'We can\'t fullfil your request. Please close this window and try agin' });
             
                            }
                        }
                      );
                      
                });
                 
          //verify enough balance
                const userBankDetails = await opts.ctx.db.userBank.findFirst({
                    where:{bankId:Number(opts.ctx.userBankDetails.bankId),
                        userId:Number(opts.ctx.userId),
                        username:opts.ctx.userBankDetails.bankUsername}
                });
          
                if(userBankDetails && payload && userBankDetails?.balance>payload.amount)
                {
 
               // const type =  payload.type == 'OFF_RAMP'?TransactionType.OnRamp:TransactionType.OffRamp;
               
                await opts.ctx.db.transaction.upsert({where:{
                    token:  opts.input.token
                },update:{
                        token:opts.input.token, 
                        amount:payload.amount,
                        status:PaymentStatus.INITIATED,
                        userId:Number(opts.ctx.userId),
                        bankId:Number(opts.ctx.userBankDetails.bankId),
                        type: payload.type == 'OFF_RAMP'?TransactionType.OnRamp:TransactionType.OffRamp 
                 },
                 create:{
                    token:opts.input.token, 
                    amount:payload.amount,
                    status:PaymentStatus.INITIATED,
                    userId:Number(opts.ctx.userId),
                    bankId:Number(opts.ctx.userBankDetails.bankId),
                    type: payload.type == 'OFF_RAMP'?TransactionType.OnRamp:TransactionType.OffRamp 
                 }
                });
                    //informing webhook server an d updating the transaction  
                 
                 const webhookRes = await axios.post(WEBHOOK_URL , {
                    token: opts.input.token,
                    status:PaymentStatus.INITIATED,
                  });
                  if(webhookRes.status <= 300){
                   //put into redis queue 
              
                    redisClient.lPush(
                    `TRANSACTIONS_QUEUE`,
                         JSON.stringify( opts.input.token  )
                    )

                  }else{
                     throw new TRPCError({ code: 'PRECONDITION_FAILED', message: 'Access to the target resource has been denied. Contact Wallet Help desk' });
                  }

                }else{
             

                       await axios.post(WEBHOOK_URL , {
                        token: opts.input.token,
                        status: PaymentStatus.FAILED,
                      });
              


                    throw new TRPCError({ code: 'BAD_REQUEST', message: 'Insufficient funds.' });
                }
             
                return {
                    success:true,
                    userId:Number(opts?.ctx?.userId)
                   }
            
              
    
            }catch(err:any){
                console.log(err)
                throw new TRPCError(err);
             }
          }),
          getPayloadDetails: publicProcedure
          .use(isLoggedIn)
          .use(isBankAuthenticated)
          .input(z.object({
            paymentToken:z.string() 
          }))
          .output( z.object({
              
              bankName:z.string().optional(),
              amount:z.number().optional(),
              balance:z.number().optional(),
              logo:z.string().optional(),
              toFrom:z.string().optional(),
          }))
          .query(async (opts)=>{
           if(!opts.input.paymentToken) return {}
          
            const userBankDetails = await opts.ctx.db.userBank.findFirst({
                where:{bankId:Number(opts.ctx.userBankDetails.bankId),username:opts.ctx.userBankDetails.bankUsername
                , userId:Number(opts.ctx.userId),

                },
                
                select:{
                    balance:true,
                    bank:{
                        select:{
                            name:true,
                            imgUrl:true
                        }
                    },
              }
            });
            if(!userBankDetails) return {}
           const payload:any  = await new Promise((resolve)=>{
      
                jwt.verify(
                    opts.input.paymentToken,
                    SECRET,
                    (err,decoded:any)=>{
                        if(decoded){
                            resolve(decoded)
                        }else{
                            console.log(err)
                            throw new TRPCError({ code: 'BAD_REQUEST', message: 'We can\'t fullfil your request. Please close this window and try agin' });
         
                        }
                    }
                  );
                  
            });

              return  {
                bankName:userBankDetails.bank.name,
                logo:userBankDetails.bank.imgUrl,
                balance:userBankDetails.balance/100,
                amount:payload.amount/100,
                toFrom: payload.type=='ON_RAMP'?'FROM':'TO'
              }
            })

}) 