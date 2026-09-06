import { z } from "zod";

export const addressSchema = z.object({
    label: z.string().min(1, "Label is required (e.g., Home, Work)"),
    houseName: z.string().min(1, "House or building name is required"),
    area: z.string().min(1, "Area or street is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    pincode: z.string().min(1, "Pincode is required").regex(/^\d+$/, "Pincode must be numbers only"),
    isPrimary: z.boolean().optional(),
});

export type AddressFormData = z.infer<typeof addressSchema>;
