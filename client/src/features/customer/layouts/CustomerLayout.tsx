import React from 'react'
import Navbar from '../../../components/common/Navbar'
import { Outlet } from 'react-router-dom'

const CustomerLayout = () => {
  return (
      <div className="min-h-screen bg-white font-sans selection:bg-blue-100">
          <Navbar />
          <Outlet/>
    </div>
  )
}

export default CustomerLayout