import { Location, ProviderAvailability } from "../../domain/entities/Provider";
import { ProviderStatus } from "../../domain/enums/ProviderStatus";

export interface PublicProviderServiceItemDTO {
    id: string;
    providerId: string;
    categoryId: string;
    categoryName?: string;
    name: string;
    description: string;
    media: string[];
    mediaUrls: string[];
    onSite: boolean;
    acceptUrgent: boolean;
    instantBooking: boolean;
    serviceRadius: number;
    startingPrice: number;
    pricingType: string;
    isAvailable: boolean;
}

export interface ProviderReviewItemDTO {
    id: string;
    rating: number;
    comment: string;
    reviewedAt: string;
    customerName: string;
    customerPhotoUrl: string | null;
    serviceTitle?: string;
}

export interface OtherProviderSummaryDTO {
    id: string;
    businessName: string;
    categoryId: string;
    categoryName: string;
    location: Location;
    averageRating: number;
    totalReviews: number;
    experience: number;
    status: ProviderStatus;
    profilePhotoUrl: string | null;
}

export interface PublicProviderProfileDTO {
    provider: {
        id: string;
        userId: string;
        businessName: string;
        contactPerson: string;
        serviceCategory: string;
        categoryName: string;
        location: Location;
        serviceRadius: number;
        status: ProviderStatus;
        experience: number;
        averageRating: number;
        totalReviews: number;
        completedJobs: number;
        about?: string;
        availability: ProviderAvailability;
        avgResponseTime: string;
        profilePhotoUrl: string | null;
    };
    services: PublicProviderServiceItemDTO[];
    reviews: ProviderReviewItemDTO[];
    otherProviders: OtherProviderSummaryDTO[];
}
