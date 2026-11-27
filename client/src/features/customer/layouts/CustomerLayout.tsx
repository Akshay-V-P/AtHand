import Navbar from "@/features/customer/components/Navbar"
import { Outlet } from 'react-router-dom'
import Footer from "@/features/customer/components/Footer"

const CustomerLayout = () => {
  return (
      <div className="min-h-screen bg-white font-sans selection:bg-blue-100 pb-20 md:pb-0">
          <Navbar />
      <Outlet />
      <Footer/>
    </div>
  )
}

export default CustomerLayout