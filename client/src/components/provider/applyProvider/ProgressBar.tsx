import React from 'react'

const ProgressBar = ({progress}:{progress:number}) => {
  return (
    <div className="mb-10">
              <div className="flex justify-between items-center mb-3 text-sm font-bold tracking-wide">
                <span className="text-blue-600 uppercase">Step 1 of 3</span>
        <span className="text-gray-700">{ progress? `${progress}% Complete` : "0% Complete"}</span>
              </div>
              <div className="w-full bg-blue-50 rounded-full h-2.5">
                <div className="bg-[#545CEB] h-2.5 rounded-full" style={{ width: `${progress}%` || '1%' }}></div>
              </div>
            </div>
  )
}

export default ProgressBar