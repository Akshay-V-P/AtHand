import mongoose from "mongoose";
import { IUsecase } from "../../../../shared/application/interfaces/IUsecase";
import { NotFoundError } from "../../../../shared/errors/NotFoundError";
import { createDisplayUrl } from "../../../../shared/infrastructure/services/s3.service";
import UserModel from "../../../auth/infrastructure/database/models/UserModel";
import { OrderStatus } from "../../../order/domain/enums/OrderStatus";
import { OrderModel } from "../../../order/infrastructure/database/models/OrderModel";
import { ProviderServiceStatus } from "../../../provider-service/domain/enums/ProviderServiceStatus";
import { IProviderServiceRepository } from "../../../provider-service/domain/repositories/IProviderServiceRepository";
import { ProviderStatus } from "../../domain/enums/ProviderStatus";
import { IProviderRepository } from "../../domain/repositories/IProviderRepository";
import {
    OtherProviderSummaryDTO,
    ProviderReviewItemDTO,
    PublicProviderProfileDTO,
    PublicProviderServiceItemDTO,
} from "../dtos/PublicProviderProfileDTO";

export interface GetPublicProviderProfileInput {
    providerId: string;
    lat?: number;
    lng?: number;
}

const resolveMediaUrl = async (keyOrUrl?: string | null): Promise<string | null> => {
    if (!keyOrUrl) return null;
    if (keyOrUrl.startsWith("http://") || keyOrUrl.startsWith("https://") || keyOrUrl.startsWith("data:")) {
        return keyOrUrl;
    }
    try {
        return await createDisplayUrl(keyOrUrl);
    } catch {
        return null;
    }
};

const extractCategoryInfo = (serviceCategory: any): { id: string; name: string } => {
    if (serviceCategory && typeof serviceCategory === "object") {
        return {
            id: serviceCategory._id?.toString() || serviceCategory.id?.toString() || "",
            name: serviceCategory.name || "Service Provider",
        };
    }
    return {
        id: serviceCategory ? String(serviceCategory) : "",
        name: "Service Provider",
    };
};

