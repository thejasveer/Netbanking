import jwt from "jsonwebtoken";
import { SECRET, WEBHOOK_URL } from ".";
import db from "@repo/db/client";
import { PaymentStatus } from "@prisma/client";
import axios from "axios";
import { pub } from "./utils/redisClient";
export const proccessRampTxn= async(token: any)=>{
    

   console.log("-----")
    try {
        
        try {
            const payload  = await new Promise((resolve,reject)=>{
                if(!SECRET) return;
                    jwt.verify(
                        token,
                        SECRET,
                        (err:any,decoded: any)=>{
                          
                            if(decoded){
                                resolve(decoded)
                            }else{
                            throw new Error(err)
                          
                            }
                        }
                      );
                      
                });
   
        } catch (error:any) {
            throw new  Error(error.message ,token)
        }
   
        const transaction = await db.transaction.findFirst({
        where:{
            token
        }
    })
       const increment = transaction?.type=='OnRamp'

       try {

            await db.$transaction(async(tx)=>{
                const transaction = await db.transaction.update({
                    where:{
                        token:token
                    },
                    data:{
                        status: PaymentStatus.SUCCESS
                    },
                    select:{
                        amount:true,
                        userBank:true
                    }
                });
                const {userId,bankId}= transaction.userBank;
                 
                if(increment){
                    await db.userBank.update({
                        where:{
                            userId_bankId: {
                                userId: userId,
                                bankId: bankId
                              }
                          },
                        data:{
                            balance:{
                                increment: transaction.amount
                            }
                        }
                    })
                }else{
                    await db.userBank.update({
                        where:{
                            userId_bankId: {
                                userId: userId,
                                bankId: bankId
                              }
                          },
                        data:{
                            balance:{
                                decrement: transaction.amount
                            }
                        }
                    })
                }
    
          })
             // Simulate processing delay
            await new Promise(resolve => setTimeout(resolve, 5000));

             pub.publish('transactions-status', JSON.stringify({
                userId:transaction?.userId,
                token:token,
                status:PaymentStatus.SUCCESS,
              }));
      
        } catch (error: any) {
            throw new  Error(error.message)
        }


        //TODO: push this notifywebhookserver into redis
        const webhookRes = await axios.post(WEBHOOK_URL , {
            token:token,
            status: PaymentStatus.SUCCESS,
          });
      
          if (webhookRes.status <= 300) {
                 console.log("DONE");
              } else {
            console.log("FAILED FROM APP SIDE");
          }



         } catch (error:any) {

        
        console.log(error.message)
    }
    // Here you would add your actual processing logic

    console.log(`Finished processing.`);
    console.log("-----")
}