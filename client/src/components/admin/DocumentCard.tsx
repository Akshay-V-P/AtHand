import React, { useState } from 'react';

export interface DocumentCardProps {
  id: string | null;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  file: {
    name: string;
  };
  details?: {
    issuedDate: string;
    expiryDate: string;
  };
  showActions?: boolean;
  // Added callback props to handle the actions in the parent component
  onApprove?: (id: string | null) => Promise<void> | void;
  onReject?: (id: string | null, remark: string) => Promise<void> | void;
}

const DocumentCard = ({
  id,
  title,
  subtitle,
  icon,
  status,
  file,
  details,
  showActions,
  onApprove,
  onReject,
}: DocumentCardProps) => {
  // State for modal and loading
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectRemark, setRejectRemark] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApprove = async () => {
    if (!onApprove) return;
    try {
      setIsProcessing(true);
      await onApprove(id);
    } catch (error) {
      console.error('Error approving document:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectClick = () => {
    setIsRejectModalOpen(true);
  };

  const submitReject = async () => {
    if (!onReject) return;
    try {
      setIsProcessing(true);
      await onReject(id, rejectRemark);
      setIsRejectModalOpen(false);
      setRejectRemark(''); // Reset remark on success
    } catch (error) {
      console.error('Error rejecting document:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
              {icon}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 leading-tight">{title}</h3>
              <p className="text-sm text-gray-500">{subtitle}</p>
            </div>
          </div>
          <div>
            {status === 'APPROVED' ? (
              <span className="inline-flex items-center gap-1.5 bg-green-50 px-3 py-1 rounded-full text-xs font-semibold text-green-700 border border-green-100">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Verified
              </span>
            ) : status === 'REJECTED' ? (
              <span className="inline-flex items-center gap-1.5 bg-red-50 px-3 py-1 rounded-full text-xs font-semibold text-red-700 border border-red-100">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Rejected
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 bg-yellow-100/60 px-3 py-1 rounded-full text-xs font-semibold text-yellow-800 border border-yellow-200/60">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Pending Review
              </span>
            )}
          </div>
        </div>

        {/* File Attachment Box */}
        <div className="bg-gray-50/80 border border-gray-200/60 rounded-xl p-4 border-dashed flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="text-gray-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{file.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-gray-500">
            <button className="hover:text-gray-700 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            <button className="hover:text-gray-700 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>

        {/* Footer Info / Actions */}
        {details && !showActions && (
          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
            <div className="flex gap-8">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Issued Date</p>
                <p className="text-sm text-gray-900 font-medium">{details.issuedDate}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Expiry Date</p>
                <p className="text-sm text-gray-900 font-medium">{details.expiryDate}</p>
              </div>
            </div>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
              Request Updation
            </button>
          </div>
        )}

        {showActions && (
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleApprove}
              disabled={isProcessing}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : 'Approve Document'}
            </button>
            <button
              onClick={handleRejectClick}
              disabled={isProcessing}
              className="bg-white border border-red-500 text-red-600 hover:bg-red-50 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              Reject & Request New
            </button>
            <button className="bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 p-2.5 rounded-lg ml-auto transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Reject Reason Modal */}
      {isRejectModalOpen && (
        <div className="fixed z-100 inset-0 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Reject Document</h3>
              <p className="text-sm text-gray-500 mb-5">
                Are you sure you want to reject this document? You can provide an optional remark below to let the user know why.
              </p>
              
              <div className="mb-6">
                <label htmlFor="remark" className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Remark (Optional)
                </label>
                <textarea
                  id="remark"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-none"
                  placeholder="e.g., Image is too blurry, please upload a clearer copy."
                  value={rejectRemark}
                  onChange={(e) => setRejectRemark(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsRejectModalOpen(false)}
                  disabled={isProcessing}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={submitReject}
                  disabled={isProcessing}
                  className="px-4 py-2.5 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Confirming...' : 'Confirm Rejection'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DocumentCard;