import React, { useEffect, useState } from 'react'
import ProviderRow from '../../../components/admin/ProviderRow'
import FilterSelect from '../../../components/admin/FilterSelect'
import { adminServices } from '../services/adminServices'

interface FetchProviderResponse{
  items: [];
  totalItems: number;
  page: number;
  limit: number;
  totalPages: number;
}

const ProviderManagement = () => {
  const [providerData, setProviderData] = useState<FetchProviderResponse>({
    items: [],
    totalItems: 0,
    page: 1,
    limit: 10,
    totalPages:0
  })
    useEffect(() => {
        adminServices.getProviders()
          .then(response => { setProviderData(response.data.data); })
            .catch(error => console.log(error))
        
    }, [])
  
  const handlePageChange = async(page: number) => {
    try {
        
        const response = await adminServices.getProviders({page, limit:10})
        
        setProviderData(response.data.data)
      } catch (error) {
        console.log(error)
      }
  }

    
    
  return (
    <div className="flex-1 overflow-y-auto p-8 bg-[#f8f9fb] font-sans">
      
      {/* Breadcrumbs & Header */}
      <div className="mb-8">
        <nav className="flex text-xs text-gray-500 mb-2">
          <span className="hover:text-gray-900 cursor-pointer">Dashboard</span>
          <span className="mx-2">›</span>
          <span className="text-blue-600 font-medium">Providers</span>
        </nav>
        <h1 className="text-3xl font-bold text-gray-900">Provider Management</h1>
        <p className="text-sm text-gray-500 mt-1">Manage, verify, and monitor registered service providers.</p>
      </div>

      {/* Top Action / Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        
        {/* Filters Card */}
        <div className="flex-1 bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
            <FilterSelect label="Filter by Status" value="All Statuses" />
            <FilterSelect label="Category" value="All Categories" />
            <FilterSelect label="Location" value="All Locations" />
            <FilterSelect
              label="Rating" 
              value="4.0+ Stars" 
              icon={<svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>}
            />
          </div>
        </div>

        {/* Stats Card */}
        <div className="lg:w-80 bg-[#1e293b] p-5 rounded-xl shadow-sm flex flex-col justify-center text-white">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Active Providers by Region</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-medium">Northeast</span>
                <span className="font-bold">42%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '42%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-medium">West Coast</span>
                <span className="font-bold">31%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div className="bg-blue-400 h-1.5 rounded-full" style={{ width: '31%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/80 text-xs uppercase text-gray-500 font-semibold tracking-wider">
              <tr>
                <th scope="col" className="px-6 py-4 text-left">Provider Name</th>
                <th scope="col" className="px-6 py-4 text-left">Category</th>
                <th scope="col" className="px-6 py-4 text-left">Location</th>
                <th scope="col" className="px-6 py-4 text-left">Status</th>
                <th scope="col" className="px-6 py-4 text-left">Rating</th>
                <th scope="col" className="px-6 py-4 text-left">Total Earnings</th>
                <th scope="col" className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                          {
                              providerData?.items.length >= 1 ?
                                  providerData.items.map((provider:any) => (
                                      <ProviderRow 
                                          key={provider.id}
                                            initials=""
                                            name={provider.businessName}
                                            id={provider.id}
                                            category={provider.serviceCategory.name}
                                            location={provider.location.address.street}
                                            status={provider.status}
                                            rating={provider.averageRating}
                                            earnings="₹0"
                                            actionType="ban"
                                        />
                                  ))

                                  :
                                  <tr>
                    <td>

                    <p>Nothing to show</p>
                    </td>
                                  </tr>
                          
                          }
              
              
             
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50/50 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {providerData.page} to {providerData.totalPages} of {providerData.totalItems || 0} providers
          </p>
          <div className="flex space-x-1">
            <button onClick={()=>handlePageChange(providerData.page-1)} disabled={providerData.page <= 1} className="px-3 py-1.5 border border-gray-200 rounded-md text-gray-400 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            
            <button className="px-3 py-1.5 border border-gray-200 rounded-md text-gray-700 bg-white hover:bg-gray-50 font-medium text-sm">{ providerData.page}</button>
            
            <button onClick={()=>handlePageChange(providerData.page+1)} disabled={ providerData.totalPages<=providerData.page} className="px-3 py-1.5 border border-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed text-gray-500 bg-white hover:bg-gray-50 cursor-pointer">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>
      
    </div>
  )
}

export default ProviderManagement