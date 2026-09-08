// pages/index.jsx (or page.jsx if using Next.js App Router)
import React from 'react';
import { FileText, Calendar as CalendarIcon, MessageCircle, Plus, MoreVertical, PlusCircle, Wrench, Star } from 'lucide-react';

export default function Dashboard() {
  return (
    <>
      <div className="max-w-7xl mx-auto p-8">
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Good evening, Marcus</h1>
            <p className="text-gray-500 text-sm">You have 4 appointments today and 2 pending requests.</p>
          </div>
          <div className="mt-4 md:mt-0 flex bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
            <button className="px-4 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-md">Day</button>
            <button className="px-4 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md">Week</button>
            <button className="px-4 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md">Month</button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column (takes 2 cols on large screens) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Active Projects */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Active Projects</h2>
                <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">View all</a>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Project Card 1 */}
                <div className="border border-gray-100 rounded-lg p-4 bg-gray-50/30">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 bg-indigo-100 rounded-md flex items-center justify-center">
                      <FileText className="w-5 h-5 text-indigo-600" />
                    </div>
                    <span className="text-[10px] font-bold tracking-wide text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full uppercase">On track</span>
                  </div>
                  <h3 className="font-semibold text-sm mb-1 leading-tight">Motherboard Repair - Lenovo ThinkPad</h3>
                  <p className="text-xs text-gray-500 mb-6 h-8 line-clamp-2">Phase 2: Micro-soldering and component testing...</p>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                    <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-gray-500">65% Complete</span>
                    <span className="text-gray-900">Due in 4 days</span>
                  </div>
                </div>

                {/* Project Card 2 */}
                <div className="border border-gray-100 rounded-lg p-4 bg-gray-50/30">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-md flex items-center justify-center">
                      <Wrench className="w-5 h-5 text-orange-600" />
                    </div>
                    <span className="text-[10px] font-bold tracking-wide text-indigo-700 bg-indigo-100 px-2 py-1 rounded-full uppercase">In review</span>
                  </div>
                  <h3 className="font-semibold text-sm mb-1 leading-tight">Lathe Machine Calibration - Fabrikam Industries</h3>
                  <p className="text-xs text-gray-500 mb-6 h-8 line-clamp-2">Final logo iterations pending client feedback...</p>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                    <div className="bg-amber-600 h-1.5 rounded-full" style={{ width: '88%' }}></div>
                  </div>
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-gray-500">88% Complete</span>
                    <span className="text-gray-900">Due Tomorrow</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Weekly Earnings */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
               <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-lg font-semibold mb-1">Weekly Earnings</h2>
                    <p className="text-sm text-gray-500">Total revenue this week: <span className="font-medium text-gray-900">$3,420.00</span></p>
                  </div>
                  <span className="text-emerald-500 font-medium text-sm flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                    +12.4%
                  </span>
               </div>
               
               {/* Bar Chart Representation */}
               <div className="h-48 flex items-end justify-between px-2 sm:px-8">
                  {[
                    { day: 'MON', h: '35%' },
                    { day: 'TUE', h: '55%' },
                    { day: 'WED', h: '45%' },
                    { day: 'THU', h: '85%', active: true },
                    { day: 'FRI', h: '50%' },
                    { day: 'SAT', h: '20%' },
                    { day: 'SUN', h: '10%' },
                  ].map((bar, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 flex-1">
                      <div className={`w-8 sm:w-12 rounded-t-sm ${bar.active ? 'bg-indigo-600' : 'bg-indigo-100'}`} style={{ height: bar.h }}></div>
                      <span className={`text-xs ${bar.active ? 'text-indigo-600 font-bold' : 'text-gray-400'}`}>{bar.day}</span>
                    </div>
                  ))}
               </div>
            </div>

          </div>

          {/* Right Column */}
          <div className="space-y-6">
            
            {/* Quick Actions */}
            <div className="bg-slate-50/50 rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xs font-bold text-gray-500 tracking-wider uppercase mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                <button className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-indigo-300 transition-all">
                  <FileText className="w-6 h-6 text-indigo-600 mb-2" />
                  <span className="text-xs font-medium text-gray-700">Requests</span>
                </button>
                <button className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-indigo-300 transition-all">
                  <CalendarIcon className="w-6 h-6 text-emerald-600 mb-2" />
                  <span className="text-xs font-medium text-gray-700">Set Availability</span>
                </button>
                <button className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-indigo-300 transition-all">
                  <MessageCircle className="w-6 h-6 text-amber-600 mb-2" />
                  <span className="text-xs font-medium text-gray-700">Support Chat</span>
                </button>
                <button className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-indigo-300 transition-all">
                  <PlusCircle className="w-6 h-6 text-gray-600 mb-2" />
                  <span className="text-xs font-medium text-gray-700">Add service</span>
                </button>
              </div>
            </div>

            {/* Upcoming */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
               <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                 <h2 className="text-lg font-semibold">Upcoming</h2>
                 <button className="text-gray-400 hover:text-gray-600"><MoreVertical className="w-5 h-5" /></button>
               </div>
               <div className="p-2">
                 {/* Event 1 */}
                 <div className="flex gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                   <div className="w-12 h-12 bg-indigo-50 rounded-xl flex flex-col items-center justify-center shrink-0">
                     <span className="text-[10px] font-bold text-indigo-600 uppercase">Oct</span>
                     <span className="text-lg font-bold text-indigo-900 leading-none">12</span>
                   </div>
                   <div>
                     <h4 className="text-sm font-semibold text-gray-900 mb-1">On-site Server Maintenance: Sarah Miller</h4>
                     <p className="text-xs text-gray-500">10:00 AM — Google Meet</p>
                   </div>
                 </div>
                 {/* Event 2 */}
                 <div className="flex gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                   <div className="w-12 h-12 bg-gray-100 rounded-xl flex flex-col items-center justify-center shrink-0">
                     <span className="text-[10px] font-bold text-gray-500 uppercase">Oct</span>
                     <span className="text-lg font-bold text-gray-800 leading-none">12</span>
                   </div>
                   <div>
                     <h4 className="text-sm font-semibold text-gray-900 mb-1">Engine Diagnostic Review: TechFlow</h4>
                     <p className="text-xs text-gray-500">2:30 PM — On-site</p>
                   </div>
                 </div>
                 {/* Event 3 */}
                 <div className="flex gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                   <div className="w-12 h-12 bg-gray-100 rounded-xl flex flex-col items-center justify-center shrink-0">
                     <span className="text-[10px] font-bold text-gray-500 uppercase">Oct</span>
                     <span className="text-lg font-bold text-gray-800 leading-none">13</span>
                   </div>
                   <div>
                     <h4 className="text-sm font-semibold text-gray-900 mb-1">Safety Inspection & Tool Calibration</h4>
                     <p className="text-xs text-gray-500">09:00 AM — Office</p>
                   </div>
                 </div>
               </div>
            </div>

          </div>
        </div>

        {/* Recent Client Feedback */}
        <div className="mt-6 mb-16">
          <h2 className="text-lg font-semibold mb-4">Recent Client Feedback</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feedback 1 */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50/50 rounded-bl-full -z-0"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <img src="/api/placeholder/40/40" alt="Elena" className="w-10 h-10 rounded-full bg-gray-200" />
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">Elena Rodriguez</h4>
                    <div className="flex text-emerald-500">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 italic leading-relaxed">
                  "Marcus provided exceptional technical expertise for our complex circuitry. His fast diagnostic and attention to detail saved us weeks. Truly a pro!"
                </p>
              </div>
            </div>

            {/* Feedback 2 */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50/50 rounded-bl-full -z-0"></div>
               <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <img src="/api/placeholder/40/40" alt="Jameson" className="w-10 h-10 rounded-full bg-gray-200" />
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">Jameson Blake</h4>
                    <div className="flex text-emerald-500">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 italic leading-relaxed">
                  "The precision work on our heavy machinery exceeded our expectations. Our team is back at full capacity. Highly recommend his services."
                </p>
              </div>
            </div>

            {/* Feedback 3 */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50/50 rounded-bl-full -z-0"></div>
               <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">TC</div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">TechCore Inc.</h4>
                    <div className="flex text-emerald-500">
                      {[...Array(4)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                      <Star className="w-3 h-3 text-gray-300 fill-current" />
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 italic leading-relaxed">
                  "Very professional and excellent diagnostic speed. We've been using At.Hand Pro for all our technical repairs for over 6 months now."
                </p>
              </div>
            </div>

          </div>
        </div>
        
      </div>

      
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-colors z-50">
        <Plus className="w-6 h-6" />
      </button>
      </>
  );
}