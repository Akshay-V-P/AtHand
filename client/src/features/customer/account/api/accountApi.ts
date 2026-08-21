import { api } from "../../../../services/axios";
import type { LogoutDTO } from "../dtos/LogoutDTO";


export const accountApi = {
    logout: (data:LogoutDTO) => 
        api.post("/auth/logout", data),
}