import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    BadgeCheck,
    Check,
    ChevronLeft,
    Clock,
    MapPin,
    ShieldCheck,
    Sparkles,
    Star,
    Wrench,
    Zap,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppSelector } from '@/hooks/storeHook';
import { useGeolocation } from '@/hooks/useGeolocation';
import { Modal } from '@/shared/components/Modal';
import {
    categoryServices,
    type PublicProviderProfileData,
    type PublicProviderServiceItem,
} from '../services/categoryServices';

const WEEK_DAYS = [
    { code: 'M', label: 'M' },
    { code: 'T', label: 'T' },
    { code: 'W', label: 'W' },
    { code: 'T2', label: 'T' },
    { code: 'F', label: 'F' },
    { code: 'S', label: 'S' },
    { code: 'S2', label: 'S' },
];

const getInitials = (name?: string): string => {
    if (!name) return 'PR';
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join('');
};

const formatRelativeTime = (dateString?: string): string => {
    if (!dateString) return '';
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = Math.max(0, now.getTime() - past.getTime());
    const mins = Math.floor(diffMs / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);

    if (days > 30) {
        return past.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (mins > 0) return `${mins}m ago`;
    return 'Just now';
};

const getReviewHeadline = (rating: number, serviceTitle?: string): string => {
    if (serviceTitle) return serviceTitle;
    if (rating >= 5) return 'Perfect Experience';
    if (rating >= 4) return 'Good Service';
    if (rating >= 3) return 'Satisfactory Service';
    return 'Customer Feedback';
};

const formatAddressLine = (address?: { street?: string; city?: string; district?: string }): string => {
    if (!address) return 'Local Service Area';
    const parts = [address.street, address.city].filter(Boolean);
    if (parts.length > 0) return parts.join(', ');
    return address.district || 'Local Service Area';
};

export default function ProviderProfilePage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAppSelector((state) => state.auth);
    const geo = useGeolocation();

    const [profileData, setProfileData] = useState<PublicProviderProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showAllReviews, setShowAllReviews] = useState(false);
    const [selectedService, setSelectedService] = useState<PublicProviderServiceItem | null>(null);
    const [activeModalImageIndex, setActiveModalImageIndex] = useState(0);

    useEffect(() => {
        if (!id || geo.isLoading) return;

        let isMounted = true;

        Promise.resolve().then(() => {
            if (!isMounted) return;
            setLoading(true);
            setErrorMessage(null);
            setShowAllReviews(false);
            setSelectedService(null);

            const params =
                geo.latitude && geo.longitude
                    ? { lat: geo.latitude, lng: geo.longitude }
                    : undefined;

            categoryServices
                .fetchProviderProfile(id, params)
                .then((res) => {
                    if (!isMounted) return;
                    if (res.success && res.data) {
                        setProfileData(res.data);
                    } else {
                        setErrorMessage('Provider profile could not be loaded.');
                    }
                })
                .catch((err: unknown) => {
                    if (!isMounted) return;
                    const message =
                        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                        'Provider not found.';
                    setErrorMessage(message);
                })
                .finally(() => {
                    if (isMounted) setLoading(false);
                });
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });

        return () => {
            isMounted = false;
        };
    }, [id, geo.isLoading, geo.latitude, geo.longitude]);

    const handleMakeRequest = (serviceId?: string) => {
        if (!profileData?.provider?.id) return;

        if (!isAuthenticated) {
            toast.error('Please login to send a service request');
            navigate('/login');
            return;
        }

        if (user?.id && user.id === profileData.provider.userId) {
            toast.error('You cannot send a service request to your own business profile');
            return;
        }

        const query = new URLSearchParams({ providerId: profileData.provider.id });
        if (serviceId) {
            query.set('serviceId', serviceId);
        }
        navigate(`/service-requests/new?${query.toString()}`);
    };

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto px-6 py-12">
                <div className="animate-pulse space-y-8">
                    <div className="h-9 w-56 bg-gray-200 rounded-xl" />
                    <div className="h-44 bg-gray-100 rounded-3xl" />
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-8 space-y-6">
                            <div className="h-32 bg-gray-100 rounded-2xl" />
                            <div className="h-64 bg-gray-100 rounded-2xl" />
                        </div>
                        <div className="lg:col-span-4 space-y-6">
                            <div className="h-48 bg-blue-50 rounded-3xl" />
                            <div className="h-64 bg-amber-50 rounded-3xl" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (errorMessage || !profileData) {
        return (
            <div className="max-w-4xl mx-auto px-6 py-20 text-center">
                <div className="bg-[#F7F8F7] rounded-3xl p-12 border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Provider Unavailable</h2>
                    <p className="text-gray-500 text-sm mb-6">
                        {errorMessage || 'We could not find the provider you are looking for.'}
                    </p>
                    <button
                        type="button"
                        onClick={() => navigate('/services')}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
                    >
                        <ChevronLeft size={16} />
                        Back to Services
                    </button>
                </div>
            </div>
        );
    }

    const { provider, services, reviews, otherProviders } = profileData;
    const activeDays = provider.availability?.days || ['M', 'T', 'W', 'T2', 'F', 'S'];
    const startTime = provider.availability?.startTime || '9:00 am';
    const endTime = provider.availability?.endTime || '6:00 pm';
    const visibleReviews = showAllReviews ? reviews : reviews.slice(0, 2);
    const hasReviews = provider.totalReviews > 0;
    const displayRating = hasReviews ? provider.averageRating.toFixed(1) : 'New';
    const aboutText =
        provider.about?.trim() ||
        `At ${provider.businessName}, we are committed to providing reliable ${provider.categoryName.toLowerCase()} services in ${
            provider.location?.address?.city || 'your neighborhood'
        } with a focus on quality workmanship and customer satisfaction.${
            services.length > 0
                ? ` Our technicians specialize in ${services
                      .slice(0, 4)
                      .map((s) => s.name.toLowerCase())
                      .join(', ')}, and more.`
                : ''
        }`;

    return (
        <div className="max-w-6xl mx-auto px-6 py-8">
            {/* Page Heading */}
            <div className="flex items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                    Provider's Profile
                </h1>
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
                >
                    <ChevronLeft size={16} />
                    Back
                </button>
            </div>

            {/* Top Provider Summary Card */}
            <section className="bg-[#F7F8F7] rounded-[1.75rem] p-6 sm:p-8 flex flex-col md:flex-row md:items-stretch justify-between gap-6 border border-gray-100/80">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
                    {/* Avatar with Verified Badge */}
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0">
                        {provider.profilePhotoUrl ? (
                            <img
                                src={provider.profilePhotoUrl}
                                alt={provider.businessName}
                                className="w-full h-full rounded-full object-cover border-2 border-white shadow-sm"
                            />
                        ) : (
                            <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center text-2xl font-extrabold border-2 border-white shadow-sm">
                                {getInitials(provider.businessName)}
                            </div>
                        )}
                        <span
                            title="Verified Provider"
                            className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full bg-[#2563EB] text-white flex items-center justify-center ring-2 ring-white shadow-xs"
                        >
                            <BadgeCheck size={15} className="fill-[#2563EB] text-white" />
                        </span>
                    </div>

                    {/* Provider Name, Location & Metrics */}
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                            {provider.businessName}
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                            {formatAddressLine(provider.location?.address)}
                        </p>

                        <div className="flex flex-wrap items-center gap-6 sm:gap-10 mt-4">
                            <div>
                                <p className="text-[11px] font-medium text-gray-400">Rating</p>
                                <a
                                    href="#reviews"
                                    className="flex items-center gap-1.5 text-sm font-semibold text-gray-900 mt-0.5 hover:text-[#2563EB] transition-colors"
                                >
                                    <Star size={15} className="fill-emerald-500 text-emerald-500 shrink-0" />
                                    <span className="underline underline-offset-2">
                                        {hasReviews
                                            ? `${provider.averageRating.toFixed(1)} (${provider.totalReviews} ${
                                                  provider.totalReviews === 1 ? 'review' : 'reviews'
                                              })`
                                            : 'No reviews yet'}
                                    </span>
                                </a>
                            </div>

                            <div>
                                <p className="text-[11px] font-medium text-gray-400">Category</p>
                                <p className="text-sm font-semibold text-gray-900 mt-0.5">
                                    {provider.categoryName}
                                </p>
                            </div>

                            <div>
                                <p className="text-[11px] font-medium text-gray-400">Completed Jobs</p>
                                <p className="text-sm font-semibold text-gray-900 mt-0.5">
                                    {provider.completedJobs.toLocaleString('en-IN')}
                                    {provider.completedJobs > 0 ? '+' : ''}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Experience & Direct Make Request Button */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-4 shrink-0">
                    <span className="text-xs sm:text-sm font-semibold text-gray-700">
                        {provider.experience > 0 ? `${provider.experience}y Experience` : 'Verified Expert'}
                    </span>

                    <button
                        type="button"
                        onClick={() => handleMakeRequest()}
                        className="bg-[#2563EB] hover:bg-blue-700 active:scale-[0.99] text-white font-semibold px-7 py-2.5 rounded-xl text-sm shadow-xs transition-all cursor-pointer"
                    >
                        Make Request
                    </button>
                </div>
            </section>

            {/* Main Two-Column Content */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 items-start">
                {/* Left Column: About & Reviews */}
                <div className="lg:col-span-8 space-y-10">
                    {/* About Provider */}
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">About Provider</h3>
                        <p className="text-sm sm:text-[15px] text-gray-600 leading-relaxed">
                            {aboutText}
                        </p>
                    </div>

                    {/* Reviews & Ratings */}
                    <div id="reviews">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Reviews & Ratings</h3>

                        {/* Aggregate Rating Card */}
                        <div className="bg-[#F7F8F7] rounded-2xl p-6 text-center mb-6 border border-gray-100">
                            <div className="text-3xl font-extrabold text-gray-900">{displayRating}</div>
                            <div className="flex items-center justify-center gap-1.5 mt-2">
                                {[1, 2, 3, 4, 5].map((starIndex) => {
                                    const isFilled = hasReviews && starIndex <= Math.round(provider.averageRating);
                                    return (
                                        <Star
                                            key={starIndex}
                                            size={20}
                                            className={
                                                isFilled
                                                    ? 'fill-emerald-500 text-emerald-500'
                                                    : 'fill-gray-200 text-gray-200'
                                            }
                                        />
                                    );
                                })}
                            </div>
                            <p className="text-xs font-medium text-gray-600 mt-2">
                                {hasReviews
                                    ? `(based on ${provider.totalReviews} ${
                                          provider.totalReviews === 1 ? 'Review' : 'Reviews'
                                      })`
                                    : 'No customer reviews recorded yet'}
                            </p>
                        </div>

                        {/* Individual Customer Reviews */}
                        {reviews.length === 0 ? (
                            <div className="bg-gray-50 rounded-2xl p-6 text-center text-sm text-gray-500 border border-gray-100">
                                This provider has not received customer reviews yet. Send a request to experience their service!
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {visibleReviews.map((review) => (
                                    <div key={review.id} className="pb-5 border-b border-gray-100 last:border-b-0">
                                        <div className="flex items-center justify-between gap-4 mb-2.5">
                                            <div className="flex items-center gap-3">
                                                {review.customerPhotoUrl ? (
                                                    <img
                                                        src={review.customerPhotoUrl}
                                                        alt={review.customerName}
                                                        className="w-9 h-9 rounded-full object-cover border border-gray-200"
                                                    />
                                                ) : (
                                                    <div className="w-9 h-9 rounded-full bg-gray-200 text-gray-700 font-bold text-xs flex items-center justify-center">
                                                        {getInitials(review.customerName)}
                                                    </div>
                                                )}
                                                <span className="text-sm font-semibold text-gray-900">
                                                    {review.customerName}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-3 text-xs font-semibold text-gray-500">
                                                <span className="flex items-center gap-1 text-gray-800 font-bold">
                                                    <Star size={14} className="fill-emerald-500 text-emerald-500" />
                                                    {review.rating.toFixed(1)}
                                                </span>
                                                <span>{formatRelativeTime(review.reviewedAt)}</span>
                                            </div>
                                        </div>

                                        <h4 className="text-sm font-bold text-gray-900 mb-1">
                                            {getReviewHeadline(review.rating, review.serviceTitle)}
                                        </h4>
                                        {review.comment && (
                                            <p className="text-sm text-gray-600 leading-relaxed">
                                                {review.comment}
                                            </p>
                                        )}
                                    </div>
                                ))}

                                {reviews.length > 2 && (
                                    <button
                                        type="button"
                                        onClick={() => setShowAllReviews((prev) => !prev)}
                                        className="px-5 py-2 rounded-xl bg-[#EAF2FF] hover:bg-blue-100 text-[#2563EB] text-xs font-bold transition-colors cursor-pointer"
                                    >
                                        {showAllReviews ? 'Show fewer reviews' : 'See all reviews'}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Availability & Services Offered Cards */}
                <aside className="lg:col-span-4 space-y-6">
                    {/* Available Card */}
                    <div className="bg-gradient-to-br from-[#BFE7FF] via-[#E4F6FB] to-[#FEFFE8] rounded-[1.75rem] p-6 border border-sky-100/70">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Available</h3>

                        <div>
                            <p className="text-xs font-medium text-gray-600 mb-2.5">Days</p>
                            <div className="flex items-center gap-2 flex-wrap">
                                {WEEK_DAYS.map((day) => {
                                    const isOpen = activeDays.includes(day.code);
                                    return (
                                        <span
                                            key={day.code}
                                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                                                isOpen
                                                    ? 'bg-[#1C1C1C] text-white'
                                                    : 'bg-white/70 text-gray-400 border border-gray-200/80'
                                            }`}
                                        >
                                            {day.label}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="mt-5">
                            <p className="text-xs font-medium text-gray-600 mb-2">Time</p>
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="bg-[#1C1C1C] text-white text-xs font-semibold px-3 py-1.5 rounded-lg">
                                    {startTime}
                                </span>
                                <span className="text-[11px] font-bold text-gray-700">TO</span>
                                <span className="bg-[#1C1C1C] text-white text-xs font-semibold px-3 py-1.5 rounded-lg">
                                    {endTime}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Services Offered Card */}
                    <div className="bg-gradient-to-b from-[#FEFFE8] via-[#E4F6FB] to-[#BFE7FF] rounded-[1.75rem] p-6 border border-sky-100/70">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Services Offered</h3>

                        {services.length > 0 ? (
                            <ul className="space-y-2.5">
                                {services.slice(0, 6).map((service) => (
                                    <li
                                        key={service.id}
                                        className="flex items-center gap-2 text-sm font-semibold text-gray-800"
                                    >
                                        <Check size={15} className="text-gray-900 shrink-0" />
                                        <span className="line-clamp-1">{service.name}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                                <Check size={15} className="text-gray-900 shrink-0" />
                                <span>{provider.categoryName} Services</span>
                            </div>
                        )}

                        <div className="mt-6 pt-4 border-t border-black/5 space-y-3">
                            <div>
                                <p className="text-xs text-gray-500">Average Response Time</p>
                                <p className="text-sm font-bold text-gray-900 mt-0.5">
                                    {provider.avgResponseTime || '15 Min'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Service Radius</p>
                                <p className="text-sm font-bold text-gray-900 mt-0.5">
                                    {provider.serviceRadius} Km
                                </p>
                            </div>
                        </div>
                    </div>
                </aside>
            </section>

            {/* Services Catalog Section */}
            <section className="mt-12">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-2xl font-extrabold text-gray-900">Services</h3>
                    {services.length > 0 && (
                        <span className="text-xs font-semibold text-gray-500">
                            Click any service to view details or request directly
                        </span>
                    )}
                </div>

                {services.length === 0 ? (
                    <div className="bg-[#F7F8F7] rounded-2xl p-8 text-center border border-gray-100">
                        <p className="text-sm font-medium text-gray-600 mb-3">
                            This provider hasn't published individual service catalog items yet.
                        </p>
                        <button
                            type="button"
                            onClick={() => handleMakeRequest()}
                            className="px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                        >
                            Send a Custom Request
                        </button>
                    </div>
                ) : (
                    <div className="flex gap-5 overflow-x-auto pb-4 hide-scrollbar">
                        {services.map((service) => (
                            <div
                                key={service.id}
                                onClick={() => {
                                    setActiveModalImageIndex(0);
                                    setSelectedService(service);
                                }}
                                className="min-w-[225px] max-w-[240px] shrink-0 bg-[#F7F8F7] hover:bg-white rounded-2xl p-3.5 border border-gray-100 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                            >
                                <div>
                                    <div className="w-full h-36 bg-gray-200 rounded-xl overflow-hidden mb-3">
                                        {service.mediaUrls && service.mediaUrls.length > 0 ? (
                                            <img
                                                src={service.mediaUrls[0]}
                                                alt={service.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-slate-200 to-gray-300 flex items-center justify-center text-gray-500">
                                                <Wrench size={24} />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-1 text-xs font-bold text-gray-800">
                                        <Star size={12} className="fill-emerald-500 text-emerald-500" />
                                        <span>{hasReviews ? provider.averageRating.toFixed(1) : 'New'}</span>
                                    </div>

                                    <h4 className="text-sm font-bold text-gray-900 mt-1 line-clamp-1 group-hover:text-[#2563EB] transition-colors">
                                        {service.name}
                                    </h4>
                                </div>

                                <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-200/50">
                                    <span className="text-[11px] font-medium text-gray-500">
                                        Starting at
                                    </span>
                                    <span className="text-sm font-extrabold text-[#2563EB]">
                                        ₹{service.startingPrice.toLocaleString('en-IN')}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Other Providers Near You */}
            {otherProviders.length > 0 && (
                <section className="mt-12 mb-4">
                    <h3 className="text-2xl font-extrabold text-gray-900 mb-5">
                        Other Providers near you
                    </h3>

                    <div className="flex gap-5 overflow-x-auto pb-4 hide-scrollbar">
                        {otherProviders.map((other) => (
                            <div
                                key={other.id}
                                onClick={() => navigate(`/providers/${other.id}`)}
                                className="min-w-[280px] max-w-[310px] shrink-0 bg-[#F7F8F7] hover:bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-all cursor-pointer"
                            >
                                <div className="flex items-center gap-3.5">
                                    <div className="relative w-12 h-12 shrink-0">
                                        {other.profilePhotoUrl ? (
                                            <img
                                                src={other.profilePhotoUrl}
                                                alt={other.businessName}
                                                className="w-full h-full rounded-full object-cover border border-white shadow-xs"
                                            />
                                        ) : (
                                            <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-sm flex items-center justify-center border border-white shadow-xs">
                                                {getInitials(other.businessName)}
                                            </div>
                                        )}
                                        <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#2563EB] text-white flex items-center justify-center ring-2 ring-white">
                                            <BadgeCheck size={10} />
                                        </span>
                                    </div>

                                    <div className="min-w-0">
                                        <h4 className="text-base font-bold text-gray-900 truncate">
                                            {other.businessName}
                                        </h4>
                                        <p className="text-xs text-gray-500 truncate mt-0.5">
                                            {formatAddressLine(other.location?.address)}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-4 pt-3 border-t border-gray-200/70">
                                    <div>
                                        <p className="text-[11px] font-medium text-gray-400">Rating</p>
                                        <div className="flex items-center gap-1 text-xs font-semibold text-gray-900 mt-0.5">
                                            <Star size={12} className="fill-emerald-500 text-emerald-500 shrink-0" />
                                            <span className="underline underline-offset-2 truncate">
                                                {other.totalReviews > 0
                                                    ? `${other.totalReviews} reviews`
                                                    : 'New provider'}
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-[11px] font-medium text-gray-400">Category</p>
                                        <p className="text-xs font-semibold text-gray-900 mt-0.5 truncate">
                                            {other.categoryName}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Service Catalog Item Detail Modal */}
            <Modal
                isOpen={Boolean(selectedService)}
                onClose={() => setSelectedService(null)}
                title={selectedService?.name || 'Service Details'}
                maxWidth="max-w-xl"
            >
                {selectedService && (
                    <div className="space-y-5">
                        {/* Gallery */}
                        {selectedService.mediaUrls && selectedService.mediaUrls.length > 0 && (
                            <div className="space-y-2">
                                <div className="w-full h-56 rounded-2xl overflow-hidden bg-gray-100 border border-gray-100">
                                    <img
                                        src={
                                            selectedService.mediaUrls[activeModalImageIndex] ||
                                            selectedService.mediaUrls[0]
                                        }
                                        alt={selectedService.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {selectedService.mediaUrls.length > 1 && (
                                    <div className="flex gap-2 overflow-x-auto pb-1">
                                        {selectedService.mediaUrls.map((url, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => setActiveModalImageIndex(idx)}
                                                className={`w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 cursor-pointer ${
                                                    activeModalImageIndex === idx
                                                        ? 'border-[#2563EB]'
                                                        : 'border-transparent opacity-70 hover:opacity-100'
                                                }`}
                                            >
                                                <img src={url} alt="" className="w-full h-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Price & Category Row */}
                        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#F7F8F7] p-4 rounded-2xl">
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Starting Price</p>
                                <p className="text-2xl font-extrabold text-[#2563EB]">
                                    ₹{selectedService.startingPrice.toLocaleString('en-IN')}
                                    <span className="text-xs font-semibold text-gray-500 ml-1.5">
                                        ({selectedService.pricingType === 'HOURLY' ? 'Hourly' : 'Flat Fee'})
                                    </span>
                                </p>
                            </div>
                            {selectedService.categoryName && (
                                <span className="px-3 py-1 rounded-full bg-white border border-gray-200 text-xs font-semibold text-gray-700">
                                    {selectedService.categoryName}
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                Service Overview
                            </h4>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                {selectedService.description ||
                                    `Professional ${selectedService.name} provided by ${provider.businessName}.`}
                            </p>
                        </div>

                        {/* Capabilities */}
                        <div className="flex flex-wrap gap-2">
                            {selectedService.onSite && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                                    <MapPin size={13} /> On-Site Service
                                </span>
                            )}
                            {selectedService.acceptUrgent && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold">
                                    <Zap size={13} /> Urgent Jobs Accepted
                                </span>
                            )}
                            {selectedService.instantBooking && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                                    <Sparkles size={13} /> Fast Turnaround
                                </span>
                            )}
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
                                <Clock size={13} /> {selectedService.serviceRadius || provider.serviceRadius} km coverage
                            </span>
                        </div>

                        <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3 flex items-start gap-2.5 text-xs text-blue-900">
                            <ShieldCheck size={16} className="text-blue-600 shrink-0 mt-0.5" />
                            <span>
                                Requesting this service sends your request exclusively to{' '}
                                <strong>{provider.businessName}</strong> so they can send you a direct quote.
                            </span>
                        </div>

                        {/* Modal Actions */}
                        <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => setSelectedService(null)}
                                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
                            >
                                Close
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    const svcId = selectedService.id;
                                    setSelectedService(null);
                                    handleMakeRequest(svcId);
                                }}
                                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#2563EB] hover:bg-blue-700 transition-colors shadow-xs cursor-pointer"
                            >
                                Request This Service
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
