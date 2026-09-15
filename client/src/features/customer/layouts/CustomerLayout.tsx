import React from 'react'
import Navbar from '../../../components/common/Navbar'
import { Outlet } from 'react-router-dom'
import Footer from '../../../components/user/home/Footer'

const CustomerLayout = () => {
  return (
      <div className="min-h-screen bg-white font-sans selection:bg-blue-100">
          <Navbar />
      <Outlet />
      <Footer/>
    </div>
  )
}

export default CustomerLayout