import { z } from "zod";

export const registerSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(3, "Name must be at least 3 characters")
            .regex(/^[A-Za-z\s]+$/, "Name can only contain letters and spaces"),

        email: z
            .email("Please enter a valid email address")
            .trim(),

        phone: z
            .string()
            .regex(/^[6-9]\d{9}$/, "Please enter a valid phone number"),

        password: z
            .string()
            .min(8, "Password must be at least 8 characters"),

        confirmPassword: z
            .string()
            .min(8, "Confirm password is required"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export type RegisterFormData = z.infer<typeof registerSchema>;