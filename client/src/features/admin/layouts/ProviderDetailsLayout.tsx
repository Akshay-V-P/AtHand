import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import LocationMap from '../../../components/common/LocationMap'
import { adminServices } from '../services/adminServices'
import type { ProviderDetails } from '../../provider/intefaces/IProviderDetails'
import { Modal } from '../../../components/common/Modal'
import toast from 'react-hot-toast'

const badgeColour = {
  ACTIVE: "bg-green-500/50",
  PENDING: "bg-yellow-500",
  BLOCKED: "bg-red-500",
  DRAFT: "bg-gray-500",
}

const textColour = {
  ACTIVE: "text-green-500",
  PENDING: "text-yellow-500",
  BLOCKED: "text-red-500",
  DRAFT: "text-gray-500",
}

const ProviderDetailsLayout = () => {
  const location = useLocation()
  const [provider, setProvider] = useState<ProviderDetails | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  

  const [activeModal, setActiveModal] = useState<'APPROVE' | 'REJECT' | 'SUSPEND' | 'UNBLOCK' | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const id = new URLSearchParams(location.search).get("id") as string || null

  useEffect(() => {
    setUserId(id)
    if (id) {
      adminServices.getProvider(id)
        .then(response => setProvider(response.data.data))
        .catch(error => console.log(error))
    }
  }, [id])

  const handleConfirmAction = async () => {
    if (!id) return
    setIsSubmitting(true)
    let updatedProvider

    try {
      if (activeModal === 'APPROVE') {
        updatedProvider = await adminServices.approveProvider(id)
      } else if (activeModal === 'REJECT') {
        updatedProvider = await adminServices.rejectProvider(id)
      } else if (activeModal === 'SUSPEND') {
        updatedProvider = await adminServices.suspendProvider(id)
      } else if (activeModal === 'UNBLOCK') {
        updatedProvider = await adminServices.unblockProvider(id) 
      }
      
      setActiveModal(null)
      setProvider(updatedProvider?.data.data)
      toast.success(`Provider status successfully updated!`)
    } catch (error: any) {
      console.log(error)
      toast.error(error.response?.data?.message || "Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex-1 overflow-y-scroll max-h-screen p-8 bg-[#f8f9fb] font-sans">
      
      
      <nav className="flex text-sm text-gray-500 mb-6">
        <span className="hover:text-gray-900 cursor-pointer">Provider Management</span>
        <span className="mx-2">›</span>
        <span className="text-gray-900 font-medium">Edit Provider</span>
      </nav>

      
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        
        
        <div className="flex flex-col w-full sm:flex-row items-start sm:items-center gap-5">
          {/* Provider Logo/Icon */}
          <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          
          <div className="flex flex-col space-y-3 min-w-84">
            <h1 className="text-3xl font-bold text-gray-900 leading-none">{provider?.businessName}</h1>
            <div className="flex flex-wrap items-center gap-3">
              {/* Rating Badge */}
              <div className="flex items-center space-x-1 bg-gray-100 px-2.5 py-1 rounded-full text-sm font-semibold text-gray-700">
                <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>{provider?.averageRating}</span>
              </div>
              
              {/* Status Badge */}
              <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-sm font-medium ${textColour[provider?.status!]}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${badgeColour[provider?.status!]}`}></span>
                <span>{provider?.status}</span>
              </div>
            </div>
          </div>
          
          <LocationMap
            latitude={provider?.location?.coordinates.coordinates[1]}
            longitude={provider?.location?.coordinates.coordinates[0]}
          />
        </div>

        {/* Right Side: Quick Actions */}
        <div className="bg-slate-50 border border-slate-100 p-5 rounded-xl w-full xl:w-auto">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Quick Actions</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            {provider?.status === "PENDING" ? (
              <>
                <button 
                  onClick={() => setActiveModal('APPROVE')}
                  className="flex-1 xl:flex-none flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Approve</span>
                </button>

                <button 
                  onClick={() => setActiveModal('REJECT')}
                  className="flex-1 xl:flex-none flex items-center justify-center space-x-2 bg-red-700 hover:bg-red-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  <span>Reject</span>
                </button>
              </>
            ) : provider?.status === "BLOCKED" ? (
              <button 
                onClick={() => setActiveModal('UNBLOCK')}
                className="flex-1 xl:flex-none flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0v4m-4 8v-4m-6-4h12a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2z" />
                </svg>
                <span>Unblock</span>
              </button>
            ) : (
              <button 
                onClick={() => setActiveModal('SUSPEND')}
                className="flex-1 xl:flex-none flex items-center justify-center space-x-2 bg-red-700 hover:bg-red-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
                <span>Suspend</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-8 flex overflow-x-auto hide-scrollbar">
        <NavLink 
          to={`/admin/provider-management/profile?id=${userId}`}
          className={({ isActive }) =>
            `flex items-center space-x-2 border-b-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
              isActive ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`
          }
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
          <span>Business Details</span>
        </NavLink>

        <NavLink 
          to={`/admin/provider-management/service${location.search}`}
          className={({ isActive }) =>
            `flex items-center space-x-2 border-b-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
              isActive ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`
          }
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
          <span>Service Catalog</span>
        </NavLink>

        <NavLink 
          to={`/admin/provider-management/documents${location.search}`}
          className={({ isActive }) =>
            `flex items-center space-x-2 border-b-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
              isActive ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`
          }
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          <span>Verification Documents</span>
        </NavLink>

        <NavLink 
          to={`/admin/provider-management/metrics${location.search}`}
          className={({ isActive }) =>
            `flex items-center space-x-2 border-b-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
              isActive ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`
          }
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
          <span>Performance Metrics</span>
        </NavLink>
      </div>

      <Outlet context={{ provider, setProvider }} />

      {/* Confirmation Modal */}
      <Modal
        isOpen={activeModal !== null} 
        onClose={() => setActiveModal(null)}
        title={
          activeModal === 'APPROVE' ? 'Approve Provider' :
          activeModal === 'REJECT' ? 'Reject Provider' :
          activeModal === 'SUSPEND' ? 'Suspend Provider' : 'Unblock Provider'
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            {activeModal === 'APPROVE' && `Are you sure you want to approve "${provider?.businessName || 'this provider'}"? They will gain active status on the platform.`}
            {activeModal === 'REJECT' && `Are you sure you want to reject "${provider?.businessName || 'this provider'}"? This action is hard to undo.`}
            {activeModal === 'SUSPEND' && `Are you sure you want to suspend "${provider?.businessName || 'this provider'}"? Their account access will be blocked temporarily.`}
            {activeModal === 'UNBLOCK' && `Are you sure you want to unblock "${provider?.businessName || 'this provider'}"? Their account access will be restored.`}
          </p>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleConfirmAction}
              className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors cursor-pointer ${
                activeModal === 'APPROVE' || activeModal === 'UNBLOCK' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-700 hover:bg-red-800'
              } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Processing...' : 'Confirm'}
            </button>
          </div>
        </div>
      </Modal>

    </div>
  )
}

export default ProviderDetailsLayout
