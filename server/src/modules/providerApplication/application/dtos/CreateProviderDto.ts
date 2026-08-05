import { Location } from "../../domain/entities/Provider";

export interface CreateProviderDto{
    userId: string;
    businessName: string;
    contactPerson: string;
    phone: string;
    email: string;
    serviceCategory: string;
    location: Location;
    serviceRadius: number;
}