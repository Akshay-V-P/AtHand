import type { Document } from "../store/appyProviderSlice";

export interface BusinessDetailsDTO{
    userId: string;
    businessDetails?: {
        businessName: string;
        contactPerson: string;
        phone: string;
        email: string;
    },
    locationDetails?: {
        address: {
            street: string;
            city: string;
            district: string;
            state: string;
            pincode: string;
        },
        coordinates: {
            type: "Point",
            coordinates:[number, number]
        }
    },
    serviceDetails?: {
        serviceCategory: string,
        serviceRadius:number
    },
    documents?:Document[]
}