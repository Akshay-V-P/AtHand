import { api } from "../../../services/axios";
import type { ForgotDto } from "../dtos/ForgotDto";
import type { GoogleSignDto } from "../dtos/GoogleSignDto";
import type { LoginDto } from "../dtos/LoginDto";
import type { RegisterDto } from "../dtos/RegisterDto";
import type { UpdatePasswordDto } from "../dtos/UpdatePasswordDto";
import type { VerifyOtpDto } from "../dtos/VerifyOtpDto";
import type { VerifyPasswordDto } from "../dtos/VerifyPasswordDto";

export const authApi = {
    register: (data: RegisterDto) =>
        api.post("/auth/signup", data),
    login: (data: LoginDto) =>
        api.post("/auth/login", data),
    otpStatus: () =>
        api.get("/auth/otp-status"),
    verifyOtp: (data:VerifyOtpDto) =>
        api.post("/auth/verify-otp", data),
    resendOtp: () =>
        api.post("/auth/resend-otp"),
    refresh: () =>
        api.post("/auth/me"),
    forgotPassword: (data:ForgotDto) =>
        api.post("/auth/forgot-password", data),
    verifyResetLink: (token:{token: string}) =>
        api.post("/auth/verify-reset-token", token),
    updatePassword: (data: UpdatePasswordDto) =>
        api.post("/auth/update-password", data),
    loginWithGoogle: (data:GoogleSignDto) =>
        api.post("/auth/google", data),
    verifyPassword:(data: VerifyPasswordDto) => 
        api.post("/auth/verify-password", data)
    
}