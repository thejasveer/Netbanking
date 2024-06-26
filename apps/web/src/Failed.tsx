 
import { useEffect } from "react";
import { Auth } from "./components/Auth";
export const Failed=()=>{
    
 

    useEffect(()=>{
        let timer;
       timer = setTimeout(()=>{
            if (window) {
         
                window.close();
            }
        },3000)
     return ()=> clearTimeout(timer)
    },[])
  
 
    return <Auth>
        
        
                <div className="bg-gray-100 h-screen flex justify-center items-center">
                    <div className=" p-6  md:mx-auto">
                 
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-red-600 w-16 h-16 mx-auto my-6">
                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" />
                    </svg>

                    <div className="text-center flex flex-col items-center gap-3">
                        <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">Payment Failed!</h3>
                        <p className="text-gray-600 my-2">Oops you don't have enough funds to proceed.</p>
                      
                      
                    </div>
                </div>
                </div>
     

    </Auth>
}