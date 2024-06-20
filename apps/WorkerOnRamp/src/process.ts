import jwt from "jsonwebtoken";
import { SECRET, WEBHOOK_URL } from ".";
import db from "@repo/db/client";
import { PaymentStatus } from "@prisma/client";
import axios from "axios";
export const proccessTxn= async(token: any)=>{
    console.log(token)

   
    try {
         //verify token 
        try {
            const payload  = await new Promise((resolve,reject)=>{
                if(!SECRET) return;
                    jwt.verify(
                        token,
                        SECRET,
                        (err:any,payload: any)=>{
                          
                            if(payload){
                                resolve(payload)
                            }else{
                            throw new Error(err)
                          
                            }
                        }
                      );
                      
                });
                console.log(payload)
    
    
        } catch (error) {
            console.log(error)
        }
    //update transaction

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

                console.log(transaction.userBank)
            const userBank= await db.userBank.update({
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


    
            })
      
        } catch (error) {
            
        }

        const webhookRes = await axios.post(WEBHOOK_URL , {
            token:token,
            status: 'Success',
          });
      
          if (webhookRes.status <= 300) {
            console.log("DONE");
          } else {
            console.log("FAILED FROM APP SIDE");
          }
      








    } catch (error) {
        console.log(error)
    }
   
 





    // inform webhook



     
    // Here you would add your actual processing logic

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log(`Finished processing.`);
}