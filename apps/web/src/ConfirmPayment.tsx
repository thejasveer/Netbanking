import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { trpc } from "./utils/trpc";
import { Button } from "./components/Button";
import { Error } from "./components/Error";
import { Row } from "./components/Row";
import { Center } from "./components/Center";

export const ConfirmPayment=()=>{

 
  const [searchParams] = useSearchParams();
    const [paymentToken,setPaymentToken] = useState<string|null>(null);
    //get user bank details 

    useEffect(()=>{
        console.log("yes")
          const token = searchParams.get('paymentToken');
              if(token){
                setPaymentToken(token)
              }
       },[])
       const bankAction  = trpc.bank.action.useMutation(
        {
          onSuccess:(data)=>{
            console.log(data)
            // window.close();
          },
       
          
        }
       );
       const confirmPayment= ()=>{
        if(paymentToken){
        bankAction.mutate({token:paymentToken}) 
        } 
      }
return <div className="p-14 flex flex-col gap-4">
     

      
        <Row keyStr={"FROM"} value={{heading:"Checking Acc (3233)",value:"$2000"}}/>
        <Row keyStr={"Amount"} value={{heading:"$200",value:""}}/>
        <Row keyStr={"DATE"} value={{heading:new Date().toDateString(),value:""}}/>
        <div className="mt-24">

        <p className="text-center">By swiping "Confirm" you authorize this payment </p>
       
        <Button action={confirmPayment} loading={bankAction.isPending} text={"Confirm"}/>
        {bankAction.isError && <Error msg={ bankAction.error.message}/>} 
        </div>
                

    </div>
    
}