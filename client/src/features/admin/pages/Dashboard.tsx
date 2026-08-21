import React from 'react'
import Badge from '../../../components/admin/Badge'
import StatCard from '../../../components/admin/StatCard'

const Dashboard = () => {
  return (
    <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto max-h-screen p-8">
          
          {/* Page Header */}
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
              <p className="text-sm text-gray-500 mt-1">Real-time health metrics of the platform ecosystem.</p>
            </div>
            <button className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-200 transition-colors">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <span>Oct 01, 2023 - Oct 31, 2023</span>
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatCard 
              title="Total Revenue" value="₹124,000" trend="+12%" trendType="positive" iconBg="bg-blue-100 text-blue-600"
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
            />
            <StatCard 
              title="Active Providers" value="1,248" subtitle="Highest Density: Maradu" trend="Stable" trendType="neutral" iconBg="bg-indigo-100 text-indigo-600"
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
            />
            <StatCard 
              title="Active Users" value="8,522" subtitle="Fastest Growing: Maradu" trend="+4.3%" trendType="positive" iconBg="bg-purple-100 text-purple-600"
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
            />
            <StatCard 
              title="Pending Approvals" value="42" trend="Urgent" trendType="urgent" iconBg="bg-red-100 text-red-600"
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>}
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Line Chart Placeholder */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm lg:col-span-2">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">Revenue over Time</h3>
                <div className="flex space-x-2">
                  <button className="bg-blue-600 text-white px-3 py-1 text-xs font-semibold rounded-md">Monthly</button>
                  <button className="text-gray-500 hover:text-gray-900 px-3 py-1 text-xs font-semibold rounded-md">Weekly</button>
                </div>
              </div>
              <div className="h-64 relative flex items-end">
                {/* Mock SVG Line Chart */}
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 50">
                  <path d="M0,45 Q15,40 25,45 T50,25 T75,35 T100,5" fill="none" stroke="#2563eb" strokeWidth="1.5" />
                </svg>
                {/* Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  <div className="w-full border-b border-gray-100 flex-1 relative"><span className="absolute -top-2 text-[10px] text-gray-400">150k</span></div>
                  <div className="w-full border-b border-gray-100 flex-1 relative"><span className="absolute -top-2 text-[10px] text-gray-400">100k</span></div>
                  <div className="w-full border-b border-gray-100 flex-1 relative"><span className="absolute -top-2 text-[10px] text-gray-400">50k</span></div>
                  <div className="w-full border-b border-gray-100 relative"><span className="absolute -top-2 text-[10px] text-gray-400">0</span></div>
                </div>
                <div className="absolute bottom-[-20px] w-full flex justify-between text-[10px] text-gray-400 font-medium px-4">
                  <span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Nov</span>
                </div>
              </div>
            </div>

            {/* Donut Chart Placeholder */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center">
              <h3 className="text-lg font-bold text-gray-900 w-full text-left mb-6">Service Categories</h3>
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                   <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e5e7eb" strokeWidth="4" />
                   <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#2563eb" strokeWidth="4" strokeDasharray="85, 100" />
                </svg>
                <div className="absolute text-center">
                  <span className="block text-3xl font-bold text-gray-900">8</span>
                  <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Total Types</span>
                </div>
              </div>
              <div className="w-full mt-8 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center text-gray-700"><span className="w-3 h-3 rounded-full bg-blue-600 mr-2"></span>Electronics</div>
                  <span className="font-semibold">42%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center text-gray-700"><span className="w-3 h-3 rounded-full bg-blue-200 mr-2"></span>Mechanical</div>
                  <span className="font-semibold">28%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center text-gray-700"><span className="w-3 h-3 rounded-full bg-gray-300 mr-2"></span>Heavy Machine</div>
                  <span className="font-semibold">15%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-white">
              <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
              <button className="text-sm font-semibold text-blue-600 hover:text-blue-800">View All Actions</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200 font-semibold">
                  <tr>
                    <th className="px-6 py-4">Action Details</th>
                    <th className="px-6 py-4">Entity</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Timestamp</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900">New provider 'CleanCo' registered</td>
                    <td className="px-6 py-4"><Badge text="Provider" type="Provider" /></td>
                    <td className="px-6 py-4 text-gray-500">San Francisco, CA</td>
                    <td className="px-6 py-4 text-gray-500">Oct 24, 14:32</td>
                    <td className="px-6 py-4"><Badge text="Pending Approval" type="Pending" /></td>
                    <td className="px-6 py-4 text-right text-gray-400 hover:text-gray-600 cursor-pointer">
                      <svg className="w-5 h-5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900">Dispute #482 resolved</td>
                    <td className="px-6 py-4"><Badge text="Transaction" type="Transaction" /></td>
                    <td className="px-6 py-4 text-gray-500">Austin, TX</td>
                    <td className="px-6 py-4 text-gray-500">Oct 24, 12:15</td>
                    <td className="px-6 py-4"><Badge text="Completed" type="Completed" /></td>
                    <td className="px-6 py-4 text-right text-gray-400 hover:text-gray-600 cursor-pointer">
                      <svg className="w-5 h-5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900">System maintenance scheduled</td>
                    <td className="px-6 py-4"><Badge text="System" type="System" /></td>
                    <td className="px-6 py-4 text-gray-500">Global Hub</td>
                    <td className="px-6 py-4 text-gray-500">Oct 23, 23:00</td>
                    <td className="px-6 py-4"><Badge text="Scheduled" type="Scheduled" /></td>
                    <td className="px-6 py-4 text-right text-gray-400 hover:text-gray-600 cursor-pointer">
                      <svg className="w-5 h-5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900">Payout of $2,400 to 'SparkleX'</td>
                    <td className="px-6 py-4"><Badge text="Payout" type="Payout" /></td>
                    <td className="px-6 py-4 text-gray-500">New York, NY</td>
                    <td className="px-6 py-4 text-gray-500">Oct 23, 16:45</td>
                    <td className="px-6 py-4"><Badge text="Success" type="Success" /></td>
                    <td className="px-6 py-4 text-right text-gray-400 hover:text-gray-600 cursor-pointer">
                      <svg className="w-5 h-5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900">Security alert: Multiple failed logins</td>
                    <td className="px-6 py-4"><Badge text="Security" type="Security" /></td>
                    <td className="px-6 py-4 text-gray-500">Seattle, WA</td>
                    <td className="px-6 py-4 text-gray-500">Oct 23, 09:12</td>
                    <td className="px-6 py-4"><Badge text="Investigating" type="Investigating" /></td>
                    <td className="px-6 py-4 text-right text-gray-400 hover:text-gray-600 cursor-pointer">
                      <svg className="w-5 h-5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
        </div>
      </main>
  )
}

export default Dashboard