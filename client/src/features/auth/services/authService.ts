import { authApi } from "../api/authApi";
import type { ForgotDto } from "../dtos/ForgotDto";
import type { LoginDto } from "../dtos/LoginDto";
import type { RegisterDto } from "../dtos/RegisterDto";
import type { UpdatePasswordDto } from "../dtos/UpdatePasswordDto";
import type { VerifyOtpDto } from "../dtos/VerifyOtpDto";
import type { VerifyPasswordDto } from "../dtos/VerifyPasswordDto";

export const authService = {
    async register(data: RegisterDto) {
        const response = await authApi.register(data)
        return response;
    },

    async login(data: LoginDto) {
        const response = await authApi.login(data)
        return response
    },

    async otpStatus() {
        const response = await authApi.otpStatus()
        return response.data.data
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
    },

    async forgotPassword(data:ForgotDto) {
        const response = await authApi.forgotPassword(data)
        return response
    },

    async verifyResetLink(token: string) {
        const response = await authApi.verifyResetLink({token})
        return response
    },

    async updatePassword(data: UpdatePasswordDto) {
        const response = await authApi.updatePassword(data)
        return response
    },

    async loginWithGoogle(googleToken: string) {
        const response = await authApi.loginWithGoogle({ token: googleToken })
        return response
    },

    async verifyPassword(data: VerifyPasswordDto) {
        const response = await authApi.verifyPassword(data)
        return response
    }
}