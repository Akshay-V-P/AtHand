import { IProviderUpdateData } from "../../application/dtos/UpdateProviderDto";
import { Provider } from "../entities/Provider";
import { ProviderFilter } from "../types/ProviderFilter";

export interface NearbyPublicProviderQuery {
    excludeProviderId: string;
    categoryId?: string;
    coordinates?: [number, number];
    radiusKm?: number;
    limit?: number;
}

export interface IProviderRepository {
    findByEmail(email: string): Promise<Provider | null>;
    findById(id: string): Promise<Provider | null>;
    findPublicById(id: string): Promise<Provider | null>;
    findNearbyPublicProviders(query: NearbyPublicProviderQuery): Promise<Provider[]>;
    findByUserId(userId: string): Promise<Provider | null>;
    findMany(filter?: ProviderFilter): Promise<Provider[]>;
    create(provider: Provider): Promise<Provider>;
    update(id: string, updateData: IProviderUpdateData): Promise<Provider | null>;
    findCount(filter?: ProviderFilter): Promise<number>;
}