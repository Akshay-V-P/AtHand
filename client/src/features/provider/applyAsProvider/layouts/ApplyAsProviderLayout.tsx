import React from 'react'
import SideBar from '../../../../components/provider/SideBar'
import { Outlet } from 'react-router-dom'

const ApplyAsProviderLayout = () => {
  return (
    <div className="md:flex overflow-hidden">
        {/* Left Sidebar */}
          <SideBar />
          <Outlet/>
        
      </div>
  )
}

export default ApplyAsProviderLayout