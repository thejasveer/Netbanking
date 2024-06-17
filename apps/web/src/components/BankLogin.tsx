import { useSearchParams } from "react-router-dom";
import { bankType } from "../utils/types";
import { BankLogo } from "./BankLogo";
import { Button } from "./Button";
import { useEffect } from "react";

export function BankLogin({bank,onClick}:{bank:bankType[0]|null;onClick:any}){
 

  const [searchParams] = useSearchParams();
  useEffect(()=>{
    console.log("yes")
      const token = searchParams.get('paymentToken');
          if(token){
              
          }
   },[])
  
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
           <input type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={bank?.placeholder} required />
      </div>
      <div className="mb-5">
          <input type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required placeholder='**********'/>
      </div>
      <div className="flex items-start mb-5">
        <div className="flex items-center h-5">
          <input id="remember" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" required />
        </div>
        <label htmlFor="remember" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Remember me</label>
      </div>
      <Button action={()=>{}}/>
     </form></div>
    
  }
  
  