import React from 'react';
import { useOutletContext } from 'react-router-dom';
import type { ProviderDetails } from '../../provider/intefaces/IProviderDetails'; // Adjust import if needed

const ProviderServiceCatalog = () => {
  // You can access the provider details passed from ProviderDetailsLayout here
  const { provider } = useOutletContext<{ provider: ProviderDetails | null }>();

  // Mock data matching the UI
  const services = [
    {
      id: 1,
      name: 'Mobile Service',
      category: 'Mobile',
      regions: ['N', 'S', 'D'],
      extraRegions: '+5',
      price: '₹250/hr',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Laptop Service',
      category: 'Laptop',
      regions: ['D', 'E'],
      extraRegions: '+2',
      price: '₹400Flat',
      status: 'Active',
    },
    {
      id: 3,
      name: 'Tablet service',
      category: 'Tablet',
      regions: ['N', 'D'],
      extraRegions: null,
      price: '₹250/hr',
      status: 'Draft',
    },
    {
      id: 4,
      name: 'Pc service',
      category: 'Pc',
      regions: ['C', 'I', 'D'],
      extraRegions: null,
      price: '₹1500.00 Base',
      status: 'Suspended',
    },
  ];

  return (
    <div className="flex flex-col space-y-6">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Services Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-medium text-gray-500">Total Services</span>
            <div className="text-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">12</h3>
            <p className="text-sm text-gray-500"><span className="text-green-600 font-medium">+2</span> this month</p>
          </div>
        </div>

        {/* Avg Service Price Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-medium text-gray-500">Avg. Service Price</span>
            <div className="text-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">₹350.50</h3>
            <p className="text-sm text-gray-500">Market competitive</p>
          </div>
        </div>

        {/* Service Coverage Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-medium text-gray-500">Service Coverage</span>
            <div className="text-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">8 Regions</h3>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              100% operational
            </p>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Table Header Controls */}
        <div className="px-6 py-5 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-lg font-bold text-gray-900">Service Catalog</h2>
          <div className="flex items-center gap-3">
            <select className="border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-3 py-2 bg-white">
              <option>All Categories</option>
              <option>Mobile</option>
              <option>Laptop</option>
              <option>Tablet</option>
            </select>
            <button className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Service Name</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Active Regions</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Base Price</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {services.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-5 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {service.name}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600">
                    {service.category}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      {service.regions.map((region, index) => (
                        <span key={index} className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center text-xs font-bold">
                          {region}
                        </span>
                      ))}
                      {service.extraRegions && (
                        <span className="w-7 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-bold">
                          {service.extraRegions}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {service.price}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        service.status === 'Active'
                          ? 'bg-green-100 text-green-700'
                          : service.status === 'Draft'
                          ? 'bg-gray-100 text-gray-600'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {service.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <span className="text-sm text-gray-500">Showing 4 of 12 services</span>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-200 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 disabled:opacity-50">
              Previous
            </button>
            <button className="px-4 py-2 border border-gray-200 text-sm font-medium text-gray-900 rounded-lg hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderServiceCatalog;