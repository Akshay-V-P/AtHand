export interface NearbyProviderDto {
    id: string;
    providerName: string;
    providerRating: number;
    providerTotalReviews: number;
    providerLocation: string;
    distanceKm?: number;
    serviceNames: string[];
    startingPrice: number;
}
