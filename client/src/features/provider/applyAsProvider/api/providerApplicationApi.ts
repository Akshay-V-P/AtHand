import { api } from "../../../../services/axios";
import type { BusinessDetailsDTO } from "../dtos/BusinessDetailsDTO";

export const providerApplicationApi = {
    createAccount: () =>
        api.post("/provider-application/create-provider"),
    uploadDocument: () =>
        api.post("/provider-application/upload-document"),
    updateDraft: (data:BusinessDetailsDTO) =>
        api.patch("/provider-application/update-provider-draft", data),
    getCategories: () =>
        api.get("/category/get")
}