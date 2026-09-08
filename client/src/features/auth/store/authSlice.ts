import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { UserRole } from "../enums/UserRole";

interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole[];
    googleId: string;
    profilePhotoUrl: string;
    profileKey?: string;
    phone?: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: true
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSuccess(state, action: PayloadAction<User>) {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        logout(state) {
            state.user = null;
            state.isAuthenticated = false
        },
        updateUser(state, action: PayloadAction<Partial<User>>) {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
            }
        },
        setIsLoading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload
        }
    }
})

export const { loginSuccess, logout, setIsLoading, updateUser } = authSlice.actions;

export default authSlice.reducer;