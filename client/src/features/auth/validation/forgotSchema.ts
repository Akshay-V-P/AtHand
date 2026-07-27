import {email, z} from "zod";

export const forgotSchema = z
    .object({
        email: z
            .email("Please enter a valid email")
            .trim(),
    })

export type ForgotFormData = z.infer<typeof forgotSchema>