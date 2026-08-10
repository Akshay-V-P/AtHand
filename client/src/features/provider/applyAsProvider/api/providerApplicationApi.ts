import { api } from "../../../../services/axios";
import type { BusinessDetailsDTO } from "../dtos/BusinessDetailsDTO";
import type { DocumentUploadDTO } from "../dtos/DocumentUploadDTO";

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
    getProvider: (userId: string) =>
        api.post("/provider-application/get-provider", {userId})
}