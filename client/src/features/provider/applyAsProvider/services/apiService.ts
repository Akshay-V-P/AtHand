import { providerApplicationApi } from "../api/providerApplicationApi";
import type { BusinessDetailsDTO } from "../dtos/BusinessDetailsDTO";

export const apiService = {
    async updateDraft(data:BusinessDetailsDTO) {
        const draft = await providerApplicationApi.updateDraft(data)
        return draft
    }
}