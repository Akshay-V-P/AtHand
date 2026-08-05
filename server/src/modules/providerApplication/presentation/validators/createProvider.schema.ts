import z, { email } from "zod";

export const createProviderSchema = z.object({
    userId: z.string().min(1, {
        error:"User ID is required"
    }),
    businessName: z.string().min(3, {
        error:"Business name is required"
    }),
    contactPerson: z.string().min(3, {
        error:"Contact person is required"
    }),
    phone: z.string().min(10, {error:"Please provide a valid phone number"}).max(15),
    email: z.email("email is required"),
    serviceCategory: z.string().min(1, {
        error:"Service category is required"
    }),
    serviceRadius: z.number().min(1).max(30),
    location: z.object({
        address: z.object({
            street: z.string().min(1),
            city: z.string().min(1),
            district: z.string().min(1),
            state: z.string().min(1),
            pincode: z.string().min(6).max(6),
        }),

        coordinates: z.object({
            type: z.literal("Point"),

            coordinates: z
                .tuple([
                    z.number().min(-180).max(180), 
                    z.number().min(-90).max(90),   
                ]),
        }),
    }),
})