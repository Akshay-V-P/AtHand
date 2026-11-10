import { z } from "zod";

export const editProviderServiceSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Service name must be at least 2 characters")
        .max(120, "Service name must not exceed 120 characters"),
    categoryId: z
        .string()
        .trim()
        .min(1, "Category is required"),
    description: z
        .string()
        .trim()
        .max(2000, "Description must not exceed 2000 characters"),
    pricingType: z.enum(["HOURLY", "FLAT_FEE"]),
    startingPrice: z
        .number({ error: "Starting price is required" })
        .min(0, "Starting price cannot be negative"),
    serviceRadius: z
        .number({ error: "Service radius is required" })
        .min(0, "Service radius cannot be negative")
        .max(500, "Service radius cannot exceed 500 km"),
    onSite: z.boolean(),
    acceptUrgent: z.boolean(),
    instantBooking: z.boolean(),
    isAvailable: z.boolean(),
    status: z.enum(["ACTIVE", "INACTIVE", "BLOCKED"]).optional(),
});

export type EditProviderServiceFormData = z.infer<typeof editProviderServiceSchema>;

export const blockProviderServiceSchema = z.object({
    reason: z
        .string()
        .trim()
        .min(3, "Block reason must be at least 3 characters")
        .max(500, "Block reason must not exceed 500 characters"),
});

export type BlockProviderServiceFormData = z.infer<typeof blockProviderServiceSchema>;
