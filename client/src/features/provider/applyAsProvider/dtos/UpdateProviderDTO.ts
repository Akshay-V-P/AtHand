import type { ProviderStatus } from "../../enum/ProviderStatus";
import type { ILocationDetails } from "../../intefaces/ILocationDetails";

export interface IProviderUpdateData {
    businessName?: string,
    contactPerson?: string,
    phone?: string,
    email?: string,
    serviceCategory?: string,
    location?: ILocationDetails,
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
