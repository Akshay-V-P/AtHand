import { CategoryStatus } from "../../domain/enums/CategoryStatus";

export interface GetCategoriesDTO {
    page: number;
    limit: number;
    search?: string;
    status?: CategoryStatus;
}