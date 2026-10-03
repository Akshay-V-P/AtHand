import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { api } from '../../../../services/axios';
import toast from 'react-hot-toast';
import { providerServiceApi } from '../apis/providerServiceApi';

export default function RequestReviewQuote() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [requestData, setRequestData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Form state
    const [laborCost, setLaborCost] = useState('');
    const [partsCost, setPartsCost] = useState('');
    const [estimatedTotal, setEstimatedTotal] = useState('0.00');
    const [duration, setDuration] = useState('');
    const [notes, setNotes] = useState('');
    const [includeWarranty, setIncludeWarranty] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        fetchRequestDetails();
    }, [id]);

    useEffect(() => {
        const lC = parseFloat(laborCost) || 0; 
        const pC = parseFloat(partsCost) || 0; 
        setEstimatedTotal((lC + pC).toFixed(2));
    }, [laborCost, partsCost]);

    const fetchRequestDetails = async () => {
        try {
            setLoading(true);
            if (id) {
                const res = await providerServiceApi.getServiceRequestById(id)
                setRequestData(res.data);
            } else {
                throw new Error("Unable to fetch details")
            }
        } catch (error:any) {
            console.error(error);
            toast.error(error.message || 'Failed to load request details');
        } finally {
            setLoading(false);
        }
    };

    const handleSendQuote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!duration) return toast.error("Please select an estimated repair time");

        setSubmitting(true);
        try {
            // In a real app we'd post the quote here to a new quote endpoint
            // await api.post(`/api/quotes`, { requestId: id, price: parseFloat(estimatedTotal), notes, duration, ... })

            // Simulate API call delay
            await new Promise(r => setTimeout(r, 1000));

            setSuccess(true);
            toast.success('Quote Sent Successfully');

            // Optionally redirect back after some time
            setTimeout(() => navigate('/provider/dashboard/requests'), 3000);
        } catch (error) {
            toast.error('Failed to send quote');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12 h-screen">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!requestData) {
        return <div className="p-8">Request not found.</div>;
    }

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 bg-[#F8FAFC]">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-sm font-semibold text-indigo-700 hover:text-indigo-800 mb-6"
            >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Request #{id?.slice(-4).toUpperCase()}
            </button>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit Service Quote</h1>
            <p className="text-gray-600 text-sm mb-8">
                Review the initial summary and customer inputs before finalizing your estimate.
            </p>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Column - Details */}
                <div className="flex-1 space-y-6">

                    {/* Diagnostic Card */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">{requestData.title}</h2>
                            </div>
                            <div className="flex items-center gap-2">
                                {requestData.onSite && <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">On-Site</span>}
                                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">{requestData.urgency}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl">
                                <h4 className="text-sm font-bold text-gray-800 mb-1">Brand</h4>
                                <p className="text-xs text-gray-600">{requestData.productBrand || 'N/A'}</p>
                            </div>
                            <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl">
                                <h4 className="text-sm font-bold text-gray-800 mb-1">Model</h4>
                                <p className="text-xs text-gray-600">{requestData.productModel || 'N/A'}</p>
                            </div>
                            <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl">
                                <h4 className="text-sm font-bold text-indigo-900 mb-1">Issue Focus</h4>
                                <p className="text-xs text-indigo-700 font-medium">Critical failure likely.</p>
                            </div>
                        </div>

                        <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl italic text-sm text-indigo-800 leading-relaxed shadow-inner">
                            "Customer reports that {requestData.productBrand} device is non-responsive. Diagnostic suggests a localized issue based on description."
                        </div>
                    </div>

                    {/* Customer Media */}
                    {requestData.media && requestData.media.length > 0 && (
                        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <ImageIcon className="w-5 h-5 text-gray-700" />
                                <h3 className="text-lg font-bold text-gray-900">Customer Media</h3>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {requestData.media.map((imgUrl: string, idx: number) => (
                                    <div key={idx} className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                        <img src={imgUrl} alt={`Customer upload ${idx}`} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Reported Issue */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Reported Issue</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            "{requestData.description}"
                        </p>
                    </div>

                </div>


                {/* Right Column - Form */}
                <div className="lg:w-[400px]">

                    {/* Map context header */}
                    <div className="h-24 bg-gray-200 rounded-xl mb-6 relative overflow-hidden flex items-end p-3 border border-gray-300">
                        {/* Map placeholder */}
                        <div className="absolute inset-0 opacity-40 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=Kerala&zoom=10&size=400x120&sensor=false')] bg-cover bg-center"></div>
                        <span className="relative z-10 text-sm font-bold text-gray-800 bg-white/80 px-2 py-1 rounded shadow-sm">
                            {requestData.address?.area || requestData.address?.city}
                        </span>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">Service Quote Details</h2>
                        </div>

                        <form onSubmit={handleSendQuote} className="p-6 space-y-5">

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Estimated Total Price (INR)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                                    <input
                                        type="number"
                                        value={estimatedTotal}
                                        readOnly
                                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg text-lg font-semibold bg-gray-50 focus:outline-none text-gray-900"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Labor Cost</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm">₹</span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            required
                                            value={laborCost}
                                            onChange={(e) => setLaborCost(e.target.value)}
                                            placeholder="0.00"
                                            className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Parts Cost</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm">₹</span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            required
                                            value={partsCost}
                                            onChange={(e) => setPartsCost(e.target.value)}
                                            placeholder="0.00"
                                            className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Estimated Repair Time</label>
                                <select
                                    required
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-1 focus:ring-indigo-500 outline-none"
                                >
                                    <option value="" disabled>Select duration...</option>
                                    <option value="1_hour">Within 1 hour</option>
                                    <option value="2_hours">1 - 2 hours</option>
                                    <option value="half_day">Half day (4 hrs)</option>
                                    <option value="full_day">Full day (8 hrs)</option>
                                    <option value="multi_day">2-3 days</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Technical Notes & Scope</label>
                                <textarea
                                    required
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Explain the diagnostics and parts to be replaced..."
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-indigo-500 outline-none resize-none"
                                ></textarea>
                            </div>

                            <div className="flex items-start gap-2 pt-2">
                                <input
                                    type="checkbox"
                                    id="warranty"
                                    checked={includeWarranty}
                                    onChange={(e) => setIncludeWarranty(e.target.checked)}
                                    className="mt-1 flex-shrink-0 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300"
                                />
                                <label htmlFor="warranty" className="text-xs text-gray-600 leading-tight">
                                    Include 90-day parts and labor warranty with this quote.
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting || success}
                                className="w-full py-2.5 mt-2 bg-indigo-600 text-white font-semibold text-sm rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center disabled:bg-indigo-400 gap-2"
                            >
                                {submitting ? 'Sending...' : success ? 'Sent!' : <><Send className="w-4 h-4" /> Send Quote</>}
                            </button>

                            <p className="text-[10px] text-center text-gray-400 mt-3 pt-2 border-t border-gray-100">
                                Customer will be notified via email and SMS.
                            </p>
                        </form>
                    </div>

                    {/* Success notice */}
                    {success && (
                        <div className="mt-4 bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-3 text-white shadow-xl animate-fade-in-up">
                            <div className="bg-emerald-500/20 text-emerald-400 p-1 rounded-full shrink-0">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold">Quote Sent Successfully</h4>
                                <p className="text-xs text-gray-400">Ref: #{id?.substring(0, 8).toUpperCase()}-Q</p>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
