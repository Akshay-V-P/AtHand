import React, { useState } from "react";
import { InputField } from "../../../../components/common/InputField";
import InfoCard from "../../../../components/provider/InfoCard";
import { Locate, Shield, Zap } from "lucide-react";
import { Form } from "../../../../components/common/Form";
import ProgressBar from "../../../../components/provider/ProgressBar";
import { Button } from "../../../../components/common/Button";
import { getUserLocation, reverseGeocode } from "../services/locationService";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storeHook";
import { setLocationDetails } from "../store/appyProviderSlice";
import LocationPicker from "../../../../components/provider/LocationPicker";
import { useForm } from "react-hook-form";
import { businessDetailsSchema, type BusinessDetailsFormData } from "../validation/businessDetailsSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

const CreateAccount = () => {
    const location = useAppSelector((state) => state.providerApplication.locationDetails)
    const dispatch = useAppDispatch()
    const [latitude, setLatitude] = useState<number | null>(null)
    const [longitude, setLongitude] = useState<number | null>(null)
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<BusinessDetailsFormData>({
        resolver:zodResolver(businessDetailsSchema)
    })

    const onSubmit = async (data: BusinessDetailsFormData) => {
        try {
            const businessDetails = {
                businessName: data.businessName,
                contactPeroson: data.contactPerson,
                phone: data.phone,
                email:data.email
            }
            const locationDetails = {
                address: {
                    street: data.street,
                    city: data.city,
                    district: data.district,
                    state: data.state,
                    pincode:data.pincode
                },
                coordinates: {
                    type: "Point",
                    coordinates:[longitude, latitude]
                }
            }
            
        } catch (error:any) {
            console.log(error.message)
            toast.error(error.message || "Somthing went wrong")
        }
    }

    const fetchLocation = async () => {
        try {
            const position = await getUserLocation()
            setLatitude(position?.coords.latitude!)
            setLongitude(position?.coords.longitude!)

            const payload = await reverseGeocode(position?.coords.latitude!, position?.coords.longitude!)
            dispatch(setLocationDetails(payload))
        } catch (error:any) {
            console.error(error.message)
            toast.error(error.message || "Something went wrong")
        }
        
    }

    return (
        <main className="flex-1 overflow-y-auto bg-white p-8 lg:p-12">
            <div className="max-w-5xl mx-auto">
                {/* Progress Bar Section */}
                <ProgressBar progress={1} />

                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">
                        Create Your Professional Profile
                    </h1>
                    <p className="text-lg text-gray-600">
                        Start your journey as a At.Hand partner. Tell us about
                        your business.
                    </p>
                </div>

                {/* Two Column Grid for Form and Info Cards */}
                <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8 lg:gap-y-12">
                    {/* Left Column: Form */}
                    <div className="order-1 lg:col-span-2">
                        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                            <Form onSubmit={handleSubmit(onSubmit)}>
                                <h2 className="text-xl font-bold">Business Details</h2>
                                <InputField
                                    inputLabel="Business Name"
                                    placeholder="e.g. Honest Repairs"
                                    label={errors.businessName?.message}
                                    {...register('businessName')}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                                    <InputField
                                        inputLabel="Contact Person"
                                        placeholder="e.g. Sarah Connor"
                                        label={errors.contactPerson?.message}
                                        {...register('contactPerson')}
                                    />
                                    <InputField
                                        inputLabel="Phone Number"
                                        type="tel"
                                        placeholder="Phone"
                                        label={errors.phone?.message}
                                        {...register('phone')}
                                    />
                                </div>

                                <InputField
                                    inputLabel="Business Email"
                                    type="email"
                                    placeholder="email@example.com"
                                    label={errors.email?.message}
                                    {...register('email')}
                                />

                                <h2 className="text-xl font-bold">Address</h2>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="outline-1 outline-gray-400 flex gap-4 items-center h-8 text-xs"
                                    onClick={fetchLocation}
                                >
                                    <Locate size={18} /> Use current location
                                </Button>
                                <LocationPicker
                                    onLocationSelect={async (latitude, longitude) => {
                                        const location = await reverseGeocode(
                                        latitude,
                                        longitude
                                        );

                                        setLatitude(latitude)
                                        setLongitude(longitude)

                                        dispatch(setLocationDetails(location));
                                    }}
                                    positionDetails={{latitude, longitude}}
                                    />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                                    <InputField
                                        inputLabel="Street"
                                        type="text"
                                        placeholder="eg. Kaloor"
                                        defaultValue={location?.address.street}
                                        label={errors.street?.message}
                                        {...register('street')}
                                    />
                                    <InputField
                                        inputLabel="City"
                                        type="text"
                                        placeholder="eg. Kochi"
                                        defaultValue={location?.address.city}
                                        label={errors.city?.message}
                                        {...register('city')}
                                    />
                                    <InputField
                                        inputLabel="District"
                                        type="text"
                                        placeholder="eg. Ernamkulam"
                                        defaultValue={location?.address.district}
                                        label={errors.district?.message}
                                        {...register('district')}
                                    />
                                    <InputField
                                        inputLabel="State"
                                        type="text"
                                        placeholder="eg. Kerala"
                                        defaultValue={location?.address.state}
                                        label={errors.state?.message}
                                        {...register('state')}
                                    />
                                    <InputField
                                        inputLabel="Pincode"
                                        type="text"
                                        placeholder="eg. 628604"
                                        defaultValue={location?.address.pincode}
                                        label={errors.pincode?.message}
                                        {...register('pincode')}
                                    />
                                </div>

                                <div className="order-2 lg:order-3 lg:col-span-3 flex justify-end w-full cursor-pointer mt-14">
                                    <Button type="submit" variant="blue">

                                        Continue to Service Specialization
                                    </Button>
                                    
                                </div>
                            </Form>
                        </div>
                    </div>
                    {/* Bottom Action Area */}

                    {/* Right Column: Info Cards */}
                    <div className="order-3 lg:order-2 flex flex-col gap-6">
                        <InfoCard
                            variant="default"
                            icon={Shield}
                            title="Secure & Private"
                            description="Your data is encrypted with industry-standard protocols. We never share your sensitive information."
                        />

                        <InfoCard
                            variant="pattern"
                            title="Join 5000+ Pros"
                            description="At.Hand is the trusted platform for top-tier repair specialists worldwide."
                        />

                        <InfoCard
                            variant="blue"
                            icon={Zap}
                            title="Fast Approval"
                            description="Complete your profile today and get verified within 24 hours to start receiving requests."
                        />
                    </div>
                </div>
            </div>
        </main>
    );
};

export default CreateAccount;
