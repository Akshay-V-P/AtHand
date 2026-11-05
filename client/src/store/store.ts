import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/store/authSlice";
import providerApplicationReducer from "@/features/provider/applyAsProvider/store/providerApplicationSlice";
import providerReducer from "@/features/provider/store/providerSlice";
import adminReducer from "@/features/admin/store/adminSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        providerApplication: providerApplicationReducer,
        provider: providerReducer,
        admin: adminReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
