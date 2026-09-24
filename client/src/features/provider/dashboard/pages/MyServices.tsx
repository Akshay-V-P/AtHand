import { useState, useEffect } from 'react';
import { Plus, TrendingUp, Calendar, Filter, ChevronDown, Star, ChevronLeft, ChevronRight, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../../../hooks/storeHook';
import { providerServiceApi } from '../apis/providerServiceApi';
import toast from 'react-hot-toast';

export default function MyServices() {
    const [activeTab, setActiveTab] = useState('All Services');
    const tabs = ['All Services', 'Active', 'Drafts'];

    const providerId = useAppSelector((state) => state.provider.id);
    const [services, setServices] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10;

    useEffect(() => {
        const fetchServices = async () => {
            if (!providerId) return;
            setIsLoading(true);
            try {
                const response = await providerServiceApi.getProviderServices({
                    page,
                    limit,
                    providerId,
                });
                if (response.success && response.data) {
                    setServices(response.data.items || []);
                    setTotalPages(response.data.totalPages || 1);
                }
            } catch (error) {
                toast.error("Failed to fetch services");
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchServices();
    }, [providerId, page, activeTab]); // Re-fetch on page change or tab change (if implemented)

    const analytics = [
        {
            name: 'Precision iPhone Screen Repair',
            category: 'Pet Care',
            conversion: 72,
            views: '1,240',
            earnings: '₹12,450.00',
            status: 'TOP PERFORMER',
            statusColor: 'bg-emerald-100 text-emerald-700',
            barColor: 'bg-emerald-500',
        },
        {
            name: 'Desktop PC Deep Cleaning & Thermal Service',
            category: 'Home Care',
            conversion: 45,
            views: '890',
            earnings: '₹1,120.00',
            status: 'STABLE',
            statusColor: 'bg-indigo-100 text-indigo-700',
            barColor: 'bg-indigo-500',
        }
    ];

    return (
        <div className="max-w-7xl mx-auto p-8 bg-gray-50/30 min-h-screen">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Services</h1>
                    <p className="text-gray-500 text-sm">Manage your offerings, adjust availability, and track performance.</p>
                </div>
                <div className="mt-4 md:mt-0">
                    <Link to="/provider/dashboard/services/new" className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors shadow-sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Create New Service
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Active Services */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between">
                    <div>
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Active Services</h3>
                        <div className="text-4xl font-bold text-indigo-600">{services.filter(s => s.status === 'ACTIVE').length || 0}</div>
                    </div>
                    <div className="flex items-center text-xs font-medium text-emerald-600 mt-4">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Growing
                    </div>
                </div>

                {/* Total Bookings */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between">
                    <div>
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Total Bookings</h3>
                        <div className="text-4xl font-bold text-gray-900">--</div>
                    </div>
                    <div className="flex items-center text-xs font-medium text-emerald-600 mt-4">
                        <Calendar className="w-3 h-3 mr-1" />
                        Awaiting Analytics
                    </div>
                </div>

                {/* Monthly Revenue (Blue Box) */}
                <div className="bg-indigo-600 rounded-xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden text-white relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10 pointer-events-none"></div>
                    <div className="absolute bottom-0 right-10 w-24 h-24 bg-white opacity-5 rounded-lg rotate-12 pointer-events-none"></div>

                    <div className="relative z-10">
                        <h3 className="text-xs font-semibold text-indigo-100 uppercase tracking-wider mb-2">Monthly Revenue</h3>
                        <div className="text-4xl font-bold mb-4">₹--</div>
                        <p className="text-xs text-indigo-100 w-3/4">Keep updating your services to increase reach.</p>
                    </div>
                    <div className="mt-4 relative z-10 flex justify-end">
                        <button className="px-4 py-1.5 text-sm font-medium text-indigo-600 bg-white rounded-md shadow-sm hover:bg-gray-50 transition-colors">
                            View Payouts
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabs and Filters */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                {/* Tabs */}
                <div className="flex bg-indigo-50/50 p-1 rounded-md border border-gray-100">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === tab
                                ? 'bg-white text-indigo-600 shadow-sm border border-gray-200'
                                : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Filters */}
                <div className="flex gap-3">
                    <button className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 shadow-sm">
                        <Filter className="w-4 h-4 mr-2 text-gray-500" />
                        Categories
                        <ChevronDown className="w-4 h-4 ml-2 text-gray-500" />
                    </button>
                </div>
            </div>

            {/* Services Grid */}
            {isLoading ? (
                <div className="flex justify-center items-center py-20 text-gray-500">
                    Loading your services...
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {services.map((service) => (
                        <div key={service.id || service._id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex flex-col">
                            <div className="relative mb-4 h-40 bg-gray-600 rounded-lg overflow-hidden shrink-0">
                                <div className="absolute top-3 left-3 bg-white text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                                    Service
                                </div>
                            </div>

                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-lg text-gray-900 leading-tight w-2/3">{service.name}</h3>
                                <div className="flex items-center">
                                    <span className="text-xs font-semibold mr-2">{service.status === 'ACTIVE' ? 'Active' : 'Draft'}</span>
                                    <div className={`w-9 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors ${service.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                                        <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-300 ${service.status === 'ACTIVE' ? 'translate-x-4' : ''}`}></div>
                                    </div>
                                    <Link to={`/provider/dashboard/services/edit/${service.id || service._id}`} className="ml-3 text-gray-400 hover:text-indigo-600 transition-colors">
                                        <Edit className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>

                            <p className="text-sm text-gray-500 mb-6 flex-grow line-clamp-3">
                                {service.description || "No description provided."}
                            </p>

                            <div className="flex justify-between items-end border-t border-gray-100 pt-4 mt-auto">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                                        Price ({service.pricingType || "FLAT_FEE"})
                                    </span>
                                    <span className="text-indigo-600 font-bold text-lg">₹{service.startingPrice || 0}</span>
                                </div>

                                <div className="flex flex-col items-center">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Rating</span>
                                    <div className="flex items-center font-bold text-sm text-gray-900">
                                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 mr-1" />
                                        N/A
                                    </div>
                                </div>

                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Bookings</span>
                                    <span className="font-bold text-lg text-gray-900">0</span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Add Another Service Card */}
                    <Link to="/provider/dashboard/services/new" className="block rounded-xl border-2 border-dashed border-gray-300 bg-gray-50/50 p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer w-full h-full min-h-[350px]">
                        <button className="w-12 h-12 rounded-full border border-indigo-200 bg-white flex items-center justify-center mb-4 text-indigo-600 shadow-sm hover:shadow transition-shadow">
                            <Plus className="w-6 h-6" />
                        </button>
                        <h3 className="text-lg font-bold text-gray-700 mb-2">Add Another Service</h3>
                        <p className="text-sm text-gray-500 px-4">Expand your business by offering new skills to your client base.</p>
                    </Link>
                </div>
            )}

            {/* Pagination Controls */}
            {!isLoading && totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mb-8">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="p-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <span className="text-sm font-medium text-gray-700">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
                        disabled={page === totalPages}
                        className="p-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            )}

            {/* Service Analytics section */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Service Analytics (Mock Data)</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white border-b border-gray-200">
                                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Service Name</th>
                                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Conversion</th>
                                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Views</th>
                                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Earnings (MTD)</th>
                                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {analytics.map((item, idx) => (
                                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="font-medium text-gray-900 text-sm mb-0.5">{item.name}</div>
                                        <div className="text-xs text-gray-500">{item.category}</div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                <div className={`h-full ${item.barColor}`} style={{ width: `${item.conversion}%` }}></div>
                                            </div>
                                            <span className="text-xs text-gray-600 font-medium">{item.conversion}%</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-sm text-gray-700 font-medium">{item.views}</td>
                                    <td className="py-4 px-6 text-sm text-gray-900 font-medium">{item.earnings}</td>
                                    <td className="py-4 px-6">
                                        <span className={`inline-flex px-2 py-1 text-[10px] font-bold rounded uppercase tracking-wider ${item.statusColor}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
