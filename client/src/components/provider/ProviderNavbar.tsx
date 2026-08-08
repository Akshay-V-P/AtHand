import React from 'react'
import {UserCircle} from 'lucide-react'

const ProviderNavbar = () => {
  return (
    <header className="h-16 border-b border-gray-100 flex items-center justify-between px-6 lg:px-8 bg-white z-10">
        <div className="text-2xl font-bold tracking-tight">
          At.Hand <span className="text-red-500">Pro</span>
        </div>
        <div className="flex items-center gap-4 text-blue-600 font-medium cursor-pointer">
          <span className="hover:underline">Help</span>
          <UserCircle className="h-6 w-6" />
        </div>
      </header>
  )
}

export default ProviderNavbar