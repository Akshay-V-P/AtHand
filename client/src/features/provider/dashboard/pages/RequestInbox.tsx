import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../../services/axios';
import type { RootState } from '../../../../store/store';
import toast from 'react-hot-toast';
import { providerServiceApi } from '../apis/providerServiceApi';

export default function RequestInbox() {
    const provider = useSelector((state: RootState) => state.provider);
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (provider.id && provider.location?.coordinates?.coordinates && provider.serviceCategory) {
            fetchNearbyRequests();
        }
    }, [provider.id]);

    const fetchNearbyRequests = async () => {
        try {
            setLoading(true);
            const lat = provider.location?.coordinates.coordinates[0];
            const lng = provider.location?.coordinates.coordinates[1];
            const radius = provider.serviceRadius || 10;
            const categoryId = typeof provider.serviceCategory === 'string'
                ? provider.serviceCategory
                : (provider.serviceCategory as any)._id || (provider.serviceCategory as any).id;

            
            if (lat && lng) {
                const res = await providerServiceApi.getServiceRequests({lat,lng, radius, categoryId})
                setRequests(res.data?.data || []);
            } else {
                throw new Error("Failed to fetch location")
            }
        } catch (error:any) {
            console.error(error);
            toast.error( error.message || 'Failed to fetch nearby requests');
        } finally {
            setLoading(false);
        }
    };

    const getUrgencyBadgeColor = (urgency: string) => {
        switch (urgency) {
            case 'EMERGENCY': return 'bg-red-100 text-red-700';
            case 'HIGH': return 'bg-orange-100 text-orange-700';
            case 'NORMAL': return 'bg-blue-100 text-blue-700';
            case 'LOW': return 'bg-gray-100 text-gray-700';
            default: return 'bg-blue-100 text-blue-700';
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-8">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <h1 className="text-3xl font-bold text-gray-900">Quote Requests</h1>

                <div className="flex-1 flex justify-end gap-3 items-center">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search devices or users..."
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="hidden md:flex bg-indigo-50/50 p-1 rounded-lg border border-indigo-100">
                        <button className="px-4 py-1.5 text-sm font-medium text-indigo-700 bg-white rounded-md shadow-sm">Emergency</button>
                        <button className="px-4 py-1.5 text-sm font-medium text-gray-600 hover:bg-white/50 rounded-md transition-colors">Within 2 hour</button>
                        <button className="px-4 py-1.5 text-sm font-medium text-gray-600 hover:bg-white/50 rounded-md transition-colors">Today</button>
                        <button className="px-4 py-1.5 text-sm font-medium text-gray-600 hover:bg-white/50 rounded-md transition-colors">Flexible</button>
                        <button className="px-4 py-1.5 text-sm font-medium text-gray-600 hover:bg-white/50 rounded-md transition-colors">In Review</button>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {requests.map(request => (
                        <div key={request.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">

                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center shrink-0">
                                        {/* Assuming icon based on device or category, using generic */}
                                        <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-sm text-gray-900 leading-tight line-clamp-1">{request.productBrand} {request.productModel}</h3>
                                        <p className="text-xs text-gray-500">Client: {request.userId?.slice(-4) || 'Unknown'}</p>
                                    </div>
                                </div>
                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${getUrgencyBadgeColor(request.urgency)}`}>
                                    {request.urgency === 'EMERGENCY' ? 'Emergency' : request.urgency === 'HIGH' ? 'High' : request.urgency === 'NORMAL' ? 'Normal' : 'Low'}
                                </span>
                            </div>

                            <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed flex-1">
                                "{request.description}"
                            </p>

                            <div className="bg-indigo-50/50 rounded-lg p-3 mb-4 flex items-start gap-2 border border-indigo-50">
                                <div className="shrink-0 mt-0.5">
                                    <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-indigo-800">Title / Expected</h4>
                                    <p className="text-xs text-indigo-600 line-clamp-2 leading-snug">{request.title}</p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center text-xs text-gray-500 mb-4 font-medium">
                                <div className="flex items-center gap-1.5">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                    <span>{request.address?.city || 'Local'}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate(`/provider/dashboard/requests/${request.id}`)}
                                className="w-full py-2 bg-white border-2 border-indigo-600 text-indigo-700 font-semibold text-sm rounded-lg hover:bg-indigo-50 transition-colors"
                            >
                                Review & Quote
                            </button>

                        </div>
                    ))}

                    {/* Incoming Stub */}
                    <div className="border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center p-8 text-gray-400 bg-gray-50/50 min-h-[320px]">
                        <svg className="w-8 h-8 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                        </svg>
                        <span className="font-medium text-sm">More Requests Incoming</span>
                    </div>
                </div>
            )}
        </div>
    );
}
