import { api } from "../../../services/axios";
import type { LoginDto } from "../dtos/LoginDto";
import type { RegisterDto } from "../dtos/RegisterDto";

export const authApi = {
    register: (data: RegisterDto) =>
        api.post("/auth/signup", data),
    login: (data: LoginDto) =>
        api.post("/auth/login", data)
}