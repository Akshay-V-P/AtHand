import { authApi } from "../api/authApi";
import type { LoginDto } from "../dtos/LoginDto";
import type { RegisterDto } from "../dtos/RegisterDto";
import type { VerifyOtpDto } from "../dtos/VerifyOtpDto";

export const authService = {
    async register(data: RegisterDto) {
        const response = await authApi.register(data)
        return response;
    },

    async login(data: LoginDto) {
        const response = await authApi.login(data)
        return response.data
    },

    async otpStatus() {
        const response = await authApi.otpStatus()
        return response.data
    },

    async verifyOtp(data:VerifyOtpDto) {
        const response = await authApi.verifyOtp(data)
        return response
    },

    async resendOtp() {
        const response = await authApi.resendOtp()
        return response
    },

    async refresh() {
        const response = await authApi.refresh()
        return response
    }
}