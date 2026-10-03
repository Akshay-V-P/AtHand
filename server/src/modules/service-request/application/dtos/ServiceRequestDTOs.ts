import { ServiceRequestUrgency } from "../../domain/enums/ServiceRequestUrgency";
import { ServiceRequestStatus } from "../../domain/enums/ServiceRequestStatus";

export interface CreateServiceRequestDTO {
    userId: string;
    categoryId: string;
    address: {
        houseName: string;
        area: string;
        city: string;
        state: string;
        pincode: string;
        coordinates: {
            type: "Point";
            coordinates: [number, number];
        };
    };
    title: string;
    description: string;
    urgency?: ServiceRequestUrgency;
    onSite?: boolean;
    media?: string[];
    productBrand?: string;
    productModel?: string;
    preferredDate?: Date;
    preferredTimeSlot?: string;
}

export interface UpdateServiceRequestDTO {
    id: string;
    title?: string;
    description?: string;
    urgency?: ServiceRequestUrgency;
    media?: string[];
    preferredDate?: Date;
    preferredTimeSlot?: string;
}

export interface GetServiceRequestsDTO {
    userId: string;
    page: number;
    limit: number;
    status?: ServiceRequestStatus;
}
