import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { Children, useState } from 'react';
import { trpc } from './utils/trpc';
import { BrowserRouter, Routes , Route, useParams } from "react-router-dom";
import { inferProcedureOutput } from '@trpc/server';
import { AppRouter } from '../../server/src';

export function App() {
 
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      }
    }
  }));
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: 'http://localhost:3004',

          // You can pass any HTTP headers you wish here
          async headers() {
            return {
              // authorization: "Bearer 1",
            };
           },
        }),
      ],
    }),
  );

  return (
    <BrowserRouter >
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {/* Your app here */}
       
        <Routes>
          <Route path="/banks/:token" element={<Banks/>} /> {/* 👈 Renders at /app/ */}
        </Routes>
     
      </QueryClientProvider>
    </trpc.Provider>
 
    </BrowserRouter>
  );
}
function Center({children}:{children:any}){
  return <div className='flex justify-center items-center  min-h-screen overflow-auto '>
    {children}
  </div>
}

 function Button({action}: {action: any}){

  return  <button type="button" onClick={action} className="text-white bg-black  focus:ring-4 focus:outline-none focus:ring-slate-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
  

}

function Banks(){

const banks  = trpc.bank.getBanks.useQuery();
const [selectedBank, setSelectedBank]= useState<bankType[0]|null>(null)


const handleBankSelect = (bank: bankType[0])=>{
  setSelectedBank(bank)
}

  if(banks.isLoading){
    return<Center>
      <div role="status">
    <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
    <span className="sr-only">Loading...</span>
  </div>
  </Center>
  }
 

  return   <Center> 
    <div className='flex flex-col gap-2 w-full sm:max-w-1/2 p-5'>
   {selectedBank ? <BankLogin bank={selectedBank}  onClick={handleBankSelect}/> :  banks.data?.map((x:any)=>{

             return <div className='border-t'>
                  <BankLogo bank={x} onClick={handleBankSelect}/>
             </div>
       
          })}
          

 
    </div>    
    </Center>  
  

}
type bankType = inferProcedureOutput<AppRouter['bank']['getBanks']>;

function BankLogo({bank,onClick ,signin}:{bank: bankType[0],onClick:any,signin?:boolean}){
  return<div onClick={(e)=>onClick(bank)} className='flex gap-4  flex-center items-center p-2   '> <div className='w-14 h-14 border-2 rounded-full flex justify-center p-2 gap-2'>
            <img className="max-h-12 w-full object-contain  "src={bank.logo} alt="" />



            </div>
      <div className='  text-sm w-2/3 text-left flex flex-col gap-1'><span>{bank.bankName}</span><span className='text-slate-400'>{signin && 'Note: These credentials will be considered for future login.' }</span>  </div></div>
}

function BankLogin({bank,onClick}:{bank:bankType[0]|null;onClick:any}){
  console.log(bank?.placeholder)

  return <div className='flex flex-col gap-2'>

    <div className='flex gap-1 items-center mb-10 max-w-max absolute top-2 left-4' onClick={()=>onClick(null)}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
      <span className='text-xs'>go back</span>
    </div>
 
    {bank && <BankLogo bank={bank} onClick={onClick} signin={true}/>}
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

