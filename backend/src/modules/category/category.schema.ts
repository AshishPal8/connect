import z from "zod";

export const interestByCategorySchema = z.object({
  categoryIds: z
    .array(z.number().int().positive())
    .min(1, "At least one category ID is required")
    .max(3, "You can select up to 3 categories"),
});

export type interestByCategoryInput = z.infer<typeof interestByCategorySchema>;
