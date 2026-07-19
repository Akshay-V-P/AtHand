import { authApi } from "../api/authApi";
import type { LoginDto } from "../dtos/LoginDto";
import type { RegisterDto } from "../dtos/RegisterDto";

export const authService = {
    async register(data: RegisterDto) {
        const response = await authApi.register(data)
        return response;
    },

    async login(data: LoginDto) {
        const response = await authApi.login(data)
        return response.data
    }
}