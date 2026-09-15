
import { categoryPageApi } from "../apis/categoryPageApi";


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
    async fetchProvidersApi(params: FetchProvidersParams) {
        const response = await categoryPageApi.fetchProvider({ params })
        return response.data
    },

    async fetchCategories() {
        const response = await categoryPageApi.fetchCategories()
        return response.data
    }

}