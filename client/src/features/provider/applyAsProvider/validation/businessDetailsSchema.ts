import z from "zod";

export const businessDetailsSchema = z
    .object({
        businessName: z
            .string()
            .trim()
            .min(3, "Business name required"),
        contactPerson: z
            .string()
            .trim()
            .min(3, "Contact person required"),
        phone: z
            .string()
            .trim()
            .min(10, "Enter a valid phone number")
            .max(15, "Enter a valid phone number"),
        email: z
            .email("Please enter a valid email")
            .trim(),
        street: z
            .string()
            .trim()
            .min(3, "Please enter a valid street name"),
        city: z
            .string()
            .trim()
            .min(3, "Please enter a valid city"),
        district: z
            .string()
            .trim()
            .min(3, "Please enter a valid district"),
        state: z
            .string()
            .trim()
            .min(2, "Please enter a valid state"),
        pincode: z
            .string()
            .trim()
            .length(6, "Please enter a valid pincode"),    
    })

    export type BusinessDetailsFormData = z.infer<typeof businessDetailsSchema>