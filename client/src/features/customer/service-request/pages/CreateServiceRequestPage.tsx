import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { serviceRequestApi } from '../api/serviceRequestApi';
import toast from 'react-hot-toast';
import { api } from '../../../../services/axios';
import type { ServiceRequestUrgency } from '../dtos/ServiceRequestDTOs';
import { Camera } from 'lucide-react';
import { uploadFileToS3 } from '../../../../services/imageService';
import LocationPicker from '../../../../components/provider/applyProvider/LocationPicker';
import { getUserLocation, reverseGeocode } from '../../../provider/applyAsProvider/services/locationService';
import { accountServices } from '../../account/services/accountServices';

const CreateServiceRequestPage = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);
    const [userAddresses, setUserAddresses] = useState<any[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form state
    const [categoryId, setCategoryId] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [urgency, setUrgency] = useState<ServiceRequestUrgency>("NORMAL");
    const [onSite, setOnSite] = useState(true);
    const [productBrand, setProductBrand] = useState('Apple');
    const [productModel, setProductModel] = useState('iPhone 13 Pro');
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
                categoryId: categoryId || (categories.length > 0 ? categories[0].id : ''),
                title,
                description,
                urgency,
                onSite: onSite,
                media: uploadedKeys,
                productBrand,
                productModel,
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
                toast.success('Service Request created successfully!', { id: "create-req" });
                navigate('/service-requests');
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
            <h1 className="text-3xl font-[800] text-gray-900 tracking-tight mb-8 ml-2">
                Create Quote
            </h1>

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
                                placeholder="My iPhone is not turning on"
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
                                <label className={labelClasses}>Service</label>
                                <div className="relative">
                                    <select
                                        value={serviceType}
                                        onChange={(e) => setServiceType(e.target.value)}
                                        className={`${inputClasses} appearance-none cursor-pointer`}
                                    >
                                        <option value="Others">Others</option>
                                        <option value="Repair">Repair</option>
                                        <option value="Maintenance">Maintenance</option>
                                    </select>
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
                                <label className={labelClasses}>Company</label>
                                <div className="relative">
                                    <select
                                        value={productBrand}
                                        onChange={(e) => setProductBrand(e.target.value)}
                                        className={`${inputClasses} appearance-none cursor-pointer`}
                                    >
                                        <option value="Apple">Apple</option>
                                        <option value="Samsung">Samsung</option>
                                        <option value="Sony">Sony</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className={labelClasses}>Model</label>
                                <div className="relative">
                                    <select
                                        value={productModel}
                                        onChange={(e) => setProductModel(e.target.value)}
                                        className={`${inputClasses} appearance-none cursor-pointer`}
                                    >
                                        <option value="iPhone 13 Pro">iPhone 13 Pro</option>
                                        <option value="iPhone 14">iPhone 14</option>
                                        <option value="Galaxy S22">Galaxy S22</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
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
                                <div className="flex items-center gap-4 pl-1">
                                    <label className="text-sm font-semibold text-gray-600 flex-1">On-Site</label>
                                    <button
                                        type="button"
                                        onClick={() => setOnSite(!onSite)}
                                        className={`w-12 h-6 rounded-full p-1 transition-colors relative flex items-center shadow-inner ${onSite ? 'bg-indigo-600' : 'bg-gray-300'}`}
                                    >
                                        <div className={`w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${onSite ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                    </button>
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
