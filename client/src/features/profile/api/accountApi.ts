import { api } from "../../../services/axios";

export const accountApi = {
    logout: () => 
        api.post("/auth/logout")
}