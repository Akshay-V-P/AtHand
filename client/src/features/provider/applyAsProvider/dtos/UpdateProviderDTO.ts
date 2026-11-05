import type { ProviderStatus } from "@/shared/enums/ProviderStatus";
import type { ILocationDetails } from "@/shared/types/ILocationDetails";

export interface IProviderUpdateData {
    businessName?: string;
    contactPerson?: string;
    phone?: string;
    email?: string;
    serviceCategory?: string;
    location?: ILocationDetails;
    serviceRadius?: number;
    status?: ProviderStatus;
    experience?: number;
    averageRating?: number;
    totalReview?: number;
    completedJobs?: number;
}

export interface UpdateProviderDto {
    id: string;
    updateData: IProviderUpdateData;
}
