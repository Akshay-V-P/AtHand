export type ServiceRequestUrgency =
    | "LOW"
    | "NORMAL"
    | "HIGH"
    | "EMERGENCY"


export type ServiceRequestStatus =
    | "OPEN"
    | "QUOTING"
    | "QUOTE_ACCEPTED"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CANCELLED"


export interface AddressType {
    houseName: string;
    area: string;
    city: string;
    state: string;
    pincode: string;
    coordinates: {
        type: "Point",
        coordinates: [number, number]
    };
}

export interface ServiceRequest {
    id: string;
    userId: string;
    categoryId: string;
    address: AddressType;
    title: string;
    description: string;
    urgency: ServiceRequestUrgency;
    onSite: boolean;
    media: string[];
    productBrand: string;
    productModel: string;
    status: ServiceRequestStatus;
    preferredDate?: Date;
    preferredTimeSlot?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateServiceRequestDTO {
    categoryId: string;
    address: AddressType;
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

export interface ServiceRequestPaginatedResponse {
    data: ServiceRequest[];
    total: number;
}
