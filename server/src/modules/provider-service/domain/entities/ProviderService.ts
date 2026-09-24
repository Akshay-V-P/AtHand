import { PricingType } from "../enums/PricingType";
import { ProviderServiceStatus } from "../enums/ProviderServiceStatus";

export class ProviderService {
    constructor(
        public readonly providerId: string,
        public readonly categoryId: string,
        public readonly name: string,
        public readonly description: string,
        public readonly media: string[],
        public readonly onSite: boolean,
        public readonly acceptUrgent: boolean,
        public readonly instantBooking: boolean,
        public readonly serviceRadius: number,
        public readonly startingPrice: number,
        public readonly pricingType: PricingType,
        public readonly isAvailable: boolean,
        public readonly status: ProviderServiceStatus,
        public readonly id?: string,
    ) { }
}
