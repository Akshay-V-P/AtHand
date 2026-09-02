import React, { useEffect, useState } from 'react'
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react'
import ProviderRow from '../../../components/admin/ProviderRow'
import FilterSelect from '../../../components/admin/FilterSelect'
import { adminServices } from '../services/adminServices'

interface FetchProviderResponse {
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
    totalPages: 0
  })

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);

  const fetchProviders = async (
    page = 1,
    searchValue = search,
    statusVal = statusFilter,
    categoryVal = categoryFilter,
    sortVal = sortOption
  ) => {
    try {
      setLoading(true);

      let sort;
      let sortOrder;
      if (sortVal) {
        const parts = sortVal.split('_');
        sort = parts[0];
        sortOrder = parts[1];
      }

      const response = await adminServices.getProviders({
        page,
        limit: providerData.limit,
        search: searchValue || undefined,
        status: statusVal || undefined,
        categoryId: categoryVal || undefined,
        sort,
        sortOrder
      });

      setProviderData(response.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchProviders(1, "", "", "", "");
    adminServices.getAllCategories({ page: 1, limit: 100 })
      .then(res => setCategories(res.data.data.items || []))
      .catch(console.error);
  }, []);

  // Debounced search
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchProviders(1, search, statusFilter, categoryFilter, sortOption);
    }, 500);

    return () => clearTimeout(timeout);
  }, [search]);

  // Status, Category & Sort filters
  useEffect(() => {
    fetchProviders(1, search, statusFilter, categoryFilter, sortOption);
  }, [statusFilter, categoryFilter, sortOption]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > providerData.totalPages) return;
    fetchProviders(page, search, statusFilter, categoryFilter, sortOption);
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
        <div className="flex-1 bg-white p-5 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl shadow-sm">

          {/* Search */}
          <div className="relative w-full sm:w-[350px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by business name or email..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none flex items-center gap-2 pl-4 pr-10 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="DRAFT">Draft</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="BLOCKED">Blocked</option>
              </select>
              <SlidersHorizontal className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="appearance-none flex items-center gap-2 pl-4 pr-10 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <SlidersHorizontal className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="appearance-none flex items-center gap-2 pl-4 pr-10 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="">Sort by: Default</option>
                <option value="averageRating_desc">Highest Rating</option>
                <option value="averageRating_asc">Lowest Rating</option>
                <option value="businessName_asc">Name (A-Z)</option>
                <option value="businessName_desc">Name (Z-A)</option>
              </select>
              <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
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
                  providerData.items.map((provider: any) => (
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
            <button onClick={() => handlePageChange(providerData.page - 1)} disabled={providerData.page <= 1} className="px-3 py-1.5 border border-gray-200 rounded-md text-gray-400 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>

            <button className="px-3 py-1.5 border border-gray-200 rounded-md text-gray-700 bg-white hover:bg-gray-50 font-medium text-sm">{providerData.page}</button>

            <button onClick={() => handlePageChange(providerData.page + 1)} disabled={providerData.totalPages <= providerData.page} className="px-3 py-1.5 border border-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed text-gray-500 bg-white hover:bg-gray-50 cursor-pointer">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}

export default ProviderManagement