import { ObjectId} from "mongoose";
import { ProviderStatus } from "../enums/ProviderStatus";

interface Address{
    street: string,
    city: string,
    district: string,
    state: string,
    pincode: string
}

interface Coordinates{
    type: "Point",
    coordinates:[number, number]
}

export interface Location{
    address: Address;
    coordinates: Coordinates;
}

export class Provider{
    constructor(
        public readonly userId: string,
        public readonly businessName: string,
        public readonly contactPerson: string,
        public readonly phone: string,
        public readonly email: string,
        public readonly serviceCategory: string,
        public readonly location: Location,
        public readonly serviceRadius: number,
        public readonly status: ProviderStatus,
        public readonly experience?: number,
        public readonly averageRating?: number,
        public readonly totalReview?: number,
        public readonly completedJobs?:number,
        public readonly id?: string,

    ){}
}