import { CategoryStatus } from "../../domain/enums/CategoryStatus";

export interface CategoryResponseDTO {
    id: string;
    name: string;
    description: string;
    commissionPercentage: number;
    slug: string;
    icon: string;
    status: CategoryStatus;
}