import { categoryPageApi } from "../apis/categoryPageApi";
import { api } from "../../../../services/axios";


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

export const categoryPageServices = {
    async fetchServicesApi(params: FetchProvidersParams) {
        // Pointing to the new provider-service endpoint
        const response = await api.get('/provider-service/public/nearby', { params })
        return response.data
    },

    async fetchCategories() {
        const response = await categoryPageApi.fetchCategories()
        return response.data
    }

}