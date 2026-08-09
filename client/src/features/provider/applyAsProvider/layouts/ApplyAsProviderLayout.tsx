import React from 'react'
import SideBar from '../../../../components/provider/applyProvider/SideBar'
import { Outlet } from 'react-router-dom'

const ApplyAsProviderLayout = () => {
  return (
    <div className="md:flex overflow-hidden max-h-dvh">
        
          <SideBar />
          <Outlet/>
        
      </div>
  )
}

export default ApplyAsProviderLayout