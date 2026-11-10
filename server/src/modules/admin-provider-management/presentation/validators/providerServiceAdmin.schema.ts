import { z } from "zod";
import { PricingType } from "../../../provider-service/domain/enums/PricingType";
import { ProviderServiceStatus } from "../../../provider-service/domain/enums/ProviderServiceStatus";

export const adminUpdateProviderServiceSchema = z.object({
    name: z.string().trim().min(2, "Service name must be at least 2 characters").max(120, "Service name must not exceed 120 characters").optional(),
    categoryId: z.string().trim().min(1, "Category is required").optional(),
    description: z.string().trim().max(2000, "Description must not exceed 2000 characters").optional(),
    startingPrice: z.number({ message: "Starting price must be a number" }).min(0, "Starting price cannot be negative").optional(),
    pricingType: z.enum([PricingType.HOURLY, PricingType.FLAT_FEE]).optional(),
    serviceRadius: z.number({ message: "Service radius must be a number" }).min(0, "Service radius cannot be negative").max(500, "Service radius must not exceed 500 km").optional(),
    onSite: z.boolean().optional(),
    acceptUrgent: z.boolean().optional(),
    instantBooking: z.boolean().optional(),
    isAvailable: z.boolean().optional(),
    status: z.enum([ProviderServiceStatus.ACTIVE, ProviderServiceStatus.INACTIVE]).optional(),
    media: z.array(z.string().trim().min(1)).optional(),
}).strict();

export const blockProviderServiceSchema = z.object({
    reason: z.string().trim()
        .min(3, "Block reason must be at least 3 characters")
        .max(500, "Block reason must not exceed 500 characters"),
}).strict();
