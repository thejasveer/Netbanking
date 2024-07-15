 

export const Row =({keyStr, value}:{keyStr?:string,value:{heading?:string, value?:string}})=>{


    return    <div className="grid grid-cols-4 gap-5">
        <div className="text-sm text-slate-400 font-semibold col-span-1">{keyStr}</div>
        <div className="col-span-3 flex flex-col gap-1">
            <div className="text-sm font-semibold ">{value.heading}</div>
            <div className="text-slate-400 text-sm ">{value.value}</div>
        </div>

    </div>
  
}