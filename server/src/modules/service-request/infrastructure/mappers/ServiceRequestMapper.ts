import { ServiceRequest } from "../../domain/entities/ServiceRequest";
import { ServiceRequestStatus } from "../../domain/enums/ServiceRequestStatus";
import { ServiceRequestUrgency } from "../../domain/enums/ServiceRequestUrgency";

export class ServiceRequestMapper {
    static toDomain(raw: any): ServiceRequest {
        const isPopulatedProvider =
            raw.providerId && typeof raw.providerId === "object" && "_id" in raw.providerId;
        const providerId = isPopulatedProvider
            ? raw.providerId._id.toString()
            : raw.providerId
                ? raw.providerId.toString()
                : undefined;
        const targetProvider = isPopulatedProvider
            ? {
                id: raw.providerId._id.toString(),
                businessName: raw.providerId.businessName,
                location: raw.providerId.location,
                averageRating: raw.providerId.averageRating,
                totalReviews: raw.providerId.totalReviews,
            }
            : undefined;

        const isPopulatedService =
            raw.providerServiceId && typeof raw.providerServiceId === "object" && "_id" in raw.providerServiceId;
        const providerServiceId = isPopulatedService
            ? raw.providerServiceId._id.toString()
            : raw.providerServiceId
                ? raw.providerServiceId.toString()
                : undefined;
        const targetService = isPopulatedService
            ? {
                id: raw.providerServiceId._id.toString(),
                name: raw.providerServiceId.name,
                startingPrice: raw.providerServiceId.startingPrice,
            }
            : undefined;

        return new ServiceRequest(
            raw.userId.toString(),
            raw.categoryId.toString(),
            raw.address,
            raw.title,
            raw.description,
            raw.urgency as ServiceRequestUrgency,
            raw.onSite,
            raw.media,
            raw.productBrand,
            raw.productModel,
            raw.status as ServiceRequestStatus,
            raw.preferredDate,
            raw.preferredTimeSlot,
            raw._id.toString(),
            providerId,
            raw.createdAt ? new Date(raw.createdAt) : undefined,
            raw.serviceMode,
            providerServiceId,
            targetProvider,
            targetService
        );
    }

    static toPersistence(entity: ServiceRequest): any {
        const doc: any = {
            userId: entity.userId,
            categoryId: entity.categoryId,
            address: {
                houseName: entity.address.houseName,
                area: entity.address.area,
                city: entity.address.city,
                state: entity.address.state,
                pincode: entity.address.pincode,
                coordinates: {
                    type: "Point",
                    coordinates: entity.address.coordinates.coordinates
                }
            },
            title: entity.title,
            description: entity.description,
            urgency: entity.urgency,
            onSite: entity.onSite,
            serviceMode: entity.serviceMode || (entity.onSite ? "ONSITE" : "WORKSHOP"),
            media: entity.media,
            productBrand: entity.productBrand,
            productModel: entity.productModel,
            status: entity.status,
            preferredDate: entity.preferredDate,
            preferredTimeSlot: entity.preferredTimeSlot
        };
        if (entity.providerId) {
            doc.providerId = entity.providerId;
        }
        if (entity.providerServiceId) {
            doc.providerServiceId = entity.providerServiceId;
        }
        if (entity.id) {
            doc._id = entity.id;
        }
        return doc;
    }
}
