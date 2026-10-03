import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { serviceRequestApi } from '../api/serviceRequestApi';
import type { ServiceRequest, ServiceRequestStatus } from '../dtos/ServiceRequestDTOs';
import { ArrowLeft, Clock, MapPin, AlertCircle, RefreshCw, XCircle, FileImage } from 'lucide-react';
import toast from 'react-hot-toast';
import { getPresignedDisplayUrl } from '../../../../services/imageService';
import { Modal } from '../../../../components/common/Modal';

const ServiceRequestDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [request, setRequest] = useState<ServiceRequest | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isCancelling, setIsCancelling] = useState(false);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [mediaUrls, setMediaUrls] = useState<string[]>([]);

    useEffect(() => {
        const fetchRequest = async () => {
            if (!id) return;
            try {
                setIsLoading(true);
                const response = await serviceRequestApi.getRequest(id);
                if (response.data.success) {
                    const reqData = response.data.data;
                    console.log(reqData)
                    setRequest(reqData);

                    if (reqData.media && reqData.media.length > 0) {
                        try {
                            const urls = await Promise.all(
                                reqData.media.map(async (key: string) => {
                                    const res = await getPresignedDisplayUrl(key);
                                    return res.data?.data || '';
                                })
                            );
                            setMediaUrls(urls.filter(Boolean));
                        } catch (mediaError) {
                            console.error("Failed to fetch image URLs", mediaError);
                        }
                    }
                }
            } catch (error: any) {
                toast.error(error.message || 'Failed to fetch request details');
                navigate('/service-requests');
            } finally {
                setIsLoading(false);
            }
        };
        fetchRequest();
    }, [id, navigate]);

    const executeCancel = async () => {
        if (!id) return;
        try {
            setIsCancelling(true);
            const response = await serviceRequestApi.cancelRequest(id);
            if (response.data.success) {
                toast.success('Request cancelled successfully');
                setRequest(response.data.data);
                setIsCancelModalOpen(false);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to cancel request');
        } finally {
            setIsCancelling(false);
        }
    };

    const getStatusBadge = (status: ServiceRequestStatus | undefined) => {
        if (!status) return null;
        const styles: Record<string, string> = {
            OPEN: "bg-blue-100 text-blue-800",
            QUOTING: "bg-yellow-100 text-yellow-800",
            QUOTE_ACCEPTED: "bg-purple-100 text-purple-800",
            IN_PROGRESS: "bg-orange-100 text-orange-800",
            COMPLETED: "bg-green-100 text-green-800",
            CANCELLED: "bg-red-100 text-red-800"
        };
        return (
            <span className={`px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide ${styles[status]}`}>
                {status.replace('_', ' ')}
            </span>
        );
    };

    if (isLoading) {
        return (
            <div className="flex-1 bg-gradient-to-br from-[#d4f0ff] via-[#e4f6fb] to-[#f6fbe3] rounded-[2.5rem] p-8 md:p-12 shadow-sm min-h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!request) return null;

    const canCancel = request.status === "OPEN" || request.status === "QUOTING";

    return (
        <>
            <div className="flex-1 bg-gradient-to-br from-[#d4f0ff] via-[#e4f6fb] to-[#f6fbe3] rounded-[2.5rem] p-6 shadow-sm min-h-screen">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/service-requests')} className="p-2 hover:bg-white/50 rounded-full transition-colors">
                            <ArrowLeft size={24} className="text-gray-700" />
                        </button>
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-4">
                            Request Details
                        </h2>
                    </div>
                    <div>
                        {getStatusBadge(request.status)}
                    </div>
                </div>

                <div className="bg-white/90 rounded-3xl p-6 shadow-sm border border-white">
                    <div className="grid md:grid-cols-3 gap-8">

                        {/* Main Details */}
                        <div className="md:col-span-2 space-y-6">
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 mb-1">{request.title}</h1>
                                <p className="text-gray-600 text-base leading-relaxed">{request.description}</p>
                            </div>

                            <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-100">
                                <div className="bg-gray-50 rounded-2xl p-3 flex-1 min-w-[150px]">
                                    <p className="text-gray-500 text-xs font-medium mb-1 flex items-center gap-1.5">
                                        <AlertCircle size={14} /> Urgency
                                    </p>
                                    <p className="font-semibold text-gray-900 text-sm">{request.urgency}</p>
                                </div>
                                <div className="bg-gray-50 rounded-2xl p-3 flex-1 min-w-[150px]">
                                    <p className="text-gray-500 text-xs font-medium mb-1 flex items-center gap-1.5">
                                        <Clock size={14} /> Requested On
                                    </p>
                                    <p className="font-semibold text-gray-900 text-sm">
                                        {new Date(request.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            {mediaUrls.length > 0 && (
                                <div className="pt-4 border-t border-gray-100">
                                    <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                        <FileImage size={18} className="text-blue-500" /> Attached Images
                                    </h3>
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                        {mediaUrls.map((url, idx) => (
                                            <div key={idx} className="aspect-square rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50 flex items-center justify-center">
                                                <img src={url} alt={`Attachment ${idx + 1}`} className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar Details */}
                        <div className="space-y-4">
                            <div className="bg-gray-50 rounded-2xl p-4">
                                <h3 className="text-gray-900 font-semibold mb-3 flex items-center gap-2 text-sm">
                                    <MapPin size={18} className="text-blue-500" />
                                    Service Location
                                </h3>
                                <div className="space-y-1 text-gray-600 text-sm">
                                    <p className="font-medium text-gray-800">{request.address.houseName}</p>
                                    <p>{request.address.area}</p>
                                    <p>{request.address.city}, {request.address.state}</p>
                                    <p>{request.address.pincode}</p>
                                </div>
                            </div>

                            {request.preferredDate && (
                                <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100/50">
                                    <h3 className="text-gray-900 font-semibold mb-1 text-sm">Preferred Timing</h3>
                                    <p className="text-blue-800 font-medium text-sm">
                                        {new Date(request.preferredDate).toLocaleDateString()}
                                    </p>
                                    <p className="text-blue-600 text-xs">{request.preferredTimeSlot}</p>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Bottom Right Actions */}
                    {canCancel && (
                        <div className="mt-5 pt-5 border-t border-gray-100 flex flex-col items-end">
                            <button
                                onClick={() => setIsCancelModalOpen(true)}
                                disabled={isCancelling}
                                className="flex items-center justify-center gap-2 min-w-[200px] text-red-600 bg-red-50 hover:bg-red-100 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-50"
                            >
                                {isCancelling ? <RefreshCw size={18} className="animate-spin" /> : <XCircle size={18} />}
                                Cancel Service Request
                            </button>
                            <p className="text-xs text-gray-500 mt-3 text-right max-w-sm">
                                You can safely cancel requests that haven't been accepted by a provider yet.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Cancel Confirmation Modal */}
            <Modal
                isOpen={isCancelModalOpen}
                onClose={() => setIsCancelModalOpen(false)}
                title="Cancel Service Request"
            >
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4 bg-orange-50 text-orange-800 p-4 rounded-xl">
                        <AlertCircle size={24} className="shrink-0" />
                        <p className="text-sm font-medium">Are you sure you want to cancel this request? This action cannot be undone.</p>
                    </div>

                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            onClick={() => setIsCancelModalOpen(false)}
                            className="px-5 py-2.5 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                            Keep Request
                        </button>
                        <button
                            onClick={executeCancel}
                            disabled={isCancelling}
                            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                            {isCancelling ? <RefreshCw size={18} className="animate-spin" /> : <XCircle size={18} />}
                            Cancel Request
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default ServiceRequestDetailPage;
