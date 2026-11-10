import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderApi } from '@/features/orders/api/orderApi';
import type { Order, OrderStatus, WorkStage } from '@/features/orders/dtos/OrderDTOs';
import { useAppSelector } from '@/hooks/storeHook';
import {
    Wrench,
    MapPin,
    Calendar,
    Search,
    ChevronRight,
    RefreshCw,
    User,
    AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ActiveRepairs() {
    const navigate = useNavigate();
    const providerId = useAppSelector(state => state.provider?.id || state.auth?.user?.id);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await orderApi.getProviderOrders(providerId || undefined);
            if (res.data.success && res.data.data) {
                setOrders(res.data.data.items || []);
            }
        } catch (error: any) {
            console.error('Failed to load orders', error);
            toast.error(error.response?.data?.message || 'Failed to fetch provider orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [providerId]);

    const getStatusBadge = (status: OrderStatus | string) => {
        const map: Record<string, { label: string; bg: string; text: string }> = {
            REQUESTED: { label: 'Requested', bg: 'bg-gray-100', text: 'text-gray-700' },
            ACCEPTED: { label: 'Accepted', bg: 'bg-blue-100', text: 'text-blue-800' },
            SCHEDULED: { label: 'Scheduled', bg: 'bg-blue-100', text: 'text-blue-800' },
            DIAGNOSIS_IN_PROGRESS: { label: 'Diagnosing', bg: 'bg-amber-100', text: 'text-amber-800' },
            ESTIMATE_PENDING_APPROVAL: { label: 'Estimate Sent', bg: 'bg-purple-100', text: 'text-purple-800' },
            REPAIR_IN_PROGRESS: { label: 'Repairing', bg: 'bg-cyan-100', text: 'text-cyan-800' },
            WAITING_FOR_PAYMENT: { label: 'Waiting for Payment', bg: 'bg-orange-100', text: 'text-orange-800' },
            IN_PROGRESS: { label: 'In Progress', bg: 'bg-cyan-100', text: 'text-cyan-800' },
            AWAITING_CUSTOMER: { label: 'Awaiting Customer', bg: 'bg-purple-100', text: 'text-purple-800' },
            COMPLETED: { label: 'Completed', bg: 'bg-emerald-100', text: 'text-emerald-800' },
            CLOSED_WITHOUT_REPAIR: { label: 'Declined by User', bg: 'bg-rose-100', text: 'text-rose-800' },
            CANCELLED: { label: 'Cancelled', bg: 'bg-rose-100', text: 'text-rose-800' },
            // Fallbacks for backwards compatibility
            pending: { label: 'Pending Acceptance', bg: 'bg-gray-100', text: 'text-gray-700' },
            scheduled: { label: 'Scheduled', bg: 'bg-blue-100', text: 'text-blue-800' },
            repair_in_progress: { label: 'In Progress', bg: 'bg-cyan-100', text: 'text-cyan-800' },
            estimate_pending_approval: { label: 'Estimate Sent', bg: 'bg-purple-100', text: 'text-purple-800' },
            waiting_for_payment: { label: 'Waiting for Payment', bg: 'bg-orange-100', text: 'text-orange-800' },
            completed: { label: 'Completed', bg: 'bg-emerald-100', text: 'text-emerald-800' },
            closed_without_repair: { label: 'Declined', bg: 'bg-rose-100', text: 'text-rose-800' },
            cancelled: { label: 'Cancelled', bg: 'bg-rose-100', text: 'text-rose-800' },
        };
        const config = map[status] || { label: String(status).replace(/_/g, ' '), bg: 'bg-gray-100', text: 'text-gray-700' };
        return (
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${config.bg} ${config.text}`}>
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

    const filterTabs: { id: string; label: string }[] = [
        { id: 'all', label: 'All' },
        { id: 'ACCEPTED', label: 'Accepted / Scheduled' },
        { id: 'DIAGNOSIS_IN_PROGRESS', label: 'Diagnosing' },
        { id: 'ESTIMATE_PENDING_APPROVAL', label: 'Estimate Approval' },
        { id: 'REPAIR_IN_PROGRESS', label: 'Repairing' },
        { id: 'WAITING_FOR_PAYMENT', label: 'Payment Due' },
        { id: 'COMPLETED', label: 'Completed' },
    ];

    const filteredOrders = orders.filter((order) => {
        // Status filter
        if (statusFilter !== 'all') {
            const matchesDirect = order.status === statusFilter;
            const matchesLegacy =
                (statusFilter === 'ACCEPTED' && ((order.status as any) === 'scheduled' || order.status === 'SCHEDULED' || order.status === 'ACCEPTED' || (order.status as any) === 'pending')) ||
                (statusFilter === 'DIAGNOSIS_IN_PROGRESS' && (order.status === 'DIAGNOSIS_IN_PROGRESS' || (order.status as any) === 'diagnosis_in_progress')) ||
                (statusFilter === 'ESTIMATE_PENDING_APPROVAL' && (order.status === 'ESTIMATE_PENDING_APPROVAL' || order.status === 'AWAITING_CUSTOMER' || (order.status as any) === 'estimate_pending_approval')) ||
                (statusFilter === 'REPAIR_IN_PROGRESS' && (order.status === 'REPAIR_IN_PROGRESS' || order.status === 'IN_PROGRESS' || (order.status as any) === 'repair_in_progress')) ||
                (statusFilter === 'WAITING_FOR_PAYMENT' && (order.status === 'WAITING_FOR_PAYMENT' || (order.status as any) === 'waiting_for_payment')) ||
                (statusFilter === 'COMPLETED' && (order.status === 'COMPLETED' || (order.status as any) === 'completed'));
            if (!matchesDirect && !matchesLegacy) return false;
        }

        // Search query
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            const orderNum = (order.orderNumber || '').toLowerCase();
            const customerName = (order.customerId?.name || '').toLowerCase();
            const reqTitle = ((order.requestId as any)?.title || '').toLowerCase();
            const product = `${(order.requestId as any)?.productBrand || ''} ${(order.requestId as any)?.productModel || ''}`.toLowerCase();
            const serviceMode = (order.serviceMode || '').toLowerCase();
            const workStage = (order.workStage || '').toLowerCase();
            return orderNum.includes(q) || customerName.includes(q) || reqTitle.includes(q) || product.includes(q) || serviceMode.includes(q) || workStage.includes(q);
        }

        return true;
    });

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2.5">
                        <Wrench className="text-blue-600" size={26} />
                        Active Repairs & Service Orders
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        View customer service requests, record diagnosis, send updated estimates, and complete repairs.
                    </p>
                </div>

                <button
                    onClick={fetchOrders}
                    disabled={loading}
                    className="p-2.5 bg-white border border-gray-200 text-gray-600 hover:text-black rounded-xl shadow-2xs hover:bg-gray-50 transition-all flex items-center gap-2 text-xs font-semibold self-start sm:self-auto cursor-pointer"
                >
                    <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            {/* Filter Tabs & Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-gray-100/80 p-1.5 rounded-2xl border border-gray-200/60">
                    {filterTabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setStatusFilter(tab.id)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                                statusFilter === tab.id
                                    ? 'bg-white text-gray-900 shadow-xs'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="relative min-w-[260px]">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search order #, customer, device..."
                        className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-100"
                    />
                </div>
            </div>

            {/* Orders Feed */}
            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="w-9 h-9 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : filteredOrders.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200/80 p-12 text-center space-y-3">
                    <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto">
                        <Wrench size={22} />
                    </div>
                    <h3 className="text-base font-bold text-gray-800">No repair orders found</h3>
                    <p className="text-xs text-gray-500 max-w-sm mx-auto">
                        {statusFilter === 'all'
                            ? 'Accepted quotes and customer bookings will appear here.'
                            : `There are currently no orders in the "${filterTabs.find(t => t.id === statusFilter)?.label || statusFilter}" state.`}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredOrders.map((order) => {
                        const orderId = order.id || order._id;
                        const customer = order.customerId;
                        const requestData = typeof order.requestId === 'object' ? order.requestId : null;
                        const totalAmount = order.finalAmount || order.repairEstimate?.totalAmount || order.initialQuoteAmount || 0;

                        return (
                            <div
                                key={orderId}
                                className="bg-white rounded-2xl p-5 border border-gray-200/80 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                            >
                                {/* Top Header */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            <span className="text-xs font-black tracking-wider text-gray-900 bg-gray-100 px-2.5 py-1 rounded-lg">
                                                #{order.orderNumber}
                                            </span>
                                            {getWorkStageBadge(order.workStage)}
                                        </div>
                                        {getStatusBadge(order.status)}
                                    </div>

                                    {/* Service Request Title & Device */}
                                    <div>
                                        <h3 className="text-base font-bold text-gray-900 line-clamp-1">
                                            {requestData?.title || 'Repair Service'}
                                        </h3>
                                        {requestData?.productBrand && (
                                            <p className="text-xs font-semibold text-blue-600 mt-0.5">
                                                {requestData.productBrand} {requestData.productModel || ''}
                                            </p>
                                        )}
                                        {requestData?.description && (
                                            <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                                                {requestData.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Customer & Location */}
                                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
                                        <span className="font-semibold text-gray-800 flex items-center gap-1">
                                            <User size={13} className="text-gray-400" />
                                            {customer?.name || 'Customer'}
                                        </span>
                                        <span className="flex items-center gap-1 text-gray-500">
                                            <MapPin size={12} className="text-gray-400" />
                                            {order.appointment?.serviceAddress?.city || 'Local Address'}
                                        </span>
                                    </div>
                                </div>

                                {/* Service Mode & Commercials */}
                                <div className="bg-gray-50/80 rounded-xl p-3 border border-gray-100 space-y-2 text-xs">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500">Service Mode:</span>
                                        <span className="font-semibold text-gray-800">
                                            {order.serviceMode === 'WORKSHOP'
                                                ? 'Workshop Drop-off'
                                                : order.serviceMode === 'COLLECTION_AND_RETURN'
                                                ? 'Pick & Drop'
                                                : 'On-Site Visit'}
                                        </span>
                                    </div>

                                    {order.appointment?.scheduledDate && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-500">Schedule:</span>
                                            <span className="font-semibold text-gray-800 flex items-center gap-1">
                                                <Calendar size={12} className="text-blue-600" />
                                                {new Date(order.appointment.scheduledDate).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                                {order.appointment.timeSlot && ` (${order.appointment.timeSlot})`}
                                            </span>
                                        </div>
                                    )}

                                    {/* Diagnosis / Problem Status */}
                                    {order.diagnosis?.completedAt && (
                                        <div className="flex justify-between items-center text-amber-700">
                                            <span className="flex items-center gap-1">
                                                <AlertCircle size={12} /> Diagnosis:
                                            </span>
                                            <span className="font-medium truncate max-w-[160px]">
                                                {order.diagnosis.identifiedIssues?.length
                                                    ? `${order.diagnosis.identifiedIssues.length} issues identified`
                                                    : 'Completed'}
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center pt-1 border-t border-gray-200">
                                        <span className="font-semibold text-gray-700">
                                            {order.isAmountRevised ? 'Revised Total:' : 'Quote Amount:'}
                                        </span>
                                        <span className="font-black text-blue-700 text-sm">₹{totalAmount.toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* Manage Button */}
                                <button
                                    onClick={() => navigate(`/provider/dashboard/repairs/${orderId}`)}
                                    className="w-full bg-gray-900 hover:bg-black text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                    <span>Manage Repair & Update Job</span>
                                    <ChevronRight size={14} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
