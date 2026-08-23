import { DocumentVerificationStatus } from "../enums/DocumentVerificationStatus";

export interface IBusinessDetails{
    businessName: string;
    contactPerson: string;
    phone: string;
    email: string;
}

export interface ILocationDetails{
    address: {
        street: string;
        city: string;
        district: string;
        state: string;
        pincode: string;
    },
    coordinates: {
        type: "Point",
        coordinates:[number, number]
    }
}

export interface IServiceDetails{
    serviceCategory: string;
    serviceRadius: number;
}

export interface IDocuments{
    id: string;
    providerId: string;
    documentKey: string;
    documentType: string;
    verificationStatus: DocumentVerificationStatus;
    remarks?: string;
}




export class ProviderDraft{
    constructor(
        public readonly userId: string,
        public readonly businessDetails?: IBusinessDetails,
        public readonly locationDetails?: ILocationDetails,
        public readonly serviceDetails?: IServiceDetails,
        public readonly documents?:IDocuments[] | [],
    ){}
}