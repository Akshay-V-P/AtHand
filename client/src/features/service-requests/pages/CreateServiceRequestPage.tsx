import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { serviceRequestApi } from '../api/serviceRequestApi';
import toast from 'react-hot-toast';
import { api } from '@/services/axios';
import type { ServiceRequestUrgency } from '../dtos/ServiceRequestDTOs';
import { BadgeCheck, Camera, Lock, MapPin, Star } from 'lucide-react';
import { uploadFileToS3 } from '@/services/imageService';
import LocationPicker from "@/shared/components/location/LocationPicker";
import { getUserLocation, reverseGeocode } from "@/shared/services/locationService";
import { accountServices } from '@/features/customer/account/services/accountServices';
import {
    categoryServices,
    type PublicProviderInfo,
    type PublicProviderServiceItem,
} from '@/features/categories/services/categoryServices';

const CreateServiceRequestPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const directProviderId = searchParams.get('providerId') || '';
    const preselectedServiceId = searchParams.get('serviceId') || '';

    const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);
    const [userAddresses, setUserAddresses] = useState<any[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Direct-to-provider state
    const [targetProvider, setTargetProvider] = useState<PublicProviderInfo | null>(null);
    const [providerServices, setProviderServices] = useState<PublicProviderServiceItem[]>([]);
    const [selectedProviderServiceId, setSelectedProviderServiceId] = useState<string>(preselectedServiceId);
    const [loadingTargetProvider, setLoadingTargetProvider] = useState<boolean>(false);

    // Form state
    const [categoryId, setCategoryId] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [urgency, setUrgency] = useState<ServiceRequestUrgency>("NORMAL");
    const [serviceMode, setServiceMode] = useState<'ONSITE' | 'WORKSHOP' | 'COLLECTION_AND_RETURN'>('ONSITE');
    const [productBrand, setProductBrand] = useState('');
    const [productModel, setProductModel] = useState('');
    const [serviceType, setServiceType] = useState('Others');
    const [preferredDate, setPreferredDate] = useState<string>('');

    // Address & Map State
    const [selectedAddressId, setSelectedAddressId] = useState<string>('custom');
    const [customAddress, setCustomAddress] = useState<any>({
        houseName: 'Mapped Location',
        area: '',
        city: '',
        state: '',
        pincode: ''
    });
    const [latitude, setLatitude] = useState<number>(9.9312);
    const [longitude, setLongitude] = useState<number>(76.2673);

    // Media 
    const [mediaFiles, setMediaFiles] = useState<File[]>([]);
    const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get('/category/active/dropdown');
                if (res.data?.data) {
                    setCategories(res.data.data);
                }
            } catch (error) {
                console.error("Failed to load categories", error);
            }
        };

        const fetchAddresses = async () => {
            try {
                const data = await accountServices.getAddresses();
                if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
                    setUserAddresses(data.data);
                    // Select first address by default
                    const first = data.data[0];
                    setSelectedAddressId(first.id || first._id);
                    if (first.coordinates?.coordinates) {
                        setLatitude(first.coordinates.coordinates[1] || 9.9312);
                        setLongitude(first.coordinates.coordinates[0] || 76.2673);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch address", error);
            }
        };

        fetchCategories();
        fetchAddresses();
    }, []);

    useEffect(() => {
        let active = true;

        Promise.resolve().then(() => {
            if (!active) return;
            if (!directProviderId) {
                setTargetProvider(null);
                setProviderServices([]);
                setSelectedProviderServiceId('');
                return;
            }

            setLoadingTargetProvider(true);
            categoryServices
                .fetchProviderProfile(directProviderId)
                .then((res) => {
                    if (!active || !res.success || !res.data) return;
                    const { provider, services } = res.data;
                    setTargetProvider(provider);
                    setProviderServices(services || []);

                    const matched = preselectedServiceId
                        ? (services || []).find((s) => s.id === preselectedServiceId)
                        : undefined;

                    if (matched) {
                        setSelectedProviderServiceId(matched.id);
                        setCategoryId(matched.categoryId || provider.serviceCategory || '');
                        setServiceMode(matched.onSite ? 'ONSITE' : 'WORKSHOP');
                    } else {
                        setSelectedProviderServiceId('');
                        if (provider.serviceCategory) {
                            setCategoryId(provider.serviceCategory);
                        }
                    }
                })
                .catch((err) => {
                    if (!active) return;
                    console.error('Failed to load target provider:', err);
                    toast.error('Could not load selected provider details');
                })
                .finally(() => {
                    if (active) setLoadingTargetProvider(false);
                });
        });

        return () => {
            active = false;
        };
    }, [directProviderId, preselectedServiceId]);

    const handleDirectServiceSelect = (svcId: string) => {
        setSelectedProviderServiceId(svcId);
        if (!svcId) {
            if (targetProvider?.serviceCategory) {
                setCategoryId(targetProvider.serviceCategory);
            }
            return;
        }
        const svc = providerServices.find((s) => s.id === svcId);
        if (svc) {
            if (svc.categoryId) setCategoryId(svc.categoryId);
            setServiceMode(svc.onSite ? 'ONSITE' : 'WORKSHOP');
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const filesArray = Array.from(e.target.files);
            setMediaFiles(prev => [...prev, ...filesArray]);

            const previews = filesArray.map(file => URL.createObjectURL(file));
            setMediaPreviews(prev => [...prev, ...previews]);
        }
    };

    const fetchCurrentLocation = async () => {
        try {
            toast.loading("Fetching location...", { id: 'loc' });
            const position = await getUserLocation();
            if (position) {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                setLatitude(lat);
                setLongitude(lon);

                const payload = await reverseGeocode(lat, lon);
                setCustomAddress({
                    houseName: 'Current Location',
                    area: payload.address.street || payload.address.city,
                    city: payload.address.city,
                    state: payload.address.state,
                    pincode: payload.address.pincode
                });
                setSelectedAddressId('custom');
                toast.success("Location updated", { id: 'loc' });
            }
        } catch (error: any) {
            console.error(error.message);
            toast.error(error.message || "Failed to fetch location", { id: 'loc' });
        }
    };

    const handleMapSelect = async (lat: number, lon: number) => {
        setLatitude(lat);
        setLongitude(lon);
        try {
            const payload = await reverseGeocode(lat, lon);
            setCustomAddress({
                houseName: 'Pinned Location',
                area: payload.address.street || payload.address.city,
                city: payload.address.city,
                state: payload.address.state,
                pincode: payload.address.pincode
            });
            setSelectedAddressId('custom');
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddressDropdownChange = (val: string) => {
        setSelectedAddressId(val);
        if (val !== 'custom') {
            const addr = userAddresses.find(a => (a.id || a._id) === val);
            if (addr && addr.coordinates?.coordinates) {
                setLatitude(addr.coordinates.coordinates[1]);
                setLongitude(addr.coordinates.coordinates[0]);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !description.trim()) {
            toast.error("Please fill title and description fields");
            return;
        }

        try {
            setIsSubmitting(true);
            toast.loading("Creating request...", { id: "create-req" });

            const uploadedKeys: string[] = [];
            for (const file of mediaFiles) {
                try {
                    const key = await uploadFileToS3(file, "/auth/profile-upload-url");
                    uploadedKeys.push(key);
                } catch (err) {
                    console.log("Failed to upload a file:", err);
                }
            }

            let finalAddressDetails = customAddress;
            if (selectedAddressId !== 'custom') {
                const addr = userAddresses.find(a => (a.id || a._id) === selectedAddressId);
                if (addr) {
                    finalAddressDetails = {
                        houseName: addr.houseName,
                        area: addr.area,
                        city: addr.city,
                        state: addr.state,
                        pincode: addr.pincode
                    };
                }
            }

            const payload = {
                categoryId: categoryId || targetProvider?.serviceCategory || (categories.length > 0 ? categories[0].id : ''),
                ...(directProviderId ? { providerId: directProviderId } : {}),
                ...(directProviderId && selectedProviderServiceId ? { providerServiceId: selectedProviderServiceId } : {}),
                title,
                description,
                urgency,
                onSite: serviceMode === 'ONSITE',
                serviceMode: serviceMode,
                media: uploadedKeys,
                productBrand: productBrand || 'Generic',
                productModel: productModel || 'Standard',
                ...(preferredDate ? { preferredDate } : {}),
                address: {
                    ...finalAddressDetails,
                    coordinates: {
                        type: "Point" as const,
                        coordinates: [longitude, latitude]
                    }
                }
            };

            const response = await serviceRequestApi.createRequest(payload);
            if (response.data.success) {
                const createdId = response.data?.data?.id;
                toast.success(
                    directProviderId && targetProvider
                        ? `Direct request sent to ${targetProvider.businessName}!`
                        : 'Service Request created successfully!',
                    { id: "create-req" }
                );
                navigate(createdId ? `/service-requests/${createdId}` : '/service-requests');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message || 'Failed to create request', { id: "create-req" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClasses = "w-full bg-white border-0 rounded-2xl px-4 py-3.5 text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 shadow-sm transition-all";
    const labelClasses = "block text-xs font-semibold text-gray-500 mb-2 ml-1";

    return (
        <div className="flex-1 bg-gradient-to-br from-[#d4f0ff] via-[#e4f6fb] to-[#fcfceb] rounded-[2.5rem] p-6 md:p-10 shadow-sm min-h-screen">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 ml-2">
                <h1 className="text-3xl font-[800] text-gray-900 tracking-tight">
                    {directProviderId ? 'Make Direct Service Request' : 'Create Quote'}
                </h1>
                {directProviderId && (
                    <button
                        type="button"
                        onClick={() => navigate('/service-requests/new')}
                        className="text-xs font-semibold text-gray-600 hover:text-gray-900 bg-white/80 hover:bg-white px-4 py-2 rounded-xl border border-white shadow-2xs transition-colors cursor-pointer"
                    >
                        Switch to open request (all nearby providers)
                    </button>
                )}
            </div>

            {directProviderId && (
                <div className="bg-white/85 backdrop-blur-md rounded-2xl p-4 sm:p-5 mb-6 border border-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {loadingTargetProvider ? (
                        <div className="text-xs font-medium text-gray-500">Loading provider details...</div>
                    ) : targetProvider ? (
                        <>
                            <div className="flex items-center gap-4">
                                <div className="relative w-12 h-12 shrink-0">
                                    {targetProvider.profilePhotoUrl ? (
                                        <img
                                            src={targetProvider.profilePhotoUrl}
                                            alt={targetProvider.businessName}
                                            className="w-full h-full rounded-full object-cover border border-white shadow-xs"
                                        />
                                    ) : (
                                        <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-sm flex items-center justify-center">
                                            {targetProvider.businessName.slice(0, 2).toUpperCase()}
                                        </div>
                                    )}
                                    <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#2563EB] text-white flex items-center justify-center ring-2 ring-white">
                                        <BadgeCheck size={10} />
                                    </span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h2 className="text-base font-bold text-gray-900">
                                            {targetProvider.businessName}
                                        </h2>
                                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                                            <Lock size={10} /> Exclusive Direct Request
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-1">
                                        <span className="flex items-center gap-1">
                                            <MapPin size={12} className="text-gray-400" />
                                            {targetProvider.location?.address?.city || 'Local Provider'}
                                        </span>
                                        <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                                            <Star size={12} className="fill-emerald-500 text-emerald-500" />
                                            {targetProvider.totalReviews > 0
                                                ? `${targetProvider.averageRating.toFixed(1)} (${targetProvider.totalReviews})`
                                                : 'New'}
                                        </span>
                                        <span>{targetProvider.categoryName}</span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-xs text-gray-600 max-w-xs leading-relaxed">
                                Only <strong>{targetProvider.businessName}</strong> will receive this request and send you a quote.
                            </p>
                        </>
                    ) : null}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white/40 backdrop-blur-md rounded-[2rem] p-8 md:p-10 shadow-sm border border-white/60">
                <div className="grid md:grid-cols-2 gap-10">

                    {/* Left Column */}
                    <div className="space-y-6">

                        <div>
                            <label className={labelClasses}>Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder={
                                    selectedProviderServiceId
                                        ? `Need ${providerServices.find((s) => s.id === selectedProviderServiceId)?.name || 'repair service'}`
                                        : 'My iPhone is not turning on'
                                }
                                className={inputClasses}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClasses}>Category</label>
                                <div className="relative">
                                    <select
                                        value={categoryId}
                                        onChange={(e) => setCategoryId(e.target.value)}
                                        className={`${inputClasses} appearance-none cursor-pointer`}
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat.id || (cat as any)._id} value={cat.id || (cat as any)._id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className={labelClasses}>
                                    {directProviderId && providerServices.length > 0 ? 'Provider Service' : 'Service'}
                                </label>
                                <div className="relative">
                                    {directProviderId && providerServices.length > 0 ? (
                                        <select
                                            value={selectedProviderServiceId}
                                            onChange={(e) => handleDirectServiceSelect(e.target.value)}
                                            className={`${inputClasses} appearance-none cursor-pointer`}
                                        >
                                            <option value="">General / Custom Request</option>
                                            {providerServices.map((svc) => (
                                                <option key={svc.id} value={svc.id}>
                                                    {svc.name} (₹{svc.startingPrice})
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <select
                                            value={serviceType}
                                            onChange={(e) => setServiceType(e.target.value)}
                                            className={`${inputClasses} appearance-none cursor-pointer`}
                                        >
                                            <option value="Others">Others</option>
                                            <option value="Repair">Repair</option>
                                            <option value="Maintenance">Maintenance</option>
                                        </select>
                                    )}
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClasses}>Company / Brand</label>
                                <input
                                    type="text"
                                    list="brand-suggestions"
                                    value={productBrand}
                                    onChange={(e) => setProductBrand(e.target.value)}
                                    placeholder="e.g. Apple, Samsung, LG"
                                    className={inputClasses}
                                />
                                <datalist id="brand-suggestions">
                                    <option value="Apple" />
                                    <option value="Samsung" />
                                    <option value="Sony" />
                                    <option value="LG" />
                                    <option value="Dell" />
                                    <option value="HP" />
                                    <option value="OnePlus" />
                                </datalist>
                            </div>
                            <div>
                                <label className={labelClasses}>Model</label>
                                <input
                                    type="text"
                                    list="model-suggestions"
                                    value={productModel}
                                    onChange={(e) => setProductModel(e.target.value)}
                                    placeholder="e.g. iPhone 13 Pro, Galaxy S22"
                                    className={inputClasses}
                                />
                                <datalist id="model-suggestions">
                                    <option value="iPhone 13 Pro" />
                                    <option value="iPhone 14" />
                                    <option value="Galaxy S22" />
                                    <option value="MacBook Pro" />
                                </datalist>
                            </div>
                        </div>

                        <div>
                            <label className={labelClasses}>Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={6}
                                className={`${inputClasses} resize-none leading-relaxed p-5`}
                                placeholder="The device suddenly turned off while charging and hasn't powered back on since. I've tried multiple cables and power bricks, but there's no charging indicator or vibration. I need this fixed urgently as I have unbacked-up data on the internal storage."
                            ></textarea>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6 flex flex-col h-full">
                        <div>
                            <label className={labelClasses}>Location</label>
                            <div className="relative">
                                <select
                                    value={selectedAddressId}
                                    onChange={(e) => handleAddressDropdownChange(e.target.value)}
                                    className={`${inputClasses} appearance-none cursor-pointer`}
                                >
                                    {userAddresses.map(addr => (
                                        <option key={addr.id || addr._id} value={addr.id || addr._id}>
                                            {addr.houseName}, {addr.area}, {addr.city}
                                        </option>
                                    ))}
                                    <option value="custom">Custom Mapped Location</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Map Image Placeholder -> Real LocationPicker */}
                            <div className="relative shadow-sm border border-black/5 z-0 h-32 rounded-2xl overflow-hidden bg-gray-100">
                                <LocationPicker
                                    onLocationSelect={handleMapSelect}
                                    positionDetails={{ latitude, longitude }}
                                    className="h-full w-full object-cover rounded-2xl"
                                />
                                <button
                                    type="button"
                                    onClick={fetchCurrentLocation}
                                    className="absolute top-2 left-2 bg-gray-900/60 hover:bg-gray-900 hover:scale-105 transition-all backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-medium text-white shadow-sm z-[400] cursor-pointer cursor-default"
                                >
                                    Use my current location
                                </button>
                            </div>

                            {/* Urgency & On-Site */}
                            <div className="flex flex-col justify-between py-1">
                                <div>
                                    <label className={labelClasses}>Urgency</label>
                                    <div className="relative">
                                        <select
                                            value={urgency}
                                            onChange={(e) => setUrgency(e.target.value as ServiceRequestUrgency)}
                                            className={`${inputClasses} appearance-none cursor-pointer py-2.5`}
                                        >
                                            <option value="LOW">Flexible</option>
                                            <option value="NORMAL">Normal</option>
                                            <option value="HIGH">High</option>
                                            <option value="EMERGENCY">Emergency</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClasses}>Service Mode</label>
                                    <div className="grid grid-cols-3 gap-1.5 p-1 bg-white/70 rounded-xl border border-gray-200/60">
                                        <button
                                            type="button"
                                            onClick={() => setServiceMode('ONSITE')}
                                            className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer text-center ${
                                                serviceMode === 'ONSITE'
                                                    ? 'bg-blue-600 text-white shadow-xs'
                                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60'
                                            }`}
                                        >
                                            Onsite
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setServiceMode('WORKSHOP')}
                                            className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer text-center ${
                                                serviceMode === 'WORKSHOP'
                                                    ? 'bg-blue-600 text-white shadow-xs'
                                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60'
                                            }`}
                                        >
                                            Drop-off
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setServiceMode('COLLECTION_AND_RETURN')}
                                            className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer text-center ${
                                                serviceMode === 'COLLECTION_AND_RETURN'
                                                    ? 'bg-blue-600 text-white shadow-xs'
                                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60'
                                            }`}
                                        >
                                            Pick & Drop
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className={labelClasses}>Preferred Date <span className="font-normal opacity-70">(Optional)</span></label>
                            <input
                                type="date"
                                value={preferredDate}
                                onChange={(e) => setPreferredDate(e.target.value)}
                                className={inputClasses}
                            />
                        </div>

                        <div className="bg-white/40 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-white flex-1 mb-4">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-sm font-semibold text-gray-800">Upload Media</h4>
                                <span className="text-[10px] font-medium text-gray-400">Min. 3 high-res photos</span>
                            </div>

                            <div className="flex gap-3 overflow-x-auto pb-2">
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="shrink-0 w-20 h-20 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-1 hover:border-gray-400 hover:bg-gray-50/50 transition-colors cursor-pointer"
                                >
                                    <Camera size={20} className="text-gray-500" />
                                    <span className="text-[10px] font-medium text-gray-500">Upload</span>
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                />

                                {mediaPreviews.map((src, idx) => (
                                    <div key={idx} className="shrink-0 w-20 h-20 rounded-xl overflow-hidden shadow-sm border border-white">
                                        <img src={src} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                ))}

                                {mediaPreviews.length === 0 && (
                                    <>
                                        <div className="shrink-0 w-20 h-20 rounded-xl overflow-hidden shadow-sm border border-white opacity-60">
                                            <img src="https://placehold.co/100x100/e2e8f0/64748b?text=..." className="w-full h-full object-cover" />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons at bottom right */}
                        <div className="flex items-center justify-end gap-3 mt-auto pt-2">
                            <button
                                type="button"
                                onClick={() => navigate('/service-requests')}
                                className="px-6 py-2 rounded-xl text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 shadow-sm transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`px-6 py-2 rounded-xl text-sm font-semibold text-white bg-[#1C1C1C] hover:bg-black shadow-sm transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit'}
                            </button>
                        </div>

                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreateServiceRequestPage;
