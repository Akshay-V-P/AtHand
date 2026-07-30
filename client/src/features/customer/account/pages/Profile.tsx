import React, { useEffect } from 'react'

import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../../auth/hooks/storeHook'
import { Button } from '../../../../components/common/Button'

const Profile = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)
  const navigate = useNavigate()
  
  return (
    <div className="flex-1 bg-gradient-to-br from-[#d4f0ff] via-[#e4f6fb] to-[#f6fbe3] rounded-[2.5rem] p-8 md:p-12 relative shadow-sm">
            
            {/* Edit Button */}
            <button className="absolute top-8 right-8 bg-[#2A2A2A] hover:bg-black text-white px-6 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm">
              Edit
            </button>
            
            {/* User Header */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-10 mt-4 sm:mt-0">
              
              {/* Avatar with Verified Badge */}
              <div className="relative w-24 h-24">
                {/* Placeholder for Profile Image */}
                <div className="w-full h-full rounded-full bg-gray-300 overflow-hidden shadow-sm">
                  <img src={user?.profilePhotoUrl? user.profilePhotoUrl:"https://placehold.net/default.png"} alt="Profile" className="w-full h-full object-cover" />
                </div>
                
                {/* Verified Blue Check Badge */}
                <div className="absolute bottom-0 right-0 bg-[#007BFF] text-white rounded-full p-1 border-2 border-[#e4f6fb]">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              <div>
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{user?.name}</h2>
                <p className="text-gray-700 font-medium mt-1">Maradu, Kundanoor</p>
              </div>
      </div>

            {/* User Details List */}
            <div className="space-y-6">
              
              <div>
                <p className="text-gray-500 text-sm mb-1 font-medium">Email</p>
          <p className="font-semibold text-gray-900 text-lg">{user?.email }</p>
              </div>
              
        {user?.googleId ? ("")
          :
          (
            <>
            <div>
                <p className="text-gray-500 text-sm mb-1 font-medium">Phone</p>
                <p className="font-semibold text-gray-900 text-lg">8943182696</p>
            </div>
            <div>
                <p className="text-gray-500 text-sm mb-1 font-medium">Password</p>
                {/* Custom Password Input/Button Container */}
                <div className="flex items-center justify-between bg-white/95 rounded-2xl p-2.5 max-w-[320px] shadow-sm">
                  <span className="text-2xl tracking-[0.2em] text-gray-800 leading-none pl-4 translate-y-1">
                    ••••••••••
                  </span>
                  <Button onClick={()=>navigate('/update-password')}>Change</Button>
                </div>
              </div>
              </>
          )
              
            }
              
              

            </div>
          </div>
  )
}

export default Profile