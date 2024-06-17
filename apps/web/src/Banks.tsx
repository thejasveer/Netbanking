import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Center } from "./components/Center";
import { BankLogin } from "./components/BankLogin";
import { BankLogo } from "./components/BankLogo";
import { bankType } from "./utils/types";
import { trpc } from "./utils/trpc";
import { Auth } from "./components/Auth";
import { Loader } from "./components/Loader";

export function Banks(){
 

    const [searchParams] = useSearchParams();
    useEffect(()=>{
        const token = searchParams.get('token');
            if(token){
                localStorage.setItem("token", token);
            }
     },[])
   
 
    
  
  const banks  = trpc.bank.getBanks.useQuery();
  const [selectedBank, setSelectedBank]= useState<bankType[0]|null>(null)
  
  
  const handleBankSelect = (bank: bankType[0])=>{
    setSelectedBank(bank)
  } 
  
    if(banks.isLoading){
      return <Loader/>
    }
   
  
    return   <Auth>
                <Center> 
                    <div className='flex flex-col gap-2 w-full sm:max-w-1/2 p-5'>
                    {selectedBank ? <BankLogin bank={selectedBank}  onClick={handleBankSelect}/> :  banks.data?.map((x:any)=>{
                
                            return <div className='border-t' key={x.id}>
                                    <BankLogo bank={x} onClick={handleBankSelect}/>
                            </div>
                        
                            })}
                            
                     </div>    
                </Center>  

    </Auth>
    
  
  }