import { Loader } from "./Loader";

export function Button({action,loading=false}: {action: any,loading?:boolean}){

    return  <button type="button" disabled={loading} onClick={action} className="flex justify-center items-center gap-2 text-white bg-black  focus:ring-4 focus:outline-none focus:ring-slate-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center  "><span>{loading &&<Loader btn={true}/>}</span><span>Submit</span></button>
    
   
  }