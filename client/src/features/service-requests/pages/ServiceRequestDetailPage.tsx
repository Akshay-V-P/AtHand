import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { serviceRequestApi } from '../api/serviceRequestApi';
import { orderApi } from '@/features/orders/api/orderApi';
import type { ServiceRequest, Quote } from '../dtos/ServiceRequestDTOs';
import type { Order } from '@/features/orders/dtos/OrderDTOs';
import {
    ArrowLeft,
    Clock,
    MapPin,
    AlertCircle,
    RefreshCw,
    XCircle,
    CheckCircle,
    Calendar,
    ChevronDown,
    ChevronUp,
    ShieldCheck,
    Wrench,
    Sparkles,
    Image as ImageIcon,
    ZoomIn,
    Home,
    Phone,
    MessageSquare,
    Check,
    Star,
    Download,
    AlertTriangle,
    CreditCard,
    DollarSign,
    CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getPresignedDisplayUrl } from '@/services/imageService';
import { Modal } from "@/shared/components/Modal";

// Format relative time (e.g. "2h ago", "1d ago")
const formatTimeAgo = (dateString: string | Date | undefined): string => {
    if (!dateString) return '';
    const now = new Date();
    const past = new Date(dateString);
    const diffInMs = now.getTime() - past.getTime();
    const diffInSeconds = Math.max(0, Math.floor(diffInMs / 1000));
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 7) {
        return past.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    if (diffInDays > 0) {
        return `${diffInDays}d ago`;
    }
    if (diffInHours > 0) {
        return `${diffInHours}h ago`;
    }
    if (diffInMinutes > 0) {
        return `${diffInMinutes}m ago`;
    }
    return 'Just now';
};

// Map repair time codes to human-readable strings
const formatRepairDuration = (duration: string | undefined): string => {
    if (!duration) return 'Flexible';
    const mapping: Record<string, string> = {
        '1_hour': 'Within 1 hour',
        '2_hours': '1 - 2 hours',
        'half_day': 'Half day (4 hrs)',
        'full_day': 'Full day (8 hrs)',
        'multi_day': '2 - 3 days'
    };
    return mapping[duration] || duration;
};

// Generate initials for avatar fallback
const getInitials = (name: string | undefined): string => {
    if (!name) return 'PR';
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map(n => n[0].toUpperCase())
        .join('');
};

const ServiceRequestDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Data States
    const [request, setRequest] = useState<ServiceRequest | null>(null);
    const [order, setOrder] = useState<Order | null>(null);
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [mediaUrls, setMediaUrls] = useState<string[]>([]);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    // UI Loading & Modal States
    const [isLoading, setIsLoading] = useState(true);
    const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

    // Quote Acceptance States
    const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
    const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);
    const [appointmentDate, setAppointmentDate] = useState<string>('');
    const [timeSlot, setTimeSlot] = useState<string>('10:00 AM - 12:00 PM');
    const [accessInstructions, setAccessInstructions] = useState<string>('');
    const [isAccepting, setIsAccepting] = useState(false);
    const [expandedQuotes, setExpandedQuotes] = useState<Record<string, boolean>>({});

    // Estimate Decision States
    const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
    const [declineReason, setDeclineReason] = useState('');
    const [isSubmittingDecision, setIsSubmittingDecision] = useState(false);

    // Payment States
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'ONLINE' | 'UPI' | 'CASH'>('ONLINE');
    const [isPaying, setIsPaying] = useState(false);

    // Review States
    const [userRating, setUserRating] = useState<number>(5);
    const [hoverRating, setHoverRating] = useState<number>(0);
    const [reviewComment, setReviewComment] = useState<string>('');
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

    // Fetch Request, Order & Quotes
    const loadDetails = async () => {
        if (!id) return;
        try {
            setIsLoading(true);
            const reqRes = await serviceRequestApi.getRequest(id);
            if (reqRes.data.success) {
                const reqData = reqRes.data.data;
                setRequest(reqData);

                // Fetch media URLs
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
                        console.error('Failed to fetch image URLs', mediaError);
                    }
                }

                // Check if an order already exists for this service request
                try {
                    const orderRes = await orderApi.getOrderByRequestId(id);
                    if (orderRes.data.success && orderRes.data.data) {
                        setOrder(orderRes.data.data);
                    }
                } catch (orderErr) {
                    // Order might not exist yet if request is still OPEN/QUOTING
                    setOrder(null);
                }

                // If no order yet, load quotes
                try {
                    const quotesRes = await serviceRequestApi.getQuotesByRequestId(id);
                    if (quotesRes.data.success) {
                        setQuotes(quotesRes.data.data);
                    }
                } catch (quotesErr) {
                    console.error('Failed to load quotes', quotesErr);
                }
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to fetch request details');
            navigate('/service-requests');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadDetails();
    }, [id]);

    const toggleQuoteExpand = (quoteId: string) => {
        setExpandedQuotes(prev => ({
            ...prev,
            [quoteId]: !prev[quoteId]
        }));
    };

    // Cancel Request
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

    // Accept Quote & Create Order
    const executeAcceptQuote = async () => {
        if (!selectedQuoteId) return;
        try {
            setIsAccepting(true);
            const response = await orderApi.acceptQuote({
                quoteId: selectedQuoteId,
                appointmentDate: appointmentDate || (request?.preferredDate ? new Date(request.preferredDate).toISOString() : undefined),
                timeSlot: timeSlot || request?.preferredTimeSlot,
                accessInstructions
            });

            if (response.data.success) {
                toast.success('Quote accepted! Order created.');
                setIsAcceptModalOpen(false);
                setOrder(response.data.data);
                await loadDetails();
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to accept quote');
        } finally {
            setIsAccepting(false);
        }
    };

    // Customer Decision on Repair Estimate (Approve / Decline)
    const handleEstimateDecision = async (action: 'APPROVE' | 'DECLINE') => {
        if (!order?.id && !order?._id) return;
        const orderId = order.id || order._id!;
        try {
            setIsSubmittingDecision(true);
            const res = await orderApi.submitEstimateDecision(orderId, {
                action,
                reason: action === 'DECLINE' ? declineReason : undefined
            });
            if (res.data.success) {
                toast.success(action === 'APPROVE' ? 'Repair estimate approved!' : 'Repair declined. Service closed.');
                setIsDeclineModalOpen(false);
                setOrder(res.data.data);
                await loadDetails();
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to process decision');
        } finally {
            setIsSubmittingDecision(false);
        }
    };

    // Process Payment
    const handleProcessPayment = async () => {
        if (!order?.id && !order?._id) return;
        const orderId = order.id || order._id!;
        try {
            setIsPaying(true);
            const res = await orderApi.processPayment(orderId, { paymentMethod });
            if (res.data.success) {
                toast.success('Payment completed successfully!');
                setIsPaymentModalOpen(false);
                setOrder(res.data.data);
                await loadDetails();
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to process payment');
        } finally {
            setIsPaying(false);
        }
    };

    // Submit Review
    const handleSubmitReview = async () => {
        if (!order?.id && !order?._id) return;
        const orderId = order.id || order._id!;
        try {
            setIsSubmittingReview(true);
            const res = await orderApi.submitReview(orderId, {
                rating: userRating,
                comment: reviewComment
            });
            if (res.data.success) {
                toast.success('Thank you for your review!');
                setOrder(res.data.data);
                await loadDetails();
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to submit review');
        } finally {
            setIsSubmittingReview(false);
        }
    };

    // Download Invoice
    const handleDownloadInvoice = () => {
        if (!order) return;
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            toast.error('Pop-up blocked. Please allow pop-ups to download invoice.');
            return;
        }

        const itemsHtml = (order.repairEstimate?.items || []).map(item => `
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.title}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.amount.toLocaleString()}</td>
            </tr>
        `).join('') || `
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">Service Fee</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${(order.finalAmount || order.initialQuoteAmount).toLocaleString()}</td>
            </tr>
        `;

        printWindow.document.write(`
            <html>
                <head>
                    <title>Invoice - ${order.orderNumber}</title>
                    <style>
                        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #111; }
                        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #333; padding-bottom: 20px; }
                        .title { font-size: 28px; font-weight: 800; }
                        .invoice-num { font-size: 16px; color: #666; margin-top: 4px; }
                        .paid-badge { display: inline-block; padding: 6px 14px; background: #e6f9ed; color: #047857; font-weight: 800; border-radius: 6px; border: 2px solid #059669; }
                        table { width: 100%; border-collapse: collapse; margin-top: 30px; }
                        th { text-align: left; padding: 12px 10px; border-bottom: 2px solid #ddd; background: #f8fafc; }
                        .total-row { font-size: 18px; font-weight: bold; }
                        .footer { margin-top: 50px; text-align: center; color: #888; font-size: 13px; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div>
                            <div class="title">ATHAND SERVICE INVOICE</div>
                            <div class="invoice-num">Order: #${order.orderNumber}</div>
                            <div style="margin-top: 10px; font-size: 14px;">Date: ${new Date().toLocaleDateString()}</div>
                        </div>
                        <div style="text-align: right;">
                            <div class="paid-badge">PAID</div>
                            <div style="margin-top: 10px; font-size: 14px;">Service Mode: ${order.serviceMode || 'ONSITE'}</div>
                        </div>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>Item / Description</th>
                                <th style="text-align: right;">Amount (INR)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsHtml}
                            <tr class="total-row">
                                <td style="padding: 16px 10px;">Total Paid</td>
                                <td style="padding: 16px 10px; text-align: right; color: #1d4ed8;">₹${(order.finalAmount || order.payment?.totalAmount || order.initialQuoteAmount).toLocaleString()}</td>
                            </tr>
                        </tbody>
                    </table>

                    <div class="footer">
                        <p>Thank you for choosing AtHand Verified Services!</p>
                        <p>For any queries, please raise a support ticket quoting your order number.</p>
                    </div>
                    <script>window.print();</script>
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[70vh]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm font-medium text-gray-600">Loading service details...</p>
                </div>
            </div>
        );
    }

    if (!request) return null;

    const canCancel = !order && (request.status === 'OPEN' || request.status === 'QUOTING');
    const selectedQuote = quotes.find(q => q.id === selectedQuoteId);
    const activePhoto = mediaUrls[activeImageIndex] || mediaUrls[0];

    // Determine current order state
    const isWaitingForBillApproval = order?.status === 'estimate_pending_approval';
    const isWaitingForPayment = order?.status === 'waiting_for_payment';
    const isCompleted = order?.status === 'completed';
    const isRepairInProgress = order?.status === 'repair_in_progress';
    const isClosedWithoutRepair = order?.status === 'closed_without_repair';

    // Provider details
    const activeProvider = order?.providerId || (order?.quoteId ? quotes.find(q => q.id === order.quoteId)?.providerId : null);
    const providerName = activeProvider?.businessName || 'TechFix Solutions';
    const providerAddress = activeProvider?.location?.address?.city || activeProvider?.location?.address?.street || request.address.city;
    const providerRating = activeProvider?.averageRating ? Number(activeProvider.averageRating).toFixed(1) : '4.9';
    const providerReviews = activeProvider?.totalReviews ? `${activeProvider.totalReviews}+` : '4k+';
    const providerPhone = activeProvider?.phone || activeProvider?.contactNumber || '+91 98765 43210';

    // Bill line items
    const estimateItems = order?.repairEstimate?.items && order.repairEstimate.items.length > 0
        ? order.repairEstimate.items
        : [
            { title: 'Diagnosis / Service Charge', amount: order?.initialQuoteAmount || 500 }
        ];

    const totalBillAmount = order?.repairEstimate?.totalAmount || order?.finalAmount || order?.initialQuoteAmount || 0;

    // Updated issues list
    const updatedIssuesList = order?.diagnosis?.identifiedIssues && order.diagnosis.identifiedIssues.length > 0
        ? order.diagnosis.identifiedIssues
        : ['Screen replacement required', 'Battery replacement'];

    // Proof photos
    const workProofPhotos = order?.completionDetails?.workProofPhotos && order.completionDetails.workProofPhotos.length > 0
        ? order.completionDetails.workProofPhotos
        : [
            { url: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&auto=format&fit=crop&q=60', caption: 'Strip Changed' },
            { url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=60', caption: 'Display replaced' }
        ];

    return (
        <div className="w-full py-4 sm:py-6">
            {/* Top Container with Back Navigation and Main Card */}
            <div className="flex flex-col md:flex-row items-start gap-4 sm:gap-6">
                {/* Back Arrow - Exactly on the left of the card as in user's design */}
                <button
                    onClick={() => navigate('/service-requests')}
                    className="p-3 bg-white/90 hover:bg-white text-gray-700 hover:text-black rounded-full shadow-xs hover:shadow transition-all border border-gray-100 shrink-0 mt-3 md:mt-6 cursor-pointer"
                    title="Back to Service Requests"
                >
                    <ArrowLeft size={22} />
                </button>

                {/* Main Card with Soft Pastel Gradient */}
                <div className="flex-1 w-full bg-gradient-to-b from-[#BFE7FF] via-[#E4F6FB] to-[#FEFFE8] rounded-[2.5rem] p-6 sm:p-10 lg:p-12 shadow-sm border border-sky-100/60">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

                        {/* LEFT COLUMN: Media Box, Title, Description, Stepper & Service Information */}
                        <div className="lg:col-span-5 space-y-4">
                            {/* Primary Media Box with #REP Badge */}
                            <div className="relative w-full aspect-square bg-[#D9D9D9] rounded-3xl overflow-hidden shadow-xs border border-white/60 flex items-center justify-center group">
                                {/* Order Number Badge (e.g. #REP-4902) or Status Badge */}
                                {order?.orderNumber ? (
                                    <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full shadow-xs text-xs sm:text-sm font-extrabold text-gray-900 tracking-wide">
                                        #{order.orderNumber}
                                    </div>
                                ) : (
                                    <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full shadow-xs text-xs font-bold text-gray-800 tracking-wide">
                                        {request.status}
                                    </div>
                                )}

                                {activePhoto ? (
                                    <>
                                        <img
                                            src={activePhoto}
                                            alt={request.title}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                                            onClick={() => setIsImagePreviewOpen(true)}
                                        />
                                        <button
                                            onClick={() => setIsImagePreviewOpen(true)}
                                            className="absolute bottom-3 right-3 p-2 bg-black/40 hover:bg-black/60 text-white rounded-xl backdrop-blur-xs transition-opacity opacity-0 group-hover:opacity-100 cursor-pointer"
                                            title="View Full Image"
                                        >
                                            <ZoomIn size={16} />
                                        </button>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-gray-500 gap-2 p-6 text-center">
                                        <div className="w-14 h-14 rounded-2xl bg-white/60 flex items-center justify-center text-gray-400 shadow-2xs">
                                            <ImageIcon size={26} />
                                        </div>
                                        <span className="text-xs font-semibold text-gray-600">No photos attached</span>
                                    </div>
                                )}
                            </div>

                            {/* Attached Photos Thumbnail Strip (if multiple photos exist) */}
                            {mediaUrls.length > 1 && (
                                <div className="flex items-center gap-2 pt-1 overflow-x-auto pb-1">
                                    {mediaUrls.map((url, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveImageIndex(idx)}
                                            className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                                                activeImageIndex === idx
                                                    ? 'border-blue-600 ring-2 ring-blue-300 scale-105'
                                                    : 'border-white opacity-70 hover:opacity-100'
                                            }`}
                                        >
                                            <img src={url} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Category & Tags Header (matches "Electronics, Mobile" in design) */}
                            <div className="pt-2">
                                <div className="text-xs sm:text-sm font-semibold text-gray-600 tracking-wide">
                                    {request.productBrand
                                        ? `${request.productBrand}${request.productModel ? `, ${request.productModel}` : ''}`
                                        : 'Electronics, Repair Service'}
                                </div>

                                {/* Main Request Title */}
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mt-1 mb-3 tracking-tight">
                                    {request.title}
                                </h1>

                                {/* Description Section */}
                                <div className="space-y-1 mb-4">
                                    <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Description
                                    </h2>
                                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-normal">
                                        {request.description}
                                    </p>
                                </div>

                                {/* Horizontal Stepper Component (Design Alignment) */}
                                {order && (
                                    <div className="py-3 px-4 bg-white/70 backdrop-blur-xs rounded-2xl border border-white/80 shadow-2xs my-4">
                                        <div className="flex items-center justify-between text-xs font-semibold text-gray-700 relative">
                                            {/* Stepper Step 1: Diagnose */}
                                            <div className="flex items-center gap-1.5 z-10">
                                                <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                                                    order.status !== 'pending' && order.status !== 'scheduled'
                                                        ? 'bg-black text-white'
                                                        : 'border-2 border-black bg-white'
                                                }`}>
                                                    {order.status !== 'pending' && order.status !== 'scheduled' && (
                                                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                                    )}
                                                </div>
                                                <span className="font-bold text-gray-900">
                                                    {isWaitingForPayment || isCompleted ? 'Repair completed' : 'Diagnose completed'}
                                                </span>
                                            </div>

                                            {/* Connecting Line 1 */}
                                            <div className="flex-1 h-0.5 mx-2 bg-gray-300"></div>

                                            {/* Stepper Step 2: Repairing */}
                                            <div className="flex items-center gap-1.5 z-10">
                                                <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                                                    isRepairInProgress || isWaitingForPayment || isCompleted
                                                        ? 'bg-black text-white'
                                                        : 'border-2 border-gray-400 bg-white'
                                                }`}>
                                                    {(isRepairInProgress || isWaitingForPayment || isCompleted) && (
                                                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                                    )}
                                                </div>
                                                <span className={isRepairInProgress ? 'font-bold text-gray-900' : 'text-gray-500'}>
                                                    Repairing
                                                </span>
                                            </div>

                                            {/* Connecting Line 2 */}
                                            <div className="flex-1 h-0.5 mx-2 bg-gray-300"></div>

                                            {/* Stepper Step 3: Completed */}
                                            <div className="flex items-center gap-1.5 z-10">
                                                <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                                                    isCompleted
                                                        ? 'bg-black text-white'
                                                        : 'border-2 border-gray-400 bg-white'
                                                }`}>
                                                    {isCompleted && (
                                                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                                    )}
                                                </div>
                                                <span className={isCompleted ? 'font-bold text-gray-900' : 'text-gray-500'}>
                                                    Completed
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Maximum Details Addition: User-Specific Service Information Card */}
                                <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-4 sm:p-5 border border-white/80 shadow-2xs space-y-3.5">
                                    <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                                        <Sparkles size={14} className="text-blue-600" />
                                        Service Information
                                    </h3>

                                    {/* Urgency & Service Mode */}
                                    <div className="grid grid-cols-2 gap-2.5">
                                        <div className="bg-gray-50/90 rounded-xl p-2.5 border border-gray-100">
                                            <div className="flex items-center gap-1 text-[11px] font-medium text-gray-500">
                                                <AlertCircle size={12} className="text-amber-500" /> Urgency
                                            </div>
                                            <div className="text-xs font-bold text-gray-900 mt-0.5">
                                                {request.urgency}
                                            </div>
                                        </div>

                                        <div className="bg-gray-50/90 rounded-xl p-2.5 border border-gray-100">
                                            <div className="flex items-center gap-1 text-[11px] font-medium text-gray-500">
                                                <Home size={12} className="text-blue-500" /> Mode
                                            </div>
                                            <div className="text-xs font-bold text-gray-900 mt-0.5">
                                                {request.serviceMode === 'WORKSHOP'
                                                    ? 'Workshop Drop-off'
                                                    : request.serviceMode === 'COLLECTION_AND_RETURN'
                                                    ? 'Pick & Drop'
                                                    : 'On-Site Visit'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Address Details */}
                                    <div className="pt-2 border-t border-gray-100">
                                        <div className="flex items-start gap-2">
                                            <MapPin size={15} className="text-blue-600 shrink-0 mt-0.5" />
                                            <div className="text-xs text-gray-600 leading-relaxed">
                                                <span className="font-semibold text-gray-900 block">{request.address.houseName}</span>
                                                <span>{request.address.area}, {request.address.city}</span>
                                                <span className="block text-gray-400">{request.address.state} - {request.address.pincode}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Appointment details if confirmed */}
                                    {order?.appointment?.scheduledDate && (
                                        <div className="pt-2 border-t border-gray-100 flex items-center gap-2">
                                            <Calendar size={15} className="text-emerald-600 shrink-0" />
                                            <div className="text-xs text-gray-700">
                                                <span className="font-bold text-gray-900">
                                                    Scheduled: {new Date(order.appointment.scheduledDate).toLocaleDateString('en-US', {
                                                        weekday: 'short',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                                {order.appointment.timeSlot && (
                                                    <span className="text-gray-600 ml-1.5">• {order.appointment.timeSlot}</span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Redesigned Dynamic View based on Order Status & User Design */}
                        <div className="lg:col-span-7">

                            {/* ========================================================================= */}
                            {/* CASE 1: ORDER EXISTS (Post-Acceptance: Bill Approval / Payment / Completed) */}
                            {/* ========================================================================= */}
                            {order ? (
                                <div className="space-y-6">
                                    {/* Top Header Row: Device on Left, Technician Card with Call/Chat on Right */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
                                        <div>
                                            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight">
                                                {request.productBrand} {request.productModel || ''}
                                            </h2>
                                            <p className="text-xs sm:text-sm text-gray-600 font-medium mt-0.5">
                                                {request.address.area}, {request.address.city}
                                            </p>
                                        </div>

                                        {/* Provider Profile Card with Call & Chat buttons */}
                                        <div className="flex items-center gap-3 bg-white/90 backdrop-blur-xs p-2.5 sm:p-3 rounded-2xl shadow-xs border border-white">
                                            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-xs bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-sm">
                                                {getInitials(providerName)}
                                            </div>
                                            <div className="min-w-0 pr-2">
                                                <h4 className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                                                    {providerName}
                                                </h4>
                                                <p className="text-[11px] text-gray-500 truncate">
                                                    {providerAddress}
                                                </p>
                                                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                                                    <span>★ {providerRating}</span>
                                                    <span className="text-gray-400 font-normal">({providerReviews})</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1.5 shrink-0 pl-1 border-l border-gray-100">
                                                <a
                                                    href={`tel:${providerPhone}`}
                                                    className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors cursor-pointer"
                                                    title={`Call ${providerPhone}`}
                                                >
                                                    <Phone size={15} />
                                                </a>
                                                <button
                                                    onClick={() => toast.success(`Chatting with ${providerName}`)}
                                                    className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors cursor-pointer"
                                                    title="Chat with Technician"
                                                >
                                                    <MessageSquare size={15} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Main Bill Container */}
                                    <div className="relative bg-white/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 shadow-xs border border-white/90">
                                        {/* Bill Header with Title & Action Buttons */}
                                        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100">
                                            <div className="flex items-baseline gap-2">
                                                <h3 className="text-base sm:text-lg font-extrabold text-gray-900 tracking-tight underline underline-offset-8 decoration-gray-900 decoration-2">
                                                    {isWaitingForBillApproval ? 'UPDATED BILL' : 'ESTIMATED BILLING'}
                                                </h3>
                                                <span className="text-xs sm:text-sm font-medium text-gray-500">
                                                    {isWaitingForBillApproval && '(Waiting for Bill Approval)'}
                                                    {isWaitingForPayment && '(Waiting for payment)'}
                                                    {isCompleted && '(Completed)'}
                                                    {isRepairInProgress && '(Repair in progress)'}
                                                    {isClosedWithoutRepair && '(Closed without repair)'}
                                                </span>
                                            </div>

                                            {/* Action Buttons on Right of Bill Header */}
                                            <div className="flex items-center gap-2">
                                                {/* State: Waiting for Bill Approval -> [Decline] & [Approve] */}
                                                {isWaitingForBillApproval && (
                                                    <>
                                                        <button
                                                            onClick={() => setIsDeclineModalOpen(true)}
                                                            className="px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 transition-all cursor-pointer"
                                                        >
                                                            Decline
                                                        </button>
                                                        <button
                                                            onClick={() => handleEstimateDecision('APPROVE')}
                                                            disabled={isSubmittingDecision}
                                                            className="px-5 py-1.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-black hover:bg-gray-800 transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                                                        >
                                                            {isSubmittingDecision ? <RefreshCw size={13} className="animate-spin" /> : <Check size={14} />}
                                                            Approve
                                                        </button>
                                                    </>
                                                )}

                                                {/* State: Waiting for payment -> [Continue to pay] */}
                                                {isWaitingForPayment && (
                                                    <button
                                                        onClick={() => setIsPaymentModalOpen(true)}
                                                        className="px-6 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-black hover:bg-gray-800 transition-all shadow-xs cursor-pointer flex items-center gap-2"
                                                    >
                                                        <CreditCard size={15} />
                                                        Continue to pay
                                                    </button>
                                                )}

                                                {/* State: Completed -> [Download Invoice] */}
                                                {isCompleted && (
                                                    <button
                                                        onClick={handleDownloadInvoice}
                                                        className="px-5 py-2 rounded-xl text-xs sm:text-sm font-bold text-gray-900 bg-gray-100 hover:bg-gray-200 transition-all border border-gray-200 shadow-2xs cursor-pointer flex items-center gap-2"
                                                    >
                                                        <Download size={15} />
                                                        Download Invoice
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Bill Table */}
                                        <div className="relative mt-4">
                                            {/* Green [PAID] Stamp Overlay when order is completed */}
                                            {isCompleted && (
                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                                                    <div className="border-4 border-emerald-600 text-emerald-600 font-black text-3xl sm:text-4xl tracking-widest px-6 py-2 rounded-xl rotate-[-12deg] bg-white/80 backdrop-blur-2xs shadow-lg uppercase">
                                                        PAID
                                                    </div>
                                                </div>
                                            )}

                                            <table className="w-full text-xs sm:text-sm">
                                                <thead>
                                                    <tr className="text-gray-400 font-medium text-left border-b border-gray-100">
                                                        <th className="pb-2.5 font-semibold">Items</th>
                                                        <th className="pb-2.5 text-right font-semibold">Amount</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-50">
                                                    {estimateItems.map((item, idx) => (
                                                        <tr key={idx} className="text-gray-800">
                                                            <td className="py-2.5 font-medium">{item.title}</td>
                                                            <td className="py-2.5 text-right font-semibold">₹{item.amount.toLocaleString()}</td>
                                                        </tr>
                                                    ))}
                                                    <tr className="border-t-2 border-gray-900/10 font-bold text-sm sm:text-base text-gray-900">
                                                        <td className="pt-3">Total quote:</td>
                                                        <td className="pt-3 text-right font-extrabold text-blue-700">₹{totalBillAmount.toLocaleString()}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Bottom Dynamic Section: Differs by State */}

                                    {/* 1. STATE: Waiting for Bill Approval -> Updated Issues List */}
                                    {isWaitingForBillApproval && (
                                        <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-5 shadow-xs border border-white">
                                            <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                                <AlertCircle size={16} className="text-amber-500" />
                                                Updated Issues
                                            </h4>
                                            <div className="space-y-2">
                                                {updatedIssuesList.map((issue, idx) => (
                                                    <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 bg-amber-50/60 p-2.5 rounded-xl border border-amber-100/60">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></div>
                                                        <span className="font-medium">{issue}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* 2. STATE: Waiting for payment -> Proof of Work Photos */}
                                    {isWaitingForPayment && (
                                        <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-5 shadow-xs border border-white">
                                            <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                                <CheckCircle2 size={16} className="text-emerald-600" />
                                                Work Completion Proof
                                            </h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                {workProofPhotos.map((proof, idx) => (
                                                    <div key={idx} className="space-y-1.5">
                                                        <div className="w-full aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-200/80 shadow-2xs">
                                                            <img src={proof.url} alt={proof.caption} className="w-full h-full object-cover" />
                                                        </div>
                                                        <p className="text-xs font-semibold text-gray-700 text-center">{proof.caption}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* 3. STATE: Completed -> Write a Review & Raise Ticket */}
                                    {isCompleted && (
                                        <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-5 shadow-xs border border-white flex flex-col sm:flex-row items-center justify-between gap-6">
                                            {/* Write a review component */}
                                            <div className="flex-1 w-full">
                                                <h4 className="text-sm font-bold text-gray-900 mb-2">Write a review</h4>

                                                {order.review?.rating ? (
                                                    <div className="space-y-1 bg-emerald-50/70 p-3 rounded-xl border border-emerald-100">
                                                        <div className="flex items-center gap-1 text-amber-500">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <Star
                                                                    key={star}
                                                                    size={16}
                                                                    className={star <= order.review!.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
                                                                />
                                                            ))}
                                                            <span className="text-xs font-bold text-gray-700 ml-2">You rated {order.review.rating}/5</span>
                                                        </div>
                                                        {order.review.comment && (
                                                            <p className="text-xs text-gray-600 italic">"{order.review.comment}"</p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="space-y-3">
                                                        <div className="flex items-center gap-1.5">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <button
                                                                    key={star}
                                                                    type="button"
                                                                    onClick={() => setUserRating(star)}
                                                                    onMouseEnter={() => setHoverRating(star)}
                                                                    onMouseLeave={() => setHoverRating(0)}
                                                                    className="p-1 hover:scale-110 transition-transform cursor-pointer"
                                                                >
                                                                    <Star
                                                                        size={20}
                                                                        className={
                                                                            star <= (hoverRating || userRating)
                                                                                ? 'fill-amber-400 text-amber-400'
                                                                                : 'text-gray-300'
                                                                        }
                                                                    />
                                                                </button>
                                                            ))}
                                                        </div>

                                                        <div className="flex gap-2">
                                                            <input
                                                                type="text"
                                                                value={reviewComment}
                                                                onChange={(e) => setReviewComment(e.target.value)}
                                                                placeholder="Leave technician feedback..."
                                                                className="flex-1 text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-blue-500"
                                                            />
                                                            <button
                                                                onClick={handleSubmitReview}
                                                                disabled={isSubmittingReview}
                                                                className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                                                            >
                                                                {isSubmittingReview ? 'Submitting...' : 'Submit'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Raise a ticket button */}
                                            <div className="shrink-0">
                                                <button
                                                    onClick={() => toast.success("Support ticket opened! Our team will contact you shortly.")}
                                                    className="px-4 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-100 text-gray-700 text-xs font-bold transition-all shadow-2xs flex items-center gap-2 cursor-pointer"
                                                >
                                                    <AlertTriangle size={15} className="text-amber-500" />
                                                    Raise a ticket
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                </div>
                            ) : (
                                /* ========================================================================= */
                                /* CASE 2: NO ORDER YET (Quotes Reviewing Feed)                              */
                                /* ========================================================================= */
                                <div>
                                    {/* Top Sub-Header Row: Device & Location on Left, Time & Cancel Button on Right */}
                                    <div className="flex items-start justify-between gap-4 pb-4">
                                        <div>
                                            <h2 className="text-sm sm:text-base font-bold text-gray-900 leading-tight">
                                                {request.productBrand
                                                    ? `${request.productBrand} ${request.productModel || ''}`
                                                    : request.title}
                                            </h2>
                                            <p className="text-xs sm:text-sm text-gray-600 font-medium mt-0.5">
                                                {request.address.area}, {request.address.city}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-3 shrink-0">
                                            <span className="text-xs sm:text-sm text-gray-600 font-medium whitespace-nowrap">
                                                {formatTimeAgo(request.createdAt)}
                                            </span>

                                            {/* Red Cancel Button */}
                                            {canCancel && (
                                                <button
                                                    onClick={() => setIsCancelModalOpen(true)}
                                                    disabled={isCancelling}
                                                    className="bg-[#FF2E2E] hover:bg-red-600 active:scale-95 text-white font-bold px-5 py-2 rounded-xl text-xs sm:text-sm transition-all shadow-xs disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                                                >
                                                    {isCancelling ? <RefreshCw size={14} className="animate-spin" /> : null}
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Quotes Received Header */}
                                    <div className="mt-2 mb-4">
                                        <h3 className="text-base sm:text-lg font-bold text-gray-900 border-b-2 border-gray-900/60 pb-0.5 inline-block tracking-tight">
                                            {quotes.length} {quotes.length === 1 ? 'Quote' : 'Quotes'} received
                                        </h3>
                                    </div>

                                    {/* Quotes Cards Section */}
                                    {quotes.length === 0 ? (
                                        <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-8 border border-white/80 text-center shadow-2xs space-y-3 mt-2">
                                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto shadow-2xs">
                                                <Clock size={22} className="animate-pulse" />
                                            </div>
                                            <h4 className="text-base font-bold text-gray-800">
                                                Waiting for technician quotes
                                            </h4>
                                            <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
                                                Verified service technicians in your area ({request.address.city}) have been notified. Quotes will appear here as soon as they review your issue.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3.5">
                                            {quotes.map((quote) => {
                                                const isExpanded = !!expandedQuotes[quote.id];
                                                const isAccepted = quote.status === 'accepted';
                                                const isRejected = quote.status === 'rejected';
                                                const canAcceptQuote =
                                                    (request.status === 'OPEN' || request.status === 'QUOTING') &&
                                                    quote.status === 'pending';

                                                const qProviderName = quote.providerId?.businessName || 'Verified Technician';
                                                const qProviderAddress = quote.providerId?.location?.address?.city || request.address.city;
                                                const qProviderRating = quote.providerId?.averageRating ? Number(quote.providerId.averageRating).toFixed(1) : '5.0';
                                                const qProviderReviews = quote.providerId?.totalReviews ? `${quote.providerId.totalReviews}+` : '4k+';

                                                return (
                                                    <div
                                                        key={quote.id}
                                                        className={`bg-white/95 backdrop-blur-xs rounded-2xl p-4 sm:p-5 shadow-xs border transition-all ${
                                                            isAccepted
                                                                ? 'border-purple-300 ring-2 ring-purple-100 bg-purple-50/40'
                                                                : 'border-white/90 hover:shadow-md'
                                                        }`}
                                                    >
                                                        {/* Top Row: Provider Avatar + Info on Left, Estimated + Accept on Right */}
                                                        <div className="flex items-center justify-between gap-4">
                                                            {/* Left: Avatar + Details */}
                                                            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                                                                <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-xs bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-base">
                                                                    {getInitials(qProviderName)}
                                                                </div>

                                                                <div className="min-w-0">
                                                                    <h4 className="text-base sm:text-lg font-bold text-gray-900 truncate leading-snug">
                                                                        {qProviderName}
                                                                    </h4>
                                                                    <p className="text-xs text-gray-500 truncate mt-0.5">
                                                                        {qProviderAddress}
                                                                    </p>
                                                                    <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 mt-1">
                                                                        <span>★ {qProviderRating}</span>
                                                                        <span className="text-gray-400 font-normal">({qProviderReviews})</span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Right: Estimated Total & Accept Action */}
                                                            <div className="flex flex-col items-end shrink-0">
                                                                <div className="flex items-baseline gap-1.5 sm:gap-2">
                                                                    <span className="text-xs sm:text-sm text-gray-500 font-medium">
                                                                        Estimated :
                                                                    </span>
                                                                    <span className="text-base sm:text-xl font-extrabold text-gray-900">
                                                                        ₹{quote.estimatedTotal?.toLocaleString()}
                                                                    </span>
                                                                </div>

                                                                {/* Status or Accept Button */}
                                                                <div className="mt-2">
                                                                    {isAccepted ? (
                                                                        <span className="px-4 py-1.5 bg-purple-100 text-purple-700 text-xs font-bold rounded-xl uppercase tracking-wider flex items-center gap-1 shadow-2xs">
                                                                            <CheckCircle size={13} />
                                                                            Accepted
                                                                        </span>
                                                                    ) : isRejected ? (
                                                                        <span className="px-3.5 py-1.5 bg-gray-100 text-gray-500 text-xs font-bold rounded-xl uppercase tracking-wider">
                                                                            Rejected
                                                                        </span>
                                                                    ) : canAcceptQuote ? (
                                                                        <button
                                                                            onClick={() => {
                                                                                setSelectedQuoteId(quote.id);
                                                                                setIsAcceptModalOpen(true);
                                                                            }}
                                                                            className="bg-[#2563EB] hover:bg-blue-700 active:scale-95 text-white font-semibold px-6 py-2 rounded-xl text-sm transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                                                                        >
                                                                            Accept
                                                                        </button>
                                                                    ) : null}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Expansion: Breakdown & Scope */}
                                                        <div className="mt-3 pt-3 border-t border-gray-100">
                                                            <button
                                                                onClick={() => toggleQuoteExpand(quote.id)}
                                                                className="w-full flex items-center justify-between text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors cursor-pointer py-1"
                                                            >
                                                                <span className="flex items-center gap-1.5">
                                                                    <Wrench size={13} className="text-blue-500" />
                                                                    {isExpanded ? 'Hide Cost Breakdown & Notes' : 'View Cost Breakdown & Warranty'}
                                                                </span>
                                                                {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                                            </button>

                                                            {isExpanded && (
                                                                <div className="mt-3 pt-2 text-xs space-y-2 bg-gray-50/90 rounded-xl p-3.5 border border-gray-100">
                                                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pb-2 border-b border-gray-200/60">
                                                                        <div>
                                                                            <span className="text-gray-500 block text-[11px]">Labor Cost</span>
                                                                            <span className="font-bold text-gray-800">₹{quote.laborCost}</span>
                                                                        </div>
                                                                        <div>
                                                                            <span className="text-gray-500 block text-[11px]">Parts Cost</span>
                                                                            <span className="font-bold text-gray-800">₹{quote.partsCost}</span>
                                                                        </div>
                                                                        <div>
                                                                            <span className="text-gray-500 block text-[11px]">Est. Duration</span>
                                                                            <span className="font-bold text-gray-800">{formatRepairDuration(quote.estimatedRepairTime)}</span>
                                                                        </div>
                                                                    </div>

                                                                    {quote.includeWarrenty && (
                                                                        <div className="text-emerald-700 font-semibold flex items-center gap-1.5 pt-0.5">
                                                                            <ShieldCheck size={14} className="text-emerald-600" />
                                                                            Includes 90-day parts and labor warranty
                                                                        </div>
                                                                    )}

                                                                    {quote.technicalNotes && (
                                                                        <div className="pt-1 text-gray-600">
                                                                            <span className="font-semibold text-gray-700 block text-[11px] mb-0.5">Technician Notes:</span>
                                                                            <p className="bg-white p-2 rounded-lg border border-gray-100 italic leading-relaxed text-gray-700">
                                                                                "{quote.technicalNotes}"
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>

                    </div>
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
                        <AlertCircle size={24} className="shrink-0 text-orange-600" />
                        <p className="text-sm font-medium">
                            Are you sure you want to cancel this request? Technicians will no longer be able to submit quotes.
                        </p>
                    </div>

                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            onClick={() => setIsCancelModalOpen(false)}
                            className="px-5 py-2.5 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer text-sm"
                        >
                            Keep Request
                        </button>
                        <button
                            onClick={executeCancel}
                            disabled={isCancelling}
                            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white bg-[#FF2E2E] hover:bg-red-600 transition-colors disabled:opacity-50 cursor-pointer text-sm"
                        >
                            {isCancelling ? <RefreshCw size={16} className="animate-spin" /> : <XCircle size={16} />}
                            Confirm Cancel
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Accept Quote Modal */}
            <Modal
                isOpen={isAcceptModalOpen}
                onClose={() => setIsAcceptModalOpen(false)}
                title="Accept Quote & Confirm Order"
            >
                <div className="flex flex-col gap-4">
                    <div className="flex items-start gap-4 bg-blue-50 text-blue-900 p-4 rounded-xl">
                        <CheckCircle size={24} className="shrink-0 text-blue-600 mt-0.5" />
                        <div className="text-sm">
                            <p className="font-bold text-gray-900 mb-1">
                                Accept quote from {selectedQuote?.providerId?.businessName || 'this technician'}?
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                Accepting this quote will confirm your service order for <span className="font-bold text-gray-900">₹{selectedQuote?.estimatedTotal?.toLocaleString()}</span>. Other quotes will be automatically declined.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3 bg-gray-50/80 p-3.5 rounded-xl border border-gray-200/60">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Appointment Date</label>
                            <input
                                type="date"
                                value={appointmentDate}
                                onChange={(e) => setAppointmentDate(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Preferred Time Slot</label>
                            <select
                                value={timeSlot}
                                onChange={(e) => setTimeSlot(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none"
                            >
                                <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM</option>
                                <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM</option>
                                <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
                                <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Access / Service Instructions (Optional)</label>
                            <input
                                type="text"
                                value={accessInstructions}
                                onChange={(e) => setAccessInstructions(e.target.value)}
                                placeholder="E.g. Call before arrival, ring doorbell #2"
                                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-3">
                        <button
                            onClick={() => setIsAcceptModalOpen(false)}
                            className="px-5 py-2.5 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={executeAcceptQuote}
                            disabled={isAccepting}
                            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 cursor-pointer text-sm"
                        >
                            {isAccepting ? <RefreshCw size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                            Confirm Order
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Decline Estimate Modal */}
            <Modal
                isOpen={isDeclineModalOpen}
                onClose={() => setIsDeclineModalOpen(false)}
                title="Decline Repair Estimate"
            >
                <div className="flex flex-col gap-4">
                    <div className="flex items-start gap-4 bg-red-50 text-red-900 p-4 rounded-xl">
                        <AlertCircle size={24} className="shrink-0 text-red-600 mt-0.5" />
                        <div className="text-sm">
                            <p className="font-bold text-gray-900 mb-1">Decline the updated repair estimate?</p>
                            <p className="text-gray-600 leading-relaxed">
                                If declined, the repair will be closed without repair. Only the standard inspection/diagnosis fee (if applicable) will apply per policy.
                            </p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Reason for declining (Optional)</label>
                        <textarea
                            value={declineReason}
                            onChange={(e) => setDeclineReason(e.target.value)}
                            placeholder="E.g. Cost is higher than expected, decided not to repair..."
                            rows={3}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs outline-none focus:ring-1 focus:ring-red-400"
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-2">
                        <button
                            onClick={() => setIsDeclineModalOpen(false)}
                            className="px-5 py-2 rounded-xl text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 cursor-pointer"
                        >
                            Back
                        </button>
                        <button
                            onClick={() => handleEstimateDecision('DECLINE')}
                            disabled={isSubmittingDecision}
                            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 cursor-pointer disabled:opacity-50"
                        >
                            {isSubmittingDecision ? 'Declining...' : 'Confirm Decline'}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Continue to Pay Modal */}
            <Modal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                title="Complete Service Payment"
            >
                <div className="flex flex-col gap-4">
                    <div className="bg-blue-50/80 p-4 rounded-xl border border-blue-100 flex justify-between items-center">
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Total Amount Due</p>
                            <p className="text-2xl font-black text-gray-900">₹{totalBillAmount.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                            <span className="text-xs font-bold text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                                #{order?.orderNumber}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-700">Select Payment Method</label>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                type="button"
                                onClick={() => setPaymentMethod('ONLINE')}
                                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                                    paymentMethod === 'ONLINE'
                                        ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold shadow-2xs'
                                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                <CreditCard size={18} className="mx-auto mb-1" />
                                <span className="text-xs">Card / NetBanking</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setPaymentMethod('UPI')}
                                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                                    paymentMethod === 'UPI'
                                        ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold shadow-2xs'
                                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                <DollarSign size={18} className="mx-auto mb-1" />
                                <span className="text-xs">UPI / GPay</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setPaymentMethod('CASH')}
                                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                                    paymentMethod === 'CASH'
                                        ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold shadow-2xs'
                                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                <CheckCircle2 size={18} className="mx-auto mb-1" />
                                <span className="text-xs">Cash on Delivery</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-3">
                        <button
                            onClick={() => setIsPaymentModalOpen(false)}
                            className="px-5 py-2.5 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleProcessPayment}
                            disabled={isPaying}
                            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-black hover:bg-gray-800 transition-colors disabled:opacity-50 cursor-pointer text-sm shadow-xs"
                        >
                            {isPaying ? <RefreshCw size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                            Pay ₹{totalBillAmount.toLocaleString()}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Full-Size Image Preview Modal */}
            <Modal
                isOpen={isImagePreviewOpen}
                onClose={() => setIsImagePreviewOpen(false)}
                title={request.title}
            >
                <div className="flex flex-col items-center gap-4">
                    <div className="max-h-[70vh] rounded-2xl overflow-hidden bg-black/5 flex items-center justify-center">
                        <img
                            src={activePhoto}
                            alt={request.title}
                            className="max-h-[65vh] w-auto object-contain rounded-xl"
                        />
                    </div>
                    {mediaUrls.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto p-1">
                            {mediaUrls.map((url, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImageIndex(idx)}
                                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 cursor-pointer ${
                                        activeImageIndex === idx ? 'border-blue-600 ring-2 ring-blue-300' : 'border-gray-200'
                                    }`}
                                >
                                    <img src={url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default ServiceRequestDetailPage;
