import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { serviceRequestApi } from '../api/serviceRequestApi';
import type { ServiceRequest, ServiceRequestStatus } from '../dtos/ServiceRequestDTOs';
import { Button } from '../../../../components/common/Button';
import { Plus, List, Calendar, MapPin, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const ServiceRequestsListPage = () => {
    const navigate = useNavigate();
    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchRequests = async () => {
        try {
            setIsLoading(true);
            const response = await serviceRequestApi.getRequests(page, 10);
            if (response.data.success) {
                setRequests(response.data.data.data);
                setTotalPages(Math.ceil(response.data.data.total / 10));
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to fetch service requests');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [page]);

    const getStatusBadge = (status: ServiceRequestStatus) => {
        const styles: Record<string, string> = {
            OPEN: "bg-blue-100 text-blue-800",
            QUOTING: "bg-yellow-100 text-yellow-800",
            QUOTE_ACCEPTED: "bg-purple-100 text-purple-800",
            IN_PROGRESS: "bg-orange-100 text-orange-800",
            COMPLETED: "bg-green-100 text-green-800",
            CANCELLED: "bg-red-100 text-red-800"
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
                {status.replace('_', ' ')}
            </span>
        );
    };

    return (
        <div className="flex-1 bg-gradient-to-br from-[#d4f0ff] via-[#e4f6fb] to-[#f6fbe3] rounded-[2.5rem] p-8 md:p-12 shadow-sm min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                        <List className="text-gray-700" size={32} />
                        My Service Requests
                    </h2>
                    <p className="text-gray-600 mt-2">Manage your ongoing and past requests</p>
                </div>
                <Button onClick={() => navigate('/service-requests/new')} className="flex items-center gap-2">
                    <Plus size={20} /> New Request
                </Button>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                </div>
            ) : requests.length === 0 ? (
                <div className="bg-white/80 rounded-3xl p-16 text-center shadow-sm">
                    <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <List size={32} className="text-blue-500" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-800 mb-2">No Requests Yet</h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">You haven't made any service requests. Need help with an appliance or service? Create one now.</p>
                    <Button onClick={() => navigate('/service-requests/new')}>Create First Request</Button>
                </div>
            ) : (
                <div className="grid gap-6">
                    {requests.map((req) => (
                        <div
                            key={req.id}
                            onClick={() => navigate(`/service-requests/${req.id}`)}
                            className="bg-white/90 hover:bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 border border-white"
                        >
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-xl font-semibold text-gray-900">{req.title}</h3>
                                    {getStatusBadge(req.status)}
                                </div>
                                <p className="text-gray-600 line-clamp-2 max-w-2xl text-sm mb-4">
                                    {req.description}
                                </p>
                                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 font-medium">
                                    <div className="flex items-center gap-1">
                                        <MapPin size={14} />
                                        {req.address.area}, {req.address.city}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar size={14} />
                                        {new Date(req.createdAt).toLocaleDateString()}
                                    </div>
                                    {req.preferredDate && (
                                        <div className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                            <Clock size={14} />
                                            Preferred: {new Date(req.preferredDate).toLocaleDateString()} {req.preferredTimeSlot}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="hidden md:flex shrink-0">
                                <span className="bg-gray-100 text-gray-600 hover:bg-gray-200 px-4 py-2 rounded-xl text-sm transition-colors font-medium">
                                    View Details
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination Controls */}
            {!isLoading && totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        className="px-4 py-2 rounded-xl bg-white text-gray-700 font-medium disabled:opacity-50 shadow-sm"
                    >
                        Previous
                    </button>
                    <span className="text-gray-700 font-medium">Page {page} of {totalPages}</span>
                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        className="px-4 py-2 rounded-xl bg-white text-gray-700 font-medium disabled:opacity-50 shadow-sm"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default ServiceRequestsListPage;
