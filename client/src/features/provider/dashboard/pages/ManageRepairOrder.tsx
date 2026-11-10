import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderApi } from '@/features/orders/api/orderApi';
import type { Order, OrderStatus, WorkStage, IEstimateItem, IWorkProofPhoto } from '@/features/orders/dtos/OrderDTOs';
import { uploadFileToS3, getPresignedDisplayUrl } from '../../../../services/imageService';
import {
    ArrowLeft,
    Wrench,
    CheckCircle2,
    Calendar,
    MapPin,
    DollarSign,
    Plus,
    Trash2,
    Camera,
    RefreshCw,
    Check,
    Star,
    Phone,
    User,
    FileText,
    AlertCircle,
    ZoomIn,
    Image as ImageIcon
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManageRepairOrder() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [requestMediaUrls, setRequestMediaUrls] = useState<string[]>([]);
    const [activeImagePreview, setActiveImagePreview] = useState<string | null>(null);

    // Diagnosis Form State
    const [diagnosisSummary, setDiagnosisSummary] = useState('');
    const [identifiedIssues, setIdentifiedIssues] = useState<string[]>(['']);
    const [isSubmittingDiagnosis, setIsSubmittingDiagnosis] = useState(false);

    // Estimate Form State
    const [estimateItems, setEstimateItems] = useState<IEstimateItem[]>([
        { title: '', amount: 0, type: 'PARTS' }
    ]);
    const [laborCost, setLaborCost] = useState<number>(0);
    const [warranty, setWarranty] = useState<string>('30-day service warranty');
    const [repairNotes, setRepairNotes] = useState<string>('');
    const [isSubmittingEstimate, setIsSubmittingEstimate] = useState(false);

    // Completion Form State
    const [completionNotes, setCompletionNotes] = useState('');
    const [workProofPhotos, setWorkProofPhotos] = useState<IWorkProofPhoto[]>([]);
    const [isSubmittingCompletion, setIsSubmittingCompletion] = useState(false);
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

    const fetchOrderDetails = async () => {
        if (!id) return;
        try {
            setLoading(true);
            const res = await orderApi.getOrderById(id);
            if (res.data.success && res.data.data) {
                const ord = res.data.data;
                setOrder(ord);

                // Populate Diagnosis
                if (ord.diagnosis?.summary) {
                    setDiagnosisSummary(ord.diagnosis.summary);
                }
                if (ord.diagnosis?.identifiedIssues && ord.diagnosis.identifiedIssues.length > 0) {
                    setIdentifiedIssues(ord.diagnosis.identifiedIssues);
                }

                // Populate Estimate
                if (ord.repairEstimate?.items && ord.repairEstimate.items.length > 0) {
                    setEstimateItems(ord.repairEstimate.items);
                }
                if (ord.repairEstimate?.laborCost !== undefined) {
                    setLaborCost(ord.repairEstimate.laborCost);
                } else if (!ord.repairEstimate?.items && ord.initialQuoteAmount) {
                    setLaborCost(ord.initialQuoteAmount);
                }
                if (ord.repairEstimate?.warranty) {
                    setWarranty(ord.repairEstimate.warranty);
                }
                if (ord.repairEstimate?.notes) {
                    setRepairNotes(ord.repairEstimate.notes);
                }

                // Populate Completion
                if (ord.completionDetails?.notes) {
                    setCompletionNotes(ord.completionDetails.notes);
                }
                if (ord.completionDetails?.workProofPhotos && ord.completionDetails.workProofPhotos.length > 0) {
                    setWorkProofPhotos(ord.completionDetails.workProofPhotos);
                }

                // Load Customer Request Media Photos
                const reqData = ord.requestId;
                if (reqData && typeof reqData === 'object' && reqData.media && reqData.media.length > 0) {
                    try {
                        const urls = await Promise.all(
                            reqData.media.map(async (key: string) => {
                                const presigned = await getPresignedDisplayUrl(key);
                                return presigned.data?.data || '';
                            })
                        );
                        setRequestMediaUrls(urls.filter(Boolean));
                    } catch (mediaError) {
                        console.error('Failed to fetch request image URLs', mediaError);
                    }
                }
            }
        } catch (error: any) {
            console.error('Failed to load order', error);
            toast.error(error.response?.data?.message || 'Failed to load order details');
            navigate('/provider/dashboard/repairs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrderDetails();
    }, [id]);

    // Handle Diagnosis submission
    const handleSaveDiagnosis = async () => {
        if (!id) return;
        if (!diagnosisSummary.trim()) {
            toast.error('Please enter a diagnosis summary');
            return;
        }

        const filteredIssues = identifiedIssues.filter(i => i.trim().length > 0);
        try {
            setIsSubmittingDiagnosis(true);
            const res = await orderApi.submitDiagnosis(id, {
                summary: diagnosisSummary,
                identifiedIssues: filteredIssues
            });
            if (res.data.success) {
                toast.success('Diagnosis and identified problems recorded successfully!');
                setOrder(res.data.data);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to record diagnosis');
        } finally {
            setIsSubmittingDiagnosis(false);
        }
    };

    // Handle Estimate submission
    const handleSaveEstimate = async () => {
        if (!id) return;
        const validItems = estimateItems.filter(item => item.title.trim().length > 0 && item.amount > 0);
        if (validItems.length === 0 && Number(laborCost || 0) <= 0) {
            toast.error('Please provide at least one item or labor charge with a valid price');
            return;
        }

        // If no items but labor is specified, add a default service item
        const itemsToSubmit = validItems.length > 0 ? validItems : [
            { title: 'Diagnostic & Service Fee', amount: Number(laborCost || 0), type: 'SERVICE' }
        ];

        const partsTotal = itemsToSubmit.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
        const totalAmount = partsTotal + Number(laborCost || 0);

        try {
            setIsSubmittingEstimate(true);
            const res = await orderApi.submitRepairEstimate(id, {
                items: itemsToSubmit,
                partsCost: partsTotal,
                laborCost: Number(laborCost || 0),
                totalAmount,
                warranty,
                notes: repairNotes,
                updatedIssues: identifiedIssues.filter(i => i.trim().length > 0)
            });
            if (res.data.success) {
                toast.success('Updated bill and problems submitted to customer for approval!');
                setOrder(res.data.data);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to submit estimate');
        } finally {
            setIsSubmittingEstimate(false);
        }
    };

    // Handle Completion submission
    const handleCompleteRepair = async () => {
        if (!id) return;
        try {
            setIsSubmittingCompletion(true);
            const res = await orderApi.completeRepair(id, {
                notes: completionNotes || 'Repair completed and verified working',
                workProofPhotos: workProofPhotos.filter(p => p.url && p.caption)
            });
            if (res.data.success) {
                toast.success('Repair marked as complete! Awaiting customer payment.');
                setOrder(res.data.data);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to complete repair');
        } finally {
            setIsSubmittingCompletion(false);
        }
    };

    // Add Issue line
    const addIssueField = () => {
        setIdentifiedIssues(prev => [...prev, '']);
    };

    // Update Issue line
    const updateIssueField = (index: number, val: string) => {
        setIdentifiedIssues(prev => {
            const next = [...prev];
            next[index] = val;
            return next;
        });
    };

    // Remove Issue line
    const removeIssueField = (index: number) => {
        setIdentifiedIssues(prev => prev.filter((_, idx) => idx !== index));
    };

    // Add Item to Estimate
    const addEstimateItem = () => {
        setEstimateItems(prev => [...prev, { title: '', amount: 0, type: 'PARTS' }]);
    };

    // Update Item in Estimate
    const updateEstimateItem = (index: number, key: keyof IEstimateItem, val: any) => {
        setEstimateItems(prev => {
            const next = [...prev];
            next[index] = { ...next[index], [key]: val };
            return next;
        });
    };

    // Remove Item from Estimate
    const removeEstimateItem = (index: number) => {
        setEstimateItems(prev => prev.filter((_, idx) => idx !== index));
    };

    // Handle photo upload
    const handleUploadProofPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        try {
            setIsUploadingPhoto(true);
            const key = await uploadFileToS3(file, '/auth/profile-upload-url');
            setWorkProofPhotos(prev => [...prev, { url: key, caption: file.name }]);
            toast.success('Proof photo uploaded');
        } catch (err) {
            console.error(err);
            toast.error('Failed to upload photo');
        } finally {
            setIsUploadingPhoto(false);
        }
    };

    const getStatusBadge = (status: OrderStatus | string) => {
        const map: Record<string, { label: string; bg: string; text: string }> = {
            REQUESTED: { label: 'Requested', bg: 'bg-gray-100', text: 'text-gray-700' },
            ACCEPTED: { label: 'Accepted', bg: 'bg-blue-100', text: 'text-blue-800' },
            SCHEDULED: { label: 'Scheduled', bg: 'bg-blue-100', text: 'text-blue-800' },
            DIAGNOSIS_IN_PROGRESS: { label: 'Diagnosing', bg: 'bg-amber-100', text: 'text-amber-800' },
            ESTIMATE_PENDING_APPROVAL: { label: 'Awaiting Estimate Approval', bg: 'bg-purple-100', text: 'text-purple-800' },
            REPAIR_IN_PROGRESS: { label: 'Repairing', bg: 'bg-cyan-100', text: 'text-cyan-800' },
            WAITING_FOR_PAYMENT: { label: 'Waiting for Payment', bg: 'bg-orange-100', text: 'text-orange-800' },
            IN_PROGRESS: { label: 'In Progress', bg: 'bg-cyan-100', text: 'text-cyan-800' },
            AWAITING_CUSTOMER: { label: 'Awaiting Customer', bg: 'bg-purple-100', text: 'text-purple-800' },
            COMPLETED: { label: 'Completed', bg: 'bg-emerald-100', text: 'text-emerald-800' },
            CLOSED_WITHOUT_REPAIR: { label: 'Declined by Customer', bg: 'bg-rose-100', text: 'text-rose-800' },
            CANCELLED: { label: 'Cancelled', bg: 'bg-rose-100', text: 'text-rose-800' },
            // Fallbacks for backwards compatibility
            pending: { label: 'Pending Acceptance', bg: 'bg-gray-100', text: 'text-gray-700' },
            scheduled: { label: 'Scheduled', bg: 'bg-blue-100', text: 'text-blue-800' },
            repair_in_progress: { label: 'In Progress', bg: 'bg-cyan-100', text: 'text-cyan-800' },
            estimate_pending_approval: { label: 'Estimate Pending', bg: 'bg-purple-100', text: 'text-purple-800' },
            waiting_for_payment: { label: 'Waiting for Payment', bg: 'bg-orange-100', text: 'text-orange-800' },
            completed: { label: 'Completed', bg: 'bg-emerald-100', text: 'text-emerald-800' },
            closed_without_repair: { label: 'Closed (Declined)', bg: 'bg-rose-100', text: 'text-rose-800' },
            cancelled: { label: 'Cancelled', bg: 'bg-rose-100', text: 'text-rose-800' },
        };
        const config = map[status] || { label: String(status).replace(/_/g, ' '), bg: 'bg-gray-100', text: 'text-gray-700' };
        return (
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${config.bg} ${config.text}`}>
                {config.label}
            </span>
        );
    };

    const getWorkStageBadge = (stage?: WorkStage | string) => {
        if (!stage) return null;
        const map: Record<string, { label: string; bg: string; text: string }> = {
            IN_TRANSIT: { label: 'In Transit', bg: 'bg-amber-50', text: 'text-amber-800' },
            DIAGNOSIS: { label: 'Diagnosing', bg: 'bg-orange-50', text: 'text-orange-800' },
            REPAIR: { label: 'Repairing', bg: 'bg-indigo-50', text: 'text-indigo-800' },
            TESTING: { label: 'Testing', bg: 'bg-teal-50', text: 'text-teal-800' },
            READY_FOR_DELIVERY: { label: 'Ready for Delivery', bg: 'bg-emerald-50', text: 'text-emerald-800' },
        };
        const config = map[stage] || { label: String(stage).replace(/_/g, ' '), bg: 'bg-gray-50', text: 'text-gray-700' };
        return (
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${config.bg} ${config.text} border border-current/15`}>
                {config.label}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-24">
                <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!order) return null;

    const requestData = typeof order.requestId === 'object' ? order.requestId : null;
    const partsTotal = estimateItems.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    const calculatedTotal = partsTotal + (Number(laborCost) || 0);

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            {/* Top Navigation */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => navigate('/provider/dashboard/repairs')}
                    className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-700 cursor-pointer transition-all"
                >
                    <ArrowLeft size={18} />
                </button>
                <div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xl font-extrabold text-gray-900 tracking-tight">
                            Repair Order #{order.orderNumber}
                        </span>
                        {getStatusBadge(order.status)}
                        {order.workStage && getWorkStageBadge(order.workStage)}
                    </div>
                    <p className="text-xs text-gray-500">Service Mode: {order.serviceMode || 'ONSITE'}</p>
                </div>
            </div>

            {/* SERVICE REQUEST DETAILS (Full Customer Issue & Details) */}
            {requestData && (
                <div className="bg-gradient-to-br from-blue-50/90 via-sky-50/50 to-amber-50/40 rounded-2xl p-6 border border-blue-100 shadow-2xs space-y-4">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-blue-600 text-white uppercase tracking-wider">
                                    Customer Request
                                </span>
                                {requestData.urgency && (
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                                        requestData.urgency === 'EMERGENCY'
                                            ? 'bg-red-100 text-red-800 border border-red-200'
                                            : requestData.urgency === 'HIGH'
                                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                            : 'bg-gray-100 text-gray-700'
                                    }`}>
                                        Urgency: {requestData.urgency}
                                    </span>
                                )}
                            </div>
                            <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 mt-2">
                                {requestData.title}
                            </h2>
                            {requestData.productBrand && (
                                <p className="text-xs sm:text-sm font-semibold text-blue-700 mt-0.5">
                                    Device / Product: {requestData.productBrand} {requestData.productModel || ''}
                                </p>
                            )}
                        </div>

                        <div className="text-right shrink-0">
                            <span className="text-xs text-gray-500 block">Agreed Initial Quote</span>
                            <span className="text-lg font-black text-gray-900">
                                ₹{order.initialQuoteAmount?.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    {/* Customer Problem Description */}
                    <div className="bg-white/80 rounded-xl p-3.5 border border-blue-100/80">
                        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                            Customer's Problem Description
                        </span>
                        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-normal">
                            {requestData.description || 'No description provided.'}
                        </p>
                    </div>

                    {/* Customer Uploaded Damage Photos */}
                    {requestMediaUrls.length > 0 && (
                        <div>
                            <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                                <ImageIcon size={14} className="text-blue-600" />
                                Customer Attached Photos ({requestMediaUrls.length})
                            </span>
                            <div className="flex items-center gap-3 overflow-x-auto pb-1">
                                {requestMediaUrls.map((url, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => setActiveImagePreview(url)}
                                        className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 shadow-2xs shrink-0 cursor-pointer group hover:border-blue-500 transition-all"
                                    >
                                        <img src={url} alt={`Request Attachment ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                                            <ZoomIn size={16} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Customer & Service Summary Card */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-2xs grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Customer</span>
                    <p className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                        <User size={15} className="text-gray-500" />
                        {order.customerId?.name || 'Customer'}
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5 flex items-center gap-1">
                        <Phone size={12} className="text-gray-400" />
                        {order.customerId?.phone || 'Contact provided on order'}
                    </p>
                </div>

                <div>
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Address / Handover</span>
                    <p className="text-xs text-gray-700 flex items-start gap-1">
                        <MapPin size={13} className="text-blue-600 shrink-0 mt-0.5" />
                        <span>
                            {order.appointment?.serviceAddress?.houseName ? `${order.appointment.serviceAddress.houseName}, ` : ''}
                            {order.appointment?.serviceAddress?.city || 'Local Customer Address'}
                        </span>
                    </p>
                    {order.appointment?.accessInstructions && (
                        <p className="text-[11px] text-gray-500 italic mt-1">
                            Note: "{order.appointment.accessInstructions}"
                        </p>
                    )}
                </div>

                <div>
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Appointment Schedule</span>
                    <p className="text-xs font-semibold text-gray-800 flex items-center gap-1">
                        <Calendar size={13} className="text-emerald-600" />
                        {order.appointment?.scheduledDate
                            ? new Date(order.appointment.scheduledDate).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            })
                            : 'To be scheduled'}
                    </p>
                    {order.appointment?.timeSlot && (
                        <p className="text-[11px] text-gray-500 mt-0.5">Time: {order.appointment.timeSlot}</p>
                    )}
                </div>
            </div>

            {/* LIFECYCLE SECTION 1: PHYSICAL DIAGNOSIS & IDENTIFIED ISSUES */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-2">
                        <Wrench size={18} className="text-blue-600" />
                        <h3 className="text-base font-bold text-gray-900">Step 1: Physical Diagnosis & Problems</h3>
                    </div>
                    {order.diagnosis?.completedAt && (
                        <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 size={14} /> Diagnosis Recorded
                        </span>
                    )}
                </div>

                <div className="space-y-3">
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Diagnosis Summary</label>
                        <textarea
                            value={diagnosisSummary}
                            onChange={(e) => setDiagnosisSummary(e.target.value)}
                            placeholder="Describe findings upon inspection (e.g. Display digitizer faulty, liquid residue on board...)"
                            rows={3}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Identified Problems / Issues (These will appear on customer's service request)
                        </label>
                        <div className="space-y-2">
                            {identifiedIssues.map((issue, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={issue}
                                        onChange={(e) => updateIssueField(idx, e.target.value)}
                                        placeholder={`Problem #${idx + 1} (e.g. Display replacement required)`}
                                        className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-100"
                                    />
                                    {identifiedIssues.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeIssueField(idx)}
                                            className="p-2 text-gray-400 hover:text-red-500 rounded-lg cursor-pointer"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={addIssueField}
                            className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                        >
                            <Plus size={14} /> Add Another Problem
                        </button>
                    </div>

                    <div className="flex justify-end pt-2">
                        <button
                            type="button"
                            onClick={handleSaveDiagnosis}
                            disabled={isSubmittingDiagnosis}
                            className="px-5 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                            {isSubmittingDiagnosis ? <RefreshCw size={13} className="animate-spin" /> : <Check size={13} />}
                            Save Diagnosis & Problems
                        </button>
                    </div>
                </div>
            </div>

            {/* LIFECYCLE SECTION 2: ITEMIZED REPAIR ESTIMATE ("UPDATED BILL & PRICE") */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-2">
                        <DollarSign size={18} className="text-emerald-600" />
                        <h3 className="text-base font-bold text-gray-900">Step 2: Submit Updated Bill & Price</h3>
                    </div>
                    {order.repairEstimate?.status && (
                        <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                                order.repairEstimate.status === 'APPROVED'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : order.repairEstimate.status === 'REJECTED'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-purple-100 text-purple-800'
                            }`}>
                                Customer Decision: {order.repairEstimate.status}
                            </span>
                        </div>
                    )}
                </div>

                {order.repairEstimate?.status === 'REJECTED' && order.repairEstimate.rejectionReason && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-800 flex items-start gap-2">
                        <AlertCircle size={15} className="text-red-600 shrink-0 mt-0.5" />
                        <div>
                            <span className="font-bold">Customer declined the estimate:</span> "{order.repairEstimate.rejectionReason}"
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    {/* Line Items Table */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-gray-700">Parts / Component Line Items</span>
                            <button
                                type="button"
                                onClick={addEstimateItem}
                                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                            >
                                <Plus size={14} /> Add Line Item
                            </button>
                        </div>

                        <div className="space-y-2">
                            {estimateItems.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={item.title}
                                        onChange={(e) => updateEstimateItem(idx, 'title', e.target.value)}
                                        placeholder="Item Title (e.g. Original Screen, Battery Pack)"
                                        className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-100"
                                    />
                                    <div className="relative w-36">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₹</span>
                                        <input
                                            type="number"
                                            value={item.amount || ''}
                                            onChange={(e) => updateEstimateItem(idx, 'amount', Number(e.target.value))}
                                            placeholder="Amount"
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-7 pr-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-100 text-right font-semibold"
                                        />
                                    </div>
                                    {estimateItems.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeEstimateItem(idx)}
                                            className="p-2 text-gray-400 hover:text-red-500 rounded-lg cursor-pointer"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Labor Cost & Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Labor / Service Charge (₹)</label>
                            <input
                                type="number"
                                value={laborCost}
                                onChange={(e) => setLaborCost(Number(e.target.value))}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-100 font-semibold"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Warranty Term</label>
                            <input
                                type="text"
                                value={warranty}
                                onChange={(e) => setWarranty(e.target.value)}
                                placeholder="E.g. 90-day parts and labor warranty"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-100"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Technician Notes for Customer (Optional)</label>
                        <input
                            type="text"
                            value={repairNotes}
                            onChange={(e) => setRepairNotes(e.target.value)}
                            placeholder="E.g. Genuine OEM parts, 1 hour service turn-around time"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    {/* Calculated Total Bar */}
                    <div className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-100 flex justify-between items-center">
                        <div>
                            <span className="text-xs font-bold text-gray-700 block">Total Updated Quote:</span>
                            <span className="text-[11px] text-gray-500">
                                Initial Baseline: ₹{order.initialQuoteAmount?.toLocaleString()}
                                {calculatedTotal !== order.initialQuoteAmount && (
                                    <span className="text-blue-700 font-bold ml-1">
                                        ({calculatedTotal > order.initialQuoteAmount ? '+' : ''}₹{(calculatedTotal - order.initialQuoteAmount).toLocaleString()})
                                    </span>
                                )}
                            </span>
                        </div>
                        <span className="text-lg font-black text-blue-700">₹{calculatedTotal.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-end pt-2">
                        <button
                            type="button"
                            onClick={handleSaveEstimate}
                            disabled={isSubmittingEstimate}
                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                            {isSubmittingEstimate ? <RefreshCw size={13} className="animate-spin" /> : <FileText size={14} />}
                            Send Updated Bill to Customer
                        </button>
                    </div>
                </div>
            </div>

            {/* LIFECYCLE SECTION 3: REPAIR COMPLETION & WORK PROOF PHOTOS */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-2">
                        <Camera size={18} className="text-purple-600" />
                        <h3 className="text-base font-bold text-gray-900">Step 3: Work Completion & Proof</h3>
                    </div>
                    {order.completionDetails?.completedAt && (
                        <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 size={14} /> Completed
                        </span>
                    )}
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Completion Notes</label>
                        <textarea
                            value={completionNotes}
                            onChange={(e) => setCompletionNotes(e.target.value)}
                            placeholder="E.g. Screen replaced, adhesive cured, tested touch response and battery health..."
                            rows={2}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-xs font-semibold text-gray-700">Proof of Work Photos</label>
                            <label className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer flex items-center gap-1">
                                <Plus size={14} className={isUploadingPhoto ? 'animate-spin' : ''} />
                                {isUploadingPhoto ? 'Uploading...' : 'Upload New Photo'}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleUploadProofPhoto}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        {workProofPhotos.length === 0 ? (
                            <p className="text-xs text-gray-400 italic">No proof photos uploaded yet. Upload before completing repair.</p>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {workProofPhotos.map((photo, idx) => (
                                    <div key={idx} className="space-y-1 bg-gray-50 p-2 rounded-xl border border-gray-200">
                                        <div className="aspect-video rounded-lg overflow-hidden bg-gray-200">
                                            <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover" />
                                        </div>
                                        <input
                                            type="text"
                                            value={photo.caption}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setWorkProofPhotos(prev => {
                                                    const next = [...prev];
                                                    next[idx] = { ...next[idx], caption: val };
                                                    return next;
                                                });
                                            }}
                                            placeholder="Caption (e.g. Strip Changed)"
                                            className="w-full bg-white border border-gray-200 rounded-md px-2 py-1 text-[11px] outline-none"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end pt-2">
                        <button
                            type="button"
                            onClick={handleCompleteRepair}
                            disabled={isSubmittingCompletion}
                            className="px-6 py-2.5 bg-black hover:bg-gray-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                            {isSubmittingCompletion ? <RefreshCw size={13} className="animate-spin" /> : <CheckCircle2 size={14} />}
                            Complete Repair & Request Payment
                        </button>
                    </div>
                </div>
            </div>

            {/* LIFECYCLE SECTION 4: PAYMENT & CUSTOMER REVIEW (If available) */}
            {order.payment?.status === 'PAID' && (
                <div className="bg-emerald-50/80 rounded-2xl p-6 border border-emerald-100 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                            <CheckCircle2 size={16} /> Service Paid & Closed
                        </span>
                        <span className="text-sm font-black text-emerald-900">
                            ₹{(order.finalAmount || order.payment.totalAmount || 0).toLocaleString()} (PAID)
                        </span>
                    </div>

                    {order.review?.rating && (
                        <div className="pt-2 border-t border-emerald-100 flex items-center justify-between">
                            <span className="text-xs font-semibold text-emerald-900">Customer Rating:</span>
                            <div className="flex items-center gap-1 text-amber-500">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star
                                        key={s}
                                        size={14}
                                        className={s <= order.review!.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
                                    />
                                ))}
                                <span className="text-xs font-bold text-gray-700 ml-1">({order.review.rating}/5)</span>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Fullscreen Image Preview Modal */}
            {activeImagePreview && (
                <div
                    className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-pointer"
                    onClick={() => setActiveImagePreview(null)}
                >
                    <div className="relative max-w-4xl max-h-[90vh]">
                        <img src={activeImagePreview} alt="Enlarged preview" className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl" />
                        <p className="text-center text-white/80 text-xs mt-2">Click anywhere to close</p>
                    </div>
                </div>
            )}
        </div>
    );
}
