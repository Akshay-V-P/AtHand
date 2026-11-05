import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderApi } from '@/features/orders/api/orderApi';
import type { Order } from '@/features/orders/dtos/OrderDTOs';
import { useAppSelector } from '../../../../hooks/storeHook';
import {
    Wrench,
    MapPin,
    Calendar,
    Search,
    ChevronRight,
    RefreshCw
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
            const res = await orderApi.getProviderOrders(providerId);
           
            if (res.data.success && res.data.data) {
                setOrders(res.data.data.items);
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

    const getStatusBadge = (status: string) => {
        const map: Record<string, { label: string; bg: string; text: string }> = {
            pending: { label: 'Pending Acceptance', bg: 'bg-gray-100', text: 'text-gray-700' },
            scheduled: { label: 'Scheduled', bg: 'bg-blue-100', text: 'text-blue-800' },
            device_received: { label: 'Device Received', bg: 'bg-indigo-100', text: 'text-indigo-800' },
            diagnosis_in_progress: { label: 'Diagnosing', bg: 'bg-amber-100', text: 'text-amber-800' },
            estimate_pending_approval: { label: 'Bill Approval Pending', bg: 'bg-purple-100', text: 'text-purple-800' },
            estimate_rejected: { label: 'Bill Declined', bg: 'bg-red-100', text: 'text-red-800' },
            repair_in_progress: { label: 'Repair in Progress', bg: 'bg-cyan-100', text: 'text-cyan-800' },
            waiting_for_payment: { label: 'Waiting for Payment', bg: 'bg-orange-100', text: 'text-orange-800' },
            completed: { label: 'Completed & Paid', bg: 'bg-emerald-100', text: 'text-emerald-800' },
            closed_without_repair: { label: 'Closed (No Repair)', bg: 'bg-slate-100', text: 'text-slate-700' },
            cancelled: { label: 'Cancelled', bg: 'bg-rose-100', text: 'text-rose-800' },
        };
        const config = map[status] || { label: status, bg: 'bg-gray-100', text: 'text-gray-700' };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${config.bg} ${config.text}`}>
                {config.label}
            </span>
        );
    };

    const filteredOrders = orders.filter((order) => {
        // Status filter
        if (statusFilter === 'scheduled' && !['scheduled', 'device_received'].includes(order.status)) return false;
        if (statusFilter === 'diagnosis' && !['diagnosis_in_progress', 'estimate_pending_approval'].includes(order.status)) return false;
        if (statusFilter === 'repair' && order.status !== 'repair_in_progress') return false;
        if (statusFilter === 'payment' && order.status !== 'waiting_for_payment') return false;
        if (statusFilter === 'completed' && !['completed', 'closed_without_repair'].includes(order.status)) return false;

        // Search query
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            const orderNum = (order.orderNumber || '').toLowerCase();
            const customerName = (order.customerId?.name || '').toLowerCase();
            const serviceMode = (order.serviceMode || '').toLowerCase();
            return orderNum.includes(q) || customerName.includes(q) || serviceMode.includes(q);
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
                        Manage diagnosis, submit itemized bills, upload proof photos, and track service closures.
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
                    {[
                        { id: 'all', label: 'All' },
                        { id: 'scheduled', label: 'Scheduled' },
                        { id: 'diagnosis', label: 'Diagnosis & Bills' },
                        { id: 'repair', label: 'In Repair' },
                        { id: 'payment', label: 'Payment Due' },
                        { id: 'completed', label: 'Completed' },
                    ].map(tab => (
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
                        placeholder="Search by order #, customer..."
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
                            : `There are currently no orders in the "${statusFilter}" state.`}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredOrders.map((order) => {
                        const orderId = order.id || order._id;
                        const customer = order.customerId;
                        const totalAmount = order.finalAmount || order.repairEstimate?.totalAmount || order.initialQuoteAmount || 0;

                        return (
                            <div
                                key={orderId}
                                className="bg-white rounded-2xl p-5 border border-gray-200/80 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                            >
                                {/* Top Header */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-xs font-black tracking-wider text-gray-900 bg-gray-100 px-2.5 py-1 rounded-lg">
                                            #{order.orderNumber}
                                        </span>
                                        {getStatusBadge(order.status)}
                                    </div>

                                    <div>
                                        <h3 className="text-base font-bold text-gray-900">
                                            {customer?.name || 'Customer'}
                                        </h3>
                                        <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                                            <MapPin size={12} className="text-gray-400" />
                                            {order.appointment?.serviceAddress?.city || 'Customer Location'}
                                        </p>
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
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center pt-1 border-t border-gray-200">
                                        <span className="font-semibold text-gray-700">Total Amount:</span>
                                        <span className="font-black text-blue-700 text-sm">₹{totalAmount.toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* Manage Button */}
                                <button
                                    onClick={() => navigate(`/provider/dashboard/repairs/${orderId}`)}
                                    className="w-full bg-gray-900 hover:bg-black text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                    <span>Manage Repair</span>
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
