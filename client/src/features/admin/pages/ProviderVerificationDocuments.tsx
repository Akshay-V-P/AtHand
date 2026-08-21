import React from 'react';
import DocumentCard from '../../../components/admin/DocumentCard';

const ProviderVerificationDocuments = () => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 font-sans">
      
      {/* Left Column: Documents List */}
      <div className="xl:col-span-2">
        <DocumentCard
          title="Business License"
          subtitle="State of California • License #CA-993310-B"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
            </svg>
          }
          status="Verified"
          file={{
            name: 'business_license_2024.pdf',
            uploadDate: 'Jan 15, 2024',
            size: '1.2 MB'
          }}
          details={{
            issuedDate: 'Jan 01, 2024',
            expiryDate: 'Dec 31, 2024'
          }}
        />

        <DocumentCard
          title="General Liability Insurance"
          subtitle="Coverage up to ₹2,000,000 • Policy #GL-XYZ-123"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          }
          status="Pending Review"
          showActions={true}
          file={{
            name: 'liability_cert_signed.jpg',
            uploadDate: 'Feb 10, 2024',
            size: '3.4 MB'
          }}
        />
      </div>

      {/* Right Column: Sidebar */}
      <div className="xl:col-span-1 space-y-6">
        
        {/* Verification Timeline Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-6">Verification</h3>
          
          <div className="relative border-l-2 border-gray-100 ml-3 space-y-8">
            
            {/* Timeline Item 1 */}
            <div className="relative pl-6">
              <span className="absolute -left-3.5 top-0.5 w-7 h-7 rounded-full bg-green-50 text-green-500 flex items-center justify-center ring-4 ring-white">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
              </span>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Business License Verified</h4>
                <p className="text-xs text-gray-500 mt-1">By <span className="font-semibold text-gray-700">Alex Morgan</span> • Jan 16, 2024</p>
                <div className="mt-2 bg-gray-50 p-3 rounded-lg text-xs text-gray-600 font-medium">
                  "License number matched state database. All clear."
                </div>
              </div>
            </div>

            {/* Timeline Item 2 */}
            <div className="relative pl-6">
              <span className="absolute -left-3.5 top-0.5 w-7 h-7 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center ring-4 ring-white">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
              </span>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Liability Insurance Uploaded</h4>
                <p className="text-xs text-gray-500 mt-1">By <span className="font-semibold text-gray-700">Provider</span> • Feb 10, 2024</p>
              </div>
            </div>

            {/* Timeline Item 3 */}
            <div className="relative pl-6">
              <span className="absolute -left-3.5 top-0.5 w-7 h-7 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center ring-4 ring-white">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </span>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Notification Email Sent</h4>
                <p className="text-xs text-gray-500 mt-1">System Automated • Feb 12, 2024</p>
              </div>
            </div>

          </div>

          <hr className="my-6 border-gray-200" />

          {/* Add Internal Note */}
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Add Internal Note</h3>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Type a note..." 
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-lg transition-colors flex-shrink-0">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Direct Support Card */}
        <div className="bg-[#131b2d] rounded-xl p-6 text-white shadow-sm">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Direct Support</h3>
          <p className="text-sm text-gray-300 mb-6 leading-relaxed">
            Need to contact the provider regarding their documents?
          </p>
          <div className="space-y-3">
            <button className="w-full bg-[#828b9c] hover:bg-[#929cac] text-white py-2.5 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
              Start Chat with Provider
            </button>
            <button className="w-full border border-gray-600 hover:border-gray-400 hover:bg-white/5 text-gray-300 py-2.5 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              Schedule Review Call
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProviderVerificationDocuments;