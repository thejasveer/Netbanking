export const Back=({fn}:{fn:any})=>{


    return    <div className='flex gap-1 items-center cursor-pointer   max-w-max  left-4' onClick={fn}>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
    <span className='text-xs'>go back</span>
  </div>

    
}