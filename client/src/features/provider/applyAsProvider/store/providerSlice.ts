import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ProviderStatus } from "../../enum/ProviderStatus";
import type { ILocationDetails } from "../../intefaces/ILocationDetails";

interface ProviderState{
    id: string | null;
    businessName: string | null;
    contactPerson: string | null;
    phone: string | null;
    email: string | null;
    serviceCategory: string | null;
    location: ILocationDetails | null,
    serviceRadius: number | null,
    status: ProviderStatus | null,
    experience: number | null,
    averageRating: number | null,
    totalReview: number | null,
    completedJobs: number | null,
    documents?: string[];
    isLoading: boolean;
}

const initialState: ProviderState = {
    id:null,
    businessName: null,
    contactPerson: null,
    phone: null,
    email: null,
    serviceCategory: null,
    location: null,
    serviceRadius: null,
    status: null,
    experience: null,
    averageRating: null,
    totalReview: null,
    completedJobs: null,
    isLoading:true,
}

const providerSlice = createSlice({
    name: "provider",
    initialState,
    reducers: {
        setProvider:(state, action: PayloadAction<ProviderState>)=> {
            state.businessName = action.payload.businessName
            state.contactPerson = action.payload.contactPerson
            state.phone = action.payload.phone
            state.email = action.payload.email
            state.serviceCategory = action.payload.serviceCategory
            state.location = action.payload.location
            state.serviceRadius = action.payload.serviceRadius
            state.status = action.payload.status
            state.experience = action.payload.experience
            state.averageRating = action.payload.averageRating
            state.totalReview = action.payload.totalReview
            state.completedJobs = action.payload.completedJobs
            state.id = action.payload.id
        },
        clearProvider: (state) => {
            state.businessName = null
            state.contactPerson = null
            state.phone = null
            state.email = null
            state.serviceCategory = null
            state.location = null
            state.serviceRadius = null
            state.status = null
            state.experience = null
            state.averageRating = null
            state.totalReview = null
            state.completedJobs = null
            state.id = null
        },
        setLoading: (state, action: PayloadAction<boolean>)=>{
            state.isLoading = action.payload
        }
    }
})

export const { setProvider, clearProvider, setLoading } = providerSlice.actions
export default providerSlice.reducer