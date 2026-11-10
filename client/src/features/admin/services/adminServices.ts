import type { CreateCategoryDTO } from "@/shared/dtos/CreateCategoryDTO";
import type { GetCategoriesDTO } from "@/shared/dtos/GetCategoryDTO";
import type { LogoutDTO } from "@/features/auth/dtos/LogoutDTO";
import { adminApi } from "../api/adminApi";
import type { EditCategoryFormData } from "../validation/EditCategorySchema";
import type { IProviderUpdateData } from "@/features/provider/applyAsProvider/dtos/UpdateProviderDTO";
import type {
    IAdminUpdateProviderServicePayload,
    IGetProviderServicesParams,
} from "../types/providerService";

export const adminServices = {
    async getProviders(query?: object) {
        const url = new URLSearchParams();

        for (let [key, value] of Object.entries(query || {})) {
            if (value !== undefined) {
                url.append(key, String(value));
            }
        }
        return adminApi.getProviders(url.toString());
    },

    async getProvider(id: string) {
        const response = await adminApi.getProvider(id);
        return response;
    },
    async updateProvider(id: string, data: IProviderUpdateData) {
        return adminApi.updateProvider(id, data);
    },

    async getProviderServices(providerId: string, params: IGetProviderServicesParams) {
        return adminApi.getProviderServices(providerId, params);
    },
    async updateProviderService(serviceId: string, data: IAdminUpdateProviderServicePayload) {
        return adminApi.updateProviderService(serviceId, data);
    },
    async blockProviderService(serviceId: string, reason: string) {
        return adminApi.blockProviderService(serviceId, reason);
    },
    async unblockProviderService(serviceId: string) {
        return adminApi.unblockProviderService(serviceId);
    },

    async logout(data: LogoutDTO) {
        const response = await adminApi.logout(data);
        return response;
    },

    async getDocuments(id: string) {
        const response = await adminApi.getDocuments(id);
        return response;
    },
    async getDocumentDisplayUrl(key: string) {
        const response = await adminApi.getDocumentDisplayUrl(key);
        return response;
    },
    async updateDocument(id: string, data: { documentKey?: string; verificationStatus: string; remarks?: string; documentType?: string }) {
        const response = await adminApi.updateDocument(id, data);
        return response;
    },
    async approveProvider(id: string) {
        const response = await adminApi.updateProviderStatus(id, { status: "ACTIVE" });
        return response;
    },
    async rejectProvider(id: string) {
        const response = await adminApi.updateProviderStatus(id, { status: "DRAFT" as any });
        return response;
    },
    async suspendProvider(id: string) {
        const response = await adminApi.updateProviderStatus(id, { status: "BLOCKED" as any });
        return response;
    },
    async unblockProvider(id: string) {
        const response = await adminApi.updateProviderStatus(id, { status: "ACTIVE" });
        return response;
    },

    async getAllCategories(query: GetCategoriesDTO) {
        const response = await adminApi.getAllCategories(query);
        return response;
    },
    async getCategories(query: GetCategoriesDTO) {
        const response = await adminApi.getAllCategories(query);
        return response;
    },
    async createCategory(data: CreateCategoryDTO) {
        const response = await adminApi.createCategory(data);
        return response;
    },
    async updateCategory(categoryId: string, data: EditCategoryFormData) {
        const response = await adminApi.updateCategory(categoryId, data);
        return response;
    },
    async blockCategory(categoryId: string) {
        return adminApi.blockCategory(categoryId);
    },
    async unblockCategory(categoryId: string) {
        return adminApi.unblockCategory(categoryId);
    },
    async toggleCategoryStatus(categoryId: string, currentStatus: "ACTIVE" | "BLOCKED") {
        if (currentStatus === "ACTIVE") {
            return await adminApi.blockCategory(categoryId);
        } else {
            return await adminApi.unblockCategory(categoryId);
        }
    },

    async getAllUsers(data: any) {
        const response = await adminApi.getAllUsers(data.page, data.limit, data.search, data.status, data.isVerified, data.sort, data.sortOrder);
        return response;
    },
    async getUsers(page: number, limit: number, search?: string, status?: string, isVerified?: string, sort?: string, sortOrder?: string) {
        const response = await adminApi.getAllUsers(page, limit, search, status, isVerified, sort, sortOrder);
        return response;
    },
    async updateUser(id: string, data: { name: string; phone?: string }) {
        return adminApi.updateUser(id, data);
    },
    async blockUser(id: string) {
        return adminApi.blockUser(id);
    },
    async unblockUser(id: string) {
        return adminApi.unblockUser(id);
    },
    async toggleUserStatus(id: string, isBlocked: boolean) {
        if (isBlocked) {
            return await adminApi.unblockUser(id);
        } else {
            return await adminApi.blockUser(id);
        }
    }
};
