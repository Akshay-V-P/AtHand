import { BookOpen, Check, CheckCircle2, Clock, HeadphonesIcon, Hourglass, Search } from 'lucide-react'
import React from 'react'
import { useAppSelector } from '../../../../hooks/storeHook'
import { Link } from 'react-router-dom'

const VerifyPage = () => {
    const provider = useAppSelector((state) => state.provider)
    
    return (
      provider.status == "ACTIVE"?
    
      <main className="flex-1 flex flex-col items-center justify-center p-8 overflow-y-auto">
          
          {/* Central Verification Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 w-full max-w-2xl p-10 flex flex-col items-center mb-6">
            
            {/* Status Icon */}
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-500">
                <Check className="w-10 h-10" strokeWidth={3} />
              </div>
            </div>

            {/* Title & Subtitle */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification completed</h1>
            <p className="text-gray-500 text-center max-w-md mb-10 text-lg">
              Start earning
            </p>

            {/* Progress Steps List */}
            <div className="w-full max-w-lg space-y-3 mb-10">
              {/* Step 1 */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-center text-gray-900 font-medium">
                  <CheckCircle2 className="w-5 h-5 mr-3 fill-green-500 text-white" />
                  Account Created
                </div>
                <span className="text-xs font-bold text-gray-400">COMPLETED</span>
              </div>
              
              {/* Step 2 */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-center text-gray-900 font-medium">
                  <CheckCircle2 className="w-5 h-5 mr-3 fill-green-500 text-white" />
                  Services Defined
                </div>
                <span className="text-xs font-bold text-gray-400">COMPLETED</span>
              </div>

              {/* Step 3 */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-center text-gray-900 font-medium">
                  <CheckCircle2 className="w-5 h-5 mr-3 fill-green-500 text-white" />
                  Documents Uploaded
                </div>
                <span className="text-xs font-bold text-gray-400">COMPLETED</span>
              </div>

              {/* Step 4 */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-center text-gray-900 font-medium">
                  <CheckCircle2 className="w-5 h-5 mr-3 fill-green-500 text-white" />
                  Final Approval
                </div>
                <span className="text-xs font-bold text-gray-400">COMPLETED</span>
              </div>
            </div>

            {/* Action Button */}
            <button className="px-8 py-2.5 border-2 border-indigo-200 text-indigo-700 font-medium rounded-lg hover:bg-indigo-50 transition-colors">
              Go to Dashboard
            </button>
          </div>

          {/* Bottom Cards */}
          <div className="w-full max-w-2xl grid grid-cols-2 gap-6">
            {/* Contact Support */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-start space-x-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-700 flex-shrink-0">
                <HeadphonesIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Contact Support</h3>
                <p className="text-xs text-gray-500 mt-1">Available Mon-Fri, 9am - 6pm</p>
              </div>
            </div>

            {/* Provider Guide */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-start space-x-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-700 flex-shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Provider Guide</h3>
                <p className="text-xs text-gray-500 mt-1">Review our platform standards</p>
              </div>
            </div>
          </div>

        </main>
        
            :
        
        <main className="flex-1 flex flex-col items-center justify-center p-8 overflow-y-auto">
          
          {/* Central Verification Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 w-full max-w-2xl p-10 flex flex-col items-center mb-6">
            
            {/* Status Icon */}
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                <Clock className="w-10 h-10" />
              </div>
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white border-2 border-white">
                <Search className="w-3 h-3" />
              </div>
            </div>

            {/* Title & Subtitle */}
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Verification in Progress</h1>
            <p className="text-gray-500 text-center max-w-md mb-10">
              Our team is currently reviewing your certifications and business documents. This typically takes 24-48 hours.
            </p>

            {/* Progress Steps List */}
            <div className="w-full max-w-lg space-y-3 mb-10">
              {/* Step 1 */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-center text-gray-800 font-medium">
                  <CheckCircle2 className="w-5 h-5 mr-3 text-gray-700 fill-current" />
                  Account Created
                </div>
                <span className="text-xs font-bold text-gray-400">COMPLETED</span>
              </div>
              
              {/* Step 2 */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-center text-gray-800 font-medium">
                  <CheckCircle2 className="w-5 h-5 mr-3 text-gray-700 fill-current" />
                  Services Defined
                </div>
                <span className="text-xs font-bold text-gray-400">COMPLETED</span>
              </div>

              {/* Step 3 */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-center text-gray-800 font-medium">
                  <CheckCircle2 className="w-5 h-5 mr-3 text-gray-700 fill-current" />
                  Documents Uploaded
                </div>
                <span className="text-xs font-bold text-gray-400">COMPLETED</span>
              </div>

              {/* Step 4 (Active/In-Review) */}
              <div className="flex items-center justify-between p-4 border border-indigo-200 rounded-lg bg-indigo-50">
                <div className="flex items-center text-indigo-700 font-medium">
                  <Hourglass className="w-5 h-5 mr-3" />
                  Final Approval
                </div>
                <span className="text-xs font-bold text-indigo-600">IN REVIEW</span>
              </div>
            </div>

                    {/* Action Button */}
                    <Link to={"/"}>
            <button className="px-8 py-2.5 border-2 border-indigo-200 text-indigo-700 font-medium rounded-lg hover:bg-indigo-50 transition-colors">
              Go Back Home
                        </button>
                        </Link>
          </div>

          {/* Bottom Cards */}
          <div className="w-full max-w-2xl grid grid-cols-2 gap-6">
            {/* Contact Support */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-start space-x-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-700 flex-shrink-0">
                <HeadphonesIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Contact Support</h3>
                <p className="text-xs text-gray-500 mt-1">Available Mon-Fri, 9am - 6pm</p>
              </div>
            </div>

            {/* Provider Guide */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-start space-x-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-700 flex-shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Provider Guide</h3>
                <p className="text-xs text-gray-500 mt-1">Review our platform standards</p>
              </div>
            </div>
          </div>

            </main>
  )
}

export default VerifyPage