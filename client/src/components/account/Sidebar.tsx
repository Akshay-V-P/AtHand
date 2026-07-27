import React from 'react'
import SidebarItem from './SidebarItem'
import toast from 'react-hot-toast'
import { accountServices } from '../../features/profile/services/accountServices'
import { useAppDispatch } from '../../features/auth/hooks/storeHook'
import { logout } from '../../features/auth/store/authSlice'

const Sidebar = () => {

  const dispatch = useAppDispatch()

  const logoutHandler = async () => {
    console.log("Logout working")
    try {
      await accountServices.logout()
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
                <SidebarItem label="Log out" isLogout={true} onClick={logoutHandler}/>
              </div>
              
            </div>
          </aside>
  )
}

export default Sidebar