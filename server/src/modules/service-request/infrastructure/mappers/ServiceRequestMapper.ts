import { ServiceRequest } from "../../domain/entities/ServiceRequest";
import { ServiceRequestStatus } from "../../domain/enums/ServiceRequestStatus";
import { ServiceRequestUrgency } from "../../domain/enums/ServiceRequestUrgency";

export class ServiceRequestMapper {
    static toDomain(raw: any): ServiceRequest {
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
            new Date(raw.createdAt)
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
            media: entity.media,
            productBrand: entity.productBrand,
            productModel: entity.productModel,
            status: entity.status,
            preferredDate: entity.preferredDate,
            preferredTimeSlot: entity.preferredTimeSlot
        };
        if (entity.id) {
            doc._id = entity.id;
        }
        return doc;
    }
}
