import z, { email } from "zod";

export const createProviderSchema = z.object({
    userId: z.string().min(1, {
        error:"User ID is required"
    }),
})