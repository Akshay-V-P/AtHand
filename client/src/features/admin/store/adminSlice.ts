import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { UserRole } from "../../auth/enums/UserRole";

interface Admin{
    id: string;
    name: string;
    email: string;
    role: UserRole[];
    googleId: string;
    profilePhotoUrl: string;
}

interface AuthState {
    admin: Admin | null;
    isAuthenticated: boolean;
    isLoading:boolean
}

const initialState: AuthState = {
    admin: null,
    isAuthenticated: false,
    isLoading: true
}

const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        adminloginSuccess(state, action: PayloadAction<Admin>) {
            state.admin = action.payload;
            state.isAuthenticated = true;
        },
        adminlogout(state) {
            state.admin = null;
            state.isAuthenticated = false
        },
        adminSetIsLoading(state, action:PayloadAction<boolean>) {
            state.isLoading = action.payload
        }
    }
})

export const { adminloginSuccess, adminlogout, adminSetIsLoading } = adminSlice.actions;

export default adminSlice.reducer;