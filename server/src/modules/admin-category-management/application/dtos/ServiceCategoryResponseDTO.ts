
import { CategoryStatus } from "../../../category/domain/enums/CategoryStatus";

export interface ServiceCategoryResponseDTO{
    id: string;
    name: string;
    description?: string;
    commissionPercentage: number;
    slug?: string;
    icon?: string;
    status: CategoryStatus;
    subCategoryCount: number;
    activeProvidersCount: number;
}