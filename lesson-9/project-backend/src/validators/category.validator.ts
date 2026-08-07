import { z } from "zod";

export const CreateCategorySchema = z.object({
  name: z.string().min(3).max(100),
});

export type CreateCategoryBody = z.infer<typeof CreateCategorySchema>;
