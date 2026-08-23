import type { ProviderStatus } from "../enum/ProviderStatus";
import type { ILocationDetails } from "./ILocationDetails";

export interface ProviderDetails{
    id?:string,
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