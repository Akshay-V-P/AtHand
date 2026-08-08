import React from 'react'
import ProviderNavbar from '../../../components/provider/ProviderNavbar'
import { Outlet } from 'react-router-dom'

const ProviderLayout = () => {
  return (
      <div className='min-h-screen bg-white flex flex-col'>
          <ProviderNavbar />
          <Outlet/>
    </div>
  )
}

export default ProviderLayout