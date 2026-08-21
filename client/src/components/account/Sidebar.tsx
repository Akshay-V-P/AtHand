import React, { useState } from 'react'
import SidebarItem from './SidebarItem'
import toast from 'react-hot-toast'
import { useAppDispatch } from '../../hooks/storeHook'
import { logout } from '../../features/auth/store/authSlice'
import { accountServices } from '../../features/customer/account/services/accountServices'
import { Modal } from '../common/Modal'

const Sidebar = () => {

  const dispatch = useAppDispatch()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const logoutHandler = async () => {
    try {
      await accountServices.logout({context:"USER"})
      dispatch(logout())
    } catch (error:any) {
      console.log(error)
      toast.error(error.response?.message || "Something went wrong")
    }
  }

  return (
    <aside className="w-full md:w-64 lg:w-72 shrink-0">
            <div className="border border-gray-100 rounded-[2rem] p-4 shadow-sm bg-white flex flex-col h-full min-h-[500px]">
              
              {/* Main Nav Items */}
              <div className="flex flex-col gap-3">
                <SidebarItem label="Profile" isActive={true} />
                <SidebarItem label="My Requests" />
                <SidebarItem label="Service History" />
                <SidebarItem label="Address" />
                <SidebarItem label="Favorites" />
                <SidebarItem label="Wallet" />
              </div>

              {/* Logout (Pushed to bottom) */}
              <div className="mt-auto pt-16">
                <SidebarItem label="Log out" isLogout={true} onClick={()=>setIsModalOpen(true)}/>
              </div>
              
      </div>
      <Modal isOpen={isModalOpen} onClose={()=>setIsModalOpen(false)} title='Logout'>
        <p className="text-gray-600 font-medium text-[1.05rem] leading-relaxed mb-8">
          Are you sure you want to logout?
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <button 
            onClick={() => setIsModalOpen(false)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-medium text-sm border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            No
          </button>
          <button 
            onClick={() => {
              logoutHandler()
              setIsModalOpen(false);
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-medium text-sm bg-[#e30000] hover:bg-[#9f0000] text-white shadow-md transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>
      </Modal>
          </aside>
  )
}

export default Sidebar