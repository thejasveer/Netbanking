 
import { trpc } from "../utils/trpc";
import { Center } from "./Center";
import { Loader } from "./Loader";

export const Auth= ({children}:{children:any})=>{
    const userQuery = trpc.user.me.useQuery();
    
   if(userQuery.isLoading){
    return <Loader/>
   }

   if(userQuery.isError){
  debugger
    return <Center>"Not authorised to view this page."</Center>
   }
    return  children 


}