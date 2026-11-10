import { ProviderService } from "../../domain/entities/ProviderService";
import { PricingType } from "../../domain/enums/PricingType";
import { ProviderServiceStatus } from "../../domain/enums/ProviderServiceStatus";

export class ProviderServiceMapper {
    static toDomain(raw: any): ProviderService {
        const isPopulatedCategory =
            raw.categoryId &&
            typeof raw.categoryId === "object" &&
            "_id" in raw.categoryId;

        const categoryId = isPopulatedCategory
            ? raw.categoryId._id.toString()
            : raw.categoryId.toString();

        const categoryName =
            isPopulatedCategory && "name" in raw.categoryId
                ? raw.categoryId.name
                : undefined;

        return new ProviderService(
            raw.providerId.toString(),
            categoryId,
            raw.name,
            raw.description ?? "",
            raw.media || [],
            raw.onSite,
            raw.acceptUrgent,
            raw.instantBooking,
            raw.serviceRadius,
            raw.startingPrice,
            raw.pricingType as PricingType,
            raw.isAvailable,
            raw.status as ProviderServiceStatus,
            raw._id.toString(),
            raw.blockReason ?? null,
            categoryName,
            raw.createdAt,
            raw.updatedAt
        );
    }
}
