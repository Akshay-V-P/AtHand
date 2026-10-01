import { ServiceRequestStatus } from "../enums/ServiceRequestStatus";
import { ServiceRequestUrgency } from "../enums/ServiceRequestUrgency";

type AddressType = {
    houseName: string;
}

export class ServiceRequest{
    constructor(
        private readonly userId:string,
        private readonly categoryId: string,
        private readonly address: AddressType,
        private readonly title: string,
        private readonly description: string,
        private readonly urgency: ServiceRequestUrgency = ServiceRequestUrgency.NORMAL,
        private readonly onSite: boolean,
        private readonly media: string[] = [],
        private readonly productBrand: string,
        private readonly productModel: string,
        private readonly status: ServiceRequestStatus = ServiceRequestStatus.OPEN,
        private readonly preferredDate?: Date,
        private readonly preferredTimeSlot?: string,
        private readonly id?:string
    ){}
}