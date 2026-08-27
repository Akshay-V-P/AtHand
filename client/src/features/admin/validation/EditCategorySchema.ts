import { z } from "zod";

export const editCategorySchema = z.object({
  categoryName: z
    .string()
    .trim()
    .min(1, "Category name is required")
    .min(2, "Category name must be at least 2 characters"),

  description: z
    .string()
    .trim()
    .min(1, "Description is required"),

  commissionPercentage: z
    .number({
      error: "Commission percentage is required",
    })
    .min(0, "Commission percentage cannot be negative")
    .max(100, "Commission percentage cannot exceed 100"),

  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    ),
});

export type EditCategoryFormData = z.infer<
  typeof editCategorySchema
>;