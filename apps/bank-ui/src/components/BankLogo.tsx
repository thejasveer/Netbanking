import { bankType } from "../utils/types";

export function BankLogo({bank,onClick ,signin}:{bank: bankType[0],onClick?:any,signin?:boolean}){
    return<div onClick={()=>onClick(bank)} className='flex gap-4  flex-center items-center p-2   '> <div className='w-14 h-14 border-2 rounded-full flex justify-center p-2 gap-2'>
              <img className="max-h-12 w-full object-contain  "src={bank.logo} alt="" />
  
  
  
              </div>
        <div className='  text-sm w-2/3 text-left flex flex-col gap-1'><span>{bank.bankName}</span><span className='text-slate-400'>{signin && 'Note: These credentials will be considered for future login.' }</span>  </div></div>
  }