
import Navbar from "@/features/admin/components/Navbar"
import { Outlet } from 'react-router-dom'
import SideBar from "@/features/admin/components/SideBar"
const AdminLayout = () => {
  
  return (
      <div className="flex h-screen bg-[#f8f9fb] ">
            <SideBar/>  
          <div className='w-full overflow-y-scroll'>
            <Navbar />
        <Outlet />
          </div>
    </div>
  )
}

export default AdminLayout