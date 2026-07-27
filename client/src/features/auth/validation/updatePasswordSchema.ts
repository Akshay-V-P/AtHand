import {z} from "zod";

export const updatePasswordSchema = z
    .object({
    password: z
            .string()
            .min(8, "Password must be at least 8 characters"),
    })

export type UpdateFormData = z.infer<typeof updatePasswordSchema>
