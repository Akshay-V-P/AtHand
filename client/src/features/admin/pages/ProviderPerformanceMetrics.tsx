import React, { useState} from 'react';
import { useOutletContext } from 'react-router-dom';
import type { ProviderDetails } from '../../provider/intefaces/IProviderDetails';

const ProviderPerformanceMetrics = () => {
  const [activeTab, setActiveTab] = useState('7 Days');

  // Mock data for the chart matching the screenshot
  const chartData = [
    { day: 'MON', total: 100, earned: 60 },
    { day: 'TUE', total: 100, earned: 75 },
    { day: 'WED', total: 100, earned: 45 },
    { day: 'THU', total: 100, earned: 0 },
    { day: 'FRI', total: 100, earned: 0 },
    { day: 'SAT', total: 100, earned: 90 },
    { day: 'SUN', total: 100, earned: 40 },
    ];
    
    const { provider } = useOutletContext<{ provider: ProviderDetails | null }>()

  return (
    <div className="flex flex-col font-sans">
      
      {/* Controls: Time Filter & Export */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex bg-gray-200/70 p-1 rounded-lg">
          {['7 Days', '30 Days', 'Quarter'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 text-sm font-semibold rounded-md transition-all ${
                activeTab === tab
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <button className="flex items-center gap-2 bg-[#0057d9] hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export Report
        </button>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
        
        {/* Total Earnings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
            <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-bold">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              12.5%
            </span>
          </div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Total Earnings</h3>
          <div className="text-3xl font-black text-gray-900 tracking-tight">₹142,850<span className="text-xl text-gray-800">.00</span></div>
        </div>

        {/* Completion Rate */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-gray-50 text-gray-800 flex items-center justify-center border border-gray-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 px-2 py-1 rounded-full text-xs font-bold">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" /></svg>
              0.8%
            </span>
          </div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Completion Rate</h3>
          <div className="text-3xl font-black text-gray-900 tracking-tight mb-4">98.2%</div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 mt-auto">
            <div className="bg-[#0057d9] h-1.5 rounded-full" style={{ width: '98.2%' }}></div>
          </div>
        </div>

        {/* Average Rating */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
            </div>
            <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-bold">
              Steady
            </span>
          </div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Average Rating</h3>
          <div className="text-3xl font-black text-gray-900 tracking-tight mb-3">{provider?.averageRating} <span className="text-lg text-gray-500 font-medium">/ 5.0</span></div>
          <div className="flex items-center gap-1 mt-auto text-[#0057d9]">
            {[1, 2, 3, 4].map((star) => (
              <svg key={star} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            ))}
            <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
          </div>
        </div>

        {/* Response Time */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-bold">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              4m faster
            </span>
          </div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Response Time</h3>
          <div className="text-3xl font-black text-gray-900 tracking-tight mb-2">12 <span className="text-lg text-gray-500 font-medium">mins</span></div>
          <div className="text-sm text-gray-500 mt-auto">
            Target: &lt; 15 mins
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-lg font-bold text-gray-900">Earnings & Completion Trend</h2>
          <div className="flex items-center gap-6 text-sm font-medium text-gray-600">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#0057d9]"></span>
              Earnings
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-gray-900"></span>
              Completion
            </div>
          </div>
        </div>

        {/* Chart Body (Simulated via flexbox) */}
        <div className="relative h-64 w-full flex items-end justify-between px-2 sm:px-8 border-b border-gray-200 pb-4">
          {chartData.map((data, index) => (
            <div key={index} className="flex flex-col items-center gap-4 w-12 group">
              {/* Bar */}
              <div className="relative w-8 bg-[#eef1f6] h-48 rounded-sm overflow-hidden flex items-end">
                {/* Inner Filled Bar */}
                <div 
                  className="w-full bg-[#0057d9] rounded-sm transition-all duration-500 group-hover:bg-blue-700" 
                  style={{ height: `${data.earned}%` }}
                ></div>
              </div>
              {/* X-Axis Label */}
              <span className="text-xs font-bold text-gray-500 tracking-wider">
                {data.day}
              </span>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
};

export default ProviderPerformanceMetrics;