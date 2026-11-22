import { categoryApi } from "../api/categoryApi";
import { api } from "@/services/axios";

export interface FetchProvidersParams {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    minRating?: number;
    sort?: string;
    sortOrder?: 'asc' | 'desc';
    lat?: number | null;
    lng?: number | null;
    radius?: number;
}

export interface ProviderAddressInfo {
    street?: string;
    city?: string;
    district?: string;
    state?: string;
    pincode?: string;
}

export interface ProviderLocationInfo {
    address?: ProviderAddressInfo;
    coordinates?: {
        type: 'Point';
        coordinates: [number, number];
    };
}

export interface PublicProviderInfo {
    id: string;
    userId: string;
    businessName: string;
    contactPerson: string;
    serviceCategory: string;
    categoryName: string;
    location: ProviderLocationInfo;
    serviceRadius: number;
    status: string;
    experience: number;
    averageRating: number;
    totalReviews: number;
    completedJobs: number;
    about?: string;
    availability?: {
        days: string[];
        startTime: string;
        endTime: string;
    };
    avgResponseTime?: string;
    profilePhotoUrl: string | null;
}

export interface PublicProviderServiceItem {
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

export interface ProviderReviewItem {
    id: string;
    rating: number;
    comment: string;
    reviewedAt: string;
    customerName: string;
    customerPhotoUrl: string | null;
    serviceTitle?: string;
}

export interface OtherProviderSummary {
    id: string;
    businessName: string;
    categoryId: string;
    categoryName: string;
    location: ProviderLocationInfo;
    averageRating: number;
    totalReviews: number;
    experience: number;
    status: string;
    profilePhotoUrl: string | null;
}

export interface PublicProviderProfileData {
    provider: PublicProviderInfo;
    services: PublicProviderServiceItem[];
    reviews: ProviderReviewItem[];
    otherProviders: OtherProviderSummary[];
}

export const categoryServices = {
    async fetchServicesApi(params: FetchProvidersParams) {
        // Pointing to the new provider-service endpoint
        const response = await api.get('/provider-service/public/nearby', { params });
        return response.data;
    },

    async fetchProviderProfile(id: string, params?: { lat?: number; lng?: number }) {
        const response = await categoryApi.fetchProviderProfile(id, params);
        return response.data as {
            success: boolean;
            message: string;
            data: PublicProviderProfileData;
        };
    },

    async fetchCategories() {
        const response = await categoryApi.fetchCategories();
        return response.data;
    }
};
