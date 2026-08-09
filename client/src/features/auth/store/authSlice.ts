import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface User{
    id: string;
    name: string;
    email: string;
    role: string;
    googleId: string;
    profilePhotoUrl: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading:boolean
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
        setIsLoading(state, action:PayloadAction<boolean>) {
            state.isLoading = action.payload
        }
    }
})

export const { loginSuccess, logout, setIsLoading } = authSlice.actions;

export default authSlice.reducer;