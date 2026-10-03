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
        public readonly createdAt?:Date
    ) { }
}