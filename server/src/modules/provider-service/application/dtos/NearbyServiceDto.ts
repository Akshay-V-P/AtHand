export interface NearbyServiceDto {
    id: string;
    name: string;
    description?: string;
    media: string[];
    startingPrice: number;
    pricingType: string;
    onSite: boolean;
    serviceRadius: number;
    categoryId: string;

    // Provider Details inside the service
    providerId: string;
    providerName: string;
    providerRating: number;
    providerTotalReviews: number;
    providerLocation: string; // Formatting depends on what you extract
    distanceKm?: number; // Fetched from geoNear 
}
