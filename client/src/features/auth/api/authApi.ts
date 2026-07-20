import { api } from "../../../services/axios";
import type { LoginDto } from "../dtos/LoginDto";
import type { RegisterDto } from "../dtos/RegisterDto";
import type { VerifyOtpDto } from "../dtos/VerifyOtpDto";

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
        api.post("/auth/resend-otp")
}