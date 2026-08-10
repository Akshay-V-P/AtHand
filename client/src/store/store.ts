import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/store/authSlice"
import providerApplicationReducer from '../features/provider/applyAsProvider/store/appyProviderSlice'
import providerReducer from "../features/provider/applyAsProvider/store/providerSlice"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        providerApplication: providerApplicationReducer,
        provider:providerReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch