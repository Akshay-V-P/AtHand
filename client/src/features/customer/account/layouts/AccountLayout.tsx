import React from 'react'

import Profile from '../pages/Profile'
import Navbar from "@/features/customer/components/Navbar"
import Sidebar from "@/features/customer/account/components/Sidebar"
import { Outlet } from 'react-router-dom'

const AccountLayout = () => {
    return (
        <div className="min-h-screen bg-white font-sans">
            <main className="max-w-6xl mx-auto px-6 pb-20 mt-8">
                <div className="flex flex-col md:flex-row gap-8 lg:gap-12">

                    <Sidebar />
                    <Outlet/>
                </div>
            </main>
            
      </div>
      
  )
}

export default AccountLayout