import { useSearchParams } from "react-router-dom";
import { bankType } from "../utils/types";
import { BankLogo } from "./BankLogo";
import { Button } from "./Button";
import { useEffect, useState } from "react";
import { trpc } from "../utils/trpc";
import { Error } from "./Error";

export function BankLogin({bank,onClick}:{bank:bankType[0]|null;onClick:any}){
  const [bankCred,setBankCred]= useState<{username:string;password:string}>({
                                  username:"",
                                  password:""
                                });
  const [paymentToken,setPaymentToken] = useState<string|null>(null)
 const bankAction  = trpc.bank.action.useMutation(
  {
    onSuccess:(data)=>{
      console.log(data)

    },
 
    
  }
 );
  const bankLogin = trpc.bank.login.useMutation({
    onSuccess:({loginTokenForBank})=>{
        localStorage.setItem('bToken',loginTokenForBank)
        if(paymentToken){
            bankAction.mutate({token:paymentToken})
         
        }
    

    },
 
    
  });

  if(bankAction.isError){
    console.log("yes")
  }

 
  const [searchParams] = useSearchParams();
  useEffect(()=>{
    console.log("yes")
      const token = searchParams.get('paymentToken');
          if(token){
            setPaymentToken(token)
          }
   },[])
   
   const handleBankLogin= ()=>{
    bankLogin.mutate({username:bankCred.username,password:bankCred.password, bankId: Number(bank?.id)});
    
  }

 


    return <div className='flex flex-col gap-5 -top-5'>
  
      <div className='flex gap-1 items-center   max-w-max  left-4' onClick={()=>onClick(null)}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        <span className='text-xs'>go back</span>
      </div>
   
      {bank && <BankLogo bank={bank}   signin={true}/>}
      <form className="">
      <div className="mb-5">
           <input onChange={(e)=>{
            setBankCred({...bankCred,username:e.target.value})
           }} type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder={bank?.placeholder} required />
      </div>
      <div className="mb-5">
          <input onChange={(e)=>{
            setBankCred({...bankCred,password:e.target.value})
           }} type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  " required placeholder='**********'/>
      </div>
      <div className="flex items-start mb-5">
        <div className="flex items-center h-5">
          <input id="remember" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300  " required />
        </div>
        <label htmlFor="remember" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Remember me</label>
      </div>
      {bankLogin.isError && <Error msg={ bankLogin.error.message}/>} 
      {bankAction.isError && <Error msg={ bankAction.error.message}/>} 
      <Button action={handleBankLogin} loading={bankLogin.isPending||bankAction.isPending}/>
     </form></div>
    
  }
  
  