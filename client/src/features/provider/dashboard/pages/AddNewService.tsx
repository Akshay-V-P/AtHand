import { useState, useEffect } from 'react';
import { ChevronRight, FileText, Image as ImageIcon, Camera, CreditCard, Rocket, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { providerServiceApi } from '../apis/providerServiceApi';
import toast from 'react-hot-toast';
import { useAppSelector } from '../../../../hooks/storeHook';
import { uploadFileToS3 } from '../../../../services/imageService';
import { useRef } from 'react';

export default function AddNewService() {
    const navigate = useNavigate();
    const providerId = useAppSelector(state => state.provider.id);

    const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        categoryId: '',
        description: '',
        pricingModel: 'HOURLY',
        startingPrice: '',
        serviceRadius: 20,
        listedOnPublicProfile: true,
        onSite: false,
        acceptEmergency: false,
        instantBooking: false
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await providerServiceApi.getActiveCategories();
                console.log(response)
                if (response.success && response.data) {
                    setCategories(response.data);
                    if (response.data.length > 0) {
                        setFormData(prev => ({ ...prev, categoryId: response.data[0].id }));
                    }
                }
            } catch (error) {
                toast.error("Failed to load categories");
            }
        };

        fetchCategories();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleToggle = (field: keyof typeof formData) => {
        setFormData(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setSelectedImages(prev => [...prev, ...filesArray]);

            const newPreviews = filesArray.map(file => URL.createObjectURL(file));
            setImagePreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeImage = (index: number) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!providerId) {
            toast.error("Provider not found in session");
            return;
        }

        if (!formData.name || !formData.categoryId || !formData.startingPrice) {
            toast.error("Please fill all required fields");
            return;
        }

        if (selectedImages.length < 3) {
            toast.error("Please upload at least 3 photos for your portfolio");
            return;
        }

        try {
            setIsLoading(true);
            toast.loading("Uploading photos...", { id: "upload" });
            const uploadedKeys: string[] = [];
            for (const file of selectedImages) {
                const key = await uploadFileToS3(file, "/provider-service/upload-url");
                uploadedKeys.push(key);
            }
            toast.success("Photos uploaded successfully", { id: "upload" });

            const payload = {
                providerId: providerId,
                categoryId: formData.categoryId,
                name: formData.name,
                description: formData.description,
                media: uploadedKeys,
                onSite: formData.onSite,
                acceptUrgent: formData.acceptEmergency,
                instantBooking: formData.instantBooking,
                serviceRadius: Number(formData.serviceRadius),
                startingPrice: Number(formData.startingPrice),
                pricingType: formData.pricingModel,
                isAvailable: formData.listedOnPublicProfile
            };

            const response = await providerServiceApi.createService(payload);

            if (response.success) {
                toast.success("Service published successfully!");
                navigate('/provider/dashboard/services');
            }
        } catch (error: any) {
            console.error(error);
            toast.dismiss("upload");
            toast.error(error?.response?.data?.message || "Failed to publish service");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-7xl mx-auto p-8 bg-gray-50/30 min-h-screen">
            {/* Breadcrumb & Header */}
            <div className="mb-8">
                <div className="flex items-center text-sm font-medium text-gray-500 mb-4">
                    <Link to="/provider/dashboard/services" className="hover:text-indigo-600 transition-colors">My Services</Link>
                    <ChevronRight className="w-4 h-4 mx-1" />
                    <span className="text-indigo-600 font-semibold">Add New Service</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Publish New Capability</h1>
                <p className="text-gray-500 text-sm">Fill in the technical specifications and pricing for your professional service.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Service Overview */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center mb-6">
                            <FileText className="w-5 h-5 text-indigo-600 mr-2" />
                            <h2 className="text-lg font-bold text-gray-900">Service Overview</h2>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Service Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. Precision Micro-Soldering"
                                    className="w-full border border-gray-300 rounded-md py-2.5 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400"
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Category *</label>
                                    <div className="relative">
                                        <select
                                            name="categoryId"
                                            value={formData.categoryId}
                                            onChange={handleChange}
                                            required
                                            className="appearance-none w-full border border-gray-300 rounded-md py-2.5 px-4 pr-10 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                                        >
                                            <option value="" disabled>Select a category</option>
                                            {categories.map((cat) => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="w-5 h-5 text-gray-500 absolute right-3 top-2.5 pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Service Description (Technical Specs)</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="Describe the technical steps, tolerances, and typical outcomes..."
                                    className="w-full border border-gray-300 rounded-md py-2.5 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Portfolio Gallery */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center">
                                <ImageIcon className="w-5 h-5 text-indigo-600 mr-2" />
                                <h2 className="text-lg font-bold text-gray-900">Portfolio Gallery</h2>
                            </div>
                            <span className="text-xs font-semibold text-gray-500">Min. 3 high-res photos</span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {/* Upload Button */}
                            <button onClick={() => fileInputRef.current?.click()} type="button" className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-indigo-600 transition-colors">
                                <Camera className="w-6 h-6 mb-2" />
                                <span className="text-xs font-bold">Upload</span>
                            </button>
                            <input type="file" multiple ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />

                            {/* Added Image previews */}
                            {imagePreviews.map((preview, idx) => (
                                <div key={idx} className="h-32 rounded-lg bg-gray-200 overflow-hidden relative group">
                                    <img src={preview} alt={`preview ${idx}`} className="w-full h-full object-cover" />
                                    <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer">
                                        <span className="text-xs font-bold">X</span>
                                    </button>
                                </div>
                            ))}

                            {/* Empty slots for requirement indication */}
                            {Array.from({ length: Math.max(0, 3 - imagePreviews.length) }).map((_, idx) => (
                                <div key={`empty-${idx}`} className="border border-gray-100 bg-indigo-50/50 rounded-lg h-32 flex items-center justify-center">
                                    <ImageIcon className="w-6 h-6 text-gray-300" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons (Visible on Mobile/Tablet usually below, but for layout we'll put them here or at bottom) */}
                    <div className="flex gap-4 pt-4">
                        <Link to="/provider/dashboard/services" className="px-6 py-2.5 border-2 border-indigo-600 text-indigo-600 font-bold rounded-md hover:bg-indigo-50 transition-colors text-sm text-center">
                            Cancel
                        </Link>
                        <button disabled={isLoading} type="submit" className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-700 transition-colors text-sm flex items-center shadow-sm disabled:opacity-50">
                            {isLoading ? 'Publishing...' : 'Publish Service'}
                            {!isLoading && <Rocket className="w-4 h-4 ml-2" />}
                        </button>
                    </div>

                </div>

                {/* Right Column */}
                <div className="space-y-6">

                    {/* Base Pricing */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center mb-6">
                            <CreditCard className="w-5 h-5 text-indigo-600 mr-2" />
                            <h2 className="text-lg font-bold text-gray-900">Base Pricing</h2>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-3">Pricing Model *</label>
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setFormData(p => ({ ...p, pricingModel: 'HOURLY' }))}
                                        className={`flex-1 py-2 text-sm font-bold rounded-md border ${formData.pricingModel === 'HOURLY' ? 'bg-indigo-50/50 border-indigo-600 text-indigo-600' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        Hourly
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData(p => ({ ...p, pricingModel: 'FLAT_FEE' }))}
                                        className={`flex-1 py-2 text-sm font-bold rounded-md border ${formData.pricingModel === 'FLAT_FEE' ? 'bg-indigo-50/50 border-indigo-600 text-indigo-600' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        Flat Fee
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Rate *</label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-4 font-bold text-gray-500">₹</span>
                                    <input
                                        type="number"
                                        name="startingPrice"
                                        value={formData.startingPrice}
                                        onChange={handleChange}
                                        required
                                        placeholder="0.00"
                                        className="w-full border border-gray-300 rounded-md py-2.5 pl-8 pr-12 text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <span className="absolute right-4 text-sm font-bold text-gray-400">
                                        {formData.pricingModel === 'HOURLY' ? '/ hr' : '/ flat'}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Service Distance</label>
                                <div className="relative">
                                    <select
                                        name="serviceRadius"
                                        value={formData.serviceRadius}
                                        onChange={handleChange}
                                        className="appearance-none w-full border border-gray-300 rounded-md py-2.5 px-4 pr-10 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white font-medium"
                                    >
                                        <option value={10}>10 Km</option>
                                        <option value={20}>20 Km</option>
                                        <option value={30}>30 Km</option>
                                        <option value={50}>50 Km</option>
                                    </select>
                                    <ChevronDown className="w-5 h-5 text-gray-500 absolute right-3 top-2.5 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Service Visibility */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col h-[320px]">
                        <h3 className="text-[11px] font-bold text-gray-900 uppercase tracking-wider mb-6">Service Visibility</h3>

                        <div className="space-y-6 flex-grow ">
                            {/* Toggle 1 */}
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">Listed on Public Profile</span>
                                <div onClick={() => handleToggle('listedOnPublicProfile')} className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${formData.listedOnPublicProfile ? 'bg-indigo-600' : 'bg-gray-300'}`}>
                                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${formData.listedOnPublicProfile ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                </div>
                            </div>

                            {/* Toggle 2 */}
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">On-site</span>
                                <div onClick={() => handleToggle('onSite')} className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${formData.onSite ? 'bg-indigo-600' : 'bg-gray-300'}`}>
                                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${formData.onSite ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                </div>
                            </div>

                            {/* Toggle 3 */}
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">Accept Emergency jobs</span>
                                <div onClick={() => handleToggle('acceptEmergency')} className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${formData.acceptEmergency ? 'bg-indigo-600' : 'bg-gray-300'}`}>
                                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${formData.acceptEmergency ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                </div>
                            </div>

                            {/* Toggle 4 */}
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-600">Instant Booking Enabled</span>
                                <div onClick={() => handleToggle('instantBooking')} className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${formData.instantBooking ? 'bg-indigo-600' : 'bg-gray-300'}`}>
                                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${formData.instantBooking ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </form>
    );
}
