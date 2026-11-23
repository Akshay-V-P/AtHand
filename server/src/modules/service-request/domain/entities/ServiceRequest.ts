import { ServiceRequestStatus } from "../enums/ServiceRequestStatus";
import { ServiceRequestUrgency } from "../enums/ServiceRequestUrgency";

interface Coordinates {
    type: "Point",
    coordinates: [number, number]
}

type AddressType = {
    houseName: string;
    area: string;
    city: string;
    state: string;
    pincode: string;
    coordinates: Coordinates
}

export interface TargetProviderSummary {
    id: string;
    businessName: string;
    location?: any;
    averageRating?: number;
    totalReviews?: number;
}

export interface TargetServiceSummary {
    id: string;
    name: string;
    startingPrice?: number;
}

export class ServiceRequest {
    constructor(
        public readonly userId: string,
        public readonly categoryId: string,
        public readonly address: AddressType,
        public readonly title: string,
        public readonly description: string,
        public readonly urgency: ServiceRequestUrgency = ServiceRequestUrgency.NORMAL,
        public readonly onSite: boolean,
        public readonly media: string[] = [],
        public readonly productBrand: string,
        public readonly productModel: string,
        public readonly status: ServiceRequestStatus = ServiceRequestStatus.OPEN,
        public readonly preferredDate?: Date,
        public readonly preferredTimeSlot?: string,
        public readonly id?: string,
        public readonly providerId?:string,
        public readonly createdAt?:Date,
        public readonly serviceMode?: string,
        public readonly providerServiceId?: string,
        public readonly targetProvider?: TargetProviderSummary,
        public readonly targetService?: TargetServiceSummary,
        public readonly category?: {
            id: string;
            name: string;
            commissionPercentage: number;
        },
    ) { }
}