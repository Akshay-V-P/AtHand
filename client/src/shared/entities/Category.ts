import type { CategoryStatus } from "../enums/CategoryStatus";

export interface Category{
    name: string;
    description: string;
    commissionPercentage: number;
    slug: string;
    icon?: string;
    status: CategoryStatus;
    id: string;
}