import { api } from "../../../../services/axios";

export const providerApplicationApi = {
    createAccount: () =>
        api.post("/provider-application/create-provider"),
    uploadDocument: () =>
        api.post("/provider-application/upload-document"),
}