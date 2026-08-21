import React, { useEffect } from 'react'
import SideBar from '../../../../components/provider/applyProvider/SideBar'
import { Outlet } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../../hooks/storeHook'
import { apiService } from '../services/apiService'
import { addDocument, setBusinessDetails, setLocationDetails, setServiceDetails } from '../store/appyProviderSlice'

const ApplyAsProviderLayout = () => {
  const user = useAppSelector((state) => state.auth.user)
  const dispatch = useAppDispatch()

  useEffect(() => {
    apiService.getDraft(user?.id!)
      .then(response => {
        const { businessDetails, locationDetails, serviceDetails, documents } = response.data.data
        
        if (businessDetails) {
          dispatch(setBusinessDetails(businessDetails))
        }

        if (locationDetails) {
          dispatch(setLocationDetails(locationDetails))
        }

        if (serviceDetails) {
          dispatch(setServiceDetails(serviceDetails))
        }

        
        if (documents && documents.length >= 1) {
          dispatch(addDocument(documents))
        }
        
        
    })
  }, [])
  
  return (
    <div className="md:flex overflow-hidden max-h-dvh">
        
          <SideBar />
          <Outlet/>
        
      </div>
  )
}

export default ApplyAsProviderLayout