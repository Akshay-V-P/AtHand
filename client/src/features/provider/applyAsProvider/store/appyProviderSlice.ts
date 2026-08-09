import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface BusinessDetails{
    userId: string;
    businessName: string;
    contactPerson: string;
    phone: string;
    email: string;
}

interface Address{
    street: string;
    city: string;
    district: string;
    state: string;
    pincode: string;
}

interface Coordinates{
    type: "Point";
    coordinates: [number, number];
}

interface LocationDetails{
    address: Address;
    coordinates:Coordinates
}

interface ServiceDetails{
    serviceCategory: string;
    serviceRadius: number;
}

interface Document{
    providerId: string;
    documentType: "TECHNICAL CERTIFICATE" | "BUSINESS LICENSE" | "GOVERNMENT ID";
    documentUrl: string;
}

interface ProviderApplicationState{
    businessDetails: BusinessDetails | null;
    locationDetails: LocationDetails | null;
    serviceDetails: ServiceDetails | null;
    documents: Document[];
    stepCount: number;
}

const initialState: ProviderApplicationState = {
    businessDetails: null,
    locationDetails: null,
    serviceDetails: null,
    documents: [],
    stepCount:0
}

const providerApplicationSlice = createSlice({
    name: "providerApplication",
    initialState,
    reducers: {
        setBusinessDetails: (state, action: PayloadAction<BusinessDetails>) => {
            state.businessDetails = action.payload
        },
        setLocationDetails: (state, action: PayloadAction<LocationDetails>) => {
            state.locationDetails = action.payload
            state.stepCount = 1
        },
        setServiceDetails: (state, action: PayloadAction<ServiceDetails>) => {
            state.serviceDetails = action.payload
            state.stepCount = 2
        }, 
        addDocument: (state,action:PayloadAction<Document>) => {
            state.documents.push(action.payload)
        },
        removeDocument: (state, action:PayloadAction<string>) => {
            state.documents = state.documents.filter((doc)=> doc.documentType !== action.payload)
        },
        clearProviderApplication: (state)=> {
            state.businessDetails = null
            state.locationDetails = null
            state.documents = []
            state.serviceDetails = null
            state.stepCount = 0
        }

    }
})

export const {
    setBusinessDetails,
    setLocationDetails, 
    setServiceDetails,
    addDocument,
    removeDocument,
    clearProviderApplication
} = providerApplicationSlice.actions

export default providerApplicationSlice.reducer

