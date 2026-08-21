import React, { useEffect } from 'react'
import ReadOnlyInput from '../../../components/admin/ReadonlyInput'
import ServicePill from '../../../components/admin/ServicePill'
import { useOutletContext } from 'react-router-dom'
import type { ProviderDetails } from '../../provider/intefaces/IProviderDetails'

const EditProviderProfile = () => {

  const { provider } = useOutletContext<{ provider: ProviderDetails | null }>()

  console.log(provider)
  

    return (
    <div className='overflow-y-auto max-h-screen'>
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 mb-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-gray-900">Company Profile</h2>
          <button className="flex items-center space-x-1.5 text-blue-600 hover:text-blue-800 text-sm font-semibold transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            <span>Edit Details</span>
          </button>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <ReadOnlyInput label="Legal Business Name" value={provider?.businessName || ''} />
          <ReadOnlyInput label="Tax ID / EIN" value="XX-XXXX6789" />
          <ReadOnlyInput label="Primary Contact" value={provider?.contactPerson || ''} />
          <ReadOnlyInput label="Business Phone" value={provider?.phone || ''} />
          
          <ReadOnlyInput 
            fullWidth 
            label="Service Region" 
            value={`${provider?.location?.address.street}, ${provider?.location?.address.city}`} 
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>} 
          />
        </form>
      </div>

      
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Service Catalog</h2>
        
        <div className="flex flex-wrap items-center gap-4">
          <ServicePill 
            label="Electronics" 
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>}
          />
          <ServicePill 
            label="Mobile" 
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>}
          />
          
          <button className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Category</span>
          </button>
        </div>
            </div>
            </div>
  )
}

export default EditProviderProfile