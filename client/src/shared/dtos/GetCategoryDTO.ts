import type { CategoryStatus } from "../enums/CategoryStatus";

export interface GetCategoriesDTO {
    page: number;
    limit: number;
    search?: string;
    status?: CategoryStatus;
}