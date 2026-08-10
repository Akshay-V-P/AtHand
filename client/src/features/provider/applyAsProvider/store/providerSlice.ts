import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ProviderState{
    id: string | null;
    userId: string | null;
    businessName: string | null;
    status: "PENDING" | "APPROVED" | "BLOCKED" | null;
    documents?: string[];
}

const initialState: ProviderState = {
    id: null,
    userId: null,
    businessName: null,
    status:null,
}

const providerSlice = createSlice({
    name: "provider",
    initialState,
    reducers: {
        setProvider:(state, action: PayloadAction<ProviderState>)=> {
            state.id = action.payload.id
            state.businessName = action.payload.businessName
            state.userId = action.payload.userId
            state.status = action.payload.status
        },
        clearProvider: (state) => {
            state.businessName = null
            state.id = null
            state.userId = null
            state.status = null
        }
    }
})

export const { setProvider, clearProvider } = providerSlice.actions
export default providerSlice.reducer