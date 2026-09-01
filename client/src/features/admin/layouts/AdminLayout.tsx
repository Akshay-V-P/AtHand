
import Navbar from '../../../components/admin/Navbar'
import { Outlet } from 'react-router-dom'
import SideBar from '../../../components/admin/SideBar'
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