export class GetPublicProviderProfileUsecase
    implements IUsecase<GetPublicProviderProfileInput, PublicProviderProfileDTO>
{
    constructor(
        private readonly providerRepository: IProviderRepository,
        private readonly providerServiceRepository: IProviderServiceRepository
    ) {}

    async execute(input: GetPublicProviderProfileInput): Promise<PublicProviderProfileDTO> {
        const provider = await this.providerRepository.findPublicById(input.providerId);
        if (!provider || !provider.id) {
            throw new NotFoundError("Provider not found");
        }

        const isPubliclyVisible =
            provider.status === ProviderStatus.ACTIVE ||
            (provider.status as string) === "APPROVED";

        if (!isPubliclyVisible) {
            throw new NotFoundError("Provider is currently unavailable");
        }

        const categoryInfo = extractCategoryInfo(provider.serviceCategory);
        const providerObjectId = new mongoose.Types.ObjectId(provider.id);

        const hasValidQueryCoords =
            input.lng !== undefined &&
            input.lat !== undefined &&
            !isNaN(input.lng) &&
            !isNaN(input.lat) &&
            Math.abs(input.lng) <= 180 &&
            Math.abs(input.lat) <= 90;

        const providerCoords = provider.location?.coordinates?.coordinates;
        const hasValidProviderCoords =
            Array.isArray(providerCoords) &&
            providerCoords.length === 2 &&
            Math.abs(providerCoords[0]) <= 180 &&
            Math.abs(providerCoords[1]) <= 90;

        const coordinates: [number, number] | undefined = hasValidQueryCoords
            ? [input.lng!, input.lat!]
            : hasValidProviderCoords
                ? providerCoords
                : undefined;

        const [
            servicesResult,
            providerUser,
            reviewedOrders,
            completedOrdersCount,
            nearbyOtherProviders,
        ] = await Promise.all([
            this.providerServiceRepository.findAll({
                page: 1,
                limit: 50,
                providerId: provider.id,
                status: ProviderServiceStatus.ACTIVE,
            }),
            mongoose.Types.ObjectId.isValid(provider.userId)
                ? UserModel.findById(provider.userId).select("profilePhotoUrl name").lean()
                : null,
            OrderModel.find({
                providerId: providerObjectId,
                "review.rating": { $exists: true, $ne: null },
            })
                .sort({ "review.reviewedAt": -1, updatedAt: -1 })
                .limit(50)
                .populate("customerId", "name profilePhotoUrl")
                .populate("requestId", "title")
                .lean(),
            OrderModel.countDocuments({
                providerId: providerObjectId,
                status: OrderStatus.COMPLETED,
            }),
            this.providerRepository.findNearbyPublicProviders({
                excludeProviderId: provider.id,
                categoryId: categoryInfo.id || undefined,
                coordinates,
                radiusKm: 30,
                limit: 6,
            }),
        ]);

        const availableServices = (servicesResult.items || []).filter(
            (service) => service.isAvailable !== false
        );

        const services: PublicProviderServiceItemDTO[] = await Promise.all(
            availableServices.map(async (service) => {
                const resolvedMedia = await Promise.all(
                    (service.media || []).map((key) => resolveMediaUrl(key))
                );
                return {
                    id: service.id || "",
                    providerId: service.providerId,
                    categoryId: service.categoryId,
                    categoryName: service.categoryName,
                    name: service.name,
                    description: service.description || "",
                    media: service.media || [],
                    mediaUrls: resolvedMedia.filter((u): u is string => Boolean(u)),
                    onSite: service.onSite,
                    acceptUrgent: service.acceptUrgent,
                    instantBooking: service.instantBooking,
                    serviceRadius: service.serviceRadius,
                    startingPrice: service.startingPrice,
                    pricingType: service.pricingType,
                    isAvailable: service.isAvailable,
                };
            })
        );

        const reviews: ProviderReviewItemDTO[] = await Promise.all(
            reviewedOrders.map(async (order: any) => {
                const customer = order.customerId;
                const photoUrl = await resolveMediaUrl(customer?.profilePhotoUrl);
                return {
                    id: order._id.toString(),
                    rating: order.review?.rating || 5,
                    comment: order.review?.comment || "",
                    reviewedAt: (order.review?.reviewedAt || order.updatedAt || order.createdAt).toISOString(),
                    customerName: customer?.name || "Verified Customer",
                    customerPhotoUrl: photoUrl,
                    serviceTitle: order.requestId?.title,
                };
            })
        );

        const otherUserIds = nearbyOtherProviders
            .map((p) => p.userId)
            .filter((uid) => mongoose.Types.ObjectId.isValid(uid))
            .map((uid) => new mongoose.Types.ObjectId(uid));

        const otherUsers = otherUserIds.length > 0
            ? await UserModel.find({ _id: { $in: otherUserIds } })
                .select("_id profilePhotoUrl")
                .lean()
            : [];

        const userPhotoMap = new Map<string, string | null>();
        await Promise.all(
            otherUsers.map(async (u: any) => {
                const resolved = await resolveMediaUrl(u.profilePhotoUrl);
                userPhotoMap.set(u._id.toString(), resolved);
            })
        );

        const otherProviders: OtherProviderSummaryDTO[] = nearbyOtherProviders.map((other) => {
            const otherCat = extractCategoryInfo(other.serviceCategory);
            const otherTotalReviews = other.totalReview || 0;
            return {
                id: other.id || "",
                businessName: other.businessName,
                categoryId: otherCat.id,
                categoryName: otherCat.name,
                location: other.location,
                averageRating: otherTotalReviews > 0 ? Number(other.averageRating || 0) : 0,
                totalReviews: otherTotalReviews,
                experience: other.experience || 0,
                status: other.status,
                profilePhotoUrl: userPhotoMap.get(other.userId) ?? null,
            };
        });

        const totalReviews = Math.max(provider.totalReview || 0, reviews.length);
        const computedAvgFromOrders =
            reviews.length > 0
                ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1))
                : 0;
        const averageRating =
            totalReviews > 0
                ? Number((provider.totalReview && provider.averageRating ? provider.averageRating : computedAvgFromOrders).toFixed(1))
                : 0;

        const providerPhotoUrl = await resolveMediaUrl((providerUser as any)?.profilePhotoUrl);

        return {
            provider: {
                id: provider.id,
                userId: provider.userId,
                businessName: provider.businessName,
                contactPerson: provider.contactPerson,
                serviceCategory: categoryInfo.id,
                categoryName: categoryInfo.name,
                location: provider.location,
                serviceRadius: provider.serviceRadius,
                status: provider.status,
                experience: provider.experience || 0,
                averageRating,
                totalReviews,
                completedJobs: Math.max(provider.completedJobs || 0, completedOrdersCount),
                about: provider.about,
                availability: provider.availability || {
                    days: ["M", "T", "W", "T2", "F", "S"],
                    startTime: "9:00 am",
                    endTime: "6:00 pm",
                },
                avgResponseTime: provider.avgResponseTime || "15 Min",
                profilePhotoUrl: providerPhotoUrl,
            },
            services,
            reviews,
            otherProviders,
        };
    }
}
