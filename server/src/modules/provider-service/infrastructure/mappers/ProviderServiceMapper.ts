import { ProviderService } from "../../domain/entities/ProviderService";
import { PricingType } from "../../domain/enums/PricingType";
import { ProviderServiceStatus } from "../../domain/enums/ProviderServiceStatus";

export class ProviderServiceMapper {
    static toDomain(raw: any): ProviderService {
        return new ProviderService(
            raw.providerId.toString(),
            raw.categoryId.toString(),
            raw.name,
            raw.description,
            raw.media || [],
            raw.onSite,
            raw.acceptUrgent,
            raw.instantBooking,
            raw.serviceRadius,
            raw.startingPrice,
            raw.pricingType as PricingType,
            raw.isAvailable,
            raw.status as ProviderServiceStatus,
            raw._id.toString()
        );
    }
}
