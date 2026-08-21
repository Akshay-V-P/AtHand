import { api } from "../../../../services/axios";
import type { BusinessDetailsDTO } from "../dtos/BusinessDetailsDTO";
import type { DocumentUploadDTO } from "../dtos/DocumentUploadDTO";
import type { PresignedDisplayUrlDTO } from "../dtos/PresignedUrlDTO";
import type { UpdateProviderDto } from "../dtos/UpdateProviderDTO";

export const providerApplicationApi = {
    createAccount: (userId:string) =>
        api.post("/provider-application/create-provider", {userId}),
    uploadDocument: (data:DocumentUploadDTO) =>
        api.post("/provider-application/upload-document", data),
    updateDraft: (data:BusinessDetailsDTO) =>
        api.patch("/provider-application/update-provider-draft", data),
    getCategories: () =>
        api.get("/category/get"),
    getDraft: (userId:string) =>
        api.post("/provider-application/get-draft", { userId }),
    getProvider: (id: string) =>
        api.get(`/provider-application/get-provider/${id}`),
    getPresignedUrl: (data:PresignedDisplayUrlDTO) =>
        api.post("/provider-application/get-display-url", data),
    updateProvider: (data:UpdateProviderDto) =>
        api.patch("/provider-application/update", data)
}