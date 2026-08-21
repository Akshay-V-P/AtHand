import type { ProviderStatus } from "../../enum/ProviderStatus";

export interface IProviderUpdateData {
    businessName?: string,
    contactPerson?: string,
    phone?: string,
    email?: string,
    serviceCategory?: string,
    location?: Location,
    serviceRadius?: number,
    status?: ProviderStatus,
    experience?: number,
    averageRating?: number,
    totalReview?: number,
    completedJobs?: number,
}

export interface UpdateProviderDto {
    id: string;
    updateData: IProviderUpdateData
}