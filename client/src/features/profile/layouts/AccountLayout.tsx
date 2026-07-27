import React from 'react'
import Navbar from '../../../components/common/Navbar'
import Sidebar from '../../../components/account/Sidebar'
import Profile from '../pages/Profile'

const AccountLayout = () => {
    return (
        <div className="min-h-screen bg-white font-sans">
          <Navbar />
            <main className="max-w-6xl mx-auto px-6 pb-20 mt-8">
                <div className="flex flex-col md:flex-row gap-8 lg:gap-12">

                    <Sidebar />
                    <Profile/>
                </div>
            </main>
            
      </div>
      
  )
}

export default AccountLayout